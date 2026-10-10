# SilverAsh Costume Reference Audit

Reference file: `references/wiki_terra_silverash_base.png`

Status: `selected`

Current decision:

- `candidates_realism_young_v3/candidate_01.png` passes the active realism and young-adult casting gates.
- `candidates_realism_young_v2/candidate_01.png` remains monitor because the face still reads too mature.

## Required Checks Before Selection

- Pass/fail: silver hair and snow-leopard/Kjerag noble cues
- Pass/fail: white, black, and blue aristocratic coat with fur trim
- Pass/fail: cane/sword/bird-master authority when visible
- Pass/fail: tall poised businessman-warlord posture
- Pass/fail: controlled smile or unreadable expression
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V3 Result

| Requirement | V3 |
| --- | --- |
| Silver hair and snow-leopard/Kjerag noble cues | pass |
| White, black, and blue aristocratic coat with fur trim | pass |
| Cane/sword/bird-master authority when visible | pass |
| Tall poised businessman-warlord posture translated younger | pass |
| Controlled smile or unreadable expression | pass |
| Distinct face from selected operators | pass |
| Real skin/hair/fabric, not wax/plastic | pass |
| Hands/props/costume not P0 broken | pass |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is merely attractive but not recognizably SilverAsh.
- Block if the image hides the character-defining costume or prop silhouette.
