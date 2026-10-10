# RUNBOOK - Hilda x Marianne Timing-Safe Seedance Package

Submit rows from `submission_queue.csv` in order. Each row is a timing-safe micro-shot split from the approved 2026-07-28 parent package.

Rules:
- Use `start_frame.png`, `key_frame.png`, and `end_frame.png` from the row's shot folder as image-to-video anchors.
- Use only the dialogue lines in that row's `prompt.md`.
- Do not add subtitles, captions, text overlays, extra dialogue, or new story beats.
- Keep each generated clip at the row's `duration_seconds`.
- After generation, run clip QA for face, mouth, hand, wardrobe trim, and no visible text.
