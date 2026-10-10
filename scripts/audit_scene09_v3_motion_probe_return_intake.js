#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const intakeDir = path.join(pkgDir, "motion_probe_return_intake");
const manifestPath = path.join(intakeDir, "motion_probe_return_intake_manifest.json");
const packageManifestPath = path.join(pkgDir, "package_manifest.json");
const probeManifestPath = path.join(pkgDir, "motion_probe_submission/motion_probe_manifest.json");
const providerBundlesManifestPath = path.join(pkgDir, "motion_probe_provider_bundles/motion_probe_provider_bundles_manifest.json");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(outDir, `scene09_v3_motion_probe_return_intake_audit_${date}.json`);
const outMd = path.join(outDir, `scene09_v3_motion_probe_return_intake_audit_${date}.md`);
const packageOutJson = path.join(pkgDir, "motion_probe_return_intake_audit.json");
const packageOutMd = path.join(pkgDir, "motion_probe_return_intake_audit.md");

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

const readmePhrases = [
  "3-second motion probe",
  "Strict filename rule",
  "Probe-only rule",
  "ffprobe",
  "Return format is `.mp4` only",
  "Full-duration generation remains blocked",
  "identity, wardrobe, training weapons, no extra readable people, no subtitles/captions/visible text, teacher separation, and post-shot ledger continuity",
];

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function rel(file) {
  return path.relative(root, file);
}

function sha256(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
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
  return rows.length ? rows.map((item) => `${item.name || item}:${item.status || item.label || "changed"}`).join("; ") : "none";
}

function ledgerValue(shot, key) {
  const state = shot?.battle_state_after || {};
  const ledger = state.battle_ledger_after || shot?.battle_ledger_after || {};
  const noActive = [
    ...(Array.isArray(state.inactive_or_removed_after) ? state.inactive_or_removed_after : []),
    ...(Array.isArray(state.no_active_combat_after) ? state.no_active_combat_after : []),
  ].filter((value, index, all) => value && all.indexOf(value) === index);
  const values = {
    alive_safe_after: groupText(ledger.alive_by_house),
    visible_but_no_active_combat_after: (() => {
      const active = new Set(Object.values(ledger.still_active_or_controlling_objective_by_house || ledger.active_by_house || {}).flatMap((names) => Array.isArray(names) ? names : []));
      const visible = Array.isArray(shot.visible_named_only) ? shot.visible_named_only : [];
      const inactiveVisible = visible.filter((name) => name && !active.has(name));
      return inactiveVisible.length ? inactiveVisible.join(", ") : "none";
    })(),
    active_or_objective_after: groupText(ledger.still_active_or_controlling_objective_by_house || ledger.active_by_house),
    limited_after: groupText(ledger.limited_but_not_defeated_by_house || ledger.limited_by_house),
    defeated_removed_after: groupText(ledger.mock_battle_defeated_or_removed_by_house || ledger.defeated_removed_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_or_objective_defeated_by_house || ledger.captured_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_or_post_battle_by_house || ledger.stood_down_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: noActive.join(", ") || "none",
  };
  return values[key] || "none";
}

function rowObjects(file) {
  const rows = csvRows(readText(file));
  const header = rows[0] || [];
  return {
    header,
    rows: rows.slice(1).map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] || ""]))),
  };
}

function checkSourceFile(report, key, file, problems) {
  const current = fs.existsSync(file) ? { path: rel(file), ...sha256(file) } : null;
  const recorded = report.source_files?.[key];
  if (!current) {
    problems.push(`missing source file ${key}`);
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

function main() {
  const problems = [];
  const warnings = [];
  const manifest = readJson(manifestPath, null);
  const packageManifest = readJson(packageManifestPath, { shots: [] });
  const probeManifest = readJson(probeManifestPath, { rows: [] });
  const providerManifest = readJson(providerBundlesManifestPath, { bundles: [] });
  const rows = [];

  if (!manifest) problems.push(`missing ${rel(manifestPath)}`);
  if (manifest) {
    checkSourceFile(manifest, "package_manifest", packageManifestPath, problems);
    checkSourceFile(manifest, "motion_probe_manifest", probeManifestPath, problems);
    checkSourceFile(manifest, "motion_probe_provider_bundles_manifest", providerBundlesManifestPath, problems);
  }
  if (manifest?.status !== "awaiting_motion_probe_downloads") problems.push(`status ${manifest?.status || "missing"} is not awaiting_motion_probe_downloads`);
  if (Number(manifest?.total_batches || 0) !== 7) problems.push(`total_batches ${manifest?.total_batches || 0} is not 7`);
  if (Number(manifest?.total_expected_probes || 0) !== 42) problems.push(`total_expected_probes ${manifest?.total_expected_probes || 0} is not 42`);
  if ((probeManifest.rows || []).length !== 42) problems.push(`motion probe manifest rows ${(probeManifest.rows || []).length} is not 42`);

  const packageByShot = new Map((packageManifest.shots || []).map((shot) => [shot.shot, shot]));
  const probeByCustomId = new Map((probeManifest.rows || []).map((row) => [row.custom_id, row]));
  const providerCustomIds = new Set((providerManifest.bundles || []).flatMap((bundle) => bundle.custom_ids || []));
  const wholeMapPath = path.join(pkgDir, manifest?.expected_probe_map || "");
  if (!fs.existsSync(wholeMapPath)) {
    problems.push(`missing expected probe map ${manifest?.expected_probe_map || "missing"}`);
  } else {
    const parsed = rowObjects(wholeMapPath);
    if (parsed.rows.length !== 42) problems.push(`expected_probe_map rows ${parsed.rows.length} is not 42`);
    for (const column of ["custom_id", "order", "shot", "id", "expected_probe_filename", "expected_probe_clip", "parent_expected_clip", ...ledgerColumns]) {
      if (!parsed.header.includes(column)) problems.push(`expected_probe_map missing ${column}`);
    }
    for (const row of parsed.rows) {
      const probe = probeByCustomId.get(row.custom_id);
      const shot = packageByShot.get(row.shot);
      if (!probe) problems.push(`expected_probe_map ${row.custom_id}: missing probe manifest row`);
      if (!providerCustomIds.has(row.custom_id)) problems.push(`expected_probe_map ${row.custom_id}: missing provider bundle custom_id`);
      if (!shot) {
        problems.push(`expected_probe_map ${row.custom_id}: missing package shot ${row.shot}`);
      } else {
        const expectedName = path.basename(probe?.expected_probe_clip || "");
        if (Number(row.order || 0) !== Number(shot.order || 0)) problems.push(`${row.custom_id}: order ${row.order} does not match package ${shot.order}`);
        if (row.id !== shot.id) problems.push(`${row.custom_id}: id ${row.id} does not match package ${shot.id}`);
        if (row.expected_probe_filename !== expectedName) problems.push(`${row.custom_id}: expected_probe_filename ${row.expected_probe_filename} does not match ${expectedName}`);
        if (row.expected_probe_clip !== probe?.expected_probe_clip) problems.push(`${row.custom_id}: expected_probe_clip mismatch`);
        if (row.parent_expected_clip !== shot.expected_clip) problems.push(`${row.custom_id}: parent_expected_clip ${row.parent_expected_clip} does not match ${shot.expected_clip}`);
        if (!row.expected_probe_clip.endsWith("_probe.mp4")) problems.push(`${row.custom_id}: expected_probe_clip is not _probe.mp4`);
        if (!row.expected_probe_clip.includes("/motion_probes/")) problems.push(`${row.custom_id}: expected_probe_clip is outside motion_probes`);
        for (const column of ledgerColumns) {
          const expected = ledgerValue(shot, column);
          if (row[column] !== expected) problems.push(`${row.custom_id}: ${column} ${row[column] || "missing"} does not match package ${expected}`);
        }
      }
      rows.push({
        order: Number(row.order || 0),
        shot: row.shot,
        id: row.id,
        expected_clip: row.parent_expected_clip,
        expected_probe_clip: row.expected_probe_clip,
        custom_id: row.custom_id,
      });
    }
  }

  const seen = new Set();
  let subsetRowsChecked = 0;
  for (const batch of manifest?.batches || []) {
    const providerBatch = (providerManifest.bundles || []).find((item) => item.batch_id === batch.batch_id);
    if (!providerBatch) {
      problems.push(`${batch.batch_id}: missing provider bundle`);
    } else if (JSON.stringify(providerBatch.custom_ids || []) !== JSON.stringify(batch.custom_ids || [])) {
      problems.push(`${batch.batch_id}: custom_ids do not match provider bundle order`);
    }
    const returnDir = path.join(pkgDir, batch.return_dir || "");
    const mp4Dir = path.join(pkgDir, batch.returned_mp4_dir || "");
    if (!fs.existsSync(returnDir)) problems.push(`${batch.batch_id}: missing return_dir`);
    if (!fs.existsSync(mp4Dir)) problems.push(`${batch.batch_id}: missing returned_mp4_dir`);
    for (const file of ["README.md", "expected_probe_downloads_subset.csv", "expected_probe_map_subset.csv"]) {
      if (!fs.existsSync(path.join(returnDir, file))) problems.push(`${batch.batch_id}: missing ${file}`);
    }
    if (!fs.existsSync(path.join(mp4Dir, ".keep"))) problems.push(`${batch.batch_id}: missing returned_mp4/.keep`);
    const readme = readText(path.join(returnDir, "README.md"));
    for (const phrase of readmePhrases) {
      if (!readme.includes(phrase)) problems.push(`${batch.batch_id}: README missing ${phrase}`);
    }
    const subsetPath = path.join(returnDir, "expected_probe_map_subset.csv");
    if (fs.existsSync(subsetPath)) {
      const parsed = rowObjects(subsetPath);
      if (parsed.rows.length !== Number(batch.rows || 0)) problems.push(`${batch.batch_id}: subset rows ${parsed.rows.length} does not match manifest ${batch.rows || 0}`);
      for (const column of ledgerColumns) {
        if (!parsed.header.includes(column)) problems.push(`${batch.batch_id}: subset missing ${column}`);
      }
      const ids = [];
      for (const row of parsed.rows) {
        subsetRowsChecked += 1;
        ids.push(row.custom_id);
        if (seen.has(row.custom_id)) problems.push(`${batch.batch_id}: duplicate custom_id ${row.custom_id}`);
        seen.add(row.custom_id);
        if (!String(row.expected_probe_clip || "").endsWith("_probe.mp4")) problems.push(`${batch.batch_id}/${row.custom_id}: not mapped to _probe.mp4`);
      }
      if (JSON.stringify(ids) !== JSON.stringify(batch.custom_ids || [])) problems.push(`${batch.batch_id}: subset custom_id order does not match manifest`);
    }
  }
  const topReadme = readText(path.join(intakeDir, "README.md"));
  for (const phrase of readmePhrases) {
    if (!topReadme.includes(phrase)) problems.push(`top README missing ${phrase}`);
  }
  if (subsetRowsChecked !== 42) problems.push(`subset rows checked ${subsetRowsChecked} is not 42`);
  if (seen.size !== 42) problems.push(`unique custom_ids ${seen.size} is not 42`);

  const decision = problems.length ? "motion_probe_return_intake_blocked" : "motion_probe_return_intake_ready";
  const report = {
    version: 1,
    date,
    decision,
    batches_checked: (manifest?.batches || []).length,
    expected_probe_rows: subsetRowsChecked,
    unique_custom_ids: seen.size,
    source_files_checked: 3,
    problems,
    warnings,
    rows,
    manifest: rel(manifestPath),
  };
  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  writeText(outMd, [
    "# Scene09 V3 Motion Probe Return Intake Audit",
    "",
    `Decision: ${decision}`,
    `Batches checked: ${report.batches_checked}`,
    `Expected probe rows: ${report.expected_probe_rows}`,
    `Unique custom IDs: ${report.unique_custom_ids}`,
    "",
    "## Problems",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n"));
  writeText(packageOutMd, readText(outMd));
  console.log(JSON.stringify({
    decision,
    batches_checked: report.batches_checked,
    expected_probe_rows: report.expected_probe_rows,
    unique_custom_ids: report.unique_custom_ids,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
