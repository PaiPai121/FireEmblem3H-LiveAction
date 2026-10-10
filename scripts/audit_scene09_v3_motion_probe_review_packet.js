#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const packetDir = path.join(pkgDir, "motion_probe_review");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packetDir, "motion_probe_review_manifest.json");
const matrixPath = path.join(packetDir, "motion_probe_review_matrix.csv");
const templatePath = path.join(packetDir, "decision_update_template.jsonl");
const readmePath = path.join(packetDir, "README.md");
const probeManifestPath = path.join(pkgDir, "motion_probe_submission/motion_probe_manifest.json");
const outJson = path.join(reportDir, `scene09_v3_motion_probe_review_packet_audit_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_motion_probe_review_packet_audit_${date}.md`);
const packageOutJson = path.join(pkgDir, "motion_probe_review_packet_audit.json");
const packageOutMd = path.join(pkgDir, "motion_probe_review_packet_audit.md");

const requiredChecks = [
  "identity_preserved",
  "wardrobe_preserved",
  "training_weapons_preserved",
  "visible_named_only_passed",
  "no_extra_people_passed",
  "no_subtitles_visible_text_passed",
  "teacher_separation_respected",
  "post_shot_ledger_respected",
  "motion_continuity_passed",
  "approve_full_duration",
];

const requiredLedgerFields = [
  "battle_ledger_after",
  "alive_safe_after",
  "active_after",
  "limited_after",
  "defeated_removed_after",
  "captured_objective_defeated_after",
  "stood_down_post_battle_after",
  "must_not_return_active_after",
  "changed_this_shot",
  "no_active_combat_line",
];

function readJson(file, fallback = null) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
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

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function parseJsonl(file) {
  return readText(file).trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key);
}

function fileSignature(relativeFile) {
  if (!relativeFile) return null;
  const absolute = abs(relativeFile);
  if (!fs.existsSync(absolute)) return null;
  const stat = fs.statSync(absolute);
  return {
    path: relativeFile,
    size_bytes: stat.size,
    mtime_ms: Math.trunc(stat.mtimeMs),
    sha256: sha256File(absolute),
  };
}

function probeVideoFile(file) {
  if (!fs.existsSync(file)) return { exists: false, ok: false, issue: "missing_probe_clip" };
  const stat = fs.statSync(file);
  if (stat.size === 0) return { exists: true, ok: false, issue: "zero_byte_probe_clip", size_bytes: 0 };
  const result = cp.spawnSync("ffprobe", [
    "-v", "error",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    file,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    return { exists: true, ok: false, issue: "ffprobe_failed", size_bytes: stat.size, error: result.stderr.trim() || `ffprobe exited ${result.status}` };
  }
  try {
    const data = JSON.parse(result.stdout);
    const videoStream = (data.streams || []).find((stream) => stream.codec_type === "video");
    return {
      exists: true,
      ok: Boolean(videoStream),
      issue: videoStream ? null : "missing_video_stream",
      size_bytes: stat.size,
      duration_seconds: Number(data.format?.duration || 0),
      codec_name: videoStream?.codec_name || null,
      width: videoStream?.width || null,
      height: videoStream?.height || null,
    };
  } catch (error) {
    return { exists: true, ok: false, issue: "ffprobe_json_parse_failed", size_bytes: stat.size, error: error.message };
  }
}

function expectedProbeRows() {
  const manifest = readJson(probeManifestPath, { rows: [] });
  return [...(manifest.rows || [])].sort((a, b) => Number(a.order) - Number(b.order));
}

function expectedProbeFileRows(rows) {
  return rows.map((row) => {
    const absolute = abs(row.expected_probe_clip || "");
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

function expectedProbeVideoRows(rows) {
  return rows.map((row) => {
    const probed = probeVideoFile(abs(row.expected_probe_clip || ""));
    const normalized = probed.exists
      ? {
          exists: true,
          ok: Boolean(probed.ok),
          issue: probed.issue || null,
          size_bytes: probed.size_bytes ?? null,
          sha256: fs.existsSync(abs(row.expected_probe_clip || "")) ? sha256File(abs(row.expected_probe_clip || "")) : null,
          duration_seconds: probed.duration_seconds ?? null,
          codec_name: probed.codec_name || null,
          width: probed.width || null,
          height: probed.height || null,
        }
      : { exists: false, ok: false, issue: "missing_probe_clip" };
    return {
      order: row.order,
      shot: row.shot,
      id: row.id,
      custom_id: row.custom_id,
      expected_probe_clip: row.expected_probe_clip,
      parent_expected_clip: row.parent_expected_clip,
      probe: normalized,
    };
  });
}

function reviewFrameRows(rows) {
  return rows.map((row) => ({
    order: row.order,
    shot: row.shot,
    id: row.id,
    custom_id: row.custom_id,
    status: row.status,
    review_frames: row.review_frames || {},
    review_frame_signatures: row.review_frame_signatures || { start: null, mid: null, end: null },
  }));
}

function main() {
  const problems = [];
  const files = [manifestPath, matrixPath, templatePath, readmePath];
  for (const file of files) {
    if (!fs.existsSync(file)) problems.push(`missing ${rel(file)}`);
  }

  const manifest = readJson(manifestPath, {});
  const sourceRows = expectedProbeRows();
  const expected = sourceRows.length;
  const templateRows = fs.existsSync(templatePath) ? parseJsonl(templatePath) : [];
  const packetRows = Array.isArray(manifest.rows) ? manifest.rows : [];
  const acceptedDecisions = new Set([
    "motion_probe_review_packet_ready_clips_pending",
    "motion_probe_review_packet_ready_codex_review_required",
    "motion_probe_review_packet_partial_codex_review_required",
  ]);

  if (!acceptedDecisions.has(manifest.decision)) {
    problems.push(`manifest decision ${manifest.decision || "missing"} is not accepted`);
  }
  if (expected !== 42) problems.push(`source probe rows ${expected} does not match 42`);
  if (Number(manifest.expected_probe_clips || 0) !== expected) {
    problems.push(`manifest expected_probe_clips ${manifest.expected_probe_clips || 0} does not match ${expected}`);
  }
  if (packetRows.length !== expected) problems.push(`manifest rows ${packetRows.length} does not match ${expected}`);
  if (templateRows.length !== expected) problems.push(`template rows ${templateRows.length} does not match ${expected}`);

  const currentFileRows = expectedProbeFileRows(sourceRows);
  const currentFileDigest = sha256Text(`${JSON.stringify(currentFileRows)}\n`);
  const currentVideoRows = expectedProbeVideoRows(sourceRows);
  const currentVideoDigest = sha256Text(`${JSON.stringify(currentVideoRows)}\n`);
  const playable = currentVideoRows.filter((row) => row.probe.ok).length;
  const currentFrameRows = reviewFrameRows(packetRows);
  const currentFrameDigest = sha256Text(`${JSON.stringify(currentFrameRows)}\n`);
  const frameSetsReady = packetRows.filter((row) => row.status === "probe_review_frames_ready").length;

  if (manifest.expected_probe_file_digest_sha256 !== currentFileDigest) {
    problems.push("manifest expected_probe_file_digest_sha256 does not match current filesystem state");
  }
  if (JSON.stringify(manifest.expected_probe_file_rows || []) !== JSON.stringify(currentFileRows)) {
    problems.push("manifest expected_probe_file_rows do not match current filesystem state");
  }
  if (manifest.expected_probe_video_probe_digest_sha256 !== currentVideoDigest) {
    problems.push("manifest expected_probe_video_probe_digest_sha256 does not match current ffprobe state");
  }
  if (JSON.stringify(manifest.expected_probe_video_probe_rows || []) !== JSON.stringify(currentVideoRows)) {
    problems.push("manifest expected_probe_video_probe_rows do not match current ffprobe state");
  }
  if (Number(manifest.playable_probe_clips || 0) !== playable) {
    problems.push(`manifest playable_probe_clips ${manifest.playable_probe_clips || 0} does not match current ${playable}`);
  }
  if (Number(manifest.review_frame_sets_ready || 0) !== frameSetsReady) {
    problems.push(`manifest review_frame_sets_ready ${manifest.review_frame_sets_ready || 0} does not match current ${frameSetsReady}`);
  }
  if (manifest.review_frame_rows_digest_sha256 !== currentFrameDigest) {
    problems.push("manifest review_frame_rows_digest_sha256 does not match current packet rows");
  }

  for (const row of templateRows) {
    const packetRow = packetRows.find((candidate) => candidate.id === row.id);
    if (!packetRow) {
      problems.push(`${row.shot || "unknown"} missing matching manifest row`);
      continue;
    }
    if (!String(row.expected_probe_clip || "").endsWith("_probe.mp4")) {
      problems.push(`${row.shot}: expected_probe_clip is not a _probe.mp4`);
    }
    if (row.parent_expected_clip && String(row.parent_expected_clip).endsWith("_probe.mp4")) {
      problems.push(`${row.shot}: parent_expected_clip points at a probe`);
    }
    if (!hasOwn(row, "probe_clip_signature")) {
      problems.push(`${row.shot}: missing probe_clip_signature field`);
    }
    const checks = new Set((row.checks || []).map((check) => check.id));
    for (const check of requiredChecks) {
      if (!checks.has(check)) problems.push(`${row.shot}: missing required check ${check}`);
    }
    const evidence = row.review_evidence || {};
    if (!hasOwn(evidence, "probe_clip_reviewed")) problems.push(`${row.shot}: missing review_evidence.probe_clip_reviewed`);
    if (!hasOwn(evidence, "probe_clip_signature_verified")) problems.push(`${row.shot}: missing review_evidence.probe_clip_signature_verified`);
    for (const label of ["start", "mid", "end"]) {
      if (!hasOwn(evidence.review_frames_checked, label)) problems.push(`${row.shot}: missing review frame checked flag ${label}`);
      if (!hasOwn(evidence.review_frame_signatures, label)) problems.push(`${row.shot}: missing review frame signature ${label}`);
    }
    if (row.approve_full_duration !== false) {
      problems.push(`${row.shot}: approve_full_duration must remain false until Codex reviews returned probe evidence`);
    }
    if (row.decision === "probe_motion_passed" || row.decision === "approved_for_full_duration") {
      problems.push(`${row.shot}: template pre-approves probe without Codex review`);
    }
    if (!Array.isArray(row.hard_rejects) || !row.hard_rejects.length) {
      problems.push(`${row.shot}: missing hard_rejects`);
    }
    for (const field of requiredLedgerFields) {
      if (!hasOwn(row, field)) problems.push(`${row.shot}: missing ledger field ${field}`);
    }
    const text = JSON.stringify(row);
    if (row.shot === "Shot032F" && !text.includes("Hubert is defeated/captured by Felix and Ashe")) {
      problems.push("Shot032F: missing Hubert captured-by-Felix-and-Ashe probe lock");
    }
    if (row.shot === "Shot032G" && (!text.includes("Dorothea and Bernadetta") || !text.includes("Leonie and Claude"))) {
      problems.push("Shot032G: missing Dorothea/Bernadetta captured-by-Leonie/Claude probe lock");
    }
    if (row.shot === "Shot034B" && (!text.includes("Byleth and Dimitri only") || !text.includes("Hanneman and Manuela are absent"))) {
      problems.push("Shot034B: missing empty objective / teachers absent probe lock");
    }
    if (row.shot === "Shot034G" && !text.includes("exhausted Byleth, Dimitri, Dedue core only")) {
      problems.push("Shot034G: missing exhausted core victory probe lock");
    }
  }

  for (const packetRow of packetRows) {
    if (packetRow.status === "probe_review_frames_ready") {
      for (const label of ["start", "mid", "end"]) {
        const frame = packetRow.review_frames?.[label];
        const signature = packetRow.review_frame_signatures?.[label];
        const currentSignature = frame ? fileSignature(frame) : null;
        if (!frame || !currentSignature) problems.push(`${packetRow.shot}: missing ${label} review frame file`);
        if (JSON.stringify(signature || null) !== JSON.stringify(currentSignature || null)) {
          problems.push(`${packetRow.shot}: ${label} review frame signature is stale`);
        }
      }
    }
  }

  const combinedText = files.filter((file) => fs.existsSync(file)).map((file) => readText(file)).join("\n");
  for (const required of [
    "Codex must inspect every returned probe clip",
    "Full-duration generation remains blocked",
    "No user/operator approval can replace Codex visual motion review",
    "Visible named-only",
    "Must Not Return Active",
    "No-Active-Combat Line",
  ]) {
    if (!combinedText.includes(required)) problems.push(`packet text missing ${JSON.stringify(required)}`);
  }

  const result = {
    date,
    decision: problems.length ? "motion_probe_review_packet_blocked" : manifest.decision,
    rows_checked: templateRows.length,
    expected_probe_clips: expected,
    playable_probe_clips: playable,
    review_frame_sets_ready: frameSetsReady,
    full_duration_approvals: 0,
    expected_probe_file_rows: currentFileRows,
    expected_probe_file_digest_sha256: currentFileDigest,
    expected_probe_video_probe_rows: currentVideoRows,
    expected_probe_video_probe_digest_sha256: currentVideoDigest,
    review_frame_rows: currentFrameRows,
    review_frame_rows_digest_sha256: currentFrameDigest,
    rows: packetRows.map((row) => ({
      order: row.order,
      shot: row.shot,
      id: row.id,
      custom_id: row.custom_id,
      status: row.status,
      expected_probe_clip: row.expected_probe_clip,
      parent_expected_clip: row.parent_expected_clip,
      clip_exists: row.clip_exists,
      review_frames_ready: row.status === "probe_review_frames_ready",
      problems: row.problems || [],
    })),
    problems,
    manifest: rel(manifestPath),
  };
  writeJson(outJson, result);
  writeJson(packageOutJson, result);
  writeText(packageOutMd, [
    "# Scene09 V3 Motion Probe Review Packet Audit",
    "",
    `Date: ${date}`,
    `Decision: ${result.decision}`,
    `Rows checked: ${result.rows_checked}`,
    `Playable probe clips: ${result.playable_probe_clips}/${result.expected_probe_clips}`,
    `Review frame sets ready: ${result.review_frame_sets_ready}`,
    `Full-duration approvals: ${result.full_duration_approvals}`,
    `Manifest: \`${result.manifest}\``,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n"));
  console.log(JSON.stringify(result, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
