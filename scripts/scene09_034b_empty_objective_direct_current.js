#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const frameBase = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-25";
const frames = {
  start_frame: `${frameBase}/34D_Shot034B_empty_objective_start.png`,
  key_frame: `${frameBase}/34D_Shot034B_empty_objective_key.png`,
  end_frame: `${frameBase}/34D_Shot034B_empty_objective_end.png`,
};
const packageDir = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const shotDir = `${packageDir}/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721`;
const promptPath = "production_system/scene09_v3_attrition_package/production_video_prompts/Shot034B_production_video_prompt_v3.md";
const title = "空教师目标裁定";
const visible = ["Byleth", "Dimitri"];
const audio = "Whistle tail. Byleth: \"判定，青狮守住。\" Dimitri tired breath. No Hanneman voice and no Manuela voice in this shot.";
const motion = "Empty faculty objective ruling. Byleth and Dimitri reach two separated faculty objective markers after the three-house melee; both markers are empty because the teacher lanes have already been cut. Dimitri lowers his blunt wooden training lance under Byleth's nonlethal ruling gesture, exhausted but controlled. Hanneman and Manuela stay absent, offscreen, silent, and never paired.";
const camera = "Restrained medium-wide settle on two empty objective markers. Keep Byleth and Dimitri readable in the foreground, both facing the markers rather than posing toward camera. No teacher lane crossing and no readable background people.";
const performance = "Byleth clipped and procedural; Dimitri drained but upright, breathing hard, with no victory flourish. The win reads as a narrow classroom ruling, not domination of another class.";
const purpose = "青狮不是击倒老师，而是在混战后占住空置目标点，由贝雷特裁定险胜。";
const primaryCheck = "Only Byleth and Dimitri are readable; two far-separated faculty objective markers are empty; Hanneman and Manuela are absent/offscreen/silent/unpaired.";
const noteCn = "Shot034B 之后：全员安全存活；贝雷特与帝弥托利只裁定两个空置教师目标点；汉尼曼和玛努艾拉均已在画外/路线裁定中退场，缺席、静默、不并肩，后续不可再主动战斗。";
const screenDirection = "Byleth and Dimitri face two empty faculty objective markers, not Hanneman, Manuela, or the camera; no teacher lane crossing.";
const startKeyAssociation = "start establishes Byleth and Dimitri approaching two empty faculty objective markers; keyframe advances to Byleth's nonlethal ruling and Dimitri lowering the training lance.";
const riskNotes = "Must keep both faculty objective markers empty and readable; no Hanneman, no Manuela, no teacher leaving action, no judge podium, no arena, no readable background people.";
const characterReferenceAssets = [
  {
    name: "Byleth",
    phase: "professor",
    asset: "assets/characters/protagonist/Byleth/professor/selected.png",
    continuity_note: "quiet professor-command presence, clipped nonlethal ruling gesture, no heroic pose",
  },
  {
    name: "Dimitri",
    phase: "academy",
    asset: "assets/characters/blue_lions/Dimitri/academy/selected.png",
    continuity_note: "academy Blue Lions leader, blunt wooden training lance lowered, exhausted but controlled",
  },
];
const noActive = [
  "Felix",
  "Ashe",
  "Annette",
  "Mercedes",
  "Sylvain",
  "Ingrid",
  "Hubert",
  "Ferdinand",
  "Dorothea",
  "Bernadetta",
  "Hanneman",
  "Manuela",
];
const rejectIf = [
  "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
  "Reject if anyone outside Byleth and Dimitri appears.",
  "Two far-separated faculty objective markers must be empty.",
  "Reject if Hanneman appears in any readable form.",
  "Reject if Manuela appears in any readable form.",
  "Reject if any teacher stands on a marker, speaks, or reads as a combat partner.",
  "Reject if Hanneman and Manuela share the same platform, lane, sigil, eyeline pairing, or allied blocking.",
  "Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
  "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
];
const negative = [
  "no extra people",
  "no unnamed students",
  "no spectators",
  "no crowds",
  "no readable silhouettes",
  "no Hanneman",
  "no Manuela",
  "no teachers visible",
  "no paired teachers",
  "no second teacher",
  "no teacher duo pose",
  "no shared teacher sigil",
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
  "no readable return of Hanneman",
  "no active return of Hanneman",
  "no readable return of Manuela",
  "no active return of Manuela",
  "no uncaptured return of Hubert",
  "no uncaptured return of Dorothea",
  "no uncaptured return of Bernadetta",
  "no uncaptured return of Hanneman",
  "no uncaptured return of Manuela",
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
].join(", ");

function full(file) {
  return path.join(root, file);
}
function readJson(file) {
  return JSON.parse(fs.readFileSync(full(file), "utf8"));
}
function writeJson(file, data) {
  fs.mkdirSync(path.dirname(full(file)), { recursive: true });
  fs.writeFileSync(full(file), `${JSON.stringify(data, null, 2)}\n`);
}
function writeText(file, text) {
  fs.mkdirSync(path.dirname(full(file)), { recursive: true });
  fs.writeFileSync(full(file), text);
}
function digest(file) {
  const data = fs.readFileSync(full(file));
  return {
    bytes: data.length,
    sha256: crypto.createHash("sha256").update(data).digest("hex"),
  };
}
function frameSet() {
  return {
    start: frames.start_frame,
    key: frames.key_frame,
    end: frames.end_frame,
    start_frame: frames.start_frame,
    key_frame: frames.key_frame,
    end_frame: frames.end_frame,
  };
}
function patchNestedShot034BNotes(value) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach(patchNestedShot034BNotes);
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === "note_cn") value[key] = noteCn;
    else if (key === "screen_direction") value[key] = screenDirection;
    else if (child && typeof child === "object") patchNestedShot034BNotes(child);
  }
}
function patchShot(shot) {
  if (!shot || shot.shot !== "Shot034B") return false;
  const previousState = shot.battle_state_after || {};
  patchNestedShot034BNotes(shot);
  shot.title = title;
  shot.titleZh = title;
  shot.visible_named_only = visible;
  shot.characters = visible.map((name) => ({ name }));
  shot.purpose = purpose;
  shot.start_frame = frames.start_frame;
  shot.key_frame = frames.key_frame;
  shot.end_frame = frames.end_frame;
  shot.source_frames = frameSet();
  shot.frames = frameSet();
  shot.input_frames = {
    start_frame: frames.start_frame,
    key_frame: frames.key_frame,
    end_frame: frames.end_frame,
  };
  shot.motion = motion;
  shot.video_prompt = motion;
  shot.camera = camera;
  shot.performance = performance;
  shot.dialogue_audio = audio;
  shot.audio_anchor = audio;
  shot.screenDirectionRule = screenDirection;
  shot.screen_direction = screenDirection;
  shot.startKeyAssociation = startKeyAssociation;
  shot.riskNotes = riskNotes;
  shot.characterReferenceAssets = characterReferenceAssets;
  shot.primary_check = primaryCheck;
  shot.primary_continuity_check = primaryCheck;
  shot.reject_if = rejectIf;
  shot.negative_prompt = negative;
  shot.teacher_objective_contract = {
    visible_named_only: visible,
    hanneman: "absent_offscreen_silent_unpaired",
    manuela: "absent_offscreen_silent_unpaired",
    objective_markers: "two far-separated faculty objective markers remain empty",
  };
  shot.model_notes = [
    "Visible named-only: Byleth, Dimitri.",
    "Two far-separated faculty objective markers must be empty.",
    "Hanneman and Manuela are absent/offscreen/silent/unpaired.",
    "No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.",
  ];
  shot.battle_state_after = {
    ...previousState,
    shot: "Shot034B",
    visible_named_only: visible,
    note: "Shot034B: Byleth and Dimitri resolve two empty faculty objective markers; Hanneman and Manuela are absent/offscreen/silent and never paired.",
    note_cn: noteCn,
    result: "Blue Lions hold the objective by a narrow nonlethal ruling after Golden Deer and Black Eagles pressure each other.",
    changed_this_shot: {
      Byleth: "ruling_confirms_objective_control",
      Dimitri: "surviving_winner",
      Hanneman: "absent_objective_already_cut",
      Manuela: "absent_objective_already_cut",
    },
  };
  patchNestedShot034BNotes(shot.battle_state_after);
  shot.note = shot.battle_state_after.note;
  shot.battle_state_note = shot.battle_state_after.note;
  shot.after_shot_note = shot.battle_state_after.note;
  shot.after_shot_note_cn = noteCn;
  shot.visible_but_no_active_combat_after = [];
  return true;
}

for (const frame of Object.values(frames)) {
  if (!fs.existsSync(full(frame))) throw new Error(`missing empty-objective frame: ${frame}`);
}

for (const file of [
  "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json",
  "production_system/video_delivery_manifest.json",
  `${packageDir}/package_manifest.json`,
  `${packageDir}/execution_plan.json`,
]) {
  if (!fs.existsSync(full(file))) continue;
  const data = readJson(file);
  const list = Array.isArray(data) ? data : data.shots;
  if (!Array.isArray(list)) continue;
  let changed = false;
  for (const shot of list) changed = patchShot(shot) || changed;
  if (changed) writeJson(file, data);
}

const metadataPath = `${shotDir}/metadata.json`;
if (fs.existsSync(full(metadataPath))) {
  const metadata = readJson(metadataPath);
  patchShot(metadata);
  writeJson(metadataPath, metadata);
}

fs.copyFileSync(full(frames.start_frame), full(`${shotDir}/start_frame.png`));
fs.copyFileSync(full(frames.key_frame), full(`${shotDir}/key_frame.png`));
fs.copyFileSync(full(frames.end_frame), full(`${shotDir}/end_frame.png`));

const attritionSection = `Attrition State After This Shot:
- All named characters remain alive and safe under mock-battle rules.
- Alive/safe by group: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela.
- Visible but no active combat after: none.
- Still active or objective-controlling: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie.
- Limited but not defeated: black_eagles: Edelgard; golden_deer: Hilda.
- Defeated/removed: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela.
- Captured/objective-defeated: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela.
- Stood down/post-battle: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela.
- Must not return active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela.
- Changed this shot: Byleth confirms the classroom ruling; Dimitri becomes the surviving winner; Hanneman and Manuela remain absent/offscreen/silent/unpaired.
- Note: ${purpose}`;

const modelPrompt = `# Shot034B Production Video Prompt Candidate V3

Status: monitor_required

Shot ID:
EP02-SC09-Shot034B-V3-ATTRITION

Title:
${title}

Duration:
6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only the current uploaded START -> KEY -> END frame chain; do not rely on previous submissions, local paths, source folders, or external reference files.

Allowed readable humans:
Byleth, Dimitri

Visible readable humans:
Byleth, Dimitri

Identity / Presence Locks:
Allowed readable humans: Byleth, Dimitri.
Visible named-only list: Byleth, Dimitri.
Two far-separated faculty objective markers must be empty.
Hanneman and Manuela are absent, offscreen, silent, and unpaired.
No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.

Motion:
${motion}

Camera:
${camera}

Performance:
${performance}

Audio:
${audio}

Continuity Locks:
- No-active-combat after this shot: ${noActive.join(", ")}.
- Visible But No Active Combat After: none.
- Only these readable humans may appear: Byleth, Dimitri.
- Two far-separated faculty objective markers remain empty.
- Preserve faces, costumes, house colors, training weapons, geography, and screen direction.
- Nonlethal mock battle only: no blood, gore, humiliation, or lethal hits.
- Hanneman and Manuela are separate faculty examiners; never side by side, sharing one sigil, or allied partners.
- Hanneman and Manuela are separate faculty examiners but are absent from this shot.
- Hubert remains captured by Felix and Ashe.
- Dorothea and Bernadetta remain captured by Leonie and Claude.
- Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.
- Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.

${attritionSection}

Reject If:
${rejectIf.map((item) => `- ${item}`).join("\n")}

Negative Prompt:
${negative}
`;
const auditPrompt = modelPrompt.replace("Attrition State After This Shot:", "Battle Ledger After This Shot:");
writeText(promptPath, auditPrompt);
writeText(`${shotDir}/prompt.md`, auditPrompt);
writeText(`${shotDir}/model_prompt.md`, modelPrompt);
writeText(`${shotDir}/negative_prompt.md`, `${negative}\n`);

console.log(JSON.stringify({
  decision: "empty_objective_contract_applied",
  shot: "Shot034B",
  title,
  visible_named_only: visible,
  frames,
  package_local_hashes: {
    start_frame: digest(`${shotDir}/start_frame.png`),
    key_frame: digest(`${shotDir}/key_frame.png`),
    end_frame: digest(`${shotDir}/end_frame.png`),
  },
}, null, 2));
