# Scene09 V3 Motion Probe Return Contract

This batch is for 3-second motion probes only. It does not approve full-duration generation.

- Expected probe batches: 7.
- Expected probe clips across package: 42.
- Rows in this batch: 6.
- Return format is `.mp4` only.
- Each returned probe must match either the exact expected probe filename or begin with the exact probe `custom_id`.
- Bare shot names are rejected as ambiguous.
- Returned probe clips must pass ffprobe container validation before any motion QA begins.

## Required Probe QA

- Identity preserved.
- Wardrobe and house colors preserved.
- Training weapons and props preserved.
- Visible named-only roster obeyed.
- No anonymous readable students, spectators, soldiers, crowds, bystanders, or silhouettes.
- No subtitles, captions, visible text, watermark, letterbox/pillarbox UI, or playback chrome.
- Hanneman and Manuela remain separate faculty lanes and must not appear as a paired combat unit.
- In Shot034B, Hanneman and Manuela are absent/offscreen/silent/unpaired; Shot034B allows only Byleth and Dimitri as readable humans.
- Captured, stood-down, objective-defeated, defeated, or must-not-return-active characters do not resume active combat.
- Full-duration generation remains blocked until Codex records signed motion review evidence for this probe.

## Batch Expected Filenames

- 019_Shot030C_probe: 19_Shot030C_probe.mp4
- 020_Shot031_probe: 20_Shot031_probe.mp4
- 021_Shot031B_probe: 21_Shot031B_probe.mp4
- 022_Shot032_probe: 22_Shot032_probe.mp4
- 023_Shot032A_probe: 23_Shot032A_probe.mp4
- 024_Shot032B_probe: 24_Shot032B_probe.mp4

Batch id: probe_batch_004_shots_019-024.