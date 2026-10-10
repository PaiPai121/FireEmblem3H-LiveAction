# Shot018 Frame Spec

Shot ID: Shot018
Stage: storyboard
Status: monitor_required
Depends On: script.md; shot_list.md; source_video_breakdown.md
Current Version: critical_reaudit_regen_v6_2026-08-23
Script Beat: Felix 补位
Shot Purpose: Felix 用一次真实的横向补位保护 Ashe，完成切入、接刃、引导撤离三个可读动作。
Duration Target: 8.9 seconds
Location: Lonato battlefield ridge
Characters Visible: Felix, Ashe

Critical Re-audit Finding:
- v5 仍然容易被看成宽景动作示意，且 START/END 的视线和剑线有向右漂移风险。
- v6 用明确的屏幕左轴和真正拉开的景别重做：START 右侧横切进入，KEY 左侧画外刀近身接刃，END 左向低位恢复并把 Ashe 推向右侧出口。
- v1-v5 remain immutable audit evidence and must not be used as the delivery display.

Character Presence Lock:
- Only youthful academy Felix and academy Ashe may be readable.
- The incoming weapon is an anonymous offscreen blade only; attacker face, body, and identity never appear.
- No Byleth, Dimitri, Dedue, Lonato, Catherine, Rhea, Annette, Mercedes, Ingrid, soldiers, monsters, or duplicate performer.

Character Identity Locks:
- Felix: `assets/characters/blue_lions/Felix/academy/selected.png`; academy dark hair in a compact bun, black sleeveless gold-trim vest over white shirt, one academy sword.
- Ashe: `assets/characters/blue_lions/Ashe/academy/selected.png`; silver hair, academy archer uniform, one wooden bow held low.

Asset References:
- `assets/characters/blue_lions/Felix/academy/selected.png`
- `assets/characters/blue_lions/Ashe/academy/selected.png`
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`
- `storyboards/Shot017/critical_reaudit_regen_v2_2026-08-22/end_frame.png` as atmosphere and handoff reference
- `source_refs/Shot018_source.png` as provenance only, never as a generation fallback

Start Frame Intent:
- Ashe 在左中景，弓已经放低；Felix 从画面右侧横向切入，在前景向画面左侧迈步。
- Felix 必须是清晰的左向 profile/three-quarter profile：眼睛、胸口、前脚和运动方向都指向左侧，不能回头看 Ashe。
- START 是运动中的切入，不是两人并排站位。

Key Frame Intent:
- 一把匿名画外刀只从最左边缘进入，Felix 在近中景以身体扭转完成一次克制的接刃。
- Felix 的头、眼、胸、肩、脚和剑线全部朝向画面左侧；Ashe 在他后方被部分遮挡，弓低且不射击。
- KEY 是近身的身体接触峰值，不是对称击剑姿势。

End Frame Intent:
- 画外刀退出。Felix 保持在 Ashe 与左侧危险之间，身体和视线仍然朝向画面左侧，唯一的剑低位斜向左侧。
- Felix 的空手向后做低幅度物理引导，Ashe 在画面右后方开始迈向开放出口；两人不并排摆 pose。
- END 留出右侧撤离路线，不做跪地英雄姿势或胜利姿势。

Camera:
- 真实 16:9 电影机位，START 低位横向跟住右入左行，KEY 切到紧凑的接刃近中景，END 稳在低位左向恢复。
- 保持泥地脚底接触、前后遮挡、湿衣服和雾中景深；不做正面合照、静态队列或镜头炫技。

Blocking:
- Felix: 右侧进入 -> 在 Ashe 前方横切向左 -> 左侧来刃的一次防守接触 -> 左向低位恢复并把 Ashe 引向右后。
- Ashe: 左中景低弓 -> 被 Felix 遮护 -> 向右后小幅挪步；全程不射箭。
- Threat: 只来自画面左侧，只有一把画外匿名武器。

Screen Direction:
- 左侧是唯一危险源。三帧中 Felix 的头、眼、胸、肩、脚和剑线都不得镜像成右向。
- Ashe 从左/后方被保护，最后向右后出口移动；不能突然换成第二个战斗主体。

Action Peak: 一次横向补位、接刃和落剑引导，不是击杀、追击或胜利展示。
Dialogue / Audio Anchor: Felix, in Japanese: ぼんやりするな。お前の代わりに誰かが傷つくぞ。
Edit In: cut from Shot017 Ashe lowering the bow and turning back
Edit Out: cut to Shot019 support line

Continuity Requirements:
- START/KEY/END 使用同一 Lonato battlefield ridge、同一 academy wardrobe、同一灰雾和蓝旗质感。
- 三帧必须分别读成右入左行、左侧接刃、左向恢复并向右后交接，不能只是光照或裁切变化。
- 画面只允许一把 Ashe 的木弓、一把 Felix 的剑；KEY 额外只能有一把左侧画外匿名刀。
- 所有人必须是同一真实环境中的 live-action performer，有共享比例、脚底接触、湿衣服和接触阴影；不得是立绘、透明抠图或背景贴板。

Reject If:
- Felix 没有从右向左横切并站到 Ashe 前方，或 START/END 看向右侧
- 左侧来刃时 Felix 的剑线背离左侧，或动作被镜像
- 防守接触变成击杀、血腥、冲击闪光、魔法或连续攻击
- 出现第二把弓、额外剑、未列人物、攻击者脸/身体、UI、字幕、logo、边框、中文/普通话配音或可读文字
- START/KEY/END 只是同一姿势的光照或裁切变化，或 END 变成跪地英雄 pose
- 人物像抠图贴在背景上、脚底悬空、比例不共享或没有接触阴影

Planned Frames:
- start_frame.png: `critical_reaudit_regen_v6_2026-08-23/start_frame.png`
- key_frame.png: `critical_reaudit_regen_v6_2026-08-23/key_frame.png`
- end_frame.png: `critical_reaudit_regen_v6_2026-08-23/end_frame.png`
- contact_sheet.jpg: `critical_reaudit_regen_v6_2026-08-23/contact_sheet.jpg`

Current Visual Review: v6 is the current integrated live-action candidate. The inspected contact sheet reads as a continuous left-facing action chain: Felix enters from screen-right, binds one blade at close range, then recovers left-facing while sending Ashe toward the right exit. Status remains monitor_required until prompt-against-frame QA and a 3-second motion probe.
