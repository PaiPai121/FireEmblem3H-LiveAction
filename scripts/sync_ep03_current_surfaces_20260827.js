const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const epRoot = path.join(root, "episodes", "EP03");
const today = "2026-08-27";
const promptQaReview = "production_system/reviews/video_prompt_qa_2026-08-27.json";
const promptQaMarkdown = "production_system/reviews/video_prompt_qa_2026-08-27.md";

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

function currentFrames(shot) {
  return shot.output_frames || {
    start: shot.start_frame,
    key: shot.key_frame,
    end: shot.end_frame
  };
}

function updatePackageManifest() {
  const relativePath = "episodes/EP03/prompt_asset_package_manifest.json";
  const manifest = readJson(relativePath);
  const delivery = readJson("episodes/EP03/production_system/video_delivery_manifest.json");
  const deliveryById = new Map((delivery.shots || []).map((shot) => [shot.id, shot]));

  manifest.version = 2;
  manifest.updated_at = today;
  manifest.frame_generation_required = true;
  manifest.frame_generation_mode =
    "imagegen-integrated live-action START/KEY/END frames generated from canonical local identity and location references; current static frames are present and reviewed; motion clips pending";
  manifest.status = "monitor_required";
  manifest.frame_status = {
    expected_frames: 108,
    present_frames: 108,
    reviewed_frames: 108,
    status: "partial",
    note: "Static frame and contact-sheet evidence is current; semantic prompt-against-frame review and 3-second motion probes remain pending."
  };
  manifest.prompt_qa = {
    decision: "prompt_contract_passed_monitor_required",
    review_json: promptQaReview,
    review_markdown: promptQaMarkdown,
    structural_pass: "36/36",
    semantic_prompt_against_frame: "pending_manual_or_model_review"
  };
  manifest.motion_probe_status = "clips_pending";
  manifest.notes =
    "EP03 current package has 108 reviewed static frames across 36 shots. Keep monitor_required until prompt-against-frame semantics, strict adjacent continuity, Japanese audio timing, and 3-second motion probes are complete.";

  for (const shot of manifest.shots || []) {
    const current = deliveryById.get(shot.id);
    if (!current) continue;
    const frames = currentFrames(current);
    shot.status = current.status || "monitor_required";
    shot.frames = frames;
    shot.start_frame = frames.start;
    shot.key_frame = frames.key;
    shot.end_frame = frames.end;
    shot.current_display_frame_set = current.current_display_frame_set || "";
    shot.current_display_frame_version = current.displayed_frame_set?.version || "";
    shot.current_display_frame_status = current.current_display_frame_status || "";
    shot.current_display_frame_source = current.current_display_frame_source || "";
    shot.current_display_frame_note = current.current_display_frame_note || "";
    shot.contact_sheet = current.displayed_frame_set?.contact_sheet || "";
    shot.video_prompt_qa_decision = current.video_prompt_qa_decision || "";
    shot.video_prompt_qa_review = promptQaReview;
    shot.motion_probe_status = current.motion_probe_status || "clips_pending";
  }
  writeJson(relativePath, manifest);
  return manifest;
}

function updateGenerationStates() {
  const statePath = "episodes/EP03/production_system/generation_state.json";
  writeJson(statePath, {
    version: 2,
    project: "EP03",
    status: "partial",
    frames_required: true,
    expected_frames: 108,
    completed_frames: 108,
    reviewed_frames: 108,
    last_completed: "Shot036",
    last_updated: today,
    updated_at: today,
    stop_reason: "motion_probe_pending; video_model_cli_not_configured",
    review_state:
      "current 36-shot frame chain is present and visually reviewed; prompt contract 36/36 passed; semantic prompt-against-frame review and 3-second motion probes pending",
    queue: {
      frame_generation_queue: "frame_generation_queue.json",
      delivery_manifest: "production_system/video_delivery_manifest.json",
      prompt_qa_review: promptQaReview,
      motion_probe_queue: "delivery/motion_probe_package_2026-08-10/submission_queue.json"
    }
  });

  const rootStatePath = "production_system/generation_state.json";
  const rootState = readJson(rootStatePath);
  rootState.last_updated = today;
  rootState.status = "partial";
  rootState.frames_required = true;
  rootState.stop_reason = "motion_probe_pending; video_model_cli_not_configured";
  rootState.review_state =
    "EP03 current 36-shot chain: Shot025 v6, Shot026-029 v6, Shot030-035 v2, Shot036 v1; 108/108 frames present/reviewed; prompt contract 36/36 passed; semantic prompt-against-frame and motion probe pending";
  writeJson(rootStatePath, rootState);
}

function registerReviewArtifacts() {
  const artifactPath = "episodes/EP03/production_system/artifact_manifest.json";
  const artifactManifest = readJson(artifactPath);
  artifactManifest.artifacts = artifactManifest.artifacts || [];
  const artifactId = "EP03-VIDEO-PROMPT-QA-2026-08-27";
  if (!artifactManifest.artifacts.some((artifact) => artifact.id === artifactId)) {
    artifactManifest.artifacts.push({
      id: artifactId,
      type: "video_prompt_qa",
      stage: "prompt_asset_package",
      status: "monitor_required",
      created_by: "codex-video-prompt-qa-audit",
      created_at: today,
      paths: [promptQaReview, promptQaMarkdown],
      source_refs: ["video_prompts", "storyboards", "production_system/video_delivery_manifest.json"],
      depends_on: ["EP03-FRAME-GENERATION-STATE"],
      risk_flags: ["semantic_prompt_against_frame_pending", "motion_probe_pending"],
      notes: "Structural prompt contract and current-file integrity audit for all 36 EP03 shots."
    });
  }
  writeJson(artifactPath, artifactManifest);

  const reviewPath = "episodes/EP03/production_system/review_manifest.json";
  const reviewManifest = readJson(reviewPath);
  reviewManifest.reviews = reviewManifest.reviews || [];
  const reviewId = "review-2026-08-27-ep03-video-prompt-qa";
  if (!reviewManifest.reviews.some((review) => review.review_id === reviewId)) {
    reviewManifest.reviews.push({
      artifact_id: artifactId,
      review_id: reviewId,
      reviewer_role: "video-prompt-qa-agent",
      reviewer: "codex",
      created_at: today,
      decision: "monitor_required",
      blocking_issues: [],
      required_revisions: ["Complete semantic prompt-against-frame review and 3-second motion probes before promotion."],
      rubric: {
        prompt_contract: "pass_36_of_36",
        current_file_integrity: "pass_36_of_36",
        semantic_prompt_against_frame: "pending",
        motion_probe: "pending"
      },
      reviewed_paths: [promptQaReview, promptQaMarkdown]
    });
  }
  writeJson(reviewPath, reviewManifest);
}

function updateCompletionMapping() {
  const relativePath = "episodes/EP03/production_system/completion_target_mapping.json";
  const mapping = readJson(relativePath);
  mapping.last_audited = today;
  mapping.current_state = {
    frame_expected: 108,
    frame_present: 108,
    frame_reviewed: 108,
    frame_state: "partial: 108 current frames present and visually reviewed; video clips remain absent",
    prompt_contracts: "36/36 passed; see production_system/reviews/video_prompt_qa_2026-08-27.json",
    viewer_link_audit: "current EP03 viewers rebuilt after frame/prompt sync; static local-path checks passed",
    combat_choreography: "passed for Shot026-029 in EP03 validation staging",
    dialogue_timing: "prompt timing blocks are present; repository-level dialogue join and native Japanese audio probe remain pending",
    motion_probe: "clips_pending"
  };
  writeJson(relativePath, mapping);
}

function main() {
  const manifest = updatePackageManifest();
  updateGenerationStates();
  registerReviewArtifacts();
  updateCompletionMapping();
  console.log(
    JSON.stringify(
      {
        updated: true,
        status: manifest.status,
        frame_status: manifest.frame_status,
        prompt_qa: manifest.prompt_qa,
        motion_probe_status: manifest.motion_probe_status
      },
      null,
      2
    )
  );
}

main();
