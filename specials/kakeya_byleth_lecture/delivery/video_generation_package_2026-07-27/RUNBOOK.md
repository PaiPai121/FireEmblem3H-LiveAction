# Video Generation Runbook

Project: Byleth Teaches the 2D Needle Problem
Package: video_generation_package_2026-07-27
Target runtime: 492 seconds
Status: deprecated monitor handoff, clips pending

## Goal

This older package is retained only as a historical handoff. Use the current Chinese real-frame review panel first, then generate short motion probes or clips from the start/key/end frame chain and run clip-level QA before any shot is promoted.

No creative interpretation should be required here. Preserve Female Byleth, Edelgard, Lysithea, Mercedes when visible, the medieval academy classroom/training-ground context, the mathematical diagrams, and the recorded Chinese dialogue/audio anchors.

## Submission Order

1. `shots/001_SH001` (8s)
2. `shots/002_SH002` (10s)
3. `shots/003_SH003` (12s)
4. `shots/004_SH004` (12s)
5. `shots/005_SH005` (13s)
6. `shots/006_SH006` (12s)
7. `shots/007_SH007` (15s)
8. `shots/008_SH008` (14s)
9. `shots/009_SH009` (16s)
10. `shots/010_SH010` (14s)
11. `shots/011_SH011` (12s)
12. `shots/012_SH012` (18s)
13. `shots/013_SH013` (16s)
14. `shots/014_SH014` (13s)
15. `shots/015_SH015` (13s)
16. `shots/016_SH016` (13s)
17. `shots/017_SH017` (14s)
18. `shots/018_SH018` (15s)
19. `shots/019_SH019` (16s)
20. `shots/020_SH020` (14s)
21. `shots/021_SH021` (18s)
22. `shots/022_SH022` (20s)
23. `shots/023_SH023` (20s)
24. `shots/024_SH024` (14s)
25. `shots/025_SH025` (16s)
26. `shots/026_SH026` (14s)
27. `shots/027_SH027` (16s)
28. `shots/028_SH028` (15s)
29. `shots/029_SH029` (12s)
30. `shots/030_SH030` (20s)
31. `shots/031_SH031` (17s)
32. `shots/032_SH032` (18s)
33. `shots/033_SH033` (14s)
34. `shots/034_SH034` (8s)

For each shot, submit:

- `prompt.md`
- `negative_prompt.md`
- `start_frame.png` as the first frame
- `key_frame.png` as the main action or emotional peak
- `end_frame.png` as the final frame or cut-out state
- Duration from `metadata.json`

Save output to the `expected_clip` value in `metadata.json`.

## Runner

Set `VIDEO_MODEL_CLI_ARGV_JSON` before using `--execute`. Until then, `execution_plan.json` and `execution_commands.sh` are dry-run handoff files.

```bash
node scripts/run_video_generation_package.js <this-package-dir> --execute --concat
```

## Hard Rejects

- Female Byleth is replaced by male Byleth, a generic teacher, an adult mentor, or a modern instructor.
- Edelgard, Lysithea, or Mercedes are replaced by off-roster students when the frame requires them.
- Named character identity, costume, hair, or prop state drifts from the frames.
- Medieval academy classroom/training-ground context turns into a modern classroom or UI demo.
- Deltoid, Perron tree, delta tube, alpha angle, or area/dimension statements become decorative or mathematically wrong.
- Dialogue timing breaks the human blooper rhythm.
- New characters, subtitles, logos, or watermarks appear.
- Screen direction reverses across adjacent shots.

## Rerun Policy

Try one narrow rerun before changing the shot design. Keep the same frames, shorten the motion direction, and preserve identity, costume, prop, setting, camera, and dialogue anchor. If the same P0 issue appears twice, mark the shot `blocked_needs_revision` before generating alternatives.
