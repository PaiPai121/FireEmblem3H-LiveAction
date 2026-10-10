#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "specials", "kakeya_byleth_lecture");
const previewRoot = path.join(projectRoot, "delivery", "real_frame_preview_kakeya_byleth_2026-07-28");
const previewManifestPath = path.join(previewRoot, "package_manifest.json");
const progressionAuditPath = path.join(projectRoot, "production_system", "reviews", "frame_progression_audit_2026-08-01.json");
const outRoot = path.join(projectRoot, "delivery", "one_pass_full_video_handoff_kakeya_byleth_2026-07-31");
const outShotsRoot = path.join(outRoot, "shots");
const packageId = "one_pass_full_video_handoff_kakeya_byleth_2026-07-31";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

function escHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readableTextMirrorName(fileName) {
  return fileName.replace(/\.(md|json)$/i, ".html");
}

function writeReadableTextMirror(sourcePath, title, kind, usageNote) {
  const raw = fs.readFileSync(sourcePath, "utf8");
  const targetPath = path.join(path.dirname(sourcePath), readableTextMirrorName(path.basename(sourcePath)));
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escHtml(title)}</title>
  <style>
    body{margin:0;background:#f6f8fb;color:#1f2733;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    main{max-width:980px;margin:0 auto;padding:28px 22px 48px}
    h1{margin:0 0 8px;font-size:24px;letter-spacing:0}.meta{margin:0 0 18px;color:#596779;line-height:1.6;font-weight:700}
    .note{border:1px solid #d6dfeb;border-left:4px solid #174ea6;background:#fff;border-radius:8px;padding:12px 14px;margin:0 0 18px;line-height:1.65}
    pre{white-space:pre-wrap;word-break:break-word;background:#fff;border:1px solid #d6dfeb;border-radius:8px;padding:18px;line-height:1.7;font-size:14px;font-family:"SFMono-Regular",Consolas,"Liberation Mono",monospace}
    a{color:#174ea6;font-weight:800;text-decoration:none}
  </style>
</head>
<body>
  <main>
    <h1>${escHtml(title)}</h1>
    <div class="meta">类型：${escHtml(kind)} · 编码：UTF-8 · 原始文件：<a href="${escHtml(path.basename(sourcePath))}">${escHtml(path.basename(sourcePath))}</a></div>
    <div class="note">${escHtml(usageNote)}</div>
    <pre>${escHtml(raw)}</pre>
  </main>
</body>
</html>
`;
  writeText(targetPath, html);
  return targetPath;
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

function compactChineseMetadata(metadata) {
  return {
    "镜头编号": metadata["镜头编号"],
    "顺序": metadata["顺序"],
    "生成时长秒": metadata["时长秒"],
    "提交状态": "one_pass_full_length_pending",
    "成片作用": metadata["成片作用"],
    "可见主体": metadata["可见主体"],
    "摄影机": metadata["摄影机"],
    "剪入": metadata["剪入"],
    "剪出": metadata["剪出"],
    "中文台词或音频锚点": metadata["中文台词或音频锚点"],
    "逐句台词": metadata["逐句台词"],
    "主要检查": metadata["主要检查"],
    "三帧变化审计": metadata.frame_progression || metadata["frame_progression"] || null,
    "角色身份视觉审查": metadata.identity_visual_audit || metadata["identity_visual_audit"] || metadata["角色身份视觉审查"] || null,
    "拒绝条件": metadata["拒绝条件"],
    "批准说明": "预算限制下不做 3 秒探针，直接提交完整时长。生成后必须逐镜头 QA；不通过的镜头再单独重生。",
  };
}

function identityDecision(identityAudit) {
  return String(identityAudit?.decision || identityAudit?.["decision"] || "").toLowerCase();
}

function identityBlocksVideo(identityAudit) {
  const decision = identityDecision(identityAudit);
  return Boolean(identityAudit) && (
    decision.includes("blocked") ||
    decision.includes("reject") ||
    decision.includes("rejected")
  );
}

function identityStatusLabel(identityAudit) {
  if (identityBlocksVideo(identityAudit)) return "角色身份需重生";
  if (!identityAudit) return "未阻塞";
  const decision = identityDecision(identityAudit);
  if (decision.includes("monitor")) return "已替换，需监看";
  return "已替换";
}

function renderQueueViewer(pkg, timeline) {
  const rows = pkg.shots.map((shot) => `
    <tr>
      <td>${shot.order}</td>
      <td><a href="${shot.package_dir}/model_prompt.html">${shot.id}</a></td>
      <td>${shot.duration_seconds}s</td>
      <td>${shot.frame_progression?.zh_status || "未审计"}</td>
      <td>${identityStatusLabel(shot.identity_visual_audit)}</td>
      <td>${shot.primary_check}</td>
      <td><a href="${shot.package_dir}/start_frame.png">起始</a> · <a href="${shot.package_dir}/key_frame.png">关键</a> · <a href="${shot.package_dir}/end_frame.png">结束</a></td>
      <td><a class="primary" href="${shot.package_dir}/model_prompt.html">给模型用：主提示词</a> · <a class="primary" href="${shot.package_dir}/negative_prompt.html">给模型用：负面约束</a><br><span class="secondary"><a href="${shot.package_dir}/prompt.html">审查合同</a> · <a href="${shot.package_dir}/frame_spec.html">分镜规格</a> · <a href="${shot.package_dir}/metadata.html">元数据</a></span></td>
    </tr>`).join("");
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>二维挂谷一次性全时长视频生产包</title>
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
    a.primary{color:#174ea6;font-weight:900}.secondary{display:inline-block;margin-top:6px;color:#657386}
    code{background:#edf2f8;border-radius:4px;padding:2px 5px}.danger{border-left:4px solid #b23b3b}
  </style>
</head>
<body>
  <header>
    <h1>二维挂谷一次性全时长视频生产包</h1>
    <div class="sub">${pkg.package_id} · 状态：${pkg.status} · 预算限制：不做付费探针，直接全时长生成</div>
  </header>
  <main>
    <div class="stats">
      <div class="stat"><b>${pkg.total_shots}</b><span>镜头</span></div>
      <div class="stat"><b>${pkg.total_duration_seconds}</b><span>总秒数</span></div>
      <div class="stat"><b>102</b><span>输入三帧</span></div>
      <div class="stat"><b>0</b><span>已生成片段</span></div>
      <div class="stat"><b>QA</b><span>生成后逐镜头审查</span></div>
    </div>
    <div class="note danger">
      这是一次性全时长提交包：每镜头直接按完整时长生成，不再花钱做 3 秒探针。风险控制靠更强的模型提示词、负面提示词和生成后逐镜头 QA；不合格镜头再单独重生。
    </div>
    <div class="note">
      提交视频模型时只用两类文本：<b>给模型用：主提示词</b> 和 <b>给模型用：负面约束</b>。分镜规格、审查合同、元数据是给人和 QA 脚本核对用的，不是首选模型输入。所有文本都有 UTF-8 HTML 阅读版，避免 macOS 直接预览 Markdown 时乱码。
    </div>
    <div class="links">
      <a href="RUNBOOK.md">运行说明</a>
      <a href="submission_queue.csv">提交队列 CSV</a>
      <a href="submission_payload.jsonl">提交载荷 JSONL</a>
      <a href="execution_plan.json">执行计划</a>
      <a href="execution_commands.sh">执行命令</a>
      <a href="one_pass_qa_checklist.md">生成后 QA</a>
      <a href="../real_frame_preview_kakeya_byleth_2026-07-28/asset_viewer.html">返回真实帧审查页</a>
    </div>
    <table>
      <thead><tr><th>#</th><th>镜头</th><th>时长</th><th>三帧变化</th><th>角色身份</th><th>主要检查</th><th>三帧</th><th>文本资产</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </main>
</body>
</html>`;
}

const previewManifest = readJson(previewManifestPath);
const progressionAudit = fs.existsSync(progressionAuditPath) ? readJson(progressionAuditPath) : null;
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
  "中文台词节奏变成字幕、乱码、现代 UI、课件页或屏幕说明字。",
  "镜头没有遵守 start_frame -> key_frame -> end_frame 三帧链，或结束帧不能稳定停留。",
  "把数学影响讲成松散生活比喻，而不是细管重叠、最大平均、波包、组合几何。",
];

const shots = [];
const timelineClips = [];
const payloadLines = [];
const csvRows = [
  ["order", "shot_id", "duration_seconds", "model_prompt", "negative_prompt", "start_frame", "key_frame", "end_frame", "expected_clip", "frame_progression_status", "identity_status", "primary_check"],
];
let totalDuration = 0;

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
  writeReadableTextMirror(
    path.join(targetDir, "model_prompt.md"),
    `${id} 给模型用：主提示词`,
    "模型主提示词",
    "真正提交给视频模型的正文提示词。网页优先打开这个 UTF-8 阅读版；实际提交时仍使用旁边的 model_prompt.md 原文。"
  );
  writeReadableTextMirror(
    path.join(targetDir, "negative_prompt.md"),
    `${id} 给模型用：负面约束`,
    "负面提示词",
    "真正提交给视频模型的负面约束。实际提交时仍使用旁边的 negative_prompt.md 原文。"
  );
  writeReadableTextMirror(
    path.join(targetDir, "prompt.md"),
    `${id} 审查资料：提示词合同`,
    "审查提示词",
    "这是给人和 QA 脚本核对用的提示词合同，不是首选模型输入。模型提交入口请看 model_prompt.md。"
  );
  writeReadableTextMirror(
    path.join(targetDir, "frame_spec.md"),
    `${id} 审查资料：分镜规格`,
    "分镜规格",
    "这是导演、数学和画面审查用的镜头规格，不是模型输入。"
  );
  writeReadableTextMirror(
    path.join(targetDir, "metadata.json"),
    `${id} 后台资料：元数据`,
    "元数据",
    "这是脚本、manifest 和网页使用的后台数据，通常不用手动复制给视频模型。"
  );

  const duration = Number(metadata["时长秒"] || shotEntry.duration_seconds || 0);
  if (!duration) throw new Error(`${id} has no full duration`);
  totalDuration += duration;
  const packageDir = `shots/${folder}`;
  const expectedClip = `clips/full/${id}.mp4`;
  const primaryCheck = metadata["主要检查"] || "检查三帧链、身份、数学图形和剪辑衔接。";
  const frameProgression = metadata.frame_progression || metadata["frame_progression"] || null;
  const identityAudit = metadata.identity_visual_audit || metadata["identity_visual_audit"] || metadata["角色身份视觉审查"] || null;
  const identityBlocked = identityBlocksVideo(identityAudit);
  const shotStatus = identityBlocked ? "blocked_needs_identity_regeneration" : "monitor_required";
  const reviewStatus = identityBlocked ? "blocked_needs_identity_regeneration" : "one_pass_full_length_pending";
  const shot = {
    id,
    order,
    status: shotStatus,
    review_status: reviewStatus,
    package_dir: packageDir,
    duration_seconds: duration,
    prompt: "model_prompt.md",
    audit_prompt: "prompt.md",
    negative_prompt: "negative_prompt.md",
    expected_clip: expectedClip,
    edit_in: metadata["剪入"] || "",
    edit_out: metadata["剪出"] || "",
    audio_anchor: metadata["中文台词或音频锚点"] || "",
    primary_check: primaryCheck,
    frame_progression: frameProgression,
    identity_visual_audit: identityAudit,
    model_notes: [
      "预算限制：不做付费 3 秒探针，直接生成完整时长。",
      "使用 model_prompt.md 作为模型输入，prompt.md 作为审查合同。",
      "必须保持 start_frame -> key_frame -> end_frame 三帧链。",
      "生成后必须逐镜头 QA；失败镜头单独重生，不整片重生。",
    ],
    reject_if: Array.isArray(metadata["拒绝条件"]) ? metadata["拒绝条件"] : [],
  };
  shots.push(shot);
  timelineClips.push({
    order,
    shot: id,
    duration_seconds: duration,
    expected_clip: expectedClip,
    edit_in: shot.edit_in,
    edit_out: shot.edit_out,
  });
  payloadLines.push(JSON.stringify({
    order,
    shot_id: id,
    duration_seconds: duration,
    model_prompt: `${packageDir}/model_prompt.md`,
    audit_prompt: `${packageDir}/prompt.md`,
    negative_prompt: `${packageDir}/negative_prompt.md`,
    start_frame: `${packageDir}/start_frame.png`,
    key_frame: `${packageDir}/key_frame.png`,
    end_frame: `${packageDir}/end_frame.png`,
    expected_clip: expectedClip,
    primary_check: primaryCheck,
    frame_progression_status: frameProgression?.zh_status || "未审计",
    identity_status: identityStatusLabel(identityAudit),
  }));
  csvRows.push([
    order,
    id,
    duration,
    `${packageDir}/model_prompt.md`,
    `${packageDir}/negative_prompt.md`,
    `${packageDir}/start_frame.png`,
    `${packageDir}/key_frame.png`,
    `${packageDir}/end_frame.png`,
    expectedClip,
    frameProgression?.zh_status || "未审计",
    identityStatusLabel(identityAudit),
    primaryCheck,
  ]);
}

const manifest = {
  version: 1,
  project: "女贝老师二维挂谷专题",
  project_id: "KAK-BYLETH-LECTURE",
  package_id: packageId,
  package_type: "monitor_handoff",
  submission_strategy: "one_pass_full_length",
  status: shots.some((shot) => shot.status === "blocked_needs_identity_regeneration")
    ? "blocked_needs_identity_regeneration"
    : progressionAudit?.summary?.low_progression_count ? "frame_progression_review_required" : "clips_pending",
  created_at: "2026-07-31",
  source_preview_package: "delivery/real_frame_preview_kakeya_byleth_2026-07-28",
  total_shots: shots.length,
  total_duration_seconds: totalDuration,
  model_target: "image-to-video model with start/key/end frame support",
  model_cli_required_env: "VIDEO_MODEL_CLI_ARGV_JSON",
  students: ["艾黛尔", "莉丝缇亚", "梅尔赛德斯"],
  budget_policy: "No paid probe generation. Submit full duration once; regenerate only failed shots after QA.",
  status_note: progressionAudit?.summary?.low_progression_count
    ? `真实三帧和中文模型提示词齐全，但帧变化审计发现 ${progressionAudit.summary.low_progression_count} 个低帧差镜头、${progressionAudit.summary.watch_count} 个运动监看镜头；预算限制下一次性生成前应先修订这些三帧锚点。`
    : shots.some((shot) => shot.status === "blocked_needs_identity_regeneration")
      ? "真实三帧存在，但角色身份视觉审查发现阻塞镜头；阻塞镜头不得提交视频模型，必须先重生角色帧。"
      : "真实三帧和中文模型提示词齐全；本包用于一次性全时长 AI 视频生成。没有配置真实视频模型命令前，保持 clips_pending。",
  character_identity_gate: {
    status: shots.some((shot) => shot.status === "blocked_needs_identity_regeneration") ? "blocked_needs_identity_regeneration" : "not_blocked",
    blocked_shots: shots.filter((shot) => shot.status === "blocked_needs_identity_regeneration").map((shot) => shot.id),
    review: "production_system/reviews/character_identity_visual_audit_2026-08-02.md",
    contact_sheet: "production_system/reviews/character_identity_contact_sheet_2026-08-02.png",
  },
  frame_progression_audit: progressionAudit ? {
    status: progressionAudit.status,
    path: "production_system/reviews/frame_progression_audit_2026-08-01.json",
    summary: progressionAudit.summary,
  } : null,
  hard_rejects: hardRejects,
  shots,
};

const timeline = {
  package_id: packageId,
  mode: "one_pass_full_length",
  total_duration_seconds: totalDuration,
  clips: timelineClips,
};

const continuity = {
  package_id: packageId,
  status: "post_generation_qa_required",
  pairs: shots.slice(0, -1).map((shot, index) => ({
    from: shot.id,
    to: shots[index + 1].id,
    decision: "check_after_generation",
    check: "全时长生成后检查剪出状态、画面方向、数学图形和角色位置是否能接上下一镜头。",
  })),
};

writeJson(path.join(outRoot, "package_manifest.json"), manifest);
writeJson(path.join(outRoot, "timeline.json"), timeline);
writeJson(path.join(outRoot, "continuity_report.json"), continuity);
writeJson(path.join(outRoot, "execution_plan.json"), {
  package_id: packageId,
  strategy: "one_pass_full_length",
  status: "clips_pending",
  total_shots: shots.length,
  total_duration_seconds: totalDuration,
  required_env: "VIDEO_MODEL_CLI_ARGV_JSON",
  frame_progression_audit: manifest.frame_progression_audit,
  steps: [
    "Set VIDEO_MODEL_CLI_ARGV_JSON to the real image-to-video command template.",
    "Run execution_commands.sh from this package directory, or submit rows from submission_queue.csv manually.",
    "Generate each expected clip under clips/full/.",
    "Run post-generation QA using one_pass_qa_checklist.md.",
    "Regenerate failed shots individually; do not regenerate the whole sequence unless multiple adjacent clips share the same upstream issue.",
  ],
});
writeText(path.join(outRoot, "submission_payload.jsonl"), payloadLines.join("\n"));
function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
writeText(path.join(outRoot, "submission_queue.csv"), csvRows.map((row) => row.map(csvCell).join(",")).join("\n"));
writeText(path.join(outRoot, "execution_commands.sh"), `#!/usr/bin/env bash
set -euo pipefail

if [ -z "\${VIDEO_MODEL_CLI_ARGV_JSON:-}" ]; then
  echo "VIDEO_MODEL_CLI_ARGV_JSON is not set. See model_target_profile.md." >&2
  exit 2
fi

echo "This package is ready for one-pass full-duration submission, but no local video model command has been configured."
echo "Use submission_payload.jsonl or submission_queue.csv with your image-to-video provider."
`);
fs.chmodSync(path.join(outRoot, "execution_commands.sh"), 0o755);
writeText(path.join(outRoot, "RUNBOOK.md"), `# 一次性全时长生成运行说明

Package: \`${packageId}\`
Status: \`clips_pending\`

## 当前状态

- 34 个镜头、102 张 start/key/end 输入帧已经打包。
- 帧变化审计：\`${manifest.frame_progression_audit?.status || "not_available"}\`。
- 低帧差镜头：${manifest.frame_progression_audit?.summary?.low_progression_count ?? "?"}。
- 运动监看镜头：${manifest.frame_progression_audit?.summary?.watch_count ?? "?"}。
- 还没有本地视频模型命令，所以本包保持 \`clips_pending\`。

## 提交方式

1. 打开 \`submission_queue.csv\` 或 \`submission_payload.jsonl\`。
2. 对每个镜头提交包内三帧：\`start_frame.png\`、\`key_frame.png\`、\`end_frame.png\`。
3. 使用同目录 \`model_prompt.md\` 和 \`negative_prompt.md\`。
4. 输出到 \`clips/full/SH###.mp4\`。
5. 生成后按 \`one_pass_qa_checklist.md\` 逐镜头审查。

## 拒绝整片通过的情况

- 女贝老师身份漂移、变男贝或变成现代教师。
- 三位学生被替换。
- 数学图形闪烁、乱码、尺度错误或变成装饰。
- 起始帧、关键帧、结束帧没有形成动作链。
- 相邻镜头剪接不通。
`);
writeText(path.join(outRoot, "model_target_profile.md"), `# 模型目标配置

Package: \`${packageId}\`
Status: \`clips_pending\`
Strategy: \`one_pass_full_length\`

预算限制：不做付费 3 秒探针。每个镜头直接按完整时长生成，失败镜头后续单独重生。

需要一个支持 image-to-video 的模型或 CLI，并且最好支持三帧约束：

- \`start_frame.png\`：起始构图
- \`key_frame.png\`：动作峰值或数学证明峰值
- \`end_frame.png\`：剪出状态
- \`model_prompt.md\`：模型输入
- \`negative_prompt.md\`：负面约束

执行前设置：

\`\`\`bash
VIDEO_MODEL_CLI_ARGV_JSON='["video-cli","i2v","--prompt","{model_prompt}","--negative","{negative_prompt}","--first","{start_frame}","--key","{key_frame}","--last","{end_frame}","--duration","{duration}","--out","{output}"]'
\`\`\`
`);
writeText(path.join(outRoot, "one_pass_qa_checklist.md"), `# 一次性全时长生成后 QA 清单

每个完整镜头生成后必须检查：

- 身份：女贝老师不变成男贝、成年导师、普通学生或现代讲师。
- 学生：艾黛尔、莉丝缇亚、梅尔赛德斯只在指定互动镜头出现，不被替换。
- 数学：一单位木剑、三尖内摆线、凸三角形、佩龙树、δ 管、α 角、面积/维数结论保持正确。
- 三帧链：动作从 start_frame 进入 key_frame，再稳定落到 end_frame。
- 中文：不生成字幕、乱码或现代 UI；台词节奏只作为音频锚点。
- 剪辑：每个镜头最后 0.5 秒必须能接下一镜头。

处理策略：

- 通过：标记 \`motion_review_passed\`。
- 小问题：先尝试剪辑裁切或局部重生该镜头。
- 大问题：该镜头标记 \`blocked_needs_revision\`，不要整片重生。
`);
writeText(path.join(outRoot, "full_video_queue_viewer.html"), renderQueueViewer(manifest, timeline));

console.log(JSON.stringify({
  package: outRoot,
  shots: shots.length,
  total_duration_seconds: totalDuration,
}, null, 2));
