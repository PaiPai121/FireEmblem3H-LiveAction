#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const templatePath = path.join(packageDir, "motion_self_audit", "decision_update_template.jsonl");
const applyGateScriptPath = path.join(root, "scripts/apply_scene09_v3_motion_self_audit_decisions.js");
const runbookPath = path.join(packageDir, "RUNBOOK.md");
const clipReturnReadmePath = path.join(packageDir, "clip_return_intake", "README.md");
const operatorPreflightPath = path.join(packageDir, "operator_preflight_status.md");
const outJson = path.join(reportDir, `scene09_v3_motion_self_audit_evidence_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_motion_self_audit_evidence_contract_${date}.md`);
const packageOutJson = path.join(packageDir, "motion_self_audit_evidence_contract.json");
const packageOutMd = path.join(packageDir, "motion_self_audit_evidence_contract.md");

function readJson(file, fallback = null) {
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

function readJsonl(file, problems) {
  if (!fs.existsSync(file)) {
    problems.push(`missing template ${rel(file)}`);
    return [];
  }
  return fs.readFileSync(file, "utf8")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        problems.push(`template line ${index + 1}: invalid JSON (${error.message})`);
        return null;
      }
    })
    .filter(Boolean);
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key);
}

function readText(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function main() {
  const problems = [];
  const warnings = [];
  const manifest = readJson(manifestPath, { shots: [] });
  const expected = Number(manifest.total_shots || (manifest.shots || []).length || 42);
  const rows = readJsonl(templatePath, problems);

  if (rows.length !== expected) {
    problems.push(`template rows ${rows.length} does not match expected ${expected}`);
  }

  let rowsWithClipSignatureKey = 0;
  let rowsWithFrameSignatureKeys = 0;
  let rowsWithFrameCheckFlags = 0;
  let rowsWithBattleLedgerKey = 0;
  let rowsWithAliveSafeAfter = 0;
  let rowsWithAliveByHouse = 0;
  let rowsWithNoActiveLine = 0;
  let rowsWithCurrentPendingNullSignatures = 0;
  for (const row of rows) {
    const shot = row.shot || row.id || "unknown";
    const evidence = row.review_evidence || {};
    const checked = evidence.review_frames_checked || {};
    const signatures = evidence.review_frame_signatures || {};

    if (hasOwn(row, "clip_signature")) rowsWithClipSignatureKey += 1;
    else problems.push(`${shot}: missing clip_signature key`);

    const hasFrameSignatureKeys = ["start", "mid", "end"].every((label) => hasOwn(signatures, label));
    if (hasFrameSignatureKeys) rowsWithFrameSignatureKeys += 1;
    else problems.push(`${shot}: missing review_frame_signatures start/mid/end keys`);

    const hasFrameCheckFlags = ["start", "mid", "end"].every((label) => hasOwn(checked, label));
    if (hasFrameCheckFlags) rowsWithFrameCheckFlags += 1;
    else problems.push(`${shot}: missing review_frames_checked start/mid/end keys`);

    if (row.decision === "pending_clip" && row.clip_signature === null &&
        signatures.start === null && signatures.mid === null && signatures.end === null) {
      rowsWithCurrentPendingNullSignatures += 1;
    }

    if (!hasOwn(evidence, "full_clip_reviewed")) problems.push(`${shot}: missing full_clip_reviewed evidence key`);
    if (!hasOwn(evidence, "clip_signature_verified")) problems.push(`${shot}: missing clip_signature_verified evidence key`);
    if (hasOwn(row, "battle_ledger_after")) rowsWithBattleLedgerKey += 1;
    else problems.push(`${shot}: missing battle_ledger_after key`);
    if (hasOwn(row, "alive_safe_after")) rowsWithAliveSafeAfter += 1;
    else problems.push(`${shot}: missing alive_safe_after key`);
    if (hasOwn(row.battle_ledger_after, "alive_by_house")) rowsWithAliveByHouse += 1;
    else problems.push(`${shot}: battle_ledger_after missing alive_by_house`);
    if (hasOwn(row, "no_active_combat_line")) rowsWithNoActiveLine += 1;
    else problems.push(`${shot}: missing no_active_combat_line key`);
  }

  const applyGateSource = fs.existsSync(applyGateScriptPath) ? fs.readFileSync(applyGateScriptPath, "utf8") : "";
  const sourceRequirements = [
    {
      id: "review_frame_signature_function",
      passed: /function reviewFrameSignature\(relativeFile\)/.test(applyGateSource),
      detail: "apply gate defines a review-frame file signature function",
    },
    {
      id: "frame_path_bound",
      passed: /path:\s*relativeFile/.test(applyGateSource) && /sameFrameSignature/.test(applyGateSource),
      detail: "review-frame signature includes and compares the relative file path",
    },
    {
      id: "frame_size_mtime_sha_bound",
      passed: /size_bytes:\s*stat\.size/.test(applyGateSource) &&
        /mtime_ms:\s*Math\.trunc\(stat\.mtimeMs\)/.test(applyGateSource) &&
        /sha256:\s*crypto\.createHash\("sha256"\)/.test(applyGateSource),
      detail: "review-frame signature binds file size, mtime, and SHA-256",
    },
    {
      id: "stale_frame_rejected",
      passed: /review_frame_signatures\.\$\{label\}_stale_or_mismatch/.test(applyGateSource) &&
        /sameFrameSignature\(frameSignatures\[label\], current\)/.test(applyGateSource),
      detail: "apply gate rejects stale or mismatched start/mid/end frame signatures",
    },
    {
      id: "frame_review_flags_required",
      passed: /review_frames_checked\.start/.test(applyGateSource) &&
        /review_frames_checked\.mid/.test(applyGateSource) &&
        /review_frames_checked\.end/.test(applyGateSource),
      detail: "apply gate requires explicit start/mid/end frame review flags",
    },
    {
      id: "battle_ledger_bound",
      passed: /REQUIRED_LEDGER_FIELDS/.test(applyGateSource) &&
        /alive_safe_after/.test(applyGateSource) &&
        /alive_by_house/.test(applyGateSource) &&
        /proposal battle_ledger_after is missing, stale, or does not match source battle ledger/.test(applyGateSource) &&
        /proposal \$\{field\} does not match source battle ledger/.test(applyGateSource),
      detail: "apply gate rejects missing or stale battle-ledger/alive-safe/no-active-combat evidence",
    },
  ];
  for (const item of sourceRequirements) {
    if (!item.passed) problems.push(`${item.id}: ${item.detail} is not enforced`);
  }

  const runbook = readText(runbookPath);
  const clipReturnReadme = readText(clipReturnReadmePath);
  const operatorPreflight = readText(operatorPreflightPath);
  const handoffRequirements = [
    {
      id: "runbook_names_frame_signature_contract",
      passed: /review_evidence\.review_frame_signatures\.start\/mid\/end/.test(runbook) &&
        /stale clip or frame evidence is rejected/i.test(runbook),
      detail: "RUNBOOK tells operators that start/mid/end frame signatures are required and stale frame evidence is rejected",
    },
    {
      id: "clip_return_readme_names_frame_signature_contract",
      passed: /review_evidence\.review_frame_signatures\.start\/mid\/end/.test(clipReturnReadme) &&
        /rows that only set review booleans/i.test(clipReturnReadme),
      detail: "clip return README tells operators that booleans without matching frame signatures are rejected",
    },
    {
      id: "operator_preflight_names_evidence_contract",
      passed: /Motion self-audit evidence contract/.test(operatorPreflight) &&
        /clip and frame SHA-256 signatures/.test(operatorPreflight),
      detail: "operator preflight status exposes the self-audit evidence contract and frame SHA-256 requirement",
    },
  ];
  for (const item of handoffRequirements) {
    if (!item.passed) problems.push(`${item.id}: ${item.detail} is missing from handoff docs`);
  }

  if (rowsWithCurrentPendingNullSignatures === rows.length && rows.length > 0) {
    warnings.push("all template signatures are currently null because the 42 real clips and extracted review frames are still pending");
  }

  const checks = [
    {
      id: "template_rows",
      passed: rows.length === expected,
      detail: `${rows.length}/${expected} template rows`,
    },
    {
      id: "clip_signature_key_present",
      passed: rowsWithClipSignatureKey === expected,
      detail: `${rowsWithClipSignatureKey}/${expected} rows include clip_signature`,
    },
    {
      id: "review_frame_signature_keys_present",
      passed: rowsWithFrameSignatureKeys === expected,
      detail: `${rowsWithFrameSignatureKeys}/${expected} rows include review_frame_signatures.start/mid/end`,
    },
    {
      id: "review_frame_checked_flags_present",
      passed: rowsWithFrameCheckFlags === expected,
      detail: `${rowsWithFrameCheckFlags}/${expected} rows include review_frames_checked.start/mid/end`,
    },
    {
      id: "battle_ledger_key_present",
      passed: rowsWithBattleLedgerKey === expected,
      detail: `${rowsWithBattleLedgerKey}/${expected} rows include battle_ledger_after`,
    },
    {
      id: "alive_safe_after_present",
      passed: rowsWithAliveSafeAfter === expected,
      detail: `${rowsWithAliveSafeAfter}/${expected} rows include alive_safe_after`,
    },
    {
      id: "alive_by_house_present",
      passed: rowsWithAliveByHouse === expected,
      detail: `${rowsWithAliveByHouse}/${expected} rows include battle_ledger_after.alive_by_house`,
    },
    {
      id: "no_active_combat_line_present",
      passed: rowsWithNoActiveLine === expected,
      detail: `${rowsWithNoActiveLine}/${expected} rows include no_active_combat_line`,
    },
    ...sourceRequirements,
    ...handoffRequirements,
  ];

  const decision = problems.length
    ? "motion_self_audit_evidence_contract_blocked"
    : "motion_self_audit_evidence_contract_passed";
  const report = {
    date,
    package_id: manifest.package_id,
    package_manifest: rel(manifestPath),
    template: rel(templatePath),
    apply_gate_script: rel(applyGateScriptPath),
    handoff_docs: {
      runbook: rel(runbookPath),
      clip_return_readme: rel(clipReturnReadmePath),
      operator_preflight: rel(operatorPreflightPath),
    },
    decision,
    expected_rows: expected,
    template_rows: rows.length,
    rows_with_clip_signature_key: rowsWithClipSignatureKey,
    rows_with_review_frame_signature_keys: rowsWithFrameSignatureKeys,
    rows_with_review_frame_checked_flags: rowsWithFrameCheckFlags,
    rows_with_battle_ledger_key: rowsWithBattleLedgerKey,
    rows_with_alive_safe_after: rowsWithAliveSafeAfter,
    rows_with_alive_by_house: rowsWithAliveByHouse,
    rows_with_no_active_combat_line: rowsWithNoActiveLine,
    rows_with_current_pending_null_signatures: rowsWithCurrentPendingNullSignatures,
    checks,
    problems,
    warnings,
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Motion Self-Audit Evidence Contract",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Template rows: ${rows.length}/${expected}`,
    "",
    "This audit verifies that future Codex motion-review decisions must be bound to the current expected clip signature and the current start/mid/end extracted review-frame signatures before the apply gate can trust them.",
    "",
    "## Checks",
    "",
    ...checks.map((item) => `- ${item.passed ? "PASS" : "FAIL"} ${item.id}: ${item.detail}`),
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
    template_rows: rows.length,
    rows_with_review_frame_signature_keys: rowsWithFrameSignatureKeys,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));

  if (problems.length) process.exit(1);
}

main();
