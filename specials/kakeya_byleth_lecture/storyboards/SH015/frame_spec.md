# Frame Spec: SH015

Shot ID: SH015
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Why convex is expensive
Shot Purpose: 用凸性会填满空隙，自然引出去掉凸性后的碎片问题。
Duration Target: 10 seconds
Location: Diagram space
Characters Visible: Diagram only

Character Identity Locks:
- No named character must be generated unless specified; offscreen voices and shoulder silhouettes are allowed only when they do not distract from proof graphics.

Asset References:
- Diagram or prop shot; no character asset required.

Start Frame Intent:
左右两侧都有相同碎片，尚未包络。

Key Frame Intent:
左侧凸包边界闭合并填满空白，右侧碎片只轻微重叠。

End Frame Intent:
右侧碎片被放大，带入 Perron 三角形。

Camera:
左右分屏图解，左凸右非凸。

Blocking:
左侧碎片被凸包一圈包住变成大面积；右侧碎片保持分离，只占小面积；莉丝缇亚的画外问题指向右侧碎片。

Screen Direction:
左侧面积膨胀，右侧碎片向画面中心过渡。

Mathematical Graphic Locks:
- Convex triangle is only the convex-restricted optimum; equilateral triangle height is 1, side length is 2/sqrt(3), area is 1/sqrt(3).

Action Peak:
左侧空隙被凸包自动填满的瞬间。

Dialogue / Audio Anchor:
莉丝缇亚: 那如果去掉凸性，让区域碎开呢？ 女贝老师: 这正是反转的入口。但碎开之后，必须记账：每个方向还在不在。

Edit In:
从面积公式切到对比图。

Edit Out:
右侧碎片 morph 成大等腰三角形。

Continuity Requirements:
- Previous shot: SH014 (Triangle support proof).
- Next shot: SH016 (Perron setup).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Abstract split needs labels
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Abstract split needs labels
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- the equilateral triangle is implied to solve the unrestricted non-convex problem
