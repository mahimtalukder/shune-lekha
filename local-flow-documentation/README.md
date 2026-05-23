# Local Flow Documentation

Local Flow is a Windows-first, local-only dictation desktop app inspired by Wispr Flow.

The goal is simple:

- Press a global shortcut.
- Speak naturally.
- Convert voice to text locally.
- Optionally clean the text with a local Ollama model.
- Paste the final result into the active app.
- Avoid paid APIs, tokens, and subscriptions.

## Recommended Stack

Use this stack for the first version:

- Desktop App: Electron
- UI: React
- Language: TypeScript
- Runtime: Node.js
- Speech-to-Text: faster-whisper or whisper.cpp
- Local LLM: Ollama
- Optional later helper: Go

## Why this documentation is split

The app should not be built in one big step. Each document is designed so you can give Codex one small phase at a time.

Start with:

1. `00_PROJECT_OVERVIEW.md`
2. `01_TECH_STACK_DECISION.md`
3. `02_ARCHITECTURE.md`
4. `04_PHASES_MVP_0_TO_11.md`
5. `07_CODEX_PROMPTS_BY_PHASE.md`

## Suggested Development Rule

Never ask Codex to build the full app in one prompt.

Use this style:

"Implement Phase 0 only. Do not implement future phases yet."

Then continue phase by phase.


## Added Full Codex Understanding Docs

Use these files when you want Codex to understand the full project before implementing phases:

- `13_FULL_PROJECT_DESCRIPTION_FOR_CODEX.md`
- `14_CODEX_CONTEXT_SUMMARY.md`
- `15_FEATURE_REQUIREMENTS.md`

Best way to use Codex:

1. Give Codex `14_CODEX_CONTEXT_SUMMARY.md` first.
2. Give Codex `13_FULL_PROJECT_DESCRIPTION_FOR_CODEX.md` if it needs full project understanding.
3. Then ask it to implement one phase only using `07_CODEX_PROMPTS_BY_PHASE.md`.
