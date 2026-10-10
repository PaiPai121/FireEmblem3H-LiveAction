# batch_006_shots_031-036

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

### 031_Shot033B

- Shot: Shot033B
- Duration: 6s
- Visible named-only: Byleth, Ashe, Ingrid, Felix
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/31_Shot033B.mp4
- Primary check: 2026-08-14 重做三帧：贝雷特从背后发出分路指令，亚修转入左侧空教师目标线，英谷莉特转入右侧空教师目标线，菲力克斯留中线封路。画面不出现汉尼曼、玛努艾拉或任何教师，避免两名教师被误读成并肩作战。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Changed This Shot: none
- No-Active-Combat Line: Annette, Mercedes, Hubert, Dorothea, Bernadetta

### 032_Shot033C

- Shot: Shot033C
- Duration: 6s
- Visible named-only: Ashe, Hanneman
- Visible But No Active Combat After: Ashe
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/32_Shot033C.mp4
- Primary check: 2026-08-14 重做三帧：亚修与汉尼曼处于单独左侧教师目标线，玛努艾拉完全不出现。关键帧把训练箭/判定效果落在汉尼曼前方的安全木牌与目标圈上，结束帧亚修放低弓退场，汉尼曼举手认判，证明目标线被压制但无人受伤。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Ashe, Annette, Mercedes
- Must Not Return Active: blue_lions: Ashe, Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Changed This Shot: Hanneman:objective_suppressed; Ashe:spent_stood_down
- No-Active-Combat Line: Ashe, Annette, Mercedes, Hubert, Dorothea, Bernadetta

### 033_Shot033D

- Shot: Shot033D
- Duration: 6s
- Visible named-only: Ingrid, Manuela, Sylvain
- Visible But No Active Combat After: Ingrid, Manuela, Sylvain
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/33_Shot033D.mp4
- Primary check: 2026-08-14 重做三帧：英谷莉特与希尔凡在另一条独立教师目标线切断玛努艾拉回援路，汉尼曼完全不出现。关键帧英谷莉特将钝木训练枪点到地面规则线而非玛努艾拉身体，希尔凡只负责占位封路；结束帧三人均收势，玛努艾拉体面认判，英谷莉特和希尔凡也按账本 spent_stood_down。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Changed This Shot: Manuela:route_cut; Ingrid:spent_stood_down; Sylvain:spent_stood_down
- No-Active-Combat Line: Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Dorothea, Bernadetta, Manuela

### 034_Shot034C

- Shot: Shot034C
- Duration: 6s
- Visible named-only: Felix, Ferdinand
- Visible But No Active Combat After: Felix, Ferdinand
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/34_Shot034C.mp4
- Primary check: 2026-08-14 重做三帧：菲力克斯与费尔迪南特只以路线控制决出胜负，画面仅保留二人。关键帧菲力克斯用钝木训练剑压住通往台阶的路线，结束帧菲力克斯收剑退半步，费尔迪南特站立认线且保持体面；无击打、无伤害、无羞辱，费尔迪南特从主动战斗移出，菲力克斯也 spent_stood_down。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Changed This Shot: Ferdinand:defeated_by_route_block; Felix:spent_stood_down
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Manuela

### 035_Shot034D

- Shot: Shot034D
- Duration: 6s
- Visible named-only: Byleth, Hanneman
- Visible But No Active Combat After: Hanneman
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/35_Shot034D.mp4
- Primary check: 2026-08-14 重做三帧：汉尼曼在独立魔法练习目标圈内接受贝雷特规则判定，玛努艾拉、亚修和其他学生完全不出现。贝雷特站在侧边规则线外，关键帧指向木制目标牌/地面标记而非汉尼曼身体，结束帧汉尼曼收手体面退离目标圈；教师目标被判负但无伤害、无羞辱。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: Hanneman:objective_defeated_off_sigil
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Hanneman, Manuela

### 036_Shot034B

- Shot: Shot034B
- Duration: 6s
- Visible named-only: Byleth, Dimitri
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/36_Shot034B.mp4
- Primary check: Only Byleth and Dimitri are readable; two far-separated faculty objective markers are empty; Hanneman and Manuela are absent/offscreen/silent/unpaired.
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie
- Limited But Not Defeated After: black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: Dimitri:surviving_winner; Byleth:surviving_command; Hanneman:objective_defeated_separate_lane; Manuela:route_cut_offscreen_unpaired
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Hanneman, Manuela
