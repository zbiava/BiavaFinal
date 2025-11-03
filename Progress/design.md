# Design Document – Live Sampler Prototype

## Overview
This document outlines the current design and functionality of the **Live Sampler Prototype**, an early-stage web-based audio tool. The prototype allows users to upload, play, and reverse audio samples in real time using the Web Audio API. This serves as the foundation for a more complex live sampling and looping application.

---

## Current Features

### 1. **Audio Context and Gain Control**
- Creates an `AudioContext` to manage the audio graph.  
- A `GainNode` controls overall playback volume and connects to the destination (speakers).

### 2. **File Upload and Decoding**
- Users can upload an audio file using a file input element.  
- The file is decoded into an `AudioBuffer` for manipulation and playback.

### 3. **Playback System**
- A new `AudioBufferSourceNode` is created to play the decoded audio.  
- The system prevents multiple overlapping playbacks by checking if a source is already active.  
- Playback automatically resets when the sound finishes.

### 4. **Reverse Functionality**
- The `revAudioBuffer()` function reverses all audio channels in the loaded buffer.  
- Enables users to play sounds backward, a common creative tool in sampling.

---

## System Workflow


---

## What Still Needs to Be Added

### Core Additions
- **Looping Controls:** Allow users to continuously loop samples.  
- **Multiple Sample Slots:** Enable loading and triggering of multiple audio clips.  
- **Visual Interface:** Add buttons and sliders for a complete UI experience.  
- **Volume & Pan Controls:** Expand gain control and add stereo positioning.  
- **Real-Time Effects:** Include basic effects (delay, reverb, filter).  

### Technical Enhancements
- **Waveform Display:** Visualize the audio buffer for clarity and control.  
- **Save/Load Samples:** Option to save sample sets locally or via browser storage.  
- **Responsive Error Handling:** Better user feedback and prevention of playback errors.

---

## Technologies Used
- **JavaScript (ES6)**  
- **Web Audio API**  
- **HTML5 File API**  

---

## Next Steps
This prototype serves as the minimal viable product (MVP) for the **Live Sampler** project. The next development stage will focus on:
- Designing the front-end user interface (HTML/CSS or React).  
- Implementing looping and multi-sample features.  
- Building a more modular code structure for scalability.  

---

*This document was created with help from ChatGPT.*
