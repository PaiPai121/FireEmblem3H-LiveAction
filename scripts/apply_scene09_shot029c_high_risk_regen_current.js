#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const shotDir = `${packageDir}/shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721`;
const frames = {
  start_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/high_risk_regen_2026-08-01/14B_Shot029C_claude_ashe_edelgard_start.png",
  key_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/high_risk_regen_2026-08-01/14B_Shot029C_claude_ashe_edelgard_key.png",
  end_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/high_risk_regen_2026-08-01/14B_Shot029C_claude_ashe_edelgard_end.png",
};
const title = "库罗德读出两个缺口";
const visible = ["Claude", "Ashe", "Edelgard"];
const purpose = "把金鹿搅局修成三人战术关系：库罗德读出青狮与黑鹫两条缝，亚修和艾黛尔贾特都可读且仍有体面应对。";
const audio = "Bowstring creak, target-yard wind. Claude, low: \"两条线，都露出来了。\" Ashe catches breath; Edelgard gives a sharp redirecting breath. No subtitles.";
const motion = "Claude reads two training-lane openings and angles his wooden practice bow without release or impact. Ashe checks his Blue Lions lane on one side while Edelgard redirects the Black Eagles lane on the other. The beat is Golden Deer pressure on both houses, not Claude humiliating either opponent.";
const camera = "Medium-wide three-character triangle in the archery yard. Keep Claude as the strongest foreground read while Ashe and Edelgard remain large and identifiable. Restrained settle only; no crowd reveal.";
const performance = "Claude clever and composed; Ashe alert but not defeated; Edelgard coolly recalculating. Equal competence and nonlethal classroom restraint.";
const rejectIf = [
  "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
  "Reject if anyone outside Claude, Ashe, and Edelgard is readable.",
  "Reject if Ashe or Edelgard becomes tiny, blurred, hidden, generic, wrong-age, or unreadable.",
  "Reject if Claude releases a shot, an impact is shown, or anyone is defeated in this shot.",
  "Reject if humanoid dummies, mannequin shapes, or human-like target props appear.",
  "Reject if any prop reads as a sharp lethal weapon or a dramatic injury beat.",
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
  "no humanoid dummies",
  "no mannequin shapes",
  "no human-like target props",
  "no face drift",
  "no costume drift",
  "no wrong house colors",
  "no wrong-age faces",
  "no Claude solo portrait",
  "no tiny Ashe",
  "no tiny Edelgard",
  "no release impact",
  "no defeat pose",
  "no humiliation",
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
  if (!shot || shot.shot !== "Shot029C") return false;
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
  shot.primary_check = "Claude, Ashe, and Edelgard are all readable; the shot proves Golden Deer pressure on both Blue Lions and Black Eagles.";
  shot.primary_continuity_check = "Start/key/end read as: Claude sees two openings, locks the tactical read, then holds lane pressure without release or defeat.";
  shot.reject_if = rejectIf;
  shot.negative_prompt = negative;
  shot.status = "monitor_required";
  shot.decision = "frame_regen_visual_review_passed_monitor_required_before_video";
  shot.model_notes = [
    "Visible named-only: Claude, Ashe, Edelgard.",
    "This is not a Claude solo portrait; Ashe and Edelgard must remain readable.",
    "Golden Deer pressures both Blue Lions and Black Eagles without humiliating either house.",
    "No humanoid dummies, extras, spectators, teachers, crowds, or readable silhouettes.",
  ];
  return true;
}

for (const frame of Object.values(frames)) {
  if (!fs.existsSync(full(frame))) throw new Error(`missing Shot029C regenerated frame: ${frame}`);
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

const prompt = `# Shot029C Production Video Prompt Candidate V3

Status: monitor_required

Shot ID:
EP02-SC09-Shot029C-V3-ATTRITION

Title:
${title}

Duration:
5-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
start_frame: ${frames.start_frame}
key_frame: ${frames.key_frame}
end_frame: ${frames.end_frame}

Allowed readable humans:
Claude, Ashe, Edelgard

Identity / Presence Locks:
Only these readable humans may appear: Claude, Ashe, Edelgard.
Allowed readable humans: Claude, Ashe, Edelgard.
Visible named-only list: Claude, Ashe, Edelgard.
Claude remains Golden Deer academy-age and foreground-readable.
Ashe remains Blue Lions academy-age and readable on one lane.
Edelgard remains Black Eagles academy-age and readable on the opposite lane.
No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.
No Byleth, no teachers, no unnamed students, no extras, no spectators, no soldiers, no crowds, no readable silhouettes, and no humanoid dummies.

Motion:
${motion}

Camera:
${camera}

Performance:
${performance}

Audio:
${audio}

Continuity Locks:
- Start frame: Claude sees two openings; Ashe and Edelgard are readable on separate lanes.
- Key frame: Claude locks the tactical read.
- End frame: Claude holds lane pressure without release or impact; Ashe and Edelgard adjust their next move.
- Preserve archery-yard geography, house colors, academy age, costumes, and nonlethal classroom tone.
- This shot gives Golden Deer a high point without making Blue Lions or Black Eagles incompetent.

Battle Ledger After This Shot:
- All named characters remain alive and safe under mock-battle rules.
- Visible named-only: Claude, Ashe, Edelgard.
- Changed this shot: no attrition; Golden Deer pressure now visibly affects both Blue Lions and Black Eagles.

Reject If:
${rejectIf.map((item) => `- ${item}`).join("\n")}

Negative Prompt:
${negative}
`;
writeText("production_system/scene09_v3_attrition_package/production_video_prompts/Shot029C_production_video_prompt_v3.md", prompt);
writeText(`${shotDir}/prompt.md`, prompt);
writeText(`${shotDir}/model_prompt.md`, prompt);
writeText(`${shotDir}/negative_prompt.md`, `${negative}\n`);

console.log(JSON.stringify({
  decision: "patched",
  shot: "Shot029C",
  title,
  visible_named_only: visible,
  frames,
  package_local_hashes: {
    start_frame: digest(`${shotDir}/start_frame.png`),
    key_frame: digest(`${shotDir}/key_frame.png`),
    end_frame: digest(`${shotDir}/end_frame.png`),
  },
}, null, 2));
