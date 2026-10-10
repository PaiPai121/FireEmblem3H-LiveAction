# Model Target Profile

Project: blue_lions_food_song
Package: video_generation_package_2026-07-25
Runtime: 60 seconds across 5 shots
Primary target: Seedance 2.0-class image-to-video with audio/dialogue support
Fallback target: Veo only after shot-duration splitting

## Decision

Use Seedance 2.0-class generation first.

The current package has 12s and 14s shots, three visual anchors per shot, and prompt-level Japanese dialogue/vocal timing. That shape is intended for a model/workflow that can hold longer shots and preserve multiple reference frames.

Do not submit the package unchanged to Veo if the available Veo endpoint is limited to 8s clips. For Veo, rebuild a split package first so every work order fits the model duration limit.

## Seedance Submission Settings

- Aspect ratio: 16:9.
- Duration: use each shot's `duration_seconds` exactly.
- Visual inputs: upload `start_frame.png`, `key_frame.png`, and `end_frame.png` if supported.
- If only first/last anchors are supported, use `start_frame.png` and `end_frame.png`; keep `key_frame.png` as the manual QA reference for the action peak.
- Reference strength: high / strict / preserve input identity, whichever wording the UI provides.
- Creativity: low to medium-low.
- Camera motion: minimal.
- Face enhancement / beautify: off.
- Auto subtitles / captions / text overlays: off.
- Dialogue/audio: enabled if the UI can synthesize spoken/sung audio from the prompt.
- Seed: fixed if available, especially for reruns.

## Veo Fallback Rule

Use Veo only if you create a separate Veo-specific queue. The likely split is:

- BLFS-SH001: split 12s into two clips.
- BLFS-SH002: keep as 8s.
- BLFS-SH003: split 12s into two clips.
- BLFS-SH004: split 14s into two clips.
- BLFS-SH005: split 14s into two clips.

This turns the package from 5 clips into 9 clips and requires new edit points, prompt timing, and continuity QA. Do this only if the selected Veo product cannot generate the current shot durations.

## Hard Model Guardrails

- No subtitles, captions, UI text, logos, or watermarks.
- Preserve Annette's young academy face from the frames.
- Keep singing private, small-mouthed, in tune, and silly.
- Do not turn the song into a stage performance.
- Keep Felix blunt and sincere, not amused or romanticized.
- Reject clips where lip-sync changes face shape or ages Annette upward.

## Generation Order

1. BLFS-SH001, 12s: song and private step-turn-pour rhythm.
2. BLFS-SH002, 8s: Felix reveal.
3. BLFS-SH003, 12s: embarrassment and tiny over-pour.
4. BLFS-SH004, 14s: Felix's sincere footwork praise.
5. BLFS-SH005, 14s: watering payoff and plant-singing deadpan.
