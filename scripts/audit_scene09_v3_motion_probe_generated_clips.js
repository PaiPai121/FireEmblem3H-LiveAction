#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const probeManifestPath = path.join(pkgDir, "motion_probe_submission/motion_probe_manifest.json");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(outDir, `scene09_v3_motion_probe_clip_structural_audit_${date}.json`);
const outMd = path.join(outDir, `scene09_v3_motion_probe_clip_structural_audit_${date}.md`);
const packageJson = path.join(pkgDir, "motion_probe_clip_structural_audit.json");
const packageMd = path.join(pkgDir, "motion_probe_clip_structural_audit.md");

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

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function ffprobe(file) {
  const result = cp.spawnSync("ffprobe", [
    "-v", "error",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    file,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    return { ok: false, error: result.stderr.trim() || `ffprobe exited ${result.status}` };
  }
  try {
    return { ok: true, data: JSON.parse(result.stdout || "{}") };
  } catch (error) {
    return { ok: false, error: `ffprobe JSON parse failed: ${error.message}` };
  }
}

function clipInfo(file, expectedDuration) {
  if (!fs.existsSync(file)) return { exists: false, ok: false, issue: "missing_probe_clip" };
  const stat = fs.statSync(file);
  if (stat.size === 0) return { exists: true, ok: false, issue: "zero_byte_probe_clip", size_bytes: 0 };
  const probed = ffprobe(file);
  if (!probed.ok) return { exists: true, ok: false, issue: "ffprobe_failed", size_bytes: stat.size, error: probed.error };
  const videoStream = (probed.data.streams || []).find((stream) => stream.codec_type === "video");
  const duration = Number(probed.data.format?.duration || videoStream?.duration || 0);
  const durationDelta = Math.abs(duration - Number(expectedDuration || 0));
  const durationOk = Number.isFinite(duration) && duration > 0 && durationDelta <= 0.75;
  return {
    exists: true,
    ok: Boolean(videoStream) && durationOk,
    issue: !videoStream ? "missing_video_stream" : durationOk ? null : "duration_out_of_tolerance",
    size_bytes: stat.size,
    sha256: sha256File(file),
    duration_seconds: duration,
    expected_duration_seconds: Number(expectedDuration || 0),
    duration_delta_seconds: durationDelta,
    codec_name: videoStream?.codec_name || null,
    width: videoStream?.width || null,
    height: videoStream?.height || null,
  };
}

function probeFileRows(rows) {
  return rows.map((row) => {
    const absolute = path.join(root, row.expected_probe_clip || "");
    const exists = fs.existsSync(absolute);
    const stat = exists ? fs.statSync(absolute) : null;
    return {
      order: row.order,
      shot: row.shot,
      id: row.id,
      custom_id: row.custom_id,
      expected_probe_clip: row.expected_probe_clip,
      parent_expected_clip: row.parent_expected_clip,
      exists,
      size_bytes: stat?.size ?? null,
      sha256: exists ? sha256File(absolute) : null,
    };
  });
}

function probeVideoRowsFromAudit(rows) {
  return rows.map((row) => ({
    order: row.order,
    shot: row.shot,
    id: row.id,
    custom_id: row.custom_id,
    expected_probe_clip: row.expected_probe_clip,
    parent_expected_clip: row.parent_expected_clip,
    probe: row.clip.exists
      ? {
          exists: true,
          ok: Boolean(row.clip.codec_name) && row.clip.ok,
          issue: row.clip.issue || null,
          size_bytes: row.clip.size_bytes ?? null,
          sha256: row.clip.sha256 || null,
          duration_seconds: row.clip.duration_seconds ?? null,
          codec_name: row.clip.codec_name || null,
          width: row.clip.width || null,
          height: row.clip.height || null,
        }
      : { exists: false, ok: false, issue: "missing_probe_clip" },
  }));
}

function main() {
  if (!fs.existsSync(probeManifestPath)) throw new Error(`Missing motion probe manifest: ${rel(probeManifestPath)}`);
  const probeManifest = readJson(probeManifestPath);
  const sourceRows = [...(probeManifest.rows || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const rows = sourceRows.map((row) => ({
    order: row.order,
    shot: row.shot,
    id: row.id,
    expected_clip: row.parent_expected_clip,
    custom_id: row.custom_id,
    expected_probe_clip: row.expected_probe_clip,
    parent_expected_clip: row.parent_expected_clip,
    visible_named_only: row.visible_named_only || "",
    primary_check: row.primary_check || "",
    clip: clipInfo(path.join(root, row.expected_probe_clip), row.probe_duration_seconds || 3),
  }));
  const missing = rows.filter((row) => !row.clip.exists);
  const failed = rows.filter((row) => row.clip.exists && !row.clip.ok);
  const playable = rows.filter((row) => row.clip.ok);
  const expectedProbeFileRows = probeFileRows(sourceRows);
  const expectedProbeVideoRows = probeVideoRowsFromAudit(rows);
  const expectedProbeFileDigest = sha256Text(`${JSON.stringify(expectedProbeFileRows)}\n`);
  const expectedProbeVideoDigest = sha256Text(`${JSON.stringify(expectedProbeVideoRows)}\n`);
  const decision = missing.length === rows.length
    ? "motion_probe_clips_pending"
    : missing.length || failed.length
      ? "motion_probe_clip_structural_blocked"
      : "motion_probe_clip_structural_passed_motion_review_required";
  const report = {
    date,
    decision,
    package_id: "scene09_v3_monitor_handoff_package_2026-07-27",
    motion_probe_manifest: rel(probeManifestPath),
    expected_probe_clips: rows.length,
    playable_probe_clips: playable.length,
    missing_probe_clips: missing.length,
    failed_probe_clips: failed.length,
    expected_probe_file_rows: expectedProbeFileRows,
    expected_probe_file_digest_sha256: expectedProbeFileDigest,
    expected_probe_video_probe_rows: expectedProbeVideoRows,
    expected_probe_video_probe_digest_sha256: expectedProbeVideoDigest,
    expected_probe_video_probe_playable: expectedProbeVideoRows.filter((row) => row.probe.ok).length,
    structural_checks: [
      "expected _probe.mp4 path exists under motion_probes",
      "file is non-zero",
      "ffprobe can parse container metadata",
      "at least one video stream is present",
      "duration is within +/-0.75s of the 3-second probe duration",
    ],
    release_gate: [
      "Full-duration generation remains blocked while decision is motion_probe_clips_pending or motion_probe_clip_structural_blocked.",
      "Passing structural probe clips still require Codex visual motion QA before any full-duration clip request is released.",
      "Probe clips cannot be substituted for full-duration expected clips or final edit inputs.",
    ],
    rows,
    problems: failed.map((row) => `${row.custom_id}: ${row.clip.issue || "unknown"}`),
    warnings: [],
  };
  writeJson(outJson, report);
  writeJson(packageJson, report);
  const md = [
    "# Scene09 V3 Motion Probe Clip Structural Audit",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    "",
    "## Counts",
    "",
    `- Expected probe clips: ${rows.length}`,
    `- Playable probe clips: ${playable.length}`,
    `- Missing probe clips: ${missing.length}`,
    `- Failed probe clips: ${failed.length}`,
    `- Expected probe file digest: \`${expectedProbeFileDigest}\``,
    `- Expected probe ffprobe digest: \`${expectedProbeVideoDigest}\``,
    "",
    "## Missing Probe Clips",
    "",
    missing.length ? missing.map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot}: \`${row.expected_probe_clip}\``).join("\n") : "- none",
    "",
    "## Failed Probe Clips",
    "",
    failed.length ? failed.map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot}: ${row.clip.issue}`).join("\n") : "- none",
    "",
    "## Structural Checks",
    "",
    ...report.structural_checks.map((item) => `- ${item}`),
    "",
    "## Release Gate",
    "",
    ...report.release_gate.map((item) => `- ${item}`),
    "",
  ].join("\n");
  writeText(outMd, `${md}\n`);
  writeText(packageMd, `${md}\n`);
  console.log(JSON.stringify({
    decision,
    expected_probe_clips: rows.length,
    playable_probe_clips: playable.length,
    missing_probe_clips: missing.length,
    failed_probe_clips: failed.length,
    report_json: rel(outJson),
    package_report_json: rel(packageJson),
  }, null, 2));
  if (decision === "motion_probe_clip_structural_blocked") process.exit(1);
}

main();
