# Frame Spec: SH012

Shot ID: SH012
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Convex definition
Shot Purpose: 用两点连线解释凸性，降低门槛。
Duration Target: 7 seconds
Location: Diagram board
Characters Visible: Diagram only; Byleth pointer optional

Character Identity Locks:
- Use Female Byleth only when visible: assets/characters/protagonist/BylethFemale/professor/selected.png.
- Optional fullbody/weapon reference when the shot needs full posture or sword handling: assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png.
- Identity lock: 16-year-old female professor-era Byleth, calm young teacher and former mercenary protagonist, teal-blue medium hair with fringe and side locks, focused green eyes, canon academy Female Byleth outfit: black short capelet or shoulder mantle, high black collar, cropped black upper garment with visible midriff gap, gold crest/star chest ornament, silver forearm armor, black shorts or skirt panels over patterned black tights, asymmetric knee guard, tall black boots, belts and weapon harness details; not a generic long black coat.
- Reject male Byleth, mature adult mentor, old wizard, generic black-robed sorceress, ordinary student uniform, modern teacher costume, revealing outfit, cosplay plastic look, oversized invented pendant.

Asset References:
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png

Start Frame Intent:
左右两个区域各有两点，连线尚未出现。

Key Frame Intent:
连线出现：左侧全绿，右侧穿出区域部分变红。

End Frame Intent:
左图打勾，右图被轻划，观众知道限制含义。

Camera:
干净二分图近景，板书符号极少。

Blocking:
左侧连线全在区域内，右侧连线穿出凹口，女贝老师用粉笔点亮差别。

Screen Direction:
读图从左到右，绿色通过、红色失败。

Mathematical Graphic Locks:
- Convex triangle is only the convex-restricted optimum; equilateral triangle height is 1, side length is 2/sqrt(3), area is 1/sqrt(3).

Action Peak:
右侧连线穿出凹口的红段亮起。

Dialogue / Audio Anchor:
女贝老师: 凸，就是两点之间的路不离开区域。

Edit In:
从绳索凹口消失切入。

Edit Out:
左侧凸形变形为等边三角形。

Continuity Requirements:
- Previous shot: SH011 (Constraint switch).
- Next shot: SH013 (Triangle can turn).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Too elementary but necessary
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Too elementary but necessary
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student
- the equilateral triangle is implied to solve the unrestricted non-convex problem
