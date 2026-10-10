# batch_002_shots_007-012 Clip Return Intake

Place returned mp4 files from the provider into `returned_mp4/`.

Use exact expected filenames from `expected_downloads_subset.csv` or filenames beginning with the listed `custom_id`. Bare shot-name files such as `Shot034B.mp4` are intentionally rejected by default because they can be stale or from the wrong package.

Every candidate `.mp4` must pass `ffprobe` as a real video container with a video stream and positive duration. A correct filename alone is not enough.

Return format is `.mp4` only. `.mov`, `.m4v`, `.webm`, image files, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.

Provider-ingest provenance records both the original returned source file digest (`source_bytes` / `source_sha256`) and the copied expected-clip digest (`bytes` / `sha256`). `clip_provenance_gate` rejects missing source digests, missing passing `source_video_probe`, and copied outputs whose current SHA-256 no longer matches provenance.

Run dry-run first:

```bash
node scripts/ingest_scene09_v3_generated_clips.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake/batch_002_shots_007-012_returns/returned_mp4 --dry-run
```

If every file maps uniquely and no target overwrite is blocked, apply:

```bash
node scripts/ingest_scene09_v3_generated_clips.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake/batch_002_shots_007-012_returns/returned_mp4 --apply
node scripts/run_scene09_v3_video_pipeline.js --dry-run
```

The dry-run extracts start/mid/end review frames and rebuilds `motion_self_audit/decision_update_template.jsonl`. Codex self-audit must inspect the full clip and these extracted frames, then preserve the current `clip_signature` and `review_evidence.review_frame_signatures.start/mid/end`; rows that only flip review booleans without matching frame signatures are rejected by `motion_self_audit_apply_gate`.

Full post-shot ledger return QA:

- Returned clips are visually checked against the full post-shot ledger fields for their own row and for downstream no-return continuity.
- Required ledger fields per returned clip: Alive / Safe After; Active / Controlling After; Limited But Not Defeated After; Defeated / Removed After; Captured / Objective-Defeated After; Stood Down / Post-Battle After; Must Not Return Active; Changed This Shot; No-Active-Combat Line.
- Four critical locks must remain unbroken: Shot032F Hubert captured by Felix/Ashe; Shot032G Dorothea and Bernadetta captured by Leonie/Claude; Shot034B empty faculty objective with only Byleth/Dimitri readable and Hanneman/Manuela absent/offscreen/silent/unpaired; Shot034G exhausted Dimitri/Dedue core victory.
- Any returned clip that contradicts these ledger fields or critical locks goes to `clip_revision_queue.csv`; it cannot be marked `motion_review_passed`.

Do not rename clips after ingest; use the expected filenames listed in `expected_downloads_subset.csv` when downloading from the provider.
