# EP02-SC09-SHOT-Shot032F-V2-20260724 Frame Spec

Shot ID: EP02-SC09-SHOT-Shot032F-V2-20260724
Stage: storyboard
Status: monitor_required
Depends On: EP02-SC09-SCRIPT-V2-20260721, EP02-SC09-SHOTLIST-V2-20260721
Script Beat: Felix and Ashe nonlethally rule Hubert out.
Shot Purpose: Felix and Ashe nonlethally rule Hubert out.
Duration Target: 6s
Location: Garreg Mach outdoor mock battle grounds, academy-era supervised training field.
Characters Visible: Felix, Ashe, Hubert

Character Identity Locks:
- Felix: assets/characters/blue_lions/Felix/academy/selected.png; weapon/prop lock: wooden training sword held low as a route block, no live blade
- Ashe: assets/characters/blue_lions/Ashe/academy/selected.png; weapon/prop lock: training bow with blunt practice arrow line aimed at ground/cloth, not a lethal shot
- Hubert: assets/characters/black_eagles/Hubert/academy/selected.png; weapon/prop lock: dark magic gesture fading as he is checked, dignified posture

Asset References:
- assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png
- episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/27_Shot032E_key.png
- assets/characters/blue_lions/Felix/academy/selected.png
- assets/characters/blue_lions/Ashe/academy/selected.png
- assets/characters/black_eagles/Hubert/academy/selected.png

Start Frame Intent:
Use the approved start frame as the stable pre-action state.
Start Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-25/27D_Shot032F_quality_start.png

Key Frame Intent:
Use the approved key frame as the clearest action or emotional peak.
Key Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-25/27D_Shot032F_quality_key.png

End Frame Intent:
Approved generated end frame: resolve the key action into the cut-out state while preserving roster status, screen direction, weapons, and nonlethal mock-battle tone.
End Frame Path: episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-25/27D_Shot032F_quality_end.png

Camera:
Preserve the current approved composition and shot scale; animate within the frame rather than redesigning the setup.

Blocking:
Characters face tactical threats, routes, teachers, or allies according to the shot purpose; no readable active combatant should face the camera unless the camera is on that character's eyeline target.

Screen Direction:
Blue Lions containment enters from lower-right/right; Hubert is Black Eagles side upper-right; Golden Deer pressure remains implied from left.

Action Peak:
Maintain the declared shot action peak from the V2 queue.

Dialogue / Audio Anchor:
Ashe, low: "菲力克斯，现在。" Felix: "我封路。" Hubert, controlled: "……判断倒是很快。"

Edit In:
use start_frame as first generated frame; preserve the declared screen direction and readable named-only roster

Edit Out:
hold end_frame state for final 0.5 seconds; reject generated clips that do not land on this state

Continuity Requirements:
- Previous: EP02-SC09-SHOT-Shot032E-V2-20260721
- Next: EP02-SC09-SHOT-Shot032G-V2-20260724
- Preserve academy-era nonlethal rules and three-house competence.
- Preserve the roster state below. Characters listed as stood down, objective-displaced, or post-battle must not reappear as active combatants later.

Roster After Shot:
Battle ledger after this shot:
- All named characters alive: yes
- Alive roster by house: blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Still active / controlling objective: blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; faculty: Hanneman, Manuela; command: Byleth
- Limited but not defeated: black_eagles: Edelgard, Dorothea, Bernadetta; golden_deer: Claude, Hilda
- Mock-battle defeated / removed / stood down: blue_lions: Annette, Mercedes; black_eagles: Hubert
- Captured or objective-defeated: black_eagles: Hubert
- Stood down or post-battle: none
- Must not return as active combatants in later shots: blue_lions: Annette, Mercedes; black_eagles: Hubert
- Changed this shot: Hubert=被俘/模拟战判定退场, Felix=押俘/控制俘虏, Ashe=押俘/控制俘虏
- Ledger rule: 学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。
- Ledger note: 安全存活/非致命：青狮: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; 黑鹫: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 仍可主动参战/控制目标：青狮: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; 黑鹫: Edelgard, Ferdinand, Dorothea, Bernadetta; 金鹿: Claude, Hilda, Lorenz, Ignatz, Leonie; 教师裁定: Hanneman, Manuela; 贝雷特: Byleth 受限但未败：黑鹫: Edelgard, Dorothea, Bernadetta; 金鹿: Claude, Hilda 已击败/被俘/目标判负/退场，不可再主动战斗：青狮: Annette, Mercedes; 黑鹫: Hubert
- Continuity lock: 后续镜头不得把 retired_or_out_by_house 中角色重新作为主动战斗者；被俘角色只能作为被控制/离场/赛后反应出现，除非另有明确释放镜头。
- Result: 此后休伯特不得再作为主动战斗者出现；只能作为被控制、离场或赛后反应出现。
- Note: 菲力克斯和阿修联手切断休伯特施法角度；休伯特被迫举手/后撤，按模拟战规则退场。

Motion Risks:
- Identity drift in readable student faces.
- Weapon drift from training props to lethal weapons.
- Screen-direction reversal across adjacent cuts.
- Extra anonymous fighters entering readable foreground.
- AI exaggerating mock-battle pressure into lethal combat.

Prompt Path:
production_system/scene09_v3_attrition_package/production_video_prompts/Shot032F_production_video_prompt_v3.md

Negative Prompt Path:
production_system/scene09_v2_repair_package/negative_prompts/Shot032F_negative_prompt.md

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
- Hubert is injured, humiliated, kneeling, killed, or panicked.
- Felix uses a live sword or Ashe fires a lethal arrow into Hubert's body.
- Hubert remains an active caster at the end frame.
- extra readable fighters confuse who captured Hubert.
- Reject if the roster state after this shot contradicts later active appearances.
