# Audio Slicer – 8 Chop Web Sampler

This project is a simple browser-based audio slicer built using the **Web Audio API**.  
Users can:

- Upload any audio file  
- Automatically slice it into **8 equal-length chops**  
- Trigger each slice individually  
- Adjust volume with a live GainNode  
- Stop playback at any time  

---

## Features
### Upload Audio
Users load any audio file (`.wav`, `.mp3`, `.aiff`, etc.) using a standard file input.

### Auto-Slicing (8 slices)
The script divides the audio buffer into **8 equal slices**.  
Each chop is stored in its own `AudioBuffer` for individual playback.

### Slice Trigger Buttons
Eight buttons correspond to slices 1–8.

When one slice is playing and another is triggered:
- The current slice stops immediately  
- The newly selected slice plays  

### Volume Control
A simple `<input type="range">` controls the gain node:

- Range: 0.0 – 1.0  
- Real-time volume changes  

### Stop Button
Stops any currently playing slice.
