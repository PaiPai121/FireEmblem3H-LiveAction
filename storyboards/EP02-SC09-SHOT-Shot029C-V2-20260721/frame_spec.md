# EP02-SC09-SHOT-Shot029C-V2-20260721 Frame Spec

Shot ID: EP02-SC09-SHOT-Shot029C-V2-20260721
Stage: storyboard
Status: monitor_required
Depends On: EP02-SC09-SCRIPT-V2-20260721, EP02-SC09-SHOTLIST-V2-20260721
Script Beat: 把金鹿搅局修成三人战术关系：库罗德读出青狮与黑鹫两条缝，亚修和艾黛尔贾特都可读且仍有体面应对。
Shot Purpose: 把金鹿搅局修成三人战术关系：库罗德读出青狮与黑鹫两条缝，亚修和艾黛尔贾特都可读且仍有体面应对。
Duration Target: 6s
Location: Garreg Mach outdoor mock battle grounds, academy-era supervised training field.
Characters Visible: Claude, Ashe, Edelgard

Character Identity Locks:
- Claude: asset not specified
- Ashe: asset not specified
- Edelgard: asset not specified

Asset References:
- assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png
- assets/characters/golden_deer/Claude/academy/selected.png
- assets/characters/blue_lions/Ashe/academy/selected.png
- assets/characters/black_eagles/Edelgard/academy/selected.png

Start Frame Intent:
Use the approved start frame as the stable pre-action state.
Start Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/14_Shot029C_start.png

Key Frame Intent:
Use the approved key frame as the clearest action or emotional peak.
Key Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/14_Shot029C_key.png

End Frame Intent:
Approved generated end frame: resolve the key action into the cut-out state while preserving roster status, screen direction, weapons, and nonlethal mock-battle tone.
End Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/14_Shot029C_key.png

Camera:
Medium-wide three-character triangle in the archery yard. Keep Claude as the strongest foreground read while Ashe and Edelgard remain large and identifiable. Restrained settle only; no crowd reveal.

Blocking:
Characters face tactical threats, routes, teachers, or allies according to the shot purpose; no readable active combatant should face the camera unless the camera is on that character's eyeline target.

Screen Direction:
Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.

Action Peak:
Maintain the declared shot action peak from the V2 queue.

Dialogue / Audio Anchor:
Bowstring creak, target-yard wind. Claude, low: "两条线，都露出来了。" Ashe catches breath; Edelgard gives a sharp redirecting breath. No subtitles.

Edit In:
use start_frame as first generated frame; preserve the declared screen direction and readable named-only roster

Edit Out:
hold end_frame state for final 0.5 seconds; reject generated clips that do not land on this state

Continuity Requirements:
- Previous: EP02-SC09-SHOT-Shot029-V2-20260721
- Next: EP02-SC09-SHOT-Shot029D-V2-20260721
- Preserve academy-era nonlethal rules and three-house competence.
- Preserve the roster state below. Characters listed as stood down, objective-displaced, or post-battle must not reappear as active combatants later.

Roster After Shot:
Battle ledger after this shot:
- All named characters alive: yes
- Alive roster by house: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Still active / controlling objective: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Limited but not defeated: blue_lions: Dimitri, Felix, Annette, Mercedes
- Mock-battle defeated / removed / stood down: none
- Captured or objective-defeated: none
- Stood down or post-battle: none
- Must not return as active combatants in later shots: none
- Changed this shot: Claude=隐蔽可行动, Ashe=可继续行动, Edelgard=交战中
- Ledger rule: 学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。
- Ledger note: 安全存活/非致命：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 仍可主动参战/控制目标：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 受限但未败：青狮: Dimitri, Felix, Annette, Mercedes 已击败/被俘/目标判负/退场，不可再主动战斗：无
- Continuity lock: 后续镜头必须继承本镜头后的角色状态。
- Note: 克劳德读出两边空隙；他仍是隐蔽指挥位。

Motion Risks:
- Identity drift in readable student faces.
- Weapon drift from training props to lethal weapons.
- Screen-direction reversal across adjacent cuts.
- Extra anonymous fighters entering readable foreground.
- AI exaggerating mock-battle pressure into lethal combat.

Prompt Path:
production_system/scene09_v3_attrition_package/production_video_prompts/Shot029C_production_video_prompt_v3.md

Negative Prompt Path:
production_system/scene09_v2_repair_package/negative_prompts/Shot029C_negative_prompt.md

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
- anyone outside Claude, Ashe, and Edelgard is readable.
- Ashe or Edelgard becomes tiny, blurred, hidden, generic, wrong-age, or unreadable.
- Claude releases a shot, an impact is shown, or anyone is defeated in this shot.
- humanoid dummies, mannequin shapes, or human-like target props appear.
- any prop reads as a sharp lethal weapon or a dramatic injury beat.
- subtitles, captions, UI, watermark, or visible text appears.
- Reject if the roster state after this shot contradicts later active appearances.
