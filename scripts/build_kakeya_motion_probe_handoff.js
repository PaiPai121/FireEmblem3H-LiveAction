#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "specials", "kakeya_byleth_lecture");
const previewRoot = path.join(projectRoot, "delivery", "real_frame_preview_kakeya_byleth_2026-07-28");
const previewManifestPath = path.join(previewRoot, "package_manifest.json");
const outRoot = path.join(projectRoot, "delivery", "motion_probe_handoff_kakeya_byleth_2026-07-31");
const outShotsRoot = path.join(outRoot, "shots");
const packageId = "motion_probe_handoff_kakeya_byleth_2026-07-31";
const probeDuration = 3;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

function writeJson(filePath, value) {
  writeText(filePath, JSON.stringify(value, null, 2));
}

function copyFile(source, target) {
  if (!fs.existsSync(source)) throw new Error(`Missing source file: ${source}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function shotFolderName(order, id) {
  return `${String(order).padStart(3, "0")}_${id}`;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function compactChineseMetadata(metadata) {
  return {
    "镜头编号": metadata["镜头编号"],
    "顺序": metadata["顺序"],
    "原片时长秒": metadata["时长秒"],
    "运动探针时长秒": probeDuration,
    "试跑状态": "clips_pending",
    "成片作用": metadata["成片作用"],
    "可见主体": metadata["可见主体"],
    "摄影机": metadata["摄影机"],
    "剪入": metadata["剪入"],
    "剪出": metadata["剪出"],
    "逐句台词": metadata["逐句台词"],
    "主要检查": metadata["主要检查"],
    "拒绝条件": metadata["拒绝条件"],
    "批准说明": "这是 3 秒运动探针，不是最终出片。通过身份、数学图形、标签稳定、动作峰值和剪辑衔接 QA 后，才允许生成全时长片段。",
  };
}

function renderQueueViewer(pkg, timeline) {
  const rows = pkg.shots.map((shot) => `
    <tr>
      <td>${shot.order}</td>
      <td><a href="${shot.package_dir}/model_prompt.md">${shot.id}</a></td>
      <td>${shot.probe_duration_seconds}s / 原 ${shot.full_duration_seconds}s</td>
      <td>${shot.primary_check}</td>
      <td><a href="${shot.package_dir}/start_frame.png">起始</a> · <a href="${shot.package_dir}/key_frame.png">关键</a> · <a href="${shot.package_dir}/end_frame.png">结束</a></td>
      <td><a href="${shot.package_dir}/prompt.md">审查提示词</a> · <a href="${shot.package_dir}/negative_prompt.md">负面</a> · <a href="${shot.package_dir}/metadata.json">元数据</a></td>
    </tr>`).join("");
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>二维挂谷运动探针交接包</title>
  <style>
    body{margin:0;background:#f5f7fb;color:#1f2733;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    header{padding:28px 32px;background:#fff;border-bottom:1px solid #d9e1ee}
    h1{margin:0;font-size:34px}.sub{color:#657386;font-weight:700;margin-top:8px}
    main{padding:24px 32px}.stats{display:grid;grid-template-columns:repeat(5,minmax(120px,1fr));gap:12px;margin-bottom:20px}
    .stat{background:#fff;border:1px solid #d9e1ee;border-radius:8px;padding:14px}.stat b{display:block;font-size:24px}
    .links{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.links a{background:#fff;border:1px solid #cbd6e6;border-radius:7px;padding:10px 12px;color:#1456a8;text-decoration:none;font-weight:800}
    table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #d9e1ee;border-radius:8px;overflow:hidden}
    th,td{text-align:left;border-bottom:1px solid #e6ecf5;padding:10px 12px;vertical-align:top}th{background:#eef3fa}
    td:nth-child(4){max-width:460px}.note{background:#fff;border:1px solid #d9e1ee;border-radius:8px;padding:16px;margin:0 0 18px}
    code{background:#edf2f8;border-radius:4px;padding:2px 5px}
  </style>
</head>
<body>
  <header>
    <h1>二维挂谷运动探针交接包</h1>
    <div class="sub">${pkg.package_id} · 状态：${pkg.status} · 只用于 3 秒运动试跑，不是最终出片批准</div>
  </header>
  <main>
    <div class="stats">
      <div class="stat"><b>${pkg.total_shots}</b><span>镜头</span></div>
      <div class="stat"><b>${pkg.total_probe_duration_seconds}</b><span>探针总秒数</span></div>
      <div class="stat"><b>${timeline.full_runtime_seconds}</b><span>原计划秒数</span></div>
      <div class="stat"><b>0</b><span>已生成片段</span></div>
      <div class="stat"><b>QA</b><span>待运动监看</span></div>
    </div>
    <div class="note">
      本包把 34 个镜头压成每镜头 3 秒运动探针，用来先检查女贝老师与三位学生身份、数学图形、中文台词节奏、标签稳定和相邻剪辑。真实视频模型命令配置前，状态保持 <code>clips_pending</code>。
    </div>
    <div class="links">
      <a href="RUNBOOK.md">运行说明</a>
      <a href="submission_queue.csv">提交队列 CSV</a>
      <a href="submission_payload.jsonl">提交载荷 JSONL</a>
      <a href="execution_plan.json">执行计划</a>
      <a href="execution_commands.sh">执行命令</a>
      <a href="../one_pass_full_video_handoff_kakeya_byleth_2026-07-31/full_video_queue_viewer.html">一次性全时长包</a>
      <a href="../real_frame_preview_kakeya_byleth_2026-07-28/asset_viewer.html">返回真实帧审查页</a>
    </div>
    <table>
      <thead><tr><th>#</th><th>镜头</th><th>时长</th><th>主要检查</th><th>三帧</th><th>文本资产</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </main>
</body>
</html>`;
}

const previewManifest = readJson(previewManifestPath);
if (previewManifest.pending_shots.length > 0) {
  throw new Error(`Preview still has pending shots: ${previewManifest.pending_shots.join(", ")}`);
}

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outShotsRoot, { recursive: true });

const hardRejects = [
  "女贝老师变成男贝、成年导师、普通学生、现代教师或泛化黑袍女巫。",
  "艾黛尔、莉丝缇亚、梅尔赛德斯在可见互动镜头中被替换、消失或变成名单外学生。",
  "一单位木剑失去端点或长度意义。",
  "三尖内摆线、凸三角形、佩龙树、δ 管、α 夹角或面积/维数结论被画错或变成装饰。",
  "出现现代 UI、字幕、水印、标志、乱码文字或课堂幻灯片感界面。",
  "镜头没有遵守 start_frame -> key_frame -> end_frame 三帧链，或剪出状态没有稳定停留。",
  "把数学影响讲成松散生活比喻，而不是细管重叠、最大平均、波包、组合几何。",
];

const shots = [];
const timelineClips = [];
const payloadLines = [];
const csvRows = [
  ["order", "shot_id", "probe_duration_seconds", "full_duration_seconds", "model_prompt", "negative_prompt", "start_frame", "key_frame", "end_frame", "expected_clip", "primary_check"],
];
let fullRuntime = 0;

for (const shotEntry of previewManifest.shots) {
  const id = shotEntry.id;
  const order = Number(String(id).slice(2));
  const sourceDir = path.join(previewRoot, shotEntry.folder);
  const folder = shotFolderName(order, id);
  const targetDir = path.join(outShotsRoot, folder);
  const metadata = readJson(path.join(sourceDir, "metadata.json"));

  for (const file of ["start_frame.png", "key_frame.png", "end_frame.png", "prompt.md", "model_prompt.md", "negative_prompt.md", "frame_spec.md"]) {
    copyFile(path.join(sourceDir, file), path.join(targetDir, file));
  }
  writeJson(path.join(targetDir, "metadata.json"), compactChineseMetadata(metadata));

  const fullDuration = Number(metadata["时长秒"] || shotEntry.duration_seconds || 0);
  fullRuntime += fullDuration;
  const packageDir = `shots/${folder}`;
  const expectedClip = `clips/probes/${id}_probe.mp4`;
  const primaryCheck = metadata["主要检查"] || "检查三帧链、身份、数学图形和剪辑衔接。";
  const shot = {
    id,
    order,
    status: "monitor_required",
    review_status: "motion_probe_pending",
    package_dir: packageDir,
    duration_seconds: probeDuration,
    probe_duration_seconds: probeDuration,
    full_duration_seconds: fullDuration,
    prompt: "model_prompt.md",
    audit_prompt: "prompt.md",
    negative_prompt: "negative_prompt.md",
    expected_clip: expectedClip,
    edit_in: metadata["剪入"] || "",
    edit_out: metadata["剪出"] || "",
    audio_anchor: metadata["中文台词或音频锚点"] || "",
    primary_check: primaryCheck,
    model_notes: [
      "使用 model_prompt.md 作为模型输入，prompt.md 作为审查合同。",
      "只生成 3 秒运动探针，不生成全时长正片。",
      "探针必须保持三帧链、角色身份、数学图形和中文台词节奏。",
      "探针通过 clip-level QA 后，才允许生成全时长镜头。",
    ],
    reject_if: Array.isArray(metadata["拒绝条件"]) ? metadata["拒绝条件"] : [],
  };
  shots.push(shot);
  timelineClips.push({
    order,
    shot: id,
    duration_seconds: probeDuration,
    full_duration_seconds: fullDuration,
    expected_clip: expectedClip,
    edit_in: shot.edit_in,
    edit_out: shot.edit_out,
  });
  payloadLines.push(JSON.stringify({
    order,
    shot_id: id,
    probe_duration_seconds: probeDuration,
    model_prompt: `${packageDir}/model_prompt.md`,
    audit_prompt: `${packageDir}/prompt.md`,
    negative_prompt: `${packageDir}/negative_prompt.md`,
    start_frame: `${packageDir}/start_frame.png`,
    key_frame: `${packageDir}/key_frame.png`,
    end_frame: `${packageDir}/end_frame.png`,
    expected_clip: expectedClip,
    primary_check: primaryCheck,
  }));
  csvRows.push([
    order,
    id,
    probeDuration,
    fullDuration,
    `${packageDir}/model_prompt.md`,
    `${packageDir}/negative_prompt.md`,
    `${packageDir}/start_frame.png`,
    `${packageDir}/key_frame.png`,
    `${packageDir}/end_frame.png`,
    expectedClip,
    primaryCheck,
  ]);
}

const manifest = {
  version: 1,
  project: "女贝老师二维挂谷专题",
  project_id: "KAK-BYLETH-LECTURE",
  package_id: packageId,
  package_type: "monitor_handoff",
  status: "superseded_by_one_pass_budget_policy",
  created_at: "2026-07-31",
  source_preview_package: "delivery/real_frame_preview_kakeya_byleth_2026-07-28",
  total_shots: shots.length,
  total_probe_duration_seconds: shots.length * probeDuration,
  total_duration_seconds: shots.length * probeDuration,
  full_runtime_seconds: fullRuntime,
  model_target: "image-to-video model with start/key/end frame support",
  model_cli_required_env: "VIDEO_MODEL_CLI_ARGV_JSON",
  students: ["艾黛尔", "莉丝缇亚", "梅尔赛德斯"],
  status_note: "用户已决定不单独付费生成 3 秒运动探针；本包仅作历史/备用检查，当前主提交路径是 one_pass_full_video_handoff。",
  hard_rejects: hardRejects,
  shots,
};

const timeline = {
  package_id: packageId,
  mode: "motion_probe",
  total_duration_seconds: shots.length * probeDuration,
  full_runtime_seconds: fullRuntime,
  clips: timelineClips,
};

const continuity = {
  package_id: packageId,
  status: "monitor_required",
  pairs: shots.slice(0, -1).map((shot, index) => ({
    from: shot.id,
    to: shots[index + 1].id,
    decision: "probe_required",
    check: "探针生成后检查剪出状态、画面方向、数学图形和角色位置是否能接上下一镜头。",
  })),
};

writeJson(path.join(outRoot, "package_manifest.json"), manifest);
writeJson(path.join(outRoot, "timeline.json"), timeline);
writeJson(path.join(outRoot, "continuity_report.json"), continuity);
writeText(path.join(outRoot, "submission_payload.jsonl"), payloadLines.join("\n"));
writeText(path.join(outRoot, "submission_queue.csv"), csvRows.map((row) => row.map(csvCell).join(",")).join("\n"));
writeJson(path.join(outRoot, "execution_plan.json"), {
  package_id: packageId,
  strategy: "motion_probe",
  status: "superseded_by_one_pass_budget_policy",
  note: "用户已决定不单独付费生成 3 秒运动探针；保留本包只作历史/备用检查，不作为当前主提交路径。",
  preferred_package: "delivery/one_pass_full_video_handoff_kakeya_byleth_2026-07-31",
  total_shots: shots.length,
  probe_duration_seconds: probeDuration,
  total_probe_duration_seconds: shots.length * probeDuration,
  full_runtime_seconds: fullRuntime,
});
writeText(path.join(outRoot, "execution_commands.sh"), `#!/usr/bin/env bash
set -euo pipefail

echo "This 3-second probe package is superseded by the one-pass full-duration package."
echo "Use ../one_pass_full_video_handoff_kakeya_byleth_2026-07-31/ instead."
exit 0
`);
fs.chmodSync(path.join(outRoot, "execution_commands.sh"), 0o755);
writeText(path.join(outRoot, "RUNBOOK.md"), `# 运动探针包说明

Package: \`${packageId}\`
Status: \`superseded_by_one_pass_budget_policy\`

用户已明确：没有预算单独生成 3 秒运动探针，必须一次性做好。

因此本包只保留为历史/备用检查面板；当前主交付请使用：

- \`../one_pass_full_video_handoff_kakeya_byleth_2026-07-31/full_video_queue_viewer.html\`
- \`../real_frame_preview_kakeya_byleth_2026-07-28/asset_viewer.html\`

本包已同步最新真实帧和最新中文模型提示词，不再包含旧版 SH001 手部冷开场合同。
`);
writeText(path.join(outRoot, "model_target_profile.md"), `# 模型目标配置

Package: \`${packageId}\`
Status: \`superseded_by_one_pass_budget_policy\`

本包已被一次性全时长包取代；保留以下配置仅供历史参考。若重新启用探针，需要一个支持 image-to-video 的模型或 CLI，并且最好支持三帧约束：

- \`start_frame.png\`：起始构图
- \`key_frame.png\`：动作峰值或数学证明峰值
- \`end_frame.png\`：剪出状态
- \`model_prompt.md\`：模型输入
- \`negative_prompt.md\`：负面约束

执行前设置：

\`\`\`bash
VIDEO_MODEL_CLI_ARGV_JSON='["video-cli","i2v","--prompt","{model_prompt}","--negative","{negative_prompt}","--first","{start_frame}","--key","{key_frame}","--last","{end_frame}","--duration","{duration}","--out","{output}"]'
\`\`\`

当前没有检测到真实模型命令，因此只生成 dry-run 队列。
`);
writeText(path.join(outRoot, "clip_qa_checklist.md"), `# 运动探针 QA 清单

每个 3 秒探针都必须通过以下检查后，才可进入全时长生成。

- 身份：女贝老师不变成男贝、成年导师、普通学生或现代讲师。
- 学生：艾黛尔、莉丝缇亚、梅尔赛德斯只在指定互动镜头出现，不被替换。
- 数学：一单位木剑、三尖内摆线、凸三角形、佩龙树、δ 管、α 角、面积/维数结论保持正确。
- 三帧链：动作从 start_frame 进入 key_frame，再稳定落到 end_frame。
- 中文：不生成字幕、乱码或现代 UI；台词节奏只作为音频锚点。
- 剪辑：每个探针最后 0.5 秒必须能接下一镜头。

判定值：

- \`motion_review_passed\`
- \`monitor_required\`
- \`blocked_needs_revision\`
`);
writeText(path.join(outRoot, "motion_queue_viewer.html"), renderQueueViewer(manifest, timeline));

console.log(JSON.stringify({
  package: outRoot,
  shots: shots.length,
  probe_duration_seconds: probeDuration,
  total_probe_duration_seconds: shots.length * probeDuration,
  full_runtime_seconds: fullRuntime,
}, null, 2));
