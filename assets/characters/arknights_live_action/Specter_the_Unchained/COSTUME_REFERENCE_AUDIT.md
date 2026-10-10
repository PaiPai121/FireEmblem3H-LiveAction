# Specter the Unchained Costume Reference Audit

Reference file: `references/wiki_terra_specter_the_unchained_base.png`

Status: `selected`

Current decision:

- `candidates_base_v1/candidate_01.png` passes the active realism gate and remains the selected production identity lock.

## Required Checks Before Selection

- Pass/fail: white hair and Abyssal Hunter silhouette
- Pass/fail: black/white/red outfit with nun-hunter echoes
- Pass/fail: saw/large weapon or chain cue
- Pass/fail: graceful unstable posture
- Pass/fail: oceanic horror restraint
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V1 Result

| Requirement | V1 |
| --- | --- |
| White hair and Abyssal Hunter silhouette | pass |
| Black/white/red outfit with nun-hunter echoes | pass |
| Saw/large weapon or chain cue | pass |
| Graceful unstable posture | pass |
| Oceanic horror restraint | pass with monitor |
| Distinct face from selected operators | pass |
| Skin/hair/fabric read as real | pass with monitor |
| Hands, visible props, and costume structure not visibly broken | pass |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is attractive but not recognizably Specter the Unchained.
- Block if the image hides the character-defining costume or prop silhouette.
