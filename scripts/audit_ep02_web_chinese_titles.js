#!/usr/bin/env node
const fs = require("fs");
const vm = require("vm");

const dataPath = "site/ep02_storyboard_data.js";
const code = fs.readFileSync(dataPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(code, sandbox, { filename: dataPath });

const data = sandbox.window.EP02_STORYBOARD_DATA || { shots: [] };
const problems = [];

for (const shot of data.shots || []) {
  const title = shot.titleZh || shot.title || "";
  if (!title) {
    problems.push(`${shot.shot}: missing Chinese title`);
  } else if (/^Shot\d+[A-Z]?$/.test(title)) {
    problems.push(`${shot.shot}: title is still a shot-id placeholder`);
  } else if (/[A-Za-z]{3,}/.test(title)) {
    problems.push(`${shot.shot}: title contains English text: ${title}`);
  }
  if (shot.scriptSceneTitle && /^Scene\s+\d+/i.test(shot.scriptSceneTitle)) {
    problems.push(`${shot.shot}: script scene title still uses English Scene prefix: ${shot.scriptSceneTitle}`);
  }
  if (shot.scriptSceneTitle && /^第\d+场\s+-\s+/.test(shot.scriptSceneTitle)) {
    problems.push(`${shot.shot}: script scene title should use Chinese colon: ${shot.scriptSceneTitle}`);
  }
  for (const frame of shot.frameSet || []) {
    if (["Start Frame", "Key Frame", "End Frame", "start", "key", "end"].includes(String(frame.label || ""))) {
      problems.push(`${shot.shot}: frame label is not localized: ${frame.label}`);
    }
  }
}

const shot034B = (data.shots || []).find((shot) => shot.shot === "Shot034B");
if (!shot034B) {
  problems.push("Shot034B: missing from EP02 web data");
} else {
  if (shot034B.titleZh !== "空教师目标裁定") {
    problems.push(`Shot034B: expected 空教师目标裁定, got ${shot034B.titleZh || shot034B.title || "(empty)"}`);
  }
  const displayImagePath = String(shot034B.displayImagePath || "");
  const emptyObjectiveContract = [
    displayImagePath.includes("34D_Shot034B_empty_objective_key.png") ||
      displayImagePath.includes("delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/key_frame.png"),
    String(shot034B.visual || "").includes("两个教师目标点保持空置") ||
      String(shot034B.riskNotes || "").includes("faculty objective markers empty"),
    Array.isArray(shot034B.visibleNamedOnly) &&
      shot034B.visibleNamedOnly.join(",") === "Byleth,Dimitri",
  ].every(Boolean);
  if (!emptyObjectiveContract) {
    problems.push(`Shot034B: expected empty-objective current frame contract, got ${displayImagePath || "(empty)"}`);
  }
}

const scene09 = (data.shots || []).filter((shot) => shot.act === "mock_battle");
const result = {
  decision: problems.length ? "failed" : "passed",
  dataPath,
  totalShots: (data.shots || []).length,
  mockBattleShots: scene09.length,
  problems,
};

console.log(JSON.stringify(result, null, 2));
if (problems.length) process.exit(1);
