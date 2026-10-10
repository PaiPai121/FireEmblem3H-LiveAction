# Shot019 Seedance Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use local paths, source screenshots, layout boards, or external references at generation time.

The uploaded frames are integrated live-action imagery with shared scale, contact shadows, perspective, wet mud, and fog depth. Do not paste portraits onto a background. START, KEY, and END are three action states, not lighting or crop variants.

Do not add a named character absent from the uploaded frames.

Target model: Seedance image-to-video
Language / audio: Japanese spoken dialogue and natural cinematic sound only; no Chinese/Mandarin voiceover; no burned-in subtitles.

## Shot ID

Shot019

## Duration

9.4 seconds.

## Input Frames

The current uploaded `start_frame`, `key_frame`, and `end_frame` images are the only hard visual anchors for this submission; label them START, KEY, and END.

START: Mercedes is left-midground walking uphill into the fog while guiding one indistinct exhausted civilian seen only from behind. Annette is in the near right foreground crossing into the road, lifting one hand to part a wet branch while moving. Keep the two women on different depth planes and leave the center lane readable.

KEY: Mercedes has receded farther uphill and continues guiding the indistinct civilian. Annette crosses the near center from right to left, physically pushing aside one wet branch and opening a narrow natural sightline through the fog. Preserve the practical body action and do not turn it into a spell spectacle.

END: Mercedes and the indistinct civilian are small in the upper-left fog. Annette remains at the right side after the clearing action, lowers her hand, and turns her shoulders toward the route. The central muddy road from foreground to fog is visibly empty and is the entrance path for Catherine in the next cut.

## Scene Beat

The rear line creates a safe route through the fog. Mercedes handles evacuation and Annette controls visibility with a small practical movement. The scene is tense and useful, not a three-person tableau or a magic showcase.

## Characters

Keep exactly two named performers: academy Mercedes in a pale mantle and academy Annette with red twin-tails. One indistinct exhausted civilian may remain a soft back-facing silhouette only. Do not introduce Ingrid or any other named character.

## Motion

Animate one continuous support action with visible displacement. START: Mercedes walks uphill and calls the civilian onward while Annette crosses the near plane and lifts one hand to the wet branch. KEY: Annette passes through the narrow gap, moving branch and shoulder through the sightline as natural mist shifts; Mercedes continues deeper into fog. END: Mercedes and civilian recede, Annette lowers her hand and turns toward the opened route, and the central road stays empty for the next cut. No beams, glyphs, explosions, flying debris, combat, or second spell.

## Camera

Use a restrained 16:9 diagonal tracking camera. START establishes Mercedes' receding depth and Annette's near crossing; KEY comes closer to the physical clearing action; END pulls back enough for the empty road to become the handoff. Maintain wet mud, stone walls, tree branches, moving hems, and fog layers. No spin, fisheye, whip-pan, artificial shake, portrait framing, or horizontal queue.

## Performance

Mercedes is focused and reassuring while walking, never smiling for camera. Annette is concentrated and slightly breathless as she clears the narrow sightline with her body and hand. Keep their eyelines separated by responsibility: Mercedes to the road and civilian, Annette to the branch and opening. The civilian remains secondary and indistinct.

## Audio

Mercedes, in Japanese: こちらです！
Annette, in Japanese: 道が見えた！

Use Japanese speech only. No Chinese or Mandarin voiceover. No burned-in subtitles or visible text.

## Continuity Locks

- Preserve wet mud, gray fog, ruined stonework, academy-era uniforms, and the support-line handoff from the uploaded frames.
- Keep exactly two named women and at most one indistinct back-facing civilian. Ingrid does not enter this shot.
- Mercedes remains the evacuation guide and Annette the practical visibility action in all states.
- Fog opens by restrained natural movement, never by a spectacle effect.
- START, KEY, and END must read as evacuation setup, narrow path opening, and clear-route handoff with real movement between them.

## Reject If

- Ingrid, Byleth, Felix, Ashe, Catherine, Rhea, Lonato, Dimitri, Dedue, another named student, or a duplicate woman enters
- the two women form a static row, lose their separate depth/action lines, or the center road is blocked at END
- Annette produces a beam, glowing circle, explosion, large wind blast, flying debris, or spectacle magic
- the civilian becomes named, sharply identifiable, bloody, or the emotional subject
- the clip adds UI, subtitles, borders, Chinese/Mandarin speech, readable text, pasted cutouts, floating feet, or missing contact shadows
- START, KEY, and END collapse into one pose or the route handoff is not visible

## Audio lock

All spoken dialogue in this shot must be Japanese only, using the exact Mercedes and Annette lines above. Do not generate Chinese or Mandarin voiceover. Do not burn in subtitles, captions, dialogue boxes, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot019

## Duration

Duration: 9.4 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot019 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for Shot020.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot019 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (the established shot location), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Japanese spoken dialogue only for the exact line(s) already present in this shot's Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.

## Dialogue Timing / Delivery

- `line_id`: `DL-EP03-019-1`; Mercedes owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 3.36-5.72s; speech_seconds: 2.36s; listener reaction ends at 6.07s.
- `speaker_handoff`: Mercedes speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 6.07s.
- `line_id`: `DL-EP03-019-2`; Annette owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 6.24-8.60s; speech_seconds: 2.36s; listener reaction ends at 8.95s.
- `speaker_handoff`: Annette speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 8.95s.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to Shot020; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
