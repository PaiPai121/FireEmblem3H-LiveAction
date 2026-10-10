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
const outJson = path.join(reportDir, `scene09_v3_model_cli_template_positive_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_model_cli_template_positive_contract_${date}.md`);
const packageOutJson = path.join(packageDir, "model_cli_template_positive_contract.json");
const packageOutMd = path.join(packageDir, "model_cli_template_positive_contract.md");
const productionAuditJson = path.join(packageDir, "model_cli_template_audit.json");
const productionAuditMd = path.join(packageDir, "model_cli_template_audit.md");

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
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_v3_model_cli_contract."));
  const tmpPackage = path.join(tmpRoot, "package");
  const tmpReportDir = path.join(tmpRoot, "reports");
  fs.cpSync(packageDir, tmpPackage, { recursive: true });
  fs.mkdirSync(tmpReportDir, { recursive: true });
  return { tmpRoot, tmpPackage, tmpReportDir };
}

function runAudit(caseSpec, tmpPackage, tmpReportDir) {
  const env = {
    ...process.env,
    SCENE09_V3_PACKAGE_DIR: tmpPackage,
    SCENE09_V3_REPORT_DIR: tmpReportDir,
  };
  if (caseSpec.argvTemplate) {
    env.VIDEO_MODEL_CLI_ARGV_JSON = JSON.stringify(caseSpec.argvTemplate);
  } else {
    delete env.VIDEO_MODEL_CLI_ARGV_JSON;
  }
  const result = cp.spawnSync(process.execPath, ["scripts/audit_scene09_v3_model_cli_template.js"], {
    cwd: root,
    env,
    encoding: "utf8",
  });
  const packageReport = readJson(path.join(tmpPackage, "model_cli_template_audit.json"), {});
  const report = readJson(path.join(tmpReportDir, `scene09_v3_model_cli_template_audit_${date}.json`), {});
  return {
    id: caseSpec.id,
    expected_exit_zero: caseSpec.expectedExitZero,
    status: result.status,
    stdout_tail: tail(result.stdout),
    stderr_tail: tail(result.stderr),
    decision: report.decision || packageReport.decision || null,
    configured: report.configured ?? packageReport.configured ?? null,
    can_execute_with_local_cli: report.can_execute_with_local_cli ?? packageReport.can_execute_with_local_cli ?? null,
    problems: report.problems || packageReport.problems || [],
    warnings: report.warnings || packageReport.warnings || [],
    sample_command_argv: report.sample_command_argv || packageReport.sample_command_argv || null,
  };
}

function main() {
  if (!fs.existsSync(path.join(packageDir, "package_manifest.json"))) {
    throw new Error(`Missing package manifest in ${packageDir}`);
  }
  const productionBefore = {
    json: sha256Maybe(productionAuditJson),
    md: sha256Maybe(productionAuditMd),
  };
  const manifest = readJson(path.join(packageDir, "package_manifest.json"), {});
  const expected = Number(manifest.total_shots || (manifest.shots || []).length || 42);
  const problems = [];
  const tmp = copyPackageToTemp();
  const cases = [
    {
      id: "valid_full_template_passes",
      expectedExitZero: true,
      argvTemplate: [
        "video-cli",
        "i2v",
        "--shot-id",
        "{shot_id}",
        "--prompt",
        "{model_prompt}",
        "--audit-prompt",
        "{audit_prompt}",
        "--negative",
        "{negative_prompt}",
        "--first",
        "{start_frame}",
        "--key",
        "{key_frame}",
        "--last",
        "{end_frame}",
        "--duration",
        "{duration}",
        "--out",
        "{output}",
      ],
    },
    {
      id: "missing_output_placeholder_rejected",
      expectedExitZero: false,
      argvTemplate: [
        "video-cli",
        "i2v",
        "--prompt",
        "{model_prompt}",
        "--negative",
        "{negative_prompt}",
        "--first",
        "{start_frame}",
        "--key",
        "{key_frame}",
        "--last",
        "{end_frame}",
        "--duration",
        "{duration}",
      ],
    },
    {
      id: "unsupported_placeholder_rejected",
      expectedExitZero: false,
      argvTemplate: [
        "video-cli",
        "i2v",
        "--prompt",
        "{model_prompt}",
        "--negative",
        "{negative_prompt}",
        "--first",
        "{start_frame}",
        "--key",
        "{key_frame}",
        "--last",
        "{end_frame}",
        "--duration",
        "{duration}",
        "--out",
        "{output}",
        "--mystery",
        "{provider_job_id}",
      ],
    },
    {
      id: "placeholder_executable_rejected",
      expectedExitZero: false,
      argvTemplate: [
        "{prompt}",
        "--negative",
        "{negative_prompt}",
        "--first",
        "{start_frame}",
        "--key",
        "{key_frame}",
        "--last",
        "{end_frame}",
        "--duration",
        "{duration}",
        "--out",
        "{output}",
      ],
    },
  ];

  let caseRows = [];
  try {
    caseRows = cases.map((caseSpec) => runAudit(caseSpec, tmp.tmpPackage, tmp.tmpReportDir));
  } finally {
    fs.rmSync(tmp.tmpRoot, { recursive: true, force: true });
  }

  for (const row of caseRows) {
    const exitMatches = row.expected_exit_zero ? row.status === 0 : row.status !== 0;
    if (!exitMatches) {
      problems.push(`${row.id}: exit status ${row.status} did not match expected ${row.expected_exit_zero ? "success" : "failure"}`);
    }
    if (row.id === "valid_full_template_passes") {
      if (row.decision !== "model_cli_template_ready" || row.can_execute_with_local_cli !== true) {
        problems.push(`${row.id}: valid template did not become executable (${row.decision || "missing"})`);
      }
      if (!Array.isArray(row.sample_command_argv) || row.sample_command_argv.join(" ").includes("{")) {
        problems.push(`${row.id}: sample command did not fully render placeholders`);
      }
    } else if (row.decision !== "model_cli_template_blocked" || row.can_execute_with_local_cli !== false) {
      problems.push(`${row.id}: invalid template was not blocked (${row.decision || "missing"})`);
    }
  }

  const productionAfter = {
    json: sha256Maybe(productionAuditJson),
    md: sha256Maybe(productionAuditMd),
  };
  if (productionBefore.json !== productionAfter.json || productionBefore.md !== productionAfter.md) {
    problems.push("production model_cli_template_audit report changed during isolated contract test");
  }

  const decision = problems.length
    ? "model_cli_template_positive_contract_blocked"
    : "model_cli_template_positive_contract_passed";
  const report = {
    date,
    decision,
    package_manifest: rel(path.join(packageDir, "package_manifest.json")),
    package_id: manifest.package_id,
    expected_shots: expected,
    fixture_package_dir: tmp.tmpRoot,
    production_audit_sha256_before: productionBefore,
    production_audit_sha256_after: productionAfter,
    cases_checked: caseRows.length,
    case_rows: caseRows,
    problems,
  };
  writeJson(outJson, report);
  writeJson(packageOutJson, report);

  const md = [
    "# Scene09 V3 Model CLI Template Positive Contract",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Cases checked: ${caseRows.length}`,
    "",
    "This contract proves the model CLI template audit has a positive path for a complete local image-to-video command and rejects unsafe or incomplete templates without changing the production audit report.",
    "",
    "## Cases",
    "",
    ...caseRows.map((row) => `- ${row.id}: status ${row.status}; decision ${row.decision || "missing"}; problems ${row.problems.length}`),
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
    expected_shots: expected,
    cases_checked: caseRows.length,
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

main();
