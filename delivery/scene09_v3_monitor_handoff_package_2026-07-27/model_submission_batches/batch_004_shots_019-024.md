# batch_004_shots_019-024

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

### 019_Shot030C

- Shot: Shot030C
- Duration: 6s
- Visible named-only: Ignatz, Annette, Mercedes, Dorothea
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/019_EP02-SC09-SHOT-Shot030C-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/019_EP02-SC09-SHOT-Shot030C-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/019_EP02-SC09-SHOT-Shot030C-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/019_EP02-SC09-SHOT-Shot030C-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/019_EP02-SC09-SHOT-Shot030C-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/19_Shot030C.mp4
- Primary check: 金鹿远程高光：伊格纳兹逼迫安娜特和梅尔塞德斯低头转位。 Critical re-audit: monitor_required. 需要在 prompt 中锁定伊格纳兹弓、安娜特书、梅尔塞德斯支援姿态。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: Annette:pressured; Mercedes:pressured; Dorothea:pressured; Bernadetta:pressured
- No-Active-Combat Line: none

### 020_Shot031

- Shot: Shot031
- Duration: 6s
- Visible named-only: Byleth, Felix
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/020_EP02-SC09-SHOT-Shot031-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/020_EP02-SC09-SHOT-Shot031-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/020_EP02-SC09-SHOT-Shot031-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/020_EP02-SC09-SHOT-Shot031-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/020_EP02-SC09-SHOT-Shot031-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/20_Shot031.mp4
- Primary check: 2026-08-12 重做三帧：贝雷特横向切入菲力克斯前压路线，关键帧以手势截住剑路，结束帧菲力克斯收剑停步；从静态对话改为明确的战术制止动作链。仍需独立视频前复审。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 021_Shot031B

- Shot: Shot031B
- Duration: 6s
- Visible named-only: Byleth, Dimitri, Dedue, Sylvain, Ingrid, Annette, Mercedes
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/021_EP02-SC09-SHOT-Shot031B-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/021_EP02-SC09-SHOT-Shot031B-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/021_EP02-SC09-SHOT-Shot031B-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/021_EP02-SC09-SHOT-Shot031B-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/021_EP02-SC09-SHOT-Shot031B-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/21_Shot031B.mp4
- Primary check: anchor_motion_patch_2026_08_15_blunt_training_weapons
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 022_Shot032

- Shot: Shot032
- Duration: 6s
- Visible named-only: Dedue, Mercedes
- Visible But No Active Combat After: Mercedes
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/022_EP02-SC09-SHOT-Shot032-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/022_EP02-SC09-SHOT-Shot032-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/022_EP02-SC09-SHOT-Shot032-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/022_EP02-SC09-SHOT-Shot032-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/022_EP02-SC09-SHOT-Shot032-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/22_Shot032.mp4
- Primary check: 借鉴治疗/坦克重建的经典节奏：杜笃被压低，梅尔塞德斯冒险治疗，杜笃恢复盾线。 Critical re-audit: monitor_required. 保留为当前合格候选；视频 prompt 禁止血腥、禁止魔兽设计、禁止梅尔塞德斯冲锋。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
- Defeated / Removed After: blue_lions: Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Mercedes
- Must Not Return Active: blue_lions: Mercedes
- Changed This Shot: Dedue:restored_frontline; Mercedes:spent_after_heal
- No-Active-Combat Line: Mercedes

### 023_Shot032A

- Shot: Shot032A
- Duration: 6s
- Visible named-only: Annette, Mercedes, Ashe, Claude
- Visible But No Active Combat After: Annette, Mercedes
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/023_EP02-SC09-SHOT-Shot032A-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/023_EP02-SC09-SHOT-Shot032A-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/023_EP02-SC09-SHOT-Shot032A-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/023_EP02-SC09-SHOT-Shot032A-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/023_EP02-SC09-SHOT-Shot032A-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/23_Shot032A.mp4
- Primary check: 梅尔塞德斯治疗后消耗，安娜特接过掩护，亚修继续牵制库罗德。 Critical re-audit: monitor_required. 需要账本与 prompt 同步：梅尔塞德斯治疗后只支援/移动，不主动开战。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes
- Changed This Shot: Annette:spent_stood_down; Mercedes:spent_stood_down; Ashe:restored_angle; Claude:displaced
- No-Active-Combat Line: Annette, Mercedes

### 024_Shot032B

- Shot: Shot032B
- Duration: 6s
- Visible named-only: Dimitri, Dedue, Hanneman
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/024_EP02-SC09-SHOT-Shot032B-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/024_EP02-SC09-SHOT-Shot032B-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/024_EP02-SC09-SHOT-Shot032B-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/024_EP02-SC09-SHOT-Shot032B-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/024_EP02-SC09-SHOT-Shot032B-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/24_Shot032B.mp4
- Primary check: anchor_motion_patch_2026_08_15_hanneman_alone_no_manuela
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes
- Changed This Shot: none
- No-Active-Combat Line: Annette, Mercedes
