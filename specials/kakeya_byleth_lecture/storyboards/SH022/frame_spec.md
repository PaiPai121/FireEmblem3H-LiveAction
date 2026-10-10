# Frame Spec: SH022

Shot ID: SH022
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Iteration acceleration
Shot Purpose: 展示重复 cut-slide-overlap 使面积任意小，并用 epsilon 目标表达定量收缩。
Duration Target: 12 seconds
Location: Diagram-to-abstract transition
Characters Visible: Diagram only

Character Identity Locks:
- No named character must be generated unless specified; offscreen voices and shoulder silhouettes are allowed only when they do not distract from proof graphics.

Asset References:
- Diagram or prop shot; no character asset required.

Start Frame Intent:
第一轮重叠碎片和完整方向尺。

Key Frame Intent:
第二、第三轮迭代同时显示面积数字递减，不显示复杂公式。

End Frame Intent:
极细碎片形成树状轮廓，面积读数接近 epsilon。

Camera:
正上方转抽象图解，三步循环节奏固定。

Blocking:
切分、平移、重叠重复三次；金色并集面积每轮缩小，绿色方向尺始终完整；右侧出现目标线 epsilon。

Screen Direction:
每一轮从左到右：切分、平移、重叠；方向尺固定在底部。

Mathematical Graphic Locks:
- Perron tree proof must keep direction coverage visible: cut assigns direction intervals, slide translates without rotation, overlap shrinks union area without deleting directions.

Action Peak:
第三轮后金色并集明显小于初始但绿色方向尺仍满格。

Dialogue / Audio Anchor:
女贝老师: 方向尺没有缺口，金色并集面积却按指定比例下降。给定任何 epsilon，多迭代几轮就能压到 epsilon 以下。

Edit In:
从方向审计色带生长出第一层树。

Edit Out:
树状碎片淡入教室黑板总结。

Continuity Requirements:
- Previous shot: SH021 (Direction audit).
- Next shot: SH023 (Classical conclusion).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Too fast to understand
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Too fast to understand
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Perron cut, slide, overlap, or direction-preservation logic is visually broken
