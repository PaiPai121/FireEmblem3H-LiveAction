#!/usr/bin/env node
/* Verify that the main EP02 storyboard panel exposes Scene09 battle-state events. */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const siteDataPath = "site/ep02_storyboard_data.js";
const appPath = "site/app.js";
const packageDir = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const reportDir = "production_system/scene09_v3_attrition_package";
const reportJson = path.join(reportDir, "ep02_web_battle_event_panel_audit_2026-08-03.json");
const packageReportJson = path.join(packageDir, "ep02_web_battle_event_panel_audit.json");
const motionProbeOperatorTrackerJson = path.join(packageDir, "motion_probe_operator_tracker.json");

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

function readEp02Data() {
  const source = fs.readFileSync(siteDataPath, "utf8")
    .replace(/^window\.EP02_STORYBOARD_DATA = /, "")
    .replace(/;\n?$/, "");
  return JSON.parse(source);
}

function renderMainPanel() {
  const context = {
    document,
    console,
    location: { hash: "#storyboardView", protocol: "file:" },
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
    siteDataPath,
    "site/ep03_storyboard_data.js",
    "site/support_comedy_data.js",
    appPath,
  ]) {
    vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  }
  context.setView("storyboard", { skipHash: true });
  return {
    storyboardGridHtml: elements.get("storyboardGrid").innerHTML,
    storyboardLinksHtml: elements.get("storyboardLinks").innerHTML,
    storyboardLinksHidden: elements.get("storyboardLinks").hidden === true,
  };
}

function countGrouped(groups) {
  return Object.values(groups || {}).reduce((sum, names) => sum + (Array.isArray(names) ? names.length : 0), 0);
}

fs.mkdirSync(reportDir, { recursive: true });

const problems = [];
const data = readEp02Data();
const scene09Shots = (data.shots || []).filter((shot) => {
  const match = String(shot.shot || "").match(/^Shot(\d+)/);
  const base = match ? Number(match[1]) : 0;
  return base >= 25 && base <= 36;
});
const ledgerShots = scene09Shots.filter((shot) => shot.battleLedgerAfter);
const defeatedShots = scene09Shots.filter((shot) => countGrouped(shot.battleLedgerAfter?.defeated_removed_by_house) > 0);
const objectiveShots = scene09Shots.filter((shot) => countGrouped(shot.battleLedgerAfter?.captured_objective_defeated_by_house) > 0);
const fullLocalVisualReviewShots = scene09Shots.filter((shot) => shot.fullLocalVisualReviewStatus === "monitor_required");
const motionProbeAcceptedShots = scene09Shots.filter((shot) => shot.fullLocalVisualReviewDecision === "accepted_for_motion_probe_only_not_video_approved");
const operatorProbeZipBatches = data.mockBattleOperatorStatus?.motion_probe_zip_batches || [];
const operatorProbeReturnBatches = data.mockBattleOperatorStatus?.motion_probe_return_batches || [];
const modelReadyPromptShots = scene09Shots.filter((shot) => shot.modelReadyPromptFile && shot.modelReadyNegativePromptFile && shot.auditPromptFile);
const motionProbeOperatorTracker = fs.existsSync(motionProbeOperatorTrackerJson)
  ? JSON.parse(fs.readFileSync(motionProbeOperatorTrackerJson, "utf8"))
  : null;

if (scene09Shots.length !== 42) problems.push(`expected 42 Scene09 shots, got ${scene09Shots.length}`);
if (ledgerShots.length !== 42) problems.push(`expected 42 Scene09 shots with battleLedgerAfter, got ${ledgerShots.length}`);
if (defeatedShots.length < 20) problems.push(`expected at least 20 Scene09 shots carrying defeated/removed state, got ${defeatedShots.length}`);
if (objectiveShots.length < 10) problems.push(`expected at least 10 Scene09 shots carrying objective-defeated state, got ${objectiveShots.length}`);
if (fullLocalVisualReviewShots.length !== 42) {
  problems.push(`expected 42 Scene09 shots with full local visual review monitor state, got ${fullLocalVisualReviewShots.length}`);
}
if (motionProbeAcceptedShots.length !== 42) {
  problems.push(`expected 42 Scene09 shots accepted for motion probe only, got ${motionProbeAcceptedShots.length}`);
}
if (modelReadyPromptShots.length !== 42) problems.push(`expected 42 Scene09 shots with modelReadyPromptFile/modelReadyNegativePromptFile/auditPromptFile, got ${modelReadyPromptShots.length}`);
if (operatorProbeZipBatches.length !== 7) problems.push(`expected 7 operator probe zip batches, got ${operatorProbeZipBatches.length}`);
for (const batch of operatorProbeZipBatches) {
  if (!batch.zip || !fs.existsSync(batch.zip)) problems.push(`missing operator probe zip file: ${batch.batch_id || "unknown"}`);
  if (!batch.shot_range) problems.push(`missing operator probe shot range: ${batch.batch_id || "unknown"}`);
}
if (operatorProbeReturnBatches.length !== 7) problems.push(`expected 7 operator probe return batches, got ${operatorProbeReturnBatches.length}`);
for (const batch of operatorProbeReturnBatches) {
  if (!batch.return_dir || !fs.existsSync(batch.return_dir)) problems.push(`missing operator probe return dir: ${batch.batch_id || "unknown"}`);
  if (!batch.dry_run_command || !batch.dry_run_command.includes("--dry-run")) problems.push(`missing operator probe return dry-run command: ${batch.batch_id || "unknown"}`);
}
if (!motionProbeOperatorTracker) {
  problems.push("missing motion_probe_operator_tracker.json");
} else {
  if (motionProbeOperatorTracker.batches !== 7) problems.push(`expected tracker batches 7, got ${motionProbeOperatorTracker.batches}`);
  if (motionProbeOperatorTracker.expected_probe_rows !== 42) problems.push(`expected tracker rows 42, got ${motionProbeOperatorTracker.expected_probe_rows}`);
  if (motionProbeOperatorTracker.problems?.length) problems.push(`motion probe operator tracker has problems: ${motionProbeOperatorTracker.problems.join("; ")}`);
  if (motionProbeOperatorTracker.decision !== "motion_probe_operator_tracker_ready_clips_pending") {
    problems.push(`unexpected motion probe operator tracker decision: ${motionProbeOperatorTracker.decision}`);
  }
}

const { storyboardGridHtml, storyboardLinksHtml, storyboardLinksHidden } = renderMainPanel();
const eventPanels = (storyboardGridHtml.match(/class="battle-event-panel"/g) || []).length;
const shotCards = (storyboardGridHtml.match(/class="storyboard-card/g) || []).length;
const primaryFrameStrips = (storyboardGridHtml.match(/primary-frame-strip/g) || []).length;
const frameCards = (storyboardGridHtml.match(/class="frame-card/g) || []).length;
const leadImageButtons = (storyboardGridHtml.match(/class="image-button"/g) || []).length;
const reviewBriefs = (storyboardGridHtml.match(/class="shot-review-brief"/g) || []).length;
const continuityLockStrips = (storyboardGridHtml.match(/class="shot-continuity-locks"/g) || []).length;
const videoPromptBriefs = (storyboardGridHtml.match(/class="shot-video-prompt-brief"/g) || []).length;
const fullPromptLinks = (storyboardGridHtml.match(/完整 Prompt/g) || []).length;
const fullNegativeLinks = (storyboardGridHtml.match(/完整 Negative/g) || []).length;
const fullLocalVisualReviewLabels = (storyboardGridHtml.match(/<strong>全量本地图审<\/strong>/g) || []).length;
const fullLocalVisualReviewReportLinks = (storyboardGridHtml.match(/全量本地图审报告/g) || []).length;
const fullLocalVisualReviewJsonLinks = (storyboardGridHtml.match(/图审 JSON/g) || []).length;
const readinessChipSets = (storyboardGridHtml.match(/class="shot-readiness-chips"/g) || []).length;
const readinessChips = (storyboardGridHtml.match(/class="readiness-chip/g) || []).length;
const videoPendingChips = (storyboardGridHtml.match(/class="readiness-chip is-pending">视频待生成/g) || []).length;
const scene09ReviewQueueRows = (storyboardLinksHtml.match(/class="scene09-review-queue-row"/g) || []).length;
const scene09ReviewQueueAnchors = (storyboardLinksHtml.match(/href="#scene09-Shot/g) || []).length;
const hasReviewBriefLabels = storyboardGridHtml.includes("<strong>动作</strong>") &&
  storyboardGridHtml.includes("<strong>画面</strong>") &&
  storyboardGridHtml.includes("<strong>镜头</strong>") &&
  storyboardGridHtml.includes("<strong>对白</strong>");
const hasContinuityLockLabels = storyboardGridHtml.includes("<strong>角色/武器</strong>") &&
  storyboardGridHtml.includes("<strong>轴线/朝向</strong>") &&
  storyboardGridHtml.includes("<strong>风险</strong>") &&
  storyboardGridHtml.includes("<strong>状态</strong>");
const hasVideoPromptBriefLabels = storyboardGridHtml.includes("<strong>视频生成提示</strong>") &&
  storyboardGridHtml.includes("<strong>负面约束</strong>") &&
  storyboardGridHtml.includes("完整 Prompt") &&
  storyboardGridHtml.includes("完整 Negative");
const hasCurrentClipsPendingState = storyboardGridHtml.includes("真实视频待生成") &&
  storyboardGridHtml.includes("全时长未放行") &&
  storyboardGridHtml.includes("本地CLI") &&
  storyboardGridHtml.includes("未配置") &&
  storyboardGridHtml.includes("accepted_for_motion_probe_only_not_video_approved");
const requiredRenderedText = [
  "本镜头事件",
  "不得重新上前线",
  "被菲力克斯与亚修压制退场",
  "被库罗德与雷欧妮压制退场",
  "教师目标施法角度被压制",
  "离画回线被切断，未与汉尼曼同框",
  "学级败局已定，按哨声收势退场",
  "目标压制",
  "赛后收势",
  "提交Prompt",
  "model_prompt.md",
  "负面Prompt",
  "negative_prompt.md",
  "审计原稿",
  "prompt.md",
  "提示词资料",
  "model_prompt.md（网页模型提交用）",
  "全量本地图审",
  "accepted_for_motion_probe_only_not_video_approved",
  "全量本地图审报告",
  "图审 JSON",
  "真实视频待生成",
  "本地CLI",
  "全时长未放行",
];
const forbiddenTopClutterText = [
  "Scene09 生产下一步",
  "Scene09 探针",
  "Scene09 全时长",
  "Scene09 Monitor Handoff",
  "Scene09 下一步操作",
  "Scene09 下一步 JSON",
  "Scene09 Web战斗事件审计",
  "Scene09 126帧逐帧审核矩阵",
  "探针 Zip 批次",
  "探针回收目录",
];
for (const text of requiredRenderedText) {
  if (!storyboardGridHtml.includes(text)) problems.push(`missing rendered battle event text: ${text}`);
}
if (storyboardLinksHtml.trim()) {
  problems.push("Scene09 storyboard top area should be empty after the priority review queue is cleared");
}
if (!storyboardLinksHidden) {
  problems.push("Scene09 storyboard top link container should be hidden on the main shot board");
}
if (scene09ReviewQueueRows !== 0) {
  problems.push(`expected 0 Scene09 priority review queue rows after local visual QA, got ${scene09ReviewQueueRows}`);
}
if (scene09ReviewQueueAnchors !== 0) {
  problems.push(`expected 0 Scene09 priority review queue anchors after local visual QA, got ${scene09ReviewQueueAnchors}`);
}
for (const text of forbiddenTopClutterText) {
  if (storyboardLinksHtml.includes(text)) problems.push(`Scene09 top link clutter is still visible: ${text}`);
}
if (eventPanels !== 42) problems.push(`expected 42 rendered battle event panels, got ${eventPanels}`);
if (shotCards !== 42) problems.push(`expected 42 rendered Scene09 shot cards, got ${shotCards}`);
if (primaryFrameStrips !== 42) problems.push(`expected 42 primary start/key/end frame strips, got ${primaryFrameStrips}`);
if (frameCards !== 126) problems.push(`expected 126 rendered start/key/end frame cards, got ${frameCards}`);
if (leadImageButtons !== 0) problems.push(`Scene09 should not render duplicate lead image buttons above frame strips, got ${leadImageButtons}`);
if (reviewBriefs !== 42) problems.push(`expected 42 rendered Scene09 shot review briefs, got ${reviewBriefs}`);
if (!hasReviewBriefLabels) problems.push("Scene09 shot review briefs do not expose action/visual/camera/dialogue labels");
if (continuityLockStrips !== 42) problems.push(`expected 42 rendered role/weapon/facing lock strips, got ${continuityLockStrips}`);
if (!hasContinuityLockLabels) problems.push("Scene09 lock strips do not expose role/weapon, facing, risk, and QA status labels");
if (videoPromptBriefs !== 42) problems.push(`expected 42 rendered Scene09 video prompt briefs, got ${videoPromptBriefs}`);
if (fullPromptLinks !== 42) problems.push(`expected 42 full prompt links, got ${fullPromptLinks}`);
if (fullNegativeLinks !== 42) problems.push(`expected 42 full negative prompt links, got ${fullNegativeLinks}`);
if (fullLocalVisualReviewLabels !== 42) problems.push(`expected 42 full local visual review labels, got ${fullLocalVisualReviewLabels}`);
if (fullLocalVisualReviewReportLinks !== 42) problems.push(`expected 42 full local visual review report links, got ${fullLocalVisualReviewReportLinks}`);
if (fullLocalVisualReviewJsonLinks !== 42) problems.push(`expected 42 full local visual review JSON links, got ${fullLocalVisualReviewJsonLinks}`);
if (!hasVideoPromptBriefLabels) problems.push("Scene09 video prompt briefs do not expose prompt/negative labels and links");
if (readinessChipSets !== 42) problems.push(`expected 42 rendered readiness chip sets, got ${readinessChipSets}`);
if (readinessChips !== 210) problems.push(`expected 210 rendered readiness chips, got ${readinessChips}`);
if (videoPendingChips !== 42) problems.push(`expected 42 rendered video pending chips, got ${videoPendingChips}`);
if (!hasCurrentClipsPendingState) problems.push("Scene09 operator status does not expose the current clips-pending state");
if (storyboardGridHtml.includes("phase=clips_pending;")) problems.push("Scene09 operator status is leaking raw machine status_line text into the main board");

const result = {
  date: "2026-08-03",
  decision: problems.length ? "ep02_web_battle_event_panel_audit_failed" : "ep02_web_battle_event_panel_audit_passed",
  site_data: siteDataPath,
  app: appPath,
  scene09_shots: scene09Shots.length,
  shots_with_battle_ledger: ledgerShots.length,
  shots_with_defeated_removed_state: defeatedShots.length,
  shots_with_objective_defeated_state: objectiveShots.length,
  shots_full_local_visual_review_monitor_required: fullLocalVisualReviewShots.length,
  shots_accepted_for_motion_probe_only: motionProbeAcceptedShots.length,
  rendered_battle_event_panels: eventPanels,
  rendered_shot_cards: shotCards,
  rendered_primary_frame_strips: primaryFrameStrips,
  rendered_frame_cards: frameCards,
  rendered_duplicate_lead_image_buttons: leadImageButtons,
  rendered_shot_review_briefs: reviewBriefs,
  rendered_shot_review_brief_labels: hasReviewBriefLabels,
  rendered_continuity_lock_strips: continuityLockStrips,
  rendered_continuity_lock_labels: hasContinuityLockLabels,
  rendered_video_prompt_briefs: videoPromptBriefs,
  rendered_full_prompt_links: fullPromptLinks,
  rendered_full_negative_links: fullNegativeLinks,
  rendered_full_local_visual_review_labels: fullLocalVisualReviewLabels,
  rendered_full_local_visual_review_report_links: fullLocalVisualReviewReportLinks,
  rendered_full_local_visual_review_json_links: fullLocalVisualReviewJsonLinks,
  rendered_video_prompt_brief_labels: hasVideoPromptBriefLabels,
  rendered_current_clips_pending_state: hasCurrentClipsPendingState,
  rendered_readiness_chip_sets: readinessChipSets,
  rendered_readiness_chips: readinessChips,
  rendered_video_pending_chips: videoPendingChips,
  rendered_priority_review_queue_rows: scene09ReviewQueueRows,
  rendered_priority_review_queue_anchors: scene09ReviewQueueAnchors,
  shots_with_model_ready_prompt_links: modelReadyPromptShots.length,
  operator_probe_zip_batches: operatorProbeZipBatches.length,
  operator_probe_return_batches: operatorProbeReturnBatches.length,
  motion_probe_operator_tracker_decision: motionProbeOperatorTracker?.decision || "missing",
  motion_probe_operator_tracker_rows: motionProbeOperatorTracker?.expected_probe_rows || 0,
  required_rendered_text_checked: requiredRenderedText.length,
  forbidden_top_clutter_checked: forbiddenTopClutterText.length,
  scene09_top_surface: "latest_shot_cards_direct_no_priority_queue",
  storyboard_links_hidden: storyboardLinksHidden,
  problems,
  report_json: reportJson,
  package_report_json: packageReportJson,
};

fs.writeFileSync(reportJson, `${JSON.stringify(result, null, 2)}\n`);
fs.writeFileSync(packageReportJson, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
process.exit(problems.length ? 1 : 0);
