#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const pkgRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const pkgDir = path.join(root, pkgRel);
const bundlesDir = path.join(pkgDir, "motion_probe_provider_bundles");
const manifestPath = path.join(bundlesDir, "motion_probe_provider_bundles_manifest.json");
const indexHtmlPath = path.join(bundlesDir, "index.html");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(outDir, `scene09_v3_motion_probe_provider_bundles_audit_${date}.json`);
const outMd = path.join(outDir, `scene09_v3_motion_probe_provider_bundles_audit_${date}.md`);
const packageJson = path.join(pkgDir, "motion_probe_provider_bundles_audit.json");
const packageMd = path.join(pkgDir, "motion_probe_provider_bundles_audit.md");

const requiredBatchFiles = [
  "probe_batch.jsonl",
  "probe_batch.csv",
  "expected_probe_downloads.csv",
  "ORDERED_PROBE_UPLOAD_CHECKLIST.md",
  "PROBE_RETURN_CONTRACT.md",
  "probe_bundle_manifest.json",
];

const requiredShotFiles = [
  "probe_prompt.md",
  "negative_prompt.md",
  "metadata.json",
  "start_frame.png",
  "key_frame.png",
  "end_frame.png",
];

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function rel(file) {
  return path.relative(root, file);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function lowerIncludes(text, phrase) {
  return String(text || "").toLowerCase().includes(String(phrase || "").toLowerCase());
}

function decodeHtml(value) {
  return String(value || "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function localLinks(html) {
  const links = [];
  for (const match of String(html || "").matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = decodeHtml(match[1]);
    if (/^(https?:|mailto:|#|javascript:)/.test(raw)) continue;
    const clean = raw.split("#")[0];
    if (clean) links.push(clean);
  }
  return links;
}

function jsonlRows(file) {
  return readText(file).trim().split(/\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function zipList(zipFile) {
  if (!zipFile || !fs.existsSync(zipFile) || !fs.existsSync("/usr/bin/unzip")) return [];
  const result = cp.execFileSync("/usr/bin/unzip", ["-Z1", zipFile], { encoding: "utf8" });
  return result.split(/\r?\n/).filter(Boolean);
}

function unzipToTemp(zipFile) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scene09-probe-bundle."));
  cp.execFileSync("/usr/bin/unzip", ["-q", zipFile, "-d", tmp], { stdio: "ignore" });
  return tmp;
}

function main() {
  const manifest = readJson(manifestPath, null);
  const packageManifest = readJson(path.join(pkgDir, "package_manifest.json"), { shots: [] });
  const probeManifest = readJson(path.join(pkgDir, "motion_probe_submission/motion_probe_manifest.json"), { rows: [] });
  const problems = [];
  const warnings = [];
  const rows = [];
  const packageShotByShot = new Map((packageManifest.shots || []).map((shot) => [shot.shot, shot]));

  if (!manifest) problems.push(`missing ${rel(manifestPath)}`);
  if (manifest && manifest.source_motion_probe_manifest_sha256 !== sha256(path.join(pkgDir, "motion_probe_submission/motion_probe_manifest.json"))) {
    problems.push("motion probe provider bundles source manifest sha256 is stale");
  }
  const bundles = Array.isArray(manifest?.bundles) ? manifest.bundles : [];
  if (bundles.length !== 7) problems.push(`expected 7 probe bundles, found ${bundles.length}`);
  if (Number(manifest?.total_shots || 0) !== 42) problems.push(`expected 42 probe rows, found ${manifest?.total_shots || 0}`);
  if (Number(manifest?.probe_duration_seconds || 0) !== 3) problems.push("probe duration is not 3 seconds");

  const seenCustomIds = new Set();
  const indexLinksChecked = [];
  const indexMissingLinks = [];
  let indexBatchCards = 0;
  let zipContentsChecked = 0;
  for (const bundle of bundles) {
    const bundleProblems = [];
    const bundleDir = path.join(bundlesDir, path.basename(bundle.directory || ""));
    const zipPath = bundle.zip ? path.join(pkgDir, bundle.zip) : null;
    if (!fs.existsSync(bundleDir)) bundleProblems.push("missing bundle directory");
    if (!zipPath || !fs.existsSync(zipPath)) bundleProblems.push("missing bundle zip");
    const batchRows = fs.existsSync(path.join(bundleDir, "probe_batch.jsonl"))
      ? jsonlRows(path.join(bundleDir, "probe_batch.jsonl"))
      : [];
    if (batchRows.length !== Number(bundle.rows || 0)) bundleProblems.push(`probe_batch rows ${batchRows.length} does not match manifest ${bundle.rows || 0}`);
    if (batchRows.length !== 6 && bundles.indexOf(bundle) !== bundles.length - 1) bundleProblems.push("non-final bundle does not have 6 rows");
    if (bundles.indexOf(bundle) === bundles.length - 1 && batchRows.length !== 6) bundleProblems.push("final bundle does not have 6 rows");

    for (const file of requiredBatchFiles) {
      if (!fs.existsSync(path.join(bundleDir, file))) bundleProblems.push(`missing ${file}`);
    }
    const returnContract = readText(path.join(bundleDir, "PROBE_RETURN_CONTRACT.md"));
    for (const phrase of [
      "3-second motion probes only",
      "Return format is `.mp4` only",
      "Bare shot names are rejected",
      "Full-duration generation remains blocked",
      "No anonymous readable students",
      "Hanneman and Manuela remain separate faculty lanes",
    ]) {
      if (!returnContract.includes(phrase)) bundleProblems.push(`return contract missing ${phrase}`);
    }

    for (const row of batchRows) {
      const rowProblems = [];
      if (seenCustomIds.has(row.custom_id)) rowProblems.push("duplicate custom_id");
      seenCustomIds.add(row.custom_id);
      if (Number(row.probe_duration_seconds || 0) !== 3) rowProblems.push("row duration is not 3 seconds");
      if (!String(row.expected_probe_clip || "").endsWith("_probe.mp4")) rowProblems.push("expected_probe_clip does not end with _probe.mp4");
      if (String(row.probe_prompt_file || "").includes(pkgRel)) rowProblems.push("probe_prompt_file leaks package path");
      if (String(row.input_frames?.start_frame || "").includes(pkgRel)) rowProblems.push("start_frame leaks package path");
      const shotDir = path.dirname(row.probe_prompt_file || "");
      for (const file of requiredShotFiles) {
        if (!fs.existsSync(path.join(bundleDir, shotDir, file))) rowProblems.push(`missing ${shotDir}/${file}`);
      }
      const prompt = readText(path.join(bundleDir, row.probe_prompt_file || ""));
      const negative = readText(path.join(bundleDir, row.negative_prompt_file || ""));
      if (!lowerIncludes(prompt, "duration: 3 seconds")) rowProblems.push("probe prompt missing 3-second duration");
      if (lowerIncludes(prompt, "duration: 6 seconds")) rowProblems.push("probe prompt still contains 6-second duration");
      if (!lowerIncludes(prompt, "motion probe only")) rowProblems.push("probe prompt missing motion probe only");
      if (!lowerIncludes(prompt, "full-duration generation is not approved until this probe passes")) rowProblems.push("probe prompt missing release gate");
      for (const phrase of ["no extra people", "no subtitles", "no captions", "no visible text", "no paired Hanneman and Manuela"]) {
        if (!lowerIncludes(negative, phrase)) rowProblems.push(`negative prompt missing ${phrase}`);
      }
      if (row.shot === "Shot034B" && !lowerIncludes(prompt, "No Manuela voice")) rowProblems.push("Shot034B missing no Manuela voice");
      if (row.shot === "Shot032" && !lowerIncludes(prompt, "Dimitri, offscreen")) rowProblems.push("Shot032 missing offscreen Dimitri lock");
      const packageShot = packageShotByShot.get(row.shot) || {};
      if (!packageShot.shot) rowProblems.push("row shot is missing from package_manifest");
      if (rowProblems.length) {
        problems.push(`${bundle.batch_id}/${row.custom_id}: ${rowProblems.join("; ")}`);
      }
      rows.push({
        order: packageShot.order ?? row.order,
        shot: row.shot,
        id: packageShot.id ?? row.id,
        expected_clip: packageShot.expected_clip ?? row.parent_expected_clip,
        package_dir: packageShot.package_dir ?? null,
        duration_seconds: packageShot.duration_seconds ?? row.parent_full_duration_seconds,
        bundle: bundle.batch_id,
        custom_id: row.custom_id,
        expected_probe_clip: row.expected_probe_clip,
        problems: rowProblems,
      });
    }

    if (zipPath && fs.existsSync(zipPath)) {
      const listing = zipList(zipPath);
      zipContentsChecked += listing.length;
      for (const file of requiredBatchFiles) {
        if (!listing.includes(file)) bundleProblems.push(`zip missing ${file}`);
      }
      if (fs.existsSync("/usr/bin/unzip")) {
        const tmp = unzipToTemp(zipPath);
        try {
          const zipRows = jsonlRows(path.join(tmp, "probe_batch.jsonl"));
          if (zipRows.length !== batchRows.length) bundleProblems.push("zip probe_batch row count differs from folder");
        } finally {
          fs.rmSync(tmp, { recursive: true, force: true });
        }
      }
    }

    if (bundleProblems.length) problems.push(`${bundle.batch_id}: ${bundleProblems.join("; ")}`);
  }

  if (seenCustomIds.size !== 42) problems.push(`unique probe custom_ids ${seenCustomIds.size} does not match 42`);
  const sourceIds = new Set((probeManifest.rows || []).map((row) => row.custom_id));
  for (const id of sourceIds) {
    if (!seenCustomIds.has(id)) problems.push(`missing source probe custom_id ${id}`);
  }

  const indexHtml = readText(indexHtmlPath);
  if (!indexHtml) {
    problems.push(`missing ${rel(indexHtmlPath)}`);
  } else {
    indexBatchCards = (indexHtml.match(/class="batch"/g) || []).length;
    if (!indexHtml.includes("Scene09 3秒 Motion Probe 提交包")) problems.push("provider visual index missing Chinese page title");
    if (!indexHtml.includes("只提交 motion probe")) problems.push("provider visual index missing probe-only warning");
    if (!indexHtml.includes("42/42 probe")) problems.push("provider visual index missing 42/42 probe gate text");
    if (!indexHtml.includes("镜头027B：黑鹫第一波压上")) problems.push("provider visual index missing Chinese title for Shot027B");
    if (!indexHtml.includes("镜头032：杜笃与梅尔塞德斯重建盾线")) problems.push("provider visual index missing Chinese title for Shot032");
    if (!indexHtml.includes("镜头034B：空教师目标裁定")) problems.push("provider visual index missing Chinese title for Shot034B");
    if (/<h2>\s*Shot\d+[A-Z]?\b/.test(indexHtml)) problems.push("provider visual index still uses bare English Shot titles in headings");
    if (indexBatchCards !== 7) problems.push(`provider visual index batch cards ${indexBatchCards}/7`);
    const zipLinks = (indexHtml.match(/href="[^"]+\.zip"/g) || []).length;
    if (zipLinks !== 7) problems.push(`provider visual index zip links ${zipLinks}/7`);
    for (const id of sourceIds) {
      if (!indexHtml.includes(id)) problems.push(`provider visual index missing custom_id ${id}`);
    }
    for (const raw of localLinks(indexHtml)) {
      const target = path.resolve(bundlesDir, raw);
      const exists = fs.existsSync(target);
      indexLinksChecked.push({ raw, target: rel(target), exists });
      if (!exists) indexMissingLinks.push({ raw, target: rel(target) });
    }
    if (indexMissingLinks.length) problems.push(`provider visual index has ${indexMissingLinks.length} missing local links`);
  }

  const decision = problems.length ? "motion_probe_provider_bundles_blocked" : "motion_probe_provider_bundles_ready";
  const report = {
    version: 1,
    generated_at: new Date().toISOString(),
    decision,
    bundles_checked: bundles.length,
    rows_checked: rows.length,
    unique_custom_ids: seenCustomIds.size,
    zip_contents_checked: zipContentsChecked,
    provider_visual_index: fs.existsSync(indexHtmlPath) ? rel(indexHtmlPath) : null,
    provider_visual_index_batch_cards: indexBatchCards,
    provider_visual_index_links_checked: indexLinksChecked.length,
    provider_visual_index_missing_links: indexMissingLinks,
    problems,
    warnings,
    rows,
  };
  const md = [
    "# Scene09 V3 Motion Probe Provider Bundles Audit",
    "",
    `Decision: \`${decision}\``,
    `Bundles checked: ${bundles.length}`,
    `Rows checked: ${rows.length}`,
    `Provider visual index: ${fs.existsSync(indexHtmlPath) ? rel(indexHtmlPath) : "missing"}`,
    `Provider visual index batch cards: ${indexBatchCards}`,
    `Provider visual index links checked: ${indexLinksChecked.length}`,
    `Provider visual index missing links: ${indexMissingLinks.length}`,
    `Problems: ${problems.length}`,
    `Warnings: ${warnings.length}`,
    "",
    "## Blocking Problems",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeJson(outJson, report);
  writeText(outMd, md);
  writeJson(packageJson, report);
  writeText(packageMd, md);

  console.log(JSON.stringify({
    decision,
    bundles_checked: bundles.length,
    rows_checked: rows.length,
    unique_custom_ids: seenCustomIds.size,
    zip_contents_checked: zipContentsChecked,
    provider_visual_index_batch_cards: indexBatchCards,
    provider_visual_index_links_checked: indexLinksChecked.length,
    provider_visual_index_missing_links: indexMissingLinks.length,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageJson),
  }, null, 2));
  if (decision !== "motion_probe_provider_bundles_ready") process.exit(1);
}

main();
