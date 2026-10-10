# Scene09 V3 Motion Probe Return Intake

This folder receives real provider-generated 3-second motion probe mp4 clips before full-duration generation is allowed.

Use one probe batch return directory at a time. Put provider downloads in that batch's `returned_mp4/` directory, run dry-run, then apply only if matching is unique.

Strict filename rule: use exact `expected_probe_filename` values or filenames beginning with the listed `custom_id`. Bare shot names and full-duration clip names are rejected.

Probe-only rule: accepted files must be `_probe.mp4` returns and copy only to `episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/`.

Validity rule: the ingest dry-run probes every candidate `.mp4` with `ffprobe`; corrupt files, text placeholders, zero-duration containers, and non-video files are blocked before matching or copying.

Return format is `.mp4` only. `.mov`, `.m4v`, `.webm`, images, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.

Full-duration generation remains blocked until returned probes pass Codex motion QA for identity, wardrobe, training weapons, no extra readable people, no subtitles/captions/visible text, teacher separation, and post-shot ledger continuity.

Batch dry-run example:

```bash
node scripts/ingest_scene09_v3_motion_probe_clips.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_return_intake/probe_batch_001_shots_001-006_returns/returned_mp4 --dry-run
```
