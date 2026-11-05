import { config } from "./config.js";

// Debug warning
if (config.DEBUG_LOGS || config.DEBUG_SAVE || config.DEBUG_QUICK) {
    console.warn("DEBUG MODE ENABLED");
}

// Variable to indicate study completion
let complete = false;
export function setComplete(value) {
    complete = value;
}

// Generate random session ID
const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);

// Function to save data to server
function saveData(name, data) {
    return fetch('./php/write_data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, filedata: data })
    });
}

// Initialize jsPsych and handle study completion
export const jsPsych = initJsPsych({
    on_finish: function () {
        if (complete) {
            // Study completed
            if (config.DEBUG_SAVE) {
                jsPsych.data.get().localSave("csv", `${sessionId}_data.csv`);
            } else {
                saveData(`${sessionId}_data.csv`, jsPsych.data.get().csv())
                    .then(() => { window.location.href = config.COMPLETION_LINK; })
                jsPsych.getDisplayElement().innerHTML =
                    "<p>You will be redirected to Prolific shortly...</p>";
            }
        } else {
            // Study failed
            jsPsych.getDisplayElement().innerHTML =
                    `<p>Sorry, you are not eligible for the study.</p>
                     <p>You will be redirected to Prolific shortly.</p>`;
            setTimeout(() => {
                window.location.href = config.FAILURE_LINK;
            }, 2000);
        }
    }
});