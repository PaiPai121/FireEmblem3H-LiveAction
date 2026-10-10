# Shot012 Critical Re-Audit Regen v1 Review

Date: 2026-08-15

Decision: monitor_required

Reviewed frame set:
- `episodes/EP03/storyboards/Shot012/critical_reaudit_regen_v1_2026-08-15/start_frame.png`
- `episodes/EP03/storyboards/Shot012/critical_reaudit_regen_v1_2026-08-15/key_frame.png`
- `episodes/EP03/storyboards/Shot012/critical_reaudit_regen_v1_2026-08-15/end_frame.png`
- `episodes/EP03/storyboards/Shot012/critical_reaudit_regen_v1_2026-08-15/contact_sheet.jpg`

Reference inputs:
- `episodes/EP03/storyboards/Shot011/critical_reaudit_regen_v1_2026-08-15/end_frame.png`
- `episodes/EP03/production_system/reviews/critical_reaudit_2026-08-15/shot012_local_character_reference_board_2026-08-15.jpg`
- `assets/locations/EP03/act01/WesternChurchRebelCamp/WesternChurchRebelCamp_reference.png`

Prior candidate downgrade:
The previous `integrated_candidate_v2_2026-08-10` had a usable surveillance idea in START/KEY, but the END redesigned female Byleth into a sexualized leather/glamor costume with exposed chest/fishnet-like styling risk. The executable prompt also retained local paths, source-reference dependency, false "Use Japanese speech" text for a silent shot, and unrelated template contamination. This was unsafe under the female-Byleth academy-professor lock.

Rendered visual audit:
The regenerated START frame establishes Byleth and Ashe observing from wet forest cover while the Western Church camp connects to the smoke from Shot011. The KEY frame reveals organized rebel evidence: old faith flags, devotional layout, tired soldiers, campfires, and patrol discipline. The END frame shifts attention back to Byleth and Ashe deciding to pull back for the tactical halt, rather than repeating the same surveillance still.

Prompt QA:
The executable prompt now refers only to uploaded START/KEY/END frames. It treats Shot012 as a silent reconnaissance beat with natural sound only, rejects Chinese/Mandarin voiceover and subtitles, and explicitly forbids sexualized Byleth costume drift. The negative prompt rejects generic bandit camp, loss of faith/organization evidence, and unrelated characters.

Remaining risks:
- The three anchors share a cold fog palette and must not become a static hold in motion.
- END has less visible Seiros soldier detail; video must preserve organized camp evidence in the background.
- Ashe's hair/lightness and Byleth's black outfit must not drift during interpolation.

Required next gate:
Run a 3-second motion probe before any `approved_for_video` promotion. Reject if Byleth becomes male/ambiguous/sexualized, the camp becomes generic bandits, organized faith evidence disappears, subtitles/UI/voiceover appear, or the clip becomes a static surveillance pan.
