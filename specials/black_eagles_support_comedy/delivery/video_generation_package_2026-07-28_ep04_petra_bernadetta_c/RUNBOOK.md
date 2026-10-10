# RUNBOOK - Petra x Bernadetta C - Like Prey

1. Open asset_viewer.html and confirm all 12 shots show start/key/end frames.
2. Run motion_probe_queue.csv first. Submit each prompt with start_frame.png, key_frame.png, and end_frame.png at 3 seconds, no subtitles, no visible text, and no burned-in dialogue.
3. Review each probe against clip_qa_checklist.md. Reject immediately for any face drift, wardrobe topology change, black/rounded UI frame, letterbox/pillarbox, artificial side fill, or cartoon expression.
4. Only after a probe passes, submit the matching row from submission_queue.csv for the final duration. Never exceed 15 seconds.
5. If Seedance returns a shorter maximum duration, split the shot into 3-5 second microclips instead of stretching one prompt.
6. Disable subtitles, captions, title cards, text overlays, and watermarks.
7. Save output to expected_clip.
8. Run clip_qa_checklist.md again before concatenation.

If Seedance cannot synthesize dialogue, keep the Japanese dialogue as the exact voiceover/script source for the audio pass. Do not replace it with translated or invented lines.
