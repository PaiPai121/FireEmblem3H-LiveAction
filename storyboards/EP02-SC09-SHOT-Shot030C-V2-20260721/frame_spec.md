# EP02-SC09-SHOT-Shot030C-V2-20260721 Frame Spec

Shot ID: EP02-SC09-SHOT-Shot030C-V2-20260721
Stage: storyboard
Status: monitor_required
Depends On: EP02-SC09-SCRIPT-V2-20260721, EP02-SC09-SHOTLIST-V2-20260721
Script Beat: Ignatz and Golden Deer cut routes.
Shot Purpose: Ignatz and Golden Deer cut routes.
Duration Target: 6s
Location: Garreg Mach outdoor mock battle grounds, academy-era supervised training field.
Characters Visible: Ignatz, Annette, Mercedes, Dorothea

Character Identity Locks:
- Ignatz: assets/characters/golden_deer/Ignatz/academy/selected.png; weapon/prop lock: training bow
- Annette: assets/characters/blue_lions/Annette/academy/selected.png; weapon/prop lock: book and wind/dust magic
- Mercedes: assets/characters/blue_lions/Mercedes/academy/selected.png; weapon/prop lock: empty hands and short white healing light
- Dorothea: assets/characters/black_eagles/Dorothea/academy/selected.png; weapon/prop lock: controlled support magic

Asset References:
- assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png
- assets/characters/golden_deer/Ignatz/academy/selected.png
- assets/characters/blue_lions/Annette/academy/selected.png
- assets/characters/blue_lions/Mercedes/academy/selected.png
- assets/characters/black_eagles/Dorothea/academy/selected.png

Start Frame Intent:
Use the approved start frame as the stable pre-action state.
Start Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/19_Shot030C_start.png

Key Frame Intent:
Use the approved key frame as the clearest action or emotional peak.
Key Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/19_Shot030C_key.png

End Frame Intent:
Approved generated end frame: resolve the key action into the cut-out state while preserving roster status, screen direction, weapons, and nonlethal mock-battle tone.
End Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/19_Shot030C_end.png

Camera:
Preserve the current approved composition and shot scale; animate within the frame rather than redesigning the setup.

Blocking:
Characters face tactical threats, routes, teachers, or allies according to the shot purpose; no readable active combatant should face the camera unless the camera is on that character's eyeline target.

Screen Direction:
Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the teacher healing sigil. Active combat characters face threats or routes, not the camera.

Action Peak:
Maintain the declared shot action peak from the V2 queue.

Dialogue / Audio Anchor:
Mercedes: "别停在空地上."

Edit In:
use start_frame as first generated frame; preserve the declared screen direction and readable named-only roster

Edit Out:
hold end_frame state for final 0.5 seconds; reject generated clips that do not land on this state

Continuity Requirements:
- Previous: EP02-SC09-SHOT-Shot030B-V2-20260721
- Next: EP02-SC09-SHOT-Shot031-V2-20260721
- Preserve academy-era nonlethal rules and three-house competence.
- Preserve the roster state below. Characters listed as stood down, objective-displaced, or post-battle must not reappear as active combatants later.

Roster After Shot:
Battle ledger after this shot:
- All named characters alive: yes
- Alive roster by house: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Still active / controlling objective: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Limited but not defeated: blue_lions: Dimitri, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Dorothea, Bernadetta
- Mock-battle defeated / removed / stood down: none
- Captured or objective-defeated: none
- Stood down or post-battle: none
- Must not return as active combatants in later shots: none
- Changed this shot: Ignatz=交战中, Annette=受压但未退场, Mercedes=受压但未退场, Dorothea=受压但未退场, Bernadetta=受压但未退场, Leonie=隐蔽可行动
- Ledger rule: 学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。
- Ledger note: 安全存活/非致命：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 仍可主动参战/控制目标：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 受限但未败：青狮: Dimitri, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Dorothea, Bernadetta 已击败/被俘/目标判负/退场，不可再主动战斗：无
- Continuity lock: 后续镜头必须继承本镜头后的角色状态。
- Note: 伊古纳兹封路线，雅妮特/梅尔塞德斯和黑鹫侧路都被迫调整但仍可行动；多洛和贝尔处于金鹿绕后压力下。

Motion Risks:
- Identity drift in readable student faces.
- Weapon drift from training props to lethal weapons.
- Screen-direction reversal across adjacent cuts.
- Extra anonymous fighters entering readable foreground.
- AI exaggerating mock-battle pressure into lethal combat.

Prompt Path:
production_system/scene09_v3_attrition_package/production_video_prompts/Shot030C_production_video_prompt_v3.md

Negative Prompt Path:
production_system/scene09_v2_repair_package/negative_prompts/Shot030C_negative_prompt.md

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
- any readable named character becomes a generic adult mannequin or wrong-age student.
- any combat character faces the camera while their threat or route is elsewhere.
- extra anonymous fighters appear in readable foreground or confuse house lanes.
- the scene becomes lethal, bloody, or humiliating for any house.
- weapon locks are broken: Ignatz: training bow; Annette: book and wind/dust magic; Mercedes: empty hands and short white healing light; Dorothea: controlled support magic.
- Reject if the roster state after this shot contradicts later active appearances.
