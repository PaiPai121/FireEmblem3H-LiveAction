# EP04 Production Notes

## Completion target

Target: `prompt_asset_package`

This first production pass includes the source audit, project bible, adapted script, director treatment, 28-shot list, dialogue timing, coverage/transition/animatic plans, combat choreography, local reference manifest, per-shot frame specs, executable video prompts, negative prompts, delivery manifest, review manifest, and canonical web review surface.

START/KEY/END images are intentionally `frames_pending`. This is a prompt package, not a `video_generation_package`, and no shot is `approved_for_video`.

## Local reference policy

`source/reference_pack/` is the package-local, hash-recorded reference pack. It contains reusable identity/location/style references copied inside the active EP04 boundary so downstream validators cannot silently reach into another episode or the parent workspace. `source_refs/game_frame_*.jpg` and contact sheets remain `planning_only` and may not be uploaded as final live-action frames.

## Required next stage

Generate and visually review three integrated live-action frames per shot under `storyboards/ShotNNN/frames_pending/` or a versioned frame-set directory. Then run prompt-against-frame QA, adjacent-shot continuity QA, the action/combat review, the Japanese dialogue/audio probe, and the rendered web-panel visual QA before promoting any shot to `approved_for_video`.

## Model target assumption

The prompt syntax is model-agnostic and prepared for an image-to-video model with three uploaded image anchors. A local `model_target_profile.md` records the assumption; the user did not specify a vendor/model. Do not treat this assumption as a locked external delivery setting.
