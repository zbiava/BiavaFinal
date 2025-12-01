// ==== AUDIO CONTEXT ====
const ctx = new (window.AudioContext || window.webkitAudioContext)();

let audioBuffer = null;
let currentSource = null;

// ==== MASTER OUT ====
const masterGain = ctx.createGain();
masterGain.gain.value = 1;
masterGain.connect(ctx.destination);

// ==== FILTER ====
const filter = ctx.createBiquadFilter();
filter.type = "lowpass";
filter.frequency.value = 4000;

// Filter → Master
filter.connect(masterGain);

// ==== DELAY ====
const delay = ctx.createDelay(1.0);
const delayGain = ctx.createGain();
delayGain.gain.value = 0;

delay.connect(delayGain);
delayGain.connect(masterGain); // corrected routing

// ==== REVERB ====
const convolver = ctx.createConvolver();
const reverbGain = ctx.createGain();
reverbGain.gain.value = 0;

convolver.connect(reverbGain);
reverbGain.connect(masterGain); // corrected routing

// ==== CHORUS ====
const chorusDelay = ctx.createDelay(0.03);
const chorusDepth = ctx.createGain();
const chorusLFO = ctx.createOscillator();

chorusLFO.frequency.value = 0.25;
chorusDepth.gain.value = 0.01;

chorusLFO.connect(chorusDepth);
chorusDepth.connect(chorusDelay.delayTime);

chorusDelay.connect(masterGain); // corrected routing

chorusLFO.start();

// ==== LOAD AUDIO ====
document.getElementById("audioFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const buffer = await file.arrayBuffer();
  audioBuffer = await ctx.decodeAudioData(buffer);

  // unlock audio on iOS
  ctx.resume();
});

// ==== BUILD CHOP BUTTONS ====
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

// ==== PLAY CHOP ====
function playChop(i) {
  if (!audioBuffer) return;

  // stop any active source
  if (currentSource) currentSource.stop();

  const sliceCount = Number(document.getElementById("sliceCount").value);
  const chopLen = audioBuffer.duration / sliceCount;

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;

  // MAIN ROUTING
  source.connect(filter);
  source.connect(delay);
  source.connect(convolver);
  source.connect(chorusDelay);

  source.start(0, i * chopLen, chopLen);

  currentSource = source;
}

// ==== STOP BUTTON ====
document.getElementById("stopBtn").onclick = () => {
  if (currentSource) currentSource.stop();
  currentSource = null;
};

// ==== SLIDER HANDLERS ====
document.getElementById("volume").oninput = (e) =>
  (masterGain.gain.value = Number(e.target.value));

document.getElementById("delay").oninput = (e) =>
  (delayGain.gain.value = Number(e.target.value));

document.getElementById("reverb").oninput = (e) =>
  (reverbGain.gain.value = Number(e.target.value));

document.getElementById("chorus").oninput = (e) =>
  (chorusDepth.gain.value = Number(e.target.value));

document.getElementById("filterCutoff").oninput = (e) =>
  (filter.frequency.value = Number(e.target.value));

document.getElementById("filterType").onchange = (e) =>
  (filter.type = e.target.value);
