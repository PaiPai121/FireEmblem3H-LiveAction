# EP02 Video Output Audit Readme

Date: 2026-07-14

After generating first-pass clips, run:

```bash
bash scripts/audit_ep02_video_outputs.sh
```

The script reads:

- `episodes/EP02/video_generation_tracker_2026-07-14.csv`

It checks expected clips under:

- `episodes/EP02/video_outputs/first_pass/`

It writes:

- `episodes/EP02/video_outputs/first_pass_audit.tsv`

The report columns are:

- `shot`
- `exists`
- `duration_seconds`
- `width`
- `height`
- `path`

Use this before manual review. If a clip is missing or has unexpected dimensions, fix that before judging performance or identity.
