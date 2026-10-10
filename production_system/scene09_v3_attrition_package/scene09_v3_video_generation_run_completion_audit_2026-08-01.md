# Scene09 V3 Video Generation Run Completion Audit

Date: 2026-08-01
Target: video_generation_run
Decision: video_generation_run_blocked_clips_pending
Highest completed target: prompt_asset_package
Checks: 23/30
Final output: `episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4`

## Checks

- PASS package_execution_artifacts: Requires submission_queue.csv, RUNBOOK.md, execution_plan.json, and execution_commands.sh.
- PASS actual_delivery_surface_passed: decision actual_delivery_surface_passed; problems 0.
- PASS current_hanneman_contract_passed: decision current_hanneman_contract_passed; shot Shot034B; visible Byleth, Dimitri; problems 0.
- PASS current_status_consistency_passed: decision current_status_consistency_passed; problems 0; warnings 0.
- PASS provider_preflight_consistency_passed: decision provider_preflight_consistency_passed; can submit no; computed no; expected shots 42/42; problems 0.
- PASS submission_contract_gate_passed: decision submission_contract_gate_passed; rows 42/42; plan 42; queue 42; payload 42; submission ledger digest ok; problems 0.
- PASS provider_submission_freshness_passed: decision provider_submission_freshness_passed; batch rows 42/42; provider rows 42/42; problems 0.
- FAIL full_duration_release_gate_passed: decision full_duration_release_blocked_probe_review_pending; can release no; playable probes 0/42; review frames 0/42; approvals 0/42; release absent; blockers 4; problems 0.
- FAIL all_expected_clips_structural_pass: decision clips_pending; ready 0/42; direct playable 0/42; missing 42; failed 0; file digest ok; probe digest ok.
- FAIL motion_review_frames_complete: extracted 0/42; missing 42; failed 0.
- FAIL codex_motion_self_audit_passed: decision clips_pending; passed 0/42; blocked 0.
- FAIL revision_queue_empty: decision clip_generation_or_revision_actions_required; actionable 42.
- PASS motion_self_audit_packet_ready: decision motion_self_audit_packet_ready; rows 42/42; problems 0.
- PASS motion_self_audit_evidence_contract_passed: decision motion_self_audit_evidence_contract_passed; template rows 42/42; frame signature rows 42/42; problems 0.
- PASS motion_self_audit_unsigned_evidence_rejected: decision motion_self_audit_unsigned_evidence_rejection_passed; frame signature rejections 126/126; clip signature rejections 42/42; restored yes; problems 0.
- PASS motion_self_audit_apply_positive_contract_passed: decision motion_self_audit_apply_positive_contract_passed; proposal rows 42/42; applied yes; passed 42/42; clip sig 42/42; frame sig 42/42; evidence 42/42; ledger 42/42; ledger digest ok; active-return state ok; stale ledger rejected yes; stale active-return rejected yes; checks 42/42; problems 0.
- PASS motion_self_audit_apply_gate_passed: decision motion_self_audit_apply_blocked_clips_pending; applied no; passed 0/42; blocked 0; clip sig 0/42; frame sig 0/42; evidence 0/42; ledger 42/42; ledger digest ok; active-return state ok; checks 42/42; problems 338.
- PASS after_clip_return_resume_positive_contract_passed: decision after_clip_return_resume_positive_contract_passed; apply after_clip_return_ready_for_concat; clips 42/42; frames 42/42; concat final_concat_gate_passed_ready_for_project_pipeline_concat; production changed no; problems 0.
- PASS final_concat_positive_contract_passed: decision final_concat_positive_contract_passed; gate final_concat_gate_passed_ready_for_project_pipeline_concat; checks 8/8; direct ffprobe 42/42; tampered input rejected yes; problems 0.
- PASS clip_return_intake_ready: decision clip_return_intake_ready; batches 7/7; expected rows 42/42; custom ids 42/42; problems 0.
- PASS clip_return_roundtrip_passed_strict: decision clip_return_roundtrip_passed; scenarios expected_filename:42/42/invalid0, custom_id_prefix:42/42/invalid0, nested_intake_root_expected_filenames:42/42/invalid0, loose_shot_name_rejected:0/0/invalid0, invalid_mp4_rejected:0/0/invalid1, unsupported_format_rejected:0/0/invalid0.
- PASS model_cli_execution_provenance_contract_passed: decision model_cli_execution_provenance_passed; rows 42/42; unique clips 42/42; problems 0.
- PASS clip_provenance_gate_passed: decision clip_provenance_ready_clips_pending; existing 0/42; missing 42; provenance rows 0/42; matched 0/42; direct playable 0/42; rows digest ok; problems 0.
- PASS reports_align_with_current_manifest: decision report_freshness_passed_current_manifest; problems 0; warnings 0.
- PASS proxy_assets_not_used_as_real_outputs: decision proxy_isolation_passed_clips_pending; problems 0.
- FAIL final_concat_gate_passed: decision final_concat_blocked_clips_pending; checks 2/8.
- PASS final_edit_positive_contract_passed: decision final_edit_positive_contract_passed; structural final_edit_structural_passed; ok yes; concat binding ok; concat sidecar ok; concat provenance ok; sha yes; wrong-duration rejected yes; wrong-duration issue duration_out_of_tolerance; tampered provenance rejected yes; production changed no; problems 0.
- FAIL final_edit_structural_passed: decision final_edit_pending; exists no; ok no; concat binding missing_or_blocked; concat sidecar missing_or_blocked; concat provenance missing_or_blocked; path bound; sha missing_or_mismatch; issue final_edit_pending.
- PASS positive_contract_isolation_passed: decision positive_contract_isolation_passed; contracts 6/6; production clips 0/42; production final absent; problems 0.
- PASS production_delivery_truth_gate_consistent: decision production_delivery_truth_blocked_clips_pending; truthful target prompt_asset_package; can claim no; real clips 0/42; clip digest ok; clip probe ok; final absent; final binding ok; blockers 9.

## Failed Checks

- full_duration_release_gate_passed: Full-duration generation is released only after 42/42 signed Codex-reviewed motion probes pass
- all_expected_clips_structural_pass: All 42 real expected clips exist and pass structural QA
- motion_review_frames_complete: Motion-review start/mid/end frames exist for every clip
- codex_motion_self_audit_passed: Codex motion self-audit passed every shot without user approval
- revision_queue_empty: No generation, repair, review, or regeneration action remains
- final_concat_gate_passed: Final concat gate passed before assembly
- final_edit_structural_passed: Final edit mp4 exists and passes ffprobe structural QA
