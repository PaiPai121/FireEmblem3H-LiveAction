#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const epRoot = path.join(root, "episodes", "EP03");
const deliveryPath = path.join(epRoot, "production_system", "video_delivery_manifest.json");
const queuePath = path.join(epRoot, "frame_generation_queue.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function frameSetFor(shot) {
  const requested = shot.current_display_frame_set || "";
  const candidate = (requested && shot[requested]) || shot.displayed_frame_set || shot.integrated_candidate_v2 || shot.local_asset_final_candidate_v1;
  if (!candidate) return null;
  const frames = candidate.frames || {
    start: candidate.start_frame,
    key: candidate.key_frame,
    end: candidate.end_frame,
  };
  if (!frames.start || !frames.key || !frames.end) return null;
  return {
    ...candidate,
    version: candidate.version || candidate.frame_set_id || requested || "current",
    frames: { start: frames.start, key: frames.key, end: frames.end },
  };
}

function syncShots(shots) {
  let changed = 0;
  const report = [];
  for (const shot of shots || []) {
    const frameSet = frameSetFor(shot);
    if (!frameSet) continue;
    const next = {
      start_frame: frameSet.frames.start,
      key_frame: frameSet.frames.key,
      end_frame: frameSet.frames.end,
    };
    const before = JSON.stringify({ start_frame: shot.start_frame, key_frame: shot.key_frame, end_frame: shot.end_frame });
    const after = JSON.stringify(next);
    shot.start_frame = next.start_frame;
    shot.key_frame = next.key_frame;
    shot.end_frame = next.end_frame;
    shot.displayed_frame_set = frameSet;
    shot.current_display_frame_source = frameSet.source || shot.current_display_frame_source || "current displayed frame set";
    if (before !== after) changed += 1;
    report.push({ id: shot.id, current_display_frame_set: shot.current_display_frame_set, frames: next });
  }
  return { changed, report };
}

const delivery = readJson(deliveryPath);
const deliverySync = syncShots(delivery.shots);
delivery.updated_at = "2026-08-24";
writeJson(deliveryPath, delivery);

let queueSync = { changed: 0, report: [] };
if (fs.existsSync(queuePath)) {
  const queue = readJson(queuePath);
  queueSync = syncShots(queue.shots);
  queue.updated_at = "2026-08-24";
  writeJson(queuePath, queue);
}

console.log(JSON.stringify({ delivery_changed: deliverySync.changed, queue_changed: queueSync.changed, shots: deliverySync.report }, null, 2));
