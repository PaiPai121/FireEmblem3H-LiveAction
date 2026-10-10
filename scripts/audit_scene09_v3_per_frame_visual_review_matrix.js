#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const htmlPath = path.join(packageDir, "per_frame_visual_review_matrix.html");
const jsonPath = path.join(packageDir, "per_frame_visual_review_matrix.json");
const csvPath = path.join(packageDir, "per_frame_visual_review_matrix.csv");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(reportDir, "scene09_v3_per_frame_visual_review_matrix_audit_2026-08-03.json");

function decodeHtml(value) {
  return String(value || "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function localLinks(html) {
  const links = [];
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = decodeHtml(match[1]);
    if (/^(https?:|mailto:|#|javascript:)/.test(raw)) continue;
    const clean = raw.split("#")[0];
    if (clean) links.push(clean);
  }
  return links;
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function main() {
  const problems = [];
  const missingLinks = [];
  if (!fs.existsSync(htmlPath)) problems.push(`missing ${rel(htmlPath)}`);
  if (!fs.existsSync(jsonPath)) problems.push(`missing ${rel(jsonPath)}`);
  if (!fs.existsSync(csvPath)) problems.push(`missing ${rel(csvPath)}`);
  const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, "utf8") : "";
  const json = fs.existsSync(jsonPath) ? readJson(jsonPath) : { rows: [] };

  for (const raw of localLinks(html)) {
    const target = path.resolve(packageDir, raw);
    if (!fs.existsSync(target)) missingLinks.push({ raw, target: rel(target) });
  }

  const cards = (html.match(/class="frame-card/g) || []).length;
  const imageRefs = (html.match(/<img\b/g) || []).length;
  const rows = Array.isArray(json.rows) ? json.rows : [];
  const decisions = new Set(rows.map((row) => row.decision));
  if (!html.includes("Scene09 逐帧视觉审核矩阵")) problems.push("missing Chinese page title");
  if (!html.includes("镜头032：杜笃与梅尔塞德斯重建盾线")) problems.push("missing Dedue/Mercedes Chinese title");
  if (!html.includes("镜头034B：空教师目标裁定")) problems.push("missing Shot034B Chinese title");
  if (!html.includes("Codex visual observation")) problems.push("missing Codex visual observation field");
  if (!html.includes("monitor_required")) problems.push("missing monitor_required warning");
  if (cards !== 126) problems.push(`frame cards ${cards}/126`);
  if (imageRefs !== 126) problems.push(`image refs ${imageRefs}/126`);
  if (rows.length !== 126) problems.push(`json rows ${rows.length}/126`);
  if (json.decision !== "per_frame_visual_review_matrix_passed_monitor_required") {
    problems.push(`json decision ${json.decision || "missing"} is not per_frame_visual_review_matrix_passed_monitor_required`);
  }
  if ([...decisions].some((decision) => !String(decision).startsWith("visual_triage_passed_monitor_required"))) {
    problems.push("one or more frame rows are not visual triage passed monitor required");
  }
  if (missingLinks.length) problems.push(`missing local links ${missingLinks.length}`);

  const report = {
    date: "2026-08-03",
    html: rel(htmlPath),
    json: rel(jsonPath),
    csv: rel(csvPath),
    links_checked: localLinks(html).length,
    missing_links: missingLinks,
    frame_cards: cards,
    image_refs: imageRefs,
    json_rows: rows.length,
    problems,
    decision: problems.length ? "per_frame_visual_review_matrix_audit_failed" : "per_frame_visual_review_matrix_audit_passed",
  };
  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (problems.length) process.exit(1);
}

main();
