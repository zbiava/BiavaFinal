//------------------- AUDIO CONTEXT & NODES -------------------
const ctx = new AudioContext();
const gain = new GainNode(ctx);
gain.connect(ctx.destination);

let audioBuffer = null;
let sourceNode = null;

//------------------- FUNCTION DEFINITIONS -------------------

// Load and decode the audio file
const loadAndDecode = async function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  console.log("Audio loaded:", audioBuffer);
};

// Play the loaded audio
const playBuffer = async function () {
  if (!audioBuffer) {
    alert("Please upload an audio file first.");
    return;
  }

  // Resume AudioContext if suspended (required by some browsers)
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  // Create a new source node each time
  sourceNode = new AudioBufferSourceNode(ctx, { buffer: audioBuffer });
  sourceNode.connect(gain);

  sourceNode.onended = () => {
    sourceNode.disconnect();
    sourceNode = null;
  };

  sourceNode.start();
};

//------------------- EVENT LISTENERS -------------------
document.querySelector("#fileUpload").addEventListener("change", loadAndDecode);
document.querySelector("#play").addEventListener("click", playBuffer);
