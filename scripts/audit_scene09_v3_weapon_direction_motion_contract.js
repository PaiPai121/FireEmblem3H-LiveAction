#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const shotsDir = path.join(packageDir, "shots");
const outJson = path.join(packageDir, "weapon_direction_motion_contract_audit.json");
const outMd = path.join(packageDir, "weapon_direction_motion_contract_audit.md");
const productionJson = path.join(
  root,
  "production_system/scene09_v3_attrition_package/scene09_v3_weapon_direction_motion_contract_audit_2026-08-15.json",
);

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

function section(text, name) {
  const match = text.match(new RegExp(`${name}:\\n([\\s\\S]*?)(?:\\n\\n[A-Z][A-Za-z ]+:|$)`));
  return match ? match[1].trim() : "";
}

function shotIdFrom(text, fallback) {
  const match = text.match(/^#\s+(Shot\w+)/m);
  return match ? match[1] : fallback;
}

function main() {
  const problems = [];
  const rows = [];
  const dirs = fs.readdirSync(shotsDir)
    .filter((name) => name.includes("EP02-SC09-SHOT"))
    .sort();

  for (const dir of dirs) {
    const promptPath = path.join(shotsDir, dir, "model_prompt.md");
    const text = readText(promptPath);
    const shot = shotIdFrom(text, dir);
    const motion = section(text, "Motion");
    const promptProblems = [];

    const checks = [
      ["visible named-only contract", /Only these readable humans may appear:/],
      ["legacy allowed-readable contract", /Allowed readable humans:/],
      ["legacy visible-list contract", /Visible named-only list:/],
      ["weapon continuity/reject language", /weapon changes|weapon drift|wrong weapons|training weapons/i],
      ["face and academy-age continuity", /face.*age|academy age|mannequin face|face drift/i],
      ["screen-direction/camera-facing control", /screen direction|screen-direction|camera-facing|faces the camera/i],
      ["extra-person exclusion", /no extra people|anonymous student|spectator|crowd|readable silhouette/i],
      ["attrition ledger", /Attrition State After This Shot:/],
      ["uploaded frame chain", /uploaded START frame[\s\S]*uploaded KEY frame[\s\S]*uploaded END frame/],
      ["nonlethal mock battle tone", /Nonlethal mock battle|no blood|no gore|lethal/i],
    ];

    for (const [label, regex] of checks) {
      if (!regex.test(text)) promptProblems.push(`missing ${label}`);
    }

    if (motion.length < 80) {
      promptProblems.push("motion section too thin");
    }
    if (
      /\bstands?\b/i.test(motion)
      && !/press|pivot|strike|cut|repel|capture|heal|lower|reach|advance|brace|withdraw|cross|block|collapse|mark|release|turn|settle|step|circle|pin|escort/i.test(motion)
    ) {
      promptProblems.push("motion may read as pure standing");
    }

    rows.push({
      shot,
      prompt: path.relative(root, promptPath),
      motion_chars: motion.length,
      problems: promptProblems,
    });
    problems.push(...promptProblems.map((problem) => `${shot}: ${problem}`));
  }

  const report = {
    date: "2026-08-15",
    decision: problems.length ? "weapon_direction_motion_contract_failed" : "weapon_direction_motion_contract_passed",
    shots_checked: dirs.length,
    problems,
    rows,
  };
  const md = [
    "# Scene09 Weapon, Direction, And Motion Contract Audit",
    "",
    `Date: ${report.date}`,
    `Decision: ${report.decision}`,
    `Shots checked: ${report.shots_checked}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");

  writeJson(outJson, report);
  writeText(outMd, `${md}\n`);
  writeJson(productionJson, report);
  console.log(JSON.stringify({
    decision: report.decision,
    shots_checked: report.shots_checked,
    problems: problems.length,
    report_json: path.relative(root, productionJson),
    package_report_json: path.relative(root, outJson),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
