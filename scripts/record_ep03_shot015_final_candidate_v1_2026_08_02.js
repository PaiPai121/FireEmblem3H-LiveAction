const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot015";
const createdAt = "2026-08-02";
const artifactId = "EP03-SHOT015-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02";
const reviewId = "review-2026-08-02-shot015-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot015_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot015_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function upsertBy(items, key, item) {
  const index = items.findIndex((candidate) => candidate[key] === item[key]);
  if (index === -1) items.push(item);
  else items[index] = item;
}

function frames() {
  return {
    start: "storyboards/Shot015/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png",
    key: "storyboards/Shot015/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png",
    end: "storyboards/Shot015/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot015_local_asset_final_candidate_v1_2026-08-02",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot015_local_asset_final_candidate_v1_review_2026-08-02.jpg",
    review_markdown: "production_system/reviews/shot015_local_asset_final_candidate_v1_review_2026-08-02.md",
    source_refs: [
      "storyboards/Shot014/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot015/Shot015_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot015_local_asset_previs_proof_2026-07-31.jpg",
      "production_system/reviews/identity_lock_comparison_2026-07-31/Shot015_identity_comparison_2026-07-31.jpg",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png",
      "storyboards/Shot015/start_frame.png",
      "storyboards/Shot015/key_frame.png",
      "storyboards/Shot015/end_frame.png",
    ],
    note: "Generated final candidate v1 from Shot014 arrow-impact continuity, local Shot015 evidence/proof, Seiros/Byleth identity comparison, battlefield ridge, and church flag references. Still-frame chain passes as disciplined rebel emergence, formation-line chant, and near-contact handoff to Dimitri. Downstream video remains monitor_required due to faceless-swarm, bandit/villain drift, chant timing, and banner/text risks.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "Shot014 final end continuity + local Shot015 evidence/proof + Seiros/Byleth identity comparison + battlefield ridge/flag references + constrained imagegen cleanup";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot015 final candidate v1 visibly proves the disciplined rebel pressure beat: start reveals an organized Western Church line emerging from fog, key clarifies shields, spears, holy tokens, and chant performance, and end brings the formation close enough to hand off to Dimitri's controlled counterline.";
  shot.required_revision = "Before approved_for_video, rewrite the executable web prompt so it references only uploaded START/KEY/END frames, run chant timing QA for the rebel line, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if rebels become faceless clones, bandits, monsters, readable-text banners, or a chaotic swarm.";
  shot.video_prompt_qa_decision = "pending_prompt_rewrite_and_review_against_final_candidate_v1";
  shot.motion_probe_status = "pending_3s_probe";
}

function main() {
  const queue = readJson(queuePath);
  const delivery = readJson(deliveryPath);
  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const currentFrames = frames();
  const missing = Object.values(currentFrames).filter((frame) => !fs.existsSync(`${epRoot}/${frame}`));
  if (missing.length) throw new Error(`missing candidate frames: ${missing.join(", ")}`);

  const queueShot = (queue.shots || []).find((shot) => shot.id === shotId);
  const deliveryShot = (delivery.shots || []).find((shot) => shot.id === shotId);
  if (!queueShot || !deliveryShot) throw new Error(`${shotId} not found in queue or delivery manifest`);
  applyShotStatus(queueShot);
  applyShotStatus(deliveryShot);

  fs.writeFileSync(reviewMdPath, `# Shot015 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Continuity input: \`storyboards/Shot014/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot015/Shot015_local_video_source_evidence_2026-08-01.jpg\`
- Local proof: \`production_system/reviews/local_asset_previs_proof_2026-07-31/Shot015_local_asset_previs_proof_2026-07-31.jpg\`

## Visual Audit

Shot purpose: make the opposing force disciplined and faith-driven, not disposable targets.

- Start frame: passes as emergence from fog after Shot014's shield impact. The formation reads as organized Western Church soldiers rather than raiders.
- Key frame: passes as the action peak. Shields, spears, church-derived banners, holy tokens, and chant performance are visible without subtitles or readable text.
- End frame: passes as edit handoff. The formation is close and aligned, with Byleth's edge silhouette setting up Dimitri's controlled response.
- Character/faction identity: SeirosSoldier visual language and church flags are locally traceable; Byleth is edge/partial by design.
- Frame chain: start/key/end are visually distinct and communicate emergence, formation clarity, and near-contact handoff states.

## Blocking Issues

No still-frame story/action blocker for Shot015 final candidate v1.

## Downstream Risks

- Rebel soldiers may become faceless clones or a chaotic swarm.
- Model may turn church believers into generic bandits, monsters, or villainous raiders.
- Flags, shields, or prayer tokens may generate readable text.
- Chant timing may add subtitles or overacting.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only the uploaded START, KEY, and END frames, run chant timing QA, run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if disciplined formation, faction identity, non-graphic tone, no-readable-text, and no-UI/no-subtitle presentation survive the probe.
`);

  upsertBy(artifacts.artifacts, "id", {
    id: artifactId,
    type: "storyboard_frame_set",
    stage: "storyboard",
    status: "monitor_required",
    created_by: "identity-preserve-imagegen-cleanup-agent",
    created_at: createdAt,
    paths: [
      currentFrames.start,
      currentFrames.key,
      currentFrames.end,
      reviewSheetPath.replace(`${epRoot}/`, ""),
      reviewMdPath.replace(`${epRoot}/`, ""),
    ],
    source_refs: frameSet().source_refs,
    depends_on: [
      "EP03-SHOT014-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02",
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    ],
    risk_flags: [
      "prompt_rewrite_required",
      "chant_timing_qa_required",
      "faceless_swarm_monitor_required",
      "bandit_drift_monitor_required",
      "banner_text_monitor_required",
      "not_approved_for_video",
      "motion_probe_required",
    ],
    notes: "Shot015 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "independent-storyboard-visual-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "visual_review_passed",
    blocking_issues: [],
    required_revisions: [
      "Rewrite executable web prompt to reference only uploaded START/KEY/END frames.",
      "Run chant timing QA for the rebel line.",
      "Run video-prompt QA against final candidate v1 actual frames.",
      "Run a 3-second motion probe before any approved_for_video promotion.",
    ],
    rubric: {
      story_beat: "pass",
      start_key_end_chain: "pass",
      faction_identity_readability: "pass",
      local_asset_traceability: "pass",
      video_readiness: "monitor_required",
    },
    reviewed_paths: [
      currentFrames.start,
      currentFrames.key,
      currentFrames.end,
      reviewSheetPath.replace(`${epRoot}/`, ""),
      reviewMdPath.replace(`${epRoot}/`, ""),
    ],
  });

  writeJson(queuePath, queue);
  writeJson(deliveryPath, delivery);
  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log("recorded Shot015 final candidate v1: visual_review_passed / monitor_required");
}

main();
