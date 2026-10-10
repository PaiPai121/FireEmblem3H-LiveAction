# Saileach Costume Reference Audit

Reference file: `references/wiki_terra_saileach_base.png`

Status: `selected`

Current decision:

- `candidates_realism_young_v2/candidate_01.png` passes for selected use.
- Former `selected.png` was demoted to `selected_demoted_base_v1_palette_headgear_failed.png`.

## V2 Result

- Pass: long blonde twin braids and blue headpiece.
- Pass: blue-white-black military flagbearer uniform.
- Pass: white legwear and silver-blue armor accents.
- Pass: huge blue-and-yellow battle flag on lance/spear pole.
- Pass: young adult female casting with noble flagbearer read.
- Pass: face is distinct from other selected operators.
- Monitor: polished studio/cosplay risk; downstream prompts must use natural skin texture and practical fabric.

## Required Checks Before Selection

- Pass/fail: long blonde twin braids and blue headpiece
- Pass/fail: blue-white-black military flagbearer uniform
- Pass/fail: huge blue-and-yellow flag on lance/spear pole
- Pass/fail: upright public-command stance
- Pass/fail: tailored fabric and brass details
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is attractive but not recognizably Saileach.
- Block if the image hides the character-defining costume or prop silhouette.
