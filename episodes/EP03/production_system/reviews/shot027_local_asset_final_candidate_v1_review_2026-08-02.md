# Shot027 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot027_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot027/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot027/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot027/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot027/Shot027_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot027_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot beat: 非致命拦截

Shot purpose: 保持学生不直接处决养父，保留 Catherine/Byleth 承担最后武力。

- Start frame passes as direct continuation of the single warning arrow landing in the muddy lane.
- Key frame passes as the action peak: the ground arrow halts Lonato without wounding him.
- End frame passes as the cut-out state: Lonato remains stopped and untouched while Ashe stays distant.

## Blocking Issues

No still-frame story/action blocker for Shot027 final candidate v1.

## Downstream Risks

- Current executable prompt still needs upload-frame-only rewrite before video submission.
- Arrow count and ground position must stay stable in motion.
- The non-lethal intent can drift into body impact unless strongly constrained.

## Required Revision Before Video Approval

Before approved_for_video, rewrite the executable web prompt to reference only uploaded START KEY END frames, run arrow prop continuity QA from Shot026 into Shot027, run non-graphic action QA, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if the arrow wounds Lonato, duplicate arrows appear, Ashe fires again, extra named characters appear, blood or gore appears, or UI or subtitles appear.
