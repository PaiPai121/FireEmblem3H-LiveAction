const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputDir = path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21");
const outputPath = path.join(outputDir, "clip_review.html");
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const handoffAuditPath = path.join(packageDir, "handoff_validation.json");
const runbookPath = path.join(packageDir, "RUNBOOK.md");
const submissionQueuePath = path.join(packageDir, "submission_queue.csv");
const submissionPayloadPath = path.join(packageDir, "submission_payload.jsonl");
const submissionPayloadManifestPath = path.join(packageDir, "submission_payload_manifest.json");
const packageClipRevisionQueuePath = path.join(packageDir, "clip_revision_queue.csv");
const motionChecklistPath = path.join(packageDir, "clip_motion_qa_checklist.csv");
const motionReviewAssetsPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_motion_review_assets_2026-07-28.md");
const motionReviewAssetsJsonPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_motion_review_assets_2026-07-28.json");
const motionReviewAssetsHtmlPath = path.join(outputDir, "clip_motion_review_assets.html");
const motionReviewDecisionsPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_motion_review_decisions_2026-07-28.md");
const motionReviewDecisionsJsonPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_motion_review_decisions_2026-07-28.json");
const clipRevisionQueuePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_revision_queue_2026-07-28.md");
const clipRevisionQueueJsonPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_revision_queue_2026-07-28.json");
const clipRevisionQueueCsvPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_revision_queue_2026-07-28.csv");
const clipIngestReportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_ingest_report_2026-07-28.md");
const clipIngestReportJsonPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_ingest_report_2026-07-28.json");
const proxyAnimaticReportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_proxy_animatic_clips_2026-07-28.md");
const proxyAnimaticReportJsonPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_proxy_animatic_clips_2026-07-28.json");
const proxyAnimaticEditPath = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_proxy_animatic_edit_2026-07-28.mp4");
const clipQaPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_generated_clip_structural_audit_2026-08-01.json");
const clipQaMdPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_generated_clip_structural_audit_2026-08-01.md");
const storyAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_story_constraint_audit_2026-07-27.md");
const battleLedgerTimelinePath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.md");
const battleLedgerTimelineCsvPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.csv");
const battleLedgerTimelineJsonPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json");
const executionAssetIntegrityPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_execution_asset_integrity_2026-07-28.md");
const executionAssetIntegrityCsvPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_execution_asset_integrity_2026-07-28.csv");
const executionAssetIntegrityJsonPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_execution_asset_integrity_2026-07-28.json");
const attritionTimelineAuditPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_attrition_visibility_timeline_audit_2026-07-28.md");
const attritionTimelineAuditJsonPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_attrition_visibility_timeline_audit_2026-07-28.json");
const mainGalleryPath = path.join(outputDir, "index.html");
const animaticPath = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_frame_animatic_2026-07-27.mp4");

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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
  Shot029C: "库罗德读出两个缺口",
  Shot029D: "库罗德逼退亚修",
  Shot029B: "金鹿全面施压",
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
  Shot034C: "菲力克斯挡下斐迪南",
  Shot034D: "贝雷特中断教师目标反扑",
  Shot034B: "空教师目标裁定",
  Shot034E: "金鹿高光后收势",
  Shot034F: "黑鹫高光后收势",
  Shot034G: "青狮核心险胜收势",
  Shot034: "全场胜负关系落定",
  Shot035: "菲力克斯的敬意",
  Shot036: "帝弥托利战后余韵",
};

function displayTitleForShot(shot) {
  const shotNumber = String(shot || "").replace(/^Shot/, "");
  const localized = scene09ChineseTitles[shot];
  return localized ? `镜头${shotNumber}：${localized}` : `镜头${shotNumber || shot}`;
}

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function absFromRoot(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
}

function rel(file) {
  return path.relative(outputDir, absFromRoot(file));
}

function linkIfExists(file, label) {
  const absolute = absFromRoot(file);
  if (!fs.existsSync(absolute)) return `<span class="missing-link">${esc(label)} missing</span>`;
  return `<a href="${esc(rel(absolute))}">${esc(label)}</a>`;
}

function framePanel(file, label) {
  if (!fs.existsSync(file)) {
    return `<div class="missing">${esc(label)} MISSING</div>`;
  }
  return `<a href="${esc(rel(file))}"><img src="${esc(rel(file))}" alt="${esc(label)}"></a>`;
}

function videoPanel(file, expectedClip) {
  if (!fs.existsSync(file)) {
    return `<div class="clip-pending"><b>CLIP PENDING</b><span>${esc(expectedClip)}</span></div>`;
  }
  return `<video controls preload="metadata" src="${esc(rel(file))}"></video>`;
}

function proxyClipPath(shot) {
  return path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/proxy_animatic_clips", `${String(shot.order).padStart(2, "0")}_${shot.shot}_proxy_animatic.mp4`);
}

function formatGroupMap(groups) {
  if (!groups) return "<li>None.</li>";
  const rows = Object.entries(groups)
    .filter(([, names]) => Array.isArray(names) && names.length)
    .map(([group, names]) => `<li><b>${esc(group)}</b>: ${esc(names.join(", "))}</li>`);
  return rows.length ? rows.join("") : "<li>None.</li>";
}

function formatTags(values) {
  const list = Array.isArray(values) ? values : [];
  return list.length ? list.map((value) => `<span>${esc(value)}</span>`).join("") : "<span>none</span>";
}

function formatChanged(changes) {
  const list = Array.isArray(changes) ? changes : [];
  return list.length
    ? list.map((item) => `<span>${esc(item.name || item)}${item.status || item.label ? `: ${esc(item.status || item.label)}` : ""}</span>`).join("")
    : "<span>no_change</span>";
}

function parseRejectIf(prompt) {
  const match = prompt.match(/Reject If:\n([\s\S]*?)(?:\n\nNegative Prompt:|\nNegative Prompt:|$)/);
  if (!match) return [];
  return match[1]
    .split(/\n/)
    .map((line) => line.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean);
}

function parseContinuityLocks(prompt) {
  const match = prompt.match(/Continuity Locks:\n([\s\S]*?)(?:\n\nBattle Ledger After This Shot:|\nBattle Ledger After This Shot:|$)/);
  if (!match) return [];
  return match[1]
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function metadataFor(shot) {
  const shotDir = path.join(packageDir, shot.package_dir);
  return {
    shotDir,
    metadataPath: path.join(shotDir, "metadata.json"),
    promptPath: path.join(shotDir, "prompt.md"),
    modelPromptPath: path.join(shotDir, "model_prompt.md"),
    negativePath: path.join(shotDir, "negative_prompt.md"),
    startFrame: path.join(shotDir, "start_frame.png"),
    keyFrame: path.join(shotDir, "key_frame.png"),
    endFrame: path.join(shotDir, "end_frame.png"),
  };
}

function ledgerPanel(metadata) {
  const battle = metadata.battle_state_after || {};
  const nested = battle.battle_after || {};
  const ledger = nested.battle_ledger_after || battle.battle_ledger_after || {};
  return `
    <section class="ledger">
      <h3>镜头后战况账本</h3>
      <p>${esc(battle.after_shot_note || ledger.note_cn || nested.summary_cn || "")}</p>
      <div class="ledger-grid">
        <div><h4>安全存活 / 非致命</h4><ul>${formatGroupMap(ledger.alive_by_house || nested.alive_by_house)}</ul></div>
        <div><h4>仍可行动 / 控制目标</h4><ul>${formatGroupMap(ledger.still_active_or_controlling_objective_by_house || nested.active_or_available_by_house)}</ul></div>
        <div><h4>受限但未败</h4><ul>${formatGroupMap(ledger.limited_but_not_defeated_by_house || nested.limited_not_out_by_house)}</ul></div>
        <div><h4>已击败 / 被俘 / 退场，不可主动战斗</h4><ul>${formatGroupMap(ledger.mock_battle_defeated_or_removed_by_house || nested.defeated_or_retired_by_rule_by_house)}</ul></div>
        <div><h4>被俘 / 目标判负</h4><ul>${formatGroupMap(ledger.captured_or_objective_defeated_by_house)}</ul></div>
        <div><h4>收手 / 赛后</h4><ul>${formatGroupMap(ledger.stood_down_or_post_battle_by_house)}</ul></div>
        <div><h4>必须保持非主动</h4><ul>${formatGroupMap(ledger.must_not_return_active_by_house || nested.must_not_return_active_by_house)}</ul></div>
      </div>
      <div class="tags">${formatChanged(ledger.changed_this_shot || nested.changed_this_shot || battle.changed_this_shot)}</div>
    </section>
  `;
}

function shotCard(shot, clipRow) {
  const files = metadataFor(shot);
  const metadata = readJson(files.metadataPath, {});
  const prompt = readText(files.promptPath);
  const negative = readText(files.negativePath);
  const rejectIf = parseRejectIf(prompt);
  const continuityLocks = parseContinuityLocks(prompt);
  const expectedClipAbs = absFromRoot(shot.expected_clip);
  const clip = clipRow?.clip || { exists: fs.existsSync(expectedClipAbs), ok: false, issue: fs.existsSync(expectedClipAbs) ? "not_audited" : "missing_clip" };
  const clipDecision = clip.ok ? "integrity_passed_motion_review_required" : clip.issue || "clip_pending";
  const visible = metadata.visible_named_only || shot.visible_named_only || [];

  return `
    <article class="shot-card" data-shot="${esc(shot.shot)}">
      <header>
        <div>
          <p class="eyebrow">${String(shot.order).padStart(2, "0")} · ${esc(shot.id)}</p>
          <h2>${esc(displayTitleForShot(shot.shot))}</h2>
        </div>
        <strong>${esc(clipDecision)}</strong>
      </header>

      <section class="clip-row">
        <div>
          <h3>Expected Clip</h3>
          ${videoPanel(expectedClipAbs, shot.expected_clip)}
        </div>
        <div>
          <h3>Proxy Animatic Reference</h3>
          ${videoPanel(proxyClipPath(shot), `${String(shot.order).padStart(2, "0")}_${shot.shot}_proxy_animatic.mp4`)}
        </div>
        <div class="clip-meta">
          <h3>Clip Integrity</h3>
          <div class="tags">
            <span>duration_target: ${esc(shot.duration_seconds)}s</span>
            <span>handoff_status: ${esc(shot.status)}</span>
            <span>clip_exists: ${clip.exists ? "yes" : "no"}</span>
            <span>clip_ok: ${clip.ok ? "yes" : "no"}</span>
            ${clip.duration_seconds ? `<span>actual_duration: ${esc(Number(clip.duration_seconds).toFixed(2))}s</span>` : ""}
            ${clip.codec_name ? `<span>codec: ${esc(clip.codec_name)}</span>` : ""}
            ${clip.width && clip.height ? `<span>${esc(clip.width)}x${esc(clip.height)}</span>` : ""}
          </div>
          <p><b>Primary check:</b> ${esc(metadata.primary_check || shot.primary_check || "")}</p>
          <p><b>Allowed readable humans:</b> ${esc(visible.join(", ") || "none")}</p>
        </div>
      </section>

      <section class="frames">
        <figure>${framePanel(files.startFrame, `${shot.shot} start_frame`)}<figcaption>start_frame.png</figcaption></figure>
        <figure>${framePanel(files.keyFrame, `${shot.shot} key_frame`)}<figcaption>key_frame.png</figcaption></figure>
        <figure>${framePanel(files.endFrame, `${shot.shot} end_frame`)}<figcaption>end_frame.png</figcaption></figure>
      </section>

      ${ledgerPanel(metadata)}

      <section class="qa">
        <h3>Continuity Locks</h3>
        <ul>${continuityLocks.map((item) => `<li>${esc(item)}</li>`).join("") || "<li>No continuity lock parsed.</li>"}</ul>
        <h3>Reject If</h3>
        <ul>${rejectIf.map((item) => `<li>${esc(item)}</li>`).join("") || "<li>No reject criteria parsed.</li>"}</ul>
        <p>${linkIfExists(files.promptPath, "prompt.md")} · ${linkIfExists(files.modelPromptPath, "model_prompt.md")} · ${linkIfExists(files.negativePath, "negative_prompt.md")} · ${linkIfExists(files.metadataPath, "metadata.json")} · ${linkIfExists(files.shotDir, "shot folder")}</p>
        <details>
          <summary>Prompt Text</summary>
          <pre>${esc(prompt)}</pre>
        </details>
        <details>
          <summary>Negative Prompt</summary>
          <pre>${esc(negative)}</pre>
        </details>
      </section>
    </article>
  `;
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const handoffAudit = readJson(handoffAuditPath, {});
  const clipQa = readJson(clipQaPath, { rows: [] });
  const motionDecisions = readJson(motionReviewDecisionsJsonPath, {});
  const clipRevisionQueue = readJson(clipRevisionQueueJsonPath, {});
  const clipById = new Map((clipQa.rows || []).map((row) => [row.id, row]));
  const cards = manifest.shots.map((shot) => shotCard(shot, clipById.get(shot.id))).join("");

  const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Scene09 V3 逐镜头真实剪辑验收台</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #101112;
        --panel: #191b1d;
        --subpanel: #202326;
        --line: #34393f;
        --text: #f5f1e9;
        --muted: #bdb6aa;
        --accent: #d5b56f;
        --warn: #e0a24f;
        --bad: #c76d6d;
        --ok: #78b894;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      a { color: var(--accent); }
      .top {
        position: sticky;
        top: 0;
        z-index: 2;
        padding: 18px 24px;
        background: rgba(16, 17, 18, 0.96);
        border-bottom: 1px solid var(--line);
        backdrop-filter: blur(10px);
      }
      h1 { margin: 0 0 8px; font-size: 26px; letter-spacing: 0; }
      h2 { margin: 0; font-size: 22px; letter-spacing: 0; }
      h3 { margin: 0 0 8px; font-size: 14px; color: var(--accent); letter-spacing: 0; }
      h4 { margin: 0 0 6px; font-size: 12px; }
      p, li { color: var(--muted); line-height: 1.5; }
      .summary {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 12px;
        padding: 18px 24px 0;
      }
      .summary-card, .shot-card {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
      }
      .summary-card { padding: 14px; }
      .summary-card p { margin: 0; font-size: 22px; color: var(--text); }
      .summary-card span { color: var(--muted); font-size: 12px; }
      .links {
        padding: 12px 24px 0;
        color: var(--muted);
      }
      .self-audit-gate {
        margin: 12px 24px 0;
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--subpanel);
      }
      .self-audit-gate ul { margin-bottom: 0; }
      main {
        display: grid;
        gap: 18px;
        padding: 18px 24px 28px;
      }
      .shot-card { overflow: hidden; }
      .shot-card > header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 18px;
        border-bottom: 1px solid var(--line);
      }
      .shot-card > header strong {
        color: var(--warn);
        text-align: right;
        font-size: 13px;
      }
      .eyebrow {
        margin: 0 0 4px;
        color: var(--accent);
        font-size: 12px;
      }
      .clip-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(320px, 0.7fr);
        gap: 14px;
        padding: 16px 18px;
      }
      video, img, .missing, .clip-pending {
        width: 100%;
        aspect-ratio: 16 / 9;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #0b0d0e;
      }
      img { display: block; object-fit: cover; }
      .missing, .clip-pending {
        display: grid;
        place-items: center;
        padding: 16px;
        text-align: center;
        color: var(--bad);
        background: repeating-linear-gradient(135deg, #211213, #211213 12px, #2a1718 12px, #2a1718 24px);
      }
      .clip-pending span {
        color: var(--muted);
        font-size: 12px;
        overflow-wrap: anywhere;
      }
      .clip-meta {
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 12px;
        background: var(--subpanel);
      }
      .clip-meta p { margin: 10px 0 0; }
      .frames {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        padding: 0 18px 16px;
      }
      figure { margin: 0; }
      figcaption {
        padding-top: 6px;
        color: var(--muted);
        font-size: 12px;
      }
      .ledger, .qa {
        margin: 0 18px 16px;
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--subpanel);
      }
      .ledger p { margin: 0 0 10px; color: var(--text); }
      .ledger-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 10px;
      }
      .ledger-grid > div {
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 10px;
      }
      ul { margin: 0 0 12px; padding-left: 18px; }
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .tags span {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 4px 8px;
        color: var(--muted);
        font-size: 12px;
      }
      details {
        margin-top: 10px;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 10px;
      }
      summary { cursor: pointer; color: var(--accent); }
      pre {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        color: var(--muted);
        font-size: 12px;
        line-height: 1.45;
      }
      @media (max-width: 960px) {
        .summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .clip-row, .frames { grid-template-columns: 1fr; }
        .top { position: static; }
      }
      @media (max-width: 560px) {
        .summary { grid-template-columns: 1fr; }
        .shot-card > header { display: block; }
        .shot-card > header strong { display: block; margin-top: 8px; text-align: left; }
      }
    </style>
  </head>
  <body>
    <header class="top">
      <h1>Scene09 V3 逐镜头真实剪辑验收台</h1>
      <p>直接 file:// 可访问。当前页面用于真实 AI 视频剪辑落盘后的自审：视频不存在时标为 CLIP PENDING；视频存在后仍必须按连续性、退场账本、具名人物名单和 reject 条件做 motion QA。</p>
    </header>

    <section class="summary">
      <div class="summary-card"><span>package</span><p>${esc(manifest.package_id)}</p></div>
      <div class="summary-card"><span>expected</span><p>${esc(clipQa.expected_clips ?? manifest.total_shots)}</p></div>
      <div class="summary-card"><span>ready</span><p>${esc(clipQa.ready_clips ?? 0)}</p></div>
      <div class="summary-card"><span>motion decision</span><p>${esc(motionDecisions.decision || "pending")}</p></div>
      <div class="summary-card"><span>action queue</span><p>${esc(clipRevisionQueue.actionable_shots ?? manifest.total_shots)}</p></div>
    </section>

    <p class="links">
      ${linkIfExists(mainGalleryPath, "main gallery")} ·
      ${linkIfExists(runbookPath, "RUNBOOK")} ·
      ${linkIfExists(submissionQueuePath, "submission_queue.csv")} ·
      ${linkIfExists(submissionPayloadPath, "submission_payload.jsonl")} ·
      ${linkIfExists(submissionPayloadManifestPath, "submission_payload_manifest.json")} ·
      ${linkIfExists(packageClipRevisionQueuePath, "clip_revision_queue.csv")} ·
      ${linkIfExists(motionChecklistPath, "clip_motion_qa_checklist.csv")} ·
      ${linkIfExists(motionReviewAssetsHtmlPath, "motion review assets")} ·
      ${linkIfExists(motionReviewAssetsPath, "motion review assets report")} ·
      ${linkIfExists(motionReviewAssetsJsonPath, "motion review assets json")} ·
      ${linkIfExists(motionReviewDecisionsPath, "motion review decisions")} ·
      ${linkIfExists(motionReviewDecisionsJsonPath, "motion review decisions json")} ·
      ${linkIfExists(clipRevisionQueuePath, "clip revision queue")} ·
      ${linkIfExists(clipRevisionQueueJsonPath, "clip revision queue json")} ·
      ${linkIfExists(clipRevisionQueueCsvPath, "clip revision queue csv")} ·
      ${linkIfExists(clipIngestReportPath, "clip ingest report")} ·
      ${linkIfExists(clipIngestReportJsonPath, "clip ingest report json")} ·
      ${linkIfExists(proxyAnimaticEditPath, "proxy animatic edit")} ·
      ${linkIfExists(proxyAnimaticReportPath, "proxy animatic report")} ·
      ${linkIfExists(proxyAnimaticReportJsonPath, "proxy animatic report json")} ·
      ${linkIfExists(clipQaMdPath, "clip QA report")} ·
      ${linkIfExists(storyAuditPath, "story constraint audit")} ·
      ${linkIfExists(executionAssetIntegrityPath, "execution asset integrity")} ·
      ${linkIfExists(executionAssetIntegrityCsvPath, "execution integrity csv")} ·
      ${linkIfExists(executionAssetIntegrityJsonPath, "execution integrity json")} ·
      ${linkIfExists(battleLedgerTimelinePath, "battle ledger timeline")} ·
      ${linkIfExists(battleLedgerTimelineCsvPath, "battle ledger csv")} ·
      ${linkIfExists(battleLedgerTimelineJsonPath, "battle ledger json")} ·
      ${linkIfExists(attritionTimelineAuditPath, "attrition timeline audit")} ·
      ${linkIfExists(attritionTimelineAuditJsonPath, "attrition timeline audit json")} ·
      ${linkIfExists(animaticPath, "static animatic reference")} ·
      ${linkIfExists(handoffAuditPath, "handoff_validation.json")}
    </p>

    <section class="self-audit-gate">
      <h3>真实视频 Codex 自审硬门槛</h3>
      <ul>
        ${(clipQa.codex_motion_self_audit_required || [
          "No unnamed readable humans appear.",
          "Captured Hubert, Dorothea, and Bernadetta do not return after their capture shots.",
          "Spent or stood-down characters do not resume active combat.",
          "Hanneman and Manuela are never staged as one allied teacher unit.",
        "Every clip lands on its declared end_frame for the final 0.5 seconds.",
        ]).map((item) => `<li>${esc(item)}</li>`).join("")}
      </ul>
      <p><b>Decision file:</b> ${esc(motionDecisions.decision || "not built yet")} · passed ${esc(motionDecisions.summary?.motion_review_passed ?? 0)}/${esc(motionDecisions.summary?.expected_clips ?? manifest.total_shots)} · pending clips ${esc(motionDecisions.summary?.pending_clip ?? manifest.total_shots)}</p>
    </section>

    <main>
      ${cards}
    </main>
  </body>
</html>
`;

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, html);
  console.log(JSON.stringify({
    output: path.relative(root, outputPath),
    shots: manifest.shots.length,
    expected_clips: clipQa.expected_clips ?? manifest.total_shots,
    ready_clips: clipQa.ready_clips ?? 0,
    missing_clips: clipQa.missing_clips ?? manifest.total_shots,
    handoff_decision: handoffAudit.decision || manifest.status,
  }, null, 2));
}

main();
