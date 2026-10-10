# Shot Generation Requirements

Project ID: `KAK-BYLETH-LECTURE`
Stage: prompt_asset_package with real frames
Status: real_frames_complete_monitor_required

## Current Stage

Current stage is `prompt_asset_package` with all real start/key/end frames completed.

This means the project has a bible, outline, director treatment, shot list, production notes, manifests, independent reviews, per-shot prompt assets, a Chinese web review panel, and actual start/key/end PNG frames for all 34 shots. It does not yet have approved video clips or clip-level motion QA, so it should not be treated as final `approved_for_video` delivery.

## Target Ladder

```text
plan_package
prompt_asset_package
real_frames_complete_monitor_required
video_generation_package
```

## What The Current Shot List Is

The current `shot_list.md` is the source ordered production plan. Each shot now also has prompt/spec files, SVG layout references, and PNG frame inputs.

## Minimum Contract For Every Generated Shot

Every real shot needs:

```text
Shot ID
Script Beat
Shot Purpose
Duration Target
Location
Characters Visible
Character Identity Locks
Asset References
Start Frame Intent
Key Frame Intent
End Frame Intent
Camera
Blocking
Screen Direction
Action Peak
Dialogue / Audio Anchor
Edit In
Edit Out
Continuity Requirements
Motion Risks
Reject If
```

## What Exists Before Video Clip Generation

For each shot:

1. `frame_spec.md`
2. `prompt.md`
3. `negative_prompt.md`
4. `start.png`
5. `key.png`
6. `end.png`
7. package manifest entry with expected clip path

These now exist for SH001-SH034. The current web-visible review copies live under `delivery/real_frame_preview_kakeya_byleth_2026-07-28/shots/`, and the source real frames live under `real_frames/`.

## What Exists For Video Readiness

For each shot:

1. Actual `start.png`, `key.png`, and `end.png`, unless explicitly still-only.
2. Visual review proving the frame captures the intended beat.
3. Prompt review proving motion instructions lock identity, action, camera, and mathematical diagrams.
4. Adjacent-shot continuity review.
5. Status `approved_for_video`.

Items 1-4 exist for prompt and real-frame review. Item 5 is intentionally not set yet: every shot remains `monitor_required` until a configured video model produces motion probes or clips and clip-level QA approves identity, diagrams, camera motion, and edit continuity.

## Female Byleth Locks

- Use `assets/characters/protagonist/BylethFemale/professor/selected.png`.
- Optional weapon/fullbody reference: `assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png`.
- 16-year-old calm young teacher / former mercenary protagonist.
- Teal-blue medium-length hair, green eyes, canon academy Female Byleth outfit: black short capelet, high collar, cropped black top, gold chest ornament, silver forearm armor, patterned black tights, asymmetric knee guard, tall boots, belts and harness details.
- Reject male Byleth, mature adult mentor, ordinary student, generic sorceress, revealing outfit, modern teacher.

## Mathematical Frame Locks

- Deltoid shots must show unit-needle scale `a=1/4`, not radius `1/3`.
- Convex shots must show the equilateral triangle as the convex optimum only.
- Perron shots must visibly separate cut, slide, overlap, and iteration.
- Tube shots must visibly show `delta`, `alpha`, and the overlap patch.
- Impact shots must stay tied to tube overlap, maximal averages, and wave packets.

## What The Page Images Are

The page now shows the actual PNG start/key/end frames for every shot. SVG layout reference frames remain in the shot folders as editable source references.

The next actionable stage is `video_generation_run`: configure a real model command with `VIDEO_MODEL_CLI_ARGV_JSON`, submit short motion probes or clips in shot order, save clips to each shot's `expected_clip` path, then run clip-level motion QA before promoting any shot to `approved_for_video`.
