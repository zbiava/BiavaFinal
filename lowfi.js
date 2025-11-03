const ctx = new AudioContext();
let audioBuffer;

// Load audio file into buffer
document.getElementById("fileUpload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const arrayBuffer = await file.arrayBuffer();
  audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  document.getElementById("status").textContent = `Loaded: ${file.name}`;
});

// Reverse and play
document.getElementById("reversePlay").addEventListener("click", () => {
  if (!audioBuffer) {
    alert("Please upload a file first.");
    return;
  }

  // Reverse each channel
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    audioBuffer.getChannelData(i).reverse();
  }

  const src = ctx.createBufferSource();
  src.buffer = audioBuffer;
  src.connect(ctx.destination);
  src.start();

  document.getElementById("status").textContent = "Playing reversed audio...";
});
