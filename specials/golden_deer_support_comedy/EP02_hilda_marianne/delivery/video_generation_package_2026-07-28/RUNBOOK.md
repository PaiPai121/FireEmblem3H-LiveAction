# RUNBOOK

1. Open `asset_viewer.html` and review each shot's start, key, and end frames.
2. For each row in `submission_queue.csv`, submit `prompt.md`, `negative_prompt.md`, `start_frame.png`, `key_frame.png`, and `end_frame.png` to Seedance.
3. Set the clip duration to the row's `duration_seconds`.
4. Save the generated clip to `expected_clip`.
5. Run the clip QA checklist before concatenating clips in timeline order.

Do not enable subtitles or caption rendering. Dialogue is in the prompt audio section only.
