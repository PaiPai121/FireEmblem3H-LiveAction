const fs = require("fs");
const path = require("path");

const outputDir = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21";
const queuePath = path.join(outputDir, "frame_generation_queue.json");
const qaPath = path.join(outputDir, "qa_manifest.json");
const deliveryManifestPath = "production_system/video_delivery_manifest.json";
const handoffDir = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const handoffAuditPath = path.join(handoffDir, "handoff_validation.json");
const handoffRunbookPath = path.join(handoffDir, "RUNBOOK.md");
const handoffQueuePath = path.join(handoffDir, "submission_queue.csv");
const handoffMotionQaChecklistPath = path.join(handoffDir, "clip_motion_qa_checklist.csv");
const clipQaPath = "production_system/scene09_v3_attrition_package/scene09_v3_generated_clip_structural_audit_2026-08-01.json";
const clipQaMdPath = "production_system/scene09_v3_attrition_package/scene09_v3_generated_clip_structural_audit_2026-08-01.md";
const battleLedgerTimelinePath = "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.md";
const battleLedgerTimelineCsvPath = "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.csv";
const battleLedgerTimelineJsonPath = "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json";
const executionAssetIntegrityPath = "production_system/scene09_v3_attrition_package/scene09_v3_execution_asset_integrity_2026-07-28.md";
const executionAssetIntegrityCsvPath = "production_system/scene09_v3_attrition_package/scene09_v3_execution_asset_integrity_2026-07-28.csv";
const executionAssetIntegrityJsonPath = "production_system/scene09_v3_attrition_package/scene09_v3_execution_asset_integrity_2026-07-28.json";
const clipReviewPath = path.join(outputDir, "clip_review.html");
const animaticPath = "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_frame_animatic_2026-07-27.mp4";
const animaticReportPath = "production_system/scene09_v3_attrition_package/scene09_v3_frame_animatic_2026-07-27.md";
const outputPath = path.join(outputDir, "index.html");

function esc(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function rel(file) {
  return path.relative(outputDir, file);
}

function filePanel(file, label, caption) {
  if (file && fs.existsSync(file)) {
    return `<img src="${esc(rel(file))}" alt="${esc(label)}">`;
  }
  return `<div class="missing">${esc(label.toUpperCase())} MISSING</div>`;
}

function linkIfExists(file, label) {
  if (!file || !fs.existsSync(file)) return `<span class="missing-link">${esc(label)} missing</span>`;
  return `<a href="${esc(rel(file))}">${esc(label)}</a>`;
}

function readJsonIfExists(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const scene09ChineseTitles = {
  Shot025: "规则与目标确立",
  Shot025A: "战场地形插入",
  Shot026: "贝雷特分配职责",
  Shot026B: "青狮观察战场",
  Shot026C: "第一轮推进",
  Shot027: "亚修架设掩护线",
  Shot027B: "黑鹫第一波压上",
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
  Shot032: "杜笃与梅尔塞德斯重建盾线",
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
};

function chineseTitleForShot(shot) {
  return scene09ChineseTitles[shot] || "";
}

function formatByHouse(groups) {
  if (!groups) return "";
  return Object.entries(groups)
    .filter(([, names]) => Array.isArray(names) && names.length)
    .map(([house, names]) => `<li><b>${esc(house)}</b>: ${esc(names.join(", "))}</li>`)
    .join("");
}

function rosterPanel(roster) {
  if (!roster) return "";
  const battle = roster.battle_after || {};
  const ledger = roster.battle_ledger_after || battle.battle_ledger_after || {};
  const alive = formatByHouse(ledger.alive_by_house || battle.alive_by_house || roster.alive_by_house);
  const active = formatByHouse(ledger.still_active_or_controlling_objective_by_house || battle.active_or_available_by_house || roster.active_by_house);
  const limited = formatByHouse(ledger.limited_but_not_defeated_by_house || battle.limited_not_out_by_house || roster.limited_by_house);
  const retired = formatByHouse(ledger.mock_battle_defeated_or_removed_by_house || battle.defeated_or_retired_by_rule_by_house || roster.retired_or_out_by_house);
  const captured = formatByHouse(ledger.captured_or_objective_defeated_by_house);
  const stoodDown = formatByHouse(ledger.stood_down_or_post_battle_by_house);
  const changed = (roster.changed_this_shot || [])
    .map((item) => `<span>${esc(item.name)}: ${esc(item.label || item.status)}</span>`)
    .join("");
  return `
        <h3>镜头后战况账本</h3>
        <p class="roster-life"><b>全员生命安全:</b> ${ledger.all_named_characters_alive === false || roster.all_alive === false ? "no" : "yes"} · <b>规则:</b> 击败/被俘/目标判负/退场只表示模拟战行动资格，不表示死亡或重伤。</p>
        ${ledger.note_cn ? `<p class="roster-note">${esc(ledger.note_cn)}</p>` : battle.summary_cn ? `<p class="roster-note">${esc(battle.summary_cn)}</p>` : ""}
        <p class="roster-note">${esc(roster.after_shot_note || "")}</p>
        ${roster.result ? `<p class="roster-result">${esc(roster.result)}</p>` : ""}
        <div class="roster-grid">
          <div>
            <h4>安全存活 / 非致命</h4>
            <ul>${alive || "<li>No roster list.</li>"}</ul>
          </div>
          <div>
            <h4>本镜头改变</h4>
            <div class="checks">${changed || "<span>no_change</span>"}</div>
          </div>
          <div>
            <h4>仍可行动 / 控制目标</h4>
            <ul>${active || "<li>No active combatant.</li>"}</ul>
          </div>
          <div>
            <h4>受限但未败</h4>
            <ul>${limited || "<li>None.</li>"}</ul>
          </div>
          <div>
            <h4>已击败 / 被俘 / 退场</h4>
            <ul>${retired || "<li>None.</li>"}</ul>
          </div>
          <div>
            <h4>被俘 / 目标判负</h4>
            <ul>${captured || "<li>None.</li>"}</ul>
          </div>
          <div>
            <h4>收手 / 赛后</h4>
            <ul>${stoodDown || "<li>None.</li>"}</ul>
          </div>
        </div>
        ${roster.continuity_lock ? `<p class="roster-lock">${esc(roster.continuity_lock)}</p>` : ""}
  `;
}

function manifestStatePanel(state) {
  if (!state) return "";
  const ledger = state.battle_ledger_after || {};
  const alive = formatByHouse(ledger.alive_by_house);
  const active = formatByHouse(ledger.still_active_or_controlling_objective_by_house || state.active_by_house);
  const limited = formatByHouse(ledger.limited_but_not_defeated_by_house);
  const inactive = formatByHouse(ledger.mock_battle_defeated_or_removed_by_house || state.inactive_by_house);
  const captured = formatByHouse(ledger.captured_or_objective_defeated_by_house);
  const stoodDown = formatByHouse(ledger.stood_down_or_post_battle_by_house);
  const mustNotReturn = formatByHouse(ledger.must_not_return_active_by_house);
  const visible = state.visible_named_only || [];
  const statusTags = Object.entries(state.statuses_after || {})
    .filter(([, status]) => status !== "active_available")
    .map(([name, status]) => `<span>${esc(name)}: ${esc(status)}</span>`)
    .join("");
  const changedTags = (ledger.changed_this_shot || [])
    .map((item) => `<span>${esc(item.name || item)}${item.status || item.label ? `: ${esc(item.status || item.label)}` : ""}</span>`)
    .join("");
  return `
        <h3>镜头后战况账本</h3>
        <p class="roster-life"><b>全员生命安全:</b> ${ledger.all_named_characters_alive === false ? "no" : "yes"} · <b>规则:</b> ${esc(ledger.rule_cn || "击败/被俘/目标判负/退场只表示模拟战行动资格，不表示死亡或重伤。")}</p>
        <p class="roster-note">${esc(ledger.note_cn || state.note || "")}</p>
        ${state.result ? `<p class="roster-result">${esc(state.result)}</p>` : ""}
        <div class="roster-grid">
          <div>
            <h4>本镜头可见具名人物</h4>
            <ul>${visible.length ? `<li>${esc(visible.join(", "))}</li>` : "<li>None.</li>"}</ul>
          </div>
          <div>
            <h4>安全存活 / 非致命</h4>
            <ul>${alive || "<li>No roster list.</li>"}</ul>
          </div>
          <div>
            <h4>本镜头改变</h4>
            <div class="checks">${changedTags || "<span>no_change</span>"}</div>
          </div>
          <div>
            <h4>仍可行动 / 控制目标</h4>
            <ul>${active || "<li>No active combatant.</li>"}</ul>
          </div>
          <div>
            <h4>受限但未败</h4>
            <ul>${limited || "<li>None.</li>"}</ul>
          </div>
          <div>
            <h4>已击败 / 被俘 / 退场，不可主动战斗</h4>
            <ul>${inactive || "<li>None.</li>"}</ul>
          </div>
          <div>
            <h4>被俘 / 目标判负</h4>
            <ul>${captured || "<li>None.</li>"}</ul>
          </div>
          <div>
            <h4>收手 / 赛后</h4>
            <ul>${stoodDown || "<li>None.</li>"}</ul>
          </div>
          <div>
            <h4>不得重新主动参战</h4>
            <ul>${mustNotReturn || "<li>None.</li>"}</ul>
          </div>
          <div>
            <h4>非默认状态</h4>
            <div class="checks">${statusTags || "<span>no_change</span>"}</div>
          </div>
        </div>
  `;
}

const useDeliveryManifest = fs.existsSync(deliveryManifestPath);
const deliveryManifest = useDeliveryManifest ? JSON.parse(fs.readFileSync(deliveryManifestPath, "utf8")) : null;
const handoffAudit = readJsonIfExists(handoffAuditPath);
const clipQa = readJsonIfExists(clipQaPath);
const queue = useDeliveryManifest ? [] : JSON.parse(fs.readFileSync(queuePath, "utf8"));
const qa = !useDeliveryManifest && fs.existsSync(qaPath) ? JSON.parse(fs.readFileSync(qaPath, "utf8")) : { shots: {} };

const galleryItems = useDeliveryManifest
  ? deliveryManifest.shots.map((shot) => ({
    shot: shot.shot,
    title: chineseTitleForShot(shot.shot) || shot.title || shot.shot,
    batch: shot.version_tag,
    status: shot.status,
    purpose: shot.battle_state_after?.note || shot.id,
    start: shot.start_frame,
    key: shot.key_frame,
    end: shot.end_frame,
    startCaption: "V3 manifest start frame",
    keyCaption: "V3 manifest key frame",
    endCaption: shot.end_frame_status,
    charactersHtml: `<li>${esc((shot.visible_named_only || []).join(", ") || "No readable named character.")}</li>`,
    stateHtml: manifestStatePanel(shot.battle_state_after),
    promptHtml: `<a href="${esc(rel(shot.prompt_path))}">${esc(shot.prompt_path)}</a><br>${esc(shot.audio_anchor || "")}`,
    checksHtml: [
      `<span>decision: ${esc(deliveryManifest.decision)}</span>`,
      `<span>prompt_contract: ${esc(deliveryManifest.validation?.prompt_contract || "")}</span>`,
      `<span>end_frame_status: ${esc(shot.end_frame_status || "")}</span>`,
    ].join(""),
  }))
  : queue.map((item) => {
    const status = qa.shots?.[item.shot] || {};
    const endPath = item.frames.end?.path || item.frames.key.path.replace(/_key\.png$/, "_end.png");
    const checks = status.checks || {};
    return {
      shot: item.shot,
      title: chineseTitleForShot(item.shot) || item.title || item.shot,
      batch: item.priority_batch,
      status: status.decision || item.status,
      purpose: item.purpose,
      start: item.frames.start.path,
      key: item.frames.key.path,
      end: endPath,
      startCaption: item.frames.start.intent,
      keyCaption: item.frames.key.intent,
      endCaption: item.frames.end?.intent || "Pending final end frame lock.",
      charactersHtml: (item.characters || []).map((character) => `<li>${esc(character.name)} - ${esc(character.weapon_lock)}</li>`).join("") || "<li>No readable named character.</li>",
      stateHtml: rosterPanel(item.roster_after),
      promptHtml: esc(item.video_prompt),
      checksHtml: Object.entries(checks).map(([key, value]) => `<span>${esc(key)}: ${esc(value)}</span>`).join("") || "<span>not_reviewed</span>",
    };
  });

const rows = galleryItems.map((item) => {
  return `
    <article class="shot">
      <header>
        <div>
          <p class="batch">${esc(item.batch)}</p>
          <h2>${esc(item.title)}</h2>
        </div>
        <strong class="status">${esc(item.status)}</strong>
      </header>
      <p class="purpose">${esc(item.purpose)}</p>
      <div class="frames">
        <figure>
          ${filePanel(item.start, `${item.shot} start frame`)}
          <figcaption><b>Start</b>${esc(item.startCaption)}</figcaption>
        </figure>
        <figure>
          ${filePanel(item.key, `${item.shot} key frame`)}
          <figcaption><b>Key</b>${esc(item.keyCaption)}</figcaption>
        </figure>
        <figure>
          ${filePanel(item.end, `${item.shot} end frame`)}
          <figcaption><b>End</b>${esc(item.endCaption)}</figcaption>
        </figure>
      </div>
      <section class="meta">
        <h3>Allowed Readable Humans</h3>
        <ul>${item.charactersHtml}</ul>
        ${item.stateHtml}
        <h3>Video prompt</h3>
        <p>${item.promptHtml}</p>
        <h3>QA checks</h3>
        <div class="checks">${item.checksHtml}</div>
      </section>
    </article>
  `;
}).join("");

const generatedCount = galleryItems.reduce((count, item) => {
  return (
    count +
    (fs.existsSync(item.start) ? 1 : 0) +
    (fs.existsSync(item.key) ? 1 : 0) +
    (fs.existsSync(item.end) ? 1 : 0)
  );
}, 0);
const generatedEndCount = galleryItems.reduce((count, item) => {
  return count + (fs.existsSync(item.end) ? 1 : 0);
}, 0);
const totalFrames = galleryItems.length * 3;
const sourceLabel = useDeliveryManifest
  ? `V3 manifest: ${deliveryManifestPath}; package status: ${deliveryManifest.status}; decision: ${deliveryManifest.decision}`
  : "Legacy frame_generation_queue fallback";

const dashboardHtml = `
    <section class="dashboard">
      <div class="dash-card">
        <h2>下游提交包</h2>
        <p>${esc(handoffAudit?.decision || "not_built")}</p>
        <div class="checks">
          <span>shots: ${esc(handoffAudit?.total_shots || 0)}/42</span>
          <span>duration: ${esc(handoffAudit?.total_duration_seconds || 0)}s</span>
          <span>model_cli: ${handoffAudit?.model_cli_configured ? "configured" : "not_configured"}</span>
          <span>failures: ${esc(handoffAudit?.validation_failures?.length || 0)}</span>
        </div>
        <p>${linkIfExists(handoffDir, "handoff package")} · ${linkIfExists(handoffRunbookPath, "RUNBOOK")} · ${linkIfExists(handoffQueuePath, "submission_queue.csv")} · ${linkIfExists(handoffMotionQaChecklistPath, "clip_motion_qa_checklist.csv")} · ${linkIfExists(executionAssetIntegrityPath, "execution asset integrity")} · ${linkIfExists(executionAssetIntegrityCsvPath, "execution integrity csv")} · ${linkIfExists(executionAssetIntegrityJsonPath, "execution integrity json")} · ${linkIfExists(battleLedgerTimelinePath, "battle ledger timeline")} · ${linkIfExists(battleLedgerTimelineCsvPath, "battle ledger csv")} · ${linkIfExists(battleLedgerTimelineJsonPath, "battle ledger json")}</p>
      </div>
      <div class="dash-card">
        <h2>真实视频剪辑 QA</h2>
        <p>${esc(clipQa?.decision || "not_run")}</p>
        <div class="checks">
          <span>expected: ${esc(clipQa?.expected_clips || 0)}</span>
          <span>ready: ${esc(clipQa?.ready_clips || 0)}</span>
          <span>missing: ${esc(clipQa?.missing_clips || 0)}</span>
          <span>failed: ${esc(clipQa?.failed_clips || 0)}</span>
        </div>
        <p>${linkIfExists(clipReviewPath, "逐镜头 Clip Review")} · ${linkIfExists(clipQaMdPath, "clip QA report")}</p>
      </div>
      <div class="dash-card wide">
        <h2>静帧 Animatic 参考片</h2>
        <p>animatic_reference_only，不是 AI 视频模型输出，不能当最终 clip approval。</p>
        ${fs.existsSync(animaticPath) ? `<video controls preload="metadata" src="${esc(rel(animaticPath))}"></video>` : `<div class="pending">ANIMATIC PENDING</div>`}
        <p>${linkIfExists(animaticPath, "animatic mp4")} · ${linkIfExists(animaticReportPath, "animatic report")}</p>
      </div>
    </section>
`;

const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Scene09 V3 视频资产图审面板</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #111315;
        --panel: #1a1d20;
        --line: #31363b;
        --text: #f4f0e8;
        --muted: #b7b0a5;
        --accent: #d7b46a;
        --bad: #9b3d3d;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: var(--bg);
        color: var(--text);
      }
      header.hero {
        position: sticky;
        top: 0;
        z-index: 2;
        padding: 20px 28px;
        background: rgba(17, 19, 21, 0.94);
        border-bottom: 1px solid var(--line);
        backdrop-filter: blur(12px);
      }
      h1 { margin: 0 0 8px; font-size: 26px; letter-spacing: 0; }
      .summary { margin: 0; color: var(--muted); }
      main {
        display: grid;
        gap: 18px;
        padding: 22px;
      }
      .dashboard {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        padding: 18px 22px 0;
      }
      .dash-card {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        padding: 16px;
      }
      .dash-card.wide { grid-column: 1 / -1; }
      .dash-card h2 { font-size: 18px; margin: 0 0 8px; }
      .dash-card p { margin: 8px 0 0; color: var(--muted); line-height: 1.5; }
      .dash-card video {
        width: 100%;
        max-height: 62vh;
        margin-top: 12px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #0d0f10;
      }
      a { color: var(--accent); }
      .missing-link { color: #ffd8d8; }
      .shot {
        border: 1px solid var(--line);
        background: var(--panel);
        border-radius: 8px;
        overflow: hidden;
      }
      .shot > header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 18px 10px;
        border-bottom: 1px solid var(--line);
      }
      .batch { margin: 0 0 4px; color: var(--accent); font-size: 12px; text-transform: uppercase; }
      h2 { margin: 0; font-size: 22px; letter-spacing: 0; }
      .status { color: var(--muted); font-size: 13px; text-align: right; }
      .purpose { margin: 12px 18px; color: var(--muted); }
      .frames {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        padding: 0 18px 18px;
      }
      figure { margin: 0; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: #0d0f10; }
      img, .missing, .pending {
        width: 100%;
        aspect-ratio: 16 / 9;
        display: grid;
        place-items: center;
        object-fit: cover;
      }
      .missing {
        color: #ffd8d8;
        background: repeating-linear-gradient(135deg, #231111, #231111 12px, #2c1717 12px, #2c1717 24px);
        font-weight: 700;
      }
      .pending {
        color: #d7b46a;
        background: repeating-linear-gradient(135deg, #171511, #171511 12px, #222015 12px, #222015 24px);
        font-weight: 700;
      }
      figcaption { padding: 10px 12px; color: var(--muted); line-height: 1.5; }
      figcaption b { display: block; color: var(--text); margin-bottom: 4px; }
      .meta {
        padding: 0 18px 18px;
        display: grid;
        gap: 10px;
      }
      h3 { margin: 0; font-size: 14px; color: var(--accent); }
      h4 { margin: 0 0 6px; font-size: 12px; color: var(--text); }
      ul, .meta p { margin: 0; color: var(--muted); line-height: 1.5; }
      .roster-note { color: var(--text); }
      .roster-life, .roster-lock { color: var(--muted); }
      .roster-result { color: var(--accent); }
      .roster-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
        gap: 10px;
      }
      .roster-grid > div {
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 10px;
        background: rgba(255,255,255,0.025);
      }
      .roster-grid ul {
        padding-left: 18px;
        font-size: 12px;
      }
      .checks { display: flex; flex-wrap: wrap; gap: 8px; }
      .checks span {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 4px 8px;
        color: var(--muted);
        font-size: 12px;
      }
      @media (max-width: 820px) {
        .frames { grid-template-columns: 1fr; }
        .dashboard { grid-template-columns: 1fr; }
        .roster-grid { grid-template-columns: 1fr; }
        header.hero { position: static; }
      }
    </style>
  </head>
  <body>
    <header class="hero">
      <h1>Scene09 V3 视频资产图审面板</h1>
      <p class="summary">Source: ${esc(sourceLabel)}. Frames present: ${generatedCount}/${totalFrames}; end frames: ${generatedEndCount}/${galleryItems.length}. This file is safe to open directly with file:// and reflects the active V3 delivery manifest when present.</p>
    </header>
    ${dashboardHtml}
    <main>${rows}</main>
  </body>
</html>
`;

fs.writeFileSync(outputPath, html);
console.log(`wrote ${outputPath} (${generatedCount}/${totalFrames} frames present)`);
