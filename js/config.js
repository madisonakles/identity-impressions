export const config = {

    // Video stimuli filepath
    VIDEO_PATH: "assets/stimuli",

    // When enabled, shuffles order of all videos
    // Note: this overrides ALL other shuffle parameters
    SHUFFLE_ALL: true,

    // When enabled, shuffles the order of the video lists
    SHUFFLE_LIST_ORDER: false,

    // When enabled, ensures that if a participant sees a video from List A, they won't see the corresponding version at the same index in List B (or any other list)
    // See the wiki for more information
    EXCLUSIVE_INDEX_MODE: false,
    
    // Link participants are redirected to 2 seconds after seeing the completion message
    COMPLETION_LINK: "https://app.prolific.co/submissions/complete?cc=????????",

    // Link participants are redirected to 2 seconds after seeing the failure message
    FAILURE_LINK: "https://app.prolific.co/submissions/complete?cc=????????",

    // When enabled, logs debug messages to console
    DEBUG_LOGS: false,

    // When enabled, saves data locally
    DEBUG_SAVE: true,

    // When enabled, videos end at 5 seconds
    DEBUG_QUICK: false
};

export const videoLists = [
    {
        listName: "main",
        selectionNum: 4,
        shuffle: false,
        videos: [
            "017.mp4",
            "007.mp4",
            "016.mp4",
            "021.mp4"
        ]
    }
];
