# Shot011 Critical Re-Audit Regen v1 Review

Date: 2026-08-15

Decision: monitor_required

Reviewed frame set:
- `episodes/EP03/storyboards/Shot011/critical_reaudit_regen_v1_2026-08-15/start_frame.png`
- `episodes/EP03/storyboards/Shot011/critical_reaudit_regen_v1_2026-08-15/key_frame.png`
- `episodes/EP03/storyboards/Shot011/critical_reaudit_regen_v1_2026-08-15/end_frame.png`
- `episodes/EP03/storyboards/Shot011/critical_reaudit_regen_v1_2026-08-15/contact_sheet.jpg`

Reference inputs:
- `episodes/EP03/storyboards/Shot010/critical_reaudit_regen_v1_2026-08-15/end_frame.png`
- `episodes/EP03/production_system/reviews/critical_reaudit_2026-08-15/shot011_local_character_reference_board_2026-08-15.jpg`
- `assets/locations/EP03/act01/FaerghusBorderVillage/FaerghusBorderVillage_reference.png`

Prior candidate downgrade:
The previous `local_asset_final_candidate_v1` Shot011 START/KEY/END staged Byleth mostly as a black-cloak back view that could read as male or ambiguous. The KEY and END repeated similar door-facing blocking, and the frame set carried unrelated prompt contamination from other shots. That failed the inherited female-Byleth-only lock and the start/key/end progression gate.

Rendered visual audit:
The regenerated START frame introduces the border village lane with female Byleth clearly readable in three-quarter view, Ashe beside her, and Mercedes visible as the third named character. The KEY frame makes the door-bar action legible while the party keeps distance. The END frame moves the eyeline and edit handoff toward distant rebel-camp smoke, making it distinct from START and KEY.

Prompt QA:
The executable prompt now refers only to uploaded START/KEY/END frames. It correctly treats Shot011 as a silent shot with natural sound only, removes the false "Use Japanese speech" line, rejects Chinese/Mandarin voiceover and subtitles, and removes unrelated Rhea, Catherine, Lonato, Ashe-execution, and source-path/template contamination.

Remaining risks:
- Ashe's hair trends lighter than the selected asset and should be monitored during motion.
- Mercedes trends toward light armor/ceremonial cloak in KEY/END and must not drift into war-phase armor or nun imagery.
- The villager must remain a small fearful door/window presence, not a crowd or spectacle.

Required next gate:
Run a 3-second motion probe before any `approved_for_video` promotion. Reject if Byleth becomes male/ambiguous, Mercedes becomes armored/ceremonial, Ashe identity drifts further, villagers become spectacle, or subtitles/UI/voiceover appear.
