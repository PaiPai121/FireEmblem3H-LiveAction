# Shot035 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot035_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot035/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot035/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot035/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot035/Shot035_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot035_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot beat: Dimitri 夜谈

Shot purpose: 让本章创伤落到青狮主线：正义与杀戮无法分开。

- Start frame passes as the cut from Catherine daytime certainty into Dimitri and Byleth night corridor silence.
- Key frame passes as the action peak: Dimitri speaks the moral line while Byleth stays in listener position.
- End frame passes as the cut-out state to Byleth alone, with Dimitri turning away and the corridor emptied.

## Blocking Issues

No still-frame story/action blocker for Shot035 final candidate v1.

## Downstream Risks

- Current executable prompt still needs upload-frame-only rewrite before video submission.
- The 18-second dialogue line needs throughput and cut-timing QA.
- Night lighting may hide identity or drift Dimitri toward war-phase intensity in motion.

## Required Revision Before Video Approval

Before approved_for_video, rewrite the executable web prompt to reference only uploaded START KEY END frames, run Dimitri Byleth identity QA, run night-cloister continuity QA, run dialogue timing and tail-hold QA for the 18-second line, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if UI or subtitles appear, Dimitri becomes war-phase or feral, Byleth costume drifts, extra characters enter, a weapon is drawn, or the night lighting turns into daytime.
