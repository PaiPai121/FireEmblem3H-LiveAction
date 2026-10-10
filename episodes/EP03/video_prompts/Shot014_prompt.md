# Shot014 Seedance Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use any local path, source image, screenshot, storyboard note, or external reference at generation time.

The uploaded frames must remain physically integrated live-action imagery with shared scale, contact shadows, perspective, and lighting. Do not paste portraits onto a background. START, KEY, and END must be visibly different action states, not lighting, crop, or texture variants of one still.

Do not add a named character that is absent from the uploaded frames.

Target model: Seedance image-to-video

## Shot ID

Shot014

## Duration

8 seconds.

## Input Frames

Use the generated start/key/end frames for Shot014 as hard visual anchors when available. Until then, use the source still, the frame spec, and the listed character/location assets as layout and continuity reference.

Scene beat: First arrow
Story purpose: Push the battle from hidden tension into an irreversible exchange.

Characters: Dedue, Dimitri
Reference assets:

## Motion

An arrow comes out of the fog and strikes a shield face; Dedue steadies the front line.

Movement must stay physically grounded and must preserve the start_frame to key_frame to end_frame action chain. Do not add new combat beats, new characters, or new props.

## Camera

High-speed insert where the sound arrives just before the image.

## Performance

Visible acting should serve the beat: Push the battle from hidden tension into an irreversible exchange.

Keep expressions restrained and filmable. Show hesitation, breath, eyeline, posture, and timing instead of exaggerated anime reactions.

## Audio

An arrow strikes a shield; Dedue gives one short breath. No spoken dialogue.

## Continuity Locks

- Preserve academy-phase Blue Lions uniforms and youthful student faces.
- Preserve female Byleth's academy-era professor face, dark teal hair, black professor outfit, restrained silhouette, and selected local asset identity.
- Preserve Rhea's serene institutional authority and Catherine's controlled knight presence.
- Preserve fog-field geography: Blue Lions line, Lonato ridge, village road protected from spillover.
- Keep Lonato principled and tragic, never a generic raider.
- Edit in: cut on Byleth hand signal
- Edit out: cut to advancing rebels

Motion risks to monitor: blood, lethal wound

## Reject If

- the clip adds UI, subtitles, captions, game dialogue boxes, damage numbers, or tactical grid overlays
- the clip adds graphic gore, modern objects, modern weapons, or war-phase costumes
- named character identity, age, uniform, weapon, gender presentation, or role drifts from the listed assets
- the shot changes the moral beat into triumphal violence
- Lonato becomes a generic raider or Ashe directly executes him

## Audio lock

No spoken dialogue in this shot. Use only the environmental sounds specified by the shot beat. Do not invent narration, voiceover, subtitles, captions, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot014

## Duration

Duration: 8 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot014 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for the next shot.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot014 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
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
