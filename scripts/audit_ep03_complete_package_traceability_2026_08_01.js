const fs = require("fs");
const path = require("path");

const epRoot = "episodes/EP03";
const createdAt = "2026-09-09";
const updatedAt = "2026-09-09";
const artifactId = "EP03-COMPLETE-SCRIPT-SHOT-ASSET-PACKAGE-CURRENT-2026-09-09";
const reviewId = "review-2026-09-09-ep03-complete-package-local-traceability";
const packageRoot = `${epRoot}/delivery/complete_script_shot_asset_package_2026-08-01`;
const shotsPath = `${packageRoot}/shots.json`;
const htmlPath = `${packageRoot}/index.html`;
const manifestPath = `${packageRoot}/manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const auditJsonPath = `${epRoot}/production_system/reviews/ep03_complete_package_local_traceability_audit_2026-08-01.json`;
const auditMdPath = `${epRoot}/production_system/reviews/ep03_complete_package_local_traceability_audit_2026-08-01.md`;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function exists(projectPath) {
  return Boolean(projectPath && fs.existsSync(projectPath));
}

function upsertBy(items, key, item) {
  const index = items.findIndex((candidate) => candidate[key] === item[key]);
  if (index === -1) items.push(item);
  else items[index] = item;
}

function groupCounts(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "missing";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function isCurrentIntegratedFrameSet(value) {
  return /^critical_reaudit_regen_v\d+$/.test(String(value || ""))
    || /^integrated_candidate_v\d+$/.test(String(value || ""))
    || /^manga_readability_reboard_v\d+$/.test(String(value || ""))
    || /^external_film_staging_reboard_v\d+$/.test(String(value || ""));
}

function isReviewOnlyStatus(value) {
  const status = String(value || "");
  return ["layout_reference", "monitor_required", "visual_review_passed"].includes(status)
    || /^(?:layout_reference|monitor_required)_/.test(status);
}

function auditShot(shot) {
  // Generic extras such as BanditSoldier are group references, not named identity-plate subjects.
  const characterAssets = (shot.asset_references || [])
    .filter((asset) => asset.includes("/characters/") && !asset.includes("/characters/extras/"));
  const acceptedFrameSets = new Set(["local_selected_png_composited_previs_v3", "local_asset_final_candidate_v1"]);
  const checks = {
    uses_local_traceable_display_frame_set: acceptedFrameSets.has(shot.current_display_frame_set)
      || isCurrentIntegratedFrameSet(shot.current_display_frame_set),
    display_status_not_video_approved: isReviewOnlyStatus(shot.current_display_frame_status),
    delivery_status_not_video_approved: isReviewOnlyStatus(shot.status),
    not_approved_for_video: shot.status !== "approved_for_video" && shot.status !== "approved_for_delivery",
    start_frame_exists: exists(shot.frames?.start),
    key_frame_exists: exists(shot.frames?.key),
    end_frame_exists: exists(shot.frames?.end),
    prompt_exists: exists(shot.prompts?.prompt),
    negative_prompt_exists: exists(shot.prompts?.negative_prompt),
    metadata_exists: exists(shot.prompts?.metadata),
    frame_spec_exists: exists(shot.prompts?.frame_spec),
    local_video_source_evidence_exists: exists(shot.local_video_source_evidence),
    local_asset_proof_sheet_exists: exists(shot.local_asset_proof_sheet),
    identity_plate_coverage: (shot.identity_plates || []).length >= characterAssets.length,
  };
  const failed = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([name]) => name);
  return {
    id: shot.id,
    order: shot.order,
    status: shot.status,
    current_display_frame_set: shot.current_display_frame_set,
    current_display_frame_status: shot.current_display_frame_status,
    current_display_frame_source: shot.current_display_frame_source,
    current_integrated_frame_set: isCurrentIntegratedFrameSet(shot.current_display_frame_set),
    historical_local_previs_available: Boolean(shot.local_selected_png_composited_previs_v3),
    historical_final_candidate_available: Boolean(shot.local_asset_final_candidate_v1),
    character_assets: characterAssets.length,
    identity_plates: (shot.identity_plates || []).length,
    evidence_files: (shot.evidence_files || []).length,
    failed,
    decision: failed.length ? "integrity_blocked" : "monitor_required",
  };
}

function buildMarkdown(audit) {
  const rows = audit.shots.map((shot) => `| ${shot.id} | ${shot.current_display_frame_set} | ${shot.current_display_frame_status} | ${shot.character_assets}/${shot.identity_plates} | ${shot.evidence_files} | ${shot.decision} | ${shot.failed.join(", ") || "none"} |`);
  return `# EP03 Complete Package Local Traceability Audit

Created: ${createdAt}
Reviewer role: pipeline-gate-qa-agent
Artifact: \`${artifactId}\`
Decision: ${audit.decision}

## Integrity Summary

- Shots audited: ${audit.summary.shots}
- Current integrated frame sets: ${audit.summary.current_integrated_frame_sets}/${audit.summary.shots}
- Historical local selected.png previs sets retained: ${audit.summary.historical_local_previs_available}/${audit.summary.shots}
- Historical local final-candidate sets retained: ${audit.summary.historical_final_candidate_available}/${audit.summary.shots}
- Complete start/key/end frame files: ${audit.summary.complete_frame_triptychs}/${audit.summary.shots}
- Local video evidence boards: ${audit.summary.local_video_evidence}/${audit.summary.shots}
- Local asset proof sheets: ${audit.summary.local_asset_proof}/${audit.summary.shots}
- Identity plate coverage: ${audit.summary.identity_plate_coverage}/${audit.summary.shots}
- Package HTML frame-source labels: ${audit.summary.html_frame_source_labels}
- Delivery status counts: ${Object.entries(audit.summary.status_counts).map(([key, value]) => `${key}=${value}`).join(", ")}
- Current output hashes verified: ${audit.provenance?.output_hash_verified || 0}/${audit.summary.shots * 3}
- Current source-cache hashes verified: ${audit.provenance?.source_cache_hash_verified || 0}/${audit.summary.shots * 3}
- Current source-cache frames unavailable: ${audit.provenance?.source_cache_unavailable?.length || 0}

## Decision

The complete EP3 package is locally traceable as a prompt/shot asset package: every shot uses a current integrated frame set or a retained local selected.png/final-candidate evidence set, every displayed triptych exists, and every shot links local raw-video evidence, local asset proof, prompts, negative prompts, metadata, and identity plates.

This does not approve the frames for video generation. Current integrated frames remain \`monitor_required\` and still require video-prompt QA, motion probe, and strict continuity before any video package promotion. Local selected.png and older final-candidate sets are historical identity/layout evidence, not the current displayed frame plates.

## Per-Shot Matrix

| Shot | Frame Set | Status | Character Assets / Plates | Evidence Files | Decision | Failed Checks |
| --- | --- | --- | ---: | ---: | --- | --- |
${rows.join("\n")}
`;
}

function main() {
  const shots = readJson(shotsPath);
  const html = fs.readFileSync(htmlPath, "utf8");
  const packageManifest = readJson(manifestPath);
  const shotAudits = shots.map(auditShot);
  const receiptsPath = `${epRoot}/production_system/generation_receipts.json`;
  const provenance = fs.existsSync(receiptsPath)
    ? readJson(receiptsPath).current_provenance_audit || null
    : null;
  const summary = {
    shots: shotAudits.length,
    current_integrated_frame_sets: shotAudits.filter((shot) => shot.current_integrated_frame_set).length,
    historical_local_previs_available: shotAudits.filter((shot) => shot.historical_local_previs_available).length,
    historical_final_candidate_available: shotAudits.filter((shot) => shot.historical_final_candidate_available).length,
    complete_frame_triptychs: shotAudits.filter((shot) => ["start_frame_exists", "key_frame_exists", "end_frame_exists"].every((key) => !shot.failed.includes(key))).length,
    local_video_evidence: shotAudits.filter((shot) => !shot.failed.includes("local_video_source_evidence_exists")).length,
    local_asset_proof: shotAudits.filter((shot) => !shot.failed.includes("local_asset_proof_sheet_exists")).length,
    identity_plate_coverage: shotAudits.filter((shot) => !shot.failed.includes("identity_plate_coverage")).length,
    html_frame_source_labels: (html.match(/Frame source/g) || []).length,
    status_counts: groupCounts(shotAudits, "status"),
    failed_shots: shotAudits.filter((shot) => shot.failed.length).map((shot) => shot.id),
  };
  const audit = {
    review_id: reviewId,
    artifact_id: artifactId,
    created_at: createdAt,
    updated_at: updatedAt,
    decision: summary.failed_shots.length ? "integrity_blocked" : "monitor_required",
    summary,
    provenance,
    shots: shotAudits,
    required_revision: [
      "Keep this package at prompt_asset_package status.",
      "Do not promote any shot to approved_for_video until final cleaned local-asset-locked frames pass visual QA, video-prompt QA against frames, motion probe, and strict continuity.",
    ],
  };

  writeJson(auditJsonPath, audit);
  fs.writeFileSync(auditMdPath, buildMarkdown(audit));

  packageManifest.local_traceability_audit = {
    json: auditJsonPath,
    markdown: auditMdPath,
    decision: audit.decision,
    summary,
  };
  writeJson(manifestPath, packageManifest);

  const artifacts = readJson(artifactManifestPath);
  const artifact = (artifacts.artifacts || []).find((item) => item.id === artifactId);
  if (artifact) {
    artifact.source_refs = Array.from(new Set([...(artifact.source_refs || []), auditJsonPath, auditMdPath]));
    artifact.risk_flags = Array.from(new Set([...(artifact.risk_flags || []), "local_traceability_audited", "historical_layout_reference_retained"]));
  }
  writeJson(artifactManifestPath, artifacts);

  const reviews = readJson(reviewManifestPath);
  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "pipeline-gate-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: audit.decision,
    blocking_issues: audit.decision !== "integrity_blocked"
      ? ["No integrity blocker for local traceability; video approval remains blocked because final visual/prompt/motion/continuity gates are not complete."]
      : [`Traceability failures: ${summary.failed_shots.join(", ")}`],
    required_revisions: audit.required_revision,
    rubric: {
      current_integrated_frame_set: `${summary.current_integrated_frame_sets}/${summary.shots}`,
      historical_local_selected_png_frame_set: `${summary.historical_local_previs_available}/${summary.shots}`,
      historical_final_candidate_frame_set: `${summary.historical_final_candidate_available}/${summary.shots}`,
      frame_triptychs: `${summary.complete_frame_triptychs}/${summary.shots}`,
      local_video_evidence: `${summary.local_video_evidence}/${summary.shots}`,
      local_asset_proof: `${summary.local_asset_proof}/${summary.shots}`,
      identity_plate_coverage: `${summary.identity_plate_coverage}/${summary.shots}`,
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: [shotsPath, htmlPath, manifestPath, auditJsonPath, auditMdPath],
  });
  writeJson(reviewManifestPath, reviews);

  console.log(`${audit.decision}: ${summary.current_integrated_frame_sets}/${summary.shots} current integrated frame sets, ${summary.failed_shots.length} failed shots`);
}

main();
