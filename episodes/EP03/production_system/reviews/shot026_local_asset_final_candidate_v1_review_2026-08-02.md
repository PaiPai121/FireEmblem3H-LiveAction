# Shot026 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot026_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot026/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot026/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot026/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot026/Shot026_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot026_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot beat: Ashe 重新拉弓

Shot purpose: Ashe 做出痛苦但必要的选择：阻止 Lonato。

- Start frame passes as Ashe isolated with bow lowered after the formation creates a lane.
- Key frame passes as the action peak: Ashe draws the bow with visible grief and restraint.
- End frame passes as the cut-out state toward Shot027: a single warning arrow lands in the ground while Lonato remains untouched.

## Blocking Issues

No still-frame story/action blocker for Shot026 final candidate v1.

## Downstream Risks

- Current executable prompt still needs upload-frame-only rewrite before video submission.
- Arrow continuity into Shot027 requires strict prop and path matching.
- Ashe facial identity and bow mechanics require a short motion probe.

## Required Revision Before Video Approval

Before approved_for_video, rewrite the executable web prompt to reference only uploaded START KEY END frames, run Ashe face and bow-state QA, run arrow continuity QA into Shot027, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if the arrow hits a body, duplicate arrows appear, Ashe becomes aggressive or heroic, Lonato is wounded, extra named characters appear, or UI or subtitles appear.
