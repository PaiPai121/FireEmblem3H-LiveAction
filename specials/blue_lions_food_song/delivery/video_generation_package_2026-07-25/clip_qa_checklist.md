# Clip QA Checklist

Project: blue_lions_food_song
Package: video_generation_package_2026-07-25
Status: template, clips pending

Use this after generated clips are saved to the expected clip paths.

## Global Checks

- All five clips exist at the expected paths.
- Total intended duration remains 60 seconds.
- Annette keeps youthful academy identity, orange hair, twin side buns, blue eyes, Blue Lions uniform.
- Felix keeps academy identity, reserved face, dark blue hair, blunt duelist posture.
- Faces match the input frames closely enough that the characters are still recognizable as the same Annette and Felix.
- Lip-sync does not reshape the mouth, teeth, jaw, cheeks, or whole face.
- Greenhouse geography remains stable: doorway screen-left, flower rows readable.
- Watering can remains the same prop.
- No visible subtitles, text, watermarks, logos, or unrelated characters are generated into the image.
- Comedy remains private, gentle, and character-driven.

## Per-Shot QA

### BLFS-SH001

Expected: Annette alone, soft private food song, step-turn-pour watering rhythm, left row dry.

Reject if:

- Annette's face drifts from the input frames.
- Singing mouth shape changes her facial structure.
- Annette looks older or stage-performer coded.
- Choreography becomes a musical number.
- Water covers the aisle or changes the gag.

Decision: pending

### BLFS-SH002

Expected: Felix revealed at doorway after the song, still and observant, not mocking.

Reject if:

- Felix or Annette no longer matches the input frames.
- Felix smiles broadly, laughs, or teases visually.
- Annette fails to notice him.
- Doorway geography moves away from screen-left.

Decision: pending

### BLFS-SH003

Expected: Annette freezes, tiny over-pour, catches herself, asks how long Felix stood there.

Reject if:

- Annette's face drifts from the input frames.
- Lip-sync turns her into a different face.
- Reaction becomes cartoon panic.
- Water spill becomes large slapstick.
- Annette's face, hair, or uniform drifts.

Decision: pending

### BLFS-SH004

Expected: locked two-shot; Felix sincerely praises footwork; Annette protests while flustered.

Reject if:

- Either face drifts from the input frames.
- Felix crowds Annette or acts romantic.
- Felix laughs at her.
- Dialogue timing cannot fit the shot length.

Decision: pending

### BLFS-SH005

Expected: Felix waters the flowers, deadpans that they may start singing if Annette does not hurry, and Annette reacts.

Reject if:

- Either face drifts from the input frames.
- Felix hums or performs the song.
- Ending becomes overt romance.
- Watering can disappears or changes shape.

Decision: pending

## Sequence QA

- SH001 end cuts naturally into SH002 reveal.
- SH002 discovery cuts naturally into SH003 close reaction.
- SH003 explanation cuts naturally into SH004 two-shot.
- SH004 watering-can handoff cuts naturally into SH005 dry-row payoff.
- Music/dialogue timing leaves room for silence after the reveal.

Final Decision: pending
