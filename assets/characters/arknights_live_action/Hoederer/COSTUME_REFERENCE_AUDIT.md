# Hoederer Costume Reference Audit

Reference file: `references/wiki_terra_hoederer_base.png`

Status: `selected`

Current decision:

- `candidates_base_v1/candidate_01.png` fails age and official-reference identity review.
- Former `selected.png` was demoted to `selected_demoted_base_v1_age_identity_failed.png`.
- `candidates_realism_young_v2/candidate_01.png` passes the active realism and young-adult casting gates and is now copied to `selected.png`.

## Required Checks Before Selection

- Pass/fail: dark red-brown hair and pale Sarkaz horn silhouette
- Pass/fail: black/gray/brown mercenary armor layers, ragged cloak, and red accents
- Pass/fail: huge blade or heavy weapon cue
- Pass/fail: broad exhausted commander posture
- Pass/fail: dusty battlefield material wear
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V1 Result

| Requirement | V1 |
| --- | --- |
| Dark red-brown hair and pale Sarkaz horn silhouette | fail, hair/horns not readable |
| Black/gray/brown armor, ragged cloak, red accents | partial, generic black trenchcoat dominates |
| Huge blade/heavy weapon cue | pass |
| Broad exhausted commander posture | pass |
| Dusty battlefield material wear | pass |
| Young adult casting | fail, reads middle-aged |
| Real skin/hair/fabric | pass |
| Downstream usable | fail |

## V2 Requirement

- Regenerate as a clearly adult young man around 18-22, rough and handsome but not middle-aged.
- Preserve red-brown hair, pale horns, scarred face, black/gray armor layers, ragged cloak, red accents, and huge blade.

## V2 Result

| Requirement | V2 |
| --- | --- |
| Clearly adult young man around 18-22 | pass |
| Rough handsome scarred face, not middle-aged | pass |
| Dark red-brown hair and pale Sarkaz horn silhouette | pass with monitor |
| Black/gray/brown armor, ragged cloak, red accents | pass |
| Huge blade/heavy weapon cue | pass with monitor |
| Broad exhausted commander posture | pass |
| Dusty battlefield material wear | pass |
| Real skin/hair/fabric | pass |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is attractive but not recognizably Hoederer.
- Block if the image hides the character-defining costume or prop silhouette.
