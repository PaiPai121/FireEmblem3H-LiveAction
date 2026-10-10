# EP03 Identity-Locked Keyframe Regeneration Handoff

Created: 2026-08-01

This package is the next actionable step after the local asset storyboard package. It does not contain approved video frames. It contains per-shot, per-frame regeneration prompts that put local selected.png identity locks before camera, motion, and performance instructions.

## Status

- Target: regenerate final live-action start/key/end keyframe candidates.
- Current package status: frames_pending / monitor_required.
- Shots: 36
- Local asset proof sheets available: 36
- Local identity plate coverage: 36/36 shots
- Regenerated candidate frame sets: 5/36
- Revised prompt sets: 1/36
- Rejected imagegen candidate sets referenced: 19
- Current video delivery status: blocked_needs_revision=16, visual_blocked=17

## Rules

- Use local selected/reference assets as the identity source of truth.
- Use local proof sheets and local previs frames for identity/layout reference only.
- Do not reuse blocked imagegen candidate faces as identity truth.
- Do not promote generated outputs until visual QA, prompt-against-frame QA, and strict continuity pass.
