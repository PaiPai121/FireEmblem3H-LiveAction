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
const manifestPath = path.join(packageDir, "package_manifest.json");
const outJson = path.join(reportDir, `scene09_v3_final_concat_positive_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_final_concat_positive_contract_${date}.md`);
const packageOutJson = path.join(packageDir, "final_concat_positive_contract.json");
const packageOutMd = path.join(packageDir, "final_concat_positive_contract.md");

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

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
}

function rel(file) {
  return path.relative(root, file);
}

function abs(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function parseLastJson(text) {
  const trimmed = String(text || "").trim();
  const starts = [];
  for (let i = 0; i < trimmed.length; i += 1) {
    if (trimmed[i] === "{") starts.push(i);
  }
  for (const start of starts.reverse()) {
    try {
      return JSON.parse(trimmed.slice(start));
    } catch (_) {
      // Keep scanning backward.
    }
  }
  return null;
}

function makeRows(manifest, mapper) {
  return (manifest.shots || []).map((shot) => ({
    order: shot.order,
    shot: shot.shot,
    id: shot.id,
    expected_clip: shot.expected_clip,
    ...mapper(shot),
  }));
}

function normalizeClipPath(value) {
  if (!value) return "";
  return rel(abs(value));
}

function writeGeneratedClipProvenance(packagePath, manifest) {
  const rows = (manifest.shots || []).map((shot) => {
    const clip = abs(shot.expected_clip);
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: normalizeClipPath(shot.expected_clip),
      output_clip: normalizeClipPath(shot.expected_clip),
      source_type: "model_cli_execute",
      sha256: sha256File(clip),
      created_at: "2026-08-01T00:00:00.000Z",
      model_cli_command: "fixture://final_concat_positive_contract",
    };
  });
  writeJson(path.join(packagePath, "generated_clip_provenance.json"), {
    version: 1,
    created_at: "2026-08-01T00:00:00.000Z",
    rows,
  });
  return rows;
}

function clipProvenanceGateRows(packagePath, manifest) {
  const provenance = readJson(path.join(packagePath, "generated_clip_provenance.json"));
  const provenanceRows = Array.isArray(provenance.rows) ? provenance.rows : [];
  const provenanceByClip = new Map(provenanceRows.map((row) => [normalizeClipPath(row.expected_clip || row.output_clip), row]));
  return (manifest.shots || []).map((shot) => {
    const expectedClip = normalizeClipPath(shot.expected_clip);
    const expectedAbs = abs(shot.expected_clip);
    const currentSha256 = sha256File(expectedAbs);
    const source = provenanceByClip.get(expectedClip) || null;
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: expectedClip,
      exists: true,
      current_sha256: currentSha256,
      provenance_source_type: source?.source_type || null,
      provenance_sha256: source?.sha256 || null,
      provenance_created_at: source?.created_at || null,
      provenance_source_sha256: source?.source_sha256 || null,
      problems: [],
      warnings: [],
    };
  });
}

function promptNoActive(prompt) {
  return prompt.match(/No-active-combat after this shot:\s*(.+?)(?:\.|\n|$)/)?.[1]?.trim() || "";
}

function battleLedgerRows(manifest, basePackageDir = packageDir) {
  return (manifest.shots || []).map((shot) => {
    const ledger = shot.battle_state_after?.battle_ledger_after || shot.battle_ledger_after || {};
    const modelPromptPath = shot.package_dir
      ? path.join(basePackageDir, shot.package_dir, "model_prompt.md")
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

function battleLedgerStateMachineRows(manifest, basePackageDir = packageDir) {
  const shots = manifest.shots || [];
  const knownNames = new Set(flattenGroups(shots[0]?.battle_state_after?.battle_ledger_after?.alive_by_house || shots[0]?.battle_ledger_after?.alive_by_house || {}));
  let previousMustNotReturn = new Set();
  let previousCapturedObjectiveDefeated = new Set();
  return shots.map((shot) => {
    const ledger = shot.battle_state_after?.battle_ledger_after || shot.battle_ledger_after || {};
    const modelPromptPath = shot.package_dir ? path.join(basePackageDir, shot.package_dir, "model_prompt.md") : null;
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

function createExpectedClipFixtures(tmpRoot, manifest) {
  const clipDir = path.join(tmpRoot, "expected_clips");
  fs.mkdirSync(clipDir, { recursive: true });
  const sampleClip = path.join(clipDir, "sample_valid_expected_clip.mp4");
  const result = cp.spawnSync("ffmpeg", [
    "-y",
    "-f", "lavfi",
    "-i", "color=c=black:s=160x90:r=12:d=0.5",
    "-an",
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-pix_fmt", "yuv420p",
    sampleClip,
  ], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(`ffmpeg final-concat expected-clip fixture failed: ${result.error?.message || result.stderr || result.status}`);
  }
  return (manifest.shots || []).map((shot) => {
    const file = path.join(clipDir, `${String(shot.order).padStart(2, "0")}_${shot.shot}.mp4`);
    fs.copyFileSync(sampleClip, file);
    return {
      ...shot,
      expected_clip: rel(file),
    };
  });
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const sourceManifest = readJson(manifestPath);
  const expected = Number(sourceManifest.total_shots || (sourceManifest.shots || []).length || 42);
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09-v3-final-concat-positive-"));
  const tmpPackageDir = path.join(tmpRoot, "package");
  const tmpReportDir = path.join(tmpRoot, "reports");
  const tmpFinalOutput = path.join(tmpRoot, "final", "scene09_v3_attrition_final_edit.mp4");
  fs.cpSync(packageDir, tmpPackageDir, { recursive: true });
  fs.mkdirSync(tmpReportDir, { recursive: true });

  const fixtureShots = createExpectedClipFixtures(tmpRoot, sourceManifest);
  const fixtureManifest = {
    ...sourceManifest,
    package_id: `${sourceManifest.package_id}_final_concat_positive_contract_fixture`,
    source_manifest: rel(manifestPath),
    shots: fixtureShots,
    total_shots: expected,
  };
  writeJson(path.join(tmpPackageDir, "package_manifest.json"), fixtureManifest);
  writeGeneratedClipProvenance(tmpPackageDir, fixtureManifest);
  const provenanceGateRows = clipProvenanceGateRows(tmpPackageDir, fixtureManifest);
  const provenanceRowsDigest = sha256Text(`${JSON.stringify(provenanceGateRows)}\n`);
  const ledgerRows = battleLedgerRows(fixtureManifest, tmpPackageDir);
  const ledgerRowsDigest = sha256Text(`${JSON.stringify(ledgerRows)}\n`);
  const stateMachineRows = battleLedgerStateMachineRows(fixtureManifest, tmpPackageDir);
  const stateMachineRowsDigest = sha256Text(`${JSON.stringify(stateMachineRows)}\n`);
  const orderedClipText = (fixtureManifest.shots || [])
    .map((shot) => `${shot.order},${shot.shot},${shot.id},${shot.duration_seconds},${shot.expected_clip}`)
    .join("\n") + "\n";
  const concatListText = (fixtureManifest.shots || [])
    .map((shot) => `file '${path.join(root, shot.expected_clip).replace(/'/g, "'\\''")}'`)
    .join("\n") + "\n";
  writeJson(path.join(tmpPackageDir, "final_concat_inputs_contract.json"), {
    date,
    package_id: fixtureManifest.package_id,
    package_manifest: rel(path.join(tmpPackageDir, "package_manifest.json")),
    decision: "final_concat_inputs_contract_passed",
    expected_shots: expected,
    rows_checked: expected,
    unique_expected_clips: expected,
    expected_duration_seconds: Number(fixtureManifest.total_duration_seconds || 0),
    duration_sum_seconds: (fixtureManifest.shots || []).reduce((sum, shot) => sum + Number(shot.duration_seconds || 0), 0),
    ordered_clip_signature_sha256: sha256Text(orderedClipText),
    concat_list_preview_sha256: sha256Text(concatListText),
    concat_list_preview: concatListText,
    problems: [],
  });

  writeJson(path.join(tmpReportDir, "scene09_v3_generated_clip_structural_audit_2026-08-01.json"), {
    decision: "clip_files_integrity_passed_motion_review_still_required",
    expected_clips: expected,
    ready_clips: expected,
    missing_clips: 0,
    failed_clips: 0,
    rows: makeRows(fixtureManifest, () => ({ clip: { exists: true, ok: true, issue: null } })),
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json"), {
    decision: "clip_motion_review_assets_ready_for_self_audit",
    expected_clips: expected,
    extracted_clips: expected,
    missing_clips: 0,
    failed_clips: 0,
    rows: makeRows(fixtureManifest, () => ({
      status: "review_frames_ready",
      review_frames: { start: "fixture/start.jpg", mid: "fixture/mid.jpg", end: "fixture/end.jpg" },
      problems: [],
    })),
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.json"), {
    decision: "motion_review_passed_ready_for_concat",
    summary: {
      expected_clips: expected,
      clip_exists: expected,
      pending_clip: 0,
      needs_codex_motion_review: 0,
      motion_review_passed: expected,
      blocked_or_rejected: 0,
    },
    rows: makeRows(fixtureManifest, () => ({ decision: "motion_review_passed", checks: [] })),
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_clip_revision_queue_2026-07-28.json"), {
    decision: "clip_revision_queue_clear_ready_for_concat",
    total_shots: expected,
    actionable_shots: 0,
    counts: { ready_for_concat: expected },
    rows: makeRows(fixtureManifest, () => ({ queue_status: "ready_for_concat" })),
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_clip_provenance_gate_2026-08-01.json"), {
    decision: "clip_provenance_passed_all_expected_clips",
    expected_clips: expected,
    existing_clips: expected,
    missing_clips: 0,
    provenance_rows: expected,
    provenance_matched_existing_clips: expected,
    rows_digest_sha256: provenanceRowsDigest,
    problems: [],
    warnings: [],
    rows: provenanceGateRows,
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_motion_self_audit_apply_gate_2026-08-01.json"), {
    decision: "motion_self_audit_apply_passed",
    applied: true,
    expected_clips: expected,
    proposal_rows: expected,
    summary: { motion_review_passed: expected, blocked_or_rejected: 0 },
    evidence_counters: {
      clip_signature_matched_rows: expected,
      review_frame_signature_matched_rows: expected,
      review_evidence_complete_rows: expected,
      ledger_matched_rows: expected,
      required_checks_complete_rows: expected,
    },
    battle_ledger_signature: {
      rows_digest_sha256: ledgerRowsDigest,
      current_rows_digest_sha256: ledgerRowsDigest,
      rows_digest_ok: true,
      rows: ledgerRows,
      state_machine_rows_digest_sha256: stateMachineRowsDigest,
      current_state_machine_rows_digest_sha256: stateMachineRowsDigest,
      state_machine_rows_digest_ok: true,
      state_machine_rows: stateMachineRows,
    },
    problems: [],
  });

  const result = cp.spawnSync(process.execPath, ["scripts/audit_scene09_v3_final_concat_gate.js"], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: tmpPackageDir,
      SCENE09_V3_REPORT_DIR: tmpReportDir,
      SCENE09_V3_FINAL_OUTPUT: tmpFinalOutput,
    },
  });
  const parsed = parseLastJson(result.stdout);
  const gateReportPath = path.join(tmpPackageDir, "final_concat_gate.json");
  const gateReport = fs.existsSync(gateReportPath) ? readJson(gateReportPath) : null;
  const gateResult = gateReport || parsed;
  const inputContractPath = path.join(tmpPackageDir, "final_concat_inputs_contract.json");
  const originalInputContract = readJson(inputContractPath);
  const clipProvenanceGateFixturePath = path.join(tmpReportDir, "scene09_v3_clip_provenance_gate_2026-08-01.json");
  const originalClipProvenanceGate = readJson(clipProvenanceGateFixturePath);
  writeJson(inputContractPath, {
    ...originalInputContract,
    ordered_clip_signature_sha256: "0".repeat(64),
  });
  const tamperedReportDir = tmpReportDir;
  const tamperedRun = cp.spawnSync(process.execPath, ["scripts/audit_scene09_v3_final_concat_gate.js"], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: tmpPackageDir,
      SCENE09_V3_REPORT_DIR: tamperedReportDir,
      SCENE09_V3_FINAL_OUTPUT: tmpFinalOutput,
    },
  });
  const tamperedParsed = parseLastJson(tamperedRun.stdout);
  const tamperedReportPath = path.join(tamperedReportDir, "scene09_v3_final_concat_gate_2026-08-01.json");
  const tamperedReport = fs.existsSync(tamperedReportPath) ? readJson(tamperedReportPath) : null;
  const tamperedResult = tamperedReport || tamperedParsed;
  writeJson(inputContractPath, originalInputContract);
  writeJson(clipProvenanceGateFixturePath, {
    ...originalClipProvenanceGate,
    rows_digest_sha256: "0".repeat(64),
  });
  const tamperedProvenanceRun = cp.spawnSync(process.execPath, ["scripts/audit_scene09_v3_final_concat_gate.js"], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: tmpPackageDir,
      SCENE09_V3_REPORT_DIR: tmpReportDir,
      SCENE09_V3_FINAL_OUTPUT: tmpFinalOutput,
    },
  });
  const tamperedProvenanceParsed = parseLastJson(tamperedProvenanceRun.stdout);
  const tamperedProvenanceReport = fs.existsSync(tamperedReportPath) ? readJson(tamperedReportPath) : null;
  const tamperedProvenanceResult = tamperedProvenanceReport || tamperedProvenanceParsed;
  const problems = [];
  if (result.error) problems.push(result.error.message);
  if (result.status !== 0) problems.push(`gate exited ${result.status}: ${(result.stderr || "").trim()}`);
  if (!parsed) problems.push("could not parse final concat gate stdout JSON");
  if (!gateReport) problems.push("temporary final concat gate package report was not written");
  if (gateResult && gateResult.decision !== "final_concat_gate_passed_ready_for_project_pipeline_concat") {
    problems.push(`decision ${gateResult.decision || "missing"} is not final_concat_gate_passed_ready_for_project_pipeline_concat`);
  }
  if (gateResult && Number(gateResult.passed_checks || 0) !== 8) {
    problems.push(`passed_checks ${gateResult.passed_checks || 0}/8`);
  }
  if (gateResult && Number(gateResult.total_checks || 0) !== 8) {
    problems.push(`total_checks ${gateResult.total_checks || 0}/8`);
  }
  if (gateResult && Number(gateResult.direct_expected_clip_probe?.playable_clips || 0) !== expected) {
    problems.push(`direct_expected_clip_probe playable ${gateResult.direct_expected_clip_probe?.playable_clips || 0}/${expected}`);
  }
  if (gateResult && Number(gateResult.direct_expected_clip_probe?.expected_clips || 0) !== expected) {
    problems.push(`direct_expected_clip_probe expected ${gateResult.direct_expected_clip_probe?.expected_clips || 0}/${expected}`);
  }
  const positiveClipProvenanceCheck = gateResult?.checks?.find((check) => check.id === "clip_provenance_gate");
  if (positiveClipProvenanceCheck?.passed !== true ||
      !String(positiveClipProvenanceCheck?.detail || "").includes("rows digest ok")) {
    problems.push("positive final concat gate did not prove clip provenance rows digest ok");
  }
  if (fs.existsSync(tmpFinalOutput)) {
    problems.push("fixture final output was unexpectedly created");
  }
  if (tamperedRun.status === 0) {
    problems.push("tampered final concat input contract was accepted by gate");
  }
  if (!tamperedResult) {
    problems.push("tampered final concat input contract did not produce a gate report");
  } else {
    if (tamperedResult.decision !== "final_concat_blocked_motion_or_revision_gate") {
      problems.push(`tampered input decision ${tamperedResult.decision || "missing"} is not final_concat_blocked_motion_or_revision_gate`);
    }
    if (!Array.isArray(tamperedResult.failed_checks) ||
        !tamperedResult.failed_checks.includes("final_concat_inputs_contract")) {
      problems.push("tampered input gate did not fail final_concat_inputs_contract");
    }
    const tamperedInputCheck = (tamperedResult.checks || []).find((check) => check.id === "final_concat_inputs_contract");
    if (tamperedInputCheck?.passed !== false ||
        !String(tamperedInputCheck?.detail || "").includes("signatures mismatch")) {
      problems.push("tampered input gate did not report signatures mismatch");
    }
    if (Number(tamperedResult.direct_expected_clip_probe?.playable_clips || 0) !== expected ||
        Number(tamperedResult.direct_expected_clip_probe?.expected_clips || 0) !== expected) {
      problems.push("tampered input gate did not preserve 42/42 direct ffprobe evidence");
    }
  }
  if (tamperedProvenanceRun.status === 0) {
    problems.push("tampered clip provenance gate digest was accepted by final concat gate");
  }
  if (!tamperedProvenanceResult) {
    problems.push("tampered clip provenance digest did not produce a gate report");
  } else {
    if (tamperedProvenanceResult.decision !== "final_concat_blocked_motion_or_revision_gate") {
      problems.push(`tampered provenance decision ${tamperedProvenanceResult.decision || "missing"} is not final_concat_blocked_motion_or_revision_gate`);
    }
    if (!Array.isArray(tamperedProvenanceResult.failed_checks) ||
        !tamperedProvenanceResult.failed_checks.includes("clip_provenance_gate")) {
      problems.push("tampered provenance gate did not fail clip_provenance_gate");
    }
    const tamperedProvenanceCheck = (tamperedProvenanceResult.checks || []).find((check) => check.id === "clip_provenance_gate");
    if (tamperedProvenanceCheck?.passed !== false ||
        !String(tamperedProvenanceCheck?.detail || "").includes("rows digest missing/stale")) {
      problems.push("tampered provenance gate did not report rows digest missing/stale");
    }
    if (Number(tamperedProvenanceResult.direct_expected_clip_probe?.playable_clips || 0) !== expected ||
        Number(tamperedProvenanceResult.direct_expected_clip_probe?.expected_clips || 0) !== expected) {
      problems.push("tampered provenance gate did not preserve 42/42 direct ffprobe evidence");
    }
  }

  const decision = problems.length
    ? "final_concat_positive_contract_failed"
    : "final_concat_positive_contract_passed";
  const report = {
    date,
    decision,
    expected_shots: expected,
    fixture_package_dir: tmpPackageDir,
    fixture_report_dir: tmpReportDir,
    fixture_final_output: tmpFinalOutput,
    gate_stdout: result.stdout,
    gate_stderr: result.stderr,
    gate_stdout_result: parsed,
    gate_result: gateResult,
    direct_expected_clip_probe: gateResult?.direct_expected_clip_probe || null,
    tampered_input_contract_rejection: {
      rejected: Boolean(tamperedResult && tamperedResult.decision === "final_concat_blocked_motion_or_revision_gate"),
      structural_stdout: tamperedRun.stdout,
      structural_stderr: tamperedRun.stderr,
      gate_result: tamperedResult,
      failed_checks: tamperedResult?.failed_checks || [],
      issue: "final_concat_inputs_contract_signature_mismatch",
    },
    tampered_provenance_digest_rejection: {
      rejected: Boolean(tamperedProvenanceResult && tamperedProvenanceResult.decision === "final_concat_blocked_motion_or_revision_gate"),
      structural_stdout: tamperedProvenanceRun.stdout,
      structural_stderr: tamperedProvenanceRun.stderr,
      gate_result: tamperedProvenanceResult,
      failed_checks: tamperedProvenanceResult?.failed_checks || [],
      issue: "clip_provenance_gate_rows_digest_mismatch",
    },
    problems,
  };
  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Final Concat Positive Contract",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Expected shots: ${expected}`,
    "",
    "This is a temporary-fixture contract test. It proves the real final concat gate accepts a complete upstream evidence set, without writing production motion approvals, expected clips, or final edit output.",
    "",
    "## Gate Result",
    "",
    gateResult ? `- Decision: ${gateResult.decision}` : "- Decision: missing",
    gateResult ? `- Checks: ${gateResult.passed_checks}/${gateResult.total_checks}` : "- Checks: missing",
    gateResult ? `- Direct expected-clip ffprobe: ${gateResult.direct_expected_clip_probe?.playable_clips || 0}/${gateResult.direct_expected_clip_probe?.expected_clips || 0}` : "- Direct expected-clip ffprobe: missing",
    positiveClipProvenanceCheck ? `- Clip provenance rows digest: ${String(positiveClipProvenanceCheck.detail || "").includes("rows digest ok") ? "ok" : "missing/stale"}` : "- Clip provenance rows digest: missing",
    tamperedResult ? `- Tampered input rejection: ${tamperedResult.decision}; failed ${(tamperedResult.failed_checks || []).join(", ") || "none"}` : "- Tampered input rejection: missing",
    tamperedProvenanceResult ? `- Tampered provenance rejection: ${tamperedProvenanceResult.decision}; failed ${(tamperedProvenanceResult.failed_checks || []).join(", ") || "none"}` : "- Tampered provenance rejection: missing",
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
    gate_decision: gateResult?.decision || null,
    gate_checks: gateResult ? `${gateResult.passed_checks}/${gateResult.total_checks}` : null,
    direct_expected_clip_probe: gateResult ? `${gateResult.direct_expected_clip_probe?.playable_clips || 0}/${gateResult.direct_expected_clip_probe?.expected_clips || 0}` : null,
    tampered_input_rejected: Boolean(tamperedResult && tamperedResult.decision === "final_concat_blocked_motion_or_revision_gate"),
    tampered_provenance_rejected: Boolean(tamperedProvenanceResult && tamperedProvenanceResult.decision === "final_concat_blocked_motion_or_revision_gate"),
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

main();
