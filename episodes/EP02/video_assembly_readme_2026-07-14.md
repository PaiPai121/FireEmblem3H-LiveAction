# EP02 First-Pass Video Assembly Readme

Date: 2026-07-14

Use this after generating clips from the per-shot jobs:

- `episodes/EP02/video_jobs_2026-07-14/`

## Expected Clip Paths

Put generated clips here:

- `episodes/EP02/video_outputs/first_pass/Shot001.mp4`
- ...
- `episodes/EP02/video_outputs/first_pass/Shot041.mp4`

Shot042 is a black hold. The assembly script can generate it automatically:

- `episodes/EP02/video_outputs/first_pass/Shot042.mp4`

## Assembly Script

Run:

```bash
bash scripts/assemble_ep02_first_pass.sh
```

The script:

- reads `episodes/EP02/video_generation_tracker_2026-07-14.csv`
- creates `Shot042.mp4` if missing
- checks all expected shot clips exist
- writes `episodes/EP02/video_outputs/assembly/concat_first_pass.txt`
- outputs `episodes/EP02/video_outputs/assembly/EP02_first_pass_assembly.mp4`

Validation note: on 2026-07-14 the script was dry-run before video generation. It correctly created the black `Shot042.mp4`, then stopped because `Shot001`-`Shot041` were not generated yet.

## Requirements

- `ffmpeg` available on PATH
- all shot outputs encoded compatibly enough for ffmpeg concat copy

If concat copy fails because generated clips have incompatible codecs, rerun manually with re-encode:

```bash
ffmpeg -y -f concat -safe 0 \
  -i episodes/EP02/video_outputs/assembly/concat_first_pass.txt \
  -c:v libx264 -pix_fmt yuv420p -c:a aac \
  episodes/EP02/video_outputs/assembly/EP02_first_pass_assembly_reencoded.mp4
```

## After Assembly

Review with:

- `episodes/EP02/video_first_pass_QA_2026-07-14.md`
- `episodes/EP02/audio_cue_sheet_first_pass_2026-07-14.md`
- `episodes/EP02/runtime_expansion_plan_2026-07-14.md`

Update:

- `episodes/EP02/video_generation_tracker_2026-07-14.csv`

Use `pass`, `conditional`, `rerun`, or `reject` in the `status` column.
