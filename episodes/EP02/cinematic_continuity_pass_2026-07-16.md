# EP02 电影连续性修正通告

日期：2026-07-16

## 判断

当前“镜头硬拼”的主要原因不是单张分镜不好，而是旧版生产逻辑把 42 个镜头当作独立图片到视频任务处理。每个镜头内部可能成立，但相邻镜头之间缺少共同的剪辑动机、屏幕方向、声桥和可剪余量，连起来后就会像素材拼贴。

本轮已经改成 `cinematic_v2` 生产路径：所有镜头按故事顺序分成 9 个连续段，每个镜头都写入转场入口、转场出口、屏幕方向、音频桥接和 2 秒剪辑 handles。

## 当前推荐版本

- 队列：`episodes/EP02/video_generation_queue_cinematic_v2_2026-07-16.json`
- 时间线：`episodes/EP02/edit_timeline_cinematic_v2_2026-07-16.md`
- 全量 payload：`episodes/EP02/video_payloads_cinematic_v2_2026-07-16.json`
- 单镜头 job：`episodes/EP02/video_jobs_cinematic_v2_2026-07-16/`
- 连续段批次：`episodes/EP02/video_batches_cinematic_v2_2026-07-16/`
- 输出目录：`episodes/EP02/video_outputs/cinematic_v2/`

总时长从 first pass 的约 490 秒扩展到 614 秒，约 10 分 14 秒。扩展重点放在 Rhea/Jeralt/Seteth 的权力压迫、三学级介绍、Jeralt 私下警告和学级模拟战，不是均匀加长。

## 电影语法规则

1. 生成顺序按故事连续段执行，不再按“高风险素材优先”随机生成。先生成同一连续段内全部镜头，再做段内粗剪。
2. 每个视频必须保留前后 2 秒可剪余量。开头和结尾都要有可用运动，不能是静态海报式起止。
3. 屏幕方向必须连续。抵达修道院保持左到右进入；模拟战保持左到右战术地理；Byleth 是战场轴线锚点。
4. 剪切必须有动机。用步伐、点头、挥手、弓弦、魔法光、口哨、关门、徽章落桌等动作触发切点。
5. 声音要提前或滞后连接镜头。钟声、回廊人声、椅子声、口哨、训练兵器、绿光低频、火把低频需要跨镜头延续。
6. 反应镜头要保留呼吸。Dimitri、Felix、Jeralt、Rhea、Seteth 这几条线不能只给信息，要给沉默和观察。
7. 模拟战不能剪成动作合集。Shot025-Shot036 要表现“Byleth 建立战术秩序，Felix 破坏秩序，Byleth 纠正，Dimitri 暗线外露”。

## 连续段

| 段落 | 镜头 | 功能 |
|---|---|---|
| Arrival | Shot001-Shot004 | 用山路、正门、Dimitri 第一眼建立“进入被注视的修道院” |
| Church Authority | Shot005-Shot008 | Rhea/Jeralt/Seteth 三角压力，Byleth 被任命 |
| Monastery Daily Life | Shot009-Shot010 | 用回廊日常让修道院从建筑变成活空间 |
| Three Houses | Shot011-Shot019 | 三学级横向比较，最后落到青狮 |
| Private Warning | Shot020-Shot021 | Jeralt 私密警告，把外部权力压力转为个人危险 |
| First Class | Shot022-Shot024 | 课堂静态压力转入训练场动作 |
| Mock Battle | Shot025-Shot036 | 本集主体动作段，必须保持空间地理和角色轴线 |
| Observation Echo | Shot037-Shot039 | 教会观察和 Sothis/绿光主观线，把胜利感压低 |
| Conspiracy | Shot040-Shot042 | 用湿夜、面具、黑场作为反派尾钩 |

## 模拟战专项

Shot025-Shot036 是最容易“硬拼”的段落，执行时按以下规则：

- Shot025 先交代训练场整体和三方位置。
- Shot026 用 Byleth 手势把青狮阵型排出来，后续所有动作都回到这个空间关系。
- Shot027-Shot029 分别给远程、支援、侧翼，不要变成三张独立角色展示。
- Shot030 Felix 破阵必须沿着前面建立的方向冲出。
- Shot031 Byleth 拦截要成为动作切点，不是单纯摆拍。
- Shot032 Dedue 防守和 Shot033 Dimitri 克制是一组，表现“力量被纪律压住”。
- Shot034-Shot036 从结束口哨进入人物余波，Felix 的认可和 Dimitri 的暗线都要有停顿。

## 执行顺序

1. 用 `episodes/EP02/video_batches_cinematic_v2_2026-07-16/` 按 1 到 9 生成，不跳批次。
2. 每个批次生成后先做段内粗剪，确认轴线、声音和动作切点成立。
3. 先重点审 `batch_07_mock_battle`，因为它决定整集是否有电影动作段质感。
4. 再接 `batch_04_three_houses` 和 `batch_05_private_warning`，它们负责情绪连贯。
5. 最后统一检查人物年轻化、身份一致性和地点资产匹配。

## 不再推荐

`episodes/EP02/video_generation_queue_2026-07-14.json` 和 `episodes/EP02/edit_timeline_first_pass_2026-07-14.md` 只保留为 first pass 对照。后续视频生成、剪辑和网页检查应以 `cinematic_v2` 为准。
