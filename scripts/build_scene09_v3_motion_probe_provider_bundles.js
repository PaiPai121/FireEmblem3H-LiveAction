#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const probeDir = path.join(pkgDir, "motion_probe_submission");
const probeManifestPath = path.join(probeDir, "motion_probe_manifest.json");
const outRel = `${pkgRel}/motion_probe_provider_bundles`;
const outDir = path.join(root, outRel);
const batchSize = 6;

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

function sha256(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function rel(file) {
  return path.relative(root, file);
}

function relFromBundles(file) {
  const absolute = path.isAbsolute(file) ? file : path.join(pkgDir, file);
  return path.relative(outDir, absolute).split(path.sep).join("/");
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

function csvCell(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function chunks(rows, size) {
  const result = [];
  for (let i = 0; i < rows.length; i += size) result.push(rows.slice(i, i + size));
  return result;
}

function batchId(index, rows) {
  const first = String(rows[0].order).padStart(3, "0");
  const last = String(rows[rows.length - 1].order).padStart(3, "0");
  return `probe_batch_${String(index + 1).padStart(3, "0")}_shots_${first}-${last}`;
}

function localShotDir(row) {
  return `shots/${String(row.order).padStart(3, "0")}_${row.id}`;
}

function localRow(row) {
  const shotDir = localShotDir(row);
  return {
    custom_id: row.custom_id,
    order: row.order,
    shot: row.shot,
    id: row.id,
    title: row.title,
    probe_duration_seconds: row.probe_duration_seconds,
    parent_full_duration_seconds: row.parent_full_duration_seconds,
    visible_named_only: row.visible_named_only,
    visible_but_no_active_combat_after: row.visible_but_no_active_combat_after || "none",
    audio_anchor: row.audio_anchor,
    prompt_text: readText(path.join(pkgDir, row.probe_prompt_file)),
    negative_prompt_text: readText(path.join(pkgDir, row.negative_prompt_file)).trim(),
    probe_prompt_file: `${shotDir}/probe_prompt.md`,
    negative_prompt_file: `${shotDir}/negative_prompt.md`,
    metadata_file: `${shotDir}/metadata.json`,
    input_frames: {
      start_frame: `${shotDir}/start_frame.png`,
      key_frame: `${shotDir}/key_frame.png`,
      end_frame: `${shotDir}/end_frame.png`,
    },
    expected_probe_clip: row.expected_probe_clip,
    parent_expected_clip: row.parent_expected_clip,
    primary_check: row.primary_check,
    reject_if: row.reject_if || [],
    alive_safe_after: row.alive_safe_after,
    active_or_objective_after: row.active_or_objective_after,
    limited_after: row.limited_after,
    defeated_removed_after: row.defeated_removed_after,
    captured_objective_defeated_after: row.captured_objective_defeated_after,
    stood_down_post_battle_after: row.stood_down_post_battle_after,
    must_not_return_active_after: row.must_not_return_active_after,
    changed_this_shot: row.changed_this_shot,
    no_active_combat_line: row.no_active_combat_line,
    battle_ledger_after: row.battle_ledger_after,
  };
}

function renderJsonl(rows) {
  return rows.map((row) => JSON.stringify(row)).join("\n") + "\n";
}

function renderCsv(rows) {
  const fields = [
    "custom_id",
    "order",
    "shot",
    "probe_duration_seconds",
    "visible_named_only",
    "visible_but_no_active_combat_after",
    "probe_prompt_file",
    "negative_prompt_file",
    "start_frame",
    "key_frame",
    "end_frame",
    "expected_probe_clip",
    "parent_expected_clip",
    "primary_check",
    "alive_safe_after",
    "active_or_objective_after",
    "limited_after",
    "defeated_removed_after",
    "captured_objective_defeated_after",
    "stood_down_post_battle_after",
    "must_not_return_active_after",
    "changed_this_shot",
    "no_active_combat_line",
  ];
  const body = rows.map((row) => [
    row.custom_id,
    row.order,
    row.shot,
    row.probe_duration_seconds,
    row.visible_named_only,
    row.visible_but_no_active_combat_after || "none",
    row.probe_prompt_file,
    row.negative_prompt_file,
    row.input_frames.start_frame,
    row.input_frames.key_frame,
    row.input_frames.end_frame,
    row.expected_probe_clip,
    row.parent_expected_clip,
    row.primary_check,
    row.alive_safe_after,
    row.active_or_objective_after,
    row.limited_after,
    row.defeated_removed_after,
    row.captured_objective_defeated_after,
    row.stood_down_post_battle_after,
    row.must_not_return_active_after,
    row.changed_this_shot,
    row.no_active_combat_line,
  ]);
  return [fields, ...body].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function renderExpectedDownloads(rows) {
  const fields = ["custom_id", "shot", "expected_probe_filename", "expected_probe_clip", "parent_expected_clip"];
  const body = rows.map((row) => [
    row.custom_id,
    row.shot,
    path.basename(row.expected_probe_clip),
    row.expected_probe_clip,
    row.parent_expected_clip,
  ]);
  return [fields, ...body].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function returnContract(rows, allRowsCount, batchesCount, batch) {
  return [
    "# Scene09 V3 Motion Probe Return Contract",
    "",
    "This batch is for 3-second motion probes only. It does not approve full-duration generation.",
    "",
    `- Expected probe batches: ${batchesCount}.`,
    `- Expected probe clips across package: ${allRowsCount}.`,
    `- Rows in this batch: ${rows.length}.`,
    "- Return format is `.mp4` only.",
    "- Each returned probe must match either the exact expected probe filename or begin with the exact probe `custom_id`.",
    "- Bare shot names are rejected as ambiguous.",
    "- Returned probe clips must pass ffprobe container validation before any motion QA begins.",
    "",
    "## Required Probe QA",
    "",
    "- Identity preserved.",
    "- Wardrobe and house colors preserved.",
    "- Training weapons and props preserved.",
    "- Visible named-only roster obeyed.",
    "- No anonymous readable students, spectators, soldiers, crowds, bystanders, or silhouettes.",
    "- No subtitles, captions, visible text, watermark, letterbox/pillarbox UI, or playback chrome.",
    "- Hanneman and Manuela remain separate faculty lanes and must not appear as a paired combat unit.",
    "- In Shot034B, Hanneman and Manuela are absent/offscreen/silent/unpaired; Shot034B allows only Byleth and Dimitri as readable humans.",
    "- Captured, stood-down, objective-defeated, defeated, or must-not-return-active characters do not resume active combat.",
    "- Full-duration generation remains blocked until Codex records signed motion review evidence for this probe.",
    "",
    "## Batch Expected Filenames",
    "",
    ...rows.map((row) => `- ${row.custom_id}: ${path.basename(row.expected_probe_clip)}`),
    "",
    `Batch id: ${batch.batch_id}.`,
  ].join("\n");
}

function uploadChecklist(rows) {
  return [
    "# Motion Probe Upload Checklist",
    "",
    "- Upload this batch as a 3-second image-to-video probe batch.",
    "- Use `probe_batch.jsonl` for structured submitters or `probe_batch.csv` for manual entry.",
    "- Do not use this batch to produce full-duration clips.",
    "- Save returned clips according to `expected_probe_downloads.csv`.",
    "",
    "## Rows",
    "",
    ...rows.map((row) => [
      `### ${row.custom_id}`,
      "",
      `- Shot: ${row.shot}`,
      `- Probe duration: ${row.probe_duration_seconds}s`,
      `- Visible named-only: ${row.visible_named_only}`,
      `- Visible But No Active Combat After: ${row.visible_but_no_active_combat_after || "none"}`,
      `- Probe prompt: ${row.probe_prompt_file}`,
      `- Negative prompt: ${row.negative_prompt_file}`,
      `- Frames: ${row.input_frames.start_frame} | ${row.input_frames.key_frame} | ${row.input_frames.end_frame}`,
      `- Expected probe clip: ${row.expected_probe_clip}`,
      `- Must not return active: ${row.must_not_return_active_after || "none"}`,
      "",
    ].join("\n")),
  ].join("\n");
}

function renderProviderIndex(manifestOut, batches, rowsByBatch) {
  const cards = batches.map((bundle) => {
    const localRows = rowsByBatch.get(bundle.batch_id) || [];
    const batchDir = `motion_probe_provider_bundles/${bundle.batch_id}`;
    const returnDir = `motion_probe_return_intake/${bundle.batch_id}_returns`;
    return `
      <article class="batch" id="${escapeHtml(bundle.batch_id)}">
        <header>
          <div>
            <p class="eyebrow">${escapeHtml(bundle.batch_id)} · ${escapeHtml(localRows.length)} probes</p>
            <h2>${escapeHtml(localRows[0]?.custom_id || "")} - ${escapeHtml(localRows.at(-1)?.custom_id || "")}</h2>
          </div>
          <a class="zip" href="${escapeHtml(relFromBundles(bundle.zip))}">下载 probe zip</a>
        </header>
        <div class="meta">
          <p><strong>Zip sha256:</strong> <code>${escapeHtml(bundle.zip_digest?.sha256 || "missing")}</code></p>
          <p><strong>Zip size:</strong> ${escapeHtml(bundle.zip_digest?.bytes || 0)} bytes</p>
          <p><strong>返回目录:</strong> <a href="${escapeHtml(relFromBundles(returnDir))}">${escapeHtml(returnDir)}</a></p>
          <p><strong>锁定:</strong> full-duration generation remains blocked until all probes pass signed Codex review.</p>
        </div>
        <nav>
          <a href="${escapeHtml(`${bundle.batch_id}/probe_batch.jsonl`)}">probe_batch.jsonl</a>
          <a href="${escapeHtml(`${bundle.batch_id}/probe_batch.csv`)}">probe_batch.csv</a>
          <a href="${escapeHtml(`${bundle.batch_id}/expected_probe_downloads.csv`)}">expected_probe_downloads.csv</a>
          <a href="${escapeHtml(`${bundle.batch_id}/ORDERED_PROBE_UPLOAD_CHECKLIST.md`)}">upload checklist</a>
          <a href="${escapeHtml(`${bundle.batch_id}/PROBE_RETURN_CONTRACT.md`)}">return contract</a>
          <a href="${escapeHtml(`${bundle.batch_id}/probe_bundle_manifest.json`)}">bundle manifest</a>
        </nav>
        <table>
          <thead><tr><th>Probe</th><th>镜头</th><th>可见角色</th><th>预期返回文件</th></tr></thead>
          <tbody>
            ${localRows.map((row) => `
              <tr>
                <td><code>${escapeHtml(row.custom_id)}</code></td>
                <td>${escapeHtml(displayTitleForShot(row.shot))}</td>
                <td>${escapeHtml(row.visible_named_only || "none")}</td>
                <td><code>${escapeHtml(path.basename(row.expected_probe_clip || ""))}</code></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </article>
    `;
  }).join("");

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Scene09 3秒 Motion Probe 提交包</title>
  <style>
    :root { color-scheme: light; --ink:#20242a; --muted:#5f6874; --line:#d7dde5; --paper:#f7f8fa; --panel:#fff; --blue:#235fa7; --red:#9f3f3f; }
    * { box-sizing: border-box; }
    body { margin:0; color:var(--ink); background:var(--paper); font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    .top { position:sticky; top:0; z-index:2; border-bottom:1px solid var(--line); background:rgba(247,248,250,.96); backdrop-filter:blur(10px); }
    .inner, main { max-width:1440px; margin:0 auto; padding:18px 22px; }
    h1 { margin:0 0 8px; font-size:24px; letter-spacing:0; }
    h2 { margin:0; font-size:18px; letter-spacing:0; }
    p { margin:0 0 6px; }
    a { color:var(--blue); text-decoration:none; }
    a:hover { text-decoration:underline; }
    code { overflow-wrap:anywhere; white-space:normal; }
    .metrics { display:grid; grid-template-columns:repeat(4,minmax(130px,1fr)); gap:10px; margin-top:12px; }
    .metric, .batch { border:1px solid var(--line); border-radius:8px; background:var(--panel); }
    .metric { padding:10px; min-height:72px; }
    .metric strong { display:block; font-size:20px; }
    .metric span, .eyebrow { color:var(--muted); font-size:12px; }
    .warning { color:var(--red); font-weight:700; }
    .batch { margin:18px 0; overflow:hidden; }
    .batch header { display:flex; justify-content:space-between; gap:14px; align-items:center; padding:14px 16px; border-bottom:1px solid var(--line); }
    .zip { display:inline-block; padding:8px 10px; border:1px solid var(--blue); border-radius:6px; font-weight:700; }
    .meta, nav { padding:12px 16px; border-bottom:1px solid var(--line); }
    nav { display:flex; gap:12px; flex-wrap:wrap; }
    table { width:100%; border-collapse:collapse; }
    th, td { padding:8px 10px; border-top:1px solid var(--line); text-align:left; vertical-align:top; }
    th { color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:0; }
    @media (max-width: 760px) { .metrics { grid-template-columns:1fr 1fr; } .batch header { display:block; } .zip { margin-top:8px; } }
  </style>
</head>
<body>
  <header class="top">
    <div class="inner">
      <h1>Scene09 3秒 Motion Probe 提交包</h1>
      <p class="warning">只提交 motion probe。正片 full-duration 批次仍锁定，直到 42/42 probe 返回并通过 Codex motion review。</p>
      <div class="metrics">
        <div class="metric"><strong>${escapeHtml(manifestOut.total_batches)}</strong><span>probe batches</span></div>
        <div class="metric"><strong>${escapeHtml(manifestOut.total_shots)}</strong><span>probe shots</span></div>
        <div class="metric"><strong>${escapeHtml(manifestOut.probe_duration_seconds)}s</strong><span>probe duration</span></div>
        <div class="metric"><strong>${escapeHtml(batches.filter((bundle) => bundle.zip).length)}</strong><span>zip bundles</span></div>
      </div>
      <p><a href="README.md">README</a> · <a href="motion_probe_provider_bundles_manifest.json">provider bundles manifest</a> · <a href="../motion_probe_return_intake/README.md">return intake</a> · <a href="../OPERATOR_NEXT_STEPS.md">operator next steps</a></p>
    </div>
  </header>
  <main>${cards}</main>
</body>
</html>
`;
}

function copyFile(sourceRel, target, records) {
  const source = path.join(pkgDir, sourceRel);
  if (!fs.existsSync(source)) throw new Error(`Missing source for probe bundle: ${rel(source)}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  records.push({ path: rel(target).replace(`${outRel}/`, ""), ...sha256(target) });
}

function zipDirectory(sourceDir, zipPath) {
  if (!fs.existsSync("/usr/bin/zip")) return null;
  fs.rmSync(zipPath, { force: true });
  cp.execFileSync("/usr/bin/zip", ["-qr", zipPath, "."], { cwd: sourceDir, stdio: "ignore" });
  return sha256(zipPath);
}

function main() {
  if (!fs.existsSync(probeManifestPath)) throw new Error(`Missing motion probe manifest: ${rel(probeManifestPath)}`);
  const probeManifest = readJson(probeManifestPath);
  const rows = [...(probeManifest.rows || [])].sort((a, b) => Number(a.order) - Number(b.order));
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const batches = [];
  const rowsByBatch = new Map();
  const grouped = chunks(rows, batchSize);
  grouped.forEach((batchRows, index) => {
    const id = batchId(index, batchRows);
    const dir = path.join(outDir, id);
    fs.mkdirSync(dir, { recursive: true });
    const localRows = batchRows.map(localRow);
    rowsByBatch.set(id, localRows);
    const records = [];

    writeText(path.join(dir, "probe_batch.jsonl"), renderJsonl(localRows));
    records.push({ path: `${id}/probe_batch.jsonl`, ...sha256(path.join(dir, "probe_batch.jsonl")) });
    writeText(path.join(dir, "probe_batch.csv"), renderCsv(localRows));
    records.push({ path: `${id}/probe_batch.csv`, ...sha256(path.join(dir, "probe_batch.csv")) });
    writeText(path.join(dir, "expected_probe_downloads.csv"), renderExpectedDownloads(localRows));
    records.push({ path: `${id}/expected_probe_downloads.csv`, ...sha256(path.join(dir, "expected_probe_downloads.csv")) });
    writeText(path.join(dir, "ORDERED_PROBE_UPLOAD_CHECKLIST.md"), uploadChecklist(localRows));
    records.push({ path: `${id}/ORDERED_PROBE_UPLOAD_CHECKLIST.md`, ...sha256(path.join(dir, "ORDERED_PROBE_UPLOAD_CHECKLIST.md")) });
    writeText(path.join(dir, "PROBE_RETURN_CONTRACT.md"), returnContract(localRows, rows.length, grouped.length, { batch_id: id }));
    records.push({ path: `${id}/PROBE_RETURN_CONTRACT.md`, ...sha256(path.join(dir, "PROBE_RETURN_CONTRACT.md")) });

    for (const row of batchRows) {
      const shotDir = localShotDir(row);
      copyFile(row.probe_prompt_file, path.join(dir, shotDir, "probe_prompt.md"), records);
      copyFile(row.negative_prompt_file, path.join(dir, shotDir, "negative_prompt.md"), records);
      copyFile(row.metadata_file, path.join(dir, shotDir, "metadata.json"), records);
      copyFile(row.start_frame, path.join(dir, shotDir, "start_frame.png"), records);
      copyFile(row.key_frame, path.join(dir, shotDir, "key_frame.png"), records);
      copyFile(row.end_frame, path.join(dir, shotDir, "end_frame.png"), records);
    }

    const bundleManifest = {
      version: 1,
      batch_id: id,
      probe_duration_seconds: probeManifest.probe_duration_seconds,
      rows: localRows.length,
      custom_ids: localRows.map((row) => row.custom_id),
      expected_probe_downloads: "expected_probe_downloads.csv",
      return_contract: "PROBE_RETURN_CONTRACT.md",
      files: records,
    };
    writeJson(path.join(dir, "probe_bundle_manifest.json"), bundleManifest);
    records.push({ path: `${id}/probe_bundle_manifest.json`, ...sha256(path.join(dir, "probe_bundle_manifest.json")) });

    const zipRel = `${id}.zip`;
    const zipPath = path.join(outDir, zipRel);
    const zipDigest = zipDirectory(dir, zipPath);
    batches.push({
      batch_id: id,
      directory: `motion_probe_provider_bundles/${id}`,
      zip: zipDigest ? `motion_probe_provider_bundles/${zipRel}` : null,
      zip_digest: zipDigest,
      rows: localRows.length,
      custom_ids: localRows.map((row) => row.custom_id),
      files: records.length,
    });
  });

  const manifestOut = {
    version: 1,
    generated_at: new Date().toISOString(),
    decision: "motion_probe_provider_bundles_ready",
    source_motion_probe_manifest: "motion_probe_submission/motion_probe_manifest.json",
    source_motion_probe_manifest_sha256: sha256(probeManifestPath).sha256,
    probe_duration_seconds: probeManifest.probe_duration_seconds,
    total_batches: batches.length,
    total_shots: rows.length,
    bundle_policy: "Self-contained 3-second probe upload bundles; full-duration generation remains blocked until returned probes pass Codex motion QA.",
    bundles: batches,
  };
  writeJson(path.join(outDir, "motion_probe_provider_bundles_manifest.json"), manifestOut);
  writeText(path.join(outDir, "index.html"), renderProviderIndex(manifestOut, batches, rowsByBatch));
  writeText(path.join(outDir, "README.md"), [
    "# Scene09 V3 Motion Probe Provider Bundles",
    "",
    "These are self-contained 3-second motion probe upload bundles. They exist to test identity, wardrobe, props, no-extra-people, empty-objective teacher absence, and post-shot ledger continuity before full-duration clips are generated.",
    "",
    "- Open `index.html` for the Chinese visual batch index, per-shot titles, expected return filenames, and direct zip links.",
    "- Use the `.zip` files or matching folders one batch at a time.",
    "- Use `probe_batch.jsonl` for structured submitters.",
    "- Returned clips must follow `expected_probe_downloads.csv`.",
    "- Full-duration generation remains blocked until returned probes pass Codex motion QA.",
    "",
  ].join("\n"));

  const packageManifestPath = path.join(pkgDir, "package_manifest.json");
  const packageManifest = readJson(packageManifestPath);
  packageManifest.motion_probe_provider_bundles = "motion_probe_provider_bundles/motion_probe_provider_bundles_manifest.json";
  packageManifest.motion_probe_provider_bundles_dir = "motion_probe_provider_bundles";
  packageManifest.motion_probe_provider_bundles_index = "motion_probe_provider_bundles/index.html";
  writeJson(packageManifestPath, packageManifest);

  console.log(JSON.stringify({
    ok: true,
    decision: manifestOut.decision,
    batches: batches.length,
    zips: batches.filter((bundle) => bundle.zip).length,
    total_shots: rows.length,
    manifest: `${outRel}/motion_probe_provider_bundles_manifest.json`,
  }, null, 2));
}

main();
