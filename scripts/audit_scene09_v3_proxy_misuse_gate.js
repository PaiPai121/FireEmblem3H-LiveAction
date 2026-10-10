#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const proxyReportPath = path.join(reportDir, "scene09_v3_proxy_animatic_clips_2026-07-28.json");
const finalEditStructuralPath = path.join(reportDir, "scene09_v3_final_edit_structural_audit_2026-08-01.json");
const outJson = path.join(reportDir, `scene09_v3_proxy_misuse_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_proxy_misuse_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "proxy_misuse_gate.json");
const packageOutMd = path.join(packageDir, "proxy_misuse_gate.md");

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

function rel(file) {
  return path.relative(root, file);
}

function abs(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
}

function digest(file) {
  if (!fs.existsSync(file)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sameRealFile(a, b) {
  if (!fs.existsSync(a) || !fs.existsSync(b)) return false;
  return fs.realpathSync(a) === fs.realpathSync(b);
}

function main() {
  const manifest = readJson(manifestPath);
  if (!manifest) throw new Error(`Missing package manifest: ${manifestPath}`);
  const proxyReport = readJson(proxyReportPath, { rows: [], proxy_edit: {} });
  const finalEditStructural = readJson(finalEditStructuralPath, {});
  const problems = [];
  const warnings = [];
  const proxyRowsByExpected = new Map((proxyReport.rows || []).map((row) => [row.expected_clip, row]));
  const proxyOutputDir = abs(proxyReport.output_dir || "episodes/EP02/video_outputs/scene09_v3_attrition/proxy_animatic_clips");
  const proxyEdit = abs(proxyReport.proxy_edit?.proxy_edit || "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_proxy_animatic_edit_2026-07-28.mp4");
  const finalOutput = abs(finalEditStructural.final_output || "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");

  const rows = (manifest.shots || []).map((shot) => {
    const expectedClip = abs(shot.expected_clip);
    const proxyRow = proxyRowsByExpected.get(shot.expected_clip);
    const proxyClip = proxyRow?.proxy_clip ? abs(proxyRow.proxy_clip) : null;
    const expectedExists = fs.existsSync(expectedClip);
    const proxyExists = proxyClip ? fs.existsSync(proxyClip) : false;
    const expectedDigest = digest(expectedClip);
    const proxyDigest = proxyClip ? digest(proxyClip) : null;
    const rowProblems = [];

    if (/proxy_animatic|_proxy/i.test(shot.expected_clip || "")) {
      rowProblems.push("expected_clip path looks like a proxy output");
    }
    if (path.relative(proxyOutputDir, expectedClip).startsWith("..") === false) {
      rowProblems.push("expected_clip is inside the proxy animatic output directory");
    }
    if (proxyClip && sameRealFile(expectedClip, proxyClip)) {
      rowProblems.push("expected_clip and proxy_clip resolve to the same file");
    }
    if (expectedDigest && proxyDigest && expectedDigest === proxyDigest) {
      rowProblems.push("expected_clip content hash equals proxy_clip hash");
    }

    for (const problem of rowProblems) {
      problems.push(`${shot.shot}: ${problem}`);
    }

    return {
      order: shot.order,
      shot: shot.shot,
      expected_clip: shot.expected_clip,
      proxy_clip: proxyRow?.proxy_clip || null,
      expected_exists: expectedExists,
      proxy_exists: proxyExists,
      expected_sha256: expectedDigest,
      proxy_sha256: proxyDigest,
      problems: rowProblems,
    };
  });

  const finalOutputExists = fs.existsSync(finalOutput);
  const proxyEditExists = fs.existsSync(proxyEdit);
  const finalDigest = digest(finalOutput);
  const proxyEditDigest = digest(proxyEdit);
  if (sameRealFile(finalOutput, proxyEdit)) {
    problems.push("final output and proxy edit resolve to the same file");
  }
  if (finalDigest && proxyEditDigest && finalDigest === proxyEditDigest) {
    problems.push("final output content hash equals proxy edit hash");
  }
  if (!proxyEditExists) {
    warnings.push("Proxy edit is absent; proxy isolation can still pass, but reference preview is unavailable.");
  }

  const expectedExisting = rows.filter((row) => row.expected_exists).length;
  const expectedMissing = rows.length - expectedExisting;
  const decision = problems.length
    ? "proxy_misuse_blocked"
    : expectedMissing
      ? "proxy_isolation_passed_clips_pending"
      : "proxy_isolation_passed_expected_clips_present";
  const report = {
    date,
    package_id: manifest.package_id,
    package_manifest: rel(manifestPath),
    proxy_report: rel(proxyReportPath),
    decision,
    expected_clips: rows.length,
    expected_clips_existing: expectedExisting,
    expected_clips_missing: expectedMissing,
    proxy_rows: (proxyReport.rows || []).length,
    proxy_edit: rel(proxyEdit),
    proxy_edit_exists: proxyEditExists,
    final_output: rel(finalOutput),
    final_output_exists: finalOutputExists,
    problems,
    warnings,
    rows,
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Proxy Misuse Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    "",
    "This gate verifies that reference-only proxy animatic clips are not used as real video-model outputs.",
    "",
    "## Counts",
    "",
    `- Expected clips: ${rows.length}`,
    `- Expected clips existing: ${expectedExisting}`,
    `- Expected clips missing: ${expectedMissing}`,
    `- Proxy rows: ${report.proxy_rows}`,
    `- Proxy edit exists: ${proxyEditExists ? "yes" : "no"}`,
    `- Final output exists: ${finalOutputExists ? "yes" : "no"}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Warnings",
    "",
    warnings.length ? warnings.map((warning) => `- ${warning}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  console.log(JSON.stringify({
    decision,
    expected_clips_existing: expectedExisting,
    expected_clips_missing: expectedMissing,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));

  if (decision === "proxy_misuse_blocked") process.exit(1);
}

main();
