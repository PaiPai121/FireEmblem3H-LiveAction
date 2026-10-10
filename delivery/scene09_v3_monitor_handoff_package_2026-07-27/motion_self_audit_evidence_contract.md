# Scene09 V3 Motion Self-Audit Evidence Contract

Date: 2026-08-01
Decision: motion_self_audit_evidence_contract_passed
Template rows: 42/42

This audit verifies that future Codex motion-review decisions must be bound to the current expected clip signature and the current start/mid/end extracted review-frame signatures before the apply gate can trust them.

## Checks

- PASS template_rows: 42/42 template rows
- PASS clip_signature_key_present: 42/42 rows include clip_signature
- PASS review_frame_signature_keys_present: 42/42 rows include review_frame_signatures.start/mid/end
- PASS review_frame_checked_flags_present: 42/42 rows include review_frames_checked.start/mid/end
- PASS battle_ledger_key_present: 42/42 rows include battle_ledger_after
- PASS alive_safe_after_present: 42/42 rows include alive_safe_after
- PASS alive_by_house_present: 42/42 rows include battle_ledger_after.alive_by_house
- PASS no_active_combat_line_present: 42/42 rows include no_active_combat_line
- PASS review_frame_signature_function: apply gate defines a review-frame file signature function
- PASS frame_path_bound: review-frame signature includes and compares the relative file path
- PASS frame_size_mtime_sha_bound: review-frame signature binds file size, mtime, and SHA-256
- PASS stale_frame_rejected: apply gate rejects stale or mismatched start/mid/end frame signatures
- PASS frame_review_flags_required: apply gate requires explicit start/mid/end frame review flags
- PASS battle_ledger_bound: apply gate rejects missing or stale battle-ledger/alive-safe/no-active-combat evidence
- PASS runbook_names_frame_signature_contract: RUNBOOK tells operators that start/mid/end frame signatures are required and stale frame evidence is rejected
- PASS clip_return_readme_names_frame_signature_contract: clip return README tells operators that booleans without matching frame signatures are rejected
- PASS operator_preflight_names_evidence_contract: operator preflight status exposes the self-audit evidence contract and frame SHA-256 requirement

## Problems

- none

## Warnings

- all template signatures are currently null because the 42 real clips and extracted review frames are still pending
