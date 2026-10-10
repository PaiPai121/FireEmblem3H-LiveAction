# Zuo Le Costume Reference Audit

Reference file: `references/wiki_terra_zuo_le_base.png`

Status: `selected`

Current decision:

- `candidates_base_v1/candidate_01.png` fails official-reference costume and silhouette review.
- Former `selected.png` was demoted to `selected_demoted_base_v1_costume_failed.png`.
- `candidates_realism_young_v2/candidate_01.png` passes the active realism and young-adult casting gates and is now copied to `selected.png`.

## Required Checks Before Selection

- Pass/fail: short dark blue hair, pointed ears, and Yan official-martial silhouette
- Pass/fail: red/black/white/navy uniform armor-robe layers with red cloak lining
- Pass/fail: sword, official token details, tail, and box/shield equipment silhouette
- Pass/fail: upright disciplined stance
- Pass/fail: clean martial bureaucracy
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V1 Result

| Requirement | V1 |
| --- | --- |
| Short dark blue hair, pointed ears, Yan official-martial silhouette | partial, generic black-haired swordsman |
| Red/black/white/navy armor-robe layers with red cloak lining | fail, red cloak/equipment silhouette absent |
| Sword, official token, tail, box/shield equipment | partial sword only; tail/equipment absent |
| Upright disciplined stance | pass |
| Clean martial bureaucracy | pass |
| Young adult casting | pass |
| Real skin/hair/fabric | pass with monitor |
| Downstream usable | fail |

## V2 Requirement

- Regenerate from official base reference with blue hair, red cloak lining, navy/black armor-robe layers, tail, sword, and box/shield equipment visible.

## V2 Result

| Requirement | V2 |
| --- | --- |
| Short dark blue hair, pointed ears, Yan official-martial silhouette | pass |
| Red/black/white/navy armor-robe layers with red cloak lining | pass |
| Sword, official token, tail, box/shield equipment | pass with monitor |
| Upright disciplined stance | pass |
| Clean martial bureaucracy | pass |
| Young adult casting | pass |
| Real skin/hair/fabric | pass |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is attractive but not recognizably Zuo Le.
- Block if the image hides the character-defining costume or prop silhouette.
