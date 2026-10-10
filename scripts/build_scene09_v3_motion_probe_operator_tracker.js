#!/usr/bin/env node
/* Build an operator-facing tracker for Scene09 motion probe submission and returns. */

const fs = require("fs");
const path = require("path");

const packageDir = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const manifestPath = path.join(packageDir, "motion_probe_provider_bundles/motion_probe_provider_bundles_manifest.json");
const expectedMapPath = path.join(packageDir, "motion_probe_return_intake/expected_probe_map.csv");
const htmlPath = path.join(packageDir, "motion_probe_operator_tracker.html");
const jsonPath = path.join(packageDir, "motion_probe_operator_tracker.json");
const csvPath = path.join(packageDir, "motion_probe_operator_tracker.csv");
const reportDir = "production_system/scene09_v3_attrition_package";
const reportJsonPath = path.join(reportDir, "scene09_v3_motion_probe_operator_tracker_2026-08-03.json");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === "\"" && next === "\"") {
        cell += "\"";
        i += 1;
      } else if (char === "\"") {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === "\"") {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body
    .filter((cells) => cells.length && cells.some(Boolean))
    .map((cells) => Object.fromEntries(header.map((key, index) => [key, cells[index] || ""])));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, "\"\"")}"` : text;
}

function htmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (!Number.isFinite(value) || value <= 0) return "unknown";
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

fs.mkdirSync(reportDir, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const expectedRows = parseCsv(fs.readFileSync(expectedMapPath, "utf8"));
const expectedByCustomId = new Map(expectedRows.map((row) => [row.custom_id, row]));
const problems = [];
const trackerRows = [];
const batchSummaries = [];

if ((manifest.bundles || []).length !== 7) problems.push(`expected 7 probe bundles, got ${(manifest.bundles || []).length}`);
if (expectedRows.length !== 42) problems.push(`expected 42 expected probe rows, got ${expectedRows.length}`);

for (const bundle of manifest.bundles || []) {
  const customIds = bundle.custom_ids || [];
  const zipPath = path.join(packageDir, bundle.zip || "");
  const missingCustomIds = customIds.filter((customId) => !expectedByCustomId.has(customId));
  if (!fs.existsSync(zipPath)) problems.push(`missing probe zip: ${zipPath}`);
  if (customIds.length !== Number(bundle.rows || customIds.length)) {
    problems.push(`${bundle.batch_id} custom_id count does not match rows`);
  }
  if (missingCustomIds.length) {
    problems.push(`${bundle.batch_id} custom ids absent from expected_probe_map: ${missingCustomIds.join(", ")}`);
  }
  const batchRows = customIds.map((customId) => expectedByCustomId.get(customId)).filter(Boolean);
  const returnedCounts = batchRows.reduce((sum, row) => {
    const candidate = path.join(packageDir, row.returned_mp4_dir || "", row.expected_probe_filename || "");
    return sum + (fs.existsSync(candidate) ? 1 : 0);
  }, 0);
  batchSummaries.push({
    batch_id: bundle.batch_id,
    zip: path.join(packageDir, bundle.zip || ""),
    zip_bytes: bundle.zip_digest?.bytes || 0,
    zip_sha256: bundle.zip_digest?.sha256 || "",
    rows: customIds.length,
    returned_mp4_ready: returnedCounts,
    first_custom_id: customIds[0] || "",
    last_custom_id: customIds[customIds.length - 1] || "",
    return_dir: batchRows[0] ? path.join(packageDir, batchRows[0].returned_mp4_dir || "") : "",
    dry_run_command: batchRows[0]?.dry_run_command || "",
    apply_command: batchRows[0]?.apply_command || "",
  });
  for (const row of batchRows) {
    const returnDir = path.join(packageDir, row.returned_mp4_dir || "");
    const expectedReturnFile = path.join(returnDir, row.expected_probe_filename || "");
    const ingestedProbe = row.expected_probe_clip || "";
    const returnDirExists = returnDir ? fs.existsSync(returnDir) : false;
    const returnedFileExists = expectedReturnFile ? fs.existsSync(expectedReturnFile) : false;
    const ingestedProbeExists = ingestedProbe ? fs.existsSync(ingestedProbe) : false;
    if (!returnDirExists) problems.push(`missing return directory: ${returnDir}`);
    trackerRows.push({
      batch_id: bundle.batch_id,
      order: Number(row.order || 0),
      shot: row.shot,
      custom_id: row.custom_id,
      expected_probe_filename: row.expected_probe_filename,
      zip: path.join(packageDir, bundle.zip || ""),
      return_dir: returnDir,
      expected_return_file: expectedReturnFile,
      expected_probe_clip: ingestedProbe,
      return_status: returnedFileExists ? "returned_mp4_present" : "returned_mp4_missing",
      ingest_status: ingestedProbeExists ? "ingested_probe_present" : "ingested_probe_missing",
      dry_run_command: row.dry_run_command,
      apply_command: row.apply_command,
      must_not_return_active_after: row.must_not_return_active_after,
      changed_this_shot: row.changed_this_shot,
      no_active_combat_line: row.no_active_combat_line,
    });
  }
}

const returnedReady = trackerRows.filter((row) => row.return_status === "returned_mp4_present").length;
const ingestedReady = trackerRows.filter((row) => row.ingest_status === "ingested_probe_present").length;
const decision = problems.length
  ? "motion_probe_operator_tracker_failed"
  : returnedReady === 42 && ingestedReady === 42
    ? "motion_probe_operator_tracker_complete"
    : "motion_probe_operator_tracker_ready_clips_pending";

const result = {
  date: "2026-08-03",
  decision,
  package_dir: packageDir,
  manifest: manifestPath,
  expected_probe_map: expectedMapPath,
  batches: batchSummaries.length,
  expected_probe_rows: trackerRows.length,
  returned_mp4_ready: returnedReady,
  ingested_probe_ready: ingestedReady,
  missing_returned_mp4: trackerRows.length - returnedReady,
  missing_ingested_probe: trackerRows.length - ingestedReady,
  batch_summaries: batchSummaries,
  rows: trackerRows,
  problems,
  html: htmlPath,
  csv: csvPath,
  json: jsonPath,
  report_json: reportJsonPath,
};

const csvHeader = [
  "batch_id",
  "order",
  "shot",
  "custom_id",
  "expected_probe_filename",
  "return_status",
  "ingest_status",
  "zip",
  "return_dir",
  "expected_return_file",
  "expected_probe_clip",
  "dry_run_command",
  "apply_command",
  "must_not_return_active_after",
  "changed_this_shot",
  "no_active_combat_line",
];
const csvBody = [
  csvHeader.join(","),
  ...trackerRows.map((row) => csvHeader.map((key) => csvEscape(row[key])).join(",")),
].join("\n");

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>Scene09 探针提交/回收追踪表</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #172033; background: #f6f7fb; }
    main { max-width: 1380px; margin: 0 auto; padding: 24px; }
    h1 { margin: 0 0 8px; font-size: 24px; }
    p { color: #5f6b7a; line-height: 1.5; }
    .stats, .batches { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin: 18px 0; }
    .card { border: 1px solid #d7deea; border-radius: 8px; padding: 12px; background: white; }
    .card strong { display: block; font-size: 20px; }
    .card span, .card small { color: #5f6b7a; font-size: 12px; line-height: 1.45; overflow-wrap: anywhere; }
    table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #d7deea; }
    th, td { padding: 8px 9px; border-bottom: 1px solid #e7ecf4; text-align: left; vertical-align: top; font-size: 12px; }
    th { position: sticky; top: 0; background: #eef3fa; z-index: 1; }
    code, a { overflow-wrap: anywhere; }
    .missing { color: #9a3412; font-weight: 800; }
    .present { color: #166534; font-weight: 800; }
    @media (max-width: 900px) { .stats, .batches { grid-template-columns: 1fr; } main { padding: 14px; } }
  </style>
</head>
<body>
<main>
  <h1>Scene09 探针提交/回收追踪表</h1>
  <p>用于外部 3 秒运动探针提交与回收。先提交 7 个 zip；返回 mp4 后按批次放入对应 returned_mp4 目录，先执行 dry-run，再 apply。当前表只追踪探针，不放行全时长生成。</p>
  <section class="stats">
    <div class="card"><strong>${htmlEscape(decision)}</strong><span>Decision</span></div>
    <div class="card"><strong>${trackerRows.length}</strong><span>Expected probe rows</span></div>
    <div class="card"><strong>${returnedReady}/42</strong><span>Returned mp4 ready</span></div>
    <div class="card"><strong>${ingestedReady}/42</strong><span>Ingested probe ready</span></div>
  </section>
  <section class="batches">
    ${batchSummaries.map((batch) => `
      <div class="card">
        <strong>${htmlEscape(batch.batch_id)}</strong>
        <span>${htmlEscape(batch.first_custom_id)} - ${htmlEscape(batch.last_custom_id)}</span><br>
        <small>${htmlEscape(formatBytes(batch.zip_bytes))} · returned ${htmlEscape(batch.returned_mp4_ready)}/${htmlEscape(batch.rows)}</small><br>
        <small><a href="${htmlEscape(batch.zip)}">${htmlEscape(path.basename(batch.zip))}</a></small><br>
        <small><a href="${htmlEscape(batch.return_dir)}">returned_mp4</a></small>
      </div>
    `).join("")}
  </section>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Batch</th>
        <th>Shot</th>
        <th>Expected Filename</th>
        <th>Return</th>
        <th>Ingest</th>
        <th>Return Dir</th>
        <th>Dry Run</th>
        <th>No Active Combat</th>
      </tr>
    </thead>
    <tbody>
      ${trackerRows.map((row) => `
        <tr>
          <td>${htmlEscape(row.order)}</td>
          <td>${htmlEscape(row.batch_id)}<br><code>${htmlEscape(row.custom_id)}</code></td>
          <td>${htmlEscape(row.shot)}</td>
          <td><code>${htmlEscape(row.expected_probe_filename)}</code></td>
          <td class="${row.return_status.includes("present") ? "present" : "missing"}">${htmlEscape(row.return_status)}</td>
          <td class="${row.ingest_status.includes("present") ? "present" : "missing"}">${htmlEscape(row.ingest_status)}</td>
          <td><a href="${htmlEscape(row.return_dir)}">${htmlEscape(row.return_dir)}</a></td>
          <td><code>${htmlEscape(row.dry_run_command)}</code></td>
          <td>${htmlEscape(row.no_active_combat_line || "none")}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
</main>
</body>
</html>
`;

fs.writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`);
fs.writeFileSync(reportJsonPath, `${JSON.stringify(result, null, 2)}\n`);
fs.writeFileSync(csvPath, `${csvBody}\n`);
fs.writeFileSync(htmlPath, html);

console.log(JSON.stringify({
  decision,
  batches: batchSummaries.length,
  expected_probe_rows: trackerRows.length,
  returned_mp4_ready: returnedReady,
  ingested_probe_ready: ingestedReady,
  problems: problems.length,
  html: htmlPath,
  json: jsonPath,
  csv: csvPath,
  report_json: reportJsonPath,
}, null, 2));
process.exit(problems.length ? 1 : 0);
