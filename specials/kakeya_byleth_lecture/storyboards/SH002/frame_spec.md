# Frame Spec: SH002

Shot ID: SH002
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Question lands on students
Shot Purpose: 让三位学生接住 SH001 的动作问题，先说出最自然的圆盘直觉，再切入 SH003 的固定中心图解。
Duration Target: 8 seconds
Location: Garreg Mach training ground edge
Characters Visible: Female Byleth; Edelgard academy; Lysithea academy; Mercedes academy

Character Identity Locks:
- Use Female Byleth only when visible: assets/characters/protagonist/BylethFemale/professor/selected.png.
- Optional fullbody/weapon reference when the shot needs full posture or sword handling: assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png.
- Use Edelgard academy only when visible: assets/characters/black_eagles/Edelgard/academy/selected.png.
- Use Lysithea academy only when visible: assets/characters/golden_deer/Lysithea/academy/selected.png.
- Use Mercedes academy only when visible: assets/characters/blue_lions/Mercedes/academy/selected.png.
- Student identity lock: one representative per house, exactly Edelgard, Lysithea, and Mercedes; no generic academy students, no altered hair colors, no swapped costumes, no vague house-color stand-ins.
- Identity lock: 16-year-old female professor-era Byleth, calm young teacher and former mercenary protagonist, teal-blue medium hair with fringe and side locks, focused green eyes, canon academy Female Byleth outfit: black short capelet or shoulder mantle, high black collar, cropped black upper garment with visible midriff gap, gold crest/star chest ornament, silver forearm armor, black shorts or skirt panels over patterned black tights, asymmetric knee guard, tall black boots, belts and weapon harness details; not a generic long black coat.
- Reject male Byleth, mature adult mentor, old wizard, generic black-robed sorceress, ordinary student uniform, modern teacher costume, revealing outfit, cosplay plastic look, oversized invented pendant.

Asset References:
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png
- assets/characters/black_eagles/Edelgard/academy/selected.png
- assets/characters/golden_deer/Lysithea/academy/selected.png
- assets/characters/blue_lions/Mercedes/academy/selected.png

Start Frame Intent:
接 SH001 收势后，三位学生看向女贝老师和木剑轨迹，问题刚刚落到他们身上。

Key Frame Intent:
梅尔赛德斯温和地提出圆盘直觉：扫过的地方至少像一个圆。

End Frame Intent:
女贝老师微微点头，视线带向即将出现的俯视固定中心旋转图。

Camera:
低三分之四中景，木剑大前景，女贝老师在后景清晰。

Blocking:
艾黛尔、莉丝缇亚、梅尔赛德斯作为三学级代表在画面中可辨认；梅尔赛德斯开口，艾黛尔和莉丝缇亚看向木剑扫过的方向。

Screen Direction:
女贝老师面向画面右下方的木剑，艾黛尔、莉丝缇亚、梅尔赛德斯在画面后方形成稳定三人组。

Mathematical Graphic Locks:
- This is a reaction bridge into the fixed-center circle intuition. Do not formalize unit endpoints here; keep the wooden sword as the object just demonstrated in SH001.

Action Peak:
梅尔赛德斯说出“像一个圆”的直觉，三位学生视线汇向木剑扫过区域的一刻。

Dialogue / Audio Anchor:
梅尔赛德斯: 扫过的地方，至少像一个圆吧？

Edit In:
接 SH001 收势视线，切到三位学生的低机位反应。

Edit Out:
从梅尔赛德斯的“圆”直觉切到俯视固定中心旋转图。

Continuity Requirements:
- Previous shot: SH001 (Sword flourish hook).
- Next shot: SH003 (Naive circular intuition).
- Preserve screen direction and visual subject handoff stated above.
- Student roster is visible and locked: Edelgard, Lysithea, and Mercedes must match the listed selected.png assets, not generic students or shoulder silhouettes.

Motion Risks:
- Student reaction can become too static; keep eyelines tied to SH001 sword flourish.
- Current generated SH002 frames are blocked if any visible student fails to match Edelgard/Lysithea/Mercedes academy selected assets.
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- BylethFemale identity drift; avoid smile
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student
- Edelgard, Lysithea, or Mercedes becomes a generic house-color student, wrong costume, wrong hair/face, or is replaced by another student
- SH002 repeats the full SH001 question instead of functioning as student reaction
