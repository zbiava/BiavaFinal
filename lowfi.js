const ctx = new AudioContext();
const gainNode = ctx.createGain();
gainNode.connect(ctx.destination);

let audioBuffer;
let sourceNode = null;

// Select elements
const fileInput = document.querySelector(".file-upload");
const playBtn = document.querySelector(".play-button");
const statusText = document.querySelector(".status");

// Load audio file
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const arrayBuffer = await file.arrayBuffer();
  audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  statusText.textContent = `Loaded: ${file.name}`;
});

// Play audio
playBtn.addEventListener("click", () => {
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
    statusText.textContent = "Playback ended.";
  };
  sourceNode.start();
  statusText.textContent = "Playing...";
});
