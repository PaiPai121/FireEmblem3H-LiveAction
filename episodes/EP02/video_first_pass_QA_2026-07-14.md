# EP02 First-Pass Video QA Checklist

Date: 2026-07-14

Use this after generating clips from:

- `episodes/EP02/video_jobs_2026-07-14/`
- `episodes/EP02/video_generation_tracker_2026-07-14.csv`

Expected output directory:

- `episodes/EP02/video_outputs/first_pass/`

## Review Order

1. Review each clip alone for image stability and prompt compliance.
2. Review adjacent pairs for continuity.
3. Review the full sequence without sound.
4. Review again with temporary sound or timing marks.

## Per-Clip Pass Criteria

Mark each clip as one of:

- `pass`: usable for first assembly.
- `conditional`: usable only if cut short, cropped, or paired carefully.
- `rerun`: prompt or source still needs adjustment.
- `reject`: not usable.

Check every clip for:

- Character identity remains stable through the full duration.
- Academy-phase students stay young.
- Costume and hair do not drift into war phase or unrelated designs.
- No subtitles, watermarks, game UI, readable text, or modern objects.
- Camera motion supports the shot purpose without adding story confusion.
- Hands, faces, and weapons do not deform in close shots.
- Training shots remain controlled and nonlethal.

## High-Risk Shots

| Shot | Risk | Pass condition |
| --- | --- | --- |
| Shot009 | Previous v1 still was a multi-panel concept board; current payload uses v2 | Generated video must be one continuous cloister shot, not a collage |
| Shot017 | Three house leader likeness | Edelgard, Dimitri, and Claude stay identifiable and academy-phase |
| Shot019 | Blue Lions acceptance group | Dedue, Felix, Sylvain, and Dimitri do not swap identity or age |
| Shot024 | Current payload uses v3 classroom still; Felix may still drift in motion | Felix stays youthful, narrow-eyed, and not overly mature |
| Shot027 | Ashe action | Ashe keeps pale ash-gray hair and boyish academy look while archery stays safe |
| Shot033 | Dimitri restraint | Young academy Dimitri, subtle pressure, no war-phase rage |
| Shot036 | Dimitri dark-line beat | Polite courtesy plus tense hand reads clearly, no older king drift |
| Shot041 | Flame Emperor close-up | Mask remains unreadable; no identity reveal |

## Continuity Checks

Opening:

- Shot001-004 should move from distant monastery to personal arrival.
- Dimitri's Shot004 nod should not feel like a formal introduction yet.

Church authority:

- Shot005-008 should feel still, formal, and controlled.
- Rhea must remain serene rather than overtly threatening.
- Jeralt should stay guarded across Shot006 and Shot008.

Student introduction:

- Shot011-012 should contrast Black Eagles and Golden Deer without stealing the episode.
- Shot013-016 should clearly make Blue Lions the main class.

Choice and warning:

- Shot017-019 should make Blue Lions selection feel human, not UI-like.
- Shot020-021 should slow the pace and add suspicion before class begins.

Class to training:

- Shot022-024 should read as Byleth moving quickly from classroom to practice.
- Felix's interest should build into his training-ground challenge.

Mock battle:

- Shot025-036 should remain a school exercise, not a real battle.
- Byleth's authority should come from calm precision.
- Felix's respect and Dimitri's hidden pressure should both be visible by the end.

Ending:

- Shot037 should reframe the training success as church observation.
- Shot038-039 should feel like a quiet supernatural aftershock.
- Shot040-041 should turn the episode toward conspiracy.
- Shot042 should be a clean black hold with no accidental title or logo.

## Tracker Update Rules

After reviewing each clip, update `episodes/EP02/video_generation_tracker_2026-07-14.csv`:

- `status`: `pass`, `conditional`, `rerun`, or `reject`
- `review_notes`: shortest actionable reason

Examples:

- `pass`, `stable identity; good motion`
- `conditional`, `use first 6 seconds only; hand deforms near end`
- `rerun`, `Ashe turns gray-haired during bow motion`
- `reject`, `generated subtitles and wrong setting`
