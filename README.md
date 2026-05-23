# Shune-Lekha

Shune-Lekha is a Windows-first local voice typing desktop app being built with Electron, React, and TypeScript.

The product goal is simple:

`Press shortcut -> speak -> local transcription -> optional local cleanup -> paste into the active app`

The project is being built phase by phase. The current codebase is implemented through **Phase 5**.

## Current Features

What works today:

- Electron desktop app foundation
- System tray support
- Tray menu with:
  - `Open Local Flow`
  - `Settings`
  - `Quit`
- Close-to-tray window behavior
- Global shortcut registration with `Ctrl + Space`
- Fake recording state machine:
  - `Idle`
  - `Starting Recording`
  - `Recording`
  - `Stopping Recording`
  - `Processing`
  - `Completed`
  - `Error`
- Floating overlay window during the fake recording flow
- Overlay timer
- Overlay cancel action
- Microphone permission request
- Microphone device detection
- Saved microphone selection
- Live microphone test with input volume indicator

## Not Implemented Yet

These are still pending:

- Real audio recording to file
- Hold-to-talk key release detection
- Local speech-to-text integration
- Raw transcription display
- Clipboard copy/paste flow
- Ollama integration
- AI cleanup modes
- Settings persistence beyond microphone selection
- History
- Installer

## Tech Stack

- Electron
- React
- TypeScript
- Node.js
- esbuild

## Project Status

Current build stage: **Phase 5**

This means the app already has:

- desktop shell behavior
- tray integration
- shortcut flow
- fake recording UI flow
- overlay UI
- microphone selection and testing

This does **not** yet mean dictation is working end-to-end.

## Getting Started

Requirements:

- Windows
- Node.js
- npm

Install dependencies:

```bash
npm install
```

Start in development mode:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run the built app:

```bash
npm run start
```

Type-check the project:

```bash
npm run typecheck
```

## How To Test The Current App

1. Run `npm run dev`
2. Confirm the Electron window opens
3. Confirm the tray icon appears
4. Close the window and confirm the app stays in the tray
5. Press `Ctrl + Space` and confirm the fake recording flow starts
6. Confirm the floating overlay appears during the fake flow
7. Press `Ctrl + Space` again and confirm the flow moves through stopping, processing, completed, and back to idle
8. Open the microphone section in the main window
9. Click `Allow Microphone Access`
10. Confirm microphones appear in the device list
11. Click `Test Microphone` and confirm the level indicator responds to your voice

## Project Structure

```text
app/
  electron/
    main/
    preload/
    renderer/
local-flow-documentation/
dist-electron/
```

Important folders:

- `app/electron/main` for Electron main-process behavior
- `app/electron/preload` for the safe renderer bridge
- `app/electron/renderer` for the React UI and overlay
- `local-flow-documentation` for the phase-based product and implementation docs

## Notes

- The current global shortcut implementation is press-based only.
- True shortcut release detection for hold-to-talk is not implemented.
- Microphone testing is live input monitoring only, not recording to disk.
- No cloud API is used.

## Documentation

Detailed build planning and phase definitions are in:

- [local-flow-documentation/04_PHASES_MVP_0_TO_11.md](D:/CodeBase/Sunea-Likha/local-flow-documentation/04_PHASES_MVP_0_TO_11.md)
- [local-flow-documentation/13_FULL_PROJECT_DESCRIPTION_FOR_CODEX.md](D:/CodeBase/Sunea-Likha/local-flow-documentation/13_FULL_PROJECT_DESCRIPTION_FOR_CODEX.md)
- [local-flow-documentation/14_CODEX_CONTEXT_SUMMARY.md](D:/CodeBase/Sunea-Likha/local-flow-documentation/14_CODEX_CONTEXT_SUMMARY.md)
