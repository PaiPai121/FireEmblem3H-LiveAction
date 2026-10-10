# Scene09 V3 Motion Probe Submission

This package is for 3-second identity and continuity probes before full 6-second clip generation.

Use `motion_probe_payload.jsonl` for structured submitters or `motion_probe_queue.csv` for manual tracking. Each `probe_prompt.md` keeps the original shot locks, negative prompt, audio/no-subtitle policy, and post-shot battle ledger, but changes duration to a 3-second probe.

Do not generate or approve the full-duration clip until the returned probe clip passes the QA checklist with explicit evidence for identity, wardrobe, training weapons, no extra readable humans, no subtitles/visible text, teacher separation, and post-shot attrition continuity.

Returned probe clips should be saved to the `expected_probe_clip` path listed per row.
