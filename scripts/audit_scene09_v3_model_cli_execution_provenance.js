#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const packageRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const packageDir = path.join(root, packageRel);
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(reportDir, `scene09_v3_model_cli_execution_provenance_audit_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_model_cli_execution_provenance_audit_${date}.md`);
const packageOutJson = path.join(packageDir, "model_cli_execution_provenance_audit.json");
const packageOutMd = path.join(packageDir, "model_cli_execution_provenance_audit.md");

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

function digest(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function rewriteExpectedClips(tmpPackage) {
  const manifestPath = path.join(tmpPackage, "package_manifest.json");
  const timelinePath = path.join(tmpPackage, "timeline.json");
  const manifest = readJson(manifestPath);
  const timeline = readJson(timelinePath);
  const byId = new Map();
  for (const shot of manifest.shots || []) {
    const filename = `${String(shot.order).padStart(2, "0")}_${shot.shot}.mp4`;
    const localClip = `clips/${filename}`;
    byId.set(shot.id, localClip);
    byId.set(shot.shot, localClip);
    shot.expected_clip = localClip;
  }
  for (const clip of timeline.clips || []) {
    clip.expected_clip = byId.get(clip.id) || byId.get(clip.shot) || clip.expected_clip;
  }
  writeJson(manifestPath, manifest);
  writeJson(timelinePath, timeline);
  return manifest;
}

function writeFakeCli(tmpRoot) {
  const fakeCli = path.join(tmpRoot, "fake_video_model_cli.js");
  writeText(fakeCli, `#!/usr/bin/env node
const cp = require("child_process");
const path = require("path");
const fs = require("fs");
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
if (outIndex < 0 || !args[outIndex + 1]) {
  console.error("missing --out");
  process.exit(2);
}
const out = args[outIndex + 1];
fs.mkdirSync(path.dirname(out), { recursive: true });
const result = cp.spawnSync("ffmpeg", [
  "-y",
  "-f", "lavfi",
  "-i", "color=c=black:s=160x90:r=12:d=0.2",
  "-an",
  "-c:v", "libx264",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  out,
], { stdio: "ignore" });
if (result.error) {
  console.error(result.error.message);
  process.exit(3);
}
process.exit(result.status || 0);
`);
  fs.chmodSync(fakeCli, 0o755);
  return fakeCli;
}

function runPackageExecute(tmpPackage, fakeCli) {
  const template = [
    process.execPath,
    fakeCli,
    "--shot-id", "{shot_id}",
    "--shot", "{shot}",
    "--order", "{order}",
    "--prompt", "{model_prompt}",
    "--audit-prompt", "{audit_prompt}",
    "--negative", "{negative_prompt}",
    "--start", "{start_frame}",
    "--key", "{key_frame}",
    "--end", "{end_frame}",
    "--duration", "{duration}",
    "--out", "{output}",
  ];
  const result = cp.spawnSync(process.execPath, [
    "scripts/run_video_generation_package.js",
    tmpPackage,
    "--execute",
    "--force",
  ], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      VIDEO_MODEL_CLI_ARGV_JSON: JSON.stringify(template),
    },
  });
  return {
    status: result.status,
    ok: result.status === 0,
    stdout_tail: (result.stdout || "").trim().split(/\n/).slice(-20).join("\n"),
    stderr_tail: (result.stderr || "").trim().split(/\n/).slice(-20).join("\n"),
    template,
  };
}

function auditProvenance(tmpPackage, expectedShots) {
  const provenancePath = path.join(tmpPackage, "generated_clip_provenance.json");
  const provenance = fs.existsSync(provenancePath) ? readJson(provenancePath) : { rows: [] };
  const rows = Array.isArray(provenance.rows) ? provenance.rows : [];
  const problems = [];
  if (rows.length !== expectedShots) problems.push(`provenance rows=${rows.length}, expected ${expectedShots}`);
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.expected_clip)) problems.push(`duplicate expected_clip provenance row ${row.expected_clip}`);
    seen.add(row.expected_clip);
    if (row.source_type !== "model_cli_execute") problems.push(`${row.shot || row.id}: source_type=${row.source_type || "missing"}`);
    if (!row.created_at) problems.push(`${row.shot || row.id}: missing created_at`);
    if (!row.id || !row.shot || !row.order) problems.push(`${row.shot || row.id || "unknown"}: missing shot identity`);
    if (!Array.isArray(row.command_argv) || row.command_argv.length === 0) problems.push(`${row.shot || row.id}: missing command_argv`);
    const clipAbs = path.resolve(root, row.expected_clip);
    if (!fs.existsSync(clipAbs)) {
      problems.push(`${row.shot || row.id}: expected clip from provenance missing ${row.expected_clip}`);
      continue;
    }
    const stat = fs.statSync(clipAbs);
    const sha256 = digest(clipAbs);
    if (row.bytes !== stat.size) problems.push(`${row.shot || row.id}: bytes mismatch ${row.bytes} != ${stat.size}`);
    if (row.sha256 !== sha256) problems.push(`${row.shot || row.id}: sha256 mismatch`);
  }
  return {
    provenance_path: provenancePath,
    rows_checked: rows.length,
    unique_expected_clips: seen.size,
    problems,
  };
}

function main() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09_model_cli_provenance."));
  const tmpPackage = path.join(tmpRoot, "package");
  fs.cpSync(packageDir, tmpPackage, { recursive: true });
  const manifest = rewriteExpectedClips(tmpPackage);
  const fakeCli = writeFakeCli(tmpRoot);
  const run = runPackageExecute(tmpPackage, fakeCli);
  const provenanceAudit = run.ok
    ? auditProvenance(tmpPackage, Number(manifest.total_shots || (manifest.shots || []).length || 42))
    : { provenance_path: path.join(tmpPackage, "generated_clip_provenance.json"), rows_checked: 0, unique_expected_clips: 0, problems: [`runner exited ${run.status}: ${run.stderr_tail || run.stdout_tail}`] };
  const problems = [...provenanceAudit.problems];
  const result = {
    date,
    decision: problems.length ? "model_cli_execution_provenance_blocked" : "model_cli_execution_provenance_passed",
    scope: "temporary package copy; no current expected clips are written",
    source_package: packageRel,
    temp_package: tmpPackage,
    expected_shots: Number(manifest.total_shots || (manifest.shots || []).length || 42),
    runner: {
      ok: run.ok,
      status: run.status,
      stdout_tail: run.stdout_tail,
      stderr_tail: run.stderr_tail,
    },
    provenance: {
      path: provenanceAudit.provenance_path,
      rows_checked: provenanceAudit.rows_checked,
      unique_expected_clips: provenanceAudit.unique_expected_clips,
    },
    fake_cli: fakeCli,
    problems,
  };
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  result.temp_fixture_cleaned = true;
  writeJson(outJson, result);
  writeJson(packageOutJson, {
    ...result,
    temp_package: path.basename(tmpPackage),
    fake_cli: path.basename(fakeCli),
    production_report_json: rel(outJson),
  });
  const md = [
    "# Scene09 V3 Model CLI Execution Provenance Audit",
    "",
    `Date: ${date}`,
    `Decision: ${result.decision}`,
    "",
    "This audit executes a temporary copy of the handoff package with a fake local video CLI. It proves `run_video_generation_package.js --execute` creates real mp4 outputs and writes `model_cli_execute` provenance rows with matching SHA-256 values, without touching the current expected clip paths.",
    "",
    "## Counts",
    "",
    `- Expected shots: ${result.expected_shots}`,
    `- Provenance rows checked: ${result.provenance.rows_checked}`,
    `- Unique expected clips: ${result.provenance.unique_expected_clips}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);
  console.log(JSON.stringify({
    decision: result.decision,
    expected_shots: result.expected_shots,
    rows_checked: result.provenance.rows_checked,
    unique_expected_clips: result.provenance.unique_expected_clips,
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
