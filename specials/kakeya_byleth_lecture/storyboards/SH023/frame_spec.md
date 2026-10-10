# Frame Spec: SH023

Shot ID: SH023
Stage: prompt_asset_package
Status: real_frames_generated_review_required
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: Classical conclusion
Shot Purpose: 给出二维原始面积问题的颠覆结论：没有最小正面积，并提醒小面积走廊补连续转动。
Duration Target: 12 seconds
Location: Garreg Mach classroom
Characters Visible: Female Byleth

Character Identity Locks:
- Use Female Byleth only when visible: assets/characters/protagonist/BylethFemale/professor/selected.png.
- Optional fullbody/weapon reference when the shot needs full posture or sword handling: assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png.
- Identity lock: 16-year-old female professor-era Byleth, calm young teacher and former mercenary protagonist, teal-blue medium hair with fringe and side locks, focused green eyes, canon academy Female Byleth outfit: black short capelet or shoulder mantle, high black collar, cropped black upper garment with visible midriff gap, gold crest/star chest ornament, silver forearm armor, black shorts or skirt panels over patterned black tights, asymmetric knee guard, tall black boots, belts and weapon harness details; not a generic long black coat.
- Reject male Byleth, mature adult mentor, old wizard, generic black-robed sorceress, ordinary student uniform, modern teacher costume, revealing outfit, cosplay plastic look, oversized invented pendant.

Asset References:
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png

Start Frame Intent:
黑板上同时有 deltoid、凸三角形、Perron 树三个小图。

Key Frame Intent:
前两个图淡下去，Perron 树放大，女贝老师说出没有最小正答案。

End Frame Intent:
黑板只剩“不存在最小正面积”的粉笔结论。

Camera:
缓慢推近中景，人物与结论同框。

Blocking:
deltoid 和三角形淡出，Perron 树保持；女贝老师侧身让出结论；极细连接走廊淡出显示面积可忽略。

Screen Direction:
女贝老师站画面左，结论在画面右，避免遮挡。

Mathematical Graphic Locks:
- Perron tree proof must keep direction coverage visible: cut assigns direction intervals, slide translates without rotation, overlap shrinks union area without deleting directions.

Action Peak:
Perron 树独自留下的瞬间。

Dialogue / Audio Anchor:
女贝老师: 所以，原来的最小面积问题，没有最小正答案。小到任意正数以下，不是等于不存在。

Edit In:
从 SH022 树状碎片匹配切到黑板。

Edit Out:
结论里的“面积”二字切到零面积提示。

Continuity Requirements:
- Previous shot: SH022 (Iteration acceleration).
- Next shot: SH024 (Zero area caution).
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- Needs exact wording
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
- Needs exact wording
- start/key/end frames do not form the stated action chain
- camera motion hides the action peak or reverses the declared screen direction
- Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student
- Perron cut, slide, overlap, or direction-preservation logic is visually broken
