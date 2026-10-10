#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const sourcePackageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const sourceBattleLedgerPath = path.join(reportDir, "scene09_v3_battle_ledger_timeline_2026-07-28.json");
const manifestPath = path.join(sourcePackageDir, "package_manifest.json");
const productionFinalOutput = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");
const outJson = path.join(reportDir, `scene09_v3_after_clip_return_resume_positive_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_after_clip_return_resume_positive_contract_${date}.md`);
const packageOutJson = path.join(sourcePackageDir, "after_clip_return_resume_positive_contract.json");
const packageOutMd = path.join(sourcePackageDir, "after_clip_return_resume_positive_contract.md");

const REQUIRED_CHECK_IDS = [
  "visible_named_only_match",
  "no_unnamed_readable_humans",
  "no_illegal_reentry",
  "capture_continuity_locked",
  "teacher_lane_separation",
  "shot034b_empty_objective_only",
  "shot034g_exhausted_core_only",
  "nonlethal_mock_battle",
  "identity_costume_weapon_lock",
  "screen_direction_and_camera_lock",
  "end_frame_hold",
  "no_visible_text_or_watermark",
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readJsonMaybe(file, fallback = {}) {
  return fs.existsSync(file) ? readJson(file) : fallback;
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

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function signature(relativeFile, includePath = false) {
  const absolute = path.join(root, relativeFile);
  const stat = fs.statSync(absolute);
  const base = {
    size_bytes: stat.size,
    mtime_ms: Math.trunc(stat.mtimeMs),
    sha256: sha256(absolute),
  };
  return includePath ? { path: relativeFile, ...base } : base;
}

function createClipFixture(file, durationSeconds) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const result = cp.spawnSync("ffmpeg", [
    "-y",
    "-f", "lavfi",
    "-i", `color=c=black:s=160x90:r=12:d=${durationSeconds}`,
    "-an",
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    file,
  ], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(`ffmpeg resume fixture failed: ${result.error?.message || result.stderr || result.status}`);
  }
}

function runResume(label, tmpPackageDir, tmpReportDir, tmpFinalOutput, argvTail) {
  const result = cp.spawnSync(process.execPath, [
    "scripts/resume_scene09_v3_after_clip_return.js",
    ...argvTail,
  ], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: tmpPackageDir,
      SCENE09_V3_REPORT_DIR: tmpReportDir,
      SCENE09_V3_FINAL_OUTPUT: tmpFinalOutput,
    },
  });
  const resumeReportPath = path.join(tmpReportDir, "scene09_v3_after_clip_return_resume_2026-08-01.json");
  return {
    label,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    report: fs.existsSync(resumeReportPath) ? readJson(resumeReportPath) : null,
  };
}

function rewriteManifestForTempClips(tmpRoot, tmpPackageDir) {
  const manifestFile = path.join(tmpPackageDir, "package_manifest.json");
  const manifest = readJson(manifestFile);
  const expectedDir = path.join(tmpRoot, "expected_clips");
  manifest.package_id = `${manifest.package_id}_resume_positive_contract_fixture`;
  manifest.source_manifest = rel(manifestPath);
  manifest.shots = (manifest.shots || []).map((shot) => ({
    ...shot,
    expected_clip: rel(path.join(expectedDir, `${String(shot.order).padStart(3, "0")}_${shot.shot}.mp4`)),
  }));
  writeJson(manifestFile, manifest);
  writeTempFinalConcatInputsContract(tmpPackageDir, manifest);
  return manifest;
}

function writeTempFinalConcatInputsContract(tmpPackageDir, manifest) {
  const shots = [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const rows = shots.map((shot) => ({
    order: Number(shot.order),
    shot: shot.shot,
    id: shot.id,
    duration_seconds: Number(shot.duration_seconds || 0),
    expected_clip: shot.expected_clip,
    expected_clip_absolute: path.join(root, shot.expected_clip),
    concat_list_line: `file '${path.join(root, shot.expected_clip).replace(/'/g, "'\\''")}'`,
    problems: [],
  }));
  const concatListText = rows.map((row) => row.concat_list_line).join("\n") + "\n";
  const orderedClipText = rows.map((row) => `${row.order},${row.shot},${row.id},${row.duration_seconds},${row.expected_clip}`).join("\n") + "\n";
  const contract = {
    date,
    package_id: manifest.package_id,
    package_manifest: path.relative(root, path.join(tmpPackageDir, "package_manifest.json")),
    decision: "final_concat_inputs_contract_passed",
    scope: "temporary resume positive-contract fixture; locks fixture expected_clip order without writing production clips",
    expected_shots: Number(manifest.total_shots || rows.length),
    rows_checked: rows.length,
    unique_expected_clips: new Set(rows.map((row) => row.expected_clip)).size,
    expected_duration_seconds: Number(manifest.total_duration_seconds || 0),
    duration_sum_seconds: rows.reduce((sum, row) => sum + row.duration_seconds, 0),
    ordered_clip_signature_sha256: sha256Text(orderedClipText),
    concat_list_preview_sha256: sha256Text(concatListText),
    concat_list_preview: concatListText,
    problems: [],
    rows,
  };
  writeJson(path.join(tmpPackageDir, "final_concat_inputs_contract.json"), contract);
  writeText(path.join(tmpPackageDir, "final_concat_inputs_contract.md"), [
    "# Scene09 V3 Final Concat Inputs Contract",
    "",
    `Date: ${date}`,
    "Decision: final_concat_inputs_contract_passed",
    "",
    "Temporary resume positive-contract fixture. Production concat still requires the project pipeline contract.",
    "",
  ].join("\n"));
}

function prepareDownloads(tmpRoot, manifest) {
  const downloadDir = path.join(tmpRoot, "clip_return_intake");
  const fixture = path.join(tmpRoot, "fixture_6s.mp4");
  createClipFixture(fixture, 6);
  const shots = manifest.shots || [];
  for (let batchIndex = 0; batchIndex < 7; batchIndex += 1) {
    const start = batchIndex * 6;
    const end = start + 6;
    const returnDir = path.join(
      downloadDir,
      `batch_${String(batchIndex + 1).padStart(3, "0")}_shots_${String(start + 1).padStart(3, "0")}-${String(end).padStart(3, "0")}_returns`,
      "returned_mp4",
    );
    fs.mkdirSync(returnDir, { recursive: true });
    for (const shot of shots.slice(start, end)) {
      fs.copyFileSync(fixture, path.join(returnDir, path.basename(shot.expected_clip)));
    }
  }
  return downloadDir;
}

function buildMotionProposal(tmpReportDir, tmpPackageDir, proposalPath) {
  const motionAssets = readJson(path.join(tmpReportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json"));
  const templatePath = path.join(tmpPackageDir, "motion_self_audit", "decision_update_template.jsonl");
  const templateById = new Map(
    fs.readFileSync(templatePath, "utf8")
      .trim()
      .split(/\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .map((row) => [row.id, row])
  );
  const rows = (motionAssets.rows || []).map((row) => ({
    order: row.order,
    shot: row.shot,
    id: row.id,
    expected_clip: row.expected_clip,
    clip_signature: signature(row.expected_clip),
    decision: "motion_review_passed",
    reviewed_by: "codex_self_audit",
    reviewed_at: "2026-08-01T00:00:00.000Z",
    review_evidence: {
      full_clip_reviewed: true,
      review_frames_checked: { start: true, mid: true, end: true },
      clip_signature_verified: true,
      review_frame_signatures: {
        start: signature(row.review_frames.start, true),
        mid: signature(row.review_frames.mid, true),
        end: signature(row.review_frames.end, true),
      },
    },
    checks: REQUIRED_CHECK_IDS.map((id) => ({
      id,
      result: "pass",
      notes: "temporary resume positive-contract fixture; production rows still require real clip inspection",
    })),
    reviewer_notes: "Temporary positive-contract fixture row proving the resume wrapper accepts current signed Codex evidence; not a production visual approval.",
    battle_ledger_after: templateById.get(row.id)?.battle_ledger_after || {},
    alive_safe_after: templateById.get(row.id)?.alive_safe_after || "",
    active_after: templateById.get(row.id)?.active_after || "",
    limited_after: templateById.get(row.id)?.limited_after || "",
    defeated_removed_after: templateById.get(row.id)?.defeated_removed_after || "",
    captured_objective_defeated_after: templateById.get(row.id)?.captured_objective_defeated_after || "",
    stood_down_post_battle_after: templateById.get(row.id)?.stood_down_post_battle_after || "",
    must_not_return_active_after: templateById.get(row.id)?.must_not_return_active_after || "",
    changed_this_shot: templateById.get(row.id)?.changed_this_shot || "",
    no_active_combat_line: templateById.get(row.id)?.no_active_combat_line || "none",
  }));
  writeText(proposalPath, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`);
  return rows.length;
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const productionExistedBefore = fs.existsSync(productionFinalOutput);
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09-v3-resume-positive-"));
  const tmpPackageDir = path.join(tmpRoot, "package");
  const tmpReportDir = path.join(tmpRoot, "reports");
  const tmpFinalOutput = path.join(tmpRoot, "final", "scene09_v3_attrition_final_edit.mp4");
  fs.cpSync(sourcePackageDir, tmpPackageDir, { recursive: true });
  fs.mkdirSync(tmpReportDir, { recursive: true });
  fs.copyFileSync(sourceBattleLedgerPath, path.join(tmpReportDir, "scene09_v3_battle_ledger_timeline_2026-07-28.json"));

  const manifest = rewriteManifestForTempClips(tmpRoot, tmpPackageDir);
  const expected = Number(manifest.total_shots || (manifest.shots || []).length || 42);
  const downloadDir = prepareDownloads(tmpRoot, manifest);

  const ingestRun = runResume("ingest_and_frame_probe", tmpPackageDir, tmpReportDir, tmpFinalOutput, [
    "--input",
    downloadDir,
    "--apply-ingest",
  ]);
  const proposalPath = path.join(tmpRoot, "signed_motion_proposal.jsonl");
  const proposalRows = ingestRun.report ? buildMotionProposal(tmpReportDir, tmpPackageDir, proposalPath) : 0;
  const applyRun = runResume("apply_motion_and_ready_for_concat", tmpPackageDir, tmpReportDir, tmpFinalOutput, [
    "--motion-proposal",
    proposalPath,
    "--apply-motion",
  ]);

  const finalResume = applyRun.report || {};
  const finalConcatGate = fs.existsSync(path.join(tmpReportDir, "scene09_v3_final_concat_gate_2026-08-01.json"))
    ? readJson(path.join(tmpReportDir, "scene09_v3_final_concat_gate_2026-08-01.json"))
    : {};
  const revisionQueue = fs.existsSync(path.join(tmpReportDir, "scene09_v3_clip_revision_queue_2026-07-28.json"))
    ? readJson(path.join(tmpReportDir, "scene09_v3_clip_revision_queue_2026-07-28.json"))
    : {};
  const productionExistsAfter = fs.existsSync(productionFinalOutput);
  const problems = [];
  if (ingestRun.status !== 0) problems.push(`ingest resume exited ${ingestRun.status}: ${(ingestRun.stderr || "").trim()}`);
  if (!ingestRun.report) problems.push("ingest resume did not write a report");
  if (ingestRun.report && !["after_clip_return_codex_motion_self_audit_required", "after_clip_return_revision_queue_not_clear"].includes(ingestRun.report.decision)) {
    problems.push(`ingest resume decision ${ingestRun.report.decision || "missing"} was not a motion-review-required state`);
  }
  if (proposalRows !== expected) problems.push(`proposal rows ${proposalRows}/${expected}`);
  if (applyRun.status !== 0) problems.push(`apply resume exited ${applyRun.status}: ${(applyRun.stderr || "").trim()}`);
  if (!applyRun.report) problems.push("apply resume did not write a report");
  if (finalResume.decision !== "after_clip_return_ready_for_concat") {
    problems.push(`final resume decision ${finalResume.decision || "missing"} is not after_clip_return_ready_for_concat`);
  }
  if (finalResume.snapshot?.clip_structural?.ready_clips !== expected) {
    problems.push(`ready clips ${finalResume.snapshot?.clip_structural?.ready_clips || 0}/${expected}`);
  }
  if (finalResume.snapshot?.motion_review_assets?.extracted_clips !== expected) {
    problems.push(`motion frames ${finalResume.snapshot?.motion_review_assets?.extracted_clips || 0}/${expected}`);
  }
  if (finalConcatGate.decision !== "final_concat_gate_passed_ready_for_project_pipeline_concat") {
    problems.push(`final concat gate ${finalConcatGate.decision || "missing"}`);
  }
  if (Number(revisionQueue.actionable_shots || 0) !== 0) {
    problems.push(`revision queue actionable ${revisionQueue.actionable_shots}`);
  }
  if (productionExistedBefore !== productionExistsAfter) {
    problems.push("production final output existence changed during resume positive contract");
  }

  const decision = problems.length
    ? "after_clip_return_resume_positive_contract_failed"
    : "after_clip_return_resume_positive_contract_passed";
  const tempFixtureCleaned = !problems.length;
  if (tempFixtureCleaned) {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
  const report = {
    date,
    decision,
    expected_shots: expected,
    scope: "temporary nested clip_return_intake fixture; proves resume wrapper can recursively ingest all 7 returned batch folders, apply signed Codex motion evidence, and reach ready-for-concat without writing production clips or final edit",
    fixture_download_shape: "nested_clip_return_intake_root_with_7_returned_mp4_dirs",
    fixture_package_dir: tmpPackageDir,
    fixture_report_dir: tmpReportDir,
    fixture_download_dir: downloadDir,
    fixture_final_output: tmpFinalOutput,
    temp_fixture_cleaned: tempFixtureCleaned,
    production_final_output: rel(productionFinalOutput),
    production_existed_before: productionExistedBefore,
    production_exists_after: productionExistsAfter,
    ingest_resume: {
      status: ingestRun.status,
      decision: ingestRun.report?.decision || null,
      completion_decision: ingestRun.report?.snapshot?.video_generation_run_completion?.decision || null,
      clips_ready: ingestRun.report?.snapshot?.clip_structural?.ready_clips || 0,
      motion_frames: ingestRun.report?.snapshot?.motion_review_assets?.extracted_clips || 0,
    },
    apply_resume: {
      status: applyRun.status,
      decision: applyRun.report?.decision || null,
      completion_decision: applyRun.report?.snapshot?.video_generation_run_completion?.decision || null,
      clips_ready: applyRun.report?.snapshot?.clip_structural?.ready_clips || 0,
      motion_frames: applyRun.report?.snapshot?.motion_review_assets?.extracted_clips || 0,
      final_concat_gate: finalConcatGate.decision || null,
      final_concat_checks: finalConcatGate.checks || [],
      motion_self_audit_apply_gate: readJsonMaybe(path.join(tmpReportDir, "scene09_v3_motion_self_audit_apply_gate_2026-08-01.json"), {}),
      clip_provenance_gate: readJsonMaybe(path.join(tmpReportDir, "scene09_v3_clip_provenance_gate_2026-08-01.json"), {}),
      revision_queue_actionable: revisionQueue.actionable_shots || 0,
    },
    proposal_rows: proposalRows,
    problems,
  };
  writeJson(outJson, report);
  writeJson(packageOutJson, {
    ...report,
    fixture_package_dir: path.basename(tmpPackageDir),
    fixture_report_dir: path.basename(tmpReportDir),
    fixture_download_dir: path.basename(downloadDir),
    fixture_final_output: path.basename(tmpFinalOutput),
    production_report_json: rel(outJson),
  });
  const md = [
    "# Scene09 V3 After Clip Return Resume Positive Contract",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Expected shots: ${expected}`,
    "",
    "This is a temporary returned-clip contract test. It proves the real after-clip-return resume wrapper can recursively ingest exact expected filenames from a nested `clip_return_intake` root containing 7 returned batch folders, extract motion review frames, accept signed Codex motion evidence, clear the revision queue, and reach `after_clip_return_ready_for_concat`. It does not write production clips, production motion approvals, or a production final edit.",
    "",
    "## Resume Results",
    "",
    `- Ingest resume: ${report.ingest_resume.decision}`,
    `- Apply resume: ${report.apply_resume.decision}`,
    `- Clips ready: ${report.apply_resume.clips_ready}/${expected}`,
    `- Motion frames: ${report.apply_resume.motion_frames}/${expected}`,
    `- Final concat gate: ${report.apply_resume.final_concat_gate}`,
    `- Revision queue actionable: ${report.apply_resume.revision_queue_actionable}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  process.stdout.write(`${JSON.stringify({
    decision,
    expected_shots: expected,
    ingest_decision: report.ingest_resume.decision,
    apply_decision: report.apply_resume.decision,
    clips_ready: `${report.apply_resume.clips_ready}/${expected}`,
    motion_frames: `${report.apply_resume.motion_frames}/${expected}`,
    final_concat_gate: report.apply_resume.final_concat_gate,
    production_final_output_changed: productionExistedBefore !== productionExistsAfter,
    fixture_download_shape: report.fixture_download_shape,
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

main();
