#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const outJson = path.join(reportDir, `scene09_v3_production_delivery_truth_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_production_delivery_truth_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "production_delivery_truth_gate.json");
const packageOutMd = path.join(packageDir, "production_delivery_truth_gate.md");
const finalOutput = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");

function readJson(file, fallback = {}) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
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

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function abs(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
}

function probeVideoFile(file) {
  if (!fs.existsSync(file)) return { exists: false, ok: false, issue: "missing_clip" };
  const stat = fs.statSync(file);
  if (stat.size === 0) return { exists: true, ok: false, issue: "zero_byte_clip", size_bytes: 0 };
  const result = cp.spawnSync("ffprobe", [
    "-v", "error",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    file,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    return {
      exists: true,
      ok: false,
      issue: "ffprobe_failed",
      size_bytes: stat.size,
      error: result.stderr.trim() || `ffprobe exited ${result.status}`,
    };
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

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);

  const manifest = readJson(manifestPath);
  const shots = manifest.shots || [];
  const expected = Number(manifest.total_shots || shots.length || 0);
  const existingExpectedClips = shots
    .map((shot) => path.join(root, shot.expected_clip || ""))
    .filter((file) => fs.existsSync(file));
  const expectedClipFileRows = shots.map((shot) => {
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
  const expectedClipFilesDigest = sha256Text(`${JSON.stringify(expectedClipFileRows)}\n`);
  const expectedClipVideoProbeRows = shots.map((shot) => ({
    order: shot.order,
    shot: shot.shot,
    id: shot.id,
    expected_clip: shot.expected_clip,
    probe: probeVideoFile(abs(shot.expected_clip || "")),
  }));
  const expectedClipVideoProbeDigest = sha256Text(`${JSON.stringify(expectedClipVideoProbeRows)}\n`);
  const playableExpectedClips = expectedClipVideoProbeRows.filter((row) => row.probe.ok).length;

  const clipAudit = readJson(path.join(packageDir, "generated_clip_structural_audit.json"));
  const motionAssets = readJson(
    path.join(packageDir, "clip_motion_review_assets.json"),
    readJson(path.join(reportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json")),
  );
  const motionDecisions = readJson(path.join(reportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.json"));
  const motionApplyGate = readJson(path.join(packageDir, "motion_self_audit_apply_gate.json"));
  const clipProvenanceGate = readJson(path.join(packageDir, "clip_provenance_gate.json"));
  const finalConcatGate = readJson(path.join(packageDir, "final_concat_gate.json"));
  const finalEditAudit = readJson(path.join(packageDir, "final_edit_structural_audit.json"));
  const completionAudit = readJson(path.join(packageDir, "video_generation_run_completion_audit.json"));
  const positiveIsolation = readJson(path.join(packageDir, "positive_contract_isolation_gate.json"));
  const proxyMisuse = readJson(path.join(packageDir, "proxy_misuse_gate.json"));

  const finalEditExists = fs.existsSync(finalOutput);
  const finalEditOk = Boolean(finalEditAudit.ok || finalEditAudit.final_edit?.ok);
  const finalEditConcatBindingOk = finalEditAudit.final_concat_binding?.ok === true;
  const finalEditConcatSidecarOk = finalEditAudit.final_concat_sidecar?.ok === true;
  const finalEditConcatProvenanceOk = finalEditAudit.final_concat_provenance?.ok === true;
  const motionFrames = Number(motionAssets.extracted_clips || 0);
  const motionPassed = Number(motionDecisions.summary?.motion_review_passed || 0);
  const structurallyReady = Number(clipAudit.ready_clips || 0);
  const provenanceExisting = Number(clipProvenanceGate.existing_clips || 0);
  const provenanceRows = Number(clipProvenanceGate.provenance_rows || 0);

  const blocking_items = [];
  if (existingExpectedClips.length !== expected) {
    blocking_items.push(`production expected clips exist ${existingExpectedClips.length}/${expected}`);
  }
  if (playableExpectedClips !== expected) {
    blocking_items.push(`production expected clips ffprobe-playable ${playableExpectedClips}/${expected}`);
  }
  if (structurallyReady !== expected) {
    blocking_items.push(`clip structural QA ready ${structurallyReady}/${expected}`);
  }
  if (motionFrames !== expected) {
    blocking_items.push(`motion-review frame sets extracted ${motionFrames}/${expected}`);
  }
  if (motionPassed !== expected) {
    blocking_items.push(`Codex motion self-audit passed ${motionPassed}/${expected}`);
  }
  if (provenanceExisting !== expected || provenanceRows !== expected) {
    blocking_items.push(`clip provenance existing ${provenanceExisting}/${expected}, provenance rows ${provenanceRows}/${expected}`);
  }
  if (motionApplyGate.decision !== "motion_self_audit_apply_passed") {
    blocking_items.push(`motion self-audit apply gate ${motionApplyGate.decision || "missing"}`);
  }
  if (finalConcatGate.decision !== "final_concat_gate_passed_ready_for_project_pipeline_concat") {
    blocking_items.push(`final concat gate ${finalConcatGate.decision || "missing"}`);
  }
  if (!finalEditExists || !finalEditOk || !finalEditConcatBindingOk || !finalEditConcatSidecarOk || !finalEditConcatProvenanceOk) {
    blocking_items.push(`production final edit ${finalEditExists ? "exists_but_not_structural_passed" : "absent"}`);
  }
  if (finalEditExists && finalEditAudit.final_output !== rel(finalOutput)) {
    blocking_items.push(`final edit structural audit path ${finalEditAudit.final_output || "missing"} does not match production final output`);
  }
  if (finalEditExists && !finalEditAudit.final_edit?.sha256) {
    blocking_items.push("final edit structural audit missing production final SHA-256");
  }
  const canClaimVideoGenerationRun = blocking_items.length === 0;
  const decision = canClaimVideoGenerationRun
    ? "production_delivery_truth_passed"
    : existingExpectedClips.length === 0
      ? "production_delivery_truth_blocked_clips_pending"
      : "production_delivery_truth_blocked_incomplete_real_evidence";

  const report = {
    date,
    decision,
    package_manifest: rel(manifestPath),
    highest_truthful_target: canClaimVideoGenerationRun ? "video_generation_run" : "prompt_asset_package",
    can_claim_video_generation_run: canClaimVideoGenerationRun,
    can_claim_final_edit: canClaimVideoGenerationRun,
    expected_shots: expected,
    real_evidence: {
      expected_clip_files_existing: existingExpectedClips.length,
      expected_clip_files_required: expected,
      structurally_ready_clips: structurallyReady,
      motion_review_frame_sets: motionFrames,
      codex_motion_review_passed: motionPassed,
      provenance_existing_clips: provenanceExisting,
      provenance_rows: provenanceRows,
      expected_clip_file_rows: expectedClipFileRows,
      expected_clip_files_digest_sha256: expectedClipFilesDigest,
      expected_clip_video_probe_rows: expectedClipVideoProbeRows,
      expected_clip_video_probe_digest_sha256: expectedClipVideoProbeDigest,
      expected_clip_video_probe_playable: playableExpectedClips,
      expected_clip_video_probe_required: expected,
      final_output: rel(finalOutput),
      final_output_exists: finalEditExists,
      final_edit_structural_ok: finalEditOk,
      final_edit_concat_binding_ok: finalEditConcatBindingOk,
      final_edit_concat_sidecar_ok: finalEditConcatSidecarOk,
      final_edit_concat_provenance_ok: finalEditConcatProvenanceOk,
      final_edit_concat_sidecar: finalEditAudit.final_concat_sidecar?.file || null,
      final_edit_concat_sidecar_sha256: finalEditAudit.final_concat_sidecar?.sha256 || null,
      final_edit_concat_provenance: finalEditAudit.final_concat_provenance?.file || null,
      final_edit_concat_provenance_digest_sha256: finalEditAudit.final_concat_provenance?.expected_clip_file_rows_digest_sha256 || null,
      final_edit_structural_sha256: finalEditAudit.final_edit?.sha256 || null,
      final_edit_structural_report_output: finalEditAudit.final_output || null,
    },
    source_decisions: {
      generated_clip_structural_audit: clipAudit.decision || null,
      clip_motion_review_assets: motionAssets.decision || null,
      clip_motion_review_decisions: motionDecisions.decision || null,
      motion_self_audit_apply_gate: motionApplyGate.decision || null,
      clip_provenance_gate: clipProvenanceGate.decision || null,
      final_concat_gate: finalConcatGate.decision || null,
      final_edit_structural_audit: finalEditAudit.decision || null,
      video_generation_run_completion_audit: completionAudit.decision || null,
      positive_contract_isolation_gate: positiveIsolation.decision || null,
      proxy_misuse_gate: proxyMisuse.decision || null,
    },
    boundary_rules: [
      "Positive-contract reports prove temporary-fixture positive paths only; they do not count as production clips, production motion approvals, or a production final edit.",
      "Proxy animatic clips are reference-only and must never satisfy expected_clip paths or final edit evidence.",
      "This truth gate is an input to the final completion audit. It checks real production evidence and does not require the completion audit to have already passed, avoiding circular approval.",
      "A production completion claim requires current expected clips, clip structural QA, signed Codex motion evidence, provenance, concat gate, final edit structural QA, and the final completion audit to pass together.",
      "When the production final edit exists, the structural audit must point at the production final output path and record the final mp4 SHA-256.",
      "When the production final edit exists, the structural audit must also prove final concat input signatures and the final concat gate are bound to the current package manifest.",
      "When the production final edit exists, a concat-list sidecar beside the mp4 must exactly match the current package manifest concat list.",
      "When the production final edit exists, a concat provenance sidecar must bind the final mp4 SHA-256, concat-list SHA-256, source expected-clip SHA rows, and concat producer.",
    ],
    blocking_items,
  };

  const md = [
    "# Scene09 V3 Production Delivery Truth Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Highest truthful target: ${report.highest_truthful_target}`,
    `Can claim video_generation_run: ${canClaimVideoGenerationRun ? "yes" : "no"}`,
    "",
    "## Real Evidence",
    "",
    `- Expected clip files: ${existingExpectedClips.length}/${expected}`,
    `- Expected clip ffprobe-playable videos: ${playableExpectedClips}/${expected}`,
    `- Structurally ready clips: ${structurallyReady}/${expected}`,
    `- Motion-review frame sets: ${motionFrames}/${expected}`,
    `- Codex motion review passed: ${motionPassed}/${expected}`,
    `- Clip provenance: existing ${provenanceExisting}/${expected}, rows ${provenanceRows}/${expected}`,
    `- Expected clip files digest SHA-256: ${expectedClipFilesDigest}`,
    `- Expected clip ffprobe digest SHA-256: ${expectedClipVideoProbeDigest}`,
    `- Final output: \`${rel(finalOutput)}\``,
    `- Final output exists: ${finalEditExists ? "yes" : "no"}`,
    `- Final edit structural OK: ${finalEditOk ? "yes" : "no"}`,
    `- Final edit concat binding OK: ${finalEditConcatBindingOk ? "yes" : "no"}`,
    `- Final edit concat sidecar OK: ${finalEditConcatSidecarOk ? "yes" : "no"}`,
    `- Final edit concat provenance OK: ${finalEditConcatProvenanceOk ? "yes" : "no"}`,
    `- Final edit structural SHA-256: ${finalEditAudit.final_edit?.sha256 || "missing"}`,
    "",
    "## Boundary Rules",
    "",
    ...report.boundary_rules.map((line) => `- ${line}`),
    "",
    "## Blocking Items",
    "",
    ...(blocking_items.length ? blocking_items.map((line) => `- ${line}`) : ["- none"]),
    "",
  ].join("\n");

  writeJson(outJson, report);
  writeText(outMd, md);
  writeJson(packageOutJson, report);
  writeText(packageOutMd, md);
  process.stdout.write(`${JSON.stringify({
    decision,
    can_claim_video_generation_run: canClaimVideoGenerationRun,
    expected_shots: expected,
    expected_clip_files_existing: existingExpectedClips.length,
    final_output_exists: finalEditExists,
    blocking_items: blocking_items.length,
    report_json: rel(outJson),
  }, null, 2)}\n`);
}

main();
