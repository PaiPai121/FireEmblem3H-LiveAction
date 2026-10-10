#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const packageManifestPath = path.join(pkgDir, "package_manifest.json");
const runbookPath = path.join(pkgDir, "RUNBOOK.md");

const pipelineReportPath = path.join(reportDir, "scene09_v3_video_pipeline_run_2026-07-28.json");
const integrityPath = path.join(reportDir, "scene09_v3_execution_asset_integrity_2026-07-28.json");
const actualDeliverySurfaceAuditPath = path.join(reportDir, "scene09_v3_actual_delivery_surface_audit_2026-08-01.json");
const executablePromptSemanticsAuditPath = path.join(reportDir, "scene09_v3_executable_prompt_semantics_audit_2026-08-01.json");
const currentStatusConsistencyGatePath = path.join(reportDir, "scene09_v3_current_status_consistency_gate_2026-08-01.json");
const submissionContractGatePath = path.join(reportDir, "scene09_v3_submission_contract_gate_2026-08-01.json");
const clipRevisionPath = path.join(reportDir, "scene09_v3_clip_revision_queue_2026-07-28.json");
const clipReturnIntakeAuditPath = path.join(reportDir, "scene09_v3_clip_return_intake_audit_2026-08-01.json");
const clipReturnRoundtripAuditPath = path.join(reportDir, "scene09_v3_clip_return_roundtrip_audit_2026-08-01.json");
const clipProvenanceGatePath = path.join(reportDir, "scene09_v3_clip_provenance_gate_2026-08-01.json");
const batchAuditPath = path.join(reportDir, "scene09_v3_model_submission_batches_audit_2026-07-31.json");
const indexAuditPath = path.join(reportDir, "scene09_v3_model_submission_index_audit_2026-08-01.json");
const providerUploadBundlesAuditPath = path.join(reportDir, "scene09_v3_provider_upload_bundles_audit_2026-08-01.json");
const providerSubmissionFreshnessGatePath = path.join(reportDir, "scene09_v3_provider_submission_freshness_gate_2026-08-01.json");
const battleLedgerPath = path.join(reportDir, "scene09_v3_battle_ledger_timeline_2026-07-28.json");
const modelCliTemplateAuditPath = path.join(reportDir, "scene09_v3_model_cli_template_audit_2026-08-01.json");
const modelCliExecutionProvenanceAuditPath = path.join(reportDir, "scene09_v3_model_cli_execution_provenance_audit_2026-08-01.json");
const motionSelfAuditPacketAuditPath = path.join(reportDir, "scene09_v3_motion_self_audit_packet_audit_2026-08-01.json");
const motionSelfAuditEvidenceContractPath = path.join(reportDir, "scene09_v3_motion_self_audit_evidence_contract_2026-08-01.json");
const motionSelfAuditUnsignedEvidenceRejectionPath = path.join(reportDir, "scene09_v3_motion_self_audit_unsigned_evidence_rejection_2026-08-01.json");
const motionSelfAuditApplyPositiveContractPath = path.join(reportDir, "scene09_v3_motion_self_audit_apply_positive_contract_2026-08-01.json");
const motionSelfAuditApplyGatePath = path.join(reportDir, "scene09_v3_motion_self_audit_apply_gate_2026-08-01.json");
const fullDurationReleaseGatePath = path.join(reportDir, "scene09_v3_full_duration_release_gate_2026-08-01.json");
const afterClipReturnResumePositiveContractPath = path.join(reportDir, "scene09_v3_after_clip_return_resume_positive_contract_2026-08-01.json");
const finalConcatPositiveContractPath = path.join(reportDir, "scene09_v3_final_concat_positive_contract_2026-08-01.json");
const finalEditPositiveContractPath = path.join(reportDir, "scene09_v3_final_edit_positive_contract_2026-08-01.json");
const videoGenerationRunPositiveContractPath = path.join(reportDir, "scene09_v3_video_generation_run_positive_contract_2026-08-01.json");
const positiveContractIsolationGatePath = path.join(reportDir, "scene09_v3_positive_contract_isolation_gate_2026-08-01.json");
const reportFreshnessGatePath = path.join(reportDir, "scene09_v3_report_freshness_gate_2026-08-01.json");
const proxyMisuseGatePath = path.join(reportDir, "scene09_v3_proxy_misuse_gate_2026-08-01.json");
const videoGenerationRunCompletionAuditPath = path.join(reportDir, "scene09_v3_video_generation_run_completion_audit_2026-08-01.json");
const fullLocalVisualReviewPath = path.join(pkgDir, "full_local_visual_review.json");
const motionProbeSubmissionReadyGatePath = path.join(pkgDir, "motion_probe_submission_ready_gate.json");

const modelTargetProfileJson = path.join(pkgDir, "model_target_profile.json");
const modelTargetProfileMd = path.join(pkgDir, "model_target_profile.md");
const preflightJson = path.join(pkgDir, "operator_preflight_status.json");
const preflightMdPath = path.join(pkgDir, "operator_preflight_status.md");
const providerUploadManifestJson = path.join(pkgDir, "provider_upload_manifest.json");

function readJson(file, fallback = null) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
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

function sha256(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function listNamesByHouse(groups = {}) {
  return Object.entries(groups)
    .map(([house, names]) => `${house}: ${(names || []).join(", ") || "none"}`)
    .join("; ") || "none";
}

function changedText(changes = []) {
  return (changes || []).map((item) => `${item.name || item}:${item.status || item.label || "changed"}`).join("; ") || "none";
}

function hasChangedStatus(row, name, status) {
  return (row?.changed_this_shot || []).some((item) => item.name === name && item.status === status);
}

function includesName(groups = {}, name) {
  return Object.values(groups || {}).some((names) => Array.isArray(names) && names.includes(name));
}

function main() {
  const manifest = readJson(packageManifestPath, { shots: [] });
  const pipeline = readJson(pipelineReportPath, {});
  const integrity = readJson(integrityPath, {});
  const actualDeliverySurfaceAudit = readJson(actualDeliverySurfaceAuditPath, {
    decision: "actual_delivery_surface_not_run",
    problems: [],
    evidence: [],
  });
  const executablePromptSemanticsAudit = readJson(executablePromptSemanticsAuditPath, {
    decision: "executable_prompt_semantics_not_run",
    shots_checked: 0,
    problems: [],
    warnings: [],
  });
  const currentStatusConsistencyGate = readJson(currentStatusConsistencyGatePath, {
    decision: "current_status_consistency_not_run",
    problems: [],
    warnings: [],
  });
  const clipRevision = readJson(clipRevisionPath, {});
  const clipReturnIntakeAudit = readJson(clipReturnIntakeAuditPath, {
    decision: "clip_return_intake_not_run",
    batches_checked: 0,
    expected_clip_rows: 0,
    unique_custom_ids: 0,
    problems: [],
  });
  const clipReturnRoundtripAudit = readJson(clipReturnRoundtripAuditPath, {
    decision: "clip_return_roundtrip_not_run",
    scenarios: [],
    problems: [],
  });
  const batchAudit = readJson(batchAuditPath, {});
  const indexAudit = readJson(indexAuditPath, {});
  const providerUploadBundlesAudit = readJson(providerUploadBundlesAuditPath, {
    decision: "provider_upload_bundles_not_run",
    bundles_checked: 0,
    rows_checked: 0,
    unique_custom_ids: 0,
    zip_contents_checked: 0,
    expected_download_rows_checked: 0,
    manifest_digest_records_checked: 0,
    prompt_contract_files_checked: 0,
    negative_prompt_files_checked: 0,
    executable_negative_semantics_files_checked: 0,
    problems: [],
  });
  const providerSubmissionFreshnessGate = readJson(providerSubmissionFreshnessGatePath, {
    decision: "provider_submission_freshness_not_run",
    expected_shots: 0,
    model_submission_batch_rows: 0,
    provider_bundle_rows: 0,
    problems: [],
    warnings: [],
  });
  const submissionContractGate = readJson(submissionContractGatePath, {
    decision: "submission_contract_gate_not_run",
    expected_shots: 0,
    rows_checked: 0,
    execution_plan_rows: 0,
    submission_queue_rows: 0,
    submission_payload_rows: 0,
    problems: [],
  });
  const battleLedger = readJson(battleLedgerPath, { rows: [] });
  const modelCliTemplateAudit = readJson(modelCliTemplateAuditPath, {
    decision: "model_cli_template_not_run",
    configured: false,
    can_execute_with_local_cli: false,
    problems: [],
    warnings: [],
  });
  const modelCliExecutionProvenanceAudit = readJson(modelCliExecutionProvenanceAuditPath, {
    decision: "model_cli_execution_provenance_not_run",
    expected_shots: 0,
    provenance: { rows_checked: 0, unique_expected_clips: 0 },
    problems: [],
  });
  const battleRowsByShot = new Map((battleLedger.rows || []).map((row) => [row.shot, row]));
  const queueRowsByShot = new Map((clipRevision.rows || []).map((row) => [row.shot, row]));
  const requiredPostShotLedgerFields = [
    "Alive / Safe After",
    "Active / Controlling After",
    "Limited But Not Defeated After",
    "Defeated / Removed After",
    "Captured / Objective-Defeated After",
    "Stood Down / Post-Battle After",
    "Must Not Return Active",
    "Changed This Shot",
    "No-Active-Combat Line",
  ];
  const shot032F = battleRowsByShot.get("Shot032F") || {};
  const shot032G = battleRowsByShot.get("Shot032G") || {};
  const shot034B = battleRowsByShot.get("Shot034B") || {};
  const shot034G = battleRowsByShot.get("Shot034G") || {};
  const fullPostShotLedgerContract = {
    source_battle_ledger: "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json",
    rows: (battleLedger.rows || []).length,
    required_review_fields: requiredPostShotLedgerFields,
    motion_self_audit_files: [
      "motion_self_audit/README.md",
      "motion_self_audit/motion_self_audit_matrix.csv",
      "motion_self_audit/decision_update_template.jsonl",
    ],
    critical_locks: {
      shot032F_hubert_captured_by_felix_and_ashe:
        hasChangedStatus(shot032F, "Hubert", "captured_by_felix_and_ashe") &&
        includesName(shot032F.captured_objective_defeated_by_house, "Hubert"),
      shot032G_dorothea_and_bernadetta_captured_by_leonie_and_claude:
        hasChangedStatus(shot032G, "Dorothea", "captured_by_leonie_and_claude") &&
        hasChangedStatus(shot032G, "Bernadetta", "captured_by_leonie_and_claude") &&
        includesName(shot032G.captured_objective_defeated_by_house, "Dorothea") &&
        includesName(shot032G.captured_objective_defeated_by_house, "Bernadetta"),
      shot034B_empty_objective_teachers_absent:
        hasChangedStatus(shot034B, "Hanneman", "objective_defeated_separate_lane") &&
        hasChangedStatus(shot034B, "Manuela", "route_cut_offscreen_unpaired") &&
        includesName(shot034B.captured_objective_defeated_by_house, "Hanneman") &&
        !((shot034B.visible_named_only || []).includes("Hanneman")) &&
        !((shot034B.visible_named_only || []).includes("Manuela")),
      shot034G_exhausted_dimitri_dedue_core:
        hasChangedStatus(shot034G, "Dimitri", "surviving_winner_exhausted") &&
        hasChangedStatus(shot034G, "Dedue", "surviving_winner_exhausted") &&
        includesName(shot034G.active_by_house, "Dimitri") &&
        includesName(shot034G.active_by_house, "Dedue"),
    },
    representative_after_shot_state: {
      Shot032F: {
        captured_objective_defeated_after: listNamesByHouse(shot032F.captured_objective_defeated_by_house),
        changed_this_shot: changedText(shot032F.changed_this_shot),
        must_not_return_active_after: listNamesByHouse(shot032F.must_not_return_active_by_house),
      },
      Shot032G: {
        captured_objective_defeated_after: listNamesByHouse(shot032G.captured_objective_defeated_by_house),
        changed_this_shot: changedText(shot032G.changed_this_shot),
        must_not_return_active_after: listNamesByHouse(shot032G.must_not_return_active_by_house),
      },
      Shot034B: {
        visible_named_only: shot034B.visible_named_only || [],
        captured_objective_defeated_after: listNamesByHouse(shot034B.captured_objective_defeated_by_house),
        changed_this_shot: changedText(shot034B.changed_this_shot),
        no_active_combat_line: shot034B.no_active_combat_line || "none",
      },
      Shot034G: {
        active_controlling_after: listNamesByHouse(shot034G.active_by_house),
        changed_this_shot: changedText(shot034G.changed_this_shot),
        no_active_combat_line: shot034G.no_active_combat_line || "none",
      },
    },
  };

  const date = new Date().toISOString().slice(0, 10);
  const totalShots = Number(manifest.total_shots || (manifest.shots || []).length);
  const expectedClips = Number(pipeline.clip_status?.expected_clips || totalShots);
  const missingClips = Number(pipeline.clip_status?.missing_clips ?? clipRevision.counts?.generation_pending ?? totalShots);
  const readyClips = Number(pipeline.clip_status?.ready_clips || 0);
  const clipProvenanceGate = readJson(clipProvenanceGatePath, {
    decision: "clip_provenance_gate_not_run",
    expected_clips: expectedClips,
    existing_clips: readyClips,
    missing_clips: missingClips,
    provenance_rows: 0,
    problems: [],
    warnings: [],
  });
  const videoGenerationRunCompletionAudit = readJson(videoGenerationRunCompletionAuditPath, {
    decision: "video_generation_run_blocked_clips_pending",
    highest_completed_target: pipeline.highest_completed_target || "prompt_asset_package",
    passed_checks: 1,
    total_checks: 8,
    failed_checks: ["all_expected_clips_structural_pass"],
  });
  const reportFreshnessGate = readJson(reportFreshnessGatePath, {
    decision: "report_freshness_not_run",
    reports_checked: 0,
    problems: [],
    warnings: [],
  });
  const fullLocalVisualReview = readJson(fullLocalVisualReviewPath, {
    decision: "full_local_visual_review_not_run",
    integrity_summary: {
      shots_expected: totalShots,
      shots_reviewed: 0,
      frames_expected: totalShots * 3,
      frames_present: 0,
    },
    visual_audit_coverage: {
      monitor_required: [],
    },
    problems: [],
  });
  const motionProbeSubmissionReadyGate = readJson(motionProbeSubmissionReadyGatePath, {
    decision: "motion_probe_submission_ready_not_run",
    provider_zip_count: 0,
    bundled_probe_rows: 0,
    unique_probe_custom_ids: 0,
    return_batches: 0,
    problems: [],
    warnings: [],
  });
  const motionSelfAuditPacketAudit = readJson(motionSelfAuditPacketAuditPath, {
    decision: "motion_self_audit_packet_not_run",
    rows_checked: 0,
    problems: [],
  });
  const motionSelfAuditEvidenceContract = readJson(motionSelfAuditEvidenceContractPath, {
    decision: "motion_self_audit_evidence_contract_not_run",
    template_rows: 0,
    rows_with_review_frame_signature_keys: 0,
    problems: [],
    warnings: [],
  });
  const motionSelfAuditUnsignedEvidenceRejection = readJson(motionSelfAuditUnsignedEvidenceRejectionPath, {
    decision: "motion_self_audit_unsigned_evidence_rejection_not_run",
    expected_rows: 0,
    probe: {},
    problems: [],
    warnings: [],
  });
  const motionSelfAuditApplyPositiveContract = readJson(motionSelfAuditApplyPositiveContractPath, {
    decision: "motion_self_audit_apply_positive_contract_not_run",
    expected_shots: 0,
    apply_gate: { proposal_rows: 0, applied: false, motion_review_passed: 0 },
    problems: [],
  });
  const finalConcatPositiveContract = readJson(finalConcatPositiveContractPath, {
    decision: "final_concat_positive_contract_not_run",
    expected_shots: 0,
    gate_result: {},
    problems: [],
  });
  const finalEditPositiveContract = readJson(finalEditPositiveContractPath, {
    decision: "final_edit_positive_contract_not_run",
    expected_shots: 0,
    expected_duration_seconds: 0,
    structural_result: {},
    production_existed_before: false,
    production_exists_after: false,
    problems: [],
  });
  const videoGenerationRunPositiveContract = readJson(videoGenerationRunPositiveContractPath, {
    decision: "video_generation_run_positive_contract_not_run",
    expected_shots: 0,
    expected_duration_seconds: 0,
    completion_result: {},
    production_existed_before: false,
    production_exists_after: false,
    problems: [],
  });
  const positiveContractIsolationGate = readJson(positiveContractIsolationGatePath, {
    decision: "positive_contract_isolation_not_run",
    expected_shots: 0,
    production_expected_clips_existing: 0,
    production_final_output_exists: false,
    contracts_checked: 0,
    problems: [],
    warnings: [],
  });
  const afterClipReturnResumePositiveContract = readJson(afterClipReturnResumePositiveContractPath, {
    decision: "after_clip_return_resume_positive_contract_not_run",
    expected_shots: 0,
    ingest_resume: {},
    apply_resume: {},
    fixture_download_shape: null,
    production_existed_before: false,
    production_exists_after: false,
    problems: [],
  });
  const motionSelfAuditApplyGate = readJson(motionSelfAuditApplyGatePath, {
    decision: "motion_self_audit_apply_gate_not_run",
    applied: false,
    proposal_rows: 0,
    summary: {},
    problems: [],
  });
  const fullDurationReleaseGate = readJson(fullDurationReleaseGatePath, {
    decision: "full_duration_release_gate_not_run",
    can_release_full_duration: false,
    expected_probe_clips: totalShots,
    playable_probe_clips: 0,
    review_frame_sets_ready: 0,
    full_duration_approvals: 0,
    release: { exists: false },
    blocking_items: [],
    problems: [],
  });
  const proxyMisuseGate = readJson(proxyMisuseGatePath, {
    decision: "proxy_isolation_not_run",
    expected_clips_existing: readyClips,
    expected_clips_missing: missingClips,
    problems: [],
    warnings: [],
  });
  const modelCliConfigured = Boolean(modelCliTemplateAudit.can_execute_with_local_cli);

  const modelTarget = {
    version: 1,
    date,
    package_id: manifest.package_id,
    package_dir: pkgRel,
    target_stage: "video_generation_run",
    current_highest_completed_target: pipeline.highest_completed_target || "prompt_asset_package",
    provider_mode: modelCliConfigured ? "configured_cli" : "provider_neutral_manual_or_external_cli",
    model_cli_configured: modelCliConfigured,
    input_contract: {
      per_shot_inputs: ["model_prompt.md", "negative_prompt.md", "start_frame.png", "key_frame.png", "end_frame.png", "metadata.json"],
      anchor_policy: "image-to-video start/key/end frame chain; preserve package-local frame files exactly",
      duration_seconds_per_shot: 6,
      total_shots: totalShots,
      total_duration_seconds: manifest.total_duration_seconds || 252,
      output_format: "mp4",
    },
    global_generation_locks: [
      "No anonymous readable students, spectators, soldiers, crowds, bystanders, or silhouettes.",
      "No subtitles, captions, visible text, watermark, letterbox/pillarbox UI, or playback chrome.",
      "Nonlethal Garreg Mach mock-battle tone; no gore, blood, humiliation, or lethal impacts.",
      "Captured, stood-down, objective-defeated, or defeated-house characters must not resume active combat.",
      "Hanneman and Manuela are separate faculty lanes; never side by side, never a unit.",
      "Shot034B: only Byleth and Dimitri; both faculty objective markers stay empty; Hanneman and Manuela absent/offscreen/silent/unpaired.",
    ],
    submission_assets: {
      jsonl_payload: "submission_payload.jsonl",
      actual_delivery_surface_audit: "actual_delivery_surface_audit.json",
      current_status_consistency_gate: "current_status_consistency_gate.json",
      submission_contract_gate: "submission_contract_gate.json",
      upload_batches_index: "model_submission_batches/index.html",
      batch_manifest: "model_submission_batches/batch_manifest.json",
      expected_downloads_csv: "model_submission_batches/expected_downloads.csv",
      motion_probe_submission: "motion_probe_submission/motion_probe_manifest.json",
      motion_probe_package_audit: "motion_probe_package_audit.json",
      motion_probe_provider_bundles: "motion_probe_provider_bundles/motion_probe_provider_bundles_manifest.json",
      motion_probe_provider_bundles_audit: "motion_probe_provider_bundles_audit.json",
      motion_probe_submission_ready_gate: "motion_probe_submission_ready_gate.json",
      full_local_visual_review: "full_local_visual_review.json",
      full_duration_release_gate: "full_duration_release_gate.json",
      battle_ledger_queue_csv: "submission_queue_with_battle_ledger.csv",
      provider_upload_bundles: "provider_upload_bundles/provider_upload_bundles_manifest.json",
      provider_submission_freshness_gate: "provider_submission_freshness_gate.json",
      clip_return_intake: "clip_return_intake/clip_return_intake_manifest.json",
      clip_return_roundtrip_audit: "clip_return_roundtrip_audit.json",
      clip_provenance_gate: "clip_provenance_gate.json",
      motion_self_audit: "motion_self_audit/motion_self_audit_manifest.json",
      motion_self_audit_packet_audit: "motion_self_audit_packet_audit.json",
      motion_self_audit_apply_gate: "motion_self_audit_apply_gate.json",
      model_cli_template_audit: "model_cli_template_audit.json",
      report_freshness_gate: "report_freshness_gate.json",
      proxy_misuse_gate: "proxy_misuse_gate.json",
      video_generation_run_completion_audit: "video_generation_run_completion_audit.json",
      positive_contract_isolation_gate: "positive_contract_isolation_gate.json",
    },
    execution_blocker: fullDurationReleaseGate.can_release_full_duration
      ? (modelCliConfigured ? null : "VIDEO_MODEL_CLI_ARGV_JSON is not configured or has not passed template audit; use released full-duration provider batches or configure a real CLI before --execute.")
      : "Full-duration generation is locked until full_duration_release_gate passes; submit/import motion_probe_provider_bundles before using full-duration provider batches or --execute.",
  };

  const uploadRows = (manifest.shots || []).map((shot) => {
    const queue = queueRowsByShot.get(shot.shot) || {};
    const ledger = battleRowsByShot.get(shot.shot) || {};
    return {
      custom_id: `${String(shot.order).padStart(3, "0")}_${shot.shot}`,
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      status: shot.status,
      duration_seconds: shot.duration_seconds,
      package_dir: shot.package_dir,
      model_prompt: `${shot.package_dir}/model_prompt.md`,
      negative_prompt: `${shot.package_dir}/negative_prompt.md`,
      start_frame: `${shot.package_dir}/start_frame.png`,
      key_frame: `${shot.package_dir}/key_frame.png`,
      end_frame: `${shot.package_dir}/end_frame.png`,
      expected_clip: shot.expected_clip,
      visible_named_only: shot.visible_named_only || [],
      queue_status: queue.queue_status || (queue.clip_exists ? "clip_exists" : "generation_pending"),
      next_action: queue.next_action || "Generate monitored clip and run motion QA.",
      alive_safe_after: ledger.alive_by_house || {},
      active_controlling_after: ledger.active_by_house || {},
      limited_after: ledger.limited_by_house || {},
      defeated_removed_after: ledger.defeated_removed_by_house || {},
      captured_objective_defeated_after: ledger.captured_objective_defeated_by_house || {},
      stood_down_post_battle_after: ledger.stood_down_post_battle_by_house || {},
      must_not_return_active_after: ledger.must_not_return_active_by_house || {},
      changed_this_shot: ledger.changed_this_shot || [],
      no_active_combat_line: ledger.no_active_combat_line || "",
    };
  });

  const canSubmitToProvider = integrity.decision === "execution_asset_integrity_passed" &&
    actualDeliverySurfaceAudit.decision === "actual_delivery_surface_passed" &&
    executablePromptSemanticsAudit.decision === "executable_prompt_semantics_passed" &&
    currentStatusConsistencyGate.decision === "current_status_consistency_passed" &&
    Number(currentStatusConsistencyGate.problems?.length || 0) === 0 &&
    submissionContractGate.decision === "submission_contract_gate_passed" &&
    batchAudit.decision === "model_submission_batches_ready_for_provider_upload" &&
    providerUploadBundlesAudit.decision === "provider_upload_bundles_ready" &&
    providerSubmissionFreshnessGate.decision === "provider_submission_freshness_passed" &&
    fullDurationReleaseGate.decision === "full_duration_release_passed" &&
    fullDurationReleaseGate.can_release_full_duration === true;

  const providerUploadManifest = {
    version: 1,
    date,
    package_id: manifest.package_id,
    status: canSubmitToProvider ? "ready_for_provider_upload_clips_pending" : "blocked_preflight_gate",
    source_package_manifest: "package_manifest.json",
    source_payload_manifest: "submission_payload_manifest.json",
    source_model_batches: "model_submission_batches/batch_manifest.json",
    model_target_profile: "model_target_profile.json",
    operator_preflight_status: "operator_preflight_status.json",
    total_shots: totalShots,
    expected_clips: expectedClips,
    ready_clips: readyClips,
    missing_clips: missingClips,
    rows: uploadRows,
  };

  const preflight = {
    version: 1,
    date,
    package_id: manifest.package_id,
    decision: canSubmitToProvider
      ? (missingClips === 0 ? "clips_available_motion_review_required" : "ready_for_provider_upload_clips_pending")
      : "full_duration_release_pending_probe_review",
    can_submit_to_provider: canSubmitToProvider,
    can_execute_with_local_cli: modelCliConfigured,
    can_claim_video_generation_package: videoGenerationRunCompletionAudit.decision === "video_generation_run_complete",
    can_concat_final_edit: false,
    highest_completed_target: videoGenerationRunCompletionAudit.highest_completed_target || pipeline.highest_completed_target || "prompt_asset_package",
    package_status: manifest.status || "monitor_required",
    evidence: {
      execution_asset_integrity: {
        decision: integrity.decision,
        shots_ready: integrity.shots_ready,
        total_shots: integrity.total_shots,
        problems: (integrity.problems || []).length,
        warnings: (integrity.warnings || []).length,
      },
      actual_delivery_surface_audit: {
        decision: actualDeliverySurfaceAudit.decision,
        problems: (actualDeliverySurfaceAudit.problems || []).length,
        evidence: actualDeliverySurfaceAudit.evidence || [],
      },
      executable_prompt_semantics: {
        decision: executablePromptSemanticsAudit.decision,
        shots_checked: executablePromptSemanticsAudit.shots_checked,
        problems: (executablePromptSemanticsAudit.problems || []).length,
        warnings: (executablePromptSemanticsAudit.warnings || []).length,
      },
      current_status_consistency_gate: {
        decision: currentStatusConsistencyGate.decision,
        problems: (currentStatusConsistencyGate.problems || []).length,
        warnings: (currentStatusConsistencyGate.warnings || []).length,
      },
      batch_upload_audit: {
        decision: batchAudit.decision,
        rows_checked: batchAudit.rows_checked,
        problems: (batchAudit.problems || []).length,
      },
      submission_contract_gate: {
        decision: submissionContractGate.decision,
        expected_shots: submissionContractGate.expected_shots,
        rows_checked: submissionContractGate.rows_checked,
        execution_plan_rows: submissionContractGate.execution_plan_rows,
        submission_queue_rows: submissionContractGate.submission_queue_rows,
        submission_payload_rows: submissionContractGate.submission_payload_rows,
        problems: (submissionContractGate.problems || []).length,
      },
      model_submission_index: {
        decision: indexAudit.decision,
        shot_cards: indexAudit.shot_cards,
        links_checked: indexAudit.links_checked,
        problems: (indexAudit.problems || []).length,
      },
      provider_upload_bundles: {
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
        problems: (providerUploadBundlesAudit.problems || []).length,
      },
      provider_submission_freshness_gate: {
        decision: providerSubmissionFreshnessGate.decision,
        expected_shots: providerSubmissionFreshnessGate.expected_shots,
        model_submission_batch_rows: providerSubmissionFreshnessGate.model_submission_batch_rows,
        provider_bundle_rows: providerSubmissionFreshnessGate.provider_bundle_rows,
        problems: (providerSubmissionFreshnessGate.problems || []).length,
        warnings: (providerSubmissionFreshnessGate.warnings || []).length,
      },
      battle_ledger_timeline: {
        decision: battleLedger.decision,
        shots: battleLedger.shots,
        problems: (battleLedger.problems || []).length,
      },
      model_cli_template_audit: {
        decision: modelCliTemplateAudit.decision,
        configured: Boolean(modelCliTemplateAudit.configured),
        can_execute_with_local_cli: Boolean(modelCliTemplateAudit.can_execute_with_local_cli),
        problems: (modelCliTemplateAudit.problems || []).length,
        warnings: (modelCliTemplateAudit.warnings || []).length,
      },
      model_cli_execution_provenance: {
        decision: modelCliExecutionProvenanceAudit.decision,
        expected_shots: modelCliExecutionProvenanceAudit.expected_shots,
        rows_checked: modelCliExecutionProvenanceAudit.provenance?.rows_checked || 0,
        unique_expected_clips: modelCliExecutionProvenanceAudit.provenance?.unique_expected_clips || 0,
        problems: (modelCliExecutionProvenanceAudit.problems || []).length,
      },
      clip_status: {
        decision: pipeline.clip_status?.decision || "clips_pending",
        expected_clips: expectedClips,
        ready_clips: readyClips,
        missing_clips: missingClips,
        failed_clips: Number(pipeline.clip_status?.failed_clips || 0),
      },
      clip_revision_queue: {
        decision: clipRevision.decision,
        actionable_shots: clipRevision.actionable_shots,
        counts: clipRevision.counts || {},
      },
      clip_return_intake: {
        decision: clipReturnIntakeAudit.decision,
        batches_checked: clipReturnIntakeAudit.batches_checked,
        expected_clip_rows: clipReturnIntakeAudit.expected_clip_rows,
        unique_custom_ids: clipReturnIntakeAudit.unique_custom_ids,
        source_files_checked: clipReturnIntakeAudit.source_files_checked || 0,
        problems: (clipReturnIntakeAudit.problems || []).length,
      },
      clip_return_roundtrip: {
        decision: clipReturnRoundtripAudit.decision,
        scenarios: (clipReturnRoundtripAudit.scenarios || []).map((scenario) => ({
          strategy: scenario.strategy,
          unique_matched_shots: scenario.unique_matched_shots,
          would_copy: scenario.would_copy,
          unsupported_video_files: scenario.unsupported_video_files || 0,
          invalid_video_files: scenario.invalid_video_files || 0,
          problems: (scenario.problems || []).length,
        })),
        problems: (clipReturnRoundtripAudit.problems || []).length,
      },
      clip_provenance_gate: {
        decision: clipProvenanceGate.decision,
        expected_clips: clipProvenanceGate.expected_clips,
        existing_clips: clipProvenanceGate.existing_clips,
        missing_clips: clipProvenanceGate.missing_clips,
        provenance_rows: clipProvenanceGate.provenance_rows,
        problems: (clipProvenanceGate.problems || []).length,
        warnings: (clipProvenanceGate.warnings || []).length,
      },
      motion_self_audit_packet: {
        decision: motionSelfAuditPacketAudit.decision,
        rows_checked: motionSelfAuditPacketAudit.rows_checked,
        full_post_shot_ledger_fields: requiredPostShotLedgerFields,
        critical_locks: fullPostShotLedgerContract.critical_locks,
        problems: (motionSelfAuditPacketAudit.problems || []).length,
      },
      motion_self_audit_evidence_contract: {
        decision: motionSelfAuditEvidenceContract.decision,
        template_rows: motionSelfAuditEvidenceContract.template_rows,
        rows_with_review_frame_signature_keys: motionSelfAuditEvidenceContract.rows_with_review_frame_signature_keys,
        problems: (motionSelfAuditEvidenceContract.problems || []).length,
        warnings: (motionSelfAuditEvidenceContract.warnings || []).length,
      },
      motion_self_audit_unsigned_evidence_rejection: {
        decision: motionSelfAuditUnsignedEvidenceRejection.decision,
        rows_tested: motionSelfAuditUnsignedEvidenceRejection.expected_rows,
        frame_signature_rejections: motionSelfAuditUnsignedEvidenceRejection.probe?.frame_signature_rejections || 0,
        clip_signature_rejections: motionSelfAuditUnsignedEvidenceRejection.probe?.clip_signature_rejections || 0,
        problems: (motionSelfAuditUnsignedEvidenceRejection.problems || []).length,
        warnings: (motionSelfAuditUnsignedEvidenceRejection.warnings || []).length,
      },
      motion_self_audit_apply_positive_contract: {
        decision: motionSelfAuditApplyPositiveContract.decision,
        expected_shots: motionSelfAuditApplyPositiveContract.expected_shots,
        proposal_rows: motionSelfAuditApplyPositiveContract.apply_gate?.proposal_rows || 0,
        applied: motionSelfAuditApplyPositiveContract.apply_gate?.applied === true,
        motion_review_passed: motionSelfAuditApplyPositiveContract.apply_gate?.motion_review_passed || 0,
        problems: (motionSelfAuditApplyPositiveContract.problems || []).length,
      },
      motion_self_audit_apply_gate: {
        decision: motionSelfAuditApplyGate.decision,
        applied: motionSelfAuditApplyGate.applied,
        proposal_rows: motionSelfAuditApplyGate.proposal_rows,
        passed_rows: motionSelfAuditApplyGate.summary?.motion_review_passed || 0,
        blocked_or_rejected: motionSelfAuditApplyGate.summary?.blocked_or_rejected || 0,
        problems: (motionSelfAuditApplyGate.problems || []).length,
      },
      full_duration_release_gate: {
        decision: fullDurationReleaseGate.decision,
        can_release_full_duration: Boolean(fullDurationReleaseGate.can_release_full_duration),
        expected_probe_clips: fullDurationReleaseGate.expected_probe_clips,
        playable_probe_clips: fullDurationReleaseGate.playable_probe_clips,
        review_frame_sets_ready: fullDurationReleaseGate.review_frame_sets_ready,
        full_duration_approvals: fullDurationReleaseGate.full_duration_approvals,
        release_exists: Boolean(fullDurationReleaseGate.release?.exists),
        blocking_items: (fullDurationReleaseGate.blocking_items || []).length,
        problems: (fullDurationReleaseGate.problems || []).length,
      },
      motion_probe_submission_ready_gate: {
        decision: motionProbeSubmissionReadyGate.decision,
        provider_zip_count: motionProbeSubmissionReadyGate.provider_zip_count || 0,
        bundled_probe_rows: motionProbeSubmissionReadyGate.bundled_probe_rows || 0,
        unique_probe_custom_ids: motionProbeSubmissionReadyGate.unique_probe_custom_ids || 0,
        return_batches: motionProbeSubmissionReadyGate.return_batches || 0,
        problems: (motionProbeSubmissionReadyGate.problems || []).length,
        warnings: (motionProbeSubmissionReadyGate.warnings || []).length,
      },
      after_clip_return_resume_positive_contract: {
        decision: afterClipReturnResumePositiveContract.decision,
        expected_shots: afterClipReturnResumePositiveContract.expected_shots,
        fixture_download_shape: afterClipReturnResumePositiveContract.fixture_download_shape || null,
        ingest_decision: afterClipReturnResumePositiveContract.ingest_resume?.decision || null,
        apply_decision: afterClipReturnResumePositiveContract.apply_resume?.decision || null,
        clips_ready: afterClipReturnResumePositiveContract.apply_resume?.clips_ready || 0,
        motion_frames: afterClipReturnResumePositiveContract.apply_resume?.motion_frames || 0,
        final_concat_gate: afterClipReturnResumePositiveContract.apply_resume?.final_concat_gate || null,
        production_final_output_changed: afterClipReturnResumePositiveContract.production_existed_before !== afterClipReturnResumePositiveContract.production_exists_after,
        problems: (afterClipReturnResumePositiveContract.problems || []).length,
      },
      final_concat_positive_contract: {
        decision: finalConcatPositiveContract.decision,
        expected_shots: finalConcatPositiveContract.expected_shots,
        gate_decision: finalConcatPositiveContract.gate_result?.decision || null,
        gate_passed_checks: finalConcatPositiveContract.gate_result?.passed_checks || 0,
        gate_total_checks: finalConcatPositiveContract.gate_result?.total_checks || 0,
        problems: (finalConcatPositiveContract.problems || []).length,
      },
      final_edit_positive_contract: {
        decision: finalEditPositiveContract.decision,
        expected_shots: finalEditPositiveContract.expected_shots,
        expected_duration_seconds: finalEditPositiveContract.expected_duration_seconds,
        structural_decision: finalEditPositiveContract.structural_result?.decision || null,
        structural_ok: finalEditPositiveContract.structural_result?.final_edit?.ok === true,
        production_final_output_changed: finalEditPositiveContract.production_existed_before !== finalEditPositiveContract.production_exists_after,
        problems: (finalEditPositiveContract.problems || []).length,
      },
      video_generation_run_positive_contract: {
        decision: videoGenerationRunPositiveContract.decision,
        expected_shots: videoGenerationRunPositiveContract.expected_shots,
        expected_duration_seconds: videoGenerationRunPositiveContract.expected_duration_seconds,
        completion_decision: videoGenerationRunPositiveContract.completion_result?.decision || null,
        completion_passed_checks: videoGenerationRunPositiveContract.completion_result?.passed_checks || 0,
        completion_total_checks: videoGenerationRunPositiveContract.completion_result?.total_checks || 0,
        highest_completed_target: videoGenerationRunPositiveContract.completion_result?.highest_completed_target || null,
        production_final_output_changed: videoGenerationRunPositiveContract.production_existed_before !== videoGenerationRunPositiveContract.production_exists_after,
        problems: (videoGenerationRunPositiveContract.problems || []).length,
      },
      positive_contract_isolation_gate: {
        decision: positiveContractIsolationGate.decision,
        expected_shots: positiveContractIsolationGate.expected_shots,
        production_expected_clips_existing: positiveContractIsolationGate.production_expected_clips_existing,
        production_final_output_exists: positiveContractIsolationGate.production_final_output_exists,
        contracts_checked: positiveContractIsolationGate.contracts_checked,
        problems: (positiveContractIsolationGate.problems || []).length,
        warnings: (positiveContractIsolationGate.warnings || []).length,
      },
      report_freshness_gate: {
        decision: reportFreshnessGate.decision,
        reports_checked: reportFreshnessGate.reports_checked,
        problems: (reportFreshnessGate.problems || []).length,
        warnings: (reportFreshnessGate.warnings || []).length,
      },
      full_local_visual_review: {
        decision: fullLocalVisualReview.decision,
        shots_reviewed: fullLocalVisualReview.integrity_summary?.shots_reviewed || 0,
        shots_expected: fullLocalVisualReview.integrity_summary?.shots_expected || totalShots,
        frames_present: fullLocalVisualReview.integrity_summary?.frames_present || 0,
        frames_expected: fullLocalVisualReview.integrity_summary?.frames_expected || totalShots * 3,
        monitor_required: fullLocalVisualReview.visual_audit_coverage?.monitor_required?.length || 0,
        problems: (fullLocalVisualReview.problems || []).length,
      },
      proxy_misuse_gate: {
        decision: proxyMisuseGate.decision,
        expected_clips_existing: proxyMisuseGate.expected_clips_existing,
        expected_clips_missing: proxyMisuseGate.expected_clips_missing,
        problems: (proxyMisuseGate.problems || []).length,
        warnings: (proxyMisuseGate.warnings || []).length,
      },
      video_generation_run_completion: {
        decision: videoGenerationRunCompletionAudit.decision,
        highest_completed_target: videoGenerationRunCompletionAudit.highest_completed_target,
        passed_checks: videoGenerationRunCompletionAudit.passed_checks,
        total_checks: videoGenerationRunCompletionAudit.total_checks,
        failed_checks: videoGenerationRunCompletionAudit.failed_checks || [],
      },
    },
    full_post_shot_ledger_contract: fullPostShotLedgerContract,
    next_required_external_action: fullDurationReleaseGate.can_release_full_duration
      ? (modelCliConfigured
        ? "Run node scripts/run_scene09_v3_video_pipeline.js --execute, then perform Codex motion QA on generated clips."
        : "Submit the 7 provider-neutral full-duration batches or configure VIDEO_MODEL_CLI_ARGV_JSON, then import/generate all 42 mp4 clips.")
      : "Submit/import the 7 motion-probe batches first, run probe clip structural QA and Codex probe review, then apply signed probe decisions until full_duration_release_gate passes.",
    after_clip_return_resume_fixture_download_shape: afterClipReturnResumePositiveContract.fixture_download_shape || null,
    after_clips_exist: [
      "Run node scripts/ingest_scene09_v3_generated_clips.js for external downloads, if applicable.",
      "Run node scripts/run_scene09_v3_video_pipeline.js --dry-run.",
      "Review extracted start/mid/end motion frames and update motion decisions while preserving clip_signature and review_evidence.review_frame_signatures.start/mid/end.",
      "Only concatenate after all 42 clips pass file QA and motion_review_passed.",
    ],
  };

  writeJson(modelTargetProfileJson, modelTarget);
  writeJson(providerUploadManifestJson, providerUploadManifest);
  writeJson(preflightJson, preflight);

  const modelMd = [
    "# Scene09 V3 Model Target Profile",
    "",
    `Date: ${date}`,
    `Package: ${manifest.package_id}`,
    `Provider mode: ${modelTarget.provider_mode}`,
    `Model CLI configured: ${modelCliConfigured ? "yes" : "no"}`,
    "",
    "## Input Contract",
    "",
    "- Use `model_prompt.md`, `negative_prompt.md`, and package-local `start_frame.png`, `key_frame.png`, `end_frame.png` for every shot.",
    "- Preserve the start/key/end frame chain exactly; do not redesign identities, wardrobes, weapons, house colors, or geography.",
    "- After `full_duration_release_gate` passes, generate one 6-second mp4 per row and save it to the exact `expected_clip` path.",
    "",
    "## Global Locks",
    "",
    ...modelTarget.global_generation_locks.map((line) => `- ${line}`),
    "",
    "## Upload Assets",
    "",
    "- `submission_payload.jsonl` for structured submitters.",
    "- `actual_delivery_surface_audit.md` for proving current Shot034B Hanneman/Manuela surfaces are repaired across manifests, prompts, payload, and file:// viewers.",
    "- `current_status_consistency_gate.md` for proving the current status page matches machine-readable reports and older status files are marked superseded.",
    "- `submission_contract_gate.md` for cross-checking manifest, execution plan, queue, JSONL payload, and metadata model-entry fields.",
    "- `model_submission_batches/index.html` for file:// manual full-duration batch upload after `full_duration_release_gate` passes.",
    "- `model_submission_batches/expected_downloads.csv` for matching returned mp4 files.",
    "- `motion_probe_submission/` for 42 three-second identity/continuity probes before full-duration generation.",
    "- `motion_probe_package_audit.md` for proving every probe prompt keeps current frame locks, negative prompts, post-shot ledger fields, teacher separation, and full-duration release conditions.",
    "- `motion_probe_provider_bundles/` for zipped, self-contained three-second probe upload batches.",
    "- `motion_probe_provider_bundles_audit.md` for proving probe ZIPs are complete, bundle-local, and tied to 42 unique expected probe returns.",
    "- `motion_probe_submission_ready_gate.md` for the final pre-submit check across 7 probe ZIPs, 42 custom IDs, return intake folders, tracker state, local visual review, and locked full-duration release.",
    "- `full_duration_release_gate.md` for proving full-duration generation remains locked until the production probe apply gate writes `motion_probe_full_duration_release.json`.",
    "- `provider_submission_freshness_gate.md` for proving model batches and provider bundles match the current final payload.",
    "- `submission_queue_with_battle_ledger.csv` for per-shot active/defeated/must-not-return state.",
    "- `clip_return_intake/` for provider-returned mp4 dry-run/apply ingest, including whole-package recursive resume from the intake root after all batch folders are populated.",
    "- `clip_return_roundtrip_audit.md` for strict expected-filename/custom-id return matching, whole-package recursive intake, loose shot-name rejection, unsupported-format rejection, and invalid `.mp4` rejection.",
    "- `clip_provenance_gate.md` for generated clip source and SHA-256 provenance.",
    "- `motion_self_audit/` for Codex-only post-generation motion review decisions.",
    "- `motion_self_audit_packet_audit.md` for self-audit checklist integrity.",
    "- `motion_self_audit_evidence_contract.md` for clip/frame signature evidence requirements.",
    "- `motion_self_audit_unsigned_evidence_rejection.md` for the negative regression test rejecting booleans-only approvals.",
    "- `motion_self_audit_apply_gate.md` for strict validation before Codex motion decisions are written back.",
    "- `after_clip_return_resume_positive_contract.md`, `final_concat_positive_contract.md`, `final_edit_positive_contract.md`, and `video_generation_run_positive_contract.md` for temporary positive-path gate proofs.",
    "- `positive_contract_isolation_gate.md` for proving temporary positive-contract fixtures do not pollute production expected clips or final edit output.",
    "- `model_cli_template_audit.md` for local CLI argv placeholder validation.",
    "",
  ].join("\n");
  writeText(modelTargetProfileMd, modelMd);

  const preflightMdText = [
    "# Scene09 V3 Operator Preflight Status",
    "",
    `Date: ${date}`,
    `Decision: ${preflight.decision}`,
    `Can submit to provider: ${preflight.can_submit_to_provider ? "yes" : "no"}`,
    `Can execute with local CLI: ${preflight.can_execute_with_local_cli ? "yes" : "no"}`,
    `Can claim final video package: ${preflight.can_claim_video_generation_package ? "yes" : "no"}`,
    "",
    "## Evidence",
    "",
    `- Execution assets: ${integrity.decision} (${integrity.shots_ready || 0}/${integrity.total_shots || totalShots}, problems ${(integrity.problems || []).length})`,
    `- Actual delivery surface audit: ${actualDeliverySurfaceAudit.decision} (problems ${(actualDeliverySurfaceAudit.problems || []).length})`,
    `- Executable prompt semantics: ${executablePromptSemanticsAudit.decision} (${executablePromptSemanticsAudit.shots_checked || 0} shots, problems ${(executablePromptSemanticsAudit.problems || []).length})`,
    `- Current status consistency gate: ${currentStatusConsistencyGate.decision} (problems ${(currentStatusConsistencyGate.problems || []).length}, warnings ${(currentStatusConsistencyGate.warnings || []).length})`,
    `- Batch upload audit: ${batchAudit.decision} (${batchAudit.rows_checked || 0} rows, problems ${(batchAudit.problems || []).length})`,
    `- Submission contract gate: ${submissionContractGate.decision} (${submissionContractGate.rows_checked || 0}/${submissionContractGate.expected_shots || totalShots} rows, plan ${submissionContractGate.execution_plan_rows || 0}, queue ${submissionContractGate.submission_queue_rows || 0}, payload ${submissionContractGate.submission_payload_rows || 0}, problems ${(submissionContractGate.problems || []).length})`,
    `- Model submission index: ${indexAudit.decision} (${indexAudit.shot_cards || 0} cards, problems ${(indexAudit.problems || []).length})`,
    `- Provider upload bundles: ${providerUploadBundlesAudit.decision} (${providerUploadBundlesAudit.bundles_checked || 0} bundles, ${providerUploadBundlesAudit.zip_contents_checked || 0} zip contents checked, expected-download rows ${providerUploadBundlesAudit.expected_download_rows_checked || 0}, digest records ${providerUploadBundlesAudit.manifest_digest_records_checked || 0}, prompt files ${providerUploadBundlesAudit.prompt_contract_files_checked || 0}, negative prompts ${providerUploadBundlesAudit.negative_prompt_files_checked || 0}, executable negative semantics ${providerUploadBundlesAudit.executable_negative_semantics_files_checked || 0}, problems ${(providerUploadBundlesAudit.problems || []).length})`,
    `- Provider submission freshness gate: ${providerSubmissionFreshnessGate.decision} (batch rows ${providerSubmissionFreshnessGate.model_submission_batch_rows || 0}/${providerSubmissionFreshnessGate.expected_shots || totalShots}, provider rows ${providerSubmissionFreshnessGate.provider_bundle_rows || 0}/${providerSubmissionFreshnessGate.expected_shots || totalShots}, problems ${(providerSubmissionFreshnessGate.problems || []).length})`,
    `- Battle ledger timeline: ${battleLedger.decision} (${battleLedger.shots || 0} shots, problems ${(battleLedger.problems || []).length})`,
    `- Model CLI template audit: ${modelCliTemplateAudit.decision} (configured ${modelCliTemplateAudit.configured ? "yes" : "no"}, problems ${(modelCliTemplateAudit.problems || []).length})`,
    `- Clips: ${readyClips}/${expectedClips} ready, ${missingClips} missing`,
    `- Clip return roundtrip: ${clipReturnRoundtripAudit.decision} (${(clipReturnRoundtripAudit.problems || []).length} problems)`,
    `- After clip return resume fixture shape: ${preflight.after_clip_return_resume_fixture_download_shape || "unknown"}`,
    `- Clip provenance gate: ${clipProvenanceGate.decision} (${clipProvenanceGate.existing_clips || 0}/${clipProvenanceGate.expected_clips || expectedClips} existing, problems ${(clipProvenanceGate.problems || []).length})`,
    `- Motion self-audit packet: ${motionSelfAuditPacketAudit.decision} (${motionSelfAuditPacketAudit.rows_checked || 0} rows, problems ${(motionSelfAuditPacketAudit.problems || []).length})`,
    `- Motion ledger contract: ${fullPostShotLedgerContract.rows}/42 rows, fields ${requiredPostShotLedgerFields.length}/9, critical locks ${Object.values(fullPostShotLedgerContract.critical_locks).filter(Boolean).length}/4`,
    `- Motion self-audit evidence contract: ${motionSelfAuditEvidenceContract.decision} (${motionSelfAuditEvidenceContract.template_rows || 0} rows, frame-signature rows ${motionSelfAuditEvidenceContract.rows_with_review_frame_signature_keys || 0}, problems ${(motionSelfAuditEvidenceContract.problems || []).length})`,
    `- Motion unsigned-evidence rejection: ${motionSelfAuditUnsignedEvidenceRejection.decision} (frame rejects ${motionSelfAuditUnsignedEvidenceRejection.probe?.frame_signature_rejections || 0}, clip rejects ${motionSelfAuditUnsignedEvidenceRejection.probe?.clip_signature_rejections || 0}, problems ${(motionSelfAuditUnsignedEvidenceRejection.problems || []).length})`,
    `- Motion probe submission ready gate: ${motionProbeSubmissionReadyGate.decision} (zips ${motionProbeSubmissionReadyGate.provider_zip_count || 0}/7, rows ${motionProbeSubmissionReadyGate.bundled_probe_rows || 0}/${totalShots}, unique IDs ${motionProbeSubmissionReadyGate.unique_probe_custom_ids || 0}/${totalShots}, return batches ${motionProbeSubmissionReadyGate.return_batches || 0}/7, problems ${(motionProbeSubmissionReadyGate.problems || []).length})`,
    `- Full-duration release gate: ${fullDurationReleaseGate.decision} (can release ${fullDurationReleaseGate.can_release_full_duration ? "yes" : "no"}, playable probes ${fullDurationReleaseGate.playable_probe_clips || 0}/${fullDurationReleaseGate.expected_probe_clips || totalShots}, review frames ${fullDurationReleaseGate.review_frame_sets_ready || 0}, release ${fullDurationReleaseGate.release?.exists ? "present" : "absent"}, blockers ${(fullDurationReleaseGate.blocking_items || []).length}, problems ${(fullDurationReleaseGate.problems || []).length})`,
    `- Full local visual review: ${fullLocalVisualReview.decision} (${fullLocalVisualReview.integrity_summary?.shots_reviewed || 0}/${fullLocalVisualReview.integrity_summary?.shots_expected || totalShots} shots, ${fullLocalVisualReview.integrity_summary?.frames_present || 0}/${fullLocalVisualReview.integrity_summary?.frames_expected || totalShots * 3} frames, monitor ${fullLocalVisualReview.visual_audit_coverage?.monitor_required?.length || 0}/${totalShots})`,
    `- Report freshness gate: ${reportFreshnessGate.decision} (${reportFreshnessGate.reports_checked || 0} reports, problems ${(reportFreshnessGate.problems || []).length})`,
    `- Positive contract isolation gate: ${positiveContractIsolationGate.decision} (${positiveContractIsolationGate.contracts_checked || 0} contracts, production clips ${positiveContractIsolationGate.production_expected_clips_existing || 0}/${positiveContractIsolationGate.expected_shots || totalShots}, production final ${positiveContractIsolationGate.production_final_output_exists ? "exists" : "absent"}, problems ${(positiveContractIsolationGate.problems || []).length})`,
    `- Proxy misuse gate: ${proxyMisuseGate.decision} (problems ${(proxyMisuseGate.problems || []).length})`,
    `- Video generation run completion: ${videoGenerationRunCompletionAudit.decision} (${videoGenerationRunCompletionAudit.passed_checks || 0}/${videoGenerationRunCompletionAudit.total_checks || 0} checks)`,
    "",
    "## Motion Ledger Contract",
    "",
    `- Required fields: ${requiredPostShotLedgerFields.join("; ")}`,
    `- Shot032F: Hubert captured by Felix/Ashe -> ${fullPostShotLedgerContract.critical_locks.shot032F_hubert_captured_by_felix_and_ashe ? "locked" : "missing"}`,
    `- Shot032G: Dorothea and Bernadetta captured by Leonie/Claude -> ${fullPostShotLedgerContract.critical_locks.shot032G_dorothea_and_bernadetta_captured_by_leonie_and_claude ? "locked" : "missing"}`,
    `- Shot034B: empty faculty objective, Hanneman/Manuela absent/offscreen/unpaired -> ${fullPostShotLedgerContract.critical_locks.shot034B_empty_objective_teachers_absent ? "locked" : "missing"}`,
    `- Shot034G: exhausted Dimitri/Dedue core -> ${fullPostShotLedgerContract.critical_locks.shot034G_exhausted_dimitri_dedue_core ? "locked" : "missing"}`,
    "- The same fields must remain present in the Codex motion self-audit matrix, update template, README, provider upload manifest, and local CLI handoff comments.",
    "",
    "## Current Blocker",
    "",
    fullDurationReleaseGate.can_release_full_duration
      ? (modelCliConfigured
        ? "- Local model CLI is configured, but generated clips still need execution and motion QA."
        : "- `VIDEO_MODEL_CLI_ARGV_JSON` is not configured, so released full-duration generation requires provider batch upload or CLI configuration.")
      : "- Full-duration generation is locked until 42/42 returned motion probes pass Codex review and `full_duration_release_gate` reaches `full_duration_release_passed`. `VIDEO_MODEL_CLI_ARGV_JSON` is also not configured for local execution.",
    "",
    "## Next Action",
    "",
    `- ${preflight.next_required_external_action}`,
    "- Keep all returned clips named/matched through `model_submission_batches/expected_downloads.csv` or the ingest script.",
    "- After import/generation, run the dry-run to extract start/mid/end review frames; Codex self-audit rows must preserve the current clip and frame SHA-256 signatures before apply.",
    "- Do not promote beyond `monitor_required` until all clips pass motion QA and no revision queue rows remain actionable.",
    "",
  ].join("\n");
  writeText(preflightMdPath, preflightMdText);

  manifest.model_target_profile = "model_target_profile.md";
  manifest.model_target_profile_json = "model_target_profile.json";
  manifest.operator_preflight_status = "operator_preflight_status.md";
  manifest.operator_preflight_status_json = "operator_preflight_status.json";
  manifest.provider_upload_manifest = "provider_upload_manifest.json";
  manifest.execution_readiness = {
    decision: preflight.decision,
    can_submit_to_provider: preflight.can_submit_to_provider,
    can_claim_video_generation_package: preflight.can_claim_video_generation_package,
    model_cli_configured: modelCliConfigured,
    expected_clips: expectedClips,
    ready_clips: readyClips,
    missing_clips: missingClips,
    highest_completed_target: preflight.highest_completed_target,
    clip_return_roundtrip: clipReturnRoundtripAudit.decision,
    actual_delivery_surface_audit: actualDeliverySurfaceAudit.decision,
    current_status_consistency_gate: currentStatusConsistencyGate.decision,
    submission_contract_gate: submissionContractGate.decision,
    clip_provenance_gate: clipProvenanceGate.decision,
    provider_upload_bundles: providerUploadBundlesAudit.decision,
    provider_submission_freshness_gate: providerSubmissionFreshnessGate.decision,
    full_duration_release_gate: fullDurationReleaseGate.decision,
    can_release_full_duration: Boolean(fullDurationReleaseGate.can_release_full_duration),
    executable_prompt_semantics: executablePromptSemanticsAudit.decision,
    provider_upload_zip_contents_checked: providerUploadBundlesAudit.zip_contents_checked || 0,
    provider_upload_expected_download_rows_checked: providerUploadBundlesAudit.expected_download_rows_checked || 0,
    provider_upload_manifest_digest_records_checked: providerUploadBundlesAudit.manifest_digest_records_checked || 0,
    provider_upload_prompt_contract_files_checked: providerUploadBundlesAudit.prompt_contract_files_checked || 0,
    provider_upload_negative_prompt_files_checked: providerUploadBundlesAudit.negative_prompt_files_checked || 0,
    provider_upload_executable_negative_semantics_files_checked: providerUploadBundlesAudit.executable_negative_semantics_files_checked || 0,
    report_freshness_gate: reportFreshnessGate.decision,
    full_local_visual_review: fullLocalVisualReview.decision,
    motion_probe_submission_ready_gate: motionProbeSubmissionReadyGate.decision,
    motion_self_audit_packet: motionSelfAuditPacketAudit.decision,
    motion_self_audit_evidence_contract: motionSelfAuditEvidenceContract.decision,
    motion_self_audit_unsigned_evidence_rejection: motionSelfAuditUnsignedEvidenceRejection.decision,
    motion_self_audit_apply_gate: motionSelfAuditApplyGate.decision,
    after_clip_return_resume_positive_contract: afterClipReturnResumePositiveContract.decision,
    after_clip_return_fixture_shape: afterClipReturnResumePositiveContract.fixture_download_shape || null,
    final_concat_positive_contract: finalConcatPositiveContract.decision,
    final_edit_positive_contract: finalEditPositiveContract.decision,
    video_generation_run_positive_contract: videoGenerationRunPositiveContract.decision,
    positive_contract_isolation_gate: positiveContractIsolationGate.decision,
    proxy_misuse_gate: proxyMisuseGate.decision,
    video_generation_run_completion: videoGenerationRunCompletionAudit.decision,
  };
  writeJson(packageManifestPath, manifest);

  const runbook = readText(runbookPath);
  const section = [
    "## Generated Operator Profile",
    "",
    "- Model target profile: `model_target_profile.md` / `model_target_profile.json`.",
    "- Operator preflight status: `operator_preflight_status.md` / `operator_preflight_status.json`.",
    "- Actual delivery surface audit: `actual_delivery_surface_audit.md` / `actual_delivery_surface_audit.json`.",
    "- Current status consistency gate: `current_status_consistency_gate.md` / `current_status_consistency_gate.json`.",
    "- Submission contract gate: `submission_contract_gate.md` / `submission_contract_gate.json`.",
    "- Provider submission freshness gate: `provider_submission_freshness_gate.md` / `provider_submission_freshness_gate.json`.",
    "- Provider upload manifest: `provider_upload_manifest.json`.",
    "- Motion probe submission: `motion_probe_submission/` and `motion_probe_package_audit.md` / `motion_probe_package_audit.json`.",
    "- Motion probe provider bundles: `motion_probe_provider_bundles/` and `motion_probe_provider_bundles_audit.md` / `motion_probe_provider_bundles_audit.json`.",
    "- Motion probe submission ready gate: `motion_probe_submission_ready_gate.md` / `motion_probe_submission_ready_gate.json`.",
    "- Motion probe operator tracker: `motion_probe_operator_tracker.html` / `motion_probe_operator_tracker.json` / `motion_probe_operator_tracker.csv`.",
    "- Motion probe operator tracker audit: `motion_probe_operator_tracker_audit.md` / `motion_probe_operator_tracker_audit.json`.",
    "- Full local visual review: `full_local_visual_review.md` / `full_local_visual_review.json`.",
    "- Full-duration release gate: `full_duration_release_gate.md` / `full_duration_release_gate.json`.",
    "- Model CLI template audit: `model_cli_template_audit.md` / `model_cli_template_audit.json`.",
    "- Clip return roundtrip audit: `clip_return_roundtrip_audit.md` / `clip_return_roundtrip_audit.json`.",
    "- Clip provenance gate: `clip_provenance_gate.md` / `clip_provenance_gate.json`.",
    "- Motion self-audit packet audit: `motion_self_audit_packet_audit.md` / `motion_self_audit_packet_audit.json`.",
    "- Motion self-audit evidence contract: `motion_self_audit_evidence_contract.md` / `motion_self_audit_evidence_contract.json`.",
    "- Motion self-audit unsigned-evidence rejection: `motion_self_audit_unsigned_evidence_rejection.md` / `motion_self_audit_unsigned_evidence_rejection.json`.",
    "- Report freshness gate: `report_freshness_gate.md` / `report_freshness_gate.json`.",
    "- Positive contract isolation gate: `positive_contract_isolation_gate.md` / `positive_contract_isolation_gate.json`.",
    "- Proxy misuse gate: `proxy_misuse_gate.md` / `proxy_misuse_gate.json`.",
    "- Video generation run completion audit: `video_generation_run_completion_audit.md` / `video_generation_run_completion_audit.json`.",
    "- Battle-ledger submission queue: `submission_queue_with_battle_ledger.csv` / `submission_queue_with_battle_ledger.md`.",
    "",
  ].join("\n");
  const nextRunbook = runbook.includes("## Generated Operator Profile")
    ? runbook.replace(/## Generated Operator Profile\n[\s\S]*?(?=\n## )/, section.trimEnd())
    : runbook.replace("\n## Current Model CLI\n", `\n${section}\n## Current Model CLI\n`);
  writeText(runbookPath, nextRunbook);

  const outputFiles = [
    modelTargetProfileJson,
    modelTargetProfileMd,
    providerUploadManifestJson,
    preflightJson,
    preflightMdPath,
  ];
  console.log(JSON.stringify({
    ok: true,
    decision: preflight.decision,
    can_submit_to_provider: preflight.can_submit_to_provider,
    clips_pending: missingClips,
    model_cli_configured: modelCliConfigured,
    files: outputFiles.map((file) => ({ path: rel(file), ...sha256(file) })),
  }, null, 2));
}

main();
