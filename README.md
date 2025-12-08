# Chop Sampler – Final Version

## Overview
Chop Sampler is a browser-based audio slicing tool built using the Web Audio API.  
Users can upload an audio file, divide it into “chops,” and trigger slices individually with built-in effects like delay, chorus, and filtering.

This project demonstrates fundamental audio programming techniques, dynamic UI generation, and real-time DSP routing inside a web application.

---

## Features

### **Audio Chopping**
- Upload any audio file.
- Select number of slices (1–64).
- Generates buttons for each chop.
- Each button plays a specific slice of the audio.

### **Playback**
- Smooth, click-free stopping.
- Only one chop plays at a time.
- Clean routing into a master output.

---

## Effects

### **Master Volume**
Controls final audio output level.

### **Filter**
Biquad filter with:
- Lowpass  
- Highpass  
- Bandpass  
And adjustable cutoff frequency.

### **Delay**
- Adjustable wet mix.
- Feedback loop for repeating echoes.

### **Chorus**
- LFO-modulated micro-delay.
- Adjustable modulation depth.

---

## Technology Used
- **HTML / JavaScript**
- **Web Audio API**  
- Audio nodes used:
  - `AudioBufferSourceNode`
  - `GainNode`
  - `BiquadFilterNode`
  - `DelayNode`
  - `OscillatorNode`

## *Markdown written with the assistance of ChatGPT*