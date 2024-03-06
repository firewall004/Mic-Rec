<template>
  <div>
    <button
      @click="toggleRecording"
      :class="{ 'bg-red-600': recording, 'bg-indigo-600': !recording }"
      class="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {{ recording ? "Stop Recording" : "Start Recording" }}
    </button>
  </div>
</template>

<script>
export default {
  name: "Recorder",
  data() {
    return {
      recording: false,
      mediaRecorder: null,
      chunks: [],
    };
  },
  methods: {
    async toggleRecording() {
      if (!this.recording) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.addEventListener(
          "dataavailable",
          await this.onDataAvailable
        );
        console.log("START");
        this.mediaRecorder.start();
      } else {
        console.log("STOP");
        this.mediaRecorder.stop();
      }

      this.recording = !this.recording;
    },
    async onDataAvailable(event) {
      this.chunks.push(event.data);
      console.log(event.data);

      await this.sendRecording();
    },
    async sendRecording() {
      console.log("sendRecording");

      const blob = new Blob(this.chunks, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onload = () => {
        const audioData = reader.result;
        // Send audioData via WebSocket
        this.$emit("audioData", audioData);
      };
      reader.readAsDataURL(blob);
      this.chunks = [];
    },
  },
};
</script>
