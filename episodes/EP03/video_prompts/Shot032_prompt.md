# Shot032 Video Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use local paths, screenshots, source images, prior frame sets, or alternate candidates at video generation time. The three frames must be physically integrated live-action imagery with shared scale, perspective, contact shadows, and practical light; never paste a portrait onto a background.

The staging discipline comes from public professional feature-film and animation storyboard/layout practice: establish geography, motivate camera movement, show a physical verb before a facial reaction, and make one focal signal readable in each state. Do not imitate any particular film, director, artist, or local package. Local selected assets constrain identity, wardrobe, props, and location only.

Target: Seedance image-to-video, 16:9, cinematic live-action academy drama. Spoken language is Japanese only where dialogue is declared below. No Chinese or Mandarin voiceover. No subtitles, captions, dialogue boxes, UI, watermarks, logos, or readable text.

## Shot ID

Shot032

## Duration

11.5 seconds. Animate START -> KEY -> END as three distinct blocking states, not crop, color, or lighting variants of one pose.

## Input Frames

Upload the three declared image anchors as separate inputs: START / start_frame, KEY / key_frame, and END / end_frame. START establishes the opening geography and physical task; KEY is the action peak or decision; END is the changed state handed to the next cut. Do not substitute a contact sheet, screenshot, local path, or alternate candidate.

- START / start_frame: Seteth places the closed folio on a stone rail while Rhea stands in profile and Byleth holds low below the altar.
- KEY / key_frame: Rhea's palm closes the folio and her raised hand stops the room; Seteth waits one step below and Byleth's eyes lift.
- END / end_frame: Rhea has turned away, Seteth takes the first step down, and Byleth steps backward toward the side door with the consequence understood.

## Scene

A tighter diagonal continuation of the report. The room remains serene while the decision becomes final through a small hand action.

Story purpose: Separate the final order from Shot031's report handoff and make its physical consequence visible in Byleth's retreat.

Visible named performers: Rhea, mature academy Seteth, female academy Byleth. Do not add a named performer absent from this list. Exactly three named performers. No student group, Catherine, Lonato, soldier, or extra speaker enters.

## Motion and action chain

0-3.5s: START holds a profile axis: Seteth places the closed folio on a stone rail; Rhea stands above and across the rail; female Byleth remains low below the altar, looking up. 3.5-7.5s: Rhea closes the folio firmly with her palm and raises one hand only as a quiet stop to debate. Seteth waits one step below; Byleth's eyes lift, then her weight shifts back toward the side door. 7.5-10.65s: Rhea speaks once in Japanese without pointing, smiling, or theatrical pause. 10.65-11.5s: Rhea turns away toward the altar, Seteth takes the first step down with the folio, and Byleth steps backward toward the students' corridor.

## Camera

Use a diagonal profile medium shot with a visible stone rail and lower-to-upper axis. Move only enough to read the palm closing the folio and Byleth's retreat; do not repeat Shot031's front-facing handoff, and do not use an exaggerated close-up.

## Performance and identity

Rhea is gentle but final, a procedure carried by certainty. Mature Seteth is attentive administrative duty. Female Byleth is grounded, female academy identity only, and receives the order through a small change of weight and eyeline. No one salutes, points aggressively, or performs magic.

## Audio

Folio cover against stone, quiet robe movement, small steps, distant bells, cathedral reverb, and Rhea's exact Japanese line only.

## Dialogue Timing / Delivery

Line ID DL-EP03-032-1. Rhea speaks once in Japanese: 反逆者は裁きを受けねばなりません。 Shot-local speech window 8.20-10.65s; speech_seconds 2.45s; let the final syllable and reverb settle before the 10.65-11.5s turn-away tail. repeat_policy: no_repeat; no added reply, subtitles, or non-Japanese voice.

Delivery lock: use one single continuous utterance where speech exists; do not repeat, no stutter, no duplicated syllables. Respect the declared speech end and cut timing; silent shots contain no invented speech.

## Continuity locks

- Receive Shot031's altar levels and closed report without resetting the room.
- Use the closed folio and palm as the single focal action; Byleth's backward step is the reaction.
- Keep Rhea, Seteth, and female Byleth in one physically integrated cathedral space.
- END sends Byleth toward the side corridor that becomes Shot033's reaction geography.
- The cathedral reference is architectural guidance only, never a local quality template.

## Reject if

- the action repeats Shot031's frontal handoff
- Rhea points, smiles like a villain, or becomes cartoonishly evil
- Byleth becomes male or disappears
- the order has no physical consequence
- the folio is duplicated or replaced by readable text
- the frame is a game screenshot, 3D render, anime illustration, poster lineup, pasted cutout, or portrait collage
- START, KEY, and END collapse into one pose or only change lighting/crop
- Chinese/Mandarin speech, subtitles, captions, UI, readable text, borders, or watermarks appear

## Uploaded frame roles

- START: Seteth places the closed folio on a stone rail while Rhea stands in profile and Byleth holds low below the altar.
- KEY: Rhea's palm closes the folio and her raised hand stops the room; Seteth waits one step below and Byleth's eyes lift.
- END: Rhea has turned away, Seteth takes the first step down, and Byleth steps backward toward the side door with the consequence understood.

Keep monitor_required until prompt-against-frame QA, strict adjacent continuity QA, and a real 3-second motion probe pass. Still-frame review does not approve video motion or native audio.

