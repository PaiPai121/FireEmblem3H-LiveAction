# probe_batch_004_shots_019-024 Motion Probe Return Intake

Place provider-returned 3-second motion probe `.mp4` files into `returned_mp4/`.

Strict filename rule: use exact `expected_probe_filename` values or filenames beginning with the listed `custom_id`. Bare shot names and full-duration clip names are rejected.

Probe-only rule: every accepted filename must resolve to `_probe.mp4`; full-duration generation remains blocked until these returned probes pass Codex motion QA.

Full-duration generation remains blocked until returned motion probes pass Codex motion QA.

Validity rule: the ingest dry-run probes every candidate `.mp4` with `ffprobe`; corrupt files, text placeholders, zero-duration containers, and non-video files are blocked before matching or copying.

Return format is `.mp4` only. `.mov`, `.m4v`, `.webm`, images, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.

Run dry-run first:

```bash
node scripts/ingest_scene09_v3_motion_probe_clips.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_return_intake/probe_batch_004_shots_019-024_returns/returned_mp4 --dry-run
```

Apply only after every returned probe maps uniquely:

```bash
node scripts/ingest_scene09_v3_motion_probe_clips.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_return_intake/probe_batch_004_shots_019-024_returns/returned_mp4 --apply
```

Probe QA must check identity, wardrobe, training weapons, no extra readable people, no subtitles/captions/visible text, teacher separation, and post-shot ledger continuity before any full-duration clip request is released.
