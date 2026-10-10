const fs = require("fs");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const identityReviewPath = `${epRoot}/production_system/identity_lock_review_2026-07-31.json`;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function localFrames(shotId) {
  return {
    start: `storyboards/${shotId}/start_frame.png`,
    key: `storyboards/${shotId}/key_frame.png`,
    end: `storyboards/${shotId}/end_frame.png`,
  };
}

function frameSetFor(shotId) {
  return {
    frame_set_id: `${shotId}_local_selected_png_composited_previs_v3_2026-08-01`,
    status: "layout_reference",
    frames: localFrames(shotId),
    review_markdown: "production_system/reviews/ep03_local_selected_png_composited_previs_v3_review_2026-08-01.md",
    note: "Deterministic composite from local selected.png character assets and local scene references. This proves local asset usage and shot coverage, but it is not final cinematic keyframe approval.",
  };
}

function main() {
  const queue = readJson(queuePath);
  const delivery = readJson(deliveryPath);
  const identityReview = fs.existsSync(identityReviewPath) ? readJson(identityReviewPath) : { shots: {} };
  const queueByShot = new Map((queue.shots || []).map((shot) => [shot.id, shot]));

  for (const shot of queue.shots || []) {
    const frameSet = frameSetFor(shot.id);
    shot.local_selected_png_composited_previs_v3 = frameSet;
    shot.current_display_frame_set = "local_selected_png_composited_previs_v3";
    shot.current_display_frame_status = "layout_reference";
    shot.current_display_frame_source = "local selected.png deterministic composite";
    shot.visual_audit_decision = "layout_reference";
    shot.visual_audit_finding = "Current displayed frames use local selected.png character assets as deterministic composited previs. They prove local asset participation and blocking, but matte cleanup, cinematic lighting, action peak, and independent identity review are still required.";
    shot.required_revision = "Create final cleaned start/key/end frames from local identity plates/source evidence, then run per-shot visual QA, video-prompt QA against real frames, motion probe, and strict continuity before video approval.";
    if (identityReview.shots?.[shot.id]) {
      shot.legacy_imagegen_candidate_decision = identityReview.shots[shot.id].decision;
      shot.legacy_imagegen_candidate_reason = identityReview.shots[shot.id].reason;
    }
  }

  for (const shot of delivery.shots || []) {
    const queueShot = queueByShot.get(shot.id) || {};
    shot.local_selected_png_composited_previs_v3 = frameSetFor(shot.id);
    shot.current_display_frame_set = "local_selected_png_composited_previs_v3";
    shot.current_display_frame_status = "layout_reference";
    shot.current_display_frame_source = "local selected.png deterministic composite";
    shot.status = "layout_reference";
    shot.visual_audit_decision = "layout_reference";
    shot.visual_audit_finding = queueShot.visual_audit_finding;
    shot.required_revision = queueShot.required_revision;
    shot.video_prompt_qa_decision = "blocked_until_final_local_asset_frames_pass_visual_review";
    shot.motion_probe_status = "blocked_until_final_local_asset_frames_pass_visual_review";
    shot.model_notes = [
      ...(shot.model_notes || []).filter((note) => !note.includes("Current visual audit blocks")),
      "Current displayed start/key/end frames are local selected.png composited previs v3 and are layout_reference only.",
      "Do not submit to a video model until final cleaned local-asset-locked frames pass visual QA.",
    ];
    if (identityReview.shots?.[shot.id]) {
      shot.legacy_imagegen_candidate_audit = {
        decision: identityReview.shots[shot.id].decision,
        reason: identityReview.shots[shot.id].reason,
      };
    }
  }

  delivery.updated_at = createdAt;
  delivery.current_display_frame_policy = {
    frame_set: "local_selected_png_composited_previs_v3",
    status: "layout_reference",
    source: "local selected.png deterministic composite",
    video_generation_status: "blocked",
  };

  writeJson(queuePath, queue);
  writeJson(deliveryPath, delivery);
  console.log(`synced local selected.png v3 layout references for ${(queue.shots || []).length} shots`);
}

main();
