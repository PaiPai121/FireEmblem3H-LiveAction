# EP02 Scene09 V3 Attrition Patch Visual Audit

Date: 2026-07-24

Decision: `monitor_required`

## Integrity Summary

- Reviewed 9 generated attrition-patch frames for Shot034E, Shot034F, and Shot034G.
- All 9 files exist in `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/attrition_patch_2026-07-24/`.
- All 9 frames are 1672x941 PNG files.
- No reviewed frame introduces anonymous readable students, crowds, spectators, soldiers, or background human silhouettes.

## Shot034E - Golden Deer Stand-Down

Reviewed paths:
- `35B_Shot034E_attrition_start.png`
- `35B_Shot034E_attrition_key.png`
- `35B_Shot034E_attrition_end.png`

Visual decision: `monitor_required`

What passes:
- Visible readable humans are limited to Claude, Hilda, Lorenz, Ignatz, and Leonie.
- Ingrid and other non-Golden Deer figures are removed from the defeated-house stand-down.
- The shot reads as dignified stand-down, not renewed attack or humiliation.

Monitor risks:
- Several training weapons still read sharper than ideal for a nonlethal school exercise.
- Lorenz/Leonie pole silhouettes need video rejection criteria to prevent thrusting or weapon transformation.

## Shot034F - Black Eagles Stand-Down

Reviewed paths:
- `36B_Shot034F_attrition_start.png`
- `36B_Shot034F_attrition_key.png`
- `36B_Shot034F_attrition_end.png`

Visual decision: `monitor_required`

What passes:
- Visible readable humans are limited to Edelgard and Ferdinand.
- Captured Hubert, Dorothea, and Bernadetta are absent, so the frame no longer resets them into active formation.
- The empty field space clearly supports backline attrition.

Monitor risks:
- Edelgard's practice axe and Ferdinand's pole can read too sharp unless the video prompt keeps them low, still, and non-attacking.
- The shot is usable as a V3 attrition frame chain but not ready for approval without prop-state clip QA.

## Shot034G - Blue Lions Exhausted Victory

Reviewed paths:
- `37B_Shot034G_attrition_start.png`
- `37B_Shot034G_attrition_key.png`
- `37B_Shot034G_attrition_end.png`

Visual decision: `monitor_required`

What passes:
- Visible readable humans are limited to Byleth, Dimitri, and Dedue.
- Annette, Mercedes, Ashe, Felix, Sylvain, and Ingrid do not reappear as active victory participants.
- The finish reads as quiet exhausted core victory, not a clean full-class celebration.
- Dedue's shield support carries forward the earlier Mercedes healer-tank restoration beat.

Monitor risks:
- Byleth and Dimitri weapon silhouettes still need strict nonlethal/training locks.
- Dedue's shield emblem/details may drift in motion and require clip review.

## Promotion Decision

These frames fix the major attrition-continuity blocker for the late stand-down section, but they are not `approved_for_video`. Keep Shot034E, Shot034F, and Shot034G at `monitor_required` until strict adjacent-shot continuity and weapon-prop motion review pass.
