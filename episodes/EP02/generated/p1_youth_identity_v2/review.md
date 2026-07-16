# EP02 P1 Youth Identity V2 Review

日期：2026-07-15

## 目标

修正 EP02 第一幕中 Blue Lions 群像分镜的两个核心问题：

- 角色不像 selected 资产，容易变成泛蓝制服群演。
- 学生年龄感偏成熟，尤其群像里容易出现中年脸、修女老态、疲惫风霜感。

## 新图

| Shot | 文件 | 结论 |
| --- | --- | --- |
| Shot013 | `Shot013_BlueLionsLineup_youth_identity_v2.png` | 接线。八人青狮阵列身份锚点更明确，Dimitri、Dedue、Felix、Sylvain、Ashe、Mercedes、Annette、Ingrid 的发型/服装差异可读。 |
| Shot016 | `Shot016_BlueLionsReaction_youth_identity_v2.png` | 接线。Byleth 背影 + 学生反应构图保留，Mercedes/Annette/Ashe/Ingrid 年轻化明显。 |
| Shot019 | `Shot019_DimitriAcceptsTeacher_youth_identity_v2.png` | 接线。Dimitri 接受教师的动作更清楚，背景青狮成员身份不再过度随机。 |
| Shot022 | `Shot022_FirstClassWide_youth_identity_v2.png` | 接线。课堂群像更年轻，主要角色分布和蓝狮课堂关系清楚。 |

## 仍需注意

- 这些图是 storyboard still，不等于最终视频角色锁脸。进入视频生成时仍必须使用 selected 角色资产和 identity locks。
- 群像远景中个别脸部不可能达到单人 portrait 精度，后续视频镜头应把关键对白切到中近景。
- Shot013/022 这种多人宽幅镜头，最终视频如发生脸漂移，应拆成两个连续镜头：先八人阵列，再 3-4 人反应。

## 已同步

- `episodes/EP02/video_generation_queue_2026-07-14.json`
- `episodes/EP02/video_payloads_2026-07-14.json`
- `episodes/EP02/video_payloads_2026-07-14.jsonl`
- `episodes/EP02/video_batches_2026-07-14/*.json`
- `episodes/EP02/video_payloads_2026-07-14/Shot013.json`
- `episodes/EP02/video_payloads_2026-07-14/Shot016.json`
- `episodes/EP02/video_payloads_2026-07-14/Shot019.json`
- `episodes/EP02/video_payloads_2026-07-14/Shot022.json`
- `episodes/EP02/video_jobs_2026-07-14/Shot013.md`
- `episodes/EP02/video_jobs_2026-07-14/Shot016.md`
- `episodes/EP02/video_jobs_2026-07-14/Shot019.md`
- `episodes/EP02/video_jobs_2026-07-14/Shot022.md`
