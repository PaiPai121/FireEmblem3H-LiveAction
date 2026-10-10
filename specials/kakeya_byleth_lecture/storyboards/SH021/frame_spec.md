# Frame Spec: SH021

Shot ID: SH021
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Direction audit
Shot Purpose: 作为证明检查点：切分和平移保留方向覆盖。
Duration Target: 8 seconds
Location: Clean diagram space
Characters Visible: Diagram only

Character Identity Locks:
- No named character must be generated unless specified; offscreen voices and shoulder silhouettes are allowed only when they do not distract from proof graphics.

Asset References:
- Diagram or prop shot; no character asset required.

Start Frame Intent:
上方是一整条绿色方向区间，下方为空。

Key Frame Intent:
下方分段绿色区间出现，和上方一一对齐，没有缺口。

End Frame Intent:
两条方向尺同时高亮，标记“方向仍全在”。

Camera:
纯图解静态，便于暂停学习。

Blocking:
上方显示切分前的连续绿色方向区间，下方显示滑动后的多个绿色区间拼接成同一覆盖。

Screen Direction:
上下对照，不改变左右方向顺序。

Mathematical Graphic Locks:
- Perron tree proof must keep direction coverage visible: cut assigns direction intervals, slide translates without rotation, overlap shrinks union area without deleting directions.

Action Peak:
下方最后一个绿色缺口被补齐的一刻。

Dialogue / Audio Anchor:
女贝老师: 切分没有删方向。平移没有转方向。

Edit In:
从木尺指向方向带接入。

Edit Out:
色带分段变成迭代树的第一层。

Continuity Requirements:
- Previous shot: SH020 (Student objection).
- Next shot: SH022 (Iteration acceleration).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- This is the proof checkpoint
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- This is the proof checkpoint
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Perron cut, slide, overlap, or direction-preservation logic is visually broken
