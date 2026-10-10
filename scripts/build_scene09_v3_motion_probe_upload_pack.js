#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const packageRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const packageDir = path.join(root, packageRel);
const sourceManifestPath = path.join(packageDir, "motion_probe_submission_manifest.json");
const outRel = `${packageRel}/motion_probe_upload_pack`;
const outDir = path.join(root, outRel);
const zipsDir = path.join(outDir, "zips");

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

function ensureLinkedZip(sourceRel, destAbs) {
  const sourceAbs = path.join(root, sourceRel);
  if (!fs.existsSync(sourceAbs)) return { linked: false, exists: false, link_type: "missing_source" };
  fs.mkdirSync(path.dirname(destAbs), { recursive: true });
  if (fs.existsSync(destAbs)) {
    const sourceSha = sha256File(sourceAbs);
    const destSha = sha256File(destAbs);
    if (sourceSha === destSha) {
      return { linked: false, exists: true, link_type: "existing_matching_file" };
    }
    fs.unlinkSync(destAbs);
  }
  try {
    fs.linkSync(sourceAbs, destAbs);
    return { linked: true, exists: true, link_type: "hardlink" };
  } catch (error) {
    fs.copyFileSync(sourceAbs, destAbs);
    return { linked: true, exists: true, link_type: `copy_fallback:${error.code || "unknown"}` };
  }
}

function main() {
  const sourceManifest = readJson(sourceManifestPath);
  const rows = (sourceManifest.rows || []).map((sourceRow) => {
    const sourceZipRel = sourceRow.zip;
    const zipName = path.basename(sourceZipRel);
    const uploadZipAbs = path.join(zipsDir, zipName);
    const uploadZipRel = rel(uploadZipAbs);
    const linkResult = ensureLinkedZip(sourceZipRel, uploadZipAbs);
    const sourceAbs = path.join(root, sourceZipRel);
    const uploadSha = fs.existsSync(uploadZipAbs) ? sha256File(uploadZipAbs) : "";
    const sourceSha = fs.existsSync(sourceAbs) ? sha256File(sourceAbs) : "";
    const uploadBytes = fs.existsSync(uploadZipAbs) ? fs.statSync(uploadZipAbs).size : 0;
    const expectedSha = sourceRow.zip_sha256 || sourceRow.expected_zip_sha256 || "";
    const expectedBytes = Number(sourceRow.zip_bytes || sourceRow.expected_zip_bytes || 0);
    const rowProblems = [];
    if (!fs.existsSync(uploadZipAbs)) rowProblems.push("missing_upload_zip");
    if (expectedSha && uploadSha !== expectedSha) rowProblems.push("upload_zip_sha256_mismatch");
    if (sourceSha && uploadSha !== sourceSha) rowProblems.push("upload_zip_differs_from_source_zip");
    if (expectedBytes && uploadBytes !== expectedBytes) rowProblems.push("upload_zip_size_mismatch");
    return {
      index: sourceRow.index,
      batch_id: sourceRow.batch_id,
      shot_range: sourceRow.shot_range,
      rows: sourceRow.rows,
      upload_zip: uploadZipRel,
      upload_zip_name: zipName,
      upload_zip_bytes: uploadBytes,
      upload_zip_sha256: uploadSha,
      source_zip: sourceZipRel,
      source_zip_sha256: sourceSha,
      link_type: linkResult.link_type,
      return_dir: sourceRow.return_dir,
      expected_downloads: sourceRow.expected_downloads,
      dry_run_command: sourceRow.dry_run_command,
      apply_command: sourceRow.apply_command,
      problems: rowProblems,
    };
  });

  const problems = rows.flatMap((row) => row.problems.map((problem) => `${row.batch_id}: ${problem}`));
  const report = {
    generated_at: new Date().toISOString(),
    decision: problems.length ? "motion_probe_upload_pack_needs_attention" : "motion_probe_upload_pack_ready",
    package: packageRel,
    source_submission_manifest: rel(sourceManifestPath),
    source_submission_manifest_sha256: sha256File(sourceManifestPath),
    upload_pack: outRel,
    upload_zips_dir: `${outRel}/zips`,
    total_batches: rows.length,
    total_probe_rows: rows.reduce((sum, row) => sum + Number(row.rows || 0), 0),
    total_upload_zip_bytes: rows.reduce((sum, row) => sum + Number(row.upload_zip_bytes || 0), 0),
    rule: "Upload only the files under motion_probe_upload_pack/zips. Keep returned probe mp4 files in each row's return_dir, then run the dry-run ingest command before apply.",
    rows,
    problems,
  };

  const shaLines = rows
    .map((row) => `${row.upload_zip_sha256}  zips/${row.upload_zip_name}`)
    .join("\n") + "\n";
  writeText(path.join(outDir, "SHA256SUMS.txt"), shaLines);

  const csvHeader = [
    "index",
    "batch_id",
    "shot_range",
    "rows",
    "upload_zip",
    "upload_zip_bytes",
    "upload_zip_sha256",
    "return_dir",
    "dry_run_command",
    "apply_command",
  ];
  const csv = [
    csvHeader.join(","),
    ...rows.map((row) => csvHeader.map((key) => csvCell(row[key])).join(",")),
  ].join("\n") + "\n";
  writeText(path.join(outDir, "upload_manifest.csv"), csv);
  writeText(path.join(outDir, "upload_manifest.json"), `${JSON.stringify(report, null, 2)}\n`);

  const returnLines = [
    "# Scene09 Motion Probe Return Directories",
    "",
    "Place returned 3-second probe mp4 files into the matching directory below, then run the dry-run ingest command first.",
    "",
    "| Batch | Shot Range | Return Directory | Dry Run | Apply |",
    "|---|---|---|---|---|",
    ...rows.map((row) => `| ${row.batch_id} | ${row.shot_range} | \`${row.return_dir}\` | \`${row.dry_run_command}\` | \`${row.apply_command}\` |`),
    "",
  ].join("\n");
  writeText(path.join(outDir, "RETURN_DIRECTORIES.md"), returnLines);

  const readme = [
    "# Scene09 Motion Probe Upload Pack",
    "",
    `Generated: ${report.generated_at}`,
    `Decision: ${report.decision}`,
    `Batches: ${report.total_batches}`,
    `Probe rows: ${report.total_probe_rows}`,
    "",
    "## Upload Rule",
    "",
    report.rule,
    "",
    "## Files To Upload",
    "",
    "| # | Batch | Shot Range | Zip | Bytes | SHA-256 |",
    "|---:|---|---|---|---:|---|",
    ...rows.map((row) => `| ${row.index} | ${row.batch_id} | ${row.shot_range} | [${row.upload_zip_name}](zips/${row.upload_zip_name}) | ${row.upload_zip_bytes} | \`${row.upload_zip_sha256}\` |`),
    "",
    "## Verification",
    "",
    "- `SHA256SUMS.txt` contains one checksum per upload zip.",
    "- `upload_manifest.json` and `upload_manifest.csv` carry the return directories and ingest commands.",
    "- `RETURN_DIRECTORIES.md` is the operator-facing return map.",
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(path.join(outDir, "README.md"), readme);

  console.log(JSON.stringify({
    decision: report.decision,
    total_batches: report.total_batches,
    total_probe_rows: report.total_probe_rows,
    total_upload_zip_bytes: report.total_upload_zip_bytes,
    problems: problems.length,
    readme: `${outRel}/README.md`,
    manifest: `${outRel}/upload_manifest.json`,
    checksums: `${outRel}/SHA256SUMS.txt`,
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
