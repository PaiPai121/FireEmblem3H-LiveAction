# Shot003 Frame Spec

Shot ID: Shot003
Stage: storyboard
Status: monitor_required
Script Beat: 任务召集
Shot Purpose: 让任务召集成为一次具有权力转移的教会命令，而不是人物对着镜头站定说明。
Location: cathedral
Characters Visible: Rhea, Seteth, Byleth, Dimitri

## Character Identity Locks

- assets/characters/church_of_seiros/Rhea/academy/selected.png
- assets/characters/church_of_seiros/Seteth/academy/selected.png
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/blue_lions/Dimitri/academy/selected.png
- Female Byleth only: assets/characters/protagonist/BylethFemale/professor/selected.png; no male or war-phase Byleth.

## Asset References

- assets/characters/church_of_seiros/Rhea/academy/selected.png
- assets/characters/church_of_seiros/Seteth/academy/selected.png
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/blue_lions/Dimitri/academy/selected.png
- assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png
- assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png

Presence Lock: Rhea, Seteth, Byleth, Dimitri only, with background figures indistinct unless explicitly stated in the prompt.

Start Frame Intent: 议事门打开后的湿冷大教堂中，女贝老师和 Dimitri 从下方进入，Rhea 在祭坛台阶上，成熟学院篇 Seteth 站在她侧后方并持有报告册；权力高差先成立。

Key Frame Intent: Seteth 合上报告册并向 Rhea 迈步，把报告册递到她伸出的手里；Rhea 接过报告册，女贝老师和 Dimitri 在下方以目光反应，而不是排成一列。

End Frame Intent: Rhea 背向众人转向祭坛，Seteth 带着合上的报告册横向下阶；女贝老师保持左侧面，Dimitri 转向画外的 Ashe，中央通道被留空。

Camera: 从下方入场的中广角缓慢推向祭坛，随后在报告交接处做轻微横移，结尾停在 Rhea 转身和 Seteth 下阶的权力错位。
Blocking: START 学生低位进入、Rhea/Seteth 高位；KEY Seteth 两步交报告、Rhea 抬手接收；END Rhea 转身、Seteth 下阶、学生留在低位并分开反应。
Action Peak: 报告册从 Seteth 手中移交到 Rhea 手中，随后 Rhea 以转身确认命令已成制度性决定。
Dialogue / Audio Anchor: Rhea, in Japanese: 西方教会が、ガスパール領主ロナートを扇動し、兵を挙げさせました。

Continuity Requirements: START, KEY, and END must be visibly different action states with shared geography, identity, wardrobe, lighting direction, and contact shadows. The generated people must be integrated into the live-action scene, not pasted cutouts.

Reject If:
- the frame is a game screenshot, UI, subtitle, caption, or readable text
- a named identity drifts, Byleth becomes male, or academy phase becomes war phase
- the action peak is missing and the triptych is only a lighting, crop, or texture variation
- a person floats, loses floor contact, or detaches from the scene perspective
- the shot becomes a static symmetrical lineup or a repeated conversation tableau
- the exact reject conditions in the prompt are violated

Planned Frames:
- start_frame.png: storyboards/Shot003/critical_reaudit_regen_v2_2026-08-21/start_frame.png
- key_frame.png: storyboards/Shot003/critical_reaudit_regen_v2_2026-08-21/key_frame.png
- end_frame.png: storyboards/Shot003/critical_reaudit_regen_v2_2026-08-21/end_frame.png
- contact_sheet.jpg: storyboards/Shot003/critical_reaudit_regen_v2_2026-08-21/contact_sheet.jpg

Critical Re-audit Repair Pass — 2026-08-21

2026-08-21 critical re-audit v2 replaces the previous council lineup. Seteth now performs a readable folio handoff, Rhea receives it, and the end frame turns the authority away from the students.

Keep monitor_required until the Japanese/silent audio contract is checked against the uploaded frames and a 3-second motion probe confirms the action chain, identity locks, contact shadows, and moving tail. Reject if Seteth looks young or generic, if female Byleth becomes male, if the folio handoff is absent, if Rhea only changes expression, or if the four characters remain a static symmetrical tableau.