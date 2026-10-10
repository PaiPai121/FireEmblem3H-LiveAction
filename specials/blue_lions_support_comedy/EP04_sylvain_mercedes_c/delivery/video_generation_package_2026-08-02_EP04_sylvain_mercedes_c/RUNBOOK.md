# RUNBOOK

Package: video_generation_package_2026-08-02_EP04_sylvain_mercedes_c
Target: Seedance image-to-video

1. Open `submission_queue.csv`.
2. For each row, submit `start_frame`, `key_frame`, `end_frame`, `prompt`, and `negative_prompt`.
3. Generate one clip per row at `duration_seconds`.
4. Save returned clips to the `expected_clip` path.
5. Run the clip QA checklist before concatenation.

No subtitles should be generated or burned in. If Seedance produces visible captions or UI, reject and regenerate with the same frames and stricter negative prompt.
