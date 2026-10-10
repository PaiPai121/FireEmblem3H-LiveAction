# Shot008 Seedance Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, Thunderbrand design, and the action chain. Do not use any local path, source image, screenshot, storyboard note, or external reference at generation time.

The uploaded frames must remain one physically integrated live-action scene with shared scale, contact shadows, rain-wet stone, perspective, and practical lighting. Do not paste portraits onto a background. START, KEY, and END must be different physical states, not lighting, crop, or texture variants of one still.

Do not add a named character that is absent from the uploaded frames.

## Shot ID

Shot008

## Duration

11 seconds.

## Scene Beat

Catherine joins the group before the first mission.

## Adjacent continuity context

Shot007 END places female Byleth and Ashe on the right side of the same wet courtyard, turning toward the open arch at screen-left. Catherine enters from that exact side at START. Do not begin with Catherine already posed in front of the group.

Shot009 START reverses the courtyard angle for the monastery departure. End with Catherine ahead of the students and the group oriented toward the gate; do not jump to the road during this shot.

## Cast and identity

Catherine is an adult blond Church knight in mature white armor, controlled and authoritative. Female Byleth is the adult woman with dark teal hair and black professor coat. Ashe is the silver-blond academy archer in blue-and-cream uniform. Preserve academy-age Blue Lions in the soft background. Keep faces, hair, armor topology, wardrobe, gender presentation, and scale stable across all uploaded frames.

Catherine's unique weapon is the sheathed Thunderbrand Hero Relic: a jagged pale blade with an ornate gold guard and purple crest stone. Keep it attached to her hip under a dark cloth wrap. It may be revealed by the moving cloth and a brief hand near the scabbard, but it must not glow, be drawn, float, turn into a generic sword, or become a weapon advertisement.

## Motion

0-3.2s: Begin on START. Continue directly from Shot007. Catherine crosses the left arch threshold into the wet courtyard; the Blue Lions remain on the right and finish turning toward her. Keep the Thunderbrand guard visible at her hip and keep her armor weight grounded.

3.2-7.2s: Travel with Catherine as she crosses two steps through the group. Use KEY as the movement peak: she turns her head toward female Byleth and Ashe, one gloved hand rests near the sheathed Thunderbrand, and the cloth shifts enough to show the jagged gold guard and purple crest stone. Byleth and Ashe track her with their eyes; do not create a lineup or a sword draw.

7.2-11s: Move into END. Catherine stops ahead of Byleth and Ashe, turns back toward them, and delivers once in Japanese: 霧の中では、私から離れすぎるな。 Ashe holds her eyeline; female Byleth remains clearly readable behind him. End with Catherine leading the group's direction toward the monastery gate for Shot009.

## Camera

Use a low tracking shot into a medium close shot with motivated movement, realistic armor and cloth inertia, wet-floor reflections, and a restrained live-action lens. Do not use a heroic weapon push-in, camera spin, fisheye, or static zoom.

## Audio

Catherine speaks only the exact Japanese line above. Add armor articulation, cloth drag, wet footsteps, rain, lantern glass, and courtyard tone. Use Japanese speech only; no Chinese or Mandarin voiceover. No burned-in subtitles, captions, readable text, dialogue boxes, or UI.

## Continuity locks

- Preserve the uploaded START frame's left-arch entrance and right-side Byleth/Ashe eyeline.
- Match one wet monastery courtyard, grey rain haze, blue banners, and academy wardrobes through all three frames.
- Keep female Byleth's canonical face, gender presentation, and professor coat.
- Keep Catherine mature, armored, and in control; keep Thunderbrand sheathed, attached, jagged, gold, and purple-crested.
- End on the gateward direction needed for Shot009.
- Keep combat, gore, Lonato, battlefield action, and road travel out of Shot008.

## Reject If

- Catherine teleports into a front-facing lineup or reverses Shot007's entrance direction
- Thunderbrand becomes a generic sword, wrong relic, plain scabbard, floating prop, drawn blade, glow effect, or advertisement
- Byleth becomes male or ambiguous, or academy students age into war phase
- the shot jumps to the road, battlefield, or Catherine combat
- the exact Japanese line is replaced by Chinese/Mandarin speech
- subtitles, captions, readable text, dialogue boxes, UI, watermark, or borders appear
- START, KEY, and END collapse into one still

## Audio lock

All spoken dialogue in this shot must be Japanese only, using the exact line specified above. Do not generate Chinese or Mandarin voiceover. Do not burn in subtitles, captions, dialogue boxes, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot008

## Duration

Duration: 11 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot008 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for Shot009.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot008 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (the established shot location), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Japanese spoken dialogue only for the exact line(s) already present in this shot's Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.

## Dialogue Timing / Delivery

- `line_id`: `DL-EP03-008-1`; Catherine owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 4.20-10.10s; speech_seconds: 5.90s; listener reaction ends at 10.95s.
- `speaker_handoff`: Catherine speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 10.95s.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to Shot009; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
