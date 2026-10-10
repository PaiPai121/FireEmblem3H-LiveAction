const fs = require("fs");
const path = require("path");

const queuePath = "episodes/EP02/mock_battle_keyframe_production_queue_2026-07-17.json";
const payloadPath = "episodes/EP02/video_payloads_cinematic_v2_expanded_2026-07-16.json";
const outDir = "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/delivery_prompts";
const jsonPath = "episodes/EP02/scene09_full_frame_and_video_prompts_2026-07-19.json";
const mdPath = "episodes/EP02/scene09_full_frame_and_video_prompts_2026-07-19.md";

fs.mkdirSync(outDir, { recursive: true });

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const payloads = JSON.parse(fs.readFileSync(payloadPath, "utf8"));
const payloadMap = new Map(payloads.map((item) => [item.shot, item]));

const scene09 = queue
  .filter((entry) => /^Shot(02[5-9]|03[0-6])/.test(entry.shot))
  .sort((a, b) => shotOrder(a.shot) - shotOrder(b.shot));

const updatedBeats = {
  Shot027B: {
    start:
      "Start before the first moving enemy wave: a compact Black Eagles line is staged north/right-depth with Ferdinand at the front, Edelgard half a step behind, Hubert and Dorothea in support. Blue Lions remain separate lower/center-left; no anonymous crowd.",
    key:
      "Key beat: Ferdinand leads a limited named Black Eagles wave toward the central passage while Edelgard, Hubert, and Dorothea keep disciplined spacing. Blue Lions brace separately in the foreground/depth. Golden Deer are at most a distant west-thicket hint.",
    motion:
      "Move from compact Black Eagles staging into a restrained Ferdinand-led practice advance. Keep 4-6 readable figures only; no mass of unidentified students, no mixed house line, no hero portrait.",
  },
  Shot029: {
    start:
      "Start as a brief wide setup only: Sylvain and Ingrid guard the Blue Lions right flank, bodies turned west/northwest toward thicket movement. Keep both long training lances readable if weapons are visible; do not reveal the full Golden Deer flank action yet.",
    key:
      "Key beat: Ingrid's long training lance crosses the low wall line while Sylvain turns his own lance to protect the flank. Golden Deer movement remains partial and distant; the detailed Claude/Hilda/Lorenz/Ignatz pressure belongs to Shot029C, Shot029D, and Shot029B.",
    motion:
      "Use Shot029 as a wide weapon-monitor setup, not the main Golden Deer high-light. Sylvain and Ingrid pivot toward west/screen-left pressure with long academy training lances; avoid close hand/weapon framing unless the lance silhouette is unmistakable. Cut before the weapon read can become ambiguous.",
  },
  Shot029C: {
    start:
      "Start before Claude fires: Claude crouches in the thicket and studies both openings, the stretched Blue Lions rear support line and the Black Eagles side support angle.",
    key:
      "Key beat: Claude draws the bow with a tactical half-smile, aiming to disturb both Blue Lions support and Black Eagles side support rather than helping either side.",
    motion:
      "Claude reads the two exposed lines, shifts his aim between Blue Lions and Black Eagles, then releases the first disruption shot.",
  },
  Shot030C: {
    start:
      "Start before the disruption lands: Annette and Mercedes prepare to move straight to Dedue while a Black Eagles side student tries to support Hubert.",
    key:
      "Key beat: Golden Deer arrows force both sides to change route: one arrow brushes the Black Eagles side support lane, the next pins the ground in front of Annette and Mercedes.",
    motion:
      "The first arrow makes Black Eagles flinch off their support angle; the second cuts Blue Lions' support line, forcing Mercedes to pull Annette behind cover.",
  },
  Shot032: {
    start:
      "Start before healing: low-medium camera from Blue Lions rear-left looking north/northeast. Dedue's shield line has dipped from Hubert's pressure and Ferdinand's front impact, but he stays upright and faces enemy pressure ahead/right-depth. Dimitri starts to turn toward Dedue, yet keeps his long blunted training lance and eyes oriented toward the enemy/front. Mercedes is crouched behind the low stone wall at left/southeast rear with empty hands ready and no healing light yet.",
    key:
      "Key beat inspired by the classic warrior-healer composition, with original blocking: same camera and same positions. Dedue remains upright with no blood, no wound, and no collapse; Mercedes kneels behind the low wall and sends a short clean white healing line from her empty hands directly into Dedue's shield arm and shoulder guard, not into Dimitri's lance. Dimitri looks concerned but keeps his lance line and body facing enemy/front.",
    motion:
      "Dedue absorbs the controlled drill pressure, his shield drops one inch, Dimitri nearly turns, Dedue blocks Dimitri's sightline back toward the enemy, Mercedes restores only the shield arm/shoulder guard from cover, then Dedue raises the shield again and tells Dimitri to face forward.",
  },
  Shot032C: {
    start:
      "Start before Black Eagles respond: Edelgard keeps the Black Eagles line disciplined while Golden Deer are safely disturbing both Blue Lions rear support and Black Eagles side support from the west thicket.",
    key:
      "Key beat: Edelgard signals Hubert; Hubert's dark practice magic and Dorothea's support rhythm pressure the thicket edge, forcing Claude and Hilda to relocate without humiliating them. Hilda must keep youth identity v4, pink twin ponytails, Golden Deer academy uniform, and compact training axe.",
    motion:
      "Black Eagles split pressure toward Golden Deer without abandoning the center, preventing Claude from safely profiting from both sides. Edelgard, Hubert, and Dorothea remain composed; Golden Deer give ground but stay competent.",
  },
  Shot032D: {
    start:
      "Start before the lines collide: Blue Lions pressure Black Eagles center, Golden Deer pressure both rear and side lanes, Black Eagles begin turning against Golden Deer.",
    key:
      "Key beat: high oblique view of three color-coded tactical lines compressing near low walls: Blue Lions push Black Eagles, Golden Deer disrupt both sides, Black Eagles answer toward the thicket.",
    motion:
      "All three lines move at once but remain readable; the space between Black Eagles and Golden Deer begins to collapse.",
  },
  Shot032E: {
    start:
      "Start before Byleth exploits the window: Golden Deer have made both sides unstable and Black Eagles are shifting laterally.",
    key:
      "Key beat: Byleth points through the chaos and orders Blue Lions not to chase Golden Deer but to drive Black Eagles toward the Golden Deer activity zone.",
    motion:
      "Blue Lions keep central pressure, Black Eagles are squeezed sideways, Golden Deer lose their safe cover, and the first local three-way melee forms around low walls and wooden rails.",
  },
  Shot033B: {
    start:
      "Start before the route command: Byleth stands side/back between student lanes and the northeast teacher platform, identifying two separated faculty objective markers. Hanneman is on the Black Eagles-side marker and Manuela is several paces away on the Golden Deer-side marker; they are parallel class faculty judges, not a paired fighting unit. Ashe, Ingrid, Felix, Dimitri, and Dedue wait for the next instruction.",
    key:
      "Key beat: Byleth gives the clipped route command toward the split teacher markers. Blue Lions visibly execute in separate routes: Ashe to Hanneman's Black Eagles-side bow angle, Ingrid to Manuela's Golden Deer-side route, Felix toward Ferdinand at stair base, Dimitri and Dedue holding the central gap.",
    motion:
      "Byleth remains a tactical anchor, not a camera-facing portrait. The motion is command then reaction: Blue Lions peel into distinct nonlethal practice routes while Hanneman and Manuela stay separated at different faculty objective markers. Do not stage the teachers as a side-by-side combat pair.",
  },
  Shot033C: {
    start:
      "Start before suppression: Ashe holds a lower-left bow angle toward Hanneman on the Black Eagles-side faculty marker, reading the spell angle rather than aiming at a body. Manuela is not part of this shot.",
    key:
      "Key beat: Ashe's practice arrow lands on the stone step or spell marker before Hanneman's casting line, breaking the spell geometry locally. Hanneman stays upright, composed, and unhurt.",
    motion:
      "Animate nonlethal line-of-angle suppression only: arrow to step/marker, local shimmer breaks, Hanneman notes the read. Do not turn Hanneman magic into an attack beam toward Ashe.",
  },
  Shot033D: {
    start:
      "Start before route cut: Ingrid approaches from the Blue Lions side with long training lance while Manuela stands at the Golden Deer-side faculty marker as support judge. Hanneman is not part of this shot.",
    key:
      "Key beat: Ingrid is the active route cutter, holding a long training lance across Manuela's return path to her separate faculty marker. Manuela side-steps off her mark with white support magic fading, composed and unhurt. Sylvain is background containment only.",
    motion:
      "Ingrid cuts the path; Manuela yields the route under the rules. Do not make Manuela attack Sylvain or make Ingrid a passive observer.",
  },
};

const extraRefs = {
  Shot029B: [
    {
      name: "Lorenz",
      asset: "assets/characters/golden_deer/Lorenz/academy/selected.png",
      continuity_note: "Golden Deer academy-age side-line student, formal lance pressure supporting Hilda",
    },
    {
      name: "Ignatz",
      asset: "assets/characters/golden_deer/Ignatz/academy/selected.png",
      continuity_note: "Golden Deer academy-age archer support, careful route-denial arrows from cover",
    },
  ],
  Shot032: [
    {
      name: "Mercedes",
      asset: "assets/characters/blue_lions/Mercedes/academy/selected.png",
      continuity_note: "gentle blonde 18-year-old healer, short clean white healing light from cover",
    },
  ],
  Shot030C: [
    {
      name: "Mercedes",
      asset: "assets/characters/blue_lions/Mercedes/academy/selected.png",
      continuity_note: "gentle blonde 18-year-old healer, pulls Annette behind low-wall cover",
    },
  ],
  Shot032C: [
    {
      name: "Dorothea",
      asset: "assets/characters/black_eagles/Dorothea/academy/selected.png",
      continuity_note: "Black Eagles academy-age support caster, composed short support rhythm beside Edelgard and Hubert",
    },
  ],
};

const generationNotes = {
  Shot032:
    "Weapon/facing v2 generated and locally reviewed on 2026-07-19: start frame keeps Mercedes unlit and ready; keyframe adds a short healing line to Dedue's shield arm/shoulder guard while Dimitri and Dedue keep facing enemy pressure.",
};

const weaponLocks = {
  Byleth: "sheathed training sword or plain training sword only; use it for blocking, pointing, or a nonlethal wrist tap",
  Dimitri: "long blunted training lance/spear in disciplined two-hand guard; not a sword",
  Dedue: "large padded practice shield as primary read; optional short blunt sidearm mostly hidden; never slim",
  Felix: "wooden training sword/practice blade only",
  Sylvain: "training lance/spear only",
  Ingrid: "training lance/spear only",
  Ashe: "wooden training bow and training arrows only",
  Annette: "empty hands/book focus with controlled wind magic; no melee weapon",
  Mercedes: "empty hands with white healing magic from cover; no staff-as-spear, sword, bow, or offensive beam",
  Edelgard: "blunted training axe or axe-ready command stance",
  Hubert: "dark magic casting hand or book focus; no frontline melee weapon",
  Ferdinand: "training lance/spear only",
  Dorothea: "magic casting stance/spell focus; no heavy weapon",
  Claude: "bow from thicket cover only",
  Hilda: "training axe/short practice axe only",
  Lorenz: "training lance/spear only",
  Ignatz: "wooden training bow and careful nonlethal arrows only",
  Hanneman: "wind magic casting hand/book/staff-like focus on platform; no melee duel",
  Manuela: "white magic support/light spell gesture on platform; no axe/spear or brawler pose",
};

function shotOrder(shot) {
  const match = String(shot).match(/^Shot(\d+)([A-Z])?$/);
  if (!match) return 999;
  return Number(match[1]) + (match[2] ? (match[2].charCodeAt(0) - 64) / 10 : 0);
}

function exists(pathValue) {
  return Boolean(pathValue) && fs.existsSync(pathValue);
}

function names(entry) {
  return refsFor(entry).map((ref) => ref.name).join(", ");
}

function referenceLines(entry) {
  return refsFor(entry)
    .map((ref) => `- ${ref.name}: ${ref.asset}; ${ref.continuity_note}`)
    .join("\n");
}

function weaponLines(entry) {
  return refsFor(entry)
    .filter((ref) => weaponLocks[ref.name])
    .map((ref) => `- ${ref.name}: ${weaponLocks[ref.name]}`)
    .join("\n");
}

function refsFor(entry) {
  const refs = [...(entry.character_reference_assets || [])];
  const seen = new Set(refs.map((ref) => ref.name));
  for (const ref of extraRefs[entry.shot] || []) {
    if (!seen.has(ref.name)) refs.push(ref);
  }
  return refs;
}

function baseSetting() {
  return [
    "Background master reference: assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png. Use this raster background as the production geography anchor; do not substitute older TrainingGround references.",
    "Scene setting: Garreg Mach outdoor academy mock battle field, one continuous tactical map, not a small sparring yard.",
    "Visible geography: grass slopes, low stone walls, wooden barriers, thickets, stone steps, and northeast raised healing-stone platform.",
    "Coordinate lock: north is screen top, southeast Blue Lions start is lower-right, west thicket/Golden Deer entry is screen left, northeast heal platform is upper-right. Blue Lions move lower-right to center/upper-right; Black Eagles resist from north/northeast toward south/southwest; Golden Deer cut in from west/left toward east/southeast and pressure both sides.",
    "Combat rule: supervised nonlethal academy exercise with wooden or blunted weapons, no blood, no lethal wounds.",
    "Continuity rule: use the listed selected.png student assets for face, hair, age impression, costume silhouette and house color accents.",
  ].join("\n");
}

function negative(entry) {
  return entry.negative_prompt || [
    "No game UI, no subtitles, no text, no watermark, no modern objects.",
    "No blood, no lethal wounds, no battlefield gore, no war-phase armor.",
    "No generic identical students, no wrong hair colors, no face swaps, no old student faces.",
    "No small target range, no isolated sparring ring, no confusing crowd pile.",
    "No older Hilda: whenever Hilda is visible, use the youth identity v4 selected.png look, pink twin ponytails, academy-age face, and compact training axe.",
  ].join(" ");
}

function startPrompt(entry) {
  const override = updatedBeats[entry.shot]?.start;
  return [
    `Generate the START FRAME for ${entry.shot} - ${entry.title}.`,
    "",
    override || `Start before the action peak: ${entry.purpose || entry.title}. Establish the initial blocking that motivates the keyframe.`,
    "",
    `Characters: ${names(entry) || "as required by the shot"}.`,
    referenceLines(entry),
    "",
    "Weapon/action locks:",
    weaponLines(entry) || "- Use only the role-appropriate nonlethal academy training weapon or magic action.",
    "",
    baseSetting(),
    "",
    "Camera: 16:9 cinematic live-action storyboard still. The start frame must be quieter than the keyframe and leave clear motion direction into the next beat.",
    "",
    `Avoid: ${negative(entry)}`,
  ].join("\n");
}

function keyPrompt(entry) {
  const override = updatedBeats[entry.shot]?.key;
  return [
    `Generate the KEYFRAME for ${entry.shot} - ${entry.title}.`,
    "",
    override || entry.production_prompt || `Key action: ${entry.purpose || entry.title}.`,
    "",
    `Characters: ${names(entry) || "as required by the shot"}.`,
    referenceLines(entry),
    "",
    "Weapon/action locks:",
    weaponLines(entry) || "- Use only the role-appropriate nonlethal academy training weapon or magic action.",
    "",
    baseSetting(),
    "",
    "Camera: 16:9 cinematic live-action storyboard still. The keyframe must show the clearest tactical/emotional turning point for this shot.",
    "",
    `Avoid: ${negative(entry)}`,
  ].join("\n");
}

function videoPrompt(entry) {
  const payload = payloadMap.get(entry.shot) || {};
  const override = updatedBeats[entry.shot]?.motion;
  const source = payload.prompt || entry.production_prompt || "";
  return [
    `AI VIDEO PROMPT for ${entry.shot} - ${entry.title}.`,
    "",
    override || source,
    "",
    "Motion requirements: begin from the start frame, move cleanly into the keyframe action, then settle with a usable editorial handle. Preserve screen direction and adjacent-shot geography.",
    "Background and direction requirements: use assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png as the geography reference; keep north screen top, Blue Lions lower-right to center/upper-right, Golden Deer left to center, Black Eagles north/right-depth to center.",
    "Weapon/action requirements:",
    weaponLines(entry) || "- Use only the role-appropriate nonlethal academy training weapon or magic action.",
    "Continuity requirements: keep all named characters identity-locked to their selected.png references. Maintain academy-age youthful faces and house colors.",
    "Scene09 tactical rule: Golden Deer disrupt both Blue Lions and Black Eagles; Blue Lions win by exploiting the three-way window, not by raw overpowering.",
    "",
    `Avoid: ${payload.negative_prompt || negative(entry)}`,
  ].join("\n");
}

function writePrompt(file, content) {
  fs.writeFileSync(file, `${content.trim()}\n`);
}

const delivery = {
  version: "2026-07-19",
  scope: "EP02 Scene09 Mock Battle, Shot025-Shot036",
  policy:
    "Do not mark old/source PNG or SVG layout frames as final generated production frames. Existing non-production images are references only. Only newly generated and QA-reviewed raster frames may be qa_passed.",
  shots: scene09.map((entry) => {
    const start = startPrompt(entry);
    const key = keyPrompt(entry);
    const video = videoPrompt(entry);
    const startPromptPath = path.join(outDir, `${entry.shot}_start_frame_prompt.md`);
    const keyPromptPath = path.join(outDir, `${entry.shot}_keyframe_prompt.md`);
    const videoPromptPath = path.join(outDir, `${entry.shot}_video_prompt.md`);
    writePrompt(startPromptPath, start);
    writePrompt(keyPromptPath, key);
    writePrompt(videoPromptPath, video);
    return {
      shot: entry.shot,
      title: entry.title,
      status: entry.status,
      priority: entry.priority,
      required_characters: entry.required_characters || [],
      character_reference_assets: refsFor(entry),
      planned_start_frame_output: entry.output_start_frame || "",
      planned_keyframe_output: entry.output_keyframe || "",
      start_frame_asset_status: exists(entry.output_start_frame) ? "qa_asset_exists" : "planned_not_generated",
      keyframe_asset_status: exists(entry.output_keyframe) ? "asset_exists_check_qa_manifest" : "planned_not_generated",
      legacy_or_layout_reference: entry.source_layout || entry.current_keyframe || "",
      start_frame_prompt_path: startPromptPath,
      keyframe_prompt_path: keyPromptPath,
      video_prompt_path: videoPromptPath,
      negative_prompt: negative(entry),
      generation_note: generationNotes[entry.shot] || "",
    };
  }),
};

fs.writeFileSync(jsonPath, `${JSON.stringify(delivery, null, 2)}\n`);

const mdRows = delivery.shots
  .map((shot) => {
    return `| ${shot.shot} | ${shot.title} | ${shot.start_frame_asset_status} | ${shot.keyframe_asset_status} | ${shot.generation_note || ""} | [start](${shot.start_frame_prompt_path}) / [key](${shot.keyframe_prompt_path}) / [video](${shot.video_prompt_path}) |`;
  })
  .join("\n");

const md = `# EP02 Scene09 Full Frame And Video Prompt Delivery

Date: 2026-07-19

Scope: EP02 Scene09 Mock Battle, Shot025-Shot036.

Policy: existing old/source PNG or SVG layout frames are references only. They must not be renamed or copied as final production start/key frames. A frame is final only after newly generated raster output is QA-reviewed.

| Shot | Title | Start frame asset | Keyframe asset | Generation note | Prompt files |
| --- | --- | --- | --- | --- | --- |
${mdRows}
`;

fs.writeFileSync(mdPath, md);

console.log(`wrote ${delivery.shots.length} shot prompt packages`);
console.log(jsonPath);
console.log(mdPath);
