#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const shot = "Shot034E";
const packageRoot = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const visible = ["Claude", "Hilda", "Lorenz", "Ignatz", "Leonie"];
const frames = {
  start_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/35F_Shot034E_golden_deer_weapons_start.png",
  key_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/35F_Shot034E_golden_deer_weapons_key.png",
  end_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/35F_Shot034E_golden_deer_weapons_end.png",
};
const title = "金鹿高光后收势";
const note = "Golden Deer stand down after the flank succeeds but the class loses the objective.";
const motion = "Golden Deer stand down with dignity after their tactical high point. Claude rests a lowered unstrung wooden practice bow; Hilda grounds exactly one rounded wooden padded training axe; Lorenz grounds one blunt wooden practice lance or pole with a rounded cap; Ignatz keeps his book close and lowers a simple wooden practice bow; Leonie grounds one blunt wooden practice lance or pole with a rounded padded cap. Nobody resumes pursuit or reads as humiliated.";
const camera = "Preserve the start/key/end group composition. Use only a restrained push, pan, or settle that clarifies the stand-down without redesigning the shot or crossing screen direction.";
const performance = "Respectful tactical concession: calm breath, focused eyelines toward the offscreen route/ruling, no cheering, no humiliation, no heroic mugging toward camera.";
const audio = "Claude: \"这步算你们赢。\" Golden Deer lower practice gear with calm breath and cloth movement.";
const primaryCheck = "Visible named-only: Claude, Hilda, Lorenz, Ignatz, Leonie. Hilda must have one rounded padded wooden training axe, not a hammer, mace, flail, or ball weapon. Lorenz and Leonie must have blunt wooden practice lance/pole props with rounded caps, not sharp spearheads. Claude and Ignatz keep lowered simple wooden practice bows. Reject if any extra readable human appears.";
const baseNegative = "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no weapon drift, no mace, no hammer, no flail, no ball-on-chain, no spherical weapon head, no sharp spearhead, no metal spear blade, no lethal hits, no gore, no blood, no text, no subtitles, no captions, no visible text, no watermark, no camera spin, no screen-direction reversal";
const negative = [
  baseNegative,
  "no paired Hanneman and Manuela",
  "no shared teacher platform",
  "no same-lane teacher duo",
  "no readable Hanneman",
  "no readable Manuela",
  "no readable return of Felix",
  "no active return of Felix",
  "no readable return of Ashe",
  "no active return of Ashe",
  "no readable return of Annette",
  "no active return of Annette",
  "no readable return of Mercedes",
  "no active return of Mercedes",
  "no readable return of Sylvain",
  "no active return of Sylvain",
  "no readable return of Ingrid",
  "no active return of Ingrid",
  "no readable return of Hubert",
  "no active return of Hubert",
  "no readable return of Ferdinand",
  "no active return of Ferdinand",
  "no readable return of Dorothea",
  "no active return of Dorothea",
  "no readable return of Bernadetta",
  "no active return of Bernadetta",
  "no renewed attack by Claude",
  "no active-combat reset for Claude",
  "no renewed attack by Hilda",
  "no active-combat reset for Hilda",
  "no renewed attack by Lorenz",
  "no active-combat reset for Lorenz",
  "no renewed attack by Ignatz",
  "no active-combat reset for Ignatz",
  "no renewed attack by Leonie",
  "no active-combat reset for Leonie",
  "no readable return of Hanneman",
  "no active return of Hanneman",
  "no readable return of Manuela",
  "no active return of Manuela",
  "no uncaptured return of Hubert",
  "no uncaptured return of Dorothea",
  "no uncaptured return of Bernadetta",
  "no uncaptured return of Hanneman",
].join(", ");
const rejectIf = [
  "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
  "Reject if anyone outside Claude, Hilda, Lorenz, Ignatz, and Leonie appears.",
  "Reject if Hilda's training axe reads as a hammer, mace, flail, ball-on-chain, spherical weapon head, metal axe, or lethal blade.",
  "Reject if Lorenz or Leonie has a sharp spearhead, metal spear blade, lethal point, body-aimed thrust, or weapon-forward attack pose.",
  "Reject if Claude or Ignatz draws an arrow, pulls a bowstring, fires, or resumes pursuit.",
  "Reject if Golden Deer characters resume active combat after the stand-down.",
  "Reject if the group reads as cosplay mannequins, older adults, or plastic doll faces instead of academy-age live-action students.",
  "Reject if any captured character reappears, or any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
  "Reject if the shot becomes a cheering victory pose, humiliation, injury, gore, blood, or crowd scene.",
];
const frameDetails = {
  start: {
    intent: "Golden Deer begin a dignified stand-down with safe training weapons lowered and no pursuit.",
    prompt: "Shot034E START: Claude, Hilda, Lorenz, Ignatz, and Leonie stand down; Hilda has one rounded wooden training axe, Lorenz/Leonie have blunt rounded wooden poles, bows lowered.",
    generated_review: "local_visual_review_passed_golden_deer_weapon_age_identity",
  },
  key: {
    intent: "The stand-down action peak: Golden Deer fully accept the objective loss without humiliation.",
    prompt: "Shot034E KEY: Golden Deer lower/ground safe practice gear; no hammer, mace, flail, sharp spearhead, extra person, or resumed pursuit.",
    generated_review: "local_visual_review_passed_golden_deer_weapon_age_identity",
  },
  end: {
    intent: "Final held state of the Golden Deer stand-down, calm and respectful.",
    prompt: "Shot034E END: five Golden Deer remain composed with safe grounded training props; no extra humans or lethal weapon silhouettes.",
    generated_review: "local_visual_review_passed_golden_deer_weapon_age_identity",
  },
};

function abs(rel) {
  return path.join(root, rel);
}
function readJson(rel) {
  return JSON.parse(fs.readFileSync(abs(rel), "utf8"));
}
function writeJson(rel, value) {
  fs.mkdirSync(path.dirname(abs(rel)), { recursive: true });
  fs.writeFileSync(abs(rel), `${JSON.stringify(value, null, 2)}\n`);
}
function writeText(rel, value) {
  fs.mkdirSync(path.dirname(abs(rel)), { recursive: true });
  fs.writeFileSync(abs(rel), value);
}
function patchFrames(row) {
  row.start_frame = frames.start_frame;
  row.key_frame = frames.key_frame;
  row.end_frame = frames.end_frame;
  row.source_frames = { start: frames.start_frame, key: frames.key_frame, end: frames.end_frame, ...frames };
  row.frames = {
    ...(row.frames || {}),
    start: { ...(row.frames?.start || {}), ...frameDetails.start, path: frames.start_frame },
    key: { ...(row.frames?.key || {}), ...frameDetails.key, path: frames.key_frame },
    end: { ...(row.frames?.end || {}), ...frameDetails.end, path: frames.end_frame },
    start_frame: frames.start_frame,
    key_frame: frames.key_frame,
    end_frame: frames.end_frame,
  };
}
function patchShot(row) {
  if (!row || row.shot !== shot) return;
  row.title = title;
  row.titleZh = title;
  row.visible_named_only = [...visible];
  row.characters = visible.join(", ");
  patchFrames(row);
  row.motion = motion;
  row.video_prompt = motion;
  row.camera = camera;
  row.audio_anchor = audio;
  row.dialogue_audio = audio;
  row.primary_check = primaryCheck;
  row.primary_continuity_check = primaryCheck;
  row.reject_if = [...rejectIf];
  row.negative_prompt = negative;
  row.note = note;
  if (row.battle_state_after) {
    row.battle_state_after.visible_named_only = [...visible];
    row.battle_state_after.title = title;
    row.battle_state_after.motion = motion;
    row.battle_state_after.video_prompt = motion;
    row.battle_state_after.note = note;
    row.battle_state_after.primary_check = primaryCheck;
    row.battle_state_after.reject_if = [...rejectIf];
    patchFrames(row.battle_state_after);
  }
  if (row.roster_after) {
    row.roster_after.visible_named_only = [...visible];
    row.roster_after.note = note;
    patchFrames(row.roster_after);
  }
}
function patchCollection(rel, key = "shots") {
  if (!fs.existsSync(abs(rel))) return;
  const json = readJson(rel);
  const rows = Array.isArray(json) ? json : json[key] || [];
  rows.forEach(patchShot);
  writeJson(rel, json);
}
function noActive(row) {
  return row?.battle_state_after?.inactive_or_removed_after || row?.battle_state_after?.no_active_combat_after || [];
}
function productionPrompt(row) {
  return [
    "# Shot034E Production Video Prompt Candidate V3",
    "",
    "Status: monitor_required",
    "",
    "Shot ID:",
    "EP02-SC09-Shot034E-V3-ATTRITION",
    "",
    "Duration:",
    "4-6 seconds. Hold the final state for the last 0.5 seconds for edit clarity.",
    "",
    "Input Frames:",
    `start_frame: ${frames.start_frame}`,
    `key_frame: ${frames.key_frame}`,
    `end_frame: ${frames.end_frame}`,
    "end_frame_status: dedicated_patch_exists",
    "",
    "Motion:",
    motion,
    "",
    "Camera:",
    camera,
    "",
    "Performance:",
    performance,
    "",
    "Audio:",
    audio,
    "",
    "Continuity Locks:",
    "Allowed readable humans: Claude, Hilda, Lorenz, Ignatz, Leonie.",
    "No unnamed extras, crowd, bystanders, generic students, spectators, soldiers, or readable silhouettes.",
    "Keep Garreg Mach mock-battle geography, academy age, house costumes, training weapons, and nonlethal classroom tone.",
    "Hilda has exactly one rounded padded wooden training axe; never a hammer, mace, flail, ball-on-chain, spherical head, metal axe, or lethal blade.",
    "Lorenz and Leonie each hold one blunt wooden practice lance/pole with a rounded cap; never a sharp spearhead or metal spear blade.",
    "Claude and Ignatz keep simple wooden practice bows lowered; no drawn arrows or bowstring tension.",
    "Hanneman and Manuela are separate faculty examiners on separate lanes and different class/objective lanes; keep them not side by side, never as a unit, never as allied combat partners, shared sigil defenders, or side-by-side objective defenders.",
    "Visible named-only list: Claude, Hilda, Lorenz, Ignatz, Leonie.",
    "Active after this shot: Byleth, Dimitri, Dedue, Edelgard.",
    `No-active-combat after this shot: ${noActive(row).join(", ")}.`,
    "Characters listed as no-active-combat may appear later only as noncombat dialogue focus, defeated objective targets, or stood-down figures; they must not resume active fighting unless a later release shot explicitly changes their state.",
    "Captured Hubert, captured Dorothea, and captured Bernadetta must not reappear in readable form after their capture shots.",
    `Attrition note: ${note}`,
    "",
    "Battle Ledger After This Shot:",
    "All named characters alive after this shot: yes.",
    "Mock-battle defeated / removed / stood down after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela.",
    "Changed this shot: Claude: stood_down_defeated_house; Hilda: stood_down_defeated_house; Lorenz: stood_down_defeated_house; Ignatz: stood_down_defeated_house; Leonie: stood_down_defeated_house.",
    "Ledger rule: 学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。",
    "",
    "Reject If:",
    ...rejectIf.map((line) => `- ${line.replace(/\.$/, "")}.`),
    "",
    "Negative Prompt:",
    negative,
    "",
  ].join("\n");
}
function modelPrompt(row) {
  return [
    "# Shot034E Model-Ready Video Prompt",
    "",
    "Shot ID: EP02-SC09-SHOT-Shot034E-V2-20260721",
    "Duration: 6 seconds. Hold the final state for the last 0.5 seconds.",
    "",
    "Input Frames:",
    "- Use the uploaded START frame as the first-frame anchor.",
    "- Use the uploaded KEY frame as the peak action/composition reference.",
    "- Use the uploaded END frame as the final cut-out state.",
    "- Animate only the current uploaded START -> KEY -> END frame chain; do not rely on previous submissions, local paths, source folders, or external reference files.",
    "",
    "Visible readable humans:",
    "Claude, Hilda, Lorenz, Ignatz, Leonie",
    "",
    "Motion:",
    motion,
    "",
    "Camera:",
    camera,
    "",
    "Performance:",
    performance,
    "",
    "Audio:",
    audio,
    "",
    "Continuity Locks:",
    "- Only these readable humans may appear: Claude, Hilda, Lorenz, Ignatz, Leonie.",
    "- No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.",
    "- Preserve faces, costumes, house colors, training weapons, geography, and screen direction.",
    "- Nonlethal mock battle only: no blood, gore, humiliation, or lethal hits.",
    "- Hilda has exactly one rounded padded wooden training axe; reject hammer, mace, flail, ball-on-chain, spherical head, metal axe, or lethal blade.",
    "- Lorenz and Leonie each hold one blunt wooden practice lance/pole with a rounded cap; reject sharp spearhead or metal spear blade.",
    "- Claude and Ignatz keep simple wooden practice bows lowered; reject drawn arrows or bowstring tension.",
    "- Hanneman and Manuela are separate faculty examiners; never side by side, sharing one sigil, or allied partners.",
    "- Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
    "- Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
    `- No-active-combat after this shot: ${noActive(row).join(", ")}.`,
    `- Attrition note: ${note}`,
    "",
    "Attrition State After This Shot:",
    "- All named characters remain alive and safe under mock-battle rules.",
    "- Alive/safe by group: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela.",
    "- Still active or objective-controlling: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: none.",
    "- Limited but not defeated: none.",
    "- Defeated/removed: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela.",
    "- Captured/objective-defeated: black_eagles: Hubert, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie.",
    "- Stood down/post-battle: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela.",
    "- Must not return active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela.",
    "- Changed this shot: Claude: stood_down_defeated_house; Hilda: stood_down_defeated_house; Lorenz: stood_down_defeated_house; Ignatz: stood_down_defeated_house; Leonie: stood_down_defeated_house.",
    `- Note: ${note}`,
    "",
    "Reject If:",
    ...rejectIf.map((line) => `- ${line.replace(/^Reject if /, "")}`),
    "",
    "Negative Prompt:",
    negative,
    "",
  ].join("\n");
}

for (const rel of [
  "production_system/video_delivery_manifest.json",
  "production_system/scene09_v3_attrition_package/video_delivery_manifest_v3_attrition_2026-07-25.json",
  "production_system/scene09_v3_attrition_package/video_delivery_manifest_v3_attrition_2026-07-27.json",
  `${packageRoot}/package_manifest.json`,
]) {
  patchCollection(rel, "shots");
}
patchCollection("episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json", "shots");
patchCollection(`${packageRoot}/execution_plan.json`, "work_orders");

const active = readJson("production_system/video_delivery_manifest.json").shots.find((row) => row.shot === shot);
patchShot(active);

const packageManifest = fs.existsSync(abs(`${packageRoot}/package_manifest.json`))
  ? readJson(`${packageRoot}/package_manifest.json`)
  : { shots: [] };
const packageShot = (packageManifest.shots || []).find((row) => row.shot === shot);
const shotDir = packageShot?.package_dir || "shots/037_EP02-SC09-SHOT-Shot034E-V2-20260721";
const metadataRel = `${packageRoot}/${shotDir}/metadata.json`;
if (fs.existsSync(abs(metadataRel))) {
  const metadata = readJson(metadataRel);
  patchShot(metadata);
  writeJson(metadataRel, metadata);
}
for (const [source, dest] of [
  [frames.start_frame, `${packageRoot}/${shotDir}/start_frame.png`],
  [frames.key_frame, `${packageRoot}/${shotDir}/key_frame.png`],
  [frames.end_frame, `${packageRoot}/${shotDir}/end_frame.png`],
]) {
  fs.mkdirSync(path.dirname(abs(dest)), { recursive: true });
  fs.copyFileSync(abs(source), abs(dest));
}
for (const rel of [
  "production_system/scene09_v3_attrition_package/production_video_prompts/Shot034E_production_video_prompt_v3.md",
  `${packageRoot}/${shotDir}/prompt.md`,
]) {
  writeText(rel, productionPrompt(active));
}
writeText(`${packageRoot}/${shotDir}/model_prompt.md`, modelPrompt(active));
writeText(`${packageRoot}/${shotDir}/negative_prompt.md`, `${negative}\n`);

console.log(JSON.stringify({
  ok: true,
  decision: "scene09_034E_golden_deer_weapons_authoritative_applied",
  shot,
  title,
  visible_named_only: visible,
  source_frames: frames,
}, null, 2));
