# batch_005_shots_025-030

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

### 025_Shot032C

- Shot: Shot032C
- Duration: 6s
- Visible named-only: Edelgard, Hubert, Dorothea, Claude, Hilda
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/025_EP02-SC09-SHOT-Shot032C-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/025_EP02-SC09-SHOT-Shot032C-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/025_EP02-SC09-SHOT-Shot032C-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/025_EP02-SC09-SHOT-Shot032C-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/025_EP02-SC09-SHOT-Shot032C-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/25_Shot032C.mp4
- Primary check: 2026-08-13 重做三帧：金鹿位于左侧、黑鹫位于右侧，库罗德弓线压住修伯特支援，希尔妲封住朵洛缇雅路线，艾黛尔贾特被迫转身以训练斧防守；画面明确证明金鹿也攻击/牵制黑鹫，且黑鹫仍保持克制高光。仍需独立视频前复审。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes
- Changed This Shot: none
- No-Active-Combat Line: Annette, Mercedes

### 026_Shot032D

- Shot: Shot032D
- Duration: 6s
- Visible named-only: Byleth, Dimitri, Edelgard, Claude
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/026_EP02-SC09-SHOT-Shot032D-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/026_EP02-SC09-SHOT-Shot032D-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/026_EP02-SC09-SHOT-Shot032D-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/026_EP02-SC09-SHOT-Shot032D-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/026_EP02-SC09-SHOT-Shot032D-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/26_Shot032D.mp4
- Primary check: 从高处显示三方战线交叉，青狮利用混乱寻找胜机。 Critical re-audit: layout_reference. 作为战术插入可保留；若当实拍镜头需重生真实人群远景，不要彩色标线。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes
- Changed This Shot: none
- No-Active-Combat Line: Annette, Mercedes

### 027_Shot032E

- Shot: Shot032E
- Duration: 6s
- Visible named-only: Byleth, Dimitri, Edelgard, Claude, Hilda, Hubert
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/027_EP02-SC09-SHOT-Shot032E-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/027_EP02-SC09-SHOT-Shot032E-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/027_EP02-SC09-SHOT-Shot032E-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/027_EP02-SC09-SHOT-Shot032E-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/027_EP02-SC09-SHOT-Shot032E-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/27_Shot032E.mp4
- Primary check: 贝雷特从高处读局，看到金鹿与黑鹫互相牵制后给青狮机会。 Critical re-audit: layout_reference. 保留为导演地图参考；视频化需改成尘土、脚步线、旗帜和真实视线。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes
- Changed This Shot: Byleth:active_available; Dimitri:engaged; Edelgard:pressured; Claude:displaced; Hilda:pressured
- No-Active-Combat Line: Annette, Mercedes

### 028_Shot032F

- Shot: Shot032F
- Duration: 6s
- Visible named-only: Felix, Ashe, Hubert
- Visible But No Active Combat After: Hubert
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/028_EP02-SC09-SHOT-Shot032F-V2-20260724/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/028_EP02-SC09-SHOT-Shot032F-V2-20260724/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/028_EP02-SC09-SHOT-Shot032F-V2-20260724/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/028_EP02-SC09-SHOT-Shot032F-V2-20260724/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/028_EP02-SC09-SHOT-Shot032F-V2-20260724/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/28_Shot032F.mp4
- Primary check: 2026-08-13 重做三帧：菲力克斯近线封住退路，亚修从远角标记施法线，修伯特在结束帧双手离开施法姿态并站到规则线外，体面接受模拟战出局。账本保持 Hubert captured_by_felix_and_ashe，后续不得再主动参战。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert
- Captured / Objective-Defeated After: black_eagles: Hubert
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert
- Changed This Shot: Hubert:captured_by_felix_and_ashe; Felix:captor_active; Ashe:captor_active
- No-Active-Combat Line: Annette, Mercedes, Hubert

### 029_Shot032G

- Shot: Shot032G
- Duration: 6s
- Visible named-only: Claude, Leonie, Dorothea, Bernadetta
- Visible But No Active Combat After: Dorothea, Bernadetta
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/029_EP02-SC09-SHOT-Shot032G-V2-20260724/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/029_EP02-SC09-SHOT-Shot032G-V2-20260724/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/029_EP02-SC09-SHOT-Shot032G-V2-20260724/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/029_EP02-SC09-SHOT-Shot032G-V2-20260724/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/029_EP02-SC09-SHOT-Shot032G-V2-20260724/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/29_Shot032G.mp4
- Primary check: 2026-08-14 重做三帧：金鹿从右侧压入黑鹫后场，雷欧妮以低位木杆封住规则线，库罗德只用低位弓线标记路线；多洛缇雅和贝尔娜提塔在结束帧放低法具/弓并站到线外，体面退出主动战斗。账本保持 Dorothea/Bernadetta captured_by_leonie_and_claude，后续不得再主动参战。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Changed This Shot: Dorothea:captured_by_leonie_and_claude; Bernadetta:captured_by_leonie_and_claude; Claude:captor_active; Leonie:captor_active
- No-Active-Combat Line: Annette, Mercedes, Hubert, Dorothea, Bernadetta

### 030_Shot033

- Shot: Shot033
- Duration: 6s
- Visible named-only: Dimitri, Byleth, Dedue, Hanneman
- Visible But No Active Combat After: none
- Prompt: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/030_EP02-SC09-SHOT-Shot033-V2-20260721/model_prompt.md
- Negative: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/030_EP02-SC09-SHOT-Shot033-V2-20260721/negative_prompt.md
- Frames: /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/030_EP02-SC09-SHOT-Shot033-V2-20260721/start_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/030_EP02-SC09-SHOT-Shot033-V2-20260721/key_frame.png | /Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/030_EP02-SC09-SHOT-Shot033-V2-20260721/end_frame.png
- Expected clip: /Users/zekun/FireEmblem3H-LiveAction/episodes/EP02/video_outputs/scene09_v3_attrition/30_Shot033.mp4
- Primary check: 迪米特里、杜笃和贝雷特确认汉尼曼目标台，准备结束目标。 Critical re-audit: monitor_required. 需要更清晰的目标旗/判定线/安全屏障。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Changed This Shot: none
- No-Active-Combat Line: Annette, Mercedes, Hubert, Dorothea, Bernadetta
