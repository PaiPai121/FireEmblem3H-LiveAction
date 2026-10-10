#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const delivery = JSON.parse(fs.readFileSync(path.join(root, "production_system/video_delivery_manifest.json"), "utf8"));
const localRefs = [
  ["EP04-style", "source/reference_pack/style/live_action_style_reference.png", "style"],
  ["EP04-tomb", "source/reference_pack/locations/SeirosTomb_reference.png", "location"],
  ["EP04-cathedral", "source/reference_pack/locations/CathedralInterior_reference.png", "location"],
  ["EP04-cloister", "source/reference_pack/locations/MonasteryMainCloister_reference.png", "location"],
  ["EP04-antechamber", "source/reference_pack/locations/MonasteryCathedralAntechamber_reference.png", "location"],
  ["EP04-forest", "source/reference_pack/locations/MistForest_reference.png", "location"],
  ["EP04-dream", "source/reference_pack/locations/DreamSanctuary_reference.png", "location"],
  ["EP04-byleth-face", "source/reference_pack/characters/BylethFemale_face.png", "identity"],
  ["EP04-byleth-body", "source/reference_pack/characters/BylethFemale_fullbody.png", "identity"],
  ["EP04-dimitri-face", "source/reference_pack/characters/Dimitri_face.png", "identity"],
  ["EP04-dimitri-body", "source/reference_pack/characters/Dimitri_fullbody.png", "identity"],
  ["EP04-dedue-face", "source/reference_pack/characters/Dedue_face.png", "identity"],
  ["EP04-dedue-body", "source/reference_pack/characters/Dedue_fullbody.png", "identity"],
  ["EP04-rhea", "source/reference_pack/characters/Rhea_face.png", "identity"],
  ["EP04-seteth", "source/reference_pack/characters/Seteth_face.png", "identity"],
  ["EP04-manuela", "source/reference_pack/characters/Manuela_face.png", "identity"],
  ["EP04-hanneman", "source/reference_pack/characters/Hanneman_face.png", "identity"],
  ["EP04-death-knight", "source/reference_pack/characters/DeathKnight_identity.png", "identity"],
  ["EP04-flame-emperor", "source/reference_pack/characters/FlameEmperor_identity.png", "identity"],
  ["EP04-sothis", "source/reference_pack/characters/Sothis_identity.png", "identity"]
];

const contract = {
  version: 1,
  request_id: "EP04-frame-generation-v1",
  project: "FireEmblem3H-LiveAction",
  episode: "EP04",
  target: "prompt_asset_package",
  frames_required: true,
  asset_generation: false,
  age_lock_required: false,
  target_aspect: "16:9",
  output_format: "png",
  generation_mode: "built_in_imagegen_one_frame_per_call",
  style_lock: {
    required_style_reference_ids: ["EP04-style"],
    visual_target: "integrated photorealistic live-action fantasy film frame",
    forbidden_visuals: ["game UI", "tactical grid", "dialogue box", "anime", "illustration", "poster", "watermark", "subtitle", "child-coded performer", "war-phase aging"]
  },
  reference_sets: localRefs.map(([id, refPath, role]) => ({
    id,
    path: refPath,
    role,
    generation_allowed: true
  })),
  shots: delivery.shots.map((shot) => ({
    id: shot.id,
    status: "queued",
    expected_frames: [
      { role: "start", path: shot.start_frame },
      { role: "key", path: shot.key_frame },
      { role: "end", path: shot.end_frame }
    ],
    reference_ids: localRefs.filter(([id]) => id === "EP04-style" || id.startsWith("EP04-")).map(([id]) => id)
  }))
};

const state = {
  version: 1,
  request_id: contract.request_id,
  project: "FireEmblem3H-LiveAction",
  episode: "EP04",
  status: "partial",
  queue_status: "running",
  frames_required: true,
  target: "prompt_asset_package",
  total_expected_frames: delivery.shots.length * 3,
  completed_frames: 4,
  pending_frames: delivery.shots.length * 3 - 4,
  last_completed: [
    "storyboards/Shot001/frames_pending/start_frame.png",
    "storyboards/Shot001/frames_pending/key_frame.png",
    "storyboards/Shot001/frames_pending/end_frame.png",
    "storyboards/Shot002/frames_pending/start_frame.png"
  ],
  stop_reason: "",
  notes: "Actual frames are generated with the built-in image generator and must be visually reviewed before promotion."
};

fs.writeFileSync(path.join(root, "production_system/generation_contract.json"), JSON.stringify(contract, null, 2) + "\n");
fs.writeFileSync(path.join(root, "production_system/generation_state.json"), JSON.stringify(state, null, 2) + "\n");
fs.writeFileSync(path.join(root, "production_system/generation_receipts.json"), JSON.stringify({
  version: 1,
  request_id: contract.request_id,
  receipts: [
    {
      shot_id: "Shot001",
      frame_role: "start",
      path: "storyboards/Shot001/frames_pending/start_frame.png",
      decision: "visual_review_passed",
      reviewer_role: "visual-qa-agent",
      reviewed_paths: ["storyboards/Shot001/frames_pending/start_frame.png"],
      notes: "Probe frame visually checked: integrated live-action corridor, adult Byleth, closed door, practical candles, no UI or border.",
      generation_method: "built_in_imagegen",
      reviewed_at: "2026-08-27"
    }
  ]
}, null, 2) + "\n");
console.log(JSON.stringify({expected_frames: delivery.shots.length * 3, seeded_receipts: 1, status: state.status}, null, 2));
