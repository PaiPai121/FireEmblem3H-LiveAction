# Shot025 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot025_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot025/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot025/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot025/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot025/Shot025_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot025_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot beat: 青狮两翼推进

Shot purpose: 展示学生在 EP2 模拟战后学会真实协同。

- Start frame passes as a six-student coordinated movement setup rather than a static lineup.
- Key frame passes as the action peak: the formation opens into two wings across the ridge.
- End frame passes as the tactical cut-out state into Ashe aim, with separated lanes visible.

## Blocking Issues

No still-frame story/action blocker for Shot025 final candidate v1.

## Downstream Risks

- Current executable prompt still needs upload-frame-only rewrite before video submission.
- Wide/back-facing group motion may reduce individual identity preservation.
- The two-wing formation requires screen-direction lock and a short motion probe.

## Required Revision Before Video Approval

Before approved_for_video, rewrite the executable web prompt to reference only uploaded START/KEY/END frames, run six-character identity QA with special attention to distant/back-facing frames, run formation/screen-direction QA, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if named students merge into generic extras, Byleth/Ashe/Lonato/Catherine appear, the two-wing formation collapses, magic/gore appears, or UI/subtitles appear.
