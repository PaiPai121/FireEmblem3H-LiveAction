const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const slug = "critical_reaudit_regen_v3";
const version = "critical_reaudit_regen_v3_2026-08-22";
const frames = {
  start: "storyboards/Shot023/" + version + "/start_frame.png",
  key: "storyboards/Shot023/" + version + "/key_frame.png",
  end: "storyboards/Shot023/" + version + "/end_frame.png",
};
const contactSheet = "storyboards/Shot023/" + version + "/contact_sheet.jpg";
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-22");
const reviewMarkdown = "production_system/reviews/critical_reaudit_2026-08-22/shot023_lonato_refusal_integrated_reaudit_v3_2026-08-22_review.md";
const reviewJson = "production_system/reviews/critical_reaudit_2026-08-22/shot023_current_web_candidate_integrated_reaudit_v3_2026-08-22.json";

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

const finding = "2026-08-22 sequential re-audit: the frozen Shot023 web candidate mixed a two-person refusal specification with an unlisted, ambiguous Byleth-like background figure. v3 is regenerated as an integrated live-action two-shot from the canonical local Ashe and Lonato identities, with Shot022 v2 END geography. START is the silent post-plea hold, KEY is Lonato's low guarded refusal, and END turns him toward indistinct rebel pressure for the Byleth command handoff.";
const requiredRevision = "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if any named performer besides Ashe or Lonato appears, the figures read as pasted plates, Lonato attacks or becomes a generic raider, Ashe raises or fires the bow, the rebel silhouettes become identifiable, the three states collapse into one tableau, or Chinese/Mandarin/subtitles/UI/borders appear.";
const source = "imagegen_integrated_live_action_with_local_identity_and_shot022_continuity_v3_2026-08-22";
const characters = ["Lonato", "Ashe"];
const presenceConstraint = "Only older white-haired armored Lonato and academy-era Ashe are named and readable in Shot023. Background rebels remain indistinct silhouettes. No Byleth, Dimitri, Catherine, Rhea, Felix, Dedue, Mercedes, Ingrid, or other named character enters this two-person refusal shot.";
const frameSet = {
  version,
  frame_set_id: "Shot023_" + version,
  source,
  frames,
  contact_sheet: contactSheet,
  status: "monitor_required",
  visual_audit_decision: "monitor_required",
  reference_assets: [
    "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "storyboards/Shot022/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
  ],
  generation_mode: "imagegen_integrated_live_action_with_local_identity_and_adjacent_shot_refs",
  review_markdown: reviewMarkdown,
  review_json: reviewJson,
  note: "v3 replaces the inconsistent integrated_candidate_v2 current set. It contains exactly Ashe and Lonato as readable performers in shared wet battlefield space: silent post-plea hold, low guarded refusal, and tactical turn toward indistinct rebel pressure. Keep monitor_required until motion probe.",
};

const metadata = read("storyboards/Shot023/metadata.json");
metadata.status = "monitor_required";
metadata.characters = characters;
metadata.asset_references = frameSet.reference_assets.slice(0, 3);
metadata.planned_frames = frames;
metadata.current_display_frame_set = slug;
metadata.current_display_frame_status = "monitor_required_" + version;
metadata.current_display_frame_source = source;
metadata.current_display_frame_note = "v3 replaces the inconsistent integrated_candidate_v2 set: only Ashe and Lonato are readable, and the three anchors are silent post-plea hold, low guarded refusal, and tactical turn toward indistinct rebel pressure.";
metadata.visual_audit_decision = "monitor_required";
metadata.visual_audit_finding = finding;
metadata.required_revision = requiredRevision;
metadata.video_prompt_qa_decision = "pending_review_against_" + version;
metadata.motion_probe_status = "pending_3s_probe_against_" + version;
metadata.character_presence_constraint = presenceConstraint;
metadata.audio_anchor = "Lonato, in Japanese: 問われぬ罪は、聖なる名の陰に隠されるだけだ。";
metadata.displayed_frame_set = frameSet;
for (const key of [
  "integrated_candidate_v2",
  "integrated_candidate_v2_2026_08_10",
  "local_asset_final_candidate_v1",
  "local_selected_png_composited_previs_v2",
  "local_selected_png_composited_previs_v3",
]) {
  blockSet(metadata, key, "Superseded on 2026-08-22: this historical candidate is not the current display set. The prior Shot023 pass either carried a pasted/layout-reference treatment or introduced an unlisted ambiguous Byleth-like figure into a two-person refusal. Retain for audit history only.");
}
metadata.critical_reaudit_regen_v3 = frameSet;
metadata.adjacent_continuity_review_2026_08_22 = {
  previous_shot: "Shot022",
  previous_end_frame: "storyboards/Shot022/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
  previous_to_start_finding: "Shot023 v3 START receives Shot022 v2 END's wet ridge, blue banners, road axis, and restrained plea distance. Ashe remains on the left with a low bow; Lonato holds the right/middle lane with sword low; no Byleth or Dimitri enters the two-person refusal.",
  next_shot: "Shot024",
  next_start_frame: "storyboards/Shot024/critical_reaudit_regen_v1_2026-08-14/start_frame.png",
  end_to_next_finding: "Shot023 v3 END turns Lonato toward the indistinct rebel line and leaves the center road open. The next command shot can receive that tactical pressure with female Byleth as the command focal point; strict motion and visual continuity remain monitor-only.",
  decision: "monitor_required",
  reject_if: [
    "an unlisted named character enters the two-person refusal",
    "Lonato's sword becomes an attack rather than a low guarded boundary",
    "Ashe raises or fires the bow",
    "the cut to Byleth command loses the open road and rebel-pressure direction",
  ],
};
write("storyboards/Shot023/metadata.json", metadata);

const queue = read("frame_generation_queue.json");
const queueShot = queue.shots.find((shot) => shot.id === "Shot023");
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
  "integrated_candidate_v2",
  "local_asset_final_candidate_v1",
  "local_selected_png_composited_previs_v2",
  "local_selected_png_composited_previs_v3",
]) {
  blockSet(queueShot, key, "Superseded on 2026-08-22. Retain as historical evidence only; the current display set is the integrated two-person v3 refusal chain.");
}
queueShot.critical_reaudit_regen_v3 = frameSet;
queueShot.previous_match_action_reference = "storyboards/Shot022/critical_reaudit_regen_v2_2026-08-22/end_frame.png";
queueShot.next_handoff_reference = "storyboards/Shot024/critical_reaudit_regen_v1_2026-08-14/start_frame.png";
queueShot.continuity_previous = "Shot022";
queueShot.continuity_next = "Shot024";
queueShot.model_notes = (queueShot.model_notes || []).filter((note) => !note.includes("Current displayed start/key/end") && !note.includes("Current displayed frames") && !note.includes("integrated v2 resolves"));
queueShot.model_notes.push("Current displayed frames are the 2026-08-22 v3 integrated two-person Shot023 repair: Ashe and older white-haired Lonato share the wet battlefield; START holds the post-plea silence, KEY hardens the low guarded refusal, and END turns toward indistinct rebel pressure for Byleth command. Keep monitor_required until prompt-against-frame QA and a 3-second motion probe.");
queueShot.reject_if = queueShot.reject_if || [];
[
  "Only Ashe and Lonato may be named/readable; background rebels stay indistinct",
  "Lonato must keep the sword low and guarded, never swing or attack",
  "Ashe must keep the bow and string low throughout the chain",
  "The END road opening must hand off to the female Byleth command shot",
].forEach((value) => addUnique(queueShot.reject_if, value));
write("frame_generation_queue.json", queue);

const delivery = read("production_system/video_delivery_manifest.json");
const deliveryShot = delivery.shots.find((shot) => shot.id === "Shot023");
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
  "integrated_candidate_v2",
  "local_asset_final_candidate_v1",
  "local_selected_png_composited_previs_v2",
  "local_selected_png_composited_previs_v3",
]) {
  blockSet(deliveryShot, key, "Superseded on 2026-08-22. Retain as historical evidence only; the current display set is the integrated two-person v3 refusal chain.");
}
deliveryShot.critical_reaudit_regen_v3 = frameSet;
deliveryShot.previous_match_action_reference = "storyboards/Shot022/critical_reaudit_regen_v2_2026-08-22/end_frame.png";
deliveryShot.next_handoff_reference = "storyboards/Shot024/critical_reaudit_regen_v1_2026-08-14/start_frame.png";
deliveryShot.model_notes = (deliveryShot.model_notes || []).filter((note) => !note.includes("Current displayed start/key/end") && !note.includes("Current displayed frames") && !note.includes("integrated v2 resolves"));
deliveryShot.model_notes.push("Current displayed frames are the 2026-08-22 v3 integrated two-person Shot023 repair: Ashe listens with a lowered bow while older white-haired Lonato moves from restrained refusal to a tactical turn toward indistinct rebel pressure. Keep monitor_required until a 3-second motion probe.");
deliveryShot.reject_if = deliveryShot.reject_if || [];
[
  "Only Ashe and Lonato are readable named performers; no Byleth or Dimitri enters early",
  "No pasted character plates, transparent halos, or flat lineup",
  "Lonato must not attack, swing, or become a generic villain",
  "Ashe must not raise or fire the bow",
].forEach((value) => addUnique(deliveryShot.reject_if, value));
write("production_system/video_delivery_manifest.json", delivery);

const continuity = read("production_system/continuity_manifest.json");
const pair2223 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot022-Shot023");
if (pair2223) {
  pair2223.decision = "monitor_required";
  pair2223.notes = "2026-08-22 Shot023 v3 adjacency audit: Shot022 v2 END's restrained Ashe/Lonato plea hands into a strict two-person Shot023 v3 START. Ashe keeps the bow low on the left, Lonato holds the right/middle lane with the sword low, and the shared wet ridge, fog, banners, and road axis are preserved. Keep monitor_required until motion probe.";
}
const pair2324 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot023-Shot024");
if (pair2324) {
  pair2324.decision = "monitor_required";
  pair2324.notes = "2026-08-22 Shot023 v3→Shot024 handoff audit: Shot023 END turns older white-haired Lonato toward indistinct rebel pressure and leaves an open road for the command cut. Shot024's current female-Byleth-locked START is the intended receiving focal point; strict screen-direction, identity, and motion continuity remain monitor-only until the probe.";
}
write("production_system/continuity_manifest.json", continuity);

fs.mkdirSync(reviewDir, { recursive: true });
const review = {
  shot_id: "Shot023",
  review_date: "2026-08-22",
  review_type: "lonato_refusal_integrated_two_person_sequential_reaudit",
  previous_display_frame_set: "integrated_candidate_v2_2026-08-10",
  current_display_frame_set: version,
  status: "monitor_required",
  decision: "monitor_required",
  previous_shot: "Shot022",
  next_shot: "Shot024",
  reviewed_contact_sheet: "episodes/EP03/" + contactSheet,
  frames: {
    start: "episodes/EP03/" + frames.start,
    key: "episodes/EP03/" + frames.key,
    end: "episodes/EP03/" + frames.end,
  },
  reference_assets: frameSet.reference_assets,
  prior_rejection: [
    "The frozen integrated_candidate_v2 contact sheet introduced an unlisted, ambiguous Byleth-like background figure even though the shot frame specification defined a two-person Ashe/Lonato refusal.",
    "The older layout_reference and selected.png composite candidates are retained as audit history only and are not acceptable current cinematic frames.",
    "The previous current prompt and metadata did not make the two-person presence constraint and the low guarded sword beat strict enough.",
  ],
  passes: [
    "START receives Shot022 v2 END's wet ridge, road axis, fog, and restrained dialogue distance.",
    "Only canonical academy Ashe and older white-haired armored Lonato are readable; background rebels remain indistinct.",
    "KEY makes the refusal legible through direct eyeline and a low guarded sword boundary without an attack.",
    "END turns Lonato toward the rebel pressure while Ashe remains visible and non-violent, opening the handoff to Byleth command.",
    "The two performers share scale, perspective, wet ground contact, fog, and lighting; no pasted portrait plates are used.",
    "START, KEY, and END are distinct action states: post-plea silence, refusal guard, tactical turn.",
    "The executable prompt is upload-only and Japanese dialogue only.",
  ],
  monitor_risks: [
    "A motion model may add Byleth or another named performer to the fog; reject any readable extra identity.",
    "Lonato may escalate the low guarded sword into a swing or generic villain performance; inspect the probe.",
    "Ashe may raise or fire the bow after the refusal; reject if the lowered-bow state breaks.",
    "The 023→024 cut must preserve the open road and rebel-pressure direction while introducing female Byleth only in the next shot.",
    "Japanese dialogue timing, no subtitles, and no Chinese/Mandarin voice must survive generation.",
  ],
  required_next_gate: "prompt-against-frame QA plus 3-second motion probe before any approved_for_video promotion",
  reject_if: [
    "Byleth, Dimitri, or any other named character appears in this two-person shot",
    "characters become pasted plates or a flat lineup",
    "Lonato attacks, swings the sword, becomes generic, or shows gore",
    "Ashe raises or fires the bow",
    "the rebel silhouettes become identifiable or the open-road handoff is lost",
    "Chinese/Mandarin voice, subtitles, UI, borders, or readable text appear",
  ],
};
fs.writeFileSync(path.join(root, reviewJson), JSON.stringify(review, null, 2) + "\n");

const reviewMd = "# Shot023 Lonato Refusal Integrated Re-Audit v3\n\n" +
  "Review date: 2026-08-22\n" +
  "Artifact: " + version + "\n" +
  "Status: monitor_required\n\n" +
  "## Why The Previous Set Was Rejected\n\n" +
  "The frozen integrated_candidate_v2 set mixed a two-person refusal specification with an unlisted, ambiguous Byleth-like figure in the background. That weakened the Shot022→023 dialogue handoff and made the candidate unsuitable as the current web frame set. Older selected.png composites and layout_reference candidates remain in the audit history, marked blocked_needs_revision.\n\n" +
  "## Current Frame Review\n\n" +
  "- START is the silent post-plea two-shot: Ashe holds the left foreground with a low bow, and older white-haired Lonato holds the right/middle road lane with the sword low.\n" +
  "- KEY is the refusal peak: Lonato looks directly at Ashe and brings the sword across his body into a low guarded line, without swinging or attacking. Ashe listens with the bow and string low.\n" +
  "- END is the tactical handoff: Lonato turns three-quarters toward indistinct rebel pressure while Ashe stays visible on the left and the center road remains open for Byleth command.\n\n" +
  "## Gate Checks\n\n" +
  "- Canonical older Lonato identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Canonical academy Ashe identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Two-person presence constraint: pass_in_still_frames_monitor_in_motion\n" +
  "- Integrated live-action staging and shared ground contact: pass_in_still_frames\n" +
  "- Low guarded sword / lowered bow / non-graphic refusal: pass_in_still_frames_monitor_in_motion\n" +
  "- 022→023 and 023→024 geography: pass_in_still_frames_monitor_in_motion\n" +
  "- START/KEY/END distinct action states: pass\n" +
  "- Upload-only executable prompt: rewritten_upload_only\n" +
  "- Japanese dialogue only: pass\n" +
  "- No burned subtitles/UI: required_in_prompt_and_negative\n\n" +
  "## Remaining Risks And Required Next Gate\n\n" +
  "Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. Inspect extra identities in the fog, Lonato's age and restraint, Ashe's lowered bow, shared mud contact, the open road exit, and Japanese dialogue timing. Reject if the shot becomes a pasted collage, a lineup, an attack, a generic villain beat, a male/ambiguous Byleth intrusion, Chinese/Mandarin voice, subtitles, or UI.\n";
fs.writeFileSync(path.join(root, reviewMarkdown), reviewMd);

console.log(JSON.stringify({ shot: "Shot023", current: version, frames, reviewMarkdown, reviewJson }, null, 2));
