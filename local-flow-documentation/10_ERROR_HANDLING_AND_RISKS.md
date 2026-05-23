# 10 — Error Handling and Risks

## Important Errors to Handle

The app must never crash for common problems.

## Microphone Errors

Possible issues:

- No microphone found
- Permission denied
- Selected microphone removed
- Microphone busy in another app

User-friendly messages:

- Microphone not found. Please select another input device.
- Microphone permission was denied. Please allow microphone access.
- Selected microphone is unavailable. Please choose another device.

## Shortcut Errors

Possible issues:

- Shortcut already used by another app
- Shortcut registration failed
- Shortcut disabled by system policy

User-friendly message:

- This shortcut is already used by another app. Please choose a different shortcut.

## STT Errors

Possible issues:

- STT service not running
- Whisper model missing
- GPU unavailable
- Audio file invalid
- Recording too short
- Transcription timeout

User-friendly messages:

- Local speech service is not running.
- Whisper model is missing. Please download or select a model.
- GPU is unavailable. The app will try CPU mode.
- Recording is too short to transcribe.

## Ollama Errors

Possible issues:

- Ollama not installed
- Ollama not running
- Selected model missing
- Cleanup request timeout
- Model response empty

User-friendly messages:

- Ollama is not running. Raw transcription will be used.
- Selected Ollama model is missing. Please choose another model.
- AI cleanup failed. Raw transcription was used instead.

## Clipboard and Paste Errors

Possible issues:

- Clipboard unavailable
- Active app does not accept paste
- Paste command blocked
- Clipboard restore failed

User-friendly messages:

- Paste failed. The text has been copied to your clipboard.
- Clipboard is temporarily unavailable. Please try again.

## Performance Risks

Possible issues:

- Large Whisper model loads slowly
- Ollama response is slow
- 16 GB RAM may be tight with large models
- GPU memory may be limited

Mitigation:

- Start with medium Whisper.
- Start with 7B Ollama model.
- Keep models warm.
- Avoid loading multiple models at the same time.
- Provide speed vs quality setting.

## Product Risks

### Risk: Too many features too early

Solution:

Build phase by phase.

### Risk: Paste behavior unreliable

Solution:

Start with copy-to-clipboard, then add auto-paste.

### Risk: Real-time transcription is hard

Solution:

Start with record-stop-transcribe-paste flow.

### Risk: Ollama cleanup changes meaning

Solution:

Add raw mode and personal dictionary.

### Risk: Bangla transcription quality varies

Solution:

Use multilingual Whisper model and allow language selection.
