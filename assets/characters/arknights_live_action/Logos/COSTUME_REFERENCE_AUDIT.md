# Logos Costume Reference Audit

Reference file: `references/wiki_terra_logos_base.png`

Status: `selected`

Current decision:

- `candidates_base_v1/candidate_01.png` passes the active realism gate and remains the selected production identity lock.

## Required Checks Before Selection

- Pass/fail: white or very pale hair with polished long styling
- Pass/fail: black formal caster outfit with gold and white ritual detail
- Pass/fail: elegant Sarkaz/ritual silhouette from the base art
- Pass/fail: slender controlled body language
- Pass/fail: mystical, aristocratic, quiet presence
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V1 Result

| Requirement | V1 |
| --- | --- |
| White or very pale hair with polished long styling | pass |
| Black formal caster outfit with gold and white ritual detail | pass |
| Elegant Sarkaz/ritual silhouette from the base art | pass |
| Slender controlled body language | pass |
| Mystical, aristocratic, quiet presence | pass |
| Distinct face from selected operators | pass |
| Real skin/hair/fabric, not wax/plastic | pass |
| Hands/props/costume not P0 broken | pass |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is merely attractive but not recognizably Logos.
- Block if the image hides the character-defining costume or prop silhouette.
