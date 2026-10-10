#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const outRel = `${pkgRel}/provider_upload_bundles`;
const outDir = path.join(root, outRel);
const packageManifestPath = path.join(pkgDir, "package_manifest.json");
const batchManifestPath = path.join(pkgDir, "model_submission_batches/batch_manifest.json");
const expectedDownloadsPath = path.join(pkgDir, "model_submission_batches/expected_downloads.csv");
const runbookPath = path.join(pkgDir, "RUNBOOK.md");

const requiredShotFiles = [
  "model_prompt.md",
  "negative_prompt.md",
  "prompt.md",
  "metadata.json",
  "start_frame.png",
  "key_frame.png",
  "end_frame.png",
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

function visibleButNoActiveText(row) {
  if (row.visible_but_no_active_combat_after) return row.visible_but_no_active_combat_after;
  const ledger = row.battle_ledger_after || {};
  const active = new Set(flattenGroups(ledger.active_by_house || ledger.still_active_or_controlling_objective_by_house));
  const inactiveVisible = (row.visible_named_only || []).filter((name) => name && !active.has(name));
  return inactiveVisible.length ? inactiveVisible.join(", ") : "none";
}

function ledgerValue(row, key) {
  if (key === "visible_but_no_active_combat_after") return visibleButNoActiveText(row);
  if (row[key]) return row[key];
  const ledger = row.battle_ledger_after || {};
  const fallbacks = {
    alive_safe_after: groupText(ledger.alive_by_house),
    active_or_objective_after: groupText(ledger.active_by_house),
    limited_after: groupText(ledger.limited_by_house),
    defeated_removed_after: groupText(ledger.defeated_removed_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: ledger.no_active_combat_line || "none",
  };
  return fallbacks[key] || "none";
}

function filterExpectedDownloads(customIds) {
  const rows = csvRows(readText(expectedDownloadsPath));
  const header = rows[0] || [];
  const customIdIndex = header.indexOf("custom_id");
  const keep = rows.slice(1).filter((row) => customIds.has(row[customIdIndex]));
  return [header, ...keep].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function shotDirForRow(row) {
  const promptFile = row.prompt_file || row.audit_prompt_file || row.input_frames?.start_frame || "";
  if (String(promptFile).includes("/shots/")) return `shots/${String(promptFile).split("/shots/").pop().replace(/\/[^/]+$/, "")}`;
  return String(promptFile).replace(/\/(model_prompt|prompt|negative_prompt|start_frame|key_frame|end_frame)\.(md|png|json)$/, "");
}

function bundleLocalRow(row) {
  const shotDir = shotDirForRow(row);
  const bundleFiles = {
    model_prompt: `${shotDir}/model_prompt.md`,
    audit_prompt: `${shotDir}/prompt.md`,
    negative_prompt: `${shotDir}/negative_prompt.md`,
    metadata: `${shotDir}/metadata.json`,
    start_frame: `${shotDir}/start_frame.png`,
    key_frame: `${shotDir}/key_frame.png`,
    end_frame: `${shotDir}/end_frame.png`,
  };
  return {
    ...row,
    prompt_file: `${shotDir}/model_prompt.md`,
    audit_prompt_file: `${shotDir}/prompt.md`,
    negative_prompt_file: `${shotDir}/negative_prompt.md`,
    input_frames: {
      start_frame: `${shotDir}/start_frame.png`,
      key_frame: `${shotDir}/key_frame.png`,
      end_frame: `${shotDir}/end_frame.png`,
    },
    absolute_files: bundleFiles,
    bundle_files: bundleFiles,
  };
}

function renderBundleJsonl(rows) {
  return rows.map((row) => JSON.stringify(row)).join("\n") + "\n";
}

function renderBundleCsv(rows) {
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
  const body = rows.map((row) => [
    row.custom_id,
    row.order,
    row.shot,
    row.duration_seconds,
    (row.visible_named_only || []).join("; "),
    ledgerValue(row, "visible_but_no_active_combat_after"),
    row.prompt_file,
    row.negative_prompt_file,
    row.input_frames?.start_frame || "",
    row.input_frames?.key_frame || "",
    row.input_frames?.end_frame || "",
    row.expected_clip || "",
    row.primary_check || "",
    ledgerValue(row, "alive_safe_after"),
    ledgerValue(row, "active_or_objective_after"),
    ledgerValue(row, "limited_after"),
    ledgerValue(row, "defeated_removed_after"),
    ledgerValue(row, "captured_objective_defeated_after"),
    ledgerValue(row, "stood_down_post_battle_after"),
    ledgerValue(row, "must_not_return_active_after"),
    ledgerValue(row, "changed_this_shot"),
    ledgerValue(row, "no_active_combat_line"),
  ]);
  return [fields, ...body].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function copyFile(sourceRel, targetRel, fileRecords) {
  const source = path.isAbsolute(sourceRel)
    ? sourceRel
    : String(sourceRel).startsWith(`${pkgRel}/`)
      ? path.join(root, sourceRel)
      : path.join(pkgDir, sourceRel);
  const target = path.join(outDir, targetRel);
  if (!fs.existsSync(source)) throw new Error(`Missing source file for provider bundle: ${rel(source)}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  fileRecords.push({ path: targetRel, ...sha256(target) });
}

function buildBatchChecklist(batch, rows) {
  return [
    `# ${batch.batch_id} Provider Upload Checklist`,
    "",
    "Use this folder as a self-contained full-duration image-to-video upload unit only after `full_duration_release_gate` passes.",
    "",
    "Current lock: full-duration generation is blocked until 42/42 returned motion probes pass signed Codex review and the production package contains `motion_probe_full_duration_release.json`.",
    "",
    "## Submit",
    "",
    "- Do not upload this full-duration batch while `full_duration_release_gate` is `full_duration_release_blocked_probe_review_pending`.",
    "- Use `batch.jsonl` for structured model/provider upload only after release.",
    "- Use `batch.csv` and this checklist for manual upload only after release.",
    "- Each row points to files under `shots/` inside this folder.",
    "- Generate one mp4 per row and name or map it using `expected_downloads_subset.csv`.",
    "",
    "## Hard Rules",
    "",
    "- Do not add anonymous readable students, spectators, soldiers, crowds, bystanders, or silhouettes.",
    "- Keep the visible named-only roster exactly as listed per shot.",
    "- Treat Visible But No Active Combat After as a hard staging lock: those readable people may only stand down, concede, lower weapons, or remain post-battle; they must not resume active combat.",
    "- Keep all defeated, captured, stood-down, or objective-defeated characters from returning to active combat.",
    "- Shot034B, if present: Byleth and Dimitri only; empty faculty objective markers; Hanneman/Manuela absent/offscreen/silent/unpaired.",
    "- Do not promote any returned clip until Codex motion QA passes.",
    "",
    "## Rows",
    "",
    ...rows.map((row) => [
      `### ${row.custom_id}`,
      "",
      `- Shot: ${row.shot}`,
      `- Duration: ${row.duration_seconds}s`,
      `- Visible named-only: ${(row.visible_named_only || []).join(", ") || "none"}`,
      `- Visible But No Active Combat After: ${ledgerValue(row, "visible_but_no_active_combat_after")}`,
      `- Model prompt: ${row.prompt_file}`,
      `- Negative prompt: ${row.negative_prompt_file}`,
      `- Frames: ${row.input_frames?.start_frame} | ${row.input_frames?.key_frame} | ${row.input_frames?.end_frame}`,
      `- Expected clip: ${row.expected_clip}`,
      `- Primary check: ${row.primary_check || ""}`,
      `- Alive / Safe After: ${ledgerValue(row, "alive_safe_after")}`,
      `- Active / Controlling After: ${ledgerValue(row, "active_or_objective_after")}`,
      `- Limited But Not Defeated After: ${ledgerValue(row, "limited_after")}`,
      `- Defeated / Removed After: ${ledgerValue(row, "defeated_removed_after")}`,
      `- Captured / Objective-Defeated After: ${ledgerValue(row, "captured_objective_defeated_after")}`,
      `- Stood Down / Post-Battle After: ${ledgerValue(row, "stood_down_post_battle_after")}`,
      `- Must Not Return Active: ${ledgerValue(row, "must_not_return_active_after")}`,
      `- Changed This Shot: ${ledgerValue(row, "changed_this_shot")}`,
      `- No-Active-Combat Line: ${ledgerValue(row, "no_active_combat_line")}`,
      "",
    ].join("\n")),
  ].join("\n");
}

function buildProviderReadme(manifestOut) {
  return [
    "# Scene09 V3 Provider Upload Bundles",
    "",
    "These folders and zip archives are the full-duration provider-facing handoff for EP02 Scene09 V3. They are structurally prepared but locked until `full_duration_release_gate` passes.",
    "",
    "## Status",
    "",
    `- Package status: ${manifestOut.status}.`,
    `- Batches: ${manifestOut.total_batches}.`,
    `- Shots: ${manifestOut.total_shots}.`,
    "- Generated clips included here: 0.",
    "- Final video included here: no.",
    "- Full-duration release gate: must be `full_duration_release_passed` before upload.",
    "",
    "## What To Upload",
    "",
    "- Do not upload these full-duration batches while `full_duration_release_gate` is blocked.",
    "- After release, upload one `batch_###_shots_###-###.zip` at a time, or upload the matching unzipped folder if the provider requires loose files.",
    "- After release, inside each batch, use `batch.jsonl` for structured submission or `batch.csv` plus `ORDERED_UPLOAD_CHECKLIST.md` for manual entry.",
    "- Each shot row points only to bundle-local files under `shots/`: `model_prompt.md`, `negative_prompt.md`, `start_frame.png`, `key_frame.png`, and `end_frame.png`.",
    "- Submit shots in row order. Generate exactly one mp4 per row.",
    "",
    "## Hard Generation Rules",
    "",
    "- Do not add anonymous readable students, spectators, soldiers, crowds, bystanders, or silhouettes.",
    "- Preserve the `visible_named_only` roster exactly for every row.",
    "- Preserve `visible_but_no_active_combat_after`: readable names in that field may stand down, concede, lower weapons, or remain post-battle only.",
    "- Preserve the after-shot attrition ledger. Characters marked defeated, captured, stood down, objective-defeated, or `must_not_return_active` cannot resume active combat later.",
    "- Hubert remains captured by Felix and Ashe after Shot032F.",
    "- Dorothea and Bernadetta remain captured by Leonie and Claude after Shot032G.",
    "- Hanneman and Manuela are separate faculty examiners, never a paired allied unit.",
    "- Shot034B permits only Byleth and Dimitri; both faculty objective markers remain empty; Hanneman/Manuela are absent/offscreen/silent/unpaired.",
    "- The mock battle remains nonlethal: no blood, gore, humiliation, or lethal weapon escalation.",
    "",
    "## Return Clips",
    "",
    "- Preferred returned filenames are listed in each batch's `expected_downloads_subset.csv`.",
    "- Exact expected filenames like `36_Shot034B.mp4` are accepted by ingest.",
    "- Filenames with `custom_id` prefixes like `036_Shot034B_provider_take01.mp4` are also accepted.",
    "- Bare shot-name files like `Shot034B.mp4` are intentionally rejected as too weak for safe ingest.",
    "- Return format is `.mp4` only; `.mov`, `.m4v`, `.webm`, image files, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.",
    "- Keep each batch's returned clips together so they can be placed under `clip_return_intake/batch_###_shots_###-###_returns/returned_mp4/`.",
    "",
    "## After Return",
    "",
    "- Do not copy returned clips into final expected paths by hand.",
    "- First run the package ingest dry-run, then apply only if every match is unique and every mp4 passes container probing.",
    "- Returned clips still require Codex motion QA, provenance checks, revision queue clearance, concat gate, and final edit structural audit.",
    "- Motion QA must verify the full post-shot ledger fields: Alive / Safe After; Visible But No Active Combat After; Active / Controlling After; Limited But Not Defeated After; Defeated / Removed After; Captured / Objective-Defeated After; Stood Down / Post-Battle After; Must Not Return Active; Changed This Shot; No-Active-Combat Line.",
    "- The four critical locks remain mandatory after return: Shot032F Hubert captured by Felix/Ashe; Shot032G Dorothea and Bernadetta captured by Leonie/Claude; Shot034B empty faculty objective with Hanneman/Manuela absent/offscreen/unpaired; Shot034G exhausted Dimitri/Dedue core victory.",
    "- These bundles by themselves do not satisfy final video delivery.",
    "",
    "See `RETURN_CONTRACT.md` for the exact post-provider return contract.",
    "",
  ].join("\n");
}

function buildReturnContract(manifestOut) {
  return [
    "# Scene09 V3 Provider Return Contract",
    "",
    "This contract defines what counts as a valid provider return for EP02 Scene09 V3.",
    "",
    "## Required Return Set",
    "",
    `- Expected batches: ${manifestOut.total_batches}.`,
    `- Expected clips: ${manifestOut.total_shots}.`,
    "- One real provider-generated `.mp4` per `custom_id` in `model_submission_batches/expected_downloads.csv`.",
    "- No proxy animatic clips, preview clips, contact sheets, or still images may be substituted for real provider mp4 files.",
    "- Return format is `.mp4` only; `.mov`, `.m4v`, `.webm`, image files, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.",
    "",
    "## Accepted Filename Evidence",
    "",
    "- Exact expected filename from `expected_filename`, for example `01_Shot025.mp4`.",
    "- Filename beginning with the exact `custom_id`, for example `001_Shot025_take02.mp4`.",
    "- A returned file must be parseable by `ffprobe`; corrupt or non-video mp4 containers stay blocked.",
    "",
    "## Rejected Filename Evidence",
    "",
    "- Bare shot names such as `Shot025.mp4` or `Shot034B.mp4`.",
    "- Ambiguous duplicates for the same `custom_id` unless a specific replacement is chosen and older candidates are removed.",
    "- Any file whose content hash already belongs to a proxy animatic, still-frame render, or non-provider fixture.",
    "",
    "## Import Procedure",
    "",
    "Use the safe ingest path only:",
    "",
    "```bash",
    "node scripts/ingest_scene09_v3_generated_clips.js --input /path/to/model/downloads --dry-run",
    "node scripts/ingest_scene09_v3_generated_clips.js --input /path/to/model/downloads --apply",
    "node scripts/run_scene09_v3_video_pipeline.js --dry-run",
    "```",
    "",
    "For batch folders, use:",
    "",
    "```bash",
    "node scripts/resume_scene09_v3_after_clip_return.js --input /path/to/model/downloads",
    "node scripts/resume_scene09_v3_after_clip_return.js --input /path/to/model/downloads --apply-ingest",
    "```",
    "",
    "## Required QA After Import",
    "",
    "- `generated_clip_structural_audit` must pass for 42/42 clips.",
    "- Start/mid/end motion-review frames must be extracted for 42/42 clips.",
    "- Codex, not the user, must perform motion self-audit against identity, roster, attrition, teacher-lane, nonlethal, camera, and end-frame locks.",
    "- `motion_self_audit_apply_gate` must pass with current clip and review-frame signatures.",
    "- `clip_revision_queue.csv` must contain no actionable generation, repair, or revision rows.",
    "- `final_concat_gate`, `final_edit_structural_audit`, and `video_generation_run_completion_audit` must pass before the sequence can be called finished.",
    "",
    "## Full Post-Shot Ledger Return QA",
    "",
    "- Every returned clip is checked against the after-state ledger embedded in its `batch.jsonl`, `batch.csv`, `batch_runbook.md`, and `ORDERED_UPLOAD_CHECKLIST.md` row.",
    "- Required ledger fields per returned clip: Alive / Safe After; Visible But No Active Combat After; Active / Controlling After; Limited But Not Defeated After; Defeated / Removed After; Captured / Objective-Defeated After; Stood Down / Post-Battle After; Must Not Return Active; Changed This Shot; No-Active-Combat Line.",
    "- A returned clip fails motion QA if anyone listed in Visible But No Active Combat After resumes attacking, casting, pursuing, guarding an active route, or otherwise plays as an active combatant after that shot.",
    "- A returned clip fails motion QA if any character listed in Defeated / Removed, Captured / Objective-Defeated, Stood Down / Post-Battle, Must Not Return Active, or No-Active-Combat Line resumes active combat.",
    "- A returned clip fails motion QA if Alive / Safe After is contradicted by lethal injury, blood, gore, humiliation, or death framing.",
    "- Any returned clip that violates the ledger goes to `clip_revision_queue.csv`; it cannot be marked `motion_review_passed`.",
    "",
    "## Non-Negotiable Continuity Locks",
    "",
    "- No unnamed readable people appear in any returned clip.",
    "- No eliminated/captured/stood-down/objective-defeated character returns to active combat after their ledger exit.",
    "- Hubert, Dorothea, and Bernadetta remain captured after their capture shots.",
    "- Shot032F Hubert captured by Felix/Ashe remains true after return.",
    "- Shot032G Dorothea and Bernadetta captured by Leonie/Claude remains true after return.",
    "- Hanneman and Manuela never become a side-by-side teacher pair or allied combat unit.",
    "- Shot034B empty faculty objective with Hanneman/Manuela absent/offscreen/unpaired remains true after return.",
    "- Shot034B remains Byleth and Dimitri only.",
    "- Shot034G exhausted Dimitri/Dedue core victory remains true after return.",
    "- The final victory remains an exhausted Blue Lions core outcome, not a reset into a full-class celebration.",
    "",
  ].join("\n");
}

function batchReturnContract(manifestOut, batch, rows) {
  return [
    buildReturnContract(manifestOut).trimEnd(),
    "",
    "## Batch Scope",
    "",
    `- Batch: ${batch.batch_id}.`,
    `- Rows in this zip: ${rows.length}.`,
    "- Returned clips for this zip must match only the `custom_id` rows below.",
    "",
    "## Batch Expected Filenames",
    "",
    ...rows.map((row) => `- ${row.custom_id}: ${path.basename(row.expected_clip || "")}`),
    "",
  ].join("\n");
}

function zipDirectory(sourceDir, zipPath) {
  if (!fs.existsSync("/usr/bin/zip")) return null;
  try {
    fs.rmSync(zipPath, { force: true });
    cp.execFileSync("/usr/bin/zip", ["-qr", zipPath, "."], { cwd: sourceDir, stdio: "ignore" });
    return sha256(zipPath);
  } catch (error) {
    return { error: error.message };
  }
}

function updateRunbook() {
  const runbook = readText(runbookPath);
  const section = [
    "## Provider Upload Bundles",
    "",
    "- Self-contained upload folders and zip archives live in `provider_upload_bundles/`.",
    "- Each `batch_###_shots_###-###/` folder contains `batch.jsonl`, `batch.csv`, `batch_runbook.md`, `expected_downloads_subset.csv`, an upload checklist, and package-local shot files under `shots/`.",
    "- The matching `.zip` beside each folder can be uploaded or moved as one unit.",
    "- These full-duration bundles are structurally prepared but locked; do not upload them until `full_duration_release_gate` passes.",
    "- Use `provider_upload_bundles/provider_upload_bundles_manifest.json` to verify SHA-256 checksums before and after transfer.",
    "- Use `provider_upload_bundles/RETURN_CONTRACT.md` to validate returned mp4 filenames, ingest procedure, and post-return QA gates.",
    "",
  ].join("\n");
  const next = runbook.includes("## Provider Upload Bundles")
    ? runbook.replace(/## Provider Upload Bundles\n[\s\S]*?(?=\n## )/, section.trimEnd())
    : runbook.replace("\n## Generated Operator Profile\n", `\n${section}\n## Generated Operator Profile\n`);
  writeText(runbookPath, next);
}

function main() {
  const packageManifest = readJson(packageManifestPath);
  const batchManifest = readJson(batchManifestPath);
  const shotByPackageDir = new Map((packageManifest.shots || []).map((shot) => [shot.package_dir, shot]));

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const bundles = [];
  for (const batch of batchManifest.batches || []) {
    const batchDirRel = batch.batch_id;
    const batchDir = path.join(outDir, batchDirRel);
    fs.mkdirSync(batchDir, { recursive: true });
    const rows = readText(path.join(pkgDir, batch.jsonl)).trim().split(/\n/).filter(Boolean).map(JSON.parse).map(bundleLocalRow);
    const expectedCustomIds = JSON.stringify(batch.custom_ids || []);
    const actualCustomIds = JSON.stringify(rows.map((row) => row.custom_id));
    if (actualCustomIds !== expectedCustomIds) throw new Error(`Batch JSONL custom_id order mismatch for ${batch.batch_id}`);
    const customIds = new Set(rows.map((row) => row.custom_id));
    const fileRecords = [];

    writeText(path.join(batchDir, "batch.jsonl"), renderBundleJsonl(rows));
    fileRecords.push({ path: `${batchDirRel}/batch.jsonl`, ...sha256(path.join(batchDir, "batch.jsonl")) });
    writeText(path.join(batchDir, "batch.csv"), renderBundleCsv(rows));
    fileRecords.push({ path: `${batchDirRel}/batch.csv`, ...sha256(path.join(batchDir, "batch.csv")) });
    writeText(path.join(batchDir, "batch_runbook.md"), buildBatchChecklist(batch, rows));
    fileRecords.push({ path: `${batchDirRel}/batch_runbook.md`, ...sha256(path.join(batchDir, "batch_runbook.md")) });
    writeText(path.join(batchDir, "expected_downloads_subset.csv"), filterExpectedDownloads(customIds));
    fileRecords.push({ path: `${batchDirRel}/expected_downloads_subset.csv`, ...sha256(path.join(batchDir, "expected_downloads_subset.csv")) });
    writeText(path.join(batchDir, "ORDERED_UPLOAD_CHECKLIST.md"), buildBatchChecklist(batch, rows));
    fileRecords.push({ path: `${batchDirRel}/ORDERED_UPLOAD_CHECKLIST.md`, ...sha256(path.join(batchDir, "ORDERED_UPLOAD_CHECKLIST.md")) });
    writeText(path.join(batchDir, "RETURN_CONTRACT.md"), batchReturnContract({
      total_batches: (batchManifest.batches || []).length,
      total_shots: packageManifest.total_shots,
    }, batch, rows));
    fileRecords.push({ path: `${batchDirRel}/RETURN_CONTRACT.md`, ...sha256(path.join(batchDir, "RETURN_CONTRACT.md")) });

    for (const row of rows) {
      const shotDir = shotDirForRow(row);
      const shot = shotByPackageDir.get(shotDir);
      const packageDir = shot?.package_dir || shotDir;
      if (!packageDir) throw new Error(`Cannot resolve package_dir for ${row.custom_id}`);
      for (const name of requiredShotFiles) {
        copyFile(`${packageDir}/${name}`, `${batchDirRel}/${shotDir}/${name}`, fileRecords);
      }
    }

    const batchManifestOut = {
      batch_id: batch.batch_id,
      source_batch_manifest: "model_submission_batches/batch_manifest.json",
      source_battle_ledger: batchManifest.source_battle_ledger || "",
      battle_ledger_policy: "Every batch row and checklist row carries after-shot active/objective, limited, defeated/removed, captured/objective-defeated, stood-down, must-not-return-active, changed-this-shot, and no-active-combat state.",
      rows: rows.length,
      custom_ids: rows.map((row) => row.custom_id),
      total_duration_seconds: rows.reduce((sum, row) => sum + Number(row.duration_seconds || 0), 0),
      expected_downloads_subset: "expected_downloads_subset.csv",
      return_contract: "RETURN_CONTRACT.md",
      files: fileRecords,
    };
    writeJson(path.join(batchDir, "bundle_manifest.json"), batchManifestOut);
    fileRecords.push({ path: `${batchDirRel}/bundle_manifest.json`, ...sha256(path.join(batchDir, "bundle_manifest.json")) });

    const zipRel = `${batch.batch_id}.zip`;
    const zipPath = path.join(outDir, zipRel);
    const zipDigest = zipDirectory(batchDir, zipPath);
    bundles.push({
      batch_id: batch.batch_id,
      directory: `provider_upload_bundles/${batchDirRel}`,
      zip: zipDigest?.error ? null : `provider_upload_bundles/${zipRel}`,
      zip_digest: zipDigest,
      rows: rows.length,
      custom_ids: rows.map((row) => row.custom_id),
      files: fileRecords.length,
      total_file_bytes: fileRecords.reduce((sum, file) => sum + Number(file.bytes || 0), 0),
    });
  }

  const manifestOut = {
    version: 1,
    date: new Date().toISOString().slice(0, 10),
    package_id: packageManifest.package_id,
    status: "full_duration_upload_prepared_locked_probe_release_pending",
    source_package_manifest: "package_manifest.json",
    source_batch_manifest: "model_submission_batches/batch_manifest.json",
    source_battle_ledger: batchManifest.source_battle_ledger || "",
    return_contract: "provider_upload_bundles/RETURN_CONTRACT.md",
    total_batches: bundles.length,
    total_shots: packageManifest.total_shots,
    bundle_policy: "Each directory and zip is self-contained for full-duration provider upload after full_duration_release_gate passes; returned mp4 files still require ingest and Codex motion QA.",
    bundles,
  };
  writeJson(path.join(outDir, "provider_upload_bundles_manifest.json"), manifestOut);
  writeText(path.join(outDir, "README.md"), buildProviderReadme(manifestOut));
  writeText(path.join(outDir, "RETURN_CONTRACT.md"), buildReturnContract(manifestOut));

  const packageManifestNext = readJson(packageManifestPath);
  packageManifestNext.provider_upload_bundles = "provider_upload_bundles/provider_upload_bundles_manifest.json";
  packageManifestNext.provider_upload_bundles_dir = "provider_upload_bundles";
  writeJson(packageManifestPath, packageManifestNext);
  updateRunbook();

  console.log(JSON.stringify({
    ok: true,
    decision: "provider_upload_bundles_ready",
    directory: outRel,
    batches: bundles.length,
    zips: bundles.filter((bundle) => bundle.zip).length,
    total_shots: packageManifest.total_shots,
    manifest: `${outRel}/provider_upload_bundles_manifest.json`,
  }, null, 2));
}

main();
