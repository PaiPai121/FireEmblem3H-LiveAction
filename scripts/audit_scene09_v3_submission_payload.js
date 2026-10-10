const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const payloadPath = path.join(packageDir, "submission_payload.jsonl");
const payloadManifestPath = path.join(packageDir, "submission_payload_manifest.json");
const reportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_submission_payload_audit_2026-07-28.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function rel(file) {
  return path.relative(root, file);
}

function digest(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function rejectKey(value) {
  return String(value || "")
    .trim()
    .replace(/^[-\s]+/, "")
    .replace(/^Reject if\s+/i, "")
    .replace(/\s+/g, " ")
    .replace(/[.。]+$/g, "")
    .toLowerCase();
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

function expectedLedgerFields(metadata) {
  const state = metadata.battle_state_after || {};
  const ledger = state.battle_ledger_after || metadata.battle_ledger_after || {};
  const noActive = unique([
    ...(Array.isArray(state.inactive_or_removed_after) ? state.inactive_or_removed_after : []),
    ...(Array.isArray(state.no_active_combat_after) ? state.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
  ]);
  return {
    alive_safe_after: groupText(ledger.alive_by_house || state.active_by_house),
    active_or_objective_after: groupText(ledger.still_active_or_controlling_objective_by_house || state.active_by_house),
    limited_after: groupText(ledger.limited_but_not_defeated_by_house),
    defeated_removed_after: groupText(ledger.mock_battle_defeated_or_removed_by_house || state.inactive_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_or_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_or_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: noActive.join(", ") || "none",
  };
}

function sameJson(a, b) {
  return JSON.stringify(a || {}) === JSON.stringify(b || {});
}

function main() {
  const problems = [];
  if (!fs.existsSync(packageManifestPath)) problems.push(`missing package manifest: ${rel(packageManifestPath)}`);
  if (!fs.existsSync(payloadPath)) problems.push(`missing submission payload: ${rel(payloadPath)}`);
  if (!fs.existsSync(payloadManifestPath)) problems.push(`missing submission payload manifest: ${rel(payloadManifestPath)}`);
  if (problems.length) {
    const report = { date: "2026-07-28", problems, decision: "blocked_needs_revision" };
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    process.exit(1);
  }

  const packageManifest = readJson(packageManifestPath);
  const payloadManifest = readJson(payloadManifestPath);
  const lines = readText(payloadPath).split(/\n/).filter(Boolean);
  const rows = [];
  for (const [index, line] of lines.entries()) {
    try {
      rows.push(JSON.parse(line));
    } catch (error) {
      problems.push(`line ${index + 1}: invalid JSON (${error.message})`);
    }
  }

  const forbiddenText = [
    "[SOURCE_SLOT]",
    "[LYRIC_SOURCE_SLOT]",
    "TODO",
    "TBD",
    "insert later",
  ];
  const expectedShots = packageManifest.shots || [];
  const expectedByShot = new Map(expectedShots.map((shot) => [shot.shot, shot]));
  const expectedClipSet = new Set();
  const customIdSet = new Set();
  const rowSummaries = [];

  if (rows.length !== packageManifest.total_shots) {
    problems.push(`payload row count ${rows.length} does not match package total ${packageManifest.total_shots}`);
  }
  if (payloadManifest.rows !== rows.length) {
    problems.push(`payload manifest rows ${payloadManifest.rows} does not match parsed rows ${rows.length}`);
  }
  const payloadSha = crypto.createHash("sha256").update(readText(payloadPath)).digest("hex");
  if (payloadManifest.sha256 !== payloadSha) {
    problems.push(`payload manifest sha256 mismatch expected=${payloadManifest.sha256} actual=${payloadSha}`);
  }

  for (const [index, row] of rows.entries()) {
    const expected = expectedByShot.get(row.shot);
    if (!expected) problems.push(`line ${index + 1}: unknown shot ${row.shot}`);
    if (row.order !== index + 1) problems.push(`${row.shot}: order ${row.order} does not match line ${index + 1}`);
    if (customIdSet.has(row.custom_id)) problems.push(`${row.shot}: duplicate custom_id ${row.custom_id}`);
    customIdSet.add(row.custom_id);
    if (expectedClipSet.has(row.expected_clip)) problems.push(`${row.shot}: duplicate expected_clip ${row.expected_clip}`);
    expectedClipSet.add(row.expected_clip);

    const shotDir = expected ? path.join(packageDir, expected.package_dir) : packageDir;
    const fileChecks = {
      model_prompt: path.join(shotDir, "model_prompt.md"),
      audit_prompt: path.join(shotDir, "prompt.md"),
      negative_prompt: path.join(shotDir, "negative_prompt.md"),
      start_frame: path.join(shotDir, "start_frame.png"),
      key_frame: path.join(shotDir, "key_frame.png"),
      end_frame: path.join(shotDir, "end_frame.png"),
      metadata: path.join(shotDir, "metadata.json"),
    };
    for (const [key, file] of Object.entries(fileChecks)) {
      if (!fs.existsSync(file)) {
        problems.push(`${row.shot}: missing ${key} file ${rel(file)}`);
        continue;
      }
      const actual = digest(file);
      const recorded = row.file_digests?.[key];
      if (!recorded || recorded.sha256 !== actual.sha256 || Number(recorded.bytes) !== actual.bytes) {
        problems.push(`${row.shot}: digest mismatch for ${key}`);
      }
      if (row.absolute_files?.[key] !== file) {
        problems.push(`${row.shot}: absolute_files.${key} mismatch`);
      }
    }

    const modelPrompt = fs.existsSync(fileChecks.model_prompt) ? readText(fileChecks.model_prompt).trimEnd() : "";
    const negativePrompt = fs.existsSync(fileChecks.negative_prompt) ? readText(fileChecks.negative_prompt).trimEnd() : "";
    const metadata = fs.existsSync(fileChecks.metadata) ? readJson(fileChecks.metadata) : {};
    if (row.prompt_text !== modelPrompt) problems.push(`${row.shot}: prompt_text does not match model_prompt.md`);
    if (row.negative_prompt_text !== negativePrompt) problems.push(`${row.shot}: negative_prompt_text does not match negative_prompt.md`);
    if (row.prompt_file !== expected?.model_prompt) problems.push(`${row.shot}: prompt_file does not match package manifest model_prompt`);
    if (row.audit_prompt_file !== expected?.audit_prompt && row.audit_prompt_file !== path.join(expected?.package_dir || "", "prompt.md")) {
      problems.push(`${row.shot}: audit_prompt_file mismatch`);
    }
    if (!row.prompt_text.includes(`Only these readable humans may appear: ${(expected?.visible_named_only || []).join(", ") || "none"}.`)) {
      problems.push(`${row.shot}: prompt_text visible lock mismatch`);
    }
    if (!/no text, no subtitles, no captions, no visible text, no watermark/.test(row.prompt_text)) {
      problems.push(`${row.shot}: prompt_text missing no text/subtitles/watermark negative lock`);
    }
    if (!/no camera spin, no screen-direction reversal/.test(row.prompt_text)) {
      problems.push(`${row.shot}: prompt_text missing camera/screen-direction negative lock`);
    }
    const expectedLedger = metadata.battle_state_after?.battle_ledger_after || metadata.battle_ledger_after || {};
    if (!row.battle_ledger_after || typeof row.battle_ledger_after !== "object") {
      problems.push(`${row.shot}: payload missing structured battle_ledger_after`);
    } else if (!sameJson(row.battle_ledger_after, expectedLedger)) {
      problems.push(`${row.shot}: payload battle_ledger_after does not match metadata`);
    }
    if (!row.battle_state_after || typeof row.battle_state_after !== "object") {
      problems.push(`${row.shot}: payload missing structured battle_state_after`);
    } else if (!sameJson(row.battle_state_after?.battle_ledger_after || {}, expectedLedger)) {
      problems.push(`${row.shot}: payload battle_state_after.battle_ledger_after does not match metadata`);
    }
    const ledgerFields = expectedLedgerFields(metadata);
    for (const [key, expectedValue] of Object.entries(ledgerFields)) {
      if (String(row[key] || "") !== expectedValue) {
        problems.push(`${row.shot}: payload ${key} ${JSON.stringify(row[key] || "")} does not match ${JSON.stringify(expectedValue)}`);
      }
    }
    const rejectKeys = new Set();
    for (const line of row.reject_if || []) {
      const key = rejectKey(line);
      if (!key) continue;
      if (rejectKeys.has(key)) problems.push(`${row.shot}: duplicate semantic reject_if line "${line}"`);
      rejectKeys.add(key);
    }
    for (const phrase of forbiddenText) {
      if (row.prompt_text.includes(phrase) || row.negative_prompt_text.includes(phrase)) {
        problems.push(`${row.shot}: payload contains forbidden text ${phrase}`);
      }
    }
    rowSummaries.push({
      shot: row.shot,
      custom_id: row.custom_id,
      prompt_chars: row.prompt_text.length,
      visible_named_only: row.visible_named_only || [],
      expected_clip: row.expected_clip,
      start_frame_sha256: row.file_digests?.start_frame?.sha256 || "",
      model_prompt_sha256: row.file_digests?.model_prompt?.sha256 || "",
    });
  }

  const report = {
    date: "2026-07-28",
    package_manifest: rel(packageManifestPath),
    payload: rel(payloadPath),
    payload_manifest: rel(payloadManifestPath),
    rows_checked: rows.length,
    expected_rows: packageManifest.total_shots,
    payload_sha256: payloadSha,
    problems,
    row_summaries: rowSummaries,
    decision: problems.length ? "blocked_needs_revision" : "submission_payload_ready_for_monitored_video_model_run",
  };
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (problems.length) process.exit(1);
}

main();
