# EP02 Scene09 V3 End Patch Visual Audit

Date: 2026-07-25

Decision: `monitor_required`

## Integrity Summary

- Reviewed 9 generated dedicated end frames in `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/end_patch_2026-07-25/`.
- V3 prompt package temporary key-frame holds remaining after rebuild: 0.
- V3 prompt contract validation after rebuild: 42/42 passed.
- These frames are dedicated end/cut-out candidates, not final clip approval.

## Reviewed End Frames

- `29B_Shot033B_end.png`: Ashe lowers bow after Hanneman's spell angle is suppressed.
- `30B_Shot033C_end.png`: Ashe is spent; Hanneman's magic angle is broken and fading.
- `31B_Shot033D_end.png`: Ingrid/Sylvain hold Manuela's return route closed without injury.
- `32B_Shot034C_end.png`: Felix has blocked Ferdinand's route; Ferdinand stops upright.
- `33B_Shot034D_end.png`: Byleth and Hanneman only; final spell fragments fade.
- `34C_Shot034B_end.png`: Byleth/Dimitri and teachers confirm the objective ruling; Ingrid removed.
- `38B_Shot034_end.png`: full-field resolution has named representative figures only, no crowd reset.
- `39B_Shot035_end.png`: Felix/Byleth close-up lands in post-action respect.
- `40B_Shot036_end.png`: Dimitri/Byleth close-up lands in quiet aftermath.

## What Passes

- The V3 package no longer relies on `key_frame` as a temporary end frame.
- No reviewed end frame introduces unknown readable students, spectators, crowd figures, soldiers, or background human silhouettes.
- Hubert, Dorothea, and Bernadetta do not reappear after capture.
- Annette, Mercedes, Ashe, Sylvain, Ingrid, Felix, and Ferdinand do not resume active combat after their spent/cut/capture beats.
- The ending remains an exhausted Blue Lions objective win rather than a clean full-class celebration.

## Monitor Risks

- Several training weapons still read sharper than ideal in still form, especially route-control lances/poles and wide-field silhouettes.
- `38B_Shot034_end.png` is a wide field composition; identity and weapon reads are inherently weaker and need strict clip QA.
- `32B_Shot034C_end.png` keeps Felix in a strong blocking stance; video generation must not turn it into a strike.
- `31B_Shot033D_end.png` must keep Ingrid/Sylvain route control nonlethal and non-contact.

## Required Next Gates

- Run strict adjacent-shot continuity against the V3 frame chains.
- Run clip-level motion QA after any video generation, with special attention to weapon drift and reintroduced extras.
- Do not promote these shots to `approved_for_video` until reviewer approval and continuity gates pass.
