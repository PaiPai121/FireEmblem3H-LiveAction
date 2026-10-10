# Shot032B Frame Generation Prompt

Status: already_generated_monitor_required

## Start Frame

Output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/24_Shot032B_start.png`

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032B START
Shot purpose: Blue Lions hold below platform.
Primary request: Dimitri/Dedue push from center toward northeast steps, teacher sigil visible above.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Dedue, Hanneman, Manuela
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Armor, breath.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot032B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
No unnamed extras: every readable human figure in frame must be one of the named characters listed for this shot. Do not add background students, generic soldiers, anonymous crowd lines, spectators, bystanders, or filler trainees. If the shot needs to show house scale or starting zones, use physical banners, colored wooden markers, empty lanes, training shields, weapon racks, flags, or terrain composition instead of additional people.
Battle state lock after this shot:
- Visible named characters allowed in this shot: Dimitri, Dedue, Hanneman, Manuela.
- Active or available after the shot: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.
- Constrained but not defeated after the shot: Dedue=active_shield_restored, Felix=active_contained_by_byleth, Ashe=active_overwatch_restored, Annette=active_dust_cover, Mercedes=active_support_healing_low, Ferdinand=active_covering_route, Dorothea=active_backline_pressured, Bernadetta=active_backline_pressured, Leonie=hidden_active_flanking_black_eagles_backline.
- Defeated/removed by mock-battle rule after the shot: none.
- Objective-defeated teachers after the shot: none.
- Stood down after the shot: none.
- Must not reappear as active combatants after this shot: none.
```

## Key Frame

Output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/24_Shot032B_key.png`

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032B KEY
Shot purpose: Blue Lions hold below platform.
Primary request: Dedue holds lower stair pressure while Dimitri maintains lance line, not overreaching.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Dedue, Hanneman, Manuela
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Armor, breath.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot032B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
No unnamed extras: every readable human figure in frame must be one of the named characters listed for this shot. Do not add background students, generic soldiers, anonymous crowd lines, spectators, bystanders, or filler trainees. If the shot needs to show house scale or starting zones, use physical banners, colored wooden markers, empty lanes, training shields, weapon racks, flags, or terrain composition instead of additional people.
Battle state lock after this shot:
- Visible named characters allowed in this shot: Dimitri, Dedue, Hanneman, Manuela.
- Active or available after the shot: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.
- Constrained but not defeated after the shot: Dedue=active_shield_restored, Felix=active_contained_by_byleth, Ashe=active_overwatch_restored, Annette=active_dust_cover, Mercedes=active_support_healing_low, Ferdinand=active_covering_route, Dorothea=active_backline_pressured, Bernadetta=active_backline_pressured, Leonie=hidden_active_flanking_black_eagles_backline.
- Defeated/removed by mock-battle rule after the shot: none.
- Objective-defeated teachers after the shot: none.
- Stood down after the shot: none.
- Must not reappear as active combatants after this shot: none.
```

## Reject If

- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Dimitri: long training lance; Dedue: large shield, defensive body line; Hanneman: faculty spell gesture; Manuela: healing sigil / Nosferatu pressure.

