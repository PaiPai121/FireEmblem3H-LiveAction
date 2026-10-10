# Scene09 Critical Visual Re-Audit

Date: 2026-08-12

## Decision

`critical_reaudit_blocked_needs_revision`

Do not submit the whole Scene09 package to video generation. The previous `full_local_visual_review_passed_for_motion_probe_not_video_approved` result is superseded because it did not flag visible storyboard failures that are now clear in the delivered frames.

## Counts

- Existing shots failed: 17 (Shot027B, Shot027C, Shot029, Shot029C, Shot029B, Shot031, Shot032C, Shot032F, Shot032G, Shot033B, Shot033C, Shot033D, Shot034C, Shot034D, Shot034E, Shot034F, Shot035)
- Layout reference only: 4 (Shot025A, Shot032B, Shot032D, Shot032E)
- Monitor required, not approved for video: 21 (Shot025, Shot026, Shot026B, Shot026C, Shot027, Shot027D, Shot028, Shot028B, Shot028C, Shot029D, Shot030, Shot030B, Shot030C, Shot031B, Shot032, Shot032A, Shot033, Shot034B, Shot034G, Shot034, Shot036)
- Visual review passed: 0

## Why The Previous Approval Was Unsafe

- It treated file existence and contact-sheet coverage as enough for monitor readiness.
- It reported zero existing visual failures even though multiple frame sets are static poses or do not prove their combat/retreat/capture beat.
- It did not enforce the latest user constraints about three-class balance, Golden Deer attacking Black Eagles too, teacher-lane separation, and every character's exit/defeat state.

## Per-Shot Findings

| Shot | Title | Decision | Blocking / Required Revision |
| --- | --- | --- | --- |
| Shot025 | 规则与三方目标确立 | monitor_required | 起始/关键/结束变化较小，后续视频必须用头部转向和脚步分离补足。 Required: 保留为规则镜头，但视频提示必须强调三人从互相观察转为各自出发。 |
| Shot025A | 战场地形与三路插入 | layout_reference | 没有可读角色动作，只能当空间参考和战场母版。 Required: 若要视频化，应做成无角色的战场插入或重新生成真实三路队形远景。 |
| Shot026 | 贝雷特分配青狮职责 | monitor_required | 人物动作不够具体，职责分配主要靠文字而不是画面证明。 Required: 后续可以保留，但要补一版更明确的手势/指图/接令动作。 |
| Shot026B | 青狮观察敌方来路 | monitor_required | 起止变化有限，队形散开不够明确。 Required: 保留方向逻辑，重做时让侦查、前排、后排职责更可读。 |
| Shot026C | 青狮分线出发 | monitor_required | 角色职责仍不够分明，个别人物可能在视频中漂成群众。 Required: 重做优先级低于 P0，但需要给每个小组更清楚的路线。 |
| Shot027 | 亚修发现金鹿侧影 | monitor_required | 金鹿侧影太小，若视频漂移会变成陌生人。 Required: 保留为侦查镜头候选，视频前需强化库罗德弓与黄披风身份。 |
| Shot027B | 黑鹫第一波压出 | blocked_needs_revision | 未证明 moving enemy wave。 / 黑鹫高光不足，缺少前压节奏。 / start/key/end 差异太小。 Required: 重写为费尔迪南特持训练枪先压线、艾黛尔贾特持训练斧指挥、修伯特/朵洛缇雅后排起手魔法的三帧动作链。 |
| Shot027C | 杜笃与帝国前排接触 | blocked_needs_revision | 接触动作弱。 / 武器关系不清。 / 青狮趁乱取胜的因果没有铺好。 Required: 重做 key：训练枪撞盾、杜笃后撤半步但盾线未破；end：黑鹫被迫停线。 |
| Shot027D | 菲力克斯切入费尔迪南特 | monitor_required | 费尔迪南特被压制的结果不够明确。 Required: 保留候选，但 end 必须显示费尔迪南特被迫后撤或举手认定受限。 |
| Shot028 | 安娜特与梅尔塞德斯掩护亚修 | monitor_required | 魔法烟尘有用，但人物仍像蹲姿等待。 Required: 重做优先级中等：强化安娜特翻书起手、亚修借烟转移。 |
| Shot028B | 艾黛尔贾特与修伯特压迫盾线 | monitor_required | 魔法压迫有，但黑鹫推进步伐不够。 Required: 需要在视频提示中增加脚步推进和盾线反应，必要时重做关键帧。 |
| Shot028C | 贝雷特止住菲力克斯越线 | monitor_required | 费尔迪南特退场/受限结果仍不够强。 Required: 保留候选，但需让费尔迪南特远处明确放低武器或后撤。 |
| Shot029 | 金鹿夹击青狮后排 | blocked_needs_revision | 人物脸和资产不像角色。 / 几乎没有 action peak。 / 金鹿高光不成立。 Required: 重做三帧：start 金鹿从林线压入；key 希尔妲训练斧迫使希尔凡/英谷莉特转身防守；end 洛廉兹/伊格纳兹同时牵制黑鹫方向。 |
| Shot029C | 库罗德读出双线缺口 | blocked_needs_revision | 三方关系混乱。 / 不是读局，是合影。 Required: 重做：库罗德在侧高点，亚修在近处发现他，艾黛尔贾特只作为远处被观察对象。 |
| Shot029D | 亚修跟丢库罗德 | monitor_required | 三帧变化太小，缺少库罗德换位的明确动作。 Required: 可保留但要重写 prompt，让库罗德从树影后撤出画，亚修转身追失。 |
| Shot029B | 金鹿与青狮近身混战 | blocked_needs_revision | 站桩。 / 没有任何人赢/退/受限。 / 希尔妲年龄和脸部风险需重审。 Required: 重做：希尔妲训练斧压住英谷莉特，洛廉兹牵制希尔凡，伊格纳兹远处逼安娜特低头，end 青狮仍勉强守住。 |
| Shot030 | 菲力克斯逼退费尔迪南特 | monitor_required | end 没有明确判定费尔迪南特退场或受限。 Required: 补 end：费尔迪南特退后放低训练枪，承认被压线。 |
| Shot030B | 贝雷特判定菲力克斯回线 | monitor_required | 如果作为动作镜头会太静；作为规则/性格镜头可用。 Required: 保留为短对白镜头，明确菲力克斯收剑而不是继续攻击。 |
| Shot030C | 伊格纳兹牵制安娜特后排 | monitor_required | 角色较小，远处人物身份漂移风险高。 Required: 需要在 prompt 中锁定伊格纳兹弓、安娜特书、梅尔塞德斯支援姿态。 |
| Shot031 | 贝雷特命令菲力克斯停手 | blocked_needs_revision | 静态对话过长。 / 不能解释战斗状态改变。 Required: 重做 key：贝雷特手势挡住剑路；end：菲力克斯收剑转身。 |
| Shot031B | 贝雷特重排青狮防线 | monitor_required | 群像身份和队形可能在视频中漂移。 Required: 视频前先做短探针，尤其检查亚修、梅尔塞德斯、安娜特是否保持后排。 |
| Shot032 | 杜笃受伤，梅尔塞德斯治疗重建盾线 | monitor_required | 仍需视频探针确认治疗光不会变成攻击光束，脸和制服不漂。 Required: 保留为当前合格候选；视频 prompt 禁止血腥、禁止魔兽设计、禁止梅尔塞德斯冲锋。 |
| Shot032A | 安娜特接力掩护亚修 | monitor_required | 梅尔塞德斯不能在下一镜重新满状态主动作战。 Required: 需要账本与 prompt 同步：梅尔塞德斯治疗后只支援/移动，不主动开战。 |
| Shot032B | 迪米特里与杜笃逼近汉尼曼目标台 | layout_reference | 没有明确压制动作。 / 教师台更像舞台展示。 Required: 重做时只保留汉尼曼一侧，key 要有安全屏障/判定动作和青狮推进结果。 |
| Shot032C | 黑鹫与金鹿互相牵制 | blocked_needs_revision | 金鹿攻击黑鹫的关键要求没有被画面证明。 / 动作峰值弱。 Required: 重做：希尔妲或库罗德牵制修伯特/朵洛缇雅，艾黛尔贾特被迫转身防守。 |
| Shot032D | 三方混战总览 | layout_reference | 不能直接视频化为真实战斗镜头。 Required: 作为战术插入可保留；若当实拍镜头需重生真实人群远景，不要彩色标线。 |
| Shot032E | 贝雷特读出乱局机会 | layout_reference | 非写实彩色弧线不适合视频生成。 Required: 保留为导演地图参考；视频化需改成尘土、脚步线、旗帜和真实视线。 |
| Shot032F | 菲力克斯与亚修压制修伯特 | blocked_needs_revision | 关键退场锁没有被画面证明。 / 亚修坐/蹲在墙边像无关人物。 Required: 重做三帧，end 必须显示修伯特双手离开施法姿态、退到规则线外。 |
| Shot032G | 库罗德与雷欧妮截住朵洛缇雅和贝尔娜提塔 | blocked_needs_revision | 朵洛缇雅/贝尔娜提塔被截住的账本关键锁未证明。 / 角色资产识别弱。 Required: 重做：key 雷欧妮拦住退路，库罗德箭线压住施法手；end 黑鹫后排举手/放低武器退出主动战斗。 |
| Shot033 | 青狮转向教师目标 | monitor_required | 推进动作弱，教师判定机制不够清楚。 Required: 需要更清晰的目标旗/判定线/安全屏障。 |
| Shot033B | 贝雷特下令分切教师目标 | blocked_needs_revision | 用户点名疑问成立：贝雷特动作语义不清。 / 教师目标分切没有被证明。 Required: 重做 start/key/end：贝雷特指两侧目标，亚修向汉尼曼线，英谷莉特向玛努艾拉线，菲力克斯留中线封路。 |
| Shot033C | 亚修压制汉尼曼目标 | blocked_needs_revision | 用户点名：魔法完全不对。 / 教师被压制结果不成立。 Required: 重做 key：训练箭打在安全屏障/判定牌上，汉尼曼举手或后撤表示目标失守。 |
| Shot033D | 英谷莉特逼退玛努艾拉目标 | blocked_needs_revision | 魔法/裁定动作不对。 / 英谷莉特高光不足。 / 退场结果不清。 Required: 重做：英谷莉特训练枪点到目标线，玛努艾拉后撤离开治疗圈，希尔凡挡住回援路。 |
| Shot034C | 菲力克斯与费尔迪南特收招 | blocked_needs_revision | 没有退场镜头。 / 费尔迪南特高光和体面收势都不足。 Required: 重做 end：费尔迪南特承认被压线但保持姿态，菲力克斯收剑。 |
| Shot034D | 贝雷特确认汉尼曼判负 | blocked_needs_revision | 角色阵营关系误读风险高。 / 教师判定动作不清。 Required: 重做：贝雷特在台下/侧边举手判定，汉尼曼放下手退到目标线后。 |
| Shot034B | 空教师目标裁定 | monitor_required | 作为空目标说明镜头可用，但缺少一声哨/旗帜落下的动作锚点。 Required: 保留候选，视频提示加离屏哨声和目标旗落下，不新增教师。 |
| Shot034E | 金鹿体面收势 | blocked_needs_revision | 纯站桩。 / 没有每个金鹿角色的战斗/退场结果。 Required: 重做：库罗德放低弓、希尔妲扶斧喘气、洛廉兹整理训练枪、伊格纳兹收弓、雷欧妮回望黑鹫后排。 |
| Shot034F | 黑鹫体面收势 | blocked_needs_revision | 黑鹫高光后结果没有镜头。 / 武器/退场动作弱。 Required: 重做：艾黛尔贾特稳住队伍，费尔迪南特示意停止追击，保留尊严。 |
| Shot034G | 迪米特里与杜笃疲惫守住 | monitor_required | 需要更强的喘息、低盾、尘土和收招状态。 Required: 可保留候选，但最好重做 end 强化险胜而非轻松取胜。 |
| Shot034 | 三位级长赛后互认 | monitor_required | 需要对话/呼吸节奏支撑，否则像宣传照。 Required: 保留为短对白镜头，台词要体现势均力敌、青狮险胜。 |
| Shot035 | 菲力克斯接受贝雷特提醒 | blocked_needs_revision | start/key/end 几乎同状态。 / 人物脸与资产风险需要重审。 Required: 重做：key 贝雷特一句话压住菲力克斯，end 菲力克斯收剑侧目。 |
| Shot036 | 迪米特里承认险胜 | monitor_required | 需要台词支撑尊重其他学级，否则画面信息不足。 Required: 保留为结尾对白镜头，加入‘只是抓住了一瞬空隙’的台词锚点。 |

## Next Work Queue

1. Rewrite blocked shot contracts before generating replacements.
2. Regenerate P0 stills in batches: first 027B/027C/029/029C/029B, then 032C/032F/032G, then 033B/033C/033D/034C/034D/034E/034F/035.
3. After each regenerated shot, sync the main Scene09 storyboard panel immediately.
4. Re-run contact-sheet visual QA, prompt semantics, battle ledger, main panel smoke, and media reference audits before any video generation.

## 2026-08-12 Rebuild Update

- Shot027B 黑鹫第一波压出: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot027C 杜笃与帝国前排接触: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot029 金鹿夹击青狮后排: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot029C 库罗德读出双线缺口: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot031 贝雷特命令菲力克斯停手: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot032C 黑鹫与金鹿互相牵制: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot032F 菲力克斯与亚修压制修伯特: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot032G 库罗德与雷欧妮截住多洛缇雅和贝尔娜提塔: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot033B 贝雷特下令分切教师目标: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot033C 亚修压制汉尼曼目标: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot033D 英谷莉特逼退玛努艾拉目标: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot034C 菲力克斯与费尔迪南特收招: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot034D 贝雷特确认汉尼曼判负: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot034E 金鹿高光后体面收势: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot034F 黑鹫体面收势: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot035 菲力克斯接受贝雷特提醒: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。

## 2026-08-12 Rebuild Update

- Shot029B 金鹿压线，青狮守住侧翼: 已重做 start/key/end 三帧，状态改为 `monitor_required_after_rebuild`；仍需独立视觉复审后才能进入视频探针。
