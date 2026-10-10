# Shot005 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot005_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot005/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot005/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot005/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot005/Shot005_local_video_source_evidence_2026-08-01.jpg`
- Identity plates: Ashe, Dimitri, Byleth under `production_system/reviews/local_identity_plates_2026-08-01/`

## Visual Audit

Shot purpose: let the Blue Lions understand that the mission is not ordinary bandit training.

- Start frame: passes as a quiet pre-action state. The empty desks and classroom space make the post-class silence readable; Byleth, Dimitri, and Ashe are all present with the expected hierarchy.
- Key frame: passes as action peak. Dimitri's open-hand request posture faces Byleth, while Ashe remains contained in the background/right of frame.
- End frame: passes as edit handoff. Dimitri settles after the ask, and Ashe becomes the outgoing visual focus for the next cut.
- Character identity: Ashe is closer to the local plate than the rejected locked-regeneration attempt and retains youthful silver-blond hair and academy-uniform topology. Dimitri and Byleth are readable against their local plates.
- Frame chain: start/key/end are visibly distinct and communicate beginning, peak, and cut-out state.

## Blocking Issues

No still-frame story/action blocker for Shot005 final candidate v1.

## Downstream Risks

- Ashe may age up, become a generic blond soldier, or shift into an attack pose in video.
- Dimitri's blue cape and academy uniform may become war armor.
- Byleth's face/hair can drift if the camera moves too much.
- The bow may become too prominent and turn the quiet classroom beat into combat preparation.

## Required Revision Before Video Approval

Run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to `approved_for_video` if Ashe identity/age/uniform, Dimitri's restrained request, Byleth's secondary professor stillness, no-UI presentation, and the handoff to Ashe survive the probe.
