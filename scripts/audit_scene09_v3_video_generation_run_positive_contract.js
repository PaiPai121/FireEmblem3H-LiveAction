#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const cp = require("child_process");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const productionFinalOutput = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");
const outJson = path.join(reportDir, `scene09_v3_video_generation_run_positive_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_video_generation_run_positive_contract_${date}.md`);
const packageOutJson = path.join(packageDir, "video_generation_run_positive_contract.json");
const packageOutMd = path.join(packageDir, "video_generation_run_positive_contract.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
}

function rel(file) {
  return path.relative(root, file);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function parseLastJson(text) {
  const trimmed = String(text || "").trim();
  const starts = [];
  for (let i = 0; i < trimmed.length; i += 1) {
    if (trimmed[i] === "{") starts.push(i);
  }
  for (const start of starts.reverse()) {
    try {
      return JSON.parse(trimmed.slice(start));
    } catch (_) {
      // Keep scanning backward.
    }
  }
  return null;
}

function makeRows(manifest, mapper) {
  return (manifest.shots || []).map((shot) => ({
    order: shot.order,
    shot: shot.shot,
    id: shot.id,
    expected_clip: shot.expected_clip,
    ...mapper(shot),
  }));
}

function createFinalFixture(file, durationSeconds) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const result = cp.spawnSync("ffmpeg", [
    "-y",
    "-f", "lavfi",
    "-i", `color=c=black:s=160x90:r=1:d=${durationSeconds}`,
    "-an",
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    file,
  ], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(`ffmpeg video-generation-run fixture failed: ${result.error?.message || result.stderr || result.status}`);
  }
}

function createExpectedClipFixtures(tmpRoot, manifest) {
  const clipDir = path.join(tmpRoot, "expected_clips");
  fs.mkdirSync(clipDir, { recursive: true });
  const sampleClip = path.join(clipDir, "sample_valid_expected_clip.mp4");
  const result = cp.spawnSync("ffmpeg", [
    "-y",
    "-f", "lavfi",
    "-i", "color=c=black:s=160x90:r=12:d=0.5",
    "-an",
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-pix_fmt", "yuv420p",
    sampleClip,
  ], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(`ffmpeg expected-clip fixture failed: ${result.error?.message || result.stderr || result.status}`);
  }
  return (manifest.shots || []).map((shot) => {
    const file = path.join(clipDir, `${String(shot.order).padStart(2, "0")}_${shot.shot}.mp4`);
    fs.copyFileSync(sampleClip, file);
    return {
      ...shot,
      expected_clip: rel(file),
    };
  });
}

function expectedClipFileRows(manifest) {
  return makeRows(manifest, (shot) => {
    const absolute = path.isAbsolute(shot.expected_clip)
      ? shot.expected_clip
      : path.join(root, shot.expected_clip || "");
    const exists = fs.existsSync(absolute);
    const stat = exists ? fs.statSync(absolute) : null;
    return {
      exists,
      size_bytes: stat?.size ?? null,
      sha256: exists ? sha256(absolute) : null,
    };
  });
}

function probeVideoFile(file) {
  if (!fs.existsSync(file)) return { exists: false, ok: false, issue: "missing_clip" };
  const stat = fs.statSync(file);
  if (stat.size === 0) return { exists: true, ok: false, issue: "zero_byte_clip", size_bytes: 0 };
  const result = cp.spawnSync("ffprobe", [
    "-v", "error",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    file,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    return { exists: true, ok: false, issue: "ffprobe_failed", size_bytes: stat.size, error: result.stderr.trim() || `ffprobe exited ${result.status}` };
  }
  try {
    const data = JSON.parse(result.stdout);
    const videoStream = (data.streams || []).find((stream) => stream.codec_type === "video");
    return {
      exists: true,
      ok: Boolean(videoStream),
      issue: videoStream ? null : "missing_video_stream",
      size_bytes: stat.size,
      duration_seconds: Number(data.format?.duration || 0),
      codec_name: videoStream?.codec_name || null,
      width: videoStream?.width || null,
      height: videoStream?.height || null,
    };
  } catch (error) {
    return { exists: true, ok: false, issue: "ffprobe_json_parse_failed", size_bytes: stat.size, error: error.message };
  }
}

function expectedClipProbeRows(manifest) {
  return makeRows(manifest, (shot) => {
    const absolute = path.isAbsolute(shot.expected_clip)
      ? shot.expected_clip
      : path.join(root, shot.expected_clip || "");
    return { probe: probeVideoFile(absolute) };
  });
}

function clipProvenanceGateRows(manifest) {
  return makeRows(manifest, (shot) => {
    const absolute = path.isAbsolute(shot.expected_clip)
      ? shot.expected_clip
      : path.join(root, shot.expected_clip || "");
    const exists = fs.existsSync(absolute);
    const currentSha256 = exists ? sha256(absolute) : null;
    return {
      exists,
      current_sha256: currentSha256,
      provenance_source_type: exists ? "model_cli_execute" : null,
      provenance_sha256: currentSha256,
      provenance_created_at: exists ? `${date}T00:00:00.000Z` : null,
      provenance_source_sha256: null,
      problems: [],
      warnings: [],
    };
  });
}

function promptNoActive(prompt) {
  return prompt.match(/No-active-combat after this shot:\s*(.+?)(?:\.|\n|$)/)?.[1]?.trim() || "";
}

function battleLedgerRows(manifest, basePackageDir = packageDir) {
  return (manifest.shots || []).map((shot) => {
    const ledger = shot.battle_state_after?.battle_ledger_after || shot.battle_ledger_after || {};
    const modelPromptPath = shot.package_dir
      ? path.join(basePackageDir, shot.package_dir, "model_prompt.md")
      : null;
    const noActiveCombatLine = modelPromptPath ? promptNoActive(readText(modelPromptPath)) : "";
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      status: shot.status,
      visible_named_only: shot.visible_named_only || [],
      alive_by_house: ledger.alive_by_house || {},
      active_by_house: ledger.still_active_or_controlling_objective_by_house || {},
      limited_by_house: ledger.limited_but_not_defeated_by_house || {},
      defeated_removed_by_house: ledger.mock_battle_defeated_or_removed_by_house || {},
      captured_objective_defeated_by_house: ledger.captured_or_objective_defeated_by_house || {},
      stood_down_post_battle_by_house: ledger.stood_down_or_post_battle_by_house || {},
      must_not_return_active_by_house: ledger.must_not_return_active_by_house || {},
      changed_this_shot: ledger.changed_this_shot || [],
      all_named_characters_alive: ledger.all_named_characters_alive === true,
      no_active_combat_line: noActiveCombatLine || "none",
      package_dir: shot.package_dir,
    };
  });
}

function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}

function groupText(groups) {
  if (!groups || typeof groups !== "object") return "none";
  const rows = Object.entries(groups)
    .filter(([, names]) => Array.isArray(names) && names.length)
    .map(([group, names]) => `${group}: ${names.join(", ")}`);
  return rows.length ? rows.join("; ") : "none";
}

function changeText(changes) {
  const rows = Array.isArray(changes) ? changes : [];
  return rows.length
    ? rows.map((item) => `${item.name || item}:${item.status || item.label || "changed"}`).join("; ")
    : "none";
}

function unique(values) {
  return values.filter((value, index, all) => value && all.indexOf(value) === index);
}

const hardCapturedNoReadableReturn = new Set(["Hubert", "Dorothea", "Bernadetta"]);

function setFromGroups(groups) {
  return new Set(flattenGroups(groups));
}

function intersection(values, set) {
  return values.filter((value) => set.has(value));
}

function difference(setA, setB) {
  return [...setA].filter((value) => !setB.has(value));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function negativePrompt(prompt) {
  const match = prompt.match(/Negative Prompt:\s*([\s\S]*)$/);
  return match ? match[1] : "";
}

function hasReadableReturnConflict(name, prompt) {
  const negative = negativePrompt(prompt);
  return new RegExp(`\\bno\\s+readable\\s+(return\\s+of\\s+)?${escapeRegExp(name)}\\b`, "i").test(negative);
}

function hasNonActiveVisibleContext(name, prompt) {
  const haystack = String(prompt || "").toLowerCase();
  const lowerName = String(name || "").toLowerCase();
  if (!haystack.includes(lowerName)) return false;
  return [
    "stand down",
    "stands down",
    "stood down",
    "post-action",
    "post-battle",
    "combat over",
    "lowered",
    "lowers",
    "lower ",
    "concession",
    "defeated",
    "route block",
    "restrained respect",
    "dignified",
    "remain absent",
    "already captured",
    "not return active",
  ].some((token) => haystack.includes(token));
}

function battleLedgerStateMachineRows(manifest, basePackageDir = packageDir) {
  const shots = manifest.shots || [];
  const knownNames = new Set(flattenGroups(shots[0]?.battle_state_after?.battle_ledger_after?.alive_by_house || shots[0]?.battle_ledger_after?.alive_by_house || {}));
  let previousMustNotReturn = new Set();
  let previousCapturedObjectiveDefeated = new Set();
  return shots.map((shot) => {
    const ledger = shot.battle_state_after?.battle_ledger_after || shot.battle_ledger_after || {};
    const modelPromptPath = shot.package_dir ? path.join(basePackageDir, shot.package_dir, "model_prompt.md") : null;
    const modelPrompt = modelPromptPath ? readText(modelPromptPath) : "";
    const visible = shot.visible_named_only || [];
    const currentActive = setFromGroups(ledger.still_active_or_controlling_objective_by_house);
    const currentMustNotReturn = setFromGroups(ledger.must_not_return_active_by_house);
    const visibleUnknown = visible.filter((name) => !knownNames.has(name));
    const visiblePreviousMustNot = intersection(visible, previousMustNotReturn);
    const visiblePreviousCaptured = intersection(visible, previousCapturedObjectiveDefeated)
      .filter((name) => hardCapturedNoReadableReturn.has(name));
    const activePreviousMustNot = intersection([...currentActive], previousMustNotReturn);
    const activeCurrentMustNot = intersection([...currentActive], currentMustNotReturn);
    const missingStickyMustNot = difference(previousMustNotReturn, currentMustNotReturn);
    const visibleNonActiveContextMissing = visiblePreviousMustNot
      .filter((name) => !previousCapturedObjectiveDefeated.has(name))
      .filter((name) => !hasNonActiveVisibleContext(name, modelPrompt));
    const visibleNegativeConflicts = visiblePreviousMustNot
      .filter((name) => hasReadableReturnConflict(name, modelPrompt));
    const stateProblems = [];
    if (visibleUnknown.length) stateProblems.push(`visible roster contains non-ledger names: ${visibleUnknown.join(", ")}`);
    if (activePreviousMustNot.length) stateProblems.push(`previous must-not-return characters are active again: ${activePreviousMustNot.join(", ")}`);
    if (activeCurrentMustNot.length) stateProblems.push(`current active roster overlaps current must-not-return list: ${activeCurrentMustNot.join(", ")}`);
    if (missingStickyMustNot.length) stateProblems.push(`previous must-not-return characters dropped from current must-not-return list: ${missingStickyMustNot.join(", ")}`);
    if (visiblePreviousCaptured.length) stateProblems.push(`previously captured/objective-defeated characters reappear readable: ${visiblePreviousCaptured.join(", ")}`);
    if (visibleNonActiveContextMissing.length) stateProblems.push(`visible previously retired characters lack non-active/post-battle context: ${visibleNonActiveContextMissing.join(", ")}`);
    if (visibleNegativeConflicts.length) stateProblems.push(`negative prompt forbids readable return for visible retired characters: ${visibleNegativeConflicts.join(", ")}`);
    const row = {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      visible_named_only: visible,
      previous_must_not_return_active: [...previousMustNotReturn],
      previous_captured_objective_defeated: [...previousCapturedObjectiveDefeated],
      current_active_or_objective: [...currentActive],
      current_must_not_return_active: [...currentMustNotReturn],
      visible_previous_must_not_return: visiblePreviousMustNot,
      visible_previous_captured_objective_defeated: visiblePreviousCaptured,
      active_previous_must_not_return: activePreviousMustNot,
      active_current_must_not_return_overlap: activeCurrentMustNot,
      missing_sticky_must_not_return: missingStickyMustNot,
      visible_retired_context_missing: visibleNonActiveContextMissing,
      visible_negative_prompt_conflicts: visibleNegativeConflicts,
      state_machine_problems: stateProblems,
    };
    previousMustNotReturn = new Set([...previousMustNotReturn, ...currentMustNotReturn]);
    previousCapturedObjectiveDefeated = new Set([
      ...previousCapturedObjectiveDefeated,
      ...flattenGroups(ledger.captured_or_objective_defeated_by_house),
    ]);
    return row;
  });
}

function expectedSubmissionLedgerFields(battleState, ledger, visibleNamedOnly = []) {
  const noActive = unique([
    ...(Array.isArray(battleState.inactive_or_removed_after) ? battleState.inactive_or_removed_after : []),
    ...(Array.isArray(battleState.no_active_combat_after) ? battleState.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
  ]);
  const active = new Set(flattenGroups(ledger.still_active_or_controlling_objective_by_house || battleState.active_by_house));
  const visibleButNoActive = visibleNamedOnly.filter((name) => name && !active.has(name));
  return {
    alive_safe_after: groupText(ledger.alive_by_house || battleState.active_by_house),
    visible_but_no_active_combat_after: visibleButNoActive.length ? visibleButNoActive.join(", ") : "none",
    active_or_objective_after: groupText(ledger.still_active_or_controlling_objective_by_house || battleState.active_by_house),
    limited_after: groupText(ledger.limited_but_not_defeated_by_house),
    defeated_removed_after: groupText(ledger.mock_battle_defeated_or_removed_by_house || battleState.inactive_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_or_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_or_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: noActive.join(", ") || "none",
  };
}

function parseJsonlFile(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function submissionBattleLedgerRows(manifest, basePackageDir = packageDir) {
  const payloadRows = parseJsonlFile(path.join(basePackageDir, "submission_payload.jsonl"));
  const payloadByShot = new Map(payloadRows.map((row) => [row.shot, row]));
  return (manifest.shots || []).map((shot) => {
    const metadataPath = path.join(basePackageDir, shot.package_dir || "", "metadata.json");
    const metadata = fs.existsSync(metadataPath) ? readJson(metadataPath) : {};
    const payload = payloadByShot.get(shot.shot) || null;
    const battleState = metadata.battle_state_after || shot.battle_state_after || {};
    const ledger = battleState.battle_ledger_after || metadata.battle_ledger_after || shot.battle_ledger_after || {};
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      custom_id: `${String(shot.order).padStart(3, "0")}_${shot.shot}`,
      visible_named_only: shot.visible_named_only || [],
      expected_ledger_fields: expectedSubmissionLedgerFields(battleState, ledger, shot.visible_named_only || []),
      expected_battle_ledger_after: ledger,
      payload_ledger_fields: payload ? {
        alive_safe_after: payload.alive_safe_after || "",
        visible_but_no_active_combat_after: payload.visible_but_no_active_combat_after || "",
        active_or_objective_after: payload.active_or_objective_after || "",
        limited_after: payload.limited_after || "",
        defeated_removed_after: payload.defeated_removed_after || "",
        captured_objective_defeated_after: payload.captured_objective_defeated_after || "",
        stood_down_post_battle_after: payload.stood_down_post_battle_after || "",
        must_not_return_active_after: payload.must_not_return_active_after || "",
        changed_this_shot: payload.changed_this_shot || "",
        no_active_combat_line: payload.no_active_combat_line || "",
      } : null,
      payload_battle_ledger_after: payload?.battle_ledger_after || null,
      payload_battle_state_ledger_after: payload?.battle_state_after?.battle_ledger_after || null,
      metadata_battle_ledger_after: metadata.battle_state_after?.battle_ledger_after || metadata.battle_ledger_after || null,
      metadata_no_active_combat_after: metadata.battle_state_after?.no_active_combat_after || [],
    };
  });
}

function writeGeneratedClipProvenance(tmpPackageDir, manifest) {
  const rows = (manifest.shots || []).map((shot) => {
    const absolute = path.isAbsolute(shot.expected_clip)
      ? shot.expected_clip
      : path.join(root, shot.expected_clip || "");
    return {
      source_type: "model_cli_execute",
      expected_clip: shot.expected_clip,
      output_clip: shot.expected_clip,
      sha256: sha256(absolute),
      created_at: `${date}T00:00:00.000Z`,
      shot: shot.shot,
      id: shot.id,
    };
  });
  writeJson(path.join(tmpPackageDir, "generated_clip_provenance.json"), {
    version: 1,
    rows,
  });
}

function finalConcatInputSignatures(manifest) {
  const rows = [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const orderedClipText = rows
    .map((shot) => `${Number(shot.order)},${shot.shot},${shot.id},${Number(shot.duration_seconds || 0)},${shot.expected_clip}`)
    .join("\n") + "\n";
  const concatListText = rows
    .map((shot) => `file '${path.join(root, shot.expected_clip).replace(/'/g, "'\\''")}'`)
    .join("\n") + "\n";
  return {
    ordered_clip_signature_sha256: sha256Text(orderedClipText),
    concat_list_preview_sha256: sha256Text(concatListText),
    concat_list_preview: concatListText,
  };
}

function finalConcatBindingReport(manifest, expected) {
  const signatures = finalConcatInputSignatures(manifest);
  return {
    ok: true,
    input_contract: {
      file: "final_concat_inputs_contract.json",
      decision: "final_concat_inputs_contract_passed",
      ordered_clip_signature_sha256: signatures.ordered_clip_signature_sha256,
      concat_list_preview_sha256: signatures.concat_list_preview_sha256,
    },
    final_concat_gate: {
      file: "final_concat_gate.json",
      decision: "final_concat_gate_passed_ready_for_project_pipeline_concat",
      passed_checks: 8,
      total_checks: 8,
      direct_playable_clips: expected,
      direct_expected_clips: expected,
    },
    current_signatures: {
      ordered_clip_signature_sha256: signatures.ordered_clip_signature_sha256,
      concat_list_preview_sha256: signatures.concat_list_preview_sha256,
    },
    problems: [],
  };
}

function finalConcatSidecarReport(tmpFinalOutput, manifest) {
  const signatures = finalConcatInputSignatures(manifest);
  const sidecar = path.join(path.dirname(tmpFinalOutput), "scene09_v3_attrition_final_edit.concat.txt");
  writeText(sidecar, signatures.concat_list_preview);
  return {
    ok: true,
    file: rel(sidecar),
    file_absolute: sidecar,
    exists: true,
    size_bytes: Buffer.byteLength(signatures.concat_list_preview),
    sha256: signatures.concat_list_preview_sha256,
    expected_sha256: signatures.concat_list_preview_sha256,
    problems: [],
  };
}

function finalConcatProvenanceReport(tmpFinalOutput, manifest, finalConcatSidecar) {
  const clipRows = expectedClipFileRows(manifest);
  const provenance = {
    date: new Date().toISOString(),
    generated_by: "video_generation_run_positive_contract_fixture",
    mode: "fixture",
    final_output: rel(tmpFinalOutput),
    final_output_absolute: tmpFinalOutput,
    final_output_sha256: sha256(tmpFinalOutput),
    concat_list_sidecar: finalConcatSidecar.file,
    concat_list_sha256: finalConcatSidecar.sha256,
    expected_clip_file_rows: clipRows,
    expected_clip_file_rows_digest_sha256: sha256Text(`${JSON.stringify(clipRows)}\n`),
    ffmpeg_step: {
      label: "createFinalFixture",
      status: 0,
      ok: true,
    },
  };
  writeJson(path.join(path.dirname(tmpFinalOutput), "scene09_v3_attrition_final_edit.provenance.json"), provenance);
  return {
    ok: true,
    file: rel(path.join(path.dirname(tmpFinalOutput), "scene09_v3_attrition_final_edit.provenance.json")),
    file_absolute: path.join(path.dirname(tmpFinalOutput), "scene09_v3_attrition_final_edit.provenance.json"),
    exists: true,
    generated_by: provenance.generated_by,
    mode: provenance.mode,
    final_output_sha256: provenance.final_output_sha256,
    concat_list_sha256: provenance.concat_list_sha256,
    expected_clip_file_rows_digest_sha256: provenance.expected_clip_file_rows_digest_sha256,
    current_expected_clip_file_rows_digest_sha256: provenance.expected_clip_file_rows_digest_sha256,
    problems: [],
  };
}

function runCompletionAudit(packageDirArg, reportDirArg, finalOutputArg) {
  const result = cp.spawnSync(process.execPath, ["scripts/audit_scene09_v3_video_generation_run_completion.js"], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: packageDirArg,
      SCENE09_V3_REPORT_DIR: reportDirArg,
      SCENE09_V3_FINAL_OUTPUT: finalOutputArg,
    },
  });
  const parsed = parseLastJson(result.stdout);
  const reportPath = path.join(reportDirArg, "scene09_v3_video_generation_run_completion_audit_2026-08-01.json");
  return {
    result,
    parsed,
    report_path: reportPath,
    report: fs.existsSync(reportPath) ? readJson(reportPath) : null,
  };
}

function writeExecutionArtifacts(tmpPackageDir, finalOutput, manifest) {
  writeText(path.join(tmpPackageDir, "submission_queue.csv"), "order,shot,id,expected_clip\n");
  writeText(path.join(tmpPackageDir, "RUNBOOK.md"), "# Temporary Video Generation Run Positive Contract\n");
  writeText(path.join(tmpPackageDir, "execution_commands.sh"), "#!/bin/sh\n# temporary positive-contract fixture\n");
  writeJson(path.join(tmpPackageDir, "execution_plan.json"), {
    date,
    total_shots: manifest.shots.length,
    final_output: rel(finalOutput),
    work_orders: makeRows(manifest, () => ({ status: "ready" })),
  });
}

function writePositiveReports(tmpReportDir, tmpPackageDir, tmpFinalOutput, manifest, expected, expectedDuration) {
  const finalSha256 = sha256(tmpFinalOutput);
  const currentExpectedClipFileRows = expectedClipFileRows(manifest);
  const expectedClipFilesDigest = sha256Text(`${JSON.stringify(currentExpectedClipFileRows)}\n`);
  const currentExpectedClipProbeRows = expectedClipProbeRows(manifest);
  const expectedClipProbeDigest = sha256Text(`${JSON.stringify(currentExpectedClipProbeRows)}\n`);
  const playableExpectedClips = currentExpectedClipProbeRows.filter((row) => row.probe.ok).length;
  const currentClipProvenanceRows = clipProvenanceGateRows(manifest);
  const clipProvenanceRowsDigest = sha256Text(`${JSON.stringify(currentClipProvenanceRows)}\n`);
  const currentBattleLedgerRows = battleLedgerRows(manifest, tmpPackageDir);
  const battleLedgerRowsDigest = sha256Text(`${JSON.stringify(currentBattleLedgerRows)}\n`);
  const currentBattleLedgerStateMachineRows = battleLedgerStateMachineRows(manifest, tmpPackageDir);
  const battleLedgerStateMachineRowsDigest = sha256Text(`${JSON.stringify(currentBattleLedgerStateMachineRows)}\n`);
  const currentSubmissionBattleLedgerRows = submissionBattleLedgerRows(manifest, tmpPackageDir);
  const submissionBattleLedgerRowsDigest = sha256Text(`${JSON.stringify(currentSubmissionBattleLedgerRows)}\n`);
  const finalConcatSignatures = finalConcatInputSignatures(manifest);
  const finalConcatBinding = finalConcatBindingReport(manifest, expected);
  const finalConcatSidecar = finalConcatSidecarReport(tmpFinalOutput, manifest);
  const finalConcatProvenance = finalConcatProvenanceReport(tmpFinalOutput, manifest, finalConcatSidecar);
  writeJson(path.join(tmpReportDir, "scene09_v3_generated_clip_structural_audit_2026-08-01.json"), {
    decision: "clip_files_integrity_passed_motion_review_still_required",
    expected_clips: expected,
    ready_clips: expected,
    missing_clips: 0,
    failed_clips: 0,
    expected_clip_files_digest_sha256: expectedClipFilesDigest,
    expected_clip_file_rows: currentExpectedClipFileRows,
    expected_clip_video_probe_digest_sha256: expectedClipProbeDigest,
    expected_clip_video_probe_rows: currentExpectedClipProbeRows,
    expected_clip_video_probe_playable: playableExpectedClips,
    rows: makeRows(manifest, () => ({ clip: { exists: true, ok: true, issue: null } })),
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_actual_delivery_surface_audit_2026-08-01.json"), {
    decision: "actual_delivery_surface_passed",
    problems: [],
    evidence: ["temporary positive fixture preserves current delivery-surface gate"],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_current_hanneman_contract_2026-08-01.json"), {
    decision: "current_hanneman_contract_passed",
    shot: "Shot034B",
    title: "空教师目标裁定",
    visible_named_only: ["Byleth", "Dimitri"],
    problems: [],
    warnings: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_current_status_consistency_gate_2026-08-01.json"), {
    decision: "current_status_consistency_passed",
    problems: [],
    warnings: [],
    authoritative_evidence: {
      video_generation_run_completion: {
        decision: "video_generation_run_complete",
        passed_checks: 28,
        total_checks: 28,
      },
    },
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_provider_preflight_consistency_gate_2026-08-01.json"), {
    decision: "provider_preflight_consistency_passed",
    can_submit_to_provider: true,
    computed_can_submit_to_provider: true,
    expected_shots: expected,
    problems: [],
    warnings: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json"), {
    decision: "clip_motion_review_assets_ready_for_self_audit",
    expected_clips: expected,
    extracted_clips: expected,
    missing_clips: 0,
    failed_clips: 0,
    rows: makeRows(manifest, () => ({ status: "review_frames_ready", review_frames: { start: "fixture/start.jpg", mid: "fixture/mid.jpg", end: "fixture/end.jpg" } })),
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.json"), {
    decision: "motion_review_passed_ready_for_concat",
    summary: {
      expected_clips: expected,
      clip_exists: expected,
      pending_clip: 0,
      needs_codex_motion_review: 0,
      motion_review_passed: expected,
      blocked_or_rejected: 0,
    },
    rows: makeRows(manifest, () => ({ decision: "motion_review_passed", checks: [] })),
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_clip_revision_queue_2026-07-28.json"), {
    decision: "clip_revision_queue_clear_ready_for_concat",
    total_shots: expected,
    actionable_shots: 0,
    counts: { ready_for_concat: expected },
    rows: makeRows(manifest, () => ({ queue_status: "ready_for_concat" })),
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_motion_self_audit_packet_audit_2026-08-01.json"), {
    decision: "motion_self_audit_packet_ready",
    rows_checked: expected,
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_motion_self_audit_evidence_contract_2026-08-01.json"), {
    decision: "motion_self_audit_evidence_contract_passed",
    expected_rows: expected,
    template_rows: expected,
    rows_with_review_frame_signature_keys: expected,
    problems: [],
    warnings: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_motion_self_audit_unsigned_evidence_rejection_2026-08-01.json"), {
    decision: "motion_self_audit_unsigned_evidence_rejection_passed",
    expected_rows: expected,
    probe: { frame_signature_rejections: expected * 3, clip_signature_rejections: expected },
    reports_restored_to_default_proposal: true,
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_motion_self_audit_apply_positive_contract_2026-08-01.json"), {
    decision: "motion_self_audit_apply_positive_contract_passed",
    expected_shots: expected,
    apply_gate: {
      proposal_rows: expected,
      applied: true,
      motion_review_passed: expected,
      blocked_or_rejected: 0,
      evidence_counters: {
        clip_signature_matched_rows: expected,
        review_frame_signature_matched_rows: expected,
        review_evidence_complete_rows: expected,
        ledger_matched_rows: expected,
        required_checks_complete_rows: expected,
      },
      battle_ledger_signature: {
        rows_digest_sha256: battleLedgerRowsDigest,
        current_rows_digest_sha256: battleLedgerRowsDigest,
        rows_digest_ok: true,
        rows: currentBattleLedgerRows,
        state_machine_rows_digest_sha256: battleLedgerStateMachineRowsDigest,
        current_state_machine_rows_digest_sha256: battleLedgerStateMachineRowsDigest,
        state_machine_rows_digest_ok: true,
        state_machine_rows: currentBattleLedgerStateMachineRows,
      },
    },
    stale_battle_ledger_digest_rejection: {
      rejected: true,
      issue: "battle_ledger_rows_digest_mismatch",
    },
    stale_active_return_state_machine_digest_rejection: {
      rejected: true,
      issue: "battle_ledger_state_machine_digest_mismatch",
    },
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_motion_self_audit_apply_gate_2026-08-01.json"), {
    decision: "motion_self_audit_apply_passed",
    applied: true,
    proposal_rows: expected,
    summary: { motion_review_passed: expected, blocked_or_rejected: 0 },
    evidence_counters: {
      clip_signature_matched_rows: expected,
      review_frame_signature_matched_rows: expected,
      review_evidence_complete_rows: expected,
      ledger_matched_rows: expected,
      required_checks_complete_rows: expected,
    },
    battle_ledger_signature: {
      rows_digest_sha256: battleLedgerRowsDigest,
      current_rows_digest_sha256: battleLedgerRowsDigest,
      rows_digest_ok: true,
      rows: currentBattleLedgerRows,
      state_machine_rows_digest_sha256: battleLedgerStateMachineRowsDigest,
      current_state_machine_rows_digest_sha256: battleLedgerStateMachineRowsDigest,
      state_machine_rows_digest_ok: true,
      state_machine_rows: currentBattleLedgerStateMachineRows,
    },
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_full_duration_release_gate_2026-08-01.json"), {
    decision: "full_duration_release_passed",
    can_release_full_duration: true,
    expected_probe_clips: expected,
    playable_probe_clips: expected,
    review_frame_sets_ready: expected,
    full_duration_approvals: expected,
    release: {
      exists: true,
      rows_digest_ok: true,
      rows_digest_sha256: battleLedgerRowsDigest,
    },
    blocking_items: [],
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_after_clip_return_resume_positive_contract_2026-08-01.json"), {
    decision: "after_clip_return_resume_positive_contract_passed",
    expected_shots: expected,
    ingest_resume: {
      decision: "after_clip_return_codex_motion_self_audit_required",
      clips_ready: expected,
      motion_frames: expected,
    },
    apply_resume: {
      decision: "after_clip_return_ready_for_concat",
      clips_ready: expected,
      motion_frames: expected,
      final_concat_gate: "final_concat_gate_passed_ready_for_project_pipeline_concat",
      revision_queue_actionable: 0,
    },
    production_existed_before: false,
    production_exists_after: false,
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_final_concat_positive_contract_2026-08-01.json"), {
    decision: "final_concat_positive_contract_passed",
    expected_shots: expected,
    gate_result: {
      decision: "final_concat_gate_passed_ready_for_project_pipeline_concat",
      passed_checks: 8,
      total_checks: 8,
    },
    direct_expected_clip_probe: {
      playable_clips: playableExpectedClips,
      expected_clips: expected,
      rows: currentExpectedClipProbeRows,
    },
    tampered_input_contract_rejection: {
      rejected: true,
      issue: "final_concat_inputs_contract_signature_mismatch",
      failed_checks: ["final_concat_inputs_contract"],
      gate_result: {
        decision: "final_concat_blocked_motion_or_revision_gate",
        failed_checks: ["final_concat_inputs_contract"],
        direct_expected_clip_probe: {
          playable_clips: playableExpectedClips,
          expected_clips: expected,
        },
      },
    },
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_clip_return_intake_audit_2026-08-01.json"), {
    decision: "clip_return_intake_ready",
    batches_checked: 7,
    expected_clip_rows: expected,
    unique_custom_ids: expected,
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_clip_return_roundtrip_audit_2026-08-01.json"), {
    decision: "clip_return_roundtrip_passed",
    scenarios: [
      { strategy: "expected_filename", unique_matched_shots: expected, would_copy: expected, problems: [] },
      { strategy: "custom_id_prefix", unique_matched_shots: expected, would_copy: expected, problems: [] },
      { strategy: "loose_shot_name_rejected", unique_matched_shots: 0, would_copy: 0, problems: [] },
      { strategy: "invalid_mp4_rejected", decision: "clip_ingest_needs_filename_resolution", unique_matched_shots: 0, would_copy: 0, invalid_video_files: 1, problems: [] },
    ],
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_model_cli_execution_provenance_audit_2026-08-01.json"), {
    decision: "model_cli_execution_provenance_passed",
    expected_shots: expected,
    provenance: { rows_checked: expected, unique_expected_clips: expected },
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_clip_provenance_gate_2026-08-01.json"), {
    decision: "clip_provenance_passed_all_expected_clips",
    expected_clips: expected,
    existing_clips: expected,
    missing_clips: 0,
    provenance_rows: expected,
    provenance_matched_existing_clips: expected,
    rows_digest_sha256: clipProvenanceRowsDigest,
    rows: currentClipProvenanceRows,
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_submission_contract_gate_2026-08-01.json"), {
    decision: "submission_contract_gate_passed",
    expected_shots: expected,
    rows_checked: expected,
    execution_plan_rows: expected,
    submission_queue_rows: expected,
    submission_payload_rows: expected,
    submission_battle_ledger_rows_digest_sha256: submissionBattleLedgerRowsDigest,
    submission_battle_ledger_rows: currentSubmissionBattleLedgerRows,
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_provider_submission_freshness_gate_2026-08-01.json"), {
    decision: "provider_submission_freshness_passed",
    expected_shots: expected,
    model_submission_batch_rows: expected,
    provider_bundle_rows: expected,
    problems: [],
    warnings: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_positive_contract_isolation_gate_2026-08-01.json"), {
    decision: "positive_contract_isolation_passed",
    expected_shots: expected,
    production_expected_clips_existing: 0,
    production_final_output_exists: false,
    contracts_checked: 6,
    problems: [],
    warnings: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_production_delivery_truth_gate_2026-08-01.json"), {
    decision: "production_delivery_truth_passed",
    highest_truthful_target: "video_generation_run",
    can_claim_video_generation_run: true,
    can_claim_final_edit: true,
    expected_shots: expected,
    real_evidence: {
      expected_clip_files_existing: expected,
      expected_clip_files_required: expected,
      structurally_ready_clips: expected,
      motion_review_frame_sets: expected,
      codex_motion_review_passed: expected,
      provenance_existing_clips: expected,
      provenance_rows: expected,
      expected_clip_file_rows: currentExpectedClipFileRows,
      expected_clip_files_digest_sha256: expectedClipFilesDigest,
      expected_clip_video_probe_rows: currentExpectedClipProbeRows,
      expected_clip_video_probe_digest_sha256: expectedClipProbeDigest,
      expected_clip_video_probe_playable: playableExpectedClips,
      expected_clip_video_probe_required: expected,
      final_output: rel(tmpFinalOutput),
      final_output_exists: true,
      final_edit_structural_ok: true,
      final_edit_concat_binding_ok: true,
      final_edit_concat_sidecar_ok: true,
      final_edit_concat_provenance_ok: true,
      final_edit_concat_sidecar: finalConcatSidecar.file,
      final_edit_concat_sidecar_sha256: finalConcatSidecar.sha256,
      final_edit_concat_provenance: finalConcatProvenance.file,
      final_edit_concat_provenance_digest_sha256: finalConcatProvenance.expected_clip_file_rows_digest_sha256,
      final_edit_structural_sha256: finalSha256,
      final_edit_structural_report_output: rel(tmpFinalOutput),
    },
    blocking_items: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_report_freshness_gate_2026-08-01.json"), {
    decision: "report_freshness_passed_current_manifest",
    reports_checked: 36,
    problems: [],
    warnings: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_proxy_misuse_gate_2026-08-01.json"), {
    decision: "proxy_isolation_passed_expected_clips_present",
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_final_concat_gate_2026-08-01.json"), {
    decision: "final_concat_gate_passed_ready_for_project_pipeline_concat",
    passed_checks: 8,
    total_checks: 8,
    failed_checks: [],
    final_output_exists: false,
    direct_expected_clip_probe: {
      playable_clips: expected,
      expected_clips: expected,
      rows: currentExpectedClipProbeRows,
    },
    current_final_concat_input_signatures: {
      ordered_clip_signature_sha256: finalConcatSignatures.ordered_clip_signature_sha256,
      concat_list_preview_sha256: finalConcatSignatures.concat_list_preview_sha256,
    },
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_final_edit_positive_contract_2026-08-01.json"), {
    decision: "final_edit_positive_contract_passed",
    expected_shots: expected,
    expected_duration_seconds: expectedDuration,
    structural_result: {
      decision: "final_edit_structural_passed",
      final_output: rel(tmpFinalOutput),
      final_output_absolute: tmpFinalOutput,
      final_edit: { exists: true, ok: true, sha256: finalSha256 },
      final_concat_binding: finalConcatBinding,
      final_concat_sidecar: finalConcatSidecar,
      final_concat_provenance: finalConcatProvenance,
    },
    wrong_duration_rejection: {
      rejected: true,
      issue: "duration_out_of_tolerance",
      structural_result: {
        decision: "final_edit_structural_blocked",
        final_edit: { exists: true, ok: false, issue: "duration_out_of_tolerance" },
        final_concat_binding: finalConcatBinding,
        final_concat_sidecar: finalConcatSidecar,
        final_concat_provenance: finalConcatProvenance,
      },
    },
    tampered_provenance_rejection: {
      rejected: true,
      issue: "final_output_sha256_mismatch",
      structural_result: {
        decision: "final_edit_structural_blocked",
        final_edit: { exists: true, ok: true, issue: null },
        final_concat_binding: finalConcatBinding,
        final_concat_sidecar: finalConcatSidecar,
        final_concat_provenance: {
          ...finalConcatProvenance,
          ok: false,
          problems: ["final_output_sha256 does not match audited final mp4 SHA-256"],
        },
      },
    },
    production_existed_before: false,
    production_exists_after: false,
    problems: [],
  });
  writeJson(path.join(tmpReportDir, "scene09_v3_final_edit_structural_audit_2026-08-01.json"), {
    decision: "final_edit_structural_passed",
    final_output: rel(tmpFinalOutput),
    final_output_absolute: tmpFinalOutput,
    expected_duration_seconds: expectedDuration,
    final_edit: {
      exists: true,
      ok: true,
      issue: null,
      sha256: finalSha256,
      duration_seconds: expectedDuration,
      expected_duration_seconds: expectedDuration,
      duration_delta_seconds: 0,
      video_codec: "h264",
      width: 160,
      height: 90,
    },
    final_concat_binding: finalConcatBinding,
    final_concat_sidecar: finalConcatSidecar,
    final_concat_provenance: finalConcatProvenance,
  });
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const sourceManifest = readJson(manifestPath);
  const expected = Number(sourceManifest.total_shots || (sourceManifest.shots || []).length || 42);
  const expectedDuration = Number(sourceManifest.total_duration_seconds || 252);
  const productionExistedBefore = fs.existsSync(productionFinalOutput);
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09-v3-run-positive-"));
  const tmpPackageDir = path.join(tmpRoot, "package");
  const tmpReportDir = path.join(tmpRoot, "reports");
  const tmpFinalOutput = path.join(tmpRoot, "final", "scene09_v3_attrition_final_edit.mp4");
  fs.cpSync(packageDir, tmpPackageDir, { recursive: true });
  fs.mkdirSync(tmpReportDir, { recursive: true });

  const fixtureShots = createExpectedClipFixtures(tmpRoot, sourceManifest);
  const fixtureManifest = {
    ...sourceManifest,
    package_id: `${sourceManifest.package_id}_video_generation_run_positive_contract_fixture`,
    source_manifest: rel(manifestPath),
    shots: fixtureShots,
    total_shots: expected,
    total_duration_seconds: expectedDuration,
  };
  writeJson(path.join(tmpPackageDir, "package_manifest.json"), fixtureManifest);
  writeGeneratedClipProvenance(tmpPackageDir, fixtureManifest);
  writeExecutionArtifacts(tmpPackageDir, tmpFinalOutput, fixtureManifest);
  createFinalFixture(tmpFinalOutput, expectedDuration);
  writePositiveReports(tmpReportDir, tmpPackageDir, tmpFinalOutput, fixtureManifest, expected, expectedDuration);

  const completionRun = runCompletionAudit(tmpPackageDir, tmpReportDir, tmpFinalOutput);
  const result = completionRun.result;
  const parsed = completionRun.parsed;
  const completionReport = completionRun.report;

  const staleConcatReportDir = path.join(tmpRoot, "reports_stale_concat_7_of_7");
  fs.cpSync(tmpReportDir, staleConcatReportDir, { recursive: true });
  writeJson(path.join(staleConcatReportDir, "scene09_v3_final_concat_positive_contract_2026-08-01.json"), {
    decision: "final_concat_positive_contract_passed",
    expected_shots: expected,
    gate_result: {
      decision: "final_concat_gate_passed_ready_for_project_pipeline_concat",
      passed_checks: 7,
      total_checks: 7,
    },
    direct_expected_clip_probe: {
      playable_clips: expected,
      expected_clips: expected,
      rows: [],
    },
    problems: [],
  });
  writeJson(path.join(staleConcatReportDir, "scene09_v3_final_concat_gate_2026-08-01.json"), {
    decision: "final_concat_gate_passed_ready_for_project_pipeline_concat",
    passed_checks: 7,
    total_checks: 7,
    failed_checks: [],
    final_output_exists: false,
  });
  const staleConcatRun = runCompletionAudit(tmpPackageDir, staleConcatReportDir, tmpFinalOutput);
  const staleConcatReport = staleConcatRun.report;
  const staleStructuralReportDir = path.join(tmpRoot, "reports_stale_structural_digest");
  fs.cpSync(tmpReportDir, staleStructuralReportDir, { recursive: true });
  const staleStructuralPath = path.join(staleStructuralReportDir, "scene09_v3_generated_clip_structural_audit_2026-08-01.json");
  const staleStructuralAudit = readJson(staleStructuralPath);
  writeJson(staleStructuralPath, {
    ...staleStructuralAudit,
    expected_clip_files_digest_sha256: "0".repeat(64),
    expected_clip_video_probe_digest_sha256: "0".repeat(64),
  });
  const staleStructuralRun = runCompletionAudit(tmpPackageDir, staleStructuralReportDir, tmpFinalOutput);
  const staleStructuralReport = staleStructuralRun.report;
  const staleProvenanceReportDir = path.join(tmpRoot, "reports_stale_provenance_digest");
  fs.cpSync(tmpReportDir, staleProvenanceReportDir, { recursive: true });
  const staleProvenancePath = path.join(staleProvenanceReportDir, "scene09_v3_clip_provenance_gate_2026-08-01.json");
  const staleProvenanceGate = readJson(staleProvenancePath);
  writeJson(staleProvenancePath, {
    ...staleProvenanceGate,
    rows_digest_sha256: "0".repeat(64),
  });
  const staleProvenanceRun = runCompletionAudit(tmpPackageDir, staleProvenanceReportDir, tmpFinalOutput);
  const staleProvenanceReport = staleProvenanceRun.report;
  const staleBattleLedgerReportDir = path.join(tmpRoot, "reports_stale_battle_ledger_digest");
  fs.cpSync(tmpReportDir, staleBattleLedgerReportDir, { recursive: true });
  const staleBattleLedgerPath = path.join(staleBattleLedgerReportDir, "scene09_v3_motion_self_audit_apply_gate_2026-08-01.json");
  const staleBattleLedgerApplyGate = readJson(staleBattleLedgerPath);
  writeJson(staleBattleLedgerPath, {
    ...staleBattleLedgerApplyGate,
    battle_ledger_signature: {
      ...(staleBattleLedgerApplyGate.battle_ledger_signature || {}),
      rows_digest_sha256: "0".repeat(64),
    },
  });
  const staleBattleLedgerRun = runCompletionAudit(tmpPackageDir, staleBattleLedgerReportDir, tmpFinalOutput);
  const staleBattleLedgerReport = staleBattleLedgerRun.report;
  const staleStateMachineReportDir = path.join(tmpRoot, "reports_stale_active_return_state_machine_digest");
  fs.cpSync(tmpReportDir, staleStateMachineReportDir, { recursive: true });
  const staleStateMachinePath = path.join(staleStateMachineReportDir, "scene09_v3_motion_self_audit_apply_gate_2026-08-01.json");
  const staleStateMachineApplyGate = readJson(staleStateMachinePath);
  writeJson(staleStateMachinePath, {
    ...staleStateMachineApplyGate,
    battle_ledger_signature: {
      ...(staleStateMachineApplyGate.battle_ledger_signature || {}),
      state_machine_rows_digest_sha256: "0".repeat(64),
    },
  });
  const staleStateMachineRun = runCompletionAudit(tmpPackageDir, staleStateMachineReportDir, tmpFinalOutput);
  const staleStateMachineReport = staleStateMachineRun.report;
  const staleSubmissionLedgerReportDir = path.join(tmpRoot, "reports_stale_submission_ledger_digest");
  fs.cpSync(tmpReportDir, staleSubmissionLedgerReportDir, { recursive: true });
  const staleSubmissionLedgerPath = path.join(staleSubmissionLedgerReportDir, "scene09_v3_submission_contract_gate_2026-08-01.json");
  const staleSubmissionLedgerGate = readJson(staleSubmissionLedgerPath);
  writeJson(staleSubmissionLedgerPath, {
    ...staleSubmissionLedgerGate,
    submission_battle_ledger_rows_digest_sha256: "0".repeat(64),
  });
  const staleSubmissionLedgerRun = runCompletionAudit(tmpPackageDir, staleSubmissionLedgerReportDir, tmpFinalOutput);
  const staleSubmissionLedgerReport = staleSubmissionLedgerRun.report;
  const productionExistsAfter = fs.existsSync(productionFinalOutput);
  const problems = [];
  if (result.error) problems.push(result.error.message);
  if (result.status !== 0) problems.push(`completion audit exited ${result.status}: ${(result.stderr || "").trim()}`);
  if (!parsed) problems.push("could not parse completion audit stdout JSON");
  if (!completionReport) problems.push("temporary completion report was not written");
  if (completionReport && completionReport.decision !== "video_generation_run_complete") {
    problems.push(`completion decision ${completionReport.decision || "missing"}`);
  }
  if (completionReport && Number(completionReport.passed_checks || 0) !== Number(completionReport.total_checks || -1)) {
    problems.push(`completion checks ${completionReport.passed_checks || 0}/${completionReport.total_checks || 0}`);
  }
  if (completionReport && completionReport.highest_completed_target !== "video_generation_run") {
    problems.push(`highest completed target ${completionReport.highest_completed_target || "missing"}`);
  }
  if (!staleConcatRun.parsed) problems.push("could not parse stale 7/7 concat rejection stdout JSON");
  if (!staleConcatReport) problems.push("stale 7/7 concat rejection report was not written");
  if (staleConcatReport && staleConcatReport.decision === "video_generation_run_complete") {
    problems.push("stale 7/7 concat reports were accepted as a complete video generation run");
  }
  if (staleConcatReport && !Array.isArray(staleConcatReport.failed_checks)) {
    problems.push("stale 7/7 concat rejection report missing failed_checks");
  }
  if (staleConcatReport && !staleConcatReport.failed_checks?.includes("final_concat_positive_contract_passed")) {
    problems.push("stale 7/7 concat positive contract was not rejected");
  }
  if (staleConcatReport && !staleConcatReport.failed_checks?.includes("final_concat_gate_passed")) {
    problems.push("stale 7/7 final concat gate was not rejected");
  }
  if (!staleStructuralRun.parsed) problems.push("could not parse stale structural digest rejection stdout JSON");
  if (!staleStructuralReport) problems.push("stale structural digest rejection report was not written");
  if (staleStructuralReport && staleStructuralReport.decision === "video_generation_run_complete") {
    problems.push("stale structural clip digest report was accepted as a complete video generation run");
  }
  if (staleStructuralReport && !Array.isArray(staleStructuralReport.failed_checks)) {
    problems.push("stale structural digest rejection report missing failed_checks");
  }
  if (staleStructuralReport && !staleStructuralReport.failed_checks?.includes("all_expected_clips_structural_pass")) {
    problems.push("stale structural digest rejection did not fail all_expected_clips_structural_pass");
  }
  if (!staleProvenanceRun.parsed) problems.push("could not parse stale provenance digest rejection stdout JSON");
  if (!staleProvenanceReport) problems.push("stale provenance digest rejection report was not written");
  if (staleProvenanceReport && staleProvenanceReport.decision === "video_generation_run_complete") {
    problems.push("stale provenance digest report was accepted as a complete video generation run");
  }
  if (staleProvenanceReport && !Array.isArray(staleProvenanceReport.failed_checks)) {
    problems.push("stale provenance digest rejection report missing failed_checks");
  }
  if (staleProvenanceReport && !staleProvenanceReport.failed_checks?.includes("clip_provenance_gate_passed")) {
    problems.push("stale provenance digest rejection did not fail clip_provenance_gate_passed");
  }
  if (!staleBattleLedgerRun.parsed) problems.push("could not parse stale battle ledger digest rejection stdout JSON");
  if (!staleBattleLedgerReport) problems.push("stale battle ledger digest rejection report was not written");
  if (staleBattleLedgerReport && staleBattleLedgerReport.decision === "video_generation_run_complete") {
    problems.push("stale battle ledger digest report was accepted as a complete video generation run");
  }
  if (staleBattleLedgerReport && !Array.isArray(staleBattleLedgerReport.failed_checks)) {
    problems.push("stale battle ledger digest rejection report missing failed_checks");
  }
  if (staleBattleLedgerReport && !staleBattleLedgerReport.failed_checks?.includes("motion_self_audit_apply_gate_passed")) {
    problems.push("stale battle ledger digest rejection did not fail motion_self_audit_apply_gate_passed");
  }
  if (!staleStateMachineRun.parsed) problems.push("could not parse stale active-return state-machine digest rejection stdout JSON");
  if (!staleStateMachineReport) problems.push("stale active-return state-machine digest rejection report was not written");
  if (staleStateMachineReport && staleStateMachineReport.decision === "video_generation_run_complete") {
    problems.push("stale active-return state-machine digest report was accepted as a complete video generation run");
  }
  if (staleStateMachineReport && !Array.isArray(staleStateMachineReport.failed_checks)) {
    problems.push("stale active-return state-machine digest rejection report missing failed_checks");
  }
  if (staleStateMachineReport && !staleStateMachineReport.failed_checks?.includes("motion_self_audit_apply_gate_passed")) {
    problems.push("stale active-return state-machine digest rejection did not fail motion_self_audit_apply_gate_passed");
  }
  if (!staleSubmissionLedgerRun.parsed) problems.push("could not parse stale submission ledger digest rejection stdout JSON");
  if (!staleSubmissionLedgerReport) problems.push("stale submission ledger digest rejection report was not written");
  if (staleSubmissionLedgerReport && staleSubmissionLedgerReport.decision === "video_generation_run_complete") {
    problems.push("stale submission ledger digest report was accepted as a complete video generation run");
  }
  if (staleSubmissionLedgerReport && !Array.isArray(staleSubmissionLedgerReport.failed_checks)) {
    problems.push("stale submission ledger digest rejection report missing failed_checks");
  }
  if (staleSubmissionLedgerReport && !staleSubmissionLedgerReport.failed_checks?.includes("submission_contract_gate_passed")) {
    problems.push("stale submission ledger digest rejection did not fail submission_contract_gate_passed");
  }
  if (productionExistedBefore !== productionExistsAfter) {
    problems.push("production final output existence changed during positive contract");
  }

  const decision = problems.length
    ? "video_generation_run_positive_contract_failed"
    : "video_generation_run_positive_contract_passed";
  const report = {
    date,
    decision,
    expected_shots: expected,
    expected_duration_seconds: expectedDuration,
    scope: "temporary full-upstream fixture; no production clips, production motion approvals, or production final edit are written",
    fixture_package_dir: tmpPackageDir,
    fixture_report_dir: tmpReportDir,
    fixture_final_output: tmpFinalOutput,
    production_final_output: rel(productionFinalOutput),
    production_existed_before: productionExistedBefore,
    production_exists_after: productionExistsAfter,
    completion_stdout: result.stdout,
    completion_stderr: result.stderr,
    completion_result: completionReport,
    stdout_result: parsed,
    stale_concat_7_of_7_rejection: {
      fixture_report_dir: staleConcatReportDir,
      completion_stdout: staleConcatRun.result.stdout,
      completion_stderr: staleConcatRun.result.stderr,
      completion_result: staleConcatReport,
      rejected: Boolean(staleConcatReport && staleConcatReport.decision !== "video_generation_run_complete"),
    },
    stale_structural_digest_rejection: {
      fixture_report_dir: staleStructuralReportDir,
      completion_stdout: staleStructuralRun.result.stdout,
      completion_stderr: staleStructuralRun.result.stderr,
      completion_result: staleStructuralReport,
      rejected: Boolean(staleStructuralReport && staleStructuralReport.decision !== "video_generation_run_complete"),
    },
    stale_provenance_digest_rejection: {
      fixture_report_dir: staleProvenanceReportDir,
      completion_stdout: staleProvenanceRun.result.stdout,
      completion_stderr: staleProvenanceRun.result.stderr,
      completion_result: staleProvenanceReport,
      rejected: Boolean(staleProvenanceReport && staleProvenanceReport.decision !== "video_generation_run_complete"),
    },
    stale_battle_ledger_digest_rejection: {
      fixture_report_dir: staleBattleLedgerReportDir,
      completion_stdout: staleBattleLedgerRun.result.stdout,
      completion_stderr: staleBattleLedgerRun.result.stderr,
      completion_result: staleBattleLedgerReport,
      rejected: Boolean(staleBattleLedgerReport && staleBattleLedgerReport.decision !== "video_generation_run_complete"),
    },
    stale_active_return_state_machine_digest_rejection: {
      fixture_report_dir: staleStateMachineReportDir,
      completion_stdout: staleStateMachineRun.result.stdout,
      completion_stderr: staleStateMachineRun.result.stderr,
      completion_result: staleStateMachineReport,
      rejected: Boolean(staleStateMachineReport && staleStateMachineReport.decision !== "video_generation_run_complete"),
    },
    stale_submission_ledger_digest_rejection: {
      fixture_report_dir: staleSubmissionLedgerReportDir,
      completion_stdout: staleSubmissionLedgerRun.result.stdout,
      completion_stderr: staleSubmissionLedgerRun.result.stderr,
      completion_result: staleSubmissionLedgerReport,
      rejected: Boolean(staleSubmissionLedgerReport && staleSubmissionLedgerReport.decision !== "video_generation_run_complete"),
    },
    problems,
  };
  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Video Generation Run Positive Contract",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Expected shots: ${expected}`,
    `Expected duration: ${expectedDuration}s`,
    "",
    "This is a temporary full-upstream contract test. It proves the real video generation run completion audit reaches `video_generation_run_complete` when clip, motion-review, provenance, concat, and final-edit evidence are complete. It does not write production clips, production motion approvals, or a production final edit.",
    "",
    "## Completion Result",
    "",
    completionReport ? `- Decision: ${completionReport.decision}` : "- Decision: missing",
    completionReport ? `- Highest completed target: ${completionReport.highest_completed_target}` : "- Highest completed target: missing",
    completionReport ? `- Checks: ${completionReport.passed_checks}/${completionReport.total_checks}` : "- Checks: missing",
    staleConcatReport ? `- Stale concat 7/7 rejection: ${staleConcatReport.decision}; failed ${(staleConcatReport.failed_checks || []).join(", ") || "none"}` : "- Stale concat 7/7 rejection: missing",
    staleStructuralReport ? `- Stale structural digest rejection: ${staleStructuralReport.decision}; failed ${(staleStructuralReport.failed_checks || []).join(", ") || "none"}` : "- Stale structural digest rejection: missing",
    staleProvenanceReport ? `- Stale provenance digest rejection: ${staleProvenanceReport.decision}; failed ${(staleProvenanceReport.failed_checks || []).join(", ") || "none"}` : "- Stale provenance digest rejection: missing",
    staleBattleLedgerReport ? `- Stale battle ledger digest rejection: ${staleBattleLedgerReport.decision}; failed ${(staleBattleLedgerReport.failed_checks || []).join(", ") || "none"}` : "- Stale battle ledger digest rejection: missing",
    staleStateMachineReport ? `- Stale active-return state-machine digest rejection: ${staleStateMachineReport.decision}; failed ${(staleStateMachineReport.failed_checks || []).join(", ") || "none"}` : "- Stale active-return state-machine digest rejection: missing",
    staleSubmissionLedgerReport ? `- Stale submission ledger digest rejection: ${staleSubmissionLedgerReport.decision}; failed ${(staleSubmissionLedgerReport.failed_checks || []).join(", ") || "none"}` : "- Stale submission ledger digest rejection: missing",
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  process.stdout.write(`${JSON.stringify({
    decision,
    expected_shots: expected,
    expected_duration_seconds: expectedDuration,
    completion_decision: completionReport?.decision || null,
    completion_checks: completionReport ? `${completionReport.passed_checks}/${completionReport.total_checks}` : null,
    highest_completed_target: completionReport?.highest_completed_target || null,
    stale_battle_ledger_rejected: Boolean(staleBattleLedgerReport && staleBattleLedgerReport.decision !== "video_generation_run_complete"),
    stale_active_return_state_machine_rejected: Boolean(staleStateMachineReport && staleStateMachineReport.decision !== "video_generation_run_complete"),
    stale_submission_ledger_rejected: Boolean(staleSubmissionLedgerReport && staleSubmissionLedgerReport.decision !== "video_generation_run_complete"),
    production_final_output_changed: productionExistedBefore !== productionExistsAfter,
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

main();
