# Shot022 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot022_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot022/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot022/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot022/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot022/Shot022_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot022_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot beat: Ashe 上前

Shot purpose: Ashe 主动要求对话，证明他不是被剧情拖着走。

- Start frame passes as Ashe preparing to step out from the line with Byleth and Dimitri providing tactical support.
- Key frame passes as the action peak: Ashe lowers the bow and advances only to a controlled speaking distance.
- End frame passes as the cut-out state: Ashe faces Lonato across the fog while the support line remains behind him.

## Blocking Issues

No still-frame story/action blocker for Shot022 final candidate v1.

## Downstream Risks

- Current executable prompt still needs upload-frame-only rewrite before video submission.
- Ashe may drift into isolated unsafe staging or accidental attack posture.
- The 18-second dialogue beat needs timing/tail-hold QA and a 3-second motion probe.

## Required Revision Before Video Approval

Before approved_for_video, rewrite the executable web prompt to reference only uploaded START/KEY/END frames, run tactical-distance and dialogue timing/tail-hold QA for Ashe line, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if Ashe becomes isolated beyond tactical logic, fires or raises bow, Lonato turns generic villain, Byleth/Dimitri vanish, or UI/subtitles appear.
