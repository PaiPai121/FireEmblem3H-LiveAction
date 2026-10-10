#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const outRel = `${pkgRel}/motion_probe_review`;
const outDir = path.join(root, outRel);
const framesDir = path.join(outDir, "frames");
const manifestPath = path.join(pkgDir, "package_manifest.json");
const probeManifestPath = path.join(pkgDir, "motion_probe_submission/motion_probe_manifest.json");
const structuralAuditPath = path.join(pkgDir, "motion_probe_clip_structural_audit.json");
const battleLedgerPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json");
const runbookPath = path.join(pkgDir, "RUNBOOK.md");

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

function clipSignature(relativeFile) {
  const signature = fileSignature(relativeFile);
  if (!signature) return null;
  const { path: _path, ...clipOnly } = signature;
  return clipOnly;
}

function run(argv) {
  return cp.spawnSync(argv[0], argv.slice(1), { encoding: "utf8" });
}

function ffprobe(file) {
  if (!fs.existsSync(file)) return { exists: false, ok: false, issue: "missing_probe_clip" };
  const stat = fs.statSync(file);
  if (stat.size === 0) return { exists: true, ok: false, issue: "zero_byte_probe_clip", size_bytes: 0 };
  const result = run([
    "ffprobe",
    "-v",
    "error",
    "-print_format",
    "json",
    "-show_format",
    "-show_streams",
    file,
  ]);
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

function extractFrame(clip, atSeconds, outFile) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const result = run([
    "ffmpeg",
    "-y",
    "-ss",
    atSeconds.toFixed(3),
    "-i",
    clip,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    outFile,
  ]);
  if (result.status !== 0 || !fs.existsSync(outFile)) {
    return { ok: false, error: result.stderr.trim() || `ffmpeg exited ${result.status}` };
  }
  return { ok: true };
}

function reviewTimes(duration) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 3;
  return {
    start: Math.min(0.25, Math.max(0, safeDuration - 0.1)),
    mid: Math.max(0.1, safeDuration / 2),
    end: Math.max(0.1, safeDuration - 0.35),
  };
}

function csvCell(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function listGroups(groups = {}) {
  return Object.entries(groups)
    .map(([group, names]) => `${group}: ${(names || []).join(", ") || "none"}`)
    .join("; ") || "none";
}

function ledgerSnapshot(row = {}) {
  return {
    alive_by_house: row.alive_by_house || {},
    active_by_house: row.active_by_house || {},
    limited_by_house: row.limited_by_house || {},
    defeated_removed_by_house: row.defeated_removed_by_house || {},
    captured_objective_defeated_by_house: row.captured_objective_defeated_by_house || {},
    stood_down_post_battle_by_house: row.stood_down_post_battle_by_house || {},
    must_not_return_active_by_house: row.must_not_return_active_by_house || {},
    changed_this_shot: row.changed_this_shot || [],
    no_active_combat_line: row.no_active_combat_line || "none",
  };
}

function changedText(items = []) {
  return items.length ? items.map((item) => `${item.name}:${item.status}`).join("; ") : "none";
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
    const probed = ffprobe(abs(row.expected_probe_clip || ""));
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

function hardRejectsFor(row, ledgerRow) {
  const rejects = [
    `Visible named-only must stay exactly: ${row.visible_named_only || "none"}.`,
    "Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears.",
    "Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears.",
    "Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames.",
    "Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat.",
    `Alive / Safe After this shot: ${listGroups(ledgerRow?.alive_by_house)}.`,
    `Active / Controlling After this shot: ${listGroups(ledgerRow?.active_by_house)}.`,
    `Captured / Objective-Defeated After this shot: ${listGroups(ledgerRow?.captured_objective_defeated_by_house)}.`,
    `Must Not Return Active after this shot: ${listGroups(ledgerRow?.must_not_return_active_by_house)}.`,
    `No-Active-Combat Line after this shot: ${ledgerRow?.no_active_combat_line || "none"}.`,
  ];
  if (row.shot === "Shot032F") {
    rejects.push("Shot032F hard lock: Hubert is defeated/captured by Felix and Ashe; Hubert must not continue active combat afterward.");
  }
  if (row.shot === "Shot032G") {
    rejects.push("Shot032G hard lock: Dorothea and Bernadetta are captured/objective-defeated by Leonie and Claude; neither returns readable or active afterward.");
  }
  if (row.shot === "Shot034B") {
    rejects.push("Shot034B hard lock: Byleth and Dimitri only; both faculty objective markers stay empty; Hanneman and Manuela are absent/offscreen/silent/unpaired.");
  }
  if (row.shot === "Shot034G") {
    rejects.push("Shot034G hard lock: exhausted Byleth, Dimitri, Dedue core only; final win is battered, not a reset or full-class celebration.");
  }
  return rejects;
}

function buildReviewFrames(row, previous = {}) {
  const clip = abs(row.expected_probe_clip || "");
  const probed = ffprobe(clip);
  const result = {
    clip_exists: Boolean(probed.exists),
    clip_probe: probed,
    clip_signature: clipSignature(row.expected_probe_clip),
    review_frames: {},
    review_frame_signatures: { start: null, mid: null, end: null },
    status: "probe_clip_pending",
    problems: [],
  };
  if (!probed.exists) return result;
  if (!probed.ok) {
    result.status = "probe_ffprobe_failed";
    result.problems.push(probed.issue || "ffprobe_failed");
    return result;
  }
  const previousSameClip = previous.clip_signature?.sha256 &&
    previous.clip_signature.sha256 === result.clip_signature?.sha256 &&
    previous.clip_signature.size_bytes === result.clip_signature?.size_bytes;
  if (previousSameClip && previous.status === "probe_review_frames_ready") {
    const frames = previous.review_frames || {};
    const allExist = ["start", "mid", "end"].every((key) => frames[key] && fs.existsSync(abs(frames[key])));
    if (allExist) {
      result.review_frames = frames;
      result.review_frame_signatures = {
        start: fileSignature(frames.start),
        mid: fileSignature(frames.mid),
        end: fileSignature(frames.end),
      };
      result.status = "probe_review_frames_ready";
      return result;
    }
  }
  const times = reviewTimes(probed.duration_seconds);
  const prefix = `${String(row.order).padStart(3, "0")}_${row.shot}`;
  for (const [label, time] of Object.entries(times)) {
    const outFile = path.join(framesDir, `${prefix}_${label}.jpg`);
    const extracted = extractFrame(clip, time, outFile);
    if (!extracted.ok) {
      result.problems.push(`${label}: ${extracted.error}`);
      continue;
    }
    result.review_frames[label] = rel(outFile);
    result.review_frame_signatures[label] = fileSignature(rel(outFile));
  }
  result.status = result.problems.length ? "probe_review_frame_extraction_failed" : "probe_review_frames_ready";
  return result;
}

function updateRunbook() {
  const runbook = readText(runbookPath);
  if (!runbook) return;
  const section = [
    "## Motion Probe Codex Review Packet",
    "",
    "- Returned 3-second `_probe.mp4` files must be ingested before full-duration generation is released.",
    "- Run `node scripts/audit_scene09_v3_motion_probe_generated_clips.js`, then `node scripts/build_scene09_v3_motion_probe_review_packet.js`, then `node scripts/audit_scene09_v3_motion_probe_review_packet.js`.",
    "- Codex must inspect each returned probe and its extracted start/mid/end review frames. The user/operator does not approve these rows.",
    "- Full-duration generation remains blocked until every probe row has signed clip/frame evidence, all required checks pass, and `approve_full_duration` is true.",
    "",
  ].join("\n");
  const next = runbook.includes("## Motion Probe Codex Review Packet")
    ? runbook.replace(/## Motion Probe Codex Review Packet\n[\s\S]*?(?=\n## )/, section.trimEnd())
    : `${runbook.trimEnd()}\n\n${section}`;
  writeText(runbookPath, `${next.trimEnd()}\n`);
}

function main() {
  const packageManifest = readJson(manifestPath, { shots: [] });
  const probeManifest = readJson(probeManifestPath, { rows: [] });
  const structuralAudit = readJson(structuralAuditPath, {});
  const battleLedger = readJson(battleLedgerPath, { rows: [] });
  const previous = readJson(path.join(outDir, "motion_probe_review_manifest.json"), { rows: [] });
  const previousById = new Map((previous.rows || []).map((row) => [row.id, row]));
  const shotById = new Map((packageManifest.shots || []).map((shot) => [shot.id, shot]));
  const ledgerByShot = new Map((battleLedger.rows || []).map((row) => [row.shot, row]));

  fs.mkdirSync(outDir, { recursive: true });
  const sourceRows = [...(probeManifest.rows || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const rows = sourceRows.map((probeRow) => {
    const packageShot = shotById.get(probeRow.id) || {};
    const ledgerRow = ledgerByShot.get(probeRow.shot) || {};
    const frameEvidence = buildReviewFrames(probeRow, previousById.get(probeRow.id));
    const ledger = ledgerSnapshot(ledgerRow);
    return {
      order: probeRow.order,
      shot: probeRow.shot,
      id: probeRow.id,
      custom_id: probeRow.custom_id,
      expected_probe_clip: probeRow.expected_probe_clip,
      parent_expected_clip: probeRow.parent_expected_clip,
      probe_duration_seconds: probeRow.probe_duration_seconds,
      parent_full_duration_seconds: probeRow.parent_full_duration_seconds,
      visible_named_only: probeRow.visible_named_only || (packageShot.visible_named_only || []).join(", "),
      primary_check: probeRow.primary_check || packageShot.primary_check || "",
      audio_anchor: probeRow.audio_anchor || "",
      clip_exists: frameEvidence.clip_exists,
      clip_probe: frameEvidence.clip_probe,
      clip_signature: frameEvidence.clip_signature,
      review_frames: frameEvidence.review_frames,
      review_frame_signatures: frameEvidence.review_frame_signatures,
      status: frameEvidence.status,
      battle_ledger_after: ledger,
      alive_safe_after: listGroups(ledger.alive_by_house),
      active_after: listGroups(ledger.active_by_house),
      limited_after: listGroups(ledger.limited_by_house),
      defeated_removed_after: listGroups(ledger.defeated_removed_by_house),
      captured_objective_defeated_after: listGroups(ledger.captured_objective_defeated_by_house),
      stood_down_post_battle_after: listGroups(ledger.stood_down_post_battle_by_house),
      must_not_return_active_after: listGroups(ledger.must_not_return_active_by_house),
      changed_this_shot: changedText(ledger.changed_this_shot),
      no_active_combat_line: ledger.no_active_combat_line,
      required_checks: requiredChecks,
      hard_rejects: hardRejectsFor(probeRow, ledger),
      problems: frameEvidence.problems,
    };
  });

  const csvHeader = [
    "order",
    "shot",
    "custom_id",
    "expected_probe_clip",
    "parent_expected_clip",
    "clip_status",
    "clip_signature",
    "review_frame_start",
    "review_frame_mid",
    "review_frame_end",
    "review_frame_signature_start",
    "review_frame_signature_mid",
    "review_frame_signature_end",
    "visible_named_only",
    "primary_check",
    "alive_safe_after",
    "active_after",
    "limited_after",
    "defeated_removed_after",
    "captured_objective_defeated_after",
    "stood_down_post_battle_after",
    "must_not_return_active_after",
    "changed_this_shot",
    "no_active_combat_line",
    "required_checks",
    "hard_rejects",
    "codex_probe_review_decision",
    "codex_probe_review_notes",
  ];
  const csvRows = rows.map((row) => [
    row.order,
    row.shot,
    row.custom_id,
    row.expected_probe_clip,
    row.parent_expected_clip,
    row.status,
    row.clip_signature,
    row.review_frames.start || "",
    row.review_frames.mid || "",
    row.review_frames.end || "",
    row.review_frame_signatures.start,
    row.review_frame_signatures.mid,
    row.review_frame_signatures.end,
    row.visible_named_only,
    row.primary_check,
    row.alive_safe_after,
    row.active_after,
    row.limited_after,
    row.defeated_removed_after,
    row.captured_objective_defeated_after,
    row.stood_down_post_battle_after,
    row.must_not_return_active_after,
    row.changed_this_shot,
    row.no_active_combat_line,
    row.required_checks.join("; "),
    row.hard_rejects.join("; "),
    "",
    "",
  ]);
  writeText(path.join(outDir, "motion_probe_review_matrix.csv"), [csvHeader, ...csvRows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n");

  const jsonl = rows.map((row) => JSON.stringify({
    order: row.order,
    shot: row.shot,
    id: row.id,
    custom_id: row.custom_id,
    expected_probe_clip: row.expected_probe_clip,
    parent_expected_clip: row.parent_expected_clip,
    probe_clip_signature: row.clip_signature,
    decision: row.clip_exists ? "needs_codex_probe_review" : "probe_clip_pending",
    reviewed_by: null,
    reviewed_at: null,
    review_evidence: {
      probe_clip_reviewed: false,
      review_frames_checked: { start: false, mid: false, end: false },
      review_frame_signatures: row.review_frame_signatures,
      probe_clip_signature_verified: false,
    },
    checks: row.required_checks.map((id) => ({ id, result: "pending", notes: "" })),
    approve_full_duration: false,
    reviewer_notes: "",
    battle_ledger_after: row.battle_ledger_after,
    alive_safe_after: row.alive_safe_after,
    active_after: row.active_after,
    limited_after: row.limited_after,
    defeated_removed_after: row.defeated_removed_after,
    captured_objective_defeated_after: row.captured_objective_defeated_after,
    stood_down_post_battle_after: row.stood_down_post_battle_after,
    must_not_return_active_after: row.must_not_return_active_after,
    changed_this_shot: row.changed_this_shot,
    no_active_combat_line: row.no_active_combat_line,
    hard_rejects: row.hard_rejects,
  })).join("\n") + "\n";
  writeText(path.join(outDir, "decision_update_template.jsonl"), jsonl);

  const expectedProbeRows = sourceRows.length;
  const playableProbeRows = rows.filter((row) => row.clip_probe.ok).length;
  const frameReadyRows = rows.filter((row) => row.status === "probe_review_frames_ready").length;
  const failedRows = rows.filter((row) => row.problems.length || /^probe_.*failed$/.test(row.status));
  const decision = playableProbeRows === 0
    ? "motion_probe_review_packet_ready_clips_pending"
    : failedRows.length
      ? "motion_probe_review_packet_blocked"
      : frameReadyRows === expectedProbeRows
        ? "motion_probe_review_packet_ready_codex_review_required"
        : "motion_probe_review_packet_partial_codex_review_required";
  const expectedProbeFileRowsValue = expectedProbeFileRows(sourceRows);
  const expectedProbeVideoRowsValue = expectedProbeVideoRows(sourceRows);
  const reviewFrameRows = rows.map((row) => ({
    order: row.order,
    shot: row.shot,
    id: row.id,
    custom_id: row.custom_id,
    status: row.status,
    review_frames: row.review_frames,
    review_frame_signatures: row.review_frame_signatures,
  }));

  const readme = [
    "# Scene09 V3 Motion Probe Codex Review Packet",
    "",
    `Decision: \`${decision}\``,
    "",
    "This packet is for the 3-second motion probe clips only. It does not approve full-duration generation by itself.",
    "",
    "## Required Release Rule",
    "",
    "- Codex must inspect every returned probe clip and the extracted start/mid/end review frames.",
    "- Every check in `decision_update_template.jsonl` must be `pass` before `approve_full_duration` can be changed to `true`.",
    "- No user/operator approval can replace Codex visual motion review.",
    "- Full-duration generation remains blocked until every returned probe passes Codex visual motion review.",
    "- If any unnamed readable person appears, or if a defeated/captured/stood-down character returns active, full-duration generation remains blocked.",
    "",
    "## Files",
    "",
    "- `motion_probe_review_matrix.csv`: per-shot probe review matrix.",
    "- `decision_update_template.jsonl`: machine-readable probe review update rows.",
    "- `frames/`: extracted start/mid/end evidence frames after real probe clips exist.",
    "- `motion_probe_review_manifest.json`: signatures and current pending/review-required state.",
    "",
    "## Current Summary",
    "",
    `- Expected probe clips: ${expectedProbeRows}`,
    `- Playable probe clips: ${playableProbeRows}`,
    `- Review frame sets ready: ${frameReadyRows}`,
    `- Full-duration approvals: 0`,
    "",
    "## Shot Rows",
    "",
    ...rows.map((row) => [
      `### ${String(row.order).padStart(2, "0")} ${row.shot}`,
      "",
      `- Status: ${row.status}`,
      `- Expected probe clip: ${row.expected_probe_clip}`,
      `- Parent full clip: ${row.parent_expected_clip}`,
      `- Visible named-only: ${row.visible_named_only || "none"}`,
      `- Alive / Safe After: ${row.alive_safe_after}`,
      `- Active / Controlling After: ${row.active_after}`,
      `- Defeated / Removed After: ${row.defeated_removed_after}`,
      `- Captured / Objective-Defeated After: ${row.captured_objective_defeated_after}`,
      `- Must Not Return Active: ${row.must_not_return_active_after}`,
      `- Hard rejects: ${row.hard_rejects.join(" | ")}`,
      "",
    ].join("\n")),
  ].join("\n");
  writeText(path.join(outDir, "README.md"), readme);

  const manifestOut = {
    version: 1,
    generated_at: new Date().toISOString(),
    decision,
    package_id: packageManifest.package_id,
    source_package_manifest: rel(manifestPath),
    source_package_manifest_sha256: sha256File(manifestPath),
    source_motion_probe_manifest: rel(probeManifestPath),
    source_motion_probe_manifest_sha256: sha256File(probeManifestPath),
    source_motion_probe_clip_structural_audit: fs.existsSync(structuralAuditPath) ? rel(structuralAuditPath) : null,
    source_motion_probe_clip_structural_decision: structuralAudit.decision || null,
    expected_probe_clips: expectedProbeRows,
    playable_probe_clips: playableProbeRows,
    review_frame_sets_ready: frameReadyRows,
    full_duration_approvals: 0,
    expected_probe_file_rows: expectedProbeFileRowsValue,
    expected_probe_file_digest_sha256: sha256Text(`${JSON.stringify(expectedProbeFileRowsValue)}\n`),
    expected_probe_video_probe_rows: expectedProbeVideoRowsValue,
    expected_probe_video_probe_digest_sha256: sha256Text(`${JSON.stringify(expectedProbeVideoRowsValue)}\n`),
    review_frame_rows: reviewFrameRows,
    review_frame_rows_digest_sha256: sha256Text(`${JSON.stringify(reviewFrameRows)}\n`),
    required_checks: requiredChecks,
    files: {
      readme: "motion_probe_review/README.md",
      matrix_csv: "motion_probe_review/motion_probe_review_matrix.csv",
      decision_update_template_jsonl: "motion_probe_review/decision_update_template.jsonl",
      manifest_json: "motion_probe_review/motion_probe_review_manifest.json",
    },
    rows,
  };
  writeJson(path.join(outDir, "motion_probe_review_manifest.json"), manifestOut);

  const pkgManifest = readJson(manifestPath);
  pkgManifest.motion_probe_review = "motion_probe_review/motion_probe_review_manifest.json";
  pkgManifest.motion_probe_review_dir = "motion_probe_review";
  writeJson(manifestPath, pkgManifest);
  updateRunbook();

  console.log(JSON.stringify({
    ok: decision !== "motion_probe_review_packet_blocked",
    decision,
    rows: rows.length,
    playable_probe_clips: playableProbeRows,
    review_frame_sets_ready: frameReadyRows,
    directory: outRel,
  }, null, 2));
  if (decision === "motion_probe_review_packet_blocked") process.exit(1);
}

main();
