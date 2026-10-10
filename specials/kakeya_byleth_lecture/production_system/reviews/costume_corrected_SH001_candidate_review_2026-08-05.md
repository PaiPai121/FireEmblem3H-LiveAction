# 女贝老师服装修正与 SH001-SH002-SH010 候选审查

日期：2026-08-05

## 状态

`candidate_review_required`

这次生成的是服装修正候选，不是全片最终批准帧。旧的 34 镜头包仍保持 `blocked_needs_revision`，原因是原先多处贝老师服装被生成成通用黑色长外套、黑袍或普通导师服。

## 新增候选

- 女贝老师服装定妆候选：`assets/characters/protagonist/BylethFemale/costume_corrected_lookdev/candidates_2026-08-05/candidate_01.png`
- SH001 起始帧候选：`specials/kakeya_byleth_lecture/regenerated_frames/costume_corrected_2026-08-05/SH001/start.png`
- SH001 关键帧候选：`specials/kakeya_byleth_lecture/regenerated_frames/costume_corrected_2026-08-05/SH001/key.png`
- SH001 结束帧候选：`specials/kakeya_byleth_lecture/regenerated_frames/costume_corrected_2026-08-05/SH001/end.png`
- SH002 起始帧候选：`specials/kakeya_byleth_lecture/regenerated_frames/costume_corrected_2026-08-05/SH002/start.png`
- SH002 关键帧候选：`specials/kakeya_byleth_lecture/regenerated_frames/costume_corrected_2026-08-05/SH002/key.png`
- SH002 结束帧候选：`specials/kakeya_byleth_lecture/regenerated_frames/costume_corrected_2026-08-05/SH002/end.png`
- SH002 拒绝帧：`specials/kakeya_byleth_lecture/regenerated_frames/costume_corrected_2026-08-05/rejected/SH002_end_rejected_student_weapon.png`
- SH010 起始帧候选：`specials/kakeya_byleth_lecture/regenerated_frames/costume_corrected_2026-08-05/SH010/start.png`
- SH010 关键帧候选：`specials/kakeya_byleth_lecture/regenerated_frames/costume_corrected_2026-08-05/SH010/key.png`
- SH010 结束帧候选：`specials/kakeya_byleth_lecture/regenerated_frames/costume_corrected_2026-08-05/SH010/end.png`

## 通过点

- SH001 不再是地面线条开场，女贝老师本人作为第一视觉主体出镜。
- 三帧不再重复：起始帧是持剑准备，关键帧是 180 度掉头动作峰值，结束帧是掉头完成后的提问定格。
- 木剑与地面扫掠弧线共同引出“同一根单位线段掉头，扫过面积能多小”的问题。
- 候选服装已经包含短披肩、高领、露腹上衣、金色胸饰、银色护臂、黑色短裤/裙片、纹样黑袜、单膝护具、长靴等结构。
- SH002 加入艾黛尔、莉丝缇亚、梅尔赛德斯三位具名学生，不再用路人背影替代互动。
- SH002 关键帧有贝老师指向木剑、单位长度和扫掠弧的教学动作，能承接 SH001 的问题。
- SH002 结束帧把学生反应分开：梅尔赛德斯温和疑问，莉丝缇亚分析地面轨迹，艾黛尔保持怀疑。
- SH010 把艾黛尔的“优雅不等于最小”改成有证明缺口的图像行动：她指向三尖候选外侧可能复用的空隙。
- SH010 结束帧不再突兀宣布“加凸性规则”，而是让女贝老师转向一个无凹陷/直边边界的特殊情形，作为容易证明的过渡。
- SH010 三帧尽量避免公式和长文字，降低黑板文字乱码风险。

## 仍需人工确认

- 该候选是根据项目内已有生成图与文字服装锁重生的 live-action 解释版；项目仍缺少本地官方 Female Byleth 全身参考图。
- 候选服装比旧版正确很多，但胸饰、腰带、下摆、护膝和袖部细节仍可能不是完全官方拓扑。
- SH002 同框人物多，脸部和服装在长视频模型里仍有漂移风险；后续提示词必须把身份锁放在运动指令之前。
- SH002 曾生成一张学生带武器的失败结束帧，已拒绝。后续课堂镜头必须明确写“学生空手、无斧、无枪、无法杖、无战斗姿态”。
- SH010 的黑板 deltoid 仍需数学视觉复核；当前只能说明叙事动作变合理，不能单独通过数学图形 QA。
- SH010 关键帧有一个模糊听课前景，不应在正式视频中抢走艾黛尔与贝老师的互动重点。

## 晋级条件

只有在用户确认这个女贝老师方向可接受后，才能把候选作为新的 lookdev reference，用于批量重生其余镜头。未确认前，不覆盖原 `real_frames` 和 delivery 包。
