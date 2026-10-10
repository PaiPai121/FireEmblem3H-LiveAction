const fs = require("fs");
const path = require("path");

const queuePath = "episodes/EP02/mock_battle_keyframe_production_queue_2026-07-17.json";
const outDir = "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/reference_boards";
const indexPath = path.join(outDir, "index.html");

fs.mkdirSync(outDir, { recursive: true });

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const boardEntries = queue.filter((entry) => {
  const hasProductionKeyframe = entry.output_keyframe && fs.existsSync(entry.output_keyframe);
  return entry.priority === "P0" || (entry.status === "qa_passed" && hasProductionKeyframe);
});

function rel(fromFile, target) {
  return path.relative(path.dirname(fromFile), target).split(path.sep).join("/");
}

function esc(value) {
  return String(value || "")
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

const promptOverrides = {
  Shot027B: [
    "当前用途：黑鹫第一波压上。此页只作为早期构图参考，不作为当前可执行视频提示词。",
    "",
    "当前修正：Ferdinand 带 Black Eagles 从北侧/东北纵深向中央通道施压；Blue Lions 在东南/中央下方接线；Golden Deer 不应作为同一波正面敌人，也不应出现匿名学生人群。",
    "",
    "拒绝：未知人群、随机学生、混杂学级队列、靶场式背景、旧版英文错误文案。",
  ].join("\n"),
  Shot033B: [
    "当前用途：贝雷特下令切向教师目标。此页只作为早期构图参考，不作为当前可执行视频提示词。",
    "",
    "当前修正：Byleth 指挥 Blue Lions 分别切向两个分离的教师目标路线；Hanneman 在 Black Eagles-side faculty marker，Manuela 在 Golden Deer-side faculty marker。两位教师不能并肩作战，不能作为同一格目标，也不能回到 Shot034B 画面。",
    "",
    "拒绝：Byleth 看向镜头摆拍、Hanneman/Manuela 并肩作战、旧版英文错误文案。",
  ].join("\n"),
};

const subframeTitleTranslations = {
  "Action peak": "动作峰值",
  "Annette disruption": "雅妮特干扰",
  "Arrow impact": "箭矢命中",
  "Black Eagles ahead": "黑鹫在前方压上",
  "Black Eagles shift sideways": "黑鹫横向转移",
  "Byleth intercepts": "贝雷特截停",
  "Byleth reads two fronts": "贝雷特读出双线战场",
  "Claude's sightline": "库罗德视线判断",
  "Command depth": "指挥纵深",
  "Dimitri contains": "帝弥托利压住战线",
  "Dimitri route opens": "帝弥托利路线打开",
  "Entry geography": "入场地理关系",
  "Felix waits": "菲力克斯等待侧切",
  "First contact": "首次接敌",
  "First entanglement": "首次缠斗",
  "Flank opens": "侧翼打开",
  "Front accelerates": "前线加速",
  "Golden Deer cover compressed": "金鹿掩护被压缩",
  "Hanneman casting angle": "汉尼曼施法角度",
  "Horn / release": "号令与启动",
  "Ingrid closes": "英谷莉特逼近",
  "Lane convergence": "路线汇合",
  "Manuela on heal tile": "玛努艾拉位于治疗地块",
  "Mercedes chooses cover": "梅尔塞德斯选择掩护位",
  "Reaction / cut point": "反应与剪切点",
  "Rear-line danger": "后线危险暴露",
  "Rout signal": "击破信号",
  "Route exposed": "路线暴露",
  "Still readable": "混战关系仍清晰",
  "Support line follows": "支援线跟进",
  "Support link snaps": "支援链被切断",
};

function displayTitleForShot(shot) {
  const shotNumber = String(shot || "").replace(/^Shot/, "");
  const localized = scene09ChineseTitles[shot];
  return localized ? `镜头${shotNumber}：${localized}` : `镜头${shotNumber || shot}`;
}

function displaySubframeLabel(subframe) {
  const suffix = String(subframe.id || "").split(".").pop() || "";
  const title = subframeTitleTranslations[subframe.title] || sanitizeLegacyText(subframe.title);
  return `分镜点 ${suffix}：${title}`;
}

function displayPrompt(entry) {
  return promptOverrides[entry.shot] || entry.production_prompt || "";
}

function sanitizeLegacyText(value) {
  return String(value || "")
    .replaceAll("First Moving Enemy Wave", "黑鹫第一波压上")
    .replaceAll("Byleth Calls Cut Teachers", "贝雷特下令切向教师目标")
    .replaceAll(
      "Dorothea, Lorenz and Ignatz move through center-west lane while Ashe and support line hold high ground behind low walls.",
      "Black Eagles 从北侧/东北纵深压入中央通道，Blue Lions 在东南/中央下方接线；Golden Deer 不作为同一波正面敌人。",
    )
    .replaceAll(
      "Byleth points to northeast raised healing stone platform; Hanneman and Manuela are visible as support system.",
      "Byleth 指向两个分离教师目标路线；Hanneman 与 Manuela 分属不同目标点，不能并肩作战。",
    )
    .replaceAll("support system", "teacher objective route");
}

function boardHtml(entry, filePath) {
  const refs = entry.character_reference_assets || [];
  const subframes = entry.subframes || [];
  const title = displayTitleForShot(entry.shot);
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} Reference Board</title>
  <style>
    :root { color-scheme: light; --ink:#1f242b; --muted:#657180; --line:#d8dee6; --paper:#f5f7f9; --panel:#fff; --accent:#9c2f39; }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--paper); color:var(--ink); font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    main { padding: 28px clamp(16px, 4vw, 42px) 48px; }
    header { display:flex; justify-content:space-between; gap:24px; align-items:end; margin-bottom:22px; }
    h1 { margin:0; font-size: clamp(24px, 4vw, 38px); line-height:1.08; }
    p { margin:0; color:var(--muted); line-height:1.55; }
    a { color:inherit; }
    .pill { display:inline-block; padding:6px 9px; border:1px solid var(--line); border-radius:8px; background:var(--panel); color:var(--accent); font-size:12px; font-weight:800; }
    .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap:14px; margin-bottom:22px; }
    .card { overflow:hidden; border:1px solid var(--line); border-radius:8px; background:var(--panel); }
    .card img { display:block; width:100%; aspect-ratio:4/5; object-fit:cover; background:#dde3ea; }
    .body { display:grid; gap:8px; padding:12px; }
    .body h2 { margin:0; font-size:17px; }
    .path { overflow-wrap:anywhere; color:var(--muted); font: 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    section { margin-top:22px; }
    .subframes { display:grid; gap:8px; }
    .subframe { padding:12px; border:1px solid var(--line); border-radius:8px; background:var(--panel); }
    .subframe strong { display:block; margin-bottom:4px; }
    .prompt { white-space:pre-wrap; padding:14px; border:1px solid var(--line); border-radius:8px; background:var(--panel); color:#2a3037; font-size:13px; line-height:1.5; }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <span class="pill">P0 Scene09 Reference Board</span>
        <h1>${esc(title)}</h1>
        <p>${esc(sanitizeLegacyText(entry.purpose || ""))}</p>
      </div>
      <a class="pill" href="./index.html">Index</a>
    </header>
    ${entry.output_keyframe && fs.existsSync(entry.output_keyframe) ? `
      <section>
        <h2>Generated Keyframe</h2>
        <article class="card">
          <img style="aspect-ratio:16/9; object-fit:cover;" src="${rel(filePath, entry.output_keyframe)}" alt="${esc(entry.shot)} generated keyframe">
          <div class="body">
            <h2>生成关键帧</h2>
            <p>${esc(entry.status)} / ${esc(entry.priority)}</p>
            <a class="path" href="${rel(filePath, entry.output_keyframe)}">${esc(entry.output_keyframe)}</a>
          </div>
        </article>
      </section>
    ` : ""}
    <section>
      <h2>Character Reference Assets</h2>
    </section>
    <div class="grid">
      ${refs.map((ref) => `
        <article class="card">
          <img src="${rel(filePath, ref.asset)}" alt="${esc(ref.name)} reference">
          <div class="body">
            <h2>${esc(ref.name)}</h2>
            <p>${esc(ref.continuity_note)}</p>
            <a class="path" href="${rel(filePath, ref.asset)}">${esc(ref.asset)}</a>
          </div>
        </article>
      `).join("")}
    </div>
    <section>
      <h2>Subframes</h2>
      <div class="subframes">
        ${subframes.map((subframe) => `
          <div class="subframe">
            <strong>${esc(displaySubframeLabel(subframe))}</strong>
            <p>${esc(sanitizeLegacyText(subframe.description))}</p>
            <p class="path">${esc(subframe.output_keyframe)}</p>
          </div>
        `).join("")}
      </div>
    </section>
    <section>
      <h2>Production Prompt</h2>
      <div class="prompt">${esc(displayPrompt(entry))}</div>
    </section>
  </main>
</body>
</html>
`;
}

for (const entry of boardEntries) {
  const filePath = path.join(outDir, `${entry.shot}.html`);
  fs.writeFileSync(filePath, boardHtml(entry, filePath));
}

const indexHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Scene09 P0 Reference Boards</title>
  <style>
    body { margin:0; background:#f5f7f9; color:#1f242b; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    main { padding:28px clamp(16px, 4vw, 42px); }
    h1 { margin:0 0 18px; }
    .list { display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:12px; }
    a { display:grid; gap:5px; padding:14px; border:1px solid #d8dee6; border-radius:8px; background:white; color:inherit; text-decoration:none; }
    span { color:#657180; font-size:13px; }
  </style>
</head>
<body>
  <main>
    <h1>Scene09 P0 Reference Boards</h1>
    <div class="list">
      ${boardEntries.map((entry) => `
        <a href="./${entry.shot}.html">
          <strong>${esc(displayTitleForShot(entry.shot))}</strong>
          <span>${(entry.character_reference_assets || []).map((ref) => ref.name).join(", ")}</span>
        </a>
      `).join("")}
    </div>
  </main>
</body>
</html>
`;

fs.writeFileSync(indexPath, indexHtml);
console.log(`wrote ${boardEntries.length} reference boards to ${outDir}`);
