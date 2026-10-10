#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const htmlPath = path.join(packageDir, "clip_motion_review_assets.html");
const mirrorHtmlPath = path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/clip_motion_review_assets.html");
const manifestPath = path.join(packageDir, "package_manifest.json");
const reportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_motion_review_assets_html_audit_2026-08-03.json");

function decodeHtml(value) {
  return value
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
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const raw = decodeHtml(match[1]);
    if (/^(https?:|mailto:|#|javascript:)/.test(raw)) continue;
    links.push(raw.split("#")[0]);
  }
  return links.filter(Boolean);
}

function auditOne(file, manifest) {
  if (!fs.existsSync(file)) throw new Error(`Missing clip motion review assets HTML: ${file}`);
  const html = fs.readFileSync(file, "utf8");
  const htmlDir = path.dirname(file);
  const checked = [];
  const missing = [];
  for (const raw of localLinks(html)) {
    const target = path.resolve(htmlDir, raw);
    const exists = fs.existsSync(target);
    checked.push({ raw, target: path.relative(root, target), exists });
    if (!exists) missing.push({ raw, target: path.relative(root, target) });
  }

  const expectedShots = Number(manifest.total_shots || (manifest.shots || []).length);
  const cards = (html.match(/<article>/g) || []).length;
  const problems = [];
  if (cards !== expectedShots) problems.push(`motion review cards ${cards}/${expectedShots}`);
  if (!html.includes("Scene09 V3 Clip Motion Review Assets")) problems.push("missing page title");
  if (!html.includes("镜头025：规则与目标确立")) problems.push("missing Chinese motion-review title for Shot025");
  if (!html.includes("镜头032：杜笃与梅尔塞德斯重建盾线")) problems.push("missing Chinese motion-review title for Shot032");
  if (!html.includes("镜头034B：空教师目标裁定")) problems.push("missing Chinese motion-review title for Shot034B");
  if (/<h2>\s*Shot\d+[A-Z]?\s*<\/h2>/.test(html)) problems.push("clip motion review cards still use bare English Shot titles");
  if (!html.includes("clip review")) problems.push("missing clip review link");
  return {
    html: path.relative(root, file),
    links_checked: checked.length,
    missing_links: missing,
    expected_shots: expectedShots,
    rendered_cards: cards,
    problems,
  };
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const audits = [auditOne(htmlPath, manifest), auditOne(mirrorHtmlPath, manifest)];
  const missing = audits.flatMap((audit) => audit.missing_links.map((link) => ({ ...link, html: audit.html })));
  const problems = audits.flatMap((audit) => audit.problems.map((problem) => `${audit.html}: ${problem}`));
  const report = {
    date: "2026-08-03",
    html: path.relative(root, htmlPath),
    mirror_html: path.relative(root, mirrorHtmlPath),
    package_manifest: path.relative(root, manifestPath),
    links_checked: audits.reduce((sum, audit) => sum + audit.links_checked, 0),
    missing_links: missing,
    expected_shots: audits[0]?.expected_shots || 0,
    rendered_cards: audits.map((audit) => ({ html: audit.html, cards: audit.rendered_cards })),
    problems,
    decision: missing.length || problems.length
      ? "clip_motion_review_assets_html_failed"
      : "clip_motion_review_assets_html_passed",
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (report.decision !== "clip_motion_review_assets_html_passed") process.exit(1);
}

main();
