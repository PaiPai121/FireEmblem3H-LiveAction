#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const templatePath = path.join(packageDir, "motion_self_audit", "decision_update_template.jsonl");
const applyGateScript = path.join(root, "scripts/apply_scene09_v3_motion_self_audit_decisions.js");
const outJson = path.join(reportDir, `scene09_v3_motion_self_audit_unsigned_evidence_rejection_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_motion_self_audit_unsigned_evidence_rejection_${date}.md`);
const packageOutJson = path.join(packageDir, "motion_self_audit_unsigned_evidence_rejection.json");
const packageOutMd = path.join(packageDir, "motion_self_audit_unsigned_evidence_rejection.md");

function readJsonl(file) {
  return fs.readFileSync(file, "utf8")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
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

function runNode(args) {
  return cp.spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
  });
}

function parseLastJson(stdout) {
  const trimmed = String(stdout || "").trim();
  if (!trimmed) return null;
  return JSON.parse(trimmed);
}

function makeUnsignedPassedRows(rows) {
  const reviewedAt = new Date().toISOString();
  return rows.map((row) => ({
    ...row,
    decision: "motion_review_passed",
    reviewed_by: "codex_self_audit",
    reviewed_at: reviewedAt,
    review_evidence: {
      full_clip_reviewed: true,
      review_frames_checked: {
        start: true,
        mid: true,
        end: true,
      },
      review_frame_signatures: {
        start: null,
        mid: null,
        end: null,
      },
      clip_signature_verified: true,
    },
    checks: (row.checks || []).map((check) => ({
      ...check,
      result: "pass",
      notes: "Negative regression fixture: booleans are true but clip/frame signatures remain unsigned.",
    })),
    reviewer_notes: "Negative regression fixture: this proposal must be rejected because clip and review-frame signatures are missing.",
  }));
}

function main() {
  const problems = [];
  const warnings = [];
  const rows = readJsonl(templatePath);
  const expected = rows.length;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "scene09-unsigned-evidence-"));
  const badProposal = path.join(tempDir, "unsigned_passed_proposal.jsonl");
  const badRows = makeUnsignedPassedRows(rows);
  writeText(badProposal, badRows.map((row) => JSON.stringify(row)).join("\n") + "\n");

  const probe = runNode([
    rel(applyGateScript),
    badProposal,
  ]);
  let probeSummary = null;
  try {
    probeSummary = parseLastJson(probe.stdout);
  } catch (error) {
    problems.push(`failed to parse apply gate probe stdout: ${error.message}`);
  }

  const probeReportPath = path.join(packageDir, "motion_self_audit_apply_gate.json");
  const probeReport = fs.existsSync(probeReportPath)
    ? JSON.parse(fs.readFileSync(probeReportPath, "utf8"))
    : { problems: [] };
  const frameSignatureProblems = (probeReport.problems || [])
    .filter((item) => /review_frame_signatures\.(start|mid|end)/.test(item));
  const frameSignatureRejectionLabels = frameSignatureProblems.reduce((count, item) => {
    const matches = String(item).match(/review_frame_signatures\.(start|mid|end)/g);
    return count + (matches ? matches.length : 0);
  }, 0);
  const clipSignatureProblems = (probeReport.problems || [])
    .filter((item) => /proposal clip_signature is missing|proposal clip_signature is stale/.test(item));

  if (probe.status === 0) problems.push("unsigned evidence probe unexpectedly exited 0");
  if (probeSummary?.applied === true || probeReport.applied === true) problems.push("unsigned evidence probe unexpectedly applied decisions");
  if (!/^motion_self_audit_apply_blocked_/.test(probeSummary?.decision || probeReport.decision || "")) {
    problems.push(`unsigned evidence probe decision was ${probeSummary?.decision || probeReport.decision || "missing"}, expected blocked`);
  }
  if (frameSignatureRejectionLabels < expected * 3) {
    problems.push(`frame signature rejection count ${frameSignatureRejectionLabels} is less than expected ${expected * 3}`);
  }
  if (clipSignatureProblems.length < expected) {
    problems.push(`clip signature rejection count ${clipSignatureProblems.length} is less than expected ${expected}`);
  }

  const restore = runNode([rel(applyGateScript)]);
  let restoreSummary = null;
  try {
    restoreSummary = parseLastJson(restore.stdout);
  } catch (error) {
    problems.push(`failed to parse restored default apply gate stdout: ${error.message}`);
  }
  if (restoreSummary?.proposal_rows !== expected) {
    problems.push(`restored default apply gate proposal rows ${restoreSummary?.proposal_rows || 0} does not match ${expected}`);
  }
  if (restoreSummary?.applied === true) {
    problems.push("restored default apply gate unexpectedly applied decisions while clips are pending");
  }
  if (restore.status === 0) {
    warnings.push("restored default apply gate exited 0; this is only expected after real clips and valid Codex motion review exist");
  }

  fs.rmSync(tempDir, { recursive: true, force: true });

  const decision = problems.length
    ? "motion_self_audit_unsigned_evidence_rejection_failed"
    : "motion_self_audit_unsigned_evidence_rejection_passed";
  const report = {
    date,
    decision,
    expected_rows: expected,
    bad_proposal_fixture: {
      rows: badRows.length,
      intent: "motion_review_passed rows with booleans set true but null clip/frame signatures",
    },
    probe: {
      exit_status: probe.status,
      decision: probeSummary?.decision || probeReport.decision || null,
      applied: probeSummary?.applied ?? probeReport.applied ?? null,
      problems: probeSummary?.problems ?? (probeReport.problems || []).length,
      frame_signature_rejections: frameSignatureRejectionLabels,
      clip_signature_rejections: clipSignatureProblems.length,
    },
    restored_default_apply_gate: {
      exit_status: restore.status,
      decision: restoreSummary?.decision || null,
      applied: restoreSummary?.applied ?? null,
      proposal_rows: restoreSummary?.proposal_rows ?? null,
      problems: restoreSummary?.problems ?? null,
    },
    reports_restored_to_default_proposal: restoreSummary?.proposal_rows === expected && restoreSummary?.applied !== true,
    problems,
    warnings,
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Motion Self-Audit Unsigned Evidence Rejection",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Rows tested: ${expected}`,
    "",
    "This negative regression test builds a bad proposal where every row claims `motion_review_passed` and sets review booleans to true, but leaves the current clip signature and start/mid/end frame signatures unsigned. The real apply gate must reject it.",
    "",
    "## Probe",
    "",
    `- Apply gate decision: ${report.probe.decision}`,
    `- Applied: ${report.probe.applied ? "yes" : "no"}`,
    `- Frame signature rejections: ${report.probe.frame_signature_rejections}`,
    `- Clip signature rejections: ${report.probe.clip_signature_rejections}`,
    `- Default apply gate restored: ${report.reports_restored_to_default_proposal ? "yes" : "no"}`,
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
    rows_tested: expected,
    frame_signature_rejections: frameSignatureRejectionLabels,
    clip_signature_rejections: clipSignatureProblems.length,
    restored_default_apply_gate: report.reports_restored_to_default_proposal,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));

  if (problems.length) process.exit(1);
}

main();
