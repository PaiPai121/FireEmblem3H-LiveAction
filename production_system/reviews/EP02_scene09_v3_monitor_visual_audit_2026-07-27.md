# EP02 Scene09 V3 Monitor Visual Audit

Date: 2026-07-27

Decision: `monitor_required`

## Integrity Summary

- Active delivery manifest contains 42 shots.
- Start/key/end frame files exist for all 42 shots.
- Current visual status split after synchronization: 12 `visual_review_passed`, 30 `monitor_required`.
- Prompt/frame/ledger consistency audit passes after the 033B/034B teacher-lane corrections.
- This audit is a still-frame review and does not approve video generation clips.

## Visual Audit Coverage

- Contact-sheet triage covered all 30 `monitor_required` shots using:
  - `production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part1.png`
  - `production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part2.png`
  - `production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part3.png`
- Full-size local image review was performed for the highest-risk sets: `Shot029B`, `Shot032D`, `Shot034`, `Shot034B`, `Shot034C`, and `Shot034E`.
- 034B was re-reviewed at full size after the empty-objective patch: only Byleth and Dimitri are visible; both face the empty objective markers; no Hanneman/Manuela pairing remains.

## Unavailable Shots

- None. No missing start/key/end PNGs were found in the active manifest.

## Existing Shots Failed

- No new P0 still-frame failure was found in this pass.
- Existing monitor status remains correct because many shots are group or route-control compositions that can drift during video generation.

## Layout Reference Only

- `Shot032D`: useful as a battlefield-geography and three-lane pressure explanation. It should not be used as a character-performance proof because the leaders are too distant for facial identity.
- `Shot034`: useful as the full-field resolution geography. It proves leader positions and non-celebratory stand-down, but faces are too small for close identity approval.

## Monitor Required

- `Shot029B`: Golden Deer vs Blue Lions pressure reads correctly; Hilda is academy-aged enough in the current frame set. Monitor weapon drift because axes, bows, and long poles can become lethal-looking in motion.
- `Shot034C`: Felix/Ferdinand route block reads as noncontact and nonlethal. Monitor motion so Felix's stop hand does not turn into a strike.
- `Shot034E`: Golden Deer stand-down is dignified and identity-readable. Monitor multi-face drift and ensure Hilda's practice axe remains lowered/nonlethal.
- `Shot033B`: split-faculty command now explicitly locks Hanneman and Manuela as separate markers, not a side-by-side combat pair.
- `Shot034B`: empty-objective ruling now explicitly forbids any teacher or student extra in frame.

## Visual Review Passed

- Existing `visual_review_passed` shots remain: `Shot025`, `Shot025A`, `Shot026B`, `Shot027`, `Shot027B`, `Shot027D`, `Shot028`, `Shot028C`, `Shot029D`, `Shot030B`, `Shot032B`, `Shot032E`.

## Promotion Decision

- Do not promote the scene to `video_generation_package` yet.
- Highest verified target remains `prompt_asset_package`.
- Required next work: continue full-size visual review for the remaining monitor shots or regenerate any monitor shot that fails identity, weapon, facing, or action-chain review; then run strict adjacent continuity and clip-level motion QA before any `approved_for_video` promotion.
