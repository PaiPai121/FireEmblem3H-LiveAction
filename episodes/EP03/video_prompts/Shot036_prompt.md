# Shot036 Video Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use local paths, screenshots, source images, prior frame sets, or alternate candidates at video generation time. The three frames must be physically integrated live-action imagery with shared scale, perspective, contact shadows, and practical light; never paste a portrait onto a background.

The staging discipline comes from public professional feature-film and animation storyboard/layout practice: establish geography, motivate camera movement, show a physical verb before a facial reaction, and make one focal signal readable in each state. Do not imitate any particular film, director, artist, or local package. Local selected assets constrain identity, wardrobe, props, and location only.

Target: Seedance image-to-video, 16:9, cinematic live-action academy drama. Spoken language is Japanese only where dialogue is declared below. No Chinese or Mandarin voiceover. No subtitles, captions, dialogue boxes, UI, watermarks, logos, or readable text.

## Shot ID

Shot036

## Duration

9.3 seconds. Animate START -> KEY -> END as three distinct blocking states, not crop, color, or lighting variants of one pose.

## Input Frames

Upload the three declared image anchors as separate inputs: START / start_frame, KEY / key_frame, and END / end_frame. START establishes the opening geography and physical task; KEY is the action peak or decision; END is the changed state handed to the next cut. Do not substitute a contact sheet, screenshot, local path, or alternate candidate.

- START / start_frame: female Byleth crosses the near chapel threshold with the sheathed Sword of the Creator low; Rhea is distant and turned toward the Holy Tomb; Sothis is absent.
- KEY / key_frame: Byleth stops and turns toward the bent candle flame; recognizable translucent Sothis resolves beside her in the air with no floor contact; Rhea stays distant.
- END / end_frame: Sothis recedes into a small field of motes as the cathedral darkens; Byleth remains grounded and Rhea never turns to speak.

## Scene

The human authority has left the frame. In a dark cathedral chapel, Byleth crosses a threshold and the inner voice takes shape without becoming a physical companion.

Story purpose: End on a concrete mystery action: Byleth stops, the candle bends, Sothis appears, then recedes before the cut to black.

Visible named performers: female academy Byleth, spectral Sothis, distant Rhea. Do not add a named performer absent from this list. Exactly three presences: grounded female Byleth, recognizable translucent Sothis without floor contact, and distant Rhea turned toward the Holy Tomb. Rhea does not approach or speak.

## Motion and action chain

0-3s: START shows female Byleth crossing the near chapel threshold with the sheathed Sword of the Creator held low at her side. Rhea remains a small turned-away figure toward the Holy Tomb; Sothis is absent. 3-6s: Byleth stops as a nearby candle flame bends against the still air and turns toward it. 5.4-8.4s: A recognizable translucent Sothis resolves beside Byleth in the air, not on the floor, and asks the exact Japanese question once. 8.4-9.3s: Sothis recedes into a small field of motes while Byleth remains grounded and Rhea never turns; the cathedral darkens into the cut to black.

## Camera

Long-lens 16:9 cathedral threshold view with a restrained push only after Byleth stops. Keep the Holy Tomb direction, the grounded foreground, the spectral negative space, and Rhea's distance readable. No lore montage, no green-effect close-up, no black border.

## Performance and identity

Female Byleth is grounded, alert, and female academy identity only. Sothis is recognizable through face, hair silhouette, and translucent suspended body, but has no floor contact and does not become a solid companion. Rhea remains distant, turned away, and silent. The Sword of the Creator is one sheathed prop at Byleth's side.

## Audio

Candle hush, cathedral reverb, a restrained spectral tonal shift, and Sothis's exact Japanese line only. No other voice.

## Dialogue Timing / Delivery

Line ID DL-EP03-036-1. Sothis speaks once in Japanese: そなたは、あの者を信じるのか？ Shot-local speech window 5.40-8.40s; speech_seconds 3.00s; let the final syllable and reverb settle before the 8.4-9.3s mote fade and cut to black. repeat_policy: no_repeat; no added Rhea voice, subtitles, or non-Japanese voice.

Delivery lock: use one single continuous utterance where speech exists; do not repeat, no stutter, no duplicated syllables. Respect the declared speech end and cut timing; silent shots contain no invented speech.

## Continuity locks

- Receive Shot035's isolated female Byleth under the lamp through a deliberate cathedral cut.
- Keep the Sword of the Creator sheathed, single, and physically held; no generic weapon replacement.
- Sothis appears only after the grounded stop and never gains floor contact.
- Rhea stays distant toward the Holy Tomb and never becomes a close speaker.
- Cathedral reference constrains the chapel axis only; no prior local frame is a quality or staging template.

## Reject if

- Sothis becomes solid or only a generic green flare
- Byleth becomes male, ambiguous, or duplicates
- Rhea approaches or speaks
- the Sword of the Creator is generic, duplicated, or floating
- the spectral reveal has no physical trigger
- the frame is a game screenshot, 3D render, anime illustration, poster lineup, pasted cutout, or portrait collage
- START, KEY, and END collapse into one pose or only change lighting/crop
- Chinese/Mandarin speech, subtitles, captions, UI, readable text, borders, or watermarks appear

## Uploaded frame roles

- START: female Byleth crosses the near chapel threshold with the sheathed Sword of the Creator low; Rhea is distant and turned toward the Holy Tomb; Sothis is absent.
- KEY: Byleth stops and turns toward the bent candle flame; recognizable translucent Sothis resolves beside her in the air with no floor contact; Rhea stays distant.
- END: Sothis recedes into a small field of motes as the cathedral darkens; Byleth remains grounded and Rhea never turns to speak.

Keep monitor_required until prompt-against-frame QA, strict adjacent continuity QA, and a real 3-second motion probe pass. Still-frame review does not approve video motion or native audio.

