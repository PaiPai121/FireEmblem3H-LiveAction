# Arknights Live-Action Reference Collection Queue

Status: active

This queue exists because named Arknights operators must not be generated from memory or broad vibes. A usable live-action candidate needs approved visual reference images first.

## Gate

Before generating any operator:

1. Save at least one approved official/user visual reference in `OperatorSlug/references/`.
2. Rewrite `OperatorSlug/identity_locks.md` from the reference, not from memory.
3. Generate 1-2 candidates only.
4. Review identity, age/read, costume/silhouette, face realism, sameface risk, and downstream video usability.
5. Promote only after strict reviewer approval. When the user explicitly allows internal strict selection, copy the approved image to `selected.png`; otherwise wait for user approval.

## Current Priority

| Rank | Operator | Slug | Reference status | Production status | Next action |
| --- | --- | --- | --- | --- | --- |
| 1 | Wiš'adel | `Wisadel` | collected | `selected` | use `selected.png`; preserve v4 weapon/silhouette locks |
| 2 | Ch'en | `Chen` | collected | `selected` | use `selected.png`; preserve sword/scabbard locks |
| 3 | Exusiai | `Exusiai` | collected | `selected` | use `selected.png`; no readable text in video prompts |
| 4 | Texas the Omertosa | `Texas_the_Omertosa` | collected | `selected` | use `selected.png`; preserve coat/tail/weapon locks |
| 5 | Surtr | `Surtr` | collected | `selected` | use `selected.png`; preserve giant blade locks |
| 6 | Ch'en the Holungday | `Chen_the_Holungday` | missing | `needs_reference` | collect real references before generation |
| 7 | Kal'tsit | `Kaltsit` | missing | `needs_reference` | collect real references before generation |
| 8 | Logos | `Logos` | missing | `needs_reference` | collect real references before generation |
| 9 | Mlynar | `Mlynar` | missing | `needs_reference` | collect real references before generation |
| 10 | Degenbrecher | `Degenbrecher` | missing | `needs_reference` | collect real references before generation |
| 11 | Ling | `Ling` | missing | `needs_reference` | collect real references before generation |
| 12 | Nian | `Nian` | collected | `selected` | use `selected.png`; base outfit is costume authority |

## Rejected Material

`Wisadel/candidates_reference_v1/candidate_01.png` is rejected. It may be shown as a negative example only and must not be used in storyboards, video prompts, contact sheets, selected assets, or delivery packages.

## Current Candidate Material

- `Nian/candidates_reference_v4/` through `Nian/candidates_reference_v9/`: blocked for promotion; do not use as selected production identity.
- `Wisadel/candidates_reference_v2/candidate_01.png`: beauty/portrait support only.
- `Wisadel/candidates_reference_v3/candidate_01.png`: historical weapon/silhouette support; v4 is selected.
- `Exusiai/candidates_base_v1/candidate_01.png`: blocked for readable/fake text drift risk; v2 is selected.
