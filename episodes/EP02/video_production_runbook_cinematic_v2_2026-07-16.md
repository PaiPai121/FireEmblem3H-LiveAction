# EP02 Cinematic V2 Video Production Runbook

Date: 2026-07-16

This is the operating checklist for the cinematic continuity pass. It replaces the first-pass generation order for all future EP02 video work.

## 1. Source Materials

Continuity brief:

- `episodes/EP02/cinematic_continuity_pass_2026-07-16.md`

Timeline:

- `episodes/EP02/edit_timeline_cinematic_v2_2026-07-16.md`
- `episodes/EP02/edit_timeline_cinematic_v2_2026-07-16.csv`
- `episodes/EP02/edit_timeline_cinematic_v2_2026-07-16.json`

Queue:

- `episodes/EP02/video_generation_queue_cinematic_v2_2026-07-16.csv`
- `episodes/EP02/video_generation_queue_cinematic_v2_2026-07-16.json`

Provider-agnostic request payloads:

- `episodes/EP02/video_payloads_cinematic_v2_2026-07-16.json`
- `episodes/EP02/video_payloads_cinematic_v2_2026-07-16.jsonl`
- `episodes/EP02/video_payloads_cinematic_v2_2026-07-16/`

Per-shot jobs:

- `episodes/EP02/video_jobs_cinematic_v2_2026-07-16/`

Batch files:

- `episodes/EP02/video_batches_cinematic_v2_2026-07-16/`
- `episodes/EP02/video_batches_cinematic_v2_2026-07-16.csv`

## 2. Runtime

Total runtime: 614 seconds, 10:14.

First pass runtime was about 490 seconds, 08:10. The 124 second expansion is intentional and should not be trimmed before a rough assembly proves that the scene breathes.

## 3. Required Generation Order

Run in story order:

1. `batch_01_arrival`
2. `batch_02_church_authority`
3. `batch_03_monastery_daily_life`
4. `batch_04_three_houses`
5. `batch_05_private_warning`
6. `batch_06_first_class`
7. `batch_07_mock_battle`
8. `batch_08_observation_echo`
9. `batch_09_conspiracy`

Do not shuffle shots across batches during this pass. The point of v2 is continuity: transitions, audio bridges and screen direction are authored around this order.

## 4. Expected Outputs

Generated clips go here:

- `episodes/EP02/video_outputs/cinematic_v2/Shot001.mp4`
- ...
- `episodes/EP02/video_outputs/cinematic_v2/Shot042.mp4`

Every clip should include 2 seconds of editorial handle where the provider allows it.

## 5. QA Checks

For each generated batch, check:

- Does the first frame connect to the prior shot's transition out?
- Does the last frame provide a usable cut into the next shot?
- Does the camera preserve the assigned screen direction?
- Does the sound cue bridge naturally into adjacent shots?
- Do faces remain grounded, young, and character-consistent?
- Are the listed location and character assets visible or plausibly implied?

High-risk segments:

- `batch_04_three_houses`: many students in one sequence, identity drift risk.
- `batch_07_mock_battle`: spatial continuity and action geography risk.
- `batch_09_conspiracy`: must hide Flame Emperor identity.

## 6. Assembly Guidance

Build a rough cut by concatenating story-order outputs from `episodes/EP02/edit_timeline_cinematic_v2_2026-07-16.json`.

Do not judge isolated clips as final. A clip can pass only if it cuts correctly against the previous and next shot.

## 7. Current Local Validation

As of 2026-07-16:

- 42 cinematic v2 queue entries exist.
- 42 per-shot cinematic v2 payloads exist.
- 42 per-shot cinematic v2 job files exist.
- 9 story-order batch manifests exist.
- referenced still image paths all exist locally.
- cinematic v2 timeline totals 614 seconds.
