# EP02 Scene09 V3 Attrition Video Prompt Audit

Date: 2026-07-24
Updated: 2026-07-25

Decision: `blocked_needs_revision`

## Direct Answer

The old V2 motion prompts are not qualified final video prompts. They are too loose and fail the `video-prompt-qa` execution contract because they omit required production sections: Shot ID, Duration, Camera, Performance, Audio, and Continuity Locks.

The new V3 attrition prompts are structurally valid prompt candidates: 42/42 pass `validate_prompt_contract.js` after the 2026-07-25 rebuild. That means they can be reviewed and tested systematically. It does not mean they are approved for final video generation.

The active global delivery manifest has now been synced to the V3 monitor package. It points to the V3 production prompts and dedicated frame chains, with zero missing prompt/frame paths and zero `PENDING` end frames.

## Main Blocking Issues

1. Final video package is still blocked even though V3 dedicated end frames are now present, because visual/motion approval and strict adjacent-shot continuity have not passed.
2. Shot032 healer-tank now has start/key/end frames, but remains `monitor_required` pending motion review.
3. Canon capture inserts are integrated into the V3 prompt order and state ledger:
   - Shot032F: Hubert captured by Felix and Ashe.
   - Shot032G: Dorothea and Bernadetta captured by Leonie and Claude.
4. Late stand-down shots and the 2026-07-25 end-patch shots have dedicated frame chains, but still need strict continuity and weapon-prop review before approval.
5. Strict adjacent-shot continuity has not passed for the revised V3 order.
6. The package is intentionally not promoted to `approved_for_video`; the video-generation gate correctly reports 42 monitor-required shots and no immutable `delivery/` package.

## What Was Fixed

- Created V3 attrition package: `production_system/scene09_v3_attrition_package/`.
- Created 42 structured production prompt candidates: `production_system/scene09_v3_attrition_package/production_video_prompts/`.
- Created attrition state ledger: `production_system/scene09_v3_attrition_package/attrition_state_by_shot.md`.
- Created machine-readable validation result: `production_system/scene09_v3_attrition_package/video_prompt_contract_validation_2026-07-25.json`.
- Created package README: `production_system/scene09_v3_attrition_package/README.md`.
- Created usable prompt/frame index: `production_system/scene09_v3_attrition_package/usable_assets_and_prompts.md`.
- Created V3 archived delivery manifest: `production_system/scene09_v3_attrition_package/video_delivery_manifest_v3_attrition_2026-07-25.json`.
- Synced the active global delivery manifest to V3 monitor state: `production_system/video_delivery_manifest.json`.
- Created safety-patch/strict-continuity review: `production_system/reviews/EP02_scene09_v3_safety_patch_and_strict_continuity_review_2026-07-25.md`.
- Created late attrition visual audit: `production_system/reviews/EP02_scene09_v3_attrition_patch_visual_audit_2026-07-24.md`.
- Created end-frame visual audit: `production_system/reviews/EP02_scene09_v3_end_patch_visual_audit_2026-07-25.md`.
- Set dramatic result to Blue Lions exhausted victory, not a clean all-students-standing finish.
- Locked the user-confirmed captures:
  - Hubert captured by Felix and Ashe.
  - Dorothea and Bernadetta captured by Leonie and Claude.
- Self-audit after manifest sync:
  - Captured Hubert, Dorothea, and Bernadetta do not reappear in any later readable-human list.
  - Prompt/frame missing path count: 0.
  - `PENDING` end-frame count: 0.
- Added Leonie and Bernadetta to continuity logic.
- Added the requested Dedue/Mercedes healer-tank beat:
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/canon_patch_2026-07-23/22B_Shot032_healer_tank_start.png`
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/canon_patch_2026-07-23/22B_Shot032_healer_tank_key.png`
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/canon_patch_2026-07-23/22B_Shot032_healer_tank_end.png`
- Added late attrition-patch frame chains:
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/attrition_patch_2026-07-24/35B_Shot034E_attrition_start.png`
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/attrition_patch_2026-07-24/35B_Shot034E_attrition_key.png`
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/attrition_patch_2026-07-24/35B_Shot034E_attrition_end.png`
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/attrition_patch_2026-07-24/36B_Shot034F_attrition_start.png`
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/attrition_patch_2026-07-24/36B_Shot034F_attrition_key.png`
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/attrition_patch_2026-07-24/36B_Shot034F_attrition_end.png`
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/attrition_patch_2026-07-24/37B_Shot034G_attrition_start.png`
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/attrition_patch_2026-07-24/37B_Shot034G_attrition_key.png`
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/attrition_patch_2026-07-24/37B_Shot034G_attrition_end.png`
- Added 2026-07-25 end-patch frames for Shot033B, Shot033C, Shot033D, Shot034C, Shot034D, Shot034B, Shot034, Shot035, and Shot036:
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/end_patch_2026-07-25/`
- Added 2026-07-25 safety-patch frame chains for Shot033B, Shot033D, and Shot034C:
  - `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/`

## Prompt QA Result

Validation command: `node ~/.codex/skills/video-prompt-qa/scripts/validate_prompt_contract.js [prompt] --json`

Result:

- Total V3 production prompts: 42
- Structural contract passed: 42
- Structural contract failed: 0

This is a structural pass only. The package remains `blocked_needs_revision` until frame-chain and continuity gates pass.

## Attrition Shape

- Early phase: all houses active; support lines pressured but not removed.
- Mid phase: Mercedes restores Dedue's shield line, then Mercedes and Annette spend their support role and leave active combat.
- Capture phase: Hubert is captured by Felix and Ashe; Dorothea and Bernadetta are captured by Leonie and Claude.
- Objective phase: Ashe, Ingrid, Sylvain, and Felix each spend their final action suppressing or cutting routes.
- Finish: Blue Lions win through Byleth/Dimitri/Dedue core pressure, with most of the class spent or stood down.

Terminology note: `No-active-combat after` means a character may appear later only as a noncombat dialogue focus, defeated objective target, or stood-down figure when that shot explicitly lists them as readable. It does not allow them to resume fighting. Captured Hubert, captured Dorothea, and captured Bernadetta are stricter: they must not reappear in readable form after capture.

## Required Next Revisions

- No V3 prompt currently uses `key_frame` as a temporary end frame after the 2026-07-25 rebuild.
- Run strict continuity and weapon-prop review for Shot032, Shot032F, Shot032G, Shot034E, Shot034F, and Shot034G.
- Run strict continuity and weapon-prop review for the 2026-07-25 end-patch frames.
- Run strict continuity gate on the revised V3 chain.
- Only after those pass, promote individual shots from `monitor_required` to `approved_for_video`.
