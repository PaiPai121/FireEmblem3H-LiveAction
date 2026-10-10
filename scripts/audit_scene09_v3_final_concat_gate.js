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
const manifestPath = path.join(packageDir, "package_manifest.json");
const clipStructuralPath = path.join(reportDir, "scene09_v3_generated_clip_structural_audit_2026-08-01.json");
const motionAssetsPath = path.join(reportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json");
const motionDecisionsPath = path.join(reportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.json");
const revisionQueuePath = path.join(reportDir, "scene09_v3_clip_revision_queue_2026-07-28.json");
const clipProvenanceGatePath = path.join(reportDir, "scene09_v3_clip_provenance_gate_2026-08-01.json");
const motionSelfAuditApplyGatePath = path.join(reportDir, "scene09_v3_motion_self_audit_apply_gate_2026-08-01.json");
const finalConcatInputsContractPath = path.join(packageDir, "final_concat_inputs_contract.json");
const outJson = path.join(reportDir, `scene09_v3_final_concat_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_final_concat_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "final_concat_gate.json");
const packageOutMd = path.join(packageDir, "final_concat_gate.md");

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

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
}

function rel(file) {
  return path.relative(root, file);
}

function abs(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function normalizeClipPath(value) {
  if (!value) return "";
  return rel(abs(value));
}

function clipProvenanceRows(shots) {
  const provenancePath = path.join(packageDir, "generated_clip_provenance.json");
  const provenance = readJson(provenancePath, { version: 1, rows: [] });
  const provenanceRows = Array.isArray(provenance?.rows) ? provenance.rows : [];
  const provenanceByClip = new Map(provenanceRows.map((row) => [normalizeClipPath(row.expected_clip || row.output_clip), row]));
  return shots.map((shot) => {
    const expectedClip = normalizeClipPath(shot.expected_clip);
    const expectedAbs = abs(shot.expected_clip || "");
    const exists = fs.existsSync(expectedAbs);
    const currentSha256 = exists ? sha256File(expectedAbs) : null;
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
          const sourceSha256 = sha256File(source.source);
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

const hardCapturedNoReadableReturn = new Set(["Hubert", "Dorothea", "Bernadetta"]);

function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}

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

function finalConcatInputSnapshot(manifest) {
  const rows = [...(manifest.shots || [])]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((shot) => ({
      order: Number(shot.order),
      shot: shot.shot,
      id: shot.id,
      duration_seconds: Number(shot.duration_seconds || 0),
      expected_clip: String(shot.expected_clip || ""),
    }));
  const orderedClipText = rows
    .map((row) => `${row.order},${row.shot},${row.id},${row.duration_seconds},${row.expected_clip}`)
    .join("\n") + "\n";
  const concatListText = rows
    .map((row) => `file '${path.join(root, row.expected_clip).replace(/'/g, "'\\''")}'`)
    .join("\n") + "\n";
  return {
    rows,
    ordered_clip_signature_sha256: sha256Text(orderedClipText),
    concat_list_preview_sha256: sha256Text(concatListText),
    concat_list_preview: concatListText,
  };
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

function pass(id, label, passed, detail, evidence = null) {
  return { id, label, passed: Boolean(passed), detail, evidence };
}

function main() {
  const manifest = readJson(manifestPath);
  if (!manifest) throw new Error(`Missing package manifest: ${manifestPath}`);
  const clipStructural = readJson(clipStructuralPath, {});
  const motionAssets = readJson(motionAssetsPath, {});
  const motionDecisions = readJson(motionDecisionsPath, {});
  const revisionQueue = readJson(revisionQueuePath, {});
  const clipProvenanceGate = readJson(clipProvenanceGatePath, {});
  const motionSelfAuditApplyGate = readJson(motionSelfAuditApplyGatePath, {});
  const finalConcatInputsContract = readJson(finalConcatInputsContractPath, {});

  const expected = Number(manifest.total_shots || (manifest.shots || []).length || 42);
  const finalOutput = process.env.SCENE09_V3_FINAL_OUTPUT
    ? path.resolve(process.env.SCENE09_V3_FINAL_OUTPUT)
    : path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");
  const finalExists = fs.existsSync(finalOutput);
  const currentFinalConcatInputs = finalConcatInputSnapshot(manifest);
  const finalConcatInputSignaturesOk =
    finalConcatInputsContract.ordered_clip_signature_sha256 === currentFinalConcatInputs.ordered_clip_signature_sha256 &&
    finalConcatInputsContract.concat_list_preview_sha256 === currentFinalConcatInputs.concat_list_preview_sha256 &&
    finalConcatInputsContract.concat_list_preview === currentFinalConcatInputs.concat_list_preview;
  const expectedClipProbeRows = (manifest.shots || []).map((shot) => ({
    order: shot.order,
    shot: shot.shot,
    id: shot.id,
    expected_clip: shot.expected_clip,
    probe: probeVideoFile(abs(shot.expected_clip || "")),
  }));
  const playableExpectedClips = expectedClipProbeRows.filter((row) => row.probe.ok).length;
  const currentClipProvenanceRows = clipProvenanceRows(manifest.shots || []);
  const currentClipProvenanceRowsDigest = sha256Text(`${JSON.stringify(currentClipProvenanceRows)}\n`);
  const clipProvenanceRowsDigestOk =
    Array.isArray(clipProvenanceGate.rows) &&
    clipProvenanceGate.rows.length === expected &&
    JSON.stringify(clipProvenanceGate.rows) === JSON.stringify(currentClipProvenanceRows) &&
    clipProvenanceGate.rows_digest_sha256 === currentClipProvenanceRowsDigest;
  const currentBattleLedgerRows = battleLedgerRows(manifest.shots || []);
  const currentBattleLedgerRowsDigest = sha256Text(`${JSON.stringify(currentBattleLedgerRows)}\n`);
  const currentBattleLedgerStateMachineRows = battleLedgerStateMachineRows(manifest.shots || []);
  const currentBattleLedgerStateMachineRowsDigest = sha256Text(`${JSON.stringify(currentBattleLedgerStateMachineRows)}\n`);
  const motionSelfAuditBattleLedgerDigestOk =
    motionSelfAuditApplyGate.battle_ledger_signature?.rows_digest_ok === true &&
    motionSelfAuditApplyGate.battle_ledger_signature?.current_rows_digest_sha256 === currentBattleLedgerRowsDigest &&
    motionSelfAuditApplyGate.battle_ledger_signature?.rows_digest_sha256 === currentBattleLedgerRowsDigest &&
    Array.isArray(motionSelfAuditApplyGate.battle_ledger_signature?.rows) &&
    JSON.stringify(motionSelfAuditApplyGate.battle_ledger_signature.rows) === JSON.stringify(currentBattleLedgerRows);
  const motionSelfAuditStateMachineDigestOk =
    motionSelfAuditApplyGate.battle_ledger_signature?.state_machine_rows_digest_ok === true &&
    motionSelfAuditApplyGate.battle_ledger_signature?.current_state_machine_rows_digest_sha256 === currentBattleLedgerStateMachineRowsDigest &&
    motionSelfAuditApplyGate.battle_ledger_signature?.state_machine_rows_digest_sha256 === currentBattleLedgerStateMachineRowsDigest &&
    Array.isArray(motionSelfAuditApplyGate.battle_ledger_signature?.state_machine_rows) &&
    JSON.stringify(motionSelfAuditApplyGate.battle_ledger_signature.state_machine_rows) === JSON.stringify(currentBattleLedgerStateMachineRows) &&
    currentBattleLedgerStateMachineRows.every((row) => Number(row.state_machine_problems?.length || 0) === 0);

  const checks = [
    pass(
      "clip_structural_integrity",
      "All expected mp4 clips exist and pass ffprobe/duration structural QA",
      Number(clipStructural.expected_clips) === expected &&
        Number(clipStructural.ready_clips) === expected &&
        Number(clipStructural.missing_clips) === 0 &&
        Number(clipStructural.failed_clips) === 0 &&
        playableExpectedClips === expected,
      `${clipStructural.ready_clips || 0}/${expected} ready, direct ffprobe ${playableExpectedClips}/${expected}, ${clipStructural.missing_clips ?? expected} missing, ${clipStructural.failed_clips || 0} failed`,
      rel(clipStructuralPath),
    ),
    pass(
      "motion_review_frames",
      "Start/mid/end motion review frames are extracted for every real clip",
      Number(motionAssets.expected_clips) === expected &&
        Number(motionAssets.extracted_clips) === expected &&
        Number(motionAssets.missing_clips) === 0 &&
        Number(motionAssets.failed_clips) === 0,
      `${motionAssets.extracted_clips || 0}/${expected} extracted, ${motionAssets.missing_clips ?? expected} missing, ${motionAssets.failed_clips || 0} failed`,
      rel(motionAssetsPath),
    ),
    pass(
      "motion_review_decisions",
      "Every shot has a machine-readable motion_review_passed decision",
      motionDecisions.decision === "motion_review_passed_ready_for_concat" &&
        Number(motionDecisions.summary?.motion_review_passed || 0) === expected,
      `decision ${motionDecisions.decision || "missing"}, passed ${motionDecisions.summary?.motion_review_passed || 0}/${expected}, pending ${motionDecisions.summary?.pending_clip || 0}`,
      rel(motionDecisionsPath),
    ),
    pass(
      "revision_queue_empty",
      "No generation, repair, Codex self-audit, blocked revision, or regeneration action remains",
      Number(revisionQueue.actionable_shots || 0) === 0 &&
        revisionQueue.decision === "clip_revision_queue_clear_ready_for_concat",
      `${revisionQueue.actionable_shots ?? expected} actionable shots, decision ${revisionQueue.decision || "missing"}`,
      rel(revisionQueuePath),
    ),
    pass(
      "clip_provenance_gate",
      "Every existing expected clip has provider-ingest or local-model provenance matching current SHA-256",
      clipProvenanceGate.decision === "clip_provenance_passed_all_expected_clips" &&
        Number(clipProvenanceGate.expected_clips || 0) === expected &&
        Number(clipProvenanceGate.existing_clips || 0) === expected &&
        Number(clipProvenanceGate.provenance_rows || 0) === expected &&
        Number(clipProvenanceGate.provenance_matched_existing_clips || 0) === expected &&
        clipProvenanceRowsDigestOk &&
        Number(clipProvenanceGate.problems?.length || 0) === 0,
      `decision ${clipProvenanceGate.decision || "missing"}, existing ${clipProvenanceGate.existing_clips || 0}/${expected}, provenance rows ${clipProvenanceGate.provenance_rows || 0}/${expected}, matched ${clipProvenanceGate.provenance_matched_existing_clips || 0}/${expected}, rows digest ${clipProvenanceRowsDigestOk ? "ok" : "missing/stale"}, problems ${clipProvenanceGate.problems?.length || 0}`,
      rel(clipProvenanceGatePath),
    ),
    pass(
      "motion_self_audit_apply_gate",
      "Codex motion self-audit decisions were validated and applied through the strict apply gate",
      motionSelfAuditApplyGate.decision === "motion_self_audit_apply_passed" &&
        motionSelfAuditApplyGate.applied === true &&
        Number(motionSelfAuditApplyGate.proposal_rows || 0) === expected &&
        Number(motionSelfAuditApplyGate.summary?.motion_review_passed || 0) === expected &&
        Number(motionSelfAuditApplyGate.summary?.blocked_or_rejected || 0) === 0 &&
        Number(motionSelfAuditApplyGate.evidence_counters?.clip_signature_matched_rows || 0) === expected &&
        Number(motionSelfAuditApplyGate.evidence_counters?.review_frame_signature_matched_rows || 0) === expected &&
        Number(motionSelfAuditApplyGate.evidence_counters?.review_evidence_complete_rows || 0) === expected &&
        Number(motionSelfAuditApplyGate.evidence_counters?.ledger_matched_rows || 0) === expected &&
        Number(motionSelfAuditApplyGate.evidence_counters?.required_checks_complete_rows || 0) === expected &&
        motionSelfAuditBattleLedgerDigestOk &&
        motionSelfAuditStateMachineDigestOk &&
        Number(motionSelfAuditApplyGate.problems?.length || 0) === 0,
      `decision ${motionSelfAuditApplyGate.decision || "missing"}, applied ${motionSelfAuditApplyGate.applied ? "yes" : "no"}, passed ${motionSelfAuditApplyGate.summary?.motion_review_passed || 0}/${expected}, blocked ${motionSelfAuditApplyGate.summary?.blocked_or_rejected || 0}, clip sig ${motionSelfAuditApplyGate.evidence_counters?.clip_signature_matched_rows || 0}/${expected}, frame sig ${motionSelfAuditApplyGate.evidence_counters?.review_frame_signature_matched_rows || 0}/${expected}, evidence ${motionSelfAuditApplyGate.evidence_counters?.review_evidence_complete_rows || 0}/${expected}, ledger ${motionSelfAuditApplyGate.evidence_counters?.ledger_matched_rows || 0}/${expected}, ledger digest ${motionSelfAuditBattleLedgerDigestOk ? "ok" : "missing/stale"}, active-return state ${motionSelfAuditStateMachineDigestOk ? "ok" : "missing/stale"}, checks ${motionSelfAuditApplyGate.evidence_counters?.required_checks_complete_rows || 0}/${expected}, problems ${motionSelfAuditApplyGate.problems?.length || 0}`,
      rel(motionSelfAuditApplyGatePath),
    ),
    pass(
      "final_concat_inputs_contract",
      "Final concat input order, duration sum, and expected clip list are locked before assembly",
      finalConcatInputsContract.decision === "final_concat_inputs_contract_passed" &&
        Number(finalConcatInputsContract.expected_shots || 0) === expected &&
        Number(finalConcatInputsContract.rows_checked || 0) === expected &&
        Number(finalConcatInputsContract.unique_expected_clips || 0) === expected &&
        Number(finalConcatInputsContract.duration_sum_seconds || 0) === Number(manifest.total_duration_seconds || 0) &&
        finalConcatInputSignaturesOk &&
        Number(finalConcatInputsContract.problems?.length || 0) === 0,
      `decision ${finalConcatInputsContract.decision || "missing"}, rows ${finalConcatInputsContract.rows_checked || 0}/${expected}, unique clips ${finalConcatInputsContract.unique_expected_clips || 0}/${expected}, duration ${finalConcatInputsContract.duration_sum_seconds || 0}/${manifest.total_duration_seconds || 0}, signatures ${finalConcatInputSignaturesOk ? "ok" : "mismatch"}, problems ${finalConcatInputsContract.problems?.length || 0}`,
      {
        report: rel(finalConcatInputsContractPath),
        current_ordered_clip_signature_sha256: currentFinalConcatInputs.ordered_clip_signature_sha256,
        current_concat_list_preview_sha256: currentFinalConcatInputs.concat_list_preview_sha256,
      },
    ),
    pass(
      "final_output_not_preclaimed",
      "No final edit is claimed before the concat gate passes",
      !finalExists,
      finalExists ? `final output already exists at ${rel(finalOutput)}` : "final output is absent, as expected before concat",
      rel(finalOutput),
    ),
  ];

  const failed = checks.filter((check) => !check.passed);
  const clipsPending = Number(clipStructural.missing_clips ?? expected) > 0;
  const decision = failed.length === 0
    ? "final_concat_gate_passed_ready_for_project_pipeline_concat"
    : clipsPending
      ? "final_concat_blocked_clips_pending"
      : "final_concat_blocked_motion_or_revision_gate";

  const report = {
    date,
    package_id: manifest.package_id,
    package_manifest: rel(manifestPath),
    expected_shots: expected,
    final_output: rel(finalOutput),
    final_output_exists: finalExists,
    direct_expected_clip_probe: {
      playable_clips: playableExpectedClips,
      expected_clips: expected,
      rows: expectedClipProbeRows,
    },
    current_clip_provenance_gate_signature: {
      rows_digest_sha256: currentClipProvenanceRowsDigest,
      rows: currentClipProvenanceRows,
    },
    current_battle_ledger_signature: {
      rows_digest_sha256: currentBattleLedgerRowsDigest,
      rows: currentBattleLedgerRows,
      state_machine_rows_digest_sha256: currentBattleLedgerStateMachineRowsDigest,
      state_machine_rows: currentBattleLedgerStateMachineRows,
    },
    current_final_concat_input_signatures: {
      ordered_clip_signature_sha256: currentFinalConcatInputs.ordered_clip_signature_sha256,
      concat_list_preview_sha256: currentFinalConcatInputs.concat_list_preview_sha256,
    },
    decision,
    passed_checks: checks.filter((check) => check.passed).length,
    total_checks: checks.length,
    failed_checks: failed.map((check) => check.id),
    checks,
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Final Concat Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Checks: ${report.passed_checks}/${report.total_checks}`,
    `Final output: \`${report.final_output}\``,
    "",
    "## Checks",
    "",
    ...checks.map((check) => `- ${check.passed ? "PASS" : "FAIL"} ${check.id}: ${check.detail}`),
    "",
    "## Failed Checks",
    "",
    failed.length ? failed.map((check) => `- ${check.id}: ${check.label}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  console.log(JSON.stringify({
    decision,
    passed_checks: report.passed_checks,
    total_checks: report.total_checks,
    failed_checks: report.failed_checks,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));

  if (decision === "final_concat_blocked_motion_or_revision_gate") process.exit(1);
}

main();
