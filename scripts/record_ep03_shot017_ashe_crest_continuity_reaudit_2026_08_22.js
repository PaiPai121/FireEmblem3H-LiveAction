const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const slug = "critical_reaudit_regen_v2";
const version = "critical_reaudit_regen_v2_2026-08-22";
const frames = {
  start: "storyboards/Shot017/" + version + "/start_frame.png",
  key: "storyboards/Shot017/" + version + "/key_frame.png",
  end: "storyboards/Shot017/" + version + "/end_frame.png",
};
const contactSheet = "storyboards/Shot017/" + version + "/contact_sheet.jpg";
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-22");
const reviewMarkdown = "production_system/reviews/critical_reaudit_2026-08-22/shot017_ashe_crest_continuity_reaudit_v2_2026-08-22_review.md";
const reviewJson = "production_system/reviews/critical_reaudit_2026-08-22/shot017_current_web_candidate_reaudit_2026-08-22.json";

function read(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}
function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(value, null, 2) + "\n");
}
function addUnique(items, value) {
  if (!items.includes(value)) items.push(value);
}

const finding = "2026-08-22 sequential re-audit: the frozen Shot017 v1 chain repeated Shot016's raised-hand gesture in END and did not focus the recognition beat tightly enough on Ashe and the physical worn shield emblem. v2 uses the canonical local Ashe and female Byleth references, Shot016 v2 END, and the frozen Shot018 entry lane. START holds Ashe half-ready, KEY lands the emblem recognition with a softened bowstring, and the regenerated END lowers the bow nearly vertical with a visibly slack string before Ashe turns back toward Byleth. The performers are integrated into the same wet foggy ridge rather than pasted portrait plates.";
const requiredRevision = "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if Byleth becomes male or war-phase, Ashe fires or ages up, the bow remains taut in END, the shield emblem becomes text or a glowing icon, Shot016's stop-hand gesture repeats, Felix appears early, or Chinese/Mandarin/subtitles/UI/borders appear.";
const source = "imagegen_sequential_recognition_chain_with_local_ashe_female_byleth_and_shot_adjacency_v2_2026-08-22";
const characters = ["Ashe", "Byleth"];
const presenceConstraint = "Only youthful academy Ashe and female academy-era Byleth are readable in Shot017. Felix enters only after the cut to Shot018. Dimitri, Dedue, Catherine, Lonato, Rhea, Seiros soldiers, monsters, and any other named character do not enter.";

const frameSet = {
  version,
  frame_set_id: "Shot017_" + version,
  source,
  frames,
  contact_sheet: contactSheet,
  status: "monitor_required",
  visual_audit_decision: "monitor_required",
  reference_assets: [
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "storyboards/Shot016/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
    "storyboards/Shot018/critical_reaudit_regen_v1_2026-08-14/start_frame.png",
    "source_refs/Shot017_source.png",
  ],
  generation_mode: "imagegen_sequential_integrated_live_action_with_local_identity_and_adjacent_shot_refs",
  review_markdown: reviewMarkdown,
  review_json: reviewJson,
  note: "v2 replaces the frozen v1 display set because v1 repeated the Shot016 stop-hand gesture in END and left the recognition beat too generic. v2 keeps female Byleth only, makes the physical shield emblem the KEY object, and uses a clearly lowered, slack-string bow in END for the Shot018 handoff. Keep monitor_required until motion probe.",
};

const metadata = read("storyboards/Shot017/metadata.json");
metadata.status = "monitor_required";
metadata.characters = characters;
metadata.asset_references = frameSet.reference_assets.slice(0, 3);
metadata.planned_frames = frames;
metadata.current_display_frame_set = slug;
metadata.current_display_frame_status = "monitor_required_" + version;
metadata.current_display_frame_source = source;
metadata.current_display_frame_note = "v2 is the current candidate: Ashe moves from half-ready bow to physical emblem recognition, then lowers the bow nearly vertical with a slack string and turns back toward female Byleth. Felix remains absent until Shot018.";
metadata.visual_audit_decision = "monitor_required";
metadata.visual_audit_finding = finding;
metadata.required_revision = requiredRevision;
metadata.video_prompt_qa_decision = "pending_review_against_" + version;
metadata.motion_probe_status = "pending_3s_probe_against_" + version;
metadata.character_presence_constraint = presenceConstraint;
metadata.canonical_byleth_asset = "assets/characters/protagonist/BylethFemale/professor/selected.png";
metadata.byleth_gender_consistency_lock = "female_byleth_only_2026-08-14";
metadata.audio_anchor = "Ashe, in Japanese: あれは……ガスパール家の紋章。";
metadata.displayed_frame_set = frameSet;
if (metadata.critical_reaudit_regen_v1) {
  metadata.critical_reaudit_regen_v1.status = "blocked_needs_revision";
  metadata.critical_reaudit_regen_v1.visual_audit_decision = "blocked_needs_revision";
  metadata.critical_reaudit_regen_v1.note = "Superseded on 2026-08-22: v1 END repeated Shot016's raised stop-hand gesture and did not give the recognition beat a clean physical landing. v1 is retained as historical evidence only.";
}
metadata.critical_reaudit_regen_v2 = frameSet;
metadata.adjacent_continuity_review_2026_08_22 = {
  previous_shot: "Shot016",
  previous_end_frame: "storyboards/Shot016/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
  previous_to_start_finding: "Shot017 v2 START receives Shot016 v2 END's eyeline and wet foggy ridge without copying the previous stop-hand gesture. Ashe is the new foreground subject; the physical blue shield becomes the right-side recognition object and female Byleth remains in the midground.",
  next_shot: "Shot018",
  next_start_frame: "storyboards/Shot018/critical_reaudit_regen_v1_2026-08-14/start_frame.png",
  end_to_next_finding: "Shot017 v2 END lowers Ashe's bow nearly vertical, leaves the string visibly slack, turns him back toward female Byleth, and keeps the right-side entry lane open. Felix remains absent until the Shot018 cut.",
  decision: "monitor_required",
  reject_if: [
    "Shot017 START breaks the Shot016 eyeline or changes the wet battlefield geography",
    "Byleth becomes male, ambiguous, older, war-phase, or sexualized",
    "Ashe fires, releases an arrow, or stays taut and combat-ready through END",
    "Shot016's raised stop-hand gesture repeats in Shot017",
    "Felix appears before the Shot018 cut or the right-side entry lane is closed",
  ],
};
write("storyboards/Shot017/metadata.json", metadata);

const queue = read("frame_generation_queue.json");
const queueShot = queue.shots.find((shot) => shot.id === "Shot017");
queueShot.status = "monitor_required";
queueShot.characters = characters;
queueShot.output_frames = frames;
queueShot.current_display_frame_set = slug;
queueShot.current_display_frame_status = "monitor_required_" + version;
queueShot.current_display_frame_source = source;
queueShot.current_display_frame_note = frameSet.note;
queueShot.visual_audit_decision = "monitor_required";
queueShot.visual_audit_finding = finding;
queueShot.required_revision = requiredRevision;
queueShot.video_prompt_qa_decision = "pending_review_against_" + version;
queueShot.motion_probe_status = "pending_3s_probe_against_" + version;
queueShot.byleth_gender_consistency_lock = "female_byleth_only_2026-08-14";
queueShot.canonical_byleth_asset = "assets/characters/protagonist/BylethFemale/professor/selected.png";
queueShot.character_presence_constraint = presenceConstraint;
queueShot.displayed_frame_set = frameSet;
if (queueShot.critical_reaudit_regen_v1) {
  queueShot.critical_reaudit_regen_v1.status = "blocked_needs_revision";
  queueShot.critical_reaudit_regen_v1.visual_audit_decision = "blocked_needs_revision";
  queueShot.critical_reaudit_regen_v1.note = "Superseded on 2026-08-22 because END repeated Shot016's stop-hand gesture and the recognition landing was not physically distinct.";
}
queueShot.critical_reaudit_regen_v2 = frameSet;
queueShot.previous_match_action_reference = "storyboards/Shot016/critical_reaudit_regen_v2_2026-08-22/end_frame.png";
queueShot.next_handoff_reference = "storyboards/Shot018/critical_reaudit_regen_v1_2026-08-14/start_frame.png";
queueShot.continuity_previous = "Shot016";
queueShot.continuity_next = "Shot018";
queueShot.model_notes = (queueShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v1"));
queueShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 sequential recognition repair: female Byleth-only identity, Ashe half-ready START, physical shield-emblem KEY, and a regenerated END with a nearly vertical bow, visibly slack string, low hands, and open Shot018 entry lane. Keep monitor_required until prompt-against-frame QA and a 3-second motion probe.");
queueShot.reject_if = queueShot.reject_if || [];
[
  "Ashe must lower the bow nearly vertical and show a visibly slack string in END",
  "Byleth must remain female-only and must not repeat Shot016's raised stop-hand gesture",
  "The physical shield emblem must not become readable text, glowing magic, or UI",
  "Felix must remain absent until Shot018 and the right-side entry lane must stay open",
].forEach((value) => addUnique(queueShot.reject_if, value));
write("frame_generation_queue.json", queue);

const delivery = read("production_system/video_delivery_manifest.json");
const deliveryShot = delivery.shots.find((shot) => shot.id === "Shot017");
deliveryShot.status = "monitor_required";
deliveryShot.characters = characters;
deliveryShot.start_frame = frames.start;
deliveryShot.key_frame = frames.key;
deliveryShot.end_frame = frames.end;
deliveryShot.current_display_frame_set = slug;
deliveryShot.current_display_frame_status = "monitor_required_" + version;
deliveryShot.current_display_frame_source = source;
deliveryShot.visual_audit_decision = "monitor_required";
deliveryShot.visual_audit_finding = finding;
deliveryShot.required_revision = requiredRevision;
deliveryShot.video_prompt_qa_decision = "pending_review_against_" + version;
deliveryShot.motion_probe_status = "pending_3s_probe_against_" + version;
deliveryShot.byleth_gender_consistency_lock = "female_byleth_only_2026-08-14";
deliveryShot.canonical_byleth_asset = "assets/characters/protagonist/BylethFemale/professor/selected.png";
deliveryShot.character_presence_constraint = presenceConstraint;
deliveryShot.displayed_frame_set = frameSet;
if (deliveryShot.critical_reaudit_regen_v1) {
  deliveryShot.critical_reaudit_regen_v1.status = "blocked_needs_revision";
  deliveryShot.critical_reaudit_regen_v1.visual_audit_decision = "blocked_needs_revision";
  deliveryShot.critical_reaudit_regen_v1.note = "Superseded on 2026-08-22 because END repeated Shot016's stop-hand gesture and the recognition landing was not physically distinct.";
}
deliveryShot.critical_reaudit_regen_v2 = frameSet;
deliveryShot.previous_match_action_reference = "storyboards/Shot016/critical_reaudit_regen_v2_2026-08-22/end_frame.png";
deliveryShot.next_handoff_reference = "storyboards/Shot018/critical_reaudit_regen_v1_2026-08-14/start_frame.png";
deliveryShot.model_notes = (deliveryShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v1"));
deliveryShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 sequential recognition repair: the shield recognition is physically staged, the bow is lowered with a slack string in END, and the open right-side lane hands off to Shot018. Keep monitor_required until a 3-second motion probe.");
deliveryShot.reject_if = deliveryShot.reject_if || [];
[
  "Ashe must not fire and must show a lowered bow with slack string at the end",
  "Byleth must remain female-only across the uploaded frame chain and generated clip",
  "Shot016's stop-hand pose must not repeat in Shot017",
  "Felix must not enter before Shot018",
].forEach((value) => addUnique(deliveryShot.reject_if, value));
write("production_system/video_delivery_manifest.json", delivery);

const continuity = read("production_system/continuity_manifest.json");
const pair1617 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot016-Shot017");
if (pair1617) {
  pair1617.decision = "monitor_required";
  pair1617.notes = "2026-08-22 Shot017 v2 adjacency audit: Shot016 v2 END lowers Dimitri's spear and hands off the eyeline. Shot017 v2 START receives the same wet foggy ridge with Ashe as the new foreground subject and does not repeat the previous stop-hand gesture. KEY shifts attention to the physical shield emblem; END lowers the bow and turns Ashe back toward female Byleth. Keep monitor_required until motion probe.";
}
const pair1718 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot017-Shot018");
if (pair1718) {
  pair1718.decision = "monitor_required";
  pair1718.notes = "2026-08-22 Shot017 v2 adjacency audit: START receives Shot016 v2's eyeline; KEY lands the Ashe recognition beat; END has a nearly vertical lowered bow, a visibly slack string, low Byleth hands, and an open right-side entry lane. Felix remains absent until frozen Shot018 START. Keep monitor_required until motion probe.";
}
write("production_system/continuity_manifest.json", continuity);

fs.mkdirSync(reviewDir, { recursive: true });
const review = {
  shot_id: "Shot017",
  review_date: "2026-08-22",
  review_type: "ashe_crest_recognition_sequential_continuity_and_prompt_reaudit",
  previous_display_frame_set: "critical_reaudit_regen_v1_2026-08-20",
  current_display_frame_set: version,
  status: "monitor_required",
  decision: "monitor_required",
  previous_shot: "Shot016",
  next_shot: "Shot018",
  reviewed_contact_sheet: "episodes/EP03/" + contactSheet,
  frames: {
    start: "episodes/EP03/" + frames.start,
    key: "episodes/EP03/" + frames.key,
    end: "episodes/EP03/" + frames.end,
  },
  reference_assets: frameSet.reference_assets,
  prior_v1_rejection: [
    "The frozen v1 END repeated Shot016's raised stop-hand gesture, weakening the cut-to-cut action logic.",
    "The recognition object and Ashe's physical change of state were not focused tightly enough for the beat to read immediately.",
  ],
  passes: [
    "START receives Shot016 v2's wet battlefield, blue-banner, and eyeline continuity without importing Dimitri or Dedue.",
    "Female Byleth is the only Byleth identity and remains in the covered academy professor silhouette.",
    "The physical shield and worn heraldic mark are readable as an object, without glowing UI or readable text.",
    "KEY focuses Ashe's eye-line on the emblem and softens the bowstring without firing.",
    "Regenerated END makes the state change explicit: bow nearly vertical, string visibly slack, drawing hand open, shoulders turned back toward Byleth.",
    "END keeps Felix absent and leaves a right-side entry lane for frozen Shot018 START.",
    "The three frames are integrated live-action candidates with shared scale, contact shadows, fog, and wet-ground interaction.",
    "START, KEY, and END are distinct action states rather than lighting or crop variants.",
    "The executable video prompt is upload-only and requires Japanese dialogue only.",
  ],
  monitor_risks: [
    "A motion model may make Ashe fire reflexively or keep the bow taut after recognition; inspect the string and hands through END.",
    "Byleth's female academy identity must remain stable in the midground and during the final turn-back.",
    "The worn shield emblem must remain physical and non-textual during camera movement.",
    "The right-side lane must remain open until the cut so Felix can enter only in Shot018.",
    "Japanese dialogue timing, no subtitles, and no Chinese/Mandarin voice must survive generation.",
  ],
  required_next_gate: "prompt-against-frame QA plus 3-second motion probe before any approved_for_video promotion",
  reject_if: [
    "Byleth becomes male, ambiguous, adult, war-phase, or sexualized",
    "Ashe fires, causes an impact, ages up, or remains taut and combat-ready through END",
    "Shot016's raised stop-hand gesture repeats",
    "Felix enters before Shot018 or the right-side lane is closed",
    "the shield mark becomes readable text, glowing magic, UI, subtitles, Chinese/Mandarin voice, borders, or a pasted collage",
  ],
};
fs.writeFileSync(path.join(root, reviewJson), JSON.stringify(review, null, 2) + "\n");

const reviewMd = "# Shot017 Ashe Crest Recognition And Continuity Re-Audit v2\n\n" +
  "Review date: 2026-08-22\n" +
  "Artifact: " + version + "\n" +
  "Status: monitor_required\n\n" +
  "## Why v1 Was Rejected\n\n" +
  "The frozen v1 frames were integrated live-action candidates, but the END repeated Shot016's raised stop-hand gesture and the recognition beat did not land on a sufficiently clear physical change. v1 is retained as historical evidence and marked blocked_needs_revision.\n\n" +
  "## Current Frame Review\n\n" +
  "- START receives Shot016 v2's wet foggy ridge and makes Ashe the new foreground subject. The blue shield and worn emblem sit in the right foreground, while female Byleth remains behind him.\n" +
  "- KEY makes Ashe's eye-line and softened bowstring carry the recognition beat. The emblem remains a physical scratched surface, not readable text or a glowing icon.\n" +
  "- END is deliberately different from START: Ashe lowers the bow nearly vertical beside his leg, the string hangs slack, his drawing hand opens, and he turns back toward female Byleth. Byleth's hands stay low and the right-side lane remains open for Shot018.\n\n" +
  "## Gate Checks\n\n" +
  "- Canonical female Byleth identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Canonical academy Ashe identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Integrated live-action staging: pass_in_still_frames\n" +
  "- Physical emblem without readable text/UI: pass_in_still_frames_monitor_in_motion\n" +
  "- START/KEY/END distinct action states: pass\n" +
  "- Shot016 eyeline and geography continuity: pass_in_still_frames_monitor_in_motion\n" +
  "- Shot018 right-side protective-lane handoff: pass_in_still_frames_monitor_in_motion\n" +
  "- Upload-only executable prompt: rewritten_upload_only\n" +
  "- Japanese dialogue only: pass\n" +
  "- No burned subtitles/UI: required_in_prompt_and_negative\n\n" +
  "## Remaining Risks And Required Next Gate\n\n" +
  "Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. Inspect Ashe's bowstring, drawing hand, face/age, Byleth's female identity, emblem stability, and the open right-side lane. Reject if Ashe fires, Byleth repeats Shot016's stop hand, Felix enters early, the two performers become a flat lineup, or gore, magic, subtitles, Chinese/Mandarin voice, UI, or borders appear.\n";
fs.writeFileSync(path.join(root, reviewMarkdown), reviewMd);

console.log(JSON.stringify({ shot: "Shot017", current: version, frames, reviewMarkdown, reviewJson }, null, 2));
