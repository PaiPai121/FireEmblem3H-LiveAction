#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";

const fixes = {
  Shot030B: {
    order: 18,
    shotDir: `${packageDir}/shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721`,
    title: "路线触发特写",
    purpose: "菲力克斯看见侧切路线但即将过度前压，贝雷特用手势叫停；武器必须读作单根直木制训练剑。",
    visible_named_only: ["Felix", "Byleth"],
    frames: {
      start_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/high_risk_regen_2026-08-01/18C_Shot030B_felix_straight_training_sword_start.png",
      key_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/high_risk_regen_2026-08-01/18C_Shot030B_felix_straight_training_sword_key.png",
      end_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/high_risk_regen_2026-08-01/18C_Shot030B_felix_straight_training_sword_end.png",
    },
    audio: "Cloth snap, stopped breath. Byleth, low and clipped: \"停。\" Felix exhales through his nose and does not answer.",
    motion: "Tight tactical blocking insert. Felix begins to overextend into a tempting side route with one single straight blunt wooden training sword, then Byleth stops him with a precise hand gesture. Felix checks his step and lowers the straight wooden sword, accepting the tactical call. No strike lands and no one is humiliated.",
    camera: "Preserve the two-character left-right formation-yard composition. Use a restrained push or settle only; do not spin, cross screen direction, or reveal extra fighters.",
    performance: "Felix tense, focused, and impatient but controlled; Byleth calm and procedural. The beat is tactical restraint, not a duel victory.",
    primary_check: "Felix holds exactly one straight blunt wooden training sword through start/key/end; no chain blade, segmented blade, sharp metal sword, relic, or whip sword.",
  },
};

function full(file) {
  return path.join(root, file);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(full(file), "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(full(file)), { recursive: true });
  fs.writeFileSync(full(file), `${JSON.stringify(value, null, 2)}\n`);
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

function frameSet(frames) {
  return {
    start: frames.start_frame,
    key: frames.key_frame,
    end: frames.end_frame,
    start_frame: frames.start_frame,
    key_frame: frames.key_frame,
    end_frame: frames.end_frame,
  };
}

function rejectIf() {
  return [
    "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
    "Reject if anyone outside Felix and Byleth appears.",
    "Reject if Felix's weapon reads as a chain blade, segmented blade, whip sword, metal edge, glowing relic, sharp sword, or Sword of the Creator.",
    "Reject if Felix attacks through Byleth's stop order or if a hit lands.",
    "Reject if any face, age, costume, house color, or weapon changes from the approved references.",
    "Reject if the action becomes lethal, bloody, humiliating, or unrelated to the start/key/end chain.",
    "Reject if camera spin, line crossing, or a new establishing shot hides the intended action peak.",
  ];
}

function negativePrompt() {
  return [
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
  ].join(", ");
}

function patchShot(shot, spec) {
  if (!shot || shot.shot !== "Shot030B") return false;
  const fspec = spec.frames;
  shot.title = spec.title;
  shot.titleZh = spec.title;
  shot.purpose = spec.purpose;
  shot.visible_named_only = spec.visible_named_only;
  shot.characters = spec.visible_named_only.map((name) => ({ name }));
  shot.start_frame = fspec.start_frame;
  shot.key_frame = fspec.key_frame;
  shot.end_frame = fspec.end_frame;
  shot.source_frames = frameSet(fspec);
  shot.frames = frameSet(fspec);
  shot.input_frames = {
    start_frame: fspec.start_frame,
    key_frame: fspec.key_frame,
    end_frame: fspec.end_frame,
  };
  shot.motion = spec.motion;
  shot.video_prompt = spec.motion;
  shot.camera = spec.camera;
  shot.performance = spec.performance;
  shot.dialogue_audio = spec.audio;
  shot.audio_anchor = spec.audio;
  shot.primary_check = spec.primary_check;
  shot.primary_continuity_check = `${spec.primary_check} Start/key/end must read as: overextend, stopped, lowers sword.`;
  shot.reject_if = rejectIf();
  shot.negative_prompt = negativePrompt();
  shot.model_notes = [
    "Visible named-only: Felix, Byleth.",
    "Felix weapon lock: exactly one straight blunt wooden training sword.",
    "No chain blade, segmented blade, whip sword, metal edge, glowing relic, or Sword of the Creator.",
    "No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.",
  ];
  shot.status = "monitor_required";
  shot.decision = "frame_regen_visual_review_passed_monitor_required_before_video";
  return true;
}

function promptFor(spec) {
  const r = rejectIf();
  const n = negativePrompt();
  return `# Shot030B Production Video Prompt Candidate V3

Status: monitor_required

Shot ID:
EP02-SC09-Shot030B-V3-ATTRITION

Title:
${spec.title}

Duration:
4-6 seconds. Hold the final state for the last 0.5 seconds for edit clarity.

Input Frames:
start_frame: ${spec.frames.start_frame}
key_frame: ${spec.frames.key_frame}
end_frame: ${spec.frames.end_frame}
end_frame_status: dedicated_end_frame_exists

Allowed readable humans:
Felix, Byleth

Identity / Presence Locks:
Only these readable humans may appear: Felix, Byleth.
Allowed readable humans: Felix, Byleth.
Visible named-only list: Felix, Byleth.
Felix remains academy-age with black academy uniform, white sleeves, gold trim, and tied dark hair.
Byleth remains professor Byleth with teal hair, black layered teacher outfit, and calm command posture.
No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.

Weapon Lock:
Felix carries exactly one straight blunt wooden training sword in every frame.
The sword is plain wood, straight, nonlethal, and not segmented.
No chain blade, segmented blade, whip sword, metal edge, sharp point, glowing relic, or Sword of the Creator.

Motion:
${spec.motion}

Camera:
${spec.camera}

Performance:
${spec.performance}

Audio:
${spec.audio}

Continuity Locks:
- Start frame: Felix commits toward the side route, sword low and ready.
- Key frame: Byleth stops Felix with a precise hand gesture.
- End frame: Felix lowers the straight wooden sword and accepts the call.
- Keep Garreg Mach mock-battle geography, academy age, house costumes, training weapons, and nonlethal classroom tone.
- No captured or stood-down character reappears in readable form.

Battle Ledger After This Shot:
- All named characters remain alive and safe under mock-battle rules.
- Visible named-only: Felix, Byleth.
- Changed this shot: no attrition change; Felix is checked before overextension and remains active for now.
- Ledger rule: 学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。

Reject If:
${r.map((item) => `- ${item}`).join("\n")}

Negative Prompt:
${n}
`;
}

for (const [shot, spec] of Object.entries(fixes)) {
  for (const frame of Object.values(spec.frames)) {
    if (!fs.existsSync(full(frame))) throw new Error(`${shot} missing regenerated frame: ${frame}`);
  }
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
  for (const shot of list) {
    const spec = fixes[shot.shot];
    if (spec) changed = patchShot(shot, spec) || changed;
  }
  if (changed) writeJson(file, data);
}

for (const [shot, spec] of Object.entries(fixes)) {
  const metadataPath = `${spec.shotDir}/metadata.json`;
  if (fs.existsSync(full(metadataPath))) {
    const metadata = readJson(metadataPath);
    patchShot(metadata, spec);
    writeJson(metadataPath, metadata);
  }
  fs.copyFileSync(full(spec.frames.start_frame), full(`${spec.shotDir}/start_frame.png`));
  fs.copyFileSync(full(spec.frames.key_frame), full(`${spec.shotDir}/key_frame.png`));
  fs.copyFileSync(full(spec.frames.end_frame), full(`${spec.shotDir}/end_frame.png`));
  const prompt = promptFor(spec);
  writeText(`production_system/scene09_v3_attrition_package/production_video_prompts/${shot}_production_video_prompt_v3.md`, prompt);
  writeText(`${spec.shotDir}/prompt.md`, prompt);
  writeText(`${spec.shotDir}/model_prompt.md`, prompt);
  writeText(`${spec.shotDir}/negative_prompt.md`, `${negativePrompt()}\n`);
}

console.log(JSON.stringify({
  decision: "patched",
  shots: Object.fromEntries(Object.entries(fixes).map(([shot, spec]) => [
    shot,
    {
      title: spec.title,
      visible_named_only: spec.visible_named_only,
      frames: spec.frames,
      package_local_hashes: {
        start_frame: digest(`${spec.shotDir}/start_frame.png`),
        key_frame: digest(`${spec.shotDir}/key_frame.png`),
        end_frame: digest(`${spec.shotDir}/end_frame.png`),
      },
    },
  ])),
}, null, 2));
