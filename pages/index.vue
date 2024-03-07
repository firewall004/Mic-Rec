<template>
  <div class="max-h-screen">
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="overflow-hidden sm:rounded-lg">
          <div class="p-6">
            <h2 class="text-3xl font-bold text-gray-900">Mic Rec</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div class="p-2 bg-white border-b border-gray-200">
          <div class="flex justify-center gap-x-6">
            <Recorder @audioData="sendAudioData" />
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div class="px-4 pt-4 bg-white border-b border-gray-200">
          <div class="overflow-y-auto max-h-96">
            <div
              v-for="(audio, index) in audioSources"
              :key="index"
              class="mb-4"
            >
              <div
                :class="{ 'bg-gray-300 text-zinc-800': isCurrentUser(audio) }"
                class="rounded-lg p-4"
              >
                <div class="flex justify-between items-center">
                  <div
                    :class="{ 'order-2': isCurrentUser(audio) }"
                    class="max-w-sm"
                  >
                    <div class="font-bold text-xl">
                      {{ audio.metadata.username }}
                    </div>
                    <p class="text-gray-700 text-sm">
                      {{ audio.metadata.timestamp | formatDate }}
                    </p>
                  </div>
                  <div
                    :class="{ 'order-1': isCurrentUser(audio) }"
                    class="flex justify-end w-1/2"
                  >
                    <audio
                      :src="audio.audioData"
                      controls
                      class="w-full focus:outline-none focus:ring focus:ring-indigo-300"
                    ></audio>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

    ws.onopen = this.handleWebSocketOpen;
    ws.onmessage = this.handleWebSocketMessage;
    ws.onerror = this.handleWebSocketError;
    ws.onclose = this.handleWebSocketClose;
  },
  methods: {
    sendAudioData(audioData) {
      const metadata = {
        username: this.username,
        timestamp: new Date(),
      };
      ws.send(JSON.stringify({ metadata, audioData }));
    },
    promptForUsername() {
      let username = null;
      while (!username) {
        username = prompt("Please enter your username:");
      }
      this.username = username;
    },
    isCurrentUser(audio) {
      return audio.metadata.username === this.username;
    },
    handleWebSocketOpen() {
      console.log("WebSocket connection established from mounted");
    },
    handleWebSocketMessage(event) {
      this.audioSources.push(JSON.parse(event.data));
    },
    handleWebSocketError(error) {
      console.error("WebSocket error:", error);
    },
    handleWebSocketClose() {
      console.log("WebSocket connection closed");
    },
  },
  filters: {
    formatDate(value) {
      return new Date(value).toLocaleString();
    },
  },
};
</script>
