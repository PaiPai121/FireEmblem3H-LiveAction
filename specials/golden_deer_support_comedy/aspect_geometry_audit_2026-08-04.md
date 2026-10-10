# Golden Deer Support Comedy Aspect Geometry Audit - 2026-08-04

## Reason

User review reported multiple frames looking flattened/squashed. The previous gate only checked file dimensions (`1280x720`) and missed visible content distortion. That review was not sufficient.

## Production Cause Found

- `scripts/apply_gdsc_ep02_visual_revisions.py` previously used direct `resize(OUT_SIZE)`, which can non-uniformly stretch a non-16:9 source into 16:9.
- `scripts/apply_gdsc_timing_frame_repairs.py` and `scripts/apply_gdsc_v2_visuals.py` also contained direct delivery-frame resize paths.
- These paths are now changed to aspect-safe crop/fit behavior, and `scripts/check_gdsc_aspect_safety.py` hard-fails direct delivery-frame resize in Golden Deer apply scripts.

## Visual Review Surfaces

- `EP01_hilda_lorenz/aspect_review_contact_2026-08-04.jpg`
- `EP02_hilda_marianne/aspect_review_contact_2026-08-04.jpg`
- `EP03_hilda_lysithea/aspect_review_contact_2026-08-04.jpg`
- `EP04_claude_lorenz/aspect_review_contact_2026-08-04.jpg`

## Results

| Episode | Aspect Geometry Result | Notes |
| --- | --- | --- |
| EP01 Hilda x Lorenz | manual_visual_pass_no_flattening_observed | No obvious horizontal face/body flattening on large contact sheet. Duplicate-frame risk remains separate. |
| EP02 Hilda x Marianne | mixed; SH003A repaired, others pass no-flattening review | `005_GDSC02-SH003A` was replaced with individually generated native 16:9 start/key/end frames. `010_GDSC02-SH004C` still has edge-crop composition risk, but not flattening. |
| EP03 Hilda x Lysithea | manual_visual_pass_no_flattening_observed | No obvious flattening; duplicate/copy-frame blocker remains. |
| EP04 Claude x Lorenz | manual_visual_pass_no_flattening_observed | No obvious flattening; duplicate/copy-frame blocker remains. |

## Repaired Asset

`EP02_hilda_marianne/delivery/video_generation_package_2026-07-31_timing_safe/shots/005_GDSC02-SH003A`

- Replaced `start_frame.png`, `key_frame.png`, and `end_frame.png`.
- New sources were written back into `EP02_hilda_marianne/visual_revisions_2026-08-03/005_GDSC02-SH003A` so future viewer refreshes do not restore the old flattened frames.
- Metadata now includes `aspect_geometry_review_2026_08_04.result = manual_visual_pass_after_single_frame_regeneration`.

## Current Decision

Aspect distortion is no longer treated as passed by file size alone. The Golden Deer package remains blocked overall because repeated/copy frame anchors and some composition/story-readiness issues are separate blockers.
