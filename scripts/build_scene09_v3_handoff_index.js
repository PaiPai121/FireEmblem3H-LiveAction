#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const goalCompletionMatrixPath = path.join(packageDir, "goal_completion_matrix.json");
const clipStructuralAuditPath = path.join(packageDir, "generated_clip_structural_audit.json");
const actualDeliverySurfaceAuditPath = path.join(packageDir, "actual_delivery_surface_audit.json");
const executablePromptSemanticsAuditPath = path.join(packageDir, "executable_prompt_semantics_audit.json");
const audioTimingPromptContractPath = path.join(packageDir, "audio_timing_prompt_contract.json");
const characterBeatReadinessAuditPath = path.join(packageDir, "character_beat_readiness_audit.json");
const motionProbeClipStructuralAuditPath = path.join(packageDir, "motion_probe_clip_structural_audit.json");
const motionProbePackageAuditPath = path.join(packageDir, "motion_probe_package_audit.json");
const motionProbeProviderBundlesAuditPath = path.join(packageDir, "motion_probe_provider_bundles_audit.json");
const motionProbeSubmissionReadyGatePath = path.join(packageDir, "motion_probe_submission_ready_gate.json");
const motionProbeReturnIntakeAuditPath = path.join(packageDir, "motion_probe_return_intake_audit.json");
const motionProbeReturnRoundtripAuditPath = path.join(packageDir, "motion_probe_return_roundtrip_audit.json");
const motionProbeReviewPacketAuditPath = path.join(packageDir, "motion_probe_review_packet_audit.json");
const motionProbeReviewApplyGatePath = path.join(packageDir, "motion_probe_review_apply_gate.json");
const motionProbeReviewApplyPositiveContractPath = path.join(packageDir, "motion_probe_review_apply_positive_contract.json");
const fullDurationReleaseGatePath = path.join(packageDir, "full_duration_release_gate.json");
const currentStatusConsistencyGatePath = path.join(packageDir, "current_status_consistency_gate.json");
const providerPreflightConsistencyGatePath = path.join(packageDir, "provider_preflight_consistency_gate.json");
const submissionContractGatePath = path.join(packageDir, "submission_contract_gate.json");
const providerSubmissionFreshnessGatePath = path.join(packageDir, "provider_submission_freshness_gate.json");
const modelCliTemplateAuditPath = path.join(packageDir, "model_cli_template_audit.json");
const modelCliTemplatePositiveContractPath = path.join(packageDir, "model_cli_template_positive_contract.json");
const fullLocalVisualReviewPath = path.join(packageDir, "full_local_visual_review.json");
const criticalReauditPath = path.join(packageDir, "critical_reaudit_2026-08-12.json");
const motionSelfAuditPacketAuditPath = path.join(packageDir, "motion_self_audit_packet_audit.json");
const motionSelfAuditEvidenceContractPath = path.join(packageDir, "motion_self_audit_evidence_contract.json");
const motionSelfAuditUnsignedEvidenceRejectionPath = path.join(packageDir, "motion_self_audit_unsigned_evidence_rejection.json");
const motionSelfAuditApplyPositiveContractPath = path.join(packageDir, "motion_self_audit_apply_positive_contract.json");
const motionSelfAuditApplyGatePath = path.join(packageDir, "motion_self_audit_apply_gate.json");
const battleLedgerTimelinePath = path.join(packageDir, "battle_ledger_timeline.json");
const clipProvenanceGatePath = path.join(packageDir, "clip_provenance_gate.json");
const clipReturnRoundtripAuditPath = path.join(packageDir, "clip_return_roundtrip_audit.json");
const providerUploadBundlesAuditPath = path.join(packageDir, "provider_upload_bundles_audit.json");
const clipReturnIntakeAuditPath = path.join(packageDir, "clip_return_intake_audit.json");
const clipRevisionQueuePath = path.join(packageDir, "clip_revision_queue.json");
const providerIngestProvenanceContractPath = path.join(packageDir, "provider_ingest_provenance_contract.json");
const finalConcatInputsContractPath = path.join(packageDir, "final_concat_inputs_contract.json");
const finalConcatPositiveContractPath = path.join(packageDir, "final_concat_positive_contract.json");
const reportFreshnessGatePath = path.join(packageDir, "report_freshness_gate.json");
const positiveContractIsolationGatePath = path.join(packageDir, "positive_contract_isolation_gate.json");
const productionDeliveryTruthGatePath = path.join(packageDir, "production_delivery_truth_gate.json");
const proxyMisuseGatePath = path.join(packageDir, "proxy_misuse_gate.json");
const finalConcatGatePath = path.join(packageDir, "final_concat_gate.json");
const finalEditStructuralAuditPath = path.join(packageDir, "final_edit_structural_audit.json");
const videoGenerationRunCompletionAuditPath = path.join(packageDir, "video_generation_run_completion_audit.json");
const ep02WebMediaRefsAuditPath = path.join(packageDir, "ep02_web_media_refs_audit.json");
const ep02WebBattleEventPanelAuditPath = path.join(packageDir, "ep02_web_battle_event_panel_audit.json");
const webSubmissionPromptSurfaceAuditPath = path.join(packageDir, "web_submission_prompt_surface_audit.json");
const motionProbeOperatorTrackerPath = path.join(packageDir, "motion_probe_operator_tracker.json");
const motionProbeOperatorTrackerAuditPath = path.join(packageDir, "motion_probe_operator_tracker_audit.json");
const handoffControlReportsAuditPath = path.join(packageDir, "handoff_control_reports_audit.json");
const operatorNextStepsPath = path.join(packageDir, "OPERATOR_NEXT_STEPS.json");
const outHtmlPath = path.join(packageDir, "index.html");
const outManifestPath = path.join(packageDir, "package_index_manifest.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const scene09ChineseTitles = {
  Shot025: "规则与目标确立",
  Shot025A: "战场地形插入",
  Shot026: "贝雷特分配职责",
  Shot026B: "青狮观察战场",
  Shot026C: "第一轮推进",
  Shot027: "亚修架设掩护线",
  Shot027B: "黑鹫第一波压上",
  Shot027C: "首次接敌",
  Shot027D: "菲力克斯延迟侧切",
  Shot028: "支援线保持纪律",
  Shot028B: "黑鹫稳住中央",
  Shot028C: "菲力克斯看见后续路线",
  Shot029: "青狮西侧轮转",
  Shot029C: "库罗德读出两个缺口",
  Shot029D: "库罗德逼退亚修",
  Shot029B: "金鹿全面施压",
  Shot030: "菲力克斯过度前压的诱惑",
  Shot030B: "路线触发特写",
  Shot030C: "伊古纳兹与金鹿切断路线",
  Shot031: "贝雷特叫停菲力克斯",
  Shot031B: "贝雷特双线指挥",
  Shot032: "杜笃与梅尔塞德斯重建盾线",
  Shot032A: "雅妮特扬尘掩护",
  Shot032B: "青狮守住平台下方",
  Shot032C: "黑鹫反击金鹿",
  Shot032D: "三线战场关系证明",
  Shot032E: "贝雷特利用混战空隙",
  Shot032F: "菲力克斯与亚修判定休伯特出局",
  Shot032G: "库罗德与雷欧妮牵制多洛缇雅和贝尔娜提塔",
  Shot033: "帝弥托利在平台前克制收势",
  Shot033B: "贝雷特下令切向教师目标",
  Shot033C: "亚修压制汉尼曼路线",
  Shot033D: "英谷莉特切断玛努艾拉路线",
  Shot034C: "菲力克斯挡下斐迪南",
  Shot034D: "贝雷特中断教师目标反扑",
  Shot034B: "空教师目标裁定",
  Shot034E: "金鹿高光后收势",
  Shot034F: "黑鹫高光后收势",
  Shot034G: "青狮核心险胜收势",
  Shot034: "全场胜负关系落定",
  Shot035: "菲力克斯的敬意",
  Shot036: "帝弥托利战后余韵",
};

function chineseTitleForShot(shot) {
  return scene09ChineseTitles[shot] || shot;
}

function displayTitleForShot(shot) {
  const localized = chineseTitleForShot(shot);
  const shotNumber = String(shot || "").replace(/^Shot/, "");
  if (localized && localized !== shot) return `镜头${shotNumber}：${localized}`;
  return `镜头${shotNumber || shot}`;
}

function linkFromPackage(target) {
  if (!target) return "";
  if (target.startsWith("shots/")) return target;
  return path.relative(packageDir, path.join(root, target));
}

function metadataFor(shot) {
  const file = path.join(packageDir, shot.package_dir, "metadata.json");
  return fs.existsSync(file) ? readJson(file) : {};
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function roundtripScenarioSummary(report, strategy) {
  const scenario = (report.scenarios || []).find((item) => item.strategy === strategy) || {};
  const decision = scenario.decision || "missing";
  const matched = Number(scenario.unique_matched_shots || 0);
  const wouldCopy = Number(scenario.would_copy || 0);
  const unsupported = Number(scenario.unsupported_video_files || 0);
  const invalid = Number(scenario.invalid_video_files || 0);
  const problems = Array.isArray(scenario.problems) ? scenario.problems.length : Number(scenario.problems || 0);
  return `${strategy}: ${decision}, matched ${matched}, would copy ${wouldCopy}, unsupported ${unsupported}, invalid ${invalid}, problems ${problems}`;
}

function flattenGroups(groups) {
  return Object.entries(groups || {})
    .flatMap(([group, names]) => (Array.isArray(names) ? names.map((name) => `${group}: ${name}`) : []));
}

function flattenNames(groups) {
  return Object.values(groups || {}).flatMap((names) => (Array.isArray(names) ? names : []));
}

function changeList(changes) {
  return (Array.isArray(changes) ? changes : [])
    .map((item) => `${item.name || item}:${item.status || item.label || "changed"}`);
}

function shotCard(shot) {
  const metadata = metadataFor(shot);
  const ledger = metadata.battle_state_after?.battle_ledger_after || metadata.battle_ledger_after || {};
  const alive = flattenGroups(ledger.alive_by_house);
  const active = flattenGroups(ledger.still_active_or_controlling_objective_by_house);
  const removed = flattenGroups(ledger.mock_battle_defeated_or_removed_by_house);
  const captured = flattenGroups(ledger.captured_or_objective_defeated_by_house);
  const stoodDown = flattenGroups(ledger.stood_down_or_post_battle_by_house);
  const mustNotReturn = flattenGroups(ledger.must_not_return_active_by_house);
  const changed = changeList(ledger.changed_this_shot);
  const visible = asList(metadata.visible_named_only || shot.visible_named_only);
  const activeNames = new Set(flattenNames(ledger.still_active_or_controlling_objective_by_house));
  const visibleButNoActive = visible.filter((name) => name && !activeNames.has(name));
  const localDir = shot.package_dir;
  const expectedClip = linkFromPackage(metadata.expected_clip || shot.expected_clip);
  const sourceStart = linkFromPackage(metadata.start_frame || metadata.source_frames?.start_frame || shot.start_frame);
  const sourceKey = linkFromPackage(metadata.key_frame || metadata.source_frames?.key_frame || shot.key_frame);
  const sourceEnd = linkFromPackage(metadata.end_frame || metadata.source_frames?.end_frame || shot.end_frame);
  const rejectLines = asList(metadata.reject_if || shot.reject_if).slice(0, 8);
  const declaredTitle = shot.titleZh || shot.title || metadata.titleZh || metadata.title;
  const title = declaredTitle
    ? `镜头${String(shot.shot || "").replace(/^Shot/, "")}：${declaredTitle}`
    : displayTitleForShot(shot.shot);
  return `
    <article class="shot-card" id="${escapeHtml(shot.shot)}" data-shot="${escapeHtml(shot.shot)}">
      <header class="shot-head">
        <div>
          <p class="eyebrow">${String(shot.order).padStart(2, "0")} / ${escapeHtml(shot.status)}</p>
          <h2>${escapeHtml(title)} <span>${escapeHtml(shot.shot)} · ${escapeHtml(shot.id || "")}</span></h2>
        </div>
        <code class="clip-link">expected clip: ${escapeHtml(expectedClip)}</code>
      </header>
      <div class="frame-row">
        <a href="${escapeHtml(`${localDir}/start_frame.png`)}"><img src="${escapeHtml(`${localDir}/start_frame.png`)}" alt="${escapeHtml(`${shot.shot} start frame`)}"><span>start_frame.png</span></a>
        <a href="${escapeHtml(`${localDir}/key_frame.png`)}"><img src="${escapeHtml(`${localDir}/key_frame.png`)}" alt="${escapeHtml(`${shot.shot} key frame`)}"><span>key_frame.png</span></a>
        <a href="${escapeHtml(`${localDir}/end_frame.png`)}"><img src="${escapeHtml(`${localDir}/end_frame.png`)}" alt="${escapeHtml(`${shot.shot} end frame`)}"><span>end_frame.png</span></a>
      </div>
      <div class="shot-grid">
        <section>
          <h3>Submit Files</h3>
          <p><a href="${escapeHtml(`${localDir}/model_prompt.md`)}">model_prompt.md（提交用，只引用上传 START/KEY/END）</a></p>
          <p><a href="${escapeHtml(`${localDir}/negative_prompt.md`)}">negative_prompt.md</a></p>
          <p><a href="${escapeHtml(`${localDir}/metadata.json`)}">metadata.json</a></p>
          <p><a href="${escapeHtml(`${localDir}/prompt.md`)}">prompt.md（审计原稿，不粘贴到网页模型）</a></p>
        </section>
        <section>
          <h3>Visible Named Only</h3>
          <p>${escapeHtml(visible.length ? visible.join(", ") : "none")}</p>
          <h3>Visible But No Active Combat After</h3>
          <p>${escapeHtml(visibleButNoActive.length ? visibleButNoActive.join(", ") : "none")}</p>
          <h3>Primary Check</h3>
          <p>${escapeHtml(metadata.primary_check || shot.primary_check || "")}</p>
        </section>
        <section>
          <h3>Source Frames</h3>
          <p><a href="${escapeHtml(sourceStart)}">source start</a></p>
          <p><a href="${escapeHtml(sourceKey)}">source key</a></p>
          <p><a href="${escapeHtml(sourceEnd)}">source end</a></p>
        </section>
      </div>
      <div class="ledger-row">
        <section>
          <h3>Alive / Safe After</h3>
          <p>${escapeHtml(alive.length ? alive.join("; ") : "none")}</p>
        </section>
        <section>
          <h3>Active / Controlling After</h3>
          <p>${escapeHtml(active.length ? active.join("; ") : "none")}</p>
        </section>
        <section>
          <h3>Defeated / Removed After</h3>
          <p>${escapeHtml(removed.length ? removed.join("; ") : "none")}</p>
        </section>
      </div>
      <div class="ledger-row">
        <section>
          <h3>Captured / Objective-Defeated After</h3>
          <p>${escapeHtml(captured.length ? captured.join("; ") : "none")}</p>
        </section>
        <section>
          <h3>Stood Down / Post-Battle After</h3>
          <p>${escapeHtml(stoodDown.length ? stoodDown.join("; ") : "none")}</p>
        </section>
        <section>
          <h3>Must Not Return Active</h3>
          <p>${escapeHtml(mustNotReturn.length ? mustNotReturn.join("; ") : "none")}</p>
        </section>
      </div>
      <div class="ledger-row ledger-row-single">
        <section>
          <h3>Changed This Shot</h3>
          <p>${escapeHtml(changed.length ? changed.join("; ") : "none")}</p>
        </section>
      </div>
      <details>
        <summary>Reject If</summary>
        <ul>${rejectLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
      </details>
    </article>`;
}

function main() {
  if (!fs.existsSync(packageManifestPath)) throw new Error(`Missing package manifest: ${packageManifestPath}`);
  const manifest = readJson(packageManifestPath);
  const clipAudit = fs.existsSync(clipStructuralAuditPath)
    ? readJson(clipStructuralAuditPath)
    : {
        decision: "clips_pending",
        expected_clips: (manifest.shots || []).length,
        ready_clips: 0,
        missing_clips: (manifest.shots || []).length,
        failed_clips: 0,
      };
  const actualDeliverySurfaceAudit = fs.existsSync(actualDeliverySurfaceAuditPath)
    ? readJson(actualDeliverySurfaceAuditPath)
    : {
        decision: "actual_delivery_surface_not_run",
        problems: [],
        evidence: [],
      };
  const executablePromptSemanticsAudit = fs.existsSync(executablePromptSemanticsAuditPath)
    ? readJson(executablePromptSemanticsAuditPath)
    : {
        decision: "executable_prompt_semantics_not_run",
        shots_checked: 0,
        problems: [],
        warnings: [],
      };
  const audioTimingPromptContract = fs.existsSync(audioTimingPromptContractPath)
    ? readJson(audioTimingPromptContractPath)
    : {
        decision: "audio_timing_prompt_contract_not_run",
        shots_checked: 0,
        problems: [],
        warnings: [],
      };
  const motionProbePackageAudit = fs.existsSync(motionProbePackageAuditPath)
    ? readJson(motionProbePackageAuditPath)
    : {
        decision: "motion_probe_package_not_run",
        rows_checked: 0,
        expected_shots: 0,
        problems: [],
        warnings: [],
      };
  const motionProbeClipStructuralAudit = fs.existsSync(motionProbeClipStructuralAuditPath)
    ? readJson(motionProbeClipStructuralAuditPath)
    : {
        decision: "motion_probe_clip_structural_not_run",
        expected_probe_clips: 0,
        playable_probe_clips: 0,
        missing_probe_clips: 0,
        failed_probe_clips: 0,
        problems: [],
        warnings: [],
      };
  const motionProbeProviderBundlesAudit = fs.existsSync(motionProbeProviderBundlesAuditPath)
    ? readJson(motionProbeProviderBundlesAuditPath)
    : {
        decision: "motion_probe_provider_bundles_not_run",
        bundles_checked: 0,
        rows_checked: 0,
        problems: [],
        warnings: [],
      };
  const motionProbeSubmissionReadyGate = fs.existsSync(motionProbeSubmissionReadyGatePath)
    ? readJson(motionProbeSubmissionReadyGatePath)
    : {
        decision: "motion_probe_submission_ready_not_run",
        provider_zip_count: 0,
        bundled_probe_rows: 0,
        unique_probe_custom_ids: 0,
        return_batches: 0,
        problems: [],
        warnings: [],
      };
  const motionProbeReturnIntakeAudit = fs.existsSync(motionProbeReturnIntakeAuditPath)
    ? readJson(motionProbeReturnIntakeAuditPath)
    : {
        decision: "motion_probe_return_intake_not_run",
        batches_checked: 0,
        expected_probe_rows: 0,
        problems: [],
        warnings: [],
      };
  const motionProbeReturnRoundtripAudit = fs.existsSync(motionProbeReturnRoundtripAuditPath)
    ? readJson(motionProbeReturnRoundtripAuditPath)
    : {
        decision: "motion_probe_return_roundtrip_not_run",
        scenarios: [],
        problems: [],
      };
  const motionProbeReviewPacketAudit = fs.existsSync(motionProbeReviewPacketAuditPath)
    ? readJson(motionProbeReviewPacketAuditPath)
    : {
        decision: "motion_probe_review_packet_not_run",
        rows_checked: 0,
        expected_probe_clips: 0,
        playable_probe_clips: 0,
        review_frame_sets_ready: 0,
        full_duration_approvals: 0,
        problems: [],
      };
  const motionProbeReviewApplyGate = fs.existsSync(motionProbeReviewApplyGatePath)
    ? readJson(motionProbeReviewApplyGatePath)
    : {
        decision: "motion_probe_review_apply_gate_not_run",
        expected_probe_clips: 0,
        proposal_rows: 0,
        passed_rows: 0,
        blocked_or_rejected_rows: 0,
        problems: [],
        warnings: [],
      };
  const motionProbeReviewApplyPositiveContract = fs.existsSync(motionProbeReviewApplyPositiveContractPath)
    ? readJson(motionProbeReviewApplyPositiveContractPath)
    : {
        decision: "motion_probe_review_apply_positive_contract_not_run",
        expected_probe_clips: 0,
        positive: {},
        negative_cases: [],
        problems: [],
      };
  const fullDurationReleaseGate = fs.existsSync(fullDurationReleaseGatePath)
    ? readJson(fullDurationReleaseGatePath)
    : {
        decision: "full_duration_release_gate_not_run",
        can_release_full_duration: false,
        expected_probe_clips: 0,
        playable_probe_clips: 0,
        review_frame_sets_ready: 0,
        full_duration_approvals: 0,
        release: { exists: false },
        blocking_items: [],
        problems: [],
      };
  const currentStatusConsistencyGate = fs.existsSync(currentStatusConsistencyGatePath)
    ? readJson(currentStatusConsistencyGatePath)
    : {
        decision: "current_status_consistency_not_run",
        problems: [],
        warnings: [],
      };
  const providerPreflightConsistencyGate = fs.existsSync(providerPreflightConsistencyGatePath)
    ? readJson(providerPreflightConsistencyGatePath)
    : {
        decision: "provider_preflight_consistency_not_run",
        problems: [],
        warnings: [],
      };
  const modelCliAudit = fs.existsSync(modelCliTemplateAuditPath)
    ? readJson(modelCliTemplateAuditPath)
    : {
        decision: manifest.model_cli_configured ? "model_cli_template_not_run" : "model_cli_template_not_configured",
        configured: Boolean(manifest.model_cli_configured),
        can_execute_with_local_cli: false,
        problems: [],
        warnings: [],
      };
  const modelCliTemplatePositiveContract = fs.existsSync(modelCliTemplatePositiveContractPath)
    ? readJson(modelCliTemplatePositiveContractPath)
    : {
        decision: "model_cli_template_positive_contract_not_run",
        expected_shots: 0,
        cases_checked: 0,
        problems: [],
      };
  const submissionContractGate = fs.existsSync(submissionContractGatePath)
    ? readJson(submissionContractGatePath)
    : {
        decision: "submission_contract_gate_not_run",
        expected_shots: 0,
        rows_checked: 0,
        execution_plan_rows: 0,
        submission_queue_rows: 0,
        submission_payload_rows: 0,
        problems: [],
      };
  const battleLedgerTimeline = fs.existsSync(battleLedgerTimelinePath)
    ? readJson(battleLedgerTimelinePath)
    : {
        decision: "battle_ledger_timeline_not_run",
        shots: 0,
        problems: [],
      };
  const providerSubmissionFreshnessGate = fs.existsSync(providerSubmissionFreshnessGatePath)
    ? readJson(providerSubmissionFreshnessGatePath)
    : {
        decision: "provider_submission_freshness_not_run",
        expected_shots: 0,
        model_submission_batch_rows: 0,
        provider_bundle_rows: 0,
        problems: [],
        warnings: [],
      };
  const proxyMisuseGate = fs.existsSync(proxyMisuseGatePath)
    ? readJson(proxyMisuseGatePath)
    : {
        decision: "proxy_isolation_not_run",
        expected_clips_existing: 0,
        expected_clips_missing: (manifest.shots || []).length,
        problems: [],
        warnings: [],
      };
  const reportFreshnessGate = fs.existsSync(reportFreshnessGatePath)
    ? readJson(reportFreshnessGatePath)
    : {
        decision: "report_freshness_not_run",
        reports_checked: 0,
        problems: [],
        warnings: [],
      };
  const positiveContractIsolationGate = fs.existsSync(positiveContractIsolationGatePath)
    ? readJson(positiveContractIsolationGatePath)
    : {
        decision: "positive_contract_isolation_not_run",
        expected_shots: 0,
        production_expected_clips_existing: 0,
        production_final_output_exists: false,
        contracts_checked: 0,
        problems: [],
        warnings: [],
      };
  const productionDeliveryTruthGate = fs.existsSync(productionDeliveryTruthGatePath)
    ? readJson(productionDeliveryTruthGatePath)
    : {
        decision: "production_delivery_truth_gate_not_run",
        highest_truthful_target: "unknown",
        can_claim_video_generation_run: false,
        expected_shots: (manifest.shots || []).length,
        real_evidence: {
          expected_clip_files_existing: 0,
          final_output_exists: false,
        },
        blocking_items: [],
      };
  const motionSelfAuditPacketAudit = fs.existsSync(motionSelfAuditPacketAuditPath)
    ? readJson(motionSelfAuditPacketAuditPath)
    : {
        decision: "motion_self_audit_packet_not_run",
        rows_checked: 0,
        problems: [],
      };
  const motionSelfAuditEvidenceContract = fs.existsSync(motionSelfAuditEvidenceContractPath)
    ? readJson(motionSelfAuditEvidenceContractPath)
    : {
        decision: "motion_self_audit_evidence_contract_not_run",
        template_rows: 0,
        rows_with_review_frame_signature_keys: 0,
        problems: [],
        warnings: [],
      };
  const motionSelfAuditUnsignedEvidenceRejection = fs.existsSync(motionSelfAuditUnsignedEvidenceRejectionPath)
    ? readJson(motionSelfAuditUnsignedEvidenceRejectionPath)
    : {
        decision: "motion_self_audit_unsigned_evidence_rejection_not_run",
        expected_rows: 0,
        probe: {},
        problems: [],
        warnings: [],
      };
  const motionSelfAuditApplyGate = fs.existsSync(motionSelfAuditApplyGatePath)
    ? readJson(motionSelfAuditApplyGatePath)
    : {
        decision: "motion_self_audit_apply_gate_not_run",
        applied: false,
        proposal_rows: 0,
        summary: {},
        problems: [],
      };
  const motionSelfAuditApplyPositiveContract = fs.existsSync(motionSelfAuditApplyPositiveContractPath)
    ? readJson(motionSelfAuditApplyPositiveContractPath)
    : {
        decision: "motion_self_audit_apply_positive_contract_not_run",
        apply_gate: { battle_ledger_signature: {} },
        stale_battle_ledger_digest_rejection: {},
        problems: [],
      };
  const clipProvenanceGate = fs.existsSync(clipProvenanceGatePath)
    ? readJson(clipProvenanceGatePath)
    : {
        decision: "clip_provenance_gate_not_run",
        expected_clips: (manifest.shots || []).length,
        existing_clips: 0,
        missing_clips: (manifest.shots || []).length,
        provenance_rows: 0,
        problems: [],
      };
  const clipReturnRoundtripAudit = fs.existsSync(clipReturnRoundtripAuditPath)
    ? readJson(clipReturnRoundtripAuditPath)
    : {
        decision: "clip_return_roundtrip_not_run",
        scenarios: [],
        problems: [],
      };
  const providerUploadBundlesAudit = fs.existsSync(providerUploadBundlesAuditPath)
    ? readJson(providerUploadBundlesAuditPath)
    : {
        decision: "provider_upload_bundles_audit_not_run",
        bundles_checked: 0,
        rows_checked: 0,
        zip_contents_checked: 0,
        problems: [],
      };
  const clipReturnIntakeAudit = fs.existsSync(clipReturnIntakeAuditPath)
    ? readJson(clipReturnIntakeAuditPath)
    : {
        decision: "clip_return_intake_audit_not_run",
        batch_dirs_checked: 0,
        expected_clip_rows: 0,
        problems: [],
      };
  const clipRevisionQueue = fs.existsSync(clipRevisionQueuePath)
    ? readJson(clipRevisionQueuePath)
    : {
        decision: "clip_revision_queue_not_run",
        total_shots: 0,
        actionable_shots: 0,
        counts: {},
        problems: [],
      };
  const providerIngestProvenanceContract = fs.existsSync(providerIngestProvenanceContractPath)
    ? readJson(providerIngestProvenanceContractPath)
    : {
        decision: "provider_ingest_provenance_contract_not_run",
        positive: {},
        negative: {},
        problems: [],
      };
  const finalConcatInputsContract = fs.existsSync(finalConcatInputsContractPath)
    ? readJson(finalConcatInputsContractPath)
    : {
        decision: "final_concat_inputs_contract_not_run",
        rows_checked: 0,
        unique_expected_clips: 0,
        duration_sum_seconds: 0,
        problems: [],
      };
  const finalConcatPositiveContract = fs.existsSync(finalConcatPositiveContractPath)
    ? readJson(finalConcatPositiveContractPath)
    : {
        decision: "final_concat_positive_contract_not_run",
        tampered_input_contract_rejection: {},
        tampered_provenance_digest_rejection: {},
        problems: [],
      };
  const finalConcatGate = fs.existsSync(finalConcatGatePath)
    ? readJson(finalConcatGatePath)
    : {
        decision: "final_concat_blocked_clips_pending",
        passed_checks: 0,
        total_checks: 5,
        failed_checks: ["clip_structural_integrity"],
      };
  const finalEditAudit = fs.existsSync(finalEditStructuralAuditPath)
    ? readJson(finalEditStructuralAuditPath)
    : {
        decision: "final_edit_pending",
        final_edit: { exists: false, ok: false, issue: "final_edit_pending" },
      };
  const videoGenerationRunCompletion = fs.existsSync(videoGenerationRunCompletionAuditPath)
    ? readJson(videoGenerationRunCompletionAuditPath)
    : {
        decision: "video_generation_run_blocked_clips_pending",
        highest_completed_target: "prompt_asset_package",
        passed_checks: 1,
        total_checks: 8,
        failed_checks: ["all_expected_clips_structural_pass"],
      };
  const ep02WebMediaRefsAudit = fs.existsSync(ep02WebMediaRefsAuditPath)
    ? readJson(ep02WebMediaRefsAuditPath)
    : {
        decision: "ep02_web_media_refs_not_run",
        refs_checked: 0,
        images_checked: 0,
        documents_checked: 0,
        videos_checked: 0,
        missing_required_assets: 0,
        pending_video_outputs: 0,
      };
  const ep02WebBattleEventPanelAudit = fs.existsSync(ep02WebBattleEventPanelAuditPath)
    ? readJson(ep02WebBattleEventPanelAuditPath)
    : {
        decision: "ep02_web_battle_event_panel_not_run",
        scene09_shots: 0,
        shots_with_battle_ledger: 0,
        rendered_battle_event_panels: 0,
        problems: [],
      };
  const webSubmissionPromptSurfaceAudit = fs.existsSync(webSubmissionPromptSurfaceAuditPath)
    ? readJson(webSubmissionPromptSurfaceAuditPath)
    : {
        decision: "web_submission_prompt_surface_not_run",
        scene09_shots_checked: 0,
        rows_with_model_ready_prompt_links: 0,
        provider_prompt_contract_files_checked: 0,
        problems: [],
      };
  const motionProbeOperatorTracker = fs.existsSync(motionProbeOperatorTrackerPath)
    ? readJson(motionProbeOperatorTrackerPath)
    : {
        decision: "motion_probe_operator_tracker_not_run",
        batches: 0,
        expected_probe_rows: 0,
        returned_mp4_ready: 0,
        ingested_probe_ready: 0,
        problems: [],
      };
  const motionProbeOperatorTrackerAudit = fs.existsSync(motionProbeOperatorTrackerAuditPath)
    ? readJson(motionProbeOperatorTrackerAuditPath)
    : {
        decision: "motion_probe_operator_tracker_audit_not_run",
        batches_checked: 0,
        expected_probe_rows: 0,
        csv_rows: 0,
        html_links_checked: 0,
        problems: [],
        warnings: [],
      };
  const handoffControlReportsAudit = fs.existsSync(handoffControlReportsAuditPath)
    ? readJson(handoffControlReportsAuditPath)
    : {
        decision: "handoff_control_reports_audit_not_run",
        required_reports_checked: 0,
        declared_required_reports: 0,
        problems: [],
        warnings: [],
      };
  const fullLocalVisualReview = fs.existsSync(fullLocalVisualReviewPath)
    ? readJson(fullLocalVisualReviewPath)
    : {
        decision: "full_local_visual_review_not_run",
        integrity_summary: {
          shots_expected: (manifest.shots || []).length,
          shots_reviewed: 0,
          frames_expected: (manifest.shots || []).length * 3,
          frames_present: 0,
        },
        visual_audit_coverage: {
          monitor_required: [],
        },
        problems: [],
      };
  const criticalReaudit = fs.existsSync(criticalReauditPath)
    ? readJson(criticalReauditPath)
    : null;
  const operatorNextSteps = fs.existsSync(operatorNextStepsPath)
    ? readJson(operatorNextStepsPath)
    : {
        current_phase: "unknown",
        next_action: "unknown",
        blocking_items: [],
        counts: {},
      };
  const shots = [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const statusCounts = {};
  for (const shot of shots) statusCounts[shot.status || "missing"] = (statusCounts[shot.status || "missing"] || 0) + 1;
  const criticalCounts = criticalReaudit?.counts || {};
  const keyLocks = {
    Shot034B: shots.find((shot) => shot.shot === "Shot034B")?.visible_named_only || [],
    Shot034G: shots.find((shot) => shot.shot === "Shot034G")?.visible_named_only || [],
    Shot036: shots.find((shot) => shot.shot === "Shot036")?.visible_named_only || [],
  };
  const batchLinks = [
    ["model_submission_batches/index.html", "model_submission_batches/index.html"],
    ["OPERATOR_NEXT_STEPS.md", "OPERATOR_NEXT_STEPS.md"],
    ["OPERATOR_NEXT_STEPS.json", "OPERATOR_NEXT_STEPS.json"],
    ["goal_completion_matrix.md", "goal_completion_matrix.md"],
    ["goal_completion_matrix.json", "goal_completion_matrix.json"],
    ["model_submission_batches/batch_manifest.json", "batch_manifest.json"],
    ["model_submission_batches/expected_downloads.csv", "expected_downloads.csv"],
    ["model_target_profile.md", "model_target_profile.md"],
    ["operator_preflight_status.md", "operator_preflight_status.md"],
    ["actual_delivery_surface_audit.md", "actual_delivery_surface_audit.md"],
    ["actual_delivery_surface_audit.json", "actual_delivery_surface_audit.json"],
    ["executable_prompt_semantics_audit.md", "executable_prompt_semantics_audit.md"],
    ["executable_prompt_semantics_audit.json", "executable_prompt_semantics_audit.json"],
    ["audio_timing_prompt_contract.md", "audio_timing_prompt_contract.md"],
    ["audio_timing_prompt_contract.json", "audio_timing_prompt_contract.json"],
    ["character_beat_readiness_audit.md", "character_beat_readiness_audit.md"],
    ["character_beat_readiness_audit.json", "character_beat_readiness_audit.json"],
    ["per_frame_visual_review_matrix.html", "per_frame_visual_review_matrix.html"],
    ["motion_probe_clip_structural_audit.md", "motion_probe_clip_structural_audit.md"],
    ["motion_probe_clip_structural_audit.json", "motion_probe_clip_structural_audit.json"],
    ["motion_probe_package_audit.md", "motion_probe_package_audit.md"],
    ["motion_probe_package_audit.json", "motion_probe_package_audit.json"],
    ["motion_probe_submission/README.md", "motion_probe_submission/README.md"],
    ["motion_probe_submission/motion_probe_manifest.json", "motion_probe_manifest.json"],
    ["motion_probe_submission/motion_probe_payload.jsonl", "motion_probe_payload.jsonl"],
    ["motion_probe_submission/motion_probe_queue.csv", "motion_probe_queue.csv"],
    ["motion_probe_submission/motion_probe_qa_checklist.csv", "motion_probe_qa_checklist.csv"],
    ["motion_probe_submission_manifest.md", "motion_probe_submission_manifest.md"],
    ["motion_probe_submission_manifest.json", "motion_probe_submission_manifest.json"],
    ["motion_probe_submission_manifest.csv", "motion_probe_submission_manifest.csv"],
    ["motion_probe_upload_pack/README.md", "motion_probe_upload_pack/README.md"],
    ["motion_probe_upload_pack/upload_manifest.json", "motion_probe_upload_pack/upload_manifest.json"],
    ["motion_probe_upload_pack/upload_manifest.csv", "motion_probe_upload_pack/upload_manifest.csv"],
    ["motion_probe_upload_pack/RETURN_DIRECTORIES.md", "motion_probe_upload_pack/RETURN_DIRECTORIES.md"],
    ["motion_probe_upload_pack/SHA256SUMS.txt", "motion_probe_upload_pack/SHA256SUMS.txt"],
    ["motion_probe_provider_bundles_audit.md", "motion_probe_provider_bundles_audit.md"],
    ["motion_probe_provider_bundles_audit.json", "motion_probe_provider_bundles_audit.json"],
    ["motion_probe_submission_ready_gate.md", "motion_probe_submission_ready_gate.md"],
    ["motion_probe_submission_ready_gate.json", "motion_probe_submission_ready_gate.json"],
    ["motion_probe_provider_bundles/index.html", "motion_probe_provider_bundles/index.html"],
    ["motion_probe_provider_bundles/README.md", "motion_probe_provider_bundles/README.md"],
    ["motion_probe_provider_bundles/motion_probe_provider_bundles_manifest.json", "motion_probe_provider_bundles_manifest.json"],
    ["motion_probe_operator_tracker.html", "motion_probe_operator_tracker.html"],
    ["motion_probe_operator_tracker.json", "motion_probe_operator_tracker.json"],
    ["motion_probe_operator_tracker.csv", "motion_probe_operator_tracker.csv"],
    ["motion_probe_operator_tracker_audit.md", "motion_probe_operator_tracker_audit.md"],
    ["motion_probe_operator_tracker_audit.json", "motion_probe_operator_tracker_audit.json"],
    ["handoff_control_reports_audit.md", "handoff_control_reports_audit.md"],
    ["handoff_control_reports_audit.json", "handoff_control_reports_audit.json"],
    ["full_local_visual_review.md", "full_local_visual_review.md"],
    ["full_local_visual_review.json", "full_local_visual_review.json"],
    ["motion_probe_return_intake_audit.md", "motion_probe_return_intake_audit.md"],
    ["motion_probe_return_intake_audit.json", "motion_probe_return_intake_audit.json"],
    ["motion_probe_return_roundtrip_audit.md", "motion_probe_return_roundtrip_audit.md"],
    ["motion_probe_return_roundtrip_audit.json", "motion_probe_return_roundtrip_audit.json"],
    ["motion_probe_review_packet_audit.md", "motion_probe_review_packet_audit.md"],
    ["motion_probe_review_packet_audit.json", "motion_probe_review_packet_audit.json"],
    ["motion_probe_review_apply_gate.md", "motion_probe_review_apply_gate.md"],
    ["motion_probe_review_apply_gate.json", "motion_probe_review_apply_gate.json"],
    ["motion_probe_review_apply_positive_contract.md", "motion_probe_review_apply_positive_contract.md"],
    ["motion_probe_review_apply_positive_contract.json", "motion_probe_review_apply_positive_contract.json"],
    ["full_duration_release_gate.md", "full_duration_release_gate.md"],
    ["full_duration_release_gate.json", "full_duration_release_gate.json"],
    ["motion_probe_review/README.md", "motion_probe_review/README.md"],
    ["motion_probe_review/motion_probe_review_manifest.json", "motion_probe_review_manifest.json"],
    ["motion_probe_review/motion_probe_review_matrix.csv", "motion_probe_review_matrix.csv"],
    ["motion_probe_review/decision_update_template.jsonl", "motion_probe_review decision_update_template.jsonl"],
    ["motion_probe_return_intake/README.md", "motion_probe_return_intake/README.md"],
    ["motion_probe_return_intake/motion_probe_return_intake_manifest.json", "motion_probe_return_intake_manifest.json"],
    ["motion_probe_return_intake/expected_probe_map.csv", "expected_probe_map.csv"],
    ["current_status_consistency_gate.md", "current_status_consistency_gate.md"],
    ["current_status_consistency_gate.json", "current_status_consistency_gate.json"],
    ["provider_preflight_consistency_gate.md", "provider_preflight_consistency_gate.md"],
    ["provider_preflight_consistency_gate.json", "provider_preflight_consistency_gate.json"],
    ["submission_contract_gate.md", "submission_contract_gate.md"],
    ["submission_contract_gate.json", "submission_contract_gate.json"],
    ["provider_submission_freshness_gate.md", "provider_submission_freshness_gate.md"],
    ["provider_submission_freshness_gate.json", "provider_submission_freshness_gate.json"],
    ["model_cli_template_audit.md", "model_cli_template_audit.md"],
    ["model_cli_template_audit.json", "model_cli_template_audit.json"],
    ["model_cli_template_positive_contract.md", "model_cli_template_positive_contract.md"],
    ["model_cli_template_positive_contract.json", "model_cli_template_positive_contract.json"],
    ["report_freshness_gate.md", "report_freshness_gate.md"],
    ["report_freshness_gate.json", "report_freshness_gate.json"],
    ["provider_upload_bundles_audit.md", "provider_upload_bundles_audit.md"],
    ["provider_upload_bundles_audit.json", "provider_upload_bundles_audit.json"],
    ["clip_return_intake_audit.md", "clip_return_intake_audit.md"],
    ["clip_return_intake_audit.json", "clip_return_intake_audit.json"],
    ["clip_revision_queue.md", "clip_revision_queue.md"],
    ["clip_revision_queue.json", "clip_revision_queue.json"],
    ["clip_revision_queue.csv", "clip_revision_queue.csv"],
    ["provider_ingest_provenance_contract.md", "provider_ingest_provenance_contract.md"],
    ["provider_ingest_provenance_contract.json", "provider_ingest_provenance_contract.json"],
    ["final_concat_inputs_contract.md", "final_concat_inputs_contract.md"],
    ["final_concat_inputs_contract.json", "final_concat_inputs_contract.json"],
    ["positive_contract_isolation_gate.md", "positive_contract_isolation_gate.md"],
    ["positive_contract_isolation_gate.json", "positive_contract_isolation_gate.json"],
    ["production_delivery_truth_gate.md", "production_delivery_truth_gate.md"],
    ["production_delivery_truth_gate.json", "production_delivery_truth_gate.json"],
    ["proxy_misuse_gate.md", "proxy_misuse_gate.md"],
    ["proxy_misuse_gate.json", "proxy_misuse_gate.json"],
    ["final_concat_gate.md", "final_concat_gate.md"],
    ["final_concat_gate.json", "final_concat_gate.json"],
    ["final_edit_structural_audit.md", "final_edit_structural_audit.md"],
    ["final_edit_structural_audit.json", "final_edit_structural_audit.json"],
    ["video_generation_run_completion_audit.md", "video_generation_run_completion_audit.md"],
    ["video_generation_run_completion_audit.json", "video_generation_run_completion_audit.json"],
    ["ep02_web_media_refs_audit.md", "ep02_web_media_refs_audit.md"],
    ["ep02_web_media_refs_audit.json", "ep02_web_media_refs_audit.json"],
    ["ep02_web_battle_event_panel_audit.json", "ep02_web_battle_event_panel_audit.json"],
    ["web_submission_prompt_surface_audit.md", "web_submission_prompt_surface_audit.md"],
    ["web_submission_prompt_surface_audit.json", "web_submission_prompt_surface_audit.json"],
    ["completion_target_video_generation_run.md", "completion_target_video_generation_run.md"],
    ["completion_target_video_generation_run.json", "completion_target_video_generation_run.json"],
    ["provider_upload_manifest.json", "provider_upload_manifest.json"],
    ["submission_queue_with_battle_ledger.csv", "submission_queue_with_battle_ledger.csv"],
    ["battle_ledger_timeline.json", "battle_ledger_timeline.json"],
    ["high_risk_contact_sheet_ascii_2026-08-01.jpg", "high_risk_contact_sheet_ascii_2026-08-01.jpg"],
    ["high_risk_contact_sheet_ascii.md", "high_risk_contact_sheet_ascii.md"],
    ["high_risk_contact_sheet_ascii.json", "high_risk_contact_sheet_ascii.json"],
    ["frame_evidence_audit.md", "frame_evidence_audit.md"],
    ["frame_evidence_audit.csv", "frame_evidence_audit.csv"],
    ["frame_evidence_audit.json", "frame_evidence_audit.json"],
    ["generated_clip_structural_audit.md", "generated_clip_structural_audit.md"],
    ["generated_clip_structural_audit.json", "generated_clip_structural_audit.json"],
    ["narrative_hard_constraints_audit.md", "narrative_hard_constraints_audit.md"],
    ["narrative_hard_constraints_audit.json", "narrative_hard_constraints_audit.json"],
    ["provider_upload_bundles/README.md", "provider_upload_bundles/README.md"],
    ["provider_upload_bundles/RETURN_CONTRACT.md", "provider_upload_bundles/RETURN_CONTRACT.md"],
    ["provider_upload_bundles/provider_upload_bundles_manifest.json", "provider_upload_bundles_manifest.json"],
    ["clip_return_intake/README.md", "clip_return_intake/README.md"],
    ["clip_return_intake/clip_return_intake_manifest.json", "clip_return_intake_manifest.json"],
    ["clip_return_intake/expected_clip_map.csv", "expected_clip_map.csv"],
    ["after_clip_return_resume.md", "after_clip_return_resume.md"],
    ["after_clip_return_resume.json", "after_clip_return_resume.json"],
    ["clip_return_roundtrip_audit.md", "clip_return_roundtrip_audit.md"],
    ["clip_return_roundtrip_audit.json", "clip_return_roundtrip_audit.json"],
    ["clip_provenance_gate.md", "clip_provenance_gate.md"],
    ["clip_provenance_gate.json", "clip_provenance_gate.json"],
    ["motion_self_audit/README.md", "motion_self_audit/README.md"],
    ["motion_self_audit/motion_self_audit_matrix.csv", "motion_self_audit_matrix.csv"],
    ["motion_self_audit/motion_self_audit_manifest.json", "motion_self_audit_manifest.json"],
    ["motion_self_audit_packet_audit.md", "motion_self_audit_packet_audit.md"],
    ["motion_self_audit_packet_audit.json", "motion_self_audit_packet_audit.json"],
    ["motion_self_audit_evidence_contract.md", "motion_self_audit_evidence_contract.md"],
    ["motion_self_audit_evidence_contract.json", "motion_self_audit_evidence_contract.json"],
    ["motion_self_audit_unsigned_evidence_rejection.md", "motion_self_audit_unsigned_evidence_rejection.md"],
    ["motion_self_audit_unsigned_evidence_rejection.json", "motion_self_audit_unsigned_evidence_rejection.json"],
    ["motion_self_audit_apply_positive_contract.md", "motion_self_audit_apply_positive_contract.md"],
    ["motion_self_audit_apply_positive_contract.json", "motion_self_audit_apply_positive_contract.json"],
    ["motion_self_audit_apply_gate.md", "motion_self_audit_apply_gate.md"],
    ["motion_self_audit_apply_gate.json", "motion_self_audit_apply_gate.json"],
    ["after_clip_return_resume_positive_contract.md", "after_clip_return_resume_positive_contract.md"],
    ["after_clip_return_resume_positive_contract.json", "after_clip_return_resume_positive_contract.json"],
    ["final_concat_positive_contract.md", "final_concat_positive_contract.md"],
    ["final_concat_positive_contract.json", "final_concat_positive_contract.json"],
    ["final_edit_positive_contract.md", "final_edit_positive_contract.md"],
    ["final_edit_positive_contract.json", "final_edit_positive_contract.json"],
    ["video_generation_run_positive_contract.md", "video_generation_run_positive_contract.md"],
    ["video_generation_run_positive_contract.json", "video_generation_run_positive_contract.json"],
  ].filter(([target]) => fs.existsSync(path.join(packageDir, target)));
  const statusFile = fs.existsSync(path.join(packageDir, "CURRENT_STATUS_2026-08-01.md"))
    ? "CURRENT_STATUS_2026-08-01.md"
    : fs.existsSync(path.join(packageDir, "CURRENT_STATUS_2026-07-31.md"))
    ? "CURRENT_STATUS_2026-07-31.md"
    : "CURRENT_STATUS_2026-07-30.md";
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EP02 Scene09 V3 Monitor Handoff Package</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #1b1d22;
      --muted: #5f6673;
      --line: #d9dde5;
      --paper: #f8f9fb;
      --panel: #ffffff;
      --blue: #215fad;
      --red: #a13a3a;
      --green: #35704a;
      --gold: #8a681a;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--ink);
      background: var(--paper);
    }
    header.package-head {
      position: sticky;
      top: 0;
      z-index: 2;
      border-bottom: 1px solid var(--line);
      background: rgba(248, 249, 251, 0.96);
      backdrop-filter: blur(10px);
    }
    .head-inner, main { max-width: 1440px; margin: 0 auto; padding: 18px 22px; }
    h1 { margin: 0 0 8px; font-size: 24px; letter-spacing: 0; }
    h2 { margin: 0; font-size: 18px; letter-spacing: 0; }
    h2 span { display: block; margin-top: 2px; font-size: 12px; color: var(--muted); font-weight: 500; }
    h3 { margin: 0 0 6px; font-size: 12px; text-transform: uppercase; color: var(--muted); letter-spacing: 0; }
    p { margin: 0 0 6px; }
    a { color: var(--blue); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .summary {
      display: grid;
      grid-template-columns: repeat(5, minmax(130px, 1fr));
      gap: 10px;
      margin-top: 12px;
    }
    .metric {
      border: 1px solid var(--line);
      background: var(--panel);
      padding: 10px;
      border-radius: 6px;
      min-height: 74px;
    }
    .metric strong { display: block; font-size: 18px; }
    .metric span { color: var(--muted); font-size: 12px; }
    .links { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px; }
    .quick-links a, .doc-links a {
      display: inline-flex;
      align-items: center;
      min-height: 30px;
      padding: 4px 8px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--panel);
    }
    .status-line {
      margin-top: 10px;
      color: var(--muted);
    }
    .audit-details {
      margin-top: 10px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--panel);
      padding: 8px 10px;
      max-height: 42vh;
      overflow: auto;
    }
    .audit-details summary {
      color: var(--blue);
    }
    .shot-card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      margin: 18px 0;
      overflow: hidden;
    }
    .shot-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--line);
    }
    .eyebrow { margin: 0 0 4px; color: var(--muted); font-size: 12px; }
    .clip-link { white-space: nowrap; }
    .frame-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: var(--line);
    }
    .frame-row a {
      display: grid;
      grid-template-rows: minmax(150px, 18vw) auto;
      background: #11151c;
      color: white;
      text-decoration: none;
    }
    .frame-row img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .frame-row span {
      padding: 8px 10px;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.55);
    }
    .shot-grid, .ledger-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      border-top: 1px solid var(--line);
      background: var(--line);
    }
    .shot-grid section, .ledger-row section {
      background: var(--panel);
      padding: 12px 14px;
      min-width: 0;
    }
    .ledger-row-single { grid-template-columns: 1fr; }
    details {
      border-top: 1px solid var(--line);
      padding: 10px 14px 12px;
    }
    summary { cursor: pointer; color: var(--red); font-weight: 650; }
    ul { margin: 8px 0 0; padding-left: 20px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    @media (max-width: 860px) {
      .summary, .frame-row, .shot-grid, .ledger-row { grid-template-columns: 1fr; }
      .shot-head { align-items: flex-start; flex-direction: column; }
      .frame-row a { grid-template-rows: minmax(180px, 56vw) auto; }
    }
  </style>
</head>
<body>
  <header class="package-head">
    <div class="head-inner">
      <h1>EP02 Scene09 V3 Monitor Handoff Package</h1>
      <p>${criticalReaudit ? "File-access review index for the current Scene09 frames. Status: critical_reaudit_blocked_needs_revision. Do not submit the full scene to video generation until blocked shots are rewritten, regenerated, and re-audited." : "File-access package index for direct image-to-video submission. Status: monitor_handoff_ready_clips_pending. Real clips remain pending until an external video model writes the expected .mp4 files."}</p>
      <div class="summary">
        <div class="metric"><strong>${shots.length}</strong><span>shots packaged</span></div>
        <div class="metric"><strong>${escapeHtml(criticalCounts.blocked_needs_revision || statusCounts.blocked_needs_revision || 0)}</strong><span>blocked_needs_revision</span></div>
        <div class="metric"><strong>${escapeHtml(criticalCounts.layout_reference || statusCounts.layout_reference || 0)}</strong><span>layout_reference_only</span></div>
        <div class="metric"><strong>${escapeHtml(criticalCounts.monitor_required || statusCounts.monitor_required || 0)}</strong><span>monitor_required</span></div>
        <div class="metric"><strong>${escapeHtml(manifest.total_duration_seconds || "")}s</strong><span>planned duration</span></div>
      </div>
      <p class="status-line">${criticalReaudit ? "当前用于重审的是 42 个镜头卡片和 126 张三帧资产；17 个镜头已阻断重做，4 个只作布局参考，不能直接投视频。" : "当前用于观看的是 42 个镜头卡片和 126 张三帧资产；详细 QA 和全部文档链接已折叠，避免挡住分镜。"}</p>
      <div class="links quick-links">
        <a href="#Shot025">开始看镜头025</a>
        <a href="#Shot032">杜笃 / 梅尔塞德斯治疗镜头</a>
        <a href="#Shot034B">教师目标裁定</a>
        <a href="#Shot036">结尾镜头036</a>
        ${criticalReaudit ? `<a href="critical_reaudit_2026-08-12.md">critical_reaudit_2026-08-12.md</a>` : ""}
        <a href="RUNBOOK.md">RUNBOOK.md</a>
        <a href="${escapeHtml(statusFile)}">${escapeHtml(statusFile)}</a>
        <a href="submission_queue.csv">submission_queue.csv</a>
        <a href="package_manifest.json">package_manifest.json</a>
      </div>
      <details class="audit-details">
        <summary>详细 QA 状态（默认折叠）</summary>
      ${criticalReaudit ? `<p>Critical visual re-audit: ${escapeHtml(criticalReaudit.decision || "unknown")} · blocked ${escapeHtml(criticalReaudit.visual_audit_coverage?.existing_shots_failed?.length || 0)} · layout ${escapeHtml(criticalReaudit.visual_audit_coverage?.layout_reference_only?.length || 0)} · monitor ${escapeHtml(criticalReaudit.visual_audit_coverage?.monitor_required?.length || 0)} · report <a href="critical_reaudit_2026-08-12.md">critical_reaudit_2026-08-12.md</a></p>` : ""}
      <p>Clip structural QA: ${escapeHtml(clipAudit.decision || "unknown")} · missing ${escapeHtml(clipAudit.missing_clips || 0)} · failed ${escapeHtml(clipAudit.failed_clips || 0)}</p>
      <p>Actual delivery surface audit: ${escapeHtml(actualDeliverySurfaceAudit.decision || "unknown")} · problems ${escapeHtml((actualDeliverySurfaceAudit.problems || []).length)}</p>
      <p>Executable prompt semantics: ${escapeHtml(executablePromptSemanticsAudit.decision || "unknown")} · shots ${escapeHtml(executablePromptSemanticsAudit.shots_checked || 0)} · problems ${escapeHtml((executablePromptSemanticsAudit.problems || []).length)}</p>
      <p>Audio timing prompt contract: ${escapeHtml(audioTimingPromptContract.decision || "unknown")} · shots ${escapeHtml(audioTimingPromptContract.shots_checked || 0)} · problems ${escapeHtml((audioTimingPromptContract.problems || []).length)} · warnings ${escapeHtml((audioTimingPromptContract.warnings || []).length)}</p>
      <p>Motion probe clip structural audit: ${escapeHtml(motionProbeClipStructuralAudit.decision || "unknown")} · playable ${escapeHtml(motionProbeClipStructuralAudit.playable_probe_clips || 0)}/${escapeHtml(motionProbeClipStructuralAudit.expected_probe_clips || shots.length)} · missing ${escapeHtml(motionProbeClipStructuralAudit.missing_probe_clips || 0)} · failed ${escapeHtml(motionProbeClipStructuralAudit.failed_probe_clips || 0)}</p>
      <p>Motion probe package: ${escapeHtml(motionProbePackageAudit.decision || "unknown")} · rows ${escapeHtml(motionProbePackageAudit.rows_checked || 0)}/${escapeHtml(motionProbePackageAudit.expected_shots || shots.length)} · problems ${escapeHtml((motionProbePackageAudit.problems || []).length)} · warnings ${escapeHtml((motionProbePackageAudit.warnings || []).length)}</p>
      <p>Motion probe provider bundles: ${escapeHtml(motionProbeProviderBundlesAudit.decision || "unknown")} · bundles ${escapeHtml(motionProbeProviderBundlesAudit.bundles_checked || 0)} · rows ${escapeHtml(motionProbeProviderBundlesAudit.rows_checked || 0)} · problems ${escapeHtml((motionProbeProviderBundlesAudit.problems || []).length)} · warnings ${escapeHtml((motionProbeProviderBundlesAudit.warnings || []).length)}</p>
      <p>Motion probe submission ready gate: ${escapeHtml(motionProbeSubmissionReadyGate.decision || "unknown")} · zips ${escapeHtml(motionProbeSubmissionReadyGate.provider_zip_count || 0)}/7 · rows ${escapeHtml(motionProbeSubmissionReadyGate.bundled_probe_rows || 0)}/${escapeHtml(shots.length)} · unique IDs ${escapeHtml(motionProbeSubmissionReadyGate.unique_probe_custom_ids || 0)}/${escapeHtml(shots.length)} · return batches ${escapeHtml(motionProbeSubmissionReadyGate.return_batches || 0)}/7 · problems ${escapeHtml((motionProbeSubmissionReadyGate.problems || []).length)}</p>
      <p>Motion probe operator tracker: ${escapeHtml(motionProbeOperatorTracker.decision || "unknown")} · batches ${escapeHtml(motionProbeOperatorTracker.batches || 0)} · rows ${escapeHtml(motionProbeOperatorTracker.expected_probe_rows || 0)} · returned ${escapeHtml(motionProbeOperatorTracker.returned_mp4_ready || 0)}/42 · ingested ${escapeHtml(motionProbeOperatorTracker.ingested_probe_ready || 0)}/42 · problems ${escapeHtml((motionProbeOperatorTracker.problems || []).length)}</p>
      <p>Motion probe operator tracker audit: ${escapeHtml(motionProbeOperatorTrackerAudit.decision || "unknown")} · batches ${escapeHtml(motionProbeOperatorTrackerAudit.batches_checked || 0)} · rows ${escapeHtml(motionProbeOperatorTrackerAudit.expected_probe_rows || 0)} · csv ${escapeHtml(motionProbeOperatorTrackerAudit.csv_rows || 0)} · html links ${escapeHtml(motionProbeOperatorTrackerAudit.html_links_checked || 0)} · problems ${escapeHtml((motionProbeOperatorTrackerAudit.problems || []).length)} · warnings ${escapeHtml((motionProbeOperatorTrackerAudit.warnings || []).length)}</p>
      <p>Handoff control reports audit: ${escapeHtml(handoffControlReportsAudit.decision || "unknown")} · checked ${escapeHtml(handoffControlReportsAudit.required_reports_checked || 0)} · declared ${escapeHtml(handoffControlReportsAudit.declared_required_reports || 0)} · problems ${escapeHtml((handoffControlReportsAudit.problems || []).length)} · warnings ${escapeHtml((handoffControlReportsAudit.warnings || []).length)}</p>
      <p>Full local visual review: ${escapeHtml(fullLocalVisualReview.decision || "unknown")} · shots ${escapeHtml(fullLocalVisualReview.integrity_summary?.shots_reviewed || 0)}/${escapeHtml(fullLocalVisualReview.integrity_summary?.shots_expected || shots.length)} · frames ${escapeHtml(fullLocalVisualReview.integrity_summary?.frames_present || 0)}/${escapeHtml(fullLocalVisualReview.integrity_summary?.frames_expected || shots.length * 3)} · monitor ${escapeHtml(fullLocalVisualReview.visual_audit_coverage?.monitor_required?.length || 0)}/${escapeHtml(shots.length)} · problems ${escapeHtml((fullLocalVisualReview.problems || []).length)}</p>
      <p>Motion probe return intake: ${escapeHtml(motionProbeReturnIntakeAudit.decision || "unknown")} · batches ${escapeHtml(motionProbeReturnIntakeAudit.batches_checked || 0)} · expected probes ${escapeHtml(motionProbeReturnIntakeAudit.expected_probe_rows || 0)} · problems ${escapeHtml((motionProbeReturnIntakeAudit.problems || []).length)} · warnings ${escapeHtml((motionProbeReturnIntakeAudit.warnings || []).length)}</p>
      <p>Motion probe return roundtrip: ${escapeHtml(motionProbeReturnRoundtripAudit.decision || "unknown")} · scenarios ${escapeHtml((motionProbeReturnRoundtripAudit.scenarios || []).length)} · problems ${escapeHtml((motionProbeReturnRoundtripAudit.problems || []).length)}</p>
      <p>Motion probe review packet: ${escapeHtml(motionProbeReviewPacketAudit.decision || "unknown")} · rows ${escapeHtml(motionProbeReviewPacketAudit.rows_checked || 0)}/${escapeHtml(motionProbeReviewPacketAudit.expected_probe_clips || shots.length)} · playable ${escapeHtml(motionProbeReviewPacketAudit.playable_probe_clips || 0)} · review frames ${escapeHtml(motionProbeReviewPacketAudit.review_frame_sets_ready || 0)} · full-duration approvals ${escapeHtml(motionProbeReviewPacketAudit.full_duration_approvals || 0)}</p>
      <p>Motion probe review apply gate: ${escapeHtml(motionProbeReviewApplyGate.decision || "unknown")} · proposal rows ${escapeHtml(motionProbeReviewApplyGate.proposal_rows || 0)}/${escapeHtml(motionProbeReviewApplyGate.expected_probe_clips || shots.length)} · passed ${escapeHtml(motionProbeReviewApplyGate.passed_rows || 0)} · blocked/rejected ${escapeHtml(motionProbeReviewApplyGate.blocked_or_rejected_rows || 0)} · problems ${escapeHtml((motionProbeReviewApplyGate.problems || []).length)}</p>
      <p>Motion probe apply positive contract: ${escapeHtml(motionProbeReviewApplyPositiveContract.decision || "unknown")} · temp positive ${escapeHtml(motionProbeReviewApplyPositiveContract.positive?.passed_rows || 0)}/${escapeHtml(motionProbeReviewApplyPositiveContract.expected_probe_clips || shots.length)} · negative rejects ${escapeHtml((motionProbeReviewApplyPositiveContract.negative_cases || []).filter((item) => item.rejected).length)}/${escapeHtml((motionProbeReviewApplyPositiveContract.negative_cases || []).length)} · production release ${escapeHtml(motionProbeReviewApplyPositiveContract.production_safety?.source_package_probe_release_exists ? "present" : "absent")}</p>
      <p>Full-duration release gate: ${escapeHtml(fullDurationReleaseGate.decision || "unknown")} · can release ${escapeHtml(fullDurationReleaseGate.can_release_full_duration ? "yes" : "no")} · playable probes ${escapeHtml(fullDurationReleaseGate.playable_probe_clips || 0)}/${escapeHtml(fullDurationReleaseGate.expected_probe_clips || shots.length)} · review frames ${escapeHtml(fullDurationReleaseGate.review_frame_sets_ready || 0)} · release ${escapeHtml(fullDurationReleaseGate.release?.exists ? "present" : "absent")} · blockers ${escapeHtml((fullDurationReleaseGate.blocking_items || []).length)} · problems ${escapeHtml((fullDurationReleaseGate.problems || []).length)}</p>
      <p>Current status consistency gate: ${escapeHtml(currentStatusConsistencyGate.decision || "unknown")} · problems ${escapeHtml((currentStatusConsistencyGate.problems || []).length)} · warnings ${escapeHtml((currentStatusConsistencyGate.warnings || []).length)}</p>
      <p>Provider preflight consistency gate: ${escapeHtml(providerPreflightConsistencyGate.decision || "unknown")} · can submit ${escapeHtml(providerPreflightConsistencyGate.can_submit_to_provider ? "yes" : "no")} · problems ${escapeHtml((providerPreflightConsistencyGate.problems || []).length)}</p>
      <p>Model CLI template QA: ${escapeHtml(modelCliAudit.decision || "unknown")} · configured ${escapeHtml(modelCliAudit.configured ? "yes" : "no")} · problems ${escapeHtml((modelCliAudit.problems || []).length)}</p>
      <p>Submission contract gate: ${escapeHtml(submissionContractGate.decision || "unknown")} · rows ${escapeHtml(submissionContractGate.rows_checked || 0)}/${escapeHtml(submissionContractGate.expected_shots || shots.length)} · plan ${escapeHtml(submissionContractGate.execution_plan_rows || 0)} · queue ${escapeHtml(submissionContractGate.submission_queue_rows || 0)} · payload ${escapeHtml(submissionContractGate.submission_payload_rows || 0)} · ledger digest ${escapeHtml(submissionContractGate.submission_battle_ledger_rows_digest_sha256 ? "present" : "missing")} · problems ${escapeHtml((submissionContractGate.problems || []).length)}</p>
      <p>Provider submission freshness gate: ${escapeHtml(providerSubmissionFreshnessGate.decision || "unknown")} · batch rows ${escapeHtml(providerSubmissionFreshnessGate.model_submission_batch_rows || 0)}/${escapeHtml(providerSubmissionFreshnessGate.expected_shots || shots.length)} · provider rows ${escapeHtml(providerSubmissionFreshnessGate.provider_bundle_rows || 0)}/${escapeHtml(providerSubmissionFreshnessGate.expected_shots || shots.length)} · problems ${escapeHtml((providerSubmissionFreshnessGate.problems || []).length)}</p>
      <p>Model CLI template positive contract: ${escapeHtml(modelCliTemplatePositiveContract.decision || "unknown")} · cases ${escapeHtml(modelCliTemplatePositiveContract.cases_checked || 0)} · problems ${escapeHtml((modelCliTemplatePositiveContract.problems || []).length)}</p>
      <p>Clip return roundtrip: ${escapeHtml(clipReturnRoundtripAudit.decision || "unknown")} · ${escapeHtml(roundtripScenarioSummary(clipReturnRoundtripAudit, "expected_filename"))} · ${escapeHtml(roundtripScenarioSummary(clipReturnRoundtripAudit, "custom_id_prefix"))} · ${escapeHtml(roundtripScenarioSummary(clipReturnRoundtripAudit, "nested_intake_root_expected_filenames"))} · ${escapeHtml(roundtripScenarioSummary(clipReturnRoundtripAudit, "loose_shot_name_rejected"))} · ${escapeHtml(roundtripScenarioSummary(clipReturnRoundtripAudit, "invalid_mp4_rejected"))} · ${escapeHtml(roundtripScenarioSummary(clipReturnRoundtripAudit, "unsupported_format_rejected"))}</p>
      <p>Provider upload bundles audit: ${escapeHtml(providerUploadBundlesAudit.decision || "unknown")} · bundles ${escapeHtml(providerUploadBundlesAudit.bundles_checked || 0)} · rows ${escapeHtml(providerUploadBundlesAudit.rows_checked || 0)} · zip contents ${escapeHtml(providerUploadBundlesAudit.zip_contents_checked || 0)} · problems ${escapeHtml((providerUploadBundlesAudit.problems || []).length)}</p>
      <p>Clip return intake audit: ${escapeHtml(clipReturnIntakeAudit.decision || "unknown")} · batches ${escapeHtml(clipReturnIntakeAudit.batch_dirs_checked || 0)} · expected rows ${escapeHtml(clipReturnIntakeAudit.expected_clip_rows || 0)} · problems ${escapeHtml((clipReturnIntakeAudit.problems || []).length)}</p>
      <p>Clip revision queue: ${escapeHtml(clipRevisionQueue.decision || "unknown")} · total ${escapeHtml(clipRevisionQueue.total_shots || 0)} · actionable ${escapeHtml(clipRevisionQueue.actionable_shots || 0)} · generation pending ${escapeHtml(clipRevisionQueue.counts?.generation_pending || 0)}</p>
      <p>Provider-ingest provenance contract: ${escapeHtml(providerIngestProvenanceContract.decision || "unknown")} · positive gate ${escapeHtml(providerIngestProvenanceContract.positive?.gate?.ok ? "passed" : "not passed")} · missing source_sha256 rejected ${escapeHtml(providerIngestProvenanceContract.negative?.rejected ? "yes" : "no")} · problems ${escapeHtml((providerIngestProvenanceContract.problems || []).length)}</p>
      <p>Final concat inputs contract: ${escapeHtml(finalConcatInputsContract.decision || "unknown")} · rows ${escapeHtml(finalConcatInputsContract.rows_checked || 0)} · unique clips ${escapeHtml(finalConcatInputsContract.unique_expected_clips || 0)} · duration ${escapeHtml(finalConcatInputsContract.duration_sum_seconds || 0)}s · problems ${escapeHtml((finalConcatInputsContract.problems || []).length)}</p>
      <p>Final concat positive contract: ${escapeHtml(finalConcatPositiveContract.decision || "unknown")} · tampered input rejected ${escapeHtml(finalConcatPositiveContract.tampered_input_contract_rejection?.rejected ? "yes" : "no")} · stale provenance digest rejected ${escapeHtml(finalConcatPositiveContract.tampered_provenance_digest_rejection?.rejected ? "yes" : "no")} · problems ${escapeHtml((finalConcatPositiveContract.problems || []).length)}</p>
      <p>Motion self-audit packet: ${escapeHtml(motionSelfAuditPacketAudit.decision || "unknown")} · rows ${escapeHtml(motionSelfAuditPacketAudit.rows_checked || 0)} · problems ${escapeHtml((motionSelfAuditPacketAudit.problems || []).length)}</p>
      <p>Motion self-audit evidence contract: ${escapeHtml(motionSelfAuditEvidenceContract.decision || "unknown")} · template rows ${escapeHtml(motionSelfAuditEvidenceContract.template_rows || 0)} · frame-signature rows ${escapeHtml(motionSelfAuditEvidenceContract.rows_with_review_frame_signature_keys || 0)} · problems ${escapeHtml((motionSelfAuditEvidenceContract.problems || []).length)}</p>
      <p>Motion unsigned-evidence rejection: ${escapeHtml(motionSelfAuditUnsignedEvidenceRejection.decision || "unknown")} · frame rejects ${escapeHtml(motionSelfAuditUnsignedEvidenceRejection.probe?.frame_signature_rejections || 0)} · clip rejects ${escapeHtml(motionSelfAuditUnsignedEvidenceRejection.probe?.clip_signature_rejections || 0)} · problems ${escapeHtml((motionSelfAuditUnsignedEvidenceRejection.problems || []).length)}</p>
      <p>Battle ledger timeline: ${escapeHtml(battleLedgerTimeline.decision || "unknown")} · rows ${escapeHtml(battleLedgerTimeline.shots || 0)} · ledger digest ${escapeHtml(battleLedgerTimeline.rows_digest_sha256 ? "present" : "missing")} · active-return state digest ${escapeHtml(battleLedgerTimeline.state_machine_rows_digest_sha256 ? "present" : "missing")} · problems ${escapeHtml((battleLedgerTimeline.problems || []).length)}</p>
      <p>Motion self-audit positive apply contract: ${escapeHtml(motionSelfAuditApplyPositiveContract.decision || "motion_self_audit_apply_positive_contract")} · battle ledger digest ${escapeHtml(motionSelfAuditApplyPositiveContract.apply_gate?.battle_ledger_signature?.rows_digest_ok ? "ok" : "missing/stale")} · active-return state ${escapeHtml(motionSelfAuditApplyPositiveContract.apply_gate?.battle_ledger_signature?.state_machine_rows_digest_ok ? "ok" : "missing/stale")} · stale ledger rejected ${escapeHtml(motionSelfAuditApplyPositiveContract.stale_battle_ledger_digest_rejection?.rejected ? "yes" : "no")} · stale active-return rejected ${escapeHtml(motionSelfAuditApplyPositiveContract.stale_active_return_state_machine_digest_rejection?.rejected ? "yes" : "no")}</p>
      <p>Motion self-audit apply gate: ${escapeHtml(motionSelfAuditApplyGate.decision || "unknown")} · applied ${escapeHtml(motionSelfAuditApplyGate.applied ? "yes" : "no")} · proposal rows ${escapeHtml(motionSelfAuditApplyGate.proposal_rows || 0)} · problems ${escapeHtml((motionSelfAuditApplyGate.problems || []).length)}</p>
      <p>Clip provenance gate: ${escapeHtml(clipProvenanceGate.decision || "unknown")} · existing ${escapeHtml(clipProvenanceGate.existing_clips || 0)}/${escapeHtml(clipProvenanceGate.expected_clips || shots.length)} · provenance rows ${escapeHtml(clipProvenanceGate.provenance_rows || 0)} · problems ${escapeHtml((clipProvenanceGate.problems || []).length)}</p>
      <p>Report freshness gate: ${escapeHtml(reportFreshnessGate.decision || "unknown")} · reports ${escapeHtml(reportFreshnessGate.reports_checked || 0)} · problems ${escapeHtml((reportFreshnessGate.problems || []).length)} · warnings ${escapeHtml((reportFreshnessGate.warnings || []).length)}</p>
      <p>Positive contract isolation gate: ${escapeHtml(positiveContractIsolationGate.decision || "unknown")} · contracts ${escapeHtml(positiveContractIsolationGate.contracts_checked || 0)}/${escapeHtml(positiveContractIsolationGate.contracts_checked || 0)} · production clips ${escapeHtml(positiveContractIsolationGate.production_expected_clips_existing || 0)}/${escapeHtml(positiveContractIsolationGate.expected_shots || shots.length)} · production final ${escapeHtml(positiveContractIsolationGate.production_final_output_exists ? "exists" : "absent")} · problems ${escapeHtml((positiveContractIsolationGate.problems || []).length)}</p>
      <p>Production delivery truth gate: ${escapeHtml(productionDeliveryTruthGate.decision || "unknown")} · truthful target ${escapeHtml(productionDeliveryTruthGate.highest_truthful_target || "unknown")} · can claim run ${escapeHtml(productionDeliveryTruthGate.can_claim_video_generation_run ? "yes" : "no")} · real clips ${escapeHtml(productionDeliveryTruthGate.real_evidence?.expected_clip_files_existing || 0)}/${escapeHtml(productionDeliveryTruthGate.expected_shots || shots.length)} · final ${escapeHtml(productionDeliveryTruthGate.real_evidence?.final_output_exists ? "exists" : "absent")} · blockers ${escapeHtml((productionDeliveryTruthGate.blocking_items || []).length)}</p>
      <p>Proxy misuse gate: ${escapeHtml(proxyMisuseGate.decision || "unknown")} · expected clips existing ${escapeHtml(proxyMisuseGate.expected_clips_existing || 0)} · problems ${escapeHtml((proxyMisuseGate.problems || []).length)}</p>
      <p>Final concat gate: ${escapeHtml(finalConcatGate.decision || "unknown")} · checks ${escapeHtml(finalConcatGate.passed_checks || 0)}/${escapeHtml(finalConcatGate.total_checks || 0)}</p>
      <p>Final edit structural QA: ${escapeHtml(finalEditAudit.decision || "unknown")} · exists ${escapeHtml(finalEditAudit.final_edit?.exists ? "yes" : "no")} · issue ${escapeHtml(finalEditAudit.final_edit?.issue || "none")}</p>
      <p>Video generation run completion: ${escapeHtml(videoGenerationRunCompletion.decision || "unknown")} · highest ${escapeHtml(videoGenerationRunCompletion.highest_completed_target || "unknown")} · checks ${escapeHtml(videoGenerationRunCompletion.passed_checks || 0)}/${escapeHtml(videoGenerationRunCompletion.total_checks || 0)}</p>
      <p>EP02 web media refs: ${escapeHtml(ep02WebMediaRefsAudit.decision || "unknown")} · images ${escapeHtml(ep02WebMediaRefsAudit.images_checked || 0)} · docs ${escapeHtml(ep02WebMediaRefsAudit.documents_checked || 0)} · missing required ${escapeHtml(ep02WebMediaRefsAudit.missing_required_assets || 0)} · pending videos ${escapeHtml(ep02WebMediaRefsAudit.pending_video_outputs || 0)}</p>
      <p>EP02 web battle event panel: ${escapeHtml(ep02WebBattleEventPanelAudit.decision || "unknown")} · shots ${escapeHtml(ep02WebBattleEventPanelAudit.shots_with_battle_ledger || 0)}/${escapeHtml(ep02WebBattleEventPanelAudit.scene09_shots || shots.length)} · rendered panels ${escapeHtml(ep02WebBattleEventPanelAudit.rendered_battle_event_panels || 0)} · problems ${escapeHtml((ep02WebBattleEventPanelAudit.problems || []).length)}</p>
      <p>Web submission prompt surface: ${escapeHtml(webSubmissionPromptSurfaceAudit.decision || "unknown")} · model-ready links ${escapeHtml(webSubmissionPromptSurfaceAudit.rows_with_model_ready_prompt_links || 0)}/${escapeHtml(webSubmissionPromptSurfaceAudit.scene09_shots_checked || shots.length)} · provider prompt contracts ${escapeHtml(webSubmissionPromptSurfaceAudit.provider_prompt_contract_files_checked || 0)}/84 · problems ${escapeHtml((webSubmissionPromptSurfaceAudit.problems || []).length)}</p>
      <p>Operator next steps: ${escapeHtml(operatorNextSteps.current_phase || "unknown")} · next ${escapeHtml(operatorNextSteps.next_action || "unknown")} · blockers ${escapeHtml((operatorNextSteps.blocking_items || []).length)} · probes ${escapeHtml(operatorNextSteps.counts?.playable_probe_clips || 0)}/${escapeHtml(operatorNextSteps.counts?.expected_probe_clips || shots.length)} · full clips ${escapeHtml(operatorNextSteps.counts?.ready_full_duration_clips || 0)}/${escapeHtml(operatorNextSteps.counts?.expected_full_duration_clips || shots.length)}</p>
      </details>
      <details class="audit-details">
        <summary>全部生产文档链接（默认折叠）</summary>
      <div class="links doc-links">
        <a href="RUNBOOK.md">RUNBOOK.md</a>
        <a href="${escapeHtml(statusFile)}">${escapeHtml(statusFile)}</a>
        <a href="submission_payload.jsonl">submission_payload.jsonl</a>
        <a href="submission_queue.csv">submission_queue.csv</a>
        <a href="package_manifest.json">package_manifest.json</a>
        ${batchLinks.map(([target, label]) => `<a href="${escapeHtml(target)}">${escapeHtml(label)}</a>`).join("\n        ")}
      </div>
      </details>
    </div>
  </header>
  <main>
    <section class="metric">
      <h3>Hard Locks</h3>
      <p>No unnamed extras. No anonymous readable students, spectators, soldiers, crowds, bystanders, or silhouettes in any shot.</p>
      <p>Hanneman and Manuela are separate faculty examiners but absent from Shot034B. Shot034B: ${escapeHtml(keyLocks.Shot034B.join(", "))}; both faculty objective markers stay empty.</p>
      <p>Captured Hubert, captured Dorothea, and captured Bernadetta must not reappear. Spent or stood-down characters cannot return as active combatants.</p>
      <p>Shot034G: ${escapeHtml(keyLocks.Shot034G.join(", "))}; exhausted core victory only.</p>
      <p>Shot036: ${escapeHtml(keyLocks.Shot036.join(", "))}; final Dimitri/Byleth stand-down.</p>
    </section>
    ${shots.map(shotCard).join("\n")}
  </main>
</body>
</html>
`;
  writeText(outHtmlPath, html);
  writeJson(outManifestPath, {
    date: "2026-07-31",
    html: path.relative(root, outHtmlPath),
    package_manifest: path.relative(root, packageManifestPath),
    goal_completion_matrix: fs.existsSync(goalCompletionMatrixPath) ? path.relative(root, goalCompletionMatrixPath) : null,
    clip_structural_audit: fs.existsSync(clipStructuralAuditPath) ? path.relative(root, clipStructuralAuditPath) : null,
    actual_delivery_surface_audit: fs.existsSync(actualDeliverySurfaceAuditPath) ? path.relative(root, actualDeliverySurfaceAuditPath) : null,
    executable_prompt_semantics_audit: fs.existsSync(executablePromptSemanticsAuditPath) ? path.relative(root, executablePromptSemanticsAuditPath) : null,
    audio_timing_prompt_contract: fs.existsSync(audioTimingPromptContractPath) ? path.relative(root, audioTimingPromptContractPath) : null,
    character_beat_readiness_audit: fs.existsSync(characterBeatReadinessAuditPath) ? path.relative(root, characterBeatReadinessAuditPath) : null,
    motion_probe_clip_structural_audit: fs.existsSync(motionProbeClipStructuralAuditPath) ? path.relative(root, motionProbeClipStructuralAuditPath) : null,
    motion_probe_package_audit: fs.existsSync(motionProbePackageAuditPath) ? path.relative(root, motionProbePackageAuditPath) : null,
    motion_probe_provider_bundles_audit: fs.existsSync(motionProbeProviderBundlesAuditPath) ? path.relative(root, motionProbeProviderBundlesAuditPath) : null,
    motion_probe_submission_ready_gate: fs.existsSync(motionProbeSubmissionReadyGatePath) ? path.relative(root, motionProbeSubmissionReadyGatePath) : null,
    motion_probe_operator_tracker: fs.existsSync(motionProbeOperatorTrackerPath) ? path.relative(root, motionProbeOperatorTrackerPath) : null,
    motion_probe_operator_tracker_audit: fs.existsSync(motionProbeOperatorTrackerAuditPath) ? path.relative(root, motionProbeOperatorTrackerAuditPath) : null,
    handoff_control_reports_audit: fs.existsSync(handoffControlReportsAuditPath) ? path.relative(root, handoffControlReportsAuditPath) : null,
    full_local_visual_review: fs.existsSync(fullLocalVisualReviewPath) ? path.relative(root, fullLocalVisualReviewPath) : null,
    critical_reaudit: fs.existsSync(criticalReauditPath) ? path.relative(root, criticalReauditPath) : null,
    motion_probe_return_intake_audit: fs.existsSync(motionProbeReturnIntakeAuditPath) ? path.relative(root, motionProbeReturnIntakeAuditPath) : null,
    motion_probe_return_roundtrip_audit: fs.existsSync(motionProbeReturnRoundtripAuditPath) ? path.relative(root, motionProbeReturnRoundtripAuditPath) : null,
    motion_probe_review_packet_audit: fs.existsSync(motionProbeReviewPacketAuditPath) ? path.relative(root, motionProbeReviewPacketAuditPath) : null,
    motion_probe_review_apply_gate: fs.existsSync(motionProbeReviewApplyGatePath) ? path.relative(root, motionProbeReviewApplyGatePath) : null,
    motion_probe_review_apply_positive_contract: fs.existsSync(motionProbeReviewApplyPositiveContractPath) ? path.relative(root, motionProbeReviewApplyPositiveContractPath) : null,
    full_duration_release_gate: fs.existsSync(fullDurationReleaseGatePath) ? path.relative(root, fullDurationReleaseGatePath) : null,
    current_status_consistency_gate: fs.existsSync(currentStatusConsistencyGatePath) ? path.relative(root, currentStatusConsistencyGatePath) : null,
    provider_preflight_consistency_gate: fs.existsSync(providerPreflightConsistencyGatePath) ? path.relative(root, providerPreflightConsistencyGatePath) : null,
    submission_contract_gate: fs.existsSync(submissionContractGatePath) ? path.relative(root, submissionContractGatePath) : null,
    provider_submission_freshness_gate: fs.existsSync(providerSubmissionFreshnessGatePath) ? path.relative(root, providerSubmissionFreshnessGatePath) : null,
    model_cli_template_audit: fs.existsSync(modelCliTemplateAuditPath) ? path.relative(root, modelCliTemplateAuditPath) : null,
    model_cli_template_positive_contract: fs.existsSync(modelCliTemplatePositiveContractPath) ? path.relative(root, modelCliTemplatePositiveContractPath) : null,
    motion_self_audit_evidence_contract: fs.existsSync(motionSelfAuditEvidenceContractPath) ? path.relative(root, motionSelfAuditEvidenceContractPath) : null,
    motion_self_audit_unsigned_evidence_rejection: fs.existsSync(motionSelfAuditUnsignedEvidenceRejectionPath) ? path.relative(root, motionSelfAuditUnsignedEvidenceRejectionPath) : null,
    motion_self_audit_apply_positive_contract: fs.existsSync(motionSelfAuditApplyPositiveContractPath) ? path.relative(root, motionSelfAuditApplyPositiveContractPath) : null,
    motion_self_audit_apply_gate: fs.existsSync(motionSelfAuditApplyGatePath) ? path.relative(root, motionSelfAuditApplyGatePath) : null,
    clip_provenance_gate: fs.existsSync(clipProvenanceGatePath) ? path.relative(root, clipProvenanceGatePath) : null,
    provider_upload_bundles_audit: fs.existsSync(providerUploadBundlesAuditPath) ? path.relative(root, providerUploadBundlesAuditPath) : null,
    clip_return_intake_audit: fs.existsSync(clipReturnIntakeAuditPath) ? path.relative(root, clipReturnIntakeAuditPath) : null,
    clip_revision_queue: fs.existsSync(clipRevisionQueuePath) ? path.relative(root, clipRevisionQueuePath) : null,
    provider_ingest_provenance_contract: fs.existsSync(providerIngestProvenanceContractPath) ? path.relative(root, providerIngestProvenanceContractPath) : null,
    final_concat_inputs_contract: fs.existsSync(finalConcatInputsContractPath) ? path.relative(root, finalConcatInputsContractPath) : null,
    final_concat_positive_contract: fs.existsSync(finalConcatPositiveContractPath) ? path.relative(root, finalConcatPositiveContractPath) : null,
    report_freshness_gate: fs.existsSync(reportFreshnessGatePath) ? path.relative(root, reportFreshnessGatePath) : null,
    positive_contract_isolation_gate: fs.existsSync(positiveContractIsolationGatePath) ? path.relative(root, positiveContractIsolationGatePath) : null,
    production_delivery_truth_gate: fs.existsSync(productionDeliveryTruthGatePath) ? path.relative(root, productionDeliveryTruthGatePath) : null,
    proxy_misuse_gate: fs.existsSync(proxyMisuseGatePath) ? path.relative(root, proxyMisuseGatePath) : null,
    final_concat_gate: fs.existsSync(finalConcatGatePath) ? path.relative(root, finalConcatGatePath) : null,
    final_edit_structural_audit: fs.existsSync(finalEditStructuralAuditPath) ? path.relative(root, finalEditStructuralAuditPath) : null,
    video_generation_run_completion_audit: fs.existsSync(videoGenerationRunCompletionAuditPath) ? path.relative(root, videoGenerationRunCompletionAuditPath) : null,
    ep02_web_media_refs_audit: fs.existsSync(ep02WebMediaRefsAuditPath) ? path.relative(root, ep02WebMediaRefsAuditPath) : null,
    web_submission_prompt_surface_audit: fs.existsSync(webSubmissionPromptSurfaceAuditPath) ? path.relative(root, webSubmissionPromptSurfaceAuditPath) : null,
    shots: shots.length,
    status_counts: statusCounts,
    key_locks: keyLocks,
    decision: "handoff_index_built",
  });
  console.log(JSON.stringify({
    ok: true,
    decision: "handoff_index_built",
    html: path.relative(root, outHtmlPath),
    shots: shots.length,
  }, null, 2));
}

main();
