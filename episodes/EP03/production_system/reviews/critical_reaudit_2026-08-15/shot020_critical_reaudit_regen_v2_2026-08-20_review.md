# Shot020 Critical Re-audit: Regenerated v2

Date: 2026-08-20
Shot: Shot020
Decision: `monitor_required`
Frame set: `Shot020_critical_reaudit_regen_v2_2026-08-20`

## Why the previous candidate failed

The previous local candidate was not acceptable as a cinematic frame set. Catherine read as a large superhero pose in the foreground, while female Byleth and Ashe were reduced to static background figures. The key frame turned lightning into a broad poster-like slash and the three anchors did not communicate one grounded action chain.

## Local reference lock

- Catherine: `assets/characters/church_of_seiros/Catherine/academy/selected.png`
- Female Byleth: `assets/characters/protagonist/BylethFemale/professor/selected.png`
- Ashe: `assets/characters/blue_lions/Ashe/academy/selected.png`
- Hero relic design: `assets/props/shared/hero_relics/hero_relics_reference.png`
- Battlefield geography: `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`

The source gameplay still was not used as a final visual reference because it contains game presentation and burned text. It remains canon/layout context only.

## Frame findings

### START

Catherine enters from the left flank in a grounded step with the weapon low. Female Byleth and Ashe are moving toward the same fog bank on the same muddy ridge road. Their scale, contact shadows, weather, and eyelines read as one live-action space. No hero-pose reveal or flat character wall is present.

### KEY

Catherine completes one lateral cut. The lightning is a narrow arc connected to the weapon, with restrained wet-ground reflections and fog displacement. Byleth shields her eyes while stepping and Ashe turns with her. The distant rebel line recoils without gore or a new attack beat.

### END

The lightning has settled. Catherine lowers the weapon while Byleth and Ashe advance into the opened lane. A small distant ridge silhouette creates the handoff to the next cut without introducing a close new named character.

## QA result

- START/KEY/END are distinct images and distinct blocking states.
- All named characters are integrated into one environment; no pasted portrait treatment.
- Female Byleth lock is explicit and uses the canonical local selected asset.
- Lightning scale is localized and non-graphic.
- No subtitles, UI, readable text, modern objects, or graphic gore.
- Executable prompt uses only uploaded `START`, `KEY`, and `END` frame labels; local paths are kept in metadata, not the web prompt.
- Video prompt QA: pending.
- 3-second motion probe: pending.

## Disposition

The v1 candidate is `blocked_needs_revision` and superseded. The v2 frame set is the current web display candidate but remains `monitor_required` until prompt QA and motion-probe review are complete.
