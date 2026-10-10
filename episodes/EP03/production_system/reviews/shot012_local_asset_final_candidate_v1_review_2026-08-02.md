# Shot012 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot012_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot012/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot012/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot012/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Continuity input: `storyboards/Shot011/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot012/Shot012_local_video_source_evidence_2026-08-01.jpg`
- Local character/location proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot012_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot purpose: let the audience see Lonato's people as organized Western Church followers, not ordinary thieves.

- Start frame: passes as hidden low-angle reconnaissance from the foggy forest edge. Byleth, Ashe, and the Seiros soldier are readable by local-asset silhouette and wardrobe.
- Key frame: passes as the action peak. The camp has old church banners, devotional objects, orderly weapons, wet fires, and exhausted soldiers rather than raider behavior.
- End frame: passes as edit handoff. Byleth's low halt gesture and visible mud foreground set up Shot013's tactical mud sketch.
- Character identity: foreground faces are partial/rear/side-facing by design; approval relies on wardrobe topology, hair/helmet reads, prop state, and continuity with local identity plates.
- Frame chain: start/key/end are visually distinct and communicate observe, understand, and halt-to-plan states.

## Blocking Issues

No still-frame story/action blocker for Shot012 final candidate v1.

## Downstream Risks

- The current source prompt contains unrelated Rhea/Catherine/Lonato continuity locks and must be rewritten before web video use.
- Rebel soldiers may drift into generic bandits, monsters, or villainous raiders.
- Banners or prayer boards may develop readable text or symbols that over-specify faction language.
- Camp population may become too busy and distract from Byleth/Ashe/SeirosSoldier.
- Ashe's rear/side identity and bow/academy uniform may drift in motion.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only the uploaded START, KEY, and END frames, remove unrelated continuity locks, run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to `approved_for_video` if organized-camp tone, restrained observation, tactical-halt handoff, identity/wardrobe locks, no-readable-text, no-UI/no-subtitle presentation, and non-graphic tone survive the probe.
