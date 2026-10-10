# Shot016 Frame Spec

Shot ID: Shot016
Stage: storyboard
Status: monitor_required
Depends On: script.md; shot_list.md; source_video_breakdown.md
Script Beat: Dimitri 克制锋芒
Shot Purpose: 展示 Dimitri 已有危险力量，但仍听从女贝老师的战术命令。
Duration Target: 11.6 seconds
Location: battlefield
Characters Visible: Dimitri, female Byleth, Dedue
Character Presence Lock: Only Dimitri, female Byleth, and Dedue are readable in this shot. Ashe, Felix, Catherine, Lonato, Rhea, Seiros soldiers, and any other named character must not enter the foreground action.
Character Identity Locks:
- Dimitri: `assets/characters/blue_lions/Dimitri/academy/selected.png`; youthful academy-era Blue Lions student, blond hair, blue cloak, spear, no war-phase aging.
- Byleth: `assets/characters/protagonist/BylethFemale/professor/selected.png`; female academy-era professor only, dark teal hair, covered black high-collar professor outfit, no male Byleth.
- Dedue: `assets/characters/blue_lions/Dedue/academy/selected.png`; academy-era identity, broad shoulders, deep brown skin, close white hair, and one short white/silver braid attached at the nape and kept visible in three-quarter views.
Asset References:
- `assets/characters/blue_lions/Dimitri/academy/selected.png`
- `assets/characters/protagonist/BylethFemale/professor/selected.png`
- `assets/characters/blue_lions/Dedue/academy/selected.png` (canonical braid-repaired asset)
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`
- `storyboards/Shot015/critical_reaudit_regen_v3_2026-08-22/end_frame.png` as previous-shot action-lane reference
- `storyboards/Shot017/critical_reaudit_regen_v1_2026-08-20/start_frame.png` as frozen next-shot eyeline reference
- `source_refs/Shot016_source.png` as source/layout reference only
Start Frame Intent: 接住015右侧的压力线：泥地前景中 Dimitri 已进入反击位置，长枪横过下方；女贝老师在中景盯住他的推进路线；杜笃在左后方举盾补位，身体略转三分之四，让颈后的短辫清楚可读。三人同处一块湿冷战场，不是立绘贴图。
Key Frame Intent: 动作峰值：Dimitri 用一次非血腥的长枪动作逼退画外盾线并追深一步；女贝老师走入他的线路，抬起一只平稳的手命令他停下；杜笃从左后方收紧队形、盾牌保持防线，辫子仍自然附着在后颈。
End Frame Intent: 动作落地：Dimitri 收回并压低长枪，转向女贝老师，确认服从；女贝老师放低手但仍保持战术警戒；杜笃守住左后方。三人形成自然三角，泥路和视线把下一镜头的阿修识别徽记交出去，但阿修不在016中出现。
Camera: 低位侧跟，中广角真实战场透视；START 到 KEY 随 Dimitri 追深轻推，KEY 停顿一拍，END 稳住并留出下一镜头的视线通道。
Blocking: Dimitri 从右前景沿015的右向压力线进入，长枪从准备位推进到画外盾线，再在女贝老师手势后收回；女贝老师从中景进入线路；Dedue 从左后方斜向补位并始终接地。
Screen Direction: Preserve the rightward handoff from Shot015. Dimitri's spear initially drives into the leftward fog pressure, then settles low; the final eyelines leave a clean lane toward Shot017's Ashe insert.
Action Peak: 展示 Dimitri 的危险力量被女贝老师及时收住，而不是把镜头变成胜利式屠杀。
Dialogue / Audio Anchor: Byleth, in Japanese: 戦線を守れ。 Dimitri, in Japanese: 承知しました。
Edit In: cut from rebel pressure
Edit Out: cut to Ashe sees sigil
Continuity Requirements: Shot016 inherits Shot015's wet mud, gray fog, blue banners, and rightward pressure. The new canonical Dedue braid must remain a physical hair lock, not disappear between frames. Byleth must remain female in every visible angle. Shot017 remains frozen and receives only the final eyeline/action handoff.
Motion Risks: Dimitri bloodlust too explicit; spear geometry mutates; Dedue braid vanishes; Byleth gender or age drifts; the three performers become a posed lineup.
Reject If:
- visible game UI, subtitles, dialogue boxes, damage numbers, menus, borders, or readable text appear
- Byleth becomes male, ambiguous, older, war-phase, or sexualized
- Dedue loses the short nape braid, grows a long ponytail, or the braid becomes a costume rope
- Dimitri strikes a person, creates gore, or continues attacking after the hand command
- Ashe, Felix, Catherine, Lonato, Rhea, or another named character enters Shot016
- START, KEY, and END collapse into repeated stills or a flat group portrait
- the performers read as pasted portraits instead of integrated live-action bodies with contact shadows

Planned Frames:
- start_frame.png: critical_reaudit_regen_v2_2026-08-22/start_frame.png
- key_frame.png: critical_reaudit_regen_v2_2026-08-22/key_frame.png
- end_frame.png: critical_reaudit_regen_v2_2026-08-22/end_frame.png
- contact_sheet.jpg: critical_reaudit_regen_v2_2026-08-22/contact_sheet.jpg

Current Visual Review: v2 is a sequential re-audit candidate generated from the frozen Shot015 END lane, the frozen Shot017 START direction, and the canonical local Dimitri, female Byleth, and braid-repaired Dedue assets. START establishes the three performers in one wet battlefield with Dedue's nape braid visible. KEY makes the over-pursuit and stop gesture physically legible. END lowers the spear, settles the command beat, and sends a clean eyeline into Shot017. The frames are integrated live-action candidates with distinct action states; keep monitor_required until prompt-against-frame QA and a 3-second motion probe.
