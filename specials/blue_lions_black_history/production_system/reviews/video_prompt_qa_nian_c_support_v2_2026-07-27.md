# Video Prompt QA - Nian C-Support V2

Status: approved_for_video
Date: 2026-07-27

## Scope

Reviewed `video_prompts/SIBH-SH001.md` through `video_prompts/SIBH-SH005.md` and the matching negative prompts.

## Checks

- Prompt contract: pass.
- Dialogue lines: pass. Each shot includes Japanese adapted dialogue or explicit no-dialogue guidance.
- Model target: pass. Prompts are written for Seedance-style image-to-video with start/key/end frame anchors.
- Subtitle control: pass. Every shot requests no subtitles; negatives ban subtitles/text.
- Nian continuity: pass. SH001 permits Nian cameo; SH002-SH005 explicitly exclude Nian.
- Character tone: pass. Ingrid is firm but not cruel or jealous; Sylvain is embarrassed and playful, not predatory or hostile.

Decision: approved_for_video.
