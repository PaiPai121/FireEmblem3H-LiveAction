#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const intakeDir = path.join(pkgDir, "clip_return_intake");
const manifestPath = path.join(intakeDir, "clip_return_intake_manifest.json");
const packageManifestPath = path.join(pkgDir, "package_manifest.json");
const batchManifestPath = path.join(pkgDir, "model_submission_batches/batch_manifest.json");
const expectedDownloadsPath = path.join(pkgDir, "model_submission_batches/expected_downloads.csv");
const outPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_return_intake_audit_2026-08-01.json");
const packageOutJson = path.join(pkgDir, "clip_return_intake_audit.json");
const packageOutMd = path.join(pkgDir, "clip_return_intake_audit.md");

const ledgerColumns = [
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

const ledgerReadmePhrases = [
  "Full post-shot ledger return QA",
  "Alive / Safe After",
  "Active / Controlling After",
  "Limited But Not Defeated After",
  "Defeated / Removed After",
  "Captured / Objective-Defeated After",
  "Stood Down / Post-Battle After",
  "Must Not Return Active",
  "Changed This Shot",
  "No-Active-Combat Line",
  "Shot032F Hubert captured by Felix/Ashe",
  "Shot032G Dorothea and Bernadetta captured by Leonie/Claude",
  "Shot034B empty faculty objective with only Byleth/Dimitri readable and Hanneman/Manuela absent/offscreen/silent/unpaired",
  "Shot034G exhausted Dimitri/Dedue core victory",
  "clip_revision_queue.csv",
  "motion_review_passed",
  "source_bytes",
  "source_sha256",
  "copied expected-clip digest",
  "clip_provenance_gate",
  "source_video_probe",
];

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

function sha256(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: require("crypto").createHash("sha256").update(buffer).digest("hex"),
  };
}

function rel(file) {
  return path.relative(root, file);
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

function ledgerValue(row, key) {
  if (row?.[key]) return row[key];
  const ledger = row?.battle_ledger_after || {};
  const fallbacks = {
    alive_safe_after: groupText(ledger.alive_by_house),
    active_or_objective_after: groupText(ledger.active_by_house || ledger.still_active_or_controlling_objective_by_house),
    limited_after: groupText(ledger.limited_by_house || ledger.limited_but_not_defeated_by_house),
    defeated_removed_after: groupText(ledger.defeated_removed_by_house || ledger.mock_battle_defeated_or_removed_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_objective_defeated_by_house || ledger.captured_or_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_post_battle_by_house || ledger.stood_down_or_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: ledger.no_active_combat_line || (Array.isArray(row?.no_active_combat_after) && row.no_active_combat_after.length ? row.no_active_combat_after.join(", ") : "none"),
  };
  return fallbacks[key] || "none";
}

function checkLedgerReadme(text, label, problems) {
  for (const phrase of ledgerReadmePhrases) {
    if (!text.includes(phrase)) problems.push(`${label} missing ledger return QA phrase ${phrase}`);
  }
}

function main() {
  const problems = [];
  if (!fs.existsSync(manifestPath)) problems.push(`missing ${path.relative(root, manifestPath)}`);
  const manifest = fs.existsSync(manifestPath) ? readJson(manifestPath) : { batches: [] };
  const packageManifest = fs.existsSync(packageManifestPath) ? readJson(packageManifestPath) : { shots: [] };
  const batchManifest = fs.existsSync(batchManifestPath) ? readJson(batchManifestPath) : { batches: [] };
  const currentSourceFiles = {
    package_manifest: fs.existsSync(packageManifestPath) ? { path: rel(packageManifestPath), ...sha256(packageManifestPath) } : null,
    batch_manifest: fs.existsSync(batchManifestPath) ? { path: rel(batchManifestPath), ...sha256(batchManifestPath) } : null,
    expected_downloads: fs.existsSync(expectedDownloadsPath) ? { path: rel(expectedDownloadsPath), ...sha256(expectedDownloadsPath) } : null,
  };
  for (const [key, current] of Object.entries(currentSourceFiles)) {
    const recorded = manifest.source_files?.[key];
    if (!current) {
      problems.push(`missing source file for ${key}`);
    } else if (!recorded) {
      problems.push(`manifest missing source_files.${key}`);
    } else {
      for (const field of ["path", "bytes", "sha256"]) {
        if (String(recorded[field] ?? "") !== String(current[field] ?? "")) {
          problems.push(`source_files.${key}.${field} ${recorded[field] ?? "missing"} does not match current ${current[field] ?? "missing"}`);
        }
      }
    }
  }
  if (manifest.total_batches !== 7) problems.push(`total_batches=${manifest.total_batches}, expected 7`);
  if (manifest.total_expected_clips !== 42) problems.push(`total_expected_clips=${manifest.total_expected_clips}, expected 42`);
  if ((manifest.batches || []).length !== 7) problems.push(`batches length=${(manifest.batches || []).length}, expected 7`);
  if ((packageManifest.shots || []).length !== 42) problems.push(`package manifest shots=${(packageManifest.shots || []).length}, expected 42`);

  const mapPath = path.join(pkgDir, manifest.expected_clip_map || "");
  const mapRows = [];
  if (!fs.existsSync(mapPath)) {
    problems.push(`missing expected clip map ${manifest.expected_clip_map}`);
  } else {
    const rows = csvRows(readText(mapPath));
    if (rows.length !== 43) problems.push(`expected_clip_map rows including header=${rows.length}, expected 43`);
    const header = rows[0] || [];
    for (const column of ledgerColumns) {
      if (!header.includes(column)) problems.push(`expected_clip_map missing ${column}`);
    }
    for (const row of rows.slice(1)) {
      mapRows.push(Object.fromEntries(header.map((key, index) => [key, row[index] || ""])));
    }
  }
  const mapByCustomId = new Map(mapRows.map((row) => [row.custom_id, row]));
  const packageByOrder = new Map((packageManifest.shots || []).map((shot) => [String(shot.order), shot]));
  for (const row of mapRows) {
    const shot = packageByOrder.get(String(row.order));
    if (!shot) {
      problems.push(`expected_clip_map custom_id ${row.custom_id}: no package shot order ${row.order}`);
    } else {
      if (row.shot !== shot.shot) problems.push(`expected_clip_map order ${row.order}: shot ${row.shot} does not match package ${shot.shot}`);
      if (row.expected_clip !== shot.expected_clip) problems.push(`expected_clip_map order ${row.order}: expected_clip ${row.expected_clip} does not match package ${shot.expected_clip}`);
      if (row.expected_filename !== path.basename(shot.expected_clip || "")) {
        problems.push(`expected_clip_map order ${row.order}: expected_filename ${row.expected_filename} does not match expected_clip basename ${path.basename(shot.expected_clip || "")}`);
      }
      for (const column of ledgerColumns) {
        const expected = ledgerValue(shot, column);
        if (row[column] !== expected) problems.push(`expected_clip_map order ${row.order}: ${column} ${row[column] || "missing"} does not match package ${expected}`);
      }
    }
  }

  let expectedClipRows = 0;
  const seen = new Set();
  for (const batch of manifest.batches || []) {
    const sourceBatch = (batchManifest.batches || []).find((item) => item.batch_id === batch.batch_id);
    if (!sourceBatch) {
      problems.push(`${batch.batch_id}: missing matching model submission batch`);
    } else if (JSON.stringify(sourceBatch.custom_ids || []) !== JSON.stringify(batch.custom_ids || [])) {
      problems.push(`${batch.batch_id}: custom_ids do not match model submission batch order`);
    }
    const returnDir = path.join(pkgDir, batch.return_dir || "");
    const mp4Dir = path.join(pkgDir, batch.returned_mp4_dir || "");
    if (!fs.existsSync(returnDir)) problems.push(`${batch.batch_id}: missing return_dir`);
    if (!fs.existsSync(mp4Dir)) problems.push(`${batch.batch_id}: missing returned_mp4_dir`);
    for (const file of ["README.md", "expected_downloads_subset.csv", "expected_clip_map_subset.csv"]) {
      const full = path.join(returnDir, file);
      if (!fs.existsSync(full)) problems.push(`${batch.batch_id}: missing ${file}`);
    }
    const keep = path.join(mp4Dir, ".keep");
    if (!fs.existsSync(keep)) problems.push(`${batch.batch_id}: missing returned_mp4/.keep`);
    const subsetPath = path.join(returnDir, "expected_clip_map_subset.csv");
    if (fs.existsSync(subsetPath)) {
      const rows = csvRows(readText(subsetPath));
      if (rows.length !== 7) problems.push(`${batch.batch_id}: subset rows including header=${rows.length}, expected 7`);
      const header = rows[0] || [];
      const customIdIndex = header.indexOf("custom_id");
      const expectedClipIndex = header.indexOf("expected_clip");
      const expectedFilenameIndex = header.indexOf("expected_filename");
      for (const column of ledgerColumns) {
        if (!header.includes(column)) problems.push(`${batch.batch_id}: expected_clip_map_subset missing ${column}`);
      }
      const subsetCustomIds = [];
      for (const row of rows.slice(1)) {
        expectedClipRows += 1;
        const customId = row[customIdIndex];
        subsetCustomIds.push(customId);
        if (seen.has(customId)) problems.push(`${batch.batch_id}: duplicate custom_id ${customId}`);
        seen.add(customId);
        const mapRow = mapByCustomId.get(customId);
        if (!mapRow) {
          problems.push(`${batch.batch_id}: subset custom_id ${customId} missing from whole-package expected_clip_map`);
        } else {
          if (row[expectedClipIndex] !== mapRow.expected_clip) {
            problems.push(`${batch.batch_id}: ${customId} expected_clip ${row[expectedClipIndex]} does not match whole map ${mapRow.expected_clip}`);
          }
          if (row[expectedFilenameIndex] !== mapRow.expected_filename) {
            problems.push(`${batch.batch_id}: ${customId} expected_filename ${row[expectedFilenameIndex]} does not match whole map ${mapRow.expected_filename}`);
          }
          for (const column of ledgerColumns) {
            const index = header.indexOf(column);
            if (row[index] !== mapRow[column]) {
              problems.push(`${batch.batch_id}: ${customId} ${column} ${row[index] || "missing"} does not match whole map ${mapRow[column] || "missing"}`);
            }
          }
        }
      }
      if (JSON.stringify(subsetCustomIds) !== JSON.stringify(batch.custom_ids || [])) {
        problems.push(`${batch.batch_id}: subset custom_id order does not match intake manifest`);
      }
    }
    const readmePath = path.join(returnDir, "README.md");
    if (fs.existsSync(readmePath)) {
      const text = readText(readmePath);
      if (!text.includes("--dry-run")) problems.push(`${batch.batch_id}: README missing dry-run command`);
      if (!text.includes("--apply")) problems.push(`${batch.batch_id}: README missing apply command`);
      if (!text.includes("run_scene09_v3_video_pipeline.js --dry-run")) problems.push(`${batch.batch_id}: README missing post-ingest pipeline command`);
      if (!text.includes("ffprobe")) problems.push(`${batch.batch_id}: README missing ffprobe validity rule`);
      if (!text.includes("Return format is `.mp4` only")) problems.push(`${batch.batch_id}: README missing mp4-only format rule`);
      checkLedgerReadme(text, `${batch.batch_id}: README`, problems);
    }
  }
  if (expectedClipRows !== 42) problems.push(`subset expected clip rows=${expectedClipRows}, expected 42`);
  if (seen.size !== 42) problems.push(`unique custom_ids=${seen.size}, expected 42`);
  const topReadme = path.join(intakeDir, "README.md");
  if (!fs.existsSync(topReadme)) {
    problems.push("missing top-level clip_return_intake/README.md");
  } else if (!readText(topReadme).includes("ffprobe")) {
    problems.push("top-level README missing ffprobe validity rule");
  } else if (!readText(topReadme).includes("Format rule: returned clips must be `.mp4`")) {
    problems.push("top-level README missing mp4-only format rule");
  } else if (!readText(topReadme).includes("resume_scene09_v3_after_clip_return.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake")) {
    problems.push("top-level README missing whole-package recursive resume command");
  }
  if (fs.existsSync(topReadme)) checkLedgerReadme(readText(topReadme), "top-level README", problems);

  const result = {
    date: "2026-08-01",
    decision: problems.length ? "clip_return_intake_blocked" : "clip_return_intake_ready",
    batches_checked: (manifest.batches || []).length,
    expected_clip_rows: expectedClipRows,
    unique_custom_ids: seen.size,
    source_files_checked: Object.keys(currentSourceFiles).length,
    problems,
    manifest: path.relative(root, manifestPath),
  };
  writeJson(outPath, result);
  writeJson(packageOutJson, result);
  writeText(packageOutMd, [
    "# Scene09 V3 Clip Return Intake Audit",
    "",
    `Date: ${result.date}`,
    `Decision: ${result.decision}`,
    `Batches checked: ${result.batches_checked}`,
    `Expected clip rows: ${result.expected_clip_rows}`,
    `Unique custom IDs: ${result.unique_custom_ids}`,
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
