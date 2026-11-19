import {
  USC_PRIMES, CONTROL_PRIMES, LEACH_USC_ITEMS, LEACH_COMPONENTS,
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
export function makeFourRoundPlan(videos, shuffle, condition = "usc_prime") {
  if (!["usc_prime", "control"].includes(condition)) {
    throw new Error('Condition must be "usc_prime" or "control".');
  }
  if (!Array.isArray(videos) || videos.length !== 8) {
    throw new Error("The four-round task needs exactly 8 selected main videos. Set one video list's selectionNum to 8 and list eight main filenames in config.js.");
  }
  if (typeof shuffle !== "function") {
    throw new Error("Pass a shuffle function for the independent prime and video orders.");
  }
  if (videos.some(v => !v || typeof v.video !== "string" || !v.video.trim())) {
    throw new Error("Each main video must have a nonempty video path from utils.setupMedia().");
  }
  if (videos.some(v => /REPLACE_WITH_VIDEO_/i.test(v.video))) {
    throw new Error("Replace the four additional video filename placeholders in js/config.js with real filenames from assets/stimuli before running the study.");
  }
  const normalizedVideos = videos.map(v => ({
    ...v,
    video_id: v.video_id ?? v.video.split("/").pop().replace(/\.mp4$/i, ""),
    list_name: v.list_name ?? "main"
  }));
  if (new Set(normalizedVideos.map(v => v.video)).size !== 8 || new Set(normalizedVideos.map(v => String(v.video_id))).size !== 8) {
    throw new Error("Use eight different main video files with unique video IDs.");
  }
  const primes = condition === "usc_prime" ? USC_PRIMES : CONTROL_PRIMES;
  const primeOrder = shuffle([...primes]);
  const videoOrder = shuffle([...normalizedVideos]);
  assertPermutation(primes, primeOrder, p => p.id, "prime");
  assertPermutation(normalizedVideos, videoOrder, v => v.video, "video");
  return primeOrder.map((prime, index) => ({
    round: index + 1,
    prime,
    videos: videoOrder.slice(index * 2, index * 2 + 2)
  }));
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
    const parsed = readResponse(response);

    const answers = parsed.USC_identification_matrix != null
        ? readResponse(parsed.USC_identification_matrix)
        : parsed;

    const scores = {};
    let answered = 0;

    for (const item of LEACH_USC_ITEMS) {
        const raw = answers[item.id];

        const value =
            typeof raw === "number"
                ? raw
                : typeof raw === "string" && /^[1-5]$/.test(raw)
                  ? Number(raw)
                  : NaN;

        const valid =
            Number.isInteger(value) &&
            value >= 1 &&
            value <= 5;

        scores[item.id] = valid ? value : null;

        if (valid) answered++;
    }

    scores.USC_identification_n_answered = answered;
    scores.USC_identification_complete = answered === 14;

    for (const [component, numbers] of Object.entries(LEACH_COMPONENTS)) {
        const values = numbers.map(number =>
            scores[
                `USC_identification_${String(number).padStart(2, "0")}`
            ]
        );

        scores[`USC_identification_${component}_mean`] =
            values.every(value => value !== null)
                ? values.reduce((sum, value) => sum + value, 0) /
                  values.length
                : null;
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
  const plan = makeFourRoundPlan(videoTimelineVariables, values => jsPsych.randomization.shuffle(values), condition);
  const isIdentityCondition = condition === "usc_prime";
  const planForData = plan.map(({round, prime, videos}) => ({
    round,
    planned_prime_id: prime.id,
    presented_prime_id: prime.id,
    prime_type: isIdentityCondition ? "usc_identity" : "control",
    prime_is_placeholder: Boolean(prime.isPlaceholder),
    videos: videos.map((video, index) => ({
      video_id: video.video_id,
      video_path: video.video,
      video_position_in_round: index + 1,
      video_sequence_number: (round - 1) * 2 + index + 1
    }))
  }));
  jsPsych.data.addProperties({
    condition,
    task_design_version: "USC_four_rounds_eight_videos_v2",
    task_run_id: jsPsych.randomization.randomID(16),
    main_trial_count: 8,
    prime_count: 4,
    videos_per_round: 2,
    prime_order_planned: JSON.stringify(plan.map(r => r.prime.id)),
    prime_order_presented: JSON.stringify(plan.map(r => r.prime.id)),
    video_order: JSON.stringify(plan.flatMap(r => r.videos.map(v => v.video_id))),
    round_pairings: JSON.stringify(planForData)
  });
  const roundTrials = [];
  for (const {round, prime, videos} of plan) {
    const metadata = {
      round,
      planned_prime_id: prime.id,
      prime_id: prime.id,
      prime_presented: true,
      identity_prime_presented: isIdentityCondition,
      prime_type: isIdentityCondition ? "usc_identity" : "control",
      prime_is_placeholder: Boolean(prime.isPlaceholder),
      round_video_ids: JSON.stringify(videos.map(v => v.video_id)),
      condition
    };
    const fullscreenNode = checkFullscreen();
    fullscreenNode.data = {...(fullscreenNode.data ?? {}), ...metadata};
    roundTrials.push(fullscreenNode);
    roundTrials.push({
      type: surveyPlugin,
      survey_json: makeUscPrimeSurvey(prime, { showUscLogo: isIdentityCondition }),
      data: {...metadata, trial_name: isIdentityCondition ? "usc_identity_prime" : "control_prime"},
      on_finish(data) {
        const response = readResponse(data.response);
        data.prime_response = response.prime_response ?? null;
        data.prime_responses_json = JSON.stringify(response);
      }
    });
    for (const [index, video] of videos.entries()) {
      const videoMetadata = {
        ...metadata,
        video_id: video.video_id,
        list_name: video.list_name,
        video_position_in_round: index + 1,
        video_sequence_number: (round - 1) * 2 + index + 1
      };
      // Explicit paths preserve the existing video-description and rating trials.
      roundTrials.push({
        ...videoTrial, video: video.video,
        data: {...(videoTrial.data ?? {}), ...videoMetadata, trial_name: "video"}
      });
      roundTrials.push({
        ...ratingTrial,
        data: {...(ratingTrial.data ?? {}), ...videoMetadata, trial_name: "ratings"}
      });
    }
  }
    const identificationTrial = {
        type: surveyPlugin,
        survey_json: copyJson(USC_IDENTIFICATION_CONTENT),

        // Require every row with either current or older SurveyJS.
               survey_function: function (survey) {
            survey.widthMode = "responsive";
            survey.width = "100%";

            const matrix = survey.getQuestionByName(
                "USC_identification_matrix"
            );

            if (!matrix) return;

            matrix.width = "100%";
            matrix.rowTitleWidth = "40%";
            matrix.columnMinWidth = "0px";

            if ("eachRowRequired" in matrix) {
                matrix.eachRowRequired = true;
            } else {
                matrix.isAllRowRequired = true;
            }

            survey.onAfterRenderQuestion.add(function (sender, options) {
                if (
                    options.question.name !==
                    "USC_identification_matrix"
                ) return;

                const root = options.htmlElement;
                root.classList.add("usc-identification-fit");

                const doc = root.ownerDocument;

                if (
                    doc.getElementById("usc-identification-fit-style")
                ) return;

                const style = doc.createElement("style");
                style.id = "usc-identification-fit-style";

                style.textContent = `
                    .usc-identification-fit {
                        min-width: 0 !important;
                        max-width: 100% !important;
                        box-sizing: border-box;
                    }

                    .usc-identification-fit table {
                        width: 100% !important;
                        min-width: 0 !important;
                        max-width: 100% !important;
                        table-layout: fixed !important;
                    }

                    .usc-identification-fit th,
                    .usc-identification-fit td {
                        min-width: 0 !important;
                        padding: 8px 6px !important;
                        white-space: normal !important;
                        overflow-wrap: anywhere;
                    }

                    .usc-identification-fit tr > :first-child,
                    .usc-identification-fit col:first-child {
                        width: 40% !important;
                    }

                    .usc-identification-fit tr > :not(:first-child),
                    .usc-identification-fit col:not(:first-child) {
                        width: 12% !important;
                    }

                    .usc-identification-fit .sv-string-viewer {
                        white-space: normal !important;
                        overflow-wrap: anywhere;
                    }
                `;

                doc.head.append(style);
            });
        },
        data: {
            trial_name: "USC_identification",
            assessment_time: "after_all_four_rounds",
            questionnaire: "Leach_2008_USC_referent_adaptation",
            questionnaire_version: "USC_5point_matrix_v2",
            item_count: 14,
            response_min: 1,
            response_max: 5,

            item_display_order: JSON.stringify(
                LEACH_USC_ITEMS.map(item => item.id)
            ),

            condition: condition
        },

        on_finish: function (data) {
            Object.assign(data, scoreLeachUsc(data.response));
        }
    };

    return {
        roundTrials,
        identificationTrial,
        plan: planForData
    };
}

