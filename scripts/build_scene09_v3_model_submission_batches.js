#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const payloadPath = path.join(packageDir, "submission_payload.jsonl");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const battleLedgerPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json");
const outDir = path.join(packageDir, "model_submission_batches");
const date = "2026-07-31";
const reportPath = path.join(root, `production_system/scene09_v3_attrition_package/scene09_v3_model_submission_batches_${date}.json`);

function parseArgs(argv) {
  const options = { batchSize: 6 };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--batch-size") {
      const value = Number(argv[i + 1]);
      if (!Number.isInteger(value) || value < 1) throw new Error("--batch-size must be a positive integer");
      options.batchSize = value;
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/build_scene09_v3_model_submission_batches.js [--batch-size 6]");
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
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

function sha256Text(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function digestFile(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function rel(file) {
  return path.relative(root, file);
}

function csvCell(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function parsePayload() {
  if (!fs.existsSync(payloadPath)) throw new Error(`Missing submission payload: ${rel(payloadPath)}`);
  return readText(payloadPath)
    .split(/\n/)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid JSONL at ${rel(payloadPath)} line ${index + 1}: ${error.message}`);
      }
    });
}

function batchName(index, rows) {
  const first = String(rows[0].order).padStart(3, "0");
  const last = String(rows[rows.length - 1].order).padStart(3, "0");
  return `batch_${String(index + 1).padStart(3, "0")}_shots_${first}-${last}`;
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

function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}

function visibleButNoActiveText(visible, ledgerRow = {}) {
  const active = new Set(flattenGroups(ledgerRow.active_by_house || ledgerRow.still_active_or_controlling_objective_by_house));
  const inactiveVisible = (visible || []).filter((name) => name && !active.has(name));
  return inactiveVisible.length ? inactiveVisible.join(", ") : "none";
}

function ledgerFields(ledgerRow = {}) {
  return {
    battle_ledger_after: {
      alive_by_house: ledgerRow.alive_by_house || {},
      active_by_house: ledgerRow.active_by_house || {},
      limited_by_house: ledgerRow.limited_by_house || {},
      defeated_removed_by_house: ledgerRow.defeated_removed_by_house || {},
      captured_objective_defeated_by_house: ledgerRow.captured_objective_defeated_by_house || {},
      stood_down_post_battle_by_house: ledgerRow.stood_down_post_battle_by_house || {},
      must_not_return_active_by_house: ledgerRow.must_not_return_active_by_house || {},
      changed_this_shot: ledgerRow.changed_this_shot || [],
      no_active_combat_line: ledgerRow.no_active_combat_line || "none",
    },
    alive_safe_after: groupText(ledgerRow.alive_by_house),
    active_or_objective_after: groupText(ledgerRow.active_by_house),
    limited_after: groupText(ledgerRow.limited_by_house),
    defeated_removed_after: groupText(ledgerRow.defeated_removed_by_house),
    captured_objective_defeated_after: groupText(ledgerRow.captured_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledgerRow.stood_down_post_battle_by_house),
    must_not_return_active_after: groupText(ledgerRow.must_not_return_active_by_house),
    changed_this_shot: changeText(ledgerRow.changed_this_shot),
    no_active_combat_line: ledgerRow.no_active_combat_line || "none",
  };
}

function enrichRowsWithLedger(rows) {
  if (!fs.existsSync(battleLedgerPath)) throw new Error(`Missing battle ledger: ${rel(battleLedgerPath)}`);
  const ledger = readJson(battleLedgerPath);
  const ledgerByShot = new Map((ledger.rows || []).map((row) => [row.shot, row]));
  return rows.map((row) => {
    const ledgerRow = ledgerByShot.get(row.shot);
    if (!ledgerRow) throw new Error(`Missing battle ledger row for ${row.shot}`);
    return {
      ...row,
      ...ledgerFields(ledgerRow),
      visible_but_no_active_combat_after: visibleButNoActiveText(row.visible_named_only || [], ledgerRow),
    };
  });
}

function renderBatchCsv(rows) {
  const fields = [
    "batch_custom_id",
    "order",
    "shot",
    "duration_seconds",
    "visible_named_only",
    "visible_but_no_active_combat_after",
    "model_prompt",
    "negative_prompt",
    "start_frame",
    "key_frame",
    "end_frame",
    "expected_clip",
    "primary_check",
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
  const csvRows = rows.map((row) => [
    row.custom_id,
    row.order,
    row.shot,
    row.duration_seconds,
    (row.visible_named_only || []).join("; "),
    row.visible_but_no_active_combat_after || "none",
    row.absolute_files?.model_prompt || "",
    row.absolute_files?.negative_prompt || "",
    row.absolute_files?.start_frame || "",
    row.absolute_files?.key_frame || "",
    row.absolute_files?.end_frame || "",
    row.absolute_expected_clip || row.expected_clip,
    row.primary_check || "",
    row.alive_safe_after || "none",
    row.active_or_objective_after || "none",
    row.limited_after || "none",
    row.defeated_removed_after || "none",
    row.captured_objective_defeated_after || "none",
    row.stood_down_post_battle_after || "none",
    row.must_not_return_active_after || "none",
    row.changed_this_shot || "none",
    row.no_active_combat_line || "none",
  ]);
  return [fields, ...csvRows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function renderBatchRunbook(name, rows) {
  return [
    `# ${name}`,
    "",
    "Provider-neutral full-duration image-to-video submission batch for EP02 Scene09 V3.",
    "",
    "Current lock: do not submit this full-duration batch until `full_duration_release_gate` is `full_duration_release_passed`.",
    "",
    "Use the JSONL when a model accepts structured batch input only after release. Use the CSV when submitting manually or through a spreadsheet/import UI only after release.",
    "",
    "## Hard Rules",
    "",
    "- Full-duration generation is locked until 42/42 returned motion probes pass signed Codex review and the production package contains `motion_probe_full_duration_release.json`.",
    "- Submit only the named visible roster listed per row.",
    "- Do not add anonymous students, spectators, crowds, soldiers, or readable silhouettes.",
    "- Keep Hanneman and Manuela in separate teacher lanes; never stage them as a pair.",
    "- Save each returned mp4 exactly to the expected clip path, then run the ingest and motion QA scripts from the package Runbook.",
    "- Proxy animatic clips are reference-only and must not be copied into expected clip paths.",
    "",
    "## Rows",
    "",
    ...rows.map((row) => [
      `### ${row.custom_id}`,
      "",
      `- Shot: ${row.shot}`,
      `- Duration: ${row.duration_seconds}s`,
      `- Visible named-only: ${(row.visible_named_only || []).join(", ") || "none"}`,
      `- Visible But No Active Combat After: ${row.visible_but_no_active_combat_after || "none"}`,
      `- Prompt: ${row.absolute_files?.model_prompt || row.prompt_file}`,
      `- Negative: ${row.absolute_files?.negative_prompt || row.negative_prompt_file}`,
      `- Frames: ${row.absolute_files?.start_frame} | ${row.absolute_files?.key_frame} | ${row.absolute_files?.end_frame}`,
      `- Expected clip: ${row.absolute_expected_clip || row.expected_clip}`,
      `- Primary check: ${row.primary_check || ""}`,
      `- Alive / Safe After: ${row.alive_safe_after || "none"}`,
      `- Active / Controlling After: ${row.active_or_objective_after || "none"}`,
      `- Limited But Not Defeated After: ${row.limited_after || "none"}`,
      `- Defeated / Removed After: ${row.defeated_removed_after || "none"}`,
      `- Captured / Objective-Defeated After: ${row.captured_objective_defeated_after || "none"}`,
      `- Stood Down / Post-Battle After: ${row.stood_down_post_battle_after || "none"}`,
      `- Must Not Return Active: ${row.must_not_return_active_after || "none"}`,
      `- Changed This Shot: ${row.changed_this_shot || "none"}`,
      `- No-Active-Combat Line: ${row.no_active_combat_line || "none"}`,
      "",
    ].join("\n")),
  ].join("\n");
}

function renderExpectedDownloads(rows) {
  const fields = [
    "custom_id",
    "shot",
    "expected_filename",
    "expected_clip",
    "absolute_expected_clip",
    "ingest_match_keys",
    "clip_received",
    "operator_notes",
  ];
  const csvRows = rows.map((row) => [
    row.custom_id,
    row.shot,
    path.basename(row.expected_clip || ""),
    row.expected_clip || "",
    row.absolute_expected_clip || "",
    [row.custom_id, row.shot, path.basename(row.expected_clip || "")].filter(Boolean).join("; "),
    "",
    "",
  ]);
  return [fields, ...csvRows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packageManifest = readJson(packageManifestPath);
  const rows = enrichRowsWithLedger(parsePayload().sort((a, b) => Number(a.order) - Number(b.order)));
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const batches = [];
  for (let index = 0; index < rows.length; index += options.batchSize) {
    const batchRows = rows.slice(index, index + options.batchSize);
    const name = batchName(batches.length, batchRows);
    const jsonlText = batchRows.map((row) => JSON.stringify(row)).join("\n") + "\n";
    const csvText = renderBatchCsv(batchRows);
    const runbookText = renderBatchRunbook(name, batchRows);
    const jsonlPath = path.join(outDir, `${name}.jsonl`);
    const csvPath = path.join(outDir, `${name}.csv`);
    const mdPath = path.join(outDir, `${name}.md`);
    writeText(jsonlPath, jsonlText);
    writeText(csvPath, csvText);
    writeText(mdPath, runbookText);
    batches.push({
      batch_id: name,
      order_start: batchRows[0].order,
      order_end: batchRows[batchRows.length - 1].order,
      rows: batchRows.length,
      custom_ids: batchRows.map((row) => row.custom_id),
      jsonl: path.relative(packageDir, jsonlPath),
      csv: path.relative(packageDir, csvPath),
      runbook: path.relative(packageDir, mdPath),
      sha256: {
        jsonl: sha256Text(jsonlText),
        csv: sha256Text(csvText),
        runbook: sha256Text(runbookText),
      },
    });
  }

  const expectedDownloadsPath = path.join(outDir, "expected_downloads.csv");
  const expectedDownloadsText = renderExpectedDownloads(rows);
  writeText(expectedDownloadsPath, expectedDownloadsText);

  const manifest = {
    version: 1,
    created_at: date,
    package_id: packageManifest.package_id,
    source_payload: "submission_payload.jsonl",
    source_payload_sha256: digestFile(payloadPath).sha256,
    source_battle_ledger: rel(battleLedgerPath),
    status: "clips_pending",
    full_duration_submission_status: "prepared_locked_probe_release_pending",
    batch_size: options.batchSize,
    total_shots: rows.length,
    total_batches: batches.length,
    total_duration_seconds: rows.reduce((sum, row) => sum + Number(row.duration_seconds || 0), 0),
    provider_neutral_policy: "Each JSONL row is self-contained for full-duration submission after full_duration_release_gate passes: prompt text, negative prompt, start/key/end frame paths, visible roster lock, battle ledger state, reject criteria, and expected mp4 path.",
    expected_downloads_csv: path.relative(packageDir, expectedDownloadsPath),
    batches,
  };
  const manifestPath = path.join(outDir, "batch_manifest.json");
  writeJson(manifestPath, manifest);

  const report = {
    date,
    decision: "model_submission_batches_ready",
    package_dir: rel(packageDir),
    batch_manifest: rel(manifestPath),
    source_battle_ledger: rel(battleLedgerPath),
    total_shots: rows.length,
    total_batches: batches.length,
    batch_size: options.batchSize,
    expected_downloads_csv: rel(expectedDownloadsPath),
  };
  writeJson(reportPath, report);
  console.log(JSON.stringify(report, null, 2));
}

main();
