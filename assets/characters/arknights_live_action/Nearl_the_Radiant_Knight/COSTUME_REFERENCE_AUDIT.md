# Nearl the Radiant Knight Costume Reference Audit

Reference file: `references/wiki_terra_nearl_the_radiant_knight_base.png`

Status: `selected`

Current decision:

- `candidates_base_v1/candidate_01.png` passes the active realism gate and remains the selected production identity lock.

## Required Checks Before Selection

- Pass/fail: gold/blond hair and Kuranta knight silhouette
- Pass/fail: radiant white/gold Kazimierz armor and cloak language
- Pass/fail: lance/sword knight weapon silhouette when visible
- Pass/fail: upright heroic posture, open but firm expression
- Pass/fail: warm light without becoming angelic generic cosplay
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V1 Result

| Requirement | V1 |
| --- | --- |
| Gold/blond hair and Kuranta knight silhouette | pass |
| Radiant white/gold Kazimierz armor and cloak language | pass |
| Lance/sword knight weapon silhouette visible | pass |
| Upright heroic posture, open but firm expression | pass |
| Warm light without becoming angelic generic cosplay | pass with monitor |
| Distinct face from selected operators | pass |
| Skin/hair/fabric read as real | pass with monitor |
| Hands, visible props, and costume structure not visibly broken | pass |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is merely attractive but not recognizably Nearl the Radiant Knight.
- Block if the image hides the character-defining costume or prop silhouette.
