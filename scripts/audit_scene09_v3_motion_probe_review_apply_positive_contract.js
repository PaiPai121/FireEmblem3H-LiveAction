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
const sourceReportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(sourceReportDir, `scene09_v3_motion_probe_review_apply_positive_contract_${date}.json`);
const outMd = path.join(sourceReportDir, `scene09_v3_motion_probe_review_apply_positive_contract_${date}.md`);
const packageOutJson = path.join(sourcePackageDir, "motion_probe_review_apply_positive_contract.json");
const packageOutMd = path.join(sourcePackageDir, "motion_probe_review_apply_positive_contract.md");

const REQUIRED_CHECK_IDS = [
  "identity_preserved",
  "wardrobe_preserved",
  "training_weapons_preserved",
  "visible_named_only_passed",
  "no_extra_people_passed",
  "no_subtitles_visible_text_passed",
  "teacher_separation_respected",
  "post_shot_ledger_respected",
  "motion_continuity_passed",
  "approve_full_duration",
];

function readJson(file, fallback = null) {
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

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function script(name) {
  return path.join(root, "scripts", name);
}

function runNode(tmpRoot, name, args = [], options = {}) {
  const result = cp.spawnSync(process.execPath, [script(name), ...args], {
    cwd: tmpRoot,
    encoding: "utf8",
    env: { ...process.env, ...(options.env || {}) },
  });
  return result;
}

function createTinyProbeMp4(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const result = cp.spawnSync("ffmpeg", [
    "-y",
    "-f", "lavfi",
    "-i", "color=c=black:s=160x90:r=12:d=3",
    "-an",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    file,
  ], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(`ffmpeg probe fixture failed for ${file}: ${result.error?.message || result.stderr || result.status}`);
  }
}

function parseJsonl(file) {
  return readText(file).trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function writeJsonl(file, rows) {
  writeText(file, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`);
}

function copyFixtureRoot(tmpRoot) {
  fs.cpSync(sourcePackageDir, path.join(tmpRoot, sourcePackageRel), { recursive: true });
  fs.mkdirSync(path.join(tmpRoot, "production_system"), { recursive: true });
  fs.cpSync(sourceReportDir, path.join(tmpRoot, "production_system/scene09_v3_attrition_package"), { recursive: true });
}

function makeProbeClips(tmpRoot) {
  const probeManifest = readJson(path.join(tmpRoot, sourcePackageRel, "motion_probe_submission/motion_probe_manifest.json"));
  for (const row of probeManifest.rows || []) {
    createTinyProbeMp4(path.join(tmpRoot, row.expected_probe_clip));
  }
  return probeManifest.rows.length;
}

function requireSuccess(result, label, problems) {
  if (result.status !== 0) {
    problems.push(`${label} exited ${result.status}: ${(result.stderr || result.stdout || "").trim().split(/\n/).slice(-6).join(" ")}`);
    return false;
  }
  return true;
}

function preparePositiveFixture(tmpRoot, problems) {
  copyFixtureRoot(tmpRoot);
  const expected = makeProbeClips(tmpRoot);
  requireSuccess(runNode(tmpRoot, "audit_scene09_v3_motion_probe_generated_clips.js"), "probe structural audit", problems);
  requireSuccess(runNode(tmpRoot, "build_scene09_v3_motion_probe_review_packet.js"), "probe review packet build", problems);
  requireSuccess(runNode(tmpRoot, "audit_scene09_v3_motion_probe_review_packet.js"), "probe review packet audit", problems);
  return expected;
}

function buildProposal(tmpRoot, mutate = null) {
  const templatePath = path.join(tmpRoot, sourcePackageRel, "motion_probe_review/decision_update_template.jsonl");
  const manifest = readJson(path.join(tmpRoot, sourcePackageRel, "motion_probe_review/motion_probe_review_manifest.json"));
  const packetById = new Map((manifest.rows || []).map((row) => [row.id, row]));
  const rows = parseJsonl(templatePath).map((row) => {
    const packetRow = packetById.get(row.id);
    const next = {
      ...row,
      probe_clip_signature: packetRow.clip_signature,
      decision: "probe_motion_passed",
      reviewed_by: "codex_probe_review",
      reviewed_at: "2026-08-01T00:00:00.000Z",
      review_evidence: {
        probe_clip_reviewed: true,
        review_frames_checked: { start: true, mid: true, end: true },
        review_frame_signatures: packetRow.review_frame_signatures,
        probe_clip_signature_verified: true,
      },
      checks: REQUIRED_CHECK_IDS.map((id) => ({
        id,
        result: "pass",
        notes: "positive-contract fixture proves the gate accepts current signed probe evidence; not production visual approval",
      })),
      approve_full_duration: true,
      reviewer_notes: "Positive-contract fixture proving the probe apply gate accepts current signed Codex evidence and writes release only in this temporary copy.",
    };
    return next;
  });
  if (mutate) mutate(rows);
  const proposal = path.join(tmpRoot, `proposal_${crypto.randomBytes(4).toString("hex")}.jsonl`);
  writeJsonl(proposal, rows);
  return proposal;
}

function runApply(tmpRoot, proposal, apply = false) {
  return runNode(tmpRoot, "apply_scene09_v3_motion_probe_review_decisions.js", [
    proposal,
    ...(apply ? ["--apply"] : []),
  ]);
}

function loadApplyReport(tmpRoot) {
  return readJson(path.join(tmpRoot, "production_system/scene09_v3_attrition_package/scene09_v3_motion_probe_review_apply_gate_2026-08-01.json"), {});
}

function negativeCase(tmpRoot, name, mutate, expectedText) {
  const proposal = buildProposal(tmpRoot, mutate);
  const result = runApply(tmpRoot, proposal, false);
  const report = loadApplyReport(tmpRoot);
  return {
    name,
    rejected: result.status !== 0 &&
      report.decision === "motion_probe_review_apply_blocked_invalid_proposal" &&
      String((report.problems || []).join("\n")).includes(expectedText),
    status: result.status,
    decision: report.decision || null,
    problem_excerpt: (report.problems || []).slice(0, 5),
  };
}

function main() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09-probe-apply-positive."));
  const problems = [];
  let report;
  try {
    const expected = preparePositiveFixture(tmpRoot, problems);
    const positiveProposal = buildProposal(tmpRoot);
    const positiveResult = runApply(tmpRoot, positiveProposal, true);
    const positiveReport = loadApplyReport(tmpRoot);
    const releasePath = path.join(tmpRoot, sourcePackageRel, "motion_probe_full_duration_release.json");
    const release = readJson(releasePath, {});

    if (!requireSuccess(positiveResult, "positive probe apply gate", problems)) {
      problems.push(`positive stdout: ${(positiveResult.stdout || "").trim().split(/\n/).slice(-3).join(" ")}`);
    }
    if (positiveReport.decision !== "motion_probe_review_apply_passed") problems.push(`positive decision ${positiveReport.decision || "missing"}`);
    if (positiveReport.release_written !== true) problems.push("positive apply did not write release");
    if (!fs.existsSync(releasePath)) problems.push("release manifest was not written in temp package");
    if (Number(positiveReport.passed_rows || 0) !== expected) problems.push(`positive passed rows ${positiveReport.passed_rows || 0}/${expected}`);
    if (Number(positiveReport.counters?.probe_clip_signature_matched_rows || 0) !== expected) problems.push("probe clip signature counter does not match expected");
    if (Number(positiveReport.counters?.review_frame_signature_matched_rows || 0) !== expected) problems.push("review frame signature counter does not match expected");
    if (Number(positiveReport.counters?.review_evidence_complete_rows || 0) !== expected) problems.push("review evidence counter does not match expected");
    if (Number(positiveReport.counters?.required_checks_complete_rows || 0) !== expected) problems.push("required checks counter does not match expected");
    if (Number(positiveReport.counters?.full_duration_approved_rows || 0) !== expected) problems.push("full duration approval counter does not match expected");
    if (release.decision !== "motion_probe_full_duration_release_passed") problems.push(`release decision ${release.decision || "missing"}`);
    if (Number((release.rows || []).length || 0) !== expected) problems.push(`release rows ${(release.rows || []).length}/${expected}`);
    if (!/^[a-f0-9]{64}$/.test(String(release.release_rows_digest_sha256 || ""))) problems.push("release rows digest is missing");

    const staleClip = negativeCase(
      tmpRoot,
      "stale_probe_clip_signature_rejected",
      (rows) => { rows[0].probe_clip_signature.sha256 = "0".repeat(64); },
      "probe_clip_signature missing, stale, or mismatched",
    );
    const staleFrame = negativeCase(
      tmpRoot,
      "stale_review_frame_signature_rejected",
      (rows) => { rows[0].review_evidence.review_frame_signatures.start.sha256 = "1".repeat(64); },
      "review_frame_signatures.start_stale_or_mismatch",
    );
    const userReview = negativeCase(
      tmpRoot,
      "user_reviewer_rejected",
      (rows) => { rows[0].reviewed_by = "user_operator"; },
      "passed row must be reviewed_by Codex",
    );
    const prematureApproval = negativeCase(
      tmpRoot,
      "approval_without_pass_rejected",
      (rows) => {
        rows[0].decision = "blocked_needs_revision";
        rows[0].approve_full_duration = true;
        rows[0].reviewer_notes = "Blocked negative-contract row intentionally tries to keep full-duration approval enabled.";
      },
      "blocked/rejected row cannot approve full duration",
    );
    const negativeCases = [staleClip, staleFrame, userReview, prematureApproval];
    for (const item of negativeCases) {
      if (!item.rejected) problems.push(`${item.name} was not rejected as expected: ${item.decision || "missing"}`);
    }

    report = {
      date,
      decision: problems.length
        ? "motion_probe_review_apply_positive_contract_blocked"
        : "motion_probe_review_apply_positive_contract_passed",
      scope: "temporary probe clips and review frames only; production expected clips are untouched",
      source_package: sourcePackageRel,
      temp_fixture_cleaned: true,
      expected_probe_clips: expected,
      positive: {
        status: positiveResult.status,
        decision: positiveReport.decision || null,
        release_written: positiveReport.release_written === true,
        passed_rows: positiveReport.passed_rows || 0,
        counters: positiveReport.counters || {},
        release_rows: (release.rows || []).length || 0,
        release_rows_digest_sha256: release.release_rows_digest_sha256 || null,
      },
      negative_cases: negativeCases,
      production_safety: {
        source_package_probe_release_exists: fs.existsSync(path.join(sourcePackageDir, "motion_probe_full_duration_release.json")),
        source_expected_probe_clips_existing: (readJson(path.join(sourcePackageDir, "motion_probe_clip_structural_audit.json"), {}).playable_probe_clips || 0),
      },
      problems,
    };
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }

  writeJson(outJson, report);
  writeJson(packageOutJson, {
    ...report,
    production_report_json: rel(outJson),
  });
  const md = [
    "# Scene09 V3 Motion Probe Review Apply Positive Contract",
    "",
    `Date: ${date}`,
    `Decision: ${report.decision}`,
    "",
    "This audit runs the real probe review apply gate against temporary 3-second probe clips and extracted review frames. It proves the gate has a positive path when 42/42 probe clips, signed probe clip SHA-256 evidence, signed start/mid/end review-frame evidence, Codex reviewer identity, reviewer notes, and all required pass checks are present. It does not write production probe clips or production full-duration release.",
    "",
    "## Positive Path",
    "",
    `- Expected probe clips: ${report.expected_probe_clips}`,
    `- Apply decision: ${report.positive.decision}`,
    `- Release written in temp package: ${report.positive.release_written ? "yes" : "no"}`,
    `- Passed rows: ${report.positive.passed_rows}`,
    `- Probe signature matched rows: ${report.positive.counters.probe_clip_signature_matched_rows || 0}`,
    `- Review-frame signature matched rows: ${report.positive.counters.review_frame_signature_matched_rows || 0}`,
    `- Review evidence complete rows: ${report.positive.counters.review_evidence_complete_rows || 0}`,
    `- Required checks complete rows: ${report.positive.counters.required_checks_complete_rows || 0}`,
    "",
    "## Negative Cases",
    "",
    ...report.negative_cases.map((item) => `- ${item.name}: ${item.rejected ? "rejected" : "NOT REJECTED"} (${item.decision || "missing"})`),
    "",
    "## Production Safety",
    "",
    `- Production full-duration probe release exists: ${report.production_safety.source_package_probe_release_exists ? "yes" : "no"}`,
    `- Production playable probe clips: ${report.production_safety.source_expected_probe_clips_existing}`,
    "",
    "## Problems",
    "",
    report.problems.length ? report.problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);
  console.log(JSON.stringify({
    decision: report.decision,
    expected_probe_clips: report.expected_probe_clips,
    positive_decision: report.positive.decision,
    positive_passed_rows: report.positive.passed_rows,
    negative_rejections: report.negative_cases.filter((item) => item.rejected).length,
    production_release_exists: report.production_safety.source_package_probe_release_exists,
    problems: report.problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));
  process.exit(report.problems.length ? 1 : 0);
}

main();
