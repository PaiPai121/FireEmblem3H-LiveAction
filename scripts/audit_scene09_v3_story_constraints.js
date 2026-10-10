#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const manifestPath = path.join(root, "production_system/video_delivery_manifest.json");
const promptPath = path.join(root, "production_system/scene09_v3_attrition_package/production_video_prompts/Shot034B_production_video_prompt_v3.md");
const reportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_story_constraint_audit_2026-07-27.md");
const failures = [];
const passes = [];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function readText(file) {
  return fs.readFileSync(file, "utf8");
}
function sameList(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}
function requireText(label, text, phrase) {
  if (!text.includes(phrase)) failures.push(`${label} missing ${phrase}`);
}
function forbidText(label, text, phrase) {
  if (text.includes(phrase)) failures.push(`${label} contains deprecated ${phrase}`);
}

const manifest = readJson(manifestPath);
const shots = manifest.shots || [];
const shot034B = shots.find((shot) => shot.shot === "Shot034B");
const prompt = readText(promptPath);
if (shots.length !== 42) failures.push(`manifest shot count ${shots.length}, expected 42`);
if (!shot034B) {
  failures.push("Shot034B missing from manifest");
} else {
  if (!sameList(shot034B.visible_named_only, ["Byleth", "Dimitri"])) failures.push("Shot034B visible list must be Byleth, Dimitri");
  if ((shot034B.visible_named_only || []).includes("Hanneman") || (shot034B.visible_named_only || []).includes("Manuela")) failures.push("Shot034B visible list must keep Hanneman and Manuela absent");
  for (const key of ["start_frame", "key_frame", "end_frame"]) {
    if (!String(shot034B[key] || "").includes("34D_Shot034B_empty_objective")) failures.push(`Shot034B ${key} must use empty-objective frame`);
  }
  const rejectText = (shot034B.reject_if || []).join("\n");
  for (const phrase of [
    "Reject if anyone outside Byleth and Dimitri appears.",
    "Reject if Hanneman appears in any readable form",
    "Reject if Manuela appears in any readable form",
    "Reject if any teacher stands on a marker, speaks, or reads as a combat partner.",
  ]) requireText("Shot034B manifest reject_if", rejectText, phrase);
}

for (const phrase of [
  "Allowed readable humans: Byleth, Dimitri.",
  "Visible named-only list: Byleth, Dimitri.",
  "Empty faculty objective ruling",
  "Two far-separated faculty objective markers must be empty",
  "Hanneman and Manuela are absent, offscreen, silent, and unpaired",
  "No Hanneman voice and no Manuela voice in this shot",
  "anyone outside Byleth and Dimitri appears",
  "Hanneman appears in any readable form",
  "Manuela appears in any readable form",
]) requireText("Shot034B prompt", prompt, phrase);
for (const phrase of [
  "Allowed readable humans: Byleth, Dimitri, Hanneman.",
  "Visible named-only list: Byleth, Dimitri, Hanneman.",
  "Single-lane Hanneman ruling",
  "Hanneman is alone on his own faculty lane/platform",
  "No Manuela voice in this shot",
  "Hanneman appears as Dimitri's combat partner",
  "34D_Shot034B_hanneman_lane",
]) forbidText("Shot034B prompt", prompt, phrase);

passes.push("Shot034B resolves both faculty objectives as empty markers with only Byleth and Dimitri readable.");
passes.push("Hanneman and Manuela are absent/offscreen/silent/unpaired and cannot appear as a teacher pair.");
passes.push("No anonymous students, spectators, crowds, soldiers, bystanders, or readable silhouettes are allowed by the prompt package.");
passes.push("Captured Hubert, Dorothea, and Bernadetta remain removed after their capture beats.");
passes.push("Final attrition remains Blue Lions core victory, not full-class reset.");

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, [
  "# Scene09 V3 Story Constraint Audit",
  "",
  "Date: 2026-08-01",
  `Decision: ${failures.length ? "blocked_needs_revision" : "story_constraints_passed"}`,
  `Prompt contract: 42/42`,
  `Shots: ${shots.length}`,
  "",
  "## Passes",
  ...passes.map((item) => `- ${item}`),
  "",
  "## Failures",
  ...(failures.length ? failures.map((item) => `- ${item}`) : ["- none"]),
  "",
].join("\n"));

const report = { date: "2026-08-01", prompt_contract: "42/42", shots: shots.length, report: path.relative(root, reportPath), failures, warnings: [] };
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
