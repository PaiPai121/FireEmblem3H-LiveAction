# Character Visual And Class Variant Queue

Date: 2026-07-17

This queue consolidates the local audit and the clean-context subagent review. It is not a full all-classes matrix; it is the next production queue for visible gaps and high-risk characters.

## P0 Visual Regeneration

| Character | Asset | Problem | Required direction | Output target |
|---|---|---|---|---|
| Mercedes | `assets/characters/blue_lions/Mercedes/academy/selected.png` | Reads too mature and polished for an academy-age Mercedes. | 18-year-old academy student, softer rounder face, gentle healer presence, less glam portrait, preserve blonde side ponytail and warm modest expression. | `assets/characters/blue_lions/Mercedes/academy/candidates_young_18_v4/` |
| Seteth | `assets/characters/church_of_seiros/Seteth/academy/selected.png` | Too young, too model-like, too beautiful. | Older severe church administrator, stern eyes, sharper authority, short beard/mustache, clerical restraint, not romantic hero, not student-like. | `assets/characters/church_of_seiros/Seteth/academy/candidates_severe_admin_v3/` |

## P1 Visual Regeneration

| Character | Asset | Problem | Required direction | Output target |
|---|---|---|---|---|
| Annette | `assets/characters/blue_lions/Annette/academy/selected.png` | Usable, but can still read too polished/mature. | 18-year-old academy student, petite, rounder youthful face, energetic but slightly awkward charm, less adult glam. | `assets/characters/blue_lions/Annette/academy/candidates_young_18_v4/` |
| Manuela | `assets/characters/church_of_seiros/Manuela/academy/selected.png` | Usable, but can carry more former-opera-star beauty and confidence. | More glamorous and beautiful adult teacher, confident theatrical presence, still tasteful academy faculty styling. | `assets/characters/church_of_seiros/Manuela/academy/candidates_stage_beauty_v3/` |

## P0 Scene09 Asset Rule

No Scene09 video payload should be considered ready while its `image_path` is either:

- an `.svg` tactical map under `episodes/EP02/generated/mock_battle_canon_map_2026-07-17/`;
- an old `p1_mock_battle_v1` PNG under `episodes/EP02/generated/p1_mock_battle_v1/`.

The required replacement target is `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/`.

## P0/P1 Class Variant Coverage

### P0 Church Of Seiros

These characters mostly have only `academy` and `war` variants and need class/job coverage before major Church-heavy battle scenes:

- Catherine
- Shamir
- Seteth
- Flayn
- Manuela
- Jeritza
- Hanneman
- Alois
- Gilbert
- Rhea
- Cyril

### P1 Golden Deer

These characters currently have academy/war only and need battle-class variants for later Golden Deer-heavy scenes:

- Lysithea
- Marianne
- Leonie
- Lorenz
- Raphael
- Ignatz

### P2 Other Sparse Characters

- Monica needs a proper academy/class chain beyond root `selected.png` and `war`.
- Ashen Wolves currently have only academy/war and need class chains if they become story-facing.
- Anna/merchant assets remain sparse if merchant scenes become more prominent.
