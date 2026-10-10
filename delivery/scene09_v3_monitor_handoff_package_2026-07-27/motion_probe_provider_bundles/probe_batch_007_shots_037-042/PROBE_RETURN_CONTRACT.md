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

- 037_Shot034E_probe: 37_Shot034E_probe.mp4
- 038_Shot034F_probe: 38_Shot034F_probe.mp4
- 039_Shot034G_probe: 39_Shot034G_probe.mp4
- 040_Shot034_probe: 40_Shot034_probe.mp4
- 041_Shot035_probe: 41_Shot035_probe.mp4
- 042_Shot036_probe: 42_Shot036_probe.mp4

Batch id: probe_batch_007_shots_037-042.