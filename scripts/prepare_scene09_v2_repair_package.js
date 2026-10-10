const fs = require("fs");
const path = require("path");

const date = "2026-07-22";
const project = "FireEmblem3H-LiveAction";
const queuePath = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json";
const qaPath = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/qa_manifest.json";
const artifactManifestPath = "production_system/artifact_manifest.json";
const reviewManifestPath = "production_system/review_manifest.json";
const continuityManifestPath = "production_system/continuity_manifest.json";
const videoDeliveryManifestPath = "production_system/video_delivery_manifest.json";
const outDir = "production_system/scene09_v2_repair_package";
const continuityAddendumJson = path.join(outDir, "established_video_continuity_2026-07-23.json");
const continuityAddendumMd = path.join(outDir, "established_video_continuity_2026-07-23.md");
const canonPatchDir = path.join(outDir, "canon_patch_2026-07-23");
const canonPatchManifest = path.join(canonPatchDir, "canon_patch_manifest.json");
const canonPatchPrompts = path.join(canonPatchDir, "canon_patch_prompts.md");

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const qa = JSON.parse(fs.readFileSync(qaPath, "utf8"));
const artifactManifest = JSON.parse(fs.readFileSync(artifactManifestPath, "utf8"));
const reviewManifest = JSON.parse(fs.readFileSync(reviewManifestPath, "utf8"));

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(outDir, "generation_prompts"), { recursive: true });
fs.mkdirSync(path.join(outDir, "motion_test_prompts"), { recursive: true });

const idForShot = (shot) => `EP02-SC09-SHOT-${shot}-V2-20260721`;
const noUnnamedExtrasRule = "No unnamed extras: every readable human figure in frame must be one of the named characters listed for this shot. Do not add background students, generic soldiers, anonymous crowd lines, spectators, bystanders, or filler trainees. If the shot needs to show house scale or starting zones, use physical banners, colored wooden markers, empty lanes, training shields, weapon racks, flags, or terrain composition instead of additional people.";
const roster = [
  "Byleth", "Dimitri", "Dedue", "Felix", "Ashe", "Annette", "Mercedes", "Sylvain", "Ingrid",
  "Edelgard", "Hubert", "Ferdinand", "Dorothea", "Bernadetta",
  "Claude", "Hilda", "Lorenz", "Ignatz", "Leonie",
  "Hanneman", "Manuela",
];
const initialBattleStatuses = Object.fromEntries(roster.map((name) => [name, "active_available"]));
const battleStateEvents = {
  Shot025: {
    notes: ["Rules are established: students exit only if down, disarmed, or judged suppressed; objective is moving both teachers off the healing sigil."],
  },
  Shot027C: {
    statuses: { Ferdinand: "active_yielded_half_step" },
    notes: ["Ferdinand yields half a step but is not defeated and must not be shown collapsed."],
  },
  Shot027D: {
    statuses: { Felix: "active_delayed_by_command", Ferdinand: "active_covering_route" },
    notes: ["Felix is delayed, not removed; Ferdinand remains active."],
  },
  Shot028: {
    statuses: { Annette: "active_in_cover", Mercedes: "active_in_cover" },
    notes: ["Annette and Mercedes are forced lower behind cover, not defeated."],
  },
  Shot029D: {
    statuses: { Ashe: "active_displaced_from_overwatch", Leonie: "hidden_active_flanking_black_eagles_backline" },
    notes: [
      "Ashe leaves the half-height point after Claude's nonlethal arrow suppression; he may reappear only as repositioning until restored.",
      "Established-video continuity: Leonie is already active offscreen as Claude's flanking partner against the Black Eagles backline.",
    ],
  },
  Shot030B: {
    statuses: { Felix: "active_contained_at_contact_line" },
    notes: ["Felix is stopped before overextension; he is still active but cannot be shown past the contact line."],
  },
  Shot031: {
    statuses: { Felix: "active_contained_by_byleth", Dorothea: "active_backline_pressured", Bernadetta: "active_backline_pressured", Leonie: "hidden_active_flanking_black_eagles_backline" },
    notes: [
      "Byleth stops Felix; no defeat blow occurs.",
      "Golden Deer flank pressure is now canonically aimed at Dorothea and Bernadetta.",
    ],
  },
  Shot032: {
    statuses: { Dedue: "active_shield_restored", Mercedes: "active_support_healing_low" },
    notes: ["Dedue's shield line is restored; Dedue is standing and not defeated."],
  },
  Shot032A: {
    statuses: { Ashe: "active_overwatch_restored", Annette: "active_dust_cover" },
    notes: ["Ashe regains a bow angle through Annette's dust cover."],
  },
  Shot032E: {
    statuses: {
      Hubert: "captured_by_felix_and_ashe",
      Dorothea: "captured_by_leonie_and_claude",
      Bernadetta: "captured_by_leonie_and_claude",
      Leonie: "active_captor_with_claude",
    },
    notes: [
      "Established-video continuity locks here: after the two sides clash, Hubert is repelled and captured by Felix and Ashe; Dorothea and Bernadetta are captured by flanking Leonie and Claude.",
      "This capture beat is underrepresented in the current 40-shot V2 assets and requires insert/replacement frames before video approval.",
    ],
  },
  Shot033C: {
    statuses: { Hanneman: "active_spell_angle_suppressed" },
    notes: ["Hanneman's spell angle is suppressed by Ashe; he is not injured."],
  },
  Shot033D: {
    statuses: { Manuela: "active_route_blocked_by_ingrid" },
    notes: ["Manuela is halted by route control, unhurt and dignified."],
  },
  Shot034C: {
    statuses: { Ferdinand: "active_route_blocked_by_felix" },
    notes: ["Ferdinand cannot return to the teacher platform but remains upright and competent."],
  },
  Shot034D: {
    statuses: { Hanneman: "objective_neutralized_spell_broken" },
    notes: ["Hanneman's casting wrist/forearm is tapped with a sheathed sword; spell breaks, no injury."],
  },
  Shot034B: {
    statuses: {
      Hanneman: "objective_defeated_off_sigil",
      Manuela: "objective_defeated_off_sigil",
    },
    notes: ["Objective win is achieved: both teachers step off the healing sigil. The already-captured students remain removed by mock-battle rule."],
  },
  Shot034E: {
    statuses: {
      Claude: "stood_down",
      Hilda: "stood_down",
      Lorenz: "stood_down",
      Ignatz: "stood_down",
      Leonie: "stood_down",
    },
    notes: ["Golden Deer concede/stand down; they must not re-enter active combat afterward."],
  },
  Shot034F: {
    statuses: {
      Edelgard: "stood_down",
      Ferdinand: "stood_down",
    },
    notes: ["Black Eagles stand down; Hubert, Dorothea, and Bernadetta are already captured by the established-video continuity and must not be reset to normal active/stand-down combatants."],
  },
  Shot034G: {
    statuses: {
      Dimitri: "stood_down",
      Dedue: "stood_down",
      Felix: "stood_down",
      Ashe: "stood_down",
      Annette: "stood_down",
      Mercedes: "stood_down",
      Sylvain: "stood_down",
      Ingrid: "stood_down",
    },
    notes: ["Blue Lions lower weapons and stop chasing; combat is over."],
  },
  Shot034: {
    statuses: {
      Byleth: "postbattle_available",
      Dimitri: "stood_down",
      Dedue: "stood_down",
      Felix: "stood_down",
      Ashe: "stood_down",
      Annette: "stood_down",
      Mercedes: "stood_down",
      Sylvain: "stood_down",
      Ingrid: "stood_down",
      Edelgard: "stood_down",
      Hubert: "captured_by_felix_and_ashe",
      Ferdinand: "stood_down",
      Dorothea: "captured_by_leonie_and_claude",
      Bernadetta: "captured_by_leonie_and_claude",
      Claude: "stood_down",
      Hilda: "stood_down",
      Lorenz: "stood_down",
      Ignatz: "stood_down",
      Leonie: "stood_down",
      Hanneman: "objective_defeated_off_sigil",
      Manuela: "objective_defeated_off_sigil",
    },
    notes: ["Full-field resolution: weapons lowered; no one resumes active combat."],
  },
  Shot035: {
    statuses: { Byleth: "postbattle_focus", Felix: "postbattle_focus" },
    notes: ["Only Felix and Byleth may remain active as dialogue focus; everyone else stays stood down/offscreen."],
  },
  Shot036: {
    statuses: { Byleth: "postbattle_focus", Dimitri: "postbattle_focus", Felix: "stood_down" },
    notes: ["Only Dimitri and Byleth may remain active as dialogue focus; everyone else stays stood down/offscreen."],
  },
};
const isGenerated = (shot) => {
  if (qa.shots[shot] && qa.shots[shot].status === "generated_reviewed") return true;
  return candidateFiles(shot, "start").length > 0 && candidateFiles(shot, "key").length > 0;
};
const shotByName = new Map(queue.map((item) => [item.shot, item]));
const battleStateByShot = buildBattleStateByShot(queue);

function existing(filePath) {
  return filePath && fs.existsSync(filePath);
}

function candidateFiles(shot, frameKind) {
  const dir = path.dirname(queuePath);
  const suffix = frameKind === "start" ? "_start.png" : "_key.png";
  const pattern = new RegExp(`^[0-9]{2}_${shot}${suffix.replace(".", "\\.")}$`);
  return fs.readdirSync(dir)
    .filter((name) => pattern.test(name))
    .map((name) => path.join(dir, name))
    .sort();
}

function selectedFramePath(item, frameKind) {
  const qaShot = qa.shots[item.shot] || {};
  const fromQa = qaShot.frames && qaShot.frames[frameKind];
  if (existing(fromQa)) return fromQa;
  const fromQueue = item.frames && item.frames[frameKind] && item.frames[frameKind].path;
  if (existing(fromQueue)) return fromQueue;
  const candidates = candidateFiles(item.shot, frameKind);
  return candidates[0] || fromQueue;
}

function isInactiveStatus(status) {
  return status === "stood_down" || status === "objective_defeated_off_sigil" || /^captured/.test(status);
}

function buildBattleStateByShot(items) {
  const statuses = { ...initialBattleStatuses };
  return Object.fromEntries(items.map((item) => {
    const event = battleStateEvents[item.shot] || {};
    if (event.statuses) Object.assign(statuses, event.statuses);
    const activeOrAvailable = roster.filter((name) => !isInactiveStatus(statuses[name]));
    const stoodDown = roster.filter((name) => statuses[name] === "stood_down");
    const objectiveDefeated = roster.filter((name) => statuses[name] === "objective_defeated_off_sigil");
    const defeatedByRule = roster.filter((name) => /^defeated/.test(statuses[name]) || /^captured/.test(statuses[name]));
    const constrained = roster
      .filter((name) => !["active_available", "stood_down", "objective_defeated_off_sigil"].includes(statuses[name]))
      .map((name) => ({ name, status: statuses[name] }));
    const mustNotReappearActive = [...stoodDown, ...objectiveDefeated, ...defeatedByRule];
    return [item.shot, {
      shot: item.shot,
      visible_named_only: item.characters.map((character) => character.name),
      active_or_available_after: activeOrAvailable,
      constrained_after: constrained,
      defeated_by_rule_after: defeatedByRule,
      objective_defeated_after: objectiveDefeated,
      stood_down_after: stoodDown,
      must_not_reappear_active_after: mustNotReappearActive,
      notes: event.notes || [],
      statuses_after: Object.fromEntries(roster.map((name) => [name, statuses[name]])),
    }];
  }));
}

function formatStateList(items) {
  return items.length ? items.join(", ") : "none";
}

function stateLockText(shot) {
  const state = battleStateByShot[shot];
  if (!state) return "";
  const constrained = state.constrained_after.length
    ? state.constrained_after.map((entry) => `${entry.name}=${entry.status}`).join(", ")
    : "none";
  return [
    "Battle state lock after this shot:",
    `- Visible named characters allowed in this shot: ${formatStateList(state.visible_named_only)}.`,
    `- Active or available after the shot: ${formatStateList(state.active_or_available_after)}.`,
    `- Constrained but not defeated after the shot: ${constrained}.`,
    `- Defeated/removed by mock-battle rule after the shot: ${formatStateList(state.defeated_by_rule_after)}.`,
    `- Objective-defeated teachers after the shot: ${formatStateList(state.objective_defeated_after)}.`,
    `- Stood down after the shot: ${formatStateList(state.stood_down_after)}.`,
    `- Must not reappear as active combatants after this shot: ${formatStateList(state.must_not_reappear_active_after)}.`,
    ...state.notes.map((note) => `- State note: ${note}`),
  ].join("\n");
}

function writePromptFiles(item, selected) {
  const genPromptPath = path.join(outDir, "generation_prompts", `${item.shot}_start_key_prompt.md`);
  const motionPromptPath = path.join(outDir, "motion_test_prompts", `${item.shot}_motion_test_prompt.md`);
  const generationPrompt = [
    `# ${item.shot} Frame Generation Prompt`,
    "",
    `Status: ${isGenerated(item.shot) ? "already_generated_monitor_required" : "blocked_needs_generation"}`,
    "",
    "## Start Frame",
    "",
    `Output: \`${item.frames.start.path}\``,
    "",
    "```text",
    item.frames.start.prompt,
    noUnnamedExtrasRule,
    stateLockText(item.shot),
    "```",
    "",
    "## Key Frame",
    "",
    `Output: \`${item.frames.key.path}\``,
    "",
    "```text",
    item.frames.key.prompt,
    noUnnamedExtrasRule,
    stateLockText(item.shot),
    "```",
    "",
    "## Reject If",
    "",
    ...item.reject_if.map((line) => `- ${line}`),
    "",
  ].join("\n");

  const motionPrompt = [
    `# ${item.shot} Low-Cost Motion Test Prompt`,
    "",
    `Status: ${isGenerated(item.shot) ? "motion_test_candidate" : "blocked_until_frames_exist"}`,
    "",
    `Start frame: \`${selected.start || item.frames.start.path}\``,
    `Key frame: \`${selected.key || item.frames.key.path}\``,
    "End frame: `PENDING_END_FRAME_LOCK`",
    "",
    "## Motion",
    "",
    item.video_prompt,
    "",
    "Animate only the approved start-to-key tactical change. Preserve the same battlefield zone, house positions, academy-age identities, costumes, and weapon locks. Do not add foreground extras.",
    noUnnamedExtrasRule,
    stateLockText(item.shot),
    "",
    "## Reject If",
    "",
    ...item.reject_if.map((line) => `- ${line}`),
    "- Reject if any unnamed or non-scripted readable student/soldier/spectator appears.",
    "- Reject if any defeated, objective-defeated, or stood-down character reappears as an active combatant after their state lock.",
    "- Reject if motion invents a different tactical beat than the V2 shot list.",
    "- Reject if the end state cannot cut into the next shot without a new interpretation.",
    "",
  ].join("\n");

  fs.writeFileSync(genPromptPath, `${generationPrompt}\n`);
  fs.writeFileSync(motionPromptPath, `${motionPrompt}\n`);
  return { genPromptPath, motionPromptPath };
}

const rows = queue.map((item, index) => {
  const generated = isGenerated(item.shot);
  const selected = {
    start: selectedFramePath(item, "start"),
    key: selectedFramePath(item, "key"),
  };
  const expected = {
    start: item.frames.start.path,
    key: item.frames.key.path,
  };
  const duplicates = [
    ...candidateFiles(item.shot, "start").filter((file) => file !== selected.start),
    ...candidateFiles(item.shot, "key").filter((file) => file !== selected.key),
  ];
  const promptFiles = writePromptFiles(item, selected);

  if (generated) {
    qa.shots[item.shot] = {
      ...(qa.shots[item.shot] || {}),
      status: qa.shots[item.shot] && qa.shots[item.shot].status === "generated_reviewed"
        ? "generated_reviewed"
        : "generated_monitor_required",
      start_exists: existing(selected.start),
      key_exists: existing(selected.key),
      decision: qa.shots[item.shot] && qa.shots[item.shot].status === "generated_reviewed"
        ? qa.shots[item.shot].decision
        : "monitor_required",
      frames: selected,
      selected_paths_source: "repair_package_normalized_from_queue_or_existing_file",
    };
    if (duplicates.length) qa.shots[item.shot].duplicate_candidate_paths = duplicates;
  }

  return {
    order: index + 1,
    id: idForShot(item.shot),
    shot: item.shot,
    generated,
    status: generated ? "monitor_required" : "integrity_blocked",
    decision: generated ? "monitor_required" : "blocked_needs_revision",
    priority_batch: item.priority_batch,
    purpose: item.purpose,
    selected,
    expected,
    duplicates,
    promptFiles,
    battleState: battleStateByShot[item.shot],
    source: item,
  };
});

const rowByShot = new Map(rows.map((row) => [row.shot, row]));
const missingRows = rows.filter((row) => !row.generated);
const motionRows = rows.filter((row) => row.generated);
const duplicateRows = rows.filter((row) => row.duplicates.length);

const existingArtifacts = (artifactManifest.artifacts || [])
  .filter((artifact) => !/^EP02-SC09-SHOT-Shot\d+[A-Z]?-V2-20260721$/.test(artifact.id));

const shotArtifacts = rows.map((row, index) => ({
  id: row.id,
  type: "storyboard_frame",
  stage: "storyboard",
  status: row.status,
  created_by: "storyboard-agent",
  created_at: "2026-07-21",
  paths: [row.selected.start || row.expected.start, row.selected.key || row.expected.key],
  source_refs: [
    "episodes/EP02/scene09_shooting_script_v2_2026-07-21.md",
    "episodes/EP02/scene09_shot_list_v2_2026-07-21.md",
    queuePath,
    qaPath,
  ],
  depends_on: ["EP02-SC09-SCRIPT-V2-20260721", "EP02-SC09-SHOTLIST-V2-20260721"],
  continuity: {
    previous: index > 0 ? rows[index - 1].id : null,
    next: index < rows.length - 1 ? rows[index + 1].id : null,
    in: row.source.frames.start.intent,
    out: row.source.frames.key.intent,
    battle_state_after: row.battleState,
  },
  risk_flags: row.generated
    ? ["monitor_required", "identity_drift", "weapon_drift", "motion_risk", "missing_end_frame_lock"]
    : ["missing_required_frames", "identity_drift", "weapon_drift", "screen_direction", "missing_end_frame_lock"],
  notes: row.generated
    ? `${row.shot} has reviewed start/key frames but remains monitor_required pending motion and strict continuity.`
    : `${row.shot} has V2 prompt coverage but no generated/reviewed start-key pair in the partial rebuild.`,
}));

artifactManifest.artifacts = [...existingArtifacts, ...shotArtifacts];
fs.writeFileSync(artifactManifestPath, `${JSON.stringify(artifactManifest, null, 2)}\n`);

const existingReviews = (reviewManifest.reviews || [])
  .filter((review) => !/^review-2026-07-22-ep02-sc09-shot-/.test(review.review_id));

const shotReviews = rows.map((row) => ({
  artifact_id: row.id,
  review_id: `review-2026-07-22-ep02-sc09-shot-${row.shot.toLowerCase()}-repair-qa`,
  reviewer_role: "storyboard-qa-agent",
  reviewer: "codex-cinematic-pipeline",
  created_at: date,
  decision: row.generated ? "monitor_required" : "blocked_needs_revision",
  blocking_issues: row.generated ? [] : [
    `${row.shot} has no generated/reviewed V2 start-key pair in the partial rebuild.`,
  ],
  required_revisions: row.generated ? [
    "Run low-cost motion test before any paid full-resolution video generation.",
    "Add explicit end-frame/edit-out lock and strict continuity review before promotion.",
    "Reject or regenerate any frame that contains unnamed readable students, spectators, or generic soldiers.",
    "Reject or regenerate any continuation where defeated, objective-defeated, or stood-down characters re-enter active combat.",
  ] : [
    "Generate start and key frames from the V2 repair generation prompt.",
    "Run independent storyboard and canon QA before using this shot in video.",
    "Keep every readable human figure limited to the shot's named character list; represent scale with banners, markers, empty lanes, and terrain instead of extras.",
    "Apply the shot's battle-state lock so removed, objective-defeated, or stood-down characters do not re-enter active combat.",
  ],
  rubric: row.generated ? {
    shot_purpose: "conditional",
    action_peak: "conditional",
    start_key_end_chain: "conditional",
    identity_locks: "conditional",
    screen_direction: "conditional",
    motion_risk: "monitor_required",
  } : {
    shot_purpose: "not_reviewed",
    action_peak: "fail",
    start_key_end_chain: "fail",
    identity_locks: "not_reviewed",
    screen_direction: "not_reviewed",
    motion_risk: "fail",
  },
  reviewed_paths: row.generated
    ? [row.selected.start, row.selected.key, qaPath].filter(Boolean)
    : [row.promptFiles.genPromptPath, queuePath, qaPath],
}));

reviewManifest.reviews = [...existingReviews, ...shotReviews];
fs.writeFileSync(reviewManifestPath, `${JSON.stringify(reviewManifest, null, 2)}\n`);

const continuityPairs = rows.slice(0, -1).map((row, index) => {
  const next = rows[index + 1];
  const bothGenerated = row.generated && next.generated;
  return {
    id: `${row.id}->${next.id}`,
    type: "continuity_pair",
    from: row.id,
    to: next.id,
    status: bothGenerated ? "candidate_generated" : "integrity_blocked",
    reviewer_role: "continuity-reviewer-agent",
    reviewer: "codex-cinematic-pipeline",
    decision: bothGenerated ? "monitor_required" : "blocked_needs_revision",
    checks: bothGenerated ? {
      screen_direction: "conditional",
      eyeline: "conditional",
      position: "conditional",
      action_match: "conditional",
      emotional_state: "conditional",
      lighting_time: "pass",
      audio_bridge: "conditional",
      identity_continuity: "conditional",
    } : {
      screen_direction: "fail",
      eyeline: "fail",
      position: "fail",
      action_match: "fail",
      emotional_state: "conditional",
      lighting_time: "conditional",
      audio_bridge: "conditional",
      identity_continuity: "fail",
    },
    blocking_issues: bothGenerated ? [] : [
      "At least one side of this adjacent pair has no generated/reviewed V2 start-key frames.",
    ],
    required_revisions: bothGenerated ? [
      "Review the actual selected start/key/end frame handoff after end-frame locks exist.",
      "Upgrade only after all checks pass in strict continuity review.",
    ] : [
      "Generate and review both adjacent V2 shots before continuity approval.",
    ],
  };
});

fs.writeFileSync(continuityManifestPath, `${JSON.stringify({ version: 1, pairs: continuityPairs }, null, 2)}\n`);

const deliveryShots = rows.map((row) => ({
  id: row.id,
  order: row.order,
  status: row.status,
  duration_seconds: 8,
  prompt_path: row.promptFiles.motionPromptPath,
  start_frame: row.selected.start || row.expected.start,
  key_frame: row.selected.key || row.expected.key,
  end_frame: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/${String(row.order).padStart(2, "0")}_${row.shot}_end_PENDING.png`,
  expected_clip: `episodes/EP02/video_outputs/scene09_v2_rebuild/${String(row.order).padStart(2, "0")}_${row.shot}.mp4`,
  edit_in: "pending final edit-in after end-frame lock",
  edit_out: "pending final edit-out after end-frame lock",
  audio_anchor: row.source.dialogue_audio,
  battle_state_after: row.battleState,
  continuity_previous: row.order > 1 ? rows[row.order - 2].id : "",
  continuity_next: row.order < rows.length ? rows[row.order].id : "",
  model_notes: [
    "Repair manifest only; do not submit as final video package.",
    "Preserve V2 character identity, weapon, screen direction, and nonlethal training tone.",
  ],
  reject_if: row.source.reject_if,
}));

fs.writeFileSync(videoDeliveryManifestPath, `${JSON.stringify({
  version: 1,
  project,
  package_id: "scene09_v2_repair_not_delivery_2026-07-22",
  shots: deliveryShots,
}, null, 2)}\n`);

const repairPackage = {
  version: 1,
  project,
  date,
  status: "blocked_needs_revision",
  source_queue: queuePath,
  source_qa_manifest: qaPath,
  established_video_continuity: {
    json: continuityAddendumJson,
    markdown: continuityAddendumMd,
    status: "canonical_blocker_for_current_v2_until_revised",
  },
  canon_patch_assets: {
    manifest: canonPatchManifest,
    prompts: canonPatchPrompts,
    status: "monitor_required_not_integrated_into_40_shot_queue",
  },
  total_required_shots: rows.length,
  generated_monitor_required: motionRows.map((row) => row.shot),
  blocked_needs_generation: missingRows.map((row) => row.shot),
  battle_state_manifest: path.join(outDir, "battle_state_after_each_shot.json"),
  duplicate_candidate_groups: duplicateRows.map((row) => ({
    shot: row.shot,
    selected: row.selected,
    duplicates: row.duplicates,
  })),
  continuity_pairs_created: continuityPairs.length,
  delivery_manifest_status: "repair_manifest_only_not_approved_for_video",
};

fs.writeFileSync(path.join(outDir, "scene09_v2_repair_package.json"), `${JSON.stringify(repairPackage, null, 2)}\n`);
fs.writeFileSync(qaPath, `${JSON.stringify(qa, null, 2)}\n`);

const battleStateManifest = {
  version: 1,
  project,
  date,
  scene: "EP02 Scene09",
  rule: "Mock battle removals are stateful. A character who is captured, defeated by rule, objective-defeated, or stood down must not reappear as an active combatant in later shots. Characters who are suppressed, displaced, blocked, contained, or restored remain alive/available only under the listed constraint.",
  roster,
  shots: rows.map((row) => ({
    order: row.order,
    shot: row.shot,
    purpose: row.purpose,
    ...row.battleState,
  })),
};

fs.writeFileSync(path.join(outDir, "battle_state_after_each_shot.json"), `${JSON.stringify(battleStateManifest, null, 2)}\n`);

const battleStateMd = [
  "# EP02 Scene09 Battle State After Each Shot",
  "",
  `Date: ${date}`,
  "",
  "Mock battle rule: no student is dead, but captured/removed states are binding. The established-video continuity says Hubert is captured by Felix and Ashe, while Dorothea and Bernadetta are captured by Leonie and Claude. The objective win still resolves when Hanneman and Manuela leave the healing sigil. Suppressed/displaced/blocked characters are not eliminated unless listed as captured, defeated, objective-defeated, or stood down.",
  "",
  "| Shot | Visible Named Only | Active/Available After | Constrained But Not Defeated | Defeated By Rule | Objective-Defeated | Stood Down | Must Not Reappear Active After | Notes |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...rows.map((row) => {
    const state = row.battleState;
    const constrained = state.constrained_after.length
      ? state.constrained_after.map((entry) => `${entry.name}=${entry.status}`).join("<br>")
      : "none";
    return [
      row.shot,
      formatStateList(state.visible_named_only),
      formatStateList(state.active_or_available_after),
      constrained,
      formatStateList(state.defeated_by_rule_after),
      formatStateList(state.objective_defeated_after),
      formatStateList(state.stood_down_after),
      formatStateList(state.must_not_reappear_active_after),
      state.notes.length ? state.notes.join("<br>") : "",
    ].map((cell) => String(cell).replace(/\|/g, "/")).join(" | ");
  }).map((line) => `| ${line} |`),
  "",
  "## Practical Prompt Rule",
  "",
  "- Do not show anyone outside the shot's named list as a readable person.",
  "- Do not let captured, stood-down, objective-defeated, or defeated-by-rule characters resume combat in later frames or video clips.",
  "- Suppressed, displaced, blocked, or contained characters may reappear only in the constrained state until a later shot explicitly restores or releases them.",
  "",
].join("\n");

fs.writeFileSync(path.join(outDir, "battle_state_after_each_shot.md"), `${battleStateMd}\n`);

const md = [
  "# EP02 Scene09 V2 Repair Package",
  "",
  `Date: ${date}`,
  "",
  "Status: `blocked_needs_revision`",
  "",
  "This package makes the next production step explicit. It does not approve frames for video.",
  "",
  `Total V2 shots: ${rows.length}`,
  `Generated but monitor-only: ${motionRows.length}`,
  `Blocked until generation: ${missingRows.length}`,
  `Continuity pairs created: ${continuityPairs.length}`,
  "",
  "## Established Video Continuity",
  "",
  `- Canon addendum JSON: ${continuityAddendumJson}`,
  `- Canon addendum notes: ${continuityAddendumMd}`,
  "- Current V2 status under this canon: `blocked_needs_revision` because Hubert, Dorothea, and Bernadetta capture beats are not fully staged in the 40-shot asset sequence.",
  "",
  "## Canon Patch Assets",
  "",
  `- Patch manifest: ${canonPatchManifest}`,
  `- Patch prompts: ${canonPatchPrompts}`,
  "- Patch status: `monitor_required`; generated as additive insert/replacement candidates, not yet promoted into the 40-shot queue.",
  "",
  "## Battle State Lock",
  "",
  `- JSON: ${path.join(outDir, "battle_state_after_each_shot.json")}`,
  `- Review table: ${path.join(outDir, "battle_state_after_each_shot.md")}`,
  "",
  "## Generate Next",
  "",
  ...missingRows.map((row) => `- ${row.shot} (${row.priority_batch}): ${row.purpose} -> ${row.promptFiles.genPromptPath}`),
  "",
  "## Motion Test Candidates",
  "",
  ...motionRows.map((row) => `- ${row.shot}: ${row.promptFiles.motionPromptPath}`),
  "",
  "## Duplicate Candidates To Reconcile",
  "",
  ...(duplicateRows.length ? duplicateRows.flatMap((row) => [
    `- ${row.shot}`,
    `  Selected start: \`${row.selected.start}\``,
    `  Selected key: \`${row.selected.key}\``,
    `  Other candidates: ${row.duplicates.map((file) => `\`${file}\``).join(", ")}`,
  ]) : ["- none"]),
  "",
  "## Gate Intent",
  "",
  "- Storyboard gate should remain blocked until all 40 shots have passing independent reviews and the established capture continuity is visibly represented.",
  "- Strict continuity should remain blocked until all 39 adjacent pairs pass.",
  "- Video delivery manifest is a repair scaffold, not an executable delivery package.",
  "",
].join("\n");

fs.writeFileSync(path.join(outDir, "README.md"), `${md}\n`);

const usableIndex = [
  "# EP02 Scene09 Usable Assets And Prompts",
  "",
  `Date: ${date}`,
  "",
  "Plain-language status: this file lists what can be used right now and what still needs generation. No item here is approved for final video yet.",
  "",
  "Established continuity blocker: current V2 assets are motion-test references only until the Hubert capture and Dorothea/Bernadetta capture beats are added or visibly restaged.",
  "",
  "## Usable Existing Assets",
  "",
  `These ${motionRows.length} shot pairs have existing V2 start/key images. They are usable as low-cost motion-test inputs only, not final video-approved assets.`,
  "",
  "| Shot | Start Frame | Key Frame | Motion Test Prompt | Status |",
  "| --- | --- | --- | --- | --- |",
  ...motionRows.map((row) => `| ${row.shot} | \`${row.selected.start}\` | \`${row.selected.key}\` | \`${row.promptFiles.motionPromptPath}\` | \`${row.status}\` |`),
  "",
  "## Missing Assets To Generate",
  "",
  `These ${missingRows.length} shots do not yet have reviewed V2 start/key images. Use the generation prompt file to create the start/key pair, then review before motion.`,
  "",
  "| Shot | Generation Prompt | Expected Start | Expected Key | Status |",
  "| --- | --- | --- | --- | --- |",
  ...missingRows.map((row) => `| ${row.shot} | \`${row.promptFiles.genPromptPath}\` | \`${row.expected.start}\` | \`${row.expected.key}\` | \`${row.status}\` |`),
  "",
  "## Duplicate Candidate Warning",
  "",
  "These shot names have older duplicate candidate files in the same folder. Downstream work should use the selected paths shown above.",
  "",
  ...(duplicateRows.length ? duplicateRows.flatMap((row) => [
    `### ${row.shot}`,
    "",
    `Selected start: \`${row.selected.start}\``,
    "",
    `Selected key: \`${row.selected.key}\``,
    "",
    "Do not use:",
    "",
    ...row.duplicates.map((file) => `- \`${file}\``),
    "",
  ]) : ["No duplicate candidates found.", ""]),
].join("\n");

fs.writeFileSync(path.join(outDir, "usable_assets_and_prompts.md"), `${usableIndex}\n`);

console.log(JSON.stringify({
  total: rows.length,
  generated_monitor_required: motionRows.length,
  blocked_needs_generation: missingRows.length,
  duplicate_groups: duplicateRows.length,
  continuity_pairs: continuityPairs.length,
  outDir,
}, null, 2));
