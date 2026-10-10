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

- 013_Shot029_probe: 13_Shot029_probe.mp4
- 014_Shot029C_probe: 14_Shot029C_probe.mp4
- 015_Shot029D_probe: 15_Shot029D_probe.mp4
- 016_Shot029B_probe: 16_Shot029B_probe.mp4
- 017_Shot030_probe: 17_Shot030_probe.mp4
- 018_Shot030B_probe: 18_Shot030B_probe.mp4

Batch id: probe_batch_003_shots_013-018.