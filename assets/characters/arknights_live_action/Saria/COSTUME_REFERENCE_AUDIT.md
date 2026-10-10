# Saria Costume Reference Audit

Reference file: `references/wiki_terra_saria_base.png`

Status: `selected`

Current decision:

- `candidates_realism_young_v2/candidate_01.png` fails the active young-beautiful casting gate after user review.
- The previous selected image is superseded because its face read too old under `CASTING_STYLE_BIBLE.md`.
- The V2 selected image was demoted to `selected_demoted_young_v2_user_rejected.png`.
- `candidates_realism_young_v3/candidate_01.png` passes the active realism and young-adult casting gates and is now copied to `selected.png`.

## Required Checks Before Selection

- Pass/fail: short light hair with stern Rhine Lab identity
- Pass/fail: white black orange armored lab/security suit
- Pass/fail: shield/defender silhouette when visible
- Pass/fail: broad-shouldered grounded posture
- Pass/fail: unshowy authority, not glamorous softness
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V2 Result

| Requirement | V2 |
| --- | --- |
| Short/light hair with stern Rhine Lab identity | pass |
| White black orange armored lab/security suit | pass |
| Shield/defender silhouette | pass |
| Broad-shouldered grounded posture | pass |
| Unshowy authority without older age cues | fail, face/makeup still reads too mature and harsh |
| Distinct face from selected operators | pass |
| Real skin/hair/fabric, not wax/plastic | pass |
| Hands/props/costume not P0 broken | pass |
| Downstream usable | fail until v3 replacement |

## V3 Requirement

- Regenerate as a clearly adult young woman around 18-21.
- Preserve the exact Saria base outfit: white high-collar jacket, black harness, orange strap, black/orange lower panel, orange-black headgear, large rectangular shield.
- Make her pretty and fresh-faced without becoming childlike or idol-styled.
- Keep authority through calm eyes, squared stance, shield weight, and practical Rhine Lab costume.
- Block any image that reads older executive, middle-aged scientist, generic lab coat, fashion editorial, cosplay poster, or AI doll.

## V3 Result

| Requirement | V3 |
| --- | --- |
| Clearly adult young woman around 18-21 | pass |
| Pretty fresh face without childlike read | pass |
| White high-collar jacket | pass |
| Black harness and orange vertical strap | pass |
| Black/orange lower panel | pass |
| Orange-black headgear | pass |
| Large rectangular shield | pass |
| Body/costume visible beside shield | pass with monitor |
| Practical wardrobe/photo realism | pass |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is merely attractive but not recognizably Saria.
- Block if the image hides the character-defining costume or prop silhouette.
