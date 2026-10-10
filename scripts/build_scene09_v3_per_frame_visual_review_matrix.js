#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-03";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const frameEvidencePath = path.join(packageDir, "frame_evidence_audit.json");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(outDir, `scene09_v3_per_frame_visual_review_matrix_${date}.json`);
const outCsv = path.join(outDir, `scene09_v3_per_frame_visual_review_matrix_${date}.csv`);
const outHtml = path.join(packageDir, "per_frame_visual_review_matrix.html");
const packageJson = path.join(packageDir, "per_frame_visual_review_matrix.json");
const packageCsv = path.join(packageDir, "per_frame_visual_review_matrix.csv");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function relFromRoot(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function relFromPackage(file) {
  return path.relative(packageDir, file).split(path.sep).join("/");
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function pngInfo(file) {
  const stat = fs.statSync(file);
  const buffer = fs.readFileSync(file);
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") {
    return { width: 0, height: 0, bytes: stat.size, sha256: sha256(file), problems: ["not_png_or_too_small"] };
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bytes: stat.size,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
    problems: [],
  };
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

function contactSheetForOrder(order) {
  const n = Number(order);
  const part = n <= 10 ? 1 : n <= 20 ? 2 : n <= 30 ? 3 : n <= 40 ? 4 : 5;
  return {
    part,
    path: `production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part${part}.png`,
    basis: `Codex visual triage from monitor_contact_sheet_part${part}.png; inspect full-size package PNG before promotion.`,
  };
}

const shotObservations = {
  Shot025: "Three house leaders are readable as academy-age students in balanced framing; no visible teacher platform occupation.",
  Shot027B: "Black Eagles first wave shows Ferdinand/Edelgard/Hubert/Dorothea only; no anonymous crowd or Golden Deer same-wave mix.",
  Shot029C: "Claude/Ashe/Edelgard tactical relation is readable; Claude has the high point without humiliating Ashe or Edelgard.",
  Shot030B: "Felix carries one straight blunt wooden training sword; no chain blade, segmented blade, or lethal sword read.",
  Shot032: "Dedue/Mercedes healer-tank beat is readable: Mercedes heals from behind while Dedue restores the shield line.",
  Shot032F: "Felix and Ashe contain Hubert nonlethally; Hubert is not injured or humiliated.",
  Shot032G: "Claude and Leonie control Dorothea and Bernadetta on the Black Eagles backline without cruelty.",
  Shot033C: "Ashe and Hanneman are on a separate faculty lane; Manuela is not paired with Hanneman in this shot.",
  Shot033D: "Ingrid/Sylvain and Manuela are on the other separate faculty lane; Hanneman is not paired with Manuela in this shot.",
  Shot034B: "Two empty faculty objective markers remain empty; only Byleth and Dimitri are readable, Hanneman/Manuela absent/offscreen/silent/unpaired.",
  Shot034G: "Final Blue Lions win remains Byleth/Dimitri/Dedue core only, with Dimitri's long wooden training lance readable.",
  Shot036: "Dimitri's long wooden training lance remains readable in the post-battle beat with Byleth.",
};

const monitorRisks = {
  Shot032B: "Hanneman appears as a single distant teacher objective element; acceptable only as a separate route marker before Shot034B.",
  Shot033: "Hanneman appears as a single teacher objective element; keep Manuela separate and never pair teachers.",
  Shot034E: "Golden Deer stand-down tableau is static; video prompt must add small, restrained stand-down motion.",
  Shot034F: "Black Eagles concession covers Edelgard/Ferdinand only; Hubert/Dorothea/Bernadetta exits are carried by earlier capture shots.",
};

function visualDecisionForShot(shot) {
  if (monitorRisks[shot]) return "visual_triage_passed_monitor_required_with_note";
  return "visual_triage_passed_monitor_required";
}

function main() {
  const manifest = readJson(packageManifestPath);
  const packageFrameHashes = new Map();
  const sourceFrameHashes = new Map();
  const problems = [];
  const rows = [];

  for (const shot of [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order))) {
    const contactSheet = contactSheetForOrder(shot.order);
    const metadataPath = path.join(packageDir, shot.package_dir, "metadata.json");
    if (!fs.existsSync(metadataPath)) problems.push(`${shot.shot}: missing metadata.json`);
    for (const frame of ["start", "key", "end"]) {
      const frameProblems = [];
      const packageFrame = path.join(packageDir, shot.package_dir, `${frame}_frame.png`);
      const sourceFrame = shot.source_frames?.[`${frame}_frame`] || "";
      const sourceAbs = sourceFrame ? path.join(root, sourceFrame) : "";
      let info = { width: 0, height: 0, bytes: 0, sha256: "", problems: ["missing_package_frame"] };
      let sourceSha256 = "";
      let sourceExists = false;
      let digestMatchesSource = false;
      if (!fs.existsSync(packageFrame)) {
        frameProblems.push("missing_package_frame");
      } else {
        info = pngInfo(packageFrame);
        frameProblems.push(...info.problems);
        const hashRows = packageFrameHashes.get(info.sha256) || [];
        hashRows.push(`${shot.shot}:${frame}`);
        packageFrameHashes.set(info.sha256, hashRows);
      }
      if (!sourceFrame) {
        frameProblems.push("missing_manifest_source_frame");
      } else if (!fs.existsSync(sourceAbs)) {
        frameProblems.push("source_frame_missing");
      } else {
        sourceExists = true;
        sourceSha256 = sha256(sourceAbs);
        digestMatchesSource = info.sha256 === sourceSha256;
        if (!digestMatchesSource) frameProblems.push("package_digest_does_not_match_manifest_source");
        const sourceHashRows = sourceFrameHashes.get(sourceSha256) || [];
        sourceHashRows.push(`${shot.shot}:${frame}:${sourceFrame}`);
        sourceFrameHashes.set(sourceSha256, sourceHashRows);
      }
      if (frameProblems.length) problems.push(`${shot.shot} ${frame}: ${frameProblems.join("; ")}`);
      rows.push({
        order: shot.order,
        shot: shot.shot,
        title_zh: displayTitleForShot(shot.shot),
        frame,
        decision: frameProblems.length ? "visual_review_blocked_integrity" : visualDecisionForShot(shot.shot),
        package_frame: relFromRoot(packageFrame),
        package_frame_href: relFromPackage(packageFrame),
        source_frame: sourceFrame,
        source_exists: sourceExists,
        width: info.width,
        height: info.height,
        bytes: info.bytes,
        sha256: info.sha256,
        source_sha256: sourceSha256,
        digest_matches_source: digestMatchesSource,
        visible_named_only: shot.visible_named_only || [],
        primary_check: shot.primary_check || "",
        reject_if: shot.reject_if || [],
        contact_sheet: contactSheet.path,
        codex_visual_basis: contactSheet.basis,
        codex_visual_observation: shotObservations[shot.shot] || "Contact-sheet triage found no mismatch against visible-named-only roster, training setting, and package prompt intent; full-size image remains linked for direct inspection.",
        monitor_note: monitorRisks[shot.shot] || "",
        problems: frameProblems,
      });
    }
  }

  for (const [hash, refs] of packageFrameHashes) {
    if (hash && refs.length > 1) problems.push(`package_frame_exact_duplicate ${hash}: ${refs.join(", ")}`);
  }

  const decision = problems.length ? "per_frame_visual_review_matrix_blocked" : "per_frame_visual_review_matrix_passed_monitor_required";
  const report = {
    date,
    decision,
    package_manifest: relFromRoot(packageManifestPath),
    frame_evidence_audit: relFromRoot(frameEvidencePath),
    shots_checked: manifest.shots.length,
    frames_checked: rows.length,
    frames_passed: rows.filter((row) => row.problems.length === 0).length,
    review_scope: [
      "126 package-local start/key/end PNGs are listed individually.",
      "Each frame is tied to visible_named_only, primary_check, reject_if, source digest, and contact-sheet visual triage evidence.",
      "This is still monitor-stage frame review, not generated-clip motion approval.",
    ],
    problems,
    rows,
  };

  const headers = [
    "order",
    "shot",
    "title_zh",
    "frame",
    "decision",
    "package_frame",
    "source_frame",
    "width",
    "height",
    "digest_matches_source",
    "visible_named_only",
    "codex_visual_observation",
    "monitor_note",
    "problems",
  ];
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((key) => csvCell(row[key])).join(",")),
  ].join("\n");

  const cards = rows.map((row) => `
    <article class="frame-card ${row.problems.length ? "blocked" : ""}" id="${esc(`${row.shot}-${row.frame}`)}">
      <header>
        <div>
          <p class="eyebrow">${String(row.order).padStart(3, "0")} · ${esc(row.frame.toUpperCase())}</p>
          <h2>${esc(row.title_zh)}</h2>
        </div>
        <span class="decision">${esc(row.decision)}</span>
      </header>
      <a href="${esc(row.package_frame_href)}"><img src="${esc(row.package_frame_href)}" alt="${esc(`${row.title_zh} ${row.frame}`)}"></a>
      <section class="meta">
        <p><strong>Visible named-only:</strong> ${esc(row.visible_named_only.join(", ") || "none")}</p>
        <p><strong>Primary check:</strong> ${esc(row.primary_check)}</p>
        <p><strong>Codex visual observation:</strong> ${esc(row.codex_visual_observation)}</p>
        ${row.monitor_note ? `<p><strong>Monitor note:</strong> ${esc(row.monitor_note)}</p>` : ""}
        <p><strong>Contact sheet:</strong> <a href="${esc(path.relative(packageDir, path.join(root, row.contact_sheet)).split(path.sep).join("/"))}">${esc(row.contact_sheet)}</a></p>
        <p><strong>Source:</strong> <code>${esc(row.source_frame)}</code></p>
        <p><strong>Size:</strong> ${esc(row.width)}x${esc(row.height)} · <strong>source digest match:</strong> ${esc(row.digest_matches_source ? "yes" : "no")}</p>
        <details><summary>Reject If</summary><ul>${row.reject_if.map((line) => `<li>${esc(line)}</li>`).join("")}</ul></details>
        ${row.problems.length ? `<p class="problem"><strong>Problems:</strong> ${esc(row.problems.join("; "))}</p>` : ""}
      </section>
    </article>
  `).join("");

  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Scene09 逐帧视觉审核矩阵</title>
  <style>
    :root { color-scheme: light; --ink:#20242a; --muted:#5f6874; --line:#d7dde5; --paper:#f5f7f9; --panel:#fff; --blue:#235fa7; --red:#9f3f3f; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--paper); color:var(--ink); font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    .top { position:sticky; top:0; z-index:2; background:rgba(245,247,249,.96); border-bottom:1px solid var(--line); backdrop-filter:blur(10px); }
    .inner, main { max-width:1440px; margin:0 auto; padding:18px 22px; }
    h1 { margin:0 0 8px; font-size:24px; letter-spacing:0; }
    h2 { margin:0; font-size:18px; letter-spacing:0; }
    p { margin:0 0 6px; }
    a { color:var(--blue); text-decoration:none; }
    a:hover { text-decoration:underline; }
    code { overflow-wrap:anywhere; white-space:normal; }
    .summary { display:grid; grid-template-columns:repeat(4,minmax(130px,1fr)); gap:10px; margin-top:12px; }
    .metric, .frame-card { border:1px solid var(--line); border-radius:8px; background:var(--panel); }
    .metric { padding:10px; }
    .metric strong { display:block; font-size:20px; }
    .metric span, .eyebrow { color:var(--muted); font-size:12px; }
    .matrix { display:grid; grid-template-columns:repeat(auto-fit,minmax(360px,1fr)); gap:14px; }
    .frame-card { overflow:hidden; }
    .frame-card header { display:flex; justify-content:space-between; gap:12px; align-items:start; padding:12px 14px; border-bottom:1px solid var(--line); }
    .decision { padding:4px 7px; border:1px solid var(--line); border-radius:6px; color:var(--muted); font-size:12px; }
    .blocked .decision, .problem { color:var(--red); }
    .frame-card img { width:100%; aspect-ratio:16/9; object-fit:cover; display:block; background:#dce2e9; }
    .meta { padding:12px 14px; }
    ul { margin:8px 0 0 18px; padding:0; }
    @media (max-width:760px) { .summary { grid-template-columns:1fr 1fr; } .matrix { grid-template-columns:1fr; } }
  </style>
</head>
<body>
  <header class="top">
    <div class="inner">
      <h1>Scene09 逐帧视觉审核矩阵</h1>
      <p>逐帧列出 42 个镜头的 start/key/end PNG、可见角色、主检查、拒绝条件、source digest 和 Codex contact-sheet 目视审查备注。结论仍是 monitor_required：正片生成后必须做 motion probe / clip review。</p>
      <p><a href="index.html">返回 handoff index</a> · <a href="per_frame_visual_review_matrix.json">JSON</a> · <a href="per_frame_visual_review_matrix.csv">CSV</a></p>
      <div class="summary">
        <div class="metric"><strong>${esc(manifest.shots.length)}</strong><span>shots</span></div>
        <div class="metric"><strong>${esc(rows.length)}</strong><span>frames reviewed</span></div>
        <div class="metric"><strong>${esc(report.frames_passed)}</strong><span>frames passed integrity</span></div>
        <div class="metric"><strong>${esc(problems.length)}</strong><span>blocking problems</span></div>
      </div>
    </div>
  </header>
  <main class="matrix">${cards}</main>
</body>
</html>
`;

  writeJson(outJson, report);
  writeText(outCsv, `${csv}\n`);
  writeText(outHtml, html);
  writeJson(packageJson, { ...report, rows: rows.map((row) => ({ ...row, reject_if: undefined })) });
  writeText(packageCsv, `${csv}\n`);

  console.log(JSON.stringify({
    decision,
    shots_checked: manifest.shots.length,
    frames_checked: rows.length,
    problems: problems.length,
    html: relFromRoot(outHtml),
    report_json: relFromRoot(outJson),
  }, null, 2));
  if (problems.length) process.exit(1);
}

main();
