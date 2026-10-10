#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const projectRoot = process.cwd();

const SUPPORTED_PLACEHOLDERS = new Set([
  "shot_id",
  "shot",
  "order",
  "duration",
  "prompt",
  "model_prompt",
  "audit_prompt",
  "negative_prompt",
  "start_frame",
  "key_frame",
  "end_frame",
  "output",
]);

const REQUIRED_TEMPLATE_GROUPS = [
  { id: "prompt", label: "model prompt", anyOf: ["prompt", "model_prompt"] },
  { id: "negative_prompt", label: "negative prompt", anyOf: ["negative_prompt"] },
  { id: "start_frame", label: "start frame", anyOf: ["start_frame"] },
  { id: "key_frame", label: "key frame", anyOf: ["key_frame"] },
  { id: "end_frame", label: "end frame", anyOf: ["end_frame"] },
  { id: "duration", label: "duration", anyOf: ["duration"] },
  { id: "output", label: "output mp4 path", anyOf: ["output"] },
];

const USAGE = `
Usage:
  node scripts/run_video_generation_package.js <package-dir> [--dry-run] [--execute] [--concat] [--out <mp4>] [--force]

Environment for --execute:
  VIDEO_MODEL_CLI_ARGV_JSON
    JSON argv array. Use placeholders in any argument:
    {shot_id} {shot} {order} {duration} {prompt} {model_prompt} {audit_prompt} {negative_prompt}
    {start_frame} {key_frame} {end_frame} {output}

Example:
  VIDEO_MODEL_CLI_ARGV_JSON='["video-cli","i2v","--prompt","{prompt}","--negative","{negative_prompt}","--first","{start_frame}","--key","{key_frame}","--last","{end_frame}","--duration","{duration}","--out","{output}"]' \\
    node scripts/run_video_generation_package.js delivery/video_generation_package_x --execute --concat

Dry-run output files:
  execution_plan.json
  execution_commands.sh
  submission_queue.csv
  RUNBOOK.md
`;

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    process.stdout.write(USAGE.trim() + "\n");
    process.exit(args.length === 0 ? 1 : 0);
  }

  const packageDir = path.resolve(args[0]);
  const options = parseOptions(args.slice(1), packageDir);

  const modelArgvTemplate = parseModelArgv(process.env.VIDEO_MODEL_CLI_ARGV_JSON);
  const templateValidation = validateModelArgvTemplate(modelArgvTemplate);
  const runnableModelArgvTemplate = templateValidation.ok ? modelArgvTemplate : null;
  const pkg = loadPackage(packageDir);
  const workOrders = buildWorkOrders(packageDir, pkg, runnableModelArgvTemplate);
  const integrity = validateWorkOrders(workOrders, pkg);
  const plan = buildPlan(packageDir, pkg, workOrders, integrity, options, runnableModelArgvTemplate, templateValidation);

  fs.mkdirSync(path.join(packageDir, "clips"), { recursive: true });
  writeJson(path.join(packageDir, "execution_plan.json"), plan);
  writeText(path.join(packageDir, "execution_commands.sh"), renderCommands(plan, runnableModelArgvTemplate));
  fs.chmodSync(path.join(packageDir, "execution_commands.sh"), 0o755);
  writeText(path.join(packageDir, "submission_queue.csv"), renderSubmissionQueue(workOrders));
  writeText(path.join(packageDir, "RUNBOOK.md"), renderRunbook(pkg, workOrders, Boolean(runnableModelArgvTemplate)));

  if (!integrity.ok) {
    reportPlan(plan);
    process.stderr.write(`Blocked before execution: ${integrity.errors.length} package issue(s).\n`);
    process.exit(2);
  }

  if (modelArgvTemplate && !templateValidation.ok) {
    reportPlan(plan);
    process.stderr.write(`Blocked before execution: ${templateValidation.problems.length} model CLI template issue(s).\n`);
    process.exit(2);
  }

  if (options.execute) {
    if (!runnableModelArgvTemplate) {
      reportPlan(plan);
      process.stderr.write("Blocked: --execute requires VIDEO_MODEL_CLI_ARGV_JSON.\n");
      process.exit(2);
    }
    executeWorkOrders(packageDir, workOrders, runnableModelArgvTemplate, options);
  }

  if (options.concat) {
    guardConcatAllowed(pkg);
    concatClips(packageDir, workOrders, options.outFile);
  }

  reportPlan(plan);
}

function parseOptions(args, packageDir) {
  const options = {
    execute: false,
    concat: false,
    force: false,
    outFile: path.join(packageDir, "final_edit.mp4"),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--dry-run") continue;
    if (arg === "--execute") {
      options.execute = true;
    } else if (arg === "--concat") {
      options.concat = true;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--out") {
      const value = args[i + 1];
      if (!value) throw new Error("--out requires a path");
      options.outFile = path.resolve(value);
      i += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function parseModelArgv(raw) {
  if (!raw) return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`VIDEO_MODEL_CLI_ARGV_JSON is not valid JSON: ${error.message}`);
  }
  if (!Array.isArray(parsed) || parsed.length === 0 || parsed.some((item) => typeof item !== "string")) {
    throw new Error("VIDEO_MODEL_CLI_ARGV_JSON must be a non-empty JSON array of strings");
  }
  return parsed;
}

function validateModelArgvTemplate(argv) {
  if (!argv) {
    return {
      ok: true,
      configured: false,
      decision: "model_cli_template_not_configured",
      problems: [],
      warnings: ["VIDEO_MODEL_CLI_ARGV_JSON is not configured."],
      checks: [],
      placeholders_found: [],
    };
  }

  const found = new Set();
  const problems = [];
  const warnings = [];
  const checks = [];

  for (const arg of argv) {
    for (const match of String(arg).matchAll(/\{([a-z_]+)\}/g)) {
      const key = match[1];
      found.add(key);
      if (!SUPPORTED_PLACEHOLDERS.has(key)) {
        problems.push(`Unsupported placeholder: {${key}}`);
      }
    }
  }

  if (/^\{[a-z_]+\}$/.test(argv[0])) {
    problems.push("The executable argv[0] must be a concrete command, not a placeholder.");
  }

  for (const group of REQUIRED_TEMPLATE_GROUPS) {
    const passed = group.anyOf.some((key) => found.has(key));
    checks.push({
      id: group.id,
      label: group.label,
      required_placeholders: group.anyOf.map((key) => `{${key}}`),
      passed,
    });
    if (!passed) {
      problems.push(`Missing required ${group.label} placeholder: ${group.anyOf.map((key) => `{${key}}`).join(" or ")}`);
    }
  }

  if (!found.has("audit_prompt")) {
    warnings.push("Template does not include {audit_prompt}; this is acceptable only when the model runner does not need the full review contract.");
  }
  if (!found.has("shot_id") && !found.has("shot") && !found.has("order")) {
    warnings.push("Template has no shot identity placeholder; traceability may be weaker.");
  }

  return {
    ok: problems.length === 0,
    configured: true,
    decision: problems.length ? "model_cli_template_blocked" : "model_cli_template_ready",
    problems,
    warnings,
    checks,
    placeholders_found: [...found].sort().map((key) => `{${key}}`),
  };
}

function loadPackage(packageDir) {
  const manifestPath = path.join(packageDir, "package_manifest.json");
  const timelinePath = path.join(packageDir, "timeline.json");
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package_manifest.json: ${manifestPath}`);
  if (!fs.existsSync(timelinePath)) throw new Error(`Missing timeline.json: ${timelinePath}`);

  const manifest = readJson(manifestPath);
  const timeline = readJson(timelinePath);
  if (!Array.isArray(manifest.shots)) throw new Error("package_manifest.json must contain shots[]");
  if (!Array.isArray(timeline.clips)) throw new Error("timeline.json must contain clips[]");
  return { manifest, timeline };
}

function buildWorkOrders(packageDir, pkg, modelArgvTemplate) {
  const timelineByShot = new Map();
  for (const clip of pkg.timeline.clips) {
    if (clip.shot) timelineByShot.set(clip.shot, clip);
    if (clip.id) timelineByShot.set(clip.id, clip);
  }
  return [...pkg.manifest.shots]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((shot) => {
      const shotDir = resolveShotDir(packageDir, shot);
      const timelineClip = timelineByShot.get(shot.id) || timelineByShot.get(shot.shot) || {};
      const expectedClip = shot.expected_clip || timelineClip.expected_clip || `clips/${shot.id}.mp4`;
      const output = resolveExpectedClip(packageDir, expectedClip);
      const promptPath = resolvePackageFile(packageDir, shotDir, shot.model_prompt || shot.prompt || "prompt.md");
      const auditPromptPath = resolvePackageFile(packageDir, shotDir, shot.audit_prompt || "prompt.md");
      const negativePromptPath = resolvePackageFile(packageDir, shotDir, shot.negative_prompt || "negative_prompt.md");
      const placeholders = {
        shot_id: shot.id,
        shot: shot.shot || shot.id,
        order: String(shot.order),
        duration: String(shot.duration_seconds || timelineClip.duration_seconds || ""),
        prompt: promptPath,
        model_prompt: promptPath,
        audit_prompt: auditPromptPath,
        negative_prompt: negativePromptPath,
        start_frame: path.join(shotDir, "start_frame.png"),
        key_frame: path.join(shotDir, "key_frame.png"),
        end_frame: path.join(shotDir, "end_frame.png"),
        output,
      };

      return {
        order: shot.order,
        shot_id: shot.id,
        shot: shot.shot || shot.id,
        status: shot.status,
        duration_seconds: Number(shot.duration_seconds || timelineClip.duration_seconds || 0),
        shot_dir: shotDir,
        prompt: placeholders.prompt,
        model_prompt: placeholders.model_prompt,
        audit_prompt: placeholders.audit_prompt,
        negative_prompt: placeholders.negative_prompt,
        start_frame: placeholders.start_frame,
        key_frame: placeholders.key_frame,
        end_frame: placeholders.end_frame,
        expected_clip: output,
        edit_in: shot.edit_in || timelineClip.edit_in || "",
        edit_out: shot.edit_out || timelineClip.edit_out || "",
        audio_anchor: shot.audio_anchor || "",
        model_notes: shot.model_notes || [],
        reject_if: shot.reject_if || [],
        command_argv: modelArgvTemplate ? replacePlaceholders(modelArgvTemplate, placeholders) : null,
      };
    });
}

function resolvePackageFile(packageDir, shotDir, file) {
  if (!file) return path.join(shotDir, "prompt.md");
  if (path.isAbsolute(file)) return file;
  if (file.includes("/") || file.includes("\\")) return path.resolve(packageDir, file);
  return path.join(shotDir, file);
}

function resolveExpectedClip(packageDir, expectedClip) {
  if (path.isAbsolute(expectedClip)) return expectedClip;
  if (/^(episodes|assets|production_system|delivery)\//.test(expectedClip)) return path.resolve(projectRoot, expectedClip);
  return path.resolve(packageDir, expectedClip);
}

function resolveShotDir(packageDir, shot) {
  if (shot.package_dir) {
    return path.resolve(packageDir, shot.package_dir);
  }
  const shotsDir = path.join(packageDir, "shots");
  const prefix = String(shot.order).padStart(3, "0");
  const candidates = fs.existsSync(shotsDir)
    ? fs.readdirSync(shotsDir).filter((name) => name === `${prefix}_${shot.id}` || name.endsWith(`_${shot.id}`))
    : [];
  if (candidates.length > 0) return path.join(shotsDir, candidates[0]);
  return path.join(shotsDir, `${prefix}_${shot.id}`);
}

function validateWorkOrders(workOrders, pkg) {
  const errors = [];
  const warnings = [];
  const outputs = new Set();
  const isMonitorHandoff = pkg.manifest.package_type === "monitor_handoff" || pkg.manifest.status === "clips_pending";
  const allowedStatuses = isMonitorHandoff
    ? new Set(["monitor_required", "approved_for_video", "approved_for_delivery"])
    : new Set(["approved_for_video", "approved_for_delivery"]);

  for (const order of workOrders) {
    if (!allowedStatuses.has(order.status)) {
      errors.push(`${order.shot_id}: status is ${order.status}, expected ${Array.from(allowedStatuses).join(" or ")}`);
    } else if (isMonitorHandoff && order.status === "monitor_required") {
      warnings.push(`${order.shot_id}: monitor_required; submit only for monitored generation and run clip-level motion QA before promotion`);
    }
    for (const field of ["prompt", "negative_prompt", "start_frame", "key_frame", "end_frame"]) {
      if (!fs.existsSync(order[field])) errors.push(`${order.shot_id}: missing ${field} at ${order[field]}`);
    }
    if (path.basename(order.prompt) === "prompt.md" && fs.existsSync(path.join(order.shot_dir, "model_prompt.md"))) {
      errors.push(`${order.shot_id}: runner selected audit prompt.md even though model_prompt.md exists`);
    }
    if (!order.duration_seconds) warnings.push(`${order.shot_id}: duration_seconds is missing or zero`);
    if (outputs.has(order.expected_clip)) errors.push(`${order.shot_id}: duplicate expected clip ${order.expected_clip}`);
    outputs.add(order.expected_clip);
  }

  return { ok: errors.length === 0, errors, warnings };
}

function buildPlan(packageDir, pkg, workOrders, integrity, options, modelArgvTemplate, templateValidation) {
  const clipStatus = workOrders.map((order) => ({
    shot_id: order.shot_id,
    expected_clip: order.expected_clip,
    exists: fs.existsSync(order.expected_clip),
  }));
  const missingClips = clipStatus.filter((item) => !item.exists);

  return {
    package_dir: packageDir,
    project: pkg.manifest.project,
    package_id: pkg.manifest.package_id,
    total_shots: workOrders.length,
    total_duration_seconds: pkg.manifest.total_duration_seconds || pkg.timeline.total_duration_seconds,
    mode: options.execute ? "execute" : "dry_run",
    concat_requested: options.concat,
    final_output: options.outFile,
    model_cli_configured: Boolean(modelArgvTemplate),
    model_cli_template_validation: templateValidation,
    integrity,
    clip_status: {
      missing_count: missingClips.length,
      ready_for_concat: missingClips.length === 0,
      clips: clipStatus,
    },
    work_orders: workOrders.map((order) => ({
      order: order.order,
      shot_id: order.shot_id,
      shot: order.shot,
      duration_seconds: order.duration_seconds,
      shot_dir: order.shot_dir,
      prompt: order.prompt,
      model_prompt: order.model_prompt,
      audit_prompt: order.audit_prompt,
      negative_prompt: order.negative_prompt,
      start_frame: order.start_frame,
      key_frame: order.key_frame,
      end_frame: order.end_frame,
      expected_clip: order.expected_clip,
      command_argv: order.command_argv,
    })),
  };
}

function fileDigest(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function writeClipProvenance(packageDir, entries) {
  if (!entries.length) return;
  const file = path.join(packageDir, "generated_clip_provenance.json");
  const existing = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : { version: 1, rows: [] };
  const rowsByClip = new Map((existing.rows || []).map((row) => [row.expected_clip, row]));
  for (const entry of entries) rowsByClip.set(entry.expected_clip, entry);
  writeJson(file, {
    version: 1,
    updated_at: new Date().toISOString(),
    rows: [...rowsByClip.values()].sort((a, b) => Number(a.order) - Number(b.order)),
  });
}

function executeWorkOrders(packageDir, workOrders, modelArgvTemplate, options) {
  const provenanceEntries = [];
  for (const order of workOrders) {
    if (fs.existsSync(order.expected_clip) && !options.force) {
      process.stdout.write(`Skip existing clip: ${order.expected_clip}\n`);
      continue;
    }

    fs.mkdirSync(path.dirname(order.expected_clip), { recursive: true });
    const argv = order.command_argv || replacePlaceholders(modelArgvTemplate, {
      shot_id: order.shot_id,
      order: String(order.order),
      duration: String(order.duration_seconds),
      prompt: order.prompt,
      negative_prompt: order.negative_prompt,
      start_frame: order.start_frame,
      key_frame: order.key_frame,
      end_frame: order.end_frame,
      output: order.expected_clip,
    });
    process.stdout.write(`Generate ${order.shot_id}: ${shellQuote(argv).join(" ")}\n`);
    const result = spawnSync(argv[0], argv.slice(1), { stdio: "inherit" });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${order.shot_id}: model CLI exited with ${result.status}`);
    if (!fs.existsSync(order.expected_clip)) {
      throw new Error(`${order.shot_id}: model CLI finished but did not create ${order.expected_clip}`);
    }
    const outputDigest = fileDigest(order.expected_clip);
    provenanceEntries.push({
      source_type: "model_cli_execute",
      created_at: new Date().toISOString(),
      order: order.order,
      shot: order.shot,
      id: order.shot_id,
      expected_clip: path.relative(projectRoot, order.expected_clip),
      command_argv: order.command_argv,
      bytes: outputDigest.bytes,
      sha256: outputDigest.sha256,
    });
  }
  writeClipProvenance(packageDir, provenanceEntries);
}

function concatClips(packageDir, workOrders, outFile) {
  const missing = workOrders.filter((order) => !fs.existsSync(order.expected_clip));
  if (missing.length > 0) {
    throw new Error(`Cannot concat: ${missing.length} clip(s) missing: ${missing.map((order) => order.shot_id).join(", ")}`);
  }

  const concatList = path.join(packageDir, "concat_list.txt");
  const lines = workOrders.map((order) => `file '${order.expected_clip.replace(/'/g, "'\\''")}'`).join("\n") + "\n";
  writeText(concatList, lines);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });

  const copyArgs = ["-y", "-f", "concat", "-safe", "0", "-i", concatList, "-c", "copy", outFile];
  const copy = spawnSync("ffmpeg", copyArgs, { stdio: "inherit" });
  if (copy.error) throw copy.error;
  if (copy.status === 0) return;

  process.stderr.write("ffmpeg concat copy failed; retrying with re-encode.\n");
  const reencodeArgs = [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatList,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-movflags",
    "+faststart",
    outFile,
  ];
  const reencode = spawnSync("ffmpeg", reencodeArgs, { stdio: "inherit" });
  if (reencode.error) throw reencode.error;
  if (reencode.status !== 0) throw new Error(`ffmpeg re-encode concat exited with ${reencode.status}`);
}

function guardConcatAllowed(pkg) {
  const isMonitorHandoff = pkg.manifest.package_type === "monitor_handoff" || pkg.manifest.status === "clips_pending";
  if (!isMonitorHandoff) return;
  throw new Error([
    "Cannot concat a monitor_handoff package with the generic runner.",
    "Run the project pipeline instead so generated clips must pass structural QA, extracted motion-review frames, machine-readable motion_review_passed decisions, and an empty revision queue:",
    "node scripts/run_scene09_v3_video_pipeline.js --dry-run",
    "node scripts/run_scene09_v3_video_pipeline.js --concat",
  ].join("\n"));
}

function renderCommands(plan, modelArgvTemplate) {
  const lines = ["#!/usr/bin/env bash", "set -euo pipefail", ""];
  if (!modelArgvTemplate) {
    lines.push("# Configure VIDEO_MODEL_CLI_ARGV_JSON, then run this package with --execute.");
    lines.push(`# Package: ${plan.package_id}`);
    lines.push("");
    for (const order of plan.work_orders) {
      lines.push(`# ${String(order.order).padStart(2, "0")} ${order.shot_id}`);
      lines.push(`# prompt: ${order.prompt}`);
      lines.push(`# negative: ${order.negative_prompt}`);
      lines.push(`# start/key/end: ${order.start_frame} | ${order.key_frame} | ${order.end_frame}`);
      lines.push(`# output: ${order.expected_clip}`);
      lines.push("");
    }
    lines.push(`node scripts/run_video_generation_package.js ${shellQuote([plan.package_dir])[0]} --execute --out ${shellQuote([plan.final_output])[0]}`);
    lines.push("# For monitor_handoff packages, concatenate only through the project pipeline after motion QA:");
    lines.push(`# node scripts/run_scene09_v3_video_pipeline.js --concat --out ${shellQuote([plan.final_output])[0]}`);
    lines.push("");
    return lines.join("\n");
  }

  for (const order of plan.work_orders) {
    lines.push(`# ${String(order.order).padStart(2, "0")} ${order.shot_id}`);
    lines.push(shellQuote(order.command_argv).join(" "));
    lines.push("");
  }
  lines.push(`node scripts/run_video_generation_package.js ${shellQuote([plan.package_dir])[0]} --concat --out ${shellQuote([plan.final_output])[0]}`);
  lines.push("");
  return lines.join("\n");
}

function renderSubmissionQueue(workOrders) {
  const fields = [
    "order",
    "shot",
    "shot_id",
    "duration_seconds",
    "shot_dir",
    "model_prompt",
    "audit_prompt",
    "negative_prompt",
    "start_frame",
    "key_frame",
    "end_frame",
    "expected_clip",
    "primary_check",
  ];
  const rows = workOrders.map((order) => [
    order.order,
    order.shot,
    order.shot_id,
    order.duration_seconds,
    path.relative(packageRootFor(order), order.shot_dir),
    path.basename(order.model_prompt),
    path.basename(order.audit_prompt),
    "negative_prompt.md",
    "start_frame.png",
    "key_frame.png",
    "end_frame.png",
    path.relative(packageRootFor(order), order.expected_clip),
    primaryCheck(order),
  ]);
  return [fields, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function packageRootFor(order) {
  return path.dirname(path.dirname(order.shot_dir));
}

function renderRunbook(pkg, workOrders, modelConfigured) {
  const isMonitorHandoff = pkg.manifest.package_type === "monitor_handoff" || pkg.manifest.status === "clips_pending";
  if (isMonitorHandoff) return renderMonitorRunbook(pkg, workOrders, modelConfigured);
  const lines = [
    "# Video Generation Runbook",
    "",
    `Project: ${pkg.manifest.project}`,
    `Package: ${pkg.manifest.package_id}`,
    `Target runtime: ${pkg.manifest.total_duration_seconds || pkg.timeline.total_duration_seconds} seconds`,
    "Status: approved_for_video, clips pending",
    "",
    "## Goal",
    "",
    "Generate each image-to-video clip from the approved start/key/end frame chain, then concatenate clips in timeline order.",
    "",
    "No creative interpretation should be required here. Preserve the approved frame identities, location, blocking, props, screen direction, action logic, and recorded dialogue/audio anchors.",
    "",
    "## Submission Order",
    "",
    ...workOrders.map((order) => `${order.order}. \`${path.relative(path.dirname(path.dirname(order.shot_dir)), order.shot_dir)}\` (${order.duration_seconds}s)`),
    "",
    "For each shot, submit:",
    "",
    "- `prompt.md`",
    "- `negative_prompt.md`",
    "- `start_frame.png` as the first frame",
    "- `key_frame.png` as the main action or emotional peak",
    "- `end_frame.png` as the final frame or cut-out state",
    "- Duration from `metadata.json`",
    "",
    "Save output to the `expected_clip` value in `metadata.json`.",
    "",
    "## Runner",
    "",
    modelConfigured
      ? "A model CLI argv template was present when this runbook was generated. See `execution_commands.sh`."
      : "Set `VIDEO_MODEL_CLI_ARGV_JSON` before using `--execute`. Until then, `execution_plan.json` and `execution_commands.sh` are dry-run handoff files.",
    "",
    "```bash",
    "node scripts/run_video_generation_package.js <this-package-dir> --execute",
    "node scripts/run_video_generation_package.js <this-package-dir> --concat",
    "```",
    "",
    "## Hard Rejects",
    "",
    "- Named character identity, costume, hair, weapon, prop state, or role drifts from the frames.",
    "- The clip invents new story logic instead of preserving the packaged shot intent.",
    "- Location, blocking, screen direction, or action continuity changes between adjacent shots.",
    "- A defeated, captured, absent, or inactive character returns unless the package explicitly allows it.",
    "- Dialogue or audio timing contradicts the package-local prompt and metadata.",
    "- New characters, subtitles, captions, logos, or watermarks appear.",
    "- Screen direction reverses across adjacent shots.",
    "",
    "## Rerun Policy",
    "",
    "Try one narrow rerun before changing the shot design. Keep the same frames, shorten the motion direction, and preserve identity, costume, prop, setting, camera, and dialogue anchor. If the same P0 issue appears twice, mark the shot `blocked_needs_revision` before generating alternatives.",
    "",
  ];
  return lines.join("\n");
}

function renderMonitorRunbook(pkg, workOrders, modelConfigured) {
  const onePass = pkg.manifest.submission_strategy === "one_pass_full_length";
  const durationLabel = onePass ? "目标全片时长" : "目标探针时长";
  const clipKind = onePass ? "完整时长镜头" : "短运动探针";
  const statusLine = onePass ? "状态：one_pass_full_length，clips_pending" : "状态：monitor_required，clips_pending";
  const hardRejects = Array.isArray(pkg.manifest.hard_rejects) && pkg.manifest.hard_rejects.length
    ? pkg.manifest.hard_rejects
    : [
        "Named character identity, costume, hair, weapon, prop state, or role drifts from the frames.",
        "The clip invents new story logic instead of preserving the packaged shot intent.",
        "Location, blocking, screen direction, or action continuity changes between adjacent shots.",
        "Dialogue or audio timing contradicts the package-local prompt and metadata.",
        "New characters, subtitles, captions, logos, or watermarks appear.",
        "Screen direction reverses across adjacent shots.",
      ];
  const lines = [
    "# 运动监看交接包运行说明",
    "",
    `项目：${pkg.manifest.project}`,
    `包编号：${pkg.manifest.package_id}`,
    `${durationLabel}：${pkg.manifest.total_duration_seconds || pkg.timeline.total_duration_seconds} 秒`,
    statusLine,
    "",
    "## 目标",
    "",
    onePass
      ? "使用包内 `model_prompt.md` 和 start/key/end 三帧链，为每个镜头一次性生成完整时长视频；生成后逐镜头做 clip-level 运动 QA，失败镜头单独重生。"
      : "使用包内 `model_prompt.md` 和 start/key/end 三帧链，为每个镜头生成短运动探针；任何镜头进入全时长生成或最终剪辑前，都必须先通过 clip-level 运动 QA。",
    "",
    onePass
      ? "这是预算受限的一遍过提交包，不是已经通过运动审查的最终包。可以直接提交 AI 视频模型，但如果生成片段破坏身份、图解、标签、镜头意图或结束帧连续性，就必须拒绝该镜头并单独重生。"
      : "这是受监看的提交包，不是 `approved_for_video` 包。可以用这些 work orders 测试模型，但如果生成片段破坏身份、图解、标签、镜头意图或结束帧连续性，就必须拒绝。",
    "",
    "## 提交顺序",
    "",
    ...workOrders.map((order) => `${order.order}. \`${path.relative(path.dirname(path.dirname(order.shot_dir)), order.shot_dir)}\` (${order.duration_seconds}s)`),
    "",
    "每个镜头提交：",
    "",
    "- `model_prompt.md` 作为模型输入提示词",
    "- `prompt.md` 作为完整审查合同",
    "- `negative_prompt.md`",
    "- `start_frame.png` 作为起始帧",
    "- `key_frame.png` 作为动作或证明峰值帧",
    "- `end_frame.png` 作为结束帧 / 剪出状态",
    onePass
      ? "- 时长使用 `metadata.json` 或 `submission_queue.csv` 中的完整镜头时长"
      : "- 时长使用 `metadata.json` 或 `submission_queue.csv` 中的探针时长",
    "",
    "自动提交时优先使用 `submission_payload.jsonl`。",
    "",
    `输出保存到 \`submission_queue.csv\` 或 \`execution_plan.json\` 中的 \`expected_clip\` 路径。当前生成类型：${clipKind}。`,
    "",
    "## 运行器",
    "",
    modelConfigured
      ? "生成本说明时已经检测到模型 CLI 参数模板。请查看 `execution_commands.sh`。"
      : "使用 `--execute` 前需要设置 `VIDEO_MODEL_CLI_ARGV_JSON`。在此之前，`execution_plan.json` 和 `execution_commands.sh` 只是 dry-run 交接文件。",
    "",
    "```bash",
    "node scripts/run_video_generation_package.js <this-package-dir> --execute",
    "node scripts/run_scene09_v3_video_pipeline.js --concat",
    "```",
    "",
    "不要用通用 runner 拼接这个监看包。拼接必须走项目 pipeline，先通过真实 clip 结构 QA、start/mid/end 运动审查帧抽取、机器可读 `motion_review_passed` 决策，以及空 revision queue。",
    "",
    "## 硬拒绝条件",
    "",
    ...hardRejects.map((item) => `- ${item}`),
    "",
    "## 重跑策略",
    "",
    onePass
      ? "预算限制下不要整片重生。先逐镜头检查；失败镜头只单独重生。保持相同 start/key/end 三帧；必要时只缩短运动描述，并保留身份、服装、道具、场景、机位、画面方向、数学标签和剪辑衔接。如果同一 P0 问题连续出现两次，将该镜头标记为 `blocked_needs_revision` 后再考虑替代方案。"
      : "改镜头设计前，只允许先做一次窄范围重跑。保持相同 start/key/end 三帧；必要时只缩短运动描述，并保留身份、服装、道具、场景、机位、画面方向、数学标签和剪辑衔接。如果同一 P0 问题连续出现两次，将该镜头标记为 `blocked_needs_revision` 后再考虑替代方案。",
    "",
  ];
  return lines.join("\n");
}

function primaryCheck(order) {
  if (order.audio_anchor) return order.audio_anchor.replace(/\s+/g, " ").slice(0, 120);
  if (order.reject_if.length > 0) return order.reject_if[0].replace(/\s+/g, " ").slice(0, 120);
  return "preserve approved frame chain and edit continuity";
}

function replacePlaceholders(argv, values) {
  return argv.map((arg) => arg.replace(/\{([a-z_]+)\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`Unknown placeholder ${match}`);
    return values[key];
  }));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function writeText(file, value) {
  fs.writeFileSync(file, value);
}

function shellQuote(argv) {
  return argv.map((arg) => {
    if (/^[A-Za-z0-9_./:=+-]+$/.test(arg)) return arg;
    return `'${arg.replace(/'/g, "'\\''")}'`;
  });
}

function csvCell(value) {
  const text = String(value == null ? "" : value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function reportPlan(plan) {
  process.stdout.write(`Package: ${plan.package_id}\n`);
  process.stdout.write(`Shots: ${plan.total_shots}, duration: ${plan.total_duration_seconds}s\n`);
  process.stdout.write(`Integrity: ${plan.integrity.ok ? "passed" : "blocked"}\n`);
  if (plan.integrity.errors.length > 0) {
    for (const error of plan.integrity.errors) process.stdout.write(`- ERROR ${error}\n`);
  }
  if (plan.integrity.warnings.length > 0) {
    for (const warning of plan.integrity.warnings) process.stdout.write(`- WARN ${warning}\n`);
  }
  process.stdout.write(`Model CLI configured: ${plan.model_cli_configured ? "yes" : "no"}\n`);
  process.stdout.write(`Model CLI template: ${plan.model_cli_template_validation?.decision || "unknown"}\n`);
  if (plan.model_cli_template_validation?.problems?.length > 0) {
    for (const problem of plan.model_cli_template_validation.problems) process.stdout.write(`- TEMPLATE ${problem}\n`);
  }
  process.stdout.write(`Missing clips: ${plan.clip_status.missing_count}\n`);
  process.stdout.write(`Plan written: ${path.join(plan.package_dir, "execution_plan.json")}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
