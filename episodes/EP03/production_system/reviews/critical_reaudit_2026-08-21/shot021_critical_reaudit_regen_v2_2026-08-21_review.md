# Shot021 Critical Re-audit: Regenerated v2

Date: 2026-08-21
Shot: Shot021
Decision: `monitor_required`
Frame set: `Shot021_critical_reaudit_regen_v2_2026-08-21`

## Why the previous candidate failed

The previous set was technically readable but behaved like a static poster. Lonato, Ashe, and Dimitri held repeated positions across the anchors, so the recognition beat and the handoff to Ashe were not visible as action.

## Local reference lock

- Lonato: `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`
- Ashe: `assets/characters/blue_lions/Ashe/academy/selected.png`
- Dimitri: `assets/characters/blue_lions/Dimitri/academy/selected.png`
- Battlefield: `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`

## Frame findings

- START keeps Lonato as a small fog silhouette while Ashe and Dimitri react on the near road.
- KEY makes Lonato readable as a tired, principled older knight; Ashe is pulled forward and Dimitri begins a restrained check.
- END changes the blocking and distance: Ashe occupies the center road, Lonato lowers his sword and opens a hand, and Dimitri shifts behind him for the next cut.

## QA result

- START/KEY/END are distinct and communicate a recognition-to-step chain.
- Character scale, wet ground, fog, and banner continuity are integrated.
- No attack, gore, UI, subtitles, readable text, or new named character.
- Japanese dialogue is retained; prompt is uploaded-frame-only and has no local paths.
- Video prompt QA: pending.
- 3-second motion probe: pending.

## Disposition

The old candidate is `blocked_needs_revision`. The v2 frame set is current but remains `monitor_required` until prompt and motion QA are complete.
