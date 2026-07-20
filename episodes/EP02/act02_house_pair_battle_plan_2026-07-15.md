# EP02 Act02 三学级两两交战分镜与地点方案

日期：2026-07-15

目标：把“学级模拟战”从普通训练场戏升级成可拍摄的三方演习。2026-07-17 修正：不要再按小训练场或两两分区来理解；这里保留 Blue Lions 面对两学级压力的分镜功能，但空间必须是一张连续的原作式户外战棋地图。

## 2026-07-17 修正

原作青狮线模拟战不是多个小训练场分区，也不是教师擂台。它是一张 20x22 规模的户外地图：Blue Lions 从东南边缘出发，中西线有会主动压上的敌人，西/中部有林地与 thicket，东北区域有 Hanneman/Manuela 所在的 heal tile+ 与敌方主力。影视化要保持这张地图的连续性。

## 战斗关系

三学级两两关系：

1. Blue Lions vs Black Eagles
2. Blue Lions vs Golden Deer
3. Black Eagles vs Golden Deer

EP02 是青狮线，所以 Blue Lions 的两条对抗线是主线，Black Eagles vs Golden Deer 作为背景/横向对照，不抢主剧情。

## 场地总结构

模拟战场应该像学院里的“战棋地图”，不是一块平地，也不是几块训练靶道：

- 东南：Blue Lions 起始边线
- 中西线：Dorothea、Lorenz、Ignatz 的第一波主动推进
- 西/中部：Claude/Hilda 所在的林地与 thicket
- 东北：Black Eagles 与教师单位压上的危险触发区
- 东北内侧：Hanneman/Manuela 的 heal tile+ 支援线
- 边缘：教师/教会观察点
- 内侧：撤出通道与教会治疗者待命区

## Map Zone 1 - 东北 Black Eagles / 教师压力线

建议资产：

- `assets/locations/EP02/act02/MockBattleGrounds_BlueVsBlack_TacticalLane/`

用途：

- Felix 误冲东北触发区
- Byleth 制止 Felix
- Dedue/Dimitri 进入东北入口
- Hanneman/Manuela 的 heal tile+ 支援线

视觉逻辑：

- 不是训练走廊，而是通往东北敌群的地图入口。
- 石阶、低墙、草地断面和治疗纹地面形成压迫。
- 红黑阵线与教师单位在远侧；蓝狮从近侧谨慎推进。
- 对抗感强，但仍是学院模拟战，无血腥。

可对应镜头：

- Shot026：Byleth 说明阵型时可以指向这个方向。
- Shot030：Felix 脱离阵型，冲向 Black Eagles 方向。
- Shot031：Byleth 在战术走廊中制止 Felix。
- Shot032/033：Dedue/Dimitri 在正面压力线中出现。

## Map Zone 2 - 中西部 Golden Deer 林地 / thicket

建议资产：

- `assets/locations/EP02/act02/MockBattleGrounds_BlueVsGolden_FlankRange/`

用途：

- Ashe 高点压制第一波主动敌人
- Sylvain/Ingrid 侧翼
- Claude/Hilda 借林地和 thicket 诱导走位

视觉逻辑：

- 更开阔、更斜向，有树丛、草坡、低石墙和视线遮挡。
- 黄旗或金鹿标识在远侧，但不能像靶道。
- 箭矢以压制路线和视野为主，不表现真实伤害。

可对应镜头：

- Shot027：Ashe 支援。
- Shot029：Sylvain/Ingrid 侧翼。
- Shot034：演习结束时可以看到这条侧翼线收束。

## Map Zone 3 - 北侧敌方纵深 / 全歼收束

建议资产：

- `assets/locations/EP02/act02/MockBattleGrounds_BlackVsGolden_Backfield/`

用途：

- 背景对照，说明青狮面对的是两学级和教师单位组成的整张地图。
- 展示 Edelgard、Claude 与残余学生最终放下武器，完成 rout。

视觉逻辑：

- 远景或中远景。
- 红黑旗与黄旗在北侧不同纵深，不要做成独立训练区。
- 学生用钝刃、训练弓和护具进行非致命演练。
- 可让 Hanneman/Manuela 的 heal tile+ 位于前景或中景，提示最终要切断教师支援线。

可对应镜头：

- Shot025：规则建立宽景中可见三方分区。
- Shot034：演习结束宽景中可见另两组也收手。
- 可作为新增插入镜头：Shot025B 或 Shot034B。

## 建议新增战斗分镜

这些不是必须替换现有 Shot025-037，而是用于视频生成或剪辑时增强战斗空间。

### Shot025A - Canon 20x22 Field Map

目的：建立三学级不是排队摆拍，而是在同一张原作式户外地图上行动。

画面：俯视或高位宽镜，Blue Lions 在东南，第一波敌人位于中西线，东北有教师和敌方主力。

地点：MockBattleGrounds

### Shot026B - Byleth Southeast Route Call

目的：Byleth 不只是排队，而是在东南起点安排路线并警告不要过早触发东北敌群。

画面：Byleth 在泥地画图，Dimitri/Dedue 看向东北，Ashe/Sylvain/Ingrid 看向中西线。

地点：MockBattleGrounds 东南起点

### Shot027B - First Moving Enemy Wave

目的：表现 Dorothea、Lorenz、Ignatz 会先压上，Blue Lions 需要先清中线。

画面：Ashe 在高处压住中西线，三名敌方学生从林地和石路间推进。

地点：BlueVsGolden_FlankRange

### Shot029B - Sylvain/Ingrid Thicket Flank

目的：让侧翼动作有明确对手和空间方向。

画面：Sylvain 引出林地中的金鹿对手，Ingrid 从草坡和低墙间切入，Claude/Hilda 的 thicket 位置被迫暴露。

地点：BlueVsGolden_FlankRange

### Shot030B - Felix Breaks Toward Northeast Trigger

目的：Felix 的失位有更明确的战术后果：他差点提前触发东北敌群。

画面：Felix 冲向东北石阶和治疗纹地形方向，红黑旗与教师身影在远处出现，Byleth 已经注意到。

地点：BlueVsBlack_TacticalLane

### Shot034B - Faculty Heal Tile Rout

目的：明确“攻下 Hanneman/Manuela”不是攻擂台，而是迫使 heal tile+ 上的教师支援线退让，并完成全歼。

画面：Hanneman 和 Manuela 离开治疗纹地面，Edelgard、Claude 与残余学生放下训练武器，教师哨声结束。

地点：BlackVsGolden_Backfield

## 现有 Shot025-037 推荐空间重分配

| Shot | 原功能 | 建议地点 |
| --- | --- | --- |
| Shot025 | 规则建立 | 原作式户外地图总览 |
| Shot026 | Blue Lions 阵型 | 东南起点 |
| Shot027 | Ashe 弓术 | 中西线高点 / 第一波主动敌人 |
| Shot028 | Annette/Mercedes 支援 | 东南后线支援位 |
| Shot029 | Sylvain/Ingrid 侧翼 | 西/中部林地与 thicket |
| Shot030 | Felix 失位 | 东北触发区入口 |
| Shot031 | Byleth 制止 Felix | 东北触发区入口 |
| Shot032 | Dedue 守 Dimitri | 东北入口 |
| Shot033 | Dimitri 压住锋芒 | 东北 heal tile+ 支援线前 |
| Shot034 | 演习结束 | Hanneman/Manuela heal tile+ 与北侧敌方纵深 |
| Shot035 | Felix 承认 Byleth | 地图边缘 |
| Shot036 | Dimitri 暗线 | 地图边缘 |
| Shot037 | 教会观察 | 观察边线俯看整张地图 |

## 生成优先级

先生成三组 pair zones：

1. `BlueVsBlack_TacticalLane`
2. `BlueVsGolden_FlankRange`
3. `BlackVsGolden_Backfield`

再生成功能区：

4. `FormationYard`
5. `DefensiveStation`
6. `ObservationEdge`
7. `MagicPracticeLane`

原因：pair zones 直接解决“每两个学级之间的战斗应该有地点”的问题；功能区解决镜头细节和安全训练逻辑。
