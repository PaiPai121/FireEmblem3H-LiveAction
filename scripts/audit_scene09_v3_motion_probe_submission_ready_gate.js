#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-09";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");

const packageManifestPath = path.join(packageDir, "package_manifest.json");
const probeManifestPath = path.join(packageDir, "motion_probe_submission/motion_probe_manifest.json");
const providerManifestPath = path.join(packageDir, "motion_probe_provider_bundles/motion_probe_provider_bundles_manifest.json");
const providerAuditPath = path.join(packageDir, "motion_probe_provider_bundles_audit.json");
const trackerPath = path.join(packageDir, "motion_probe_operator_tracker.json");
const trackerAuditPath = path.join(packageDir, "motion_probe_operator_tracker_audit.json");
const returnIntakeManifestPath = path.join(packageDir, "motion_probe_return_intake/motion_probe_return_intake_manifest.json");
const returnIntakeAuditPath = path.join(packageDir, "motion_probe_return_intake_audit.json");
const returnRoundtripAuditPath = path.join(packageDir, "motion_probe_return_roundtrip_audit.json");
const fullLocalVisualReviewPath = path.join(packageDir, "full_local_visual_review.json");
const fullDurationReleaseGatePath = path.join(packageDir, "full_duration_release_gate.json");
const operatorNextStepsPath = path.join(packageDir, "OPERATOR_NEXT_STEPS.json");
const operatorPreflightPath = path.join(packageDir, "operator_preflight_status.json");
const providerIndexPath = path.join(packageDir, "motion_probe_provider_bundles/index.html");

const outJson = path.join(reportDir, `scene09_v3_motion_probe_submission_ready_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_motion_probe_submission_ready_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "motion_probe_submission_ready_gate.json");
const packageOutMd = path.join(packageDir, "motion_probe_submission_ready_gate.md");

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
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

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function fileInfo(file) {
  if (!fs.existsSync(file)) return { exists: false, bytes: 0, sha256: null };
  const stat = fs.statSync(file);
  return { exists: true, bytes: stat.size, sha256: sha256(file) };
}

function shotFrameAnchorRows(packageManifest) {
  const rows = [];
  for (const shot of packageManifest.shots || []) {
    const shotDir = path.join(packageDir, shot.package_dir || "");
    const frames = {
      start_frame: path.join(shotDir, "start_frame.png"),
      key_frame: path.join(shotDir, "key_frame.png"),
      end_frame: path.join(shotDir, "end_frame.png"),
    };
    const infos = Object.fromEntries(Object.entries(frames).map(([key, file]) => [key, fileInfo(file)]));
    const duplicate_pairs = [];
    if (infos.start_frame.exists && infos.key_frame.exists && infos.start_frame.sha256 === infos.key_frame.sha256) duplicate_pairs.push("start_frame=key_frame");
    if (infos.key_frame.exists && infos.end_frame.exists && infos.key_frame.sha256 === infos.end_frame.sha256) duplicate_pairs.push("key_frame=end_frame");
    if (infos.start_frame.exists && infos.end_frame.exists && infos.start_frame.sha256 === infos.end_frame.sha256) duplicate_pairs.push("start_frame=end_frame");
    rows.push({
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      package_dir: shot.package_dir,
      duplicate_pairs,
      file_sha256: {
        start_frame: infos.start_frame.sha256,
        key_frame: infos.key_frame.sha256,
        end_frame: infos.end_frame.sha256,
      },
      source_frames: shot.source_frames || {},
    });
  }
  return rows.sort((a, b) => Number(a.order) - Number(b.order));
}

function zipEntries(zipFile) {
  if (!fs.existsSync(zipFile)) return [];
  try {
    return cp.execFileSync("/usr/bin/unzip", ["-Z1", zipFile], { encoding: "utf8" })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function csvRows(file) {
  return readText(file)
    .split(/\r?\n/)
    .filter(Boolean);
}

function main() {
  const problems = [];
  const warnings = [];
  const packageManifest = readJson(packageManifestPath, { shots: [] });
  const probeManifest = readJson(probeManifestPath, { rows: [] });
  const providerManifest = readJson(providerManifestPath, { bundles: [] });
  const providerAudit = readJson(providerAuditPath, {});
  const tracker = readJson(trackerPath, { rows: [] });
  const trackerAudit = readJson(trackerAuditPath, {});
  const returnIntake = readJson(returnIntakeManifestPath, { batches: [] });
  const returnIntakeAudit = readJson(returnIntakeAuditPath, {});
  const returnRoundtripAudit = readJson(returnRoundtripAuditPath, {});
  const fullLocalVisualReview = readJson(fullLocalVisualReviewPath, {});
  const fullDurationRelease = readJson(fullDurationReleaseGatePath, {});
  const operatorNextSteps = readJson(operatorNextStepsPath, {});
  const operatorPreflight = readJson(operatorPreflightPath, {});
  const providerIndexHtml = readText(providerIndexPath);

  const expected = Number(packageManifest.total_shots || 42);
  const probeRows = Array.isArray(probeManifest.rows) ? probeManifest.rows : [];
  const bundles = Array.isArray(providerManifest.bundles) ? providerManifest.bundles : [];
  const trackerRows = Array.isArray(tracker.rows) ? tracker.rows : [];
  const returnBatches = Array.isArray(returnIntake.batches) ? returnIntake.batches : [];
  const frameAnchorRows = shotFrameAnchorRows(packageManifest);
  const duplicateAnchorRows = frameAnchorRows.filter((row) => row.duplicate_pairs.length);

  if (expected !== 42) problems.push(`package manifest expected shots ${expected} is not 42`);
  if (frameAnchorRows.length !== expected) problems.push(`frame anchor rows ${frameAnchorRows.length} does not match ${expected}`);
  for (const row of duplicateAnchorRows) {
    problems.push(`${row.shot}: exact duplicate frame anchors ${row.duplicate_pairs.join(", ")}`);
  }
  if (probeManifest.decision !== "motion_probe_package_ready") problems.push(`motion_probe_manifest decision ${probeManifest.decision || "missing"} is not motion_probe_package_ready`);
  if (Number(probeManifest.probe_duration_seconds || 0) !== 3) problems.push("motion probe manifest duration is not 3 seconds");
  if (probeRows.length !== expected) problems.push(`motion probe manifest rows ${probeRows.length} does not match ${expected}`);
  if (providerManifest.decision !== "motion_probe_provider_bundles_ready") problems.push(`provider manifest decision ${providerManifest.decision || "missing"} is not motion_probe_provider_bundles_ready`);
  if (providerAudit.decision !== "motion_probe_provider_bundles_ready") problems.push(`provider audit decision ${providerAudit.decision || "missing"} is not motion_probe_provider_bundles_ready`);
  if (Number(providerAudit.problems?.length || 0) !== 0) problems.push(`provider audit carries ${providerAudit.problems.length} problems`);
  if (bundles.length !== 7) problems.push(`provider bundles ${bundles.length} does not match 7`);
  if (Number(providerManifest.total_shots || 0) !== expected) problems.push(`provider manifest total_shots ${providerManifest.total_shots || 0} does not match ${expected}`);

  const probeIds = new Set(probeRows.map((row) => row.custom_id));
  const bundleIds = new Set();
  const bundleRows = [];
  let totalBundleRows = 0;
  let zipBytes = 0;
  for (const bundle of bundles) {
    const rowProblems = [];
    const zipPath = path.join(packageDir, bundle.zip || "");
    const directory = path.join(packageDir, bundle.directory || "");
    const zipInfo = fileInfo(zipPath);
    const entries = zipEntries(zipPath);
    const expectedDownloads = path.join(directory, "expected_probe_downloads.csv");
    const returnContract = path.join(directory, "PROBE_RETURN_CONTRACT.md");
    const uploadChecklist = path.join(directory, "ORDERED_PROBE_UPLOAD_CHECKLIST.md");
    const batchJsonl = path.join(directory, "probe_batch.jsonl");
    const batchRows = readText(batchJsonl).trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
    totalBundleRows += batchRows.length;
    zipBytes += zipInfo.bytes;
    if (!zipInfo.exists) rowProblems.push("zip missing");
    if (zipInfo.exists && bundle.zip_digest?.sha256 && zipInfo.sha256 !== bundle.zip_digest.sha256) rowProblems.push("zip sha256 differs from manifest");
    if (!fs.existsSync(directory)) rowProblems.push("bundle directory missing");
    if (!fs.existsSync(expectedDownloads)) rowProblems.push("expected_probe_downloads.csv missing");
    if (!fs.existsSync(returnContract)) rowProblems.push("PROBE_RETURN_CONTRACT.md missing");
    if (!fs.existsSync(uploadChecklist)) rowProblems.push("ORDERED_PROBE_UPLOAD_CHECKLIST.md missing");
    if (csvRows(expectedDownloads).length !== Number(bundle.rows || 0) + 1) rowProblems.push("expected_probe_downloads.csv row count mismatch");
    if (!readText(returnContract).includes("Full-duration generation remains blocked")) rowProblems.push("return contract does not block full-duration generation");
    if (!readText(uploadChecklist).includes("3-second")) rowProblems.push("upload checklist does not state 3-second probe");
    for (const file of ["probe_batch.jsonl", "probe_batch.csv", "expected_probe_downloads.csv", "ORDERED_PROBE_UPLOAD_CHECKLIST.md", "PROBE_RETURN_CONTRACT.md", "probe_bundle_manifest.json"]) {
      if (!entries.includes(file)) rowProblems.push(`zip missing ${file}`);
    }
    for (const row of batchRows) {
      if (!probeIds.has(row.custom_id)) rowProblems.push(`row ${row.custom_id} is not in source probe manifest`);
      if (Number(row.probe_duration_seconds || 0) !== 3) rowProblems.push(`row ${row.custom_id} is not 3 seconds`);
      if (!String(row.expected_probe_clip || "").endsWith("_probe.mp4")) rowProblems.push(`row ${row.custom_id} expected output is not _probe.mp4`);
      bundleIds.add(row.custom_id);
    }
    if (rowProblems.length) problems.push(`${bundle.batch_id || bundle.zip}: ${rowProblems.join("; ")}`);
    bundleRows.push({
      batch_id: bundle.batch_id,
      zip: bundle.zip,
      zip_exists: zipInfo.exists,
      zip_bytes: zipInfo.bytes,
      rows: batchRows.length,
      expected_download_rows: Math.max(0, csvRows(expectedDownloads).length - 1),
      problems: rowProblems,
    });
  }
  if (totalBundleRows !== expected) problems.push(`total bundled probe rows ${totalBundleRows} does not match ${expected}`);
  if (bundleIds.size !== expected) problems.push(`unique bundled custom ids ${bundleIds.size} does not match ${expected}`);
  for (const id of probeIds) {
    if (!bundleIds.has(id)) problems.push(`source probe custom id ${id} missing from provider bundles`);
  }

  if (tracker.decision !== "motion_probe_operator_tracker_ready_clips_pending") problems.push(`tracker decision ${tracker.decision || "missing"} is not ready_clips_pending`);
  if (trackerRows.length !== expected) problems.push(`tracker rows ${trackerRows.length} does not match ${expected}`);
  if (Number(tracker.returned_mp4_ready || 0) !== 0) problems.push(`tracker returned_mp4_ready ${tracker.returned_mp4_ready || 0} should be 0 before submission`);
  if (Number(tracker.ingested_probe_ready || 0) !== 0) problems.push(`tracker ingested_probe_ready ${tracker.ingested_probe_ready || 0} should be 0 before submission`);
  if (trackerAudit.decision !== "motion_probe_operator_tracker_audit_passed") problems.push(`tracker audit decision ${trackerAudit.decision || "missing"} is not passed`);
  if (returnIntake.status !== "awaiting_motion_probe_downloads") problems.push(`return intake status ${returnIntake.status || "missing"} is not awaiting_motion_probe_downloads`);
  if (returnBatches.length !== 7) problems.push(`return intake batches ${returnBatches.length} does not match 7`);
  if (Number(returnIntake.total_expected_probes || 0) !== expected) problems.push(`return intake expected probes ${returnIntake.total_expected_probes || 0} does not match ${expected}`);
  for (const batch of returnBatches) {
    const returnedDir = path.join(packageDir, batch.returned_mp4_dir || "");
    const subset = path.join(packageDir, batch.expected_probe_downloads_subset || "");
    if (!fs.existsSync(returnedDir)) problems.push(`${batch.batch_id}: returned_mp4_dir missing`);
    if (!fs.existsSync(subset)) problems.push(`${batch.batch_id}: expected_probe_downloads_subset missing`);
  }
  if (returnIntakeAudit.decision !== "motion_probe_return_intake_ready") problems.push(`return intake audit decision ${returnIntakeAudit.decision || "missing"} is not ready`);
  if (returnRoundtripAudit.decision !== "motion_probe_return_roundtrip_passed") problems.push(`return roundtrip decision ${returnRoundtripAudit.decision || "missing"} is not passed`);

  if (fullLocalVisualReview.decision !== "full_local_visual_review_passed_for_motion_probe_not_video_approved") problems.push(`full local visual review decision ${fullLocalVisualReview.decision || "missing"} is not probe-only passed`);
  if (Number(fullLocalVisualReview.integrity_summary?.shots_reviewed || 0) !== expected) problems.push("full local visual review does not cover all shots");
  if (Number(fullLocalVisualReview.integrity_summary?.frames_present || 0) !== expected * 3) problems.push("full local visual review does not cover all 126 frames");
  if (fullDurationRelease.can_release_full_duration === true) problems.push("full-duration release is already unlocked; this gate is for probe submission only");
  if (fullDurationRelease.decision !== "full_duration_release_blocked_probe_review_pending") problems.push(`full-duration release decision ${fullDurationRelease.decision || "missing"} is not blocked_probe_review_pending`);
  if (operatorNextSteps.next_action !== "submit_motion_probes") problems.push(`operator next action ${operatorNextSteps.next_action || "missing"} is not submit_motion_probes`);
  if (operatorNextSteps.current_phase !== "clips_pending") problems.push(`operator current phase ${operatorNextSteps.current_phase || "missing"} is not clips_pending`);
  if (!operatorNextSteps.required_links?.motion_probe_bundles_index) problems.push("operator next steps missing provider bundle index link");
  if (operatorPreflight.can_submit_to_provider === true) problems.push("operator preflight says full-duration provider upload can submit before probe release");

  if (!providerIndexHtml.includes("Scene09 3秒 Motion Probe 提交包")) problems.push("provider visual index missing Chinese probe title");
  const zipLinks = (providerIndexHtml.match(/href="[^"]+\.zip"/g) || []).length;
  if (zipLinks !== 7) problems.push(`provider visual index zip links ${zipLinks} does not match 7`);

  const decision = problems.length
    ? "motion_probe_submission_ready_blocked"
    : "motion_probe_submission_ready";
  const report = {
    version: 1,
    date,
    generated_at: new Date().toISOString(),
    decision,
    package_manifest: rel(packageManifestPath),
    expected_shots: expected,
    probe_duration_seconds: Number(probeManifest.probe_duration_seconds || 0),
    provider_bundle_count: bundles.length,
    provider_zip_count: bundleRows.filter((row) => row.zip_exists).length,
    provider_zip_bytes: zipBytes,
    bundled_probe_rows: totalBundleRows,
    unique_probe_custom_ids: bundleIds.size,
    frame_anchor_summary: {
      checked_shots: frameAnchorRows.length,
      exact_duplicate_anchor_shots: duplicateAnchorRows.length,
      exact_duplicate_anchor_pairs: duplicateAnchorRows.reduce((sum, row) => sum + row.duplicate_pairs.length, 0),
    },
    frame_anchor_rows: frameAnchorRows,
    return_batches: returnBatches.length,
    returned_probe_mp4_ready: Number(tracker.returned_mp4_ready || 0),
    ingested_probe_ready: Number(tracker.ingested_probe_ready || 0),
    full_duration_release: {
      decision: fullDurationRelease.decision || null,
      can_release_full_duration: Boolean(fullDurationRelease.can_release_full_duration),
    },
    gates: {
      motion_probe_manifest: probeManifest.decision || null,
      motion_probe_provider_bundles_audit: providerAudit.decision || null,
      motion_probe_operator_tracker: tracker.decision || null,
      motion_probe_operator_tracker_audit: trackerAudit.decision || null,
      motion_probe_return_intake_audit: returnIntakeAudit.decision || null,
      motion_probe_return_roundtrip_audit: returnRoundtripAudit.decision || null,
      full_local_visual_review: fullLocalVisualReview.decision || null,
      full_duration_release_gate: fullDurationRelease.decision || null,
      operator_next_action: operatorNextSteps.next_action || null,
    },
    bundle_rows: bundleRows,
    problems,
    warnings,
  };

  const md = [
    "# Scene09 Motion Probe Submission Ready Gate",
    "",
    `Decision: ${decision}`,
    `Expected shots: ${expected}`,
    `Probe duration: ${report.probe_duration_seconds} seconds`,
    `Provider zips: ${report.provider_zip_count}/7`,
    `Bundled probe rows: ${totalBundleRows}/${expected}`,
    `Frame anchors checked: ${report.frame_anchor_summary.checked_shots}/${expected}`,
    `Exact duplicate frame-anchor shots: ${report.frame_anchor_summary.exact_duplicate_anchor_shots}`,
    `Return batches: ${returnBatches.length}/7`,
    `Returned probe mp4 ready: ${report.returned_probe_mp4_ready}/${expected}`,
    `Ingested probe ready: ${report.ingested_probe_ready}/${expected}`,
    `Full-duration release: ${fullDurationRelease.can_release_full_duration ? "unlocked" : "locked"}`,
    "",
    "This gate is intentionally probe-submission only. It must pass before submitting the 7 three-second probe zip bundles, but it must not unlock full-duration generation.",
    "",
    "## Bundle Rows",
    ...bundleRows.map((row) => `- ${row.batch_id}: zip ${row.zip_exists ? "yes" : "no"}, rows ${row.rows}, expected downloads ${row.expected_download_rows}, problems ${row.problems.length}`),
    "",
    "## Problems",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Warnings",
    warnings.length ? warnings.map((warning) => `- ${warning}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  writeText(outMd, md);
  writeText(packageOutMd, md);

  console.log(JSON.stringify({
    decision,
    provider_zips: report.provider_zip_count,
    bundled_probe_rows: totalBundleRows,
    unique_probe_custom_ids: bundleIds.size,
    return_batches: returnBatches.length,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));
  if (decision !== "motion_probe_submission_ready") process.exit(1);
}

main();
