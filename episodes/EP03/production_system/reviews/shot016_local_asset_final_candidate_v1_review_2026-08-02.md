# Shot016 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot016_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot016/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot016/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot016/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Continuity input: `storyboards/Shot015/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot016/Shot016_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot016_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot purpose: show Dimitri's dangerous force while proving he still obeys Byleth.

- Start frame: passes as the line-hold pre-action state after Shot015 rebel pressure. Dimitri, Byleth, and Dedue are all visually readable from local identity references.
- Key frame: passes as the action peak. Dimitri drives a shielded rebel back with force, but the impact remains non-graphic and Byleth's raised hand is readable as the command to stop.
- End frame: passes as the cut-out state. Dimitri stops at the line with his lance lowered, Byleth's stop command remains visible, Dedue holds position, and the frame can cut to Ashe noticing a sigil.
- Character identity: Dimitri, Byleth, and Dedue preserve academy-era silhouettes and wardrobe topology closely enough for still-frame promotion.
- Frame chain: start/key/end are visually distinct and communicate pre-action, controlled pushback, and restrained stop states.

## Blocking Issues

No still-frame story/action blocker for Shot016 final candidate v1.

## Downstream Risks

- Current executable prompt contains unrelated Rhea/Catherine/Lonato locks and must be rewritten before video submission.
- Dimitri may drift into explicit bloodlust, lethal impalement, or triumphal violence.
- Weapon motion may generate gore, piercing, or a changed spear/lance.
- Byleth's command gesture may disappear during animation.
- 15 seconds may be too long for the short two-line exchange unless timing and tail hold are revised.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only uploaded START, KEY, and END frames, remove unrelated continuity locks, run dialogue-throughput/tail-hold QA for "守线 / 明白", run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to `approved_for_video` if identity, wardrobe, non-graphic action, Byleth command visibility, and no-UI/no-subtitle presentation survive the probe.
