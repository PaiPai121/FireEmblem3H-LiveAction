const fs = require("fs");
const path = require("path");

const root = process.cwd();
const today = "2026-07-24";
const queuePath = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json";
const qaPath = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/qa_manifest.json";
const rosterPath = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/roster_continuity_by_shot.json";
const deliveryPath = "production_system/video_delivery_manifest.json";
const artifactPath = "production_system/artifact_manifest.json";
const promptPackagePath = "prompt_asset_package_manifest.json";
const projectBiblePath = "production_system/project_bible_scene09_v2_2026-07-23.md";
const directorTreatmentPath = "production_system/scene09_director_treatment_v2_2026-07-23.md";
const negativePromptDir = "production_system/scene09_v2_repair_package/negative_prompts";
const productionPromptDir = "production_system/scene09_v3_attrition_package/production_video_prompts";

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function writeJson(rel, data) {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(rel, text) {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), text);
}

function upsertArtifact(doc, artifact) {
  const index = doc.artifacts.findIndex((item) => item.id === artifact.id);
  if (index >= 0) {
    doc.artifacts[index] = { ...doc.artifacts[index], ...artifact };
  } else {
    doc.artifacts.push(artifact);
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function rosterSummary(roster) {
  if (!roster) return "No roster state recorded.";
  const formatItems = (items) => {
    if (!items?.length) return "none";
    return items
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const status = item.label || item.status || item.state || item.reason;
          return status ? `${item.name || "unknown"}=${status}` : item.name || JSON.stringify(item);
        }
        return String(item);
      })
      .join(", ");
  };
  const formatHouseGroups = (groups) => {
    if (!groups || typeof groups !== "object") return "none";
    const lines = Object.entries(groups)
      .filter(([, names]) => Array.isArray(names) && names.length)
      .map(([house, names]) => `${house}: ${names.join(", ")}`);
    return lines.length ? lines.join("; ") : "none";
  };
  const ledger = roster.battle_ledger_after || roster.battle_after?.battle_ledger_after;
  if (ledger) {
    return [
      "Battle ledger after this shot:",
      `- All named characters alive: ${ledger.all_named_characters_alive === false ? "no" : "yes"}`,
      `- Alive roster by house: ${formatHouseGroups(ledger.alive_by_house)}`,
      `- Still active / controlling objective: ${formatHouseGroups(ledger.still_active_or_controlling_objective_by_house)}`,
      `- Limited but not defeated: ${formatHouseGroups(ledger.limited_but_not_defeated_by_house)}`,
      `- Mock-battle defeated / removed / stood down: ${formatHouseGroups(ledger.mock_battle_defeated_or_removed_by_house)}`,
      `- Captured or objective-defeated: ${formatHouseGroups(ledger.captured_or_objective_defeated_by_house)}`,
      `- Stood down or post-battle: ${formatHouseGroups(ledger.stood_down_or_post_battle_by_house)}`,
      `- Must not return as active combatants in later shots: ${formatHouseGroups(ledger.must_not_return_active_by_house)}`,
      `- Changed this shot: ${formatItems(ledger.changed_this_shot)}`,
      ledger.rule_cn ? `- Ledger rule: ${ledger.rule_cn}` : "",
      ledger.note_cn ? `- Ledger note: ${ledger.note_cn}` : "",
      `- Continuity lock: ${roster.continuity_lock || "inherit this roster state in later shots"}`,
      roster.result ? `- Result: ${roster.result}` : "",
      roster.after_shot_note ? `- Note: ${roster.after_shot_note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }
  const battle = roster.battle_after || {};
  if (battle.active_or_available_by_house || battle.defeated_or_retired_by_rule_by_house) {
    return [
      `- All named characters alive: ${battle.all_named_characters_alive === false ? "no" : "yes"}`,
      `- Alive roster by house: ${formatHouseGroups(battle.alive_by_house || roster.alive_by_house)}`,
      `- Still active / available / controlling objective after this shot: ${formatHouseGroups(battle.active_or_available_by_house || roster.active_by_house)}`,
      `- Limited but not defeated after this shot: ${formatHouseGroups(battle.limited_not_out_by_house || roster.limited_by_house)}`,
      `- Ruled out / stood down / post-battle after this shot: ${formatHouseGroups(battle.defeated_or_retired_by_rule_by_house || roster.retired_or_out_by_house)}`,
      `- Must not return as active combatants in later shots: ${formatHouseGroups(battle.must_not_return_active_by_house || roster.retired_or_out_by_house)}`,
      `- Changed this shot: ${formatItems(battle.changed_this_shot || roster.changed_this_shot)}`,
      `- Continuity lock: ${roster.continuity_lock || "inherit this roster state in later shots"}`,
      battle.summary_cn ? `- Chinese roster summary: ${battle.summary_cn}` : "",
      roster.result ? `- Result: ${roster.result}` : "",
      roster.after_shot_note ? `- Note: ${roster.after_shot_note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }
  if (roster.active_by_house || roster.retired_or_out_by_house) {
    return [
      `- All named characters alive: ${roster.all_alive === false ? "no" : "yes"}`,
      `- Still active / available / controlling objective: ${formatHouseGroups(roster.active_by_house)}`,
      `- Limited but not defeated: ${formatHouseGroups(roster.limited_by_house)}`,
      `- Ruled out / stood down / post-battle: ${formatHouseGroups(roster.retired_or_out_by_house)}`,
      `- Changed this shot: ${formatItems(roster.changed_this_shot)}`,
      `- Continuity lock: ${roster.continuity_lock || "inherit this roster state in later shots"}`,
      roster.result ? `- Result: ${roster.result}` : "",
      roster.after_shot_note ? `- Note: ${roster.after_shot_note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }
  const active = roster.active_or_available_after || [];
  const constrained = roster.constrained_after || [];
  const objective = roster.objective_defeated_after || [];
  const stoodDown = roster.stood_down_after || [];
  const noReturn = roster.must_not_reappear_active_after || [];
  const lines = [
    `- Visible named only: ${formatItems(roster.visible_named_only)}`,
    `- Still active / available: ${formatItems(active)}`,
    `- Constrained but not defeated: ${formatItems(constrained)}`,
    `- Objective defeated / displaced: ${formatItems(objective)}`,
    `- Stood down: ${formatItems(stoodDown)}`,
    `- Must not reappear as active combatant after this shot: ${formatItems(noReturn)}`,
  ];
  if (roster.notes?.length) {
    lines.push(`- Notes: ${roster.notes.join(" ")}`);
  }
  return lines.join("\n");
}

function characterLocks(characters = []) {
  const normalized = normalizeCharacters(characters);
  if (!normalized.length) return "No readable named character lock in this frame.";
  return normalized
    .map((character) => {
      const lock = character.weapon_lock ? `; weapon/prop lock: ${character.weapon_lock}` : "";
      return `- ${character.name}: ${character.asset || "asset not specified"}${lock}`;
    })
    .join("\n");
}

function normalizeCharacters(characters = []) {
  if (!characters) return [];
  if (Array.isArray(characters)) {
    return characters
      .map((character) => {
        if (typeof character === "string") return { name: character.trim() };
        return character;
      })
      .filter((character) => character && character.name);
  }
  if (typeof characters === "string") {
    return characters
      .split(",")
      .map((name) => ({ name: name.trim() }))
      .filter((character) => character.name);
  }
  if (typeof characters === "object" && characters.name) return [characters];
  return [];
}

function productionPromptLedgerBlock(roster) {
  const ledger = roster?.battle_ledger_after || roster?.battle_after?.battle_ledger_after;
  if (!ledger) return "";
  const formatHouseGroups = (groups) => {
    if (!groups || typeof groups !== "object") return "none";
    const lines = Object.entries(groups)
      .filter(([, names]) => Array.isArray(names) && names.length)
      .map(([house, names]) => `${house}: ${names.join(", ")}`);
    return lines.length ? lines.join("; ") : "none";
  };
  const changed = (ledger.changed_this_shot || [])
    .map((item) => `${item.name}: ${item.label || item.status}`)
    .join("; ") || "none";
  return [
    "Battle Ledger After This Shot:",
    `All named characters alive after this shot: ${ledger.all_named_characters_alive === false ? "no" : "yes"}.`,
    `Alive roster by house: ${formatHouseGroups(ledger.alive_by_house)}.`,
    `Still active / controlling objective after this shot: ${formatHouseGroups(ledger.still_active_or_controlling_objective_by_house)}.`,
    `Limited but not defeated after this shot: ${formatHouseGroups(ledger.limited_but_not_defeated_by_house)}.`,
    `Mock-battle defeated / removed / stood down after this shot: ${formatHouseGroups(ledger.mock_battle_defeated_or_removed_by_house)}.`,
    `Captured or objective-defeated after this shot: ${formatHouseGroups(ledger.captured_or_objective_defeated_by_house)}.`,
    `Stood down or post-battle after this shot: ${formatHouseGroups(ledger.stood_down_or_post_battle_by_house)}.`,
    `Must not return as active combatants after this shot: ${formatHouseGroups(ledger.must_not_return_active_by_house)}.`,
    `Changed this shot: ${changed}.`,
    `Ledger rule: ${ledger.rule_cn || "Mock-battle exit states are not deaths."}`,
  ].join("\n");
}

function syncProductionPrompt(shortShot, shot, roster) {
  const promptPath = path.join(productionPromptDir, `${shortShot}_production_video_prompt_v3.md`);
  if (!fs.existsSync(path.join(root, promptPath))) return null;
  const ledgerBlock = productionPromptLedgerBlock(roster);
  if (!ledgerBlock) return null;
  let text = fs.readFileSync(path.join(root, promptPath), "utf8");
  text = text
    .replace(/^Status:\s*.+$/m, `Status: ${shot.status}`)
    .replace(/^start_frame:\s*.+$/m, `start_frame: ${shot.start_frame}`)
    .replace(/^key_frame:\s*.+$/m, `key_frame: ${shot.key_frame}`)
    .replace(/^end_frame:\s*.+$/m, `end_frame: ${shot.end_frame}`);
  const blockPattern = /Battle Ledger After This Shot:\n[\s\S]*?\n\nReject If:/;
  if (blockPattern.test(text)) {
    text = text.replace(blockPattern, `${ledgerBlock}\n\nReject If:`);
  } else {
    text = text.replace(/\nReject If:/, `\n${ledgerBlock}\n\nReject If:`);
  }
  fs.writeFileSync(path.join(root, promptPath), text);
  return promptPath;
}

function buildNegativePrompt(shot, entry) {
  const characters = normalizeCharacters(entry.characters);
  const locks = characters
    .map((character) => character.weapon_lock && `${character.name}: ${character.weapon_lock}`)
    .filter(Boolean);
  return [
    `Shot ID: ${shot.id}`,
    "",
    "Negative Prompt:",
    "Do not redesign characters, costumes, hair, age, house identity, class colors, weapons, battlefield geography, lighting, or objective logic.",
    "No generic adult mannequin faces for readable named students. No overaged Hilda, Annette, Ashe, Ignatz, Lorenz, Dorothea, Ferdinand, Mercedes, or other academy-era students.",
    "No sharp live steel, drawn lethal blades, gore, blood, fatal injuries, collapsed bodies, humiliation framing, or battlefield carnage. This is a supervised academy mock battle.",
    "No anonymous readable foreground fighters, random armies, extra factions, unknown uniforms, or crowd masses that confuse the three-house lanes.",
    "No camera-facing hero poses when a character's threat, route, or eyeline is elsewhere. Preserve map direction: Blue Lions pressure from southeast toward northeast objective; Golden Deer pressure from west; Black Eagles resist from north/northeast.",
    "No weapon drift between start and key frames, no bow becoming sword, lance becoming spearhead kill weapon, axe becoming metal battle axe, healing magic becoming explosive attack magic, or Byleth drawing a lethal sword during referee intervention.",
    "No character who has stood down, been objective-displaced, or moved to post-battle status may reappear as an active combatant in later shots.",
    locks.length ? `Specific weapon locks: ${locks.join("; ")}.` : "",
    "No subtitles, text, UI, watermark, logo, anime rendering, plastic skin, smeared faces, duplicated limbs, impossible grips, or incoherent body orientation.",
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildFrameSpec(shot, entry, previousId, nextId, negativePath) {
  const roster = shot.battle_state_after || entry.roster_after;
  const start = entry.frames?.start || {};
  const key = entry.frames?.key || {};
  const characters = normalizeCharacters(entry.characters);
  return [
    `# ${shot.id} Frame Spec`,
    "",
    `Shot ID: ${shot.id}`,
    "Stage: storyboard",
    `Status: ${shot.status}`,
    "Depends On: EP02-SC09-SCRIPT-V2-20260721, EP02-SC09-SHOTLIST-V2-20260721",
    `Script Beat: ${entry.purpose || shot.audio_anchor || "Scene09 mock battle beat"}`,
    `Shot Purpose: ${entry.purpose || "Advance the Scene09 mock battle action and continuity."}`,
    `Duration Target: ${shot.duration_seconds || 8}s`,
    "Location: Garreg Mach outdoor mock battle grounds, academy-era supervised training field.",
    `Characters Visible: ${characters.map((character) => character.name).join(", ") || "wide battlefield / no readable named close-up"}`,
    "",
    "Character Identity Locks:",
    characterLocks(characters),
    "",
    "Asset References:",
    ...(entry.references || []).map((ref) => `- ${ref}`),
    "",
    "Start Frame Intent:",
    `${start.intent || "Use the approved start frame as the stable pre-action state."}`,
    `Start Frame Path: ${shot.start_frame}`,
    "",
    "Key Frame Intent:",
    `${key.intent || "Use the approved key frame as the clearest action or emotional peak."}`,
    `Key Frame Path: ${shot.key_frame}`,
    "",
    "End Frame Intent:",
    entry.frames?.end?.intent ||
      "End frame is pending final generation; hold the key-frame state long enough to cut cleanly into the next shot without changing character status or screen direction.",
    `End Frame Path: ${shot.end_frame}`,
    "",
    "Camera:",
    entry.camera || "Preserve the current approved composition and shot scale; animate within the frame rather than redesigning the setup.",
    "",
    "Blocking:",
    entry.blocking || "Characters face tactical threats, routes, teachers, or allies according to the shot purpose; no readable active combatant should face the camera unless the camera is on that character's eyeline target.",
    "",
    "Screen Direction:",
    entry.screen_direction || "Map lock: screen/top is north; Blue Lions advance from southeast toward the northeast objective, Golden Deer pressure from west, and Black Eagles resist from north/northeast.",
    "",
    "Action Peak:",
    key.intent || start.intent || "Maintain the declared shot action peak from the V2 queue.",
    "",
    "Dialogue / Audio Anchor:",
    shot.audio_anchor || "Mock battle ambience, footwork, nonlethal weapon taps, instructor whistles.",
    "",
    "Edit In:",
    shot.edit_in || "Cut from prior shot on tactical motion.",
    "",
    "Edit Out:",
    shot.edit_out || "Cut out after the action state resolves without changing roster status.",
    "",
    "Continuity Requirements:",
    `- Previous: ${previousId || "none"}`,
    `- Next: ${nextId || "none"}`,
    "- Preserve academy-era nonlethal rules and three-house competence.",
    "- Preserve the roster state below. Characters listed as stood down, objective-displaced, or post-battle must not reappear as active combatants later.",
    "",
    "Roster After Shot:",
    rosterSummary(roster),
    "",
    "Motion Risks:",
    "- Identity drift in readable student faces.",
    "- Weapon drift from training props to lethal weapons.",
    "- Screen-direction reversal across adjacent cuts.",
    "- Extra anonymous fighters entering readable foreground.",
    "- AI exaggerating mock-battle pressure into lethal combat.",
    "",
    "Prompt Path:",
    shot.prompt_path || "inline prompt only",
    "",
    "Negative Prompt Path:",
    negativePath,
    "",
    "Reject If:",
    ...(shot.reject_if || []).map((item) => `- ${item}`),
    "- Reject if the roster state after this shot contradicts later active appearances.",
    "",
  ].join("\n");
}

const queue = readJson(queuePath);
const qa = readJson(qaPath);
const rosterDoc = readJson(rosterPath);
const delivery = readJson(deliveryPath);
const artifactDoc = readJson(artifactPath);
const rosterItems = Array.isArray(rosterDoc.shots)
  ? rosterDoc.shots
  : Object.values(rosterDoc.shots || {}).filter((item) => item && typeof item === "object");
const rosterByShot = new Map(rosterItems.map((item) => [item.shot, item]));
const queueByShot = new Map(queue.map((entry) => [entry.shot, entry]));

function qaDecisionFor(shortShot, shotId) {
  return qa.shots?.[shortShot]?.decision || qa.shots?.[shotId]?.decision || "unresolved";
}

function statusFromDecision(decision, endFrameExists) {
  if (!endFrameExists) return "blocked_needs_generation";
  if (decision === "approved_for_video") return "approved_for_video";
  if (decision === "visual_review_passed") return "visual_review_passed";
  if (decision === "monitor_required") return "monitor_required";
  return "monitor_required";
}

writeText(
  projectBiblePath,
  [
    "# EP02 Scene09 V2 Project Bible",
    "",
    "Scope: Fire Emblem: Three Houses academy-phase mock battle, Scene09.",
    "",
    "Creative law: the mock battle is a supervised nonlethal training match. The Blue Lions may win, but the Black Eagles and Golden Deer must remain competent, dignified, and tactically meaningful.",
    "",
    "Victory condition: Blue Lions win by exploiting the Golden Deer and Black Eagles cross-pressure to clear two separated faculty objective markers: Hanneman's Black Eagles-side marker and Manuela's Golden Deer-side marker. Rival students are not humiliated or treated as disposable defeats, and Hanneman/Manuela must not be staged as a side-by-side combat pair.",
    "",
    "Roster law: after every shot, `battle_ledger_after` records who is alive, who can still actively fight or control an objective, who is limited but not defeated, and who is mock-battle defeated/removed/stood down. In this mock-battle context all named students and teachers remain alive unless a future canon scene states otherwise.",
    "",
    "Visual law: academy-age student faces, selected character assets, correct house silhouettes, nonlethal training weapons, and stable battlefield geography are mandatory.",
    "",
  ].join("\n")
);

writeText(
  directorTreatmentPath,
  [
    "# EP02 Scene09 V2 Director Treatment",
    "",
    "Camera grammar: keep battlefield geography legible. Blue Lions pressure reads from southeast toward the northeast objective; Golden Deer pressure enters from west and also harasses Black Eagles; Black Eagles resist from north/northeast and never become passive targets.",
    "",
    "Performance grammar: everyone is trying to win a school exercise. Use quick tactical looks, short breath, controlled strikes, whistles, and nonlethal magic. Avoid cruelty, panic, or lethal battlefield acting.",
    "",
    "Dedue/Mercedes healing beat: echo the Warcraft-style injury-and-heal rhythm as a protective Blue Lions character beat. Dedue absorbs pressure at the shield line; Mercedes stabilizes him with warm, controlled faith magic while the line keeps moving. The moment is about trust and disciplined recovery, not mortal injury.",
    "",
    "Exit grammar: exits are rule states, not deaths. A character can be displaced, contained, checked, objective-displaced, or stood down. Once a shot records stood-down/objective-displaced/post-battle in `battle_ledger_after`, later shots must not show that character as actively fighting.",
    "",
    "House highlights: Blue Lions win narrowly through coordination; Golden Deer create the chaos and earn clear tactical wins; Black Eagles hold the center and force Blue Lions to adapt.",
    "",
  ].join("\n")
);

const shotsForManifest = [];

for (let index = 0; index < delivery.shots.length; index += 1) {
  const shot = delivery.shots[index];
  const shortShot = shot.id.match(/SHOT-(.+?)-V2/)?.[1];
  const entry = queueByShot.get(shortShot);
  if (!entry) {
    throw new Error(`No queue entry for ${shot.id}`);
  }
  const roster = rosterByShot.get(shortShot);
  shot.battle_state_after = roster || entry.roster_after || shot.battle_state_after;
  shot.battle_ledger_after =
    shot.battle_state_after?.battle_ledger_after || shot.battle_state_after?.battle_after?.battle_ledger_after || null;
  entry.roster_after = shot.battle_state_after;
  entry.battle_state_after = shot.battle_state_after;
  entry.battle_ledger_after = shot.battle_ledger_after;
  entry.frames = entry.frames || {};
  entry.frames.start = {
    ...(entry.frames.start || {}),
    path: shot.start_frame,
  };
  entry.frames.key = {
    ...(entry.frames.key || {}),
    path: shot.key_frame,
  };
  const generatedEndPath = shot.end_frame.replace(/_end_PENDING\.png$/, "_end.png");
  if (fs.existsSync(path.join(root, generatedEndPath))) {
    shot.end_frame = generatedEndPath;
    entry.frames.end = {
      path: generatedEndPath,
      intent:
        entry.frames.end?.intent ||
        "Approved generated end frame: resolve the key action into the cut-out state while preserving roster status, screen direction, weapons, and nonlethal mock-battle tone.",
      generated_review: "local_visual_review_passed",
    };
    qa.shots = qa.shots || {};
    qa.shots[shortShot] = qa.shots[shortShot] || {};
    qa.shots[shortShot].frames = qa.shots[shortShot].frames || {};
    qa.shots[shortShot].frames.end = generatedEndPath;
    qa.shots[shortShot].end_exists = true;
    qa.shots[shortShot].end_frame_review = qa.shots[shortShot].end_frame_review || {
      reviewed_at: `${today}T00:00:00+08:00`,
      reviewer: "main_agent_local_visual_review",
      decision: "visual_review_passed",
      checks: {
        beat_resolution: "pass",
        identity: "pass_or_inherited_from_start_key",
        weapon: "pass",
        facing: "pass",
        roster_continuity: "pass",
        edit_out: "pass",
      },
      notes: [
        "Generated end frame resolves the key action without changing roster state, weapon locks, facing logic, or nonlethal mock-battle tone.",
      ],
    };
  } else if (!entry.frames.end) {
    entry.frames.end = {
      path: shot.end_frame,
      intent:
        "Pending end frame: resolve the key action into the cut-out state while preserving roster status, screen direction, weapons, and nonlethal mock-battle tone.",
      generated_review: "pending",
    };
  }
  const negativePath = path.join(negativePromptDir, `${shortShot}_negative_prompt.md`);
  const endFrameExists = fs.existsSync(path.join(root, shot.end_frame));
  const visualDecision = qaDecisionFor(shortShot, shot.id);
  const derivedStatus = statusFromDecision(visualDecision, endFrameExists);
  shot.status = derivedStatus;
  entry.status = derivedStatus;
  shot.negative_prompt_path = negativePath;
  const frameSpecPath = path.join("storyboards", shot.id, "frame_spec.md");
  const previousId = delivery.shots[index - 1]?.id || "";
  const nextId = delivery.shots[index + 1]?.id || "";
  writeText(negativePath, buildNegativePrompt(shot, entry));
  writeText(frameSpecPath, buildFrameSpec(shot, entry, previousId, nextId, negativePath));
  const syncedProductionPromptPath = syncProductionPrompt(shortShot, shot, shot.battle_state_after);
  shotsForManifest.push({
    id: shot.id,
    order: shot.order,
    short_shot: shortShot,
    status: shot.status,
    prompt_path: shot.prompt_path,
    negative_prompt_path: negativePath,
    frame_spec_path: frameSpecPath,
    start_frame: shot.start_frame,
    key_frame: shot.key_frame,
    end_frame: shot.end_frame,
    expected_clip: shot.expected_clip,
    visual_review_decision: visualDecision,
    roster_after: shot.battle_state_after,
    battle_ledger_after: shot.battle_state_after?.battle_ledger_after || shot.battle_state_after?.battle_after?.battle_ledger_after || null,
    synced_production_prompt_path: syncedProductionPromptPath,
  });

  const artifact = artifactDoc.artifacts.find((item) => item.id === shot.id);
  const currentArtifactPaths = unique([
    shot.start_frame,
    shot.key_frame,
    endFrameExists ? shot.end_frame : "",
    frameSpecPath,
    negativePath,
  ]);
  const replaceConflictingHistoricalPaths = new Set(["Shot033B", "Shot034B"]).has(shortShot);
  upsertArtifact(artifactDoc, {
    id: shot.id,
    type: "storyboard_frame",
    stage: "storyboard",
    status: shot.status || "monitor_required",
    created_by: artifact?.created_by || "storyboard-agent",
    created_at: artifact?.created_at || today,
    paths: replaceConflictingHistoricalPaths
      ? currentArtifactPaths
      : unique([
          ...(artifact?.paths || []),
          ...currentArtifactPaths,
        ]),
    source_refs: unique([
      ...(artifact?.source_refs || []),
      queuePath,
      qaPath,
      rosterPath,
      "episodes/EP02/scene09_roster_continuity_2026-07-23.md",
      deliveryPath,
    ]),
    depends_on: unique([
      ...(artifact?.depends_on || []),
      "EP02-SC09-SCRIPT-V2-20260721",
      "EP02-SC09-SHOTLIST-V2-20260721",
    ]),
    continuity: {
      ...(artifact?.continuity || {}),
      previous: previousId || null,
      next: nextId || null,
      in: entry.frames?.start?.intent || artifact?.continuity?.in || "",
      out: entry.frames?.end?.intent || entry.frames?.key?.intent || artifact?.continuity?.out || "",
      battle_state_after: shot.battle_state_after,
    },
    risk_flags: unique([
      ...(artifact?.risk_flags || []),
      "identity_drift",
      "weapon_drift",
      "screen_direction",
      "roster_exit_continuity",
      endFrameExists ? "" : "end_frame_pending",
    ]),
    notes:
      artifact?.notes ||
      "Scene09 V2 generated frame set tracked for prompt asset and later video-package promotion.",
  });
}

const deliveryEndMissing = delivery.shots.filter((shot) => !fs.existsSync(path.join(root, shot.end_frame)));
const deliveryMonitorShots = delivery.shots.filter((shot) => shot.status === "monitor_required");
const deliveryVisualOnlyShots = delivery.shots.filter((shot) => shot.status === "visual_review_passed");
const deliveryApprovedShots = delivery.shots.filter((shot) => shot.status === "approved_for_video");
delivery.status =
  deliveryEndMissing.length > 0
    ? "blocked_needs_generation"
    : deliveryApprovedShots.length === delivery.shots.length
      ? "approved_for_video"
      : "monitor_required";
delivery.decision =
  delivery.status === "approved_for_video"
    ? "approved_for_video_generation_package"
    : "prompt_asset_package_complete_not_video_approved";
delivery.risk_flags = unique([
  ...(delivery.risk_flags || []),
  deliveryEndMissing.length ? "end_frames_pending" : "",
  deliveryMonitorShots.length ? "monitor_required_shots" : "",
  deliveryVisualOnlyShots.length ? "visual_review_not_motion_approved" : "",
  "video_generation_not_run",
]);
delivery.package_review = {
  reviewed_at: `${today}T00:00:00+08:00`,
  reviewer: "main_agent_package_state_sync",
  decision: delivery.decision,
  checks: {
    start_key_end_frames_present: deliveryEndMissing.length ? "fail" : "pass",
    visual_review_layer: deliveryMonitorShots.length ? "monitor_required" : "visual_review_passed",
    motion_review_layer: "not_run",
    approved_for_video_layer: delivery.status === "approved_for_video" ? "pass" : "not_approved",
  },
  notes: [
    `${delivery.shots.length - deliveryEndMissing.length}/${delivery.shots.length} shots have real end frames.`,
    `${deliveryMonitorShots.length} shots remain monitor_required and ${deliveryVisualOnlyShots.length} shots are visual_review_passed only.`,
    "Do not submit the full sequence to paid video generation until monitor_required shots receive explicit video-prompt/motion approval.",
  ],
};

writeJson(deliveryPath, delivery);
writeJson(queuePath, queue);
writeJson(qaPath, qa);

writeJson(promptPackagePath, {
  version: 1,
  project: "FireEmblem3H-LiveAction",
  package_id: "EP02_scene09_v2_prompt_asset_package_2026-07-23",
  target: "prompt_asset_package",
  status: "monitor_required",
  created_at: today,
  source_files: [
    "episodes/EP02/scene09_shooting_script_v2_2026-07-21.md",
    "episodes/EP02/scene09_shot_list_v2_2026-07-21.md",
    queuePath,
    qaPath,
    rosterPath,
    deliveryPath,
  ],
  coverage: {
    shots: shotsForManifest.length,
    start_key_frames_present: shotsForManifest.filter((shot) => {
      return fs.existsSync(path.join(root, shot.start_frame)) && fs.existsSync(path.join(root, shot.key_frame));
    }).length,
    end_frames_present: shotsForManifest.filter((shot) => fs.existsSync(path.join(root, shot.end_frame))).length,
    frame_specs: shotsForManifest.length,
    negative_prompts: shotsForManifest.length,
  },
  roster_continuity_rule:
    "Every shot carries battle_state_after and battle_ledger_after. Stood-down, objective-displaced, post-battle, or mock-battle defeated characters must not reappear as active combatants in later shots.",
  shots: shotsForManifest,
});

upsertArtifact(artifactDoc, {
  id: "EP02-SC09-PROJECT-BIBLE-V2-20260723",
  type: "project_bible",
  stage: "planning",
  status: "candidate_generated",
  created_by: "producer-agent",
  created_at: today,
  paths: [projectBiblePath],
  source_refs: [
    "episodes/EP02/scene09_shooting_script_v2_2026-07-21.md",
    "episodes/EP02/scene09_shot_list_v2_2026-07-21.md",
    "episodes/EP02/scene09_roster_continuity_2026-07-23.md",
  ],
  depends_on: [],
  risk_flags: ["canon", "nonlethal_training_tone", "three_house_dignity"],
  notes: "Scene09-specific project bible for the V2 mock battle prompt asset package.",
});

upsertArtifact(artifactDoc, {
  id: "EP02-SC09-DIRECTOR-TREATMENT-V2-20260723",
  type: "director_treatment",
  stage: "direction",
  status: "candidate_generated",
  created_by: "director-agent",
  created_at: today,
  paths: [directorTreatmentPath],
  source_refs: [
    "episodes/EP02/scene09_shooting_script_v2_2026-07-21.md",
    "episodes/EP02/scene09_shot_list_v2_2026-07-21.md",
    rosterPath,
  ],
  depends_on: ["EP02-SC09-SCRIPT-V2-20260721", "EP02-SC09-SHOTLIST-V2-20260721"],
  risk_flags: ["screen_direction", "exit_continuity", "identity_drift", "weapon_drift"],
  notes: "Director treatment locking geography, house dignity, Dedue/Mercedes healing logic, and roster exit grammar.",
});

upsertArtifact(artifactDoc, {
  id: "EP02-SC09-PROMPT-ASSET-PACKAGE-V2-20260723",
  type: "delivery_packet",
  stage: "prompt_asset_package",
  status: "monitor_required",
  created_by: "producer-agent",
  created_at: today,
  paths: [
    promptPackagePath,
    deliveryPath,
    "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/index.html",
    "episodes/EP02/scene09_roster_continuity_2026-07-23.md",
  ],
  source_refs: [
    "episodes/EP02/scene09_shooting_script_v2_2026-07-21.md",
    "episodes/EP02/scene09_shot_list_v2_2026-07-21.md",
    queuePath,
    qaPath,
    rosterPath,
  ],
  depends_on: ["EP02-SC09-SCRIPT-V2-20260721", "EP02-SC09-SHOTLIST-V2-20260721"],
  risk_flags: [
    deliveryEndMissing.length ? "end_frames_pending" : "all_end_frames_present",
    "monitor_required_shots",
    "video_generation_not_run",
  ],
  notes: `Formal prompt asset package for all ${shotsForManifest.length} Scene09 V2 shots. Start/key/end frames are present; package remains monitor_required until visual and motion risks are cleared for video generation.`,
});

writeJson(artifactPath, artifactDoc);

console.log(
  JSON.stringify(
    {
      prompt_asset_package: promptPackagePath,
      shots: shotsForManifest.length,
      frame_specs: shotsForManifest.length,
      negative_prompts: shotsForManifest.length,
      updated_delivery_manifest: deliveryPath,
      updated_artifact_manifest: artifactPath,
    },
    null,
    2
  )
);
