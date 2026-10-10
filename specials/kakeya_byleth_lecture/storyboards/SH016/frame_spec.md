# Frame Spec: SH016

Shot ID: SH016
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Perron setup
Shot Purpose: 把 Perron 树作为非凸碎片的方向账本引入：一个三角形保存一段连续方向。
Duration Target: 8 seconds
Location: Training ground sand table
Characters Visible: Female Byleth hands only; sand-table diagram

Character Identity Locks:
- Use Female Byleth only when visible: assets/characters/protagonist/BylethFemale/professor/selected.png.
- Optional fullbody/weapon reference when the shot needs full posture or sword handling: assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png.
- Identity lock: 16-year-old female professor-era Byleth, calm young teacher and former mercenary protagonist, teal-blue medium hair with fringe and side locks, focused green eyes, canon academy Female Byleth outfit: black short capelet or shoulder mantle, high black collar, cropped black upper garment with visible midriff gap, gold crest/star chest ornament, silver forearm armor, black shorts or skirt panels over patterned black tights, asymmetric knee guard, tall black boots, belts and weapon harness details; not a generic long black coat.
- Reject male Byleth, mature adult mentor, old wizard, generic black-robed sorceress, ordinary student uniform, modern teacher costume, revealing outfit, cosplay plastic look, oversized invented pendant.

Asset References:
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png

Start Frame Intent:
沙盘上空白，只见木尺和粉笔绳。

Key Frame Intent:
大等腰三角形完成后，绿色线从顶点扇向底边多个位置。

End Frame Intent:
方向扇稳定，底边准备被切分。

Camera:
正上方沙盘镜头，线条粗细可读。

Blocking:
女贝老师画顶点和底边，从顶点向底边画绿色方向线，形成连续方向扇；底边像方向账本一样标出连续区间。

Screen Direction:
顶点在画面上方，底边在下方；方向线自上向下展开。

Mathematical Graphic Locks:
- Perron tree proof must keep direction coverage visible: cut assigns direction intervals, slide translates without rotation, overlap shrinks union area without deleting directions.

Action Peak:
绿色方向扇刚覆盖整条底边的一刻。

Dialogue / Audio Anchor:
女贝老师: 这个方向账本，从一个三角形开始。从顶点到底边，每一条线都代表一个方向。

Edit In:
从非凸碎片对比图推入沙盘。

Edit Out:
底边刻度声接切分镜头。

Continuity Requirements:
- Previous shot: SH015 (Why convex is expensive).
- Next shot: SH017 (Cut step).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Direction meaning unclear unless green lines visible
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Direction meaning unclear unless green lines visible
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student
- Perron cut, slide, overlap, or direction-preservation logic is visually broken
