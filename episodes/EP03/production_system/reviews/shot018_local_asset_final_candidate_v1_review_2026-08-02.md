# Shot018 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot018_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot018/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot018/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot018/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Continuity input: `storyboards/Shot017/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot018/Shot018_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot018_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot purpose: establish teammate relationship through Felix's action rather than comfort dialogue.

- Start frame: passes as the handoff from Ashe's hesitation, with Felix's sword and body entering the protective lane.
- Key frame: passes as the action peak. Felix shields Ashe with a readable non-graphic parry, and Ashe remains behind him as the protected teammate.
- End frame: passes as the cut-out state. Felix holds the line without turning back, while Ashe has refocused enough to stay in the fight.
- Character identity: Felix and Ashe are traceable to local academy identity plates, with Felix severity readable but not villainous.
- Frame chain: start/key/end are visually distinct and communicate entry, cover/parry, and guarded reset states.

## Blocking Issues

No still-frame story/action blocker for Shot018 final candidate v1.

## Downstream Risks

- Current executable prompt contains unrelated Rhea/Catherine/Lonato locks and must be rewritten before video submission.
- Felix may drift into cruelty or triumphant aggression.
- The parry may become a visible wound, kill, or gore if the motion prompt is not constrained.
- Ashe may disappear or stay helpless rather than recover.
- 12 seconds needs controlled timing so Felix's line lands near the cut without dead tail.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only uploaded START, KEY, and END frames, remove unrelated continuity locks, run dialogue-throughput/tail-hold QA for "发呆等于叫别人替你受伤", run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to `approved_for_video` if Felix identity, Ashe recovery, non-graphic parry, restrained performance, and no-UI/no-subtitle presentation survive the probe.
