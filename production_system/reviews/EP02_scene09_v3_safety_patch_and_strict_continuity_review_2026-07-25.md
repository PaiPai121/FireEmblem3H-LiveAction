# EP02 Scene09 V3 Safety Patch And Strict Continuity Review

Date: 2026-07-25

Decision: `monitor_required`

## Integrity Summary

- Active manifest: `production_system/video_delivery_manifest.json`
- V3 shots in active manifest: 42
- Adjacent cuts expected by strict continuity gate: 41
- Prompt/frame missing paths: 0
- `PENDING` end-frame references: 0
- V3 prompt contract: 42/42 passed
- Captured-character reappearance check: 0 later readable appearances for captured Hubert, Dorothea, or Bernadetta

## Safety Patch Applied

The following frame chains were replaced with safer V3 assets:

- `Shot033B`: replaced old group-to-closeup hard jump with a two-person Ashe/Hanneman stair-axis chain.
- `Shot033D`: replaced Ingrid's sharp route-stab read with a three-person noncontact positioning-drill chain.
- `Shot034C`: replaced Felix/Ferdinand body-aimed weapon read with a two-person stand-down route-block chain.

New assets:

- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/29C_Shot033B_safe_start.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/29C_Shot033B_safe_key.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/29C_Shot033B_safe_end.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/31C_Shot033D_safe_start.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/31C_Shot033D_safe_key.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/31C_Shot033D_safe_end.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/32C_Shot034C_safe_start.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/32C_Shot034C_safe_key.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/32C_Shot034C_safe_end.png`

Review contact sheet:

- `production_system/reviews/scene09_v3_safety_patch_contact_sheet_2026-07-25.png`

## Per-Shot Visual Audit

| Shot | Visible Named Only | Visual Decision | Notes |
| --- | --- | --- | --- |
| Shot033B | Ashe, Hanneman | `visual_review_passed_monitor_required_for_motion` | New start/key/end preserve one stair-axis setup, two readable humans, no projectile release, no crowd, and a clear end state where Hanneman's classroom-magic angle is closed. |
| Shot033D | Ingrid, Manuela, Sylvain | `monitor_required` | New chain removes the old spear-like contact read. Ingrid's guide pole is still visually prominent, so generated motion must be checked to ensure it remains a route marker rather than a thrust. |
| Shot034C | Felix, Ferdinand | `visual_review_passed_monitor_required_for_motion` | New chain keeps Felix's wooden practice sword lowered and Ferdinand's pole vertical/down, turning the beat into a positional stand-down instead of a strike. |

## Strict Continuity Gate

Command:

`node ~/.codex/skills/cinematic-production-pipeline/scripts/continuity_gate.js /Users/zekun/FireEmblem3H-LiveAction --strict`

Result:

- Total adjacent pairs: 41
- Passed: 0
- Failed: 41

This is expected at the current stage because all continuity pair decisions remain `monitor_required` or conditional. The safety patch fixes three visual P0 risks, but it does not create clip-level motion evidence or final adjacent-pair approval.

## Remaining Risks

- No generated video clips exist yet, so motion interpolation is unverified.
- All 42 shots remain `monitor_required`.
- Wide Shot034 still depends on small representative figures, so identity/weapon drift must be checked after video generation.
- Shot033D still needs clip QA to prevent the horizontal guide pole from becoming a thrust.

## Promotion Decision

Highest completed target remains `prompt_asset_package`.

Do not promote the package to `approved_for_video` until:

- each generated clip is reviewed against its start/key/end chain;
- all 41 strict continuity pairs pass with all checks marked `pass`;
- `production_system/video_delivery_manifest.json` statuses are promoted per shot;
- immutable `delivery/` output is built.
