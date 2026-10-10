# Shot019 Critical Re-Audit Review

Review date: 2026-08-20  
Reviewer role: visual QA / continuity reviewer  
Artifact: `Shot019_critical_reaudit_regen_v1_2026-08-20`  
Status: `monitor_required`

## Blocking Issues Found In Prior Candidate

The prior `local_asset_final_candidate_v1_2026-08-02` is downgraded to `blocked_needs_revision`. Its executable prompt carried unrelated Byleth, Rhea, Catherine, and Lonato continuity locks. In the rendered frames, the dark central figure was not a declared Shot019 character and could read as a male or ambiguous Byleth. That violated the current identity policy and made the frame chain unsafe to promote.

## Local Reference Pack Used

- `assets/characters/blue_lions/Mercedes/academy/selected.png`
- `assets/characters/blue_lions/Annette/academy/selected.png`
- `assets/characters/blue_lions/Ingrid/academy/selected.png`
- `assets/locations/EP03/act01/MagdredWayFogRoad/MagdredWayFogRoad_reference.png`
- `source_refs/Shot019_source.png` for canon/layout evidence only
- `shot019_local_character_reference_board_2026-08-20.jpg`

## Current Frame Review

- START: Mercedes guides two indistinct wounded civilians uphill-left; Annette is ready behind the lane; Ingrid guards the right wall with her lance low. The three named students share one wet fog-road environment and no Byleth appears.
- KEY: Annette's controlled wind pressure parts a narrow lane; leaves and fog show the action peak without a beam or combat spectacle. Mercedes confirms the retreat route and Ingrid keeps the rear covered.
- END: the lane settles and the civilians recede into the upper-left distance. Mercedes signals back, Annette lowers her hands, and Ingrid checks the rear, leaving a clean directional handoff to Catherine's next shot without inserting Catherine here.

## Gate Checks

- Female Byleth only: `pass_in_still_frames_not_present_in_this_shot`
- Old male Byleth path: `not_used`
- Named-character presence: `pass_in_still_frames_monitor_in_motion`
- Academy wardrobe and age: `pass_in_still_frames_monitor_in_motion`
- START/KEY/END distinct: `pass`
- Integrated live-action staging: `pass_in_still_frames`
- Web executable prompt contract: `rewritten_no_local_paths_or_unuploaded_references`
- Japanese dialogue only: `pass`
- No burned subtitles/UI: `required_in_prompt_and_negative`

## Remaining Risks And Required Next Gate

Run a 3-second motion probe before any `approved_for_video` promotion. Reject if Byleth, professor, Catherine, Rhea, Lonato, Felix, or another named character appears; if a student face, age, gender presentation, or academy uniform drifts; if the wind becomes an attack spectacle; if the civilians become a wound/gore focus; if Chinese/Mandarin voice or subtitles/UI appear; or if the three anchors collapse into a static hold.
