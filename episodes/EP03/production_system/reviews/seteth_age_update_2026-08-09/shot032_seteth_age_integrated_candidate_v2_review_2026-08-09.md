# Shot032 Seteth Age Integrated Candidate V2 Review - 2026-08-09

## Decision

Status: `monitor_required`

This frame set may replace the current Shot032 display candidate for Seteth age fidelity, but it is not approved for video generation.

## Reviewed Paths

- `storyboards/Shot032/seteth_age_integrated_candidate_v2_2026-08-09/start_frame.png`
- `storyboards/Shot032/seteth_age_integrated_candidate_v2_2026-08-09/key_frame.png`
- `storyboards/Shot032/seteth_age_integrated_candidate_v2_2026-08-09/end_frame.png`
- `production_system/reviews/seteth_age_update_2026-08-09/shot032_seteth_age_integrated_candidate_v2_triptych_2026-08-09.jpg`
- `production_system/reviews/seteth_age_update_2026-08-09/shot032_seteth_age_update_contact_sheet_2026-08-09.jpg`

## Integrity

- Frame count: 3/3.
- Normalized dimensions: 1280x720 each.
- Aspect policy: aspect-preserving scale/crop from generated 1672x941 sources; no width/height squeeze.
- Exact duplicate check: pass; START, KEY, and END hashes differ.

## Visual Review

Passes:

- Seteth now reads as a mature academy-era Church official rather than a too-young student-like face.
- The three frames are integrated full-frame cathedral images, not pasted character cutouts.
- Rhea, Seteth, and Byleth share broadly consistent lighting, depth, color temperature, and camera language.
- The sequence preserves the Shot032 story purpose: calm institutional judgment under Rhea's authority with Seteth as the procedural Church presence.
- The END frame gives a wider, colder cut-out state before the student-reaction cut.

Monitor risks:

- START and KEY are still subtle as a performance change; the difference is acceptable for a judgment beat but should be checked in a 3-second motion probe.
- Rhea and Byleth identity should be rechecked after video-prompt QA because the full-frame regeneration altered the image globally, not only Seteth.
- Document/parchment readability must not become subtitles, UI, or distracting readable text during video generation.
- Seteth's uniform and cape topology must not drift toward generic royal/cleric robes during motion.

## Rejected Earlier Candidates

The `seteth_age_corrected_v1_2026-08-08` files remain rejected because they read as cutout/portrait collage composites.

## Required Before Promotion

- Re-run prompt QA against the actual v2 frames.
- Keep executable prompts free of local filesystem paths.
- Run a 3-second motion probe before any full-duration Shot032 generation.
- Reject if the clip introduces pasted-frame artifacts, subtitles, UI, readable overlay text, rounded player framing, letterbox/pillarbox, face drift, or robe/costume drift.
