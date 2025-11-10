# Live Sampler — Slice Prototype

## What this does
- Loads an audio file from disk.
- Decodes it to an `AudioBuffer`.
- Splits the buffer into **4 equal slices** (AudioBuffers).
- Provides 4 buttons to play each slice independently, plus a "Play Full" button.

## Files to include
- `index.html` — minimal UI with file input and 5 buttons.
- `script.js` — core logic (AudioContext, decode, create slices, play).
- `style.css` — optional styling.

## How slicing works (brief)
1. Determine total frames (`sourceBuffer.length`) and `sampleRate`.
2. Compute `sliceFrames = Math.floor(totalFrames / 4)`.
3. For each slice, create a new `AudioBuffer` with `framesCount`.
4. Copy channel data subarrays from the source into each slice buffer using `copyToChannel`.
5. Each slice becomes a standalone `AudioBuffer` ready for playback.

## What to test
1. Load a reasonably short audio file (`.wav` or `.mp3` recommended).
2. Click "Play Full" to hear the whole sample.
3. Click each "Slice" button to hear the corresponding segment.

## Next steps (what still needs adding)
- Add UI feedback (highlight active slice button while playing).
- Add a Stop/Pause control to stop currently playing slice.
- Add per-slice gain/pan and looping options.
- Add keyboard/MIDI mapping for triggering slices live.
- Add visual waveform and selectable slice boundaries (allow variable chop lengths).
- Add sample export/save feature for slices.

## Notes
- The code creates the `AudioContext` on first file load so playback won't be blocked by browser policies.
- Each playback creates a new `AudioBufferSourceNode` (they are single-use).
