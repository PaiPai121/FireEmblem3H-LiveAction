const fs = require("fs");
const path = require("path");

const root = process.cwd();
const date = "2026-07-28";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const clipQaPath = path.join(reportDir, "scene09_v3_generated_clip_structural_audit_2026-08-01.json");
const motionAssetsPath = path.join(reportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json");
const motionDecisionsPath = path.join(reportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.json");
const outJson = path.join(reportDir, "scene09_v3_clip_revision_queue_2026-07-28.json");
const outMd = path.join(reportDir, "scene09_v3_clip_revision_queue_2026-07-28.md");
const outCsv = path.join(reportDir, "scene09_v3_clip_revision_queue_2026-07-28.csv");
const packageJson = path.join(packageDir, "clip_revision_queue.json");
const packageMd = path.join(packageDir, "clip_revision_queue.md");
const packageCsv = path.join(packageDir, "clip_revision_queue.csv");

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
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

function rel(file) {
  return path.relative(root, file);
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
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

function battleLedger(shot) {
  return shot.battle_state_after?.battle_ledger_after || shot.battle_ledger_after || {};
}

function noActiveLine(shot, ledger) {
  const names = [
    ...(Array.isArray(shot.battle_state_after?.inactive_or_removed_after) ? shot.battle_state_after.inactive_or_removed_after : []),
    ...(Array.isArray(shot.battle_state_after?.no_active_combat_after) ? shot.battle_state_after.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
  ].filter((name, index, all) => name && all.indexOf(name) === index);
  return names.join(", ") || ledger.no_active_combat_line || "none";
}

function ledgerFields(shot) {
  const ledger = battleLedger(shot);
  const state = shot.battle_state_after || {};
  return {
    battle_ledger_after: ledger,
    alive_safe_after: groupText(ledger.alive_by_house || state.active_by_house),
    active_or_objective_after: groupText(ledger.still_active_or_controlling_objective_by_house || ledger.active_by_house || state.active_by_house),
    limited_after: groupText(ledger.limited_but_not_defeated_by_house || ledger.limited_by_house),
    defeated_removed_after: groupText(ledger.mock_battle_defeated_or_removed_by_house || ledger.defeated_removed_by_house || state.inactive_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_or_objective_defeated_by_house || ledger.captured_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_or_post_battle_by_house || ledger.stood_down_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: noActiveLine(shot, ledger),
  };
}

function byId(rows = []) {
  return new Map(rows.map((row) => [row.id, row]));
}

function failedChecks(decisionRow) {
  return (decisionRow?.checks || [])
    .filter((check) => check.result && check.result !== "pass")
    .map((check) => `${check.id}: ${check.result}${check.notes ? ` (${check.notes})` : ""}`);
}

function actionFor(shot, clipRow, motionAssetRow, decisionRow) {
  const clip = clipRow?.clip || {};
  const decision = decisionRow?.decision || "pending_clip";
  if (!clip.exists) {
    return {
      status: "generation_pending",
      priority: "P0",
      next_action: "Generate the initial monitored clip at expected_clip using model_prompt.md, negative_prompt.md, and the packaged start/key/end frames.",
      reason: "Expected clip is missing; no motion review can run yet.",
    };
  }
  if (!clip.ok) {
    return {
      status: "clip_file_qa_failed",
      priority: "P0",
      next_action: "Regenerate or repair the clip file, then rerun generated clip QA before motion review.",
      reason: clip.issue || "Clip file failed ffprobe/duration/integrity checks.",
    };
  }
  if (motionAssetRow?.status !== "review_frames_ready") {
    return {
      status: "motion_review_assets_failed",
      priority: "P0",
      next_action: "Extract start/mid/end review frames from the clip, then rerun motion review decision generation.",
      reason: motionAssetRow?.problems?.join("; ") || `Motion review asset status is ${motionAssetRow?.status || "missing"}.`,
    };
  }
  if (["blocked_needs_revision", "rejected"].includes(decision)) {
    const checks = failedChecks(decisionRow);
    return {
      status: decision,
      priority: "P0",
      next_action: "Revise or regenerate this clip before any concat attempt; preserve the same story beat unless the source prompt is proven wrong.",
      reason: checks.length ? checks.join("; ") : decisionRow?.reviewer_notes || `Motion decision is ${decision}.`,
    };
  }
  if (decision !== "motion_review_passed") {
    return {
      status: "codex_motion_self_audit_required",
      priority: "P1",
      next_action: "Codex must inspect the full clip plus start/mid/end extracted frames and update the machine-readable decision row.",
      reason: `Motion decision is ${decision}; clip file exists but is not approved for concat.`,
    };
  }
  return {
    status: "ready_for_concat",
    priority: "P3",
    next_action: "No revision action required.",
    reason: "Clip file, review frames, and machine-readable motion decision have passed.",
  };
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const clipQa = readJson(clipQaPath, { rows: [] });
  const motionAssets = readJson(motionAssetsPath, { rows: [] });
  const motionDecisions = readJson(motionDecisionsPath, { rows: [] });
  const clipById = byId(clipQa.rows || []);
  const assetById = byId(motionAssets.rows || []);
  const decisionById = byId(motionDecisions.rows || []);

  const rows = manifest.shots.map((shot) => {
    const clipRow = clipById.get(shot.id);
    const assetRow = assetById.get(shot.id);
    const decisionRow = decisionById.get(shot.id);
    const action = actionFor(shot, clipRow, assetRow, decisionRow);
    const ledger = ledgerFields(shot);
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      package_dir: shot.package_dir,
      expected_clip: shot.expected_clip,
      visible_named_only: shot.visible_named_only || [],
      primary_check: shot.primary_check || "",
      battle_state_note: shot.battle_state_after?.note || "",
      ...ledger,
      clip_exists: Boolean(clipRow?.clip?.exists),
      clip_ok: Boolean(clipRow?.clip?.ok),
      clip_issue: clipRow?.clip?.issue || null,
      motion_review_asset_status: assetRow?.status || "missing_clip",
      motion_review_decision: decisionRow?.decision || "pending_clip",
      failed_motion_checks: failedChecks(decisionRow),
      priority: action.priority,
      queue_status: action.status,
      next_action: action.next_action,
      reason: action.reason,
      model_prompt: path.join(shot.package_dir, "model_prompt.md"),
      negative_prompt: path.join(shot.package_dir, "negative_prompt.md"),
      start_frame: path.join(shot.package_dir, "start_frame.png"),
      key_frame: path.join(shot.package_dir, "key_frame.png"),
      end_frame: path.join(shot.package_dir, "end_frame.png"),
    };
  });

  const actionable = rows.filter((row) => row.queue_status !== "ready_for_concat");
  const counts = rows.reduce((acc, row) => {
    acc[row.queue_status] = (acc[row.queue_status] || 0) + 1;
    return acc;
  }, {});
  const decision = actionable.length
    ? "clip_generation_or_revision_actions_required"
    : "clip_revision_queue_clear_ready_for_concat";
  const report = {
    date,
    package_manifest: rel(manifestPath),
    clip_qa_report: fs.existsSync(clipQaPath) ? rel(clipQaPath) : null,
    motion_review_assets_report: fs.existsSync(motionAssetsPath) ? rel(motionAssetsPath) : null,
    motion_review_decisions_report: fs.existsSync(motionDecisionsPath) ? rel(motionDecisionsPath) : null,
    decision,
    total_shots: rows.length,
    actionable_shots: actionable.length,
    counts,
    rows,
  };

  const header = [
    "order",
    "shot",
    "priority",
    "queue_status",
    "expected_clip",
    "motion_review_decision",
    "battle_state_note",
    "alive_safe_after",
    "active_or_objective_after",
    "limited_after",
    "defeated_removed_after",
    "captured_objective_defeated_after",
    "stood_down_post_battle_after",
    "must_not_return_active_after",
    "changed_this_shot",
    "no_active_combat_line",
    "next_action",
    "reason",
    "visible_named_only",
    "model_prompt",
  ];
  const csv = [
    header.join(","),
    ...rows.map((row) => header.map((key) => csvCell(row[key])).join(",")),
  ].join("\n") + "\n";

  writeJson(outJson, report);
  writeJson(packageJson, report);
  writeText(outCsv, csv);
  writeText(packageCsv, csv);
  const md = [
    "# Scene09 V3 Clip Generation / Revision Queue",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Total shots: ${rows.length}`,
    `Actionable shots: ${actionable.length}`,
    "",
    "## Counts",
    "",
    ...Object.entries(counts).sort().map(([status, count]) => `- ${status}: ${count}`),
    "",
    "## Action Queue",
    "",
    actionable.length
      ? actionable.map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot} [${row.priority} ${row.queue_status}]: ${row.next_action} Reason: ${row.reason}`).join("\n")
      : "- none",
    "",
    "## Rule",
    "",
    "No shot may be concatenated into the final edit unless its queue_status is `ready_for_concat`, which requires a valid clip file, extracted motion-review frames, and `motion_review_passed` in the decision file.",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageMd, md);

  process.stdout.write(`${JSON.stringify({
    decision,
    total_shots: rows.length,
    actionable_shots: actionable.length,
    counts,
    report_json: rel(outJson),
    report_md: rel(outMd),
    report_csv: rel(outCsv),
    package_json: rel(packageJson),
    package_md: rel(packageMd),
    package_csv: rel(packageCsv),
  }, null, 2)}\n`);
}

main();
