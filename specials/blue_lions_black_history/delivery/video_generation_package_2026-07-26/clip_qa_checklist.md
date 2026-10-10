# Clip QA Checklist

Project: blue_lions_black_history
Package: video_generation_package_2026-07-26
Status: template, clips pending

Use this after generated clips are saved to the expected clip paths.

## Global Checks

- All five clips exist at the expected paths.
- Total intended duration remains 60 seconds.
- Sylvain keeps youthful academy identity, red hair, Blue Lions uniform, and embarrassed charm.
- Ingrid keeps youthful academy identity, blonde hair, Blue Lions uniform, and disciplined composure.
- Faces match the input frames closely enough that the characters are recognizable as the same Sylvain and Ingrid.
- Lip-sync does not reshape the mouth, teeth, jaw, cheeks, or whole face.
- Corridor/classroom-door geography remains stable.
- Ingrid's notes stay blank or unreadable.
- No visible subtitles, text, watermarks, logos, or unrelated characters are generated into the image.
- Comedy remains public-pressure friendly embarrassment, not romance or cruelty.

## Per-Shot QA

### SIBH-SH001

Expected: Sylvain alone at the classroom threshold, giving a smooth social-skills lesson.

Reject if:

- Sylvain's face drifts from the input frames.
- He becomes predatory, leering, or hostile.
- Extra visible students take focus.
- Camera movement becomes flashy or unstable.

Decision: pending

### SIBH-SH002

Expected: Ingrid enters and dryly challenges Sylvain's authority; Sylvain tries to keep control.

Reject if:

- Ingrid reads as jealous or romantic.
- Sylvain flirts with Ingrid.
- Either face drifts from the input frames.
- Doorway/corridor geography shifts so the cut is confusing.

Decision: pending

### SIBH-SH003

Expected: Ingrid calmly starts the old-history audit; Sylvain asks her to lower her voice.

Reject if:

- Notes show readable text.
- Ingrid becomes cruel or gleeful.
- Sylvain's embarrassment becomes panic slapstick.
- Lip-sync deforms faces during the longer dialogue.

Decision: pending

### SIBH-SH004

Expected: Ingrid stacks more examples; Sylvain backs near the wall and asks whether this is a trial.

Reject if:

- Dialogue timing cannot fit the 16s shot.
- Sylvain becomes threatening or devastated.
- Ingrid yells, laughs at him, or crowds him.
- Extra students appear as major subjects.

Decision: pending

### SIBH-SH005

Expected: Ingrid delivers the real lesson to implied students: do not imitate Sylvain; Sylvain's recovery smile fails.

Reject if:

- Ending becomes romantic.
- Sylvain looks crushed instead of lightly embarrassed.
- Ingrid laughs at him instead of staying composed.
- Screen direction reverses.

Decision: pending

## Sequence QA

- SH001 end cuts naturally into SH002 interruption.
- SH002 notes setup cuts naturally into SH003 audit.
- SH003 quieting gesture cuts naturally into SH004 escalation.
- SH004 trial line cuts naturally into SH005 verdict.
- The final pause gives the failed recovery smile time to land.

Final Decision: pending
