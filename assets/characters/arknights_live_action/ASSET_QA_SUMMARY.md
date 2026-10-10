# Arknights Live-Action Asset QA Summary

Last reviewed: 2026-07-31T00:00:00.000Z

## Current Gate

Only `selected.png` files with an approved realism-gate review are production-ready. Candidate, monitor, blocked, rejected, and `selected_missing_realism_gate` images may be shown in the panel for review, but they are not approved identity locks for downstream video packages.

Active global gates:

- `CASTING_STYLE_BIBLE.md`: young-adult beautiful, clearly adult, distinct operator face.
- `REALISM_STYLE_BIBLE.md`: real actor / practical wardrobe fitting / grounded production-photo realism.

Latest gate audit:

- `selected`: 30
- `selected_missing_realism_gate`: 0
- `candidate_blocked_revision`: 1
- `rejected`: 11
- `needs_reference`: 2
- `scaffolded`: 5
- Audit file: `realism_gate_audit.json`

All remaining `selected.png` assets now have an approved realism-gate review. Older selected assets that failed visual review were not deleted; they were demoted to explicit `selected_demoted_*` files and must not be used as downstream identity locks.

## Latest Batch

- The current production-ready selected roster is 30 operators.
- All 30 selected assets have approved realism-gate review coverage.
- No selected asset is missing `selected.png`, candidate review, costume audit, identity locks, or realism-gate approval.

Realism remediation started with Kal'tsit:

- `Kaltsit/candidates_young_v2/` was demoted to monitor.
- `Kaltsit/candidates_realism_v4/` was the first candidate approved under both casting and realism gates.
- `Kaltsit/candidates_realism_v5/` supersedes v4 as the younger current selected asset.

Nian remediation:

- `Nian/candidates_realism_base_v10/` supersedes the previous pre-realism selected image.
- Nian's selected asset now uses the base outfit as costume authority; Thunderbolt Director remains role/mood support only.

Wiš'adel remediation:

- `Wisadel/candidates_realism_v5/` supersedes the previous selected image under the realism gate.
- Wiš'adel is approved as a still identity lock with mandatory downstream monitor for weapon/cable/spike motion drift.

Texas the Omertosa remediation:

- `Texas_the_Omertosa/candidates_base_v1/` has been re-reviewed and approved under the realism gate.
- Texas remains selected without regeneration because the existing image already reads as a grounded production wardrobe reference.

Surtr remediation:

- `Surtr/candidates_base_v1/` has been re-reviewed and approved under the realism gate.
- Surtr remains selected without regeneration; downstream prompts must monitor massive blade and dress/lining drift.

Ch'en remediation:

- `Chen/candidates_base_v1/` has been re-reviewed and approved under the realism gate.
- Ch'en remains selected without regeneration; downstream prompts must monitor sword/scabbard, horn ornaments, side ponytail, and badge detail drift.

Exusiai remediation:

- `Exusiai/candidates_base_v2/` has been re-reviewed and approved under the realism gate.
- Exusiai remains selected without regeneration; downstream prompts must monitor halo, wing shards, safe lowered firearm prop, and non-readable abstract sleeve/badge markings.

Logos remediation:

- `Logos/candidates_base_v1/` has been re-reviewed and approved under the realism gate.
- Logos remains selected without regeneration; downstream prompts must monitor ornate back ribbons/head ornaments and young-androgynous age/read drift.

SilverAsh remediation:

- `SilverAsh/candidates_realism_young_v3/` supersedes the previous selected image under the realism and young-adult casting gates.
- `SilverAsh/candidates_realism_young_v2/` remains monitor because it still read too mature.

Saria remediation:

- `Saria/candidates_realism_young_v2/` was demoted after user review because the image still read too mature/harsh and not young-pretty enough.
- `Saria/candidates_realism_young_v3/` now contains the replacement selected image and approved review.
- Saria's identity lock has been corrected from mature-woman casting to young-adult executive-scientist authority.

Mudrock remediation:

- `Mudrock/candidates_base_v1/` has been re-reviewed and approved under the realism gate.
- Mudrock remains selected without regeneration because the armor-first treatment is stronger than an uncovered beauty redraw.

Final selected-missing remediation:

- Nearl the Radiant Knight and Executor the Ex Foedere were re-reviewed and approved under the realism gate, with monitor notes for promotional lighting, skin polish, halo/rear ornament drift, and downstream motion locks.
- Phantom, Passenger, and Specter the Unchained were re-reviewed and approved under the realism gate, with monitor notes for gothic/vampire, machine-device, and horror-nun drift.
- Penance, Qiubai, Hoederer, Zuo Le, Kirin R Yato, Fiammetta, Stainless, Ebenholz, Gnosis, Flametail, Saileach, and Fartooth were regenerated or restored into approved young-realism replacement selected assets after earlier failures in age, costume, weapon, headgear, palette, or official-reference identity.
- Degenbrecher and Eyjafjalla were additionally regenerated into approved young-realism selected assets, bringing the selected roster to 30.

Resolved generation blocker:

- Built-in image generation recovered. Replacement folders that received usable generated candidates now have approved reviews; unresolved non-selected operators remain visible as candidate, monitor, rejected, needs-reference, or scaffolded rather than being promoted.

Latest detailed report: `BATCH_2_QA_REPORT.md`

## Previous Reports

- `FIRST_BATCH_QA_REPORT.md`
- `BATCH_30_QA_REPORT.md`
