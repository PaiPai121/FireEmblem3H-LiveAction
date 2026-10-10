#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const clipQaPath = path.join(reportDir, "scene09_v3_generated_clip_structural_audit_2026-08-01.json");
const motionAssetsPath = path.join(reportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json");
const decisionsPath = path.join(reportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.json");
const battleLedgerPath = path.join(reportDir, "scene09_v3_battle_ledger_timeline_2026-07-28.json");
const defaultProposalPath = path.join(packageDir, "motion_self_audit", "decision_update_template.jsonl");
const outJson = path.join(reportDir, `scene09_v3_motion_self_audit_apply_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_motion_self_audit_apply_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "motion_self_audit_apply_gate.json");
const packageOutMd = path.join(packageDir, "motion_self_audit_apply_gate.md");

const REQUIRED_CHECK_IDS = [
  "visible_named_only_match",
  "no_unnamed_readable_humans",
  "no_illegal_reentry",
  "capture_continuity_locked",
  "teacher_lane_separation",
  "shot034b_empty_objective_only",
  "shot034g_exhausted_core_only",
  "nonlethal_mock_battle",
  "identity_costume_weapon_lock",
  "screen_direction_and_camera_lock",
  "end_frame_hold",
  "no_visible_text_or_watermark",
];

const ALLOWED_DECISIONS = new Set([
  "motion_review_passed",
  "blocked_needs_revision",
  "rejected",
]);

const REQUIRED_LEDGER_FIELDS = [
  "battle_ledger_after",
  "alive_safe_after",
  "active_after",
  "limited_after",
  "defeated_removed_after",
  "captured_objective_defeated_after",
  "stood_down_post_battle_after",
  "must_not_return_active_after",
  "changed_this_shot",
  "no_active_combat_line",
];

function usage() {
  return [
    "Usage:",
    "  node scripts/apply_scene09_v3_motion_self_audit_decisions.js [proposal.jsonl] [--apply]",
    "",
    "The proposal must contain exactly 42 Codex-reviewed rows with clip_signature",
    "bound to the current expected_clip files. This gate refuses to apply anything while",
    "real clips, clip structural QA, or start/mid/end motion-review frames are missing.",
  ].join("\n");
}

function parseArgs(argv) {
  const options = { proposal: defaultProposalPath, apply: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--apply") options.apply = true;
    else if (arg === "--help" || arg === "-h") {
      process.stdout.write(`${usage()}\n`);
      process.exit(0);
    } else if (!arg.startsWith("--") && options.proposal === defaultProposalPath) {
      options.proposal = path.resolve(arg);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
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

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
}

function rel(file) {
  return path.relative(root, file);
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function clipSignature(expectedClip) {
  const absolute = path.join(root, expectedClip);
  if (!fs.existsSync(absolute)) return null;
  const stat = fs.statSync(absolute);
  return {
    size_bytes: stat.size,
    mtime_ms: Math.trunc(stat.mtimeMs),
    sha256: crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex"),
  };
}

function reviewFrameSignature(relativeFile) {
  if (!relativeFile) return null;
  const absolute = path.join(root, relativeFile);
  if (!fs.existsSync(absolute)) return null;
  const stat = fs.statSync(absolute);
  return {
    path: relativeFile,
    size_bytes: stat.size,
    mtime_ms: Math.trunc(stat.mtimeMs),
    sha256: crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex"),
  };
}

function sameSignature(a, b) {
  return Boolean(a && b &&
    a.size_bytes === b.size_bytes &&
    a.mtime_ms === b.mtime_ms &&
    a.sha256 &&
    b.sha256 &&
    a.sha256 === b.sha256);
}

function sameJson(a, b) {
  return JSON.stringify(a || {}) === JSON.stringify(b || {});
}

function listGroups(groups = {}) {
  return Object.entries(groups)
    .map(([group, names]) => `${group}: ${(names || []).join(", ") || "none"}`)
    .join("; ") || "none";
}

function changedText(changes) {
  return (changes || []).map((item) => `${item.name}:${item.status}`).join("; ");
}

function ledgerSnapshot(ledgerRow = {}) {
  return {
    alive_by_house: ledgerRow.alive_by_house || {},
    active_by_house: ledgerRow.active_by_house || {},
    limited_by_house: ledgerRow.limited_by_house || {},
    defeated_removed_by_house: ledgerRow.defeated_removed_by_house || {},
    captured_objective_defeated_by_house: ledgerRow.captured_objective_defeated_by_house || {},
    stood_down_post_battle_by_house: ledgerRow.stood_down_post_battle_by_house || {},
    must_not_return_active_by_house: ledgerRow.must_not_return_active_by_house || {},
    changed_this_shot: ledgerRow.changed_this_shot || [],
    no_active_combat_line: ledgerRow.no_active_combat_line || "none",
  };
}

function ledgerTextFields(ledgerRow = {}) {
  return {
    alive_safe_after: listGroups(ledgerRow.alive_by_house),
    active_after: listGroups(ledgerRow.active_by_house),
    limited_after: listGroups(ledgerRow.limited_by_house),
    defeated_removed_after: listGroups(ledgerRow.defeated_removed_by_house),
    captured_objective_defeated_after: listGroups(ledgerRow.captured_objective_defeated_by_house),
    stood_down_post_battle_after: listGroups(ledgerRow.stood_down_post_battle_by_house),
    must_not_return_active_after: listGroups(ledgerRow.must_not_return_active_by_house),
    changed_this_shot: changedText(ledgerRow.changed_this_shot),
    no_active_combat_line: ledgerRow.no_active_combat_line || "none",
  };
}

function promptNoActive(prompt) {
  return prompt.match(/No-active-combat after this shot:\s*(.+?)(?:\.|\n|$)/)?.[1]?.trim() || "";
}

function currentBattleLedgerRows(manifest) {
  return (manifest.shots || []).map((shot) => {
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

function currentBattleLedgerStateMachineRows(manifest) {
  const shots = manifest.shots || [];
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

function sameFrameSignature(a, b) {
  return Boolean(sameSignature(a, b) && a.path && b.path && a.path === b.path);
}

function byId(rows = []) {
  return new Map(rows.map((row) => [row.id, row]));
}

function readJsonl(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing proposal JSONL: ${file}`);
  return fs.readFileSync(file, "utf8")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid JSONL at line ${index + 1}: ${error.message}`);
      }
    });
}

function checkReviewFrames(row) {
  const missing = [];
  for (const label of ["start", "mid", "end"]) {
    const frame = row.review_frames?.[label];
    if (!frame || !fs.existsSync(path.join(root, frame))) missing.push(label);
  }
  return missing;
}

function reviewerLooksLikeCodex(value) {
  return /^(codex|codex_self_audit)$/i.test(String(value || ""));
}

function reviewerLooksLikeUser(value) {
  return /(user|operator|client|manual|human)/i.test(String(value || ""));
}

function checkReviewEvidence(row, assetRow) {
  const evidence = row.review_evidence || {};
  const frames = evidence.review_frames_checked || {};
  const frameSignatures = evidence.review_frame_signatures || {};
  const missing = [];
  if (evidence.full_clip_reviewed !== true) missing.push("full_clip_reviewed");
  if (frames.start !== true) missing.push("review_frames_checked.start");
  if (frames.mid !== true) missing.push("review_frames_checked.mid");
  if (frames.end !== true) missing.push("review_frames_checked.end");
  if (evidence.clip_signature_verified !== true) missing.push("clip_signature_verified");
  for (const label of ["start", "mid", "end"]) {
    const current = reviewFrameSignature(assetRow?.review_frames?.[label]);
    if (!frameSignatures[label]) {
      missing.push(`review_frame_signatures.${label}`);
    } else if (!sameFrameSignature(frameSignatures[label], current)) {
      missing.push(`review_frame_signatures.${label}_stale_or_mismatch`);
    }
  }
  return missing;
}

function summarizeRows(rows) {
  return {
    motion_review_passed: rows.filter((row) => row.decision === "motion_review_passed").length,
    blocked_or_rejected: rows.filter((row) => ["blocked_needs_revision", "rejected"].includes(row.decision)).length,
  };
}

function reportDecision(problems, proposalRows) {
  if (problems.some((problem) => /missing_clip|clips? (are )?not complete|review frames are not complete/i.test(problem))) {
    return "motion_self_audit_apply_blocked_clips_pending";
  }
  if (problems.length) return "motion_self_audit_apply_blocked_invalid_proposal";
  if (proposalRows.some((row) => ["blocked_needs_revision", "rejected"].includes(row.decision))) {
    return "motion_self_audit_apply_valid_revisions_required";
  }
  return "motion_self_audit_apply_passed";
}

function buildUpdatedRows(manifest, existingDecisions, clipQa, motionAssets, proposalRows) {
  const existingById = byId(existingDecisions.rows || []);
  const clipById = byId(clipQa.rows || []);
  const assetById = byId(motionAssets.rows || []);
  const proposalById = byId(proposalRows);
  return (manifest.shots || []).map((shot) => {
    const existing = existingById.get(shot.id) || {};
    const proposal = proposalById.get(shot.id) || {};
    const asset = assetById.get(shot.id) || {};
    const clipRow = clipById.get(shot.id) || {};
    return {
      ...existing,
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
      clip_exists: true,
      clip_signature: clipSignature(shot.expected_clip),
      clip_file_qa: clipRow.clip || null,
      motion_review_asset_status: asset.status || "review_frames_ready",
      review_frames: {
        start: asset.review_frames?.start || existing.review_frames?.start || null,
        mid: asset.review_frames?.mid || existing.review_frames?.mid || null,
        end: asset.review_frames?.end || existing.review_frames?.end || null,
      },
      decision: proposal.decision,
      reviewed_by: proposal.reviewed_by,
      reviewed_at: proposal.reviewed_at,
      review_evidence: proposal.review_evidence || null,
      checks: proposal.checks,
      reviewer_notes: proposal.reviewer_notes || "",
      battle_ledger_after: proposal.battle_ledger_after || null,
      alive_safe_after: proposal.alive_safe_after || "",
      active_after: proposal.active_after || "",
      limited_after: proposal.limited_after || "",
      defeated_removed_after: proposal.defeated_removed_after || "",
      captured_objective_defeated_after: proposal.captured_objective_defeated_after || "",
      stood_down_post_battle_after: proposal.stood_down_post_battle_after || "",
      must_not_return_active_after: proposal.must_not_return_active_after || "",
      changed_this_shot: proposal.changed_this_shot || "",
      no_active_combat_line: proposal.no_active_combat_line || "none",
    };
  });
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const problems = [];
  const manifest = readJson(manifestPath);
  if (!manifest) throw new Error(`Missing package manifest: ${manifestPath}`);
  const expected = Number(manifest.total_shots || (manifest.shots || []).length || 42);
  const clipQa = readJson(clipQaPath, {});
  const motionAssets = readJson(motionAssetsPath, {});
  const existingDecisions = readJson(decisionsPath, { rows: [], required_checks: [] });
  const battleLedger = readJson(battleLedgerPath, { rows: [] });
  const proposalRows = readJsonl(options.proposal);
  const proposalById = byId(proposalRows);
  const clipById = byId(clipQa.rows || []);
  const assetById = byId(motionAssets.rows || []);
  const ledgerByShot = new Map((battleLedger.rows || []).map((row) => [row.shot, row]));
  const currentLedgerRows = currentBattleLedgerRows(manifest);
  const currentLedgerRowsDigest = sha256Text(`${JSON.stringify(currentLedgerRows)}\n`);
  const currentStateMachineRows = currentBattleLedgerStateMachineRows(manifest);
  const currentStateMachineRowsDigest = sha256Text(`${JSON.stringify(currentStateMachineRows)}\n`);
  const battleLedgerRowsDigestOk =
    Array.isArray(battleLedger.rows) &&
    battleLedger.rows.length === expected &&
    JSON.stringify(battleLedger.rows) === JSON.stringify(currentLedgerRows) &&
    battleLedger.rows_digest_sha256 === currentLedgerRowsDigest;
  const battleLedgerStateMachineDigestOk =
    Array.isArray(battleLedger.state_machine_rows) &&
    battleLedger.state_machine_rows.length === expected &&
    JSON.stringify(battleLedger.state_machine_rows) === JSON.stringify(currentStateMachineRows) &&
    battleLedger.state_machine_rows_digest_sha256 === currentStateMachineRowsDigest &&
    currentStateMachineRows.every((row) => Number(row.state_machine_problems?.length || 0) === 0);
  const seen = new Set();
  const evidenceCounters = {
    clip_signature_matched_rows: 0,
    review_frame_signature_matched_rows: 0,
    review_evidence_complete_rows: 0,
    ledger_matched_rows: 0,
    required_checks_complete_rows: 0,
  };

  if (proposalRows.length !== expected) problems.push(`proposal rows ${proposalRows.length} does not match expected ${expected}`);
  if (Number(clipQa.expected_clips || 0) !== expected ||
      Number(clipQa.ready_clips || 0) !== expected ||
      Number(clipQa.missing_clips || 0) !== 0 ||
      Number(clipQa.failed_clips || 0) !== 0) {
    problems.push(`clips are not complete: ready ${clipQa.ready_clips || 0}/${expected}, missing ${clipQa.missing_clips ?? expected}, failed ${clipQa.failed_clips || 0}`);
  }
  if (Number(motionAssets.expected_clips || 0) !== expected ||
      Number(motionAssets.extracted_clips || 0) !== expected ||
      Number(motionAssets.missing_clips || 0) !== 0 ||
      Number(motionAssets.failed_clips || 0) !== 0) {
    problems.push(`motion review frames are not complete: extracted ${motionAssets.extracted_clips || 0}/${expected}, missing ${motionAssets.missing_clips ?? expected}, failed ${motionAssets.failed_clips || 0}`);
  }
  if (!battleLedgerRowsDigestOk) {
    problems.push("battle ledger timeline rows digest is missing, stale, or does not match current package manifest/model prompts");
  }
  if (!battleLedgerStateMachineDigestOk) {
    problems.push("battle ledger active-return state-machine digest is missing, stale, or reports illegal reentry/visibility conflicts");
  }

  for (const row of proposalRows) {
    if (!row.id) problems.push(`${row.shot || "unknown"}: missing id`);
    if (row.id && seen.has(row.id)) problems.push(`${row.id}: duplicate proposal row`);
    if (row.id) seen.add(row.id);
  }

  for (const shot of manifest.shots || []) {
    const row = proposalById.get(shot.id);
    const clipRow = clipById.get(shot.id);
    const assetRow = assetById.get(shot.id);
    if (!row) {
      problems.push(`${shot.shot}: missing proposal row`);
      continue;
    }
    const ledgerRow = ledgerByShot.get(shot.shot) || {};
    if (row.shot !== shot.shot) problems.push(`${shot.shot}: proposal shot mismatch ${row.shot || "missing"}`);
    if (row.expected_clip !== shot.expected_clip) problems.push(`${shot.shot}: expected_clip mismatch`);
    for (const field of REQUIRED_LEDGER_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(row, field)) problems.push(`${shot.shot}: missing ledger field ${field}`);
    }
    if (!sameJson(row.battle_ledger_after || {}, ledgerSnapshot(ledgerRow))) {
      problems.push(`${shot.shot}: proposal battle_ledger_after is missing, stale, or does not match source battle ledger`);
    }
    let ledgerFieldsMatch = sameJson(row.battle_ledger_after || {}, ledgerSnapshot(ledgerRow));
    for (const [field, expectedValue] of Object.entries(ledgerTextFields(ledgerRow))) {
      if (String(row[field] || "") !== expectedValue) {
        problems.push(`${shot.shot}: proposal ${field} does not match source battle ledger`);
        ledgerFieldsMatch = false;
      }
    }
    if (ledgerFieldsMatch) evidenceCounters.ledger_matched_rows += 1;
    if (!ALLOWED_DECISIONS.has(row.decision)) problems.push(`${shot.shot}: unsupported decision ${row.decision || "missing"}`);
    const missingEvidence = checkReviewEvidence(row, assetRow);
    if (missingEvidence.length) {
      problems.push(`${shot.shot}: review_evidence incomplete: ${missingEvidence.join(", ")}`);
    } else {
      evidenceCounters.review_evidence_complete_rows += 1;
      evidenceCounters.review_frame_signature_matched_rows += 1;
    }
    if (row.decision === "motion_review_passed") {
      if (!reviewerLooksLikeCodex(row.reviewed_by) || reviewerLooksLikeUser(row.reviewed_by)) {
        problems.push(`${shot.shot}: passed row must be reviewed_by codex or codex_self_audit, not ${row.reviewed_by || "missing"}`);
      }
      if (!row.reviewed_at || Number.isNaN(Date.parse(row.reviewed_at))) {
        problems.push(`${shot.shot}: passed row must include ISO reviewed_at`);
      }
      if (!String(row.reviewer_notes || "").trim()) {
        problems.push(`${shot.shot}: passed row must include reviewer_notes from clip/frame inspection`);
      }
    } else if (!String(row.reviewer_notes || "").trim()) {
      problems.push(`${shot.shot}: blocked/rejected row must include reviewer_notes`);
    }
    const signature = clipSignature(shot.expected_clip);
    if (!signature) problems.push(`${shot.shot}: missing_clip ${shot.expected_clip}`);
    if (!row.clip_signature) {
      problems.push(`${shot.shot}: proposal clip_signature is missing`);
    } else if (!sameSignature(row.clip_signature, signature)) {
      problems.push(`${shot.shot}: proposal clip_signature is stale or does not match current clip`);
    } else {
      evidenceCounters.clip_signature_matched_rows += 1;
    }
    if (!clipRow?.clip?.ok) problems.push(`${shot.shot}: clip structural QA is not ok`);
    if (assetRow?.status !== "review_frames_ready") {
      problems.push(`${shot.shot}: motion review asset status is ${assetRow?.status || "missing"}`);
    }
    const missingFrames = checkReviewFrames(assetRow || {});
    if (missingFrames.length) problems.push(`${shot.shot}: missing extracted review frames ${missingFrames.join(", ")}`);

    const checks = new Map((row.checks || []).map((check) => [check.id, check]));
    for (const id of REQUIRED_CHECK_IDS) {
      const check = checks.get(id);
      if (!check) {
        problems.push(`${shot.shot}: missing required check ${id}`);
      } else if (row.decision === "motion_review_passed" && check.result !== "pass") {
        problems.push(`${shot.shot}: passed row has ${id}=${check.result || "missing"}`);
      }
    }
    if (REQUIRED_CHECK_IDS.every((id) => checks.has(id))) {
      evidenceCounters.required_checks_complete_rows += 1;
    }
    if (["blocked_needs_revision", "rejected"].includes(row.decision)) {
      const failedChecks = [...checks.values()].filter((check) => check.result && check.result !== "pass");
      if (!failedChecks.length) problems.push(`${shot.shot}: blocked/rejected row needs at least one non-pass check`);
    }
  }

  const decision = reportDecision(problems, proposalRows);
  const summary = summarizeRows(proposalRows);
  let applied = false;
  if (options.apply && problems.length === 0) {
    const rows = buildUpdatedRows(manifest, existingDecisions, clipQa, motionAssets, proposalRows);
    const reportSummary = {
      expected_clips: expected,
      clip_exists: expected,
      pending_clip: 0,
      needs_codex_motion_review: 0,
      motion_review_passed: summary.motion_review_passed,
      blocked_or_rejected: summary.blocked_or_rejected,
    };
    writeJson(decisionsPath, {
      ...existingDecisions,
      date: "2026-07-28",
      decision: summary.blocked_or_rejected
        ? "motion_review_blocked_needs_revision"
        : "motion_review_passed_ready_for_concat",
      summary: reportSummary,
      rows,
    });
    applied = true;
  }

  const report = {
    date,
    package_manifest: rel(manifestPath),
    proposal: rel(options.proposal),
    apply_requested: options.apply,
    applied,
    decision,
    expected_clips: expected,
    proposal_rows: proposalRows.length,
    summary,
    evidence_counters: evidenceCounters,
    battle_ledger_signature: {
      source_report: rel(battleLedgerPath),
      rows_digest_sha256: battleLedger.rows_digest_sha256 || null,
      current_rows_digest_sha256: currentLedgerRowsDigest,
      rows_digest_ok: battleLedgerRowsDigestOk,
      rows: currentLedgerRows,
      state_machine_rows_digest_sha256: battleLedger.state_machine_rows_digest_sha256 || null,
      current_state_machine_rows_digest_sha256: currentStateMachineRowsDigest,
      state_machine_rows_digest_ok: battleLedgerStateMachineDigestOk,
      state_machine_rows: currentStateMachineRows,
    },
    problems,
    outputs: {
      motion_decisions_json: rel(decisionsPath),
    },
  };
  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  writeText(packageOutMd, [
    "# Scene09 V3 Motion Self-Audit Apply Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Apply requested: ${options.apply ? "yes" : "no"}`,
    `Applied: ${applied ? "yes" : "no"}`,
    `Proposal rows: ${proposalRows.length}/${expected}`,
    `Motion review passed rows: ${summary.motion_review_passed}`,
    `Blocked/rejected rows: ${summary.blocked_or_rejected}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n"));
  writeText(outMd, fs.readFileSync(packageOutMd, "utf8"));

  console.log(JSON.stringify({
    decision,
    applied,
    proposal_rows: proposalRows.length,
    passed_rows: summary.motion_review_passed,
    blocked_or_rejected: summary.blocked_or_rejected,
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));

  if (decision !== "motion_self_audit_apply_passed") process.exit(1);
}

main();
