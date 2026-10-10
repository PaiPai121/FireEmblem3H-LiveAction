#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const outJson = path.join(reportDir, `scene09_v3_report_freshness_gate_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_report_freshness_gate_${date}.md`);
const packageOutJson = path.join(packageDir, "report_freshness_gate.json");
const packageOutMd = path.join(packageDir, "report_freshness_gate.md");

const PACKAGE_REPORTS = [
  { id: "execution_plan", file: "execution_plan.json", countKeys: ["total_shots"], rowsKey: "work_orders" },
  { id: "goal_completion_matrix", file: "goal_completion_matrix.json" },
  { id: "submission_payload_manifest", file: "submission_payload_manifest.json", countKeys: ["rows"] },
  { id: "submission_contract_gate", file: "submission_contract_gate.json", countKeys: ["expected_shots", "rows_checked"] },
  { id: "provider_submission_freshness_gate", file: "provider_submission_freshness_gate.json", countKeys: ["expected_shots"] },
  { id: "provider_upload_bundles_audit", file: "provider_upload_bundles_audit.json", countKeys: ["rows_checked"] },
  { id: "clip_return_intake_audit", file: "clip_return_intake_audit.json", countKeys: ["expected_clip_rows"] },
  { id: "clip_revision_queue", file: "clip_revision_queue.json", countKeys: ["total_shots"], rowsKey: "rows" },
  { id: "provider_ingest_provenance_contract", file: "provider_ingest_provenance_contract.json" },
  { id: "model_cli_template_audit", file: "model_cli_template_audit.json" },
  { id: "model_cli_template_positive_contract", file: "model_cli_template_positive_contract.json", countKeys: ["expected_shots"] },
  { id: "battle_ledger_timeline", file: "battle_ledger_timeline.json", countKeys: ["shots"], rowsKey: "rows" },
  { id: "generated_clip_structural_audit", file: "generated_clip_structural_audit.json", countKeys: ["expected_clips"], rowsKey: "rows" },
  { id: "frame_evidence_audit", file: "frame_evidence_audit.json", countKeys: ["shots_checked"] },
  { id: "per_frame_visual_review_matrix", file: "per_frame_visual_review_matrix.json", countKeys: ["shots_checked"] },
  { id: "full_local_visual_review", file: "full_local_visual_review.json" },
  { id: "ep02_web_battle_event_panel_audit", file: "ep02_web_battle_event_panel_audit.json", countKeys: ["scene09_shots", "rendered_battle_event_panels"] },
  { id: "narrative_hard_constraints_audit", file: "narrative_hard_constraints_audit.json", countKeys: ["shots_checked"] },
  { id: "character_beat_readiness_audit", file: "character_beat_readiness_audit.json", countKeys: ["shots_checked"] },
  { id: "executable_prompt_semantics_audit", file: "executable_prompt_semantics_audit.json", countKeys: ["shots_checked"], rowsKey: "rows" },
  { id: "audio_timing_prompt_contract", file: "audio_timing_prompt_contract.json", countKeys: ["shots_checked"], rowsKey: "rows" },
  { id: "motion_probe_clip_structural_audit", file: "motion_probe_clip_structural_audit.json", countKeys: ["expected_probe_clips"], rowsKey: "rows" },
  { id: "motion_probe_package_audit", file: "motion_probe_package_audit.json", countKeys: ["expected_shots", "rows_checked"], rowsKey: "rows" },
  { id: "motion_probe_provider_bundles_audit", file: "motion_probe_provider_bundles_audit.json", countKeys: ["rows_checked"], rowsKey: "rows" },
  { id: "motion_probe_submission_ready_gate", file: "motion_probe_submission_ready_gate.json", countKeys: ["expected_shots", "bundled_probe_rows"] },
  { id: "motion_probe_operator_tracker", file: "motion_probe_operator_tracker.json", countKeys: ["expected_probe_rows"], rowsKey: "rows" },
  { id: "motion_probe_operator_tracker_audit", file: "motion_probe_operator_tracker_audit.json", countKeys: ["expected_probe_rows"] },
  { id: "handoff_control_reports_audit", file: "handoff_control_reports_audit.json" },
  { id: "motion_probe_return_intake_audit", file: "motion_probe_return_intake_audit.json", countKeys: ["expected_probe_rows"], rowsKey: "rows" },
  { id: "motion_probe_return_roundtrip_audit", file: "motion_probe_return_roundtrip_audit.json" },
  { id: "motion_probe_review_packet_audit", file: "motion_probe_review_packet_audit.json", countKeys: ["expected_probe_clips", "rows_checked"], rowsKey: "rows" },
  { id: "motion_probe_review_apply_gate", file: "motion_probe_review_apply_gate.json", countKeys: ["expected_probe_clips", "proposal_rows"] },
  { id: "motion_probe_review_apply_positive_contract", file: "motion_probe_review_apply_positive_contract.json", countKeys: ["expected_probe_clips"] },
  { id: "full_duration_release_gate", file: "full_duration_release_gate.json", countKeys: ["expected_probe_clips"] },
  { id: "actual_delivery_surface_audit", file: "actual_delivery_surface_audit.json" },
  { id: "current_hanneman_contract_audit", file: "current_hanneman_contract_audit.json" },
  { id: "current_status_consistency_gate", file: "current_status_consistency_gate.json" },
  { id: "provider_preflight_consistency_gate", file: "provider_preflight_consistency_gate.json", countKeys: ["expected_shots"] },
  { id: "motion_self_audit_manifest", file: "motion_self_audit/motion_self_audit_manifest.json", countKeys: ["rows"] },
  { id: "motion_self_audit_packet_audit", file: "motion_self_audit_packet_audit.json", countKeys: ["rows_checked"] },
  { id: "motion_self_audit_evidence_contract", file: "motion_self_audit_evidence_contract.json", countKeys: ["expected_rows", "template_rows"] },
  { id: "motion_self_audit_unsigned_evidence_rejection", file: "motion_self_audit_unsigned_evidence_rejection.json", countKeys: ["expected_rows"] },
  { id: "motion_self_audit_apply_gate", file: "motion_self_audit_apply_gate.json", countKeys: ["expected_clips", "proposal_rows"] },
  { id: "after_clip_return_resume_positive_contract", file: "after_clip_return_resume_positive_contract.json", countKeys: ["expected_shots"] },
  { id: "final_concat_positive_contract", file: "final_concat_positive_contract.json", countKeys: ["expected_shots"] },
  { id: "final_concat_inputs_contract", file: "final_concat_inputs_contract.json", countKeys: ["expected_shots", "rows_checked"], rowsKey: "rows" },
  { id: "final_edit_positive_contract", file: "final_edit_positive_contract.json", countKeys: ["expected_shots"] },
  { id: "video_generation_run_positive_contract", file: "video_generation_run_positive_contract.json", countKeys: ["expected_shots"] },
  { id: "positive_contract_isolation_gate", file: "positive_contract_isolation_gate.json", countKeys: ["expected_shots"] },
  { id: "production_delivery_truth_gate", file: "production_delivery_truth_gate.json", countKeys: ["expected_shots"] },
  { id: "clip_return_roundtrip_audit", file: "clip_return_roundtrip_audit.json" },
  { id: "after_clip_return_resume", file: "after_clip_return_resume.json" },
  { id: "clip_provenance_gate", file: "clip_provenance_gate.json", countKeys: ["expected_clips"], rowsKey: "rows" },
  { id: "proxy_misuse_gate", file: "proxy_misuse_gate.json", countKeys: ["expected_clips"], rowsKey: "rows" },
  { id: "final_concat_gate", file: "final_concat_gate.json", countKeys: ["expected_shots"] },
  { id: "final_edit_structural_audit", file: "final_edit_structural_audit.json" },
  { id: "operator_preflight_status", file: "operator_preflight_status.json" },
  { id: "provider_upload_manifest", file: "provider_upload_manifest.json", countKeys: ["total_shots", "expected_clips"], rowsKey: "rows" },
];

const jsonParseErrors = new Map();

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    jsonParseErrors.set(file, error.message);
    return fallback;
  }
}

function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
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
  return normalizeSlashes(path.relative(root, file));
}

function normalizeSlashes(value) {
  return String(value || "").split(path.sep).join("/");
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function abs(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
}

function parseJsonlFile(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
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

function submissionBattleLedgerRows(shots) {
  const activeManifest = readJson(path.join(root, "production_system/video_delivery_manifest.json"), { shots: [] });
  const activeByShot = new Map((activeManifest.shots || []).map((shot) => [shot.shot, shot]));
  const payloadRows = parseJsonlFile(path.join(packageDir, "submission_payload.jsonl"));
  const payloadByShot = new Map(payloadRows.map((row) => [row.shot, row]));
  return shots.map((shot) => {
    const metadataPath = path.join(packageDir, shot.package_dir || "", "metadata.json");
    const metadata = readJson(metadataPath, {});
    const activeShot = activeByShot.get(shot.shot) || {};
    const payload = payloadByShot.get(shot.shot) || null;
    const authoritativeBattleState = metadata.battle_state_after || activeShot.battle_state_after || shot.battle_state_after || {};
    const authoritativeLedger = authoritativeBattleState.battle_ledger_after || metadata.battle_ledger_after || activeShot.battle_ledger_after || shot.battle_ledger_after || {};
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      custom_id: `${String(shot.order).padStart(3, "0")}_${shot.shot}`,
      visible_named_only: shot.visible_named_only || [],
      expected_ledger_fields: expectedSubmissionLedgerFields(authoritativeBattleState, authoritativeLedger, shot.visible_named_only || []),
      expected_battle_ledger_after: authoritativeLedger,
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
      metadata_battle_ledger_after: metadata?.battle_state_after?.battle_ledger_after || metadata?.battle_ledger_after || null,
      metadata_no_active_combat_after: metadata?.battle_state_after?.no_active_combat_after || [],
    };
  });
}

function expectedClipFileRows(shots) {
  return shots.map((shot) => {
    const absolute = abs(shot.expected_clip || "");
    const exists = fs.existsSync(absolute);
    const stat = exists ? fs.statSync(absolute) : null;
    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: shot.expected_clip,
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

function expectedClipProbeRows(shots) {
  return shots.map((shot) => ({
    order: shot.order,
    shot: shot.shot,
    id: shot.id,
    expected_clip: shot.expected_clip,
    probe: probeVideoFile(abs(shot.expected_clip || "")),
  }));
}

function expectedMotionProbeRows() {
  const probeManifest = readJson(path.join(packageDir, "motion_probe_submission/motion_probe_manifest.json"), { rows: [] });
  return [...(probeManifest.rows || [])].sort((a, b) => Number(a.order) - Number(b.order));
}

function expectedMotionProbeFileRows() {
  return expectedMotionProbeRows().map((row) => {
    const absolute = abs(row.expected_probe_clip || "");
    const exists = fs.existsSync(absolute);
    const stat = exists ? fs.statSync(absolute) : null;
    return {
      order: row.order,
      shot: row.shot,
      id: row.id,
      custom_id: row.custom_id,
      expected_probe_clip: row.expected_probe_clip,
      parent_expected_clip: row.parent_expected_clip,
      exists,
      size_bytes: stat?.size ?? null,
      sha256: exists ? sha256(absolute) : null,
    };
  });
}

function expectedMotionProbeVideoRows() {
  return expectedMotionProbeRows().map((row) => {
    const probed = probeVideoFile(abs(row.expected_probe_clip || ""));
    const normalizedProbe = probed.exists
      ? {
          exists: true,
          ok: Boolean(probed.codec_name) && Boolean(probed.ok),
          issue: probed.issue || null,
          size_bytes: probed.size_bytes ?? null,
          sha256: probed.exists ? (fs.existsSync(abs(row.expected_probe_clip || "")) ? sha256(abs(row.expected_probe_clip || "")) : null) : null,
          duration_seconds: probed.duration_seconds ?? null,
          codec_name: probed.codec_name || null,
          width: probed.width || null,
          height: probed.height || null,
        }
      : { exists: false, ok: false, issue: "missing_probe_clip" };
    return {
      order: row.order,
      shot: row.shot,
      id: row.id,
      custom_id: row.custom_id,
      expected_probe_clip: row.expected_probe_clip,
      parent_expected_clip: row.parent_expected_clip,
      probe: normalizedProbe,
    };
  });
}

function normalizeClipPath(value) {
  if (!value) return "";
  return rel(abs(value));
}

function clipProvenanceRows(shots) {
  const provenancePath = path.join(packageDir, "generated_clip_provenance.json");
  const provenance = readJson(provenancePath, { version: 1, rows: [] });
  const provenanceRows = Array.isArray(provenance?.rows) ? provenance.rows : [];
  const provenanceByClip = new Map(provenanceRows.map((row) => [normalizeClipPath(row.expected_clip || row.output_clip), row]));
  return shots.map((shot) => {
    const expectedClip = normalizeClipPath(shot.expected_clip);
    const expectedAbs = abs(shot.expected_clip || "");
    const exists = fs.existsSync(expectedAbs);
    const currentSha256 = exists ? sha256(expectedAbs) : null;
    const source = provenanceByClip.get(expectedClip) || null;
    const rowProblems = [];
    const rowWarnings = [];

    if (exists && !source) rowProblems.push("existing expected clip has no provenance row");
    if (exists && source) {
      if (!["provider_ingest", "model_cli_execute"].includes(source.source_type)) {
        rowProblems.push(`unsupported provenance source_type ${source.source_type || "missing"}`);
      }
      if (!source.sha256) rowProblems.push("provenance row is missing output sha256");
      if (source.sha256 && source.sha256 !== currentSha256) {
        rowProblems.push("current expected clip sha256 does not match provenance sha256");
      }
      if (!source.created_at) rowProblems.push("provenance row is missing created_at");
      if (!source.shot || source.shot !== shot.shot) rowProblems.push(`provenance shot ${source.shot || "missing"} does not match ${shot.shot}`);
      if (!source.id || source.id !== shot.id) rowProblems.push(`provenance id ${source.id || "missing"} does not match ${shot.id}`);
      if (source.source_type === "provider_ingest") {
        if (!source.source) rowProblems.push("provider provenance is missing source path");
        if (!source.source_relative_to_input) rowProblems.push("provider provenance is missing source_relative_to_input");
        if (!source.source_bytes) rowProblems.push("provider provenance is missing source_bytes");
        if (!source.source_sha256) rowProblems.push("provider provenance is missing source_sha256");
        if (!source.source_video_probe?.ok) rowProblems.push("provider provenance is missing passing source_video_probe");
        if (source.source && fs.existsSync(source.source)) {
          const sourceStat = fs.statSync(source.source);
          const sourceSha256 = sha256(source.source);
          if (Number(source.source_bytes || 0) !== sourceStat.size) {
            rowProblems.push("provider source file bytes do not match provenance source_bytes");
          }
          if (source.source_sha256 && source.source_sha256 !== sourceSha256) {
            rowProblems.push("provider source file sha256 does not match provenance source_sha256");
          }
        }
      }
      const sourcePathText = JSON.stringify(source).toLowerCase();
      if (/proxy_animatic|_proxy/.test(sourcePathText)) {
        rowProblems.push("provenance references proxy animatic material");
      }
    }
    if (!exists && source) rowWarnings.push("provenance row exists but expected clip is currently missing");

    return {
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      expected_clip: expectedClip,
      exists,
      current_sha256: currentSha256,
      provenance_source_type: source?.source_type || null,
      provenance_sha256: source?.sha256 || null,
      provenance_created_at: source?.created_at || null,
      provenance_source_sha256: source?.source_sha256 || null,
      problems: rowProblems,
      warnings: rowWarnings,
    };
  });
}

function promptNoActive(prompt) {
  return prompt.match(/No-active-combat after this shot:\s*(.+?)(?:\.|\n|$)/)?.[1]?.trim() || "";
}

function battleLedgerRows(shots) {
  return shots.map((shot) => {
    const ledger = shot.battle_state_after?.battle_ledger_after || shot.battle_ledger_after || {};
    const modelPromptPath = shot.package_dir
      ? path.join(packageDir, shot.package_dir, "model_prompt.md")
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

function battleLedgerStateMachineRows(shots) {
  const knownNames = new Set(flattenGroups(shots[0]?.battle_state_after?.battle_ledger_after?.alive_by_house || shots[0]?.battle_ledger_after?.alive_by_house || {}));
  let previousMustNotReturn = new Set();
  let previousCapturedObjectiveDefeated = new Set();
  return shots.map((shot) => {
    const ledger = shot.battle_state_after?.battle_ledger_after || shot.battle_ledger_after || {};
    const modelPromptPath = shot.package_dir ? path.join(packageDir, shot.package_dir, "model_prompt.md") : null;
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

function jsonParseProblem(file) {
  const error = jsonParseErrors.get(file);
  return error ? `invalid JSON ${rel(file)}: ${error}` : null;
}

function statInfo(file) {
  if (!fs.existsSync(file)) return null;
  const stat = fs.statSync(file);
  return {
    mtime: stat.mtime.toISOString(),
    bytes: stat.size,
    sha256: sha256(file),
  };
}

function shotSignature(shot) {
  return {
    order: Number(shot.order),
    shot: shot.shot,
    id: shot.id,
    expected_clip: shot.expected_clip,
    package_dir: shot.package_dir,
    duration_seconds: Number(shot.duration_seconds || 0),
  };
}

function finalConcatInputSnapshot(shots) {
  const rows = [...shots]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((shot) => ({
      order: Number(shot.order),
      shot: shot.shot,
      id: shot.id,
      duration_seconds: Number(shot.duration_seconds || 0),
      expected_clip: String(shot.expected_clip || ""),
    }));
  const orderedClipText = rows
    .map((row) => `${row.order},${row.shot},${row.id},${row.duration_seconds},${row.expected_clip}`)
    .join("\n") + "\n";
  const concatListText = rows
    .map((row) => `file '${path.join(root, row.expected_clip).replace(/'/g, "'\\''")}'`)
    .join("\n") + "\n";
  return {
    rows,
    ordered_clip_signature_sha256: sha256Text(orderedClipText),
    concat_list_preview_sha256: sha256Text(concatListText),
    concat_list_preview: concatListText,
  };
}

function rowSignature(row) {
  return {
    order: Number(row.order),
    shot: row.shot,
    id: row.id,
    expected_clip: row.expected_clip,
  };
}

function sameRow(a, b) {
  return Number(a.order) === Number(b.order) &&
    a.shot === b.shot &&
    (!a.id || !b.id || a.id === b.id) &&
    (!a.expected_clip || !b.expected_clip || a.expected_clip === b.expected_clip);
}

function isCompletionFixedPointReady(completion) {
  const failed = new Set(completion.failed_checks || []);
  const allowedSelfPending = new Set([
    "current_status_consistency_passed",
    "provider_preflight_consistency_passed",
    "reports_align_with_current_manifest",
    "full_duration_release_gate_passed",
    "all_expected_clips_structural_pass",
    "motion_review_frames_complete",
    "codex_motion_self_audit_passed",
    "revision_queue_empty",
    "final_concat_gate_passed",
    "final_edit_structural_passed",
  ]);
  const passedChecks = Number(completion.passed_checks || 0);
  const onlyKnownClipsPending = [...failed].every((id) => allowedSelfPending.has(id)) &&
    (failed.has("current_status_consistency_passed") || passedChecks === 23);
  return completion.decision === "video_generation_run_blocked_clips_pending" &&
    Number(completion.total_checks || 0) === 30 &&
    passedChecks >= 20 &&
    passedChecks <= 23 &&
    onlyKnownClipsPending;
}

function projectedCompletionSnapshot(completion) {
  if (isCompletionFixedPointReady(completion)) {
    return {
      decision: "video_generation_run_blocked_clips_pending",
      passed_checks: 23,
      total_checks: 30,
    };
  }
  return {
    decision: completion.decision || null,
    passed_checks: completion.passed_checks || null,
    total_checks: completion.total_checks || null,
  };
}

function rowListFor(report, rowsKey) {
  if (!rowsKey) return [];
  const rows = report?.[rowsKey];
  return Array.isArray(rows) ? rows : [];
}

function checkRows(reportId, rows, shots, problems) {
  if (!rows.length) return;
  if (rows.length !== shots.length) {
    problems.push(`${reportId}: row count ${rows.length} does not match manifest ${shots.length}`);
    return;
  }
  for (let i = 0; i < shots.length; i += 1) {
    const expected = shotSignature(shots[i]);
    const actual = rowSignature(rows[i]);
    if (!sameRow(actual, expected)) {
      problems.push(`${reportId}: row ${i + 1} mismatch; got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
      return;
    }
  }
}

function expectedFrameEvidenceRows(shots) {
  const rows = [];
  for (const shot of shots) {
    for (const frame of ["start", "key", "end"]) {
      const packageFrame = path.join(packageDir, shot.package_dir || "", `${frame}_frame.png`);
      const sourceFrame = shot.source_frames?.[`${frame}_frame`] || "";
      const sourceAbs = sourceFrame ? abs(sourceFrame) : "";
      rows.push({
        order: Number(shot.order),
        shot: shot.shot,
        frame,
        package_frame: rel(packageFrame),
        source_frame: sourceFrame,
        sha256: fs.existsSync(packageFrame) ? sha256(packageFrame) : null,
        source_sha256: sourceFrame && fs.existsSync(sourceAbs) ? sha256(sourceAbs) : null,
      });
    }
  }
  return rows;
}

function frameRowSignature(row) {
  return {
    order: Number(row.order),
    shot: row.shot,
    frame: row.frame,
    package_frame: normalizeSlashes(row.package_frame),
    source_frame: normalizeSlashes(row.source_frame),
    sha256: row.sha256 || null,
    source_sha256: row.source_sha256 || null,
  };
}

function checkCurrentFrameRows(reportId, report, shots, expected, problems) {
  const acceptedDecision = reportId === "frame_evidence_audit"
    ? "frame_evidence_audit_passed_monitor_required"
    : "per_frame_visual_review_matrix_passed_monitor_required";
  if (report.decision !== acceptedDecision) {
    problems.push(`decision ${report.decision || "missing"} is not ${acceptedDecision}`);
  }
  for (const key of ["frames_checked", "frames_passed"]) {
    if (Number(report[key] || 0) !== expected * 3) {
      problems.push(`${key} ${report[key] || 0} does not match ${expected * 3}`);
    }
  }
  if (Number(report.expected_frames || expected * 3) !== expected * 3) {
    problems.push(`expected_frames ${report.expected_frames || 0} does not match ${expected * 3}`);
  }
  if (Number(report.problems?.length || 0) !== 0) {
    problems.push(`problems ${report.problems.length}`);
  }

  const rows = Array.isArray(report.rows) ? report.rows : [];
  if (rows.length !== expected * 3) {
    problems.push(`rows ${rows.length} does not match ${expected * 3}`);
    return;
  }

  const currentRows = expectedFrameEvidenceRows(shots);
  const currentByKey = new Map(currentRows.map((row) => [`${row.shot}:${row.frame}`, row]));
  const seenKeys = new Set();
  const hashToRows = new Map();
  for (const row of rows) {
    const key = `${row.shot}:${row.frame}`;
    if (seenKeys.has(key)) {
      problems.push(`duplicate frame row ${key}`);
      continue;
    }
    seenKeys.add(key);
    const expectedRow = currentByKey.get(key);
    if (!expectedRow) {
      problems.push(`unexpected frame row ${key}`);
      continue;
    }
    const actualSignature = frameRowSignature(row);
    const expectedSignature = frameRowSignature(expectedRow);
    if (JSON.stringify(actualSignature) !== JSON.stringify(expectedSignature)) {
      problems.push(`frame row ${key} mismatch; got ${JSON.stringify(actualSignature)}, expected ${JSON.stringify(expectedSignature)}`);
      continue;
    }
    if (row.digest_matches_source !== true) {
      problems.push(`frame row ${key} digest_matches_source is not true`);
    }
    if (row.sha256) {
      const matches = hashToRows.get(row.sha256) || [];
      matches.push(key);
      hashToRows.set(row.sha256, matches);
    }
  }
  for (const expectedRow of currentRows) {
    const key = `${expectedRow.shot}:${expectedRow.frame}`;
    if (!seenKeys.has(key)) problems.push(`missing frame row ${key}`);
  }
  const duplicateHashGroups = [...hashToRows.entries()].filter(([, keys]) => keys.length > 1);
  if (duplicateHashGroups.length) {
    problems.push(`exact duplicate package frame hashes ${duplicateHashGroups.map(([hash, keys]) => `${hash}:${keys.join("|")}`).join("; ")}`);
  }
}

function checkSubmissionPayload(shots, manifest, problems) {
  const payloadPath = path.join(packageDir, manifest.submission_payload || "submission_payload.jsonl");
  const payloadManifestPath = path.join(packageDir, manifest.submission_payload_manifest || "submission_payload_manifest.json");
  const payloadManifest = readJson(payloadManifestPath, {});
  const payloadManifestProblem = jsonParseProblem(payloadManifestPath);
  if (payloadManifestProblem) problems.push(`submission_payload_manifest: ${payloadManifestProblem}`);
  if (!fs.existsSync(payloadPath)) {
    problems.push(`submission_payload: missing ${rel(payloadPath)}`);
    return null;
  }
  const lines = fs.readFileSync(payloadPath, "utf8").trim().split(/\n/).filter(Boolean);
  if (Number(payloadManifest.rows || 0) !== shots.length) {
    problems.push(`submission_payload_manifest: rows ${payloadManifest.rows || 0} does not match manifest ${shots.length}`);
  }
  const parsedRows = [];
  const parseErrors = [];
  for (let i = 0; i < lines.length; i += 1) {
    try {
      parsedRows.push(JSON.parse(lines[i]));
    } catch (error) {
      parseErrors.push(`line ${i + 1}: ${error.message}`);
    }
  }
  if (parseErrors.length) {
    for (const error of parseErrors) problems.push(`submission_payload: invalid JSONL ${error}`);
    return {
      path: rel(payloadPath),
      rows: lines.length,
      sha256: sha256(payloadPath),
      normalized_sha256: null,
      parse_errors: parseErrors.length,
    };
  }
  const digest = crypto.createHash("sha256").update(parsedRows.map((row) => JSON.stringify(row)).join("\n") + "\n").digest("hex");
  if (payloadManifest.sha256 && payloadManifest.sha256 !== digest) {
    problems.push("submission_payload_manifest: sha256 does not match current submission_payload.jsonl");
  }
  if (lines.length !== shots.length) {
    problems.push(`submission_payload: line count ${lines.length} does not match manifest ${shots.length}`);
    return { path: rel(payloadPath), rows: lines.length, sha256: digest };
  }
  for (let i = 0; i < shots.length; i += 1) {
    const row = parsedRows[i];
    const expected = shotSignature(shots[i]);
    if (!sameRow(rowSignature(row), expected)) {
      problems.push(`submission_payload: row ${i + 1} mismatch; got ${JSON.stringify(rowSignature(row))}, expected ${JSON.stringify(expected)}`);
      break;
    }
  }
  return { path: rel(payloadPath), rows: lines.length, sha256: digest };
}

function main() {
  const manifest = readJson(manifestPath);
  if (!manifest) {
    const manifestInfo = statInfo(manifestPath);
    const problems = [
      jsonParseProblem(manifestPath) || `missing package manifest ${rel(manifestPath)}`,
    ];
    const report = {
      date,
      package_id: null,
      package_manifest: rel(manifestPath),
      package_manifest_sha256: manifestInfo?.sha256 || null,
      expected_shots: null,
      decision: "report_freshness_blocked",
      problems,
      warnings: [],
      submission_payload: null,
      reports_checked: 0,
      report_rows: [],
      shot_signature_sha256: null,
    };
    writeJson(outJson, report);
    writeJson(packageOutJson, report);
    const md = [
      "# Scene09 V3 Report Freshness Gate",
      "",
      `Date: ${date}`,
      "Decision: report_freshness_blocked",
      "",
      "## Problems",
      "",
      problems.map((problem) => `- ${problem}`).join("\n"),
      "",
    ].join("\n");
    writeText(outMd, md);
    writeText(packageOutMd, md);
    console.log(JSON.stringify({
      decision: report.decision,
      reports_checked: 0,
      problems: problems.length,
      warnings: 0,
      report_json: rel(outJson),
      package_report_json: rel(packageOutJson),
    }, null, 2));
    process.exit(1);
  }
  const shots = [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const expected = Number(manifest.total_shots || shots.length);
  const problems = [];
  const warnings = [];
  const manifestInfo = statInfo(manifestPath);
  const currentFinalConcatInputs = finalConcatInputSnapshot(shots);
  const currentCompletionReport = readJson(path.join(packageDir, "video_generation_run_completion_audit.json"), {});
  const projectedCompletionReport = projectedCompletionSnapshot(currentCompletionReport);
  if (expected !== shots.length) problems.push(`package_manifest: total_shots ${expected} does not match shots length ${shots.length}`);
  if (shots.length !== 42) problems.push(`package_manifest: expected 42 shots, found ${shots.length}`);

  const reportRows = [];
  for (const spec of PACKAGE_REPORTS) {
    const file = path.join(packageDir, spec.file);
    const info = statInfo(file);
    const report = readJson(file);
    const reportProblems = [];
    let freshnessBasis = "missing_or_unreadable";
    const parseProblem = jsonParseProblem(file);
    if (parseProblem) {
      reportProblems.push(parseProblem);
    }
    if (!report && !parseProblem) {
      reportProblems.push(`missing report ${spec.file}`);
    } else if (report) {
      if (report.package_id && report.package_id !== manifest.package_id) {
        reportProblems.push(`package_id ${report.package_id} does not match ${manifest.package_id}`);
      }
      if (report.package_manifest && report.package_manifest !== rel(manifestPath)) {
        reportProblems.push(`package_manifest ${report.package_manifest} does not match ${rel(manifestPath)}`);
      }
      for (const key of spec.countKeys || []) {
        if (Number(report[key] || 0) !== expected) {
          reportProblems.push(`${key} ${report[key] || 0} does not match ${expected}`);
        }
      }
      checkRows(spec.id, rowListFor(report, spec.rowsKey), shots, reportProblems);
      if (spec.id === "operator_preflight_status") {
        const clipStatus = report.evidence?.clip_status || {};
        if (Number(clipStatus.expected_clips || 0) !== expected) {
          reportProblems.push(`operator clip_status expected_clips ${clipStatus.expected_clips || 0} does not match ${expected}`);
        }
        const statusGate = report.evidence?.current_status_consistency_gate || {};
        if (report.can_submit_to_provider === true && statusGate.decision !== "current_status_consistency_passed") {
          reportProblems.push(`can_submit_to_provider is true but current_status_consistency_gate is ${statusGate.decision || "missing"}`);
        }
        if (report.can_submit_to_provider === true && Number(statusGate.problems || 0) !== 0) {
          reportProblems.push(`can_submit_to_provider is true but current_status_consistency_gate has ${statusGate.problems} problems`);
        }
      }
      if (spec.id === "goal_completion_matrix") {
        if (report.decision !== "scene09_local_prompt_asset_goal_ready_video_clips_pending") {
          reportProblems.push(`decision ${report.decision || "missing"} is not scene09_local_prompt_asset_goal_ready_video_clips_pending`);
        }
        if (Number(report.local_requirements_proved || 0) !== Number(report.local_requirements_total || 0) ||
            Number(report.local_requirements_total || 0) < 14) {
          reportProblems.push(`local requirements ${report.local_requirements_proved || 0}/${report.local_requirements_total || 0} are not fully proved`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
        const videoPending = (report.external_pending || []).find((row) => row.id === "real_video_clips");
        if (!videoPending || videoPending.status !== "clips_pending" ||
            Number(videoPending.expected || 0) !== expected ||
            Number(videoPending.ready || 0) !== 0) {
          reportProblems.push("real_video_clips external pending row must state 0/42 clips_pending");
        }
      }
      if (spec.id === "submission_contract_gate") {
        const currentSubmissionLedgerRows = submissionBattleLedgerRows(shots);
        const currentSubmissionLedgerRowsDigest = sha256Text(`${JSON.stringify(currentSubmissionLedgerRows)}\n`);
        if (report.decision !== "submission_contract_gate_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not submission_contract_gate_passed`);
        }
        for (const key of ["execution_plan_rows", "submission_queue_rows", "submission_payload_rows"]) {
          if (Number(report[key] || 0) !== expected) {
            reportProblems.push(`${key} ${report[key] || 0} does not match ${expected}`);
          }
        }
        if (!Array.isArray(report.submission_battle_ledger_rows) ||
            report.submission_battle_ledger_rows.length !== expected) {
          reportProblems.push(`submission_battle_ledger_rows ${report.submission_battle_ledger_rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.submission_battle_ledger_rows) !== JSON.stringify(currentSubmissionLedgerRows)) {
          reportProblems.push("submission_battle_ledger_rows do not match current payload/metadata/package state");
        }
        if (report.submission_battle_ledger_rows_digest_sha256 !== currentSubmissionLedgerRowsDigest) {
          reportProblems.push("submission_battle_ledger_rows_digest_sha256 does not match current payload/metadata/package state");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "provider_submission_freshness_gate") {
        if (report.decision !== "provider_submission_freshness_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not provider_submission_freshness_passed`);
        }
        if (Number(report.model_submission_batch_rows || 0) !== expected) {
          reportProblems.push(`model_submission_batch_rows ${report.model_submission_batch_rows || 0} does not match ${expected}`);
        }
        if (Number(report.provider_bundle_rows || 0) !== expected) {
          reportProblems.push(`provider_bundle_rows ${report.provider_bundle_rows || 0} does not match ${expected}`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "provider_upload_bundles_audit") {
        if (report.decision !== "provider_upload_bundles_ready") {
          reportProblems.push(`decision ${report.decision || "missing"} is not provider_upload_bundles_ready`);
        }
        if (Number(report.bundles_checked || 0) !== 7) {
          reportProblems.push(`bundles_checked ${report.bundles_checked || 0} does not match 7`);
        }
        if (Number(report.zip_contents_checked || 0) !== 7) {
          reportProblems.push(`zip_contents_checked ${report.zip_contents_checked || 0} does not match 7`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "clip_return_intake_audit") {
        if (report.decision !== "clip_return_intake_ready") {
          reportProblems.push(`decision ${report.decision || "missing"} is not clip_return_intake_ready`);
        }
        if (Number(report.batches_checked || 0) !== 7) {
          reportProblems.push(`batches_checked ${report.batches_checked || 0} does not match 7`);
        }
        if (Number(report.unique_custom_ids || 0) !== expected) {
          reportProblems.push(`unique_custom_ids ${report.unique_custom_ids || 0} does not match ${expected}`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "clip_revision_queue") {
        if (!/^clip_(generation_or_revision_actions_required|revision_queue_clear_ready_for_concat)$/.test(report.decision || "")) {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted clip revision queue decision`);
        }
        if (Number(report.actionable_shots || 0) !== expected && report.decision !== "clip_revision_queue_clear_ready_for_concat") {
          reportProblems.push(`actionable_shots ${report.actionable_shots || 0} does not match ${expected} while clips are pending`);
        }
      }
      if (spec.id === "provider_ingest_provenance_contract") {
        if (report.decision !== "provider_ingest_provenance_contract_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not provider_ingest_provenance_contract_passed`);
        }
        if (report.positive?.gate?.ok !== true) {
          reportProblems.push("positive provider-ingest provenance gate did not pass");
        }
        if (report.negative?.rejected !== true) {
          reportProblems.push("negative missing-source-sha256 provider provenance was not rejected");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "model_cli_template_audit") {
        if (!/^model_cli_template_(not_configured|ready|blocked)$/.test(report.decision || "")) {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted model CLI template audit decision`);
        }
        if (report.configured === true && report.can_execute_with_local_cli !== true && report.decision !== "model_cli_template_blocked") {
          reportProblems.push("configured template is neither executable nor blocked");
        }
      }
      if (spec.id === "model_cli_template_positive_contract") {
        if (report.decision !== "model_cli_template_positive_contract_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not model_cli_template_positive_contract_passed`);
        }
        if (Number(report.cases_checked || 0) !== 4) {
          reportProblems.push(`cases_checked ${report.cases_checked || 0} does not match 4`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "frame_evidence_audit" || spec.id === "per_frame_visual_review_matrix") {
        checkCurrentFrameRows(spec.id, report, shots, expected, reportProblems);
      }
      if (spec.id === "full_local_visual_review") {
        if (report.decision !== "full_local_visual_review_passed_for_motion_probe_not_video_approved") {
          reportProblems.push(`decision ${report.decision || "missing"} is not full_local_visual_review_passed_for_motion_probe_not_video_approved`);
        }
        const integrity = report.integrity_summary || {};
        const coverage = report.visual_audit_coverage || {};
        const reviewedShots = report.shots && typeof report.shots === "object" ? Object.keys(report.shots) : [];
        if (Number(integrity.shots_expected || 0) !== expected) {
          reportProblems.push(`integrity_summary.shots_expected ${integrity.shots_expected || 0} does not match ${expected}`);
        }
        if (Number(integrity.shots_reviewed || 0) !== expected) {
          reportProblems.push(`integrity_summary.shots_reviewed ${integrity.shots_reviewed || 0} does not match ${expected}`);
        }
        if (Number(integrity.frames_expected || 0) !== expected * 3) {
          reportProblems.push(`integrity_summary.frames_expected ${integrity.frames_expected || 0} does not match ${expected * 3}`);
        }
        if (Number(integrity.frames_present || 0) !== expected * 3) {
          reportProblems.push(`integrity_summary.frames_present ${integrity.frames_present || 0} does not match ${expected * 3}`);
        }
        if (Array.isArray(integrity.missing_frame_refs) && integrity.missing_frame_refs.length !== 0) {
          reportProblems.push(`missing_frame_refs ${integrity.missing_frame_refs.length}`);
        }
        if (!Array.isArray(coverage.monitor_required) || coverage.monitor_required.length !== expected) {
          reportProblems.push(`visual_audit_coverage.monitor_required ${coverage.monitor_required?.length || 0} does not match ${expected}`);
        }
        if (Array.isArray(coverage.visual_review_passed) && coverage.visual_review_passed.length !== 0) {
          reportProblems.push(`visual_review_passed ${coverage.visual_review_passed.length} should be 0 before returned motion probes`);
        }
        if (Array.isArray(coverage.existing_shots_failed) && coverage.existing_shots_failed.length !== 0) {
          reportProblems.push(`existing_shots_failed ${coverage.existing_shots_failed.length}`);
        }
        if (reviewedShots.length !== expected) {
          reportProblems.push(`shots object has ${reviewedShots.length} entries, expected ${expected}`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
        if (!String(report.promotion_decision || "").includes("Do not submit full-duration video yet")) {
          reportProblems.push("promotion_decision does not explicitly block full-duration video approval");
        }
      }
      if (spec.id === "generated_clip_structural_audit") {
        const currentClipRows = expectedClipFileRows(shots);
        const currentClipDigest = sha256Text(`${JSON.stringify(currentClipRows)}\n`);
        const currentClipProbeRows = expectedClipProbeRows(shots);
        const currentClipProbeDigest = sha256Text(`${JSON.stringify(currentClipProbeRows)}\n`);
        const currentPlayableClips = currentClipProbeRows.filter((row) => row.probe.ok).length;
        if (!/^(clips_pending|clip_qa_blocked|clip_files_integrity_passed_motion_review_still_required)$/.test(report.decision || "")) {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted generated clip structural audit decision`);
        }
        if (!report.expected_clip_files_digest_sha256) {
          reportProblems.push("generated clip structural audit missing expected_clip_files_digest_sha256");
        }
        if (!Array.isArray(report.expected_clip_file_rows) ||
            report.expected_clip_file_rows.length !== expected) {
          reportProblems.push(`generated clip structural audit expected_clip_file_rows ${report.expected_clip_file_rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.expected_clip_file_rows) !== JSON.stringify(currentClipRows)) {
          reportProblems.push("generated clip structural audit expected_clip_file_rows do not match current filesystem state");
        }
        if (report.expected_clip_files_digest_sha256 &&
            report.expected_clip_files_digest_sha256 !== currentClipDigest) {
          reportProblems.push("generated clip structural audit expected_clip_files_digest_sha256 does not match current filesystem state");
        }
        if (!report.expected_clip_video_probe_digest_sha256) {
          reportProblems.push("generated clip structural audit missing expected_clip_video_probe_digest_sha256");
        }
        if (!Array.isArray(report.expected_clip_video_probe_rows) ||
            report.expected_clip_video_probe_rows.length !== expected) {
          reportProblems.push(`generated clip structural audit expected_clip_video_probe_rows ${report.expected_clip_video_probe_rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.expected_clip_video_probe_rows) !== JSON.stringify(currentClipProbeRows)) {
          reportProblems.push("generated clip structural audit expected_clip_video_probe_rows do not match current filesystem state");
        }
        if (report.expected_clip_video_probe_digest_sha256 &&
            report.expected_clip_video_probe_digest_sha256 !== currentClipProbeDigest) {
          reportProblems.push("generated clip structural audit expected_clip_video_probe_digest_sha256 does not match current filesystem state");
        }
        if (Number(report.expected_clip_video_probe_playable || 0) !== currentPlayableClips) {
          reportProblems.push(`generated clip structural audit expected_clip_video_probe_playable ${report.expected_clip_video_probe_playable || 0} does not match current filesystem playable clips ${currentPlayableClips}`);
        }
      }
      if (spec.id === "final_edit_structural_audit") {
        if (Number(report.expected_duration_seconds || 0) !== Number(manifest.total_duration_seconds || 0)) {
          reportProblems.push(`expected_duration_seconds ${report.expected_duration_seconds || 0} does not match manifest ${manifest.total_duration_seconds || 0}`);
        }
        if (report.final_edit?.exists === true && !report.final_edit?.sha256) {
          reportProblems.push("existing final edit structural audit is missing final_edit.sha256");
        }
        if (report.final_edit?.exists === true && !report.final_output_absolute) {
          reportProblems.push("existing final edit structural audit is missing final_output_absolute");
        }
        if (report.final_edit?.exists === true && report.final_concat_binding?.ok !== true) {
          reportProblems.push("existing final edit structural audit is missing final_concat_binding.ok=true");
        }
        if (report.final_edit?.exists === true && report.final_concat_sidecar?.ok !== true) {
          reportProblems.push("existing final edit structural audit is missing final_concat_sidecar.ok=true");
        }
        if (report.final_edit?.exists === true && report.final_concat_provenance?.ok !== true) {
          reportProblems.push("existing final edit structural audit is missing final_concat_provenance.ok=true");
        }
      }
      if (spec.id === "final_edit_positive_contract") {
        if (report.decision !== "final_edit_positive_contract_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not final_edit_positive_contract_passed`);
        }
        if (report.structural_result?.decision !== "final_edit_structural_passed") {
          reportProblems.push(`structural_result decision ${report.structural_result?.decision || "missing"} is not final_edit_structural_passed`);
        }
        if (!report.structural_result?.final_edit?.sha256) {
          reportProblems.push("structural_result missing final_edit.sha256");
        }
        if (report.structural_result?.final_concat_binding?.ok !== true) {
          reportProblems.push("structural_result missing final_concat_binding.ok=true");
        }
        if (report.structural_result?.final_concat_sidecar?.ok !== true) {
          reportProblems.push("structural_result missing final_concat_sidecar.ok=true");
        }
        if (report.structural_result?.final_concat_provenance?.ok !== true) {
          reportProblems.push("structural_result missing final_concat_provenance.ok=true");
        }
        if (report.wrong_duration_rejection?.rejected !== true) {
          reportProblems.push("wrong_duration_rejection was not rejected");
        }
        if (report.wrong_duration_rejection?.issue !== "duration_out_of_tolerance") {
          reportProblems.push(`wrong_duration_rejection issue ${report.wrong_duration_rejection?.issue || "missing"} is not duration_out_of_tolerance`);
        }
        if (report.wrong_duration_rejection?.structural_result?.final_concat_binding?.ok !== true) {
          reportProblems.push("wrong_duration_rejection structural_result missing final_concat_binding.ok=true");
        }
        if (report.wrong_duration_rejection?.structural_result?.final_concat_sidecar?.ok !== true) {
          reportProblems.push("wrong_duration_rejection structural_result missing final_concat_sidecar.ok=true");
        }
        if (report.wrong_duration_rejection?.structural_result?.final_concat_provenance?.ok !== true) {
          reportProblems.push("wrong_duration_rejection structural_result missing final_concat_provenance.ok=true");
        }
        if (report.tampered_provenance_rejection?.rejected !== true) {
          reportProblems.push("tampered_provenance_rejection was not rejected");
        }
        if (report.tampered_provenance_rejection?.structural_result?.decision !== "final_edit_structural_blocked") {
          reportProblems.push(`tampered_provenance_rejection decision ${report.tampered_provenance_rejection?.structural_result?.decision || "missing"} is not final_edit_structural_blocked`);
        }
        if (report.tampered_provenance_rejection?.structural_result?.final_edit?.ok !== true) {
          reportProblems.push("tampered_provenance_rejection structural_result does not preserve valid final_edit.ok=true");
        }
        if (report.tampered_provenance_rejection?.structural_result?.final_concat_provenance?.ok !== false) {
          reportProblems.push("tampered_provenance_rejection structural_result does not mark final_concat_provenance.ok=false");
        }
        if (report.production_existed_before !== report.production_exists_after) {
          reportProblems.push("production final output existence changed during final edit positive contract");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "video_generation_run_positive_contract") {
        const completion = report.completion_result || {};
        const checks = new Map((completion.checks || []).map((item) => [item.id, item]));
        const structuralPositive = checks.get("all_expected_clips_structural_pass");
        const submissionPositive = checks.get("submission_contract_gate_passed");
        const finalConcatPositive = checks.get("final_concat_positive_contract_passed");
        const finalConcatGate = checks.get("final_concat_gate_passed");
        const finalEditPositive = checks.get("final_edit_positive_contract_passed");
        const finalEditStructural = checks.get("final_edit_structural_passed");
        const clipProvenancePositive = checks.get("clip_provenance_gate_passed");
        const applyPositive = checks.get("motion_self_audit_apply_positive_contract_passed");
        const truthGate = checks.get("production_delivery_truth_gate_consistent");
        if (report.decision !== "video_generation_run_positive_contract_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not video_generation_run_positive_contract_passed`);
        }
        if (completion.decision !== "video_generation_run_complete") {
          reportProblems.push(`completion decision ${completion.decision || "missing"} is not video_generation_run_complete`);
        }
        if (Number(completion.passed_checks || 0) !== Number(completion.total_checks || -1)) {
          reportProblems.push(`completion checks ${completion.passed_checks || 0}/${completion.total_checks || 0} are not all passing`);
        }
        if (Number(completion.direct_expected_clip_probe?.playable_clips || 0) !== expected ||
            Number(completion.direct_expected_clip_probe?.expected_clips || 0) !== expected) {
          reportProblems.push(`video-generation-run positive fixture direct expected-clip probe ${completion.direct_expected_clip_probe?.playable_clips || 0}/${completion.direct_expected_clip_probe?.expected_clips || 0} does not match ${expected}/${expected}`);
        }
        if (!String(structuralPositive?.detail || "").includes("file digest ok")) {
          reportProblems.push("video-generation-run positive fixture structural clip check lacks file digest proof");
        }
        if (!String(structuralPositive?.detail || "").includes("probe digest ok")) {
          reportProblems.push("video-generation-run positive fixture structural clip check lacks ffprobe digest proof");
        }
        if (!String(submissionPositive?.detail || "").includes("submission ledger digest ok")) {
          reportProblems.push("video-generation-run positive fixture submission contract lacks submission ledger digest proof");
        }
        if (!String(finalConcatPositive?.detail || "").includes("checks 8/8")) {
          reportProblems.push("video-generation-run positive fixture does not prove final_concat_positive_contract at 8/8");
        }
        if (!String(finalConcatPositive?.detail || "").includes(`direct ffprobe ${expected}/${expected}`)) {
          reportProblems.push("video-generation-run positive fixture does not prove final_concat_positive_contract direct ffprobe 42/42");
        }
        if (!String(finalConcatPositive?.detail || "").includes("tampered input rejected yes")) {
          reportProblems.push("video-generation-run positive fixture does not prove final_concat_positive_contract tampered-input rejection");
        }
        if (!String(finalConcatGate?.detail || "").includes("checks 8/8")) {
          reportProblems.push("video-generation-run positive fixture does not prove final_concat_gate at 8/8");
        }
        if (!String(clipProvenancePositive?.detail || "").includes("rows digest ok")) {
          reportProblems.push("video-generation-run positive fixture clip_provenance_gate lacks rows digest proof");
        }
        if (!String(applyPositive?.detail || "").includes("ledger digest ok")) {
          reportProblems.push("video-generation-run positive fixture motion apply positive contract lacks ledger digest proof");
        }
        if (!String(applyPositive?.detail || "").includes("active-return state ok")) {
          reportProblems.push("video-generation-run positive fixture motion apply positive contract lacks active-return state-machine proof");
        }
        if (!String(applyPositive?.detail || "").includes("stale ledger rejected yes")) {
          reportProblems.push("video-generation-run positive fixture motion apply positive contract lacks stale ledger rejection proof");
        }
        if (!String(applyPositive?.detail || "").includes("stale active-return rejected yes")) {
          reportProblems.push("video-generation-run positive fixture motion apply positive contract lacks stale active-return state-machine rejection proof");
        }
        if (!String(finalEditPositive?.detail || "").includes("sha yes")) {
          reportProblems.push("video-generation-run positive fixture final_edit_positive_contract lacks SHA proof");
        }
        if (!String(finalEditPositive?.detail || "").includes("concat binding ok")) {
          reportProblems.push("video-generation-run positive fixture final_edit_positive_contract lacks final concat binding proof");
        }
        if (!String(finalEditPositive?.detail || "").includes("concat sidecar ok")) {
          reportProblems.push("video-generation-run positive fixture final_edit_positive_contract lacks final concat sidecar proof");
        }
        if (!String(finalEditPositive?.detail || "").includes("concat provenance ok")) {
          reportProblems.push("video-generation-run positive fixture final_edit_positive_contract lacks final concat provenance proof");
        }
        if (!String(finalEditPositive?.detail || "").includes("wrong-duration rejected yes")) {
          reportProblems.push("video-generation-run positive fixture final_edit_positive_contract lacks wrong-duration rejection proof");
        }
        if (!String(finalEditPositive?.detail || "").includes("tampered provenance rejected yes")) {
          reportProblems.push("video-generation-run positive fixture final_edit_positive_contract lacks tampered provenance rejection proof");
        }
        if (!String(finalEditStructural?.detail || "").includes("sha matched")) {
          reportProblems.push("video-generation-run positive fixture final_edit_structural check lacks matched SHA proof");
        }
        if (!String(finalEditStructural?.detail || "").includes("concat binding ok")) {
          reportProblems.push("video-generation-run positive fixture final_edit_structural check lacks final concat binding proof");
        }
        if (!String(finalEditStructural?.detail || "").includes("concat sidecar ok")) {
          reportProblems.push("video-generation-run positive fixture final_edit_structural check lacks final concat sidecar proof");
        }
        if (!String(finalEditStructural?.detail || "").includes("concat provenance ok")) {
          reportProblems.push("video-generation-run positive fixture final_edit_structural check lacks final concat provenance proof");
        }
        if (!String(truthGate?.detail || "").includes("final binding ok")) {
          reportProblems.push("video-generation-run positive fixture production truth gate lacks final binding proof");
        }
        if (!String(truthGate?.detail || "").includes("clip digest ok")) {
          reportProblems.push("video-generation-run positive fixture production truth gate lacks expected-clip digest proof");
        }
        if (!String(truthGate?.detail || "").includes("clip probe ok")) {
          reportProblems.push("video-generation-run positive fixture production truth gate lacks expected-clip ffprobe proof");
        }
        const staleConcatRejection = report.stale_concat_7_of_7_rejection || {};
        const staleConcatFailed = new Set(staleConcatRejection.completion_result?.failed_checks || []);
        const staleStructuralRejection = report.stale_structural_digest_rejection || {};
        const staleStructuralFailed = new Set(staleStructuralRejection.completion_result?.failed_checks || []);
        const staleProvenanceRejection = report.stale_provenance_digest_rejection || {};
        const staleProvenanceFailed = new Set(staleProvenanceRejection.completion_result?.failed_checks || []);
        const staleBattleLedgerRejection = report.stale_battle_ledger_digest_rejection || {};
        const staleBattleLedgerFailed = new Set(staleBattleLedgerRejection.completion_result?.failed_checks || []);
        const staleStateMachineRejection = report.stale_active_return_state_machine_digest_rejection || {};
        const staleStateMachineFailed = new Set(staleStateMachineRejection.completion_result?.failed_checks || []);
        const staleSubmissionLedgerRejection = report.stale_submission_ledger_digest_rejection || {};
        const staleSubmissionLedgerFailed = new Set(staleSubmissionLedgerRejection.completion_result?.failed_checks || []);
        if (staleConcatRejection.rejected !== true) {
          reportProblems.push("video-generation-run positive fixture does not reject stale final concat 7/7 evidence");
        }
        if (!staleConcatFailed.has("final_concat_positive_contract_passed") ||
            !staleConcatFailed.has("final_concat_gate_passed")) {
          reportProblems.push("stale final concat 7/7 rejection does not fail both concat completion checks");
        }
        if (staleStructuralRejection.rejected !== true) {
          reportProblems.push("video-generation-run positive fixture does not reject stale structural clip digest evidence");
        }
        if (!staleStructuralFailed.has("all_expected_clips_structural_pass")) {
          reportProblems.push("stale structural clip digest rejection does not fail all_expected_clips_structural_pass");
        }
        if (staleProvenanceRejection.rejected !== true) {
          reportProblems.push("video-generation-run positive fixture does not reject stale clip provenance digest evidence");
        }
        if (!staleProvenanceFailed.has("clip_provenance_gate_passed")) {
          reportProblems.push("stale clip provenance digest rejection does not fail clip_provenance_gate_passed");
        }
        if (staleBattleLedgerRejection.rejected !== true) {
          reportProblems.push("video-generation-run positive fixture does not reject stale battle ledger digest evidence");
        }
        if (!staleBattleLedgerFailed.has("motion_self_audit_apply_gate_passed")) {
          reportProblems.push("stale battle ledger digest rejection does not fail motion_self_audit_apply_gate_passed");
        }
        if (staleStateMachineRejection.rejected !== true) {
          reportProblems.push("video-generation-run positive fixture does not reject stale active-return state-machine digest evidence");
        }
        if (!staleStateMachineFailed.has("motion_self_audit_apply_gate_passed")) {
          reportProblems.push("stale active-return state-machine digest rejection does not fail motion_self_audit_apply_gate_passed");
        }
        if (staleSubmissionLedgerRejection.rejected !== true) {
          reportProblems.push("video-generation-run positive fixture does not reject stale submission ledger digest evidence");
        }
        if (!staleSubmissionLedgerFailed.has("submission_contract_gate_passed")) {
          reportProblems.push("stale submission ledger digest rejection does not fail submission_contract_gate_passed");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "final_concat_inputs_contract") {
        if (report.decision !== "final_concat_inputs_contract_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not final_concat_inputs_contract_passed`);
        }
        if (Number(report.unique_expected_clips || 0) !== expected) {
          reportProblems.push(`unique_expected_clips ${report.unique_expected_clips || 0} does not match ${expected}`);
        }
        if (Number(report.duration_sum_seconds || 0) !== Number(manifest.total_duration_seconds || 0)) {
          reportProblems.push(`duration_sum_seconds ${report.duration_sum_seconds || 0} does not match manifest ${manifest.total_duration_seconds || 0}`);
        }
        if (!report.ordered_clip_signature_sha256 || !report.concat_list_preview_sha256) {
          reportProblems.push("missing concat input signature hashes");
        }
        if (report.ordered_clip_signature_sha256 !== currentFinalConcatInputs.ordered_clip_signature_sha256) {
          reportProblems.push("ordered_clip_signature_sha256 does not match current package manifest");
        }
        if (report.concat_list_preview_sha256 !== currentFinalConcatInputs.concat_list_preview_sha256) {
          reportProblems.push("concat_list_preview_sha256 does not match current package manifest");
        }
        if (report.concat_list_preview !== currentFinalConcatInputs.concat_list_preview) {
          reportProblems.push("concat_list_preview text does not match current package manifest");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "final_concat_positive_contract") {
        if (report.decision !== "final_concat_positive_contract_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not final_concat_positive_contract_passed`);
        }
        if (report.gate_result?.decision !== "final_concat_gate_passed_ready_for_project_pipeline_concat") {
          reportProblems.push(`gate_result decision ${report.gate_result?.decision || "missing"} is not final_concat_gate_passed_ready_for_project_pipeline_concat`);
        }
        if (Number(report.gate_result?.passed_checks || 0) !== 8 ||
            Number(report.gate_result?.total_checks || 0) !== 8) {
          reportProblems.push(`gate_result checks ${report.gate_result?.passed_checks || 0}/${report.gate_result?.total_checks || 0} are not 8/8`);
        }
        if (Number(report.direct_expected_clip_probe?.playable_clips || 0) !== expected ||
            Number(report.direct_expected_clip_probe?.expected_clips || 0) !== expected) {
          reportProblems.push(`direct_expected_clip_probe ${report.direct_expected_clip_probe?.playable_clips || 0}/${report.direct_expected_clip_probe?.expected_clips || 0} does not match ${expected}/${expected}`);
        }
        if (!String((report.gate_result?.checks || []).find((check) => check.id === "clip_provenance_gate")?.detail || "").includes("rows digest ok")) {
          reportProblems.push("gate_result clip_provenance_gate does not prove rows digest ok");
        }
        if (report.tampered_input_contract_rejection?.rejected !== true) {
          reportProblems.push("tampered_input_contract_rejection did not reject the tampered concat input contract");
        }
        if (report.tampered_input_contract_rejection?.gate_result?.decision !== "final_concat_blocked_motion_or_revision_gate") {
          reportProblems.push(`tampered_input_contract_rejection gate decision ${report.tampered_input_contract_rejection?.gate_result?.decision || "missing"} is not final_concat_blocked_motion_or_revision_gate`);
        }
        if (!(report.tampered_input_contract_rejection?.failed_checks || []).includes("final_concat_inputs_contract") ||
            !(report.tampered_input_contract_rejection?.gate_result?.failed_checks || []).includes("final_concat_inputs_contract")) {
          reportProblems.push("tampered_input_contract_rejection does not fail final_concat_inputs_contract");
        }
        if (Number(report.tampered_input_contract_rejection?.gate_result?.direct_expected_clip_probe?.playable_clips || 0) !== expected ||
            Number(report.tampered_input_contract_rejection?.gate_result?.direct_expected_clip_probe?.expected_clips || 0) !== expected) {
          reportProblems.push(`tampered_input_contract_rejection direct probe ${report.tampered_input_contract_rejection?.gate_result?.direct_expected_clip_probe?.playable_clips || 0}/${report.tampered_input_contract_rejection?.gate_result?.direct_expected_clip_probe?.expected_clips || 0} does not preserve ${expected}/${expected} temporary clips`);
        }
        if (report.tampered_provenance_digest_rejection?.rejected !== true) {
          reportProblems.push("tampered_provenance_digest_rejection did not reject the tampered clip provenance digest");
        }
        if (report.tampered_provenance_digest_rejection?.gate_result?.decision !== "final_concat_blocked_motion_or_revision_gate") {
          reportProblems.push(`tampered_provenance_digest_rejection gate decision ${report.tampered_provenance_digest_rejection?.gate_result?.decision || "missing"} is not final_concat_blocked_motion_or_revision_gate`);
        }
        if (!(report.tampered_provenance_digest_rejection?.failed_checks || []).includes("clip_provenance_gate") ||
            !(report.tampered_provenance_digest_rejection?.gate_result?.failed_checks || []).includes("clip_provenance_gate")) {
          reportProblems.push("tampered_provenance_digest_rejection does not fail clip_provenance_gate");
        }
        if (Number(report.tampered_provenance_digest_rejection?.gate_result?.direct_expected_clip_probe?.playable_clips || 0) !== expected ||
            Number(report.tampered_provenance_digest_rejection?.gate_result?.direct_expected_clip_probe?.expected_clips || 0) !== expected) {
          reportProblems.push(`tampered_provenance_digest_rejection direct probe ${report.tampered_provenance_digest_rejection?.gate_result?.direct_expected_clip_probe?.playable_clips || 0}/${report.tampered_provenance_digest_rejection?.gate_result?.direct_expected_clip_probe?.expected_clips || 0} does not preserve ${expected}/${expected} temporary clips`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "final_concat_gate") {
        const currentClipProbeRows = expectedClipProbeRows(shots);
        const currentPlayableClips = currentClipProbeRows.filter((row) => row.probe.ok).length;
        const currentBattleLedgerRows = battleLedgerRows(shots);
        const currentBattleLedgerRowsDigest = sha256Text(`${JSON.stringify(currentBattleLedgerRows)}\n`);
        const currentStateMachineRows = battleLedgerStateMachineRows(shots);
        const currentStateMachineRowsDigest = sha256Text(`${JSON.stringify(currentStateMachineRows)}\n`);
        if (!/^final_concat_(blocked_clips_pending|blocked_motion_or_revision_gate|gate_passed_ready_for_project_pipeline_concat)$/.test(report.decision || "")) {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted final concat gate decision`);
        }
        if (Number(report.direct_expected_clip_probe?.expected_clips || 0) !== expected) {
          reportProblems.push(`direct_expected_clip_probe expected ${report.direct_expected_clip_probe?.expected_clips || 0} does not match ${expected}`);
        }
        if (Number(report.direct_expected_clip_probe?.playable_clips || 0) !== currentPlayableClips) {
          reportProblems.push(`direct_expected_clip_probe playable ${report.direct_expected_clip_probe?.playable_clips || 0} does not match current filesystem ${currentPlayableClips}`);
        }
        if (Array.isArray(report.direct_expected_clip_probe?.rows) &&
            JSON.stringify(report.direct_expected_clip_probe.rows) !== JSON.stringify(currentClipProbeRows)) {
          reportProblems.push("direct_expected_clip_probe rows do not match current filesystem state");
        }
        const currentProvenanceRows = clipProvenanceRows(shots);
        const currentProvenanceRowsDigest = sha256Text(`${JSON.stringify(currentProvenanceRows)}\n`);
        if (report.current_clip_provenance_gate_signature?.rows_digest_sha256 !== currentProvenanceRowsDigest ||
            !Array.isArray(report.current_clip_provenance_gate_signature?.rows) ||
            JSON.stringify(report.current_clip_provenance_gate_signature.rows) !== JSON.stringify(currentProvenanceRows)) {
          reportProblems.push("current_clip_provenance_gate_signature does not match current filesystem/provenance state");
        }
        if (report.current_battle_ledger_signature?.rows_digest_sha256 !== currentBattleLedgerRowsDigest ||
            !Array.isArray(report.current_battle_ledger_signature?.rows) ||
            JSON.stringify(report.current_battle_ledger_signature.rows) !== JSON.stringify(currentBattleLedgerRows) ||
            report.current_battle_ledger_signature?.state_machine_rows_digest_sha256 !== currentStateMachineRowsDigest ||
            !Array.isArray(report.current_battle_ledger_signature?.state_machine_rows) ||
            JSON.stringify(report.current_battle_ledger_signature.state_machine_rows) !== JSON.stringify(currentStateMachineRows) ||
            currentStateMachineRows.some((row) => Number(row.state_machine_problems?.length || 0) !== 0)) {
          reportProblems.push("current_battle_ledger_signature does not match current package battle-ledger and active-return state-machine state");
        }
      }
      if (spec.id === "executable_prompt_semantics_audit") {
        if (report.decision !== "executable_prompt_semantics_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not executable_prompt_semantics_passed`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
        if (Number(report.warnings?.length || 0) !== 0) {
          reportProblems.push(`warnings ${report.warnings.length}`);
        }
        if (!String(report.evidence?.visible_no_active_semantics || "").includes("must-not-return-active")) {
          reportProblems.push("missing visible_no_active_semantics evidence");
        }
        const rows = Array.isArray(report.rows) ? report.rows : [];
        if (rows.length !== expected) {
          reportProblems.push(`rows ${rows.length} does not match ${expected}`);
        }
        for (const row of rows) {
          if (Number(row.problems || 0) !== 0 || Number(row.warnings || 0) !== 0) {
            reportProblems.push(`${row.shot || "unknown"} has semantic row problems/warnings`);
            break;
          }
          if (Number(row.negative_prompt_visible_conflicts?.length || 0) !== 0) {
            reportProblems.push(`${row.shot || "unknown"} has visible-name negative prompt conflict`);
            break;
          }
          if (Number(row.visible_no_active_action_conflicts?.length || 0) !== 0) {
            reportProblems.push(`${row.shot || "unknown"} has visible no-active executable action conflict`);
            break;
          }
        }
      }
      if (spec.id === "character_beat_readiness_audit") {
        if (report.decision !== "character_beat_ready") {
          reportProblems.push(`decision ${report.decision || "missing"} is not character_beat_ready`);
        }
        if (Number(report.characters_checked || 0) !== 21) {
          reportProblems.push(`characters_checked ${report.characters_checked || 0} does not match 21`);
        }
        if (Number(report.strict_video_cost_blockers?.length || 0) !== 0) {
          reportProblems.push(`strict_video_cost_blockers ${report.strict_video_cost_blockers.length}`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
        if (!Array.isArray(report.house_checks) || report.house_checks.length !== 3) {
          reportProblems.push("house_checks must cover the three student houses");
        }
        const characterRows = Array.isArray(report.character_rows) ? report.character_rows : [];
        if (characterRows.length !== 21) {
          reportProblems.push(`character_rows ${characterRows.length} does not match 21`);
        }
        if (characterRows.some((row) => row.decision !== "covered")) {
          reportProblems.push("all character rows must be covered");
        }
      }
      if (spec.id === "audio_timing_prompt_contract") {
        if (report.decision !== "audio_timing_prompt_contract_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not audio_timing_prompt_contract_passed`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
        if (Number(report.warnings?.length || 0) !== 0) {
          reportProblems.push(`warnings ${report.warnings.length}`);
        }
        const rows = Array.isArray(report.rows) ? report.rows : [];
        if (rows.length !== expected) {
          reportProblems.push(`rows ${rows.length} does not match ${expected}`);
        }
        for (const row of rows) {
          if (Number(row.problems?.length || 0) !== 0 || Number(row.warnings?.length || 0) !== 0) {
            reportProblems.push(`${row.shot || "unknown"} has audio row problems/warnings`);
            break;
          }
          if (row.dialogue_finality !== "final_or_sound_design_clear") {
            reportProblems.push(`${row.shot || "unknown"} dialogue_finality ${row.dialogue_finality || "missing"} is not final_or_sound_design_clear`);
            break;
          }
          if (Number(row.duration_seconds || 0) !== Number(row.prompt_duration_seconds || 0)) {
            reportProblems.push(`${row.shot || "unknown"} duration does not match prompt duration`);
            break;
          }
        }
      }
      if (spec.id === "motion_probe_clip_structural_audit") {
        const currentProbeFileRows = expectedMotionProbeFileRows();
        const currentProbeFileDigest = sha256Text(`${JSON.stringify(currentProbeFileRows)}\n`);
        const currentProbeVideoRows = expectedMotionProbeVideoRows();
        const currentProbeVideoDigest = sha256Text(`${JSON.stringify(currentProbeVideoRows)}\n`);
        const currentPlayable = currentProbeVideoRows.filter((row) => row.probe.ok).length;
        if (!/^(motion_probe_clips_pending|motion_probe_clip_structural_blocked|motion_probe_clip_structural_passed_motion_review_required)$/.test(report.decision || "")) {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted motion probe clip structural audit decision`);
        }
        if (Number(report.expected_probe_clips || 0) !== expected) {
          reportProblems.push(`expected_probe_clips ${report.expected_probe_clips || 0} does not match ${expected}`);
        }
        if (Number(report.playable_probe_clips || 0) !== currentPlayable) {
          reportProblems.push(`playable_probe_clips ${report.playable_probe_clips || 0} does not match current ${currentPlayable}`);
        }
        if (!Array.isArray(report.expected_probe_file_rows) ||
            report.expected_probe_file_rows.length !== expected) {
          reportProblems.push(`expected_probe_file_rows ${report.expected_probe_file_rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.expected_probe_file_rows) !== JSON.stringify(currentProbeFileRows)) {
          reportProblems.push("expected_probe_file_rows do not match current filesystem state");
        }
        if (report.expected_probe_file_digest_sha256 !== currentProbeFileDigest) {
          reportProblems.push("expected_probe_file_digest_sha256 does not match current filesystem state");
        }
        if (!Array.isArray(report.expected_probe_video_probe_rows) ||
            report.expected_probe_video_probe_rows.length !== expected) {
          reportProblems.push(`expected_probe_video_probe_rows ${report.expected_probe_video_probe_rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.expected_probe_video_probe_rows) !== JSON.stringify(currentProbeVideoRows)) {
          reportProblems.push("expected_probe_video_probe_rows do not match current filesystem state");
        }
        if (report.expected_probe_video_probe_digest_sha256 !== currentProbeVideoDigest) {
          reportProblems.push("expected_probe_video_probe_digest_sha256 does not match current filesystem state");
        }
      }
      if (spec.id === "motion_probe_package_audit") {
        if (report.decision !== "motion_probe_package_ready") {
          reportProblems.push(`decision ${report.decision || "missing"} is not motion_probe_package_ready`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
        if (Number(report.warnings?.length || 0) !== 0) {
          reportProblems.push(`warnings ${report.warnings.length}`);
        }
        const rows = Array.isArray(report.rows) ? report.rows : [];
        if (rows.length !== expected) {
          reportProblems.push(`rows ${rows.length} does not match ${expected}`);
        }
        for (const row of rows) {
          if (Number(row.problems?.length || 0) !== 0 || Number(row.warnings?.length || 0) !== 0) {
            reportProblems.push(`${row.shot || "unknown"} has motion probe row problems/warnings`);
            break;
          }
          if (Number(row.probe_duration_seconds || 0) !== 3) {
            reportProblems.push(`${row.shot || "unknown"} probe duration is not 3 seconds`);
            break;
          }
        }
      }
      if (spec.id === "motion_probe_provider_bundles_audit") {
        if (report.decision !== "motion_probe_provider_bundles_ready") {
          reportProblems.push(`decision ${report.decision || "missing"} is not motion_probe_provider_bundles_ready`);
        }
        if (Number(report.bundles_checked || 0) !== 7) {
          reportProblems.push(`bundles_checked ${report.bundles_checked || 0} is not 7`);
        }
        if (Number(report.rows_checked || 0) !== expected) {
          reportProblems.push(`rows_checked ${report.rows_checked || 0} does not match ${expected}`);
        }
        if (Number(report.unique_custom_ids || 0) !== expected) {
          reportProblems.push(`unique_custom_ids ${report.unique_custom_ids || 0} does not match ${expected}`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
        if (Number(report.warnings?.length || 0) !== 0) {
          reportProblems.push(`warnings ${report.warnings.length}`);
        }
      }
      if (spec.id === "motion_probe_operator_tracker") {
        if (!["motion_probe_operator_tracker_ready_clips_pending", "motion_probe_operator_tracker_complete"].includes(report.decision)) {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted motion probe operator tracker decision`);
        }
        if (Number(report.batches || 0) !== 7) {
          reportProblems.push(`batches ${report.batches || 0} is not 7`);
        }
        if (Number(report.expected_probe_rows || 0) !== expected) {
          reportProblems.push(`expected_probe_rows ${report.expected_probe_rows || 0} does not match ${expected}`);
        }
        if (Number(report.returned_mp4_ready || 0) > expected) {
          reportProblems.push(`returned_mp4_ready ${report.returned_mp4_ready || 0} exceeds ${expected}`);
        }
        if (Number(report.ingested_probe_ready || 0) > expected) {
          reportProblems.push(`ingested_probe_ready ${report.ingested_probe_ready || 0} exceeds ${expected}`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "motion_probe_operator_tracker_audit") {
        if (report.decision !== "motion_probe_operator_tracker_audit_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not motion_probe_operator_tracker_audit_passed`);
        }
        if (Number(report.batches_checked || 0) !== 7) {
          reportProblems.push(`batches_checked ${report.batches_checked || 0} is not 7`);
        }
        if (Number(report.expected_probe_rows || 0) !== expected) {
          reportProblems.push(`expected_probe_rows ${report.expected_probe_rows || 0} does not match ${expected}`);
        }
        if (Number(report.csv_rows || 0) !== expected) {
          reportProblems.push(`csv_rows ${report.csv_rows || 0} does not match ${expected}`);
        }
        if (Number(report.unique_custom_ids || 0) !== expected) {
          reportProblems.push(`unique_custom_ids ${report.unique_custom_ids || 0} does not match ${expected}`);
        }
        if (Number(report.unique_expected_probe_filenames || 0) !== expected) {
          reportProblems.push(`unique_expected_probe_filenames ${report.unique_expected_probe_filenames || 0} does not match ${expected}`);
        }
        if (Number(report.returned_mp4_ready || 0) > expected) {
          reportProblems.push(`returned_mp4_ready ${report.returned_mp4_ready || 0} exceeds ${expected}`);
        }
        if (Number(report.ingested_probe_ready || 0) > expected) {
          reportProblems.push(`ingested_probe_ready ${report.ingested_probe_ready || 0} exceeds ${expected}`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "motion_probe_submission_ready_gate") {
        if (report.decision !== "motion_probe_submission_ready") {
          reportProblems.push(`decision ${report.decision || "missing"} is not motion_probe_submission_ready`);
        }
        if (Number(report.provider_bundle_count || 0) !== 7) {
          reportProblems.push(`provider_bundle_count ${report.provider_bundle_count || 0} is not 7`);
        }
        if (Number(report.provider_zip_count || 0) !== 7) {
          reportProblems.push(`provider_zip_count ${report.provider_zip_count || 0} is not 7`);
        }
        if (Number(report.unique_probe_custom_ids || 0) !== expected) {
          reportProblems.push(`unique_probe_custom_ids ${report.unique_probe_custom_ids || 0} does not match ${expected}`);
        }
        if (Number(report.return_batches || 0) !== 7) {
          reportProblems.push(`return_batches ${report.return_batches || 0} is not 7`);
        }
        if (Number(report.returned_probe_mp4_ready || 0) !== 0) {
          reportProblems.push(`returned_probe_mp4_ready ${report.returned_probe_mp4_ready || 0} should be 0 before probe submission`);
        }
        if (Number(report.ingested_probe_ready || 0) !== 0) {
          reportProblems.push(`ingested_probe_ready ${report.ingested_probe_ready || 0} should be 0 before probe submission`);
        }
        if (report.full_duration_release?.can_release_full_duration === true) {
          reportProblems.push("full-duration release is unlocked before probe submission");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "handoff_control_reports_audit") {
        if (report.decision !== "handoff_control_reports_audit_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not handoff_control_reports_audit_passed`);
        }
        if (Number(report.expected_shots || 0) !== expected) {
          reportProblems.push(`expected_shots ${report.expected_shots || 0} does not match ${expected}`);
        }
        if (Number(report.required_reports_checked || 0) !== 11) {
          reportProblems.push(`required_reports_checked ${report.required_reports_checked || 0} is not 11`);
        }
        if (Number(report.declared_required_reports || 0) !== 11) {
          reportProblems.push(`declared_required_reports ${report.declared_required_reports || 0} is not 11`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "motion_probe_return_intake_audit") {
        if (report.decision !== "motion_probe_return_intake_ready") {
          reportProblems.push(`decision ${report.decision || "missing"} is not motion_probe_return_intake_ready`);
        }
        if (Number(report.batches_checked || 0) !== 7) {
          reportProblems.push(`batches_checked ${report.batches_checked || 0} is not 7`);
        }
        if (Number(report.expected_probe_rows || 0) !== expected) {
          reportProblems.push(`expected_probe_rows ${report.expected_probe_rows || 0} does not match ${expected}`);
        }
        if (Number(report.unique_custom_ids || 0) !== expected) {
          reportProblems.push(`unique_custom_ids ${report.unique_custom_ids || 0} does not match ${expected}`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
        if (Number(report.warnings?.length || 0) !== 0) {
          reportProblems.push(`warnings ${report.warnings.length}`);
        }
        const rows = Array.isArray(report.rows) ? report.rows : [];
        for (const row of rows) {
          if (!String(row.expected_probe_clip || "").endsWith("_probe.mp4")) {
            reportProblems.push(`${row.shot || "unknown"} expected_probe_clip is not _probe.mp4`);
            break;
          }
        }
      }
      if (spec.id === "motion_probe_return_roundtrip_audit") {
        if (report.decision !== "motion_probe_return_roundtrip_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not motion_probe_return_roundtrip_passed`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
        const scenarios = Array.isArray(report.scenarios) ? report.scenarios : [];
        const requiredScenarios = new Map([
          ["expected_probe_filename", { decision: "motion_probe_ingest_dry_run_ready", files_scanned: 42, would_copy: 42, copied: 0 }],
          ["custom_id_prefix", { decision: "motion_probe_ingest_dry_run_ready", files_scanned: 42, would_copy: 42, copied: 0 }],
          ["nested_intake_root_expected_probe_filenames", { decision: "motion_probe_ingest_dry_run_ready", files_scanned: 42, would_copy: 42, copied: 0 }],
          ["bare_shot_probe_name_rejected", { decision: "motion_probe_ingest_blocked", files_scanned: 6, would_copy: 0, copied: 0, unmatched_video_files: 6 }],
          ["full_duration_clip_name_rejected", { decision: "motion_probe_ingest_blocked", files_scanned: 6, would_copy: 0, copied: 0, unmatched_video_files: 6 }],
          ["invalid_mp4_rejected", { decision: "motion_probe_ingest_blocked", files_scanned: 1, would_copy: 0, copied: 0, invalid_video_files: 1 }],
          ["unsupported_format_rejected", { decision: "motion_probe_ingest_blocked", files_scanned: 1, would_copy: 0, copied: 0, unsupported_video_files: 1 }],
        ]);
        if (scenarios.length !== requiredScenarios.size) {
          reportProblems.push(`scenarios ${scenarios.length} does not match ${requiredScenarios.size}`);
        }
        for (const [strategy, expectedScenario] of requiredScenarios) {
          const scenario = scenarios.find((item) => item.strategy === strategy);
          if (!scenario) {
            reportProblems.push(`missing scenario ${strategy}`);
            continue;
          }
          for (const [key, expectedValue] of Object.entries(expectedScenario)) {
            if (scenario[key] !== expectedValue) {
              reportProblems.push(`${strategy}: ${key} ${scenario[key]} does not match ${expectedValue}`);
              break;
            }
          }
          if (Number(scenario.problems?.length || 0) !== 0) {
            reportProblems.push(`${strategy}: problems ${scenario.problems.length}`);
          }
        }
      }
      if (spec.id === "motion_probe_review_packet_audit") {
        const currentProbeFileRows = expectedMotionProbeFileRows();
        const currentProbeFileDigest = sha256Text(`${JSON.stringify(currentProbeFileRows)}\n`);
        const currentProbeVideoRows = expectedMotionProbeVideoRows();
        const currentProbeVideoDigest = sha256Text(`${JSON.stringify(currentProbeVideoRows)}\n`);
        const currentPlayable = currentProbeVideoRows.filter((row) => row.probe.ok).length;
        const accepted = new Set([
          "motion_probe_review_packet_ready_clips_pending",
          "motion_probe_review_packet_ready_codex_review_required",
          "motion_probe_review_packet_partial_codex_review_required",
        ]);
        if (!accepted.has(report.decision || "")) {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted motion probe review packet decision`);
        }
        if (Number(report.expected_probe_clips || 0) !== expected) {
          reportProblems.push(`expected_probe_clips ${report.expected_probe_clips || 0} does not match ${expected}`);
        }
        if (Number(report.rows_checked || 0) !== expected) {
          reportProblems.push(`rows_checked ${report.rows_checked || 0} does not match ${expected}`);
        }
        if (Number(report.playable_probe_clips || 0) !== currentPlayable) {
          reportProblems.push(`playable_probe_clips ${report.playable_probe_clips || 0} does not match current ${currentPlayable}`);
        }
        if (Number(report.full_duration_approvals || 0) !== 0) {
          reportProblems.push(`full_duration_approvals ${report.full_duration_approvals || 0} must remain 0 before Codex-reviewed probe pass`);
        }
        if (!Array.isArray(report.expected_probe_file_rows) ||
            report.expected_probe_file_rows.length !== expected) {
          reportProblems.push(`expected_probe_file_rows ${report.expected_probe_file_rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.expected_probe_file_rows) !== JSON.stringify(currentProbeFileRows)) {
          reportProblems.push("expected_probe_file_rows do not match current filesystem state");
        }
        if (report.expected_probe_file_digest_sha256 !== currentProbeFileDigest) {
          reportProblems.push("expected_probe_file_digest_sha256 does not match current filesystem state");
        }
        if (!Array.isArray(report.expected_probe_video_probe_rows) ||
            report.expected_probe_video_probe_rows.length !== expected) {
          reportProblems.push(`expected_probe_video_probe_rows ${report.expected_probe_video_probe_rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.expected_probe_video_probe_rows) !== JSON.stringify(currentProbeVideoRows)) {
          reportProblems.push("expected_probe_video_probe_rows do not match current ffprobe state");
        }
        if (report.expected_probe_video_probe_digest_sha256 !== currentProbeVideoDigest) {
          reportProblems.push("expected_probe_video_probe_digest_sha256 does not match current ffprobe state");
        }
        const rows = Array.isArray(report.rows) ? report.rows : [];
        if (rows.length !== expected) {
          reportProblems.push(`rows ${rows.length} does not match ${expected}`);
        }
        for (const row of rows) {
          if (!String(row.expected_probe_clip || "").endsWith("_probe.mp4")) {
            reportProblems.push(`${row.shot || "unknown"} expected_probe_clip is not _probe.mp4`);
            break;
          }
          if (row.parent_expected_clip && String(row.parent_expected_clip).endsWith("_probe.mp4")) {
            reportProblems.push(`${row.shot || "unknown"} parent_expected_clip points at a probe`);
            break;
          }
          if (row.review_frames_ready && currentPlayable === 0) {
            reportProblems.push(`${row.shot || "unknown"} claims review frames ready while no probe clips are playable`);
            break;
          }
        }
      }
      if (spec.id === "motion_probe_review_apply_gate") {
        const accepted = new Set([
          "motion_probe_review_apply_blocked_clips_pending",
          "motion_probe_review_apply_blocked_invalid_proposal",
          "motion_probe_review_apply_valid_revisions_required",
          "motion_probe_review_apply_passed",
        ]);
        if (!accepted.has(report.decision || "")) {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted motion probe review apply gate decision`);
        }
        if (Number(report.expected_probe_clips || 0) !== expected) {
          reportProblems.push(`expected_probe_clips ${report.expected_probe_clips || 0} does not match ${expected}`);
        }
        if (Number(report.proposal_rows || 0) !== expected) {
          reportProblems.push(`proposal_rows ${report.proposal_rows || 0} does not match ${expected}`);
        }
        if (report.decision === "motion_probe_review_apply_blocked_clips_pending") {
          if (Number(report.passed_rows || 0) !== 0) {
            reportProblems.push(`passed_rows ${report.passed_rows || 0} must be 0 while probe clips are pending`);
          }
          if (report.release_written === true) {
            reportProblems.push("release_written must be false while probe clips are pending");
          }
          const problemText = (report.problems || []).join("\n");
          if (!/probe clips are not complete/.test(problemText)) {
            reportProblems.push("blocked-clips-pending apply gate is missing probe-clips-not-complete problem evidence");
          }
        }
        if (report.decision === "motion_probe_review_apply_passed") {
          if (Number(report.passed_rows || 0) !== expected) {
            reportProblems.push(`passed_rows ${report.passed_rows || 0} does not match ${expected}`);
          }
          if (Number(report.counters?.full_duration_approved_rows || 0) !== expected) {
            reportProblems.push("full_duration_approved_rows does not match expected after passed apply gate");
          }
          if (!report.release?.release_rows_digest_sha256) {
            reportProblems.push("passed apply gate missing release_rows_digest_sha256");
          }
        }
      }
      if (spec.id === "motion_probe_review_apply_positive_contract") {
        if (report.decision !== "motion_probe_review_apply_positive_contract_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not motion_probe_review_apply_positive_contract_passed`);
        }
        if (Number(report.expected_probe_clips || 0) !== expected) {
          reportProblems.push(`expected_probe_clips ${report.expected_probe_clips || 0} does not match ${expected}`);
        }
        if (report.positive?.decision !== "motion_probe_review_apply_passed") {
          reportProblems.push(`positive decision ${report.positive?.decision || "missing"} is not motion_probe_review_apply_passed`);
        }
        if (Number(report.positive?.passed_rows || 0) !== expected) {
          reportProblems.push(`positive passed_rows ${report.positive?.passed_rows || 0} does not match ${expected}`);
        }
        for (const key of [
          "probe_clip_signature_matched_rows",
          "review_frame_signature_matched_rows",
          "review_evidence_complete_rows",
          "required_checks_complete_rows",
          "full_duration_approved_rows",
          "codex_reviewed_rows",
        ]) {
          if (Number(report.positive?.counters?.[key] || 0) !== expected) {
            reportProblems.push(`positive counter ${key} ${report.positive?.counters?.[key] || 0} does not match ${expected}`);
          }
        }
        const negativeCases = Array.isArray(report.negative_cases) ? report.negative_cases : [];
        const requiredNegativeCases = new Set([
          "stale_probe_clip_signature_rejected",
          "stale_review_frame_signature_rejected",
          "user_reviewer_rejected",
          "approval_without_pass_rejected",
        ]);
        if (negativeCases.length !== requiredNegativeCases.size) {
          reportProblems.push(`negative cases ${negativeCases.length} does not match ${requiredNegativeCases.size}`);
        }
        for (const name of requiredNegativeCases) {
          const item = negativeCases.find((candidate) => candidate.name === name);
          if (!item?.rejected) reportProblems.push(`negative case ${name} was not rejected`);
        }
        if (report.production_safety?.source_package_probe_release_exists !== false) {
          reportProblems.push("positive contract indicates production full-duration probe release exists");
        }
        if (Number(report.production_safety?.source_expected_probe_clips_existing || 0) !== 0) {
          reportProblems.push("positive contract indicates production probe clips exist");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "actual_delivery_surface_audit") {
        if (report.decision !== "actual_delivery_surface_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not actual_delivery_surface_passed`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "current_hanneman_contract_audit") {
        if (report.decision !== "current_hanneman_contract_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not current_hanneman_contract_passed`);
        }
        if (report.shot !== "Shot034B") {
          reportProblems.push(`shot ${report.shot || "missing"} is not Shot034B`);
        }
        if (JSON.stringify(report.visible_named_only || []) !== JSON.stringify(["Byleth", "Dimitri"])) {
          reportProblems.push(`visible_named_only ${JSON.stringify(report.visible_named_only || [])} is not Byleth/Dimitri`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "current_status_consistency_gate") {
        if (report.decision !== "current_status_consistency_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not current_status_consistency_passed`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
        if (report.authoritative_evidence?.video_generation_run_completion?.decision !== "video_generation_run_blocked_clips_pending") {
          reportProblems.push("current status gate does not preserve clips-pending completion decision");
        }
        const statusCompletion = report.authoritative_evidence?.video_generation_run_completion || {};
        const statusProjected = projectedCompletionSnapshot(statusCompletion);
        if (statusProjected.decision !== "video_generation_run_blocked_clips_pending" ||
            Number(statusProjected.passed_checks || 0) !== 23 ||
            Number(statusProjected.total_checks || 0) !== 30) {
          reportProblems.push("current status gate completion snapshot is not a valid clips-pending fixed point");
        }
      }
      if (spec.id === "provider_preflight_consistency_gate") {
        if (report.decision !== "provider_preflight_consistency_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not provider_preflight_consistency_passed`);
        }
        if (typeof report.can_submit_to_provider !== "boolean" || typeof report.computed_can_submit_to_provider !== "boolean") {
          reportProblems.push("provider preflight consistency does not expose boolean can_submit_to_provider fields");
        }
        const releaseDecision = report.full_duration_release_gate?.decision || null;
        if (report.can_submit_to_provider === true && releaseDecision !== "full_duration_release_passed") {
          reportProblems.push(`provider preflight allows submit but full_duration_release_gate is ${releaseDecision || "missing"}`);
        }
        if (report.can_submit_to_provider === false && releaseDecision === "full_duration_release_passed") {
          reportProblems.push("provider preflight blocks submit even though full_duration_release_gate passed");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "after_clip_return_resume") {
        const embeddedCompletion = report.snapshot?.video_generation_run_completion || {};
        const projectedEmbeddedCompletion = projectedCompletionSnapshot(embeddedCompletion);
        if (report.decision !== "after_clip_return_clips_pending" && report.decision !== "video_generation_run_complete" && report.decision !== "after_clip_return_ready_for_concat") {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted after-clip-return resume decision`);
        }
        for (const key of ["decision", "total_checks"]) {
          const embeddedValue = String(embeddedCompletion[key] ?? "");
          const currentValue = String(currentCompletionReport[key] ?? "");
          const projectedValue = String(projectedCompletionReport[key] ?? "");
          const embeddedProjectedValue = String(projectedEmbeddedCompletion[key] ?? "");
          if (embeddedValue !== currentValue && embeddedValue !== projectedValue && embeddedProjectedValue !== projectedValue) {
            reportProblems.push(`embedded completion ${key} ${embeddedCompletion[key] ?? "missing"} matches neither current completion ${currentCompletionReport[key] ?? "missing"} nor projected completion ${projectedCompletionReport[key] ?? "missing"}`);
          }
        }
        const embeddedPassed = Number(embeddedCompletion.passed_checks || 0);
        const currentPassed = Number(currentCompletionReport.passed_checks || 0);
        const projectedPassed = Number(projectedCompletionReport.passed_checks || 0);
        if (embeddedCompletion.decision !== "video_generation_run_blocked_clips_pending" ||
            embeddedPassed > Math.max(currentPassed, projectedPassed) ||
            embeddedPassed < Math.max(0, Math.min(currentPassed, projectedPassed) - 3)) {
          reportProblems.push(`embedded completion passed_checks ${embeddedCompletion.passed_checks ?? "missing"} is not a plausible clips-pending wrapper snapshot`);
        }
        if (Number(report.snapshot?.clip_structural?.expected_clips || 0) !== expected) {
          reportProblems.push(`embedded clip expected ${report.snapshot?.clip_structural?.expected_clips || 0} does not match ${expected}`);
        }
      }
      if (spec.id === "clip_return_roundtrip_audit") {
        const scenarios = new Map((report.scenarios || []).map((scenario) => [scenario.strategy, scenario]));
        const expectedFilename = scenarios.get("expected_filename");
        const customIdPrefix = scenarios.get("custom_id_prefix");
        const looseRejected = scenarios.get("loose_shot_name_rejected");
        if (report.decision !== "clip_return_roundtrip_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not clip_return_roundtrip_passed`);
        }
        if (!expectedFilename || Number(expectedFilename.unique_matched_shots || 0) !== expected) {
          reportProblems.push("expected_filename scenario does not map all 42 shots");
        }
        if (!customIdPrefix || Number(customIdPrefix.unique_matched_shots || 0) !== expected) {
          reportProblems.push("custom_id_prefix scenario does not map all 42 shots");
        }
        if (!looseRejected || Number(looseRejected.unique_matched_shots || 0) !== 0 || Number(looseRejected.would_copy || 0) !== 0) {
          reportProblems.push("loose_shot_name_rejected scenario is missing or not rejected");
        }
      }
      if (spec.id === "clip_provenance_gate") {
        const currentClipProbeRows = expectedClipProbeRows(shots);
        const currentPlayableClips = currentClipProbeRows.filter((row) => row.probe.ok).length;
        const currentProvenanceRows = clipProvenanceRows(shots);
        const currentProvenanceRowsDigest = sha256Text(`${JSON.stringify(currentProvenanceRows)}\n`);
        if (!/^clip_provenance_(ready_clips_pending|passed_all_expected_clips)$/.test(report.decision || "")) {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted provenance gate decision`);
        }
        if (Number(report.expected_clips || 0) !== expected) {
          reportProblems.push(`expected_clips ${report.expected_clips || 0} does not match ${expected}`);
        }
        if (Number(report.existing_clips || 0) !== currentPlayableClips) {
          reportProblems.push(`existing_clips ${report.existing_clips || 0} does not match current playable expected clips ${currentPlayableClips}`);
        }
        if (report.decision === "clip_provenance_passed_all_expected_clips") {
          if (Number(report.provenance_rows || 0) !== expected) {
            reportProblems.push(`provenance_rows ${report.provenance_rows || 0} does not match ${expected}`);
          }
          if (Number(report.provenance_matched_existing_clips || 0) !== expected) {
            reportProblems.push(`provenance_matched_existing_clips ${report.provenance_matched_existing_clips || 0} does not match ${expected}`);
          }
        } else if (Number(report.provenance_matched_existing_clips || 0) !== currentPlayableClips) {
          reportProblems.push(`provenance_matched_existing_clips ${report.provenance_matched_existing_clips || 0} does not match current playable expected clips ${currentPlayableClips}`);
        }
        if (!Array.isArray(report.rows) || report.rows.length !== expected) {
          reportProblems.push(`clip provenance gate rows ${report.rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.rows) !== JSON.stringify(currentProvenanceRows)) {
          reportProblems.push("clip provenance gate rows do not match current filesystem/provenance state");
        }
        if (!report.rows_digest_sha256) {
          reportProblems.push("clip provenance gate missing rows_digest_sha256");
        } else if (report.rows_digest_sha256 !== currentProvenanceRowsDigest) {
          reportProblems.push("clip provenance gate rows_digest_sha256 does not match current filesystem/provenance state");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "positive_contract_isolation_gate") {
        if (report.decision !== "positive_contract_isolation_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not positive_contract_isolation_passed`);
        }
        if (Number(report.contracts_checked || 0) !== 6) {
          reportProblems.push(`contracts_checked ${report.contracts_checked || 0} does not match 6`);
        }
        if (report.production_final_output_exists === true) {
          reportProblems.push("production final output exists during isolation gate");
        }
        if (report.production_completion_decision !== "video_generation_run_blocked_clips_pending") {
          reportProblems.push(`production_completion_decision ${report.production_completion_decision || "missing"} is not video_generation_run_blocked_clips_pending`);
        }
        if (report.production_completion_highest_target !== "prompt_asset_package") {
          reportProblems.push(`production_completion_highest_target ${report.production_completion_highest_target || "missing"} is not prompt_asset_package`);
        }
        if (report.production_truth_gate_can_claim_video_generation_run !== false) {
          reportProblems.push("production truth gate can_claim_video_generation_run is not false in isolation gate");
        }
        if (report.production_truth_gate_highest_target !== "prompt_asset_package") {
          reportProblems.push(`production_truth_gate_highest_target ${report.production_truth_gate_highest_target || "missing"} is not prompt_asset_package`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "production_delivery_truth_gate") {
        const currentClipRows = expectedClipFileRows(shots);
        const currentClipDigest = sha256Text(`${JSON.stringify(currentClipRows)}\n`);
        const currentClipProbeRows = expectedClipProbeRows(shots);
        const currentClipProbeDigest = sha256Text(`${JSON.stringify(currentClipProbeRows)}\n`);
        const currentPlayableClips = currentClipProbeRows.filter((row) => row.probe.ok).length;
        if (!/^production_delivery_truth_(blocked_clips_pending|blocked_incomplete_real_evidence|passed)$/.test(report.decision || "")) {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted production delivery truth decision`);
        }
        if (report.can_claim_video_generation_run === true && report.highest_truthful_target !== "video_generation_run") {
          reportProblems.push("can_claim_video_generation_run is true without video_generation_run as highest truthful target");
        }
        if (report.can_claim_video_generation_run !== true && report.highest_truthful_target !== "prompt_asset_package") {
          reportProblems.push(`blocked truth gate highest_truthful_target ${report.highest_truthful_target || "missing"} is not prompt_asset_package`);
        }
        if (Number(report.real_evidence?.expected_clip_files_required || 0) !== expected) {
          reportProblems.push(`expected_clip_files_required ${report.real_evidence?.expected_clip_files_required || 0} does not match ${expected}`);
        }
        if (!report.real_evidence?.expected_clip_files_digest_sha256) {
          reportProblems.push("production truth gate missing expected_clip_files_digest_sha256");
        }
        if (!Array.isArray(report.real_evidence?.expected_clip_file_rows) ||
            report.real_evidence.expected_clip_file_rows.length !== expected) {
          reportProblems.push(`production truth gate expected_clip_file_rows ${report.real_evidence?.expected_clip_file_rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.real_evidence.expected_clip_file_rows) !== JSON.stringify(currentClipRows)) {
          reportProblems.push("production truth gate expected_clip_file_rows do not match current filesystem state");
        }
        if (report.real_evidence?.expected_clip_files_digest_sha256 &&
            report.real_evidence.expected_clip_files_digest_sha256 !== currentClipDigest) {
          reportProblems.push("production truth gate expected_clip_files_digest_sha256 does not match current filesystem state");
        }
        if (!report.real_evidence?.expected_clip_video_probe_digest_sha256) {
          reportProblems.push("production truth gate missing expected_clip_video_probe_digest_sha256");
        }
        if (!Array.isArray(report.real_evidence?.expected_clip_video_probe_rows) ||
            report.real_evidence.expected_clip_video_probe_rows.length !== expected) {
          reportProblems.push(`production truth gate expected_clip_video_probe_rows ${report.real_evidence?.expected_clip_video_probe_rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.real_evidence.expected_clip_video_probe_rows) !== JSON.stringify(currentClipProbeRows)) {
          reportProblems.push("production truth gate expected_clip_video_probe_rows do not match current filesystem state");
        }
        if (report.real_evidence?.expected_clip_video_probe_digest_sha256 &&
            report.real_evidence.expected_clip_video_probe_digest_sha256 !== currentClipProbeDigest) {
          reportProblems.push("production truth gate expected_clip_video_probe_digest_sha256 does not match current filesystem state");
        }
        if (Number(report.real_evidence?.expected_clip_video_probe_required || 0) !== expected) {
          reportProblems.push(`expected_clip_video_probe_required ${report.real_evidence?.expected_clip_video_probe_required || 0} does not match ${expected}`);
        }
        if (Number(report.real_evidence?.expected_clip_video_probe_playable || 0) !== currentPlayableClips) {
          reportProblems.push(`expected_clip_video_probe_playable ${report.real_evidence?.expected_clip_video_probe_playable || 0} does not match current filesystem playable clips ${currentPlayableClips}`);
        }
        if (report.real_evidence?.final_output_exists === true && !report.real_evidence?.final_edit_structural_sha256) {
          reportProblems.push("production truth gate final output exists without final_edit_structural_sha256");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "motion_self_audit_apply_gate") {
        const currentBattleLedgerRows = battleLedgerRows(shots);
        const currentBattleLedgerRowsDigest = sha256Text(`${JSON.stringify(currentBattleLedgerRows)}\n`);
        if (!/^motion_self_audit_apply_(blocked_clips_pending|passed|valid_revisions_required)$/.test(report.decision || "")) {
          reportProblems.push(`decision ${report.decision || "missing"} is not an accepted self-audit apply gate decision`);
        }
        if (report.decision === "motion_self_audit_apply_passed" && report.applied !== true) {
          reportProblems.push("passed apply gate must have applied=true");
        }
        if (report.decision === "motion_self_audit_apply_passed") {
          for (const key of [
            "clip_signature_matched_rows",
            "review_frame_signature_matched_rows",
            "review_evidence_complete_rows",
            "ledger_matched_rows",
            "required_checks_complete_rows",
          ]) {
            if (Number(report.evidence_counters?.[key] || 0) !== expected) {
              reportProblems.push(`evidence_counters.${key} ${report.evidence_counters?.[key] || 0} does not match ${expected}`);
            }
          }
        }
        if (report.battle_ledger_signature?.rows_digest_ok !== true ||
            report.battle_ledger_signature?.rows_digest_sha256 !== currentBattleLedgerRowsDigest ||
            report.battle_ledger_signature?.current_rows_digest_sha256 !== currentBattleLedgerRowsDigest ||
            !Array.isArray(report.battle_ledger_signature?.rows) ||
            JSON.stringify(report.battle_ledger_signature.rows) !== JSON.stringify(currentBattleLedgerRows)) {
          reportProblems.push("battle_ledger_signature does not match current package battle-ledger state");
        }
      }
      if (spec.id === "battle_ledger_timeline") {
        const currentBattleLedgerRows = battleLedgerRows(shots);
        const currentBattleLedgerRowsDigest = sha256Text(`${JSON.stringify(currentBattleLedgerRows)}\n`);
        const currentStateMachineRows = battleLedgerStateMachineRows(shots);
        const currentStateMachineRowsDigest = sha256Text(`${JSON.stringify(currentStateMachineRows)}\n`);
        if (report.decision !== "battle_ledger_timeline_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not battle_ledger_timeline_passed`);
        }
        if (Number(report.shots || 0) !== expected) {
          reportProblems.push(`shots ${report.shots || 0} does not match ${expected}`);
        }
        if (!Array.isArray(report.rows) || report.rows.length !== expected) {
          reportProblems.push(`battle ledger rows ${report.rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.rows) !== JSON.stringify(currentBattleLedgerRows)) {
          reportProblems.push("battle ledger rows do not match current package battle-ledger state");
        }
        if (report.rows_digest_sha256 !== currentBattleLedgerRowsDigest) {
          reportProblems.push("battle ledger rows_digest_sha256 does not match current package battle-ledger state");
        }
        if (!Array.isArray(report.state_machine_rows) || report.state_machine_rows.length !== expected) {
          reportProblems.push(`battle ledger state_machine_rows ${report.state_machine_rows?.length || 0} does not match ${expected}`);
        } else if (JSON.stringify(report.state_machine_rows) !== JSON.stringify(currentStateMachineRows)) {
          reportProblems.push("battle ledger state_machine_rows do not match current package prompt/ledger state");
        }
        if (report.state_machine_rows_digest_sha256 !== currentStateMachineRowsDigest) {
          reportProblems.push("battle ledger state_machine_rows_digest_sha256 does not match current package prompt/ledger state");
        }
        if (currentStateMachineRows.some((row) => Number(row.state_machine_problems?.length || 0) !== 0)) {
          reportProblems.push("current battle ledger state machine has active-return or retired-visibility problems");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "motion_self_audit_evidence_contract") {
        if (report.decision !== "motion_self_audit_evidence_contract_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not motion_self_audit_evidence_contract_passed`);
        }
        if (Number(report.rows_with_review_frame_signature_keys || 0) !== expected) {
          reportProblems.push(`rows_with_review_frame_signature_keys ${report.rows_with_review_frame_signature_keys || 0} does not match ${expected}`);
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (spec.id === "motion_self_audit_unsigned_evidence_rejection") {
        if (report.decision !== "motion_self_audit_unsigned_evidence_rejection_passed") {
          reportProblems.push(`decision ${report.decision || "missing"} is not motion_self_audit_unsigned_evidence_rejection_passed`);
        }
        if (Number(report.probe?.frame_signature_rejections || 0) !== expected * 3) {
          reportProblems.push(`frame_signature_rejections ${report.probe?.frame_signature_rejections || 0} does not match ${expected * 3}`);
        }
        if (Number(report.probe?.clip_signature_rejections || 0) !== expected) {
          reportProblems.push(`clip_signature_rejections ${report.probe?.clip_signature_rejections || 0} does not match ${expected}`);
        }
        if (report.reports_restored_to_default_proposal !== true) {
          reportProblems.push("default apply gate report was not restored after negative probe");
        }
        if (Number(report.problems?.length || 0) !== 0) {
          reportProblems.push(`problems ${report.problems.length}`);
        }
      }
      if (info && manifestInfo && new Date(info.mtime) < new Date(manifestInfo.mtime)) {
        freshnessBasis = reportProblems.length
          ? "stale_mtime_with_semantic_problems"
          : "semantic_alignment_passed_after_manifest_mtime";
      } else if (info) {
        freshnessBasis = "mtime_current_or_newer_than_manifest";
      }
    }
    for (const problem of reportProblems) problems.push(`${spec.id}: ${problem}`);
    reportRows.push({
      id: spec.id,
      file: spec.file,
      exists: Boolean(info),
      readable_json: Boolean(report),
      decision: report?.decision || null,
      mtime: info?.mtime || null,
      sha256: info?.sha256 || null,
      freshness_basis: freshnessBasis,
      checked_against_package_manifest_sha256: manifestInfo?.sha256 || null,
      problems: reportProblems,
    });
  }

  const payload = checkSubmissionPayload(shots, manifest, problems);
  const decision = problems.length
    ? "report_freshness_blocked"
    : "report_freshness_passed_current_manifest";
  const report = {
    date,
    package_id: manifest.package_id,
    package_manifest: rel(manifestPath),
    package_manifest_sha256: manifestInfo.sha256,
    expected_shots: expected,
    decision,
    problems,
    warnings,
    submission_payload: payload,
    reports_checked: reportRows.length,
    report_rows: reportRows,
    shot_signature_sha256: crypto
      .createHash("sha256")
      .update(JSON.stringify(shots.map(shotSignature)))
      .digest("hex"),
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Report Freshness Gate",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Package manifest SHA-256: \`${report.package_manifest_sha256}\``,
    `Reports checked: ${reportRows.length}`,
    "",
    "This gate verifies that package-local reports still align with the current 42-shot package manifest. Timestamp warnings are allowed when a later status/preflight write updates manifest metadata without changing shot content.",
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
  writeText(outMd, md);
  writeText(packageOutMd, md);

  console.log(JSON.stringify({
    decision,
    reports_checked: reportRows.length,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));

  if (decision === "report_freshness_blocked") process.exit(1);
}

main();
