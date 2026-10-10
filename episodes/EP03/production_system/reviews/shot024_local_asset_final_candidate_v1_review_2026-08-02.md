# Shot024 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot024_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot024/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot024/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot024/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot024/Shot024_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot024_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot beat: Byleth 下令包围

Shot purpose: Byleth 选择保护学生与平民，接受必须结束战斗。

- Start frame passes as the command-group setup after Lonato refusal.
- Key frame passes as the action peak: Byleth gives a precise directional order while students begin to respond.
- End frame passes as the handoff to the two-wing movement, with tactical lanes visible.

## Blocking Issues

No still-frame story/action blocker for Shot024 final candidate v1.

## Downstream Risks

- Current executable prompt still needs upload-frame-only rewrite before video submission.
- Four-character group motion may drift faces, uniforms, or relative positions.
- The two-wing move needs screen-direction lock before animation.

## Required Revision Before Video Approval

Before approved_for_video, rewrite the executable web prompt to reference only uploaded START/KEY/END frames, run four-character identity QA, run command gesture and screen-direction QA, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if Byleth becomes aggressive or generic, students merge into extras, Ashe/Lonato/Catherine appear, the two-wing move is unclear, or UI/subtitles appear.
