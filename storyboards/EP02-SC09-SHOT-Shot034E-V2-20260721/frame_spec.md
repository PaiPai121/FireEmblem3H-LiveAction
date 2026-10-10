# EP02-SC09-SHOT-Shot034E-V2-20260721 Frame Spec

Shot ID: EP02-SC09-SHOT-Shot034E-V2-20260721
Stage: storyboard
Status: monitor_required
Depends On: EP02-SC09-SCRIPT-V2-20260721, EP02-SC09-SHOTLIST-V2-20260721
Script Beat: Golden Deer stand-down.
Shot Purpose: Golden Deer stand-down.
Duration Target: 6s
Location: Garreg Mach outdoor mock battle grounds, academy-era supervised training field.
Characters Visible: Claude, Hilda, Lorenz, Ignatz, Leonie

Character Identity Locks:
- Claude: asset not specified
- Hilda: asset not specified
- Lorenz: asset not specified
- Ignatz: asset not specified
- Leonie: asset not specified

Asset References:
- assets/characters/golden_deer/Claude/academy/selected.png
- assets/characters/golden_deer/Hilda/academy/selected.png
- assets/characters/golden_deer/Lorenz/academy/selected.png
- assets/characters/golden_deer/Ignatz/academy/selected.png
- assets/characters/golden_deer/Leonie/academy/selected.png

Start Frame Intent:
Golden Deer begin a dignified stand-down with safe training weapons lowered and no pursuit.
Start Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/35F_Shot034E_golden_deer_weapons_start.png

Key Frame Intent:
The stand-down action peak: Golden Deer fully accept the objective loss without humiliation.
Key Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/35F_Shot034E_golden_deer_weapons_key.png

End Frame Intent:
Final held state of the Golden Deer stand-down, calm and respectful.
End Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/35F_Shot034E_golden_deer_weapons_end.png

Camera:
Preserve the start/key/end group composition. Use only a restrained push, pan, or settle that clarifies the stand-down without redesigning the shot or crossing screen direction.

Blocking:
Characters face tactical threats, routes, teachers, or allies according to the shot purpose; no readable active combatant should face the camera unless the camera is on that character's eyeline target.

Screen Direction:
Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.

Action Peak:
The stand-down action peak: Golden Deer fully accept the objective loss without humiliation.

Dialogue / Audio Anchor:
Claude: "这步算你们赢。" Golden Deer lower practice gear with calm breath and cloth movement.

Edit In:
use start_frame as first generated frame; preserve the declared screen direction and readable named-only roster

Edit Out:
hold end_frame state for final 0.5 seconds; reject generated clips that do not land on this state

Continuity Requirements:
- Previous: EP02-SC09-SHOT-Shot034B-V2-20260721
- Next: EP02-SC09-SHOT-Shot034F-V2-20260721
- Preserve academy-era nonlethal rules and three-house competence.
- Preserve the roster state below. Characters listed as stood down, objective-displaced, or post-battle must not reappear as active combatants later.

Roster After Shot:
Battle ledger after this shot:
- All named characters alive: yes
- Alive roster by house: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Still active / controlling objective: blue_lions: Dimitri, Dedue; black_eagles: Edelgard, Ferdinand; command: Byleth
- Limited but not defeated: black_eagles: Edelgard, Ferdinand
- Mock-battle defeated / removed / stood down: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela
- Captured or objective-defeated: black_eagles: Hubert, Dorothea, Bernadetta; faculty: Hanneman, Manuela
- Stood down or post-battle: golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie
- Must not return as active combatants in later shots: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela
- Changed this shot: Claude=哨响后收武器退场, Hilda=哨响后收武器退场, Lorenz=哨响后收武器退场, Ignatz=哨响后收武器退场, Leonie=哨响后收武器退场
- Ledger rule: 学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。
- Ledger note: 安全存活/非致命：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 仍可主动参战/控制目标：青狮: Dimitri, Dedue; 黑鹫: Edelgard, Ferdinand; 贝雷特: Byleth 受限但未败：黑鹫: Edelgard, Ferdinand 已击败/被俘/目标判负/退场，不可再主动战斗：青狮: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Hubert, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela
- Continuity lock: 后续镜头不得把 retired_or_out_by_house 中角色重新作为主动战斗者；被俘角色只能作为被控制/离场/赛后反应出现，除非另有明确释放镜头。
- Note: 金鹿有序收弓/收斧/停步；库罗德和雷欧尼保持对多洛、贝尔的俘虏控制，不再主动进攻。

Motion Risks:
- Identity drift in readable student faces.
- Weapon drift from training props to lethal weapons.
- Screen-direction reversal across adjacent cuts.
- Extra anonymous fighters entering readable foreground.
- AI exaggerating mock-battle pressure into lethal combat.

Prompt Path:
production_system/scene09_v3_attrition_package/production_video_prompts/Shot034E_production_video_prompt_v3.md

Negative Prompt Path:
production_system/scene09_v2_repair_package/negative_prompts/Shot034E_negative_prompt.md

Reject If:
- Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.
- Reject if anyone outside Claude, Hilda, Lorenz, Ignatz, and Leonie appears.
- Reject if Hilda's training axe reads as a hammer, mace, flail, ball-on-chain, spherical weapon head, metal axe, or lethal blade.
- Reject if Lorenz or Leonie has a sharp spearhead, metal spear blade, lethal point, body-aimed thrust, or weapon-forward attack pose.
- Reject if Claude or Ignatz draws an arrow, pulls a bowstring, fires, or resumes pursuit.
- Reject if Golden Deer characters resume active combat after the stand-down.
- Reject if the group reads as cosplay mannequins, older adults, or plastic doll faces instead of academy-age live-action students.
- Reject if any captured character reappears, or any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.
- Reject if the shot becomes a cheering victory pose, humiliation, injury, gore, blood, or crowd scene.
- Reject if the roster state after this shot contradicts later active appearances.
