// 
// ------audio setup------

const ctx = new (window.AudioContext || window.webkitAudioContext)();

let audioBuffer = null;
let currentSource = null;

// ------master gain------
const master = ctx.createGain();
master.gain.value = 1;
master.connect(ctx.destination);

// --------filter------
const filter = ctx.createBiquadFilter();
filter.type = "lowpass";
filter.frequency.value = 4000;
filter.connect(master);

// -----------delay-------
const delay = ctx.createDelay(1.0);
const delayWet = ctx.createGain();
const delayFeedback = ctx.createGain();

delayWet.gain.value = 0; 
delayFeedback.gain.value = 0.3;

// routing
delay.connect(delayWet);
delayWet.connect(filter);

// feedback loop
delay.connect(delayFeedback);
delayFeedback.connect(delay);

// -----------chorus effect-----------
const chorusDelay = ctx.createDelay(0.03);
const chorusDepth = ctx.createGain();
const chorusLFO = ctx.createOscillator();

chorusDepth.gain.value = 0.01;
chorusLFO.frequency.value = 0.25;

chorusLFO.connect(chorusDepth);
chorusDepth.connect(chorusDelay.delayTime);

chorusDelay.connect(filter);

chorusLFO.start();

// --------load audio-----------
document.getElementById("audioFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const buf = await file.arrayBuffer();
  audioBuffer = await ctx.decodeAudioData(buf);

  console.log("Loaded audio:", audioBuffer.duration, "seconds");
});

// -----------chops-----------
function rebuildChopButtons() {
  const count = Number(document.getElementById("sliceCount").value);
  const div = document.getElementById("chopButtons");
  div.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Chop ${i + 1}`;
    btn.onclick = () => playChop(i);
    div.appendChild(btn);
  }
}

document.getElementById("sliceCount").onchange = rebuildChopButtons;
rebuildChopButtons();

// ----------play chop--------
function playChop(index) {
  if (!audioBuffer) return;

  // clean stop
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {}
  }

  const count = Number(document.getElementById("sliceCount").value);
  const sliceLen = audioBuffer.duration / count;

  const src = ctx.createBufferSource();
  src.buffer = audioBuffer;

 
  src.connect(filter); 
  src.connect(delay);
  src.connect(chorusDelay); 

  src.start(0, index * sliceLen, sliceLen);

  currentSource = src;
}

// -----------stop---------
document.getElementById("stopBtn").onclick = () => {
  if (currentSource) {
    try {
      currentSource.stop(ctx.currentTime + 0.01);
    } catch (e) {}
    currentSource = null;
  }
};

// --------UI--------
document.getElementById("volume").oninput = (e) =>
  (master.gain.value = e.target.value);

document.getElementById("delay").oninput = (e) =>
  (delayWet.gain.value = e.target.value);

document.getElementById("chorus").oninput = (e) =>
  (chorusDepth.gain.value = e.target.value);

document.getElementById("filterType").onchange = (e) =>
  (filter.type = e.target.value);

document.getElementById("filterCutoff").oninput = (e) =>
  (filter.frequency.value = e.target.value);
