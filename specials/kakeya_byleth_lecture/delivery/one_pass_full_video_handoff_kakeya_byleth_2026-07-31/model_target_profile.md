# 模型目标配置

Package: `one_pass_full_video_handoff_kakeya_byleth_2026-07-31`
Status: `clips_pending`
Strategy: `one_pass_full_length`

预算限制：不做付费 3 秒探针。每个镜头直接按完整时长生成，失败镜头后续单独重生。

需要一个支持 image-to-video 的模型或 CLI，并且最好支持三帧约束：

- `start_frame.png`：起始构图
- `key_frame.png`：动作峰值或数学证明峰值
- `end_frame.png`：剪出状态
- `model_prompt.md`：模型输入
- `negative_prompt.md`：负面约束

执行前设置：

```bash
VIDEO_MODEL_CLI_ARGV_JSON='["video-cli","i2v","--prompt","{model_prompt}","--negative","{negative_prompt}","--first","{start_frame}","--key","{key_frame}","--last","{end_frame}","--duration","{duration}","--out","{output}"]'
```
