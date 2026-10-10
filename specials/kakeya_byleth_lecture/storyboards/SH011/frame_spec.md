# Frame Spec: SH011

Shot ID: SH011
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Constraint switch
Shot Purpose: 把凸区域作为一般非凸问题前的规整特例，而不是突兀加规则。
Duration Target: 9 seconds
Location: Training ground floor
Characters Visible: Female Byleth hands only

Character Identity Locks:
- Use Female Byleth only when visible: assets/characters/protagonist/BylethFemale/professor/selected.png.
- Optional fullbody/weapon reference when the shot needs full posture or sword handling: assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png.
- Identity lock: 16-year-old female professor-era Byleth, calm young teacher and former mercenary protagonist, teal-blue medium hair with fringe and side locks, focused green eyes, canon academy Female Byleth outfit: black short capelet or shoulder mantle, high black collar, cropped black upper garment with visible midriff gap, gold crest/star chest ornament, silver forearm armor, black shorts or skirt panels over patterned black tights, asymmetric knee guard, tall black boots, belts and weapon harness details; not a generic long black coat.
- Reject male Byleth, mature adult mentor, old wizard, generic black-robed sorceress, ordinary student uniform, modern teacher costume, revealing outfit, cosplay plastic look, oversized invented pendant.

Asset References:
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png

Start Frame Intent:
绳索围成带凹口的区域，红剑能穿过凹口附近。

Key Frame Intent:
绳索被拉紧，凹口消失，区域变成无凹陷包络。

End Frame Intent:
地面显出一个等边三角形轮廓作为下一步。

Camera:
正上方，绳索和粉笔线构成清楚图形。

Blocking:
女贝老师拉动绳子，把有凹口的边界拉成平顺包络；黑板角落出现“先看凸区域 / 再回一般情况”。

Screen Direction:
绳索从画面左侧凹陷向外被拉平。

Mathematical Graphic Locks:
- Convex triangle is only the convex-restricted optimum; equilateral triangle height is 1, side length is 2/sqrt(3), area is 1/sqrt(3).

Action Peak:
凹口刚被绳索拉平的瞬间。

Dialogue / Audio Anchor:
女贝老师: 一般情况太滑，我们先看一个比较规整的特例。加一条规则：区域不能凹进去。

Edit In:
从女贝老师转身接到地面操作。

Edit Out:
切到两点连线的凸性定义图。

Continuity Requirements:
- Previous shot: SH010 (Candidate doubt).
- Next shot: SH012 (Convex definition).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Convex concept unclear
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Convex concept unclear
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student
- the equilateral triangle is implied to solve the unrestricted non-convex problem
