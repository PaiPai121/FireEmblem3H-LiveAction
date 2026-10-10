const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const slug = "critical_reaudit_regen_v3";
const version = "critical_reaudit_regen_v3_2026-08-22";
const frames = {
  start: "storyboards/Shot015/" + version + "/start_frame.png",
  key: "storyboards/Shot015/" + version + "/key_frame.png",
  end: "storyboards/Shot015/" + version + "/end_frame.png",
};
const contactSheet = "storyboards/Shot015/" + version + "/contact_sheet.jpg";
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-22");
const reviewMarkdown = "production_system/reviews/critical_reaudit_2026-08-22/shot015_critical_reaudit_regen_v3_2026-08-22_review.md";
const reviewJson = "production_system/reviews/critical_reaudit_2026-08-22/shot015_current_web_candidate_reaudit_2026-08-22.json";

function read(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}
function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(value, null, 2) + "\n");
}
function addUnique(items, value) {
  if (!items.includes(value)) items.push(value);
}

const finding = "2026-08-22 sequential re-audit: v2 still invented a Byleth stop gesture inside the rebel-pressure shot and did not carry the original fog-front action cleanly. v3 returns Shot015 to the script beat: a small four-to-five-person Western Church vanguard enters after the arrow impact, advances in real depth, braces at KEY, and holds a rightward spear handoff for Shot016. No named character appears in Shot015.";
const requiredRevision = "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if the unit becomes a clone wall/endless army, a named character enters early, the arrow echo disappears, feet lose ground contact, the spear strikes, or Chinese/Mandarin/subtitles/UI/borders appear.";
const source = "imagegen_from_local_seiros_soldier_battlefield_church_crest_and_adjacent_shot_references_v3_2026-08-22";

const frameSet = {
  version,
  frame_set_id: "Shot015_" + version,
  source,
  frames,
  contact_sheet: contactSheet,
  status: "monitor_required",
  visual_audit_decision: "monitor_required",
  reference_assets: [
    "assets/characters/church_of_seiros/SeirosSoldier/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png",
    "storyboards/Shot014/critical_reaudit_regen_v1_2026-08-14/end_frame.png",
    "storyboards/Shot016/critical_reaudit_regen_v1_2026-08-15/start_frame.png",
    "source_refs/Shot015_source.png",
  ],
  generation_mode: "imagegen_sequential_action_chain_with_local_seiros_soldier_and_adjacent_shot_match_action",
  review_markdown: reviewMarkdown,
  review_json: reviewJson,
  note: "v3 returns Shot015 to the actual rebel-pressure beat: the same small Western Church vanguard enters through fog, braces in the road, and holds a rightward spear lane into Shot016. The frames are integrated live-action candidates, not composited character plates. Keep monitor_required until motion probe.",
};

const metadata = read("storyboards/Shot015/metadata.json");
metadata.status = "monitor_required";
metadata.characters = ["SeirosSoldier"];
metadata.asset_references = [
  "assets/characters/church_of_seiros/SeirosSoldier/selected.png",
  "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
  "assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png",
];
metadata.planned_frames = frames;
metadata.current_display_frame_set = slug;
metadata.current_display_frame_status = "monitor_required_" + version;
metadata.current_display_frame_source = source;
metadata.current_display_frame_note = "v3 removes the invented Byleth blocking from Shot015. The shot is now a four-to-five-person Western Church vanguard action chain with an arrow-impact echo and a rightward Dimitri handoff.";
metadata.visual_audit_decision = "monitor_required";
metadata.visual_audit_finding = finding;
metadata.required_revision = requiredRevision;
metadata.video_prompt_qa_decision = "pending_review_against_" + version;
metadata.motion_probe_status = "pending_3s_probe_against_" + version;
metadata.character_presence_constraint = "Four or five Western Church foot soldiers only; no Byleth, Dimitri, Dedue, Felix, Ashe, Lonato, Rhea, Catherine, or other named character enters Shot015. Female Byleth first appears in Shot016.";
metadata.displayed_frame_set = frameSet;
if (metadata.critical_reaudit_regen_v2) {
  metadata.critical_reaudit_regen_v2.status = "blocked_needs_revision";
  metadata.critical_reaudit_regen_v2.visual_audit_decision = "blocked_needs_revision";
  metadata.critical_reaudit_regen_v2.note = "Superseded on 2026-08-22 after visual review: the v2 invented a Byleth stop gesture inside the rebel-pressure beat and did not match the source action cleanly. Retained as historical evidence only.";
}
metadata.critical_reaudit_regen_v3 = frameSet;
metadata.adjacent_continuity_review_2026_08_22 = {
  previous_shot: "Shot014",
  previous_end_frame: "storyboards/Shot014/critical_reaudit_regen_v1_2026-08-14/end_frame.png",
  previous_to_start_finding: "The frozen Shot014 arrow-in-blue-shield impact is carried as a blurred lower-left shield/arrow echo; Shot015 reverse-cuts to the opposing Western Church vanguard without bringing a Blue Lions named character into frame.",
  next_shot: "Shot016",
  next_start_frame: "storyboards/Shot016/critical_reaudit_regen_v1_2026-08-15/start_frame.png",
  end_to_next_finding: "Shot015 END holds the front spear on a rightward diagonal and leaves the right third open; Shot016 can enter with the frozen Dimitri counterline while female Byleth and Dedue first appear there.",
  decision: "monitor_required",
  reject_if: [
    "Shot015 START loses the arrow/shield impact echo or reverses the fog-lane direction",
    "Shot015 becomes a flat row, clone wall, or endless army",
    "a named character enters before Shot016",
    "Shot015 END closes the right-side handoff lane",
  ],
};
write("storyboards/Shot015/metadata.json", metadata);

const queue = read("frame_generation_queue.json");
const queueShot = queue.shots.find((shot) => shot.id === "Shot015");
queueShot.status = "monitor_required";
queueShot.characters = ["SeirosSoldier"];
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
queueShot.character_presence_constraint = metadata.character_presence_constraint;
queueShot.displayed_frame_set = frameSet;
if (queueShot.critical_reaudit_regen_v2) {
  queueShot.critical_reaudit_regen_v2.status = "blocked_needs_revision";
  queueShot.critical_reaudit_regen_v2.visual_audit_decision = "blocked_needs_revision";
  queueShot.critical_reaudit_regen_v2.note = "Superseded on 2026-08-22 after visual review because the invented Byleth stop gesture did not fit the source rebel-pressure beat.";
}
queueShot.critical_reaudit_regen_v3 = frameSet;
queueShot.previous_match_action_reference = "storyboards/Shot014/critical_reaudit_regen_v1_2026-08-14/end_frame.png";
queueShot.next_handoff_reference = "storyboards/Shot016/critical_reaudit_regen_v1_2026-08-15/start_frame.png";
queueShot.continuity_previous = "Shot014";
queueShot.continuity_next = "Shot016";
queueShot.model_notes = (queueShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v2"));
queueShot.model_notes.push("Current displayed frames are the 2026-08-22 v3 sequential action repair: arrow/shield echo, four-to-five-person Western Church vanguard, braced KEY, and rightward spear handoff. No named character enters Shot015. Keep monitor_required until a 3-second motion probe.");
queueShot.reject_if = queueShot.reject_if || [];
[
  "Shot015 must contain only four or five Western Church foot soldiers; no Byleth or other named character enters early",
  "Shot015 START must carry the Shot014 arrow/shield impact as a blurred foreground echo",
  "Shot015 KEY must show a real braced push with depth, not a flat shield line",
  "Shot015 END must preserve the right-side handoff lane into Shot016",
].forEach((value) => addUnique(queueShot.reject_if, value));
write("frame_generation_queue.json", queue);

const delivery = read("production_system/video_delivery_manifest.json");
const deliveryShot = delivery.shots.find((shot) => shot.id === "Shot015");
deliveryShot.status = "monitor_required";
deliveryShot.characters = ["SeirosSoldier"];
deliveryShot.start_frame = frames.start;
deliveryShot.key_frame = frames.key;
deliveryShot.end_frame = frames.end;
deliveryShot.current_display_frame_set = slug;
deliveryShot.current_display_frame_status = "monitor_required_" + version;
deliveryShot.current_display_frame_source = source;
deliveryShot.current_display_frame_note = frameSet.note;
deliveryShot.visual_audit_decision = "monitor_required";
deliveryShot.visual_audit_finding = finding;
deliveryShot.required_revision = requiredRevision;
deliveryShot.video_prompt_qa_decision = "pending_review_against_" + version;
deliveryShot.motion_probe_status = "pending_3s_probe_against_" + version;
deliveryShot.character_presence_constraint = metadata.character_presence_constraint;
if (deliveryShot.critical_reaudit_regen_v2) {
  deliveryShot.critical_reaudit_regen_v2.status = "blocked_needs_revision";
  deliveryShot.critical_reaudit_regen_v2.visual_audit_decision = "blocked_needs_revision";
  deliveryShot.critical_reaudit_regen_v2.note = "Superseded on 2026-08-22 after visual review because the invented Byleth stop gesture did not fit the source rebel-pressure beat.";
}
deliveryShot.critical_reaudit_regen_v3 = frameSet;
deliveryShot.previous_match_action_reference = "storyboards/Shot014/critical_reaudit_regen_v1_2026-08-14/end_frame.png";
deliveryShot.next_handoff_reference = "storyboards/Shot016/critical_reaudit_regen_v1_2026-08-15/start_frame.png";
deliveryShot.model_notes = (deliveryShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v2"));
deliveryShot.model_notes.push("Current displayed frames are the 2026-08-22 v3 sequential action repair: the small Western Church vanguard advances in fog, braces, and holds a rightward spear lane into Shot016. No named character enters Shot015. Keep monitor_required until a 3-second motion probe.");
deliveryShot.reject_if = deliveryShot.reject_if || [];
[
  "Shot015 must contain only four or five Western Church foot soldiers; no Byleth or other named character enters early",
  "Shot015 START must carry the Shot014 arrow/shield impact as a blurred foreground echo",
  "Shot015 KEY must show a real braced push with depth, not a flat shield line",
  "Shot015 END must preserve the right-side handoff lane into Shot016",
].forEach((value) => addUnique(deliveryShot.reject_if, value));
write("production_system/video_delivery_manifest.json", delivery);

const continuity = read("production_system/continuity_manifest.json");
const pair01415 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot014-Shot015");
if (pair01415) {
  pair01415.decision = "monitor_required";
  pair01415.notes = "2026-08-22 v3 adjacent audit: frozen Shot014 END's arrow-in-blue-shield impact is carried into Shot015 START as a blurred lower-left shield/arrow echo. Shot015 reverse-cuts to a small Western Church vanguard; no Blue Lions named character enters the rebel-pressure shot. Keep monitor_required until motion probe.";
}
const pair1516 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot015-Shot016");
if (pair1516) {
  pair1516.decision = "monitor_required";
  pair1516.notes = "2026-08-22 v3 adjacent audit: Shot015 END stops the front shield bearer at the pressure limit, aims the spear on a rightward diagonal, and leaves the right third open. Shot016 START uses that lane for the frozen Dimitri counterline and introduces female Byleth/Dimitri/Dedue without cross-contamination.";
}
write("production_system/continuity_manifest.json", continuity);

fs.mkdirSync(reviewDir, { recursive: true });
const review = {
  shot_id: "Shot015",
  review_date: "2026-08-22",
  review_type: "critical_reaudit_sequential_continuity_and_source_beat",
  previous_display_frame_set: "critical_reaudit_regen_v2_2026-08-20",
  current_display_frame_set: version,
  status: "monitor_required",
  decision: "monitor_required",
  previous_shot: "Shot014",
  next_shot: "Shot016",
  source_video_evidence: "episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot015/Shot015_local_video_source_evidence_2026-08-01.jpg",
  reviewed_contact_sheet: "episodes/EP03/" + contactSheet,
  frames: {
    start: "episodes/EP03/" + frames.start,
    key: "episodes/EP03/" + frames.key,
    end: "episodes/EP03/" + frames.end,
  },
  reference_assets: frameSet.reference_assets,
  prior_v2_rejection: [
    "The prior v2 placed Byleth inside the rebel-pressure shot even though the source beat and shot list are about the vanguard entering through fog.",
    "The prior v2 made the camera relationship to the frozen Shot014 arrow impact and the Shot016 counterline too abstract.",
  ],
  passes: [
    "START carries a blurred blue shield/arrow foreground echo from the frozen Shot014 END.",
    "The vanguard is limited to four or five human Western Church foot soldiers with visible depth and non-clone staging.",
    "The primary soldier uses the local SeirosSoldier identity and church tabard/helmet/shield language.",
    "START, KEY, and END are distinct action states: entering, bracing, and holding the pressure limit.",
    "END preserves a rightward spear lane and negative space for the frozen Shot016 Dimitri counterline.",
    "No Byleth or other named character appears in Shot015; female Byleth remains locked for her first appearance in Shot016.",
    "The executable video prompt remains upload-only and specifies Japanese dialogue only.",
  ],
  monitor_risks: [
    "Motion must preserve the four-to-five-person scale and avoid a clone wall or endless army.",
    "The lower-left arrow/shield echo must remain an environmental continuity cue, not reveal a named character.",
    "The spear must remain a held directional threat and must not strike before Shot016.",
    "Japanese chant timing, no subtitles, and no Chinese/Mandarin voice must survive motion generation.",
  ],
  required_next_gate: "3-second motion probe before any approved_for_video promotion",
  reject_if: [
    "named character enters Shot015 early",
    "the vanguard becomes a flat row, clone wall, endless army, or generic raiders",
    "the arrow/shield impact echo disappears",
    "the right-side Shot016 handoff lane is closed or screen direction reverses",
    "Chinese/Mandarin voiceover, subtitles, UI, borders, or magic appear",
  ],
};
fs.writeFileSync(path.join(root, reviewJson), JSON.stringify(review, null, 2) + "\n");

const reviewMd = "# Shot015 Critical Re-Audit Review v3\n\n" +
  "Review date: 2026-08-22\n" +
  "Artifact: " + version + "\n" +
  "Status: monitor_required\n\n" +
  "## Why v2 Was Rejected\n\n" +
  "The previous v2 made Byleth perform an invented stop gesture inside a shot whose source beat is the Western Church vanguard pressing through fog. That weakened the reverse-cut from the frozen Shot014 arrow impact and made the handoff to Shot016 feel staged rather than motivated. v2 is retained as historical evidence and marked blocked_needs_revision.\n\n" +
  "## Current Frame Review\n\n" +
  "- START carries the arrow/shield shock as a blurred lower-left foreground echo, then introduces a four-to-five-person church vanguard from the upper-left fog.\n" +
  "- KEY advances the same group by real steps: the front shield bearer braces, a second soldier closes diagonally, and the rear soldiers retain depth.\n" +
  "- END checks the push, holds the spear on a rightward diagonal, and leaves the next-shot entry lane open.\n" +
  "- Shot015 contains no named character. Female Byleth remains the canonical identity for her first appearance in frozen Shot016.\n\n" +
  "## Gate Checks\n\n" +
  "- Integrated live-action staging: pass_in_still_frames\n" +
  "- Local Seiros soldier identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Four-to-five-person scale / non-clone formation: pass_in_still_frames_monitor_in_motion\n" +
  "- START/KEY/END distinct: pass\n" +
  "- Shot014 arrow-impact continuity: pass_in_still_frames\n" +
  "- Shot016 rightward handoff: pass_in_still_frames_monitor_in_motion\n" +
  "- Web executable prompt contract: rewritten_upload_only\n" +
  "- Japanese dialogue only: pass\n" +
  "- No burned subtitles/UI: required_in_prompt_and_negative\n\n" +
  "## Remaining Risks And Required Next Gate\n\n" +
  "Run a 3-second motion probe before any approved_for_video promotion. Reject if a named character enters early, the unit becomes a flat clone wall, the arrow echo disappears, the spear strikes, or gore, magic, subtitles, Chinese/Mandarin voice, UI, or borders appear.\n";
fs.writeFileSync(path.join(root, reviewMarkdown), reviewMd);

console.log(JSON.stringify({shot: "Shot015", current: version, frames, reviewMarkdown, reviewJson}, null, 2));

