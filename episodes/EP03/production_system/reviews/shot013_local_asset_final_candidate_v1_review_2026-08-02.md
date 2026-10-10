# Shot013 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot013_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot013/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot013/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot013/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Continuity input: `storyboards/Shot012/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot013/Shot013_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot013_local_asset_previs_proof_2026-07-31.jpg`
- Identity comparison: `production_system/reviews/identity_lock_comparison_2026-07-31/Shot013_identity_comparison_2026-07-31.jpg`

## Visual Audit

Shot purpose: Byleth pulls the students back from emotion into tactics.

- Start frame: passes as the tactical halt after rebel-camp reconnaissance. The five-character grouping is readable and Ashe remains inside the team.
- Key frame: passes as the decisive action peak. Byleth's hand, mud route line, and stone groups are physical and non-UI.
- End frame: passes as edit handoff. The camera lifts to listening faces and offscreen fog eyelines without showing the first arrow early.
- Character identity: five-character density is high, so still-frame approval relies on local proof/identity boards, wardrobe topology, hair colors, and visible role placement rather than close-up face proof for every character.
- Frame chain: start/key/end are visually distinct and communicate gather, plan, and first-arrow anticipation states.

## Blocking Issues

No still-frame story/action blocker for Shot013 final candidate v1.

## Downstream Risks

- The mud sketch may drift into a tactical grid, glowing map, clean parchment, subtitles, or readable labels.
- Five named academy identities may drift under motion.
- Byleth's line is dialogue-heavy for an 18-second shot and needs timing QA.
- Ashe may be pushed forward alone by the model, breaking the shot purpose.
- The first arrow impact may appear before Shot014.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only the uploaded START, KEY, and END frames, run dialogue-throughput QA for Byleth's line, run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to `approved_for_video` if the physical mud-map, five-character identity locks, Ashe placement, no-UI/no-subtitle presentation, and first-arrow handoff survive the probe.
