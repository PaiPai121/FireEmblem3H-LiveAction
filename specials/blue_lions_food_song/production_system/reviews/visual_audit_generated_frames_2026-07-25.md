# Visual Audit - Generated Frames

Date: 2026-07-25

## Integrity Summary

All five shots have start/key/end frame files on disk.

Frame availability:

- BLFS-SH001: start/key/end available.
- BLFS-SH002: start/key/end available. Start reuses BLFS-SH001 end by design for edit continuity; end reuses BLFS-SH002 key as a held reveal.
- BLFS-SH003: start/key/end available. End frame is 1672x940 while the rest are 1672x941; normalize before immutable final packaging.
- BLFS-SH004: start/key/end available. Start reuses BLFS-SH004 key as a held two-shot setup.
- BLFS-SH005: start/key/end available.

## Visual Audit Coverage

Reviewed all 15 available PNG frames across 5 shots.

## Per-Shot Findings

### BLFS-SH001

Declared Beat / Purpose: establish Annette's private greenhouse song and step-turn-pour rhythm.

Reviewed Paths:

- `storyboards/BLFS-SH001/start_frame.png`
- `storyboards/BLFS-SH001/key_frame.png`
- `storyboards/BLFS-SH001/end_frame.png`

Story Beat Proven: Yes. Annette checks the empty greenhouse, privately sings while watering, then turns toward the doorway.

Character Identity: Pass. Annette reads younger than prior selected, with orange twin side buns, blue academy uniform, and bright student energy.

Blocking / Geography: Pass. Greenhouse aisle, doorway, and flower rows are readable.

Motion Risks: Moderate. Song/footwork could over-animate into a stage performance if the video prompt is not followed.

Decision: `visual_review_passed`

### BLFS-SH002

Declared Beat / Purpose: reveal Felix heard the song.

Reviewed Paths:

- `storyboards/BLFS-SH002/start_frame.png`
- `storyboards/BLFS-SH002/key_frame.png`
- `storyboards/BLFS-SH002/end_frame.png`

Story Beat Proven: Yes. Felix is at the doorway; Annette is foreground, turning toward him.

Character Identity: Pass. Felix is young, controlled, and not mocking. Annette remains recognizable.

Blocking / Geography: Pass. Doorway screen-left continues SH001 geography.

Motion Risks: Moderate. End frame is a held reveal, so video generation must keep this as a pause rather than inventing extra action.

Decision: `visual_review_passed`

### BLFS-SH003

Declared Beat / Purpose: land Annette's embarrassment and tiny over-pour.

Reviewed Paths:

- `storyboards/BLFS-SH003/start_frame.png`
- `storyboards/BLFS-SH003/key_frame.png`
- `storyboards/BLFS-SH003/end_frame.png`

Story Beat Proven: Yes. Annette's wide-eyed reaction and controlled water stream clearly show embarrassment without slapstick.

Character Identity: Pass. Annette remains young/cute and not childish.

Blocking / Geography: Conditional. Close framing is strong for performance but weaker for spatial continuity.

Motion Risks: Moderate. One frame height differs by 1 px; normalize before final package. Water must stay restrained.

Decision: `visual_review_passed`

### BLFS-SH004

Declared Beat / Purpose: Felix treats the song as footwork and Annette protests.

Reviewed Paths:

- `storyboards/BLFS-SH004/start_frame.png`
- `storyboards/BLFS-SH004/key_frame.png`
- `storyboards/BLFS-SH004/end_frame.png`

Story Beat Proven: Yes. Two-shot keeps respectful distance; Felix is serious, Annette is flustered.

Character Identity: Pass. Felix and Annette are readable and age-appropriate.

Blocking / Geography: Pass. Both characters face each other across the greenhouse aisle.

Motion Risks: Low to moderate. Prompt must prevent romantic overacting or Felix smiling broadly.

Decision: `visual_review_passed`

### BLFS-SH005

Declared Beat / Purpose: Felix quietly helps by watering the flowers; Annette reacts to his plant-singing deadpan.

Reviewed Paths:

- `storyboards/BLFS-SH005/start_frame.png`
- `storyboards/BLFS-SH005/key_frame.png`
- `storyboards/BLFS-SH005/end_frame.png`

Story Beat Proven: Yes. Felix waters the flowers; Annette's final reaction is restrained and readable.

Character Identity: Pass. Felix is reserved; Annette remains youthful and flustered.

Blocking / Geography: Pass. Exit screen-left and Annette's eyeline support the ending.

Motion Risks: Moderate. The video prompt must keep Felix's hum almost inaudible and avoid an overt musical reprise.

Decision: `visual_review_passed`

## Summary Counts

Unavailable Shots: 0

Existing Shots Failed: 0

Layout Reference Only: 0

Monitor Required: BLFS-SH001, BLFS-SH002, BLFS-SH003, BLFS-SH004, BLFS-SH005 for downstream motion/identity testing.

Visual Review Passed: BLFS-SH001, BLFS-SH002, BLFS-SH003, BLFS-SH004, BLFS-SH005

## Promotion Decision

Decision: `monitor_required`

The generated storyboard frame sets visually pass as stills and may proceed to narrow video-generation testing, but they are not approved for final video delivery. Required before `approved_for_video`:

- Normalize BLFS-SH003 end frame dimensions or let the final package builder crop/pad consistently.
- Insert the controlled full Japanese lyric source into the internal voice/subtitle working copy.
- Run video prompt QA against these actual frames.
- Run strict adjacent-shot continuity after any frame normalization.
