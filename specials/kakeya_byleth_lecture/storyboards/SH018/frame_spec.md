# Frame Spec: SH018

Shot ID: SH018
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Slide step
Shot Purpose: 显示平移不改变方向，是证明可复用空间的关键。
Duration Target: 8 seconds
Location: Sand-table diagram
Characters Visible: Diagram only

Character Identity Locks:
- No named character must be generated unless specified; offscreen voices and shoulder silhouettes are allowed only when they do not distract from proof graphics.

Asset References:
- Diagram or prop shot; no character asset required.

Start Frame Intent:
被切开的小三角形分散在原位置。

Key Frame Intent:
小三角形沿水平方向滑向中心，透明轨迹显示没有旋转。

End Frame Intent:
碎片接近重叠状态，绿色线方向与开始完全平行。

Camera:
正上方，运动轨迹线清楚。

Blocking:
每个薄三角形只水平平移，绿色方向带保持平行，绝不旋转。

Screen Direction:
左侧碎片向右滑，右侧碎片向左滑，顶点高度不交换。

Mathematical Graphic Locks:
- Perron tree proof must keep direction coverage visible: cut assigns direction intervals, slide translates without rotation, overlap shrinks union area without deleting directions.

Action Peak:
平移轨迹与绿色方向线同时可见的一刻。

Dialogue / Audio Anchor:
女贝老师: 第二步，平移。平移不会改变方向，只改变这段线放在哪里。

Edit In:
从切分后的细三角形接入。

Edit Out:
切到重叠后的并集面积。

Continuity Requirements:
- Previous shot: SH017 (Cut step).
- Next shot: SH019 (Overlap step).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- AI may rotate pieces accidentally
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- AI may rotate pieces accidentally
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Perron cut, slide, overlap, or direction-preservation logic is visually broken
