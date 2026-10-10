#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-07-28";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const reviewDir = path.join(reportDir, "generated_clip_motion_review_frames_2026-07-28");
const reportJsonPath = path.join(reportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json");
const reportMdPath = path.join(reportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.md");
const reviewHtmlPath = path.join(packageDir, "clip_motion_review_assets.html");
const reviewHtmlMirrorPath = path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/clip_motion_review_assets.html");
const clipReviewHtmlPath = path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/clip_review.html");

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const scene09ChineseTitles = {
  Shot025: "规则与目标确立",
  Shot025A: "战场地形插入",
  Shot026: "贝雷特分配职责",
  Shot026B: "青狮观察战场",
  Shot026C: "第一轮推进",
  Shot027: "亚修架设掩护线",
  Shot027B: "黑鹫第一波压上",
  Shot027C: "首次接敌",
  Shot027D: "菲力克斯延迟侧切",
  Shot028: "支援线保持纪律",
  Shot028B: "黑鹫稳住中央",
  Shot028C: "菲力克斯看见后续路线",
  Shot029: "青狮西侧轮转",
  Shot029C: "库罗德读出两个缺口",
  Shot029D: "库罗德逼退亚修",
  Shot029B: "金鹿全面施压",
  Shot030: "菲力克斯过度前压的诱惑",
  Shot030B: "路线触发特写",
  Shot030C: "伊古纳兹与金鹿切断路线",
  Shot031: "贝雷特叫停菲力克斯",
  Shot031B: "贝雷特双线指挥",
  Shot032: "杜笃与梅尔塞德斯重建盾线",
  Shot032A: "雅妮特扬尘掩护",
  Shot032B: "青狮守住平台下方",
  Shot032C: "黑鹫反击金鹿",
  Shot032D: "三线战场关系证明",
  Shot032E: "贝雷特利用混战空隙",
  Shot032F: "菲力克斯与亚修判定休伯特出局",
  Shot032G: "库罗德与雷欧妮牵制多洛缇雅和贝尔娜提塔",
  Shot033: "帝弥托利在平台前克制收势",
  Shot033B: "贝雷特下令切向教师目标",
  Shot033C: "亚修压制汉尼曼路线",
  Shot033D: "英谷莉特切断玛努艾拉路线",
  Shot034C: "菲力克斯挡下斐迪南",
  Shot034D: "贝雷特中断教师目标反扑",
  Shot034B: "空教师目标裁定",
  Shot034E: "金鹿高光后收势",
  Shot034F: "黑鹫高光后收势",
  Shot034G: "青狮核心险胜收势",
  Shot034: "全场胜负关系落定",
  Shot035: "菲力克斯的敬意",
  Shot036: "帝弥托利战后余韵",
};

function displayTitleForShot(shot) {
  const shotNumber = String(shot || "").replace(/^Shot/, "");
  const localized = scene09ChineseTitles[shot];
  return localized ? `镜头${shotNumber}：${localized}` : `镜头${shotNumber || shot}`;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function relFromRoot(file) {
  return path.relative(root, file);
}

function fileSignature(file) {
  const stat = fs.statSync(file);
  return {
    size_bytes: stat.size,
    mtime_ms: Math.trunc(stat.mtimeMs),
    sha256: crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
  };
}

function sameSignature(a, b) {
  return Boolean(a && b &&
    a.size_bytes === b.size_bytes &&
    a.mtime_ms === b.mtime_ms &&
    a.sha256 &&
    b.sha256 &&
    a.sha256 === b.sha256);
}

function allFramesExist(frames = {}) {
  return ["start", "mid", "end"].every((label) => {
    const frame = frames[label];
    return frame && fs.existsSync(path.join(root, frame));
  });
}

function relFromHtml(file, fromHtml = reviewHtmlPath) {
  return path.relative(path.dirname(fromHtml), file);
}

function run(argv) {
  return cp.spawnSync(argv[0], argv.slice(1), { encoding: "utf8" });
}

function ffprobe(file) {
  const result = run([
    "ffprobe",
    "-v",
    "error",
    "-print_format",
    "json",
    "-show_format",
    "-show_streams",
    file,
  ]);
  if (result.status !== 0) {
    return { ok: false, error: result.stderr.trim() || `ffprobe exited ${result.status}` };
  }
  try {
    return { ok: true, data: JSON.parse(result.stdout) };
  } catch (error) {
    return { ok: false, error: `ffprobe JSON parse failed: ${error.message}` };
  }
}

function extractFrame(clip, atSeconds, outFile) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const result = run([
    "ffmpeg",
    "-y",
    "-ss",
    atSeconds.toFixed(3),
    "-i",
    clip,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    outFile,
  ]);
  if (result.status !== 0 || !fs.existsSync(outFile)) {
    return { ok: false, error: result.stderr.trim() || `ffmpeg exited ${result.status}` };
  }
  return { ok: true };
}

function loadMetadata(shot) {
  const file = path.join(packageDir, shot.package_dir, "metadata.json");
  if (!fs.existsSync(file)) return {};
  return readJson(file);
}

function reviewTimes(duration) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 6;
  return {
    start: Math.min(0.35, Math.max(0, safeDuration - 0.1)),
    mid: Math.max(0.1, safeDuration / 2),
    end: Math.max(0.1, safeDuration - 0.55),
  };
}

function buildRow(shot, previousById) {
  const expectedClip = path.join(root, shot.expected_clip);
  const metadata = loadMetadata(shot);
  const previous = previousById.get(shot.id) || {};
  const prefix = `${String(shot.order).padStart(2, "0")}_${shot.shot}`;
  const row = {
    order: shot.order,
    shot: shot.shot,
    id: shot.id,
    expected_clip: shot.expected_clip,
    clip_exists: fs.existsSync(expectedClip),
    status: "missing_clip",
    visible_named_only: shot.visible_named_only || metadata.visible_named_only || [],
    primary_check: shot.primary_check || metadata.primary_check || "",
    review_frames: {},
    clip_signature: null,
    reused_existing_frames: false,
    problems: [],
  };

  if (!row.clip_exists) return row;
  row.clip_signature = fileSignature(expectedClip);

  const probed = ffprobe(expectedClip);
  if (!probed.ok) {
    row.status = "ffprobe_failed";
    row.problems.push(probed.error);
    return row;
  }

  const duration = Number(probed.data.format?.duration || 0);
  const times = reviewTimes(duration);
  row.duration_seconds = duration;
  if (
    sameSignature(previous.clip_signature, row.clip_signature) &&
    previous.status === "review_frames_ready" &&
    allFramesExist(previous.review_frames)
  ) {
    row.status = "review_frames_ready";
    row.review_frames = previous.review_frames;
    row.reused_existing_frames = true;
    return row;
  }

  row.status = "extracting";
  for (const [label, time] of Object.entries(times)) {
    const outFile = path.join(reviewDir, `${prefix}_${label}.jpg`);
    const extracted = extractFrame(expectedClip, time, outFile);
    if (!extracted.ok) {
      row.problems.push(`${label}: ${extracted.error}`);
      continue;
    }
    row.review_frames[label] = relFromRoot(outFile);
  }

  row.status = row.problems.length ? "frame_extraction_failed" : "review_frames_ready";
  return row;
}

function renderHtml(report, htmlPath = reviewHtmlPath) {
  const cards = report.rows.map((row) => {
    const frames = ["start", "mid", "end"].map((label) => {
      const file = row.review_frames[label] ? path.join(root, row.review_frames[label]) : null;
      const body = file && fs.existsSync(file)
        ? `<a href="${esc(relFromHtml(file, htmlPath))}"><img src="${esc(relFromHtml(file, htmlPath))}" alt="${esc(row.shot)} ${label}"></a>`
        : `<div class="pending">${esc(label)} ${row.clip_exists ? "MISSING" : "CLIP PENDING"}</div>`;
      return `<figure>${body}<figcaption>${esc(label)}</figcaption></figure>`;
    }).join("");
    return `
      <article>
        <header>
          <div><p>${String(row.order).padStart(2, "0")} · ${esc(row.id)}</p><h2>${esc(displayTitleForShot(row.shot))}</h2></div>
          <strong>${esc(row.status)}</strong>
        </header>
        <p><b>Expected clip:</b> ${esc(row.expected_clip)}</p>
        <p><b>Allowed readable humans:</b> ${esc(row.visible_named_only.join(", ") || "none")}</p>
        <p><b>Primary check:</b> ${esc(row.primary_check)}</p>
        <div class="frames">${frames}</div>
        ${row.problems.length ? `<ul>${row.problems.map((problem) => `<li>${esc(problem)}</li>`).join("")}</ul>` : ""}
      </article>
    `;
  }).join("");
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Scene09 V3 Clip Motion Review Assets</title>
    <style>
      :root { color-scheme: dark; --bg:#101112; --panel:#191b1d; --line:#34393f; --text:#f5f1e9; --muted:#bdb6aa; --accent:#d5b56f; --bad:#c76d6d; }
      * { box-sizing: border-box; }
      body { margin:0; background:var(--bg); color:var(--text); font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
      header.top { position:sticky; top:0; z-index:2; padding:18px 24px; background:rgba(16,17,18,.96); border-bottom:1px solid var(--line); }
      h1 { margin:0 0 8px; font-size:26px; letter-spacing:0; }
      h2 { margin:0; font-size:20px; letter-spacing:0; }
      p, li, figcaption { color:var(--muted); line-height:1.5; }
      a { color:var(--accent); }
      main { display:grid; gap:18px; padding:18px 24px 28px; }
      article { border:1px solid var(--line); border-radius:8px; background:var(--panel); padding:16px; }
      article > header { display:flex; justify-content:space-between; gap:16px; border-bottom:1px solid var(--line); padding-bottom:12px; margin-bottom:12px; }
      article > header p { margin:0 0 4px; color:var(--accent); font-size:12px; }
      strong { color:var(--accent); text-align:right; }
      .frames { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin-top:12px; }
      figure { margin:0; }
      img, .pending { width:100%; aspect-ratio:16/9; border:1px solid var(--line); border-radius:8px; background:#0b0d0e; }
      img { display:block; object-fit:cover; }
      .pending { display:grid; place-items:center; color:var(--bad); background:repeating-linear-gradient(135deg,#211213,#211213 12px,#2a1718 12px,#2a1718 24px); }
      @media (max-width: 760px) { .frames { grid-template-columns:1fr; } article > header { display:block; } strong { display:block; margin-top:8px; text-align:left; } }
    </style>
  </head>
  <body>
    <header class="top">
      <h1>Scene09 V3 Clip Motion Review Assets</h1>
      <p>Decision: ${esc(report.decision)}. Extracted clips: ${report.extracted_clips}/${report.expected_clips}. These start/mid/end frames are Codex internal QA evidence after real video generation.</p>
      <p><a href="${esc(relFromHtml(reportJsonPath, htmlPath))}">JSON report</a> · <a href="${esc(relFromHtml(reportMdPath, htmlPath))}">Markdown report</a> · <a href="${esc(relFromHtml(clipReviewHtmlPath, htmlPath))}">clip review</a></p>
    </header>
    <main>${cards}</main>
  </body>
</html>
`;
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const previousReport = fs.existsSync(reportJsonPath) ? readJson(reportJsonPath) : { rows: [] };
  const previousById = new Map((previousReport.rows || []).map((row) => [row.id, row]));
  const rows = manifest.shots.map((shot) => buildRow(shot, previousById));
  const missing = rows.filter((row) => !row.clip_exists);
  const failed = rows.filter((row) => row.clip_exists && row.status !== "review_frames_ready");
  const ready = rows.filter((row) => row.status === "review_frames_ready");
  const decision = missing.length === rows.length
    ? "clips_pending"
    : missing.length || failed.length
      ? "clip_motion_review_assets_blocked"
      : "clip_motion_review_assets_ready_for_self_audit";
  const report = {
    date,
    package_manifest: relFromRoot(manifestPath),
    output_dir: relFromRoot(reviewDir),
    html: relFromRoot(reviewHtmlPath),
    expected_clips: rows.length,
    extracted_clips: ready.length,
    missing_clips: missing.length,
    failed_clips: failed.length,
    decision,
    rows,
  };

  writeJson(reportJsonPath, report);
  writeText(reportMdPath, [
    "# Scene09 V3 Clip Motion Review Assets",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    "",
    "## Counts",
    "",
    `- Expected clips: ${rows.length}`,
    `- Extracted clips: ${ready.length}`,
    `- Missing clips: ${missing.length}`,
    `- Failed clips: ${failed.length}`,
    "",
    "## Missing Clips",
    "",
    missing.length ? missing.map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot}: \`${row.expected_clip}\``).join("\n") : "- none",
    "",
    "## Failed Extractions",
    "",
    failed.length ? failed.map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot}: ${row.problems.join("; ")}`).join("\n") : "- none",
    "",
  ].join("\n"));
  writeText(reviewHtmlPath, renderHtml(report, reviewHtmlPath));
  writeText(reviewHtmlMirrorPath, renderHtml(report, reviewHtmlMirrorPath));

  process.stdout.write(`${JSON.stringify({
    decision,
    expected_clips: rows.length,
    extracted_clips: ready.length,
    missing_clips: missing.length,
    failed_clips: failed.length,
    report_json: relFromRoot(reportJsonPath),
    report_md: relFromRoot(reportMdPath),
    html: relFromRoot(reviewHtmlPath),
    mirror_html: relFromRoot(reviewHtmlMirrorPath),
  }, null, 2)}\n`);
  if (decision === "clip_motion_review_assets_blocked") process.exit(1);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
