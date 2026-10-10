const fs = require("fs");
const path = require("path");

const epRoot = "episodes/EP03";
const today = "2026-07-29";
const candidateSuffix = "imagegen_candidate_2026-07-29";
const queuePath = path.join(epRoot, "frame_generation_queue.json");
const queueMdPath = path.join(epRoot, "frame_generation_queue.md");
const auditPath = path.join(epRoot, "visual_material_audit.md");
const artifactManifestPath = path.join(epRoot, "production_system", "artifact_manifest.json");
const reviewManifestPath = path.join(epRoot, "production_system", "review_manifest.json");
const deliveryManifestPath = path.join(epRoot, "production_system", "video_delivery_manifest.json");
const identityReviewPath = path.join(epRoot, "production_system", "identity_lock_review_2026-07-31.json");
const identityRebuildPlanPath = "production_system/local_asset_identity_rebuild_plan_2026-07-31.md";
const validationLogPath = "production_system/gates/validation_2026-07-29.md";
let identityReview = null;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function upsertBy(items, key, item) {
  const index = items.findIndex((candidate) => candidate[key] === item[key]);
  if (index === -1) {
    items.push(item);
    return;
  }
  items[index] = item;
}

function relImagegenPaths(shotId) {
  return {
    start: `storyboards/${shotId}/start_frame_${candidateSuffix}.png`,
    key: `storyboards/${shotId}/key_frame_${candidateSuffix}.png`,
    end: `storyboards/${shotId}/end_frame_${candidateSuffix}.png`,
    contact_sheet: `storyboards/${shotId}/imagegen_frameset_contact_sheet_2026-07-29.jpg`,
  };
}

function existsInEp(relativePath) {
  return fs.existsSync(path.join(epRoot, relativePath));
}

function hasCompleteImagegenFrameset(shotId) {
  const paths = relImagegenPaths(shotId);
  return existsInEp(paths.start) && existsInEp(paths.key) && existsInEp(paths.end);
}

function previousShotId(order) {
  return order > 1 ? `Shot${String(order - 1).padStart(3, "0")}` : "";
}

function nextShotId(order, total) {
  return order < total ? `Shot${String(order + 1).padStart(3, "0")}` : "";
}

function identityOverrideFor(shotId) {
  return identityReview?.shots?.[shotId] || null;
}

function shotDecision(shot) {
  if (hasCompleteImagegenFrameset(shot.id)) {
    const paths = relImagegenPaths(shot.id);
    const identityOverride = identityOverrideFor(shot.id);
    if (identityOverride) {
      return {
        decision: "blocked_needs_revision",
        status: identityReview.status_policy?.blocked_status || "imagegen_frameset_candidate_identity_blocked",
        reviewedPath: `${paths.start}; ${paths.key}; ${paths.end}; ${paths.contact_sheet}; production_system/identity_lock_review_2026-07-31.json`,
        finding: `Local selected.png identity lock failed or is unproven: ${identityOverride.reason}`,
        revision: "Regenerate with a stricter local-asset identity workflow before using this as an EP03 keyframe asset; keep current imagegen files only as blocked composition studies.",
        imagegenCandidates: paths,
        identityBlocked: true,
        rubric: {
          shot_purpose: "conditional",
          action_peak: "conditional",
          start_key_end_chain: "conditional",
          identity_locks: "fail",
          screen_direction: "conditional",
          blocking: "conditional",
          camera_motivation: "conditional",
          motion_risk: "blocked_needs_revision",
        },
      };
    }
    return {
      decision: "monitor_required",
      status: "imagegen_frameset_candidate_monitor_required",
      reviewedPath: `${paths.start}; ${paths.key}; ${paths.end}; ${paths.contact_sheet}`,
      finding: "New imagegen start/key/end frame candidates are integrated and live-action styled, but they still need independent canon/identity, prompt-against-frame, and adjacent continuity review before approval.",
      revision: `Run full visual QA on the regenerated ${shot.id} frame chain, then run prompt QA and adjacent continuity before any promotion.`,
      imagegenCandidates: paths,
      rubric: {
        shot_purpose: "pass",
        action_peak: "conditional",
        start_key_end_chain: "conditional",
        identity_locks: "conditional",
        screen_direction: "conditional",
        blocking: "conditional",
        camera_motivation: "pass",
        motion_risk: "monitor_required",
      },
    };
  }

  return {
    decision: "visual_blocked",
    status: "visual_blocked_layout_reference",
    reviewedPath: `storyboards/${shot.id}/start_frame.png; storyboards/${shot.id}/key_frame.png; storyboards/${shot.id}/end_frame.png`,
    finding: "Existing start/key/end frames are rough composited layout candidates. The contact sheet shows static character cutouts, mismatched lighting/depth, and insufficient visible action peaks for video-generation approval.",
    revision: "Regenerate real live-action start/key/end frames with integrated lighting, shot-specific blocking, readable named identities, and a clear key action peak.",
    imagegenCandidates: null,
    rubric: {
      shot_purpose: "conditional",
      action_peak: "fail",
      start_key_end_chain: "fail",
      identity_locks: "conditional",
      screen_direction: "conditional",
      blocking: "fail",
      camera_motivation: "conditional",
      motion_risk: "blocked_needs_revision",
    },
  };
}

function buildAuditMd(queue, imagegenShots, blockedShots) {
  const rows = queue.shots.map((shot) => {
    const decision = shotDecision(shot);
    return `| ${shot.id} | ${decision.reviewedPath} | ${shot.source_timecode} | ${shot.beat} | ${shot.purpose} | ${decision.decision} | ${decision.finding} | ${decision.revision} |`;
  });
  const imagegenRange = imagegenShots.length ? imagegenShots.map((shot) => shot.id).join(", ") : "none";
  const identityBlockedShots = imagegenShots.filter((shot) => identityOverrideFor(shot.id));
  const monitorShots = imagegenShots.filter((shot) => !identityOverrideFor(shot.id));
  const identityBlockedRange = identityBlockedShots.length ? identityBlockedShots.map((shot) => shot.id).join(", ") : "none";
  const monitorRange = monitorShots.length ? monitorShots.map((shot) => shot.id).join(", ") : "none";
  const blockedRange = blockedShots.length ? `${blockedShots[0].id}-${blockedShots[blockedShots.length - 1].id}` : "none";

  return `# EP03 Visual Material Audit

Integrity Summary: 36 source reference screenshots exist; 36 of 36 rough composited start/key/end frame sets exist; ${imagegenShots.length} imagegen live-action start/key/end candidate frame set(s) exist (${imagegenRange}). Identity lock review blocks ${identityBlockedShots.length} frame set(s) (${identityBlockedRange}) from asset-package use.
Visual Audit Coverage: 36 shots reviewed against the visible contact sheet and available frame paths.
Unavailable Shots: none.
Existing Shots Failed: ${identityBlockedRange} are blocked_needs_revision because local selected.png identity preservation is failed or unproven; ${blockedRange} are visual_blocked for video approval because their current frames are rough composited layout candidates, not integrated live-action storyboard frames.
Layout Reference Only: shots without complete imagegen frame sets and all source_refs.
Monitor Required: ${monitorRange}.
Visual Review Passed: none.
Promotion Decision: blocked from video_generation_package. Do not promote any EP03 shot to approved_for_video until full live-action start/key/end frames pass visual review, prompt QA against real frames, and strict adjacent-shot continuity.

## Gate Blockers

- Current rough composite contact sheet material still contains collage/cutout construction and cannot prove video-ready action, identity, and edit handoff.
- Current imagegen frame-set candidates through identity-reviewed shots are blocked as asset-package keyframes because they do not prove local selected.png character identity preservation.
- Future imagegen work must use a stricter local asset identity workflow and produce comparison contact sheets against selected.png assets before visual promotion.
- Existing video prompts reference frame anchors that must be re-reviewed against the imagegen frame sets.
- Strict continuity cannot pass while adjacent cuts depend on blocked_needs_revision, monitor_required, or visual_blocked frame chains.
- Immutable delivery package must not be built from blocked_needs_revision, monitor_required, or visual_blocked shots.

## Audit Table

| Shot | Reviewed Path | Source Time | Beat | Purpose | Decision | Existing Material Finding | Required Revision |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}

## Reviewer Decision

Decision: blocked_needs_revision for video-generation package.

The completed stage remains prompt_asset_package. EP03 now has concrete composition studies, but current imagegen frame sets are not accepted as local-asset-locked keyframes. Game screenshots remain source/layout reference only. Rough composited frames and identity-blocked imagegen frames remain reviewable planning material only.
`;
}

function buildQueueMd(queue) {
  const rows = queue.shots.map((shot) => {
    const decision = shotDecision(shot);
    const candidate = decision.imagegenCandidates
      ? `${decision.imagegenCandidates.start}; ${decision.imagegenCandidates.key}; ${decision.imagegenCandidates.end}; ${decision.imagegenCandidates.contact_sheet}`
      : "";
    return `| ${shot.id} | ${decision.status} | ${shot.source_timecode} | ${shot.beat} | ${shot.output_frames.start}; ${shot.output_frames.key}; ${shot.output_frames.end} | ${candidate} | ${decision.revision} |`;
  });

  return `# EP03 Frame Generation Queue

Status: visual audit refreshed ${today}. Rough composited frame sets exist for all shots, but only complete imagegen candidate chains are suitable for next-step visual QA. None are approved for video.

| Shot | Status | Source Time | Beat | Current Rough Frame Set | Imagegen Candidate | Next Required Action |
| --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}
`;
}

function cleanPriorImagegenEntries(artifacts, reviews) {
  artifacts.artifacts = artifacts.artifacts.filter((artifact) => !/EP03-Shot\d+-IMAGEGEN-(KEY|FRAMESET)-CANDIDATE-2026-07-29/.test(artifact.id));
  reviews.reviews = reviews.reviews.filter((review) => !/review-2026-07-29-Shot\d+-imagegen-(key|frameset)-visual-audit/.test(review.review_id));
}

function main() {
  identityReview = fs.existsSync(identityReviewPath) ? readJson(identityReviewPath) : null;
  const queue = readJson(queuePath);
  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const delivery = readJson(deliveryManifestPath);
  const imagegenShots = queue.shots.filter((shot) => hasCompleteImagegenFrameset(shot.id));
  const blockedShots = queue.shots.filter((shot) => !hasCompleteImagegenFrameset(shot.id));

  for (const shot of queue.shots) {
    const decision = shotDecision(shot);
    shot.status = decision.status;
    shot.visual_audit_decision = decision.decision;
    shot.visual_audit_finding = decision.finding;
    shot.required_revision = decision.revision;
    if (decision.imagegenCandidates) {
      shot.imagegen_candidates = decision.imagegenCandidates;
    } else {
      delete shot.imagegen_candidates;
    }
  }

  for (const shot of delivery.shots) {
    const decision = shotDecision(shot);
    shot.status = decision.identityBlocked
      ? "blocked_needs_revision"
      : decision.decision === "visual_blocked"
        ? "visual_blocked"
        : "monitor_required";
    shot.visual_audit_decision = decision.decision;
    shot.visual_audit_finding = decision.finding;
    shot.required_revision = decision.revision;
    if (!shot.model_notes.includes("Current visual audit blocks approved_for_video promotion.")) {
      shot.model_notes.push("Current visual audit blocks approved_for_video promotion.");
    }
  }

  cleanPriorImagegenEntries(artifacts, reviews);

  for (const shot of imagegenShots) {
    const paths = relImagegenPaths(shot.id);
    upsertBy(artifacts.artifacts, "id", {
      id: `EP03-${shot.id}-IMAGEGEN-FRAMESET-CANDIDATE-2026-07-29`,
      type: "storyboard_frame",
      stage: "storyboard",
      status: shotDecision(shot).identityBlocked ? "blocked_needs_revision" : "candidate_generated",
      created_by: "imagegen-storyboard-agent",
      created_at: today,
      paths: [paths.start, paths.key, paths.end, paths.contact_sheet],
      source_refs: [
        `storyboards/${shot.id}/frame_spec.md`,
        `video_prompts/${shot.id}_prompt.md`,
        "source_video_breakdown.md",
      ],
      depends_on: [`EP03-${shot.id}-STORYBOARD-FRAMESET`, `EP03-${shot.id}-VIDEO-PROMPT`],
      continuity: {
        previous: previousShotId(shot.order),
        next: nextShotId(shot.order, queue.shots.length),
        in: "see video_delivery_manifest.json",
        out: "see video_delivery_manifest.json",
      },
      risk_flags: shotDecision(shot).identityBlocked
        ? ["local_asset_identity_drift", "identity_lock_failed", "adjacent_continuity_pending"]
        : ["identity_drift", "adjacent_continuity_pending"],
      notes: "Non-destructive imagegen pilot start/key/end frame set. Not approved for video until visual, prompt, and continuity QA pass.",
    });

    const decision = shotDecision(shot);
    upsertBy(reviews.reviews, "review_id", {
      artifact_id: `EP03-${shot.id}-IMAGEGEN-FRAMESET-CANDIDATE-2026-07-29`,
      review_id: `review-2026-07-29-${shot.id}-imagegen-frameset-visual-audit`,
      reviewer_role: "storyboard-qa-agent",
      reviewer: "codex",
      created_at: today,
      decision: decision.decision,
      blocking_issues: decision.identityBlocked
        ? [
            "Local selected.png character identity preservation is failed or unproven.",
            "Current imagegen frame set cannot be used as an EP03 keyframe asset.",
            "Adjacent continuity has not passed strict gate.",
          ]
        : [
            "Imagegen frame set needs independent canon/identity and prompt-against-frame review before approval.",
            "Adjacent continuity has not passed strict gate.",
          ],
      required_revisions: decision.identityBlocked
        ? [
            "Regenerate with a stricter local-asset identity workflow before promotion.",
            "Build per-shot comparison contact sheets against every visible named character selected.png.",
          ]
        : [
            "Run prompt QA against the regenerated frame chain before promotion.",
            "Run adjacent continuity review against regenerated neighboring shots before promotion.",
          ],
      rubric: decision.rubric,
      reviewed_paths: decision.identityBlocked
        ? [paths.start, paths.key, paths.end, paths.contact_sheet, "production_system/identity_lock_review_2026-07-31.json"]
        : [paths.start, paths.key, paths.end, paths.contact_sheet],
    });
  }

  if (identityReview) {
    upsertBy(artifacts.artifacts, "id", {
      id: "EP03-IMAGEGEN-LOCAL-ASSET-IDENTITY-LOCK-REVIEW-2026-07-31",
      type: "review",
      stage: "asset_review",
      status: identityReview.decision,
      created_by: "canon-identity-qa-agent",
      created_at: identityReview.created_at,
      paths: ["production_system/identity_lock_review_2026-07-31.json"],
      source_refs: ["production_system/artifact_manifest.json", "production_system/review_manifest.json"],
      depends_on: imagegenShots.map((shot) => `EP03-${shot.id}-IMAGEGEN-FRAMESET-CANDIDATE-2026-07-29`),
      risk_flags: ["local_asset_identity_drift", "selected_png_not_preserved"],
      notes: "Project-level identity lock review raised after imagegen candidates were found to preserve broad design cues without proving local selected.png identity.",
    });

    upsertBy(reviews.reviews, "review_id", {
      artifact_id: "EP03-IMAGEGEN-LOCAL-ASSET-IDENTITY-LOCK-REVIEW-2026-07-31",
      review_id: identityReview.review_id,
      reviewer_role: identityReview.reviewer_role,
      reviewer: identityReview.reviewer,
      created_at: identityReview.created_at,
      decision: identityReview.decision,
      blocking_issues: identityReview.blocking_issues,
      required_revisions: identityReview.required_revisions,
      rubric: {
        local_selected_png_identity: "fail",
        face_lock: "fail",
        wardrobe_topology: "conditional",
        storyboard_composition: "layout_reference",
        video_readiness: "blocked_needs_revision",
      },
      reviewed_paths: ["production_system/identity_lock_review_2026-07-31.json"],
    });

    upsertBy(artifacts.artifacts, "id", {
      id: "EP03-LOCAL-ASSET-IDENTITY-REBUILD-PLAN-2026-07-31",
      type: "production_note",
      stage: "asset_generation",
      status: "blocked_needs_revision",
      created_by: "production-manager-agent",
      created_at: "2026-07-31",
      paths: [identityRebuildPlanPath],
      source_refs: ["production_system/identity_lock_review_2026-07-31.json"],
      depends_on: ["EP03-IMAGEGEN-LOCAL-ASSET-IDENTITY-LOCK-REVIEW-2026-07-31"],
      risk_flags: ["identity_rebuild_required"],
      notes: "Corrective plan for regenerating EP03 frames with local selected.png identity preservation before asset-package use.",
    });
  }

  upsertBy(artifacts.artifacts, "id", {
    id: "EP03-GATE-VALIDATION-2026-07-29",
    type: "delivery_packet",
    stage: "production_gate",
    status: "integrity_passed",
    created_by: "production-manager-agent",
    created_at: today,
    paths: [validationLogPath],
    source_refs: [
      "production_system/artifact_manifest.json",
      "production_system/review_manifest.json",
      "production_system/video_delivery_manifest.json",
      "production_system/continuity_manifest.json",
    ],
    depends_on: ["EP03-VISUAL-MATERIAL-AUDIT", ...imagegenShots.map((shot) => `EP03-${shot.id}-IMAGEGEN-FRAMESET-CANDIDATE-2026-07-29`)],
    risk_flags: ["video_generation_package_blocked", "strict_continuity_failed"],
    notes: "Gate validation log for the current EP03 prompt asset package and blocked video package state.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: "EP03-GATE-VALIDATION-2026-07-29",
    review_id: "review-2026-07-29-gate-validation-review",
    reviewer_role: "production-manager-agent",
    reviewer: "codex",
    created_at: today,
    decision: "monitor_required",
    blocking_issues: [
      "Video generation package gate is intentionally blocked by monitor_required delivery shots.",
      "Strict continuity gate fails and must not be bypassed.",
    ],
    required_revisions: [
      "Continue frame regeneration and independent visual QA before rebuilding delivery package.",
    ],
    rubric: {
      manifest_integrity: "pass",
      prompt_asset_package: "pass",
      video_generation_package: "fail",
      strict_continuity: "fail",
      web_integration: "pass",
    },
    reviewed_paths: [validationLogPath],
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: "EP03-VISUAL-MATERIAL-AUDIT",
    review_id: "review-2026-07-29-visual-material-audit-refresh",
    reviewer_role: "visual-audit-agent",
    reviewer: "codex",
    created_at: today,
    decision: "blocked_needs_revision",
    blocking_issues: [
      "Shots without complete imagegen frame sets are rough composited layout candidates and cannot be promoted to approved_for_video.",
      "Imagegen frame chains are not yet independently approved and cannot enter strict continuity.",
    ],
    required_revisions: [
      "Regenerate full live-action start/key/end frame sets for Shot001-Shot036 or approve a narrower per-shot regeneration plan.",
      "Re-run visual, prompt, and continuity gates after regeneration.",
    ],
    rubric: {
      integrity: "pass",
      visual_storytelling: "fail",
      identity_locks: "conditional",
      action_peaks: "fail",
      start_key_end_chains: "fail",
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: [
      "visual_material_audit.md",
      "generated_storyboard_contact_sheet.jpg",
      ...imagegenShots.flatMap((shot) => {
        const paths = relImagegenPaths(shot.id);
        return [paths.start, paths.key, paths.end, paths.contact_sheet];
      }),
    ],
  });

  fs.writeFileSync(auditPath, buildAuditMd(queue, imagegenShots, blockedShots));
  fs.writeFileSync(queueMdPath, buildQueueMd(queue));
  writeJson(queuePath, queue);
  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  writeJson(deliveryManifestPath, delivery);

  console.log(`updated EP03 visual audit state (${imagegenShots.length} imagegen framesets)`);
}

main();
