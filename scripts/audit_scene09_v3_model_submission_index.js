#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const batchesDir = path.join(packageDir, "model_submission_batches");
const htmlPath = path.join(batchesDir, "index.html");
const batchManifestPath = path.join(batchesDir, "batch_manifest.json");
const reportPath = path.join(
  root,
  "production_system/scene09_v3_attrition_package/scene09_v3_model_submission_index_audit_2026-08-01.json",
);

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

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function parseJsonl(file) {
  return readText(file)
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function articleBlock(html, customId) {
  const startToken = `<article class="shot-card" id="${customId}"`;
  const start = html.indexOf(startToken);
  if (start === -1) return "";
  const next = html.indexOf('<article class="shot-card"', start + startToken.length);
  return html.slice(start, next === -1 ? html.length : next);
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

function main() {
  if (!fs.existsSync(htmlPath)) throw new Error(`Missing model submission index: ${htmlPath}`);
  if (!fs.existsSync(batchManifestPath)) throw new Error(`Missing batch manifest: ${batchManifestPath}`);

  const html = fs.readFileSync(htmlPath, "utf8");
  const manifest = readJson(batchManifestPath);
  const checked = [];
  const missing = [];

  for (const raw of localLinks(html)) {
    const target = path.resolve(batchesDir, raw);
    const exists = fs.existsSync(target);
    checked.push({ raw, target: path.relative(root, target), exists });
    if (!exists) missing.push({ raw, target: path.relative(root, target) });
  }

  const batches = manifest.batches || [];
  const expectedShots = batches.reduce((sum, batch) => sum + Number(batch.rows || 0), 0);
  const shotCards = (html.match(/class="shot-card"/g) || []).length;
  const batchSections = (html.match(/class="batch"/g) || []).length;
  const problems = [];
  if (shotCards !== expectedShots) problems.push(`shot cards ${shotCards}/${expectedShots}`);
  if (batchSections !== batches.length) problems.push(`batch sections ${batchSections}/${batches.length}`);
  if (!html.includes("EP02 Scene09 Model Submission Batches")) problems.push("missing page title");
  if (!html.includes("镜头025：规则与目标确立")) problems.push("missing Chinese model submission title for Shot025");
  if (!html.includes("镜头032：杜笃与梅尔塞德斯重建盾线")) problems.push("missing Chinese model submission title for Shot032");
  if (!html.includes("镜头034B：空教师目标裁定")) problems.push("missing Chinese model submission title for Shot034B");
  if (/<h3>\s*Shot\d+[A-Z]?\s*<span>/.test(html)) problems.push("model submission shot cards still use bare English Shot titles");
  if (!html.includes("Battle Ledger After")) problems.push("missing battle ledger panels");
  const requiredLedgerHeadings = [
    "Alive / Safe After",
    "Visible But No Active Combat After",
    "Active / Controlling After",
    "Limited But Not Defeated After",
    "Defeated / Removed After",
    "Captured / Objective-Defeated After",
    "Stood Down / Post-Battle After",
    "Must Not Return Active",
    "Changed This Shot",
    "No-Active-Combat Line",
  ];
  for (const heading of requiredLedgerHeadings) {
    if (!html.includes(heading)) problems.push(`missing ledger heading ${heading}`);
  }
  if (!html.includes("expected_downloads.csv")) problems.push("missing expected downloads link");
  if (!html.includes("No unnamed extras")) problems.push("missing no-unnamed-extras lock");
  for (const phrase of [
    "structurally prepared but locked until <code>full_duration_release_gate</code> reaches <code>full_duration_release_passed</code>",
    "prepared_locked_probe_release_pending",
    "Submit motion probes first",
    "<code>motion_probe_full_duration_release.json</code>",
  ]) {
    if (!html.includes(phrase)) problems.push(`missing release-lock phrase ${phrase}`);
  }

  const ledgerFields = [
    "alive_safe_after",
    "visible_but_no_active_combat_after",
    "active_or_objective_after",
    "limited_after",
    "defeated_removed_after",
    "captured_objective_defeated_after",
    "stood_down_post_battle_after",
    "must_not_return_active_after",
    "changed_this_shot",
    "no_active_combat_line",
  ];
  for (const batch of batches) {
    const rows = parseJsonl(path.join(packageDir, batch.jsonl));
    for (const row of rows) {
      const block = articleBlock(html, row.custom_id);
      if (!block) {
        problems.push(`${row.custom_id}: missing shot card`);
        continue;
      }
      for (const heading of requiredLedgerHeadings) {
        if (!block.includes(heading)) problems.push(`${row.custom_id}: missing ledger heading ${heading}`);
      }
      for (const field of ledgerFields) {
        const value = String(row[field] || "none");
        if (!block.includes(value)) problems.push(`${row.custom_id}: missing ledger value ${field}=${value}`);
      }
    }
  }

  const report = {
    date: "2026-08-01",
    html: path.relative(root, htmlPath),
    batch_manifest: path.relative(root, batchManifestPath),
    links_checked: checked.length,
    missing_links: missing,
    shot_cards: shotCards,
    batch_sections: batchSections,
    problems,
    decision: missing.length || problems.length
      ? "model_submission_index_failed"
      : "model_submission_index_file_access_passed",
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (report.decision !== "model_submission_index_file_access_passed") process.exit(1);
}

main();
