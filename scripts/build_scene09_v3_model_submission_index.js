#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const batchesDir = path.join(packageDir, "model_submission_batches");
const batchManifestPath = path.join(batchesDir, "batch_manifest.json");
const outHtmlPath = path.join(batchesDir, "index.html");
const outManifestPath = path.join(batchesDir, "batch_index_manifest.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function chineseTitleForShot(shot) {
  return scene09ChineseTitles[shot] || shot;
}

function displayTitleForShot(shot) {
  const shotNumber = String(shot || "").replace(/^Shot/, "");
  const localized = chineseTitleForShot(shot);
  if (localized && localized !== shot) return `镜头${shotNumber}：${localized}`;
  return `镜头${shotNumber || shot}`;
}

function parseJsonl(file) {
  return readText(file)
    .split(/\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function relFromBatches(file) {
  if (!file) return "";
  const absolute = path.isAbsolute(file) ? file : path.join(packageDir, file);
  return path.relative(batchesDir, absolute);
}

function relProjectFromBatches(file) {
  if (!file) return "";
  const absolute = path.isAbsolute(file) ? file : path.join(root, file);
  return path.relative(batchesDir, absolute);
}

function batchRows(batch) {
  return parseJsonl(path.join(packageDir, batch.jsonl));
}

function ledgerLine(label, value) {
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value || "none")}</p>`;
}

function battleLedgerPanel(row) {
  return `
      <details class="battle-ledger" open>
        <summary>Battle Ledger After</summary>
        ${ledgerLine("Alive / Safe After", row.alive_safe_after)}
        ${ledgerLine("Visible But No Active Combat After", row.visible_but_no_active_combat_after)}
        ${ledgerLine("Active / Controlling After", row.active_or_objective_after)}
        ${ledgerLine("Limited But Not Defeated After", row.limited_after)}
        ${ledgerLine("Defeated / Removed After", row.defeated_removed_after)}
        ${ledgerLine("Captured / Objective-Defeated After", row.captured_objective_defeated_after)}
        ${ledgerLine("Stood Down / Post-Battle After", row.stood_down_post_battle_after)}
        ${ledgerLine("Must Not Return Active", row.must_not_return_active_after)}
        ${ledgerLine("Changed This Shot", row.changed_this_shot)}
        ${ledgerLine("No-Active-Combat Line", row.no_active_combat_line)}
      </details>`;
}

function rowCard(row) {
  const visible = (row.visible_named_only || []).join(", ") || "none";
  const title = displayTitleForShot(row.shot);
  const start = relFromBatches(row.absolute_files?.start_frame || row.input_frames?.start_frame);
  const key = relFromBatches(row.absolute_files?.key_frame || row.input_frames?.key_frame);
  const end = relFromBatches(row.absolute_files?.end_frame || row.input_frames?.end_frame);
  const modelPrompt = relFromBatches(row.absolute_files?.model_prompt || row.prompt_file);
  const negativePrompt = relFromBatches(row.absolute_files?.negative_prompt || row.negative_prompt_file);
  const metadata = relFromBatches(row.absolute_files?.metadata);
  const metadataDoc = row.absolute_files?.metadata && fs.existsSync(row.absolute_files.metadata) ? readJson(row.absolute_files.metadata) : {};
  const sourceFrames = metadataDoc.source_frames || {};
  const sourceStart = relProjectFromBatches(sourceFrames.start_frame || sourceFrames.start);
  const sourceKey = relProjectFromBatches(sourceFrames.key_frame || sourceFrames.key);
  const sourceEnd = relProjectFromBatches(sourceFrames.end_frame || sourceFrames.end);
  const rejects = (row.reject_if || []).slice(0, 8);
  return `
    <article class="shot-card" id="${escapeHtml(row.custom_id)}">
      <header class="shot-head">
        <div>
          <p class="eyebrow">${String(row.order).padStart(2, "0")} / ${escapeHtml(row.custom_id)}</p>
          <h3>${escapeHtml(title)} <span>${escapeHtml(row.shot)} · ${escapeHtml(row.id)}</span></h3>
        </div>
        <code>${escapeHtml(row.duration_seconds)}s</code>
      </header>
      <div class="frame-row">
        <a href="${escapeHtml(start)}"><img src="${escapeHtml(start)}" alt="${escapeHtml(`${row.custom_id} start frame`)}"><span>start</span></a>
        <a href="${escapeHtml(key)}"><img src="${escapeHtml(key)}" alt="${escapeHtml(`${row.custom_id} key frame`)}"><span>key</span></a>
        <a href="${escapeHtml(end)}"><img src="${escapeHtml(end)}" alt="${escapeHtml(`${row.custom_id} end frame`)}"><span>end</span></a>
      </div>
      <div class="info-grid">
        <section>
          <h4>Submit</h4>
          <p><a href="${escapeHtml(modelPrompt)}">model_prompt.md</a></p>
          <p><a href="${escapeHtml(negativePrompt)}">negative_prompt.md</a></p>
          <p><a href="${escapeHtml(metadata)}">metadata.json</a></p>
        </section>
        <section>
          <h4>Visible Named Only</h4>
          <p>${escapeHtml(visible)}</p>
          <h4>Expected Clip</h4>
          <code>${escapeHtml(row.absolute_expected_clip || row.expected_clip)}</code>
        </section>
        <section>
          <h4>Primary Check</h4>
          <p>${escapeHtml(row.primary_check || "")}</p>
          <h4>Source Frames</h4>
          <p><a href="${escapeHtml(sourceStart)}">source start</a></p>
          <p><a href="${escapeHtml(sourceKey)}">source key</a></p>
          <p><a href="${escapeHtml(sourceEnd)}">source end</a></p>
        </section>
      </div>
      ${battleLedgerPanel(row)}
      <details>
        <summary>Reject If</summary>
        <ul>${rejects.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
      </details>
    </article>`;
}

function batchSection(batch) {
  const rows = batchRows(batch);
  return `
    <section class="batch" id="${escapeHtml(batch.batch_id)}">
      <header class="batch-head">
        <div>
          <p class="eyebrow">shots ${String(batch.order_start).padStart(3, "0")}-${String(batch.order_end).padStart(3, "0")}</p>
          <h2>${escapeHtml(batch.batch_id)}</h2>
        </div>
        <nav>
          <a href="${escapeHtml(path.basename(batch.jsonl))}">JSONL</a>
          <a href="${escapeHtml(path.basename(batch.csv))}">CSV</a>
          <a href="${escapeHtml(path.basename(batch.runbook))}">Runbook</a>
        </nav>
      </header>
      <div class="shots">${rows.map(rowCard).join("\n")}</div>
    </section>`;
}

function main() {
  if (!fs.existsSync(batchManifestPath)) throw new Error(`Missing batch manifest: ${batchManifestPath}`);
  const manifest = readJson(batchManifestPath);
  const batches = manifest.batches || [];
  const allRows = batches.flatMap(batchRows);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EP02 Scene09 Model Submission Batches</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #20242a;
      --muted: #606a76;
      --line: #d8dde5;
      --paper: #f7f8fa;
      --panel: #ffffff;
      --blue: #2460a8;
      --red: #9c3d3d;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--ink);
      background: var(--paper);
    }
    .top {
      position: sticky;
      top: 0;
      z-index: 2;
      border-bottom: 1px solid var(--line);
      background: rgba(247, 248, 250, 0.96);
      backdrop-filter: blur(10px);
    }
    .inner, main { max-width: 1480px; margin: 0 auto; padding: 18px 22px; }
    h1, h2, h3, h4, p { margin-top: 0; }
    h1 { margin-bottom: 8px; font-size: 24px; letter-spacing: 0; }
    h2 { margin-bottom: 0; font-size: 20px; letter-spacing: 0; }
    h3 { margin: 0; font-size: 16px; letter-spacing: 0; }
    h3 span { display: block; margin-top: 2px; color: var(--muted); font-size: 12px; font-weight: 500; }
    h4 { margin-bottom: 6px; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0; }
    a { color: var(--blue); text-decoration: none; }
    a:hover { text-decoration: underline; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: normal; overflow-wrap: anywhere; }
    .metrics { display: grid; grid-template-columns: repeat(5, minmax(120px, 1fr)); gap: 10px; margin-top: 12px; }
    .metric, .shot-card, .batch {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
    }
    .metric { padding: 10px; min-height: 72px; }
    .metric strong { display: block; font-size: 20px; }
    .metric span, .eyebrow { color: var(--muted); font-size: 12px; }
    .links { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px; }
    .batch { margin: 18px 0; overflow: hidden; }
    .batch-head, .shot-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--line);
    }
    .batch-head nav { display: flex; gap: 12px; flex-wrap: wrap; }
    .shots { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; padding: 14px; }
    .shot-card { overflow: hidden; }
    .frame-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); }
    .frame-row a { display: grid; grid-template-rows: minmax(110px, 10vw) auto; color: white; background: #12161c; text-decoration: none; }
    .frame-row img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .frame-row span { padding: 6px 8px; background: rgba(0, 0, 0, 0.55); font-size: 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1.2fr 1.4fr; gap: 1px; background: var(--line); border-top: 1px solid var(--line); }
    .info-grid section { min-width: 0; padding: 10px 12px; background: var(--panel); }
    details { border-top: 1px solid var(--line); padding: 10px 12px; }
    .battle-ledger { background: #fbfcff; }
    .battle-ledger summary { color: var(--blue); }
    .battle-ledger p { margin-bottom: 5px; overflow-wrap: anywhere; }
    .battle-ledger strong { color: var(--muted); }
    summary { cursor: pointer; color: var(--red); font-weight: 650; }
    ul { margin: 8px 0 0; padding-left: 20px; }
    @media (max-width: 960px) {
      .metrics, .shots, .frame-row, .info-grid { grid-template-columns: 1fr; }
      .batch-head, .shot-head { align-items: flex-start; flex-direction: column; }
      .frame-row a { grid-template-rows: minmax(170px, 54vw) auto; }
    }
  </style>
</head>
<body>
  <header class="top">
    <div class="inner">
      <h1>EP02 Scene09 Model Submission Batches</h1>
      <p>Provider-neutral full-duration image-to-video batches. These are structurally prepared but locked until <code>full_duration_release_gate</code> reaches <code>full_duration_release_passed</code>; real clips remain pending until generated mp4 files are returned and pass motion QA.</p>
      <div class="metrics">
        <div class="metric"><strong>${escapeHtml(manifest.total_shots)}</strong><span>shots</span></div>
        <div class="metric"><strong>${escapeHtml(manifest.total_batches)}</strong><span>batches</span></div>
        <div class="metric"><strong>${escapeHtml(manifest.batch_size)}</strong><span>shots per batch</span></div>
        <div class="metric"><strong>${escapeHtml(manifest.total_duration_seconds)}s</strong><span>planned duration</span></div>
        <div class="metric"><strong>0 / ${escapeHtml(manifest.total_shots)}</strong><span>real clips present</span></div>
      </div>
      <div class="links">
        <a href="../index.html">handoff index</a>
        <a href="batch_manifest.json">batch_manifest.json</a>
        <a href="expected_downloads.csv">expected_downloads.csv</a>
        <a href="../submission_payload.jsonl">submission_payload.jsonl</a>
        <a href="../RUNBOOK.md">RUNBOOK.md</a>
      </div>
      <p>Current full-duration status: prepared_locked_probe_release_pending. Submit motion probes first; do not upload these full-duration batches until 42/42 returned probes pass signed Codex review and <code>motion_probe_full_duration_release.json</code> exists.</p>
    </div>
  </header>
  <main>
    <section class="metric">
      <h4>Hard Locks</h4>
      <p>No unnamed extras. Only named readable humans listed per shot may appear. No anonymous students, spectators, soldiers, crowds, bystanders, or readable silhouettes.</p>
      <p>Shot034B: Byleth and Dimitri only; both faculty objective markers stay empty; Hanneman and Manuela absent/offscreen/silent/unpaired. Shot034G: Byleth, Dimitri, Dedue only. Shot036: Dimitri, Byleth only.</p>
      <p>Hubert remains captured after Shot032F; Dorothea and Bernadetta remain captured after Shot032G; spent or stood-down characters cannot return as active combatants.</p>
    </section>
    ${batches.map(batchSection).join("\n")}
  </main>
</body>
</html>
`;
  writeText(outHtmlPath, html);
  writeJson(outManifestPath, {
    date: "2026-07-31",
    html: path.relative(root, outHtmlPath),
    batch_manifest: path.relative(root, batchManifestPath),
    batches: batches.length,
    shots: allRows.length,
    decision: "model_submission_index_built",
  });
  console.log(JSON.stringify({
    ok: true,
    decision: "model_submission_index_built",
    html: path.relative(root, outHtmlPath),
    batches: batches.length,
    shots: allRows.length,
  }, null, 2));
}

main();
