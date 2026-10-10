#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-09";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const productionDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(productionDir, `scene09_goal_completion_matrix_${date}.json`);
const outMd = path.join(productionDir, `scene09_goal_completion_matrix_${date}.md`);
const packageOutJson = path.join(packageDir, "goal_completion_matrix.json");
const packageOutMd = path.join(packageDir, "goal_completion_matrix.md");

function readJson(relOrAbs) {
  const file = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(root, relOrAbs);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function exists(relOrAbs) {
  const file = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(root, relOrAbs);
  return fs.existsSync(file);
}

function rel(absPath) {
  return path.relative(root, absPath);
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function csvDataRows(file) {
  if (!exists(file)) return 0;
  const lines = fs.readFileSync(path.isAbsolute(file) ? file : path.join(root, file), "utf8")
    .split(/\r?\n/)
    .filter(Boolean);
  return Math.max(0, lines.length - 1);
}

function jsonlRows(file) {
  if (!exists(file)) return 0;
  return fs.readFileSync(path.isAbsolute(file) ? file : path.join(root, file), "utf8")
    .split(/\r?\n/)
    .filter(Boolean).length;
}

function addRequirement(rows, id, requirement, ok, evidence, gaps = []) {
  rows.push({
    id,
    requirement,
    status: ok ? "proved" : "incomplete",
    evidence,
    gaps,
  });
}

function main() {
  const manifestPath = path.join(packageDir, "package_manifest.json");
  const manifest = readJson(manifestPath);
  const shots = [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const requirements = [];
  const problems = [];
  const externalPending = [];

  const frameKinds = ["start_frame", "key_frame", "end_frame"];
  const missingShotFiles = [];
  const duplicateFramePairs = [];
  for (const shot of shots) {
    const shotDir = path.join(packageDir, shot.package_dir || "");
    for (const name of ["prompt.md", "model_prompt.md", "negative_prompt.md", "metadata.json"]) {
      if (!fs.existsSync(path.join(shotDir, name))) missingShotFiles.push(`${shot.shot}:${name}`);
    }
    const hashes = {};
    for (const kind of frameKinds) {
      const frame = path.join(shotDir, `${kind}.png`);
      if (!fs.existsSync(frame)) {
        missingShotFiles.push(`${shot.shot}:${kind}.png`);
      } else {
        hashes[kind] = sha256(frame);
      }
    }
    for (const [a, b] of [["start_frame", "key_frame"], ["key_frame", "end_frame"], ["start_frame", "end_frame"]]) {
      if (hashes[a] && hashes[a] === hashes[b]) duplicateFramePairs.push(`${shot.shot}:${a}=${b}`);
    }
  }

  addRequirement(
    requirements,
    "shot_package_count",
    "Scene09 current handoff package contains exactly 42 ordered shot work orders.",
    shots.length === 42,
    { package_manifest: rel(manifestPath), shots: shots.length },
    shots.length === 42 ? [] : [`expected 42 shots, found ${shots.length}`],
  );

  addRequirement(
    requirements,
    "per_shot_prompt_frame_assets",
    "Every shot has package-local prompt/model_prompt/negative_prompt/metadata plus start/key/end PNG frame anchors.",
    missingShotFiles.length === 0,
    {
      checked_shots: shots.length,
      expected_files_per_shot: 7,
      expected_total_files: 294,
      missing_count: missingShotFiles.length,
    },
    missingShotFiles,
  );

  addRequirement(
    requirements,
    "frame_anchor_distinctness",
    "Start/key/end anchors are not exact duplicate files within any shot.",
    duplicateFramePairs.length === 0,
    { checked_shots: shots.length, checked_anchor_pairs: shots.length * 3, exact_duplicate_pairs: duplicateFramePairs.length },
    duplicateFramePairs,
  );

  const perFrame = readJson(path.join(packageDir, "per_frame_visual_review_matrix.json"));
  addRequirement(
    requirements,
    "per_frame_visual_review",
    "Every delivered start/key/end image has a machine-readable visual review row.",
    perFrame.decision === "per_frame_visual_review_matrix_passed_monitor_required" &&
      Number(perFrame.shots_checked) === 42 &&
      Number(perFrame.frames_checked) === 126 &&
      Number(perFrame.frames_passed) === 126 &&
      Number(perFrame.problems?.length || 0) === 0,
    {
      report: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/per_frame_visual_review_matrix.json",
      decision: perFrame.decision,
      shots_checked: perFrame.shots_checked,
      frames_checked: perFrame.frames_checked,
      frames_passed: perFrame.frames_passed,
      problems: perFrame.problems?.length || 0,
    },
    perFrame.problems || [],
  );

  const fullVisual = readJson(path.join(packageDir, "full_local_visual_review.json"));
  addRequirement(
    requirements,
    "local_rendered_visual_review",
    "A rendered local review surface/contact-sheet audit was used for all 42 current shot frame sets.",
    fullVisual.decision === "full_local_visual_review_passed_for_motion_probe_not_video_approved" &&
      Number(fullVisual.problems?.length || 0) === 0,
    {
      report: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/full_local_visual_review.json",
      decision: fullVisual.decision,
      method: fullVisual.method,
      contact_sheets: fullVisual.contact_sheets?.length || 0,
      problems: fullVisual.problems?.length || 0,
    },
    fullVisual.problems || [],
  );

  const submission = readJson(path.join(packageDir, "submission_contract_gate.json"));
  const executionPlan = readJson(path.join(packageDir, "execution_plan.json"));
  const submissionQueueRows = csvDataRows(path.join(packageDir, "submission_queue.csv"));
  const submissionPayloadRows = jsonlRows(path.join(packageDir, "submission_payload.jsonl"));
  addRequirement(
    requirements,
    "executable_submission_queue",
    "The package has an executable 42-shot submission queue/payload/plan with matching metadata and battle-ledger fields.",
    submission.decision === "submission_contract_gate_passed" &&
      Number(submission.rows_checked) === 42 &&
      Number(submission.execution_plan_rows) === 42 &&
      Number(submission.submission_queue_rows) === 42 &&
      Number(submission.submission_payload_rows) === 42 &&
      submissionQueueRows === 42 &&
      submissionPayloadRows === 42,
    {
      submission_contract_gate: submission.decision,
      execution_plan_work_orders: executionPlan.work_orders?.length || 0,
      submission_queue_rows: submissionQueueRows,
      submission_payload_rows: submissionPayloadRows,
      report_rows_checked: submission.rows_checked,
    },
    submission.problems || [],
  );

  const motionProbe = readJson(path.join(packageDir, "motion_probe_submission_ready_gate.json"));
  addRequirement(
    requirements,
    "motion_probe_operator_package",
    "The monitored 3-second motion-probe package is ready for external provider upload with 7 ZIP batches and 42 unique probe IDs.",
    motionProbe.decision === "motion_probe_submission_ready" &&
      Number(motionProbe.provider_zip_count) === 7 &&
      Number(motionProbe.bundled_probe_rows) === 42 &&
      Number(motionProbe.unique_probe_custom_ids) === 42 &&
      Number(motionProbe.return_batches) === 7 &&
      Number(motionProbe.problems?.length || 0) === 0,
    {
      report: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_probe_submission_ready_gate.json",
      decision: motionProbe.decision,
      provider_zip_count: motionProbe.provider_zip_count,
      bundled_probe_rows: motionProbe.bundled_probe_rows,
      unique_probe_custom_ids: motionProbe.unique_probe_custom_ids,
      return_batches: motionProbe.return_batches,
    },
    motionProbe.problems || [],
  );

  const audio = readJson(path.join(packageDir, "audio_timing_prompt_contract.json"));
  const dialogueRows = (audio.rows || []).filter((row) => Array.isArray(row.final_dialogue_lines) && row.final_dialogue_lines.length > 0);
  const soundOnlyRows = (audio.rows || []).filter((row) => row.sound_design_only);
  addRequirement(
    requirements,
    "dialogue_and_audio_not_pure_action",
    "The scene is not pure action: dialogue/final audio intent is present and timing-checked shot by shot.",
    audio.decision === "audio_timing_prompt_contract_passed" &&
      Number(audio.shots_checked) === 42 &&
      dialogueRows.length >= 20 &&
      dialogueRows.length + soundOnlyRows.length === 42 &&
      Number(audio.problems?.length || 0) === 0,
    {
      report: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/audio_timing_prompt_contract.json",
      decision: audio.decision,
      shots_checked: audio.shots_checked,
      dialogue_shots: dialogueRows.length,
      sound_design_only_shots: soundOnlyRows.length,
      problems: audio.problems?.length || 0,
    },
    audio.problems || [],
  );

  const characterBeat = readJson(path.join(packageDir, "character_beat_readiness_audit.json"));
  const housesCovered = (characterBeat.house_checks || []).every((row) => row.highlight_covered?.length === row.total && row.exit_covered?.length === row.total);
  const charactersCovered = (characterBeat.character_rows || []).every((row) => row.decision === "covered");
  addRequirement(
    requirements,
    "three_house_highlights_and_exits",
    "Blue Lions, Black Eagles, and Golden Deer each have their own highlights and every character has a battle/stand-down/exit coverage row.",
    characterBeat.decision === "character_beat_ready" &&
      Number(characterBeat.characters_checked) === 21 &&
      housesCovered &&
      charactersCovered &&
      Number(characterBeat.strict_video_cost_blockers?.length || 0) === 0,
    {
      report: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/character_beat_readiness_audit.json",
      decision: characterBeat.decision,
      characters_checked: characterBeat.characters_checked,
      house_checks: characterBeat.house_checks,
      strict_video_cost_blockers: characterBeat.strict_video_cost_blockers?.length || 0,
    },
    characterBeat.problems || [],
  );

  const shot032 = shots.find((shot) => shot.shot === "Shot032");
  const shot032Dir = shot032 ? path.join(packageDir, shot032.package_dir || "") : null;
  const shot032Text = shot032Dir && fs.existsSync(path.join(shot032Dir, "model_prompt.md"))
    ? fs.readFileSync(path.join(shot032Dir, "model_prompt.md"), "utf8")
    : "";
  addRequirement(
    requirements,
    "dedue_mercedes_healing_beat",
    "The Warcraft-inspired support beat is implemented as Dedue under pressure and Mercedes restoring him with a restrained white healing pulse.",
    Boolean(shot032) &&
      JSON.stringify(shot032.visible_named_only || []) === JSON.stringify(["Dedue", "Mercedes"]) &&
      /Dedue already knocked into a low defensive crouch/i.test(shot032Text) &&
      /short warm white-gold healing pulse/i.test(shot032Text) &&
      /Dedue recovered into a low shield-wall stance/i.test(shot032Text) &&
      /Mercedes:\s*spent_after_heal/.test(shot032Text) &&
      /no-active-combat after this shot: Mercedes/i.test(shot032Text),
    {
      shot: "Shot032",
      shot_dir: shot032?.package_dir || null,
      visible_named_only: shot032?.visible_named_only || [],
      prompt_checks: {
        dedue_pressure_start: /Dedue already knocked into a low defensive crouch/i.test(shot032Text),
        restrained_healing_pulse: /short warm white-gold healing pulse/i.test(shot032Text),
        dedue_restored: /Dedue recovered into a low shield-wall stance/i.test(shot032Text),
        mercedes_spent: /Mercedes:\s*spent_after_heal/.test(shot032Text),
        mercedes_no_active_after: /no-active-combat after this shot: Mercedes/i.test(shot032Text),
      },
    },
    [],
  );

  const shot034B = shots.find((shot) => shot.shot === "Shot034B");
  const shot034BText = shot034B ? JSON.stringify(shot034B) : "";
  addRequirement(
    requirements,
    "hanneman_manuela_not_side_by_side",
    "Hanneman and Manuela are separated by route/lane logic and Shot034B resolves empty faculty objectives without showing them side by side.",
    Boolean(shot034B) &&
      shot034B.titleZh === "空教师目标裁定" &&
      JSON.stringify(shot034B.visible_named_only || []) === JSON.stringify(["Byleth", "Dimitri"]) &&
      /absent\/offscreen\/silent and never paired/i.test(shot034BText) &&
      !/汉尼曼单线目标裁定|Hanneman single lane|Byleth, Dimitri, Hanneman/.test(shot034BText),
    {
      shot: "Shot034B",
      titleZh: shot034B?.titleZh || null,
      visible_named_only: shot034B?.visible_named_only || [],
      empty_objective_contract: /absent\/offscreen\/silent and never paired/i.test(shot034BText),
    },
    [],
  );

  const battleLedger = readJson(path.join(packageDir, "battle_ledger_timeline.json"));
  addRequirement(
    requirements,
    "post_shot_survival_and_attrition_ledger",
    "Every shot records alive/safe, active, defeated/removed, captured/objective-defeated, stood-down, must-not-return, and changed-this-shot state.",
    battleLedger.decision === "battle_ledger_timeline_passed" &&
      Number(battleLedger.shots) === 42 &&
      Number(battleLedger.rows?.length || 0) === 42 &&
      Number(battleLedger.state_machine_rows?.length || 0) === 42 &&
      Number(battleLedger.problems?.length || 0) === 0,
    {
      report: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/battle_ledger_timeline.json",
      decision: battleLedger.decision,
      rows: battleLedger.rows?.length || 0,
      state_machine_rows: battleLedger.state_machine_rows?.length || 0,
      rows_digest_sha256: battleLedger.rows_digest_sha256,
      state_machine_rows_digest_sha256: battleLedger.state_machine_rows_digest_sha256,
    },
    battleLedger.problems || [],
  );

  const webBattle = readJson(path.join(packageDir, "ep02_web_battle_event_panel_audit.json"));
  const webMedia = readJson(path.join(packageDir, "ep02_web_media_refs_audit.json"));
  addRequirement(
    requirements,
    "web_panel_scene09_current_display",
    "The EP02 storyboard panel displays Scene09 as the current 42-shot card surface with frame strips, battle event panels, and no top clutter.",
    webBattle.decision === "ep02_web_battle_event_panel_audit_passed" &&
      Number(webBattle.scene09_shots) === 42 &&
      Number(webBattle.rendered_frame_cards) === 126 &&
      Number(webBattle.rendered_priority_review_queue_rows) === 0 &&
      webBattle.scene09_top_surface === "latest_shot_cards_direct_no_priority_queue" &&
      Number(webBattle.problems?.length || 0) === 0 &&
      Number(webMedia.missing_required_assets || 0) === 0,
    {
      battle_event_report: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/ep02_web_battle_event_panel_audit.json",
      media_refs_report: "delivery/scene09_v3_monitor_handoff_package_2026-07-27/ep02_web_media_refs_audit.json",
      scene09_shots: webBattle.scene09_shots,
      rendered_frame_cards: webBattle.rendered_frame_cards,
      top_surface: webBattle.scene09_top_surface,
      missing_required_assets: webMedia.missing_required_assets,
      pending_video_outputs: webMedia.pending_video_outputs,
    },
    [...(webBattle.problems || []), ...(webMedia.missing_required_assets ? [`missing required assets: ${webMedia.missing_required_assets}`] : [])],
  );

  const reportFreshness = readJson(path.join(packageDir, "report_freshness_gate.json"));
  const currentStatus = readJson(path.join(packageDir, "current_status_consistency_gate.json"));
  const freshnessProblems = reportFreshness.problems || [];
  const freshnessFixedPointReady = reportFreshness.decision === "report_freshness_passed_current_manifest" ||
    (Number(reportFreshness.reports_checked || 0) >= 57 &&
      freshnessProblems.length > 0 &&
      freshnessProblems.every((problem) => String(problem).startsWith("goal_completion_matrix:")));
  addRequirement(
    requirements,
    "freshness_and_status_consistency",
    "Package-local reports and the current human-readable status page agree with the current manifest.",
    freshnessFixedPointReady &&
      Number(reportFreshness.reports_checked) >= 57 &&
      Number(reportFreshness.warnings?.length || 0) === 0 &&
      currentStatus.decision === "current_status_consistency_passed" &&
      Number(currentStatus.problems?.length || 0) === 0,
    {
      report_freshness_decision: reportFreshness.decision,
      reports_checked: reportFreshness.reports_checked,
      current_status_decision: currentStatus.decision,
    },
    [...(reportFreshness.problems || []), ...(currentStatus.problems || [])],
  );

  const videoRun = readJson(path.join(packageDir, "video_generation_run_completion_audit.json"));
  const clipStructural = readJson(path.join(packageDir, "generated_clip_structural_audit.json"));
  const realClipsReady = Number(clipStructural.playable_clips || clipStructural.ready_clips || 0);
  externalPending.push({
    id: "real_video_clips",
    status: "clips_pending",
    expected: 42,
    ready: realClipsReady,
    evidence: {
      video_generation_run_completion_decision: videoRun.decision,
      highest_completed_target: videoRun.highest_completed_target,
      failed_checks: videoRun.failed_checks || [],
    },
  });

  const localProblems = requirements.flatMap((row) => row.status === "proved" ? [] : row.gaps.length ? row.gaps.map((gap) => `${row.id}: ${gap}`) : [`${row.id}: incomplete`]);
  for (const item of localProblems) problems.push(item);
  const localReady = problems.length === 0;
  const decision = localReady
    ? "scene09_local_prompt_asset_goal_ready_video_clips_pending"
    : "scene09_goal_completion_matrix_blocked";

  const result = {
    date,
    package_id: manifest.package_id,
    decision,
    local_requirements_proved: requirements.filter((row) => row.status === "proved").length,
    local_requirements_total: requirements.length,
    problems,
    external_pending: externalPending,
    requirements,
  };

  writeJson(outJson, result);
  writeJson(packageOutJson, result);

  const md = [
    "# Scene09 Goal Completion Matrix",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Local requirements proved: ${result.local_requirements_proved}/${result.local_requirements_total}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## External Pending",
    "",
    ...externalPending.map((item) => `- ${item.id}: ${item.ready}/${item.expected} ${item.status}; highest completed target: ${item.evidence.highest_completed_target}`),
    "",
    "## Requirement Matrix",
    "",
    "| ID | Status | Evidence |",
    "| --- | --- | --- |",
    ...requirements.map((row) => `| ${row.id} | ${row.status} | ${JSON.stringify(row.evidence).replace(/\|/g, "\\|")} |`),
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  console.log(JSON.stringify({
    decision,
    local_requirements_proved: result.local_requirements_proved,
    local_requirements_total: result.local_requirements_total,
    problems: problems.length,
    external_pending: externalPending.map((item) => ({ id: item.id, ready: item.ready, expected: item.expected, status: item.status })),
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));
  if (problems.length) process.exit(1);
}

main();
