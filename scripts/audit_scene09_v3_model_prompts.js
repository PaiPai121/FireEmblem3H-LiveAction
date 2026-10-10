const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const executionPlanPath = path.join(packageDir, "execution_plan.json");
const submissionQueuePath = path.join(packageDir, "submission_queue.csv");
const reportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_model_prompt_audit_2026-07-28.json");
const maxModelPromptChars = 16000;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function rel(file) {
  return path.relative(root, file);
}

function section(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}:`, "m").test(text);
}

function lineValue(text, label) {
  return text.match(new RegExp(`^${label}:\\s*(.+)$`, "m"))?.[1]?.trim() || "";
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing handoff package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const executionPlan = fs.existsSync(executionPlanPath) ? readJson(executionPlanPath) : null;
  const submissionQueue = fs.existsSync(submissionQueuePath) ? readText(submissionQueuePath) : "";
  const problems = [];
  const rows = [];
  const requiredSections = [
    "Visible readable humans",
    "Input Frames",
    "Motion",
    "Camera",
    "Performance",
    "Audio",
    "Continuity Locks",
    "Attrition State After This Shot",
    "Reject If",
    "Negative Prompt",
  ];
  const forbidden = [
    "Battle Ledger After This Shot",
    "Alive roster by house",
    "Still active / controlling objective after this shot",
    "[SOURCE_SLOT]",
    "[LYRIC_SOURCE_SLOT]",
    "TODO",
    "TBD",
    "insert later",
  ];

  if (!submissionQueue.includes("model_prompt")) problems.push("submission_queue.csv missing model_prompt column");

  const planOrders = executionPlan?.work_orders || [];
  for (const order of planOrders) {
    if (!String(order.prompt || "").endsWith("model_prompt.md")) {
      problems.push(`${order.shot}: execution plan prompt does not point to model_prompt.md`);
    }
  }

  for (const shot of manifest.shots || []) {
    const shotDir = path.join(packageDir, shot.package_dir);
    const modelPromptPath = path.join(shotDir, "model_prompt.md");
    if (!fs.existsSync(modelPromptPath)) {
      problems.push(`${shot.shot}: missing model_prompt.md`);
      continue;
    }
    const text = readText(modelPromptPath);
    const visibleLine = lineValue(text, "Visible readable humans");
    const expectedVisible = (shot.visible_named_only || []).join(", ") || "none";
    const missingSections = requiredSections.filter((name) => !section(text, name));
    const forbiddenHits = forbidden.filter((phrase) => text.includes(phrase));
    if (missingSections.length) problems.push(`${shot.shot}: model_prompt missing sections ${missingSections.join(", ")}`);
    if (forbiddenHits.length) problems.push(`${shot.shot}: model_prompt contains forbidden text ${forbiddenHits.join(", ")}`);
    if (text.length > maxModelPromptChars) problems.push(`${shot.shot}: model_prompt exceeds monitored submission safety limit (${text.length}/${maxModelPromptChars} chars)`);
    if (!text.includes(`Only these readable humans may appear: ${expectedVisible}.`)) {
      problems.push(`${shot.shot}: model_prompt visible lock mismatch expected ${expectedVisible}`);
    }
    if (!text.includes("No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.")) {
      problems.push(`${shot.shot}: model_prompt missing no-unnamed-extras lock`);
    }
    if (!text.includes("All named characters remain alive and safe under mock-battle rules.")) {
      problems.push(`${shot.shot}: model_prompt missing mock-battle alive/safe attrition rule`);
    }
    for (const phrase of [
      "Still active or objective-controlling:",
      "Captured/objective-defeated:",
      "Stood down/post-battle:",
      "Must not return active:",
      "Changed this shot:",
    ]) {
      if (!text.includes(phrase)) problems.push(`${shot.shot}: model_prompt attrition state missing ${phrase}`);
    }
    if (!/no text, no subtitles, no captions, no visible text, no watermark/.test(text)) {
      problems.push(`${shot.shot}: model_prompt negative prompt does not ban text/subtitles/captions/visible text/watermark`);
    }
    if (!/no camera spin, no screen-direction reversal/.test(text)) {
      problems.push(`${shot.shot}: model_prompt negative prompt does not ban camera spin/screen-direction reversal`);
    }
    rows.push({
      shot: shot.shot,
      file: rel(modelPromptPath),
      chars: text.length,
      expected_visible: expectedVisible,
      visible_line: visibleLine,
      missing_sections: missingSections,
      forbidden_hits: forbiddenHits,
    });
  }

  const report = {
    date: "2026-07-28",
    package_manifest: rel(manifestPath),
    checked_model_prompts: rows.length,
    max_chars: rows.reduce((max, row) => Math.max(max, row.chars), 0),
    max_model_prompt_chars: maxModelPromptChars,
    problems,
    rows,
    decision: problems.length ? "blocked_needs_revision" : "model_prompts_ready_for_monitored_submission",
  };
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (problems.length) process.exit(1);
}

main();
