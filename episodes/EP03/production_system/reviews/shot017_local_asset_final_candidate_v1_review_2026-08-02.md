# Shot017 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot017_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot017/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot017/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot017/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Continuity input: `storyboards/Shot016/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot017/Shot017_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot017_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot purpose: push the battle pressure back onto Ashe's choice by making him recognize the Gaspard connection.

- Start frame: passes as a close bow-hand/eye setup. Ashe is aiming, but the shield crest has entered his attention.
- Key frame: passes as the recognition peak. The bowstring and Ashe's expression soften while the weathered crest becomes the visual cause of hesitation.
- End frame: passes as the cut-out state. Ashe's bow is lowered/slackened and Byleth is present as witness, allowing the next cut to Felix covering him.
- Character identity: Ashe and Byleth are traceable to local academy/professor identity plates, though Ashe facial consistency remains a motion-risk watch item.
- Frame chain: start/key/end are visually distinct and communicate draw, recognition, and hesitation states.

## Blocking Issues

No still-frame story/action blocker for Shot017 final candidate v1.

## Downstream Risks

- Current executable prompt contains unrelated Rhea/Catherine/Lonato locks and must be rewritten before video submission.
- The shield crest may drift into readable text, a Church of Seiros emblem, or a Blue Lions mark.
- Ashe may either fire the arrow or freeze helplessly for the full duration.
- 16 seconds is long for one recognition line unless the prompt controls eye/hand timing and the tail hold.
- Byleth may disappear or become the focus during motion.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only uploaded START, KEY, and END frames, remove unrelated continuity locks, run crest readability QA, run dialogue-throughput/tail-hold QA for "那是...Gaspard 的徽记", run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to `approved_for_video` if Ashe identity, bow state, crest non-text readability, Byleth witness continuity, and no-UI/no-subtitle presentation survive the probe.
