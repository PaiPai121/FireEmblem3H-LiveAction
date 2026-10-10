# EP02 Scene09 V3 Video Prompt QA Summary

Date: 2026-07-27

Decision: `monitor_required` before video-model generation.

Resolved blockers:
- The old V2 `motion_test_prompts` fail the required video prompt contract because they omit Shot ID, Duration, Camera, Performance, Audio, and Continuity Locks.
- Dedicated end frames are now present in the V3 prompt package; temporary key-frame holds remaining: 0.
- Shot032F and Shot032G are integrated into the V3 prompt sequence and locked by attrition state.
- Shot033B now uses the no-teacher student-route patch; Shot033D and Shot034C retain safety-patch frame chains but still require final visual-risk review before expensive video generation.
- Still-frame adjacent continuity is recorded in `production_system/continuity_manifest.json`; clip-level motion QA is still pending.
- The global delivery manifest has been updated to the V3 monitored prompt/frame manifest: `production_system/video_delivery_manifest.json`; archived copy: `production_system/scene09_v3_attrition_package/video_delivery_manifest_v3_attrition_2026-07-27.json`.
- Monitor handoff package for downstream video submission: `delivery/scene09_v3_monitor_handoff_package_2026-07-27/`.
- Generated-clip structural QA status is tracked at `production_system/scene09_v3_attrition_package/scene09_v3_generated_clip_structural_audit_2026-08-01.md`.
- Direct file-access gallery link audit is tracked at `production_system/scene09_v3_attrition_package/scene09_v3_gallery_link_audit_2026-07-28.json`.
- Generated clips are not final edit delivery; they still require clip-level motion QA after video generation.

What V3 fixes:
- Every generated V3 prompt now has the required prompt-contract sections.
- Full contract validation on 2026-07-27: 42/42 V3 production prompts passed; 0 failed.
- Attrition state is explicit after every shot.
- Hubert is locked as captured after Shot032F.
- Dorothea and Bernadetta are locked as captured after Shot032G.
- Characters that are spent, stood down, or objective-defeated are labeled as no-active-combat instead of being treated as invisible; post-battle or defeated-target appearances remain allowed only when the shot's visible named-only list says so.
- Shot032 is rewritten around the Dedue/Mercedes healer-tank beat and now has start/key/end frames.
- Shot025 removes visible faculty co-presence and keeps Hanneman/Manuela rule lines as separated offscreen audio.
- Shot032B keeps Hanneman isolated on his own lane, Shot033B uses no-teacher split-route markers, and Shot034B resolves Hanneman's separate faculty lane with only Byleth, Dimitri, and Hanneman readable while Manuela remains offscreen, silent, and unpaired.
- Shot033B uses 2026-07-27 no-teacher student-route frames; Shot033D and Shot034C use 2026-07-25 safety-patch frame chains that reduce hard camera jumps, visible route-stab risk, and body-aimed weapon poses.
- Shot034E removes non-Golden Deer figures from the defeated-house stand-down.
- Shot034F removes captured Hubert, Dorothea, and Bernadetta from the Black Eagles stand-down.
- Shot034G reduces the Blue Lions finish to the surviving Byleth/Dimitri/Dedue core instead of a full-class victory reset.
- Shot034 removes Hanneman and Manuela from the final wide-field resolution; only the three house leaders remain readable.
- Shot033B through Shot036 now have dedicated V3 end-frame patch files instead of temporary key-frame holds.

Decision by stage:
- Prompt structure: `contract_passed` after structural validation (42/42 passed).
- Visual continuity: `monitor_required`; generated clips must not be treated as pre-approved.
- Video generation package: pending final visual QA and clip-level motion QA.

