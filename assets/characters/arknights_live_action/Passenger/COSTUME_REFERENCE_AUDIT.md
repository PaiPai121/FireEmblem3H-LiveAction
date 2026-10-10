# Passenger Costume Reference Audit

Reference file: `references/wiki_terra_passenger_base.png`

Status: `selected`

Current decision:

- `candidates_base_v1/candidate_01.png` passes the active realism gate and remains the selected production identity lock.

## Required Checks Before Selection

- Pass/fail: light hair and desert aristocrat-engineer silhouette
- Pass/fail: white/gold/black long coat with technical details
- Pass/fail: caster device or staff-like engineering prop
- Pass/fail: controlled posture and measured arrogance
- Pass/fail: dusty refined material realism
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V1 Result

| Requirement | V1 |
| --- | --- |
| Light hair and desert aristocrat-engineer silhouette | pass |
| White/gold/black long coat with technical details | pass |
| Caster device or staff-like engineering prop | pass |
| Controlled posture and measured arrogance | pass |
| Dusty refined material realism | pass |
| Distinct face from selected operators | pass |
| Skin/hair/fabric read as real | pass with monitor |
| Hands, visible props, and costume structure not visibly broken | pass |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is attractive but not recognizably Passenger.
- Block if the image hides the character-defining costume or prop silhouette.
