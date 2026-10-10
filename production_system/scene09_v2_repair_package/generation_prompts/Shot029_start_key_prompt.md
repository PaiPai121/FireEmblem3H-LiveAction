# Shot029 Frame Generation Prompt

Status: already_generated_monitor_required

## Start Frame

Output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/13_Shot029_start.png`

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot029 START
Shot purpose: Blue flank rotates west.
Primary request: Sylvain relaxed posture fades as west threat appears; Ingrid already pivots lance west/northwest.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Sylvain, Ingrid, Annette, Mercedes, Hilda, Lorenz
Character identity and weapon locks:
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Hilda: training axe, youthful academy appearance; reference=assets/characters/golden_deer/Hilda/academy/selected.png
Lorenz: training lance; reference=assets/characters/golden_deer/Lorenz/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Sylvain: "别追太深，守住侧线。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot029; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
No unnamed extras: every readable human figure in frame must be one of the named characters listed for this shot. Do not add background students, generic soldiers, anonymous crowd lines, spectators, bystanders, or filler trainees. If the shot needs to show house scale or starting zones, use physical banners, colored wooden markers, empty lanes, training shields, weapon racks, flags, or terrain composition instead of additional people.
Battle state lock after this shot:
- Visible named characters allowed in this shot: Sylvain, Ingrid, Annette, Mercedes, Hilda, Lorenz.
- Active or available after the shot: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.
- Constrained but not defeated after the shot: Felix=active_delayed_by_command, Annette=active_in_cover, Mercedes=active_in_cover, Ferdinand=active_covering_route.
- Defeated/removed by mock-battle rule after the shot: none.
- Objective-defeated teachers after the shot: none.
- Stood down after the shot: none.
- Must not reappear as active combatants after this shot: none.
```

## Key Frame

Output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/13_Shot029_key.png`

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot029 KEY
Shot purpose: Blue flank rotates west.
Primary request: Both guard Annette/Mercedes' side without chasing.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Sylvain, Ingrid, Annette, Mercedes, Hilda, Lorenz
Character identity and weapon locks:
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Hilda: training axe, youthful academy appearance; reference=assets/characters/golden_deer/Hilda/academy/selected.png
Lorenz: training lance; reference=assets/characters/golden_deer/Lorenz/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Sylvain: "别追太深，守住侧线。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot029; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
No unnamed extras: every readable human figure in frame must be one of the named characters listed for this shot. Do not add background students, generic soldiers, anonymous crowd lines, spectators, bystanders, or filler trainees. If the shot needs to show house scale or starting zones, use physical banners, colored wooden markers, empty lanes, training shields, weapon racks, flags, or terrain composition instead of additional people.
Battle state lock after this shot:
- Visible named characters allowed in this shot: Sylvain, Ingrid, Annette, Mercedes, Hilda, Lorenz.
- Active or available after the shot: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.
- Constrained but not defeated after the shot: Felix=active_delayed_by_command, Annette=active_in_cover, Mercedes=active_in_cover, Ferdinand=active_covering_route.
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
- Reject if weapon locks are broken: Sylvain: training lance; Ingrid: training lance; Annette: book and wind/dust magic; Mercedes: empty hands and short white healing light; Hilda: training axe, youthful academy appearance; Lorenz: training lance.

