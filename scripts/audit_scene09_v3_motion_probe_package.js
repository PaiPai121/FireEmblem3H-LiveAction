#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const probeDir = path.join(packageDir, "motion_probe_submission");
const probeManifestPath = path.join(probeDir, "motion_probe_manifest.json");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(outDir, `scene09_v3_motion_probe_package_audit_${date}.json`);
const outMd = path.join(outDir, `scene09_v3_motion_probe_package_audit_${date}.md`);
const packageJson = path.join(packageDir, "motion_probe_package_audit.json");
const packageMd = path.join(packageDir, "motion_probe_package_audit.md");

const requiredLedgerFields = [
  "alive_safe_after",
  "visible_but_no_active_combat_after",
  "active_or_objective_after",
  "limited_after",
  "defeated_removed_after",
  "captured_objective_defeated_after",
  "stood_down_post_battle_after",
  "must_not_return_active_after",
  "changed_this_shot",
  "no_active_combat_line",
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

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function lowerIncludes(text, phrase) {
  return String(text || "").toLowerCase().includes(String(phrase || "").toLowerCase());
}

function section(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(text || "").match(new RegExp(`^${escaped}:\\n([\\s\\S]*?)(?=\\n[A-Za-z][A-Za-z /-]*:\\n|\\n?$)`, "m"));
  return match ? match[1].trim() : "";
}

function expectedProbeClip(row) {
  return `episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/${String(row.order).padStart(2, "0")}_${row.shot}_probe.mp4`;
}

function main() {
  const packageManifest = readJson(packageManifestPath, { shots: [] });
  const probeManifest = readJson(probeManifestPath, null);
  const problems = [];
  const warnings = [];
  const rows = [];

  if (!probeManifest) {
    problems.push(`missing motion probe manifest ${rel(probeManifestPath)}`);
  }
  if (!fs.existsSync(path.join(probeDir, "motion_probe_payload.jsonl"))) {
    problems.push("missing motion_probe_payload.jsonl");
  }
  if (!fs.existsSync(path.join(probeDir, "motion_probe_queue.csv"))) {
    problems.push("missing motion_probe_queue.csv");
  }
  if (!fs.existsSync(path.join(probeDir, "motion_probe_qa_checklist.csv"))) {
    problems.push("missing motion_probe_qa_checklist.csv");
  }
  if (!fs.existsSync(path.join(probeDir, "README.md"))) {
    problems.push("missing motion probe README.md");
  }

  const expectedShots = [...(packageManifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const manifestRows = Array.isArray(probeManifest?.rows) ? probeManifest.rows : [];
  if (probeManifest && probeManifest.source_package_manifest_sha256 !== sha256File(packageManifestPath)) {
    problems.push("motion probe manifest source_package_manifest_sha256 is stale");
  }
  if (probeManifest && Number(probeManifest.total_shots || 0) !== expectedShots.length) {
    problems.push(`motion probe total_shots ${probeManifest.total_shots || 0} does not match package ${expectedShots.length}`);
  }
  if (manifestRows.length !== expectedShots.length) {
    problems.push(`motion probe rows ${manifestRows.length} does not match package ${expectedShots.length}`);
  }

  const rowsByShot = new Map(manifestRows.map((row) => [row.shot, row]));
  for (const shot of expectedShots) {
    const row = rowsByShot.get(shot.shot);
    const rowProblems = [];
    const rowWarnings = [];
    if (!row) {
      rowProblems.push("missing row");
      rows.push({ order: shot.order, shot: shot.shot, problems: rowProblems, warnings: rowWarnings });
      problems.push(`${shot.shot}: missing motion probe row`);
      continue;
    }
    const probePromptPath = path.join(packageDir, row.probe_prompt_file || "");
    const negativePromptPath = path.join(packageDir, row.negative_prompt_file || "");
    const metadataPath = path.join(packageDir, row.metadata_file || "");
    const probePrompt = readText(probePromptPath);
    const negativePrompt = readText(negativePromptPath);
    const probeMetadata = readJson(metadataPath, {});
    const negativeSection = section(probePrompt, "Negative Prompt");

    if (Number(row.probe_duration_seconds || 0) !== 3) rowProblems.push("probe_duration_seconds is not 3");
    if (Number(row.parent_full_duration_seconds || 0) !== Number(shot.duration_seconds || 0)) rowProblems.push("parent_full_duration_seconds does not match package shot duration");
    if (row.expected_probe_clip !== expectedProbeClip(row)) rowProblems.push("expected_probe_clip path does not match convention");
    if (!probePrompt) rowProblems.push("missing probe_prompt.md");
    if (!negativePrompt) rowProblems.push("missing negative_prompt.md");
    if (!probeMetadata) rowProblems.push("missing metadata.json");
    if (!lowerIncludes(probePrompt, "duration: 3 seconds")) rowProblems.push("probe prompt missing 3-second duration");
    if (lowerIncludes(probePrompt, "duration: 6 seconds")) rowProblems.push("probe prompt still contains 6-second duration");
    if (!lowerIncludes(probePrompt, "motion probe only")) rowProblems.push("probe prompt missing motion probe only lock");
    if (!lowerIncludes(probePrompt, "full-duration generation is not approved until this probe passes")) rowProblems.push("probe prompt missing full-duration release condition");
    if (!lowerIncludes(probePrompt, "visible readable humans")) rowProblems.push("probe prompt missing visible readable humans section");
    if (!lowerIncludes(probePrompt, "attrition state after this shot") && !lowerIncludes(probePrompt, "battle ledger after this shot")) rowProblems.push("probe prompt missing post-shot attrition state");
    if (negativeSection.trim() !== negativePrompt.trim()) rowProblems.push("probe prompt Negative Prompt section differs from negative_prompt.md");

    for (const phrase of [
      "no extra people",
      "no unnamed students",
      "no readable silhouettes",
      "no subtitles",
      "no captions",
      "no visible text",
      "no paired Hanneman and Manuela",
      "no shared teacher platform",
      "no same-lane teacher duo",
    ]) {
      if (!lowerIncludes(negativePrompt, phrase)) rowProblems.push(`negative prompt missing ${phrase}`);
    }
    for (const field of requiredLedgerFields) {
      if (!row[field] || !probeMetadata[field]) rowProblems.push(`missing ledger field ${field}`);
    }
    if (row.shot === "Shot034B") {
      if (!lowerIncludes(probePrompt, "no Hanneman voice and no Manuela voice")) rowProblems.push("Shot034B probe missing no-teacher-voice lock");
      if (!lowerIncludes(probePrompt, "Byleth, Dimitri")) rowProblems.push("Shot034B probe missing visible roster lock");
      if (lowerIncludes(probePrompt, "Byleth, Dimitri, Hanneman")) rowProblems.push("Shot034B probe still contains old Hanneman visible roster");
      if (lowerIncludes(probePrompt, "single-lane Hanneman ruling")) rowProblems.push("Shot034B probe still contains old Hanneman single-lane ruling");
    }
    if (row.shot === "Shot032") {
      if (!lowerIncludes(probePrompt, "Dimitri, offscreen")) rowProblems.push("Shot032 probe missing offscreen Dimitri audio lock");
      if (!lowerIncludes(probePrompt, "Mercedes")) rowProblems.push("Shot032 probe missing Mercedes healer presence");
      if (!lowerIncludes(probePrompt, "Dedue")) rowProblems.push("Shot032 probe missing Dedue shield presence");
    }

    if (rowProblems.length) problems.push(`${shot.shot}: ${rowProblems.join("; ")}`);
    if (rowWarnings.length) warnings.push(`${shot.shot}: ${rowWarnings.join("; ")}`);
    rows.push({
      order: row.order,
      shot: row.shot,
      custom_id: row.custom_id,
      probe_duration_seconds: row.probe_duration_seconds,
      expected_probe_clip: row.expected_probe_clip,
      files: {
        probe_prompt: rel(probePromptPath),
        negative_prompt: rel(negativePromptPath),
        metadata: rel(metadataPath),
      },
      problems: rowProblems,
      warnings: rowWarnings,
    });
  }

  const decision = problems.length ? "motion_probe_package_blocked" : "motion_probe_package_ready";
  const report = {
    version: 1,
    generated_at: new Date().toISOString(),
    decision,
    package_dir: rel(packageDir),
    probe_dir: rel(probeDir),
    rows_checked: rows.length,
    expected_shots: expectedShots.length,
    problems,
    warnings,
    rows,
  };
  const md = [
    "# Scene09 V3 Motion Probe Package Audit",
    "",
    `Decision: \`${decision}\``,
    `Rows checked: ${rows.length}/${expectedShots.length}`,
    `Problems: ${problems.length}`,
    `Warnings: ${warnings.length}`,
    "",
    "## Blocking Problems",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Row Summary",
    "| Order | Shot | Probe duration | Problems |",
    "| ---: | --- | ---: | ---: |",
    ...rows.map((row) => `| ${row.order} | ${row.shot} | ${row.probe_duration_seconds || 0}s | ${row.problems.length} |`),
    "",
  ].join("\n");
  writeJson(outJson, report);
  writeText(outMd, md);
  writeJson(packageJson, report);
  writeText(packageMd, md);

  console.log(JSON.stringify({
    decision,
    rows_checked: rows.length,
    expected_shots: expectedShots.length,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageJson),
  }, null, 2));
  if (decision !== "motion_probe_package_ready") process.exit(1);
}

main();
