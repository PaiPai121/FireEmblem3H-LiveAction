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

function boardHtml(entry, filePath) {
  const refs = entry.character_reference_assets || [];
  const subframes = entry.subframes || [];
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(entry.shot)} ${esc(entry.title)} Reference Board</title>
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
        <h1>${esc(entry.shot)} - ${esc(entry.title)}</h1>
        <p>${esc(entry.purpose || "")}</p>
      </div>
      <a class="pill" href="./index.html">Index</a>
    </header>
    ${entry.output_keyframe && fs.existsSync(entry.output_keyframe) ? `
      <section>
        <h2>Generated Keyframe</h2>
        <article class="card">
          <img style="aspect-ratio:16/9; object-fit:cover;" src="${rel(filePath, entry.output_keyframe)}" alt="${esc(entry.shot)} generated keyframe">
          <div class="body">
            <h2>${esc(entry.shot)} keyframe</h2>
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
            <strong>${esc(subframe.id)} ${esc(subframe.title)}</strong>
            <p>${esc(subframe.description)}</p>
            <p class="path">${esc(subframe.output_keyframe)}</p>
          </div>
        `).join("")}
      </div>
    </section>
    <section>
      <h2>Production Prompt</h2>
      <div class="prompt">${esc(entry.production_prompt)}</div>
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
          <strong>${esc(entry.shot)} - ${esc(entry.title)}</strong>
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
