# batch_007_shots_037-042

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

### 037_Shot034E

- Shot: Shot034E
- Duration: 6s
- Visible named-only: Claude, Hilda, Lorenz, Ignatz, Leonie
- Visible But No Active Combat After: Claude, Hilda, Lorenz, Ignatz, Leonie
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/037_EP02-SC09-SHOT-Shot034E-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/037_EP02-SC09-SHOT-Shot034E-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/037_EP02-SC09-SHOT-Shot034E-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/037_EP02-SC09-SHOT-Shot034E-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/037_EP02-SC09-SHOT-Shot034E-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/37_Shot034E.mp4
- Primary check: 2026-08-15 重做三帧：金鹿五人作为侧翼高光后的体面收势镜头出现，克劳德给出停手信号，希尔妲保持学院年龄且使用扁平斧刃安全训练斧，洛廉兹与雷欧妮只持钝头训练枪/杆，伊格纳兹收书和弓线；无多余人物、无重启追击、无羞辱。第一版因希尔妲武器像木槌被废弃，当前三帧为第二版通过本地目检的候选。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard
- Limited But Not Defeated After: black_eagles: Edelgard
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: Claude:stood_down_defeated_house; Hilda:stood_down_defeated_house; Lorenz:stood_down_defeated_house; Ignatz:stood_down_defeated_house; Leonie:stood_down_defeated_house
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela

### 038_Shot034F

- Shot: Shot034F
- Duration: 6s
- Visible named-only: Edelgard, Ferdinand
- Visible But No Active Combat After: Edelgard, Ferdinand
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/038_EP02-SC09-SHOT-Shot034F-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/038_EP02-SC09-SHOT-Shot034F-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/038_EP02-SC09-SHOT-Shot034F-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/038_EP02-SC09-SHOT-Shot034F-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/038_EP02-SC09-SHOT-Shot034F-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/38_Shot034F.mp4
- Primary check: 2026-08-15 重做三帧：黑鹫只保留艾黛尔贾特与费尔迪南特，修伯特、多洛缇雅、贝尔娜提塔不回场。艾黛尔贾特以领导者姿态主动下令收势，安全训练斧始终低放/落地；费尔迪南特在已被封路后的非主动语境中持钝木杆退场，双方体面而不羞辱。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Limited But Not Defeated After: none
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: Edelgard:stood_down_defeated_house; Ferdinand:defeated_by_route_block
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela

### 039_Shot034G

- Shot: Shot034G
- Duration: 6s
- Visible named-only: Byleth, Dimitri, Dedue
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/039_EP02-SC09-SHOT-Shot034G-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/039_EP02-SC09-SHOT-Shot034G-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/039_EP02-SC09-SHOT-Shot034G-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/039_EP02-SC09-SHOT-Shot034G-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/039_EP02-SC09-SHOT-Shot034G-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/39_Shot034G.mp4
- Primary check: 青狮险胜核心：迪米特里和杜笃都明显疲惫，但防线还在。 Critical re-audit: monitor_required. 可保留候选，但最好重做 end 强化险胜而非轻松取胜。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Limited But Not Defeated After: none
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: Dimitri:surviving_winner_exhausted; Dedue:surviving_winner_exhausted; Annette:spent_stood_down; Mercedes:spent_stood_down; Sylvain:spent_stood_down; Ingrid:spent_stood_down; Ashe:spent_stood_down
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela

### 040_Shot034

- Shot: Shot034
- Duration: 6s
- Visible named-only: Dimitri, Edelgard, Claude
- Visible But No Active Combat After: Edelgard, Claude
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/040_EP02-SC09-SHOT-Shot034-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/040_EP02-SC09-SHOT-Shot034-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/040_EP02-SC09-SHOT-Shot034-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/040_EP02-SC09-SHOT-Shot034-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/040_EP02-SC09-SHOT-Shot034-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/40_Shot034.mp4
- Primary check: 迪米特里、艾黛尔贾特、库罗德在战后互相确认实力，非贬低式结尾。 Critical re-audit: monitor_required. 保留为短对白镜头，台词要体现势均力敌、青狮险胜。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Limited But Not Defeated After: none
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: none
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela

### 041_Shot035

- Shot: Shot035
- Duration: 6s
- Visible named-only: Felix, Byleth
- Visible But No Active Combat After: Felix
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/041_EP02-SC09-SHOT-Shot035-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/041_EP02-SC09-SHOT-Shot035-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/041_EP02-SC09-SHOT-Shot035-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/041_EP02-SC09-SHOT-Shot035-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/041_EP02-SC09-SHOT-Shot035-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/41_Shot035.mp4
- Primary check: 2026-08-15 重做三帧：菲力克斯与贝雷特只作为战后收束对话出现。菲力克斯已 spent_stood_down，训练剑始终低放/收起；贝雷特用教师式停手提醒而不接战。全镜仅二人，无其他学生回场，无新战斗、无攻击、无羞辱。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Limited But Not Defeated After: none
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: none
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela

### 042_Shot036

- Shot: Shot036
- Duration: 6s
- Visible named-only: Dimitri, Byleth
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/042_EP02-SC09-SHOT-Shot036-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/042_EP02-SC09-SHOT-Shot036-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/042_EP02-SC09-SHOT-Shot036-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/042_EP02-SC09-SHOT-Shot036-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/042_EP02-SC09-SHOT-Shot036-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/42_Shot036.mp4
- Primary check: 迪米特里向贝雷特承认胜利很险，收束青狮获胜但尊重两班。 Critical re-audit: monitor_required. 保留为结尾对白镜头，加入‘只是抓住了一瞬空隙’的台词锚点。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Limited But Not Defeated After: none
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: none
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
