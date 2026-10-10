# Shot023 Seedance Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors. Do not use a local path, screenshot, source image, or external reference at run time. Preserve photographed live-action materials, shared scale, contact shadows, and real fog depth. START, KEY, and END must be distinct states, not a crop or lighting variant.

Target model: Seedance image-to-video
Language / audio: Japanese spoken dialogue only; no Chinese or Mandarin voiceover; no burned-in subtitles or readable text.

## Shot ID and Duration

Shot023, 13 seconds.

## Duration

13 seconds. Animate the uploaded `start_frame`, `key_frame`, and `end_frame` states in order.

## Input Frames

### start_frame

START receives the respectful pause from Shot022. Lonato remains left/uphill and Ashe right/nearer, with a clearly visible muddy road and fog band between them.

### key_frame

KEY is a medium-long refusal, not a close two-shot. Keep both performers' feet and the 4–6 metre gap visible. Lonato gives one restrained open-palm gesture, shield grounded and single sword point down. Ashe listens with the bow slack and low.

### end_frame

END pulls back without changing the axis. Lonato turns toward indistinct rebel pressure on the upper-left ridge while Ashe stays at the right/nearer mark. The road buffer remains open for Byleth's rear command.

## Scene Beat

Lonato refuses Ashe's plea. The scene should hurt because the two men can see one another across open ground, not because they have stepped into a duel.

## Characters

Keep exactly two named readable performers: older white-haired armored Lonato and academy Ashe. Indistinct rebels may remain deep in fog only. No Byleth, Dimitri, Catherine, Felix, Dedue, Mercedes, Ingrid, Rhea, horse, or named extra enters.

## Motion

Animate one continuous refusal. START: both hold their marks and breathe. KEY: Lonato turns his face, gives the restrained palm gesture, and keeps shield and sword low; Ashe stays still and listens. END: Lonato turns his shoulders toward the distant rebel pressure while Ashe tracks him with his eyes. No advance, attack, raised bow, sword swing, or crowd rush.

## Camera

Use a 16:9 live-action long-lens progression: wide silence, medium-long refusal with full road gap, wider tactical turn. Hold Lonato on the left/uphill side and Ashe on the right/nearer side. No close face-to-face coverage, axis reversal, mirror, spin, fisheye, whip-pan, game camera, or poster crop.

## Performance

Lonato is older, burdened, and morally certain without becoming theatrical. Ashe is shaken but respectful. Let eyes, breath, hand tension, shield weight, and wet clothing carry the scene. Both actors remain physically grounded in one location.

## Audio

Lonato, in Japanese: 問われぬ罪は、聖なる名の陰に隠されるだけだ。

Use Japanese speech only for the line above plus wind, distant rebel movement, wet boots, and restrained armor. No Chinese/Mandarin voiceover, subtitles, captions, or visible text.

## Continuity Locks

- Preserve the uploaded left/uphill Lonato and right/nearer Ashe axis.
- Preserve a visible 4–6 metre road buffer in START, KEY, and END; do not imply that nearby students can reach Lonato instantly.
- Keep Lonato's one shield and one low sword, Ashe's one slack low bow, academy age, fog, wet mud, and contact shadows.
- END must hand to Shot024 without a sudden retreat from a close conversation.

## Reject If

- KEY becomes a sword-distance face-to-face shot or crops away the central gap
- the axis reverses, either character advances, Lonato attacks, Ashe draws/fires, or rebels become readable named faces
- any absent named character, horse, UI, subtitles, borders, logos, Chinese/Mandarin voice, or readable text appears
- performers read as pasted plates, a game screenshot, a flat lineup, or mismatched ground contact

## Audio lock

All spoken dialogue must remain Japanese only, using the single line declared in the Audio section above. Do not generate Chinese or Mandarin voiceover. Do not burn in subtitles, captions, dialogue boxes, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot023

## Duration

Duration: 13 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot023 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for Shot024.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot023 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (the established shot location), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Japanese spoken dialogue only for the exact line(s) already present in this shot's Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.

## Dialogue Timing / Delivery

- `line_id`: `DL-EP03-023-1`; Lonato owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 5.04-12.12s; speech_seconds: 7.08s; listener reaction ends at 12.47s.
- `speaker_handoff`: Lonato speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 12.47s.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to Shot024; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
