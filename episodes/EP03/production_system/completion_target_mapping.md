# EP03 Completion Target Mapping

This adapter defines the authoritative scope for EP03 inside the mixed legacy repository.

## Scope

- Active sequence: `episodes/EP03`
- Current frame source: `production_system/video_delivery_manifest.json` `current_display_frame_set` and `displayed_frame_set.frames`
- Root generation evidence: `../../production_system/generation_contract.json`, `../../production_system/generation_state.json`, and `../../production_system/generation_receipts.json`

The repository root also contains older EP02/scene09 ledgers. A generic root completion check can therefore report unrelated EP02 shot IDs; those errors do not describe EP03 and must not promote or reject this sequence.

## Current Evidence

- 36 shots, 108 current START/KEY/END files present.
- 108/108 current frames have passing still-frame review receipts.
- 36/36 video prompt contracts pass structural QA.
- Complete package, motion probe package, and local asset storyboard viewer all have zero missing local `href/src` references.
- Shot026–029 combat choreography passes isolated review; motion remains monitor-only.
- Isolated dialogue pacing passes; Shot026 native model audio still needs a real short probe.

## Not Yet Complete

EP03 is not a `video_generation_package`: every shot remains `monitor_required`, no real motion-probe clip exists, and no shot has been promoted to `approved_for_video`. The motion package is a submission queue with `clips_pending`, not a generated video.
