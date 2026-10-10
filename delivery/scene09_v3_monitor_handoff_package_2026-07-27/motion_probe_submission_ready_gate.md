# Scene09 Motion Probe Submission Ready Gate

Decision: motion_probe_submission_ready
Expected shots: 42
Probe duration: 3 seconds
Provider zips: 7/7
Bundled probe rows: 42/42
Frame anchors checked: 42/42
Exact duplicate frame-anchor shots: 0
Return batches: 7/7
Returned probe mp4 ready: 0/42
Ingested probe ready: 0/42
Full-duration release: locked

This gate is intentionally probe-submission only. It must pass before submitting the 7 three-second probe zip bundles, but it must not unlock full-duration generation.

## Bundle Rows
- probe_batch_001_shots_001-006: zip yes, rows 6, expected downloads 6, problems 0
- probe_batch_002_shots_007-012: zip yes, rows 6, expected downloads 6, problems 0
- probe_batch_003_shots_013-018: zip yes, rows 6, expected downloads 6, problems 0
- probe_batch_004_shots_019-024: zip yes, rows 6, expected downloads 6, problems 0
- probe_batch_005_shots_025-030: zip yes, rows 6, expected downloads 6, problems 0
- probe_batch_006_shots_031-036: zip yes, rows 6, expected downloads 6, problems 0
- probe_batch_007_shots_037-042: zip yes, rows 6, expected downloads 6, problems 0

## Problems
- none

## Warnings
- none
