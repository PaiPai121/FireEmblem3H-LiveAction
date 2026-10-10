#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const outRel = `${pkgRel}/motion_probe_return_intake`;
const outDir = path.join(root, outRel);
const packageManifestPath = path.join(pkgDir, "package_manifest.json");
const probeManifestPath = path.join(pkgDir, "motion_probe_submission/motion_probe_manifest.json");
const providerBundlesManifestPath = path.join(pkgDir, "motion_probe_provider_bundles/motion_probe_provider_bundles_manifest.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
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

function csvCell(value) {
  const text = String(value == null ? "" : value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function csvText(header, rows) {
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
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

function readExpectedProbeDownloads(bundleDir) {
  const file = path.join(bundleDir, "expected_probe_downloads.csv");
  const rows = csvRows(readText(file));
  const header = rows[0] || [];
  return rows.slice(1).map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] || ""])));
}

function main() {
  const packageManifest = readJson(packageManifestPath);
  const probeManifest = readJson(probeManifestPath);
  const providerManifest = readJson(providerBundlesManifestPath);
  const probeByCustomId = new Map((probeManifest.rows || []).map((row) => [row.custom_id, row]));
  const shotByShot = new Map((packageManifest.shots || []).map((shot) => [shot.shot, shot]));

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const mapHeader = [
    "custom_id",
    "order",
    "shot",
    "id",
    "expected_probe_filename",
    "expected_probe_clip",
    "parent_expected_clip",
    "batch_return_dir",
    "returned_mp4_dir",
    "dry_run_command",
    "apply_command",
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
  const allRows = [];
  const batches = [];

  for (const bundle of providerManifest.bundles || []) {
    const returnDirName = `${bundle.batch_id}_returns`;
    const returnDir = path.join(outDir, returnDirName);
    const mp4Dir = path.join(returnDir, "returned_mp4");
    fs.mkdirSync(mp4Dir, { recursive: true });
    writeText(path.join(mp4Dir, ".keep"), "Drop provider-returned 3-second motion probe mp4 files for this batch here.\n");
    const sourceBundleDir = path.join(pkgDir, bundle.directory);
    const downloads = readExpectedProbeDownloads(sourceBundleDir);
    const mapRows = [];
    for (const download of downloads) {
      const probe = probeByCustomId.get(download.custom_id);
      if (!probe) throw new Error(`Missing probe manifest row for ${download.custom_id}`);
      const shot = shotByShot.get(probe.shot) || {};
      const dryRun = `node scripts/ingest_scene09_v3_motion_probe_clips.js --input ${outRel}/${returnDirName}/returned_mp4 --dry-run`;
      const apply = `node scripts/ingest_scene09_v3_motion_probe_clips.js --input ${outRel}/${returnDirName}/returned_mp4 --apply`;
      mapRows.push([
        probe.custom_id,
        shot.order ?? probe.order,
        probe.shot,
        shot.id ?? probe.id,
        download.expected_probe_filename,
        download.expected_probe_clip,
        download.parent_expected_clip,
        `motion_probe_return_intake/${returnDirName}`,
        `motion_probe_return_intake/${returnDirName}/returned_mp4`,
        dryRun,
        apply,
        ledgerValue(shot, "alive_safe_after"),
        ledgerValue(shot, "visible_but_no_active_combat_after"),
        ledgerValue(shot, "active_or_objective_after"),
        ledgerValue(shot, "limited_after"),
        ledgerValue(shot, "defeated_removed_after"),
        ledgerValue(shot, "captured_objective_defeated_after"),
        ledgerValue(shot, "stood_down_post_battle_after"),
        ledgerValue(shot, "must_not_return_active_after"),
        ledgerValue(shot, "changed_this_shot"),
        ledgerValue(shot, "no_active_combat_line"),
      ]);
    }
    writeText(path.join(returnDir, "expected_probe_downloads_subset.csv"), csvText(["custom_id", "shot", "expected_probe_filename", "expected_probe_clip", "parent_expected_clip"], downloads.map((row) => [
      row.custom_id,
      row.shot,
      row.expected_probe_filename,
      row.expected_probe_clip,
      row.parent_expected_clip,
    ])));
    writeText(path.join(returnDir, "expected_probe_map_subset.csv"), csvText(mapHeader, mapRows));
    writeText(path.join(returnDir, "README.md"), [
      `# ${bundle.batch_id} Motion Probe Return Intake`,
      "",
      "Place provider-returned 3-second motion probe `.mp4` files into `returned_mp4/`.",
      "",
      "Strict filename rule: use exact `expected_probe_filename` values or filenames beginning with the listed `custom_id`. Bare shot names and full-duration clip names are rejected.",
      "",
      "Probe-only rule: every accepted filename must resolve to `_probe.mp4`; full-duration generation remains blocked until these returned probes pass Codex motion QA.",
      "",
      "Full-duration generation remains blocked until returned motion probes pass Codex motion QA.",
      "",
      "Validity rule: the ingest dry-run probes every candidate `.mp4` with `ffprobe`; corrupt files, text placeholders, zero-duration containers, and non-video files are blocked before matching or copying.",
      "",
      "Return format is `.mp4` only. `.mov`, `.m4v`, `.webm`, images, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.",
      "",
      "Run dry-run first:",
      "",
      "```bash",
      `node scripts/ingest_scene09_v3_motion_probe_clips.js --input ${outRel}/${returnDirName}/returned_mp4 --dry-run`,
      "```",
      "",
      "Apply only after every returned probe maps uniquely:",
      "",
      "```bash",
      `node scripts/ingest_scene09_v3_motion_probe_clips.js --input ${outRel}/${returnDirName}/returned_mp4 --apply`,
      "```",
      "",
      "Probe QA must check identity, wardrobe, training weapons, no extra readable people, no subtitles/captions/visible text, teacher separation, and post-shot ledger continuity before any full-duration clip request is released.",
      "",
    ].join("\n"));
    allRows.push(...mapRows);
    batches.push({
      batch_id: bundle.batch_id,
      source_bundle_dir: bundle.directory,
      source_bundle_zip: bundle.zip,
      return_dir: `motion_probe_return_intake/${returnDirName}`,
      returned_mp4_dir: `motion_probe_return_intake/${returnDirName}/returned_mp4`,
      expected_probe_downloads_subset: `motion_probe_return_intake/${returnDirName}/expected_probe_downloads_subset.csv`,
      expected_probe_map_subset: `motion_probe_return_intake/${returnDirName}/expected_probe_map_subset.csv`,
      rows: mapRows.length,
      custom_ids: bundle.custom_ids || [],
    });
  }

  writeText(path.join(outDir, "expected_probe_map.csv"), csvText(mapHeader, allRows));
  writeText(path.join(outDir, "README.md"), [
    "# Scene09 V3 Motion Probe Return Intake",
    "",
    "This folder receives real provider-generated 3-second motion probe mp4 clips before full-duration generation is allowed.",
    "",
    "Use one probe batch return directory at a time. Put provider downloads in that batch's `returned_mp4/` directory, run dry-run, then apply only if matching is unique.",
    "",
    "Strict filename rule: use exact `expected_probe_filename` values or filenames beginning with the listed `custom_id`. Bare shot names and full-duration clip names are rejected.",
    "",
    "Probe-only rule: accepted files must be `_probe.mp4` returns and copy only to `episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/`.",
    "",
    "Validity rule: the ingest dry-run probes every candidate `.mp4` with `ffprobe`; corrupt files, text placeholders, zero-duration containers, and non-video files are blocked before matching or copying.",
    "",
    "Return format is `.mp4` only. `.mov`, `.m4v`, `.webm`, images, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.",
    "",
    "Full-duration generation remains blocked until returned probes pass Codex motion QA for identity, wardrobe, training weapons, no extra readable people, no subtitles/captions/visible text, teacher separation, and post-shot ledger continuity.",
    "",
    "Batch dry-run example:",
    "",
    "```bash",
    "node scripts/ingest_scene09_v3_motion_probe_clips.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_return_intake/probe_batch_001_shots_001-006_returns/returned_mp4 --dry-run",
    "```",
    "",
  ].join("\n"));

  const packageManifestNext = readJson(packageManifestPath);
  packageManifestNext.motion_probe_return_intake = "motion_probe_return_intake/motion_probe_return_intake_manifest.json";
  packageManifestNext.motion_probe_return_intake_dir = "motion_probe_return_intake";
  writeJson(packageManifestPath, packageManifestNext);

  const manifest = {
    version: 1,
    date: "2026-08-01",
    package_id: packageManifest.package_id,
    status: "awaiting_motion_probe_downloads",
    source_files: {
      package_manifest: { path: rel(packageManifestPath), ...sha256(packageManifestPath) },
      motion_probe_manifest: { path: rel(probeManifestPath), ...sha256(probeManifestPath) },
      motion_probe_provider_bundles_manifest: { path: rel(providerBundlesManifestPath), ...sha256(providerBundlesManifestPath) },
    },
    total_batches: batches.length,
    total_expected_probes: allRows.length,
    expected_probe_map: "motion_probe_return_intake/expected_probe_map.csv",
    batches,
    commands: {
      audit_intake: "node scripts/audit_scene09_v3_motion_probe_return_intake.js",
      ingest_dry_run: "node scripts/ingest_scene09_v3_motion_probe_clips.js --input <returned_mp4_dir> --dry-run",
      ingest_apply: "node scripts/ingest_scene09_v3_motion_probe_clips.js --input <returned_mp4_dir> --apply",
    },
  };
  writeJson(path.join(outDir, "motion_probe_return_intake_manifest.json"), manifest);

  console.log(JSON.stringify({
    ok: true,
    decision: "motion_probe_return_intake_ready",
    directory: outRel,
    batches: batches.length,
    expected_probes: allRows.length,
    manifest: rel(path.join(outDir, "motion_probe_return_intake_manifest.json")),
  }, null, 2));
}

main();
