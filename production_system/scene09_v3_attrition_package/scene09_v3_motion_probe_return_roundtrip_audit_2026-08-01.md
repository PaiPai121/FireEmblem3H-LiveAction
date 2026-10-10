# Scene09 V3 Motion Probe Return Roundtrip Audit

Date: 2026-08-01
Decision: motion_probe_return_roundtrip_passed

## Scenario Results

| Strategy | Decision | Files | Would Copy | Copied | Missing | Unsupported | Invalid | Unmatched | Ambiguous |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| expected_probe_filename | motion_probe_ingest_dry_run_ready | 42 | 42 | 0 | 0 | 0 | 0 | 0 | 0 |
| custom_id_prefix | motion_probe_ingest_dry_run_ready | 42 | 42 | 0 | 0 | 0 | 0 | 0 | 0 |
| nested_intake_root_expected_probe_filenames | motion_probe_ingest_dry_run_ready | 42 | 42 | 0 | 0 | 0 | 0 | 0 | 0 |
| bare_shot_probe_name_rejected | motion_probe_ingest_blocked | 6 | 0 | 0 | 42 | 0 | 0 | 6 | 0 |
| full_duration_clip_name_rejected | motion_probe_ingest_blocked | 6 | 0 | 0 | 42 | 0 | 0 | 6 | 0 |
| invalid_mp4_rejected | motion_probe_ingest_blocked | 1 | 0 | 0 | 42 | 0 | 1 | 0 | 0 |
| unsupported_format_rejected | motion_probe_ingest_blocked | 1 | 0 | 0 | 42 | 1 | 0 | 0 | 0 |

## Problems

- none

## Notes

- Roundtrip fixtures are tiny ffmpeg-generated valid .mp4 files in a temporary directory, so ingest exercises filename matching and ffprobe validation without using production clips.
- The test runs ingest in dry-run mode with --force, so it never copies fixture videos into motion_probes.
- Positive scenarios prove exact expected probe filenames, custom_id-prefixed filenames, and nested returned_mp4 folders map 42/42 rows.
- Negative scenarios prove bare shot probe names, full-duration clip names, invalid .mp4 bytes, and non-mp4 video returns are blocked.
- Real returned motion probes still require visual motion QA before any full-duration generation release.

