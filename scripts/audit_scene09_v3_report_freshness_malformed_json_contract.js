#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const cp = require("child_process");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(reportDir, `scene09_v3_report_freshness_malformed_json_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_report_freshness_malformed_json_contract_${date}.md`);
const packageOutJson = path.join(packageDir, "report_freshness_malformed_json_contract.json");
const packageOutMd = path.join(packageDir, "report_freshness_malformed_json_contract.md");
const productionReportJson = path.join(packageDir, "report_freshness_gate.json");
const productionReportMd = path.join(packageDir, "report_freshness_gate.md");

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

function sha256Maybe(file) {
  if (!fs.existsSync(file)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function tail(text) {
  return String(text || "").trim().split(/\n/).slice(-16).join("\n");
}

function copyPackageToTemp() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_v3_report_freshness_contract."));
  const tmpPackage = path.join(tmpRoot, "package");
  const tmpReportDir = path.join(tmpRoot, "reports");
  fs.cpSync(packageDir, tmpPackage, { recursive: true });
  fs.mkdirSync(tmpReportDir, { recursive: true });
  return { tmpRoot, tmpPackage, tmpReportDir };
}

function runFreshnessGate(tmpPackage, tmpReportDir) {
  return cp.spawnSync(process.execPath, ["scripts/audit_scene09_v3_report_freshness_gate.js"], {
    cwd: root,
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: tmpPackage,
      SCENE09_V3_REPORT_DIR: tmpReportDir,
    },
    encoding: "utf8",
  });
}

function main() {
  if (!fs.existsSync(path.join(packageDir, "package_manifest.json"))) {
    throw new Error(`Missing package manifest in ${packageDir}`);
  }
  const manifest = readJson(path.join(packageDir, "package_manifest.json"), {});
  const expected = Number(manifest.total_shots || (manifest.shots || []).length || 42);
  const productionBefore = {
    json: sha256Maybe(productionReportJson),
    md: sha256Maybe(productionReportMd),
  };
  const problems = [];
  const tmp = copyPackageToTemp();
  let result;
  let contractReport = null;
  try {
    const malformedFile = path.join(tmp.tmpPackage, "operator_preflight_status.json");
    fs.writeFileSync(malformedFile, "{\"decision\":\"operator_preflight_ready\",");
    result = runFreshnessGate(tmp.tmpPackage, tmp.tmpReportDir);
    const tmpReportPath = path.join(tmp.tmpPackage, "report_freshness_gate.json");
    contractReport = fs.existsSync(tmpReportPath) ? readJson(tmpReportPath, null) : null;
  } finally {
    fs.rmSync(tmp.tmpRoot, { recursive: true, force: true });
  }

  if (result.status === 0) {
    problems.push("malformed package-local JSON did not block report freshness gate");
  }
  if (!contractReport) {
    problems.push("malformed JSON probe did not write a package-local report_freshness_gate.json");
  } else {
    const probeProblems = contractReport.problems || [];
    if (contractReport.decision !== "report_freshness_blocked") {
      problems.push(`probe decision ${contractReport.decision || "missing"} is not report_freshness_blocked`);
    }
    if (!probeProblems.some((problem) => /operator_preflight_status\.json/.test(problem) && /invalid JSON/.test(problem))) {
      problems.push("probe report did not identify operator_preflight_status.json as invalid JSON");
    }
  }

  const productionAfter = {
    json: sha256Maybe(productionReportJson),
    md: sha256Maybe(productionReportMd),
  };
  if (productionBefore.json !== productionAfter.json || productionBefore.md !== productionAfter.md) {
    problems.push("production report_freshness_gate report changed during isolated malformed JSON contract");
  }

  const decision = problems.length
    ? "report_freshness_malformed_json_contract_blocked"
    : "report_freshness_malformed_json_contract_passed";
  const report = {
    date,
    decision,
    package_id: manifest.package_id,
    package_manifest: rel(path.join(packageDir, "package_manifest.json")),
    expected_shots: expected,
    production_report_sha256_before: productionBefore,
    production_report_sha256_after: productionAfter,
    probe_status: result.status,
    probe_stdout_tail: tail(result.stdout),
    probe_stderr_tail: tail(result.stderr),
    probe_decision: contractReport?.decision || null,
    probe_problems: contractReport?.problems || [],
    problems,
  };
  writeJson(outJson, report);
  writeJson(packageOutJson, report);

  const md = [
    "# Scene09 V3 Report Freshness Malformed JSON Contract",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Probe exit status: ${result.status}`,
    `Probe decision: ${contractReport?.decision || "missing"}`,
    "",
    "This contract corrupts a temporary package-local report and proves the freshness gate emits an auditable blocker instead of crashing or modifying production reports.",
    "",
    "## Probe Problems",
    "",
    contractReport?.problems?.length ? contractReport.problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Contract Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  console.log(JSON.stringify({
    decision,
    probe_status: result.status,
    probe_decision: contractReport?.decision || null,
    probe_problems: contractReport?.problems?.length || 0,
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));

  if (problems.length) process.exit(1);
}

main();
