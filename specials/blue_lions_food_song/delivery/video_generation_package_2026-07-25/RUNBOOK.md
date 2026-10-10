# Video Generation Runbook

Project: blue_lions_food_song
Package: video_generation_package_2026-07-25
Target runtime: 60 seconds
Primary video target: Seedance 2.0-class image-to-video with audio/dialogue support
Veo fallback: rebuild a split package first if the available Veo endpoint is limited to 8s clips
Status: approved_for_video, clips pending

## What Is Still Missing

The full-video prompt package is ready for generation. SH001 uses a complete adapted English food song, not a copied source lyric; spoken dialogue remains Japanese.

Remaining downstream work:

1. Generate five image-to-video clips.
2. Save the clips to `clips/BLFS-SH001.mp4` through `clips/BLFS-SH005.mp4`.
3. Run clip QA with `clip_qa_checklist.md`.
4. Concatenate approved clips into `final_edit.mp4`.
5. Add recorded Japanese dialogue/song audio using `../../voice_subtitle_script.md` if the video tool does not render audio directly.
6. Do not generate subtitles in this pass. Add subtitles later only as a separate post-production layer if needed.

If exact source-lyric fidelity is required, replace SH001's adapted song with the user-provided exact source lyric before generation.

Use `model_target_profile.md` for model-specific settings before submitting. The current five-shot queue is Seedance-oriented. For Veo, do not submit unchanged unless the selected endpoint supports the listed 12s and 14s shots; otherwise create a separate Veo split queue.

## How To View Assets

Open `asset_viewer.html` in a browser.

Each shot folder also contains the raw files:

- `prompt.md`
- `negative_prompt.md`
- `metadata.json`
- `start_frame.png`
- `key_frame.png`
- `end_frame.png`

## Manual Web-UI Submission

Use this when generating clips in a web product such as an image-to-video model UI that can create full video with audio/dialogue.

For each shot in `submission_queue.csv`:

1. Open the shot folder named in `shot_dir`.
2. Upload `start_frame.png`, `key_frame.png`, and `end_frame.png` if the model supports three image anchors.
3. Paste `prompt.md` into the positive prompt field. The prompt now includes visual action plus `Dialogue / Vocal Lines`.
4. Paste `negative_prompt.md` into the negative prompt field.
5. Set duration to the shot duration.
6. Generate one clip.
7. Save the downloaded mp4 to the `expected_clip` path.
8. Review it against `clip_qa_checklist.md` before moving on.

If the model supports only start/end images, use `start_frame.png` and `end_frame.png` as hard anchors, then keep `key_frame.png` open as a visual reference while reviewing.

For SH001, keep the singing soft, in tune, and small-mouthed. Do not let the tool make it a stage performance.

Recommended model path: Seedance 2.0-class first. Set reference/identity preservation high, creativity low to medium-low, camera motion minimal, face enhancement off, and auto subtitles/captions off.

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
node /Users/zekun/.codex/skills/cinematic-production-pipeline/scripts/run_video_generation_package.js /Users/zekun/FireEmblem3H-LiveAction/specials/blue_lions_food_song/delivery/video_generation_package_2026-07-25 --execute --concat --out /Users/zekun/FireEmblem3H-LiveAction/specials/blue_lions_food_song/delivery/video_generation_package_2026-07-25/final_edit.mp4
```

Replace `your-video-cli` and its flags with the actual video tool you choose.

## Submission Order

1. `shots/001_BLFS-SH001` - 12s - private song and step-turn-pour rhythm.
2. `shots/002_BLFS-SH002` - 8s - Felix reveal without mockery.
3. `shots/003_BLFS-SH003` - 12s - contained embarrassment and tiny over-pour.
4. `shots/004_BLFS-SH004` - 14s - unsmiling sincere footwork praise.
5. `shots/005_BLFS-SH005` - 14s - watering payoff and plant-singing deadpan.

## Hard Rejects

Reject and rerun if any generated clip does one of these:

- A named character's face no longer matches the input frames.
- Lip-sync reshapes the mouth, teeth, jaw, cheeks, or whole face.
- The model recasts Annette or Felix as a different actor.
- Annette reads as a mature adult instead of youthful academy Annette.
- Annette becomes childish, mocked, or humiliated by the camera.
- Felix laughs at her, smiles broadly, flirts, or becomes cruel.
- The song becomes a public musical-stage performance.
- Water spill becomes broad slapstick.
- Extra characters, text, subtitles, logos, or watermarks appear.
- Screen direction reverses across adjacent shots.
- Watering can, costume, hair, or greenhouse geography drifts.
- The ending becomes overt romance instead of blunt kindness.

## Rerun Policy

Try one narrow rerun before changing the shot design.

Use the same frames and shorten the prompt to:

1. Preserve identity, costume, prop, and setting exactly from the frames.
2. Animate only the action named in Motion.
3. Keep camera movement minimal.
4. Apply all Reject If items.

If the same P0 issue appears twice, mark the shot `blocked_needs_revision` in clip QA before generating alternatives.

## Face Drift Rerun Recipe

If the face does not match the still frames, rerun with these changes before changing the visuals:

1. Use the same `start_frame.png` as the strongest face reference or first-frame anchor.
2. Reduce expression and mouth motion by half.
3. For singing/dialogue shots, ask for small closed-mouth or near-closed-mouth articulation where possible.
4. Remove broad performance words such as "big", "expressive", "dramatic", "musical", or "energetic".
5. Keep the camera locked or nearly locked.
6. Prefer shorter clips, then stitch multiple usable clips if the model drifts over time.

For SH001 specifically, the safest version is: quiet in-tune humming/singing while watering, small lips, no wide mouth, no musical performance.
