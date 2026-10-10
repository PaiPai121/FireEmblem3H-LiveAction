# EP02-SC09-SHOT-Shot025-V2-20260721 Frame Spec

Shot ID: EP02-SC09-SHOT-Shot025-V2-20260721
Stage: storyboard
Status: visual_review_passed
Depends On: EP02-SC09-SCRIPT-V2-20260721, EP02-SC09-SHOTLIST-V2-20260721
Script Beat: 用三位级长近景确立学级模拟战规则与目标，让三学级从开场就读作势均力敌。
Shot Purpose: 用三位级长近景确立学级模拟战规则与目标，让三学级从开场就读作势均力敌。
Duration Target: 6s
Location: Garreg Mach outdoor mock battle grounds, academy-era supervised training field.
Characters Visible: Dimitri, Edelgard, Claude

Character Identity Locks:
- Dimitri: asset not specified
- Edelgard: asset not specified
- Claude: asset not specified

Asset References:
- assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png
- assets/characters/church_of_seiros/Manuela/academy/selected.png
- assets/characters/church_of_seiros/Hanneman/academy/selected.png
- assets/characters/blue_lions/Dimitri/academy/selected.png
- assets/characters/black_eagles/Edelgard/academy/selected.png
- assets/characters/golden_deer/Claude/academy/selected.png

Start Frame Intent:
Use the approved start frame as the stable pre-action state.
Start Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/38D_Shot034_three_leaders_start.png

Key Frame Intent:
Use the approved key frame as the clearest action or emotional peak.
Key Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/38D_Shot034_three_leaders_key.png

End Frame Intent:
Approved generated end frame: resolve the key action into the cut-out state while preserving roster status, screen direction, weapons, and nonlethal mock-battle tone.
End Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/38D_Shot034_three_leaders_start.png

Camera:
Medium-wide triangular leadership composition around neutral objective markers; restrained settle only, no camera spin and no crowd reveal.

Blocking:
Characters face tactical threats, routes, teachers, or allies according to the shot purpose; no readable active combatant should face the camera unless the camera is on that character's eyeline target.

Screen Direction:
Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.

Action Peak:
Maintain the declared shot action peak from the V2 queue.

Dialogue / Audio Anchor:
Manuela, offscreen left lane: "目标计时开始，别抢线。" Hanneman, offscreen right lane: "非致命，判断优先。" Keep their voices separated by direction; do not imply they stand together.

Edit In:
use start_frame as first generated frame; preserve the declared screen direction and readable named-only roster

Edit Out:
hold end_frame state for final 0.5 seconds; reject generated clips that do not land on this state

Continuity Requirements:
- Previous: none
- Next: EP02-SC09-SHOT-Shot025A-V2-20260721
- Preserve academy-era nonlethal rules and three-house competence.
- Preserve the roster state below. Characters listed as stood down, objective-displaced, or post-battle must not reappear as active combatants later.

Roster After Shot:
Battle ledger after this shot:
- All named characters alive: yes
- Alive roster by house: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Still active / controlling objective: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Limited but not defeated: none
- Mock-battle defeated / removed / stood down: none
- Captured or objective-defeated: none
- Stood down or post-battle: none
- Must not return as active combatants in later shots: none
- Changed this shot: none
- Ledger rule: 学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。
- Ledger note: 安全存活/非致命：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 仍可主动参战/控制目标：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 受限但未败：无 已击败/被俘/目标判负/退场，不可再主动战斗：无
- Continuity lock: 后续镜头必须继承本镜头后的角色状态。
- Note: 规则与胜利条件建立；所有学生仍可行动，教师控制治疗纹目标。

Motion Risks:
- Identity drift in readable student faces.
- Weapon drift from training props to lethal weapons.
- Screen-direction reversal across adjacent cuts.
- Extra anonymous fighters entering readable foreground.
- AI exaggerating mock-battle pressure into lethal combat.

Prompt Path:
production_system/scene09_v3_attrition_package/production_video_prompts/Shot025_production_video_prompt_v3.md

Negative Prompt Path:
production_system/scene09_v2_repair_package/negative_prompts/Shot025_negative_prompt.md

Reject If:
- Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.
- Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.
- Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.
- Reject if any face, age, costume, house color, or weapon changes from the input frames and named references.
- Reject if the action becomes lethal, bloody, humiliating, or unrelated to the start/key/end chain.
- anyone outside Dimitri, Edelgard, and Claude appears as a readable human.
- Hanneman or Manuela appear visually; their rule lines must remain separate offscreen audio only.
- the shot adds any readable student beyond the three house leaders or adds anonymous spectators.
- any teacher platform is occupied or the geography implies Hanneman and Manuela are side-by-side partners.
- Reject if the roster state after this shot contradicts later active appearances.
