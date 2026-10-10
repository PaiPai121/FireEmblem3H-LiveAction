const fs = require("fs");
const path = require("path");

const root = process.cwd();
const htmlPath = path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/index.html");
const htmlDir = path.dirname(htmlPath);
const reportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_gallery_link_audit_2026-07-28.json");

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function main() {
  if (!fs.existsSync(htmlPath)) throw new Error(`Missing gallery HTML: ${htmlPath}`);
  const html = fs.readFileSync(htmlPath, "utf8");
  const links = [];
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const raw = decodeHtml(match[1]);
    if (/^(https?:|mailto:|#)/.test(raw)) continue;
    links.push(raw);
  }

  const missing = [];
  const checked = [];
  for (const raw of links) {
    const target = path.resolve(htmlDir, raw);
    const exists = fs.existsSync(target);
    checked.push({ raw, target: path.relative(root, target), exists });
    if (!exists) missing.push({ raw, target: path.relative(root, target) });
  }

  const requiredText = [
    "下游提交包",
    "真实视频剪辑 QA",
    "静帧 Animatic 参考片",
    "monitor_handoff_ready_clips_pending",
    "clips_pending",
    "scene09_v3_frame_animatic_2026-07-27.mp4",
    "Frames present: 126/126",
  ];
  const missingText = requiredText.filter((text) => !html.includes(text));

  const report = {
    date: "2026-07-28",
    html: path.relative(root, htmlPath),
    links_checked: checked.length,
    missing_links: missing,
    required_text_missing: missingText,
    decision: missing.length || missingText.length ? "blocked_needs_revision" : "gallery_file_access_passed",
  };
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (missing.length || missingText.length) process.exit(1);
}

main();
