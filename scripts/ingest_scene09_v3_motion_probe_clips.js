#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const probeManifestPath = path.join(packageDir, "motion_probe_submission/motion_probe_manifest.json");
const outJson = path.join(reportDir, "scene09_v3_motion_probe_ingest_report_2026-08-01.json");
const outMd = path.join(reportDir, "scene09_v3_motion_probe_ingest_report_2026-08-01.md");

function usage() {
  return [
    "Usage:",
    "  node scripts/ingest_scene09_v3_motion_probe_clips.js --input <returned_mp4_dir> [--apply] [--force]",
    "",
    "Default mode is dry-run. Only .mp4 files with expected _probe names or custom_id prefixes can match.",
    "Bare shot-name clips and full-duration clip names are rejected; this tool only handles 3-second motion probes.",
  ].join("\n");
}

function parseArgs(argv) {
  const options = { inputDir: null, apply: false, force: false, reportJson: outJson, reportMd: outMd };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--input") {
      if (!argv[i + 1]) throw new Error("--input requires a directory");
      options.inputDir = path.resolve(argv[i + 1]);
      i += 1;
    } else if (arg === "--apply" || arg === "--copy") {
      options.apply = true;
    } else if (arg === "--dry-run") {
      options.apply = false;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--report-json") {
      if (!argv[i + 1]) throw new Error("--report-json requires a path");
      options.reportJson = path.resolve(argv[i + 1]);
      i += 1;
    } else if (arg === "--report-md") {
      if (!argv[i + 1]) throw new Error("--report-md requires a path");
      options.reportMd = path.resolve(argv[i + 1]);
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

function digest(file) {
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
  if (result.error) return { ok: false, issue: "ffprobe_unavailable", error: result.error.message };
  if (result.status !== 0) return { ok: false, issue: "ffprobe_failed", error: (result.stderr || "").trim() || `ffprobe exited ${result.status}` };
  let data = null;
  try {
    data = JSON.parse(result.stdout || "{}");
  } catch (error) {
    return { ok: false, issue: "ffprobe_json_parse_failed", error: error.message };
  }
  const videoStream = (data.streams || []).find((stream) => stream.codec_type === "video");
  const durationSeconds = Number(data.format?.duration || videoStream?.duration || 0);
  if (!videoStream) return { ok: false, issue: "missing_video_stream" };
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return { ok: false, issue: "missing_or_zero_duration" };
  return {
    ok: true,
    issue: null,
    duration_seconds: durationSeconds,
    codec_name: videoStream.codec_name || null,
    width: videoStream.width || null,
    height: videoStream.height || null,
  };
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/%20/g, " ").replace(/\s+/g, "_");
}

function scanFiles(dir) {
  if (!fs.existsSync(dir)) throw new Error(`Input directory does not exist: ${dir}`);
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if ([".mp4", ".mov", ".m4v", ".webm"].includes(ext)) {
          out.push({
            absolute,
            relative_to_input: path.relative(dir, absolute),
            basename: entry.name,
            stem: path.basename(entry.name, ext),
            ext,
            supported: ext === ".mp4",
            video_probe: ext === ".mp4" ? probeVideo(absolute) : null,
          });
        }
      }
    }
  }
  out.sort((a, b) => a.relative_to_input.localeCompare(b.relative_to_input));
  return out;
}

function expectedRows() {
  const manifest = readJson(probeManifestPath);
  return (manifest.rows || []).map((row) => {
    const expectedBase = path.basename(row.expected_probe_clip);
    const expectedStem = path.basename(expectedBase, ".mp4");
    return {
      order: row.order,
      shot: row.shot,
      id: row.id,
      custom_id: row.custom_id,
      expected_probe_clip: row.expected_probe_clip,
      expected_probe_absolute: path.join(root, row.expected_probe_clip),
      expected_probe_basename: expectedBase,
      expected_probe_stem: expectedStem,
      parent_expected_clip: row.parent_expected_clip,
    };
  });
}

function scoreFile(file, expected) {
  if (!file.supported || !file.video_probe?.ok) return null;
  const stem = normalize(file.stem);
  const basename = normalize(file.basename);
  const expectedStem = normalize(expected.expected_probe_stem);
  const customId = normalize(expected.custom_id);
  if (!stem.includes("_probe")) return null;
  if (basename === normalize(expected.expected_probe_basename)) return { score: 100, reason: "exact_expected_probe_basename" };
  if (stem === expectedStem) return { score: 95, reason: "exact_expected_probe_stem" };
  if (stem === customId) return { score: 94, reason: "exact_custom_id" };
  if (stem.startsWith(`${customId}_`) || stem.startsWith(`${customId}-`)) return { score: 88, reason: "starts_with_custom_id" };
  if (stem.startsWith(`${expectedStem}_`) || stem.startsWith(`${expectedStem}-`)) return { score: 86, reason: "starts_with_expected_probe_stem" };
  if (stem.includes(customId)) return { score: 78, reason: "contains_custom_id" };
  if (stem.includes(expectedStem)) return { score: 74, reason: "contains_expected_probe_stem" };
  return null;
}

function bestMatch(file, rows) {
  const matches = rows
    .map((row) => ({ row, match: scoreFile(file, row) }))
    .filter((item) => item.match)
    .sort((a, b) => b.match.score - a.match.score || a.row.order - b.row.order);
  if (!matches.length) return { status: "unmatched" };
  const topScore = matches[0].match.score;
  const top = matches.filter((item) => item.match.score === topScore);
  if (top.length > 1) {
    return {
      status: "ambiguous_file",
      score: topScore,
      candidates: top.map((item) => ({ order: item.row.order, shot: item.row.shot, reason: item.match.reason })),
    };
  }
  return { status: "matched", row: top[0].row, score: topScore, reason: top[0].match.reason };
}

function plan(files, expected, options) {
  const byExpected = new Map();
  const unmatched = [];
  const ambiguous = [];
  const unsupported = files.filter((file) => !file.supported);
  const invalid = files.filter((file) => file.supported && !file.video_probe?.ok);
  for (const file of files.filter((item) => item.supported && item.video_probe?.ok)) {
    const best = bestMatch(file, expected);
    if (best.status === "matched") {
      const list = byExpected.get(best.row.custom_id) || [];
      list.push({ file, score: best.score, reason: best.reason, row: best.row });
      byExpected.set(best.row.custom_id, list);
    } else if (best.status === "ambiguous_file") {
      ambiguous.push({ file, ...best });
    } else {
      unmatched.push(file);
    }
  }
  const rows = expected.map((row) => {
    const candidates = byExpected.get(row.custom_id) || [];
    const targetExists = fs.existsSync(row.expected_probe_absolute);
    const targetDigest = targetExists ? digest(row.expected_probe_absolute) : null;
    const base = {
      order: row.order,
      shot: row.shot,
      id: row.id,
      custom_id: row.custom_id,
      expected_probe_clip: row.expected_probe_clip,
      parent_expected_clip: row.parent_expected_clip,
      target_exists: targetExists,
      target_digest: targetDigest,
      candidates: candidates.map((candidate) => ({
        file: rel(candidate.file.absolute),
        relative_to_input: candidate.file.relative_to_input,
        score: candidate.score,
        reason: candidate.reason,
        video_probe: candidate.file.video_probe,
        source_digest: digest(candidate.file.absolute),
      })),
    };
    if (!candidates.length) return { ...base, status: "missing_source" };
    if (candidates.length > 1) return { ...base, status: "ambiguous_sources" };
    if (targetExists && !options.force) return { ...base, status: "target_exists" };
    return { ...base, status: options.apply ? "ready_to_copy" : "would_copy" };
  });
  return {
    rows,
    unsupported,
    invalid,
    unmatched,
    ambiguous,
  };
}

function applyCopies(rows) {
  let copied = 0;
  for (const row of rows) {
    if (row.status !== "ready_to_copy") continue;
    const source = row.candidates[0].file;
    const target = path.join(root, row.expected_probe_clip);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(root, source), target);
    copied += 1;
  }
  return copied;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const expected = expectedRows();
  const files = scanFiles(options.inputDir);
  const ingestPlan = plan(files, expected, options);
  const copied = options.apply ? applyCopies(ingestPlan.rows) : 0;
  const blockingRows = ingestPlan.rows.filter((row) => !["would_copy", "ready_to_copy"].includes(row.status));
  const problems = [
    ...ingestPlan.unsupported.map((file) => `${file.relative_to_input}: unsupported return format ${file.ext}; mp4 required`),
    ...ingestPlan.invalid.map((file) => `${file.relative_to_input}: invalid mp4 ${file.video_probe?.issue || "unknown"}`),
    ...ingestPlan.ambiguous.map((item) => `${item.file.relative_to_input}: ambiguous match ${item.candidates.map((candidate) => candidate.shot).join(", ")}`),
    ...blockingRows.map((row) => `${row.custom_id}: ${row.status}`),
  ];
  const result = {
    date: "2026-08-01",
    mode: options.apply ? "apply" : "dry_run",
    decision: problems.length ? "motion_probe_ingest_blocked" : (options.apply ? "motion_probe_ingest_applied" : "motion_probe_ingest_dry_run_ready"),
    input_dir: rel(options.inputDir),
    expected_probe_rows: expected.length,
    files_scanned: files.length,
    unsupported_video_files: ingestPlan.unsupported.length,
    invalid_video_files: ingestPlan.invalid.length,
    unmatched_video_files: ingestPlan.unmatched.length,
    ambiguous_video_files: ingestPlan.ambiguous.length,
    would_copy: ingestPlan.rows.filter((row) => row.status === "would_copy").length,
    copied,
    missing_sources: ingestPlan.rows.filter((row) => row.status === "missing_source").length,
    target_exists: ingestPlan.rows.filter((row) => row.status === "target_exists").length,
    problems,
    rows: ingestPlan.rows,
  };
  writeJson(options.reportJson, result);
  writeText(options.reportMd, [
    "# Scene09 V3 Motion Probe Ingest Report",
    "",
    `Decision: ${result.decision}`,
    `Mode: ${result.mode}`,
    `Input: ${result.input_dir}`,
    `Expected probe rows: ${result.expected_probe_rows}`,
    `Files scanned: ${result.files_scanned}`,
    `Would copy: ${result.would_copy}`,
    `Copied: ${result.copied}`,
    "",
    "## Problems",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n"));
  console.log(JSON.stringify({
    decision: result.decision,
    mode: result.mode,
    expected_probe_rows: result.expected_probe_rows,
    files_scanned: result.files_scanned,
    would_copy: result.would_copy,
    copied: result.copied,
    problems: problems.length,
    report_json: rel(options.reportJson),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
