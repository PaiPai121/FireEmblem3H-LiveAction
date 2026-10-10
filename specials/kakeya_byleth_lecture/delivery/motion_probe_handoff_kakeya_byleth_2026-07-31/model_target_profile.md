# 模型目标配置

Package: `motion_probe_handoff_kakeya_byleth_2026-07-31`
Status: `superseded_by_one_pass_budget_policy`

本包已被一次性全时长包取代；保留以下配置仅供历史参考。若重新启用探针，需要一个支持 image-to-video 的模型或 CLI，并且最好支持三帧约束：

- `start_frame.png`：起始构图
- `key_frame.png`：动作峰值或数学证明峰值
- `end_frame.png`：剪出状态
- `model_prompt.md`：模型输入
- `negative_prompt.md`：负面约束

执行前设置：

```bash
VIDEO_MODEL_CLI_ARGV_JSON='["video-cli","i2v","--prompt","{model_prompt}","--negative","{negative_prompt}","--first","{start_frame}","--key","{key_frame}","--last","{end_frame}","--duration","{duration}","--out","{output}"]'
```

当前没有检测到真实模型命令，因此只生成 dry-run 队列。
