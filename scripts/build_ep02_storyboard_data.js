const fs = require("fs");

const queuePath = "episodes/EP02/video_generation_queue_cinematic_v2_2026-07-16.json";
const payloadPath = "episodes/EP02/video_payloads_cinematic_v2_expanded_2026-07-16.json";
const supplementalPath = "episodes/EP02/mock_battle_expanded_storyboard_2026-07-16.json";
const shotListPath = "episodes/EP02/shot_list.md";
const matrixPath = "episodes/EP02/shot_asset_matrix.md";
const scriptPath = "episodes/EP02/script.md";
const keyframePlanPath = "episodes/EP02/keyframe_plan_2026-07-15.json";
const productionKeyframeQueuePath = "episodes/EP02/mock_battle_keyframe_production_queue_2026-07-17.json";
const productionKeyframeQaPath = "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/qa_manifest.json";
const outputPath = "site/ep02_storyboard_data.js";

function parseMarkdownTable(path) {
  const rows = [];
  for (const line of fs.readFileSync(path, "utf8").split("\n")) {
    if (!line.startsWith("| Shot")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (/^Shot\d+/.test(cells[0])) rows.push(cells);
  }
  return rows;
}

function parseShotList() {
  const shotMeta = new Map();
  for (const cells of parseMarkdownTable(shotListPath)) {
    if (cells.length < 7) continue;
    shotMeta.set(cells[0], {
      durationZh: cells[1],
      scene: cells[2],
      purposeZh: cells[3],
      visual: cells[4],
      cameraZh: cells[5],
      dialogue: cells[6],
    });
  }
  return shotMeta;
}

function parseMatrix() {
  const matrix = new Map();
  for (const cells of parseMarkdownTable(matrixPath)) {
    if (cells.length < 6) continue;
    matrix.set(cells[0], {
      sourceRef: cells[1],
      priority: cells[2],
      locationAsset: cells[3],
      characters: cells[4],
      outputNeeded: cells[5],
    });
  }
  return matrix;
}

function parseScriptScenes() {
  const text = fs.readFileSync(scriptPath, "utf8");
  const sceneBlocks = [];
  const matches = [...text.matchAll(/^### Scene (\d+) - (.+)$/gm)];
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const next = matches[i + 1];
    const start = match.index + match[0].length;
    const end = next ? next.index : text.length;
    const body = text.slice(start, end).trim();
    sceneBlocks.push({
      number: Number(match[1]),
      title: `Scene ${match[1]} - ${match[2].trim()}`,
      body,
      excerpt: body.split("\n").filter(Boolean).slice(0, 9).join("\n"),
    });
  }
  return sceneBlocks;
}

function sceneNumberForShot(number) {
  if (number <= 2) return 1;
  if (number <= 4) return 2;
  if (number <= 8) return 3;
  if (number <= 10) return 4;
  if (number <= 16) return 5;
  if (number <= 19) return 6;
  if (number <= 21) return 7;
  if (number <= 24) return 8;
  if (number <= 36) return 9;
  if (number <= 37) return 10;
  if (number <= 39) return 11;
  return 12;
}

function actOf(number) {
  if (number <= 4) return "arrival";
  if (number <= 10) return "church";
  if (number <= 16) return "houses";
  if (number <= 19) return "choice";
  if (number <= 24) return "classroom";
  if (number <= 36) return "mock_battle";
  if (number <= 39) return "epilogue";
  return "ending";
}

function parseShotId(shot) {
  const match = String(shot).match(/^Shot(\d+)([A-Z])?$/);
  if (!match) return { baseNumber: 0, suffix: "", order: 0 };
  const baseNumber = Number(match[1]);
  const suffix = match[2] || "";
  const suffixOrder = suffix ? (suffix.charCodeAt(0) - 64) / 10 : 0;
  return {
    baseNumber,
    suffix,
    order: baseNumber + suffixOrder,
  };
}

const baseQueue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const supplementalQueue = fs.existsSync(supplementalPath)
  ? JSON.parse(fs.readFileSync(supplementalPath, "utf8"))
  : [];
const queue = [...baseQueue, ...supplementalQueue].sort((a, b) => {
  const aId = parseShotId(a.shot);
  const bId = parseShotId(b.shot);
  return aId.order - bId.order || String(a.shot).localeCompare(String(b.shot));
});
const payloads = JSON.parse(fs.readFileSync(payloadPath, "utf8"));
const payloadMap = new Map(payloads.map((item) => [item.shot, item]));
const keyframePlan = fs.existsSync(keyframePlanPath)
  ? JSON.parse(fs.readFileSync(keyframePlanPath, "utf8"))
  : { frames: [] };
const keyframeMap = new Map((keyframePlan.frames || []).map((item) => [item.shot, item]));
const productionKeyframeQueue = fs.existsSync(productionKeyframeQueuePath)
  ? JSON.parse(fs.readFileSync(productionKeyframeQueuePath, "utf8"))
  : [];
const productionKeyframeQa = fs.existsSync(productionKeyframeQaPath)
  ? JSON.parse(fs.readFileSync(productionKeyframeQaPath, "utf8")).shots || {}
  : {};
const productionKeyframeMap = new Map(productionKeyframeQueue.map((item) => [item.shot, item]));
const shotMeta = parseShotList();
const matrix = parseMatrix();
const scriptScenes = parseScriptScenes();
const scriptSceneMap = new Map(scriptScenes.map((scene) => [scene.number, scene]));

const shots = queue.map((item) => {
  const { baseNumber, order, suffix } = parseShotId(item.shot);
  const number = baseNumber;
  const scriptScene = scriptSceneMap.get(sceneNumberForShot(number));
  const meta = shotMeta.get(item.shot) || {};
  const payload = payloadMap.get(item.shot) || {};
  const keyframes = keyframeMap.get(item.shot) || {};
  const productionKeyframe = productionKeyframeMap.get(item.shot) || {};
  const productionQa = productionKeyframeQa[item.shot] || {};
  const productionOutput = productionKeyframe.output_keyframe || "";
  const productionStartOutput = productionKeyframe.output_start_frame || "";
  const productionExists = productionOutput ? fs.existsSync(productionOutput) : false;
  const productionStartExists = productionStartOutput ? fs.existsSync(productionStartOutput) : false;
  const displayedStill = productionExists ? productionOutput : (item.still || "");
  const displayedStillStatus = productionExists
    ? (productionQa.status || productionKeyframe.status || "production_draft")
    : (item.still ? "legacy_source" : "missing");
  const displayedStillSource = productionExists ? "production_keyframe" : "legacy_or_layout_source";
  const keyFramePath = productionExists ? productionOutput : (keyframes.keyFrame || (suffix ? item.still : ""));
  const productionFrameIntent = productionExists
    ? (productionKeyframe.purpose || productionKeyframe.title || item.title || "")
    : "";
  const productionFramePrompt = productionExists
    ? (productionKeyframe.production_prompt || "")
    : "";
  const subframes = (productionKeyframe.subframes || []).map((subframe) => {
    const outputKeyframe = subframe.output_keyframe || "";
    const outputExists = outputKeyframe ? fs.existsSync(outputKeyframe) : false;
    return {
      ...subframe,
      output_keyframe: outputExists ? outputKeyframe : "",
      planned_output_keyframe: outputExists ? "" : (outputKeyframe ? outputKeyframe.split("/").pop() : ""),
      output_status: outputExists ? "ready" : "planned",
    };
  });
  const frameSet = [
    {
      role: "start",
      label: "起始帧",
      path: productionStartExists ? productionStartOutput : (keyframes.startFrame || item.still || ""),
      status: productionStartExists ? (productionQa.status || productionKeyframe.status || "production_draft") : (keyframes.startFrame || item.still ? "ready" : "missing"),
      intent: productionStartExists ? "production start frame: 镜头进入时的构图与空间关系，必须与关键帧保持同一动作链路" : "镜头进入时的构图与空间关系",
    },
    {
      role: "key",
      label: "关键帧",
      path: keyFramePath,
      status: productionExists ? displayedStillStatus : (keyframes.keyFrameStatus || (keyFramePath ? "ready" : "planned")),
      intent: productionExists ? productionFrameIntent : (keyframes.keyFrameIntent || (suffix ? item.outputNeeded || item.title || "" : "")),
      prompt: productionExists ? (productionFramePrompt || keyframes.keyFramePrompt || item.video_prompt || "") : (keyframes.keyFramePrompt || (suffix ? item.video_prompt || "" : "")),
    },
    {
      role: "end",
      label: "结束帧",
      path: keyframes.endFrame || "",
      status: keyframes.endFrame ? "ready" : "optional",
      intent: "复杂镜头可补，用于锁定出镜状态和剪辑接点",
    },
  ];
  return {
    shot: item.shot,
    number,
    order,
    title: item.title,
    act: actOf(number),
    duration: item.duration,
    durationSeconds: item.duration_seconds || "",
    status: item.status,
    still: item.still || "",
    displayImagePath: displayedStill,
    displayImageStatus: displayedStillStatus,
    displayImageSource: displayedStillSource,
    productionQaStatus: productionQa.status || "",
    productionQaChecks: productionQa.checks || [],
    productionQaIssues: productionQa.issues || [],
    frameSet,
    productionStatus: productionKeyframe.status || "",
    productionPriority: productionKeyframe.priority || "",
    productionKeyframePath: productionKeyframe.output_keyframe || "",
    productionStartFramePath: productionKeyframe.output_start_frame || "",
    productionFrameIntent,
    productionFramePrompt,
    startKeyAssociation: productionQa.start_key_association || "",
    characterReferenceAssets: productionKeyframe.character_reference_assets || [],
    subframes,
    keyFrameIntent: keyframes.keyFrameIntent || (suffix ? item.outputNeeded || item.title || "" : ""),
    keyFramePrompt: keyframes.keyFramePrompt || (suffix ? item.video_prompt || "" : ""),
    sourcePackage: item.source_package,
    outputPath: payload.output_path || item.output_path || "",
    payloadProductionStatus: payload.production_status || "",
    payloadProductionImagePath: payload.production_image_path || "",
    payloadBlockedSourceImagePath: payload.blocked_source_image_path || "",
    payloadProductionPromptFile: payload.production_prompt_file || "",
    cinematicBlock: item.cinematic_block || payload.cinematic_block || "",
    transitionIn: item.transition_in || payload.transition_in || "",
    transitionOut: item.transition_out || payload.transition_out || "",
    screenDirectionRule: item.screen_direction_rule || "",
    audioBridge: item.audio_bridge || "",
    editorialHandlesSeconds: item.editorial_handles_seconds || payload.editorial_handles_seconds || "",
    riskNotes: Array.isArray(item.risk_notes) ? item.risk_notes.join("; ") : (item.risk_notes || ""),
    videoPrompt: item.video_prompt,
    generationPrompt: payload.prompt || "",
    negativePrompt: payload.negative_prompt || "",
    camera: item.camera,
    avoid: item.avoid,
    scriptSceneTitle: scriptScene ? scriptScene.title : "",
    scriptSceneBody: scriptScene ? scriptScene.body : "",
    scriptSceneExcerpt: scriptScene ? scriptScene.excerpt : "",
    shotDialogue: meta.dialogue || "",
    ...meta,
    ...matrix.get(item.shot),
  };
});

const payload = {
  updated: "2026-07-16",
  productionMode: "cinematic_v2_expanded",
  timeline: "episodes/EP02/edit_timeline_cinematic_v2_expanded_2026-07-16.md",
  continuityBrief: "episodes/EP02/cinematic_continuity_pass_2026-07-16.md",
  runbook: "episodes/EP02/video_production_runbook_cinematic_v2_expanded_2026-07-16.md",
  mockBattleExpandedPlan: supplementalPath,
  mockBattleProductionKeyframes: productionKeyframeQueuePath,
  mockBattleSubframePlan: "episodes/EP02/mock_battle_subframe_plan_2026-07-17.md",
  mockBattleFullPromptDelivery: "episodes/EP02/scene09_full_frame_and_video_prompts_2026-07-19.md",
  mockBattleFullRebuildScope: "episodes/EP02/scene09_full_rebuild_scope_2026-07-20.md",
  mockBattleAuditSynthesis: "episodes/EP02/scene09_audit_synthesis_2026-07-20.md",
  mockBattleSecondaryVisualQa: "episodes/EP02/scene09_secondary_visual_qa_2026-07-19.md",
  mockBattleCreativeLogicAudit: "episodes/EP02/scene09_creative_logic_audit_2026-07-20.md",
  mockBattleDirectionContinuity: "episodes/EP02/scene09_direction_continuity_pass_2026-07-19.md",
  mockBattleWeaponFacingAudit: "episodes/EP02/scene09_weapon_and_facing_audit_2026-07-19.md",
  mockBattleManualImageReview: "episodes/EP02/scene09_manual_image_review_2026-07-19.md",
  mockBattlePreVideoDeepAudit: "episodes/EP02/scene09_pre_video_deep_audit_2026-07-19.md",
  mockBattleCharacterOutcomeExitPlan: "episodes/EP02/scene09_character_outcome_exit_plan_2026-07-19.md",
  mockBattleVideoPreflight: "episodes/EP02/scene09_video_preflight_package_2026-07-19.md",
  mockBattleAnimaticTiming: "episodes/EP02/scene09_animatic_timing_plan_2026-07-19.md",
  mockBattleVideoFailureCriteria: "episodes/EP02/scene09_video_failure_criteria_2026-07-19.md",
  mockBattleDialoguePerformance: "episodes/EP02/scene09_dialogue_performance_pass_2026-07-19.md",
  mockBattleBackgroundMaster: "assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png",
  mockBattleP0ReferenceBoards: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/reference_boards/index.html",
  reviewHtml: "episodes/EP02/generated/full_episode_storyboard_2026-07-14/review.html",
  fullContactSheet: "episodes/EP02/generated/full_episode_storyboard_2026-07-14/00_full_episode_ordered.png",
  blockContactSheets: [
    ["到达与教会", "episodes/EP02/generated/full_episode_storyboard_2026-07-14/01_arrival_church.png"],
    ["学级与选择", "episodes/EP02/generated/full_episode_storyboard_2026-07-14/02_houses_choice.png"],
    ["警告与课堂", "episodes/EP02/generated/full_episode_storyboard_2026-07-14/03_warning_class.png"],
    ["模拟战 Canon Map", "episodes/EP02/generated/mock_battle_canon_map_2026-07-17/contact_sheet_mock_battle_canon_map_2026-07-17.svg"],
    ["结尾", "episodes/EP02/generated/full_episode_storyboard_2026-07-14/05_ending.png"],
  ],
  shots,
};

fs.writeFileSync(outputPath, `window.EP02_STORYBOARD_DATA = ${JSON.stringify(payload, null, 2)};\n`);
console.log(`wrote ${outputPath} (${shots.length} shots)`);
