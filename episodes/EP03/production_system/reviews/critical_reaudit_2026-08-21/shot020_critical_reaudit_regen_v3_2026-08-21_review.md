# Shot020 Critical Re-audit: Thunderbrand v3

Date: 2026-08-21
Shot: Shot020
Decision: `monitor_required`
Frame set: `Shot020_critical_reaudit_regen_v3_2026-08-21`

## Weapon correction

The prior v2 frame set was blocked. The generic hero-relic board was misread as a long-handled double-bladed weapon, which is wrong for Catherine. Local project evidence and the game reference identify Catherine as the wielder of Thunderbrand, a Heroes' Relic sword. The new isolated local reference is `assets/props/shared/hero_relics/thunderbrand_reference.png`.

The v3 frames keep one single-handed sword: a pale jagged blade with hooked teeth, ornate gold guard, central purple crest stone, and wrapped grip. It is not an axe, spear, lance, staff, halberd, polearm, or double-ended weapon.

## Frame findings

- START: Catherine carries the sword low while entering the shared muddy ridge with female Byleth and Ashe.
- KEY: Catherine completes one grounded sword cut; the narrow lightning arc stays attached to the blade. Byleth and Ashe react in the same space.
- END: Catherine lowers the sword and the students advance into the opened lane, creating a distinct handoff.

## QA result

- Thunderbrand silhouette is readable in all three anchors.
- START/KEY/END have distinct blocking and weapon states.
- No pasted cutout treatment, UI, subtitles, readable text, or gore.
- Female Byleth remains the canonical academy professor.
- Executable prompt contains only the uploaded START/KEY/END contract; local references remain in metadata.
- Video prompt QA: pending.
- 3-second motion probe: pending.

## Disposition

The previous v2 set is `blocked_needs_revision` for the weapon error. The v3 set is the current display candidate and remains `monitor_required` until prompt QA and motion-probe review are complete.
