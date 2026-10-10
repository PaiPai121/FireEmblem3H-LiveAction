const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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
const outJson = path.join(reportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.json");
const outMd = path.join(reportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.md");

const REQUIRED_CHECKS = [
  ["visible_named_only_match", "Only the declared visible_named_only roster is readable in the clip."],
  ["no_unnamed_readable_humans", "No unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears."],
  ["no_illegal_reentry", "Captured, defeated, stood-down, route-cut, or spent characters do not resume active combat."],
  ["capture_continuity_locked", "Hubert stays captured after Shot032F; Dorothea and Bernadetta stay captured after Shot032G."],
  ["teacher_lane_separation", "Hanneman and Manuela are never staged as one allied teacher unit."],
  ["shot034b_empty_objective_only", "Shot034B shows only Byleth and Dimitri; both faculty objective markers stay empty, and Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent."],
  ["shot034g_exhausted_core_only", "Shot034G remains an exhausted Byleth/Dimitri/Dedue core win, not a full-class celebration."],
  ["nonlethal_mock_battle", "The clip remains nonlethal mock-battle choreography with no blood, humiliation, or lethal impacts."],
  ["identity_costume_weapon_lock", "Named identities, academy costumes, training weapons, and props do not drift."],
  ["screen_direction_and_camera_lock", "Screen direction, camera intent, geography, and edit handoff remain consistent."],
  ["end_frame_hold", "The final 0.5 seconds land on the declared end_frame composition."],
  ["no_visible_text_or_watermark", "No subtitles, captions, UI text, watermarks, or logos are visible."],
];

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

function metadataFor(shot) {
  const file = path.join(packageDir, shot.package_dir, "metadata.json");
  return readJson(file, {});
}

function checkTemplate(existing = []) {
  const existingById = new Map((Array.isArray(existing) ? existing : []).map((check) => [check.id, check]));
  return REQUIRED_CHECKS.map(([id, label]) => {
    const previous = existingById.get(id);
    return {
      id,
      label,
      result: previous?.result === "pass" ? "pass" : "pending",
      notes: previous?.result === "pass" ? previous?.notes || "" : "",
    };
  });
}

function buildRow(shot, existingRow, clipRow, motionRow) {
  const metadata = metadataFor(shot);
  const signature = clipSignature(shot.expected_clip);
  const clipExists = Boolean(signature);
  const reviewFrames = motionRow?.review_frames || {};
  const previousSignature = existingRow?.clip_signature || null;
  const signatureUnchanged = clipExists
    && previousSignature
    && previousSignature.size_bytes === signature.size_bytes
    && previousSignature.mtime_ms === signature.mtime_ms
    && previousSignature.sha256
    && signature.sha256
    && previousSignature.sha256 === signature.sha256;
  const previousPassed = signatureUnchanged && existingRow?.decision === "motion_review_passed";
  const previousBlocked = signatureUnchanged && ["blocked_needs_revision", "rejected"].includes(existingRow?.decision);

  let decision = "pending_clip";
  if (clipExists && previousPassed) decision = "motion_review_passed";
  else if (clipExists && previousBlocked) decision = existingRow.decision;
  else if (clipExists) decision = "needs_codex_motion_review";

  const checks = previousPassed || previousBlocked
    ? checkTemplate(existingRow?.checks)
    : checkTemplate([]);

  return {
    order: shot.order,
    shot: shot.shot,
    id: shot.id,
    expected_clip: shot.expected_clip,
    clip_exists: clipExists,
    clip_signature: signature,
    clip_file_qa: clipRow?.clip || null,
    motion_review_asset_status: motionRow?.status || "missing_clip",
    review_frames: {
      start: reviewFrames.start || null,
      mid: reviewFrames.mid || null,
      end: reviewFrames.end || null,
    },
    visible_named_only: shot.visible_named_only || metadata.visible_named_only || [],
    primary_check: shot.primary_check || metadata.primary_check || "",
    battle_state_after: metadata.battle_state_after || {},
    decision,
    reviewed_by: previousPassed || previousBlocked ? existingRow.reviewed_by || "codex_self_audit" : null,
    reviewed_at: previousPassed || previousBlocked ? existingRow.reviewed_at || null : null,
    checks,
    reviewer_notes: previousPassed || previousBlocked ? existingRow.reviewer_notes || "" : "",
    required_hard_reject_context: [
      "Do not pass any clip containing unnamed readable people.",
      "Do not pass any clip that reactivates Hubert after Shot032F capture.",
      "Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture.",
      "Do not pass any clip that stages Hanneman and Manuela as same-side partners.",
      "Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.",
    ],
  };
}

function reportDecision(rows) {
  const missing = rows.filter((row) => !row.clip_exists);
  const passed = rows.filter((row) => row.decision === "motion_review_passed");
  const blocked = rows.filter((row) => ["blocked_needs_revision", "rejected"].includes(row.decision));
  const reviewNeeded = rows.filter((row) => row.clip_exists && row.decision === "needs_codex_motion_review");
  if (missing.length === rows.length) return "clips_pending";
  if (blocked.length) return "motion_review_blocked_needs_revision";
  if (missing.length) return "motion_review_pending_clips_missing";
  if (reviewNeeded.length) return "motion_review_required";
  if (passed.length === rows.length) return "motion_review_passed_ready_for_concat";
  return "motion_review_required";
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const clipQa = readJson(clipQaPath, { rows: [] });
  const motionAssets = readJson(motionAssetsPath, { rows: [] });
  const existing = readJson(outJson, { rows: [] });
  const existingById = new Map((existing.rows || []).map((row) => [row.id, row]));
  const clipById = new Map((clipQa.rows || []).map((row) => [row.id, row]));
  const motionById = new Map((motionAssets.rows || []).map((row) => [row.id, row]));
  const rows = manifest.shots.map((shot) => buildRow(shot, existingById.get(shot.id), clipById.get(shot.id), motionById.get(shot.id)));
  const decision = reportDecision(rows);
  const summary = {
    expected_clips: rows.length,
    clip_exists: rows.filter((row) => row.clip_exists).length,
    pending_clip: rows.filter((row) => row.decision === "pending_clip").length,
    needs_codex_motion_review: rows.filter((row) => row.decision === "needs_codex_motion_review").length,
    motion_review_passed: rows.filter((row) => row.decision === "motion_review_passed").length,
    blocked_or_rejected: rows.filter((row) => ["blocked_needs_revision", "rejected"].includes(row.decision)).length,
  };
  const report = {
    date,
    package_manifest: rel(manifestPath),
    clip_qa_report: fs.existsSync(clipQaPath) ? rel(clipQaPath) : null,
    motion_review_assets_report: fs.existsSync(motionAssetsPath) ? rel(motionAssetsPath) : null,
    decision,
    summary,
    required_checks: REQUIRED_CHECKS.map(([id, label]) => ({ id, label })),
    rows,
  };

  writeJson(outJson, report);
  writeText(outMd, [
    "# Scene09 V3 Clip Motion Review Decisions",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    "",
    "## Counts",
    "",
    `- Expected clips: ${summary.expected_clips}`,
    `- Existing clips: ${summary.clip_exists}`,
    `- Pending clips: ${summary.pending_clip}`,
    `- Needs Codex motion review: ${summary.needs_codex_motion_review}`,
    `- Motion review passed: ${summary.motion_review_passed}`,
    `- Blocked or rejected: ${summary.blocked_or_rejected}`,
    "",
    "## Required Checks",
    "",
    ...REQUIRED_CHECKS.map(([id, label]) => `- ${id}: ${label}`),
    "",
    "## Rows",
    "",
    ...rows.map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot}: ${row.decision} (${row.expected_clip})`),
    "",
    "A real clip may not be promoted or concatenated unless its row is `motion_review_passed` and every required check is `pass`.",
    "",
  ].join("\n"));

  process.stdout.write(`${JSON.stringify({
    decision,
    summary,
    report_json: rel(outJson),
    report_md: rel(outMd),
  }, null, 2)}\n`);
}

main();
