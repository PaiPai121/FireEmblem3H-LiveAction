# EP02 Scene09 Weapon And Facing Audit

Date: 2026-07-19

Reviewed local contact sheet:

- `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/scene09_start_key_contact_sheet_2026-07-19.png`

This audit separates file-delivery QA from cinematic rationality. A frame can exist and load correctly but still need revision for weapon logic, facing, or action readability.

2026-07-19 update: academy-age likeness is now part of this audit. A frame fails if a named student reads as a mature adult even when the file path, costume, and weapon are otherwise correct. Hilda academy `selected.png` has been replaced with youth identity v4, so older Hilda-visible stills are stale for video.

## Canon Weapon Locks For Scene09

| Character | Required mock-battle weapon / action | Do not show |
| --- | --- | --- |
| Byleth | sheathed training sword or plain training sword; uses it to block, point, or tap Hanneman wrist | bow, spear, axe, staff, glowing attack spell |
| Dimitri | long blunted training lance / spear, held in disciplined two-hand guard | sword as primary weapon, axe, bow |
| Dedue | large padded practice shield; optional short blunt sidearm mostly hidden | slim body, bow, mage staff, two-handed sword |
| Felix | wooden training sword / practice blade | spear, axe, bow, magic |
| Sylvain | training lance / spear | sword as primary weapon, bow, magic |
| Ingrid | training lance / spear | sword as primary weapon, axe, bow |
| Ashe | wooden training bow and training arrows | sword/lance as primary weapon |
| Annette | no melee weapon; wind magic gesture/book focus only | spear, sword, bow |
| Mercedes | no melee weapon; white healing magic from hands, behind cover | staff-as-spear, sword, bow, offensive beam |
| Edelgard | blunted training axe or visible axe-ready stance; can lower weapon when defeated | spear/bow as primary weapon |
| Hubert | dark magic casting hand or book focus; no frontline melee weapon | sword/spear as primary weapon |
| Ferdinand | training lance / spear | bow, magic-only stance |
| Dorothea | magic casting stance / spell focus | heavy weapon |
| Claude | bow from thicket cover | sword/lance as primary weapon |
| Hilda | training axe / short practice axe; flank pressure | bow/magic as primary weapon |
| Hanneman | wind magic casting hand/book/staff-like focus on platform | sword/lance melee duel |
| Manuela | white magic support or light spell gesture on platform | axe/spear, frontline brawler pose |

## Facing / Threat Logic

- A character under threat should not face camera unless the camera is explicitly over the enemy shoulder.
- If enemies are in far background, foreground defenders should face into that background, not turn their backs to it.
- Close-ups may face camera only when the shot beat is introspective after action, such as Shot035 or Shot036.
- Golden Deer pressure must come from west / screen-left. If a Blue Lions character looks away from west during Golden Deer pressure, the shot is suspect.
- Teacher-platform pressure must run lower/center to upper-right. Ashe arrows and Byleth movement should point toward upper-right, not laterally across an unrelated field.

## Current Visual Risk Triage

| Shot | Risk | Reason | Required Fix |
| --- | --- | --- | --- |
| Shot026C | medium | Blue Lions charge reads, but support characters may appear armed like melee students in some frames. | Prompt Annette/Mercedes as empty-handed support behind line. |
| Shot027 | monitor in video | Local review shows start as side observation and key as back/side facing distant enemy lines, so the stills are not a hard facing error. | Prompt Ashe three-quarter back/side, bow aimed toward west/center threat, no direct camera pose. |
| Shot028B | medium | Black Eagles stabilization lacks strict Edelgard/Hubert/Ferdinand weapon separation. | Lock Edelgard axe/command stance, Hubert magic, Ferdinand lance. |
| Shot029 | monitor in video | Stills are usable as a wide setup, but Ingrid's weapon silhouette can read short-blade if animated too close. | Use only as wide flank setup. Keep Sylvain/Ingrid long training lances readable, both facing west/northwest toward Golden Deer pressure; let Shot029B carry the detailed Golden Deer flank high-light. |
| Shot029B | resolved still / monitor in video | Start/key were regenerated with Hilda youth identity v4. | Keep Sylvain/Ingrid lances visible, Hilda training axe visible, threat from screen-left; test motion for crowd drift. |
| Shot030C | resolved still / monitor in video | Start/key were regenerated so Mercedes is empty-handed behind cover and Annette keeps book/wind focus. | Preserve empty hands and nonlethal route-marker arrows in motion. |
| Shot031 | medium | Byleth/Felix confrontation can become a face-to-camera lecture instead of intercepting a movement vector. | Byleth side-on crossing Felix path, Felix still facing upper-right. |
| Shot032 | resolved in v2 | v1 was usable but too static: start already showed Mercedes light, and the key line could read as crossing Dimitri's lance instead of clearly restoring Dedue's shield arm. | Replaced start/key with v2: start keeps Mercedes unlit and ready; key adds a short white line to Dedue's shield arm/shoulder guard; Dedue/Dimitri keep facing Black Eagles pressure. |
| Shot032C | resolved still / monitor in video | Start/key were regenerated to make Edelgard's signal, Hubert/Dorothea counterpressure, and Hilda youth v4 readable. | Preserve Black Eagles competence without villainizing them; keep Hubert as magic support, Hilda youthful with axe, and Golden Deer pressured but not humiliated. |
| Shot033C | monitor in video | Keyframe reads as Ashe lower-left suppressing Hanneman upper-right; start is quiet and can lose clarity only once animated. | Prompt lower-left Ashe bowline to upper-right Hanneman spell angle. Do not convert it into melee or a front-facing portrait. |
| Shot033D | medium | Ingrid/Manuela route cut can drift into random duel. | Lock Ingrid lance across Manuela's return path; Manuela hands raised in magic/support, not melee. |
| Shot032E | resolved still / monitor in video | Start/key were regenerated with Hilda youth identity v4, visible Hilda practice axe, and three readable house lanes. | Preserve three lanes in motion; do not drift into crowd pile or make any house passive. |
| Shot034D | resolved still / monitor in video | Keyframe was regenerated with a visible sheathed sword contacting Hanneman's wrist/forearm area. | Preserve the sheath in motion; do not drift into bare-hand contact, slap, or high five. |

## Shot032 Desired Composition

Start frame:

- Camera low/medium from Blue Lions rear-left, looking north/northeast.
- Dedue dominates right foreground in shield-wall stance, facing enemy pressure, shield angled toward incoming Black Eagles.
- Dimitri is directly behind Dedue's left shoulder, lance lowered but ready, eyes trying to turn toward Dedue.
- Mercedes crouches behind the low wall in left/southeast rear, hands ready but no light yet.
- Black Eagles pressure is visible ahead/right-depth as silhouettes or students with Ferdinand lance and Hubert dark magic stance.

Key frame:

- Same camera and blocking as start.
- Dedue remains upright. No collapse, no blood, no visible wound.
- A short clean white healing line runs from Mercedes' hands behind the wall into Dedue's shield arm/shoulder guard.
- Dimitri is restrained by Dedue's position: his face shows concern, but his lance still points toward the enemy/front.
- The shot reads as "frontline holds because the healer restores the shield anchor," not as a medical scene after combat.

## Shot032 V2 Local Review

- Replaced official files:
  - `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot032_start.png`
  - `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot032_keyframe.png`
- Preserved prior official files in `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/backups_2026-07-19/`.
- V2 start passes because Mercedes is behind the low wall with no premature healing light, Dedue is broad-backed and facing the right-depth enemy pressure, Dimitri has a long training lance and remains pointed toward the front, and Black Eagles pressure is visible ahead.
- V2 key passes because the healing light originates from Mercedes' empty hands and terminates at Dedue's shield arm/shoulder guard. The line passes close to Dimitri's lance in perspective, but the endpoint and Dedue shoulder flare make the intended target readable.
- Remaining watch item for video generation: keep the healing line short and locked to Dedue's shield arm; do not let it become an offensive beam or a beam attached to Dimitri's weapon.
