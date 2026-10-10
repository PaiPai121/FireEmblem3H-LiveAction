const fs = require("fs");
const path = require("path");

throw new Error(
  "Deprecated historical V2 rebuild script. It predates the Scene09 V3 attrition continuity locks and can overwrite the current queue/QA with obsolete teacher-pair and re-entry staging. Use scripts/build_scene09_v3_attrition_prompt_package.js instead."
);

const date = "2026-07-21";
const shotListPath = "episodes/EP02/scene09_shot_list_v2_2026-07-21.md";
const outputDir = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21";

const backgroundAsset = "assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png";

const characterAssets = {
  Byleth: "assets/characters/protagonist/Byleth/professor/selected.png",
  Dimitri: "assets/characters/blue_lions/Dimitri/academy/selected.png",
  Dedue: "assets/characters/blue_lions/Dedue/academy/selected.png",
  Felix: "assets/characters/blue_lions/Felix/academy/selected.png",
  Sylvain: "assets/characters/blue_lions/Sylvain/academy/selected.png",
  Ingrid: "assets/characters/blue_lions/Ingrid/academy/selected.png",
  Ashe: "assets/characters/blue_lions/Ashe/academy/selected.png",
  Annette: "assets/characters/blue_lions/Annette/academy/selected.png",
  Mercedes: "assets/characters/blue_lions/Mercedes/academy/selected.png",
  Edelgard: "assets/characters/black_eagles/Edelgard/academy/selected.png",
  Hubert: "assets/characters/black_eagles/Hubert/academy/selected.png",
  Ferdinand: "assets/characters/black_eagles/Ferdinand/academy/selected.png",
  Dorothea: "assets/characters/black_eagles/Dorothea/academy/selected.png",
  Claude: "assets/characters/golden_deer/Claude/academy/selected.png",
  Hilda: "assets/characters/golden_deer/Hilda/academy/selected.png",
  Lorenz: "assets/characters/golden_deer/Lorenz/academy/selected.png",
  Ignatz: "assets/characters/golden_deer/Ignatz/academy/selected.png",
  Hanneman: "assets/characters/church_of_seiros/Hanneman/academy/selected.png",
  Manuela: "assets/characters/church_of_seiros/Manuela/academy/selected.png",
};

const weaponLocks = {
  Byleth: "training sword or sheathed sword, command gestures",
  Dimitri: "long training lance",
  Dedue: "large shield, defensive body line",
  Felix: "wooden training sword",
  Sylvain: "training lance",
  Ingrid: "training lance",
  Ashe: "training bow",
  Annette: "book and wind/dust magic",
  Mercedes: "empty hands and short white healing light",
  Edelgard: "training axe and command hand signals",
  Hubert: "dark magic",
  Ferdinand: "training lance",
  Dorothea: "controlled support magic",
  Claude: "training bow",
  Hilda: "training axe, youthful academy appearance",
  Lorenz: "training lance",
  Ignatz: "training bow",
  Hanneman: "faculty spell gesture",
  Manuela: "healing sigil / Nosferatu pressure",
};

const shotCharacters = {
  Shot025: ["Manuela", "Hanneman", "Dimitri", "Edelgard", "Claude"],
  Shot025A: [],
  Shot026: ["Byleth", "Dimitri", "Dedue", "Felix", "Ashe", "Annette", "Mercedes", "Sylvain", "Ingrid"],
  Shot026B: ["Byleth", "Dimitri", "Dedue", "Felix", "Ashe", "Annette", "Mercedes", "Sylvain", "Ingrid"],
  Shot026C: ["Dimitri", "Dedue", "Felix", "Ashe", "Annette", "Mercedes", "Sylvain", "Ingrid"],
  Shot027: ["Ashe", "Claude"],
  Shot027B: ["Ferdinand", "Edelgard", "Hubert", "Dorothea"],
  Shot027C: ["Dimitri", "Dedue", "Ferdinand", "Edelgard", "Hubert"],
  Shot027D: ["Felix", "Byleth", "Ferdinand", "Dedue"],
  Shot028: ["Annette", "Mercedes", "Ignatz"],
  Shot028B: ["Edelgard", "Hubert", "Dorothea", "Dimitri", "Dedue"],
  Shot028C: ["Felix", "Byleth", "Ferdinand", "Dedue"],
  Shot029: ["Sylvain", "Ingrid", "Annette", "Mercedes", "Hilda", "Lorenz"],
  Shot029C: ["Claude", "Ashe", "Edelgard"],
  Shot029D: ["Claude", "Ashe"],
  Shot029B: ["Hilda", "Lorenz", "Ignatz", "Sylvain", "Ingrid"],
  Shot030: ["Felix", "Byleth", "Ferdinand"],
  Shot030B: ["Felix", "Byleth"],
  Shot030C: ["Ignatz", "Annette", "Mercedes", "Dorothea"],
  Shot031: ["Byleth", "Felix"],
  Shot031B: ["Byleth", "Dimitri", "Dedue", "Sylvain", "Ingrid", "Annette", "Mercedes"],
  Shot032: ["Dedue", "Mercedes", "Dimitri", "Ferdinand", "Hubert"],
  Shot032A: ["Annette", "Mercedes", "Ashe", "Claude"],
  Shot032B: ["Dimitri", "Dedue", "Hanneman"],
  Shot032C: ["Edelgard", "Hubert", "Dorothea", "Claude", "Hilda"],
  Shot032D: ["Byleth", "Dimitri", "Edelgard", "Claude"],
  Shot032E: ["Byleth", "Dimitri", "Edelgard", "Claude", "Hilda", "Hubert"],
  Shot033: ["Dimitri", "Byleth", "Dedue", "Hanneman"],
  Shot033B: ["Byleth", "Ashe", "Ingrid", "Felix"],
  Shot033C: ["Ashe", "Hanneman"],
  Shot033D: ["Ingrid", "Manuela", "Sylvain"],
  Shot034C: ["Felix", "Ferdinand"],
  Shot034D: ["Byleth", "Hanneman"],
  Shot034B: ["Byleth", "Dimitri", "Hanneman"],
  Shot034E: ["Claude", "Hilda", "Lorenz", "Ignatz", "Leonie"],
  Shot034F: ["Edelgard", "Hubert", "Dorothea", "Ferdinand", "Felix"],
  Shot034G: ["Byleth", "Dimitri", "Dedue"],
  Shot034: ["Dimitri", "Edelgard", "Claude"],
  Shot035: ["Felix", "Byleth"],
  Shot036: ["Dimitri", "Byleth"],
};

const screenDirection =
  "Map lock: screen/top is north, lower-right is the Blue Lions southeast start, left is the Golden Deer west thicket, upper-right is the split faculty objective: Hanneman on the Black Eagles-side marker and Manuela several paces away on the Golden Deer-side marker, never staged as a side-by-side combat pair. Active combat characters face threats or routes, not the camera.";

const styleLock = [
  "16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth/armor texture, no anime rendering, no text or watermark.",
  "Use the supplied character reference images as identity, age, hair, costume-color and silhouette locks.",
  "Use the supplied mock battle grounds image as geography reference: low walls, wooden rail, west thicket, central channel, northeast stone steps and two separated faculty objective markers.",
  "Nonlethal mock battle: training weapons, controlled magic, no blood, no lethal injury, no collapsed bodies.",
].join(" ");

function parseTable(markdown) {
  const rows = [];
  for (const line of markdown.split("\n")) {
    if (!line.startsWith("| Shot")) continue;
    if (line.includes("| Shot | Purpose |")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (/^Shot\d+[A-Z]?$/.test(cells[0]) && cells.length >= 6) {
      rows.push({
        shot: cells[0],
        purpose: cells[1],
        start_intent: cells[2],
        key_intent: cells[3],
        dialogue_audio: cells[4],
        video_prompt: cells[5],
      });
    }
  }
  return rows;
}

function rejectIf(chars) {
  const failures = [
    "Reject if any readable named character becomes a generic adult mannequin or wrong-age student.",
    "Reject if any combat character faces the camera while their threat or route is elsewhere.",
    "Reject if extra anonymous fighters appear in readable foreground or confuse house lanes.",
    "Reject if the scene becomes lethal, bloody, or humiliating for any house.",
  ];
  if (chars.length) {
    failures.push(`Reject if weapon locks are broken: ${chars.map((name) => `${name}: ${weaponLocks[name]}`).join("; ")}.`);
  }
  return failures;
}

function framePrompt(row, frameKind) {
  const intent = frameKind === "start" ? row.start_intent : row.key_intent;
  const chars = shotCharacters[row.shot] || [];
  const charLocks = chars.map((name) => `${name}: ${weaponLocks[name]}; reference=${characterAssets[name]}`).join("\n");
  return [
    "Use case: historical-scene",
    "Asset type: EP02 Scene09 storyboard frame for AI video start/keyframe",
    `Shot: ${row.shot} ${frameKind.toUpperCase()}`,
    `Shot purpose: ${row.purpose}`,
    `Primary request: ${intent}`,
    `Scene/backdrop: Garreg Mach outdoor mock battle grounds, matching the supplied battlefield reference.`,
    `Characters visible: ${chars.length ? chars.join(", ") : "no readable named characters; tactical geography only"}`,
    `Character identity and weapon locks:\n${charLocks || "No named face close enough to require identity lock."}`,
    `Screen direction: ${screenDirection}`,
    `Dialogue/audio anchor: ${row.dialogue_audio}`,
    `Style/medium: ${styleLock}`,
    `Continuity requirement: This ${frameKind} frame must connect cleanly to the other frame for ${row.shot}; same location, same characters, same costumes, same weapons, plausible tactical movement.`,
    `Avoid: wrong weapons, reversed map, camera-facing combat poses, anonymous crowd masses, overaged faces, generic fantasy armor, gore, heroic victory pile, unreadable objective, text, subtitles, watermark.`,
  ].join("\n");
}

fs.mkdirSync(outputDir, { recursive: true });

const rows = parseTable(fs.readFileSync(shotListPath, "utf8"));
const queue = rows.map((row, index) => {
  const chars = shotCharacters[row.shot] || [];
  const refs = [backgroundAsset, ...chars.map((name) => characterAssets[name]).filter(Boolean)];
  const baseName = `${String(index + 1).padStart(2, "0")}_${row.shot}`;
  return {
    id: `EP02-SC09-${row.shot}`,
    shot: row.shot,
    stage: "storyboard",
    status: "needs_generation",
    priority_batch: priorityForShot(row.shot),
    purpose: row.purpose,
    characters: chars.map((name) => ({
      name,
      asset: characterAssets[name],
      weapon_lock: weaponLocks[name],
    })),
    references: refs,
    frames: {
      start: {
        path: path.join(outputDir, `${baseName}_start.png`),
        intent: row.start_intent,
        prompt: framePrompt(row, "start"),
      },
      key: {
        path: path.join(outputDir, `${baseName}_key.png`),
        intent: row.key_intent,
        prompt: framePrompt(row, "key"),
      },
    },
    video_prompt: [
      row.video_prompt,
      "Preserve identity, weapons, age, house colors, battlefield geography, and the start/key action chain.",
      "Motion should be restrained and tactical, not chaotic melee. No new foreground extras.",
    ].join(" "),
    dialogue_audio: row.dialogue_audio,
    screen_direction: screenDirection,
    reject_if: rejectIf(chars),
    source_refs: [
      shotListPath,
      "episodes/EP02/scene09_shooting_script_v2_2026-07-21.md",
      "episodes/EP02/scene09_script_shootability_audit_2026-07-21.md",
    ],
  };
});

function priorityForShot(shot) {
  const objective = new Set(["Shot032", "Shot032A", "Shot033B", "Shot033C", "Shot033D", "Shot034C", "Shot034D", "Shot034B"]);
  const exits = new Set(["Shot034E", "Shot034F", "Shot034G", "Shot034", "Shot035", "Shot036"]);
  const pressure = new Set(["Shot027B", "Shot027C", "Shot028B", "Shot029C", "Shot029D", "Shot029B", "Shot030C", "Shot032C", "Shot032D", "Shot032E"]);
  if (objective.has(shot)) return "01_objective_chain";
  if (exits.has(shot)) return "02_dignified_exits";
  if (pressure.has(shot)) return "03_three_house_pressure";
  return "04_setup_continuity";
}

const qa = {
  version: 1,
  date,
  status: "initialized_not_generated",
  policy: "All generated frames require local visual QA before video. Existing 2026-07-17/19 Scene09 images remain layout reference only.",
  shots: Object.fromEntries(queue.map((item) => [
    item.shot,
    {
      status: "not_generated",
      reviewed_at: null,
      start_exists: false,
      key_exists: false,
      decision: "blocked_needs_generation",
      checks: {
        identity: "not_reviewed",
        weapon: "not_reviewed",
        facing: "not_reviewed",
        tactical_action: "not_reviewed",
        outcome_coverage: "not_reviewed",
        start_key_continuity: "not_reviewed",
      },
      notes: [],
    },
  ])),
};

const artifactManifest = {
  version: 1,
  project: "FireEmblem3H-LiveAction",
  generated_at: date,
  artifacts: queue.map((item, index) => ({
    id: item.id,
    type: "storyboard_frame",
    stage: "storyboard",
    status: "needs_generation",
    created_by: "codex-storyboard-production",
    created_at: date,
    paths: [item.frames.start.path, item.frames.key.path],
    source_refs: item.source_refs,
    depends_on: ["EP02-SC09-SHOOTING-SCRIPT-V2", "EP02-SC09-SHOT-LIST-V2"],
    continuity: {
      previous: index > 0 ? queue[index - 1].id : null,
      next: index < queue.length - 1 ? queue[index + 1].id : null,
      in: item.frames.start.intent,
      out: item.frames.key.intent,
    },
    risk_flags: ["identity_drift", "weapon_drift", "screen_direction", "crowd_growth"],
    notes: `Fresh v2 start/key frame pair for ${item.shot}.`,
  })),
};

const deliveryLines = [
  "# EP02 Scene09 Rebuild V2 Frame And Video Prompt Queue",
  "",
  `Date: ${date}`,
  "",
  "Status: **needs_generation**. This file is generated from `scene09_shot_list_v2_2026-07-21.md`.",
  "",
  "All current Scene09 legacy images remain layout reference only. Use only frames from this directory after they pass creative QA.",
  "",
];

for (const item of queue) {
  deliveryLines.push(`## ${item.shot} - ${item.purpose}`);
  deliveryLines.push("");
  deliveryLines.push(`Priority batch: ${item.priority_batch}`);
  deliveryLines.push("");
  deliveryLines.push(`Start output: \`${item.frames.start.path}\``);
  deliveryLines.push("");
  deliveryLines.push("Start prompt:");
  deliveryLines.push("");
  deliveryLines.push("```text");
  deliveryLines.push(item.frames.start.prompt);
  deliveryLines.push("```");
  deliveryLines.push("");
  deliveryLines.push(`Key output: \`${item.frames.key.path}\``);
  deliveryLines.push("");
  deliveryLines.push("Key prompt:");
  deliveryLines.push("");
  deliveryLines.push("```text");
  deliveryLines.push(item.frames.key.prompt);
  deliveryLines.push("```");
  deliveryLines.push("");
  deliveryLines.push("Video prompt:");
  deliveryLines.push("");
  deliveryLines.push("```text");
  deliveryLines.push(item.video_prompt);
  deliveryLines.push("```");
  deliveryLines.push("");
  deliveryLines.push("Reject if:");
  for (const reject of item.reject_if) deliveryLines.push(`- ${reject}`);
  deliveryLines.push("");
}

fs.writeFileSync(path.join(outputDir, "frame_generation_queue.json"), `${JSON.stringify(queue, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, "artifact_manifest.json"), `${JSON.stringify(artifactManifest, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, "qa_manifest.json"), `${JSON.stringify(qa, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, "frame_and_video_prompts.md"), `${deliveryLines.join("\n")}\n`);

console.log(`wrote ${queue.length} shot frame pairs to ${outputDir}`);
