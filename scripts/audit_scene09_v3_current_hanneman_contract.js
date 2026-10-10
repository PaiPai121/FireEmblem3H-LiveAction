#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(reportDir, `scene09_v3_current_hanneman_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_current_hanneman_contract_${date}.md`);
const packageJson = path.join(packageDir, "current_hanneman_contract_audit.json");
const packageMd = path.join(packageDir, "current_hanneman_contract_audit.md");

const expectedVisible = ["Byleth", "Dimitri"];
const shotDir = path.join(packageDir, "shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721");
const oldPhrases = [
  "Single-lane Hanneman ruling",
  "Only these readable humans may appear: Byleth, Dimitri, Hanneman.",
  "Hanneman is alone on his own faculty lane/platform.",
  "34D_Shot034B_hanneman_lane",
  "No Manuela voice in this shot",
  "Reject if Hanneman appears as Dimitri's combat partner",
];

function readJson(file, fallback = null) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function rel(file) {
  return path.relative(root, file);
}

function sameList(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

function parseJsonl(file) {
  return readText(file)
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function requireIncludes(label, text, phrases, problems) {
  for (const phrase of phrases) {
    if (!String(text || "").includes(phrase)) problems.push(`${label} missing required phrase: ${phrase}`);
  }
}

function forbidIncludes(label, text, phrases, problems) {
  for (const phrase of phrases) {
    if (String(text || "").includes(phrase)) problems.push(`${label} contains deprecated phrase: ${phrase}`);
  }
}

function checkShotSurface(label, shot, problems) {
  if (!shot) {
    problems.push(`${label}: missing Shot034B`);
    return;
  }
  if (shot.title !== "空教师目标裁定" && shot.titleZh !== "空教师目标裁定") {
    problems.push(`${label}: title is not 空教师目标裁定`);
  }
  if (!sameList(shot.visible_named_only, expectedVisible)) {
    problems.push(`${label}: visible_named_only is ${JSON.stringify(shot.visible_named_only || [])}, expected ${JSON.stringify(expectedVisible)}`);
  }
  for (const key of ["start_frame", "key_frame", "end_frame"]) {
    const compactKey = key.replace("_frame", "");
    const candidates = [
      shot[key],
      shot.source_frames?.[key],
      shot.source_frames?.[compactKey],
      shot.frames?.[key],
      shot.frames?.[compactKey],
      shot.frames?.[compactKey]?.path,
      shot.input_frames?.[key],
    ].map((value) => String(value || ""));
    const hasSourceFrame = candidates.some((value) => value.includes("34D_Shot034B_empty_objective"));
    const hasPackageLocalFrame = candidates.some((value) => value.includes(`036_EP02-SC09-SHOT-Shot034B-V2-20260721/${key}.png`));
    if (!hasSourceFrame && !hasPackageLocalFrame) {
      problems.push(`${label}: ${key} is not locked to 34D_Shot034B_empty_objective`);
    }
  }
}

function main() {
  const problems = [];
  const warnings = [];
  const packageManifest = readJson(path.join(packageDir, "package_manifest.json"), { shots: [] });
  const activeManifest = readJson(path.join(root, "production_system/video_delivery_manifest.json"), { shots: [] });
  const metadata = readJson(path.join(shotDir, "metadata.json"), {});
  const payloadRows = parseJsonl(path.join(packageDir, "submission_payload.jsonl"));
  const payloadShot = payloadRows.find((row) => row.shot === "Shot034B");
  const modelPrompt = readText(path.join(shotDir, "model_prompt.md"));
  const auditPrompt = readText(path.join(shotDir, "prompt.md"));
  const negativePrompt = readText(path.join(shotDir, "negative_prompt.md"));
  const handoffIndex = readText(path.join(packageDir, "index.html"));
  const gateText = readText(path.join(root, "production_system/gates/enforce_scene09_shot034b_empty_objective.js"));
  const directShimText = readText(path.join(root, "scripts/apply_scene09_034B_empty_objective_current_contract.js"));

  checkShotSurface("package_manifest", (packageManifest.shots || []).find((row) => row.shot === "Shot034B"), problems);
  checkShotSurface("active_manifest", (activeManifest.shots || []).find((row) => row.shot === "Shot034B"), problems);
  checkShotSurface("metadata", metadata, problems);
  checkShotSurface("submission_payload", payloadShot, problems);

  requireIncludes("model_prompt.md", modelPrompt, [
    "Allowed readable humans: Byleth, Dimitri.",
    "Visible named-only list: Byleth, Dimitri.",
    "Empty faculty objective ruling",
    "Two far-separated faculty objective markers must be empty",
    "Hanneman and Manuela are absent, offscreen, silent, and unpaired.",
    "No Hanneman voice and no Manuela voice in this shot.",
    "- No-active-combat after this shot:",
    "- Visible But No Active Combat After: none.",
    "Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
    "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
  ], problems);
  requireIncludes("negative_prompt.md", negativePrompt, [
    "no readable Hanneman",
    "no readable Manuela",
    "no paired teachers",
    "no active return of Hanneman",
    "no active return of Manuela",
  ], problems);
  requireIncludes("index.html", handoffIndex, [
    "空教师目标裁定",
    "Byleth, Dimitri",
    "Visible But No Active Combat After",
  ], problems);

  forbidIncludes("model_prompt.md", modelPrompt, oldPhrases, problems);
  forbidIncludes("prompt.md", auditPrompt, oldPhrases, problems);
  forbidIncludes("metadata.json", JSON.stringify(metadata), oldPhrases, problems);
  forbidIncludes("submission_payload.jsonl Shot034B", JSON.stringify(payloadShot || {}), oldPhrases, problems);

  if (!gateText.includes("scene09_034b_empty_objective_direct_current.js")) {
    problems.push("legacy gate does not route to scene09_034b_empty_objective_direct_current.js");
  }
  if (!directShimText.includes("scene09_034b_empty_objective_direct_current.js")) {
    problems.push("direct empty-objective compatibility shim does not route to scene09_034b_empty_objective_direct_current.js");
  }
  forbidIncludes("legacy gate", gateText, ["Byleth, Dimitri, and Hanneman"], problems);
  forbidIncludes("direct compatibility shim", directShimText, ["Byleth, Dimitri, and Hanneman"], problems);

  const report = {
    date,
    decision: problems.length ? "current_hanneman_contract_blocked" : "current_hanneman_contract_passed",
    shot: "Shot034B",
    visible_named_only: expectedVisible,
    checked_files: [
      rel(path.join(packageDir, "package_manifest.json")),
      rel(path.join(root, "production_system/video_delivery_manifest.json")),
      rel(path.join(shotDir, "metadata.json")),
      rel(path.join(shotDir, "model_prompt.md")),
      rel(path.join(shotDir, "prompt.md")),
      rel(path.join(shotDir, "negative_prompt.md")),
      rel(path.join(packageDir, "submission_payload.jsonl")),
      rel(path.join(root, "production_system/gates/enforce_scene09_shot034b_empty_objective.js")),
      rel(path.join(root, "scripts/apply_scene09_034B_empty_objective_current_contract.js")),
    ],
    problems,
    warnings,
  };

  const md = [
    "# Scene09 V3 Current Shot034B Empty Objective Contract Audit",
    "",
    `Date: ${date}`,
    `Decision: ${report.decision}`,
    "",
    "## Scope",
    "",
    "Shot034B must be the empty faculty objective ruling: Byleth and Dimitri only; Hanneman and Manuela absent/offscreen/silent/unpaired; both faculty objective markers stay empty.",
    "",
    "## Problems",
    "",
    ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- none"]),
    "",
  ].join("\n");

  writeJson(outJson, report);
  writeJson(packageJson, report);
  writeText(outMd, md);
  writeText(packageMd, md);
  process.stdout.write(`${JSON.stringify({
    decision: report.decision,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageJson),
  }, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

main();
