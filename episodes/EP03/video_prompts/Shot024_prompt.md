# Shot024 Seedance Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, and action. Do not use a local path, screenshot, source image, or external reference at run time. Preserve integrated live-action scale, wet contact, practical lighting, and fog. START, KEY, and END must show three different action states.

Target model: Seedance image-to-video
Language / audio: Japanese spoken dialogue only; no Chinese or Mandarin voiceover; no burned-in subtitles or readable text.

## Shot ID and Duration

Shot024, 7.6 seconds.

## Duration

7.6 seconds. Animate the uploaded `start_frame`, `key_frame`, and `end_frame` states in order.

## Input Frames

### start_frame

START receives the wide Shot023 road. Lonato remains small and uphill left, Ashe remains near right with bow low, and female Byleth enters from the rear command pocket. Dimitri, Dedue, and Ingrid are separated in rear lanes.

### key_frame

KEY is Byleth's command from behind Ashe, not a confrontation with Lonato. Keep the road buffer visible. Byleth's sword tip indicates two empty flank lanes in the mud; it never points at a body. Dimitri, Dedue, and Ingrid read their separate routes.

### end_frame

END is the command settling, not a charge: Byleth retracts the sword and stops in the rear command pocket; Dimitri, Dedue, and Ingrid hold their separated marks while Ashe/Lonato remain far apart. The next cut shows the order's physical consequence from a diagonal blocked-crossing geography, with Byleth no longer visible. Do not complete the surround or expose a direct attack lane.

## Scene Beat

Byleth chooses to protect students and civilians and orders a controlled split of the guard. The order creates distance and containment, not an execution opportunity.

## Characters

Keep exactly six named readable performers: female academy-era Byleth, academy Ashe, older white-haired armored Lonato, academy Dimitri, academy Dedue with visible compact silver-white nape braid where the angle permits, and academy Ingrid. Wounded people and rebel pressure stay indistinct. Do not add Rhea, Catherine, Felix, Mercedes, Annette, Sylvain, or any named extra.

## Motion

Animate one grounded command. START: Byleth scans Ashe, the road edge, and distant Lonato from the rear. KEY: she turns her eyes and extends the sword tip low toward empty containment lanes, never toward a person. END: she retracts the blade and holds the command pocket while Dimitri/Dedue/Ingrid stop on separated marks; the next shot cuts to the off-screen execution of the order as a blocked crossing. Ashe keeps bow low; Lonato keeps shield and sword low. No charge, attack, arrow release, injury, or gore.

## Camera

Use 16:9 live-action road-axis coverage: wide observation, tactical medium-wide command, wider formation handoff. Keep Lonato left/uphill and Ashe right/nearer. Preserve the central road and real scale. No close sword-to-body frame, game-map aerial, poster lineup, spin, fisheye, whip-pan, or action-line reversal.

## Performance

Byleth is quiet, alert, and decisive. Dimitri, Dedue, and Ingrid respond with disciplined first steps, not a charge. Ashe is shaken but controlled. Lonato sees the order and remains principled and still. Keep female Byleth, academy age, Dedue's braid, weapons, wet cloth, feet, and shadows coherent.

## Audio

Byleth, in Japanese: 護衛を分断しろ。村道へ近づけるな。

Use Japanese speech only for the line above plus bootsteps, cloth, low armor, wind, and distant fog-muted movement. No Chinese/Mandarin voiceover, subtitles, captions, or visible text.

## Continuity Locks

- Preserve Shot023's road buffer, wet ridge, blue banner, fog, and Lonato-left/Ashe-right geography.
- Keep Byleth at least 3 metres behind Ashe and well short of Lonato; she is a command anchor, not an executioner.
- Keep Ashe's bow low, Lonato's shield grounded and sword low, and Dedue's braid visible where angle permits.
- END must establish a completed command, separated student marks, and the wet battlefield axis that Shot025 receives as a side-offset blocked crossing; Shot025 may remove Byleth from view and must not read as a direct approach.

## Reject If

- Byleth is close enough to Lonato to read as an immediate execution opportunity
- the sword points at a person, becomes a strike, or the order becomes a charge
- Ashe fires, Lonato attacks, Dimitri/Dedue/Ingrid arrive beside Lonato, or a named extra appears
- male/war-phase Byleth, missing Dedue braid, pasted plates, flat lineup, game UI, subtitles, Chinese/Mandarin voice, or readable text appears

## Audio lock

All spoken dialogue must remain Japanese only, using the single line declared in the Audio section above. Do not generate Chinese or Mandarin voiceover. Do not burn in subtitles, captions, dialogue boxes, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot024

## Duration

Duration: 7.6 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot024 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible command handoff before Shot025 cuts to its off-screen consequence, the blocked crossing.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot024 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (the established shot location), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Japanese spoken dialogue only for the exact line(s) already present in this shot's Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.

## Dialogue Timing / Delivery

- `line_id`: `DL-EP03-024-1`; Byleth owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 2.80-6.74s; speech_seconds: 3.94s; listener reaction ends at 7.09s.
- `speaker_handoff`: Byleth speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 7.09s.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to Shot025; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
