# Shot010 Critical Re-Audit Regen v1 Review

Date: 2026-08-15

Decision: monitor_required

Reviewed frame set:
- `episodes/EP03/storyboards/Shot010/critical_reaudit_regen_v1_2026-08-15/start_frame.png`
- `episodes/EP03/storyboards/Shot010/critical_reaudit_regen_v1_2026-08-15/key_frame.png`
- `episodes/EP03/storyboards/Shot010/critical_reaudit_regen_v1_2026-08-15/end_frame.png`
- `episodes/EP03/storyboards/Shot010/critical_reaudit_regen_v1_2026-08-15/contact_sheet.jpg`

Reference inputs:
- `episodes/EP03/storyboards/Shot009/critical_reaudit_regen_v1_2026-08-15/end_frame.png`
- `episodes/EP03/production_system/reviews/critical_reaudit_2026-08-15/shot010_local_character_reference_board_2026-08-15.jpg`
- `assets/locations/EP03/act01/MagdredWayFogRoad/MagdredWayFogRoad_reference.png`

Prior candidate downgrade:
The previous `local_asset_final_candidate_v1` Shot010 START/KEY/END reduced the party to anonymous back silhouettes. Byleth read as male or ambiguous in the black-cloak position, and Dedue read as a generic soldier rather than the local selected identity. That failed the inherited female-Byleth-only lock and the named-party readability requirement.

Rendered visual audit:
The regenerated START frame makes female Byleth, Dimitri, Dedue, and Ingrid readable at the Magdred fog-road entrance. The KEY frame advances the party into a two-column fog-road walk while preserving female Byleth as a visible academy-era female professor. The END frame adds a foreground village sign for the cut-out while keeping all four named characters present and more readable than the prior anonymous-silhouette version.

Prompt QA:
The executable prompt now refers only to the uploaded START/KEY/END frames. It keeps the two Japanese lines for Ingrid and Dedue, rejects Chinese/Mandarin voiceover and subtitles, and removes unrelated Rhea, Catherine, Lonato, Ashe-execution, and source-path/template contamination.

Remaining risks:
- Dedue's hair is shorter/lighter than ideal and must not drift into a generic bald soldier in motion.
- Ingrid's END wardrobe edges toward light armor and must not become war-phase armor.
- Fog could still swallow identity if the video model over-interpolates.

Required next gate:
Run a 3-second motion probe before any `approved_for_video` promotion. Reject if Byleth becomes male/ambiguous, Dedue becomes generic, Ingrid becomes fully armored or war-phase, the two Japanese lines are mistranslated or replaced, or subtitles/UI appear.
