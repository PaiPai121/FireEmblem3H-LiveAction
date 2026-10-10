# Shot007 Seedance Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the physical action chain. Do not use any local path, source image, screenshot, storyboard note, or external reference at generation time.

The uploaded frames must remain one physically integrated live-action scene with shared scale, contact shadows, wet stone, rain haze, and practical lantern light. Do not paste portraits onto a background. START, KEY, and END must be different physical states, not lighting, crop, or texture variants of one still.

Do not add a named character that is absent from the uploaded frames. Do not show Catherine or Thunderbrand in this shot.

## Shot ID

Shot007

## Duration

12 seconds.

## Scene Beat

Blue Lions students prepare to leave the monastery for their first real suppression mission.

## Adjacent continuity context

Shot006 END is the classroom exit: Ashe is outside, Dimitri follows through the open door, and female Byleth steps after them. Start by continuing that same movement into the nearby wet preparation yard; do not reset to a pre-formed group portrait.

Shot008 START is the Catherine reverse entrance in the same wet monastery courtyard. End with female Byleth and Ashe turning toward the open arch at screen-left, with clear negative space for the incoming figure. Do not reveal Catherine early.

## Cast and choreography

Female Byleth is the adult woman with dark teal hair and black professor coat. Dimitri is the blond academy prince in blue. Dedue is the dark-skinned academy student in blue-and-cream. Felix is the black-haired academy student in black-and-white. Ashe is the silver-blond academy archer with bow case. Ingrid is the blond academy student in blue. Keep academy-age faces, wardrobe topology, physical scale, and grounded contact consistent across all uploaded frames.

0-3s: Begin on START. Keep the classroom door visible behind the group. Ashe and Dimitri continue out of the threshold while female Byleth follows. Dedue reaches the preparation table, Felix turns with the spare short sword, Ingrid pulls a leather harness, and an unnamed Church knight extends a lit fog lantern. The movement must continue from the preceding shot; do not create a new tableau.

3-8s: Travel to KEY through the same wet courtyard. Dedue braces and tightens a shield strap, Ingrid pulls the harness snug, Felix pushes the spare short sword across the table to Ashe, Ashe receives the fog lantern, Dimitri checks the open archway, and female Byleth steadies the map or gear case. Make hand-object contact, weight transfer, shoulder turns, and small foot adjustments visible. Keep the camera close enough to read the handoffs but preserve a shared physical space.

8-12s: Move into END. Gear is secured and the group begins walking away from the table. Dedue and Ingrid carry swinging lanterns, Felix follows with the lowered spare sword, Ashe turns after Byleth, and Dimitri checks that the group is together. Female Byleth and Ashe turn toward the open arch at screen-left. Hold the pre-entrance eyeline for the next cut; Catherine is not visible.

## Camera

Use a motivated match-action track from the doorway to the gear table and then a short pullback into the courtyard. Keep a restrained 35mm live-action perspective, natural wet-floor reflections, real foot contact, door and leather weight, and no static zoom solution.

## Audio

No spoken dialogue and no voiceover. Use only belt buckles, shield leather, lantern glass, soft metal clicks, wet footsteps, rain, cloth movement, and low monastery courtyard tone. No subtitles, captions, readable text, dialogue boxes, or UI.

## Continuity locks

- Preserve the Shot006 doorway exit at START.
- Preserve one wet-stone monastery courtyard and one screen direction through START, KEY, and END.
- Preserve female Byleth's face, gender presentation, black professor coat, and academy-era proportions.
- Preserve Blue Lions academy uniforms and the exact role of each handoff.
- Preserve the Shot008 reverse-entrance eyeline at END.
- Keep Catherine, Thunderbrand, combat, gore, and battlefield action out of Shot007.

## Reject If

- the first frame reverses Shot006's exit or loses the door geography
- START becomes a six-person lineup or KEY/END become static portraits
- the lantern, strap, shield, or spare sword handoff is absent
- Byleth becomes male or ambiguous, or any student shifts to war phase
- the clip adds Catherine or Thunderbrand before Shot008
- weapons become modern, lethal, graphic, or heroic combat props
- the clip adds UI, subtitles, captions, speech bubbles, readable text, a watermark, or borders
- any voiceover or spoken dialogue appears in this silent shot

## Audio lock

No spoken dialogue in this shot. Use only the environmental sounds specified above. Do not invent narration, voiceover, subtitles, captions, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot007

## Duration

Duration: 12 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot007 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for Shot008.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot007 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (the established shot location), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Environmental sound only as already specified in this shot; no spoken dialogue, voiceover, narration, Chinese/Mandarin speech, subtitles, or readable text.

## Dialogue Timing / Delivery

- `dialogue_mode`: silent; no spoken dialogue, voiceover, narration, or invented reply.
- `line_id`: none; this shot is carried by the environmental audio already specified above.
- `single_continuous_utterance`: not applicable; keep the mouth still and do not create speech.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, and no added line.
- `speech_end_cut_timing`: no speech is present; preserve the specified environmental tail and cut on the documented END handoff.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to Shot008; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
