# Frame Spec: SH010

Shot ID: SH010
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Candidate doubt
Shot Purpose: 让艾黛尔指出真正缺口：还没有证明三尖内摆线不能再小。
Duration Target: 9 seconds
Location: Classroom
Characters Visible: Female Byleth; Edelgard academy

Character Identity Locks:
- Use Female Byleth only when visible: assets/characters/protagonist/BylethFemale/professor/selected.png.
- Optional fullbody/weapon reference when the shot needs full posture or sword handling: assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png.
- Use Edelgard academy only when visible: assets/characters/black_eagles/Edelgard/academy/selected.png.
- Edelgard identity lock: academy-era Edelgard only, pale blonde hair, black-and-red academy uniform with red leggings and red cape, sharp controlled expression; no generic noblewoman, no war emperor armor, no random red-cloak student.
- Identity lock: 16-year-old female professor-era Byleth, calm young teacher and former mercenary protagonist, teal-blue medium hair with fringe and side locks, focused green eyes, canon academy Female Byleth outfit: black short capelet or shoulder mantle, high black collar, cropped black upper garment with visible midriff gap, gold crest/star chest ornament, silver forearm armor, black shorts or skirt panels over patterned black tights, asymmetric knee guard, tall black boots, belts and weapon harness details; not a generic long black coat.
- Reject male Byleth, mature adult mentor, old wizard, generic black-robed sorceress, ordinary student uniform, modern teacher costume, revealing outfit, cosplay plastic look, oversized invented pendant.

Asset References:
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png
- assets/characters/black_eagles/Edelgard/academy/selected.png

Start Frame Intent:
deltoid 公式仍在黑板，前景出现可辨认的艾黛尔 academy 形象。

Key Frame Intent:
质疑声响起时女贝老师微微停笔，表情不变。

End Frame Intent:
她转向另一块空板，准备改加凸性条件。

Camera:
交替近景，先艾黛尔可辨认发问，再切女贝老师静止表情。

Blocking:
艾黛尔前倾，手指向 deltoid 外侧剩余空间；女贝老师没有立即回答，黑板保留 A = pi/8 和“候选”。

Screen Direction:
艾黛尔在左前景，女贝老师转向右侧空板。

Mathematical Graphic Locks:
- Deltoid must be a true three-cusped hypocycloid-style region; show unit chord scale with a = 1/4 and area A = pi/8; never use radius 1/3 as the unit-needle scale.

Action Peak:
女贝老师没有反驳、只停顿的瞬间。

Dialogue / Audio Anchor:
艾黛尔: 优雅，不等于最小。我还没听到：为什么不能再小？如果边界允许凹进去，空隙也许还能被重复利用。

Edit In:
从 SH009 的“候选”标记切入。

Edit Out:
随她转身切到地面绳边界。

Continuity Requirements:
- Previous shot: SH009 (Area of deltoid).
- Next shot: SH011 (Constraint switch).
- Preserve screen direction and visual subject handoff stated above.
- Edelgard is visible and locked to assets/characters/black_eagles/Edelgard/academy/selected.png; do not replace her with a generic red-cloak student.

Motion Risks:
- Current generated SH010 frames are blocked if visible Edelgard does not match the academy selected asset.
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- visible Edelgard does not match assets/characters/black_eagles/Edelgard/academy/selected.png
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student
- deltoid, unit chord, a = 1/4, or A = pi/8 are missing or scaled incorrectly
