# Shot004 Local-Source-Locked Regeneration V3 Review

Date: 2026-08-01
Reviewer role: asset-identity-qa-agent
Decision: visual_review_passed
Scope: still-frame visual QA only; not approved_for_video.

## Reviewed Inputs

- Corrected local source frame: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot004/local_video_exact.jpg`
- Local source evidence board: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot004/Shot004_local_video_source_evidence_2026-08-01.jpg`
- Ashe identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg`
- Byleth identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg`
- Dimitri identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg`
- V3 start/key/end frames: `storyboards/Shot004/local_source_locked_regen_v3_2026-08-01/`
- V3 review sheet: `production_system/reviews/shot004_local_source_locked_regen_v3_review_2026-08-01.jpg`

## Findings

- The corrected local video frame at 00:03:40 anchors the Rhea/Seteth briefing beat where Ashe's personal connection to Lonato is introduced.
- The V3 frame chain keeps Ashe as the principal emotional subject while preserving Byleth and Dimitri as secondary listeners.
- Ashe's age, sandy blond hair, slim student build, and Blue Lions academy uniform topology are materially closer to the local identity plate than the rejected V2 set.
- The start/key/end chain reads as a restrained internal reaction: pre-reaction, hand tightening as the name lands, and a contained end-frame for the cut out.
- The frames contain no game UI, subtitles, dialogue boxes, or tactical interface.

## Remaining Risks

- Ashe's live-action uniform is still a realistic translation of the local costume rather than a one-to-one fabric copy; monitor model-side simplification in motion.
- Byleth and Dimitri are background-readable; if later edits need their close face read, additional identity proof is required.
- Shot003-to-Shot004 continuity still needs an adjacent-shot review after prompt-against-frame QA.

## Required Next Gates

- Run video-prompt QA against the real V3 start/key/end frames.
- Run a short motion probe before full-duration generation.
- Re-check strict continuity with Shot003 and Shot005 before any `approved_for_video` promotion.

## Promotion Boundary

Shot004 V3 may replace rejected V1/V2 candidates as the current still-frame candidate. It may not enter a `video_generation_package` until prompt-against-frame QA, motion review, and adjacent continuity pass.
