# 08 — Master Acceptance Checklist

Use this document to track progress.

## Foundation

- [ ] App opens on Windows.
- [ ] React UI loads.
- [ ] TypeScript works.
- [ ] No startup errors.
- [ ] Clean folder structure exists.

## Desktop Behavior

- [ ] App has tray icon.
- [ ] App can hide to tray.
- [ ] App can reopen from tray.
- [ ] App can quit from tray.
- [ ] App can launch minimized.

## Shortcut

- [ ] Global shortcut works.
- [ ] Shortcut works while another app is active.
- [ ] Shortcut conflict is handled.
- [ ] Shortcut can be changed in settings.

## Recording

- [ ] Recording state machine works.
- [ ] Overlay appears while recording.
- [ ] Microphone list appears.
- [ ] Selected microphone is saved.
- [ ] Audio can be recorded.
- [ ] Short recording is handled.
- [ ] Cancel recording works.

## Speech-to-Text

- [ ] Local STT service starts.
- [ ] Whisper model loads.
- [ ] Audio file can be transcribed.
- [ ] Raw text appears in app.
- [ ] No cloud API is used.
- [ ] English works.
- [ ] Bangla works.
- [ ] Mixed speech works reasonably.

## Clipboard and Paste

- [ ] Final text can be copied.
- [ ] Final text can be pasted manually.
- [ ] Auto-paste works.
- [ ] Clipboard is restored after paste.
- [ ] Paste failure is handled.

## Ollama

- [ ] Ollama status is detected.
- [ ] Selected model is saved.
- [ ] Test prompt works.
- [ ] Clean dictation works.
- [ ] Raw fallback works if Ollama fails.

## Settings

- [ ] General settings save.
- [ ] Shortcut settings save.
- [ ] Microphone settings save.
- [ ] STT settings save.
- [ ] Ollama settings save.
- [ ] History settings save.
- [ ] Privacy settings save.

## History

- [ ] Text history can be saved.
- [ ] Audio history is off by default.
- [ ] User can copy old result.
- [ ] User can delete history item.
- [ ] User can clear all history.

## Privacy

- [ ] App clearly shows local-only processing.
- [ ] User can disable history.
- [ ] User can clear local data.
- [ ] No paid API is required.
- [ ] No subscription is required.

## Packaging

- [ ] Windows installer builds.
- [ ] App launches from Start Menu.
- [ ] App appears in tray after installation.
- [ ] Uninstall works.
- [ ] Version number is visible.
