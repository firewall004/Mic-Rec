<template>
  <div>
    <div class="bg-white">
      <div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2
            class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Mic Rec
          </h2>

          <div class="mt-10 flex items-center justify-center gap-x-6">
            <Recorder @audioData="sendAudioData" />
          </div>
        </div>
      </div>
    </div>

    <div v-for="(audio, index) in audioSources" :key="index" class="mt-6 px-28">
      <div
        :class="{
          'bg-white': JSON.parse(audio).username === username,
          'bg-gray-300': JSON.parse(audio).username !== username,
        }"
        class="rounded-lg shadow-lg p-4 flex justify-between"
      >
        <div class="font-bold text-xl">{{ JSON.parse(audio).username }}</div>
        <div
          :class="{
            'flex justify-end w-1/2': JSON.parse(audio).username === username,
            'flex justify-start w-1/2': JSON.parse(audio).username !== username,
          }"
        >
          <audio
            :src="JSON.parse(audio).audioData"
            controls
            class="w-full"
          ></audio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Recorder from "../components/Recorder.vue";

const ws = new WebSocket("ws://localhost:8099");

export default {
  components: {
    Recorder,
  },
  data() {
    return {
      audioSources: [],
      username: "",
    };
  },
  mounted() {
    this.promptForUsername();

    ws.onopen = () => {
      console.log("WebSocket connection established from mounted");
    };

    ws.onmessage = (event) => {
      this.audioSources.push(event.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  },
  methods: {
    sendAudioData(audioData) {
      ws.send(JSON.stringify({ username: this.username, audioData }));
    },
    promptForUsername() {
      let username = null;
      while (!username) {
        username = prompt("Please enter your username:");
      }
      this.username = username;
    },
  },
};
</script>
