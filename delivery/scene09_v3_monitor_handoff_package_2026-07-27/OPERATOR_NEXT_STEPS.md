# EP02 Scene09 Operator Next Steps

Generated: 2026-08-09T12:32:44.504Z
Status: phase=clips_pending; next=submit_motion_probes; motion_probe_bundles=motion_probe_provider_bundles_ready; motion_probe_submission_ready=motion_probe_submission_ready; playable_probes=0/42; full_duration_release=no; full_duration_clips=0/42; completion=video_generation_run_blocked_clips_pending; full_local_visual_review=full_local_visual_review_passed_for_motion_probe_not_video_approved

## Decision

- Current phase: `clips_pending`
- Next action: `submit_motion_probes`
- Full-duration provider upload unlocked: no
- Local model CLI executable: no

## Counts

- Motion probes playable: 0/42
- Full-duration clips ready: 0/42
- Full-duration clips missing: 42
- Video generation completion checks: 23/30
- Completion failed checks: full_duration_release_gate_passed, all_expected_clips_structural_pass, motion_review_frames_complete, codex_motion_self_audit_passed, revision_queue_empty, final_concat_gate_passed, final_edit_structural_passed

## Blocking Items

- full_duration_release_locked: full_duration_release_blocked_probe_review_pending. Full-duration provider upload remains locked until motion probes exist, review frames are extracted, and Codex probe review writes the release artifact.
- no_local_model_cli: can_execute_with_local_cli=false. VIDEO_MODEL_CLI_ARGV_JSON is not configured, so the local pipeline cannot call a real video model.
- real_clips_missing: 0/42 real clips ready; 42 missing. Expected production mp4 clips are absent and cannot be replaced by proxy animatic clips.

## Do Next

1. Open delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_provider_bundles/index.html
1. Submit the 7 probe zip bundles in motion_probe_provider_bundles/ to the external video provider as 3-second probe jobs.
1. Place returned probe mp4 files under delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_return_intake/
1. Run: node scripts/run_scene09_v3_video_pipeline.js --dry-run

## Key Links

- [Motion probe provider visual index](motion_probe_provider_bundles/index.html)
- [Motion probe provider bundles](motion_probe_provider_bundles/README.md)
- [Motion probe submission ready gate](motion_probe_submission_ready_gate.md)
- [Motion probe submission ready gate JSON](motion_probe_submission_ready_gate.json)
- [Motion probe manifest](motion_probe_submission/motion_probe_manifest.json)
- [Motion probe operator tracker](motion_probe_operator_tracker.html)
- [Motion probe operator tracker audit](motion_probe_operator_tracker_audit.md)
- [Full local visual review](full_local_visual_review.md)
- [Full local visual review JSON](full_local_visual_review.json)
- [Full-duration release gate](full_duration_release_gate.md)
- [Full-duration provider bundles](provider_upload_bundles/README.md)
- [Provider return contract](provider_upload_bundles/RETURN_CONTRACT.md)
- [Runbook](RUNBOOK.md)
