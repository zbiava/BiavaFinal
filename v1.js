let audioCtx;
let gainNode;
let audioBuffer = null;
let slices = [];
let currentSource = null;

// start audio context
function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
  }
}

// Load and decode the uploaded audio file
async function loadAndDecode(e) {
  initAudioContext();

  const file = e.target.files[0];
  if (!file) return;

  const arrayBuf = await file.arrayBuffer();
  audioBuffer = await audioCtx.decodeAudioData(arrayBuf);

  document.getElementById("status").textContent = `Loaded: ${file.name}`;
  console.log("Loaded audio:", file.name);

  createSlices();
}

// Create 4 slices
function createSlices() {
  slices = [];
  const sliceCount = 4;
  const sliceLength = Math.floor(audioBuffer.length / sliceCount);

  for (let i = 0; i < sliceCount; i++) {
    const start = i * sliceLength;
    const end = start + sliceLength;

    const sliceBuffer = audioCtx.createBuffer(
      audioBuffer.numberOfChannels,
      sliceLength,
      audioBuffer.sampleRate
    );

    for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
      const channelData = audioBuffer.getChannelData(ch).slice(start, end);
      sliceBuffer.copyToChannel(channelData, ch, 0);
    }

    slices.push(sliceBuffer);
  }

  console.log("Created 4 slices.");
  document.getElementById("status").textContent = "Audio sliced into 4 parts.";
}

// Play one slice and stop others
function playSlice(index) {
  if (!audioBuffer) {
    alert("Please load an audio file first.");
    return;
  }

  stopAudio();

  const slice = slices[index];
  if (!slice) {
    console.error("Slice not found!");
    return;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = slice;
  source.connect(gainNode);
  source.start(0);

  currentSource = source;
  console.log(`Playing slice ${index + 1}`);

  source.onended = () => {
    if (currentSource === source) currentSource = null;
  };
}

// Stop audio playback
function stopAudio() {
  if (currentSource) {
    currentSource.stop();
    currentSource.disconnect();
    currentSource = null;
    console.log("Stopped playback");
  }
}

// Event listeners
document.getElementById("fileUpload").addEventListener("change", loadAndDecode);
document.getElementById("slice1").addEventListener("click", () => playSlice(0));
document.getElementById("slice2").addEventListener("click", () => playSlice(1));
document.getElementById("slice3").addEventListener("click", () => playSlice(2));
document.getElementById("slice4").addEventListener("click", () => playSlice(3));
document.getElementById("stop").addEventListener("click", stopAudio);
