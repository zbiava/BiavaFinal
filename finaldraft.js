const ctx = new AudioContext();

let audioBuffer = null;
let sourceNode = null;
let gainNode = ctx.createGain();
let delayNode = ctx.createDelay();
let reverbNode = ctx.createConvolver();
let chorusNode = ctx.createDelay();

gainNode.connect(ctx.destination);
delayNode.connect(gainNode);
reverbNode.connect(gainNode);
chorusNode.connect(gainNode);


const fileUpload = document.getElementById("fileUpload");
const canvas = document.getElementById("waveform");
const ctx2d = canvas.getContext("2d");
const chopButtonsDiv = document.getElementById("chopButtons");
const stopBtn = document.getElementById("stop");

const volumeSlider = document.getElementById("volume");
const delaySlider = document.getElementById("delay");
const reverbSlider = document.getElementById("reverb");
const chorusSlider = document.getElementById("chorus");

let numChops = 8;
let chopLength = 0; 
let playhead = 0;
let playheadRAF;

//load audio
fileUpload.addEventListener("change", async (evt) => {
  const file = evt.target.files[0];
  if (!file) return;
  const arrayBuffer = await file.arrayBuffer();
  audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  chopLength = audioBuffer.duration / numChops;
  drawWaveform();
  createChopButtons();
});

//waveform drawer
function drawWaveform() {
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);
  const data = audioBuffer.getChannelData(0);
  const step = Math.ceil(data.length / canvas.width);
  const amp = canvas.height / 2;

  ctx2d.fillStyle = "#333";
  ctx2d.fillRect(0, 0, canvas.width, canvas.height);

  ctx2d.beginPath();
  ctx2d.strokeStyle = "#0f0";
  ctx2d.moveTo(0, amp);
  for (let i = 0; i < canvas.width; i++) {
    const min = data[i * step];
    ctx2d.lineTo(i, amp - min * amp);
  }
  ctx2d.stroke();

  //drawing
  ctx2d.strokeStyle = "#ff0";
  for (let i = 1; i < numChops; i++) {
    const x = (canvas.width / numChops) * i;
    ctx2d.beginPath();
    ctx2d.moveTo(x, 0);
    ctx2d.lineTo(x, canvas.height);
    ctx2d.stroke();
  }
}

//create chop
function createChopButtons() {
  chopButtonsDiv.innerHTML = "";
  for (let i = 0; i < numChops; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Chop ${i + 1}`;
    btn.addEventListener("click", () => playChop(i));
    chopButtonsDiv.appendChild(btn);
  }
}

//play chop
function stopAudio() {
  if (sourceNode) {
    sourceNode.stop();
    sourceNode.disconnect();
    sourceNode = null;
    cancelAnimationFrame(playheadRAF);
  }
}

function playChop(index) {
  if (!audioBuffer) return;
  stopAudio();

  const startTime = index * chopLength;
  const endTime = startTime + chopLength;

  sourceNode = ctx.createBufferSource();
  sourceNode.buffer = audioBuffer;

  // Connect FX chain
  sourceNode.connect(gainNode);
  // fx
  if (delaySlider.value > 0) {
    const delayGain = ctx.createGain();
    delayGain.gain.value = delaySlider.value;
    sourceNode.connect(delayNode);
    delayNode.connect(delayGain).connect(gainNode);
  }
  if (reverbSlider.value > 0) {
    reverbNode.buffer = audioBuffer; 
    const revGain = ctx.createGain();
    revGain.gain.value = reverbSlider.value;
    sourceNode.connect(reverbNode);
    reverbNode.connect(revGain).connect(gainNode);
  }
  if (chorusSlider.value > 0) {
    const osc = ctx.createOscillator();
    const modGain = ctx.createGain();
    modGain.gain.value = 0.01;
    osc.connect(modGain);
    modGain.connect(chorusNode.delayTime);
    osc.start();
    const chorusGain = ctx.createGain();
    chorusGain.gain.value = chorusSlider.value;
    sourceNode.connect(chorusNode);
    chorusNode.connect(chorusGain).connect(gainNode);
  }

  sourceNode.start(0, startTime, chopLength);
  animatePlayhead(startTime);
}

// stop
stopBtn.addEventListener("click", stopAudio);

// vol control
volumeSlider.addEventListener("input", () => {
  gainNode.gain.value = volumeSlider.value;
});

// animation
function animatePlayhead(startTime) {
  const start = ctx.currentTime;
  const duration = chopLength;

  function draw() {
    const elapsed = ctx.currentTime - start;
    const x =
      ((elapsed / duration) * canvas.width) / numChops +
      (startTime / audioBuffer.duration) * canvas.width;
    drawWaveform();
    ctx2d.strokeStyle = "red";
    ctx2d.beginPath();
    ctx2d.moveTo(x, 0);
    ctx2d.lineTo(x, canvas.height);
    ctx2d.stroke();
    if (elapsed < duration) {
      playheadRAF = requestAnimationFrame(draw);
    }
  }
  draw();
}
