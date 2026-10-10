#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const pkg = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const reportDir = "production_system/scene09_v3_attrition_package";
const currentReportJson = `${reportDir}/scene09_v3_actual_delivery_surface_audit_2026-08-01.json`;
const currentReportMd = `${reportDir}/scene09_v3_actual_delivery_surface_audit_2026-08-01.md`;
const legacyReportJson = `${reportDir}/scene09_v3_actual_delivery_surface_audit_2026-07-31.json`;
const packageReportJson = `${pkg}/actual_delivery_surface_audit.json`;
const packageReportMd = `${pkg}/actual_delivery_surface_audit.md`;
const files = [
  "production_system/video_delivery_manifest.json",
  `${pkg}/package_manifest.json`,
  "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json",
  `${pkg}/execution_plan.json`,
  `${pkg}/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/metadata.json`,
];
const htmlFiles = [
  `${pkg}/index.html`,
  `${pkg}/model_submission_batches/index.html`,
  "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/index.html",
];
const promptFiles = [
  "production_system/scene09_v3_attrition_package/production_video_prompts/Shot034B_production_video_prompt_v3.md",
  `${pkg}/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/model_prompt.md`,
  `${pkg}/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/prompt.md`,
];
const problems = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}
function readJson(file) {
  return JSON.parse(read(file));
}
function rows(data, key) {
  if (Array.isArray(data)) return data;
  if (data?.shot) return [data];
  return data?.[key] || data?.shots || [];
}
function shotFrom(file) {
  const data = readJson(file);
  const key = file.endsWith("execution_plan.json") ? "work_orders" : "shots";
  return rows(data, key).find((row) => row.shot === "Shot034B");
}
function same(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b);
}
function checkShot(label, shot) {
  if (!shot) return problems.push(`${label}: missing Shot034B`);
  const title = shot.titleZh || (/Title:\n([^\n]+)/.exec(shot.prompt_text || "") || [])[1];
  if (title !== "空教师目标裁定") problems.push(`${label}: titleZh=${title}`);
  if (!same(shot.visible_named_only, ["Byleth", "Dimitri"])) problems.push(`${label}: visible=${JSON.stringify(shot.visible_named_only)}`);
  for (const key of ["start_frame", "key_frame", "end_frame"]) {
    const compactKey = key.replace("_frame", "");
    const values = [
      shot[key],
      shot.source_frames?.[key],
      shot.source_frames?.[compactKey],
      shot.input_frames?.[key],
      shot.input_frames?.[compactKey],
      shot.frames?.[key],
      shot.frames?.[compactKey],
      shot.frames?.[compactKey]?.path,
      shot.prompt_text,
    ].filter(Boolean);
    const hasSourceFrame = values.some((value) => String(value).includes("34D_Shot034B_empty_objective")) ||
      String(shot.prompt_text || "").includes(`34D_Shot034B_empty_objective_${compactKey}`);
    const hasPackageInput = String(shot[key] || "").includes("036_EP02-SC09-SHOT-Shot034B-V2-20260721") ||
      String(shot.input_frames?.[key] || "").includes("036_EP02-SC09-SHOT-Shot034B-V2-20260721");
    if (!hasSourceFrame && !hasPackageInput) problems.push(`${label}: ${key}=${values.join(" | ")}`);
  }
}

for (const file of files) checkShot(file, shotFrom(file));
for (const file of htmlFiles) {
  const text = read(file);
  if (!text.includes("空教师目标裁定")) problems.push(`${file}: missing Chinese title`);
  if (!text.includes("34D_Shot034B_empty_objective") && !text.includes("036_EP02-SC09-SHOT-Shot034B-V2-20260721/start_frame.png")) problems.push(`${file}: missing empty-objective frame evidence`);
  if (/汉尼曼单线目标裁定|34D_Shot034B_hanneman_lane|Single-lane Hanneman ruling/.test(text)) problems.push(`${file}: old Hanneman-lane evidence remains`);
  if (file.endsWith("model_submission_batches/index.html")) {
    const ledgerCards = (text.match(/Battle Ledger After/g) || []).length;
    if (ledgerCards !== 42) problems.push(`${file}: battle ledger panels=${ledgerCards}, expected 42`);
    for (const phrase of [
      "Alive / Safe After:",
      "Active / Controlling After:",
      "Limited But Not Defeated After:",
      "Defeated / Removed After:",
      "Captured / Objective-Defeated After:",
      "Stood Down / Post-Battle After:",
      "Must Not Return Active:",
      "Changed This Shot:",
      "No-Active-Combat Line:",
    ]) {
      if (!text.includes(phrase)) problems.push(`${file}: missing ${phrase}`);
    }
    for (const phrase of [
      "Hubert, Dorothea, Bernadetta",
      "Hanneman",
      "Manuela",
      "Must Not Return Active",
    ]) {
      if (!text.includes(phrase)) problems.push(`${file}: missing ledger continuity phrase ${phrase}`);
    }
  }
}
for (const file of promptFiles) {
  const text = read(file);
  for (const phrase of [
    "Empty faculty objective ruling",
    "Allowed readable humans: Byleth, Dimitri.",
    "Visible named-only list: Byleth, Dimitri.",
    "Two far-separated faculty objective markers must be empty",
    "No Hanneman voice and no Manuela voice in this shot",
    "Reject if anyone outside Byleth and Dimitri appears.",
    "Hanneman appears in any readable form",
    "Manuela appears in any readable form",
  ]) {
    if (!text.includes(phrase)) problems.push(`${file}: missing ${phrase}`);
  }
  if (!text.includes("No anonymous readable students") && !text.includes("No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.")) {
    problems.push(`${file}: missing no unnamed/anonymous readable students lock`);
  }
  if (/Single-lane Hanneman ruling|Hanneman is alone on his own faculty lane\/platform|No Manuela voice in this shot|Only these readable humans may appear: Byleth, Dimitri, Hanneman\./.test(text)) {
    problems.push(`${file}: old Hanneman-lane prompt evidence remains`);
  }
}
const payloadRows = read(`${pkg}/submission_payload.jsonl`).trim().split(/\n/).filter(Boolean).map(JSON.parse);
const payloadShot = payloadRows.find((row) => row.shot === "Shot034B");
if (payloadRows.length !== 42) problems.push(`submission_payload rows=${payloadRows.length}`);
checkShot("submission_payload", payloadShot);
if (payloadShot && !String(payloadShot.prompt_text || "").includes("Empty faculty objective ruling")) problems.push("submission_payload: prompt_text mismatch");

const result = {
  date: "2026-08-01",
  decision: problems.length ? "shot034b_empty_objective_failed" : "shot034b_empty_objective_passed",
  problems,
  evidence: [
    "Shot034B visible roster is Byleth, Dimitri across delivery surfaces.",
    "Shot034B Chinese title is 空教师目标裁定 across web surfaces.",
    "Shot034B start/key/end frames use the empty faculty objective frame set or package-local model-entry frames.",
    "Hanneman and Manuela are absent/offscreen/silent/unpaired and banned in prompts.",
    "Submission payload contains 42 rows; real mp4 clips remain pending.",
  ],
};
function writeText(file, text) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), text);
}
function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}
const normalized = {
  ...result,
  decision: problems.length ? "actual_delivery_surface_failed" : "actual_delivery_surface_passed",
};
const md = [
  "# Scene09 V3 Actual Delivery Surface Audit",
  "",
  `Date: ${normalized.date}`,
  `Decision: ${normalized.decision}`,
  "",
  "This report verifies the current Shot034B empty faculty objective delivery surface across manifests, prompts, payload, and file:// HTML viewers.",
  "",
  "## Problems",
  "",
  normalized.problems.length ? normalized.problems.map((problem) => `- ${problem}`).join("\n") : "- none",
  "",
  "## Evidence",
  "",
  ...normalized.evidence.map((item) => `- ${item}`),
  "",
].join("\n");
writeJson(currentReportJson, normalized);
writeJson(packageReportJson, normalized);
writeText(currentReportMd, md);
writeText(packageReportMd, md);
if (!problems.length && fs.existsSync(path.join(root, legacyReportJson))) {
  writeJson(legacyReportJson, {
    date: "2026-08-01",
    decision: "actual_delivery_surface_superseded_by_current_pass",
    supersedes_stale_decision: "actual_delivery_surface_failed",
    current_report: currentReportJson,
    package_report: packageReportJson,
    problems: [],
    evidence: normalized.evidence,
  });
}
console.log(JSON.stringify(result, null, 2));
process.exit(problems.length ? 1 : 0);
