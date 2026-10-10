# Scene09 V3 Model CLI Execution Provenance Audit

Date: 2026-08-01
Decision: model_cli_execution_provenance_passed

This audit executes a temporary copy of the handoff package with a fake local video CLI. It proves `run_video_generation_package.js --execute` creates real mp4 outputs and writes `model_cli_execute` provenance rows with matching SHA-256 values, without touching the current expected clip paths.

## Counts

- Expected shots: 42
- Provenance rows checked: 42
- Unique expected clips: 42

## Problems

- none
