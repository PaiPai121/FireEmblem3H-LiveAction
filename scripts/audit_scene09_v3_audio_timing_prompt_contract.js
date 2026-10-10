#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(reportDir, `scene09_v3_audio_timing_prompt_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_audio_timing_prompt_contract_${date}.md`);
const packageJson = path.join(packageDir, "audio_timing_prompt_contract.json");
const packageMd = path.join(packageDir, "audio_timing_prompt_contract.md");

const knownSpeakers = [
  "Byleth",
  "Dimitri",
  "Dedue",
  "Felix",
  "Ashe",
  "Annette",
  "Mercedes",
  "Sylvain",
  "Ingrid",
  "Edelgard",
  "Hubert",
  "Ferdinand",
  "Dorothea",
  "Bernadetta",
  "Claude",
  "Hilda",
  "Lorenz",
  "Ignatz",
  "Leonie",
  "Hanneman",
  "Manuela",
];

const vagueDialogueTerms = [
  "optional",
  "exchange",
  "gives",
  "explains",
  "answers",
  "asks",
  "cue",
  "route-call",
  "rule confirmation",
  "adjudication",
  "concession line",
  "line optional",
  "response",
];

const vocalActionTerms = [
  "speak",
  "speaks",
  "voice",
  "voices",
  "calls",
  "call",
  "line",
  "dialogue",
  "says",
  "asks",
  "answers",
  "warns",
  "command",
  "confirmation",
  "concession",
  "exchange",
];

const soundOnlySafeTerms = [
  "ambience",
  "armor",
  "battle bed",
  "breath",
  "breaths",
  "boots",
  "clack",
  "cloth",
  "field",
  "footstep",
  "footsteps",
  "gear",
  "horn",
  "impact",
  "no key dialogue",
  "shield",
  "sound",
  "step",
  "steps",
  "tail",
  "wind",
  "wood",
  "wooden",
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
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

function section(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(text || "").match(new RegExp(`^${escaped}:\\n([\\s\\S]*?)(?=\\n[A-Za-z][A-Za-z /-]*:\\n|\\n?$)`, "m"));
  return match ? match[1].trim() : "";
}

function promptDurationSeconds(text) {
  const match = String(text || "").match(/^Duration:\s*(?:\n\s*)?(\d+(?:\.\d+)?)\s*seconds\./m);
  return match ? Number(match[1]) : null;
}

function lowerIncludes(text, phrase) {
  return String(text || "").toLowerCase().includes(String(phrase || "").toLowerCase());
}

function finalDialogueLines(audio) {
  const lines = [];
  const speakerPattern = knownSpeakers
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const pattern = new RegExp(`\\b(${speakerPattern})(?:,\\s*[^:"/]+)?\\s*:\\s*"([^"]+)"`, "g");
  let match;
  while ((match = pattern.exec(audio))) {
    lines.push({ speaker: match[1], line: match[2] });
  }
  return lines;
}

function quotedSegments(audio) {
  return [...String(audio || "").matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

function vagueTerms(audio) {
  const lower = String(audio || "").toLowerCase();
  return vagueDialogueTerms.filter((term) => lower.includes(term));
}

function speakerMentions(audio) {
  const withoutQuotedLines = String(audio || "").replace(/"[^"]*"/g, "");
  return knownSpeakers.filter((name) => new RegExp(`\\b${name}\\b`).test(withoutQuotedLines));
}

function impliesDialogue(audio) {
  const lower = String(audio || "").toLowerCase();
  if (lower.includes("no key dialogue") || lower.includes("do not speak") || lower.includes("does not speak")) return false;
  if (vocalActionTerms.some((term) => lower.includes(term))) return true;
  return finalDialogueLines(audio).length > 0;
}

function isSoundOnly(audio) {
  const lower = String(audio || "").toLowerCase();
  if (impliesDialogue(audio)) return false;
  return soundOnlySafeTerms.some((term) => lower.includes(term));
}

function untaggedQuotedLines(audio, taggedLines) {
  const tagged = new Set(taggedLines.map((line) => line.line));
  return quotedSegments(audio).filter((line) => !tagged.has(line));
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const rows = [];
  const problems = [];
  const warnings = [];

  for (const shot of manifest.shots || []) {
    const shotDir = path.join(packageDir, shot.package_dir);
    const modelPromptPath = path.join(shotDir, "model_prompt.md");
    const promptPath = path.join(shotDir, "prompt.md");
    const metadataPath = path.join(shotDir, "metadata.json");
    const negativePromptPath = path.join(shotDir, "negative_prompt.md");
    const modelPrompt = readText(modelPromptPath);
    const auditPrompt = readText(promptPath);
    const negativePrompt = readText(negativePromptPath);
    const metadata = fs.existsSync(metadataPath) ? readJson(metadataPath) : {};
    const audio = section(modelPrompt, "Audio");
    const negativeSection = section(modelPrompt, "Negative Prompt");
    const duration = Number(shot.duration_seconds || metadata.duration_seconds || 0);
    const promptDuration = promptDurationSeconds(modelPrompt);
    const lines = finalDialogueLines(audio);
    const terms = vagueTerms(audio);
    const mentions = speakerMentions(audio);
    const rowProblems = [];
    const rowWarnings = [];

    if (!modelPrompt) rowProblems.push("missing model_prompt.md");
    if (!auditPrompt) rowProblems.push("missing prompt.md");
    if (!metadataPath || !fs.existsSync(metadataPath)) rowProblems.push("missing metadata.json");
    if (!audio) rowProblems.push("model prompt missing Audio section");
    if (promptDuration !== duration) rowProblems.push(`prompt duration ${promptDuration ?? "missing"} does not match manifest duration ${duration}`);
    if (!lowerIncludes(modelPrompt, "hold the final state for the last 0.5 seconds")) rowProblems.push("missing explicit 0.5 second tail-hold instruction");

    for (const phrase of ["no subtitles", "no captions", "no visible text"]) {
      if (!lowerIncludes(negativePrompt, phrase)) rowProblems.push(`negative_prompt.md missing ${phrase}`);
      if (!lowerIncludes(negativeSection, phrase)) rowProblems.push(`model prompt Negative Prompt section missing ${phrase}`);
    }

    if (negativeSection.trim() !== negativePrompt.trim()) {
      rowProblems.push("model prompt Negative Prompt section differs from negative_prompt.md");
    }

    if (metadata.audio_anchor && metadata.audio_anchor !== audio) {
      rowProblems.push("metadata audio_anchor differs from model prompt Audio section");
    }
    if (metadata.dialogue_audio && metadata.dialogue_audio !== audio) {
      rowProblems.push("metadata dialogue_audio differs from model prompt Audio section");
    }

    if (impliesDialogue(audio)) {
      if (terms.length) rowProblems.push(`audio uses non-final dialogue placeholder language: ${terms.join(", ")}`);
      if (!lines.length) rowProblems.push("audio implies spoken dialogue but has no speaker-tagged final line");
      const untagged = untaggedQuotedLines(audio, lines);
      if (untagged.length) rowProblems.push(`audio contains quoted line without a speaker tag: ${untagged.join(" / ")}`);
    } else if (!isSoundOnly(audio)) {
      rowWarnings.push("audio is not dialogue, but also lacks clear sound-design language");
    }

    if (rowProblems.length) {
      problems.push(`${shot.shot}: ${rowProblems.join("; ")}`);
    }
    if (rowWarnings.length) {
      warnings.push(`${shot.shot}: ${rowWarnings.join("; ")}`);
    }

    rows.push({
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      duration_seconds: duration,
      prompt_duration_seconds: promptDuration,
      audio,
      final_dialogue_lines: lines,
      speaker_mentions: mentions,
      vague_audio_terms: terms,
      sound_design_only: isSoundOnly(audio),
      dialogue_finality: rowProblems.length ? "blocked_needs_final_audio" : "final_or_sound_design_clear",
      files: {
        model_prompt: rel(modelPromptPath),
        prompt: rel(promptPath),
        negative_prompt: rel(negativePromptPath),
        metadata: rel(metadataPath),
      },
      problems: rowProblems,
      warnings: rowWarnings,
    });
  }

  const decision = problems.length
    ? "audio_timing_prompt_contract_blocked"
    : "audio_timing_prompt_contract_passed";
  const report = {
    version: 1,
    generated_at: new Date().toISOString(),
    package_dir: rel(packageDir),
    manifest: rel(manifestPath),
    decision,
    shots_checked: rows.length,
    problems,
    warnings,
    rows,
  };

  const md = [
    "# Scene09 V3 Audio Timing Prompt Contract",
    "",
    `Decision: \`${decision}\``,
    `Shots checked: ${rows.length}`,
    `Problems: ${problems.length}`,
    `Warnings: ${warnings.length}`,
    "",
    "## Blocking Problems",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Warnings",
    warnings.length ? warnings.map((warning) => `- ${warning}`).join("\n") : "- none",
    "",
    "## Row Summary",
    "| Order | Shot | Dialogue finality | Final lines | Problems |",
    "| ---: | --- | --- | ---: | ---: |",
    ...rows.map((row) => `| ${row.order} | ${row.shot} | ${row.dialogue_finality} | ${row.final_dialogue_lines.length} | ${row.problems.length} |`),
    "",
  ].join("\n");

  writeJson(outJson, report);
  writeText(outMd, md);
  writeJson(packageJson, report);
  writeText(packageMd, md);

  console.log(`${decision}: ${rows.length} shots, ${problems.length} problems, ${warnings.length} warnings`);
  if (decision !== "audio_timing_prompt_contract_passed") process.exit(1);
}

main();
