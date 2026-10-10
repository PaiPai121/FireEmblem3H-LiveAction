# Model Target Profile

Project: blue_lions_black_history
Package: video_generation_package_2026-07-26
Runtime: 60 seconds across 5 shots
Primary target: Seedance 2.0-class image-to-video with audio/dialogue support
Fallback target: Veo only after shot-duration splitting

## Decision

Use Seedance 2.0-class generation first.

The current package has 10s, 12s, and 16s shots, three visual anchors per shot, and prompt-level Japanese dialogue timing. That shape is intended for a model/workflow that can hold longer shots and preserve multiple reference frames.

Do not submit the package unchanged to Veo if the available Veo endpoint is limited to shorter clips. For Veo, create a separate split queue first so every work order fits the selected duration limit.

## Seedance Submission Settings

- Aspect ratio: 16:9.
- Duration: use each shot's `duration_seconds` exactly.
- Visual inputs: upload `start_frame.png`, `key_frame.png`, and `end_frame.png` if supported.
- If only first/last anchors are supported, use `start_frame.png` and `end_frame.png`; keep `key_frame.png` as the manual QA reference.
- Reference strength: high / strict / preserve input identity.
- Creativity: low to medium-low.
- Camera motion: minimal.
- Face enhancement / beautify: off.
- Auto subtitles / captions / text overlays: off.
- Dialogue/audio: enabled if the UI can synthesize spoken dialogue from the prompt.
- Seed: fixed if available, especially for reruns.

## Dialogue Mode

- Spoken language: Japanese.
- Subtitles: off.
- Delivery: conversational academy comedy, not anime overacting.
- Lip motion: restrained; prioritize face preservation over perfect mouth shape.

## Veo Fallback Rule

Use Veo only if you create a Veo-specific queue. A likely split is:

- SIBH-SH001: 10s into 2 shorter clips if needed.
- SIBH-SH002: 10s into 2 shorter clips if needed.
- SIBH-SH003: 12s into 2 shorter clips if needed.
- SIBH-SH004: 16s into 2 to 3 shorter clips if needed.
- SIBH-SH005: 12s into 2 shorter clips if needed.

This requires new edit points, prompt timing, and continuity QA.

## Hard Model Guardrails

- No subtitles, captions, UI text, logos, or watermarks.
- Preserve Sylvain's red hair, youthful academy face, and playful embarrassment.
- Preserve Ingrid's blonde hair, youthful academy face, and disciplined composure.
- Keep Ingrid firm, not jealous or cruel.
- Keep Sylvain sheepish, not predatory or devastated.
- Reject clips where lip-sync changes face shape or ages either character upward.
