# FULL PROJECT DESCRIPTION FOR CODEX

# Project Name: Local Flow

## 1. One-Line Summary

Local Flow is a Windows desktop voice dictation app that lets the user press a global shortcut, speak, convert speech to text locally, optionally improve the text using a local Ollama model, and paste the final result into the currently active application.

---

## 2. Main Goal

Build a local alternative to a Wispr Flow-style voice typing app.

The app should work on the user's own Windows machine and should not require:

- Paid API tokens
- Cloud speech-to-text APIs
- Cloud LLM APIs
- Monthly subscriptions
- User accounts
- Internet connection after setup, except for initial model/app downloads

The user wants to use local PC resources:

- 16 GB RAM
- RTX 3060 Ti GPU
- Windows operating system

---

## 3. Developer Skill Context

The developer is comfortable with:

- TypeScript
- JavaScript
- Node.js
- React.js
- Next.js
- GoLang

The developer has not built a desktop app before.

So the project must be:

- Easy to understand
- Phase-based
- Beginner-friendly for desktop development
- Built using familiar frontend technologies where possible

Recommended technology stack:

- Electron for desktop shell
- React for UI
- TypeScript for app code
- Node.js for desktop-side logic
- faster-whisper or whisper.cpp for speech-to-text
- Ollama for local LLM text cleanup
- GoLang only later if a native Windows helper is needed

---

## 4. What Problem This App Solves

Typing is slow, especially for:

- Long messages
- Emails
- Documentation
- PR comments
- Notes
- Social media posts
- Developer explanations
- English/Bangla mixed writing

Local Flow allows the user to speak naturally and quickly insert formatted text into any app.

Example:

User opens Gmail, presses shortcut, says:

"I am sorry for the delay. I will send the updated file by tonight."

Local Flow converts it to:

"I’m sorry for the delay. I’ll send the updated file by tonight."

Then it pastes the result into Gmail.

---

## 5. Final User Experience

The final app should work like this:

1. User installs Local Flow.
2. App runs in the Windows system tray.
3. User opens any app with a text field.
4. User presses a global shortcut, for example Ctrl + Space.
5. A small floating overlay appears.
6. User speaks.
7. User presses the shortcut again or silence is detected.
8. App stops recording.
9. App sends audio to local speech-to-text engine.
10. Raw text is generated.
11. If enabled, app sends raw text to local Ollama for cleanup.
12. Final text is copied to clipboard.
13. App pastes the text into the previously active application.
14. App restores the old clipboard content.
15. App saves history locally if history is enabled.

---

## 6. Important Product Rules

### Rule 1: Local First

All core processing should be local.

Speech-to-text must be local.

AI cleanup must be local through Ollama.

No cloud API should be required.

### Rule 2: App Must Work Without Ollama

Ollama is optional.

If Ollama is not installed or not running, the app must still transcribe speech and paste raw text.

### Rule 3: Start Simple

Do not start with streaming transcription.

First build this simpler flow:

Record → Stop → Transcribe → Paste

After this works, add silence detection and advanced features.

### Rule 4: Build Phase by Phase

Do not build all features at once.

Every phase must be small, testable, and stable.

### Rule 5: User Must Always Understand App State

The app should clearly show:

- Ready
- Recording
- Processing
- Cleaning
- Pasting
- Done
- Error

### Rule 6: Never Destroy User Clipboard

Before pasting, save the existing clipboard.

After pasting, restore the previous clipboard content.

If paste fails, keep final text available for manual copy.

---

## 7. Recommended Technology Stack

## 7.1 Desktop App

Use:

- Electron
- React
- TypeScript
- Node.js

Why:

- The developer already knows TypeScript and React.
- Electron supports Windows desktop features.
- Electron has APIs for global shortcuts, windows, tray, and clipboard.
- React makes settings/history/overlay UI easy to build.

## 7.2 Speech-to-Text

Use one of these:

- faster-whisper
- whisper.cpp

Recommended first option:

- faster-whisper

Why:

- Good Whisper performance
- Can use GPU
- Good accuracy
- Suitable for local transcription

## 7.3 Local LLM Cleanup

Use:

- Ollama

Recommended first model:

- qwen2.5:7b

Alternative models:

- llama3.1:8b
- mistral:7b

Ollama should be used only for text cleanup and formatting, not raw audio transcription.

## 7.4 Optional Future Native Helper

Use GoLang only later if needed for:

- More reliable Windows paste automation
- Native hotkey helper
- System-level integration
- Background service management

Do not start with Go unless Electron/Node cannot handle a required feature.

---

## 8. Main System Architecture

Local Flow should be separated into modules.

High-level architecture:

Local Flow Desktop App
- Electron Main Process
- React Renderer UI
- Floating Overlay Window
- Local Speech-to-Text Service
- Ollama Integration
- Clipboard/Paste System
- Settings Storage
- History Storage
- Personal Dictionary

---

## 9. Electron Main Process Responsibilities

The Electron main process should handle desktop/system-level tasks.

Responsibilities:

- Start the app
- Create the main window
- Create the overlay window
- Manage tray icon and tray menu
- Register global shortcut
- Handle shortcut events
- Manage clipboard
- Trigger paste into active app
- Communicate with local STT service
- Communicate with Ollama service
- Save/read settings through safe service layer
- Send app state updates to renderer through IPC

The main process should not contain complex UI rendering logic.

---

## 10. React Renderer Responsibilities

The React renderer should handle user interface.

Screens:

- Dashboard
- Settings
- History
- Personal Dictionary
- Model Status
- Error/Diagnostics

React should show:

- Current app status
- Current shortcut
- Selected microphone
- Selected transcription model
- Selected Ollama model
- Raw transcription
- Final cleaned text
- History list
- Privacy settings

React should not directly access unsafe desktop APIs.

Use IPC through preload bridge.

---

## 11. Preload / IPC Bridge Responsibilities

The preload layer should expose safe functions from the main process to React.

Conceptual examples of things exposed:

- getAppStatus
- startRecording
- stopRecording
- getSettings
- updateSettings
- getMicrophones
- testMicrophone
- getHistory
- deleteHistoryItem
- clearHistory
- testOllama
- transcribeLastRecording
- copyText
- pasteText

Do not expose full Node.js APIs directly to the renderer.

---

## 12. Local Speech-to-Text Service Responsibilities

The STT service is responsible for converting audio to text.

It should:

- Start locally
- Bind only to localhost / 127.0.0.1
- Load selected Whisper model
- Keep model loaded after first use
- Accept audio file path or uploaded audio
- Transcribe audio
- Return raw text
- Return detected language if available
- Return processing time
- Return safe error messages

The STT service should not:

- Call cloud APIs
- Upload audio anywhere
- Require a user account
- Require a paid token

---

## 13. Ollama Integration Responsibilities

Ollama is used for optional text cleanup.

The app should:

- Check if Ollama is running
- Check selected model
- Send raw transcription to Ollama
- Receive cleaned text
- Apply selected text mode
- Use personal dictionary to preserve names and technical words
- Fall back to raw transcription if Ollama fails

Ollama should not be required for raw transcription.

---

## 14. Clipboard and Paste Responsibilities

The app should support both manual and automatic paste.

Auto-paste flow:

1. Save current clipboard.
2. Put final text into clipboard.
3. Send paste command to active app.
4. Wait briefly.
5. Restore old clipboard.
6. Show success or failure.

If paste fails:

- Keep final text visible in app.
- Show "Paste failed. Text has been copied."
- Allow user to copy manually.

---

## 15. Main User Flows

## 15.1 First-Time Setup Flow

1. User opens Local Flow.
2. App shows welcome screen.
3. User selects microphone.
4. User tests microphone.
5. User selects STT model.
6. User checks local STT service.
7. User optionally connects Ollama.
8. User chooses shortcut.
9. User enables or disables auto-paste.
10. User finishes setup.

## 15.2 Normal Dictation Flow

1. User focuses a text field in another app.
2. User presses shortcut.
3. Overlay appears.
4. App starts recording.
5. User speaks.
6. User presses shortcut again.
7. App stops recording.
8. App transcribes audio locally.
9. App optionally cleans text with Ollama.
10. App pastes final text.
11. Overlay shows Done.
12. App returns to Ready state.

## 15.3 Raw Mode Flow

1. User selects Raw Transcription.
2. User records voice.
3. App transcribes with Whisper.
4. App skips Ollama.
5. App pastes raw text.

## 15.4 Clean Dictation Mode Flow

1. User selects Clean Dictation.
2. User records voice.
3. App transcribes with Whisper.
4. App sends raw text to Ollama.
5. Ollama fixes grammar and punctuation.
6. App pastes cleaned text.

## 15.5 Failure Flow: Ollama Not Running

1. User records voice.
2. STT works.
3. Ollama cleanup fails.
4. App shows warning.
5. App uses raw text.
6. App still pastes text.

## 15.6 Failure Flow: STT Service Not Running

1. User records voice.
2. App tries to transcribe.
3. STT service is unavailable.
4. App shows clear error.
5. App does not paste empty text.
6. User can retry after fixing STT service.

---

## 16. App States

The app should use a clear state machine.

Required states:

- Idle
- StartingRecording
- Recording
- StoppingRecording
- ProcessingAudio
- Transcribing
- CleaningText
- Pasting
- Completed
- Cancelled
- Error

State meanings:

### Idle

App is ready and waiting for shortcut.

### StartingRecording

App is preparing microphone and overlay.

### Recording

Audio is being captured.

### StoppingRecording

App is finalizing audio file.

### ProcessingAudio

App is preparing audio for transcription.

### Transcribing

Local Whisper engine is generating raw text.

### CleaningText

Ollama is improving raw text.

### Pasting

App is pasting final text into active application.

### Completed

The flow has finished successfully.

### Cancelled

User cancelled recording or processing.

### Error

A recoverable error occurred.

---

## 17. Main Screens

## 17.1 Dashboard

Dashboard should show:

- App status
- Current shortcut
- Selected microphone
- Selected mode
- STT status
- Ollama status
- Last raw transcription
- Last final output
- Manual copy button
- Manual paste button

## 17.2 Settings

Settings sections:

- General
- Shortcut
- Microphone
- Speech-to-Text
- Ollama
- Text Modes
- Personal Dictionary
- History and Privacy
- Advanced

## 17.3 History

History should show:

- Date/time
- Final text preview
- Mode
- Language
- Copy button
- Delete button

## 17.4 Personal Dictionary

User can:

- Add word
- Edit word
- Delete word
- Import list
- Export list

## 17.5 Diagnostics

Diagnostics should show:

- App version
- Electron version if available
- STT service status
- Ollama status
- Selected microphone
- Selected shortcut
- Last error
- GPU mode if available

---

## 18. Settings Requirements

Settings should be stored locally and survive app restart.

Required settings:

### General

- Launch at startup
- Start minimized
- Minimize to tray
- Show overlay
- Auto-paste
- Play sound on start/stop

### Shortcut

- Shortcut value
- Recording mode: Toggle or Hold-to-talk

### Microphone

- Selected microphone ID
- Input sensitivity
- Test microphone status

### Speech-to-Text

- STT engine: faster-whisper or whisper.cpp
- Model name
- Language
- Device: CPU or GPU
- Compute type or speed/quality option

### Ollama

- Enable cleanup
- Ollama base URL
- Selected model
- Request timeout
- Fallback to raw text

### Text Mode

- Raw Transcription
- Clean Dictation
- Professional
- Casual
- Email
- Bullet Points
- Developer Note

### History and Privacy

- Save text history
- Save audio history
- Auto-delete after X days
- Clear all data

---

## 19. History Data Requirements

Each history item should store:

- ID
- Created date/time
- Raw transcription
- Final output
- Mode
- Language
- STT model
- Ollama model if used
- Processing duration
- Error status if any

Default privacy:

- Save text history: On
- Save audio history: Off

Audio files should not be saved unless user explicitly enables it.

---

## 20. Personal Dictionary Requirements

The personal dictionary stores important words that should not be changed incorrectly.

Examples:

- Mahim Talukder
- GoZayaan
- BIFPCL
- Rampal Power Plant
- Laravel
- Angular
- PostgreSQL
- Ollama
- Electron
- TypeScript

Dictionary words should be included in cleanup instructions.

The app should tell Ollama:

- Preserve these words exactly.
- Do not translate these names.
- Do not rewrite these technical terms incorrectly.

---

## 21. Text Modes

## 21.1 Raw Transcription

Use only STT result.

Do not call Ollama.

Fastest mode.

## 21.2 Clean Dictation

Fix:

- Grammar
- Punctuation
- Filler words
- Capitalization

Keep original meaning.

## 21.3 Professional

Rewrite to sound professional.

Good for office messages and formal communication.

## 21.4 Casual

Rewrite to sound friendly and natural.

Good for chats and social messaging.

## 21.5 Email

Format into a clear email-like message.

## 21.6 Bullet Points

Convert spoken content into bullet points.

## 21.7 Developer Note

Make output suitable for:

- GitHub PR comment
- Issue description
- Technical explanation
- Commit-related note

---

## 22. Error Handling Rules

The app must handle all common errors without crashing.

## 22.1 Microphone Errors

Handle:

- No microphone found
- Permission denied
- Selected microphone missing
- Microphone busy

Message example:

"Microphone not found. Please select another input device."

## 22.2 Shortcut Errors

Handle:

- Shortcut already used
- Shortcut registration failed

Message example:

"This shortcut is already used by another app. Please choose another shortcut."

## 22.3 STT Errors

Handle:

- STT service not running
- Whisper model missing
- GPU unavailable
- Audio file invalid
- Recording too short
- Transcription timeout

Message example:

"Local speech service is not running. Please start it and try again."

## 22.4 Ollama Errors

Handle:

- Ollama not installed
- Ollama not running
- Selected model missing
- Empty response
- Timeout

Message example:

"Ollama cleanup failed. Raw transcription was used instead."

## 22.5 Clipboard/Paste Errors

Handle:

- Clipboard unavailable
- Active app does not accept paste
- Paste command blocked
- Clipboard restore failed

Message example:

"Paste failed. The final text has been copied to your clipboard."

---

## 23. Performance Rules

The app should feel fast.

Important rules:

- Do not reload Whisper model for every recording.
- Keep STT service warm.
- Use smaller model during development.
- Allow user to choose speed vs quality.
- Raw mode should be faster than cleanup mode.
- Show progress during long operations.
- Do not block UI while transcribing.
- Do not block UI while Ollama is generating output.

Recommended starting model:

- medium multilingual for English + Bangla
- small.en for fast English-only testing

---

## 24. Privacy Rules

Local Flow is privacy-first.

The app should clearly communicate:

- Audio is processed locally.
- Text is processed locally.
- Ollama runs locally.
- No paid API key is needed.
- No data is uploaded by default.
- History is stored locally.
- Audio history is off by default.

User must be able to:

- Disable text history
- Disable audio history
- Clear history
- Clear personal dictionary
- Clear all local app data

---

## 25. Security Rules

- Do not expose local STT service publicly.
- Bind local service to 127.0.0.1 only.
- Do not store API keys because no API keys should be required.
- Do not expose Node.js directly to React renderer.
- Use preload bridge for safe IPC.
- Validate file paths passed to local services.
- Do not paste empty or unsafe content automatically.
- Do not overwrite clipboard permanently.

---

## 26. Suggested Folder Structure

local-flow/
  docs/
  app/
    electron/
      main/
      preload/
      renderer/
    src/
      features/
        dashboard/
        settings/
        history/
        dictionary/
        overlay/
      shared/
        components/
        types/
        constants/
        utils/
      services/
        shortcut/
        recording/
        transcription/
        ollama/
        clipboard/
        settings/
        history/
  local-services/
    stt-service/
  resources/
    icons/
  scripts/

Responsibilities:

### app/electron/main

Desktop-level behavior.

### app/electron/preload

Safe bridge between main and renderer.

### app/electron/renderer

React app entry point.

### features

UI features and pages.

### services

Business logic and communication logic.

### local-services/stt-service

Local speech-to-text service.

---

## 27. Development Phase Plan

Build in small phases.

Required MVP phases:

1. Project Foundation
2. Tray App
3. Global Shortcut
4. Recording State Machine
5. Floating Overlay
6. Microphone Detection
7. Audio Recording
8. STT Service Foundation
9. Recording to Transcription
10. Clipboard and Paste
11. Ollama Integration
12. Basic Cleanup Mode
13. Settings Page
14. Error Handling
15. Installer

Do not build all at once.

---

## 28. MVP Acceptance Criteria

The MVP is complete when:

- App opens on Windows.
- App runs in tray.
- Global shortcut works.
- Overlay appears during recording.
- User can select microphone.
- Audio can be recorded.
- Local STT service transcribes audio.
- Raw text appears in app.
- App can paste text into active app.
- Ollama can clean text when enabled.
- Raw fallback works if Ollama fails.
- Settings are saved.
- History works.
- Errors are handled.
- No paid API is required.
- No subscription is required.

---

## 29. Development Instructions for Codex

Codex must follow these rules:

1. Implement one phase at a time.
2. Do not implement future phases early.
3. Keep code clean and modular.
4. Prefer TypeScript.
5. Keep UI simple and professional.
6. Add error handling for each phase.
7. Preserve privacy-first behavior.
8. Do not add cloud APIs.
9. Do not require paid services.
10. After each phase, explain:
   - What changed
   - Which files changed
   - How to run
   - How to test
   - What is not implemented yet

---

## 30. Master Prompt for Codex

Use this prompt at the beginning of the project:

We are building a Windows desktop app named Local Flow.

Local Flow is a local-only Wispr Flow-like dictation app.

The app should let the user press a global shortcut, speak, convert voice to text locally, optionally clean the text using a local Ollama model, and paste the final text into the currently active app.

The developer is fluent in TypeScript, React, Node.js, JavaScript, and GoLang, but this is their first desktop app. So the implementation must be simple, modular, and phase-based.

Use Electron + React + TypeScript + Node.js for the main app.

Use a local speech-to-text service such as faster-whisper or whisper.cpp for transcription.

Use Ollama only for optional text cleanup and formatting.

Do not use paid APIs, cloud APIs, subscriptions, or user accounts.

Implement only the phase I request. Do not add future phases unless I explicitly ask.

For every phase, keep the code clean, explain what changed, and explain how to test it.

---

## 31. First Codex Task

Start with this:

Implement Phase 0 only: Project Foundation.

Create the basic Electron + React + TypeScript project for Local Flow.

The first screen should show:

- Local Flow
- Local voice typing for Windows
- App Ready

Do not add tray, shortcut, microphone, transcription, Ollama, or paste yet.

After implementation, explain what files were created and how to run the app.

---

## 32. Final Product Goal

After all phases, Local Flow should feel like this:

Press shortcut → Speak → Stop → Local transcription → Local cleanup → Paste into active app

It should be fast, private, local, and useful for daily writing.

The final product should be a no-subscription local Windows voice typing assistant.
