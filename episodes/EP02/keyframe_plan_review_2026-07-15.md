# EP02 多帧分镜与关键帧计划

日期：2026-07-15

## 结论

EP02 分镜不应只使用一张代表图。每个 shot 现在按以下结构管理：

- 起始帧：镜头进入时的构图与空间关系，当前由原 `still` 承担。
- 关键帧：动作、情绪或信息最清楚的一瞬，用于指导视频生成的中段目标。
- 结束帧：复杂镜头可后续补齐，用于锁定剪辑接点。

数据文件：

- `episodes/EP02/keyframe_plan_2026-07-15.json`

Web 展示：

- EP02 分镜卡片新增 `起始帧 / 关键帧 / 结束帧` frame strip。
- 当前 42/42 个 shot 均已有实际关键帧文件并显示 ready 状态。
- AI 提示词区新增 `Key Frame Prompt`。

## 全量完成状态

截至 2026-07-15，本轮已把所有 planned / blocked 的镜头补齐为实际关键帧文件：

- 已生成独立 AI 关键帧：Shot013-016、Shot027-030、Shot032。
- 已派生可用中段目标帧：其余 33 个 shot 均从起始帧进行电影式推近、构图偏移和轻微调色，生成独立关键帧文件。
- Shot031 不再保留安全阻塞描述，已改为“Felix 在教师暂停手势前停步”的非接触训练暂停版本。
- Shot042 使用独立黑场关键帧，服务章末硬切。

验证结果：

- `episodes/EP02/keyframe_plan_2026-07-15.json`：42/42 `keyFrameStatus: ready`
- `site/ep02_storyboard_data.js`：已重建，42 个 shot 均带 `frames.start/key` 数据。
- 全量接触表：`episodes/EP02/generated/keyframes_v1/contact_sheet_all_2026-07-15.png`

## 第一批已生成关键帧

优先补模拟战动作镜头：

| Shot | 关键帧 | 状态 |
| --- | --- | --- |
| Shot027 | `episodes/EP02/generated/keyframes_v1/Shot027_AsheArcherSuppression_keyframe_v1.png` | ready |
| Shot028 | `episodes/EP02/generated/keyframes_v1/Shot028_AnnetteMercedesSupport_keyframe_v1.png` | ready |
| Shot029 | `episodes/EP02/generated/keyframes_v1/Shot029_SylvainIngridFlank_keyframe_v1.png` | ready |
| Shot030 | `episodes/EP02/generated/keyframes_v1/Shot030_FelixBreaksFormation_keyframe_v1.png` | ready |
| Shot032 | `episodes/EP02/generated/keyframes_v1/Shot032_DedueGuardsDimitri_keyframe_v1.png` | ready |

接触表：

- `episodes/EP02/generated/keyframes_v1/contact_sheet.png`

## 第二批已生成关键帧

补 Blue Lions 登场与反应镜头：

| Shot | 关键帧 | 状态 |
| --- | --- | --- |
| Shot013 | `episodes/EP02/generated/keyframes_v1/Shot013_BlueLionsLineup_keyframe_v1.png` | ready |
| Shot014 | `episodes/EP02/generated/keyframes_v1/Shot014_DimitriGreeting_keyframe_v1.png` | ready |
| Shot015 | `episodes/EP02/generated/keyframes_v1/Shot015_FelixSylvainExchange_keyframe_v1.png` | ready |
| Shot016 | `episodes/EP02/generated/keyframes_v1/Shot016_BlueLionsReaction_keyframe_v1.png` | ready |

接触表：

- `episodes/EP02/generated/keyframes_v1/contact_sheet_shot013_016.png`

## 后续精修优先级

1. Shot017-019：可把派生关键帧替换为全新 AI 生成的选择仪式情绪关键帧。
2. Shot033-036：可把派生关键帧替换为 Dimitri 暗线和演习结尾的心理关键帧。
3. Shot001-010 / 020-024 / 037-042：当前已有可用关键帧，后续只需按审美标准逐张升级。
