# Scene09 V3 Final Concat Gate

Date: 2026-08-01
Decision: final_concat_blocked_clips_pending
Checks: 2/8
Final output: `episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4`

## Checks

- FAIL clip_structural_integrity: 0/42 ready, direct ffprobe 0/42, 42 missing, 0 failed
- FAIL motion_review_frames: 0/42 extracted, 42 missing, 0 failed
- FAIL motion_review_decisions: decision clips_pending, passed 0/42, pending 42
- FAIL revision_queue_empty: 42 actionable shots, decision clip_generation_or_revision_actions_required
- FAIL clip_provenance_gate: decision clip_provenance_ready_clips_pending, existing 0/42, provenance rows 0/42, matched 0/42, rows digest ok, problems 0
- FAIL motion_self_audit_apply_gate: decision motion_self_audit_apply_blocked_clips_pending, applied no, passed 0/42, blocked 0, clip sig 0/42, frame sig 0/42, evidence 0/42, ledger 42/42, ledger digest ok, active-return state ok, checks 42/42, problems 338
- PASS final_concat_inputs_contract: decision final_concat_inputs_contract_passed, rows 42/42, unique clips 42/42, duration 252/252, signatures ok, problems 0
- PASS final_output_not_preclaimed: final output is absent, as expected before concat

## Failed Checks

- clip_structural_integrity: All expected mp4 clips exist and pass ffprobe/duration structural QA
- motion_review_frames: Start/mid/end motion review frames are extracted for every real clip
- motion_review_decisions: Every shot has a machine-readable motion_review_passed decision
- revision_queue_empty: No generation, repair, Codex self-audit, blocked revision, or regeneration action remains
- clip_provenance_gate: Every existing expected clip has provider-ingest or local-model provenance matching current SHA-256
- motion_self_audit_apply_gate: Codex motion self-audit decisions were validated and applied through the strict apply gate
