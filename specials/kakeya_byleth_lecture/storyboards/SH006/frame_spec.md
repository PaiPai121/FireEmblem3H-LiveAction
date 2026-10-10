# Frame Spec: SH006

Shot ID: SH006
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Deltoid reveal
Shot Purpose: 引入优美的三尖内摆线候选，但不把它误称为最终答案。
Duration Target: 8 seconds
Location: Classroom chalkboard
Characters Visible: Female Byleth; optional offscreen Lysithea only

Character Identity Locks:
- Use Female Byleth only when visible: assets/characters/protagonist/BylethFemale/professor/selected.png.
- Optional fullbody/weapon reference when the shot needs full posture or sword handling: assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png.
- Identity lock: 16-year-old female professor-era Byleth, calm young teacher and former mercenary protagonist, teal-blue medium hair with fringe and side locks, focused green eyes, canon academy Female Byleth outfit: black short capelet or shoulder mantle, high black collar, cropped black upper garment with visible midriff gap, gold crest/star chest ornament, silver forearm armor, black shorts or skirt panels over patterned black tights, asymmetric knee guard, tall black boots, belts and weapon harness details; not a generic long black coat.
- Reject male Byleth, mature adult mentor, old wizard, generic black-robed sorceress, ordinary student uniform, modern teacher costume, revealing outfit, cosplay plastic look, oversized invented pendant.

Asset References:
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png

Start Frame Intent:
绿色方向扇面淡出，黑板中心留下一个圆滚动轨迹提示。

Key Frame Intent:
三尖 deltoid 的三处尖点清楚出现，内部轻轻填色。

End Frame Intent:
女贝老师停笔，曲线旁只标“候选区域”，不写最终答案。

Camera:
锁定黑板中景，女贝老师半身在侧。

Blocking:
她用粉笔画出三尖曲线，内部淡蓝填色随曲线闭合。

Screen Direction:
曲线按顺时针生成，三尖均匀分布。

Mathematical Graphic Locks:
- Deltoid must be a true three-cusped hypocycloid-style region; show unit chord scale with a = 1/4 and area A = pi/8; never use radius 1/3 as the unit-needle scale.

Action Peak:
第三个尖点闭合成完整 deltoid 的瞬间。

Dialogue / Audio Anchor:
莉丝缇亚: 也就是说，要找一条刚好卡住它的边界？

Edit In:
由 SH005 的方向扇面变形为曲线。

Edit Out:
推入 deltoid 内部的切线弦。

Continuity Requirements:
- Previous shot: SH005 (Direction coverage).
- Next shot: SH007 (Tangent chord mechanism).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Deltoid shape must be recognizable
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Deltoid shape must be recognizable
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student
- deltoid, unit chord, a = 1/4, or A = pi/8 are missing or scaled incorrectly
