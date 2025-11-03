# Live Sampler – Requirements Analysis

**Author:** Zachary Biava  
**Course:** Music Technology Final Project  
**Stage 2:** Requirements Analysis  
**Semester:** Fall 2025

---

## Project Description

The **Live Sampler** is a simple browser-based app that lets users **record, load, and play back short audio clips** in real time. It’s designed for musicians and producers who want an easy way to capture and trigger sounds during live performance or experimentation.

Users can record sounds from a microphone, assign them to pads, and play them back instantly. The app will include basic controls for playback, looping, and effects like delay or filter.

---

## Use Cases

### Use Case 1: Live Sampling

**Goal:** Record a sound and trigger it live.

1. User opens the Live Sampler in their browser.
2. Clicks “Record” to capture a short sound.
3. The sample appears on a pad.
4. User clicks or presses a key/MIDI button to play the sample.
5. Optional: adds an effect like reverb or delay.

### Use Case 2: Load and Edit Samples

**Goal:** Import an existing sound file and tweak it.

1. User clicks “Load Sample.”
2. Chooses an audio file from their device.
3. The file loads to a pad.
4. User can trim, loop, or apply effects.

---

## System Requirements

### Functional Requirements

- Record audio from a microphone.
- Load and store short audio samples.
- Assign samples to trigger pads.
- Apply simple effects (delay, reverb, filter).
- Play/stop samples with buttons or keys.
- Basic UI for pad layout and effects.

### Non-Functional Requirements

- Runs in modern browsers (Chrome, Edge, Firefox).
- Low latency for real-time playback.
- Simple, responsive interface.

---

## Constraints and Limitations

- Web Audio API limitations may cause slight latency.
- Only supports short samples (less than ~10 seconds).
- No permanent saving/loading of sample banks in the initial version.
- Performance may vary depending on user’s device and browser.

---

_This document was written with assistance from ChatGPT._
