# First Batch Arknights Live-Action QA Report

Updated: 2026-07-27

Batch:

- Nian
- Wiš'adel
- Ch'en
- Texas the Omertosa
- Exusiai
- Surtr

## Gate Decision

All six first-batch operators have selected production references:

| Operator | Selected Image | Decision |
| --- | --- | --- |
| Nian | `Nian/selected.png` | `selected` |
| Wiš'adel | `Wisadel/selected.png` | `selected` |
| Ch'en | `Chen/selected.png` | `selected` |
| Texas the Omertosa | `Texas_the_Omertosa/selected.png` | `selected` |
| Exusiai | `Exusiai/selected.png` | `selected` |
| Surtr | `Surtr/selected.png` | `selected` |

## Sameface / Silhouette Review

- Nian: cute mischievous face, white hair/red horns, light coat/red top/shorts, tail and BTS props.
- Wiš'adel: sharper dangerous face, white/dark hair, red sleeve, black strapped core, giant mechanical weapon.
- Ch'en: disciplined serious face, dark blue-purple hair, black jacket/white shirt/tie, red-black sword.
- Texas the Omertosa: calm tired face, long dark hair, wolf ears, black-white-blue coat silhouette, pale tail and long weapon.
- Exusiai: bright rounder grin, short red/pink hair, halo, wing shapes, white/black/pink streetwear.
- Surtr: aloof sharp face, vivid red hair, black horn-like headpieces, black dress/coat and giant blade.

The selected images have distinct hair color, facial expression habits, silhouette, palette, and prop language. No selected first-batch character currently reads as the same model with different styling.

## Known Downstream Locks

- Nian: use base outfit only; director role is props/performance.
- Wiš'adel: lock weapon scale and red sleeve.
- Ch'en: lock sword/scabbard and blue-white sleeve bands.
- Texas: lock tail, coat lining, blue accents, and long weapon.
- Exusiai: lock halo/wing shapes and specify no readable text.
- Surtr: lock giant blade shape and black/white dress silhouette.

## Blocked Material

- Nian old director-skin attempts v4-v9 remain blocked/superseded.
- Wiš'adel v1 remains rejected.
- Exusiai v1 is blocked because visible readable/fake text creates downstream video drift risk.

## Decision

`approved_for_next_stage`
