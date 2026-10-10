# Frame Spec: SH020

Shot ID: SH020
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Student objection
Shot Purpose: 让观众的疑问被角色说出：移动碎片是否仍算同一个问题。
Duration Target: 10 seconds
Location: Classroom sand table
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
沙盘上的重叠碎片可见，艾黛尔、莉丝缇亚、梅尔赛德斯靠近桌沿且身份可辨。

Key Frame Intent:
女贝老师木尺从碎片位置移到绿色方向带，回答问题。

End Frame Intent:
镜头停在绿色方向带上，准备进入方向审计图。

Camera:
中景过肩，沙盘仍在画面下半部。

Blocking:
艾黛尔指向分离碎片，莉丝缇亚盯住绿色方向带，梅尔赛德斯听讲；女贝老师用木尺指向绿色方向带而非原三角形位置。

Screen Direction:
学生手从左入画，女贝老师木尺从右指向中心；三位学生站位保持艾黛尔、莉丝缇亚、梅尔赛德斯顺序稳定。

Mathematical Graphic Locks:
- Perron tree proof must keep direction coverage visible: cut assigns direction intervals, slide translates without rotation, overlap shrinks union area without deleting directions.

Action Peak:
木尺离开面积轮廓、指向方向带的一刻。

Dialogue / Audio Anchor:
艾黛尔: 但这样还是同一个问题吗？ 女贝老师: 看方向，不看原来的位置。连续转动之后用很窄的走廊接起来。

Edit In:
从 SH019 重叠图拉出到人物。

Edit Out:
沿木尺指向切到纯方向审计。

Continuity Requirements:
- Previous shot: SH019 (Overlap step).
- Next shot: SH021 (Direction audit).
- Preserve screen direction and visual subject handoff stated above.
- Student roster is visible and locked: Edelgard, Lysithea, and Mercedes must match the listed selected.png assets, not generic students or shoulder silhouettes.

Motion Risks:
- Dialogue too long
- Current generated SH020 frames are blocked if any visible student fails to match Edelgard/Lysithea/Mercedes academy selected assets.
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Dialogue too long
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student
- Edelgard, Lysithea, or Mercedes becomes a generic house-color student, wrong costume, wrong hair/face, or is replaced by another student
- Perron cut, slide, overlap, or direction-preservation logic is visually broken
