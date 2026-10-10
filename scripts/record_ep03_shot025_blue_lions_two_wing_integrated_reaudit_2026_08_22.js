const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const slug = "critical_reaudit_regen_v2";
const version = "critical_reaudit_regen_v2_2026-08-22";
const frames = {
  start: "storyboards/Shot025/" + version + "/start_frame.png",
  key: "storyboards/Shot025/" + version + "/key_frame.png",
  end: "storyboards/Shot025/" + version + "/end_frame.png",
};
const contactSheet = "storyboards/Shot025/" + version + "/contact_sheet.jpg";
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-22");
const reviewMarkdown = "production_system/reviews/critical_reaudit_2026-08-22/shot025_blue_lions_two_wing_integrated_reaudit_v2_2026-08-22_review.md";
const reviewJson = "production_system/reviews/critical_reaudit_2026-08-22/shot025_current_web_candidate_two_wing_reaudit_v2_2026-08-22.json";

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

const finding = "2026-08-22 sequential re-audit: the frozen Shot025 root frames were deterministic selected.png composites with six characters arranged as a pasted lineup. They did not prove formation motion, shared ground contact, or a readable front/flank/rear action chain. v2 is regenerated from Shot024 v2 END plus canonical local Sylvain, Mercedes, and Annette references; it stages Dimitri/Dedue front pressure, Ingrid/Sylvain flank wrap, and Mercedes/Annette rear safety before the Ashe aim cut.";
const requiredRevision = "Keep monitor_required. Run prompt-against-frame QA, strict Shot024→025 and 025→026 continuity QA, and a 3-second motion probe; reject if any Blue Lion reads as a pasted plate, Dedue loses the visible nape braid or ages up, the three-layer formation is muddy or reversed, the rear line disappears, Ashe fires early, Lonato is attacked, or Chinese/Mandarin/subtitles/UI/borders appear.";
const source = "imagegen_integrated_live_action_with_local_identity_and_shot024_continuity_v2_2026-08-22";
const characters = ["Dimitri", "Dedue", "Sylvain", "Ingrid", "Mercedes", "Annette"];
const presenceConstraint = "Exactly six named readable action performers: academy Dimitri, academy Dedue with visible compact silver-white nape braid, academy Sylvain, academy Ingrid, academy Mercedes, and academy Annette. Female Byleth and Ashe/Lonato remain distant context only. No Catherine, Rhea, Felix, or other named character enters as a readable foreground performer.";
const frameSet = {
  version,
  frame_set_id: "Shot025_" + version,
  source,
  frames,
  contact_sheet: contactSheet,
  status: "monitor_required",
  visual_audit_decision: "monitor_required",
  reference_assets: [
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/blue_lions/Dedue/academy/selected.png",
    "assets/characters/blue_lions/Sylvain/academy/selected.png",
    "assets/characters/blue_lions/Ingrid/academy/selected.png",
    "assets/characters/blue_lions/Mercedes/academy/selected.png",
    "assets/characters/blue_lions/Annette/academy/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "storyboards/Shot024/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
  ],
  generation_mode: "imagegen_integrated_live_action_with_local_identity_and_adjacent_shot_refs",
  review_markdown: reviewMarkdown,
  review_json: reviewJson,
  note: "v2 replaces the pasted six-person lineup. It contains a shared wet battlefield with distinct front pressure, flank wrap, and rear safety states, then leaves the sightline open for Shot026 Ashe aim. Keep monitor_required until motion probe.",
};

const metadata = read("storyboards/Shot025/metadata.json");
metadata.status = "monitor_required";
metadata.characters = characters;
metadata.asset_references = frameSet.reference_assets;
metadata.planned_frames = frames;
metadata.current_display_frame_set = slug;
metadata.current_display_frame_status = "monitor_required_" + version;
metadata.current_display_frame_source = source;
metadata.current_display_frame_note = "v2 replaces the pasted root lineup: Dimitri/Dedue hold the front, Ingrid/Sylvain wrap the sides, Mercedes/Annette hold the rear, and the END leaves a clear Ashe-aim sightline.";
metadata.visual_audit_decision = "monitor_required";
metadata.visual_audit_finding = finding;
metadata.required_revision = requiredRevision;
metadata.video_prompt_qa_decision = "pending_review_against_" + version;
metadata.motion_probe_status = "pending_3s_probe_against_" + version;
metadata.character_presence_constraint = presenceConstraint;
metadata.audio_anchor = "No spoken dialogue; boots in mud, cloth/armor movement, wind, distant fog-muted orders, and lantern impacts only.";
metadata.displayed_frame_set = frameSet;
for (const key of [
  "local_asset_final_candidate_v1",
  "local_selected_png_composited_previs_v2",
  "local_selected_png_composited_previs_v3",
]) {
  blockSet(metadata, key, "Superseded on 2026-08-22: this historical candidate is a deterministic pasted/layout-reference lineup, not the current cinematic frame set. Retain for audit history only.");
}
metadata.critical_reaudit_regen_v2 = frameSet;
metadata.adjacent_continuity_review_2026_08_22 = {
  previous_shot: "Shot024",
  previous_end_frame: "storyboards/Shot024/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
  previous_to_start_finding: "Shot025 v2 START receives Shot024 v2's central command, first left/center movement, right fog lane, open road, wet mud, and blue-banner geography. The six Blue Lions remain the readable action focus while Byleth and the Ashe/Lonato pressure recede into context.",
  next_shot: "Shot026",
  next_start_frame: "storyboards/Shot026/start_frame.png",
  end_to_next_finding: "Shot025 v2 END separates the wings and leaves a clear road-edge sightline for Shot026's non-lethal Ashe aim. The formation does not fire, attack, or complete the capture before the cut.",
  decision: "monitor_required",
  reject_if: [
    "the three-layer formation is unreadable or reverses screen direction",
    "the rear line disappears before Shot026",
    "Ashe fires early or Lonato is attacked",
    "the handoff sightline to Ashe aim is closed",
  ],
};
write("storyboards/Shot025/metadata.json", metadata);

const queue = read("frame_generation_queue.json");
const queueShot = queue.shots.find((shot) => shot.id === "Shot025");
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
  "local_asset_final_candidate_v1",
  "local_selected_png_composited_previs_v2",
  "local_selected_png_composited_previs_v3",
]) {
  blockSet(queueShot, key, "Superseded on 2026-08-22 because the candidate was a pasted six-person lineup and did not prove formation motion. Retain as historical evidence only.");
}
queueShot.critical_reaudit_regen_v2 = frameSet;
queueShot.previous_match_action_reference = "storyboards/Shot024/critical_reaudit_regen_v2_2026-08-22/end_frame.png";
queueShot.next_handoff_reference = "storyboards/Shot026/start_frame.png";
queueShot.continuity_previous = "Shot024";
queueShot.continuity_next = "Shot026";
queueShot.model_notes = (queueShot.model_notes || []).filter((note) => !note.includes("Current displayed start/key/end") && !note.includes("Current displayed frames"));
queueShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 integrated Shot025 repair: six Blue Lions share one wet battlefield with front pressure, flank wrap, and rear safety; END leaves the sightline for Ashe aim. Keep monitor_required until prompt-against-frame QA and a 3-second motion probe.");
queueShot.reject_if = queueShot.reject_if || [];
[
  "Only the six Blue Lions may be readable action performers",
  "Dedue must retain academy age and the visible compact nape braid",
  "Dimitri/Dedue front, Ingrid/Sylvain flank, and Mercedes/Annette rear roles must remain legible",
  "END must leave the non-lethal Ashe aim sightline without an early arrow release",
].forEach((value) => addUnique(queueShot.reject_if, value));
write("frame_generation_queue.json", queue);

const delivery = read("production_system/video_delivery_manifest.json");
const deliveryShot = delivery.shots.find((shot) => shot.id === "Shot025");
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
  "local_asset_final_candidate_v1",
  "local_selected_png_composited_previs_v2",
  "local_selected_png_composited_previs_v3",
]) {
  blockSet(deliveryShot, key, "Superseded on 2026-08-22 because the candidate was a pasted six-person lineup and did not prove formation motion. Retain as historical evidence only.");
}
deliveryShot.critical_reaudit_regen_v2 = frameSet;
deliveryShot.previous_match_action_reference = "storyboards/Shot024/critical_reaudit_regen_v2_2026-08-22/end_frame.png";
deliveryShot.next_handoff_reference = "storyboards/Shot026/start_frame.png";
deliveryShot.model_notes = (deliveryShot.model_notes || []).filter((note) => !note.includes("Current displayed start/key/end") && !note.includes("Current displayed frames"));
deliveryShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 integrated Shot025 repair: the Blue Lions form front, flank, and rear layers in shared wet space, then leave an open Ashe-aim sightline. Keep monitor_required until a 3-second motion probe.");
deliveryShot.reject_if = deliveryShot.reject_if || [];
[
  "No pasted character plates, transparent halos, flat lineup, or missing shared ground contact",
  "Dedue must retain the visible compact nape braid and academy age",
  "The front/flank/rear formation must remain readable in motion",
  "No early Ashe arrow release or Lonato attack",
].forEach((value) => addUnique(deliveryShot.reject_if, value));
write("production_system/video_delivery_manifest.json", delivery);

const continuity = read("production_system/continuity_manifest.json");
const pair2425 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot024-Shot025");
if (pair2425) {
  pair2425.decision = "monitor_required";
  pair2425.notes = "2026-08-22 Shot025 v2 adjacency audit: Shot024 v2 END's command center, first left/center movement, right fog lane, and open road are received by a six-person integrated formation. Dimitri/Dedue establish front pressure, Ingrid/Sylvain open the sides, and Mercedes/Annette preserve the rear. Keep monitor_required until motion probe.";
}
const pair2526 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot025-Shot026");
if (pair2526) {
  pair2526.decision = "monitor_required";
  pair2526.notes = "2026-08-22 Shot025 v2→Shot026 handoff audit: END separates the two wings, keeps the rear line and Byleth context behind, and leaves a clear road-edge sightline for Ashe's non-lethal aim. No arrow release or attack occurs before the cut; strict motion continuity remains monitor-only.";
}
write("production_system/continuity_manifest.json", continuity);

fs.mkdirSync(reviewDir, { recursive: true });
const review = {
  shot_id: "Shot025",
  review_date: "2026-08-22",
  review_type: "blue_lions_two_wing_integrated_formation_sequential_reaudit",
  previous_display_frame_set: "local_asset_final_candidate_v1_2026-08-02",
  current_display_frame_set: version,
  status: "monitor_required",
  decision: "monitor_required",
  previous_shot: "Shot024",
  next_shot: "Shot026",
  reviewed_contact_sheet: "episodes/EP03/" + contactSheet,
  frames: {
    start: "episodes/EP03/" + frames.start,
    key: "episodes/EP03/" + frames.key,
    end: "episodes/EP03/" + frames.end,
  },
  reference_assets: frameSet.reference_assets,
  prior_rejection: [
    "The frozen root START/KEY/END were deterministic selected.png composites with six upright character cutouts placed side by side against the ridge.",
    "The old spec remained frames_pending and the prompt allowed source/layout fallback, so it could not control a video model against actual frames.",
    "The old prompt carried unrelated Rhea/Catherine/Lonato locks and did not make the front/flank/rear formation or the Ashe-aim handoff strict.",
  ],
  passes: [
    "START receives Shot024 v2's two-wing command and preserves the wet road, blue banners, fog, and distant moral pressure.",
    "Only six Blue Lions are readable action performers; their academy identities and shared ground contact are integrated.",
    "KEY makes the three layers legible: Dimitri/Dedue front, Ingrid/Sylvain flank, Mercedes/Annette rear.",
    "END separates the wings and leaves a clean sightline for Shot026 Ashe aim without an early arrow release.",
    "Dedue's visible compact nape braid and academy age are present in the still chain; motion remains monitor-only.",
    "START, KEY, and END are distinct action states rather than crop or lighting variants.",
    "The executable prompt is upload-only and contains no spoken dialogue; audio is environmental only.",
  ],
  monitor_risks: [
    "A motion model may collapse the six-person formation into a muddy crowd; inspect each role in the probe.",
    "Dedue's braid, academy age, and face may drift in a high-oblique wide shot.",
    "The flank lanes may mirror or reset; reject if the 024 direction is lost.",
    "Mercedes/Annette may disappear from the rear line or become generic extras.",
    "Ashe may fire too early or Lonato may be attacked before Shot026/027; reject the premature escalation.",
  ],
  required_next_gate: "prompt-against-frame QA plus 3-second motion probe before any approved_for_video promotion",
  reject_if: [
    "six Blue Lions become pasted cutouts, a flat lineup, or a mismatched composite",
    "front/flank/rear roles cannot be read",
    "Dedue loses the visible nape braid or students age up",
    "Ashe fires, Lonato is attacked, or graphic/triumphal violence appears",
    "the road sightline for Shot026 Ashe aim is lost",
    "Chinese/Mandarin voice, subtitles, UI, borders, or readable text appear",
  ],
};
fs.writeFileSync(path.join(root, reviewJson), JSON.stringify(review, null, 2) + "\n");

const reviewMd = "# Shot025 Blue Lions Two-Wing Integrated Re-Audit v2\n\n" +
  "Review date: 2026-08-22\n" +
  "Artifact: " + version + "\n" +
  "Status: monitor_required\n\n" +
  "## Why The Previous Set Was Rejected\n\n" +
  "The frozen Shot025 root frames were deterministic selected.png composites: six upright figures were placed side by side against a ridge. They read as a lineup, not as a coordinated movement, and the prompt still allowed source/layout fallback with unrelated character locks. The old set is retained as historical evidence and marked blocked_needs_revision.\n\n" +
  "## Current Frame Review\n\n" +
  "- START receives Shot024's command state and establishes the three layers in one wet road: front pressure, side routes, and rear safety.\n" +
  "- KEY is the formation peak: Dimitri/Dedue physically hold the road, Ingrid/Sylvain peel into opposite fog lanes, and Mercedes/Annette remain behind with practical lantern light.\n" +
  "- END separates the wings and leaves a clear road-edge sightline for Ashe's next non-lethal aim. No arrow release or Lonato attack occurs in this shot.\n\n" +
  "## Gate Checks\n\n" +
  "- Academy Dimitri/Dedue/Sylvain/Ingrid/Mercedes/Annette identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Dedue visible nape braid and academy age: pass_in_still_frames_monitor_in_motion\n" +
  "- Integrated shared mud/fog/lighting and no pasted plates: pass_in_still_frames\n" +
  "- Front/flank/rear formation readability: pass_in_still_frames_monitor_in_motion\n" +
  "- Shot024→025 continuity: pass_in_still_frames_monitor_in_motion\n" +
  "- Shot025→026 Ashe-aim sightline: pass_in_still_frames_monitor_in_motion\n" +
  "- START/KEY/END distinct action states: pass\n" +
  "- Upload-only executable prompt: rewritten_upload_only\n" +
  "- No spoken dialogue / environmental audio only: pass\n" +
  "- No burned subtitles/UI: required_in_prompt_and_negative\n\n" +
  "## Remaining Risks And Required Next Gate\n\n" +
  "Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. Inspect all six role lanes, Dedue's braid and age, the direction inherited from Shot024, the rear line, and the open sightline for Ashe. Reject if the formation collapses into a crowd or collage, any early arrow/attack appears, the camera becomes a game map, or subtitles, UI, Chinese/Mandarin voice, or borders appear.\n";
fs.writeFileSync(path.join(root, reviewMarkdown), reviewMd);

console.log(JSON.stringify({ shot: "Shot025", current: version, frames, reviewMarkdown, reviewJson }, null, 2));
