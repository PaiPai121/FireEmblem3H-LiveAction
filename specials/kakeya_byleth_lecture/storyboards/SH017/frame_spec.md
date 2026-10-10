# Frame Spec: SH017

Shot ID: SH017
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Cut step
Shot Purpose: 显示 Perron 操作第一步：切分只分配方向，不删除方向。
Duration Target: 8 seconds
Location: Sand-table diagram
Characters Visible: Diagram only

Character Identity Locks:
- No named character must be generated unless specified; offscreen voices and shoulder silhouettes are allowed only when they do not distract from proof graphics.

Asset References:
- Diagram or prop shot; no character asset required.

Start Frame Intent:
完整大三角形和绿色方向扇保持。

Key Frame Intent:
底边切成多个小区间，细三角形轮廓同时出现。

End Frame Intent:
小三角形略分离，每个区间仍有绿色方向线。

Camera:
正上方，轻微放大底边。

Blocking:
底边被等分，小三角形沿切线略微分开，但每个仍从顶点指向自己的底边区间。

Screen Direction:
底边从左到右被切分，顶点不移动。

Mathematical Graphic Locks:
- Perron tree proof must keep direction coverage visible: cut assigns direction intervals, slide translates without rotation, overlap shrinks union area without deleting directions.

Action Peak:
所有小区间都有对应绿色线的瞬间。

Dialogue / Audio Anchor:
女贝老师: 第一步，切分。每块只负责一小段方向。

Edit In:
从 SH016 底边准备切分处接入。

Edit Out:
切到小三角形水平滑动。

Continuity Requirements:
- Previous shot: SH016 (Perron setup).
- Next shot: SH018 (Slide step).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Cut may look like deleting directions
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Cut may look like deleting directions
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Perron cut, slide, overlap, or direction-preservation logic is visually broken
