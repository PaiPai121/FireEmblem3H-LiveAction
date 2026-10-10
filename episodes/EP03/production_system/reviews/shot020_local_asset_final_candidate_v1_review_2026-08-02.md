# Shot020 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot020_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot020/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot020/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot020/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot020/Shot020_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot020_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot beat: Catherine 破雾

Shot purpose: 表现 Catherine 是教会王牌，也制造学生对力量的震动。

- Start frame passes as Catherine flank entry after support-line fog control, with Byleth and Ashe reading as shaken observers.
- Key frame passes as the action peak: thunder lights the fog and reveals scattered shields without visible gore or kills.
- End frame passes as controlled aftermath and sets up the cut to a distant Lonato silhouette.

## Blocking Issues

No still-frame story/action blocker for Shot020 final candidate v1.

## Downstream Risks

- Current executable prompt still needs upload-frame-only rewrite before video submission.
- Lightning scale can drift into superhero spectacle or implied slaughter.
- Hero relic shape, Catherine armor, and observer continuity require a 3-second motion probe.

## Required Revision Before Video Approval

Before approved_for_video, rewrite the executable web prompt to reference only uploaded START/KEY/END frames, run thunder scale and non-graphic action QA, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if Catherine becomes a superhero pose, the lightning becomes gore or slaughter, Byleth or Ashe vanish, the relic changes shape, or UI/subtitles appear.
