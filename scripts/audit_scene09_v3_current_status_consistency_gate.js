#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const currentStatusFile = path.join(packageDir, "CURRENT_STATUS_2026-08-01.md");
const oldStatusFiles = [
  path.join(packageDir, "CURRENT_STATUS_2026-07-31.md"),
  path.join(packageDir, "CURRENT_STATUS_2026-07-30.md"),
];
const outJson = path.join(reportDir, `scene09_v3_current_status_consistency_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_current_status_consistency_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "current_status_consistency_gate.json");
const packageOutMd = path.join(packageDir, "current_status_consistency_gate.md");

function readJson(file, fallback = {}) {
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

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function abs(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
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

function expectedSubmissionLedgerFields(battleState, ledger, visibleNamedOnly = []) {
  const noActive = unique([
    ...(Array.isArray(battleState.inactive_or_removed_after) ? battleState.inactive_or_removed_after : []),
    ...(Array.isArray(battleState.no_active_combat_after) ? battleState.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
  ]);
  return {
    alive_safe_after: groupText(ledger.alive_by_house || battleState.active_by_house),
    visible_but_no_active_combat_after: (() => {
      const active = new Set(flattenGroups(ledger.still_active_or_controlling_objective_by_house || battleState.active_by_house));
      const inactiveVisible = visibleNamedOnly.filter((name) => name && !active.has(name));
      return inactiveVisible.length ? inactiveVisible.join(", ") : "none";
    })(),
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
      sha256: exists ? sha256File(absolute) : null,
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
  return shots.map((shot) => ({
    order: shot.order,
    shot: shot.shot,
    id: shot.id,
    expected_clip: shot.expected_clip,
    probe: probeVideoFile(abs(shot.expected_clip || "")),
  }));
}

function normalizeClipPath(value) {
  if (!value) return "";
  return rel(abs(value));
}

function clipProvenanceRows(shots) {
  const provenance = readJson(path.join(packageDir, "generated_clip_provenance.json"), { version: 1, rows: [] });
  const provenanceRows = Array.isArray(provenance.rows) ? provenance.rows : [];
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

function finalConcatInputSnapshot(shots) {
  const rows = [...shots]
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

function includesAll(text, values, problems, label) {
  for (const value of values) {
    if (!text.includes(value)) problems.push(`${label}: missing required text ${JSON.stringify(value)}`);
  }
}

function rejectsAll(text, values, problems, label) {
  for (const value of values) {
    if (text.includes(value)) problems.push(`${label}: contains stale text ${JSON.stringify(value)}`);
  }
}

function extractNumber(text, pattern) {
  const match = text.match(pattern);
  return match ? Number(match[1]) : null;
}

function isCompletionFixedPointReady(completion) {
  const failed = new Set(completion.failed_checks || []);
  const allowedSelfPending = new Set([
    "current_status_consistency_passed",
    "provider_preflight_consistency_passed",
    "reports_align_with_current_manifest",
    "full_duration_release_gate_passed",
    "all_expected_clips_structural_pass",
    "motion_review_frames_complete",
    "codex_motion_self_audit_passed",
    "revision_queue_empty",
    "final_concat_gate_passed",
    "final_edit_structural_passed",
  ]);
  const passedChecks = Number(completion.passed_checks || 0);
  const onlyKnownClipsPending = [...failed].every((id) => allowedSelfPending.has(id)) &&
    (failed.has("current_status_consistency_passed") || failed.has("reports_align_with_current_manifest") || passedChecks === 23);
  return completion.decision === "video_generation_run_blocked_clips_pending" &&
    Number(completion.total_checks || 0) === 30 &&
    passedChecks >= 20 &&
    passedChecks <= 23 &&
    onlyKnownClipsPending;
}

function projectedCompletionSnapshot(completion) {
  if (isCompletionFixedPointReady(completion)) {
    return {
      decision: "video_generation_run_blocked_clips_pending",
      passed_checks: 23,
      total_checks: 30,
      source_passed_checks: Number(completion.passed_checks || 0),
      fixed_point_projection: Number(completion.passed_checks || 0) !== 23,
    };
  }
  return {
    decision: completion.decision || null,
    passed_checks: completion.passed_checks || null,
    total_checks: completion.total_checks || null,
    source_passed_checks: completion.passed_checks || null,
    fixed_point_projection: false,
  };
}

function main() {
  const statusText = readText(currentStatusFile);
  const problems = [];
  const warnings = [];
  if (!statusText) problems.push(`missing current status file ${rel(currentStatusFile)}`);

  const manifest = readJson(path.join(packageDir, "package_manifest.json"));
  const clipAudit = readJson(path.join(packageDir, "generated_clip_structural_audit.json"));
  const battleLedgerTimeline = readJson(path.join(packageDir, "battle_ledger_timeline.json"));
  const clipProvenanceGate = readJson(path.join(packageDir, "clip_provenance_gate.json"));
  const motionSelfAuditApplyGate = readJson(path.join(packageDir, "motion_self_audit_apply_gate.json"));
  const handoffAudit = readJson(path.join(reportDir, "scene09_v3_handoff_index_audit_2026-08-01.json"));
  const modelIndexAudit = readJson(path.join(reportDir, "scene09_v3_model_submission_index_audit_2026-08-01.json"));
  const providerFreshness = readJson(path.join(packageDir, "provider_submission_freshness_gate.json"));
  const actualDeliverySurface = readJson(path.join(packageDir, "actual_delivery_surface_audit.json"));
  const currentHannemanContract = readJson(path.join(packageDir, "current_hanneman_contract_audit.json"));
  const afterClipReturnResume = readJson(path.join(packageDir, "after_clip_return_resume.json"));
  const submissionContractGate = readJson(path.join(packageDir, "submission_contract_gate.json"));
  const finalConcatPositiveContract = readJson(path.join(packageDir, "final_concat_positive_contract.json"));
  const finalConcatInputsContract = readJson(path.join(packageDir, "final_concat_inputs_contract.json"));
  const finalConcatGate = readJson(path.join(packageDir, "final_concat_gate.json"));
  const finalEditPositiveContract = readJson(path.join(packageDir, "final_edit_positive_contract.json"));
  const positiveContract = readJson(path.join(packageDir, "video_generation_run_positive_contract.json"));
  const positiveContractIsolation = readJson(path.join(packageDir, "positive_contract_isolation_gate.json"));
  const productionDeliveryTruthGate = readJson(path.join(packageDir, "production_delivery_truth_gate.json"));
  const completion = readJson(path.join(packageDir, "video_generation_run_completion_audit.json"));
  const reportFreshness = readJson(path.join(packageDir, "report_freshness_gate.json"));

  const expectedShots = Number(manifest.total_shots || (manifest.shots || []).length || 0);
  const currentExpectedClipFileRows = expectedClipFileRows(manifest.shots || []);
  const currentExpectedClipDigest = sha256Text(`${JSON.stringify(currentExpectedClipFileRows)}\n`);
  const currentExpectedClipProbeRows = expectedClipProbeRows(manifest.shots || []);
  const currentExpectedClipProbeDigest = sha256Text(`${JSON.stringify(currentExpectedClipProbeRows)}\n`);
  const currentPlayableClips = currentExpectedClipProbeRows.filter((row) => row.probe.ok).length;
  const currentClipProvenanceRows = clipProvenanceRows(manifest.shots || []);
  const currentClipProvenanceRowsDigest = sha256Text(`${JSON.stringify(currentClipProvenanceRows)}\n`);
  const currentSubmissionBattleLedgerRows = submissionBattleLedgerRows(manifest.shots || []);
  const currentSubmissionBattleLedgerRowsDigest = sha256Text(`${JSON.stringify(currentSubmissionBattleLedgerRows)}\n`);
  const currentBattleLedgerRows = battleLedgerRows(manifest.shots || []);
  const currentBattleLedgerRowsDigest = sha256Text(`${JSON.stringify(currentBattleLedgerRows)}\n`);
  const currentBattleLedgerStateMachineRows = battleLedgerStateMachineRows(manifest.shots || []);
  const currentBattleLedgerStateMachineRowsDigest = sha256Text(`${JSON.stringify(currentBattleLedgerStateMachineRows)}\n`);
  const currentFinalConcatInputs = finalConcatInputSnapshot(manifest.shots || []);
  if (expectedShots !== 42) problems.push(`package_manifest total shots ${expectedShots} is not 42`);
  if (clipAudit.ready_clips !== undefined && Number(clipAudit.ready_clips || 0) !== 0) {
    problems.push(`generated_clip_structural_audit ready_clips ${clipAudit.ready_clips} is not 0`);
  }
  if (clipAudit.expected_clips !== undefined && Number(clipAudit.expected_clips || 0) !== 42) {
    problems.push(`generated_clip_structural_audit expected_clips ${clipAudit.expected_clips} is not 42`);
  }
  if (!clipAudit.expected_clip_files_digest_sha256 ||
      !Array.isArray(clipAudit.expected_clip_file_rows) ||
      clipAudit.expected_clip_file_rows.length !== 42 ||
      JSON.stringify(clipAudit.expected_clip_file_rows) !== JSON.stringify(currentExpectedClipFileRows) ||
      clipAudit.expected_clip_files_digest_sha256 !== currentExpectedClipDigest) {
    problems.push("generated_clip_structural_audit expected clip file digest does not match current filesystem state");
  }
  if (!clipAudit.expected_clip_video_probe_digest_sha256 ||
      !Array.isArray(clipAudit.expected_clip_video_probe_rows) ||
      clipAudit.expected_clip_video_probe_rows.length !== 42 ||
      JSON.stringify(clipAudit.expected_clip_video_probe_rows) !== JSON.stringify(currentExpectedClipProbeRows) ||
      clipAudit.expected_clip_video_probe_digest_sha256 !== currentExpectedClipProbeDigest ||
      Number(clipAudit.expected_clip_video_probe_playable || 0) !== currentPlayableClips) {
    problems.push("generated_clip_structural_audit expected clip ffprobe digest does not match current filesystem state");
  }
  if (clipProvenanceGate.decision !== "clip_provenance_ready_clips_pending" ||
      Number(clipProvenanceGate.expected_clips || 0) !== 42 ||
      Number(clipProvenanceGate.existing_clips || 0) !== currentPlayableClips ||
      Number(clipProvenanceGate.provenance_matched_existing_clips || 0) !== currentPlayableClips ||
      !Array.isArray(clipProvenanceGate.rows) ||
      clipProvenanceGate.rows.length !== 42 ||
      JSON.stringify(clipProvenanceGate.rows) !== JSON.stringify(currentClipProvenanceRows) ||
      !clipProvenanceGate.rows_digest_sha256 ||
      clipProvenanceGate.rows_digest_sha256 !== currentClipProvenanceRowsDigest ||
      Number(clipProvenanceGate.problems?.length || 0) !== 0) {
    problems.push("clip_provenance_gate does not match current production expected-clip provenance state");
  }
  if (battleLedgerTimeline.decision !== "battle_ledger_timeline_passed" ||
      Number(battleLedgerTimeline.shots || 0) !== 42 ||
      !Array.isArray(battleLedgerTimeline.rows) ||
      battleLedgerTimeline.rows.length !== 42 ||
      JSON.stringify(battleLedgerTimeline.rows) !== JSON.stringify(currentBattleLedgerRows) ||
      battleLedgerTimeline.rows_digest_sha256 !== currentBattleLedgerRowsDigest ||
      !Array.isArray(battleLedgerTimeline.state_machine_rows) ||
      battleLedgerTimeline.state_machine_rows.length !== 42 ||
      JSON.stringify(battleLedgerTimeline.state_machine_rows) !== JSON.stringify(currentBattleLedgerStateMachineRows) ||
      battleLedgerTimeline.state_machine_rows_digest_sha256 !== currentBattleLedgerStateMachineRowsDigest ||
      currentBattleLedgerStateMachineRows.some((row) => Number(row.state_machine_problems?.length || 0) !== 0) ||
      Number(battleLedgerTimeline.problems?.length || 0) !== 0) {
    problems.push("battle_ledger_timeline does not match current package battle-ledger and active-return state-machine state");
  }
  if (motionSelfAuditApplyGate.decision !== "motion_self_audit_apply_blocked_clips_pending" ||
      motionSelfAuditApplyGate.applied !== false ||
      Number(motionSelfAuditApplyGate.proposal_rows || 0) !== 42 ||
      motionSelfAuditApplyGate.battle_ledger_signature?.rows_digest_ok !== true ||
      motionSelfAuditApplyGate.battle_ledger_signature?.rows_digest_sha256 !== currentBattleLedgerRowsDigest ||
      motionSelfAuditApplyGate.battle_ledger_signature?.current_rows_digest_sha256 !== currentBattleLedgerRowsDigest ||
      !Array.isArray(motionSelfAuditApplyGate.battle_ledger_signature?.rows) ||
      JSON.stringify(motionSelfAuditApplyGate.battle_ledger_signature.rows) !== JSON.stringify(currentBattleLedgerRows)) {
    problems.push("motion_self_audit_apply_gate does not match current production clips-pending state");
  }
  if (providerFreshness.decision !== "provider_submission_freshness_passed") {
    problems.push(`provider_submission_freshness_gate decision ${providerFreshness.decision || "missing"} is not provider_submission_freshness_passed`);
  }
  if (actualDeliverySurface.decision !== "actual_delivery_surface_passed") {
    problems.push(`actual_delivery_surface_audit decision ${actualDeliverySurface.decision || "missing"} is not actual_delivery_surface_passed`);
  }
  if (currentHannemanContract.decision !== "current_hanneman_contract_passed" ||
      currentHannemanContract.shot !== "Shot034B" ||
      JSON.stringify(currentHannemanContract.visible_named_only || []) !== JSON.stringify(["Byleth", "Dimitri"]) ||
      Number(currentHannemanContract.problems?.length || 0) !== 0) {
    problems.push("current_hanneman_contract_audit does not prove Shot034B Byleth/Dimitri-only empty faculty objective contract");
  }
  if (submissionContractGate.decision !== "submission_contract_gate_passed" ||
      Number(submissionContractGate.expected_shots || 0) !== 42 ||
      Number(submissionContractGate.rows_checked || 0) !== 42 ||
      Number(submissionContractGate.submission_payload_rows || 0) !== 42 ||
      !Array.isArray(submissionContractGate.submission_battle_ledger_rows) ||
      submissionContractGate.submission_battle_ledger_rows.length !== 42 ||
      JSON.stringify(submissionContractGate.submission_battle_ledger_rows) !== JSON.stringify(currentSubmissionBattleLedgerRows) ||
      submissionContractGate.submission_battle_ledger_rows_digest_sha256 !== currentSubmissionBattleLedgerRowsDigest ||
      Number(submissionContractGate.problems?.length || 0) !== 0) {
    problems.push("submission_contract_gate does not match current payload/metadata/package battle-ledger state");
  }
  if (finalConcatPositiveContract.decision !== "final_concat_positive_contract_passed" ||
      Number(finalConcatPositiveContract.direct_expected_clip_probe?.playable_clips || 0) !== 42 ||
      Number(finalConcatPositiveContract.direct_expected_clip_probe?.expected_clips || 0) !== 42 ||
      finalConcatPositiveContract.tampered_input_contract_rejection?.rejected !== true ||
      finalConcatPositiveContract.tampered_input_contract_rejection?.gate_result?.decision !== "final_concat_blocked_motion_or_revision_gate" ||
      !(finalConcatPositiveContract.tampered_input_contract_rejection?.failed_checks || []).includes("final_concat_inputs_contract") ||
      !(finalConcatPositiveContract.tampered_input_contract_rejection?.gate_result?.failed_checks || []).includes("final_concat_inputs_contract") ||
      Number(finalConcatPositiveContract.tampered_input_contract_rejection?.gate_result?.direct_expected_clip_probe?.playable_clips || 0) !== 42 ||
      Number(finalConcatPositiveContract.tampered_input_contract_rejection?.gate_result?.direct_expected_clip_probe?.expected_clips || 0) !== 42 ||
      !String((finalConcatPositiveContract.gate_result?.checks || []).find((check) => check.id === "clip_provenance_gate")?.detail || "").includes("rows digest ok") ||
      finalConcatPositiveContract.tampered_provenance_digest_rejection?.rejected !== true ||
      finalConcatPositiveContract.tampered_provenance_digest_rejection?.gate_result?.decision !== "final_concat_blocked_motion_or_revision_gate" ||
      !(finalConcatPositiveContract.tampered_provenance_digest_rejection?.failed_checks || []).includes("clip_provenance_gate") ||
      !(finalConcatPositiveContract.tampered_provenance_digest_rejection?.gate_result?.failed_checks || []).includes("clip_provenance_gate") ||
      Number(finalConcatPositiveContract.tampered_provenance_digest_rejection?.gate_result?.direct_expected_clip_probe?.playable_clips || 0) !== 42 ||
      Number(finalConcatPositiveContract.tampered_provenance_digest_rejection?.gate_result?.direct_expected_clip_probe?.expected_clips || 0) !== 42) {
    problems.push("final_concat_positive_contract does not prove direct ffprobe playback, clip provenance rows digest proof, tampered input rejection, and tampered provenance digest rejection for 42/42 temporary expected clips");
  }
  if (Number(finalConcatGate.direct_expected_clip_probe?.playable_clips || 0) !== currentPlayableClips ||
      Number(finalConcatGate.direct_expected_clip_probe?.expected_clips || 0) !== 42) {
    problems.push("final_concat_gate direct expected-clip probe does not match current production filesystem state");
  }
  if (finalConcatGate.current_clip_provenance_gate_signature?.rows_digest_sha256 !== currentClipProvenanceRowsDigest ||
      !Array.isArray(finalConcatGate.current_clip_provenance_gate_signature?.rows) ||
      JSON.stringify(finalConcatGate.current_clip_provenance_gate_signature.rows) !== JSON.stringify(currentClipProvenanceRows)) {
    problems.push("final_concat_gate clip provenance signature does not match current production filesystem/provenance state");
  }
  if (finalConcatGate.current_battle_ledger_signature?.rows_digest_sha256 !== currentBattleLedgerRowsDigest ||
      !Array.isArray(finalConcatGate.current_battle_ledger_signature?.rows) ||
      JSON.stringify(finalConcatGate.current_battle_ledger_signature.rows) !== JSON.stringify(currentBattleLedgerRows) ||
      finalConcatGate.current_battle_ledger_signature?.state_machine_rows_digest_sha256 !== currentBattleLedgerStateMachineRowsDigest ||
      !Array.isArray(finalConcatGate.current_battle_ledger_signature?.state_machine_rows) ||
      JSON.stringify(finalConcatGate.current_battle_ledger_signature.state_machine_rows) !== JSON.stringify(currentBattleLedgerStateMachineRows) ||
      currentBattleLedgerStateMachineRows.some((row) => Number(row.state_machine_problems?.length || 0) !== 0)) {
    problems.push("final_concat_gate battle ledger signature does not match current production package battle-ledger and active-return state-machine state");
  }
  if (finalConcatInputsContract.decision !== "final_concat_inputs_contract_passed" ||
      Number(finalConcatInputsContract.expected_shots || 0) !== 42 ||
      Number(finalConcatInputsContract.rows_checked || 0) !== 42 ||
      Number(finalConcatInputsContract.unique_expected_clips || 0) !== 42 ||
      Number(finalConcatInputsContract.duration_sum_seconds || 0) !== Number(manifest.total_duration_seconds || 0) ||
      finalConcatInputsContract.ordered_clip_signature_sha256 !== currentFinalConcatInputs.ordered_clip_signature_sha256 ||
      finalConcatInputsContract.concat_list_preview_sha256 !== currentFinalConcatInputs.concat_list_preview_sha256 ||
      finalConcatInputsContract.concat_list_preview !== currentFinalConcatInputs.concat_list_preview ||
      Number(finalConcatInputsContract.problems?.length || 0) !== 0) {
    problems.push("final_concat_inputs_contract does not match recomputed current package manifest concat input signatures");
  }
  if (finalEditPositiveContract.decision !== "final_edit_positive_contract_passed" ||
      finalEditPositiveContract.structural_result?.final_concat_binding?.ok !== true ||
      finalEditPositiveContract.structural_result?.final_concat_sidecar?.ok !== true ||
      finalEditPositiveContract.structural_result?.final_concat_provenance?.ok !== true ||
      finalEditPositiveContract.wrong_duration_rejection?.structural_result?.final_concat_binding?.ok !== true ||
      finalEditPositiveContract.wrong_duration_rejection?.structural_result?.final_concat_sidecar?.ok !== true ||
      finalEditPositiveContract.wrong_duration_rejection?.structural_result?.final_concat_provenance?.ok !== true ||
      finalEditPositiveContract.wrong_duration_rejection?.rejected !== true ||
      finalEditPositiveContract.wrong_duration_rejection?.issue !== "duration_out_of_tolerance" ||
      finalEditPositiveContract.tampered_provenance_rejection?.rejected !== true ||
      finalEditPositiveContract.tampered_provenance_rejection?.structural_result?.decision !== "final_edit_structural_blocked" ||
      finalEditPositiveContract.tampered_provenance_rejection?.structural_result?.final_edit?.ok !== true ||
      finalEditPositiveContract.tampered_provenance_rejection?.structural_result?.final_concat_provenance?.ok !== false) {
    problems.push("final_edit_positive_contract does not prove final concat binding/sidecar/provenance, wrong-duration rejection, and tampered-provenance rejection");
  }
  if (positiveContract.decision !== "video_generation_run_positive_contract_passed") {
    problems.push(`video_generation_run_positive_contract decision ${positiveContract.decision || "missing"} is not video_generation_run_positive_contract_passed`);
  }
  if (Number(positiveContract.completion_result?.direct_expected_clip_probe?.playable_clips || 0) !== 42 ||
      Number(positiveContract.completion_result?.direct_expected_clip_probe?.expected_clips || 0) !== 42) {
    problems.push("video_generation_run_positive_contract does not prove direct ffprobe playback for 42/42 temporary expected clips");
  }
  const positiveCompletionChecks = new Map((positiveContract.completion_result?.checks || []).map((item) => [item.id, item]));
  if (!String(positiveCompletionChecks.get("all_expected_clips_structural_pass")?.detail || "").includes("file digest ok")) {
    problems.push("video_generation_run_positive_contract structural clip check lacks file digest proof");
  }
  if (!String(positiveCompletionChecks.get("all_expected_clips_structural_pass")?.detail || "").includes("probe digest ok")) {
    problems.push("video_generation_run_positive_contract structural clip check lacks ffprobe digest proof");
  }
  if (!String(positiveCompletionChecks.get("final_concat_positive_contract_passed")?.detail || "").includes("checks 8/8")) {
    problems.push("video_generation_run_positive_contract does not prove final_concat_positive_contract at 8/8");
  }
  if (!String(positiveCompletionChecks.get("final_concat_positive_contract_passed")?.detail || "").includes("direct ffprobe 42/42")) {
    problems.push("video_generation_run_positive_contract does not prove final_concat_positive_contract direct ffprobe 42/42");
  }
  if (!String(positiveCompletionChecks.get("final_concat_positive_contract_passed")?.detail || "").includes("tampered input rejected yes")) {
    problems.push("video_generation_run_positive_contract does not prove final_concat_positive_contract tampered-input rejection");
  }
  if (!String(positiveCompletionChecks.get("final_concat_gate_passed")?.detail || "").includes("checks 8/8")) {
    problems.push("video_generation_run_positive_contract does not prove final_concat_gate at 8/8");
  }
  if (!String(positiveCompletionChecks.get("clip_provenance_gate_passed")?.detail || "").includes("rows digest ok")) {
    problems.push("video_generation_run_positive_contract clip_provenance_gate lacks rows digest proof");
  }
  if (!String(positiveCompletionChecks.get("submission_contract_gate_passed")?.detail || "").includes("submission ledger digest ok")) {
    problems.push("video_generation_run_positive_contract submission_contract_gate lacks submission ledger digest proof");
  }
  const applyPositiveDetail = String(positiveCompletionChecks.get("motion_self_audit_apply_positive_contract_passed")?.detail || "");
  for (const required of ["clip sig 42/42", "frame sig 42/42", "evidence 42/42", "ledger 42/42", "checks 42/42"]) {
    if (!applyPositiveDetail.includes(required)) {
      problems.push(`video_generation_run_positive_contract motion apply positive contract lacks ${required}`);
    }
  }
  if (!applyPositiveDetail.includes("ledger digest ok")) {
    problems.push("video_generation_run_positive_contract motion apply positive contract lacks ledger digest proof");
  }
  if (!applyPositiveDetail.includes("active-return state ok")) {
    problems.push("video_generation_run_positive_contract motion apply positive contract lacks active-return state-machine proof");
  }
  if (!applyPositiveDetail.includes("stale ledger rejected yes")) {
    problems.push("video_generation_run_positive_contract motion apply positive contract lacks stale ledger rejection proof");
  }
  if (!applyPositiveDetail.includes("stale active-return rejected yes")) {
    problems.push("video_generation_run_positive_contract motion apply positive contract lacks stale active-return state-machine rejection proof");
  }
  if (!String(positiveCompletionChecks.get("final_edit_positive_contract_passed")?.detail || "").includes("sha yes")) {
    problems.push("video_generation_run_positive_contract final_edit_positive_contract lacks SHA proof");
  }
  if (!String(positiveCompletionChecks.get("final_edit_positive_contract_passed")?.detail || "").includes("concat binding ok")) {
    problems.push("video_generation_run_positive_contract final_edit_positive_contract lacks final concat binding proof");
  }
  if (!String(positiveCompletionChecks.get("final_edit_positive_contract_passed")?.detail || "").includes("concat sidecar ok")) {
    problems.push("video_generation_run_positive_contract final_edit_positive_contract lacks final concat sidecar proof");
  }
  if (!String(positiveCompletionChecks.get("final_edit_positive_contract_passed")?.detail || "").includes("concat provenance ok")) {
    problems.push("video_generation_run_positive_contract final_edit_positive_contract lacks final concat provenance proof");
  }
  if (!String(positiveCompletionChecks.get("final_edit_positive_contract_passed")?.detail || "").includes("wrong-duration rejected yes")) {
    problems.push("video_generation_run_positive_contract final_edit_positive_contract lacks wrong-duration rejection proof");
  }
  if (!String(positiveCompletionChecks.get("final_edit_positive_contract_passed")?.detail || "").includes("tampered provenance rejected yes")) {
    problems.push("video_generation_run_positive_contract final_edit_positive_contract lacks tampered provenance rejection proof");
  }
  if (!String(positiveCompletionChecks.get("final_edit_structural_passed")?.detail || "").includes("sha matched")) {
    problems.push("video_generation_run_positive_contract final_edit_structural check lacks matched SHA proof");
  }
  if (!String(positiveCompletionChecks.get("final_edit_structural_passed")?.detail || "").includes("concat binding ok")) {
    problems.push("video_generation_run_positive_contract final_edit_structural check lacks final concat binding proof");
  }
  if (!String(positiveCompletionChecks.get("final_edit_structural_passed")?.detail || "").includes("concat sidecar ok")) {
    problems.push("video_generation_run_positive_contract final_edit_structural check lacks final concat sidecar proof");
  }
  if (!String(positiveCompletionChecks.get("final_edit_structural_passed")?.detail || "").includes("concat provenance ok")) {
    problems.push("video_generation_run_positive_contract final_edit_structural check lacks final concat provenance proof");
  }
  if (!String(positiveCompletionChecks.get("production_delivery_truth_gate_consistent")?.detail || "").includes("final binding ok")) {
    problems.push("video_generation_run_positive_contract production truth gate lacks final binding proof");
  }
  if (!String(positiveCompletionChecks.get("production_delivery_truth_gate_consistent")?.detail || "").includes("clip digest ok")) {
    problems.push("video_generation_run_positive_contract production truth gate lacks expected-clip digest proof");
  }
  if (!String(positiveCompletionChecks.get("production_delivery_truth_gate_consistent")?.detail || "").includes("clip probe ok")) {
    problems.push("video_generation_run_positive_contract production truth gate lacks expected-clip ffprobe proof");
  }
  const staleConcatFailed = new Set(positiveContract.stale_concat_7_of_7_rejection?.completion_result?.failed_checks || []);
  if (positiveContract.stale_concat_7_of_7_rejection?.rejected !== true) {
    problems.push("video_generation_run_positive_contract does not reject stale final concat 7/7 evidence");
  }
  if (!staleConcatFailed.has("final_concat_positive_contract_passed") ||
      !staleConcatFailed.has("final_concat_gate_passed")) {
    problems.push("video_generation_run_positive_contract stale final concat 7/7 rejection does not fail both concat completion checks");
  }
  const staleStructuralFailed = new Set(positiveContract.stale_structural_digest_rejection?.completion_result?.failed_checks || []);
  if (positiveContract.stale_structural_digest_rejection?.rejected !== true) {
    problems.push("video_generation_run_positive_contract does not reject stale structural clip digest evidence");
  }
  if (!staleStructuralFailed.has("all_expected_clips_structural_pass")) {
    problems.push("video_generation_run_positive_contract stale structural clip digest rejection does not fail all_expected_clips_structural_pass");
  }
  const staleProvenanceFailed = new Set(positiveContract.stale_provenance_digest_rejection?.completion_result?.failed_checks || []);
  if (positiveContract.stale_provenance_digest_rejection?.rejected !== true) {
    problems.push("video_generation_run_positive_contract does not reject stale clip provenance digest evidence");
  }
  if (!staleProvenanceFailed.has("clip_provenance_gate_passed")) {
    problems.push("video_generation_run_positive_contract stale clip provenance digest rejection does not fail clip_provenance_gate_passed");
  }
  const staleBattleLedgerFailed = new Set(positiveContract.stale_battle_ledger_digest_rejection?.completion_result?.failed_checks || []);
  if (positiveContract.stale_battle_ledger_digest_rejection?.rejected !== true) {
    problems.push("video_generation_run_positive_contract does not reject stale battle ledger digest evidence");
  }
  if (!staleBattleLedgerFailed.has("motion_self_audit_apply_gate_passed")) {
    problems.push("video_generation_run_positive_contract stale battle ledger digest rejection does not fail motion_self_audit_apply_gate_passed");
  }
  const staleStateMachineFailed = new Set(positiveContract.stale_active_return_state_machine_digest_rejection?.completion_result?.failed_checks || []);
  if (positiveContract.stale_active_return_state_machine_digest_rejection?.rejected !== true) {
    problems.push("video_generation_run_positive_contract does not reject stale active-return state-machine digest evidence");
  }
  if (!staleStateMachineFailed.has("motion_self_audit_apply_gate_passed")) {
    problems.push("video_generation_run_positive_contract stale active-return state-machine digest rejection does not fail motion_self_audit_apply_gate_passed");
  }
  const staleSubmissionLedgerFailed = new Set(positiveContract.stale_submission_ledger_digest_rejection?.completion_result?.failed_checks || []);
  if (positiveContract.stale_submission_ledger_digest_rejection?.rejected !== true) {
    problems.push("video_generation_run_positive_contract does not reject stale submission ledger digest evidence");
  }
  if (!staleSubmissionLedgerFailed.has("submission_contract_gate_passed")) {
    problems.push("video_generation_run_positive_contract stale submission ledger digest rejection does not fail submission_contract_gate_passed");
  }
  if (positiveContractIsolation.decision !== "positive_contract_isolation_passed") {
    problems.push(`positive_contract_isolation_gate decision ${positiveContractIsolation.decision || "missing"} is not positive_contract_isolation_passed`);
  }
  if (positiveContractIsolation.production_completion_decision !== "video_generation_run_blocked_clips_pending" ||
      positiveContractIsolation.production_completion_highest_target !== "prompt_asset_package") {
    problems.push("positive_contract_isolation_gate does not prove production completion remains blocked at prompt_asset_package");
  }
  if (positiveContractIsolation.production_truth_gate_can_claim_video_generation_run !== false ||
      positiveContractIsolation.production_truth_gate_highest_target !== "prompt_asset_package") {
    problems.push("positive_contract_isolation_gate does not prove production truth gate remains non-claimable at prompt_asset_package");
  }
  if (productionDeliveryTruthGate.decision !== "production_delivery_truth_blocked_clips_pending") {
    problems.push(`production_delivery_truth_gate decision ${productionDeliveryTruthGate.decision || "missing"} is not production_delivery_truth_blocked_clips_pending`);
  }
  if (productionDeliveryTruthGate.highest_truthful_target !== "prompt_asset_package") {
    problems.push(`production_delivery_truth_gate highest truthful target ${productionDeliveryTruthGate.highest_truthful_target || "missing"} is not prompt_asset_package`);
  }
  if (productionDeliveryTruthGate.can_claim_video_generation_run !== false) {
    problems.push("production_delivery_truth_gate can_claim_video_generation_run is not false");
  }
  if (!productionDeliveryTruthGate.real_evidence?.expected_clip_files_digest_sha256 ||
      !Array.isArray(productionDeliveryTruthGate.real_evidence?.expected_clip_file_rows) ||
      productionDeliveryTruthGate.real_evidence.expected_clip_file_rows.length !== 42) {
    problems.push("production_delivery_truth_gate missing 42-row expected clip file digest evidence");
  }
  if (Array.isArray(productionDeliveryTruthGate.real_evidence?.expected_clip_file_rows) &&
      JSON.stringify(productionDeliveryTruthGate.real_evidence.expected_clip_file_rows) !== JSON.stringify(currentExpectedClipFileRows)) {
    problems.push("production_delivery_truth_gate expected clip file rows do not match current filesystem state");
  }
  if (productionDeliveryTruthGate.real_evidence?.expected_clip_files_digest_sha256 &&
      productionDeliveryTruthGate.real_evidence.expected_clip_files_digest_sha256 !== currentExpectedClipDigest) {
    problems.push("production_delivery_truth_gate expected clip digest does not match current filesystem state");
  }
  if (!productionDeliveryTruthGate.real_evidence?.expected_clip_video_probe_digest_sha256 ||
      !Array.isArray(productionDeliveryTruthGate.real_evidence?.expected_clip_video_probe_rows) ||
      productionDeliveryTruthGate.real_evidence.expected_clip_video_probe_rows.length !== 42) {
    problems.push("production_delivery_truth_gate missing 42-row expected clip ffprobe evidence");
  }
  if (Array.isArray(productionDeliveryTruthGate.real_evidence?.expected_clip_video_probe_rows) &&
      JSON.stringify(productionDeliveryTruthGate.real_evidence.expected_clip_video_probe_rows) !== JSON.stringify(currentExpectedClipProbeRows)) {
    problems.push("production_delivery_truth_gate expected clip ffprobe rows do not match current filesystem state");
  }
  if (productionDeliveryTruthGate.real_evidence?.expected_clip_video_probe_digest_sha256 &&
      productionDeliveryTruthGate.real_evidence.expected_clip_video_probe_digest_sha256 !== currentExpectedClipProbeDigest) {
    problems.push("production_delivery_truth_gate expected clip ffprobe digest does not match current filesystem state");
  }
  if (Number(productionDeliveryTruthGate.real_evidence?.expected_clip_video_probe_required || 0) !== 42 ||
      Number(productionDeliveryTruthGate.real_evidence?.expected_clip_video_probe_playable || 0) !== currentPlayableClips) {
    problems.push("production_delivery_truth_gate expected clip ffprobe playable count does not match current filesystem state");
  }
  const projectedCompletion = projectedCompletionSnapshot(completion);
  if (completion.decision !== "video_generation_run_blocked_clips_pending") {
    problems.push(`completion decision ${completion.decision || "missing"} is not video_generation_run_blocked_clips_pending`);
  }
  if (!isCompletionFixedPointReady(completion)) {
    problems.push(`completion checks ${completion.passed_checks || 0}/${completion.total_checks || 0} are not a valid clips-pending fixed point`);
  }
  const embeddedCompletion = afterClipReturnResume.snapshot?.video_generation_run_completion || {};
  const projectedEmbeddedCompletion = projectedCompletionSnapshot(embeddedCompletion);
  for (const key of ["decision", "total_checks"]) {
    const embeddedValue = String(embeddedCompletion[key] ?? "");
    const currentValue = String(completion[key] ?? "");
    const projectedValue = String(projectedCompletion[key] ?? "");
    const embeddedProjectedValue = String(projectedEmbeddedCompletion[key] ?? "");
    if (embeddedValue !== currentValue && embeddedValue !== projectedValue && embeddedProjectedValue !== projectedValue) {
      problems.push(`after_clip_return_resume embedded completion ${key} ${embeddedCompletion[key] ?? "missing"} matches neither current ${completion[key] ?? "missing"} nor projected ${projectedCompletion[key] ?? "missing"}`);
    }
  }
  const embeddedPassed = Number(embeddedCompletion.passed_checks || 0);
  const currentPassed = Number(completion.passed_checks || 0);
  const projectedPassed = Number(projectedCompletion.passed_checks || 0);
  if (embeddedCompletion.decision !== "video_generation_run_blocked_clips_pending" ||
      embeddedPassed > Math.max(currentPassed, projectedPassed) ||
      embeddedPassed < Math.max(0, Math.min(currentPassed, projectedPassed) - 3)) {
    problems.push(`after_clip_return_resume embedded completion passed_checks ${embeddedCompletion.passed_checks ?? "missing"} is not a plausible clips-pending wrapper snapshot`);
  }

  const finalOutput = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");
  if (fs.existsSync(finalOutput)) problems.push(`production final edit unexpectedly exists at ${rel(finalOutput)}`);

  includesAll(statusText, [
    "Checked on: 2026-08-01",
    "Decision: `monitor_handoff_ready_clips_pending`",
    "Highest completed target: `prompt_asset_package`",
    "These files are designed for direct `file://` access. No local web server is required.",
    "`video_generation_package`: not complete; 42/42 shots remain `monitor_required`.",
    "`provider_submission_freshness_passed`: passed",
    "`actual_delivery_surface_passed`: passed",
    "`current_hanneman_contract_passed`: passed",
    "`model_submission_batches_ready_for_provider_upload`: passed, 7 batches / 42 rows",
    "full-duration submission as `prepared_locked_probe_release_pending`",
    "every batch runbook states that full-duration generation is locked until 42/42 returned motion probes pass signed Codex review",
    "every bundle checklist, batch JSONL, CSV, runbook, and local manifest now preserves source battle-ledger state, including `alive_safe_after`, active/controlling, limited, defeated/removed, captured/objective-defeated, stood-down/post-battle, must-not-return-active, changed-this-shot, and no-active-combat continuity",
    "a standalone uploaded zip still carries the full post-shot ledger",
    "battle ledger timeline now records a 42-row digest, and apply/final-concat/freshness/status gates recompute that digest from the current package before accepting motion or final assembly evidence",
    "battle ledger timeline now also records a 42-row active-return state-machine digest: previous must-not-return characters cannot become active again, captured Hubert/Dorothea/Bernadetta cannot reappear readable after capture, and visible retired characters must carry non-active/post-battle context without negative-prompt readable-return conflicts",
    "submission contract gate now records a 42-row submission-facing battle ledger digest, and freshness/status/completion gates recompute it from current payload, metadata, and package state before accepting model submission evidence",
    "executable prompt semantics now also rejects visible no-active characters with active-combat executable language or negative-prompt readable-return conflicts",
    "`audio_timing_prompt_contract_passed`: passed, 42/42 model prompts",
    "voiced dialogue cues now require final speaker-tagged lines rather than optional/exchange/cue placeholders",
    "`motion_probe_package_ready`: passed, 42/42 three-second probes",
    "Full-duration generation remains blocked until returned probe clips pass identity, wardrobe, training-weapon, no-extra-people, no-subtitles, teacher-separation, and post-shot ledger QA",
    "`motion_probe_provider_bundles_ready`: passed, 7 zipped probe batches / 42 rows",
    "Probe provider bundles are self-contained and carry bundle-local probe prompts, negative prompts, metadata, start/key/end frames, expected probe downloads, and probe return contracts",
    "`motion_probe_return_intake_ready`: passed, 7 probe return folders / 42 expected probe rows",
    "Motion probe return intake accepts only `_probe.mp4` returns, maps them to `motion_probes/`, and requires ffprobe-verified mp4 before any full-duration generation release",
    "`motion_probe_clip_structural_audit`: `motion_probe_clips_pending`, 0/42 playable probe clips, 42 missing probe clips",
    "Motion probe structural audit now records a 42-row expected-probe file digest and ffprobe digest, and freshness/status gates recompute both from the current filesystem before accepting returned-probe evidence",
    "`motion_probe_return_roundtrip_passed`: passed, exact probe filename, custom_id prefix, nested return root, bare shot-name rejection, full-duration-name rejection, invalid mp4 rejection, and unsupported-format rejection",
    "`motion_probe_review_packet_audit`: `motion_probe_review_packet_ready_clips_pending`; 42/42 Codex-only probe review rows/checklists are structurally ready",
    "full-duration generation stays blocked until each returned probe has signed clip/frame evidence and Codex-reviewed pass checks",
    "`motion_probe_review_apply_gate`: `motion_probe_review_apply_blocked_clips_pending`; 42 proposal rows are present, but 0/42 probe clips and 0/42 probe review frame sets exist",
    "No full-duration release manifest is written until the probe apply gate passes 42/42 Codex-reviewed rows",
    "`motion_probe_review_apply_positive_contract`: `motion_probe_review_apply_positive_contract_passed`",
    "The negative cases reject stale probe clip signatures, stale review-frame signatures, user/operator reviewer identity, and `approve_full_duration=true` on a blocked row",
    "`full_duration_release_gate`: `full_duration_release_blocked_probe_review_pending`",
    "Full-duration provider submission is locked until 42/42 returned motion probes pass Codex review and a production `motion_probe_full_duration_release.json` exists",
    "Shot034B visible roster is `Byleth, Dimitri`",
    "both faculty objective markers stay empty, and Hanneman/Manuela are absent/offscreen/silent/unpaired",
    "`after_clip_return_resume`: `after_clip_return_clips_pending`",
    "0/42 real clips, 0/42 motion frames",
    "`video_generation_run_positive_contract`: `video_generation_run_positive_contract_passed`",
    "The temporary run-complete fixture now proves final concat at 8/8 and requires final-edit SHA/path binding",
    "The run-complete positive fixture now uses 42 temporary real mp4 expected clips and proves direct ffprobe playback for 42/42 clips",
    "The run-complete positive fixture now requires the structural clip audit to bind 42/42 temporary expected clips with current file digest and ffprobe digest evidence",
    "final concat positive contract now proves direct ffprobe playback for 42/42 temporary expected clips",
    "final concat positive contract now proves a tampered final concat input contract is rejected even when 42/42 temporary expected clips direct-ffprobe successfully",
    "final concat positive contract now proves the final concat gate requires a 42-row clip provenance digest and rejects stale provenance digest evidence even when 42/42 temporary expected clips direct-ffprobe successfully",
    "future run-complete claims require `clip_provenance_gate` to prove 42/42 provenance rows and 42/42 current-SHA matched expected clips once real clips exist",
    "clip provenance gate now records a 42-row expected-clip/provenance digest, and freshness/status gates recompute that digest from the current filesystem and `generated_clip_provenance.json` before accepting the report",
    "The run-complete positive fixture now requires `clip_provenance_gate_passed` to prove its 42-row expected-clip/provenance digest matches the temporary package provenance manifest",
    "motion self-audit apply positive contract now proves 42/42 clip signatures, 42/42 review-frame signatures, 42/42 complete review-evidence rows, 42/42 ledger matches, and 42/42 required-check rows before a motion pass can count",
    "motion self-audit apply positive contract now proves a stale battle ledger digest is rejected before production motion approvals can count",
    "motion self-audit apply positive contract now proves a stale active-return state-machine digest is rejected before production motion approvals can count",
    "It also verifies stale final concat 7/7 evidence is rejected by both concat completion checks",
    "It also verifies stale structural clip file/ffprobe digest evidence is rejected by `all_expected_clips_structural_pass`",
    "It also verifies stale clip provenance digest evidence is rejected by `clip_provenance_gate_passed`",
    "It also verifies stale battle ledger digest evidence is rejected by `motion_self_audit_apply_gate_passed`",
    "It also verifies stale active-return state-machine digest evidence is rejected by `motion_self_audit_apply_gate_passed`",
    "It also verifies stale submission ledger digest evidence is rejected by `submission_contract_gate_passed`",
    "`model_cli_template_positive_contract`: `model_cli_template_positive_contract_passed`",
    "Positive-contract isolation now also proves the production completion audit and production truth gate remain blocked at `prompt_asset_package` while real clips/final output are incomplete",
    "`production_delivery_truth_gate`: `production_delivery_truth_blocked_clips_pending`",
    "highest truthful target remains `prompt_asset_package`",
    "positive-contract/proxy evidence is explicitly forbidden from satisfying production completion",
    "truth gate now records a 42-row production expected-clip file digest with per-row exists/size/SHA evidence, and freshness/status gates recompute that digest from the current filesystem before accepting the report",
    "truth gate now records a 42-row production expected-clip ffprobe digest with per-row video-stream evidence, and freshness/status gates recompute that probe digest from the current filesystem before accepting the report",
    "truth gate now requires `final_edit_structural_audit` to point at the production final output path and record the final mp4 SHA-256",
    "truth gate and final edit structural audit now require final concat input signatures and the final concat gate to be bound to the current package manifest before a final mp4 can pass",
    "truth gate and final edit structural audit now require a concat-list sidecar beside the final mp4 that exactly matches the current package manifest concat list",
    "truth gate and final edit structural audit now require a concat provenance sidecar beside the final mp4 that binds the final mp4 SHA-256, concat-list SHA-256, source expected-clip SHA rows, and concat producer",
    "`video_generation_run_completion_audit`: `video_generation_run_blocked_clips_pending`, 23/30 checks passed",
    "generated clip structural audit now records a 42-row expected-clip file digest and ffprobe digest, and freshness/status gates recompute both from the current filesystem before accepting the report",
    "`final_concat_gate`: `final_concat_blocked_clips_pending`, 2/8 checks passed",
    "final concat gate independently direct-ffprobes expected clips and currently records 0/42 playable production clips",
    "No `VIDEO_MODEL_CLI_ARGV_JSON` is configured and none of the 42 expected real `.mp4` clips exist.",
    "7 batch return folders / 42 expected rows / 3 source-file digests checked",
    "The expected clip maps now carry the full post-shot return QA ledger for every row: `Alive / Safe After`, `Active / Controlling After`, `Limited But Not Defeated After`, `Defeated / Removed After`, `Captured / Objective-Defeated After`, `Stood Down / Post-Battle After`, `Must Not Return Active`, `Changed This Shot`, and `No-Active-Combat Line`",
    "the four critical locks for Shot032F Hubert captured by Felix/Ashe, Shot032G Dorothea and Bernadetta captured by Leonie/Claude, Shot034B empty faculty objective with only Byleth/Dimitri readable and Hanneman/Manuela absent/offscreen/silent/unpaired, and Shot034G exhausted Dimitri/Dedue core victory",
    "The intake manifest is bound by SHA-256 to the current package manifest, model-submission batch manifest, and expected-downloads CSV.",
    "`final_concat_inputs_contract`: `final_concat_inputs_contract_passed`; 42/42 final concat input rows are locked in timeline order",
    "42 unique `expected_clip` paths, a 252s duration sum matching the package manifest",
    "`ordered_clip_signature_sha256`, and `concat_list_preview_sha256`",
    "Final concat gate, report freshness, and current-status consistency now recompute final concat input signatures from the current package manifest before accepting the input contract",
    "Final concat gate, report freshness, and current-status consistency now also recompute the 42-row clip provenance digest from the current filesystem and `generated_clip_provenance.json` before accepting final assembly evidence",
    "Final concat gate, report freshness, and current-status consistency now also recompute the 42-row battle ledger digest from the current package manifest and per-shot model prompts before accepting final assembly evidence",
    "every top-level shot card now exposes the post-shot ledger fields",
    "`Alive / Safe After`, `Active / Controlling After`, `Defeated / Removed After`, `Captured / Objective-Defeated After`, `Stood Down / Post-Battle After`, `Must Not Return Active`, and `Changed This Shot`",
    "captured, defeated, stood-down, objective-defeated, and still-active characters are visible immediately after each shot",
    "the provider upload bundles audit, the clip return intake audit, the clip revision queue, the provider-ingest provenance contract, the final concat inputs contract, and the provider return contract",
    "every batch shot card exposes `Alive / Safe After`, `Active / Controlling After`, `Limited But Not Defeated After`, `Defeated / Removed After`, `Captured / Objective-Defeated After`, `Stood Down / Post-Battle After`, `Must Not Return Active`, `Changed This Shot`, and `No-Active-Combat Line`",
    "the actual model-submission surface carries the same post-shot continuity ledger as the top-level handoff viewer",
    "The model batch viewer now also states that full-duration batches are structurally prepared but locked until `full_duration_release_gate` reaches `full_duration_release_passed`",
    "instructs operators to submit motion probes first instead of uploading full-duration batches",
    "`motion_self_audit_packet_audit`: `motion_self_audit_packet_ready`; 42/42 Codex-only motion self-audit rows/checklists are structurally ready.",
    "The Codex review matrix, update template, and README now preserve the full post-shot ledger for each future clip review: `Alive / Safe After`, `Active / Controlling After`, `Limited But Not Defeated After`, `Defeated / Removed After`, `Captured / Objective-Defeated After`, `Stood Down / Post-Battle After`, `Must Not Return Active`, `Changed This Shot`, and `No-Active-Combat Line`",
    "hard checks for Hubert captured by Felix/Ashe, Dorothea and Bernadetta captured by Leonie/Claude, Shot034B empty faculty objective / Hanneman and Manuela absent, and Shot034G exhausted Dimitri/Dedue core",
    "final edit structural audit reaches `final_edit_structural_passed` for a package-duration final edit and records the final mp4 SHA-256",
    "final edit structural audit also requires final concat input signatures and an 8/8 final concat gate bound to the current package manifest before a valid-duration mp4 can pass",
    "final edit structural audit also requires a concat-list sidecar beside the final mp4 that exactly matches the current package manifest concat list",
    "final edit structural audit also requires a concat provenance sidecar beside the final mp4 that binds final mp4 SHA-256, concat-list SHA-256, source expected-clip SHA rows, and concat producer",
    "final edit positive contract now proves a tampered final concat provenance sidecar is rejected even when the final mp4 duration and concat-list sidecar are otherwise valid",
    "final edit positive contract now proves a wrong-duration final mp4 is rejected with `duration_out_of_tolerance`",
    "When it exists, the structural audit records `final_output`, `final_output_absolute`, file size, duration, codec metadata, and final mp4 `sha256`",
  ], problems, "current status");
  includesAll(statusText, [
    "`current_status_consistency_passed`: passed",
    "stale completion, link, and report-count claims are blocked from the current file-access status page",
    "`provider_preflight_consistency_passed`: passed",
    "operator preflight, provider upload manifest, package execution readiness, model target profile, `clip_motion_qa_checklist.csv`, and `clip_revision_queue.csv/json` agree that full-duration provider submission is allowed only after execution assets, actual delivery surface, current-status consistency, submission contract, batch upload, provider bundles, provider submission freshness, full-duration release, and the full post-shot motion ledger contract pass",
    "Operator preflight now requires 42/42 ledger rows, all 9 review fields, 4/4 critical locks, provider upload manifest per-row ledger fields, local `execution_commands.sh` handoff comments, the motion QA checklist, and the revision queue carrying the same `Alive / Safe After`, `Active / Controlling After`, `Limited But Not Defeated After`, `Defeated / Removed After`, `Captured / Objective-Defeated After`, `Stood Down / Post-Battle After`, `Must Not Return Active`, `Changed This Shot`, and `No-Active-Combat Line` state",
    "58 package-local reports align with current manifest",
    "including goal completion matrix, executable prompt semantics audit, audio timing prompt contract, character beat readiness audit, per-frame visual review matrix, full local visual review, EP02 web battle event panel audit, motion probe package audit, motion probe clip structural audit, motion probe provider bundles audit, motion probe submission ready gate, motion probe operator tracker, motion probe operator tracker audit, handoff control reports audit, motion probe return intake audit, motion probe return roundtrip audit, motion probe review packet audit, motion probe review apply gate, motion probe review apply positive contract, full-duration release gate, current Hanneman contract audit, provider upload bundles audit, clip return intake audit, clip revision queue, provider-ingest provenance contract, final concat inputs contract, and the production-delivery truth gate",
    "Each report row now records `checked_against_package_manifest_sha256` and `freshness_basis`",
    "semantic alignment against the current manifest is explicit instead of relying on timestamp-only warnings",
  ], problems, "current status");
  rejectsAll(statusText, [
    "13/20",
    "16/23",
    "17/24",
    "18/25",
    "19/26",
    "23/23",
    "24/24",
    "25/25 checks passed",
    "26/26 checks",
    "20/27 checks",
    "22/29 checks passed",
    "613 links",
    "615 links",
    "26 package-local reports align",
    "27 package-local reports align",
    "28 package-local reports align",
    "29 package-local reports align",
    "30 package-local reports align",
    "34 package-local reports align",
    "35 package-local reports align",
    "37 package-local reports align",
    "38 package-local reports align",
    "39 package-local reports align",
    "40 package-local reports align",
    "41 package-local reports align",
    "42 package-local reports align",
    "43 package-local reports align",
    "44 package-local reports align",
    "45 package-local reports align",
    "46 package-local reports align",
    "47 package-local reports align",
    "48 package-local reports align",
    "49 package-local reports align",
    "50 package-local reports align",
    "51 package-local reports align",
    "52 package-local reports align",
    "53 package-local reports align",
    "54 package-local reports align",
    "55 package-local reports align",
    "56 package-local reports align",
    "57 package-local reports align",
    "`final_concat_gate`: `final_concat_blocked_clips_pending`, 1/7 checks passed",
    "1/7 checks passed",
  ], problems, "current status");

  const statusHandoffLinks = extractNumber(statusText, /handoff_index_file_access_passed`: passed, (\d+) links/);
  const statusGateReportsExist = fs.existsSync(packageOutJson) && fs.existsSync(packageOutMd);
  if (statusHandoffLinks !== null && handoffAudit.links_checked !== undefined && statusHandoffLinks !== Number(handoffAudit.links_checked)) {
    const bootstrapGap = !statusGateReportsExist && statusHandoffLinks === Number(handoffAudit.links_checked) + 2;
    if (bootstrapGap) {
      warnings.push(`handoff audit links ${handoffAudit.links_checked} are two below current status ${statusHandoffLinks}; this is allowed only before current_status_consistency_gate files exist and the handoff index is rebuilt.`);
    } else {
      problems.push(`current status handoff links ${statusHandoffLinks} do not match current handoff audit ${handoffAudit.links_checked}`);
    }
  }
  const statusModelLinks = extractNumber(statusText, /model_submission_index_file_access_passed`: passed, (\d+) links/);
  if (statusModelLinks !== null && modelIndexAudit.links_checked !== undefined && statusModelLinks !== Number(modelIndexAudit.links_checked)) {
    problems.push(`current status model submission links ${statusModelLinks} do not match current model index audit ${modelIndexAudit.links_checked}`);
  }
  const statusReports = extractNumber(statusText, /report_freshness_gate`: `report_freshness_passed_current_manifest`; (\d+) package-local reports/);
  if (statusReports !== 58) problems.push(`current status report count ${statusReports ?? "missing"} is not 58`);
  if (reportFreshness.reports_checked !== undefined && Number(reportFreshness.reports_checked) !== 58) {
    warnings.push(`current report_freshness_gate reports_checked is ${reportFreshness.reports_checked}; rerun report freshness after current_status_consistency_gate if this is a bootstrap run.`);
  }
  if (Array.isArray(reportFreshness.warnings) && reportFreshness.warnings.length) {
    problems.push(`current report_freshness_gate still has ${reportFreshness.warnings.length} warnings`);
  }
  const freshnessRows = Array.isArray(reportFreshness.report_rows) ? reportFreshness.report_rows : [];
  const reportFreshnessBootstrapMissingHanneman = freshnessRows.length === 48 &&
    !freshnessRows.some((row) => row.id === "current_hanneman_contract_audit");
  if (reportFreshnessBootstrapMissingHanneman) {
    warnings.push("current report_freshness_gate is from the 48-row pre-Hanneman bootstrap; rerun report freshness after current_status_consistency_gate.");
  } else if (freshnessRows.length !== 58) {
    problems.push(`current report_freshness_gate report_rows ${freshnessRows.length} does not match 58`);
  }
  if (!freshnessRows.some((row) => row.id === "goal_completion_matrix")) {
    problems.push("report_freshness_gate is missing goal_completion_matrix row");
  }
  if (!freshnessRows.some((row) => row.id === "character_beat_readiness_audit")) {
    problems.push("report_freshness_gate is missing character_beat_readiness_audit row");
  }
  if (!freshnessRows.some((row) => row.id === "motion_probe_submission_ready_gate")) {
    problems.push("report_freshness_gate is missing motion_probe_submission_ready_gate row");
  }
  if (!freshnessRows.some((row) => row.id === "motion_probe_operator_tracker_audit")) {
    problems.push("report_freshness_gate is missing motion_probe_operator_tracker_audit row");
  }
  if (!freshnessRows.some((row) => row.id === "handoff_control_reports_audit")) {
    problems.push("report_freshness_gate is missing handoff_control_reports_audit row");
  }
  if (!freshnessRows.some((row) => row.id === "full_local_visual_review")) {
    problems.push("report_freshness_gate is missing full_local_visual_review row");
  }
  for (const row of freshnessRows) {
    if (!row.checked_against_package_manifest_sha256) {
      problems.push(`report_freshness_gate row ${row.id || row.file || "unknown"} missing checked_against_package_manifest_sha256`);
      break;
    }
    if (!row.freshness_basis) {
      problems.push(`report_freshness_gate row ${row.id || row.file || "unknown"} missing freshness_basis`);
      break;
    }
  }

  for (const file of oldStatusFiles) {
    const text = readText(file);
    if (!text) {
      warnings.push(`old status file missing: ${rel(file)}`);
      continue;
    }
    if (!text.startsWith("> Superseded by `CURRENT_STATUS_2026-08-01.md`.")) {
      problems.push(`${rel(file)} is not visibly marked superseded at the top`);
    }
    if (text.includes("# EP02 Scene09 Current Status") && !text.includes("Historical status retained for audit trail")) {
      problems.push(`${rel(file)} still presents itself as current without historical-status note`);
    }
  }

  const decision = problems.length ? "current_status_consistency_blocked" : "current_status_consistency_passed";
  const report = {
    date,
    package_id: manifest.package_id || "scene09_v3_monitor_handoff_package_2026-07-27",
    package_manifest: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json",
    decision,
    problems,
    warnings,
    current_status: {
      file: rel(currentStatusFile),
      sha256: statusText ? sha256Text(statusText) : null,
    },
    authoritative_evidence: {
      expected_shots: expectedShots,
      clip_audit: {
        decision: clipAudit.decision || null,
        ready_clips: Number(clipAudit.ready_clips || 0),
        missing_clips: Number(clipAudit.missing_clips || 0),
        expected_clips: Number(clipAudit.expected_clips || 0),
      },
      handoff_index: {
        decision: handoffAudit.decision || null,
        links_checked: handoffAudit.links_checked || null,
        shot_cards: handoffAudit.shot_cards || null,
      },
      model_submission_index: {
        decision: modelIndexAudit.decision || null,
        links_checked: modelIndexAudit.links_checked || null,
        shot_cards: modelIndexAudit.shot_cards || null,
        batch_sections: modelIndexAudit.batch_sections || null,
      },
      provider_submission_freshness: providerFreshness.decision || null,
      actual_delivery_surface: actualDeliverySurface.decision || null,
      current_hanneman_contract: {
        decision: currentHannemanContract.decision || null,
        shot: currentHannemanContract.shot || null,
        visible_named_only: currentHannemanContract.visible_named_only || [],
      },
      after_clip_return_resume: afterClipReturnResume.decision || null,
      video_generation_run_positive_contract: positiveContract.decision || null,
      positive_contract_isolation_gate: {
        decision: positiveContractIsolation.decision || null,
        production_completion_decision: positiveContractIsolation.production_completion_decision || null,
        production_completion_highest_target: positiveContractIsolation.production_completion_highest_target || null,
        production_truth_gate_can_claim_video_generation_run: positiveContractIsolation.production_truth_gate_can_claim_video_generation_run ?? null,
        production_truth_gate_highest_target: positiveContractIsolation.production_truth_gate_highest_target || null,
      },
      report_freshness_gate: {
        decision: reportFreshness.decision || null,
        reports_checked: reportFreshness.reports_checked || null,
      },
      final_concat_inputs_contract: {
        decision: finalConcatInputsContract.decision || null,
        ordered_clip_signature_sha256: finalConcatInputsContract.ordered_clip_signature_sha256 || null,
        current_ordered_clip_signature_sha256: currentFinalConcatInputs.ordered_clip_signature_sha256,
        concat_list_preview_sha256: finalConcatInputsContract.concat_list_preview_sha256 || null,
        current_concat_list_preview_sha256: currentFinalConcatInputs.concat_list_preview_sha256,
      },
      video_generation_run_completion: projectedCompletion,
      production_final_output_exists: fs.existsSync(finalOutput),
    },
    old_status_files: oldStatusFiles.map((file) => ({
      file: rel(file),
      exists: fs.existsSync(file),
      superseded_banner: readText(file).startsWith("> Superseded by `CURRENT_STATUS_2026-08-01.md`."),
    })),
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Current Status Consistency Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Current status: \`${rel(currentStatusFile)}\``,
    "",
    "This gate checks that the file-access status page matches the current machine-readable package reports, and that older status files are visibly marked as historical.",
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

  console.log(JSON.stringify({
    decision,
    problems: problems.length,
    warnings: warnings.length,
    current_status: rel(currentStatusFile),
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));

  if (decision !== "current_status_consistency_passed") process.exit(1);
}

main();
