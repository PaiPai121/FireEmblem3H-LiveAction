const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const slug = "critical_reaudit_regen_v2";
const version = "critical_reaudit_regen_v2_2026-08-22";
const frames = {
  start: "storyboards/Shot026/" + version + "/start_frame.png",
  key: "storyboards/Shot026/" + version + "/key_frame.png",
  end: "storyboards/Shot026/" + version + "/end_frame.png",
};
const contactSheet = "storyboards/Shot026/" + version + "/contact_sheet.jpg";
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-22");
const reviewMarkdown = "production_system/reviews/critical_reaudit_2026-08-22/shot026_ashe_nonlethal_draw_integrated_reaudit_v2_2026-08-22_review.md";
const reviewJson = "production_system/reviews/critical_reaudit_2026-08-22/shot026_current_web_candidate_nonlethal_draw_reaudit_v2_2026-08-22.json";

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

const finding = "2026-08-22 sequential re-audit: the frozen Shot026 root frames were deterministic selected.png composites. Ashe and Lonato floated over a background, the three states did not establish a draw, and the prompt did not lock the non-lethal arrow geometry. v2 is regenerated from Shot025 v2 END with canonical local Ashe/Lonato identity and location references. START lifts the low bow, KEY holds a full draw toward a distinct muddy impact patch below Lonato's knees, and END holds before release for Shot027.";
const requiredRevision = "Keep monitor_required. Run prompt-against-frame QA, strict Shot025→026 and 026→027 continuity QA, and a 3-second motion probe; reject if the arrow line touches Lonato's body, Ashe releases early, Lonato attacks, the frames read as pasted plates, identity/age drifts, or Chinese/Mandarin/subtitles/UI/borders appear.";
const source = "imagegen_integrated_live_action_with_local_identity_and_shot025_continuity_v2_2026-08-22";
const characters = ["Ashe", "Lonato"];
const presenceConstraint = "Exactly two named readable performers: academy-era Ashe and older white-haired armored Lonato. The Blue Lions formation is offscreen/context only. No Byleth, Dimitri, Dedue, Catherine, Rhea, Felix, Mercedes, Ingrid, Annette, Sylvain, or other named character enters.";
const frameSet = {
  version,
  frame_set_id: "Shot026_" + version,
  source,
  frames,
  contact_sheet: contactSheet,
  status: "monitor_required",
  visual_audit_decision: "monitor_required",
  reference_assets: [
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "storyboards/Shot025/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
  ],
  generation_mode: "imagegen_integrated_live_action_with_local_identity_and_adjacent_shot_refs",
  review_markdown: reviewMarkdown,
  review_json: reviewJson,
  note: "v2 replaces the pasted two-person composite. It contains a shared wet battlefield and a strict non-lethal arrow chain: low bow lift, full draw at empty mud, and held full draw before release. Keep monitor_required until motion probe.",
};

const metadata = read("storyboards/Shot026/metadata.json");
metadata.status = "monitor_required";
metadata.characters = characters;
metadata.asset_references = frameSet.reference_assets.slice(0, 3);
metadata.planned_frames = frames;
metadata.current_display_frame_set = slug;
metadata.current_display_frame_status = "monitor_required_" + version;
metadata.current_display_frame_source = source;
metadata.current_display_frame_note = "v2 replaces the pasted root composite: Ashe lifts from low bow to a full non-lethal draw aimed at a clear muddy patch before Lonato, then holds before release.";
metadata.visual_audit_decision = "monitor_required";
metadata.visual_audit_finding = finding;
metadata.required_revision = requiredRevision;
metadata.video_prompt_qa_decision = "pending_review_against_" + version;
metadata.motion_probe_status = "pending_3s_probe_against_" + version;
metadata.character_presence_constraint = presenceConstraint;
metadata.audio_anchor = "Ashe, in Japanese: ごめんなさい。";
metadata.displayed_frame_set = frameSet;
for (const key of [
  "local_asset_final_candidate_v1",
  "local_selected_png_composited_previs_v2",
  "local_selected_png_composited_previs_v3",
]) {
  blockSet(metadata, key, "Superseded on 2026-08-22: this historical candidate is a deterministic pasted composite and did not prove non-lethal arrow geometry. Retain for audit history only.");
}
metadata.critical_reaudit_regen_v2 = frameSet;
metadata.adjacent_continuity_review_2026_08_22 = {
  previous_shot: "Shot025",
  previous_end_frame: "storyboards/Shot025/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
  previous_to_start_finding: "Shot026 v2 START receives Shot025 v2's open road-edge sightline and moral pressure. Ashe is now the readable foreground decision-maker; the formation recedes and Lonato remains ahead with a clear mud patch between them.",
  next_shot: "Shot027",
  next_start_frame: "storyboards/Shot027/start_frame.png",
  end_to_next_finding: "Shot026 v2 END holds Ashe at full draw with the arrow nocked and aimed at empty mud below Lonato's knees. Shot027 may receive the release/impact, but no arrow flight or impact is present in this shot.",
  decision: "monitor_required",
  reject_if: [
    "the arrow line intersects Lonato's body or shield",
    "Ashe releases before Shot027",
    "the muddy impact patch disappears",
    "Lonato attacks or the non-lethal moral beat becomes execution",
  ],
};
write("storyboards/Shot026/metadata.json", metadata);

const queue = read("frame_generation_queue.json");
const queueShot = queue.shots.find((shot) => shot.id === "Shot026");
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
  blockSet(queueShot, key, "Superseded on 2026-08-22 because the candidate was a pasted two-person composite and did not prove the non-lethal arrow line. Retain as historical evidence only.");
}
queueShot.critical_reaudit_regen_v2 = frameSet;
queueShot.previous_match_action_reference = "storyboards/Shot025/critical_reaudit_regen_v2_2026-08-22/end_frame.png";
queueShot.next_handoff_reference = "storyboards/Shot027/start_frame.png";
queueShot.continuity_previous = "Shot025";
queueShot.continuity_next = "Shot027";
queueShot.model_notes = (queueShot.model_notes || []).filter((note) => !note.includes("Current displayed start/key/end") && !note.includes("Current displayed frames"));
queueShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 integrated Shot026 repair: Ashe lifts from low bow, reaches a non-lethal full draw at empty mud before Lonato, and holds before release. Keep monitor_required until prompt-against-frame QA and a 3-second motion probe.");
queueShot.reject_if = queueShot.reject_if || [];
[
  "The arrow line must remain below Lonato's knees and at least 1.5 meters before him",
  "Ashe must not release before Shot027",
  "Lonato must remain older, white-haired, restrained, and non-attacking",
  "The two performers must share mud, fog, perspective, and contact shadows",
].forEach((value) => addUnique(queueShot.reject_if, value));
write("frame_generation_queue.json", queue);

const delivery = read("production_system/video_delivery_manifest.json");
const deliveryShot = delivery.shots.find((shot) => shot.id === "Shot026");
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
  blockSet(deliveryShot, key, "Superseded on 2026-08-22 because the candidate was a pasted two-person composite and did not prove non-lethal arrow geometry. Retain as historical evidence only.");
}
deliveryShot.critical_reaudit_regen_v2 = frameSet;
deliveryShot.previous_match_action_reference = "storyboards/Shot025/critical_reaudit_regen_v2_2026-08-22/end_frame.png";
deliveryShot.next_handoff_reference = "storyboards/Shot027/start_frame.png";
deliveryShot.model_notes = (deliveryShot.model_notes || []).filter((note) => !note.includes("Current displayed start/key/end") && !note.includes("Current displayed frames"));
deliveryShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 integrated Shot026 repair: the arrow is held below Lonato's knees and aimed at empty mud; no release or impact occurs before Shot027. Keep monitor_required until a 3-second motion probe.");
deliveryShot.reject_if = deliveryShot.reject_if || [];
[
  "No pasted character plates, transparent halos, flat lineup, or missing shared ground contact",
  "Arrow line must never target Lonato's body, shield, horse, or head",
  "No release, impact, wound, or kill before Shot027",
  "Ashe and Lonato identities/ages must hold through motion",
].forEach((value) => addUnique(deliveryShot.reject_if, value));
write("production_system/video_delivery_manifest.json", delivery);

const continuity = read("production_system/continuity_manifest.json");
const pair2526 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot025-Shot026");
if (pair2526) {
  pair2526.decision = "monitor_required";
  pair2526.notes = "2026-08-22 Shot026 v2 adjacency audit: Shot025 v2 END leaves a clear road-edge sightline after the two-wing split. Shot026 v2 START receives it with Ashe low bow and Lonato ahead; the formation recedes without changing the muddy impact geography. Keep monitor_required until motion probe.";
}
const pair2627 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot026-Shot027");
if (pair2627) {
  pair2627.decision = "monitor_required";
  pair2627.notes = "2026-08-22 Shot026 v2→Shot027 handoff audit: END holds Ashe at full draw with the nocked arrow aimed at empty mud below Lonato's knees. Shot027 must receive the release/impact only after the cut; no flight or impact is present in Shot026. Strict motion continuity remains monitor-only.";
}
write("production_system/continuity_manifest.json", continuity);

fs.mkdirSync(reviewDir, { recursive: true });
const review = {
  shot_id: "Shot026",
  review_date: "2026-08-22",
  review_type: "ashe_nonlethal_draw_integrated_sequential_reaudit",
  previous_display_frame_set: "local_asset_final_candidate_v1_2026-08-02",
  current_display_frame_set: version,
  status: "monitor_required",
  decision: "monitor_required",
  previous_shot: "Shot025",
  next_shot: "Shot027",
  reviewed_contact_sheet: "episodes/EP03/" + contactSheet,
  frames: {
    start: "episodes/EP03/" + frames.start,
    key: "episodes/EP03/" + frames.key,
    end: "episodes/EP03/" + frames.end,
  },
  reference_assets: frameSet.reference_assets,
  prior_rejection: [
    "The frozen root frames were deterministic selected.png composites with Ashe and Lonato floating over the ridge and no shared cinematic ground contact.",
    "The old frame spec remained frames_pending and the prompt allowed source/layout fallback.",
    "The old candidate did not prove a non-lethal arrow line or a distinct pre-draw/full-draw/hold progression.",
  ],
  passes: [
    "START receives Shot025's open sightline with Ashe low bow and Lonato ahead on the same wet road.",
    "Only canonical academy Ashe and older white-haired armored Lonato are readable.",
    "KEY makes full draw and the empty muddy impact patch explicit; the arrow line is below Lonato's knees and separated from his body.",
    "END holds the same non-lethal full draw with no release, impact, wound, or kill before Shot027.",
    "Both performers share scale, mud contact, fog, banner perspective, and lighting; no pasted plates are used.",
    "START, KEY, and END are distinct action states: low bow lift, full draw at empty mud, held full draw before release.",
    "The executable prompt is upload-only and Japanese dialogue only.",
  ],
  monitor_risks: [
    "Motion may drift the arrow upward into Lonato's torso; inspect the line and impact patch frame by frame.",
    "The model may release or create an arrow impact before Shot027; reject any premature escalation.",
    "Ashe's academy age/face and Lonato's older white-haired identity must hold through the close-to-medium move.",
    "Japanese apology timing, no subtitles, and no Chinese/Mandarin voice must survive generation.",
  ],
  required_next_gate: "prompt-against-frame QA plus 3-second motion probe before any approved_for_video promotion",
  reject_if: [
    "arrow line intersects Lonato's body, shield, horse, or head",
    "Ashe releases, hits, wounds, or kills Lonato before Shot027",
    "Lonato attacks or becomes a generic raider",
    "characters become pasted plates or a flat lineup",
    "Chinese/Mandarin voice, subtitles, UI, borders, or readable text appear",
  ],
};
fs.writeFileSync(path.join(root, reviewJson), JSON.stringify(review, null, 2) + "\n");

const reviewMd = "# Shot026 Ashe Non-Lethal Draw Integrated Re-Audit v2\n\n" +
  "Review date: 2026-08-22\n" +
  "Artifact: " + version + "\n" +
  "Status: monitor_required\n\n" +
  "## Why The Previous Set Was Rejected\n\n" +
  "The frozen root frames were deterministic selected.png composites: Ashe and Lonato floated over a ridge with no shared ground contact, and the triptych did not prove the non-lethal draw. The old spec was still frames_pending and the prompt allowed source/layout fallback. The old set is retained as history and marked blocked_needs_revision.\n\n" +
  "## Current Frame Review\n\n" +
  "- START receives Shot025's open sightline. Ashe lifts from a low bow while Lonato stands ahead with shield and sword low; the muddy impact patch is open between them.\n" +
  "- KEY is full draw: Ashe's eyes are wet but controlled, and the arrow is angled down at an empty patch below Lonato's knees, never at his body.\n" +
  "- END holds the same non-lethal full draw before release, giving Shot027 the responsibility for the arrow flight and ground impact.\n\n" +
  "## Gate Checks\n\n" +
  "- Academy Ashe identity and age: pass_in_still_frames_monitor_in_motion\n" +
  "- Older white-haired Lonato identity and restraint: pass_in_still_frames_monitor_in_motion\n" +
  "- Shared live-action ground contact: pass_in_still_frames\n" +
  "- Arrow aimed at empty mud below Lonato's knees: pass_in_still_frames_monitor_in_motion\n" +
  "- No release/impact before Shot027: pass_in_still_frames_monitor_in_motion\n" +
  "- Shot025→026 and 026→027 continuity: pass_in_still_frames_monitor_in_motion\n" +
  "- START/KEY/END distinct action states: pass\n" +
  "- Upload-only executable prompt: rewritten_upload_only\n" +
  "- Japanese dialogue only: pass\n" +
  "- No burned subtitles/UI: required_in_prompt_and_negative\n\n" +
  "## Remaining Risks And Required Next Gate\n\n" +
  "Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. Inspect arrow elevation frame by frame, the mud impact patch, Ashe's face/age, Lonato's restraint, and the Japanese apology timing. Reject if the arrow targets a body, releases early, the image becomes a pasted collage, or subtitles, Chinese/Mandarin voice, UI, or gore appear.\n";
fs.writeFileSync(path.join(root, reviewMarkdown), reviewMd);

console.log(JSON.stringify({ shot: "Shot026", current: version, frames, reviewMarkdown, reviewJson }, null, 2));
