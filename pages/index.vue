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

    <div class="mt-6 px-36 overflow-y-auto max-h-screen-80">
      <div
        v-for="(audio, index) in audioSources"
        :key="index"
        class="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-300 flex justify-between border border-gray-300 mb-4"
      >
        <div class="max-w-sm overflow-hidden">
          <div class="px-6 py-1">
            <div class="font-bold text-xl mb-2">
              {{ JSON.parse(audio).metadata.username }}
            </div>
            <p class="text-gray-700 text-sm">
              {{ JSON.parse(audio).metadata.timestamp | formatDate }}
              <span id="current-time" class="font-semibold"></span>
            </p>
          </div>
        </div>

        <div
          :class="{
            'flex justify-end w-1/2':
              JSON.parse(audio).metadata.username === username,
            'flex justify-start w-1/2':
              JSON.parse(audio).metadata.username !== username,
          }"
        >
          <audio
            :src="JSON.parse(audio).audioData"
            controls
            class="w-full focus:outline-none focus:ring focus:ring-indigo-300"
          ></audio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Recorder from "../components/Recorder.vue";

const ws = new WebSocket(process.env.WEBSOCKET_URL);

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
      let metadata = {
        username: this.username,
        timestamp: new Date(),
      };
      ws.send(JSON.stringify({ metadata: metadata, audioData }));
    },
    promptForUsername() {
      let username = null;
      while (!username) {
        username = prompt("Please enter your username:");
      }
      this.username = username;
    },
  },
  filters: {
    formatDate(value) {
      return new Date(value)
        .toISOString()
        .replace(/T/, " ")
        .replace(/\.\d+Z/, "")
        .slice(0, 16);
    },
  },
};
</script>
