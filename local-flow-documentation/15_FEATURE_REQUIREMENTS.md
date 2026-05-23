# FEATURE REQUIREMENTS

## 1. Desktop App

### Required

- Windows desktop application
- Runs from Start Menu
- Can stay in system tray
- Can open and close main window
- Can quit from tray

### Later

- Launch on startup
- Start minimized
- Remember window position

---

## 2. Global Shortcut

### Required

- Default shortcut: Ctrl + Space
- Works even when app is not focused
- Can start/stop dictation
- Shows error if shortcut is unavailable

### Later

- User can customize shortcut
- Hold-to-talk mode

---

## 3. Recording Overlay

### Required

- Always-on-top small overlay
- Shows recording state
- Shows timer
- Shows processing state
- Can cancel recording

### Later

- Smooth animation
- Mode selector
- Result preview

---

## 4. Microphone

### Required

- Detect microphones
- Select microphone
- Test microphone
- Show input level
- Handle no microphone

---

## 5. Audio Recording

### Required

- Record microphone audio
- Save temporary audio file
- Support cancel
- Handle too-short recording
- Delete temporary audio when no longer needed

---

## 6. Local Speech-to-Text

### Required

- Use local STT service
- No cloud API
- Support Whisper model
- Return raw text
- Return error safely

### Recommended

- faster-whisper medium multilingual for English + Bangla
- small.en for quick English testing

---

## 7. Ollama Cleanup

### Required

- Optional feature
- Detect if Ollama is running
- Use selected local model
- Clean raw transcription
- Fall back to raw transcription if cleanup fails

### Text Cleanup Rules

- Fix grammar
- Fix punctuation
- Remove filler words
- Keep meaning
- Preserve personal dictionary terms

---

## 8. Clipboard and Paste

### Required

- Copy final text
- Manual paste
- Auto-paste
- Restore previous clipboard
- Show helpful message if paste fails

---

## 9. Text Modes

### Version 1

- Raw Transcription
- Clean Dictation

### Later

- Professional
- Casual
- Email
- Bullet Points
- Developer Note

---

## 10. History

### Required

- Save text history if enabled
- Show history list
- Copy old result
- Delete item
- Clear all

### Default

- Text history: On
- Audio history: Off

---

## 11. Personal Dictionary

### Required Later

- Add word
- Edit word
- Delete word
- Import/export list
- Use words during cleanup

---

## 12. Privacy

### Required

- Show local-only status
- No paid API
- No cloud processing by default
- Clear local data
- Disable history

---

## 13. Error Handling

Handle:

- No microphone
- Shortcut conflict
- STT service unavailable
- Whisper model missing
- Ollama not running
- Ollama model missing
- Clipboard failure
- Paste failure
- Recording too short
- Recording timeout
