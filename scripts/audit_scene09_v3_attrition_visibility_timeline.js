#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const manifestPath = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json");
const reportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_attrition_visibility_timeline_audit_2026-07-28.json");
const reportMdPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_attrition_visibility_timeline_audit_2026-07-28.md");
const problems = [];
const warnings = [];

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const shots = manifest.shots || [];
const shot034B = shots.find((shot) => shot.shot === "Shot034B");
const shot034G = shots.find((shot) => shot.shot === "Shot034G");
const shot036 = shots.find((shot) => shot.shot === "Shot036");
function same(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}
function requireVisible(shot, expected) {
  if (!shot) return problems.push(`${expected.join(",")}: shot missing`);
  if (!same(shot.visible_named_only, expected)) problems.push(`${shot.shot}: visible expected ${expected.join(",")} got ${(shot.visible_named_only || []).join(",") || "none"}`);
}
requireVisible(shot034B, ["Byleth", "Dimitri"]);
requireVisible(shot034G, ["Byleth", "Dimitri", "Dedue"]);
requireVisible(shot036, ["Dimitri", "Byleth"]);
if (shot034B?.visible_named_only?.includes("Hanneman")) problems.push("Shot034B must keep Hanneman absent from visible roster");
if (shot034B?.visible_named_only?.includes("Manuela")) problems.push("Shot034B must keep Manuela absent from visible roster");
if (shot034B && ![shot034B.start_frame, shot034B.key_frame, shot034B.end_frame].every((file) => String(file || "").includes("34D_Shot034B_empty_objective"))) {
  problems.push("Shot034B frames must use empty-objective frame set");
}
const prompt = shot034B ? fs.readFileSync(path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27", shot034B.package_dir, "model_prompt.md"), "utf8") : "";
for (const phrase of [
  "Only these readable humans may appear: Byleth, Dimitri.",
  "Empty faculty objective ruling",
  "Two far-separated faculty objective markers must be empty.",
  "Hanneman and Manuela are absent, offscreen, silent, and unpaired.",
]) if (!prompt.includes(phrase)) problems.push(`Shot034B prompt missing ${phrase}`);
for (const phrase of ["Only these readable humans may appear: Byleth, Dimitri, Hanneman.", "Single-lane Hanneman ruling", "34D_Shot034B_hanneman_lane", "Hanneman is alone on his own faculty lane/platform."]) {
  if (prompt.includes(phrase)) problems.push(`Shot034B prompt contains deprecated ${phrase}`);
}
for (const shot of shots) {
  const active = shot.active_after || shot.battle_state_after?.active_after || [];
  if (Number(shot.order || 0) >= 36 && (active.includes("Hanneman") || active.includes("Manuela"))) {
    problems.push(`${shot.shot}: teacher remains active after Shot034B`);
  }
}

const report = {
  date: "2026-08-01",
  decision: problems.length ? "blocked_needs_revision" : "attrition_visibility_timeline_passed",
  shots: shots.length,
  problems,
  warnings,
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(reportMdPath, [
  "# Scene09 V3 Attrition Visibility Timeline Audit",
  "",
  `Decision: ${report.decision}`,
  `Shots: ${shots.length}`,
  "",
  ...(problems.length ? problems.map((item) => `- ${item}`) : ["- none"]),
  "",
].join("\n"));
console.log(JSON.stringify(report, null, 2));
process.exit(problems.length ? 1 : 0);
