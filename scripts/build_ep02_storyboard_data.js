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
const localVisualReviewPath = "production_system/reviews/scene09_v3_local_visual_review_2026-08-07/scene09_six_shot_local_visual_review_2026-08-07.json";
const fullLocalVisualReviewPath = "production_system/reviews/scene09_v3_full_local_visual_review_2026-08-08/scene09_full_local_visual_review_2026-08-08.json";
const fullLocalVisualReviewMdPath = "production_system/reviews/scene09_v3_full_local_visual_review_2026-08-08/scene09_full_local_visual_review_2026-08-08.md";
const rosterContinuityPath = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/roster_continuity_by_shot.json";
const battleLedgerPath = "delivery/scene09_v3_monitor_handoff_package_2026-07-27/battle_ledger_timeline.json";
const operatorNextStepsJsonPath = "delivery/scene09_v3_monitor_handoff_package_2026-07-27/OPERATOR_NEXT_STEPS.json";
const handoffControlReportsAuditPath = "delivery/scene09_v3_monitor_handoff_package_2026-07-27/handoff_control_reports_audit.json";
const motionProbeProviderBundlesManifestPath = "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_provider_bundles/motion_probe_provider_bundles_manifest.json";
const handoffPackageManifestPath = "delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json";
const handoffPackageRoot = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const rebuildV2QueuePath = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json";
const deliveryManifestPath = "production_system/video_delivery_manifest.json";
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
      title: scriptSceneTitleFor(match[1], match[2].trim()),
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

const ep02ChineseTitles = {
  Shot001: "通往加尔古玛库的山道",
  Shot002: "杰拉尔特与贝雷特同行",
  Shot003: "正门广场抵达",
  Shot004: "帝弥托利第一次点头致意",
  Shot005: "蕾雅权威登场",
  Shot006: "旧识重逢",
  Shot007: "赛罗司教会的邀请",
  Shot008: "贝雷特接受教师任命",
  Shot009: "主回廊日常",
  Shot010: "教师介绍",
  Shot011: "黑鹫对照",
  Shot012: "金鹿对照",
  Shot013: "青狮全员亮相",
  Shot014: "帝弥托利郑重问候",
  Shot015: "菲力克斯与希尔凡交锋",
  Shot016: "青狮反应蒙太奇",
  Shot017: "学级选择仪式",
  Shot018: "选择青狮",
  Shot019: "帝弥托利接受新教师",
  Shot020: "杰拉尔特私下警告",
  Shot021: "佣兵徽章插入",
  Shot022: "第一次面对全班",
  Shot023: "训练剑落桌",
  Shot024: "菲力克斯起身",
  Shot025: "规则与三方目标确立",
  Shot025A: "战场地形插入",
  Shot026: "贝雷特分配职责",
  Shot026B: "青狮观察战场",
  Shot026C: "第一轮推进",
  Shot027: "亚修架设掩护线",
  Shot027B: "黑鹫第一波压出",
  Shot027C: "首次接敌",
  Shot027D: "菲力克斯延迟侧切",
  Shot028: "支援线保持纪律",
  Shot028B: "黑鹫稳住中央",
  Shot028C: "菲力克斯看见后续路线",
  Shot029: "青狮西侧轮转",
  Shot029B: "金鹿全面施压",
  Shot029C: "库罗德读出两个缺口",
  Shot029D: "库罗德逼退亚修",
  Shot030: "菲力克斯过度前压的诱惑",
  Shot030B: "路线触发特写",
  Shot030C: "伊古纳兹与金鹿切断路线",
  Shot031: "贝雷特叫停菲力克斯",
  Shot031B: "贝雷特双线指挥",
  Shot032: "杜笃受伤，梅尔塞德斯治疗重建盾线",
  Shot032A: "雅妮特扬尘掩护",
  Shot032B: "青狮守住平台下方",
  Shot032C: "黑鹫反击金鹿",
  Shot032D: "三线战场关系证明",
  Shot032E: "贝雷特利用混战空隙",
  Shot032F: "菲力克斯与亚修判定休伯特出局",
  Shot032G: "库罗德与雷欧妮牵制多洛缇雅和贝尔娜提塔",
  Shot033: "帝弥托利在平台前克制收势",
  Shot033B: "贝雷特下令切向教师目标",
  Shot033C: "亚修压制汉尼曼路线",
  Shot033D: "英谷莉特切断玛努艾拉路线",
  Shot034: "全场胜负关系落定",
  Shot034B: "空教师目标裁定",
  Shot034C: "菲力克斯挡下斐迪南",
  Shot034D: "贝雷特中断教师目标反扑",
  Shot034E: "金鹿高光后收势",
  Shot034F: "黑鹫高光后收势",
  Shot034G: "青狮核心险胜收势",
  Shot035: "菲力克斯的敬意",
  Shot036: "帝弥托利战后余韵",
  Shot037: "蕾雅与西提司观战",
  Shot038: "苏谛斯意识闪回",
  Shot039: "空荡夜廊回声",
  Shot040: "科斯塔斯跪地",
  Shot041: "炎帝面具特写",
  Shot042: "硬切黑场",
};

function chineseTitleForShot(shot) {
  return ep02ChineseTitles[shot] || "";
}

function motionProbeZipBatchesFromManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const packageRoot = manifestPath.split("/").slice(0, -2).join("/");
  return (manifest.bundles || []).map((bundle, index) => {
    const customIds = bundle.custom_ids || [];
    const first = customIds[0] || "";
    const last = customIds[customIds.length - 1] || "";
    const firstShot = first.match(/_(Shot[^_]+)_probe$/)?.[1] || "";
    const lastShot = last.match(/_(Shot[^_]+)_probe$/)?.[1] || "";
    return {
      index: index + 1,
      batch_id: bundle.batch_id || `probe_batch_${String(index + 1).padStart(3, "0")}`,
      zip: bundle.zip ? `${packageRoot}/${bundle.zip}` : "",
      directory: bundle.directory ? `${packageRoot}/${bundle.directory}` : "",
      rows: Number(bundle.rows || customIds.length || 0),
      files: Number(bundle.files || 0),
      bytes: Number(bundle.zip_digest?.bytes || 0),
      sha256: bundle.zip_digest?.sha256 || "",
      first_custom_id: first,
      last_custom_id: last,
      shot_range: firstShot && lastShot ? `${firstShot}-${lastShot}` : "",
    };
  });
}

function motionProbeReturnBatchesFromZipBatches(zipBatches) {
  return zipBatches.map((batch) => {
    const returnDir = `delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_return_intake/${batch.batch_id}_returns/returned_mp4`;
    const returnedFiles = fs.existsSync(returnDir)
      ? fs.readdirSync(returnDir).filter((file) => file.toLowerCase().endsWith(".mp4")).sort()
      : [];
    return {
      index: batch.index,
      batch_id: batch.batch_id,
      shot_range: batch.shot_range,
      expected_probe_clips: batch.rows,
      return_dir: returnDir,
      returned_mp4_count: returnedFiles.length,
      dry_run_command: `node scripts/ingest_scene09_v3_motion_probe_clips.js --input ${returnDir} --dry-run`,
      apply_command: `node scripts/ingest_scene09_v3_motion_probe_clips.js --input ${returnDir} --apply`,
    };
  });
}

const shot034BEmptyObjectiveFrameBase = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-25";
const shot034BEmptyObjectiveFrameSet = [
  {
    role: "start",
    label: "起始帧",
    path: `${shot034BEmptyObjectiveFrameBase}/34D_Shot034B_empty_objective_start.png`,
    status: "rebuild_v2_current",
    intent: "贝雷特与帝弥托利接近两个空教师目标标记；汉尼曼和玛努艾拉不出镜、不同框、不发声。",
    prompt: "Shot034B START: Byleth and Dimitri approach two separate faculty route markers; no teachers or extras.",
  },
  {
    role: "key",
    label: "关键帧",
    path: `${shot034BEmptyObjectiveFrameBase}/34D_Shot034B_empty_objective_key.png`,
    status: "rebuild_v2_current",
    intent: "贝雷特做出非致命裁定手势，帝弥托利放低木制训练枪；两个教师目标点保持空置。",
    prompt: "Shot034B KEY: Byleth gives a nonlethal ruling gesture while Dimitri lowers his blunt wooden training lance; markers remain empty.",
  },
  {
    role: "end",
    label: "结束帧",
    path: `${shot034BEmptyObjectiveFrameBase}/34D_Shot034B_empty_objective_end.png`,
    status: "rebuild_v2_current",
    intent: "空目标裁定结束，贝雷特与帝弥托利收势；教师仍缺席、离画、静默。",
    prompt: "Shot034B END: Byleth and Dimitri settle after the empty-objective ruling; Hanneman and Manuela absent/offscreen/silent.",
  },
];

function shot034BWebOverride() {
  const keyFrame = shot034BEmptyObjectiveFrameSet.find((frame) => frame.role === "key");
  const startFrame = shot034BEmptyObjectiveFrameSet.find((frame) => frame.role === "start");
  const negative = [
    "Reject if Hanneman appears.",
    "Reject if Manuela appears.",
    "Reject if any teacher stands beside another teacher.",
    "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
  ];
  return {
    title: "空教师目标裁定",
    titleZh: "空教师目标裁定",
    displayImagePath: keyFrame.path,
    displayImageStatus: "rebuild_v2_current",
    displayImageSource: "scene09_rebuild_v2_empty_objective_web_override",
    frameSet: shot034BEmptyObjectiveFrameSet,
    productionStatus: "scene09_rebuild_v2_empty_objective_current",
    productionPriority: "scene09_rebuild_v2_empty_objective",
    productionKeyframePath: keyFrame.path,
    productionStartFramePath: startFrame.path,
    productionFrameIntent: keyFrame.intent,
    productionFramePrompt: keyFrame.prompt,
    keyFrameIntent: keyFrame.intent,
    keyFramePrompt: keyFrame.prompt,
    payloadProductionImagePath: startFrame.path,
    payloadBlockedSourceImagePath: "",
    payloadProductionStatus: "scene09_rebuild_v2_empty_objective_current",
    purposeZh: "青狮不是击倒老师，而是在混战后占住空置目标点，由贝雷特裁定险胜。",
    visual: keyFrame.intent,
    characters: "Byleth, Dimitri",
    visibleNamedOnly: ["Byleth", "Dimitri"],
    currentCharacters: [{ name: "Byleth" }, { name: "Dimitri" }],
    audioBridge: "Whistle tail, Byleth quiet rule confirmation, Dimitri tired breath. Hanneman and Manuela remain offscreen and silent.",
    screenDirectionRule: "Byleth and Dimitri face the empty objective markers, not the camera; no teacher lane crossing.",
    generationPrompt: "Shot034B: Byleth and Dimitri resolve two separate faculty route markers after the three-house melee. Keep the frame student-only: Byleth and Dimitri readable; Hanneman and Manuela absent, offscreen, silent, and never paired.",
    negativePrompt: negative.join("\n"),
    currentRejectIf: negative,
    outputNeeded: "Scene09 rebuild v2 empty-objective start/key/end frames and model-ready prompt",
  };
}

function shot032HealingHomageWebOverride() {
  const contract = "杜笃始终面向来敌，梅尔塞德斯在后左支援；治疗光不会变成攻击光束。";
  return {
    title: "杜笃受伤，梅尔塞德斯治疗重建盾线",
    titleZh: "杜笃受伤，梅尔塞德斯治疗重建盾线",
    visual: "杜笃被压到低姿防御但仍面向来敌，梅尔塞德斯在他后左侧以短促白色治疗光稳定伤势，盾线重新合拢。",
    screenDirectionRule: contract,
    riskNotes: contract,
  };
}

const scriptSceneChineseTitles = {
  "01": "第01场：通往修道院的山道",
  "02": "第02场：正门广场",
  "03": "第03场：大圣堂前厅",
  "04": "第04场：教师与修道院",
  "05": "第05场：三学级公共庭院",
  "06": "第06场：选择青狮",
  "07": "第07场：杰拉尔特的警告",
  "08": "第08场：第一次上课",
  "09": "第09场：学级模拟战",
  "10": "第10场：蕾雅的注视",
  "11": "第11场：苏谛斯",
  "12": "第12场：反派伏笔",
};

function scriptSceneTitleFor(number, fallbackTitle) {
  return scriptSceneChineseTitles[number] || `第${String(number).padStart(2, "0")}场：${fallbackTitle}`;
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
const rebuildV2Queue = fs.existsSync(rebuildV2QueuePath)
  ? JSON.parse(fs.readFileSync(rebuildV2QueuePath, "utf8"))
  : [];
const deliveryManifest = fs.existsSync(deliveryManifestPath)
  ? JSON.parse(fs.readFileSync(deliveryManifestPath, "utf8"))
  : { shots: [] };
const productionKeyframeQa = fs.existsSync(productionKeyframeQaPath)
  ? JSON.parse(fs.readFileSync(productionKeyframeQaPath, "utf8")).shots || {}
  : {};
const localVisualReview = fs.existsSync(localVisualReviewPath)
  ? JSON.parse(fs.readFileSync(localVisualReviewPath, "utf8")).shots || {}
  : {};
const fullLocalVisualReviewReport = fs.existsSync(fullLocalVisualReviewPath)
  ? JSON.parse(fs.readFileSync(fullLocalVisualReviewPath, "utf8"))
  : { shots: {} };
const fullLocalVisualReview = fullLocalVisualReviewReport.shots || {};
const rosterContinuity = fs.existsSync(rosterContinuityPath)
  ? JSON.parse(fs.readFileSync(rosterContinuityPath, "utf8")).shots || {}
  : {};
const battleLedgerRows = fs.existsSync(battleLedgerPath)
  ? JSON.parse(fs.readFileSync(battleLedgerPath, "utf8")).rows || []
  : [];
const handoffPackageManifest = fs.existsSync(handoffPackageManifestPath)
  ? JSON.parse(fs.readFileSync(handoffPackageManifestPath, "utf8"))
  : { shots: [] };
const operatorNextSteps = fs.existsSync(operatorNextStepsJsonPath)
  ? JSON.parse(fs.readFileSync(operatorNextStepsJsonPath, "utf8"))
  : null;
const handoffControlReportsAudit = fs.existsSync(handoffControlReportsAuditPath)
  ? JSON.parse(fs.readFileSync(handoffControlReportsAuditPath, "utf8"))
  : null;
const motionProbeZipBatches = motionProbeZipBatchesFromManifest(motionProbeProviderBundlesManifestPath);
const motionProbeReturnBatches = motionProbeReturnBatchesFromZipBatches(motionProbeZipBatches);
const productionKeyframeMap = new Map(productionKeyframeQueue.map((item) => [item.shot, item]));
const rebuildV2Map = new Map(rebuildV2Queue.map((item) => [item.shot, item]));
const deliveryManifestMap = new Map((deliveryManifest.shots || []).map((item) => [item.shot, item]));
const handoffPackageShotMap = new Map((handoffPackageManifest.shots || []).map((item) => [item.shot, item]));
const rosterContinuityMap = new Map(Object.entries(rosterContinuity));
const battleLedgerMap = new Map(battleLedgerRows.map((item) => [item.shot, item]));
const shotMeta = parseShotList();
const matrix = parseMatrix();
const scriptScenes = parseScriptScenes();
const scriptSceneMap = new Map(scriptScenes.map((scene) => [scene.number, scene]));
const queueShotSet = new Set(queue.map((item) => item.shot));
function handoffPackageFile(relativePath) {
  return relativePath ? `${handoffPackageRoot}/${relativePath}` : "";
}

function handoffShotFile(shot, field, filename) {
  if (!shot) return "";
  const explicit = shot[field] || "";
  if (explicit && explicit.startsWith("shots/") && explicit.endsWith(filename)) {
    return handoffPackageFile(explicit);
  }
  return shot.package_dir ? handoffPackageFile(`${shot.package_dir}/${filename}`) : "";
}

function handoffPackageFrameSet(shot) {
  if (!shot) return null;
  return [
    {
      role: "start",
      label: "起始帧",
      path: handoffShotFile(shot, "start_frame", "start_frame.png"),
      sourcePath: shot.source_frames?.start_frame || "",
      status: "scene09_handoff_current",
      intent: "当前交付包起始锚点；视频模型上传时使用此 package-local PNG",
    },
    {
      role: "key",
      label: "关键帧",
      path: handoffShotFile(shot, "key_frame", "key_frame.png"),
      sourcePath: shot.source_frames?.key_frame || "",
      status: "scene09_handoff_current",
      intent: shot.primary_check || "当前交付包动作峰值锚点；视频模型上传时使用此 package-local PNG",
    },
    {
      role: "end",
      label: "结束帧",
      path: handoffShotFile(shot, "end_frame", "end_frame.png"),
      sourcePath: shot.source_frames?.end_frame || "",
      status: "scene09_handoff_current",
      intent: "当前交付包剪出锚点；视频模型上传时使用此 package-local PNG",
    },
  ];
}

function handoffPackageWebOverride(shot) {
  const frameSet = handoffPackageFrameSet(shot);
  if (!frameSet) return {};
  return {
    displayImagePath: frameSet[1].path || frameSet[0].path || "",
    displayImageStatus: "scene09_handoff_current",
    displayImageSource: "scene09_v3_monitor_handoff_package",
    frameSet,
    productionStatus: "scene09_handoff_current",
    productionPriority: "scene09_v3_monitor_handoff",
    productionKeyframePath: frameSet[1].path || "",
    productionStartFramePath: frameSet[0].path || "",
    payloadProductionImagePath: frameSet[0].path || "",
    payloadProductionStatus: "scene09_handoff_current",
    sourcePackage: "scene09_v3_monitor_handoff_package",
  };
}

const deliveryOnlyQueue = (deliveryManifest.shots || [])
  .filter((item) => !queueShotSet.has(item.shot))
  .filter((item) => {
    const { baseNumber } = parseShotId(item.shot);
    return baseNumber >= 25 && baseNumber <= 36;
  })
  .map((item) => ({
    shot: item.shot,
    title: item.title || item.purpose || item.id || item.shot,
    duration: item.duration || "",
    duration_seconds: item.duration_seconds || "",
    status: item.status || "scene09_v3_attrition_current",
    still: item.key_frame || item.start_frame || "",
    video_prompt: item.video_prompt || item.motion || "",
    camera: item.camera || "",
    source_package: "scene09_v3_delivery_manifest",
    characters: (item.visible_named_only || []).map((name) => ({ name })),
    outputNeeded: "Scene09 v3 attrition delivery shot with start/key/end frames",
  }));
const storyboardQueue = [...queue, ...deliveryOnlyQueue].sort((a, b) => {
  const aId = parseShotId(a.shot);
  const bId = parseShotId(b.shot);
  return aId.order - bId.order || String(a.shot).localeCompare(String(b.shot));
});

const shots = storyboardQueue.map((item) => {
  const rebuildV2 = rebuildV2Map.get(item.shot) || null;
  const deliveryV3 = deliveryManifestMap.get(item.shot) || null;
  const handoffPackageShot = handoffPackageShotMap.get(item.shot) || null;
  const titleZh = chineseTitleForShot(item.shot);
  const { baseNumber, order, suffix } = parseShotId(item.shot);
  const number = baseNumber;
  const scriptScene = scriptSceneMap.get(sceneNumberForShot(number));
  const meta = shotMeta.get(item.shot) || {};
  const payload = payloadMap.get(item.shot) || {};
  const keyframes = keyframeMap.get(item.shot) || {};
  const productionKeyframe = productionKeyframeMap.get(item.shot) || {};
  const productionQa = productionKeyframeQa[item.shot] || {};
  const visualReview = localVisualReview[item.shot] || null;
  const fullVisualReview = fullLocalVisualReview[item.shot] || null;
  const sanitizedRebuildV2 = rebuildV2 ? {
    ...rebuildV2,
    decision: fullVisualReview?.decision || rebuildV2.decision || "",
    visual_review_status: fullVisualReview?.status || rebuildV2.visual_review_status || "",
    video_generation_readiness: fullVisualReview?.video_generation_readiness || rebuildV2.video_generation_readiness || "",
    full_local_visual_review_status: fullVisualReview?.status || rebuildV2.full_local_visual_review_status || "",
    fullLocalVisualReviewStatus: fullVisualReview?.status || rebuildV2.fullLocalVisualReviewStatus || "",
    full_local_visual_review_decision: fullVisualReview?.decision || rebuildV2.full_local_visual_review_decision || "",
    fullLocalVisualReviewDecision: fullVisualReview?.decision || rebuildV2.fullLocalVisualReviewDecision || "",
  } : null;
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
  const rebuildFrames = rebuildV2?.frames || {};
  const rebuildFrameSet = rebuildV2 ? [
    {
      role: "start",
      label: "起始帧",
      path: rebuildFrames.start?.path || rebuildV2.start_frame || rebuildV2.source_frames?.start || "",
      status: rebuildFrames.start?.path || rebuildV2.start_frame ? "rebuild_v2_current" : "missing",
      intent: rebuildFrames.start?.intent || "Scene09 rebuild v2 current start frame",
      prompt: rebuildFrames.start?.prompt || "",
    },
    {
      role: "key",
      label: "关键帧",
      path: rebuildFrames.key?.path || rebuildV2.key_frame || rebuildV2.source_frames?.key || "",
      status: rebuildFrames.key?.path || rebuildV2.key_frame ? "rebuild_v2_current" : "missing",
      intent: rebuildFrames.key?.intent || rebuildV2.purpose || "Scene09 rebuild v2 current key frame",
      prompt: rebuildFrames.key?.prompt || rebuildV2.video_prompt || "",
    },
    {
      role: "end",
      label: "结束帧",
      path: rebuildFrames.end?.path || rebuildV2.end_frame || rebuildV2.source_frames?.end || "",
      status: rebuildFrames.end?.path || rebuildV2.end_frame ? "rebuild_v2_current" : "missing",
      intent: rebuildFrames.end?.intent || "Scene09 rebuild v2 current end frame",
      prompt: rebuildFrames.end?.prompt || "",
    },
  ] : frameSet;
  const effectiveDisplayImage = rebuildV2
    ? (rebuildFrames.key?.path || rebuildV2.key_frame || rebuildV2.source_frames?.key || rebuildFrames.start?.path || rebuildV2.start_frame || displayedStill)
    : displayedStill;
  const effectiveDisplayStatus = rebuildV2 ? "rebuild_v2_current" : displayedStillStatus;
  const effectiveDisplaySource = rebuildV2 ? "scene09_rebuild_v2_current" : displayedStillSource;
  const effectiveVideoPrompt = rebuildV2?.video_prompt || item.video_prompt;
  const effectiveAudioBridge = rebuildV2?.dialogue_audio || item.audio_bridge || "";
  const effectiveScreenDirection = rebuildV2?.screen_direction || item.screen_direction_rule || "";
  const effectiveVisibleNamedOnly = deliveryV3?.visible_named_only || rebuildV2?.visible_named_only || [];
  const effectiveCharacters = effectiveVisibleNamedOnly.length
    ? effectiveVisibleNamedOnly.map((name) => ({ name }))
    : (rebuildV2?.characters || item.characters);
  const effectiveRejectIf = rebuildV2?.reject_if || item.reject_if || [];
  const legacyRosterAfter = rebuildV2?.roster_after || rosterContinuityMap.get(item.shot) || {};
  const battleLedgerAfter = battleLedgerMap.get(item.shot) || null;
  const effectiveRosterAfter = battleLedgerAfter
    ? {
        ...legacyRosterAfter,
        ...battleLedgerAfter,
        after_shot_note: legacyRosterAfter.after_shot_note || battleLedgerAfter.after_shot_note || "",
        result: battleLedgerAfter.result || legacyRosterAfter.result || "",
      }
    : legacyRosterAfter;
  return {
    shot: item.shot,
    number,
    order,
    title: titleZh || (rebuildV2 ? (rebuildV2.title || rebuildV2.purpose || item.title) : item.title),
    titleZh,
    act: actOf(number),
    duration: item.duration,
    durationSeconds: rebuildV2?.duration_seconds || item.duration_seconds || "",
    status: rebuildV2?.status || item.status,
    still: item.still || "",
    displayImagePath: effectiveDisplayImage,
    displayImageStatus: effectiveDisplayStatus,
    displayImageSource: effectiveDisplaySource,
    productionQaStatus: visualReview?.status || productionQa.status || "",
    productionQaChecks: [
      ...(fullVisualReview ? [
        `full_local_visual_review: ${fullVisualReview.status}`,
        `full_local_visual_review_decision: ${fullVisualReview.decision}`,
        `full_local_visual_review_note: ${fullVisualReview.story_beat_proven}`,
        `full_local_visual_review_video_readiness: ${fullVisualReview.video_generation_readiness}`,
      ] : []),
      ...(visualReview?.checks || []),
      ...(visualReview?.notes ? [`visual_review_note: ${visualReview.notes}`] : []),
      ...(productionQa.checks || []),
    ],
    fullLocalVisualReviewStatus: fullVisualReview?.status || "",
    fullLocalVisualReviewDecision: fullVisualReview?.decision || "",
    fullLocalVisualReviewNote: fullVisualReview?.story_beat_proven || "",
    fullLocalVisualReviewVideoReadiness: fullVisualReview?.video_generation_readiness || "",
    fullLocalVisualReviewPath: fullVisualReview ? fullLocalVisualReviewMdPath : "",
    fullLocalVisualReviewJsonPath: fullVisualReview ? fullLocalVisualReviewPath : "",
    productionQaIssues: productionQa.issues || [],
    rosterAfter: effectiveRosterAfter,
    battleLedgerAfter: battleLedgerAfter || undefined,
    frameSet: rebuildFrameSet,
    productionStatus: rebuildV2 ? "scene09_rebuild_v2_current" : (productionKeyframe.status || ""),
    productionPriority: rebuildV2 ? (rebuildV2.priority_batch || "scene09_rebuild_v2") : (productionKeyframe.priority || ""),
    productionKeyframePath: rebuildV2 ? (rebuildFrames.key?.path || rebuildV2.key_frame || "") : (productionKeyframe.output_keyframe || ""),
    productionStartFramePath: rebuildV2 ? (rebuildFrames.start?.path || rebuildV2.start_frame || "") : (productionKeyframe.output_start_frame || ""),
    productionFrameIntent: rebuildV2 ? (rebuildFrames.key?.intent || rebuildV2.purpose || "") : productionFrameIntent,
    productionFramePrompt: rebuildV2 ? (rebuildFrames.key?.prompt || rebuildV2.video_prompt || "") : productionFramePrompt,
    startKeyAssociation: rebuildV2?.startKeyAssociation || productionQa.start_key_association || "",
    characterReferenceAssets: productionKeyframe.character_reference_assets || [],
    subframes: rebuildV2 ? [] : subframes,
    keyFrameIntent: rebuildV2 ? (rebuildFrames.key?.intent || rebuildV2.purpose || "") : (keyframes.keyFrameIntent || (suffix ? item.outputNeeded || item.title || "" : "")),
    keyFramePrompt: rebuildV2 ? (rebuildFrames.key?.prompt || rebuildV2.video_prompt || "") : (keyframes.keyFramePrompt || (suffix ? item.video_prompt || "" : "")),
    sourcePackage: item.source_package,
    outputPath: payload.output_path || item.output_path || "",
    payloadProductionStatus: rebuildV2 ? "scene09_rebuild_v2_current" : (payload.production_status || ""),
    payloadProductionImagePath: rebuildV2 ? (rebuildFrames.start?.path || rebuildV2.start_frame || "") : (payload.production_image_path || ""),
    payloadBlockedSourceImagePath: rebuildV2 ? "" : (payload.blocked_source_image_path || ""),
    payloadProductionPromptFile: rebuildV2 ? `production_system/scene09_v3_attrition_package/production_video_prompts/${item.shot}_production_video_prompt_v3.md` : (payload.production_prompt_file || ""),
    modelReadyPromptFile: handoffShotFile(handoffPackageShot, "model_prompt", "model_prompt.md"),
    modelReadyNegativePromptFile: handoffShotFile(handoffPackageShot, "negative_prompt", "negative_prompt.md"),
    auditPromptFile: handoffShotFile(handoffPackageShot, "audit_prompt", "prompt.md"),
    handoffShotMetadataFile: handoffShotFile(handoffPackageShot, "metadata", "metadata.json"),
    promptSubmissionRole: handoffPackageShot ? "model_prompt_md_submission_only" : "",
    promptSubmissionStatus: handoffPackageShot?.status || "",
    cinematicBlock: item.cinematic_block || payload.cinematic_block || "",
    transitionIn: item.transition_in || payload.transition_in || "",
    transitionOut: item.transition_out || payload.transition_out || "",
    screenDirectionRule: effectiveScreenDirection,
    audioBridge: effectiveAudioBridge,
    editorialHandlesSeconds: item.editorial_handles_seconds || payload.editorial_handles_seconds || "",
    riskNotes: rebuildV2?.riskNotes || (Array.isArray(item.risk_notes) ? item.risk_notes.join("; ") : (item.risk_notes || "")),
    videoPrompt: effectiveVideoPrompt,
    generationPrompt: rebuildV2 ? effectiveVideoPrompt : (payload.prompt || ""),
    negativePrompt: rebuildV2 ? effectiveRejectIf.join("\n") : (payload.negative_prompt || ""),
    camera: item.camera,
    avoid: item.avoid,
    generatedRebuild: sanitizedRebuildV2 || undefined,
    visibleNamedOnly: effectiveVisibleNamedOnly,
    currentCharacters: effectiveCharacters || [],
    currentRejectIf: effectiveRejectIf,
    scriptSceneTitle: scriptScene ? scriptScene.title : "",
    scriptSceneBody: scriptScene ? scriptScene.body : "",
    scriptSceneExcerpt: scriptScene ? scriptScene.excerpt : "",
    shotDialogue: meta.dialogue || "",
    ...meta,
    ...matrix.get(item.shot),
    ...(rebuildV2 ? {
      title: titleZh || rebuildV2.title || rebuildV2.purpose || item.title,
      purposeZh: rebuildV2.purpose || "",
      visual: rebuildV2.frames?.key?.intent || rebuildV2.purpose || "",
      camera: rebuildV2.camera || item.camera || "",
      characters: effectiveVisibleNamedOnly.join(", "),
      startKeyAssociation: rebuildV2.startKeyAssociation || productionQa.start_key_association || "",
      riskNotes: rebuildV2.riskNotes || "",
      outputNeeded: "Scene09 rebuild v2 start/key/end frames and model-ready prompt",
      payloadProductionPromptFile: `production_system/scene09_v3_attrition_package/production_video_prompts/${item.shot}_production_video_prompt_v3.md`,
      modelReadyPromptFile: handoffShotFile(handoffPackageShot, "model_prompt", "model_prompt.md"),
      modelReadyNegativePromptFile: handoffShotFile(handoffPackageShot, "negative_prompt", "negative_prompt.md"),
      auditPromptFile: handoffShotFile(handoffPackageShot, "audit_prompt", "prompt.md"),
      handoffShotMetadataFile: handoffShotFile(handoffPackageShot, "metadata", "metadata.json"),
      promptSubmissionRole: handoffPackageShot ? "model_prompt_md_submission_only" : "",
      promptSubmissionStatus: handoffPackageShot?.status || "",
      generationPrompt: effectiveVideoPrompt,
      negativePrompt: effectiveRejectIf.join("\n"),
      productionFrameIntent: rebuildFrames.key?.intent || rebuildV2.purpose || "",
      productionFramePrompt: rebuildFrames.key?.prompt || rebuildV2.video_prompt || "",
      keyFrameIntent: rebuildFrames.key?.intent || rebuildV2.purpose || "",
      keyFramePrompt: rebuildFrames.key?.prompt || rebuildV2.video_prompt || "",
      productionKeyframePath: rebuildFrames.key?.path || rebuildV2.key_frame || "",
      productionStartFramePath: rebuildFrames.start?.path || rebuildV2.start_frame || "",
      payloadProductionImagePath: rebuildFrames.start?.path || rebuildV2.start_frame || "",
      payloadBlockedSourceImagePath: "",
      payloadProductionPromptFile: `production_system/scene09_v3_attrition_package/production_video_prompts/${item.shot}_production_video_prompt_v3.md`,
      payloadProductionStatus: "scene09_rebuild_v2_current",
      productionStatus: "scene09_rebuild_v2_current",
      productionPriority: rebuildV2.priority_batch || "scene09_rebuild_v2",
      rosterAfter: effectiveRosterAfter,
      subframes: [],
    } : {}),
    ...(item.shot === "Shot034B" ? shot034BWebOverride() : {}),
    ...(handoffPackageShot ? handoffPackageWebOverride(handoffPackageShot) : {}),
    ...(item.shot === "Shot032" ? shot032HealingHomageWebOverride() : {}),
    ...(titleZh ? { title: titleZh, titleZh } : {}),
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
  mockBattleScriptShootabilityAudit: "episodes/EP02/scene09_script_shootability_audit_2026-07-21.md",
  mockBattleShootingScriptV2: "episodes/EP02/scene09_shooting_script_v2_2026-07-21.md",
  mockBattleShotListV2: "episodes/EP02/scene09_shot_list_v2_2026-07-21.md",
  mockBattleRebuildV2Queue: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json",
  mockBattleRebuildV2Prompts: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_and_video_prompts.md",
  mockBattleRebuildV2Qa: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/qa_manifest.json",
  mockBattleRebuildV2Gallery: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/index.html",
  mockBattleRosterContinuity: "episodes/EP02/scene09_roster_continuity_2026-07-23.md",
  mockBattleRosterContinuityJson: rosterContinuityPath,
  mockBattleBattleLedgerTimeline: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/battle_ledger_timeline.md",
  mockBattleBattleLedgerTimelineJson: battleLedgerPath,
  mockBattlePerFrameVisualReviewMatrix: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/per_frame_visual_review_matrix.html",
  mockBattlePerFrameVisualReviewMatrixJson: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/per_frame_visual_review_matrix.json",
  mockBattleFullLocalVisualReview: fullLocalVisualReviewMdPath,
  mockBattleFullLocalVisualReviewJson: fullLocalVisualReviewPath,
  mockBattleWebBattleEventPanelAudit: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/ep02_web_battle_event_panel_audit.json",
  mockBattleMotionProbeProviderIndex: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_provider_bundles/index.html",
  mockBattleMotionProbeProviderReadme: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_provider_bundles/README.md",
  mockBattleMotionProbeSubmissionManifest: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_submission_manifest.md",
  mockBattleMotionProbeSubmissionManifestJson: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_submission_manifest.json",
  mockBattleMotionProbeSubmissionManifestCsv: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_submission_manifest.csv",
  mockBattleMotionProbeUploadPackReadme: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_upload_pack/README.md",
  mockBattleMotionProbeUploadPackManifest: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_upload_pack/upload_manifest.json",
  mockBattleMotionProbeUploadPackCsv: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_upload_pack/upload_manifest.csv",
  mockBattleMotionProbeUploadPackReturnDirs: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_upload_pack/RETURN_DIRECTORIES.md",
  mockBattleMotionProbeOperatorTracker: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_operator_tracker.html",
  mockBattleMotionProbeOperatorTrackerJson: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_operator_tracker.json",
  mockBattleMotionProbeOperatorTrackerCsv: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_operator_tracker.csv",
  mockBattleMotionProbeOperatorTrackerAudit: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_operator_tracker_audit.md",
  mockBattleMotionProbeOperatorTrackerAuditJson: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_operator_tracker_audit.json",
  mockBattleHandoffControlReportsAudit: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/handoff_control_reports_audit.md",
  mockBattleHandoffControlReportsAuditJson: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/handoff_control_reports_audit.json",
  mockBattleMotionProbeReturnIntake: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_return_intake/README.md",
  mockBattleMotionProbeReturnMap: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_return_intake/expected_probe_map.csv",
  mockBattleProviderUploadBundlesReadme: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/provider_upload_bundles/README.md",
  mockBattleProviderReturnContract: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/provider_upload_bundles/RETURN_CONTRACT.md",
  mockBattleClipReturnIntake: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake/README.md",
  mockBattleClipReturnMap: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/clip_return_intake/expected_clip_map.csv",
  mockBattleV2LogicPrevisReview: "episodes/EP02/scene09_v2_p0_logic_previs_review_2026-07-21.md",
  mockBattleV2LogicPrevisManifest: "episodes/EP02/generated/scene09_v2_logic_previs_2026-07-21/manifest.json",
  mockBattleV2LogicPrevisContactSheet: "episodes/EP02/generated/scene09_v2_logic_previs_2026-07-21/contact_sheet_scene09_v2_p0_logic_previs.png",
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
  mockBattleOperatorNextSteps: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/OPERATOR_NEXT_STEPS.md",
  mockBattleOperatorNextStepsJson: operatorNextStepsJsonPath,
  mockBattleOperatorStatus: operatorNextSteps
    ? {
        ...operatorNextSteps,
        handoff_control_reports_audit: handoffControlReportsAudit ? {
          decision: handoffControlReportsAudit.decision,
          required_reports_checked: handoffControlReportsAudit.required_reports_checked,
          declared_required_reports: handoffControlReportsAudit.declared_required_reports,
          problems: Array.isArray(handoffControlReportsAudit.problems) ? handoffControlReportsAudit.problems.length : 0,
          warnings: Array.isArray(handoffControlReportsAudit.warnings) ? handoffControlReportsAudit.warnings.length : 0,
          href: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/handoff_control_reports_audit.md",
        } : null,
        motion_probe_zip_batches: motionProbeZipBatches,
        motion_probe_return_batches: motionProbeReturnBatches,
      }
    : null,
  mockBattleMonitorHandoffIndex: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/index.html",
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
