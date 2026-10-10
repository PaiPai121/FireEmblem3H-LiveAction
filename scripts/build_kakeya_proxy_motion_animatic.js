#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const packageRoot = path.join(
  repoRoot,
  "specials",
  "kakeya_byleth_lecture",
  "delivery",
  "motion_probe_handoff_kakeya_byleth_2026-07-31"
);
const manifestPath = path.join(packageRoot, "package_manifest.json");
const clipsRoot = path.join(packageRoot, "clips", "proxy_animatic");
const finalOut = path.join(packageRoot, "proxy_motion_animatic.mp4");
const concatList = path.join(packageRoot, "proxy_concat_list.txt");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

function run(argv) {
  const result = spawnSync(argv[0], argv.slice(1), { stdio: "pipe", encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`${argv.join(" ")}\n${result.stderr || result.stdout}`);
  }
}

function renderClip(shot) {
  const shotDir = path.join(packageRoot, shot.package_dir);
  const out = path.join(clipsRoot, `${shot.id}_proxy.mp4`);
  const args = [
    "ffmpeg",
    "-y",
    "-loop", "1", "-t", "1", "-i", path.join(shotDir, "start_frame.png"),
    "-loop", "1", "-t", "1", "-i", path.join(shotDir, "key_frame.png"),
    "-loop", "1", "-t", "1", "-i", path.join(shotDir, "end_frame.png"),
    "-filter_complex",
    [
      "[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24,format=yuv420p,setpts=PTS-STARTPTS[v0]",
      "[1:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24,format=yuv420p,setpts=PTS-STARTPTS[v1]",
      "[2:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24,format=yuv420p,setpts=PTS-STARTPTS[v2]",
      "[v0][v1][v2]concat=n=3:v=1:a=0[outv]",
    ].join(";"),
    "-map", "[outv]",
    "-t", "3",
    "-an",
    "-movflags", "+faststart",
    out,
  ];
  run(args);
  return out;
}

function renderViewer(manifest, clips) {
  const rows = manifest.shots.map((shot) => `
    <article>
      <h2>${shot.id}</h2>
      <video controls preload="metadata" src="clips/proxy_animatic/${shot.id}_proxy.mp4"></video>
      <p>${shot.primary_check}</p>
      <div class="links">
        <a href="${shot.package_dir}/model_prompt.md">模型提示词</a>
        <a href="${shot.package_dir}/metadata.json">元数据</a>
      </div>
    </article>`).join("");
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>二维挂谷代理运动样片</title>
  <style>
    body{margin:0;background:#f5f7fb;color:#1f2733;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    header{padding:28px 32px;background:#fff;border-bottom:1px solid #d9e1ee}
    h1{margin:0;font-size:34px}.sub{color:#657386;font-weight:700;margin-top:8px}
    main{padding:24px 32px}.hero{background:#fff;border:1px solid #d9e1ee;border-radius:8px;padding:16px;margin-bottom:20px}
    .hero video{width:100%;max-height:70vh;background:#000;border-radius:6px}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:14px}
    article{background:#fff;border:1px solid #d9e1ee;border-radius:8px;padding:12px}article h2{margin:0 0 8px}
    article video{width:100%;background:#000;border-radius:6px}p{color:#445066}.links{display:flex;gap:8px;flex-wrap:wrap}
    a{color:#1456a8;font-weight:800;text-decoration:none}
  </style>
</head>
<body>
  <header>
    <h1>二维挂谷代理运动样片</h1>
    <div class="sub">34 个 3 秒三帧代理 clip · 总样片 102 秒 · 不是 AI 视频出片批准</div>
  </header>
  <main>
    <section class="hero">
      <h2>总预览</h2>
      <video controls preload="metadata" src="proxy_motion_animatic.mp4"></video>
      <p>这个视频把 start/key/end 三帧各停 1 秒顺接，用来看节奏、数学顺序和剪辑流。真正出片仍需视频模型生成和运动 QA。</p>
    </section>
    <section class="grid">${rows}</section>
  </main>
</body>
</html>`;
}

const manifest = readJson(manifestPath);
fs.mkdirSync(clipsRoot, { recursive: true });

const rendered = [];
for (const shot of manifest.shots) {
  rendered.push(renderClip(shot));
}

writeText(concatList, rendered.map((clip) => `file '${clip.replace(/'/g, "'\\''")}'`).join("\n"));
run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concatList, "-c", "copy", "-movflags", "+faststart", finalOut]);

writeText(path.join(packageRoot, "proxy_animatic_viewer.html"), renderViewer(manifest, rendered));

const updated = {
  ...manifest,
  proxy_animatic: {
    status: "generated_proxy_preview_not_ai_video",
    clip_count: rendered.length,
    total_duration_seconds: 102,
    final_preview: "proxy_motion_animatic.mp4",
    viewer: "proxy_animatic_viewer.html",
    note: "本地三帧顺接代理样片，只用于节奏和衔接预览；不能替代视频模型运动 QA。",
  },
};
writeText(path.join(packageRoot, "package_manifest.json"), JSON.stringify(updated, null, 2));

console.log(JSON.stringify({
  clips: rendered.length,
  final_preview: finalOut,
  viewer: path.join(packageRoot, "proxy_animatic_viewer.html"),
}, null, 2));
