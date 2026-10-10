# Shot022 Seedance Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use a local path, screenshot, source image, or external reference at run time.

The uploaded frames are photographed live-action battlefield images with shared scale, wet-ground contact, practical armor and cloth, fog depth, and motivated overcast light. Preserve the physical scene. Do not turn the performers into portraits, a lineup, a game screenshot, or pasted cutouts. START, KEY, and END must be distinct action states.

Target model: Seedance image-to-video
Language / audio: Japanese spoken dialogue only; no Chinese or Mandarin voiceover; no burned-in subtitles or readable text.

## Shot ID and Duration

Shot022, 13 seconds.

## Duration

13 seconds. Animate the uploaded `start_frame`, `key_frame`, and `end_frame` states in order.

## Input Frames

### start_frame

START is the long-lens road-axis opening: Lonato is readable on the upper-left ridge, Ashe is on the lower-right near mark with his bow low, and Dimitri plus female Byleth are behind Ashe on a support line. Keep the muddy road and fog band between Ashe and Lonato.

### key_frame

KEY is one deliberate step by Ashe to the near edge of the negotiation line. Keep both performers' feet and the complete open road gap visible. Lonato remains 4–6 metres uphill with shield grounded and sword point down. Dimitri and female Byleth remain behind Ashe, not beside Lonato.

### end_frame

END is the respectful pause before refusal. Ashe opens one empty hand, bow still low; Lonato gives a restrained palm response without advancing. The road gap and rear control line remain visible. Do not push into a sword-distance two-shot.

## Scene Beat

Ashe asks Lonato to stop. The emotional tension comes from the distance, the road, and the fact that the students have chosen conversation before force.

## Characters

Keep exactly four named readable performers: academy Ashe, older white-haired armored Lonato, academy Dimitri, and female academy-era Byleth. Ashe is the only archer and owns the only wooden bow. Dimitri is blond, wears the bright royal-blue cape and high-collar navy uniform, and carries a sword, never a bow. Byleth remains a smaller rear authority figure, never a foreground opponent facing three people.

## Motion

Animate one grounded approach. START: Ashe breathes, lowers the bow, and shifts one controlled step forward while Dimitri and Byleth hold the rear control line. KEY: Ashe stops at the marked negotiation distance and speaks; Lonato watches with the sword low and shield grounded. END: Ashe opens one hand, Lonato answers with a small restraint gesture, and no one closes the road gap. No charge, attack, draw, arrow release, or weapon swing.

## Camera

Use a restrained 16:9 live-action long-lens progression: START wide, KEY medium-long with both pairs of feet and the central road visible, END medium-long/wide. Maintain Lonato left/uphill and Ashe right/nearer. Do not use a portrait crop, close face-to-face coverage, action-line flip, fisheye, whip-pan, or game camera.

## Performance

Ashe is frightened but composed, speaking from a respectful distance. Lonato is tired, principled, and wary, not a generic villain. Dimitri and Byleth watch the road and protect Ashe without stepping into sword range. Weapons stay low and bodies stay grounded in the same wet mud.

## Audio

Ashe, in Japanese: ロナート様、どうか止まってください。

Use only Japanese speech for the line above plus natural wind, wet boots, cloth, and distant fog-muted battle. No Chinese/Mandarin voiceover, subtitles, captions, or visible text.

## Continuity Locks

- Preserve the uploaded START/KEY/END identities, academy costumes, female Byleth, one bow, wet ridge, torn blue banner, and fog.
- Preserve a visible 4–6 metre road buffer between Ashe and Lonato in every state; neither is within sword reach.
- Keep Dimitri and Byleth behind Ashe as a control line, not beside Lonato as executioners.
- The END must hand the same left/uphill Lonato and right/nearer Ashe geography to Shot023.

## Reject If

- Ashe and Lonato become a close face-to-face or sword-distance conversation
- Dimitri or Byleth appears beside Lonato, Dimitri gets a bow, or male Byleth appears
- Lonato raises/sweeps the sword, Ashe raises/fires the bow, or a charge begins
- a second Ashe-like archer, named extra, game UI, subtitles, borders, logos, Chinese/Mandarin voice, or readable text appears
- performers read as pasted plates, transparent cutouts, a flat lineup, or mismatched ground contact

## Audio lock

All spoken dialogue must remain Japanese only, using the single line declared in the Audio section above. Do not generate Chinese or Mandarin voiceover. Do not burn in subtitles, captions, dialogue boxes, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot022

## Duration

Duration: 13 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot022 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for Shot023.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot022 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (the established shot location), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Japanese spoken dialogue only for the exact line(s) already present in this shot's Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.

## Dialogue Timing / Delivery

- `line_id`: `DL-EP03-022-1`; Ashe owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 5.04-12.12s; speech_seconds: 7.08s; listener reaction ends at 12.47s.
- `speaker_handoff`: Ashe speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 12.47s.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to Shot023; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
