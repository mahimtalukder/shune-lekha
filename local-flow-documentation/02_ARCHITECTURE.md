# 02 — Application Architecture

## High-Level Architecture

Local Flow should be separated into clear modules.

Main modules:

1. Electron Main Process
2. React Renderer UI
3. Floating Recording Overlay
4. Local Speech-to-Text Service
5. Ollama Integration
6. Clipboard and Paste System
7. Settings Storage
8. History Storage
9. Personal Dictionary

## Electron Main Process

Responsible for:

- App lifecycle
- Tray menu
- Global shortcut
- Window creation
- Overlay window creation
- Clipboard interaction
- Paste automation
- Communication with local services

The main process should not contain heavy UI logic.

## React Renderer UI

Responsible for:

- Dashboard
- Settings page
- History page
- Personal dictionary page
- Model status page
- Error messages
- User preferences

The renderer should call the main process through safe IPC.

## Floating Recording Overlay

Responsible for showing recording status.

It should show:

- Listening state
- Timer
- Processing state
- Cleaning text state
- Pasted state
- Error state
- Cancel option

The overlay should be small and always on top.

## Local Speech-to-Text Service

Responsible for:

- Loading Whisper model
- Keeping model warm
- Accepting audio file
- Returning transcription text
- Returning detected language when available
- Returning processing time
- Returning safe errors

It should run locally only.

It should not expose itself publicly.

## Ollama Integration

Responsible for:

- Checking if Ollama is running
- Listing or validating selected model
- Sending text cleanup request
- Receiving improved text
- Falling back to raw transcription if Ollama fails

Ollama is optional.

The app must still work when Ollama is off.

## Clipboard and Paste System

Responsible for:

- Saving current clipboard content
- Copying final generated text to clipboard
- Sending paste command to active app
- Restoring previous clipboard content
- Reporting paste failure if needed

This is a critical user experience feature.

## Settings Storage

Responsible for saving:

- Shortcut
- Recording mode
- Selected microphone
- Selected STT model
- Selected language
- Auto-paste on/off
- Ollama model
- Cleanup mode
- History settings
- Privacy settings

Settings should persist after app restart.

## History Storage

Responsible for saving local dictation history if enabled.

Each history item should include:

- Timestamp
- Raw text
- Final text
- Selected mode
- Language
- Processing duration
- Whether Ollama was used

Audio history should be disabled by default.

## Personal Dictionary

Responsible for storing words the user does not want AI to rewrite incorrectly.

Examples:

- Mahim Talukder
- GoZayaan
- BIFPCL
- Rampal Power Plant
- Laravel
- Angular
- PostgreSQL
- Ollama

Dictionary words should be used during AI cleanup.
