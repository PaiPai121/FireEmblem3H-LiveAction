# EP02-SC09-SHOT-Shot034B-V2-20260721 Frame Spec

Shot ID: EP02-SC09-SHOT-Shot034B-V2-20260721
Stage: storyboard
Status: monitor_required
Depends On: EP02-SC09-SCRIPT-V2-20260721, EP02-SC09-SHOTLIST-V2-20260721
Script Beat: 青狮不是击倒老师，而是在混战后占住空置目标点，由贝雷特裁定险胜。
Shot Purpose: 青狮不是击倒老师，而是在混战后占住空置目标点，由贝雷特裁定险胜。
Duration Target: 6s
Location: Garreg Mach outdoor mock battle grounds, academy-era supervised training field.
Characters Visible: Byleth, Dimitri

Character Identity Locks:
- Byleth: asset not specified
- Dimitri: asset not specified

Asset References:

Start Frame Intent:
Use the approved start frame as the stable pre-action state.
Start Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-25/34D_Shot034B_empty_objective_start.png

Key Frame Intent:
Use the approved key frame as the clearest action or emotional peak.
Key Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-25/34D_Shot034B_empty_objective_key.png

End Frame Intent:
Approved generated end frame: resolve the key action into the cut-out state while preserving roster status, screen direction, weapons, and nonlethal mock-battle tone.
End Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-25/34D_Shot034B_empty_objective_end.png

Camera:
Restrained medium-wide settle on two empty objective markers. Keep Byleth and Dimitri readable in the foreground, both facing the markers rather than posing toward camera. No teacher lane crossing and no readable background people.

Blocking:
Characters face tactical threats, routes, teachers, or allies according to the shot purpose; no readable active combatant should face the camera unless the camera is on that character's eyeline target.

Screen Direction:
Byleth and Dimitri face two empty faculty objective markers, not Hanneman, Manuela, or the camera; no teacher lane crossing.

Action Peak:
Maintain the declared shot action peak from the V2 queue.

Dialogue / Audio Anchor:
Whistle tail. Byleth: "判定，青狮守住。" Dimitri tired breath. No Hanneman voice and no Manuela voice in this shot.

Edit In:
use start_frame as first generated frame; preserve the declared screen direction and readable named-only roster

Edit Out:
hold end_frame state for final 0.5 seconds; reject generated clips that do not land on this state

Continuity Requirements:
- Previous: EP02-SC09-SHOT-Shot034D-V2-20260721
- Next: EP02-SC09-SHOT-Shot034E-V2-20260721
- Preserve academy-era nonlethal rules and three-house competence.
- Preserve the roster state below. Characters listed as stood down, objective-displaced, or post-battle must not reappear as active combatants later.

Roster After Shot:
Battle ledger after this shot:
- All named characters alive: yes
- Alive roster by house: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Still active / controlling objective: blue_lions: Dimitri, Dedue; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; command: Byleth
- Limited but not defeated: black_eagles: Edelgard, Ferdinand; golden_deer: Hilda
- Mock-battle defeated / removed / stood down: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; faculty: Hanneman, Manuela
- Captured or objective-defeated: black_eagles: Hubert, Dorothea, Bernadetta; faculty: Hanneman, Manuela
- Stood down or post-battle: none
- Must not return as active combatants in later shots: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; faculty: Hanneman, Manuela
- Changed this shot: Hanneman=离开目标纹/目标判定失守, Manuela=离开目标纹/目标判定失守, Dimitri=交战中, Byleth=可继续行动
- Ledger rule: 学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。
- Ledger note: 安全存活/非致命：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 仍可主动参战/控制目标：青狮: Dimitri, Dedue; 黑鹫: Edelgard, Ferdinand; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 贝雷特: Byleth 受限但未败：黑鹫: Edelgard, Ferdinand; 金鹿: Hilda 已击败/被俘/目标判负/退场，不可再主动战斗：青狮: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Hubert, Dorothea, Bernadetta; 教师裁定: Hanneman, Manuela
- Continuity lock: 后续镜头不得把 retired_or_out_by_house 中角色重新作为主动战斗者；被俘角色只能作为被控制/离场/赛后反应出现，除非另有明确释放镜头。
- Result: 青狮目标胜利成立；034B 画面只允许贝雷特、帝弥托利、汉尼曼三名可读人物，接下来所有学生应进入收武器/退场状态，不再新增主动攻击。
- Note: 贝雷特和帝弥托利只在汉尼曼自己的教师目标线确认判定；汉尼曼可见但已失去目标控制，玛努艾拉在另一条教师线被切断路线且不入画，绝不与汉尼曼并肩成组。

Motion Risks:
- Identity drift in readable student faces.
- Weapon drift from training props to lethal weapons.
- Screen-direction reversal across adjacent cuts.
- Extra anonymous fighters entering readable foreground.
- AI exaggerating mock-battle pressure into lethal combat.

Prompt Path:
production_system/scene09_v3_attrition_package/production_video_prompts/Shot034B_production_video_prompt_v3.md

Negative Prompt Path:
production_system/scene09_v2_repair_package/negative_prompts/Shot034B_negative_prompt.md

Reject If:
- Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.
- Reject if anyone outside Byleth and Dimitri appears.
- Two far-separated faculty objective markers must be empty.
- Reject if Hanneman appears in any readable form.
- Reject if Manuela appears in any readable form.
- Reject if any teacher stands on a marker, speaks, or reads as a combat partner.
- Reject if Hanneman and Manuela share the same platform, lane, sigil, eyeline pairing, or allied blocking.
- Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.
- Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.
- Reject if the roster state after this shot contradicts later active appearances.
