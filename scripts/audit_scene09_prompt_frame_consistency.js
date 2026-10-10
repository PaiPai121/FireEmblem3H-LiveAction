#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const deliveryPath = path.join(root, "production_system/video_delivery_manifest.json");
const queuePath = path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json");
const promptPath = path.join(root, "production_system/scene09_v3_attrition_package/production_video_prompts/Shot034B_production_video_prompt_v3.md");
const problems = [];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function readText(file) {
  return fs.readFileSync(file, "utf8");
}
function same(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}
function findShot(rows, shot) {
  return rows.find((row) => row.shot === shot);
}
function checkShot(label, shot) {
  if (!shot) return problems.push(`${label}: Shot034B missing`);
  if (!same(shot.visible_named_only, ["Byleth", "Dimitri"])) problems.push(`${label}: Shot034B visible must be Byleth,Dimitri`);
  for (const key of ["start_frame", "key_frame", "end_frame"]) {
    if (!String(shot[key] || shot.frames?.[key]?.path || "").includes("34D_Shot034B_empty_objective")) problems.push(`${label}: ${key} must use empty-objective frame`);
  }
}

const delivery = readJson(deliveryPath).shots || [];
const queue = readJson(queuePath);
const prompt = readText(promptPath);
checkShot("delivery", findShot(delivery, "Shot034B"));
checkShot("queue", findShot(queue, "Shot034B"));
for (const phrase of [
  "Allowed readable humans: Byleth, Dimitri.",
  "Visible named-only list: Byleth, Dimitri.",
  "Empty faculty objective ruling",
  "Two far-separated faculty objective markers must be empty.",
  "Hanneman and Manuela are absent, offscreen, silent, and unpaired.",
  "No Hanneman voice and no Manuela voice in this shot.",
  "Reject if anyone outside Byleth and Dimitri appears.",
]) {
  if (!prompt.includes(phrase)) problems.push(`Shot034B prompt missing ${phrase}`);
}
for (const phrase of [
  "Allowed readable humans: Byleth, Dimitri, Hanneman.",
  "Visible named-only list: Byleth, Dimitri, Hanneman.",
  "Single-lane Hanneman ruling",
  "34D_Shot034B_hanneman_lane",
  "Hanneman is alone on his own faculty lane/platform",
]) {
  if (prompt.includes(phrase)) problems.push(`Shot034B prompt has deprecated ${phrase}`);
}

const statusCounts = {};
for (const shot of delivery) statusCounts[shot.status || "missing"] = (statusCounts[shot.status || "missing"] || 0) + 1;
const result = { ok: problems.length === 0, shots: delivery.length, statusCounts, problems };
console.log(JSON.stringify(result, null, 2));
process.exit(problems.length ? 1 : 0);
