const ctx = new AudioContext();
let audiobuffer, sourceNode;
const gain = ctx.createGain();
gain.connect(ctx.destination);

const loadAndDecode = async function (event) {
  let file = event.target.files[0];
  let arraybuf = await file.arrayBuffer();
  audiobuffer = await ctx.decodeAudioData(arraybuf);
};

const playBuffer = function () {
  if (audiobuffer) {
    if (!sourceNode) {
      sourceNode = new AudioBufferSourceNode(ctx, { buffer: audiobuffer });
      sourceNode.onended = () => {
        sourceNode.disconnect();
        sourceNode = null;
      };
      sourceNode.connect(gain);
      sourceNode.start();
    } else {
      alert("Audio file already playing.");
    }
  } else {
    alert("Please upload an audio file.");
  }
};

const revAudioBuffer = function () {
  for (let ch = 0; ch < audiobuffer.numberOfChannels; ch++) {
    let revData = audiobuffer.getChannelData(ch).reverse();
    audiobuffer.copyToChannel(revData, ch);
  }
};

document.querySelector("#fileUpload").addEventListener("change", loadAndDecode);
document.querySelector("#play").addEventListener("click", playBuffer);
document.querySelector("#reverse").addEventListener("click", revAudioBuffer);
