#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const packetDir = path.join(root, pkgRel, "motion_self_audit");
const manifestPath = path.join(packetDir, "motion_self_audit_manifest.json");
const matrixPath = path.join(packetDir, "motion_self_audit_matrix.csv");
const templatePath = path.join(packetDir, "decision_update_template.jsonl");
const readmePath = path.join(packetDir, "README.md");
const outPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_motion_self_audit_packet_audit_2026-08-01.json");
const packageOutJson = path.join(root, pkgRel, "motion_self_audit_packet_audit.json");
const packageOutMd = path.join(root, pkgRel, "motion_self_audit_packet_audit.md");

const requiredChecks = [
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

const requiredLedgerFields = [
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

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key);
}

function rowText(row) {
  return JSON.stringify(row);
}

function csvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const ch = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((value) => value !== ""));
}

function main() {
  const problems = [];
  for (const file of [manifestPath, matrixPath, templatePath, readmePath]) {
    if (!fs.existsSync(file)) problems.push(`missing ${path.relative(root, file)}`);
  }
  const manifest = fs.existsSync(manifestPath) ? readJson(manifestPath) : {};
  if (manifest.rows !== 42) problems.push(`manifest rows=${manifest.rows}, expected 42`);

  if (fs.existsSync(matrixPath)) {
    const rows = csvRows(readText(matrixPath));
    if (rows.length !== 43) problems.push(`matrix rows including header=${rows.length}, expected 43`);
    const header = rows[0] || [];
    for (const field of requiredLedgerFields) {
      if (!header.includes(field)) problems.push(`matrix missing ledger column ${field}`);
    }
  }

  let templateRows = [];
  if (fs.existsSync(templatePath)) {
    templateRows = readText(templatePath).trim().split(/\n/).filter(Boolean).map(JSON.parse);
    if (templateRows.length !== 42) problems.push(`template rows=${templateRows.length}, expected 42`);
    for (const row of templateRows) {
      const checks = new Set((row.checks || []).map((check) => check.id));
      for (const id of requiredChecks) {
        if (!checks.has(id)) problems.push(`${row.shot}: missing check ${id}`);
      }
      if (!Object.prototype.hasOwnProperty.call(row, "clip_signature")) {
        problems.push(`${row.shot}: missing clip_signature field in self-audit update template`);
      }
      const evidence = row.review_evidence || {};
      const frames = evidence.review_frames_checked || {};
      for (const key of ["full_clip_reviewed", "clip_signature_verified"]) {
        if (!Object.prototype.hasOwnProperty.call(evidence, key)) {
          problems.push(`${row.shot}: missing review_evidence.${key}`);
        }
      }
      for (const key of ["start", "mid", "end"]) {
        if (!Object.prototype.hasOwnProperty.call(frames, key)) {
          problems.push(`${row.shot}: missing review_evidence.review_frames_checked.${key}`);
        }
      }
      const frameSignatures = evidence.review_frame_signatures || {};
      for (const key of ["start", "mid", "end"]) {
        if (!Object.prototype.hasOwnProperty.call(frameSignatures, key)) {
          problems.push(`${row.shot}: missing review_evidence.review_frame_signatures.${key}`);
        }
      }
      if (!Array.isArray(row.hard_rejects) || !row.hard_rejects.length) problems.push(`${row.shot}: missing hard_rejects`);
      for (const field of requiredLedgerFields) {
        if (!hasOwn(row, field)) problems.push(`${row.shot}: missing ledger field ${field}`);
      }
      if (!row.battle_ledger_after || typeof row.battle_ledger_after !== "object") {
        problems.push(`${row.shot}: battle_ledger_after is not an object`);
      }
      if (!hasOwn(row.battle_ledger_after, "alive_by_house")) {
        problems.push(`${row.shot}: battle_ledger_after missing alive_by_house`);
      }
      const hardRejectText = (row.hard_rejects || []).join("\n");
      if (!/Alive \/ Safe After this shot/.test(hardRejectText)) {
        problems.push(`${row.shot}: hard_rejects missing alive/safe after-shot line`);
      }
      if (!/Active \/ Controlling After this shot/.test(hardRejectText)) {
        problems.push(`${row.shot}: hard_rejects missing active/controlling after-shot line`);
      }
      if (!/Captured \/ Objective-Defeated After this shot/.test(hardRejectText)) {
        problems.push(`${row.shot}: hard_rejects missing captured/objective defeated after-shot line`);
      }
      if (!/Must Not Return Active after this shot/.test(hardRejectText)) {
        problems.push(`${row.shot}: hard_rejects missing must-not-return-active after-shot line`);
      }
      if (!/No-Active-Combat Line after this shot/.test(hardRejectText)) {
        problems.push(`${row.shot}: hard_rejects missing no-active-combat after-shot line`);
      }
      if (row.shot === "Shot034B") {
        const text = rowText(row);
        if (!text.includes("Byleth, Dimitri")) problems.push("Shot034B: missing current visible roster in self-audit template");
        if (!text.includes("both faculty objective markers stay empty")) problems.push("Shot034B: missing empty faculty objective lock");
        if (!text.includes("Hanneman and Manuela are absent")) problems.push("Shot034B: missing teachers absent lock");
      }
      if (row.shot === "Shot032F") {
        const text = rowText(row);
        if (!text.includes("Hubert:captured_by_felix_and_ashe")) problems.push("Shot032F: missing Hubert captured-by-Felix-and-Ashe transition");
        if (!String(row.captured_objective_defeated_after || "").includes("Hubert")) problems.push("Shot032F: captured/objective-defeated after missing Hubert");
      }
      if (row.shot === "Shot032G") {
        const text = rowText(row);
        if (!text.includes("Dorothea:captured_by_leonie_and_claude")) problems.push("Shot032G: missing Dorothea captured-by-Leonie-and-Claude transition");
        if (!text.includes("Bernadetta:captured_by_leonie_and_claude")) problems.push("Shot032G: missing Bernadetta captured-by-Leonie-and-Claude transition");
        if (!String(row.captured_objective_defeated_after || "").includes("Dorothea")) problems.push("Shot032G: captured/objective-defeated after missing Dorothea");
        if (!String(row.captured_objective_defeated_after || "").includes("Bernadetta")) problems.push("Shot032G: captured/objective-defeated after missing Bernadetta");
      }
      if (row.shot === "Shot034G") {
        const text = rowText(row);
        if (!text.includes("Dimitri:surviving_winner_exhausted")) problems.push("Shot034G: missing Dimitri exhausted winner transition");
        if (!text.includes("Dedue:surviving_winner_exhausted")) problems.push("Shot034G: missing Dedue exhausted winner transition");
        if (!String(row.active_after || "").includes("Dimitri") || !String(row.active_after || "").includes("Dedue")) problems.push("Shot034G: active/controlling after missing exhausted Blue Lions core");
      }
    }
  }

  const combinedText = [manifestPath, matrixPath, templatePath, readmePath]
    .filter((file) => fs.existsSync(file))
    .map((file) => readText(file))
    .join("\n");
  if (/Byleth,\s*Dimitri,\s*Hanneman|Single-lane Hanneman|Hanneman is alone on his own faculty lane|34D_Shot034B_hanneman_lane|Hanneman single lane/i.test(combinedText)) {
    problems.push("motion self-audit packet contains deprecated Shot034B Hanneman-lane wording");
  }
  for (const phrase of [
    "Alive / Safe After",
    "Active / Controlling After",
    "Limited But Not Defeated After",
    "Defeated / Removed After",
    "Captured / Objective-Defeated After",
    "Stood Down / Post-Battle After",
    "Must Not Return Active",
    "Changed This Shot",
    "No-Active-Combat Line",
  ]) {
    if (!combinedText.includes(phrase)) problems.push(`motion self-audit packet missing ${phrase}`);
  }

  const result = {
    date: "2026-08-01",
    decision: problems.length ? "motion_self_audit_packet_blocked" : "motion_self_audit_packet_ready",
    rows_checked: templateRows.length,
    problems,
    manifest: path.relative(root, manifestPath),
  };
  writeJson(outPath, result);
  writeJson(packageOutJson, result);
  writeText(packageOutMd, [
    "# Scene09 V3 Motion Self-Audit Packet Audit",
    "",
    `Date: ${result.date}`,
    `Decision: ${result.decision}`,
    `Rows checked: ${result.rows_checked}`,
    `Manifest: \`${result.manifest}\``,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n"));
  console.log(JSON.stringify(result, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
