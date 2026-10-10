# Shot027C Frame Generation Prompt

Status: already_generated_monitor_required

## Start Frame

Output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/08_Shot027C_start.png`

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot027C START
Shot purpose: First contact.
Primary request: Dimitri/Dedue close on Ferdinand's line at central low wall.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Dedue, Ferdinand, Edelgard, Hubert
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Ferdinand: "黑鹫不会被一次冲锋打开!"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot027C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
No unnamed extras: every readable human figure in frame must be one of the named characters listed for this shot. Do not add background students, generic soldiers, anonymous crowd lines, spectators, bystanders, or filler trainees. If the shot needs to show house scale or starting zones, use physical banners, colored wooden markers, empty lanes, training shields, weapon racks, flags, or terrain composition instead of additional people.
Battle state lock after this shot:
- Visible named characters allowed in this shot: Dimitri, Dedue, Ferdinand, Edelgard, Hubert.
- Active or available after the shot: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.
- Constrained but not defeated after the shot: Ferdinand=active_yielded_half_step.
- Defeated/removed by mock-battle rule after the shot: none.
- Objective-defeated teachers after the shot: none.
- Stood down after the shot: none.
- Must not reappear as active combatants after this shot: none.
- State note: Ferdinand yields half a step but is not defeated and must not be shown collapsed.
```

## Key Frame

Output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/08_Shot027C_key.png`

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot027C KEY
Shot purpose: First contact.
Primary request: Wood lance and shield impact; Ferdinand yields half-step but holds; Edelgard and Hubert remain controlled behind.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Dedue, Ferdinand, Edelgard, Hubert
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Ferdinand: "黑鹫不会被一次冲锋打开!"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot027C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
No unnamed extras: every readable human figure in frame must be one of the named characters listed for this shot. Do not add background students, generic soldiers, anonymous crowd lines, spectators, bystanders, or filler trainees. If the shot needs to show house scale or starting zones, use physical banners, colored wooden markers, empty lanes, training shields, weapon racks, flags, or terrain composition instead of additional people.
Battle state lock after this shot:
- Visible named characters allowed in this shot: Dimitri, Dedue, Ferdinand, Edelgard, Hubert.
- Active or available after the shot: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.
- Constrained but not defeated after the shot: Ferdinand=active_yielded_half_step.
- Defeated/removed by mock-battle rule after the shot: none.
- Objective-defeated teachers after the shot: none.
- Stood down after the shot: none.
- Must not reappear as active combatants after this shot: none.
- State note: Ferdinand yields half a step but is not defeated and must not be shown collapsed.
```

## Reject If

- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Dimitri: long training lance; Dedue: large shield, defensive body line; Ferdinand: training lance; Edelgard: training axe and command hand signals; Hubert: dark magic.

