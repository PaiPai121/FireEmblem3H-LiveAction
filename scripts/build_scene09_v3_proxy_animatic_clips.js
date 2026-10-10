#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-07-28";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const outputDir = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/proxy_animatic_clips");
const concatListPath = path.join(outputDir, "scene09_v3_proxy_animatic_edit.concat.txt");
const proxyEditPath = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_proxy_animatic_edit_2026-07-28.mp4");
const reportJsonPath = path.join(root, `production_system/scene09_v3_attrition_package/scene09_v3_proxy_animatic_clips_${date}.json`);
const reportMdPath = path.join(root, `production_system/scene09_v3_attrition_package/scene09_v3_proxy_animatic_clips_${date}.md`);

function usage() {
  return [
    "Usage:",
    "  node scripts/build_scene09_v3_proxy_animatic_clips.js [--force]",
    "",
    "Builds reference-only per-shot animatic mp4 proxies from packaged start/key/end frames.",
    "These files are never written to expected_clip and must not be treated as generated AI video clips.",
  ].join("\n");
}

function parseArgs(argv) {
  const options = { force: false };
  for (const arg of argv) {
    if (arg === "--force") options.force = true;
    else if (arg === "--help" || arg === "-h") {
      process.stdout.write(`${usage()}\n`);
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function rel(file) {
  return path.relative(root, file);
}

function quoteConcatPath(file) {
  return file.replace(/'/g, "'\\''");
}

function shotProxyName(shot) {
  return `${String(shot.order).padStart(2, "0")}_${shot.shot}_proxy_animatic.mp4`;
}

function framePaths(shot) {
  const shotDir = path.join(packageDir, shot.package_dir);
  return ["start_frame.png", "key_frame.png", "end_frame.png"].map((name) => path.join(shotDir, name));
}

function writeShotConcatFile(shot, frames) {
  const duration = Number(shot.duration_seconds || 6) / 3;
  const concatPath = path.join(outputDir, `${String(shot.order).padStart(2, "0")}_${shot.shot}_proxy.concat.txt`);
  const lines = [];
  for (const frame of frames) {
    lines.push(`file '${quoteConcatPath(frame)}'`);
    lines.push(`duration ${duration.toFixed(3)}`);
  }
  lines.push(`file '${quoteConcatPath(frames[frames.length - 1])}'`);
  writeText(concatPath, `${lines.join("\n")}\n`);
  return concatPath;
}

function runFfmpeg(args) {
  const result = cp.spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (result.error) throw result.error;
  return {
    status: result.status,
    ok: result.status === 0,
    stderr_tail: String(result.stderr || "").trim().split(/\n/).slice(-12).join("\n"),
    stdout_tail: String(result.stdout || "").trim().split(/\n/).slice(-12).join("\n"),
  };
}

function buildProxyClip(shot, options) {
  const frames = framePaths(shot);
  const missingFrames = frames.filter((file) => !fs.existsSync(file));
  const output = path.join(outputDir, shotProxyName(shot));
  const concatPath = writeShotConcatFile(shot, frames);
  if (missingFrames.length) {
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      status: "missing_frames",
      missing_frames: missingFrames.map(rel),
      proxy_clip: rel(output),
      expected_clip: shot.expected_clip,
    };
  }
  if (fs.existsSync(output) && !options.force) {
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      status: "already_exists",
      proxy_clip: rel(output),
      concat_list: rel(concatPath),
      expected_clip: shot.expected_clip,
    };
  }
  const ffmpeg = runFfmpeg([
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatPath,
    "-vf", "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
    "-r", "24",
    "-an",
    "-movflags", "+faststart",
    output,
  ]);
  return {
    order: shot.order,
    shot: shot.shot,
    id: shot.id,
    status: ffmpeg.ok ? "proxy_ready" : "ffmpeg_failed",
    proxy_clip: rel(output),
    concat_list: rel(concatPath),
    expected_clip: shot.expected_clip,
    ffmpeg_status: ffmpeg.status,
    ffmpeg_error_tail: ffmpeg.ok ? "" : ffmpeg.stderr_tail || ffmpeg.stdout_tail,
  };
}

function buildProxyEdit(rows) {
  const ready = rows.filter((row) => ["proxy_ready", "already_exists"].includes(row.status));
  if (!ready.length) {
    return { status: "no_proxy_clips_ready" };
  }
  const lines = ready
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((row) => `file '${quoteConcatPath(path.join(root, row.proxy_clip))}'`);
  writeText(concatListPath, `${lines.join("\n")}\n`);
  const ffmpeg = runFfmpeg([
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatListPath,
    "-c", "copy",
    "-movflags", "+faststart",
    proxyEditPath,
  ]);
  return {
    status: ffmpeg.ok ? "proxy_edit_ready" : "proxy_edit_failed",
    proxy_edit: rel(proxyEditPath),
    concat_list: rel(concatListPath),
    proxy_clips: ready.length,
    ffmpeg_status: ffmpeg.status,
    ffmpeg_error_tail: ffmpeg.ok ? "" : ffmpeg.stderr_tail || ffmpeg.stdout_tail,
  };
}

function renderMarkdown(report) {
  const failed = report.rows.filter((row) => !["proxy_ready", "already_exists"].includes(row.status));
  return [
    "# Scene09 V3 Proxy Animatic Clips",
    "",
    `Date: ${report.date}`,
    `Decision: ${report.decision}`,
    "",
    "These are reference-only timing clips built from each shot's packaged `start_frame.png`, `key_frame.png`, and `end_frame.png`. They are not AI video-model outputs, are not saved to `expected_clip`, and cannot satisfy clip-level motion QA.",
    "",
    "## Summary",
    "",
    `- Total shots: ${report.total_shots}`,
    `- Proxy clips ready: ${report.proxy_clips_ready}`,
    `- Failed proxy clips: ${failed.length}`,
    `- Proxy edit: \`${report.proxy_edit?.proxy_edit || "not built"}\``,
    "",
    "## Failed Rows",
    "",
    failed.length ? failed.map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot}: ${row.status}`).join("\n") : "- none",
    "",
    "## Proxy Rows",
    "",
    ...report.rows.map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot}: ${row.status} -> \`${row.proxy_clip}\`; real expected clip remains \`${row.expected_clip}\``),
    "",
  ].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const shots = [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  fs.mkdirSync(outputDir, { recursive: true });
  const rows = shots.map((shot) => buildProxyClip(shot, options));
  const proxyEdit = buildProxyEdit(rows);
  const readyCount = rows.filter((row) => ["proxy_ready", "already_exists"].includes(row.status)).length;
  const failedCount = rows.length - readyCount;
  const report = {
    date,
    package_manifest: rel(manifestPath),
    decision: failedCount || proxyEdit.status !== "proxy_edit_ready"
      ? "proxy_animatic_blocked"
      : "proxy_animatic_reference_ready",
    total_shots: rows.length,
    proxy_clips_ready: readyCount,
    proxy_clips_failed: failedCount,
    output_dir: rel(outputDir),
    proxy_edit: proxyEdit,
    rows,
    report_json: rel(reportJsonPath),
    report_md: rel(reportMdPath),
  };
  writeJson(reportJsonPath, report);
  writeText(reportMdPath, renderMarkdown(report));
  process.stdout.write(`${JSON.stringify({
    decision: report.decision,
    total_shots: report.total_shots,
    proxy_clips_ready: report.proxy_clips_ready,
    proxy_clips_failed: report.proxy_clips_failed,
    proxy_edit: report.proxy_edit?.proxy_edit || null,
    report_json: report.report_json,
    report_md: report.report_md,
  }, null, 2)}\n`);
  if (report.decision !== "proxy_animatic_reference_ready") process.exit(1);
}

main();
