# Shot028 Critical Re-audit

- **Reviewer role:** `independent-critical-reaudit-visual-qa-agent`
- **Review date:** `2026-09-02`
- **Decision:** `visual_review_passed` for still frames; downstream `monitor_required`
- **Issue repaired:** the previous fight read as an unmotivated direct attack on Lonato. The v7 chain first shows the guard line displaced in Shot027, then uses a closer coverage for one controlled weapon-level bind.

## Reviewed Files

- `storyboards/Shot028/critical_reaudit_regen_v7_2026-09-02/start_frame.png`
- `storyboards/Shot028/critical_reaudit_regen_v7_2026-09-02/key_frame.png`
- `storyboards/Shot028/critical_reaudit_regen_v7_2026-09-02/end_frame.png`
- `storyboards/Shot028/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg`

## Findings

- START is a motivated closer side coverage: one guard is still visible behind the barrier, Catherine and Lonato begin separated, and no academy witness enters the contact frame.
- KEY shows one controlled sword press and a readable Thunderbrand-to-ordinary-sword bind at weapon level. Neither blade reaches a body.
- END places Lonato's plain sword flat in the mud while Catherine keeps Thunderbrand low; Lonato remains upright and off-balance for Shot029.
- Catherine's weapon is the correct Thunderbrand reference shape; the ordinary sword is not replaced by a second relic.

## Local Reference Trace

`assets/characters/church_of_seiros/Catherine/academy/selected.png`, `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`, `assets/props/shared/hero_relics/thunderbrand_reference.png`, `assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png`, and the Shot027 v7 END frame.

## Remaining Gate

Keep `monitor_required` until prompt-against-frame QA, ordered combat QA, strict adjacent continuity QA, native Japanese audio verification, and a 3-second motion probe pass. Reject any neck/torso strike, simultaneous swing, hidden contact, premature kneel, or disappearing guard without a motivated cut.
