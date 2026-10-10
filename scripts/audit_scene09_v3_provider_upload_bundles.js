#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const bundlesDir = path.join(pkgDir, "provider_upload_bundles");
const manifestPath = path.join(bundlesDir, "provider_upload_bundles_manifest.json");
const outPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_provider_upload_bundles_audit_2026-08-01.json");
const packageOutJson = path.join(pkgDir, "provider_upload_bundles_audit.json");
const packageOutMd = path.join(pkgDir, "provider_upload_bundles_audit.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function sha256(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

const ledgerColumns = [
  "alive_safe_after",
  "visible_but_no_active_combat_after",
  "active_or_objective_after",
  "limited_after",
  "defeated_removed_after",
  "captured_objective_defeated_after",
  "stood_down_post_battle_after",
  "must_not_return_active_after",
  "changed_this_shot",
  "no_active_combat_line",
];

const checklistLedgerPhrases = [
  "Alive / Safe After:",
  "Visible But No Active Combat After:",
  "Active / Controlling After:",
  "Limited But Not Defeated After:",
  "Defeated / Removed After:",
  "Captured / Objective-Defeated After:",
  "Stood Down / Post-Battle After:",
  "Must Not Return Active:",
  "Changed This Shot:",
  "No-Active-Combat Line:",
];

const packagePathLeakPatterns = [
  "delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/",
  "/Users/zekun/FireEmblem3H-LiveAction/delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/",
];

const bundleRequiredFiles = [
  "batch.jsonl",
  "batch.csv",
  "batch_runbook.md",
  "expected_downloads_subset.csv",
  "ORDERED_UPLOAD_CHECKLIST.md",
  "RETURN_CONTRACT.md",
  "bundle_manifest.json",
];

const returnContractPhrases = [
  "Expected clips: 42.",
  "No proxy animatic clips",
  "Return format is `.mp4` only",
  "Exact expected filename",
  "Filename beginning with the exact `custom_id`",
  "Bare shot names",
  "ffprobe",
  "Codex, not the user",
  "motion_self_audit_apply_gate",
  "Full Post-Shot Ledger Return QA",
  "Alive / Safe After",
  "Visible But No Active Combat After",
  "Active / Controlling After",
  "Limited But Not Defeated After",
  "Defeated / Removed After",
  "Captured / Objective-Defeated After",
  "Stood Down / Post-Battle After",
  "Must Not Return Active",
  "Changed This Shot",
  "No-Active-Combat Line",
  "clip_revision_queue.csv",
  "motion_review_passed",
  "No unnamed readable people",
  "Shot032F Hubert captured by Felix/Ashe",
  "Shot032G Dorothea and Bernadetta captured by Leonie/Claude",
  "Shot034B empty faculty objective with Hanneman/Manuela absent/offscreen/unpaired",
  "Shot034G exhausted Dimitri/Dedue core victory",
  "Shot034B remains Byleth and Dimitri only",
];

const knownNames = [
  "Byleth",
  "Dimitri",
  "Dedue",
  "Felix",
  "Ashe",
  "Annette",
  "Mercedes",
  "Sylvain",
  "Ingrid",
  "Edelgard",
  "Hubert",
  "Ferdinand",
  "Dorothea",
  "Bernadetta",
  "Claude",
  "Hilda",
  "Lorenz",
  "Ignatz",
  "Leonie",
  "Hanneman",
  "Manuela",
];

function jsonlRows(file) {
  return readText(file).trim().split(/\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function csvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const ch = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((value) => value !== ""));
}

function checkChecklistLedgerText(text, batchId, label, rows, problems) {
  for (const phrase of checklistLedgerPhrases) {
    const count = (text.match(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
    if (count !== 6) problems.push(`${batchId}: ${label} ${phrase} count=${count}, expected 6`);
  }
  for (const row of rows) {
    for (const [ledgerLabel, key] of [
      ["Alive / Safe After", "alive_safe_after"],
      ["Visible But No Active Combat After", "visible_but_no_active_combat_after"],
      ["Active / Controlling After", "active_or_objective_after"],
      ["Limited But Not Defeated After", "limited_after"],
      ["Defeated / Removed After", "defeated_removed_after"],
      ["Captured / Objective-Defeated After", "captured_objective_defeated_after"],
      ["Stood Down / Post-Battle After", "stood_down_post_battle_after"],
      ["Must Not Return Active", "must_not_return_active_after"],
      ["Changed This Shot", "changed_this_shot"],
      ["No-Active-Combat Line", "no_active_combat_line"],
    ]) {
      const expected = `- ${ledgerLabel}: ${row[key] || "none"}`;
      if (!text.includes(expected)) problems.push(`${batchId}: ${label} missing ${row.custom_id} ${expected}`);
    }
  }
}

function checkNoPathLeaks(text, batchId, label, problems) {
  for (const pattern of packagePathLeakPatterns) {
    if (text.includes(pattern)) problems.push(`${batchId}: ${label} leaks package path ${pattern}`);
  }
}

function checkReturnContractText(text, batchId, label, rows, problems) {
  for (const phrase of returnContractPhrases) {
    if (!text.includes(phrase)) problems.push(`${batchId}: ${label} return contract missing ${phrase}`);
  }
  for (const row of rows) {
    const expectedFilename = path.basename(row.expected_clip || "");
    if (!text.includes(row.custom_id)) problems.push(`${batchId}: ${label} return contract missing ${row.custom_id}`);
    if (!text.includes(expectedFilename)) problems.push(`${batchId}: ${label} return contract missing ${expectedFilename}`);
  }
}

function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}

function unique(values) {
  return values.filter((value, index, all) => value && all.indexOf(value) === index);
}

function namesInText(text) {
  return knownNames.filter((name) => new RegExp(`\\b${name}\\b`).test(String(text || "")));
}

function noActiveNames(row) {
  const ledger = row.battle_ledger_after || {};
  return unique([
    ...flattenGroups(ledger.must_not_return_active_by_house),
    ...namesInText(row.must_not_return_active_after),
    ...namesInText(row.no_active_combat_line),
  ]);
}

function capturedNames(row) {
  const ledger = row.battle_ledger_after || {};
  return unique([
    ...flattenGroups(ledger.captured_or_objective_defeated_by_house),
    ...flattenGroups(ledger.captured_objective_defeated_by_house),
    ...namesInText(row.captured_objective_defeated_after),
  ]);
}

function hasPhrase(text, phrase) {
  return String(text || "").toLowerCase().includes(String(phrase || "").toLowerCase());
}

function checkExecutableNegativeSemantics(text, batchId, label, row, problems) {
  const visible = new Set(row.visible_named_only || []);
  for (const phrase of [
    "no paired Hanneman and Manuela",
    "no shared teacher platform",
    "no same-lane teacher duo",
  ]) {
    if (!hasPhrase(text, phrase)) problems.push(`${batchId}: ${label} ${row.custom_id} negative prompt missing executable semantics token ${phrase}`);
  }
  if (!visible.has("Hanneman") && !hasPhrase(text, "no readable Hanneman")) {
    problems.push(`${batchId}: ${label} ${row.custom_id} negative prompt must ban readable Hanneman when not visible`);
  }
  if (!visible.has("Manuela") && !hasPhrase(text, "no readable Manuela")) {
    problems.push(`${batchId}: ${label} ${row.custom_id} negative prompt must ban readable Manuela when not visible`);
  }
  for (const name of noActiveNames(row)) {
    const expected = visible.has(name)
      ? [`no renewed attack by ${name}`, `no active-combat reset for ${name}`]
      : [`no readable return of ${name}`, `no active return of ${name}`];
    for (const phrase of expected) {
      if (!hasPhrase(text, phrase)) problems.push(`${batchId}: ${label} ${row.custom_id} negative prompt missing ledger token ${phrase}`);
    }
  }
  for (const name of capturedNames(row)) {
    if (!visible.has(name) && !hasPhrase(text, `no uncaptured return of ${name}`)) {
      problems.push(`${batchId}: ${label} ${row.custom_id} negative prompt missing captured token no uncaptured return of ${name}`);
    }
  }
}

function hasHeading(text, heading) {
  return new RegExp(`(^|\\n)\\s*#*\\s*${heading}\\s*:`, "i").test(text);
}

function checkPromptContractText(text, batchId, label, row, problems, stats) {
  stats.prompt_contract_files_checked += 1;
  for (const heading of ["Shot ID", "Duration", "Input Frames", "Motion", "Camera", "Performance", "Audio", "Continuity Locks"]) {
    if (!hasHeading(text, heading)) problems.push(`${batchId}: ${label} ${row.custom_id} prompt missing ${heading}`);
  }
  if (!hasHeading(text, "Reject If")) problems.push(`${batchId}: ${label} ${row.custom_id} prompt missing Reject If`);
  for (const phrase of ["uploaded START frame", "uploaded KEY frame", "uploaded END frame"]) {
    if (!text.includes(phrase)) problems.push(`${batchId}: ${label} ${row.custom_id} prompt missing web-upload frame contract phrase ${phrase}`);
  }
  for (const forbidden of ["start_frame.png", "key_frame.png", "end_frame.png"]) {
    if (text.includes(forbidden)) problems.push(`${batchId}: ${label} ${row.custom_id} prompt contains filename anchor ${forbidden}; use uploaded START/KEY/END frame wording`);
  }
  for (const phrase of [
    "No unnamed students",
    "No-active-combat after this shot",
    "Reject if captured Hubert",
    "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat",
  ]) {
    if (!text.includes(phrase)) problems.push(`${batchId}: ${label} ${row.custom_id} prompt missing continuity phrase ${phrase}`);
  }
  if (/\bTODO\b|\[SOURCE_SLOT\]|\[LYRIC_SOURCE_SLOT\]|insert later/i.test(text)) {
    problems.push(`${batchId}: ${label} ${row.custom_id} prompt contains unresolved placeholder`);
  }
}

function checkNegativePromptText(text, batchId, label, row, problems, stats) {
  stats.negative_prompt_files_checked += 1;
  for (const phrase of [
    "no extra people",
    "no unnamed students",
    "no spectators",
    "no crowds",
    "no readable silhouettes",
    "no face drift",
    "no costume drift",
    "no weapon drift",
    "no text",
    "no subtitles",
    "no captions",
    "no visible text",
    "no watermark",
    "no gore",
    "no blood",
  ]) {
    if (!text.includes(phrase)) problems.push(`${batchId}: ${label} ${row.custom_id} negative prompt missing ${phrase}`);
  }
  if (/\bTODO\b|\[SOURCE_SLOT\]|\[LYRIC_SOURCE_SLOT\]|insert later/i.test(text)) {
    problems.push(`${batchId}: ${label} ${row.custom_id} negative prompt contains unresolved placeholder`);
  }
  checkExecutableNegativeSemantics(text, batchId, label, row, problems);
  if (row.negative_prompt_text && String(row.negative_prompt_text).trim() !== String(text).trim()) {
    problems.push(`${batchId}: ${label} ${row.custom_id} negative_prompt_text differs from negative_prompt.md`);
  }
}

function checkBundleLocalReferences(baseDir, batchId, label, expectedRows, problems, stats) {
  for (const required of bundleRequiredFiles) {
    if (!fs.existsSync(path.join(baseDir, required))) problems.push(`${batchId}: ${label} missing ${required}`);
  }
  const batchJsonl = path.join(baseDir, "batch.jsonl");
  const batchRows = fs.existsSync(batchJsonl) ? jsonlRows(batchJsonl) : [];
  const expectedIds = JSON.stringify((expectedRows || []).map((row) => row.custom_id));
  const actualIds = JSON.stringify(batchRows.map((row) => row.custom_id));
  if (expectedRows && actualIds !== expectedIds) problems.push(`${batchId}: ${label} custom_id order mismatch`);
  for (const row of batchRows) {
    if (!row.battle_ledger_after || typeof row.battle_ledger_after !== "object") problems.push(`${batchId}: ${label} ${row.custom_id} missing battle_ledger_after`);
    for (const column of ledgerColumns) {
      if (!Object.prototype.hasOwnProperty.call(row, column)) problems.push(`${batchId}: ${label} ${row.custom_id} missing ${column}`);
    }
    for (const [frameKey, framePath] of Object.entries(row.input_frames || {})) {
      if (!String(framePath || "").startsWith("shots/")) problems.push(`${batchId}: ${label} ${row.custom_id} ${frameKey} is not bundle-local: ${framePath}`);
      if (!fs.existsSync(path.join(baseDir, framePath))) problems.push(`${batchId}: ${label} ${row.custom_id} missing referenced ${frameKey} ${framePath}`);
    }
    for (const [fileKey, filePath] of Object.entries(row.absolute_files || {})) {
      if (!String(filePath || "").startsWith("shots/")) problems.push(`${batchId}: ${label} ${row.custom_id} ${fileKey} is not bundle-local: ${filePath}`);
      if (!fs.existsSync(path.join(baseDir, filePath))) problems.push(`${batchId}: ${label} ${row.custom_id} missing referenced ${fileKey} ${filePath}`);
    }
    const promptPath = path.join(baseDir, row.prompt_file || row.absolute_files?.model_prompt || "");
    if (fs.existsSync(promptPath)) {
      checkPromptContractText(readText(promptPath), batchId, label, row, problems, stats);
    } else {
      problems.push(`${batchId}: ${label} ${row.custom_id} missing prompt file ${row.prompt_file || row.absolute_files?.model_prompt}`);
    }
    const negativePath = path.join(baseDir, row.negative_prompt_file || row.absolute_files?.negative_prompt || "");
    if (fs.existsSync(negativePath)) {
      checkNegativePromptText(readText(negativePath), batchId, label, row, problems, stats);
    } else {
      problems.push(`${batchId}: ${label} ${row.custom_id} missing negative prompt file ${row.negative_prompt_file || row.absolute_files?.negative_prompt}`);
    }
  }
  for (const [fileName, textLabel] of [
    ["batch.jsonl", "batch.jsonl"],
    ["batch.csv", "batch.csv"],
    ["batch_runbook.md", "batch_runbook"],
    ["ORDERED_UPLOAD_CHECKLIST.md", "checklist"],
  ]) {
    const file = path.join(baseDir, fileName);
    if (fs.existsSync(file)) checkNoPathLeaks(readText(file), batchId, `${label} ${textLabel}`, problems);
  }
  const batchCsv = path.join(baseDir, "batch.csv");
  if (fs.existsSync(batchCsv)) {
    const header = (readText(batchCsv).split(/\n/)[0] || "").split(",");
    for (const column of ledgerColumns) {
      if (!header.includes(column)) problems.push(`${batchId}: ${label} batch.csv missing ${column}`);
    }
  }
  const expectedDownloads = path.join(baseDir, "expected_downloads_subset.csv");
  if (fs.existsSync(expectedDownloads)) {
    const rows = csvRows(readText(expectedDownloads));
    const header = rows[0] || [];
    const body = rows.slice(1);
    const byCustomId = new Map(body.map((row) => [row[header.indexOf("custom_id")], row]));
    stats.expected_download_rows_checked += body.length;
    if (body.length !== batchRows.length) problems.push(`${batchId}: ${label} expected_downloads rows=${body.length}, expected ${batchRows.length}`);
    for (const column of ["custom_id", "shot", "expected_filename", "expected_clip", "ingest_match_keys"]) {
      if (!header.includes(column)) problems.push(`${batchId}: ${label} expected_downloads missing ${column}`);
    }
    for (const row of batchRows) {
      const cells = byCustomId.get(row.custom_id);
      if (!cells) {
        problems.push(`${batchId}: ${label} expected_downloads missing ${row.custom_id}`);
        continue;
      }
      const expectedFilename = path.basename(row.expected_clip || "");
      const actualFilename = cells[header.indexOf("expected_filename")];
      const actualClip = cells[header.indexOf("expected_clip")];
      const matchKeys = cells[header.indexOf("ingest_match_keys")] || "";
      if (actualFilename !== expectedFilename) problems.push(`${batchId}: ${label} ${row.custom_id} expected_filename=${actualFilename}, expected ${expectedFilename}`);
      if (actualClip !== row.expected_clip) problems.push(`${batchId}: ${label} ${row.custom_id} expected_clip=${actualClip}, expected ${row.expected_clip}`);
      for (const key of [row.custom_id, row.shot, expectedFilename]) {
        if (!matchKeys.includes(key)) problems.push(`${batchId}: ${label} ${row.custom_id} ingest_match_keys missing ${key}`);
      }
    }
  }
  const localManifestPath = path.join(baseDir, "bundle_manifest.json");
  if (fs.existsSync(localManifestPath)) {
    const localManifest = readJson(localManifestPath);
    if (localManifest.rows !== batchRows.length) problems.push(`${batchId}: ${label} manifest rows=${localManifest.rows}, expected ${batchRows.length}`);
    if (!localManifest.source_battle_ledger) problems.push(`${batchId}: ${label} manifest missing source_battle_ledger`);
    if (!String(localManifest.battle_ledger_policy || "").includes("must-not-return-active")) problems.push(`${batchId}: ${label} manifest missing battle ledger policy`);
    for (const record of localManifest.files || []) {
      stats.manifest_digest_records_checked += 1;
      const file = path.join(baseDir, path.relative(batchId, record.path).replace(/^\.\.\//, ""));
      const fallback = path.join(baseDir, record.path.replace(`${batchId}/`, ""));
      const target = fs.existsSync(file) ? file : fallback;
      if (!fs.existsSync(target)) {
        problems.push(`${batchId}: ${label} manifest recorded missing file ${record.path}`);
        continue;
      }
      const actual = sha256(target);
      if (actual.bytes !== record.bytes || actual.sha256 !== record.sha256) {
        problems.push(`${batchId}: ${label} manifest digest mismatch ${record.path}`);
      }
    }
  }
  for (const [fileName, textLabel] of [
    ["batch_runbook.md", "batch_runbook"],
    ["ORDERED_UPLOAD_CHECKLIST.md", "checklist"],
  ]) {
    const file = path.join(baseDir, fileName);
    if (fs.existsSync(file)) checkChecklistLedgerText(readText(file), batchId, `${label} ${textLabel}`, batchRows, problems);
  }
  const returnContract = path.join(baseDir, "RETURN_CONTRACT.md");
  if (fs.existsSync(returnContract)) checkReturnContractText(readText(returnContract), batchId, label, batchRows, problems);
}

function main() {
  const problems = [];
  if (!fs.existsSync(manifestPath)) problems.push(`missing ${path.relative(root, manifestPath)}`);
  const manifest = fs.existsSync(manifestPath) ? readJson(manifestPath) : { bundles: [] };
  if (manifest.total_batches !== 7) problems.push(`total_batches=${manifest.total_batches}, expected 7`);
  if (manifest.total_shots !== 42) problems.push(`total_shots=${manifest.total_shots}, expected 42`);
  if ((manifest.bundles || []).length !== 7) problems.push(`bundles length=${(manifest.bundles || []).length}, expected 7`);
  if (!manifest.source_battle_ledger) problems.push("provider upload manifest missing source_battle_ledger");

  let rows = 0;
  let zip_contents_checked = 0;
  const stats = {
    expected_download_rows_checked: 0,
    manifest_digest_records_checked: 0,
    prompt_contract_files_checked: 0,
    negative_prompt_files_checked: 0,
  };
  const seenCustomIds = new Set();
  for (const bundle of manifest.bundles || []) {
    if (bundle.rows !== 6) problems.push(`${bundle.batch_id}: rows=${bundle.rows}, expected 6`);
    rows += Number(bundle.rows || 0);
    for (const customId of bundle.custom_ids || []) {
      if (seenCustomIds.has(customId)) problems.push(`${bundle.batch_id}: duplicate custom_id ${customId}`);
      seenCustomIds.add(customId);
    }
    const dir = path.join(pkgDir, bundle.directory || "");
    if (!fs.existsSync(dir)) {
      problems.push(`${bundle.batch_id}: missing directory ${bundle.directory}`);
      continue;
    }
    for (const required of bundleRequiredFiles) {
      if (!fs.existsSync(path.join(dir, required))) problems.push(`${bundle.batch_id}: missing ${required}`);
    }
    const batchJsonl = path.join(dir, "batch.jsonl");
    let batchRows = [];
    if (fs.existsSync(batchJsonl)) {
      batchRows = jsonlRows(batchJsonl);
      if (batchRows.length !== 6) problems.push(`${bundle.batch_id}: batch.jsonl rows=${batchRows.length}, expected 6`);
      for (const row of batchRows) {
        if (!row.battle_ledger_after || typeof row.battle_ledger_after !== "object") problems.push(`${bundle.batch_id}: ${row.custom_id} missing battle_ledger_after`);
        for (const column of ledgerColumns) {
          if (!Object.prototype.hasOwnProperty.call(row, column)) problems.push(`${bundle.batch_id}: ${row.custom_id} missing ${column}`);
        }
        for (const [frameKey, framePath] of Object.entries(row.input_frames || {})) {
          if (!String(framePath || "").startsWith("shots/")) problems.push(`${bundle.batch_id}: ${row.custom_id} ${frameKey} is not bundle-local: ${framePath}`);
        }
      }
      const text = readText(batchJsonl);
      for (const pattern of packagePathLeakPatterns) {
        if (text.includes(pattern)) problems.push(`${bundle.batch_id}: batch.jsonl leaks package path ${pattern}`);
      }
    }
    const batchCsv = path.join(dir, "batch.csv");
    if (fs.existsSync(batchCsv)) {
      const csvText = readText(batchCsv);
      const header = (csvText.split(/\n/)[0] || "").split(",");
      for (const column of ledgerColumns) {
        if (!header.includes(column)) problems.push(`${bundle.batch_id}: batch.csv missing ${column}`);
      }
      for (const pattern of packagePathLeakPatterns) {
        if (csvText.includes(pattern)) problems.push(`${bundle.batch_id}: batch.csv leaks package path ${pattern}`);
      }
    }
    const batchRunbook = path.join(dir, "batch_runbook.md");
    if (fs.existsSync(batchRunbook)) {
      const text = readText(batchRunbook);
      checkChecklistLedgerText(text, bundle.batch_id, "batch_runbook", batchRows, problems);
      for (const pattern of packagePathLeakPatterns) {
        if (text.includes(pattern)) problems.push(`${bundle.batch_id}: batch_runbook leaks package path ${pattern}`);
      }
    }
    const checklist = path.join(dir, "ORDERED_UPLOAD_CHECKLIST.md");
    if (fs.existsSync(checklist)) {
      const text = readText(checklist);
      checkChecklistLedgerText(text, bundle.batch_id, "checklist", batchRows, problems);
      checkNoPathLeaks(text, bundle.batch_id, "checklist", problems);
    }
    checkBundleLocalReferences(dir, bundle.batch_id, "directory", batchRows, problems, stats);
    const localManifestPath = path.join(dir, "bundle_manifest.json");
    if (fs.existsSync(localManifestPath)) {
      const localManifest = readJson(localManifestPath);
      if (localManifest.rows !== 6) problems.push(`${bundle.batch_id}: local manifest rows=${localManifest.rows}, expected 6`);
      if (!localManifest.source_battle_ledger) problems.push(`${bundle.batch_id}: local manifest missing source_battle_ledger`);
      if (localManifest.return_contract !== "RETURN_CONTRACT.md") problems.push(`${bundle.batch_id}: local manifest return_contract ${localManifest.return_contract || "missing"} is not RETURN_CONTRACT.md`);
      if (!String(localManifest.battle_ledger_policy || "").includes("must-not-return-active")) problems.push(`${bundle.batch_id}: local manifest missing battle ledger policy`);
      for (const record of localManifest.files || []) {
        const file = path.join(bundlesDir, record.path);
        if (!fs.existsSync(file)) {
          problems.push(`${bundle.batch_id}: missing recorded file ${record.path}`);
          continue;
        }
        const actual = sha256(file);
        if (actual.bytes !== record.bytes || actual.sha256 !== record.sha256) {
          problems.push(`${bundle.batch_id}: digest mismatch ${record.path}`);
        }
      }
    }
    if (bundle.zip) {
      const zipPath = path.join(pkgDir, bundle.zip);
      if (!fs.existsSync(zipPath)) {
        problems.push(`${bundle.batch_id}: missing zip ${bundle.zip}`);
      } else {
        const actual = sha256(zipPath);
        if (bundle.zip_digest?.bytes !== actual.bytes || bundle.zip_digest?.sha256 !== actual.sha256) {
          problems.push(`${bundle.batch_id}: zip digest mismatch`);
        }
        const list = cp.spawnSync("/usr/bin/unzip", ["-l", zipPath], { encoding: "utf8" });
        if (list.status !== 0) {
          problems.push(`${bundle.batch_id}: unzip listing failed`);
        } else {
          for (const required of bundleRequiredFiles) {
            if (!list.stdout.includes(required)) problems.push(`${bundle.batch_id}: zip missing ${required}`);
          }
        }
        const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_provider_zip."));
        try {
          const unzip = cp.spawnSync("/usr/bin/unzip", ["-q", zipPath, "-d", tmpRoot], { encoding: "utf8" });
          if (unzip.status !== 0) {
            problems.push(`${bundle.batch_id}: unzip extract failed ${unzip.stderr || unzip.stdout || unzip.status}`);
          } else {
            zip_contents_checked += 1;
            checkBundleLocalReferences(tmpRoot, bundle.batch_id, "zip", batchRows, problems, stats);
          }
        } finally {
          fs.rmSync(tmpRoot, { recursive: true, force: true });
        }
      }
    } else {
      problems.push(`${bundle.batch_id}: missing zip path in manifest`);
    }
  }
  if (rows !== 42) problems.push(`stitched rows=${rows}, expected 42`);
  if (seenCustomIds.size !== 42) problems.push(`unique custom_ids=${seenCustomIds.size}, expected 42`);

  const result = {
    date: "2026-08-01",
    decision: problems.length ? "provider_upload_bundles_blocked" : "provider_upload_bundles_ready",
    bundles_checked: (manifest.bundles || []).length,
    rows_checked: rows,
    unique_custom_ids: seenCustomIds.size,
    zip_contents_checked,
    expected_download_rows_checked: stats.expected_download_rows_checked,
    manifest_digest_records_checked: stats.manifest_digest_records_checked,
    prompt_contract_files_checked: stats.prompt_contract_files_checked,
    negative_prompt_files_checked: stats.negative_prompt_files_checked,
    executable_negative_semantics_files_checked: stats.negative_prompt_files_checked,
    problems,
    manifest: path.relative(root, manifestPath),
  };
  writeJson(outPath, result);
  writeJson(packageOutJson, result);
  writeText(packageOutMd, [
    "# Scene09 V3 Provider Upload Bundles Audit",
    "",
    `Date: ${result.date}`,
    `Decision: ${result.decision}`,
    `Bundles checked: ${result.bundles_checked}`,
    `Rows checked: ${result.rows_checked}`,
    `Zip contents checked: ${result.zip_contents_checked}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n"));
  console.log(JSON.stringify(result, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
