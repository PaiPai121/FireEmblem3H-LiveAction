# Video Generation Runbook

Project: behind_the_scenes_mock_battle
Package: video_generation_package_human_set_v3_refusal_safe_2026-07-25
Target runtime: 84 seconds
Status: approved_for_video, clips pending

## Goal

Generate each image-to-video clip from the approved start/key/end frame chain, then concatenate clips in timeline order.

No creative interpretation should be required here. Preserve the approved frame identities, modern film-set context, visible director throughline, and the recorded dialogue/audio anchors.

## Submission Order

1. `shots/001_BTS-SH000` (12s)
2. `shots/002_BTS-SH001` (10s)
3. `shots/003_BTS-SH002` (12s)
4. `shots/004_BTS-SH003` (14s)
5. `shots/005_BTS-SH004` (12s)
6. `shots/006_BTS-SH005` (12s)
7. `shots/007_BTS-SH006` (12s)

For each shot, submit:

- `prompt.md`
- `negative_prompt.md`
- `start_frame.png` as the first frame
- `key_frame.png` as the main action or emotional peak
- `end_frame.png` as the final frame or cut-out state
- Duration from `metadata.json`

Save output to the `expected_clip` value in `metadata.json`.

## Runner

Set `VIDEO_MODEL_CLI_ARGV_JSON` before using `--execute`. Until then, `execution_plan.json` and `execution_commands.sh` are dry-run handoff files.

```bash
node scripts/run_video_generation_package.js <this-package-dir> --execute --concat
```

## One-Pass Audio

This project uses one-stage video generation. Do not create a separate voice pass. Each submitted shot prompt asks the video model to generate picture, natural Mandarin set dialogue, restrained small laughs, and production ambience in the same clip.

Reject clips where speech sounds like translated dubbing, narrator voice, commercial voiceover, over-clean machine-like speech, anime-dub acting, or canned laughter. The dialogue should feel captured between takes on a real set.

## Hard Rejects

- The visible director is missing or replaced by a generic crew member.
- The clip invents a technical-failure explanation instead of preserving the set rehearsal.
- Named performer identity, costume, hair, or prop state drifts from the frames.
- Modern film-set equipment disappears.
- Dialogue timing breaks the human blooper rhythm.
- New characters, subtitles, logos, or watermarks appear.
- Screen direction reverses across adjacent shots.

## Rerun Policy

Try one narrow rerun before changing the shot design. Keep the same frames, shorten the motion direction, and preserve identity, costume, prop, setting, camera, and dialogue anchor. If the same P0 issue appears twice, mark the shot `blocked_needs_revision` before generating alternatives.
