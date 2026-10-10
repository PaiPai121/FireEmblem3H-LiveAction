#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const outJson = path.join(packageDir, "OPERATOR_NEXT_STEPS.json");
const outMd = path.join(packageDir, "OPERATOR_NEXT_STEPS.md");

function readJson(relativePath, fallback = {}) {
  const file = path.join(packageDir, relativePath);
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

function countProblems(report) {
  return Array.isArray(report.problems) ? report.problems.length : Number(report.problems || 0);
}

function boolText(value) {
  return value ? "yes" : "no";
}

function main() {
  const manifest = readJson("package_manifest.json", { shots: [], total_shots: 42 });
  const operator = readJson("operator_preflight_status.json", {});
  const motionProbeProvider = readJson("motion_probe_provider_bundles_audit.json", {});
  const motionProbeClips = readJson("motion_probe_clip_structural_audit.json", {});
  const motionProbeReview = readJson("motion_probe_review_apply_gate.json", {});
  const fullRelease = readJson("full_duration_release_gate.json", {});
  const clipAudit = readJson("generated_clip_structural_audit.json", {});
  const completion = readJson("video_generation_run_completion_audit.json", {});
  const freshness = readJson("report_freshness_gate.json", {});
  const status = readJson("current_status_consistency_gate.json", {});
  const fullLocalVisualReview = readJson("full_local_visual_review.json", {});
  const motionProbeSubmissionReady = readJson("motion_probe_submission_ready_gate.json", {});

  const expectedShots = Number(manifest.total_shots || (manifest.shots || []).length || 42);
  const expectedProbeClips = Number(motionProbeClips.expected_probe_clips || expectedShots);
  const playableProbeClips = Number(motionProbeClips.playable_probe_clips || 0);
  const expectedClips = Number(clipAudit.expected_clips || expectedShots);
  const readyClips = Number(clipAudit.ready_clips || 0);
  const missingClips = Number(clipAudit.missing_clips ?? Math.max(0, expectedClips - readyClips));
  const completionPassedChecks = Number(completion.passed_checks || 0);
  const completionTotalChecks = Number(completion.total_checks || 0);
  const completionFailedChecks = Array.isArray(completion.failed_checks) ? completion.failed_checks : [];
  const canSubmitFullDuration = operator.can_submit_to_provider === true && fullRelease.can_release_full_duration === true;
  const canRunLocalCli = operator.can_execute_with_local_cli === true;

  let currentPhase = "clips_pending";
  let nextAction = "submit_motion_probes";
  if (canSubmitFullDuration || canRunLocalCli) {
    currentPhase = "full_duration_generation_unlocked";
    nextAction = canRunLocalCli ? "run_local_video_cli" : "submit_full_duration_batches";
  } else if (playableProbeClips > 0 && playableProbeClips < expectedProbeClips) {
    currentPhase = "partial_motion_probe_return";
    nextAction = "finish_motion_probe_returns";
  } else if (playableProbeClips === expectedProbeClips && motionProbeReview.decision !== "motion_probe_review_apply_passed") {
    currentPhase = "motion_probe_review_pending";
    nextAction = "codex_review_motion_probes";
  } else if (readyClips > 0 && readyClips < expectedClips) {
    currentPhase = "partial_full_duration_return";
    nextAction = "finish_full_duration_returns";
  } else if (readyClips === expectedClips && completion.decision !== "video_generation_run_complete") {
    currentPhase = "post_clip_motion_review_pending";
    nextAction = "codex_review_full_duration_clips";
  }

  const statusLine = [
    `phase=${currentPhase}`,
    `next=${nextAction}`,
    `motion_probe_bundles=${motionProbeProvider.decision || "unknown"}`,
    `motion_probe_submission_ready=${motionProbeSubmissionReady.decision || "unknown"}`,
    `playable_probes=${playableProbeClips}/${expectedProbeClips}`,
    `full_duration_release=${boolText(fullRelease.can_release_full_duration === true)}`,
    `full_duration_clips=${readyClips}/${expectedClips}`,
    `completion=${completion.decision || "unknown"}`,
    `full_local_visual_review=${fullLocalVisualReview.decision || "unknown"}`,
  ].join("; ");

  const blockingItems = [
    {
      id: "full_duration_release_locked",
      active: fullRelease.can_release_full_duration !== true,
      evidence: fullRelease.decision || "missing",
      detail: "Full-duration provider upload remains locked until motion probes exist, review frames are extracted, and Codex probe review writes the release artifact.",
    },
    {
      id: "no_local_model_cli",
      active: operator.can_execute_with_local_cli !== true,
      evidence: operator.can_execute_with_local_cli === false ? "can_execute_with_local_cli=false" : "unknown",
      detail: "VIDEO_MODEL_CLI_ARGV_JSON is not configured, so the local pipeline cannot call a real video model.",
    },
    {
      id: "real_clips_missing",
      active: readyClips !== expectedClips,
      evidence: `${readyClips}/${expectedClips} real clips ready; ${missingClips} missing`,
      detail: "Expected production mp4 clips are absent and cannot be replaced by proxy animatic clips.",
    },
    {
      id: "freshness_or_status_problem",
      active: freshness.decision !== "report_freshness_passed_current_manifest" || status.decision !== "current_status_consistency_passed",
      evidence: `freshness=${freshness.decision || "missing"}; status=${status.decision || "missing"}`,
      detail: "Current status and report freshness must be green before any downstream claim.",
    },
  ].filter((item) => item.active);

  const commands = nextAction === "submit_motion_probes" ? [
    "Open delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_provider_bundles/index.html",
    "Submit the 7 probe zip bundles in motion_probe_provider_bundles/ to the external video provider as 3-second probe jobs.",
    "Place returned probe mp4 files under delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_return_intake/",
    "Run: node scripts/run_scene09_v3_video_pipeline.js --dry-run",
  ] : nextAction === "submit_full_duration_batches" ? [
    "Open delivery/scene09_v3_monitor_handoff_package_2026-07-27/provider_upload_bundles/README.md",
    "Submit the 7 full-duration provider zip bundles only after full_duration_release_gate reports can_release_full_duration=true.",
    "Place returned mp4 files under delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake/",
    "Run: node scripts/resume_scene09_v3_after_clip_return.js --input delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake --apply-ingest",
  ] : nextAction === "run_local_video_cli" ? [
    "Export VIDEO_MODEL_CLI_ARGV_JSON with the provider command template.",
    "Run: node scripts/run_scene09_v3_video_pipeline.js --execute",
    "After generated clips exist, run: node scripts/run_scene09_v3_video_pipeline.js --dry-run",
  ] : [
    "Run the relevant resume wrapper for returned clips or probes.",
    "Run: node scripts/run_scene09_v3_video_pipeline.js --dry-run",
  ];

  const report = {
    generated_at: new Date().toISOString(),
    package: path.relative(root, packageDir),
    expected_shots: expectedShots,
    current_phase: currentPhase,
    next_action: nextAction,
    status_line: statusLine,
    can_submit_full_duration: canSubmitFullDuration,
    can_run_local_cli: canRunLocalCli,
    counts: {
      expected_probe_clips: expectedProbeClips,
      playable_probe_clips: playableProbeClips,
      expected_full_duration_clips: expectedClips,
      ready_full_duration_clips: readyClips,
      missing_full_duration_clips: missingClips,
      completion_passed_checks: completionPassedChecks,
      completion_total_checks: completionTotalChecks,
      completion_failed_checks: completionFailedChecks,
    },
    gates: {
      operator_preflight: operator.decision || "missing",
      motion_probe_provider_bundles: motionProbeProvider.decision || "missing",
      motion_probe_provider_bundles_problems: countProblems(motionProbeProvider),
      motion_probe_submission_ready_gate: motionProbeSubmissionReady.decision || "missing",
      motion_probe_submission_ready_gate_problems: countProblems(motionProbeSubmissionReady),
      motion_probe_clip_structural: motionProbeClips.decision || "missing",
      motion_probe_review_apply_gate: motionProbeReview.decision || "missing",
      full_duration_release_gate: fullRelease.decision || "missing",
      generated_clip_structural_audit: clipAudit.decision || "missing",
      current_status_consistency_gate: status.decision || "missing",
      report_freshness_gate: freshness.decision || "missing",
      full_local_visual_review: fullLocalVisualReview.decision || "missing",
      video_generation_run_completion: completion.decision || "missing",
    },
    blocking_items: blockingItems,
    operator_commands: commands,
    required_links: {
      motion_probe_bundles_index: "motion_probe_provider_bundles/index.html",
      motion_probe_bundles: "motion_probe_provider_bundles/README.md",
      motion_probe_submission_ready_gate: "motion_probe_submission_ready_gate.md",
      motion_probe_submission_ready_gate_json: "motion_probe_submission_ready_gate.json",
      motion_probe_manifest: "motion_probe_submission/motion_probe_manifest.json",
      motion_probe_operator_tracker: "motion_probe_operator_tracker.html",
      motion_probe_operator_tracker_audit: "motion_probe_operator_tracker_audit.md",
      full_local_visual_review: "full_local_visual_review.md",
      full_local_visual_review_json: "full_local_visual_review.json",
      full_duration_release_gate: "full_duration_release_gate.md",
      provider_upload_bundles: "provider_upload_bundles/README.md",
      clip_return_contract: "provider_upload_bundles/RETURN_CONTRACT.md",
      runbook: "RUNBOOK.md",
    },
  };

  const md = [
    "# EP02 Scene09 Operator Next Steps",
    "",
    `Generated: ${report.generated_at}`,
    `Status: ${statusLine}`,
    "",
    "## Decision",
    "",
    `- Current phase: \`${currentPhase}\``,
    `- Next action: \`${nextAction}\``,
    `- Full-duration provider upload unlocked: ${boolText(canSubmitFullDuration)}`,
    `- Local model CLI executable: ${boolText(canRunLocalCli)}`,
    "",
    "## Counts",
    "",
    `- Motion probes playable: ${playableProbeClips}/${expectedProbeClips}`,
    `- Full-duration clips ready: ${readyClips}/${expectedClips}`,
    `- Full-duration clips missing: ${missingClips}`,
    `- Video generation completion checks: ${completionPassedChecks}/${completionTotalChecks}`,
    `- Completion failed checks: ${completionFailedChecks.length ? completionFailedChecks.join(", ") : "none"}`,
    "",
    "## Blocking Items",
    "",
    ...(blockingItems.length ? blockingItems.map((item) => `- ${item.id}: ${item.evidence}. ${item.detail}`) : ["- none"]),
    "",
    "## Do Next",
    "",
    ...commands.map((command) => `1. ${command}`),
    "",
    "## Key Links",
    "",
    "- [Motion probe provider visual index](motion_probe_provider_bundles/index.html)",
    "- [Motion probe provider bundles](motion_probe_provider_bundles/README.md)",
    "- [Motion probe submission ready gate](motion_probe_submission_ready_gate.md)",
    "- [Motion probe submission ready gate JSON](motion_probe_submission_ready_gate.json)",
    "- [Motion probe manifest](motion_probe_submission/motion_probe_manifest.json)",
    "- [Motion probe operator tracker](motion_probe_operator_tracker.html)",
    "- [Motion probe operator tracker audit](motion_probe_operator_tracker_audit.md)",
    "- [Full local visual review](full_local_visual_review.md)",
    "- [Full local visual review JSON](full_local_visual_review.json)",
    "- [Full-duration release gate](full_duration_release_gate.md)",
    "- [Full-duration provider bundles](provider_upload_bundles/README.md)",
    "- [Provider return contract](provider_upload_bundles/RETURN_CONTRACT.md)",
    "- [Runbook](RUNBOOK.md)",
    "",
  ].join("\n");

  writeJson(outJson, report);
  writeText(outMd, md);
  console.log(JSON.stringify({
    decision: "operator_next_steps_built",
    current_phase: currentPhase,
    next_action: nextAction,
    blocking_items: blockingItems.length,
    out_json: path.relative(root, outJson),
    out_md: path.relative(root, outMd),
  }, null, 2));
}

main();
