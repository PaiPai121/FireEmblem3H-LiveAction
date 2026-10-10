#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(outDir, "scene09_v3_executable_prompt_semantics_audit_2026-08-01.json");
const outMd = path.join(outDir, "scene09_v3_executable_prompt_semantics_audit_2026-08-01.md");
const packageJson = path.join(packageDir, "executable_prompt_semantics_audit.json");
const packageMd = path.join(packageDir, "executable_prompt_semantics_audit.md");

const knownNames = [
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

const executableSections = ["Motion", "Camera", "Performance", "Audio"];
const forbiddenExecutablePromptPatterns = [
  { label: "absolute local path", regex: /\/Users\//i },
  { label: "file URL", regex: /file:\/\//i },
  { label: "http URL", regex: /https?:\/\//i },
  { label: "episodes path", regex: /\bepisodes\//i },
  { label: "delivery path", regex: /\bdelivery\//i },
  { label: "production_system path", regex: /\bproduction_system\//i },
  { label: "storyboards path", regex: /\bstoryboards\//i },
  { label: "source asset directory", regex: /\bassets\//i },
  { label: "png filename anchor", regex: /\b[\w.-]+\.png\b/i },
  { label: "jpg filename anchor", regex: /\b[\w.-]+\.jpe?g\b/i },
  { label: "previous-shot dependency", regex: /\b(continue from|same as|match the prior|match previous|previous shot|prior shot|last shot)\b/i },
];
const allowedAbsenceTerms = [
  "absent",
  "offscreen",
  "off-screen",
  "silent",
  "another lane",
  "not visually present",
  "not visually",
  "not even as silhouettes",
  "never",
  "no ",
  "without",
  "remain captured",
  "remains captured",
  "remain route-cut",
  "reject if",
  "do not",
  "cannot return",
  "must not return",
];
const nonActiveContextTerms = [
  "stand down",
  "stands down",
  "stood down",
  "post-action",
  "post-battle",
  "combat over",
  "lowers",
  "lowered",
  "lower ",
  "lowering",
  "hands open",
  "concession",
  "concedes",
  "defeated",
  "route block",
  "restrained respect",
  "dignified",
  "already captured",
  "remain captured",
  "remains captured",
  "not return active",
  "no active-combat reset",
  "no renewed attack",
  "no attack",
  "no thrust",
  "no strike",
  "no touch",
];
const activeCombatVerbs = [
  "attack",
  "attacks",
  "attacking",
  "charge",
  "charges",
  "charging",
  "strike",
  "strikes",
  "striking",
  "fire",
  "fires",
  "firing",
  "shoot",
  "shoots",
  "shooting",
  "lunge",
  "lunges",
  "lunging",
  "swing",
  "swings",
  "swinging",
  "slash",
  "slashes",
  "slashing",
  "rush",
  "rushes",
  "rushing",
  "pursue",
  "pursues",
  "pursuit",
  "duel",
  "duels",
  "clash",
  "clashes",
  "draws an arrow",
  "pulls a bowstring",
  "weapon-forward attack pose",
  "body-aimed thrust",
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

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}

function unique(values) {
  return values.filter((value, index, all) => value && all.indexOf(value) === index);
}

function section(text, heading) {
  const lines = String(text || "").split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${heading}:`);
  if (start < 0) return "";
  const body = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^[A-Za-z][A-Za-z /-]*:\s*$/.test(lines[index].trim())) break;
    body.push(lines[index]);
  }
  return body.join("\n").trim();
}

function sentences(text) {
  return String(text || "")
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+|;\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function lowerIncludes(text, phrase) {
  return String(text || "").toLowerCase().includes(String(phrase || "").toLowerCase());
}

function containsAllowedAbsenceTerm(sentence) {
  const lower = sentence.toLowerCase();
  return allowedAbsenceTerms.some((term) => lower.includes(term));
}

function containsNonActiveContext(sentence) {
  const lower = sentence.toLowerCase();
  return nonActiveContextTerms.some((term) => lower.includes(term));
}

function containsActiveCombatVerb(sentence) {
  const lower = sentence.toLowerCase();
  return activeCombatVerbs.some((term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(lower));
}

function battleLedger(shot, metadata) {
  return metadata.battle_state_after?.battle_ledger_after
    || metadata.battle_ledger_after
    || shot.battle_state_after?.battle_ledger_after
    || shot.battle_ledger_after
    || {};
}

function noActiveNames(shot, metadata) {
  const ledger = battleLedger(shot, metadata);
  return unique([
    ...(Array.isArray(shot.battle_state_after?.inactive_or_removed_after) ? shot.battle_state_after.inactive_or_removed_after : []),
    ...(Array.isArray(shot.battle_state_after?.no_active_combat_after) ? shot.battle_state_after.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
  ]);
}

function capturedNames(shot, metadata) {
  return unique(flattenGroups(battleLedger(shot, metadata).captured_or_objective_defeated_by_house));
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const rows = [];
  const problems = [];
  const warnings = [];

  for (const shot of manifest.shots || []) {
    const shotDir = path.join(packageDir, shot.package_dir);
    const metadataPath = path.join(shotDir, "metadata.json");
    const modelPromptPath = path.join(shotDir, "model_prompt.md");
    const negativePromptPath = path.join(shotDir, "negative_prompt.md");
    const metadata = fs.existsSync(metadataPath) ? readJson(metadataPath) : {};
    const modelPrompt = readText(modelPromptPath);
    const negativePrompt = readText(negativePromptPath);
    const visible = asArray(shot.visible_named_only);
    const visibleSet = new Set(visible);
    const noActive = noActiveNames(shot, metadata);
    const captured = capturedNames(shot, metadata);
    const rowProblems = [];
    const rowWarnings = [];

    const negativeSection = section(modelPrompt, "Negative Prompt");
    if (negativeSection.trim() !== negativePrompt.trim()) {
      rowProblems.push("model_prompt Negative Prompt section differs from negative_prompt.md");
    }

    for (const pattern of forbiddenExecutablePromptPatterns) {
      if (pattern.regex.test(modelPrompt)) {
        rowProblems.push(`model_prompt contains forbidden executable ${pattern.label}; web submissions may only reference uploaded START/KEY/END frames`);
      }
    }

    const inputFrames = section(modelPrompt, "Input Frames");
    for (const requiredPhrase of ["uploaded START frame", "uploaded KEY frame", "uploaded END frame"]) {
      if (!lowerIncludes(inputFrames, requiredPhrase)) {
        rowProblems.push(`Input Frames section missing web-upload contract phrase: ${requiredPhrase}`);
      }
    }

    for (const name of visible) {
      for (const phrase of [`no readable ${name}`, `no readable return of ${name}`]) {
        if (lowerIncludes(negativePrompt, phrase)) {
          rowProblems.push(`negative prompt forbids a visible named character: ${phrase}`);
        }
      }
    }

    for (const phrase of [
      "no paired Hanneman and Manuela",
      "no shared teacher platform",
      "no same-lane teacher duo",
    ]) {
      if (!lowerIncludes(negativePrompt, phrase)) rowProblems.push(`negative prompt missing teacher separation token: ${phrase}`);
    }
    if (!visibleSet.has("Hanneman") && !lowerIncludes(negativePrompt, "no readable Hanneman")) {
      rowProblems.push("negative prompt must ban readable Hanneman when Hanneman is not visible_named_only");
    }
    if (!visibleSet.has("Manuela") && !lowerIncludes(negativePrompt, "no readable Manuela")) {
      rowProblems.push("negative prompt must ban readable Manuela when Manuela is not visible_named_only");
    }

    for (const name of noActive) {
      if (visibleSet.has(name)) {
        for (const phrase of [`no renewed attack by ${name}`, `no active-combat reset for ${name}`]) {
          if (!lowerIncludes(negativePrompt, phrase)) rowProblems.push(`negative prompt missing visible no-active token: ${phrase}`);
        }
      } else {
        for (const phrase of [`no readable return of ${name}`, `no active return of ${name}`]) {
          if (!lowerIncludes(negativePrompt, phrase)) rowProblems.push(`negative prompt missing hidden no-return token: ${phrase}`);
        }
      }
    }

    for (const name of captured) {
      if (!visibleSet.has(name) && !lowerIncludes(negativePrompt, `no uncaptured return of ${name}`)) {
        rowProblems.push(`negative prompt missing captured no-return token: no uncaptured return of ${name}`);
      }
    }

    for (const sectionName of executableSections) {
      for (const sentence of sentences(section(modelPrompt, sectionName))) {
        for (const name of knownNames) {
          if (visibleSet.has(name)) continue;
          if (!sentence.includes(name)) continue;
          if (containsAllowedAbsenceTerm(sentence)) continue;
          rowProblems.push(`${sectionName} mentions non-visible ${name} without absence/no-return language: ${sentence}`);
        }
        for (const name of noActive) {
          if (!visibleSet.has(name)) continue;
          if (!sentence.includes(name)) continue;
          if (!containsActiveCombatVerb(sentence)) continue;
          if (containsNonActiveContext(sentence)) continue;
          rowProblems.push(`${sectionName} gives visible no-active character ${name} active combat language: ${sentence}`);
        }
      }
    }

    rows.push({
      order: shot.order,
      shot: shot.shot,
      visible_named_only: visible,
      no_active_names: noActive,
      captured_names: captured,
      visible_no_active_names: noActive.filter((name) => visibleSet.has(name)),
      executable_sections_checked: executableSections,
      web_upload_contract_checked: true,
      negative_prompt_visible_conflicts: rowProblems.filter((problem) => problem.startsWith("negative prompt forbids a visible named character")),
      visible_no_active_action_conflicts: rowProblems.filter((problem) => problem.includes("visible no-active character")),
      problems: rowProblems,
      warnings: rowWarnings,
    });
    problems.push(...rowProblems.map((problem) => `${shot.shot}: ${problem}`));
    warnings.push(...rowWarnings.map((warning) => `${shot.shot}: ${warning}`));
  }

  const report = {
    date,
    decision: problems.length ? "executable_prompt_semantics_failed" : "executable_prompt_semantics_passed",
    package_manifest: rel(manifestPath),
    shots_checked: rows.length,
    problems,
    warnings,
    rows,
    evidence: {
      negative_prompts_match_model_prompts: "Each model_prompt.md Negative Prompt section must equal the package negative_prompt.md file.",
      web_upload_contract: "Each model_prompt.md Input Frames section must reference uploaded START/KEY/END frames and must not contain local paths, URLs, image filenames, or previous-shot dependencies.",
      per_shot_no_return_tokens: "Ledger-derived must-not-return names are converted into negative prompt tokens.",
      executable_name_scope: "Motion, Camera, Performance, and Audio cannot use non-visible names unless the sentence is an absence/offscreen/no-return lock.",
      visible_no_active_semantics: "Visible names that are already must-not-return-active may appear only with stand-down/post-battle/non-active context and cannot be forbidden as readable in the negative prompt.",
    },
  };

  const md = [
    "# Scene09 V3 Executable Prompt Semantics Audit",
    "",
    `Date: ${date}`,
    `Decision: ${report.decision}`,
    `Shots checked: ${rows.length}`,
    "",
    "## Scope",
    "",
    "- Negative prompts must carry teacher-separation tokens for every shot.",
    "- `model_prompt.md` must be a web-upload executable prompt: uploaded START/KEY/END only, no local paths, URLs, image filenames, or previous-shot dependencies.",
    "- Ledger must-not-return names must become concrete negative tokens.",
    "- Non-visible names may appear in executable sections only as absence, offscreen, captured, or no-return locks.",
    "- Visible must-not-return names cannot be contradicted by `no readable` negative tokens or active-combat language.",
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Warnings",
    "",
    warnings.length ? warnings.map((warning) => `- ${warning}`).join("\n") : "- none",
    "",
  ].join("\n");

  writeJson(outJson, report);
  writeText(outMd, `${md}\n`);
  writeJson(packageJson, {
    ...report,
    rows: rows.map((row) => ({
      order: row.order,
      shot: row.shot,
      visible_named_only: row.visible_named_only,
      no_active_names: row.no_active_names,
      captured_names: row.captured_names,
      visible_no_active_names: row.visible_no_active_names,
      executable_sections_checked: row.executable_sections_checked,
      negative_prompt_visible_conflicts: row.negative_prompt_visible_conflicts,
      visible_no_active_action_conflicts: row.visible_no_active_action_conflicts,
      web_upload_contract_checked: row.web_upload_contract_checked,
      problems: row.problems.length,
      warnings: row.warnings.length,
    })),
    production_report_json: rel(outJson),
    production_report_md: rel(outMd),
  });
  writeText(packageMd, `${md}\n`);

  console.log(JSON.stringify({
    date,
    decision: report.decision,
    shots_checked: report.shots_checked,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report: rel(packageMd),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
