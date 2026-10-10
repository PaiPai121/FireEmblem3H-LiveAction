# Frame Spec: SH014

Shot ID: SH014
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Triangle support proof
Shot Purpose: 解释为什么三角形里每个方向都有至少一单位长的截线，并把面积计算降为附带。
Duration Target: 11 seconds
Location: Parchment insert
Characters Visible: Diagram only

Character Identity Locks:
- No named character must be generated unless specified; offscreen voices and shoulder silhouettes are allowed only when they do not distract from proof graphics.

Asset References:
- Diagram or prop shot; no character asset required.

Start Frame Intent:
等边三角形和高度 1 保持，底边空白。

Key Frame Intent:
底边标出 s = 2/sqrt(3)，面积公式简化。

End Frame Intent:
A = 1/sqrt(3) 高亮，三角形缩到一侧。

Camera:
羊皮纸近景，公式分步出现。

Blocking:
三组支撑边轮流高亮，最短危险方向沿高线时标出长度 1；旁边小号显示 s = 2/sqrt(3), A = 1/sqrt(3)。

Screen Direction:
公式从上到下逐行显现。

Mathematical Graphic Locks:
- Convex triangle is only the convex-restricted optimum; equilateral triangle height is 1, side length is 2/sqrt(3), area is 1/sqrt(3).

Action Peak:
A = 1/sqrt(3) 高亮的瞬间。

Dialogue / Audio Anchor:
女贝老师: 红剑在三组支撑边之间连续滑动。最危险的位置是沿高，长度正好是一；其余方向能截到更长线段。凸世界的下界是定理。

Edit In:
从三角高线标尺切入公式。

Edit Out:
切到凸包填满空隙的对比图。

Continuity Requirements:
- Previous shot: SH013 (Triangle can turn).
- Next shot: SH015 (Why convex is expensive).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Formula crowding
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Formula crowding
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- the equilateral triangle is implied to solve the unrestricted non-convex problem
