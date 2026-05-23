# 05 — Product Phases 12 to 21

These phases make the MVP more usable and production-ready.

## Phase 12 — Dictation Modes

### Goal

Add multiple text output styles.

### Modes

- Raw Transcription
- Clean Dictation
- Professional
- Casual
- Email
- Bullet Points
- Developer Note

### Acceptance Checklist

- User can choose mode.
- Selected mode is saved.
- Mode affects final output.
- Raw mode skips Ollama.
- Other modes use Ollama.
- Fallback works if Ollama is unavailable.

---

## Phase 13 — Personal Dictionary

### Goal

Improve output for names, brands, and technical words.

### Example Words

- Mahim Talukder
- GoZayaan
- BIFPCL
- Rampal Power Plant
- Laravel
- Angular
- Ollama
- PostgreSQL

### UI Requirements

User can:

- Add word
- Edit word
- Delete word
- Import list
- Export list

### Acceptance Checklist

- Dictionary words are saved.
- Cleanup respects custom words.
- Names are not incorrectly rewritten.
- User can manage dictionary.

---

## Phase 14 — Command Mode

### Goal

Let the user speak instructions naturally.

### Example Commands

- Write this as a professional email.
- Make this shorter.
- Turn this into bullet points.
- Write a GitHub PR comment.
- Translate this into English.
- Rewrite this in Bengali.

### Settings Option

Enable voice commands: On / Off

### Acceptance Checklist

- App understands simple command-style dictation.
- App produces formatted output.
- User can disable command mode.
- App does not over-transform normal speech.

---

## Phase 15 — History System

### Goal

Keep local transcription history.

### History Item Should Include

- Timestamp
- Raw transcription
- Final output
- Selected mode
- Language
- Processing time
- Optional audio reference

### Recommended Default

- Save text history: On
- Save audio history: Off

### Acceptance Checklist

- History page shows past dictations.
- User can copy old result.
- User can delete individual history.
- User can clear all history.
- Privacy settings work.

---

## Phase 16 — Settings Page

### Goal

Create a complete settings page.

### Sections

- General
- Shortcut
- Microphone
- Speech-to-Text
- Ollama
- Text Modes
- Personal Dictionary
- History and Privacy
- Advanced

### General Settings

- Launch at startup
- Minimize to tray
- Show overlay
- Auto-paste result
- Play start/stop sound

### Shortcut Settings

- Current shortcut
- Change shortcut
- Shortcut conflict warning
- Recording mode: Toggle or Hold-to-talk

### STT Settings

- Model
- Language
- Device: CPU or GPU
- Accuracy vs speed preference

### Acceptance Checklist

- Settings are organized.
- Settings are saved locally.
- Settings apply after restart.
- Invalid settings are handled safely.

---

## Phase 17 — Language Support

### Goal

Support English, Bangla, and mixed speech.

### Language Options

- Auto Detect
- English
- Bangla
- English + Bangla mixed

### Acceptance Checklist

- English transcription works.
- Bangla transcription works.
- Mixed speech works reasonably.
- User can select language mode.
- Language preference is saved.

---

## Phase 18 — Performance Optimization

### Goal

Make the app feel fast.

### Optimize

- Model loading time
- Audio processing time
- GPU usage
- Memory usage
- Overlay responsiveness
- Ollama response time

### Desired Behavior

The STT model should load once and stay warm.

### Acceptance Checklist

- Model is not reloaded every time.
- Second transcription is faster than first.
- App remains responsive during processing.
- User sees progress state.
- Long audio does not freeze app.

---

## Phase 19 — Error Handling and Recovery

### Goal

Make the app reliable for daily use.

### Required Error Handling

Handle:

- Microphone not found
- Microphone permission denied
- Shortcut conflict
- STT service not running
- Whisper model missing
- Ollama not running
- Ollama model missing
- GPU unavailable
- Paste failed
- Clipboard failed
- Recording too short
- Recording too long

### Acceptance Checklist

- App does not crash on common failures.
- User gets helpful messages.
- App can recover after fixing problem.
- Raw transcription still works if Ollama fails.

---

## Phase 20 — Windows Startup and Background Behavior

### Goal

Make the app feel like a real Windows productivity tool.

### Features

- Launch on startup
- Start minimized
- Run in tray
- Remember last window position
- Remember overlay position

### Acceptance Checklist

- App can launch after Windows login.
- App starts minimized if enabled.
- Tray behavior remains stable.
- Settings persist across restart.

---

## Phase 21 — Installer and Distribution

### Goal

Create an installable Windows app.

### Required Output

- Windows installer
- Portable version if possible
- App icon
- App name
- Version number

### Packaging Decision

During development, keep STT service separate.

After stable MVP, bundle it or create a guided setup.

### Acceptance Checklist

- App can be installed on Windows.
- App launches from Start Menu.
- App appears in tray.
- Uninstall works.
- Version number is visible.
