#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const outRel = `${pkgRel}/motion_self_audit`;
const outDir = path.join(root, outRel);
const packageManifestPath = path.join(pkgDir, "package_manifest.json");
const decisionsPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_motion_review_decisions_2026-07-28.json");
const battleLedgerPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json");
const runbookPath = path.join(pkgDir, "RUNBOOK.md");

function readJson(file, fallback = null) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
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

function sha256(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function rel(file) {
  return path.relative(root, file);
}

function fileSignature(relativeFile) {
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

function clipSignature(expectedClip) {
  const signature = fileSignature(expectedClip);
  if (!signature) return null;
  const { path: _path, ...clipOnly } = signature;
  return clipOnly;
}

function csvCell(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function listGroups(groups = {}) {
  return Object.entries(groups)
    .map(([group, names]) => `${group}: ${(names || []).join(", ") || "none"}`)
    .join("; ") || "none";
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

function normalizeCheckId(id) {
  if (id === "shot034b_hanneman_single_lane_only") return "shot034b_empty_objective_only";
  return id;
}

function hardRejectsFor(row, decisionRow, ledgerRow) {
  const base = [
    `Visible named-only must stay exactly: ${(row.visible_named_only || []).join(", ") || "none"}.`,
    "Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears.",
    "Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat.",
    "Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain.",
    `Alive / Safe After this shot: ${listGroups(ledgerRow?.alive_by_house)}.`,
    `Active / Controlling After this shot: ${listGroups(ledgerRow?.active_by_house)}.`,
    `Captured / Objective-Defeated After this shot: ${listGroups(ledgerRow?.captured_objective_defeated_by_house)}.`,
    `Must Not Return Active after this shot: ${listGroups(ledgerRow?.must_not_return_active_by_house)}.`,
    `No-Active-Combat Line after this shot: ${ledgerRow?.no_active_combat_line || "none"}.`,
  ];
  if (row.shot === "Shot034B") {
    base.push("Shot034B hard lock: only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman and Manuela are absent/offscreen/silent/unpaired.");
  }
  if (row.shot === "Shot034G") {
    base.push("Shot034G hard lock: exhausted Byleth, Dimitri, Dedue core only; no full Blue Lions class celebration or reset.");
  }
  return [...base, ...(decisionRow?.required_hard_reject_context || [])]
    .map((line) => String(line || "")
      .replace(/Do not pass Shot034B unless only Byleth, Dimitri, and Hanneman are readable; Hanneman is alone on his own faculty lane\/platform; Manuela, students, extras, spectators, crowds, and readable silhouettes are absent\./g,
        "Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent."))
    .filter((line, index, arr) => line && arr.indexOf(line) === index);
}

function updateRunbook() {
  const runbook = readText(runbookPath);
  const section = [
    "## Codex Motion Self-Audit Packet",
    "",
    "- After real clips are imported and the pipeline extracts start/mid/end review frames, use `motion_self_audit/motion_self_audit_matrix.csv` and `motion_self_audit/decision_update_template.jsonl` for Codex self-audit.",
    "- Do not ask the user to approve motion rows; Codex must inspect the clip and extracted frames against every required check.",
    "- To write reviewed rows back, run `node scripts/apply_scene09_v3_motion_self_audit_decisions.js delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_self_audit/decision_update_template.jsonl --apply`; this refuses to apply while real clips or review frames are missing.",
    "- Reviewed rows must preserve the current clip SHA-256 signature and the current start/mid/end review-frame SHA-256 signatures from the template; stale clip or frame evidence is rejected.",
    "- Reviewed rows must include current start/mid/end frame signatures; stale clip or frame evidence is rejected before any motion pass can count.",
    "- Each reviewed row must keep `review_evidence.review_frame_signatures.start/mid/end` bound to the extracted review frames.",
    "- A clip can only move toward concatenation when every row is `motion_review_passed` and every required check is `pass`.",
    "",
  ].join("\n");
  const next = runbook.includes("## Codex Motion Self-Audit Packet")
    ? runbook.replace(/## Codex Motion Self-Audit Packet\n[\s\S]*?(?=\n## )/, section.trimEnd())
    : runbook.replace("\n## Post-Generation QA\n", `\n${section}\n## Post-Generation QA\n`);
  writeText(runbookPath, next);
}

function main() {
  const manifest = readJson(packageManifestPath, { shots: [] });
  const decisions = readJson(decisionsPath, { rows: [], required_checks: [] });
  const ledger = readJson(battleLedgerPath, { rows: [] });
  const decisionsById = new Map((decisions.rows || []).map((row) => [row.id, row]));
  const ledgerByShot = new Map((ledger.rows || []).map((row) => [row.shot, row]));

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const rows = (manifest.shots || []).map((shot) => {
    const decisionRow = decisionsById.get(shot.id) || {};
    const ledgerRow = ledgerByShot.get(shot.shot) || {};
    const requiredChecks = (decisionRow.checks || decisions.required_checks || []).map((check) => normalizeCheckId(check.id || check));
    const reviewFrames = {
      start: decisionRow.review_frames?.start || "",
      mid: decisionRow.review_frames?.mid || "",
      end: decisionRow.review_frames?.end || "",
    };
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
      current_clip_signature: clipSignature(shot.expected_clip),
      current_review_frame_signatures: {
        start: fileSignature(reviewFrames.start),
        mid: fileSignature(reviewFrames.mid),
        end: fileSignature(reviewFrames.end),
      },
      package_dir: shot.package_dir,
      clip_exists: Boolean(decisionRow.clip_exists),
      current_motion_decision: decisionRow.decision || "pending_clip",
      visible_named_only: shot.visible_named_only || [],
      primary_check: shot.primary_check || "",
      review_frame_start: reviewFrames.start,
      review_frame_mid: reviewFrames.mid,
      review_frame_end: reviewFrames.end,
      battle_ledger_after: ledgerSnapshot(ledgerRow),
      alive_safe_after: listGroups(ledgerRow.alive_by_house),
      active_after: listGroups(ledgerRow.active_by_house),
      limited_after: listGroups(ledgerRow.limited_by_house),
      defeated_removed_after: listGroups(ledgerRow.defeated_removed_by_house),
      captured_objective_defeated_after: listGroups(ledgerRow.captured_objective_defeated_by_house),
      stood_down_post_battle_after: listGroups(ledgerRow.stood_down_post_battle_by_house),
      must_not_return_active_after: listGroups(ledgerRow.must_not_return_active_by_house),
      changed_this_shot: (ledgerRow.changed_this_shot || []).map((item) => `${item.name}:${item.status}`).join("; "),
      no_active_combat_line: ledgerRow.no_active_combat_line || "",
      required_checks: requiredChecks,
      hard_rejects: hardRejectsFor(shot, decisionRow, ledgerRow),
    };
  });

  const csvHeader = [
    "order",
    "shot",
    "id",
    "expected_clip",
    "current_clip_signature",
    "current_motion_decision",
    "visible_named_only",
    "review_frame_start",
    "review_frame_mid",
    "review_frame_end",
    "review_frame_signature_start",
    "review_frame_signature_mid",
    "review_frame_signature_end",
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
    "required_checks",
    "hard_rejects",
    "codex_review_decision",
    "codex_review_notes",
  ];
  const csvRows = rows.map((row) => [
    row.order,
    row.shot,
    row.id,
    row.expected_clip,
    row.current_clip_signature,
    row.current_motion_decision,
    (row.visible_named_only || []).join("; "),
    row.review_frame_start,
    row.review_frame_mid,
    row.review_frame_end,
    row.current_review_frame_signatures.start,
    row.current_review_frame_signatures.mid,
    row.current_review_frame_signatures.end,
    row.battle_ledger_after,
    row.alive_safe_after,
    row.active_after,
    row.limited_after,
    row.defeated_removed_after,
    row.captured_objective_defeated_after,
    row.stood_down_post_battle_after,
    row.must_not_return_active_after,
    row.changed_this_shot,
    row.no_active_combat_line,
    row.required_checks.join("; "),
    row.hard_rejects.join("; "),
    "",
    "",
  ]);
  writeText(path.join(outDir, "motion_self_audit_matrix.csv"), [csvHeader, ...csvRows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n");

  const jsonl = rows.map((row) => JSON.stringify({
    order: row.order,
    shot: row.shot,
    id: row.id,
    expected_clip: row.expected_clip,
    clip_signature: row.current_clip_signature,
    decision: row.clip_exists ? "needs_codex_motion_review" : "pending_clip",
    reviewed_by: null,
    reviewed_at: null,
    review_evidence: {
      full_clip_reviewed: false,
      review_frames_checked: {
        start: false,
        mid: false,
        end: false,
      },
      review_frame_signatures: row.current_review_frame_signatures,
      clip_signature_verified: false,
    },
    checks: row.required_checks.map((id) => ({ id, result: "pending", notes: "" })),
    reviewer_notes: "",
    battle_ledger_after: row.battle_ledger_after,
    alive_safe_after: row.alive_safe_after,
    active_after: row.active_after,
    limited_after: row.limited_after,
    defeated_removed_after: row.defeated_removed_after,
    captured_objective_defeated_after: row.captured_objective_defeated_after,
    stood_down_post_battle_after: row.stood_down_post_battle_after,
    must_not_return_active_after: row.must_not_return_active_after,
    changed_this_shot: row.changed_this_shot,
    no_active_combat_line: row.no_active_combat_line,
    hard_rejects: row.hard_rejects,
  })).join("\n") + "\n";
  writeText(path.join(outDir, "decision_update_template.jsonl"), jsonl);

  const md = [
    "# Scene09 V3 Codex Motion Self-Audit Packet",
    "",
    "Use this only after real model-generated clips exist and `build_scene09_v3_clip_motion_review_assets.js` has extracted start/mid/end frames.",
    "",
    "Codex must inspect each clip and extracted frame set directly. The user should not be asked to approve continuity, identity, or motion rows.",
    "",
    "## Global Rejects",
    "",
    "- Any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette.",
    "- Any captured, defeated, stood-down, route-cut, or spent character returning to active combat.",
    "- Hanneman and Manuela staged as a same-lane/same-sigil teacher pair.",
    "- Shot034B without exactly Byleth and Dimitri readable, with empty faculty objective markers and Hanneman/Manuela absent.",
    "- Shot034G as a full-class Blue Lions celebration instead of an exhausted core win.",
    "- Blood, lethal impacts, humiliation, subtitles, captions, visible text, or watermark.",
    "",
    "## Files",
    "",
    "- `motion_self_audit_matrix.csv`: full per-shot review matrix.",
    "- `decision_update_template.jsonl`: machine-readable rows for motion decision updates.",
    "- `../motion_self_audit_apply_gate.md/json`: validation report written by the apply gate before any decision rows can be trusted.",
    "",
    "## Apply Gate",
    "",
    "After Codex inspects the real full clip and the extracted start/mid/end review frames for all 42 shots, update `decision_update_template.jsonl` with final `motion_review_passed`, `blocked_needs_revision`, or `rejected` decisions. Keep each row's `clip_signature` bound to the exact current `expected_clip` file size, mtime, and SHA-256; also keep `review_evidence.review_frame_signatures.start/mid/end` bound to the exact current extracted frame paths, file sizes, mtimes, and SHA-256 hashes. Set `review_evidence.full_clip_reviewed`, all `review_evidence.review_frames_checked` flags, and `review_evidence.clip_signature_verified` to `true` only after direct inspection. Then run:",
    "",
    "```bash",
    "node scripts/apply_scene09_v3_motion_self_audit_decisions.js delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_self_audit/decision_update_template.jsonl --apply",
    "```",
    "",
    "The apply gate rejects pending rows, user/operator approvals, missing or stale clip signatures, missing or stale start/mid/end frame signatures, missing frame-review evidence, missing reviewer notes, unsupported decisions, and any passed row without all required checks set to `pass`.",
    "",
    "## Shot Rows",
    "",
    ...rows.map((row) => [
      `### ${String(row.order).padStart(2, "0")} ${row.shot}`,
      "",
      `- Expected clip: ${row.expected_clip}`,
      `- Current clip signature: ${row.current_clip_signature ? JSON.stringify(row.current_clip_signature) : "missing clip"}`,
      `- Current review frame signatures: ${JSON.stringify(row.current_review_frame_signatures)}`,
      `- Visible named-only: ${(row.visible_named_only || []).join(", ") || "none"}`,
      `- Current decision: ${row.current_motion_decision}`,
      `- Alive / Safe After: ${row.alive_safe_after}`,
      `- Active / Controlling After: ${row.active_after}`,
      `- Limited But Not Defeated After: ${row.limited_after}`,
      `- Defeated / Removed After: ${row.defeated_removed_after}`,
      `- Captured / Objective-Defeated After: ${row.captured_objective_defeated_after}`,
      `- Stood Down / Post-Battle After: ${row.stood_down_post_battle_after}`,
      `- Must Not Return Active: ${row.must_not_return_active_after}`,
      `- Changed This Shot: ${row.changed_this_shot || "none"}`,
      `- No-Active-Combat Line: ${row.no_active_combat_line || "none"}`,
      `- Hard rejects: ${row.hard_rejects.join(" | ")}`,
      "",
    ].join("\n")),
  ].join("\n");
  writeText(path.join(outDir, "README.md"), md);

  const packetManifest = {
    version: 1,
    date: new Date().toISOString().slice(0, 10),
    package_id: manifest.package_id,
    status: "motion_self_audit_packet_ready_clips_pending",
    source_motion_decisions: "production_system/scene09_v3_attrition_package/scene09_v3_clip_motion_review_decisions_2026-07-28.json",
    source_battle_ledger: "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json",
    rows: rows.length,
    files: {
      readme: "motion_self_audit/README.md",
      matrix_csv: "motion_self_audit/motion_self_audit_matrix.csv",
      decision_update_template_jsonl: "motion_self_audit/decision_update_template.jsonl",
    },
  };
  writeJson(path.join(outDir, "motion_self_audit_manifest.json"), packetManifest);

  const packageManifest = readJson(packageManifestPath);
  packageManifest.motion_self_audit = "motion_self_audit/motion_self_audit_manifest.json";
  packageManifest.motion_self_audit_dir = "motion_self_audit";
  writeJson(packageManifestPath, packageManifest);
  updateRunbook();

  const files = [
    path.join(outDir, "README.md"),
    path.join(outDir, "motion_self_audit_matrix.csv"),
    path.join(outDir, "decision_update_template.jsonl"),
    path.join(outDir, "motion_self_audit_manifest.json"),
  ];
  console.log(JSON.stringify({
    ok: true,
    decision: "motion_self_audit_packet_ready",
    rows: rows.length,
    directory: outRel,
    files: files.map((file) => ({ path: rel(file), ...sha256(file) })),
  }, null, 2));
}

main();
