# 00 — Project Overview

## App Name

Local Flow

## Main Goal

Build a Windows desktop app that works like a local voice typing assistant.

The app should allow the user to:

1. Press a shortcut.
2. Speak.
3. Stop speaking or press the shortcut again.
4. Convert voice to text locally.
5. Optionally clean the text using a local Ollama model.
6. Paste the result into the currently active app.

## Product Vision

Local Flow should feel like a fast local dictation tool.

It should not require:

- Paid API tokens
- Monthly subscription
- Cloud speech-to-text
- Cloud LLM
- User account
- Internet after setup

## Target User

The first target user is a developer or power user on Windows who wants fast local voice typing.

The user is comfortable with:

- TypeScript
- React
- Node.js
- JavaScript
- GoLang

The user is new to desktop app development, so the project must be divided into small understandable phases.

## Primary Platform

Windows first.

Other platforms can be considered later.

## Final Target Flow

1. User opens any app such as Notepad, Chrome, Messenger, Gmail, Word, or VS Code.
2. User presses the configured shortcut.
3. Local Flow starts recording.
4. A small floating overlay appears.
5. User speaks.
6. User presses the shortcut again or silence is detected.
7. Local Flow stops recording.
8. Audio is processed locally by Whisper.
9. Raw text is generated.
10. Optional local Ollama cleanup is applied.
11. Final text is pasted into the active app.
12. Clipboard is restored.
13. Local history is saved if enabled.

## Core Principles

The app must be:

- Local-first
- Simple to use
- Privacy-friendly
- Windows-first
- Shortcut-driven
- Beginner-friendly for development
- Easy to expand later

## What the App Should Not Do in Version 1

Avoid these in the first version:

- Cloud sync
- User account system
- Payment system
- Team workspace
- Mobile app
- Browser extension
- Real-time streaming transcription
- Complex plugin system

## Version 1 Success Definition

Version 1 is successful when:

- The user can install the app on Windows.
- The app runs in the tray.
- A global shortcut starts and stops recording.
- Audio is transcribed locally.
- Text can be cleaned by local Ollama.
- Final text is pasted into the active app.
- No paid API is required.
