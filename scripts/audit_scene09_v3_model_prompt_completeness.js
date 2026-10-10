#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const outJson = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_model_prompt_completeness_audit_2026-07-30.json");
const outMd = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_model_prompt_completeness_audit_2026-07-30.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function rel(file) {
  return path.relative(root, file);
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function sectionByHeadings(text, heading, headings) {
  const lines = String(text || "").split("\n");
  const start = lines.findIndex((line) => line.trim() === `${heading}:`);
  if (start < 0) return "";
  let end = lines.length;
  const headingSet = new Set(headings.map((name) => `${name}:`));
  for (let i = start + 1; i < lines.length; i += 1) {
    if (headingSet.has(lines[i].trim())) {
      end = i;
      break;
    }
  }
  return cleanText(lines.slice(start + 1, end).join("\n"));
}

function section(text, heading) {
  return sectionByHeadings(text, heading, [
    "Status",
    "Shot ID",
    "Duration",
    "Input Frames",
    "Motion",
    "Camera",
    "Performance",
    "Audio",
    "Continuity Locks",
    "Battle Ledger After This Shot",
    "Reject If",
    "Negative Prompt",
  ]);
}

function modelSection(text, heading) {
  return sectionByHeadings(text, heading, [
    "Shot ID",
    "Duration",
    "Input Frames",
    "Visible readable humans",
    "Motion",
    "Camera",
    "Performance",
    "Audio",
    "Continuity Locks",
    "Reject If",
    "Negative Prompt",
  ]);
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const problems = [];
  const warnings = [];
  const rows = [];
  const requiredSections = ["Motion", "Camera", "Performance", "Audio"];

  for (const shot of manifest.shots || []) {
    const shotDir = path.join(packageDir, shot.package_dir);
    const metadataPath = path.join(shotDir, "metadata.json");
    const modelPromptPath = path.join(shotDir, "model_prompt.md");
    const negativePromptPath = path.join(shotDir, "negative_prompt.md");
    const rowProblems = [];

    if (!fs.existsSync(metadataPath)) rowProblems.push("missing metadata.json");
    if (!fs.existsSync(modelPromptPath)) rowProblems.push("missing model_prompt.md");
    if (!fs.existsSync(negativePromptPath)) rowProblems.push("missing negative_prompt.md");
    const metadata = fs.existsSync(metadataPath) ? readJson(metadataPath) : {};
    const modelPrompt = fs.existsSync(modelPromptPath) ? readText(modelPromptPath) : "";
    const negativePrompt = fs.existsSync(negativePromptPath) ? cleanText(readText(negativePromptPath)) : "";
    const sourcePromptPath = metadata.source_prompt_path ? path.join(root, metadata.source_prompt_path) : null;
    const sourcePrompt = sourcePromptPath && fs.existsSync(sourcePromptPath) ? readText(sourcePromptPath) : "";

    if (!sourcePrompt) rowProblems.push(`missing source prompt: ${metadata.source_prompt_path || "unset"}`);

    for (const heading of requiredSections) {
      const expected = section(sourcePrompt, heading);
      const actual = modelSection(modelPrompt, heading);
      if (!actual) {
        rowProblems.push(`model prompt missing ${heading}`);
      } else if (expected && actual !== expected) {
        rowProblems.push(`${heading} differs from source prompt; possible truncation or drift`);
      }
      if (/\b(No|and|or|with|from|into|on|the|a|an)\.$/i.test(actual)) {
        rowProblems.push(`${heading} ends with suspicious clipped fragment: ${actual.slice(-60)}`);
      }
    }

    const modelNegative = modelSection(modelPrompt, "Negative Prompt");
    if (!modelNegative) rowProblems.push("model prompt missing Negative Prompt section");
    if (negativePrompt && modelNegative !== negativePrompt) rowProblems.push("model prompt negative prompt differs from packaged negative_prompt.md");

    const rejects = shot.reject_if || [];
    const rejectBlock = modelSection(modelPrompt, "Reject If");
    for (const reject of rejects) {
      const normalized = cleanText(reject).replace(/^Reject if /i, "").toLowerCase();
      if (normalized && !rejectBlock.toLowerCase().includes(normalized)) {
        rowProblems.push(`model prompt missing reject line: ${normalized}`);
      }
    }

    const visible = (shot.visible_named_only || []).join(", ") || "none";
    if (!modelPrompt.includes(`Only these readable humans may appear: ${visible}.`)) {
      rowProblems.push("model prompt visible readable humans lock differs from package manifest");
    }
    if (!/No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes\./.test(modelPrompt)) {
      rowProblems.push("model prompt missing no-unnamed-people continuity lock");
    }

    rows.push({
      order: shot.order,
      shot: shot.shot,
      package_dir: shot.package_dir,
      source_prompt: metadata.source_prompt_path || null,
      problems: rowProblems,
    });
    problems.push(...rowProblems.map((problem) => `${shot.shot}: ${problem}`));
  }

  const result = {
    date: "2026-07-30",
    package_manifest: rel(manifestPath),
    shots: rows.length,
    problems,
    warnings,
    rows,
    decision: problems.length ? "model_prompt_completeness_failed" : "model_prompt_completeness_passed",
  };

  writeJson(outJson, result);
  writeText(outMd, [
    "# Scene09 V3 Model Prompt Completeness Audit",
    "",
    `Date: ${result.date}`,
    `Decision: ${result.decision}`,
    `Shots audited: ${rows.length}`,
    "",
    "## Problems",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Rule",
    "- Model-ready prompts must preserve full Motion, Camera, Performance, Audio, Reject If, and Negative Prompt text from their production prompt/package sources.",
    "- This audit rejects clipped half-sentences because they are poor video-model instructions.",
    "",
  ].join("\n"));

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
