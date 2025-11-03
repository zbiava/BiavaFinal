# 🎧 Audio Buffer Loader & Reverser – Design Document

## Project Overview
This project is a simple web-based audio tool built with the **Web Audio API**. It allows users to upload an audio file, decode it into an `AudioBuffer`, play it back, and reverse the audio for backward playback. This prototype demonstrates the core functionality for a future live sampler.

---

## Software Architecture (Block Diagram)

[User Uploads File]
↓
[File Input Element]
↓
[loadAndDecode() → decodes file to AudioBuffer]
↓
[AudioBuffer stored in memory]
↓
[playBuffer() or revAudioBuffer()]
↓
[Gain Node → AudioContext → Speakers]

### Main Components
- **AudioContext:** Manages audio processing and routing.
- **AudioBuffer:** Holds decoded audio data.
- **Gain Node:** Controls output volume.
- **Buttons & File Input:** User interface for file upload, playback, and reversal.

---

## User Interface Design (Wireframe)


### Interface Elements
- **Choose File:** Opens local file selector for audio upload.
- **Play Button:** Plays the decoded buffer through the `AudioContext`.
- **Reverse Button:** Reverses the `AudioBuffer` for backward playback.
- **Status Indicator:** Displays current state or error messages.

---

## System Workflow
1. **Upload Phase**
   - User selects an audio file.
   - The file is read and decoded into an `AudioBuffer` using `decodeAudioData()`.

2. **Playback Phase**
   - When “Play” is clicked, the `AudioBuffer` connects to a `GainNode`, then outputs through the `AudioContext`.
   - A safeguard prevents playing multiple overlapping buffers.

3. **Reversal Phase**
   - Clicking “Reverse” runs a loop through all channels in the buffer.
   - Each channel’s sample data is reversed using `.getChannelData()` and `.reverse()`.
   - The modified data is copied back to the buffer.

4. **End Phase**
   - When playback finishes, the `sourceNode` disconnects to free memory and reset state.

---

## Current Prototype Code
```javascript
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
