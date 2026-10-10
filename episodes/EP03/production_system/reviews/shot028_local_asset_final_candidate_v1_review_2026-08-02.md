# Shot028 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot028_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot028/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot028/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot028/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot028/Shot028_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot028_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot beat: 最后压制

Shot purpose: 结束战斗，同时把学生从处决中心移开。

- Start frame passes as Catherine and Byleth taking over the force burden from the students.
- Key frame passes as the action peak: controlled disarm and containment, not graphic killing.
- End frame passes as the cut-out state toward Lonato collapse, with dropped metal and no visible wound.

## Blocking Issues

No still-frame story/action blocker for Shot028 final candidate v1.

## Downstream Risks

- Current executable prompt still needs upload-frame-only rewrite before video submission.
- Weapon contact can drift into body impact unless constrained.
- Catherine armor and relic-sword shape need motion monitoring.

## Required Revision Before Video Approval

Before approved_for_video, rewrite the executable web prompt to reference only uploaded START KEY END frames, run Catherine Byleth Lonato identity QA, run weapon and non-graphic suppression QA, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if students appear in the force center, Catherine performs a blood strike, Lonato is visibly wounded, weapon geometry mutates, or UI or subtitles appear.
