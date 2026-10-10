#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-07-28";
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const executionPlanPath = path.join(packageDir, "execution_plan.json");
const payloadPath = path.join(packageDir, "submission_payload.jsonl");
const payloadManifestPath = path.join(packageDir, "submission_payload_manifest.json");
const outJsonPath = path.join(reportDir, `scene09_v3_execution_asset_integrity_${date}.json`);
const outMdPath = path.join(reportDir, `scene09_v3_execution_asset_integrity_${date}.md`);
const outCsvPath = path.join(reportDir, `scene09_v3_execution_asset_integrity_${date}.csv`);
const packageMdPath = path.join(packageDir, "execution_asset_integrity.md");
const packageCsvPath = path.join(packageDir, "execution_asset_integrity.csv");

const requiredShotFiles = [
  "prompt.md",
  "model_prompt.md",
  "negative_prompt.md",
  "metadata.json",
  "start_frame.png",
  "key_frame.png",
  "end_frame.png",
];

const negativeLocks = [
  "no extra people",
  "no unnamed students",
  "no spectators",
  "no crowds",
  "no readable silhouettes",
  "no face drift",
  "no costume drift",
  "no weapon drift",
  "no lethal hits",
  "no gore",
  "no blood",
  "no text",
  "no subtitles",
  "no captions",
  "no visible text",
  "no watermark",
  "no camera spin",
  "no screen-direction reversal",
];

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

function shaFile(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function pngInfo(file) {
  const buffer = fs.readFileSync(file);
  const signature = "89504e470d0a1a0a";
  if (buffer.length < 33 || buffer.subarray(0, 8).toString("hex") !== signature) {
    return { ok: false, width: null, height: null, reason: "invalid PNG signature" };
  }
  if (buffer.subarray(12, 16).toString("ascii") !== "IHDR") {
    return { ok: false, width: null, height: null, reason: "missing IHDR" };
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const ratio = height ? width / height : 0;
  return {
    ok: true,
    width,
    height,
    aspect_ratio: Number(ratio.toFixed(6)),
    is_16x9: Math.abs(ratio - 16 / 9) < 0.002,
  };
}

function csvCell(value) {
  const text = String(value == null ? "" : value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function sameArray(a, b) {
  const aa = Array.isArray(a) ? a : [];
  const bb = Array.isArray(b) ? b : [];
  return aa.length === bb.length && aa.every((value, index) => value === bb[index]);
}

function parsePayloadRows(file, problems) {
  if (!fs.existsSync(file)) return [];
  return readText(file)
    .split(/\n/)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        problems.push(`submission_payload.jsonl line ${index + 1}: invalid JSON (${error.message})`);
        return null;
      }
    })
    .filter(Boolean);
}

function checkPathInside(file, ancestor) {
  const relative = path.relative(ancestor, file);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function expectedNoActiveLine(metadata) {
  const removed = metadata.battle_state_after?.no_active_combat_after
    || metadata.battle_state_after?.inactive_or_removed_after
    || [];
  return `No-active-combat after this shot: ${removed.length ? removed.join(", ") : "none"}.`;
}

function sourceFrameCheck(shotDir, metadata, frameName, packagedFile, problems, warnings) {
  const source = metadata.source_frames?.[frameName];
  if (!source) {
    warnings.push(`${metadata.shot}: missing metadata.source_frames.${frameName}`);
    return null;
  }
  const sourceFile = path.isAbsolute(source) ? source : path.join(root, source);
  if (!fs.existsSync(sourceFile)) {
    problems.push(`${metadata.shot}: source ${frameName} missing: ${source}`);
    return { source, exists: false };
  }
  const sourceDigest = shaFile(sourceFile);
  const packagedDigest = shaFile(packagedFile);
  if (sourceDigest.sha256 !== packagedDigest.sha256) {
    problems.push(`${metadata.shot}: packaged ${frameName} sha256 differs from metadata source frame`);
  }
  return {
    source: rel(sourceFile),
    exists: true,
    source_sha256: sourceDigest.sha256,
    matches_packaged_copy: sourceDigest.sha256 === packagedDigest.sha256,
  };
}

function main() {
  const problems = [];
  const warnings = [];
  const requiredTop = [packageManifestPath, executionPlanPath, payloadPath, payloadManifestPath];
  for (const file of requiredTop) {
    if (!fs.existsSync(file)) problems.push(`missing top-level package file: ${rel(file)}`);
  }

  const packageManifest = fs.existsSync(packageManifestPath) ? readJson(packageManifestPath) : { shots: [] };
  const executionPlan = fs.existsSync(executionPlanPath) ? readJson(executionPlanPath) : { work_orders: [] };
  const payloadManifest = fs.existsSync(payloadManifestPath) ? readJson(payloadManifestPath) : {};
  const payloadRows = parsePayloadRows(payloadPath, problems);
  const payloadByShot = new Map(payloadRows.map((row) => [row.shot, row]));
  const workOrderByShot = new Map((executionPlan.work_orders || []).map((row) => [row.shot, row]));
  const seenClips = new Set();
  const seenCustomIds = new Set();
  const shotRows = [];

  if (packageManifest.total_shots !== 42) problems.push(`package_manifest total_shots=${packageManifest.total_shots}, expected 42`);
  if ((packageManifest.shots || []).length !== 42) problems.push(`package_manifest shots length=${(packageManifest.shots || []).length}, expected 42`);
  if (executionPlan.total_shots !== 42) problems.push(`execution_plan total_shots=${executionPlan.total_shots}, expected 42`);
  if ((executionPlan.work_orders || []).length !== 42) problems.push(`execution_plan work_orders length=${(executionPlan.work_orders || []).length}, expected 42`);
  if (payloadRows.length !== 42) problems.push(`submission_payload rows=${payloadRows.length}, expected 42`);
  if (payloadManifest.rows !== payloadRows.length) problems.push(`submission_payload_manifest rows=${payloadManifest.rows}, parsed=${payloadRows.length}`);
  if (fs.existsSync(payloadPath)) {
    const payloadSha = crypto.createHash("sha256").update(readText(payloadPath)).digest("hex");
    if (payloadManifest.sha256 !== payloadSha) problems.push("submission_payload_manifest sha256 mismatch");
  }

  for (const [index, shot] of (packageManifest.shots || []).entries()) {
    const shotProblems = [];
    const shotWarnings = [];
    const shotDir = path.join(packageDir, shot.package_dir || "");
    const row = {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      package_dir: shot.package_dir,
      decision: "pending",
      visible_named_only: shot.visible_named_only || [],
      files: {},
      frame_dimensions: {},
      expected_clip: shot.expected_clip,
      prompt_chars: 0,
      negative_chars: 0,
    };

    if (shot.order !== index + 1) shotProblems.push(`order=${shot.order}, expected ${index + 1}`);
    if (!fs.existsSync(shotDir)) shotProblems.push(`missing shot directory ${rel(shotDir)}`);
    if (!String(shot.package_dir || "").startsWith(`shots/${String(shot.order).padStart(3, "0")}_`)) {
      shotProblems.push("package_dir is not zero-padded in timeline order");
    }

    const files = Object.fromEntries(requiredShotFiles.map((name) => [name, path.join(shotDir, name)]));
    for (const [name, file] of Object.entries(files)) {
      if (!fs.existsSync(file)) {
        shotProblems.push(`missing ${name}`);
        continue;
      }
      const digest = shaFile(file);
      row.files[name] = digest;
      if (name.endsWith(".png")) {
        const info = pngInfo(file);
        row.frame_dimensions[name] = info;
        if (!info.ok) shotProblems.push(`${name}: ${info.reason}`);
        if (info.ok && !info.is_16x9) shotProblems.push(`${name}: aspect ratio ${info.width}x${info.height} is not 16:9`);
      }
    }

    const metadata = fs.existsSync(files["metadata.json"]) ? readJson(files["metadata.json"]) : {};
    const modelPrompt = fs.existsSync(files["model_prompt.md"]) ? readText(files["model_prompt.md"]).trimEnd() : "";
    const auditPrompt = fs.existsSync(files["prompt.md"]) ? readText(files["prompt.md"]).trimEnd() : "";
    const negativePrompt = fs.existsSync(files["negative_prompt.md"]) ? readText(files["negative_prompt.md"]).trimEnd() : "";
    row.prompt_chars = modelPrompt.length;
    row.negative_chars = negativePrompt.length;

    if (metadata.id !== shot.id) shotProblems.push("metadata.id does not match package manifest");
    if (metadata.shot !== shot.shot) shotProblems.push("metadata.shot does not match package manifest");
    if (metadata.order !== shot.order) shotProblems.push("metadata.order does not match package manifest");
    if (!sameArray(metadata.visible_named_only, shot.visible_named_only)) shotProblems.push("metadata visible_named_only differs from package manifest");

    const visibleLock = `Only these readable humans may appear: ${(shot.visible_named_only || []).join(", ") || "none"}.`;
    if (!modelPrompt.includes(visibleLock)) shotProblems.push("model_prompt missing exact visible-readable-human lock");
    if (!modelPrompt.includes("No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.")) {
      shotProblems.push("model_prompt missing no-extra-human continuity lock");
    }
    if (shot.shot === "Shot034B") {
      if (!/Empty faculty objective ruling/i.test(modelPrompt)
        || !/Two far-separated faculty objective markers must be empty/i.test(modelPrompt)
        || !/Hanneman and Manuela are absent, offscreen, silent, and unpaired/i.test(modelPrompt)
        || !/No Hanneman voice and no Manuela voice in this shot/i.test(modelPrompt)) {
        shotProblems.push("model_prompt missing empty-objective / teachers-absent lock");
      }
    } else if (!modelPrompt.includes("Hanneman and Manuela are separate faculty examiners")
      && !modelPrompt.includes("Hanneman is alone on his own faculty lane/platform; Manuela is absent, offscreen, silent, and never paired with Hanneman.")) {
      shotProblems.push("model_prompt missing separate-faculty-examiner lock");
    }
    if (!modelPrompt.includes(expectedNoActiveLine(metadata))) {
      shotProblems.push("model_prompt no-active-combat line does not mirror metadata");
    }
    if (!modelPrompt.includes("captured Hubert, captured Dorothea, or captured Bernadetta reappears")) {
      shotProblems.push("model_prompt missing captured-character reject lock");
    }
    if (!modelPrompt.includes("spent, stood-down, objective-defeated, or defeated-house character resumes active combat")) {
      shotProblems.push("model_prompt missing defeated-character active-return reject lock");
    }
    for (const lock of negativeLocks) {
      if (!negativePrompt.includes(lock)) shotProblems.push(`negative_prompt missing "${lock}"`);
      if (!modelPrompt.includes(lock)) shotProblems.push(`model_prompt negative block missing "${lock}"`);
    }

    if (shot.shot === "Shot034B") {
      if (!sameArray(shot.visible_named_only, ["Byleth", "Dimitri"])) {
        shotProblems.push("Shot034B visible roster must be Byleth, Dimitri");
      }
      if (shot.visible_named_only.includes("Hanneman") || shot.visible_named_only.includes("Manuela")) {
        shotProblems.push("Shot034B must keep Hanneman and Manuela absent from visible roster");
      }
      if (!modelPrompt.includes("No Hanneman voice and no Manuela voice in this shot")) {
        shotProblems.push("Shot034B missing explicit no-teacher-voice audio lock");
      }
      if (/Single-lane Hanneman ruling|Hanneman is alone on his own faculty lane\/platform|^No Manuela voice in this shot\.?$/im.test(modelPrompt) || /Allowed readable humans: Byleth, Dimitri, Hanneman\./i.test(modelPrompt)) {
        shotProblems.push("Shot034B still contains deprecated Hanneman single-lane wording");
      }
    }
    for (const frameName of ["start_frame", "key_frame", "end_frame"]) {
      const localFile = files[`${frameName}.png`];
      if (fs.existsSync(localFile)) {
        row.frame_dimensions[`${frameName}.source_check`] = sourceFrameCheck(shotDir, metadata, frameName, localFile, shotProblems, shotWarnings);
      }
    }

    const payloadRow = payloadByShot.get(shot.shot);
    if (!payloadRow) {
      shotProblems.push("missing submission_payload row");
    } else {
      if (payloadRow.order !== shot.order) shotProblems.push("payload order mismatch");
      if (payloadRow.custom_id !== `${String(shot.order).padStart(3, "0")}_${shot.shot}`) shotProblems.push("payload custom_id mismatch");
      if (seenCustomIds.has(payloadRow.custom_id)) shotProblems.push("duplicate payload custom_id");
      seenCustomIds.add(payloadRow.custom_id);
      if (payloadRow.prompt_text !== modelPrompt) shotProblems.push("payload prompt_text differs from model_prompt.md");
      if (payloadRow.negative_prompt_text !== negativePrompt) shotProblems.push("payload negative_prompt_text differs from negative_prompt.md");
      if (!sameArray(payloadRow.visible_named_only, shot.visible_named_only)) shotProblems.push("payload visible_named_only mismatch");
      for (const [key, file] of [
        ["model_prompt", files["model_prompt.md"]],
        ["audit_prompt", files["prompt.md"]],
        ["negative_prompt", files["negative_prompt.md"]],
        ["metadata", files["metadata.json"]],
        ["start_frame", files["start_frame.png"]],
        ["key_frame", files["key_frame.png"]],
        ["end_frame", files["end_frame.png"]],
      ]) {
        if (!fs.existsSync(file)) continue;
        const digest = shaFile(file);
        const recorded = payloadRow.file_digests?.[key];
        if (!recorded || recorded.sha256 !== digest.sha256 || Number(recorded.bytes) !== digest.bytes) {
          shotProblems.push(`payload digest mismatch for ${key}`);
        }
      }
    }

    const workOrder = workOrderByShot.get(shot.shot);
    if (!workOrder) {
      shotProblems.push("missing execution_plan work_order");
    } else {
      if (workOrder.order !== shot.order) shotProblems.push("execution_plan order mismatch");
      if (path.basename(workOrder.prompt || "") !== "model_prompt.md") shotProblems.push("execution_plan prompt must be model_prompt.md");
      if (path.basename(workOrder.audit_prompt || "") !== "prompt.md") shotProblems.push("execution_plan audit_prompt must be prompt.md");
      if (workOrder.expected_clip !== shot.expected_clip) shotProblems.push("execution_plan expected_clip differs from package manifest");
      if (!sameArray(workOrder.visible_named_only, shot.visible_named_only)) shotProblems.push("execution_plan visible_named_only mismatch");
    }

    const expectedClipAbs = path.join(root, shot.expected_clip || "");
    if (!checkPathInside(expectedClipAbs, path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition"))) {
      shotProblems.push("expected_clip is outside scene09_v3_attrition video output directory");
    }
    if (String(shot.expected_clip || "").includes("delivery/scene09_v3_monitor_handoff_package_2026-07-27")) {
      shotProblems.push("expected_clip incorrectly points inside the delivery package");
    }
    if (seenClips.has(shot.expected_clip)) shotProblems.push("duplicate expected_clip");
    seenClips.add(shot.expected_clip);

    row.decision = shotProblems.length ? "blocked_needs_revision" : "execution_assets_ready";
    row.problems = shotProblems;
    row.warnings = shotWarnings;
    shotRows.push(row);
    problems.push(...shotProblems.map((item) => `${shot.shot}: ${item}`));
    warnings.push(...shotWarnings.map((item) => `${shot.shot}: ${item}`));
  }

  const dimensionGroups = {};
  for (const row of shotRows) {
    for (const frameName of ["start_frame.png", "key_frame.png", "end_frame.png"]) {
      const info = row.frame_dimensions?.[frameName];
      if (!info?.ok) continue;
      const key = `${info.width}x${info.height}`;
      dimensionGroups[key] = (dimensionGroups[key] || 0) + 1;
    }
  }

  const report = {
    date,
    package_dir: rel(packageDir),
    package_manifest: rel(packageManifestPath),
    execution_plan: rel(executionPlanPath),
    submission_payload: rel(payloadPath),
    submission_payload_manifest: rel(payloadManifestPath),
    total_shots: (packageManifest.shots || []).length,
    shots_ready: shotRows.filter((row) => row.decision === "execution_assets_ready").length,
    shots_blocked: shotRows.filter((row) => row.decision !== "execution_assets_ready").length,
    dimension_groups: dimensionGroups,
    problems,
    warnings,
    rows: shotRows,
    package_copies: {
      markdown: rel(packageMdPath),
      csv: rel(packageCsvPath),
    },
    decision: problems.length ? "blocked_needs_revision" : "execution_asset_integrity_passed",
  };

  writeJson(outJsonPath, report);

  const md = [
    "# Scene09 V3 Execution Asset Integrity",
    "",
    `Date: ${date}`,
    `Decision: ${report.decision}`,
    `Shots ready: ${report.shots_ready}/${report.total_shots}`,
    `Problems: ${problems.length}`,
    `Warnings: ${warnings.length}`,
    "",
    "## Scope",
    "",
    "- Verifies each package-local prompt, model prompt, negative prompt, metadata file, and start/key/end PNG.",
    "- Verifies PNG hashes and dimensions, source-frame copy integrity, submission JSONL hashes, execution-plan order, expected clip paths, visible roster locks, no-extra-human locks, no-active-combat lines, and no text/subtitle/caption locks.",
    "- Keeps generated clips out of scope; clip status remains controlled by the generated-clip QA and motion-review gates.",
    "",
    "## Dimension Groups",
    "",
    ...Object.entries(dimensionGroups).map(([group, count]) => `- ${group}: ${count} frame(s)`),
    "",
    "## Problems",
    "",
    ...(problems.length ? problems.map((item) => `- ${item}`) : ["- none"]),
    "",
    "## Shot Summary",
    "",
    "| Order | Shot | Decision | Visible Named Only | Frame Sizes | Expected Clip |",
    "| --- | --- | --- | --- | --- | --- |",
    ...shotRows.map((row) => {
      const sizes = ["start_frame.png", "key_frame.png", "end_frame.png"]
        .map((frameName) => {
          const info = row.frame_dimensions?.[frameName];
          return info?.ok ? `${frameName.replace("_frame.png", "")}:${info.width}x${info.height}` : `${frameName}:missing`;
        })
        .join("; ");
      return `| ${row.order} | ${row.shot} | ${row.decision} | ${(row.visible_named_only || []).join(", ") || "none"} | ${sizes} | ${row.expected_clip} |`;
    }),
    "",
  ].join("\n");
  writeText(outMdPath, md);
  writeText(packageMdPath, md);

  const csvRows = [
    ["order", "shot", "decision", "visible_named_only", "prompt_sha256", "negative_sha256", "metadata_sha256", "start_frame_size", "start_frame_sha256", "key_frame_size", "key_frame_sha256", "end_frame_size", "end_frame_sha256", "expected_clip", "problems"],
    ...shotRows.map((row) => {
      const frameCell = (frameName) => {
        const info = row.frame_dimensions?.[frameName];
        return info?.ok ? `${info.width}x${info.height}` : "";
      };
      return [
        row.order,
        row.shot,
        row.decision,
        (row.visible_named_only || []).join("; "),
        row.files["model_prompt.md"]?.sha256 || "",
        row.files["negative_prompt.md"]?.sha256 || "",
        row.files["metadata.json"]?.sha256 || "",
        frameCell("start_frame.png"),
        row.files["start_frame.png"]?.sha256 || "",
        frameCell("key_frame.png"),
        row.files["key_frame.png"]?.sha256 || "",
        frameCell("end_frame.png"),
        row.files["end_frame.png"]?.sha256 || "",
        row.expected_clip,
        (row.problems || []).join("; "),
      ];
    }),
  ].map((cells) => cells.map(csvCell).join(",")).join("\n");
  writeText(outCsvPath, `${csvRows}\n`);
  writeText(packageCsvPath, `${csvRows}\n`);

  console.log(JSON.stringify({
    decision: report.decision,
    shots_ready: report.shots_ready,
    total_shots: report.total_shots,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJsonPath),
    report_md: rel(outMdPath),
    report_csv: rel(outCsvPath),
  }, null, 2));
  if (problems.length) process.exit(1);
}

main();
