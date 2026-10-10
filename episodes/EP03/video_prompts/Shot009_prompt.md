# Shot009 Seedance Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use any local path, source image, screenshot, storyboard note, or external reference at generation time.

The uploaded frames must remain physically integrated live-action imagery with shared scale, contact shadows, perspective, and lighting. Do not paste portraits onto a background. START, KEY, and END must be visibly different action states, not lighting, crop, or texture variants of one still.

Do not add a named character that is absent from the uploaded frames.

Target model: Seedance image-to-video
Language / audio: no spoken dialogue; natural cinematic sound only. Do not generate Chinese, Mandarin, subtitles, captions, or any visible text.

## Shot ID

Shot009

## Duration

10 seconds.

## Input Frame Contract

Use the uploaded START frame as the first-frame anchor: the party pauses at the monastery gate in rain.

Use the uploaded KEY frame as the mid-shot action peak: Catherine, Dimitri, female Byleth, and Ashe walk away from the monastery, with Church banners and stonework receding behind them.

Use the uploaded END frame as the final-frame target: the group is smaller on the wet road, the monastery is distant behind them, and the road ahead dissolves into border fog.

## Motion

Create a grounded departure shot. The squad starts from the gate pause, moves into the road-walk midpoint, then settles into the fog-road ending. Keep the movement quiet and weighty: wet boots on stone, cloaks and banners pulled by wind, fog slowly swallowing the road.

Do not add battle action, new characters, new props, speeches, or heroic posing. This is a transition from ordered monastery space into uncertain border fog.

## Camera

Wide cinematic pull-back. Let the characters become smaller relative to the environment as the monastery recedes. Preserve the same screen direction and geography established by the uploaded frames.

## Character Locks

Female Byleth must remain the academy-era female professor throughout: dark teal hair, black professor outfit, restrained posture, no male Byleth, no gender drift, no war-phase redesign.

Dimitri and Ashe remain academy-era Blue Lions students. Catherine remains the controlled Church knight in armor. Keep the party count to these four visible named characters.

## Audio

Marching footsteps, wet stone, wind, cloth movement, and a fading monastery bell. No spoken dialogue or voiceover.

## Reject If

- Byleth becomes male, anonymous, older, war-phase, or visually inconsistent between START, KEY, and END.
- START, KEY, and END collapse into a static repeated pose instead of gate pause to road walk to fog-road exit.
- The shot adds subtitles, captions, readable text, game UI, dialogue boxes, tactical grids, watermarks, logos, or borders.
- The shot adds Chinese or Mandarin voiceover, any spoken line, or an offscreen narrator.
- The shot becomes a combat beat, Lonato scene, execution, triumphal march, or cheerful academy moment.

## Audio lock

No spoken dialogue in this shot. Use only the environmental sounds specified by the shot beat. Do not invent narration, voiceover, subtitles, captions, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot009

## Duration

Duration: 10 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot009 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for the next shot.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot009 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
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

- Receive the visible state in the uploaded START and hand the visible END state to the next shot; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
