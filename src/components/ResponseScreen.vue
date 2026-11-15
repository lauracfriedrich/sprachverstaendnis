<template>
  <div class="response-screen">

    <!-- Antwortbilder -->
    <!-- Normale Antwortbilder -->
    <div v-if="!showContinue && images && images.length" class="options">
      <button
        v-for="(image, index) in images"
        :key="index"
        class="image-option"
        :disabled="!questionFinished"
        @click="selectImage(image)"
      >
        <img :src="image.src" :alt="image.label" />
      </button>
    </div>

    <!-- Bild bei der Why-Frage -->
    <div v-if="showContinue" class="options why-image">
      <img :src="`${publicPath}images/why_image.png`" alt="" />
    </div>

    <!-- Replay-Button -->
    <button
      v-if="audioSrc"
      class="replay-button"
      @click="playAudios"
      aria-label="Audios erneut abspielen"
      title="Nochmal anhören"
    >
      ↻
    </button>

    <!-- Weiter bei Why-Frage -->
    <button
      v-if="showContinue"
      class="continue-button"
      @click="$emit('continue')"
      aria-label="Weiter"
      title="Weiter"
    >
      →
    </button>

  </div>
</template>

<script>
export default {
  name: "ResponseScreen",

  props: {
    images: {
      type: Array,
      default: () => []
    },

    audioSrc: {
      type: String,
      default: ""
    },

    secondAudioSrc: {
      type: String,
      default: ""
    },

    thirdAudioSrc: {
      type: String,
      default: ""
    },

    showContinue: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      audioPlayer: null,
      playbackId: 0,
      isPlaying: false,
      questionFinished: false,
      publicPath: process.env.BASE_URL
    };
  },

  mounted() {
    this.playAudios();
  },

  beforeDestroy() {
    this.playbackId++;
    this.stopAudio();
  },

  methods: {
    async playAudios() {
      // Vorherige Wiedergabe beenden
      this.stopAudio();

      const currentPlaybackId = ++this.playbackId;

      this.isPlaying = true;
      this.questionFinished = false;

      // Bei Emotion zuerst die Mutter-Aussage,
      // danach die eigentliche Emotionsfrage
      const sources = [
        this.thirdAudioSrc,
        this.secondAudioSrc,
        this.audioSrc
      ].filter(Boolean);

      let allAudiosFinished = sources.length > 0;

      for (const source of sources) {
        if (currentPlaybackId !== this.playbackId) {
          break;
        }

        const audio = new Audio(source);
        this.audioPlayer = audio;

        const played = await new Promise(resolve => {
          audio.addEventListener("ended", () => resolve(true), {
            once: true
          });

          audio.addEventListener("error", () => {
            console.error("Audio-Fehler:", source, audio.error);
            resolve(false);
          }, { once: true });

          audio.play().catch(() => resolve(false));
        });

        if (!played) {
          allAudiosFinished = false;
          break;
        }

        if (currentPlaybackId !== this.playbackId) {
          break;
        }
      }

      if (currentPlaybackId === this.playbackId) {
        this.isPlaying = false;
        this.audioPlayer = null;

        if (allAudiosFinished) {
          this.questionFinished = true;
        }
      }
    },

    stopAudio() {
      if (this.audioPlayer) {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.audioPlayer = null;
      }
    },

    selectImage(image) {
      // Sicherheit: Keine Antwort vor Ende der Frage
      if (!this.questionFinished) {
        return;
      }

      this.stopAudio();
      this.$emit("answer", image.label);
    }
  }
};
</script>

<style scoped>
.response-screen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: black;
  overflow: hidden;
}

/* Weißer Bereich mit zwei Antwortbildern */
.options {
  width: min(100vw, 177.78dvh);
  aspect-ratio: 16 / 9;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3%;

  padding: 3%;
  box-sizing: border-box;

  background: white;
}

/* Antwortbilder */
.image-option {
  flex: 1;
  height: 100%;
  min-width: 0;

  padding: 0;
  border: none;
  background: white;

  cursor: pointer;
  overflow: hidden;
}

.image-option img {
  display: block;
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.image-option:focus {
  outline: none;
}

.image-option:disabled {
  cursor: default;
  opacity: 0.55;
}

/* Replay-Button */
/* Replay-Button: kleines Symbol oben rechts */
.replay-button {
  position: absolute;
  top: 0px;
  right: 15px;
  width: 30px;
  height: 30px;
  font-size: 22px;
  padding: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 28px;
  font-family: Arial, sans-serif;

  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  color: black;

  cursor: pointer;
  z-index: 10;

  outline: none;
  caret-color: transparent;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.continue-button {
  margin-top: 20px;
  padding: 14px 28px;

  font-size: 22px;
  font-family: Arial, sans-serif;

  border: none;
  border-radius: 8px;
  background: white;
  color: black;

  cursor: pointer;
}

.replay-button:focus,
.replay-button:focus-visible {
  outline: none;
}

.replay-button:active,
.continue-button:active {
  transform: scale(0.97);
}

/* Bild bei der Why-Frage */
.why-image {
  width: min(100vw, 177.78dvh);
  aspect-ratio: 16 / 9;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background: white;
  overflow: hidden;
}

.why-image img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  object-fit: fill;
}

/* Kleiner Weiter-Button unten rechts */
.continue-button {
  position: absolute;
  bottom: 5px;
  right: 15px;

  width: 30px;
  height: 30px;
  padding: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 28px;
  font-family: Arial, sans-serif;

  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  color: black;

  cursor: pointer;
  z-index: 10;
  outline: none;
  user-select: none;
}
</style>