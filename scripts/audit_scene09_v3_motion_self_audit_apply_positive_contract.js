#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const sourcePackageRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const sourcePackageDir = path.join(root, sourcePackageRel);
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const battleLedgerPath = path.join(reportDir, "scene09_v3_battle_ledger_timeline_2026-07-28.json");
const outJson = path.join(reportDir, `scene09_v3_motion_self_audit_apply_positive_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_motion_self_audit_apply_positive_contract_${date}.md`);
const packageOutJson = path.join(sourcePackageDir, "motion_self_audit_apply_positive_contract.json");
const packageOutMd = path.join(sourcePackageDir, "motion_self_audit_apply_positive_contract.md");

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

function rel(file) {
  return path.relative(root, file);
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function signature(relativeFile, includePath = false) {
  const absolute = path.join(root, relativeFile);
  const stat = fs.statSync(absolute);
  const base = {
    size_bytes: stat.size,
    mtime_ms: Math.trunc(stat.mtimeMs),
    sha256: crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex"),
  };
  return includePath ? { path: relativeFile, ...base } : base;
}

function createTinyMp4(file) {
  const result = cp.spawnSync("ffmpeg", [
    "-y",
    "-f", "lavfi",
    "-i", "color=c=black:s=160x90:r=12:d=0.2",
    "-an",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    file,
  ], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(`ffmpeg fixture generation failed: ${result.error?.message || result.stderr || result.status}`);
  }
}

function createFixtureReports(tmpRoot, tmpPackage, tmpReport, manifest) {
  const clipsDir = path.join(tmpRoot, "clips");
  const framesDir = path.join(tmpRoot, "review_frames");
  fs.mkdirSync(clipsDir, { recursive: true });
  fs.mkdirSync(framesDir, { recursive: true });
  fs.copyFileSync(battleLedgerPath, path.join(tmpReport, "scene09_v3_battle_ledger_timeline_2026-07-28.json"));

  const templatePath = path.join(tmpPackage, "motion_self_audit", "decision_update_template.jsonl");
  const templateById = new Map(
    fs.readFileSync(templatePath, "utf8")
      .trim()
      .split(/\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .map((row) => [row.id, row])
  );

  const clipRows = [];
  const motionRows = [];
  const proposalRows = [];
  for (const shot of manifest.shots || []) {
    const clipAbs = path.join(clipsDir, `${String(shot.order).padStart(2, "0")}_${shot.shot}.mp4`);
    createTinyMp4(clipAbs);
    shot.expected_clip = rel(clipAbs);
    const frameFiles = {};
    for (const label of ["start", "mid", "end"]) {
      const frameAbs = path.join(framesDir, `${String(shot.order).padStart(2, "0")}_${shot.shot}_${label}.png`);
      fs.writeFileSync(frameAbs, `${shot.id} ${label} review frame\n`);
      frameFiles[label] = rel(frameAbs);
    }
    const clipSig = signature(shot.expected_clip);
    const frameSigs = {
      start: signature(frameFiles.start, true),
      mid: signature(frameFiles.mid, true),
      end: signature(frameFiles.end, true),
    };
    clipRows.push({
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
      clip: {
        exists: true,
        ok: true,
        issue: null,
        size_bytes: clipSig.size_bytes,
        duration_seconds: Number(shot.duration_seconds || 6),
        expected_duration_seconds: Number(shot.duration_seconds || 6),
        duration_delta_seconds: 0,
        codec_name: "h264",
        width: 160,
        height: 90,
      },
    });
    motionRows.push({
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
      status: "review_frames_ready",
      review_frames: frameFiles,
    });
    proposalRows.push({
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
      clip_signature: clipSig,
      decision: "motion_review_passed",
      reviewed_by: "codex_self_audit",
      reviewed_at: "2026-08-01T00:00:00.000Z",
      review_evidence: {
        full_clip_reviewed: true,
        review_frames_checked: { start: true, mid: true, end: true },
        clip_signature_verified: true,
        review_frame_signatures: frameSigs,
      },
      checks: REQUIRED_CHECK_IDS.map((id) => ({
        id,
        result: "pass",
        notes: "temporary positive-contract fixture; real production rows still require visual inspection",
      })),
      reviewer_notes: "Positive-contract fixture row proving the apply gate accepts current signed evidence; not a production visual approval.",
      battle_ledger_after: templateById.get(shot.id)?.battle_ledger_after || {},
      alive_safe_after: templateById.get(shot.id)?.alive_safe_after || "",
      active_after: templateById.get(shot.id)?.active_after || "",
      limited_after: templateById.get(shot.id)?.limited_after || "",
      defeated_removed_after: templateById.get(shot.id)?.defeated_removed_after || "",
      captured_objective_defeated_after: templateById.get(shot.id)?.captured_objective_defeated_after || "",
      stood_down_post_battle_after: templateById.get(shot.id)?.stood_down_post_battle_after || "",
      must_not_return_active_after: templateById.get(shot.id)?.must_not_return_active_after || "",
      changed_this_shot: templateById.get(shot.id)?.changed_this_shot || "",
      no_active_combat_line: templateById.get(shot.id)?.no_active_combat_line || "none",
    });
  }

  writeJson(path.join(tmpPackage, "package_manifest.json"), manifest);
  writeJson(path.join(tmpReport, "scene09_v3_generated_clip_structural_audit_2026-08-01.json"), {
    date,
    package_manifest: rel(path.join(tmpPackage, "package_manifest.json")),
    expected_clips: manifest.shots.length,
    ready_clips: manifest.shots.length,
    missing_clips: 0,
    failed_clips: 0,
    decision: "clip_files_integrity_passed_motion_review_still_required",
    rows: clipRows,
  });
  writeJson(path.join(tmpReport, "scene09_v3_clip_motion_review_assets_2026-07-28.json"), {
    date: "2026-07-28",
    expected_clips: manifest.shots.length,
    extracted_clips: manifest.shots.length,
    missing_clips: 0,
    failed_clips: 0,
    decision: "motion_review_assets_ready",
    rows: motionRows,
  });
  writeJson(path.join(tmpReport, "scene09_v3_clip_motion_review_decisions_2026-07-28.json"), {
    date: "2026-07-28",
    decision: "motion_review_required",
    summary: {
      expected_clips: manifest.shots.length,
      clip_exists: manifest.shots.length,
      pending_clip: 0,
      needs_codex_motion_review: manifest.shots.length,
      motion_review_passed: 0,
      blocked_or_rejected: 0,
    },
    required_checks: REQUIRED_CHECK_IDS.map((id) => ({ id, label: id })),
    rows: [],
  });
  const proposalPath = path.join(tmpRoot, "positive_decision_update.jsonl");
  writeText(proposalPath, `${proposalRows.map((row) => JSON.stringify(row)).join("\n")}\n`);
  return proposalPath;
}

function main() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_apply_positive."));
  const tmpPackage = path.join(tmpRoot, "package");
  const tmpReport = path.join(tmpRoot, "report");
  fs.cpSync(sourcePackageDir, tmpPackage, { recursive: true });
  fs.mkdirSync(tmpReport, { recursive: true });
  const manifest = readJson(path.join(tmpPackage, "package_manifest.json"));
  const expected = Number(manifest.total_shots || (manifest.shots || []).length || 42);
  const proposalPath = createFixtureReports(tmpRoot, tmpPackage, tmpReport, manifest);
  const result = cp.spawnSync(process.execPath, [
    "scripts/apply_scene09_v3_motion_self_audit_decisions.js",
    proposalPath,
    "--apply",
  ], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: tmpPackage,
      SCENE09_V3_REPORT_DIR: tmpReport,
    },
  });
  const applyReportPath = path.join(tmpReport, "scene09_v3_motion_self_audit_apply_gate_2026-08-01.json");
  const decisionsPath = path.join(tmpReport, "scene09_v3_clip_motion_review_decisions_2026-07-28.json");
  const tmpBattleLedgerPath = path.join(tmpReport, "scene09_v3_battle_ledger_timeline_2026-07-28.json");
  const applyReport = fs.existsSync(applyReportPath) ? readJson(applyReportPath) : {};
  const decisions = fs.existsSync(decisionsPath) ? readJson(decisionsPath) : {};
  const originalBattleLedger = fs.existsSync(tmpBattleLedgerPath) ? readJson(tmpBattleLedgerPath) : {};
  writeJson(tmpBattleLedgerPath, {
    ...originalBattleLedger,
    rows_digest_sha256: "0".repeat(64),
  });
  const staleLedgerResult = cp.spawnSync(process.execPath, [
    "scripts/apply_scene09_v3_motion_self_audit_decisions.js",
    proposalPath,
    "--apply",
  ], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: tmpPackage,
      SCENE09_V3_REPORT_DIR: tmpReport,
    },
  });
  const staleLedgerApplyReport = fs.existsSync(applyReportPath) ? readJson(applyReportPath) : {};
  writeJson(tmpBattleLedgerPath, {
    ...originalBattleLedger,
    state_machine_rows_digest_sha256: "0".repeat(64),
  });
  const staleStateMachineResult = cp.spawnSync(process.execPath, [
    "scripts/apply_scene09_v3_motion_self_audit_decisions.js",
    proposalPath,
    "--apply",
  ], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: tmpPackage,
      SCENE09_V3_REPORT_DIR: tmpReport,
    },
  });
  const staleStateMachineApplyReport = fs.existsSync(applyReportPath) ? readJson(applyReportPath) : {};
  const problems = [];
  if (result.status !== 0) problems.push(`apply gate exited ${result.status}: ${(result.stderr || result.stdout || "").trim().split(/\n/).slice(-5).join(" ")}`);
  if (applyReport.decision !== "motion_self_audit_apply_passed") problems.push(`apply decision ${applyReport.decision || "missing"}`);
  if (applyReport.applied !== true) problems.push("apply report did not mark applied=true");
  if (Number(applyReport.proposal_rows || 0) !== expected) problems.push(`proposal rows ${applyReport.proposal_rows || 0}/${expected}`);
  if (Number(applyReport.summary?.motion_review_passed || 0) !== expected) problems.push(`passed rows ${applyReport.summary?.motion_review_passed || 0}/${expected}`);
  for (const [key, label] of Object.entries({
    clip_signature_matched_rows: "clip signature matched rows",
    review_frame_signature_matched_rows: "review frame signature matched rows",
    review_evidence_complete_rows: "review evidence complete rows",
    ledger_matched_rows: "ledger matched rows",
    required_checks_complete_rows: "required checks complete rows",
  })) {
    if (Number(applyReport.evidence_counters?.[key] || 0) !== expected) {
      problems.push(`${label} ${applyReport.evidence_counters?.[key] || 0}/${expected}`);
    }
  }
  if (decisions.decision !== "motion_review_passed_ready_for_concat") problems.push(`motion decisions decision ${decisions.decision || "missing"}`);
  if (Number(decisions.summary?.motion_review_passed || 0) !== expected) problems.push(`motion decisions passed ${decisions.summary?.motion_review_passed || 0}/${expected}`);
  if (applyReport.battle_ledger_signature?.rows_digest_ok !== true) problems.push("apply gate did not mark battle ledger rows digest ok");
  if (applyReport.battle_ledger_signature?.rows_digest_sha256 !== applyReport.battle_ledger_signature?.current_rows_digest_sha256) problems.push("apply gate battle ledger digest does not match current digest");
  if (!Array.isArray(applyReport.battle_ledger_signature?.rows) ||
      Number(applyReport.battle_ledger_signature.rows.length || 0) !== expected) {
    problems.push(`apply gate battle ledger rows ${applyReport.battle_ledger_signature?.rows?.length || 0}/${expected}`);
  }
  if (staleLedgerResult.status === 0) problems.push("stale battle ledger digest was accepted by apply gate");
  if (staleLedgerApplyReport.decision !== "motion_self_audit_apply_blocked_invalid_proposal") {
    problems.push(`stale ledger decision ${staleLedgerApplyReport.decision || "missing"} is not motion_self_audit_apply_blocked_invalid_proposal`);
  }
  if (!String((staleLedgerApplyReport.problems || []).join("\n")).includes("battle ledger timeline rows digest is missing, stale")) {
    problems.push("stale battle ledger rejection did not report stale digest");
  }
  if (applyReport.battle_ledger_signature?.state_machine_rows_digest_ok !== true) problems.push("apply gate did not mark active-return state-machine digest ok");
  if (applyReport.battle_ledger_signature?.state_machine_rows_digest_sha256 !== applyReport.battle_ledger_signature?.current_state_machine_rows_digest_sha256) {
    problems.push("apply gate active-return state-machine digest does not match current digest");
  }
  if (!Array.isArray(applyReport.battle_ledger_signature?.state_machine_rows) ||
      Number(applyReport.battle_ledger_signature.state_machine_rows.length || 0) !== expected) {
    problems.push(`apply gate active-return state-machine rows ${applyReport.battle_ledger_signature?.state_machine_rows?.length || 0}/${expected}`);
  }
  if (staleStateMachineResult.status === 0) problems.push("stale active-return state-machine digest was accepted by apply gate");
  if (staleStateMachineApplyReport.decision !== "motion_self_audit_apply_blocked_invalid_proposal") {
    problems.push(`stale state-machine decision ${staleStateMachineApplyReport.decision || "missing"} is not motion_self_audit_apply_blocked_invalid_proposal`);
  }
  if (!String((staleStateMachineApplyReport.problems || []).join("\n")).includes("battle ledger active-return state-machine digest is missing, stale")) {
    problems.push("stale active-return state-machine rejection did not report stale digest");
  }

  fs.rmSync(tmpRoot, { recursive: true, force: true });

  const report = {
    date,
    decision: problems.length ? "motion_self_audit_apply_positive_contract_blocked" : "motion_self_audit_apply_positive_contract_passed",
    scope: "temporary signed clip/review-frame fixture; no production motion approvals are written",
    source_package: sourcePackageRel,
    temp_package: tmpPackage,
    temp_report_dir: tmpReport,
    temp_fixture_cleaned: true,
    expected_shots: expected,
    apply_gate: {
      status: result.status,
      decision: applyReport.decision || null,
      applied: applyReport.applied === true,
      proposal_rows: applyReport.proposal_rows || 0,
      motion_review_passed: applyReport.summary?.motion_review_passed || 0,
      blocked_or_rejected: applyReport.summary?.blocked_or_rejected || 0,
      evidence_counters: applyReport.evidence_counters || {},
      battle_ledger_signature: applyReport.battle_ledger_signature || {},
    },
    motion_decisions: {
      decision: decisions.decision || null,
      motion_review_passed: decisions.summary?.motion_review_passed || 0,
      blocked_or_rejected: decisions.summary?.blocked_or_rejected || 0,
    },
    stale_battle_ledger_digest_rejection: {
      rejected: staleLedgerResult.status !== 0 &&
        staleLedgerApplyReport.decision === "motion_self_audit_apply_blocked_invalid_proposal",
      status: staleLedgerResult.status,
      stdout: staleLedgerResult.stdout,
      stderr: staleLedgerResult.stderr,
      apply_gate: staleLedgerApplyReport,
      issue: "battle_ledger_rows_digest_mismatch",
    },
    stale_active_return_state_machine_digest_rejection: {
      rejected: staleStateMachineResult.status !== 0 &&
        staleStateMachineApplyReport.decision === "motion_self_audit_apply_blocked_invalid_proposal",
      status: staleStateMachineResult.status,
      stdout: staleStateMachineResult.stdout,
      stderr: staleStateMachineResult.stderr,
      apply_gate: staleStateMachineApplyReport,
      issue: "battle_ledger_state_machine_digest_mismatch",
    },
    problems,
  };
  writeJson(outJson, report);
  writeJson(packageOutJson, {
    ...report,
    temp_package: path.basename(tmpPackage),
    temp_report_dir: path.basename(tmpReport),
    production_report_json: rel(outJson),
  });
  const md = [
    "# Scene09 V3 Motion Self-Audit Apply Positive Contract",
    "",
    `Date: ${date}`,
    `Decision: ${report.decision}`,
    "",
    "This audit runs the real apply gate against a temporary signed fixture. It proves the gate has a positive path when real clips, start/mid/end review frames, current clip SHA-256 signatures, current frame signatures, Codex reviewer identity, notes, and all required pass checks are present. It does not approve production clips.",
    "",
    "## Counts",
    "",
    `- Expected shots: ${expected}`,
    `- Proposal rows: ${report.apply_gate.proposal_rows}`,
    `- Applied passed rows: ${report.apply_gate.motion_review_passed}`,
    `- Clip signature matched rows: ${report.apply_gate.evidence_counters.clip_signature_matched_rows || 0}`,
    `- Review-frame signature matched rows: ${report.apply_gate.evidence_counters.review_frame_signature_matched_rows || 0}`,
    `- Review evidence complete rows: ${report.apply_gate.evidence_counters.review_evidence_complete_rows || 0}`,
    `- Ledger matched rows: ${report.apply_gate.evidence_counters.ledger_matched_rows || 0}`,
    `- Battle ledger rows digest: ${report.apply_gate.battle_ledger_signature.rows_digest_ok ? "ok" : "missing/stale"}`,
    `- Active-return state-machine digest: ${report.apply_gate.battle_ledger_signature.state_machine_rows_digest_ok ? "ok" : "missing/stale"}`,
    `- Required checks complete rows: ${report.apply_gate.evidence_counters.required_checks_complete_rows || 0}`,
    `- Stale battle ledger digest rejected: ${report.stale_battle_ledger_digest_rejection.rejected ? "yes" : "no"}`,
    `- Stale active-return state-machine digest rejected: ${report.stale_active_return_state_machine_digest_rejection.rejected ? "yes" : "no"}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);
  console.log(JSON.stringify({
    decision: report.decision,
    expected_shots: expected,
    proposal_rows: report.apply_gate.proposal_rows,
    applied: report.apply_gate.applied,
    motion_review_passed: report.apply_gate.motion_review_passed,
    battle_ledger_digest_ok: report.apply_gate.battle_ledger_signature.rows_digest_ok === true,
    active_return_state_machine_digest_ok: report.apply_gate.battle_ledger_signature.state_machine_rows_digest_ok === true,
    stale_battle_ledger_rejected: report.stale_battle_ledger_digest_rejection.rejected,
    stale_active_return_state_machine_rejected: report.stale_active_return_state_machine_digest_rejection.rejected,
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
