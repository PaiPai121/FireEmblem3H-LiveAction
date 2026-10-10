const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const slug = "critical_reaudit_regen_v2";
const version = "critical_reaudit_regen_v2_2026-08-22";
const frames = {
  start: "storyboards/Shot022/" + version + "/start_frame.png",
  key: "storyboards/Shot022/" + version + "/key_frame.png",
  end: "storyboards/Shot022/" + version + "/end_frame.png",
};
const contactSheet = "storyboards/Shot022/" + version + "/contact_sheet.jpg";
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-22");
const reviewMarkdown = "production_system/reviews/critical_reaudit_2026-08-22/shot022_ashe_advance_integrated_reaudit_v2_2026-08-22_review.md";
const reviewJson = "production_system/reviews/critical_reaudit_2026-08-22/shot022_current_web_candidate_integrated_reaudit_2026-08-22.json";

function read(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}
function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(value, null, 2) + "\n");
}
function addUnique(items, value) {
  if (!items.includes(value)) items.push(value);
}

const finding = "2026-08-22 sequential re-audit: the frozen Shot022 candidates were deterministic selected.png composites with cutout-like edges and were still labeled layout_reference; female Byleth was not visually cleared. v2 is regenerated as integrated live-action from the canonical local Ashe, Lonato, Dimitri, and female Byleth assets with Shot021 v2 END adjacency. START is Byleth allowing Ashe forward, KEY is Ashe taking one deliberate step with a lowered bow, and END is a grounded three-quarter exchange where Ashe begins the plea and Lonato lowers his weapon with an open hand.";
const requiredRevision = "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if female Byleth becomes male or ambiguous, any performer reads as pasted onto the fog, Ashe does not advance, Ashe raises or fires the bow, Dimitri blocks the conversation, Lonato becomes a generic raider or attacks, the three states collapse into a lineup, or Chinese/Mandarin/subtitles/UI/borders appear.";
const source = "imagegen_integrated_live_action_with_local_asset_identity_and_shot021_continuity_v2_2026-08-22";
const characters = ["Ashe", "Lonato", "Dimitri", "Byleth"];
const presenceConstraint = "Only academy Ashe, older white-haired armored Lonato, academy Dimitri, and female academy-era Byleth are named and readable in Shot022. No Rhea, Catherine, Felix, Dedue, Mercedes, Ingrid, or other named character enters.";

const frameSet = {
  version,
  frame_set_id: "Shot022_" + version,
  source,
  frames,
  contact_sheet: contactSheet,
  status: "monitor_required",
  visual_audit_decision: "monitor_required",
  reference_assets: [
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "storyboards/Shot021/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
  ],
  generation_mode: "imagegen_integrated_live_action_with_local_identity_and_adjacent_shot_refs",
  review_markdown: reviewMarkdown,
  review_json: reviewJson,
  note: "v2 replaces the composited/layout_reference v1 set. It has exactly Ashe, Lonato, Dimitri, and female Byleth in shared wet battlefield space: permission, deliberate advance, and restrained plea before refusal. Keep monitor_required until motion probe.",
};

const metadata = read("storyboards/Shot022/metadata.json");
metadata.status = "monitor_required";
metadata.characters = characters;
metadata.asset_references = frameSet.reference_assets.slice(0, 5);
metadata.planned_frames = frames;
metadata.current_display_frame_set = slug;
metadata.current_display_frame_status = "monitor_required_" + version;
metadata.current_display_frame_source = source;
metadata.current_display_frame_note = "v2 replaces the pasted composited/layout_reference set: female Byleth allows Ashe forward, Ashe advances with a lowered bow, and the END lands on a grounded plea exchange with Lonato.";
metadata.visual_audit_decision = "monitor_required";
metadata.visual_audit_finding = finding;
metadata.required_revision = requiredRevision;
metadata.video_prompt_qa_decision = "pending_review_against_" + version;
metadata.motion_probe_status = "pending_3s_probe_against_" + version;
metadata.character_presence_constraint = presenceConstraint;
metadata.audio_anchor = "Ashe, in Japanese: ロナート様、どうか止まってください。";
metadata.displayed_frame_set = frameSet;
metadata.byleth_visual_spotcheck_2026_08_14 = "replaced_by_v2_integrated_female_identity_pass_in_still_frames_monitor_in_motion";
if (metadata.local_asset_final_candidate_v1) {
  metadata.local_asset_final_candidate_v1.status = "blocked_needs_revision";
  metadata.local_asset_final_candidate_v1.visual_audit_decision = "blocked_needs_revision";
  metadata.local_asset_final_candidate_v1.note = "Superseded on 2026-08-22: deterministic selected.png composite read as pasted layout_reference and did not visually clear female Byleth.";
}
metadata.critical_reaudit_regen_v2 = frameSet;
metadata.adjacent_continuity_review_2026_08_22 = {
  previous_shot: "Shot021",
  previous_end_frame: "storyboards/Shot021/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
  previous_to_start_finding: "Shot022 v2 START receives Shot021 v2 END's wet ridge, blue banner, Lonato road position, and Ashe/Dimitri recognition line. Female Byleth occupies the right depth and gives one permission gesture; the frame is integrated live action rather than a cutout board.",
  next_shot: "Shot023",
  next_start_frame: "storyboards/Shot023/integrated_candidate_v2_2026-08-10/start_frame.png",
  end_to_next_finding: "Shot022 v2 END lands on Ashe facing Lonato with a lowered bow and open plea hand, while Lonato lowers the sword and opens one hand in restraint. The moral pressure can cut to Shot023's refusal without an attack or extra character entering early.",
  decision: "monitor_required",
  reject_if: [
    "female Byleth is not visually readable or changes gender across the chain",
    "a performer reads as a pasted portrait plate without shared ground contact",
    "Ashe does not advance or Dimitri blocks the speaking line",
    "Lonato attacks, raises the sword, or becomes a generic raider",
  ],
};
write("storyboards/Shot022/metadata.json", metadata);

const queue = read("frame_generation_queue.json");
const queueShot = queue.shots.find((shot) => shot.id === "Shot022");
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
if (queueShot.local_asset_final_candidate_v1) {
  queueShot.local_asset_final_candidate_v1.status = "blocked_needs_revision";
  queueShot.local_asset_final_candidate_v1.visual_audit_decision = "blocked_needs_revision";
  queueShot.local_asset_final_candidate_v1.note = "Superseded on 2026-08-22 because the current web candidate was a pasted selected.png composite and female Byleth was not visually cleared.";
}
queueShot.critical_reaudit_regen_v2 = frameSet;
queueShot.previous_match_action_reference = "storyboards/Shot021/critical_reaudit_regen_v2_2026-08-21/end_frame.png";
queueShot.next_handoff_reference = "storyboards/Shot023/integrated_candidate_v2_2026-08-10/start_frame.png";
queueShot.continuity_previous = "Shot021";
queueShot.continuity_next = "Shot023";
queueShot.model_notes = (queueShot.model_notes || []).filter((note) => !note.includes("composited previs v3") && !note.includes("local_asset_final_candidate_v1"));
queueShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 integrated Shot022 repair: exactly Ashe, Lonato, Dimitri, and female Byleth in shared wet battlefield space; permission, one deliberate Ashe advance with lowered bow, and restrained plea before refusal. Keep monitor_required until prompt-against-frame QA and a 3-second motion probe.");
queueShot.reject_if = queueShot.reject_if || [];
[
  "Female Byleth must remain female and academy-era across START/KEY/END",
  "Characters must be integrated into the same fog, mud, perspective, and contact-shadow space, never pasted plates",
  "Ashe must visibly advance with a lowered bow and own the speaking line",
  "Lonato must remain older, white-haired, restrained, and non-graphic",
].forEach((value) => addUnique(queueShot.reject_if, value));
write("frame_generation_queue.json", queue);

const delivery = read("production_system/video_delivery_manifest.json");
const deliveryShot = delivery.shots.find((shot) => shot.id === "Shot022");
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
if (deliveryShot.local_asset_final_candidate_v1) {
  deliveryShot.local_asset_final_candidate_v1.status = "blocked_needs_revision";
  deliveryShot.local_asset_final_candidate_v1.visual_audit_decision = "blocked_needs_revision";
  deliveryShot.local_asset_final_candidate_v1.note = "Superseded on 2026-08-22 because the candidate was a pasted selected.png composite/layout_reference set and female Byleth was not visually cleared.";
}
deliveryShot.critical_reaudit_regen_v2 = frameSet;
deliveryShot.previous_match_action_reference = "storyboards/Shot021/critical_reaudit_regen_v2_2026-08-21/end_frame.png";
deliveryShot.next_handoff_reference = "storyboards/Shot023/integrated_candidate_v2_2026-08-10/start_frame.png";
deliveryShot.model_notes = (deliveryShot.model_notes || []).filter((note) => !note.includes("composited previs v3") && !note.includes("local_asset_final_candidate_v1"));
deliveryShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 integrated Shot022 repair: Ashe advances with a lowered bow, Lonato holds a restrained open-hand response, Dimitri yields the line, and female Byleth remains in the right depth. Keep monitor_required until a 3-second motion probe.");
deliveryShot.reject_if = deliveryShot.reject_if || [];
[
  "Female Byleth must remain female and academy-era across the uploaded frame chain and generated clip",
  "No pasted character plates, flat lineup, or missing shared ground contact",
  "Ashe must advance, speak in Japanese, and not fire the bow",
  "Lonato must not attack or become a generic raider",
].forEach((value) => addUnique(deliveryShot.reject_if, value));
write("production_system/video_delivery_manifest.json", delivery);

const continuity = read("production_system/continuity_manifest.json");
const pair2122 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot021-Shot022");
if (pair2122) {
  pair2122.decision = "monitor_required";
  pair2122.notes = "2026-08-22 Shot022 v2 adjacency audit: Shot021 v2 END supplies the muddy ridge, blue banner, Lonato road position, and Ashe/Dimitri recognition line. Shot022 v2 START receives that geography with female Byleth in the right depth giving Ashe permission; the performers share ground contact and fog depth. Keep monitor_required until motion probe.";
}
const pair2223 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot022-Shot023");
if (pair2223) {
  pair2223.decision = "monitor_required";
  pair2223.notes = "2026-08-22 Shot022 v2 adjacency audit: Ashe's single advance lands in a restrained three-quarter plea; Lonato lowers the sword and opens one hand, Dimitri yields the lane, and female Byleth remains in the right depth. The moral pressure hands off cleanly to Shot023 refusal without an attack or extra named character. Keep monitor_required until motion probe.";
}
write("production_system/continuity_manifest.json", continuity);

fs.mkdirSync(reviewDir, { recursive: true });
const review = {
  shot_id: "Shot022",
  review_date: "2026-08-22",
  review_type: "ashe_advance_integrated_live_action_sequential_reaudit",
  previous_display_frame_set: "local_asset_final_candidate_v1_2026-08-02",
  current_display_frame_set: version,
  status: "monitor_required",
  decision: "monitor_required",
  previous_shot: "Shot021",
  next_shot: "Shot023",
  reviewed_contact_sheet: "episodes/EP03/" + contactSheet,
  frames: {
    start: "episodes/EP03/" + frames.start,
    key: "episodes/EP03/" + frames.key,
    end: "episodes/EP03/" + frames.end,
  },
  reference_assets: frameSet.reference_assets,
  prior_rejection: [
    "The frozen web candidate was a deterministic selected.png composite with visible cutout/plate behavior and was explicitly labeled layout_reference rather than an integrated cinematic frame set.",
    "The earlier prompt carried unrelated Rhea and Catherine locks and allowed generation from source/layout references instead of the actual uploaded START/KEY/END frames.",
    "Female Byleth was not visually cleared in the old candidate and required a fresh local female identity re-audit.",
  ],
  passes: [
    "START receives Shot021 v2's wet ridge and recognition geography, with female Byleth giving one permission gesture from the right depth.",
    "KEY makes Ashe's deliberate advance and lowered bow readable without turning Dimitri into a blocker.",
    "END lands on a real three-quarter exchange: Ashe opens a restrained plea, Lonato lowers his weapon and opens one hand, and the road remains visible for the refusal cut.",
    "All four named performers share perspective, fog, wet-ground contact, clothing light, and depth; no pasted portrait plates are used.",
    "START, KEY, and END are distinct action states rather than lighting-only variants.",
    "Female Byleth identity is present in the integrated still-frame chain; motion remains monitor-only.",
    "The executable prompt is upload-only and Japanese dialogue only.",
  ],
  monitor_risks: [
    "Motion may drift Byleth toward male/ambiguous presentation because her face is secondary in the over-shoulder composition.",
    "Ashe may raise or fire the bow after the step; reject if the lowered-bow continuity breaks.",
    "Lonato may become a generic villain or lift the sword during the plea; reject if restraint breaks.",
    "The generated motion must preserve the shared mud contact and distinct START/KEY/END beats.",
    "Japanese dialogue timing, no subtitles, and no Chinese/Mandarin voice must survive generation.",
  ],
  required_next_gate: "prompt-against-frame QA plus 3-second motion probe before any approved_for_video promotion",
  reject_if: [
    "female Byleth becomes male or ambiguous",
    "characters become pasted plates or a flat lineup",
    "Ashe does not advance, raises the bow, or attacks",
    "Lonato attacks, becomes generic, or shows gore",
    "Chinese/Mandarin voice, subtitles, UI, borders, or readable text appear",
  ],
};
fs.writeFileSync(path.join(root, reviewJson), JSON.stringify(review, null, 2) + "\n");

const reviewMd = "# Shot022 Ashe Advance Integrated Re-Audit v2\n\n" +
  "Review date: 2026-08-22\n" +
  "Artifact: " + version + "\n" +
  "Status: monitor_required\n\n" +
  "## Why The Previous Set Was Rejected\n\n" +
  "The frozen Shot022 web candidate was a deterministic selected.png composite. Its character edges and lighting read as pasted plates over a battlefield, so it remained layout_reference rather than a usable cinematic frame set. The executable prompt also carried unrelated Rhea/Catherine locks and treated source/layout references as fallback generation inputs. The old set is retained as historical evidence and marked blocked_needs_revision.\n\n" +
  "## Current Frame Review\n\n" +
  "- START receives Shot021's muddy ridge and recognition geography. Female Byleth is a right-depth authority who gives one permission gesture; Ashe holds his bow low; Dimitri follows; Lonato stays in the fog lane.\n" +
  "- KEY is the deliberate advance: Ashe takes the road and begins the plea while the bow remains lowered. Lonato is readable but restrained, Dimitri does not block, and Byleth settles the gesture.\n" +
  "- END is a distinct three-quarter exchange before refusal: Ashe faces Lonato with an open plea hand, Lonato lowers the sword and opens one hand, Dimitri yields, and Byleth remains in depth.\n\n" +
  "## Gate Checks\n\n" +
  "- Canonical Ashe identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Canonical Lonato identity and older age: pass_in_still_frames_monitor_in_motion\n" +
  "- Canonical Dimitri identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Female Byleth identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Integrated live-action staging and shared ground contact: pass_in_still_frames\n" +
  "- Ashe advance / lowered bow / restrained plea: pass_in_still_frames_monitor_in_motion\n" +
  "- START/KEY/END distinct action states: pass\n" +
  "- Upload-only executable prompt: rewritten_upload_only\n" +
  "- Japanese dialogue only: pass\n" +
  "- No burned subtitles/UI: required_in_prompt_and_negative\n\n" +
  "## Remaining Risks And Required Next Gate\n\n" +
  "Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. Inspect female Byleth identity, Ashe's lowered bow and step, Dimitri's yielding position, Lonato's lowered weapon, shared mud contact, and the Japanese plea timing. Reject if the model creates a pasted plate, male/ambiguous Byleth, a generic attacking Lonato, a static lineup, gore, subtitles, Chinese/Mandarin voice, or UI.\n";
fs.writeFileSync(path.join(root, reviewMarkdown), reviewMd);

console.log(JSON.stringify({ shot: "Shot022", current: version, frames, reviewMarkdown, reviewJson }, null, 2));
