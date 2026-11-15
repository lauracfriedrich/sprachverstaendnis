const storyNames = {
  "1A": "Suitcase",
  "1B": "Coloring",
  "2A": "Table",
  "2B": "Schoolbag",
  "3A": "Helmet",
  "3B": "Plants",
  "4A": "Icecream",
  "4B": "Dress",
  "5A": "Books",
  "5B": "Unpacking",
  "6A": "Room",
  "6B": "Visitors"
};

const storySlugs = {
  "1A": "suitcase",
  "1B": "coloring",
  "2A": "table",
  "2B": "schoolbag",
  "3A": "helmet",
  "3B": "plants",
  "4A": "icecream",
  "4B": "dress",
  "5A": "books",
  "5B": "unpacking",
  "6A": "room",
  "6B": "visitors"
};

function makeTrial(storyId, version) {
  const name = storyNames[storyId];
  const baseName = name
    ? `Story${storyId}_${name}`
    : `Story${storyId}`;

  const versionLower = version.toLowerCase();

  return {
    storyId,
    version: versionLower,

    video: `${baseName}_${version}.mp4`,

    intentionImages: [
      `intention_${storyId}_${versionLower}_1.png`,
      `intention_${storyId}_${versionLower}_2.png`
    ],

    statementAudio: `${baseName}_${version.charAt(0).toUpperCase()}${version.slice(1).toLowerCase()}.wav`,
    
    reminderAudio: [
      "1A", "2A", "3B", "4B", "5B", "6A", "6B"
    ].includes(storyId)
      ? "reminder_anna.mp3"
      : "reminder_tobi.mp3",

    emotionImages: [
      "emotion_angry.png",
      "emotion_happy.png"
    ],

    emotionCorrectAnswer:
      ["irony", "criticism"].includes(versionLower)
        ? "angry"
        : "happy",

    situationAudio:
      `situations/situation_${storyId}${storySlugs[storyId] ? "_" + storySlugs[storyId] : ""}.mp3`,

    situationImages: [
      `situation_${storyId}_1.png`,
      `situation_${storyId}_2.png`
    ],

    situationCorrectAnswer:
      versionLower === "praise" ? "2" : "1"
  };
}

const experiment = {
  1: {
    intro: "intro.mp4",
    trials: [
      makeTrial("2B", "Criticism"),
      makeTrial("6B", "Control"),
      makeTrial("3A", "Irony"),
      makeTrial("4B", "Praise"),
      makeTrial("1A", "Irony"),
      makeTrial("5B", "Criticism"),
      makeTrial("4A", "Irony"),
      makeTrial("2A", "Irony"),
      makeTrial("1B", "Praise"),
      makeTrial("6A", "Irony"),
      makeTrial("3B", "Control"),
      makeTrial("5A", "Irony")
    ],
    end: "end.mp4"
  },

  2: {
    intro: "intro.mp4",
    trials: [
      makeTrial("1B", "Criticism"),
      makeTrial("5B", "Control"),
      makeTrial("3A", "Irony"),
      makeTrial("6B", "Praise"),
      makeTrial("1A", "Irony"),
      makeTrial("4B", "Criticism"),
      makeTrial("4A", "Irony"),
      makeTrial("2A", "Irony"),
      makeTrial("3B", "Praise"),
      makeTrial("6A", "Irony"),
      makeTrial("2B", "Control"),
      makeTrial("5A", "Irony")
    ],
    end: "end.mp4"
  },

  3: {
    intro: "intro.mp4",
    trials: [
      makeTrial("3B", "Criticism"),
      makeTrial("4B", "Control"),
      makeTrial("3A", "Irony"),
      makeTrial("5B", "Praise"),
      makeTrial("1A", "Irony"),
      makeTrial("6B", "Criticism"),
      makeTrial("4A", "Irony"),
      makeTrial("2A", "Irony"),
      makeTrial("2B", "Praise"),
      makeTrial("6A", "Irony"),
      makeTrial("1B", "Control"),
      makeTrial("5A", "Irony")
    ],
    end: "end.mp4"
  },

  4: {
    intro: "intro.mp4",
    trials: [
      makeTrial("2A", "Criticism"),
      makeTrial("6A", "Control"),
      makeTrial("3B", "Irony"),
      makeTrial("4A", "Praise"),
      makeTrial("1B", "Irony"),
      makeTrial("5A", "Criticism"),
      makeTrial("4B", "Irony"),
      makeTrial("2B", "Irony"),
      makeTrial("1A", "Praise"),
      makeTrial("6B", "Irony"),
      makeTrial("3A", "Control"),
      makeTrial("5B", "Irony")
    ],
    end: "end.mp4"
  },

  5: {
    intro: "intro.mp4",
    trials: [
      makeTrial("1A", "Criticism"),
      makeTrial("5A", "Control"),
      makeTrial("3B", "Irony"),
      makeTrial("6A", "Praise"),
      makeTrial("1B", "Irony"),
      makeTrial("4A", "Criticism"),
      makeTrial("4B", "Irony"),
      makeTrial("2B", "Irony"),
      makeTrial("3A", "Praise"),
      makeTrial("6B", "Irony"),
      makeTrial("2A", "Control"),
      makeTrial("5B", "Irony")
    ],
    end: "end.mp4"
  },

  6: {
    intro: "intro.mp4",
    trials: [
      makeTrial("3A", "Criticism"),
      makeTrial("4A", "Control"),
      makeTrial("3B", "Irony"),
      makeTrial("5A", "Praise"),
      makeTrial("1B", "Irony"),
      makeTrial("6A", "Criticism"),
      makeTrial("4B", "Irony"),
      makeTrial("2B", "Irony"),
      makeTrial("2A", "Praise"),
      makeTrial("6B", "Irony"),
      makeTrial("1A", "Control"),
      makeTrial("5B", "Irony")
    ],
    end: "end.mp4"
  }
};

export default experiment;