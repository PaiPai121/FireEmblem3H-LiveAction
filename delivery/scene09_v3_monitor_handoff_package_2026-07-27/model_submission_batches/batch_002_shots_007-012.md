# batch_002_shots_007-012

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

### 007_Shot027B

- Shot: Shot027B
- Duration: 6s
- Visible named-only: Ferdinand, Edelgard, Hubert, Dorothea
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/007_EP02-SC09-SHOT-Shot027B-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/007_EP02-SC09-SHOT-Shot027B-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/007_EP02-SC09-SHOT-Shot027B-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/007_EP02-SC09-SHOT-Shot027B-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/007_EP02-SC09-SHOT-Shot027B-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/07_Shot027B.mp4
- Primary check: 2026-08-12 重做三帧：费尔迪南特以训练枪压线，艾黛尔贾特持训练斧指挥，修伯特与朵洛缇雅后排以受控魔法压迫；四名黑鹫学生均朝青狮方向行动，无路人、无站桩合影。仍需独立视频前复审。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 008_Shot027C

- Shot: Shot027C
- Duration: 6s
- Visible named-only: Dimitri, Dedue, Ferdinand, Edelgard, Hubert
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/008_EP02-SC09-SHOT-Shot027C-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/008_EP02-SC09-SHOT-Shot027C-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/008_EP02-SC09-SHOT-Shot027C-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/008_EP02-SC09-SHOT-Shot027C-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/008_EP02-SC09-SHOT-Shot027C-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/08_Shot027C.mp4
- Primary check: 2026-08-12 重做三帧：杜笃与帝弥托利从青狮侧正面迎击，费尔迪南特、艾黛尔贾特、修伯特从黑鹫侧压线；盾牌承压后双方半步分开，朝向和轴线成立，双方势均力敌且无人退场。仍需独立视频前复审。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 009_Shot027D

- Shot: Shot027D
- Duration: 6s
- Visible named-only: Felix, Byleth, Ferdinand, Dedue
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/009_EP02-SC09-SHOT-Shot027D-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/009_EP02-SC09-SHOT-Shot027D-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/009_EP02-SC09-SHOT-Shot027D-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/009_EP02-SC09-SHOT-Shot027D-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/009_EP02-SC09-SHOT-Shot027D-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/09_Shot027D.mp4
- Primary check: 菲力克斯利用杜笃挡线后的空隙切入，牵制费尔迪南特。 Critical re-audit: monitor_required. 保留候选，但 end 必须显示费尔迪南特被迫后撤或举手认定受限。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 010_Shot028

- Shot: Shot028
- Duration: 6s
- Visible named-only: Annette, Mercedes, Ignatz
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/010_EP02-SC09-SHOT-Shot028-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/010_EP02-SC09-SHOT-Shot028-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/010_EP02-SC09-SHOT-Shot028-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/010_EP02-SC09-SHOT-Shot028-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/010_EP02-SC09-SHOT-Shot028-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/10_Shot028.mp4
- Primary check: 安娜特施法制造掩护，梅尔塞德斯保护后排，伊格纳兹远处对射。 Critical re-audit: monitor_required. 重做优先级中等：强化安娜特翻书起手、亚修借烟转移。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Annette, Mercedes
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: Annette:pressured; Mercedes:pressured
- No-Active-Combat Line: none

### 011_Shot028B

- Shot: Shot028B
- Duration: 6s
- Visible named-only: Edelgard, Hubert, Dorothea, Dimitri, Dedue
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/011_EP02-SC09-SHOT-Shot028B-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/011_EP02-SC09-SHOT-Shot028B-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/011_EP02-SC09-SHOT-Shot028B-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/011_EP02-SC09-SHOT-Shot028B-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/011_EP02-SC09-SHOT-Shot028B-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/11_Shot028B.mp4
- Primary check: 黑鹫拿到高光：艾黛尔贾特指挥推进，修伯特/朵洛缇雅用非致命魔法压迫杜笃与迪米特里。 Critical re-audit: monitor_required. 需要在视频提示中增加脚步推进和盾线反应，必要时重做关键帧。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Annette, Mercedes
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 012_Shot028C

- Shot: Shot028C
- Duration: 6s
- Visible named-only: Felix, Byleth, Ferdinand, Dedue
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/012_EP02-SC09-SHOT-Shot028C-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/012_EP02-SC09-SHOT-Shot028C-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/012_EP02-SC09-SHOT-Shot028C-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/012_EP02-SC09-SHOT-Shot028C-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/012_EP02-SC09-SHOT-Shot028C-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/12_Shot028C.mp4
- Primary check: 贝雷特把菲力克斯从过深追击中拉回，保持模拟战规则。 Critical re-audit: monitor_required. 保留候选，但需让费尔迪南特远处明确放低武器或后撤。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Annette, Mercedes
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
