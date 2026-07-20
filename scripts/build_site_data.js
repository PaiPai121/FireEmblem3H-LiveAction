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
const episodeAssets = [...(existing.episodeAssets || [])];
const requiredDocuments = [
  ["EP02 Scene09 模拟战详细分镜与关键帧设计", "episodes/EP02/scene09_mock_battle_storyboard_detail_2026-07-19.md"],
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
];
for (const asset of requiredEpisodeAssets) {
  if (fs.existsSync(asset.path) && !episodeAssets.some((item) => item.path === asset.path)) {
    episodeAssets.push(asset);
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
