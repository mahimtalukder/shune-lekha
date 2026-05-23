# CODEX CONTEXT SUMMARY

Use this file as the short context file for Codex.

## Project

Local Flow is a Windows-first desktop dictation app.

## Core Goal

Press shortcut → speak → local transcription → optional local Ollama cleanup → paste into active app.

## Main Stack

- Electron
- React
- TypeScript
- Node.js

## Local AI Stack

- Speech-to-text: faster-whisper or whisper.cpp
- Text cleanup: Ollama

## Developer Profile

The developer knows:

- TypeScript
- JavaScript
- React
- Node.js
- Next.js
- GoLang

The developer is new to desktop apps.

## Important Rules

- Build one phase at a time.
- Do not use cloud APIs.
- Do not require paid tokens.
- Do not require subscriptions.
- Do not add user accounts.
- App must work without Ollama by using raw transcription.
- Clipboard must be restored after auto-paste.
- Local STT service must bind only to localhost.
- Keep UI simple and clean.
- Use safe IPC between Electron main and React renderer.
- Electron `globalShortcut` is fine for press detection, but hold-to-talk release detection will need a later Windows-specific solution.

## MVP Flow

1. App runs in tray.
2. User presses global shortcut.
3. Overlay appears.
4. App records microphone.
5. User stops recording.
6. Audio is sent to local STT.
7. Raw transcription is returned.
8. Optional Ollama cleanup happens.
9. Final text is pasted into active app.
10. History is saved locally if enabled.

## MVP Required Features

- Electron app foundation
- Tray
- Global shortcut
- Recording state machine
- Floating overlay
- Microphone detection
- Audio recording
- Local STT service
- Recording-to-transcription connection
- Clipboard/paste system
- Ollama integration
- Clean dictation mode
- Settings
- Error handling
- Windows installer

## Recommended First Phase

Implement Phase 0 only:
Basic Electron + React + TypeScript app that opens and shows:

- Local Flow
- Local voice typing for Windows
- App Ready
