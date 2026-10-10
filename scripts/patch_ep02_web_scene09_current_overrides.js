#!/usr/bin/env node
const fs = require("fs");
const vm = require("vm");

const dataPath = "site/ep02_storyboard_data.js";
const packageManifestPath = "delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json";

const code = fs.readFileSync(dataPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(code, sandbox, { filename: dataPath });
const data = sandbox.window.EP02_STORYBOARD_DATA;
if (!data || !Array.isArray(data.shots)) throw new Error(`${dataPath} did not expose EP02_STORYBOARD_DATA.shots`);

const packageManifest = JSON.parse(fs.readFileSync(packageManifestPath, "utf8"));
const packageShots = new Map((packageManifest.shots || []).map((shot) => [shot.shot, shot]));

const overrideShots = new Set(["Shot025", "Shot029C", "Shot030B", "Shot032", "Shot034B"]);
const chineseTitles = {
  Shot025: "规则与目标确立",
  Shot029C: "库罗德读出两个缺口",
  Shot030B: "路线触发特写",
  Shot032: "杜笃与梅尔塞德斯重建盾线",
  Shot034B: "空教师目标裁定",
};
const changed = [];

for (const shot of data.shots) {
  if (!overrideShots.has(shot.shot)) continue;
  const pkg = packageShots.get(shot.shot);
  if (!pkg) throw new Error(`missing package shot for ${shot.shot}`);

  const packageLocalBase = `delivery/scene09_v3_monitor_handoff_package_2026-07-27/${pkg.package_dir}`;
  const start = `${packageLocalBase}/start_frame.png`;
  const key = `${packageLocalBase}/key_frame.png`;
  const end = `${packageLocalBase}/end_frame.png`;
  const frames = pkg.frames || pkg.source_frames || {};
  const sourceStart = frames.start || frames.start_frame || pkg.start_frame || "";
  const sourceKey = frames.key || frames.key_frame || pkg.key_frame || "";
  const sourceEnd = frames.end || frames.end_frame || pkg.end_frame || "";
  const frameSet = [
    {
      role: "start",
      label: "起始帧",
      path: start,
      status: "scene09_current_override",
      intent: pkg.primary_continuity_check || pkg.primary_check || "",
      prompt: pkg.video_prompt || pkg.motion || "",
    },
    {
      role: "key",
      label: "关键帧",
      path: key,
      status: "scene09_current_override",
      intent: pkg.primary_check || pkg.primary_continuity_check || "",
      prompt: pkg.video_prompt || pkg.motion || "",
    },
    {
      role: "end",
      label: "结束帧",
      path: end,
      status: "scene09_current_override",
      intent: pkg.primary_continuity_check || pkg.primary_check || "",
      prompt: pkg.video_prompt || pkg.motion || "",
    },
  ];

  const title = chineseTitles[shot.shot] || pkg.titleZh || pkg.title || shot.title;
  shot.title = title;
  shot.titleZh = title;
  shot.displayImagePath = key;
  shot.displayImageStatus = "scene09_current_override";
  shot.displayImageSource = "scene09_current_package_override";
  shot.frameSet = frameSet;
  shot.productionKeyframePath = key;
  shot.productionStartFramePath = start;
  shot.productionFrameIntent = pkg.primary_check || pkg.primary_continuity_check || shot.productionFrameIntent || "";
  shot.productionFramePrompt = pkg.video_prompt || pkg.motion || shot.productionFramePrompt || "";
  shot.payloadProductionImagePath = start;
  shot.visibleNamedOnly = pkg.visible_named_only || shot.visibleNamedOnly || [];
  shot.currentCharacters = (pkg.visible_named_only || []).map((name) => ({ name }));
  shot.currentRejectIf = pkg.reject_if || shot.currentRejectIf || [];
  shot.negativePrompt = pkg.negative_prompt || shot.negativePrompt || "";
  shot.generationPrompt = pkg.video_prompt || pkg.motion || shot.generationPrompt || "";
  shot.audioBridge = pkg.dialogue_audio || pkg.audio_anchor || shot.audioBridge || "";
  shot.sourceFrameSet = {
    start: sourceStart,
    key: sourceKey,
    end: sourceEnd,
  };
  changed.push(shot.shot);
}

fs.writeFileSync(dataPath, `window.EP02_STORYBOARD_DATA = ${JSON.stringify(data, null, 2)};\n`);
console.log(JSON.stringify({
  decision: "patched",
  dataPath,
  changed,
}, null, 2));
