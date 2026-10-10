#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(reportDir, `scene09_v3_full_duration_release_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_full_duration_release_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "full_duration_release_gate.json");
const packageOutMd = path.join(packageDir, "full_duration_release_gate.md");

function readJson(file, fallback = {}) {
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

function rel(file) {
  return path.relative(root, file);
}

function sha256(file) {
  return fs.existsSync(file)
    ? crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")
    : null;
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function isSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

function rowsDigest(rows) {
  return sha256Text(`${JSON.stringify(rows)}\n`);
}

function main() {
  const manifestPath = path.join(packageDir, "package_manifest.json");
  const probeClipStructuralPath = path.join(packageDir, "motion_probe_clip_structural_audit.json");
  const probeReviewPacketPath = path.join(packageDir, "motion_probe_review_packet_audit.json");
  const probeApplyGatePath = path.join(packageDir, "motion_probe_review_apply_gate.json");
  const probeApplyPositivePath = path.join(packageDir, "motion_probe_review_apply_positive_contract.json");
  const releasePath = path.join(packageDir, "motion_probe_full_duration_release.json");

  const manifest = readJson(manifestPath);
  const probeClipStructural = readJson(probeClipStructuralPath);
  const probeReviewPacket = readJson(probeReviewPacketPath);
  const probeApplyGate = readJson(probeApplyGatePath);
  const probeApplyPositive = readJson(probeApplyPositivePath);
  const release = readJson(releasePath, null);
  const problems = [];
  const blockingItems = [];
  const warnings = [];

  const expected = Number(manifest.total_shots || (manifest.shots || []).length || 0);
  const releaseRows = Array.isArray(release?.rows) ? release.rows : [];
  const releaseDigest = releaseRows.length ? rowsDigest(releaseRows) : null;
  const releaseDigestOk = releaseRows.length > 0 &&
    isSha256(release?.release_rows_digest_sha256) &&
    release.release_rows_digest_sha256 === releaseDigest;

  if (expected !== 42) problems.push(`package manifest total_shots ${expected || "missing"} is not 42`);
  if (Number(probeClipStructural.expected_probe_clips || 0) !== expected) {
    problems.push(`probe structural expected_probe_clips ${probeClipStructural.expected_probe_clips || 0} does not match ${expected}`);
  }
  if (Number(probeReviewPacket.expected_probe_clips || 0) !== expected) {
    problems.push(`probe review packet expected_probe_clips ${probeReviewPacket.expected_probe_clips || 0} does not match ${expected}`);
  }
  if (Number(probeApplyGate.expected_probe_clips || 0) !== expected) {
    problems.push(`probe apply gate expected_probe_clips ${probeApplyGate.expected_probe_clips || 0} does not match ${expected}`);
  }
  if (probeApplyPositive.decision !== "motion_probe_review_apply_positive_contract_passed") {
    problems.push(`probe apply positive contract decision ${probeApplyPositive.decision || "missing"} is not motion_probe_review_apply_positive_contract_passed`);
  }
  if (Number(probeApplyPositive.expected_probe_clips || 0) !== expected) {
    problems.push(`probe apply positive contract expected_probe_clips ${probeApplyPositive.expected_probe_clips || 0} does not match ${expected}`);
  }
  if (probeApplyPositive.production_safety?.source_package_probe_release_exists === true && !fs.existsSync(releasePath)) {
    problems.push("probe apply positive contract says production release exists, but package release is missing");
  }

  const probeClipsComplete = probeClipStructural.decision === "motion_probe_clips_structural_passed" &&
    Number(probeClipStructural.playable_probe_clips || 0) === expected &&
    Number(probeClipStructural.missing_probe_clips || 0) === 0 &&
    Number(probeClipStructural.failed_probe_clips || 0) === 0;
  const reviewPacketComplete = probeReviewPacket.decision === "motion_probe_review_packet_ready" &&
    Number(probeReviewPacket.playable_probe_clips || 0) === expected &&
    Number(probeReviewPacket.review_frame_sets_ready || 0) === expected &&
    Number(probeReviewPacket.full_duration_approvals || 0) === expected;
  const applyGatePassed = probeApplyGate.decision === "motion_probe_review_apply_passed" &&
    probeApplyGate.release_written === true &&
    Number(probeApplyGate.passed_rows || 0) === expected &&
    Number(probeApplyGate.counters?.probe_clip_signature_matched_rows || 0) === expected &&
    Number(probeApplyGate.counters?.review_frame_signature_matched_rows || 0) === expected &&
    Number(probeApplyGate.counters?.review_evidence_complete_rows || 0) === expected &&
    Number(probeApplyGate.counters?.ledger_matched_rows || 0) === expected &&
    Number(probeApplyGate.counters?.required_checks_complete_rows || 0) === expected &&
    Number(probeApplyGate.counters?.full_duration_approved_rows || 0) === expected &&
    Number(probeApplyGate.counters?.codex_reviewed_rows || 0) === expected &&
    Number(probeApplyGate.problems?.length || 0) === 0;
  const releaseExists = fs.existsSync(releasePath);
  const releasePassed = releaseExists &&
    release.decision === "motion_probe_full_duration_release_passed" &&
    Number(releaseRows.length || 0) === expected &&
    releaseDigestOk;

  if (!probeClipsComplete) {
    blockingItems.push(`probe clips incomplete: playable ${probeClipStructural.playable_probe_clips || 0}/${expected}, missing ${probeClipStructural.missing_probe_clips ?? expected}, failed ${probeClipStructural.failed_probe_clips || 0}`);
  }
  if (!reviewPacketComplete) {
    blockingItems.push(`probe review evidence incomplete: review frame sets ${probeReviewPacket.review_frame_sets_ready || 0}/${expected}, full-duration approvals ${probeReviewPacket.full_duration_approvals || 0}/${expected}`);
  }
  if (!applyGatePassed) {
    blockingItems.push(`probe apply gate not passed: ${probeApplyGate.decision || "missing"}, passed rows ${probeApplyGate.passed_rows || 0}/${expected}`);
  }
  if (!releasePassed) {
    blockingItems.push(releaseExists
      ? `production full-duration release manifest is present but not valid: rows ${releaseRows.length}/${expected}, digest ${releaseDigestOk ? "ok" : "missing/stale"}`
      : "production full-duration release manifest is absent");
  }

  if (releaseExists && !applyGatePassed) {
    problems.push("production motion_probe_full_duration_release.json exists while the current probe apply gate is not passed");
  }
  if (applyGatePassed && !releaseExists) {
    problems.push("probe apply gate passed but production motion_probe_full_duration_release.json is missing");
  }
  if (releaseExists && !releaseDigestOk) {
    problems.push("production full-duration release rows digest is missing or stale");
  }

  const canReleaseFullDuration = problems.length === 0 &&
    probeClipsComplete &&
    reviewPacketComplete &&
    applyGatePassed &&
    releasePassed;
  const decision = canReleaseFullDuration
    ? "full_duration_release_passed"
    : problems.length
    ? "full_duration_release_integrity_blocked"
    : "full_duration_release_blocked_probe_review_pending";

  const report = {
    date,
    decision,
    can_release_full_duration: canReleaseFullDuration,
    package_id: manifest.package_id || "scene09_v3_monitor_handoff_package_2026-07-27",
    expected_probe_clips: expected,
    playable_probe_clips: Number(probeClipStructural.playable_probe_clips || 0),
    review_frame_sets_ready: Number(probeReviewPacket.review_frame_sets_ready || 0),
    full_duration_approvals: Number(probeReviewPacket.full_duration_approvals || 0),
    probe_apply_gate: {
      decision: probeApplyGate.decision || null,
      release_written: probeApplyGate.release_written === true,
      passed_rows: Number(probeApplyGate.passed_rows || 0),
      counters: probeApplyGate.counters || {},
    },
    release: {
      exists: releaseExists,
      path: rel(releasePath),
      decision: release?.decision || null,
      rows: releaseRows.length,
      rows_digest_sha256: release?.release_rows_digest_sha256 || null,
      current_rows_digest_sha256: releaseDigest,
      rows_digest_ok: releaseDigestOk,
    },
    positive_contract: {
      decision: probeApplyPositive.decision || null,
      temp_positive_decision: probeApplyPositive.positive?.decision || null,
      temp_release_written: probeApplyPositive.positive?.release_written === true,
      production_release_exists_at_positive_audit: probeApplyPositive.production_safety?.source_package_probe_release_exists === true,
      problems: Number(probeApplyPositive.problems?.length || 0),
    },
    blocking_items: blockingItems,
    problems,
    warnings,
    source_files: {
      package_manifest: { path: rel(manifestPath), sha256: sha256(manifestPath) },
      motion_probe_clip_structural_audit: { path: rel(probeClipStructuralPath), sha256: sha256(probeClipStructuralPath) },
      motion_probe_review_packet_audit: { path: rel(probeReviewPacketPath), sha256: sha256(probeReviewPacketPath) },
      motion_probe_review_apply_gate: { path: rel(probeApplyGatePath), sha256: sha256(probeApplyGatePath) },
      motion_probe_review_apply_positive_contract: { path: rel(probeApplyPositivePath), sha256: sha256(probeApplyPositivePath) },
      motion_probe_full_duration_release: { path: rel(releasePath), sha256: sha256(releasePath) },
    },
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);

  const md = [
    "# Scene09 V3 Full-Duration Release Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Can release full-duration generation: ${canReleaseFullDuration ? "yes" : "no"}`,
    `Probe clips playable: ${report.playable_probe_clips}/${expected}`,
    `Review frame sets ready: ${report.review_frame_sets_ready}/${expected}`,
    `Full-duration approvals: ${report.full_duration_approvals}/${expected}`,
    `Production release manifest: ${releaseExists ? "present" : "absent"}`,
    "",
    "Full-duration Scene09 generation is allowed only after the production probe apply gate passes 42/42 Codex-reviewed rows and writes a valid `motion_probe_full_duration_release.json` in this package. The positive contract proves the temporary positive path only; it is not production release evidence.",
    "",
    "## Blocking Items",
    "",
    blockingItems.length ? blockingItems.map((item) => `- ${item}`).join("\n") : "- none",
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
    can_release_full_duration: canReleaseFullDuration,
    expected_probe_clips: expected,
    playable_probe_clips: report.playable_probe_clips,
    review_frame_sets_ready: report.review_frame_sets_ready,
    release_exists: releaseExists,
    blocking_items: blockingItems.length,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));
  if (problems.length) process.exit(1);
}

main();
