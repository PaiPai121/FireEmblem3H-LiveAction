# batch_001_shots_001-006

Provider-neutral full-duration image-to-video submission batch for EP02 Scene09 V3.

Current lock: do not submit this full-duration batch until `full_duration_release_gate` is `full_duration_release_passed`.

Use the JSONL when a model accepts structured batch input only after release. Use the CSV when submitting manually or through a spreadsheet/import UI only after release.

## Hard Rules

- Full-duration generation is locked until 42/42 returned motion probes pass signed Codex review and the production package contains `motion_probe_full_duration_release.json`.
- Submit only the named visible roster listed per row.
- Do not add anonymous students, spectators, crowds, soldiers, or readable silhouettes.
- Keep Hanneman and Manuela in separate teacher lanes; never stage them as a pair.
- Save each returned mp4 exactly to the expected clip path, then run the ingest and motion QA scripts from the package Runbook.
- Proxy animatic clips are reference-only and must not be copied into expected clip paths.

## Rows

### 001_Shot025

- Shot: Shot025
- Duration: 6s
- Visible named-only: Dimitri, Edelgard, Claude
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/001_EP02-SC09-SHOT-Shot025-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/001_EP02-SC09-SHOT-Shot025-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/001_EP02-SC09-SHOT-Shot025-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/001_EP02-SC09-SHOT-Shot025-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/001_EP02-SC09-SHOT-Shot025-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/01_Shot025.mp4
- Primary check: 三位级长听到离屏教师规则后，各自确认进攻路线。 Critical re-audit: monitor_required. 保留为规则镜头，但视频提示必须强调三人从互相观察转为各自出发。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 002_Shot025A

- Shot: Shot025A
- Duration: 6s
- Visible named-only: none
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/002_EP02-SC09-SHOT-Shot025A-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/002_EP02-SC09-SHOT-Shot025A-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/002_EP02-SC09-SHOT-Shot025A-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/002_EP02-SC09-SHOT-Shot025A-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/002_EP02-SC09-SHOT-Shot025A-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/02_Shot025A.mp4
- Primary check: 交代低墙、树林、坡道、教师台和三学级路线。 Critical re-audit: layout_reference. 若要视频化，应做成无角色的战场插入或重新生成真实三路队形远景。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 003_Shot026

- Shot: Shot026
- Duration: 6s
- Visible named-only: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/003_EP02-SC09-SHOT-Shot026-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/003_EP02-SC09-SHOT-Shot026-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/003_EP02-SC09-SHOT-Shot026-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/003_EP02-SC09-SHOT-Shot026-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/003_EP02-SC09-SHOT-Shot026-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/03_Shot026.mp4
- Primary check: 青狮队内分工：杜笃顶线，梅尔塞德斯支援，亚修侦查，菲力克斯机动压制。 Critical re-audit: monitor_required. 后续可以保留，但要补一版更明确的手势/指图/接令动作。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 004_Shot026B

- Shot: Shot026B
- Duration: 6s
- Visible named-only: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/004_EP02-SC09-SHOT-Shot026B-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/004_EP02-SC09-SHOT-Shot026B-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/004_EP02-SC09-SHOT-Shot026B-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/004_EP02-SC09-SHOT-Shot026B-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/004_EP02-SC09-SHOT-Shot026B-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/04_Shot026B.mp4
- Primary check: 青狮从高处确认敌方远方来路。 Critical re-audit: monitor_required. 保留方向逻辑，重做时让侦查、前排、后排职责更可读。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 005_Shot026C

- Shot: Shot026C
- Duration: 6s
- Visible named-only: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/005_EP02-SC09-SHOT-Shot026C-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/005_EP02-SC09-SHOT-Shot026C-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/005_EP02-SC09-SHOT-Shot026C-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/005_EP02-SC09-SHOT-Shot026C-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/005_EP02-SC09-SHOT-Shot026C-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/05_Shot026C.mp4
- Primary check: anchor_motion_patch_2026_08_15_byleth_visible
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 006_Shot027

- Shot: Shot027
- Duration: 6s
- Visible named-only: Ashe, Claude
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/006_EP02-SC09-SHOT-Shot027-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/006_EP02-SC09-SHOT-Shot027-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/006_EP02-SC09-SHOT-Shot027-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/006_EP02-SC09-SHOT-Shot027-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/006_EP02-SC09-SHOT-Shot027-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/06_Shot027.mp4
- Primary check: anchor_motion_patch_2026_08_15_ashe_detects_claude
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
