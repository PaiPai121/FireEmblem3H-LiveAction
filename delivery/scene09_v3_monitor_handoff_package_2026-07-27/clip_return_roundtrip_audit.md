# Scene09 V3 Clip Return Roundtrip Audit

Date: 2026-08-01
Decision: clip_return_roundtrip_passed

## Scope

- Simulate provider returns named by exact expected filename.
- Simulate provider returns named by `custom_id` prefix.
- Simulate whole-package recursive intake with all 7 returned batch folders under one parent root.
- Verify each positive return strategy dry-runs to 42 unique shot matches without copying files.
- Verify bare shot-name filenames are rejected by default so stale or wrong-version clips are not auto-ingested.
- Verify a correctly named but invalid `.mp4` is rejected before matching.
- Verify a non-mp4 provider return is rejected even when it contains valid video bytes.

## Scenario Results

| Strategy | Decision | Scanned | Matched | Would Copy | Copied | Missing | Blocked | Ambiguous | Unsupported | Invalid | Unmatched |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| expected_filename | clip_ingest_dry_run_ready_to_apply | 42 | 42 | 42 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| custom_id_prefix | clip_ingest_dry_run_ready_to_apply | 42 | 42 | 42 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| nested_intake_root_expected_filenames | clip_ingest_dry_run_ready_to_apply | 42 | 42 | 42 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| loose_shot_name_rejected | clip_ingest_no_matching_sources | 6 | 0 | 0 | 0 | 42 | 0 | 0 | 0 | 0 | 6 |
| invalid_mp4_rejected | clip_ingest_needs_filename_resolution | 1 | 0 | 0 | 0 | 42 | 0 | 0 | 0 | 1 | 1 |
| unsupported_format_rejected | clip_ingest_needs_filename_resolution | 1 | 0 | 0 | 0 | 42 | 0 | 0 | 1 | 0 | 0 |

## Problems

- none

## Notes

- Roundtrip fixtures are tiny ffmpeg-generated valid .mp4 files in a temporary directory, so ingest exercises filename matching and ffprobe validation.
- The test runs ingest in dry-run mode with --force, so it never copies placeholders into expected_clip paths.
- The nested-intake-root scenario distributes all 42 expected filenames across 7 returned_mp4 folders and passes the parent root to ingest, proving whole-package recursive intake works.
- The invalid-mp4 scenario writes a correctly named text file with an .mp4 suffix and expects ingest to reject it before matching.
- The unsupported-format scenario writes a valid video with a .mov suffix and expects ingest to reject it until it is redownloaded or transcoded to .mp4.
- Real generated clips still require file QA, extracted motion-review frames, and Codex motion self-audit.

