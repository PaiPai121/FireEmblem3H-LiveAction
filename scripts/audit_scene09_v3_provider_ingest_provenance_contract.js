#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(reportDir, `scene09_v3_provider_ingest_provenance_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_provider_ingest_provenance_contract_${date}.md`);
const packageOutJson = path.join(packageDir, "provider_ingest_provenance_contract.json");
const packageOutMd = path.join(packageDir, "provider_ingest_provenance_contract.md");

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function rel(file) {
  return path.relative(root, file);
}

function digest(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function run(command, args, options = {}) {
  const result = cp.spawnSync(command, args, {
    cwd: root,
    env: { ...process.env, ...(options.env || {}) },
    encoding: "utf8",
  });
  return {
    command: [command, ...args],
    status: result.status,
    stdout_tail: (result.stdout || "").slice(-4000),
    stderr_tail: (result.stderr || "").slice(-4000),
    ok: result.status === 0 && !result.error,
    error: result.error?.message || null,
  };
}

function main() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09-provider-ingest-contract-"));
  const tmpPackage = path.join(tmpRoot, "package");
  const tmpReports = path.join(tmpRoot, "reports");
  const inputDir = path.join(tmpRoot, "provider_downloads");
  const outputClip = path.join(tmpRoot, "expected_outputs", "01_TestShot.mp4");
  const sourceClip = path.join(inputDir, "001_TestShot_provider-return.mp4");
  fs.mkdirSync(tmpPackage, { recursive: true });
  fs.mkdirSync(tmpReports, { recursive: true });
  fs.mkdirSync(inputDir, { recursive: true });

  const expectedClipRel = rel(outputClip);
  writeJson(path.join(tmpPackage, "package_manifest.json"), {
    package_id: "scene09_provider_ingest_contract_fixture",
    total_shots: 1,
    total_duration_seconds: 1,
    shots: [{
      order: 1,
      shot: "TestShot",
      id: "TEST-SHOT-001",
      expected_clip: expectedClipRel,
      duration_seconds: 1,
    }],
  });
  fs.writeFileSync(path.join(tmpPackage, "submission_payload.jsonl"), `${JSON.stringify({
    id: "TEST-SHOT-001",
    custom_id: "001_TestShot",
  })}\n`);

  const ffmpeg = run("ffmpeg", [
    "-y",
    "-v", "error",
    "-f", "lavfi",
    "-i", "color=c=blue:s=32x32:r=1:d=1",
    "-pix_fmt", "yuv420p",
    sourceClip,
  ]);

  const env = {
    SCENE09_V3_PACKAGE_DIR: tmpPackage,
    SCENE09_V3_REPORT_DIR: tmpReports,
  };
  const ingest = ffmpeg.ok
    ? run(process.execPath, [
        "scripts/ingest_scene09_v3_generated_clips.js",
        "--input", inputDir,
        "--apply",
        "--report-json", path.join(tmpReports, "ingest.json"),
        "--report-md", path.join(tmpReports, "ingest.md"),
      ], { env })
    : { ok: false, status: null, command: [], stdout_tail: "", stderr_tail: "ffmpeg fixture generation failed", error: null };

  const provenancePath = path.join(tmpPackage, "generated_clip_provenance.json");
  const provenance = fs.existsSync(provenancePath) ? readJson(provenancePath) : { rows: [] };
  const row = provenance.rows?.[0] || {};
  const sourceDigest = fs.existsSync(sourceClip) ? digest(sourceClip) : null;
  const outputDigest = fs.existsSync(outputClip) ? digest(outputClip) : null;
  const positiveGate = ingest.ok
    ? run(process.execPath, ["scripts/audit_scene09_v3_clip_provenance_gate.js"], { env })
    : { ok: false, status: null, command: [], stdout_tail: "", stderr_tail: "ingest did not complete", error: null };

  const positiveProblems = [];
  if (!ffmpeg.ok) positiveProblems.push("ffmpeg fixture generation failed");
  if (!ingest.ok) positiveProblems.push("provider ingest fixture did not apply");
  if (row.source_type !== "provider_ingest") positiveProblems.push(`source_type ${row.source_type || "missing"} is not provider_ingest`);
  if (!row.source_bytes || !row.source_sha256) positiveProblems.push("provider provenance is missing source digest");
  if (!row.bytes || !row.sha256) positiveProblems.push("provider provenance is missing copied output digest");
  if (!row.source_video_probe?.ok) positiveProblems.push("provider provenance is missing passing source_video_probe");
  if (sourceDigest && (row.source_bytes !== sourceDigest.bytes || row.source_sha256 !== sourceDigest.sha256)) {
    positiveProblems.push("provider provenance source digest does not match source file");
  }
  if (outputDigest && (row.bytes !== outputDigest.bytes || row.sha256 !== outputDigest.sha256)) {
    positiveProblems.push("provider provenance output digest does not match copied expected clip");
  }
  if (!positiveGate.ok) positiveProblems.push("clip provenance gate did not pass with complete provider-ingest source digest");

  let negativeGate = { ok: false, status: null, command: [], stdout_tail: "", stderr_tail: "positive provenance missing", error: null };
  let negativeRejected = false;
  if (provenance.rows?.length) {
    const broken = JSON.parse(JSON.stringify(provenance));
    delete broken.rows[0].source_sha256;
    writeJson(provenancePath, broken);
    negativeGate = run(process.execPath, ["scripts/audit_scene09_v3_clip_provenance_gate.js"], { env });
    const negativeGateReportPath = path.join(tmpPackage, "clip_provenance_gate.json");
    const negativeGateReport = fs.existsSync(negativeGateReportPath)
      ? readJson(negativeGateReportPath)
      : { problems: [] };
    negativeRejected = negativeGate.status !== 0 &&
      (negativeGateReport.problems || []).some((problem) => /source_sha256/.test(problem));
  }

  const problems = [...positiveProblems];
  if (!negativeRejected) problems.push("clip provenance gate did not reject provider-ingest provenance missing source_sha256");
  const decision = problems.length
    ? "provider_ingest_provenance_contract_failed"
    : "provider_ingest_provenance_contract_passed";

  const report = {
    date,
    decision,
    fixture_root: tmpRoot,
    production_package_unchanged: !fs.existsSync(path.join(packageDir, "generated_clip_provenance.json")),
    positive: {
      ffmpeg,
      ingest,
      gate: positiveGate,
      source_digest: sourceDigest,
      output_digest: outputDigest,
      provenance_row: row,
      problems: positiveProblems,
    },
    negative: {
      removed_field: "source_sha256",
      gate: negativeGate,
      rejected: negativeRejected,
    },
    problems,
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Provider Ingest Provenance Contract",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    "",
    "This contract proves provider-ingest provenance records the original returned source digest and that `clip_provenance_gate` rejects provider provenance missing `source_sha256`.",
    "",
    "## Positive Path",
    "",
    `- Ingest applied: ${ingest.ok ? "yes" : "no"}`,
    `- Provenance gate passed: ${positiveGate.ok ? "yes" : "no"}`,
    `- Source SHA-256 recorded: ${row.source_sha256 ? "yes" : "no"}`,
    `- Output SHA-256 recorded: ${row.sha256 ? "yes" : "no"}`,
    "",
    "## Negative Path",
    "",
    `- Missing source_sha256 rejected: ${negativeRejected ? "yes" : "no"}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);
  console.log(JSON.stringify({
    decision,
    problems: problems.length,
    positive_gate_passed: positiveGate.ok,
    negative_rejected: negativeRejected,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));
  if (problems.length) process.exit(1);
}

main();
