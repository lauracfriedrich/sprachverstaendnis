<template>
  <div id="app">

    <!-- Startseite -->
    <StartPage
      v-if="phase === 'start'"
      @start="startExperiment"
    />

    <!-- Videos -->
    <VideoScreen
      v-else-if="phase === 'intro' || phase === 'trialVideo' || phase === 'end'"
      :key="'video-' + phase + '-' + trialIndex"
      :video-src="currentVideo"
      @finished="onVideoFinished"
    />

    <!-- Fragen -->
    <ResponseScreen
      v-else-if="phase === 'intention' || phase === 'emotion' || phase === 'situation' || phase === 'why'"
      :key="'response-' + phase + '-' + trialIndex"
      :images="currentImages"
      :audio-src="currentAudioSrc"
      :second-audio-src="secondAudioSrc"
      :third-audio-src="thirdAudioSrc"
      :statement-audio-src="statementAudioSrc"
      :show-continue="phase === 'why'"
      @answer="saveAnswer"
      @continue="continueAfterWhy"
    />

    <!-- Abschluss -->
    <div v-else-if="phase === 'done'" class="finished">
      <h1>Vielen Dank!</h1>
      <p>Das Experiment ist beendet.</p>
      <p>VP-Nummer: {{ participantId }}</p>
      <p>
        Bisher auf diesem Gerät gespeichert:
        {{ savedParticipantCount }} Teilnehmende
      </p>

      <button @click="exportData">
        Daten herunterladen (CSV)
      </button>
    </div>

  </div>
</template>

<script>
import StartPage from "./components/StartPage.vue";
import VideoScreen from "./components/VideoScreen.vue";
import ResponseScreen from "./components/ResponseScreen.vue";

import experiment from "./experiment.js";

export default {
  name: "App",

  components: {
    StartPage,
    VideoScreen,
    ResponseScreen
  },

  data() {
    return {
      phase: "start",

      participantId: "",
      selectedList: null,

      trialIndex: 0,
      answers: [],
      currentTrialData: null,

      savedParticipantCount: 0
    };
  },

  created() {
    this.updateSavedParticipantCount();
  },

  computed: {
    currentTrial() {
      if (this.selectedList === null) return null;

      return experiment[this.selectedList].trials[this.trialIndex];
    },

    currentVideo() {
      if (this.phase === "intro") {
        return `${process.env.BASE_URL}videos/${experiment[this.selectedList].intro}`;
      }

      if (this.phase === "trialVideo") {
        return `${process.env.BASE_URL}videos/${this.currentTrial.video}`;
      }

      if (this.phase === "end") {
        return `${process.env.BASE_URL}videos/${experiment[this.selectedList].end}`;
      }

      return "";
    },

    currentImages() {
      if (!this.currentTrial) return [];

      let images = [];

      if (this.phase === "intention") {
        images = this.currentTrial.intentionImages.map((file, index) => ({
          label: String(index + 1),
          src: `${process.env.BASE_URL}images/intention/${file}`
        }));
      }

      if (this.phase === "emotion") {
        images = this.currentTrial.emotionImages.map(emotion => ({
          label: emotion.replace("emotion_", "").replace(".png", ""),
          src: `${process.env.BASE_URL}images/emotion/${emotion}`
        }));
      }

      if (this.phase === "situation") {
        images = this.currentTrial.situationImages.map((file, index) => ({
          label: String(index + 1),
          src: `${process.env.BASE_URL}images/situation/${file}`
        }));
      }

      // Antwortbilder zufällig links und rechts anordnen
      return [...images].sort(() => Math.random() - 0.5);
    },

    currentAudioSrc() {
      if (this.phase === "intention") {
        return `${process.env.BASE_URL}audios/intention.mp3`;
      }

      if (this.phase === "emotion") {
        return `${process.env.BASE_URL}audios/emotion.mp3`;
      }

      if (this.phase === "situation") {
        return `${process.env.BASE_URL}audios/${this.currentTrial.situationAudio}`;
      }

      if (this.phase === "why") {
        return `${process.env.BASE_URL}audios/why.mp3`;
      }

      return "";
    },

    secondAudioSrc() {
      if (this.phase === "emotion") {

        return `${process.env.BASE_URL}audios/statements/${this.currentTrial.statementAudio}`;
      }

      return "";
    },

    thirdAudioSrc() {
      if (this.phase === "emotion") {
        return `${process.env.BASE_URL}audios/${this.currentTrial.reminderAudio}`;
      }

      return "";
    },

    statementAudioSrc() {
      if (!this.currentTrial || !this.currentTrial.statementAudio) {
        return "";
      }

      return `${process.env.BASE_URL}audios/statements/${this.currentTrial.statementAudio}`;
    },
  },

  methods: {
    startExperiment(data) {
      this.participantId = data.participantId;
      this.selectedList = data.list;

      this.trialIndex = 0;
      this.answers = [];
      this.currentTrialData = null;

      this.saveLocally();
      this.phase = "intro";
    },

    onVideoFinished() {
      if (this.phase === "intro") {
        this.prepareCurrentTrial();
        this.phase = "trialVideo";
      } else if (this.phase === "trialVideo") {
        this.phase = "intention";
      } else if (this.phase === "end") {
        this.phase = "done";
      }
    },

    prepareCurrentTrial() {
      const trial = this.currentTrial;

      this.currentTrialData = {
        participantId: this.participantId,
        list: this.selectedList,
        trial: this.trialIndex + 1,
        storyId: trial.storyId,
        version: trial.version,
        video: trial.video,

        intentionAnswer: "",
        intentionCorrect: "",

        emotionAnswer: "",
        emotionCorrect: "",

        situationAnswer: "",
        situationCorrect: "",

        timestamp: ""
      };

      this.answers.push(this.currentTrialData);
      this.saveLocally();
    },

    saveAnswer(answer) {
      const trial = this.currentTrial;
      const data = this.currentTrialData;

      if (this.phase === "intention") {
        data.intentionAnswer = answer;
        data.intentionCorrect = answer === "1" ? "correct" : "incorrect";

        this.phase = "emotion";
      }

      else if (this.phase === "emotion") {
        data.emotionAnswer = answer;
        data.emotionCorrect =
          answer === trial.emotionCorrectAnswer
            ? "correct"
            : "incorrect";

        this.phase = "situation";
      }

      else if (this.phase === "situation") {
        data.situationAnswer = answer;
        data.situationCorrect =
          answer === trial.situationCorrectAnswer
            ? "correct"
            : "incorrect";

        data.timestamp = new Date().toISOString();

        this.saveLocally();

        const shouldAskWhy =
          (trial.version === "irony" && data.situationCorrect === "correct") ||
          (trial.version !== "irony" && data.situationCorrect === "incorrect");

        if (shouldAskWhy) {
          this.phase = "why";
          return;
        }

        this.advanceTrial();
        return;
      }

      this.saveLocally();
    },

    continueAfterWhy() {
      this.advanceTrial();
    },

    advanceTrial() {
      if (this.trialIndex < experiment[this.selectedList].trials.length - 1) {
        this.trialIndex++;
        this.prepareCurrentTrial();
        this.phase = "trialVideo";
      } else {
        this.phase = "end";
      }
    },

    saveLocally() {
      const storageKey = "sprachverstaendnis_experiment_data";

      const existingData = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      const participantData = {
        participantId: this.participantId,
        list: this.selectedList,
        answers: this.answers
      };

      const otherParticipants = existingData.filter(
        item => item.participantId !== this.participantId
      );

      otherParticipants.push(participantData);

      localStorage.setItem(
        storageKey,
        JSON.stringify(otherParticipants)
      );

      this.updateSavedParticipantCount();
    },

    exportData() {
      const storageKey = "sprachverstaendnis_experiment_data";

      const allData = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      const rows = [];

      allData.forEach(participant => {
        participant.answers.forEach(answer => {
          rows.push({
            participantId: `="${answer.participantId}"`,
            list: answer.list,
            trial: answer.trial,
            storyId: answer.storyId,
            version: answer.version,
            video: answer.video,

            intentionAnswer: answer.intentionAnswer,
            intentionCorrect: answer.intentionCorrect,

            emotionAnswer: answer.emotionAnswer,
            emotionCorrect: answer.emotionCorrect,

            situationAnswer: answer.situationAnswer,
            situationCorrect: answer.situationCorrect,

            timestamp: answer.timestamp
          });
        });
      });

      const headers = [
        "participantId",
        "list",
        "trial",
        "storyId",
        "version",
        "video",
        "intentionAnswer",
        "intentionCorrect",
        "emotionAnswer",
        "emotionCorrect",
        "situationAnswer",
        "situationCorrect",
        "timestamp"
      ];

      const csvContent = [
        headers.join(";"),
        ...rows.map(row =>
          headers.map(header =>
            `"${String(row[header] ?? "").replace(/"/g, '""')}"`
          ).join(";")
        )
      ].join("\n");

      const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "sprachverstaendnis_experiment_data.csv";
      link.click();

      URL.revokeObjectURL(url);
    },

    updateSavedParticipantCount() {
      const storageKey = "sprachverstaendnis_experiment_data";

      const existingData = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      this.savedParticipantCount = existingData.length;
    }
  }
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  color: #222;
}

.finished {
  margin: 80px auto;
  text-align: center;
}
</style>