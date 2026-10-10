const data = window.ASSET_REVIEW_DATA || { characters: [], episodeAssets: [], docs: [] };

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
  storyboardScene: "第09场：学级模拟战"
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
  kakeyaStats: document.querySelector("#kakeyaStats"),
  kakeyaPanel: document.querySelector("#kakeyaPanel"),
  supportComedyStats: document.querySelector("#supportComedyStats"),
  supportComedyLinks: document.querySelector("#supportComedyLinks"),
  supportSeriesList: document.querySelector("#supportSeriesList"),
  supportPackageSelect: document.querySelector("#supportPackageSelect"),
  supportPackageOpen: document.querySelector("#supportPackageOpen"),
  supportComedyGrid: document.querySelector("#supportComedyGrid"),
  docsList: document.querySelector("#docsList"),
  protocolNotice: document.querySelector("#protocolNotice"),
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
const ep03Storyboard = window.EP03_STORYBOARD_DATA || { shots: [], blockContactSheets: [] };
const supportComedy = window.SUPPORT_COMEDY_DATA || { packages: [] };
const kakeyaSpecial = {
  id: "KAK-BYLETH-LECTURE",
  title: "女贝老师二维挂谷专题",
  status: "一次性全时长生产包，待 AI 生成与生成后 QA",
  viewer: "specials/kakeya_byleth_lecture/delivery/real_frame_preview_kakeya_byleth_2026-07-28/asset_viewer.html",
  costumePreview: "specials/kakeya_byleth_lecture/delivery/costume_corrected_preview_2026-08-05/asset_viewer.html",
  fullVideoQueue: "specials/kakeya_byleth_lecture/delivery/one_pass_full_video_handoff_kakeya_byleth_2026-07-31/full_video_queue_viewer.html",
  fullVideoRunbook: "specials/kakeya_byleth_lecture/delivery/one_pass_full_video_handoff_kakeya_byleth_2026-07-31/RUNBOOK.md",
  fullVideoExecutionPlan: "specials/kakeya_byleth_lecture/delivery/one_pass_full_video_handoff_kakeya_byleth_2026-07-31/execution_plan.json",
  fullVideoPayload: "specials/kakeya_byleth_lecture/delivery/one_pass_full_video_handoff_kakeya_byleth_2026-07-31/submission_payload.jsonl",
  motionQueue: "specials/kakeya_byleth_lecture/delivery/motion_probe_handoff_kakeya_byleth_2026-07-31/motion_queue_viewer.html",
  proxyAnimatic: "specials/kakeya_byleth_lecture/delivery/motion_probe_handoff_kakeya_byleth_2026-07-31/proxy_animatic_viewer.html",
  proxyAnimaticVideo: "specials/kakeya_byleth_lecture/delivery/motion_probe_handoff_kakeya_byleth_2026-07-31/proxy_motion_animatic.mp4",
  motionRunbook: "specials/kakeya_byleth_lecture/delivery/motion_probe_handoff_kakeya_byleth_2026-07-31/RUNBOOK.md",
  motionExecutionPlan: "specials/kakeya_byleth_lecture/delivery/motion_probe_handoff_kakeya_byleth_2026-07-31/execution_plan.json",
  projectRoot: "specials/kakeya_byleth_lecture/",
  promptManifest: "specials/kakeya_byleth_lecture/real_video_prompts/real_video_prompt_manifest.json",
  deliveryManifest: "specials/kakeya_byleth_lecture/production_system/video_delivery_manifest.json",
  script: "specials/kakeya_byleth_lecture/voiceover_dialogue_script.md",
  proofNotes: "specials/kakeya_byleth_lecture/proof_notes_freshman_level.md",
  qaReport: "specials/kakeya_byleth_lecture/production_system/reviews/full_image_script_math_qa_2026-07-31.md",
  review: "specials/kakeya_byleth_lecture/production_system/reviews/student_interaction_chinese_revision_review_2026-07-29.md",
  contactSheet: "specials/kakeya_byleth_lecture/production_system/reviews/real_frame_contact_sheets_2026-07-28/kakeya_real_frames_contact_sheet_01.jpg",
  shots: 34,
  frames: 102,
  motionProbes: 34,
  probeSeconds: 102,
  fullVideoSeconds: 492,
  students: ["艾黛尔", "莉丝缇亚", "梅尔赛德斯"],
  highlights: [
    ["SH002", "提出问题", "女贝老师：让这把一单位长的训练剑，在地上转过所有方向。最少要多大地方？"],
    ["SH010", "候选受到质疑", "艾黛尔：优雅，不等于最小。我还没听到：为什么不能再小？"],
    ["SH020", "学生质疑", "艾黛尔追问是否还是同一个问题，女贝老师回答：看方向，不看原来的位置。"],
    ["SH032", "名称揭示", "女贝老师：这个问题，叫挂谷针问题。"],
  ],
  dialogueHighlights: [
    ["开场", "女贝老师", "让这把一单位长的训练剑，在地上转过所有方向。最少要多大地方？"],
    ["观众问题", "梅尔赛德斯", "至少要给它一个圆吧？"],
    ["反转触发", "艾黛尔", "优雅，不等于最小。"],
    ["证明追问", "艾黛尔", "但这样还是同一个问题吗？"],
    ["核心回答", "女贝老师", "看方向，不看原来的位置。切分没有删方向。平移没有转方向。"],
    ["收束", "女贝老师", "所以问题不是针。问题是方向。"],
  ],
};
const storyboardEpisodes = [
  {
    id: "EP02",
    label: "EP02",
    title: "EP02 全集分镜",
    data: ep02Storyboard,
  },
  {
    id: "EP03",
    label: "EP03",
    title: "EP03 雾中的叛乱",
    data: ep03Storyboard,
  },
];

const actNames = {
  arrival: "抵达",
  church: "教会",
  houses: "三学级",
  choice: "学级选择",
  classroom: "课堂",
  mock_battle: "学级模拟战",
  epilogue: "尾声",
  ending: "结尾",
};

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

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function rosterChangeEntries(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") {
    return Object.entries(value).map(([name, status]) => ({ name, status, label: status }));
  }
  return [];
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
  const roster = item.rosterAfter || {};
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
    roster.after_shot_note,
    roster.result,
    ...rosterChangeEntries(roster.changed_this_shot).flatMap((entry) => [entry.name, entry.status, entry.label]),
    ...Object.values(roster.active_by_house || {}).flat(),
    ...Object.values(roster.limited_by_house || {}).flat(),
    ...Object.values(roster.retired_or_out_by_house || {}).flat(),
    ...Object.values(roster.defeated_removed_by_house || {}).flat(),
    ...Object.values(roster.captured_objective_defeated_by_house || {}).flat(),
    ...Object.values(roster.stood_down_post_battle_by_house || {}).flat(),
    item.battleLedgerAfter?.no_active_combat_line,
    item.productionKeyframePath,
    item.productionStartFramePath,
    item.payloadProductionStatus,
    item.payloadProductionImagePath,
    item.payloadBlockedSourceImagePath,
    item.payloadProductionPromptFile,
    item.modelReadyPromptFile,
    item.modelReadyNegativePromptFile,
    item.auditPromptFile,
    item.handoffShotMetadataFile,
    item.promptSubmissionRole,
    item.promptSubmissionStatus,
    ...asArray(item.characterReferenceAssets).flatMap((ref) => [ref.name, ref.asset, ref.identityPlate, ref.continuity_note]),
    ...asArray(item.localIdentityPlates).flatMap((plate) => [plate.character_id, plate.asset, plate.plate, plate.status]),
    item.localVideoSourceEvidencePath,
    item.sourceTimecodeAudit,
    item.sourceMatch,
    item.sourceAdaptationGap,
    ...asArray(item.identityLockedRegenFrameSet).flatMap((frame) => [frame.role, frame.label, frame.path, frame.status, frame.intent]),
    item.identityLockedRegenReviewPath,
    item.identityLockedRegenReviewMdPath,
    item.videoPromptV2QaPath,
    item.videoPromptQaDecision,
    item.motionProbeStatus,
    item.motionProbePlanPath,
    item.videoPromptV2Path,
    item.negativePromptV2Path,
    ...asArray(item.subframes).flatMap((subframe) => [subframe.id, subframe.title, subframe.description, subframe.output_keyframe]),
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
  const match = String(title || "").match(/^(?:Scene\s+|第)(\d+)/);
  return match ? Number(match[1]) : 999;
}

function localizedSceneTitle(title) {
  const raw = String(title || "").trim();
  const match = raw.match(/^Scene\s+(\d+)\s*[-:：]\s*(.+)$/i);
  if (match) {
    return `第${String(Number(match[1])).padStart(2, "0")}场：${match[2].trim()}`;
  }
  return raw.replace(/^(第\d+场)\s*-\s*/, "$1：");
}

function localizedShotCode(shot) {
  const match = String(shot || "").match(/^Shot(\d+[A-Z]?)$/);
  return match ? `镜头${match[1]}` : String(shot || "");
}

function localizedAct(act) {
  return actNames[act] || String(act || "").replaceAll("_", " ");
}

function storyboardShotTitle(shot) {
  const code = localizedShotCode(shot.shot);
  const title = shot.titleZh || shot.title || "";
  return title ? `${code}：${title}` : code;
}

function localizedFrameLabel(label, role) {
  const raw = String(label || role || "").trim();
  const normalized = raw.toLowerCase().replace(/[_-]/g, " ");
  const map = {
    start: "起始帧",
    "start frame": "起始帧",
    key: "关键帧",
    "key frame": "关键帧",
    end: "结束帧",
    "end frame": "结束帧",
  };
  return map[normalized] || raw;
}

function localizedSubframeTitle(title) {
  return String(title || "")
    .replace(/\bStart Frame\b/gi, "起始帧")
    .replace(/\bKey Frame\b/gi, "关键帧")
    .replace(/\bEnd Frame\b/gi, "结束帧")
    .replace(/\bShot\s*(\d+[A-Z]?)\b/gi, "镜头$1");
}

function buildSceneGroups(shots) {
  const groups = new Map();
  for (const shot of shots) {
    const key = localizedSceneTitle(shot.scriptSceneTitle || "未映射");
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

function formatRosterByHouse(groups) {
  return Object.entries(groups || {})
    .filter(([, names]) => Array.isArray(names) && names.length)
    .map(([house, names]) => `
      <li><strong>${escapeHtml(house)}</strong>: ${escapeHtml(names.join(", "))}</li>
    `).join("");
}

const battleStatusLabels = {
  active: "仍在指挥",
  active_available: "仍可行动",
  active_flanker: "侧翼仍可行动",
  captured_by_felix_and_ashe: "被菲力克斯与亚修压制退场",
  captured_by_leonie_and_claude: "被库罗德与雷欧妮压制退场",
  captor_active: "完成压制后仍可行动",
  defeated_by_route_block: "路线被封，判定退场",
  displaced: "被迫换位但未退场",
  displaced_but_active: "被迫换位但未退场",
  engaged: "交战中",
  objective_defeated_off_sigil: "教师目标离开治疗纹，判定被切断",
  objective_defeated_separate_lane: "独立教师目标被切断",
  objective_suppressed: "教师目标施法角度被压制",
  pressured: "受压但未退场",
  pressured_but_active: "受压但未退场",
  restored_angle: "重新取得掩护角度",
  restored_frontline: "回到盾线",
  route_cut: "回线被切断",
  route_cut_offscreen_unpaired: "离画回线被切断，未与汉尼曼同框",
  spent_after_heal: "治疗后耗尽，转入退场/赛后位",
  spent_stood_down: "完成任务后主动收势退场",
  stood_down_defeated_house: "学级败局已定，按哨声收势退场",
  surviving_command: "指挥者存活",
  surviving_winner: "胜方仍在场",
  surviving_winner_exhausted: "胜方筋疲力尽但仍在场",
};

function battleStatusLabel(value) {
  const key = String(value || "").trim();
  return battleStatusLabels[key] || key.replaceAll("_", " ");
}

function countGroupedNames(groups) {
  return Object.values(groups || {}).reduce((sum, names) => sum + (Array.isArray(names) ? names.length : 0), 0);
}

function formatBattleEventList(events) {
  return events.map((entry) => `
    <li><strong>${escapeHtml(entry.name)}</strong><span>${escapeHtml(battleStatusLabel(entry.label || entry.status))}</span></li>
  `).join("");
}

function battleLedgerEventTemplate(ledger) {
  if (!ledger || !ledger.shot) return "";
  const changed = rosterChangeEntries(ledger.changed_this_shot);
  const activeCount = countGroupedNames(ledger.active_by_house);
  const limitedCount = countGroupedNames(ledger.limited_by_house);
  const defeatedCount = countGroupedNames(ledger.defeated_removed_by_house);
  const objectiveCount = countGroupedNames(ledger.captured_objective_defeated_by_house);
  const stoodDownCount = countGroupedNames(ledger.stood_down_post_battle_by_house);
  return `
    <section class="battle-event-panel" aria-label="本镜头战斗事件">
      <div class="battle-event-head">
        <strong>本镜头事件</strong>
        <span>${changed.length ? `${changed.length} 个状态变化` : "无新增退场"}</span>
      </div>
      <ul class="battle-event-list">
        ${changed.length ? formatBattleEventList(changed) : "<li><strong>连续性</strong><span>阵容状态延续上一镜头</span></li>"}
      </ul>
      <dl class="battle-event-counts">
        <div><dt>仍可行动</dt><dd>${activeCount}</dd></div>
        <div><dt>受限</dt><dd>${limitedCount}</dd></div>
        <div><dt>已退场</dt><dd>${defeatedCount}</dd></div>
        <div><dt>目标压制</dt><dd>${objectiveCount}</dd></div>
        <div><dt>赛后收势</dt><dd>${stoodDownCount}</dd></div>
      </dl>
      ${ledger.no_active_combat_line && ledger.no_active_combat_line !== "none"
        ? `<p class="battle-lock">不得重新上前线：${escapeHtml(ledger.no_active_combat_line)}</p>`
        : ""}
    </section>
  `;
}

function shotReadinessChipsTemplate(shot) {
  const frameCount = (shot.frameSet || []).filter((frame) => frame && frame.path).length;
  const promptReady = Boolean(
    (shot.modelReadyPromptFile && shot.modelReadyNegativePromptFile) ||
    (shot.promptPath && shot.negativePromptPath)
  );
  const ledgerReady = Boolean(shot.battleLedgerAfter || shot.rosterAfter);
  const ledgerNotApplicable = shot.battleLedgerApplicability === "not_applicable";
  const qaText = String(shot.productionQaStatus || shot.displayImageStatus || "未记录");
  const qaPassed = /pass|passed|qa_passed/i.test(qaText);
  const clipReady = Boolean(shot.clipPath || shot.generatedClip || shot.expectedClipExists);
  const chips = [
    { label: `三帧 ${Math.min(frameCount, 3)}/3`, state: frameCount >= 3 ? "ok" : "warn" },
    { label: promptReady ? "Prompt OK" : "Prompt 缺失", state: promptReady ? "ok" : "warn" },
    {
      label: ledgerReady ? "账本 OK" : ledgerNotApplicable ? "账本 N/A" : "账本缺失",
      state: ledgerReady ? "ok" : ledgerNotApplicable ? "pending" : "warn",
    },
    { label: qaPassed ? "图审通过" : `图审 ${qaText}`, state: qaPassed ? "ok" : "monitor" },
    { label: clipReady ? "视频已回收" : "视频待生成", state: clipReady ? "ok" : "pending" },
  ];
  return `
    <div class="shot-readiness-chips" aria-label="${escapeHtml(`${localizedShotCode(shot.shot)} 可送视频状态`)}">
      ${chips.map((chip) => `<span class="readiness-chip is-${chip.state}">${escapeHtml(chip.label)}</span>`).join("")}
    </div>
  `;
}

function scene09ShotDomId(shot) {
  return `scene09-${String(shot || "").replace(/[^A-Za-z0-9_-]+/g, "-")}`;
}

const operatorActionLabels = {
  revise_critical_reaudit_blockers: "下一步：重做重审阻断镜头",
  continue_rebuilding_blocked_storyboard_frames: "下一步：继续重做阻断镜头",
  submit_motion_probes: "下一步：提交 3 秒运动探针",
  submit_full_duration_batches: "下一步：提交全时长批次",
  run_local_video_cli: "下一步：运行本地视频 CLI",
  unknown: "下一步：待确认",
};

const operatorPhaseLabels = {
  critical_reaudit_blocked: "全场视觉重审阻断",
  critical_reaudit_rebuild_in_progress: "全场视觉重审阻断 · 重做进行中",
  clips_pending: "真实视频待生成",
  probe_review_pending: "探针审片待完成",
  ready_for_concat: "等待合成",
  complete: "已完成",
  unknown: "状态未知",
};

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (!Number.isFinite(value) || value <= 0) return "大小未知";
  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function operatorStatusTemplate(status) {
  if (!status || !status.next_action) return "";
  const counts = status.counts || {};
  const gates = status.gates || {};
  const playableProbeClips = Number(counts.playable_probe_clips || 0);
  const expectedProbeClips = Number(counts.expected_probe_clips || 0);
  const readyFullDurationClips = Number(counts.ready_full_duration_clips || 0);
  const expectedFullDurationClips = Number(counts.expected_full_duration_clips || 0);
  const completionPassedChecks = Number(counts.completion_passed_checks || 0);
  const completionTotalChecks = Number(counts.completion_total_checks || 0);
  const criticalBlockedShots = Number(counts.critical_blocked_shots || 0);
  const rebuiltPendingReviewShots = Number(counts.rebuilt_pending_review_shots || 0);
  const handoffControl = status.handoff_control_reports_audit || {};
  const handoffControlChecked = Number(handoffControl.required_reports_checked || 0);
  const handoffControlDeclared = Number(handoffControl.declared_required_reports || 0);
  const handoffControlPassed = handoffControl.decision === "handoff_control_reports_audit_passed";
  const probeSubmissionReady = gates.motion_probe_submission_ready_gate === "motion_probe_submission_ready";
  const blockers = (status.blocking_items || [])
    .filter((item) => item && item.active !== false)
    .slice(0, 3);
  const commands = (status.operator_commands || [])
    .filter(Boolean)
    .slice(0, 6);
  const zipBatches = (status.motion_probe_zip_batches || [])
    .filter((batch) => batch && batch.zip)
    .slice(0, 7);
  const returnBatches = (status.motion_probe_return_batches || [])
    .filter((batch) => batch && batch.return_dir)
    .slice(0, 7);
  return `
    <section class="operator-next-panel" aria-label="Scene09 生产下一步">
      <div>
        <p class="eyebrow">Scene09 生产下一步</p>
        <h3>${escapeHtml(operatorActionLabels[status.next_action] || status.next_action)}</h3>
        <p>${escapeHtml(operatorPhaseLabels[status.current_phase] || status.current_phase || "状态未知")} · 探针提交预检${probeSubmissionReady ? "已通过" : "待确认"} · 交接控制${handoffControlPassed ? ` ${handoffControlChecked}/${handoffControlDeclared}` : "未通过"} · 全时长${status.can_submit_full_duration ? "可提交" : "未放行"}</p>
      </div>
      <dl class="operator-next-stats">
        <div><dt>探针</dt><dd>${playableProbeClips}/${expectedProbeClips}</dd></div>
        <div><dt>全时长</dt><dd>${readyFullDurationClips}/${expectedFullDurationClips}</dd></div>
        <div><dt>放行</dt><dd>${status.can_submit_full_duration ? "可提交" : "未放行"}</dd></div>
        <div><dt>本地CLI</dt><dd>${status.can_run_local_cli ? "可运行" : "未配置"}</dd></div>
        <div><dt>交接</dt><dd>${handoffControlPassed ? `${handoffControlChecked}/${handoffControlDeclared}` : "未通过"}</dd></div>
        <div><dt>完成</dt><dd>${completionTotalChecks ? `${completionPassedChecks}/${completionTotalChecks}` : "待审计"}</dd></div>
        <div><dt>重做待审</dt><dd>rebuilt_pending_review=${rebuiltPendingReviewShots}</dd></div>
        <div><dt>仍阻断</dt><dd>blocked=${criticalBlockedShots}</dd></div>
      </dl>
      ${blockers.length ? `
        <ul class="operator-blockers">
          ${blockers.map((item) => `<li><strong>${escapeHtml(item.id || "blocker")}</strong><span>${escapeHtml(item.detail || item.evidence || "")}</span></li>`).join("")}
        </ul>
      ` : ""}
      ${(commands.length || zipBatches.length || returnBatches.length) ? `
        <details class="operator-production-details">
          <summary>制作后台：命令 / Zip / 回收目录</summary>
          ${commands.length ? `
            <div class="operator-command-panel">
              <strong>操作命令</strong>
              <ol>
                ${commands.map((command) => `<li><code>${escapeHtml(command)}</code></li>`).join("")}
              </ol>
            </div>
          ` : ""}
          ${zipBatches.length ? `
            <div class="operator-zip-panel">
              <strong>探针 Zip 批次</strong>
              <div class="operator-zip-list">
                ${zipBatches.map((batch) => `
                  <a href="${escapeHtml(batch.zip)}" target="_blank" rel="noreferrer">
                    <span>${escapeHtml(batch.batch_id || `probe_batch_${batch.index || ""}`)}</span>
                    <small>${escapeHtml(batch.shot_range || "镜头范围待确认")} · ${escapeHtml(String(batch.rows || 0))} 镜头 · ${escapeHtml(formatBytes(batch.bytes))}</small>
                  </a>
                `).join("")}
              </div>
            </div>
          ` : ""}
          ${returnBatches.length ? `
            <div class="operator-return-panel">
              <strong>探针回收目录</strong>
              <div class="operator-return-list">
                ${returnBatches.map((batch) => `
                  <div>
                    <a href="${escapeHtml(batch.return_dir)}" target="_blank" rel="noreferrer">${escapeHtml(batch.batch_id || `probe_batch_${batch.index || ""}`)}_returns/returned_mp4</a>
                    <span>${escapeHtml(batch.shot_range || "镜头范围待确认")} · 已有 ${escapeHtml(String(batch.returned_mp4_count || 0))}/${escapeHtml(String(batch.expected_probe_clips || 0))} mp4</span>
                    <code>${escapeHtml(batch.dry_run_command || "")}</code>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ""}
        </details>
      ` : ""}
    </section>
  `;
}

function storyboardAnchor(path, label) {
  return path ? `<a href="${escapeHtml(path)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>` : "";
}

function storyboardPreviewButton(path, label, title = label) {
  return path
    ? `<button class="text-button" type="button" data-preview="${escapeHtml(path)}" data-title="${escapeHtml(title)}" data-path="${escapeHtml(path)}">${escapeHtml(label)}</button>`
    : "";
}

function storyboardLinkSection(title, links, options = {}) {
  const body = links.filter(Boolean).join("");
  if (!body) return "";
  const open = options.open ? " open" : "";
  const note = options.note ? `<p>${escapeHtml(options.note)}</p>` : "";
  return `
    <details class="storyboard-link-section"${open}>
      <summary>${escapeHtml(title)}</summary>
      ${note}
      <div class="storyboard-link-group">${body}</div>
    </details>
  `;
}

function storyboardLinksTemplate(episodeData, episode) {
  const primaryScene09Links = [
    storyboardAnchor(episodeData.mockBattleRebuildV2Gallery, "Scene09 图审面板"),
    storyboardAnchor(episodeData.mockBattleShootingScriptV2, "Scene09 拍摄剧本"),
    storyboardAnchor(episodeData.mockBattleShotListV2, "Scene09 分镜表"),
    storyboardAnchor(episodeData.mockBattleRebuildV2Prompts, "Scene09 视频提示词"),
    storyboardAnchor(episodeData.mockBattleRosterContinuity, "Scene09 存活/退场账本"),
    storyboardAnchor(episodeData.mockBattleBattleLedgerTimeline, "Scene09 战斗状态时间线"),
    storyboardAnchor(episodeData.mockBattleWeaponFacingAudit, "Scene09 武器/朝向审核"),
    storyboardAnchor(episodeData.mockBattleManualImageReview, "Scene09 本地图审"),
    storyboardAnchor(episodeData.mockBattlePerFrameVisualReviewMatrix, "Scene09 逐帧图审矩阵"),
  ];
  const scene09ReviewBackstage = [
    storyboardAnchor(episodeData.mockBattleProductionKeyframes, "关键帧生产队列"),
    storyboardAnchor(episodeData.mockBattleSubframePlan, "子分镜计划"),
    storyboardAnchor(episodeData.mockBattleP0ReferenceBoards, "P0 人物参考板"),
    storyboardAnchor(episodeData.mockBattleScriptShootabilityAudit, "可拍性审核"),
    storyboardAnchor(episodeData.mockBattleRebuildV2Qa, "重建版 QA"),
    storyboardAnchor(episodeData.mockBattleRosterContinuityJson, "Roster JSON"),
    storyboardAnchor(episodeData.mockBattleBattleLedgerTimelineJson, "战斗状态 JSON"),
    storyboardAnchor(episodeData.mockBattlePerFrameVisualReviewMatrixJson, "逐帧审核 JSON"),
    storyboardAnchor(episodeData.mockBattleWebBattleEventPanelAudit, "Web 战斗事件审计"),
    storyboardAnchor(episodeData.mockBattleV2LogicPrevisReview, "P0 预演审查"),
    storyboardAnchor(episodeData.mockBattleFullRebuildScope, "全量重建范围"),
    storyboardAnchor(episodeData.mockBattleAuditSynthesis, "审核合成"),
    storyboardAnchor(episodeData.mockBattleSecondaryVisualQa, "二次视觉 QA"),
    storyboardAnchor(episodeData.mockBattleCreativeLogicAudit, "创作复审"),
    storyboardAnchor(episodeData.mockBattleDirectionContinuity, "朝向连续性"),
    storyboardAnchor(episodeData.mockBattlePreVideoDeepAudit, "视频前深审计"),
    storyboardAnchor(episodeData.mockBattleCharacterOutcomeExitPlan, "角色退场账本"),
    storyboardAnchor(episodeData.mockBattleVideoPreflight, "视频预检包"),
    storyboardAnchor(episodeData.mockBattleAnimaticTiming, "Animatic"),
    storyboardAnchor(episodeData.mockBattleDialoguePerformance, "对白表演"),
    storyboardAnchor(episodeData.mockBattleVideoFailureCriteria, "视频失败标准"),
  ];
  const productionBackstage = [
    storyboardAnchor(episodeData.mockBattleMotionProbeProviderIndex, "探针提交包优先"),
    storyboardAnchor(episodeData.mockBattleMotionProbeProviderReadme, "探针提交说明"),
    storyboardAnchor(episodeData.mockBattleMotionProbeSubmissionManifest, "探针提交清单"),
    storyboardAnchor(episodeData.mockBattleMotionProbeSubmissionManifestJson, "探针提交清单 JSON"),
    storyboardAnchor(episodeData.mockBattleMotionProbeSubmissionManifestCsv, "探针提交清单 CSV"),
    storyboardAnchor(episodeData.mockBattleMotionProbeUploadPackReadme, "探针上传包"),
    storyboardAnchor(episodeData.mockBattleMotionProbeUploadPackManifest, "探针上传包 JSON"),
    storyboardAnchor(episodeData.mockBattleMotionProbeUploadPackCsv, "探针上传包 CSV"),
    storyboardAnchor(episodeData.mockBattleMotionProbeUploadPackReturnDirs, "探针上传包回收目录"),
    storyboardAnchor(episodeData.mockBattleMotionProbeOperatorTracker, "探针提交/回收追踪表"),
    storyboardAnchor(episodeData.mockBattleMotionProbeOperatorTrackerJson, "探针追踪 JSON"),
    storyboardAnchor(episodeData.mockBattleMotionProbeOperatorTrackerCsv, "探针追踪 CSV"),
    storyboardAnchor(episodeData.mockBattleMotionProbeOperatorTrackerAudit, "探针追踪审核"),
    storyboardAnchor(episodeData.mockBattleMotionProbeOperatorTrackerAuditJson, "探针追踪审核 JSON"),
    storyboardAnchor(episodeData.mockBattleHandoffControlReportsAudit, "交接控制报告审核"),
    storyboardAnchor(episodeData.mockBattleHandoffControlReportsAuditJson, "交接控制报告 JSON"),
    storyboardAnchor(episodeData.mockBattleMotionProbeReturnIntake, "探针回收入口"),
    storyboardAnchor(episodeData.mockBattleMotionProbeReturnMap, "探针回收映射"),
    storyboardAnchor(episodeData.mockBattleProviderUploadBundlesReadme, "全时长提交包（需放行）"),
    storyboardAnchor(episodeData.mockBattleProviderReturnContract, "全时长返回命名规则"),
    storyboardAnchor(episodeData.mockBattleClipReturnIntake, "全时长回收入口"),
    storyboardAnchor(episodeData.mockBattleClipReturnMap, "全时长回收映射"),
    storyboardAnchor(episodeData.mockBattleOperatorNextSteps, "下一步操作"),
    storyboardAnchor(episodeData.mockBattleOperatorNextStepsJson, "下一步 JSON"),
    storyboardAnchor(episodeData.mockBattleMonitorHandoffIndex, "Monitor Handoff"),
  ];
  const episodeBackstage = [
    storyboardAnchor(episodeData.reviewHtml, episodeData.reviewLabel || "打开全片接触表"),
    storyboardAnchor(episodeData.timeline, "Cinematic V2 时间线"),
    storyboardAnchor(episodeData.continuityBrief, "电影连续性通告"),
    storyboardAnchor(episodeData.distanceContinuityLedger, "EP03 距离/站位账本"),
    storyboardAnchor(episodeData.runbook, "V2 生产 Runbook"),
    storyboardAnchor(episodeData.completeScriptShotAssetPackageViewer, "EP03 完整剧本+镜头资产包"),
    storyboardAnchor(episodeData.completeScriptShotAssetPackageReadme, "EP03 完整包 README"),
    storyboardAnchor(episodeData.completeScriptShotAssetPackageManifest, "EP03 完整包 Manifest"),
    storyboardAnchor(episodeData.motionProbePackageViewer, "EP03 3秒 Motion Probe 包"),
    storyboardAnchor(episodeData.motionProbePackageQueueCsv, "EP03 Motion Probe 队列 CSV"),
    storyboardAnchor(episodeData.motionProbePackageQueueJson, "EP03 Motion Probe 队列 JSON"),
    storyboardAnchor(episodeData.motionProbePackageRunbook, "EP03 Motion Probe Runbook"),
    storyboardAnchor(episodeData.motionProbePackageQa, "EP03 Motion Probe QA"),
    storyboardAnchor(episodeData.localAssetStoryboardViewer, "EP03 本地资产审片包"),
    storyboardAnchor(episodeData.localAssetStoryboardPackage, "EP03 本地资产包 README"),
    storyboardAnchor(episodeData.localAssetStoryboardManifest, "EP03 本地资产包 Manifest"),
    storyboardAnchor(episodeData.localAssetStoryboardShotIndex, "EP03 本地资产镜头索引"),
    storyboardAnchor(episodeData.localAssetStoryboardReview, "EP03 本地资产包 QA"),
    storyboardAnchor(episodeData.identityLockedRegenerationViewer, "EP03 身份锁关键帧重做包"),
    storyboardAnchor(episodeData.identityLockedRegenerationManifest, "EP03 重做包 Manifest"),
    storyboardAnchor(episodeData.identityLockedRegenerationQueue, "EP03 重做队列 CSV"),
    storyboardAnchor(episodeData.identityLockedRegenerationRunbook, "EP03 重做 Runbook"),
    storyboardAnchor(episodeData.identityLockedRegenerationPolicy, "EP03 身份锁策略"),
    storyboardAnchor(episodeData.identityLockedRegenerationQa, "EP03 重做 QA"),
    storyboardAnchor(episodeData.localIdentityPlatesViewer, "EP03 本地身份板 Viewer"),
    storyboardAnchor(episodeData.localIdentityPlatesIndex, "EP03 本地身份板 Index"),
    storyboardAnchor(episodeData.localIdentityPlatesMarkdown, "EP03 本地身份板说明"),
    storyboardPreviewButton(episodeData.localIdentityPlatesAtlas, "预览本地身份板 Atlas", "EP03 本地身份板 Atlas"),
    storyboardAnchor(episodeData.localVideoSourceFramesIndex, "EP03 本地录像证据说明"),
    storyboardAnchor(episodeData.localVideoSourceFramesViewer, "EP03 本地录像证据 Viewer"),
    storyboardAnchor(episodeData.localVideoSourceFramesJson, "EP03 本地录像证据 JSON"),
    storyboardAnchor(episodeData.sourceTimecodeAudit, "EP03 源片时间码校准"),
    storyboardAnchor(episodeData.sourceTimeline10sIndex, "EP03 10秒时间码地图"),
    storyboardPreviewButton(episodeData.localVideoSourceCuttedShot3, "预览本地录像证据 Shot3", "EP03 本地原始录像证据 / cutted ep3 shot3"),
    storyboardPreviewButton(episodeData.localVideoSourceP4BlueLions00, "预览本地录像证据 P4", "EP03 本地原始录像证据 / P4 青狮 EP3 [00]"),
  ];
  const previews = [
    storyboardPreviewButton(episodeData.mockBattleV2LogicPrevisContactSheet, "预览 P0 逻辑预演", "Scene09 V2 P0 逻辑预演"),
    storyboardPreviewButton(episodeData.mockBattleBackgroundMaster, "预览战场母版", "Scene09 战场背景母版"),
    storyboardPreviewButton(episodeData.fullContactSheet, "预览总览图", `${episode.label} 全片分镜总览`),
    ...(episodeData.blockContactSheets || []).map(([label, path]) => storyboardPreviewButton(path, label, label)),
  ];
  return `
    <div class="storyboard-link-primary" aria-label="Scene09 核心创作入口">
      ${primaryScene09Links.filter(Boolean).join("")}
      ${previews.filter(Boolean).join("")}
    </div>
    ${storyboardLinkSection("Scene09 更多创作审核资料", scene09ReviewBackstage)}
    ${storyboardLinkSection("Scene09 制作交付后台", productionBackstage, {
      note: "这些是提交、回收、JSON/CSV 和交接校验文件；平时不用展开，只有真正送模型或回收 mp4 时才看。",
    })}
    ${storyboardLinkSection("其他章节/历史资料", episodeBackstage)}
  `;
}

function shotBaseNumber(shot) {
  const match = String(shot || "").match(/^Shot(\d+)/);
  return match ? Number(match[1]) : 0;
}

function isScene09MockBattleSelection(episode, scene, shots) {
  if (episode.id !== "EP02") return false;
  const sceneText = String(scene || "");
  if (sceneText.includes("第09场") || sceneText.includes("学级模拟战")) return true;
  return Boolean(shots.length) && shots.every((shot) => {
    const base = shotBaseNumber(shot.shot);
    return base >= 25 && base <= 36;
  });
}

function rosterDetailsTemplate(roster) {
  if (!roster || !roster.shot) return "";
  const changed = rosterChangeEntries(roster.changed_this_shot)
    .map((entry) => `<span>${escapeHtml(entry.name)}: ${escapeHtml(battleStatusLabel(entry.label || entry.status))}</span>`)
    .join("");
  return `
    <details class="roster-details">
      <summary>本镜头后存活 / 退场状态</summary>
      <div class="qa-panel">
        <p>${escapeHtml(roster.after_shot_note || "")}</p>
        ${roster.result ? `<p>${escapeHtml(roster.result)}</p>` : ""}
        <div class="checks">${changed || "<span>no_change</span>"}</div>
        <dl class="continuity-list">
          <div><dt>仍可行动</dt><dd><ul>${formatRosterByHouse(roster.active_by_house) || "<li>无主动战斗者</li>"}</ul></dd></div>
          <div><dt>受限未退场</dt><dd><ul>${formatRosterByHouse(roster.limited_by_house) || "<li>无</li>"}</ul></dd></div>
          <div><dt>目标压制</dt><dd><ul>${formatRosterByHouse(roster.captured_objective_defeated_by_house) || "<li>无</li>"}</ul></dd></div>
          <div><dt>赛后收势</dt><dd><ul>${formatRosterByHouse(roster.stood_down_post_battle_by_house) || "<li>无</li>"}</ul></dd></div>
          <div><dt>已退场/赛后</dt><dd><ul>${formatRosterByHouse(roster.retired_or_out_by_house) || "<li>无</li>"}</ul></dd></div>
          <div><dt>已判定退场</dt><dd><ul>${formatRosterByHouse(roster.defeated_removed_by_house) || "<li>无</li>"}</ul></dd></div>
        </dl>
      </div>
    </details>
  `;
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
    ["all", "全部场次"],
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
  const payloadPromptCount = shots.filter((shot) => shot.modelReadyPromptFile || shot.generationPrompt).length;
  const continuityCount = shots.filter((shot) => shot.transitionIn || shot.transitionOut || shot.audioBridge).length;
  const keyFrameCount = shots.filter((shot) => (shot.frameSet || []).some((frame) => frame.role === "key" && frame.path)).length;
  const subframeCount = shots.reduce((sum, shot) => sum + (shot.subframes || []).length, 0);
  const referenceLockedCount = shots.filter((shot) => (shot.characterReferenceAssets || []).length).length;
  const localIdentityPlateCount = shots.filter((shot) => (shot.localIdentityPlates || []).length).length;
  const totalSeconds = shots.reduce((sum, shot) => sum + (Number(shot.durationSeconds) || 0), 0);

  els.storyboardStats.innerHTML = `
    <div><strong>${episode.label}</strong><span>当前 EP</span></div>
    <div><strong>${state.storyboardScene === "all" ? sceneGroups.length : 1}</strong><span>当前场次</span></div>
    <div><strong>${shots.length}</strong><span>当前镜头</span></div>
    <div><strong>${visibleStillCount}</strong><span>有首帧</span></div>
    <div><strong>${keyFrameCount}</strong><span>有关键帧图</span></div>
    <div><strong>${subframeCount}</strong><span>子分镜</span></div>
    <div><strong>${referenceLockedCount}</strong><span>人物锁脸</span></div>
    <div><strong>${localIdentityPlateCount}</strong><span>本地身份板</span></div>
    <div><strong>${scriptCount}</strong><span>有剧本映射</span></div>
    <div><strong>${payloadPromptCount || promptCount}</strong><span>有提交提示</span></div>
    <div><strong>${continuityCount}</strong><span>有连续性</span></div>
    <div><strong>${riskCount}</strong><span>有风险备注</span></div>
    <div><strong>${actCount}</strong><span>段落</span></div>
    <div><strong>${formatSeconds(totalSeconds)}</strong><span>估算时长</span></div>
  `;

  els.sceneBoard.innerHTML = state.storyboardScene === "all" && visibleSceneGroups.length ? visibleSceneGroups.map((group) => {
    const groupSeconds = group.items.reduce((sum, shot) => sum + (Number(shot.durationSeconds) || 0), 0);
    const first = group.items[0];
    const last = group.items[group.items.length - 1];
    const stills = group.items
      .filter((shot) => shot.displayImagePath || shot.still)
      .slice(0, 5)
      .map((shot) => {
        const title = storyboardShotTitle(shot);
        return `
        <button class="scene-thumb" type="button" data-preview="${shot.displayImagePath || shot.still}" data-title="${escapeHtml(title)}" data-path="${shot.displayImagePath || shot.still}">
          <img src="${shot.displayImagePath || shot.still}" alt="${escapeHtml(title)}" loading="lazy" data-path="${shot.displayImagePath || shot.still}">
        </button>
      `;
      }).join("");
    return `
      <article class="scene-card">
        <div class="scene-card-head">
          <div>
            <p class="eyebrow">${episode.label}</p>
            <h3>${escapeHtml(group.title)}</h3>
          </div>
          <button class="text-button scene-filter-button" type="button" data-scene-filter="${escapeHtml(group.title)}">只看本场</button>
        </div>
        <dl class="scene-card-meta">
          <div><dt>镜头</dt><dd>${group.items.length}</dd></div>
          <div><dt>范围</dt><dd>${localizedShotCode(first.shot)} - ${localizedShotCode(last.shot)}</dd></div>
          <div><dt>时长</dt><dd>${formatSeconds(groupSeconds)}</dd></div>
        </dl>
        <div class="scene-thumb-strip">${stills || `<span class="empty-inline">暂无首帧</span>`}</div>
      </article>
    `;
  }).join("") : "";

  const isScene09MockBattle = isScene09MockBattleSelection(episode, state.storyboardScene, shots);
  els.storyboardLinks.hidden = isScene09MockBattle;
  els.storyboardLinks.classList.toggle("is-hidden-for-scene09", isScene09MockBattle);
  els.storyboardLinks.innerHTML = isScene09MockBattle ? "" : storyboardLinksTemplate(episodeData, episode);

  const scene09OperatorStatusPanel = isScene09MockBattle ? operatorStatusTemplate(episodeData.mockBattleOperatorStatus) : "";
  els.storyboardGrid.innerHTML = shots.length ? `${scene09OperatorStatusPanel}${shots.map((shot) => {
    const shotTitle = storyboardShotTitle(shot);
    const shotCode = localizedShotCode(shot.shot);
    const displayImage = shot.displayImagePath || shot.still || "";
    const still = displayImage ? `
      <button class="image-button" type="button" data-preview="${displayImage}" data-title="${escapeHtml(shotTitle)}" data-path="${displayImage}">
        <img src="${displayImage}" alt="${escapeHtml(shotTitle)}" loading="lazy" data-path="${displayImage}">
      </button>
    ` : `<div class="storyboard-placeholder">BLACK<br><span>${escapeHtml(shotCode)}</span></div>`;
    const frameCardsFor = (frames) => (frames || []).map((frame) => {
      const frameLabel = localizedFrameLabel(frame.label, frame.role);
      const title = `${shotCode} ${frameLabel}`;
      const visual = frame.path ? `
        <button class="frame-thumb" type="button" data-preview="${frame.path}" data-title="${escapeHtml(title)}" data-path="${frame.path}">
          <img src="${frame.path}" alt="${escapeHtml(title)}" loading="lazy" data-path="${frame.path}">
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
            <strong>${escapeHtml(frameLabel)}</strong>
            <span>${escapeHtml(frame.status || "")}</span>
            <p>${escapeHtml(frame.intent || "")}</p>
          </div>
        </div>
      `;
    });
    const frameStrip = frameCardsFor(shot.frameSet).join("");
    const blockedImagegenStrip = frameCardsFor(shot.blockedImagegenFrameSet).join("");
    const identityLockedRegenStrip = frameCardsFor(shot.identityLockedRegenFrameSet).join("");
    const localIdentityPlateButtons = (shot.localIdentityPlates || []).map((plate) => `
      <button class="text-button" type="button" data-preview="${plate.plate}" data-title="${escapeHtml(`${shotCode} ${plate.character_id} 本地身份板`)}" data-path="${plate.plate}">${escapeHtml(plate.character_id)} 身份板</button>
    `).join("");
    const v2PromptLinks = [
      shot.videoPromptV2Path ? `<a href="${shot.videoPromptV2Path}" target="_blank" rel="noreferrer">Video Prompt V2</a>` : "",
      shot.negativePromptV2Path ? `<a href="${shot.negativePromptV2Path}" target="_blank" rel="noreferrer">Negative V2</a>` : "",
      shot.videoPromptV2QaPath ? `<a href="${shot.videoPromptV2QaPath}" target="_blank" rel="noreferrer">Video Prompt V2 QA</a>` : "",
      shot.motionProbePlanPath ? `<a href="${shot.motionProbePlanPath}" target="_blank" rel="noreferrer">Motion Probe Plan</a>` : "",
    ].filter(Boolean).join("");
    const hasIntegratedPrimaryFrames = /critical_reaudit|integrated_live_action/i.test([
      shot.displayImageSource,
      ...(shot.frameSet || []).map((frame) => frame.status),
    ].filter(Boolean).join(" "));
    const primaryDisplayNote = hasIntegratedPrimaryFrames
      ? "当前 START/KEY/END 是本次复审的整合式真人候选；本地 selected.png 只作为身份来源和历史预演证据，当前仍需 prompt-against-frame QA 与 3 秒 motion probe。"
      : "当前展示仍含本地 selected.png 预演；它只用于身份与构图参考，不能替代最终整合式真人帧。";
    const identityComparisonPanel = localIdentityPlateButtons || v2PromptLinks || shot.localVideoSourceEvidencePath || shot.localAssetProofPath || shot.identityComparisonPath || shot.identityLockedProbeReviewPath || shot.identityLockedProbeKeyPath || shot.identityLockedRegenReviewPath || identityLockedRegenStrip || blockedImagegenStrip || shot.blockedImagegenContactSheetPath ? `
      <details class="reference-details">
        <summary>本地源片证据 / 身份板 / 被阻断 AI 构图</summary>
        <div class="qa-panel">
          <p>${escapeHtml(primaryDisplayNote)}</p>
          <p>${escapeHtml(shot.identityLockReason || "当前 AI 候选尚未完成身份锁定。")}</p>
          ${shot.sourceMatch || shot.sourceAdaptationGap ? `<p>${escapeHtml([shot.sourceMatch, shot.sourceAdaptationGap].filter(Boolean).join(" / "))}</p>` : ""}
          <div class="storyboard-links compact-links">
            ${shot.localVideoSourceEvidencePath ? `<button class="text-button" type="button" data-preview="${shot.localVideoSourceEvidencePath}" data-title="${escapeHtml(`${shotCode} 本地源片证据板`)}" data-path="${shot.localVideoSourceEvidencePath}">本地源片证据板</button>` : ""}
            ${shot.sourceTimecodeAudit ? `<a href="${shot.sourceTimecodeAudit}" target="_blank" rel="noreferrer">源片时间码校准</a>` : ""}
            ${localIdentityPlateButtons}
            ${shot.localAssetProofPath ? `<button class="text-button" type="button" data-preview="${shot.localAssetProofPath}" data-title="${escapeHtml(`${shotCode} 本地资产 proof`)}" data-path="${shot.localAssetProofPath}">本地资产 Proof</button>` : ""}
            ${shot.identityLockedRegenReviewPath ? `<button class="text-button" type="button" data-preview="${shot.identityLockedRegenReviewPath}" data-title="${escapeHtml(`${shotCode} 身份锁重做审查`)}" data-path="${shot.identityLockedRegenReviewPath}">身份锁重做审查</button>` : ""}
            ${shot.identityLockedRegenReviewMdPath ? `<a href="${shot.identityLockedRegenReviewMdPath}" target="_blank" rel="noreferrer">身份锁重做结论</a>` : ""}
            ${v2PromptLinks}
            ${shot.identityLockedProbeReviewPath ? `<button class="text-button" type="button" data-preview="${shot.identityLockedProbeReviewPath}" data-title="${escapeHtml(`${shotCode} 身份锁探针审查`)}" data-path="${shot.identityLockedProbeReviewPath}">身份锁探针审查</button>` : ""}
            ${shot.identityLockedProbeKeyPath ? `<button class="text-button" type="button" data-preview="${shot.identityLockedProbeKeyPath}" data-title="${escapeHtml(`${shotCode} 身份锁 Key Probe`)}" data-path="${shot.identityLockedProbeKeyPath}">身份锁 Key Probe</button>` : ""}
            ${shot.identityComparisonPath ? `<button class="text-button" type="button" data-preview="${shot.identityComparisonPath}" data-title="${escapeHtml(`${shotCode} 本地身份对照`)}" data-path="${shot.identityComparisonPath}">本地身份对照表</button>` : ""}
            ${shot.blockedImagegenContactSheetPath ? `<button class="text-button" type="button" data-preview="${shot.blockedImagegenContactSheetPath}" data-title="${escapeHtml(`${shotCode} 被阻断 AI 三帧`)}" data-path="${shot.blockedImagegenContactSheetPath}">被阻断 AI 三帧</button>` : ""}
          </div>
          ${identityLockedRegenStrip ? `<div class="frame-strip">${identityLockedRegenStrip}</div>` : ""}
          ${blockedImagegenStrip ? `<div class="frame-strip blocked-frame-strip">${blockedImagegenStrip}</div>` : ""}
        </div>
      </details>
    ` : "";
    const risk = shot.riskNotes ? `<span class="risk-chip">WATCH</span>` : "";
    const characterReferences = (shot.characterReferenceAssets || []).map((ref) => `
      <a href="${ref.asset}" target="_blank" rel="noreferrer">
        <strong>${escapeHtml(ref.name)}</strong>
        <span>${escapeHtml(ref.asset)}</span>
      </a>
      ${ref.identityPlate ? `<button class="text-button" type="button" data-preview="${ref.identityPlate}" data-title="${escapeHtml(`${shotCode} ${ref.name} identity plate`)}" data-path="${ref.identityPlate}">身份板</button>` : ""}
    `).join("");
    const qaChecks = (shot.productionQaChecks || []).map((check) => `
      <li>${escapeHtml(check)}</li>
    `).join("");
    const primaryFrameIntent = shot.productionFrameIntent || shot.keyFrameIntent || "待补";
    const currentContinuity = shot.currentContinuity || null;
    const currentContinuityHtml = currentContinuity
      ? `${currentContinuity.previous_shot ? `${escapeHtml(currentContinuity.previous_shot)} END` : "序列起点"} → ${escapeHtml(shot.shot)} → ${currentContinuity.next_shot ? `${escapeHtml(currentContinuity.next_shot)} START` : "序列终点"}`
      : "未记录";
    const subframes = (shot.subframes || []).map((subframe) => `
      <div class="subframe-row">
        <div>
          <strong>${escapeHtml(subframe.id)} ${escapeHtml(localizedSubframeTitle(subframe.title))}</strong>
          <p>${escapeHtml(subframe.description)}</p>
        </div>
        ${subframe.output_keyframe
          ? `<a href="${subframe.output_keyframe}" target="_blank" rel="noreferrer">${escapeHtml(subframe.output_keyframe)}</a>`
          : `<span class="planned-output">${escapeHtml(subframe.output_status || "planned")} ${escapeHtml(subframe.planned_output_keyframe || "")}</span>`}
      </div>
    `).join("");
    return `
      <article id="${escapeHtml(scene09ShotDomId(shot.shot))}" class="storyboard-card ${isScene09MockBattle ? "is-scene09-review-card" : ""}">
        ${isScene09MockBattle ? "" : still}
        <div class="storyboard-body">
          <div class="storyboard-title">
            <div>
              <p class="eyebrow">${escapeHtml(localizedAct(shot.act))}</p>
              <h3>${escapeHtml(shotTitle)}</h3>
            </div>
            ${risk}
          </div>
          ${shotReadinessChipsTemplate(shot)}
          ${frameStrip ? `<div class="frame-strip primary-frame-strip" aria-label="${escapeHtml(`${shotCode} 起始关键结束帧`)}">${frameStrip}</div>` : ""}
          <section class="shot-review-brief" aria-label="${escapeHtml(`${shotCode} 审片摘要`)}">
            <div><strong>动作</strong><p>${escapeHtml(shot.purposeZh || primaryFrameIntent || "待补")}</p></div>
            <div><strong>画面</strong><p>${escapeHtml(shot.visual || primaryFrameIntent || "待补")}</p></div>
            <div><strong>镜头</strong><p>${escapeHtml(shot.cameraZh || shot.camera || "待补")}</p></div>
            <div><strong>对白</strong><p>${escapeHtml(shot.shotDialogue || "无对白")}</p></div>
          </section>
          <section class="shot-continuity-locks" aria-label="${escapeHtml(`${shotCode} 角色武器朝向锁`)}">
            <div><strong>角色/武器</strong><span>${escapeHtml(shot.characters || "待确认")}</span></div>
            <div><strong>轴线/朝向</strong><span>${escapeHtml(shot.screenDirectionRule || "待确认")}</span></div>
            <div><strong>风险</strong><span>${escapeHtml(shot.riskNotes || "无")}</span></div>
            <div><strong>状态</strong><span>${escapeHtml(shot.productionQaStatus || shot.displayImageStatus || "未记录")}</span></div>
          </section>
          <section class="shot-video-prompt-brief" aria-label="${escapeHtml(`${shotCode} 视频生成提示`)}">
            <div>
              <strong>视频生成提示</strong>
              <p>${multiline(shot.generationPrompt || shot.videoPrompt || "待补")}</p>
            </div>
            <div>
              <strong>负面约束</strong>
              <p>${multiline(shot.negativePrompt || shot.avoid || "待补")}</p>
            </div>
            <nav>
              ${shot.modelReadyPromptFile ? `<a href="${escapeHtml(shot.modelReadyPromptFile)}" target="_blank" rel="noreferrer">完整 Prompt</a>` : ""}
              ${shot.modelReadyNegativePromptFile ? `<a href="${escapeHtml(shot.modelReadyNegativePromptFile)}" target="_blank" rel="noreferrer">完整 Negative</a>` : ""}
            </nav>
          </section>
          ${battleLedgerEventTemplate(shot.battleLedgerAfter || shot.rosterAfter)}
          ${rosterDetailsTemplate(shot.rosterAfter)}
          <details class="storyboard-meta-details">
            <summary>镜头资料 / 提交状态</summary>
            <dl class="storyboard-meta">
              <div><dt>源片</dt><dd>${shot.sourceRef || ""}</dd></div>
              <div><dt>优先</dt><dd>${shot.priority || ""}</dd></div>
              <div><dt>时长</dt><dd>${shot.durationZh || shot.duration || ""}</dd></div>
              <div><dt>版本</dt><dd>${shot.cinematicBlock || episodeData.productionMode || ""}</dd></div>
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
              <div class="asset-line"><dt>当前连续性</dt><dd>${currentContinuityHtml}</dd></div>
              ${currentContinuity?.previous_end_frame ? `<div class="asset-line"><dt>上一镜 END</dt><dd><a href="${escapeHtml(currentContinuity.previous_end_frame)}" target="_blank" rel="noreferrer">${escapeHtml(currentContinuity.previous_end_frame)}</a></dd></div>` : ""}
              ${currentContinuity?.next_start_frame ? `<div class="asset-line"><dt>下一镜 START</dt><dd><a href="${escapeHtml(currentContinuity.next_start_frame)}" target="_blank" rel="noreferrer">${escapeHtml(currentContinuity.next_start_frame)}</a></dd></div>` : ""}
              <div class="asset-line"><dt>地点</dt><dd>${shot.locationAsset || ""}</dd></div>
              <div class="asset-line"><dt>角色</dt><dd>${shot.characters || ""}</dd></div>
              <div class="asset-line"><dt>输出</dt><dd>${shot.outputNeeded || ""}</dd></div>
              <div class="asset-line"><dt>产出帧</dt><dd>${shot.productionKeyframePath || ""}</dd></div>
              <div class="asset-line"><dt>目标首帧</dt><dd>${shot.payloadProductionImagePath || shot.productionStartFramePath || ""}</dd></div>
              <div class="asset-line"><dt>阻断源</dt><dd>${shot.payloadBlockedSourceImagePath || ""}</dd></div>
              <div class="asset-line"><dt>提交Prompt</dt><dd>${shot.modelReadyPromptFile ? `<a href="${escapeHtml(shot.modelReadyPromptFile)}" target="_blank" rel="noreferrer">model_prompt.md</a>` : ""}</dd></div>
              <div class="asset-line"><dt>负面Prompt</dt><dd>${shot.modelReadyNegativePromptFile ? `<a href="${escapeHtml(shot.modelReadyNegativePromptFile)}" target="_blank" rel="noreferrer">negative_prompt.md</a>` : ""}</dd></div>
              <div class="asset-line"><dt>审计原稿</dt><dd>${shot.auditPromptFile ? `<a href="${escapeHtml(shot.auditPromptFile)}" target="_blank" rel="noreferrer">prompt.md</a>` : ""}</dd></div>
              <div class="asset-line"><dt>生产原稿</dt><dd>${shot.payloadProductionPromptFile || ""}</dd></div>
              <div class="asset-line"><dt>提交状态</dt><dd>${shot.promptSubmissionStatus || ""}</dd></div>
              <div><dt>风险</dt><dd>${shot.riskNotes || "无"}</dd></div>
            </dl>
          </details>
          <details class="reference-details">
            <summary>生产 QA</summary>
            <div class="qa-panel">
              <p>${escapeHtml(shot.productionQaStatus || shot.displayImageStatus || "未记录")}</p>
              ${shot.fullLocalVisualReviewDecision ? `
                <p><strong>全量本地图审</strong>: ${escapeHtml(shot.fullLocalVisualReviewStatus || "")} · ${escapeHtml(shot.fullLocalVisualReviewDecision || "")}</p>
                <p>${escapeHtml(shot.fullLocalVisualReviewNote || "")}</p>
                <div class="storyboard-links compact-links">
                  ${shot.fullLocalVisualReviewPath ? `<a href="${escapeHtml(shot.fullLocalVisualReviewPath)}" target="_blank" rel="noreferrer">全量本地图审报告</a>` : ""}
                  ${shot.fullLocalVisualReviewJsonPath ? `<a href="${escapeHtml(shot.fullLocalVisualReviewJsonPath)}" target="_blank" rel="noreferrer">图审 JSON</a>` : ""}
                </div>
              ` : ""}
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
            <summary>提示词资料</summary>
            <div class="prompt-grid">
              <div>
                <h4>提交文件</h4>
                <p>${shot.modelReadyPromptFile ? `<a href="${escapeHtml(shot.modelReadyPromptFile)}" target="_blank" rel="noreferrer">model_prompt.md（网页模型提交用）</a>` : "未接入提交 prompt。"}</p>
                <p>${shot.modelReadyNegativePromptFile ? `<a href="${escapeHtml(shot.modelReadyNegativePromptFile)}" target="_blank" rel="noreferrer">negative_prompt.md</a>` : ""}</p>
              </div>
              <div>
                <h4>动作摘要</h4>
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
                <h4>审计/生产资料</h4>
                <p>${shot.auditPromptFile ? `<a href="${escapeHtml(shot.auditPromptFile)}" target="_blank" rel="noreferrer">prompt.md（审计原稿）</a>` : ""}</p>
                <p>${shot.payloadProductionPromptFile ? escapeHtml(shot.payloadProductionPromptFile) : ""}</p>
              </div>
              <div>
                <h4>Key Frame Prompt</h4>
                <p>${multiline(shot.keyFramePrompt || "")}</p>
              </div>
            </div>
          </details>
          ${identityComparisonPanel}
          ${shot.still ? `<a class="path" href="${shot.still}" target="_blank" rel="noreferrer">${shot.still}</a>` : ""}
        </div>
      </article>
    `;
  }).join("")}` : `<p class="empty">没有匹配的 ${escapeHtml(episode.label)} 分镜。</p>`;
}

function renderDocs() {
  els.docsList.innerHTML = data.documents.map(([title, path]) => `
    <a class="doc-row" href="${path}" target="_blank" rel="noreferrer">
      <strong>${title}</strong>
      <span>${path}</span>
    </a>
  `).join("");
}

function renderKakeyaSpecial() {
  const viewer = kakeyaSpecial.viewer;
  const filteredHighlights = kakeyaSpecial.highlights.filter(([shot, title, note]) => matchesText([
    shot,
    title,
    note,
    kakeyaSpecial.title,
    kakeyaSpecial.status,
    kakeyaSpecial.students.join(" "),
  ]));

  els.kakeyaStats.innerHTML = `
    <div><strong>${kakeyaSpecial.shots}</strong><span>镜头</span></div>
    <div><strong>${kakeyaSpecial.frames}</strong><span>真实帧</span></div>
    <div><strong>${kakeyaSpecial.fullVideoSeconds}</strong><span>一次性生产秒数</span></div>
    <div><strong>${kakeyaSpecial.students.length}</strong><span>学生代表</span></div>
    <div><strong>0</strong><span>已批准视频</span></div>
    <div><strong>QA</strong><span>${escapeHtml(kakeyaSpecial.status)}</span></div>
  `;

  const jumpButtons = filteredHighlights.map(([shot, title, note]) => `
    <button class="kakeya-jump" type="button" data-kakeya-frame="${viewer}#${shot}">
      <strong>${escapeHtml(shot)} ${escapeHtml(title)}</strong>
      <span>${escapeHtml(note)}</span>
    </button>
  `).join("");
  const dialogueHighlights = kakeyaSpecial.dialogueHighlights.map(([beat, speaker, line]) => `
    <article class="kakeya-dialogue-line">
      <span>${escapeHtml(beat)}</span>
      <strong>${escapeHtml(speaker)}</strong>
      <p>${escapeHtml(line)}</p>
    </article>
  `).join("");

  els.kakeyaPanel.innerHTML = `
    <section class="kakeya-hero-panel">
      <div>
        <p class="eyebrow">${escapeHtml(kakeyaSpecial.id)}</p>
        <h3>${escapeHtml(kakeyaSpecial.title)}</h3>
        <p>当前包展示 34 个镜头的起始帧、关键帧和结束帧；旧包因女贝老师服装漂移被标记为阻塞。最新只重生了服装修正定妆候选，以及 SH001、SH002、SH010 三组关键候选，确认后才能批量推进。</p>
      </div>
      <div class="kakeya-students" aria-label="学生阵容">
        ${kakeyaSpecial.students.map((student) => `<span>${escapeHtml(student)}</span>`).join("")}
      </div>
    </section>
    <div class="storyboard-links kakeya-links">
      <a href="${kakeyaSpecial.costumePreview}" target="_blank" rel="noreferrer">服装修正预览</a>
      <a href="${viewer}" target="_blank" rel="noreferrer">打开完整审片页</a>
      <a href="${kakeyaSpecial.fullVideoQueue}" target="_blank" rel="noreferrer">一次性全时长生产包</a>
      <a href="${kakeyaSpecial.fullVideoRunbook}" target="_blank" rel="noreferrer">全时长运行说明</a>
      <a href="${kakeyaSpecial.fullVideoExecutionPlan}" target="_blank" rel="noreferrer">全时长执行计划</a>
      <a href="${kakeyaSpecial.fullVideoPayload}" target="_blank" rel="noreferrer">提交载荷 JSONL</a>
      <a href="${kakeyaSpecial.motionQueue}" target="_blank" rel="noreferrer">3 秒探针备选</a>
      <a href="${kakeyaSpecial.proxyAnimatic}" target="_blank" rel="noreferrer">代理运动样片</a>
      <a href="${kakeyaSpecial.projectRoot}" target="_blank" rel="noreferrer">专题目录</a>
      <a href="${kakeyaSpecial.script}" target="_blank" rel="noreferrer">中文台词稿</a>
      <a href="${kakeyaSpecial.proofNotes}" target="_blank" rel="noreferrer">大一高数版证明备注</a>
      <a href="${kakeyaSpecial.qaReport}" target="_blank" rel="noreferrer">图片/剧本/数学 QA</a>
      <a href="${kakeyaSpecial.promptManifest}" target="_blank" rel="noreferrer">提示词 Manifest</a>
      <a href="${kakeyaSpecial.deliveryManifest}" target="_blank" rel="noreferrer">视频交付 Manifest</a>
      <a href="${kakeyaSpecial.review}" target="_blank" rel="noreferrer">学生互动审查</a>
      <button class="text-button" type="button" data-preview="${kakeyaSpecial.contactSheet}" data-title="二维挂谷真实帧总览 01" data-path="${kakeyaSpecial.contactSheet}">预览总览图</button>
    </div>
    <section class="kakeya-script-panel">
      <div>
        <p class="eyebrow">中文剧本摘录</p>
        <h3>先用故事引入问题，再揭示“挂谷”</h3>
        <p>这部科普短片的审查不只看图形对不对，也要看每个数学转折是不是由角色台词自然带出来。</p>
      </div>
      <div class="kakeya-dialogue-list">
        ${dialogueHighlights}
      </div>
    </section>
    <div class="kakeya-layout">
      <aside class="kakeya-shot-nav">
        <div class="feature-group-title">关键镜头 <span>${filteredHighlights.length}</span></div>
        ${jumpButtons || `<p class="empty">没有匹配的关键镜头。</p>`}
      </aside>
      <iframe class="kakeya-frame" id="kakeyaFrame" src="${viewer}" title="女贝老师二维挂谷镜头帧预览"></iframe>
    </div>
  `;
}

function renderSupportComedy() {
  const packages = supportComedy.packages || [];
  const seriesMap = new Map();
  for (const item of packages) {
    const series = item.series || "黑鹫支援喜剧";
    if (!seriesMap.has(series)) {
      seriesMap.set(series, {
        name: series,
        packages: [],
        shots: 0,
        frames: 0,
        durationSeconds: 0,
        viewer: item.seriesViewer || item.viewer,
        directory: item.packageRoot.split("/delivery/")[0],
      });
    }
    const group = seriesMap.get(series);
    group.packages.push(item);
    group.shots += item.shots;
    group.frames += item.frames;
    group.durationSeconds += item.durationSeconds;
    if (item.seriesViewer) group.viewer = item.seriesViewer.split("#")[0];
  }
  const filtered = packages.filter((item) => matchesText([
    item.id,
    item.title,
    item.subtitle,
    item.pair,
    item.rank,
    item.language,
    item.status,
    item.packageRoot,
  ]));
  const totalShots = filtered.reduce((sum, item) => sum + item.shots, 0);
  const totalFrames = filtered.reduce((sum, item) => sum + item.frames, 0);
  const totalSeconds = filtered.reduce((sum, item) => sum + item.durationSeconds, 0);
  const approvedCount = filtered.filter((item) => item.status === "approved_for_video").length;
  const selectedPackage = packages.find((item) => item.viewer === els.supportPackageSelect?.value) || filtered[0] || packages[0];

  els.supportComedyStats.innerHTML = `
    <div><strong>${filtered.length}</strong><span>当前集数</span></div>
    <div><strong>${totalShots}</strong><span>镜头</span></div>
    <div><strong>${totalFrames}</strong><span>分镜帧</span></div>
    <div><strong>${formatSeconds(totalSeconds)}</strong><span>总时长</span></div>
    <div><strong>${approvedCount}</strong><span>可提交包</span></div>
  `;

  els.supportComedyLinks.innerHTML = `
    <a href="${supportComedy.projectRoot}" target="_blank" rel="noreferrer">项目目录</a>
    <a href="${supportComedy.sourceAudit}" target="_blank" rel="noreferrer">来源审计</a>
    <a href="${supportComedy.finalAudit}" target="_blank" rel="noreferrer">交付审计</a>
    ${(supportComedy.seriesLinks || []).map((link) => `<a href="${link.href}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}
  `;

  if (els.supportSeriesList) {
    els.supportSeriesList.innerHTML = [...seriesMap.values()].map((series) => `
      <article class="support-series-card">
        <div>
          <p class="eyebrow">支援喜剧系列</p>
          <h3>${escapeHtml(series.name)}</h3>
          <p>${series.packages.length} 集 / ${series.shots} 镜头 / ${series.frames} 帧 / ${formatSeconds(series.durationSeconds)}</p>
        </div>
        <div class="support-actions">
          <a href="${series.viewer}" target="_blank" rel="noreferrer">打开系列面板</a>
          <a href="${series.directory}" target="_blank" rel="noreferrer">打开目录</a>
        </div>
      </article>
    `).join("");
  }

  if (els.supportPackageSelect) {
    const currentValue = els.supportPackageSelect.value;
    els.supportPackageSelect.innerHTML = packages.map((item) => `
      <option value="${item.viewer}" ${item.viewer === currentValue ? "selected" : ""}>
        ${escapeHtml(item.series || "黑鹫支援喜剧")} / ${escapeHtml(item.id)} / ${escapeHtml(item.title)}
      </option>
    `).join("");
    if (selectedPackage) els.supportPackageSelect.value = selectedPackage.viewer;
  }
  if (els.supportPackageOpen && selectedPackage) {
    els.supportPackageOpen.href = selectedPackage.viewer;
    els.supportPackageOpen.textContent = `打开 ${selectedPackage.id} 面板`;
  }

  els.supportComedyGrid.innerHTML = filtered.length ? filtered.map((item) => `
    <article class="support-card">
      <button class="image-button support-contact" type="button" data-preview="${item.contactSheet}" data-title="${item.id} ${item.title}" data-path="${item.contactSheet}">
        <img src="${item.contactSheet}" alt="${item.id} ${item.title} contact sheet" loading="lazy" data-path="${item.contactSheet}">
      </button>
      <div class="support-body">
        <div class="support-title">
          <div>
            <p class="eyebrow">${escapeHtml(item.series || "黑鹫支援喜剧")} / ${escapeHtml(item.id)} / ${escapeHtml(item.rank)}</p>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.subtitle)}</p>
          </div>
          <span class="status-pill">${escapeHtml(item.status)}</span>
        </div>
        <dl class="support-meta">
          <div><dt>对象</dt><dd>${escapeHtml(item.pair)}</dd></div>
          <div><dt>语言</dt><dd>${escapeHtml(item.language)}</dd></div>
          <div><dt>镜头</dt><dd>${item.shots} shots / ${item.frames} frames</dd></div>
          <div><dt>时长</dt><dd>${formatSeconds(item.durationSeconds)}</dd></div>
        </dl>
        <div class="support-actions">
          <a href="${item.viewer}" target="_blank" rel="noreferrer">打开面板</a>
          ${item.seriesViewer ? `<a href="${item.seriesViewer}" target="_blank" rel="noreferrer">系列面板</a>` : ""}
          ${item.probeQueue ? `<a href="${item.probeQueue}" target="_blank" rel="noreferrer">Probe</a>` : ""}
          <a href="${item.queue}" target="_blank" rel="noreferrer">Queue</a>
          <a href="${item.runbook}" target="_blank" rel="noreferrer">RUNBOOK</a>
          <a href="${item.manifest}" target="_blank" rel="noreferrer">Manifest</a>
          ${item.subtitles ? `<a href="${item.subtitles}" target="_blank" rel="noreferrer">中文字幕</a>` : ""}
          ${item.subtitleProject ? `<a href="${item.subtitleProject}" target="_blank" rel="noreferrer">字幕项目</a>` : ""}
        </div>
        <a class="path" href="${item.packageRoot}" target="_blank" rel="noreferrer">${item.packageRoot}</a>
      </div>
    </article>
  `).join("") : `<p class="empty">没有匹配的支援喜剧包。</p>`;
}

function normalizeViewName(view) {
  const clean = String(view || "").replace(/^#/, "");
  if (clean.endsWith("View")) return clean.slice(0, -"View".length);
  return clean;
}

function setView(view, options = {}) {
  const viewName = normalizeViewName(view);
  const target = document.querySelector(`#${viewName}View`) ? viewName : "characters";
  state.view = target;
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === target);
  });
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("is-active", section.id === `${target}View`);
  });
  if (!options.skipHash) {
    history.replaceState(null, "", `#${target}View`);
  }
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
renderKakeyaSpecial();
renderSupportComedy();
if (els.protocolNotice && location.protocol === "file:") {
  els.protocolNotice.hidden = false;
}
if (location.hash) {
  setView(location.hash.slice(1), { skipHash: true });
}

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
  renderKakeyaSpecial();
  renderSupportComedy();
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
window.addEventListener("hashchange", () => {
  setView(location.hash.slice(1), { skipHash: true });
});
if (els.supportPackageSelect && els.supportPackageOpen) {
  els.supportPackageSelect.addEventListener("change", (event) => {
    els.supportPackageOpen.href = event.target.value;
    const selected = (supportComedy.packages || []).find((item) => item.viewer === event.target.value);
    els.supportPackageOpen.textContent = selected ? `打开 ${selected.id} 面板` : "打开所选面板";
  });
}
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
  const kakeyaJump = event.target.closest("[data-kakeya-frame]");
  if (kakeyaJump) {
    const frame = document.querySelector("#kakeyaFrame");
    if (frame) {
      frame.src = kakeyaJump.dataset.kakeyaFrame;
    }
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
