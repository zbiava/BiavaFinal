const ctx = new AudioContext();
const gainNode = ctx.createGain();
gainNode.connect(ctx.destination);

let audioBuffer;
let sourceNode = null;

// Load audio file
document.getElementById("fileUpload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const arrayBuffer = await file.arrayBuffer();
  audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  document.getElementById("status").textContent = `Loaded: ${file.name}`;
});

// Play audio
document.getElementById("play").addEventListener("click", () => {
  if (!audioBuffer) {
    alert("Please upload a file first.");
    return;
  }
  if (sourceNode) {
    alert("Audio is already playing.");
    return;
  }
  sourceNode = ctx.createBufferSource();
  sourceNode.buffer = audioBuffer;
  sourceNode.connect(gainNode);
  sourceNode.onended = () => {
    sourceNode.disconnect();
    sourceNode = null;
    document.getElementById("status").textContent = "Playback ended.";
  };
  sourceNode.start();
  document.getElementById("status").textContent = "Playing...";
});
