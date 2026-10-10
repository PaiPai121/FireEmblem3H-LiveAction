#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageManifestPath = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json");

const replacements = {
  Shot026C: {
    key_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/anchor_motion_patch_2026-08-15/05R_Shot026C_blue_lions_depart_key.png",
    visible_named_only: [
      "Byleth",
      "Dimitri",
      "Dedue",
      "Felix",
      "Ashe",
      "Annette",
      "Mercedes",
      "Sylvain",
      "Ingrid",
    ],
    primary_check: "anchor_motion_patch_2026_08_15_byleth_visible",
  },
  Shot027: {
    key_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/anchor_motion_patch_2026-08-15/06R_Shot027_ashe_detects_claude_key.png",
    primary_check: "anchor_motion_patch_2026_08_15_ashe_detects_claude",
  },
  Shot031B: {
    key_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/anchor_motion_patch_2026-08-15/21R_Shot031B_byleth_reorders_blue_lions_key.png",
    primary_check: "anchor_motion_patch_2026_08_15_blunt_training_weapons",
  },
  Shot032B: {
    key_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/anchor_motion_patch_2026-08-15/24R_Shot032B_dimitri_dedue_approach_hanneman_key.png",
    primary_check: "anchor_motion_patch_2026_08_15_hanneman_alone_no_manuela",
  },
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function assertExists(relPath) {
  const file = path.join(root, relPath);
  if (!fs.existsSync(file)) throw new Error(`missing replacement frame: ${relPath}`);
}

function applyToShot(shot, patch) {
  if (patch.key_frame) {
    assertExists(patch.key_frame);
    shot.key_frame = patch.key_frame;
    if (!shot.source_frames) shot.source_frames = {};
    shot.source_frames.key_frame = patch.key_frame;
    if (shot.frames) {
      if (!shot.frames.key) shot.frames.key = {};
      shot.frames.key.path = patch.key_frame;
      shot.frames.key_frame = patch.key_frame;
    }
  }
  if (patch.visible_named_only) {
    shot.visible_named_only = patch.visible_named_only;
    if (shot.frame_prompt) shot.frame_prompt.visible_named_only = patch.visible_named_only;
    if (shot.video_prompt) shot.video_prompt.visible_named_only = patch.visible_named_only;
  }
  if (patch.primary_check) shot.primary_check = patch.primary_check;
}

function main() {
  const manifest = readJson(packageManifestPath);
  const patched = [];
  for (const [shotId, patch] of Object.entries(replacements)) {
    const shot = (manifest.shots || []).find((row) => row.shot === shotId);
    if (!shot) throw new Error(`shot not found: ${shotId}`);
    applyToShot(shot, patch);
    patched.push(shotId);
  }
  writeJson(packageManifestPath, manifest);
  console.log(JSON.stringify({
    ok: true,
    patched,
    package_manifest: path.relative(root, packageManifestPath),
  }, null, 2));
}

main();
