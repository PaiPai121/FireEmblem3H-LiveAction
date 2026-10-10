# Scene09 V3 Provider Return Contract

This contract defines what counts as a valid provider return for EP02 Scene09 V3.

## Required Return Set

- Expected batches: 7.
- Expected clips: 42.
- One real provider-generated `.mp4` per `custom_id` in `model_submission_batches/expected_downloads.csv`.
- No proxy animatic clips, preview clips, contact sheets, or still images may be substituted for real provider mp4 files.
- Return format is `.mp4` only; `.mov`, `.m4v`, `.webm`, image files, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.

## Accepted Filename Evidence

- Exact expected filename from `expected_filename`, for example `01_Shot025.mp4`.
- Filename beginning with the exact `custom_id`, for example `001_Shot025_take02.mp4`.
- A returned file must be parseable by `ffprobe`; corrupt or non-video mp4 containers stay blocked.

## Rejected Filename Evidence

- Bare shot names such as `Shot025.mp4` or `Shot034B.mp4`.
- Ambiguous duplicates for the same `custom_id` unless a specific replacement is chosen and older candidates are removed.
- Any file whose content hash already belongs to a proxy animatic, still-frame render, or non-provider fixture.

## Import Procedure

Use the safe ingest path only:

```bash
node scripts/ingest_scene09_v3_generated_clips.js --input /path/to/model/downloads --dry-run
node scripts/ingest_scene09_v3_generated_clips.js --input /path/to/model/downloads --apply
node scripts/run_scene09_v3_video_pipeline.js --dry-run
```

For batch folders, use:

```bash
node scripts/resume_scene09_v3_after_clip_return.js --input /path/to/model/downloads
node scripts/resume_scene09_v3_after_clip_return.js --input /path/to/model/downloads --apply-ingest
```

## Required QA After Import

- `generated_clip_structural_audit` must pass for 42/42 clips.
- Start/mid/end motion-review frames must be extracted for 42/42 clips.
- Codex, not the user, must perform motion self-audit against identity, roster, attrition, teacher-lane, nonlethal, camera, and end-frame locks.
- `motion_self_audit_apply_gate` must pass with current clip and review-frame signatures.
- `clip_revision_queue.csv` must contain no actionable generation, repair, or revision rows.
- `final_concat_gate`, `final_edit_structural_audit`, and `video_generation_run_completion_audit` must pass before the sequence can be called finished.

## Full Post-Shot Ledger Return QA

- Every returned clip is checked against the after-state ledger embedded in its `batch.jsonl`, `batch.csv`, `batch_runbook.md`, and `ORDERED_UPLOAD_CHECKLIST.md` row.
- Required ledger fields per returned clip: Alive / Safe After; Visible But No Active Combat After; Active / Controlling After; Limited But Not Defeated After; Defeated / Removed After; Captured / Objective-Defeated After; Stood Down / Post-Battle After; Must Not Return Active; Changed This Shot; No-Active-Combat Line.
- A returned clip fails motion QA if anyone listed in Visible But No Active Combat After resumes attacking, casting, pursuing, guarding an active route, or otherwise plays as an active combatant after that shot.
- A returned clip fails motion QA if any character listed in Defeated / Removed, Captured / Objective-Defeated, Stood Down / Post-Battle, Must Not Return Active, or No-Active-Combat Line resumes active combat.
- A returned clip fails motion QA if Alive / Safe After is contradicted by lethal injury, blood, gore, humiliation, or death framing.
- Any returned clip that violates the ledger goes to `clip_revision_queue.csv`; it cannot be marked `motion_review_passed`.

## Non-Negotiable Continuity Locks

- No unnamed readable people appear in any returned clip.
- No eliminated/captured/stood-down/objective-defeated character returns to active combat after their ledger exit.
- Hubert, Dorothea, and Bernadetta remain captured after their capture shots.
- Shot032F Hubert captured by Felix/Ashe remains true after return.
- Shot032G Dorothea and Bernadetta captured by Leonie/Claude remains true after return.
- Hanneman and Manuela never become a side-by-side teacher pair or allied combat unit.
- Shot034B empty faculty objective with Hanneman/Manuela absent/offscreen/unpaired remains true after return.
- Shot034B remains Byleth and Dimitri only.
- Shot034G exhausted Dimitri/Dedue core victory remains true after return.
- The final victory remains an exhausted Blue Lions core outcome, not a reset into a full-class celebration.

## Batch Scope

- Batch: batch_005_shots_025-030.
- Rows in this zip: 6.
- Returned clips for this zip must match only the `custom_id` rows below.

## Batch Expected Filenames

- 025_Shot032C: 25_Shot032C.mp4
- 026_Shot032D: 26_Shot032D.mp4
- 027_Shot032E: 27_Shot032E.mp4
- 028_Shot032F: 28_Shot032F.mp4
- 029_Shot032G: 29_Shot032G.mp4
- 030_Shot033: 30_Shot033.mp4
