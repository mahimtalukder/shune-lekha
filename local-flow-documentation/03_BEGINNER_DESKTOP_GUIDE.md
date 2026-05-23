# 03 — Beginner Guide for This Desktop App

## What Is Different About Desktop Apps?

A normal React or Next.js app runs inside a browser.

A desktop app can interact with the operating system.

Local Flow needs desktop features such as:

- Global keyboard shortcuts
- System tray
- Clipboard access
- Microphone access
- Floating overlay
- App startup behavior
- Local background services

This is why Electron is useful.

## Important Electron Concepts

### Main Process

The main process controls native desktop behavior.

It handles:

- App start
- Window creation
- Tray menu
- Global shortcuts
- Clipboard and paste
- Communication with local services

### Renderer Process

The renderer process is the UI.

It is where React runs.

It handles:

- Dashboard
- Settings
- History
- Buttons
- Forms
- Overlay UI

### IPC

IPC means communication between the main process and renderer process.

Use IPC when the React UI needs to request desktop actions.

Example concept:

- Renderer asks: "Start recording"
- Main process performs the desktop-level action
- Main process replies with status

## Development Mindset

Do not build the app in one shot.

Build small pieces:

1. App opens.
2. Tray works.
3. Shortcut works.
4. Fake recording state works.
5. Overlay works.
6. Microphone detection works.
7. Real audio recording works.
8. Transcription works.
9. Paste works.
10. Ollama cleanup works.

## Important Rule

Every phase must be testable.

Do not move to the next phase until the current phase works.
