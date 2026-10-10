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
const manifestPath = path.join(packageDir, "package_manifest.json");
const outJson = path.join(reportDir, `scene09_v3_final_concat_inputs_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_final_concat_inputs_contract_${date}.md`);
const packageOutJson = path.join(packageDir, "final_concat_inputs_contract.json");
const packageOutMd = path.join(packageDir, "final_concat_inputs_contract.md");

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

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const shots = [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const expected = Number(manifest.total_shots || shots.length);
  const expectedDuration = Number(manifest.total_duration_seconds || 0);
  const problems = [];
  const seenOrders = new Set();
  const seenExpectedClips = new Set();
  const rows = [];

  if (expected !== shots.length) problems.push(`total_shots ${expected} does not match shots length ${shots.length}`);
  if (shots.length !== 42) problems.push(`shots length ${shots.length} does not match 42`);

  let durationSum = 0;
  for (let index = 0; index < shots.length; index += 1) {
    const shot = shots[index];
    const order = Number(shot.order);
    const expectedOrder = index + 1;
    const duration = Number(shot.duration_seconds || 0);
    const expectedClip = String(shot.expected_clip || "");
    const expectedBasename = `${String(order).padStart(2, "0")}_${shot.shot}.mp4`;
    const actualBasename = path.basename(expectedClip);
    const rowProblems = [];
    durationSum += duration;

    if (order !== expectedOrder) rowProblems.push(`order ${order} is not contiguous expected ${expectedOrder}`);
    if (seenOrders.has(order)) rowProblems.push(`duplicate order ${order}`);
    seenOrders.add(order);
    if (!shot.id) rowProblems.push("missing shot id");
    if (!shot.shot) rowProblems.push("missing shot name");
    if (!duration) rowProblems.push("missing duration_seconds");
    if (!expectedClip) rowProblems.push("missing expected_clip");
    if (path.isAbsolute(expectedClip)) rowProblems.push("expected_clip must be project-relative");
    if (expectedClip.includes("/delivery/scene09_v3_monitor_handoff_package_2026-07-27/")) {
      rowProblems.push("expected_clip incorrectly resolves under delivery package");
    }
    if (!expectedClip.startsWith("episodes/EP02/video_outputs/scene09_v3_attrition/")) {
      rowProblems.push("expected_clip is outside scene09_v3_attrition output directory");
    }
    if (path.extname(expectedClip).toLowerCase() !== ".mp4") rowProblems.push("expected_clip is not .mp4");
    if (actualBasename !== expectedBasename) {
      rowProblems.push(`expected_clip basename ${actualBasename || "missing"} does not match ${expectedBasename}`);
    }
    if (seenExpectedClips.has(expectedClip)) rowProblems.push(`duplicate expected_clip ${expectedClip}`);
    seenExpectedClips.add(expectedClip);

    for (const problem of rowProblems) problems.push(`${shot.shot || `row_${index + 1}`}: ${problem}`);
    rows.push({
      order,
      shot: shot.shot,
      id: shot.id,
      duration_seconds: duration,
      expected_clip: expectedClip,
      expected_clip_absolute: expectedClip ? path.join(root, expectedClip) : null,
      concat_list_line: expectedClip ? `file '${path.join(root, expectedClip).replace(/'/g, "'\\''")}'` : null,
      problems: rowProblems,
    });
  }

  if (durationSum !== expectedDuration) {
    problems.push(`duration sum ${durationSum} does not match total_duration_seconds ${expectedDuration}`);
  }

  const concatListText = rows.map((row) => row.concat_list_line).filter(Boolean).join("\n") + "\n";
  const orderedClipText = rows.map((row) => `${row.order},${row.shot},${row.id},${row.duration_seconds},${row.expected_clip}`).join("\n") + "\n";
  const decision = problems.length
    ? "final_concat_inputs_contract_blocked"
    : "final_concat_inputs_contract_passed";
  const report = {
    date,
    package_id: manifest.package_id,
    package_manifest: rel(manifestPath),
    decision,
    expected_shots: expected,
    rows_checked: rows.length,
    unique_expected_clips: seenExpectedClips.size,
    expected_duration_seconds: expectedDuration,
    duration_sum_seconds: durationSum,
    ordered_clip_signature_sha256: sha256Text(orderedClipText),
    concat_list_preview_sha256: sha256Text(concatListText),
    concat_list_preview: concatListText,
    problems,
    rows,
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Final Concat Inputs Contract",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    "",
    "This contract locks the exact final-concat input order before real clips are allowed to assemble into the final edit.",
    "",
    "## Counts",
    "",
    `- Rows checked: ${rows.length}`,
    `- Unique expected clips: ${seenExpectedClips.size}`,
    `- Duration sum: ${durationSum}s / ${expectedDuration}s`,
    `- Ordered clip signature: \`${report.ordered_clip_signature_sha256}\``,
    `- Concat-list preview SHA-256: \`${report.concat_list_preview_sha256}\``,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  console.log(JSON.stringify({
    decision,
    rows_checked: rows.length,
    unique_expected_clips: seenExpectedClips.size,
    duration_sum_seconds: durationSum,
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));
  if (problems.length) process.exit(1);
}

main();
