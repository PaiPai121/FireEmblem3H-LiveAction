# Shot032 Healing Homage Visual Audit

Date: 2026-08-10
Decision: visual_review_passed_monitor_required_before_video

## Old Visual Decision

Old frame set: blocked_needs_revision
- old start/key/end read too much like posed stills instead of injury/intervention/recovery
- old end frame became a calm standing portrait
- offscreen pressure vector was too weak for expensive video generation

## New Frame Findings

- start frame now shows Dedue low under screen-right pressure while Mercedes moves in from behind-left
- key frame now shows the healing pulse causing a physical recovery rather than a decorative glow
- end frame now keeps Dedue low and shield-forward while Mercedes is spent and no longer active

## Frame Evidence

- start_frame: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/healer_tank_homage_2026-08-10/22C_Shot032_healer_tank_homage_start.png` / sha256 `99f2e654557dc70c345cb9c1ca4acb985ca55c62ab9aa16d8b365afa4d6f2f50`
- key_frame: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/healer_tank_homage_2026-08-10/22C_Shot032_healer_tank_homage_key.png` / sha256 `82569c1037c27b9fb175aa279b1668a3e596a2b6bebfefe9b3487b54eb09bdf7`
- end_frame: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/healer_tank_homage_2026-08-10/22C_Shot032_healer_tank_homage_end.png` / sha256 `d391801687b4e65b6ec30079602e904231336436d0efcdb41f76c8b8653b6df8`

## Residual Risks

- video model may exaggerate healing VFX; prompt and negative prompt now ban oversized spell circles and blue/green lightning
- video model may relax the end into a portrait; prompt now requires low shield-wall stance through the cut
