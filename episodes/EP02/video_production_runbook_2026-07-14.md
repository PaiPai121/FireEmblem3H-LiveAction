# EP02 Video Production Runbook

Date: 2026-07-14

This is the operating checklist for the first full EP02 video test.

## 1. Source Materials

Per-shot jobs:

- `episodes/EP02/video_jobs_2026-07-14/`

Full ordered prompt list:

- `episodes/EP02/video_generation_prompts_full_episode_2026-07-14.md`

Queue:

- `episodes/EP02/video_generation_queue_2026-07-14.csv`
- `episodes/EP02/video_generation_queue_2026-07-14.json`

Provider-agnostic request payloads:

- `episodes/EP02/video_payloads_readme_2026-07-14.md`
- `episodes/EP02/video_payloads_2026-07-14.json`
- `episodes/EP02/video_payloads_2026-07-14.jsonl`
- `episodes/EP02/video_payloads_2026-07-14/batches/`

Tracker:

- `episodes/EP02/video_generation_tracker_2026-07-14.csv`

## 2. Recommended Generation Order

Batch overview:

- `episodes/EP02/video_batches_2026-07-14.md`

Batch files:

- `episodes/EP02/video_batches_2026-07-14/`

Run order:

1. `batch_01_high_risk_identity`
2. `batch_02_church_choice_spine`
3. `batch_03_blue_lions_intro_class`
4. `batch_04_mock_battle_core`
5. `batch_05_connectors_atmosphere`
6. `batch_06_cliffhanger_black`

Do not run all 42 clips first if the tool is expensive. Batch 01 should reveal most recurring failures.

Use the matching JSONL payload file for batch execution when the video tool supports structured input.

## 3. Expected Outputs

Generated clips go here:

- `episodes/EP02/video_outputs/first_pass/Shot001.mp4`
- ...
- `episodes/EP02/video_outputs/first_pass/Shot042.mp4`

`Shot042.mp4` can be generated locally by the assembly script because it is a black hold.

## 4. Audit Outputs

After generating clips, run:

```bash
bash scripts/audit_ep02_video_outputs.sh
```

Read:

- `episodes/EP02/video_outputs/first_pass_audit.tsv`

Fix missing clips, bad durations, or inconsistent dimensions before manual QA.

## 5. Manual QA

Use:

- `episodes/EP02/video_first_pass_QA_2026-07-14.md`

Update:

- `episodes/EP02/video_generation_tracker_2026-07-14.csv`

Allowed statuses:

- `pass`
- `conditional`
- `rerun`
- `reject`

## 6. Assembly

When all required clips exist, run:

```bash
bash scripts/assemble_ep02_first_pass.sh
```

Expected assembly output:

- `episodes/EP02/video_outputs/assembly/EP02_first_pass_assembly.mp4`

If codec-copy concat fails, use the re-encode command in:

- `episodes/EP02/video_assembly_readme_2026-07-14.md`

## 7. Editorial References

Timeline:

- `episodes/EP02/edit_timeline_first_pass_2026-07-14.md`

Audio cues:

- `episodes/EP02/audio_cue_sheet_first_pass_2026-07-14.md`

Runtime expansion:

- `episodes/EP02/runtime_expansion_plan_2026-07-14.md`

## 8. Current Known Risks

- Shot009 must become a continuous cloister shot, not a split-screen collage.
- Shot017 and Shot019 need strict leader / Blue Lions identity control.
- Shot024, Shot027, Shot033, and Shot036 are the most likely motion-identity drift points.
- Shot041 must not reveal the Flame Emperor identity.

## 9. Current Local Validation

As of 2026-07-14:

- 42 per-shot job files exist.
- batch manifests exist.
- output audit script works.
- assembly script dry-run works.
- only generated local video output is `Shot042.mp4`.
- 41 real shot clips remain to be generated externally.
