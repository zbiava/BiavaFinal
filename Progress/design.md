# Live Sampler — Design Document (Stage: Design & Prototype)
**Author:** Zachary Biava  
**Course:** Music Technology Final Project  
**Stage:** Design & Prototype  
**Semester:** Fall 2025

---

## 1. Overview
This document describes the high-level architecture, UI wireframes, system workflows, and a low-fidelity prototype for the **Live Sampler**. The prototype implements core functionality: **recording from a microphone**, **importing audio files**, **assigning samples to pads**, **triggering playback**, and **basic real-time effects (filter + delay)**.

---

## 2. Architecture (block diagram — Mermaid)

```mermaid
flowchart TB
  subgraph Browser App
    UI[UI Layer\n(HTML/CSS/JS)]
    Controller[Controller\n(event handlers)]
    AudioEngine[Audio Engine\n(Web Audio API)]
    FileAPI[File I/O\n(import/export)]
    MIDI[Web MIDI (future)]
    Storage[Local Storage (future)]
  end

  UI --> Controller
  Controller --> AudioEngine
  Controller --> FileAPI
  Controller --> Storage
  Controller --> MIDI
  AudioEngine -->|audio nodes| Output[Audio Output (speakers)]
