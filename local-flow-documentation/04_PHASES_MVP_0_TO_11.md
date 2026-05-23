# 04 — MVP Phases 0 to 11

These phases create the first usable local dictation app.

## Phase 0 — Project Foundation

### Goal

Create the basic Electron + React + TypeScript project.

### Scope

Only create the project foundation.

### Expected Result

The app opens on Windows and shows:

- Local Flow
- Local voice typing for Windows
- App Ready

### Acceptance Checklist

- App opens on Windows.
- UI loads successfully.
- No startup errors.
- Clean folder structure exists.
- App can run in development mode.

### Do Not Add Yet

- No microphone.
- No transcription.
- No Ollama.
- No shortcut.
- No paste system.

---

## Phase 1 — Tray App and Basic Window Behavior

### Goal

Make the app behave like a background desktop utility.

### Scope

Add:

- System tray icon
- Show main window
- Hide main window
- Quit app
- Minimize to tray behavior

### Tray Menu

- Open Local Flow
- Settings
- Quit

### Acceptance Checklist

- App runs in background.
- Tray icon is visible.
- Window can be reopened from tray.
- Quit works correctly.

---

## Phase 2 — Global Shortcut System

### Goal

Allow user to trigger Local Flow from anywhere in Windows.

### Default Shortcut

Ctrl + Space

### Expected Behavior

When the shortcut is pressed:

- App detects it even when another app is active.
- App status changes to "Shortcut Pressed".
- No recording happens yet.

### Important Note

For this phase, detecting shortcut press is enough.

Do not require shortcut release detection yet.

Electron `globalShortcut` supports global shortcut press callbacks, but not true key release tracking for hold-to-talk behavior.

If hold-to-talk is required later, implement it with a lower-level Windows keyboard hook or another native input approach.

### Implementation Note

If the product later changes from toggle recording to hold-to-talk recording, do not assume Phase 2 shortcut handling is enough.

Global press-only shortcut handling and real release detection are different requirements.

### Acceptance Checklist

- Shortcut works globally.
- Shortcut works while another app is active.
- App status changes when shortcut is pressed.
- App handles shortcut registration failure.
- User sees clear error if shortcut is already used.

---

## Phase 3 — Recording State Machine

### Goal

Create internal recording states before recording real audio.

### Required States

- Idle
- Starting Recording
- Recording
- Stopping Recording
- Processing
- Completed
- Error

### Expected Behavior

First shortcut press:

Idle → Starting Recording → Recording

Second shortcut press:

Recording → Stopping Recording → Processing → Completed

### Acceptance Checklist

- Shortcut toggles between idle and recording state.
- UI clearly shows current state.
- State transitions are predictable.
- No microphone access is required yet.

---

## Phase 4 — Floating Recording Overlay

### Goal

Create the visual overlay shown during recording.

### Overlay Should Show

- Recording dot or microphone icon
- Recording status
- Timer
- Cancel option

### Recommended Position

Bottom center of screen.

### Acceptance Checklist

- Overlay appears during recording.
- Overlay disappears after completion.
- Timer works.
- Overlay does not block normal workflow too much.

---

## Phase 5 — Microphone Permission and Device Detection

### Goal

Detect available microphones and allow user to select one.

### Settings Should Show

- Available microphones
- Selected microphone
- Test microphone button
- Input volume indicator

### Acceptance Checklist

- Microphone permission works.
- Device list appears.
- Selected device is saved.
- Volume indicator responds to voice.
- App handles missing microphone gracefully.

---

## Phase 6 — Basic Audio Recording

### Goal

Record user voice and save it temporarily.

### Recording Format

Use a Whisper-friendly audio format:

- WAV
- Mono preferred
- 16 kHz or 44.1 kHz

### Expected Behavior

Shortcut starts recording.

Second shortcut stops recording.

Audio file is saved temporarily.

### Acceptance Checklist

- User can record audio.
- Audio file is created.
- Audio file contains spoken voice.
- Recording can be cancelled.
- Short recordings are handled safely.

---

## Phase 7 — Local Speech-to-Text Service Foundation

### Goal

Prepare the local speech-to-text service.

### Recommended Engine

Use faster-whisper first.

### Service Responsibility

The service should:

- Load Whisper model.
- Accept audio file.
- Transcribe audio.
- Return plain text.
- Return language if available.
- Return processing time.

### Recommended First Model

For English only:

- small.en

For English + Bangla:

- medium multilingual

Recommended for this project:

- medium multilingual

### Acceptance Checklist

- STT service starts locally.
- Model loads successfully.
- A sample audio file can be transcribed.
- Text result is returned.
- No paid API is used.

---

## Phase 8 — Connect Recording to Transcription

### Goal

Send recorded audio to local STT and receive text.

### Expected Behavior

User flow:

1. Press shortcut.
2. Speak.
3. Press shortcut again.
4. App processes audio.
5. Raw transcribed text appears in Local Flow.

### Acceptance Checklist

- User can speak and get text.
- Text appears inside app.
- No cloud API is called.
- App handles empty speech.
- App handles unclear audio.

---

## Phase 9 — Clipboard and Paste System

### Goal

Paste the transcribed text into the active app.

### Expected Behavior

User opens a text field in another app, speaks, and the final text is pasted.

### Clipboard Safety Requirement

The app should:

- Save current clipboard content.
- Put final text into clipboard.
- Send paste command.
- Restore previous clipboard after paste.

### Settings Option

Auto-paste after transcription: On / Off

### Acceptance Checklist

- Text pastes into active app.
- Clipboard is restored after paste.
- Auto-paste can be turned on/off.
- Manual copy works.
- Manual paste works.

---

## Phase 10 — Ollama Integration Foundation

### Goal

Connect app to local Ollama.

### Settings Should Show

- Ollama status
- Selected model
- Available local models if possible
- Test prompt button

### Expected Behavior

App detects:

- Ollama installed
- Ollama running
- Model available
- Model missing
- Connection failed

### Recommended First Model

- qwen2.5:7b

Alternative:

- llama3.1:8b

### Acceptance Checklist

- App can connect to local Ollama.
- App can select a model.
- App can send test text.
- App receives a response.
- App shows helpful error if Ollama is not running.

---

## Phase 11 — Basic AI Cleanup Mode

### Goal

Use Ollama to improve raw transcription.

### First Cleanup Mode

Clean Dictation

### Clean Dictation Should

- Fix grammar.
- Remove filler words.
- Fix punctuation.
- Keep original meaning.
- Return only final text.

### Settings Option

Text mode:

- Raw transcription
- Clean dictation

### Acceptance Checklist

- Raw mode works.
- Clean mode works.
- Cleaned result is better than raw text.
- User can switch modes.
- If Ollama fails, app falls back to raw text.
