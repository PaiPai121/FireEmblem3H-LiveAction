# Shot005 Frame Spec

Shot ID: Shot005
Stage: storyboard
Status: monitor_required
Script Beat: 同行请求
Shot Purpose: 用支援小剧场式的门口阻挡、请求、让路完成同伴关系变化。
Location: classroom
Characters Visible: Byleth, Dimitri, Ashe

## Character Identity Locks

- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/blue_lions/Dimitri/academy/selected.png
- assets/characters/blue_lions/Ashe/academy/selected.png
- Female Byleth only: assets/characters/protagonist/BylethFemale/professor/selected.png; no male or war-phase Byleth.

## Asset References

- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/blue_lions/Dimitri/academy/selected.png
- assets/characters/blue_lions/Ashe/academy/selected.png
- assets/locations/EP02/act01/OfficersAcademyClassroom/OfficersAcademyClassroom_reference.png
- episodes/EP03/source_refs/Shot005_source.png

Presence Lock: Byleth, Dimitri, Ashe only, with background figures indistinct unless explicitly stated in the prompt.

Start Frame Intent: 下课后的教室仍有书本和弓具，Ashe 坐在桌边，Dimitri 卡在敞开的门口，女贝老师在讲台侧；两个模糊学生走出远门，三人没有看镜头。

Key Frame Intent: Dimitri 关上门并把手留在门闩上，向女贝老师迈一步提出同行请求；Ashe 从桌边转身合书，女贝老师在两人之间听取请求。

End Frame Intent: Ashe 站起并抓住弓袋肩带，女贝老师点头让出通道；Dimitri 退到门侧，让 Ashe 先经过空门。

Camera: 从教室深处的三角站位开始，靠近门闩和 Dimitri 的一步，再向打开的门和 Ashe 的离开动作回拉。
Blocking: START Ashe 坐左、Dimitri 在门中、Byleth 在讲台侧；KEY Dimitri 关门迈步、Ashe 合书回身；END Ashe 起身取弓袋、Byleth 让路、Dimitri 退侧。
Action Peak: Dimitri 关门后向老师提出同行请求，Ashe 的起身把口头请求转成实际行动。
Dialogue / Audio Anchor: Dimitri, in Japanese: 先生、今日は彼と共に行かせてください。

Continuity Requirements: START, KEY, and END must be visibly different action states with shared geography, identity, wardrobe, lighting direction, and contact shadows. The generated people must be integrated into the live-action scene, not pasted cutouts.

Reject If:
- the frame is a game screenshot, UI, subtitle, caption, or readable text
- a named identity drifts, Byleth becomes male, or academy phase becomes war phase
- the action peak is missing and the triptych is only a lighting, crop, or texture variation
- a person floats, loses floor contact, or detaches from the scene perspective
- the shot becomes a static symmetrical lineup or a repeated conversation tableau
- the exact reject conditions in the prompt are violated

Planned Frames:
- start_frame.png: storyboards/Shot005/critical_reaudit_regen_v2_2026-08-21/start_frame.png
- key_frame.png: storyboards/Shot005/critical_reaudit_regen_v2_2026-08-21/key_frame.png
- end_frame.png: storyboards/Shot005/critical_reaudit_regen_v2_2026-08-21/end_frame.png
- contact_sheet.jpg: storyboards/Shot005/critical_reaudit_regen_v2_2026-08-21/contact_sheet.jpg

Critical Re-audit Repair Pass — 2026-08-21

2026-08-21 critical re-audit v2 replaces the classroom lineup with a three-stage handoff: Ashe waits, Dimitri closes the door and asks, then Ashe rises and is given the exit.

Keep monitor_required until the Japanese/silent audio contract is checked against the uploaded frames and a 3-second motion probe confirms the action chain, identity locks, contact shadows, and moving tail. Reject if the classroom becomes a posed group portrait, if Dimitri looks out the window instead of addressing Byleth, if Ashe never rises, if the exit does not become usable, or if Byleth becomes male.