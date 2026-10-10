# Frame Spec: SH008

Shot ID: SH008
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Scale lock
Shot Purpose: 把 deltoid 参数和单位剑长度锁上，并说明弦长为什么是 4a。
Duration Target: 10 seconds
Location: Parchment insert
Characters Visible: Diagram only

Character Identity Locks:
- No named character must be generated unless specified; offscreen voices and shoulder silhouettes are allowed only when they do not distract from proof graphics.

Asset References:
- Diagram or prop shot; no character asset required.

Start Frame Intent:
红弦旁只有长度刻度和参数 a，画面留白充足。

Key Frame Intent:
四段 a 标尺依次亮起，同时出现 4a = 1。

End Frame Intent:
公式化简为 a = 1/4，单位弦高亮。

Camera:
羊皮纸插图静态近景，轻微推近。

Blocking:
红弦旁出现四段等长刻度 a+a+a+a，公式 chord = 4a，再把 4a = 1 化为 a = 1/4。

Screen Direction:
公式从左到右显现，弦不改变长度。

Mathematical Graphic Locks:
- Deltoid must be a true three-cusped hypocycloid-style region; show unit chord scale with a = 1/4 and area A = pi/8; never use radius 1/3 as the unit-needle scale.

Action Peak:
a = 1/4 出现并与红弦端点对齐的瞬间。

Dialogue / Audio Anchor:
女贝老师: 每条可用切线弦分成四段 a，所以弦长是四 a。剑长为一，就取 a 等于四分之一。

Edit In:
从旋转红弦切到同一红弦的测量视角。

Edit Out:
金色面积填充接上面积计算。

Continuity Requirements:
- Previous shot: SH007 (Tangent chord mechanism).
- Next shot: SH009 (Area of deltoid).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Formula without explanation
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Formula without explanation
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- deltoid, unit chord, a = 1/4, or A = pi/8 are missing or scaled incorrectly
