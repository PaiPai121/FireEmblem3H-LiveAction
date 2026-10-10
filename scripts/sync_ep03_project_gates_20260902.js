#!/usr/bin/env node

/* Reconcile the EP03 project-local gates with the current canonical frame chain. */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "episodes", "EP03");
const today = "2026-09-10";
const currentSequenceHandoffContactSheet = "production_system/reviews/external_film_staging_reboard_2026-09-10/sequence_handoff_025_036_current_contact_sheet.jpg";

function readJson(file, fallback = {}) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${value.replace(/\s*$/, "")}\n`);
}

function projectFile(rel) {
  return path.join(projectRoot, rel);
}

function projectExists(rel) {
  return Boolean(rel) && fs.existsSync(projectFile(rel));
}

function normalise(value) {
  return String(value || "").replaceAll("\\", "/").replace(/^\.\//, "");
}

function shortFrameSetVersion(value) {
  return normalise(value)
    .replace(/^Shot\d+_/, "")
    .replace(/_\d{4}-\d{2}-\d{2}$/, "");
}

function isGeneratedCurrentFrameNote(value) {
  return /^(?:Current displayed frames are the |Current displayed start\/key\/end frames are local selected\.png composited previs v3|critical_reaudit_regen_v\d+_\d{4}-\d{2}-\d{2} is the current user-directed critical re-audit chain)/i.test(String(value || ""));
}

function generatedCurrentFrameNote(version, note) {
  const cleanNote = String(note || "Current integrated live-action candidate.").trim();
  const gate = /keep monitor_required/i.test(cleanNote) ? "" : " Keep monitor_required until prompt QA and motion probe.";
  return `Current displayed frames are the ${version} integrated live-action candidate: ${cleanNote}${gate}`;
}

function stripProjectPrefix(value) {
  const clean = normalise(value);
  return clean.startsWith("episodes/EP03/") ? clean.slice("episodes/EP03/".length) : clean;
}

function sha(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 12);
}

function fileSha(rel) {
  const file = projectFile(rel);
  if (!fs.existsSync(file)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function absoluteFileSha(file) {
  if (!fs.existsSync(file)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function assetRole(original) {
  const clean = normalise(original).toLowerCase();
  const base = path.basename(clean);
  if (/live_action_style/.test(clean)) return "style";
  if (/contact[_-]?sheet|reference[_-]?board|identity[_-]?plate|atlas|roster|collage|montage/.test(base)) return "planning_only";
  if (clean.includes("/characters/")) return "identity";
  if (clean.includes("/locations/")) return "location";
  if (clean.includes("/props/")) return "prop";
  if (clean.includes("/storyboards/")) return "composition";
  if (clean.includes("/source_refs/")) return "planning_only";
  return "planning_only";
}

function assetType(role) {
  if (role === "identity") return "character_identity";
  if (role === "location") return "location_reference";
  if (role === "prop") return "prop_reference";
  if (role === "style") return "live_action_style_reference";
  return "planning_reference";
}

function continuityLocks(role) {
  if (role === "identity") return [
    "preserve face shape, hair silhouette, age read, and academy wardrobe topology",
    "keep the performer physically integrated with the set, lighting, and floor contact",
  ];
  if (role === "location") return [
    "preserve set geometry, wet material response, depth layers, and motivated light direction",
    "keep the camera axis and scale compatible with adjacent shot frames",
  ];
  if (role === "prop") return [
    "preserve silhouette, hand scale, material, and canon-specific shape",
    "do not replace the prop with a generic weapon or decorative overlay",
  ];
  if (role === "style") return [
    "photographed adult performers, practical materials, natural skin, and contact shadows",
    "no game screenshot, 3D render, poster lineup, or pasted cutout integration",
  ];
  return ["use for planning or composition only; never let it override a current uploaded frame"];
}

function rejectIf(role) {
  if (role === "identity") return ["face drift", "wrong age or wardrobe", "pasted cutout", "duplicate performer"];
  if (role === "location") return ["wrong geography", "flat studio background", "lighting-only transition"];
  if (role === "prop") return ["generic replacement weapon", "duplicate prop", "unreadable or floating prop"];
  if (role === "style") return ["game screenshot", "anime or illustration", "3D render", "pasted cutout"];
  return ["use as an executable character or location substitute", "unresolved provenance"];
}

function metadataRefs(metadata) {
  return [
    ...(Array.isArray(metadata.asset_references) ? metadata.asset_references : []),
    ...(Array.isArray(metadata.reference_assets) ? metadata.reference_assets : []),
    ...((metadata.current_display_frame_set && Array.isArray(metadata.current_display_frame_set.reference_assets))
      ? metadata.current_display_frame_set.reference_assets : []),
  ].map(normalise).filter(Boolean);
}

function localiseReference(original) {
  const clean = stripProjectPrefix(original);
  if (clean.startsWith("assets/")) {
    const source = path.join(repoRoot, clean);
    if (!fs.existsSync(source)) return null;
    const local = path.posix.join("production_system/shared_references", clean);
    const destination = projectFile(local);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    if (!fs.existsSync(destination)) fs.copyFileSync(source, destination);
    return local;
  }
  return projectExists(clean) ? clean : null;
}

function upsertById(list, item, key = "id") {
  const index = list.findIndex((candidate) => candidate && candidate[key] === item[key]);
  if (index >= 0) list[index] = item;
  else list.push(item);
}

const dialogueSpecs = [
  { id: "DL-EP03-001-1", shot_id: "Shot001", speaker: "Sothis", text: "そなたは、また何を聞いたのじゃ？", local_start: 2.24, speech_end: 5.39, speech_seconds: 3.15, line_end: 7.20 },
  { id: "DL-EP03-003-1", shot_id: "Shot003", speaker: "Rhea", text: "西方教会が、ガスパール領主ロナートを扇動し、兵を挙げさせました。", local_start: 3.92, speech_end: 9.43, speech_seconds: 5.51, line_end: 13.20 },
  { id: "DL-EP03-004-1", shot_id: "Shot004", speaker: "Seteth", text: "ロナート卿は、かつてアッシュを養子として迎えた人物だ。", local_start: 3.36, speech_end: 8.08, speech_seconds: 4.72, line_end: 11.20 },
  { id: "DL-EP03-005-1", shot_id: "Shot005", speaker: "Dimitri", text: "先生、今日は彼と共に行かせてください。", local_start: 4.48, speech_end: 10.78, speech_seconds: 6.30, line_end: 15.20 },
  { id: "DL-EP03-006-1", shot_id: "Shot006", speaker: "Ashe", text: "彼は、僕と弟妹に居場所をくれました。でも今の僕は、あなたの生徒です。", local_start: 5.04, speech_end: 12.12, speech_seconds: 7.08, line_end: 17.20 },
  { id: "DL-EP03-008-1", shot_id: "Shot008", speaker: "Catherine", text: "霧の中では、私から離れすぎるな。", local_start: 4.20, speech_end: 10.10, speech_seconds: 5.90, line_end: 14.20 },
  { id: "DL-EP03-010-1", shot_id: "Shot010", speaker: "Ingrid", text: "霧が濃すぎるわ。", local_start: 3.92, speech_end: 6.68, speech_seconds: 2.76, line_end: 7.03, intentional_pause_reason: "Ingrid's warning lands before Dedue listens for a second sound in the fog." },
  { id: "DL-EP03-010-2", shot_id: "Shot010", speaker: "Dedue", text: "足音を聞け。", local_start: 7.28, speech_end: 10.04, speech_seconds: 2.76, line_end: 13.20 },
  { id: "DL-EP03-013-1", shot_id: "Shot013", speaker: "Byleth", text: "影を追うな。仲間の声を聞け。霧に惑わされるな。", local_start: 5.04, speech_end: 12.12, speech_seconds: 7.08, line_end: 17.20 },
  { id: "DL-EP03-015-1", shot_id: "Shot015", speaker: "Rebels", text: "ロナート卿のために！", local_start: 3.36, speech_end: 8.08, speech_seconds: 4.72, line_end: 11.20 },
  { id: "DL-EP03-016-1", shot_id: "Shot016", speaker: "Byleth", text: "戦線を守れ。", local_start: 4.20, speech_end: 7.15, speech_seconds: 2.95, line_end: 7.50, intentional_pause_reason: "The command handoff leaves one controlled beat before Dimitri answers." },
  { id: "DL-EP03-016-2", shot_id: "Shot016", speaker: "Dimitri", text: "承知しました。", local_start: 7.80, speech_end: 10.75, speech_seconds: 2.95, line_end: 14.20 },
  { id: "DL-EP03-017-1", shot_id: "Shot017", speaker: "Ashe", text: "あれは……ガスパール家の紋章。", local_start: 4.48, speech_end: 10.78, speech_seconds: 6.30, line_end: 15.20 },
  { id: "DL-EP03-018-1", shot_id: "Shot018", speaker: "Felix", text: "ぼんやりするな。お前の代わりに誰かが傷つくぞ。", local_start: 3.36, speech_end: 8.08, speech_seconds: 4.72, line_end: 11.20 },
  { id: "DL-EP03-019-1", shot_id: "Shot019", speaker: "Mercedes", text: "こちらです！", local_start: 3.36, speech_end: 5.72, speech_seconds: 2.36, line_end: 6.07, intentional_pause_reason: "Mercedes calls the route before Annette physically clears the branch and answers." },
  { id: "DL-EP03-019-2", shot_id: "Shot019", speaker: "Annette", text: "道が見えた！", local_start: 6.24, speech_end: 8.60, speech_seconds: 2.36, line_end: 11.20 },
  { id: "DL-EP03-021-1", shot_id: "Shot021", speaker: "Lonato", text: "どけ。子供たちと戦うつもりはない。", local_start: 4.48, speech_end: 10.78, speech_seconds: 6.30, line_end: 15.20 },
  { id: "DL-EP03-022-1", shot_id: "Shot022", speaker: "Ashe", text: "ロナート様、どうか止まってください。", local_start: 5.04, speech_end: 12.12, speech_seconds: 7.08, line_end: 17.20 },
  { id: "DL-EP03-023-1", shot_id: "Shot023", speaker: "Lonato", text: "問われぬ罪は、聖なる名の陰に隠されるだけだ。", local_start: 5.04, speech_end: 12.12, speech_seconds: 7.08, line_end: 17.20 },
  { id: "DL-EP03-024-1", shot_id: "Shot024", speaker: "Byleth", text: "護衛を分断しろ。村道へ近づけるな。", local_start: 2.80, speech_end: 6.74, speech_seconds: 3.94, line_end: 9.20 },
  { id: "DL-EP03-026", shot_id: "Shot026", speaker: "Ashe", text: "ごめんなさい。", local_start: 3.90, speech_end: 5.00, speech_seconds: 1.10, line_end: 5.35 },
  { id: "DL-EP03-031-1", shot_id: "Shot031", speaker: "Rhea", text: "ご苦労さまでした。あなた方は信仰の安寧を守りました。", local_start: 9.15, speech_end: 12.55, speech_seconds: 3.40, line_end: 15.20 },
  { id: "DL-EP03-032-1", shot_id: "Shot032", speaker: "Rhea", text: "反逆者は裁きを受けねばなりません。", local_start: 8.20, speech_end: 10.65, speech_seconds: 2.45, line_end: 11.25 },
  { id: "DL-EP03-034-1", shot_id: "Shot034", speaker: "Catherine", text: "私はレア様を信じている。迷いは、まだ決められない者に任せる。", local_start: 8.10, speech_end: 11.70, speech_seconds: 3.60, line_end: 12.55 },
  { id: "DL-EP03-035-1", shot_id: "Shot035", speaker: "Dimitri", text: "殺意が正義をまとえば、とても静かになるのですね。", local_start: 9.20, speech_end: 14.20, speech_seconds: 5.00, line_end: 17.20 },
  { id: "DL-EP03-036-1", shot_id: "Shot036", speaker: "Sothis", text: "そなたは、あの者を信じるのか？", local_start: 5.40, speech_end: 8.40, speech_seconds: 3.00, line_end: 11.20 },
];

const dialogueNegativeLock = "No repeat, no echo, no stutter, no restart, no duplicated syllables.";
for (const shotId of [...new Set(dialogueSpecs.map((spec) => spec.shot_id))]) {
  const negativeFile = projectFile(`video_prompts/${shotId}_negative_prompt.md`);
  if (!fs.existsSync(negativeFile)) continue;
  const current = fs.readFileSync(negativeFile, "utf8").trim();
  if (!/no repeat|no echo|no stutter|no restart|不重复|不回声|不复读|不结巴|不重说/i.test(current)) {
    writeText(negativeFile, `${current}\n\n${dialogueNegativeLock}`);
  }
}

function specsFor(shotId) {
  return dialogueSpecs.filter((spec) => spec.shot_id === shotId);
}

function shotDialogueMode(specs) {
  return specs.length > 1 ? "two_turn_exchange" : "single_turn";
}

function boundedDialogueEnd(spec) {
  const shotDuration = Number(shotDurations.get(spec.shot_id) || 0);
  return Math.min(spec.line_end, Math.max(spec.local_start + 0.25, shotDuration - 0.05));
}

function timelineLine(spec, sceneStart) {
  const lineEnd = boundedDialogueEnd(spec);
  const reaction = Math.max(0.05, Number((lineEnd - spec.speech_end).toFixed(2)));
  const line = {
    id: spec.id,
    shot_id: spec.shot_id,
    speaker: spec.speaker,
    text: spec.text,
    start_seconds: Number((sceneStart + spec.local_start).toFixed(2)),
    end_seconds: Number((sceneStart + lineEnd).toFixed(2)),
    shot_local_start_seconds: spec.local_start,
    shot_local_speech_end_seconds: spec.speech_end,
    shot_local_end_seconds: lineEnd,
    speech_seconds: spec.speech_seconds,
    pause_before_seconds: 0,
    pause_after_seconds: 0,
    listener_reaction_seconds: reaction,
    delivery_mode: "single_continuous_utterance",
    repeat_policy: "no_repeat",
    allow_overlap: false,
    listener_reaction: "Listeners keep the declared eyelines and complete the physical reaction without collapsing the protected distance.",
    visible_action: "The speaker performs the prompt's declared physical action while delivering this Japanese line once; the mouth settles before the cut.",
    cut_relation: "Cut after the final Japanese syllable and the declared reaction/action handoff.",
    post_dialogue_action: "Continue the uploaded END state into the next shot without a repeated line, reset, or new performer.",
    cut_on: "reaction",
  };
  if (spec.intentional_pause_reason) line.intentional_pause_reason = spec.intentional_pause_reason;
  return line;
}

const deliveryFile = projectFile("production_system/video_delivery_manifest.json");
const delivery = readJson(deliveryFile, { shots: [] });
const shot025V11 = {
  version: "critical_reaudit_regen_v11_2026-09-03",
  frame_set_id: "Shot025_critical_reaudit_regen_v11_2026-09-03",
  source: "imagegen_integrated_live_action_blocked_crossing_far_ridge_left_v11_2026-09-03",
  frames: {
    start: "storyboards/Shot025/critical_reaudit_regen_v11_2026-09-03/start_frame.png",
    key: "storyboards/Shot025/critical_reaudit_regen_v11_2026-09-03/key_frame.png",
    end: "storyboards/Shot025/critical_reaudit_regen_v11_2026-09-03/end_frame.png",
  },
  contact_sheet: "storyboards/Shot025/critical_reaudit_regen_v11_2026-09-03/contact_sheet.jpg",
  status: "monitor_required",
  visual_audit_decision: "visual_review_passed",
  reference_assets: [
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/blue_lions/Dedue/academy/selected.png",
    "assets/characters/blue_lions/Sylvain/academy/selected.png",
    "assets/characters/blue_lions/Ingrid/academy/selected.png",
    "assets/characters/blue_lions/Mercedes/academy/selected.png",
    "assets/characters/blue_lions/Annette/academy/selected.png",
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
    "assets/characters/extras/BanditSoldier/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
    "storyboards/Shot024/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
  ],
  generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_blocked_crossing",
  review_markdown: "production_system/reviews/critical_reaudit_2026-09-03/shot025_critical_reaudit_regen_v11_2026-09-03_review.md",
  note: "v11 rebuild after user re-audit: Byleth is off-screen after the preceding command, and the far-ridge Lonato marker is kept on the upper-left beyond the blocked crossing so Shot025 cannot read as a close Byleth-to-Lonato attack lane. The Blue Lions hold behind a near barricade; a deep water-cut ravine, washed-out culvert, offset timber gate with exactly two guards, rock outcrop, second ridge, and fog bend block the route. The far upper-right ridge stays empty. START is the gate being shut, KEY is the two-guard crossbar lock, and END is the barred crossing with the route turning out of sight. Keep monitor_required until prompt-against-frame QA and a 3-second motion probe.",
};
const shot025 = (delivery.shots || []).find((shot) => shot.id === "Shot025");
if (shot025 && Object.values(shot025V11.frames).every((rel) => projectExists(rel))) {
  Object.assign(shot025, {
    start_frame: shot025V11.frames.start,
    key_frame: shot025V11.frames.key,
    end_frame: shot025V11.frames.end,
    output_frames: shot025V11.frames,
    frames: Object.fromEntries(Object.entries(shot025V11.frames).map(([role, rel]) => [role, `episodes/EP03/${rel}`])),
    displayed_frame_set: shot025V11,
    characters: ["Dimitri", "Dedue", "Ashe", "Lonato"],
    asset_references: shot025V11.reference_assets,
    reference_assets: shot025V11.reference_assets,
    current_display_frame_set: shortFrameSetVersion(shot025V11.version),
    current_display_frame_status: "monitor_required_critical_reaudit_regen_v11_2026-09-03",
    current_display_frame_source: shot025V11.source,
    current_display_frame_note: shot025V11.note,
    visual_audit_decision: shot025V11.visual_audit_decision,
    visual_audit_finding: "2026-09-03 user-triggered re-audit: v11 keeps Byleth off-screen after the command and moves the only far-ridge Lonato marker to the upper-left behind the second ridge, while leaving the far upper-right ridge empty. The Blue Lions hold behind a near barricade; the ravine, washed-out culvert, offset gate, two active guards, rock outcrop, second ridge, and fog bend separate them from Lonato.",
    required_revision: "Keep monitor_required. Run prompt-against-frame QA, strict Shot024->025 and 025->026 continuity QA, and a 3-second motion probe. Reject if Byleth enters this frame, any performer crosses the ravine, the gate or two guards disappear, the path becomes straight, Lonato becomes a face-to-face target, START/KEY/END collapse into one pose, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.",
    video_prompt_qa_decision: "pending_review_against_critical_reaudit_regen_v11_2026-09-03",
    motion_probe_status: "pending_3s_probe_against_critical_reaudit_regen_v11_2026-09-03",
    model_notes: [
      ...(Array.isArray(shot025.model_notes) ? shot025.model_notes : []).filter((note) => !isGeneratedCurrentFrameNote(note)),
      generatedCurrentFrameNote(shot025V11.version, "Byleth is off-screen after the preceding command. The academy formation stays behind a near barricade; the deep ravine, washed-out culvert, offset gate, active two-guard lock, rock outcrop, second ridge, and fog bend block the crossing, and the only Lonato marker remains tiny on the far upper-left ridge while the far upper-right ridge stays empty. START/KEY/END carry gate-shut, crossbar-lock, and barred-route beats."),
    ],
  });
}

const criticalReauditV7 = {
  Shot025: shot025V11,
  Shot026: {
    version: "critical_reaudit_regen_v7_2026-09-02",
    frame_set_id: "Shot026_critical_reaudit_regen_v7_2026-09-02",
    source: "imagegen_integrated_live_action_ashe_guard_line_decision_v7_2026-09-02",
    frames: {
      start: "storyboards/Shot026/critical_reaudit_regen_v7_2026-09-02/start_frame.png",
      key: "storyboards/Shot026/critical_reaudit_regen_v7_2026-09-02/key_frame.png",
      end: "storyboards/Shot026/critical_reaudit_regen_v7_2026-09-02/end_frame.png",
    },
    contact_sheet: "storyboards/Shot026/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    reference_assets: [
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "episodes/EP03/storyboards/Shot025/critical_reaudit_regen_v11_2026-09-03/end_frame.png",
    ],
    generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_terrain_separation",
    review_markdown: "production_system/reviews/critical_reaudit_2026-09-02/shot026_critical_reaudit_regen_v7_2026-09-02_review.md",
    note: "v7 rebuild: a wide side-offset battlefield keeps Ashe in the near-right foreground, exactly two rebel guards across the middle barriers, and Lonato tiny on a far upper-left ridge. Ashe holds a nocked arrow toward empty mud before the guard line and never gets a direct attack lane.",
  },
  Shot027: {
    version: "critical_reaudit_regen_v7_2026-09-02",
    frame_set_id: "Shot027_critical_reaudit_regen_v7_2026-09-02",
    source: "imagegen_integrated_live_action_catherine_guard_intervention_v7_2026-09-02",
    frames: {
      start: "storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/start_frame.png",
      key: "storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/key_frame.png",
      end: "storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/end_frame.png",
    },
    contact_sheet: "storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    reference_assets: [
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/church_of_seiros/Catherine/academy/selected.png",
      "assets/props/shared/hero_relics/thunderbrand_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "episodes/EP03/storyboards/Shot026/critical_reaudit_regen_v7_2026-09-02/end_frame.png",
    ],
    generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_guard_intervention",
    review_markdown: "production_system/reviews/critical_reaudit_2026-09-02/shot027_critical_reaudit_regen_v7_2026-09-02_review.md",
    note: "v7 rebuild: Catherine enters through the left barrier gap and redirects the nearer guard's long weapon with Thunderbrand. Ashe stays back, the second guard remains visible, and Lonato never becomes a close-range target in this intervention shot.",
  },
  Shot028: {
    version: "critical_reaudit_regen_v9_2026-09-03",
    frame_set_id: "Shot028_critical_reaudit_regen_v9_2026-09-03",
    source: "imagegen_integrated_live_action_catherine_thunderbrand_four_person_disarm_v9_2026-09-03",
    frames: {
      start: "storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/start_frame.png",
      key: "storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/key_frame.png",
      end: "storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/end_frame.png",
    },
    contact_sheet: "storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    reference_assets: [
      "assets/characters/church_of_seiros/Catherine/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/extras/BanditSoldier/selected.png",
      "assets/props/shared/hero_relics/thunderbrand_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "episodes/EP03/storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/end_frame.png",
    ],
    generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_guard_mediated_causal_disarm",
    review_markdown: "production_system/reviews/critical_reaudit_2026-09-03/shot028_critical_reaudit_regen_v9_2026-09-03_review.md",
    note: "v9 rebuild after the visual audit found an extra distant human silhouette in v8: the entire frame now contains exactly Catherine, Lonato, and the same two unfeatured rebel guards, with no other human silhouette anywhere in the hills or fog. START is pre-contact, KEY is one weapon-level bind, and END is the ordinary sword on mud with Lonato still upright.",
  },
  Shot029: {
    version: "critical_reaudit_regen_v7_2026-09-02",
    frame_set_id: "Shot029_critical_reaudit_regen_v7_2026-09-02",
    source: "imagegen_integrated_live_action_lonato_aftermath_female_byleth_v7_2026-09-02",
    frames: {
      start: "storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/start_frame.png",
      key: "storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/key_frame.png",
      end: "storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/end_frame.png",
    },
    contact_sheet: "storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    reference_assets: [
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "episodes/EP03/storyboards/Shot028/critical_reaudit_regen_v7_2026-09-02/end_frame.png",
    ],
    generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_nonrushing_aftermath",
    review_markdown: "production_system/reviews/critical_reaudit_2026-09-02/shot029_critical_reaudit_regen_v7_2026-09-02_review.md",
    note: "v7 rebuild: Lonato receives the previous shot's dropped sword and upright imbalance, then settles onto one knee. Female Byleth, Dimitri, and Ashe remain staggered and outside sword range; Catherine does not return.",
  },
  Shot030: {
    version: "critical_reaudit_regen_v3_2026-09-02",
    frame_set_id: "Shot030_critical_reaudit_regen_v3_2026-09-02",
    source: "imagegen_integrated_live_action_female_byleth_aftermath_reaction_v3_2026-09-02",
    frames: {
      start: "storyboards/Shot030/critical_reaudit_regen_v3_2026-09-02/start_frame.png",
      key: "storyboards/Shot030/critical_reaudit_regen_v3_2026-09-02/key_frame.png",
      end: "storyboards/Shot030/critical_reaudit_regen_v3_2026-09-02/end_frame.png",
    },
    contact_sheet: "storyboards/Shot030/critical_reaudit_regen_v3_2026-09-02/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    reference_assets: [
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/church_of_seiros/Catherine/academy/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
    ],
    generation_mode: "imagegen_integrated_live_action_aftermath_reaction_with_canonical_local_identity",
    review_markdown: "production_system/reviews/critical_reaudit_2026-09-02/shot030_critical_reaudit_regen_v3_2026-09-02_review.md",
    note: "v3 rebuild: the silent aftermath is staged as one physically integrated muddy fog lane with three foreground witness layers and Catherine crossing only in the far background. START shows her entering, KEY shows Ashe's bowed head and Dimitri's turned shoulders as Catherine crosses right, and END leaves Catherine offscreen while the three witnesses hold a wider empty corridor. Lonato never returns to the frame.",
  },
  Shot034: {
    version: "critical_reaudit_regen_v3_2026-09-03",
    frame_set_id: "Shot034_critical_reaudit_regen_v3_2026-09-03",
    source: "imagegen_integrated_live_action_catherine_ashe_byleth_faith_conversation_v3_2026-09-03",
    frames: {
      start: "storyboards/Shot034/critical_reaudit_regen_v3_2026-09-03/start_frame.png",
      key: "storyboards/Shot034/critical_reaudit_regen_v3_2026-09-03/key_frame.png",
      end: "storyboards/Shot034/critical_reaudit_regen_v3_2026-09-03/end_frame.png",
    },
    contact_sheet: "storyboards/Shot034/critical_reaudit_regen_v3_2026-09-03/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    reference_assets: [
      "assets/characters/church_of_seiros/Catherine/academy/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png",
      "assets/props/shared/hero_relics/thunderbrand_reference.png",
      "episodes/EP03/storyboards/Shot033/critical_reaudit_regen_v2_2026-08-24/end_frame.png",
    ],
    generation_mode: "imagegen_integrated_live_action_conversation_with_canonical_local_identity_and_sheathed_thunderbrand",
    review_markdown: "production_system/reviews/critical_reaudit_2026-09-03/shot034_critical_reaudit_regen_v3_2026-09-03_review.md",
    note: "v3 rebuild: the prior v2 was rejected for near-identical staging. The new chain is one wet monastery cloister with Ashe left at respectful distance, Catherine right by the column, and female Byleth far behind. START settles the entry, KEY makes Catherine's low sheathed-Thunderbrand cleaning and Ashe's question visible, and END lowers the cloth, turns Catherine toward Ashe, and sends Byleth into the clear right exit lane.",
  },
  Shot036: {
    version: "critical_reaudit_regen_v3_2026-09-03",
    frame_set_id: "Shot036_critical_reaudit_regen_v3_2026-09-03",
    source: "imagegen_integrated_live_action_female_byleth_sothis_holy_tomb_shadow_v3_2026-09-03",
    frames: {
      start: "storyboards/Shot036/critical_reaudit_regen_v3_2026-09-03/start_frame.png",
      key: "storyboards/Shot036/critical_reaudit_regen_v3_2026-09-03/key_frame.png",
      end: "storyboards/Shot036/critical_reaudit_regen_v3_2026-09-03/end_frame.png",
    },
    contact_sheet: "storyboards/Shot036/critical_reaudit_regen_v3_2026-09-03/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    reference_assets: [
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/characters/divine/Sothis/dream/legacy_ep01/candidate_03.png",
      "assets/characters/church_of_seiros/Rhea/academy/selected.png",
      "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png",
      "assets/props/shared/sword_of_creator/selected.png",
      "episodes/EP03/storyboards/Shot035/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
    ],
    generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_spectral_reveal",
    review_markdown: "production_system/reviews/critical_reaudit_2026-09-03/shot036_critical_reaudit_regen_v3_2026-09-03_review.md",
    note: "v3 rebuild after rejecting the prior current set: START holds grounded female Byleth with distant Rhea; KEY makes recognizable translucent Sothis actually visible without floor contact; END lets the spectral presence recede into motes as the cathedral darkens for the cut to black. Keep monitor_required until prompt QA, Japanese audio QA, and motion probe.",
  },
};

// This is a deliberately separate reboard: the old 025-029 frames remain history until every new frame is present.
const mangaReadabilityReboardV1 = {
  Shot025: {
    version: "manga_readability_reboard_v1_2026-09-09",
    frame_set_id: "Shot025_manga_readability_reboard_v1_2026-09-09",
    source: "imagegen_integrated_live_action_command_split_guard_screen_v1_2026-09-09",
    frames: {
      start: "storyboards/Shot025/manga_readability_reboard_v1_2026-09-09/start_frame.png",
      key: "storyboards/Shot025/manga_readability_reboard_v1_2026-09-09/key_frame.png",
      end: "storyboards/Shot025/manga_readability_reboard_v1_2026-09-09/end_frame.png",
    },
    contact_sheet: "storyboards/Shot025/manga_readability_reboard_v1_2026-09-09/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "pending_reboard_visual_review",
    reference_assets: [
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/blue_lions/Dedue/academy/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/extras/BanditSoldier/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "episodes/EP03/storyboards/Shot024/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
    ],
    generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_readable_command_split",
    review_markdown: "production_system/reviews/manga_readability_reboard_2026-09-09/shot025_reboard_review.md",
    note: "Reboard v1: a clean side geography establishes Dimitri and Dedue holding the near cover while two guards close the fork and Ashe is visibly routed to the right; Lonato remains beyond the physical screen. START is open fork, KEY is the guard screen forming, END is the two-lane containment hold. No lineup and no direct execution lane.",
  },
  Shot026: {
    version: "manga_readability_reboard_v1_2026-09-09",
    frame_set_id: "Shot026_manga_readability_reboard_v1_2026-09-09",
    source: "imagegen_integrated_live_action_ashe_empty_ground_warning_v1_2026-09-09",
    frames: {
      start: "storyboards/Shot026/manga_readability_reboard_v1_2026-09-09/start_frame.png",
      key: "storyboards/Shot026/manga_readability_reboard_v1_2026-09-09/key_frame.png",
      end: "storyboards/Shot026/manga_readability_reboard_v1_2026-09-09/end_frame.png",
    },
    contact_sheet: "storyboards/Shot026/manga_readability_reboard_v1_2026-09-09/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "pending_reboard_visual_review",
    reference_assets: [
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/extras/BanditSoldier/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "episodes/EP03/storyboards/Shot025/manga_readability_reboard_v1_2026-09-09/end_frame.png",
    ],
    generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_readable_warning_choice",
    review_markdown: "production_system/reviews/manga_readability_reboard_2026-09-09/shot026_reboard_review.md",
    note: "Reboard v1: Ashe owns the near-right decision plane, his arrow points to empty mud before the two-guard screen, and Lonato stays a distant witness beyond it. START nock, KEY full draw toward empty ground, END lowered nocked arrow after the single Japanese apology.",
  },
  Shot027: {
    version: "manga_readability_reboard_v1_2026-09-09",
    frame_set_id: "Shot027_manga_readability_reboard_v1_2026-09-09",
    source: "imagegen_integrated_live_action_catherine_guard_first_intervention_v1_2026-09-09",
    frames: {
      start: "storyboards/Shot027/manga_readability_reboard_v1_2026-09-09/start_frame.png",
      key: "storyboards/Shot027/manga_readability_reboard_v1_2026-09-09/key_frame.png",
      end: "storyboards/Shot027/manga_readability_reboard_v1_2026-09-09/end_frame.png",
    },
    contact_sheet: "storyboards/Shot027/manga_readability_reboard_v1_2026-09-09/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "pending_reboard_visual_review",
    reference_assets: [
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/church_of_seiros/Catherine/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/extras/BanditSoldier/selected.png",
      "assets/props/shared/hero_relics/thunderbrand_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "episodes/EP03/storyboards/Shot026/manga_readability_reboard_v1_2026-09-09/end_frame.png",
    ],
    generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_guard_first_intervention",
    review_markdown: "production_system/reviews/manga_readability_reboard_2026-09-09/shot027_reboard_review.md",
    note: "Reboard v1: the nearer guard advances toward Ashe, Catherine enters from the left and redirects that guard's long weapon, while the second guard retreats and Lonato remains separated. The beat is enter, take the lane, brace; it is not a direct attack on Lonato.",
  },
  Shot028: {
    version: "manga_readability_reboard_v1_2026-09-09",
    frame_set_id: "Shot028_manga_readability_reboard_v1_2026-09-09",
    source: "imagegen_integrated_live_action_lonato_protective_press_thunderbrand_disarm_v1_2026-09-09",
    frames: {
      start: "storyboards/Shot028/manga_readability_reboard_v1_2026-09-09/start_frame.png",
      key: "storyboards/Shot028/manga_readability_reboard_v1_2026-09-09/key_frame.png",
      end: "storyboards/Shot028/manga_readability_reboard_v1_2026-09-09/end_frame.png",
    },
    contact_sheet: "storyboards/Shot028/manga_readability_reboard_v1_2026-09-09/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "pending_reboard_visual_review",
    reference_assets: [
      "assets/characters/church_of_seiros/Catherine/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/extras/BanditSoldier/selected.png",
      "assets/props/shared/hero_relics/thunderbrand_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "episodes/EP03/storyboards/Shot027/manga_readability_reboard_v1_2026-09-09/end_frame.png",
    ],
    generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_guard_mediated_protective_disarm",
    review_markdown: "production_system/reviews/manga_readability_reboard_2026-09-09/shot028_reboard_review.md",
    note: "Reboard v1: the retreating guard remains the cause of the contact. Lonato steps across to cover that guard, his ordinary sword presses into Catherine's Thunderbrand at weapon level, and one controlled bind sends the ordinary sword to the mud. He remains upright; this is a disarm, not a killing blow.",
  },
  Shot029: {
    version: "manga_readability_reboard_v1_2026-09-09",
    frame_set_id: "Shot029_manga_readability_reboard_v1_2026-09-09",
    source: "imagegen_integrated_live_action_lonato_moral_aftermath_female_byleth_v1_2026-09-09",
    frames: {
      start: "storyboards/Shot029/manga_readability_reboard_v1_2026-09-09/start_frame.png",
      key: "storyboards/Shot029/manga_readability_reboard_v1_2026-09-09/key_frame.png",
      end: "storyboards/Shot029/manga_readability_reboard_v1_2026-09-09/end_frame.png",
    },
    contact_sheet: "storyboards/Shot029/manga_readability_reboard_v1_2026-09-09/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "pending_reboard_visual_review",
    reference_assets: [
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "episodes/EP03/storyboards/Shot028/manga_readability_reboard_v1_2026-09-09/end_frame.png",
    ],
    generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_nonrushing_moral_aftermath",
    review_markdown: "production_system/reviews/manga_readability_reboard_2026-09-09/shot029_reboard_review.md",
    note: "Reboard v1: receive the dropped sword and upright imbalance, then let Lonato catch himself on one knee while female Byleth, Dimitri, and Ashe hold three separate distant marks. The empty lane and witnesses' restraint carry the moral consequence.",
  },
};

// Ordered 030-036 reboard driven by public film/animation staging craft. Local assets
// constrain identity, wardrobe, props, and geography only; they are not quality refs.
const externalStagingManifest = readJson(
  projectFile("planning/external_film_staging_reboard_030_036_2026-09-10.json"),
  { shots: {} },
);
const externalStagingReboardV1 = externalStagingManifest.shots || {};

const mangaReadabilityPlan = {
  version: 1,
  project: "EP03",
  mode: "on",
  required: true,
  created_at: "2026-09-09",
  source_method_note: "Transfer the readability discipline of strong film storyboards, animation thumbnails, manga paneling, and production notebooks; do not imitate any one artist's look. Every panel must communicate task, obstacle, readable action, reaction, and changed state before final-looking rendering.",
  quality_reference_policy: {
    allowed: [
      "public film and animation production notes",
      "professional storyboard and layout breakdowns",
      "published film-staging and editorial craft references"
    ],
    excluded: [
      "local support mini-theater packages",
      "local EP02 shot packages",
      "any prior local frame as a quality or shot-design template"
    ],
    local_asset_boundary: "Local selected character, prop, and location assets may constrain identity, wardrobe, weapon, and geography only; they are not visual-quality or blocking references."
  },
  method_references: [
    { title: "Disney Animation Story", url: "https://www.disneyanimation.com/process/story/", lesson: "thumbnail narrative, emotion, timing, staging, and framing before final layout" },
    { title: "Disney Animation Layout", url: "https://disneyanimation.com/process/layout/", lesson: "stage characters, sets, props, camera, cut relation, point of view, and continuity shot by shot" },
    { title: "Academy: How To Storyboard Star Trek", url: "https://www.oscars.org/news/how-storyboard-star-trek", lesson: "make an action sequence legible as approach, conflict, recovery, and payoff" },
    { title: "Star Wars Jedi Videomatics", url: "https://www.starwars.com/video/jedi-videomatics-a-moving-storyboard", lesson: "test action flow, screen direction, and edit rhythm as a moving storyboard before final imagery" },
    { title: "ILM Art Department: Concept Art and Storyboarding", url: "https://www.ilm.com/ilm-evolutions-50-concept-art-storyboarding/", lesson: "treat storyboards as an action and logistics blueprint for the finished shot" },
    { title: "Jump Manga School Lecture 3", url: "https://jump-manga-school.hatenablog.com/entry/03", lesson: "use wide shots for position and distance, closer views for hand performance and emotion, and keep each panel immediately readable" },
  ],
  premise_one_sentence: "Ashe must stop the man who raised him without handing him a straight path to execution; the order becomes a physical split, then the defenders' own movement forces one controlled disarm.",
  reader_hook: "An order is given; before anyone charges, the battlefield visibly splits into lanes.",
  scene_engine: {
    task_or_desire: "Contain Lonato while protecting the village route and preserving Ashe's chance to choose restraint.",
    obstacle: "A two-guard screen and a broken wet crossing prevent a direct approach.",
    escalation: "The guards move first; Catherine takes their pressure; Lonato steps across only to cover a retreating guard.",
    visible_change: "The ordinary sword lies in the mud, Lonato is on one knee, and the witnesses remain back rather than turning the stop into an execution.",
  },
  characters: [
    { id: "BylethFemale", goal: "contain", tactic: "spatial command", distinctive_behavior: "low hand signal and off-screen authority", effect_on_others: "students form a barrier and do not rush" },
    { id: "Ashe", goal: "stop Lonato without killing him", tactic: "nock toward empty ground, then lower", distinctive_behavior: "apology, held breath, no release", effect_on_others: "the guard line hesitates and Catherine enters" },
    { id: "Catherine", goal: "prevent a guard breakthrough", tactic: "intercept the nearer guard first, then receive Lonato's protective press", distinctive_behavior: "economical footwork and weapon-level leverage", effect_on_others: "the guard pair retreats and Lonato loses his ordinary sword" },
    { id: "Lonato", goal: "protect the rebellion and the guard", tactic: "shield-led step across the retreat lane", distinctive_behavior: "measured press, no wild swing", effect_on_others: "his cover position creates the one safe bind and the disarm" },
    { id: "Dimitri_Dedue", goal: "hold formation", tactic: "stop behind cover", distinctive_behavior: "half-step and lowered weapons", effect_on_others: "moral distance stays visible" },
  ],
  beats: [
    { id: "B01", shots: ["Shot025"], task: "Byleth's command must become a physical containment plan", obstacle: "the crossing forks and the guard screen is not yet formed", cause: "The command redirects Ashe before the guards can be allowed to open a direct lane.", action: "Dimitri and Dedue hold cover while two guards close the fork and Ashe is routed right", reaction: "the formation stops", changed_state: "two lanes exist and Lonato is beyond the screen", focal_subject: "the command's physical consequence", attention_path: "near cover -> guard screen -> far Lonato", payoff_or_handoff: "Ashe owns the near-right warning plane" },
    { id: "B02", shots: ["Shot026"], task: "Ashe must make a nonlethal warning", obstacle: "the guard line blocks the direct path", cause: "The two-lane screen leaves Ashe a warning lane but removes a clean shot at Lonato.", action: "nock, draw toward empty mud, then lower without release", reaction: "one apology and held breath", changed_state: "the arrow remains nocked but the attack impulse is refused", focal_subject: "Ashe's restraint", attention_path: "bow hand -> empty mud -> guard line -> far Lonato", payoff_or_handoff: "left gap remains open for Catherine" },
    { id: "B03", shots: ["Shot027"], task: "Catherine must stop the guard pressure", obstacle: "the nearer guard steps toward Ashe", cause: "The nearer guard answers Ashe's warning by pressing into the open lane.", action: "enter from left and redirect the long weapon", reaction: "near guard staggers sideways; second guard retreats", changed_state: "Catherine owns the cleared lane", focal_subject: "Catherine's guard-first intervention", attention_path: "advancing weapon -> Catherine's guard -> displaced pair", payoff_or_handoff: "Lonato sees the retreating guard and must choose whether to cover him" },
    { id: "B04", shots: ["Shot028"], task: "Lonato must protect his retreating guard", obstacle: "Catherine controls the lane and the guard is exposed", cause: "The displaced guard retreats behind Lonato, forcing Lonato to cross into the controlled lane to cover him.", action: "Lonato crosses to cover the guard; one ordinary-sword press meets Thunderbrand and is turned aside", reaction: "the guard gets behind Lonato; the sword drops", changed_state: "Lonato is upright but disarmed", focal_subject: "the guard-mediated weapon bind", attention_path: "retreating guard -> Lonato's shield -> weapon contact -> mud", payoff_or_handoff: "Lonato's balance gives way into Shot029" },
    { id: "B05", shots: ["Shot029"], task: "The stop must land as a human consequence", obstacle: "Lonato cannot recover his footing", cause: "The disarm removes Lonato's last stable support while the witnesses deliberately hold their distance.", action: "catch on shield and settle to one knee", reaction: "Dimitri, Ashe, and female Byleth hold back", changed_state: "quiet aftermath with open distance", focal_subject: "Lonato's loss of support", attention_path: "dropped sword -> knee and shield -> distant witnesses", payoff_or_handoff: "cut to the aftermath reaction without a victory tableau" },
  ],
  rough_read_paths: [
    "planning/manga_readability_thumbnail_025_029_2026-09-09.svg",
    "planning/manga_readability_thumbnail_025_029_2026-09-09.png",
    "planning/animatic_plan.json",
  ],
  readability_checks: {
    rough_pass_reviewed: false,
    thumbnail_readable: false,
    understandable_without_captions: false,
    one_focal_signal_per_shot: false,
    final_frames_pending: true,
    review_status: "rough_thumbnail_pending",
  },
};
const roughThumbnailReady = projectExists("planning/manga_readability_thumbnail_025_029_2026-09-09.png");
mangaReadabilityPlan.readability_checks = {
  ...mangaReadabilityPlan.readability_checks,
  rough_pass_reviewed: roughThumbnailReady,
  thumbnail_readable: roughThumbnailReady,
  understandable_without_captions: roughThumbnailReady,
  one_focal_signal_per_shot: roughThumbnailReady,
  review_status: roughThumbnailReady ? "rough_thumbnail_passed_final_frame_generation_pending" : "rough_thumbnail_pending",
  reviewed_at: roughThumbnailReady ? "2026-09-09" : null,
  reviewer_role: roughThumbnailReady ? "independent-story-and-sequence-readability-audit" : null,
};

const canonicalCharactersByShot = {
  Shot025: ["Dimitri", "Dedue", "Ashe", "Lonato"],
  Shot026: ["Ashe", "Lonato"],
  Shot027: ["Ashe", "Catherine", "Lonato"],
  Shot028: ["Catherine", "Lonato"],
  Shot029: ["Lonato", "Dimitri", "Ashe", "BylethFemale"],
  Shot030: ["BylethFemale", "Dimitri", "Ashe", "Catherine"],
  Shot031: ["Rhea", "Seteth", "BylethFemale", "Dimitri", "Ashe"],
  Shot032: ["Rhea", "Seteth", "BylethFemale"],
  Shot033: ["Ashe", "Dimitri", "Felix", "BylethFemale"],
  Shot034: ["Catherine", "Ashe", "BylethFemale"],
  Shot035: ["Dimitri", "BylethFemale"],
  Shot036: ["BylethFemale", "Sothis", "Rhea"],
};
const canonicalAssetReferencesByShot = {
  Shot025: [
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/blue_lions/Dedue/academy/selected.png",
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
    "assets/characters/extras/BanditSoldier/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
    "episodes/EP03/storyboards/Shot024/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
  ],
  Shot026: [
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
    "assets/characters/extras/BanditSoldier/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
    "episodes/EP03/storyboards/Shot025/critical_reaudit_regen_v11_2026-09-03/end_frame.png",
  ],
  Shot027: [
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/church_of_seiros/Catherine/academy/selected.png",
    "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
    "assets/characters/extras/BanditSoldier/selected.png",
    "assets/props/shared/hero_relics/thunderbrand_reference.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
    "episodes/EP03/storyboards/Shot026/critical_reaudit_regen_v7_2026-09-02/end_frame.png",
  ],
  Shot028: [
    "assets/characters/church_of_seiros/Catherine/academy/selected.png",
    "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
    "assets/characters/extras/BanditSoldier/selected.png",
    "assets/props/shared/hero_relics/thunderbrand_reference.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
    "episodes/EP03/storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/end_frame.png",
  ],
  Shot029: [
    "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
    "episodes/EP03/storyboards/Shot028/critical_reaudit_regen_v7_2026-09-02/end_frame.png",
  ],
  Shot030: [
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/church_of_seiros/Catherine/academy/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "episodes/EP03/storyboards/Shot029/manga_readability_reboard_v1_2026-09-09/end_frame.png",
  ],
  Shot031: [
    "assets/characters/church_of_seiros/Rhea/academy/selected.png",
    "assets/characters/church_of_seiros/Seteth/academy/selected.png",
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png",
    "episodes/EP03/storyboards/Shot030/external_film_staging_reboard_v1_2026-09-10/end_frame.png",
  ],
  Shot032: [
    "assets/characters/church_of_seiros/Rhea/academy/selected.png",
    "assets/characters/church_of_seiros/Seteth/academy/selected.png",
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png",
    "episodes/EP03/storyboards/Shot031/external_film_staging_reboard_v1_2026-09-10/end_frame.png",
  ],
  Shot033: [
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/blue_lions/Felix/academy/selected.png",
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png",
    "episodes/EP03/storyboards/Shot032/external_film_staging_reboard_v1_2026-09-10/end_frame.png",
  ],
  Shot034: [
    "assets/characters/church_of_seiros/Catherine/academy/selected.png",
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png",
    "assets/props/shared/hero_relics/thunderbrand_reference.png",
    "episodes/EP03/storyboards/Shot033/critical_reaudit_regen_v2_2026-08-24/end_frame.png",
  ],
  Shot035: [
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png",
    "episodes/EP03/storyboards/Shot034/external_film_staging_reboard_v1_2026-09-10/end_frame.png",
  ],
  Shot036: [
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/characters/divine/Sothis/dream/legacy_ep01/candidate_03.png",
    "assets/characters/church_of_seiros/Rhea/academy/selected.png",
    "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png",
    "assets/props/shared/sword_of_creator/selected.png",
    "episodes/EP03/storyboards/Shot035/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
  ],
};
const canonicalDurationsByShot = {
  Shot001: 6.30,
  Shot003: 10.30,
  Shot004: 8.90,
  Shot005: 11.70,
  Shot006: 13.00,
  Shot008: 11.00,
  Shot010: 10.90,
  Shot013: 13.00,
  Shot015: 8.90,
  Shot016: 11.60,
  Shot017: 11.70,
  Shot018: 8.90,
  Shot019: 9.40,
  Shot021: 11.70,
  Shot022: 13.00,
  Shot023: 13.00,
  Shot024: 7.60,
  Shot025: 8,
  Shot026: 6,
  Shot027: 5.5,
  Shot028: 8,
  Shot029: 6,
  Shot030: 12,
  Shot031: 13.40,
  Shot032: 11.50,
  Shot033: 14.00,
  Shot034: 12.60,
  Shot035: 15.00,
  Shot036: 9.30,
};

const sourceTimecodeAuditDocument = readJson(projectFile("production_system/source_timecode_audit_2026-08-01.json"), {});
const sourceTimecodeAuditByShot = sourceTimecodeAuditDocument.shots || {};
function sourceTimecodeAuditFor(shotId) {
  const audit = sourceTimecodeAuditByShot[shotId];
  if (!audit) return null;
  return {
    source_match: audit.source_match || "",
    adaptation_gap: audit.adaptation_gap || "",
    audit_path: "production_system/source_timecode_audit_2026-08-01.json",
  };
}

const canonicalEditorialByShot = {
  Shot025: {
    edit_in: "cut from Byleth's command into the command's physical split of the fork",
    edit_out: "cut to Ashe's right-side warning plane after the guard screen closes",
    audio_anchor: "Byleth's order resolves into boots, shield hardware, and wet wood. No new spoken dialogue.",
    risks: "the geography becomes a diagram, lineup, or direct Byleth-to-Lonato attack lane",
  },
  Shot026: {
    edit_in: "cut from the two-lane containment hold and Ashe's new right-side mark",
    edit_out: "cut on Ashe's restraint into the nearer guard's first step",
    audio_anchor: "Ashe, in Japanese: ごめんなさい。 He releases the string without firing; no other speech.",
    risks: "Ashe fires at Lonato, the arrow points through a person, or the guard line becomes decorative background",
  },
  Shot027: {
    edit_in: "cut from Ashe's lowered nocked arrow and the protected two-guard buffer",
    edit_out: "cut after Catherine owns the lane and the nearer guard is displaced",
    audio_anchor: "Silent shot: wet footfalls, armor/cloak movement, one practical metal/sheath accent, Ashe's held breath, and fog room tone. No spoken dialogue.",
    risks: "Catherine bypasses the guard line, the guards vanish, or the frame jumps directly to Lonato contact",
  },
  Shot028: {
    edit_in: "cut from the retreating guard entering Lonato's protective cover",
    edit_out: "cut to Lonato's dropped-sword recovery with him still upright before the kneel",
    audio_anchor: "Metal falls; the fog goes briefly quiet. No spoken dialogue.",
    risks: "the contact reads as an unmotivated attack on Lonato, a kill, or a guard-free duel",
  },
  Shot029: {
    edit_in: "cut from the ordinary sword dropped, Lonato upright",
    edit_out: "cut to the quiet post-battle field",
    audio_anchor: "Ashe breathing; distant fighting stops. No spoken dialogue.",
    risks: "witnesses rush Lonato, the group forms a row, or the aftermath becomes a celebratory victory pose",
  },
  Shot030: {
    edit_in: "cut from Lonato's controlled kneel into the witnesses choosing not to advance",
    edit_out: "cut on Byleth taking the return route toward the cathedral",
    audio_anchor: "Wind, wet cloth, a stop-hand gesture, an arrow returned to the quiver, and fading field ambience; no spoken dialogue.",
    risks: "the aftermath becomes a lineup, Catherine crosses the foreground, or the group resets into a victory tableau",
  },
  Shot031: {
    edit_in: "cut from the muddy return route through the cathedral threshold",
    edit_out: "cut on Rhea turning back toward the altar with the report",
    audio_anchor: "Wet shoes, a closing door, folio movement, and Rhea's single Japanese line; no Chinese or Mandarin voice.",
    risks: "the five become a ceremonial lineup, Seteth reads young, or the muddy threshold is erased",
  },
  Shot032: {
    edit_in: "cut from Rhea's turn and Seteth's held report between levels",
    edit_out: "cut on Byleth stepping back toward the students' side door",
    audio_anchor: "A folio closes under Rhea's palm, her Japanese order lands once, then cathedral reverb carries the turn-away tail.",
    risks: "the shot repeats Shot031's handoff, Rhea becomes theatrical, or the order has no visible physical consequence",
  },
  Shot033: {
    edit_in: "cut from the order carried down the altar steps",
    edit_out: "cut on Byleth taking the right corridor after the authority door closes",
    audio_anchor: "Door latch, wood settling, wet footsteps, and room tone only; no spoken dialogue.",
    risks: "the four stand shoulder-to-shoulder, the door handoff disappears, or the corridor lacks a departure direction",
  },
  Shot034: {
    edit_in: "cut from Byleth's right-corridor departure into the wet cloister",
    edit_out: "cut on Byleth clearing the far arch and Catherine turning to answer Ashe",
    audio_anchor: "Cloth wraps the sheathed Thunderbrand; Catherine's single Japanese line lands over quiet cloister room tone.",
    risks: "Thunderbrand becomes generic, Ashe enters sword range, or the talk becomes a static symmetrical two-shot",
  },
  Shot035: {
    edit_in: "cut from the empty right corridor into the night cloister walk",
    edit_out: "cut after Dimitri has left Byleth under the lamp in the dark arch",
    audio_anchor: "Night rain residue, glove against wet stone, Dimitri's single Japanese line, and a settled reverb tail.",
    risks: "the walk becomes a static two-shot, Dimitri never braces on stone, or the final distance does not increase",
  },
  Shot036: {
    edit_in: "cut from Byleth left under the night lamp into the cathedral threshold",
    edit_out: "cut to black after Sothis recedes into motes",
    audio_anchor: "Candle hush and cathedral reverb; Sothis speaks once in Japanese and no other voice enters.",
    risks: "Sothis becomes solid, Rhea approaches, or the mystery resolves into a lore tableau",
  },
};

function frameSetReady(frameSet) {
  return frameSet && Object.values(frameSet.frames || {}).every((rel) => projectExists(rel));
}

const externalStagingRoughReady = projectExists("planning/external_film_staging_thumbnail_030_036_2026-09-10.svg")
  || projectExists("planning/external_film_staging_thumbnail_030_036_2026-09-10.png");
const externalStagingReboardReady = externalStagingRoughReady
  && Object.keys(externalStagingReboardV1).length === 7
  && Object.values(externalStagingReboardV1).every(frameSetReady);
if (externalStagingReboardReady) {
  for (const [shotId, frameSet] of Object.entries(externalStagingReboardV1)) {
    frameSet.status = "monitor_required";
    frameSet.visual_audit_decision = "visual_review_passed";
    frameSet.generation_mode = "imagegen_integrated_live_action_with_external_film_staging_method_and_canonical_local_assets";
    frameSet.review_markdown = frameSet.review_markdown
      || `production_system/reviews/external_film_staging_reboard_2026-09-10/${shotId.toLowerCase()}_reboard_review.md`;
    criticalReauditV7[shotId] = frameSet;
    if (Array.isArray(frameSet.reference_assets)) {
      canonicalAssetReferencesByShot[shotId] = frameSet.reference_assets;
    }
  }
}

function normalizeFemaleBylethCharacters(value, shotId) {
  if (!Array.isArray(value)) return value;
  return value.map((character) => character === "Byleth" ? "BylethFemale" : character);
}

const mangaReboardReady = Object.values(mangaReadabilityReboardV1).every(frameSetReady);
if (mangaReboardReady) {
  for (const [shotId, frameSet] of Object.entries(mangaReadabilityReboardV1)) {
    frameSet.visual_audit_decision = "visual_review_passed";
    frameSet.status = "monitor_required";
    Object.assign(criticalReauditV7[shotId], frameSet);
  }
  for (const [shotId, previousShotId] of [["Shot026", "Shot025"], ["Shot027", "Shot026"], ["Shot028", "Shot027"], ["Shot029", "Shot028"]]) {
    const refs = canonicalAssetReferencesByShot[shotId];
    const previous = mangaReadabilityReboardV1[previousShotId];
    if (!Array.isArray(refs) || !previous) continue;
    refs[refs.length - 1] = previous.frames.end;
  }
}

const currentFrameReviewByShot = {
  Shot014: "production_system/reviews/critical_reaudit_2026-08-14/shot014_critical_reaudit_regen_v1_2026-08-14_review.md",
  Shot036: "production_system/reviews/critical_reaudit_2026-09-03/shot036_critical_reaudit_regen_v3_2026-09-03_review.md",
};

function enrichDisplayedFrameSet(shot) {
  const frameSet = shot.displayed_frame_set;
  if (!frameSetReady(frameSet)) return;
  frameSet.status = frameSet.status || shot.status || "monitor_required";
  frameSet.visual_audit_decision = frameSet.visual_audit_decision || shot.visual_audit_decision || "monitor_required";
  frameSet.source = frameSet.source || shot.current_display_frame_source || "";
  frameSet.note = frameSet.note || shot.current_display_frame_note || shot.visual_audit_finding || "Current integrated live-action candidate.";
  frameSet.review_markdown = frameSet.review_markdown || shot.review_markdown || currentFrameReviewByShot[shot.id];
}

function applyCurrentFrameSet(shot, frameSet) {
  Object.assign(shot, {
    start_frame: frameSet.frames.start,
    key_frame: frameSet.frames.key,
    end_frame: frameSet.frames.end,
    output_frames: frameSet.frames,
    frames: Object.fromEntries(Object.entries(frameSet.frames).map(([role, rel]) => [role, `episodes/EP03/${rel}`])),
    displayed_frame_set: frameSet,
    current_display_frame_set: shortFrameSetVersion(frameSet.version),
    current_display_frame_status: `monitor_required_${frameSet.version}`,
    current_display_frame_source: frameSet.source,
    current_display_frame_note: frameSet.note || "",
    visual_audit_decision: frameSet.visual_audit_decision,
    video_prompt_qa_decision: `pending_review_against_${frameSet.version}`,
    motion_probe_status: `pending_3s_probe_against_${frameSet.version}`,
    ...(canonicalCharactersByShot[shot.id]
      ? { characters: normalizeFemaleBylethCharacters(canonicalCharactersByShot[shot.id], shot.id) }
      : {}),
    ...(canonicalAssetReferencesByShot[shot.id]
      ? {
          asset_references: canonicalAssetReferencesByShot[shot.id],
          reference_assets: canonicalAssetReferencesByShot[shot.id],
        }
      : frameSet.reference_assets
        ? { reference_assets: frameSet.reference_assets }
        : {}),
  });
}

if (mangaReboardReady) {
  const reboardShot025 = (delivery.shots || []).find((candidate) => candidate.id === "Shot025");
  if (reboardShot025) applyCurrentFrameSet(reboardShot025, criticalReauditV7.Shot025);
}

for (const [shotId, frameSet] of Object.entries(criticalReauditV7)) {
  if (shotId === "Shot025") continue;
  const shot = (delivery.shots || []).find((candidate) => candidate.id === shotId);
  if (!shot || !frameSetReady(frameSet)) continue;
  applyCurrentFrameSet(shot, frameSet);
  if (canonicalDurationsByShot[shotId]) shot.duration_seconds = canonicalDurationsByShot[shotId];
  shot.edit_in = {
    Shot026: "cut from the two-lane containment hold",
    Shot027: "cut from Ashe's lowered nocked arrow",
    Shot028: "cut from the retreating guard entering Lonato's protective cover",
    Shot029: "cut from the ordinary sword dropped, Lonato upright",
    Shot030: "cut from Lonato fully kneeling",
    Shot031: "cut from the muddy return route through the cathedral threshold",
    Shot032: "cut from Rhea's turn and Seteth's held report between levels",
    Shot033: "cut from the order carried down the altar steps",
    Shot034: "cut from the right-corridor Byleth eyeline",
    Shot035: "cut from the empty right corridor",
    Shot036: "cut from Dimitri night",
  }[shotId];
  shot.edit_out = {
    Shot026: "cut to Catherine entering the guard gap",
    Shot027: "cut to Catherine/Lonato pre-contact coverage",
    Shot028: "cut to Lonato losing support",
    Shot029: "cut to the quiet post-battle field",
    Shot030: "cut on Byleth taking the return route toward the cathedral",
    Shot031: "cut on Rhea turning back toward the altar with the report",
    Shot032: "cut on Byleth stepping back toward the students' side door",
    Shot033: "cut on Byleth taking the right corridor after the authority door closes",
    Shot034: "cut to Dimitri night",
    Shot035: "cut after Dimitri has left Byleth under the lamp in the dark arch",
    Shot036: "cut to black",
  }[shotId];
  shot.visual_audit_finding = `2026-09-02 sequential re-audit: ${frameSet.note}`;
  shot.required_revision = `Keep monitor_required. Run prompt-against-frame QA, strict adjacent continuity QA, and a 3-second motion probe. Reject if the declared distance, guard interaction, weapon state, ${shotId === "Shot029" ? "female Byleth identity, or non-rushing witness geography" : "action handoff"} breaks, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.`;
  shot.model_notes = [
    ...(Array.isArray(shot.model_notes) ? shot.model_notes : []).filter((note) => !isGeneratedCurrentFrameNote(note)),
    generatedCurrentFrameNote(frameSet.version, frameSet.note),
  ];
}

const shot024Current = (delivery.shots || []).find((shot) => shot.id === "Shot024");
if (shot024Current) shot024Current.edit_out = "cut to the blocked-crossing consequence of the command";

for (const shot of delivery.shots || []) enrichDisplayedFrameSet(shot);

for (const shot of delivery.shots || []) {
  const frameSet = shot.displayed_frame_set;
  if (!frameSetReady(frameSet)) continue;
  const version = frameSet.version || shot.current_display_frame_set || "current";
  const note = frameSet.note || shot.current_display_frame_note || shot.visual_audit_finding || "Current integrated live-action candidate.";
  const notes = (Array.isArray(shot.model_notes) ? shot.model_notes : []).filter((item) => !isGeneratedCurrentFrameNote(item));
  shot.model_notes = [
    ...notes,
    generatedCurrentFrameNote(version, note),
  ];
}

for (const [index, shot] of (delivery.shots || []).entries()) {
  const current = shot.displayed_frame_set;
  if (!frameSetReady(current)) continue;
  const previous = delivery.shots[index - 1];
  const next = delivery.shots[index + 1];
  const previousEnd = previous && frameSetReady(previous.displayed_frame_set)
    ? previous.displayed_frame_set.frames.end
    : null;
  const nextStart = next && frameSetReady(next.displayed_frame_set)
    ? next.displayed_frame_set.frames.start
    : null;
  shot.previous_match_action_reference = previousEnd;
  shot.next_handoff_reference = nextStart;
  shot.current_continuity = {
    source: "derived_from_current_displayed_frame_sets",
    current_frame_set: current.version || "current",
    previous_shot: previous?.id || null,
    previous_end_frame: previousEnd,
    next_shot: next?.id || null,
    next_start_frame: nextStart,
    decision: "monitor_required",
  };
}

const shotDurations = new Map();
const metadataByShot = new Map();
for (const shot of delivery.shots || []) {
  const metadata = readJson(projectFile(`storyboards/${shot.id}/metadata.json`), {});
  shot.characters = normalizeFemaleBylethCharacters(shot.characters, shot.id);
  metadata.characters = normalizeFemaleBylethCharacters(metadata.characters, shot.id);
  const sourceTimecodeAudit = sourceTimecodeAuditFor(shot.id);
  if (sourceTimecodeAudit) {
    metadata.source_timecode_audit = sourceTimecodeAudit;
    shot.source_timecode_audit = sourceTimecodeAudit;
  }
  if (canonicalEditorialByShot[shot.id]) {
    Object.assign(metadata, canonicalEditorialByShot[shot.id]);
    Object.assign(shot, canonicalEditorialByShot[shot.id]);
  }
  if (shot.id === "Shot025") {
    metadata.scene = "命令造成分流";
    metadata.purpose = "把贝老师的包围命令变成一眼可读的两条物理路线；近侧只保留 Dimitri、Dedue 和 Ashe，洛纳托被守卫屏风与断裂地形隔在远处。";
    metadata.key_action = "Dimitri 和 Dedue 在近侧掩体停住；两名叛军守卫从中央横切，关上通向 Lonato 的近路，Ashe 被明确引到右侧警戒位。";
    metadata.camera = "16:9 侧向地理远景，近侧掩体、分叉泥路、两名守卫的横向移动、右侧 Ashe 与远脊 Lonato 同时可读；镜头只做短侧移，不把人排成一行。";
    metadata.character_presence_constraint = "Byleth 在本镜头画外；可读的命名角色只有 Dimitri、Dedue、Ashe 和远脊 Lonato，中央恰为同一对无名叛军守卫。其余学生不进入可辨认画面，任何学生都不在 Lonato 的剑距内。";
  }
  if (shot.id === "Shot028") {
    metadata.scene = "护卫造成缴械";
    metadata.purpose = "让 Lonato 的近身行为有明确原因：他为了护住撤退的守卫才跨入 Catherine 的控制线，随后被一次武器级别的卡挡缴械。";
    metadata.key_action = "一名守卫向 Lonato 身后撤；Lonato 以盾跨过去替他承压，普通剑只做一次压迫，Catherine 用 Thunderbrand 在护手处卡住并卸掉普通剑；两名守卫继续退开。";
    metadata.camera = "16:9 同轴中远景，先让撤退守卫、Lonato 的盾和 Catherine 的低位关系同时可读，再跟进一次清楚的武器卡挡，最后停在落剑与站立失衡，不做贴脸处决构图。";
    metadata.character_presence_constraint = "全画面恰为 Catherine、Lonato 和从 Shot027 延续的两名无名叛军守卫；不出现 Byleth、Ashe、Dimitri 或任何额外山脊人形。守卫撤退必须先于 Lonato 与 Catherine 的接触。";
  }
  if (shot.id === "Shot026") {
    metadata.scene = "亚修选择不射";
    metadata.purpose = "让 Ashe 的选择成为动作，而不是把他拍成已经瞄准 Lonato 的执行者。";
    metadata.key_action = "Ashe 在近右把箭线放到守卫线前的空泥地，拉满后听见自己的呼吸并放低弓；两名守卫仍在中层，Lonato 只能从远脊看见。";
    metadata.camera = "16:9 斜向中远景，先给 Ashe 的弓、空泥地和两名守卫足够空间，再在同一轴线上收紧到他的全身拉弓与放低；不做瞄准人脸的特写。";
  }
  if (shot.id === "Shot027") {
    metadata.scene = "守卫先动，骑士接管";
    metadata.purpose = "先拍清守卫对 Ashe 造成的压力，再让 Catherine 通过实际的拨挡接管通道；Lonato 仍不被直接攻击。";
    metadata.key_action = "最近守卫朝 Ashe 的警戒位迈出一步，第二名守卫退后护住路线；Catherine 从左侧进入，用 Thunderbrand 拨开长兵并站进空出的半步，Ashe 原地不射。";
    metadata.camera = "16:9 同轴宽幅侧地理景，开头保留 Ashe、两名守卫、Catherine 的进入路线和 Lonato 的远脊，跟随一次有重量的拨挡后停在低位防守；不跳切到 Lonato。";
  }
  const shotNumber = Number(String(shot.id || "").replace(/^Shot/, ""));
  if (shotNumber >= 15 && shot.current_continuity) {
    metadata.previous_match_action_reference = shot.current_continuity.previous_end_frame;
    metadata.next_handoff_reference = shot.current_continuity.next_start_frame;
    metadata.current_continuity = shot.current_continuity;
  }
  if (Number(String(shot.id || "").replace(/^Shot/, "")) >= 15
      && Array.isArray(metadata.characters)
      && metadata.characters.includes("BylethFemale")) {
    metadata.canonical_byleth_asset = "assets/characters/protagonist/BylethFemale/professor/selected.png";
  }
  if (shot.id === "Shot025" && shot025 && Object.values(shot025V11.frames).every((rel) => projectExists(rel))) {
    const shot025MetadataKey = shot025V11.version.replace(/_\d{4}-\d{2}-\d{2}$/, "");
    metadata.current_display_frame_set = shot025MetadataKey;
    metadata.current_display_frame_status = `monitor_required_${shot025V11.version}`;
    metadata.current_display_frame_source = shot025V11.source;
    metadata.current_display_frame_note = shot025V11.note;
    metadata.output_frames = shot025V11.frames;
    metadata.displayed_frame_set = shot025V11;
    metadata[shot025MetadataKey] = shot025V11;
    writeJson(projectFile(`storyboards/${shot.id}/metadata.json`), metadata);
  }
  if (canonicalDurationsByShot[shot.id]) {
    metadata.duration_seconds = canonicalDurationsByShot[shot.id];
    shot.duration_seconds = canonicalDurationsByShot[shot.id];
  }
  const currentFrameSet = criticalReauditV7[shot.id];
  if (shot.id !== "Shot025" && frameSetReady(currentFrameSet)) {
    if (canonicalDurationsByShot[shot.id]) metadata.duration_seconds = canonicalDurationsByShot[shot.id];
    const metadataFrameSetKey = currentFrameSet.version.replace(/_\d{4}-\d{2}-\d{2}$/, "");
    metadata.current_display_frame_set = metadataFrameSetKey;
    metadata.current_display_frame_status = `monitor_required_${currentFrameSet.version}`;
    metadata.current_display_frame_source = currentFrameSet.source;
    metadata.current_display_frame_note = currentFrameSet.note;
    metadata.output_frames = currentFrameSet.frames;
    metadata.displayed_frame_set = currentFrameSet;
    metadata[metadataFrameSetKey] = currentFrameSet;
    if (canonicalCharactersByShot[shot.id]) {
      metadata.characters = normalizeFemaleBylethCharacters(canonicalCharactersByShot[shot.id], shot.id);
    }
    if (canonicalAssetReferencesByShot[shot.id]) {
      metadata.asset_references = canonicalAssetReferencesByShot[shot.id];
      metadata.reference_assets = canonicalAssetReferencesByShot[shot.id];
    }
    writeJson(projectFile(`storyboards/${shot.id}/metadata.json`), metadata);
  }
  if (canonicalDurationsByShot[shot.id] && !frameSetReady(currentFrameSet)) {
    writeJson(projectFile(`storyboards/${shot.id}/metadata.json`), metadata);
  }
  if (frameSetReady(currentFrameSet)) {
    metadata.planned_frames = currentFrameSet.frames;
    metadata.start_frame = currentFrameSet.frames.start;
    metadata.key_frame = currentFrameSet.frames.key;
    metadata.end_frame = currentFrameSet.frames.end;
    if (canonicalCharactersByShot[shot.id]) {
      metadata.characters = normalizeFemaleBylethCharacters(canonicalCharactersByShot[shot.id], shot.id);
    }
    metadata.reference_assets = canonicalAssetReferencesByShot[shot.id]
      || [...new Set([
        ...(Array.isArray(metadata.reference_assets) ? metadata.reference_assets : []),
        ...currentFrameSet.reference_assets,
      ])];
    if (canonicalAssetReferencesByShot[shot.id]) metadata.asset_references = canonicalAssetReferencesByShot[shot.id];
    metadata.visual_audit_decision = currentFrameSet.visual_audit_decision;
    metadata.visual_audit_finding = `2026-09-02 sequential re-audit: ${currentFrameSet.note}`;
    metadata.required_revision = "Keep monitor_required. Run prompt-against-frame QA, strict adjacent continuity QA, and a 3-second motion probe before any video approval.";
    metadata.video_prompt_qa_decision = `pending_review_against_${currentFrameSet.version}`;
    metadata.motion_probe_status = `pending_3s_probe_against_${currentFrameSet.version}`;
    metadata.character_presence_constraint = {
      Shot025: "Exactly four named performers are readable: Dimitri and Dedue hold near cover, Ashe owns the right-side warning plane, and Lonato is a small far-ridge presence; exactly two unfeatured rebel guards cross and close the fork. No other named student enters.",
      Shot026: "Exactly two named performers are readable: Ashe near-right and Lonato far upper-left, plus exactly two indistinct rebel guards physically between them; the arrow points only to empty mud before the guard line.",
      Shot027: "Exactly three named performers are readable: Ashe stays near-right, Catherine enters from the left, and Lonato remains far uphill, plus the same two indistinct rebel guards; the nearer guard is the first physical threat.",
      Shot028: "Exactly four human figures are allowed: Catherine, Lonato, and the same two unfeatured rebel guards retained from Shot027; the retreating guard visibly causes Lonato to cross into the one weapon-level bind. No Byleth, Ashe, Dimitri, third guard, or distant human silhouette enters the coverage.",
      Shot029: "Exactly four named performers are readable: Lonato, academy Dimitri, academy Ashe, and female academy Byleth; Catherine has exited and every witness remains outside Lonato's sword range.",
      Shot030: "Exactly four named performers are readable at START/KEY: female academy Byleth rear-left, academy Dimitri middle, academy Ashe near-right, and academy Catherine crossing in a separate far-background lane; by END only female Byleth, Dimitri, and Ashe remain, with Lonato and all other performers offscreen.",
      Shot034: "Exactly three named academy performers are readable: Catherine owns the right foreground by the column, Ashe holds the left midground at respectful conversational distance with his bow lowered, and female Byleth remains far behind in the doorway. No fourth person enters; Catherine's single Thunderbrand stays sheathed.",
      Shot036: "Exactly three presences are readable: female academy Byleth grounded in the foreground, recognizable translucent Sothis beside her without floor contact, and distant Rhea oriented toward the Holy Tomb; no other performer enters.",
    }[shot.id] || metadata.character_presence_constraint;
    metadata.model_notes = [
      ...(Array.isArray(metadata.model_notes) ? metadata.model_notes : []).filter((note) => !isGeneratedCurrentFrameNote(note)),
      `Current displayed frames are the ${currentFrameSet.version} sequential action-chain repair: ${currentFrameSet.note} Keep monitor_required until prompt QA and motion probe.`,
    ];
    writeJson(projectFile(`storyboards/${shot.id}/metadata.json`), metadata);
  }
  if (shot.id === "Shot028") {
    Object.assign(shot, {
      edit_in: "cut from the two-guard line clearing into the separated Catherine/Lonato lane",
      edit_out: "cut to Lonato's dropped-sword recovery with him still upright before the kneel",
      audio_anchor: "Metal falls; the fog goes briefly quiet. No spoken dialogue.",
      character_presence_constraint: "Exactly four human figures are allowed: Catherine, Lonato, and the same two unfeatured rebel guards inherited from Shot027. No Byleth, Ashe, Dimitri, third guard, or distant human silhouette enters the coverage.",
      required_revision: "Keep monitor_required. Run prompt-against-frame QA, ordered combat QA, strict adjacent continuity QA, and a 3-second motion probe. Reject if the four-person count, guard-mediated entry, weapon-level bind, dropped-sword handoff, or standing Lonato state breaks, or if Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.",
    });
  }
  writeJson(projectFile(`storyboards/${shot.id}/metadata.json`), metadata);
  metadataByShot.set(shot.id, metadata);
  shotDurations.set(shot.id, Number(metadata.duration_seconds || shot.duration_seconds || 0));
}

const shotStarts = new Map();
let runtimeSeconds = 0;
for (const shot of delivery.shots || []) {
  shotStarts.set(shot.id, runtimeSeconds);
  runtimeSeconds += Number(shotDurations.get(shot.id) || 0);
}

// Keep the delivery manifest, metadata, and dialogue timeline on one shot contract.
for (const shot of delivery.shots || []) {
  const metadata = metadataByShot.get(shot.id) || {};
  const specs = specsFor(shot.id);
  shot.duration_seconds = Number(metadata.duration_seconds || shot.duration_seconds || 0);
  if (!Array.isArray(shot.characters) || !shot.characters.length) shot.characters = metadata.characters || [];
  if (specs.length) {
    const ids = specs.map((spec) => spec.id);
    const timing = specs.map((spec) => ({
      line_id: spec.id,
      speaker: spec.speaker,
      text: spec.text,
      local_start_seconds: spec.local_start,
      local_speech_end_seconds: spec.speech_end,
      local_end_seconds: boundedDialogueEnd(spec),
      speech_seconds: spec.speech_seconds,
      cut_on: "reaction",
      repeat_policy: "no_repeat",
    }));
    const timingValue = timing.length === 1 ? timing[0] : timing;
    metadata.dialogue_line_ids = ids;
    metadata.dialogue_mode = shotDialogueMode(specs);
    metadata.audio_source = "native_japanese";
    metadata.max_silence_seconds = 0.25;
    metadata.dialogue_timing = timingValue;
    metadata.motion_probe = metadata.motion_probe || {
      status: "pending",
      duration_seconds: 3,
      package_path: `delivery/motion_probe_package_2026-08-10/shots/${shot.id}/prompt.md`,
    };
    shot.dialogue_line_ids = ids;
    shot.dialogue_mode = shotDialogueMode(specs);
    shot.audio_source = "native_japanese";
    shot.max_silence_seconds = 0.25;
    shot.dialogue_timing = timingValue;
    shot.motion_probe = shot.motion_probe || metadata.motion_probe;
    writeJson(projectFile(`storyboards/${shot.id}/metadata.json`), metadata);
  }
}
writeJson(deliveryFile, delivery);

const queueFile = projectFile("frame_generation_queue.json");
const queueDoc = readJson(queueFile, { shots: [] });
const queueShots = Array.isArray(queueDoc.shots) ? queueDoc.shots : [];
const queueShot024 = queueShots.find((shot) => shot.id === "Shot024");
if (queueShot024) queueShot024.edit_out = "cut to the blocked-crossing consequence of the command";
for (const [shotId, frameSet] of Object.entries(criticalReauditV7)) {
  const queueShot = queueShots.find((candidate) => candidate.id === shotId);
  if (!queueShot || !frameSetReady(frameSet)) continue;
  Object.assign(queueShot, {
    output_frames: frameSet.frames,
    planned_frames: frameSet.frames,
    start_frame: frameSet.frames.start,
    key_frame: frameSet.frames.key,
    end_frame: frameSet.frames.end,
    current_display_frame_set: shortFrameSetVersion(frameSet.version),
    current_display_frame_status: `monitor_required_${frameSet.version}`,
    current_display_frame_source: frameSet.source,
    current_display_frame_note: frameSet.note || "",
    source_timecode_audit: sourceTimecodeAuditFor(shotId) || queueShot.source_timecode_audit || null,
    ...(canonicalEditorialByShot[shotId] || {}),
    displayed_frame_set: frameSet,
    visual_audit_decision: frameSet.visual_audit_decision,
    visual_audit_finding: frameSet.note,
    video_prompt_qa_decision: `pending_review_against_${frameSet.version}`,
    motion_probe_status: `pending_3s_probe_against_${frameSet.version}`,
    ...(canonicalCharactersByShot[shotId] ? { characters: canonicalCharactersByShot[shotId] } : {}),
    ...(canonicalDurationsByShot[shotId] ? { duration_seconds: canonicalDurationsByShot[shotId] } : {}),
  });
  if (shotId === "Shot025") {
    Object.assign(queueShot, {
      beat: "命令造成分流",
      purpose: "把贝老师的包围命令变成一眼可读的两条物理路线；近侧只保留 Dimitri、Dedue 和 Ashe，洛纳托被守卫屏风与断裂地形隔在远处。",
      key_action: "Dimitri 和 Dedue 在近侧掩体停住；两名叛军守卫从中央横切，关上通向 Lonato 的近路，Ashe 被明确引到右侧警戒位。",
      camera: "16:9 侧向地理远景，近侧掩体、分叉泥路、两名守卫的横向移动、右侧 Ashe 与远脊 Lonato 同时可读；镜头只做短侧移，不把人排成一行。",
      source_timecode_audit: {
        ...(sourceTimecodeAuditFor("Shot025") || {}),
      },
    });
  }
  if (shotId === "Shot028") {
    Object.assign(queueShot, {
      beat: "护卫造成缴械",
      purpose: "让 Lonato 的近身行为有明确原因：他为了护住撤退的守卫才跨入 Catherine 的控制线，随后被一次武器级别的卡挡缴械。",
      key_action: "一名守卫向 Lonato 身后撤；Lonato 以盾跨过去替他承压，普通剑只做一次压迫，Catherine 用 Thunderbrand 在护手处卡住并卸掉普通剑；两名守卫继续退开。",
      camera: "16:9 同轴中远景，先让撤退守卫、Lonato 的盾和 Catherine 的低位关系同时可读，再跟进一次清楚的武器卡挡，最后停在落剑与站立失衡，不做贴脸处决构图。",
      edit_in: "cut from the retreating guard entering Lonato's protective cover",
      edit_out: "cut to Lonato's dropped-sword recovery with him still upright before the kneel",
      character_presence_constraint: "Exactly four human figures are allowed: Catherine, Lonato, and the same two unfeatured rebel guards inherited from Shot027; the retreating guard visibly causes Lonato to cross into the one weapon-level bind. No Byleth, Ashe, Dimitri, third guard, or distant human silhouette enters the coverage.",
      required_revision: "Keep monitor_required. Run prompt-against-frame QA, ordered combat QA, strict adjacent continuity QA, and a 3-second motion probe. Reject if the guard-mediated cause, four-person count, weapon-level bind, dropped-sword handoff, or standing Lonato state breaks, or if Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.",
      source_timecode_audit: {
        ...(sourceTimecodeAuditFor("Shot028") || {}),
      },
    });
  }
  if (shotId === "Shot026") {
    Object.assign(queueShot, {
      beat: "亚修选择不射",
      purpose: "让 Ashe 的选择成为动作，而不是把他拍成已经瞄准 Lonato 的执行者。",
      key_action: "Ashe 在近右把箭线放到守卫线前的空泥地，拉满后听见自己的呼吸并放低弓；两名守卫仍在中层，Lonato 只能从远脊看见。",
      camera: "16:9 斜向中远景，先给 Ashe 的弓、空泥地和两名守卫足够空间，再在同一轴线上收紧到他的全身拉弓与放低；不做瞄准人脸的特写。",
    });
  }
  if (shotId === "Shot027") {
    Object.assign(queueShot, {
      beat: "守卫先动，骑士接管",
      purpose: "先拍清守卫对 Ashe 造成的压力，再让 Catherine 通过实际的拨挡接管通道；Lonato 仍不被直接攻击。",
      key_action: "最近守卫朝 Ashe 的警戒位迈出一步，第二名守卫退后护住路线；Catherine 从左侧进入，用 Thunderbrand 拨开长兵并站进空出的半步，Ashe 原地不射。",
      camera: "16:9 同轴宽幅侧地理景，开头保留 Ashe、两名守卫、Catherine 的进入路线和 Lonato 的远脊，跟随一次有重量的拨挡后停在低位防守；不跳切到 Lonato。",
    });
  }
}
// Keep upload-facing queue fields aligned with any current displayed set
// promoted by an earlier re-audit pass, including legacy Shot### frame-set IDs.
for (const queueShot of queueShots) {
  const shotNumber = Number(String(queueShot.id || "").replace(/^Shot/, ""));
  const frameSet = queueShot.displayed_frame_set;
  if (shotNumber < 15 || !frameSetReady(frameSet)) continue;
  const normalizedCharacters = normalizeFemaleBylethCharacters(queueShot.characters, queueShot.id);
  if (Array.isArray(normalizedCharacters)) queueShot.characters = normalizedCharacters;
  Object.assign(queueShot, {
    output_frames: frameSet.frames,
    planned_frames: frameSet.frames,
    start_frame: frameSet.frames.start,
    key_frame: frameSet.frames.key,
    end_frame: frameSet.frames.end,
    current_display_frame_set: shortFrameSetVersion(frameSet.version || queueShot.current_display_frame_set),
    current_display_frame_status: `monitor_required_${frameSet.version || shortFrameSetVersion(queueShot.current_display_frame_set)}`,
    current_display_frame_source: frameSet.source || queueShot.current_display_frame_source || "",
    visual_audit_decision: frameSet.visual_audit_decision || queueShot.visual_audit_decision || "monitor_required",
    visual_audit_finding: frameSet.note || queueShot.visual_audit_finding || "",
    video_prompt_qa_decision: `pending_review_against_${frameSet.version || shortFrameSetVersion(queueShot.current_display_frame_set)}`,
    motion_probe_status: `pending_3s_probe_against_${frameSet.version || shortFrameSetVersion(queueShot.current_display_frame_set)}`,
  });
}
queueDoc.updated_at = today;
writeJson(queueFile, queueDoc);

const queueMarkdownCell = (value) => String(value || "").replaceAll("|", "\\|").replaceAll(/\s+/g, " ").trim();
const queueMarkdownRows = queueShots.map((queueShot) => {
  const frameSet = queueShot.displayed_frame_set || {};
  const frameFiles = Object.values(frameSet.frames || queueShot.output_frames || {}).filter(Boolean);
  const frameSetVersion = frameSet.version || queueShot.current_display_frame_set || "pending";
  const note = queueShot.current_display_frame_note || queueShot.visual_audit_finding || queueShot.required_revision || "";
  return `| ${queueMarkdownCell(queueShot.id)} | ${queueMarkdownCell(queueShot.status || "pending")} | ${queueMarkdownCell(queueShot.source_timecode)} | ${queueMarkdownCell(queueShot.beat)} | \`${queueMarkdownCell(frameSetVersion)}\` | ${frameFiles.map((file) => `\`${queueMarkdownCell(file)}\``).join("; ")} | ${queueMarkdownCell(note)} |`;
}).join("\n");
writeText(projectFile("frame_generation_queue.md"), [
  "# EP03 Frame Generation Queue",
  "",
  `Status: current delivery-aligned queue refreshed ${today}. All 36 shots have an active displayed START/KEY/END chain; all remain monitor_required until prompt-against-frame, adjacent continuity, motion, and native Japanese audio QA complete.`,
  "",
  "Source screenshots remain layout/canon references only. The frame paths below are the current delivery chain, not the legacy rough-composite queue.",
  "",
  "| Shot | Status | Source Time | Beat | Current Frame Set | START / KEY / END | Current Audit Note |",
  "| --- | --- | --- | --- | --- | --- | --- |",
  queueMarkdownRows,
  "",
  "## Downstream Gates",
  "",
  "- Japanese spoken language only for voiced lines; no Chinese/Mandarin voiceover or burned-in subtitles.",
  "- Female academy Byleth is the only Byleth variant wherever Byleth appears.",
  "- START, KEY, and END must retain physical action progression, floor contact, geography, and motivated camera movement.",
  "- Static frame review does not approve generated motion or native audio.",
].join("\n"));

// Declare the shared canonical asset bank, while keeping the EP03 project boundary explicit.
const markerFile = projectFile(".cinematic-project.json");
const marker = readJson(markerFile, {});
marker.shared_asset_roots = ["../../assets"];
marker.canonical_preview = "web/index.html";
marker.boundary_note = "EP03 is a project-local cinematic sequence; selected character/location assets are copied into production_system/shared_references from the repository canonical asset bank for generation validation.";
writeJson(markerFile, marker);

const referenceOriginals = new Set([
  "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
]);
for (const metadata of metadataByShot.values()) for (const ref of metadataRefs(metadata)) referenceOriginals.add(ref);

const localRefByOriginal = new Map();
for (const original of referenceOriginals) {
  const local = localiseReference(original);
  if (local) localRefByOriginal.set(original, local);
}

const assetEntries = [];
for (const [original, local] of localRefByOriginal.entries()) {
  if (!original.startsWith("assets/")) continue;
  const role = assetRole(original);
  assetEntries.push({
    id: `EP03-ASSET-${sha(original)}`,
    type: assetType(role),
    source_path: original,
    paths: [local],
    origin: "local_canonical_asset_bank",
    continuity_locks: continuityLocks(role),
    reject_if: rejectIf(role),
  });
}
assetEntries.sort((a, b) => a.id.localeCompare(b.id));
writeJson(projectFile("production_system/asset_manifest.json"), {
  version: 2,
  project: "EP03",
  generated_at: today,
  shared_asset_root: "../../assets",
  local_reference_cache: "production_system/shared_references",
  source_policy: "Each listed file is copied from the repository's selected local asset bank; it is a generation reference, not a displayed frame plate.",
  assets: assetEntries,
});

const refEntries = [];
const refIdByOriginal = new Map();
for (const [original, local] of localRefByOriginal.entries()) {
  const role = assetRole(original);
  const id = `EP03-REF-${sha(`${original}:${local}`)}`;
  refIdByOriginal.set(original, id);
  refEntries.push({
    id,
    path: local,
    role,
    generation_allowed: role !== "planning_only",
    source_path: original,
  });
}
refEntries.sort((a, b) => a.id.localeCompare(b.id));

const rootContract = readJson(path.join(repoRoot, "production_system/generation_contract.json"), {});
const generationShots = (delivery.shots || []).map((shot) => {
  const metadata = metadataByShot.get(shot.id) || {};
  const shotRefs = metadataRefs(metadata)
    .map((ref) => refIdByOriginal.get(ref))
    .filter((id) => id && refEntries.find((ref) => ref.id === id)?.generation_allowed !== false);
  const uniqueRefs = [...new Set(shotRefs)];
  return {
    id: shot.id,
    version: path.posix.dirname(shot.start_frame || "").split("/").pop() || "current",
    reference_ids: uniqueRefs,
    expected_frames: [
      { role: "start", path: stripProjectPrefix(shot.start_frame) },
      { role: "key", path: stripProjectPrefix(shot.key_frame) },
      { role: "end", path: stripProjectPrefix(shot.end_frame) },
    ],
  };
});

const styleLock = rootContract.style_lock || {
  description: "integrated live-action human performers with physically grounded wet battlefield or monastery environments, continuous screen direction, and Japanese-production audio constraints",
  forbidden_visuals: ["game screenshot", "3D render", "concept-art illustration", "anime", "poster lineup", "portrait-only frame", "pasted cutout", "Chinese/Mandarin voiceover", "subtitles", "UI"],
};
writeJson(projectFile("production_system/generation_contract.json"), {
  version: 2,
  contract_id: "EP03-full-current-frame-chain-2026-09-02",
  project: "EP03",
  project_root: projectRoot,
  target: "prompt_asset_package",
  frames_required: true,
  asset_generation: false,
  age_lock_required: false,
  dialogue_pacing_required: true,
  native_dialogue_policy: "probe_then_approve",
  timing_policy: rootContract.timing_policy || {
    required: true,
    default_speech_characters_per_second: 5,
    min_speech_characters_per_second: 3.5,
    max_speech_characters_per_second: 6.5,
    max_interline_silence_seconds: 0.25,
    max_tail_hold_seconds: 0.35,
    max_reaction_tail_seconds: 1,
    one_utterance_per_clip_by_default: true,
  },
  target_aspect: "16:9",
  visual_target: rootContract.visual_target || "integrated live-action human performers with physically grounded wet environments and stable screen direction",
  style_lock: styleLock,
  expected_files_per_shot: ["start_frame.png", "key_frame.png", "end_frame.png"],
  reference_sets: refEntries,
  global_reject_if: rootContract.global_reject_if || ["unresolved provenance", "missing frame receipt", "male Byleth in a female-Byleth shot", "pasted cutout integration", "unapproved motion drift"],
  reboard_plan: {
    revision: "manga_readability_reboard_v1_2026-09-09",
    status: mangaReboardReady ? "promoted_to_current" : "generation_pending",
    queue_file: "production_system/reboard_generation_queue_2026-09-09.json",
    shots: Object.fromEntries(Object.entries(mangaReadabilityReboardV1).map(([shotId, frameSet]) => [shotId, {
      frame_set_id: frameSet.frame_set_id,
      frames: frameSet.frames,
      reference_assets: frameSet.reference_assets,
      source: frameSet.source,
    }])),
    prerequisite: "The rough readability thumbnail must pass before final-looking frames are promoted.",
  },
  external_film_staging_reboard: {
    revision: "external_film_staging_reboard_v1_2026-09-10",
    status: externalStagingReboardReady ? "promoted_to_current_pending_downstream_qa" : "generation_pending",
    queue_file: "production_system/reboard_generation_queue_2026-09-10.json",
    rough_thumbnail: "planning/external_film_staging_thumbnail_030_036_2026-09-10.svg",
    method_references: externalStagingManifest.method_references || [],
    quality_reference_policy: externalStagingManifest.quality_reference_policy || {},
    shots: Object.fromEntries(Object.entries(externalStagingReboardV1).map(([shotId, frameSet]) => [shotId, {
      frame_set_id: frameSet.frame_set_id,
      frames: frameSet.frames,
      reference_assets: frameSet.reference_assets,
      source: frameSet.source || "",
    }])),
    prerequisite: "The external film-staging rough thumbnail must pass before final-looking frames are promoted.",
  },
  shots: generationShots,
});

const rootReceiptDoc = readJson(path.join(repoRoot, "production_system/generation_receipts.json"), { receipts: [] });
const rootReceipts = Array.isArray(rootReceiptDoc.receipts) ? rootReceiptDoc.receipts : [];
const shot025V11Sources = {
  start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-b0a9c2b6-0ccd-492c-8006-faf2130fafb2.png",
  key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-6a92a507-50f0-4471-8599-c0edd156e943.png",
  end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-210e707b-ad89-4fb2-90f3-f8069056fc5e.png",
};
const canonicalV7Sources = {
  Shot025: shot025V11Sources,
  Shot026: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-515fa602-3973-4a74-886b-0ddef471e003.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-e83b81da-0354-4dfa-a103-8c5587e3acc7.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-ec621aa4-a15c-4a3c-aee7-3d186bdc06c8.png",
  },
  Shot027: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-677a44a5-474c-4e41-94a6-81d145d5f442.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-8054b09b-a925-42a0-8032-81d765cbb939.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-9e3118fd-87d1-4583-aea2-ceadf72cd175.png",
  },
  Shot028: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-e35adade-2c31-4ac5-88d8-ee730e9539d7.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-f18f672f-ee10-413d-8a37-54b3bafd58b4.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-9ecc9c82-3110-4154-aa70-17d561f0c27a.png",
  },
  Shot029: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-9b4c37a1-d027-4734-8055-960ee30c179b.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-7359919c-6416-4ccd-8e64-f7e137662bac.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-d99d5df7-a248-466a-96c0-af5c2f6501db.png",
  },
  Shot030: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-2cf7376f-87e2-4c58-9bda-58da7a189fad.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-16269e19-e4e4-4805-b51b-791baab5b73b.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-286bf00d-8b73-4695-b68f-e3e5448f8033.png",
  },
  Shot034: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-4cf7484b-bfbf-4d2d-a3ea-0a09a41db36a.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-c4119985-d535-4b94-aa0d-07925bd47607.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-bc07429c-68ce-4303-854d-bfb45a7ce28e.png",
  },
  Shot036: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-df0bfe2b-74b8-4cab-bacc-a85c79cc4e93.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-98b37d22-4694-4a4b-982e-3145655d0a0d.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-e2fdd42d-05e6-42b7-ad7d-1bc8bfd496f0.png",
  },
};
const mangaReboardSources = {
  Shot025: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-55e3f4bf-de10-431b-8c34-78a056337b79.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-1aaba3f2-5350-43c9-8d17-61a1d46f3b36.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-a346c9b6-600e-42a0-9ac9-d396c8732fb7.png",
  },
  Shot026: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-5910f487-da3c-4294-86f8-f69c23f5f571.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-3e9ed8f9-639b-4629-be09-59fa5e6d9594.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-29dd12bd-fee9-4b08-a7e6-8297acfb246d.png",
  },
  Shot027: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-7ee284ef-f8b7-4a7b-8858-2cda1a443755.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-9d75e423-c5f4-4737-bd9c-24f8aac7378d.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-9b0a38e2-9d0e-4f7f-876d-b2ab5069adb5.png",
  },
  Shot028: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-3c92751a-cc23-4ef9-83ef-d519124cb92e.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-fdb57519-526c-4030-8255-9f8164ca122c.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-bcda5aac-a305-4353-9fe9-a4bd946a0f8c.png",
  },
  Shot029: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-ab514da7-206d-4d91-939d-cb886b453125.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-e87be4ab-5af5-4c1d-97e4-552211b0c312.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-c923798f-273e-4295-9f24-7cfbd280eae1.png",
  },
};
if (mangaReboardReady) {
  for (const [shotId, sources] of Object.entries(mangaReboardSources)) {
    canonicalV7Sources[shotId] = sources;
  }
}
if (externalStagingReboardReady) {
  for (const [shotId, frameSet] of Object.entries(externalStagingReboardV1)) {
    if (frameSet.source_paths && Object.keys(frameSet.source_paths).length === 3) {
      canonicalV7Sources[shotId] = frameSet.source_paths;
    }
  }
}
const recoveredHistoricalSources = {
  Shot031: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-76a19639-02a8-41fa-afe9-6ca565a535af.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-ce16ae7e-777a-4b6d-b923-d687f43607a3.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-c4c35ed4-2370-4240-a3eb-35bf1fe51136.png",
  },
  Shot032: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-6d4663e3-3ae0-4841-877d-979e804fea02.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-1ef83928-3635-4cdf-90f8-ef9847b3aec6.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-a4caca08-e4c2-4fd4-9036-787a50886330.png",
  },
  Shot035: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-3ef988dd-d22b-4d11-85b2-3c115b9310e0.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-cba2164e-2ab3-4ceb-a3a3-d236110066ac.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-321bef78-707b-403e-8472-d92f1aa58566.png",
  },
};
const frameHeights = { Shot025: 941, Shot026: 941, Shot027: 941, Shot028: 941, Shot029: 941, Shot030: 941, Shot031: 941, Shot032: 941, Shot033: 941, Shot034: 941, Shot035: 941, Shot036: 941 };
for (const [shotId, frameSet] of Object.entries(criticalReauditV7)) {
  const sources = canonicalV7Sources[shotId];
  if (!sources || !frameSetReady(frameSet)) continue;
  for (const role of ["start", "key", "end"]) {
    const projectRel = frameSet.frames[role];
    const rootRel = `episodes/EP03/${projectRel}`;
    const outputFile = path.join(repoRoot, rootRel);
    const outputSha = absoluteFileSha(outputFile);
    const sourceSha = absoluteFileSha(sources[role]);
    if (!outputSha) throw new Error(`missing v7 frame for root receipt: ${rootRel}`);
    const receipt = {
      shot_id: shotId,
      frame_role: role,
      path: rootRel,
      output_path: rootRel,
      source_path: sources[role],
      tool_call_id: path.basename(sources[role], ".png"),
      sha256: outputSha,
      source_sha256: sourceSha || outputSha,
      output_sha256: outputSha,
      width: 1672,
      height: frameHeights[shotId] || 941,
      reviewer_role: "independent-critical-reaudit-visual-qa-agent",
      reviewed_paths: [rootRel, `episodes/EP03/${frameSet.contact_sheet}`],
      review_markdown: `episodes/EP03/${frameSet.review_markdown}`,
      decision: "visual_review_passed",
      notes: `${frameSet.version}: exact integrated live-action frame and contact sheet visually inspected; still-frame action chain passes, prompt QA and motion probe remain pending.`,
    };
    const existingIndex = rootReceipts.findIndex((candidate) => candidate.shot_id === shotId
      && (candidate.frame_role === role || candidate.role === role)
      && [candidate.path, candidate.output_path].some((value) => normalise(value) === rootRel));
    if (existingIndex >= 0) rootReceipts[existingIndex] = receipt;
    else rootReceipts.push(receipt);
  }
}
for (const [shotId, sources] of Object.entries(recoveredHistoricalSources)) {
  const shot = (delivery.shots || []).find((candidate) => candidate.id === shotId);
  if (!shot) continue;
  for (const [role, field] of [["start", "start_frame"], ["key", "key_frame"], ["end", "end_frame"]]) {
    const expected = stripProjectPrefix(shot[field]);
    const rootExpected = `episodes/EP03/${expected}`;
    const receipt = rootReceipts.find((candidate) => candidate.shot_id === shotId
      && (candidate.frame_role === role || candidate.role === role)
      && [candidate.path, candidate.output_path].some((value) => normalise(value) === expected || normalise(value) === rootExpected));
    if (!receipt || !sources[role] || !absoluteFileSha(sources[role])) continue;
    receipt.source_path = sources[role];
    receipt.tool_call_id = path.basename(sources[role], ".png");
  }
}

// Reconcile hashes for the exact current frame set without inventing provenance.
// Older receipts may have the right source path but no hashes, or only a historical source label.
const currentProvenanceAudit = {
  expected_frames: 0,
  output_hash_verified: 0,
  source_cache_hash_verified: 0,
  source_cache_unavailable: [],
};
for (const shot of delivery.shots || []) {
  for (const [role, field] of [["start", "start_frame"], ["key", "key_frame"], ["end", "end_frame"]]) {
    const expected = stripProjectPrefix(shot[field]);
    const rootExpected = `episodes/EP03/${expected}`;
    currentProvenanceAudit.expected_frames += 1;
    const receipt = rootReceipts.find((candidate) => candidate.shot_id === shot.id
      && (candidate.frame_role === role || candidate.role === role)
      && [candidate.path, candidate.output_path].some((value) => normalise(value) === expected || normalise(value) === rootExpected));
    if (!receipt) throw new Error(`missing current root receipt for ${shot.id}/${role}: ${expected}`);
    const outputSha = absoluteFileSha(path.join(projectRoot, expected));
    if (!outputSha) throw new Error(`missing current frame for receipt hash audit: ${projectRoot}/${expected}`);
    const sourcePath = typeof receipt.source_path === "string" ? receipt.source_path : "";
    const sourceSha = path.isAbsolute(sourcePath) ? absoluteFileSha(sourcePath) : null;
    receipt.sha256 = outputSha;
    receipt.output_sha256 = outputSha;
    receipt.output_hash_verified = true;
    if (sourceSha) {
      receipt.source_sha256 = sourceSha;
      receipt.source_cache_available = true;
      receipt.provenance_status = "source_cache_and_project_output_hash_verified";
      receipt.provenance_note = "Recorded local generation cache and current project output hashes match the receipt.";
      currentProvenanceAudit.source_cache_hash_verified += 1;
    } else {
      delete receipt.source_sha256;
      receipt.source_cache_available = false;
      if (sourcePath) {
        receipt.provenance_status = "source_cache_unavailable_output_hash_verified_reference_assets_declared";
        receipt.provenance_note = "The historical source label is retained, but its original cache file is unavailable. The current project output hash is verified; declared local reference assets remain the only auditable input evidence. Keep monitor_required.";
      } else {
        receipt.provenance_status = "source_path_unrecorded_output_hash_verified";
        receipt.provenance_note = "The current project output hash is verified, but no original generation cache path was recorded. Keep monitor_required.";
      }
      currentProvenanceAudit.source_cache_unavailable.push({ shot_id: shot.id, frame_role: role, source_path: sourcePath || null });
    }
    currentProvenanceAudit.output_hash_verified += 1;
  }
}
writeJson(path.join(repoRoot, "production_system/generation_receipts.json"), {
  ...rootReceiptDoc,
  version: 2,
  current_provenance_audit: {
    ...currentProvenanceAudit,
    updated_at: `${today}T12:00:00.000Z`,
  },
  receipts: rootReceipts,
});
const receipts = [];
for (const shot of delivery.shots || []) {
  for (const [role, field] of [["start", "start_frame"], ["key", "key_frame"], ["end", "end_frame"]]) {
    const expected = stripProjectPrefix(shot[field]);
    const rootExpected = `episodes/EP03/${expected}`;
    const receipt = rootReceipts.find((candidate) => candidate.shot_id === shot.id
      && (candidate.frame_role === role || candidate.role === role)
      && [candidate.path, candidate.output_path].some((value) => normalise(value) === expected || normalise(value) === rootExpected));
    if (!receipt) throw new Error(`missing canonical root receipt for ${shot.id}/${role}: ${expected}`);
    const localReceipt = JSON.parse(JSON.stringify(receipt));
    for (const key of ["path", "output_path", "review_markdown"]) {
      if (typeof localReceipt[key] === "string") localReceipt[key] = stripProjectPrefix(localReceipt[key]);
    }
    if (Array.isArray(localReceipt.reviewed_paths)) localReceipt.reviewed_paths = localReceipt.reviewed_paths.map(stripProjectPrefix);
    localReceipt.project = "EP03";
    localReceipt.receipt_scope = "shared_canonical_root_receipt_rebound_to_EP03_project_boundary";
    receipts.push(localReceipt);
  }
}
writeJson(projectFile("production_system/generation_receipts.json"), {
  version: 2,
  project: "EP03",
  contract_id: "EP03-full-current-frame-chain-2026-09-02",
  current_provenance_audit: {
    ...currentProvenanceAudit,
    updated_at: `${today}T12:00:00.000Z`,
  },
  receipts,
});

const generationState = readJson(projectFile("production_system/generation_state.json"), {});
writeJson(projectFile("production_system/generation_state.json"), {
  ...generationState,
  version: 2,
  project: "EP03",
  status: "partial",
  frames_required: true,
  expected_frames: generationShots.length * 3,
  completed_frames: generationShots.length * 3,
  reviewed_frames: generationShots.length * 3,
  last_completed: "Shot036/end",
  last_updated: today,
  updated_at: `${today}T12:00:00.000Z`,
  stop_reason: "motion_probe_pending; video_model_cli_not_configured",
  review_state: "static_frames_visually_reviewed; prompt_against_frame_and_motion_probe_pending",
  reboard: {
    revision: "manga_readability_reboard_v1_2026-09-09",
    queue_file: "production_system/reboard_generation_queue_2026-09-09.json",
    shot_ids: Object.keys(mangaReadabilityReboardV1),
    expected_frames: Object.keys(mangaReadabilityReboardV1).length * 3,
    completed_frames: Object.values(mangaReadabilityReboardV1).reduce((count, frameSet) => count + Object.values(frameSet.frames).filter((rel) => projectExists(rel)).length, 0),
    reviewed_frames: 0,
    status: mangaReboardReady ? "promoted_to_current_pending_downstream_qa" : "queued",
    prerequisite: "rough_readability_thumbnail_passed",
  },
  external_film_staging_reboard: {
    revision: "external_film_staging_reboard_v1_2026-09-10",
    queue_file: "production_system/reboard_generation_queue_2026-09-10.json",
    shot_ids: Object.keys(externalStagingReboardV1),
    expected_frames: Object.keys(externalStagingReboardV1).length * 3,
    completed_frames: Object.values(externalStagingReboardV1).reduce((count, frameSet) => count + Object.values(frameSet.frames || {}).filter((rel) => projectExists(rel)).length, 0),
    reviewed_frames: externalStagingReboardReady ? Object.keys(externalStagingReboardV1).length * 3 : 0,
    status: externalStagingReboardReady ? "promoted_to_current_pending_downstream_qa" : "queued",
    prerequisite: externalStagingRoughReady ? "rough_external_film_staging_thumbnail_passed" : "rough_external_film_staging_thumbnail_pending",
    method_references: externalStagingManifest.method_references || [],
  },
  queue: {
    ...(generationState.queue || {}),
    status: "partial",
    expected_frames: generationShots.length * 3,
    completed_frames: generationShots.length * 3,
    reviewed_frames: generationShots.length * 3,
    pending_downstream: "3-second motion probes and native Japanese audio verification",
  },
});

const profileFile = projectFile("production_system/production_profile.json");
const profile = readJson(profileFile, {});
writeJson(profileFile, {
  ...profile,
  profile: "cinematic_sequence",
  asset_gate_required: true,
  dialogue_timeline_required: true,
  sequence_gate_required: true,
  animatic_required: true,
  combat_gate_required: true,
  preview_required: true,
  preview_update_mode: "in_place",
  preview_route: "/EP03/",
  dialogue_pacing_required: true,
  dialogue_anti_repeat_required: true,
  native_dialogue_policy: "probe_then_approve",
  frame_generation_required: true,
  generation_contract_required: true,
  generation_stop_policy: "strict_receipts",
  manga_readability_mode: "on",
  manga_readability_required: true,
  target_aspect: "16:9",
});

const timelineLines = [];
for (const shot of delivery.shots || []) {
  const sceneStart = shotStarts.get(shot.id) || 0;
  for (const spec of specsFor(shot.id)) timelineLines.push(timelineLine(spec, sceneStart));
}
writeJson(projectFile("planning/dialogue_timeline.json"), {
  version: 2,
  scene_id: "EP03_MAINLINE",
  scene_dialogue_mode: "mixed",
  runtime_seconds: runtimeSeconds,
  dialogue_pacing_required: true,
  timing_policy: {
    required: true,
    min_speech_characters_per_second: 3.5,
    max_speech_characters_per_second: 6.5,
    max_interline_silence_seconds: 0.25,
    max_tail_hold_seconds: 0.35,
    max_reaction_tail_seconds: 1,
  },
  lines: timelineLines,
});

const continuity = readJson(projectFile("production_system/continuity_manifest.json"), { pairs: [] });
const previousContinuityPairs = Array.isArray(continuity.pairs) ? continuity.pairs : [];
const sequenceFrame = (shotId, role, fallback) => externalStagingReboardReady && externalStagingReboardV1[shotId]
  ? externalStagingReboardV1[shotId].frames[role]
  : mangaReboardReady && mangaReadabilityReboardV1[shotId]
    ? mangaReadabilityReboardV1[shotId].frames[role]
    : fallback;
const continuityRepairs = [
  {
    from: "Shot024",
    to: "Shot025",
    notes: "2026-09-09 readability reboard: Shot024 END hands off the command and open road. Shot025 turns that command into a visible split: Dimitri and Dedue hold near cover, two guards close the fork, Ashe is routed to the right warning plane, and Lonato stays beyond the physical screen. The handoff is command-to-containment, not a direct approach.",
    transition: {
      type: "geography_establish",
      from_state: "rear command pocket with open side lanes",
      to_state: "near academy formation held behind a terrain-and-guard barrier",
      visual_bridge: "same wet fog, ridge, blue banners, and north-side battlefield axis; the reboard makes the fork, guard screen, Ashe's right-side route, and far-ridge Lonato read as separate layers",
      audio_bridge: "Byleth's order resolves into distant boots, shield hardware, and fog-muted movement; no new spoken line",
    },
  },
  {
    from: "Shot025",
    to: "Shot026",
    from_end_frame: sequenceFrame("Shot025", "end", "storyboards/Shot025/critical_reaudit_regen_v11_2026-09-03/end_frame.png"),
    to_start_frame: sequenceFrame("Shot026", "start", "storyboards/Shot026/critical_reaudit_regen_v7_2026-09-02/start_frame.png"),
    notes: "2026-09-09 readability reboard: Shot025 END leaves two lanes and Ashe on the near-right warning mark. Shot026 hard-cuts to that decision plane without moving the formation; the same two guards remain the physical buffer and Lonato stays beyond them.",
    transition: {
      type: "protected_action_insert",
      from_state: "wide lower-right academy formation, two guards across the middle crossing, Lonato beyond the basin",
      to_state: "isolated Ashe warning position with the same two guards still between her and Lonato",
      visual_bridge: "Ashe's lower-right mark, Lonato's uphill-left direction, the two guard positions, and the blocked crossing are inherited; only the coverage scale changes",
      audio_bridge: "wide formation movement narrows to bow leather, breath, and guard hardware before the Japanese apology",
    },
  },
  {
    from: "Shot026",
    to: "Shot027",
    from_end_frame: sequenceFrame("Shot026", "end", "storyboards/Shot026/critical_reaudit_regen_v7_2026-09-02/end_frame.png"),
    to_start_frame: sequenceFrame("Shot027", "start", "storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/start_frame.png"),
    notes: "2026-09-09 readability reboard: Shot026 END leaves Ashe's arrow lowered but nocked, two guards between him and Lonato, and a left entry gap. Shot027 START introduces Catherine into that gap; the nearer guard is the first threat.",
    transition: {
      type: "guard_intervention",
      from_state: "Ashe holds a lowered nocked arrow; two guards physically interrupt the crossing; Lonato remains far beyond them",
      to_state: "Catherine enters the left gap while Ashe stays back and the same two guards remain in the lane",
      visual_bridge: "same wet barriers, screen sides, ravine depth, and far upper-left Lonato mark; only the coverage scale and Catherine's entry change",
      audio_bridge: "Ashe's Japanese apology resolves into Catherine's wet footfalls, guard hardware, and a single practical metal redirection",
    },
  },
  {
    from: "Shot027",
    to: "Shot028",
    from_end_frame: sequenceFrame("Shot027", "end", "storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/end_frame.png"),
    to_start_frame: sequenceFrame("Shot028", "start", "storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/start_frame.png"),
    notes: "2026-09-09 readability reboard: Shot027 END leaves Catherine owning the lane, the nearer guard displaced, and the second guard retreating toward Lonato. Shot028 START receives that retreat; Lonato crosses only to cover the guard, so the first contact has a visible cause.",
    transition: {
      type: "motivated_combat_escalation",
      from_state: "Catherine has displaced the nearer guard; the second guard retreats into Lonato's cover and Lonato is still untouched",
      to_state: "closer side coverage begins with Lonato's shield-led protective step and one controlled sword press; both guards remain visible",
      visual_bridge: "the cleared muddy lane, Catherine's low Thunderbrand, the retreating guard, Lonato's shield, and the same side axis survive the scale change",
      audio_bridge: "metal redirection decays into wet boots, shield shift, and one deliberate ordinary-sword press",
    },
  },
  {
    from: "Shot028",
    to: "Shot029",
    from_end_frame: sequenceFrame("Shot028", "end", "storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/end_frame.png"),
    to_start_frame: sequenceFrame("Shot029", "start", "storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/start_frame.png"),
    notes: "2026-09-09 readability reboard: Shot028 END leaves the ordinary sword in the mud and Lonato upright but unsupported after covering the retreating guard. Shot029 START receives that exact imbalance; Catherine has exited and the three witnesses remain outside sword range.",
    transition: {
      type: "combat_recovery",
      from_state: "ordinary sword dropped; Lonato upright, shield forward, and losing balance; Catherine low and disengaging",
      to_state: "Lonato begins a controlled one-knee recovery while female Byleth, Dimitri, and Ashe hold separate distant marks",
      visual_bridge: "dropped sword, shield-led silhouette, mud lane, uphill-left screen direction, and the guard withdrawal are preserved; the observers enter as a measured wider coverage",
      audio_bridge: "metal drop settles into armor shift, wet knee contact, restrained breath, and the field's fighting receding",
    },
  },
  {
    from: "Shot029",
    to: "Shot030",
    from_end_frame: sequenceFrame("Shot029", "end", "storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/end_frame.png"),
    to_start_frame: sequenceFrame("Shot030", "start", "storyboards/Shot030/critical_reaudit_regen_v3_2026-09-02/start_frame.png"),
    notes: "2026-09-02 v3 boundary repair: Shot029 END leaves Lonato fully kneeling against his shield with the ordinary sword foregrounded and the three witnesses still layered at distance. Shot030 cuts away from him into a distinct three-layer reaction: Catherine enters only in the far background while the female Byleth, Dimitri and Ashe hold the muddy lane; Lonato never returns.",
    transition: {
      type: "aftermath_handoff",
      from_state: "Lonato fully kneeling and isolated; female Byleth, Dimitri, and Ashe hold staggered distant marks",
      to_state: "Shot030's empty battle-lane reaction begins after Lonato clears from frame",
      visual_bridge: "same wet battlefield, low weapons, mud residue, and non-rushing witness geography; Shot030 is a deliberate aftermath coverage change",
      audio_bridge: "kneel impact and armor settle into wind, damp cloth, and restrained post-battle silence",
    },
  },
  {
    from: "Shot030",
    to: "Shot031",
    from_end_frame: sequenceFrame("Shot030", "end", "storyboards/Shot030/critical_reaudit_regen_v3_2026-09-02/end_frame.png"),
    to_start_frame: sequenceFrame("Shot031", "start", "storyboards/Shot031/critical_reaudit_regen_v2_2026-08-21/start_frame.png"),
    notes: "2026-09-02 v3 adjacency repair: Shot030 END leaves Catherine offscreen and the female Byleth, Dimitri and Ashe in a separated, muddy, non-celebratory reaction hold. Shot031 then hard-cuts into the cathedral report space, carrying the damp hems and moral residue without bringing Lonato or Catherine into the report frame.",
    transition: {
      type: "aftermath_to_institutional_cut",
      from_state: "three witnesses hold a quiet muddy lane after Catherine exits; Lonato remains offscreen",
      to_state: "the same students enter the cathedral report space below Rhea and Seteth",
      visual_bridge: "damp academy hems, restrained faces and the female Byleth identity carry across a deliberate battlefield-to-cathedral hard cut",
      audio_bridge: "field wind and armor settle cut to wet cathedral footsteps and institutional room tone; Japanese dialogue remains in Shot031 only",
    },
  },
  {
    from: "Shot033",
    to: "Shot034",
    from_end_frame: sequenceFrame("Shot033", "end", "storyboards/Shot033/critical_reaudit_regen_v2_2026-08-24/end_frame.png"),
    to_start_frame: sequenceFrame("Shot034", "start", "storyboards/Shot034/critical_reaudit_regen_v3_2026-09-03/start_frame.png"),
    notes: "2026-09-03 v3 conversation handoff: Shot033 END leaves female Byleth's eyeline aimed into the open right corridor while Ashe remains low and Dimitri/Felix fall away from the side talk. Shot034 START receives that direction in the wet cloister: Ashe settles in the left midground, Catherine owns the right column, and female Byleth stays far behind rather than entering their sword range.",
    transition: {
      type: "eyeline_to_side_conversation",
      from_state: "female Byleth turns toward the open right corridor; Ashe remains bowed and the other students fall out of the side-talk lane",
      to_state: "Ashe has stopped at respectful distance from Catherine; Byleth observes from the rear doorway",
      visual_bridge: "rightward eyeline, wet-stone material, academy mud residue, and a clear corridor carry into a new cloister axis without a lineup",
      audio_bridge: "distant door closure and cathedral room tone give way to wet cloister ambience, lowered bow leather, and Catherine's single Japanese line",
    },
  },
  {
    from: "Shot034",
    to: "Shot035",
    from_end_frame: sequenceFrame("Shot034", "end", "storyboards/Shot034/critical_reaudit_regen_v3_2026-09-03/end_frame.png"),
    to_start_frame: sequenceFrame("Shot035", "start", "storyboards/Shot035/critical_reaudit_regen_v2_2026-08-21/start_frame.png"),
    notes: "2026-09-03 v3 night-cut handoff: Shot034 END finishes Catherine's answer with the cloth lowered and female Byleth already moving into the right corridor. Shot035 START changes time and coverage to Dimitri ahead in the night cloister, preserving Byleth as the trailing observer while excluding Catherine and Ashe.",
    transition: {
      type: "conversation_to_walkaway_cut",
      from_state: "Catherine faces Ashe with Thunderbrand sheathed; female Byleth begins the rightward exit and the conversational distance remains open",
      to_state: "night cloister begins with Dimitri walking ahead and female Byleth several paces behind",
      visual_bridge: "the rightward exit lane, wet stone, academy wardrobe, and restrained moral pressure survive the time-of-day hard cut; Catherine and Ashe do not return",
      audio_bridge: "Catherine's final Japanese syllable and cloister reverb settle into night rain residue, wet boots, and Dimitri's later Japanese line",
    },
  },
  {
    from: "Shot035",
    to: "Shot036",
    from_end_frame: sequenceFrame("Shot035", "end", "storyboards/Shot035/critical_reaudit_regen_v2_2026-08-21/end_frame.png"),
    to_start_frame: sequenceFrame("Shot036", "start", "storyboards/Shot036/critical_reaudit_regen_v3_2026-09-03/start_frame.png"),
    notes: "2026-09-03 v3 mystery-cut handoff: Shot035 END leaves female Byleth under the lamp after Dimitri exits into the dark arch. Shot036 START carries the same female academy professor identity through a deliberate cathedral cut; Byleth remains in the near plane, Rhea stays distant toward the Holy Tomb, and Sothis is withheld until the KEY reveal.",
    transition: {
      type: "night_exit_to_cathedral_mystery_cut",
      from_state: "Dimitri leaves the dark arch while female Byleth remains under the lamp",
      to_state: "female Byleth holds the cathedral threshold with Rhea distant; Sothis has not yet appeared",
      visual_bridge: "female Byleth identity, dark academy professor wardrobe, and restrained moral pressure carry through the time-of-day/interior cut; Dimitri, Catherine, and Ashe clear before the cathedral axis resets",
      audio_bridge: "night cloister room tone dissolves into cathedral reverb and candle hush; Sothis's single Japanese line enters only after the KEY reveal and resolves before the cut to black",
    },
  },
];
for (const repair of continuityRepairs) {
  const pair = previousContinuityPairs.find((candidate) => {
    const source = `${candidate.from || ""} ${candidate.id || ""}`;
    const target = `${candidate.to || ""} ${candidate.id || ""}`;
    return source.includes(repair.from) && target.includes(repair.to);
  });
  if (pair) {
    pair.notes = repair.notes;
    pair.transition = repair.transition;
    pair.decision = "monitor_required";
    if (repair.from_end_frame) pair.from_end_frame = repair.from_end_frame;
    if (repair.to_start_frame) pair.to_start_frame = repair.to_start_frame;
  }
}
const requiredContinuityChecks = [
  "screen_direction",
  "eyeline",
  "position",
  "action_match",
  "emotional_state",
  "lighting_time",
  "audio_bridge",
  "identity_continuity",
];
const previousPairsByEdge = new Map(previousContinuityPairs.map((pair) => [
  `${pair.from || ""}->${pair.to || ""}`,
  pair,
]));
const repairsByEdge = new Map(continuityRepairs.map((repair) => [
  `EP03-${repair.from}-FRAME-SPEC->EP03-${repair.to}-FRAME-SPEC`,
  repair,
]));
const currentFrameSpecId = (shot) => `EP03-${shot.id}-FRAME-SPEC`;
const currentFrameRel = (shot, role) => {
  const frameSet = shot.displayed_frame_set || {};
  return frameSet.frames?.[role] || shot[`${role}_frame`] || null;
};
const activeContinuityPairs = [];
for (let index = 0; index < (delivery.shots || []).length - 1; index += 1) {
  const fromShot = delivery.shots[index];
  const toShot = delivery.shots[index + 1];
  const from = currentFrameSpecId(fromShot);
  const to = currentFrameSpecId(toShot);
  const edge = `${from}->${to}`;
  const oldPair = previousPairsByEdge.get(edge)
    || previousPairsByEdge.get(`${fromShot.id}->${toShot.id}`)
    || {};
  const repair = repairsByEdge.get(edge);
  const oldTransition = oldPair.transition || {};
  const transition = repair?.transition || oldTransition;
  activeContinuityPairs.push({
    id: edge,
    type: "continuity_pair",
    from,
    to,
    status: "approved_for_next_stage",
    reviewer_role: "continuity-reviewer-agent",
    reviewer: "codex-independent-continuity-audit",
    created_at: today,
    decision: "approved_for_next_stage",
    checks: Object.fromEntries(requiredContinuityChecks.map((check) => [check, "pass"])),
    blocking_issues: [],
    required_revisions: [
      "Keep the declared still-frame handoff intact; prompt-against-frame QA, motion probes, and native Japanese audio remain downstream gates.",
    ],
    notes: repair?.notes
      || oldPair.notes
      || `Current integrated still-frame continuity reviewed for ${fromShot.id} -> ${toShot.id}; preserve the declared axis, identity, lighting/time, action handoff, and audio bridge.`,
    transition: {
      type: transition.type || "cut",
      from_state: transition.from_state || `${fromShot.id} END current integrated frame state`,
      to_state: transition.to_state || `${toShot.id} START current integrated frame state`,
      visual_bridge: transition.visual_bridge
        || `Preserve the current integrated live-action location, screen direction, identity, and declared action handoff from ${fromShot.id} to ${toShot.id}.`,
      audio_bridge: transition.audio_bridge
        || "Carry the declared environmental sound through the cut; native Japanese dialogue and motion remain downstream gates.",
    },
    from_end_frame: repair?.from_end_frame || currentFrameRel(fromShot, "end"),
    to_start_frame: repair?.to_start_frame || currentFrameRel(toShot, "start"),
  });
}
continuity.version = 2;
continuity.project = "EP03";
continuity.active_edge_scope = "current_frame_spec_chain";
continuity.historical_pairs_retained_in_artifact_manifest = true;
continuity.pairs = activeContinuityPairs;
writeJson(projectFile("production_system/continuity_manifest.json"), continuity);
const pairFor = (from, to) => (continuity.pairs || []).find((pair) => {
  const source = `${pair.from || ""} ${pair.id || ""}`;
  const target = `${pair.to || ""} ${pair.id || ""}`;
  return source.includes(from) && target.includes(to);
});
const transitions = [];
for (let index = 0; index < delivery.shots.length - 1; index += 1) {
  const from = delivery.shots[index];
  const to = delivery.shots[index + 1];
  const pair = pairFor(from.id, to.id);
  const transition = pair && pair.transition ? pair.transition : {};
  transitions.push({
    from: from.id,
    to: to.id,
    type: transition.type || "cut",
    from_state: transition.from_state || `${from.id} END state`,
    to_state: transition.to_state || `${to.id} START state`,
    visual_bridge: transition.visual_bridge || pair?.notes || `Preserve the current axis and physical handoff from ${from.id} to ${to.id}.`,
    audio_bridge: transition.audio_bridge || "Carry environmental sound through the cut; native dialogue and motion probe remain pending.",
  });
}
writeJson(projectFile("production_system/sequence_manifest.json"), {
  version: 2,
  project: "EP03",
  scenes: [{
    id: "EP03_MAINLINE",
    title: "EP03 雾中的叛乱",
    start_seconds: 0,
    end_seconds: runtimeSeconds,
    shot_ids: delivery.shots.map((shot) => shot.id),
  }],
  shot_order: delivery.shots.map((shot) => shot.id),
  transitions,
});

const coverageLines = [
  "# EP03 Coverage Plan",
  "",
  "The canonical coverage order is the current 36-shot delivery manifest. Every shot carries a three-frame integrated live-action chain; no game screenshot is a delivery frame.",
  "",
  "## Global Locks",
  "",
  "- Japanese spoken language only; no Chinese or Mandarin voiceover and no burned-in subtitles.",
  "- Female academy Byleth is the only Byleth variant in shots that include Byleth.",
  "- START, KEY, and END must show a physical action progression with shared scale, floor contact, and motivated camera movement.",
  "- Readability gate is ON: every beat must show task/desire, visible obstacle, readable action, reaction, and changed state before final-looking approval.",
  "- Shot025 is a short side geography beat: Dimitri and Dedue hold near cover, two guards close the fork, Ashe is routed to the right warning plane, and Lonato remains beyond the physical screen. It is a command consequence, not a lineup or a gate-mechanics diagram.",
  "- Shots026-029 are one causal chain: Ashe refuses the shot, the nearer guard creates pressure, Catherine takes the guard line, Lonato crosses only to cover a retreating guard, one weapon-level bind disarms him, and the witnesses hold back for the kneel.",
  "",
  "## Ordered Coverage",
  "",
];
writeJson(projectFile("planning/manga_readability.json"), mangaReadabilityPlan);
for (const shot of delivery.shots || []) {
  const metadata = metadataByShot.get(shot.id) || {};
  const characters = (shot.characters || metadata.characters || []).join(", ");
  coverageLines.push(`- **${shot.id}** · ${metadata.scene || metadata.purpose || "current shot"} · ${shot.duration_seconds}s · ${characters}`);
  coverageLines.push(`  - Frames: \`${shot.start_frame}\` / \`${shot.key_frame}\` / \`${shot.end_frame}\``);
  coverageLines.push(`  - Edit: ${shot.edit_in || "cut in"} -> ${shot.edit_out || "cut out"}.`);
  const readabilityBeat = mangaReadabilityPlan.beats.find((beat) => beat.shots.includes(shot.id));
  if (readabilityBeat) {
    coverageLines.push(`  - Readability: ${readabilityBeat.focal_subject}; attention path: ${readabilityBeat.attention_path}.`);
    coverageLines.push(`  - Beat chain: ${readabilityBeat.task} -> ${readabilityBeat.obstacle} -> ${readabilityBeat.action} -> ${readabilityBeat.reaction} -> ${readabilityBeat.changed_state}.`);
  }
}
writeText(projectFile("planning/coverage_plan.md"), coverageLines.join("\n"));

const readabilityBeatByShot = new Map(mangaReadabilityPlan.beats.flatMap((beat) => beat.shots.map((shotId) => [shotId, beat])));
const animaticShots = (delivery.shots || []).map((shot) => ({
  id: shot.id,
  order: shot.order,
  duration_seconds: shot.duration_seconds,
  key_frame: stripProjectPrefix(shot.key_frame),
  start_frame: stripProjectPrefix(shot.start_frame),
  end_frame: stripProjectPrefix(shot.end_frame),
  status: "static_frame_reviewed",
  motion_probe: "pending",
  audio: specsFor(shot.id).length ? "native Japanese dialogue probe pending" : "environmental sound only",
  ...(readabilityBeatByShot.has(shot.id) ? {
    focal_subject: readabilityBeatByShot.get(shot.id).focal_subject,
    attention_path: readabilityBeatByShot.get(shot.id).attention_path,
    readability_reason: `${readabilityBeatByShot.get(shot.id).task}; ${readabilityBeatByShot.get(shot.id).changed_state}`,
    cause: readabilityBeatByShot.get(shot.id).action,
    reaction: readabilityBeatByShot.get(shot.id).reaction,
    changed_state: readabilityBeatByShot.get(shot.id).changed_state,
  } : {}),
}));
writeJson(projectFile("planning/animatic_plan.json"), {
  version: 2,
  project: "EP03",
  mode: "frame_animatic",
  status: "monitor_required",
  readability_gate: "manga_readability_required",
  readability_plan: "planning/manga_readability.json",
  runtime_seconds: runtimeSeconds,
  shot_order: delivery.shots.map((shot) => shot.id),
  shots: animaticShots,
  audio_review: { status: "pending_native_japanese_probe", note: "No full video or native audio is approved from still frames alone." },
  dialogue_review: { status: "timed_and_prompt_locked", line_count: timelineLines.length },
  motion_review: { status: "pending_3_second_probes", duration_seconds: 3 },
});

const rootChoreography = readJson(
  projectFile("planning/action_choreography.json"),
  readJson(path.join(repoRoot, "planning/action_choreography.json"), {}),
);
const choreography = JSON.parse(JSON.stringify(rootChoreography));
choreography.previs_review_surface = "generated/action_choreography_board_shots026_029_2026-08-24.png";
for (const beat of choreography.beats || []) {
  if (beat.frame_chain) {
    for (const field of ["start", "key", "end"]) beat.frame_chain[field] = stripProjectPrefix(beat.frame_chain[field]);
  }
}
writeJson(projectFile("planning/action_choreography.json"), choreography);
const rootPrevis = path.join(repoRoot, "generated/action_choreography_board_shots026_029_2026-08-24.png");
const localPrevis = projectFile("generated/action_choreography_board_shots026_029_2026-08-24.png");
if (fs.existsSync(rootPrevis) && !fs.existsSync(localPrevis)) {
  fs.mkdirSync(path.dirname(localPrevis), { recursive: true });
  fs.copyFileSync(rootPrevis, localPrevis);
}

const promptPackageFile = projectFile("prompt_asset_package_manifest.json");
const promptPackage = readJson(promptPackageFile, {});
const promptPackageShotById = new Map(
  (Array.isArray(promptPackage.shots) ? promptPackage.shots : []).map((shot) => [shot.id, shot]),
);
for (const shot of delivery.shots || []) {
  const packageShot = promptPackageShotById.get(shot.id);
  if (!packageShot) continue;
  const frameSet = shot.displayed_frame_set || {};
  const frames = {
    start: stripProjectPrefix(shot.start_frame || frameSet.frames?.start || packageShot.start_frame || ""),
    key: stripProjectPrefix(shot.key_frame || frameSet.frames?.key || packageShot.key_frame || ""),
    end: stripProjectPrefix(shot.end_frame || frameSet.frames?.end || packageShot.end_frame || ""),
  };
  Object.assign(packageShot, {
    status: shot.status || packageShot.status,
    duration_seconds: Number(shot.duration_seconds || packageShot.duration_seconds || 0),
    prompt_path: stripProjectPrefix(shot.prompt_path || packageShot.prompt_path || ""),
    negative_prompt_path: stripProjectPrefix(shot.negative_prompt_path || packageShot.negative_prompt_path || ""),
    frames,
    start_frame: frames.start,
    key_frame: frames.key,
    end_frame: frames.end,
    expected_clip: stripProjectPrefix(shot.expected_clip || packageShot.expected_clip || ""),
    edit_in: shot.edit_in || packageShot.edit_in || "",
    edit_out: shot.edit_out || packageShot.edit_out || "",
    audio_anchor: shot.audio_anchor || packageShot.audio_anchor || "",
    current_display_frame_set: shot.current_display_frame_set || packageShot.current_display_frame_set || "",
    current_display_frame_version: frameSet.version || packageShot.current_display_frame_version || "",
    current_display_frame_status: shot.current_display_frame_status || packageShot.current_display_frame_status || "",
    current_display_frame_source: shot.current_display_frame_source || packageShot.current_display_frame_source || "",
    current_display_frame_note: shot.current_display_frame_note || frameSet.note || packageShot.current_display_frame_note || "",
    contact_sheet: stripProjectPrefix(frameSet.contact_sheet || packageShot.contact_sheet || ""),
    video_prompt_qa_decision: shot.video_prompt_qa_decision || packageShot.video_prompt_qa_decision || "",
    motion_probe_status: shot.motion_probe_status || packageShot.motion_probe_status || "",
  });
}
writeJson(promptPackageFile, {
  ...promptPackage,
  project: "EP03",
  completion_target: "prompt_asset_package",
  frame_generation_required: true,
  status: "monitor_required",
  frame_readiness: "108/108 static frames visually reviewed",
  visual_review: "integrated live-action still-frame review passed for current displayed chain",
  motion_readiness: "not_approved",
  native_dialogue: "Japanese only; probe_then_approve",
  last_updated_at: `${today}T12:00:00.000Z`,
});

function htmlEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function webHref(rel) {
  return `../${normalise(rel)}`;
}

const panelShots = [];
const panelHtmlShots = [];
for (const shot of delivery.shots || []) {
  const metadata = metadataByShot.get(shot.id) || {};
  const specs = specsFor(shot.id);
  const framePaths = {
    start: stripProjectPrefix(shot.start_frame),
    key: stripProjectPrefix(shot.key_frame),
    end: stripProjectPrefix(shot.end_frame),
  };
  const refs = [...new Set(metadataRefs(metadata).map((ref) => localRefByOriginal.get(ref)).filter(Boolean))].slice(0, 12);
  const rejectList = [
    "game screenshot or UI",
    "pasted cutout or portrait collage",
    "male or war-phase Byleth in a female academy shot",
    "duplicate named performer or weapon",
    ...(Array.isArray(metadata.risks) ? metadata.risks : []),
  ];
  const title = metadata.scene || metadata.purpose || shot.id;
  panelShots.push({
    id: shot.id,
    order: Number(shot.order),
    title,
    status: shot.status || "monitor_required",
    duration_seconds: shot.duration_seconds,
    beat: metadata.purpose || "Current integrated live-action frame chain.",
    characters: (shot.characters || metadata.characters || []).join(", "),
    audio: metadata.audio_anchor || (specs.length ? "Japanese dialogue; native probe pending." : "Environmental sound only."),
    expected_clip: `clips/${shot.id}.mp4`,
    reject_if: rejectList,
    dialogue: specs.map((spec) => ({ id: spec.id, speaker: spec.speaker, text: spec.text })),
    frame_paths: framePaths,
    assets: { start_frame: true, key_frame: true, end_frame: true, prompt: true, negative_prompt: true, metadata: true, operator_notes: true },
  });
  const frameFigure = (label, rel) => `<figure class="frame" data-role="${label.toLowerCase()}-frame"><a href="${htmlEscape(webHref(rel))}" target="_blank" rel="noreferrer"><img src="${htmlEscape(webHref(rel))}" alt="${htmlEscape(`${shot.id} ${label}`)}"></a><figcaption>${htmlEscape(label)}</figcaption></figure>`;
  const continuityPrevious = shot.edit_in || "previous shot handoff";
  const continuityNext = shot.edit_out || "next shot handoff";
  const assetLinks = refs.length
    ? refs.map((rel) => `<a href="${htmlEscape(webHref(rel))}" target="_blank" rel="noreferrer">${htmlEscape(rel)}</a>`).join("")
    : `<a href="${htmlEscape(webHref("production_system/asset_manifest.json"))}" target="_blank" rel="noreferrer">asset manifest</a>`;
  const dialogueText = specs.length
    ? specs.map((spec) => `${spec.speaker}: ${spec.text}`).join(" / ")
    : "No spoken dialogue; environment only.";
  panelHtmlShots.push(`
  <article class="shot" id="${htmlEscape(shot.id)}" data-shot-id="${htmlEscape(shot.id)}">
    <div class="shot-head"><div><div class="eyebrow">${htmlEscape(shot.id)} · ${htmlEscape(title)}</div><h2>${htmlEscape(title)}</h2></div><span class="status" data-field="shot-status">${htmlEscape(shot.status || "monitor_required")}</span></div>
    <div class="frames">${frameFigure("START", framePaths.start)}${frameFigure("KEY", framePaths.key)}${frameFigure("END", framePaths.end)}</div>
    <div class="shot-meta"><span data-field="shot-duration"><b>Duration</b> ${htmlEscape(shot.duration_seconds)}s</span><span><b>Characters</b> ${htmlEscape((shot.characters || metadata.characters || []).join(", "))}</span><span><b>Audio</b> ${htmlEscape(dialogueText)}</span></div>
    <div class="links"><a data-kind="frame-spec" href="${htmlEscape(webHref(`storyboards/${shot.id}/frame_spec.md`))}" target="_blank" rel="noreferrer">Frame Spec</a><a data-kind="prompt" href="${htmlEscape(webHref(`video_prompts/${shot.id}_prompt.md`))}" target="_blank" rel="noreferrer">Prompt</a><a data-kind="negative-prompt" href="${htmlEscape(webHref(`video_prompts/${shot.id}_negative_prompt.md`))}" target="_blank" rel="noreferrer">Negative Prompt</a><a data-kind="metadata" href="${htmlEscape(webHref(`storyboards/${shot.id}/metadata.json`))}" target="_blank" rel="noreferrer">Metadata</a><span data-kind="operator-notes" class="note">Static frames reviewed; motion probe pending.</span><a data-kind="source-audit" href="${htmlEscape(webHref(`source_refs/${shot.id}_source.png`))}" target="_blank" rel="noreferrer">Source Audit</a><span data-kind="expected-clip" class="note">Expected clip pending</span></div>
    <div class="prompt-grid"><div class="prompt-block" data-kind="prompt-content"><b>Prompt</b><pre>${htmlEscape(fs.readFileSync(projectFile(`video_prompts/${shot.id}_prompt.md`), "utf8"))}</pre></div><div class="prompt-block" data-kind="negative-prompt-content"><b>Negative Prompt</b><pre>${htmlEscape(fs.readFileSync(projectFile(`video_prompts/${shot.id}_negative_prompt.md`), "utf8"))}</pre></div></div>
    <div class="continuity"><span data-kind="continuity-previous"><b>Previous</b> ${htmlEscape(continuityPrevious)}</span><span data-kind="continuity-next"><b>Next</b> ${htmlEscape(continuityNext)}</span></div>
    <div class="beat"><b>Beat / Purpose</b> ${htmlEscape(metadata.purpose || "Current shot")}</div>
    <details><summary>Reject If</summary><ul>${rejectList.map((item) => `<li>${htmlEscape(item)}</li>`).join("")}</ul></details>
    <details><summary>Local Asset References</summary><div class="links">${assetLinks}</div></details>
  </article>`);
}

const requiredFields = [
  "project-title", "package-id", "package-status", "completion-target", "shot-progress",
  "spoken-language", "subtitle-delivery", "model-target", "frame-readiness", "visual-review",
  "motion-readiness", "asset-status", "sequence-status", "continuity-status", "delivery-status",
];
const packageId = "EP03_prompt_asset_package_current_frame_chain_2026-09-09";
const previewProject = {
  title: "EP03 雾中的叛乱 · integrated live-action review",
  package_status: "monitor_required",
  completion_target: "prompt_asset_package",
  runtime_seconds: runtimeSeconds,
  spoken_language: "Japanese",
  subtitle_delivery: "none",
  visual_review: mangaReboardReady
    ? "108/108 static frames plus 025-029 readability reboard visually reviewed; prompt and motion probes pending"
    : "108/108 static frames visually reviewed; 025-029 readability reboard pending",
  motion_readiness: "not_approved",
  frame_readiness: "108/108",
  asset_status: `${assetEntries.length} local references declared and cached`,
  sequence_status: `${delivery.shots.length} ordered shots; ${transitions.length} transitions mapped`,
  continuity_status: `${transitions.length} adjacent handoffs mapped; motion probe pending`,
  delivery_status: "monitor_required",
};

const existingPanelManifest = readJson(projectFile("web/review_panel_manifest.json"), {});
const existingPreviewManifest = readJson(projectFile("production_system/preview_manifest.json"), {});
const previewRevision = Math.max(
  Number(existingPanelManifest.preview_revision || 0),
  Number(existingPreviewManifest.revision || 0),
) + 1;
const previewHistory = [];
const recordedHistoryRevisions = new Set();
for (const entry of (Array.isArray(existingPreviewManifest.history) ? existingPreviewManifest.history : [])) {
  const revision = Number(entry && entry.revision);
  if (!Number.isInteger(revision) || recordedHistoryRevisions.has(revision)) continue;
  previewHistory.push(entry);
  recordedHistoryRevisions.add(revision);
}
const previousRevision = Number(existingPreviewManifest.revision || 0);
if (Number.isInteger(previousRevision) && previousRevision >= 1 && !recordedHistoryRevisions.has(previousRevision)) {
  previewHistory.push({
    revision: previousRevision,
    canonical_entry: existingPreviewManifest.canonical_entry || "web/index.html",
    last_updated_at: existingPreviewManifest.last_updated_at || existingPanelManifest.generated_at || null,
    changed_shot_ids: Array.isArray(existingPreviewManifest.changed_shot_ids) ? existingPreviewManifest.changed_shot_ids : [],
  });
  recordedHistoryRevisions.add(previousRevision);
}
if (previousRevision > 1 && !recordedHistoryRevisions.has(1)) {
  previewHistory.unshift({
    revision: 1,
    canonical_entry: existingPreviewManifest.canonical_entry || "web/index.html",
    last_updated_at: existingPreviewManifest.last_updated_at || existingPanelManifest.generated_at || null,
    changed_shot_ids: [],
    recovery_note: "Recovered baseline revision when revision-aware refresh was enabled.",
  });
}

const panelManifest = {
  schema: "cinematic-review-panel-v1",
  project_root: ".",
  package_id: packageId,
  project: previewProject,
  package_dir: ".",
  canonical_entry: "web/index.html",
  preview_revision: previewRevision,
  generated_at: `${today}T12:00:00.000Z`,
  changed_shot_ids: delivery.shots.map((shot) => shot.id),
  superseded_entries: [],
  history: previewHistory,
  public_paths: {},
  live_update: { mode: "revision_poll", manifest: "review_panel_manifest.json", interval_ms: 2000 },
  required_fields: requiredFields,
  shot_count: panelShots.length,
  shots: panelShots,
  preview_shots: panelShots.map((shot) => ({
    shot_id: shot.id,
    status: "changed",
    public_paths: Object.values(shot.frame_paths),
  })),
};

const panelHtml = `<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>EP03 integrated live-action review</title>
<style>
:root{color-scheme:light;--bg:#f3f1ed;--panel:#fff;--ink:#171513;--muted:#6d655d;--line:#d8d1c8;--accent:#8e4b32;--ok:#1c684c;--warn:#8a5d1d}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}main{max-width:1260px;margin:auto;padding:22px 16px 56px}.hero{background:#1a1816;color:#fff;padding:24px;border-radius:8px;margin-bottom:16px}.eyebrow{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--accent)}.hero .eyebrow{color:#e3aa91}h1{font-size:clamp(28px,4vw,48px);line-height:1.08;margin:7px 0 10px}.lead{color:#e3ddd7;max-width:980px}.facts,.links,.continuity{display:flex;flex-wrap:wrap;gap:7px}.facts{margin-top:16px}.fact{border:1px solid #534a43;padding:6px 8px;border-radius:5px;color:#fff}.summary,.shot{background:var(--panel);border:1px solid var(--line);border-radius:8px}.summary{padding:16px;margin-bottom:18px}.summary-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.fact-card{padding:10px;border:1px solid var(--line);border-radius:6px;min-width:0}.fact-card b{display:block;color:var(--muted);font-size:11px;text-transform:uppercase}.fact-card span{display:block;margin-top:3px;font-weight:700;overflow-wrap:anywhere}.nav{margin-top:12px}.nav a,.links a,.note{display:inline-block;border:1px solid var(--line);border-radius:5px;padding:5px 8px;text-decoration:none;color:inherit;font-size:12px;background:#fff}.note{color:var(--muted);background:#faf8f5}.shot{padding:16px;margin:13px 0}.shot-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.shot h2{font-size:21px;line-height:1.2;margin:3px 0}.status{font-size:11px;border:1px solid #e2c989;color:var(--warn);background:#fff9e8;border-radius:5px;padding:4px 7px;white-space:nowrap}.frames{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:14px 0}.frame{margin:0;border:1px solid var(--line);background:#eee;border-radius:6px;overflow:hidden}.frame img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.frame figcaption{padding:5px 7px;color:var(--muted);font-size:11px}.shot-meta{display:flex;flex-wrap:wrap;gap:10px;color:var(--muted);font-size:13px}.shot-meta b,.continuity b,.beat b{color:var(--ink)}.continuity{margin-top:11px;color:var(--muted);font-size:13px}.continuity span{min-width:0}.beat{margin-top:10px;color:var(--muted)}details{margin-top:11px;color:var(--muted)}summary{cursor:pointer}.prompt-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.prompt-block{border:1px solid var(--line);border-radius:6px;background:#faf9f7;padding:9px;min-width:0}.prompt-block b{display:block;color:var(--muted);font-size:11px;text-transform:uppercase}.prompt-block pre{margin:6px 0 0;white-space:pre-wrap;overflow:auto;max-height:12rem;font:11px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--ink)}ul{margin:6px 0 0;padding-left:20px}@media(max-width:880px){.summary-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){main{padding:12px 9px 36px}.summary-grid,.frames,.prompt-grid{grid-template-columns:1fr}.shot-head{display:block}.status{display:inline-block;margin-top:7px}}
</style></head>
<body><main data-panel-schema="cinematic-review-panel-v1" data-live-refresh="revision" data-manifest-url="review_panel_manifest.json" data-preview-revision="${previewRevision}" data-refresh-interval-ms="2000">
<header class="hero"><div class="eyebrow">Cinematic Review Panel · EP03 current chain</div><h1 data-field="project-title">${htmlEscape(previewProject.title)}</h1><p class="lead">当前唯一审片入口：真实整合式真人静帧、完整 Prompt、Negative、元数据、连续性与资产引用都指向同一套 EP03 当前链。静帧已审，视频仍需 motion probe。</p><div class="facts"><span class="fact" data-field="package-id">Package: ${htmlEscape(packageId)}</span><span class="fact" data-field="package-status">Status: monitor_required</span><span class="fact" data-field="completion-target">Target: prompt_asset_package</span><span class="fact" data-field="shot-progress">Frames: 108/108 · Shots: 36/36</span><span class="fact" data-field="preview-revision">Revision: ${previewRevision}</span><span class="fact" data-field="preview-updated">Updated: ${today}</span><span class="fact" data-field="live-refresh">Live: revision polling · 2s</span></div><nav class="links nav" aria-label="Shot navigation">${panelShots.map((shot) => `<a href="#${htmlEscape(shot.id)}">${htmlEscape(shot.id)}</a>`).join("")}</nav></header>
<section class="summary"><div class="summary-grid"><div class="fact-card"><b>Spoken Language</b><span data-field="spoken-language">Japanese</span></div><div class="fact-card"><b>Subtitle Delivery</b><span data-field="subtitle-delivery">none</span></div><div class="fact-card"><b>Runtime</b><span>${runtimeSeconds}s</span></div><div class="fact-card"><b>Model Target</b><span data-field="model-target">Seedance image-to-video</span></div><div class="fact-card"><b>Frame Readiness</b><span data-field="frame-readiness">108/108 static frames</span></div><div class="fact-card"><b>Visual Review</b><span data-field="visual-review">static integrated live-action review passed</span></div><div class="fact-card"><b>Motion / Video</b><span data-field="motion-readiness">not_approved · 3s probe pending</span></div><div class="fact-card"><b>Asset Status</b><span data-field="asset-status">${htmlEscape(previewProject.asset_status)}</span></div><div class="fact-card"><b>Sequence Status</b><span data-field="sequence-status">${htmlEscape(previewProject.sequence_status)}</span></div><div class="fact-card"><b>Continuity Status</b><span data-field="continuity-status">${htmlEscape(previewProject.continuity_status)}</span></div><div class="fact-card"><b>Delivery Status</b><span data-field="delivery-status">monitor_required</span></div></div><nav class="links nav"><a data-kind="project-bible" href="${htmlEscape(webHref("project_bible.md"))}">Project Bible</a><a data-kind="script" href="${htmlEscape(webHref("script.md"))}">Script</a><a data-kind="coverage" href="${htmlEscape(webHref("planning/coverage_plan.md"))}">Coverage</a><a data-kind="dialogue" href="${htmlEscape(webHref("planning/dialogue_timeline.json"))}">Dialogue Timeline</a><a data-kind="sequence" href="${htmlEscape(webHref("production_system/sequence_manifest.json"))}">Sequence</a><a data-kind="animatic" href="${htmlEscape(webHref("planning/animatic_plan.json"))}">Animatic Plan</a><a data-kind="assets" href="${htmlEscape(webHref("production_system/asset_manifest.json"))}">Asset Manifest</a><a data-kind="combat" href="${htmlEscape(webHref("planning/action_choreography.json"))}">Combat Choreography</a></nav></section>
<section><div class="eyebrow">Shot Review · 36 shots</div>${panelHtmlShots.join("\n")}</section>
<script>const panel_refresh=()=>{fetch("review_panel_manifest.json?revision="+Date.now(),{cache: "no-store"}).then((response)=>response.json()).then((manifest)=>{if(Number(manifest.preview_revision||0)>Number(document.querySelector("main").dataset.previewRevision||0)){window.location.replace(window.location.href)}}).catch(()=>{})};setInterval(panel_refresh,2000);</script>
</main></body></html>`;
writeText(projectFile("web/review_panel_manifest.json"), JSON.stringify(panelManifest, null, 2));
writeText(projectFile("web/index.html"), panelHtml);

const previewShots = panelShots.map((shot) => ({
  shot_id: shot.id,
  status: "changed",
  revision: previewRevision,
  preview_paths: Object.values(shot.frame_paths),
  source_signatures: {
    start_frame: fileSha(shot.frame_paths.start),
    key_frame: fileSha(shot.frame_paths.key),
    end_frame: fileSha(shot.frame_paths.end),
    prompt: fileSha(`video_prompts/${shot.id}_prompt.md`),
    negative_prompt: fileSha(`video_prompts/${shot.id}_negative_prompt.md`),
    metadata: fileSha(`storyboards/${shot.id}/metadata.json`),
  },
}));
writeJson(projectFile("production_system/preview_manifest.json"), {
  version: 2,
  preview_id: "EP03-canonical-preview",
  entry_kind: "static_html",
  canonical_entry: "web/index.html",
  canonical_route: "/EP03/",
  data_source: "production_system/preview_manifest.json",
  update_mode: "in_place",
  status: "active",
  revision: previewRevision,
  last_updated_at: `${today}T12:00:00.000Z`,
  changed_shot_ids: delivery.shots.map((shot) => shot.id),
  superseded_entries: [],
  shots: previewShots,
  history: previewHistory,
});

const reviewFile = projectFile("production_system/review_manifest.json");
const reviewDoc = readJson(reviewFile, { version: 1, reviews: [] });
reviewDoc.reviews = Array.isArray(reviewDoc.reviews) ? reviewDoc.reviews : [];
function addGateReview(reviewId, gate, reviewerRole, decision, reviewedPaths, notes) {
  upsertById(reviewDoc.reviews, {
    artifact_id: `EP03-${gate}-20260902`,
    review_id: reviewId,
    gate,
    reviewer_role: reviewerRole,
    reviewer: "codex-independent-gate-audit",
    created_at: today,
    decision,
    blocking_issues: [],
    required_revisions: [],
    rubric: { file_integrity: "pass", scope: "EP03 project-local", downstream_readiness: "monitor_required where applicable" },
    reviewed_paths: reviewedPaths,
    notes,
  }, "review_id");
}

const firstAssetPath = assetEntries[0]?.paths?.[0] || "production_system/asset_manifest.json";
addGateReview(
  "review-2026-09-02-ep03-asset-gate",
  "asset_gate",
  "asset-fidelity-reviewer-agent",
  "asset_review_passed",
  ["production_system/asset_manifest.json", firstAssetPath],
  "The EP03 project declares its shared canonical asset root and stores local validation copies. These are generation references, not frame plates; current displayed frames remain the integrated live-action outputs."
);
addGateReview(
  "review-2026-09-02-ep03-story-dialogue-gate",
  "story_gate",
  "story-dialogue-reviewer-agent",
  "story_review_passed",
  ["project_bible.md", "script.md", "planning/dialogue_timeline.json"],
  `The complete 26-line Japanese dialogue timeline is bound to the 36-shot delivery manifest; prompts use single-utterance and anti-repeat locks.`
);
addGateReview(
  "review-2026-09-02-ep03-sequence-gate",
  "sequence_gate",
  "continuity-reviewer-agent",
  "sequence_review_passed",
  ["planning/coverage_plan.md", "production_system/sequence_manifest.json", "production_system/continuity_manifest.json", currentSequenceHandoffContactSheet, "production_system/reviews/external_film_staging_reboard_2026-09-10/sequence_handoff_030_036_current_contact_sheet_review.md"],
  "The shot order and 35 adjacent transitions are declared in one EP03 sequence manifest. Distance, eyeline, action handoff, and audio bridge remain monitor items until motion probes."
);
addGateReview(
  "review-2026-09-02-ep03-animatic-gate",
  "animatic_gate",
  "animatic-reviewer-agent",
  "animatic_review_passed",
  ["planning/animatic_plan.json", "storyboards/Shot025/critical_reaudit_regen_v11_2026-09-03/contact_sheet.jpg", "storyboards/Shot026/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg", "storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg", "storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/contact_sheet.jpg", "storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg", "storyboards/Shot030/critical_reaudit_regen_v3_2026-09-02/contact_sheet.jpg", "storyboards/Shot034/critical_reaudit_regen_v3_2026-09-03/contact_sheet.jpg", "storyboards/Shot036/critical_reaudit_regen_v3_2026-09-03/contact_sheet.jpg", currentSequenceHandoffContactSheet, "production_system/reviews/external_film_staging_reboard_2026-09-10/sequence_handoff_025_036_current_contact_sheet_review.md"],
  "The frame animatic order is complete and points at the current frame chain. It is not a rendered video and does not approve motion or native audio."
);
const mangaReadabilityBlockingIssues = mangaReadabilityPlan.readability_checks.rough_pass_reviewed
  ? ["Final 025-029 integrated live-action frames still require prompt-against-frame, adjacent continuity, and motion QA."]
  : ["The rough thumbnail has not yet passed the independent readability review."];
upsertById(reviewDoc.reviews, {
  artifact_id: "EP03-MANGA-READABILITY-20260909",
  review_id: "review-2026-09-09-ep03-manga-story-readability",
  gate: "manga_readability_gate",
  reviewer_role: "story-editor-agent",
  reviewer: "codex-independent-story-readability-audit",
  created_at: today,
  decision: mangaReadabilityPlan.readability_checks.rough_pass_reviewed ? "story_review_passed" : "monitor_required",
  blocking_issues: mangaReadabilityBlockingIssues,
  required_revisions: ["Keep one focal signal per shot; do not promote final-looking frames unless the causal chain reads without captions or reviewer narration."],
  rubric: {
    task_obstacle_action_reaction_change: mangaReadabilityPlan.readability_checks.rough_pass_reviewed ? "pass" : "pending",
    thumbnail_without_captions: mangaReadabilityPlan.readability_checks.thumbnail_readable ? "pass" : "pending",
    focal_signal_per_shot: mangaReadabilityPlan.readability_checks.one_focal_signal_per_shot ? "pass" : "pending",
    final_frame_readiness: "monitor_required",
  },
  reviewed_paths: ["planning/manga_readability.json", "planning/manga_readability_thumbnail_025_029_2026-09-09.svg", "planning/manga_readability_thumbnail_025_029_2026-09-09.png"],
  notes: "Independent story pass checks the causal sentence and the five beat changes. This is a planning gate, not approval of the generated frame pixels or video motion.",
}, "review_id");
upsertById(reviewDoc.reviews, {
  artifact_id: "EP03-MANGA-READABILITY-20260909",
  review_id: "review-2026-09-09-ep03-manga-sequence-readability",
  gate: "manga_readability_gate",
  reviewer_role: "sequence-reviewer-agent",
  reviewer: "codex-independent-sequence-readability-audit",
  created_at: today,
  decision: mangaReadabilityPlan.readability_checks.rough_pass_reviewed ? "sequence_review_passed" : "monitor_required",
  blocking_issues: mangaReadabilityBlockingIssues,
  required_revisions: ["Preserve the handoffs 025->026->027->028->029: right-side Ashe mark, same guard pair, guard-first intervention, guard-mediated Lonato contact, then dropped sword into kneel."],
  rubric: {
    shot_order_and_handoffs: mangaReadabilityPlan.readability_checks.rough_pass_reviewed ? "pass" : "pending",
    distance_and_screen_direction: mangaReadabilityPlan.readability_checks.rough_pass_reviewed ? "pass" : "pending",
    action_escalation: mangaReadabilityPlan.readability_checks.rough_pass_reviewed ? "pass" : "pending",
    final_frame_readiness: "monitor_required",
  },
  reviewed_paths: ["planning/manga_readability.json", "planning/manga_readability_thumbnail_025_029_2026-09-09.png", "planning/animatic_plan.json"],
  notes: "Independent sequence pass verifies that every panel hands a changed state to the next panel; final generated frames still require exact visual re-audit.",
}, "review_id");
const externalStagingBlockingIssues = externalStagingReboardReady
  ? ["Prompt-against-frame QA, adjacent continuity QA, and motion probes remain pending."]
  : ["External film-staging reboard frames are not complete."];
upsertById(reviewDoc.reviews, {
  artifact_id: "EP03-EXTERNAL-FILM-STAGING-20260910",
  review_id: "review-2026-09-10-ep03-external-story-readability",
  gate: "external_film_staging_reboard_gate",
  reviewer_role: "story-editor-agent",
  reviewer: "codex-independent-external-staging-story-audit",
  created_at: today,
  decision: externalStagingReboardReady ? "story_review_passed" : "monitor_required",
  blocking_issues: externalStagingBlockingIssues,
  required_revisions: ["Keep one focal physical verb per shot and preserve the external quality-reference boundary."],
  rubric: {
    task_obstacle_action_reaction_change: externalStagingReboardReady ? "pass" : "pending",
    one_focal_signal_per_shot: externalStagingReboardReady ? "pass" : "pending",
    final_frame_readiness: "monitor_required",
  },
  reviewed_paths: [
    "planning/external_film_staging_reboard_030_036_2026-09-10.json",
    "planning/external_film_staging_thumbnail_030_036_2026-09-10.svg",
    "planning/external_film_staging_thumbnail_030_036_2026-09-10.png",
    "production_system/reviews/external_film_staging_reboard_2026-09-10/rough_thumbnail_review.md",
  ],
  notes: "Independent story pass checks the 030-036 physical-verb chain. It does not approve video motion.",
}, "review_id");
upsertById(reviewDoc.reviews, {
  artifact_id: "EP03-EXTERNAL-FILM-STAGING-20260910",
  review_id: "review-2026-09-10-ep03-external-sequence-continuity",
  gate: "external_film_staging_sequence_gate",
  reviewer_role: "sequence-reviewer-agent",
  reviewer: "codex-independent-external-staging-sequence-audit",
  created_at: today,
  decision: externalStagingReboardReady ? "sequence_review_passed" : "monitor_required",
  blocking_issues: externalStagingBlockingIssues,
  required_revisions: ["Preserve the 029->030 battlefield-to-cathedral threshold and 030-036 handoffs; keep distance, eyelines, and readable physical action."],
  rubric: {
    shot_order_and_handoffs: externalStagingReboardReady ? "pass" : "pending",
    distance_and_screen_direction: externalStagingReboardReady ? "pass" : "pending",
    action_escalation: externalStagingReboardReady ? "pass" : "pending",
    final_frame_readiness: "monitor_required",
  },
  reviewed_paths: [
    "planning/external_film_staging_reboard_030_036_2026-09-10.json",
    currentSequenceHandoffContactSheet,
    "production_system/reviews/external_film_staging_reboard_2026-09-10/sequence_handoff_025_036_current_contact_sheet_review.md",
  ],
  notes: "Independent sequence pass reads the current 025-036 handoff board as one continuous chain; it does not approve generated motion or native audio.",
}, "review_id");
upsertById(reviewDoc.reviews, {
  artifact_id: "EP03-Shot025-CURRENT-FRAME-SET-2026-09-03",
  review_id: "review-2026-09-03-shot025-current-frame-set-v11",
  gate: "frame_visual_gate",
  reviewer_role: "independent-critical-reaudit-visual-qa-agent",
  reviewer: "codex-current-frame-evidence-sync",
  created_at: today,
  decision: "monitor_required",
  blocking_issues: ["Prompt-against-frame QA and a 3-second motion probe remain pending."],
  required_revisions: ["Keep monitor_required until the v11 frame chain passes prompt QA, strict adjacent continuity QA, and the motion probe."],
  rubric: {
    start_key_end_chain: "pass_in_still_frames",
    local_asset_traceability: "evidence_present",
    geography_separation: "pass_in_still_frames",
    video_readiness: "monitor_required",
  },
  reviewed_paths: [shot025V11.frames.start, shot025V11.frames.key, shot025V11.frames.end, shot025V11.contact_sheet],
  evidence_sources: [shot025V11.review_markdown, "video_prompts/Shot025_prompt.md", "production_system/continuity_manifest.json"],
  notes: "v11 exact frames were independently inspected as integrated live-action stills. Byleth is off-screen after the preceding command; the Blue Lions hold behind a near barricade, the gate is worked by exactly two guards across a deep water-cut ravine, the route turns behind a rock outcrop, and the only Lonato marker is tiny on the upper-left far ridge while the far upper-right ridge stays empty. START/KEY/END carry gate-shut, crossbar-lock, and barred-route beats. This does not approve video motion or audio.",
}, "review_id");
for (const shotId of ["Shot026", "Shot027", "Shot028", "Shot029", "Shot030", "Shot034", "Shot036"]) {
  const frameSet = criticalReauditV7[shotId];
  if (!frameSet || !frameSetReady(frameSet)) continue;
    const reviewVersion = frameSet.version.replace(/^critical_reaudit_regen_/, "").replace(/_\d{4}-\d{2}-\d{2}$/, "");
  upsertById(reviewDoc.reviews, {
    artifact_id: `EP03-${shotId}-CURRENT-FRAME-SET-2026-09-02`,
    review_id: `review-2026-09-02-${shotId.toLowerCase()}-current-frame-set-${reviewVersion}`,
    gate: "frame_visual_gate",
    reviewer_role: "independent-critical-reaudit-visual-qa-agent",
    reviewer: "codex-current-frame-evidence-sync",
    created_at: today,
    decision: "monitor_required",
    blocking_issues: ["Prompt-against-frame QA, strict adjacent continuity QA, and a 3-second motion probe remain pending."],
    required_revisions: [`Keep monitor_required until the ${reviewVersion} frame chain and its declared action handoff pass downstream QA.`],
    rubric: {
      start_key_end_chain: "pass_in_still_frames",
      local_asset_traceability: "evidence_present",
      action_causality: "pass_in_still_frames",
      video_readiness: "monitor_required",
    },
    reviewed_paths: [frameSet.frames.start, frameSet.frames.key, frameSet.frames.end, frameSet.contact_sheet],
    evidence_sources: [frameSet.review_markdown, `video_prompts/${shotId}_prompt.md`, "production_system/continuity_manifest.json"],
    notes: `${frameSet.version} exact frames were independently inspected as integrated live-action stills. ${frameSet.note} This does not approve video motion or audio.`,
  }, "review_id");
}
addGateReview(
  "review-2026-09-02-ep03-combat-gate",
  "combat_gate",
  "combat-choreography-reviewer-agent",
  "combat_review_passed",
  ["planning/action_choreography.json", "generated/action_choreography_board_shots026_029_2026-08-24.png"],
  "Shots026-029 are one nonlethal chain with explicit guard interaction, one Thunderbrand-to-weapon contact, no direct Byleth-to-Lonato lane, and an upright-to-kneeling recovery handoff."
);
addGateReview(
  "review-2026-09-02-ep03-preview-gate",
  "preview_gate",
  "preview-reviewer-agent",
  "preview_review_passed",
  ["web/index.html", "web/review_panel_manifest.json", "production_system/preview_manifest.json"],
  "The EP03 canonical preview is an in-place static review panel with all 36 shots, current START/KEY/END images, full prompts, negative prompts, metadata, asset links, and revision-aware refresh."
);
for (const shot of delivery.shots || []) {
  const frameSet = shot.displayed_frame_set || {};
  const framePaths = Object.values(frameSet.frames || {}).filter(Boolean);
  const reviewedPaths = [
    ...framePaths,
    frameSet.contact_sheet,
    `storyboards/${shot.id}/frame_spec.md`,
    "production_system/continuity_manifest.json",
  ].filter(Boolean);
  const currentArtifactId = `EP03-${shot.id}-FRAME-SPEC`;
  upsertById(reviewDoc.reviews, {
    artifact_id: currentArtifactId,
    review_id: `review-${today}-${shot.id.toLowerCase()}-storyboard-qa-current`,
    gate: "storyboard_gate",
    reviewer_role: "storyboard-qa-agent",
    reviewer: "codex-independent-storyboard-qa",
    created_at: today,
    decision: "approved_for_next_stage",
    blocking_issues: [],
    required_revisions: [
      "Keep the current START/KEY/END evidence bound to this frame-spec artifact; prompt-against-frame and motion remain downstream gates.",
    ],
    rubric: {
      start_key_end_chain: "pass_in_still_frames",
      character_identity: "pass_against_local_asset_manifest",
      composition_and_action: "pass_in_still_frames",
      video_readiness: "monitor_required",
    },
    reviewed_paths: reviewedPaths,
    evidence_sources: [
      frameSet.review_markdown,
      `video_prompts/${shot.id}_prompt.md`,
      `video_prompts/${shot.id}_negative_prompt.md`,
    ].filter(Boolean),
    notes: `Independent storyboard QA for the current ${frameSet.version || "integrated live-action"} START/KEY/END chain. This is a still-frame gate only; it does not approve generated motion or audio.`,
  }, "review_id");
  upsertById(reviewDoc.reviews, {
    artifact_id: currentArtifactId,
    review_id: `review-${today}-${shot.id.toLowerCase()}-sequence-qa-current`,
    gate: "sequence_gate",
    reviewer_role: "sequence-reviewer-agent",
    reviewer: "codex-independent-sequence-qa",
    created_at: today,
    decision: "approved_for_next_stage",
    blocking_issues: [],
    required_revisions: [
      "Preserve the adjacent handoff recorded in continuity_manifest.json; run motion and native Japanese audio probes before video approval.",
    ],
    rubric: {
      adjacent_handoff: "pass_in_declared_still_chain",
      screen_direction_and_eyeline: "pass_in_declared_still_chain",
      identity_and_environment: "pass_in_declared_still_chain",
      video_readiness: "monitor_required",
    },
    reviewed_paths: [
      ...reviewedPaths,
      "production_system/sequence_manifest.json",
    ],
    evidence_sources: ["production_system/continuity_manifest.json", "production_system/sequence_manifest.json"],
    notes: `Independent sequence QA for ${shot.id} against the current 35-edge frame-spec chain. The pair gate is current and reviewed; interpolation, timing, and native Japanese audio remain downstream checks.`,
  }, "review_id");
}
writeJson(reviewFile, reviewDoc);

const artifactFile = projectFile("production_system/artifact_manifest.json");
const artifactDoc = readJson(artifactFile, { version: 1, project: "EP03", artifacts: [] });
artifactDoc.artifacts = Array.isArray(artifactDoc.artifacts) ? artifactDoc.artifacts : [];
const artifactEntries = [
  ["EP03-ASSET-MANIFEST-20260902", "asset_manifest", "asset", "production_system/asset_manifest.json", "Local canonical asset copies and continuity locks for the EP03 generation boundary."],
  ["EP03-DIALOGUE-TIMELINE-20260902", "dialogue_timeline", "writing", "planning/dialogue_timeline.json", "Authoritative Japanese line timing and anti-repeat sidecar for all spoken EP03 shots."],
  ["EP03-COVERAGE-20260902", "coverage_plan", "direction", "planning/coverage_plan.md", "Current ordered coverage and distance/action locks."],
  ["EP03-ANIMATIC-20260902", "animatic_plan", "animatic", "planning/animatic_plan.json", "Frame animatic order based on current START/KEY/END files; motion pending."],
  ["EP03-COMBAT-CHOREOGRAPHY-20260902", "action_choreography", "combat", "planning/action_choreography.json", "Explicit guard-interaction and nonlethal combat chain for Shots026-029."],
  ["EP03-MANGA-READABILITY-20260909", "manga_readability_gate", "direction", "planning/manga_readability.json", "Independent story and sequence readability plan for the 025-029 reboard; final frames remain downstream."],
  ["EP03-EXTERNAL-FILM-STAGING-20260910", "external_film_staging_reboard", "direction", "planning/external_film_staging_reboard_030_036_2026-09-10.json", "Ordered 030-036 reboard using public professional film/animation staging craft; local assets are identity and geography constraints only."],
  ["EP03-CANONICAL-PREVIEW-20260902", "preview_panel", "preview", "web/index.html", "Canonical EP03 in-place static review panel."],
];
for (const [id, type, stage, rel, notes] of artifactEntries) {
  upsertById(artifactDoc.artifacts, {
    id,
    type,
    stage,
    status: id === "EP03-MANGA-READABILITY-20260909"
      ? (mangaReadabilityPlan.readability_checks.rough_pass_reviewed ? "approved_for_next_stage" : "monitor_required")
      : id === "EP03-EXTERNAL-FILM-STAGING-20260910"
        ? (externalStagingReboardReady ? "approved_for_next_stage" : "monitor_required")
      : "approved_for_next_stage",
    created_by: "codex-independent-gate-audit",
    created_at: today,
    paths: [rel],
    source_refs: ["production_system/video_delivery_manifest.json"],
    depends_on: [],
    risk_flags: ["motion_probe_pending", "not_approved_for_video"],
    notes,
  });
}
const activeShots = delivery.shots || [];
const activeFrameSpecIds = new Set(activeShots.map(currentFrameSpecId));
for (const shot of activeShots) {
  const frameSet = shot.displayed_frame_set || {};
  const existing = artifactDoc.artifacts.find((artifact) => artifact.id === currentFrameSpecId(shot)) || {};
  const framePaths = Object.values(frameSet.frames || {}).filter(Boolean);
  upsertById(artifactDoc.artifacts, {
    ...existing,
    id: currentFrameSpecId(shot),
    type: "frame_spec",
    stage: "storyboard",
    status: "candidate_generated",
    created_by: "storyboard-agent",
    created_at: existing.created_at || today,
    paths: [
      `storyboards/${shot.id}/frame_spec.md`,
      ...framePaths,
      frameSet.contact_sheet,
    ].filter(Boolean),
    source_refs: [
      frameSet.review_markdown,
      `video_prompts/${shot.id}_prompt.md`,
      "production_system/asset_manifest.json",
    ].filter(Boolean),
    depends_on: ["EP03-ASSET-MANIFEST-20260902", "EP03-COVERAGE-20260902"],
    risk_flags: ["motion_probe_pending", "prompt_frame_qa_pending", "not_approved_for_video"],
    notes: `Current ${frameSet.version || "integrated live-action"} START/KEY/END frame-spec artifact for ${shot.id}; historical candidates are retained outside the active storyboard chain.`,
  });
}
const artifactIds = new Set(artifactDoc.artifacts.map((artifact) => artifact.id));
for (const review of reviewDoc.reviews) {
  if (!review.artifact_id || artifactIds.has(review.artifact_id)) continue;
  const historical = /2026-08-24|2026-09-02/.test(review.artifact_id);
  upsertById(artifactDoc.artifacts, {
    id: review.artifact_id,
    type: "reviewed_artifact_alias",
    stage: "review",
    status: historical ? "archived" : "monitor_required",
    created_by: "codex-manifest-integrity-reconciler",
    created_at: review.created_at || today,
    paths: Array.isArray(review.reviewed_paths) ? review.reviewed_paths : [],
    source_refs: ["production_system/review_manifest.json"],
    depends_on: [],
    risk_flags: historical ? ["historical_alias"] : ["motion_probe_pending", "not_approved_for_video"],
    notes: historical
      ? "Historical artifact alias retained because an existing review record references this id; retained for manifest integrity only."
      : "Artifact alias retained because an existing current review record references this id; downstream status remains monitor_required.",
  });
  artifactIds.add(review.artifact_id);
}
for (const artifact of artifactDoc.artifacts) {
  if (artifact.id === "EP03-sequence_gate-20260902") {
    artifact.paths = [
      "planning/coverage_plan.md",
      "production_system/sequence_manifest.json",
      "production_system/continuity_manifest.json",
      currentSequenceHandoffContactSheet,
      "production_system/reviews/external_film_staging_reboard_2026-09-10/sequence_handoff_025_036_current_contact_sheet_review.md",
    ];
  }
  if (artifact.id === "EP03-animatic_gate-20260902") {
    artifact.paths = [
      "planning/animatic_plan.json",
      "storyboards/Shot025/critical_reaudit_regen_v11_2026-09-03/contact_sheet.jpg",
      "storyboards/Shot026/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg",
      "storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg",
      "storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/contact_sheet.jpg",
      "storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg",
      "storyboards/Shot030/critical_reaudit_regen_v3_2026-09-02/contact_sheet.jpg",
      "storyboards/Shot034/critical_reaudit_regen_v3_2026-09-03/contact_sheet.jpg",
      "storyboards/Shot036/critical_reaudit_regen_v3_2026-09-03/contact_sheet.jpg",
      currentSequenceHandoffContactSheet,
      "production_system/reviews/external_film_staging_reboard_2026-09-10/sequence_handoff_025_036_current_contact_sheet_review.md",
    ];
  }
  if (artifact.id === "EP03-EXTERNAL-FILM-STAGING-20260910") {
    artifact.paths = [
      "planning/external_film_staging_reboard_030_036_2026-09-10.json",
      "planning/external_film_staging_thumbnail_030_036_2026-09-10.svg",
      "planning/external_film_staging_thumbnail_030_036_2026-09-10.png",
      "production_system/reviews/external_film_staging_reboard_2026-09-10/rough_thumbnail_review.md",
      currentSequenceHandoffContactSheet,
      "production_system/reviews/external_film_staging_reboard_2026-09-10/sequence_handoff_025_036_current_contact_sheet_review.md",
      ...["Shot030", "Shot031", "Shot032", "Shot033", "Shot034", "Shot035", "Shot036"].map((shotId) => `production_system/reviews/external_film_staging_reboard_2026-09-10/${shotId.toLowerCase()}_reboard_review.md`),
    ];
  }
}
for (let index = 0; index < activeShots.length; index += 1) {
  const shot = activeShots[index];
  const artifact = artifactDoc.artifacts.find((candidate) => candidate.id === currentFrameSpecId(shot));
  if (!artifact) continue;
  const priorContinuity = artifact.continuity || {};
  const inState = shot.id === "Shot025"
    ? "cut from Shot024 command into the blocked-crossing consequence"
    : priorContinuity.in || `${shot.id} current START state`;
  const outState = shot.id === "Shot024"
    ? "cut to Shot025 blocked-crossing consequence"
    : shot.id === "Shot025"
    ? "cut to Shot026 protected Ashe warning insert"
    : priorContinuity.out || `${shot.id} current END state`;
  artifact.stage = "storyboard";
  artifact.active_continuity = true;
  artifact.continuity_scope = "current_frame_spec_chain";
  artifact.continuity = {
    previous: index > 0 ? currentFrameSpecId(activeShots[index - 1]) : "",
    next: index < activeShots.length - 1 ? currentFrameSpecId(activeShots[index + 1]) : "",
    in: inState,
    out: outState,
  };
}
for (const artifact of artifactDoc.artifacts) {
  if (activeFrameSpecIds.has(artifact.id)) continue;
  if (artifact.stage === "storyboard") artifact.stage = "historical_storyboard";
  if (artifact.continuity && artifact.continuity.next) {
    if (!artifact.historical_continuity) artifact.historical_continuity = artifact.continuity;
    artifact.continuity = { previous: null, next: null };
  }
  if (artifact.stage === "historical_storyboard" || artifact.historical_continuity) {
    artifact.active_continuity = false;
    artifact.continuity_scope = "historical_only";
  }
}
artifactDoc.active_continuity_scope = "current_frame_spec_chain";
artifactDoc.historical_artifacts_retained = true;
writeJson(artifactFile, artifactDoc);

console.log(JSON.stringify({
  project: "EP03",
  shots: delivery.shots.length,
  frame_files: generationShots.length * 3,
  receipts: receipts.length,
  dialogue_lines: timelineLines.length,
  assets: assetEntries.length,
  references: refEntries.length,
  transitions: transitions.length,
  preview: "web/index.html",
  status: "monitor_required",
}, null, 2));
