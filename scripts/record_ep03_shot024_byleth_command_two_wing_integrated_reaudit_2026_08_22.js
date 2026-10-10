const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const slug = "critical_reaudit_regen_v2";
const version = "critical_reaudit_regen_v2_2026-08-22";
const frames = {
  start: "storyboards/Shot024/" + version + "/start_frame.png",
  key: "storyboards/Shot024/" + version + "/key_frame.png",
  end: "storyboards/Shot024/" + version + "/end_frame.png",
};
const contactSheet = "storyboards/Shot024/" + version + "/contact_sheet.jpg";
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-22");
const reviewMarkdown = "production_system/reviews/critical_reaudit_2026-08-22/shot024_byleth_command_two_wing_integrated_reaudit_v2_2026-08-22_review.md";
const reviewJson = "production_system/reviews/critical_reaudit_2026-08-22/shot024_current_web_candidate_byleth_command_reaudit_v2_2026-08-22.json";

function read(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}
function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(value, null, 2) + "\n");
}
function addUnique(items, value) {
  if (!items.includes(value)) items.push(value);
}
function blockSet(container, key, note) {
  if (!container[key] || typeof container[key] !== "object") return;
  container[key].status = "blocked_needs_revision";
  container[key].visual_audit_decision = "blocked_needs_revision";
  container[key].note = note;
}

const finding = "2026-08-22 sequential re-audit: the frozen Shot024 v1 set was generated before the repaired Shot023 two-person refusal and still carried frames_pending/source-layout fallback plus unrelated Rhea/Catherine prompt locks. v2 is regenerated from Shot023 v3 END and the canonical local female Byleth, Dimitri, Dedue, and Ingrid assets. It makes the script beat readable as observation, low sword-tip command, and the first two-wing split, while Ashe and older white-haired Lonato remain in the same road pressure geography.";
const requiredRevision = "Keep monitor_required. Run prompt-against-frame QA, strict Shot023→024 continuity QA, and a 3-second motion probe; reject if Byleth becomes male or robotic, the sword reads as an attack, Dedue loses the visible nape braid or ages up, Ashe raises the bow, Lonato attacks, the flank lanes do not begin, the performers read as pasted plates, or Chinese/Mandarin/subtitles/UI/borders appear.";
const source = "imagegen_integrated_live_action_with_local_identity_and_shot023_continuity_v2_2026-08-22";
const characters = ["Byleth", "Ashe", "Lonato", "Dimitri", "Dedue", "Ingrid"];
const presenceConstraint = "Exactly six named readable performers: female academy-era Byleth, academy Ashe, older white-haired armored Lonato, academy Dimitri, academy Dedue with visible compact silver-white nape braid, and academy Ingrid. Wounded people and rebel pressure remain indistinct. No Rhea, Catherine, Felix, Mercedes, Annette, Sylvain, or other named character enters.";
const frameSet = {
  version,
  frame_set_id: "Shot024_" + version,
  source,
  frames,
  contact_sheet: contactSheet,
  status: "monitor_required",
  visual_audit_decision: "monitor_required",
  reference_assets: [
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/blue_lions/Dedue/academy/selected.png",
    "assets/characters/blue_lions/Ingrid/academy/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "storyboards/Shot023/critical_reaudit_regen_v3_2026-08-22/end_frame.png",
  ],
  generation_mode: "imagegen_integrated_live_action_with_local_identity_and_adjacent_shot_refs",
  review_markdown: reviewMarkdown,
  review_json: reviewJson,
  note: "v2 replaces the pre-023 v1 set. It contains a female Byleth command focal point, Ashe/Lonato road pressure, and academy Dimitri/Dedue/Ingrid beginning a readable two-wing split in shared wet battlefield space. Keep monitor_required until motion probe.",
};

const metadata = read("storyboards/Shot024/metadata.json");
metadata.status = "monitor_required";
metadata.characters = characters;
metadata.asset_references = frameSet.reference_assets;
metadata.planned_frames = frames;
metadata.current_display_frame_set = slug;
metadata.current_display_frame_status = "monitor_required_" + version;
metadata.current_display_frame_source = source;
metadata.current_display_frame_note = "v2 replaces the pre-023 v1 set: female Byleth observes, gives a low non-violent sword-tip command, and holds the center while Dimitri/Dedue/Ingrid begin the two-wing split; Ashe and Lonato remain in the road geography.";
metadata.visual_audit_decision = "monitor_required";
metadata.visual_audit_finding = finding;
metadata.required_revision = requiredRevision;
metadata.video_prompt_qa_decision = "pending_review_against_" + version;
metadata.motion_probe_status = "pending_3s_probe_against_" + version;
metadata.character_presence_constraint = presenceConstraint;
metadata.audio_anchor = "Byleth, in Japanese: 護衛を分断しろ。村道へ近づけるな。";
metadata.displayed_frame_set = frameSet;
for (const key of [
  "critical_reaudit_regen_v1",
  "local_asset_final_candidate_v1",
  "local_selected_png_composited_previs_v2",
  "local_selected_png_composited_previs_v3",
]) {
  blockSet(metadata, key, "Superseded on 2026-08-22: this historical Shot024 candidate predates Shot023 v3 and/or is a deterministic layout_reference set. Retain for audit history only; v2 is the current display set.");
}
metadata.critical_reaudit_regen_v2 = frameSet;
metadata.adjacent_continuity_review_2026_08_22 = {
  previous_shot: "Shot023",
  previous_end_frame: "storyboards/Shot023/critical_reaudit_regen_v3_2026-08-22/end_frame.png",
  previous_to_start_finding: "Shot024 v2 START receives Shot023 v3 END's wet road, blue banner, fog depth, Ashe-left/Lonato-ahead geography, and restrained non-graphic pressure. Female Byleth enters as the next command focal point without erasing Ashe or Lonato.",
  next_shot: "Shot025",
  next_start_frame: "storyboards/Shot025/start_frame.png",
  end_to_next_finding: "Shot024 v2 END leaves Byleth central, the center road open, Dimitri/Dedue beginning the left/center lane, and Ingrid beginning the right fog lane. This is the intended receiving state for Shot025's full two-wing movement; keep strict screen-direction and motion continuity monitor-only.",
  decision: "monitor_required",
  reject_if: [
    "female Byleth becomes male, war-phase, or a pasted foreground plate",
    "the sword-tip gesture reads as a strike or points at a body",
    "Dedue loses the visible nape braid or students age up",
    "the END does not establish two distinct flank lanes for Shot025",
  ],
};
write("storyboards/Shot024/metadata.json", metadata);

const queue = read("frame_generation_queue.json");
const queueShot = queue.shots.find((shot) => shot.id === "Shot024");
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
for (const key of [
  "critical_reaudit_regen_v1",
  "local_asset_final_candidate_v1",
  "local_selected_png_composited_previs_v2",
  "local_selected_png_composited_previs_v3",
]) {
  blockSet(queueShot, key, "Superseded on 2026-08-22: pre-023 or layout_reference history only. The current display set is the integrated Shot024 v2 command chain.");
}
queueShot.critical_reaudit_regen_v2 = frameSet;
queueShot.previous_match_action_reference = "storyboards/Shot023/critical_reaudit_regen_v3_2026-08-22/end_frame.png";
queueShot.next_handoff_reference = "storyboards/Shot025/start_frame.png";
queueShot.continuity_previous = "Shot023";
queueShot.continuity_next = "Shot025";
queueShot.model_notes = (queueShot.model_notes || []).filter((note) => !note.includes("Current displayed start/key/end") && !note.includes("Current displayed frames") && !note.includes("female Byleth is now a readable"));
queueShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 integrated Shot024 repair: female Byleth observes and gives a low non-violent command, Ashe/Lonato preserve the road pressure, and Dimitri/Dedue/Ingrid begin the two-wing split. Keep monitor_required until prompt-against-frame QA and a 3-second motion probe.");
queueShot.reject_if = queueShot.reject_if || [];
[
  "Female Byleth must remain female and academy-era across START/KEY/END",
  "Byleth's sword tip must indicate lanes, never strike or point at a body",
  "Dedue's academy identity and visible compact nape braid must hold",
  "Shot024 END must leave distinct left/center and right flank lanes for Shot025",
].forEach((value) => addUnique(queueShot.reject_if, value));
write("frame_generation_queue.json", queue);

const delivery = read("production_system/video_delivery_manifest.json");
const deliveryShot = delivery.shots.find((shot) => shot.id === "Shot024");
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
for (const key of [
  "critical_reaudit_regen_v1",
  "local_asset_final_candidate_v1",
  "local_selected_png_composited_previs_v2",
  "local_selected_png_composited_previs_v3",
]) {
  blockSet(deliveryShot, key, "Superseded on 2026-08-22: pre-023 or layout_reference history only. The current display set is the integrated Shot024 v2 command chain.");
}
deliveryShot.critical_reaudit_regen_v2 = frameSet;
deliveryShot.previous_match_action_reference = "storyboards/Shot023/critical_reaudit_regen_v3_2026-08-22/end_frame.png";
deliveryShot.next_handoff_reference = "storyboards/Shot025/start_frame.png";
deliveryShot.model_notes = (deliveryShot.model_notes || []).filter((note) => !note.includes("Current displayed start/key/end") && !note.includes("Current displayed frames") && !note.includes("female Byleth is now a readable"));
deliveryShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 integrated Shot024 repair: female Byleth commands from the center, the sword remains a low lane indicator, and the Blue Lions begin the left/center and right split. Keep monitor_required until a 3-second motion probe.");
deliveryShot.reject_if = deliveryShot.reject_if || [];
[
  "Female Byleth must remain female and academy-era across the uploaded frame chain and generated clip",
  "No pasted character plates, flat lineup, or missing shared ground contact",
  "Byleth's sword tip must not become a strike or body-targeted attack",
  "Dedue must retain the visible compact nape braid and academy age",
  "The two-wing handoff to Shot025 must remain readable",
].forEach((value) => addUnique(deliveryShot.reject_if, value));
write("production_system/video_delivery_manifest.json", delivery);

const continuity = read("production_system/continuity_manifest.json");
const pair2324 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot023-Shot024");
if (pair2324) {
  pair2324.decision = "monitor_required";
  pair2324.notes = "2026-08-22 Shot024 v2 adjacency audit: Shot023 v3 END turns Lonato toward indistinct rebel pressure and leaves the road open. Shot024 v2 START receives that road with female Byleth entering as the command focal point; Ashe stays left, Lonato stays ahead, and the wet mud/fog/blue-banner axis holds. Keep monitor_required until motion probe.";
}
const pair2425 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot024-Shot025");
if (pair2425) {
  pair2425.decision = "monitor_required";
  pair2425.notes = "2026-08-22 Shot024 v2→Shot025 handoff audit: END leaves Byleth central with a low neutral sword, Dimitri/Dedue beginning the left/center lane, Ingrid beginning the right fog lane, Ashe separated with a lowered bow, and an open central road. Shot025 must receive those two flank directions without resetting the formation; strict motion continuity remains monitor-only.";
}
write("production_system/continuity_manifest.json", continuity);

fs.mkdirSync(reviewDir, { recursive: true });
const review = {
  shot_id: "Shot024",
  review_date: "2026-08-22",
  review_type: "byleth_command_two_wing_integrated_sequential_reaudit",
  previous_display_frame_set: "critical_reaudit_regen_v1_2026-08-14",
  current_display_frame_set: version,
  status: "monitor_required",
  decision: "monitor_required",
  previous_shot: "Shot023",
  next_shot: "Shot025",
  reviewed_contact_sheet: "episodes/EP03/" + contactSheet,
  frames: {
    start: "episodes/EP03/" + frames.start,
    key: "episodes/EP03/" + frames.key,
    end: "episodes/EP03/" + frames.end,
  },
  reference_assets: frameSet.reference_assets,
  prior_rejection: [
    "The frozen v1 set predates the Shot023 v3 two-person refusal and did not prove continuity from the current Lonato turn.",
    "Its frame spec was still frames_pending and its executable prompt allowed source/layout fallback.",
    "The old prompt carried unrelated Rhea/Catherine locks and did not strictly encode the female-Byleth-only, Dedue-braid, or two-wing handoff requirements.",
  ],
  passes: [
    "START receives Shot023 v3 END's wet road, blue banner, fog depth, Ashe-left/Lonato-ahead geography, and moral pressure.",
    "Female Byleth is the readable command focal point and remains academy-era in the integrated stills.",
    "KEY makes the low sword-tip lane command readable without pointing at a body or beginning an attack.",
    "Dimitri, Dedue, and Ingrid are integrated into the same muddy battlefield; Dedue's compact nape braid is visible in the chain.",
    "END begins two distinct flank directions and leaves the center road open for Shot025.",
    "START, KEY, and END are distinct action states: observation, command, first split.",
    "The executable prompt is upload-only and Japanese dialogue only.",
  ],
  monitor_risks: [
    "Motion may make Byleth robotic or turn the low sword-tip command into an attack; inspect the probe.",
    "Female Byleth identity, academy age, and black professor outfit must hold through motion.",
    "Dedue's braid and student ages may drift in a wide moving shot.",
    "Ashe or Lonato may disappear as the flank lanes move; reject if the moral pressure is erased.",
    "Shot025 must receive the two lane directions without a formation reset.",
    "Japanese dialogue timing, no subtitles, and no Chinese/Mandarin voice must survive generation.",
  ],
  required_next_gate: "prompt-against-frame QA plus 3-second motion probe before any approved_for_video promotion",
  reject_if: [
    "male or war-phase Byleth appears",
    "Byleth points the sword at a body or attacks",
    "Dedue loses the visible nape braid or students age up",
    "Ashe raises/fires the bow or Lonato attacks",
    "the frames become pasted plates, a flat lineup, or an unreadable fog wall",
    "the two-wing handoff to Shot025 is not visible",
    "Chinese/Mandarin voice, subtitles, UI, borders, or readable text appear",
  ],
};
fs.writeFileSync(path.join(root, reviewJson), JSON.stringify(review, null, 2) + "\n");

const reviewMd = "# Shot024 Byleth Command Two-Wing Integrated Re-Audit v2\n\n" +
  "Review date: 2026-08-22\n" +
  "Artifact: " + version + "\n" +
  "Status: monitor_required\n\n" +
  "## Why The Previous Set Was Rejected\n\n" +
  "The frozen v1 set was generated before the Shot023 v3 repair and could not be treated as the current receiving shot. Its spec remained frames_pending, its prompt allowed source/layout fallback, and it carried unrelated Rhea/Catherine locks. v1 is retained as historical evidence and marked blocked_needs_revision.\n\n" +
  "## Current Frame Review\n\n" +
  "- START receives the repaired Shot023 geography. Female Byleth enters the foreground and scans the wounded, Ashe, and Lonato; the students have not yet split.\n" +
  "- KEY is the decision point. Byleth's low sword tip and eyes divide the road into two flank lanes without aiming at a body. Ashe and Lonato stay non-violent in the pressure layer.\n" +
  "- END begins the handoff: Dimitri and Dedue take the left/center first steps, Ingrid opens the right fog lane, Byleth holds the center, and the road remains open for Shot025.\n\n" +
  "## Gate Checks\n\n" +
  "- Female academy Byleth identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Academy Dimitri/Dedue/Ingrid identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Dedue visible nape braid: pass_in_still_frames_monitor_in_motion\n" +
  "- Ashe/Lonato continuity from Shot023: pass_in_still_frames_monitor_in_motion\n" +
  "- Non-violent sword-tip command: pass_in_still_frames_monitor_in_motion\n" +
  "- Two-wing handoff to Shot025: pass_in_still_frames_monitor_in_motion\n" +
  "- Integrated live-action staging and shared ground contact: pass_in_still_frames\n" +
  "- START/KEY/END distinct action states: pass\n" +
  "- Upload-only executable prompt: rewritten_upload_only\n" +
  "- Japanese dialogue only: pass\n" +
  "- No burned subtitles/UI: required_in_prompt_and_negative\n\n" +
  "## Remaining Risks And Required Next Gate\n\n" +
  "Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. Inspect Byleth's female identity and restraint, sword-tip geometry, Dedue's braid, the low bow and low Lonato weapon, the two lane directions, shared mud contact, and the Japanese order. Reject if the shot becomes a pasted collage, static lineup, attack, age drift, male/war-phase Byleth, Chinese/Mandarin voice, subtitles, or UI.\n";
fs.writeFileSync(path.join(root, reviewMarkdown), reviewMd);

console.log(JSON.stringify({ shot: "Shot024", current: version, frames, reviewMarkdown, reviewJson }, null, 2));
