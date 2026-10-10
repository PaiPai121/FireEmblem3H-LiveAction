# Shot025 Video Prompt

## Upload-only contract

Upload exactly three integrated live-action images and label them START, KEY, and END. Use only those uploaded images as hard anchors for identity, wardrobe, terrain, screen direction, scale, and action. Do not use screenshots, game images, local paths, or external references at run time.

## Shot ID / Duration

Shot025. 8 seconds, 16:9.

## Current frame set

Use `manga_readability_reboard_v1_2026-09-09` as the current START/KEY/END set. The old critical re-audit sets are historical evidence only.

## Story function

This is the physical consequence of Byleth's command. The command creates two lanes before anyone attacks: Dimitri and Dedue hold the near cover, two rebel guards cross the fork and close the direct route, and Ashe is visibly routed to the right warning plane. Lonato remains beyond the guard screen on the far ridge. The shot must read as a tactical split, not a lineup, a gate-mechanics diagram, or a direct execution lane.

### START / open fork

Side geography in real wet battlefield terrain. Dimitri and Dedue occupy near cover on the left, feet planted and weapons lowered. Ashe is separated on the near-right side of the fork, turning toward the warning lane. The same two rebel guards are mid-crossing between the cover and the far ridge. Lonato is a small, readable older armored figure beyond them on the far ridge, never close to the students. The fork is still open.

### KEY / screen forms

The two guards have moved laterally across the fork: one turns a shield broadside and the other drags a short timber barrier across the direct lane. Dimitri gives a low stop signal from behind cover; Dedue holds the near side. Ashe has taken the right-side mark, bow low. Lonato remains behind the newly formed screen. The important change is the guard screen and the two lanes, not a character pose.

### END / containment holds

The two lanes are now physically held. The guard pair occupies the middle screen, Ashe owns the right warning plane, and Dimitri and Dedue remain behind cover. Lonato is still beyond the screen and not in sword distance. No one charges, fires, or reaches for a body. Leave the right-side Ashe position and the same guard pair readable for Shot026.

## Motion / action grammar

- 0.0-1.8s: inherit the command's arrival; Dimitri and Dedue stop behind cover while Ashe separates to the right.
- 1.8-5.0s: the two guards cross the fork and physically close the direct lane with shield and timber; the camera makes the two routes legible.
- 5.0-8.0s: the formation settles into the containment hold; Lonato remains beyond the screen and Ashe's right-side warning mark becomes the handoff.

Every phase changes a visible relationship. Use real foot placement, weight, wet mud, timber drag, shield friction, cloth drag, and motivated fog movement. No charge, sword attack, arrow release, or body contact.

## Camera / performance

Begin with a side three-quarter geography view, short lateral track only. Keep near cover, the fork, both guard bodies, Ashe's right mark, and Lonato's far-ridge separation readable at small size. Do not push toward Lonato or flatten the depth into a row. Dimitri is a calm field commander, Dedue is a protective wall, Ashe is redirected but alert, the guards create a practical obstacle, and Lonato is a distant human stake rather than a villain target.

## Audio

No spoken dialogue. Use Japanese-production battlefield ambience only: wet boots, shield hardware, timber on mud, distant wind, and fog-muted movement. No Chinese or Mandarin voiceover, subtitles, captions, dialogue boxes, or readable text.

## Continuity locks

- Receive Shot024's command and open battlefield axis, with female Byleth already off-screen.
- Preserve Dimitri/Dedue near cover, Ashe near-right, the same two rebel guards, and far-ridge Lonato across a real terrain buffer.
- Hand Shot026 the settled two-lane hold, Ashe's right-side mark, two guard positions, and unchanged Lonato direction.

## Reject if

Reject if Byleth appears, the students form a flat row, Lonato becomes a close target, the guard screen is missing, the two guards duplicate or disappear, Ashe fires, any student crosses the buffer, the frame becomes a game screenshot, 3D render, anime image, poster lineup, pasted cutout, UI, border, subtitle, watermark, or unchanged START/KEY/END pose.

<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-09-09 -->

## Canonical Execution Contract Addendum

This addendum fixes the upload contract without changing the shot design. The model receives only the uploaded START, KEY, and END images at generation time.

## Shot ID

Shot ID: Shot025

## Duration

Duration: 8.0 seconds.

## Input Frames

- start_frame: uploaded START image; begin from the visible open-fork state.
- key_frame: uploaded KEY image; reach the visible guard-screen formation without redesigning the geography.
- end_frame: uploaded END image; settle on the visible two-lane containment handoff.
- Treat the uploaded triptych as the only identity, wardrobe, terrain, scale, weapon-state, and screen-direction authority.

## Motion

Animate the existing Shot025 action from START through KEY to END exactly as written above. Every beat must change a physical relationship: Ashe separates right, the same two guards cross and close the fork, and Dimitri/Dedue hold near cover while Lonato remains beyond the buffer. Do not replace this with a crop-only change, lighting-only change, frozen transition, or direct attack.

## Camera

Follow the existing side three-quarter geography camera. Use only a short lateral track; preserve the uploaded axis, terrain layers, screen direction, and far-ridge scale. Do not spin, mirror, push toward Lonato, or flatten the depth into a row.

## Performance

Keep Dimitri, Dedue, Ashe, the two guards, and Lonato grounded through visible foot contact, weight transfer, eyelines, hand work, shield/timber resistance, and restrained reactions. Preserve academy identity, wardrobe, face, hair, and weapon identity from the uploaded frames. No performer may be added, removed, duplicated, or pulled into Lonato's sword distance.

## Audio

No spoken dialogue. Use only the Japanese-production battlefield ambience already specified above: wet boots, shield hardware, timber on mud, distant wind, and fog-muted movement. No Chinese or Mandarin voiceover, subtitles, captions, dialogue boxes, or readable text.

## Dialogue Timing / Delivery

- `dialogue_mode`: silent; no spoken dialogue, narration, or voiceover.
- `line_id`: none; the shot is carried by physical action and environmental audio.
- `single_continuous_utterance`: not applicable; no speech is generated.
- `repeat_policy`: no repeat, no echo, no stutter, no restart, and no invented reply.
- `speech_end_cut_timing`: no speech end; preserve the environmental tail and cut only on the documented END containment handoff.

## Continuity Locks

- Receive the visible command consequence and open battlefield axis from Shot024 through the uploaded START; do not depend on unavailable filesystem or previous-shot context.
- Preserve the same two guards, the near-cover pair, Ashe's right-side mark, the physical terrain buffer, and Lonato's far-ridge direction.
- Hand Shot026 the settled two-lane hold, lowered Ashe bow position, guard screen, and unchanged Lonato distance.

## Reject If

- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.
- Byleth appears, a guard disappears or duplicates, Lonato becomes a close target, Ashe fires, the buffer collapses, or the camera changes axis.
- Chinese/Mandarin speech, subtitles, captions, UI, watermark, border, extra named performer, floating feet, costume drift, face drift, or weapon drift appears.
