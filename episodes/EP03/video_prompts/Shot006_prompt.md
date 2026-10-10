# Shot006 Seedance Prompt

Target: Seedance image-to-video, 13 seconds, cinematic live-action academy support scene, 16:9.

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, classroom doorway, screen direction, lighting, and action continuity. Do not use any local path, source image, screenshot, storyboard note, or external reference at generation time.

The uploaded frames must remain physically integrated live-action imagery with shared scale, contact shadows, perspective, and lighting. START, KEY, and END must be different physical states, not lighting or crop variants.

## Adjacent continuity context

Shot005 ends with Ashe crossing the classroom threshold while Dimitri holds the door and female Byleth remains inside. Match that exact exit direction, door axis, daylight, wardrobe, and momentum at the first frame. Do not reset Ashe to the window.

## Cast and choreography

Ashe is the youthful blond academy archer with bow and shoulder gear. Female Byleth is the adult woman with teal-blue hair and dark professor coat. Dimitri is the tall blond academy prince in blue. Keep all three grounded in the same doorway.

0-3s: Begin on START. Ashe is halfway through the open door, one foot in the corridor and one hand on the door edge. Dimitri holds the door from the room side. Female Byleth remains inside with her hand still open from letting Ashe pass. Continue the preceding movement; do not introduce a new location.

3-8s: Travel to KEY without reversing the axis. Ashe pauses at the threshold and turns his upper body back toward female Byleth while keeping one hand on the latch. Byleth takes one small step toward him. Dimitri keeps the door open and waits. Ashe speaks once in Japanese: 彼は、僕と弟妹に居場所をくれました。でも今の僕は、あなたの生徒です。 The action peak is the stop-and-turn during departure, not a window stare or posed conversation.

8-12s: Move into END. Ashe turns back to the corridor and crosses through. Dimitri follows one step behind and begins pulling the heavy door inward. Female Byleth stays inside and watches them leave. End on the corridor handoff for the next shot.

Use restrained support-theater timing, real foot contact, door weight, bow-case movement, cloth drag, and matching daylight. No subtitles, captions, readable text, dialogue boxes, or UI.

## Audio lock

Use Japanese for Ashe's line only. Add door hinge, footsteps, bow leather, cloth, and room tone. No Chinese or Mandarin voiceover. No burned-in subtitles or readable text.

## Reject conditions

Reject if the first frame reverses Shot005's exit, if Ashe returns to the window, if the door does not stay open for the stop-and-turn, if Byleth becomes male, if the bow changes or vanishes, if the people look pasted onto the room, or if START, KEY, and END collapse into one still.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot006

## Duration

Duration: 13 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot006 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for the next shot.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot006 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (the established shot location), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Japanese spoken dialogue only for the exact line(s) already present in this shot's Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.

## Dialogue Timing / Delivery

- `line_id`: `DL-EP03-006-1`; Ashe owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 5.04-12.12s; speech_seconds: 7.08s; listener reaction ends at 12.47s.
- `speaker_handoff`: Ashe speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 12.47s.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to the next shot; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
