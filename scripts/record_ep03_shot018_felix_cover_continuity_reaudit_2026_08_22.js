const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const slug = "critical_reaudit_regen_v3";
const version = "critical_reaudit_regen_v3_2026-08-22";
const frames = {
  start: "storyboards/Shot018/" + version + "/start_frame.png",
  key: "storyboards/Shot018/" + version + "/key_frame.png",
  end: "storyboards/Shot018/" + version + "/end_frame.png",
};
const contactSheet = "storyboards/Shot018/" + version + "/contact_sheet.jpg";
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-22");
const reviewMarkdown = "production_system/reviews/critical_reaudit_2026-08-22/shot018_felix_cover_direction_reaudit_v3_2026-08-22_review.md";
const reviewJson = "production_system/reviews/critical_reaudit_2026-08-22/shot018_current_web_candidate_direction_reaudit_2026-08-22.json";

function read(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}
function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(value, null, 2) + "\n");
}
function addUnique(items, value) {
  if (!items.includes(value)) items.push(value);
}

const finding = "2026-08-22 sequential direction re-audit: Shot018 v2 was rejected because an enemy blade entered from screen-left while Felix's head and gaze drifted screen-right, breaking the action line. v3 was regenerated from the canonical local Felix and Ashe academy references with Shot017 v2 adjacency. START is the right-side entry, KEY shows one plain weapon edge from screen-left meeting Felix's sword while his head, eyes, chest, shoulders, stance, and blade all face screen-left, and END preserves the left-facing guarded reset while Ashe remains behind him.";
const requiredRevision = "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if the screen-left threat is mirrored, Felix looks screen-right during the block, the sword line turns away from the left danger lane, Felix does not cover Ashe, the block mutates into a killing blow, Ashe fires or overtakes Felix, a named attacker appears, the shot becomes a lineup, or Chinese/Mandarin/subtitles/UI/borders appear.";
const source = "imagegen_sequential_felix_protective_cover_left_danger_direction_lock_v3_2026-08-22";
const characters = ["Felix", "Ashe"];
const presenceConstraint = "Only youthful academy Felix and academy Ashe are readable in Shot018. Felix must occupy the protective lane; Ashe remains behind him. No Byleth, Dimitri, Dedue, Catherine, Lonato, Rhea, Annette, Mercedes, Ingrid, Seiros soldiers, monsters, or other named characters enter.";

const frameSet = {
  version,
  frame_set_id: "Shot018_" + version,
  source,
  frames,
  contact_sheet: contactSheet,
  status: "monitor_required",
  visual_audit_decision: "monitor_required",
  reference_assets: [
    "assets/characters/blue_lions/Felix/academy/selected.png",
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "storyboards/Shot017/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
    "source_refs/Shot018_source.png",
  ],
  generation_mode: "imagegen_sequential_integrated_live_action_with_local_identity_and_adjacent_shot_refs",
  review_markdown: reviewMarkdown,
  review_json: reviewJson,
  note: "v3 replaces v2 after a direction rejection: v2 showed the weapon entering from screen-left while Felix looked screen-right. v3 has exactly Felix and Ashe: right-side entry, left-facing non-graphic blade block, and left-facing lowered guard with Ashe behind. Keep monitor_required until motion probe.",
};

const metadata = read("storyboards/Shot018/metadata.json");
metadata.status = "monitor_required";
metadata.characters = characters;
metadata.asset_references = frameSet.reference_assets.slice(0, 3);
metadata.planned_frames = frames;
metadata.current_display_frame_set = slug;
metadata.current_display_frame_status = "monitor_required_" + version;
metadata.current_display_frame_source = source;
metadata.current_display_frame_note = "v3 is the current candidate: the threat is locked to screen-left, Felix enters from Shot017's right-side lane, blocks one plain offscreen weapon edge while looking left, and lowers the sword into a left-facing guard while Ashe remains behind him.";
metadata.visual_audit_decision = "monitor_required";
metadata.visual_audit_finding = finding;
metadata.required_revision = requiredRevision;
metadata.video_prompt_qa_decision = "pending_review_against_" + version;
metadata.motion_probe_status = "pending_3s_probe_against_" + version;
metadata.character_presence_constraint = presenceConstraint;
metadata.audio_anchor = "Felix, in Japanese: ぼんやりするな。お前の代わりに誰かが傷つくぞ。";
metadata.displayed_frame_set = frameSet;
if (metadata.critical_reaudit_regen_v1) {
  metadata.critical_reaudit_regen_v1.status = "blocked_needs_revision";
  metadata.critical_reaudit_regen_v1.visual_audit_decision = "blocked_needs_revision";
  metadata.critical_reaudit_regen_v1.note = "Superseded on 2026-08-22: v1 did not make Felix's protective cover action physically legible and retained unrelated prompt locks. v1 is historical evidence only.";
}
if (metadata.critical_reaudit_regen_v2) {
  metadata.critical_reaudit_regen_v2.status = "blocked_needs_revision";
  metadata.critical_reaudit_regen_v2.visual_audit_decision = "blocked_needs_revision";
  metadata.critical_reaudit_regen_v2.note = "Superseded on 2026-08-22: v2 was directionally invalid because the weapon entered from screen-left while Felix looked screen-right. v2 is historical evidence only.";
}
metadata.critical_reaudit_regen_v3 = frameSet;
metadata.adjacent_continuity_review_2026_08_22 = {
  previous_shot: "Shot017",
  previous_end_frame: "storyboards/Shot017/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
  previous_to_start_finding: "Shot018 v3 START receives Shot017 v2 END's wet fog, blue banners, and lowered-bow Ashe state. Felix enters from the open right-side lane instead of appearing as a static partner beside Ashe; the threat side is locked to screen-left.",
  next_shot: "Shot019",
  next_start_frame: "storyboards/Shot019/critical_reaudit_regen_v1_2026-08-20/start_frame.png",
  end_to_next_finding: "Shot018 v3 END lowers Felix's sword into a left-facing guarded diagonal, keeps Ashe behind him, and leaves a calm fog lane for the cut to the support line in Shot019. No support character enters early.",
  decision: "monitor_required",
  reject_if: [
    "Felix does not cross in front of Ashe from the right-side entry lane or does not keep his attention screen-left",
    "the KEY block becomes a named attacker reveal, killing blow, visible wound, or repeated attack",
    "Ashe fires, overtakes Felix, or loses the lowered-bow state inherited from Shot017",
    "Shot019 support characters enter before the cut",
  ],
};
write("storyboards/Shot018/metadata.json", metadata);

const queue = read("frame_generation_queue.json");
const queueShot = queue.shots.find((shot) => shot.id === "Shot018");
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
queueShot.character_presence_constraint = presenceConstraint;
queueShot.displayed_frame_set = frameSet;
if (queueShot.critical_reaudit_regen_v1) {
  queueShot.critical_reaudit_regen_v1.status = "blocked_needs_revision";
  queueShot.critical_reaudit_regen_v1.visual_audit_decision = "blocked_needs_revision";
  queueShot.critical_reaudit_regen_v1.note = "Superseded on 2026-08-22 because the protective cover beat was not physically legible and the prompt carried unrelated character locks.";
}
if (queueShot.critical_reaudit_regen_v2) {
  queueShot.critical_reaudit_regen_v2.status = "blocked_needs_revision";
  queueShot.critical_reaudit_regen_v2.visual_audit_decision = "blocked_needs_revision";
  queueShot.critical_reaudit_regen_v2.note = "Superseded on 2026-08-22 because the weapon entered from screen-left while Felix looked screen-right.";
}
queueShot.critical_reaudit_regen_v3 = frameSet;
queueShot.previous_match_action_reference = "storyboards/Shot017/critical_reaudit_regen_v2_2026-08-22/end_frame.png";
queueShot.next_handoff_reference = "storyboards/Shot019/critical_reaudit_regen_v1_2026-08-20/start_frame.png";
queueShot.continuity_previous = "Shot017";
queueShot.continuity_next = "Shot019";
queueShot.model_notes = (queueShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v1"));
queueShot.model_notes.push("Current displayed frames are the 2026-08-22 v3 sequential Felix cover direction repair: exactly Felix and Ashe, right-side entry, one non-graphic blade block against an unidentified weapon entering from screen-left, Felix's head/eyes/body/sword all left-facing, and a left-facing lowered guard with Ashe behind. Keep monitor_required until prompt-against-frame QA and a 3-second motion probe.");
queueShot.reject_if = queueShot.reject_if || [];
[
  "Felix must cross in front of Ashe and own the protective lane in KEY and END",
  "Screen-left is the danger side; Felix must not look screen-right while the incoming blade enters from screen-left",
  "The incoming weapon must remain unidentified and non-graphic",
  "Ashe must remain behind Felix with a lowered bow and slack string",
  "No Byleth or unrelated named character locks belong in Shot018",
].forEach((value) => addUnique(queueShot.reject_if, value));
write("frame_generation_queue.json", queue);

const delivery = read("production_system/video_delivery_manifest.json");
const deliveryShot = delivery.shots.find((shot) => shot.id === "Shot018");
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
deliveryShot.character_presence_constraint = presenceConstraint;
deliveryShot.displayed_frame_set = frameSet;
if (deliveryShot.critical_reaudit_regen_v1) {
  deliveryShot.critical_reaudit_regen_v1.status = "blocked_needs_revision";
  deliveryShot.critical_reaudit_regen_v1.visual_audit_decision = "blocked_needs_revision";
  deliveryShot.critical_reaudit_regen_v1.note = "Superseded on 2026-08-22 because the protective cover beat was not physically legible and the prompt carried unrelated character locks.";
}
if (deliveryShot.critical_reaudit_regen_v2) {
  deliveryShot.critical_reaudit_regen_v2.status = "blocked_needs_revision";
  deliveryShot.critical_reaudit_regen_v2.visual_audit_decision = "blocked_needs_revision";
  deliveryShot.critical_reaudit_regen_v2.note = "Superseded on 2026-08-22 because the weapon entered from screen-left while Felix looked screen-right.";
}
deliveryShot.critical_reaudit_regen_v3 = frameSet;
deliveryShot.previous_match_action_reference = "storyboards/Shot017/critical_reaudit_regen_v2_2026-08-22/end_frame.png";
deliveryShot.next_handoff_reference = "storyboards/Shot019/critical_reaudit_regen_v1_2026-08-20/start_frame.png";
deliveryShot.model_notes = (deliveryShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v1"));
deliveryShot.model_notes.push("Current displayed frames are the 2026-08-22 v3 sequential Felix cover direction repair: Felix enters from the right, catches one unidentified weapon edge from screen-left while facing left, and lowers the sword into a left-facing guard while Ashe remains behind. Keep monitor_required until a 3-second motion probe.");
deliveryShot.reject_if = deliveryShot.reject_if || [];
[
  "Felix must physically cover Ashe in the uploaded frame chain and generated clip",
  "The screen-left danger direction and Felix's left-facing eyeline must remain coherent",
  "The sword block must remain defensive and non-graphic",
  "Ashe must not fire or move in front of Felix",
  "No Byleth or unrelated named character may enter",
].forEach((value) => addUnique(deliveryShot.reject_if, value));
write("production_system/video_delivery_manifest.json", delivery);

const continuity = read("production_system/continuity_manifest.json");
const pair1718 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot017-Shot018");
if (pair1718) {
  pair1718.decision = "monitor_required";
  pair1718.notes = "2026-08-22 Shot018 v3 adjacency audit: Shot017 v2 END leaves the right-side lane open with Ashe's bow lowered and string slack. Shot018 v3 START receives that state as Felix enters from the right; the danger is locked to screen-left, KEY puts Felix between Ashe and one unidentified left-entering weapon edge with a left-facing eyeline, and END lowers the sword into a left-facing guard. Keep monitor_required until motion probe.";
}
const pair1819 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot018-Shot019");
if (pair1819) {
  pair1819.decision = "monitor_required";
  pair1819.notes = "2026-08-22 Shot018 v3 adjacency audit: Felix's single defensive block from screen-left settles into a left-facing lowered guard while Ashe stays behind him. END leaves a calm fog lane for the cut to the Shot019 support line; Annette/Mercedes/Ingrid do not enter Shot018. Keep monitor_required until motion probe.";
}
write("production_system/continuity_manifest.json", continuity);

fs.mkdirSync(reviewDir, { recursive: true });
const review = {
  shot_id: "Shot018",
  review_date: "2026-08-22",
  review_type: "felix_protective_cover_direction_sequential_continuity_and_prompt_reaudit",
  previous_display_frame_set: "critical_reaudit_regen_v2_2026-08-22",
  current_display_frame_set: version,
  status: "monitor_required",
  decision: "monitor_required",
  previous_shot: "Shot017",
  next_shot: "Shot019",
  reviewed_contact_sheet: "episodes/EP03/" + contactSheet,
  frames: {
    start: "episodes/EP03/" + frames.start,
    key: "episodes/EP03/" + frames.key,
    end: "episodes/EP03/" + frames.end,
  },
  reference_assets: frameSet.reference_assets,
  prior_v1_rejection: [
    "The frozen v1 frames showed a general ready stance but did not make Felix's physical cover of Ashe and the incoming strike read as one clear action.",
    "The old executable prompt carried unrelated Byleth, Rhea, Catherine, and Lonato locks that could contaminate generation despite this shot containing only Felix and Ashe.",
    "Shot018 v2 was rejected during user review because the weapon entered from screen-left while Felix looked screen-right, reversing the intended eyeline and defensive geometry.",
  ],
  passes: [
    "START directly receives Shot017 v2's lowered-bow Ashe state and uses the open right-side lane for Felix's entry.",
    "Only canonical academy Felix and Ashe are readable in all three frames.",
    "KEY clearly shows Felix between Ashe and the screen-left danger, with one plain offscreen weapon edge meeting the drawn sword while Felix's head, eyes, chest, shoulders, stance, and blade all face screen-left.",
    "The defensive contact is non-graphic: no attacker face, injury, blood, impact flash, or second attack.",
    "END lowers the sword into a left-facing guarded diagonal and leaves Ashe behind Felix rather than turning the beat into a victory pose.",
    "A calm fog lane remains for the cut to Shot019's support line; support characters do not enter early.",
    "The three frames are integrated live-action candidates with shared scale, contact shadows, fog, and wet-ground interaction.",
    "START, KEY, and END are distinct action states rather than lighting or crop variants.",
    "The executable video prompt is upload-only and requires Japanese dialogue only.",
  ],
  monitor_risks: [
    "A motion model may fail to keep Felix between Ashe and the unseen threat; inspect body lane and sword line.",
    "Sword geometry may mutate during the brief contact; inspect the blade and hands in the 3-second probe.",
    "Ashe may raise or fire the bow after the block; reject if he overtakes Felix or loses the lowered-bow continuity.",
    "The unseen weapon must remain unidentified and non-graphic.",
    "Japanese dialogue timing, no subtitles, and no Chinese/Mandarin voice must survive generation.",
  ],
  required_next_gate: "prompt-against-frame QA plus 3-second motion probe before any approved_for_video promotion",
  reject_if: [
    "Felix fails to cover Ashe or the frame becomes a posed lineup",
    "the weapon enters from screen-left while Felix looks screen-right or the sword line turns away from the left danger lane",
    "the block becomes a killing blow, visible wound, gore, impact flash, or repeated attack",
    "Ashe fires, overtakes Felix, or loses the lowered-bow state",
    "a named attacker or any unrelated character appears",
    "Chinese/Mandarin voice, subtitles, UI, borders, or a pasted collage appear",
  ],
};
fs.writeFileSync(path.join(root, reviewJson), JSON.stringify(review, null, 2) + "\n");

const reviewMd = "# Shot018 Felix Protective Cover Direction Re-Audit v3\n\n" +
  "Review date: 2026-08-22\n" +
  "Artifact: " + version + "\n" +
  "Status: monitor_required\n\n" +
  "## Why v1 Was Rejected\n\n" +
  "Shot018 v2 was directionally invalid: the enemy blade entered from screen-left while Felix's gaze drifted screen-right, so the action line and eyeline contradicted each other. v2 is retained as historical evidence and marked blocked_needs_revision. The earlier v1 frame chain also had a less legible protective cover beat and unrelated prompt locks.\n\n" +
  "## Current Frame Review\n\n" +
  "- START receives Shot017 v2's lowered-bow Ashe and uses the open right-side lane for Felix's entry. Felix is already moving across Ashe's front, not standing beside him.\n" +
  "- KEY makes the cover beat and direction explicit: Felix owns the lane, his head, eyes, chest, shoulders, stance, and sword all face screen-left, and one plain weapon edge from outside the left frame meets his blade. No attacker identity or graphic impact is shown.\n" +
  "- END settles into a left-facing guarded diagonal sword, leaves Ashe behind Felix, and opens a calm fog lane for the support-line cut.\n\n" +
  "## Gate Checks\n\n" +
  "- Canonical academy Felix identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Canonical academy Ashe identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Integrated live-action staging: pass_in_still_frames\n" +
  "- Protective lane, screen-left direction, and single non-graphic blade contact: pass_in_still_frames_monitor_in_motion\n" +
  "- START/KEY/END distinct action states: pass\n" +
  "- Shot017 lowered-bow continuity: pass_in_still_frames_monitor_in_motion\n" +
  "- Shot019 support-line handoff: pass_in_still_frames_monitor_in_motion\n" +
  "- Upload-only executable prompt: rewritten_upload_only\n" +
  "- Japanese dialogue only: pass\n" +
  "- No burned subtitles/UI: required_in_prompt_and_negative\n\n" +
  "## Remaining Risks And Required Next Gate\n\n" +
  "Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. Inspect Felix's lane ownership, sword geometry, Ashe's lowered bow, the non-graphic withdrawal, and the support-line exit. Reject if Felix becomes a killer, Ashe fires, a named attacker appears, the two become a flat lineup, or gore, magic, subtitles, Chinese/Mandarin voice, UI, or borders appear.\n";
fs.writeFileSync(path.join(root, reviewMarkdown), reviewMd);

console.log(JSON.stringify({ shot: "Shot018", current: version, frames, reviewMarkdown, reviewJson }, null, 2));
