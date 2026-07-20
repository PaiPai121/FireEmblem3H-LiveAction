const data = window.ASSET_REVIEW_DATA;

const factionNames = {
  protagonist: "主角",
  black_eagles: "黑鹫",
  blue_lions: "青狮",
  golden_deer: "金鹿",
  church_of_seiros: "赛罗司教会",
  divine: "神性 / 梦境",
  antagonists: "反派",
  extras: "群众",
  ashen_wolves: "灰狼",
  merchants: "商人",
  alliance: "雷斯塔联盟",
  almyra: "阿尔米拉",
  empire: "阿德剌斯忒亚帝国",
  kingdom: "法嘉斯神圣王国",
  abyss: "深渊",
};

const eraNames = {
  academy: "学院篇",
  war: "战争篇",
  professor: "导师",
  enlightened: "觉醒导师",
  emperor: "皇帝",
  king: "国王",
  leader: "盟主",
  war_broken: "崩坏战争篇",
  dream: "梦境",
  concept: "概念版",
  ancient: "古代",
  mercenary: "佣兵",
  legacy_ep01: "EP01 旧版"
};

const state = {
  view: "characters",
  query: "",
  faction: "all",
  era: "all",
  status: "all",
  storyboardEpisode: "EP02",
  storyboardScene: "all"
};

const els = {
  search: document.querySelector("#searchInput"),
  faction: document.querySelector("#factionFilter"),
  era: document.querySelector("#eraFilter"),
  status: document.querySelector("#statusFilter"),
  stats: document.querySelector("#stats"),
  grid: document.querySelector("#characterGrid"),
  locationStats: document.querySelector("#locationStats"),
  episodeFeature: document.querySelector("#episodeFeature"),
  shotList: document.querySelector("#shotList"),
  storyboardStats: document.querySelector("#storyboardStats"),
  storyboardEpisode: document.querySelector("#storyboardEpisodeFilter"),
  storyboardScene: document.querySelector("#storyboardSceneFilter"),
  sceneBoard: document.querySelector("#sceneBoard"),
  storyboardLinks: document.querySelector("#storyboardLinks"),
  storyboardGrid: document.querySelector("#storyboardGrid"),
  docsList: document.querySelector("#docsList"),
  dialog: document.querySelector("#previewDialog"),
  previewImage: document.querySelector("#previewImage"),
  previewTitle: document.querySelector("#previewTitle"),
  previewPath: document.querySelector("#previewPath")
};

function normalizeCharacter(row) {
  const [id, nameZh, faction, era, path] = row;
  return { id, nameZh, faction, era, path, status: "selected" };
}

const characters = data.characters.map(normalizeCharacter);
const eraPriority = [
  "academy",
  "professor",
  "war",
  "war_broken",
  "lord",
  "leader",
  "king",
  "emperor",
  "enlightened",
  "dream",
  "concept",
  "legacy_ep01",
  "selected",
];
const characterGroups = buildCharacterGroups(characters);
const locationAssets = data.episodeAssets.filter((item) => item.path.startsWith("assets/locations/"));
const historicalFrameAssets = data.episodeAssets.filter((item) => !item.path.startsWith("assets/locations/"));
const ep02Storyboard = window.EP02_STORYBOARD_DATA || { shots: [], blockContactSheets: [] };
const storyboardEpisodes = [
  {
    id: "EP02",
    label: "EP02",
    title: "EP02 全集分镜",
    data: ep02Storyboard,
  },
];

const locationGroupLabels = {
  prologue: "序章",
  EP01: "EP01",
  EP02: "EP02",
  EP03: "EP03",
  EP04: "EP04",
  EP05: "EP05",
  EP06: "EP06",
  EP07: "EP07",
  EP08: "EP08",
  EP09: "EP09",
  EP10: "EP10",
  EP11: "EP11",
  EP12: "EP12",
  shared: "共享地点",
  war: "战争篇",
  paralogues: "外传地点",
  dlc: "DLC 地点",
};

const locationGroupOrder = [
  "prologue",
  "EP01",
  "EP02",
  "EP03",
  "EP04",
  "EP05",
  "EP06",
  "EP07",
  "EP08",
  "EP09",
  "EP10",
  "EP11",
  "EP12",
  "shared",
  "war",
  "paralogues",
  "dlc",
];

function uniqueOptions(items, key, labelMap) {
  const values = [...new Set(items.map((item) => item[key]))].sort();
  return [["all", "全部"], ...values.map((value) => [value, labelMap[value] || value])];
}

function fillSelect(select, options) {
  select.innerHTML = options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
}

function eraLabel(era) {
  return eraNames[era] || era.replaceAll("_", " ");
}

function buildCharacterGroups(items) {
  const map = new Map();
  for (const item of items) {
    const key = `${item.faction}:${item.id}`;
    if (!map.has(key)) {
      map.set(key, {
        id: item.id,
        nameZh: item.nameZh,
        faction: item.faction,
        variants: [],
      });
    }
    map.get(key).variants.push(item);
  }
  return [...map.values()].map((group) => ({
    ...group,
    variants: group.variants.sort((a, b) => {
      const aRank = eraPriority.includes(a.era) ? eraPriority.indexOf(a.era) : eraPriority.length;
      const bRank = eraPriority.includes(b.era) ? eraPriority.indexOf(b.era) : eraPriority.length;
      if (aRank !== bRank) return aRank - bRank;
      return a.era.localeCompare(b.era);
    }),
  }));
}

function variantForGroup(group) {
  if (state.era !== "all") {
    const matched = group.variants.find((variant) => variant.era === state.era);
    if (matched) return matched;
  }
  return group.variants[0];
}

function matchesCharacterGroup(group) {
  const text = [
    group.id,
    group.nameZh,
    group.faction,
    ...group.variants.flatMap((variant) => [variant.era, variant.path]),
  ].join(" ").toLowerCase();
  return (!state.query || text.includes(state.query))
    && (state.faction === "all" || group.faction === state.faction)
    && (state.era === "all" || group.variants.some((variant) => variant.era === state.era))
    && (state.status === "all" || group.variants.some((variant) => variant.status === state.status));
}

function characterCardTemplate(group) {
  const faction = factionNames[group.faction] || group.faction;
  const selected = variantForGroup(group);
  const variantButtons = group.variants.map((variant) => {
    const isActive = variant.era === selected.era;
    return `
      <button class="variant-chip ${isActive ? "is-active" : ""}" type="button"
        data-character-id="${group.id}"
        data-character-faction="${group.faction}"
        data-variant-era="${variant.era}"
        data-variant-path="${variant.path}"
        data-variant-label="${eraLabel(variant.era)}">
        ${eraLabel(variant.era)}
      </button>
    `;
  }).join("");
  return `
    <article class="asset-card character-card" data-character-id="${group.id}" data-character-faction="${group.faction}">
      <button class="image-button" type="button" data-preview="${selected.path}" data-title="${group.nameZh} / ${group.id} / ${eraLabel(selected.era)}" data-path="${selected.path}">
        <img src="${selected.path}" alt="${group.nameZh} ${eraLabel(selected.era)}" loading="lazy" data-path="${selected.path}">
      </button>
      <div class="card-body">
        <div>
          <h3>${group.nameZh}</h3>
          <p>${group.id}</p>
        </div>
        <div class="chips">
          <span>${faction}</span>
          <span class="active-era">${eraLabel(selected.era)}</span>
          <span>${group.variants.length} 张</span>
        </div>
        <div class="variant-switcher" aria-label="${group.nameZh} 职业 / 阶段切换">
          ${variantButtons}
        </div>
        <a class="path" href="${selected.path}" target="_blank" rel="noreferrer">${selected.path}</a>
      </div>
    </article>
  `;
}

function imageErrorTemplate(path) {
  return `<div class="image-error">Missing image<br><span>${path}</span></div>`;
}

function matches(item) {
  const text = `${item.id} ${item.nameZh} ${item.faction} ${item.era} ${item.path}`.toLowerCase();
  return (!state.query || text.includes(state.query))
    && (state.faction === "all" || item.faction === state.faction)
    && (state.era === "all" || item.era === state.era)
    && (state.status === "all" || item.status === state.status);
}

function matchesText(fields) {
  if (!state.query) return true;
  return fields.filter(Boolean).join(" ").toLowerCase().includes(state.query);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function multiline(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function matchesEpisodeAsset(item) {
  return matchesText([item.title, item.label, item.episode, item.act, item.path, item.note]);
}

function matchesShot([shot, duration, purpose, path]) {
  return matchesText([shot, duration, purpose, path]);
}

function matchesStoryboardShot(item) {
  const sceneMatch = state.storyboardScene === "all" || item.scriptSceneTitle === state.storyboardScene;
  return matchesText([
    item.shot,
    item.title,
    item.act,
    item.scene,
    item.purposeZh,
    item.visual,
    item.duration,
    item.status,
    item.riskNotes,
    item.videoPrompt,
    item.generationPrompt,
    item.negativePrompt,
    item.productionFrameIntent,
    item.productionFramePrompt,
    item.startKeyAssociation,
    item.keyFrameIntent,
    item.keyFramePrompt,
    item.productionStatus,
    item.productionPriority,
    item.productionKeyframePath,
    item.productionStartFramePath,
    item.payloadProductionStatus,
    item.payloadProductionImagePath,
    item.payloadBlockedSourceImagePath,
    item.payloadProductionPromptFile,
    ...(item.characterReferenceAssets || []).flatMap((ref) => [ref.name, ref.asset, ref.continuity_note]),
    ...(item.subframes || []).flatMap((subframe) => [subframe.id, subframe.title, subframe.description, subframe.output_keyframe]),
    item.camera,
    item.sourceRef,
    item.priority,
    item.locationAsset,
    item.characters,
    item.outputNeeded,
    item.scriptSceneTitle,
    item.scriptSceneBody,
    item.shotDialogue,
    item.avoid,
  ]) && sceneMatch;
}

function selectedStoryboardEpisode() {
  return storyboardEpisodes.find((episode) => episode.id === state.storyboardEpisode) || storyboardEpisodes[0];
}

function sceneNumber(title) {
  const match = String(title || "").match(/^Scene\s+(\d+)/);
  return match ? Number(match[1]) : 999;
}

function buildSceneGroups(shots) {
  const groups = new Map();
  for (const shot of shots) {
    const key = shot.scriptSceneTitle || "未映射";
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(shot);
  }
  return [...groups.entries()]
    .map(([title, items]) => ({ title, items }))
    .sort((a, b) => sceneNumber(a.title) - sceneNumber(b.title) || a.title.localeCompare(b.title));
}

function formatSeconds(seconds) {
  if (!seconds) return "0 秒";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (!minutes) return `${rest} 秒`;
  return rest ? `${minutes} 分 ${rest} 秒` : `${minutes} 分`;
}

function fillStoryboardFilters() {
  fillSelect(els.storyboardEpisode, storyboardEpisodes.map((episode) => [episode.id, episode.label]));
  els.storyboardEpisode.value = state.storyboardEpisode;
  fillStoryboardSceneFilter();
}

function fillStoryboardSceneFilter() {
  const episode = selectedStoryboardEpisode();
  const groups = buildSceneGroups(episode.data.shots || []);
  fillSelect(els.storyboardScene, [
    ["all", "全部 Scene"],
    ...groups.map((group) => [group.title, group.title]),
  ]);
  if (!groups.some((group) => group.title === state.storyboardScene)) {
    state.storyboardScene = "all";
  }
  els.storyboardScene.value = state.storyboardScene;
}

function renderStats(filtered) {
  const variants = filtered.flatMap((group) => group.variants);
  const factions = new Set(filtered.map((item) => item.faction)).size;
  const eras = new Set(variants.map((item) => item.era)).size;
  els.stats.innerHTML = `
    <div><strong>${filtered.length}</strong><span>当前角色</span></div>
    <div><strong>${characters.length}</strong><span>角色图总数</span></div>
    <div><strong>${factions}</strong><span>当前阵营</span></div>
    <div><strong>${eras}</strong><span>当前阶段</span></div>
  `;
}

function renderCharacters() {
  const filtered = characterGroups.filter(matchesCharacterGroup);
  renderStats(filtered);
  els.grid.innerHTML = filtered.length
    ? filtered.map(characterCardTemplate).join("")
    : `<p class="empty">没有匹配的素材。</p>`;
}

function renderEpisode() {
  const filteredLocations = locationAssets.filter(matchesEpisodeAsset);
  const filteredHistoricalFrames = historicalFrameAssets.filter(matchesEpisodeAsset);
  const filteredShots = data.shots.filter(matchesShot);
  const prologueCount = filteredLocations.filter((item) => item.episode === "prologue").length;
  const ep01Count = filteredLocations.filter((item) => item.episode === "EP01").length;
  const ep02Count = filteredLocations.filter((item) => item.episode === "EP02").length;
  const ep03Count = filteredLocations.filter((item) => item.episode === "EP03").length;
  const laterEpisodeCount = filteredLocations.filter((item) => /^EP(0[4-9]|1[0-2])$/.test(item.episode)).length;
  const sharedCount = filteredLocations.filter((item) => item.episode === "shared").length;
  const warCount = filteredLocations.filter((item) => item.episode === "war").length;
  const auxiliaryCount = filteredLocations.filter((item) => item.episode === "paralogues" || item.episode === "dlc").length;
  els.locationStats.innerHTML = `
    <div><strong>${filteredLocations.length}</strong><span>地点参考</span></div>
    <div><strong>${prologueCount}</strong><span>序章地点</span></div>
    <div><strong>${ep01Count}</strong><span>EP01 地点</span></div>
    <div><strong>${ep02Count}</strong><span>EP02 地点</span></div>
    <div><strong>${ep03Count}</strong><span>EP03 地点</span></div>
    <div><strong>${laterEpisodeCount}</strong><span>EP04-EP12</span></div>
    <div><strong>${sharedCount + warCount + auxiliaryCount}</strong><span>共享 / 战争 / 支线</span></div>
    <div><strong>${filteredHistoricalFrames.length}</strong><span>历史镜头图</span></div>
  `;

  const locationCardTemplate = (item) => `
    <article class="feature-item location-item">
      <button class="image-button" type="button" data-preview="${item.path}" data-title="${item.label}" data-path="${item.path}">
        <img src="${item.path}" alt="${item.label}" loading="eager" data-path="${item.path}">
      </button>
      <div>
        <p class="eyebrow">${item.title}</p>
        <h3>${item.label}</h3>
        <p>${item.note}</p>
        <a href="${item.path}" target="_blank" rel="noreferrer">${item.path}</a>
      </div>
    </article>
  `;

  const locationHtml = locationGroupOrder.map((group) => {
    const items = filteredLocations.filter((item) => item.episode === group);
    if (!items.length) return "";
    return `
      <section class="feature-group">
        <div class="feature-group-title">${locationGroupLabels[group]} <span>${items.length}</span></div>
        ${items.map(locationCardTemplate).join("")}
      </section>
    `;
  }).join("");

  const legacyHtml = filteredHistoricalFrames.length ? `
    <div class="feature-group-title">历史镜头图</div>
    ${filteredHistoricalFrames.map((item) => `
      <article class="feature-item compact-feature">
        <button class="image-button" type="button" data-preview="${item.path}" data-title="${item.label}" data-path="${item.path}">
          <img src="${item.path}" alt="${item.label}" loading="eager" data-path="${item.path}">
        </button>
        <div>
          <p class="eyebrow">${item.title}</p>
          <h3>${item.label}</h3>
          <p>${item.note}</p>
          <a href="${item.path}" target="_blank" rel="noreferrer">${item.path}</a>
        </div>
      </article>
    `).join("")}
  ` : "";

  els.episodeFeature.innerHTML = locationHtml || legacyHtml
    ? locationHtml + legacyHtml
    : `<p class="empty">没有匹配的地点素材。</p>`;

  els.shotList.innerHTML = filteredShots.length ? filteredShots.map(([shot, duration, purpose, path]) => `
    <a class="shot-row" href="${path}" target="_blank" rel="noreferrer">
      <strong>${shot}</strong>
      <span>${duration}</span>
      <p>${purpose}</p>
    </a>
  `).join("") : `<p class="empty">没有匹配的镜头。</p>`;
}

function renderStoryboard() {
  const episode = selectedStoryboardEpisode();
  const episodeData = episode.data || { shots: [], blockContactSheets: [] };
  const allEpisodeShots = episodeData.shots || [];
  const sceneGroups = buildSceneGroups(allEpisodeShots);
  const shots = allEpisodeShots.filter(matchesStoryboardShot);
  const visibleSceneGroups = buildSceneGroups(shots);
  const visibleStillCount = shots.filter((shot) => shot.still).length;
  const riskCount = shots.filter((shot) => shot.riskNotes).length;
  const actCount = new Set(shots.map((shot) => shot.act)).size;
  const scriptCount = shots.filter((shot) => shot.scriptSceneTitle).length;
  const promptCount = shots.filter((shot) => shot.videoPrompt).length;
  const payloadPromptCount = shots.filter((shot) => shot.generationPrompt).length;
  const continuityCount = shots.filter((shot) => shot.transitionIn || shot.transitionOut || shot.audioBridge).length;
  const keyFrameCount = shots.filter((shot) => (shot.frameSet || []).some((frame) => frame.role === "key" && frame.path)).length;
  const subframeCount = shots.reduce((sum, shot) => sum + (shot.subframes || []).length, 0);
  const referenceLockedCount = shots.filter((shot) => (shot.characterReferenceAssets || []).length).length;
  const totalSeconds = shots.reduce((sum, shot) => sum + (Number(shot.durationSeconds) || 0), 0);

  els.storyboardStats.innerHTML = `
    <div><strong>${episode.label}</strong><span>当前 EP</span></div>
    <div><strong>${state.storyboardScene === "all" ? sceneGroups.length : 1}</strong><span>当前 Scene</span></div>
    <div><strong>${shots.length}</strong><span>当前镜头</span></div>
    <div><strong>${visibleStillCount}</strong><span>有首帧</span></div>
    <div><strong>${keyFrameCount}</strong><span>有关键帧图</span></div>
    <div><strong>${subframeCount}</strong><span>子分镜</span></div>
    <div><strong>${referenceLockedCount}</strong><span>人物锁脸</span></div>
    <div><strong>${scriptCount}</strong><span>有剧本映射</span></div>
    <div><strong>${payloadPromptCount || promptCount}</strong><span>有AI提示词</span></div>
    <div><strong>${continuityCount}</strong><span>有连续性</span></div>
    <div><strong>${riskCount}</strong><span>有风险备注</span></div>
    <div><strong>${actCount}</strong><span>段落</span></div>
    <div><strong>${formatSeconds(totalSeconds)}</strong><span>估算时长</span></div>
  `;

  els.sceneBoard.innerHTML = visibleSceneGroups.length ? visibleSceneGroups.map((group) => {
    const groupSeconds = group.items.reduce((sum, shot) => sum + (Number(shot.durationSeconds) || 0), 0);
    const first = group.items[0];
    const last = group.items[group.items.length - 1];
    const stills = group.items
      .filter((shot) => shot.displayImagePath || shot.still)
      .slice(0, 5)
      .map((shot) => `
        <button class="scene-thumb" type="button" data-preview="${shot.displayImagePath || shot.still}" data-title="${shot.shot} ${shot.title}" data-path="${shot.displayImagePath || shot.still}">
          <img src="${shot.displayImagePath || shot.still}" alt="${shot.shot} ${shot.title}" loading="lazy" data-path="${shot.displayImagePath || shot.still}">
        </button>
      `).join("");
    return `
      <article class="scene-card">
        <div class="scene-card-head">
          <div>
            <p class="eyebrow">${episode.label}</p>
            <h3>${escapeHtml(group.title)}</h3>
          </div>
          <button class="text-button scene-filter-button" type="button" data-scene-filter="${escapeHtml(group.title)}">只看本 Scene</button>
        </div>
        <dl class="scene-card-meta">
          <div><dt>镜头</dt><dd>${group.items.length}</dd></div>
          <div><dt>范围</dt><dd>${first.shot} - ${last.shot}</dd></div>
          <div><dt>时长</dt><dd>${formatSeconds(groupSeconds)}</dd></div>
        </dl>
        <div class="scene-thumb-strip">${stills || `<span class="empty-inline">暂无首帧</span>`}</div>
      </article>
    `;
  }).join("") : `<p class="empty">没有匹配的 Scene。</p>`;

  els.storyboardLinks.innerHTML = `
    <a href="${episodeData.reviewHtml}" target="_blank" rel="noreferrer">打开全片接触表</a>
    ${episodeData.timeline ? `<a href="${episodeData.timeline}" target="_blank" rel="noreferrer">Cinematic V2 时间线</a>` : ""}
    ${episodeData.continuityBrief ? `<a href="${episodeData.continuityBrief}" target="_blank" rel="noreferrer">电影连续性通告</a>` : ""}
    ${episodeData.runbook ? `<a href="${episodeData.runbook}" target="_blank" rel="noreferrer">V2 生产 Runbook</a>` : ""}
    ${episodeData.mockBattleProductionKeyframes ? `<a href="${episodeData.mockBattleProductionKeyframes}" target="_blank" rel="noreferrer">Scene09 关键帧生产队列</a>` : ""}
    ${episodeData.mockBattleSubframePlan ? `<a href="${episodeData.mockBattleSubframePlan}" target="_blank" rel="noreferrer">Scene09 子分镜计划</a>` : ""}
    ${episodeData.mockBattleP0ReferenceBoards ? `<a href="${episodeData.mockBattleP0ReferenceBoards}" target="_blank" rel="noreferrer">Scene09 P0 人物参考板</a>` : ""}
    ${episodeData.mockBattleFullRebuildScope ? `<a href="${episodeData.mockBattleFullRebuildScope}" target="_blank" rel="noreferrer">Scene09 全量重建范围</a>` : ""}
    ${episodeData.mockBattleAuditSynthesis ? `<a href="${episodeData.mockBattleAuditSynthesis}" target="_blank" rel="noreferrer">Scene09 审核合成</a>` : ""}
    ${episodeData.mockBattleSecondaryVisualQa ? `<a href="${episodeData.mockBattleSecondaryVisualQa}" target="_blank" rel="noreferrer">Scene09 二次视觉QA</a>` : ""}
    ${episodeData.mockBattleCreativeLogicAudit ? `<a href="${episodeData.mockBattleCreativeLogicAudit}" target="_blank" rel="noreferrer">Scene09 创作复审</a>` : ""}
    ${episodeData.mockBattleDirectionContinuity ? `<a href="${episodeData.mockBattleDirectionContinuity}" target="_blank" rel="noreferrer">Scene09 朝向连续性</a>` : ""}
    ${episodeData.mockBattleWeaponFacingAudit ? `<a href="${episodeData.mockBattleWeaponFacingAudit}" target="_blank" rel="noreferrer">Scene09 武器/朝向审核</a>` : ""}
    ${episodeData.mockBattleManualImageReview ? `<a href="${episodeData.mockBattleManualImageReview}" target="_blank" rel="noreferrer">Scene09 本地图审</a>` : ""}
    ${episodeData.mockBattlePreVideoDeepAudit ? `<a href="${episodeData.mockBattlePreVideoDeepAudit}" target="_blank" rel="noreferrer">Scene09 视频前深审计</a>` : ""}
    ${episodeData.mockBattleCharacterOutcomeExitPlan ? `<a href="${episodeData.mockBattleCharacterOutcomeExitPlan}" target="_blank" rel="noreferrer">Scene09 角色退场账本</a>` : ""}
    ${episodeData.mockBattleVideoPreflight ? `<a href="${episodeData.mockBattleVideoPreflight}" target="_blank" rel="noreferrer">Scene09 视频预检包</a>` : ""}
    ${episodeData.mockBattleAnimaticTiming ? `<a href="${episodeData.mockBattleAnimaticTiming}" target="_blank" rel="noreferrer">Scene09 Animatic</a>` : ""}
    ${episodeData.mockBattleDialoguePerformance ? `<a href="${episodeData.mockBattleDialoguePerformance}" target="_blank" rel="noreferrer">Scene09 对白表演</a>` : ""}
    ${episodeData.mockBattleVideoFailureCriteria ? `<a href="${episodeData.mockBattleVideoFailureCriteria}" target="_blank" rel="noreferrer">Scene09 视频失败标准</a>` : ""}
    ${episodeData.mockBattleBackgroundMaster ? `<button class="text-button" type="button" data-preview="${episodeData.mockBattleBackgroundMaster}" data-title="Scene09 战场背景母版" data-path="${episodeData.mockBattleBackgroundMaster}">预览战场母版</button>` : ""}
    <button class="text-button" type="button" data-preview="${episodeData.fullContactSheet}" data-title="${episode.label} 全片分镜总览" data-path="${episodeData.fullContactSheet}">预览总览图</button>
    ${(episodeData.blockContactSheets || []).map(([label, path]) => `
      <button class="text-button" type="button" data-preview="${path}" data-title="${label}" data-path="${path}">${label}</button>
    `).join("")}
  `;

  els.storyboardGrid.innerHTML = shots.length ? shots.map((shot) => {
    const displayImage = shot.displayImagePath || shot.still || "";
    const still = displayImage ? `
      <button class="image-button" type="button" data-preview="${displayImage}" data-title="${shot.shot} ${shot.title}" data-path="${displayImage}">
        <img src="${displayImage}" alt="${shot.shot} ${shot.title}" loading="lazy" data-path="${displayImage}">
      </button>
    ` : `<div class="storyboard-placeholder">BLACK<br><span>${shot.shot}</span></div>`;
    const frameStrip = (shot.frameSet || []).map((frame) => {
      const title = `${shot.shot} ${frame.label}`;
      const visual = frame.path ? `
        <button class="frame-thumb" type="button" data-preview="${frame.path}" data-title="${title}" data-path="${frame.path}">
          <img src="${frame.path}" alt="${title}" loading="lazy" data-path="${frame.path}">
        </button>
      ` : `
        <div class="frame-thumb frame-placeholder">
          <span>${escapeHtml(frame.status || "planned")}</span>
        </div>
      `;
      return `
        <div class="frame-card ${frame.path ? "is-ready" : "is-planned"}">
          ${visual}
          <div>
            <strong>${escapeHtml(frame.label)}</strong>
            <span>${escapeHtml(frame.status || "")}</span>
            <p>${escapeHtml(frame.intent || "")}</p>
          </div>
        </div>
      `;
    }).join("");
    const risk = shot.riskNotes ? `<span class="risk-chip">WATCH</span>` : "";
    const characterReferences = (shot.characterReferenceAssets || []).map((ref) => `
      <a href="${ref.asset}" target="_blank" rel="noreferrer">
        <strong>${escapeHtml(ref.name)}</strong>
        <span>${escapeHtml(ref.asset)}</span>
      </a>
    `).join("");
    const qaChecks = (shot.productionQaChecks || []).map((check) => `
      <li>${escapeHtml(check)}</li>
    `).join("");
    const primaryFrameIntent = shot.productionFrameIntent || shot.keyFrameIntent || "待补";
    const subframes = (shot.subframes || []).map((subframe) => `
      <div class="subframe-row">
        <div>
          <strong>${escapeHtml(subframe.id)} ${escapeHtml(subframe.title)}</strong>
          <p>${escapeHtml(subframe.description)}</p>
        </div>
        ${subframe.output_keyframe
          ? `<a href="${subframe.output_keyframe}" target="_blank" rel="noreferrer">${escapeHtml(subframe.output_keyframe)}</a>`
          : `<span class="planned-output">${escapeHtml(subframe.output_status || "planned")} ${escapeHtml(subframe.planned_output_keyframe || "")}</span>`}
      </div>
    `).join("");
    return `
      <article class="storyboard-card">
        ${still}
        <div class="storyboard-body">
          <div class="storyboard-title">
            <div>
              <p class="eyebrow">${shot.act.replaceAll("_", " ")}</p>
              <h3>${shot.shot} - ${shot.title}</h3>
            </div>
            ${risk}
          </div>
          <dl class="storyboard-meta">
            <div><dt>源片</dt><dd>${shot.sourceRef || ""}</dd></div>
            <div><dt>优先</dt><dd>${shot.priority || ""}</dd></div>
            <div><dt>时长</dt><dd>${shot.durationZh || shot.duration || ""}</dd></div>
            <div><dt>版本</dt><dd>${shot.cinematicBlock || ep02Storyboard.productionMode || ""}</dd></div>
            <div><dt>生产</dt><dd>${shot.productionStatus || "未入队"}</dd></div>
            <div><dt>展示</dt><dd>${shot.displayImageSource || ""}</dd></div>
            <div><dt>QA</dt><dd>${shot.productionQaStatus || shot.displayImageStatus || ""}</dd></div>
            <div><dt>Payload</dt><dd>${shot.payloadProductionStatus || ""}</dd></div>
            <div><dt>生产优先</dt><dd>${shot.productionPriority || shot.priority || ""}</dd></div>
            <div><dt>场景</dt><dd>${shot.scene || ""}</dd></div>
            <div><dt>目的</dt><dd>${shot.purposeZh || ""}</dd></div>
            <div><dt>画面</dt><dd>${shot.visual || ""}</dd></div>
            <div><dt>镜头</dt><dd>${shot.cameraZh || shot.camera || ""}</dd></div>
            <div><dt>对白</dt><dd>${shot.shotDialogue || "无"}</dd></div>
            <div><dt>关键</dt><dd>${escapeHtml(primaryFrameIntent)}</dd></div>
            <div><dt>帧关联</dt><dd>${escapeHtml(shot.startKeyAssociation || "")}</dd></div>
            <div class="asset-line"><dt>地点</dt><dd>${shot.locationAsset || ""}</dd></div>
            <div class="asset-line"><dt>角色</dt><dd>${shot.characters || ""}</dd></div>
            <div class="asset-line"><dt>输出</dt><dd>${shot.outputNeeded || ""}</dd></div>
            <div class="asset-line"><dt>产出帧</dt><dd>${shot.productionKeyframePath || ""}</dd></div>
            <div class="asset-line"><dt>目标首帧</dt><dd>${shot.payloadProductionImagePath || shot.productionStartFramePath || ""}</dd></div>
            <div class="asset-line"><dt>阻断源</dt><dd>${shot.payloadBlockedSourceImagePath || ""}</dd></div>
            <div class="asset-line"><dt>Prompt</dt><dd>${shot.payloadProductionPromptFile || ""}</dd></div>
            <div><dt>风险</dt><dd>${shot.riskNotes || "无"}</dd></div>
          </dl>
          <details class="reference-details">
            <summary>生产 QA</summary>
            <div class="qa-panel">
              <p>${escapeHtml(shot.productionQaStatus || shot.displayImageStatus || "未记录")}</p>
              <ul>${qaChecks || `<li>暂无 QA 检查条目。</li>`}</ul>
            </div>
          </details>
          <details class="reference-details">
            <summary>历史关键描述</summary>
            <div class="legacy-frame-note">
              <p>${escapeHtml(shot.keyFrameIntent || "暂无历史描述。")}</p>
            </div>
          </details>
          <details class="reference-details">
            <summary>人物资产锁定</summary>
            <div class="reference-grid">
              ${characterReferences || `<p class="empty-inline">暂无人物参考资产。</p>`}
            </div>
          </details>
          <details class="subframe-details">
            <summary>子分镜 / 电影节奏</summary>
            <div class="subframe-list">
              ${subframes || `<p class="empty-inline">暂无子分镜。</p>`}
            </div>
          </details>
          <details class="continuity-details">
            <summary>电影连续性</summary>
            <dl class="continuity-list">
              <div><dt>入点</dt><dd>${escapeHtml(shot.transitionIn || "")}</dd></div>
              <div><dt>出点</dt><dd>${escapeHtml(shot.transitionOut || "")}</dd></div>
              <div><dt>轴线</dt><dd>${escapeHtml(shot.screenDirectionRule || "")}</dd></div>
              <div><dt>声桥</dt><dd>${escapeHtml(shot.audioBridge || "")}</dd></div>
              <div><dt>余量</dt><dd>${shot.editorialHandlesSeconds ? `${shot.editorialHandlesSeconds} 秒` : ""}</dd></div>
            </dl>
          </details>
          <details class="script-details">
            <summary>对应剧本</summary>
            <p class="script-scene-title">${escapeHtml(shot.scriptSceneTitle || "未映射")}</p>
            <div class="script-block">${multiline(shot.scriptSceneBody || shot.scriptSceneExcerpt || "")}</div>
          </details>
          <details class="prompt-details">
            <summary>AI生成提示词</summary>
            <div class="prompt-grid">
              <div>
                <h4>Execution Prompt</h4>
                <p>${multiline(shot.generationPrompt || shot.videoPrompt || "")}</p>
              </div>
              <div>
                <h4>Camera</h4>
                <p>${multiline(shot.camera || shot.cameraZh || "")}</p>
              </div>
              <div class="avoid">
                <h4>Negative Prompt / Avoid</h4>
                <p>${multiline(shot.negativePrompt || shot.avoid || "")}</p>
              </div>
              <div>
                <h4>Key Frame Prompt</h4>
                <p>${multiline(shot.keyFramePrompt || "")}</p>
              </div>
            </div>
          </details>
          <div class="frame-strip">${frameStrip}</div>
          ${shot.still ? `<a class="path" href="${shot.still}" target="_blank" rel="noreferrer">${shot.still}</a>` : ""}
        </div>
      </article>
    `;
  }).join("") : `<p class="empty">没有匹配的 EP02 分镜。</p>`;
}

function renderDocs() {
  els.docsList.innerHTML = data.documents.map(([title, path]) => `
    <a class="doc-row" href="${path}" target="_blank" rel="noreferrer">
      <strong>${title}</strong>
      <span>${path}</span>
    </a>
  `).join("");
}

function setView(view) {
  state.view = view;
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("is-active", section.id === `${view}View`);
  });
}

function openPreview(path, title) {
  els.previewImage.src = path;
  els.previewImage.alt = title;
  els.previewTitle.textContent = title;
  els.previewPath.textContent = path;
  els.dialog.showModal();
}

function switchCharacterVariant(button) {
  const card = button.closest(".character-card");
  if (!card) return;
  const path = button.dataset.variantPath;
  const label = button.dataset.variantLabel;
  const title = `${card.querySelector("h3")?.textContent || ""} / ${card.dataset.characterId} / ${label}`;
  const imageButton = card.querySelector(".image-button");
  const image = card.querySelector(".image-button img");
  const pathLink = card.querySelector(".path");
  const activeEra = card.querySelector(".active-era");

  imageButton.dataset.preview = path;
  imageButton.dataset.title = title;
  imageButton.dataset.path = path;
  image.src = path;
  image.alt = title;
  image.dataset.path = path;
  pathLink.href = path;
  pathLink.textContent = path;
  activeEra.textContent = label;

  card.querySelectorAll(".variant-chip").forEach((chip) => {
    chip.classList.toggle("is-active", chip === button);
  });
}

fillSelect(els.faction, uniqueOptions(characters, "faction", factionNames));
fillSelect(els.era, uniqueOptions(characters, "era", eraNames));
fillStoryboardFilters();
renderCharacters();
renderEpisode();
renderStoryboard();
renderDocs();

document.addEventListener("error", (event) => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement) || !img.dataset.path) return;
  img.closest(".image-button").innerHTML = imageErrorTemplate(img.dataset.path);
}, true);

els.search.addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLowerCase();
  renderCharacters();
  renderEpisode();
  renderStoryboard();
});
els.faction.addEventListener("change", (event) => {
  state.faction = event.target.value;
  renderCharacters();
});
els.era.addEventListener("change", (event) => {
  state.era = event.target.value;
  renderCharacters();
});
els.status.addEventListener("change", (event) => {
  state.status = event.target.value;
  renderCharacters();
});
els.storyboardEpisode.addEventListener("change", (event) => {
  state.storyboardEpisode = event.target.value;
  state.storyboardScene = "all";
  fillStoryboardSceneFilter();
  renderStoryboard();
});
els.storyboardScene.addEventListener("change", (event) => {
  state.storyboardScene = event.target.value;
  renderStoryboard();
});
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.view));
});
document.addEventListener("click", (event) => {
  const variantButton = event.target.closest(".variant-chip");
  if (variantButton) {
    switchCharacterVariant(variantButton);
    return;
  }
  const sceneFilterButton = event.target.closest("[data-scene-filter]");
  if (sceneFilterButton) {
    state.storyboardScene = sceneFilterButton.dataset.sceneFilter;
    els.storyboardScene.value = state.storyboardScene;
    renderStoryboard();
    return;
  }
  const button = event.target.closest("[data-preview]");
  if (!button) return;
  openPreview(button.dataset.preview, button.dataset.title);
});
document.querySelector("#closeDialog").addEventListener("click", () => els.dialog.close());
els.dialog.addEventListener("click", (event) => {
  if (event.target === els.dialog) els.dialog.close();
});
