#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "specials", "kakeya_byleth_lecture");
const outRoot = path.join(projectRoot, "delivery", "identity_regeneration_review_2026-08-03");
const reviewRoot = path.join(projectRoot, "production_system", "reviews");

const shots = [
  {
    id: "SH002",
    title: "提出问题",
    candidate: "identity_v1",
    decision: "可替换正式帧",
    reason: "独立审查通过：四人身份明显贴近 selected asset，三帧连续性成立，无数学/中文文字风险。",
    contact: "production_system/reviews/SH002_identity_v1_candidate_contact_sheet_2026-08-03.png",
    refs: ["byleth", "edelgard", "lysithea", "mercedes"],
  },
  {
    id: "SH010",
    title: "艾黛尔质疑",
    candidate: "identity_v3",
    decision: "最新候选待独立复审",
    reason: "v2 虽可替换但有黑板补丁与 deltoid 监看风险；v3 改为整帧生成干净黑板底，再用自然粉笔数学层绘制 deltoid 与中文说明，禁止人物抠图。",
    contact: "production_system/reviews/SH010_identity_v3_candidate_contact_sheet_2026-08-03.png",
    refs: ["byleth", "edelgard"],
  },
  {
    id: "SH020",
    title: "学生质疑 Perron 构造",
    candidate: "identity_v1",
    decision: "可替换正式帧，但需运动监看",
    reason: "独立审查认为四人身份和三帧连续性显著优于旧版；Perron 桌面碎片和绿色方向带仍偏复杂，替换后需监看数学桌面细节是否跳动。",
    contact: "production_system/reviews/SH020_identity_v1_candidate_contact_sheet_2026-08-03.png",
    refs: ["byleth", "edelgard", "lysithea", "mercedes"],
  },
  {
    id: "SH032",
    title: "名称揭示",
    candidate: "identity_v2",
    decision: "最新候选待独立复审",
    reason: "v1 因 key/end 黑板文字修补区域像遮罩被拒绝；v2 改为整帧生成干净黑板底，再加自然粉笔中文标题，禁止人物抠图。",
    contact: "production_system/reviews/SH032_identity_v2_candidate_contact_sheet_2026-08-03.png",
    refs: ["byleth", "edelgard", "lysithea", "mercedes"],
  },
];

const refPaths = {
  byleth: "assets/characters/protagonist/BylethFemale/professor/selected.png",
  edelgard: "assets/characters/black_eagles/Edelgard/academy/selected.png",
  lysithea: "assets/characters/golden_deer/Lysithea/academy/selected.png",
  mercedes: "assets/characters/blue_lions/Mercedes/academy/selected.png",
};

const mathFixed = [
  ["SH015", "图中英文 convex hull / non-convex 改为中文"],
  ["SH025", "alpha 改为 α，保留 δ 管宽"],
  ["SH026", "small alpha / large alpha / gold overlap 改为中文与 α"],
  ["SH027", "length / area / overlap 英文公式说明改为中文与 α/δ"],
  ["SH028", "curve / all directions 英文说明改为中文"],
  ["SH029", "area may be 0 / dimension = 2 改为中文"],
  ["SH031", "tube overlap / maximal averages / wave packets 改为中文"],
];

function rel(from, to) {
  return path.relative(from, to).split(path.sep).join("/");
}

function img(src, label) {
  return `<figure><img src="${src}" alt="${label}"><figcaption>${label}</figcaption></figure>`;
}

function copyFile(srcRel, dstRel) {
  const src = path.join(repoRoot, srcRel);
  const dst = path.join(outRoot, dstRel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

fs.mkdirSync(outRoot, { recursive: true });

for (const [key, srcRel] of Object.entries(refPaths)) {
  copyFile(srcRel, `refs/${key}.png`);
}

for (const shot of shots) {
  for (const frame of ["start", "key", "end"]) {
    copyFile(`specials/kakeya_byleth_lecture/real_frames/${shot.id}/${frame}.png`, `shots/${shot.id}/old_${frame}.png`);
    copyFile(`specials/kakeya_byleth_lecture/regenerated_frame_candidates/${shot.id}_${shot.candidate}/${frame}.png`, `shots/${shot.id}/candidate_${frame}.png`);
  }
  copyFile(`specials/kakeya_byleth_lecture/${shot.contact}`, `shots/${shot.id}/candidate_contact_sheet.png`);
}

const rows = shots.map((shot) => `
  <section class="shot">
    <div class="shot-head">
      <div>
        <h2>${shot.id} - ${shot.title}</h2>
        <p><strong>决策：</strong>${shot.decision}</p>
        <p>${shot.reason}</p>
      </div>
      <a class="button" href="shots/${shot.id}/candidate_contact_sheet.png">候选对照图</a>
    </div>
    <h3>参考资产</h3>
    <div class="grid refs">
      ${shot.refs.map((key) => img(`refs/${key}.png`, key)).join("")}
    </div>
    <h3>旧正式帧（仍阻塞）</h3>
    <div class="grid frames">
      ${["start", "key", "end"].map((frame) => img(`shots/${shot.id}/old_${frame}.png`, `旧 ${frame}`)).join("")}
    </div>
    <h3>重生候选帧（待审查）</h3>
    <div class="grid frames">
      ${["start", "key", "end"].map((frame) => img(`shots/${shot.id}/candidate_${frame}.png`, `候选 ${frame}`)).join("")}
    </div>
  </section>
`).join("\n");

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>二维挂谷角色重生候选审查</title>
  <style>
    :root { color-scheme: light; --ink:#1f252e; --muted:#607086; --line:#d8e0ea; --blue:#1458a8; --red:#a93131; --bg:#f6f8fb; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; background: var(--bg); color: var(--ink); }
    header { padding: 28px 36px; background: white; border-bottom: 1px solid var(--line); }
    h1 { margin: 0 0 8px; font-size: 42px; letter-spacing: 0; }
    h2 { margin: 0 0 8px; font-size: 28px; }
    h3 { margin: 22px 0 10px; font-size: 18px; color: #334155; }
    p { margin: 6px 0; line-height: 1.55; color: var(--muted); font-size: 16px; }
    main { max-width: 1480px; margin: 0 auto; padding: 24px 28px 48px; }
    .notice { border: 2px solid #e2b342; background: #fff8db; border-radius: 8px; padding: 16px 18px; margin-bottom: 24px; }
    .notice strong { color: #7a4a00; }
    .math { background:white; border:1px solid var(--line); border-radius:8px; padding:18px; margin-bottom:24px; }
    .math ul { margin: 8px 0 0; padding-left: 22px; color: var(--muted); line-height: 1.7; }
    .shot { background: white; border: 1px solid var(--line); border-radius: 8px; padding: 22px; margin: 24px 0; }
    .shot-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; border-bottom: 1px solid var(--line); padding-bottom: 16px; }
    .button { color: white; background: var(--blue); text-decoration: none; border-radius: 6px; padding: 10px 14px; white-space: nowrap; font-weight: 700; }
    .grid { display: grid; gap: 14px; }
    .refs { grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); }
    .frames { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    figure { margin: 0; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background:#101620; }
    img { width: 100%; display:block; aspect-ratio: 16 / 9; object-fit: cover; }
    .refs img { aspect-ratio: 3 / 4; object-fit: contain; background:#1d2531; }
    figcaption { background:white; padding:10px 12px; font-weight:700; color:#243044; }
    .status { display:inline-block; color:white; background:var(--red); border-radius:999px; padding:6px 10px; font-weight:700; margin-right:8px; }
  </style>
</head>
<body>
  <header>
    <h1>二维挂谷角色重生候选审查</h1>
    <p><span class="status">不是批准包</span>这些是重生候选帧，用于人工审查；旧正式帧仍保持阻塞，直到候选通过身份、数学、三帧连续性审查。</p>
  </header>
  <main>
    <div class="notice">
      <strong>复审结论：</strong>阻塞不止原先四个角色镜头。角色层面仍是 SH002、SH010、SH020、SH032；另外发现数学图解中多处英文标签，已定向重绘为中文/α/δ 版本。
    </div>
    <section class="math">
      <h2>已定向重绘的数学图解</h2>
      <ul>${mathFixed.map(([id, text]) => `<li><strong>${id}</strong>：${text}</li>`).join("")}</ul>
    </section>
    ${rows}
  </main>
</body>
</html>
`;

fs.writeFileSync(path.join(outRoot, "asset_viewer.html"), html, "utf8");
fs.writeFileSync(path.join(outRoot, "regeneration_review_manifest.json"), JSON.stringify({
  version: 1,
  status: "candidate_review_required",
  created_at: "2026-08-03",
  shots: shots.map((shot) => ({
    id: shot.id,
    candidate: shot.candidate,
    decision: shot.decision,
    reason: shot.reason,
    contact_sheet: `shots/${shot.id}/candidate_contact_sheet.png`,
  })),
  math_fixed: mathFixed.map(([id, fix]) => ({ id, fix })),
  note: "This package is for human candidate review only. It does not promote regenerated frames to approved_for_video.",
}, null, 2) + "\n");

console.log(JSON.stringify({ outRoot, viewer: path.join(outRoot, "asset_viewer.html"), shots: shots.length }, null, 2));
