# 二维挂谷女贝老师短片：全量视觉复审与重生记录

Status: `candidate_review_required`
Date: 2026-08-03

## 结论

用户质疑成立：阻塞不止原先发现的四个角色镜头。全量复审后，问题分为两类：

1. 角色身份阻塞：SH002、SH010、SH020、SH032。
2. 中文科普画面阻塞/风险：SH015、SH025、SH026、SH027、SH028、SH029、SH031 旧图中混入英文标签，已定向重绘为中文/α/δ 版本。

当前不可声称 `video_generation_package` 已完成。角色镜头已生成候选帧，但仍需人工视觉审查后才能替换正式 `real_frames`。

## 候选审查网页

- `delivery/identity_regeneration_review_2026-08-03/asset_viewer.html`
- `delivery/identity_regeneration_review_2026-08-03/regeneration_review_manifest.json`

## 角色镜头

| 镜头 | 旧问题 | 新候选 | 当前决策 |
| --- | --- | --- | --- |
| SH002 | 三位学生像泛化学级色彩替身，不像 selected asset。 | `regenerated_frame_candidates/SH002_identity_v1/` | 候选可审查，暂不批准。 |
| SH010 | 艾黛尔不像 selected asset；第一版重生曾把 deltoid 画成菱形，已拒绝。 | `regenerated_frame_candidates/SH010_identity_v2/` | 候选可审查，暂不批准；需严审 deltoid。 |
| SH020 | 三位学生围沙盘全身可见，但旧图不是资产级还原。 | `regenerated_frame_candidates/SH020_identity_v1/` | 候选可审查，暂不批准。 |
| SH032 | 学生背影/侧影旧图身份不够明确。 | `regenerated_frame_candidates/SH032_identity_v1/` | 候选可审查，暂不批准；key/end 板书已确定性修正为“挂谷针问题”。 |

## 数学图解重绘

| 镜头 | 修复 |
| --- | --- |
| SH015 | 英文 `convex hull / non-convex` 改为中文“凸包会填满空隙 / 非凸保留空隙 / 碎片进入 Perron 构造”。 |
| SH025 | `alpha` 改为 `α`，保留 δ 管宽。 |
| SH026 | `small alpha / large alpha / gold overlap` 改为“α 小 / α 大 / 重叠区”。 |
| SH027 | `length / area / overlap` 英文公式说明改为“交叠长度 / 交叠面积 / 重叠”。 |
| SH028 | `curve / all directions` 英文说明改为中文格数说明。 |
| SH029 | `area may be 0 / dimension = 2` 改为“面积可以为 0 / 维数 = 2”。 |
| SH031 | `tube overlap / maximal averages / wave packets` 改为“细管重叠 / 最大平均 / 波包”。 |

## 不批准原因

- 新角色帧目前只是候选，没有完成独立视觉 QA。
- SH010 仍需确认三尖内摆线不是被误读成普通三角形。
- SH032 的 key/end 对中文板书做过确定性修补，必须审查修补区域是否自然。
- 未完成相邻镜头连续性复审，不能直接进入 full video generation。

## 下一步

1. 对 SH002、SH010、SH020、SH032 候选帧做人工/视觉 QA。
2. 通过后再替换正式 `real_frames`，并保留旧帧为 rejected/previous。
3. 重建真实帧网页、one-pass 队列、manifest。
4. 重新跑 `prompt_asset_package` 与 `video_generation_package` completion gate。
