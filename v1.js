// Core Web Audio setup
let audioCtx;
let gainNode;
let audioBuffer = null;
let sliceBuffers = [];
let isAudioLoaded = false;

// Elements
const fileInput = document.getElementById("fileUpload");
const playFullBtn = document.getElementById("playFull");
const sliceBtns = [
  document.getElementById("slice0"),
  document.getElementById("slice1"),
  document.getElementById("slice2"),
  document.getElementById("slice3"),
];
const statusText = document.getElementById("status");

//---------------------- Setup ----------------------

function setupAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
  }
}

//---------------------- Load and Decode ----------------------

async function loadAndDecode(event) {
  const file = event.target.files[0];
  if (!file) return;

  setupAudioContext();

  try {
    const arrayBuffer = await file.arrayBuffer();
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    isAudioLoaded = true;
    statusText.textContent = `Loaded: ${
      file.name
    } (${audioBuffer.duration.toFixed(2)}s)`;
    enableButtons();
    createSlices(audioBuffer);
  } catch (err) {
    console.error("Error decoding file:", err);
    statusText.textContent = "Error decoding audio file.";
  }
}

//---------------------- Slice Creation ----------------------

function createSlices(buffer) {
  sliceBuffers = [];
  const totalFrames = buffer.length;
  const sliceFrames = Math.floor(totalFrames / 4);
  const sampleRate = buffer.sampleRate;
  const channels = buffer.numberOfChannels;

  for (let i = 0; i < 4; i++) {
    const startFrame = i * sliceFrames;
    const endFrame = i === 3 ? totalFrames : startFrame + sliceFrames;
    const length = endFrame - startFrame;

    const newBuffer = audioCtx.createBuffer(channels, length, sampleRate);

    for (let ch = 0; ch < channels; ch++) {
      const channelData = buffer
        .getChannelData(ch)
        .subarray(startFrame, endFrame);
      newBuffer.copyToChannel(channelData, ch, 0);
    }

    sliceBuffers.push(newBuffer);
  }

  statusText.textContent += " — Created 4 slices.";
}

//---------------------- Playback ----------------------

function playAudioBuffer(buffer) {
  if (!buffer) {
    alert("No audio buffer loaded.");
    return;
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(gainNode);
  source.start();

  statusText.textContent = `Playing ${buffer.duration.toFixed(2)}s`;
  source.onended = () => (statusText.textContent = "Playback ended.");
}

//---------------------- Enable Buttons ----------------------

function enableButtons() {
  playFullBtn.disabled = false;
  sliceBtns.forEach((btn) => (btn.disabled = false));
}

//---------------------- Event Listeners ----------------------

fileInput.addEventListener("change", loadAndDecode);

playFullBtn.addEventListener("click", () => {
  if (isAudioLoaded && audioBuffer) playAudioBuffer(audioBuffer);
  else alert("Please load a file first!");
});

sliceBtns[0].addEventListener("click", () => playAudioBuffer(sliceBuffers[0]));
sliceBtns[1].addEventListener("click", () => playAudioBuffer(sliceBuffers[1]));
sliceBtns[2].addEventListener("click", () => playAudioBuffer(sliceBuffers[2]));
sliceBtns[3].addEventListener("click", () => playAudioBuffer(sliceBuffers[3]));
