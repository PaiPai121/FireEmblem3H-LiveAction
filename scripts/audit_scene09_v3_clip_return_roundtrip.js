#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const mapPath = path.join(pkgDir, "clip_return_intake/expected_clip_map.csv");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(outDir, "scene09_v3_clip_return_roundtrip_audit_2026-08-01.json");
const outMd = path.join(outDir, "scene09_v3_clip_return_roundtrip_audit_2026-08-01.md");
const packageJson = path.join(pkgDir, "clip_return_roundtrip_audit.json");
const packageMd = path.join(pkgDir, "clip_return_roundtrip_audit.md");

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
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `scene09_clip_roundtrip_${strategy}.`));
  const fixture = path.join(tmp, "__valid_roundtrip_fixture.mp4");
  createTinyMp4(fixture);
  for (const row of rows) {
    const filename = strategy === "expected_filename"
      ? row.expected_filename
      : `${safeName(row.custom_id)}_provider_return.mp4`;
    fs.copyFileSync(fixture, path.join(tmp, filename));
  }
  fs.unlinkSync(fixture);
  return tmp;
}

function createLooseFixture(rows) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_clip_roundtrip_loose_reject."));
  const fixture = path.join(tmp, "__valid_roundtrip_fixture.mp4");
  createTinyMp4(fixture);
  for (const row of rows.slice(0, 6)) {
    fs.copyFileSync(fixture, path.join(tmp, `${safeName(row.shot)}.mp4`));
  }
  fs.unlinkSync(fixture);
  return tmp;
}

function createNestedIntakeRootFixture(rows) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_clip_roundtrip_nested_intake_root."));
  const fixture = path.join(tmp, "__valid_roundtrip_fixture.mp4");
  createTinyMp4(fixture);
  for (let batchIndex = 0; batchIndex < 7; batchIndex += 1) {
    const start = batchIndex * 6;
    const end = start + 6;
    const batchRows = rows.slice(start, end);
    const first = String(start + 1).padStart(3, "0");
    const last = String(end).padStart(3, "0");
    const returnDir = path.join(tmp, `batch_${String(batchIndex + 1).padStart(3, "0")}_shots_${first}-${last}_returns`, "returned_mp4");
    fs.mkdirSync(returnDir, { recursive: true });
    for (const row of batchRows) {
      fs.copyFileSync(fixture, path.join(returnDir, row.expected_filename));
    }
  }
  fs.unlinkSync(fixture);
  return tmp;
}

function createInvalidFixture(rows) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_clip_roundtrip_invalid_reject."));
  fs.writeFileSync(path.join(tmp, rows[0].expected_filename), "not a real mp4\n");
  return tmp;
}

function createUnsupportedFixture(rows) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_clip_roundtrip_unsupported_reject."));
  const fixture = path.join(tmp, "__valid_roundtrip_fixture.mp4");
  createTinyMp4(fixture);
  fs.copyFileSync(fixture, path.join(tmp, rows[0].expected_filename.replace(/\.mp4$/i, ".mov")));
  fs.unlinkSync(fixture);
  return tmp;
}

function runIngest(strategy, inputDir) {
  const reportJson = path.join(outDir, `scene09_v3_clip_return_roundtrip_${strategy}_ingest_report_2026-08-01.json`);
  const reportMd = path.join(outDir, `scene09_v3_clip_return_roundtrip_${strategy}_ingest_report_2026-08-01.md`);
  const result = cp.spawnSync(process.execPath, [
    "scripts/ingest_scene09_v3_generated_clips.js",
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

function auditScenario(scenario, rows) {
  const problems = [];
  const report = scenario.report;
  if (!scenario.ok) problems.push(`${scenario.strategy}: ingest command exited ${scenario.status}`);
  if (!report) {
    problems.push(`${scenario.strategy}: missing ingest report`);
    return problems;
  }
  if (report.decision !== "clip_ingest_dry_run_ready_to_apply") problems.push(`${scenario.strategy}: decision ${report.decision}`);
  if (report.total_shots !== 42) problems.push(`${scenario.strategy}: total_shots ${report.total_shots}`);
  if (report.scanned_video_files !== 42) problems.push(`${scenario.strategy}: scanned_video_files ${report.scanned_video_files}`);
  if (report.unique_matched_shots !== 42) problems.push(`${scenario.strategy}: unique_matched_shots ${report.unique_matched_shots}`);
  if (report.would_copy !== 42) problems.push(`${scenario.strategy}: would_copy ${report.would_copy}`);
  if (report.copied !== 0) problems.push(`${scenario.strategy}: copied ${report.copied}; dry-run must not copy`);
  if (report.missing_source_shots !== 0) problems.push(`${scenario.strategy}: missing_source_shots ${report.missing_source_shots}`);
  if (report.blocked_shots !== 0) problems.push(`${scenario.strategy}: blocked_shots ${report.blocked_shots}`);
  if ((report.ambiguous_files || []).length !== 0) problems.push(`${scenario.strategy}: ambiguous_files ${(report.ambiguous_files || []).length}`);
  if ((report.unmatched_mp4_files || []).length !== 0) problems.push(`${scenario.strategy}: unmatched_mp4_files ${(report.unmatched_mp4_files || []).length}`);
  if ((report.invalid_video_files || []).length !== 0) problems.push(`${scenario.strategy}: invalid_video_files ${(report.invalid_video_files || []).length}`);

  const expectedByCustomId = new Map(rows.map((row) => [row.custom_id, row]));
  const seen = new Set();
  for (const row of report.rows || []) {
    if (row.ingest_status !== "would_copy") problems.push(`${scenario.strategy}: ${row.custom_id} status ${row.ingest_status}`);
    if (!row.selected_source_relative_to_input) problems.push(`${scenario.strategy}: ${row.custom_id} missing selected source`);
    if (seen.has(row.custom_id)) problems.push(`${scenario.strategy}: duplicate custom_id ${row.custom_id}`);
    seen.add(row.custom_id);
    const expected = expectedByCustomId.get(row.custom_id);
    if (!expected) {
      problems.push(`${scenario.strategy}: unexpected custom_id ${row.custom_id}`);
    } else if (row.expected_clip !== expected.expected_clip) {
      problems.push(`${scenario.strategy}: ${row.custom_id} expected_clip mismatch ${row.expected_clip} != ${expected.expected_clip}`);
    }
  }
  if (seen.size !== 42) problems.push(`${scenario.strategy}: report row unique custom_ids ${seen.size}`);
  return problems;
}

function auditLooseRejection(scenario) {
  const problems = [];
  const report = scenario.report;
  if (!scenario.ok) problems.push("loose_shot_name_rejected: ingest command should exit 0 with unmatched loose files");
  if (!report) {
    problems.push("loose_shot_name_rejected: missing ingest report");
    return problems;
  }
  if (report.decision !== "clip_ingest_no_matching_sources") problems.push(`loose_shot_name_rejected: decision ${report.decision}`);
  if (report.scanned_video_files !== 6) problems.push(`loose_shot_name_rejected: scanned_video_files ${report.scanned_video_files}`);
  if (report.unique_matched_shots !== 0) problems.push(`loose_shot_name_rejected: unique_matched_shots ${report.unique_matched_shots}`);
  if (report.would_copy !== 0) problems.push(`loose_shot_name_rejected: would_copy ${report.would_copy}`);
  if ((report.unmatched_mp4_files || []).length !== 6) problems.push(`loose_shot_name_rejected: unmatched_mp4_files ${(report.unmatched_mp4_files || []).length}`);
  if ((report.invalid_video_files || []).length !== 0) problems.push(`loose_shot_name_rejected: invalid_video_files ${(report.invalid_video_files || []).length}`);
  return problems;
}

function auditInvalidRejection(scenario) {
  const problems = [];
  const report = scenario.report;
  if (scenario.ok) problems.push("invalid_mp4_rejected: ingest command should exit nonzero for invalid video content");
  if (!report) {
    problems.push("invalid_mp4_rejected: missing ingest report");
    return problems;
  }
  if (report.decision !== "clip_ingest_needs_filename_resolution") problems.push(`invalid_mp4_rejected: decision ${report.decision}`);
  if (report.scanned_video_files !== 1) problems.push(`invalid_mp4_rejected: scanned_video_files ${report.scanned_video_files}`);
  if (report.unique_matched_shots !== 0) problems.push(`invalid_mp4_rejected: unique_matched_shots ${report.unique_matched_shots}`);
  if (report.would_copy !== 0) problems.push(`invalid_mp4_rejected: would_copy ${report.would_copy}`);
  if ((report.invalid_video_files || []).length !== 1) problems.push(`invalid_mp4_rejected: invalid_video_files ${(report.invalid_video_files || []).length}`);
  if ((report.invalid_video_files || [])[0]?.video_probe?.issue !== "ffprobe_failed") {
    problems.push(`invalid_mp4_rejected: invalid issue ${(report.invalid_video_files || [])[0]?.video_probe?.issue || "missing"}`);
  }
  return problems;
}

function auditUnsupportedRejection(scenario) {
  const problems = [];
  const report = scenario.report;
  if (scenario.ok) problems.push("unsupported_format_rejected: ingest command should exit nonzero for non-mp4 provider returns");
  if (!report) {
    problems.push("unsupported_format_rejected: missing ingest report");
    return problems;
  }
  if (report.decision !== "clip_ingest_needs_filename_resolution") problems.push(`unsupported_format_rejected: decision ${report.decision}`);
  if (report.scanned_video_files !== 1) problems.push(`unsupported_format_rejected: scanned_video_files ${report.scanned_video_files}`);
  if (report.unique_matched_shots !== 0) problems.push(`unsupported_format_rejected: unique_matched_shots ${report.unique_matched_shots}`);
  if (report.would_copy !== 0) problems.push(`unsupported_format_rejected: would_copy ${report.would_copy}`);
  if ((report.unsupported_video_files || []).length !== 1) problems.push(`unsupported_format_rejected: unsupported_video_files ${(report.unsupported_video_files || []).length}`);
  if ((report.unsupported_video_files || [])[0]?.ext !== ".mov") {
    problems.push(`unsupported_format_rejected: unsupported ext ${(report.unsupported_video_files || [])[0]?.ext || "missing"}`);
  }
  return problems;
}

function main() {
  if (!fs.existsSync(mapPath)) throw new Error(`Missing expected clip map: ${mapPath}`);
  const rows = readMapRows();
  const problems = [];
  const scenarios = [];
  if (rows.length !== 42) problems.push(`expected clip map rows=${rows.length}, expected 42`);

  for (const strategy of ["expected_filename", "custom_id_prefix"]) {
    const inputDir = createFixture(rows, strategy);
    const scenario = runIngest(strategy, inputDir);
    scenario.problems = auditScenario(scenario, rows);
    problems.push(...scenario.problems);
    scenarios.push(scenario);
  }

  const nestedInputDir = createNestedIntakeRootFixture(rows);
  const nestedScenario = runIngest("nested_intake_root_expected_filenames", nestedInputDir);
  nestedScenario.problems = auditScenario(nestedScenario, rows);
  problems.push(...nestedScenario.problems);
  scenarios.push(nestedScenario);

  const looseInputDir = createLooseFixture(rows);
  const looseScenario = runIngest("loose_shot_name_rejected", looseInputDir);
  looseScenario.problems = auditLooseRejection(looseScenario);
  problems.push(...looseScenario.problems);
  scenarios.push(looseScenario);

  const invalidInputDir = createInvalidFixture(rows);
  const invalidScenario = runIngest("invalid_mp4_rejected", invalidInputDir);
  invalidScenario.problems = auditInvalidRejection(invalidScenario);
  problems.push(...invalidScenario.problems);
  scenarios.push(invalidScenario);

  const unsupportedInputDir = createUnsupportedFixture(rows);
  const unsupportedScenario = runIngest("unsupported_format_rejected", unsupportedInputDir);
  unsupportedScenario.problems = auditUnsupportedRejection(unsupportedScenario);
  problems.push(...unsupportedScenario.problems);
  scenarios.push(unsupportedScenario);

  const result = {
    date,
    decision: problems.length ? "clip_return_roundtrip_failed" : "clip_return_roundtrip_passed",
    expected_clip_map: rel(mapPath),
    scenarios: scenarios.map((scenario) => ({
      strategy: scenario.strategy,
      input_dir: scenario.input_dir,
      ok: scenario.ok,
      report_json: scenario.report_json,
      report_md: scenario.report_md,
      decision: scenario.report?.decision || "missing_report",
      scanned_video_files: scenario.report?.scanned_video_files || 0,
      unique_matched_shots: scenario.report?.unique_matched_shots || 0,
      would_copy: scenario.report?.would_copy || 0,
      copied: scenario.report?.copied || 0,
      missing_source_shots: scenario.report?.missing_source_shots || 0,
      blocked_shots: scenario.report?.blocked_shots || 0,
      ambiguous_files: scenario.report?.ambiguous_files?.length || 0,
      unsupported_video_files: scenario.report?.unsupported_video_files?.length || 0,
      invalid_video_files: scenario.report?.invalid_video_files?.length || 0,
      unmatched_mp4_files: scenario.report?.unmatched_mp4_files?.length || 0,
      problems: scenario.problems,
    })),
    problems,
    notes: [
      "Roundtrip fixtures are tiny ffmpeg-generated valid .mp4 files in a temporary directory, so ingest exercises filename matching and ffprobe validation.",
      "The test runs ingest in dry-run mode with --force, so it never copies placeholders into expected_clip paths.",
      "The nested-intake-root scenario distributes all 42 expected filenames across 7 returned_mp4 folders and passes the parent root to ingest, proving whole-package recursive intake works.",
      "The invalid-mp4 scenario writes a correctly named text file with an .mp4 suffix and expects ingest to reject it before matching.",
      "The unsupported-format scenario writes a valid video with a .mov suffix and expects ingest to reject it until it is redownloaded or transcoded to .mp4.",
      "Real generated clips still require file QA, extracted motion-review frames, and Codex motion self-audit.",
    ],
  };

  const md = [
    "# Scene09 V3 Clip Return Roundtrip Audit",
    "",
    `Date: ${date}`,
    `Decision: ${result.decision}`,
    "",
    "## Scope",
    "",
    "- Simulate provider returns named by exact expected filename.",
    "- Simulate provider returns named by `custom_id` prefix.",
    "- Simulate whole-package recursive intake with all 7 returned batch folders under one parent root.",
    "- Verify each positive return strategy dry-runs to 42 unique shot matches without copying files.",
    "- Verify bare shot-name filenames are rejected by default so stale or wrong-version clips are not auto-ingested.",
    "- Verify a correctly named but invalid `.mp4` is rejected before matching.",
    "- Verify a non-mp4 provider return is rejected even when it contains valid video bytes.",
    "",
    "## Scenario Results",
    "",
    "| Strategy | Decision | Scanned | Matched | Would Copy | Copied | Missing | Blocked | Ambiguous | Unsupported | Invalid | Unmatched |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...result.scenarios.map((scenario) => [
      `| ${scenario.strategy}`,
      scenario.decision,
      scenario.scanned_video_files,
      scenario.unique_matched_shots,
      scenario.would_copy,
      scenario.copied,
      scenario.missing_source_shots,
      scenario.blocked_shots,
      scenario.ambiguous_files,
      scenario.unsupported_video_files,
      scenario.invalid_video_files,
      `${scenario.unmatched_mp4_files} |`,
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
        unique_matched_shots: scenario.unique_matched_shots,
        would_copy: scenario.would_copy,
        copied: scenario.copied,
        unsupported_video_files: scenario.unsupported_video_files,
        invalid_video_files: scenario.invalid_video_files,
        problems: scenario.problems.length,
    })),
    problems: problems.length,
    report_json: rel(outJson),
    package_report: rel(packageMd),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
