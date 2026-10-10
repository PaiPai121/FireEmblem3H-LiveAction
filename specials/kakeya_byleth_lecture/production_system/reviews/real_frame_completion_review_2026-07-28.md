# Real Frame Completion Review: 2026-07-28

Project ID: `KAK-BYLETH-LECTURE`
Artifact: `KAK-BYLETH-REAL-FRAME-PREVIEW-2026-07-28`
Decision: `monitor_required`

## Scope

This review addresses the corrective concern that earlier storyboard PNGs looked like layout cards rather than real cinematic frames.

Current evidence:

- `frame_generation_manifest.json` reports 34 shots and 102/102 generated real frames.
- `delivery/real_frame_preview_kakeya_byleth_2026-07-28/asset_viewer.html` shows 34 completed shot sections and no pending shots.
- The viewer references package-local `start_frame.png`, `key_frame.png`, `end_frame.png`, `prompt.md`, `negative_prompt.md`, `frame_spec.md`, and `metadata.json` for every shot.
- The page intentionally excludes layout-reference PNGs under `storyboards/SH###/`.

## Visual Spot Check

Reviewed full contact sheets plus representative newly completed frames.

Contact sheet evidence:

- `/tmp/kakeya_all_frames_contact_01_17.jpg`: SH001-SH017 start/key/end pass the basic nonblank, non-layout-card, 16:9 frame-chain check.
- `/tmp/kakeya_all_frames_contact_18_34.jpg`: SH018-SH034 start/key/end pass the basic nonblank, non-layout-card, 16:9 frame-chain check.

Representative frame checks:

- `real_frames/SH001/key.png`: replacement imagegen overhead macro frame; passes the basic real-frame threshold. The sword, hand, chalk line, and red endpoints read as a physical unit-segment setup.
- `real_frames/SH002/start.png`, `key.png`, `end.png`: imagegen-generated Female Byleth training-yard frames; pass identity and cinematic-still threshold at pilot level.
- `real_frames/SH003/key.png`: corrected to use the SH001 top-down stone floor as base; the fixed-center circular disk reads clearly as rejected intuition.
- `real_frames/SH004/key.png`: corrected to remove deltoid contamination; now reads as fixed center crossed out versus movable center.
- `real_frames/SH010/start.png`, `key.png`, `end.png`: replaced the earlier board-only doubt graphic with a real Female Byleth classroom reaction shot, blurred student shoulder silhouette, and deltoid candidate continuity.
- `real_frames/SH015/key.png`: corrected the convex/nonconvex split-screen so the left side shows fragments inside a filled convex hull while the right keeps gaps.
- `real_frames/SH030/end.png`: proof-impact triptych is visible and tied to tube overlap, maximal averages, and wave-packet direction rather than daily-life metaphor.
- `real_frames/SH034/end.png`: closing parchment thesis is readable and visually restrained.

## Remaining Risks

- This is not yet a video-generation package. No shot is `approved_for_video`.
- SH010 now uses a Female Byleth reaction shot rather than a named Edelgard face; this follows the silhouette/offscreen-student fallback and should be accepted or revised by direction QA.
- SH024 and SH031 contain explanatory text/icons that need final full-size readability review.
- Mathematical overlays require a separate math visual QA pass for deltoid scale, Perron direction preservation, delta/alpha relations, and dimension statements.
- Adjacent-shot continuity has not been re-approved against the new real frames.

## Required Next Gate

Before promotion:

1. Full visual QA for all 34 start/key/end frame triples.
2. Math visual QA for proof shots and impact shots.
3. Adjacent-shot continuity QA against real frames only.
4. Update `video_delivery_manifest.json` shot statuses from `monitor_required` only after those checks pass.
