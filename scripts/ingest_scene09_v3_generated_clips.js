#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-07-28";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const payloadPath = path.join(packageDir, "submission_payload.jsonl");
const outJson = path.join(reportDir, `scene09_v3_clip_ingest_report_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_clip_ingest_report_${date}.md`);

const supportedExts = new Set([".mp4"]);
const knownVideoExts = new Set([".mp4", ".mov", ".m4v", ".webm"]);

function usage() {
  return [
    "Usage:",
    "  node scripts/ingest_scene09_v3_generated_clips.js --input <download-dir> [--apply] [--force] [--allow-loose-shot-name]",
    "",
    "Default mode is a dry run. It scans external model downloads and reports how they would map to Scene09 V3 expected_clip paths.",
    "Use --apply to copy uniquely matched .mp4 files into the expected_clip paths. Existing targets are never overwritten unless --force is also provided.",
    "By default, bare shot-name filenames such as Shot034B.mp4 are rejected as too weak; use expected filenames or custom_id prefixes.",
  ].join("\n");
}

function parseArgs(argv) {
  const options = {
    inputDir: null,
    apply: false,
    force: false,
    allowLooseShotName: false,
    reportJson: outJson,
    reportMd: outMd,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--input") {
      const value = argv[i + 1];
      if (!value) throw new Error("--input requires a directory");
      options.inputDir = path.resolve(value);
      i += 1;
    } else if (arg === "--apply" || arg === "--copy") {
      options.apply = true;
    } else if (arg === "--dry-run") {
      options.apply = false;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--allow-loose-shot-name") {
      options.allowLooseShotName = true;
    } else if (arg === "--report-json") {
      const value = argv[i + 1];
      if (!value) throw new Error("--report-json requires a path");
      options.reportJson = path.resolve(value);
      i += 1;
    } else if (arg === "--report-md") {
      const value = argv[i + 1];
      if (!value) throw new Error("--report-md requires a path");
      options.reportMd = path.resolve(value);
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      process.stdout.write(`${usage()}\n`);
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  if (!options.inputDir) throw new Error(`Missing --input directory.\n${usage()}`);
  return options;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
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

function fileDigest(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function probeVideo(file) {
  const result = cp.spawnSync("ffprobe", [
    "-v", "error",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    file,
  ], { encoding: "utf8" });
  if (result.error) {
    return { ok: false, issue: "ffprobe_unavailable", error: result.error.message };
  }
  if (result.status !== 0) {
    return { ok: false, issue: "ffprobe_failed", error: (result.stderr || "").trim() || `ffprobe exited ${result.status}` };
  }
  let data = null;
  try {
    data = JSON.parse(result.stdout || "{}");
  } catch (error) {
    return { ok: false, issue: "ffprobe_json_parse_failed", error: error.message };
  }
  const videoStream = (data.streams || []).find((stream) => stream.codec_type === "video");
  const durationSeconds = Number(data.format?.duration || videoStream?.duration || 0);
  if (!videoStream) {
    return { ok: false, issue: "missing_video_stream", duration_seconds: Number.isFinite(durationSeconds) ? durationSeconds : null };
  }
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    return { ok: false, issue: "missing_or_zero_duration", codec_name: videoStream.codec_name || null };
  }
  return {
    ok: true,
    issue: null,
    duration_seconds: durationSeconds,
    codec_name: videoStream.codec_name || null,
    width: videoStream.width || null,
    height: videoStream.height || null,
  };
}

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/%20/g, " ")
    .replace(/\s+/g, "_");
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scanFiles(dir) {
  const files = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (knownVideoExts.has(ext)) {
          files.push({
            absolute,
            relative_to_input: path.relative(dir, absolute),
            basename: entry.name,
            stem: path.basename(entry.name, ext),
            ext,
            supported: supportedExts.has(ext),
            video_probe: null,
          });
        }
      }
    }
  }
  files.sort((a, b) => a.relative_to_input.localeCompare(b.relative_to_input));
  for (const file of files) {
    if (file.supported) file.video_probe = probeVideo(file.absolute);
  }
  return files;
}

function readPayloadRows() {
  if (!fs.existsSync(payloadPath)) return [];
  return fs.readFileSync(payloadPath, "utf8")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function buildShotRows(manifest) {
  const payloadById = new Map(readPayloadRows().map((row) => [row.id, row]));
  return manifest.shots.map((shot) => {
    const expectedBase = path.basename(shot.expected_clip);
    const expectedStem = path.basename(expectedBase, path.extname(expectedBase));
    const order2 = String(shot.order).padStart(2, "0");
    const order3 = String(shot.order).padStart(3, "0");
    const payload = payloadById.get(shot.id);
    const customId = payload?.custom_id || `${order3}_${shot.shot}`;
    return {
      id: shot.id,
      shot: shot.shot,
      order: shot.order,
      expected_clip: shot.expected_clip,
      expected_clip_absolute: path.join(root, shot.expected_clip),
      expected_basename: expectedBase,
      expected_stem: expectedStem,
      custom_id: customId,
      match_tokens: {
        exact_basenames: [
          expectedBase,
          `${expectedStem}.mp4`,
          `${order2}_${shot.shot}.mp4`,
          `${order3}_${shot.shot}.mp4`,
          `${customId}.mp4`,
        ],
        exact_stems: [
          expectedStem,
          `${order2}_${shot.shot}`,
          `${order3}_${shot.shot}`,
          customId,
        ],
      },
    };
  });
}

function scoreCandidate(file, shot, options) {
  if (!file.supported) return null;
  if (!file.video_probe?.ok) return null;
  const basename = normalizeName(file.basename);
  const stem = normalizeName(file.stem);
  const exactBasenames = shot.match_tokens.exact_basenames.map(normalizeName);
  const exactStems = shot.match_tokens.exact_stems.map(normalizeName);
  const expectedStem = normalizeName(shot.expected_stem);
  const customId = normalizeName(shot.custom_id);
  const shotName = normalizeName(shot.shot);
  const shotBoundary = new RegExp(`(^|[^a-z0-9])${escapeRegex(shotName)}([^a-z0-9]|$)`);

  if (exactBasenames.includes(basename)) return { score: 100, reason: "exact_expected_or_custom_basename" };
  if (exactStems.includes(stem)) return { score: 95, reason: "exact_expected_or_custom_stem" };
  if (stem.startsWith(`${customId}_`) || stem.startsWith(`${customId}-`)) return { score: 88, reason: "starts_with_custom_id" };
  if (stem.startsWith(`${expectedStem}_`) || stem.startsWith(`${expectedStem}-`)) return { score: 86, reason: "starts_with_expected_stem" };
  if (stem.includes(customId)) return { score: 78, reason: "contains_custom_id" };
  if (stem.includes(expectedStem)) return { score: 74, reason: "contains_expected_stem" };
  if (options.allowLooseShotName && shotBoundary.test(stem)) return { score: 60, reason: "contains_shot_name_with_boundary" };
  return null;
}

function bestShotForFile(file, shots, options) {
  const matches = shots
    .map((shot) => ({ shot, match: scoreCandidate(file, shot, options) }))
    .filter((row) => row.match)
    .sort((a, b) => b.match.score - a.match.score || a.shot.order - b.shot.order);
  if (!matches.length) return { status: "unmatched" };
  const topScore = matches[0].match.score;
  const top = matches.filter((row) => row.match.score === topScore);
  if (top.length > 1) {
    return {
      status: "ambiguous_file",
      score: topScore,
      candidates: top.map((row) => ({ shot: row.shot.shot, order: row.shot.order, reason: row.match.reason })),
    };
  }
  return {
    status: "matched",
    shot: top[0].shot,
    score: topScore,
      reason: top[0].match.reason,
      loose: top[0].match.reason === "contains_shot_name_with_boundary",
    };
}

function planIngest(files, shots, options) {
  const matchedByShot = new Map();
  const unsupported = files.filter((file) => !file.supported);
  const invalidVideoFiles = files.filter((file) => file.supported && !file.video_probe?.ok);
  const unmatched = [];
  const ambiguousFiles = [];

  for (const file of files.filter((item) => item.supported)) {
    const best = bestShotForFile(file, shots, options);
    if (best.status === "matched") {
      const list = matchedByShot.get(best.shot.id) || [];
      list.push({ file, score: best.score, reason: best.reason, shot: best.shot });
      matchedByShot.set(best.shot.id, list);
    } else if (best.status === "ambiguous_file") {
      ambiguousFiles.push({ file, ...best });
    } else {
      unmatched.push(file);
    }
  }

  const rows = shots.map((shot) => {
    const candidates = matchedByShot.get(shot.id) || [];
    const targetExists = fs.existsSync(shot.expected_clip_absolute);
    const duplicate = candidates.length > 1;
    const selected = candidates.length === 1 ? candidates[0] : null;
    const blocking = [];
    if (duplicate) blocking.push("multiple_candidates_for_same_shot");
    if (selected && targetExists && !options.force) blocking.push("target_exists_use_force_to_overwrite");
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      custom_id: shot.custom_id,
      expected_clip: shot.expected_clip,
      expected_clip_absolute: shot.expected_clip_absolute,
      target_exists: targetExists,
      candidates: candidates.map((candidate) => ({
        source: candidate.file.absolute,
        source_relative_to_input: candidate.file.relative_to_input,
        source_digest: fileDigest(candidate.file.absolute),
        video_probe: candidate.file.video_probe,
        score: candidate.score,
        reason: candidate.reason,
      })),
      selected_source: selected ? selected.file.absolute : null,
      selected_source_relative_to_input: selected ? selected.file.relative_to_input : null,
      selected_source_digest: selected ? fileDigest(selected.file.absolute) : null,
      selected_video_probe: selected ? selected.file.video_probe : null,
      selected_score: selected ? selected.score : null,
      selected_reason: selected ? selected.reason : null,
      ingest_status: duplicate
        ? "blocked_duplicate_candidates"
        : selected
          ? blocking.length
            ? "blocked"
            : options.apply
              ? "ready_to_copy"
              : "would_copy"
          : "missing_source",
      blocking,
      copied: false,
      copied_digest: null,
    };
  });

  return {
    rows,
    unsupported,
    invalidVideoFiles,
    unmatched,
    ambiguousFiles,
  };
}

function applyCopies(plan, options) {
  for (const row of plan.rows) {
    if (row.ingest_status !== "ready_to_copy") continue;
    fs.mkdirSync(path.dirname(row.expected_clip_absolute), { recursive: true });
    fs.copyFileSync(row.selected_source, row.expected_clip_absolute);
    row.copied = true;
    row.copied_digest = fileDigest(row.expected_clip_absolute);
    row.ingest_status = "copied";
  }
  if (options.apply) {
    for (const row of plan.rows) {
      if (row.ingest_status === "ready_to_copy") row.ingest_status = "not_copied";
    }
  }
}

function writeClipProvenance(report, options) {
  const copied = report.rows.filter((row) => row.copied);
  if (!copied.length) return;
  const file = path.join(packageDir, "generated_clip_provenance.json");
  const existing = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : { version: 1, rows: [] };
  const rowsByClip = new Map((existing.rows || []).map((row) => [row.expected_clip, row]));
  for (const row of copied) {
    rowsByClip.set(row.expected_clip, {
      source_type: "provider_ingest",
      created_at: new Date().toISOString(),
      order: row.order,
      shot: row.shot,
      id: row.id,
      custom_id: row.custom_id,
      expected_clip: row.expected_clip,
      source: row.selected_source,
      source_relative_to_input: row.selected_source_relative_to_input,
      source_bytes: row.selected_source_digest?.bytes || null,
      source_sha256: row.selected_source_digest?.sha256 || null,
      source_video_probe: row.selected_video_probe || null,
      match_reason: row.selected_reason,
      ingest_report: options.reportJson,
      bytes: row.copied_digest?.bytes || null,
      sha256: row.copied_digest?.sha256 || null,
    });
  }
  writeJson(file, {
    version: 1,
    updated_at: new Date().toISOString(),
    rows: [...rowsByClip.values()].sort((a, b) => Number(a.order) - Number(b.order)),
  });
}

function renderMarkdown(report) {
  const copied = report.rows.filter((row) => row.copied);
  const planned = report.rows.filter((row) => row.ingest_status === "would_copy");
  const blocked = report.rows.filter((row) => row.blocking.length);
  const missing = report.rows.filter((row) => row.ingest_status === "missing_source");
  const unsupported = report.unsupported_video_files || [];
  const invalid = report.invalid_video_files || [];
  return [
    "# Scene09 V3 Generated Clip Ingest Report",
    "",
    `Date: ${report.date}`,
    `Decision: ${report.decision}`,
    `Mode: ${report.options.apply ? "apply" : "dry_run"}`,
    `Input: \`${report.input_dir}\``,
    "",
    "## Summary",
    "",
    `- Expected shots: ${report.total_shots}`,
    `- Source video files scanned: ${report.scanned_video_files}`,
    `- Unique matched shots: ${report.unique_matched_shots}`,
    `- Would copy: ${planned.length}`,
    `- Copied: ${copied.length}`,
    `- Missing source shots: ${missing.length}`,
    `- Blocked shots: ${blocked.length}`,
    `- Ambiguous source files: ${report.ambiguous_files.length}`,
    `- Unsupported video files: ${unsupported.length}`,
    `- Invalid video files: ${invalid.length}`,
    `- Unmatched mp4 files: ${report.unmatched_mp4_files.length}`,
    "",
    "## Copied / Planned Rows",
    "",
    ...(report.rows
      .filter((row) => row.selected_source || row.copied)
      .map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot}: ${row.ingest_status} <- \`${row.selected_source_relative_to_input}\` -> \`${row.expected_clip}\`${row.blocking.length ? ` (${row.blocking.join("; ")})` : ""}`)),
    "",
    "## Blocked Rows",
    "",
    ...(blocked.length ? blocked.map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot}: ${row.blocking.join("; ")}`) : ["- None."]),
    "",
    "## Unsupported Video Files",
    "",
    ...(unsupported.length ? unsupported.map((file) => `- \`${file.source_relative_to_input}\`: unsupported return format ${file.ext}; transcode or redownload as .mp4 before ingest`) : ["- None."]),
    "",
    "## Invalid Video Files",
    "",
    ...(invalid.length ? invalid.map((file) => `- \`${file.source_relative_to_input}\`: ${file.video_probe?.issue || "invalid_video"}${file.video_probe?.error ? ` (${file.video_probe.error})` : ""}`) : ["- None."]),
    "",
    "## Next QA",
    "",
    "After applying imports, run:",
    "",
    "```bash",
    "node scripts/run_scene09_v3_video_pipeline.js --dry-run",
    "```",
    "",
    "The pipeline will rebuild the file:// review pages, extract motion-review frames from any real clips, and keep every imported clip pending until Codex motion self-audit passes.",
    "",
  ].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  if (!fs.existsSync(options.inputDir)) throw new Error(`Input directory does not exist: ${options.inputDir}`);
  if (!fs.statSync(options.inputDir).isDirectory()) throw new Error(`Input path is not a directory: ${options.inputDir}`);

  const manifest = readJson(manifestPath);
  const shots = buildShotRows(manifest);
  const files = scanFiles(options.inputDir);
  const plan = planIngest(files, shots, options);
  applyCopies(plan, options);

  const blockedRows = plan.rows.filter((row) => row.blocking.length);
  const invalidVideoFiles = plan.invalidVideoFiles || [];
  const uniqueMatchedRows = plan.rows.filter((row) => row.selected_source);
  const copiedRows = plan.rows.filter((row) => row.copied);
  const dryRunRows = plan.rows.filter((row) => row.ingest_status === "would_copy");
  const report = {
    date,
    package_manifest: rel(manifestPath),
    input_dir: options.inputDir,
    options,
    decision: blockedRows.length || plan.ambiguousFiles.length || invalidVideoFiles.length || plan.unsupported.length
      ? "clip_ingest_needs_filename_resolution"
      : options.apply
        ? copiedRows.length
          ? "clip_ingest_applied_run_pipeline_qa"
          : "clip_ingest_no_matching_copies_applied"
        : dryRunRows.length
          ? "clip_ingest_dry_run_ready_to_apply"
          : "clip_ingest_no_matching_sources",
    total_shots: shots.length,
    scanned_video_files: files.length,
    unique_matched_shots: uniqueMatchedRows.length,
    would_copy: dryRunRows.length,
    copied: copiedRows.length,
    missing_source_shots: plan.rows.filter((row) => row.ingest_status === "missing_source").length,
    blocked_shots: blockedRows.length,
    rows: plan.rows.map((row) => ({
      ...row,
      expected_clip_absolute: row.expected_clip_absolute,
    })),
    ambiguous_files: plan.ambiguousFiles.map((item) => ({
      source: item.file.absolute,
      source_relative_to_input: item.file.relative_to_input,
      score: item.score,
      candidates: item.candidates,
    })),
    unsupported_video_files: plan.unsupported.map((file) => ({
      source: file.absolute,
      source_relative_to_input: file.relative_to_input,
      ext: file.ext,
    })),
    invalid_video_files: invalidVideoFiles.map((file) => ({
      source: file.absolute,
      source_relative_to_input: file.relative_to_input,
      ext: file.ext,
      video_probe: file.video_probe,
    })),
    unmatched_mp4_files: plan.unmatched.map((file) => ({
      source: file.absolute,
      source_relative_to_input: file.relative_to_input,
    })),
    report_json: rel(options.reportJson),
    report_md: rel(options.reportMd),
  };
  writeClipProvenance(report, options);

  writeJson(options.reportJson, report);
  writeText(options.reportMd, renderMarkdown(report));
  process.stdout.write(`${JSON.stringify({
    decision: report.decision,
    total_shots: report.total_shots,
    scanned_video_files: report.scanned_video_files,
    unique_matched_shots: report.unique_matched_shots,
    would_copy: report.would_copy,
    copied: report.copied,
    missing_source_shots: report.missing_source_shots,
    blocked_shots: report.blocked_shots,
    ambiguous_files: report.ambiguous_files.length,
    unsupported_video_files: report.unsupported_video_files.length,
    invalid_video_files: report.invalid_video_files.length,
    unmatched_mp4_files: report.unmatched_mp4_files.length,
    report_json: report.report_json,
    report_md: report.report_md,
  }, null, 2)}\n`);
  if (blockedRows.length || plan.ambiguousFiles.length || invalidVideoFiles.length || plan.unsupported.length) process.exit(1);
}

main();
