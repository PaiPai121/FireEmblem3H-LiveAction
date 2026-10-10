# Shot017 Frame Spec

Shot ID: Shot017
Stage: storyboard
Status: monitor_required
Depends On: script.md; shot_list.md; source_video_breakdown.md
Script Beat: Ashe 认出旧徽记
Shot Purpose: 让 Ashe 在真正看清旧徽记后主动放下弓，把战斗压力转成迟疑和下一镜的保护动作。
Duration Target: 11.7 seconds
Location: Lonato battlefield ridge
Characters Visible: Ashe, female Byleth
Character Presence Lock: Only Ashe and female Byleth are readable in this shot. Felix does not enter until Shot018. Dimitri, Dedue, Catherine, Lonato, Rhea, Seiros soldiers, monsters, and any other named character must not enter.

Character Identity Locks:
- Ashe: `assets/characters/blue_lions/Ashe/academy/selected.png`; youthful academy-era Blue Lions archer, silver hair, black/tan/deep-blue academy uniform, wooden bow, no war-phase aging and no generic silver-haired adult.
- Byleth: `assets/characters/protagonist/BylethFemale/professor/selected.png`; female academy-era professor only, dark teal-black hair, covered black high-collar professor outfit, no male Byleth and no war-phase aging.

Asset References:
- `assets/characters/blue_lions/Ashe/academy/selected.png`
- `assets/characters/protagonist/BylethFemale/professor/selected.png`
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`
- `storyboards/Shot016/critical_reaudit_regen_v2_2026-08-22/end_frame.png` as previous-shot eyeline and wet-ground reference
- `storyboards/Shot018/critical_reaudit_regen_v1_2026-08-14/start_frame.png` as next-shot lane reference only
- `source_refs/Shot017_source.png` as source/layout reference only

Start Frame Intent: 接住 Shot016 END 的泥地、灰雾和向 Ashe 交出的视线。Ashe 在左前景保持半警戒，弓仍横在身前但不是拉满；右前景的破旧蓝盾和磨损动物徽记先成为视觉对象，女贝老师留在中后景。第一帧必须是“尚未确认”的状态。
Key Frame Intent: Ashe 贴近观察盾面，眼睛明确落在磨损徽记上；弓弦从半紧变为松弛，手指放开一点但不射箭。徽记必须是盾上的物理旧漆和刮痕，不能出现可读文字、发光图标或 UI。
End Frame Intent: 认出之后动作必须落地并区别于 START：Ashe 把弓降到左腿旁近乎竖直，弓弦明显松垂，拉弦的手张开并离开弦，肩膀和脸转回女贝老师；女贝老师向前一步但双手放低。破盾留在右侧作为触发物，并在 Ashe 与画面右边之间留出下一镜 Felix 进入的空间。

Camera: 真实 16:9 电影机位；START 为左前景中近景，KEY 轻微推近盾面与 Ashe 眼神，END 稳住为带中后景女贝老师的双人构图。保持地面接触、景深和雾的遮挡关系，不做海报式正面立绘。
Blocking: Ashe 由半拉弓状态转向盾面识别，再松弦、降弓并转回女贝老师；女贝老师只向前一步，不重复 Shot016 的抬手制止动作。右侧盾面和开放通道把动作交给 Shot018，但 Felix 不提前出现。
Screen Direction: 继承 Shot016 END 的视线交接和湿冷山脊；Ashe 的注意力从右前景盾面转回中后景女贝老师，END 保持右侧开放，供 Shot018 的 Felix 从相同方向接入。
Action Peak: 不是射击，而是 Ashe 看清旧徽记后的身体性停顿：弓弦松、弓下降、视线和肩线回到女贝老师。
Dialogue / Audio Anchor: Ashe, in Japanese: あれは……ガスパール家の紋章。
Edit In: cut from Shot016 Dimitri lowering the spear and handing off the eyeline
Edit Out: cut to Shot018 Felix entering the open right-side protective lane

Continuity Requirements:
- Shot017 START must inherit Shot016 v2 END 的灰雾、泥地、蓝旗、academy wardrobe logic 和视线交接，但不复制 Shot016 的女贝老师抬手姿势。
- Shot017 END must be the settled state that Shot018 can continue: Ashe has lowered the bow, the right-side lane stays open, and Felix is still absent.
- Female Byleth is the only Byleth identity in every visible frame.
- Ashe and Byleth must be integrated live-action bodies with shared perspective, contact shadows, wet-ground interaction, and atmospheric depth; never portrait plates or pasted cutouts.
- START, KEY, and END must be three readable action states: half-ready bow, crest recognition with softened string, lowered bow and turn-back handoff.

Motion Risks: image-to-video may make Ashe fire reflexively, keep the bow frozen across all frames, erase the shield crest, repeat Byleth's Shot016 stop-hand gesture, introduce Felix early, or drift Byleth toward a male/war-phase identity.

Reject If:
- Byleth becomes male, ambiguous, older, war-phase, sexualized, or a black-cloak male partner
- Ashe becomes an adult prince/generic soldier, fires, releases an arrow, celebrates, or causes a visible hit
- Felix or any other named character appears before the Shot018 cut
- the shield crest becomes readable text, glowing magic, a route icon, or game UI
- START, KEY, and END are duplicate crops, repeated shield closeups, or lighting-only variants
- the performers look like flat portrait cutouts, stickers, or a lineup without contact shadows
- subtitles, captions, dialogue boxes, UI, borders, logos, watermarks, Chinese/Mandarin voice, or readable text appear

Planned Frames:
- start_frame.png: `critical_reaudit_regen_v2_2026-08-22/start_frame.png`
- key_frame.png: `critical_reaudit_regen_v2_2026-08-22/key_frame.png`
- end_frame.png: `critical_reaudit_regen_v2_2026-08-22/end_frame.png`
- contact_sheet.jpg: `critical_reaudit_regen_v2_2026-08-22/contact_sheet.jpg`

Current Visual Review: v2 is a sequential re-audit candidate generated from Shot016 v2 END, the canonical local Ashe and female Byleth assets, the Lonato battlefield reference, and the frozen Shot018 START lane. START establishes the uncertain half-ready state, KEY makes the shield recognition and softened string readable, and the regenerated END lowers the bow nearly vertical with a visibly slack string and turns Ashe back toward female Byleth. The integrated live-action frames are distinct but remain `monitor_required` until prompt-against-frame QA and a 3-second motion probe.
