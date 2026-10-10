const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { spawnSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const siteDataPath = path.join(projectRoot, "site", "ep03_storyboard_data.js");
const outDir = path.join(
  projectRoot,
  "episodes",
  "EP03",
  "production_system",
  "reviews",
  "critical_reaudit_2026-08-12"
);

function loadSiteData() {
  const code = fs.readFileSync(siteDataPath, "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: siteDataPath });
  return context.window.EP03_STORYBOARD_DATA;
}

function absFromRel(relPath) {
  return path.join(projectRoot, relPath);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildContactSheet(chunk, partIndex) {
  const inputs = [];
  const missing = [];
  for (const shot of chunk) {
    for (const key of ["start", "key", "end"]) {
      const rel = shot.frames && shot.frames[key];
      const abs = rel ? absFromRel(rel) : "";
      if (!rel || !fs.existsSync(abs)) missing.push({ shot: shot.shot_id, key, rel });
      inputs.push(abs);
    }
  }

  const args = ["-hide_banner", "-loglevel", "error", "-y"];
  for (const input of inputs) {
    args.push("-i", input);
  }

  const filters = [];
  inputs.forEach((_, index) => {
    filters.push(
      `[${index}:v]scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2:black[v${index}]`
    );
  });

  const rows = [];
  chunk.forEach((shot, rowIndex) => {
    const base = rowIndex * 3;
    const rowLabel = `row${rowIndex}`;
    filters.push(`[v${base}][v${base + 1}][v${base + 2}]hstack=inputs=3[${rowLabel}]`);
    rows.push(`[${rowLabel}]`);
  });
  filters.push(`${rows.join("")}vstack=inputs=${rows.length}[out]`);

  const output = path.join(outDir, `ep03_current_web_display_contact_sheet_part${partIndex}.jpg`);
  args.push("-filter_complex", filters.join(";"), "-map", "[out]", "-frames:v", "1", output);

  const result = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for part ${partIndex}`);
  }
  return { output, missing };
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const data = loadSiteData();
  const shots = data.shots.map((shot) => ({
    shot_id: shot.shot_id || shot.shot,
    title: shot.title,
    status: shot.status,
    frames: Object.fromEntries((shot.frameSet || []).map((frame) => [frame.role, frame.path])),
    current_display_frame_set: shot.current_display_frame_set || "",
    frame_set_source: shot.displayImageSource || shot.frame_set_source || "",
    prompt_status: shot.prompt_status || ""
  }));

  const contactSheets = [];
  const allMissing = [];
  for (let i = 0; i < shots.length; i += 9) {
    const chunk = shots.slice(i, i + 9);
    const partIndex = Math.floor(i / 9) + 1;
    const built = buildContactSheet(chunk, partIndex);
    contactSheets.push({
      part: partIndex,
      file: path.relative(projectRoot, built.output),
      shots: chunk.map((shot) => shot.shot_id)
    });
    allMissing.push(...built.missing);
  }

  const index = {
    generated_at: "2026-08-12",
    source: path.relative(projectRoot, siteDataPath),
    shot_count: shots.length,
    frame_count: shots.length * 3,
    contact_sheets: contactSheets,
    missing: allMissing,
    order_note: "Each contact sheet row is one shot; columns are START, KEY, END."
  };
  fs.writeFileSync(
    path.join(outDir, "current_web_display_contact_sheet_index.json"),
    `${JSON.stringify(index, null, 2)}\n`
  );

  const rows = shots
    .map((shot) => {
      const frameCells = ["start", "key", "end"]
        .map((key) => {
          const rel = shot.frames && shot.frames[key];
          return `<td><a href="../../../../../${escapeHtml(rel)}"><img src="../../../../../${escapeHtml(
            rel
          )}" alt="${escapeHtml(`${shot.shot_id} ${key}`)}"></a><div>${key}</div></td>`;
        })
        .join("");
      return `<tr><th><div>${escapeHtml(shot.shot_id)}</div><small>${escapeHtml(
        shot.title || ""
      )}</small><small>${escapeHtml(shot.status || "")}</small><small>${escapeHtml(
        shot.current_display_frame_set || shot.frame_set_source || ""
      )}</small></th>${frameCells}</tr>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EP03 Current Web Display Critical Re-Audit</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #111; color: #eee; }
    header { position: sticky; top: 0; z-index: 2; padding: 16px 20px; background: #181818; border-bottom: 1px solid #333; }
    h1 { margin: 0 0 6px; font-size: 22px; }
    p { margin: 0; color: #bbb; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { border-bottom: 1px solid #292929; padding: 10px; vertical-align: top; }
    th { width: 240px; text-align: left; color: #ddd; background: #151515; }
    small { display: block; margin-top: 5px; color: #9b9b9b; overflow-wrap: anywhere; }
    img { width: 100%; aspect-ratio: 16 / 9; object-fit: contain; background: #000; display: block; }
    td div { margin-top: 6px; color: #aaa; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
  </style>
</head>
<body>
  <header>
    <h1>EP03 当前 Web 展示帧 Critical Re-Audit</h1>
    <p>逐行一个镜头，三列依次为 START / KEY / END。该页面只用于审查当前 web 实际引用的图。</p>
  </header>
  <table>
    <tbody>
${rows}
    </tbody>
  </table>
</body>
</html>`;
  fs.writeFileSync(path.join(outDir, "current_web_display_reaudit_viewer.html"), html);
  console.log(JSON.stringify(index, null, 2));
}

main();
