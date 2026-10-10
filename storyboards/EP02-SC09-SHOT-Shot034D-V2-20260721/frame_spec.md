# EP02-SC09-SHOT-Shot034D-V2-20260721 Frame Spec

Shot ID: EP02-SC09-SHOT-Shot034D-V2-20260721
Stage: storyboard
Status: monitor_required
Depends On: EP02-SC09-SCRIPT-V2-20260721, EP02-SC09-SHOTLIST-V2-20260721
Script Beat: Byleth interrupts Hanneman.
Shot Purpose: Byleth interrupts Hanneman.
Duration Target: 6s
Location: Garreg Mach outdoor mock battle grounds, academy-era supervised training field.
Characters Visible: Byleth, Hanneman

Character Identity Locks:
- Byleth: assets/characters/protagonist/Byleth/professor/selected.png; weapon/prop lock: training sword or sheathed sword, command gestures
- Hanneman: assets/characters/church_of_seiros/Hanneman/academy/selected.png; weapon/prop lock: faculty spell gesture

Asset References:
- assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png
- assets/characters/protagonist/Byleth/professor/selected.png
- assets/characters/church_of_seiros/Hanneman/academy/selected.png
- assets/characters/blue_lions/Ashe/academy/selected.png

Start Frame Intent:
Use the approved start frame as the stable pre-action state.
Start Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/33_Shot034D_start.png

Key Frame Intent:
Use the approved key frame as the clearest action or emotional peak.
Key Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/33_Shot034D_key.png

End Frame Intent:
Approved generated end frame: resolve the key action into the cut-out state while preserving roster status, screen direction, weapons, and nonlethal mock-battle tone.
End Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/end_patch_2026-07-25/33B_Shot034D_end.png

Camera:
Preserve the current approved composition and shot scale; animate within the frame rather than redesigning the setup.

Blocking:
Characters face tactical threats, routes, teachers, or allies according to the shot purpose; no readable active combatant should face the camera unless the camera is on that character's eyeline target.

Screen Direction:
Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.

Action Peak:
Maintain the declared shot action peak from the V2 queue.

Dialogue / Audio Anchor:
Hanneman: "判断得很好."

Edit In:
use start_frame as first generated frame; preserve the declared screen direction and readable named-only roster

Edit Out:
hold end_frame state for final 0.5 seconds; reject generated clips that do not land on this state

Continuity Requirements:
- Previous: EP02-SC09-SHOT-Shot034C-V2-20260721
- Next: EP02-SC09-SHOT-Shot034B-V2-20260721
- Preserve academy-era nonlethal rules and three-house competence.
- Preserve the roster state below. Characters listed as stood down, objective-displaced, or post-battle must not reappear as active combatants later.

Roster After Shot:
Battle ledger after this shot:
- All named characters alive: yes
- Alive roster by house: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Still active / controlling objective: blue_lions: Dimitri, Dedue; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Manuela; command: Byleth
- Limited but not defeated: blue_lions: Dimitri; black_eagles: Edelgard, Ferdinand; golden_deer: Hilda; faculty: Manuela
- Mock-battle defeated / removed / stood down: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; faculty: Hanneman
- Captured or objective-defeated: black_eagles: Hubert, Dorothea, Bernadetta; faculty: Hanneman
- Stood down or post-battle: none
- Must not return as active combatants in later shots: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; faculty: Hanneman
- Changed this shot: Byleth=交战中, Hanneman=离开目标纹/目标判定失守
- Ledger rule: 学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。
- Ledger note: 安全存活/非致命：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 仍可主动参战/控制目标：青狮: Dimitri, Dedue; 黑鹫: Edelgard, Ferdinand; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Manuela; 贝雷特: Byleth 受限但未败：青狮: Dimitri; 黑鹫: Edelgard, Ferdinand; 金鹿: Hilda; 教师裁定: Manuela 已击败/被俘/目标判负/退场，不可再主动战斗：青狮: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Hubert, Dorothea, Bernadetta; 教师裁定: Hanneman
- Continuity lock: 后续镜头不得把 retired_or_out_by_house 中角色重新作为主动战斗者；被俘角色只能作为被控制/离场/赛后反应出现，除非另有明确释放镜头。
- Note: 贝雷特打断汉尼曼施法判定；汉尼曼即将离开目标纹。

Motion Risks:
- Identity drift in readable student faces.
- Weapon drift from training props to lethal weapons.
- Screen-direction reversal across adjacent cuts.
- Extra anonymous fighters entering readable foreground.
- AI exaggerating mock-battle pressure into lethal combat.

Prompt Path:
production_system/scene09_v3_attrition_package/production_video_prompts/Shot034D_production_video_prompt_v3.md

Negative Prompt Path:
production_system/scene09_v2_repair_package/negative_prompts/Shot034D_negative_prompt.md

Reject If:
- Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.
- Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.
- Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.
- Reject if any face, age, costume, house color, or weapon changes from the input frames and named references.
- Reject if the action becomes lethal, bloody, humiliating, or unrelated to the start/key/end chain.
- anyone outside Byleth and Hanneman appears.
- Manuela appears or the shot implies a shared teacher sigil.
- Ashe or any other spent character reappears in readable form.
- Byleth's precise rule tap becomes a bare-hand high five, injury, or attack.
- Hanneman keeps an active spell angle at the end.
- Reject if the roster state after this shot contradicts later active appearances.
