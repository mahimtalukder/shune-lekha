# 07 — Codex Prompts by Phase

Use these prompts one by one. Do not ask Codex to build the full app at once.

## Universal Prompt Template

We are building a Windows desktop app named Local Flow.

Main goal:
A local Wispr Flow-like dictation app that uses local speech-to-text and optional Ollama cleanup.

Current task:
Implement Phase [NUMBER]: [PHASE NAME].

Important rules:
- Implement only this phase.
- Do not add future features.
- Keep the architecture clean for later phases.
- Use TypeScript where applicable.
- Keep UI simple and professional.
- Add clear error handling.
- After completing, explain what changed and how to test it.

Acceptance criteria:
[Paste the acceptance checklist from the phase.]

---

## Phase 0 Prompt

Implement Phase 0: Project Foundation.

Create the basic Electron + React + TypeScript project foundation for Local Flow.

The first screen should show:
- Local Flow
- Local voice typing for Windows
- App Ready

Do not add microphone, shortcut, transcription, Ollama, or paste features yet.

After implementation, explain:
- How to run the app
- What files were created
- How to test this phase

---

## Phase 1 Prompt

Implement Phase 1: Tray App and Basic Window Behavior.

Add system tray support with:
- Open Local Flow
- Settings
- Quit

Closing the window should not fully quit the app. The app should continue running in the tray.

Do not add microphone, shortcut, transcription, or paste features yet.

---

## Phase 2 Prompt

Implement Phase 2: Global Shortcut System.

Add a default global shortcut:
Ctrl + Space

When the shortcut is pressed, update the app status to:
Shortcut Pressed

The shortcut must work even when another application is focused.

For this phase, detect press only.
Do not implement shortcut release detection yet.
If hold-to-talk is needed later, use a lower-level Windows-specific input approach instead of assuming Electron `globalShortcut` can detect release.

Do not start recording yet.

---

## Phase 3 Prompt

Implement Phase 3: Recording State Machine.

Create these states:
- Idle
- Starting Recording
- Recording
- Stopping Recording
- Processing
- Completed
- Error

Shortcut press should toggle through fake recording flow only.

No microphone access yet.

---

## Phase 4 Prompt

Implement Phase 4: Floating Recording Overlay.

Create a small always-on-top overlay that appears during the fake recording state.

Overlay should show:
- Recording status
- Timer
- Cancel option

Do not add real microphone recording yet.

---

## Phase 5 Prompt

Implement Phase 5: Microphone Permission and Device Detection.

Add microphone settings page with:
- Available microphones
- Selected microphone
- Test microphone button
- Input volume indicator

Do not add transcription yet.

---

## Phase 6 Prompt

Implement Phase 6: Basic Audio Recording.

Add real audio recording.

When recording starts, capture microphone audio.
When recording stops, save a temporary audio file suitable for Whisper.

Do not add transcription yet.

---

## Phase 7 Prompt

Implement Phase 7: Local Speech-to-Text Service Foundation.

Create a local STT service integration plan and service layer in the app.

The service should be able to:
- Start locally
- Accept an audio file
- Return transcription text
- Return errors safely

Do not connect it to recording yet unless required for a small test.

---

## Phase 8 Prompt

Implement Phase 8: Connect Recording to Transcription.

After recording stops, send the temporary audio file to the local STT service and show raw text in the app.

Do not add auto-paste or Ollama cleanup yet.

---

## Phase 9 Prompt

Implement Phase 9: Clipboard and Paste System.

After transcription, support:
- Manual copy
- Manual paste
- Auto-paste toggle
- Clipboard restore after paste

Do not add Ollama cleanup yet.

---

## Phase 10 Prompt

Implement Phase 10: Ollama Integration Foundation.

Add settings to check local Ollama status and selected model.

The app should:
- Detect if Ollama is running
- Send a test prompt
- Show response or helpful error

Do not apply cleanup to transcription yet.

---

## Phase 11 Prompt

Implement Phase 11: Basic AI Cleanup Mode.

Add two text modes:
- Raw transcription
- Clean dictation

Clean dictation should use local Ollama.
If Ollama fails, fall back to raw transcription.

---

## How to Continue After Phase 11

After Phase 11, continue with the same pattern:

1. Copy the phase from the documentation.
2. Paste the universal prompt template.
3. Replace phase number and name.
4. Paste the acceptance checklist.
5. Tell Codex: "Implement only this phase."
