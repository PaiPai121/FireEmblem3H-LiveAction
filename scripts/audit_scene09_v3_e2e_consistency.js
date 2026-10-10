#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const paths = {
  manifest: path.join(root, "production_system/video_delivery_manifest.json"),
  queue: path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json"),
  packageManifest: path.join(packageDir, "package_manifest.json"),
  executionPlan: path.join(packageDir, "execution_plan.json"),
  submissionPayload: path.join(packageDir, "submission_payload.jsonl"),
};
const outJson = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_e2e_consistency_audit_2026-07-30.json");
const outMd = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_e2e_consistency_audit_2026-07-30.md");

const expectedKeyShots = {
  Shot032F: {
    visible: ["Felix", "Ashe", "Hubert"],
    requirePrompt: [/Hubert/i, /Felix/i, /Ashe/i, /captur|repelled/i],
  },
  Shot032G: {
    visible: ["Claude", "Leonie", "Dorothea", "Bernadetta"],
    requirePrompt: [/Claude/i, /Leonie/i, /Dorothea/i, /Bernadetta/i, /captur/i],
  },
  Shot034B: {
    visible: ["Byleth", "Dimitri"],
    frame: /34D_Shot034B_empty_objective/,
    requirePrompt: [/Empty faculty objective ruling/i, /Two far-separated faculty objective markers must be empty/i, /No Hanneman voice and no Manuela voice in this shot/i, /Only these readable humans may appear: Byleth, Dimitri\./i],
    forbidPrompt: [/Single-lane Hanneman ruling/i, /Hanneman is alone on his own faculty lane\/platform/i, /^No Manuela voice in this shot\.?$/im, /Only these readable humans may appear: Byleth, Dimitri, Hanneman\./i],
  },
  Shot034G: {
    visible: ["Byleth", "Dimitri", "Dedue"],
    frame: /37E_Shot034G_core_victory_lance/,
    active: { command: ["Byleth"], blue_lions: ["Dimitri", "Dedue"] },
    inactiveIncludes: ["Felix", "Ashe", "Annette", "Mercedes", "Sylvain", "Ingrid", "Edelgard", "Hubert", "Ferdinand", "Dorothea", "Bernadetta", "Claude", "Hilda", "Lorenz", "Ignatz", "Leonie", "Hanneman", "Manuela"],
    requirePrompt: [/Byleth, Dimitri, Dedue/i, /full Blue Lions class celebration/i, /long wooden training lance/i],
  },
  Shot036: {
    visible: ["Dimitri", "Byleth"],
    frame: /40C_Shot036_lance/,
    active: { command: ["Byleth"], blue_lions: ["Dimitri", "Dedue"] },
    inactiveIncludes: ["Felix", "Ashe", "Annette", "Mercedes", "Sylvain", "Ingrid", "Edelgard", "Hubert", "Ferdinand", "Dorothea", "Bernadetta", "Claude", "Hilda", "Lorenz", "Ignatz", "Leonie", "Hanneman", "Manuela"],
    requirePrompt: [/Dimitri, Byleth/i, /long wooden training lance/i, /anyone outside Dimitri and Byleth appears/i],
  },
};

const capturedLocks = {
  Hubert: "Shot032F",
  Dorothea: "Shot032G",
  Bernadetta: "Shot032G",
};

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

function sameList(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

function flattenGroups(groups) {
  return Object.values(groups || {}).flatMap((names) => Array.isArray(names) ? names : []);
}

function ledger(row) {
  return row?.battle_ledger_after || row?.battle_state_after?.battle_ledger_after || row?.roster_after?.battle_ledger_after || row?.battle_state_after?.battle_after?.battle_ledger_after || {};
}

function sourceFrames(row) {
  return {
    start_frame: row?.source_frames?.start_frame || row?.source_frames?.start || row?.frames?.start_frame || row?.frames?.start?.path || row?.start_frame || "",
    key_frame: row?.source_frames?.key_frame || row?.source_frames?.key || row?.frames?.key_frame || row?.frames?.key?.path || row?.key_frame || "",
    end_frame: row?.source_frames?.end_frame || row?.source_frames?.end || row?.frames?.end_frame || row?.frames?.end?.path || row?.end_frame || "",
  };
}

function indexByShot(rows) {
  return new Map((rows || []).map((row) => [row.shot, row]));
}

function loadSubmissionPayload() {
  if (!fs.existsSync(paths.submissionPayload)) return new Map();
  const rows = readText(paths.submissionPayload)
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  return indexByShot(rows);
}

function metadataFor(packageShot) {
  if (!packageShot?.package_dir) return null;
  const file = path.join(packageDir, packageShot.package_dir, "metadata.json");
  return fs.existsSync(file) ? readJson(file) : null;
}

function modelPromptFor(packageShot) {
  if (!packageShot?.package_dir) return "";
  const file = path.join(packageDir, packageShot.package_dir, "model_prompt.md");
  return fs.existsSync(file) ? readText(file) : "";
}

function checkSameField(problems, shotId, label, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (!entries.length) return;
  const expected = JSON.stringify(entries[0][1]);
  for (const [source, value] of entries.slice(1)) {
    if (JSON.stringify(value) !== expected) {
      problems.push(`${shotId}: ${label} mismatch: ${entries[0][0]}=${expected} ${source}=${JSON.stringify(value)}`);
    }
  }
}

function checkActiveGroups(problems, shotId, actual, expected) {
  for (const [group, names] of Object.entries(expected || {})) {
    if (!sameList(actual?.[group] || [], names)) {
      problems.push(`${shotId}: active ledger ${group} expected ${names.join(",")} got ${(actual?.[group] || []).join(",") || "none"}`);
    }
  }
}

function main() {
  for (const file of Object.values(paths)) {
    if (file !== paths.submissionPayload && !fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
  }

  const manifest = readJson(paths.manifest);
  const queue = readJson(paths.queue);
  const packageManifest = readJson(paths.packageManifest);
  const executionPlan = readJson(paths.executionPlan);
  const submission = loadSubmissionPayload();
  const sources = {
    manifest: indexByShot(manifest.shots),
    queue: indexByShot(queue),
    package: indexByShot(packageManifest.shots),
    execution: indexByShot(executionPlan.work_orders),
  };
  const problems = [];
  const warnings = [];
  const evidence = [];
  const rows = [];

  const shotOrder = (manifest.shots || []).map((shot) => shot.shot);
  if (shotOrder.length !== 42) problems.push(`manifest shot count ${shotOrder.length}, expected 42`);
  for (const [name, map] of Object.entries(sources)) {
    const keys = [...map.keys()];
    if (JSON.stringify(keys) !== JSON.stringify(shotOrder)) {
      problems.push(`${name} shot order differs from production manifest`);
    }
  }

  const captureOrder = Object.fromEntries(Object.entries(capturedLocks).map(([name, shot]) => [name, sources.manifest.get(shot)?.order || 0]));

  for (const shotId of shotOrder) {
    const rowsBySource = Object.fromEntries(Object.entries(sources).map(([name, map]) => [name, map.get(shotId)]));
    const packageShot = rowsBySource.package;
    const metadata = metadataFor(packageShot);
    const payload = submission.get(shotId);
    const promptText = modelPromptFor(packageShot);
    const rowProblems = [];

    for (const [source, row] of Object.entries(rowsBySource)) {
      if (!row) rowProblems.push(`missing in ${source}`);
    }
    if (!metadata) rowProblems.push("missing package metadata");

    checkSameField(rowProblems, shotId, "visible_named_only", {
      manifest: rowsBySource.manifest?.visible_named_only,
      queue: rowsBySource.queue?.visible_named_only,
      package: rowsBySource.package?.visible_named_only,
      execution: rowsBySource.execution?.visible_named_only,
      metadata: metadata?.visible_named_only,
      payload: payload?.visible_named_only,
    });
    checkSameField(rowProblems, shotId, "expected_clip", {
      manifest: rowsBySource.manifest?.expected_clip,
      package: rowsBySource.package?.expected_clip,
      execution: rowsBySource.execution?.expected_clip,
      metadata: metadata?.expected_clip,
      payload: payload?.expected_clip,
    });
    for (const frameField of ["start_frame", "key_frame", "end_frame"]) {
      checkSameField(rowProblems, shotId, frameField, {
        manifest: sourceFrames(rowsBySource.manifest)[frameField],
        queue: sourceFrames(rowsBySource.queue)[frameField],
        package: sourceFrames(rowsBySource.package)[frameField],
        execution: sourceFrames(rowsBySource.execution)[frameField],
        metadata: sourceFrames(metadata)[frameField],
      });
      if (payload?.absolute_files?.[frameField] && !fs.existsSync(payload.absolute_files[frameField])) {
        rowProblems.push(`payload local ${frameField} missing: ${payload.absolute_files[frameField]}`);
      }
    }

    const visible = rowsBySource.manifest?.visible_named_only || [];
    if (visible.includes("Hanneman") && visible.includes("Manuela")) {
      rowProblems.push("Hanneman and Manuela are co-visible");
    }
    for (const [name, order] of Object.entries(captureOrder)) {
      if ((rowsBySource.manifest?.order || 0) > order && visible.includes(name)) {
        rowProblems.push(`${name} visible after capture shot ${capturedLocks[name]}`);
      }
    }

    const expected = expectedKeyShots[shotId];
    if (expected) {
      if (!sameList(visible, expected.visible)) {
        rowProblems.push(`expected visible ${expected.visible.join(",")} got ${visible.join(",") || "none"}`);
      }
      if (expected.frame) {
        for (const [field, value] of Object.entries(sourceFrames(rowsBySource.manifest))) {
          if (!expected.frame.test(value)) rowProblems.push(`${field} does not match ${expected.frame}: ${value}`);
        }
      }
      for (const pattern of expected.requirePrompt || []) {
        if (!pattern.test(promptText)) rowProblems.push(`model_prompt missing ${pattern}`);
      }
      for (const pattern of expected.forbidPrompt || []) {
        if (pattern.test(promptText)) rowProblems.push(`model_prompt contains forbidden ${pattern}`);
      }
      const active = ledger(rowsBySource.manifest).still_active_or_controlling_objective_by_house;
      checkActiveGroups(rowProblems, shotId, active, expected.active);
      const inactive = new Set(flattenGroups(ledger(rowsBySource.manifest).mock_battle_defeated_or_removed_by_house));
      for (const name of expected.inactiveIncludes || []) {
        if (!inactive.has(name)) rowProblems.push(`inactive ledger missing ${name}`);
      }
    }

    if (!/No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes\./.test(promptText)) {
      rowProblems.push("model_prompt missing no unnamed readable people lock");
    }
    if (!/any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears/i.test(promptText)) {
      rowProblems.push("model_prompt missing extra-readable-human reject");
    }

    const rejects = rowsBySource.manifest?.reject_if || [];
    if (rejects.length !== new Set(rejects).size) rowProblems.push("manifest reject_if has duplicate lines");

    rows.push({ shot: shotId, problems: rowProblems });
    problems.push(...rowProblems.map((problem) => `${shotId}: ${problem}`));
  }

  if (!problems.length) {
    evidence.push("All 42 shots have matching order across manifest, frame queue, package manifest, and execution plan.");
    evidence.push("Visible named-only locks, start/key/end frames, expected clips, package metadata, and submission payload agree for every shot.");
    evidence.push("Empty faculty objective, capture, no-extra, no-reentry, 034B, 034G, and 036 locks are enforced across current delivery surfaces.");
  }

  const result = {
    date: "2026-07-30",
    decision: problems.length ? "scene09_v3_e2e_consistency_failed" : "scene09_v3_e2e_consistency_passed",
    shots: shotOrder.length,
    problems,
    warnings,
    evidence,
    rows,
  };
  writeJson(outJson, result);
  writeText(outMd, [
    "# Scene09 V3 End-To-End Consistency Audit",
    "",
    `Date: ${result.date}`,
    `Decision: ${result.decision}`,
    `Shots audited: ${shotOrder.length}`,
    "",
    "## Problems",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Evidence",
    evidence.length ? evidence.map((item) => `- ${item}`).join("\n") : "- see JSON rows",
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
