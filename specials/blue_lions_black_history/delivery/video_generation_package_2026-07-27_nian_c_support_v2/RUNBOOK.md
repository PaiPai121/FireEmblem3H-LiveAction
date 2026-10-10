# Video Generation Runbook

Project: blue_lions_black_history
Package: video_generation_package_2026-07-27_nian_c_support_v2
Target runtime: 60 seconds
Target model: Seedance image-to-video
Status: approved_for_video, clips pending

## Goal

Generate a five-shot live-action Fire Emblem Three Houses support-comedy short. SH001 uses Nian as a one-shot cameo trigger. SH002-SH005 recreate the Sylvain x Ingrid C-support accountability beat with adapted Japanese dialogue.

Every shot is capped at 15 seconds or less.

## Submission Order

1. `shots/001_SIBH-SH001` - 9s - Sylvain approaches Nian; Ingrid calls him offscreen.
2. `shots/002_SIBH-SH002` - 12s - Ingrid catches Sylvain after Nian has left.
3. `shots/003_SIBH-SH003` - 12s - Old friend accountability and grandmother incident.
4. `shots/004_SIBH-SH004` - 15s - Scarecrow and noble-apology examples.
5. `shots/005_SIBH-SH005` - 12s - Ingrid tells Sylvain to start changing now.

For each shot, submit:

- `prompt.md`
- `negative_prompt.md`
- `start_frame.png` as first-frame anchor
- `key_frame.png` as action/emotional peak anchor
- `end_frame.png` as final-frame anchor
- Duration and reject rules from `metadata.json`

Save output to the `expected_clip` path in `metadata.json`.

## Audio And Dialogue

- Use the Japanese adapted dialogue written in each `prompt.md`.
- Do not add subtitles, captions, UI text, or karaoke text.
- Keep performance natural and private, like an in-game support scene translated into live action.

## Hard Continuity Locks

- Nian appears only in SH001. She must not appear in SH002-SH005.
- Ingrid remains youthful, composed, strict, and fair. She is not jealous and not cruel.
- Sylvain remains embarrassed and playful. He is not predatory, angry, or devastated.
- The ending is friendship comedy, not romance.
- Keep Garreg Mach corridor geography and left/right screen direction stable.

## Runner

`execution_plan.json`, `submission_queue.csv`, and `execution_commands.sh` are handoff files. A real video model CLI is not configured in this workspace, so this package is prepared for external Seedance submission.

## Rerun Policy

Try one narrow rerun before changing the shot design. Keep the same three frame anchors, shorten motion if needed, and preserve identity, costume, setting, camera, and dialogue timing. If the same P0 issue appears twice, mark the shot `blocked_needs_revision` before generating alternatives.
