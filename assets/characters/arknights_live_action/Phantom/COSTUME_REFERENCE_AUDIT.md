# Phantom Costume Reference Audit

Reference file: `references/wiki_terra_phantom_base.png`

Status: `selected`

Current decision:

- `candidates_base_v1/candidate_01.png` passes the active realism gate and remains the selected production identity lock.

## Required Checks Before Selection

- Pass/fail: silver/white hair and theatrical mask/cape cues
- Pass/fail: black and red assassin-performer outfit
- Pass/fail: rapier/dagger or stage-prop weapon language
- Pass/fail: upright dancer-like posture with menace
- Pass/fail: luxury fabric, gloves, and opera-house mystery
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V1 Result

| Requirement | V1 |
| --- | --- |
| Silver/white hair and theatrical mask/cape cues | pass |
| Black and red assassin-performer outfit | pass |
| Rapier/dagger or stage-prop weapon language | pass |
| Upright dancer-like posture with menace | pass |
| Luxury fabric, gloves, and opera-house mystery | pass |
| Distinct face from selected operators | pass |
| Skin/hair/fabric read as real | pass with monitor |
| Hands, visible props, and costume structure not visibly broken | pass |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is attractive but not recognizably Phantom.
- Block if the image hides the character-defining costume or prop silhouette.
