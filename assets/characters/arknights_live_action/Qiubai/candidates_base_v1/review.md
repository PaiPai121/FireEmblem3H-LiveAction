# Qiubai Candidate QA

Reviewed: 2026-07-28T07:14:37.869Z

Decision: `blocked_needs_revision`
Status: `superseded_costume_failed`

## Failure-First Review

P0 blocker found after visual review against `references/wiki_terra_qiubai_base.png`: the candidate is attractive and young, but it is not a reliable Qiubai identity lock.

The image redesigns the official black/red/dark gray asymmetric swordswoman outfit into a white-green xianxia robe, loses the black antler/horn-like head ornament, and changes the palette and silhouette too far for downstream video prompts.

## Blockers

- Wrong costume authority: white-green robe replaces official black/red outfit topology.
- Hair/head ornament drift: pale hair and reduced headpiece do not match the base reference.
- Downstream risk: a video model would likely preserve the wrong robe and make future shots non-Qiubai.

## Required Follow-Up

- Regenerate from the official base reference with black/red/dark gray costume, long gray-black hair, black head ornament, red cloth, and sword locked.

## Gate

Blocked. Former `selected.png` was demoted to `selected_demoted_base_v1_costume_failed.png`.
