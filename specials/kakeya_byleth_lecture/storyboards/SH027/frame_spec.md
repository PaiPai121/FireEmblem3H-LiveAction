# Frame Spec: SH027

Shot ID: SH027
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Key estimate
Shot Purpose: 从图形交叠推导 δ-管估计，连接方向差和重叠面积。
Duration Target: 11 seconds
Location: Diagram board
Characters Visible: Diagram only

Character Identity Locks:
- No named character must be generated unless specified; offscreen voices and shoulder silhouettes are allowed only when they do not distract from proof graphics.

Asset References:
- Diagram or prop shot; no character asset required.

Start Frame Intent:
两根管和金色重叠区保留，delta 与 alpha 已标出。

Key Frame Intent:
估计式出现时，delta、alpha、金色 overlap 依次闪亮对应。

End Frame Intent:
公式缩到角落，重叠图保留作后续影响桥。

Camera:
静态干净图形，公式不遮盖重叠区。

Blocking:
先标出 overlap length ~ delta / sin alpha，再乘宽度 delta 得到 area ~ delta^2 / sin alpha，最后变成 overlap <= C delta^2 / alpha。

Screen Direction:
公式从重叠图右侧出现，不覆盖图形。

Mathematical Graphic Locks:
- Zero area is not nonexistence; delta-tube diagrams must show delta width, alpha angle, gold overlap patch, and dimension equals 2 in the final 2D statement.

Action Peak:
公式与三个图形元素全部同步高亮的一刻。

Dialogue / Audio Anchor:
女贝老师: 沿管方向交叠长度约是 delta 除以 sin alpha，乘上宽度 delta，就得到重叠面积估计。

Edit In:
从 SH026 金色重叠区直接接公式。

Edit Out:
重叠图像素化成小网格。

Continuity Requirements:
- Previous shot: SH026 (Tube overlap by angle).
- Next shot: SH028 (Dimension idea).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Use C instead of hard symbol if needed
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Use C instead of hard symbol if needed
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- delta, alpha, overlap, zero-area caution, or dimension = 2 claim is invisible or wrong
