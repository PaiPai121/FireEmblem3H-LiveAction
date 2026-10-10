#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const defaultOut = process.env.SCENE09_V3_FINAL_OUTPUT
  ? path.resolve(process.env.SCENE09_V3_FINAL_OUTPUT)
  : path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");
const reportJson = path.join(reportDir, `scene09_v3_after_clip_return_resume_${date}.json`);
const reportMd = path.join(reportDir, `scene09_v3_after_clip_return_resume_${date}.md`);
const packageReportJson = path.join(packageDir, "after_clip_return_resume.json");
const packageReportMd = path.join(packageDir, "after_clip_return_resume.md");

function usage() {
  return [
    "Usage:",
    "  node scripts/resume_scene09_v3_after_clip_return.js [options]",
    "",
    "Options:",
    "  --input <dir>              Scan provider/model returned video downloads, including the whole clip_return_intake root recursively.",
    "  --apply-ingest             Copy uniquely matched returned mp4 files into expected_clip paths.",
    "  --force-ingest             Allow ingest to overwrite existing expected_clip files.",
    "  --allow-loose-shot-name    Allow weak Shot034B.mp4-style matching; off by default.",
    "  --motion-proposal <jsonl>  Validate/apply Codex motion self-audit proposal rows.",
    "  --apply-motion             Write a valid motion proposal back through the strict apply gate.",
    "  --concat                   Attempt final concat only if all gates are already clear.",
    "  --out <mp4>                Final edit output path for --concat.",
    "",
    "This wrapper never fabricates clips and never treats structural mp4 checks as motion approval.",
  ].join("\n");
}

function parseArgs(argv) {
  const options = {
    inputDir: null,
    applyIngest: false,
    forceIngest: false,
    allowLooseShotName: false,
    motionProposal: null,
    applyMotion: false,
    concat: false,
    outFile: defaultOut,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--input") {
      const value = argv[i + 1];
      if (!value) throw new Error("--input requires a directory");
      options.inputDir = path.resolve(value);
      i += 1;
    } else if (arg === "--apply-ingest") {
      options.applyIngest = true;
    } else if (arg === "--force-ingest") {
      options.forceIngest = true;
    } else if (arg === "--allow-loose-shot-name") {
      options.allowLooseShotName = true;
    } else if (arg === "--motion-proposal") {
      const value = argv[i + 1];
      if (!value) throw new Error("--motion-proposal requires a JSONL file");
      options.motionProposal = path.resolve(value);
      i += 1;
    } else if (arg === "--apply-motion") {
      options.applyMotion = true;
    } else if (arg === "--concat") {
      options.concat = true;
    } else if (arg === "--out") {
      const value = argv[i + 1];
      if (!value) throw new Error("--out requires a path");
      options.outFile = path.resolve(value);
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      process.stdout.write(`${usage()}\n`);
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  if (options.applyIngest && !options.inputDir) {
    throw new Error("--apply-ingest requires --input");
  }
  if (options.forceIngest && !options.applyIngest) {
    throw new Error("--force-ingest requires --apply-ingest");
  }
  if (options.applyMotion && !options.motionProposal) {
    throw new Error("--apply-motion requires --motion-proposal");
  }
  return options;
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

function rel(file) {
  return path.relative(root, file);
}

function runStep(id, argv, options = {}) {
  const result = cp.spawnSync(argv[0], argv.slice(1), {
    cwd: root,
    encoding: "utf8",
  });
  const stdout = result.stdout || "";
  const stderr = result.stderr || "";
  const step = {
    id,
    argv,
    exit_code: result.status,
    ok: result.status === 0,
    allowed_to_fail: Boolean(options.allowFailure),
    stdout_tail: tail(stdout),
    stderr_tail: tail(stderr),
    parsed_stdout: parseLastJson(stdout),
  };
  if (result.error) {
    step.ok = false;
    step.error = result.error.message;
  }
  return step;
}

function tail(text) {
  const lines = String(text || "").trim().split(/\n/).filter(Boolean);
  return lines.slice(-40).join("\n");
}

function parseLastJson(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed.endsWith("}")) return null;
  const starts = [];
  for (let i = 0; i < trimmed.length; i += 1) {
    if (trimmed[i] === "{") starts.push(i);
  }
  for (const start of starts.reverse()) {
    try {
      return JSON.parse(trimmed.slice(start));
    } catch (_) {
      // Try the previous opening brace.
    }
  }
  return null;
}

function commandStep(report, id, argv, options = {}) {
  const step = runStep(id, argv, options);
  report.steps.push(step);
  const shouldThrow = !step.ok && !options.allowFailure;
  if (shouldThrow) {
    throw new Error(`${id} failed with exit ${step.exit_code}: ${step.stderr_tail || step.stdout_tail}`);
  }
  return step;
}

function deriveDecision(report) {
  const completion = readJson(path.join(reportDir, "scene09_v3_video_generation_run_completion_audit_2026-08-01.json"), {});
  const clipQa = readJson(path.join(reportDir, "scene09_v3_generated_clip_structural_audit_2026-08-01.json"), {});
  const motionAssets = readJson(path.join(reportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json"), {});
  const motionDecisions = readJson(path.join(reportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.json"), {});
  const revisionQueue = readJson(path.join(reportDir, "scene09_v3_clip_revision_queue_2026-07-28.json"), {});
  const finalConcatGate = readJson(path.join(reportDir, "scene09_v3_final_concat_gate_2026-08-01.json"), {});
  const finalEdit = readJson(path.join(reportDir, "scene09_v3_final_edit_structural_audit_2026-08-01.json"), {});
  const ingest = readJson(path.join(reportDir, "scene09_v3_clip_ingest_report_2026-07-28.json"), {});

  const failedRequired = report.steps.filter((step) => !step.ok && !step.allowed_to_fail);
  if (failedRequired.length) return "after_clip_return_resume_failed_required_step";
  if (completion.decision === "video_generation_run_complete") return "video_generation_run_complete";
  if (report.options.inputDir && !report.options.applyIngest && ingest.decision === "clip_ingest_dry_run_ready_to_apply") {
    return "clip_return_dry_run_ready_to_apply";
  }
  if (Number(clipQa.missing_clips || 0) > 0) return "after_clip_return_clips_pending";
  if (clipQa.decision === "clip_qa_blocked") return "after_clip_return_clip_file_qa_blocked";
  if (Number(motionAssets.missing_clips || 0) > 0 || Number(motionAssets.failed_clips || 0) > 0) {
    return "after_clip_return_motion_review_frames_blocked";
  }
  if (motionDecisions.decision !== "motion_review_passed_ready_for_concat") {
    return "after_clip_return_codex_motion_self_audit_required";
  }
  if (Number(revisionQueue.actionable_shots || 0) > 0) return "after_clip_return_revision_queue_not_clear";
  if (finalConcatGate.decision !== "final_concat_gate_passed_ready_for_project_pipeline_concat") {
    return "after_clip_return_final_concat_gate_blocked";
  }
  if (!report.options.concat) return "after_clip_return_ready_for_concat";
  if (finalEdit.decision !== "final_edit_structural_passed") return "after_clip_return_final_edit_pending_or_blocked";
  return "after_clip_return_complete_unexpected_state_check_completion";
}

function renderMarkdown(report) {
  return [
    "# Scene09 V3 After Clip Return Resume",
    "",
    `Date: ${date}`,
    `Decision: ${report.decision}`,
    `Package: \`${rel(packageDir)}\``,
    `Final output: \`${rel(report.options.outFile)}\``,
    "",
    "## Inputs",
    "",
    `- Download input: ${report.options.inputDir ? `\`${report.options.inputDir}\`` : "not provided; operating on current expected_clip paths"}`,
    `- Apply ingest: ${report.options.applyIngest ? "yes" : "no"}`,
    `- Motion proposal: ${report.options.motionProposal ? `\`${report.options.motionProposal}\`` : "not provided"}`,
    `- Apply motion decisions: ${report.options.applyMotion ? "yes" : "no"}`,
    `- Concat requested: ${report.options.concat ? "yes" : "no"}`,
    "",
    "## Summary",
    "",
    `- Completion decision: ${report.snapshot.video_generation_run_completion?.decision || "missing"}`,
    `- Completion checks: ${report.snapshot.video_generation_run_completion?.passed_checks || 0}/${report.snapshot.video_generation_run_completion?.total_checks || 0}`,
    `- Clips ready: ${report.snapshot.clip_structural?.ready_clips || 0}/${report.snapshot.clip_structural?.expected_clips || 0}`,
    `- Motion frames: ${report.snapshot.motion_review_assets?.extracted_clips || 0}/${report.snapshot.motion_review_assets?.expected_clips || 0}`,
    `- Revision queue actionable shots: ${report.snapshot.revision_queue?.actionable_shots ?? "unknown"}`,
    `- Final concat gate: ${report.snapshot.final_concat_gate?.decision || "missing"}`,
    `- Final edit audit: ${report.snapshot.final_edit_structural?.decision || "missing"}`,
    "",
    "## Steps",
    "",
    ...report.steps.map((step) => `- ${step.ok ? "PASS" : step.allowed_to_fail ? "BLOCKED" : "FAIL"} ${step.id}: exit ${step.exit_code}`),
    "",
    "## Rule",
    "",
    "This wrapper is a sequencing and evidence tool only. It does not create model clips, does not approve motion without Codex-reviewed signed evidence, and does not concatenate unless the project concat gate passes.",
    "",
  ].join("\n");
}

function persistReport(report) {
  report.snapshot = snapshot();
  report.decision = deriveDecision(report);
  writeJson(reportJson, report);
  writeJson(packageReportJson, report);
  writeText(reportMd, renderMarkdown(report));
  writeText(packageReportMd, renderMarkdown(report));
}

function snapshot() {
  return {
    clip_ingest: readJson(path.join(reportDir, "scene09_v3_clip_ingest_report_2026-07-28.json"), null),
    clip_structural: readJson(path.join(reportDir, "scene09_v3_generated_clip_structural_audit_2026-08-01.json"), null),
    motion_review_assets: readJson(path.join(reportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json"), null),
    motion_review_decisions: readJson(path.join(reportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.json"), null),
    revision_queue: readJson(path.join(reportDir, "scene09_v3_clip_revision_queue_2026-07-28.json"), null),
    clip_provenance_gate: readJson(path.join(reportDir, "scene09_v3_clip_provenance_gate_2026-08-01.json"), null),
    motion_self_audit_apply_gate: readJson(path.join(reportDir, "scene09_v3_motion_self_audit_apply_gate_2026-08-01.json"), null),
    final_concat_gate: readJson(path.join(reportDir, "scene09_v3_final_concat_gate_2026-08-01.json"), null),
    final_edit_structural: readJson(path.join(reportDir, "scene09_v3_final_edit_structural_audit_2026-08-01.json"), null),
    video_generation_run_completion: readJson(path.join(reportDir, "scene09_v3_video_generation_run_completion_audit_2026-08-01.json"), null),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const report = {
    date,
    package_dir: rel(packageDir),
    options: {
      ...options,
      inputDir: options.inputDir,
      motionProposal: options.motionProposal,
      outFile: options.outFile,
    },
    steps: [],
    decision: "not_run",
    snapshot: {},
  };

  if (options.inputDir) {
    const ingestArgs = [
      process.execPath,
      "scripts/ingest_scene09_v3_generated_clips.js",
      "--input",
      options.inputDir,
      options.applyIngest ? "--apply" : "--dry-run",
    ];
    if (options.forceIngest) ingestArgs.push("--force");
    if (options.allowLooseShotName) ingestArgs.push("--allow-loose-shot-name");
    commandStep(report, "ingest_returned_clips", ingestArgs, { allowFailure: true });
  }

  commandStep(report, "audit_generated_clips", [process.execPath, "scripts/audit_scene09_v3_generated_clips.js"], { allowFailure: true });
  commandStep(report, "build_motion_review_assets", [process.execPath, "scripts/build_scene09_v3_clip_motion_review_assets.js"], { allowFailure: true });
  commandStep(report, "build_motion_review_decision_template", [process.execPath, "scripts/build_scene09_v3_clip_motion_review_decision_template.js"], { allowFailure: true });

  if (options.motionProposal) {
    const applyArgs = [
      process.execPath,
      "scripts/apply_scene09_v3_motion_self_audit_decisions.js",
      options.motionProposal,
    ];
    if (options.applyMotion) applyArgs.push("--apply");
    commandStep(report, "apply_motion_self_audit_decisions", applyArgs, { allowFailure: true });
  } else {
    commandStep(report, "probe_motion_self_audit_apply_gate", [
      process.execPath,
      "scripts/apply_scene09_v3_motion_self_audit_decisions.js",
    ], { allowFailure: true });
  }

  commandStep(report, "audit_motion_review_decisions", [process.execPath, "scripts/audit_scene09_v3_clip_motion_review_decisions.js"], { allowFailure: true });
  commandStep(report, "build_clip_revision_queue", [process.execPath, "scripts/build_scene09_v3_clip_revision_queue.js"], { allowFailure: true });
  commandStep(report, "audit_clip_provenance_gate", [process.execPath, "scripts/audit_scene09_v3_clip_provenance_gate.js"], { allowFailure: true });
  commandStep(report, "audit_final_concat_gate", [process.execPath, "scripts/audit_scene09_v3_final_concat_gate.js"], { allowFailure: true });

  const concatGate = readJson(path.join(reportDir, "scene09_v3_final_concat_gate_2026-08-01.json"), {});
  if (options.concat && concatGate.decision === "final_concat_gate_passed_ready_for_project_pipeline_concat") {
    commandStep(report, "run_project_concat", [
      process.execPath,
      "scripts/run_scene09_v3_video_pipeline.js",
      "--skip-rebuild",
      "--concat",
      "--out",
      options.outFile,
    ], { allowFailure: false });
  } else if (options.concat) {
    report.steps.push({
      id: "run_project_concat",
      argv: [process.execPath, "scripts/run_scene09_v3_video_pipeline.js", "--skip-rebuild", "--concat", "--out", options.outFile],
      exit_code: null,
      ok: false,
      allowed_to_fail: true,
      skipped: true,
      stdout_tail: "",
      stderr_tail: `Skipped: final concat gate is ${concatGate.decision || "missing"}.`,
      parsed_stdout: null,
    });
  }

  commandStep(report, "audit_final_edit_structural", [
    process.execPath,
    "scripts/audit_scene09_v3_final_edit_structural.js",
    "--file",
    options.outFile,
  ], { allowFailure: true });
  commandStep(report, "audit_video_generation_run_completion", [
    process.execPath,
    "scripts/audit_scene09_v3_video_generation_run_completion.js",
  ], { allowFailure: true });

  persistReport(report);
  commandStep(report, "audit_current_status_consistency_gate_preflight", [
    process.execPath,
    "scripts/audit_scene09_v3_current_status_consistency_gate.js",
  ], { allowFailure: true });
  commandStep(report, "audit_report_freshness_gate_preflight", [
    process.execPath,
    "scripts/audit_scene09_v3_report_freshness_gate.js",
  ], { allowFailure: true });
  commandStep(report, "audit_video_generation_run_completion_after_status_refresh", [
    process.execPath,
    "scripts/audit_scene09_v3_video_generation_run_completion.js",
  ], { allowFailure: true });

  persistReport(report);
  commandStep(report, "audit_current_status_consistency_gate_final", [
    process.execPath,
    "scripts/audit_scene09_v3_current_status_consistency_gate.js",
  ], { allowFailure: true });
  commandStep(report, "audit_report_freshness_gate_final", [
    process.execPath,
    "scripts/audit_scene09_v3_report_freshness_gate.js",
  ], { allowFailure: true });
  commandStep(report, "audit_video_generation_run_completion_final", [
    process.execPath,
    "scripts/audit_scene09_v3_video_generation_run_completion.js",
  ], { allowFailure: true });

  commandStep(report, "build_handoff_index", [process.execPath, "scripts/build_scene09_v3_handoff_index.js"], { allowFailure: false });
  commandStep(report, "audit_handoff_index", [process.execPath, "scripts/audit_scene09_v3_handoff_index.js"], { allowFailure: false });
  persistReport(report);

  process.stdout.write(`${JSON.stringify({
    decision: report.decision,
    steps: report.steps.length,
    completion_decision: report.snapshot.video_generation_run_completion?.decision || "missing",
    completion_checks: `${report.snapshot.video_generation_run_completion?.passed_checks || 0}/${report.snapshot.video_generation_run_completion?.total_checks || 0}`,
    clips_ready: `${report.snapshot.clip_structural?.ready_clips || 0}/${report.snapshot.clip_structural?.expected_clips || 0}`,
    motion_frames: `${report.snapshot.motion_review_assets?.extracted_clips || 0}/${report.snapshot.motion_review_assets?.expected_clips || 0}`,
    final_concat_gate: report.snapshot.final_concat_gate?.decision || "missing",
    final_edit_audit: report.snapshot.final_edit_structural?.decision || "missing",
    report_json: rel(reportJson),
    package_report_json: rel(packageReportJson),
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
