# Scene09 V3 Operator Preflight Status

Date: 2026-08-09
Decision: full_duration_release_pending_probe_review
Can submit to provider: no
Can execute with local CLI: no
Can claim final video package: no

## Evidence

- Execution assets: execution_asset_integrity_passed (42/42, problems 0)
- Actual delivery surface audit: actual_delivery_surface_passed (problems 0)
- Executable prompt semantics: executable_prompt_semantics_passed (42 shots, problems 0)
- Current status consistency gate: current_status_consistency_passed (problems 0, warnings 0)
- Batch upload audit: model_submission_batches_ready_for_provider_upload (42 rows, problems 0)
- Submission contract gate: submission_contract_gate_passed (42/42 rows, plan 42, queue 42, payload 42, problems 0)
- Model submission index: model_submission_index_file_access_passed (42 cards, problems 0)
- Provider upload bundles: provider_upload_bundles_ready (7 bundles, 7 zip contents checked, expected-download rows 84, digest records 672, prompt files 84, negative prompts 84, executable negative semantics 84, problems 0)
- Provider submission freshness gate: provider_submission_freshness_passed (batch rows 42/42, provider rows 42/42, problems 0)
- Battle ledger timeline: battle_ledger_timeline_passed (42 shots, problems 0)
- Model CLI template audit: model_cli_template_not_configured (configured no, problems 0)
- Clips: 0/42 ready, 42 missing
- Clip return roundtrip: clip_return_roundtrip_passed (0 problems)
- After clip return resume fixture shape: nested_clip_return_intake_root_with_7_returned_mp4_dirs
- Clip provenance gate: clip_provenance_ready_clips_pending (0/42 existing, problems 0)
- Motion self-audit packet: motion_self_audit_packet_ready (42 rows, problems 0)
- Motion ledger contract: 42/42 rows, fields 9/9, critical locks 4/4
- Motion self-audit evidence contract: motion_self_audit_evidence_contract_passed (42 rows, frame-signature rows 42, problems 0)
- Motion unsigned-evidence rejection: motion_self_audit_unsigned_evidence_rejection_passed (frame rejects 126, clip rejects 42, problems 0)
- Motion probe submission ready gate: motion_probe_submission_ready (zips 7/7, rows 42/42, unique IDs 42/42, return batches 7/7, problems 0)
- Full-duration release gate: full_duration_release_blocked_probe_review_pending (can release no, playable probes 0/42, review frames 0, release absent, blockers 4, problems 0)
- Full local visual review: full_local_visual_review_passed_for_motion_probe_not_video_approved (42/42 shots, 126/126 frames, monitor 42/42)
- Report freshness gate: report_freshness_passed_current_manifest (56 reports, problems 0)
- Positive contract isolation gate: positive_contract_isolation_passed (6 contracts, production clips 0/42, production final absent, problems 0)
- Proxy misuse gate: proxy_isolation_passed_clips_pending (problems 0)
- Video generation run completion: video_generation_run_blocked_clips_pending (23/30 checks)

## Motion Ledger Contract

- Required fields: Alive / Safe After; Active / Controlling After; Limited But Not Defeated After; Defeated / Removed After; Captured / Objective-Defeated After; Stood Down / Post-Battle After; Must Not Return Active; Changed This Shot; No-Active-Combat Line
- Shot032F: Hubert captured by Felix/Ashe -> locked
- Shot032G: Dorothea and Bernadetta captured by Leonie/Claude -> locked
- Shot034B: empty faculty objective, Hanneman/Manuela absent/offscreen/unpaired -> locked
- Shot034G: exhausted Dimitri/Dedue core -> locked
- The same fields must remain present in the Codex motion self-audit matrix, update template, README, provider upload manifest, and local CLI handoff comments.

## Current Blocker

- Full-duration generation is locked until 42/42 returned motion probes pass Codex review and `full_duration_release_gate` reaches `full_duration_release_passed`. `VIDEO_MODEL_CLI_ARGV_JSON` is also not configured for local execution.

## Next Action

- Submit/import the 7 motion-probe batches first, run probe clip structural QA and Codex probe review, then apply signed probe decisions until full_duration_release_gate passes.
- Keep all returned clips named/matched through `model_submission_batches/expected_downloads.csv` or the ingest script.
- After import/generation, run the dry-run to extract start/mid/end review frames; Codex self-audit rows must preserve the current clip and frame SHA-256 signatures before apply.
- Do not promote beyond `monitor_required` until all clips pass motion QA and no revision queue rows remain actionable.
