# 09 — Model and Local AI Guide

## Two Different AI Parts

Local Flow needs two different AI-related parts.

## 1. Speech-to-Text

This converts voice into text.

Recommended tools:

- faster-whisper
- whisper.cpp

This part does not use Ollama.

## 2. Text Cleanup

This improves the raw transcription.

Recommended tool:

- Ollama

Ollama is used for:
- Grammar correction
- Punctuation
- Formatting
- Professional rewrite
- Bullet points
- Email formatting
- Developer notes

## Recommended Speech-to-Text Model

For English only:

- small.en
- medium.en

For Bangla and mixed English/Bangla:

- medium multilingual

Recommended for this app:

- medium multilingual

Reason:

The user may speak both English and Bangla.

## Recommended Ollama Model

Start with:

- qwen2.5:7b

Alternative:

- llama3.1:8b
- mistral:7b

## Hardware Expectation

Your PC:

- 16 GB RAM
- RTX 3060 Ti GPU

This should be good for:

- Local Whisper transcription
- 7B or 8B local LLM cleanup through Ollama
- Smooth MVP testing

## Important Product Rule

The app must work even if Ollama is not running.

Fallback behavior:

- If Ollama works: transcribe and clean.
- If Ollama fails: use raw transcription.
- If STT fails: show clear error.

## Text Modes

Version 1 should include:

- Raw Transcription
- Clean Dictation

Later versions can add:

- Professional
- Casual
- Email
- Bullet Points
- Developer Note
- Translation
- Custom Prompt

## Personal Dictionary Usage

The personal dictionary should help preserve names and technical words.

Examples:

- Mahim Talukder
- GoZayaan
- BIFPCL
- Rampal Power Plant
- Laravel
- Angular
- PostgreSQL
- Ollama

The cleanup prompt should tell the local LLM not to change these terms incorrectly.
