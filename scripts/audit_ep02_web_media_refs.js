#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-02";
const dataPath = path.join(root, "site/ep02_storyboard_data.js");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const outJson = path.join(outDir, `ep02_web_media_refs_audit_${date}.json`);
const outMd = path.join(outDir, `ep02_web_media_refs_audit_${date}.md`);
const packageJson = path.join(packageDir, "ep02_web_media_refs_audit.json");
const packageMd = path.join(packageDir, "ep02_web_media_refs_audit.md");

const localExt = /\.(png|jpe?g|svg|webp|gif|mp4|json|md|html|csv|sh)$/i;
const localPathPattern = /((?:assets|episodes|delivery|production_system|site|specials|docs)\/[^\s"'<>`)]+?\.(?:png|jpe?g|svg|webp|gif|mp4|json|md|html|csv|sh))(?:#[^\s"'<>`)]*)?/ig;
const imageExt = /\.(png|jpe?g|svg|webp|gif)$/i;
const videoExt = /\.mp4$/i;

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function rel(file) {
  return path.relative(root, file);
}

function loadData() {
  const code = fs.readFileSync(dataPath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: dataPath });
  return sandbox.window.EP02_STORYBOARD_DATA;
}

function cleanRef(ref) {
  return String(ref || "")
    .replace(/^`+|`+$/g, "")
    .replace(/[.,，。;；:：]+$/g, "")
    .replace(/#.*$/g, "");
}

function collectRefs(value, refs = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectRefs(item, refs);
    return refs;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectRefs(item, refs);
    return refs;
  }
  if (typeof value !== "string") return refs;
  for (const match of value.matchAll(localPathPattern)) {
    const ref = cleanRef(match[1]);
    if (localExt.test(ref)) refs.push(ref);
  }
  return refs;
}

function classify(ref) {
  if (imageExt.test(ref)) return "image";
  if (videoExt.test(ref)) return "video";
  return "document";
}

function main() {
  if (!fs.existsSync(dataPath)) throw new Error(`Missing web data: ${rel(dataPath)}`);
  const data = loadData();
  const refs = [...new Set(collectRefs(data).map(cleanRef))].sort();
  const rows = refs.map((ref) => {
    const absolute = path.join(root, ref);
    const exists = fs.existsSync(absolute);
    return {
      ref,
      kind: classify(ref),
      exists,
      status: exists ? "present" : (videoExt.test(ref) ? "pending_video_output" : "missing_required_asset"),
    };
  });
  const missingRequired = rows.filter((row) => !row.exists && row.kind !== "video");
  const pendingVideos = rows.filter((row) => !row.exists && row.kind === "video");
  const imageRows = rows.filter((row) => row.kind === "image");
  const documentRows = rows.filter((row) => row.kind === "document");
  const videoRows = rows.filter((row) => row.kind === "video");
  const decision = missingRequired.length ? "ep02_web_media_refs_blocked_missing_required_assets" : "ep02_web_media_refs_passed_videos_pending";
  const report = {
    date,
    decision,
    data_path: rel(dataPath),
    data_sha256: sha256File(dataPath),
    refs_checked: rows.length,
    images_checked: imageRows.length,
    documents_checked: documentRows.length,
    videos_checked: videoRows.length,
    missing_required_assets: missingRequired.length,
    pending_video_outputs: pendingVideos.length,
    missing_required_asset_refs: missingRequired.map((row) => row.ref),
    pending_video_output_refs: pendingVideos.map((row) => row.ref),
    rows,
  };
  const md = [
    "# EP02 Web Media References Audit",
    "",
    `Date: ${date}`,
    `Decision: \`${decision}\``,
    `Refs checked: ${rows.length}`,
    `Images checked: ${imageRows.length}`,
    `Documents checked: ${documentRows.length}`,
    `Videos checked: ${videoRows.length}`,
    `Missing required assets: ${missingRequired.length}`,
    `Pending video outputs: ${pendingVideos.length}`,
    "",
    "## Missing Required Assets",
    "",
    missingRequired.length ? missingRequired.map((row) => `- ${row.ref}`).join("\n") : "- none",
    "",
    "## Pending Video Outputs",
    "",
    pendingVideos.length ? pendingVideos.map((row) => `- ${row.ref}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeJson(outJson, report);
  writeText(outMd, md);
  if (fs.existsSync(packageDir)) {
    writeJson(packageJson, report);
    writeText(packageMd, md);
  }
  console.log(JSON.stringify({
    decision,
    refs_checked: rows.length,
    images_checked: imageRows.length,
    documents_checked: documentRows.length,
    videos_checked: videoRows.length,
    missing_required_assets: missingRequired.length,
    pending_video_outputs: pendingVideos.length,
    report_json: rel(outJson),
    package_report_json: fs.existsSync(packageDir) ? rel(packageJson) : null,
  }, null, 2));
  if (missingRequired.length) process.exit(1);
}

main();
