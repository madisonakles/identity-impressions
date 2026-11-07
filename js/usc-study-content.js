// --- USC logo ---
export const USC_LOGO_PATH = "assets/usc-logo.png";


// --- Four USC identity primes ---

export const USC_PRIMES = [
    {
        id: "USC_prime_01",
        instructions:
            "We are interested in learning about you as a USC student, please answer the following questions to help us learn more information about USC students.",
        isPlaceholder: false,

        groups: [
            {
                name: "behaviors",
                title: "Please list two things USC students do relatively often.",
                fields: ["behavior_1", "behavior_2"]
            },
            {
                name: "values",
                title: "Please list two values USC students endorse.",
                fields: ["value_1", "value_2"]
            }
        ],

        reflection:
            "Pick one of the values you listed above, and please briefly describe a time when a USC student exhibited this value."
    },

    {
        id: "USC_prime_02",
        instructions:
            "We are interested in learning about you as a USC student, please answer the following questions to help us learn more information about USC students.",
        isPlaceholder: false,

        groups: [
            {
                name: "behaviors",
                title: "Please list two things USC students do relatively well.",
                fields: ["behavior_1", "behavior_2"]
            },
            {
                name: "values",
                title: "Please list two values USC students endorse.",
                fields: ["value_1", "value_2"]
            }
        ],

        reflection:
            "Pick one of the values you listed above, and please briefly describe a time when a USC student exhibited this value."
    },

    {
        id: "USC_prime_03",
        instructions:
            "We are interested in learning about you as a USC student, please answer the following questions to help us learn more information about USC students.",
        isPlaceholder: false,

        groups: [
            {
                name: "interests",
                title: "What are two things USC students are interested in?",
                fields: ["interest_1", "interest_2"]
            },
            {
                name: "pride",
                title: "What are two things that make you proud to be a USC student?",
                fields: ["pride_1", "pride_2"]
            }
        ],

        reflection:
            "Please pick ONE of the points of pride you thought of. What is a time when a USC student demonstrated it?"
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

    // Placeholder format for Prime 4.
    if (prime.isPlaceholder || !prime.groups) {
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
                        name: `${prime.id}_logo`,

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
                        name: `${prime.id}_introduction`,
                        html: `<p>${escapeHtml(prime.instructions)}</p>`
                    },

                    // Two question groups, each with two single-line boxes.
                    ...prime.groups.map(group => ({
                        type: "panel",
                        name: `${prime.id}_${group.name}`,
                        title: group.title,

                        elements: group.fields.map((field, index) =>
                            requiredText(
                                `${prime.id}_${field}`,
                                `${index + 1}.`
                            )
                        )
                    })),

                    // Larger required writing box.
                    {
                        type: "comment",
                        name: "prime_response",
                        title: prime.reflection,
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
