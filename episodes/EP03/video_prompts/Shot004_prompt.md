# Shot004 Seedance Prompt

Target: Seedance image-to-video, 8.9 seconds, cinematic live-action academy drama, 16:9.

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for the three academy identities, cathedral side aisle, bow continuity, screen direction, and scale. Do not add a named character.

Visible cast: Ashe, female academy Byleth, and Dimitri. Ashe is the youthful blond academy archer with his bow and shoulder gear. Female Byleth is the adult woman with teal-blue hair and dark professor coat. Dimitri is the tall blond academy prince in blue. Integrate all three into the same stone floor and cathedral light.
0-2.2s: Begin on START. Ashe is several paces ahead, walking down the side aisle with his bow lowered. Female Byleth and Dimitri follow on a diagonal, not a line. Keep the emotional space ahead of Ashe open.
2.2-5.7s: Move to KEY. Ashe hears the report, stops, grips the strap at his shoulder, and turns his face just enough to recognize the name. Byleth and Dimitri slow behind him and direct their eyelines toward Ashe. The off-screen Seteth line is Japanese only: ロナート卿は、かつてアッシュを養子として迎えた人物だ。 The action peak is Ashe stopping and listening, not a dramatic cry.
5.7-8.9s: Move into END. Ashe takes a half-turn and starts walking again toward the next arch. Female Byleth opens one hand to give him the path. Dimitri stays in the near side of frame and watches Ashe leave. Let the empty corridor become the handoff to the next shot.

Use restrained support-theater timing, real foot contact, bow weight, cloth drag, and subtle facial reaction. Do not make the cast pose, do not use a static zoom, and do not cut the geography apart with a lighting-only transition. No subtitles, captions, readable text, or UI.
Reject if Ashe looks adult, if Byleth becomes male, if the bow changes into a sword, if all three form a lineup, if no one stops or leaves, or if text, subtitles, watermark, game UI, Chinese or Mandarin speech appears.

## Audio lock

All spoken dialogue in this shot must be Japanese only, using the exact Japanese line(s) already specified by the shot beat. Do not generate Chinese or Mandarin voiceover. Do not burn in subtitles, captions, dialogue boxes, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot004

## Duration

Duration: 8.9 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot004 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for the next shot.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot004 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (cathedral), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Japanese spoken dialogue only for the exact line(s) already present in this shot's Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.

## Dialogue Timing / Delivery

- `line_id`: `DL-EP03-004-1`; Seteth owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 3.36-8.08s; speech_seconds: 4.72s; listener reaction ends at 8.85s.
- `speaker_handoff`: Seteth speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 8.85s.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to the next shot; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
