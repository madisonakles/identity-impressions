// --- USC logo ---
export const USC_LOGO_PATH = "assets/usc-logo.png";


// --- Four USC identity primes ---

export const USC_PRIMES = [
    {
        id: "USC_prime_01",
        instructions:
            "We are interested in learning about you as a USC student, please answer the following questions to help us learn more information about USC students.",
        isPlaceholder: false
    },
    {
        id: "USC_prime_02",
        instructions:
            "[PLACEHOLDER: Paste USC identity-prime 2 instructions here.]",
        isPlaceholder: true
    },
    {
        id: "USC_prime_03",
        instructions:
            "[PLACEHOLDER: Paste USC identity-prime 3 instructions here.]",
        isPlaceholder: true
    },
    {
        id: "USC_prime_04",
        instructions:
            "[PLACEHOLDER: Paste USC identity-prime 4 instructions here.]",
        isPlaceholder: true
    }
];


// --- USC identification: 14-item Leach scale adaptation ---


// Display order and wording match your screenshot.
// Internal IDs stay attached to their original statements.
export const LEACH_USC_ITEMS = [
    {
        id: "USC_identification_01",
        component: "solidarity",
        text: "I feel a bond with USC students"
    },
    {
        id: "USC_identification_05",
        component: "satisfaction",
        text: "I think that USC students have a lot to be proud of"
    },
    {
        id: "USC_identification_02",
        component: "solidarity",
        text: "I feel solidarity with USC students"
    },
    {
        id: "USC_identification_03",
        component: "solidarity",
        text: "I feel committed to USC students"
    },
    {
        id: "USC_identification_04",
        component: "satisfaction",
        text: "I'm glad to be a USC student"
    },
    {
        id: "USC_identification_06",
        component: "satisfaction",
        text: "It is pleasant to be a USC student"
    },
    {
        id: "USC_identification_07",
        component: "satisfaction",
        text: "Being a USC student gives me a good feeling"
    },
    {
        id: "USC_identification_08",
        component: "centrality",
        text: "I often think about the fact that I am a USC student"
    },
    {
        id: "USC_identification_09",
        component: "centrality",
        text: "The fact that I am a USC student is an important part of my identity"
    },
    {
        id: "USC_identification_10",
        component: "centrality",
        text: "Being a USC student is an important part of how I see myself"
    },
    {
        id: "USC_identification_11",
        component: "individual_self_stereotyping",
        text: "I have a lot in common with the average USC student"
    },
    {
        id: "USC_identification_12",
        component: "individual_self_stereotyping",
        text: "I am similar to the average USC student"
    },
    {
        id: "USC_identification_13",
        component: "ingroup_homogeneity",
        text: "USC students have a lot in common with each other"
    },
    {
        id: "USC_identification_14",
        component: "ingroup_homogeneity",
        text: "USC students are very similar to each other"
    }
];

// These numbers refer to the internal ID suffixes,
// not the displayed row numbers.
export const LEACH_COMPONENTS = {
    solidarity: [1, 2, 3],
    satisfaction: [4, 5, 6, 7],
    centrality: [8, 9, 10],
    individual_self_stereotyping: [11, 12],
    ingroup_homogeneity: [13, 14]
};

export const USC_IDENTIFICATION_CONTENT = {
    showQuestionNumbers: "off",
    showProgressBar: "off",
    completeText: "Continue",

    pages: [
        {
            name: "USC_identification_page",

            elements: [
                {
                    type: "matrix",
                    name: "USC_identification_matrix",

                    title:
                        "For each of the following statements, please indicate the extent to which you agree or disagree with the statement.",

                    isRequired: true,
                    eachRowRequired: true,

                    requiredErrorText:
                        "Please select one response for every statement.",

                    rows: LEACH_USC_ITEMS.map(item => ({
                        value: item.id,
                        text: item.text
                    })),

                    columns: [
                        { value: 1, text: "1. Strongly Disagree" },
                        { value: 2, text: "2." },
                        { value: 3, text: "3. Neutral" },
                        { value: 4, text: "4." },
                        { value: 5, text: "5. Strongly Agree" }
                    ]
                }
            ]
        }
    ]
};




export function makeUscPrimeSurvey(prime) {

    // USC Prime 1: behaviors, values, and an example.
    if (prime.id === "USC_prime_01") {

        // Required single-line response box.
        const requiredText = (name, title) => ({
            type: "text",
            name: name,
            title: title,
            inputType: "text",
            isRequired: true,
            requiredErrorText: "Please enter a response.",

            validators: [
                {
                    type: "regex",
                    regex: "\\S",
                    text: "Please enter a response."
                }
            ]
        });

        // Safely display text and the logo path in HTML.
        const escapeHtml = value =>
            String(value).replace(/[&<>"']/g, character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[character]);

        return {
            showQuestionNumbers: "off",
            showProgressBar: "off",
            completeText: "Continue",

            pages: [
                {
                    name: prime.id,

                    elements: [

                        // USC logo.
                        {
                            type: "html",
                            name: "USC_prime_01_logo",

                            html: `
                                <div style="text-align:center; margin:0 0 24px;">
                                    <img
                                        src="${escapeHtml(USC_LOGO_PATH)}"
                                        alt="USC logo"
                                        style="display:inline-block;
                                               width:220px;
                                               max-width:70%;
                                               height:auto;"
                                    >
                                </div>
                            `
                        },

                        // Introduction.
                        {
                            type: "html",
                            name: "USC_prime_01_introduction",
                            html: `<p>${escapeHtml(prime.instructions)}</p>`
                        },

                        // Two behaviors: separate single-line boxes.
                        {
                            type: "panel",
                            name: "USC_prime_01_behaviors",

                            title:
                                "Please list two things USC students do relatively often.",

                            elements: [
                                requiredText(
                                    "USC_prime_01_behavior_1",
                                    "1."
                                ),
                                requiredText(
                                    "USC_prime_01_behavior_2",
                                    "2."
                                )
                            ]
                        },

                        // Two values: separate single-line boxes.
                        {
                            type: "panel",
                            name: "USC_prime_01_values",

                            title:
                                "Please list two values USC students endorse.",

                            elements: [
                                requiredText(
                                    "USC_prime_01_value_1",
                                    "1."
                                ),
                                requiredText(
                                    "USC_prime_01_value_2",
                                    "2."
                                )
                            ]
                        },

                        // Example: larger text-entry box.
                        {
                            type: "comment",
                            name: "prime_response",

                            title:
                                "Pick one of the values you listed above, and please briefly describe a time when a USC student exhibited this value.",

                            rows: 6,
                            isRequired: true,
                            requiredErrorText: "Please enter a response.",

                            validators: [
                                {
                                    type: "regex",
                                    regex: "\\S",
                                    text: "Please enter a response."
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }


    // Placeholder pages for USC Primes 2, 3, and 4.
    return {
        title: "Brief reflection",
        showQuestionNumbers: "off",
        completeText: "Continue",

        pages: [
            {
                name: prime.id,

                elements: [
                    {
                        type: "comment",
                        name: "prime_response",
                        title: prime.instructions,
                        isRequired: true,
                        maxLength: 8000
                    }
                ]
            }
        ]
    };
}
