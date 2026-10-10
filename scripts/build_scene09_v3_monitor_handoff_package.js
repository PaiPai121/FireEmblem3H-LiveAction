const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-07-27";
const manifestPath = path.join(root, "production_system/video_delivery_manifest.json");
const outDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const finalOutput = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");

const SUPPORTED_MODEL_PLACEHOLDERS = new Set([
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

const REQUIRED_MODEL_TEMPLATE_GROUPS = [
  { id: "prompt", label: "model prompt", anyOf: ["prompt", "model_prompt"] },
  { id: "negative_prompt", label: "negative prompt", anyOf: ["negative_prompt"] },
  { id: "start_frame", label: "start frame", anyOf: ["start_frame"] },
  { id: "key_frame", label: "key frame", anyOf: ["key_frame"] },
  { id: "end_frame", label: "end frame", anyOf: ["end_frame"] },
  { id: "duration", label: "duration", anyOf: ["duration"] },
  { id: "output", label: "output mp4 path", anyOf: ["output"] },
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

function resolveSource(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
}

function copy(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(resolveSource(source), destination);
}

function fileDigest(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function safeId(value) {
  return String(value).replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function csvCell(value) {
  const text = String(value == null ? "" : value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function normalizeRejectLine(value) {
  return String(value || "")
    .trim()
    .replace(/^[-\s]+/, "")
    .replace(/^Reject if\s+/i, "")
    .replace(/\s+/g, " ")
    .replace(/[.。]+$/g, "")
    .toLowerCase();
}

function uniqueRejectLines(lines) {
  const seen = new Set();
  const result = [];
  for (const line of lines || []) {
    const text = String(line || "").trim();
    if (!text) continue;
    const key = normalizeRejectLine(text);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(text);
  }
  return result;
}

function negativePromptFrom(promptText) {
  const match = promptText.match(/^Negative Prompt:\n([\s\S]*?)\n?$/m);
  return match ? match[1].trim() : "";
}

function promptSection(promptText, heading) {
  const lines = String(promptText || "").split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${heading}:`);
  if (start < 0) return "";
  const body = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^[A-Za-z][A-Za-z /-]*:\s*$/.test(lines[index].trim())) break;
    body.push(lines[index]);
  }
  return body.join("\n").trim();
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

function battleLedger(shot) {
  return shot.battle_state_after?.battle_ledger_after || shot.battle_ledger_after || {};
}

function noActiveNames(shot) {
  const ledger = battleLedger(shot);
  return [
    ...(Array.isArray(shot.battle_state_after?.inactive_or_removed_after) ? shot.battle_state_after.inactive_or_removed_after : []),
    ...(Array.isArray(shot.battle_state_after?.no_active_combat_after) ? shot.battle_state_after.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
  ].filter((name, index, all) => name && all.indexOf(name) === index);
}

function visibleButNoActiveNames(shot) {
  const ledger = battleLedger(shot);
  const active = new Set(flattenGroups(ledger.still_active_or_controlling_objective_by_house || ledger.active_by_house || shot.battle_state_after?.active_by_house));
  return (shot.visible_named_only || []).filter((name) => name && !active.has(name));
}

function capturedOrObjectiveDefeatedNames(shot) {
  const ledger = battleLedger(shot);
  return flattenGroups(ledger.captured_or_objective_defeated_by_house || ledger.captured_objective_defeated_by_house)
    .filter((name, index, all) => name && all.indexOf(name) === index);
}

function negativeTokens(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinNegativeTokens(tokens) {
  const seen = new Set();
  const result = [];
  for (const token of tokens) {
    const key = token.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(token);
  }
  return result.join(", ");
}

function augmentNegativePromptForLedger(shot, negativePrompt) {
  const visible = new Set(shot.visible_named_only || []);
  const noActive = noActiveNames(shot);
  const captured = capturedOrObjectiveDefeatedNames(shot);
  const tokens = negativeTokens(negativePrompt);

  tokens.push("no paired Hanneman and Manuela");
  tokens.push("no shared teacher platform");
  tokens.push("no same-lane teacher duo");
  if (!visible.has("Hanneman")) tokens.push("no readable Hanneman");
  if (!visible.has("Manuela")) tokens.push("no readable Manuela");

  for (const name of noActive) {
    if (visible.has(name)) {
      tokens.push(`no renewed attack by ${name}`);
      tokens.push(`no active-combat reset for ${name}`);
    } else {
      tokens.push(`no readable return of ${name}`);
      tokens.push(`no active return of ${name}`);
    }
  }

  for (const name of captured) {
    if (!visible.has(name)) {
      tokens.push(`no uncaptured return of ${name}`);
    }
  }

  return joinNegativeTokens(tokens);
}

function shotTitle(shot) {
  return String(shot.titleZh || shot.title || shot.shot || shot.id || "").trim();
}

function renderAttritionState(shot) {
  const ledger = battleLedger(shot);
  const state = shot.battle_state_after || {};
  return [
    "Attrition State After This Shot:",
    "- All named characters remain alive and safe under mock-battle rules.",
    `- Alive/safe by group: ${groupText(ledger.alive_by_house || state.active_by_house)}.`,
    `- Visible but no active combat after: ${visibleButNoActiveNames(shot).join(", ") || "none"}.`,
    `- Still active or objective-controlling: ${groupText(ledger.still_active_or_controlling_objective_by_house || ledger.active_by_house || state.active_by_house)}.`,
    `- Limited but not defeated: ${groupText(ledger.limited_but_not_defeated_by_house || ledger.limited_by_house)}.`,
    `- Defeated/removed: ${groupText(ledger.mock_battle_defeated_or_removed_by_house || ledger.defeated_removed_by_house || state.inactive_by_house)}.`,
    `- Captured/objective-defeated: ${groupText(ledger.captured_or_objective_defeated_by_house || ledger.captured_objective_defeated_by_house)}.`,
    `- Stood down/post-battle: ${groupText(ledger.stood_down_or_post_battle_by_house || ledger.stood_down_post_battle_by_house)}.`,
    `- Must not return active: ${groupText(ledger.must_not_return_active_by_house)}.`,
    `- Changed this shot: ${changeText(ledger.changed_this_shot)}.`,
    `- Note: ${String(state.note || ledger.note_cn || "Preserve previous battle state.").replace(/\s+/g, " ").trim()}`,
  ].join("\n");
}

function payloadLedgerFields(shot) {
  const ledger = battleLedger(shot);
  const state = shot.battle_state_after || {};
  return {
    battle_state_after: state,
    battle_ledger_after: ledger,
    alive_safe_after: groupText(ledger.alive_by_house || state.active_by_house),
    visible_but_no_active_combat_after: visibleButNoActiveNames(shot).join(", ") || "none",
    active_or_objective_after: groupText(ledger.still_active_or_controlling_objective_by_house || ledger.active_by_house || state.active_by_house),
    limited_after: groupText(ledger.limited_but_not_defeated_by_house || ledger.limited_by_house),
    defeated_removed_after: groupText(ledger.mock_battle_defeated_or_removed_by_house || ledger.defeated_removed_by_house || state.inactive_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_or_objective_defeated_by_house || ledger.captured_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_or_post_battle_by_house || ledger.stood_down_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: noActiveNames(shot).join(", ") || "none",
  };
}

function renderModelPrompt(shot, promptText, negativePrompt) {
  const compactNegativePrompt = "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no weapon drift, no lethal hits, no gore, no blood, no text, no subtitles, no captions, no visible text, no watermark, no camera spin, no screen-direction reversal";
  const cleanText = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const visible = (shot.visible_named_only || []).join(", ") || "none";
  const removed = noActiveNames(shot);
  const visibleButNoActive = visibleButNoActiveNames(shot);
  const localRejects = uniqueRejectLines(shot.reject_if || []);
  const title = shotTitle(shot);
  const titleBlock = title ? ["", "Title:", title] : [];
  const shotSpecificLocks = shot.shot === "Shot034B"
    ? [
      "",
      "Identity / Presence Locks:",
      "Allowed readable humans: Byleth, Dimitri.",
      "Visible named-only list: Byleth, Dimitri.",
      "Two far-separated faculty objective markers must be empty.",
      "Hanneman and Manuela are absent, offscreen, silent, and unpaired.",
      "No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.",
      "No anonymous readable students, spectators, crowds, soldiers, bystanders, or silhouettes.",
      "",
      "Shot034B Specific Reject Contract:",
      "Reject if anyone outside Byleth and Dimitri appears.",
      "Reject if Hanneman appears in any readable form, speaks, stands on a marker, or reads as a combat partner.",
      "Reject if Manuela appears in any readable form, speaks, stands on a marker, or reads as a combat partner.",
      "Hubert remains captured by Felix and Ashe.",
      "Dorothea and Bernadetta remain captured by Leonie and Claude.",
      "",
      "- Both faculty objective markers stay empty.",
      "- Hanneman and Manuela are absent, offscreen, silent, and never paired.",
    ]
    : [];
  return [
    `# ${shot.shot} Model-Ready Video Prompt`,
    "",
    `Shot ID: ${shot.id}`,
    ...titleBlock,
    `Duration: ${shot.duration_seconds || 6} seconds. Hold the final state for the last 0.5 seconds.`,
    "",
    "Input Frames:",
    "- Use the uploaded START frame as the first-frame anchor.",
    "- Use the uploaded KEY frame as the peak action/composition reference.",
    "- Use the uploaded END frame as the final cut-out state.",
    "- Animate only the current uploaded START -> KEY -> END frame chain; do not rely on previous submissions, local paths, source folders, or external reference files.",
    "",
    "Visible readable humans:",
    visible,
    "",
    "Motion:",
    cleanText(promptSection(promptText, "Motion")),
    "",
    "Camera:",
    cleanText(promptSection(promptText, "Camera")),
    "",
    "Performance:",
    cleanText(promptSection(promptText, "Performance")),
    "",
    "Audio:",
    cleanText(promptSection(promptText, "Audio")),
    "",
    "Continuity Locks:",
    `- Only these readable humans may appear: ${visible}.`,
    ...shotSpecificLocks,
    "- No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.",
    "- Preserve faces, costumes, house colors, training weapons, geography, and screen direction.",
    "- Nonlethal mock battle only: no blood, gore, humiliation, or lethal hits.",
    "- Hanneman and Manuela are separate faculty examiners; never side by side, sharing one sigil, or allied partners.",
    "- Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
    "- Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
    `- No-active-combat after this shot: ${removed.length ? removed.join(", ") : "none"}.`,
    `- Visible But No Active Combat After: ${visibleButNoActive.length ? visibleButNoActive.join(", ") : "none"}.`,
    `- Attrition note: ${cleanText(shot.battle_state_after?.note || "Preserve previous battle state.")}`,
    "",
    renderAttritionState(shot),
    "",
    "Reject If:",
    ...localRejects.map((line) => `- ${line.replace(/^Reject if\s+/i, "")}`),
    "",
    "Negative Prompt:",
    cleanText(negativePrompt) || compactNegativePrompt,
    "",
  ].join("\n");
}

function shellQuote(value) {
  if (/^[A-Za-z0-9_./:=+-]+$/.test(value)) return value;
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function modelCommand(template, values) {
  if (!template) return null;
  return template.map((arg) => arg.replace(/\{([a-z_]+)\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`Unknown VIDEO_MODEL_CLI_ARGV_JSON placeholder: ${match}`);
    return values[key];
  }));
}

function parseModelTemplate() {
  const raw = process.env.VIDEO_MODEL_CLI_ARGV_JSON;
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
    throw new Error("VIDEO_MODEL_CLI_ARGV_JSON must be a JSON array of strings");
  }
  return parsed;
}

function validateModelTemplate(template) {
  if (!template) {
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

  for (const arg of template) {
    for (const match of String(arg).matchAll(/\{([a-z_]+)\}/g)) {
      const key = match[1];
      found.add(key);
      if (!SUPPORTED_MODEL_PLACEHOLDERS.has(key)) {
        problems.push(`Unsupported placeholder: {${key}}`);
      }
    }
  }

  if (/^\{[a-z_]+\}$/.test(template[0])) {
    problems.push("The executable argv[0] must be a concrete command, not a placeholder.");
  }

  for (const group of REQUIRED_MODEL_TEMPLATE_GROUPS) {
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

function primaryCheck(shot) {
  const rejects = shot.reject_if || [];
  const namedOnly = (shot.visible_named_only || []).join(", ") || "none";
  return [
    `Visible named-only: ${namedOnly}.`,
    shot.battle_state_after?.note || "",
    rejects[0] || "Preserve start/key/end frame chain.",
  ].filter(Boolean).join(" ");
}

function renderRunbook(manifest, packagedShots, modelConfigured) {
  const totalDuration = packagedShots.reduce((sum, shot) => sum + Number(shot.duration_seconds || 0), 0);
  return [
    "# EP02 Scene09 V3 Monitor Handoff Runbook",
    "",
    `Date: ${date}`,
    `Package: ${path.basename(outDir)}`,
    `Source manifest: ${rel(manifestPath)}`,
    `Status: monitor_required, clips_pending`,
    "",
    "This is the current handoff package for video-model submission. It is not marked `approved_for_video`; it is a monitor-stage execution package built from the latest prompt/frame manifest.",
    "",
    "## Submission Rule",
    "",
    "Submit shots in timeline order. For each shot, use the local files in that shot directory:",
    "",
    "- `model_prompt.md` (the only prompt text to paste into a web video generator)",
    "- `negative_prompt.md`",
    "- `start_frame.png`",
    "- `key_frame.png`",
    "- `end_frame.png`",
    "- `metadata.json`",
    "",
    "`prompt.md` is retained as an internal audit/source trace file and may include local source paths. Do not paste `prompt.md` into a web video generator.",
    "",
    "For automated submitters, use `submission_payload.jsonl`. Each JSON line includes `prompt_text`, `negative_prompt_text`, structured after-shot `battle_ledger_after` / `battle_state_after`, local and absolute frame paths, file SHA-256 digests, visible roster locks, reject criteria, and the expected clip path.",
    "",
    "For batch-oriented providers or manual upload sessions, use `model_submission_batches/index.html` after running the pipeline. It contains provider-neutral JSONL/CSV batches, one Markdown operator sheet per batch, `batch_manifest.json`, and `expected_downloads.csv` for matching returned mp4 files back to the exact shot/custom_id.",
    "",
    "Save the generated clip to the `expected_clip` path in `metadata.json`, then run clip-level motion QA before concatenating.",
    "",
    "Use `clip_motion_qa_checklist.csv` as the per-shot review sheet after clips are generated.",
    "",
    "## One-Step Local Pipeline",
    "",
    "Use the project-level pipeline wrapper to rebuild, validate, run clip QA, refresh both file:// galleries, and optionally execute/concat:",
    "",
    "```bash",
    "node scripts/run_scene09_v3_video_pipeline.js --dry-run",
    "node scripts/run_scene09_v3_video_pipeline.js --execute --concat",
    "```",
    "",
    "The wrapper will not call any video model unless `--execute` is provided and `VIDEO_MODEL_CLI_ARGV_JSON` is configured. It will not concatenate unless all 42 expected clips exist, pass file-level clip QA, have start/mid/end motion-review frames, and have `motion_review_passed` decisions.",
    "Direct `node scripts/run_video_generation_package.js <this-package> --concat` is intentionally blocked for this monitor handoff; use the project pipeline for final assembly.",
    "The dry run also rebuilds and audits `model_submission_batches/`, so the file:// package and batch upload material stay synchronized.",
    "The dry run also rebuilds `provider_upload_bundles/` and runs `provider_submission_freshness_gate`, proving the manual upload batches and provider zip bundles match the current final `submission_payload.jsonl`.",
    "",
    "## Final Assembly Gate",
    "",
    `The expected final edit is \`${rel(finalOutput)}\`. It is not complete merely because a file exists at that path.`,
    "",
    "Final assembly is allowed only after all of these checks pass:",
    "",
    "- 42/42 expected real model `.mp4` clips exist at their `expected_clip` paths.",
    "- `generated_clip_structural_audit` passes file-level mp4 checks for every clip.",
    "- `actual_delivery_surface_audit` proves current Shot034B empty-objective delivery surfaces are repaired across manifests, prompts, payload, and file:// viewers.",
    "- `current_status_consistency_gate` proves the current file-access status page matches machine-readable reports and older status files are marked superseded.",
    "- `provider_preflight_consistency_gate` proves operator preflight, provider upload manifest, package execution readiness, and model target profile agree before external submission.",
    "- Start/mid/end motion-review frames exist for every generated clip.",
    "- Codex self-audit marks every shot `motion_review_passed`; the user is not asked to approve these rows.",
    "- `motion_self_audit_packet_audit` proves the Codex-only review matrix/checklist is structurally ready before completion can be claimed.",
    "- `motion_self_audit_apply_positive_contract` proves the apply gate has a positive path when current signed clip/frame evidence is complete.",
    "- `motion_self_audit_apply_gate` proves Codex-reviewed motion decision rows were validated and written back without user/operator approval or stale clip signatures.",
    "- `after_clip_return_resume_positive_contract` proves the after-clip-return wrapper can ingest exact returned clip filenames, preserve signed review-frame evidence across reruns, apply Codex motion decisions, and reach ready-for-concat.",
    "- `final_concat_inputs_contract` proves final assembly input order, unique expected-clip paths, and duration sum are locked before concat.",
    "- `final_concat_positive_contract` proves the final concat gate has a positive path when every upstream report is complete and current.",
    "- `final_edit_positive_contract` proves the final edit structural audit has a positive path for a valid package-duration mp4.",
    "- `video_generation_run_positive_contract` proves the completion audit has a positive path when every upstream clip, motion, provenance, concat, and final-edit proof is complete, and rejects stale final concat 7/7 evidence.",
    "- `positive_contract_isolation_gate` proves temporary positive-contract fixtures do not create or mask production expected clips or the production final edit.",
    "- `submission_contract_gate` proves package manifest, execution plan, submission queue, JSONL payload, and per-shot metadata all describe the same model-submission inputs.",
    "- `provider_submission_freshness_gate` proves model submission batches and provider upload bundles were rebuilt from the current final `submission_payload.jsonl`.",
    "- `motion_probe_operator_tracker` and `motion_probe_operator_tracker_audit` prove the 7 probe zip batches, 42 expected probe filenames, returned-mp4 folders, CSV rows, and operator tracking surface are current before probe submission or return ingest.",
    "- `full_local_visual_review` proves all 42 current still-frame shot sets and 126 frame refs were locally reviewed and are accepted only for monitored short motion probes, not for full-duration video approval.",
    "- `clip_return_roundtrip_audit` proves provider-returned clips can be matched by exact expected filename or `custom_id` prefix while rejecting bare shot-name files.",
    "- `model_cli_execution_provenance_audit` proves the local CLI execution path writes `model_cli_execute` provenance with output SHA-256 values.",
    "- `clip_provenance_gate` proves every existing expected clip has provider-ingest or local-model provenance matching its current SHA-256.",
    "- `clip_revision_queue.csv` has no actionable repair/regeneration rows.",
    "- `report_freshness_gate` proves package-local reports still align with the current package manifest.",
    "- `proxy_misuse_gate` proves reference-only proxy animatic clips are not used as expected clips or final edit.",
    `- The final edit structural audit passes: ffprobe can parse the file, a video stream exists, and duration is within +/-3s of the ${totalDuration}s package duration.`,
    "",
    "The relevant reports are `actual_delivery_surface_audit.md/json`, `current_status_consistency_gate.md/json`, `provider_preflight_consistency_gate.md/json`, `submission_contract_gate.md/json`, `provider_submission_freshness_gate.md/json`, `motion_probe_operator_tracker.html/json/csv`, `motion_probe_operator_tracker_audit.md/json`, `full_local_visual_review.md/json`, `after_clip_return_resume.md/json`, `after_clip_return_resume_positive_contract.md/json`, `motion_self_audit_packet_audit.md/json`, `motion_self_audit_apply_positive_contract.md/json`, `motion_self_audit_apply_gate.md/json`, `final_concat_inputs_contract.md/json`, `final_concat_positive_contract.md/json`, `final_edit_positive_contract.md/json`, `video_generation_run_positive_contract.md/json`, `positive_contract_isolation_gate.md/json`, `clip_return_roundtrip_audit.md/json`, `model_cli_execution_provenance_audit.md/json`, `clip_provenance_gate.md/json`, `report_freshness_gate.md/json`, `proxy_misuse_gate.md/json`, `final_concat_gate.md/json`, `final_edit_structural_audit.md/json`, and `video_generation_run_completion_audit.md/json`. If any report `clips_pending`, `final_edit_pending`, or a blocked decision, the package is still not a completed video generation run.",
    "",
    "## Proxy Animatic Clips",
    "",
    "For timeline and file:// review before real video generation, build reference-only per-shot proxy clips from the packaged start/key/end frames:",
    "",
    "```bash",
    "node scripts/build_scene09_v3_proxy_animatic_clips.js",
    "```",
    "",
    "These proxy clips live under `episodes/EP02/video_outputs/scene09_v3_attrition/proxy_animatic_clips/` and the proxy edit is `episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_proxy_animatic_edit_2026-07-28.mp4`. They are never written to `expected_clip`, never count as AI model outputs, and cannot satisfy clip-level motion QA.",
    "",
    "## Import External Model Downloads",
    "",
    "If clips are generated outside this repo, import the downloaded `.mp4` files through the safe ingest tool instead of hand-editing paths. The script matches exact expected filenames and `custom_id` prefixes by default, rejects bare shot-name files as too weak, refuses ambiguous matches, and will not overwrite existing targets unless `--force` is explicit.",
    "",
    "```bash",
    "node scripts/ingest_scene09_v3_generated_clips.js --input /path/to/model/downloads --dry-run",
    "node scripts/ingest_scene09_v3_generated_clips.js --input /path/to/model/downloads --apply",
    "node scripts/run_scene09_v3_video_pipeline.js --dry-run",
    "```",
    "",
    "For a single resumable handoff after provider clips return, use the stricter resume wrapper. It scans or imports returned clips, refreshes clip QA, extracts motion-review frames, probes/applies Codex self-audit decisions, rebuilds the revision queue, checks provenance, blocks unsafe concat, audits the final edit if present, and writes `after_clip_return_resume.md/json`:",
    "",
    "```bash",
    "node scripts/resume_scene09_v3_after_clip_return.js --input /path/to/model/downloads",
    "node scripts/resume_scene09_v3_after_clip_return.js --input /path/to/model/downloads --apply-ingest",
    "node scripts/resume_scene09_v3_after_clip_return.js --motion-proposal delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_self_audit/decision_update_template.jsonl --apply-motion --concat",
    "```",
    "",
    "The ingest report is written to `production_system/scene09_v3_attrition_package/scene09_v3_clip_ingest_report_2026-07-28.md` and remains only a file-placement gate; every imported clip still requires clip file QA, extracted motion-review frames, and Codex motion self-audit.",
    "",
    "## Current Model CLI",
    "",
    modelConfigured
      ? "A `VIDEO_MODEL_CLI_ARGV_JSON` template was present when this package was built; see `execution_commands.sh`."
      : "No `VIDEO_MODEL_CLI_ARGV_JSON` template is configured. `execution_commands.sh` is therefore a commented handoff list, not an executable generation script yet.",
    "",
    "Example template shape:",
    "",
    "```bash",
    "export VIDEO_MODEL_CLI_ARGV_JSON='[\"video-cli\",\"i2v\",\"--prompt\",\"{prompt}\",\"--negative\",\"{negative_prompt}\",\"--first\",\"{start_frame}\",\"--key\",\"{key_frame}\",\"--last\",\"{end_frame}\",\"--duration\",\"{duration}\",\"--out\",\"{output}\"]'",
    "```",
    "",
    "## Scene-Specific Hard Rejects",
    "",
    "- Any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears.",
    "- Hubert reappears in readable form after Shot032F.",
    "- Dorothea or Bernadetta reappears in readable form after Shot032G.",
    "- Any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
    "- Hanneman and Manuela are staged side by side, share one sigil, or behave as one allied teacher unit.",
    "- Shot034B shows Hanneman, Manuela, any extra teacher, any student extra, or anyone outside Byleth and Dimitri.",
    "- Shot034G becomes a full Blue Lions class celebration instead of the exhausted Byleth/Dimitri/Dedue core.",
    "- The mock battle becomes lethal, bloody, humiliating, or changes training weapons into lethal impacts.",
    "",
    "## Submission Order",
    "",
    ...packagedShots.map((shot) => `${shot.order}. \`${shot.package_dir}\` (${shot.duration_seconds}s) -> \`${shot.expected_clip}\``),
    "",
    "## Post-Generation QA",
    "",
    "After clips exist, inspect them in order for identity drift, extra people, weapon drift, screen-direction reversal, illegal character re-entry, and failure to land on the end frame. Only then can the package be promoted beyond `monitor_required`.",
    "",
    "Run the file-level clip audit first:",
    "",
    "```bash",
    "node scripts/audit_scene09_v3_generated_clips.js",
    "node scripts/audit_scene09_v3_attrition_visibility_timeline.js",
    "node scripts/build_scene09_v3_clip_motion_review_assets.js",
    "node scripts/build_scene09_v3_clip_motion_review_decision_template.js",
    "node scripts/apply_scene09_v3_motion_self_audit_decisions.js delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_self_audit/decision_update_template.jsonl --apply",
    "node scripts/audit_scene09_v3_clip_motion_review_decisions.js",
    "node scripts/build_scene09_v3_clip_revision_queue.js",
    "```",
    "",
    "The motion-review asset script extracts start/mid/end stills from each real generated clip into `production_system/scene09_v3_attrition_package/generated_clip_motion_review_frames_2026-07-28/` and writes `clip_motion_review_assets.html` for Codex self-audit.",
    "The decision template records the machine-readable Codex motion QA result for every shot. A clip stays `needs_codex_motion_review` until its extracted frames and full clip pass all identity, attrition, teacher-lane, nonlethal, camera, and end-frame checks.",
    "The revision queue records every remaining generation, file repair, Codex self-audit, or blocked revision action. No clip can be concatenated while `clip_revision_queue.csv` contains actionable shots.",
    "After concatenation, run `node scripts/audit_scene09_v3_final_edit_structural.js --file episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4`; a final edit can only be called delivered when that report returns `final_edit_structural_passed`.",
    "",
  ].join("\n");
}

function renderCommands(plan) {
  const lines = ["#!/usr/bin/env bash", "set -euo pipefail", ""];
  if (!plan.model_cli_configured) {
    lines.push("# Configure VIDEO_MODEL_CLI_ARGV_JSON before executing real video generation.");
    lines.push("# This file lists every shot and expected output for handoff.");
    lines.push("");
  }
  for (const order of plan.work_orders) {
    const ledgerFields = payloadLedgerFields(order);
    lines.push(`# ${String(order.order).padStart(2, "0")} ${order.shot}`);
    lines.push(`# visible: ${(order.visible_named_only || []).join(", ") || "none"}`);
    lines.push(`# Alive / Safe After: ${ledgerFields.alive_safe_after}`);
    lines.push(`# Active / Controlling After: ${ledgerFields.active_or_objective_after}`);
    lines.push(`# Limited But Not Defeated After: ${ledgerFields.limited_after}`);
    lines.push(`# Defeated / Removed After: ${ledgerFields.defeated_removed_after}`);
    lines.push(`# Captured / Objective-Defeated After: ${ledgerFields.captured_objective_defeated_after}`);
    lines.push(`# Stood Down / Post-Battle After: ${ledgerFields.stood_down_post_battle_after}`);
    lines.push(`# Must Not Return Active: ${ledgerFields.must_not_return_active_after}`);
    lines.push(`# Changed This Shot: ${ledgerFields.changed_this_shot}`);
    lines.push(`# No-Active-Combat Line: ${ledgerFields.no_active_combat_line}`);
    lines.push(`# prompt: ${order.prompt}`);
    lines.push(`# start/key/end: ${order.start_frame} | ${order.key_frame} | ${order.end_frame}`);
    lines.push(`# output: ${order.expected_clip}`);
    if (order.command_argv) lines.push(order.command_argv.map(shellQuote).join(" "));
    lines.push("");
  }
  return lines.join("\n");
}

function renderQueue(workOrders) {
  const fields = [
    "order",
    "shot",
    "status",
    "duration_seconds",
    "shot_dir",
    "audit_prompt",
    "model_prompt",
    "negative_prompt",
    "start_frame",
    "key_frame",
    "end_frame",
    "expected_clip",
    "visible_named_only",
    "primary_check",
  ];
  const rows = workOrders.map((order) => [
    order.order,
    order.shot,
    order.status,
    order.duration_seconds,
    order.package_dir,
    "prompt.md",
    "model_prompt.md",
    "negative_prompt.md",
    "start_frame.png",
    "key_frame.png",
    "end_frame.png",
    order.expected_clip,
    (order.visible_named_only || []).join("; "),
    order.primary_check,
  ]);
  return [fields, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function renderMotionQaChecklist(workOrders) {
  const fields = [
    "order",
    "shot",
    "expected_clip",
    "visible_named_only",
    "battle_state_note",
    "alive_safe_after",
    "active_or_objective_after",
    "limited_after",
    "defeated_removed_after",
    "captured_objective_defeated_after",
    "stood_down_post_battle_after",
    "must_not_return_active_after",
    "changed_this_shot",
    "no_active_combat_line",
    "must_check",
    "reject_if",
    "qa_decision",
    "reviewer_notes",
  ];
  const rows = workOrders.map((order) => {
    const ledger = payloadLedgerFields(order);
    return [
      order.order,
      order.shot,
      order.expected_clip,
      (order.visible_named_only || []).join("; "),
      order.battle_state_after?.note || "",
      ledger.alive_safe_after,
      ledger.active_or_objective_after,
      ledger.limited_after,
      ledger.defeated_removed_after,
      ledger.captured_objective_defeated_after,
      ledger.stood_down_post_battle_after,
      ledger.must_not_return_active_after,
      ledger.changed_this_shot,
      ledger.no_active_combat_line,
      [
        "identity preserved",
        "no extra readable humans",
        "training weapons stay nonlethal",
        "no illegal re-entry",
        "lands on declared end frame",
        "full post-shot ledger state preserved",
        "critical capture and teacher-lane locks preserved",
      ].join("; "),
      uniqueRejectLines(order.reject_if || []).join("; "),
      "",
      "",
    ];
  });
  return [fields, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function renderSubmissionPayload(outDir, workOrders) {
  const rows = workOrders.map((order) => {
    const shotDir = path.join(outDir, order.package_dir);
    const files = {
      model_prompt: path.join(shotDir, "model_prompt.md"),
      audit_prompt: path.join(shotDir, "prompt.md"),
      negative_prompt: path.join(shotDir, "negative_prompt.md"),
      start_frame: path.join(shotDir, "start_frame.png"),
      key_frame: path.join(shotDir, "key_frame.png"),
      end_frame: path.join(shotDir, "end_frame.png"),
      metadata: path.join(shotDir, "metadata.json"),
    };
    return {
      custom_id: `${String(order.order).padStart(3, "0")}_${order.shot}`,
      shot: order.shot,
      id: order.id,
      order: order.order,
      duration_seconds: order.duration_seconds,
      status: order.status,
      title: shotTitle(order),
      titleZh: shotTitle(order),
      prompt_text: readText(files.model_prompt).trimEnd(),
      negative_prompt_text: readText(files.negative_prompt).trimEnd(),
      prompt_file: order.model_prompt,
      audit_prompt_file: order.audit_prompt,
      negative_prompt_file: order.negative_prompt,
      input_frames: {
        start_frame: order.start_frame,
        key_frame: order.key_frame,
        end_frame: order.end_frame,
      },
      absolute_files: Object.fromEntries(Object.entries(files).map(([key, file]) => [key, file])),
      file_digests: Object.fromEntries(Object.entries(files).map(([key, file]) => [key, fileDigest(file)])),
      expected_clip: order.expected_clip,
      absolute_expected_clip: path.join(root, order.expected_clip),
      visible_named_only: order.visible_named_only || [],
      primary_check: order.primary_check,
      reject_if: order.reject_if || [],
      continuity_previous: order.continuity_previous || "",
      continuity_next: order.continuity_next || "",
      battle_state_note: order.battle_state_after?.note || "",
      ...payloadLedgerFields(order),
    };
  });
  return rows;
}

function main() {
  require("child_process").execFileSync(process.execPath, ["scripts/apply_scene09_034B_empty_objective_authoritative_current.js"], { stdio: "inherit" });
  require("child_process").execFileSync(process.execPath, ["scripts/apply_scene09_034E_golden_deer_weapons_authoritative.js"], { stdio: "inherit" });
  require("child_process").execFileSync(process.execPath, ["scripts/apply_scene09_034G_core_victory_authoritative.js"], { stdio: "inherit" });

  const manifest = readJson(manifestPath);
  const modelTemplate = parseModelTemplate();
  const modelTemplateValidation = validateModelTemplate(modelTemplate);
  const runnableModelTemplate = modelTemplateValidation.ok ? modelTemplate : null;
  const shots = [...manifest.shots].sort((a, b) => Number(a.order) - Number(b.order));
  fs.mkdirSync(path.join(outDir, "shots"), { recursive: true });
  fs.mkdirSync(path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition"), { recursive: true });

  const packagedShots = [];
  const validationFailures = [];

  for (const shot of shots) {
    const shotDirName = `${String(shot.order).padStart(3, "0")}_${safeId(shot.id)}`;
    const shotDir = path.join(outDir, "shots", shotDirName);
    const promptText = readText(resolveSource(shot.prompt_path));
    const negativePrompt = augmentNegativePromptForLedger(shot, shot.negative_prompt || negativePromptFrom(promptText));
    const modelPrompt = renderModelPrompt(shot, promptText, negativePrompt);

    copy(shot.start_frame, path.join(shotDir, "start_frame.png"));
    copy(shot.key_frame, path.join(shotDir, "key_frame.png"));
    copy(shot.end_frame, path.join(shotDir, "end_frame.png"));
    writeText(path.join(shotDir, "prompt.md"), `${promptText.trimEnd()}\n`);
    writeText(path.join(shotDir, "model_prompt.md"), `${modelPrompt.trimEnd()}\n`);
    writeText(path.join(shotDir, "negative_prompt.md"), `${negativePrompt.trimEnd()}\n`);

    const expectedClip = path.join(root, shot.expected_clip);
    const localValues = {
      shot_id: shot.id,
      shot: shot.shot,
      order: String(shot.order),
      duration: String(shot.duration_seconds),
      prompt: path.join(shotDir, "model_prompt.md"),
      model_prompt: path.join(shotDir, "model_prompt.md"),
      audit_prompt: path.join(shotDir, "prompt.md"),
      negative_prompt: path.join(shotDir, "negative_prompt.md"),
      start_frame: path.join(shotDir, "start_frame.png"),
      key_frame: path.join(shotDir, "key_frame.png"),
      end_frame: path.join(shotDir, "end_frame.png"),
      output: expectedClip,
    };

    const metadata = {
      id: shot.id,
      shot: shot.shot,
      order: shot.order,
      package_type: "monitor_handoff",
      status: shot.status,
      decision: manifest.decision,
      duration_seconds: shot.duration_seconds,
      expected_clip: rel(expectedClip),
      edit_in: shot.edit_in,
      edit_out: shot.edit_out,
      audio_anchor: shot.audio_anchor || "",
      visible_named_only: shot.visible_named_only || [],
      title: shotTitle(shot),
      titleZh: shotTitle(shot),
      battle_state_after: shot.battle_state_after || {},
      continuity_previous: shot.continuity_previous || "",
      continuity_next: shot.continuity_next || "",
      source_prompt_path: shot.prompt_path,
      source_frames: {
        start_frame: shot.start_frame,
        key_frame: shot.key_frame,
        end_frame: shot.end_frame,
      },
      start_frame: shot.start_frame,
      key_frame: shot.key_frame,
      end_frame: shot.end_frame,
      frames: {
        start: { path: shot.start_frame },
        key: { path: shot.key_frame },
        end: { path: shot.end_frame },
        start_frame: shot.start_frame,
        key_frame: shot.key_frame,
        end_frame: shot.end_frame,
      },
      local_files: {
        prompt: "prompt.md",
        model_prompt: "model_prompt.md",
        negative_prompt: "negative_prompt.md",
        start_frame: "start_frame.png",
        key_frame: "key_frame.png",
        end_frame: "end_frame.png",
      },
      model_notes: shot.model_notes || [],
      reject_if: uniqueRejectLines(shot.reject_if || []),
      primary_check: primaryCheck(shot),
      command_argv: modelCommand(runnableModelTemplate, localValues),
    };

    writeJson(path.join(shotDir, "metadata.json"), metadata);
    packagedShots.push({
      ...metadata,
      package_dir: path.relative(outDir, shotDir),
      prompt: path.relative(outDir, path.join(shotDir, "model_prompt.md")),
      audit_prompt: path.relative(outDir, path.join(shotDir, "prompt.md")),
      model_prompt: path.relative(outDir, path.join(shotDir, "model_prompt.md")),
      negative_prompt: path.relative(outDir, path.join(shotDir, "negative_prompt.md")),
      start_frame: path.relative(outDir, path.join(shotDir, "start_frame.png")),
      key_frame: path.relative(outDir, path.join(shotDir, "key_frame.png")),
      end_frame: path.relative(outDir, path.join(shotDir, "end_frame.png")),
    });

    for (const file of ["prompt.md", "model_prompt.md", "negative_prompt.md", "start_frame.png", "key_frame.png", "end_frame.png", "metadata.json"]) {
      if (!fs.existsSync(path.join(shotDir, file))) validationFailures.push(`${shot.shot}: missing packaged ${file}`);
    }
  }

  const totalDuration = packagedShots.reduce((sum, shot) => sum + Number(shot.duration_seconds || 0), 0);
  const submissionPayloadRows = renderSubmissionPayload(outDir, packagedShots);
  const submissionPayloadPath = path.join(outDir, "submission_payload.jsonl");
  const submissionPayloadManifestPath = path.join(outDir, "submission_payload_manifest.json");
  const submissionPayloadManifest = {
    version: 1,
    created_at: date,
    package_id: "scene09_v3_monitor_handoff_package_2026-07-27",
    source_manifest: rel(manifestPath),
    payload: "submission_payload.jsonl",
    rows: submissionPayloadRows.length,
    total_duration_seconds: totalDuration,
    model_prompt_policy: "Use model_prompt.md / prompt_text for video-model submission. Keep prompt.md as the audit contract.",
    status: "clips_pending",
    fields: Object.keys(submissionPayloadRows[0] || {}),
    sha256: crypto.createHash("sha256").update(submissionPayloadRows.map((row) => JSON.stringify(row)).join("\n") + "\n").digest("hex"),
  };
  const packageManifest = {
    version: 1,
    project: manifest.project,
    package_id: "scene09_v3_monitor_handoff_package_2026-07-27",
    source_manifest: rel(manifestPath),
    source_decision: manifest.decision,
    package_type: "monitor_handoff",
    status: "clips_pending",
    created_at: date,
    total_shots: packagedShots.length,
    total_duration_seconds: totalDuration,
    model_cli_configured: Boolean(runnableModelTemplate),
    model_cli_template_validation: modelTemplateValidation,
    final_assembly_gate: {
      expected_final_output: rel(finalOutput),
      expected_duration_seconds: totalDuration,
      required_reports: [
        "generated_clip_structural_audit.json",
        "actual_delivery_surface_audit.json",
        "current_status_consistency_gate.json",
        "provider_preflight_consistency_gate.json",
        "submission_contract_gate.json",
        "provider_submission_freshness_gate.json",
        "motion_self_audit/motion_self_audit_manifest.json",
        "motion_self_audit_packet_audit.json",
        "motion_self_audit_apply_positive_contract.json",
        "motion_self_audit_apply_gate.json",
        "after_clip_return_resume_positive_contract.json",
        "final_concat_positive_contract.json",
        "final_edit_positive_contract.json",
        "video_generation_run_positive_contract.json",
        "positive_contract_isolation_gate.json",
        "clip_return_roundtrip_audit.json",
        "model_cli_execution_provenance_audit.json",
        "clip_provenance_gate.json",
        "report_freshness_gate.json",
        "proxy_misuse_gate.json",
        "final_concat_gate.json",
        "final_edit_structural_audit.json",
        "video_generation_run_completion_audit.json",
      ],
      required_decisions: {
        generated_clip_structural_audit: "clip_files_integrity_passed_motion_review_still_required",
        actual_delivery_surface_audit: "actual_delivery_surface_passed",
        current_status_consistency_gate: "current_status_consistency_passed",
        provider_preflight_consistency_gate: "provider_preflight_consistency_passed",
        submission_contract_gate: "submission_contract_gate_passed",
        provider_submission_freshness_gate: "provider_submission_freshness_passed",
        motion_self_audit_packet_audit: "motion_self_audit_packet_ready",
        motion_self_audit_apply_positive_contract: "motion_self_audit_apply_positive_contract_passed",
        motion_self_audit_apply_gate: "motion_self_audit_apply_passed",
        after_clip_return_resume_positive_contract: "after_clip_return_resume_positive_contract_passed",
        final_concat_positive_contract: "final_concat_positive_contract_passed",
        final_edit_positive_contract: "final_edit_positive_contract_passed",
        video_generation_run_positive_contract: "video_generation_run_positive_contract_passed",
        positive_contract_isolation_gate: "positive_contract_isolation_passed",
        clip_return_roundtrip_audit: "clip_return_roundtrip_passed",
        model_cli_execution_provenance_audit: "model_cli_execution_provenance_passed",
        clip_provenance_gate: "clip_provenance_passed_all_expected_clips",
        motion_review_decisions: "motion_review_passed_ready_for_concat",
        report_freshness_gate: "report_freshness_passed_current_manifest",
        proxy_misuse_gate: "proxy_isolation_passed_expected_clips_present",
        final_concat_gate: "final_concat_gate_passed_ready_for_project_pipeline_concat",
        final_edit_structural_audit: "final_edit_structural_passed",
        video_generation_run_completion_audit: "video_generation_run_complete",
      },
      note: "Final delivery is blocked until real model clips exist, motion QA passes, concat gate passes, and ffprobe-based final edit structural QA passes.",
    },
    handoff_control_reports: {
      purpose: "Operator-facing submission, probe-return, and package-control reports that must stay discoverable and fresh even before full-duration video generation is unlocked.",
      required_reports: [
        "motion_probe_package_audit.json",
        "motion_probe_provider_bundles_audit.json",
        "motion_probe_submission_ready_gate.json",
        "motion_probe_operator_tracker.json",
        "motion_probe_operator_tracker_audit.json",
        "motion_probe_return_intake_audit.json",
        "motion_probe_return_roundtrip_audit.json",
        "full_local_visual_review.json",
        "full_duration_release_gate.json",
        "operator_preflight_status.json",
        "OPERATOR_NEXT_STEPS.json",
      ],
      required_decisions: {
        motion_probe_package_audit: "motion_probe_package_ready",
        motion_probe_provider_bundles_audit: "motion_probe_provider_bundles_ready",
        motion_probe_submission_ready_gate: "motion_probe_submission_ready",
        motion_probe_operator_tracker: "motion_probe_operator_tracker_ready_clips_pending_or_complete",
        motion_probe_operator_tracker_audit: "motion_probe_operator_tracker_audit_passed",
        motion_probe_return_intake_audit: "motion_probe_return_intake_ready",
        motion_probe_return_roundtrip_audit: "motion_probe_return_roundtrip_passed",
        full_local_visual_review: "full_local_visual_review_passed_for_motion_probe_not_video_approved",
        full_duration_release_gate: "full_duration_release_blocked_probe_review_pending_or_passed",
      },
    },
    submission_payload: "submission_payload.jsonl",
    submission_payload_manifest: "submission_payload_manifest.json",
    shots: packagedShots.map((shot) => ({
      id: shot.id,
      shot: shot.shot,
      order: shot.order,
      package_dir: shot.package_dir,
      status: shot.status,
      duration_seconds: shot.duration_seconds,
      expected_clip: shot.expected_clip,
      visible_named_only: shot.visible_named_only,
      title: shotTitle(shot),
      titleZh: shotTitle(shot),
      audio_anchor: shot.audio_anchor || "",
      source_frames: shot.source_frames || {},
      start_frame: shot.start_frame,
      key_frame: shot.key_frame,
      end_frame: shot.end_frame,
      reject_if: uniqueRejectLines(shot.reject_if || []),
      primary_check: shot.primary_check,
      model_prompt: shot.model_prompt,
      audit_prompt: shot.audit_prompt,
      battle_state_after: shot.battle_state_after || {},
      battle_ledger_after: shot.battle_ledger_after || {},
      alive_safe_after: shot.alive_safe_after || "none",
      active_or_objective_after: shot.active_or_objective_after || "none",
      limited_after: shot.limited_after || "none",
      defeated_removed_after: shot.defeated_removed_after || "none",
      captured_objective_defeated_after: shot.captured_objective_defeated_after || "none",
      stood_down_post_battle_after: shot.stood_down_post_battle_after || "none",
      must_not_return_active_after: shot.must_not_return_active_after || "none",
      changed_this_shot: shot.changed_this_shot || "none",
      no_active_combat_line: shot.no_active_combat_line || "none",
    })),
  };

  const timeline = {
    package_id: packageManifest.package_id,
    total_duration_seconds: totalDuration,
    clips: packagedShots.map((shot) => ({
      order: shot.order,
      id: shot.id,
      shot: shot.shot,
      duration_seconds: shot.duration_seconds,
      expected_clip: shot.expected_clip,
      edit_in: shot.edit_in,
      edit_out: shot.edit_out,
    })),
  };

  const executionPlan = {
    package_dir: outDir,
    package_id: packageManifest.package_id,
    package_type: "monitor_handoff",
    status: "clips_pending",
    source_decision: manifest.decision,
    model_cli_configured: Boolean(runnableModelTemplate),
    model_cli_template_validation: modelTemplateValidation,
    final_output: finalOutput,
    final_assembly_gate: {
      expected_duration_seconds: totalDuration,
      concat_command: "node scripts/run_scene09_v3_video_pipeline.js --execute --concat",
      structural_audit_command: `node scripts/audit_scene09_v3_final_edit_structural.js --file ${rel(finalOutput)}`,
      completion_requires: [
        "42 real expected clips",
        "submission contract gate pass",
        "clip structural audit pass",
        "motion-review frame extraction pass",
        "Codex motion self-audit pass",
        "empty clip revision queue",
        "report freshness gate pass",
        "positive contract isolation gate pass",
        "proxy misuse gate pass",
        "final concat gate pass",
        "final edit structural audit pass",
        "video generation run completion audit pass",
      ],
    },
    submission_payload: path.join(outDir, "submission_payload.jsonl"),
    total_shots: packagedShots.length,
    validation: {
      ok: validationFailures.length === 0,
      failures: validationFailures,
      note: "Monitor handoff is ready for model submission planning, but not approved_for_video until generated clips pass motion QA.",
    },
    work_orders: packagedShots,
  };

  const handoffAudit = {
    date,
    package_id: packageManifest.package_id,
    package_type: "monitor_handoff",
    source_manifest: rel(manifestPath),
    total_shots: packagedShots.length,
    total_duration_seconds: totalDuration,
    model_cli_configured: Boolean(runnableModelTemplate),
    model_cli_template_validation: modelTemplateValidation,
    final_assembly_gate: {
      expected_final_output: rel(finalOutput),
      expected_duration_seconds: totalDuration,
      final_concat_gate: "required_before_final_edit",
      final_edit_structural_audit: "required_after_concat",
      current_final_output_exists: fs.existsSync(finalOutput),
    },
    validation_failures: validationFailures,
    critical_checks: {
      shot034B_visible_named_only: packagedShots.find((shot) => shot.shot === "Shot034B")?.visible_named_only || [],
      shot034B_source_frames: packagedShots.find((shot) => shot.shot === "Shot034B")?.source_frames || {},
      submission_queue_rows_including_header: packagedShots.length + 1,
      submission_payload_rows: submissionPayloadRows.length,
      local_shot_directories: packagedShots.length,
      shot034B_empty_objective_required: true,
    },
    decision: validationFailures.length ? "blocked_needs_revision" : "monitor_handoff_ready_clips_pending",
  };

  writeJson(path.join(outDir, "package_manifest.json"), packageManifest);
  writeText(submissionPayloadPath, submissionPayloadRows.map((row) => JSON.stringify(row)).join("\n") + "\n");
  writeJson(submissionPayloadManifestPath, submissionPayloadManifest);
  writeJson(path.join(outDir, "timeline.json"), timeline);
  writeJson(path.join(outDir, "execution_plan.json"), executionPlan);
  writeJson(path.join(outDir, "handoff_validation.json"), handoffAudit);
  writeText(path.join(outDir, "submission_queue.csv"), renderQueue(packagedShots));
  writeText(path.join(outDir, "clip_motion_qa_checklist.csv"), renderMotionQaChecklist(packagedShots));
  writeText(path.join(outDir, "execution_commands.sh"), renderCommands(executionPlan));
  fs.chmodSync(path.join(outDir, "execution_commands.sh"), 0o755);
  writeText(path.join(outDir, "RUNBOOK.md"), renderRunbook(manifest, packagedShots, Boolean(runnableModelTemplate)));
  writeText(path.join(outDir, "HANDOFF_AUDIT.md"), [
    "# EP02 Scene09 V3 Monitor Handoff Audit",
    "",
    `Date: ${date}`,
    `Package: ${packageManifest.package_id}`,
    `Decision: ${handoffAudit.decision}`,
    "",
    "## Checks",
    "",
    `- Shots packaged: ${packagedShots.length}/42`,
    `- Submission queue rows including header: ${packagedShots.length + 1}`,
    `- Submission payload rows: ${submissionPayloadRows.length}`,
    `- Total duration: ${totalDuration} seconds`,
    `- Model CLI configured: ${Boolean(runnableModelTemplate) ? "yes" : "no"}`,
    `- Model CLI template audit: ${modelTemplateValidation.decision}`,
    `- Expected final edit: ${rel(finalOutput)}`,
    `- Final edit exists now: ${fs.existsSync(finalOutput) ? "yes" : "no"}`,
    "- Final edit structural audit: required after concat; must be `final_edit_structural_passed` before delivery",
    `- Validation failures: ${validationFailures.length}`,
    "",
    "## 034B Evidence",
    "",
    `- Visible named-only: ${(handoffAudit.critical_checks.shot034B_visible_named_only || []).join(", ")}`,
    `- Start frame: ${handoffAudit.critical_checks.shot034B_source_frames.start_frame}`,
    `- Key frame: ${handoffAudit.critical_checks.shot034B_source_frames.key_frame}`,
    `- End frame: ${handoffAudit.critical_checks.shot034B_source_frames.end_frame}`,
    "",
    "## Status",
    "",
    "This handoff is ready for video-model submission planning, but remains `monitor_required` until generated clips pass motion QA.",
    "",
  ].join("\n"));

  const result = {
    package_dir: rel(outDir),
    package_type: "monitor_handoff",
    shots: packagedShots.length,
    total_duration_seconds: totalDuration,
    model_cli_configured: Boolean(runnableModelTemplate),
    model_cli_template_validation: modelTemplateValidation,
    validation_failures: validationFailures,
  };
  console.log(JSON.stringify(result, null, 2));
  if (validationFailures.length) process.exit(1);
}

main();
