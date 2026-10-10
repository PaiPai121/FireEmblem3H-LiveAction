# Shot002 Local-Asset-Locked Regeneration V1 Review

Date: 2026-08-01
Reviewer role: asset-identity-qa-agent
Decision: visual_review_passed
Scope: still-frame visual QA only; not approved_for_video.

## Reviewed Inputs

- Local source title card: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot002/local_video_exact.jpg`
- Local source evidence board: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot002/Shot002_local_video_source_evidence_2026-08-01.jpg`
- Byleth identity plate: `production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg`
- Monastery cloister reference: `assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png`
- Church crest flags reference: `assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png`
- V1 start/key/end frames: `storyboards/Shot002/local_asset_locked_regen_v1_2026-08-01/`
- V1 review sheet: `production_system/reviews/shot002_local_asset_locked_regen_v1_review_2026-08-01.jpg`

## Findings

- Shot002's local source at 00:01:50 is a chapter title card, so the generated frame set is correctly treated as an adaptation-expansion establishing shot rather than a local-source recreation.
- The frame set uses local Byleth identity, monastery cloister architecture, and Church crest/flag references as the visual source of truth.
- Byleth's dark hair, black professor silhouette, cape mass, and restrained posture remain readable across start/key/end.
- The key frame adds distant anonymous Church figures to establish military mobilization without introducing unapproved named characters.
- The frame chain has no subtitles, UI, dialogue boxes, title-card text, or tactical interface.

## Remaining Risks

- Byleth's face is partial or side/back-facing in key/end; this is acceptable for an establishing shot, but motion probes should preserve the silhouette and not invent a new face.
- Distant Church figures must remain anonymous in motion and cannot become named Blue Lions substitutes.
- Continuity into Shot003's cathedral briefing still needs a strict adjacent-shot review after prompt-against-frame QA.

## Required Next Gates

- Run video-prompt QA against the real V1 start/key/end frames.
- Run a short motion probe before full-duration generation.
- Re-check strict continuity with Shot001 and Shot003 before any `approved_for_video` promotion.

## Promotion Boundary

Shot002 V1 may replace the blocked generic candidate as the current still-frame candidate. It may not enter a `video_generation_package` until prompt-against-frame QA, motion review, and adjacent continuity pass.
