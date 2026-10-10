# Shot003 Local-Source-Locked Regeneration V3 Review

Date: 2026-08-01
Reviewer role: asset-identity-qa-agent
Decision: visual_review_passed
Scope: still-frame visual QA only; not approved_for_video.

## Reviewed Inputs

- Corrected local source frame: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot003/local_video_exact.jpg`
- Local source evidence board: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot003/Shot003_local_video_source_evidence_2026-08-01.jpg`
- Rhea identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_church_of_seiros_Rhea_academy_selected_identity_plate_2026-08-01.jpg`
- Seteth identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_church_of_seiros_Seteth_academy_selected_identity_plate_2026-08-01.jpg`
- Byleth identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg`
- Dimitri identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg`
- V3 start/key/end frames: `storyboards/Shot003/local_source_locked_regen_v3_2026-08-01/`
- V3 review sheet: `production_system/reviews/shot003_local_source_locked_regen_v3_review_2026-08-01.jpg`

## Findings

- The corrected local video frame at 00:02:30 now matches the intended Rhea/Seteth briefing beat; the earlier 00:01:30 source reference was wrong for this shot.
- The V3 frame chain preserves the local source hierarchy: Rhea centered and elevated, Seteth beside her, Dimitri and Byleth lower in the foreground as listeners.
- Rhea's crown, pale green-white hair, cream robe, blue-violet mantle, and frontal authority read are materially closer to the local identity plate than the earlier V2 candidate.
- Seteth's green hair, dark formal uniform, cape mass, and right-side advisory placement are readable across start/key/end.
- Byleth and Dimitri are back-facing or partial foreground figures; this is acceptable for Shot003 because their narrative role is listener/recipient, not face-performance focus.
- The generated frames remove game UI, subtitles, tactical interface, and dialogue boxes while keeping the local cathedral axis.

## Remaining Risks

- This pass does not validate motion preservation, facial drift during animation, or adjacent continuity into Shot002/Shot004.
- Rhea's fabric finish and Seteth's silhouette should be monitored in video probes to avoid model-side cosplay simplification.
- Byleth and Dimitri are intentionally secondary in this shot; if the edit later requires their face read, this frame set must be revised.

## Required Next Gates

- Run video-prompt QA against the real V3 start/key/end frames.
- Run a short motion probe before full-duration generation.
- Re-check strict continuity with Shot002 and Shot004 before any `approved_for_video` promotion.

## Promotion Boundary

Shot003 V3 may replace the blocked V2 frame set as the current still-frame candidate. It may not enter a `video_generation_package` until prompt-against-frame QA, motion review, and adjacent continuity pass.
