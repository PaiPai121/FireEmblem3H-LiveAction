# 一次性全时长生成运行说明

Package: `one_pass_full_video_handoff_kakeya_byleth_2026-07-31`
Status: `clips_pending`

## 当前状态

- 34 个镜头、102 张 start/key/end 输入帧已经打包。
- 帧变化审计：`progression_passed`。
- 低帧差镜头：0。
- 运动监看镜头：0。
- 还没有本地视频模型命令，所以本包保持 `clips_pending`。

## 提交方式

1. 打开 `submission_queue.csv` 或 `submission_payload.jsonl`。
2. 对每个镜头提交包内三帧：`start_frame.png`、`key_frame.png`、`end_frame.png`。
3. 使用同目录 `model_prompt.md` 和 `negative_prompt.md`。
4. 输出到 `clips/full/SH###.mp4`。
5. 生成后按 `one_pass_qa_checklist.md` 逐镜头审查。

## 拒绝整片通过的情况

- 女贝老师身份漂移、变男贝或变成现代教师。
- 三位学生被替换。
- 数学图形闪烁、乱码、尺度错误或变成装饰。
- 起始帧、关键帧、结束帧没有形成动作链。
- 相邻镜头剪接不通。
