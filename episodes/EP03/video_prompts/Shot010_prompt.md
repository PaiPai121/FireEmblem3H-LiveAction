# Shot010 Seedance Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use any local path, source image, screenshot, storyboard note, or external reference at generation time.

The uploaded frames must remain physically integrated live-action imagery with shared scale, contact shadows, perspective, and lighting. Do not paste portraits onto a background. START, KEY, and END must be visibly different action states, not lighting, crop, or texture variants of one still.

Do not add a named character that is absent from the uploaded frames.

Target model: Seedance image-to-video
Language / audio: Japanese spoken dialogue and natural cinematic sound only; no Chinese/Mandarin voiceover; no burned-in subtitles.

## Shot ID

Shot010

## Duration

10.9 seconds.

## Input Frame Contract

Use the uploaded START frame as the first-frame anchor: female Byleth, Dimitri, Dedue, and Ingrid enter the Magdred fog road and pause to assess the low visibility.

Use the uploaded KEY frame as the mid-shot action peak: the four-person party advances in two loose columns through mud, broken trees, and gray-white fog.

Use the uploaded END frame as the final-frame target: the party slows near the damaged village edge and a rough wooden sign, preparing the cut to the village sign.

## Motion

Create a cautious fog-road advance. Keep the party physically grounded: wet boots in mud, cloaks moving in wind, breath visible in cold fog, heads turning as they listen for hidden movement. The motion should move from cautious entry to deeper two-column advance to the village-sign cut-out.

Do not add combat, enemies, Lonato, Catherine, Ashe, extra students, new weapons, or heroic attack poses. This shot is about danger from limited visibility and possible misjudgment.

## Camera

Use long-lens compression so the road feels short and threat feels close. Preserve the screen direction from the uploaded frames and keep the four named characters readable despite the fog.

## Dialogue And Audio

Ingrid says in Japanese, restrained and tense: 「霧が濃すぎるわ。」

Dedue answers in Japanese, low and practical: 「足音を聞け。」

The final spoken syllable should land close to the END frame. Support the dialogue with wet footsteps, wind, distant smoke, and muffled environmental sound.

## Character Locks

Female Byleth remains the academy-era female professor throughout: dark teal hair, black professor outfit, restrained posture, no male Byleth, no gender drift, no war-phase redesign.

Dimitri remains the academy-era Blue Lions prince in blue cloak. Dedue remains the tall, broad, dark-skinned retainer in academy uniform, not a generic bald soldier. Ingrid remains the blonde academy-era Blue Lions student with composed alertness.

## Reject If

- Byleth becomes male, anonymous, older, war-phase, or visually inconsistent between START, KEY, and END.
- Dedue becomes a generic soldier, loses his broad retainer presence, or swaps identity with Dimitri.
- Ingrid becomes a fully armored knight, war-phase adult, or generic blonde extra.
- The shot adds Lonato, Ashe, Catherine, enemies, battle action, attacks, graphic gore, or victory posing.
- The shot adds subtitles, captions, readable text, game UI, dialogue boxes, tactical grids, watermarks, logos, borders, or black frames.
- The shot adds Chinese or Mandarin voiceover, mistranslates the Japanese lines, or adds extra narration.

## Audio lock

All spoken dialogue in this shot must be Japanese only, using the exact Japanese line(s) already specified by the shot beat. Do not generate Chinese or Mandarin voiceover. Do not burn in subtitles, captions, dialogue boxes, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot010

## Duration

Duration: 10.9 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot010 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for the next shot.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot010 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (the established shot location), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Japanese spoken dialogue only for the exact line(s) already present in this shot's Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.

## Dialogue Timing / Delivery

- `line_id`: `DL-EP03-010-1`; Ingrid owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 3.92-6.68s; speech_seconds: 2.76s; listener reaction ends at 7.03s.
- `speaker_handoff`: Ingrid speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 7.03s.
- `line_id`: `DL-EP03-010-2`; Dedue owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 7.28-10.04s; speech_seconds: 2.76s; listener reaction ends at 10.39s.
- `speaker_handoff`: Dedue speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 10.39s.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to the next shot; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
