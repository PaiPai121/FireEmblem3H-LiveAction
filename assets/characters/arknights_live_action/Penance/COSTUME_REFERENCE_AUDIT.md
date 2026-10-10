# Penance Costume Reference Audit

Reference file: `references/wiki_terra_penance_base.png`

Status: `selected`

Current decision:

- `candidates_base_v1/candidate_01.png` fails identity and young-beautiful casting review after visual inspection.
- Former `selected.png` was demoted to `selected_demoted_base_v1_identity_age_failed.png`.
- `candidates_realism_young_v2/candidate_01.png` passes the active realism and young-adult casting gates and is now copied to `selected.png`.

## Required Checks Before Selection

- Pass/fail: dark hair and wolf/Siracusa silhouette cues
- Pass/fail: black/red/white judge-coat outfit
- Pass/fail: massive scale/hammer or legal weapon prop
- Pass/fail: upright courtroom authority
- Pass/fail: heavy tailored fabric and metal
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V1 Result

| Requirement | V1 |
| --- | --- |
| Dark hair and wolf/Siracusa silhouette cues | fail, ears/tail are missing or unreadable |
| Black/red/white judge-coat outfit | fail, redesigned into long black-red robe instead of base outfit topology |
| Massive scale/hammer or legal weapon prop | partial, hammer silhouette exists but reads generic pole weapon |
| Upright courtroom authority | pass |
| Heavy tailored fabric and metal | pass |
| Distinct face from selected operators | pass |
| Skin/hair/fabric read as real | pass with monitor |
| Hands, visible props, and costume structure not visibly broken | pass |
| Downstream usable | fail |

## V2 Requirement

- Regenerate as a clearly adult young woman around 18-21.
- Preserve visible wolf/Siracusa ears and large tail.
- Preserve compact base outfit topology: black short judge coat, white collar/blouse, red lining/accent panels, dark stockings, fitted footwear, gold legal ornaments.
- Preserve the ornate gold hammer/gavel weapon, not a generic spear or staff.
- Block any older judge, mafia gown, priest robe, missing ears, missing tail, or long-robe redesign.

## V2 Result

| Requirement | V2 |
| --- | --- |
| Clearly adult young woman around 18-21 | pass |
| Young pretty severe judicial face | pass |
| Visible wolf/Siracusa ears | pass |
| Large tail | pass |
| Short black judge coat and white collar/blouse | pass |
| Red lining/accent panels | pass |
| Dark stockings and fitted footwear | pass |
| Gold legal ornaments | pass |
| Ornate gold hammer/gavel weapon | pass with monitor |
| Legal book/codex | pass |
| Practical wardrobe/photo realism | pass |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is attractive but not recognizably Penance.
- Block if the image hides the character-defining costume or prop silhouette.
