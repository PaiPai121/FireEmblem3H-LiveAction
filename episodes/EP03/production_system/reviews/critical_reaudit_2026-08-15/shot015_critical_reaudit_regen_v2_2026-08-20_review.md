# Shot015 Critical Re-Audit Review v2

Review date: 2026-08-20  
Reviewer role: visual QA / continuity reviewer  
Artifact: `Shot015_critical_reaudit_regen_v2_2026-08-20`  
Status: `monitor_required`

## Why v1 Was Rejected

The v1 critical-reaudit set is downgraded to `blocked_needs_revision`. Across START, KEY, and END, female Byleth stayed in the same right-edge portrait stance while the rebels became a flat repeated shield-and-spear wall. That made the frames look composited and did not provide a playable action chain, even though the face was technically readable.

## Local Reference Pack Used

- `assets/characters/protagonist/BylethFemale/professor/selected.png`
- `assets/characters/church_of_seiros/SeirosSoldier/selected.png`
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`
- `assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png`
- `storyboards/Shot014/critical_reaudit_regen_v1_2026-08-14/end_frame.png`
- `source_refs/Shot015_source.png` for canon/layout evidence only

## Current Frame Review

- START: a small staggered vanguard emerges on the muddy ridge while female Byleth crosses from the rocky right edge into the road. Her face, hair, black professor coat, step, and ground contact are readable in the same fog and light as the soldiers.
- KEY: Byleth has entered the road and raises a low open hand toward the nearest shield bearer. The front soldier occupies the left foreground while two spearmen and a banner recede uphill, creating a real tension corridor rather than a flat line.
- END: the front soldier advances only one step, Byleth lowers the hand and turns her gaze toward the offscreen Blue Lions counterline. The composition creates the Dimitri handoff without inserting Dimitri into this shot.

## Gate Checks

- Female Byleth only: `pass_in_still_frames_monitor_in_motion`
- Old male Byleth path: `not_used`
- Integrated live-action staging: `pass_in_still_frames`
- Small-group / non-clone formation: `pass_in_still_frames_monitor_in_motion`
- START/KEY/END distinct: `pass`
- Web executable prompt contract: `rewritten_no_local_paths_or_unuploaded_references`
- Japanese dialogue only: `pass`
- No burned subtitles/UI: `required_in_prompt_and_negative`

## Remaining Risks And Required Next Gate

Run a 3-second motion probe before any `approved_for_video` promotion. Reject if Byleth becomes male, ambiguous, war-phase, sexualized, static at the right edge, or unreadable; if the soldiers become clones or an endless wall; if the spear strikes; or if gore, magic, subtitles, Chinese/Mandarin voice, UI, borders, or artificial side fill appear.
