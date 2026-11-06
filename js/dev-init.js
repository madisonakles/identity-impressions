// Loaded ONLY through dev.html's import map. The participant's init.js is not
// imported, so its saving, completion, and redirect callbacks are not registered.
const settings = globalThis.__TRAIT_DEV_PREVIEW__;
if (!settings || !["usc_prime", "control"].includes(settings.condition)) {
  throw new Error("Open dev.html to use the developer navigator.");
}
if (typeof globalThis.initJsPsych !== "function") {
  throw new Error("The study's jsPsych library did not load. Check the script imports in index.html.");
}

const style = document.createElement("style");
style.textContent = `
  body { margin: 0 !important; }
  #trait-dev-study { box-sizing: border-box; margin-left: 292px; width: calc(100% - 292px); height: 100vh; overflow-y: auto; }
  #trait-dev-nav { position: fixed; left: 0; top: 0; bottom: 0; z-index: 2147483000; width: 292px; box-sizing: border-box; padding: 22px 18px 24px; overflow-y: auto; background: #fbfaf8; border-right: 1px solid #dedbd5; color: #272c35; font: 14px/1.45 system-ui, sans-serif; text-align: left; }
  #trait-dev-nav * { box-sizing: border-box; }
  #trait-dev-nav .dev-eyebrow { margin: 0 0 8px; color: #8b1731; font-size: 11px; font-weight: 800; letter-spacing: .12em; }
  #trait-dev-nav h1 { margin: 0 0 8px; font-size: 21px; line-height: 1.2; }
  #trait-dev-nav .dev-note { margin: 0 0 18px; font-size: 12px; color: #616772; }
  #trait-dev-nav label { display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px; }
  #trait-dev-nav select { width: 100%; padding: 9px 10px; margin: 0 0 10px; font: inherit; background: white; border: 1px solid #ccc7c0; border-radius: 6px; color: inherit; }
  #trait-dev-nav button, #trait-dev-nav a.dev-button { cursor: pointer; font: inherit; border: 1px solid #d6d1ca; background: white; color: #303640; border-radius: 6px; padding: 8px 10px; text-decoration: none; }
  #trait-dev-nav button:hover, #trait-dev-nav a.dev-button:hover { background: #f0ede8; }
  #trait-dev-nav button:focus-visible, #trait-dev-nav a:focus-visible, #trait-dev-nav select:focus-visible { outline: 3px solid #cc9a3c; outline-offset: 2px; }
  #trait-dev-nav button:disabled { opacity: .4; cursor: default; }
  #trait-dev-nav .dev-actions { display: flex; gap: 6px; margin: 0 0 10px; }
  #trait-dev-nav .dev-actions button { flex: 1; font-size: 12px; }
  #trait-dev-nav .dev-section { margin: 22px 0 8px; color: #767474; text-transform: uppercase; font-size: 10px; font-weight: 800; letter-spacing: .1em; }
  #trait-dev-nav .dev-screen { display: block; width: 100%; margin: 0 0 5px; text-align: left; border-color: transparent; background: transparent; font-size: 12px; overflow-wrap: anywhere; }
  #trait-dev-nav .dev-screen[aria-current="page"] { color: #861a30; background: #f1e3e5; border-color: #e2bfc6; font-weight: 700; }
  #trait-dev-nav .dev-footer { border-top: 1px solid #dedbd5; padding-top: 16px; margin-top: 22px; font-size: 11px; color: #616772; }
  #trait-dev-nav .dev-footer a { color: #861a30; }
  #trait-dev-nav .dev-title-row { display: flex; justify-content: space-between; align-items: start; gap: 8px; }
  #trait-dev-nav #dev-hide { padding: 3px 7px; font-size: 11px; }
  #dev-show { display: none; position: fixed; left: 10px; top: 10px; z-index: 2147483000; border: 1px solid #bcaeaf; background: #fbfaf8; color: #861a30; border-radius: 6px; padding: 10px; font: 12px system-ui; cursor: pointer; }
  body.trait-dev-hidden #trait-dev-nav { display: none; }
  body.trait-dev-hidden #dev-show { display: block; }
  body.trait-dev-hidden #trait-dev-study { margin-left: 0; width: 100%; }
  .trait-dev-finished { max-width: 500px; margin: auto; padding: 48px 24px; font: 16px/1.5 system-ui; text-align: center; }
  @media (max-width: 760px) { #trait-dev-nav { width: 220px; padding: 18px 12px; } #trait-dev-study { margin-left: 220px; width: calc(100% - 220px); } }
`;
document.head.append(style);
const display = document.createElement("div");
display.id = "trait-dev-study";
document.body.append(display);

// A fresh instance has no participant callbacks, backend writes, or redirects.
const instance = globalThis.initJsPsych({
  display_element: display.id,
  on_finish() {
    display.innerHTML = '<div class="trait-dev-finished"><h2>Screen preview finished</h2><p>Choose another screen in the sidebar, or use Next.</p><p>Preview responses have not been saved.</p></div>';
  }
});
instance.randomization.setSeed(settings.seed);
instance.data.addProperties({ developer_mode: true, exclude_from_analysis: true });

// The existing main.js draws from this exact two-condition pool. Consume the
// ordinary draw, then return the selected preview arm. Other sampling is intact.
// Copy the namespace instead of trying to mutate jsPsych's read-only module.
const devRandomization = {
  ...instance.randomization,
  sampleWithoutReplacement(values, size, ...args) {
    const sampled = instance.randomization.sampleWithoutReplacement(values, size, ...args);
    const isConditionDraw = size === 1 && Array.isArray(values) && values.length === 2
      && values.includes("usc_prime") && values.includes("control");
    return isConditionDraw ? [settings.condition] : sampled;
  }
};

const labels = {
  screener: "Screener",
  instructions: "Instructions",
  audio_check: "Audio check",
  demo: "Practice video",
  start_message: "Start message",
  demographics: "Demographics",
  USC_identification: "USC identification · 14 items",
  info: "Completion page"
};
const setupNames = new Set(["browser_check", "preload", "fullscreen", "re-fullscreen"]);

function buildScreens(timeline) {
  const screens = [];
  const occurrences = new Map();
  for (const trial of timeline) {
    // In the provided main.js, the only nested nodes are Safari/fullscreen
    // gates. Main-round trials from usc-four-rounds.js are already flat.
    if (!trial || trial.timeline) continue;
    const name = trial.data?.trial_name;
    if (!name || setupNames.has(name)) continue;
    const round = trial.data?.round;
    const base = round ? `${name}_round_${round}` : name;
    const occurrence = (occurrences.get(base) || 0) + 1;
    occurrences.set(base, occurrence);
    const id = occurrence === 1 ? base : `${base}_${occurrence}`;
    let label = labels[name] || name.replaceAll("_", " ");
    if (name === "usc_identity_prime") label = `Round ${round}: USC prime · ${trial.data.prime_id}`;
    if (name === "video") label = `Round ${round}: video · ${String(trial.video).split("/").pop()}`;
    if (name === "ratings") label = `Round ${round}: video ratings`;
    const group = round ? `Round ${round}` : ["demographics", "USC_identification", "info"].includes(name) ? "Ending" : "Before the task";
    // Individual instruction pages can be opened without completing earlier
    // pages. Other surveys retain their original complete page structure.
    if (name === "instructions" && Array.isArray(trial.survey_json?.pages) && trial.survey_json.pages.length > 1) {
      trial.survey_json.pages.forEach((page, index) => {
        screens.push({ id: `${id}_page_${index + 1}`, label: `Instructions · page ${index + 1}`, group,
          trial: { ...trial, survey_json: { ...trial.survey_json, pages: [page] } } });
      });
    } else screens.push({ id, label, group, trial });
  }
  if (!screens.length) throw new Error("No named screens found. This navigator expects the main.js and four-round add-on used in your study.");
  return screens;
}

function navigate(changes) {
  const url = new URL(settings.shellUrl);
  for (const [key, value] of Object.entries(changes)) {
    if (value == null) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  window.parent.location.assign(url.href);
}

function element(tag, text, attributes = {}) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  return node;
}

function mountNavigator(screens, activeIndex) {
  const nav = element("aside", null, { id: "trait-dev-nav", "aria-label": "Developer study navigator" });
  nav.append(element("p", "DEVELOPER PREVIEW", { class: "dev-eyebrow" }));
  const heading = element("div", null, { class: "dev-title-row" });
  const hide = element("button", "Hide", { id: "dev-hide", type: "button" });
  hide.onclick = () => document.body.classList.add("trait-dev-hidden");
  heading.append(element("h1", "Study navigator"), hide);
  nav.append(heading, element("p", "Jump to any screen. No answers needed. Each jump starts a fresh screen preview.", { class: "dev-note" }));
  nav.append(element("label", "Condition", { for: "dev-condition" }));
  const select = element("select", null, { id: "dev-condition" });
  for (const [value, label] of [["usc_prime", "USC prime"], ["control", "Control · no primes"]]) {
    select.append(element("option", label, { value }));
  }
  select.value = settings.condition;
  select.onchange = () => navigate({ condition: select.value });
  nav.append(select);
  const actions = element("div", null, { class: "dev-actions" });
  const previous = element("button", "← Previous", { type: "button" });
  previous.disabled = activeIndex === 0;
  previous.onclick = () => navigate({ step: screens[activeIndex - 1].id });
  const next = element("button", "Next →", { type: "button" });
  next.disabled = activeIndex === screens.length - 1;
  next.onclick = () => navigate({ step: screens[activeIndex + 1].id });
  actions.append(previous, next);
  const replay = element("button", "Replay this screen", { type: "button" });
  replay.onclick = () => navigate({ step: screens[activeIndex].id });
  const reshuffle = element("button", "Reshuffle order", { type: "button" });
  reshuffle.onclick = () => navigate({ seed: crypto.randomUUID() });
  const secondary = element("div", null, { class: "dev-actions" });
  secondary.append(replay, reshuffle);
  nav.append(actions, secondary);
  let previousGroup;
  screens.forEach((screen, index) => {
    if (screen.group !== previousGroup) nav.append(element("p", screen.group, { class: "dev-section" }));
    previousGroup = screen.group;
    const button = element("button", screen.label, { type: "button", class: "dev-screen", "data-screen": screen.id });
    if (index === activeIndex) button.setAttribute("aria-current", "page");
    button.onclick = () => navigate({ step: screen.id });
    nav.append(button);
  });
  const footer = element("div", null, { class: "dev-footer" });
  footer.append(element("p", "Preview only. Responses stay in memory and are discarded when you jump. Saving and Prolific redirects are disabled."));
  footer.append(element("p", "Video and prime orders stay the same until you select Reshuffle order. Fullscreen and preload gates are skipped."));
  const participant = element("a", "Open normal participant study ↗", { href: settings.studyUrl, target: "_blank", rel: "noopener" });
  footer.append(participant);
  nav.append(footer);
  const show = element("button", "Show navigator", { id: "dev-show", type: "button" });
  show.onclick = () => document.body.classList.remove("trait-dev-hidden");
  document.body.append(nav, show);
}

function runPreview(timeline) {
  const screens = buildScreens(timeline);
  let activeIndex = screens.findIndex(screen => screen.id === settings.step);
  // Switching to control while viewing a prime should land on the matching
  // round's video rather than restarting the entire task.
  if (activeIndex < 0 && /^usc_identity_prime_round_[1-4]$/.test(settings.step || "")) {
    activeIndex = screens.findIndex(screen => screen.id === settings.step.replace("usc_identity_prime", "video"));
  }
  if (activeIndex < 0) activeIndex = 0;
  mountNavigator(screens, activeIndex);
  window.parent.postMessage({ type: "trait-preview-ready" }, new URL(settings.shellUrl).origin);
  const trial = screens[activeIndex].trial;
  return instance.run([{ ...trial, data: { ...trial.data, developer_mode: true, exclude_from_analysis: true } }]);
}

// Bind real methods to the real instance (including private class fields).
// Keep the facade separate so even frozen library properties are untouched.
export const jsPsych = new Proxy({}, {
  get(_target, key) {
    if (key === "randomization") return devRandomization;
    if (key === "run") return runPreview;
    const value = Reflect.get(instance, key, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  }
});

// The real completion trial can be previewed without activating saving.
export function setComplete() {}
