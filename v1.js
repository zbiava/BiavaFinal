

let audioCtx = null;
let masterGain = null;
let originalBuffer = null;
let sliceBuffers = []; // will hold 4 AudioBuffers


const fileInput = document.querySelector("#fileUpload");
const statusText = document.querySelector("#status");
const playFullBtn = document.querySelector("#playFull");
const sliceBtns = [
  document.querySelector("#slice0"),
  document.querySelector("#slice1"),
  document.querySelector("#slice2"),
  document.querySelector("#slice3"),
];

function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.9;
    masterGain.connect(audioCtx.destination);
  }
}


fileInput.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  ensureAudioContext();

  try {
    const arrayBuffer = await file.arrayBuffer();
    originalBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    statusText.textContent = `Loaded: ${
      file.name
    } — ${originalBuffer.duration.toFixed(2)}s`;

    
    createFourSlices(originalBuffer);

    
    sliceBtns.forEach((b) => (b.disabled = false));
    playFullBtn.disabled = false;
  } catch (err) {
    console.error("Error decoding audio:", err);
    statusText.textContent = "Error decoding audio file.";
  }
});


function createFourSlices(sourceBuffer) {
  sliceBuffers = []; 
  const totalFrames = sourceBuffer.length;
  const sampleRate = sourceBuffer.sampleRate;
  const channels = sourceBuffer.numberOfChannels;
  const sliceFrames = Math.floor(totalFrames / 4);

  for (let sliceIndex = 0; sliceIndex < 4; sliceIndex++) {
    
    const startFrame = sliceIndex * sliceFrames;
    const endFrame = sliceIndex === 3 ? totalFrames : startFrame + sliceFrames;
    const framesCount = endFrame - startFrame;

  
    const newBuf = audioCtx.createBuffer(channels, framesCount, sampleRate);

    
    for (let ch = 0; ch < channels; ch++) {
      const sourceData = sourceBuffer.getChannelData(ch);
      
      const sliceData = sourceData.subarray(startFrame, endFrame);
      
      newBuf.copyToChannel(sliceData, ch, 0);
    }

    sliceBuffers.push(newBuf);
  }

  statusText.textContent += ` — created 4 slices (${(
    sliceBuffers[0].length / sampleRate
  ).toFixed(2)}s each approx.)`;
}


function playBuffer(buf) {
  if (!buf) return;
  
  if (audioCtx.state === "suspended") audioCtx.resume();

  const src = audioCtx.createBufferSource();
  src.buffer = buf;
  src.connect(masterGain);
  src.onended = () => {
    
    statusText.textContent = "Playback ended.";
  };
  src.start();
  statusText.textContent = `Playing (${buf.duration.toFixed(2)}s)`;
}

playFullBtn.addEventListener("click", () => {
  if (!originalBuffer) {
    alert("Please load an audio file first.");
    return;
  }
  playBuffer(originalBuffer);
});


sliceBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    if (!sliceBuffers[idx]) {
      alert("Slice not ready.");
      return;
    }
    playBuffer(sliceBuffers[idx]);
  });
});

sliceBtns.forEach((b) => (b.disabled = true));
playFullBtn.disabled = true;
statusText.textContent = "No file loaded.";
