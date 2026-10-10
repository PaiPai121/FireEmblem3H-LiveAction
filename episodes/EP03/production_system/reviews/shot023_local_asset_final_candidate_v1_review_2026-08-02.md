# Shot023 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot023_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot023/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot023/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot023/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot023/Shot023_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot023_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot beat: Lonato 拒绝

Shot purpose: 让 Lonato 的叛乱有道德痛点，但不能推翻本章教会权力事实。

- Start frame passes as the continuation of Ashe plea with Lonato taking narrative focus.
- Key frame passes as the refusal action peak: Lonato speaks with restrained grief, not combat aggression.
- End frame passes as the cut-out state into Byleth command, with Ashe hurt and the tactical distance intact.

## Blocking Issues

No still-frame story/action blocker for Shot023 final candidate v1.

## Downstream Risks

- Current executable prompt still needs upload-frame-only rewrite before video submission.
- The 18-second dialogue beat needs timing/tail-hold QA to avoid dead air.
- Lonato identity and armor/banner details may drift under motion.

## Required Revision Before Video Approval

Before approved_for_video, rewrite the executable web prompt to reference only uploaded START/KEY/END frames, run Lonato dignity/identity QA, run dialogue throughput and tail-hold QA for the 18-second refusal line, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if Lonato becomes a generic evil warlord, Ashe attacks or raises bow, additional named characters appear, the banner/armor mutates, or UI/subtitles appear.
