let ctx = new (window.AudioContext || window.webkitAudioContext)();

let audioBuffer = null;
let currentSource = null;

// EFFECT NODES
let gainNode = ctx.createGain();

// Delay
let delayNode = ctx.createDelay(1);
delayNode.delayTime.value = 0.25;
let delayGain = ctx.createGain();
delayGain.gain.value = 0;

// Convolution Reverb
let convolver = ctx.createConvolver();
let reverbGain = ctx.createGain();
reverbGain.gain.value = 0;

// Chorus (LFO-modulated delay)
let chorusDelay = ctx.createDelay();
chorusDelay.delayTime.value = 0.015;
let chorusLFO = ctx.createOscillator();
let chorusDepth = ctx.createGain();
chorusDepth.gain.value = 0.005;

chorusLFO.connect(chorusDepth);
chorusDepth.connect(chorusDelay.delayTime);
chorusLFO.start();

// MASTER OUTPUT
gainNode.connect(ctx.destination);
delayNode.connect(delayGain).connect(ctx.destination);
convolver.connect(reverbGain).connect(ctx.destination);
chorusDelay.connect(ctx.destination);

// LOAD IMPULSE RESPONSE FOR REVERB
fetch("ir.wav")
  .then((res) => res.arrayBuffer())
  .then((buf) => ctx.decodeAudioData(buf))
  .then((ir) => (convolver.buffer = ir));

// LOAD AUDIO FILE
document.getElementById("audioFile").onchange = async (e) => {
  let file = e.target.files[0];
  let arrayBuf = await file.arrayBuffer();
  audioBuffer = await ctx.decodeAudioData(arrayBuf);
};

// PLAY CHOP
function playChop(chopIndex) {
  if (!audioBuffer) return;
  if (currentSource) currentSource.stop();

  let source = ctx.createBufferSource();
  source.buffer = audioBuffer;

  let chopSize = audioBuffer.duration / 8;
  let startTime = chopIndex * chopSize;

  // CONNECT EFFECTS
  source.connect(gainNode);
  source.connect(delayNode);
  source.connect(convolver);
  source.connect(chorusDelay);

  source.start(0, startTime, chopSize);
  currentSource = source;
}

// BUTTON HANDLERS
document.querySelectorAll("button[data-chop]").forEach((btn) => {
  btn.onclick = () => {
    let chop = Number(btn.dataset.chop);
    playChop(chop);
  };
});

// EFFECT SLIDERS
document.getElementById("volume").oninput = (e) => {
  gainNode.gain.value = e.target.value;
};

document.getElementById("reverb").oninput = (e) => {
  reverbGain.gain.value = e.target.value;
};

document.getElementById("delay").oninput = (e) => {
  delayGain.gain.value = e.target.value;
};

document.getElementById("chorus").oninput = (e) => {
  chorusDepth.gain.value = e.target.value;
};
