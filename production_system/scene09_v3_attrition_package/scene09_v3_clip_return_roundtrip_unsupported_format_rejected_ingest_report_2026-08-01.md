# Scene09 V3 Generated Clip Ingest Report

Date: 2026-07-28
Decision: clip_ingest_needs_filename_resolution
Mode: dry_run
Input: `/var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_clip_roundtrip_unsupported_reject.ho4hbl`

## Summary

- Expected shots: 42
- Source video files scanned: 1
- Unique matched shots: 0
- Would copy: 0
- Copied: 0
- Missing source shots: 42
- Blocked shots: 0
- Ambiguous source files: 0
- Unsupported video files: 1
- Invalid video files: 0
- Unmatched mp4 files: 0

## Copied / Planned Rows


## Blocked Rows

- None.

## Unsupported Video Files

- `01_Shot025.mov`: unsupported return format .mov; transcode or redownload as .mp4 before ingest

## Invalid Video Files

- None.

## Next QA

After applying imports, run:

```bash
node scripts/run_scene09_v3_video_pipeline.js --dry-run
```

The pipeline will rebuild the file:// review pages, extract motion-review frames from any real clips, and keep every imported clip pending until Codex motion self-audit passes.
