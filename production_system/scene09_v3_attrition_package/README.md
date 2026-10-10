# EP02 Scene09 V3 Attrition Package

Date: 2026-07-27

Status: `monitor_required`; this is a prompt/frame package, not an approved video-generation package.

This is the current prompt-and-frame package for Chapter 2 mock battle video clips. It supersedes the old V2 `motion_test_prompts`, while preserving the existing storyboard IDs so pipeline checks can still find each `frame_spec.md`.

Canon locks:
- No unnamed readable students, spectators, soldiers, bystanders, or crowd silhouettes.
- Hubert is captured by Felix and Ashe after Shot032F.
- Dorothea and Bernadetta are captured by Leonie and Claude after Shot032G.
- Shot032 is the Dedue/Mercedes healer-tank restoration beat; Mercedes spends herself restoring Dedue's shield line.
- Hanneman and Manuela are separate faculty examiners on separate lanes; keep them not side by side, never as a unit, never as allied combat partners, shared sigil defenders, or side-by-side objective defenders.
- Attrition is progressive. Captured characters cannot reappear; spent, stood-down, objective-defeated, or defeated-house characters cannot return as active combatants.
- Blue Lions win through an exhausted surviving core, not a clean whole-class reset.
- Shot025 keeps teacher rule lines offscreen; Shot032B keeps Hanneman isolated on one lane; Shot033B uses no-teacher split-route markers; Shot034D resolves Hanneman's lane; Shot034B resolves Hanneman's separate faculty lane with only Byleth, Dimitri, and Hanneman readable while Manuela remains offscreen, silent, and unpaired; Shot034 uses 2026-07-28 three-leader final field frames.
- Shot033B uses the no-teacher student-route patch; Shot033D and Shot034C use the 2026-07-25 safety patch to keep route-control actions noncontact and nonlethal.

Use these files:
- Production prompt directory: `production_system/scene09_v3_attrition_package/production_video_prompts`
- V3 archived delivery manifest: `production_system/scene09_v3_attrition_package/video_delivery_manifest_v3_attrition_2026-07-27.json`
- Active global delivery manifest: `production_system/video_delivery_manifest.json`
- Per-shot attrition state: `production_system/scene09_v3_attrition_package/attrition_state_by_shot.md`
- Prompt contract validation: `production_system/scene09_v3_attrition_package/video_prompt_contract_validation_2026-07-27.json`
- QA summary: `production_system/scene09_v3_attrition_package/video_prompt_qa_summary.md`
- Usable asset index: `production_system/scene09_v3_attrition_package/usable_assets_and_prompts.md`
- Monitor handoff package: `delivery/scene09_v3_monitor_handoff_package_2026-07-27/`
- Generated-clip structural QA status: `production_system/scene09_v3_attrition_package/scene09_v3_generated_clip_structural_audit_2026-08-01.md`
- Direct file-access gallery link audit: `production_system/scene09_v3_attrition_package/scene09_v3_gallery_link_audit_2026-07-28.json`
- Safety patch frames: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/`

Current gate result:
- `prompt_asset_package`: passes.
- `video_generation_package`: pending final visual QA and clip-level motion QA.
- Final edited clips: pending video generation and clip-level motion QA.

