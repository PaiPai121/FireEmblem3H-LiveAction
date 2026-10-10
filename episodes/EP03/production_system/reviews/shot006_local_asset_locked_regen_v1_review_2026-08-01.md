# Shot006 Local-Asset-Locked Regeneration V1 Review

Date: 2026-08-01
Reviewer role: asset-identity-qa-agent
Decision: visual_review_passed
Scope: still-frame visual QA only; not approved_for_video.

## Reviewed Inputs

- Local source old-debt dialogue frame: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot006/local_video_exact.jpg`
- Local source evidence board: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot006/Shot006_local_video_source_evidence_2026-08-01.jpg`
- Ashe identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg`
- Byleth identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg`
- Dimitri identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg`
- Shot005 continuity end frame: `storyboards/Shot005/local_asset_locked_regen_v1_2026-08-01/end_frame_local_asset_locked_regen_v1_2026-08-01.png`
- V1 start/key/end frames: `storyboards/Shot006/local_asset_locked_regen_v1_2026-08-01/`
- V1 review sheet: `production_system/reviews/shot006_local_asset_locked_regen_v1_review_2026-08-01.jpg`

## Findings

- Shot006's local source frame is field dialogue, so the frame set is correctly treated as an adaptation-expansion classroom side close-up rather than a local-source recreation.
- The frame chain preserves continuity from Shot005: same indoor classroom mood, Byleth/Dimitri as quiet listeners, and Ashe carrying the emotional focus.
- Ashe remains academy-age, in a Blue Lions student uniform topology, and reads as the same student from Shot005.
- The key frame clearly captures the decisive visible beat: Ashe speaks about Lonato's old kindness while holding grief and resolve in check.
- The frames contain no subtitles, UI, dialogue boxes, tactical interface, outdoor battlefield reset, or extra named characters.

## Remaining Risks

- Ashe's hair reads darker in the window-lit close-up than the selected identity plate; video probes must preserve sandy blond rather than drifting brown or gray.
- Byleth is mostly back/side-facing; this is acceptable for Shot006's listener role, but motion should not turn the figure into an unverified new face.
- The close-up should not become melodramatic in motion; tears, shouting, or heroic grin would break the beat.

## Required Next Gates

- Run video-prompt QA against the real V1 start/key/end frames.
- Run a short motion probe before full-duration generation.
- Re-check strict continuity with Shot005 and Shot007 before any `approved_for_video` promotion.

## Promotion Boundary

Shot006 V1 may replace the blocked generic candidate as the current still-frame candidate. It may not enter a `video_generation_package` until prompt-against-frame QA, motion review, and adjacent continuity pass.
