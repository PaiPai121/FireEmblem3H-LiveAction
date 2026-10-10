# EP02 Scene09 Rebuild V2 Frame And Video Prompt Queue

Date: 2026-07-21

Status: **needs_generation**. This file is generated from `scene09_shot_list_v2_2026-07-21.md`.

All current Scene09 legacy images remain layout reference only. Use only frames from this directory after they pass creative QA.

## Shot025 - Establish rules and objective.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/01_Shot025_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot025 START
Shot purpose: Establish rules and objective.
Primary request: Wide high-angle mock battle field: southeast Blue Lions start, north/northeast Black Eagles, west Golden Deer thicket, northeast teacher healing sigil.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Manuela, Hanneman, Dimitri, Edelgard, Claude
Character identity and weapon locks:
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Manuela explains objective; Hanneman warns against real violence.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot025; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/01_Shot025_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot025 KEY
Shot purpose: Establish rules and objective.
Primary request: Manuela raises hand on sigil; Hanneman checks wood weapons; all three houses look toward lanes.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Manuela, Hanneman, Dimitri, Edelgard, Claude
Character identity and weapon locks:
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Manuela explains objective; Hanneman warns against real violence.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot025; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Slow crane over outdoor academy mock battle field, readable tactical zones, students hold position, Manuela and Hanneman on northeast sigil, nonlethal training atmosphere, no anonymous crowd masses near camera. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Manuela: healing sigil / Nosferatu pressure; Hanneman: faculty spell gesture; Dimitri: long training lance; Edelgard: training axe and command hand signals; Claude: training bow.

## Shot025A - Tactical geography insert.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/02_Shot025A_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot025A START
Shot purpose: Tactical geography insert.
Primary request: Clean cinematic map-like plate of low walls, west thicket, central channel, northeast steps and sigil.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: no readable named characters; tactical geography only
Character identity and weapon locks:
No named face close enough to require identity lock.
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Horn wind under rules.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot025A; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/02_Shot025A_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot025A KEY
Shot purpose: Tactical geography insert.
Primary request: Small colored house markers settle into their start zones.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: no readable named characters; tactical geography only
Character identity and weapon locks:
No named face close enough to require identity lock.
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Horn wind under rules.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot025A; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Controlled top-down tactical insert, subtle flags and dust, no characters facing camera, map geography clear. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.

## Shot026 - Byleth assigns roles.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/03_Shot026_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot026 START
Shot purpose: Byleth assigns roles.
Primary request: Byleth kneels over mud map, Blue Lions semicircle; stones mark lanes.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "Dimitri front. Dedue anchor. Felix, wait for the turn." Felix: "Then give me the opening." Byleth: "机会不等于命令。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot026; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/03_Shot026_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot026 KEY
Shot purpose: Byleth assigns roles.
Primary request: Byleth points first center, then west flank, then northeast platform; students look at assigned directions.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "Dimitri front. Dedue anchor. Felix, wait for the turn." Felix: "Then give me the opening." Byleth: "机会不等于命令。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot026; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Intimate tactical briefing, camera low over mud map, Byleth calm, Blue Lions academy students attentive, no portrait lineup, hands and stones drive action. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Byleth: training sword or sheathed sword, command gestures; Dimitri: long training lance; Dedue: large shield, defensive body line; Felix: wooden training sword; Ashe: training bow; Annette: book and wind/dust magic; Mercedes: empty hands and short white healing light; Sylvain: training lance; Ingrid: training lance.

## Shot026B - Blue Lions read the field.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/04_Shot026B_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot026B START
Shot purpose: Blue Lions read the field.
Primary request: Byleth rises at southeast line, back/side to camera, eyes on northeast objective.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Armor and horn prep.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot026B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/04_Shot026B_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot026B KEY
Shot purpose: Blue Lions read the field.
Primary request: Dimitri/Dedue prepare center, support line crouches behind low wall, Sylvain/Ingrid angle west.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Armor and horn prep.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot026B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Medium-wide command shot from southeast, Blue Lions orient toward field lanes, Byleth as quiet axis, no one staring at viewer. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Byleth: training sword or sheathed sword, command gestures; Dimitri: long training lance; Dedue: large shield, defensive body line; Felix: wooden training sword; Ashe: training bow; Annette: book and wind/dust magic; Mercedes: empty hands and short white healing light; Sylvain: training lance; Ingrid: training lance.

## Shot026C - First movement.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/05_Shot026C_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot026C START
Shot purpose: First movement.
Primary request: Horn starts; Blue Lions launch from southeast in separated lanes.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Horn, boots, armor.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot026C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/05_Shot026C_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot026C KEY
Shot purpose: First movement.
Primary request: Dimitri lance and Dedue shield reach central channel; Felix stays behind line; support remains low.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Horn, boots, armor.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot026C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Dynamic forward tracking shot, Blue Lions move north/northeast, correct weapons, visible lane separation, training battle restraint. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Dimitri: long training lance; Dedue: large shield, defensive body line; Felix: wooden training sword; Ashe: training bow; Annette: book and wind/dust magic; Mercedes: empty hands and short white healing light; Sylvain: training lance; Ingrid: training lance.

## Shot027 - Ashe overwatch setup.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/06_Shot027_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot027 START
Shot purpose: Ashe overwatch setup.
Primary request: Ashe climbs half-height position, bow angled toward center while eyes check west thicket.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Ashe, Claude
Character identity and weapon locks:
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Ashe breath, distant clash.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot027; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/06_Shot027_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot027 KEY
Shot purpose: Ashe overwatch setup.
Primary request: Ashe notices branch movement west but has not been hit by Claude's arrow.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Ashe, Claude
Character identity and weapon locks:
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Ashe breath, distant clash.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot027; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Medium telephoto overwatch shot, Ashe youthful academy archer side/back view, west thicket suspicious in depth, no camera-facing portrait. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Ashe: training bow; Claude: training bow.

## Shot027B - Black Eagles first wave.

Priority batch: 03_three_house_pressure

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/07_Shot027B_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot027B START
Shot purpose: Black Eagles first wave.
Primary request: Ferdinand, Edelgard, Hubert, Dorothea enter named formation from north; no unknown crowd.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Ferdinand, Edelgard, Hubert, Dorothea
Character identity and weapon locks:
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Dorothea: controlled support magic; reference=assets/characters/black_eagles/Dorothea/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Black Eagles armor and steps.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot027B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/07_Shot027B_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot027B KEY
Shot purpose: Black Eagles first wave.
Primary request: Ferdinand plants lance at channel; Edelgard holds axe low; Hubert/Dorothea set support angles.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Ferdinand, Edelgard, Hubert, Dorothea
Character identity and weapon locks:
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Dorothea: controlled support magic; reference=assets/characters/black_eagles/Dorothea/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Black Eagles armor and steps.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot027B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Compact disciplined Black Eagles advance, named students only, north-to-south pressure, academy identities accurate, no extras in foreground. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Ferdinand: training lance; Edelgard: training axe and command hand signals; Hubert: dark magic; Dorothea: controlled support magic.

## Shot027C - First contact.

Priority batch: 03_three_house_pressure

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/08_Shot027C_start.png`

Start prompt:

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
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/08_Shot027C_key.png`

Key prompt:

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
```

Video prompt:

```text
Nonlethal collision at central channel, Dimitri lance, Dedue shield, Ferdinand lance, Black Eagles competent, no collapse, readable facing south/north. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Dimitri: long training lance; Dedue: large shield, defensive body line; Ferdinand: training lance; Edelgard: training axe and command hand signals; Hubert: dark magic.

## Shot027D - Felix delayed side cut.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/09_Shot027D_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot027D START
Shot purpose: Felix delayed side cut.
Primary request: Felix begins to pass Dedue's shield line; Byleth calls from side.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Byleth, Ferdinand, Dedue
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "Felix. 等他回身。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot027D; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/09_Shot027D_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot027D KEY
Shot purpose: Felix delayed side cut.
Primary request: Felix freezes sword one palm from Ferdinand's armor; Ferdinand turns to cover.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Byleth, Ferdinand, Dedue
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "Felix. 等他回身。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot027D; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Tense side-on restraint shot, Felix controlled aggression, Byleth command presence, Ferdinand route readable, no generic duel. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Felix: wooden training sword; Byleth: training sword or sheathed sword, command gestures; Ferdinand: training lance; Dedue: large shield, defensive body line.

## Shot028 - Support line under discipline.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/10_Shot028_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot028 START
Shot purpose: Support line under discipline.
Primary request: Annette and Mercedes move behind southeast low wall, Mercedes empty-handed, Annette holding book.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Annette, Mercedes, Ignatz
Character identity and weapon locks:
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Ignatz: training bow; reference=assets/characters/golden_deer/Ignatz/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Mercedes: "别停在空地上."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot028; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/10_Shot028_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot028 KEY
Shot purpose: Support line under discipline.
Primary request: First arrow/pressure forces them lower; Mercedes pulls Annette out of open line.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Annette, Mercedes, Ignatz
Character identity and weapon locks:
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Ignatz: training bow; reference=assets/characters/golden_deer/Ignatz/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Mercedes: "别停在空地上."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot028; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Low tracking behind wall, support students stay in cover, arrows cut path nonlethally, Annette nervous but age-accurate. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Annette: book and wind/dust magic; Mercedes: empty hands and short white healing light; Ignatz: training bow.

## Shot028B - Black Eagles stabilize center.

Priority batch: 03_three_house_pressure

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/11_Shot028B_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot028B START
Shot purpose: Black Eagles stabilize center.
Primary request: Edelgard watches Blue pressure and side thicket; Hubert spell at channel edge; Dorothea waits.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Edelgard, Hubert, Dorothea, Dimitri, Dedue
Character identity and weapon locks:
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Dorothea: controlled support magic; reference=assets/characters/black_eagles/Dorothea/academy/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Edelgard: "Hubert." / Hubert: "明白."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot028B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/11_Shot028B_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot028B KEY
Shot purpose: Black Eagles stabilize center.
Primary request: Edelgard signals; Hubert pressure slows Dimitri; Dorothea keeps support angle.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Edelgard, Hubert, Dorothea, Dimitri, Dedue
Character identity and weapon locks:
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Dorothea: controlled support magic; reference=assets/characters/black_eagles/Dorothea/academy/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Edelgard: "Hubert." / Hubert: "明白."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot028B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Disciplined Black Eagles command shot, Edelgard not static, Hubert and Dorothea roles separated, center holds under pressure. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Edelgard: training axe and command hand signals; Hubert: dark magic; Dorothea: controlled support magic; Dimitri: long training lance; Dedue: large shield, defensive body line.

## Shot028C - Felix sees future route.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/12_Shot028C_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot028C START
Shot purpose: Felix sees future route.
Primary request: Felix watches Ferdinand's line shift from behind Dedue.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Byleth, Ferdinand, Dedue
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Breath, wood clack.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot028C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/12_Shot028C_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot028C KEY
Shot purpose: Felix sees future route.
Primary request: Byleth's hand keeps him from lunging; Felix's sword lowers a fraction.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Byleth, Ferdinand, Dedue
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Breath, wood clack.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot028C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Close tactical reaction, Felix side-lit, active route in background, Byleth command hand visible, no frontal posing. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Felix: wooden training sword; Byleth: training sword or sheathed sword, command gestures; Ferdinand: training lance; Dedue: large shield, defensive body line.

## Shot029 - Blue flank rotates west.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/13_Shot029_start.png`

Start prompt:

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
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/13_Shot029_key.png`

Key prompt:

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
```

Video prompt:

```text
Medium-wide flank guard shot, Sylvain and Ingrid with long lances, west thicket threat visible, support line protected. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Sylvain: training lance; Ingrid: training lance; Annette: book and wind/dust magic; Mercedes: empty hands and short white healing light; Hilda: training axe, youthful academy appearance; Lorenz: training lance.

## Shot029C - Claude reads two gaps.

Priority batch: 03_three_house_pressure

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/14_Shot029C_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot029C START
Shot purpose: Claude reads two gaps.
Primary request: Claude half-kneels in west thicket, looking east/southeast through branches at Blue stretch and Black side gap.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Claude, Ashe, Edelgard
Character identity and weapon locks:
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Claude: "正面打得这么认真..."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot029C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/14_Shot029C_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot029C KEY
Shot purpose: Claude reads two gaps.
Primary request: Claude draws bow across both lines, smile controlled.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Claude, Ashe, Edelgard
Character identity and weapon locks:
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Claude: "正面打得这么认真..."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot029C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Stealth commander shot from west thicket, Claude youthful academy archer, two target lanes visible through foliage, no villain framing. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Claude: training bow; Ashe: training bow; Edelgard: training axe and command hand signals.

## Shot029D - Claude displaces Ashe.

Priority batch: 03_three_house_pressure

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/15_Shot029D_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot029D START
Shot purpose: Claude displaces Ashe.
Primary request: Ashe steady on half-height point, unaware arrowline is about to cut him off.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Claude, Ashe
Character identity and weapon locks:
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Ashe: "金鹿在侧面!"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot029D; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/15_Shot029D_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot029D KEY
Shot purpose: Claude displaces Ashe.
Primary request: Claude's arrow hits wood in front of Ashe; Ashe recoils and leaves point; second line hints Black Eagles side pressure.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Claude, Ashe
Character identity and weapon locks:
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Ashe: "金鹿在侧面!"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot029D; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Nonlethal arrow suppression, arrow strikes wood not body, Ashe displaced, Claude pressure affects both teams. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Claude: training bow; Ashe: training bow.

## Shot029B - Golden Deer full pressure.

Priority batch: 03_three_house_pressure

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/16_Shot029B_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot029B START
Shot purpose: Golden Deer full pressure.
Primary request: Hilda youth v4 steps from west rail with axe low; Lorenz and Ignatz align beside her.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Hilda, Lorenz, Ignatz, Sylvain, Ingrid
Character identity and weapon locks:
Hilda: training axe, youthful academy appearance; reference=assets/characters/golden_deer/Hilda/academy/selected.png
Lorenz: training lance; reference=assets/characters/golden_deer/Lorenz/academy/selected.png
Ignatz: training bow; reference=assets/characters/golden_deer/Ignatz/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Sylvain/Ingrid exchange.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot029B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/16_Shot029B_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot029B KEY
Shot purpose: Golden Deer full pressure.
Primary request: Lorenz threatens Sylvain/Ingrid lane; Ignatz arrow marks Black Eagles side route; Hilda pressures both lines.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Hilda, Lorenz, Ignatz, Sylvain, Ingrid
Character identity and weapon locks:
Hilda: training axe, youthful academy appearance; reference=assets/characters/golden_deer/Hilda/academy/selected.png
Lorenz: training lance; reference=assets/characters/golden_deer/Lorenz/academy/selected.png
Ignatz: training bow; reference=assets/characters/golden_deer/Ignatz/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Sylvain/Ingrid exchange.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot029B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Golden Deer high-light from west, Hilda youthful and accurate, Lorenz formal lane, Ignatz precise bow, pressure splits Blue and Black without humiliating anyone. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Hilda: training axe, youthful academy appearance; Lorenz: training lance; Ignatz: training bow; Sylvain: training lance; Ingrid: training lance.

## Shot030 - Felix overextension temptation.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/17_Shot030_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot030 START
Shot purpose: Felix overextension temptation.
Primary request: Felix sees northeast opening beyond Ferdinand.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Byleth, Ferdinand
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Footsteps quicken.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot030; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/17_Shot030_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot030 KEY
Shot purpose: Felix overextension temptation.
Primary request: Byleth moves into intercept route before Felix crosses too far.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Byleth, Ferdinand
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Footsteps quicken.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot030; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Low moving shot of Felix almost breaking formation, northeast objective in far depth, Byleth interception geometry clear. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Felix: wooden training sword; Byleth: training sword or sheathed sword, command gestures; Ferdinand: training lance.

## Shot030B - Route trigger close-up.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/18_Shot030B_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot030B START
Shot purpose: Route trigger close-up.
Primary request: Felix's boot reaches contact-line edge.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Byleth
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Cloth snap, stopped breath.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot030B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/18_Shot030B_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot030B KEY
Shot purpose: Route trigger close-up.
Primary request: Byleth's sheathed sword or forearm blocks his path side-on.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Byleth
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Cloth snap, stopped breath.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot030B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Tight tactical blocking insert, no strike, restraint before overextension, combat continues blurred behind. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Felix: wooden training sword; Byleth: training sword or sheathed sword, command gestures.

## Shot030C - Ignatz and Golden Deer cut routes.

Priority batch: 03_three_house_pressure

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/19_Shot030C_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot030C START
Shot purpose: Ignatz and Golden Deer cut routes.
Primary request: Ignatz draws careful arrow from west; Annette/Mercedes route visible behind low wall; Black side route visible deeper.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Ignatz, Annette, Mercedes, Dorothea
Character identity and weapon locks:
Ignatz: training bow; reference=assets/characters/golden_deer/Ignatz/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Dorothea: controlled support magic; reference=assets/characters/black_eagles/Dorothea/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Mercedes: "别停在空地上."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot030C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/19_Shot030C_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot030C KEY
Shot purpose: Ignatz and Golden Deer cut routes.
Primary request: Arrow lands between support path and Black side route, forcing both to adjust.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Ignatz, Annette, Mercedes, Dorothea
Character identity and weapon locks:
Ignatz: training bow; reference=assets/characters/golden_deer/Ignatz/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Dorothea: controlled support magic; reference=assets/characters/black_eagles/Dorothea/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Mercedes: "别停在空地上."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot030C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Precise archer route-denial shot, Ignatz accurate academy asset, arrow strikes ground/wood, both rival lanes react. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Ignatz: training bow; Annette: book and wind/dust magic; Mercedes: empty hands and short white healing light; Dorothea: controlled support magic.

## Shot031 - Byleth stops Felix.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/20_Shot031_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot031 START
Shot purpose: Byleth stops Felix.
Primary request: Felix pushes toward gap; Byleth crosses from center.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Felix
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "你再走十步，两边都会动."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot031; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/20_Shot031_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot031 KEY
Shot purpose: Byleth stops Felix.
Primary request: Byleth's sheathed sword stops Felix at chest-line distance; Felix glares toward route, not camera.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Felix
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "你再走十步，两边都会动."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot031; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Side-on command confrontation amid battle, Byleth calm, Felix contained, route risk readable in background. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Byleth: training sword or sheathed sword, command gestures; Felix: wooden training sword.

## Shot031B - Byleth dual-line command.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/21_Shot031B_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot031B START
Shot purpose: Byleth dual-line command.
Primary request: Central and west-side lines both under pressure; Byleth between them.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Dimitri, Dedue, Sylvain, Ingrid, Annette, Mercedes
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "前线不退。侧翼不断。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot031B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/21_Shot031B_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot031B KEY
Shot purpose: Byleth dual-line command.
Primary request: Byleth gestures forward with one hand and west-containment with the other; Blue Lions split correctly.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Dimitri, Dedue, Sylvain, Ingrid, Annette, Mercedes
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "前线不退。侧翼不断。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot031B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Medium-wide tactical command shot, two active battle lines visible, Byleth not fighting everyone, readable spatial logic. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Byleth: training sword or sheathed sword, command gestures; Dimitri: long training lance; Dedue: large shield, defensive body line; Sylvain: training lance; Ingrid: training lance; Annette: book and wind/dust magic; Mercedes: empty hands and short white healing light.

## Shot032 - Dedue / Mercedes shield-line restoration.

Priority batch: 01_objective_chain

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/22_Shot032_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032 START
Shot purpose: Dedue / Mercedes shield-line restoration.
Primary request: Dedue's shield dips under Ferdinand/Hubert pressure; Dimitri starts to turn; Mercedes behind low wall prepares empty hands.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dedue, Mercedes, Dimitri, Ferdinand, Hubert
Character identity and weapon locks:
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Dimitri, offscreen: "杜笃--" Dedue: "殿下，看前面。" Mercedes: "肩膀还能动吗？我来撑住。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot032; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/22_Shot032_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032 KEY
Shot purpose: Dedue / Mercedes shield-line restoration.
Primary request: Short white healing line reaches Dedue's shield arm; Dedue raises shield back into place; Dimitri faces forward again.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dedue, Mercedes, Dimitri, Ferdinand, Hubert
Character identity and weapon locks:
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Dimitri, offscreen: "杜笃--" Dedue: "殿下，看前面。" Mercedes: "肩膀还能动吗？我来撑住。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot032; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Emotional shield-line restoration beat, mock battle nonlethal, Dedue standing not collapsed, Mercedes heals from cover, shield line closes, no gore, no saintly pose. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Dedue: large shield, defensive body line; Mercedes: empty hands and short white healing light; Dimitri: long training lance; Ferdinand: training lance; Hubert: dark magic.

## Shot032A - Annette dust cover.

Priority batch: 01_objective_chain

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/23_Shot032A_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032A START
Shot purpose: Annette dust cover.
Primary request: Annette crouches beside Mercedes, book open, still tense.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Annette, Mercedes, Ashe, Claude
Character identity and weapon locks:
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Annette: "现在，Ashe!"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot032A; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/23_Shot032A_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032A KEY
Shot purpose: Annette dust cover.
Primary request: Controlled wind/dust rises along low wall; Ashe moves through cover to regain bow angle.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Annette, Mercedes, Ashe, Claude
Character identity and weapon locks:
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Annette: "现在，Ashe!"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot032A; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Support contribution shot, Annette youthful academy mage behind cover, wind-dust tactical not explosive, Mercedes keeps low, Ashe recovers angle. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Annette: book and wind/dust magic; Mercedes: empty hands and short white healing light; Ashe: training bow; Claude: training bow.

## Shot032B - Blue Lions hold below platform.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/24_Shot032B_start.png`

Start prompt:

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
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/24_Shot032B_key.png`

Key prompt:

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
```

Video prompt:

```text
Medium-long objective approach, Blue Lions front below northeast platform, Dedue shield and Dimitri lance correct, sigil visible. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Dimitri: long training lance; Dedue: large shield, defensive body line; Hanneman: faculty spell gesture; Manuela: healing sigil / Nosferatu pressure.

## Shot032C - Black Eagles counter Golden Deer.

Priority batch: 03_three_house_pressure

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/25_Shot032C_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032C START
Shot purpose: Black Eagles counter Golden Deer.
Primary request: Edelgard sees Golden Deer exploiting both sides and raises small signal.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Edelgard, Hubert, Dorothea, Claude, Hilda
Character identity and weapon locks:
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Dorothea: controlled support magic; reference=assets/characters/black_eagles/Dorothea/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Hilda: training axe, youthful academy appearance; reference=assets/characters/golden_deer/Hilda/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Dorothea: "哎呀，被你们看穿了。" Hilda: "我可不想硬撞上去。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot032C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/25_Shot032C_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032C KEY
Shot purpose: Black Eagles counter Golden Deer.
Primary request: Hubert dark magic hits west thicket; Dorothea's controlled spell slows Hilda; Claude/Hilda shift but stay dignified.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Edelgard, Hubert, Dorothea, Claude, Hilda
Character identity and weapon locks:
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Dorothea: controlled support magic; reference=assets/characters/black_eagles/Dorothea/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Hilda: training axe, youthful academy appearance; reference=assets/characters/golden_deer/Hilda/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Dorothea: "哎呀，被你们看穿了。" Hilda: "我可不想硬撞上去。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot032C; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Black Eagles high-light counterpressure, Edelgard command hand, Hubert and Dorothea active, Golden Deer pressured not mocked, west thicket readable. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Edelgard: training axe and command hand signals; Hubert: dark magic; Dorothea: controlled support magic; Claude: training bow; Hilda: training axe, youthful academy appearance.

## Shot032D - Three-line geography proof.

Priority batch: 03_three_house_pressure

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/26_Shot032D_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032D START
Shot purpose: Three-line geography proof.
Primary request: High oblique view: Blue center, Black center/side, Golden west all separate.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Dimitri, Edelgard, Claude
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Battle bed, no key dialogue.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot032D; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/26_Shot032D_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032D KEY
Shot purpose: Three-line geography proof.
Primary request: Arrows/spell/dust show three lines compressing toward central obstacles.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Dimitri, Edelgard, Claude
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Battle bed, no key dialogue.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot032D; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
High oblique tactical shot, no anonymous crowd pile, named clusters readable, lanes and facing consistent. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Byleth: training sword or sheathed sword, command gestures; Dimitri: long training lance; Edelgard: training axe and command hand signals; Claude: training bow.

## Shot032E - Byleth exploits chaos.

Priority batch: 03_three_house_pressure

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/27_Shot032E_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032E START
Shot purpose: Byleth exploits chaos.
Primary request: Golden Deer, Black Eagles, Blue Lions all contest low wall/rail zone; Blue still holds center.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Dimitri, Edelgard, Claude, Hilda, Hubert
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Hilda: training axe, youthful academy appearance; reference=assets/characters/golden_deer/Hilda/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "不要追金鹿。把黑鹫往他们那边压."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot032E; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/27_Shot032E_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot032E KEY
Shot purpose: Byleth exploits chaos.
Primary request: Byleth points Black Eagles pressure toward Golden Deer zone while refusing chase west.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Dimitri, Edelgard, Claude, Hilda, Hubert
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Hilda: training axe, youthful academy appearance; reference=assets/characters/golden_deer/Hilda/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "不要追金鹿。把黑鹫往他们那边压."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot032E; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Controlled three-way compression, Blue not overpowering, Black and Golden active, Byleth reads objective window, no messy brawl. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Byleth: training sword or sheathed sword, command gestures; Dimitri: long training lance; Edelgard: training axe and command hand signals; Claude: training bow; Hilda: training axe, youthful academy appearance; Hubert: dark magic.

## Shot033 - Dimitri restraint near platform.

Priority batch: 04_setup_continuity

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/28_Shot033_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot033 START
Shot purpose: Dimitri restraint near platform.
Primary request: Dimitri's lance pressure nears Hanneman's steps; hand tight.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Byleth, Dedue, Hanneman
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Heavy breath.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot033; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/28_Shot033_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot033 KEY
Shot purpose: Dimitri restraint near platform.
Primary request: Byleth palm-down in his peripheral view; Dimitri checks force without stopping objective push.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Byleth, Dedue, Hanneman
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Heavy breath.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot033; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Tense restraint shot before victory, Dimitri not feral, Byleth palm-down signal readable, teacher platform depth. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Dimitri: long training lance; Byleth: training sword or sheathed sword, command gestures; Dedue: large shield, defensive body line; Hanneman: faculty spell gesture.

## Shot033B - Byleth calls teacher cut.

Priority batch: 01_objective_chain

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/29_Shot033B_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot033B START
Shot purpose: Byleth calls teacher cut.
Primary request: Two lines briefly stable; northeast platform open for a beat.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Ashe, Ingrid, Felix, Hanneman, Manuela
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "现在。切老师."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot033B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/29_Shot033B_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot033B KEY
Shot purpose: Byleth calls teacher cut.
Primary request: Byleth points to teacher platform; Ashe/Ingrid/Felix each react into separate routes.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Ashe, Ingrid, Felix, Hanneman, Manuela
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Byleth: "现在。切老师."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot033B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Command-and-reaction shot, Byleth active directing, Blue Lions peel into distinct objective routes, no confusion about teachers. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Byleth: training sword or sheathed sword, command gestures; Ashe: training bow; Ingrid: training lance; Felix: wooden training sword; Hanneman: faculty spell gesture; Manuela: healing sigil / Nosferatu pressure.

## Shot033C - Ashe suppresses Hanneman.

Priority batch: 01_objective_chain

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/30_Shot033C_start.png`

Start prompt:

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
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/30_Shot033C_key.png`

Key prompt:

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
```

Video prompt:

```text
Ashe's final nonlethal archer check is already complete: Hanneman spell angle is blocked at the stone step, Ashe lowers the bowline and stands down, and the beat reads as route denial rather than a beam duel. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Ashe: training bow; Hanneman: faculty spell gesture.

## Shot033D - Ingrid cuts Manuela.

Priority batch: 01_objective_chain

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/31_Shot033D_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot033D START
Shot purpose: Ingrid cuts Manuela.
Primary request: Manuela lifts one hand beside the healing sigil and forms a brief dark-white Nosferatu pressure line toward Sylvain, preparing to step back onto the route.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Ingrid, Manuela, Sylvain
Character identity and weapon locks:
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Manuela: "哎呀，这条路被切了。" Ingrid: "路线封住，请停步。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot033D; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/31_Shot033D_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot033D KEY
Shot purpose: Ingrid cuts Manuela.
Primary request: Ingrid's lance line stops Manuela's return path before the spell pressure can reset the lane; Manuela smiles and halts by rule, unhurt.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Ingrid, Manuela, Sylvain
Character identity and weapon locks:
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Manuela: "哎呀，这条路被切了。" Ingrid: "路线封住，请停步。"
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot033D; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Route-control shot, Ingrid controlled lance, Manuela brief Nosferatu pressure visible but nonlethal, healing sigil behind her, Manuela unhurt and dignified. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Ingrid: training lance; Manuela: healing sigil / Nosferatu pressure; Sylvain: training lance.

## Shot034C - Felix blocks Ferdinand.

Priority batch: 01_objective_chain

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/32_Shot034C_start.png`

Start prompt:

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
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/32_Shot034C_key.png`

Key prompt:

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
```

Video prompt:

```text
Route block duel, no defeat blow, Ferdinand competent, Felix efficient, stair base and objective visible. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Felix: wooden training sword; Ferdinand: training lance.

## Shot034D - Byleth interrupts Hanneman.

Priority batch: 01_objective_chain

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/33_Shot034D_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034D START
Shot purpose: Byleth interrupts Hanneman.
Primary request: Hanneman's spell reforms after Ashe suppression; Byleth enters blind side with sheathed sword.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Hanneman, Ashe
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Hanneman: "判断得很好."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot034D; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/33_Shot034D_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034D KEY
Shot purpose: Byleth interrupts Hanneman.
Primary request: Sheathed sword taps Hanneman's wrist/forearm; spell breaks white; Hanneman looks impressed.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Byleth, Hanneman, Ashe
Character identity and weapon locks:
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Hanneman: "判断得很好."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot034D; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Precise nonlethal faculty objective shot, Byleth sheathed-sword wrist tap, no bare hand, no high-five ambiguity, sigil visible. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Byleth: training sword or sheathed sword, command gestures; Hanneman: faculty spell gesture; Ashe: training bow.

## Shot034B - Teachers leave sigil.

Priority batch: 01_objective_chain

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/34_Shot034B_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034B START
Shot purpose: Teachers leave sigil.
Primary request: Hanneman and Manuela both blocked from controlling sigil.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Hanneman, Manuela, Dimitri, Dedue, Byleth, Ingrid
Character identity and weapon locks:
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Whistle.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot034B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/34_Shot034B_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034B KEY
Shot purpose: Teachers leave sigil.
Primary request: Both step off healing mark; whistle begins; Blue Lions hold but do not strike.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Hanneman, Manuela, Dimitri, Dedue, Byleth, Ingrid
Character identity and weapon locks:
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Whistle.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot034B; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Clear objective victory shot, teachers leave northeast healing sigil by rule, students freeze in restraint, no knockout framing. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Hanneman: faculty spell gesture; Manuela: healing sigil / Nosferatu pressure; Dimitri: long training lance; Dedue: large shield, defensive body line; Byleth: training sword or sheathed sword, command gestures; Ingrid: training lance.

## Shot034E - Golden Deer stand-down.

Priority batch: 02_dignified_exits

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/35_Shot034E_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034E START
Shot purpose: Golden Deer stand-down.
Primary request: Claude's thicket angle gone; Hilda at rail; Lorenz held outside lance line; Ignatz with arrow ready.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Claude, Hilda, Lorenz, Ignatz, Ingrid
Character identity and weapon locks:
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Hilda: training axe, youthful academy appearance; reference=assets/characters/golden_deer/Hilda/academy/selected.png
Lorenz: training lance; reference=assets/characters/golden_deer/Lorenz/academy/selected.png
Ignatz: training bow; reference=assets/characters/golden_deer/Ignatz/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Claude concession line.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot034E; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/35_Shot034E_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034E KEY
Shot purpose: Golden Deer stand-down.
Primary request: Claude lowers bow smiling; Hilda dusts armor; Lorenz halts upright; Ignatz returns arrow to quiver.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Claude, Hilda, Lorenz, Ignatz, Ingrid
Character identity and weapon locks:
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Hilda: training axe, youthful academy appearance; reference=assets/characters/golden_deer/Hilda/academy/selected.png
Lorenz: training lance; reference=assets/characters/golden_deer/Lorenz/academy/selected.png
Ignatz: training bow; reference=assets/characters/golden_deer/Ignatz/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Claude concession line.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot034E; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Dignified Golden Deer exit insert, youthful accurate assets, no embarrassment, their plan almost worked but space is gone. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Claude: training bow; Hilda: training axe, youthful academy appearance; Lorenz: training lance; Ignatz: training bow; Ingrid: training lance.

## Shot034F - Black Eagles stand-down.

Priority batch: 02_dignified_exits

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/36_Shot034F_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034F START
Shot purpose: Black Eagles stand-down.
Primary request: Edelgard sees teachers off sigil; Hubert/Dorothea/Ferdinand still ready.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Edelgard, Hubert, Dorothea, Ferdinand, Felix
Character identity and weapon locks:
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Dorothea: controlled support magic; reference=assets/characters/black_eagles/Dorothea/academy/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Edelgard: "青狮赢了。但不是因为他们最会冲."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot034F; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/36_Shot034F_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034F KEY
Shot purpose: Black Eagles stand-down.
Primary request: Edelgard signals; Dorothea stops final spell note; Hubert steps back calculating; Ferdinand keeps lance steady behind Felix block.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Edelgard, Hubert, Dorothea, Ferdinand, Felix
Character identity and weapon locks:
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Hubert: dark magic; reference=assets/characters/black_eagles/Hubert/academy/selected.png
Dorothea: controlled support magic; reference=assets/characters/black_eagles/Dorothea/academy/selected.png
Ferdinand: training lance; reference=assets/characters/black_eagles/Ferdinand/academy/selected.png
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Edelgard: "青狮赢了。但不是因为他们最会冲."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot034F; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Dignified Black Eagles exit insert, disciplined concession, no collapse, all named roles visible and weapon-accurate. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Edelgard: training axe and command hand signals; Hubert: dark magic; Dorothea: controlled support magic; Ferdinand: training lance; Felix: wooden training sword.

## Shot034G - Blue Lions stand-down.

Priority batch: 02_dignified_exits

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/37_Shot034G_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034G START
Shot purpose: Blue Lions stand-down.
Primary request: Blue Lions hold winning lanes without chasing.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Annette, Mercedes, Dedue, Sylvain, Ingrid, Ashe
Character identity and weapon locks:
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Second whistle tail.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot034G; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/37_Shot034G_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034G KEY
Shot purpose: Blue Lions stand-down.
Primary request: Annette closes book; Mercedes drops healing light after checking Dedue; Sylvain lowers lance; Ingrid still watches route; Ashe lowers bow.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Annette, Mercedes, Dedue, Sylvain, Ingrid, Ashe
Character identity and weapon locks:
Annette: book and wind/dust magic; reference=assets/characters/blue_lions/Annette/academy/selected.png
Mercedes: empty hands and short white healing light; reference=assets/characters/blue_lions/Mercedes/academy/selected.png
Dedue: large shield, defensive body line; reference=assets/characters/blue_lions/Dedue/academy/selected.png
Sylvain: training lance; reference=assets/characters/blue_lions/Sylvain/academy/selected.png
Ingrid: training lance; reference=assets/characters/blue_lions/Ingrid/academy/selected.png
Ashe: training bow; reference=assets/characters/blue_lions/Ashe/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Second whistle tail.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot034G; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Blue Lions restrained stand-down, each role-specific, objective won but no gloating, academy training tone. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Annette: book and wind/dust magic; Mercedes: empty hands and short white healing light; Dedue: large shield, defensive body line; Sylvain: training lance; Ingrid: training lance; Ashe: training bow.

## Shot034 - Full field resolution.

Priority batch: 02_dignified_exits

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/38_Shot034_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034 START
Shot purpose: Full field resolution.
Primary request: Wide three-house field with teachers off sigil and all lanes readable.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Edelgard, Claude, Hanneman, Manuela
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Claude and Edelgard concession lines may overlap as post-battle.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot034; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/38_Shot034_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot034 KEY
Shot purpose: Full field resolution.
Primary request: All houses lower weapons in place; Blue Lions occupy objective routes, Black Eagles and Golden Deer remain ordered.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Edelgard, Claude, Hanneman, Manuela
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Edelgard: training axe and command hand signals; reference=assets/characters/black_eagles/Edelgard/academy/selected.png
Claude: training bow; reference=assets/characters/golden_deer/Claude/academy/selected.png
Hanneman: faculty spell gesture; reference=assets/characters/church_of_seiros/Hanneman/academy/selected.png
Manuela: healing sigil / Nosferatu pressure; reference=assets/characters/church_of_seiros/Manuela/academy/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Claude and Edelgard concession lines may overlap as post-battle.
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot034; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Wide dignified resolution, three houses evenly matched, Blue Lions narrow objective win, no victory crowd blur. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Dimitri: long training lance; Edelgard: training axe and command hand signals; Claude: training bow; Hanneman: faculty spell gesture; Manuela: healing sigil / Nosferatu pressure.

## Shot035 - Felix respect beat.

Priority batch: 02_dignified_exits

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/39_Shot035_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot035 START
Shot purpose: Felix respect beat.
Primary request: Felix watches Byleth after lowering wooden sword.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Byleth
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Felix: "你不是只会碰巧救人."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot035; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/39_Shot035_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot035 KEY
Shot purpose: Felix respect beat.
Primary request: Felix gives short line, still guarded but no immediate rebuttal.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Felix, Byleth
Character identity and weapon locks:
Felix: wooden training sword; reference=assets/characters/blue_lions/Felix/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Felix: "你不是只会碰巧救人."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot035; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Post-action close-up, Felix academy identity accurate, wooden sword lowered, restrained respect, combat over. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Felix: wooden training sword; Byleth: training sword or sheathed sword, command gestures.

## Shot036 - Dimitri aftermath.

Priority batch: 02_dignified_exits

Start output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/40_Shot036_start.png`

Start prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot036 START
Shot purpose: Dimitri aftermath.
Primary request: Dimitri lowers lance and bows to Byleth; hand remains tight.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Byleth
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Dimitri: "今日我学到的，不只是战斗方式."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This start frame must connect cleanly to the other frame for Shot036; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Key output: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/40_Shot036_key.png`

Key prompt:

```text
Use case: historical-scene
Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe
Shot: Shot036 KEY
Shot purpose: Dimitri aftermath.
Primary request: Close hand tension then face; Byleth notices quietly.
Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.
Characters visible: Dimitri, Byleth
Character identity and weapon locks:
Dimitri: long training lance; reference=assets/characters/blue_lions/Dimitri/academy/selected.png
Byleth: training sword or sheathed sword, command gestures; reference=assets/characters/protagonist/Byleth/professor/selected.png
Screen direction: Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.
Dialogue/audio anchor: Dimitri: "今日我学到的，不只是战斗方式."
Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark. Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks. Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and healing sigil. Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.
Continuity requirement: This key frame must connect cleanly to the other frame for Shot036; same location, same characters, same costumes, same weapons, plausible tactical movement.
Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.
```

Video prompt:

```text
Quiet aftermath shot, Dimitri controlled but shadowed, weapon lowered, no active combat, Blue Lions trust shift. Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain. Motion should be restrained and tactical, not chaotic melee. No new foreground extras.
```

Reject if:
- Reject if any readable named character becomes a generic adult mannequin or wrong-age student.
- Reject if any combat character faces the camera while their threat or route is elsewhere.
- Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.
- Reject if the scene becomes lethal, bloody, or humiliating for any house.
- Reject if weapon locks are broken: Dimitri: long training lance; Byleth: training sword or sheathed sword, command gestures.

