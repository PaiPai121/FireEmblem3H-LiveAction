# Video Generation Runbook

Project: blue_lions_black_history
Package: video_generation_package_2026-07-26
Target runtime: 60 seconds
Primary video target: Seedance 2.0-class image-to-video with audio/dialogue support
Veo fallback: rebuild a split package first if the available Veo endpoint is limited to shorter clips
Status: approved_for_video, clips pending

## What Is Ready

This package is ready for downstream video generation. Each shot folder contains:

- `prompt.md`
- `negative_prompt.md`
- `metadata.json`
- `start_frame.png`
- `key_frame.png`
- `end_frame.png`

The prompts include full Japanese dialogue lines and explicitly request no subtitles. The scene adapts the Sylvain/Ingrid support dynamic into a one-minute comedy beat: Sylvain tries to teach social skills, Ingrid calmly turns him into the cautionary example.

## What Is Still Missing

1. Generate five image-to-video clips.
2. Save clips to `clips/SIBH-SH001.mp4` through `clips/SIBH-SH005.mp4`.
3. Run `clip_qa_checklist.md`.
4. Concatenate approved clips into `final_edit.mp4`.

## How To View Assets

Open `asset_viewer.html` in a browser.

The visual audit contact sheet is also available in the source project:

`../../production_system/reviews/visual_contact_sheet_2026-07-26.jpg`

## Manual Web-UI Submission

For each row in `submission_queue.csv`:

1. Open the `shot_dir`.
2. Upload `start_frame.png`, `key_frame.png`, and `end_frame.png` if the model supports three image anchors.
3. Paste `prompt.md` into the positive prompt field.
4. Paste `negative_prompt.md` into the negative prompt field.
5. Set duration to the listed `duration_seconds`.
6. Disable subtitles/captions/text overlays.
7. Set identity/reference preservation high and camera motion minimal.
8. Generate one clip.
9. Save the downloaded mp4 to the listed `expected_clip`.
10. Review with `clip_qa_checklist.md` before generating final assembly.

If the model supports only start/end images, use `start_frame.png` and `end_frame.png` as hard anchors, then keep `key_frame.png` open as the manual QA reference for the action peak.

Recommended model path: Seedance 2.0-class first. Use reference strength high, creativity low to medium-low, camera motion minimal, face enhancement off, and auto subtitles/captions off.

## Submission Order

1. `shots/001_SIBH-SH001` - 10s - Sylvain starts the social-skills lesson.
2. `shots/002_SIBH-SH002` - 10s - Ingrid interrupts and claims better examples.
3. `shots/003_SIBH-SH003` - 12s - Ingrid begins the old-history audit; Sylvain asks her to lower her voice.
4. `shots/004_SIBH-SH004` - 16s - Ingrid stacks examples; Sylvain asks whether this is a trial.
5. `shots/005_SIBH-SH005` - 12s - Ingrid lands the lesson: do not imitate Sylvain.

## CLI Submission

The package includes a dry-run execution plan. To execute automatically, configure a real video model command in `VIDEO_MODEL_CLI_ARGV_JSON`.

The runner accepts these placeholders:

```text
{shot_id} {order} {duration} {prompt} {negative_prompt}
{start_frame} {key_frame} {end_frame} {output}
```

Example shape:

```bash
export VIDEO_MODEL_CLI_ARGV_JSON='["your-video-cli","i2v","--prompt","{prompt}","--negative","{negative_prompt}","--first","{start_frame}","--key","{key_frame}","--last","{end_frame}","--duration","{duration}","--out","{output}"]'
node /Users/zekun/.codex/skills/cinematic-production-pipeline/scripts/run_video_generation_package.js /Users/zekun/FireEmblem3H-LiveAction/specials/blue_lions_black_history/delivery/video_generation_package_2026-07-26 --execute --concat --out /Users/zekun/FireEmblem3H-LiveAction/specials/blue_lions_black_history/delivery/video_generation_package_2026-07-26/final_edit.mp4
```

Replace `your-video-cli` and its flags with the actual video tool you choose.

## Hard Rejects

- A named character's face no longer matches the input frames.
- Lip-sync reshapes the mouth, teeth, jaw, cheeks, or whole face.
- Sylvain is recast, aged up, predatory, hostile, or romantically intense.
- Ingrid is recast, aged up, jealous, cruel, or openly mocking.
- Notes show readable text.
- Extra students become visible main subjects.
- Subtitles, captions, logos, watermarks, or UI text appear.
- Screen direction reverses across adjacent shots.
- Corridor/classroom-door geography drifts so cuts no longer match.
- The ending becomes romance instead of friendship-based comedy.

## Rerun Policy

Try one narrow rerun before changing the shot design.

Use the same frames and shorten the prompt to:

1. Preserve identity, costume, prop, and setting exactly from the frames.
2. Animate only the action named in Motion.
3. Keep camera movement minimal.
4. Apply all Reject If items.

If the same P0 issue appears twice, mark the shot `blocked_needs_revision` in clip QA before generating alternatives.

## Face Drift Rerun Recipe

If the face does not match the still frames, rerun with these changes before changing visuals:

1. Use `start_frame.png` as the strongest face reference or first-frame anchor.
2. Reduce expression and mouth motion by half.
3. Ask for small, restrained Japanese dialogue articulation.
4. Remove broad performance words such as "big", "dramatic", "theatrical", or "energetic".
5. Keep the camera locked or nearly locked.
6. Prefer shorter clips and stitch if the model drifts over time.
