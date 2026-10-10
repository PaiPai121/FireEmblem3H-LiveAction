const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const slug = "critical_reaudit_regen_v2";
const version = "critical_reaudit_regen_v2_2026-08-22";
const frames = {
  start: "storyboards/Shot008/" + version + "/start_frame.png",
  key: "storyboards/Shot008/" + version + "/key_frame.png",
  end: "storyboards/Shot008/" + version + "/end_frame.png",
};
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-22");
const reviewMarkdown = "production_system/reviews/critical_reaudit_2026-08-22/shot008_critical_reaudit_regen_v2_2026-08-22_review.md";
const reviewJson = "production_system/reviews/critical_reaudit_2026-08-22/shot008_current_web_candidate_reaudit_2026-08-22.json";

function read(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(value, null, 2) + "\n");
}

function addUnique(items, value) {
  if (!items.includes(value)) items.push(value);
}

const frameSet = {
  version,
  frame_set_id: "Shot008_" + version,
  source: "built_in_imagegen_with_local_catherine_female_byleth_ashe_thunderbrand_and_adjacent_shot_references",
  frames,
  contact_sheet: "storyboards/Shot008/" + version + "/contact_sheet.jpg",
  status: "monitor_required",
  visual_audit_decision: "monitor_required",
  reference_assets: [
    "assets/characters/church_of_seiros/Catherine/academy/selected.png",
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/props/shared/hero_relics/thunderbrand_reference.png",
    "episodes/EP03/storyboards/Shot007/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
    "episodes/EP03/storyboards/Shot009/critical_reaudit_regen_v1_2026-08-15/start_frame.png",
  ],
  generation_mode: "imagegen_action_chain_with_thunderbrand_identity_and_adjacent_shot_match_action",
  review_markdown: reviewMarkdown,
  review_json: reviewJson,
  note: "The v2 keeps Catherine's left-arch entrance from Shot007, makes the sheathed Thunderbrand guard and purple crest stone readable during the walk, and stops on the gateward handoff for Shot009. It is monitor_required until prompt QA and a 3-second motion probe.",
};

const metadata = read("storyboards/Shot008/metadata.json");
metadata.status = "monitor_required";
metadata.planned_frames = frames;
metadata.current_display_frame_set = slug;
metadata.current_display_frame_status = "monitor_required_critical_reaudit_regen_v2_2026-08-22";
metadata.current_display_frame_source = "imagegen_from_local_catherine_female_byleth_ashe_thunderbrand_and_adjacent_shot_references_v2_2026-08-22";
metadata.current_display_frame_note = "2026-08-22 sequential continuity and weapon repair: Shot008 enters from Shot007's left arch, carries Catherine through the group with the sheathed Thunderbrand visible, and ends on the gateward handoff to Shot009.";
metadata.visual_audit_decision = "monitor_required";
metadata.visual_audit_finding = "The previous Shot008 chain had workable courtyard action but did not lock Catherine's unique weapon strongly enough. The v2 uses the local Thunderbrand reference and preserves the Shot007 entrance axis and Shot009 departure direction.";
metadata.required_revision = "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if Thunderbrand loses its jagged gold guard/purple crest, becomes a generic sword or glow, Catherine ages/drifts, or the adjacent eyelines reverse.";
metadata.video_prompt_qa_decision = "pending_review_against_" + version;
metadata.motion_probe_status = "pending_3s_probe_against_" + version;
metadata.displayed_frame_set = frameSet;
metadata.critical_reaudit_regen_v1 = {
  ...(metadata.critical_reaudit_regen_v1 || {}),
  status: "blocked_needs_revision",
  visual_audit_decision: "blocked_needs_revision",
  note: "Superseded by the 2026-08-22 v2 because the prior frame chain did not make Catherine's unique Thunderbrand sufficiently identifiable through the entrance/action handoff.",
};
metadata.critical_reaudit_regen_v2 = frameSet;
metadata.asset_references = metadata.asset_references || [];
addUnique(metadata.asset_references, "assets/props/shared/hero_relics/thunderbrand_reference.png");
metadata.adjacent_continuity_review_2026_08_22 = {
  previous_shot: "Shot007",
  previous_end_frame: "storyboards/Shot007/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
  previous_to_start_finding: "Catherine enters from the same left arch that Byleth and Ashe face at Shot007 END; the wet courtyard and blue-banner axis are preserved.",
  next_shot: "Shot009",
  next_start_frame: "storyboards/Shot009/critical_reaudit_regen_v1_2026-08-15/start_frame.png",
  end_to_next_finding: "Catherine stops ahead of the students and establishes the gateward direction; Shot009 can reverse the angle into the monastery departure.",
  thunderbrand_finding: "The sheathed weapon remains attached at Catherine's hip with a jagged gold guard and purple crest stone visible in the action chain.",
  decision: "monitor_required",
  reject_if: [
    "Catherine reverses the Shot007 entrance axis",
    "Thunderbrand becomes a generic sword or glowing advertisement",
  ],
};
write("storyboards/Shot008/metadata.json", metadata);

const queue = read("frame_generation_queue.json");
const queueShot = queue.shots.find((shot) => shot.id === "Shot008");
queueShot.status = "monitor_required";
queueShot.output_frames = frames;
queueShot.current_display_frame_set = slug;
queueShot.current_display_frame_status = "monitor_required_critical_reaudit_regen_v2_2026-08-22";
queueShot.current_display_frame_source = "imagegen_from_local_catherine_female_byleth_ashe_thunderbrand_and_adjacent_shot_references_v2_2026-08-22";
queueShot.visual_audit_decision = "monitor_required";
queueShot.visual_audit_finding = metadata.visual_audit_finding;
queueShot.required_revision = metadata.required_revision;
queueShot.video_prompt_qa_decision = "pending_review_against_" + version;
queueShot.motion_probe_status = "pending_3s_probe_against_" + version;
queueShot.displayed_frame_set = frameSet;
queueShot.critical_reaudit_regen_v2 = frameSet;
queueShot.previous_match_action_reference = "storyboards/Shot007/critical_reaudit_regen_v2_2026-08-21/end_frame.png";
queueShot.next_handoff_reference = "storyboards/Shot009/critical_reaudit_regen_v1_2026-08-15/start_frame.png";
queueShot.continuity_previous = "Shot007";
queueShot.continuity_next = "Shot009";
queueShot.model_notes = (queueShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v1"));
queueShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 sequential continuity and Thunderbrand repair: left-arch entrance, sheathed jagged gold/purple-crest relic, and gateward handoff. Keep monitor_required until a 3-second motion probe.");
queueShot.reject_if = queueShot.reject_if || [];
[
  "Shot008 START must enter from Shot007's left arch",
  "Thunderbrand must remain the attached jagged gold/purple-crest relic, not a generic sword or glow",
  "Shot008 END must establish the Shot009 gateward direction",
].forEach((value) => addUnique(queueShot.reject_if, value));
write("frame_generation_queue.json", queue);

const delivery = read("production_system/video_delivery_manifest.json");
const deliveryShot = delivery.shots.find((shot) => shot.id === "Shot008");
deliveryShot.status = "monitor_required";
deliveryShot.start_frame = frames.start;
deliveryShot.key_frame = frames.key;
deliveryShot.end_frame = frames.end;
deliveryShot.current_display_frame_set = slug;
deliveryShot.current_display_frame_status = "monitor_required_critical_reaudit_regen_v2_2026-08-22";
deliveryShot.current_display_frame_source = "imagegen_from_local_catherine_female_byleth_ashe_thunderbrand_and_adjacent_shot_references_v2_2026-08-22";
deliveryShot.visual_audit_decision = "monitor_required";
deliveryShot.visual_audit_finding = metadata.visual_audit_finding;
deliveryShot.required_revision = metadata.required_revision;
deliveryShot.video_prompt_qa_decision = "pending_review_against_" + version;
deliveryShot.motion_probe_status = "pending_3s_probe_against_" + version;
deliveryShot.critical_reaudit_regen_v2 = frameSet;
deliveryShot.previous_match_action_reference = "storyboards/Shot007/critical_reaudit_regen_v2_2026-08-21/end_frame.png";
deliveryShot.next_handoff_reference = "storyboards/Shot009/critical_reaudit_regen_v1_2026-08-15/start_frame.png";
deliveryShot.model_notes = (deliveryShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v1"));
deliveryShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 sequential continuity and Thunderbrand repair: left-arch entrance, sheathed jagged gold/purple-crest relic, and gateward handoff. Keep monitor_required until a 3-second motion probe.");
deliveryShot.reject_if = deliveryShot.reject_if || [];
[
  "Shot008 START must enter from Shot007's left arch",
  "Thunderbrand must remain the attached jagged gold/purple-crest relic, not a generic sword or glow",
  "Shot008 END must establish the Shot009 gateward direction",
].forEach((value) => addUnique(deliveryShot.reject_if, value));
write("production_system/video_delivery_manifest.json", delivery);

fs.mkdirSync(reviewDir, { recursive: true });
const review = {
  shot_id: "Shot008",
  review_date: "2026-08-22",
  review_type: "critical_reaudit_sequential_continuity_and_thunderbrand",
  previous_display_frame_set: "critical_reaudit_regen_v1",
  current_display_frame_set: version,
  status: "monitor_required",
  decision: "monitor_required",
  previous_shot: "Shot007",
  next_shot: "Shot009",
  reviewed_contact_sheet: "episodes/EP03/storyboards/Shot008/" + version + "/contact_sheet.jpg",
  frames: {
    start: "episodes/EP03/storyboards/Shot008/" + version + "/start_frame.png",
    key: "episodes/EP03/storyboards/Shot008/" + version + "/key_frame.png",
    end: "episodes/EP03/storyboards/Shot008/" + version + "/end_frame.png",
  },
  reference_assets: frameSet.reference_assets,
  passes: [
    "START enters from Shot007's left arch and preserves the wet courtyard axis.",
    "Catherine remains an adult Church knight with mature identity and white armor.",
    "KEY and END keep the unique Thunderbrand attached, with jagged gold guard and purple crest stone readable.",
    "Female Byleth remains visibly female in the reaction line.",
    "END establishes the gateward direction for Shot009.",
    "The Japanese line is specified with no subtitle/UI layer.",
  ],
  monitor_risks: [
    "Motion must preserve the Thunderbrand guard and purple crest without turning it into a glow effect.",
    "Catherine's mature identity and armor topology must hold through the walk.",
    "The Shot008-to-Shot009 reverse angle must preserve the group direction.",
  ],
  required_next_gate: "3-second motion probe before any approved_for_video promotion",
  reject_if: [
    "Catherine enters from the wrong side or resets to a lineup",
    "Thunderbrand becomes a generic sword, plain scabbard, floating prop, or glowing advertisement",
    "female Byleth becomes male or ambiguous",
    "the shot jumps to the road or battlefield",
    "Chinese/Mandarin voiceover or subtitles appear",
  ],
};
fs.writeFileSync(path.join(root, reviewJson), JSON.stringify(review, null, 2) + "\n");
console.log(JSON.stringify({shot: "Shot008", current: version, frames}, null, 2));
