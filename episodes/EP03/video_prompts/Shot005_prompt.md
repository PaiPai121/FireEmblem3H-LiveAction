# Shot005 Seedance Prompt

Target: Seedance image-to-video, 11.7 seconds, cinematic live-action academy support scene, 16:9.

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, classroom geography, academy wardrobes, bow continuity, and the door handoff. Do not add a named character or use a game screenshot as a frame.

Female Byleth is the adult woman with teal-blue hair and dark professor coat. Dimitri is the tall blond academy prince in blue. Ashe is the smaller blond academy archer with his bow and shoulder gear. Keep all three physically integrated into the same stone classroom with believable scale and contact shadows.
0-2.5s: Begin on START just after class. Ashe remains seated beside a desk with a closed book and bow within reach. Dimitri stands at the open doorway, turned toward the room. Female Byleth is near the teacher's desk, looking toward them. Two indistinct students leave in the distant corridor. Do not make a lineup.
2.5-5.5s: Move to KEY. Dimitri pulls the heavy door shut and keeps one hand on the latch while taking one deliberate step toward female Byleth. His eyes and torso address Byleth, not a window. Ashe turns from his desk and closes his book, surprised. Byleth looks between them and listens. Dimitri speaks once in Japanese: 先生、今日は彼と共に行かせてください。 No subtitles or text.
5.5-9s: Move into END. Ashe rises fully and reaches for the shoulder strap of his bow case. Female Byleth gives a small acknowledging nod and opens a clear path toward the door. Dimitri steps aside so Ashe can pass first. Let the doorway and empty corridor pull the camera forward into the next shot.

Use restrained support-theater timing, real chair and foot movement, book and bow weight, cloth drag, and a gentle motivated camera move. The line must cause the blocking change. Do not solve the shot with a static zoom, lighting-only change, or repeated three-person pose.
Use the Japanese line only, plus chair scrape, book cover, door latch, cloth, footsteps, and room tone. Reject if Dimitri looks out a window, if Ashe never rises, if the door never closes or opens as a path, if Byleth becomes male, if the cast becomes pasted cutouts, or if subtitles, readable text, UI, watermark, Chinese or Mandarin speech, or extra named characters appear.

## Audio lock

All spoken dialogue in this shot must be Japanese only, using the exact Japanese line(s) already specified by the shot beat. Do not generate Chinese or Mandarin voiceover. Do not burn in subtitles, captions, dialogue boxes, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot005

## Duration

Duration: 11.7 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot005 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for the next shot.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot005 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (classroom), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Japanese spoken dialogue only for the exact line(s) already present in this shot's Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.

## Dialogue Timing / Delivery

- `line_id`: `DL-EP03-005-1`; Dimitri owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 4.48-10.78s; speech_seconds: 6.30s; listener reaction ends at 11.13s.
- `speaker_handoff`: Dimitri speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 11.13s.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to the next shot; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
