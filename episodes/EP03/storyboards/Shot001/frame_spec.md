# Shot001 Frame Spec

Shot ID: Shot001
Stage: storyboard
Status: monitor_required
Script Beat: 梦境残响
Shot Purpose: 把上一章的神秘意识延续到本章，并用一个真正的回应动作而不是换光粒暗示 Byleth 的身世不只属于教会。
Location: dream
Characters Visible: Byleth, Sothis

## Character Identity Locks

- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/divine/Sothis/dream/legacy_ep01/candidate_03.png
- Female Byleth only: assets/characters/protagonist/BylethFemale/professor/selected.png; no male or war-phase Byleth.

## Asset References

- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/divine/Sothis/dream/legacy_ep01/candidate_03.png
- assets/locations/DreamSanctuary/EP01_scene_reference.png
- episodes/EP03/source_refs/Shot001_source.png

Presence Lock: Byleth, Sothis only, with background figures indistinct unless explicitly stated in the prompt.

Start Frame Intent: 在红色峡谷梦境的远台上，女贝老师背对镜头停在左前景，Sothis 还在远处等待；两人之间留出空旷的峡谷和圣像，像一场尚未回应的召唤。

Key Frame Intent: 女贝老师转成左侧面并抬起一只手，Sothis 在中远景伸手回应；绿色光粒沿两人之间形成一条短暂的联系，动作峰值是伸手而不是换光。

End Frame Intent: 女贝老师突然向右侧异响转身，Sothis 在远处祭坛处分解成散开的光粒；两人不再处于对视构图，空出的中央空间交给下一镜。

Camera: 低位宽镜头从远距离关系缓慢靠近，在伸手时保持双方同框，最后轻微横移到女贝老师的转身和空出的祭坛。
Blocking: START 女贝老师左前景、Sothis 远台；KEY 女贝老师抬手、Sothis 伸手回应；END 女贝老师转向画外、Sothis 消散，中央关系被打断。
Action Peak: 女贝老师与 Sothis 之间短暂建立的伸手回应，以及随后被异响打断的消散。
Dialogue / Audio Anchor: Sothis, softly in Japanese: そなたは、また何を聞いたのじゃ？

Continuity Requirements: START, KEY, and END must be visibly different action states with shared geography, identity, wardrobe, lighting direction, and contact shadows. The generated people must be integrated into the live-action scene, not pasted cutouts.

Reject If:
- the frame is a game screenshot, UI, subtitle, caption, or readable text
- a named identity drifts, Byleth becomes male, or academy phase becomes war phase
- the action peak is missing and the triptych is only a lighting, crop, or texture variation
- a person floats, loses floor contact, or detaches from the scene perspective
- the shot becomes a static symmetrical lineup or a repeated conversation tableau
- the exact reject conditions in the prompt are violated

Planned Frames:
- start_frame.png: storyboards/Shot001/critical_reaudit_regen_v2_2026-08-21/start_frame.png
- key_frame.png: storyboards/Shot001/critical_reaudit_regen_v2_2026-08-21/key_frame.png
- end_frame.png: storyboards/Shot001/critical_reaudit_regen_v2_2026-08-21/end_frame.png
- contact_sheet.jpg: storyboards/Shot001/critical_reaudit_regen_v2_2026-08-21/contact_sheet.jpg

Critical Re-audit Repair Pass — 2026-08-21

2026-08-21 critical re-audit v2 replaces the previous face-to-face tableau. The three frames now progress from distant waiting to reciprocal reach to an interrupted turn and disappearance.

Keep monitor_required until the Japanese/silent audio contract is checked against the uploaded frames and a 3-second motion probe confirms the action chain, identity locks, contact shadows, and moving tail. Reject if the dream becomes a flat collage, the hand reach is absent, Sothis becomes an adult glamorous woman, Byleth becomes male, magic only changes brightness, or START/KEY/END collapse into one stare.