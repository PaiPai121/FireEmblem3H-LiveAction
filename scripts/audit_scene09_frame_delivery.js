const fs = require("fs");

const queuePath = "episodes/EP02/mock_battle_keyframe_production_queue_2026-07-17.json";
const qaPath = "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/qa_manifest.json";
const deliveryPath = "episodes/EP02/scene09_full_frame_and_video_prompts_2026-07-19.json";
const reportJsonPath = "episodes/EP02/scene09_frame_delivery_audit_2026-07-19.json";
const reportMdPath = "episodes/EP02/scene09_frame_delivery_audit_2026-07-19.md";

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const qa = JSON.parse(fs.readFileSync(qaPath, "utf8"));
const delivery = JSON.parse(fs.readFileSync(deliveryPath, "utf8"));
const deliveryMap = new Map(delivery.shots.map((shot) => [shot.shot, shot]));

function exists(pathValue) {
  return Boolean(pathValue) && fs.existsSync(pathValue);
}

function isGeneratedProductionPath(pathValue) {
  return Boolean(pathValue)
    && pathValue.includes("mock_battle_production_keyframes_2026-07-17/")
    && !pathValue.includes("/candidates_")
    && !pathValue.includes("/delivery_prompts/")
    && !pathValue.endsWith(".svg");
}

function shotOrder(shot) {
  const match = String(shot).match(/^Shot(\d+)([A-Z])?$/);
  if (!match) return 999;
  return Number(match[1]) + (match[2] ? (match[2].charCodeAt(0) - 64) / 10 : 0);
}

const sceneShots = queue
  .filter((entry) => /^Shot(02[5-9]|03[0-6])/.test(entry.shot))
  .sort((a, b) => shotOrder(a.shot) - shotOrder(b.shot));

const rows = sceneShots.map((entry) => {
  const qaShot = qa.shots?.[entry.shot] || {};
  const deliveryShot = deliveryMap.get(entry.shot) || {};
  const startPath = entry.output_start_frame || "";
  const keyPath = entry.output_keyframe || "";
  const checks = {
    startExists: exists(startPath),
    keyExists: exists(keyPath),
    startIsProductionRaster: exists(startPath) && isGeneratedProductionPath(startPath),
    keyIsProductionRaster: exists(keyPath) && isGeneratedProductionPath(keyPath),
    qaPassed: qaShot.status === "qa_passed",
    startQaAssetMatches: !qaShot.start_asset || qaShot.start_asset === startPath,
    keyQaAssetMatches: !qaShot.asset || qaShot.asset === keyPath,
    startKeyAssociationRecorded: Boolean(qaShot.start_key_association),
    startPromptExists: exists(deliveryShot.start_frame_prompt_path),
    keyPromptExists: exists(deliveryShot.keyframe_prompt_path),
    videoPromptExists: exists(deliveryShot.video_prompt_path),
  };
  const complete = Object.values(checks).every(Boolean);
  return {
    shot: entry.shot,
    title: entry.title,
    complete,
    status: complete ? "complete_qa_passed" : "incomplete",
    startPath,
    keyPath,
    checks,
    missing: Object.entries(checks).filter(([, value]) => !value).map(([key]) => key),
  };
});

const summary = {
  version: "2026-07-19",
  policy: "A Scene09 shot is complete only when start frame and keyframe are newly generated production rasters, QA passed, and start-key association is recorded.",
  total: rows.length,
  complete: rows.filter((row) => row.complete).length,
  incomplete: rows.filter((row) => !row.complete).length,
};

fs.writeFileSync(reportJsonPath, JSON.stringify({ summary, rows }, null, 2) + "\n");

const mdRows = rows.map((row) => {
  return `| ${row.shot} | ${row.title} | ${row.status} | ${row.missing.join(", ") || "none"} |`;
}).join("\n");

const md = `# EP02 Scene09 Frame Delivery Audit

Date: 2026-07-19

Policy: A shot is complete only when both start frame and keyframe are newly generated production rasters, QA passed, and start-key association is recorded.

Summary: ${summary.complete}/${summary.total} complete, ${summary.incomplete} incomplete.

| Shot | Title | Status | Missing gates |
| --- | --- | --- | --- |
${mdRows}
`;

fs.writeFileSync(reportMdPath, md);

console.log(JSON.stringify(summary, null, 2));
console.log(reportJsonPath);
console.log(reportMdPath);
