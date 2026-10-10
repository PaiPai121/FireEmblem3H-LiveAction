# Mudrock Costume Reference Audit

Reference file: `references/wiki_terra_mudrock_base.png`

Status: `selected`

Current decision:

- `candidates_base_v1/candidate_01.png` passes the active realism gate and remains the selected production identity lock.

## Required Checks Before Selection

- Pass/fail: massive armor silhouette remains central
- Pass/fail: dark heavy protective suit with white/gray hair glimpses if helmet open
- Pass/fail: huge hammer/defender weight language when visible
- Pass/fail: lonely, guarded posture
- Pass/fail: materials must feel heavy and practical, not plastic costume
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V1 Result

| Requirement | V1 |
| --- | --- |
| Massive armor silhouette remains central | pass |
| Dark heavy protective suit with white/gray hair glimpse | pass |
| Huge hammer/defender weight language | pass |
| Lonely, guarded posture | pass |
| Heavy practical materials, not plastic costume | pass |
| Distinct face from selected operators | pass |
| Skin/hair/fabric/armor read as real | pass |
| Hands/props/costume not P0 broken | pass |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is merely attractive but not recognizably Mudrock.
- Block if the image hides the character-defining costume or prop silhouette.
