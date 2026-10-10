const fs = require("fs");
const path = require("path");
const vm = require("vm");

const inputPath = "site/data.js";
const outputPath = "site/data.js";
const characterRoot = "assets/characters";

const source = fs.readFileSync(inputPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const existing = sandbox.window.ASSET_REVIEW_DATA;

const nameOverrides = new Map([
  ["Aelfric", "阿尔法德"],
  ["Tomas", "托马修"],
  ["Monica", "莫妮卡"],
  ["Randolph", "兰道夫"],
  ["Ladislava", "拉蒂丝拉瓦"],
  ["Fleche", "芙蕾伽"],
  ["ChurchKnightExtra", "教会骑士群众"],
  ["AcademyStudentExtra", "学院学生群众"],
]);

function loadIndexedNames() {
  const indexPath = "production/character_asset_index.yaml";
  const names = new Map();
  if (!fs.existsSync(indexPath)) return names;
  const lines = fs.readFileSync(indexPath, "utf8").split("\n");
  let currentId = "";
  for (const line of lines) {
    const idMatch = line.match(/^- id: (.+)$/);
    if (idMatch) {
      currentId = idMatch[1].trim();
      continue;
    }
    const nameMatch = line.match(/^  name_zh: (.+)$/);
    if (currentId && nameMatch) {
      names.set(currentId, nameMatch[1].trim());
      currentId = "";
    }
  }
  return names;
}

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.isFile() && entry.name === "selected.png") results.push(full);
  }
  return results;
}

function eraFromPath(parts) {
  const afterCharacter = parts.slice(4, -1);
  return afterCharacter.length ? afterCharacter.join("/") : "selected";
}

function characterIdFromPath(parts) {
  return parts[3] || "";
}

function factionFromPath(parts) {
  return parts[2] || "";
}

const indexedNames = loadIndexedNames();
const existingNames = new Map();
for (const row of existing.characters || []) {
  if (row[0] && row[1] && row[0] !== row[1] && row[2] !== "characters") {
    existingNames.set(row[0], row[1]);
  }
}

const characters = walk(characterRoot)
  .map((file) => {
    const parts = file.split(path.sep);
    const faction = factionFromPath(parts);
    const id = characterIdFromPath(parts);
    const era = eraFromPath(parts);
    return [
      id,
      indexedNames.get(id) || existingNames.get(id) || nameOverrides.get(id) || id,
      faction,
      era,
      file,
    ];
  })
  .sort((a, b) => {
    const factionCompare = a[2].localeCompare(b[2]);
    if (factionCompare) return factionCompare;
    const idCompare = a[0].localeCompare(b[0]);
    if (idCompare) return idCompare;
    return a[3].localeCompare(b[3]);
  });

const documents = [...(existing.documents || [])];
const episodeAssets = [...(existing.episodeAssets || [])].filter(
  (item) => item.path !== "episodes/EP03/generated_storyboard_contact_sheet.jpg"
);
const requiredDocuments = [
  ["EP02 Scene09 模拟战详细分镜与关键帧设计", "episodes/EP02/scene09_mock_battle_storyboard_detail_2026-07-19.md"],
  ["EP02 Scene09 可拍性审核", "episodes/EP02/scene09_script_shootability_audit_2026-07-21.md"],
  ["EP02 Scene09 拍摄剧本 V2", "episodes/EP02/scene09_shooting_script_v2_2026-07-21.md"],
  ["EP02 Scene09 分镜 V2", "episodes/EP02/scene09_shot_list_v2_2026-07-21.md"],
  ["EP02 Scene09 Rebuild V2 起始帧/关键帧/视频提示词队列", "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_and_video_prompts.md"],
  ["EP02 Scene09 Rebuild V2 生产队列 JSON", "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json"],
  ["EP02 Scene09 Rebuild V2 QA Manifest", "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/qa_manifest.json"],
  ["EP02 Scene09 每镜头存活/退场连续性账本", "episodes/EP02/scene09_roster_continuity_2026-07-23.md"],
  ["EP02 Scene09 每镜头存活/退场连续性 JSON", "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/roster_continuity_by_shot.json"],
  ["EP02 Scene09 V2 P0 逻辑预演审查", "episodes/EP02/scene09_v2_p0_logic_previs_review_2026-07-21.md"],
  ["EP02 Scene09 全镜头起始帧关键帧视频提示词交付清单", "episodes/EP02/scene09_full_frame_and_video_prompts_2026-07-19.md"],
  ["EP02 Scene09 全量重建范围", "episodes/EP02/scene09_full_rebuild_scope_2026-07-20.md"],
  ["EP02 Scene09 审核合成结论", "episodes/EP02/scene09_audit_synthesis_2026-07-20.md"],
  ["EP02 Scene09 起始帧关键帧二审交付审计", "episodes/EP02/scene09_frame_delivery_audit_2026-07-19.md"],
  ["EP02 Scene09 二次视觉QA报告", "episodes/EP02/scene09_secondary_visual_qa_2026-07-19.md"],
  ["EP02 Scene09 创作逻辑复审与降级清单", "episodes/EP02/scene09_creative_logic_audit_2026-07-20.md"],
  ["EP02 Scene09 朝向连续性规则", "episodes/EP02/scene09_direction_continuity_pass_2026-07-19.md"],
  ["EP02 Scene09 武器与朝向合理性审核", "episodes/EP02/scene09_weapon_and_facing_audit_2026-07-19.md"],
  ["EP02 Scene09 本地逐图人工审核", "episodes/EP02/scene09_manual_image_review_2026-07-19.md"],
  ["EP02 Scene09 视频前深审计", "episodes/EP02/scene09_pre_video_deep_audit_2026-07-19.md"],
  ["EP02 Scene09 角色胜负与退场账本", "episodes/EP02/scene09_character_outcome_exit_plan_2026-07-19.md"],
  ["EP02 Scene09 视频预检包", "episodes/EP02/scene09_video_preflight_package_2026-07-19.md"],
  ["EP02 Scene09 Animatic 时间与剪辑计划", "episodes/EP02/scene09_animatic_timing_plan_2026-07-19.md"],
  ["EP02 Scene09 视频失败判定标准", "episodes/EP02/scene09_video_failure_criteria_2026-07-19.md"],
  ["EP02 Scene09 对白与表演节奏", "episodes/EP02/scene09_dialogue_performance_pass_2026-07-19.md"],
  ["EP02 学级模拟战原作地图修正方案", "episodes/EP02/mock_battle_canon_map_plan_2026-07-17.md"],
  ["EP02 学级模拟战打斗剧本", "episodes/EP02/mock_battle_tactical_fight_script_2026-07-17.md"],
  ["EP03 剧本", "episodes/EP03/script.md"],
  ["EP03 镜头表", "episodes/EP03/shot_list.md"],
  ["EP03 源片拆解", "episodes/EP03/source_video_breakdown.md"],
  ["EP03 视觉材料审计", "episodes/EP03/visual_material_audit.md"],
  ["EP03 帧生成队列", "episodes/EP03/frame_generation_queue.md"],
  ["EP03 Prompt Asset Manifest", "episodes/EP03/prompt_asset_package_manifest.json"],
  ["EP03 Video Delivery Manifest", "episodes/EP03/production_system/video_delivery_manifest.json"],
  ["EP03 Project Bible", "episodes/EP03/project_bible.md"],
  ["EP03 Director Treatment", "episodes/EP03/director_treatment.md"],
  ["EP03 Production Notes", "episodes/EP03/production_notes.md"],
  ["EP03 本地资产审片包 README", "episodes/EP03/delivery/local_asset_storyboard_package_2026-07-31/README.md"],
  ["EP03 本地资产审片包 Manifest", "episodes/EP03/delivery/local_asset_storyboard_package_2026-07-31/manifest.json"],
  ["EP03 本地资产镜头索引", "episodes/EP03/delivery/local_asset_storyboard_package_2026-07-31/shot_index.md"],
  ["EP03 本地资产审片包 QA", "episodes/EP03/delivery/local_asset_storyboard_package_2026-07-31/package_review_2026-07-31.md"],
  ["EP03 身份锁关键帧重做包", "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/index.html"],
  ["EP03 身份锁关键帧重做 Manifest", "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/package_manifest.json"],
  ["EP03 身份锁关键帧重做队列", "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/submission_queue.csv"],
  ["EP03 身份锁关键帧重做 Runbook", "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/RUNBOOK.md"],
  ["EP03 身份锁提示词策略", "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/prompt_policy.md"],
  ["EP03 身份锁重做 QA Checklist", "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/QA_CHECKLIST.md"],
  ["EP03 本地身份板 Viewer", "episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/viewer.html"],
  ["EP03 本地身份板 Index", "episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/index.json"],
  ["EP03 本地身份板说明", "episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/index.md"],
  ["人物职业变体缺口清单", "production/人物职业变体缺口清单_2026-07-16.md"],
  ["人物职业变体生成队列", "production/人物职业变体生成队列_2026-07-16.md"],
];
for (const doc of requiredDocuments) {
  if (fs.existsSync(doc[1]) && !documents.some((item) => item[1] === doc[1])) {
    documents.push(doc);
  }
}

const requiredEpisodeAssets = [
  {
    title: "Mock Battle Grounds Canon Map Master",
    label: "EP02 第二幕 学级模拟战场 Canon Map 生产背景母版",
    episode: "EP02",
    act: "act02",
    path: "assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png",
    note: "Scene09 主用 raster 背景资产：东南起点、中央低墙通道、西侧林地、东北高台和石阶同框；旧 SVG 只作为坐标示意。",
  },
  {
    title: "Scene09 V2 P0 Logic Previs Contact Sheet",
    label: "Scene09 V2 P0 逻辑预演接触表",
    episode: "EP02",
    act: "act02",
    path: "episodes/EP02/generated/scene09_v2_logic_previs_2026-07-21/contact_sheet_scene09_v2_p0_logic_previs.png",
    note: "Shot032, Shot032A, Shot033B 的本地资产逻辑预演；只用于审核站位、朝向、起始帧/关键帧连续性，不是最终电影关键帧。",
  },
  {
    title: "EP03 Current Web Display Contact Sheet",
    label: "EP03 当前展示帧总览",
    episode: "EP03",
    act: "act01",
    path: "episodes/EP03/generated_storyboard_contact_sheet_current_2026-09-03.jpg",
    note: "EP03 当前主看板实际引用的 36 镜头、108 张 START/KEY/END 展示帧总览；每个镜头仍需 prompt-against-frame 与 motion probe，状态为 monitor_required。",
  },
  {
    title: "EP03 Local Identity Plate Atlas",
    label: "EP03 本地角色身份板总览",
    episode: "EP03",
    act: "asset_identity",
    path: "episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/EP03_local_identity_plate_atlas_2026-08-01.jpg",
    note: "EP03 角色本地 selected.png 身份板总览：源图、脸部、服装拓扑、全身轮廓；用于重做关键帧时锁定本地人物身份，状态为 layout_reference。",
  },
  {
    title: "EP03 Shot001 Imagegen Frameset Contact Sheet",
    label: "EP03 Shot001 被阻断 imagegen 三帧接触表",
    episode: "EP03",
    act: "act01",
    path: "episodes/EP03/storyboards/Shot001/imagegen_frameset_contact_sheet_2026-07-29.jpg",
    note: "Shot001 imagegen start/key/end 构图研究；未证明本地 selected.png 身份锁，状态为 blocked_needs_revision，不得作为关键帧资产使用。",
  },
  {
    title: "EP03 Shot002 Imagegen Frameset Contact Sheet",
    label: "EP03 Shot002 被阻断 imagegen 三帧接触表",
    episode: "EP03",
    act: "act01",
    path: "episodes/EP03/storyboards/Shot002/imagegen_frameset_contact_sheet_2026-07-29.jpg",
    note: "Shot002 imagegen start/key/end 构图研究；未证明本地 selected.png 身份锁，状态为 blocked_needs_revision，不得作为关键帧资产使用。",
  },
];
for (const shotDir of fs.existsSync("episodes/EP03/storyboards") ? fs.readdirSync("episodes/EP03/storyboards") : []) {
  if (!/^Shot\d+$/.test(shotDir)) continue;
  const sheetPath = `episodes/EP03/storyboards/${shotDir}/imagegen_frameset_contact_sheet_2026-07-29.jpg`;
  if (!fs.existsSync(sheetPath)) continue;
  requiredEpisodeAssets.push({
    title: `EP03 ${shotDir} Imagegen Frameset Contact Sheet`,
    label: `EP03 ${shotDir} 被阻断 imagegen 三帧接触表`,
    episode: "EP03",
    act: "act01",
    path: sheetPath,
    note: `${shotDir} imagegen start/key/end 构图研究；未证明本地 selected.png 身份锁，状态为 blocked_needs_revision，不得作为关键帧资产使用。`,
  });
}
for (const asset of requiredEpisodeAssets) {
  if (!fs.existsSync(asset.path)) continue;
  const existingIndex = episodeAssets.findIndex((item) => item.path === asset.path);
  if (existingIndex === -1) {
    episodeAssets.push(asset);
  } else {
    episodeAssets[existingIndex] = {
      ...episodeAssets[existingIndex],
      ...asset,
    };
  }
}

const payload = {
  ...existing,
  updated: "2026-07-16",
  characters,
  documents,
  episodeAssets,
};

fs.writeFileSync(outputPath, `window.ASSET_REVIEW_DATA = ${JSON.stringify(payload, null, 2)};\n`);
console.log(`wrote ${outputPath} (${characters.length} characters)`);
