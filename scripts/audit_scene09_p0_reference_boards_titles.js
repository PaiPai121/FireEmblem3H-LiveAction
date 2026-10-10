#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const boardDir = path.join(root, "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/reference_boards");
const indexPath = path.join(boardDir, "index.html");
const reportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_p0_reference_boards_title_audit_2026-08-03.json");

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function localLinks(html, baseFile) {
  const links = [];
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const raw = decodeHtml(match[1]);
    if (/^(https?:|mailto:|#|javascript:)/.test(raw)) continue;
    links.push({ raw, target: path.resolve(path.dirname(baseFile), raw.split("#")[0]) });
  }
  return links.filter((link) => link.raw);
}

function main() {
  if (!fs.existsSync(indexPath)) throw new Error(`Missing reference board index: ${indexPath}`);
  const htmlFiles = fs.readdirSync(boardDir)
    .filter((name) => name.endsWith(".html"))
    .map((name) => path.join(boardDir, name));
  const problems = [];
  const missingLinks = [];
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    if (/<h1>\s*Shot\d+[A-Z]?\b/.test(html)) problems.push(`${path.basename(file)}: bare English h1 shot title`);
    if (/<strong>\s*Shot\d+[A-Z]?\s*-/.test(html)) problems.push(`${path.basename(file)}: bare English index shot title`);
    if (/<strong>\s*Shot\d+[A-Z]?\./.test(html)) problems.push(`${path.basename(file)}: bare English subframe label`);
    if (/<title>\s*Shot\d+[A-Z]?\b/.test(html)) problems.push(`${path.basename(file)}: bare English document title`);
    for (const phrase of ["First Moving Enemy Wave", "Byleth Calls Cut Teachers", "support system"]) {
      if (html.includes(phrase)) problems.push(`${path.basename(file)}: stale phrase ${phrase}`);
    }
    for (const link of localLinks(html, file)) {
      if (!fs.existsSync(link.target)) {
        missingLinks.push({ file: path.relative(root, file), raw: link.raw, target: path.relative(root, link.target) });
      }
    }
  }

  const indexHtml = fs.readFileSync(indexPath, "utf8");
  for (const required of [
    "镜头027B：黑鹫第一波压上",
    "镜头032：杜笃与梅尔塞德斯重建盾线",
    "镜头033B：贝雷特下令切向教师目标",
  ]) {
    if (!indexHtml.includes(required)) problems.push(`index missing ${required}`);
  }

  const report = {
    date: "2026-08-03",
    board_dir: path.relative(root, boardDir),
    html_files: htmlFiles.length,
    missing_links: missingLinks,
    problems,
    decision: problems.length || missingLinks.length
      ? "p0_reference_boards_titles_failed"
      : "p0_reference_boards_titles_passed",
  };
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (report.decision !== "p0_reference_boards_titles_passed") process.exit(1);
}

main();
