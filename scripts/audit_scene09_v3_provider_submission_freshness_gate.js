#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const payloadPath = path.join(packageDir, "submission_payload.jsonl");
const batchManifestPath = path.join(packageDir, "model_submission_batches/batch_manifest.json");
const providerManifestPath = path.join(packageDir, "provider_upload_bundles/provider_upload_bundles_manifest.json");
const outJson = path.join(reportDir, `scene09_v3_provider_submission_freshness_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_provider_submission_freshness_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "provider_submission_freshness_gate.json");
const packageOutMd = path.join(packageDir, "provider_submission_freshness_gate.md");

const semanticFields = [
  "custom_id",
  "shot",
  "id",
  "order",
  "duration_seconds",
  "status",
  "prompt_text",
  "negative_prompt_text",
  "expected_clip",
  "visible_named_only",
  "primary_check",
  "reject_if",
];

function readText(file, fallback = null) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
}

function readJson(file, fallback = null) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function sha256File(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function rel(file) {
  return path.relative(root, file);
}

function parseJsonl(file, problems) {
  const text = readText(file);
  if (text == null) {
    problems.push(`missing JSONL ${rel(file)}`);
    return [];
  }
  return text.split(/\r?\n/).filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      problems.push(`${rel(file)} line ${index + 1}: invalid JSON (${error.message})`);
      return null;
    }
  }).filter(Boolean);
}

function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function compareSemantic(source, candidate, label, problems) {
  if (!source) {
    problems.push(`${label}: missing source row`);
    return false;
  }
  if (!candidate) {
    problems.push(`${label}: missing candidate row`);
    return false;
  }
  let ok = true;
  for (const field of semanticFields) {
    if (!same(candidate[field], source[field])) {
      problems.push(`${label}: ${field} differs`);
      ok = false;
    }
  }
  for (const key of ["model_prompt", "negative_prompt", "start_frame", "key_frame", "end_frame", "metadata"]) {
    const sourceDigest = source.file_digests?.[key];
    const candidateDigest = candidate.file_digests?.[key];
    if (!sourceDigest || !candidateDigest || sourceDigest.sha256 !== candidateDigest.sha256 || Number(sourceDigest.bytes) !== Number(candidateDigest.bytes)) {
      problems.push(`${label}: file_digests.${key} differs`);
      ok = false;
    }
  }
  return ok;
}

function rowsByCustomId(rows) {
  return new Map(rows.map((row) => [row.custom_id, row]));
}

function main() {
  const problems = [];
  const warnings = [];
  const sourceText = readText(payloadPath, "");
  const sourceSha = sha256Text(sourceText);
  const sourceRows = parseJsonl(payloadPath, problems);
  const sourceById = rowsByCustomId(sourceRows);
  const batchManifest = readJson(batchManifestPath, {});
  const providerManifest = readJson(providerManifestPath, {});
  const batchRows = [];
  const providerRows = [];
  const rows = [];

  if (batchManifest.source_payload_sha256 !== sourceSha) {
    problems.push(`batch manifest source_payload_sha256 ${batchManifest.source_payload_sha256 || "missing"} does not match current submission_payload ${sourceSha}`);
  }
  if (Number(batchManifest.total_shots || 0) !== sourceRows.length) {
    problems.push(`batch manifest total_shots ${batchManifest.total_shots || 0} does not match source rows ${sourceRows.length}`);
  }
  if (Number(providerManifest.total_shots || 0) !== sourceRows.length) {
    problems.push(`provider manifest total_shots ${providerManifest.total_shots || 0} does not match source rows ${sourceRows.length}`);
  }

  for (const batch of batchManifest.batches || []) {
    const batchFile = path.join(packageDir, batch.jsonl || "");
    const actualDigest = fs.existsSync(batchFile) ? sha256File(batchFile) : null;
    if (!actualDigest) {
      problems.push(`${batch.batch_id}: missing batch JSONL ${batch.jsonl}`);
      continue;
    }
    if (batch.sha256?.jsonl !== actualDigest.sha256) {
      problems.push(`${batch.batch_id}: batch manifest JSONL sha mismatch`);
    }
    const parsed = parseJsonl(batchFile, problems);
    batchRows.push(...parsed);
    for (const row of parsed) {
      compareSemantic(sourceById.get(row.custom_id), row, `${batch.batch_id}/${row.custom_id}`, problems);
    }
    rows.push({
      batch_id: batch.batch_id,
      source: "model_submission_batches",
      rows: parsed.length,
      jsonl: batch.jsonl,
      sha256: actualDigest.sha256,
      manifest_sha256: batch.sha256?.jsonl || null,
    });
  }

  for (const bundle of providerManifest.bundles || []) {
    const dir = path.join(packageDir, bundle.directory || "");
    const bundleJsonl = path.join(dir, "batch.jsonl");
    const zipFile = path.join(packageDir, bundle.zip || "");
    const parsed = parseJsonl(bundleJsonl, problems);
    providerRows.push(...parsed);
    for (const row of parsed) {
      compareSemantic(sourceById.get(row.custom_id), row, `${bundle.batch_id}/${row.custom_id}`, problems);
    }
    if (!fs.existsSync(zipFile)) {
      problems.push(`${bundle.batch_id}: missing zip ${bundle.zip}`);
    } else {
      const digest = sha256File(zipFile);
      if (bundle.zip_digest?.sha256 !== digest.sha256 || Number(bundle.zip_digest?.bytes || 0) !== digest.bytes) {
        problems.push(`${bundle.batch_id}: provider zip digest mismatch`);
      }
    }
    rows.push({
      batch_id: bundle.batch_id,
      source: "provider_upload_bundles",
      rows: parsed.length,
      jsonl: path.relative(packageDir, bundleJsonl),
      zip: bundle.zip,
    });
  }

  const batchIds = batchRows.map((row) => row.custom_id);
  const providerIds = providerRows.map((row) => row.custom_id);
  const sourceIds = sourceRows.map((row) => row.custom_id);
  if (!same(batchIds, sourceIds)) problems.push("stitched model submission batch custom_id order does not match current submission_payload");
  if (!same(providerIds, sourceIds)) problems.push("stitched provider bundle custom_id order does not match current submission_payload");

  const decision = problems.length ? "provider_submission_freshness_blocked" : "provider_submission_freshness_passed";
  const report = {
    date,
    decision,
    package_id: batchManifest.package_id || providerManifest.package_id || null,
    current_payload: rel(payloadPath),
    current_payload_sha256: sourceSha,
    expected_shots: sourceRows.length,
    model_submission_batch_rows: batchRows.length,
    provider_bundle_rows: providerRows.length,
    total_batches: Number(batchManifest.total_batches || 0),
    provider_bundles: Number((providerManifest.bundles || []).length),
    problems,
    warnings,
    rows,
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Provider Submission Freshness Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Expected shots: ${sourceRows.length}`,
    `Model submission batch rows: ${batchRows.length}`,
    `Provider bundle rows: ${providerRows.length}`,
    `Current payload SHA-256: \`${sourceSha}\``,
    "",
    "This gate proves the file:// model submission batches and provider upload bundles are rebuilt from the current `submission_payload.jsonl`, not a stale pre-sync payload.",
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  process.stdout.write(`${JSON.stringify({
    decision,
    expected_shots: sourceRows.length,
    model_submission_batch_rows: batchRows.length,
    provider_bundle_rows: providerRows.length,
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

main();
