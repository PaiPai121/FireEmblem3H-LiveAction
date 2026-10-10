#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const clipStructuralPath = path.join(reportDir, "scene09_v3_generated_clip_structural_audit_2026-08-01.json");
const clipProvenanceGatePath = path.join(reportDir, "scene09_v3_clip_provenance_gate_2026-08-01.json");
const finalEditStructuralPath = path.join(reportDir, "scene09_v3_final_edit_structural_audit_2026-08-01.json");
const completionAuditPath = path.join(reportDir, "scene09_v3_video_generation_run_completion_audit_2026-08-01.json");
const productionDeliveryTruthGatePath = path.join(reportDir, "scene09_v3_production_delivery_truth_gate_2026-08-01.json");
const finalOutputPath = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");
const outJson = path.join(reportDir, `scene09_v3_positive_contract_isolation_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_positive_contract_isolation_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "positive_contract_isolation_gate.json");
const packageOutMd = path.join(packageDir, "positive_contract_isolation_gate.md");

const CONTRACTS = [
  {
    id: "motion_self_audit_apply_positive_contract",
    file: "scene09_v3_motion_self_audit_apply_positive_contract_2026-08-01.json",
    expectedDecision: "motion_self_audit_apply_positive_contract_passed",
  },
  {
    id: "after_clip_return_resume_positive_contract",
    file: "scene09_v3_after_clip_return_resume_positive_contract_2026-08-01.json",
    expectedDecision: "after_clip_return_resume_positive_contract_passed",
  },
  {
    id: "final_concat_positive_contract",
    file: "scene09_v3_final_concat_positive_contract_2026-08-01.json",
    expectedDecision: "final_concat_positive_contract_passed",
  },
  {
    id: "final_edit_positive_contract",
    file: "scene09_v3_final_edit_positive_contract_2026-08-01.json",
    expectedDecision: "final_edit_positive_contract_passed",
  },
  {
    id: "video_generation_run_positive_contract",
    file: "scene09_v3_video_generation_run_positive_contract_2026-08-01.json",
    expectedDecision: "video_generation_run_positive_contract_passed",
  },
  {
    id: "model_cli_template_positive_contract",
    file: "scene09_v3_model_cli_template_positive_contract_2026-08-01.json",
    expectedDecision: "model_cli_template_positive_contract_passed",
  },
];

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

function absMaybe(value) {
  if (!value || typeof value !== "string") return null;
  return path.isAbsolute(value) ? path.resolve(value) : path.resolve(root, value);
}

function isUnder(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function collectFixturePaths(report) {
  const keys = [
    "fixture_package_dir",
    "fixture_report_dir",
    "fixture_download_dir",
    "fixture_final_output",
    "temp_package",
    "temp_report_dir",
  ];
  return keys
    .map((key) => ({ key, value: absMaybe(report?.[key]) }))
    .filter((item) => item.value);
}

function collectNestedFixturePaths(value, prefix = "") {
  const rows = [];
  if (!value || typeof value !== "object") return rows;
  if (Array.isArray(value)) {
    value.forEach((item, index) => rows.push(...collectNestedFixturePaths(item, `${prefix}[${index}]`)));
    return rows;
  }
  for (const [key, child] of Object.entries(value)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    const looksLikePathKey = /(^|_)(dir|path|file|output|package|root)$/i.test(key);
    const belongsToFixture = /fixture|temp_|tmp_/i.test(nextPrefix);
    if (belongsToFixture && looksLikePathKey && typeof child === "string") {
      const absolute = absMaybe(child);
      if (absolute) rows.push({ key: nextPrefix, value: absolute });
    }
    if (child && typeof child === "object") {
      rows.push(...collectNestedFixturePaths(child, nextPrefix));
    }
  }
  return rows;
}

function finalOutputChanged(report) {
  if (typeof report?.production_final_output_changed === "boolean") {
    return report.production_final_output_changed;
  }
  if (Object.hasOwn(report || {}, "production_existed_before") && Object.hasOwn(report || {}, "production_exists_after")) {
    return report.production_existed_before !== report.production_exists_after;
  }
  return false;
}

function main() {
  const manifest = readJson(manifestPath);
  if (!manifest) throw new Error(`Missing package manifest: ${manifestPath}`);
  const expected = Number(manifest.total_shots || (manifest.shots || []).length || 42);
  const clipStructural = readJson(clipStructuralPath, {});
  const clipProvenanceGate = readJson(clipProvenanceGatePath, {});
  const finalEditStructural = readJson(finalEditStructuralPath, {});
  const completionAudit = readJson(completionAuditPath, {});
  const productionDeliveryTruthGate = readJson(productionDeliveryTruthGatePath, {});
  const problems = [];
  const warnings = [];

  const expectedClipRows = (manifest.shots || []).map((shot) => {
    const absolute = absMaybe(shot.expected_clip);
    const exists = absolute ? fs.existsSync(absolute) : false;
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
      exists,
    };
  });
  const existingExpectedClips = expectedClipRows.filter((row) => row.exists).length;
  if (clipStructural.decision === "clips_pending") {
    if (existingExpectedClips !== 0 || Number(clipStructural.ready_clips || 0) !== 0) {
      problems.push(`clips_pending report conflicts with production expected clips: report ready ${clipStructural.ready_clips || 0}, filesystem existing ${existingExpectedClips}`);
    }
  } else if (existingExpectedClips > 0) {
    if (Number(clipStructural.ready_clips || 0) !== existingExpectedClips) {
      problems.push(`production clip structural count mismatch: report ready ${clipStructural.ready_clips || 0}, filesystem existing ${existingExpectedClips}`);
    }
    if (!/^clip_provenance_(ready_clips_pending|passed_all_expected_clips)$/.test(clipProvenanceGate.decision || "")) {
      problems.push(`production clips exist but clip provenance gate is ${clipProvenanceGate.decision || "missing"}`);
    }
    if (Number(clipProvenanceGate.problems?.length || 0) !== 0) {
      problems.push(`clip provenance gate has ${clipProvenanceGate.problems.length} problems`);
    }
  }

  const finalExists = fs.existsSync(finalOutputPath);
  if (finalEditStructural.decision === "final_edit_pending" && finalExists) {
    problems.push("final_edit_pending report conflicts with an existing production final output");
  }
  const productionIncomplete = existingExpectedClips < expected || !finalExists;
  if (productionIncomplete) {
    if (completionAudit.decision === "video_generation_run_complete") {
      problems.push("production completion audit reports video_generation_run_complete while real clips/final output are incomplete");
    }
    if (completionAudit.highest_completed_target !== "prompt_asset_package") {
      problems.push(`production completion highest target ${completionAudit.highest_completed_target || "missing"} is not prompt_asset_package while real clips/final output are incomplete`);
    }
    if (completionAudit.package_id && completionAudit.package_id !== manifest.package_id) {
      problems.push(`production completion package_id ${completionAudit.package_id} does not match manifest ${manifest.package_id}`);
    }
    if (completionAudit.final_output && absMaybe(completionAudit.final_output) !== path.resolve(finalOutputPath)) {
      problems.push(`production completion final_output ${completionAudit.final_output} does not match production final output ${rel(finalOutputPath)}`);
    }
    if (productionDeliveryTruthGate.can_claim_video_generation_run === true) {
      problems.push("production truth gate can_claim_video_generation_run=true while real clips/final output are incomplete");
    }
    if (productionDeliveryTruthGate.highest_truthful_target !== "prompt_asset_package") {
      problems.push(`production truth gate highest target ${productionDeliveryTruthGate.highest_truthful_target || "missing"} is not prompt_asset_package while incomplete`);
    }
  }

  const tmpDir = path.resolve(os.tmpdir());
  const contractRows = CONTRACTS.map((spec) => {
    const file = path.join(reportDir, spec.file);
    const report = readJson(file, null);
    const rowProblems = [];
    const fixturePaths = [
      ...collectFixturePaths(report),
      ...collectNestedFixturePaths(report),
    ];
    if (!report) {
      rowProblems.push("missing positive contract report");
    } else {
      if (report.decision !== spec.expectedDecision) {
        rowProblems.push(`decision ${report.decision || "missing"} is not ${spec.expectedDecision}`);
      }
      if (Number(report.problems?.length || 0) !== 0) {
        rowProblems.push(`contract reports ${report.problems.length} problems`);
      }
      if (finalOutputChanged(report)) {
        rowProblems.push("contract reports production final output changed");
      }
      for (const fixture of fixturePaths) {
        if (isUnder(root, fixture.value)) {
          rowProblems.push(`${fixture.key} points inside project root: ${rel(fixture.value)}`);
        }
        if (!isUnder(tmpDir, fixture.value)) {
          rowProblems.push(`${fixture.key} is not under OS temp dir: ${fixture.value}`);
        }
      }
      if (!fixturePaths.length && /positive_contract/.test(spec.id)) {
        warnings.push(`${spec.id} has no fixture path fields to inspect`);
      }
    }
    problems.push(...rowProblems.map((problem) => `${spec.id}: ${problem}`));
    return {
      id: spec.id,
      report_json: rel(file),
      decision: report?.decision || null,
      fixture_paths_checked: fixturePaths.map((item) => ({ key: item.key, path: item.value })),
      problems: rowProblems,
    };
  });

  const decision = problems.length
    ? "positive_contract_isolation_blocked"
    : "positive_contract_isolation_passed";
  const report = {
    date,
    decision,
    expected_shots: expected,
    production_expected_clips_existing: existingExpectedClips,
    production_clip_structural_decision: clipStructural.decision || null,
    production_clip_structural_ready: clipStructural.ready_clips || 0,
    production_clip_provenance_decision: clipProvenanceGate.decision || null,
    production_final_output: rel(finalOutputPath),
    production_final_output_exists: finalExists,
    production_final_edit_decision: finalEditStructural.decision || null,
    production_completion_decision: completionAudit.decision || null,
    production_completion_highest_target: completionAudit.highest_completed_target || null,
    production_truth_gate_decision: productionDeliveryTruthGate.decision || null,
    production_truth_gate_highest_target: productionDeliveryTruthGate.highest_truthful_target || null,
    production_truth_gate_can_claim_video_generation_run: productionDeliveryTruthGate.can_claim_video_generation_run ?? null,
    contracts_checked: contractRows.length,
    contract_rows: contractRows,
    problems,
    warnings,
  };
  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Positive Contract Isolation Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    "",
    "This gate verifies that temporary positive-contract tests remain isolated from production expected clips and the production final edit.",
    "",
    "## Production State",
    "",
    `- Expected clips existing: ${existingExpectedClips}/${expected}`,
    `- Clip structural decision: ${clipStructural.decision || "missing"}`,
    `- Clip provenance gate: ${clipProvenanceGate.decision || "missing"}`,
    `- Final output exists: ${finalExists ? "yes" : "no"}`,
    `- Final edit decision: ${finalEditStructural.decision || "missing"}`,
    `- Completion audit: ${completionAudit.decision || "missing"} / ${completionAudit.highest_completed_target || "missing"}`,
    `- Production truth gate: ${productionDeliveryTruthGate.decision || "missing"} / ${productionDeliveryTruthGate.highest_truthful_target || "missing"} / can claim ${productionDeliveryTruthGate.can_claim_video_generation_run ? "yes" : "no"}`,
    "",
    "## Contracts",
    "",
    ...contractRows.map((row) => `- ${row.id}: ${row.decision || "missing"}; fixture paths ${row.fixture_paths_checked.length}; problems ${row.problems.length}`),
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

  process.stdout.write(`${JSON.stringify({
    decision,
    expected_shots: expected,
    production_expected_clips_existing: `${existingExpectedClips}/${expected}`,
    production_final_output_exists: finalExists,
    contracts_checked: contractRows.length,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

main();
