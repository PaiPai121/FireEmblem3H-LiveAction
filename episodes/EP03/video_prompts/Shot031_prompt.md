# Shot031 Video Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use local paths, screenshots, source images, prior frame sets, or alternate candidates at video generation time. The three frames must be physically integrated live-action imagery with shared scale, perspective, contact shadows, and practical light; never paste a portrait onto a background.

The staging discipline comes from public professional feature-film and animation storyboard/layout practice: establish geography, motivate camera movement, show a physical verb before a facial reaction, and make one focal signal readable in each state. Do not imitate any particular film, director, artist, or local package. Local selected assets constrain identity, wardrobe, props, and location only.

Target: Seedance image-to-video, 16:9, cinematic live-action academy drama. Spoken language is Japanese only where dialogue is declared below. No Chinese or Mandarin voiceover. No subtitles, captions, dialogue boxes, UI, watermarks, logos, or readable text.

## Shot ID

Shot031

## Duration

13.4 seconds. Animate START -> KEY -> END as three distinct blocking states, not crop, color, or lighting variants of one pose.

## Input Frames

Upload the three declared image anchors as separate inputs: START / start_frame, KEY / key_frame, and END / end_frame. START establishes the opening geography and physical task; KEY is the action peak or decision; END is the changed state handed to the next cut. Do not substitute a contact sheet, screenshot, local path, or alternate candidate.

- START / start_frame: the five enter from the wet threshold in staggered depth; the door is still moving toward closed and Rhea waits above.
- KEY / key_frame: Seteth is one step down with the closed folio extended; Rhea steps down to receive it while Byleth, Dimitri, and Ashe stop below.
- END / end_frame: Rhea turns back toward the altar with the folio; Seteth remains between levels and the three students are left at the closed door with changed eyelines.

## Scene

The students cross back into the cathedral while mud and fatigue remain on their hems. The room's ritual order receives the battlefield report.

Story purpose: Make the report move through bodies and levels, not appear as a static ceremony.

Visible named performers: Rhea, mature academy Seteth, female academy Byleth, academy Dimitri, academy Ashe. Do not add a named performer absent from this list. Exactly five named performers. Rhea and Seteth occupy the altar levels; Byleth, Dimitri, and Ashe remain below with separated depth marks.

## Motion and action chain

0-4s: START begins with the cathedral door still swinging shut behind the students. They enter in a shallow diagonal with Byleth nearest the threshold, Dimitri one depth ahead, and Ashe off the center line; Rhea waits high near the altar and Seteth holds the closed folio. 4-9s: Seteth walks down one step to meet the returning group and extends the folio. Rhea descends one step, reaches across the level change, and receives it; the students stop below rather than forming a row. 9-12.5s: Rhea turns the folio in her hands and raises one calm hand as she speaks once in Japanese. 12.5-13.4s: Rhea turns back toward the altar with the folio, Seteth remains between levels, and the three students are left at the closed door with changed eyelines.

## Camera

Start in a wide 16:9 threshold view that makes the door, lower nave, altar steps, and damp hems legible. Travel gently with Seteth into the handoff, keeping the lower-to-upper power gradient. End with a slight hold on the separated levels; no centered lineup and no zoom-only transition.

## Performance and identity

Rhea is calm and institutional, neither apologetic nor villainous. Mature academy Seteth performs dutifully and must not look young or war-phase. Female Byleth is the only Byleth and stays grounded. Dimitri and Ashe absorb the institutional language through small eyeline and posture changes. All five share one cathedral floor, light, perspective, and contact shadows.

## Audio

Wet shoes, door wood settling, robe movement, a folio closing, distant bell resonance, cathedral reverb, and Rhea's exact Japanese line only.

## Dialogue Timing / Delivery

Line ID DL-EP03-031-1. Rhea speaks once in Japanese: ご苦労さまでした。あなた方は信仰の安寧を守りました。 Shot-local speech window 9.15-12.55s; speech_seconds 3.40s; let the final syllable and reverb settle before the 12.5-13.4s turn-away tail. repeat_policy: no_repeat; no stutter, paraphrase, added reply, subtitles, or non-Japanese voice.

Delivery lock: use one single continuous utterance where speech exists; do not repeat, no stutter, no duplicated syllables. Respect the declared speech end and cut timing; silent shots contain no invented speech.

## Continuity locks

- Receive Shot030's wet return route and preserve mud residue on academy hems.
- Keep Seteth mature academy and Rhea above the students without freezing them into a lineup.
- The folio is one physical object handed from Seteth to Rhea; no duplicate report.
- END leaves Rhea turned toward the altar and the students at the closed door for Shot032/033.
- Cathedral reference constrains architecture and elevation only, not a local visual template.

## Reject if

- the five form a ceremonial row
- Seteth reads young or war-phase
- the folio handoff is absent or duplicated
- the door and muddy threshold vanish
- Rhea performs broad villain emotion
- the frame is a game screenshot, 3D render, anime illustration, poster lineup, pasted cutout, or portrait collage
- START, KEY, and END collapse into one pose or only change lighting/crop
- Chinese/Mandarin speech, subtitles, captions, UI, readable text, borders, or watermarks appear

## Uploaded frame roles

- START: the five enter from the wet threshold in staggered depth; the door is still moving toward closed and Rhea waits above.
- KEY: Seteth is one step down with the closed folio extended; Rhea steps down to receive it while Byleth, Dimitri, and Ashe stop below.
- END: Rhea turns back toward the altar with the folio; Seteth remains between levels and the three students are left at the closed door with changed eyelines.

Keep monitor_required until prompt-against-frame QA, strict adjacent continuity QA, and a real 3-second motion probe pass. Still-frame review does not approve video motion or native audio.

