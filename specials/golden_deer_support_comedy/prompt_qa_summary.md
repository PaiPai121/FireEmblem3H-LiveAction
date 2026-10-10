# Golden Deer Support Comedy - Video Prompt QA Summary

Blocking Issues
- None.

Monitor Risks
- Downstream generated clips still require clip QA for face, hand, wardrobe trim, mouth-shape, and subtitle/text drift. This is an execution risk, not a prompt blocker.

Prompt Contract Check
- 4/4 episode-level prompt.md files pass the video-prompt-qa contract validator.
- 16/16 shot-level prompt.md files pass the video-prompt-qa contract validator.

Frame Lock Check
- 16/16 shots provide start_frame.png, key_frame.png, and end_frame.png and explicitly reference all three in prompt text.

Motion / Camera / Performance Check
- Prompts are restrained Seedance image-to-video instructions rather than new story briefs.
- Character identity and academy-phase age locks are repeated per shot.

Continuity / Edit Fit
- Every shot is <= 15 seconds; every episode totals 60 seconds.
- No prompt introduces subtitles, new core conflict, new named characters, weapons, combat escalation, or non-canon story turns.

Negative Prompt Check
- Negative prompts explicitly ban subtitles/captions/readable text and the concrete drift risks for this series.

Required Revisions
- None.

Decision
- approved_for_video

Per-Episode Reviews

| Episode | Pair | Decision | Review |
| --- | --- | --- | --- |
| EP01_hilda_lorenz | Hilda x Lorenz | approved_for_video | specials/golden_deer_support_comedy/EP01_hilda_lorenz/delivery/video_generation_package_2026-07-31_timing_safe/prompt_qa_review.md |
| EP02_hilda_marianne | Hilda x Marianne | approved_for_video | specials/golden_deer_support_comedy/EP02_hilda_marianne/delivery/video_generation_package_2026-07-31_timing_safe/prompt_qa_review.md |
| EP03_hilda_lysithea | Hilda x Lysithea | approved_for_video | specials/golden_deer_support_comedy/EP03_hilda_lysithea/delivery/video_generation_package_2026-07-31_timing_safe/prompt_qa_review.md |
| EP04_claude_lorenz | Claude x Lorenz | approved_for_video | specials/golden_deer_support_comedy/EP04_claude_lorenz/delivery/video_generation_package_2026-07-31_timing_safe/prompt_qa_review.md |
