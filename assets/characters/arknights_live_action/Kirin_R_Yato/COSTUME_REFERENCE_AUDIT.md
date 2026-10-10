# Kirin R Yato Costume Reference Audit

Reference file: `references/wiki_terra_kirin_r_yato_base.png`

Status: `selected`

Current decision:

- `candidates_base_v1/candidate_01.png` fails official-reference costume and silhouette review.
- Former `selected.png` was demoted to `selected_demoted_base_v1_costume_failed.png`.
- `candidates_realism_young_v2/candidate_01.png` passes the active realism and young-adult casting gates and is now copied to `selected.png`.

## Required Checks Before Selection

- Pass/fail: pale white hair with pink-brown sections and blue Kirin horn cues
- Pass/fail: white/fur/scale Kirin crossover armor cues from reference
- Pass/fail: dual blade or fast melee prop with distinctive monster-hunter materials
- Pass/fail: low agile stance
- Pass/fail: practical scale/plate materials
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## V1 Result

| Requirement | V1 |
| --- | --- |
| Pale white hair with pink-brown sections and blue Kirin horn cues | fail, dark-haired black mask redesign |
| White/fur/scale Kirin crossover armor | fail, black-red ninja armor dominates |
| Dual blade/fast melee prop | pass |
| Low agile stance | pass with monitor |
| Practical scale/plate materials | partial |
| Young beautiful female casting | pass with mask monitor |
| Real skin/hair/fabric | pass with monitor |
| Downstream usable | fail |

## V2 Requirement

- Regenerate from official base reference with pale hair, blue horn, white fur/scale armor, waist belt, leg armor, and dual blades visible.
- Block any generic black-red ninja or dark-haired assassin redesign.

## V2 Result

| Requirement | V2 |
| --- | --- |
| Pale white hair with pink-brown sections and blue Kirin horn cues | pass |
| White/fur/scale Kirin crossover armor | pass |
| Opaque practical live-action coverage | pass |
| Dual blade/fast melee prop | pass |
| Low/agile hunter stance | pass |
| Practical scale/plate materials | pass |
| Young beautiful female casting | pass |
| Real skin/hair/fabric | pass with monitor |
| Downstream usable | pass with monitor |

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is attractive but not recognizably Kirin R Yato.
- Block if the image hides the character-defining costume or prop silhouette.
