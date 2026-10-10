# EP02 Scene09 V3 Monitor Handoff Runbook

Date: 2026-07-27
Package: scene09_v3_monitor_handoff_package_2026-07-27
Source manifest: production_system/video_delivery_manifest.json
Status: monitor_required, clips_pending

This is the current handoff package for video-model submission. It is not marked `approved_for_video`; it is a monitor-stage execution package built from the latest prompt/frame manifest.

## Submission Rule

Submit shots in timeline order. For each shot, use the local files in that shot directory:

- `model_prompt.md` (the only prompt text to paste into a web video generator)
- `negative_prompt.md`
- `start_frame.png`
- `key_frame.png`
- `end_frame.png`
- `metadata.json`

`prompt.md` is retained as an internal audit/source trace file and may include local source paths. Do not paste `prompt.md` into a web video generator.

For automated submitters, use `submission_payload.jsonl`. Each JSON line includes `prompt_text`, `negative_prompt_text`, structured after-shot `battle_ledger_after` / `battle_state_after`, local and absolute frame paths, file SHA-256 digests, visible roster locks, reject criteria, and the expected clip path.

For batch-oriented providers or manual upload sessions, use `model_submission_batches/index.html` after running the pipeline. It contains provider-neutral JSONL/CSV batches, one Markdown operator sheet per batch, `batch_manifest.json`, and `expected_downloads.csv` for matching returned mp4 files back to the exact shot/custom_id.

Save the generated clip to the `expected_clip` path in `metadata.json`, then run clip-level motion QA before concatenating.

Use `clip_motion_qa_checklist.csv` as the per-shot review sheet after clips are generated.

## One-Step Local Pipeline

Use the project-level pipeline wrapper to rebuild, validate, run clip QA, refresh both file:// galleries, and optionally execute/concat:

```bash
node scripts/run_scene09_v3_video_pipeline.js --dry-run
node scripts/run_scene09_v3_video_pipeline.js --execute --concat
```

The wrapper will not call any video model unless `--execute` is provided and `VIDEO_MODEL_CLI_ARGV_JSON` is configured. It will not concatenate unless all 42 expected clips exist, pass file-level clip QA, have start/mid/end motion-review frames, and have `motion_review_passed` decisions.
Direct `node scripts/run_video_generation_package.js <this-package> --concat` is intentionally blocked for this monitor handoff; use the project pipeline for final assembly.
The dry run also rebuilds and audits `model_submission_batches/`, so the file:// package and batch upload material stay synchronized.
The dry run also rebuilds `provider_upload_bundles/` and runs `provider_submission_freshness_gate`, proving the manual upload batches and provider zip bundles match the current final `submission_payload.jsonl`.

## Final Assembly Gate

The expected final edit is `episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4`. It is not complete merely because a file exists at that path.

Final assembly is allowed only after all of these checks pass:

- 42/42 expected real model `.mp4` clips exist at their `expected_clip` paths.
- `generated_clip_structural_audit` passes file-level mp4 checks for every clip.
- `actual_delivery_surface_audit` proves current Shot034B empty-objective delivery surfaces are repaired across manifests, prompts, payload, and file:// viewers.
- `current_status_consistency_gate` proves the current file-access status page matches machine-readable reports and older status files are marked superseded.
- `provider_preflight_consistency_gate` proves operator preflight, provider upload manifest, package execution readiness, and model target profile agree before external submission.
- Start/mid/end motion-review frames exist for every generated clip.
- Codex self-audit marks every shot `motion_review_passed`; the user is not asked to approve these rows.
- `motion_self_audit_packet_audit` proves the Codex-only review matrix/checklist is structurally ready before completion can be claimed.
- `motion_self_audit_apply_positive_contract` proves the apply gate has a positive path when current signed clip/frame evidence is complete.
- `motion_self_audit_apply_gate` proves Codex-reviewed motion decision rows were validated and written back without user/operator approval or stale clip signatures.
- `after_clip_return_resume_positive_contract` proves the after-clip-return wrapper can ingest exact returned clip filenames, preserve signed review-frame evidence across reruns, apply Codex motion decisions, and reach ready-for-concat.
- `final_concat_inputs_contract` proves final assembly input order, unique expected-clip paths, and duration sum are locked before concat.
- `final_concat_positive_contract` proves the final concat gate has a positive path when every upstream report is complete and current.
- `final_edit_positive_contract` proves the final edit structural audit has a positive path for a valid package-duration mp4.
- `video_generation_run_positive_contract` proves the completion audit has a positive path when every upstream clip, motion, provenance, concat, and final-edit proof is complete, and rejects stale final concat 7/7 evidence.
- `positive_contract_isolation_gate` proves temporary positive-contract fixtures do not create or mask production expected clips or the production final edit.
- `submission_contract_gate` proves package manifest, execution plan, submission queue, JSONL payload, and per-shot metadata all describe the same model-submission inputs.
- `provider_submission_freshness_gate` proves model submission batches and provider upload bundles were rebuilt from the current final `submission_payload.jsonl`.
- `motion_probe_operator_tracker` and `motion_probe_operator_tracker_audit` prove the 7 probe zip batches, 42 expected probe filenames, returned-mp4 folders, CSV rows, and operator tracking surface are current before probe submission or return ingest.
- `full_local_visual_review` proves all 42 current still-frame shot sets and 126 frame refs were locally reviewed and are accepted only for monitored short motion probes, not for full-duration video approval.
- `clip_return_roundtrip_audit` proves provider-returned clips can be matched by exact expected filename or `custom_id` prefix while rejecting bare shot-name files.
- `model_cli_execution_provenance_audit` proves the local CLI execution path writes `model_cli_execute` provenance with output SHA-256 values.
- `clip_provenance_gate` proves every existing expected clip has provider-ingest or local-model provenance matching its current SHA-256.
- `clip_revision_queue.csv` has no actionable repair/regeneration rows.
- `report_freshness_gate` proves package-local reports still align with the current package manifest.
- `proxy_misuse_gate` proves reference-only proxy animatic clips are not used as expected clips or final edit.
- The final edit structural audit passes: ffprobe can parse the file, a video stream exists, and duration is within +/-3s of the 252s package duration.

The relevant reports are `actual_delivery_surface_audit.md/json`, `current_status_consistency_gate.md/json`, `provider_preflight_consistency_gate.md/json`, `submission_contract_gate.md/json`, `provider_submission_freshness_gate.md/json`, `motion_probe_operator_tracker.html/json/csv`, `motion_probe_operator_tracker_audit.md/json`, `full_local_visual_review.md/json`, `after_clip_return_resume.md/json`, `after_clip_return_resume_positive_contract.md/json`, `motion_self_audit_packet_audit.md/json`, `motion_self_audit_apply_positive_contract.md/json`, `motion_self_audit_apply_gate.md/json`, `final_concat_inputs_contract.md/json`, `final_concat_positive_contract.md/json`, `final_edit_positive_contract.md/json`, `video_generation_run_positive_contract.md/json`, `positive_contract_isolation_gate.md/json`, `clip_return_roundtrip_audit.md/json`, `model_cli_execution_provenance_audit.md/json`, `clip_provenance_gate.md/json`, `report_freshness_gate.md/json`, `proxy_misuse_gate.md/json`, `final_concat_gate.md/json`, `final_edit_structural_audit.md/json`, and `video_generation_run_completion_audit.md/json`. If any report `clips_pending`, `final_edit_pending`, or a blocked decision, the package is still not a completed video generation run.

## Proxy Animatic Clips

For timeline and file:// review before real video generation, build reference-only per-shot proxy clips from the packaged start/key/end frames:

```bash
node scripts/build_scene09_v3_proxy_animatic_clips.js
```

These proxy clips live under `episodes/EP02/video_outputs/scene09_v3_attrition/proxy_animatic_clips/` and the proxy edit is `episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_proxy_animatic_edit_2026-07-28.mp4`. They are never written to `expected_clip`, never count as AI model outputs, and cannot satisfy clip-level motion QA.

## Import External Model Downloads

If clips are generated outside this repo, import the downloaded `.mp4` files through the safe ingest tool instead of hand-editing paths. The script matches exact expected filenames and `custom_id` prefixes by default, rejects bare shot-name files as too weak, refuses ambiguous matches, and will not overwrite existing targets unless `--force` is explicit.

```bash
node scripts/ingest_scene09_v3_generated_clips.js --input /path/to/model/downloads --dry-run
node scripts/ingest_scene09_v3_generated_clips.js --input /path/to/model/downloads --apply
node scripts/run_scene09_v3_video_pipeline.js --dry-run
```

For a single resumable handoff after provider clips return, use the stricter resume wrapper. It scans or imports returned clips, refreshes clip QA, extracts motion-review frames, probes/applies Codex self-audit decisions, rebuilds the revision queue, checks provenance, blocks unsafe concat, audits the final edit if present, and writes `after_clip_return_resume.md/json`:

```bash
node scripts/resume_scene09_v3_after_clip_return.js --input /path/to/model/downloads
node scripts/resume_scene09_v3_after_clip_return.js --input /path/to/model/downloads --apply-ingest
node scripts/resume_scene09_v3_after_clip_return.js --motion-proposal delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_self_audit/decision_update_template.jsonl --apply-motion --concat
```

The ingest report is written to `production_system/scene09_v3_attrition_package/scene09_v3_clip_ingest_report_2026-07-28.md` and remains only a file-placement gate; every imported clip still requires clip file QA, extracted motion-review frames, and Codex motion self-audit.

## Provider Upload Bundles

- Self-contained upload folders and zip archives live in `provider_upload_bundles/`.
- Each `batch_###_shots_###-###/` folder contains `batch.jsonl`, `batch.csv`, `batch_runbook.md`, `expected_downloads_subset.csv`, an upload checklist, and package-local shot files under `shots/`.
- The matching `.zip` beside each folder can be uploaded or moved as one unit.
- These full-duration bundles are structurally prepared but locked; do not upload them until `full_duration_release_gate` passes.
- Use `provider_upload_bundles/provider_upload_bundles_manifest.json` to verify SHA-256 checksums before and after transfer.
- Use `provider_upload_bundles/RETURN_CONTRACT.md` to validate returned mp4 filenames, ingest procedure, and post-return QA gates.
## Generated Operator Profile

- Model target profile: `model_target_profile.md` / `model_target_profile.json`.
- Operator preflight status: `operator_preflight_status.md` / `operator_preflight_status.json`.
- Actual delivery surface audit: `actual_delivery_surface_audit.md` / `actual_delivery_surface_audit.json`.
- Current status consistency gate: `current_status_consistency_gate.md` / `current_status_consistency_gate.json`.
- Submission contract gate: `submission_contract_gate.md` / `submission_contract_gate.json`.
- Provider submission freshness gate: `provider_submission_freshness_gate.md` / `provider_submission_freshness_gate.json`.
- Provider upload manifest: `provider_upload_manifest.json`.
- Motion probe submission: `motion_probe_submission/` and `motion_probe_package_audit.md` / `motion_probe_package_audit.json`.
- Motion probe provider bundles: `motion_probe_provider_bundles/` and `motion_probe_provider_bundles_audit.md` / `motion_probe_provider_bundles_audit.json`.
- Motion probe submission ready gate: `motion_probe_submission_ready_gate.md` / `motion_probe_submission_ready_gate.json`.
- Motion probe operator tracker: `motion_probe_operator_tracker.html` / `motion_probe_operator_tracker.json` / `motion_probe_operator_tracker.csv`.
- Motion probe operator tracker audit: `motion_probe_operator_tracker_audit.md` / `motion_probe_operator_tracker_audit.json`.
- Full local visual review: `full_local_visual_review.md` / `full_local_visual_review.json`.
- Full-duration release gate: `full_duration_release_gate.md` / `full_duration_release_gate.json`.
- Model CLI template audit: `model_cli_template_audit.md` / `model_cli_template_audit.json`.
- Clip return roundtrip audit: `clip_return_roundtrip_audit.md` / `clip_return_roundtrip_audit.json`.
- Clip provenance gate: `clip_provenance_gate.md` / `clip_provenance_gate.json`.
- Motion self-audit packet audit: `motion_self_audit_packet_audit.md` / `motion_self_audit_packet_audit.json`.
- Motion self-audit evidence contract: `motion_self_audit_evidence_contract.md` / `motion_self_audit_evidence_contract.json`.
- Motion self-audit unsigned-evidence rejection: `motion_self_audit_unsigned_evidence_rejection.md` / `motion_self_audit_unsigned_evidence_rejection.json`.
- Report freshness gate: `report_freshness_gate.md` / `report_freshness_gate.json`.
- Positive contract isolation gate: `positive_contract_isolation_gate.md` / `positive_contract_isolation_gate.json`.
- Proxy misuse gate: `proxy_misuse_gate.md` / `proxy_misuse_gate.json`.
- Video generation run completion audit: `video_generation_run_completion_audit.md` / `video_generation_run_completion_audit.json`.
- Battle-ledger submission queue: `submission_queue_with_battle_ledger.csv` / `submission_queue_with_battle_ledger.md`.

## Current Model CLI

No `VIDEO_MODEL_CLI_ARGV_JSON` template is configured. `execution_commands.sh` is therefore a commented handoff list, not an executable generation script yet.

Example template shape:

```bash
export VIDEO_MODEL_CLI_ARGV_JSON='["video-cli","i2v","--prompt","{prompt}","--negative","{negative_prompt}","--first","{start_frame}","--key","{key_frame}","--last","{end_frame}","--duration","{duration}","--out","{output}"]'
```

## Scene-Specific Hard Rejects

- Any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears.
- Hubert reappears in readable form after Shot032F.
- Dorothea or Bernadetta reappears in readable form after Shot032G.
- Any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.
- Hanneman and Manuela are staged side by side, share one sigil, or behave as one allied teacher unit.
- Shot034B shows Hanneman, Manuela, any extra teacher, any student extra, or anyone outside Byleth and Dimitri.
- Shot034G becomes a full Blue Lions class celebration instead of the exhausted Byleth/Dimitri/Dedue core.
- The mock battle becomes lethal, bloody, humiliating, or changes training weapons into lethal impacts.

## Submission Order

1. `shots/001_EP02-SC09-SHOT-Shot025-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/01_Shot025.mp4`
2. `shots/002_EP02-SC09-SHOT-Shot025A-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/02_Shot025A.mp4`
3. `shots/003_EP02-SC09-SHOT-Shot026-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/03_Shot026.mp4`
4. `shots/004_EP02-SC09-SHOT-Shot026B-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/04_Shot026B.mp4`
5. `shots/005_EP02-SC09-SHOT-Shot026C-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/05_Shot026C.mp4`
6. `shots/006_EP02-SC09-SHOT-Shot027-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/06_Shot027.mp4`
7. `shots/007_EP02-SC09-SHOT-Shot027B-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/07_Shot027B.mp4`
8. `shots/008_EP02-SC09-SHOT-Shot027C-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/08_Shot027C.mp4`
9. `shots/009_EP02-SC09-SHOT-Shot027D-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/09_Shot027D.mp4`
10. `shots/010_EP02-SC09-SHOT-Shot028-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/10_Shot028.mp4`
11. `shots/011_EP02-SC09-SHOT-Shot028B-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/11_Shot028B.mp4`
12. `shots/012_EP02-SC09-SHOT-Shot028C-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/12_Shot028C.mp4`
13. `shots/013_EP02-SC09-SHOT-Shot029-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/13_Shot029.mp4`
14. `shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/14_Shot029C.mp4`
15. `shots/015_EP02-SC09-SHOT-Shot029D-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/15_Shot029D.mp4`
16. `shots/016_EP02-SC09-SHOT-Shot029B-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/16_Shot029B.mp4`
17. `shots/017_EP02-SC09-SHOT-Shot030-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/17_Shot030.mp4`
18. `shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/18_Shot030B.mp4`
19. `shots/019_EP02-SC09-SHOT-Shot030C-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/19_Shot030C.mp4`
20. `shots/020_EP02-SC09-SHOT-Shot031-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/20_Shot031.mp4`
21. `shots/021_EP02-SC09-SHOT-Shot031B-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/21_Shot031B.mp4`
22. `shots/022_EP02-SC09-SHOT-Shot032-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/22_Shot032.mp4`
23. `shots/023_EP02-SC09-SHOT-Shot032A-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/23_Shot032A.mp4`
24. `shots/024_EP02-SC09-SHOT-Shot032B-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/24_Shot032B.mp4`
25. `shots/025_EP02-SC09-SHOT-Shot032C-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/25_Shot032C.mp4`
26. `shots/026_EP02-SC09-SHOT-Shot032D-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/26_Shot032D.mp4`
27. `shots/027_EP02-SC09-SHOT-Shot032E-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/27_Shot032E.mp4`
28. `shots/028_EP02-SC09-SHOT-Shot032F-V2-20260724` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/28_Shot032F.mp4`
29. `shots/029_EP02-SC09-SHOT-Shot032G-V2-20260724` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/29_Shot032G.mp4`
30. `shots/030_EP02-SC09-SHOT-Shot033-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/30_Shot033.mp4`
31. `shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/31_Shot033B.mp4`
32. `shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/32_Shot033C.mp4`
33. `shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/33_Shot033D.mp4`
34. `shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/34_Shot034C.mp4`
35. `shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/35_Shot034D.mp4`
36. `shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/36_Shot034B.mp4`
37. `shots/037_EP02-SC09-SHOT-Shot034E-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/37_Shot034E.mp4`
38. `shots/038_EP02-SC09-SHOT-Shot034F-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/38_Shot034F.mp4`
39. `shots/039_EP02-SC09-SHOT-Shot034G-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/39_Shot034G.mp4`
40. `shots/040_EP02-SC09-SHOT-Shot034-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/40_Shot034.mp4`
41. `shots/041_EP02-SC09-SHOT-Shot035-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/41_Shot035.mp4`
42. `shots/042_EP02-SC09-SHOT-Shot036-V2-20260721` (6s) -> `episodes/EP02/video_outputs/scene09_v3_attrition/42_Shot036.mp4`

## Codex Motion Self-Audit Packet

- After real clips are imported and the pipeline extracts start/mid/end review frames, use `motion_self_audit/motion_self_audit_matrix.csv` and `motion_self_audit/decision_update_template.jsonl` for Codex self-audit.
- Do not ask the user to approve motion rows; Codex must inspect the clip and extracted frames against every required check.
- To write reviewed rows back, run `node scripts/apply_scene09_v3_motion_self_audit_decisions.js delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_self_audit/decision_update_template.jsonl --apply`; this refuses to apply while real clips or review frames are missing.
- Reviewed rows must preserve the current clip SHA-256 signature and the current start/mid/end review-frame SHA-256 signatures from the template; stale clip or frame evidence is rejected.
- Reviewed rows must include current start/mid/end frame signatures; stale clip or frame evidence is rejected before any motion pass can count.
- Each reviewed row must keep `review_evidence.review_frame_signatures.start/mid/end` bound to the extracted review frames.
- A clip can only move toward concatenation when every row is `motion_review_passed` and every required check is `pass`.
## Post-Generation QA

After clips exist, inspect them in order for identity drift, extra people, weapon drift, screen-direction reversal, illegal character re-entry, and failure to land on the end frame. Only then can the package be promoted beyond `monitor_required`.

Run the file-level clip audit first:

```bash
node scripts/audit_scene09_v3_generated_clips.js
node scripts/audit_scene09_v3_attrition_visibility_timeline.js
node scripts/build_scene09_v3_clip_motion_review_assets.js
node scripts/build_scene09_v3_clip_motion_review_decision_template.js
node scripts/apply_scene09_v3_motion_self_audit_decisions.js delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_self_audit/decision_update_template.jsonl --apply
node scripts/audit_scene09_v3_clip_motion_review_decisions.js
node scripts/build_scene09_v3_clip_revision_queue.js
```

The motion-review asset script extracts start/mid/end stills from each real generated clip into `production_system/scene09_v3_attrition_package/generated_clip_motion_review_frames_2026-07-28/` and writes `clip_motion_review_assets.html` for Codex self-audit.
The decision template records the machine-readable Codex motion QA result for every shot. A clip stays `needs_codex_motion_review` until its extracted frames and full clip pass all identity, attrition, teacher-lane, nonlethal, camera, and end-frame checks.
The revision queue records every remaining generation, file repair, Codex self-audit, or blocked revision action. No clip can be concatenated while `clip_revision_queue.csv` contains actionable shots.
After concatenation, run `node scripts/audit_scene09_v3_final_edit_structural.js --file episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4`; a final edit can only be called delivered when that report returns `final_edit_structural_passed`.
