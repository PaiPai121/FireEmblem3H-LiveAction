# Frame Spec: SH009

Shot ID: SH009
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Area of deltoid
Shot Purpose: 用参数曲线面积公式给出候选面积 pi/8，并保留它只是候选的语气。
Duration Target: 11 seconds
Location: Chalkboard/parchment hybrid
Characters Visible: Female Byleth hand optional

Character Identity Locks:
- Use Female Byleth only when visible: assets/characters/protagonist/BylethFemale/professor/selected.png.
- Optional fullbody/weapon reference when the shot needs full posture or sword handling: assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png.
- Identity lock: 16-year-old female professor-era Byleth, calm young teacher and former mercenary protagonist, teal-blue medium hair with fringe and side locks, focused green eyes, canon academy Female Byleth outfit: black short capelet or shoulder mantle, high black collar, cropped black upper garment with visible midriff gap, gold crest/star chest ornament, silver forearm armor, black shorts or skirt panels over patterned black tights, asymmetric knee guard, tall black boots, belts and weapon harness details; not a generic long black coat.
- Reject male Byleth, mature adult mentor, old wizard, generic black-robed sorceress, ordinary student uniform, modern teacher costume, revealing outfit, cosplay plastic look, oversized invented pendant.

Asset References:
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png

Start Frame Intent:
deltoid 空心轮廓和单位红弦仍在画面中。

Key Frame Intent:
金色面积洗过整个区域，公式 A = pi/8 随填色落定。

End Frame Intent:
公式旁出现“候选”小印章式粉笔标记。

Camera:
黑板慢推近，公式在曲线旁浮现。

Blocking:
金色填色从中心铺满 deltoid，先出现 A = 2 pi a^2，再代入 a = 1/4 得到 A = pi/8。

Screen Direction:
填色从左下向右上扩散，不遮住红弦。

Mathematical Graphic Locks:
- Deltoid must be a true three-cusped hypocycloid-style region; show unit chord scale with a = 1/4 and area A = pi/8; never use radius 1/3 as the unit-needle scale.

Action Peak:
面积刚好填满而红弦仍清楚的一刻。

Dialogue / Audio Anchor:
女贝老师: 面积公式给 A 等于二 pi a 平方。代入 a 等于四分之一，得到 pi 除以八。它还只是候选。

Edit In:
从 SH008 的 a=1/4 公式下切。

Edit Out:
切到学生反应质疑。

Continuity Requirements:
- Previous shot: SH008 (Scale lock).
- Next shot: SH010 (Candidate doubt).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Avoid saying it is answer
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Avoid saying it is answer
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student
- deltoid, unit chord, a = 1/4, or A = pi/8 are missing or scaled incorrectly
