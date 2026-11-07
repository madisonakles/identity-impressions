// --- Screener ---
export const screenerContent = {
    title: "Welcome to the experiment!",
    elements:
        [
            {
                type: "html",
                name: "instructions",
                html: "<p>Please answer the following questions to determine your eligibility.</p>",
            },
            {
                type: "radiogroup",
                name: "english",
                title: "Are you fluent in English?",
                choices: ["Yes", "No"],
                isRequired: true
            },
            {
                type: "radiogroup",
                name: "attention_check",
                title: "Please read the following instructions carefully",
                description: "Recent research on decision making has shown that choices are affected by political party affiliation. To help us understand how people from different backgrounds make decisions, we are interested in information about you. Specifically, we want to know if you actually read any of the instructions we give at the beginning of our survey; if not, some results may not tell us very much about decision making and perception in the real world. To show that you have read the instructions, please ignore the questions about political party affiliation below and simply select \"Other\" at the bottom.",
                choices: ["Democratic", "Republican", "Independent", "Libertarian", "Green Party", "Other"],
                isRequired: true
            }
        ],
    completeText: "Continue",
};

// --- Traits List ---
const traits = [
    // name = name used in data, title = name shown in study, def = definition shown in instructions and tooltips
    { name: "openness", title: "Open to new experiences", def: "willingness to try new things and to explore new ideas" },
    { name: "conscientiousness", title: "Conscientious", def: "extent to which the person seems organized, hardworking, and goal-oriented" },
    { name: "extraversion", title: "Extroverted", def: "extent to which the person seems energized by social interaction and enjoys being around other people" },
    { name: "agreeableness", title: "Agreeable", def: "extent to which the person seems cooperative, kind, and trusting" },
    { name: "neuroticism", title: "Neurotic", def: "extent to which the person seems prone to negative emotions such as anxiety, anger, and sadness" },
    { name: "warmth", title: "Warm", def: "extent to which the person seems friendly, approachable, and likeable" },
    { name: "competence", title: "Competent", def: "extent to which the person seems capable, skilled, and knowledgeable" },
];

// --- Instructions ---
export const instructionsContent = {
    title: "Instructions",
    pages: [
        {
            title: "Welcome to the Experiment",
            elements: [
                {
                    type: "html",
                    html: `
                        <p>Thank you for participating in our experiment!</p>
                        <p>We are researchers interested in how we understand other people.</p>
                        <p>Your job today is simple. <b>There are three parts to our task.</b></p>
                        <div class="callout-box">
                            <ol class="bold-numbers">
                                <li>View videos and type your impressions of the speaker.</li>
                                <li>Form a final impression of the speaker in the video.</li>
                                <li>Rate the speaker on several attributes.</li>
                            </ol>
                        </div>
                        <p>You will repeat these steps for each video.</p>
                        <p>In the next few pages, you will learn more about each step of the experiment.</p>
                    `
                }
            ]
        },
        {
            title: "Step 1: Watch and describe the speaker in the video",
            elements: [
                {
                    type: "html",
                    html: `
                        <video width="100%" autoplay loop muted src="assets/instruct/submitting.mp4"></video>
                        <p>Pause the video whenever you <b>notice a new characteristic</b> about the person or think of a <b>new way to describe them.</b> Pause by clicking anywhere on the video or pressing the spacebar.</p>
                        <p><b>Enter one word at a time</b>, but you can enter multiple words each time you pause (see video). For example, if you feel like the person is being an annoying student, pause and enter “annoying” and “student” separately. Order does not matter. You can remove words before submitting by clicking the "X" next to the word.</p>
                        <p>Enter whatever comes to mind spontaneously. There are no limits on what you enter! We only ask that you <b>pause and describe the person multiple times.</b></p>
                        <p>Based on past experience, <b>we expect you will pause 2-5 times per video.</b> Please note there is a minimum amount of time that needs to pass between each time you pause the video (2 seconds).</p>
                    `
                }
            ]
        },
        {
            title: "Step 2: Form a final impression",
            elements: [
                {
                    type: "html",
                    html: `
                        <video width="100%" autoplay loop muted src="assets/instruct/final.mp4"></video>
                        <p>Form your final impression of the speaker. <b>Think of this as a list of words you'd use to describe this person to someone else, your summary impression of a person.</b> Once again, enter one word at a time, for as many words as you"d like.</p>
                    `
                }
            ]
        },
        {
            title: "Step 3: Rate the speaker on several attributes",
            elements: [
                {
                    type: "html",
                    html: `
                        <video width="100%" autoplay loop muted src="assets/instruct/rating.mp4"></video>
                        <p>Once you finish watching the video, you will rate the speaker in the video on several attributes using sliders. <b>Please go with your gut feelings, and don't overthink it.</b> You will be evaluating the speaker on these attributes:</p>
                        <p><b>Please read the category descriptions carefully below:</b></p>
                        <div class="callout-box">
                            <ul>
                                ${traits.map(trait => `<li><b>${trait.title}:</b> ${trait.def}</li>`).join('')}
                            </ul>
                        </div>
                    `
                }
            ]
        }
    ],
    completeText: "Continue",
};

// --- Audio Check ---
export const audioCheckContent = {
    title: "Audio Check",
    elements: [
        {
            type: "panel",
            elements: [
                {
                    type: "html",
                    html: `<p>In the audio clip below, you will hear a sequence of five numbers. Please type those numbers in the box to continue.<p style="color: red">Please make sure your sound is on.</p><audio controls src="assets/audiocheck.wav"></audio>`
                },
                {
                    type: "text",
                    name: "audio_check",
                    title: "Press play and enter the numbers you hear.",
                    inputType: "number",
                    isRequired: true,
                    validators: [
                        {
                            type: "expression",
                            text: "Incorrect. Please listen carefully and try again.",
                            expression: "{audio_check} == 42359"
                        }
                    ]
                },
            ]
        }
    ],
    completeText: "Continue",
};

// --- Rating Impressions ---

// Dynamically builds sliders based on the traits list
const traitSliders = traits.map(trait => ({
    type: "slider",
    name: trait.name,
    title: `${trait.title} <span class="tooltip-wrapper">🛈<span class="tooltip-box">${trait.def}</span></span>`,
    min: 0,
    max: 10,
    defaultValue: 5,
    tooltipVisibility: "never",
    customLabels: [
        {
            value: 0,
            text: "Least",
            showValue: true
        },
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        {
            value: 10,
            text: "Most",
            showValue: true
        }
    ]
}));

export const ratingContent = {
    autoAdvanceEnabled: true,
    pages: [
        {
            title: "Rating Impressions",
            elements:
                [
                    {
                        type: "html",
                        name: "instructions",
                        html: "<p>Rate the person in the video on the following parameters.</p>"
                    },
                    ...traitSliders
                ]
        }
    ],
    completeText: "Continue",
};

// --- Demographics ---

export const demographicsContent = {
    title: "Demographics",
    showQuestionNumbers: "off",
    showProgressBar: "off",
    widthMode: "responsive",
    pageNextText: "Continue",
    completeText: "Continue",

    pages: [
        {
            name: "demographics_page",

            elements: [
                {
                    type: "text",
                    name: "age",
                    title: "How old are you? (Please enter a numeric value)",
                    inputType: "number",
                    isRequired: true,

                    validators: [
                        {
                            type: "numeric",
                            text: "Please enter a numeric age."
                        }
                    ]
                },

                {
                    type: "radiogroup",
                    name: "gender",
                    title: "What is your gender?",
                    isRequired: true,
                    colCount: 1,

                    choices: [
                        "Female",
                        "Male",
                        "Non-binary",
                        "Prefer not to say"
                    ]
                },

                {
                    type: "radiogroup",
                    name: "year",
                    title: "What year are you in college?",
                    isRequired: true,
                    colCount: 1,

                    choices: [
                        "First year",
                        "Second year",
                        "Third year",
                        "Fourth year",
                        "Fifth year or beyond",
                        "Graduate student",
                        {
                            value: "other",
                            text: "Other (please specify)"
                        }
                    ]
                },

                {
                    type: "text",
                    name: "year_other",
                    title: "Other (please specify):",
                    visibleIf: "{year} = 'other'",
                    isRequired: true,

                    validators: [
                        {
                            type: "regex",
                            regex: "\\S",
                            text: "Please specify your year in college."
                        }
                    ]
                },

                {
                    type: "checkbox",
                    name: "race",

                    title:
                        "Please indicate your racial/ethnic affiliation (check all that apply):",

                    isRequired: true,
                    colCount: 1,

                    choices: [
                        "American Indian or Alaska Native",
                        "Black or African American",
                        "East Asian",
                        "Hispanic or Latino/a",
                        "Middle Eastern",
                        "Pacific Islander or Native Hawaiian",
                        "South Asian",
                        "White or Caucasian",
                        "Other",
                        "Prefer not to say"
                    ]
                },

                {
                    type: "radiogroup",
                    name: "poli_orient",

                    title:
                        "How would you describe your political orientation, generally speaking?",

                    isRequired: true,
                    colCount: 0,

                    choices: [
                        { value: 1, text: "Very liberal" },
                        { value: 2, text: "Liberal" },
                        { value: 3, text: "Somewhat liberal" },
                        { value: 4, text: "Moderate" },
                        { value: 5, text: "Somewhat conservative" },
                        { value: 6, text: "Conservative" },
                        { value: 7, text: "Very conservative" }
                    ]
                },

                {
                    type: "radiogroup",
                    name: "attention",

                    title:
                        "To what extent did you pay attention to the questions in this survey?",

                    isRequired: true,
                    colCount: 0,

                    choices: [
                        { value: 1, text: "1. Not at all" },
                        { value: 2, text: "2." },
                        { value: 3, text: "3." },
                        { value: 4, text: "4. Moderate attention" },
                        { value: 5, text: "5." },
                        { value: 6, text: "6." },
                        { value: 7, text: "7. Full attention" }
                    ]
                }
            ]
        },

        {
            name: "feedback_page",

            elements: [
                {
                    type: "comment",
                    name: "feedback",

                    title:
                        "Thank you for completing the study! Please feel free to share any thoughts or comments below:",

                    rows: 6,
                    isRequired: false
                }
            ]
        }
    ]
};



// --- Completion ---
export const completionContent = {
    title: "Study Completed",
    completeText: "Click here to return to Prolific",
    elements:
        [
            {
                type: "html",
                name: "completion",
                html: "<p>Thank you for participating in the study!</p>",
            }
        ]
};

export const uscPrimeContent = {
  title: "Brief reflection",
  showQuestionNumbers: "off",
  completeText: "Continue",
  pages: [
    {
      elements: [
        {
          type: "comment",
          name: "usc_identity_response",
          title: "[USC identity-prime instructions here.]",
          isRequired: true
        }
      ]
    }
  ]
};
