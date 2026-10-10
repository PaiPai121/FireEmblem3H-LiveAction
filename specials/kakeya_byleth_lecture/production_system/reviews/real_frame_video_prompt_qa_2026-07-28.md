# Real Frame Video Prompt QA Review

Date: 2026-07-28
Decision: monitor_required

## Scope

Reviewed and regenerated all 34 video prompts under `real_video_prompts/SH###/` after real start/key/end PNGs became available.

## Findings

- Pass: every prompt includes Shot ID, Duration, Input Frames, Motion, Camera, Performance, Audio, Continuity Locks, and Reject If.
- Pass: every prompt explicitly uses package-local `start_frame.png`, `key_frame.png`, and `end_frame.png` and names the source `real_frames/SH###/*.png` audit paths.
- Pass: prompts now instruct the model to animate the supplied frame chain, not redesign from the old storyboard layout prompts.
- Pass: Female Byleth identity locks are present on character shots; diagram-only shots reject invented presenters.
- Pass: mathematical locks cover deltoid scale, convex-only triangle, Perron cut/slide/overlap direction preservation, delta/alpha tube overlap, area-zero caution, and proof-derived impact.

## Remaining Risk

- Monitor required: these prompts are ready for image-to-video tests, but no shot is approved_for_video until generated clips pass motion, identity, math, and adjacent-cut QA.

## Reviewed Paths

- `real_video_prompts/SH001/prompt.md`
- `real_video_prompts/SH007/prompt.md`
- `real_video_prompts/SH016/prompt.md`
- `real_video_prompts/SH019/prompt.md`
- `real_video_prompts/SH025/prompt.md`
- `real_video_prompts/SH030/prompt.md`
- `real_video_prompts/SH034/prompt.md`
- `production_system/video_delivery_manifest.json`
