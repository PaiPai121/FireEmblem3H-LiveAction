# Shot033C Frame Generation Prompt

Status: already_generated_monitor_required

## Start Frame

Output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/30_Shot033C_start.png`

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot033C START
Shot purpose: Ashe suppresses Hanneman.
Primary request: Hanneman starts faculty spell from sigil, white geometry forming.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Ashe, Hanneman
Character identity and weapon locks:
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Hanneman: "哦？先封我的角度."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot033C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
No unnamed extras: every readable human figure in frame must be one of the named characters listed for this shot. Do not add background students, generic soldiers, anonymous crowd lines, spectators, bystanders, or filler trainees. If the shot needs to show house scale or starting zones, use physical banners, colored wooden markers, empty lanes, training shields, weapon racks, flags, or terrain composition instead of additional people.
Battle state lock after this shot:
- Visible named characters allowed in this shot: Ashe, Hanneman.
- Active or available after the shot: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Ferdinand, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.
- Constrained but not defeated after the shot: Dedue=active_shield_restored, Felix=active_contained_by_byleth, Ashe=active_overwatch_restored, Annette=active_dust_cover, Mercedes=active_support_healing_low, Hubert=captured_by_felix_and_ashe, Ferdinand=active_covering_route, Dorothea=captured_by_leonie_and_claude, Bernadetta=captured_by_leonie_and_claude, Leonie=active_captor_with_claude, Hanneman=active_spell_angle_suppressed.
- Defeated/removed by mock-battle rule after the shot: Hubert, Dorothea, Bernadetta.
- Objective-defeated teachers after the shot: none.
- Stood down after the shot: none.
- Must not reappear as active combatants after this shot: Hubert, Dorothea, Bernadetta.
- State note: Hanneman's spell angle is suppressed by Ashe; he is not injured.
```

## Key Frame

Output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/30_Shot033C_key.png`

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot033C KEY
Shot purpose: Ashe suppresses Hanneman.
Primary request: Ashe arrow hits step/marker near casting line, interrupting angle without hitting teacher.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Ashe, Hanneman
Character identity and weapon locks:
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Hanneman: "哦？先封我的角度."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot033C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
No unnamed extras: every readable human figure in frame must be one of the named characters listed for this shot. Do not add background students, generic soldiers, anonymous crowd lines, spectators, bystanders, or filler trainees. If the shot needs to show house scale or starting zones, use physical banners, colored wooden markers, empty lanes, training shields, weapon racks, flags, or terrain composition instead of additional people.
Battle state lock after this shot:
- Visible named characters allowed in this shot: Ashe, Hanneman.
- Active or available after the shot: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Ferdinand, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.
- Constrained but not defeated after the shot: Dedue=active_shield_restored, Felix=active_contained_by_byleth, Ashe=active_overwatch_restored, Annette=active_dust_cover, Mercedes=active_support_healing_low, Hubert=captured_by_felix_and_ashe, Ferdinand=active_covering_route, Dorothea=captured_by_leonie_and_claude, Bernadetta=captured_by_leonie_and_claude, Leonie=active_captor_with_claude, Hanneman=active_spell_angle_suppressed.
- Defeated/removed by mock-battle rule after the shot: Hubert, Dorothea, Bernadetta.
- Objective-defeated teachers after the shot: none.
- Stood down after the shot: none.
- Must not reappear as active combatants after this shot: Hubert, Dorothea, Bernadetta.
- State note: Hanneman's spell angle is suppressed by Ashe; he is not injured.
```

## Reject If

- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Ashe: training bow; Hanneman: faculty spell gesture.

