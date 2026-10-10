# Shot021 Image-to-Video Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use any local path, source image, screenshot, storyboard note, or external reference at generation time.

The uploaded frames must remain physically integrated live-action imagery with shared scale, contact shadows, perspective, and lighting. Do not paste portraits onto a background. START, KEY, and END must be visibly different action states, not lighting, crop, or texture variants of one still.

Do not add a named character that is absent from the uploaded frames.

Target: Seedance image-to-video, 11.7 seconds, cinematic live-action fantasy drama, 16:9.

## Shot ID

Shot021

## Duration

11.7 seconds.

## Input Frames

Upload exactly three images and label them `START`, `KEY`, and `END`.

- `START frame` is the distant silhouette before recognition.
- `KEY frame` is Lonato's reveal and the shared hesitation.
- `END frame` is Ashe stepping into the road for the next cut.

Use only the uploaded START, KEY, and END images as visual anchors for identity, wardrobe, geography, camera axis, lighting, and continuity. Do not add a different location, costume, weapon, named character, or prop.

## Scene Beat

Lonato appears through the fog, transforming the rebel line into Ashe's father figure. The dramatic force is recognition and moral restraint, not triumph or execution.

Only Lonato, Ashe, Dimitri, a few indistinct distant rebels, and the torn banner are present. Lonato is an older white-haired knight with a weathered face, practical heavy armor, shield, and lowered sword. Ashe and Dimitri remain youthful academy-era students. Keep all three at believable shared scale with wet hems, breathing, contact shadows, and real depth.

## Motion

- 0.0-3.2s: Begin on START. Use a restrained long-lens push through fog. Ashe and Dimitri take cautious half-steps on the near road, both looking toward the small silhouette; their body language is different, with Ashe pulled forward and Dimitri assessing the danger.
- 3.2-6.5s: Move toward KEY as Lonato advances from the fog to the ridge. Keep his sword lowered and his shield practical, never a hero pose. Ashe makes one involuntary half-step; Dimitri crosses one hand into Ashe's path without grabbing or attacking.
- 6.5-10.75s: Continue the recognition beat. Let fog drift, banner cloth pull in the wind, and faces change through breath and eyeline rather than exaggerated reactions. No charge, sword swing, or new combat beat.
- 10.75-11.7s: Move toward END. Ashe completes one step into the center of the muddy road. Lonato turns slightly toward him and opens one hand while keeping the sword low. Dimitri shifts half a step behind Ashe, leaving a clear path. Keep the tail alive with rain, cloth, breath, and small stance adjustments; do not freeze, loop, or cut to a different event.

## Performance

Lonato is restrained and tired, not theatrical. Ashe's recognition pulls him forward before he can control it; Dimitri checks the lane without grabbing or attacking. Keep the three performers physically grounded and let eyelines, breath, and small stance changes carry the pressure.

## Camera

Long-lens frontal observation with a small forward drift. Preserve the fog ridge axis and the START-to-KEY-to-END change of distance. No spin, orbit, fisheye, crash zoom, action-line reversal, or artificial shake.

## Audio

Lonato speaks in Japanese: "どけ。子供たちと戦うつもりはない。" Use Japanese speech only, with rain, boots in mud, armor and bow movement, banner cloth, breath, and low wind. No Chinese or Mandarin voiceover. No burned-in subtitles, captions, UI, or readable text.

## Continuity Locks

- Preserve the uploaded START frame's distant silhouette, the KEY frame's readable Lonato recognition, and the END frame's Ashe step into the road.
- Keep Lonato older, white-haired, armored, and visibly distinct from the academy students; keep Ashe and Dimitri academy-era and youthful.
- Maintain the same muddy ridge, fog depth, torn banner, lower/right to upper/left road axis, lowered weapons, and non-graphic restraint.
- Do not let Dimitri repeat the KEY check in END; he shifts behind Ashe while Lonato yields the line.
- No Byleth, Catherine, Rhea, or other named character enters this shot.

## Reject If

Reject the result if Lonato becomes a generic raider, a young man, or a superhero; if Ashe or Dimitri becomes adult or war-phase; if the trio becomes pasted cutouts or a static lineup; if Ashe attacks or executes Lonato; if a new named character, gore, game UI, subtitles, text, modern object, or extra weapon appears; or if START/KEY/END collapse into the same still image.

## Audio lock

All spoken dialogue in this shot must be Japanese only, using the exact Japanese line(s) already specified by the shot beat. Do not generate Chinese or Mandarin voiceover. Do not burn in subtitles, captions, dialogue boxes, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot021

## Duration

Duration: 11.7 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot021 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for the next shot.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot021 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (the established shot location), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Japanese spoken dialogue only for the exact line(s) already present in this shot's Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.

## Dialogue Timing / Delivery

- `line_id`: `DL-EP03-021-1`; Lonato owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 4.48-10.78s; speech_seconds: 6.30s; listener reaction ends at 11.65s.
- `speaker_handoff`: Lonato speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 11.65s.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to the next shot; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
