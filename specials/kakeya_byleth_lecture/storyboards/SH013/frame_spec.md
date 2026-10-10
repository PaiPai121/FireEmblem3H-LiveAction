# Frame Spec: SH013

Shot ID: SH013
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Triangle can turn
Shot Purpose: 先证明高为 1 的等边三角形确实能容纳所有方向，而不是只报面积。
Duration Target: 12 seconds
Location: Clean diagram board
Characters Visible: Diagram dominant

Character Identity Locks:
- No named character must be generated unless specified; offscreen voices and shoulder silhouettes are allowed only when they do not distract from proof graphics.

Asset References:
- Diagram or prop shot; no character asset required.

Start Frame Intent:
空白板上出现等边三角形轮廓。

Key Frame Intent:
竖直高线标 1，红剑与高线重合，三角形内出现几条方向残影。

End Frame Intent:
角落写“只在凸区域中”，锁定限定条件。

Camera:
粉笔与纸面混合图解，稳定中近景。

Blocking:
三角形竖直高线标 1，红剑从贴近一条边的方向滑到接近高线，再滑向另一组支撑边；方向盘覆盖 0 到 180 度。

Screen Direction:
高度标尺自下而上出现，方向残影围绕中心展开。

Mathematical Graphic Locks:
- Convex triangle is only the convex-restricted optimum; equilateral triangle height is 1, side length is 2/sqrt(3), area is 1/sqrt(3).

Action Peak:
红剑刚与高线 1 完全重合的一刻。

Dialogue / Audio Anchor:
女贝老师: 在凸区域里，最省的是高为一的等边三角形。先证明它真的能转。方向只看零到一百八十度就够了。

Edit In:
从凸性定义左图转为三角形。

Edit Out:
切到边长与面积公式。

Continuity Requirements:
- Previous shot: SH012 (Convex definition).
- Next shot: SH014 (Triangle support proof).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Must show continuous direction coverage, not just static area
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Must show continuous direction coverage, not just static area
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- the equilateral triangle is implied to solve the unrestricted non-convex problem
