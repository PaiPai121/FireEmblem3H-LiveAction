#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-07-28";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const validatorPath = "/Users/zekun/.codex/skills/video-prompt-qa/scripts/validate_prompt_contract.js";
const outJson = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_video_prompt_contract_audit_2026-07-28.json");
const outMd = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_video_prompt_contract_audit_2026-07-28.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
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

function parseValidatorOutput(result) {
  const text = result.stdout || result.stderr || "";
  try {
    return JSON.parse(text);
  } catch {
    return {
      ok: false,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
    };
  }
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  if (!fs.existsSync(validatorPath)) throw new Error(`Missing video-prompt-qa validator: ${validatorPath}`);

  const manifest = readJson(manifestPath);
  const rows = [];
  const problems = [];

  for (const shot of manifest.shots || []) {
    const file = path.join(packageDir, shot.package_dir, "model_prompt.md");
    if (!fs.existsSync(file)) {
      problems.push(`${shot.shot}: missing model_prompt.md`);
      rows.push({ shot: shot.shot, file: rel(file), ok: false, missing_sections: ["model_prompt.md"] });
      continue;
    }
    const result = cp.spawnSync(process.execPath, [validatorPath, file, "--json"], {
      cwd: root,
      encoding: "utf8",
    });
    const parsed = parseValidatorOutput(result);
    const ok = result.status === 0 && parsed.ok === true;
    const missingSections = parsed.missing_sections || [];
    const weakSignals = parsed.weak_signals || [];
    if (!ok) {
      problems.push(`${shot.shot}: video prompt contract failed${missingSections.length ? ` missing ${missingSections.join(", ")}` : ""}`);
    }
    rows.push({
      order: shot.order,
      shot: shot.shot,
      file: rel(file),
      ok,
      missing_sections: missingSections,
      weak_signals: weakSignals,
      validator_status: result.status,
    });
  }

  const report = {
    date,
    package_manifest: rel(manifestPath),
    validator: validatorPath,
    checked_model_prompts: rows.length,
    passed: rows.filter((row) => row.ok).length,
    failed: rows.filter((row) => !row.ok).length,
    problems,
    rows,
    decision: problems.length ? "blocked_needs_revision" : "video_prompt_contract_passed",
  };

  writeJson(outJson, report);
  writeText(outMd, [
    "# Scene09 V3 Video Prompt Contract Audit",
    "",
    `Date: ${date}`,
    `Decision: ${report.decision}`,
    `Checked model prompts: ${report.checked_model_prompts}`,
    `Passed: ${report.passed}`,
    `Failed: ${report.failed}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Rows",
    "",
    "| Order | Shot | Result | Missing Sections |",
    "| --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row.order || ""} | ${row.shot} | ${row.ok ? "pass" : "fail"} | ${(row.missing_sections || []).join(", ") || "none"} |`),
    "",
  ].join("\n"));

  console.log(JSON.stringify({
    decision: report.decision,
    checked_model_prompts: report.checked_model_prompts,
    passed: report.passed,
    failed: report.failed,
    report_json: rel(outJson),
    report_md: rel(outMd),
  }, null, 2));
  if (problems.length) process.exit(1);
}

main();
