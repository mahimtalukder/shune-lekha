# 01 — Technology Stack Decision

## Recommended Choice

Use:

- Electron
- React
- TypeScript
- Node.js

This is the easiest stack for this project because the developer is already fluent in TypeScript, Node.js, React.js, and Next.js.

## Why Electron Is Recommended

Electron is the best first choice for this app because it supports the desktop features needed for Local Flow:

- Global shortcuts
- Tray app behavior
- Clipboard access
- Multiple windows
- Floating overlay windows
- Local process communication
- React-based UI

Electron also fits naturally with a TypeScript and React frontend.

## Why Not Start with GoLang Only

GoLang is excellent for backend tools and system services, but building a polished desktop UI in Go is less beginner-friendly than building the UI with React.

For this app, the UI matters a lot:

- Recording overlay
- Settings page
- History page
- Mode selector
- Error screens
- Tray behavior

React and TypeScript will make these parts easier.

## Where GoLang Can Be Useful Later

Go can be added later for specific native tasks:

- Reliable Windows paste helper
- Native keyboard/mouse automation helper
- Local service manager
- Performance-sensitive background service
- Packaging helper

But for version 1, avoid adding Go unless necessary.

## Why Not Tauri First

Tauri is a strong desktop framework and can use a JavaScript frontend, but it uses Rust for backend/system integration.

Because this is your first desktop app and you are more fluent in TypeScript and Go than Rust, Tauri is not the easiest starting point.

## Why Not Wails First

Wails is attractive because it uses Go and web frontend technology.

However, for this specific app, Electron has more commonly used desktop APIs and examples for:

- Global shortcuts
- Tray behavior
- Clipboard
- Floating windows
- Desktop app workflows

Wails can be considered later if you want a Go-based smaller app.

## Recommended Architecture

Use TypeScript/React/Electron for the main app.

Use a separate local speech-to-text service for Whisper.

Use Ollama separately for local text cleanup.

Simple architecture:

Desktop App:
- Electron
- React
- TypeScript

Local Speech-to-Text:
- faster-whisper or whisper.cpp

Local AI Cleanup:
- Ollama

Optional Later:
- Go native helper for paste and Windows automation

## Final Decision

Start with:

Electron + React + TypeScript + Node.js

Add:

Local Whisper service

Then add:

Ollama cleanup

Add Go later only if you hit limitations with Node.js desktop automation.
