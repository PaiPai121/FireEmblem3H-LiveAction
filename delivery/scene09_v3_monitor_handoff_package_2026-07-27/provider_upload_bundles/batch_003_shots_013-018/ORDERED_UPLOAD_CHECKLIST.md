# batch_003_shots_013-018 Provider Upload Checklist

Use this folder as a self-contained full-duration image-to-video upload unit only after `full_duration_release_gate` passes.

Current lock: full-duration generation is blocked until 42/42 returned motion probes pass signed Codex review and the production package contains `motion_probe_full_duration_release.json`.

## Submit

- Do not upload this full-duration batch while `full_duration_release_gate` is `full_duration_release_blocked_probe_review_pending`.
- Use `batch.jsonl` for structured model/provider upload only after release.
- Use `batch.csv` and this checklist for manual upload only after release.
- Each row points to files under `shots/` inside this folder.
- Generate one mp4 per row and name or map it using `expected_downloads_subset.csv`.

## Hard Rules

- Do not add anonymous readable students, spectators, soldiers, crowds, bystanders, or silhouettes.
- Keep the visible named-only roster exactly as listed per shot.
- Treat Visible But No Active Combat After as a hard staging lock: those readable people may only stand down, concede, lower weapons, or remain post-battle; they must not resume active combat.
- Keep all defeated, captured, stood-down, or objective-defeated characters from returning to active combat.
- Shot034B, if present: Byleth and Dimitri only; empty faculty objective markers; Hanneman/Manuela absent/offscreen/silent/unpaired.
- Do not promote any returned clip until Codex motion QA passes.

## Rows

### 013_Shot029

- Shot: Shot029
- Duration: 6s
- Visible named-only: Sylvain, Ingrid, Annette, Mercedes, Hilda, Lorenz
- Visible But No Active Combat After: none
- Model prompt: shots/013_EP02-SC09-SHOT-Shot029-V2-20260721/model_prompt.md
- Negative prompt: shots/013_EP02-SC09-SHOT-Shot029-V2-20260721/negative_prompt.md
- Frames: shots/013_EP02-SC09-SHOT-Shot029-V2-20260721/start_frame.png | shots/013_EP02-SC09-SHOT-Shot029-V2-20260721/key_frame.png | shots/013_EP02-SC09-SHOT-Shot029-V2-20260721/end_frame.png
- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/13_Shot029.mp4
- Primary check: 2026-08-12 重做三帧：金鹿从侧翼切入，希尔妲与洛廉兹压迫希尔凡/英谷莉特，伊格纳兹以弓线牵制黑鹫方向；青狮被迫转身守线但未崩溃，三方混战逻辑成立。希尔妲维持学院年龄。仍需独立视频前复审。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Annette, Mercedes
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 014_Shot029C

- Shot: Shot029C
- Duration: 6s
- Visible named-only: Claude, Ashe, Edelgard
- Visible But No Active Combat After: none
- Model prompt: shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721/model_prompt.md
- Negative prompt: shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721/negative_prompt.md
- Frames: shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721/start_frame.png | shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721/key_frame.png | shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721/end_frame.png
- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/14_Shot029C.mp4
- Primary check: 2026-08-12 重做三帧：库罗德位于侧高点观察两条训练线，亚修在青狮低位发现他，艾黛尔贾特在远处黑鹫线独立调度；三方空间关系清楚，不再是并肩合影。复审重点：亚修蓝狮识别需确认足够清楚。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Annette, Mercedes
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 015_Shot029D

- Shot: Shot029D
- Duration: 6s
- Visible named-only: Claude, Ashe
- Visible But No Active Combat After: none
- Model prompt: shots/015_EP02-SC09-SHOT-Shot029D-V2-20260721/model_prompt.md
- Negative prompt: shots/015_EP02-SC09-SHOT-Shot029D-V2-20260721/negative_prompt.md
- Frames: shots/015_EP02-SC09-SHOT-Shot029D-V2-20260721/start_frame.png | shots/015_EP02-SC09-SHOT-Shot029D-V2-20260721/key_frame.png | shots/015_EP02-SC09-SHOT-Shot029D-V2-20260721/end_frame.png
- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/15_Shot029D.mp4
- Primary check: 亚修短暂发现库罗德，但库罗德利用掩体换位。 Critical re-audit: monitor_required. 可保留但要重写 prompt，让库罗德从树影后撤出画，亚修转身追失。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: Ashe:displaced; Leonie:hidden_flanker
- No-Active-Combat Line: none

### 016_Shot029B

- Shot: Shot029B
- Duration: 6s
- Visible named-only: Hilda, Lorenz, Ignatz, Sylvain, Ingrid
- Visible But No Active Combat After: none
- Model prompt: shots/016_EP02-SC09-SHOT-Shot029B-V2-20260721/model_prompt.md
- Negative prompt: shots/016_EP02-SC09-SHOT-Shot029B-V2-20260721/negative_prompt.md
- Frames: shots/016_EP02-SC09-SHOT-Shot029B-V2-20260721/start_frame.png | shots/016_EP02-SC09-SHOT-Shot029B-V2-20260721/key_frame.png | shots/016_EP02-SC09-SHOT-Shot029B-V2-20260721/end_frame.png
- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/16_Shot029B.mp4
- Primary check: 2026-08-15 重做三帧：金鹿从画面左侧压迫青狮侧翼，希尔凡和英谷莉特在右侧转身正面接住；五名学生朝向对手/路线，非镜头摆拍。希尔妲保持学院年龄并使用扁平训练斧，洛廉兹、希尔凡、英谷莉特均为钝头训练枪/杆，伊格纳兹后排弓线不拉弦。双方势均力敌，无人退场、无击伤、无陌生人。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 017_Shot030

- Shot: Shot030
- Duration: 6s
- Visible named-only: Felix, Byleth, Ferdinand
- Visible But No Active Combat After: none
- Model prompt: shots/017_EP02-SC09-SHOT-Shot030-V2-20260721/model_prompt.md
- Negative prompt: shots/017_EP02-SC09-SHOT-Shot030-V2-20260721/negative_prompt.md
- Frames: shots/017_EP02-SC09-SHOT-Shot030-V2-20260721/start_frame.png | shots/017_EP02-SC09-SHOT-Shot030-V2-20260721/key_frame.png | shots/017_EP02-SC09-SHOT-Shot030-V2-20260721/end_frame.png
- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/17_Shot030.mp4
- Primary check: 菲力克斯用速度逼费尔迪南特后撤，但不羞辱对手。 Critical re-audit: monitor_required. 补 end：费尔迪南特退后放低训练枪，承认被压线。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none

### 018_Shot030B

- Shot: Shot030B
- Duration: 6s
- Visible named-only: Felix, Byleth
- Visible But No Active Combat After: none
- Model prompt: shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721/model_prompt.md
- Negative prompt: shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721/negative_prompt.md
- Frames: shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721/start_frame.png | shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721/key_frame.png | shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721/end_frame.png
- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/18_Shot030B.mp4
- Primary check: 贝雷特制止菲力克斯过度追击，显示青狮险胜不是碾压。 Critical re-audit: monitor_required. 保留为短对白镜头，明确菲力克斯收剑而不是继续攻击。
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
