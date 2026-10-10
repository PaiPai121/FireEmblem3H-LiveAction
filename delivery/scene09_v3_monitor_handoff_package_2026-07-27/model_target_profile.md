# Scene09 V3 Model Target Profile

Date: 2026-08-09
Package: scene09_v3_monitor_handoff_package_2026-07-27
Provider mode: provider_neutral_manual_or_external_cli
Model CLI configured: no

## Input Contract

- Use `model_prompt.md`, `negative_prompt.md`, and package-local `start_frame.png`, `key_frame.png`, `end_frame.png` for every shot.
- Preserve the start/key/end frame chain exactly; do not redesign identities, wardrobes, weapons, house colors, or geography.
- After `full_duration_release_gate` passes, generate one 6-second mp4 per row and save it to the exact `expected_clip` path.

## Global Locks

- No anonymous readable students, spectators, soldiers, crowds, bystanders, or silhouettes.
- No subtitles, captions, visible text, watermark, letterbox/pillarbox UI, or playback chrome.
- Nonlethal Garreg Mach mock-battle tone; no gore, blood, humiliation, or lethal impacts.
- Captured, stood-down, objective-defeated, or defeated-house characters must not resume active combat.
- Hanneman and Manuela are separate faculty lanes; never side by side, never a unit.
- Shot034B: only Byleth and Dimitri; both faculty objective markers stay empty; Hanneman and Manuela absent/offscreen/silent/unpaired.

## Upload Assets

- `submission_payload.jsonl` for structured submitters.
- `actual_delivery_surface_audit.md` for proving current Shot034B Hanneman/Manuela surfaces are repaired across manifests, prompts, payload, and file:// viewers.
- `current_status_consistency_gate.md` for proving the current status page matches machine-readable reports and older status files are marked superseded.
- `submission_contract_gate.md` for cross-checking manifest, execution plan, queue, JSONL payload, and metadata model-entry fields.
- `model_submission_batches/index.html` for file:// manual full-duration batch upload after `full_duration_release_gate` passes.
- `model_submission_batches/expected_downloads.csv` for matching returned mp4 files.
- `motion_probe_submission/` for 42 three-second identity/continuity probes before full-duration generation.
- `motion_probe_package_audit.md` for proving every probe prompt keeps current frame locks, negative prompts, post-shot ledger fields, teacher separation, and full-duration release conditions.
- `motion_probe_provider_bundles/` for zipped, self-contained three-second probe upload batches.
- `motion_probe_provider_bundles_audit.md` for proving probe ZIPs are complete, bundle-local, and tied to 42 unique expected probe returns.
- `motion_probe_submission_ready_gate.md` for the final pre-submit check across 7 probe ZIPs, 42 custom IDs, return intake folders, tracker state, local visual review, and locked full-duration release.
- `full_duration_release_gate.md` for proving full-duration generation remains locked until the production probe apply gate writes `motion_probe_full_duration_release.json`.
- `provider_submission_freshness_gate.md` for proving model batches and provider bundles match the current final payload.
- `submission_queue_with_battle_ledger.csv` for per-shot active/defeated/must-not-return state.
- `clip_return_intake/` for provider-returned mp4 dry-run/apply ingest, including whole-package recursive resume from the intake root after all batch folders are populated.
- `clip_return_roundtrip_audit.md` for strict expected-filename/custom-id return matching, whole-package recursive intake, loose shot-name rejection, unsupported-format rejection, and invalid `.mp4` rejection.
- `clip_provenance_gate.md` for generated clip source and SHA-256 provenance.
- `motion_self_audit/` for Codex-only post-generation motion review decisions.
- `motion_self_audit_packet_audit.md` for self-audit checklist integrity.
- `motion_self_audit_evidence_contract.md` for clip/frame signature evidence requirements.
- `motion_self_audit_unsigned_evidence_rejection.md` for the negative regression test rejecting booleans-only approvals.
- `motion_self_audit_apply_gate.md` for strict validation before Codex motion decisions are written back.
- `after_clip_return_resume_positive_contract.md`, `final_concat_positive_contract.md`, `final_edit_positive_contract.md`, and `video_generation_run_positive_contract.md` for temporary positive-path gate proofs.
- `positive_contract_isolation_gate.md` for proving temporary positive-contract fixtures do not pollute production expected clips or final edit output.
- `model_cli_template_audit.md` for local CLI argv placeholder validation.
