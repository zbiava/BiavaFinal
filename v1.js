// ---------------- AUDIO CONTEXT ----------------
let audioCtx;
let gainNode;
let audioBuffer = null;
let sliceBuffers = [];
let isAudioLoaded = false;

// ----------------  SETUP ----------------
function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    console.log("AudioContext initialized!");
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
    console.log("AudioContext resumed!");
  }
}

// ---------------- LOAD AND DECODE ----------------
async function loadAndDecode(file) {
  initAudioContext();
  const arrayBuffer = await file.arrayBuffer();
  audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  console.log("Audio loaded:", audioBuffer.duration, "seconds");

  document.getElementById("status").textContent = `Loaded: ${
    file.name
  } (${audioBuffer.duration.toFixed(2)}s)`;
  isAudioLoaded = true;
  createSlices();
}

// -------------- SLICING ----------------
function createSlices() {
  if (!audioBuffer) return;
  const sliceCount = 4;
  const sliceLength = Math.floor(audioBuffer.length / sliceCount);
  sliceBuffers = [];

  for (let i = 0; i < sliceCount; i++) {
    const start = i * sliceLength;
    const end = i === sliceCount - 1 ? audioBuffer.length : start + sliceLength;
    const slice = audioCtx.createBuffer(
      audioBuffer.numberOfChannels,
      end - start,
      audioBuffer.sampleRate
    );

    for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
      const channelData = audioBuffer.getChannelData(ch).subarray(start, end);
      slice.copyToChannel(channelData, ch, 0);
    }
    sliceBuffers.push(slice);
  }

  console.log("Slices created:", sliceBuffers.length);
  document.getElementById("status").textContent += " | Slices ready!";
}

// ---------- PLAY AUDIO BUFFER ----------------
function playAudioBuffer(buffer) {
  initAudioContext();
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(gainNode);
  source.start(0);
  console.log("Playing audio:", buffer.duration.toFixed(2), "s");
}

// ------------ EVENT LISTENERS ---------
document.getElementById("fileUpload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) loadAndDecode(file);
});

document.getElementById("playFull").addEventListener("click", () => {
  if (isAudioLoaded && audioBuffer) playAudioBuffer(audioBuffer);
  else alert("Please load a file first!");
});

const sliceBtns = document.querySelectorAll(".sliceBtn");
sliceBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (sliceBuffers[index]) {
      playAudioBuffer(sliceBuffers[index]);
    } else {
      alert("Please load an audio file first!");
    }
  });
});
