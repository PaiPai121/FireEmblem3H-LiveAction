const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputDir = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21";
const queuePath = path.join(outputDir, "frame_generation_queue.json");
const deliveryPath = "production_system/video_delivery_manifest.json";
const motionPromptDir = "production_system/scene09_v2_repair_package/motion_test_prompts";
const battlefieldRef = "assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png";

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

function asset(house, name) {
  return `assets/characters/${house}/${name}/academy/selected.png`;
}

function framePrompt({ shot, frame, purpose, primaryRequest, characters, dialogue }) {
  return [
    "Use case: historical-scene",
    "Asset type: EP02 Scene09 storyboard frame for AI video start/key/end frame",
    `Shot: ${shot} ${frame.toUpperCase()}`,
    `Shot purpose: ${purpose}`,
    `Primary request: ${primaryRequest}`,
    "Scene/backdrop: Garreg Mach outdoor mock battle grounds, same low-wall and west-thicket lane established in Shot032E.",
    `Characters visible: ${characters.map((item) => item.name).join(", ")}`,
    "Character identity and weapon locks:",
    ...characters.map((item) => `${item.name}: ${item.weapon_lock}; reference=${item.asset}`),
    "Screen direction: screen/top is north, left is Golden Deer west pressure, upper-right is Black Eagles/teacher objective, lower-right is Blue Lions route. Characters face threats, routes, or captors, not the camera.",
    `Dialogue/audio anchor: ${dialogue}`,
    "Style/medium: 16:9 cinematic live-action frame, grounded academy training battle, natural morning light, realistic cloth and academy training gear, no anime rendering, no text or watermark.",
    "Continuity requirement: keep academy-age student faces, selected character assets, nonlethal training weapons, and the same battlefield geography across start/key/end frames.",
    "Mock-battle rule: captured means ruled out of the exercise, not wounded or killed. Use controlled posture, raised hand, stepped-back boundary, lowered weapon, or teacher-rule body language instead of harm.",
    "Avoid: gore, lethal steel, kneeling humiliation, panic faces, wrong weapons, overaged faces, generic mannequin faces, extra foreground fighters, anonymous armies, reversed battlefield, subtitles, watermark.",
  ].join("\n");
}

const evidenceShots = [
  {
    id: "EP02-SC09-Shot032F",
    shot: "Shot032F",
    stage: "storyboard",
    status: "needs_generation",
    priority_batch: "03_three_house_pressure",
    purpose: "Felix and Ashe nonlethally rule Hubert out.",
    characters: [
      {
        name: "Felix",
        asset: asset("blue_lions", "Felix"),
        weapon_lock: "wooden training sword held low as a route block, no live blade",
      },
      {
        name: "Ashe",
        asset: asset("blue_lions", "Ashe"),
        weapon_lock: "training bow with blunt practice arrow line aimed at ground/cloth, not a lethal shot",
      },
      {
        name: "Hubert",
        asset: asset("black_eagles", "Hubert"),
        weapon_lock: "dark magic gesture fading as he is checked, dignified posture",
      },
    ],
    references: [
      battlefieldRef,
      "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/27_Shot032E_key.png",
      asset("blue_lions", "Felix"),
      asset("blue_lions", "Ashe"),
      asset("black_eagles", "Hubert"),
    ],
    frames: {
      start: {
        path: path.join(outputDir, "27B_Shot032F_start.png"),
        intent:
          "Hubert turns from the west-thicket pressure and notices Felix entering his retreat line while Ashe settles into cover.",
      },
      key: {
        path: path.join(outputDir, "27B_Shot032F_key.png"),
        intent:
          "Felix crosses the route with a low wooden-sword block as Ashe's blunt arrow line pins Hubert's casting angle; Hubert's dark magic fades.",
      },
      end: {
        path: path.join(outputDir, "27B_Shot032F_end_PENDING.png"),
        intent:
          "Hubert lowers his hand and steps back inside the mock-battle ruled-out boundary, contained by Felix and Ashe without injury.",
      },
    },
    video_prompt:
      "Felix and Ashe execute a clean two-angle containment on Hubert: Felix blocks the retreat lane with a wooden sword, Ashe marks the casting angle from cover, and Hubert accepts the mock-battle out call with dignity.",
    dialogue_audio: 'Ashe, low: "菲力克斯，现在。" Felix: "我封路。" Hubert, controlled: "……判断倒是很快。"',
    screen_direction:
      "Blue Lions containment enters from lower-right/right; Hubert is Black Eagles side upper-right; Golden Deer pressure remains implied from left.",
    reject_if: [
      "Reject if Hubert is injured, humiliated, kneeling, killed, or panicked.",
      "Reject if Felix uses a live sword or Ashe fires a lethal arrow into Hubert's body.",
      "Reject if Hubert remains an active caster at the end frame.",
      "Reject if extra readable fighters confuse who captured Hubert.",
    ],
    source_refs: [
      "episodes/EP02/scene09_roster_continuity_2026-07-23.md",
      "episodes/EP02/scene09_shot_list_v2_2026-07-21.md",
    ],
  },
  {
    id: "EP02-SC09-Shot032G",
    shot: "Shot032G",
    stage: "storyboard",
    status: "needs_generation",
    priority_batch: "03_three_house_pressure",
    purpose: "Claude and Leonie nonlethally contain Dorothea and Bernadetta.",
    characters: [
      {
        name: "Claude",
        asset: asset("golden_deer", "Claude"),
        weapon_lock: "calm command hand signal; bow may be slung or not readable in the wide route-control composition",
      },
      {
        name: "Leonie",
        asset: asset("golden_deer", "Leonie"),
        weapon_lock: "training lance held sideways to block movement, no lethal thrust",
      },
      {
        name: "Dorothea",
        asset: asset("black_eagles", "Dorothea"),
        weapon_lock: "spell hand lowering, academy uniform silhouette preserved",
      },
      {
        name: "Bernadetta",
        asset: asset("black_eagles", "Bernadetta"),
        weapon_lock: "training bow lowered or held safe, not dropped in panic",
      },
    ],
    references: [
      battlefieldRef,
      "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/27_Shot032E_key.png",
      asset("golden_deer", "Claude"),
      asset("golden_deer", "Leonie"),
      asset("black_eagles", "Dorothea"),
      asset("black_eagles", "Bernadetta"),
    ],
    frames: {
      start: {
        path: path.join(outputDir, "27C_Shot032G_start.png"),
        intent:
          "Dorothea and Bernadetta hold the Black Eagles backline while Claude and Leonie appear from the west-side pressure route.",
      },
      key: {
        path: path.join(outputDir, "27C_Shot032G_key.png"),
        intent:
      "Claude's command signal and Leonie's sideways training-lance block cut Dorothea and Bernadetta off from retreat or spell/bow angles.",
      },
      end: {
        path: path.join(outputDir, "27C_Shot032G_end_PENDING.png"),
        intent:
          "Dorothea and Bernadetta lower hands/weapons and accept the mock-battle out call while Claude and Leonie keep a calm control angle.",
      },
    },
    video_prompt:
      "Claude and Leonie prove Golden Deer tactical value by containing Dorothea and Bernadetta without cruelty: two clean angles, lowered Black Eagles weapons, and a clear mock-battle out state.",
    dialogue_audio: 'Claude: "抱歉，这条路借我们用一下。" Leonie: "弓放低，判定就结束。" Dorothea: "真会挑时机呢。"',
    screen_direction:
      "Golden Deer pressure enters from left/west; Black Eagles backline is upper-right/northeast; the camera keeps both teams competent and controlled.",
    reject_if: [
      "Reject if Dorothea or Bernadetta look helpless, injured, overaged, or generic.",
      "Reject if Claude or Leonie appear cruel, lethal, or physically striking down opponents.",
      "Reject if Dorothea or Bernadetta still hold active attack posture at the end frame.",
      "Reject if extra readable fighters obscure the Golden Deer containment logic.",
    ],
    source_refs: [
      "episodes/EP02/scene09_roster_continuity_2026-07-23.md",
      "episodes/EP02/scene09_shot_list_v2_2026-07-21.md",
    ],
  },
];

for (const shot of evidenceShots) {
  for (const [frame, data] of Object.entries(shot.frames)) {
    data.prompt = framePrompt({
      shot: shot.shot,
      frame,
      purpose: shot.purpose,
      primaryRequest: data.intent,
      characters: shot.characters,
      dialogue: shot.dialogue_audio,
    });
  }
}

function shotKey(item) {
  if (item.shot) return item.shot;
  return item.id?.match(/SHOT-(.+?)-V2/)?.[1] || item.id?.match(/EP02-SC09-(Shot[^-]+)/)?.[1] || "";
}

function insertAfter(list, afterShot, items) {
  const itemKeys = new Set(items.map((item) => shotKey(item)));
  const filtered = list.filter((item) => !itemKeys.has(shotKey(item)));
  const afterIndex = filtered.findIndex((item) => shotKey(item) === afterShot);
  if (afterIndex < 0) throw new Error(`Cannot find insertion point ${afterShot}`);
  filtered.splice(afterIndex + 1, 0, ...items);
  return filtered;
}

function deliveryFor(shot, order) {
  const shortShot = shot.shot;
  const stem = shortShot === "Shot032F" ? "27B_Shot032F" : "27C_Shot032G";
  return {
    id: `EP02-SC09-SHOT-${shortShot}-V2-20260724`,
    order,
    status: "monitor_required",
    duration_seconds: 7,
    prompt_path: path.join(motionPromptDir, `${shortShot}_motion_test_prompt.md`),
    start_frame: shot.frames.start.path,
    key_frame: shot.frames.key.path,
    end_frame: shot.frames.end.path,
    expected_clip: `episodes/EP02/video_outputs/scene09_v2_rebuild/${stem}.mp4`,
    edit_in: "cut from Shot032E on crossing pressure; keep low-wall geography continuous",
    edit_out: "cut after mock-battle out state is visible and accepted",
    audio_anchor: shot.dialogue_audio,
    battle_state_after: null,
    continuity_previous: "",
    continuity_next: "",
    model_notes: [
      "Inserted evidence shot required before final video package.",
      "Preserve V2 identity, weapon, screen direction, nonlethal training tone, and dignified rival-house portrayal.",
    ],
    reject_if: shot.reject_if,
  };
}

const queue = readJson(queuePath);
const delivery = readJson(deliveryPath);
const updatedQueue = insertAfter(queue, "Shot032E", evidenceShots);
const deliveryItems = evidenceShots.map((shot, index) => deliveryFor(shot, 28 + index));
let updatedDeliveryShots = insertAfter(delivery.shots, "Shot032E", deliveryItems);

updatedDeliveryShots = updatedDeliveryShots.map((shot, index, list) => ({
  ...shot,
  order: index + 1,
  continuity_previous: list[index - 1]?.id || "",
  continuity_next: list[index + 1]?.id || "",
}));

delivery.shots = updatedDeliveryShots;

writeJson(queuePath, updatedQueue);
writeJson(deliveryPath, delivery);

for (const shot of evidenceShots) {
  const shortShot = shot.shot;
  writeText(
    path.join(motionPromptDir, `${shortShot}_motion_test_prompt.md`),
    [
      `# ${shortShot} Motion Test Prompt`,
      "",
      `Purpose: ${shot.purpose}`,
      "",
      "Start Frame:",
      `${shot.frames.start.path}`,
      `${shot.frames.start.intent}`,
      "",
      "Key Frame:",
      `${shot.frames.key.path}`,
      `${shot.frames.key.intent}`,
      "",
      "End Frame:",
      `${shot.frames.end.path}`,
      `${shot.frames.end.intent}`,
      "",
      "Motion:",
      shot.video_prompt,
      "",
      "Dialogue / Audio:",
      shot.dialogue_audio,
      "",
      "Continuity Locks:",
      "- Academy mock battle only; no lethal injury, no humiliation.",
      "- Preserve character assets and weapon locks from the queue.",
      "- Preserve the roster-after-shot ledger; ruled-out students do not resume active combat later.",
      "",
      "Reject If:",
      ...shot.reject_if.map((item) => `- ${item}`),
      "",
    ].join("\n")
  );
}

console.log(
  JSON.stringify(
    {
      inserted: evidenceShots.map((shot) => shot.shot),
      queue_shots: updatedQueue.length,
      delivery_shots: delivery.shots.length,
      motion_prompts: evidenceShots.map((shot) => path.join(motionPromptDir, `${shot.shot}_motion_test_prompt.md`)),
    },
    null,
    2
  )
);
