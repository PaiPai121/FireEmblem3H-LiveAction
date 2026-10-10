#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const payloadPath = path.join(packageDir, "submission_payload.jsonl");
const batchesDir = path.join(packageDir, "model_submission_batches");
const manifestPath = path.join(batchesDir, "batch_manifest.json");
const battleLedgerPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json");
const reportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_model_submission_batches_audit_2026-07-31.json");
const problems = [];

const read = (file) => fs.readFileSync(file, "utf8");
const rows = fs.existsSync(payloadPath) ? read(payloadPath).trim().split(/\n/).filter(Boolean).map((line) => JSON.parse(line)) : [];
const manifest = fs.existsSync(manifestPath) ? JSON.parse(read(manifestPath)) : { batches: [] };
const battleLedger = fs.existsSync(battleLedgerPath) ? JSON.parse(read(battleLedgerPath)) : { rows: [] };
if (rows.length !== 42) problems.push(`payload rows=${rows.length}, expected 42`);
if (manifest.total_shots !== rows.length) problems.push("batch manifest total_shots mismatch");
if (manifest.full_duration_submission_status !== "prepared_locked_probe_release_pending") {
  problems.push(`batch manifest full_duration_submission_status ${manifest.full_duration_submission_status || "missing"} is not prepared_locked_probe_release_pending`);
}
if (!String(manifest.provider_neutral_policy || "").includes("after full_duration_release_gate passes")) {
  problems.push("batch manifest provider_neutral_policy does not mention full_duration_release_gate");
}
if (manifest.source_battle_ledger && manifest.source_battle_ledger !== path.relative(root, battleLedgerPath)) {
  problems.push(`batch manifest source_battle_ledger mismatch: ${manifest.source_battle_ledger}`);
}

const sourceById = new Map(rows.map((row) => [row.custom_id, row]));
const ledgerByShot = new Map((battleLedger.rows || []).map((row) => [row.shot, row]));
const stitched = [];

function groupText(groups) {
  if (!groups || typeof groups !== "object") return "none";
  const out = Object.entries(groups)
    .filter(([, names]) => Array.isArray(names) && names.length)
    .map(([group, names]) => `${group}: ${names.join(", ")}`);
  return out.length ? out.join("; ") : "none";
}

function changeText(changes) {
  const rows = Array.isArray(changes) ? changes : [];
  return rows.length
    ? rows.map((item) => `${item.name || item}:${item.status || item.label || "changed"}`).join("; ")
    : "none";
}

function sameJson(a, b) {
  return JSON.stringify(a || {}) === JSON.stringify(b || {});
}

const batchEnrichedLedgerKeys = new Set([
  "battle_ledger_after",
  "alive_safe_after",
  "visible_but_no_active_combat_after",
  "active_or_objective_after",
  "limited_after",
  "defeated_removed_after",
  "captured_objective_defeated_after",
  "stood_down_post_battle_after",
  "must_not_return_active_after",
  "changed_this_shot",
  "no_active_combat_line",
]);

function sourceFieldsMatch(enriched, source) {
  if (!source) return false;
  return Object.keys(source)
    .filter((key) => !batchEnrichedLedgerKeys.has(key))
    .every((key) => JSON.stringify(enriched[key]) === JSON.stringify(source[key]));
}

function checkLedgerFields(row, batchId) {
  const ledger = ledgerByShot.get(row.shot);
  if (!ledger) {
    problems.push(`${batchId}: missing battle ledger source row for ${row.shot}`);
    return;
  }
  const expectedObject = {
    alive_by_house: ledger.alive_by_house || {},
    active_by_house: ledger.active_by_house || {},
    limited_by_house: ledger.limited_by_house || {},
    defeated_removed_by_house: ledger.defeated_removed_by_house || {},
    captured_objective_defeated_by_house: ledger.captured_objective_defeated_by_house || {},
    stood_down_post_battle_by_house: ledger.stood_down_post_battle_by_house || {},
    must_not_return_active_by_house: ledger.must_not_return_active_by_house || {},
    changed_this_shot: ledger.changed_this_shot || [],
    no_active_combat_line: ledger.no_active_combat_line || "none",
  };
  if (!sameJson(row.battle_ledger_after, expectedObject)) problems.push(`${batchId}: ${row.custom_id} battle_ledger_after mismatch`);
  const expectedText = {
    alive_safe_after: groupText(ledger.alive_by_house),
    visible_but_no_active_combat_after: (() => {
      const active = new Set(Object.values(ledger.active_by_house || ledger.still_active_or_controlling_objective_by_house || {}).flatMap((names) => Array.isArray(names) ? names : []));
      const inactiveVisible = (row.visible_named_only || []).filter((name) => name && !active.has(name));
      return inactiveVisible.length ? inactiveVisible.join(", ") : "none";
    })(),
    active_or_objective_after: groupText(ledger.active_by_house),
    limited_after: groupText(ledger.limited_by_house),
    defeated_removed_after: groupText(ledger.defeated_removed_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: ledger.no_active_combat_line || "none",
  };
  for (const [key, value] of Object.entries(expectedText)) {
    if (row[key] !== value) problems.push(`${batchId}: ${row.custom_id} ${key} mismatch`);
  }
}
for (const batch of manifest.batches || []) {
  for (const key of ["jsonl", "csv", "runbook"]) {
    const file = path.join(packageDir, batch[key] || "");
    if (!fs.existsSync(file)) problems.push(`${batch.batch_id}: missing ${key}`);
    const digestKey = key === "runbook" ? "runbook" : key;
    if (fs.existsSync(file) && batch.sha256?.[digestKey] && crypto.createHash("sha256").update(read(file)).digest("hex") !== batch.sha256[digestKey]) {
      problems.push(`${batch.batch_id}: ${key} sha mismatch`);
    }
  }
  const csv = path.join(packageDir, batch.csv || "");
  if (fs.existsSync(csv)) {
    const header = (read(csv).split(/\n/)[0] || "").split(",");
    for (const column of [
      "alive_safe_after",
      "visible_but_no_active_combat_after",
      "active_or_objective_after",
      "limited_after",
      "defeated_removed_after",
      "captured_objective_defeated_after",
      "stood_down_post_battle_after",
      "must_not_return_active_after",
      "changed_this_shot",
      "no_active_combat_line",
    ]) {
      if (!header.includes(column)) problems.push(`${batch.batch_id}: CSV missing ${column}`);
    }
  }
  const runbook = path.join(packageDir, batch.runbook || "");
  if (fs.existsSync(runbook)) {
    const runbookText = read(runbook);
    for (const phrase of [
      "do not submit this full-duration batch until `full_duration_release_gate` is `full_duration_release_passed`",
      "Full-duration generation is locked until 42/42 returned motion probes pass signed Codex review",
      "motion_probe_full_duration_release.json",
    ]) {
      if (!runbookText.includes(phrase)) problems.push(`${batch.batch_id}: runbook missing release-lock phrase ${phrase}`);
    }
    for (const phrase of [
      "Alive / Safe After:",
      "Visible But No Active Combat After:",
      "Active / Controlling After:",
      "Limited But Not Defeated After:",
      "Defeated / Removed After:",
      "Captured / Objective-Defeated After:",
      "Stood Down / Post-Battle After:",
      "Must Not Return Active:",
      "Changed This Shot:",
      "No-Active-Combat Line:",
    ]) {
      if (!runbookText.includes(phrase)) problems.push(`${batch.batch_id}: runbook missing ${phrase}`);
    }
  }
  const jsonl = path.join(packageDir, batch.jsonl || "");
  const fileRows = fs.existsSync(jsonl) ? read(jsonl).trim().split(/\n/).filter(Boolean).map((line) => JSON.parse(line)) : [];
  for (const row of fileRows) {
    stitched.push(row);
    if (!sourceFieldsMatch(row, sourceById.get(row.custom_id))) problems.push(`${batch.batch_id}: source fields differ for ${row.custom_id}`);
    checkLedgerFields(row, batch.batch_id);
  }
}
if (stitched.length !== rows.length || stitched.some((row, index) => !sourceFieldsMatch(row, rows[index]))) {
  problems.push("stitched batch rows do not reconstruct source payload fields");
}
for (const row of rows) {
  for (const file of Object.values(row.absolute_files || {})) if (!fs.existsSync(file)) problems.push(`${row.custom_id}: missing ${file}`);
}

const shot034B = rows.find((row) => row.shot === "Shot034B");
if (JSON.stringify(shot034B?.visible_named_only || []) !== JSON.stringify(["Byleth", "Dimitri"])) problems.push("Shot034B batch visible lock is not Byleth,Dimitri");
const text = `${shot034B?.prompt_text || ""}\n${shot034B?.negative_prompt_text || ""}\n${(shot034B?.reject_if || []).join("\n")}`;
for (const phrase of [
  "Empty faculty objective ruling",
  "Only these readable humans may appear: Byleth, Dimitri.",
  "Two far-separated faculty objective markers must be empty.",
  "Hanneman and Manuela are absent, offscreen, silent, and unpaired.",
  "No Hanneman voice and no Manuela voice in this shot",
  "Reject if anyone outside Byleth and Dimitri appears.",
  "Reject if Hanneman appears in any readable form.",
  "Reject if Manuela appears in any readable form",
  "no readable Hanneman",
  "no readable Manuela",
]) if (!text.includes(phrase)) problems.push(`Shot034B batch missing ${phrase}`);
if (/Single-lane Hanneman ruling|Only these readable humans may appear: Byleth, Dimitri, Hanneman\.|Hanneman is alone on his own faculty lane\/platform\.|Reject if anyone outside Byleth, Dimitri, and Hanneman appears\.|Reject if Hanneman appears as Dimitri's combat partner|34D_Shot034B_hanneman_lane/.test(text)) {
  problems.push("Shot034B batch contains old Hanneman single-lane wording");
}

const report = {
  date: "2026-08-01",
  package_dir: path.relative(root, packageDir),
  batch_manifest: path.relative(root, manifestPath),
  source_battle_ledger: path.relative(root, battleLedgerPath),
  batches_checked: (manifest.batches || []).length,
  rows_checked: stitched.length,
  source_rows: rows.length,
  problems,
  decision: problems.length ? "blocked_needs_revision" : "model_submission_batches_ready_for_provider_upload",
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (problems.length) process.exit(1);
