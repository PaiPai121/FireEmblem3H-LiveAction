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
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const provenancePath = path.join(packageDir, "generated_clip_provenance.json");
const outJson = path.join(reportDir, `scene09_v3_clip_provenance_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_clip_provenance_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "clip_provenance_gate.json");
const packageOutMd = path.join(packageDir, "clip_provenance_gate.md");

function readJson(file, fallback = null) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
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

function abs(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
}

function digest(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function digestText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeClipPath(value) {
  if (!value) return "";
  const absolute = abs(value);
  return rel(absolute);
}

function main() {
  const manifest = readJson(packageManifestPath);
  if (!manifest) throw new Error(`Missing package manifest: ${packageManifestPath}`);
  const provenance = readJson(provenancePath, {
    version: 1,
    rows: [],
  });
  const provenanceRows = Array.isArray(provenance.rows) ? provenance.rows : [];
  const provenanceByClip = new Map(provenanceRows.map((row) => [normalizeClipPath(row.expected_clip || row.output_clip), row]));
  const problems = [];
  const warnings = [];
  const rows = (manifest.shots || []).map((shot) => {
    const expectedClip = normalizeClipPath(shot.expected_clip);
    const expectedAbs = abs(shot.expected_clip);
    const exists = fs.existsSync(expectedAbs);
    const currentSha256 = exists ? digest(expectedAbs) : null;
    const source = provenanceByClip.get(expectedClip) || null;
    const rowProblems = [];
    const rowWarnings = [];

    if (exists && !source) {
      rowProblems.push("existing expected clip has no provenance row");
    }
    if (exists && source) {
      if (!["provider_ingest", "model_cli_execute"].includes(source.source_type)) {
        rowProblems.push(`unsupported provenance source_type ${source.source_type || "missing"}`);
      }
      if (!source.sha256) rowProblems.push("provenance row is missing output sha256");
      if (source.sha256 && source.sha256 !== currentSha256) {
        rowProblems.push("current expected clip sha256 does not match provenance sha256");
      }
      if (!source.created_at) rowProblems.push("provenance row is missing created_at");
      if (!source.shot || source.shot !== shot.shot) rowProblems.push(`provenance shot ${source.shot || "missing"} does not match ${shot.shot}`);
      if (!source.id || source.id !== shot.id) rowProblems.push(`provenance id ${source.id || "missing"} does not match ${shot.id}`);
      if (source.source_type === "provider_ingest") {
        if (!source.source) rowProblems.push("provider provenance is missing source path");
        if (!source.source_relative_to_input) rowProblems.push("provider provenance is missing source_relative_to_input");
        if (!source.source_bytes) rowProblems.push("provider provenance is missing source_bytes");
        if (!source.source_sha256) rowProblems.push("provider provenance is missing source_sha256");
        if (!source.source_video_probe?.ok) rowProblems.push("provider provenance is missing passing source_video_probe");
        if (source.source && fs.existsSync(source.source)) {
          const sourceStat = fs.statSync(source.source);
          const sourceSha256 = digest(source.source);
          if (Number(source.source_bytes || 0) !== sourceStat.size) {
            rowProblems.push("provider source file bytes do not match provenance source_bytes");
          }
          if (source.source_sha256 && source.source_sha256 !== sourceSha256) {
            rowProblems.push("provider source file sha256 does not match provenance source_sha256");
          }
        }
      }
      const sourcePathText = JSON.stringify(source).toLowerCase();
      if (/proxy_animatic|_proxy/.test(sourcePathText)) {
        rowProblems.push("provenance references proxy animatic material");
      }
    }
    if (!exists && source) {
      rowWarnings.push("provenance row exists but expected clip is currently missing");
    }

    for (const problem of rowProblems) problems.push(`${shot.shot}: ${problem}`);
    for (const warning of rowWarnings) warnings.push(`${shot.shot}: ${warning}`);
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: expectedClip,
      exists,
      current_sha256: currentSha256,
      provenance_source_type: source?.source_type || null,
      provenance_sha256: source?.sha256 || null,
      provenance_created_at: source?.created_at || null,
      provenance_source_sha256: source?.source_sha256 || null,
      problems: rowProblems,
      warnings: rowWarnings,
    };
  });

  const expectedClips = rows.length;
  const existingClips = rows.filter((row) => row.exists).length;
  const missingClips = expectedClips - existingClips;
  const provenanceMatched = rows.filter((row) => row.exists && row.provenance_sha256 && row.provenance_sha256 === row.current_sha256).length;
  const rowsDigest = digestText(`${JSON.stringify(rows)}\n`);
  const decision = problems.length
    ? "clip_provenance_blocked"
    : missingClips
      ? "clip_provenance_ready_clips_pending"
      : "clip_provenance_passed_all_expected_clips";
  const report = {
    date,
    package_id: manifest.package_id,
    package_manifest: rel(packageManifestPath),
    provenance_manifest: rel(provenancePath),
    decision,
    expected_clips: expectedClips,
    existing_clips: existingClips,
    missing_clips: missingClips,
    provenance_rows: provenanceRows.length,
    provenance_matched_existing_clips: provenanceMatched,
    rows_digest_sha256: rowsDigest,
    problems,
    warnings,
    rows,
  };
  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Clip Provenance Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    "",
    "This gate prevents a structurally valid mp4 from entering final assembly unless its expected clip path has matching provider-ingest or local-model provenance.",
    "",
    "## Counts",
    "",
    `- Expected clips: ${expectedClips}`,
    `- Existing clips: ${existingClips}`,
    `- Missing clips: ${missingClips}`,
    `- Provenance rows: ${provenanceRows.length}`,
    `- Provenance matched existing clips: ${provenanceMatched}`,
    `- Row digest: \`${rowsDigest}\``,
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
    expected_clips: expectedClips,
    existing_clips: existingClips,
    missing_clips: missingClips,
    provenance_rows: provenanceRows.length,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));
  if (decision === "clip_provenance_blocked") process.exit(1);
}

main();
