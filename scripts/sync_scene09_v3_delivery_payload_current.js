#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = path.resolve(__dirname, "..");
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const payloadPath = path.join(packageDir, "submission_payload.jsonl");
const payloadManifestPath = path.join(packageDir, "submission_payload_manifest.json");
const submissionQueuePath = path.join(packageDir, "submission_queue.csv");
const executionPlanPath = path.join(packageDir, "execution_plan.json");
const activeManifestPath = path.join(root, "production_system/video_delivery_manifest.json");
const queuePath = path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeText(file, text) {
  fs.writeFileSync(file, text);
}

function digest(file) {
  const buffer = fs.readFileSync(file);
  return {
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function flattenGroups(groups) {
  return Object.values(groups || {}).flatMap((names) => Array.isArray(names) ? names : []);
}

function unique(names) {
  return [...new Set(names.filter(Boolean))];
}

function shotTitle(shot, metadata = {}) {
  return String(
    metadata.titleZh ||
    metadata.title ||
    shot.titleZh ||
    shot.title ||
    shot.shot ||
    shot.id ||
    ""
  ).trim();
}

function uniqueLines(lines) {
  const seen = new Set();
  const result = [];
  for (const line of lines || []) {
    const text = String(line || "").trim();
    if (!text) continue;
    const key = text
      .replace(/^[-\s]+/, "")
      .replace(/^Reject if\s+/i, "")
      .replace(/\s+/g, " ")
      .replace(/[.。]+$/g, "")
      .toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(text);
  }
  return result;
}

function characterNames(characters) {
  if (Array.isArray(characters)) return characters.map((character) => character.name || character).filter(Boolean);
  if (typeof characters === "string") return characters.split(",").map((name) => name.trim()).filter(Boolean);
  return [];
}

function syncFramePrompt(prompt, visibleNames, characters) {
  if (!prompt) return prompt;
  const visibleText = visibleNames.length ? visibleNames.join(", ") : "no readable named characters; tactical geography only";
  const characterLines = (characters || [])
    .map((character) => {
      if (typeof character === "string") return character;
      const name = character.name;
      if (!name) return "";
      const lock = character.weapon_lock || character.lock || "identity and costume reference lock";
      const asset = character.asset || character.reference || character.reference_image;
      return `${name}: ${lock}${asset ? `; reference=${asset}` : ""}`;
    })
    .filter(Boolean)
    .join("\n") || "No named face close enough to require identity lock.";
  let next = prompt.replace(/^Characters visible:.*$/m, `Characters visible: ${visibleText}`);
  next = next.replace(
    /^Character identity and weapon locks:\n[\s\S]*?(?=^Screen direction:)/m,
    `Character identity and weapon locks:\n${characterLines}\n`
  );
  return next;
}

const shot025SubmissionContract = {
  primary_check: "Visible named-only: Dimitri, Edelgard, Claude. No attrition change; preserve previous battle state. Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
  reject_if: [
    "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
    "Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
    "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
    "Reject if any face, age, costume, house color, or weapon changes from the input frames and named references.",
    "Reject if the action becomes lethal, bloody, humiliating, or unrelated to the start/key/end chain.",
    "anyone outside Dimitri, Edelgard, and Claude appears as a readable human.",
    "Hanneman or Manuela appear visually; their rule lines must remain separate offscreen audio only.",
    "the shot adds any readable student beyond the three house leaders or adds anonymous spectators.",
    "any teacher platform is occupied or the geography implies Hanneman and Manuela are side-by-side partners.",
  ],
};

const shot025NegativePrompt = [
  "no extra people",
  "no unnamed students",
  "no teachers",
  "no spectators",
  "no soldiers",
  "no crowds",
  "no readable silhouettes",
  "no Byleth",
  "no face drift",
  "no costume drift",
  "no weapon drift",
  "no wrong house colors",
  "no wrong-age faces",
  "no domination pose",
  "no humiliation",
  "no lethal combat",
  "no lethal hits",
  "no blood",
  "no gore",
  "no text",
  "no subtitles",
  "no captions",
  "no visible text",
  "no watermark",
  "no camera spin",
  "no paired Hanneman and Manuela",
  "no shared teacher platform",
  "no same-lane teacher duo",
  "no readable Hanneman",
  "no readable Manuela",
].join(", ");

const shot030BNegativePrompt = [
  "no extra people",
  "no unnamed students",
  "no spectators",
  "no crowds",
  "no readable silhouettes",
  "no chain blade",
  "no segmented blade",
  "no whip sword",
  "no metal sword",
  "no sharp sword",
  "no glowing relic",
  "no Sword of the Creator",
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
  "no paired Hanneman and Manuela",
  "no shared teacher platform",
  "no same-lane teacher duo",
  "no readable Hanneman",
  "no readable Manuela",
].join(", ");

function insertAfter(text, anchor, lines) {
  let next = text;
  for (const line of lines) {
    if (next.includes(line)) continue;
    next = next.replace(anchor, `${anchor}\n${line}`);
  }
  return next;
}

function applyPersistentContractOverrides(activeManifest, manifest) {
  const active025 = (activeManifest.shots || []).find((shot) => shot.shot === "Shot025");
  if (active025) {
    active025.primary_check = shot025SubmissionContract.primary_check;
    active025.reject_if = shot025SubmissionContract.reject_if;
  }

  const packageByShot = new Map((manifest.shots || []).map((shot) => [shot.shot, shot]));
  const shot025 = packageByShot.get("Shot025");
  if (shot025) {
    const metadataPath = path.join(packageDir, shot025.package_dir, "metadata.json");
    const modelPromptPath = path.join(packageDir, shot025.package_dir, "model_prompt.md");
    const negativePromptPath = path.join(packageDir, shot025.package_dir, "negative_prompt.md");
    const metadata = readJson(metadataPath);
    metadata.primary_check = shot025SubmissionContract.primary_check;
    metadata.reject_if = shot025SubmissionContract.reject_if;
    metadata.negative_prompt = shot025NegativePrompt;
    let modelPrompt = readText(modelPromptPath);
    modelPrompt = insertAfter(modelPrompt, "Identity / Presence Locks:", [
      "Only these readable humans may appear: Dimitri, Edelgard, Claude.",
      "No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.",
      "Hanneman and Manuela are separate faculty examiners; never side by side, sharing one sigil, or allied partners.",
      "Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
      "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
      "Nonlethal mock battle only: no blood, gore, humiliation, or lethal hits.",
    ]);
    if (!modelPrompt.includes("Attrition State After This Shot:")) {
      modelPrompt = modelPrompt.replace(
        "\nBattle Ledger After This Shot:",
        "\nAttrition State After This Shot:\nNo attrition change; rules and objective are established.\n\nBattle Ledger After This Shot:",
      );
    }
    modelPrompt = modelPrompt.replace(/Negative Prompt:\n[\s\S]*$/m, `Negative Prompt:\n${shot025NegativePrompt}\n`);
    writeText(modelPromptPath, modelPrompt);
    writeText(negativePromptPath, `${shot025NegativePrompt}\n`);
    writeText(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  }

  const shot030B = packageByShot.get("Shot030B");
  if (!shot030B) return;
  const shotDir = path.join(packageDir, shot030B.package_dir);
  const metadataPath = path.join(shotDir, "metadata.json");
  const modelPromptPath = path.join(shotDir, "model_prompt.md");
  const negativePromptPath = path.join(shotDir, "negative_prompt.md");
  const metadata = readJson(metadataPath);
  let modelPrompt = readText(modelPromptPath);

  modelPrompt = insertAfter(modelPrompt, "Identity / Presence Locks:", [
    "Only these readable humans may appear: Felix, Byleth.",
    "Hanneman and Manuela are separate faculty examiners; never side by side, sharing one sigil, or allied partners.",
    "Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
    "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
    "Nonlethal mock battle only: no blood, gore, humiliation, or lethal hits.",
  ]);
  if (!modelPrompt.includes("Attrition State After This Shot:")) {
    modelPrompt = modelPrompt.replace(
      "\nBattle Ledger After This Shot:",
      "\nAttrition State After This Shot:\nNo attrition change; Felix is checked before overextension and remains active for now.\n\nBattle Ledger After This Shot:",
    );
  }
  modelPrompt = modelPrompt.replace(/Negative Prompt:\n[\s\S]*$/m, `Negative Prompt:\n${shot030BNegativePrompt}\n`);

  writeText(modelPromptPath, modelPrompt);
  writeText(negativePromptPath, `${shot030BNegativePrompt}\n`);
  metadata.negative_prompt = shot030BNegativePrompt;
  writeText(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
}

function syncQueueFromManifest(activeManifest, packageManifest) {
  if (!fs.existsSync(queuePath)) return 0;
  const queue = readJson(queuePath);
  const activeByShot = new Map((activeManifest.shots || []).map((shot) => [shot.shot, shot]));
  const packageByShot = new Map((packageManifest.shots || []).map((shot) => [shot.shot, shot]));
  const assetByName = new Map();
  for (const item of queue) {
    if (!Array.isArray(item.characters)) continue;
    for (const character of item.characters) {
      const name = character.name || character;
      if (name && !assetByName.has(name)) assetByName.set(name, character);
    }
  }
  let changed = 0;
  for (const item of queue) {
    const packageShot = packageByShot.get(item.shot);
    const activeShot = activeByShot.get(item.shot);
    if (!packageShot || !activeShot) continue;
    const metadataPath = path.join(packageDir, packageShot.package_dir, "metadata.json");
    const metadata = fs.existsSync(metadataPath) ? readJson(metadataPath) : {};
    const visibleNames = metadata.visible_named_only || activeShot.visible_named_only || packageShot.visible_named_only || [];
    const oldCharacters = Array.isArray(item.characters) ? item.characters : [];
    const directCharacters = [
      ...(Array.isArray(metadata.characters) ? metadata.characters : []),
      ...(Array.isArray(activeShot.characters) ? activeShot.characters : []),
      ...oldCharacters,
    ];
    const directByName = new Map();
    for (const character of directCharacters) {
      const name = character.name || character;
      if (name && !directByName.has(name)) directByName.set(name, character);
    }
    const characters = visibleNames.map((name) => directByName.get(name) || assetByName.get(name) || { name });

    item.visible_named_only = visibleNames;
    item.characters = characters;
    item.audio_anchor = metadata.audio_anchor || activeShot.audio_anchor || item.audio_anchor;
    item.note = metadata.note || activeShot.note || item.note;
    item.after_shot_note = metadata.battle_state_after?.note || activeShot.battle_state_after?.note || item.after_shot_note;
    item.primary_check = metadata.primary_check || activeShot.primary_check || item.primary_check;
    item.primary_continuity_check = metadata.primary_continuity_check || activeShot.primary_continuity_check || item.primary_continuity_check;
    item.reject_if = metadata.reject_if || activeShot.reject_if || item.reject_if;
    item.source_frames = metadata.source_frames || activeShot.source_frames || item.source_frames;
    item.frames = metadata.frames || activeShot.frames || item.frames;
    item.start_frame = metadata.start_frame || activeShot.start_frame || item.start_frame;
    item.key_frame = metadata.key_frame || activeShot.key_frame || item.key_frame;
    item.end_frame = metadata.end_frame || activeShot.end_frame || item.end_frame;
    const framePaths = metadata.source_frames || {
      start_frame: metadata.start_frame || activeShot.start_frame,
      key_frame: metadata.key_frame || activeShot.key_frame,
      end_frame: metadata.end_frame || activeShot.end_frame,
    };
    item.frames = item.frames || {};
    item.frames.start = item.frames.start || {};
    item.frames.key = item.frames.key || {};
    item.frames.end = item.frames.end || {};
    if (framePaths.start_frame) item.frames.start.path = framePaths.start_frame;
    if (framePaths.key_frame) item.frames.key.path = framePaths.key_frame;
    if (framePaths.end_frame) item.frames.end.path = framePaths.end_frame;
    item.motion = metadata.motion || activeShot.motion || item.motion;
    item.video_prompt = metadata.video_prompt || activeShot.video_prompt || item.video_prompt;
    item.battle_state_after = metadata.battle_state_after || activeShot.battle_state_after || item.battle_state_after;
    item.battle_ledger_after = item.battle_state_after?.battle_ledger_after || activeShot.battle_ledger_after || item.battle_ledger_after;
    item.roster_after = item.battle_state_after || item.roster_after;
    for (const frame of [item.frames?.start, item.frames?.key, item.frames?.end]) {
      if (frame?.prompt) frame.prompt = syncFramePrompt(frame.prompt, visibleNames, characters);
    }
    changed += 1;
  }
  fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
  return changed;
}

function ledgerFrom(metadata) {
  return metadata.battle_state_after?.battle_ledger_after || metadata.battle_after?.battle_ledger_after || metadata.battle_ledger_after || {};
}

function stateNoActive(metadata, ledger) {
  return unique([
    ...(Array.isArray(metadata.battle_state_after?.no_active_combat_after) ? metadata.battle_state_after.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
  ]);
}

function visibleButNoActive(metadata, ledger) {
  const visible = Array.isArray(metadata.visible_named_only) ? metadata.visible_named_only : [];
  const active = new Set(flattenGroups(ledger.still_active_or_controlling_objective_by_house || ledger.active_by_house));
  return visible.filter((name) => name && !active.has(name));
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

function payloadLedgerFields(metadata) {
  const state = metadata.battle_state_after || {};
  const ledger = ledgerFrom(metadata);
  const noActive = stateNoActive(metadata, ledger);
  return {
    battle_state_after: state,
    battle_ledger_after: ledger,
    alive_safe_after: groupText(ledger.alive_by_house || state.active_by_house),
    visible_but_no_active_combat_after: visibleButNoActive(metadata, ledger).join(", ") || "none",
    active_or_objective_after: groupText(ledger.still_active_or_controlling_objective_by_house || state.active_by_house),
    limited_after: groupText(ledger.limited_but_not_defeated_by_house),
    defeated_removed_after: groupText(ledger.mock_battle_defeated_or_removed_by_house || state.inactive_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_or_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_or_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: noActive.join(", ") || "none",
  };
}

function appendUniqueNegativeTokens(text, tokens) {
  const existing = String(text || "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
  const seen = new Set(existing.map((token) => token.toLowerCase()));
  for (const token of tokens) {
    const clean = String(token || "").trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    existing.push(clean);
  }
  return existing.join(", ");
}

function syncNegativePromptForLedger(metadata, text) {
  const visible = new Set(metadata.visible_named_only || []);
  const ledger = ledgerFrom(metadata);
  const noActive = stateNoActive(metadata, ledger);
  const captured = [
    ...flattenGroups(ledger.captured_or_objective_defeated_by_house),
    ...flattenGroups(ledger.captured_objective_defeated_by_house),
  ].filter((name, index, all) => name && all.indexOf(name) === index);
  const tokens = [
    "no extra people",
    "no unnamed students",
    "no spectators",
    "no crowds",
    "no readable silhouettes",
    "no face drift",
    "no costume drift",
    "no weapon drift",
    "no lethal hits",
    "no text",
    "no subtitles",
    "no captions",
    "no visible text",
    "no watermark",
    "no camera spin",
    "no screen-direction reversal",
    "no gore",
    "no blood",
    "no paired Hanneman and Manuela",
    "no shared teacher platform",
    "no same-lane teacher duo",
  ];
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
    if (!visible.has(name)) tokens.push(`no uncaptured return of ${name}`);
  }
  return appendUniqueNegativeTokens(text, tokens);
}

function normalizePromptContractText(text) {
  return String(text || "")
    .replaceAll(
      "Reject if any extra readable human, unnamed student, teacher, soldier, spectator, crowd, or silhouette appears.",
      "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
    );
}

function ensureTeacherContinuityLock(modelPrompt, shot) {
  if (shot.shot === "Shot034B") return modelPrompt;
  const lock = "- Hanneman and Manuela are separate faculty examiners; never side by side, sharing one sigil, or allied partners.";
  if (modelPrompt.includes("Hanneman and Manuela are separate faculty examiners")
    || modelPrompt.includes("Hanneman is alone on his own faculty lane/platform; Manuela is absent, offscreen, silent, and never paired with Hanneman.")) {
    return modelPrompt;
  }
  if (/(Continuity (?:hard locks|Locks):\n)/.test(modelPrompt)) {
    return modelPrompt.replace(/(Continuity (?:hard locks|Locks):\n)/, `$1${lock}\n`);
  }
  return `${modelPrompt.trimEnd()}\n\nContinuity Locks:\n${lock}\n`;
}

function syncPromptNegativeSection(modelPrompt, negativePrompt) {
  let next = modelPrompt;
  const cameraLock = "Camera/screen-direction negative lock: no camera spin, no screen-direction reversal.";
  if (!next.includes(cameraLock)) {
    next = next.replace(/\nNegative Prompt:\n/, `\n${cameraLock}\n\nNegative Prompt:\n`);
  }
  for (const phrase of [
    "Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
    "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
  ]) {
    if (!next.includes(phrase)) {
      next = next.replace(/\nNegative Prompt:\n/, `\n${phrase}\n\nNegative Prompt:\n`);
    }
  }
  const section = `Negative Prompt:\n${negativePrompt}\n`;
  if (/Negative Prompt:\n[\s\S]*$/m.test(next)) {
    return next.replace(/Negative Prompt:\n[\s\S]*$/m, section);
  }
  return `${next.trimEnd()}\n\n${section}`;
}

function syncRejectIfSection(modelPrompt, rejects) {
  const rejectSectionPattern = /Reject If:\n([\s\S]*?)(?=\n\n[A-Za-z][A-Za-z /-]*:\s|\s*$)/;
  const existingMatch = modelPrompt.match(rejectSectionPattern);
  const existing = existingMatch
    ? normalizePromptContractText(existingMatch[1]).split("\n").map((line) => line.trim()).filter(Boolean)
    : [];
  const merged = uniqueLines([...existing, ...(rejects || []).map(normalizePromptContractText)])
    .map((line) => line.startsWith("-") ? line : `- ${line}`);
  const section = `Reject If:\n${merged.join("\n")}\n`;
  if (rejectSectionPattern.test(modelPrompt)) {
    return modelPrompt.replace(rejectSectionPattern, section);
  }
  return modelPrompt.replace(/\nNegative Prompt:\n/, `\n${section}\nNegative Prompt:\n`);
}

function syncNoActiveLine(modelPrompt, names) {
  const value = names.length ? names.join(", ") : "none";
  const line = `- No-active-combat after this shot: ${value}.`;
  if (/- No-active-combat after this shot:.*$/m.test(modelPrompt)) {
    return modelPrompt.replace(/- No-active-combat after this shot:.*$/m, line);
  }
  return modelPrompt.replace(/(Continuity (?:hard locks|Locks):\n)/, `$1${line}\n`);
}

function syncVisibleButNoActiveLine(modelPrompt, names) {
  const value = names.length ? names.join(", ") : "none";
  const line = `- Visible But No Active Combat After: ${value}.`;
  if (/- Visible But No Active Combat After:.*$/m.test(modelPrompt)) {
    return modelPrompt.replace(/- Visible But No Active Combat After:.*$/m, line);
  }
  if (/- No-active-combat after this shot:.*$/m.test(modelPrompt)) {
    return modelPrompt.replace(/(- No-active-combat after this shot:.*$)/m, `$1\n${line}`);
  }
  return modelPrompt.replace(/(Continuity Locks:\n)/, `$1${line}\n`);
}

function syncVisibleBlocks(modelPrompt, names) {
  const value = names.length ? names.join(", ") : "none";
  let next = modelPrompt.replace(
    /Visible readable humans:\n[^\n]*(?=\n\n)/,
    `Visible readable humans:\n${value}`
  );
  next = next.replace(
    /- Only these readable humans may appear: .*$/m,
    `- Only these readable humans may appear: ${value}.`
  );
  return next;
}

function relativeFromPackage(file) {
  return path.relative(packageDir, file);
}

function csvCell(value) {
  const text = String(value == null ? "" : value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function localShotFiles(shot) {
  return {
    prompt: path.join(shot.package_dir, "model_prompt.md"),
    audit_prompt: path.join(shot.package_dir, "prompt.md"),
    model_prompt: path.join(shot.package_dir, "model_prompt.md"),
    negative_prompt: path.join(shot.package_dir, "negative_prompt.md"),
    start_frame: path.join(shot.package_dir, "start_frame.png"),
    key_frame: path.join(shot.package_dir, "key_frame.png"),
    end_frame: path.join(shot.package_dir, "end_frame.png"),
  };
}

function syncSubmissionEntrypoints(manifest) {
  const shots = [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const header = [
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
  const queueRows = shots.map((shot) => [
    shot.order,
    shot.shot,
    shot.status,
    shot.duration_seconds,
    shot.package_dir,
    "prompt.md",
    "model_prompt.md",
    "negative_prompt.md",
    "start_frame.png",
    "key_frame.png",
    "end_frame.png",
    shot.expected_clip,
    (shot.visible_named_only || []).join("; "),
    shot.primary_check || "",
  ].map(csvCell).join(","));
  writeText(submissionQueuePath, `${header.join(",")}\n${queueRows.join("\n")}\n`);

  if (fs.existsSync(executionPlanPath)) {
    const executionPlan = readJson(executionPlanPath);
    const byShot = new Map(shots.map((shot) => [shot.shot, shot]));
    executionPlan.total_shots = shots.length;
    executionPlan.work_orders = (executionPlan.work_orders || []).map((workOrder) => {
      const shot = byShot.get(workOrder.shot);
      if (!shot) return workOrder;
      return {
        ...workOrder,
        id: shot.id,
        shot: shot.shot,
        order: shot.order,
        package_type: "monitor_handoff",
        status: shot.status,
        duration_seconds: shot.duration_seconds,
        expected_clip: shot.expected_clip,
        visible_named_only: shot.visible_named_only || [],
        audio_anchor: shot.audio_anchor || "",
        reject_if: shot.reject_if || [],
        primary_check: shot.primary_check || "",
        ...localShotFiles(shot),
      };
    }).sort((a, b) => Number(a.order) - Number(b.order));
    writeText(executionPlanPath, `${JSON.stringify(executionPlan, null, 2)}\n`);
  }
}

function main() {
  cp.execFileSync(process.execPath, ["scripts/apply_scene09_034B_empty_objective_authoritative_current.js"], {
    cwd: root,
    stdio: "inherit",
  });
  cp.execFileSync(process.execPath, ["scripts/apply_scene09_034E_golden_deer_weapons_authoritative.js"], {
    cwd: root,
    stdio: "inherit",
  });
  cp.execFileSync(process.execPath, ["scripts/apply_scene09_034G_core_victory_authoritative.js"], {
    cwd: root,
    stdio: "inherit",
  });
  cp.execFileSync(process.execPath, ["scripts/apply_scene09_036_dimitri_lance_authoritative.js"], {
    cwd: root,
    stdio: "inherit",
  });

  const activeManifest = readJson(activeManifestPath);
  const manifest = readJson(manifestPath);
  applyPersistentContractOverrides(activeManifest, manifest);
  for (const row of activeManifest.shots || []) {
    if (Array.isArray(row.reject_if)) row.reject_if = uniqueLines(row.reject_if);
  }
  fs.writeFileSync(activeManifestPath, `${JSON.stringify(activeManifest, null, 2)}\n`);
  const queueSynced = syncQueueFromManifest(activeManifest, manifest);
  const rows = [];
  let promptsPatched = 0;

  for (const shot of manifest.shots || []) {
    const shotDir = path.join(packageDir, shot.package_dir);
    const metadataPath = path.join(shotDir, "metadata.json");
    const modelPromptPath = path.join(shotDir, "model_prompt.md");
    const negativePromptPath = path.join(shotDir, "negative_prompt.md");
    const metadata = readJson(metadataPath);
    const ledger = ledgerFrom(metadata);
    const names = stateNoActive(metadata, ledger);
    const visibleNames = Array.isArray(metadata.visible_named_only) ? metadata.visible_named_only : (shot.visible_named_only || []);
    const visibleNoActiveNames = visibleButNoActive({ ...metadata, visible_named_only: visibleNames }, ledger);
    shot.visible_named_only = visibleNames;
    if (Array.isArray(metadata.reject_if)) metadata.reject_if = uniqueLines(metadata.reject_if.map(normalizePromptContractText));
    shot.reject_if = uniqueLines((metadata.reject_if || shot.reject_if || []).map(normalizePromptContractText));
    shot.negative_prompt = path.join(shot.package_dir, "negative_prompt.md");
    shot.primary_check = metadata.primary_check || shot.primary_check;
    shot.audio_anchor = metadata.audio_anchor || shot.audio_anchor;
    shot.motion = metadata.motion || shot.motion;
    shot.video_prompt = metadata.video_prompt || shot.video_prompt;
    shot.dialogue_audio = metadata.dialogue_audio || shot.dialogue_audio;
    shot.primary_continuity_check = metadata.primary_continuity_check || shot.primary_continuity_check;
    shot.characters = metadata.characters || shot.characters;
    shot.note = metadata.note || metadata.battle_state_after?.note || shot.note;
    shot.title = shotTitle(shot, metadata);
    shot.titleZh = shotTitle(shot, metadata);
    shot.teacher_lane_contract = metadata.teacher_lane_contract || shot.teacher_lane_contract;
    shot.frames = metadata.frames || shot.frames;
    for (const frameName of ["start_frame", "key_frame", "end_frame"]) {
      if (metadata[frameName]) shot[frameName] = metadata[frameName];
    }
    if (metadata.source_frames) shot.source_frames = metadata.source_frames;
    if (metadata.battle_state_after) {
      metadata.battle_state_after.no_active_combat_after = names;
    }
    const syncedNegativePrompt = syncNegativePromptForLedger(metadata, readText(negativePromptPath));
    metadata.negative_prompt = syncedNegativePrompt;
    writeText(negativePromptPath, `${syncedNegativePrompt}\n`);
    fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
    const before = readText(modelPromptPath);
    const after = syncPromptNegativeSection(
      syncRejectIfSection(
        ensureTeacherContinuityLock(
          syncVisibleButNoActiveLine(syncNoActiveLine(syncVisibleBlocks(normalizePromptContractText(before), visibleNames), names), visibleNoActiveNames),
          shot,
        ),
        shot.reject_if || metadata.reject_if || [],
      ),
      syncedNegativePrompt,
    );
    if (after !== before) {
      writeText(modelPromptPath, after);
      promptsPatched += 1;
    }
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  syncSubmissionEntrypoints(manifest);

  for (const shot of manifest.shots || []) {
    const shotDir = path.join(packageDir, shot.package_dir);
    const files = {
      model_prompt: path.join(shotDir, "model_prompt.md"),
      audit_prompt: path.join(shotDir, "prompt.md"),
      negative_prompt: path.join(shotDir, "negative_prompt.md"),
      start_frame: path.join(shotDir, "start_frame.png"),
      key_frame: path.join(shotDir, "key_frame.png"),
      end_frame: path.join(shotDir, "end_frame.png"),
      metadata: path.join(shotDir, "metadata.json"),
    };
    const metadata = readJson(files.metadata);
    const row = {
      custom_id: `${String(shot.order).padStart(3, "0")}_${shot.shot}`,
      shot: shot.shot,
      id: shot.id,
      order: shot.order,
      duration_seconds: shot.duration_seconds,
      status: shot.status,
      title: shotTitle(shot, metadata),
      titleZh: shotTitle(shot, metadata),
      prompt_text: readText(files.model_prompt).trimEnd(),
      negative_prompt_text: readText(files.negative_prompt).trimEnd(),
      prompt_file: shot.model_prompt,
      audit_prompt_file: shot.audit_prompt,
      negative_prompt_file: path.join(shot.package_dir, "negative_prompt.md"),
      input_frames: {
        start_frame: path.join(shot.package_dir, "start_frame.png"),
        key_frame: path.join(shot.package_dir, "key_frame.png"),
        end_frame: path.join(shot.package_dir, "end_frame.png"),
      },
      absolute_files: Object.fromEntries(Object.entries(files).map(([key, file]) => [key, file])),
      file_digests: Object.fromEntries(Object.entries(files).map(([key, file]) => [key, digest(file)])),
      expected_clip: shot.expected_clip,
      absolute_expected_clip: path.join(root, shot.expected_clip),
      visible_named_only: metadata.visible_named_only || shot.visible_named_only || [],
      primary_check: shot.primary_check,
      reject_if: metadata.reject_if || [],
      continuity_previous: metadata.continuity_previous || null,
      continuity_next: metadata.continuity_next || null,
      battle_state_note: metadata.battle_state_after?.note || metadata.model_notes || "",
      ...payloadLedgerFields(metadata),
    };
    rows.push(row);
  }

  const payload = rows.map((row) => JSON.stringify(row)).join("\n") + "\n";
  writeText(payloadPath, payload);
  const payloadManifest = readJson(payloadManifestPath);
  payloadManifest.rows = rows.length;
  payloadManifest.fields = Object.keys(rows[0] || {});
  payloadManifest.sha256 = crypto.createHash("sha256").update(payload).digest("hex");
  writeText(payloadManifestPath, `${JSON.stringify(payloadManifest, null, 2)}\n`);

  const finalPayloadManifest = readJson(payloadManifestPath);

  console.log(JSON.stringify({
    ok: true,
    decision: "scene09_v3_delivery_payload_current_synced",
    rows: rows.length,
    prompts_patched: promptsPatched,
    payload_sha256: finalPayloadManifest.sha256,
    queue_synced: queueSynced,
  }, null, 2));
}

main();
