#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(reportDir, `scene09_v3_provider_preflight_consistency_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_provider_preflight_consistency_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "provider_preflight_consistency_gate.json");
const packageOutMd = path.join(packageDir, "provider_preflight_consistency_gate.md");

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
  return fs.existsSync(file)
    ? crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")
    : null;
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

function parseCsv(text) {
  const lines = String(text || "").split(/\r?\n/).filter((line) => line.length);
  if (!lines.length) return { header: [], rows: [] };
  const header = parseCsvLine(lines[0]);
  return {
    header,
    rows: lines.slice(1).map((line) => {
      const values = parseCsvLine(line);
      return Object.fromEntries(header.map((key, index) => [key, values[index] || ""]));
    }),
  };
}

function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}

function groupText(groups) {
  if (!groups || typeof groups !== "object") return "none";
  const rows = Object.entries(groups)
    .filter(([, names]) => Array.isArray(names) && names.length)
    .map(([group, names]) => `${group}: ${names.join(", ")}`);
  return rows.length ? rows.join("; ") : "none";
}

function changeText(changes) {
  const rows = Array.isArray(changes) ? changes : [];
  return rows.length
    ? rows.map((item) => `${item.name || item}:${item.status || item.label || "changed"}`).join("; ")
    : "none";
}

function expectedLedgerFields(shot) {
  const state = shot.battle_state_after || {};
  const ledger = state.battle_ledger_after || shot.battle_ledger_after || {};
  const noActive = [
    ...(Array.isArray(state.inactive_or_removed_after) ? state.inactive_or_removed_after : []),
    ...(Array.isArray(state.no_active_combat_after) ? state.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
  ].filter((name, index, all) => name && all.indexOf(name) === index);
  return {
    alive_safe_after: groupText(ledger.alive_by_house || state.active_by_house),
    active_or_objective_after: groupText(ledger.still_active_or_controlling_objective_by_house || ledger.active_by_house || state.active_by_house),
    limited_after: groupText(ledger.limited_but_not_defeated_by_house || ledger.limited_by_house),
    defeated_removed_after: groupText(ledger.mock_battle_defeated_or_removed_by_house || ledger.defeated_removed_by_house || state.inactive_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_or_objective_defeated_by_house || ledger.captured_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_or_post_battle_by_house || ledger.stood_down_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: noActive.join(", ") || ledger.no_active_combat_line || "none",
  };
}

function rowSig(row) {
  return {
    order: Number(row.order),
    shot: row.shot,
    id: row.id,
    expected_clip: row.expected_clip,
  };
}

function sameSig(a, b) {
  return Number(a.order) === Number(b.order) &&
    a.shot === b.shot &&
    a.id === b.id &&
    a.expected_clip === b.expected_clip;
}

function main() {
  const manifestPath = path.join(packageDir, "package_manifest.json");
  const operatorPath = path.join(packageDir, "operator_preflight_status.json");
  const operatorMdPath = path.join(packageDir, "operator_preflight_status.md");
  const providerUploadPath = path.join(packageDir, "provider_upload_manifest.json");
  const modelTargetPath = path.join(packageDir, "model_target_profile.json");
  const motionQaChecklistPath = path.join(packageDir, "clip_motion_qa_checklist.csv");
  const revisionQueueCsvPath = path.join(packageDir, "clip_revision_queue.csv");
  const revisionQueueJsonPath = path.join(reportDir, "scene09_v3_clip_revision_queue_2026-07-28.json");

  const manifest = readJson(manifestPath, {});
  const operator = readJson(operatorPath, {});
  const providerUpload = readJson(providerUploadPath, {});
  const modelTarget = readJson(modelTargetPath, {});
  const operatorMd = readText(operatorMdPath);
  const problems = [];
  const warnings = [];
  const requiredLedgerFields = [
    "Alive / Safe After",
    "Active / Controlling After",
    "Limited But Not Defeated After",
    "Defeated / Removed After",
    "Captured / Objective-Defeated After",
    "Stood Down / Post-Battle After",
    "Must Not Return Active",
    "Changed This Shot",
    "No-Active-Combat Line",
  ];
  const requiredProviderRowFields = [
    "alive_safe_after",
    "active_controlling_after",
    "limited_after",
    "defeated_removed_after",
    "captured_objective_defeated_after",
    "stood_down_post_battle_after",
    "must_not_return_active_after",
    "changed_this_shot",
    "no_active_combat_line",
  ];
  const requiredChecklistLedgerFields = [
    "alive_safe_after",
    "active_or_objective_after",
    "limited_after",
    "defeated_removed_after",
    "captured_objective_defeated_after",
    "stood_down_post_battle_after",
    "must_not_return_active_after",
    "changed_this_shot",
    "no_active_combat_line",
  ];

  const shots = [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const expected = Number(manifest.total_shots || shots.length || 0);
  const evidence = operator.evidence || {};
  const executionReadiness = manifest.execution_readiness || {};

  if (!manifest.package_id) problems.push("package_manifest package_id is missing");
  for (const [label, doc] of [
    ["operator_preflight_status", operator],
    ["provider_upload_manifest", providerUpload],
    ["model_target_profile", modelTarget],
  ]) {
    if (doc.package_id !== manifest.package_id) {
      problems.push(`${label} package_id ${doc.package_id || "missing"} does not match ${manifest.package_id || "missing"}`);
    }
  }
  if (expected !== 42) problems.push(`package_manifest total_shots ${expected} is not 42`);
  if (Number(providerUpload.total_shots || 0) !== expected) {
    problems.push(`provider_upload_manifest total_shots ${providerUpload.total_shots || 0} does not match ${expected}`);
  }
  if (Number(providerUpload.expected_clips || 0) !== expected) {
    problems.push(`provider_upload_manifest expected_clips ${providerUpload.expected_clips || 0} does not match ${expected}`);
  }
  if (Number(providerUpload.ready_clips || 0) !== Number(evidence.clip_status?.ready_clips || 0)) {
    problems.push("provider_upload_manifest ready_clips does not match operator clip_status");
  }
  if (Number(providerUpload.missing_clips || 0) !== Number(evidence.clip_status?.missing_clips || 0)) {
    problems.push("provider_upload_manifest missing_clips does not match operator clip_status");
  }
  if (!Array.isArray(providerUpload.rows) || providerUpload.rows.length !== expected) {
    problems.push(`provider_upload_manifest rows ${providerUpload.rows?.length || 0} does not match ${expected}`);
  } else {
    for (let i = 0; i < shots.length; i += 1) {
      const expectedSig = rowSig(shots[i]);
      const actualSig = rowSig(providerUpload.rows[i]);
      if (!sameSig(actualSig, expectedSig)) {
        problems.push(`provider_upload_manifest row ${i + 1} mismatch; got ${JSON.stringify(actualSig)}, expected ${JSON.stringify(expectedSig)}`);
        break;
      }
      for (const field of requiredProviderRowFields) {
        if (!Object.prototype.hasOwnProperty.call(providerUpload.rows[i], field)) {
          problems.push(`provider_upload_manifest row ${i + 1} missing ${field}`);
          break;
        }
      }
    }
  }

  const requiredEvidence = [
    ["execution_asset_integrity", "execution_asset_integrity_passed"],
    ["actual_delivery_surface_audit", "actual_delivery_surface_passed"],
    ["current_status_consistency_gate", "current_status_consistency_passed"],
    ["batch_upload_audit", "model_submission_batches_ready_for_provider_upload"],
    ["submission_contract_gate", "submission_contract_gate_passed"],
    ["provider_upload_bundles", "provider_upload_bundles_ready"],
    ["provider_submission_freshness_gate", "provider_submission_freshness_passed"],
  ];
  for (const [key, decision] of requiredEvidence) {
    if (evidence[key]?.decision !== decision) {
      problems.push(`operator evidence ${key} decision ${evidence[key]?.decision || "missing"} is not ${decision}`);
    }
    if (Number(evidence[key]?.problems || 0) !== 0) {
      problems.push(`operator evidence ${key} has ${evidence[key].problems} problems`);
    }
  }
  if (!evidence.full_duration_release_gate?.decision) {
    problems.push("operator evidence full_duration_release_gate is missing");
  }
  if (Number(evidence.full_duration_release_gate?.problems || 0) !== 0) {
    problems.push(`operator evidence full_duration_release_gate has ${evidence.full_duration_release_gate.problems} problems`);
  }
  const canSubmitBaseExpected = requiredEvidence.every(([key, decision]) =>
    evidence[key]?.decision === decision && Number(evidence[key]?.problems || 0) === 0
  );
  const canSubmitExpected = canSubmitBaseExpected &&
    evidence.full_duration_release_gate?.decision === "full_duration_release_passed" &&
    evidence.full_duration_release_gate?.can_release_full_duration === true &&
    Number(evidence.full_duration_release_gate?.problems || 0) === 0;
  if (operator.can_submit_to_provider !== canSubmitExpected) {
    problems.push(`operator can_submit_to_provider ${operator.can_submit_to_provider} does not match computed ${canSubmitExpected}`);
  }
  if (executionReadiness.can_submit_to_provider !== operator.can_submit_to_provider) {
    problems.push(`package_manifest execution_readiness.can_submit_to_provider ${executionReadiness.can_submit_to_provider} does not match operator ${operator.can_submit_to_provider}`);
  }
  if (executionReadiness.current_status_consistency_gate !== "current_status_consistency_passed") {
    problems.push(`package_manifest execution_readiness.current_status_consistency_gate ${executionReadiness.current_status_consistency_gate || "missing"} is not current_status_consistency_passed`);
  }
  const expectedProviderStatus = canSubmitExpected ? "ready_for_provider_upload_clips_pending" : "blocked_preflight_gate";
  if (providerUpload.status !== expectedProviderStatus) {
    problems.push(`provider_upload_manifest status ${providerUpload.status || "missing"} is not ${expectedProviderStatus}`);
  }
  if (modelTarget.submission_assets?.current_status_consistency_gate !== "current_status_consistency_gate.json") {
    problems.push("model_target_profile does not expose current_status_consistency_gate.json");
  }
  if (modelTarget.submission_assets?.provider_submission_freshness_gate !== "provider_submission_freshness_gate.json") {
    problems.push("model_target_profile does not expose provider_submission_freshness_gate.json");
  }
  if (modelTarget.submission_assets?.full_duration_release_gate !== "full_duration_release_gate.json") {
    problems.push("model_target_profile does not expose full_duration_release_gate.json");
  }
  const ledgerContract = operator.full_post_shot_ledger_contract || {};
  if (Number(ledgerContract.rows || 0) !== expected) {
    problems.push(`operator full_post_shot_ledger_contract rows ${ledgerContract.rows || 0} does not match ${expected}`);
  }
  const contractFields = new Set(ledgerContract.required_review_fields || []);
  for (const field of requiredLedgerFields) {
    if (!contractFields.has(field)) problems.push(`operator full_post_shot_ledger_contract missing field ${field}`);
    if (!operatorMd.includes(field)) problems.push(`operator_preflight_status.md missing field ${field}`);
  }
  const criticalLocks = ledgerContract.critical_locks || {};
  for (const [key, value] of Object.entries({
    shot032F_hubert_captured_by_felix_and_ashe: true,
    shot032G_dorothea_and_bernadetta_captured_by_leonie_and_claude: true,
    shot034B_empty_objective_teachers_absent: true,
    shot034G_exhausted_dimitri_dedue_core: true,
  })) {
    if (criticalLocks[key] !== value) problems.push(`operator full_post_shot_ledger_contract critical lock ${key} is not true`);
  }
  for (const phrase of [
    "Hubert captured by Felix/Ashe -> locked",
    "Dorothea and Bernadetta captured by Leonie/Claude -> locked",
    "empty faculty objective, Hanneman/Manuela absent/offscreen/unpaired -> locked",
    "exhausted Dimitri/Dedue core -> locked",
  ]) {
    if (!operatorMd.includes(phrase)) problems.push(`operator_preflight_status.md missing ${phrase}`);
  }

  for (const [label, file] of [
    ["clip_motion_qa_checklist", motionQaChecklistPath],
    ["clip_revision_queue", revisionQueueCsvPath],
  ]) {
    if (!fs.existsSync(file)) {
      problems.push(`${label} is missing`);
      continue;
    }
    const parsed = parseCsv(readText(file));
    if (parsed.rows.length !== expected) problems.push(`${label} rows ${parsed.rows.length} does not match ${expected}`);
    for (const field of requiredChecklistLedgerFields) {
      if (!parsed.header.includes(field)) problems.push(`${label} missing ledger column ${field}`);
    }
    for (let i = 0; i < Math.min(parsed.rows.length, shots.length); i += 1) {
      const row = parsed.rows[i];
      const shot = shots[i];
      if (String(row.shot || "") !== String(shot.shot || "")) {
        problems.push(`${label} row ${i + 1} shot ${row.shot || "missing"} does not match ${shot.shot}`);
        break;
      }
      const expectedFields = expectedLedgerFields(shot);
      for (const field of requiredChecklistLedgerFields) {
        if (row[field] !== expectedFields[field]) {
          problems.push(`${label} ${shot.shot} ${field} ${row[field] || "missing"} does not match ${expectedFields[field]}`);
          break;
        }
      }
    }
  }

  const revisionQueue = readJson(revisionQueueJsonPath, {});
  if (!Array.isArray(revisionQueue.rows) || revisionQueue.rows.length !== expected) {
    problems.push(`revision_queue_json rows ${revisionQueue.rows?.length || 0} does not match ${expected}`);
  } else {
    for (let i = 0; i < shots.length; i += 1) {
      const row = revisionQueue.rows[i];
      const shot = shots[i];
      if (String(row.shot || "") !== String(shot.shot || "")) {
        problems.push(`revision_queue_json row ${i + 1} shot ${row.shot || "missing"} does not match ${shot.shot}`);
        break;
      }
      const expectedFields = expectedLedgerFields(shot);
      for (const field of requiredChecklistLedgerFields) {
        if (row[field] !== expectedFields[field]) {
          problems.push(`revision_queue_json ${shot.shot} ${field} ${row[field] || "missing"} does not match ${expectedFields[field]}`);
          break;
        }
      }
      if (!row.battle_ledger_after || typeof row.battle_ledger_after !== "object") {
        problems.push(`revision_queue_json ${shot.shot} missing battle_ledger_after object`);
        break;
      }
    }
  }

  const decision = problems.length ? "provider_preflight_consistency_blocked" : "provider_preflight_consistency_passed";
  const report = {
    date,
    package_id: manifest.package_id || "scene09_v3_monitor_handoff_package_2026-07-27",
    package_manifest: rel(manifestPath),
    decision,
    can_submit_to_provider: operator.can_submit_to_provider === true,
    computed_can_submit_to_provider: canSubmitExpected,
    expected_shots: expected,
    ready_clips: Number(evidence.clip_status?.ready_clips || 0),
    missing_clips: Number(evidence.clip_status?.missing_clips || 0),
    provider_upload_status: providerUpload.status || null,
    problems,
    warnings,
    files: {
      operator_preflight_status: { path: rel(operatorPath), sha256: sha256(operatorPath) },
      operator_preflight_status_md: { path: rel(operatorMdPath), sha256: sha256(operatorMdPath) },
      provider_upload_manifest: { path: rel(providerUploadPath), sha256: sha256(providerUploadPath) },
      package_manifest: { path: rel(manifestPath), sha256: sha256(manifestPath) },
      model_target_profile: { path: rel(modelTargetPath), sha256: sha256(modelTargetPath) },
      clip_motion_qa_checklist: { path: rel(motionQaChecklistPath), sha256: sha256(motionQaChecklistPath) },
      clip_revision_queue_csv: { path: rel(revisionQueueCsvPath), sha256: sha256(revisionQueueCsvPath) },
      clip_revision_queue_json: { path: rel(revisionQueueJsonPath), sha256: sha256(revisionQueueJsonPath) },
    },
    evidence_decisions: Object.fromEntries(requiredEvidence.map(([key]) => [key, evidence[key]?.decision || null])),
    full_duration_release_gate: evidence.full_duration_release_gate || null,
    full_post_shot_ledger_contract: {
      rows: ledgerContract.rows || 0,
      required_review_fields: ledgerContract.required_review_fields || [],
      critical_locks: criticalLocks,
    },
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Provider Preflight Consistency Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Can submit to provider: ${report.can_submit_to_provider ? "yes" : "no"}`,
    `Provider upload status: ${report.provider_upload_status || "missing"}`,
    "",
    "This gate verifies that operator preflight, provider upload manifest, package execution readiness, and model target profile agree before any external provider submission.",
    "Full-duration provider submission is allowed only when `full_duration_release_gate` has passed; otherwise the provider bundles may remain structurally prepared but locked.",
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
    can_submit_to_provider: report.can_submit_to_provider,
    expected_shots: expected,
    ready_clips: report.ready_clips,
    missing_clips: report.missing_clips,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));
  if (decision !== "provider_preflight_consistency_passed") process.exit(1);
}

main();
