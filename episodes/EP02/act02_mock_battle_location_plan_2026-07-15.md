# EP02 Act02 学级模拟战场详细场景方案

日期：2026-07-15

结论修正：第二幕学级模拟战场不能拆成多个小训练功能区。当前 `MockBattleGrounds_reference.png` 需要升级为原作式户外战棋地图总览，再用局部镜头表现东南起点、中西线、林地/thicket、东北 heal tile+ 等区域。

## 2026-07-17 纠偏

本文件 2026-07-15 的“Formation Yard / Archery Range / Magic Practice Lane / Side Flank Lane”思路过于训练场化，不符合原作学级模拟战。保留“需要多个可拍摄局部”的生产诉求，但局部必须属于同一张地图，而不是彼此独立的小训练场。

## 为什么仍需要局部

模拟战不是单个空地，也不是多个训练靶场。它在影视化里承担三件事：

- 让观众看懂规则：这是学院模拟战，不是真战场。
- 让动作戏有地理逻辑：东南起点、中西部第一波、林地、东北触发区和治疗地形必须在空间上成立。
- 让角色关系落地：Byleth 的教学、Felix 的失位、Dimitri 的锋芒、Dedue 的守护，都需要不同机位和功能区。

如果只用一个远景总参考，视频生成容易出现：

- 所有动作像发生在同一块草地上。
- 弓术、魔法、侧翼和阵型没有空间区别。
- 镜头之间方向感混乱。
- 打斗戏容易漂成真实战场、中世纪乱斗，或误回到训练场靶道。

## 推荐场地结构

### 1. Southeast Start / 东南起点

用途：

- Shot025：模拟战规则建立
- Shot026：Byleth 安排 Blue Lions 路线
- Shot035/036：战后人物反应

视觉要点：

- 东南边缘地势略低，能看见北侧/西侧远处压力。
- Byleth 可在泥地上画简图。
- 有训练武器和教会治疗者，但不要做成操场列队。
- 地面可有自然路径、石路、草坡，不能有游戏网格。

### 2. Mid-West Pressure Line / 中西部第一波

用途：

- Shot027：Dorothea、Lorenz、Ignatz 主动压上
- Shot028：Annette/Mercedes 稳住后线

视觉要点：

- 草坡、石路、低墙和稀疏树丛组成推进线。
- Ashe 的高点是自然地形或低石阶，不是弓术靶场。
- 训练箭表现为压制路线和打断推进，不表现伤害命中。

### 3. Thicket / 林地与掩体

用途：

- Shot029：Sylvain/Ingrid 侧翼
- Claude/Hilda 的机动与诱导

视觉要点：

- 树丛、长草、低石墙、斜坡。
- 黄旗或金鹿标识只做阵营识别，不要像训练标牌。
- 需要能表现“藏在 thicket 后等待触发”的位置感。

### 4. Northeast Trigger Approach / 东北触发入口

用途：

- Shot030：Felix 失位前突
- Shot031：Byleth 制止 Felix
- Shot032：Dedue/Dimitri 进入压力线

视觉要点：

- 不是训练通道，而是通向北侧敌群的石阶/坡道/低墙缺口。
- 远处能隐约看到红黑旗、黄旗和教师身影。
- 视觉上必须说明 Felix 再推进会让两组敌人同时动。

### 5. Heal Tile+ Faculty Line / 教师治疗地形线

用途：

- Shot033：Dimitri 压住锋芒
- Shot034：Hanneman/Manuela 退让，完成 rout

视觉要点：

- 刻有治疗纹或白魔法纹样的石地/台阶，不是擂台。
- Hanneman 施放 Sagittae/Wind，Manuela 使用 Nosferatu/Heal/Ward 支援。
- Blue Lions 目标是迫使两人离开治疗地形并切断支援，不是击倒裁判。

### 6. Observation Edge / 教会观察边线

用途：

- Shot037：Rhea/Seteth 观察

视觉要点：

- 模拟战地图高处或柱廊边缘。
- 前景 Rhea/Seteth，远处训练场学生小而清楚。
- 长焦压缩，政治监视感强。

## 资产生成清单修正

已有/建议复用的地图局部：

- `MockBattleGrounds/`：整张原作式户外地图总览
- `MockBattleGrounds_BlueVsGolden_FlankRange/`：中西部林地与 thicket
- `MockBattleGrounds_BlueVsBlack_TacticalLane/`：东北触发入口与教师压力线
- `MockBattleGrounds_BlackVsGolden_Backfield/`：北侧敌方纵深与 rout 收束
- `MockBattleGrounds_ObservationEdge/`

每个目录至少包含：

- `<SceneName>_reference.png`
- `prompt.md`

## Shot 对应关系

| Shot | 当前地点 | 建议地点 |
| --- | --- | --- |
| Shot025 | TrainingGround / MockBattleGrounds | 原作式户外地图总览 |
| Shot026 | TrainingGround | 东南起点 |
| Shot027 | TrainingGround | 中西部第一波压力线 |
| Shot028 | TrainingGround | 东南后线支援位 |
| Shot029 | TrainingGround | 林地 / thicket |
| Shot030 | TrainingGround | 东北触发入口 |
| Shot031 | TrainingGround | 东北触发入口 |
| Shot032 | TrainingGround | 东北入口盾线 |
| Shot033 | TrainingGround | 教师 heal tile+ 前 |
| Shot034 | TrainingGround | 教师 heal tile+ 与北侧敌方纵深 |
| Shot035 | TrainingGround | 地图边缘 |
| Shot036 | TrainingGround | 地图边缘 |
| Shot037 | TrainingGround edge | 观察边线俯看整张地图 |

## 生成优先级

P0：

1. `MockBattleGrounds` 原作式总览
2. 中西部林地 / thicket
3. 东北触发入口
4. Heal tile+ 教师支援线

P1：

5. 东南后线支援位
6. ObservationEdge

原因：P0 四个区覆盖原作地图逻辑和关键战术误区。后线支援与观察边线重要，但可以在第二轮接入。
