# Zuo Le Candidate QA

Reviewed: 2026-07-28T07:14:37.869Z

Decision: `blocked_needs_revision`
Status: `superseded_costume_failed`

## Failure-First Review

P0 blocker found after visual review against `references/wiki_terra_zuo_le_base.png`: the candidate has a good young swordsman face, but the official operator identity is too weak.

## Blockers

- Costume/silhouette fail: red cloak lining, box/shield equipment, tail, and official armor-robe structure are missing.
- Hair drift: reads as generic black-haired period swordsman rather than short dark-blue-haired Zuo Le.
- Downstream risk: video prompts would preserve the wrong generic wuxia wardrobe.

## Required Follow-Up

- Regenerate with blue hair, red cloak lining, navy/black official layers, sword, tail, and box/shield equipment locked.

## Gate

Blocked. Former `selected.png` was demoted to `selected_demoted_base_v1_costume_failed.png`.
