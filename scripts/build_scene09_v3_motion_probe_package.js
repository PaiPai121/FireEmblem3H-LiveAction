#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const packageRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const packageDir = path.join(root, packageRel);
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const outRel = `${packageRel}/motion_probe_submission`;
const outDir = path.join(root, outRel);
const probeDurationSeconds = 3;

const ledgerFields = [
  "alive_safe_after",
  "visible_but_no_active_combat_after",
  "active_or_objective_after",
  "limited_after",
  "defeated_removed_after",
  "captured_objective_defeated_after",
  "stood_down_post_battle_after",
  "must_not_return_active_after",
  "changed_this_shot",
  "no_active_combat_line",
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function rel(file) {
  return path.relative(root, file);
}

function csvCell(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function section(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(text || "").match(new RegExp(`^${escaped}:\\n([\\s\\S]*?)(?=\\n[A-Za-z][A-Za-z /-]*:\\n|\\n?$)`, "m"));
  return match ? match[1].trim() : "";
}

function makeProbePrompt(fullPrompt, shot) {
  const durationLine = `Duration: ${probeDurationSeconds} seconds. Motion probe only; generate only the first ${probeDurationSeconds} seconds from the start/key/end frame chain. Full-duration generation is not approved until this probe passes identity, wardrobe, prop, geography, no-extra-people, no-subtitles, and post-shot ledger review.`;
  let prompt = fullPrompt.replace(
    /^Duration:\s*(?:\n\s*)?\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?\s*seconds\.[^\n]*/m,
    durationLine,
  );
  if (prompt === fullPrompt) {
    prompt = fullPrompt.replace(
      /^Duration:\s*(?:\n\s*)?\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?\s*seconds\s*$/m,
      durationLine,
    );
  }
  const probeBlock = [
    "",
    "Motion Probe Contract:",
    `- Duration: ${probeDurationSeconds} seconds; motion probe only for ${shot.shot}, not the final full-duration clip.`,
    "- Preserve the approved start/key/end frame chain, but do not invent extra action to finish the full 6-second beat early.",
    "- Full-duration generation is not approved until this probe passes identity, wardrobe, prop, geography, no-extra-people, no-subtitles, and post-shot ledger review.",
    "- The probe passes only if readable people remain limited to the Visible readable humans list, anyone listed as Visible But No Active Combat After stays in stand-down/concession/post-battle behavior, wardrobe and training weapons hold, no anonymous students or spectators appear, no subtitles/captions/visible text appear, and post-shot inactive/captured/stood-down characters do not resume active combat.",
    "- Full-duration generation remains blocked until the returned probe clip passes Codex motion QA and the motion self-audit package records signed evidence.",
  ].join("\n");
  return `${prompt.trim()}\n${probeBlock}\n`;
}

function expectedProbeClip(row) {
  return `episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/${String(row.order).padStart(2, "0")}_${row.shot}_probe.mp4`;
}

function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}

function visibleButNoActiveText(visible, ledger) {
  const active = new Set(flattenGroups(ledger.active_by_house || ledger.still_active_or_controlling_objective_by_house));
  const inactiveVisible = (visible || []).filter((name) => name && !active.has(name));
  return inactiveVisible.length ? inactiveVisible.join(", ") : "none";
}

function renderCsv(rows) {
  const fields = [
    "custom_id",
    "order",
    "shot",
    "probe_duration_seconds",
    "parent_full_duration_seconds",
    "visible_named_only",
    "probe_prompt_file",
    "negative_prompt_file",
    "start_frame",
    "key_frame",
    "end_frame",
    "expected_probe_clip",
    ...ledgerFields,
  ];
  return [
    fields.join(","),
    ...rows.map((row) => fields.map((field) => csvCell(row[field])).join(",")),
    "",
  ].join("\n");
}

function renderChecklist(rows) {
  const fields = [
    "custom_id",
    "shot",
    "probe_clip_returned",
    "identity_preserved",
    "wardrobe_preserved",
    "training_weapons_preserved",
    "visible_named_only_passed",
    "no_extra_people_passed",
    "no_subtitles_visible_text_passed",
    "post_shot_ledger_respected",
    "teacher_separation_respected",
    "approve_full_duration",
    "reviewer_notes",
  ];
  return [
    fields.join(","),
    ...rows.map((row) => fields.map((field) => csvCell({
      custom_id: row.custom_id,
      shot: row.shot,
      probe_clip_returned: "pending",
      identity_preserved: "pending",
      wardrobe_preserved: "pending",
      training_weapons_preserved: "pending",
      visible_named_only_passed: "pending",
      no_extra_people_passed: "pending",
      no_subtitles_visible_text_passed: "pending",
      post_shot_ledger_respected: "pending",
      teacher_separation_respected: "pending",
      approve_full_duration: "no",
      reviewer_notes: "",
    }[field])).join(",")),
    "",
  ].join("\n");
}

function main() {
  if (!fs.existsSync(packageManifestPath)) throw new Error(`Missing package manifest: ${packageManifestPath}`);
  const manifest = readJson(packageManifestPath);
  const rows = [];

  for (const shot of [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order))) {
    const shotDir = path.join(packageDir, shot.package_dir);
    const modelPromptPath = path.join(shotDir, "model_prompt.md");
    const negativePromptPath = path.join(shotDir, "negative_prompt.md");
    const metadataPath = path.join(shotDir, "metadata.json");
    const modelPrompt = readText(modelPromptPath);
    const negativePrompt = readText(negativePromptPath);
    const metadata = readJson(metadataPath);
    const customId = `${String(shot.order).padStart(3, "0")}_${shot.shot}_probe`;
    const probeShotDirRel = `motion_probe_submission/shots/${String(shot.order).padStart(3, "0")}_${shot.id}`;
    const probeShotDir = path.join(packageDir, probeShotDirRel);
    const probePrompt = makeProbePrompt(modelPrompt, shot);
    const probePromptPath = path.join(probeShotDir, "probe_prompt.md");
    const probeNegativePath = path.join(probeShotDir, "negative_prompt.md");
    const probeMetadataPath = path.join(probeShotDir, "metadata.json");
    const inputFrames = {
      start_frame: `${shot.package_dir}/start_frame.png`,
      key_frame: `${shot.package_dir}/key_frame.png`,
      end_frame: `${shot.package_dir}/end_frame.png`,
    };
    const visibleNamedOnly = shot.visible_named_only || [];
    const battleLedgerAfter = metadata.battle_state_after?.battle_ledger_after || metadata.battle_ledger_after || shot.battle_ledger_after || {};
    const row = {
      custom_id: customId,
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      title: shot.title || shot.titleZh || shot.shot,
      probe_duration_seconds: probeDurationSeconds,
      parent_full_duration_seconds: shot.duration_seconds,
      visible_named_only: visibleNamedOnly.join(", "),
      visible_but_no_active_combat_after: visibleButNoActiveText(visibleNamedOnly, battleLedgerAfter),
      audio_anchor: section(modelPrompt, "Audio") || shot.audio_anchor || "",
      probe_prompt_file: `${probeShotDirRel}/probe_prompt.md`,
      negative_prompt_file: `${probeShotDirRel}/negative_prompt.md`,
      metadata_file: `${probeShotDirRel}/metadata.json`,
      start_frame: inputFrames.start_frame,
      key_frame: inputFrames.key_frame,
      end_frame: inputFrames.end_frame,
      expected_probe_clip: expectedProbeClip(shot),
      parent_expected_clip: shot.expected_clip,
      primary_check: metadata.primary_check || shot.primary_check || "",
      reject_if: metadata.reject_if || shot.reject_if || [],
      battle_ledger_after: battleLedgerAfter,
    };
    for (const field of ledgerFields) row[field] = metadata[field] || shot[field] || "none";

    writeText(probePromptPath, probePrompt);
    writeText(probeNegativePath, `${negativePrompt.trim()}\n`);
    writeJson(probeMetadataPath, {
      ...row,
      source_model_prompt: rel(modelPromptPath),
      source_negative_prompt: rel(negativePromptPath),
      source_metadata: rel(metadataPath),
      input_frames: inputFrames,
      probe_prompt_sha256: sha256Text(probePrompt),
      negative_prompt_sha256: sha256Text(`${negativePrompt.trim()}\n`),
      release_condition: "Full-duration generation remains blocked until this probe clip passes motion QA with signed clip/frame evidence.",
    });
    rows.push(row);
  }

  const payloadJsonl = rows.map((row) => JSON.stringify({
    ...row,
    prompt_text: readText(path.join(packageDir, row.probe_prompt_file)),
    negative_prompt_text: readText(path.join(packageDir, row.negative_prompt_file)).trim(),
  })).join("\n") + "\n";
  writeText(path.join(outDir, "motion_probe_payload.jsonl"), payloadJsonl);
  writeText(path.join(outDir, "motion_probe_queue.csv"), renderCsv(rows));
  writeText(path.join(outDir, "motion_probe_qa_checklist.csv"), renderChecklist(rows));
  writeText(path.join(outDir, "README.md"), [
    "# Scene09 V3 Motion Probe Submission",
    "",
    "This package is for 3-second identity and continuity probes before full 6-second clip generation.",
    "",
    "Use `motion_probe_payload.jsonl` for structured submitters or `motion_probe_queue.csv` for manual tracking. Each `probe_prompt.md` keeps the original shot locks, negative prompt, audio/no-subtitle policy, and post-shot battle ledger, but changes duration to a 3-second probe.",
    "",
    "Do not generate or approve the full-duration clip until the returned probe clip passes the QA checklist with explicit evidence for identity, wardrobe, training weapons, no extra readable humans, no subtitles/visible text, teacher separation, and post-shot attrition continuity.",
    "",
    "Returned probe clips should be saved to the `expected_probe_clip` path listed per row.",
    "",
  ].join("\n"));

  const manifestOut = {
    version: 1,
    generated_at: new Date().toISOString(),
    decision: "motion_probe_package_ready",
    package_dir: packageRel,
    probe_dir: outRel,
    probe_duration_seconds: probeDurationSeconds,
    parent_full_duration_seconds: 6,
    total_shots: rows.length,
    source_package_manifest: rel(packageManifestPath),
    source_package_manifest_sha256: sha256File(packageManifestPath).sha256,
    payload: {
      path: `${outRel}/motion_probe_payload.jsonl`,
      ...sha256File(path.join(outDir, "motion_probe_payload.jsonl")),
    },
    queue_csv: {
      path: `${outRel}/motion_probe_queue.csv`,
      ...sha256File(path.join(outDir, "motion_probe_queue.csv")),
    },
    qa_checklist_csv: {
      path: `${outRel}/motion_probe_qa_checklist.csv`,
      ...sha256File(path.join(outDir, "motion_probe_qa_checklist.csv")),
    },
    rows: rows.map((row) => ({
      ...row,
      probe_prompt_digest: sha256File(path.join(packageDir, row.probe_prompt_file)),
      negative_prompt_digest: sha256File(path.join(packageDir, row.negative_prompt_file)),
      metadata_digest: sha256File(path.join(packageDir, row.metadata_file)),
    })),
  };
  writeJson(path.join(outDir, "motion_probe_manifest.json"), manifestOut);

  console.log(JSON.stringify({
    ok: true,
    decision: manifestOut.decision,
    rows: rows.length,
    probe_duration_seconds: probeDurationSeconds,
    directory: outRel,
    payload: manifestOut.payload.path,
  }, null, 2));
}

main();
