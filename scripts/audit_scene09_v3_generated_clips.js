const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const crypto = require("crypto");

const root = process.cwd();
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const currentDate = "2026-08-01";
const legacyDate = "2026-07-27";
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(reportDir, `scene09_v3_generated_clip_structural_audit_${currentDate}.json`);
const outMd = path.join(reportDir, `scene09_v3_generated_clip_structural_audit_${currentDate}.md`);
const legacyOutJson = path.join(reportDir, `scene09_v3_generated_clip_qa_status_${legacyDate}.json`);
const legacyOutMd = path.join(reportDir, `scene09_v3_generated_clip_qa_status_${legacyDate}.md`);
const packageOutJson = path.join(packageDir, "generated_clip_structural_audit.json");
const packageOutMd = path.join(packageDir, "generated_clip_structural_audit.md");

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
    return { ok: true, data: JSON.parse(result.stdout) };
  } catch (error) {
    return { ok: false, error: `ffprobe JSON parse failed: ${error.message}` };
  }
}

function clipInfo(file, expectedDuration) {
  if (!fs.existsSync(file)) {
    return { exists: false, ok: false, issue: "missing_clip" };
  }
  const stat = fs.statSync(file);
  if (stat.size === 0) {
    return { exists: true, ok: false, issue: "zero_byte_clip", size_bytes: stat.size };
  }
  const probed = ffprobe(file);
  if (!probed.ok) {
    return { exists: true, ok: false, issue: "ffprobe_failed", size_bytes: stat.size, error: probed.error };
  }
  const duration = Number(probed.data.format?.duration || 0);
  const videoStream = (probed.data.streams || []).find((stream) => stream.codec_type === "video");
  const durationDelta = Math.abs(duration - Number(expectedDuration || 0));
  const durationOk = Number.isFinite(duration) && duration > 0 && durationDelta <= 1.5;
  return {
    exists: true,
    ok: Boolean(videoStream) && durationOk,
    issue: !videoStream ? "missing_video_stream" : durationOk ? null : "duration_out_of_tolerance",
    size_bytes: stat.size,
    duration_seconds: duration,
    expected_duration_seconds: Number(expectedDuration || 0),
    duration_delta_seconds: durationDelta,
    codec_name: videoStream?.codec_name || null,
    width: videoStream?.width || null,
    height: videoStream?.height || null,
  };
}

function expectedClipFileRows(shots) {
  return shots.map((shot) => {
    const absolute = path.join(root, shot.expected_clip || "");
    const exists = fs.existsSync(absolute);
    const stat = exists ? fs.statSync(absolute) : null;
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
      exists,
      size_bytes: stat?.size ?? null,
      sha256: exists ? sha256File(absolute) : null,
    };
  });
}

function expectedClipProbeRowsFromAudit(rows) {
  return rows.map((row) => ({
    order: row.order,
    shot: row.shot,
    id: row.id,
    expected_clip: row.expected_clip,
    probe: row.clip.exists
      ? {
          exists: true,
          ok: Boolean(row.clip.codec_name),
          issue: row.clip.codec_name ? null : row.clip.issue || "missing_video_stream",
          size_bytes: row.clip.size_bytes ?? null,
          duration_seconds: row.clip.duration_seconds ?? null,
          codec_name: row.clip.codec_name || null,
          width: row.clip.width || null,
          height: row.clip.height || null,
        }
      : { exists: false, ok: false, issue: "missing_clip" },
  }));
}

function main() {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing handoff package manifest: ${manifestPath}`);
  }

  const pkg = readJson(manifestPath);
  const rows = pkg.shots.map((shot) => {
    const expectedClip = path.join(root, shot.expected_clip);
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
      status_from_handoff: shot.status,
      visible_named_only: shot.visible_named_only || [],
      primary_check: shot.primary_check || "",
      clip: clipInfo(expectedClip, shot.duration_seconds),
    };
  });

  const missing = rows.filter((row) => !row.clip.exists);
  const failed = rows.filter((row) => row.clip.exists && !row.clip.ok);
  const ready = rows.filter((row) => row.clip.ok);
  const expectedClipFileRowsCurrent = expectedClipFileRows(pkg.shots || []);
  const expectedClipProbeRowsCurrent = expectedClipProbeRowsFromAudit(rows);
  const expectedClipFilesDigest = sha256Text(`${JSON.stringify(expectedClipFileRowsCurrent)}\n`);
  const expectedClipProbeDigest = sha256Text(`${JSON.stringify(expectedClipProbeRowsCurrent)}\n`);
  const decision = missing.length === rows.length
    ? "clips_pending"
    : missing.length || failed.length
      ? "clip_qa_blocked"
      : "clip_files_integrity_passed_motion_review_still_required";

  const report = {
    date: currentDate,
    package_manifest: path.relative(root, manifestPath),
    expected_clips: rows.length,
    ready_clips: ready.length,
    missing_clips: missing.length,
    failed_clips: failed.length,
    expected_clip_files_digest_sha256: expectedClipFilesDigest,
    expected_clip_file_rows: expectedClipFileRowsCurrent,
    expected_clip_video_probe_digest_sha256: expectedClipProbeDigest,
    expected_clip_video_probe_rows: expectedClipProbeRowsCurrent,
    expected_clip_video_probe_playable: expectedClipProbeRowsCurrent.filter((row) => row.probe.ok).length,
    decision,
    structural_checks: [
      "expected mp4 path exists",
      "file is non-zero",
      "ffprobe can parse container metadata",
      "at least one video stream is present",
      "duration is within +/-1.5s of the package duration",
    ],
    rows,
    codex_motion_self_audit_required: [
      "No unnamed readable humans appear.",
      "Captured Hubert, Dorothea, and Bernadetta do not return after their capture shots.",
      "Spent or stood-down characters do not resume active combat.",
      "Hanneman and Manuela are never staged as one allied teacher unit.",
      "Shot034B contains only Byleth and Dimitri; both faculty objective markers stay empty, and Hanneman, Manuela, extra teachers, students, extras, spectators, crowds, and readable silhouettes are absent.",
      "Shot034G remains an exhausted Byleth/Dimitri/Dedue Blue Lions core win.",
      "Every clip lands on its declared end_frame for the final 0.5 seconds.",
    ],
  };

  writeJson(outJson, report);
  writeJson(legacyOutJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Generated Clip QA Status",
    "",
    `Date: ${currentDate}`,
    `Decision: ${decision}`,
    "",
    "## Counts",
    "",
    `- Expected clips: ${rows.length}`,
    `- Ready clips: ${ready.length}`,
    `- Missing clips: ${missing.length}`,
    `- Failed clips: ${failed.length}`,
    `- Expected clip file digest: \`${expectedClipFilesDigest}\``,
    `- Expected clip ffprobe digest: \`${expectedClipProbeDigest}\``,
    `- Expected clip ffprobe playable: ${expectedClipProbeRowsCurrent.filter((row) => row.probe.ok).length}/${rows.length}`,
    "",
    "## Missing Clips",
    "",
    missing.length ? missing.map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot}: \`${row.expected_clip}\``).join("\n") : "- none",
    "",
    "## Failed Clips",
    "",
    failed.length ? failed.map((row) => `- ${String(row.order).padStart(2, "0")} ${row.shot}: ${row.clip.issue}`).join("\n") : "- none",
    "",
    "## Structural Checks",
    "",
    ...report.structural_checks.map((item) => `- ${item}`),
    "",
    "## Codex Motion Self-Audit Required After Files Exist",
    "",
    ...report.codex_motion_self_audit_required.map((item) => `- ${item}`),
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(legacyOutMd, md);
  writeText(packageOutMd, md);

  console.log(JSON.stringify({
    decision,
    expected_clips: rows.length,
    ready_clips: ready.length,
    missing_clips: missing.length,
    failed_clips: failed.length,
    report_json: path.relative(root, outJson),
    report_md: path.relative(root, outMd),
    package_report_json: path.relative(root, packageOutJson),
    legacy_report_json: path.relative(root, legacyOutJson),
  }, null, 2));

  if (decision === "clip_qa_blocked") process.exit(1);
}

main();
