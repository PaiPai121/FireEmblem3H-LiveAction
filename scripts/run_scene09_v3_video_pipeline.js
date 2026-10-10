#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const cp = require("child_process");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-07-28";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const clipQaPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_generated_clip_structural_audit_2026-08-01.json");
const battleLedgerTimelinePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json");
const executionAssetIntegrityPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_execution_asset_integrity_2026-07-28.json");
const attritionTimelineAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_attrition_visibility_timeline_audit_2026-07-28.json");
const motionReviewAssetsPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_motion_review_assets_2026-07-28.json");
const motionReviewDecisionsPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_motion_review_decisions_2026-07-28.json");
const clipRevisionQueuePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_revision_queue_2026-07-28.json");
const clipIngestReportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_ingest_report_2026-07-28.json");
const proxyAnimaticReportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_proxy_animatic_clips_2026-07-28.json");
const modelSubmissionBatchesPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_model_submission_batches_2026-07-31.json");
const modelSubmissionBatchesAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_model_submission_batches_audit_2026-07-31.json");
const modelSubmissionIndexAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_model_submission_index_audit_2026-08-01.json");
const providerUploadBundlesAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_provider_upload_bundles_audit_2026-08-01.json");
const clipReturnIntakeAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_return_intake_audit_2026-08-01.json");
const clipReturnRoundtripAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_return_roundtrip_audit_2026-08-01.json");
const modelCliExecutionProvenanceAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_model_cli_execution_provenance_audit_2026-08-01.json");
const clipProvenanceGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_provenance_gate_2026-08-01.json");
const motionSelfAuditPacketAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_motion_self_audit_packet_audit_2026-08-01.json");
const motionSelfAuditEvidenceContractPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_motion_self_audit_evidence_contract_2026-08-01.json");
const motionSelfAuditUnsignedEvidenceRejectionPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_motion_self_audit_unsigned_evidence_rejection_2026-08-01.json");
const motionSelfAuditApplyPositiveContractPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_motion_self_audit_apply_positive_contract_2026-08-01.json");
const motionSelfAuditApplyGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_motion_self_audit_apply_gate_2026-08-01.json");
const fullDurationReleaseGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_full_duration_release_gate_2026-08-01.json");
const afterClipReturnResumePositiveContractPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_after_clip_return_resume_positive_contract_2026-08-01.json");
const finalConcatPositiveContractPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_final_concat_positive_contract_2026-08-01.json");
const finalEditPositiveContractPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_final_edit_positive_contract_2026-08-01.json");
const videoGenerationRunPositiveContractPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_video_generation_run_positive_contract_2026-08-01.json");
const narrativeHardConstraintsAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_narrative_hard_constraints_audit_2026-08-01.json");
const executablePromptSemanticsAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_executable_prompt_semantics_audit_2026-08-01.json");
const actualDeliverySurfaceAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_actual_delivery_surface_audit_2026-08-01.json");
const currentStatusConsistencyGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_current_status_consistency_gate_2026-08-01.json");
const providerPreflightConsistencyGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_provider_preflight_consistency_gate_2026-08-01.json");
const frameEvidenceAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_frame_evidence_audit_2026-08-01.json");
const highRiskContactSheetAsciiPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_high_risk_contact_sheet_ascii_2026-08-01.json");
const submissionContractGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_submission_contract_gate_2026-08-01.json");
const providerSubmissionFreshnessGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_provider_submission_freshness_gate_2026-08-01.json");
const modelCliTemplateAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_model_cli_template_audit_2026-08-01.json");
const modelCliTemplatePositiveContractPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_model_cli_template_positive_contract_2026-08-01.json");
const reportFreshnessGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_report_freshness_gate_2026-08-01.json");
const proxyMisuseGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_proxy_misuse_gate_2026-08-01.json");
const finalConcatGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_final_concat_gate_2026-08-01.json");
const finalEditStructuralAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_final_edit_structural_audit_2026-08-01.json");
const positiveContractIsolationGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_positive_contract_isolation_gate_2026-08-01.json");
const productionDeliveryTruthGatePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_production_delivery_truth_gate_2026-08-01.json");
const videoGenerationRunCompletionAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_video_generation_run_completion_audit_2026-08-01.json");
const reportJsonPath = path.join(root, `production_system/scene09_v3_attrition_package/scene09_v3_video_pipeline_run_${date}.json`);
const reportMdPath = path.join(root, `production_system/scene09_v3_attrition_package/scene09_v3_video_pipeline_run_${date}.md`);
const defaultOut = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");

function usage() {
  return [
    "Usage:",
    "  node scripts/run_scene09_v3_video_pipeline.js [--dry-run] [--execute] [--concat] [--skip-rebuild] [--out <mp4>] [--force]",
    "",
    "Default mode refreshes the package, validates handoff readiness, audits clips, and refreshes file:// galleries.",
    "Use --execute only after full_duration_release_gate passes and VIDEO_MODEL_CLI_ARGV_JSON is configured for a real image-to-video model.",
  ].join("\n");
}

function parseArgs(argv) {
  const options = {
    execute: false,
    concat: false,
    skipRebuild: false,
    force: false,
    outFile: defaultOut,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") continue;
    if (arg === "--execute") options.execute = true;
    else if (arg === "--concat") options.concat = true;
    else if (arg === "--skip-rebuild") options.skipRebuild = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--out") {
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
  return options;
}

function runStep(report, label, args, options = {}) {
  const startedAt = new Date().toISOString();
  const result = cp.spawnSync(args[0], args.slice(1), {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  });
  const step = {
    label,
    argv: args,
    status: result.status,
    ok: result.status === 0,
    started_at: startedAt,
    stdout_tail: tail(result.stdout || ""),
    stderr_tail: tail(result.stderr || ""),
  };
  if (result.error) {
    step.ok = false;
    step.error = result.error.message;
  }
  if (!step.ok && options.expectedFailure) {
    step.ok = true;
    step.expected_failure = true;
    step.expected_failure_reason = options.expectedFailure;
  }
  report.steps.push(step);
  if (!step.ok && !options.allowFailure) {
    throw new Error(`${label} failed with status ${step.status}: ${step.stderr_tail || step.stdout_tail}`);
  }
  return step;
}

function tail(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return "";
  return trimmed.split(/\n/).slice(-24).join("\n");
}

function markLastStepExpected(report, reason) {
  const step = report.steps[report.steps.length - 1];
  if (!step || step.ok) return;
  step.ok = true;
  step.expected_failure = true;
  step.expected_failure_reason = reason;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function expectedClipFileRows(manifest) {
  return [...(manifest.shots || [])]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((shot) => {
      const absolute = path.isAbsolute(shot.expected_clip || "")
        ? shot.expected_clip
        : path.join(root, shot.expected_clip || "");
      const exists = fs.existsSync(absolute);
      const stat = exists ? fs.statSync(absolute) : null;
      return {
        order: Number(shot.order),
        shot: shot.shot,
        id: shot.id,
        expected_clip: shot.expected_clip,
        exists,
        size_bytes: stat?.size ?? null,
        sha256: exists ? sha256File(absolute) : null,
      };
    });
}

function copyPackageToTemp() {
  if (!fs.existsSync(packageDir)) throw new Error(`Missing handoff package: ${packageDir}`);
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_v3_runner_probe."));
  const tmpPackage = path.join(tmpRoot, "package");
  fs.cpSync(packageDir, tmpPackage, { recursive: true });
  return { tmpRoot, tmpPackage };
}

function validateRunnerPlan(tmpPackage) {
  const planPath = path.join(tmpPackage, "execution_plan.json");
  const plan = readJson(planPath);
  const problems = [];
  if (plan.total_shots !== 42) problems.push(`runner plan total_shots=${plan.total_shots}, expected 42`);
  if (!plan.integrity?.ok) problems.push("runner plan integrity is not ok");
  for (const order of plan.work_orders || []) {
    if (path.basename(order.prompt || "") !== "model_prompt.md") {
      problems.push(`${order.shot_id}: runner prompt is not model_prompt.md`);
    }
    if (path.basename(order.audit_prompt || "") !== "prompt.md") {
      problems.push(`${order.shot_id}: runner audit_prompt is not prompt.md`);
    }
    if (String(order.expected_clip || "").includes("/delivery/scene09_v3_monitor_handoff_package_2026-07-27/episodes/")) {
      problems.push(`${order.shot_id}: expected_clip incorrectly resolves under delivery package`);
    }
  }
  return { ok: problems.length === 0, problems };
}

function concatClips(report, outFile) {
  const manifest = readJson(path.join(packageDir, "package_manifest.json"));
  const clips = manifest.shots.map((shot) => path.join(root, shot.expected_clip));
  const missing = clips.filter((file) => !fs.existsSync(file));
  if (missing.length) throw new Error(`Cannot concat: ${missing.length} expected clip(s) are missing.`);

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const concatList = path.join(path.dirname(outFile), "scene09_v3_attrition_final_edit.concat.txt");
  const lines = clips.map((file) => `file '${file.replace(/'/g, "'\\''")}'`).join("\n");
  writeText(concatList, `${lines}\n`);
  function writeConcatProvenance(mode, step) {
    const clipRows = expectedClipFileRows(manifest);
    const concatListText = fs.readFileSync(concatList, "utf8");
    const provenancePath = path.join(path.dirname(outFile), "scene09_v3_attrition_final_edit.provenance.json");
    writeJson(provenancePath, {
      date: new Date().toISOString(),
      generated_by: "run_scene09_v3_video_pipeline.concatClips",
      mode,
      final_output: path.relative(root, outFile),
      final_output_absolute: outFile,
      final_output_sha256: sha256File(outFile),
      concat_list_sidecar: path.relative(root, concatList),
      concat_list_sha256: sha256Text(concatListText),
      expected_clip_file_rows: clipRows,
      expected_clip_file_rows_digest_sha256: sha256Text(`${JSON.stringify(clipRows)}\n`),
      ffmpeg_step: {
        label: step.label,
        argv: step.argv,
        status: step.status,
        ok: step.ok,
      },
    });
    return provenancePath;
  }
  runStep(report, "ffmpeg_concat_copy", [
    "ffmpeg",
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatList,
    "-c",
    "copy",
    outFile,
  ], { allowFailure: true });
  const copyStep = report.steps[report.steps.length - 1];
  if (copyStep.ok) {
    return { out_file: outFile, concat_list: concatList, provenance: writeConcatProvenance("copy", copyStep), mode: "copy" };
  }

  runStep(report, "ffmpeg_concat_reencode", [
    "ffmpeg",
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatList,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-movflags",
    "+faststart",
    outFile,
  ]);
  const reencodeStep = report.steps[report.steps.length - 1];
  return { out_file: outFile, concat_list: concatList, provenance: writeConcatProvenance("reencode", reencodeStep), mode: "reencode" };
}

function writeReport(report) {
  writeJson(reportJsonPath, report);
  const lines = [
    "# Scene09 V3 Video Pipeline Run",
    "",
    `Date: ${report.date}`,
    `Decision: ${report.decision}`,
    `Mode: ${report.options.execute ? "execute" : "dry_run"}`,
    `Model CLI configured: ${report.model_cli_configured ? "yes" : "no"}`,
    `Final output: \`${path.relative(root, report.options.outFile)}\``,
    "",
    "## Status",
    "",
    `- Highest completed target: ${report.highest_completed_target}`,
    `- Expected clips: ${report.clip_status?.expected_clips ?? "unknown"}`,
    `- Ready clips: ${report.clip_status?.ready_clips ?? "unknown"}`,
    `- Missing clips: ${report.clip_status?.missing_clips ?? "unknown"}`,
    `- Failed clips: ${report.clip_status?.failed_clips ?? "unknown"}`,
    `- Generated clip structural audit: ${report.clip_status?.decision ?? "not_run"}`,
    `- Battle ledger timeline: ${report.battle_ledger_timeline?.decision ?? "unknown"}`,
    `- Execution asset integrity: ${report.execution_asset_integrity?.decision ?? "unknown"}`,
    `- Execution assets ready: ${report.execution_asset_integrity?.shots_ready ?? "unknown"}/${report.execution_asset_integrity?.total_shots ?? "unknown"}`,
    `- Attrition visibility timeline: ${report.attrition_visibility_timeline?.decision ?? "unknown"}`,
    `- Motion review assets: ${report.motion_review_assets?.decision ?? "unknown"}`,
    `- Motion review frames extracted: ${report.motion_review_assets?.extracted_clips ?? "unknown"}`,
    `- Motion review decisions: ${report.motion_review_decisions?.decision ?? "unknown"}`,
    `- Motion review passed: ${report.motion_review_decisions?.summary?.motion_review_passed ?? "unknown"}`,
    `- Clip revision queue: ${report.clip_revision_queue?.decision ?? "unknown"}`,
    `- Actionable revision/generation shots: ${report.clip_revision_queue?.actionable_shots ?? "unknown"}`,
    `- Motion self-audit packet: ${report.motion_self_audit_packet?.decision ?? "unknown"}`,
    `- Motion self-audit evidence contract: ${report.motion_self_audit_evidence_contract?.decision ?? "unknown"}`,
    `- Motion self-audit unsigned evidence rejection: ${report.motion_self_audit_unsigned_evidence_rejection?.decision ?? "unknown"}`,
    `- Clip ingest report: ${report.clip_ingest?.decision ?? "not_run"}`,
    `- Proxy animatic clips: ${report.proxy_animatic?.decision ?? "not_run"}`,
    `- Model submission batches: ${report.model_submission_batches?.decision ?? "unknown"}`,
    `- Model submission batch audit: ${report.model_submission_batch_audit?.decision ?? "unknown"}`,
    `- Model submission index: ${report.model_submission_index?.decision ?? "unknown"}`,
    `- Model CLI template audit: ${report.model_cli_template_audit?.decision ?? "unknown"}`,
    `- Model CLI template positive contract: ${report.model_cli_template_positive_contract?.decision ?? "unknown"}`,
    `- High-risk contact sheet ASCII: ${report.high_risk_contact_sheet_ascii?.decision ?? "unknown"}`,
    `- Frame evidence audit: ${report.frame_evidence_audit?.decision ?? "unknown"}`,
    `- Submission contract gate: ${report.submission_contract_gate?.decision ?? "unknown"}`,
    `- Provider upload bundles: ${report.provider_upload_bundles?.decision ?? "unknown"}; executable negative semantics ${report.provider_upload_bundles?.executable_negative_semantics_files_checked ?? "unknown"}`,
    `- Provider submission freshness gate: ${report.provider_submission_freshness_gate?.decision ?? "unknown"}`,
    `- Full-duration release gate: ${report.full_duration_release_gate?.decision ?? "unknown"}; can release ${report.full_duration_release_gate?.can_release_full_duration ? "yes" : "no"}`,
    `- Narrative hard constraints: ${report.narrative_hard_constraints?.decision ?? "unknown"}`,
    `- Executable prompt semantics: ${report.executable_prompt_semantics?.decision ?? "unknown"}`,
    `- Actual delivery surface audit: ${report.actual_delivery_surface?.decision ?? "unknown"}`,
    `- Current status consistency gate: ${report.current_status_consistency_gate?.decision ?? "unknown"}`,
    `- Provider preflight consistency gate: ${report.provider_preflight_consistency_gate?.decision ?? "unknown"}`,
    `- Clip return roundtrip: ${report.clip_return_roundtrip?.decision ?? "unknown"}`,
    `- Clip provenance gate: ${report.clip_provenance_gate?.decision ?? "unknown"}`,
    `- After clip return resume positive contract: ${report.after_clip_return_resume_positive_contract?.decision ?? "unknown"}`,
    `- After clip return fixture shape: ${report.after_clip_return_resume_positive_contract?.fixture_download_shape ?? "unknown"}`,
    `- Final concat positive contract: ${report.final_concat_positive_contract?.decision ?? "unknown"}`,
    `- Final edit positive contract: ${report.final_edit_positive_contract?.decision ?? "unknown"}`,
    `- Video generation run positive contract: ${report.video_generation_run_positive_contract?.decision ?? "unknown"}`,
    `- Positive contract isolation gate: ${report.positive_contract_isolation_gate?.decision ?? "unknown"}`,
    `- Production delivery truth gate: ${report.production_delivery_truth_gate?.decision ?? "unknown"}`,
    `- Report freshness gate: ${report.report_freshness_gate?.decision ?? "unknown"}`,
    `- Proxy misuse gate: ${report.proxy_misuse_gate?.decision ?? "unknown"}`,
    `- Final concat gate: ${report.final_concat_gate?.decision ?? "unknown"}`,
    `- Final edit structural audit: ${report.final_edit_structural_audit?.decision ?? "unknown"}`,
    `- Video generation run completion audit: ${report.video_generation_run_completion?.decision ?? "unknown"}`,
    "",
    "## Steps",
    "",
    ...report.steps.map((step) => {
      const status = step.expected_failure ? "EXPECTED BLOCK" : (step.ok ? "PASS" : "FAIL");
      const reason = step.expected_failure_reason ? ` - ${step.expected_failure_reason}` : "";
      return `- ${status} ${step.label}${reason}`;
    }),
    "",
    "## Notes",
    "",
    ...report.notes.map((note) => `- ${note}`),
    "",
  ];
  writeText(reportMdPath, lines.join("\n"));
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const report = {
    date,
    options,
    model_cli_configured: Boolean(process.env.VIDEO_MODEL_CLI_ARGV_JSON),
    highest_completed_target: "unknown",
    decision: "running",
    steps: [],
    notes: [],
  };

  try {
    const node = process.execPath;
    if (!options.skipRebuild) {
      runStep(report, "build_attrition_prompt_package", [node, "scripts/build_scene09_v3_attrition_prompt_package.js"]);
      runStep(report, "restore_hanneman_lane_shims_after_prompt_build", [node, "scripts/restore_scene09_034B_hanneman_contract_shims_20260731.js"]);
      runStep(report, "apply_hanneman_lane_contract_after_prompt_build", [node, "scripts/apply_scene09_034B_empty_objective_authoritative_current.js"]);
      runStep(report, "apply_golden_deer_weapon_contract_after_prompt_build", [node, "scripts/apply_scene09_034E_golden_deer_weapons_authoritative.js"]);
      runStep(report, "apply_blue_lions_core_victory_contract_after_prompt_build", [node, "scripts/apply_scene09_034G_core_victory_authoritative.js"]);
      runStep(report, "build_monitor_handoff_package", [node, "scripts/build_scene09_v3_monitor_handoff_package.js"]);
      runStep(report, "restore_hanneman_lane_shims_after_monitor_handoff", [node, "scripts/restore_scene09_034B_hanneman_contract_shims_20260731.js"]);
      runStep(report, "apply_hanneman_lane_contract_after_monitor_handoff", [node, "scripts/apply_scene09_034B_empty_objective_authoritative_current.js"]);
      runStep(report, "apply_golden_deer_weapon_contract_after_monitor_handoff", [node, "scripts/apply_scene09_034E_golden_deer_weapons_authoritative.js"]);
      runStep(report, "apply_blue_lions_core_victory_contract_after_monitor_handoff", [node, "scripts/apply_scene09_034G_core_victory_authoritative.js"]);
      runStep(report, "sync_delivery_payload_after_current_contracts", [node, "scripts/sync_scene09_v3_delivery_payload_current.js"]);
      runStep(report, "restore_hanneman_lane_shims_after_sync", [node, "scripts/restore_scene09_034B_hanneman_contract_shims_20260731.js"]);
      runStep(report, "apply_hanneman_lane_contract_after_sync", [node, "scripts/two_students_patch.js"]);
      runStep(report, "sync_delivery_payload_after_034b_current_patch", [node, "scripts/sync_scene09_v3_delivery_payload_current.js"]);
      runStep(report, "audit_shot034b_source_contract", [node, "scripts/audit_scene09_034B_source_contract_20260731.js"]);
      runStep(report, "sync_delivery_payload_after_shot034b_source_contract", [node, "scripts/sync_scene09_v3_delivery_payload_current.js"]);
      runStep(report, "build_battle_ledger_timeline", [node, "scripts/build_scene09_v3_battle_ledger_timeline.js"]);
      runStep(report, "build_execution_asset_integrity", [node, "scripts/build_scene09_v3_execution_asset_integrity.js"]);
      runStep(report, "build_proxy_animatic_clips", [node, "scripts/build_scene09_v3_proxy_animatic_clips.js"]);
      runStep(report, "build_main_gallery", [node, "scripts/build_scene09_rebuild_v2_gallery.js"]);
      runStep(report, "patch_main_gallery_current_034b", [node, "scripts/patch_scene09_rebuild_v2_gallery_current.js"]);
      runStep(report, "build_clip_review_gallery", [node, "scripts/build_scene09_v3_clip_review_gallery.js"]);
      runStep(report, "build_model_submission_batches", [node, "scripts/build_scene09_v3_model_submission_batches.js"]);
      runStep(report, "build_model_submission_index", [node, "scripts/build_scene09_v3_model_submission_index.js"]);
      runStep(report, "patch_model_submission_index_current_034b", [node, "scripts/patch_scene09_v3_model_submission_index_current.js"]);
      runStep(report, "build_p0_reference_boards_chinese_titles", [node, "scripts/build_scene09_p0_reference_boards.js"]);
      runStep(report, "audit_p0_reference_boards_chinese_titles", [node, "scripts/audit_scene09_p0_reference_boards_titles.js"]);
      runStep(report, "build_motion_probe_operator_tracker_before_web_media_refs", [node, "scripts/build_scene09_v3_motion_probe_operator_tracker.js"]);
      runStep(report, "audit_motion_probe_operator_tracker_before_web_media_refs", [node, "scripts/audit_scene09_v3_motion_probe_operator_tracker.js"]);
      runStep(report, "build_motion_probe_submission_manifest_before_web_media_refs", [node, "scripts/build_scene09_v3_motion_probe_submission_manifest.js"]);
      runStep(report, "build_motion_probe_upload_pack_before_web_media_refs", [node, "scripts/build_scene09_v3_motion_probe_upload_pack.js"]);
      runStep(report, "build_ep02_storyboard_data_before_web_media_refs", [node, "scripts/build_ep02_storyboard_data.js"]);
      runStep(report, "validate_main_panel_smoke_before_handoff_index", [node, "scripts/validate_main_panel_smoke.js"]);
      runStep(report, "audit_ep02_web_battle_event_panel_before_handoff_index", [node, "scripts/audit_ep02_web_battle_event_panel.js"]);
      runStep(report, "audit_ep02_web_media_refs_before_handoff_index", [node, "scripts/audit_ep02_web_media_refs.js"]);
      runStep(report, "audit_web_submission_prompt_surface_before_handoff_index", [node, "scripts/audit_scene09_v3_web_submission_prompt_surface.js", "--skip-handoff-index"]);
      runStep(report, "build_operator_next_steps_before_handoff_index", [node, "scripts/build_scene09_v3_operator_next_steps.js"]);
      runStep(report, "audit_handoff_control_reports_before_handoff_index", [node, "scripts/audit_scene09_v3_handoff_control_reports.js"]);
      runStep(report, "build_handoff_index", [node, "scripts/build_scene09_v3_handoff_index.js"]);
      runStep(report, "patch_handoff_index_current_034b", [node, "scripts/patch_scene09_v3_handoff_index_current.js"]);
      runStep(report, "sync_delivery_payload_after_index_patches", [node, "scripts/sync_scene09_v3_delivery_payload_current.js"]);
      runStep(report, "rebuild_model_submission_batches_after_index_patches", [node, "scripts/build_scene09_v3_model_submission_batches.js"]);
      runStep(report, "rebuild_model_submission_index_after_index_patches", [node, "scripts/build_scene09_v3_model_submission_index.js"]);
      runStep(report, "rebuild_operator_next_steps_after_index_patches", [node, "scripts/build_scene09_v3_operator_next_steps.js"]);
      runStep(report, "rebuild_audit_handoff_control_reports_after_index_patches", [node, "scripts/audit_scene09_v3_handoff_control_reports.js"]);
      runStep(report, "rebuild_handoff_index_after_index_patches", [node, "scripts/build_scene09_v3_handoff_index.js"]);
      runStep(report, "audit_web_submission_prompt_surface_after_handoff_index", [node, "scripts/audit_scene09_v3_web_submission_prompt_surface.js"]);
      runStep(report, "rebuild_handoff_index_after_web_submission_prompt_surface", [node, "scripts/build_scene09_v3_handoff_index.js"]);
    }

    runStep(report, "audit_model_prompts", [node, "scripts/audit_scene09_v3_model_prompts.js"]);
    runStep(report, "audit_model_prompt_completeness", [node, "scripts/audit_scene09_v3_model_prompt_completeness.js"]);
    runStep(report, "audit_e2e_consistency", [node, "scripts/audit_scene09_v3_e2e_consistency.js"]);
    runStep(report, "audit_video_prompt_contract", [node, "scripts/audit_scene09_v3_video_prompt_contract.js"]);
    runStep(report, "audit_submission_payload", [node, "scripts/audit_scene09_v3_submission_payload.js"]);
    runStep(report, "audit_submission_contract_gate", [node, "scripts/audit_scene09_v3_submission_contract_gate.js"]);
    const submissionContractGate = fs.existsSync(submissionContractGatePath) ? readJson(submissionContractGatePath) : null;
    report.submission_contract_gate = submissionContractGate ? {
      decision: submissionContractGate.decision,
      expected_shots: submissionContractGate.expected_shots,
      rows_checked: submissionContractGate.rows_checked,
      execution_plan_rows: submissionContractGate.execution_plan_rows,
      submission_queue_rows: submissionContractGate.submission_queue_rows,
      submission_payload_rows: submissionContractGate.submission_payload_rows,
      problems: submissionContractGate.problems?.length || 0,
      report_json: path.relative(root, submissionContractGatePath),
    } : null;
    runStep(report, "build_high_risk_contact_sheet_ascii", ["python3", "scripts/build_scene09_v3_high_risk_contact_sheet_ascii.py"]);
    const highRiskContactSheetAscii = fs.existsSync(highRiskContactSheetAsciiPath) ? readJson(highRiskContactSheetAsciiPath) : null;
    report.high_risk_contact_sheet_ascii = highRiskContactSheetAscii ? {
      decision: highRiskContactSheetAscii.decision,
      rows: highRiskContactSheetAscii.rows?.length || 0,
      image: highRiskContactSheetAscii.image,
      package_image: highRiskContactSheetAscii.package_image,
      problems: highRiskContactSheetAscii.problems?.length || 0,
      report_json: path.relative(root, highRiskContactSheetAsciiPath),
    } : null;
    runStep(report, "build_frame_evidence_audit", [node, "scripts/build_scene09_v3_frame_evidence_audit.js"]);
    runStep(report, "build_per_frame_visual_review_matrix", [node, "scripts/build_scene09_v3_per_frame_visual_review_matrix.js"]);
    runStep(report, "audit_per_frame_visual_review_matrix", [node, "scripts/audit_scene09_v3_per_frame_visual_review_matrix.js"]);
    const frameEvidenceAudit = fs.existsSync(frameEvidenceAuditPath) ? readJson(frameEvidenceAuditPath) : null;
    report.frame_evidence_audit = frameEvidenceAudit ? {
      decision: frameEvidenceAudit.decision,
      shots_checked: frameEvidenceAudit.shots_checked,
      frames_checked: frameEvidenceAudit.frames_checked,
      frames_passed: frameEvidenceAudit.frames_passed,
      problems: frameEvidenceAudit.problems?.length || 0,
      warnings: frameEvidenceAudit.warnings?.length || 0,
      report_json: path.relative(root, frameEvidenceAuditPath),
    } : null;
    runStep(report, "audit_model_submission_batches", [node, "scripts/audit_scene09_v3_model_submission_batches.js"]);
    const modelSubmissionBatches = fs.existsSync(modelSubmissionBatchesPath) ? readJson(modelSubmissionBatchesPath) : null;
    report.model_submission_batches = modelSubmissionBatches ? {
      decision: modelSubmissionBatches.decision,
      total_shots: modelSubmissionBatches.total_shots,
      total_batches: modelSubmissionBatches.total_batches,
      batch_size: modelSubmissionBatches.batch_size,
      expected_downloads_csv: modelSubmissionBatches.expected_downloads_csv,
      report_json: path.relative(root, modelSubmissionBatchesPath),
    } : null;
    const modelSubmissionBatchAudit = fs.existsSync(modelSubmissionBatchesAuditPath) ? readJson(modelSubmissionBatchesAuditPath) : null;
    report.model_submission_batch_audit = modelSubmissionBatchAudit ? {
      decision: modelSubmissionBatchAudit.decision,
      batches_checked: modelSubmissionBatchAudit.batches_checked,
      rows_checked: modelSubmissionBatchAudit.rows_checked,
      problems: modelSubmissionBatchAudit.problems?.length || 0,
      report_json: path.relative(root, modelSubmissionBatchesAuditPath),
    } : null;
    runStep(report, "audit_model_submission_index", [node, "scripts/audit_scene09_v3_model_submission_index.js"]);
    const modelSubmissionIndexAudit = fs.existsSync(modelSubmissionIndexAuditPath) ? readJson(modelSubmissionIndexAuditPath) : null;
    report.model_submission_index = modelSubmissionIndexAudit ? {
      decision: modelSubmissionIndexAudit.decision,
      links_checked: modelSubmissionIndexAudit.links_checked,
      shot_cards: modelSubmissionIndexAudit.shot_cards,
      batch_sections: modelSubmissionIndexAudit.batch_sections,
      problems: modelSubmissionIndexAudit.problems?.length || 0,
      report_json: path.relative(root, modelSubmissionIndexAuditPath),
    } : null;
    runStep(report, "audit_execution_asset_integrity", [node, "scripts/build_scene09_v3_execution_asset_integrity.js"]);
    const executionAssetIntegrity = fs.existsSync(executionAssetIntegrityPath) ? readJson(executionAssetIntegrityPath) : null;
    report.execution_asset_integrity = executionAssetIntegrity ? {
      decision: executionAssetIntegrity.decision,
      total_shots: executionAssetIntegrity.total_shots,
      shots_ready: executionAssetIntegrity.shots_ready,
      shots_blocked: executionAssetIntegrity.shots_blocked,
      problems: executionAssetIntegrity.problems?.length || 0,
      warnings: executionAssetIntegrity.warnings?.length || 0,
      report_json: path.relative(root, executionAssetIntegrityPath),
    } : null;
    runStep(report, "audit_story_constraints", [node, "scripts/audit_scene09_v3_story_constraints.js"]);
    runStep(report, "audit_narrative_hard_constraints", [node, "scripts/audit_scene09_v3_narrative_hard_constraints.js"]);
    const narrativeHardConstraintsAudit = fs.existsSync(narrativeHardConstraintsAuditPath) ? readJson(narrativeHardConstraintsAuditPath) : null;
    report.narrative_hard_constraints = narrativeHardConstraintsAudit ? {
      decision: narrativeHardConstraintsAudit.decision,
      shots_checked: narrativeHardConstraintsAudit.shots_checked,
      checks_passed: narrativeHardConstraintsAudit.checks_passed,
      checks_total: narrativeHardConstraintsAudit.checks_total,
      problems: narrativeHardConstraintsAudit.problems?.length || 0,
      warnings: narrativeHardConstraintsAudit.warnings?.length || 0,
      report_json: path.relative(root, narrativeHardConstraintsAuditPath),
    } : null;
    runStep(report, "audit_executable_prompt_semantics", [node, "scripts/audit_scene09_v3_executable_prompt_semantics.js"]);
    const executablePromptSemanticsAudit = fs.existsSync(executablePromptSemanticsAuditPath) ? readJson(executablePromptSemanticsAuditPath) : null;
    report.executable_prompt_semantics = executablePromptSemanticsAudit ? {
      decision: executablePromptSemanticsAudit.decision,
      shots_checked: executablePromptSemanticsAudit.shots_checked,
      problems: executablePromptSemanticsAudit.problems?.length || 0,
      warnings: executablePromptSemanticsAudit.warnings?.length || 0,
      report_json: path.relative(root, executablePromptSemanticsAuditPath),
    } : null;
    runStep(report, "audit_prompt_frame_consistency", [node, "scripts/audit_scene09_prompt_frame_consistency.js"]);
    runStep(report, "audit_actual_delivery_surface", [node, "scripts/audit_scene09_v3_actual_delivery_surface_20260731.js"]);
    const actualDeliverySurfaceAudit = fs.existsSync(actualDeliverySurfaceAuditPath) ? readJson(actualDeliverySurfaceAuditPath) : null;
    report.actual_delivery_surface = actualDeliverySurfaceAudit ? {
      decision: actualDeliverySurfaceAudit.decision,
      problems: actualDeliverySurfaceAudit.problems?.length || 0,
      evidence: actualDeliverySurfaceAudit.evidence || [],
      report_json: path.relative(root, actualDeliverySurfaceAuditPath),
    } : null;
    runStep(report, "audit_battle_ledger_timeline", [node, "scripts/build_scene09_v3_battle_ledger_timeline.js"]);
    const battleLedgerTimeline = fs.existsSync(battleLedgerTimelinePath) ? readJson(battleLedgerTimelinePath) : null;
    report.battle_ledger_timeline = battleLedgerTimeline ? {
      decision: battleLedgerTimeline.decision,
      shots: battleLedgerTimeline.shots,
      problems: battleLedgerTimeline.problems?.length || 0,
      report_json: path.relative(root, battleLedgerTimelinePath),
    } : null;
    runStep(report, "audit_attrition_visibility_timeline", [node, "scripts/audit_scene09_v3_attrition_visibility_timeline.js"]);
    const attritionTimeline = fs.existsSync(attritionTimelineAuditPath) ? readJson(attritionTimelineAuditPath) : null;
    report.attrition_visibility_timeline = attritionTimeline ? {
      decision: attritionTimeline.decision,
      shots: attritionTimeline.shots,
      failures: attritionTimeline.problems?.length || 0,
      warnings: attritionTimeline.warnings?.length || 0,
      report_json: path.relative(root, attritionTimelineAuditPath),
    } : null;
    runStep(report, "audit_html_battle_ledgers", [node, "scripts/audit_scene09_v3_html_battle_ledgers.js"]);
    runStep(report, "audit_gallery_links", [node, "scripts/audit_scene09_v3_gallery_links.js"]);
    runStep(report, "audit_clip_review_links", [node, "scripts/audit_scene09_v3_clip_review_links.js"]);
    runStep(report, "audit_handoff_index", [node, "scripts/audit_scene09_v3_handoff_index.js"]);
    runStep(report, "audit_model_cli_template", [node, "scripts/audit_scene09_v3_model_cli_template.js"]);
    const modelCliTemplateAudit = fs.existsSync(modelCliTemplateAuditPath) ? readJson(modelCliTemplateAuditPath) : null;
    report.model_cli_template_audit = modelCliTemplateAudit ? {
      decision: modelCliTemplateAudit.decision,
      configured: modelCliTemplateAudit.configured,
      can_execute_with_local_cli: modelCliTemplateAudit.can_execute_with_local_cli,
      problems: modelCliTemplateAudit.problems?.length || 0,
      warnings: modelCliTemplateAudit.warnings?.length || 0,
      report_json: path.relative(root, modelCliTemplateAuditPath),
    } : null;
    runStep(report, "audit_model_cli_template_positive_contract", [
      node,
      "scripts/audit_scene09_v3_model_cli_template_positive_contract.js",
    ]);
    const modelCliTemplatePositiveContract = fs.existsSync(modelCliTemplatePositiveContractPath) ? readJson(modelCliTemplatePositiveContractPath) : null;
    report.model_cli_template_positive_contract = modelCliTemplatePositiveContract ? {
      decision: modelCliTemplatePositiveContract.decision,
      expected_shots: modelCliTemplatePositiveContract.expected_shots,
      cases_checked: modelCliTemplatePositiveContract.cases_checked,
      problems: modelCliTemplatePositiveContract.problems?.length || 0,
      report_json: path.relative(root, modelCliTemplatePositiveContractPath),
    } : null;

    const { tmpRoot, tmpPackage } = copyPackageToTemp();
    try {
      runStep(report, "runner_dry_run_temp_package", [
        node,
        "scripts/run_video_generation_package.js",
        tmpPackage,
        "--dry-run",
        "--out",
        options.outFile,
      ]);
      const runnerPlan = validateRunnerPlan(tmpPackage);
      report.runner_plan_validation = runnerPlan;
      if (!runnerPlan.ok) throw new Error(`runner plan validation failed: ${runnerPlan.problems.join("; ")}`);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }

    runStep(report, "audit_full_duration_release_gate_before_execute", [
      node,
      "scripts/audit_scene09_v3_full_duration_release_gate.js",
    ]);
    const fullDurationReleaseGate = fs.existsSync(fullDurationReleaseGatePath) ? readJson(fullDurationReleaseGatePath) : null;
    report.full_duration_release_gate = fullDurationReleaseGate ? {
      decision: fullDurationReleaseGate.decision,
      can_release_full_duration: fullDurationReleaseGate.can_release_full_duration === true,
      expected_probe_clips: fullDurationReleaseGate.expected_probe_clips,
      playable_probe_clips: fullDurationReleaseGate.playable_probe_clips,
      review_frame_sets_ready: fullDurationReleaseGate.review_frame_sets_ready,
      full_duration_approvals: fullDurationReleaseGate.full_duration_approvals,
      release_exists: fullDurationReleaseGate.release?.exists === true,
      blocking_items: (fullDurationReleaseGate.blocking_items || []).length,
      problems: (fullDurationReleaseGate.problems || []).length,
      report_json: path.relative(root, fullDurationReleaseGatePath),
    } : null;

    if (options.execute) {
      if (fullDurationReleaseGate?.decision !== "full_duration_release_passed" || fullDurationReleaseGate?.can_release_full_duration !== true) {
        report.notes.push("Blocked before full-duration video generation: full_duration_release_gate has not passed.");
        throw new Error("--execute requested before full_duration_release_gate passed");
      }
      if (!report.model_cli_configured) {
        report.notes.push("Blocked before video generation: --execute requires VIDEO_MODEL_CLI_ARGV_JSON.");
        throw new Error("--execute requested but VIDEO_MODEL_CLI_ARGV_JSON is not configured");
      }
      runStep(report, "execute_video_model_work_orders", [
        node,
        "scripts/run_video_generation_package.js",
        packageDir,
        "--execute",
        options.force ? "--force" : "",
        "--out",
        options.outFile,
      ].filter(Boolean));
      runStep(report, "restore_custom_monitor_handoff_package", [node, "scripts/build_scene09_v3_monitor_handoff_package.js"]);
    }

    runStep(report, "audit_generated_clips", [node, "scripts/audit_scene09_v3_generated_clips.js"], { allowFailure: true });
    const clipQa = fs.existsSync(clipQaPath) ? readJson(clipQaPath) : null;
    report.clip_status = clipQa ? {
      decision: clipQa.decision,
      expected_clips: clipQa.expected_clips,
      ready_clips: clipQa.ready_clips,
      missing_clips: clipQa.missing_clips,
      failed_clips: clipQa.failed_clips,
      report_json: path.relative(root, clipQaPath),
    } : null;
    runStep(report, "build_clip_motion_review_assets", [node, "scripts/build_scene09_v3_clip_motion_review_assets.js"], { allowFailure: true });
    runStep(report, "audit_clip_motion_review_assets_html", [node, "scripts/audit_scene09_v3_clip_motion_review_assets_html.js"]);
    const motionAssets = fs.existsSync(motionReviewAssetsPath) ? readJson(motionReviewAssetsPath) : null;
    report.motion_review_assets = motionAssets ? {
      decision: motionAssets.decision,
      expected_clips: motionAssets.expected_clips,
      extracted_clips: motionAssets.extracted_clips,
      missing_clips: motionAssets.missing_clips,
      failed_clips: motionAssets.failed_clips,
      html: motionAssets.html,
    } : null;
    runStep(report, "build_clip_motion_review_decision_template", [node, "scripts/build_scene09_v3_clip_motion_review_decision_template.js"]);
    const motionDecisions = fs.existsSync(motionReviewDecisionsPath) ? readJson(motionReviewDecisionsPath) : null;
    report.motion_review_decisions = motionDecisions ? {
      decision: motionDecisions.decision,
      summary: motionDecisions.summary,
      report_json: path.relative(root, motionReviewDecisionsPath),
    } : null;
    runStep(report, "audit_clip_motion_review_decisions", [node, "scripts/audit_scene09_v3_clip_motion_review_decisions.js"], { allowFailure: true });
    runStep(report, "build_clip_revision_queue", [node, "scripts/build_scene09_v3_clip_revision_queue.js"]);
    const clipRevisionQueue = fs.existsSync(clipRevisionQueuePath) ? readJson(clipRevisionQueuePath) : null;
    report.clip_revision_queue = clipRevisionQueue ? {
      decision: clipRevisionQueue.decision,
      actionable_shots: clipRevisionQueue.actionable_shots,
      counts: clipRevisionQueue.counts,
      report_json: path.relative(root, clipRevisionQueuePath),
    } : null;
    const clipIngest = fs.existsSync(clipIngestReportPath) ? readJson(clipIngestReportPath) : null;
    report.clip_ingest = clipIngest ? {
      decision: clipIngest.decision,
      scanned_video_files: clipIngest.scanned_video_files,
      unique_matched_shots: clipIngest.unique_matched_shots,
      copied: clipIngest.copied,
      blocked_shots: clipIngest.blocked_shots,
      report_json: path.relative(root, clipIngestReportPath),
    } : null;
    const proxyAnimatic = fs.existsSync(proxyAnimaticReportPath) ? readJson(proxyAnimaticReportPath) : null;
    report.proxy_animatic = proxyAnimatic ? {
      decision: proxyAnimatic.decision,
      proxy_clips_ready: proxyAnimatic.proxy_clips_ready,
      proxy_clips_failed: proxyAnimatic.proxy_clips_failed,
      proxy_edit: proxyAnimatic.proxy_edit?.proxy_edit || null,
      report_json: path.relative(root, proxyAnimaticReportPath),
    } : null;

    if (options.concat) {
      if (!clipQa || clipQa.missing_clips || clipQa.failed_clips || clipQa.ready_clips !== clipQa.expected_clips) {
        throw new Error("--concat requested, but generated clips are not complete and file-integrity clean");
      }
      runStep(report, "audit_clip_provenance_gate_before_concat", [
        node,
        "scripts/audit_scene09_v3_clip_provenance_gate.js",
      ]);
      const clipProvenanceBeforeConcat = fs.existsSync(clipProvenanceGatePath) ? readJson(clipProvenanceGatePath) : null;
      report.clip_provenance_gate_before_concat = clipProvenanceBeforeConcat ? {
        decision: clipProvenanceBeforeConcat.decision,
        existing_clips: clipProvenanceBeforeConcat.existing_clips,
        expected_clips: clipProvenanceBeforeConcat.expected_clips,
        provenance_rows: clipProvenanceBeforeConcat.provenance_rows,
        problems: clipProvenanceBeforeConcat.problems?.length || 0,
        report_json: path.relative(root, clipProvenanceGatePath),
      } : null;
      if (!clipProvenanceBeforeConcat || clipProvenanceBeforeConcat.decision !== "clip_provenance_passed_all_expected_clips") {
        throw new Error("--concat requested, but clip provenance gate has not passed for all expected clips");
      }
      if (!motionDecisions || motionDecisions.decision !== "motion_review_passed_ready_for_concat") {
        throw new Error("--concat requested, but clip motion review decisions are not all motion_review_passed");
      }
      const motionSelfAuditApplyGateBeforeConcat = fs.existsSync(motionSelfAuditApplyGatePath) ? readJson(motionSelfAuditApplyGatePath) : null;
      report.motion_self_audit_apply_gate_before_concat = motionSelfAuditApplyGateBeforeConcat ? {
        decision: motionSelfAuditApplyGateBeforeConcat.decision,
        applied: motionSelfAuditApplyGateBeforeConcat.applied,
        proposal_rows: motionSelfAuditApplyGateBeforeConcat.proposal_rows,
        passed_rows: motionSelfAuditApplyGateBeforeConcat.summary?.motion_review_passed || 0,
        blocked_or_rejected: motionSelfAuditApplyGateBeforeConcat.summary?.blocked_or_rejected || 0,
        problems: motionSelfAuditApplyGateBeforeConcat.problems?.length || 0,
        report_json: path.relative(root, motionSelfAuditApplyGatePath),
      } : null;
      if (!motionSelfAuditApplyGateBeforeConcat || motionSelfAuditApplyGateBeforeConcat.decision !== "motion_self_audit_apply_passed" || motionSelfAuditApplyGateBeforeConcat.applied !== true) {
        throw new Error("--concat requested, but Codex motion self-audit decisions have not passed the strict apply gate");
      }
      if (!clipRevisionQueue || clipRevisionQueue.actionable_shots !== 0) {
        throw new Error("--concat requested, but clip generation/revision queue still has actionable shots");
      }
      report.concat = concatClips(report, options.outFile);
      runStep(report, "audit_generated_clips_after_concat", [node, "scripts/audit_scene09_v3_generated_clips.js"]);
      runStep(report, "audit_final_edit_structural_after_concat", [
        node,
        "scripts/audit_scene09_v3_final_edit_structural.js",
        "--file",
        options.outFile,
      ]);
    }

    runStep(report, "refresh_clip_review_after_clip_audit", [node, "scripts/build_scene09_v3_clip_review_gallery.js"]);
    runStep(report, "refresh_main_gallery_after_clip_audit", [node, "scripts/build_scene09_rebuild_v2_gallery.js"]);
    runStep(report, "patch_main_gallery_after_clip_audit_current_034b", [node, "scripts/patch_scene09_rebuild_v2_gallery_current.js"]);
    runStep(report, "refresh_operator_next_steps_after_clip_audit", [node, "scripts/build_scene09_v3_operator_next_steps.js"]);
    runStep(report, "refresh_handoff_index_after_clip_audit", [node, "scripts/build_scene09_v3_handoff_index.js"]);
    runStep(report, "patch_handoff_index_after_clip_audit_current_034b", [node, "scripts/patch_scene09_v3_handoff_index_current.js"]);
    runStep(report, "audit_handoff_index_after_refresh", [node, "scripts/audit_scene09_v3_handoff_index.js"]);
    runStep(report, "completion_prompt_asset_package", [
      node,
      "/Users/zekun/.codex/skills/cinematic-production-pipeline/scripts/check_completion_target.js",
      root,
      "prompt_asset_package",
    ]);
    runStep(report, "completion_video_generation_package_expected_monitor_block", [
      node,
      "/Users/zekun/.codex/skills/cinematic-production-pipeline/scripts/check_completion_target.js",
      root,
      "video_generation_package",
    ], {
      allowFailure: true,
      expectedFailure: "video_generation_package is expected to remain blocked while clips are pending and motion review is monitor_required",
    });
    runStep(report, "finalize_shot034b_current_surfaces", [
      node,
      "scripts/finalize_scene09_034b_current_surfaces.js",
    ]);

    const clipsReady = report.clip_status && report.clip_status.ready_clips === report.clip_status.expected_clips && report.clip_status.failed_clips === 0 && report.clip_status.missing_clips === 0;
    const motionReviewPassed = report.motion_review_decisions?.decision === "motion_review_passed_ready_for_concat";
    report.highest_completed_target = clipsReady && motionReviewPassed && options.concat && fs.existsSync(options.outFile)
      ? "video_generation_run_motion_review_passed"
      : clipsReady
        ? "generated_clips_ready_motion_review_required"
      : "prompt_asset_package";
    report.decision = clipsReady && motionReviewPassed
      ? "clips_motion_review_passed_ready_for_concat_or_final_edit"
      : clipsReady
        ? "clips_file_integrity_ready_motion_review_required"
      : "monitor_handoff_ready_clips_pending";
    if (!report.model_cli_configured) {
      report.notes.push("No VIDEO_MODEL_CLI_ARGV_JSON is configured, so no external video model was executed.");
    }
    if (!clipsReady) {
      report.notes.push("Final video generation remains pending until all 42 expected clips exist and pass clip file QA.");
    }
    if (report.motion_review_assets?.decision === "clips_pending") {
      report.notes.push("Clip motion review start/mid/end frame assets are pending because no real clips exist yet.");
    }
    if (clipsReady && !motionReviewPassed) {
      report.notes.push("Generated clips cannot be concatenated until all 42 machine-readable motion review decisions are motion_review_passed.");
    }
    writeReport(report);
    runStep(report, "build_operator_execution_profile_after_report", [
      node,
      "scripts/build_scene09_v3_operator_execution_profile.js",
    ]);
    const operatorPreflightPath = path.join(packageDir, "operator_preflight_status.json");
    const operatorPreflight = fs.existsSync(operatorPreflightPath) ? readJson(operatorPreflightPath) : null;
    report.operator_preflight_status = operatorPreflight ? {
      decision: operatorPreflight.decision,
      can_submit_to_provider: operatorPreflight.can_submit_to_provider,
      can_execute_with_local_cli: operatorPreflight.can_execute_with_local_cli,
      can_claim_video_generation_package: operatorPreflight.can_claim_video_generation_package,
      evidence: operatorPreflight.evidence,
      report_json: path.relative(root, operatorPreflightPath),
    } : null;
    runStep(report, "build_provider_upload_bundles_after_report", [
      node,
      "scripts/build_scene09_v3_provider_upload_bundles.js",
    ]);
    runStep(report, "audit_provider_upload_bundles_after_report", [
      node,
      "scripts/audit_scene09_v3_provider_upload_bundles.js",
    ]);
    const providerUploadBundlesAudit = fs.existsSync(providerUploadBundlesAuditPath) ? readJson(providerUploadBundlesAuditPath) : null;
    report.provider_upload_bundles = providerUploadBundlesAudit ? {
      decision: providerUploadBundlesAudit.decision,
      bundles_checked: providerUploadBundlesAudit.bundles_checked,
      rows_checked: providerUploadBundlesAudit.rows_checked,
      unique_custom_ids: providerUploadBundlesAudit.unique_custom_ids,
      zip_contents_checked: providerUploadBundlesAudit.zip_contents_checked,
      expected_download_rows_checked: providerUploadBundlesAudit.expected_download_rows_checked,
      manifest_digest_records_checked: providerUploadBundlesAudit.manifest_digest_records_checked,
      prompt_contract_files_checked: providerUploadBundlesAudit.prompt_contract_files_checked,
      negative_prompt_files_checked: providerUploadBundlesAudit.negative_prompt_files_checked,
      executable_negative_semantics_files_checked: providerUploadBundlesAudit.executable_negative_semantics_files_checked,
      problems: providerUploadBundlesAudit.problems?.length || 0,
      report_json: path.relative(root, providerUploadBundlesAuditPath),
    } : null;
    runStep(report, "audit_provider_submission_freshness_after_provider_bundles", [
      node,
      "scripts/audit_scene09_v3_provider_submission_freshness_gate.js",
    ]);
    const providerSubmissionFreshnessGate = fs.existsSync(providerSubmissionFreshnessGatePath) ? readJson(providerSubmissionFreshnessGatePath) : null;
    report.provider_submission_freshness_gate = providerSubmissionFreshnessGate ? {
      decision: providerSubmissionFreshnessGate.decision,
      expected_shots: providerSubmissionFreshnessGate.expected_shots,
      model_submission_batch_rows: providerSubmissionFreshnessGate.model_submission_batch_rows,
      provider_bundle_rows: providerSubmissionFreshnessGate.provider_bundle_rows,
      problems: providerSubmissionFreshnessGate.problems?.length || 0,
      report_json: path.relative(root, providerSubmissionFreshnessGatePath),
    } : null;
    runStep(report, "build_clip_return_intake_after_report", [
      node,
      "scripts/build_scene09_v3_clip_return_intake_package.js",
    ]);
    runStep(report, "audit_clip_return_intake_after_report", [
      node,
      "scripts/audit_scene09_v3_clip_return_intake.js",
    ]);
    const clipReturnIntakeAudit = fs.existsSync(clipReturnIntakeAuditPath) ? readJson(clipReturnIntakeAuditPath) : null;
    report.clip_return_intake = clipReturnIntakeAudit ? {
      decision: clipReturnIntakeAudit.decision,
      batches_checked: clipReturnIntakeAudit.batches_checked,
      expected_clip_rows: clipReturnIntakeAudit.expected_clip_rows,
      unique_custom_ids: clipReturnIntakeAudit.unique_custom_ids,
      source_files_checked: clipReturnIntakeAudit.source_files_checked,
      problems: clipReturnIntakeAudit.problems?.length || 0,
      report_json: path.relative(root, clipReturnIntakeAuditPath),
    } : null;
    runStep(report, "audit_clip_return_roundtrip_after_report", [
      node,
      "scripts/audit_scene09_v3_clip_return_roundtrip.js",
    ]);
    const clipReturnRoundtripAudit = fs.existsSync(clipReturnRoundtripAuditPath) ? readJson(clipReturnRoundtripAuditPath) : null;
    report.clip_return_roundtrip = clipReturnRoundtripAudit ? {
      decision: clipReturnRoundtripAudit.decision,
      scenarios: (clipReturnRoundtripAudit.scenarios || []).map((scenario) => ({
        strategy: scenario.strategy,
        decision: scenario.decision,
        unique_matched_shots: scenario.unique_matched_shots,
        would_copy: scenario.would_copy,
        copied: scenario.copied,
        unsupported_video_files: scenario.unsupported_video_files || 0,
        invalid_video_files: scenario.invalid_video_files || 0,
        problems: scenario.problems?.length || 0,
      })),
      problems: clipReturnRoundtripAudit.problems?.length || 0,
      report_json: path.relative(root, clipReturnRoundtripAuditPath),
    } : null;
    runStep(report, "audit_model_cli_execution_provenance_after_roundtrip", [
      node,
      "scripts/audit_scene09_v3_model_cli_execution_provenance.js",
    ]);
    const modelCliExecutionProvenanceAudit = fs.existsSync(modelCliExecutionProvenanceAuditPath) ? readJson(modelCliExecutionProvenanceAuditPath) : null;
    report.model_cli_execution_provenance = modelCliExecutionProvenanceAudit ? {
      decision: modelCliExecutionProvenanceAudit.decision,
      expected_shots: modelCliExecutionProvenanceAudit.expected_shots,
      rows_checked: modelCliExecutionProvenanceAudit.provenance?.rows_checked || 0,
      unique_expected_clips: modelCliExecutionProvenanceAudit.provenance?.unique_expected_clips || 0,
      problems: modelCliExecutionProvenanceAudit.problems?.length || 0,
      report_json: path.relative(root, modelCliExecutionProvenanceAuditPath),
    } : null;
    runStep(report, "audit_clip_provenance_gate_after_roundtrip", [
      node,
      "scripts/audit_scene09_v3_clip_provenance_gate.js",
    ], { allowFailure: true });
    const clipProvenanceGate = fs.existsSync(clipProvenanceGatePath) ? readJson(clipProvenanceGatePath) : null;
    report.clip_provenance_gate = clipProvenanceGate ? {
      decision: clipProvenanceGate.decision,
      expected_clips: clipProvenanceGate.expected_clips,
      existing_clips: clipProvenanceGate.existing_clips,
      missing_clips: clipProvenanceGate.missing_clips,
      provenance_rows: clipProvenanceGate.provenance_rows,
      problems: clipProvenanceGate.problems?.length || 0,
      warnings: clipProvenanceGate.warnings?.length || 0,
      report_json: path.relative(root, clipProvenanceGatePath),
    } : null;
    runStep(report, "build_motion_self_audit_packet_after_report", [
      node,
      "scripts/build_scene09_v3_motion_self_audit_packet.js",
    ]);
    runStep(report, "audit_motion_self_audit_packet_after_report", [
      node,
      "scripts/audit_scene09_v3_motion_self_audit_packet.js",
    ]);
    const motionSelfAuditPacketAudit = fs.existsSync(motionSelfAuditPacketAuditPath) ? readJson(motionSelfAuditPacketAuditPath) : null;
    report.motion_self_audit_packet = motionSelfAuditPacketAudit ? {
      decision: motionSelfAuditPacketAudit.decision,
      rows_checked: motionSelfAuditPacketAudit.rows_checked,
      problems: motionSelfAuditPacketAudit.problems?.length || 0,
      report_json: path.relative(root, motionSelfAuditPacketAuditPath),
    } : null;
    runStep(report, "audit_motion_self_audit_evidence_contract_after_packet", [
      node,
      "scripts/audit_scene09_v3_motion_self_audit_evidence_contract.js",
    ]);
    const motionSelfAuditEvidenceContract = fs.existsSync(motionSelfAuditEvidenceContractPath) ? readJson(motionSelfAuditEvidenceContractPath) : null;
    report.motion_self_audit_evidence_contract = motionSelfAuditEvidenceContract ? {
      decision: motionSelfAuditEvidenceContract.decision,
      template_rows: motionSelfAuditEvidenceContract.template_rows,
      rows_with_review_frame_signature_keys: motionSelfAuditEvidenceContract.rows_with_review_frame_signature_keys,
      problems: motionSelfAuditEvidenceContract.problems?.length || 0,
      warnings: motionSelfAuditEvidenceContract.warnings?.length || 0,
      report_json: path.relative(root, motionSelfAuditEvidenceContractPath),
    } : null;
    runStep(report, "audit_motion_self_audit_unsigned_evidence_rejection", [
      node,
      "scripts/audit_scene09_v3_motion_self_audit_unsigned_evidence_rejection.js",
    ]);
    const motionSelfAuditUnsignedEvidenceRejection = fs.existsSync(motionSelfAuditUnsignedEvidenceRejectionPath) ? readJson(motionSelfAuditUnsignedEvidenceRejectionPath) : null;
    report.motion_self_audit_unsigned_evidence_rejection = motionSelfAuditUnsignedEvidenceRejection ? {
      decision: motionSelfAuditUnsignedEvidenceRejection.decision,
      rows_tested: motionSelfAuditUnsignedEvidenceRejection.expected_rows,
      frame_signature_rejections: motionSelfAuditUnsignedEvidenceRejection.probe?.frame_signature_rejections || 0,
      clip_signature_rejections: motionSelfAuditUnsignedEvidenceRejection.probe?.clip_signature_rejections || 0,
      restored_default_apply_gate: motionSelfAuditUnsignedEvidenceRejection.reports_restored_to_default_proposal === true,
      problems: motionSelfAuditUnsignedEvidenceRejection.problems?.length || 0,
      warnings: motionSelfAuditUnsignedEvidenceRejection.warnings?.length || 0,
      report_json: path.relative(root, motionSelfAuditUnsignedEvidenceRejectionPath),
    } : null;
    runStep(report, "audit_motion_self_audit_apply_positive_contract", [
      node,
      "scripts/audit_scene09_v3_motion_self_audit_apply_positive_contract.js",
    ]);
    const motionSelfAuditApplyPositiveContract = fs.existsSync(motionSelfAuditApplyPositiveContractPath) ? readJson(motionSelfAuditApplyPositiveContractPath) : null;
    report.motion_self_audit_apply_positive_contract = motionSelfAuditApplyPositiveContract ? {
      decision: motionSelfAuditApplyPositiveContract.decision,
      expected_shots: motionSelfAuditApplyPositiveContract.expected_shots,
      proposal_rows: motionSelfAuditApplyPositiveContract.apply_gate?.proposal_rows || 0,
      applied: motionSelfAuditApplyPositiveContract.apply_gate?.applied === true,
      motion_review_passed: motionSelfAuditApplyPositiveContract.apply_gate?.motion_review_passed || 0,
      problems: motionSelfAuditApplyPositiveContract.problems?.length || 0,
      report_json: path.relative(root, motionSelfAuditApplyPositiveContractPath),
    } : null;
    runStep(report, "audit_motion_self_audit_apply_gate_after_report", [
      node,
      "scripts/apply_scene09_v3_motion_self_audit_decisions.js",
    ], { allowFailure: true });
    const motionSelfAuditApplyGate = fs.existsSync(motionSelfAuditApplyGatePath) ? readJson(motionSelfAuditApplyGatePath) : null;
    if (motionSelfAuditApplyGate?.decision === "motion_self_audit_apply_blocked_clips_pending") {
      markLastStepExpected(report, "motion self-audit apply gate must block until returned clips and signed review frames exist");
    }
    report.motion_self_audit_apply_gate = motionSelfAuditApplyGate ? {
      decision: motionSelfAuditApplyGate.decision,
      applied: motionSelfAuditApplyGate.applied,
      proposal_rows: motionSelfAuditApplyGate.proposal_rows,
      passed_rows: motionSelfAuditApplyGate.summary?.motion_review_passed || 0,
      blocked_or_rejected: motionSelfAuditApplyGate.summary?.blocked_or_rejected || 0,
      problems: motionSelfAuditApplyGate.problems?.length || 0,
      report_json: path.relative(root, motionSelfAuditApplyGatePath),
    } : null;
    runStep(report, "audit_after_clip_return_resume_positive_contract", [
      node,
      "scripts/audit_scene09_v3_after_clip_return_resume_positive_contract.js",
    ]);
    const afterClipReturnResumePositiveContract = fs.existsSync(afterClipReturnResumePositiveContractPath) ? readJson(afterClipReturnResumePositiveContractPath) : null;
    report.after_clip_return_resume_positive_contract = afterClipReturnResumePositiveContract ? {
      decision: afterClipReturnResumePositiveContract.decision,
      expected_shots: afterClipReturnResumePositiveContract.expected_shots,
      fixture_download_shape: afterClipReturnResumePositiveContract.fixture_download_shape || null,
      ingest_decision: afterClipReturnResumePositiveContract.ingest_resume?.decision || null,
      apply_decision: afterClipReturnResumePositiveContract.apply_resume?.decision || null,
      clips_ready: afterClipReturnResumePositiveContract.apply_resume?.clips_ready || 0,
      motion_frames: afterClipReturnResumePositiveContract.apply_resume?.motion_frames || 0,
      final_concat_gate: afterClipReturnResumePositiveContract.apply_resume?.final_concat_gate || null,
      production_final_output_changed: afterClipReturnResumePositiveContract.production_existed_before !== afterClipReturnResumePositiveContract.production_exists_after,
      problems: afterClipReturnResumePositiveContract.problems?.length || 0,
      report_json: path.relative(root, afterClipReturnResumePositiveContractPath),
    } : null;
    runStep(report, "audit_final_concat_positive_contract", [
      node,
      "scripts/audit_scene09_v3_final_concat_positive_contract.js",
    ]);
    const finalConcatPositiveContract = fs.existsSync(finalConcatPositiveContractPath) ? readJson(finalConcatPositiveContractPath) : null;
    report.final_concat_positive_contract = finalConcatPositiveContract ? {
      decision: finalConcatPositiveContract.decision,
      expected_shots: finalConcatPositiveContract.expected_shots,
      gate_decision: finalConcatPositiveContract.gate_result?.decision || null,
      gate_passed_checks: finalConcatPositiveContract.gate_result?.passed_checks || 0,
      gate_total_checks: finalConcatPositiveContract.gate_result?.total_checks || 0,
      problems: finalConcatPositiveContract.problems?.length || 0,
      report_json: path.relative(root, finalConcatPositiveContractPath),
    } : null;
    runStep(report, "audit_final_edit_positive_contract", [
      node,
      "scripts/audit_scene09_v3_final_edit_positive_contract.js",
    ]);
    const finalEditPositiveContract = fs.existsSync(finalEditPositiveContractPath) ? readJson(finalEditPositiveContractPath) : null;
    report.final_edit_positive_contract = finalEditPositiveContract ? {
      decision: finalEditPositiveContract.decision,
      expected_shots: finalEditPositiveContract.expected_shots,
      expected_duration_seconds: finalEditPositiveContract.expected_duration_seconds,
      structural_decision: finalEditPositiveContract.structural_result?.decision || null,
      structural_ok: finalEditPositiveContract.structural_result?.final_edit?.ok === true,
      production_final_output_changed: finalEditPositiveContract.production_existed_before !== finalEditPositiveContract.production_exists_after,
      problems: finalEditPositiveContract.problems?.length || 0,
      report_json: path.relative(root, finalEditPositiveContractPath),
    } : null;
    runStep(report, "audit_video_generation_run_positive_contract", [
      node,
      "scripts/audit_scene09_v3_video_generation_run_positive_contract.js",
    ]);
    const videoGenerationRunPositiveContract = fs.existsSync(videoGenerationRunPositiveContractPath) ? readJson(videoGenerationRunPositiveContractPath) : null;
    report.video_generation_run_positive_contract = videoGenerationRunPositiveContract ? {
      decision: videoGenerationRunPositiveContract.decision,
      expected_shots: videoGenerationRunPositiveContract.expected_shots,
      expected_duration_seconds: videoGenerationRunPositiveContract.expected_duration_seconds,
      completion_decision: videoGenerationRunPositiveContract.completion_result?.decision || null,
      completion_passed_checks: videoGenerationRunPositiveContract.completion_result?.passed_checks || 0,
      completion_total_checks: videoGenerationRunPositiveContract.completion_result?.total_checks || 0,
      highest_completed_target: videoGenerationRunPositiveContract.completion_result?.highest_completed_target || null,
      production_final_output_changed: videoGenerationRunPositiveContract.production_existed_before !== videoGenerationRunPositiveContract.production_exists_after,
      problems: videoGenerationRunPositiveContract.problems?.length || 0,
      report_json: path.relative(root, videoGenerationRunPositiveContractPath),
    } : null;
    runStep(report, "audit_positive_contract_isolation_gate", [
      node,
      "scripts/audit_scene09_v3_positive_contract_isolation_gate.js",
    ]);
    const positiveContractIsolationGate = fs.existsSync(positiveContractIsolationGatePath) ? readJson(positiveContractIsolationGatePath) : null;
    report.positive_contract_isolation_gate = positiveContractIsolationGate ? {
      decision: positiveContractIsolationGate.decision,
      expected_shots: positiveContractIsolationGate.expected_shots,
      production_expected_clips_existing: positiveContractIsolationGate.production_expected_clips_existing,
      production_final_output_exists: positiveContractIsolationGate.production_final_output_exists,
      contracts_checked: positiveContractIsolationGate.contracts_checked,
      problems: positiveContractIsolationGate.problems?.length || 0,
      warnings: positiveContractIsolationGate.warnings?.length || 0,
      report_json: path.relative(root, positiveContractIsolationGatePath),
    } : null;
    runStep(report, "audit_final_concat_gate_after_report", [
      node,
      "scripts/audit_scene09_v3_final_concat_gate.js",
    ], { allowFailure: true });
    const finalConcatGate = fs.existsSync(finalConcatGatePath) ? readJson(finalConcatGatePath) : null;
    report.final_concat_gate = finalConcatGate ? {
      decision: finalConcatGate.decision,
      passed_checks: finalConcatGate.passed_checks,
      total_checks: finalConcatGate.total_checks,
      failed_checks: finalConcatGate.failed_checks || [],
      final_output_exists: finalConcatGate.final_output_exists,
      report_json: path.relative(root, finalConcatGatePath),
    } : null;
    runStep(report, "audit_final_edit_structural_after_report", [
      node,
      "scripts/audit_scene09_v3_final_edit_structural.js",
      "--file",
      options.outFile,
    ], { allowFailure: true });
    const finalEditStructuralAudit = fs.existsSync(finalEditStructuralAuditPath) ? readJson(finalEditStructuralAuditPath) : null;
    report.final_edit_structural_audit = finalEditStructuralAudit ? {
      decision: finalEditStructuralAudit.decision,
      final_output: finalEditStructuralAudit.final_output,
      exists: finalEditStructuralAudit.final_edit?.exists || false,
      ok: finalEditStructuralAudit.final_edit?.ok || false,
      issue: finalEditStructuralAudit.final_edit?.issue || null,
      duration_seconds: finalEditStructuralAudit.final_edit?.duration_seconds || null,
      report_json: path.relative(root, finalEditStructuralAuditPath),
    } : null;
    runStep(report, "audit_proxy_misuse_gate_after_report", [
      node,
      "scripts/audit_scene09_v3_proxy_misuse_gate.js",
    ], { allowFailure: true });
    const proxyMisuseGate = fs.existsSync(proxyMisuseGatePath) ? readJson(proxyMisuseGatePath) : null;
    report.proxy_misuse_gate = proxyMisuseGate ? {
      decision: proxyMisuseGate.decision,
      expected_clips_existing: proxyMisuseGate.expected_clips_existing,
      expected_clips_missing: proxyMisuseGate.expected_clips_missing,
      problems: proxyMisuseGate.problems?.length || 0,
      warnings: proxyMisuseGate.warnings?.length || 0,
      report_json: path.relative(root, proxyMisuseGatePath),
    } : null;
    runStep(report, "audit_report_freshness_gate_after_report", [
      node,
      "scripts/audit_scene09_v3_report_freshness_gate.js",
    ], { allowFailure: true });
    const reportFreshnessGate = fs.existsSync(reportFreshnessGatePath) ? readJson(reportFreshnessGatePath) : null;
    report.report_freshness_gate = reportFreshnessGate ? {
      decision: reportFreshnessGate.decision,
      reports_checked: reportFreshnessGate.reports_checked,
      problems: reportFreshnessGate.problems?.length || 0,
      warnings: reportFreshnessGate.warnings?.length || 0,
      package_manifest_sha256: reportFreshnessGate.package_manifest_sha256,
      report_json: path.relative(root, reportFreshnessGatePath),
    } : null;
    runStep(report, "audit_video_generation_run_completion_after_report", [
      node,
      "scripts/audit_scene09_v3_video_generation_run_completion.js",
    ], { allowFailure: true });
    const videoGenerationRunCompletion = fs.existsSync(videoGenerationRunCompletionAuditPath) ? readJson(videoGenerationRunCompletionAuditPath) : null;
    report.video_generation_run_completion = videoGenerationRunCompletion ? {
      decision: videoGenerationRunCompletion.decision,
      highest_completed_target: videoGenerationRunCompletion.highest_completed_target,
      passed_checks: videoGenerationRunCompletion.passed_checks,
      total_checks: videoGenerationRunCompletion.total_checks,
      failed_checks: videoGenerationRunCompletion.failed_checks || [],
      report_json: path.relative(root, videoGenerationRunCompletionAuditPath),
    } : null;
    if (report.video_generation_run_completion?.decision === "video_generation_run_complete") {
      report.highest_completed_target = "video_generation_run";
      report.decision = "video_generation_run_complete";
    }
    runStep(report, "refresh_operator_execution_profile_after_completion_audit", [
      node,
      "scripts/build_scene09_v3_operator_execution_profile.js",
    ]);
    const refreshedOperatorPreflightPath = path.join(packageDir, "operator_preflight_status.json");
    const refreshedOperatorPreflight = fs.existsSync(refreshedOperatorPreflightPath) ? readJson(refreshedOperatorPreflightPath) : null;
    report.operator_preflight_status = refreshedOperatorPreflight ? {
      decision: refreshedOperatorPreflight.decision,
      can_submit_to_provider: refreshedOperatorPreflight.can_submit_to_provider,
      can_execute_with_local_cli: refreshedOperatorPreflight.can_execute_with_local_cli,
      can_claim_video_generation_package: refreshedOperatorPreflight.can_claim_video_generation_package,
      evidence: refreshedOperatorPreflight.evidence,
      report_json: path.relative(root, refreshedOperatorPreflightPath),
    } : report.operator_preflight_status;
    runStep(report, "refresh_operator_next_steps_after_completion_audit", [
      node,
      "scripts/build_scene09_v3_operator_next_steps.js",
    ]);
    runStep(report, "refresh_handoff_index_after_downstream_audits", [
      node,
      "scripts/build_scene09_v3_handoff_index.js",
    ]);
    runStep(report, "patch_handoff_index_after_downstream_audits_current_034b", [
      node,
      "scripts/patch_scene09_v3_handoff_index_current.js",
    ]);
    runStep(report, "final_sync_submission_entrypoints_after_current_patches", [
      node,
      "scripts/sync_scene09_v3_delivery_payload_current.js",
    ]);
    runStep(report, "final_rebuild_model_submission_batches_after_submission_sync", [
      node,
      "scripts/build_scene09_v3_model_submission_batches.js",
    ]);
    runStep(report, "final_rebuild_model_submission_index_after_submission_sync", [
      node,
      "scripts/build_scene09_v3_model_submission_index.js",
    ]);
    runStep(report, "final_rebuild_provider_upload_bundles_after_submission_sync", [
      node,
      "scripts/build_scene09_v3_provider_upload_bundles.js",
    ]);
    runStep(report, "final_audit_model_submission_batches_after_submission_sync", [
      node,
      "scripts/audit_scene09_v3_model_submission_batches.js",
    ]);
    const finalModelSubmissionBatches = fs.existsSync(modelSubmissionBatchesPath) ? readJson(modelSubmissionBatchesPath) : null;
    report.model_submission_batches = finalModelSubmissionBatches ? {
      decision: finalModelSubmissionBatches.decision,
      total_shots: finalModelSubmissionBatches.total_shots,
      total_batches: finalModelSubmissionBatches.total_batches,
      batch_size: finalModelSubmissionBatches.batch_size,
      expected_downloads_csv: finalModelSubmissionBatches.expected_downloads_csv,
      report_json: path.relative(root, modelSubmissionBatchesPath),
    } : report.model_submission_batches;
    const finalModelSubmissionBatchAudit = fs.existsSync(modelSubmissionBatchesAuditPath) ? readJson(modelSubmissionBatchesAuditPath) : null;
    report.model_submission_batch_audit = finalModelSubmissionBatchAudit ? {
      decision: finalModelSubmissionBatchAudit.decision,
      batches_checked: finalModelSubmissionBatchAudit.batches_checked,
      rows_checked: finalModelSubmissionBatchAudit.rows_checked,
      problems: finalModelSubmissionBatchAudit.problems?.length || 0,
      report_json: path.relative(root, modelSubmissionBatchesAuditPath),
    } : report.model_submission_batch_audit;
    runStep(report, "final_audit_model_submission_index_after_submission_sync", [
      node,
      "scripts/audit_scene09_v3_model_submission_index.js",
    ]);
    const finalModelSubmissionIndexAudit = fs.existsSync(modelSubmissionIndexAuditPath) ? readJson(modelSubmissionIndexAuditPath) : null;
    report.model_submission_index = finalModelSubmissionIndexAudit ? {
      decision: finalModelSubmissionIndexAudit.decision,
      links_checked: finalModelSubmissionIndexAudit.links_checked,
      shot_cards: finalModelSubmissionIndexAudit.shot_cards,
      batch_sections: finalModelSubmissionIndexAudit.batch_sections,
      problems: finalModelSubmissionIndexAudit.problems?.length || 0,
      report_json: path.relative(root, modelSubmissionIndexAuditPath),
    } : report.model_submission_index;
    runStep(report, "final_audit_provider_upload_bundles_after_submission_sync", [
      node,
      "scripts/audit_scene09_v3_provider_upload_bundles.js",
    ]);
    const finalProviderUploadBundlesAudit = fs.existsSync(providerUploadBundlesAuditPath) ? readJson(providerUploadBundlesAuditPath) : null;
    report.provider_upload_bundles = finalProviderUploadBundlesAudit ? {
      decision: finalProviderUploadBundlesAudit.decision,
      bundles_checked: finalProviderUploadBundlesAudit.bundles_checked,
      rows_checked: finalProviderUploadBundlesAudit.rows_checked,
      unique_custom_ids: finalProviderUploadBundlesAudit.unique_custom_ids,
      zip_contents_checked: finalProviderUploadBundlesAudit.zip_contents_checked,
      expected_download_rows_checked: finalProviderUploadBundlesAudit.expected_download_rows_checked,
      manifest_digest_records_checked: finalProviderUploadBundlesAudit.manifest_digest_records_checked,
      prompt_contract_files_checked: finalProviderUploadBundlesAudit.prompt_contract_files_checked,
      negative_prompt_files_checked: finalProviderUploadBundlesAudit.negative_prompt_files_checked,
      executable_negative_semantics_files_checked: finalProviderUploadBundlesAudit.executable_negative_semantics_files_checked,
      problems: finalProviderUploadBundlesAudit.problems?.length || 0,
      report_json: path.relative(root, providerUploadBundlesAuditPath),
    } : report.provider_upload_bundles;
    runStep(report, "final_audit_provider_submission_freshness_gate", [
      node,
      "scripts/audit_scene09_v3_provider_submission_freshness_gate.js",
    ]);
    const finalProviderSubmissionFreshnessGate = fs.existsSync(providerSubmissionFreshnessGatePath) ? readJson(providerSubmissionFreshnessGatePath) : null;
    report.provider_submission_freshness_gate = finalProviderSubmissionFreshnessGate ? {
      decision: finalProviderSubmissionFreshnessGate.decision,
      expected_shots: finalProviderSubmissionFreshnessGate.expected_shots,
      model_submission_batch_rows: finalProviderSubmissionFreshnessGate.model_submission_batch_rows,
      provider_bundle_rows: finalProviderSubmissionFreshnessGate.provider_bundle_rows,
      problems: finalProviderSubmissionFreshnessGate.problems?.length || 0,
      report_json: path.relative(root, providerSubmissionFreshnessGatePath),
    } : report.provider_submission_freshness_gate;
    runStep(report, "final_audit_submission_contract_gate", [
      node,
      "scripts/audit_scene09_v3_submission_contract_gate.js",
    ]);
    const finalSubmissionContractGate = fs.existsSync(submissionContractGatePath) ? readJson(submissionContractGatePath) : null;
    report.submission_contract_gate = finalSubmissionContractGate ? {
      decision: finalSubmissionContractGate.decision,
      expected_shots: finalSubmissionContractGate.expected_shots,
      rows_checked: finalSubmissionContractGate.rows_checked,
      execution_plan_rows: finalSubmissionContractGate.execution_plan_rows,
      submission_queue_rows: finalSubmissionContractGate.submission_queue_rows,
      submission_payload_rows: finalSubmissionContractGate.submission_payload_rows,
      problems: finalSubmissionContractGate.problems?.length || 0,
      report_json: path.relative(root, submissionContractGatePath),
    } : report.submission_contract_gate;
    runStep(report, "final_audit_report_freshness_gate", [
      node,
      "scripts/audit_scene09_v3_report_freshness_gate.js",
    ], { allowFailure: true });
    const finalReportFreshnessGate = fs.existsSync(reportFreshnessGatePath) ? readJson(reportFreshnessGatePath) : null;
    report.report_freshness_gate = finalReportFreshnessGate ? {
      decision: finalReportFreshnessGate.decision,
      reports_checked: finalReportFreshnessGate.reports_checked,
      problems: finalReportFreshnessGate.problems?.length || 0,
      warnings: finalReportFreshnessGate.warnings?.length || 0,
      package_manifest_sha256: finalReportFreshnessGate.package_manifest_sha256,
      report_json: path.relative(root, reportFreshnessGatePath),
    } : report.report_freshness_gate;
    runStep(report, "final_audit_video_generation_run_completion", [
      node,
      "scripts/audit_scene09_v3_video_generation_run_completion.js",
    ], { allowFailure: true });
    const finalVideoGenerationRunCompletion = fs.existsSync(videoGenerationRunCompletionAuditPath) ? readJson(videoGenerationRunCompletionAuditPath) : null;
    report.video_generation_run_completion = finalVideoGenerationRunCompletion ? {
      decision: finalVideoGenerationRunCompletion.decision,
      highest_completed_target: finalVideoGenerationRunCompletion.highest_completed_target,
      passed_checks: finalVideoGenerationRunCompletion.passed_checks,
      total_checks: finalVideoGenerationRunCompletion.total_checks,
      failed_checks: finalVideoGenerationRunCompletion.failed_checks || [],
      report_json: path.relative(root, videoGenerationRunCompletionAuditPath),
    } : report.video_generation_run_completion;
    runStep(report, "final_audit_production_delivery_truth_gate", [
      node,
      "scripts/audit_scene09_v3_production_delivery_truth_gate.js",
    ]);
    const productionDeliveryTruthGate = fs.existsSync(productionDeliveryTruthGatePath) ? readJson(productionDeliveryTruthGatePath) : null;
    report.production_delivery_truth_gate = productionDeliveryTruthGate ? {
      decision: productionDeliveryTruthGate.decision,
      highest_truthful_target: productionDeliveryTruthGate.highest_truthful_target,
      can_claim_video_generation_run: productionDeliveryTruthGate.can_claim_video_generation_run,
      expected_shots: productionDeliveryTruthGate.expected_shots,
      expected_clip_files_existing: productionDeliveryTruthGate.real_evidence?.expected_clip_files_existing,
      final_output_exists: productionDeliveryTruthGate.real_evidence?.final_output_exists,
      blocking_items: productionDeliveryTruthGate.blocking_items?.length || 0,
      report_json: path.relative(root, productionDeliveryTruthGatePath),
    } : null;
    runStep(report, "final_refresh_after_clip_return_resume_snapshot", [
      node,
      "scripts/resume_scene09_v3_after_clip_return.js",
    ], { allowFailure: true });
    runStep(report, "final_audit_report_freshness_gate_after_resume_snapshot", [
      node,
      "scripts/audit_scene09_v3_report_freshness_gate.js",
    ], { allowFailure: true });
    const finalReportFreshnessGateAfterResume = fs.existsSync(reportFreshnessGatePath) ? readJson(reportFreshnessGatePath) : null;
    report.report_freshness_gate = finalReportFreshnessGateAfterResume ? {
      decision: finalReportFreshnessGateAfterResume.decision,
      reports_checked: finalReportFreshnessGateAfterResume.reports_checked,
      problems: finalReportFreshnessGateAfterResume.problems?.length || 0,
      warnings: finalReportFreshnessGateAfterResume.warnings?.length || 0,
      package_manifest_sha256: finalReportFreshnessGateAfterResume.package_manifest_sha256,
      report_json: path.relative(root, reportFreshnessGatePath),
    } : report.report_freshness_gate;
    runStep(report, "final_refresh_operator_execution_profile", [
      node,
      "scripts/build_scene09_v3_operator_execution_profile.js",
    ]);
    const finalOperatorPreflight = fs.existsSync(refreshedOperatorPreflightPath) ? readJson(refreshedOperatorPreflightPath) : null;
    report.operator_preflight_status = finalOperatorPreflight ? {
      decision: finalOperatorPreflight.decision,
      can_submit_to_provider: finalOperatorPreflight.can_submit_to_provider,
      can_execute_with_local_cli: finalOperatorPreflight.can_execute_with_local_cli,
      can_claim_video_generation_package: finalOperatorPreflight.can_claim_video_generation_package,
      evidence: finalOperatorPreflight.evidence,
      report_json: path.relative(root, refreshedOperatorPreflightPath),
    } : report.operator_preflight_status;
    runStep(report, "final_audit_provider_preflight_consistency_gate", [
      node,
      "scripts/audit_scene09_v3_provider_preflight_consistency_gate.js",
    ], { allowFailure: true });
    const finalProviderPreflightConsistencyGate = fs.existsSync(providerPreflightConsistencyGatePath) ? readJson(providerPreflightConsistencyGatePath) : null;
    report.provider_preflight_consistency_gate = finalProviderPreflightConsistencyGate ? {
      decision: finalProviderPreflightConsistencyGate.decision,
      can_submit_to_provider: finalProviderPreflightConsistencyGate.can_submit_to_provider,
      computed_can_submit_to_provider: finalProviderPreflightConsistencyGate.computed_can_submit_to_provider,
      expected_shots: finalProviderPreflightConsistencyGate.expected_shots,
      problems: finalProviderPreflightConsistencyGate.problems?.length || 0,
      warnings: finalProviderPreflightConsistencyGate.warnings?.length || 0,
      report_json: path.relative(root, providerPreflightConsistencyGatePath),
    } : report.provider_preflight_consistency_gate;
    runStep(report, "final_audit_ep02_web_media_refs_before_handoff_refresh", [
      node,
      "scripts/audit_ep02_web_media_refs.js",
    ]);
    runStep(report, "final_build_motion_probe_operator_tracker_before_storyboard_rebuild", [
      node,
      "scripts/build_scene09_v3_motion_probe_operator_tracker.js",
    ]);
    runStep(report, "final_audit_motion_probe_operator_tracker_before_storyboard_rebuild", [
      node,
      "scripts/audit_scene09_v3_motion_probe_operator_tracker.js",
    ]);
    runStep(report, "final_build_motion_probe_submission_manifest_before_storyboard_rebuild", [
      node,
      "scripts/build_scene09_v3_motion_probe_submission_manifest.js",
    ]);
    runStep(report, "final_build_motion_probe_upload_pack_before_storyboard_rebuild", [
      node,
      "scripts/build_scene09_v3_motion_probe_upload_pack.js",
    ]);
    runStep(report, "final_build_ep02_storyboard_data_before_web_media_refs", [
      node,
      "scripts/build_ep02_storyboard_data.js",
    ]);
    runStep(report, "final_validate_main_panel_smoke_before_handoff_refresh", [
      node,
      "scripts/validate_main_panel_smoke.js",
    ]);
    runStep(report, "final_audit_ep02_web_battle_event_panel_before_handoff_refresh", [
      node,
      "scripts/audit_ep02_web_battle_event_panel.js",
    ]);
    runStep(report, "final_audit_ep02_web_media_refs_after_storyboard_rebuild", [
      node,
      "scripts/audit_ep02_web_media_refs.js",
    ]);
    runStep(report, "final_audit_web_submission_prompt_surface_after_storyboard_rebuild", [
      node,
      "scripts/audit_scene09_v3_web_submission_prompt_surface.js",
      "--skip-handoff-index",
    ]);
    runStep(report, "final_refresh_operator_next_steps_after_media_refs", [
      node,
      "scripts/build_scene09_v3_operator_next_steps.js",
    ]);
    runStep(report, "final_audit_handoff_control_reports_after_operator_next_steps", [
      node,
      "scripts/audit_scene09_v3_handoff_control_reports.js",
    ]);
    runStep(report, "final_refresh_handoff_index_after_submission_sync", [
      node,
      "scripts/build_scene09_v3_handoff_index.js",
    ]);
    runStep(report, "final_audit_web_submission_prompt_surface_after_handoff_refresh", [
      node,
      "scripts/audit_scene09_v3_web_submission_prompt_surface.js",
    ]);
    runStep(report, "final_refresh_handoff_index_after_web_submission_prompt_surface", [
      node,
      "scripts/build_scene09_v3_handoff_index.js",
    ]);
    runStep(report, "audit_handoff_index_after_downstream_audits", [
      node,
      "scripts/audit_scene09_v3_handoff_index.js",
    ]);
    runStep(report, "final_audit_current_status_consistency_gate", [
      node,
      "scripts/audit_scene09_v3_current_status_consistency_gate.js",
    ], { allowFailure: true });
    const finalCurrentStatusConsistencyGate = fs.existsSync(currentStatusConsistencyGatePath) ? readJson(currentStatusConsistencyGatePath) : null;
    report.current_status_consistency_gate = finalCurrentStatusConsistencyGate ? {
      decision: finalCurrentStatusConsistencyGate.decision,
      problems: finalCurrentStatusConsistencyGate.problems?.length || 0,
      warnings: finalCurrentStatusConsistencyGate.warnings?.length || 0,
      report_json: path.relative(root, currentStatusConsistencyGatePath),
    } : report.current_status_consistency_gate;
    runStep(report, "final_audit_report_freshness_gate_after_status_consistency", [
      node,
      "scripts/audit_scene09_v3_report_freshness_gate.js",
    ], { allowFailure: true });
    const finalReportFreshnessGateAfterStatus = fs.existsSync(reportFreshnessGatePath) ? readJson(reportFreshnessGatePath) : null;
    report.report_freshness_gate = finalReportFreshnessGateAfterStatus ? {
      decision: finalReportFreshnessGateAfterStatus.decision,
      reports_checked: finalReportFreshnessGateAfterStatus.reports_checked,
      problems: finalReportFreshnessGateAfterStatus.problems?.length || 0,
      warnings: finalReportFreshnessGateAfterStatus.warnings?.length || 0,
      package_manifest_sha256: finalReportFreshnessGateAfterStatus.package_manifest_sha256,
      report_json: path.relative(root, reportFreshnessGatePath),
    } : report.report_freshness_gate;
    runStep(report, "final_audit_video_generation_run_completion_after_status_freshness", [
      node,
      "scripts/audit_scene09_v3_video_generation_run_completion.js",
    ], { allowFailure: true });
    const finalVideoGenerationRunCompletionAfterStatus = fs.existsSync(videoGenerationRunCompletionAuditPath) ? readJson(videoGenerationRunCompletionAuditPath) : null;
    report.video_generation_run_completion = finalVideoGenerationRunCompletionAfterStatus ? {
      decision: finalVideoGenerationRunCompletionAfterStatus.decision,
      highest_completed_target: finalVideoGenerationRunCompletionAfterStatus.highest_completed_target,
      passed_checks: finalVideoGenerationRunCompletionAfterStatus.passed_checks,
      total_checks: finalVideoGenerationRunCompletionAfterStatus.total_checks,
      failed_checks: finalVideoGenerationRunCompletionAfterStatus.failed_checks || [],
      report_json: path.relative(root, videoGenerationRunCompletionAuditPath),
    } : report.video_generation_run_completion;
    runStep(report, "final_fixed_point_current_status_after_completion", [
      node,
      "scripts/audit_scene09_v3_current_status_consistency_gate.js",
    ], { allowFailure: true });
    const fixedPointCurrentStatusConsistencyGate = fs.existsSync(currentStatusConsistencyGatePath) ? readJson(currentStatusConsistencyGatePath) : null;
    report.current_status_consistency_gate = fixedPointCurrentStatusConsistencyGate ? {
      decision: fixedPointCurrentStatusConsistencyGate.decision,
      problems: fixedPointCurrentStatusConsistencyGate.problems?.length || 0,
      warnings: fixedPointCurrentStatusConsistencyGate.warnings?.length || 0,
      report_json: path.relative(root, currentStatusConsistencyGatePath),
    } : report.current_status_consistency_gate;
    runStep(report, "final_fixed_point_report_freshness_after_status", [
      node,
      "scripts/audit_scene09_v3_report_freshness_gate.js",
    ], { allowFailure: true });
    const fixedPointReportFreshnessGate = fs.existsSync(reportFreshnessGatePath) ? readJson(reportFreshnessGatePath) : null;
    report.report_freshness_gate = fixedPointReportFreshnessGate ? {
      decision: fixedPointReportFreshnessGate.decision,
      reports_checked: fixedPointReportFreshnessGate.reports_checked,
      problems: fixedPointReportFreshnessGate.problems?.length || 0,
      warnings: fixedPointReportFreshnessGate.warnings?.length || 0,
      package_manifest_sha256: fixedPointReportFreshnessGate.package_manifest_sha256,
      report_json: path.relative(root, reportFreshnessGatePath),
    } : report.report_freshness_gate;
    runStep(report, "final_audit_production_delivery_truth_gate_after_completion", [
      node,
      "scripts/audit_scene09_v3_production_delivery_truth_gate.js",
    ]);
    const finalProductionDeliveryTruthGate = fs.existsSync(productionDeliveryTruthGatePath) ? readJson(productionDeliveryTruthGatePath) : null;
    report.production_delivery_truth_gate = finalProductionDeliveryTruthGate ? {
      decision: finalProductionDeliveryTruthGate.decision,
      highest_truthful_target: finalProductionDeliveryTruthGate.highest_truthful_target,
      can_claim_video_generation_run: finalProductionDeliveryTruthGate.can_claim_video_generation_run,
      expected_shots: finalProductionDeliveryTruthGate.expected_shots,
      expected_clip_files_existing: finalProductionDeliveryTruthGate.real_evidence?.expected_clip_files_existing,
      final_output_exists: finalProductionDeliveryTruthGate.real_evidence?.final_output_exists,
      blocking_items: finalProductionDeliveryTruthGate.blocking_items?.length || 0,
      report_json: path.relative(root, productionDeliveryTruthGatePath),
    } : report.production_delivery_truth_gate;
    runStep(report, "final_refresh_operator_next_steps_after_truth_gate", [
      node,
      "scripts/build_scene09_v3_operator_next_steps.js",
    ]);
    runStep(report, "final_refresh_handoff_index_after_truth_gate", [
      node,
      "scripts/build_scene09_v3_handoff_index.js",
    ]);
    runStep(report, "final_audit_web_submission_prompt_surface_after_truth_gate_handoff_refresh", [
      node,
      "scripts/audit_scene09_v3_web_submission_prompt_surface.js",
    ]);
    runStep(report, "final_refresh_handoff_index_after_truth_gate_web_submission_prompt_surface", [
      node,
      "scripts/build_scene09_v3_handoff_index.js",
    ]);
    runStep(report, "audit_handoff_index_after_truth_gate", [
      node,
      "scripts/audit_scene09_v3_handoff_index.js",
    ]);
    writeReport(report);
    process.stdout.write(`${JSON.stringify({
      decision: report.decision,
      highest_completed_target: report.highest_completed_target,
      model_cli_configured: report.model_cli_configured,
      battle_ledger_timeline: report.battle_ledger_timeline,
      execution_asset_integrity: report.execution_asset_integrity,
      clip_status: report.clip_status,
      motion_review_assets: report.motion_review_assets,
      motion_review_decisions: report.motion_review_decisions,
      clip_revision_queue: report.clip_revision_queue,
      clip_ingest: report.clip_ingest,
      proxy_animatic: report.proxy_animatic,
      model_submission_batches: report.model_submission_batches,
      model_submission_batch_audit: report.model_submission_batch_audit,
      model_submission_index: report.model_submission_index,
      model_cli_template_audit: report.model_cli_template_audit,
      model_cli_template_positive_contract: report.model_cli_template_positive_contract,
      high_risk_contact_sheet_ascii: report.high_risk_contact_sheet_ascii,
      frame_evidence_audit: report.frame_evidence_audit,
      submission_contract_gate: report.submission_contract_gate,
      provider_submission_freshness_gate: report.provider_submission_freshness_gate,
      narrative_hard_constraints: report.narrative_hard_constraints,
      executable_prompt_semantics: report.executable_prompt_semantics,
      actual_delivery_surface: report.actual_delivery_surface,
      current_status_consistency_gate: report.current_status_consistency_gate,
      provider_preflight_consistency_gate: report.provider_preflight_consistency_gate,
      operator_preflight_status: report.operator_preflight_status,
      provider_upload_bundles: report.provider_upload_bundles,
      clip_return_intake: report.clip_return_intake,
      clip_return_roundtrip: report.clip_return_roundtrip,
      model_cli_execution_provenance: report.model_cli_execution_provenance,
      clip_provenance_gate: report.clip_provenance_gate,
      motion_self_audit_packet: report.motion_self_audit_packet,
      motion_self_audit_evidence_contract: report.motion_self_audit_evidence_contract,
      motion_self_audit_unsigned_evidence_rejection: report.motion_self_audit_unsigned_evidence_rejection,
      motion_self_audit_apply_positive_contract: report.motion_self_audit_apply_positive_contract,
      motion_self_audit_apply_gate: report.motion_self_audit_apply_gate,
      after_clip_return_resume_positive_contract: report.after_clip_return_resume_positive_contract,
      final_concat_positive_contract: report.final_concat_positive_contract,
      final_edit_positive_contract: report.final_edit_positive_contract,
      video_generation_run_positive_contract: report.video_generation_run_positive_contract,
      positive_contract_isolation_gate: report.positive_contract_isolation_gate,
      production_delivery_truth_gate: report.production_delivery_truth_gate,
      report_freshness_gate: report.report_freshness_gate,
      proxy_misuse_gate: report.proxy_misuse_gate,
      final_concat_gate: report.final_concat_gate,
      final_edit_structural_audit: report.final_edit_structural_audit,
      video_generation_run_completion: report.video_generation_run_completion,
      report_json: path.relative(root, reportJsonPath),
      report_md: path.relative(root, reportMdPath),
    }, null, 2)}\n`);
  } catch (error) {
    report.decision = "pipeline_blocked";
    report.error = error.message;
    if (report.highest_completed_target === "unknown") report.highest_completed_target = "prompt_asset_package_unverified_this_run";
    writeReport(report);
    process.stderr.write(`${error.message}\n`);
    process.stderr.write(`Report written: ${path.relative(root, reportJsonPath)}\n`);
    process.exit(1);
  }
}

main();
