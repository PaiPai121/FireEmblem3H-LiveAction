#!/usr/bin/env node
/* Smoke-test the static main panel without launching a real browser. */

const fs = require("fs");
const vm = require("vm");

class ClassList {
  constructor() {
    this.set = new Set();
  }

  toggle(name, enabled) {
    if (enabled) this.set.add(name);
    else this.set.delete(name);
  }

  contains(name) {
    return this.set.has(name);
  }
}

class Element {
  constructor(id = "") {
    this.id = id;
    this.dataset = {};
    this.classList = new ClassList();
    this.style = {};
    this.value = "";
    this.href = "";
    this.src = "";
    this.alt = "";
    this.hidden = false;
    this.textContent = "";
    this._innerHTML = "";
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
  }

  get innerHTML() {
    return this._innerHTML;
  }

  get innerText() {
    return this.textContent || this._innerHTML.replace(/<[^>]+>/g, " ");
  }

  addEventListener() {}
  close() {}
  closest() { return null; }
  querySelector() { return new Element(); }
  querySelectorAll() { return []; }
  showModal() {}
}

const ids = [
  "searchInput",
  "factionFilter",
  "eraFilter",
  "statusFilter",
  "stats",
  "characterGrid",
  "locationStats",
  "episodeFeature",
  "shotList",
  "storyboardStats",
  "storyboardEpisodeFilter",
  "storyboardSceneFilter",
  "sceneBoard",
  "storyboardLinks",
  "storyboardGrid",
  "kakeyaStats",
  "kakeyaPanel",
  "supportComedyStats",
  "supportComedyLinks",
  "supportSeriesList",
  "supportPackageSelect",
  "supportPackageOpen",
  "supportComedyGrid",
  "docsList",
  "protocolNotice",
  "previewDialog",
  "previewImage",
  "previewTitle",
  "previewPath",
  "closeDialog",
  "charactersView",
  "episodeView",
  "storyboardView",
  "kakeyaSpecialView",
  "supportComedyView",
  "documentsView",
];

const elements = new Map(ids.map((id) => [id, new Element(id)]));
const tabs = ["characters", "episode", "storyboard", "kakeyaSpecial", "supportComedy", "documents"].map((view) => {
  const tab = new Element();
  tab.dataset.view = view;
  tab.textContent = view;
  return tab;
});
const views = ["charactersView", "episodeView", "storyboardView", "kakeyaSpecialView", "supportComedyView", "documentsView"].map((id) => elements.get(id));

const document = {
  body: new Element("body"),
  addEventListener() {},
  querySelector(selector) {
    if (selector.startsWith("#")) return elements.get(selector.slice(1)) || null;
    if (selector === ".view.is-active") return views.find((view) => view.classList.contains("is-active")) || null;
    if (selector === ".tab.is-active") return tabs.find((tab) => tab.classList.contains("is-active")) || null;
    return new Element();
  },
  querySelectorAll(selector) {
    if (selector === ".tab") return tabs;
    if (selector === ".view") return views;
    return [];
  },
};

const context = {
  document,
  console,
  location: { hash: "#supportComedyView", protocol: "file:" },
  history: { replaceState() {} },
  HTMLImageElement: class {},
  Intl,
  setTimeout,
  clearTimeout,
  addEventListener() {},
};
context.window = context;
vm.createContext(context);

for (const file of [
  "site/data.js",
  "site/ep02_storyboard_data.js",
  "site/ep03_storyboard_data.js",
  "site/support_comedy_data.js",
  "site/app.js",
]) {
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
}

context.setView("supportComedy", { skipHash: true });
const supportCards = (elements.get("supportComedyGrid").innerHTML.match(/class="support-card"/g) || []).length;
const seriesCards = (elements.get("supportSeriesList").innerHTML.match(/class="support-series-card"/g) || []).length;
const selectOptions = (elements.get("supportPackageSelect").innerHTML.match(/<option/g) || []).length;
const activeSupport = elements.get("supportComedyView").classList.contains("is-active");

context.setView("storyboard", { skipHash: true });
const activeStoryboard = elements.get("storyboardView").classList.contains("is-active");
const sceneBoardHtml = elements.get("sceneBoard").innerHTML;
const storyboardGridHtml = elements.get("storyboardGrid").innerHTML;
const scene09ShotCards = (storyboardGridHtml.match(/class="storyboard-card/g) || []).length;
const scene09PrimaryFrameStrips = (storyboardGridHtml.match(/primary-frame-strip/g) || []).length;
const scene09FrameCards = (storyboardGridHtml.match(/class="frame-card/g) || []).length;
const scene09LeadImageButtons = (storyboardGridHtml.match(/class="image-button"/g) || []).length;
const scene09ReviewBriefs = (storyboardGridHtml.match(/class="shot-review-brief"/g) || []).length;
const scene09ContinuityLocks = (storyboardGridHtml.match(/class="shot-continuity-locks"/g) || []).length;
const scene09VideoPromptBriefs = (storyboardGridHtml.match(/class="shot-video-prompt-brief"/g) || []).length;
const scene09FullPromptLinks = (storyboardGridHtml.match(/完整 Prompt/g) || []).length;
const scene09FullNegativeLinks = (storyboardGridHtml.match(/完整 Negative/g) || []).length;
const scene09FullLocalVisualReviewLabels = (storyboardGridHtml.match(/<strong>全量本地图审<\/strong>/g) || []).length;
const scene09FullLocalVisualReviewReportLinks = (storyboardGridHtml.match(/全量本地图审报告/g) || []).length;
const scene09FullLocalVisualReviewJsonLinks = (storyboardGridHtml.match(/图审 JSON/g) || []).length;
const scene09ReadinessChipSets = (storyboardGridHtml.match(/class="shot-readiness-chips"/g) || []).length;
const scene09ReadinessChips = (storyboardGridHtml.match(/class="readiness-chip/g) || []).length;
const scene09VideoPendingChips = (storyboardGridHtml.match(/class="readiness-chip is-pending">视频待生成/g) || []).length;
const sceneOptionsHtml = elements.get("storyboardSceneFilter").innerHTML;
const hasChineseSceneTitle = sceneBoardHtml.includes("第09场：学级模拟战") || sceneOptionsHtml.includes("第09场：学级模拟战");
const hasChineseShotTitle = storyboardGridHtml.includes("镜头025：规则与三方目标确立") &&
  storyboardGridHtml.includes("镜头027B：黑鹫第一波压出") &&
  storyboardGridHtml.includes("镜头034B：空教师目标裁定");
const hasChineseFrameLabels = storyboardGridHtml.includes("起始帧") && storyboardGridHtml.includes("关键帧") && storyboardGridHtml.includes("结束帧");
const hasShotReviewBriefLabels = storyboardGridHtml.includes("<strong>动作</strong>") &&
  storyboardGridHtml.includes("<strong>画面</strong>") &&
  storyboardGridHtml.includes("<strong>镜头</strong>") &&
  storyboardGridHtml.includes("<strong>对白</strong>");
const hasShotContinuityLockLabels = storyboardGridHtml.includes("<strong>角色/武器</strong>") &&
  storyboardGridHtml.includes("<strong>轴线/朝向</strong>") &&
  storyboardGridHtml.includes("<strong>风险</strong>") &&
  storyboardGridHtml.includes("<strong>状态</strong>");
const hasVideoPromptBriefLabels = storyboardGridHtml.includes("<strong>视频生成提示</strong>") &&
  storyboardGridHtml.includes("<strong>负面约束</strong>") &&
  storyboardGridHtml.includes("完整 Prompt") &&
  storyboardGridHtml.includes("完整 Negative");
const hasBattleEventPanel = storyboardGridHtml.includes("本镜头事件") &&
  storyboardGridHtml.includes("不得重新上前线") &&
  storyboardGridHtml.includes("被菲力克斯与亚修压制退场") &&
  storyboardGridHtml.includes("学级败局已定，按哨声收势退场");
const storyboardLinksHtml = elements.get("storyboardLinks").innerHTML;
const storyboardLinksHidden = elements.get("storyboardLinks").hidden === true;
const scene09ReviewQueueRows = (storyboardLinksHtml.match(/class="scene09-review-queue-row"/g) || []).length;
const scene09ReviewQueueAnchors = (storyboardLinksHtml.match(/href="#scene09-Shot/g) || []).length;
const hasCleanScene09Header = storyboardLinksHtml.trim() === "" &&
  storyboardLinksHidden &&
  scene09ReviewQueueRows === 0 &&
  scene09ReviewQueueAnchors === 0;
const scene09TopClutterTerms = [
  "Scene09 探针",
  "Scene09 全时长",
  "Scene09 Monitor Handoff",
  "Scene09 下一步操作",
  "Scene09 下一步 JSON",
  "Scene09 Web战斗事件审计",
  "Scene09 126帧逐帧审核矩阵",
];
const hasNoScene09TopClutter = scene09TopClutterTerms.every((term) => !storyboardLinksHtml.includes(term));
const hasScene09SubmissionPromptSurface = storyboardGridHtml.includes("提交Prompt") &&
  storyboardGridHtml.includes("model_prompt.md") &&
  storyboardGridHtml.includes("负面Prompt") &&
  storyboardGridHtml.includes("negative_prompt.md") &&
  storyboardGridHtml.includes("审计原稿") &&
  storyboardGridHtml.includes("prompt.md") &&
  storyboardGridHtml.includes("提示词资料") &&
  storyboardGridHtml.includes("model_prompt.md（网页模型提交用）");
const hasScene09FullLocalVisualReviewSurface = storyboardGridHtml.includes("全量本地图审") &&
  (storyboardGridHtml.includes("full_local_visual_review_passed_for_motion_probe_not_video_approved") ||
    storyboardGridHtml.includes("accepted_for_motion_probe_only_not_video_approved")) &&
  storyboardGridHtml.includes("全量本地图审报告") &&
  storyboardGridHtml.includes("图审 JSON");
const hasScene09CurrentOperatorStatus = storyboardGridHtml.includes("真实视频待生成") &&
  storyboardGridHtml.includes("全时长未放行") &&
  storyboardGridHtml.includes("本地CLI") &&
  storyboardGridHtml.includes("未配置") &&
  storyboardGridHtml.includes("完成");
const hasScene09CurrentHandoffFrames = [
  "delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/001_EP02-SC09-SHOT-Shot025-V2-20260721/key_frame.png",
  "delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721/key_frame.png",
  "delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721/key_frame.png",
  "delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/022_EP02-SC09-SHOT-Shot032-V2-20260721/key_frame.png",
].every((path) => storyboardGridHtml.includes(path));
const hasScene09Shot032HealingHomage = storyboardGridHtml.includes("镜头032：杜笃受伤，梅尔塞德斯治疗重建盾线") &&
  storyboardGridHtml.includes("杜笃始终面向来敌，梅尔塞德斯在后左支援") &&
  storyboardGridHtml.includes("治疗光不会变成攻击光束");
const scene09RenderedHandoffKeyFrames = new Set([
  ...storyboardGridHtml.matchAll(/delivery\/scene09_v3_monitor_handoff_package_2026-07-27\/shots\/[^"]+\/key_frame\.png/g),
].map((match) => match[0])).size;
const leaksOldShot025DisplayFrame = storyboardGridHtml.includes("teacher_lane_patch_2026-07-27/38D_Shot034_three_leaders_key.png");
const errors = [];

if (!activeSupport) errors.push("supportComedyView did not activate from hash");
if (supportCards < 8) errors.push(`expected at least 8 support cards, got ${supportCards}`);
if (seriesCards < 2) errors.push(`expected at least 2 support series cards, got ${seriesCards}`);
if (selectOptions < 8) errors.push(`expected at least 8 support package options, got ${selectOptions}`);
if (!activeStoryboard) errors.push("storyboardView did not activate");
if (!hasChineseSceneTitle) errors.push("storyboard scene title is not localized to 第09场：学级模拟战");
if (!hasChineseShotTitle) errors.push("storyboard shot titles are not localized");
if (!hasChineseFrameLabels) errors.push("storyboard frame labels are not localized");
if (!hasBattleEventPanel) errors.push("storyboard does not expose per-shot battle event state");
if (!hasCleanScene09Header) errors.push("Scene09 should display latest shot cards directly after priority review queue is cleared");
if (!hasNoScene09TopClutter) errors.push("Scene09 top link area still exposes production/admin clutter");
if (scene09ShotCards !== 42) errors.push(`expected 42 Scene09 shot cards, got ${scene09ShotCards}`);
if (scene09PrimaryFrameStrips !== 42) errors.push(`expected 42 Scene09 primary start/key/end frame strips, got ${scene09PrimaryFrameStrips}`);
if (scene09FrameCards !== 126) errors.push(`expected 126 Scene09 rendered frame cards, got ${scene09FrameCards}`);
if (scene09LeadImageButtons !== 0) errors.push(`Scene09 should not show duplicate lead image buttons above the frame strips, got ${scene09LeadImageButtons}`);
if (scene09ReviewBriefs !== 42) errors.push(`expected 42 Scene09 review briefs, got ${scene09ReviewBriefs}`);
if (!hasShotReviewBriefLabels) errors.push("Scene09 review briefs do not expose action/visual/camera/dialogue labels");
if (scene09ContinuityLocks !== 42) errors.push(`expected 42 Scene09 role/weapon/facing lock strips, got ${scene09ContinuityLocks}`);
if (!hasShotContinuityLockLabels) errors.push("Scene09 lock strips do not expose role/weapon, facing, risk, and QA status labels");
if (scene09VideoPromptBriefs !== 42) errors.push(`expected 42 Scene09 video prompt briefs, got ${scene09VideoPromptBriefs}`);
if (scene09FullPromptLinks !== 42) errors.push(`expected 42 Scene09 full prompt links, got ${scene09FullPromptLinks}`);
if (scene09FullNegativeLinks !== 42) errors.push(`expected 42 Scene09 full negative links, got ${scene09FullNegativeLinks}`);
if (scene09FullLocalVisualReviewLabels !== 42) errors.push(`expected 42 Scene09 full local visual review labels, got ${scene09FullLocalVisualReviewLabels}`);
if (scene09FullLocalVisualReviewReportLinks !== 42) errors.push(`expected 42 Scene09 full local visual review report links, got ${scene09FullLocalVisualReviewReportLinks}`);
if (scene09FullLocalVisualReviewJsonLinks !== 42) errors.push(`expected 42 Scene09 full local visual review JSON links, got ${scene09FullLocalVisualReviewJsonLinks}`);
if (!hasVideoPromptBriefLabels) errors.push("Scene09 video prompt briefs do not expose prompt/negative labels and links");
if (scene09ReadinessChipSets !== 42) errors.push(`expected 42 Scene09 readiness chip sets, got ${scene09ReadinessChipSets}`);
if (scene09ReadinessChips !== 210) errors.push(`expected 210 Scene09 readiness chips, got ${scene09ReadinessChips}`);
if (scene09VideoPendingChips !== 42) errors.push(`expected 42 Scene09 video pending chips, got ${scene09VideoPendingChips}`);
if (!hasScene09SubmissionPromptSurface) errors.push("storyboard shot cards do not expose model_prompt.md as the submission prompt and prompt.md as audit source");
if (!hasScene09FullLocalVisualReviewSurface) errors.push("storyboard shot cards do not expose the full local visual review decision and links");
if (!hasScene09CurrentOperatorStatus) errors.push("Scene09 operator status does not expose the current clips-pending state");
if (!hasScene09CurrentHandoffFrames) errors.push("Scene09 cards are not rendering current package-local handoff frames for repaired shots");
if (!hasScene09Shot032HealingHomage) errors.push("Scene09 Shot032 does not expose the updated Dedue/Mercedes healing homage contract");
if (scene09RenderedHandoffKeyFrames !== 42) errors.push(`expected 42 package-local handoff key frames in Scene09 render, got ${scene09RenderedHandoffKeyFrames}`);
if (leaksOldShot025DisplayFrame) errors.push("Scene09 Shot025 still renders the old Shot034 teacher-lane patch key frame");
if (storyboardGridHtml.includes("phase=clips_pending;")) errors.push("Scene09 operator status is leaking raw machine status_line text into the main board");

const result = {
  activeSupport,
  supportCards,
  seriesCards,
  selectOptions,
  activeStoryboard,
  scene09ShotCards,
  scene09PrimaryFrameStrips,
  scene09FrameCards,
  scene09LeadImageButtons,
  scene09ReviewBriefs,
  scene09ContinuityLocks,
  scene09VideoPromptBriefs,
  scene09FullPromptLinks,
  scene09FullNegativeLinks,
  scene09FullLocalVisualReviewLabels,
  scene09FullLocalVisualReviewReportLinks,
  scene09FullLocalVisualReviewJsonLinks,
  scene09ReadinessChipSets,
  scene09ReadinessChips,
  scene09VideoPendingChips,
  scene09ReviewQueueRows,
  scene09ReviewQueueAnchors,
  storyboardLinksHidden,
  hasChineseSceneTitle,
  hasChineseShotTitle,
  hasChineseFrameLabels,
  hasShotReviewBriefLabels,
  hasShotContinuityLockLabels,
  hasVideoPromptBriefLabels,
  hasBattleEventPanel,
  hasCleanScene09Header,
  hasNoScene09TopClutter,
  hasScene09SubmissionPromptSurface,
  hasScene09FullLocalVisualReviewSurface,
  hasScene09CurrentOperatorStatus,
  hasScene09CurrentHandoffFrames,
  scene09RenderedHandoffKeyFrames,
  leaksOldShot025DisplayFrame,
  errors,
};
console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);
