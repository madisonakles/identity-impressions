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
                name: "common",
                title: "Please list two things that USC students share in common.",
                fields: ["common_1", "common_2"]
            },
            {
                name: "behaviors",
                title: "Please list two things USC students do relatively often.",
                fields: ["behavior_1", "behavior_2"]
            }
        ],

        reflection:
            "Pick one of the things you listed above, and please briefly describe a time when a USC student did this."
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
            "We are interested in learning about you as a USC student, please answer the following questions to help us learn more information about USC students.",
        isPlaceholder: false,
        groups: [
            {
                name: "experience",
                title: "Please list two experiences USC students commonly share.",
                fields: ["experience_1", "experience_2"]
            },
            {
                name: "together",
                title: "Please list two things that bring USC students together.",
                fields: ["together_1", "together_2"]
            }
        ],
        reflection:
            "Pick one of the things you listed above, and please briefly describe a time when you saw it bring USC students together"
    }
];

// CONTROL PRIMES
export const CONTROL_PRIMES = [
    {
        questions: [
            "Please list two things that describe you as an individual.",
            "Please list two things you do relatively often."
        ],
        reflection:
            "Pick one of the things you listed above, and please briefly describe a time when you did this."
    },
    {
        questions: [
            "Please list two things you do relatively well.",
            "Please list two values you endorse."
        ],
        reflection:
            "Pick one of the values you listed above, and please briefly describe a time when you exhibited this value."
    },
    {
        questions: [
            "What are two things you are interested in?",
            "What are two things that make you proud of yourself?"
        ],
        reflection:
            "Please pick ONE of the points of pride you thought of. What is a time when you demonstrated it?"
    },
    {
        questions: [
            "Please list two experiences you commonly have.",
            "Please list two things that help you feel like yourself."
        ],
        reflection:
            "Pick one of the things you listed above, and please briefly describe a time when it helped you feel like yourself."
    }
].map((wording, index) => ({
    id: `CONTROL_prime_${String(index + 1).padStart(2, "0")}`,
    instructions:
        "We are interested in learning about you as an individual, please answer the following questions to help us learn more information about you.",
    isPlaceholder: false,
    groups: USC_PRIMES[index].groups.map((group, questionIndex) => ({
        name: group.name,
        title: wording.questions[questionIndex],
        fields: [...group.fields]
    })),
    reflection: wording.reflection
}));






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




export function makeUscPrimeSurvey(prime, { showUscLogo = true } = {}) {
    if (!Array.isArray(prime.groups) || prime.groups.length !== 2 ||
        prime.groups.some(group => !Array.isArray(group.fields) || group.fields.length !== 2) ||
        typeof prime.reflection !== "string" || !prime.reflection.trim()) {
        throw new Error("Each reflection needs two question groups with two response boxes each, plus a short-answer question.");
    }
function appendUscPrototypePages() {
  const traits = [
    "Ambition", "Artistic skills", "Compassion",
    "Conscientiousness", "Creativity", "Emotional stability",
    "Extraversion", "High status", "Humility", "Humor",
    "Independence", "Intelligence", "Networking skills",
    "Open-mindedness", "Physical attractiveness", "Physical health",
    "Predictability", "Problem-solving skills", "Public speaking skills",
    "Risk-taking", "Similarity", "Adventurous", "Cheerful",
    "Cooperative", "Dutiful", "Emotional", "Friendly",
    "Intellectual", "Self-Disciplined", "Sympathetic",
    "Trustworthy", "Angry", "Anxious", "Assertive",
    "Cautious", "Depressed"
  ];

  function scale(first, middle, last) {
    return Array.from({ length: 7 }, (_, index) => {
      const value = index + 1;

      const label =
        value === 1 ? first :
        value === 4 ? middle :
        value === 7 ? last : "";

      return {
        value,
        text: `${value}.${label ? " " + label : ""}`
      };
    });
  }

  function rating(name, title, choices) {
    return {
      type: "radiogroup",
      name,
      title,
      isRequired: true,
      colCount: 0,
      choices
    };
  }

  function matrix(name, title) {
    return {
      type: "matrix",
      name,
      title,

      isRequired: true,
      eachRowRequired: true,
      isAllRowRequired: true,

      requiredErrorText:
        "Please select one response for every trait.",

      width: "100%",
      rowTitleWidth: "28%",
      columnMinWidth: "0px",

      rows: traits.map(text => ({
        value: text.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        text
      })),

      columns: scale(
        "Not essential at all",
        "Moderately important",
        "Very essential"
      )
    };
  }

  USC_IDENTIFICATION_CONTENT.pageNextText = "Continue";
  USC_IDENTIFICATION_CONTENT.pagePrevText = "Back";

  USC_IDENTIFICATION_CONTENT.pages.push(
    {
      name: "group_proto_description_page",
      title: "Group perception (USC)",

      elements: [
        {
          type: "html",
          name: "group_proto_instructions",

          html: `
            <p>
              Imagine an <b>ideal USC student</b>.
              In a few sentences, describe what this ideal USC
              student should be like. For example, you can write
              about the following:
            </p>

            <ul>
              <li>What traits or qualities should this person possess?</li>
              <li>What are this person's typical behaviors within the group?</li>
              <li>What does this person value the most?</li>
              <li>What accomplishments should this person have?</li>
            </ul>
          `
        },

        {
          type: "comment",
          name: "group_proto_resp",
          title: "Your description",
          rows: 6,
          isRequired: true,

          validators: [
            {
              type: "regex",
              regex: "\\S",
              text: "Please enter a response."
            }
          ]
        }
      ]
    },

    {
      name: "group_proto_followups_page",
      title: "Your description of the ideal USC student",

      description: "{group_proto_resp}",

      elements: [
        rating(
          "group_proto_self",
          "Consider your description of the ideal USC student above. To what extent does it describe you?",
          scale(
            "Not accurate at all",
            "",
            "Very accurate description"
          )
        ),

        rating(
          "group_proto_motive",
          "Consider your description of the ideal USC student above. How much do you want to become like that/stay that way in the future?",
          scale(
            "Not at all",
            "Moderately",
            "Very much"
          )
        ),

        rating(
          "group_proto_possible",
          "Consider your description of the ideal USC student above. How easily can you imagine yourself becoming like that/staying that way in the future?",
          scale(
            "Not at all",
            "",
            "Very easily"
          )
        )
      ]
    },

    {
      name: "group_proto_traits_page",
      title: "The ideal USC student",

      elements: [
        matrix(
          "group_proto_trait",
          "Consider the ideal USC student. How essential is each of the following traits for this ideal USC student?"
        )
      ]
    },

    {
      name: "group_proto_self_traits_page",
      title: "Describing yourself",

      elements: [
        matrix(
          "group_proto_traitSlf",
          "Consider the traits and skills you saw before. How well does each trait/skill describe you?"
        )
      ]
    }
  );
}

appendUscPrototypePages();
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

                    // Identity branding is shown only in the USC condition.
                    ...(showUscLogo ? [{
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
                    }] : []),

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
                        maxLength: 8000,
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

