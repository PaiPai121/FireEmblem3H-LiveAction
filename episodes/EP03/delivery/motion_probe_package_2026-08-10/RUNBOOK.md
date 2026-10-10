# EP03 3-Second Motion Probe Runbook

Created: 2026-08-10
Updated: 2026-08-12

Purpose: test identity, wardrobe, prop, frame presentation, and environment integration before full-duration generation.

This is not a final video generation package. Only rows in `submission_queue.csv` are eligible for probe submission. Shots listed under `blocked_shots` in `submission_queue.json` must be regenerated before probe.

## Workflow

1. Open `submission_queue.csv`.
2. For each row, upload START, KEY, and END frames in that order.
3. Paste the package-local `prompt.md` and `negative_prompt.md`.
4. Set duration to 3 seconds.
5. Save the result to `expected_probe_clip`.
6. Review with `clip_QA_checklist.md`.
7. Record the result in a motion review file before any full-duration generation.

Optional CLI handoff:

- If a real video model CLI wrapper exists, set `VIDEO_MODEL_CLI_ARGV_JSON` to the argv template described in `execution_plan.json`.
- Then run `./execution_commands.sh` from this package directory.
- If no CLI wrapper is configured, use this package manually in the web workflow and save outputs to the `expected_probe_clip` paths.

## Hard Rules

- Japanese voice only when a line is needed; no Chinese or Mandarin voiceover.
- No burned-in subtitles, captions, UI, dialogue boxes, logos, borders, letterbox, pillarbox, rounded frames, black frames, placeholders, or artificial side fill.
- Do not promote from this package alone. Probe clips must pass visual motion QA and adjacent continuity QA.
