#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const outJson = path.join(packageDir, "anchor_motion_strength_audit.json");
const outMd = path.join(packageDir, "anchor_motion_strength_audit.md");
const productionJson = path.join(
  root,
  "production_system/scene09_v3_attrition_package/scene09_v3_anchor_motion_strength_audit_2026-08-15.json",
);

const intentionallyQuietShots = new Set([
  "Shot025A",
  "Shot032D",
  "Shot032E",
  "Shot034",
  "Shot034B",
  "Shot034G",
]);

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

function imageRms(a, b) {
  const script = [
    "from PIL import Image, ImageChops, ImageStat",
    "import math, sys",
    "a=Image.open(sys.argv[1]).convert('RGB').resize((256,144))",
    "b=Image.open(sys.argv[2]).convert('RGB').resize((256,144))",
    "s=ImageStat.Stat(ImageChops.difference(a,b))",
    "print(math.sqrt(sum(v*v for v in s.rms)/len(s.rms)))",
  ].join(";");
  const result = spawnSync("python3", ["-c", script, a, b], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || `python failed for ${a} ${b}`);
  return Number(result.stdout.trim());
}

function hasMicroMotionContract(prompt) {
  return /not a static lineup|no freeze|not a static tableau|subtle but visible|visible micro-action|not a still frame/i.test(prompt);
}

function main() {
  const manifest = readJson(manifestPath);
  const rows = [];
  const problems = [];
  const warnings = [];

  for (const shot of [...manifest.shots].sort((a, b) => a.order - b.order)) {
    const dir = path.join(packageDir, shot.package_dir);
    const start = path.join(dir, "start_frame.png");
    const key = path.join(dir, "key_frame.png");
    const end = path.join(dir, "end_frame.png");
    const prompt = readText(path.join(dir, "model_prompt.md"));
    const sk = imageRms(start, key);
    const ke = imageRms(key, end);
    const se = imageRms(start, end);
    const minPair = Math.min(sk, ke, se);
    const quietAllowed = intentionallyQuietShots.has(shot.shot);
    const microMotionContract = hasMicroMotionContract(prompt);
    const rowProblems = [];
    const rowWarnings = [];

    if (minPair < 10 && !quietAllowed && !microMotionContract) {
      rowProblems.push(`anchor pair too similar for action shot: min RMS ${minPair.toFixed(2)}`);
    }
    if (minPair < 10 && quietAllowed && !microMotionContract) {
      rowWarnings.push(`quiet shot needs explicit micro-motion contract: min RMS ${minPair.toFixed(2)}`);
    }
    if (sk < 3 || ke < 3 || se < 3) {
      rowProblems.push(`near-duplicate anchor pair: start-key ${sk.toFixed(2)}, key-end ${ke.toFixed(2)}, start-end ${se.toFixed(2)}`);
    }

    rows.push({
      order: shot.order,
      shot: shot.shot,
      title: shot.titleZh || shot.title || "",
      status: shot.status || "",
      rms_start_key: Number(sk.toFixed(2)),
      rms_key_end: Number(ke.toFixed(2)),
      rms_start_end: Number(se.toFixed(2)),
      min_pair_rms: Number(minPair.toFixed(2)),
      intentionally_quiet: quietAllowed,
      micro_motion_contract: microMotionContract,
      problems: rowProblems,
      warnings: rowWarnings,
    });
    problems.push(...rowProblems.map((problem) => `${shot.shot}: ${problem}`));
    warnings.push(...rowWarnings.map((warning) => `${shot.shot}: ${warning}`));
  }

  const report = {
    date: "2026-08-15",
    decision: problems.length ? "anchor_motion_strength_failed" : "anchor_motion_strength_passed",
    shots_checked: rows.length,
    low_variation_rows: rows.filter((row) => row.min_pair_rms < 10).length,
    problems,
    warnings,
    rows,
  };

  const md = [
    "# Scene09 Anchor Motion Strength Audit",
    "",
    `Date: ${report.date}`,
    `Decision: ${report.decision}`,
    `Shots checked: ${report.shots_checked}`,
    `Low variation rows: ${report.low_variation_rows}`,
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
  writeJson(productionJson, report);
  console.log(JSON.stringify({
    decision: report.decision,
    shots_checked: report.shots_checked,
    low_variation_rows: report.low_variation_rows,
    problems: problems.length,
    warnings: warnings.length,
    report_json: path.relative(root, productionJson),
    package_report_json: path.relative(root, outJson),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
