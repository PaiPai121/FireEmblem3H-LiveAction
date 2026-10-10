# Scene09 V3 Full-Duration Release Gate

Date: 2026-08-01
Decision: full_duration_release_blocked_probe_review_pending
Can release full-duration generation: no
Probe clips playable: 0/42
Review frame sets ready: 0/42
Full-duration approvals: 0/42
Production release manifest: absent

Full-duration Scene09 generation is allowed only after the production probe apply gate passes 42/42 Codex-reviewed rows and writes a valid `motion_probe_full_duration_release.json` in this package. The positive contract proves the temporary positive path only; it is not production release evidence.

## Blocking Items

- probe clips incomplete: playable 0/42, missing 42, failed 0
- probe review evidence incomplete: review frame sets 0/42, full-duration approvals 0/42
- probe apply gate not passed: motion_probe_review_apply_blocked_clips_pending, passed rows 0/42
- production full-duration release manifest is absent

## Problems

- none

## Warnings

- none
