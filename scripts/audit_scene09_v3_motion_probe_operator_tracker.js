#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-03";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");

const trackerJsonPath = path.join(packageDir, "motion_probe_operator_tracker.json");
const trackerHtmlPath = path.join(packageDir, "motion_probe_operator_tracker.html");
const trackerCsvPath = path.join(packageDir, "motion_probe_operator_tracker.csv");
const providerManifestPath = path.join(packageDir, "motion_probe_provider_bundles/motion_probe_provider_bundles_manifest.json");
const expectedMapPath = path.join(packageDir, "motion_probe_return_intake/expected_probe_map.csv");
const packageOutJson = path.join(packageDir, "motion_probe_operator_tracker_audit.json");
const packageOutMd = path.join(packageDir, "motion_probe_operator_tracker_audit.md");
const reportJson = path.join(reportDir, `scene09_v3_motion_probe_operator_tracker_audit_${date}.json`);
const reportMd = path.join(reportDir, `scene09_v3_motion_probe_operator_tracker_audit_${date}.md`);

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function rel(file) {
  return path.relative(root, file);
}

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
  if (!header) return [];
  return body
    .filter((cells) => cells.length && cells.some(Boolean))
    .map((cells) => Object.fromEntries(header.map((key, index) => [key, cells[index] || ""])));
}

function countLinks(html) {
  return [...String(html || "").matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
}

function same(value, expected) {
  return String(value || "") === String(expected || "");
}

const problems = [];
const warnings = [];
const requiredFiles = [trackerJsonPath, trackerHtmlPath, trackerCsvPath, providerManifestPath, expectedMapPath];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) problems.push(`missing required tracker source: ${rel(file)}`);
}

const tracker = readJson(trackerJsonPath, {});
const providerManifest = readJson(providerManifestPath, {});
const trackerHtml = readText(trackerHtmlPath);
const trackerCsv = readText(trackerCsvPath);
const csvRows = parseCsv(trackerCsv);
const expectedRows = parseCsv(readText(expectedMapPath));
const trackerRows = Array.isArray(tracker.rows) ? tracker.rows : [];
const batchSummaries = Array.isArray(tracker.batch_summaries) ? tracker.batch_summaries : [];

if (!["motion_probe_operator_tracker_ready_clips_pending", "motion_probe_operator_tracker_complete"].includes(tracker.decision)) {
  problems.push(`unexpected tracker decision: ${tracker.decision || "missing"}`);
}
if (Number(tracker.batches || 0) !== 7) problems.push(`tracker batches ${tracker.batches || 0} is not 7`);
if (Number(tracker.expected_probe_rows || 0) !== 42) problems.push(`tracker expected_probe_rows ${tracker.expected_probe_rows || 0} is not 42`);
if (trackerRows.length !== 42) problems.push(`tracker rows length ${trackerRows.length} is not 42`);
if (csvRows.length !== 42) problems.push(`tracker csv rows ${csvRows.length} is not 42`);
if (expectedRows.length !== 42) problems.push(`expected probe map rows ${expectedRows.length} is not 42`);
if ((providerManifest.bundles || []).length !== 7) problems.push(`provider bundles ${(providerManifest.bundles || []).length} is not 7`);
if (batchSummaries.length !== 7) problems.push(`tracker batch summaries ${batchSummaries.length} is not 7`);
if (Array.isArray(tracker.problems) && tracker.problems.length) {
  problems.push(`tracker carries ${tracker.problems.length} internal problems`);
}

const uniqueCustomIds = new Set(trackerRows.map((row) => row.custom_id).filter(Boolean));
const uniqueExpectedFilenames = new Set(trackerRows.map((row) => row.expected_probe_filename).filter(Boolean));
const uniqueShots = new Set(trackerRows.map((row) => row.shot).filter(Boolean));
if (uniqueCustomIds.size !== 42) problems.push(`unique custom ids ${uniqueCustomIds.size} is not 42`);
if (uniqueExpectedFilenames.size !== 42) problems.push(`unique expected probe filenames ${uniqueExpectedFilenames.size} is not 42`);
if (uniqueShots.size !== 42) problems.push(`unique shots ${uniqueShots.size} is not 42`);

const returnedCount = trackerRows.filter((row) => row.return_status === "returned_mp4_present").length;
const ingestedCount = trackerRows.filter((row) => row.ingest_status === "ingested_probe_present").length;
if (returnedCount !== Number(tracker.returned_mp4_ready || 0)) {
  problems.push(`returned_mp4_ready ${tracker.returned_mp4_ready || 0} does not match row count ${returnedCount}`);
}
if (ingestedCount !== Number(tracker.ingested_probe_ready || 0)) {
  problems.push(`ingested_probe_ready ${tracker.ingested_probe_ready || 0} does not match row count ${ingestedCount}`);
}

const csvByCustomId = new Map(csvRows.map((row) => [row.custom_id, row]));
for (const row of trackerRows) {
  const csvRow = csvByCustomId.get(row.custom_id);
  if (!csvRow) {
    problems.push(`csv missing custom id ${row.custom_id || "unknown"}`);
    break;
  }
  for (const key of ["batch_id", "shot", "expected_probe_filename", "return_status", "ingest_status"]) {
    if (!same(csvRow[key], row[key])) {
      problems.push(`csv mismatch for ${row.custom_id} field ${key}`);
      break;
    }
  }
  if (!fs.existsSync(row.zip || "")) {
    problems.push(`missing zip referenced by row ${row.custom_id}: ${row.zip || "missing"}`);
    break;
  }
  if (!fs.existsSync(row.return_dir || "")) {
    problems.push(`missing return_dir referenced by row ${row.custom_id}: ${row.return_dir || "missing"}`);
    break;
  }
  if (!String(row.expected_probe_filename || "").endsWith("_probe.mp4")) {
    problems.push(`bad expected probe filename for ${row.custom_id}: ${row.expected_probe_filename || "missing"}`);
    break;
  }
}

for (const batch of batchSummaries) {
  if (!fs.existsSync(batch.zip || "")) problems.push(`missing batch zip: ${batch.zip || "missing"}`);
  if (!fs.existsSync(batch.return_dir || "")) problems.push(`missing batch return_dir: ${batch.return_dir || "missing"}`);
  if (Number(batch.rows || 0) <= 0) problems.push(`batch ${batch.batch_id || "unknown"} has no rows`);
  if (!batch.dry_run_command || !batch.apply_command) {
    problems.push(`batch ${batch.batch_id || "unknown"} missing dry-run/apply command`);
  }
}

const htmlLinks = countLinks(trackerHtml);
const htmlRequiredFragments = [
  "Scene09 探针提交/回收追踪表",
  tracker.decision || "",
  "Expected probe rows",
  "Returned mp4 ready",
  "Ingested probe ready",
  trackerRows[0]?.expected_probe_filename || "",
  trackerRows[trackerRows.length - 1]?.expected_probe_filename || "",
];
for (const fragment of htmlRequiredFragments.filter(Boolean)) {
  if (!trackerHtml.includes(fragment)) problems.push(`tracker html missing fragment: ${fragment}`);
}
if (/\bundefined\b|\bNaN\b/.test(trackerHtml)) {
  problems.push("tracker html contains undefined or NaN");
}
if (htmlLinks.length < 14) warnings.push(`tracker html has only ${htmlLinks.length} links`);

const zipBytes = batchSummaries.reduce((sum, batch) => sum + Number(batch.zip_bytes || 0), 0);
const decision = problems.length
  ? "motion_probe_operator_tracker_audit_blocked"
  : "motion_probe_operator_tracker_audit_passed";
const result = {
  date,
  decision,
  package_dir: rel(packageDir),
  tracker_json: rel(trackerJsonPath),
  tracker_html: rel(trackerHtmlPath),
  tracker_csv: rel(trackerCsvPath),
  provider_manifest: rel(providerManifestPath),
  expected_probe_map: rel(expectedMapPath),
  batches_checked: batchSummaries.length,
  expected_probe_rows: trackerRows.length,
  csv_rows: csvRows.length,
  unique_custom_ids: uniqueCustomIds.size,
  unique_expected_probe_filenames: uniqueExpectedFilenames.size,
  unique_shots: uniqueShots.size,
  returned_mp4_ready: returnedCount,
  ingested_probe_ready: ingestedCount,
  html_links_checked: htmlLinks.length,
  provider_zip_total_bytes: zipBytes,
  hashes: Object.fromEntries(requiredFiles.filter((file) => fs.existsSync(file)).map((file) => [rel(file), sha256(file)])),
  problems,
  warnings,
};

const md = [
  "# Scene09 Motion Probe Operator Tracker Audit",
  "",
  `Decision: ${decision}`,
  `Batches checked: ${result.batches_checked}`,
  `Expected probe rows: ${result.expected_probe_rows}`,
  `CSV rows: ${result.csv_rows}`,
  `Unique custom IDs: ${result.unique_custom_ids}`,
  `Unique expected probe filenames: ${result.unique_expected_probe_filenames}`,
  `Returned mp4 ready: ${result.returned_mp4_ready}/42`,
  `Ingested probe ready: ${result.ingested_probe_ready}/42`,
  `HTML links checked: ${result.html_links_checked}`,
  "",
  "## Problems",
  problems.length ? problems.map((item) => `- ${item}`).join("\n") : "- none",
  "",
  "## Warnings",
  warnings.length ? warnings.map((item) => `- ${item}`).join("\n") : "- none",
  "",
].join("\n");

writeJson(packageOutJson, result);
writeText(packageOutMd, md);
writeJson(reportJson, result);
writeText(reportMd, md);

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (problems.length) process.exit(1);
