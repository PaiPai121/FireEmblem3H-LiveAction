# Shot002 Frame Spec

Shot ID: Shot002
Stage: storyboard
Status: monitor_required
Script Beat: 晨钟与修道院
Shot Purpose: 建立本章从学院日常转入教会军事命令，用一段真实走动和推门把空间推进到 Shot003。
Location: monastery
Characters Visible: Byleth

## Character Identity Locks

- assets/characters/protagonist/BylethFemale/professor/selected.png
- Female Byleth only: assets/characters/protagonist/BylethFemale/professor/selected.png; no male or war-phase Byleth.

## Asset References

- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png
- assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png

Presence Lock: Byleth only, with background figures indistinct unless explicitly stated in the prompt.

Start Frame Intent: 高位广角建立雨后清晨的修道院回廊、钟楼和湿石地面；女贝老师从左下入口进入，远处模糊的教会人员和骑士正在集合，不形成表演式队列。

Key Frame Intent: 镜头降到肩高跟拍，女贝老师沿拱廊横向穿过画面，衣摆和脚步带出真实移动；远处拱门之间的集结被她经过时逐渐看见。

End Frame Intent: 女贝老师抵达议事门前，把手放上厚重木门并推开；温暖的室内光切入冷湿回廊，形成明确的门口交接。

Camera: 从高位晨钟建立镜头下摇到肩高侧向跟拍，最后以门把手和门内光线完成匹配剪辑。
Blocking: START 女贝老师从左下进入；KEY 她沿回廊横向行走并经过拱柱；END 她在议事门前推门，远处集结只作背景压力。
Action Peak: 女贝老师从晨雾回廊穿行到议事门，并亲手打开进入军事命令的门。
Dialogue / Audio Anchor: No spoken dialogue. Morning bell, wet footsteps, distant armor, and the door hinge only.

Continuity Requirements: START, KEY, and END must be visibly different action states with shared geography, identity, wardrobe, lighting direction, and contact shadows. The generated people must be integrated into the live-action scene, not pasted cutouts.

Reject If:
- the frame is a game screenshot, UI, subtitle, caption, or readable text
- a named identity drifts, Byleth becomes male, or academy phase becomes war phase
- the action peak is missing and the triptych is only a lighting, crop, or texture variation
- a person floats, loses floor contact, or detaches from the scene perspective
- the shot becomes a static symmetrical lineup or a repeated conversation tableau
- the exact reject conditions in the prompt are violated

Planned Frames:
- start_frame.png: storyboards/Shot002/critical_reaudit_regen_v2_2026-08-21/start_frame.png
- key_frame.png: storyboards/Shot002/critical_reaudit_regen_v2_2026-08-21/key_frame.png
- end_frame.png: storyboards/Shot002/critical_reaudit_regen_v2_2026-08-21/end_frame.png
- contact_sheet.jpg: storyboards/Shot002/critical_reaudit_regen_v2_2026-08-21/contact_sheet.jpg

Critical Re-audit Repair Pass — 2026-08-21

2026-08-21 critical re-audit v2 replaces the previous corridor tableau. The three frames now form a geographic move: enter the cloister, cross the arcade, push the council door.

Keep monitor_required until the Japanese/silent audio contract is checked against the uploaded frames and a 3-second motion probe confirms the action chain, identity locks, contact shadows, and moving tail. Reject if Byleth floats, turns male, looks pasted onto the cloister, if the shot becomes three static monastery views, if the distant group becomes a lineup, or if any spoken dialogue, subtitle, or UI appears.