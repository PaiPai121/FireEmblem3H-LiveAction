# Shot019 Frame Spec

Shot ID: Shot019
Stage: storyboard
Status: monitor_required
Depends On: script.md; shot_list.md; source_video_breakdown.md
Current Version: critical_reaudit_regen_v4_2026-08-23
Script Beat: 支援线稳住
Shot Purpose: 让 Mercedes 带伤员撤离、Annette 打开视野，完成两人支援线到 Catherine 的空路交接。
Duration Target: 9.4 seconds
Location: Magdred Way fog road
Characters Visible: Mercedes, Annette

Critical Re-audit Finding:
- v3 的三人支援线仍像站位图，而且偏离 shot_list 中 Mercedes/Annette 两人调度的原始 beat。
- v4 回到两名 named performers：START 是 Mercedes 带一个模糊伤员进入雾、Annette 在近景拨开湿枝；KEY 是 Annette 穿过窄雾缝；END 把中央道路完整让给 Shot020。
- v1-v3 remain immutable audit evidence and must not be used as the delivery display.

Character Presence Lock:
- Only academy Mercedes and academy Annette may be readable named characters.
- One indistinct exhausted civilian may remain a soft back-facing silhouette on the uphill road.
- No Ingrid, Byleth, Felix, Ashe, Catherine, Rhea, Lonato, Dimitri, Dedue, other named student, soldier, monster, or duplicate woman.

Character Identity Locks:
- Mercedes: `assets/characters/blue_lions/Mercedes/academy/selected.png`; academy blonde in pale mantle, evacuation guide.
- Annette: `assets/characters/blue_lions/Annette/academy/selected.png`; academy red-haired twin-tail mage, practical visibility action with no spectacle.

Asset References:
- `assets/characters/blue_lions/Mercedes/academy/selected.png`
- `assets/characters/blue_lions/Annette/academy/selected.png`
- `assets/locations/EP03/act01/MagdredWayFogRoad/MagdredWayFogRoad_reference.png`
- `storyboards/Shot018/critical_reaudit_regen_v6_2026-08-23/end_frame.png` as handoff atmosphere only
- `source_refs/Shot019_source.png` as provenance only, never as a generation fallback

Start Frame Intent:
- Mercedes 在左中景沿上坡湿路带一个模糊、背向的伤员进入雾中，身体和脚步都持续向远处。
- Annette 在右前景横穿进路面，一只手拨开湿枝，另一只手保持身体平衡；她正在移动，不是正面站立。
- 两人处在不同景深，中间保留可读的泥路，不能排成横队。

Key Frame Intent:
- Mercedes 已经向上坡更深处推进并继续引导伤员。
- Annette 在中央近景从右向左穿入窄雾缝，肩膀和手臂实际挤过一根湿枝，雾自然被分开形成短暂视线。
- 不出现法阵、光束、爆炸或夸张特效；这是身体动作和自然雾位移。

End Frame Intent:
- Mercedes 和模糊伤员已经缩进上左方雾中；Annette 位于右侧近中景，收手后转肩观察空出的路线。
- 从前景到雾中的中央泥路必须空出来，作为 Shot020 Catherine 的切入路径。
- END 是交接状态，不是两人合照。

Camera:
- 真实 16:9 中远景，START 让 Mercedes 远离、Annette 近景穿越；KEY 贴近 Annette 的实际清路动作；END 拉回宽景让空路成为主体。
- 利用石墙、树线、湿泥和雾层建立纵深；不做静态两人横队、魔法特写或海报式构图。

Blocking:
- Mercedes: 左中景向上坡/雾中撤离，手势和身体指向远处。
- Annette: 右前景向中央/左侧穿行，拨开湿枝和自然雾，不施放 spectacle magic。
- Civilian: 只做远处背向模糊辅助，不成为新主体。

Screen Direction:
- Mercedes 与伤员向画面上方/左侧雾路撤离。
- Annette 从右向左穿过近景并打开中央视线；END 让中央道路保持空。

Action Peak: 实用、克制的双人支援调度，不是魔法表演或战斗合照。
Dialogue / Audio Anchor:
- Mercedes, in Japanese: こちらです！
- Annette, in Japanese: 道が見えた！
Edit In: cut from Felix save
Edit Out: cut to Catherine charge

Continuity Requirements:
- START/KEY/END 保持同一 Magdred Way 湿雾路、石墙、树线、academy-era 服装和共享地面接触。
- 三帧必须分别读成撤离建立、窄路打开、空路交接，不能只是光照或裁切变化。
- 伤员只能是远处背影/模糊剪影，不成为新的命名主体或血腥主体。
- 所有人必须是同一真实环境中的 live-action performer，有共享比例、脚底接触、湿衣服和接触阴影；不得出现抠图边缘、透明立绘或 layout_reference 贴板。

Reject If:
- 出现 Ingrid 或任何未列 named performer，或两人排成静态横队
- Annette 出现发光法阵、光束、爆炸、飞石、巨大风压或夸张魔法 spectacle
- Mercedes 不在撤离线、Annette 不在中央清路线、中央道路被堵死
- 伤员变成清晰新角色、血腥主体或大特写
- 出现第二个 Mercedes/Annette、UI、字幕、边框、logo、中文/普通话配音或可读文字
- START/KEY/END 只是同一站姿的光照或裁切变化
- 人物像抠图贴背景、脚底悬空、比例不共享或没有接触阴影

Planned Frames:
- start_frame.png: `critical_reaudit_regen_v4_2026-08-23/start_frame.png`
- key_frame.png: `critical_reaudit_regen_v4_2026-08-23/key_frame.png`
- end_frame.png: `critical_reaudit_regen_v4_2026-08-23/end_frame.png`
- contact_sheet.jpg: `critical_reaudit_regen_v4_2026-08-23/contact_sheet.jpg`

Current Visual Review: v4 is the current integrated live-action candidate. The inspected contact sheet reads as two-person support action rather than a lineup: Mercedes recedes with the indistinct civilian, Annette crosses the near plane and clears the sightline, and END leaves a real empty road for Catherine. Status remains monitor_required until prompt-against-frame QA and a 3-second motion probe.
