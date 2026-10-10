# Qiubai Costume Reference Audit

Reference file: `references/wiki_terra_qiubai_base.png`

Status: `selected`

Current decision:

- `candidates_base_v1/candidate_01.png` fails costume and official-reference review.
- Former `selected.png` was demoted to `selected_demoted_base_v1_costume_failed.png`.
- `candidates_realism_young_v2/candidate_01.png` passes the active realism and young-adult casting gates and is now copied to `selected.png`.

## Required Checks Before Selection

- Pass/fail: long gray-black hair and black antler/horn-like head ornament
- Pass/fail: black/red/dark gray asymmetric robe-combat outfit
- Pass/fail: sword and red-black flowing cloth balance
- Pass/fail: still martial stance
- Pass/fail: muted jianghu realism
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V1 Result

| Requirement | V1 |
| --- | --- |
| Long gray-black hair and black antler/horn-like head ornament | fail, hair becomes pale/white and head ornament is reduced |
| Black/red/dark gray asymmetric robe-combat outfit | fail, redesigned as white/green/black xianxia robe |
| Sword and red-black flowing cloth balance | partial, sword exists but palette/action identity drift |
| Still martial stance | pass |
| Muted jianghu realism | pass with monitor |
| Young beautiful female casting | pass |
| Real skin/hair/fabric | pass with monitor |
| Downstream usable | fail |

## V2 Requirement

- Regenerate from the official base reference.
- Preserve black/red/dark gray costume topology, long gray-black hair, black head ornament, sword, red inner cloth, and thigh/boot silhouette.
- Block any white-green robe redesign or generic xianxia heroine.

## V2 Result

| Requirement | V2 |
| --- | --- |
| Long gray-black hair and black antler/horn-like head ornament | pass |
| Black/red/dark gray asymmetric robe-combat outfit | pass |
| Sword and red-black flowing cloth balance | pass |
| Still martial stance | pass |
| Muted jianghu realism | pass |
| Young beautiful female casting | pass |
| Real skin/hair/fabric | pass with monitor |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is attractive but not recognizably Qiubai.
- Block if the image hides the character-defining costume or prop silhouette.
