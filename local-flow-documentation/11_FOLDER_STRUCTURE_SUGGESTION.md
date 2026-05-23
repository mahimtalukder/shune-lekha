# 11 — Suggested Folder Structure

This is a conceptual folder structure. Codex can adjust it based on the selected starter template.

## Recommended Structure

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

## Folder Responsibilities

### app/electron/main

Desktop-level logic:

- App lifecycle
- Window management
- Tray
- Global shortcut
- Clipboard
- Paste automation

### app/electron/preload

Safe bridge between renderer and main process.

### app/electron/renderer

React app entry point.

### features/dashboard

Main app screen.

### features/settings

Settings pages.

### features/history

Local transcription history.

### features/dictionary

Personal dictionary UI.

### features/overlay

Recording overlay UI.

### services/shortcut

Shortcut-related logic.

### services/recording

Recording-related logic.

### services/transcription

Communication with local STT service.

### services/ollama

Communication with local Ollama.

### services/clipboard

Copy, paste, and clipboard restore behavior.

### services/settings

Local settings persistence.

### services/history

Local history persistence.

### local-services/stt-service

Local speech-to-text service.

This may be implemented with faster-whisper or whisper.cpp.

## Important Rule

Keep business logic separated from UI.

React components should not directly handle complex desktop behavior.
