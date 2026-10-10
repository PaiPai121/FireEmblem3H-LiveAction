#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const outRel = `${pkgRel}/clip_return_intake`;
const outDir = path.join(root, outRel);
const packageManifestPath = path.join(pkgDir, "package_manifest.json");
const batchManifestPath = path.join(pkgDir, "model_submission_batches/batch_manifest.json");
const expectedDownloadsPath = path.join(pkgDir, "model_submission_batches/expected_downloads.csv");
const runbookPath = path.join(pkgDir, "RUNBOOK.md");

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

function fullLedgerContractLines() {
  return [
    "- Returned clips are visually checked against the full post-shot ledger fields for their own row and for downstream no-return continuity.",
    "- Required ledger fields per returned clip: Alive / Safe After; Active / Controlling After; Limited But Not Defeated After; Defeated / Removed After; Captured / Objective-Defeated After; Stood Down / Post-Battle After; Must Not Return Active; Changed This Shot; No-Active-Combat Line.",
    "- Four critical locks must remain unbroken: Shot032F Hubert captured by Felix/Ashe; Shot032G Dorothea and Bernadetta captured by Leonie/Claude; Shot034B empty faculty objective with only Byleth/Dimitri readable and Hanneman/Manuela absent/offscreen/silent/unpaired; Shot034G exhausted Dimitri/Dedue core victory.",
    "- Any returned clip that contradicts these ledger fields or critical locks goes to `clip_revision_queue.csv`; it cannot be marked `motion_review_passed`.",
  ];
}

function expectedDownloadsByCustomId() {
  const rows = csvRows(readText(expectedDownloadsPath));
  const header = rows[0] || [];
  const out = new Map();
  for (const row of rows.slice(1)) {
    const object = Object.fromEntries(header.map((key, index) => [key, row[index] || ""]));
    out.set(object.custom_id, object);
  }
  return out;
}

function updateRunbook() {
  const runbook = readText(runbookPath);
  const section = [
    "## Clip Return Intake",
    "",
    "- Provider-returned clips should land under `clip_return_intake/batch_###_shots_###-###_returns/returned_mp4/`.",
    "- Each batch return folder contains `expected_downloads_subset.csv`, `expected_clip_map_subset.csv`, and a README with dry-run/apply ingest commands.",
    "- For all returned batches at once, run `node scripts/resume_scene09_v3_after_clip_return.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake` first, then add `--apply-ingest` only if the dry-run is clean.",
    "- Before copying clips into final expected paths, run `node scripts/ingest_scene09_v3_generated_clips.js --input <returned_mp4_dir> --dry-run`.",
    "- The ingest tool accepts exact expected filenames and `custom_id` prefixes by default; bare shot-name files such as `Shot034B.mp4` are treated as too weak and stay unmatched.",
    "- Candidate `.mp4` files must pass `ffprobe` before they can match or copy; a correct filename with a corrupt/non-video container remains blocked.",
    "- Return format is `.mp4` only; `.mov`, `.m4v`, `.webm`, image files, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.",
    "- Provider-ingest provenance must record both the original returned source file digest (`source_bytes` / `source_sha256`) and the copied expected-clip digest (`bytes` / `sha256`).",
    "- `clip_provenance_gate` rejects provider-ingest provenance that lacks the original source digest, lacks a passing `source_video_probe`, or no longer matches the current expected clip SHA-256.",
    "- Apply only after the dry-run shows unique matches and no ambiguous files.",
    "- After clips are applied, the dry-run must extract start/mid/end review frames and refresh `motion_self_audit/decision_update_template.jsonl`; Codex motion-review rows must preserve the current `clip_signature` and `review_evidence.review_frame_signatures.start/mid/end` before `motion_self_audit_apply_gate` can pass.",
    ...fullLedgerContractLines(),
    "",
  ].join("\n");
  const next = runbook.includes("## Clip Return Intake")
    ? runbook.replace(/## Clip Return Intake\n[\s\S]*?(?=\n## )/, section.trimEnd())
    : runbook.replace("\n## Provider Upload Bundles\n", `\n${section}\n## Provider Upload Bundles\n`);
  writeText(runbookPath, next);
}

function main() {
  const packageManifest = readJson(packageManifestPath);
  const batchManifest = readJson(batchManifestPath);
  const downloads = expectedDownloadsByCustomId();
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const mapHeader = [
    "custom_id",
    "order",
    "shot",
    "expected_filename",
    "expected_clip",
    "batch_return_dir",
    "returned_mp4_dir",
    "dry_run_command",
    "apply_command",
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
  const allRows = [];
  const batches = [];

  for (const batch of batchManifest.batches || []) {
    const returnDirName = `${batch.batch_id}_returns`;
    const returnDir = path.join(outDir, returnDirName);
    const mp4Dir = path.join(returnDir, "returned_mp4");
    fs.mkdirSync(mp4Dir, { recursive: true });
    writeText(path.join(mp4Dir, ".keep"), "Drop provider-returned mp4 files for this batch here.\n");

    const subsetRows = [];
    const mapRows = [];
    for (const customId of batch.custom_ids || []) {
      const download = downloads.get(customId);
      if (!download) throw new Error(`Missing expected download row for ${customId}`);
      const shot = (packageManifest.shots || []).find((item) => `${String(item.order).padStart(3, "0")}_${item.shot}` === customId);
      const dryRun = `node scripts/ingest_scene09_v3_generated_clips.js --input ${outRel}/${returnDirName}/returned_mp4 --dry-run`;
      const apply = `node scripts/ingest_scene09_v3_generated_clips.js --input ${outRel}/${returnDirName}/returned_mp4 --apply`;
      subsetRows.push([
        download.custom_id,
        download.shot,
        download.expected_filename,
        download.expected_clip,
        download.absolute_expected_clip,
        download.ingest_match_keys,
        "",
        "",
      ]);
      mapRows.push([
        customId,
        shot?.order || "",
        download.shot,
        download.expected_filename,
        download.expected_clip,
        `clip_return_intake/${returnDirName}`,
        `clip_return_intake/${returnDirName}/returned_mp4`,
        dryRun,
        apply,
        ledgerValue(shot, "alive_safe_after"),
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
    const expectedHeader = ["custom_id", "shot", "expected_filename", "expected_clip", "absolute_expected_clip", "ingest_match_keys", "clip_received", "operator_notes"];
    writeText(path.join(returnDir, "expected_downloads_subset.csv"), csvText(expectedHeader, subsetRows));
    writeText(path.join(returnDir, "expected_clip_map_subset.csv"), csvText(mapHeader, mapRows));
    writeText(path.join(returnDir, "README.md"), [
      `# ${batch.batch_id} Clip Return Intake`,
      "",
      "Place returned mp4 files from the provider into `returned_mp4/`.",
      "",
      "Use exact expected filenames from `expected_downloads_subset.csv` or filenames beginning with the listed `custom_id`. Bare shot-name files such as `Shot034B.mp4` are intentionally rejected by default because they can be stale or from the wrong package.",
      "",
      "Every candidate `.mp4` must pass `ffprobe` as a real video container with a video stream and positive duration. A correct filename alone is not enough.",
      "",
      "Return format is `.mp4` only. `.mov`, `.m4v`, `.webm`, image files, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.",
      "",
      "Provider-ingest provenance records both the original returned source file digest (`source_bytes` / `source_sha256`) and the copied expected-clip digest (`bytes` / `sha256`). `clip_provenance_gate` rejects missing source digests, missing passing `source_video_probe`, and copied outputs whose current SHA-256 no longer matches provenance.",
      "",
      "Run dry-run first:",
      "",
      "```bash",
      `node scripts/ingest_scene09_v3_generated_clips.js --input ${outRel}/${returnDirName}/returned_mp4 --dry-run`,
      "```",
      "",
      "If every file maps uniquely and no target overwrite is blocked, apply:",
      "",
      "```bash",
      `node scripts/ingest_scene09_v3_generated_clips.js --input ${outRel}/${returnDirName}/returned_mp4 --apply`,
      "node scripts/run_scene09_v3_video_pipeline.js --dry-run",
      "```",
      "",
      "The dry-run extracts start/mid/end review frames and rebuilds `motion_self_audit/decision_update_template.jsonl`. Codex self-audit must inspect the full clip and these extracted frames, then preserve the current `clip_signature` and `review_evidence.review_frame_signatures.start/mid/end`; rows that only flip review booleans without matching frame signatures are rejected by `motion_self_audit_apply_gate`.",
      "",
      "Full post-shot ledger return QA:",
      "",
      ...fullLedgerContractLines(),
      "",
      "Do not rename clips after ingest; use the expected filenames listed in `expected_downloads_subset.csv` when downloading from the provider.",
      "",
    ].join("\n"));
    allRows.push(...mapRows);
    batches.push({
      batch_id: batch.batch_id,
      return_dir: `clip_return_intake/${returnDirName}`,
      returned_mp4_dir: `clip_return_intake/${returnDirName}/returned_mp4`,
      expected_downloads_subset: `clip_return_intake/${returnDirName}/expected_downloads_subset.csv`,
      expected_clip_map_subset: `clip_return_intake/${returnDirName}/expected_clip_map_subset.csv`,
      rows: mapRows.length,
      custom_ids: batch.custom_ids || [],
    });
  }

  writeText(path.join(outDir, "expected_clip_map.csv"), csvText(mapHeader, allRows));
  writeText(path.join(outDir, "README.md"), [
    "# Scene09 V3 Clip Return Intake",
    "",
    "This folder is the receiving area for real provider-generated mp4 clips.",
    "",
    "Use one batch return directory at a time. Put provider downloads in that batch's `returned_mp4/` directory, run the listed dry-run command, then apply only if matching is unique.",
    "",
    "Strict filename rule: use exact expected filenames or filenames beginning with the listed `custom_id`. Bare shot-name files are not accepted by default, so older files like `Shot034B.mp4` or `Shot042.mp4` cannot be mistaken for current package outputs.",
    "",
    "Validity rule: the ingest dry-run probes every candidate `.mp4` with `ffprobe`; corrupt files, text placeholders, zero-duration containers, or non-video files are blocked before matching or copying.",
    "",
    "Format rule: returned clips must be `.mp4`. `.mov`, `.m4v`, `.webm`, image files, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.",
    "",
    "Provenance rule: provider ingest records both the original returned source file digest (`source_bytes` / `source_sha256`) and the copied expected-clip digest (`bytes` / `sha256`). `clip_provenance_gate` rejects missing source digests, missing passing `source_video_probe`, and copied outputs whose current SHA-256 no longer matches provenance.",
    "",
    "After applying any clips, run:",
    "",
    "```bash",
    "node scripts/run_scene09_v3_video_pipeline.js --dry-run",
    "```",
    "",
    "That dry-run extracts start/mid/end review frames and refreshes `motion_self_audit/decision_update_template.jsonl`. Before any motion row can be applied, Codex must inspect the full clip plus the extracted frames, keep the current `clip_signature`, and keep `review_evidence.review_frame_signatures.start/mid/end` bound to the exact frame paths, file sizes, mtimes, and SHA-256 hashes. The apply gate rejects stale frame evidence or rows that only set review booleans.",
    "",
    "Full post-shot ledger return QA:",
    "",
    ...fullLedgerContractLines(),
    "",
    "Proxy animatic clips must never be placed here and never count as generated model outputs.",
    "",
    "Whole-package recursive resume:",
    "",
    "```bash",
    "node scripts/resume_scene09_v3_after_clip_return.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake",
    "node scripts/resume_scene09_v3_after_clip_return.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake --apply-ingest",
    "```",
    "",
    "Use this only after all returned batch folders have been populated, or the dry-run will correctly report missing sources for unreturned shots.",
    "",
  ].join("\n"));

  const packageManifestNext = readJson(packageManifestPath);
  packageManifestNext.clip_return_intake = "clip_return_intake/clip_return_intake_manifest.json";
  packageManifestNext.clip_return_intake_dir = "clip_return_intake";
  writeJson(packageManifestPath, packageManifestNext);

  const manifest = {
    version: 1,
    date: new Date().toISOString().slice(0, 10),
    package_id: packageManifest.package_id,
    status: "awaiting_provider_downloads",
    source_files: {
      package_manifest: { path: rel(packageManifestPath), ...sha256(packageManifestPath) },
      batch_manifest: { path: rel(batchManifestPath), ...sha256(batchManifestPath) },
      expected_downloads: { path: rel(expectedDownloadsPath), ...sha256(expectedDownloadsPath) },
    },
    total_batches: batches.length,
    total_expected_clips: allRows.length,
    expected_clip_map: "clip_return_intake/expected_clip_map.csv",
    batches,
    commands: {
      audit_intake: "node scripts/audit_scene09_v3_clip_return_intake.js",
      dry_run_pipeline_after_ingest: "node scripts/run_scene09_v3_video_pipeline.js --dry-run",
    },
  };
  writeJson(path.join(outDir, "clip_return_intake_manifest.json"), manifest);
  updateRunbook();

  const files = [
    path.join(outDir, "README.md"),
    path.join(outDir, "expected_clip_map.csv"),
    path.join(outDir, "clip_return_intake_manifest.json"),
  ];
  console.log(JSON.stringify({
    ok: true,
    decision: "clip_return_intake_ready",
    directory: outRel,
    batches: batches.length,
    expected_clips: allRows.length,
    files: files.map((file) => ({ path: rel(file), ...sha256(file) })),
  }, null, 2));
}

main();
