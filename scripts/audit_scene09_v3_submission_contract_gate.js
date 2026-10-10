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
const manifestPath = path.join(packageDir, "package_manifest.json");
const activeManifestPath = path.join(root, "production_system/video_delivery_manifest.json");
const executionPlanPath = path.join(packageDir, "execution_plan.json");
const submissionQueuePath = path.join(packageDir, "submission_queue.csv");
const payloadPath = path.join(packageDir, "submission_payload.jsonl");
const payloadManifestPath = path.join(packageDir, "submission_payload_manifest.json");
const outJson = path.join(reportDir, `scene09_v3_submission_contract_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_submission_contract_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "submission_contract_gate.json");
const packageOutMd = path.join(packageDir, "submission_contract_gate.md");

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

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
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
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });
}

function parseJsonl(text, problems) {
  return String(text || "").split(/\r?\n/).filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      problems.push(`submission_payload.jsonl line ${index + 1}: invalid JSON (${error.message})`);
      return null;
    }
  }).filter(Boolean);
}

function sameList(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

function csvVisible(value) {
  return String(value || "").split(";").map((item) => item.trim()).filter(Boolean);
}

function shotDir(shot) {
  return path.join(packageDir, shot.package_dir || "");
}

function normalizeLocal(packageDirRel, localFile) {
  return path.join(packageDirRel || "", localFile || "").replace(/\\/g, "/");
}

function compare(label, actual, expected, problems) {
  if (actual !== expected) {
    problems.push(`${label}: got ${JSON.stringify(actual)} expected ${JSON.stringify(expected)}`);
    return false;
  }
  return true;
}

function compareList(label, actual, expected, problems) {
  if (!sameList(actual, expected)) {
    problems.push(`${label}: got ${JSON.stringify(actual || [])} expected ${JSON.stringify(expected || [])}`);
    return false;
  }
  return true;
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

function unique(values) {
  return values.filter((value, index, all) => value && all.indexOf(value) === index);
}

function sameObject(a, b) {
  return JSON.stringify(a || {}) === JSON.stringify(b || {});
}

function expectedLedgerFields(battleState, ledger, visibleNamedOnly = []) {
  const noActive = unique([
    ...(Array.isArray(battleState.inactive_or_removed_after) ? battleState.inactive_or_removed_after : []),
    ...(Array.isArray(battleState.no_active_combat_after) ? battleState.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
  ]);
  return {
    alive_safe_after: groupText(ledger.alive_by_house || battleState.active_by_house),
    visible_but_no_active_combat_after: (() => {
      const active = new Set(flattenGroups(ledger.still_active_or_controlling_objective_by_house || battleState.active_by_house));
      const inactiveVisible = visibleNamedOnly.filter((name) => name && !active.has(name));
      return inactiveVisible.length ? inactiveVisible.join(", ") : "none";
    })(),
    active_or_objective_after: groupText(ledger.still_active_or_controlling_objective_by_house || battleState.active_by_house),
    limited_after: groupText(ledger.limited_but_not_defeated_by_house),
    defeated_removed_after: groupText(ledger.mock_battle_defeated_or_removed_by_house || battleState.inactive_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_or_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_or_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: noActive.join(", ") || "none",
  };
}

function main() {
  const problems = [];
  const manifest = readJson(manifestPath);
  const activeManifest = readJson(activeManifestPath, { shots: [] });
  const executionPlan = readJson(executionPlanPath, {});
  const payloadManifest = readJson(payloadManifestPath, {});
  if (!manifest) problems.push(`missing package manifest ${rel(manifestPath)}`);
  if (!fs.existsSync(executionPlanPath)) problems.push(`missing execution plan ${rel(executionPlanPath)}`);
  if (!fs.existsSync(submissionQueuePath)) problems.push(`missing submission queue ${rel(submissionQueuePath)}`);
  if (!fs.existsSync(payloadPath)) problems.push(`missing submission payload ${rel(payloadPath)}`);
  if (!fs.existsSync(payloadManifestPath)) problems.push(`missing submission payload manifest ${rel(payloadManifestPath)}`);
  if (!manifest) {
    const report = { date, decision: "submission_contract_blocked", expected_shots: 0, rows_checked: 0, problems };
    writeJson(outJson, report);
    writeJson(packageOutJson, report);
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exit(1);
  }

  const shots = [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const expected = Number(manifest.total_shots || shots.length);
  const queueRows = parseCsv(readText(submissionQueuePath));
  const payloadRows = parseJsonl(readText(payloadPath), problems);
  const workOrders = executionPlan.work_orders || [];
  const activeByShot = new Map((activeManifest.shots || []).map((shot) => [shot.shot, shot]));
  const queueByShot = new Map(queueRows.map((row) => [row.shot, row]));
  const payloadByShot = new Map(payloadRows.map((row) => [row.shot, row]));
  const workOrderByShot = new Map(workOrders.map((row) => [row.shot, row]));
  const rowProblems = [];
  const rows = [];
  const submissionBattleLedgerRows = [];

  compare("package_manifest total_shots", expected, shots.length, problems);
  compare("execution_plan work_orders", workOrders.length, expected, problems);
  compare("submission_queue rows", queueRows.length, expected, problems);
  compare("submission_payload rows", payloadRows.length, expected, problems);
  compare("submission_payload_manifest rows", Number(payloadManifest.rows || 0), payloadRows.length, problems);

  for (const [index, shot] of shots.entries()) {
    const shotProblems = [];
    const expectedOrder = index + 1;
    const expectedCustomId = `${String(shot.order).padStart(3, "0")}_${shot.shot}`;
    const expectedModelPrompt = normalizeLocal(shot.package_dir, "model_prompt.md");
    const expectedAuditPrompt = normalizeLocal(shot.package_dir, "prompt.md");
    const expectedNegativePrompt = normalizeLocal(shot.package_dir, "negative_prompt.md");
    const expectedStart = normalizeLocal(shot.package_dir, "start_frame.png");
    const expectedKey = normalizeLocal(shot.package_dir, "key_frame.png");
    const expectedEnd = normalizeLocal(shot.package_dir, "end_frame.png");
    const metadataPath = path.join(shotDir(shot), "metadata.json");
    const metadata = readJson(metadataPath, {});
    const activeShot = activeByShot.get(shot.shot) || {};
    const queue = queueByShot.get(shot.shot);
    const payload = payloadByShot.get(shot.shot);
    const workOrder = workOrderByShot.get(shot.shot);
    const visible = shot.visible_named_only || [];
    const authoritativeBattleState = metadata.battle_state_after || activeShot.battle_state_after || shot.battle_state_after || {};
    const authoritativeLedger = authoritativeBattleState.battle_ledger_after || metadata.battle_ledger_after || activeShot.battle_ledger_after || shot.battle_ledger_after || {};
    const expectedLedger = expectedLedgerFields(authoritativeBattleState, authoritativeLedger, visible);

    compare(`${shot.shot} manifest order`, Number(shot.order), expectedOrder, shotProblems);
    if (!queue) shotProblems.push(`${shot.shot}: missing submission_queue row`);
    if (!payload) shotProblems.push(`${shot.shot}: missing submission_payload row`);
    if (!workOrder) shotProblems.push(`${shot.shot}: missing execution_plan work_order`);

    if (queue) {
      compare(`${shot.shot} queue order`, Number(queue.order), Number(shot.order), shotProblems);
      compare(`${shot.shot} queue status`, queue.status, shot.status, shotProblems);
      compare(`${shot.shot} queue duration`, Number(queue.duration_seconds), Number(shot.duration_seconds), shotProblems);
      compare(`${shot.shot} queue shot_dir`, queue.shot_dir, shot.package_dir, shotProblems);
      compare(`${shot.shot} queue expected_clip`, queue.expected_clip, shot.expected_clip, shotProblems);
      compare(`${shot.shot} queue primary_check`, queue.primary_check, shot.primary_check, shotProblems);
      compareList(`${shot.shot} queue visible_named_only`, csvVisible(queue.visible_named_only), visible, shotProblems);
    }

    if (payload) {
      compare(`${shot.shot} payload custom_id`, payload.custom_id, expectedCustomId, shotProblems);
      compare(`${shot.shot} payload id`, payload.id, shot.id, shotProblems);
      compare(`${shot.shot} payload order`, Number(payload.order), Number(shot.order), shotProblems);
      compare(`${shot.shot} payload duration`, Number(payload.duration_seconds), Number(shot.duration_seconds), shotProblems);
      compare(`${shot.shot} payload status`, payload.status, shot.status, shotProblems);
      compare(`${shot.shot} payload prompt_file`, payload.prompt_file, expectedModelPrompt, shotProblems);
      compare(`${shot.shot} payload audit_prompt_file`, payload.audit_prompt_file, expectedAuditPrompt, shotProblems);
      compare(`${shot.shot} payload negative_prompt_file`, payload.negative_prompt_file, expectedNegativePrompt, shotProblems);
      compare(`${shot.shot} payload start_frame`, payload.input_frames?.start_frame, expectedStart, shotProblems);
      compare(`${shot.shot} payload key_frame`, payload.input_frames?.key_frame, expectedKey, shotProblems);
      compare(`${shot.shot} payload end_frame`, payload.input_frames?.end_frame, expectedEnd, shotProblems);
      compare(`${shot.shot} payload expected_clip`, payload.expected_clip, shot.expected_clip, shotProblems);
      compare(`${shot.shot} payload primary_check`, payload.primary_check, shot.primary_check, shotProblems);
      compareList(`${shot.shot} payload visible_named_only`, payload.visible_named_only || [], visible, shotProblems);
      compareList(`${shot.shot} payload reject_if`, payload.reject_if || [], shot.reject_if || [], shotProblems);
      if (!sameObject(payload.battle_ledger_after || {}, authoritativeLedger)) {
        shotProblems.push(`${shot.shot}: payload battle_ledger_after does not match authoritative ledger`);
      }
      if (!sameObject(payload.battle_state_after?.battle_ledger_after || {}, authoritativeLedger)) {
        shotProblems.push(`${shot.shot}: payload battle_state_after.battle_ledger_after does not match authoritative ledger`);
      }
      for (const [key, expectedValue] of Object.entries(expectedLedger)) {
        compare(`${shot.shot} payload ${key}`, payload[key] || "", expectedValue, shotProblems);
      }
    }

    if (workOrder) {
      compare(`${shot.shot} execution_plan id`, workOrder.id, shot.id, shotProblems);
      compare(`${shot.shot} execution_plan order`, Number(workOrder.order), Number(shot.order), shotProblems);
      compare(`${shot.shot} execution_plan status`, workOrder.status, shot.status, shotProblems);
      compare(`${shot.shot} execution_plan duration`, Number(workOrder.duration_seconds), Number(shot.duration_seconds), shotProblems);
      compare(`${shot.shot} execution_plan expected_clip`, workOrder.expected_clip, shot.expected_clip, shotProblems);
      compare(`${shot.shot} execution_plan model_prompt`, workOrder.model_prompt || workOrder.prompt, expectedModelPrompt, shotProblems);
      compare(`${shot.shot} execution_plan audit_prompt`, workOrder.audit_prompt, expectedAuditPrompt, shotProblems);
      compare(`${shot.shot} execution_plan negative_prompt`, workOrder.negative_prompt, expectedNegativePrompt, shotProblems);
      compare(`${shot.shot} execution_plan start_frame`, workOrder.start_frame, expectedStart, shotProblems);
      compare(`${shot.shot} execution_plan key_frame`, workOrder.key_frame, expectedKey, shotProblems);
      compare(`${shot.shot} execution_plan end_frame`, workOrder.end_frame, expectedEnd, shotProblems);
      compareList(`${shot.shot} execution_plan visible_named_only`, workOrder.visible_named_only || [], visible, shotProblems);
    }

    if (metadata) {
      compare(`${shot.shot} metadata id`, metadata.id, shot.id, shotProblems);
      compare(`${shot.shot} metadata shot`, metadata.shot, shot.shot, shotProblems);
      compare(`${shot.shot} metadata order`, Number(metadata.order), Number(shot.order), shotProblems);
      compare(`${shot.shot} metadata status`, metadata.status, shot.status, shotProblems);
      compare(`${shot.shot} metadata duration`, Number(metadata.duration_seconds), Number(shot.duration_seconds), shotProblems);
      compare(`${shot.shot} metadata expected_clip`, metadata.expected_clip, shot.expected_clip, shotProblems);
      compareList(`${shot.shot} metadata visible_named_only`, metadata.visible_named_only || [], visible, shotProblems);
      compareList(`${shot.shot} metadata reject_if`, metadata.reject_if || [], shot.reject_if || [], shotProblems);
      compareList(
        `${shot.shot} metadata changed_this_shot`,
        metadata.battle_state_after?.battle_ledger_after?.changed_this_shot || [],
        authoritativeLedger.changed_this_shot || [],
        shotProblems,
      );
      const metadataNoActive = metadata.battle_state_after?.no_active_combat_after || [];
      const authoritativeNoActive = authoritativeBattleState.no_active_combat_after || [];
      compareList(`${shot.shot} metadata no_active_combat_after`, metadataNoActive, authoritativeNoActive, shotProblems);
    } else {
      shotProblems.push(`${shot.shot}: missing metadata.json`);
    }

    for (const problem of shotProblems) rowProblems.push(problem);
    submissionBattleLedgerRows.push({
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      custom_id: expectedCustomId,
      visible_named_only: visible,
      expected_ledger_fields: expectedLedger,
      expected_battle_ledger_after: authoritativeLedger,
      payload_ledger_fields: payload ? {
        alive_safe_after: payload.alive_safe_after || "",
        visible_but_no_active_combat_after: payload.visible_but_no_active_combat_after || "",
        active_or_objective_after: payload.active_or_objective_after || "",
        limited_after: payload.limited_after || "",
        defeated_removed_after: payload.defeated_removed_after || "",
        captured_objective_defeated_after: payload.captured_objective_defeated_after || "",
        stood_down_post_battle_after: payload.stood_down_post_battle_after || "",
        must_not_return_active_after: payload.must_not_return_active_after || "",
        changed_this_shot: payload.changed_this_shot || "",
        no_active_combat_line: payload.no_active_combat_line || "",
      } : null,
      payload_battle_ledger_after: payload?.battle_ledger_after || null,
      payload_battle_state_ledger_after: payload?.battle_state_after?.battle_ledger_after || null,
      metadata_battle_ledger_after: metadata?.battle_state_after?.battle_ledger_after || metadata?.battle_ledger_after || null,
      metadata_no_active_combat_after: metadata?.battle_state_after?.no_active_combat_after || [],
    });
    rows.push({
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
      custom_id: expectedCustomId,
      visible_named_only: visible,
      queue_ok: Boolean(queue) && !shotProblems.some((problem) => problem.includes(" queue ")),
      payload_ok: Boolean(payload) && !shotProblems.some((problem) => problem.includes(" payload ")),
      execution_plan_ok: Boolean(workOrder) && !shotProblems.some((problem) => problem.includes(" execution_plan ")),
      metadata_ok: Boolean(metadata) && !shotProblems.some((problem) => problem.includes(" metadata ")),
      problems: shotProblems,
    });
  }

  problems.push(...rowProblems);
  const submissionBattleLedgerRowsDigest = sha256Text(`${JSON.stringify(submissionBattleLedgerRows)}\n`);
  const decision = problems.length ? "submission_contract_blocked" : "submission_contract_gate_passed";
  const report = {
    date,
    package_id: manifest.package_id,
    package_manifest: rel(manifestPath),
    decision,
    expected_shots: expected,
    rows_checked: rows.length,
    execution_plan_rows: workOrders.length,
    submission_queue_rows: queueRows.length,
    submission_payload_rows: payloadRows.length,
    submission_battle_ledger_rows_digest_sha256: submissionBattleLedgerRowsDigest,
    submission_battle_ledger_rows: submissionBattleLedgerRows,
    problems,
    rows,
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Submission Contract Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Expected shots: ${expected}`,
    `Rows checked: ${rows.length}`,
    "",
    "This gate verifies that `package_manifest.json`, `execution_plan.json`, `submission_queue.csv`, `submission_payload.jsonl`, and each shot `metadata.json` describe the same shot IDs, order, duration, expected clip, file paths, visible roster, reject criteria, and battle-ledger transition fields.",
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Rows",
    "",
    "| Order | Shot | Queue | Payload | Plan | Metadata | Problems |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row.order} | ${row.shot} | ${row.queue_ok ? "pass" : "fail"} | ${row.payload_ok ? "pass" : "fail"} | ${row.execution_plan_ok ? "pass" : "fail"} | ${row.metadata_ok ? "pass" : "fail"} | ${row.problems.length} |`),
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  process.stdout.write(`${JSON.stringify({
    decision,
    expected_shots: expected,
    rows_checked: rows.length,
    execution_plan_rows: workOrders.length,
    submission_queue_rows: queueRows.length,
    submission_payload_rows: payloadRows.length,
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

main();
