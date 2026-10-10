# Shot021 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot021_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot021/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot021/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot021/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot021/Shot021_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot021_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot beat: Lonato 现身

Shot purpose: 把敌方核心从叛军抽象化为 Ashe 的父亲替身。

- Start frame passes as a clean Lonato ridge reveal with only Ashe and Dimitri as named foreground witnesses.
- Key frame passes as the action peak: Lonato is fully readable as a principled older knight beside a torn banner, not a monster or bandit.
- End frame passes as the cut-out state: Ashe steps forward while Dimitri watches, setting up the next shot.

## Blocking Issues

No still-frame story/action blocker for Shot021 final candidate v1.

## Downstream Risks

- Current executable prompt still needs upload-frame-only rewrite before video submission.
- Lonato may drift into generic villain or elderly warlord performance.
- Ashe/Dimitri foreground continuity and Lonato dialogue timing require a 3-second motion probe.

## Required Revision Before Video Approval

Before approved_for_video, rewrite the executable web prompt to reference only uploaded START/KEY/END frames, run Lonato identity and dignity QA, run dialogue timing/tail-hold QA for his line, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if Lonato becomes a generic evil warlord, Catherine or Byleth appear, Ashe/Dimitri vanish, or UI/subtitles appear.
