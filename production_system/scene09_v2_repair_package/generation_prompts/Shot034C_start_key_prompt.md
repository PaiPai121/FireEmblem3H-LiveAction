# Shot034C Frame Generation Prompt

Status: already_generated_monitor_required

## Start Frame

Output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/32_Shot034C_start.png`

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034C START
Shot purpose: Felix blocks Ferdinand.
Primary request: Ferdinand tries to sprint/step toward northeast stairs for回援.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Ferdinand
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Ferdinand: "让开!" / Felix: "你太吵了."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot034C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
No unnamed extras: every readable human figure in frame must be one of the named characters listed for this shot. Do not add background students, generic soldiers, anonymous crowd lines, spectators, bystanders, or filler trainees. If the shot needs to show house scale or starting zones, use physical banners, colored wooden markers, empty lanes, training shields, weapon racks, flags, or terrain composition instead of additional people.
Battle state lock after this shot:
- Visible named characters allowed in this shot: Felix, Ferdinand.
- Active or available after the shot: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Ferdinand, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.
- Constrained but not defeated after the shot: Dedue=active_shield_restored, Felix=active_contained_by_byleth, Ashe=active_overwatch_restored, Annette=active_dust_cover, Mercedes=active_support_healing_low, Hubert=captured_by_felix_and_ashe, Ferdinand=active_route_blocked_by_felix, Dorothea=captured_by_leonie_and_claude, Bernadetta=captured_by_leonie_and_claude, Leonie=active_captor_with_claude, Hanneman=active_spell_angle_suppressed, Manuela=active_route_blocked_by_ingrid.
- Defeated/removed by mock-battle rule after the shot: Hubert, Dorothea, Bernadetta.
- Objective-defeated teachers after the shot: none.
- Stood down after the shot: none.
- Must not reappear as active combatants after this shot: Hubert, Dorothea, Bernadetta.
- State note: Ferdinand cannot return to the teacher platform but remains upright and competent.
```

## Key Frame

Output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/32_Shot034C_key.png`

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034C KEY
Shot purpose: Felix blocks Ferdinand.
Primary request: Felix slides laterally and locks the route with wooden sword; Ferdinand upright, frustrated but strong.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Ferdinand
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Ferdinand: "让开!" / Felix: "你太吵了."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot034C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
No unnamed extras: every readable human figure in frame must be one of the named characters listed for this shot. Do not add background students, generic soldiers, anonymous crowd lines, spectators, bystanders, or filler trainees. If the shot needs to show house scale or starting zones, use physical banners, colored wooden markers, empty lanes, training shields, weapon racks, flags, or terrain composition instead of additional people.
Battle state lock after this shot:
- Visible named characters allowed in this shot: Felix, Ferdinand.
- Active or available after the shot: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Ferdinand, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.
- Constrained but not defeated after the shot: Dedue=active_shield_restored, Felix=active_contained_by_byleth, Ashe=active_overwatch_restored, Annette=active_dust_cover, Mercedes=active_support_healing_low, Hubert=captured_by_felix_and_ashe, Ferdinand=active_route_blocked_by_felix, Dorothea=captured_by_leonie_and_claude, Bernadetta=captured_by_leonie_and_claude, Leonie=active_captor_with_claude, Hanneman=active_spell_angle_suppressed, Manuela=active_route_blocked_by_ingrid.
- Defeated/removed by mock-battle rule after the shot: Hubert, Dorothea, Bernadetta.
- Objective-defeated teachers after the shot: none.
- Stood down after the shot: none.
- Must not reappear as active combatants after this shot: Hubert, Dorothea, Bernadetta.
- State note: Ferdinand cannot return to the teacher platform but remains upright and competent.
```

## Reject If

- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Felix: wooden training sword; Ferdinand: training lance.

