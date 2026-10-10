# EP02-SC09-SHOT-Shot030B-V2-20260721 Frame Spec

Shot ID: EP02-SC09-SHOT-Shot030B-V2-20260721
Stage: storyboard
Status: visual_review_passed
Depends On: EP02-SC09-SCRIPT-V2-20260721, EP02-SC09-SHOTLIST-V2-20260721
Script Beat: 菲力克斯看见侧切路线但即将过度前压，贝雷特用手势叫停；武器必须读作单根直木制训练剑。
Shot Purpose: 菲力克斯看见侧切路线但即将过度前压，贝雷特用手势叫停；武器必须读作单根直木制训练剑。
Duration Target: 6s
Location: Garreg Mach outdoor mock battle grounds, academy-era supervised training field.
Characters Visible: Felix, Byleth

Character Identity Locks:
- Felix: asset not specified
- Byleth: asset not specified

Asset References:
- assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png
- assets/characters/blue_lions/Felix/academy/selected.png
- assets/characters/protagonist/Byleth/professor/selected.png

Start Frame Intent:
Use the approved start frame as the stable pre-action state.
Start Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/18_Shot030B_start.png

Key Frame Intent:
Use the approved key frame as the clearest action or emotional peak.
Key Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/18_Shot030B_key.png

End Frame Intent:
Approved generated end frame: resolve the key action into the cut-out state while preserving roster status, screen direction, weapons, and nonlethal mock-battle tone.
End Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/18_Shot030B_key.png

Camera:
Preserve the two-character left-right formation-yard composition. Use a restrained push or settle only; do not spin, cross screen direction, or reveal extra fighters.

Blocking:
Characters face tactical threats, routes, teachers, or allies according to the shot purpose; no readable active combatant should face the camera unless the camera is on that character's eyeline target.

Screen Direction:
Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.

Action Peak:
Maintain the declared shot action peak from the V2 queue.

Dialogue / Audio Anchor:
Cloth snap, stopped breath. Byleth, low and clipped: "停。" Felix exhales through his nose and does not answer.

Edit In:
use start_frame as first generated frame; preserve the declared screen direction and readable named-only roster

Edit Out:
hold end_frame state for final 0.5 seconds; reject generated clips that do not land on this state

Continuity Requirements:
- Previous: EP02-SC09-SHOT-Shot030-V2-20260721
- Next: EP02-SC09-SHOT-Shot030C-V2-20260721
- Preserve academy-era nonlethal rules and three-house competence.
- Preserve the roster state below. Characters listed as stood down, objective-displaced, or post-battle must not reappear as active combatants later.

Roster After Shot:
Battle ledger after this shot:
- All named characters alive: yes
- Alive roster by house: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Still active / controlling objective: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Limited but not defeated: blue_lions: Dimitri, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
- Mock-battle defeated / removed / stood down: none
- Captured or objective-defeated: none
- Stood down or post-battle: none
- Must not return as active combatants in later shots: none
- Changed this shot: Felix=被克制提醒但未退场
- Ledger rule: 学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。
- Ledger note: 安全存活/非致命：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 仍可主动参战/控制目标：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 受限但未败：青狮: Dimitri, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid 已击败/被俘/目标判负/退场，不可再主动战斗：无
- Continuity lock: 后续镜头必须继承本镜头后的角色状态。
- Note: 菲力克斯触线被贝雷特身体/手势切断路线；未退场。

Motion Risks:
- Identity drift in readable student faces.
- Weapon drift from training props to lethal weapons.
- Screen-direction reversal across adjacent cuts.
- Extra anonymous fighters entering readable foreground.
- AI exaggerating mock-battle pressure into lethal combat.

Prompt Path:
production_system/scene09_v3_attrition_package/production_video_prompts/Shot030B_production_video_prompt_v3.md

Negative Prompt Path:
production_system/scene09_v2_repair_package/negative_prompts/Shot030B_negative_prompt.md

Reject If:
- Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.
- Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.
- Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.
- Reject if any face, age, costume, house color, or weapon changes from the input frames and named references.
- Reject if the action becomes lethal, bloody, humiliating, or unrelated to the start/key/end chain.
- any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.
- captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.
- any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.
- any face, age, costume, house color, or weapon changes from the input frames and named references.
- the action becomes lethal, bloody, humiliating, or unrelated to the start/key/end chain.
- anyone outside Felix and Byleth appears.
- Felix's weapon reads as a chain blade, segmented blade, whip sword, metal edge, glowing relic, sharp sword, or Sword of the Creator.
- Felix attacks through Byleth's stop order or if a hit lands.
- any face, age, costume, house color, or weapon changes from the approved references.
- camera spin, line crossing, or a new establishing shot hides the intended action peak.
- Reject if the roster state after this shot contradicts later active appearances.
