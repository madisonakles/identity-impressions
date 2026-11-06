import {
  USC_PRIMES, LEACH_USC_ITEMS, LEACH_COMPONENTS,
  USC_IDENTIFICATION_CONTENT, makeUscPrimeSurvey
} from "./usc-study-content.js";

function copyJson(value) { return JSON.parse(JSON.stringify(value)); }

function assertPermutation(before, after, key, label) {
  const getKeys = items => items.map(key).sort();
  if (!Array.isArray(after) || JSON.stringify(getKeys(before)) !== JSON.stringify(getKeys(after))) {
    throw new Error(`The ${label} shuffle must return every item exactly once.`);
  }
}

// Calls shuffle separately for primes and videos. There is no fixed pairing.
export function makeFourRoundPlan(videos, shuffle) {
  if (!Array.isArray(videos) || videos.length !== 4) {
    throw new Error("The four-round task needs exactly 4 selected main videos. Set one video list's selectionNum to 4 and list four main filenames in config.js.");
  }
  if (videos.some(v => typeof v.video !== "string" || !v.video.trim())) {
    throw new Error("Each main video must have a nonempty video path from utils.setupMedia().");
  }
  const normalizedVideos = videos.map(v => ({
    ...v,
    video_id: v.video_id ?? v.video.split("/").pop().replace(/\.mp4$/i, ""),
    list_name: v.list_name ?? "main"
  }));
  if (new Set(normalizedVideos.map(v => v.video)).size !== 4 || new Set(normalizedVideos.map(v => String(v.video_id))).size !== 4) {
    throw new Error("Use four different main video files with unique video IDs.");
  }
  const primeOrder = shuffle([...USC_PRIMES]);
  const videoOrder = shuffle([...normalizedVideos]);
  assertPermutation(USC_PRIMES, primeOrder, p => p.id, "prime");
  assertPermutation(normalizedVideos, videoOrder, v => v.video, "video");
  return videoOrder.map((video, index) => ({round: index + 1, prime: primeOrder[index], video}));
}

function readResponse(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value === "string") {
    try { const parsed = JSON.parse(value); return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {}; }
    catch { return {}; }
  }
  return {};
}

// Store raw numeric values plus five component means in the questionnaire's row.
// Invalid or missing values are null, never silently converted to zero.
// No global identification composite or latent factor scores are imposed.
export function scoreLeachUsc(response) {
  const answers = readResponse(response);
  const scores = {};
  let answered = 0;
  for (const item of LEACH_USC_ITEMS) {
    const raw = answers[item.id];
    const value = typeof raw === "number" ? raw : typeof raw === "string" && /^[1-7]$/.test(raw) ? Number(raw) : NaN;
    const valid = Number.isInteger(value) && value >= 1 && value <= 7;
    scores[item.id] = valid ? value : null;
    if (valid) answered++;
  }
  scores.USC_identification_n_answered = answered;
  scores.USC_identification_complete = answered === 14;
  for (const [component, numbers] of Object.entries(LEACH_COMPONENTS)) {
    const values = numbers.map(n => scores[`USC_identification_${String(n).padStart(2, "0")}`]);
    scores[`USC_identification_${component}_mean`] = values.every(v => v !== null)
      ? values.reduce((sum, v) => sum + v, 0) / values.length : null;
  }
  return scores;
}

export function buildUscFourRoundExtension({
  jsPsych, condition, videoTimelineVariables, videoTrial, ratingTrial,
  checkFullscreen, surveyPlugin = globalThis.jsPsychSurvey
}) {
  if (!["usc_prime", "control"].includes(condition)) {
    throw new Error('Condition must be "usc_prime" or "control". Reuse your one participant-level assignment in main.js.');
  }
  if (!surveyPlugin || !videoTrial || !ratingTrial || typeof checkFullscreen !== "function") {
    throw new Error("Pass the template's existing videoTrial, ratingTrial, checkFullscreen, and jsPsychSurvey plugin.");
  }
  const plan = makeFourRoundPlan(videoTimelineVariables, values => jsPsych.randomization.shuffle(values));
  const primeShown = condition === "usc_prime";
  const planForData = plan.map(({round, prime, video}) => ({
    round, planned_prime_id: prime.id, presented_prime_id: primeShown ? prime.id : null,
    video_id: video.video_id, video_path: video.video
  }));
  jsPsych.data.addProperties({
    condition,
    task_design_version: "USC_four_rounds_v1",
    task_run_id: jsPsych.randomization.randomID(16),
    main_trial_count: 4,
    prime_order_planned: JSON.stringify(plan.map(r => r.prime.id)),
    prime_order_presented: JSON.stringify(primeShown ? plan.map(r => r.prime.id) : []),
    video_order: JSON.stringify(plan.map(r => r.video.video_id)),
    round_pairings: JSON.stringify(planForData)
  });
  const roundTrials = [];
  for (const {round, prime, video} of plan) {
    const metadata = {
      round, video_id: video.video_id, list_name: video.list_name,
      planned_prime_id: prime.id, prime_id: primeShown ? prime.id : null,
      prime_presented: primeShown, condition
    };
    const fullscreenNode = checkFullscreen();
    fullscreenNode.data = {...(fullscreenNode.data ?? {}), ...metadata};
    roundTrials.push(fullscreenNode);
    if (primeShown) {
      roundTrials.push({
        type: surveyPlugin,
        survey_json: makeUscPrimeSurvey(prime),
        data: {...metadata, trial_name: "usc_identity_prime", prime_is_placeholder: Boolean(prime.isPlaceholder)},
        on_finish(data) {
          data.prime_response = readResponse(data.response).prime_response ?? null;
        }
      });
    }
    // Explicit video paths replace the old timeline-variable placeholders here.
    roundTrials.push({
      ...videoTrial, video: video.video,
      data: {...(videoTrial.data ?? {}), ...metadata, trial_name: "video"}
    });
    roundTrials.push({
      ...ratingTrial,
      data: {...(ratingTrial.data ?? {}), ...metadata, trial_name: "ratings"}
    });
  }
  const identificationTrial = {
    type: surveyPlugin,
    survey_json: copyJson(USC_IDENTIFICATION_CONTENT),
    data: {
      trial_name: "USC_identification", assessment_time: "after_all_four_rounds",
      questionnaire: "Leach_2008_USC_referent_adaptation",
      questionnaire_version: "1.0", item_count: 14, response_min: 1, response_max: 7,
      condition
    },
    on_finish(data) { Object.assign(data, scoreLeachUsc(data.response)); }
  };
  return {roundTrials, identificationTrial, plan: planForData};
}
