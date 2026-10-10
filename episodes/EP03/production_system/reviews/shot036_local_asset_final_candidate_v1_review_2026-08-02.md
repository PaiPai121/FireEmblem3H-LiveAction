# Shot036 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot036_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot036/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot036/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot036/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot036/Shot036_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot036_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot beat: 章末圣墓阴影

Shot purpose: 收束并抛出下章：教会让学生看见制裁，也准备让他们看见更深秘密。

- Start frame passes as Byleth alone at the cathedral threshold with Rhea distant and Sothis only hinted.
- Key frame passes as the action peak: Sothis appears as a restrained green spectral question beside Byleth.
- End frame passes as the cut-to-black state, with Sothis fading and Rhea almost swallowed by cathedral depth.

## Blocking Issues

No still-frame story/action blocker for Shot036 final candidate v1.

## Downstream Risks

- Current executable prompt still needs upload-frame-only rewrite before video submission.
- Sothis spectral presence can drift into a solid extra character in motion.
- Dark end frame needs no-black-frame and visible-identity QA before video.

## Required Revision Before Video Approval

Before approved_for_video, rewrite the executable web prompt to reference only uploaded START KEY END frames, run Byleth Sothis Rhea identity QA, run spectral-Sothis non-solid-presence QA, run distant-Rhea and cathedral-depth continuity QA, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if UI or subtitles appear, Sothis becomes a solid extra person, Rhea moves into close-up, Byleth costume drifts, the Sword of Creator is drawn, or the green VFX becomes an overbright magic blast.
