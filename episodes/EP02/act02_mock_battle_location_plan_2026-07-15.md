# EP02 Act02 学级模拟战场详细场景方案

日期：2026-07-15

结论：第二幕学级模拟战场需要拆成多个功能区。当前 `MockBattleGrounds_reference.png` 只能做总览，不能稳定支撑 Shot025-037 的连续动作戏。

## 为什么要拆

模拟战不是单个空地，它在影视化里承担三件事：

- 让观众看懂规则：这是学院训练，不是真战场。
- 让动作戏有地理逻辑：弓手、侧翼、支援、前压、防守必须在空间上成立。
- 让角色关系落地：Byleth 的教学、Felix 的失位、Dimitri 的锋芒、Dedue 的守护，都需要不同机位和功能区。

如果只用一个训练场总参考，视频生成容易出现：

- 所有动作像发生在同一块草地上。
- 弓术、魔法、侧翼和阵型没有空间区别。
- 镜头之间方向感混乱。
- 打斗戏容易漂成真实战场或中世纪乱斗。

## 推荐场地结构

### 1. Formation Yard / 队列规则区

用途：

- Shot025：模拟战规则建立
- Shot026：Byleth 安排 Blue Lions 阵型
- Shot034：演习结束

视觉要点：

- 开阔训练场中央。
- 三学级分区列队。
- 武器架、盾架、哨台、教师观察点。
- 地面有浅色粉线或木桩边界，但不要游戏网格。

### 2. Archery Range / 弓术靶道

用途：

- Shot027：Ashe 远程压制

视觉要点：

- 草靶、软垫盾靶、箭壶、钝箭回收箱。
- 侧边或略高的平台，让 Ashe 有“支援位”。
- 明确没有人站在射击路径里。

### 3. Magic Practice Lane / 魔法练习区

用途：

- Shot028：Annette/Mercedes 支援

视觉要点：

- 石板圆环或低矮训练标记。
- 小型安全魔法练习灯/护符靶。
- 背景和主战区有距离，避免魔法支援像战场爆炸。

### 4. Side Flank Lane / 侧翼通道

用途：

- Shot029：Sylvain/Ingrid 侧翼
- Shot030：Felix 失位前突
- Shot031：Byleth 制止 Felix

视觉要点：

- 训练场边缘的长向通道。
- 木栏、低矮障碍、盾靶和旗帜形成运动方向。
- 足够窄，让“脱离阵型”和“侧翼切入”看得懂。

### 5. Defensive Station / 防守练习位

用途：

- Shot032：Dedue 守护 Dimitri
- Shot033：Dimitri 压住锋芒
- Shot036：Dimitri 暗线

视觉要点：

- 盾牌架、软垫盾、训练长杆。
- 比主场地更靠内侧，适合中景和手部特写。
- 背景仍能看到 Blue Lions 学生，保持同一场训练连续性。

### 6. Observation Edge / 教会观察边线

用途：

- Shot037：Rhea/Seteth 观察

视觉要点：

- 训练场高处或柱廊边缘。
- 前景 Rhea/Seteth，远处训练场学生小而清楚。
- 长焦压缩，政治监视感强。

## 资产生成清单

建议在 `assets/locations/EP02/act02/` 下新增：

- `MockBattleGrounds_FormationYard/`
- `MockBattleGrounds_ArcheryRange/`
- `MockBattleGrounds_MagicPracticeLane/`
- `MockBattleGrounds_SideFlankLane/`
- `MockBattleGrounds_DefensiveStation/`
- `MockBattleGrounds_ObservationEdge/`

每个目录至少包含：

- `<SceneName>_reference.png`
- `prompt.md`

## Shot 对应关系

| Shot | 当前地点 | 建议地点 |
| --- | --- | --- |
| Shot025 | TrainingGround / MockBattleGrounds | FormationYard |
| Shot026 | TrainingGround | FormationYard |
| Shot027 | TrainingGround | ArcheryRange |
| Shot028 | TrainingGround | MagicPracticeLane |
| Shot029 | TrainingGround | SideFlankLane |
| Shot030 | TrainingGround | SideFlankLane |
| Shot031 | TrainingGround | SideFlankLane |
| Shot032 | TrainingGround | DefensiveStation |
| Shot033 | TrainingGround | DefensiveStation |
| Shot034 | TrainingGround | FormationYard |
| Shot035 | TrainingGround | SideFlankLane or FormationYard edge |
| Shot036 | TrainingGround | DefensiveStation |
| Shot037 | TrainingGround edge | ObservationEdge |

## 生成优先级

P0：

1. FormationYard
2. ArcheryRange
3. SideFlankLane
4. DefensiveStation

P1：

5. MagicPracticeLane
6. ObservationEdge

原因：P0 四个区覆盖大多数动作镜头和空间连续性。MagicPracticeLane 和 ObservationEdge 重要，但可以在第二轮接入。
