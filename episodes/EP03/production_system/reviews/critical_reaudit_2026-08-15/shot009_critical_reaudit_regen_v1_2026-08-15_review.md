# Shot009 Critical Re-Audit Regen v1 Review

Date: 2026-08-15

Decision: monitor_required

Reviewed frame set:
- `episodes/EP03/storyboards/Shot009/critical_reaudit_regen_v1_2026-08-15/start_frame.png`
- `episodes/EP03/storyboards/Shot009/critical_reaudit_regen_v1_2026-08-15/key_frame.png`
- `episodes/EP03/storyboards/Shot009/critical_reaudit_regen_v1_2026-08-15/end_frame.png`
- `episodes/EP03/storyboards/Shot009/critical_reaudit_regen_v1_2026-08-15/contact_sheet.jpg`

Reference inputs:
- `assets/characters/protagonist/BylethFemale/professor/selected.png`
- `assets/characters/blue_lions/Dimitri/academy/selected.png`
- `assets/characters/blue_lions/Ashe/academy/selected.png`
- `assets/characters/church_of_seiros/Catherine/academy/selected.png`
- `assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png`

Prior candidate downgrade:
The previous `local_asset_final_candidate_v1` Shot009 START/KEY/END relied on male or ambiguous black-cloak Byleth back silhouettes and did not keep Catherine consistently readable. That violated the inherited female-Byleth-only constraint and made the web candidate unsafe for video handoff.

Rendered visual audit:
The regenerated START frame establishes the rainy monastery gate and keeps female Byleth visibly female in black academy professor attire. The KEY frame advances the blocking into a real walking beat with Catherine, Dimitri, female Byleth, and Ashe leaving the monastery. The END frame is compositionally distinct from START/KEY and moves the party into the fog road; female Byleth is more distant but remains female-coded by dark teal hair, body line, and position within the same four-person party.

Prompt QA:
The executable prompt has been rewritten so it refers only to uploaded START/KEY/END frames. It contains no local paths, no source-reference dependency, no Chinese/Mandarin voiceover, and no false instruction to speak Japanese in a silent shot. The negative prompt rejects male Byleth, gender drift, subtitles/UI, duplicated anchors, Lonato contamination, and battle-action contamination.

Remaining risks:
- END-frame Byleth is distant and must be watched in the 3-second motion probe.
- Fog could swallow identity too early if the video model over-interpolates.
- Catherine/Dimitri/Ashe could swap order or costume details during motion.

Required next gate:
Run a 3-second motion probe before any `approved_for_video` promotion. Reject if Byleth becomes male/ambiguous, if the departure becomes battle action, if the frames freeze into a still pan, or if subtitles/UI/voiceover appear.
