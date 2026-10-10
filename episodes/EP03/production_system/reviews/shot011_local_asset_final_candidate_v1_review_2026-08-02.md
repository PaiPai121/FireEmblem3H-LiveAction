# Shot011 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot011_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot011/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot011/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot011/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Continuity input: `storyboards/Shot010/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot011/Shot011_local_video_source_evidence_2026-08-01.jpg`
- Local character/location proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot011_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot purpose: prove the rebellion's pressure on civilians without turning the moment into spectacle.

- Start frame: passes as the cut from fog road into a cold, empty Faerghus border village. Byleth, Ashe, and Mercedes are readable by local-asset wardrobe and silhouette.
- Key frame: passes as the action peak. The door/bar action is visible, the villager remains partial and anonymous, and the Blue Lions stop rather than intrude.
- End frame: passes as edit handoff. The barred door anchors the foreground while a smoke line beyond the village roofs points toward the next rebel-camp cut.
- Character identity: faces are mostly rear/side-facing by design; approval relies on wardrobe topology, hair color, prop state, and continuity with local identity plates.
- Frame chain: start/key/end are visually distinct and communicate entry, civilian withdrawal, and smoke-line cut-out state.

## Blocking Issues

No still-frame story/action blocker for Shot011 final candidate v1.

## Downstream Risks

- The current source prompt contains unrelated Rhea/Catherine/Lonato continuity locks and must be rewritten before web video use.
- The door/hand action may become threatening or too large in motion.
- Civilians may multiply into a crowd spectacle.
- Distant or rear-facing student identities may drift into generic medieval travelers.
- Smoke may become graphic destruction or modern fire imagery.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only the uploaded START, KEY, and END frames, remove unrelated continuity locks, run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to `approved_for_video` if restrained acting, door action, smoke-line handoff, identity/wardrobe locks, no-UI/no-subtitle presentation, and non-graphic tone survive the probe.
