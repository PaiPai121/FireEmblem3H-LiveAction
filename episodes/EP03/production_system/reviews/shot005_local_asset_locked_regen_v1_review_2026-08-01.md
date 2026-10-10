# Shot005 Local-Asset-Locked Regeneration V1 Review

Date: 2026-08-01
Reviewer role: asset-identity-qa-agent
Decision: visual_review_passed
Scope: still-frame visual QA only; not approved_for_video.

## Reviewed Inputs

- Local source field dialogue frame: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot005/local_video_exact.jpg`
- Local source evidence board: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot005/Shot005_local_video_source_evidence_2026-08-01.jpg`
- Ashe identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg`
- Dimitri identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg`
- Byleth identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg`
- Classroom reference: `assets/locations/EP02/act01/OfficersAcademyClassroom/OfficersAcademyClassroom_reference.png`
- V1 start/key/end frames: `storyboards/Shot005/local_asset_locked_regen_v1_2026-08-01/`
- V1 review sheet: `production_system/reviews/shot005_local_asset_locked_regen_v1_review_2026-08-01.jpg`

## Findings

- Shot005's local source frame is field dialogue, so the frame set is correctly treated as an adaptation-expansion classroom aftermath rather than a local-source recreation.
- The generated frames preserve the intended classroom silence: Ashe remains seated and withdrawn while Dimitri requests permission from Byleth.
- Ashe, Dimitri, and Byleth remain traceable to their local academy identity plates and do not shift into war-phase designs or armor.
- The start/key/end chain has a readable action progression: pre-action silence, Dimitri's request gesture, then Ashe beginning to lift his head for the next cut.
- The frame chain has no subtitles, UI, dialogue boxes, tactical interface, or extra named characters.

## Remaining Risks

- Ashe's hair can read slightly gray in the low classroom light; motion probes must preserve the sandy blond academy read.
- Byleth is back/side-facing, acceptable for the professor-observer role, but motion should not invent a new face if the camera turns.
- The source-to-classroom adaptation must remain documented in prompts so downstream generation does not drift back to an outdoor field.

## Required Next Gates

- Run video-prompt QA against the real V1 start/key/end frames.
- Run a short motion probe before full-duration generation.
- Re-check strict continuity with Shot004 and Shot006 before any `approved_for_video` promotion.

## Promotion Boundary

Shot005 V1 may replace the blocked generic candidate as the current still-frame candidate. It may not enter a `video_generation_package` until prompt-against-frame QA, motion review, and adjacent continuity pass.
