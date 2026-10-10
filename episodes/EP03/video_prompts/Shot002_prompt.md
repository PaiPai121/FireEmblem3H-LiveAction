# Shot002 Seedance Prompt

Target: Seedance image-to-video, 10 seconds, cinematic live-action monastery transition, 16:9.

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for the female professor's identity, academy wardrobe, monastery geography, screen direction, weather, and doorway continuity. Do not use a game screenshot as a frame and do not invent a different cast.

This is a wet dawn at Garreg Mach. Female Byleth, the adult woman with teal-blue hair and dark professor coat, is the only named character. Church attendants and knights may remain indistinct background figures only.
0-3s: Begin on START with the high wide monastery view. Let the morning bell finish its resonance. Female Byleth enters from the lower left and takes two grounded steps onto the wet stone. In the far background, indistinct church personnel begin to gather under the arches; they do not pose for camera.
3-7s: Travel down to the uploaded KEY relationship and track laterally at shoulder height. Female Byleth walks through the arcade in profile. Her coat hem moves, her boots make contact with the wet floor, and columns briefly occlude and reveal her. Through the arches, the distant armored assembly becomes readable as a pressure behind her path.
7-10s: Move into END. Female Byleth reaches the council door, places one hand on the iron latch, and pushes it open. Warm interior light spills into the cold corridor as the heavy door crosses the frame. End on the threshold for a match cut into the council scene.

Keep the camera physically motivated by her walk. Preserve real reflections, scale, foot contact, damp air, cloth weight, and the START-to-KEY-to-END screen direction. No spoken dialogue in this shot. Use only the morning bell, wet footsteps, distant armor and muted movement, fabric, hinge strain, and room tone. No subtitles, captions, text, or UI.

Reject if female Byleth becomes male, ghostlike, adult-war-phase, or detached from the floor; if the distant figures become named characters or a posed line; if the camera only zooms between stills; if the doorway does not open; or if subtitles, dialogue, text, watermark, game UI, or spoken voice appears.

## Audio lock

No spoken dialogue in this shot. Use only the environmental sounds specified by the shot beat. Do not invent narration, voiceover, subtitles, captions, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot002

## Duration

Duration: 10 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot002 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for the next shot.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot002 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (monastery), and depth relationships. Do not spin, mirror, or hide the action peak.

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

- Receive the visible state in the uploaded START and hand the visible END state to the next shot; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
