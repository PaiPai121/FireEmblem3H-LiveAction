# Shot035 Video Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use local paths, screenshots, source images, prior frame sets, or alternate candidates at video generation time. The three frames must be physically integrated live-action imagery with shared scale, perspective, contact shadows, and practical light; never paste a portrait onto a background.

The staging discipline comes from public professional feature-film and animation storyboard/layout practice: establish geography, motivate camera movement, show a physical verb before a facial reaction, and make one focal signal readable in each state. Do not imitate any particular film, director, artist, or local package. Local selected assets constrain identity, wardrobe, props, and location only.

Target: Seedance image-to-video, 16:9, cinematic live-action academy drama. Spoken language is Japanese only where dialogue is declared below. No Chinese or Mandarin voiceover. No subtitles, captions, dialogue boxes, UI, watermarks, logos, or readable text.

## Shot ID

Shot035

## Duration

15 seconds. Animate START -> KEY -> END as three distinct blocking states, not crop, color, or lighting variants of one pose.

## Input Frames

Upload the three declared image anchors as separate inputs: START / start_frame, KEY / key_frame, and END / end_frame. START establishes the opening geography and physical task; KEY is the action peak or decision; END is the changed state handed to the next cut. Do not substitute a contact sheet, screenshot, local path, or alternate candidate.

- START / start_frame: Dimitri is already moving toward the night arch; female Byleth follows several paces behind with a clear wet corridor between them.
- KEY / key_frame: Dimitri stops, removes one glove, and presses his bare hand to the balustrade; Byleth stops under the lamp without touching him.
- END / end_frame: Dimitri resumes walking into the dark arch and becomes smaller; Byleth stays under the lamp and turns to watch.

## Scene

After Catherine's certainty, Dimitri makes his own moral thought physical in the night corridor.

Story purpose: Make Dimitri's dangerous self-reflection a walk, a brace, a line, and a deliberate departure.

Visible named performers: academy Dimitri, female academy Byleth. Do not add a named performer absent from this list. Exactly two named performers. Catherine and Ashe are gone; no third person enters.

## Motion and action chain

0-5s: START begins with Dimitri already walking toward a dark arch, several paces ahead. Female Byleth follows behind near a warm lamp and column; the wet corridor between them is empty and readable. 5-9.2s: Dimitri stops under a colder patch of moonlight, removes one glove, and presses his bare hand to the wet stone balustrade. Byleth stops two steps behind and does not touch him. 9.2-14.2s: Dimitri speaks once in Japanese while bracing on the stone; Byleth listens without interrupting. 14.2-15s: Dimitri resumes walking into the dark arch and becomes smaller. Byleth remains under the lamp and turns to watch him leave.

## Camera

Long-lens 16:9 live-action follow from the wide walking geography to the hand-to-stone action, then pull back so the final distance is visibly larger. Preserve moonlight direction, warm lamp, wet reflections, and a clear buffer. No spin, fisheye, or zoom-only transition.

## Performance and identity

Dimitri is the blond academy prince, troubled but controlled, with academy wardrobe and no war-phase aging. Female Byleth is the only Byleth, an adult woman with dark teal hair and black professor coat, silent and attentive. The glove removal, palm pressure, lowered head, and walk-away carry the emotion; no theatrical breakdown.

## Audio

Night rain residue, wet boots, glove against stone, damp cloth, quiet cloister room tone, and Dimitri's exact Japanese line only.

## Dialogue Timing / Delivery

Line ID DL-EP03-035-1. Dimitri speaks once in Japanese: 殺意が正義をまとえば、とても静かになるのですね。 Shot-local speech window 9.20-14.20s; speech_seconds 5.00s; let the final syllable and reverb settle before the 14.2-15s walk-away tail. repeat_policy: no_repeat; no added reply, subtitles, or non-Japanese voice.

Delivery lock: use one single continuous utterance where speech exists; do not repeat, no stutter, no duplicated syllables. Respect the declared speech end and cut timing; silent shots contain no invented speech.

## Continuity locks

- Receive Shot034's cleared right corridor as a night cloister walk; Catherine and Ashe do not return.
- Keep Dimitri ahead at START, braced at KEY, and farther away at END.
- Keep female Byleth consistent and physically separate; she never touches Dimitri.
- The hand-to-stone action is the focal peak, not a static conversation pose.
- Monastery cloister reference constrains stone, columns, and lamp geography only.

## Reject if

- the walk becomes a static two-shot
- Dimitri never removes the glove or presses the stone
- Byleth becomes male or war-phase
- the final distance is not larger
- a third performer or extra weapon enters
- the frame is a game screenshot, 3D render, anime illustration, poster lineup, pasted cutout, or portrait collage
- START, KEY, and END collapse into one pose or only change lighting/crop
- Chinese/Mandarin speech, subtitles, captions, UI, readable text, borders, or watermarks appear

## Uploaded frame roles

- START: Dimitri is already moving toward the night arch; female Byleth follows several paces behind with a clear wet corridor between them.
- KEY: Dimitri stops, removes one glove, and presses his bare hand to the balustrade; Byleth stops under the lamp without touching him.
- END: Dimitri resumes walking into the dark arch and becomes smaller; Byleth stays under the lamp and turns to watch.

Keep monitor_required until prompt-against-frame QA, strict adjacent continuity QA, and a real 3-second motion probe pass. Still-frame review does not approve video motion or native audio.

