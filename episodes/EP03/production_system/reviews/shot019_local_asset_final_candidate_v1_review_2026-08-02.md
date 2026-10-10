# Shot019 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot019_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot019/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot019/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot019/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Continuity input: `storyboards/Shot018/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot019/Shot019_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot019_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot purpose: show the rear line actively managing retreat and visibility control.

- Start frame: passes as support-line setup. Mercedes directs an exhausted ally, Annette prepares a controlled wind action, and Ingrid guards the perimeter.
- Key frame: passes as the action peak. Annette opens a narrow fog lane while Mercedes guides evacuation and Ingrid maintains watch.
- End frame: passes as the cut-out state. The safe path remains readable and all three support roles stay distinct.
- Character identity: Mercedes, Annette, and Ingrid are traceable to local academy identity plates, though multi-character motion needs monitoring for face and costume swaps.
- Frame chain: start/key/end are visually distinct and communicate setup, fog-clearing action, and safe-lane handoff states.

## Blocking Issues

No still-frame story/action blocker for Shot019 final candidate v1.

## Downstream Risks

- Current executable prompt contains unrelated Rhea/Catherine/Lonato locks and must be rewritten before video submission.
- Multi-character animation may swap faces, hair, or costumes between Mercedes, Annette, and Ingrid.
- Annette's fog control may become an oversized magic spectacle.
- The exhausted ally may become a gore/wound focus if unconstrained.
- 12 seconds needs dialogue timing so Mercedes and Annette lines land without subtitles or tail padding.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only uploaded START, KEY, and END frames, remove unrelated continuity locks, run dialogue-throughput/tail-hold QA for "这边 / 我看见路了", run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to `approved_for_video` if identity separation, restrained fog movement, evacuation staging, and no-UI/no-subtitle presentation survive the probe.
