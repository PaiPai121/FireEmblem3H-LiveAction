# Scene09 V3 Clip Return Intake

This folder is the receiving area for real provider-generated mp4 clips.

Use one batch return directory at a time. Put provider downloads in that batch's `returned_mp4/` directory, run the listed dry-run command, then apply only if matching is unique.

Strict filename rule: use exact expected filenames or filenames beginning with the listed `custom_id`. Bare shot-name files are not accepted by default, so older files like `Shot034B.mp4` or `Shot042.mp4` cannot be mistaken for current package outputs.

Validity rule: the ingest dry-run probes every candidate `.mp4` with `ffprobe`; corrupt files, text placeholders, zero-duration containers, or non-video files are blocked before matching or copying.

Format rule: returned clips must be `.mp4`. `.mov`, `.m4v`, `.webm`, image files, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.

Provenance rule: provider ingest records both the original returned source file digest (`source_bytes` / `source_sha256`) and the copied expected-clip digest (`bytes` / `sha256`). `clip_provenance_gate` rejects missing source digests, missing passing `source_video_probe`, and copied outputs whose current SHA-256 no longer matches provenance.

After applying any clips, run:

```bash
node scripts/run_scene09_v3_video_pipeline.js --dry-run
```

That dry-run extracts start/mid/end review frames and refreshes `motion_self_audit/decision_update_template.jsonl`. Before any motion row can be applied, Codex must inspect the full clip plus the extracted frames, keep the current `clip_signature`, and keep `review_evidence.review_frame_signatures.start/mid/end` bound to the exact frame paths, file sizes, mtimes, and SHA-256 hashes. The apply gate rejects stale frame evidence or rows that only set review booleans.

Full post-shot ledger return QA:

- Returned clips are visually checked against the full post-shot ledger fields for their own row and for downstream no-return continuity.
- Required ledger fields per returned clip: Alive / Safe After; Active / Controlling After; Limited But Not Defeated After; Defeated / Removed After; Captured / Objective-Defeated After; Stood Down / Post-Battle After; Must Not Return Active; Changed This Shot; No-Active-Combat Line.
- Four critical locks must remain unbroken: Shot032F Hubert captured by Felix/Ashe; Shot032G Dorothea and Bernadetta captured by Leonie/Claude; Shot034B empty faculty objective with only Byleth/Dimitri readable and Hanneman/Manuela absent/offscreen/silent/unpaired; Shot034G exhausted Dimitri/Dedue core victory.
- Any returned clip that contradicts these ledger fields or critical locks goes to `clip_revision_queue.csv`; it cannot be marked `motion_review_passed`.

Proxy animatic clips must never be placed here and never count as generated model outputs.

Whole-package recursive resume:

```bash
node scripts/resume_scene09_v3_after_clip_return.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake
node scripts/resume_scene09_v3_after_clip_return.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake --apply-ingest
```

Use this only after all returned batch folders have been populated, or the dry-run will correctly report missing sources for unreturned shots.
