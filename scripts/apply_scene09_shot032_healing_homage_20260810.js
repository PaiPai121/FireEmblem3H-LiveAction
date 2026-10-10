#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const packageDir = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const shotDir = `${packageDir}/shots/022_EP02-SC09-SHOT-Shot032-V2-20260721`;
const sourceDir = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/healer_tank_homage_2026-08-10";
const frames = {
  start_frame: `${sourceDir}/22C_Shot032_healer_tank_homage_start.png`,
  key_frame: `${sourceDir}/22C_Shot032_healer_tank_homage_key.png`,
  end_frame: `${sourceDir}/22C_Shot032_healer_tank_homage_end.png`,
};
const title = "杜笃与梅尔塞德斯重建盾线";
const visible = ["Dedue", "Mercedes"];
const primaryCheck = [
  "Visible named-only: Dedue, Mercedes.",
  "Healer-tank homage beat now reads as pressure, intervention, and restored shield line: Dedue starts low and hurt under an offscreen practice strike, Mercedes drives a short white-gold heal into his shield arm, and Dedue ends in a recovered but still-low shield-wall stance while Mercedes is spent.",
  "Reject if the shot becomes a calm standing portrait, a side-by-side lineup, or a generic healing glow with no physical recovery.",
].join(" ");
const purpose = "把用户指定的治疗镜头语法落到学籍模拟战：杜笃吃压受伤但不血腥，梅尔塞德斯用一次短促治疗把他的盾线救回来，她因此退到非主动战斗状态。";
const motion = [
  "Begin on Dedue already knocked into a low defensive crouch, one knee near the ground, shield scraping dust as he absorbs an offscreen nonlethal practice strike from screen right.",
  "Mercedes closes in behind-left, drops to a kneel, and extends both open hands toward Dedue's shoulder and shield arm.",
  "A short warm white-gold healing pulse travels from her hands around his shoulder, sleeve, forearm, and shield rim; the pulse visibly helps him push up from the knee.",
  "End with Dedue recovered into a low shield-wall stance, shield still pointed screen right toward the threat; Mercedes remains behind-left, lower and visibly exhausted, hands dropping after the spent heal.",
].join(" ");
const camera = "Low side three-quarter camera at training-yard ground level. Keep Dedue foreground right facing screen right, Mercedes behind-left and active, with a strong diagonal from her hands to his shield arm. Controlled push-in only; no camera spin, no line crossing, no new establishing shot.";
const performance = "Dedue is strained, disciplined, and protective rather than triumphant. Mercedes is worried, focused, and physically spent by the heal. Neither character looks into camera.";
const audio = "Dimitri, offscreen: \"杜笃--\" Dedue, under strain: \"殿下，看前面。\" Mercedes, close and urgent: \"肩膀还能动吗？我来撑住。\" Shield scrape, dust hit, one short white-magic swell, then Dedue plants the shield with a dull thud.";
const rejectIf = [
  "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
  "Reject if Dedue is standing calmly at the start instead of visibly low, hurt, and bracing against screen-right pressure.",
  "Reject if Mercedes only poses or prays without directing a short healing pulse into Dedue's shoulder/shield arm.",
  "Reject if the keyframe does not show the healing causing Dedue's physical recovery.",
  "Reject if the end frame becomes a relaxed portrait, a side-by-side lineup, or a victory pose.",
  "Reject if either character faces the camera while the threat remains screen right.",
  "Reject if any face, age, costume, house color, or shield shape changes from the input frames and named references.",
  "Reject if the action becomes lethal, bloody, humiliating, or unrelated to the start/key/end chain.",
  "Reject if any Warcraft/orc/green-skin/priest-robe/foreign-armor design leaks into the frame.",
  "Reject if subtitles, captions, UI, watermark, visible text, black borders, rounded frame, or split panels appear.",
];
const negative = [
  "no extra people",
  "no unnamed students",
  "no spectators",
  "no soldiers",
  "no crowds",
  "no readable silhouettes",
  "no standing portrait",
  "no calm lineup",
  "no side-by-side pose",
  "no fashion photo",
  "no camera-facing combat pose",
  "no missing offscreen pressure",
  "no generic healing pose",
  "no saintly hovering pose",
  "no prayer-only pose",
  "no giant spell circle",
  "no blue lightning",
  "no green magic",
  "no Warcraft armor",
  "no orc",
  "no green skin",
  "no priest robe redesign",
  "no face drift",
  "no wrong-age faces",
  "no costume drift",
  "no shield drift",
  "no weapon drift",
  "no lethal hit",
  "no blood",
  "no gore",
  "no text",
  "no subtitles",
  "no captions",
  "no watermark",
  "no black border",
  "no split panel",
  "no camera spin",
  "no screen-direction reversal",
  "no paired Hanneman and Manuela",
  "no readable Hanneman",
  "no readable Manuela",
  "no renewed attack by Mercedes",
  "no active-combat reset for Mercedes",
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
  if (!shot || shot.shot !== "Shot032") return false;
  shot.title = title;
  shot.titleZh = title;
  shot.purpose = purpose;
  shot.visible_named_only = visible;
  shot.characters = [
    {
      name: "Dedue",
      asset: "assets/characters/blue_lions/Dedue/academy/selected.png",
      weapon_lock: "large Blue Lions shield, defensive body line, academy uniform",
    },
    {
      name: "Mercedes",
      asset: "assets/characters/blue_lions/Mercedes/academy/selected.png",
      weapon_lock: "empty hands, short white-gold healing light, academy cleric cape",
    },
  ];
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
  shot.primary_check = primaryCheck;
  shot.primary_continuity_check = "Start/key/end read as: Dedue low under screen-right pressure, Mercedes' pulse visibly restores his shield arm, Dedue ends as the recovered low shield anchor while Mercedes has stood down.";
  shot.reject_if = rejectIf;
  shot.negative_prompt = negative;
  shot.status = "monitor_required";
  shot.decision = "frame_regen_visual_review_passed_monitor_required_before_video";
  shot.model_notes = [
    "This is a support-beat homage to a wounded frontline fighter saved by a healer; it must not copy Warcraft designs or introduce orc/priest iconography.",
    "Visible named-only: Dedue, Mercedes.",
    "The threat is offscreen screen right; both characters' bodies and eyelines must respect that direction.",
    "Do not convert this into a calm portrait or a static hero pose.",
  ];
  return true;
}

function modelPrompt() {
  return `# Shot032 Model-Ready Video Prompt

Shot ID: EP02-SC09-SHOT-Shot032-V2-20260721

Title:
${title}
Duration: 6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only the current uploaded START -> KEY -> END frame chain; do not rely on previous submissions, local paths, source folders, or external reference files.

Visible readable humans:
Dedue, Mercedes

Motion:
${motion}

Camera:
${camera}

Performance:
${performance}

Audio:
${audio}

Continuity Locks:
- Only these readable humans may appear: Dedue, Mercedes.
- No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.
- This is a support-beat homage to a classic wounded-frontliner/healer cinematic grammar, not a copy of any Warcraft character, species, costume, armor, or exact shot.
- Dedue stays foreground right, low and shield-forward, facing screen right toward the offscreen practice threat.
- Mercedes stays behind-left, kneeling or lower than Dedue, and visibly spends herself on one short heal.
- Preserve faces, academy-age appearance, Blue Lions/student costumes, shield shape, mock-battle geography, and screen direction.
- Nonlethal mock battle only: no blood, gore, humiliation, or lethal hits.
- Hanneman and Manuela are separate faculty examiners; never side by side, sharing one sigil, or allied partners.
- Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.
- Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.
- No-active-combat after this shot: Mercedes.
- Visible But No Active Combat After: Mercedes.
- Attrition note: Mercedes spends herself restoring Dedue's shield line.

Battle Ledger After This Shot:
- All named characters remain alive and safe under mock-battle rules.
- Alive/safe by group: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela.
- Visible but no active combat after: Mercedes.
- Still active or objective-controlling: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela.
- Limited but not defeated: blue_lions: Ashe, Annette; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie.
- Defeated/removed: blue_lions: Mercedes.
- Captured/objective-defeated: none.
- Stood down/post-battle: blue_lions: Mercedes.
- Must not return active: blue_lions: Mercedes.
- Changed this shot: Dedue: restored_frontline; Mercedes: spent_after_heal.
- Note: Healer-tank beat: Mercedes spends herself restoring Dedue's shield line.

Reject If:
${rejectIf.map((item) => `- ${item}`).join("\n")}

Negative Prompt:
${negative}

This is a safe, appropriate, non-graphic fictional cinematic scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`;
}

function auditReport() {
  const frameDigests = Object.fromEntries(Object.entries(frames).map(([key, file]) => [key, { path: file, ...digest(file) }]));
  const report = {
    date: "2026-08-10",
    shot: "Shot032",
    decision: "visual_review_passed_monitor_required_before_video",
    old_visual_decision: "blocked_needs_revision",
    old_visual_reasons: [
      "old start/key/end read too much like posed stills instead of injury/intervention/recovery",
      "old end frame became a calm standing portrait",
      "offscreen pressure vector was too weak for expensive video generation",
    ],
    reviewed_new_frames: frameDigests,
    visual_findings: [
      "start frame now shows Dedue low under screen-right pressure while Mercedes moves in from behind-left",
      "key frame now shows the healing pulse causing a physical recovery rather than a decorative glow",
      "end frame now keeps Dedue low and shield-forward while Mercedes is spent and no longer active",
    ],
    residual_risks: [
      "video model may exaggerate healing VFX; prompt and negative prompt now ban oversized spell circles and blue/green lightning",
      "video model may relax the end into a portrait; prompt now requires low shield-wall stance through the cut",
    ],
  };
  const md = [
    "# Shot032 Healing Homage Visual Audit",
    "",
    `Date: ${report.date}`,
    `Decision: ${report.decision}`,
    "",
    "## Old Visual Decision",
    "",
    `Old frame set: ${report.old_visual_decision}`,
    ...report.old_visual_reasons.map((item) => `- ${item}`),
    "",
    "## New Frame Findings",
    "",
    ...report.visual_findings.map((item) => `- ${item}`),
    "",
    "## Frame Evidence",
    "",
    ...Object.entries(frameDigests).map(([key, info]) => `- ${key}: \`${info.path}\` / sha256 \`${info.sha256}\``),
    "",
    "## Residual Risks",
    "",
    ...report.residual_risks.map((item) => `- ${item}`),
    "",
  ].join("\n");
  writeJson(`${packageDir}/shot032_healing_homage_visual_audit.json`, report);
  writeText(`${packageDir}/shot032_healing_homage_visual_audit.md`, md);
  writeJson("production_system/scene09_v3_attrition_package/scene09_v3_shot032_healing_homage_visual_audit_2026-08-10.json", report);
  writeText("production_system/scene09_v3_attrition_package/scene09_v3_shot032_healing_homage_visual_audit_2026-08-10.md", md);
}

function main() {
  for (const frame of Object.values(frames)) {
    if (!fs.existsSync(full(frame))) throw new Error(`missing generated Shot032 homage frame: ${frame}`);
  }

  for (const file of [
    "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json",
    "production_system/video_delivery_manifest.json",
    "production_system/scene09_v3_attrition_package/video_delivery_manifest_v3_attrition_2026-07-25.json",
    "production_system/scene09_v3_attrition_package/video_delivery_manifest_v3_attrition_2026-07-27.json",
    `${packageDir}/package_manifest.json`,
    `${packageDir}/execution_plan.json`,
  ]) {
    if (!fs.existsSync(full(file))) continue;
    const data = readJson(file);
    const list = Array.isArray(data) ? data : data.shots || data.work_orders;
    if (!Array.isArray(list)) continue;
    let changed = false;
    for (const shot of list) changed = patchShot(shot) || changed;
    if (changed) writeJson(file, data);
  }

  const metadataPath = `${shotDir}/metadata.json`;
  const metadata = readJson(metadataPath);
  patchShot(metadata);
  metadata.source_frames = frameSet();
  metadata.image_generation = {
    generated_by: "built-in image_gen",
    date: "2026-08-10",
    reference_assets: [
      "assets/characters/blue_lions/Dedue/academy/selected.png",
      "assets/characters/blue_lions/Mercedes/academy/selected.png",
    ],
    source_paths: frameSet(),
    visual_audit: "shot032_healing_homage_visual_audit.json",
  };
  writeJson(metadataPath, metadata);

  fs.copyFileSync(full(frames.start_frame), full(`${shotDir}/start_frame.png`));
  fs.copyFileSync(full(frames.key_frame), full(`${shotDir}/key_frame.png`));
  fs.copyFileSync(full(frames.end_frame), full(`${shotDir}/end_frame.png`));

  const prompt = modelPrompt();
  writeText(`${shotDir}/model_prompt.md`, prompt);
  writeText(`${shotDir}/prompt.md`, prompt.replace("Model-Ready Video Prompt", "Audit Prompt"));
  writeText(`${shotDir}/negative_prompt.md`, `${negative}\n`);
  writeText("production_system/scene09_v3_attrition_package/production_video_prompts/Shot032_production_video_prompt_v3.md", prompt.replace("Model-Ready Video Prompt", "Production Video Prompt Candidate V3"));

  auditReport();
  console.log(JSON.stringify({
    ok: true,
    shot: "Shot032",
    decision: "shot032_healing_homage_synced",
    frames,
    package_shot_dir: shotDir,
  }, null, 2));
}

main();
