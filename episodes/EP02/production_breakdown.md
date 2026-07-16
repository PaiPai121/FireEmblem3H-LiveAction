# EP02 制作拆解 - 三个学级（青狮线）

目标：把 52 分钟游戏流程压缩为 10-14 分钟真人影视化短集，并形成可执行的镜头生成/拍摄清单。

## 当前完成度

- 已读源视频并完成时间码结构：`source_video_breakdown.md`
- 已完成影视化剧本：`script.md`
- 已完成 42 镜头分镜表：`shot_list.md`
- 已完成分段生成提示词：`prompts.md`

## 叙事主线

一句话：

Byleth 被教会留下成为新教师，选择 Blue Lions，并通过第一次模拟战获得学生初步信任；同时 Jeralt 和章末反派都提示这场“入学”并不单纯。

三条线：

- 教会线：Rhea 的温和权威与 Seteth 的审视。
- 青狮线：Dimitri 的礼貌责任感，以及 Felix 等学生对 Byleth 的试探。
- 阴谋线：Jeralt 的警告与 Flame Emperor 的章末观察。

## 场景组

| 场景组 | 镜头 | 预计时长 | 主要资产 | 制作重点 |
| --- | --- | ---: | --- | --- |
| A 山道抵达 | Shot001-002 | 18 秒 | `GarregMachMountainRoad`、Byleth、Jeralt、教会骑士 | 明亮但庄严，Jeralt 警惕。 |
| B 正门入门 | Shot003-004 | 16 秒 | `MonasteryMainGatePlaza`、Dimitri、守卫、学生群演 | “被注视”的空间压迫。 |
| C 教会接见 | Shot005-008 | 60 秒 | `MonasteryCathedralAntechamber`、Rhea、Seteth、Jeralt、Byleth | 本集权力关系核心。优先生成。 |
| D 修道院导览 | Shot009-012 | 44 秒 | `MonasteryMainCloister`、Hanneman、Manuela、Edelgard、Claude | 信息压缩，不能拖成介绍 PPT。 |
| E 青狮群像 | Shot013-016 | 54 秒 | `ThreeHousesCourtyard`、Blue Lions 全员 | 用反应和站位建立性格。 |
| F 选择学级 | Shot017-019 | 34 秒 | 接见厅、三位级长、Rhea、Seteth | 从游戏菜单改为仪式性选择。优先生成。 |
| G 父亲警告 | Shot020-021 | 28 秒 | Library 或 Teacher Office、Jeralt、Byleth、佣兵徽章 | 低调但重要，父子关系与教会不信任。 |
| H 第一堂课 | Shot022-024 | 28 秒 | `OfficersAcademyClassroom`、Blue Lions 全员 | Byleth 教学风格：少说，直接实战。 |
| I 模拟战 | Shot025-036 | 134 秒 | `TrainingGround`、Blue Lions、其他学级学生、教师观察席 | 本集动作段。训练演习，不是生死战。 |
| J 观察与神秘 | Shot037-039 | 38 秒 | TrainingGround edge、MainCloister night、Rhea、Seteth、Sothis | 教会观察 + Sothis 私密线。 |
| K 反派伏笔 | Shot040-042 | 36 秒 | 山间废墟、Kostas、Flame Emperor | 章末钩子。必须明显区别于训练场。 |

## 镜头优先级

### P0 - 先做成片骨架

这些镜头定义本集主线，优先做关键画面或概念帧：

- Shot005：Rhea/Seteth 圣光权威登场
- Shot006：Rhea 与 Jeralt 旧识重逢
- Shot007：Seteth 质疑 Byleth
- Shot008：Byleth 接受教师任命
- Shot017：三学级选择仪式
- Shot018：Byleth 选择 Blue Lions
- Shot019：Dimitri 接受新教师
- Shot037：Rhea/Seteth 远处观察训练
- Shot040：Kostas 跪见 Flame Emperor
- Shot041：Flame Emperor 面具近景

### P1 - 建立 Blue Lions 群像

- Shot013：Blue Lions 阵列登场
- Shot014：Dimitri 礼貌邀请
- Shot015：Felix/Sylvain 性格冲突
- Shot016：Mercedes、Annette、Ashe、Ingrid 反应组
- Shot022：全班第一次面对 Byleth
- Shot023：Byleth 放下训练剑
- Shot024：Felix 起身
- Shot027-036：训练演习角色动作链

### P2 - 氛围与连接

- Shot001-004：抵达与入门
- Shot009-012：修道院导览与其他学级对照
- Shot020-021：Jeralt 私下警告
- Shot038-039：Sothis 夜廊
- Shot042：黑场

## 连续性规则

- Byleth 在本集说话极少。任何台词都应短、平、直接。
- Jeralt 对外可以配合，对内必须警惕。
- Rhea 不是冷酷反派。她的压力来自温柔、确定和不可质疑。
- Seteth 的压力来自规则、职责和怀疑。
- Dimitri 的礼貌是真诚的，但训练场必须露出被压住的锋芒。
- Felix 不能只是嘴硬；他是通过战斗判断人。
- Sylvain 用轻松化解紧张，但不能过分喜剧化。
- Annette 的紧张要可爱但不幼稚；Mercedes 的温柔要能稳住别人。
- Dedue 的沉默要有守护感，不是背景板。
- Ingrid 的骑士感来自姿态、纪律和判断。
- 模拟战不能有血腥，不要拍成真实战场；要有规则、哨声、治疗者和观察席。
- Flame Emperor 场景要冷、湿、低光，与明亮学院空间形成反差。

## 已补关键补充资产

在本轮精进中已补齐：

- `assets/locations/EP02/act01/LibraryOrTeacherOffice/LibraryOrTeacherOffice_reference.png`：Jeralt 私下警告用。
- `assets/locations/EP02/act01/NightMainCloister/NightMainCloister_reference.png`：Sothis 夜廊用，作为主回廊夜景变体。
- `assets/locations/EP02/act01/MountainRuinsNight/MountainRuinsNight_reference.png`：Kostas / Flame Emperor 伏笔用。

## 仍待补资产

已有主要场景资产足够支撑 EP02 第一版。仍建议补：

- 教会骑士、普通学生群演、训练场治疗者等 extras。
- 训练武器道具：木剑、钝刃长枪、训练弓、哨子、佣兵徽章。

## 下一步执行建议

1. 先生成 P0 的 10 张关键概念帧，建立本集美术和权力关系。
2. 再生成 Blue Lions 群像 P1：庭院阵列、教室全班、训练场阵型。
3. 补三个缺失场景资产：教师室/图书室、夜主回廊、夜山间废墟。
4. 最后才进入逐镜头视频生成，避免没有统一视觉锚点时反复返工。
