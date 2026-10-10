# Scene09 V3 Generated Clip Ingest Report

Date: 2026-07-28
Decision: clip_ingest_needs_filename_resolution
Mode: dry_run
Input: `/var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_clip_roundtrip_invalid_reject.4aLQE4`

## Summary

- Expected shots: 42
- Source video files scanned: 1
- Unique matched shots: 0
- Would copy: 0
- Copied: 0
- Missing source shots: 42
- Blocked shots: 0
- Ambiguous source files: 0
- Unsupported video files: 0
- Invalid video files: 1
- Unmatched mp4 files: 1

## Copied / Planned Rows


## Blocked Rows

- None.

## Unsupported Video Files

- None.

## Invalid Video Files

- `01_Shot025.mp4`: ffprobe_failed ([mov,mp4,m4a,3gp,3g2,mj2 @ 0xb4ec34000] moov atom not found
/var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_clip_roundtrip_invalid_reject.4aLQE4/01_Shot025.mp4: Invalid data found when processing input)

## Next QA

After applying imports, run:

```bash
node scripts/run_scene09_v3_video_pipeline.js --dry-run
```

The pipeline will rebuild the file:// review pages, extract motion-review frames from any real clips, and keep every imported clip pending until Codex motion self-audit passes.
