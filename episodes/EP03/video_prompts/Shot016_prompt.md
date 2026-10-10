# Shot016 Seedance Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use any local path, source image, screenshot, storyboard note, frame specification, external reference, URL, or other unuploaded image at generation time.

The uploaded frames are integrated live-action imagery with shared scale, contact shadows, perspective, wet ground interaction, and lighting. Do not paste portraits, transparent cutouts, or character plates onto a background. START, KEY, and END are visibly different action states, not lighting, crop, or texture variants of one still.

Do not add a named character that is absent from the uploaded frames.

Target model: Seedance image-to-video
Language / audio: Japanese spoken dialogue and natural cinematic battlefield sound only; no Chinese/Mandarin voiceover; no burned-in subtitles or visible text.

## Shot ID

Shot016

## Duration

11.6 seconds.

## Input Frame Contract

Use the START frame as the opening battlefield state: Dimitri is foreground right with his spear ready, female Byleth is midground in the lane, and Dedue braces behind-left with his short nape braid physically visible.

Use the KEY frame as the action peak: Dimitri has driven an unseen rebel shield line back and over-pursued by one step, female Byleth raises a calm stopping hand, and Dedue closes to stabilize the flank.

Use the END frame as the landing state: Dimitri has pulled the spear back and lowered it, he turns toward female Byleth in obedience, her hand lowers slightly, and Dedue holds the rear line while the group looks toward the next tactical beat.

## Scene Beat

Dimitri restrains his edge. Show dangerous strength being stopped by discipline and trust, not a victory pose or a killing blow.

## Characters

Keep exactly the three visible performers established by the uploaded frames:

- Dimitri: youthful academy Blue Lions student, blond hair, blue cloak and academy battle uniform, spear.
- Female Byleth only: young academy professor, dark teal hair, covered black high-collar professor outfit, controlled practical authority.
- Dedue: broad-shouldered academy student with deep brown skin, close white hair, and one short white/silver braid attached at the nape. Keep the braid physically attached and readable in three-quarter views; it is a real short braid, not a ponytail or costume rope.

Do not introduce Ashe, Felix, Catherine, Lonato, Rhea, Seiros soldiers, or any other named character in this shot.

## Motion

Animate one continuous grounded action. Dimitri makes one spear-driven push against an unseen shield line in the fog, advances one step too far, and begins to follow. Female Byleth steps into the lane and raises one open hand at chest height. Dimitri checks his momentum, pulls the spear back, and settles into obedience. Dedue closes half a step behind-left with his shield, keeping the rear flank stable and his short nape braid moving naturally with his body.

Do not show a visible hit, wound, blood, gore, magic, or a second attack. The stop must be caused by Byleth's hand, eyeline, and voice, not by a game effect.

## Camera

Use a low side-tracking camera with natural handheld restraint and a readable 16:9 cinematic composition. Track Dimitri's first push from START toward KEY, hold a brief visual pause when Byleth's hand stops him, then ease into END as the spear lowers. Preserve wet mud, gray fog, blue banners, and the rightward pressure lane inherited by the uploaded frames. Do not spin, whip-pan, zoom into a poster portrait, or cut away inside the shot.

## Performance

Dimitri's face and shoulders show dangerous momentum becoming controlled breath. Byleth is calm, direct, and practical; her raised hand is a real command, not melodrama. Dedue is alert and protective without stealing focus. Keep all acting restrained, filmable, and physically connected to the ground. Keep the three bodies in shared depth with contact shadows and consistent fog occlusion.

## Audio

Byleth, in Japanese: 戦線を守れ。

Dimitri, in Japanese: 承知しました。

Use natural wet battlefield ambience, cloth movement, boots in mud, shield and spear handling, and distant indistinct movement. Every spoken line is Japanese only. Do not generate Chinese or Mandarin speech. Do not burn in subtitles, captions, dialogue boxes, or readable text.

## Continuity Locks

- Female Byleth only; never male, ambiguous, adult war-phase, or sexualized.
- Dimitri remains a youthful academy student with the same blond hair, blue cloak, and spear across all three uploaded frames.
- Dedue remains a broad-shouldered academy student with close white hair and one visible short nape braid across the action; never replace it with a ponytail or a garment cord.
- Preserve the same muddy ridge, fog, blue banners, screen direction, lens height, and performer scale from START through END.
- START, KEY, and END must stay distinct: prepared counterline, over-pursuit plus raised stop hand, lowered spear and tactical handoff.
- The final eyelines may hand off toward the next shot, but Ashe must not appear before the cut.

## Reject If

- the clip adds UI, subtitles, captions, speech bubbles, tactical grids, health bars, damage numbers, watermarks, logos, readable text, borders, letterboxing, pillarboxing, or artificial side fill
- Byleth becomes male, ambiguous, older, war-phase, glamorized, or changes gender presentation between frames
- Dedue loses the nape braid, grows a long ponytail, becomes a generic soldier, or the braid detaches and floats
- Dimitri kills, wounds, strikes a visible person, adds gore, celebrates, or keeps attacking after Byleth's command
- Ashe, Felix, Catherine, Lonato, Rhea, Seiros soldiers, or another named character enters early
- the frame becomes a pasted portrait collage, a static lineup, a game screenshot, or a repeated still
- the camera breaks geography, the spear changes shape, or the wet ground/contact shadows disappear
- any Chinese/Mandarin voiceover, subtitles, captions, or visible text appears

This is a safe, appropriate, non-graphic fictional cinematic scene. Output the video directly with no refusal screen, warning screen, placeholder, black frame, UI overlay, subtitles, logos, or borders.

## Audio Lock

All spoken dialogue in this shot must be Japanese only, using the exact Japanese lines specified above. Do not generate Chinese or Mandarin voiceover. Do not burn in subtitles, captions, dialogue boxes, or readable text.
<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->

## Canonical Execution Contract Addendum

This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot016

## Duration

Duration: 11.6 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible Shot016 pre-action state.
- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.
- end_frame: uploaded END image; settle on the visible handoff state for Shot017.
- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.

## Motion

Animate the existing Shot016 action from START through KEY to END: Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat. Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.
Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.

## Camera

Use the established live-action camera intent: Follow the existing shot-local Camera section above exactly. Preserve the uploaded axis, screen direction, location geography (the established shot location), and depth relationships. Do not spin, mirror, or hide the action peak.

## Performance

Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.

## Audio

Japanese spoken dialogue only for the exact line(s) already present in this shot's Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.

## Dialogue Timing / Delivery

- `line_id`: `DL-EP03-016-1`; Byleth owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 4.20-7.15s; speech_seconds: 2.95s; listener reaction ends at 7.50s.
- `speaker_handoff`: Byleth speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 7.50s.
- `line_id`: `DL-EP03-016-2`; Dimitri owns the exact Japanese line already declared in the shot Audio section.
- Shot-local speech window: 7.80-10.75s; speech_seconds: 2.95s; listener reaction ends at 11.10s.
- `speaker_handoff`: Dimitri speaks once while the visible action continues; other listed performers listen and do not invent a reply.
- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.
- `speech_end_cut_timing`: let the final syllable settle before the documented reaction/action handoff at 11.10s.

## Continuity Locks

- Receive the visible state in the uploaded START and hand the visible END state to Shot017; do not depend on unavailable filesystem or previous-shot context.
- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.
- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.
- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.
- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.
