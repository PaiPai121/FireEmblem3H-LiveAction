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
const probeReviewDir = path.join(packageDir, "motion_probe_review");
const defaultProposalPath = path.join(probeReviewDir, "decision_update_template.jsonl");
const probeReviewManifestPath = path.join(probeReviewDir, "motion_probe_review_manifest.json");
const probeReviewPacketAuditPath = path.join(packageDir, "motion_probe_review_packet_audit.json");
const probeClipStructuralAuditPath = path.join(packageDir, "motion_probe_clip_structural_audit.json");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const outJson = path.join(reportDir, `scene09_v3_motion_probe_review_apply_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_motion_probe_review_apply_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "motion_probe_review_apply_gate.json");
const packageOutMd = path.join(packageDir, "motion_probe_review_apply_gate.md");
const releaseJson = path.join(packageDir, "motion_probe_full_duration_release.json");

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

const ALLOWED_FINAL_DECISIONS = new Set([
  "probe_motion_passed",
  "blocked_needs_revision",
  "rejected",
]);

function usage() {
  return [
    "Usage:",
    "  node scripts/apply_scene09_v3_motion_probe_review_decisions.js [proposal.jsonl] [--apply]",
    "",
    "The proposal must contain 42 Codex-reviewed probe rows. This gate refuses",
    "full-duration release while returned probe clips, extracted review frames,",
    "signed SHA evidence, reviewer notes, or required pass checks are missing.",
  ].join("\n");
}

function parseArgs(argv) {
  const options = { proposal: defaultProposalPath, apply: false };
  for (const arg of argv) {
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

function abs(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function fileSignature(relativeFile) {
  if (!relativeFile) return null;
  const absolute = abs(relativeFile);
  if (!fs.existsSync(absolute)) return null;
  const stat = fs.statSync(absolute);
  return {
    path: relativeFile,
    size_bytes: stat.size,
    mtime_ms: Math.trunc(stat.mtimeMs),
    sha256: sha256File(absolute),
  };
}

function clipSignature(relativeFile) {
  const signature = fileSignature(relativeFile);
  if (!signature) return null;
  const { path: _path, ...clipOnly } = signature;
  return clipOnly;
}

function sameSignature(a, b) {
  return Boolean(a && b &&
    a.size_bytes === b.size_bytes &&
    a.mtime_ms === b.mtime_ms &&
    a.sha256 &&
    b.sha256 &&
    a.sha256 === b.sha256);
}

function sameFrameSignature(a, b) {
  return Boolean(sameSignature(a, b) && a.path && b.path && a.path === b.path);
}

function sameJson(a, b) {
  return JSON.stringify(a || {}) === JSON.stringify(b || {});
}

function readJsonl(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing proposal JSONL: ${file}`);
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
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

function byId(rows = []) {
  return new Map(rows.map((row) => [row.id, row]));
}

function reviewerLooksLikeCodex(value) {
  return /^(codex|codex_probe_review|codex_self_audit)$/i.test(String(value || ""));
}

function reviewerLooksLikeUser(value) {
  return /(user|operator|client|manual|human)/i.test(String(value || ""));
}

function checkEvidence(row, packetRow) {
  const missing = [];
  const evidence = row.review_evidence || {};
  const frames = evidence.review_frames_checked || {};
  const signatures = evidence.review_frame_signatures || {};
  if (evidence.probe_clip_reviewed !== true) missing.push("probe_clip_reviewed");
  if (evidence.probe_clip_signature_verified !== true) missing.push("probe_clip_signature_verified");
  for (const label of ["start", "mid", "end"]) {
    if (frames[label] !== true) missing.push(`review_frames_checked.${label}`);
    const current = fileSignature(packetRow?.review_frames?.[label]);
    if (!signatures[label]) {
      missing.push(`review_frame_signatures.${label}`);
    } else if (!sameFrameSignature(signatures[label], current)) {
      missing.push(`review_frame_signatures.${label}_stale_or_mismatch`);
    }
  }
  return missing;
}

function rowReleaseDigest(rows) {
  const releaseRows = rows.map((row) => ({
    order: row.order,
    shot: row.shot,
    id: row.id,
    custom_id: row.custom_id,
    expected_probe_clip: row.expected_probe_clip,
    parent_expected_clip: row.parent_expected_clip,
    probe_clip_signature: row.probe_clip_signature,
    review_frame_signatures: row.review_evidence?.review_frame_signatures || {},
  }));
  return sha256Text(`${JSON.stringify(releaseRows)}\n`);
}

function decide(problems, proposalRows) {
  if (problems.some((problem) => /probe clips are not complete|review frame sets are not complete|missing_probe_clip|probe_clip_pending/i.test(problem))) {
    return "motion_probe_review_apply_blocked_clips_pending";
  }
  if (problems.length) return "motion_probe_review_apply_blocked_invalid_proposal";
  if (proposalRows.some((row) => ["blocked_needs_revision", "rejected"].includes(row.decision))) {
    return "motion_probe_review_apply_valid_revisions_required";
  }
  return "motion_probe_review_apply_passed";
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const problems = [];
  const warnings = [];
  const packageManifest = readJson(packageManifestPath, { shots: [] });
  const probeReviewManifest = readJson(probeReviewManifestPath, { rows: [] });
  const packetAudit = readJson(probeReviewPacketAuditPath, {});
  const structuralAudit = readJson(probeClipStructuralAuditPath, {});
  const proposalRows = readJsonl(options.proposal);
  const packetRows = Array.isArray(probeReviewManifest.rows) ? probeReviewManifest.rows : [];
  const expected = Number(packageManifest.total_shots || (packageManifest.shots || []).length || 42);
  const packetById = byId(packetRows);
  const seen = new Set();
  const counters = {
    proposal_rows: proposalRows.length,
    probe_clip_signature_matched_rows: 0,
    review_frame_signature_matched_rows: 0,
    review_evidence_complete_rows: 0,
    ledger_matched_rows: 0,
    required_checks_complete_rows: 0,
    full_duration_approved_rows: 0,
    codex_reviewed_rows: 0,
  };

  if (proposalRows.length !== expected) problems.push(`proposal rows ${proposalRows.length} does not match expected ${expected}`);
  if (packetRows.length !== expected) problems.push(`probe review manifest rows ${packetRows.length} does not match expected ${expected}`);
  if (Number(structuralAudit.expected_probe_clips || 0) !== expected ||
      Number(structuralAudit.playable_probe_clips || 0) !== expected ||
      Number(structuralAudit.missing_probe_clips || 0) !== 0 ||
      Number(structuralAudit.failed_probe_clips || 0) !== 0) {
    problems.push(`probe clips are not complete: playable ${structuralAudit.playable_probe_clips || 0}/${expected}, missing ${structuralAudit.missing_probe_clips ?? expected}, failed ${structuralAudit.failed_probe_clips || 0}`);
  }
  if (Number(packetAudit.expected_probe_clips || 0) !== expected ||
      Number(packetAudit.review_frame_sets_ready || 0) !== expected ||
      Number(packetAudit.full_duration_approvals || 0) !== 0) {
    problems.push(`probe review frame sets are not complete or were pre-approved: frames ${packetAudit.review_frame_sets_ready || 0}/${expected}, packet approvals ${packetAudit.full_duration_approvals || 0}`);
  }
  if (!["motion_probe_review_packet_ready_codex_review_required", "motion_probe_review_packet_partial_codex_review_required", "motion_probe_review_packet_ready_clips_pending"].includes(packetAudit.decision || "")) {
    problems.push(`probe review packet audit decision ${packetAudit.decision || "missing"} is not accepted`);
  }

  for (const row of proposalRows) {
    if (!row.id) problems.push(`${row.shot || "unknown"}: missing id`);
    if (row.id && seen.has(row.id)) problems.push(`${row.id}: duplicate proposal row`);
    if (row.id) seen.add(row.id);
  }

  for (const proposal of proposalRows) {
    const packetRow = packetById.get(proposal.id);
    const label = proposal.shot || proposal.id || "unknown";
    if (!packetRow) {
      problems.push(`${label}: missing matching probe review manifest row`);
      continue;
    }
    if (proposal.shot !== packetRow.shot) problems.push(`${label}: shot mismatch against probe review manifest`);
    if (proposal.custom_id !== packetRow.custom_id) problems.push(`${label}: custom_id mismatch against probe review manifest`);
    if (proposal.expected_probe_clip !== packetRow.expected_probe_clip) problems.push(`${label}: expected_probe_clip mismatch`);
    if (proposal.parent_expected_clip !== packetRow.parent_expected_clip) problems.push(`${label}: parent_expected_clip mismatch`);
    if (!String(proposal.expected_probe_clip || "").endsWith("_probe.mp4")) problems.push(`${label}: expected_probe_clip is not _probe.mp4`);
    if (String(proposal.parent_expected_clip || "").endsWith("_probe.mp4")) problems.push(`${label}: parent_expected_clip points at a probe`);

    const currentProbeSignature = clipSignature(packetRow.expected_probe_clip);
    if (!sameSignature(proposal.probe_clip_signature, currentProbeSignature)) {
      problems.push(`${label}: probe_clip_signature missing, stale, or mismatched`);
    } else {
      counters.probe_clip_signature_matched_rows += 1;
    }

    const evidenceMissing = checkEvidence(proposal, packetRow);
    if (evidenceMissing.length) {
      problems.push(`${label}: review_evidence incomplete: ${evidenceMissing.join(", ")}`);
    } else {
      counters.review_evidence_complete_rows += 1;
      counters.review_frame_signature_matched_rows += 1;
    }

    let ledgerOk = true;
    for (const field of REQUIRED_LEDGER_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(proposal, field)) {
        problems.push(`${label}: missing ledger field ${field}`);
        ledgerOk = false;
      }
    }
    for (const field of REQUIRED_LEDGER_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(packetRow, field) && !sameJson(proposal[field], packetRow[field])) {
        problems.push(`${label}: ledger field ${field} does not match probe review manifest`);
        ledgerOk = false;
      }
    }
    if (ledgerOk) counters.ledger_matched_rows += 1;

    if (!ALLOWED_FINAL_DECISIONS.has(proposal.decision)) {
      problems.push(`${label}: unsupported or pending decision ${proposal.decision || "missing"}`);
    }
    const checks = new Map((proposal.checks || []).map((check) => [check.id, check]));
    const missingChecks = REQUIRED_CHECK_IDS.filter((id) => !checks.has(id));
    if (missingChecks.length) problems.push(`${label}: missing checks ${missingChecks.join(", ")}`);
    if (proposal.decision === "probe_motion_passed") {
      const failed = REQUIRED_CHECK_IDS.filter((id) => checks.get(id)?.result !== "pass");
      if (failed.length) problems.push(`${label}: passed decision has non-pass checks ${failed.join(", ")}`);
      if (failed.length === 0 && missingChecks.length === 0) counters.required_checks_complete_rows += 1;
      if (proposal.approve_full_duration !== true) problems.push(`${label}: probe_motion_passed without approve_full_duration=true`);
      else counters.full_duration_approved_rows += 1;
      if (!reviewerLooksLikeCodex(proposal.reviewed_by) || reviewerLooksLikeUser(proposal.reviewed_by)) {
        problems.push(`${label}: passed row must be reviewed_by Codex, not ${proposal.reviewed_by || "missing"}`);
      } else {
        counters.codex_reviewed_rows += 1;
      }
      if (!proposal.reviewer_notes || String(proposal.reviewer_notes).trim().length < 20) {
        problems.push(`${label}: passed row requires specific reviewer_notes`);
      }
    } else if (["blocked_needs_revision", "rejected"].includes(proposal.decision)) {
      if (proposal.approve_full_duration !== false) problems.push(`${label}: blocked/rejected row cannot approve full duration`);
      if (!proposal.reviewer_notes || String(proposal.reviewer_notes).trim().length < 20) {
        problems.push(`${label}: blocked/rejected row requires reviewer_notes`);
      }
    } else if (proposal.approve_full_duration === true) {
      problems.push(`${label}: approve_full_duration=true is only allowed with probe_motion_passed`);
    }
  }

  const decision = decide(problems, proposalRows);
  const passedRows = proposalRows.filter((row) => row.decision === "probe_motion_passed").length;
  const blockedRows = proposalRows.filter((row) => ["blocked_needs_revision", "rejected"].includes(row.decision)).length;
  const release = {
    version: 1,
    generated_at: new Date().toISOString(),
    decision: "motion_probe_full_duration_release_passed",
    source_apply_gate: rel(packageOutJson),
    source_proposal: rel(options.proposal),
    rows: proposalRows.map((row) => ({
      order: row.order,
      shot: row.shot,
      id: row.id,
      custom_id: row.custom_id,
      expected_probe_clip: row.expected_probe_clip,
      parent_expected_clip: row.parent_expected_clip,
      approve_full_duration: row.approve_full_duration === true,
      probe_clip_signature: row.probe_clip_signature,
      review_frame_signatures: row.review_evidence?.review_frame_signatures || {},
    })),
    release_rows_digest_sha256: rowReleaseDigest(proposalRows),
  };

  if (decision === "motion_probe_review_apply_passed" && options.apply) {
    writeJson(releaseJson, release);
  } else if (decision !== "motion_probe_review_apply_passed" && fs.existsSync(releaseJson)) {
    warnings.push("existing motion_probe_full_duration_release.json is ignored because current apply gate did not pass");
  }

  const result = {
    date,
    decision,
    apply_requested: options.apply,
    release_written: decision === "motion_probe_review_apply_passed" && options.apply,
    expected_probe_clips: expected,
    proposal_rows: proposalRows.length,
    passed_rows: passedRows,
    blocked_or_rejected_rows: blockedRows,
    counters,
    source_files: {
      proposal: rel(options.proposal),
      probe_review_manifest: rel(probeReviewManifestPath),
      probe_review_packet_audit: rel(probeReviewPacketAuditPath),
      motion_probe_clip_structural_audit: rel(probeClipStructuralAuditPath),
    },
    release: decision === "motion_probe_review_apply_passed" ? {
      path: rel(releaseJson),
      would_write: !options.apply,
      release_rows_digest_sha256: release.release_rows_digest_sha256,
    } : null,
    problems,
    warnings,
  };
  writeJson(outJson, result);
  writeJson(packageOutJson, result);
  writeText(packageOutMd, [
    "# Scene09 V3 Motion Probe Review Apply Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Apply requested: ${options.apply ? "yes" : "no"}`,
    `Release written: ${result.release_written ? "yes" : "no"}`,
    `Expected probe clips: ${expected}`,
    `Proposal rows: ${proposalRows.length}`,
    `Passed rows: ${passedRows}`,
    `Blocked/rejected rows: ${blockedRows}`,
    `Probe signature matches: ${counters.probe_clip_signature_matched_rows}`,
    `Review frame signature matches: ${counters.review_frame_signature_matched_rows}`,
    `Codex reviewed rows: ${counters.codex_reviewed_rows}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Warnings",
    "",
    warnings.length ? warnings.map((warning) => `- ${warning}`).join("\n") : "- none",
    "",
  ].join("\n"));

  console.log(JSON.stringify({
    decision,
    expected_probe_clips: expected,
    proposal_rows: proposalRows.length,
    passed_rows: passedRows,
    problems: problems.length,
    warnings: warnings.length,
    package_report_json: rel(packageOutJson),
  }, null, 2));
  if (decision === "motion_probe_review_apply_blocked_invalid_proposal") process.exit(1);
}

main();
