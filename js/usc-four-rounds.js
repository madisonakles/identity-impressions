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
