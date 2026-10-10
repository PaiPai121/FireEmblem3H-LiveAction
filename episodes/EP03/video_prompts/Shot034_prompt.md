# Shot034 Video Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use local paths, screenshots, source images, prior frame sets, or alternate candidates at video generation time. The three frames must be physically integrated live-action imagery with shared scale, perspective, contact shadows, and practical light; never paste a portrait onto a background.

The staging discipline comes from public professional feature-film and animation storyboard/layout practice: establish geography, motivate camera movement, show a physical verb before a facial reaction, and make one focal signal readable in each state. Do not imitate any particular film, director, artist, or local package. Local selected assets constrain identity, wardrobe, props, and location only.

Target: Seedance image-to-video, 16:9, cinematic live-action academy drama. Spoken language is Japanese only where dialogue is declared below. No Chinese or Mandarin voiceover. No subtitles, captions, dialogue boxes, UI, watermarks, logos, or readable text.

## Shot ID

Shot034

## Duration

12.6 seconds. Animate START -> KEY -> END as three distinct blocking states, not crop, color, or lighting variants of one pose.

## Input Frames

Upload the three declared image anchors as separate inputs: START / start_frame, KEY / key_frame, and END / end_frame. START establishes the opening geography and physical task; KEY is the action peak or decision; END is the changed state handed to the next cut. Do not substitute a contact sheet, screenshot, local path, or alternate candidate.

- START / start_frame: Ashe has just stopped at the left side of the cloister; Catherine is crouched by the right column with one sheathed Thunderbrand and its cloth wrap; female Byleth is in the rear arch.
- KEY / key_frame: Catherine finishes the wrap at knee height as Ashe stops at respectful distance and asks; Byleth begins to clear the rear arch.
- END / end_frame: Catherine stands and faces Ashe with the sheathed weapon low; Ashe keeps his bow down; Byleth has entered the clear right exit lane.

## Scene

Ashe reaches the cloister after the students split. Catherine is finishing the practical maintenance of her weapon after the battlefield; Byleth passes through the far arch.

Story purpose: Give Catherine's faith a physical, controlled action and preserve Ashe's respectful distance from the relic weapon.

Visible named performers: academy Catherine, academy Ashe, female academy Byleth. Do not add a named performer absent from this list. Exactly three named performers. Catherine owns the right side, Ashe stays left at conversational distance, and female Byleth remains in the far exit lane.

## Motion and action chain

0-4s: START receives the right-corridor movement. Ashe stops at the left edge of a wet strip; Catherine is crouched by the right column with one sheathed Thunderbrand and its dark wrap; female Byleth is in the rear arch. 4-8s: Catherine finishes retieing the scabbard wrap at knee height. Ashe takes one respectful step to the edge of the wet strip and asks whether she has never doubted; his bow stays down. Byleth clears the far arch. 8-11.7s: Catherine rises with the sheathed weapon still low and answers once in Japanese, facing Ashe without aggression. 11.7-12.6s: Ashe absorbs the answer, and Byleth enters the clear right exit lane toward the night cut.

## Camera

Motivated 16:9 live-action medium-wide on one cloister axis. Start on the three depth marks, ease closer only for the hands wrapping the scabbard, then open slightly to keep the right exit lane. No symmetrical conversation tableau and no weapon glamour shot.

## Performance and identity

Catherine is tired, certain, and practical, never a cruel caricature. Ashe is morally unsettled but does not cross sword distance; his bow remains safely lowered. Female Byleth is silent, female academy identity only, and exits behind them. One sheathed Thunderbrand is the only weapon in the scene; no blade is drawn.

## Audio

Wet boots, cloth tightening around leather scabbard, quiet cloister rain residue, and Catherine's exact Japanese line only.

## Dialogue Timing / Delivery

Line ID DL-EP03-034-1. Catherine speaks once in Japanese: 私はレア様を信じている。迷いは、まだ決められない者に任せる。 Shot-local speech window 8.10-11.70s; speech_seconds 3.60s; let the final syllable and cloister reverb settle before the 11.7-12.6s exit tail. repeat_policy: no_repeat; no added reply, subtitles, or non-Japanese voice.

Delivery lock: use one single continuous utterance where speech exists; do not repeat, no stutter, no duplicated syllables. Respect the declared speech end and cut timing; silent shots contain no invented speech.

## Continuity locks

- Receive Shot033's rightward corridor eyeline and keep Byleth far behind Ashe/Catherine.
- Keep Catherine's single Thunderbrand sheathed, wrapped, and low; correct relic silhouette only.
- Ashe never enters Catherine's sword distance and never raises the bow.
- END leaves the right exit lane open for Shot035's night walk; Dimitri and Felix do not return.
- Monastery cloister reference constrains columns, wet stone, and exit geography only.

## Reject if

- Thunderbrand is generic, drawn, duplicated, or replaced by a polearm
- Ashe closes into sword distance
- Catherine and Ashe become a symmetrical two-shot
- Byleth becomes male or a fourth performer enters
- the wrap action is missing
- the frame is a game screenshot, 3D render, anime illustration, poster lineup, pasted cutout, or portrait collage
- START, KEY, and END collapse into one pose or only change lighting/crop
- Chinese/Mandarin speech, subtitles, captions, UI, readable text, borders, or watermarks appear

## Uploaded frame roles

- START: Ashe has just stopped at the left side of the cloister; Catherine is crouched by the right column with one sheathed Thunderbrand and its cloth wrap; female Byleth is in the rear arch.
- KEY: Catherine finishes the wrap at knee height as Ashe stops at respectful distance and asks; Byleth begins to clear the rear arch.
- END: Catherine stands and faces Ashe with the sheathed weapon low; Ashe keeps his bow down; Byleth has entered the clear right exit lane.

Keep monitor_required until prompt-against-frame QA, strict adjacent continuity QA, and a real 3-second motion probe pass. Still-frame review does not approve video motion or native audio.

