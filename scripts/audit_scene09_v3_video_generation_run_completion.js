#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
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
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const executionPlanPath = path.join(packageDir, "execution_plan.json");
const runbookPath = path.join(packageDir, "RUNBOOK.md");
const executionCommandsPath = path.join(packageDir, "execution_commands.sh");
const submissionQueuePath = path.join(packageDir, "submission_queue.csv");
const actualDeliverySurfaceAuditPath = path.join(reportDir, "scene09_v3_actual_delivery_surface_audit_2026-08-01.json");
const currentHannemanContractAuditPath = path.join(reportDir, "scene09_v3_current_hanneman_contract_2026-08-01.json");
const currentStatusConsistencyGatePath = path.join(reportDir, "scene09_v3_current_status_consistency_gate_2026-08-01.json");
const providerPreflightConsistencyGatePath = path.join(reportDir, "scene09_v3_provider_preflight_consistency_gate_2026-08-01.json");
const submissionContractGatePath = path.join(reportDir, "scene09_v3_submission_contract_gate_2026-08-01.json");
const providerSubmissionFreshnessGatePath = path.join(reportDir, "scene09_v3_provider_submission_freshness_gate_2026-08-01.json");
const clipStructuralPath = path.join(reportDir, "scene09_v3_generated_clip_structural_audit_2026-08-01.json");
const motionAssetsPath = path.join(reportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json");
const motionDecisionsPath = path.join(reportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.json");
const revisionQueuePath = path.join(reportDir, "scene09_v3_clip_revision_queue_2026-07-28.json");
const motionSelfAuditPacketAuditPath = path.join(reportDir, "scene09_v3_motion_self_audit_packet_audit_2026-08-01.json");
const motionSelfAuditEvidenceContractPath = path.join(reportDir, "scene09_v3_motion_self_audit_evidence_contract_2026-08-01.json");
const motionSelfAuditUnsignedEvidenceRejectionPath = path.join(reportDir, "scene09_v3_motion_self_audit_unsigned_evidence_rejection_2026-08-01.json");
const motionSelfAuditApplyPositiveContractPath = path.join(reportDir, "scene09_v3_motion_self_audit_apply_positive_contract_2026-08-01.json");
const motionSelfAuditApplyGatePath = path.join(reportDir, "scene09_v3_motion_self_audit_apply_gate_2026-08-01.json");
const fullDurationReleaseGatePath = path.join(reportDir, "scene09_v3_full_duration_release_gate_2026-08-01.json");
const afterClipReturnResumePositiveContractPath = path.join(reportDir, "scene09_v3_after_clip_return_resume_positive_contract_2026-08-01.json");
const finalConcatPositiveContractPath = path.join(reportDir, "scene09_v3_final_concat_positive_contract_2026-08-01.json");
const clipReturnIntakeAuditPath = path.join(reportDir, "scene09_v3_clip_return_intake_audit_2026-08-01.json");
const clipReturnRoundtripAuditPath = path.join(reportDir, "scene09_v3_clip_return_roundtrip_audit_2026-08-01.json");
const modelCliExecutionProvenanceAuditPath = path.join(reportDir, "scene09_v3_model_cli_execution_provenance_audit_2026-08-01.json");
const clipProvenanceGatePath = path.join(reportDir, "scene09_v3_clip_provenance_gate_2026-08-01.json");
const reportFreshnessGatePath = path.join(reportDir, "scene09_v3_report_freshness_gate_2026-08-01.json");
const proxyMisuseGatePath = path.join(reportDir, "scene09_v3_proxy_misuse_gate_2026-08-01.json");
const finalConcatGatePath = path.join(reportDir, "scene09_v3_final_concat_gate_2026-08-01.json");
const finalEditPositiveContractPath = path.join(reportDir, "scene09_v3_final_edit_positive_contract_2026-08-01.json");
const finalEditStructuralPath = path.join(reportDir, "scene09_v3_final_edit_structural_audit_2026-08-01.json");
const positiveContractIsolationGatePath = path.join(reportDir, "scene09_v3_positive_contract_isolation_gate_2026-08-01.json");
const productionDeliveryTruthGatePath = path.join(reportDir, "scene09_v3_production_delivery_truth_gate_2026-08-01.json");
const outJson = path.join(reportDir, `scene09_v3_video_generation_run_completion_audit_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_video_generation_run_completion_audit_${date}.md`);
const packageOutJson = path.join(packageDir, "video_generation_run_completion_audit.json");
const packageOutMd = path.join(packageDir, "video_generation_run_completion_audit.md");

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

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function expectedClipFileRows(shots) {
  return shots.map((shot) => {
    const absolute = abs(shot.expected_clip || "");
    const exists = fs.existsSync(absolute);
    const stat = exists ? fs.statSync(absolute) : null;
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
      exists,
      size_bytes: stat?.size ?? null,
      sha256: exists ? sha256(absolute) : null,
    };
  });
}

function probeVideoFile(file) {
  if (!fs.existsSync(file)) return { exists: false, ok: false, issue: "missing_clip" };
  const stat = fs.statSync(file);
  if (stat.size === 0) return { exists: true, ok: false, issue: "zero_byte_clip", size_bytes: 0 };
  const result = cp.spawnSync("ffprobe", [
    "-v", "error",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    file,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    return { exists: true, ok: false, issue: "ffprobe_failed", size_bytes: stat.size, error: result.stderr.trim() || `ffprobe exited ${result.status}` };
  }
  try {
    const data = JSON.parse(result.stdout);
    const videoStream = (data.streams || []).find((stream) => stream.codec_type === "video");
    return {
      exists: true,
      ok: Boolean(videoStream),
      issue: videoStream ? null : "missing_video_stream",
      size_bytes: stat.size,
      duration_seconds: Number(data.format?.duration || 0),
      codec_name: videoStream?.codec_name || null,
      width: videoStream?.width || null,
      height: videoStream?.height || null,
    };
  } catch (error) {
    return { exists: true, ok: false, issue: "ffprobe_json_parse_failed", size_bytes: stat.size, error: error.message };
  }
}

function expectedClipProbeRows(shots) {
  return shots.map((shot) => {
    const file = abs(shot.expected_clip || "");
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
      probe: probeVideoFile(file),
    };
  });
}

function normalizeClipPath(value) {
  if (!value) return "";
  return rel(abs(value));
}

function clipProvenanceRows(shots) {
  const provenancePath = path.join(packageDir, "generated_clip_provenance.json");
  const provenance = readJson(provenancePath, { version: 1, rows: [] });
  const provenanceRows = Array.isArray(provenance.rows) ? provenance.rows : [];
  const provenanceByClip = new Map(provenanceRows.map((row) => [normalizeClipPath(row.expected_clip || row.output_clip), row]));
  return shots.map((shot) => {
    const expectedClip = normalizeClipPath(shot.expected_clip);
    const expectedAbs = abs(shot.expected_clip || "");
    const exists = fs.existsSync(expectedAbs);
    const currentSha256 = exists ? sha256(expectedAbs) : null;
    const source = provenanceByClip.get(expectedClip) || null;
    const rowProblems = [];
    const rowWarnings = [];

    if (exists && !source) rowProblems.push("existing expected clip has no provenance row");
    if (exists && source) {
      if (!["provider_ingest", "model_cli_execute"].includes(source.source_type)) {
        rowProblems.push(`unsupported provenance source_type ${source.source_type || "missing"}`);
      }
      if (!source.sha256) rowProblems.push("provenance row is missing output sha256");
      if (source.sha256 && source.sha256 !== currentSha256) {
        rowProblems.push("current expected clip sha256 does not match provenance sha256");
      }
      if (!source.created_at) rowProblems.push("provenance row is missing created_at");
      if (!source.shot || source.shot !== shot.shot) rowProblems.push(`provenance shot ${source.shot || "missing"} does not match ${shot.shot}`);
      if (!source.id || source.id !== shot.id) rowProblems.push(`provenance id ${source.id || "missing"} does not match ${shot.id}`);
      if (source.source_type === "provider_ingest") {
        if (!source.source) rowProblems.push("provider provenance is missing source path");
        if (!source.source_relative_to_input) rowProblems.push("provider provenance is missing source_relative_to_input");
        if (!source.source_bytes) rowProblems.push("provider provenance is missing source_bytes");
        if (!source.source_sha256) rowProblems.push("provider provenance is missing source_sha256");
        if (!source.source_video_probe?.ok) rowProblems.push("provider provenance is missing passing source_video_probe");
        if (source.source && fs.existsSync(source.source)) {
          const sourceStat = fs.statSync(source.source);
          const sourceSha256 = sha256(source.source);
          if (Number(source.source_bytes || 0) !== sourceStat.size) {
            rowProblems.push("provider source file bytes do not match provenance source_bytes");
          }
          if (source.source_sha256 && source.source_sha256 !== sourceSha256) {
            rowProblems.push("provider source file sha256 does not match provenance source_sha256");
          }
        }
      }
      const sourcePathText = JSON.stringify(source).toLowerCase();
      if (/proxy_animatic|_proxy/.test(sourcePathText)) {
        rowProblems.push("provenance references proxy animatic material");
      }
    }
    if (!exists && source) rowWarnings.push("provenance row exists but expected clip is currently missing");

    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: expectedClip,
      exists,
      current_sha256: currentSha256,
      provenance_source_type: source?.source_type || null,
      provenance_sha256: source?.sha256 || null,
      provenance_created_at: source?.created_at || null,
      provenance_source_sha256: source?.source_sha256 || null,
      problems: rowProblems,
      warnings: rowWarnings,
    };
  });
}

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
}

function promptNoActive(prompt) {
  return prompt.match(/No-active-combat after this shot:\s*(.+?)(?:\.|\n|$)/)?.[1]?.trim() || "";
}

function battleLedgerRows(shots) {
  return shots.map((shot) => {
    const ledger = shot.battle_state_after?.battle_ledger_after || shot.battle_ledger_after || {};
    const modelPromptPath = shot.package_dir
      ? path.join(packageDir, shot.package_dir, "model_prompt.md")
      : null;
    const noActiveCombatLine = modelPromptPath ? promptNoActive(readText(modelPromptPath)) : "";
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      status: shot.status,
      visible_named_only: shot.visible_named_only || [],
      alive_by_house: ledger.alive_by_house || {},
      active_by_house: ledger.still_active_or_controlling_objective_by_house || {},
      limited_by_house: ledger.limited_but_not_defeated_by_house || {},
      defeated_removed_by_house: ledger.mock_battle_defeated_or_removed_by_house || {},
      captured_objective_defeated_by_house: ledger.captured_or_objective_defeated_by_house || {},
      stood_down_post_battle_by_house: ledger.stood_down_or_post_battle_by_house || {},
      must_not_return_active_by_house: ledger.must_not_return_active_by_house || {},
      changed_this_shot: ledger.changed_this_shot || [],
      all_named_characters_alive: ledger.all_named_characters_alive === true,
      no_active_combat_line: noActiveCombatLine || "none",
      package_dir: shot.package_dir,
    };
  });
}

function parseJsonlFile(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}

function groupText(groups) {
  if (!groups || typeof groups !== "object") return "none";
  const rows = Object.entries(groups)
    .filter(([, names]) => Array.isArray(names) && names.length)
    .map(([group, names]) => `${group}: ${names.join(", ")}`);
  return rows.length ? rows.join("; ") : "none";
}

function changeText(changes) {
  const rows = Array.isArray(changes) ? changes : [];
  return rows.length
    ? rows.map((item) => `${item.name || item}:${item.status || item.label || "changed"}`).join("; ")
    : "none";
}

function unique(values) {
  return values.filter((value, index, all) => value && all.indexOf(value) === index);
}

const hardCapturedNoReadableReturn = new Set(["Hubert", "Dorothea", "Bernadetta"]);

function setFromGroups(groups) {
  return new Set(flattenGroups(groups));
}

function intersection(values, set) {
  return values.filter((value) => set.has(value));
}

function difference(setA, setB) {
  return [...setA].filter((value) => !setB.has(value));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function negativePrompt(prompt) {
  const match = prompt.match(/Negative Prompt:\s*([\s\S]*)$/);
  return match ? match[1] : "";
}

function hasReadableReturnConflict(name, prompt) {
  const negative = negativePrompt(prompt);
  return new RegExp(`\\bno\\s+readable\\s+(return\\s+of\\s+)?${escapeRegExp(name)}\\b`, "i").test(negative);
}

function hasNonActiveVisibleContext(name, prompt) {
  const haystack = String(prompt || "").toLowerCase();
  const lowerName = String(name || "").toLowerCase();
  if (!haystack.includes(lowerName)) return false;
  return [
    "stand down",
    "stands down",
    "stood down",
    "post-action",
    "post-battle",
    "combat over",
    "lowered",
    "lowers",
    "lower ",
    "concession",
    "defeated",
    "route block",
    "restrained respect",
    "dignified",
    "remain absent",
    "already captured",
    "not return active",
  ].some((token) => haystack.includes(token));
}

function battleLedgerStateMachineRows(shots) {
  const knownNames = new Set(flattenGroups(shots[0]?.battle_state_after?.battle_ledger_after?.alive_by_house || shots[0]?.battle_ledger_after?.alive_by_house || {}));
  let previousMustNotReturn = new Set();
  let previousCapturedObjectiveDefeated = new Set();
  return shots.map((shot) => {
    const ledger = shot.battle_state_after?.battle_ledger_after || shot.battle_ledger_after || {};
    const modelPromptPath = shot.package_dir ? path.join(packageDir, shot.package_dir, "model_prompt.md") : null;
    const modelPrompt = modelPromptPath ? readText(modelPromptPath) : "";
    const visible = shot.visible_named_only || [];
    const currentActive = setFromGroups(ledger.still_active_or_controlling_objective_by_house);
    const currentMustNotReturn = setFromGroups(ledger.must_not_return_active_by_house);
    const visibleUnknown = visible.filter((name) => !knownNames.has(name));
    const visiblePreviousMustNot = intersection(visible, previousMustNotReturn);
    const visiblePreviousCaptured = intersection(visible, previousCapturedObjectiveDefeated)
      .filter((name) => hardCapturedNoReadableReturn.has(name));
    const activePreviousMustNot = intersection([...currentActive], previousMustNotReturn);
    const activeCurrentMustNot = intersection([...currentActive], currentMustNotReturn);
    const missingStickyMustNot = difference(previousMustNotReturn, currentMustNotReturn);
    const visibleNonActiveContextMissing = visiblePreviousMustNot
      .filter((name) => !previousCapturedObjectiveDefeated.has(name))
      .filter((name) => !hasNonActiveVisibleContext(name, modelPrompt));
    const visibleNegativeConflicts = visiblePreviousMustNot
      .filter((name) => hasReadableReturnConflict(name, modelPrompt));
    const stateProblems = [];
    if (visibleUnknown.length) stateProblems.push(`visible roster contains non-ledger names: ${visibleUnknown.join(", ")}`);
    if (activePreviousMustNot.length) stateProblems.push(`previous must-not-return characters are active again: ${activePreviousMustNot.join(", ")}`);
    if (activeCurrentMustNot.length) stateProblems.push(`current active roster overlaps current must-not-return list: ${activeCurrentMustNot.join(", ")}`);
    if (missingStickyMustNot.length) stateProblems.push(`previous must-not-return characters dropped from current must-not-return list: ${missingStickyMustNot.join(", ")}`);
    if (visiblePreviousCaptured.length) stateProblems.push(`previously captured/objective-defeated characters reappear readable: ${visiblePreviousCaptured.join(", ")}`);
    if (visibleNonActiveContextMissing.length) stateProblems.push(`visible previously retired characters lack non-active/post-battle context: ${visibleNonActiveContextMissing.join(", ")}`);
    if (visibleNegativeConflicts.length) stateProblems.push(`negative prompt forbids readable return for visible retired characters: ${visibleNegativeConflicts.join(", ")}`);
    const row = {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      visible_named_only: visible,
      previous_must_not_return_active: [...previousMustNotReturn],
      previous_captured_objective_defeated: [...previousCapturedObjectiveDefeated],
      current_active_or_objective: [...currentActive],
      current_must_not_return_active: [...currentMustNotReturn],
      visible_previous_must_not_return: visiblePreviousMustNot,
      visible_previous_captured_objective_defeated: visiblePreviousCaptured,
      active_previous_must_not_return: activePreviousMustNot,
      active_current_must_not_return_overlap: activeCurrentMustNot,
      missing_sticky_must_not_return: missingStickyMustNot,
      visible_retired_context_missing: visibleNonActiveContextMissing,
      visible_negative_prompt_conflicts: visibleNegativeConflicts,
      state_machine_problems: stateProblems,
    };
    previousMustNotReturn = new Set([...previousMustNotReturn, ...currentMustNotReturn]);
    previousCapturedObjectiveDefeated = new Set([
      ...previousCapturedObjectiveDefeated,
      ...flattenGroups(ledger.captured_or_objective_defeated_by_house),
    ]);
    return row;
  });
}

function expectedSubmissionLedgerFields(battleState, ledger, visibleNamedOnly = []) {
  const noActive = unique([
    ...(Array.isArray(battleState.inactive_or_removed_after) ? battleState.inactive_or_removed_after : []),
    ...(Array.isArray(battleState.no_active_combat_after) ? battleState.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
  ]);
  const active = new Set(flattenGroups(ledger.still_active_or_controlling_objective_by_house || battleState.active_by_house));
  const visibleButNoActive = visibleNamedOnly.filter((name) => name && !active.has(name));
  return {
    alive_safe_after: groupText(ledger.alive_by_house || battleState.active_by_house),
    visible_but_no_active_combat_after: visibleButNoActive.length ? visibleButNoActive.join(", ") : "none",
    active_or_objective_after: groupText(ledger.still_active_or_controlling_objective_by_house || battleState.active_by_house),
    limited_after: groupText(ledger.limited_but_not_defeated_by_house),
    defeated_removed_after: groupText(ledger.mock_battle_defeated_or_removed_by_house || battleState.inactive_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_or_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_or_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: noActive.join(", ") || "none",
  };
}

function submissionBattleLedgerRows(shots) {
  const activeManifest = readJson(path.join(root, "production_system/video_delivery_manifest.json"), { shots: [] });
  const activeByShot = new Map((activeManifest.shots || []).map((shot) => [shot.shot, shot]));
  const payloadRows = parseJsonlFile(path.join(packageDir, "submission_payload.jsonl"));
  const payloadByShot = new Map(payloadRows.map((row) => [row.shot, row]));
  return shots.map((shot) => {
    const metadata = readJson(path.join(packageDir, shot.package_dir || "", "metadata.json"), {});
    const activeShot = activeByShot.get(shot.shot) || {};
    const payload = payloadByShot.get(shot.shot) || null;
    const authoritativeBattleState = metadata.battle_state_after || activeShot.battle_state_after || shot.battle_state_after || {};
    const authoritativeLedger = authoritativeBattleState.battle_ledger_after || metadata.battle_ledger_after || activeShot.battle_ledger_after || shot.battle_ledger_after || {};
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      custom_id: `${String(shot.order).padStart(3, "0")}_${shot.shot}`,
      visible_named_only: shot.visible_named_only || [],
      expected_ledger_fields: expectedSubmissionLedgerFields(authoritativeBattleState, authoritativeLedger, shot.visible_named_only || []),
      expected_battle_ledger_after: authoritativeLedger,
      payload_ledger_fields: payload ? {
        alive_safe_after: payload.alive_safe_after || "",
        visible_but_no_active_combat_after: payload.visible_but_no_active_combat_after || "",
        active_or_objective_after: payload.active_or_objective_after || "",
        limited_after: payload.limited_after || "",
        defeated_removed_after: payload.defeated_removed_after || "",
        captured_objective_defeated_after: payload.captured_objective_defeated_after || "",
        stood_down_post_battle_after: payload.stood_down_post_battle_after || "",
        must_not_return_active_after: payload.must_not_return_active_after || "",
        changed_this_shot: payload.changed_this_shot || "",
        no_active_combat_line: payload.no_active_combat_line || "",
      } : null,
      payload_battle_ledger_after: payload?.battle_ledger_after || null,
      payload_battle_state_ledger_after: payload?.battle_state_after?.battle_ledger_after || null,
      metadata_battle_ledger_after: metadata?.battle_state_after?.battle_ledger_after || metadata?.battle_ledger_after || null,
      metadata_no_active_combat_after: metadata?.battle_state_after?.no_active_combat_after || [],
    };
  });
}

function isSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

function check(id, label, passed, detail, evidence) {
  return { id, label, passed: Boolean(passed), detail, evidence };
}

function main() {
  const manifest = readJson(packageManifestPath);
  if (!manifest) throw new Error(`Missing package manifest: ${packageManifestPath}`);
  const executionPlan = readJson(executionPlanPath, {});
  const actualDeliverySurfaceAudit = readJson(actualDeliverySurfaceAuditPath, {});
  const currentHannemanContractAudit = readJson(currentHannemanContractAuditPath, {});
  const currentStatusConsistencyGate = readJson(currentStatusConsistencyGatePath, {});
  const providerPreflightConsistencyGate = readJson(providerPreflightConsistencyGatePath, {});
  const submissionContractGate = readJson(submissionContractGatePath, {});
  const providerSubmissionFreshnessGate = readJson(providerSubmissionFreshnessGatePath, {});
  const clipStructural = readJson(clipStructuralPath, {});
  const motionAssets = readJson(motionAssetsPath, {});
  const motionDecisions = readJson(motionDecisionsPath, {});
  const revisionQueue = readJson(revisionQueuePath, {});
  const motionSelfAuditPacketAudit = readJson(motionSelfAuditPacketAuditPath, {});
  const motionSelfAuditEvidenceContract = readJson(motionSelfAuditEvidenceContractPath, {});
  const motionSelfAuditUnsignedEvidenceRejection = readJson(motionSelfAuditUnsignedEvidenceRejectionPath, {});
  const motionSelfAuditApplyPositiveContract = readJson(motionSelfAuditApplyPositiveContractPath, {});
  const motionSelfAuditApplyGate = readJson(motionSelfAuditApplyGatePath, {});
  const fullDurationReleaseGate = readJson(fullDurationReleaseGatePath, {});
  const afterClipReturnResumePositiveContract = readJson(afterClipReturnResumePositiveContractPath, {});
  const finalConcatPositiveContract = readJson(finalConcatPositiveContractPath, {});
  const clipReturnIntakeAudit = readJson(clipReturnIntakeAuditPath, {});
  const clipReturnRoundtripAudit = readJson(clipReturnRoundtripAuditPath, {});
  const modelCliExecutionProvenanceAudit = readJson(modelCliExecutionProvenanceAuditPath, {});
  const clipProvenanceGate = readJson(clipProvenanceGatePath, {});
  const reportFreshnessGate = readJson(reportFreshnessGatePath, {});
  const proxyMisuseGate = readJson(proxyMisuseGatePath, {});
  const finalConcatGate = readJson(finalConcatGatePath, {});
  const finalEditPositiveContract = readJson(finalEditPositiveContractPath, {});
  const finalEditStructural = readJson(finalEditStructuralPath, {});
  const positiveContractIsolationGate = readJson(positiveContractIsolationGatePath, {});
  const productionDeliveryTruthGate = readJson(productionDeliveryTruthGatePath, {});

  const expected = Number(manifest.total_shots || (manifest.shots || []).length || 42);
  const currentExpectedClipFileRows = expectedClipFileRows(manifest.shots || []);
  const currentExpectedClipDigest = sha256Text(`${JSON.stringify(currentExpectedClipFileRows)}\n`);
  const currentExpectedClipProbeRows = expectedClipProbeRows(manifest.shots || []);
  const currentExpectedClipProbeDigest = sha256Text(`${JSON.stringify(currentExpectedClipProbeRows)}\n`);
  const directlyPlayableClips = currentExpectedClipProbeRows.filter((row) => row.probe.ok).length;
  const directExpectedClipsPlayable = currentExpectedClipProbeRows.length === expected && directlyPlayableClips === expected;
  const currentSubmissionBattleLedgerRows = submissionBattleLedgerRows(manifest.shots || []);
  const currentSubmissionBattleLedgerRowsDigest = sha256Text(`${JSON.stringify(currentSubmissionBattleLedgerRows)}\n`);
  const submissionBattleLedgerRowsDigestOk =
    isSha256(submissionContractGate.submission_battle_ledger_rows_digest_sha256) &&
    Array.isArray(submissionContractGate.submission_battle_ledger_rows) &&
    Number(submissionContractGate.submission_battle_ledger_rows.length || 0) === expected &&
    JSON.stringify(submissionContractGate.submission_battle_ledger_rows) === JSON.stringify(currentSubmissionBattleLedgerRows) &&
    submissionContractGate.submission_battle_ledger_rows_digest_sha256 === currentSubmissionBattleLedgerRowsDigest;
  const currentClipProvenanceRows = clipProvenanceRows(manifest.shots || []);
  const currentClipProvenanceRowsDigest = sha256Text(`${JSON.stringify(currentClipProvenanceRows)}\n`);
  const clipProvenanceRowsDigestOk = isSha256(clipProvenanceGate.rows_digest_sha256) &&
    Array.isArray(clipProvenanceGate.rows) &&
    Number(clipProvenanceGate.rows.length || 0) === expected &&
    JSON.stringify(clipProvenanceGate.rows) === JSON.stringify(currentClipProvenanceRows) &&
    clipProvenanceGate.rows_digest_sha256 === currentClipProvenanceRowsDigest;
  const currentBattleLedgerRows = battleLedgerRows(manifest.shots || []);
  const currentBattleLedgerRowsDigest = sha256Text(`${JSON.stringify(currentBattleLedgerRows)}\n`);
  const currentBattleLedgerStateMachineRows = battleLedgerStateMachineRows(manifest.shots || []);
  const currentBattleLedgerStateMachineRowsDigest = sha256Text(`${JSON.stringify(currentBattleLedgerStateMachineRows)}\n`);
  const motionSelfAuditApplyGateBattleLedgerDigestOk =
    motionSelfAuditApplyGate.battle_ledger_signature?.rows_digest_ok === true &&
    motionSelfAuditApplyGate.battle_ledger_signature?.rows_digest_sha256 === currentBattleLedgerRowsDigest &&
    motionSelfAuditApplyGate.battle_ledger_signature?.current_rows_digest_sha256 === currentBattleLedgerRowsDigest &&
    Array.isArray(motionSelfAuditApplyGate.battle_ledger_signature?.rows) &&
    JSON.stringify(motionSelfAuditApplyGate.battle_ledger_signature.rows) === JSON.stringify(currentBattleLedgerRows);
  const motionSelfAuditApplyGateStateMachineDigestOk =
    motionSelfAuditApplyGate.battle_ledger_signature?.state_machine_rows_digest_ok === true &&
    motionSelfAuditApplyGate.battle_ledger_signature?.state_machine_rows_digest_sha256 === currentBattleLedgerStateMachineRowsDigest &&
    motionSelfAuditApplyGate.battle_ledger_signature?.current_state_machine_rows_digest_sha256 === currentBattleLedgerStateMachineRowsDigest &&
    Array.isArray(motionSelfAuditApplyGate.battle_ledger_signature?.state_machine_rows) &&
    JSON.stringify(motionSelfAuditApplyGate.battle_ledger_signature.state_machine_rows) === JSON.stringify(currentBattleLedgerStateMachineRows) &&
    currentBattleLedgerStateMachineRows.every((row) => Number(row.state_machine_problems?.length || 0) === 0);
  const motionSelfAuditApplyPositiveBattleLedgerDigestOk =
    motionSelfAuditApplyPositiveContract.apply_gate?.battle_ledger_signature?.rows_digest_ok === true &&
    motionSelfAuditApplyPositiveContract.apply_gate?.battle_ledger_signature?.rows_digest_sha256 ===
      motionSelfAuditApplyPositiveContract.apply_gate?.battle_ledger_signature?.current_rows_digest_sha256 &&
    Array.isArray(motionSelfAuditApplyPositiveContract.apply_gate?.battle_ledger_signature?.rows) &&
    Number(motionSelfAuditApplyPositiveContract.apply_gate.battle_ledger_signature.rows.length || 0) === expected;
  const motionSelfAuditApplyPositiveStateMachineDigestOk =
    motionSelfAuditApplyPositiveContract.apply_gate?.battle_ledger_signature?.state_machine_rows_digest_ok === true &&
    motionSelfAuditApplyPositiveContract.apply_gate?.battle_ledger_signature?.state_machine_rows_digest_sha256 ===
      motionSelfAuditApplyPositiveContract.apply_gate?.battle_ledger_signature?.current_state_machine_rows_digest_sha256 &&
    Array.isArray(motionSelfAuditApplyPositiveContract.apply_gate?.battle_ledger_signature?.state_machine_rows) &&
    Number(motionSelfAuditApplyPositiveContract.apply_gate.battle_ledger_signature.state_machine_rows.length || 0) === expected &&
    (motionSelfAuditApplyPositiveContract.apply_gate.battle_ledger_signature.state_machine_rows || [])
      .every((row) => Number(row.state_machine_problems?.length || 0) === 0);
  const finalOutput = process.env.SCENE09_V3_FINAL_OUTPUT
    ? path.resolve(process.env.SCENE09_V3_FINAL_OUTPUT)
    : abs(finalEditStructural.final_output || executionPlan.final_output || "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");
  const finalOutputRel = rel(finalOutput);
  const finalOutputExists = fs.existsSync(finalOutput);
  const finalEdit = finalEditStructural.final_edit || {};
  const finalEditConcatBindingOk = finalEditStructural.final_concat_binding?.ok === true;
  const finalEditConcatSidecarOk = finalEditStructural.final_concat_sidecar?.ok === true;
  const finalEditConcatProvenanceOk = finalEditStructural.final_concat_provenance?.ok === true;
  const finalEditShaMatches = finalOutputExists && isSha256(finalEdit.sha256) && finalEdit.sha256 === sha256(finalOutput);
  const finalEditPathBound = finalEditStructural.final_output === finalOutputRel &&
    (!finalEditStructural.final_output_absolute || path.resolve(finalEditStructural.final_output_absolute) === finalOutput);
  const productionTruthFinalBindingOk = productionDeliveryTruthGate.real_evidence?.final_output_exists !== true ||
    (
      productionDeliveryTruthGate.real_evidence?.final_output === finalOutputRel &&
      productionDeliveryTruthGate.real_evidence?.final_edit_structural_report_output === finalOutputRel &&
      isSha256(productionDeliveryTruthGate.real_evidence?.final_edit_structural_sha256) &&
      productionDeliveryTruthGate.real_evidence?.final_edit_concat_binding_ok === true &&
      productionDeliveryTruthGate.real_evidence?.final_edit_concat_sidecar_ok === true &&
      productionDeliveryTruthGate.real_evidence?.final_edit_concat_provenance_ok === true
    );
  const productionTruthClipDigestOk = isSha256(productionDeliveryTruthGate.real_evidence?.expected_clip_files_digest_sha256) &&
    Array.isArray(productionDeliveryTruthGate.real_evidence?.expected_clip_file_rows) &&
    Number(productionDeliveryTruthGate.real_evidence.expected_clip_file_rows.length || 0) === expected &&
    JSON.stringify(productionDeliveryTruthGate.real_evidence.expected_clip_file_rows) === JSON.stringify(currentExpectedClipFileRows) &&
    productionDeliveryTruthGate.real_evidence.expected_clip_files_digest_sha256 === currentExpectedClipDigest;
  const productionTruthClipProbeOk = isSha256(productionDeliveryTruthGate.real_evidence?.expected_clip_video_probe_digest_sha256) &&
    Array.isArray(productionDeliveryTruthGate.real_evidence?.expected_clip_video_probe_rows) &&
    Number(productionDeliveryTruthGate.real_evidence.expected_clip_video_probe_rows.length || 0) === expected &&
    JSON.stringify(productionDeliveryTruthGate.real_evidence.expected_clip_video_probe_rows) === JSON.stringify(currentExpectedClipProbeRows) &&
    productionDeliveryTruthGate.real_evidence.expected_clip_video_probe_digest_sha256 === currentExpectedClipProbeDigest &&
    Number(productionDeliveryTruthGate.real_evidence.expected_clip_video_probe_playable || 0) === directlyPlayableClips &&
    Number(productionDeliveryTruthGate.real_evidence.expected_clip_video_probe_required || 0) === expected;
  const clipStructuralFileDigestOk = isSha256(clipStructural.expected_clip_files_digest_sha256) &&
    Array.isArray(clipStructural.expected_clip_file_rows) &&
    Number(clipStructural.expected_clip_file_rows.length || 0) === expected &&
    JSON.stringify(clipStructural.expected_clip_file_rows) === JSON.stringify(currentExpectedClipFileRows) &&
    clipStructural.expected_clip_files_digest_sha256 === currentExpectedClipDigest;
  const clipStructuralProbeDigestOk = isSha256(clipStructural.expected_clip_video_probe_digest_sha256) &&
    Array.isArray(clipStructural.expected_clip_video_probe_rows) &&
    Number(clipStructural.expected_clip_video_probe_rows.length || 0) === expected &&
    JSON.stringify(clipStructural.expected_clip_video_probe_rows) === JSON.stringify(currentExpectedClipProbeRows) &&
    clipStructural.expected_clip_video_probe_digest_sha256 === currentExpectedClipProbeDigest &&
    Number(clipStructural.expected_clip_video_probe_playable || 0) === directlyPlayableClips;
  const realOutputsStructurallyComplete = Number(clipStructural.ready_clips || 0) === expected &&
    Number(clipStructural.missing_clips || 0) === 0 &&
    Number(clipStructural.failed_clips || 0) === 0 &&
    finalEdit.exists === true &&
    finalEdit.ok === true &&
    finalOutputExists &&
    finalEditPathBound &&
    finalEditShaMatches &&
    finalEditConcatBindingOk &&
    finalEditConcatSidecarOk &&
    finalEditConcatProvenanceOk;

  const checks = [
    check(
      "package_execution_artifacts",
      "Package-local run artifacts exist",
      fs.existsSync(submissionQueuePath) &&
        fs.existsSync(runbookPath) &&
        fs.existsSync(executionPlanPath) &&
        fs.existsSync(executionCommandsPath),
      "Requires submission_queue.csv, RUNBOOK.md, execution_plan.json, and execution_commands.sh.",
      [submissionQueuePath, runbookPath, executionPlanPath, executionCommandsPath].map(rel),
    ),
    check(
      "actual_delivery_surface_passed",
      "Current Shot034B empty faculty objective delivery surface is repaired across manifests, prompts, payload, and file:// viewers",
      actualDeliverySurfaceAudit.decision === "actual_delivery_surface_passed" &&
        Number(actualDeliverySurfaceAudit.problems?.length || 0) === 0,
      `decision ${actualDeliverySurfaceAudit.decision || "missing"}; problems ${actualDeliverySurfaceAudit.problems?.length || 0}.`,
      rel(actualDeliverySurfaceAuditPath),
    ),
    check(
      "current_hanneman_contract_passed",
      "Shot034B current contract locks Byleth and Dimitri only with Hanneman/Manuela absent/offscreen/unpaired",
      currentHannemanContractAudit.decision === "current_hanneman_contract_passed" &&
        currentHannemanContractAudit.shot === "Shot034B" &&
        JSON.stringify(currentHannemanContractAudit.visible_named_only || []) === JSON.stringify(["Byleth", "Dimitri"]) &&
        Number(currentHannemanContractAudit.problems?.length || 0) === 0,
      `decision ${currentHannemanContractAudit.decision || "missing"}; shot ${currentHannemanContractAudit.shot || "missing"}; visible ${(currentHannemanContractAudit.visible_named_only || []).join(", ") || "missing"}; problems ${currentHannemanContractAudit.problems?.length || 0}.`,
      rel(currentHannemanContractAuditPath),
    ),
    check(
      "current_status_consistency_passed",
      "Current file-access status page matches machine-readable reports and old status files are marked superseded",
      currentStatusConsistencyGate.decision === "current_status_consistency_passed" &&
        Number(currentStatusConsistencyGate.problems?.length || 0) === 0,
      `decision ${currentStatusConsistencyGate.decision || "missing"}; problems ${currentStatusConsistencyGate.problems?.length || 0}; warnings ${currentStatusConsistencyGate.warnings?.length || 0}.`,
      rel(currentStatusConsistencyGatePath),
    ),
    check(
      "provider_preflight_consistency_passed",
      "Provider preflight, upload manifest, package readiness, and model target profile agree before external submission",
      providerPreflightConsistencyGate.decision === "provider_preflight_consistency_passed" &&
        Number(providerPreflightConsistencyGate.expected_shots || 0) === expected &&
        Number(providerPreflightConsistencyGate.problems?.length || 0) === 0,
      `decision ${providerPreflightConsistencyGate.decision || "missing"}; can submit ${providerPreflightConsistencyGate.can_submit_to_provider ? "yes" : "no"}; computed ${providerPreflightConsistencyGate.computed_can_submit_to_provider ? "yes" : "no"}; expected shots ${providerPreflightConsistencyGate.expected_shots || 0}/${expected}; problems ${providerPreflightConsistencyGate.problems?.length || 0}.`,
      rel(providerPreflightConsistencyGatePath),
    ),
    check(
      "submission_contract_gate_passed",
      "Package manifest, execution plan, submission queue, JSONL payload, and shot metadata agree before model submission",
      submissionContractGate.decision === "submission_contract_gate_passed" &&
        Number(submissionContractGate.expected_shots || 0) === expected &&
        Number(submissionContractGate.rows_checked || 0) === expected &&
        Number(submissionContractGate.execution_plan_rows || 0) === expected &&
        Number(submissionContractGate.submission_queue_rows || 0) === expected &&
        Number(submissionContractGate.submission_payload_rows || 0) === expected &&
        submissionBattleLedgerRowsDigestOk &&
        Number(submissionContractGate.problems?.length || 0) === 0,
      `decision ${submissionContractGate.decision || "missing"}; rows ${submissionContractGate.rows_checked || 0}/${expected}; plan ${submissionContractGate.execution_plan_rows || 0}; queue ${submissionContractGate.submission_queue_rows || 0}; payload ${submissionContractGate.submission_payload_rows || 0}; submission ledger digest ${submissionBattleLedgerRowsDigestOk ? "ok" : "missing/stale"}; problems ${submissionContractGate.problems?.length || 0}.`,
      rel(submissionContractGatePath),
    ),
    check(
      "provider_submission_freshness_passed",
      "Model submission batches and provider upload bundles are rebuilt from the current submission payload",
      providerSubmissionFreshnessGate.decision === "provider_submission_freshness_passed" &&
        Number(providerSubmissionFreshnessGate.expected_shots || 0) === expected &&
        Number(providerSubmissionFreshnessGate.model_submission_batch_rows || 0) === expected &&
        Number(providerSubmissionFreshnessGate.provider_bundle_rows || 0) === expected &&
        Number(providerSubmissionFreshnessGate.problems?.length || 0) === 0,
      `decision ${providerSubmissionFreshnessGate.decision || "missing"}; batch rows ${providerSubmissionFreshnessGate.model_submission_batch_rows || 0}/${expected}; provider rows ${providerSubmissionFreshnessGate.provider_bundle_rows || 0}/${expected}; problems ${providerSubmissionFreshnessGate.problems?.length || 0}.`,
      rel(providerSubmissionFreshnessGatePath),
    ),
    check(
      "full_duration_release_gate_passed",
      "Full-duration generation is released only after 42/42 signed Codex-reviewed motion probes pass",
      fullDurationReleaseGate.decision === "full_duration_release_passed" &&
        fullDurationReleaseGate.can_release_full_duration === true &&
        Number(fullDurationReleaseGate.expected_probe_clips || 0) === expected &&
        Number(fullDurationReleaseGate.playable_probe_clips || 0) === expected &&
        Number(fullDurationReleaseGate.review_frame_sets_ready || 0) === expected &&
        Number(fullDurationReleaseGate.full_duration_approvals || 0) === expected &&
        fullDurationReleaseGate.release?.exists === true &&
        fullDurationReleaseGate.release?.rows_digest_ok === true &&
        Number(fullDurationReleaseGate.problems?.length || 0) === 0,
      `decision ${fullDurationReleaseGate.decision || "missing"}; can release ${fullDurationReleaseGate.can_release_full_duration ? "yes" : "no"}; playable probes ${fullDurationReleaseGate.playable_probe_clips || 0}/${expected}; review frames ${fullDurationReleaseGate.review_frame_sets_ready || 0}/${expected}; approvals ${fullDurationReleaseGate.full_duration_approvals || 0}/${expected}; release ${fullDurationReleaseGate.release?.exists ? "present" : "absent"}; blockers ${fullDurationReleaseGate.blocking_items?.length || 0}; problems ${fullDurationReleaseGate.problems?.length || 0}.`,
      rel(fullDurationReleaseGatePath),
    ),
    check(
      "all_expected_clips_structural_pass",
      "All 42 real expected clips exist and pass structural QA",
      Number(clipStructural.expected_clips) === expected &&
        Number(clipStructural.ready_clips) === expected &&
        Number(clipStructural.missing_clips) === 0 &&
        Number(clipStructural.failed_clips) === 0 &&
        clipStructural.decision === "clip_files_integrity_passed_motion_review_still_required" &&
        directExpectedClipsPlayable &&
        clipStructuralFileDigestOk &&
        clipStructuralProbeDigestOk,
      `decision ${clipStructural.decision || "missing"}; ready ${clipStructural.ready_clips || 0}/${expected}; direct playable ${directlyPlayableClips}/${expected}; missing ${clipStructural.missing_clips ?? expected}; failed ${clipStructural.failed_clips || 0}; file digest ${clipStructuralFileDigestOk ? "ok" : "missing/stale"}; probe digest ${clipStructuralProbeDigestOk ? "ok" : "missing/stale"}.`,
      rel(clipStructuralPath),
    ),
    check(
      "motion_review_frames_complete",
      "Motion-review start/mid/end frames exist for every clip",
      Number(motionAssets.expected_clips) === expected &&
        Number(motionAssets.extracted_clips) === expected &&
        Number(motionAssets.missing_clips) === 0 &&
        Number(motionAssets.failed_clips) === 0,
      `extracted ${motionAssets.extracted_clips || 0}/${expected}; missing ${motionAssets.missing_clips ?? expected}; failed ${motionAssets.failed_clips || 0}.`,
      rel(motionAssetsPath),
    ),
    check(
      "codex_motion_self_audit_passed",
      "Codex motion self-audit passed every shot without user approval",
      motionDecisions.decision === "motion_review_passed_ready_for_concat" &&
        Number(motionDecisions.summary?.motion_review_passed || 0) === expected &&
        Number(motionDecisions.summary?.blocked_or_rejected || 0) === 0,
      `decision ${motionDecisions.decision || "missing"}; passed ${motionDecisions.summary?.motion_review_passed || 0}/${expected}; blocked ${motionDecisions.summary?.blocked_or_rejected || 0}.`,
      rel(motionDecisionsPath),
    ),
    check(
      "revision_queue_empty",
      "No generation, repair, review, or regeneration action remains",
      revisionQueue.decision === "clip_revision_queue_clear_ready_for_concat" &&
        Number(revisionQueue.actionable_shots || 0) === 0,
      `decision ${revisionQueue.decision || "missing"}; actionable ${revisionQueue.actionable_shots ?? expected}.`,
      rel(revisionQueuePath),
    ),
    check(
      "motion_self_audit_packet_ready",
      "Codex motion self-audit packet and checklist are structurally ready",
      motionSelfAuditPacketAudit.decision === "motion_self_audit_packet_ready" &&
        Number(motionSelfAuditPacketAudit.rows_checked || 0) === expected &&
        Number(motionSelfAuditPacketAudit.problems?.length || 0) === 0,
      `decision ${motionSelfAuditPacketAudit.decision || "missing"}; rows ${motionSelfAuditPacketAudit.rows_checked || 0}/${expected}; problems ${motionSelfAuditPacketAudit.problems?.length || 0}.`,
      rel(motionSelfAuditPacketAuditPath),
    ),
    check(
      "motion_self_audit_evidence_contract_passed",
      "Codex motion self-audit evidence requires current clip and start/mid/end frame signatures",
      motionSelfAuditEvidenceContract.decision === "motion_self_audit_evidence_contract_passed" &&
        Number(motionSelfAuditEvidenceContract.template_rows || 0) === expected &&
        Number(motionSelfAuditEvidenceContract.rows_with_review_frame_signature_keys || 0) === expected &&
        Number(motionSelfAuditEvidenceContract.problems?.length || 0) === 0,
      `decision ${motionSelfAuditEvidenceContract.decision || "missing"}; template rows ${motionSelfAuditEvidenceContract.template_rows || 0}/${expected}; frame signature rows ${motionSelfAuditEvidenceContract.rows_with_review_frame_signature_keys || 0}/${expected}; problems ${motionSelfAuditEvidenceContract.problems?.length || 0}.`,
      rel(motionSelfAuditEvidenceContractPath),
    ),
    check(
      "motion_self_audit_unsigned_evidence_rejected",
      "Apply gate rejects booleans-only Codex motion approvals without current clip/frame signatures",
      motionSelfAuditUnsignedEvidenceRejection.decision === "motion_self_audit_unsigned_evidence_rejection_passed" &&
        Number(motionSelfAuditUnsignedEvidenceRejection.expected_rows || 0) === expected &&
        Number(motionSelfAuditUnsignedEvidenceRejection.probe?.frame_signature_rejections || 0) === expected * 3 &&
        Number(motionSelfAuditUnsignedEvidenceRejection.probe?.clip_signature_rejections || 0) === expected &&
        motionSelfAuditUnsignedEvidenceRejection.reports_restored_to_default_proposal === true &&
        Number(motionSelfAuditUnsignedEvidenceRejection.problems?.length || 0) === 0,
      `decision ${motionSelfAuditUnsignedEvidenceRejection.decision || "missing"}; frame signature rejections ${motionSelfAuditUnsignedEvidenceRejection.probe?.frame_signature_rejections || 0}/${expected * 3}; clip signature rejections ${motionSelfAuditUnsignedEvidenceRejection.probe?.clip_signature_rejections || 0}/${expected}; restored ${motionSelfAuditUnsignedEvidenceRejection.reports_restored_to_default_proposal ? "yes" : "no"}; problems ${motionSelfAuditUnsignedEvidenceRejection.problems?.length || 0}.`,
      rel(motionSelfAuditUnsignedEvidenceRejectionPath),
    ),
    check(
      "motion_self_audit_apply_positive_contract_passed",
      "Apply gate accepts current signed Codex motion evidence in a temporary positive fixture",
      motionSelfAuditApplyPositiveContract.decision === "motion_self_audit_apply_positive_contract_passed" &&
        Number(motionSelfAuditApplyPositiveContract.expected_shots || 0) === expected &&
        Number(motionSelfAuditApplyPositiveContract.apply_gate?.proposal_rows || 0) === expected &&
        motionSelfAuditApplyPositiveContract.apply_gate?.applied === true &&
        Number(motionSelfAuditApplyPositiveContract.apply_gate?.motion_review_passed || 0) === expected &&
        Number(motionSelfAuditApplyPositiveContract.apply_gate?.evidence_counters?.clip_signature_matched_rows || 0) === expected &&
        Number(motionSelfAuditApplyPositiveContract.apply_gate?.evidence_counters?.review_frame_signature_matched_rows || 0) === expected &&
        Number(motionSelfAuditApplyPositiveContract.apply_gate?.evidence_counters?.review_evidence_complete_rows || 0) === expected &&
        Number(motionSelfAuditApplyPositiveContract.apply_gate?.evidence_counters?.ledger_matched_rows || 0) === expected &&
        Number(motionSelfAuditApplyPositiveContract.apply_gate?.evidence_counters?.required_checks_complete_rows || 0) === expected &&
        motionSelfAuditApplyPositiveBattleLedgerDigestOk &&
        motionSelfAuditApplyPositiveStateMachineDigestOk &&
        motionSelfAuditApplyPositiveContract.stale_battle_ledger_digest_rejection?.rejected === true &&
        motionSelfAuditApplyPositiveContract.stale_active_return_state_machine_digest_rejection?.rejected === true &&
        Number(motionSelfAuditApplyPositiveContract.problems?.length || 0) === 0,
      `decision ${motionSelfAuditApplyPositiveContract.decision || "missing"}; proposal rows ${motionSelfAuditApplyPositiveContract.apply_gate?.proposal_rows || 0}/${expected}; applied ${motionSelfAuditApplyPositiveContract.apply_gate?.applied ? "yes" : "no"}; passed ${motionSelfAuditApplyPositiveContract.apply_gate?.motion_review_passed || 0}/${expected}; clip sig ${motionSelfAuditApplyPositiveContract.apply_gate?.evidence_counters?.clip_signature_matched_rows || 0}/${expected}; frame sig ${motionSelfAuditApplyPositiveContract.apply_gate?.evidence_counters?.review_frame_signature_matched_rows || 0}/${expected}; evidence ${motionSelfAuditApplyPositiveContract.apply_gate?.evidence_counters?.review_evidence_complete_rows || 0}/${expected}; ledger ${motionSelfAuditApplyPositiveContract.apply_gate?.evidence_counters?.ledger_matched_rows || 0}/${expected}; ledger digest ${motionSelfAuditApplyPositiveBattleLedgerDigestOk ? "ok" : "missing/stale"}; active-return state ${motionSelfAuditApplyPositiveStateMachineDigestOk ? "ok" : "missing/stale"}; stale ledger rejected ${motionSelfAuditApplyPositiveContract.stale_battle_ledger_digest_rejection?.rejected ? "yes" : "no"}; stale active-return rejected ${motionSelfAuditApplyPositiveContract.stale_active_return_state_machine_digest_rejection?.rejected ? "yes" : "no"}; checks ${motionSelfAuditApplyPositiveContract.apply_gate?.evidence_counters?.required_checks_complete_rows || 0}/${expected}; problems ${motionSelfAuditApplyPositiveContract.problems?.length || 0}.`,
      rel(motionSelfAuditApplyPositiveContractPath),
    ),
    check(
      "motion_self_audit_apply_gate_passed",
      "Codex motion self-audit decisions were applied through the strict apply gate",
      directExpectedClipsPlayable
        ? motionSelfAuditApplyGate.decision === "motion_self_audit_apply_passed" &&
          motionSelfAuditApplyGate.applied === true &&
          Number(motionSelfAuditApplyGate.proposal_rows || 0) === expected &&
          Number(motionSelfAuditApplyGate.summary?.motion_review_passed || 0) === expected &&
          Number(motionSelfAuditApplyGate.summary?.blocked_or_rejected || 0) === 0 &&
          Number(motionSelfAuditApplyGate.evidence_counters?.clip_signature_matched_rows || 0) === expected &&
          Number(motionSelfAuditApplyGate.evidence_counters?.review_frame_signature_matched_rows || 0) === expected &&
          Number(motionSelfAuditApplyGate.evidence_counters?.review_evidence_complete_rows || 0) === expected &&
          Number(motionSelfAuditApplyGate.evidence_counters?.ledger_matched_rows || 0) === expected &&
          Number(motionSelfAuditApplyGate.evidence_counters?.required_checks_complete_rows || 0) === expected &&
          motionSelfAuditApplyGateBattleLedgerDigestOk &&
          motionSelfAuditApplyGateStateMachineDigestOk &&
          Number(motionSelfAuditApplyGate.problems?.length || 0) === 0
        : motionSelfAuditApplyGate.decision === "motion_self_audit_apply_blocked_clips_pending" &&
          motionSelfAuditApplyGate.applied === false &&
          Number(motionSelfAuditApplyGate.proposal_rows || 0) === expected &&
          motionSelfAuditApplyGateBattleLedgerDigestOk &&
          motionSelfAuditApplyGateStateMachineDigestOk,
      `decision ${motionSelfAuditApplyGate.decision || "missing"}; applied ${motionSelfAuditApplyGate.applied ? "yes" : "no"}; passed ${motionSelfAuditApplyGate.summary?.motion_review_passed || 0}/${expected}; blocked ${motionSelfAuditApplyGate.summary?.blocked_or_rejected || 0}; clip sig ${motionSelfAuditApplyGate.evidence_counters?.clip_signature_matched_rows || 0}/${expected}; frame sig ${motionSelfAuditApplyGate.evidence_counters?.review_frame_signature_matched_rows || 0}/${expected}; evidence ${motionSelfAuditApplyGate.evidence_counters?.review_evidence_complete_rows || 0}/${expected}; ledger ${motionSelfAuditApplyGate.evidence_counters?.ledger_matched_rows || 0}/${expected}; ledger digest ${motionSelfAuditApplyGateBattleLedgerDigestOk ? "ok" : "missing/stale"}; active-return state ${motionSelfAuditApplyGateStateMachineDigestOk ? "ok" : "missing/stale"}; checks ${motionSelfAuditApplyGate.evidence_counters?.required_checks_complete_rows || 0}/${expected}; problems ${motionSelfAuditApplyGate.problems?.length || 0}.`,
      rel(motionSelfAuditApplyGatePath),
    ),
    check(
      "after_clip_return_resume_positive_contract_passed",
      "After-clip-return resume wrapper can ingest returned clips and apply signed Codex motion evidence to reach ready-for-concat in a temporary positive fixture",
      afterClipReturnResumePositiveContract.decision === "after_clip_return_resume_positive_contract_passed" &&
        Number(afterClipReturnResumePositiveContract.expected_shots || 0) === expected &&
        afterClipReturnResumePositiveContract.apply_resume?.decision === "after_clip_return_ready_for_concat" &&
        Number(afterClipReturnResumePositiveContract.apply_resume?.clips_ready || 0) === expected &&
        Number(afterClipReturnResumePositiveContract.apply_resume?.motion_frames || 0) === expected &&
        afterClipReturnResumePositiveContract.apply_resume?.final_concat_gate === "final_concat_gate_passed_ready_for_project_pipeline_concat" &&
        afterClipReturnResumePositiveContract.production_existed_before === afterClipReturnResumePositiveContract.production_exists_after &&
        Number(afterClipReturnResumePositiveContract.problems?.length || 0) === 0,
      `decision ${afterClipReturnResumePositiveContract.decision || "missing"}; apply ${afterClipReturnResumePositiveContract.apply_resume?.decision || "missing"}; clips ${afterClipReturnResumePositiveContract.apply_resume?.clips_ready || 0}/${expected}; frames ${afterClipReturnResumePositiveContract.apply_resume?.motion_frames || 0}/${expected}; concat ${afterClipReturnResumePositiveContract.apply_resume?.final_concat_gate || "missing"}; production changed ${afterClipReturnResumePositiveContract.production_existed_before === afterClipReturnResumePositiveContract.production_exists_after ? "no" : "yes"}; problems ${afterClipReturnResumePositiveContract.problems?.length || 0}.`,
      rel(afterClipReturnResumePositiveContractPath),
    ),
    check(
      "final_concat_positive_contract_passed",
      "Final concat gate accepts a complete upstream evidence set in a temporary positive fixture",
      finalConcatPositiveContract.decision === "final_concat_positive_contract_passed" &&
        Number(finalConcatPositiveContract.expected_shots || 0) === expected &&
        finalConcatPositiveContract.gate_result?.decision === "final_concat_gate_passed_ready_for_project_pipeline_concat" &&
        Number(finalConcatPositiveContract.gate_result?.passed_checks || 0) === 8 &&
        Number(finalConcatPositiveContract.gate_result?.total_checks || 0) === 8 &&
        Number(finalConcatPositiveContract.direct_expected_clip_probe?.playable_clips || 0) === expected &&
        Number(finalConcatPositiveContract.direct_expected_clip_probe?.expected_clips || 0) === expected &&
        finalConcatPositiveContract.tampered_input_contract_rejection?.rejected === true &&
        finalConcatPositiveContract.tampered_input_contract_rejection?.gate_result?.decision === "final_concat_blocked_motion_or_revision_gate" &&
        (finalConcatPositiveContract.tampered_input_contract_rejection?.failed_checks || []).includes("final_concat_inputs_contract") &&
        Number(finalConcatPositiveContract.problems?.length || 0) === 0,
      `decision ${finalConcatPositiveContract.decision || "missing"}; gate ${finalConcatPositiveContract.gate_result?.decision || "missing"}; checks ${finalConcatPositiveContract.gate_result?.passed_checks || 0}/${finalConcatPositiveContract.gate_result?.total_checks || 0}; direct ffprobe ${finalConcatPositiveContract.direct_expected_clip_probe?.playable_clips || 0}/${finalConcatPositiveContract.direct_expected_clip_probe?.expected_clips || 0}; tampered input rejected ${finalConcatPositiveContract.tampered_input_contract_rejection?.rejected ? "yes" : "no"}; problems ${finalConcatPositiveContract.problems?.length || 0}.`,
      rel(finalConcatPositiveContractPath),
    ),
    check(
      "clip_return_intake_ready",
      "Provider clip return intake folders and dry-run/apply instructions are ready",
      clipReturnIntakeAudit.decision === "clip_return_intake_ready" &&
        Number(clipReturnIntakeAudit.batches_checked || 0) === 7 &&
        Number(clipReturnIntakeAudit.expected_clip_rows || 0) === expected &&
        Number(clipReturnIntakeAudit.unique_custom_ids || 0) === expected &&
        Number(clipReturnIntakeAudit.problems?.length || 0) === 0,
      `decision ${clipReturnIntakeAudit.decision || "missing"}; batches ${clipReturnIntakeAudit.batches_checked || 0}/7; expected rows ${clipReturnIntakeAudit.expected_clip_rows || 0}/${expected}; custom ids ${clipReturnIntakeAudit.unique_custom_ids || 0}/${expected}; problems ${clipReturnIntakeAudit.problems?.length || 0}.`,
      rel(clipReturnIntakeAuditPath),
    ),
    check(
      "clip_return_roundtrip_passed_strict",
      "Provider-returned clips roundtrip safely by expected filename/custom_id while rejecting bare shot names and invalid mp4 files",
      clipReturnRoundtripAudit.decision === "clip_return_roundtrip_passed" &&
        (clipReturnRoundtripAudit.scenarios || []).some((scenario) =>
          scenario.strategy === "expected_filename" &&
          Number(scenario.unique_matched_shots || 0) === expected &&
          Number(scenario.would_copy || 0) === expected &&
          Number(scenario.problems?.length || 0) === 0
        ) &&
        (clipReturnRoundtripAudit.scenarios || []).some((scenario) =>
          scenario.strategy === "custom_id_prefix" &&
          Number(scenario.unique_matched_shots || 0) === expected &&
          Number(scenario.would_copy || 0) === expected &&
          Number(scenario.problems?.length || 0) === 0
        ) &&
        (clipReturnRoundtripAudit.scenarios || []).some((scenario) =>
          scenario.strategy === "loose_shot_name_rejected" &&
          Number(scenario.unique_matched_shots || 0) === 0 &&
          Number(scenario.would_copy || 0) === 0 &&
          Number(scenario.problems?.length || 0) === 0
        ) &&
        (clipReturnRoundtripAudit.scenarios || []).some((scenario) =>
          scenario.strategy === "invalid_mp4_rejected" &&
          scenario.decision === "clip_ingest_needs_filename_resolution" &&
          Number(scenario.unique_matched_shots || 0) === 0 &&
          Number(scenario.would_copy || 0) === 0 &&
          Number(scenario.invalid_video_files || 0) === 1 &&
          Number(scenario.problems?.length || 0) === 0
        ),
      `decision ${clipReturnRoundtripAudit.decision || "missing"}; scenarios ${(clipReturnRoundtripAudit.scenarios || []).map((scenario) => `${scenario.strategy}:${scenario.unique_matched_shots || 0}/${scenario.would_copy || 0}/invalid${scenario.invalid_video_files || 0}`).join(", ") || "missing"}.`,
      rel(clipReturnRoundtripAuditPath),
    ),
    check(
      "model_cli_execution_provenance_contract_passed",
      "Local model CLI execution path writes model_cli_execute provenance with matching output SHA-256",
      modelCliExecutionProvenanceAudit.decision === "model_cli_execution_provenance_passed" &&
        Number(modelCliExecutionProvenanceAudit.expected_shots || 0) === expected &&
        Number(modelCliExecutionProvenanceAudit.provenance?.rows_checked || 0) === expected &&
        Number(modelCliExecutionProvenanceAudit.provenance?.unique_expected_clips || 0) === expected &&
        Number(modelCliExecutionProvenanceAudit.problems?.length || 0) === 0,
      `decision ${modelCliExecutionProvenanceAudit.decision || "missing"}; rows ${modelCliExecutionProvenanceAudit.provenance?.rows_checked || 0}/${expected}; unique clips ${modelCliExecutionProvenanceAudit.provenance?.unique_expected_clips || 0}/${expected}; problems ${modelCliExecutionProvenanceAudit.problems?.length || 0}.`,
      rel(modelCliExecutionProvenanceAuditPath),
    ),
    check(
      "clip_provenance_gate_passed",
      "Existing expected clips have provider-ingest or local-model provenance matching current SHA-256",
      directExpectedClipsPlayable
        ? clipProvenanceGate.decision === "clip_provenance_passed_all_expected_clips" &&
          Number(clipProvenanceGate.expected_clips || 0) === expected &&
          Number(clipProvenanceGate.existing_clips || 0) === expected &&
          Number(clipProvenanceGate.missing_clips || 0) === 0 &&
          Number(clipProvenanceGate.provenance_rows || 0) === expected &&
          Number(clipProvenanceGate.provenance_matched_existing_clips || 0) === expected &&
          clipProvenanceRowsDigestOk &&
          Number(clipProvenanceGate.problems?.length || 0) === 0
        : clipProvenanceGate.decision === "clip_provenance_ready_clips_pending" &&
          Number(clipProvenanceGate.expected_clips || 0) === expected &&
          Number(clipProvenanceGate.existing_clips || 0) === directlyPlayableClips &&
          clipProvenanceRowsDigestOk &&
          Number(clipProvenanceGate.problems?.length || 0) === 0,
      `decision ${clipProvenanceGate.decision || "missing"}; existing ${clipProvenanceGate.existing_clips || 0}/${expected}; missing ${clipProvenanceGate.missing_clips ?? expected}; provenance rows ${clipProvenanceGate.provenance_rows || 0}/${expected}; matched ${clipProvenanceGate.provenance_matched_existing_clips || 0}/${expected}; direct playable ${directlyPlayableClips}/${expected}; rows digest ${clipProvenanceRowsDigestOk ? "ok" : "missing/stale"}; problems ${clipProvenanceGate.problems?.length || 0}.`,
      rel(clipProvenanceGatePath),
    ),
    check(
      "reports_align_with_current_manifest",
      "Package-local reports align with the current package manifest",
      reportFreshnessGate.decision === "report_freshness_passed_current_manifest" &&
        Number(reportFreshnessGate.problems?.length || 0) === 0,
      `decision ${reportFreshnessGate.decision || "missing"}; problems ${reportFreshnessGate.problems?.length || 0}; warnings ${reportFreshnessGate.warnings?.length || 0}.`,
      rel(reportFreshnessGatePath),
    ),
    check(
      "proxy_assets_not_used_as_real_outputs",
      "Reference-only proxy animatic clips are not used as expected clips or final edit",
      /^proxy_isolation_passed_/.test(proxyMisuseGate.decision || "") &&
        Number(proxyMisuseGate.problems?.length || 0) === 0,
      `decision ${proxyMisuseGate.decision || "missing"}; problems ${proxyMisuseGate.problems?.length || 0}.`,
      rel(proxyMisuseGatePath),
    ),
    check(
      "final_concat_gate_passed",
      "Final concat gate passed before assembly",
      finalConcatGate.decision === "final_concat_gate_passed_ready_for_project_pipeline_concat" &&
        Number(finalConcatGate.passed_checks || 0) === 8 &&
        Number(finalConcatGate.total_checks || 0) === 8,
      `decision ${finalConcatGate.decision || "missing"}; checks ${finalConcatGate.passed_checks || 0}/${finalConcatGate.total_checks || 0}.`,
      rel(finalConcatGatePath),
    ),
    check(
      "final_edit_positive_contract_passed",
      "Final edit structural audit accepts a valid package-duration mp4 in a temporary positive fixture",
      finalEditPositiveContract.decision === "final_edit_positive_contract_passed" &&
        Number(finalEditPositiveContract.expected_shots || 0) === expected &&
        Number(finalEditPositiveContract.expected_duration_seconds || 0) === Number(manifest.total_duration_seconds || 252) &&
        finalEditPositiveContract.structural_result?.decision === "final_edit_structural_passed" &&
        finalEditPositiveContract.structural_result?.final_edit?.ok === true &&
        finalEditPositiveContract.structural_result?.final_concat_binding?.ok === true &&
        finalEditPositiveContract.structural_result?.final_concat_sidecar?.ok === true &&
        finalEditPositiveContract.structural_result?.final_concat_provenance?.ok === true &&
        isSha256(finalEditPositiveContract.structural_result?.final_edit?.sha256) &&
        finalEditPositiveContract.wrong_duration_rejection?.rejected === true &&
        finalEditPositiveContract.wrong_duration_rejection?.structural_result?.decision === "final_edit_structural_blocked" &&
        finalEditPositiveContract.wrong_duration_rejection?.issue === "duration_out_of_tolerance" &&
        finalEditPositiveContract.tampered_provenance_rejection?.rejected === true &&
        finalEditPositiveContract.tampered_provenance_rejection?.structural_result?.decision === "final_edit_structural_blocked" &&
        finalEditPositiveContract.tampered_provenance_rejection?.structural_result?.final_concat_provenance?.ok === false &&
        finalEditPositiveContract.tampered_provenance_rejection?.structural_result?.final_edit?.ok === true &&
        finalEditPositiveContract.production_existed_before === finalEditPositiveContract.production_exists_after &&
        Number(finalEditPositiveContract.problems?.length || 0) === 0,
      `decision ${finalEditPositiveContract.decision || "missing"}; structural ${finalEditPositiveContract.structural_result?.decision || "missing"}; ok ${finalEditPositiveContract.structural_result?.final_edit?.ok ? "yes" : "no"}; concat binding ${finalEditPositiveContract.structural_result?.final_concat_binding?.ok ? "ok" : "missing_or_blocked"}; concat sidecar ${finalEditPositiveContract.structural_result?.final_concat_sidecar?.ok ? "ok" : "missing_or_blocked"}; concat provenance ${finalEditPositiveContract.structural_result?.final_concat_provenance?.ok ? "ok" : "missing_or_blocked"}; sha ${isSha256(finalEditPositiveContract.structural_result?.final_edit?.sha256) ? "yes" : "no"}; wrong-duration rejected ${finalEditPositiveContract.wrong_duration_rejection?.rejected ? "yes" : "no"}; wrong-duration issue ${finalEditPositiveContract.wrong_duration_rejection?.issue || "missing"}; tampered provenance rejected ${finalEditPositiveContract.tampered_provenance_rejection?.rejected ? "yes" : "no"}; production changed ${finalEditPositiveContract.production_existed_before === finalEditPositiveContract.production_exists_after ? "no" : "yes"}; problems ${finalEditPositiveContract.problems?.length || 0}.`,
      rel(finalEditPositiveContractPath),
    ),
    check(
      "final_edit_structural_passed",
      "Final edit mp4 exists and passes ffprobe structural QA",
      finalEditStructural.decision === "final_edit_structural_passed" &&
        finalEdit.exists === true &&
        finalEdit.ok === true &&
        finalOutputExists &&
        finalEditPathBound &&
        finalEditShaMatches &&
        finalEditConcatBindingOk &&
        finalEditConcatSidecarOk &&
        finalEditConcatProvenanceOk,
      `decision ${finalEditStructural.decision || "missing"}; exists ${finalEdit.exists ? "yes" : "no"}; ok ${finalEdit.ok ? "yes" : "no"}; concat binding ${finalEditConcatBindingOk ? "ok" : "missing_or_blocked"}; concat sidecar ${finalEditConcatSidecarOk ? "ok" : "missing_or_blocked"}; concat provenance ${finalEditConcatProvenanceOk ? "ok" : "missing_or_blocked"}; path ${finalEditPathBound ? "bound" : "mismatch"}; sha ${finalEditShaMatches ? "matched" : "missing_or_mismatch"}; issue ${finalEdit.issue || "none"}.`,
      rel(finalEditStructuralPath),
    ),
    check(
      "positive_contract_isolation_passed",
      "Temporary positive-contract fixtures remain isolated from production expected clips and final edit output",
      positiveContractIsolationGate.decision === "positive_contract_isolation_passed" &&
        Number(positiveContractIsolationGate.expected_shots || 0) === expected &&
        Number(positiveContractIsolationGate.contracts_checked || 0) === 6 &&
        Number(positiveContractIsolationGate.problems?.length || 0) === 0,
      `decision ${positiveContractIsolationGate.decision || "missing"}; contracts ${positiveContractIsolationGate.contracts_checked || 0}/6; production clips ${positiveContractIsolationGate.production_expected_clips_existing || 0}/${expected}; production final ${positiveContractIsolationGate.production_final_output_exists ? "exists" : "absent"}; problems ${positiveContractIsolationGate.problems?.length || 0}.`,
      rel(positiveContractIsolationGatePath),
    ),
    check(
      "production_delivery_truth_gate_consistent",
      "Production delivery truth gate matches real clip/final-edit evidence and prevents fixture/proxy evidence from completing the run",
      realOutputsStructurallyComplete
        ? productionDeliveryTruthGate.decision === "production_delivery_truth_passed" &&
          productionDeliveryTruthGate.can_claim_video_generation_run === true &&
          productionDeliveryTruthGate.highest_truthful_target === "video_generation_run" &&
          productionTruthClipDigestOk &&
          productionTruthClipProbeOk &&
          productionTruthFinalBindingOk
        : /^production_delivery_truth_blocked_/.test(productionDeliveryTruthGate.decision || "") &&
          productionDeliveryTruthGate.can_claim_video_generation_run === false &&
          productionDeliveryTruthGate.highest_truthful_target === "prompt_asset_package" &&
          Number(productionDeliveryTruthGate.real_evidence?.expected_clip_files_existing || 0) < expected &&
          productionTruthClipDigestOk &&
          productionTruthClipProbeOk &&
          productionTruthFinalBindingOk,
      `decision ${productionDeliveryTruthGate.decision || "missing"}; truthful target ${productionDeliveryTruthGate.highest_truthful_target || "missing"}; can claim ${productionDeliveryTruthGate.can_claim_video_generation_run ? "yes" : "no"}; real clips ${productionDeliveryTruthGate.real_evidence?.expected_clip_files_existing || 0}/${expected}; clip digest ${productionTruthClipDigestOk ? "ok" : "missing_or_mismatch"}; clip probe ${productionTruthClipProbeOk ? "ok" : "missing_or_mismatch"}; final ${productionDeliveryTruthGate.real_evidence?.final_output_exists ? "exists" : "absent"}; final binding ${productionTruthFinalBindingOk ? "ok" : "missing_or_mismatch"}; blockers ${productionDeliveryTruthGate.blocking_items?.length || 0}.`,
      rel(productionDeliveryTruthGatePath),
    ),
  ];

  const failed = checks.filter((item) => !item.passed);
  const missingClips = Number(clipStructural.missing_clips ?? expected);
  const decision = failed.length === 0
    ? "video_generation_run_complete"
    : missingClips > 0
      ? "video_generation_run_blocked_clips_pending"
      : "video_generation_run_blocked_downstream_qa";
  const highestCompletedTarget = failed.length === 0 ? "video_generation_run" : "prompt_asset_package";
  const report = {
    date,
    package_id: manifest.package_id,
    target: "video_generation_run",
    decision,
    highest_completed_target: highestCompletedTarget,
    expected_shots: expected,
    final_output: finalOutputRel,
    direct_expected_clip_probe: {
      playable_clips: directlyPlayableClips,
      expected_clips: expected,
      rows: currentExpectedClipProbeRows,
    },
    passed_checks: checks.filter((item) => item.passed).length,
    total_checks: checks.length,
    failed_checks: failed.map((item) => item.id),
    checks,
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Video Generation Run Completion Audit",
    "",
    `Date: ${date}`,
    `Target: ${report.target}`,
    `Decision: ${decision}`,
    `Highest completed target: ${highestCompletedTarget}`,
    `Checks: ${report.passed_checks}/${report.total_checks}`,
    `Final output: \`${report.final_output}\``,
    "",
    "## Checks",
    "",
    ...checks.map((item) => `- ${item.passed ? "PASS" : "FAIL"} ${item.id}: ${item.detail}`),
    "",
    "## Failed Checks",
    "",
    failed.length ? failed.map((item) => `- ${item.id}: ${item.label}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  console.log(JSON.stringify({
    decision,
    highest_completed_target: highestCompletedTarget,
    passed_checks: report.passed_checks,
    total_checks: report.total_checks,
    failed_checks: report.failed_checks,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));

  if (decision === "video_generation_run_blocked_downstream_qa") process.exit(1);
}

main();
