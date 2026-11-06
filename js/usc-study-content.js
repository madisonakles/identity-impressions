// Add this file to your EXISTING repository's js folder.
// Four prime-page placeholders. Replace each instruction string with your final
// prompt. Stable IDs let you edit wording without losing the identity of a prime.
export const USC_PRIMES = [
  {id: "USC_prime_01", instructions: "[PLACEHOLDER: Paste USC identity-prime 1 instructions here.]", isPlaceholder: true},
  {id: "USC_prime_02", instructions: "[PLACEHOLDER: Paste USC identity-prime 2 instructions here.]", isPlaceholder: true},
  {id: "USC_prime_03", instructions: "[PLACEHOLDER: Paste USC identity-prime 3 instructions here.]", isPlaceholder: true},
  {id: "USC_prime_04", instructions: "[PLACEHOLDER: Paste USC identity-prime 4 instructions here.]", isPlaceholder: true}
];

// All four rounds reuse the endpoint rating trial you already have in main.js.
// Edit the trait questions ONCE in your existing content.js -> ratingContent.

// USC-referent adaptation of the 14 retained items in Leach et al. (2008),
// Appendix, p.165. Group referents are USC students / being a USC student.
// Review against the version used in your existing study before data collection.
// https://doi.org/10.1037/0022-3514.95.1.144
export const LEACH_USC_ITEMS = [
  {id: "USC_identification_01", component: "solidarity", text: "I feel a bond with other USC students."},
  {id: "USC_identification_02", component: "solidarity", text: "I feel solidarity with other USC students."},
  {id: "USC_identification_03", component: "solidarity", text: "I feel committed to other USC students."},
  {id: "USC_identification_04", component: "satisfaction", text: "I am glad to be a USC student."},
  {id: "USC_identification_05", component: "satisfaction", text: "I think that USC students have a lot to be proud of."},
  {id: "USC_identification_06", component: "satisfaction", text: "It is pleasant to be a USC student."},
  {id: "USC_identification_07", component: "satisfaction", text: "Being a USC student gives me a good feeling."},
  {id: "USC_identification_08", component: "centrality", text: "I often think about the fact that I am a USC student."},
  {id: "USC_identification_09", component: "centrality", text: "The fact that I am a USC student is an important part of my identity."},
  {id: "USC_identification_10", component: "centrality", text: "Being a USC student is an important part of how I see myself."},
  {id: "USC_identification_11", component: "individual_self_stereotyping", text: "I have a lot in common with the average USC student."},
  {id: "USC_identification_12", component: "individual_self_stereotyping", text: "I am similar to the average USC student."},
  {id: "USC_identification_13", component: "ingroup_homogeneity", text: "USC students have a lot in common with each other."},
  {id: "USC_identification_14", component: "ingroup_homogeneity", text: "USC students are very similar to each other."}
];

export const LEACH_COMPONENTS = {
  solidarity: [1, 2, 3],
  satisfaction: [4, 5, 6, 7],
  centrality: [8, 9, 10],
  individual_self_stereotyping: [11, 12],
  ingroup_homogeneity: [13, 14]
};

// One survey page with all 14 required items. No preselected answers.
// Only the two endpoint labels are specified, preserving the original anchors.
export const USC_IDENTIFICATION_CONTENT = {
  title: "USC identification",
  description: "Please indicate how much you agree or disagree with each statement. Use 1 = Strongly disagree through 7 = Strongly agree.",
  showQuestionNumbers: "on",
  showProgressBar: "off",
  completeText: "Continue",
  pages: [{
    name: "USC_identification_page",
    elements: LEACH_USC_ITEMS.map(item => ({
      type: "radiogroup",
      name: item.id,
      title: item.text,
      isRequired: true,
      colCount: 0,
      choices: [1, 2, 3, 4, 5, 6, 7].map(value => ({
        value,
        text: value === 1 ? "1 — Strongly disagree" : value === 7 ? "7 — Strongly agree" : String(value)
      }))
    }))
  }]
};

export function makeUscPrimeSurvey(prime) {
  return {
    title: "Brief reflection",
    showQuestionNumbers: "off",
    completeText: "Continue",
    pages: [{
      name: prime.id,
      elements: [{
        type: "comment",
        name: "prime_response",
        title: prime.instructions,
        isRequired: true,
        maxLength: 8000
      }]
    }]
  };
}
