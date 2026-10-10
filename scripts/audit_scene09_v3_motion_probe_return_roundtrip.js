#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const mapPath = path.join(pkgDir, "motion_probe_return_intake/expected_probe_map.csv");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(outDir, `scene09_v3_motion_probe_return_roundtrip_audit_${date}.json`);
const outMd = path.join(outDir, `scene09_v3_motion_probe_return_roundtrip_audit_${date}.md`);
const packageJson = path.join(pkgDir, "motion_probe_return_roundtrip_audit.json");
const packageMd = path.join(pkgDir, "motion_probe_return_roundtrip_audit.md");

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
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

function readMapRows() {
  const rows = csvRows(readText(mapPath));
  const header = rows[0] || [];
  return rows.slice(1).map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] || ""])));
}

function safeName(value) {
  return String(value).replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function createTinyMp4(file) {
  const result = cp.spawnSync("ffmpeg", [
    "-y",
    "-f", "lavfi",
    "-i", "color=c=black:s=160x90:r=12:d=0.5",
    "-an",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    file,
  ], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(`ffmpeg fixture generation failed: ${result.error?.message || result.stderr || result.status}`);
  }
}

function createFixture(rows, strategy) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `scene09_probe_roundtrip_${strategy}.`));
  const fixture = path.join(tmp, "__valid_probe_fixture.mp4");
  createTinyMp4(fixture);
  for (const row of rows) {
    const filename = strategy === "expected_probe_filename"
      ? row.expected_probe_filename
      : `${safeName(row.custom_id)}_provider_return.mp4`;
    fs.copyFileSync(fixture, path.join(tmp, filename));
  }
  fs.unlinkSync(fixture);
  return tmp;
}

function createNestedFixture(rows) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_probe_roundtrip_nested."));
  const fixture = path.join(tmp, "__valid_probe_fixture.mp4");
  createTinyMp4(fixture);
  for (let batchIndex = 0; batchIndex < 7; batchIndex += 1) {
    const start = batchIndex * 6;
    const end = start + 6;
    const first = String(start + 1).padStart(3, "0");
    const last = String(end).padStart(3, "0");
    const returnDir = path.join(tmp, `probe_batch_${String(batchIndex + 1).padStart(3, "0")}_shots_${first}-${last}_returns`, "returned_mp4");
    fs.mkdirSync(returnDir, { recursive: true });
    for (const row of rows.slice(start, end)) {
      fs.copyFileSync(fixture, path.join(returnDir, row.expected_probe_filename));
    }
  }
  fs.unlinkSync(fixture);
  return tmp;
}

function createBareShotProbeFixture(rows) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_probe_roundtrip_bare_reject."));
  const fixture = path.join(tmp, "__valid_probe_fixture.mp4");
  createTinyMp4(fixture);
  for (const row of rows.slice(0, 6)) {
    fs.copyFileSync(fixture, path.join(tmp, `${safeName(row.shot)}_probe.mp4`));
  }
  fs.unlinkSync(fixture);
  return tmp;
}

function createFullDurationNameFixture(rows) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_probe_roundtrip_full_name_reject."));
  const fixture = path.join(tmp, "__valid_probe_fixture.mp4");
  createTinyMp4(fixture);
  for (const row of rows.slice(0, 6)) {
    fs.copyFileSync(fixture, path.join(tmp, path.basename(row.parent_expected_clip)));
  }
  fs.unlinkSync(fixture);
  return tmp;
}

function createInvalidFixture(rows) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_probe_roundtrip_invalid_reject."));
  fs.writeFileSync(path.join(tmp, rows[0].expected_probe_filename), "not a real mp4\n");
  return tmp;
}

function createUnsupportedFixture(rows) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_probe_roundtrip_unsupported_reject."));
  const fixture = path.join(tmp, "__valid_probe_fixture.mp4");
  createTinyMp4(fixture);
  fs.copyFileSync(fixture, path.join(tmp, rows[0].expected_probe_filename.replace(/\.mp4$/i, ".mov")));
  fs.unlinkSync(fixture);
  return tmp;
}

function runIngest(strategy, inputDir) {
  const reportJson = path.join(outDir, `scene09_v3_motion_probe_return_roundtrip_${strategy}_ingest_report_${date}.json`);
  const reportMd = path.join(outDir, `scene09_v3_motion_probe_return_roundtrip_${strategy}_ingest_report_${date}.md`);
  const result = cp.spawnSync(process.execPath, [
    "scripts/ingest_scene09_v3_motion_probe_clips.js",
    "--input",
    inputDir,
    "--dry-run",
    "--force",
    "--report-json",
    reportJson,
    "--report-md",
    reportMd,
  ], {
    cwd: root,
    encoding: "utf8",
  });
  const report = fs.existsSync(reportJson) ? JSON.parse(fs.readFileSync(reportJson, "utf8")) : null;
  return {
    strategy,
    input_dir: inputDir,
    status: result.status,
    ok: result.status === 0,
    stdout_tail: (result.stdout || "").trim().split(/\n/).slice(-20).join("\n"),
    stderr_tail: (result.stderr || "").trim().split(/\n/).slice(-20).join("\n"),
    report_json: rel(reportJson),
    report_md: rel(reportMd),
    report,
  };
}

function auditPositiveScenario(scenario, rows) {
  const problems = [];
  const report = scenario.report;
  if (!scenario.ok) problems.push(`${scenario.strategy}: ingest command exited ${scenario.status}`);
  if (!report) {
    problems.push(`${scenario.strategy}: missing ingest report`);
    return problems;
  }
  if (report.decision !== "motion_probe_ingest_dry_run_ready") problems.push(`${scenario.strategy}: decision ${report.decision}`);
  if (report.expected_probe_rows !== 42) problems.push(`${scenario.strategy}: expected_probe_rows ${report.expected_probe_rows}`);
  if (report.files_scanned !== 42) problems.push(`${scenario.strategy}: files_scanned ${report.files_scanned}`);
  if (report.would_copy !== 42) problems.push(`${scenario.strategy}: would_copy ${report.would_copy}`);
  if (report.copied !== 0) problems.push(`${scenario.strategy}: copied ${report.copied}; dry-run must not copy`);
  if (report.unsupported_video_files !== 0) problems.push(`${scenario.strategy}: unsupported_video_files ${report.unsupported_video_files}`);
  if (report.invalid_video_files !== 0) problems.push(`${scenario.strategy}: invalid_video_files ${report.invalid_video_files}`);
  if (report.ambiguous_video_files !== 0) problems.push(`${scenario.strategy}: ambiguous_video_files ${report.ambiguous_video_files}`);
  if (report.missing_sources !== 0) problems.push(`${scenario.strategy}: missing_sources ${report.missing_sources}`);

  const expectedByCustomId = new Map(rows.map((row) => [row.custom_id, row]));
  const seen = new Set();
  for (const row of report.rows || []) {
    if (row.status !== "would_copy") problems.push(`${scenario.strategy}: ${row.custom_id} status ${row.status}`);
    if (seen.has(row.custom_id)) problems.push(`${scenario.strategy}: duplicate custom_id ${row.custom_id}`);
    seen.add(row.custom_id);
    const expected = expectedByCustomId.get(row.custom_id);
    if (!expected) {
      problems.push(`${scenario.strategy}: unexpected custom_id ${row.custom_id}`);
    } else {
      if (row.expected_probe_clip !== expected.expected_probe_clip) problems.push(`${scenario.strategy}: ${row.custom_id} expected_probe_clip mismatch`);
      if (!String(row.expected_probe_clip || "").includes("/motion_probes/")) problems.push(`${scenario.strategy}: ${row.custom_id} not mapped to motion_probes`);
      if (!String(row.expected_probe_clip || "").endsWith("_probe.mp4")) problems.push(`${scenario.strategy}: ${row.custom_id} not mapped to _probe.mp4`);
      if ((row.candidates || []).length !== 1) problems.push(`${scenario.strategy}: ${row.custom_id} candidates ${(row.candidates || []).length}`);
    }
  }
  if (seen.size !== 42) problems.push(`${scenario.strategy}: report unique custom_ids ${seen.size}`);
  return problems;
}

function auditBlockedScenario(scenario, expected) {
  const problems = [];
  const report = scenario.report;
  if (scenario.ok) problems.push(`${scenario.strategy}: ingest command should exit nonzero`);
  if (!report) {
    problems.push(`${scenario.strategy}: missing ingest report`);
    return problems;
  }
  for (const [key, value] of Object.entries(expected)) {
    if (report[key] !== value) problems.push(`${scenario.strategy}: ${key} ${report[key]} !== ${value}`);
  }
  if (report.copied !== 0) problems.push(`${scenario.strategy}: copied ${report.copied}; blocked dry-run must not copy`);
  return problems;
}

function main() {
  if (!fs.existsSync(mapPath)) throw new Error(`Missing expected probe map: ${mapPath}`);
  const rows = readMapRows();
  const problems = [];
  const scenarios = [];
  if (rows.length !== 42) problems.push(`expected probe map rows=${rows.length}, expected 42`);

  for (const strategy of ["expected_probe_filename", "custom_id_prefix"]) {
    const inputDir = createFixture(rows, strategy);
    const scenario = runIngest(strategy, inputDir);
    scenario.problems = auditPositiveScenario(scenario, rows);
    problems.push(...scenario.problems);
    scenarios.push(scenario);
  }

  const nestedScenario = runIngest("nested_intake_root_expected_probe_filenames", createNestedFixture(rows));
  nestedScenario.problems = auditPositiveScenario(nestedScenario, rows);
  problems.push(...nestedScenario.problems);
  scenarios.push(nestedScenario);

  const bareScenario = runIngest("bare_shot_probe_name_rejected", createBareShotProbeFixture(rows));
  bareScenario.problems = auditBlockedScenario(bareScenario, {
    decision: "motion_probe_ingest_blocked",
    files_scanned: 6,
    would_copy: 0,
    missing_sources: 42,
    unmatched_video_files: 6,
  });
  problems.push(...bareScenario.problems);
  scenarios.push(bareScenario);

  const fullNameScenario = runIngest("full_duration_clip_name_rejected", createFullDurationNameFixture(rows));
  fullNameScenario.problems = auditBlockedScenario(fullNameScenario, {
    decision: "motion_probe_ingest_blocked",
    files_scanned: 6,
    would_copy: 0,
    missing_sources: 42,
    unmatched_video_files: 6,
  });
  problems.push(...fullNameScenario.problems);
  scenarios.push(fullNameScenario);

  const invalidScenario = runIngest("invalid_mp4_rejected", createInvalidFixture(rows));
  invalidScenario.problems = auditBlockedScenario(invalidScenario, {
    decision: "motion_probe_ingest_blocked",
    files_scanned: 1,
    would_copy: 0,
    invalid_video_files: 1,
    missing_sources: 42,
  });
  problems.push(...invalidScenario.problems);
  scenarios.push(invalidScenario);

  const unsupportedScenario = runIngest("unsupported_format_rejected", createUnsupportedFixture(rows));
  unsupportedScenario.problems = auditBlockedScenario(unsupportedScenario, {
    decision: "motion_probe_ingest_blocked",
    files_scanned: 1,
    would_copy: 0,
    unsupported_video_files: 1,
    missing_sources: 42,
  });
  problems.push(...unsupportedScenario.problems);
  scenarios.push(unsupportedScenario);

  const result = {
    date,
    decision: problems.length ? "motion_probe_return_roundtrip_failed" : "motion_probe_return_roundtrip_passed",
    expected_probe_map: rel(mapPath),
    scenarios: scenarios.map((scenario) => ({
      strategy: scenario.strategy,
      input_dir: scenario.input_dir,
      ok: scenario.ok,
      report_json: scenario.report_json,
      report_md: scenario.report_md,
      decision: scenario.report?.decision || "missing_report",
      expected_probe_rows: scenario.report?.expected_probe_rows || 0,
      files_scanned: scenario.report?.files_scanned || 0,
      would_copy: scenario.report?.would_copy || 0,
      copied: scenario.report?.copied || 0,
      missing_sources: scenario.report?.missing_sources || 0,
      unsupported_video_files: scenario.report?.unsupported_video_files || 0,
      invalid_video_files: scenario.report?.invalid_video_files || 0,
      unmatched_video_files: scenario.report?.unmatched_video_files || 0,
      ambiguous_video_files: scenario.report?.ambiguous_video_files || 0,
      problems: scenario.problems,
    })),
    problems,
    notes: [
      "Roundtrip fixtures are tiny ffmpeg-generated valid .mp4 files in a temporary directory, so ingest exercises filename matching and ffprobe validation without using production clips.",
      "The test runs ingest in dry-run mode with --force, so it never copies fixture videos into motion_probes.",
      "Positive scenarios prove exact expected probe filenames, custom_id-prefixed filenames, and nested returned_mp4 folders map 42/42 rows.",
      "Negative scenarios prove bare shot probe names, full-duration clip names, invalid .mp4 bytes, and non-mp4 video returns are blocked.",
      "Real returned motion probes still require visual motion QA before any full-duration generation release.",
    ],
  };
  const md = [
    "# Scene09 V3 Motion Probe Return Roundtrip Audit",
    "",
    `Date: ${date}`,
    `Decision: ${result.decision}`,
    "",
    "## Scenario Results",
    "",
    "| Strategy | Decision | Files | Would Copy | Copied | Missing | Unsupported | Invalid | Unmatched | Ambiguous |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...result.scenarios.map((scenario) => [
      `| ${scenario.strategy}`,
      scenario.decision,
      scenario.files_scanned,
      scenario.would_copy,
      scenario.copied,
      scenario.missing_sources,
      scenario.unsupported_video_files,
      scenario.invalid_video_files,
      scenario.unmatched_video_files,
      `${scenario.ambiguous_video_files} |`,
    ].join(" | ")),
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Notes",
    "",
    ...result.notes.map((note) => `- ${note}`),
    "",
  ].join("\n");

  writeJson(outJson, result);
  writeText(outMd, `${md}\n`);
  writeJson(packageJson, {
    ...result,
    production_report_json: rel(outJson),
    production_report_md: rel(outMd),
  });
  writeText(packageMd, `${md}\n`);

  console.log(JSON.stringify({
    date,
    decision: result.decision,
    scenarios: result.scenarios.map((scenario) => ({
      strategy: scenario.strategy,
      decision: scenario.decision,
      files_scanned: scenario.files_scanned,
      would_copy: scenario.would_copy,
      copied: scenario.copied,
      unsupported_video_files: scenario.unsupported_video_files,
      invalid_video_files: scenario.invalid_video_files,
      unmatched_video_files: scenario.unmatched_video_files,
      problems: scenario.problems.length,
    })),
    problems: problems.length,
    report_json: rel(outJson),
    package_report: rel(packageMd),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
