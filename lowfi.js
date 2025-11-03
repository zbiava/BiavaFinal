const ctx = new AudioContext();
const gainNode = ctx.createGain();
gainNode.connect(ctx.destination);

let audioBuffer;

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
playBtn.addEventListener("click", async () => {
  if (!audioBuffer) {
    alert("Please upload a file first.");
    return;
  }

  // Resume AudioContext if suspended
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  // Create a new source node every time you play
  const sourceNode = ctx.createBufferSource();
  sourceNode.buffer = audioBuffer;
  sourceNode.connect(gainNode);

  sourceNode.onended = () => {
    statusText.textContent = "Playback ended.";
  };

  sourceNode.start();
  statusText.textContent = "Playing...";
});
