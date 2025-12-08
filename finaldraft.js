// AUDIO CONTEXT
const ctx = new (window.AudioContext || window.webkitAudioContext)();

let audioBuffer = null;
let currentSource = null;

// === MASTER OUT ===
const masterGain = ctx.createGain();
masterGain.connect(ctx.destination);

// === FILTER ===
const filter = ctx.createBiquadFilter();
filter.type = "lowpass";
filter.frequency.value = 4000;
filter.connect(masterGain);

// === DELAY (fixed!) ===
const delay = ctx.createDelay(1.0);
const delayWet = ctx.createGain();
const delayFeedback = ctx.createGain();

// default values
delayWet.gain.value = 0;
delayFeedback.gain.value = 0.3;

delay.connect(delayWet);
delayWet.connect(filter);

// feedback loop
delay.connect(delayFeedback);
delayFeedback.connect(delay);

// === CHORUS ===
const chorusDelay = ctx.createDelay(0.03);
const chorusDepth = ctx.createGain();
const chorusLFO = ctx.createOscillator();

chorusLFO.frequency.value = 0.25;
chorusDepth.gain.value = 0.01;

chorusLFO.connect(chorusDepth);
chorusDepth.connect(chorusDelay.delayTime);

chorusDelay.connect(filter);
chorusLFO.start();

// === LOAD AUDIO ===
document.getElementById("audioFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const buf = await file.arrayBuffer();
  audioBuffer = await ctx.decodeAudioData(buf);
});

// === BUILD BUTTONS ===
function rebuildChopButtons() {
  const sliceCount = Number(document.getElementById("sliceCount").value);
  const container = document.getElementById("chopButtons");
  container.innerHTML = "";

  for (let i = 0; i < sliceCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = "Chop " + (i + 1);
    btn.onclick = () => playChop(i);
    container.appendChild(btn);
  }
}

rebuildChopButtons();
document.getElementById("sliceCount").onchange = rebuildChopButtons;

// === PLAY CHOP ===
function playChop(i) {
  if (!audioBuffer) return;

  if (currentSource) currentSource.stop();

  const sliceCount = Number(document.getElementById("sliceCount").value);
  const chopLen = audioBuffer.duration / sliceCount;

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;

  // routing
  source.connect(filter); // dry
  source.connect(delay); // send to delay
  source.connect(chorusDelay); // chorus send

  source.start(0, i * chopLen, chopLen);
  currentSource = source;
}

// === STOP BUTTON ===
document.getElementById("stopBtn").onclick = () => {
  if (currentSource) currentSource.stop();
  currentSource = null;
};

// === SLIDERS ===
document.getElementById("volume").oninput = (e) =>
  (masterGain.gain.value = e.target.value);

document.getElementById("delay").oninput = (e) =>
  (delayWet.gain.value = e.target.value); // FIXED → adjusts wet level

document.getElementById("chorus").oninput = (e) =>
  (chorusDepth.gain.value = e.target.value);

document.getElementById("filterCutoff").oninput = (e) =>
  (filter.frequency.value = e.target.value);

document.getElementById("filterType").onchange = (e) =>
  (filter.type = e.target.value);
