#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const shotDir = `${packageDir}/shots/001_EP02-SC09-SHOT-Shot025-V2-20260721`;
const frames = {
  start_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/high_risk_regen_2026-08-01/01B_Shot025_three_leaders_rules_start.png",
  key_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/high_risk_regen_2026-08-01/01B_Shot025_three_leaders_rules_key.png",
  end_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/high_risk_regen_2026-08-01/01B_Shot025_three_leaders_rules_end.png",
};
const title = "规则与目标确立";
const visible = ["Dimitri", "Edelgard", "Claude"];
const purpose = "用三位级长近景确立学级模拟战规则与目标，让三学级从开场就读作势均力敌。";
const audio = "Training field wind, distant class whistle. Byleth offscreen: \"目标明确。三方按规则推进。\" No subtitles.";
const motion = "Three house leaders absorb the mock-battle objective, exchange tactical looks over neutral markers, then separate their eyelines toward their own lanes. Dimitri, Edelgard, and Claude all remain composed and capable; no one is diminished or treated as already losing.";
const camera = "Medium-wide triangular leadership composition around neutral objective markers; restrained settle only, no camera spin and no crowd reveal.";
const performance = "Dimitri restrained and focused; Edelgard cool and analytical; Claude observant and amused but serious. Equal respect and tension.";
const rejectIf = [
  "Reject if any extra readable human, unnamed student, teacher, soldier, spectator, crowd, or silhouette appears.",
  "Reject if anyone outside Dimitri, Edelgard, and Claude is readable.",
  "Reject if any leader is hidden, tiny, cropped beyond recognition, aged up, or visually humiliated.",
  "Reject if the composition reads as one house dominating the others.",
  "Reject if house colors, faces, hair colors, or academy uniforms drift.",
  "Reject if the beat becomes lethal combat, blood, gore, or a victory pose.",
  "Reject if subtitles, captions, UI, watermark, or visible text appears.",
];
const negative = [
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
  "no wrong house colors",
  "no wrong-age faces",
  "no domination pose",
  "no humiliation",
  "no lethal combat",
  "no blood",
  "no gore",
  "no text",
  "no subtitles",
  "no captions",
  "no visible text",
  "no watermark",
  "no camera spin",
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
function patchShot(shot) {
  if (!shot || shot.shot !== "Shot025") return false;
  shot.title = title;
  shot.titleZh = title;
  shot.purpose = purpose;
  shot.visible_named_only = visible;
  shot.characters = visible.map((name) => ({ name }));
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
  shot.primary_check = "Dimitri, Edelgard, and Claude are all readable in a balanced three-way rules/objective beat.";
  shot.primary_continuity_check = "Start/key/end read as: objective absorbed, three leaders read each other, leaders turn to separate lanes.";
  shot.reject_if = rejectIf;
  shot.negative_prompt = negative;
  shot.status = "monitor_required";
  shot.decision = "frame_regen_visual_review_passed_monitor_required_before_video";
  shot.model_notes = [
    "Visible named-only: Dimitri, Edelgard, Claude.",
    "Three-house balance: no leader or house is diminished.",
    "No unnamed students, extras, spectators, soldiers, teachers, crowds, or readable silhouettes.",
  ];
  return true;
}

for (const frame of Object.values(frames)) {
  if (!fs.existsSync(full(frame))) throw new Error(`missing Shot025 regenerated frame: ${frame}`);
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

const prompt = `# Shot025 Production Video Prompt Candidate V3

Status: monitor_required

Shot ID:
EP02-SC09-Shot025-V3-ATTRITION

Title:
${title}

Duration:
5-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
start_frame: ${frames.start_frame}
key_frame: ${frames.key_frame}
end_frame: ${frames.end_frame}

Allowed readable humans:
Dimitri, Edelgard, Claude

Identity / Presence Locks:
Only these readable humans may appear: Dimitri, Edelgard, Claude.
Allowed readable humans: Dimitri, Edelgard, Claude.
Visible named-only list: Dimitri, Edelgard, Claude.
All three are academy-age house leaders in their correct house colors and academy outfits.
No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.
No Byleth, no teachers, no unnamed students, no extras, no spectators, no soldiers, no crowds, and no readable silhouettes.

Motion:
${motion}

Camera:
${camera}

Performance:
${performance}

Audio:
${audio}

Continuity Locks:
- Start frame: three leaders look down toward neutral objective markers.
- Key frame: three leaders exchange tactical looks over the marked field.
- End frame: the leaders turn attention toward separate lanes, beginning the fair three-way contest.
- Preserve mock-battle geography, house colors, academy age, costumes, and nonlethal classroom tone.
- No house is mocked, dominated, or framed as incompetent.

Battle Ledger After This Shot:
- All named characters remain alive and safe under mock-battle rules.
- Visible named-only: Dimitri, Edelgard, Claude.
- Changed this shot: no attrition; rules and objective are established.

Reject If:
${rejectIf.map((item) => `- ${item}`).join("\n")}

Negative Prompt:
${negative}
`;
writeText("production_system/scene09_v3_attrition_package/production_video_prompts/Shot025_production_video_prompt_v3.md", prompt);
writeText(`${shotDir}/prompt.md`, prompt);
writeText(`${shotDir}/model_prompt.md`, prompt);
writeText(`${shotDir}/negative_prompt.md`, `${negative}\n`);

console.log(JSON.stringify({
  decision: "patched",
  shot: "Shot025",
  title,
  visible_named_only: visible,
  frames,
  package_local_hashes: {
    start_frame: digest(`${shotDir}/start_frame.png`),
    key_frame: digest(`${shotDir}/key_frame.png`),
    end_frame: digest(`${shotDir}/end_frame.png`),
  },
}, null, 2));
