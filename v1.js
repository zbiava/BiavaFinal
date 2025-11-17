let audioCtx;
let gainNode;
let audioBuffer = null;
let slices = [];
let currentSource = null;

// Initialize context only once
function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);

    // attach volume slider
    document.getElementById("volume").addEventListener("input", (e) => {
      gainNode.gain.value = e.target.value;
    });
  }
}

// Load and decode audio
async function loadAndDecode(e) {
  initAudioContext();

  const file = e.target.files[0];
  if (!file) return;

  const arrayBuf = await file.arrayBuffer();
  audioBuffer = await audioCtx.decodeAudioData(arrayBuf);

  document.getElementById("status").textContent = `Loaded: ${file.name}`;
  console.log("Loaded audio:", file.name);

  createSlices(8);
}

// Create N equal-length slices
function createSlices(count) {
  slices = [];
  const sliceLength = Math.floor(audioBuffer.length / count);

  for (let i = 0; i < count; i++) {
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

  document.getElementById("status").textContent = `Created ${count} slices.`;
  console.log(`Created ${count} slices.`);
}

// Play a specific slice
function playSlice(index) {
  if (!audioBuffer) {
    alert("Load an audio file first.");
    return;
  }

  stopAudio(); // stop previous slice

  const slice = slices[index];
  if (!slice) return;

  const source = audioCtx.createBufferSource();
  source.buffer = slice;
  source.connect(gainNode);
  source.start();

  currentSource = source;

  source.onended = () => {
    if (currentSource === source) currentSource = null;
  };
}

// Stop audio
function stopAudio() {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {}
    currentSource.disconnect();
    currentSource = null;
  }
}

// Attach listeners
document.getElementById("fileUpload").addEventListener("change", loadAndDecode);

document.getElementById("slice1").addEventListener("click", () => playSlice(0));
document.getElementById("slice2").addEventListener("click", () => playSlice(1));
document.getElementById("slice3").addEventListener("click", () => playSlice(2));
document.getElementById("slice4").addEventListener("click", () => playSlice(3));
document.getElementById("slice5").addEventListener("click", () => playSlice(4));
document.getElementById("slice6").addEventListener("click", () => playSlice(5));
document.getElementById("slice7").addEventListener("click", () => playSlice(6));
document.getElementById("slice8").addEventListener("click", () => playSlice(7));

document.getElementById("stop").addEventListener("click", stopAudio);
