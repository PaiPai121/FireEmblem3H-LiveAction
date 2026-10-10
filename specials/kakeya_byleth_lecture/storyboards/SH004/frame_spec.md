# Frame Spec: SH004

Shot ID: SH004
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Rule refinement
Shot Purpose: 把固定中心旋转和中心可移动的真正问题分开。
Duration Target: 7 seconds
Location: Garreg Mach classroom chalkboard
Characters Visible: Female Byleth hand and profile

Character Identity Locks:
- Use Female Byleth only when visible: assets/characters/protagonist/BylethFemale/professor/selected.png.
- Optional fullbody/weapon reference when the shot needs full posture or sword handling: assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png.
- Identity lock: 16-year-old female professor-era Byleth, calm young teacher and former mercenary protagonist, teal-blue medium hair with fringe and side locks, focused green eyes, canon academy Female Byleth outfit: black short capelet or shoulder mantle, high black collar, cropped black upper garment with visible midriff gap, gold crest/star chest ornament, silver forearm armor, black shorts or skirt panels over patterned black tights, asymmetric knee guard, tall black boots, belts and weapon harness details; not a generic long black coat.
- Reject male Byleth, mature adult mentor, old wizard, generic black-robed sorceress, ordinary student uniform, modern teacher costume, revealing outfit, cosplay plastic look, oversized invented pendant.

Asset References:
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png

Start Frame Intent:
黑板上并排两个简单图标：一个钉住中心，一个自由滑动中心。

Key Frame Intent:
女贝老师用粉笔划掉钉住中心图标，圈住自由滑动中心。

End Frame Intent:
黑板只留下完整线段和可移动中心箭头，规则变清楚。

Camera:
侧面近景，手、粉笔线和半张脸构成教学画面。

Blocking:
她划掉固定中心符号，圈出中心可移动符号，木剑图仍保持完整。

Screen Direction:
粉笔从左边错误规则移动到右边正确规则。

Mathematical Graphic Locks:
- Unit segment must be visibly length 1 with two endpoints; the condition is all directions, not a fixed center unless shown as a rejected intuition.

Action Peak:
固定中心符号被划掉的一刻。

Dialogue / Audio Anchor:
女贝老师: 中心不必固定。只要整根剑始终在区域内。

Edit In:
圆盘直觉画面硬切到粉笔板。

Edit Out:
顺着粉笔箭头切到多方向线段扇面。

Continuity Requirements:
- Previous shot: SH003 (Naive circular intuition).
- Next shot: SH005 (Direction coverage).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Text too readable/modern; use simple symbols
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Text too readable/modern; use simple symbols
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student
- the unit segment loses visible endpoints or becomes a decorative sword without length meaning
