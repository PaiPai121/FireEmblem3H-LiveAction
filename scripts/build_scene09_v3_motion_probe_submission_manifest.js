#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const packageRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const packageDir = path.join(root, packageRel);
const bundlesDirRel = `${packageRel}/motion_probe_provider_bundles`;
const manifestPath = path.join(root, bundlesDirRel, "motion_probe_provider_bundles_manifest.json");
const outJson = path.join(packageDir, "motion_probe_submission_manifest.json");
const outMd = path.join(packageDir, "motion_probe_submission_manifest.md");
const outCsv = path.join(packageDir, "motion_probe_submission_manifest.csv");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function rel(file) {
  return path.relative(root, file);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function countReturnedMp4(returnDirRel) {
  const abs = path.join(root, returnDirRel);
  if (!fs.existsSync(abs)) return 0;
  return fs.readdirSync(abs)
    .filter((file) => file.toLowerCase().endsWith(".mp4"))
    .length;
}

function main() {
  const manifest = readJson(manifestPath);
  const rows = (manifest.bundles || []).map((bundle, index) => {
    const customIds = bundle.custom_ids || [];
    const firstCustomId = customIds[0] || "";
    const lastCustomId = customIds[customIds.length - 1] || "";
    const zipRel = `${packageRel}/${bundle.zip}`;
    const zipAbs = path.join(root, zipRel);
    const batchDir = bundle.directory || `motion_probe_provider_bundles/${bundle.batch_id}`;
    const folderRel = `${packageRel}/${batchDir}`;
    const providerJsonlRel = `${folderRel}/probe_batch.jsonl`;
    const expectedDownloadsRel = `${folderRel}/expected_probe_downloads.csv`;
    const returnDir = `${packageRel}/motion_probe_return_intake/${bundle.batch_id}_returns/returned_mp4`;
    const dryRunCommand = `node scripts/ingest_scene09_v3_motion_probe_clips.js --input ${returnDir} --dry-run`;
    const applyCommand = `node scripts/ingest_scene09_v3_motion_probe_clips.js --input ${returnDir} --apply`;
    const expectedSha = bundle.zip_digest?.sha256 || "";
    const actualSha = fs.existsSync(zipAbs) ? sha256File(zipAbs) : "";
    const expectedBytes = Number(bundle.zip_digest?.bytes || 0);
    const actualBytes = fs.existsSync(zipAbs) ? fs.statSync(zipAbs).size : 0;
    const rowProblems = [];
    if (!fs.existsSync(zipAbs)) rowProblems.push("missing_zip");
    if (expectedSha && actualSha && expectedSha !== actualSha) rowProblems.push("zip_sha256_mismatch");
    if (expectedBytes && actualBytes && expectedBytes !== actualBytes) rowProblems.push("zip_size_mismatch");
    if (!fs.existsSync(path.join(root, folderRel))) rowProblems.push("missing_bundle_folder");
    if (!fs.existsSync(path.join(root, providerJsonlRel))) rowProblems.push("missing_probe_batch_jsonl");
    if (!fs.existsSync(path.join(root, expectedDownloadsRel))) rowProblems.push("missing_expected_probe_downloads");
    return {
      index: index + 1,
      batch_id: bundle.batch_id,
      shot_range: firstCustomId && lastCustomId ? `${firstCustomId.replace(/_probe$/, "")}-${lastCustomId.replace(/_probe$/, "")}` : "",
      rows: Number(bundle.rows || customIds.length || 0),
      files: Number(bundle.files || 0),
      zip: zipRel,
      zip_exists: fs.existsSync(zipAbs),
      zip_bytes: actualBytes,
      zip_sha256: actualSha,
      expected_zip_bytes: expectedBytes,
      expected_zip_sha256: expectedSha,
      zip_digest_matches_manifest: Boolean(expectedSha && actualSha && expectedSha === actualSha && expectedBytes === actualBytes),
      folder: folderRel,
      provider_jsonl: providerJsonlRel,
      expected_downloads: expectedDownloadsRel,
      first_custom_id: firstCustomId,
      last_custom_id: lastCustomId,
      return_dir: returnDir,
      returned_mp4_count: countReturnedMp4(returnDir),
      dry_run_command: dryRunCommand,
      apply_command: applyCommand,
      problems: rowProblems,
    };
  });

  const problems = rows.flatMap((row) => row.problems.map((problem) => `${row.batch_id}: ${problem}`));
  const report = {
    generated_at: new Date().toISOString(),
    decision: problems.length ? "motion_probe_submission_manifest_needs_attention" : "motion_probe_submission_manifest_ready",
    package: packageRel,
    source_manifest: rel(manifestPath),
    source_manifest_sha256: sha256File(manifestPath),
    total_batches: rows.length,
    total_probe_rows: rows.reduce((sum, row) => sum + row.rows, 0),
    returned_mp4_total: rows.reduce((sum, row) => sum + row.returned_mp4_count, 0),
    next_action: "submit_motion_probe_zip_batches_then_place_returned_mp4s_in_return_dir",
    rule: "Submit the seven probe zip files before full-duration generation. Do not upload full-duration batches until full_duration_release_gate passes.",
    rows,
    problems,
  };

  const csvHeader = [
    "index",
    "batch_id",
    "shot_range",
    "rows",
    "zip",
    "zip_bytes",
    "zip_sha256",
    "return_dir",
    "returned_mp4_count",
    "dry_run_command",
    "apply_command",
  ];
  const csv = [
    csvHeader.join(","),
    ...rows.map((row) => csvHeader.map((key) => csvCell(row[key])).join(",")),
  ].join("\n") + "\n";

  const md = [
    "# Scene09 Motion Probe Submission Manifest",
    "",
    `Generated: ${report.generated_at}`,
    `Decision: ${report.decision}`,
    `Batches: ${report.total_batches}`,
    `Probe rows: ${report.total_probe_rows}`,
    `Returned mp4 files currently present: ${report.returned_mp4_total}`,
    "",
    "## Rule",
    "",
    report.rule,
    "",
    "## Batches",
    "",
    "| # | Batch | Shot Range | Rows | Zip | SHA-256 | Return Dir | Returned | Dry Run |",
    "|---:|---|---|---:|---|---|---|---:|---|",
    ...rows.map((row) => [
      row.index,
      row.batch_id,
      row.shot_range,
      row.rows,
      `[zip](${row.zip})`,
      `\`${row.zip_sha256}\``,
      `\`${row.return_dir}\``,
      row.returned_mp4_count,
      `\`${row.dry_run_command}\``,
    ].join(" | ")).map((line) => `| ${line} |`),
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");

  writeText(outJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(outMd, md);
  writeText(outCsv, csv);

  console.log(JSON.stringify({
    decision: report.decision,
    total_batches: report.total_batches,
    total_probe_rows: report.total_probe_rows,
    returned_mp4_total: report.returned_mp4_total,
    problems: problems.length,
    out_json: rel(outJson),
    out_md: rel(outMd),
    out_csv: rel(outCsv),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
