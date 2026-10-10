# Shot004 Frame Spec

Shot ID: Shot004
Stage: storyboard
Status: monitor_required
Script Beat: 养父的名字
Shot Purpose: 把任务说明压成 Ashe 的身体反应和离队方向，让信息改变人物关系和行走路线。
Location: cathedral
Characters Visible: Ashe, Byleth, Dimitri

## Character Identity Locks

- assets/characters/blue_lions/Ashe/academy/selected.png
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/blue_lions/Dimitri/academy/selected.png
- Female Byleth only: assets/characters/protagonist/BylethFemale/professor/selected.png; no male or war-phase Byleth.

## Asset References

- assets/characters/blue_lions/Ashe/academy/selected.png
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/blue_lions/Dimitri/academy/selected.png
- assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png
- episodes/EP03/source_refs/Shot004_source.png

Presence Lock: Ashe, Byleth, Dimitri only, with background figures indistinct unless explicitly stated in the prompt.

Start Frame Intent: Ashe 已先走出几步来到教堂侧廊，弓压低在身侧；女贝老师和 Dimitri 落后形成斜线，三人共享地面和空间但没有站成一排。

Key Frame Intent: Ashe 停住并握紧肩带，侧脸回认这个名字；女贝老师和 Dimitri 在后方分别停步，目光收向 Ashe，动作峰值是他从离开转为回听。

End Frame Intent: Ashe 转身半步离开画面，女贝老师伸手示意让路，Dimitri 留在近景看向他；拱门和空出的过道把叙事交给下一镜。

Camera: 侧向跟随 Ashe 的前进，在他停步时切入肩高中近景，最后回到斜线广角让出离开的过道。
Blocking: START Ashe 前、Byleth/Dimitri 后；KEY Ashe 停下握肩带并回听；END Ashe 先动身离开，Byleth 让路，Dimitri 目送。
Action Peak: Ashe 听见养父名字后主动停步并回头，随后选择继续向前，而不是三人继续说明。
Dialogue / Audio Anchor: Seteth, in Japanese: ロナート卿は、かつてアッシュを養子として迎えた人物だ。

Continuity Requirements: START, KEY, and END must be visibly different action states with shared geography, identity, wardrobe, lighting direction, and contact shadows. The generated people must be integrated into the live-action scene, not pasted cutouts.

Reject If:
- the frame is a game screenshot, UI, subtitle, caption, or readable text
- a named identity drifts, Byleth becomes male, or academy phase becomes war phase
- the action peak is missing and the triptych is only a lighting, crop, or texture variation
- a person floats, loses floor contact, or detaches from the scene perspective
- the shot becomes a static symmetrical lineup or a repeated conversation tableau
- the exact reject conditions in the prompt are violated

Planned Frames:
- start_frame.png: storyboards/Shot004/critical_reaudit_regen_v2_2026-08-21/start_frame.png
- key_frame.png: storyboards/Shot004/critical_reaudit_regen_v2_2026-08-21/key_frame.png
- end_frame.png: storyboards/Shot004/critical_reaudit_regen_v2_2026-08-21/end_frame.png
- contact_sheet.jpg: storyboards/Shot004/critical_reaudit_regen_v2_2026-08-21/contact_sheet.jpg

Critical Re-audit Repair Pass — 2026-08-21

2026-08-21 critical re-audit v2 keeps Ashe ahead of the group and uses a stop, recognition, and departure chain instead of a three-person cathedral portrait.

Keep monitor_required until the Japanese/silent audio contract is checked against the uploaded frames and a 3-second motion probe confirms the action chain, identity locks, contact shadows, and moving tail. Reject if Ashe remains in a neutral pose, if he looks adult or generic, if Byleth becomes male, if the bow disappears or becomes a sword, or if the shot only alternates close-ups without a stop-and-go action.