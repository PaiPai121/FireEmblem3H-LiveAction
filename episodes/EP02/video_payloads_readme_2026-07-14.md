# EP02 Video Payloads Readme

Date: 2026-07-14

These payloads are provider-agnostic image-to-video request records derived from the per-shot jobs.

## Master Files

- JSON: `episodes/EP02/video_payloads_2026-07-14.json`
- JSONL: `episodes/EP02/video_payloads_2026-07-14.jsonl`

## Per-Shot Payloads

- Directory: `episodes/EP02/video_payloads_2026-07-14/`
- Example: `episodes/EP02/video_payloads_2026-07-14/Shot027.json`

## Per-Batch Payloads

- Directory: `episodes/EP02/video_payloads_2026-07-14/batches/`
- JSON and JSONL versions exist for each batch.

Recommended first run:

- `episodes/EP02/video_payloads_2026-07-14/batches/batch_01_high_risk_identity.jsonl`

## Payload Schema

Each record has:

- `shot`
- `title`
- `duration_seconds`
- `image_path`
- `prompt`
- `negative_prompt`
- `output_path`
- `job_file`
- `risk_notes`

`Shot042` has an empty `image_path` because it is black-only and can be generated locally by `scripts/assemble_ep02_first_pass.sh`.

## Use Notes

- Use `image_path` as the first frame / image input.
- Use `prompt` as the positive video prompt.
- Use `negative_prompt` as the negative prompt or safety/style avoidance field.
- Save the generated clip to `output_path`.
- After each batch, run `bash scripts/audit_ep02_video_outputs.sh`.
- Then update `episodes/EP02/video_generation_tracker_2026-07-14.csv`.
