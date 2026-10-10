const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const slug = "critical_reaudit_regen_v2";
const version = "critical_reaudit_regen_v2_2026-08-22";
const frames = {
  start: "storyboards/Shot016/" + version + "/start_frame.png",
  key: "storyboards/Shot016/" + version + "/key_frame.png",
  end: "storyboards/Shot016/" + version + "/end_frame.png",
};
const contactSheet = "storyboards/Shot016/" + version + "/contact_sheet.jpg";
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-22");
const reviewMarkdown = "production_system/reviews/critical_reaudit_2026-08-22/shot016_dedue_braid_continuity_reaudit_v2_2026-08-22_review.md";
const reviewJson = "production_system/reviews/critical_reaudit_2026-08-22/shot016_current_web_candidate_reaudit_2026-08-22.json";

function read(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}
function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(value, null, 2) + "\n");
}
function addUnique(items, value) {
  if (!items.includes(value)) items.push(value);
}

const finding = "2026-08-22 sequential re-audit: the frozen Shot016 v1 frames did not make Dedue's newly corrected nape braid readable, and the action chain still read too much like a generic line hold. v2 uses the canonical braid-repaired Dedue asset with local female Byleth and Dimitri references. START establishes the handoff from Shot015, KEY makes Dimitri's over-pursuit meet Byleth's raised stop hand, and END lowers the spear into a clean Shot017 eyeline handoff. All three performers are integrated into the same wet battlefield rather than pasted portrait plates.";
const requiredRevision = "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if Byleth becomes male or war-phase, Dedue's braid disappears or detaches, Dimitri strikes a visible person, the spear geometry mutates, the trio becomes a posed lineup, or Chinese/Mandarin/subtitles/UI/borders appear.";
const source = "imagegen_sequential_action_chain_with_female_byleth_dimitri_and_braid_repaired_dedue_local_assets_v2_2026-08-22";

const frameSet = {
  version,
  frame_set_id: "Shot016_" + version,
  source,
  frames,
  contact_sheet: contactSheet,
  status: "monitor_required",
  visual_audit_decision: "monitor_required",
  reference_assets: [
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/characters/blue_lions/Dedue/academy/selected.png",
    "assets/characters/blue_lions/Dedue/academy/braid_repair_review_2026-08-22.md",
    "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    "storyboards/Shot015/critical_reaudit_regen_v3_2026-08-22/end_frame.png",
    "storyboards/Shot017/critical_reaudit_regen_v1_2026-08-20/start_frame.png",
    "source_refs/Shot016_source.png",
  ],
  generation_mode: "imagegen_sequential_integrated_live_action_with_local_identity_and_adjacent_shot_refs",
  review_markdown: reviewMarkdown,
  review_json: reviewJson,
  note: "v2 replaces the frozen v1 display set because the new canonical Dedue asset adds a readable short nape braid and the new START/KEY/END chain makes the Dimitri-Byleth-Dedue action physically distinct. Shot017 remains frozen; only its handoff reference is updated.",
};

const characters = ["Dimitri", "Byleth", "Dedue"];
const presenceConstraint = "Only Dimitri, female Byleth, and Dedue are readable in Shot016. Byleth is female-only and Dedue must retain one short white/silver braid physically attached at the nape. Ashe, Felix, Catherine, Lonato, Rhea, Seiros soldiers, and other named characters do not enter this shot.";

const metadata = read("storyboards/Shot016/metadata.json");
metadata.status = "monitor_required";
metadata.characters = characters;
metadata.asset_references = [
  "assets/characters/blue_lions/Dimitri/academy/selected.png",
  "assets/characters/protagonist/BylethFemale/professor/selected.png",
  "assets/characters/blue_lions/Dedue/academy/selected.png",
  "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
];
metadata.planned_frames = frames;
metadata.current_display_frame_set = slug;
metadata.current_display_frame_status = "monitor_required_" + version;
metadata.current_display_frame_source = source;
metadata.current_display_frame_note = "v2 uses the canonical braid-repaired Dedue asset and female Byleth throughout. START hands off from Shot015, KEY contains the over-pursuit/stop gesture, and END lowers Dimitri's spear into Shot017 without introducing Ashe early.";
metadata.visual_audit_decision = "monitor_required";
metadata.visual_audit_finding = finding;
metadata.required_revision = requiredRevision;
metadata.video_prompt_qa_decision = "pending_review_against_" + version;
metadata.motion_probe_status = "pending_3s_probe_against_" + version;
metadata.character_presence_constraint = presenceConstraint;
metadata.displayed_frame_set = frameSet;
metadata.canonical_byleth_asset = "assets/characters/protagonist/BylethFemale/professor/selected.png";
metadata.byleth_gender_consistency_lock = "female_byleth_only_2026-08-14";
if (metadata.critical_reaudit_regen_v1) {
  metadata.critical_reaudit_regen_v1.status = "blocked_needs_revision";
  metadata.critical_reaudit_regen_v1.visual_audit_decision = "blocked_needs_revision";
  metadata.critical_reaudit_regen_v1.note = "Superseded on 2026-08-22: Dedue's updated canonical braid was not visible in the v1 frame chain, so v1 is retained as historical evidence only.";
}
metadata.critical_reaudit_regen_v2 = frameSet;
metadata.adjacent_continuity_review_2026_08_22 = {
  previous_shot: "Shot015",
  previous_end_frame: "storyboards/Shot015/critical_reaudit_regen_v3_2026-08-22/end_frame.png",
  previous_to_start_finding: "Shot016 START inherits Shot015's rightward pressure lane, gray fog, wet mud, and blue-banner battlefield while introducing the Blue Lions counterline in a new reverse angle. No rebel soldier is copied into the foreground action.",
  next_shot: "Shot017",
  next_start_frame: "storyboards/Shot017/critical_reaudit_regen_v1_2026-08-20/start_frame.png",
  end_to_next_finding: "Shot016 END lowers Dimitri's spear, settles female Byleth's command, keeps Dedue's braid visible, and leaves the trio's eyelines and muddy lane available for the frozen Ashe recognition insert in Shot017.",
  decision: "monitor_required",
  reject_if: [
    "Shot016 START breaks the rightward handoff or changes the battlefield weather and wardrobe",
    "Byleth becomes male, ambiguous, older, or war-phase",
    "Dedue's short nape braid disappears, detaches, or becomes a costume rope",
    "Shot016 END introduces Ashe before the Shot017 cut or closes the eyeline lane",
  ],
};
write("storyboards/Shot016/metadata.json", metadata);

const queue = read("frame_generation_queue.json");
const queueShot = queue.shots.find((shot) => shot.id === "Shot016");
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
  queueShot.critical_reaudit_regen_v1.note = "Superseded on 2026-08-22 because the frozen v1 frames did not make the canonical Dedue braid readable.";
}
queueShot.critical_reaudit_regen_v2 = frameSet;
queueShot.previous_match_action_reference = "storyboards/Shot015/critical_reaudit_regen_v3_2026-08-22/end_frame.png";
queueShot.next_handoff_reference = "storyboards/Shot017/critical_reaudit_regen_v1_2026-08-20/start_frame.png";
queueShot.continuity_previous = "Shot015";
queueShot.continuity_next = "Shot017";
queueShot.model_notes = (queueShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v1"));
queueShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 sequential action repair: braid-visible Dedue, female Byleth-only identity, Dimitri over-pursuit, raised stop hand, lowered spear, and Shot017 eyeline handoff. Keep monitor_required until prompt-against-frame QA and a 3-second motion probe.");
queueShot.reject_if = queueShot.reject_if || [];
[
  "Dedue must retain one short white/silver braid visibly attached at the nape in the three-frame chain",
  "Byleth must remain female-only and the black high-collar professor outfit must remain covered",
  "KEY must show Dimitri's over-pursuit meeting Byleth's raised stop hand without a visible hit",
  "END must lower the spear and hand off through eyeline to frozen Shot017 without Ashe entering early",
].forEach((value) => addUnique(queueShot.reject_if, value));
write("frame_generation_queue.json", queue);

const delivery = read("production_system/video_delivery_manifest.json");
const deliveryShot = delivery.shots.find((shot) => shot.id === "Shot016");
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
if (deliveryShot.critical_reaudit_regen_v1) {
  deliveryShot.critical_reaudit_regen_v1.status = "blocked_needs_revision";
  deliveryShot.critical_reaudit_regen_v1.visual_audit_decision = "blocked_needs_revision";
  deliveryShot.critical_reaudit_regen_v1.note = "Superseded on 2026-08-22 because the frozen v1 frames did not make the canonical Dedue braid readable.";
}
deliveryShot.critical_reaudit_regen_v2 = frameSet;
deliveryShot.previous_match_action_reference = "storyboards/Shot015/critical_reaudit_regen_v3_2026-08-22/end_frame.png";
deliveryShot.next_handoff_reference = "storyboards/Shot017/critical_reaudit_regen_v1_2026-08-20/start_frame.png";
deliveryShot.model_notes = (deliveryShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v1"));
deliveryShot.model_notes.push("Current displayed frames are the 2026-08-22 v2 sequential action repair: the braid-repaired Dedue remains readable while Dimitri's thrust, Byleth's stop, and the lowered-spear handoff remain distinct. Keep monitor_required until a 3-second motion probe.");
deliveryShot.reject_if = deliveryShot.reject_if || [];
[
  "Dedue must retain one short white/silver braid visibly attached at the nape in motion",
  "Byleth must remain female-only across the uploaded frame chain and generated clip",
  "Dimitri must stop after the single non-graphic push and Byleth command",
  "Shot016 END must not introduce Ashe before Shot017",
].forEach((value) => addUnique(deliveryShot.reject_if, value));
write("production_system/video_delivery_manifest.json", delivery);

const continuity = read("production_system/continuity_manifest.json");
const pair1516 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot015-Shot016");
if (pair1516) {
  pair1516.decision = "monitor_required";
  pair1516.notes = "2026-08-22 Shot016 v2 adjacency audit: Shot015 v3 END leaves a rightward pressure lane. Shot016 v2 START receives it with Dimitri's spear in the foreground, female Byleth in the lane, and braid-visible Dedue behind-left. The reverse angle preserves fog, mud, blue banners, and academy wardrobe without copying a rebel soldier into the Blue Lions action. Keep monitor_required until motion probe.";
}
const pair1617 = continuity.pairs.find((pair) => pair.id === "EP03-continuity-Shot016-Shot017");
if (pair1617) {
  pair1617.decision = "monitor_required";
  pair1617.notes = "2026-08-22 Shot016 v2 adjacency audit: START establishes Dimitri, female Byleth, and braid-visible Dedue; KEY makes the over-pursuit meet Byleth's raised stop hand; END lowers the spear and sends the trio's eyeline toward the frozen Shot017 Ashe recognition insert. Shot017 remains unchanged. Keep monitor_required until motion probe.";
}
write("production_system/continuity_manifest.json", continuity);

fs.mkdirSync(reviewDir, { recursive: true });
const review = {
  shot_id: "Shot016",
  review_date: "2026-08-22",
  review_type: "dedue_braid_asset_repair_sequential_continuity_and_prompt_reaudit",
  previous_display_frame_set: "critical_reaudit_regen_v1_2026-08-15",
  current_display_frame_set: version,
  status: "monitor_required",
  decision: "monitor_required",
  previous_shot: "Shot015",
  next_shot: "Shot017",
  reviewed_contact_sheet: "episodes/EP03/" + contactSheet,
  frames: {
    start: "episodes/EP03/" + frames.start,
    key: "episodes/EP03/" + frames.key,
    end: "episodes/EP03/" + frames.end,
  },
  reference_assets: frameSet.reference_assets,
  canonical_asset_repair: {
    asset: "assets/characters/blue_lions/Dedue/academy/selected.png",
    repair_review: "assets/characters/blue_lions/Dedue/academy/braid_repair_review_2026-08-22.md",
    result: "The selected academy asset now has a compact white/silver braid attached at the nape. v2 frames deliberately keep Dedue in three-quarter positions so the braid is visible without turning it into a long ponytail or garment cord.",
  },
  prior_v1_rejection: [
    "The frozen v1 frame chain showed Dedue without the newly required braid, so the updated character asset was not represented in the web candidate.",
    "The old prompt retained unrelated template continuity locks and did not give the current three-frame action chain a clean upload-only contract.",
  ],
  passes: [
    "START receives the rightward pressure lane from Shot015 v3 and keeps all three performers grounded in one muddy battlefield.",
    "Female Byleth is the only Byleth identity and remains visibly female in all three stills.",
    "Dedue's short nape braid is readable and physically attached in START, KEY, and END.",
    "KEY clearly shows Dimitri's over-pursuit meeting Byleth's raised stop hand; no visible hit or gore occurs.",
    "END lowers the spear and settles the command beat instead of creating a victory pose.",
    "The frames are integrated live-action candidates with shared scale, contact shadows, fog, and wet-ground interaction.",
    "START, KEY, and END are distinct action states rather than lighting or crop variants.",
    "Shot017 remains frozen and receives only the final eyeline/action handoff.",
    "The executable video prompt is rewritten upload-only and requires Japanese dialogue only.",
  ],
  monitor_risks: [
    "A motion model may erase or lengthen Dedue's braid during turns; inspect the nape in the 3-second probe.",
    "Byleth's gender and covered high-collar outfit must remain stable during the stop gesture.",
    "The spear must stay a held directional prop and must not strike a visible person.",
    "Dimitri's obedience and the final eyeline must survive motion without becoming a static group pose.",
    "Japanese dialogue timing, no subtitles, and no Chinese/Mandarin voice must survive generation.",
  ],
  required_next_gate: "prompt-against-frame QA plus 3-second motion probe before any approved_for_video promotion",
  reject_if: [
    "Dedue braid disappears, detaches, becomes a ponytail, or becomes a costume rope",
    "Byleth becomes male, ambiguous, adult, war-phase, or sexualized",
    "Dimitri strikes, wounds, or continues attacking after the command",
    "the trio becomes a flat lineup or pasted portrait collage",
    "Ashe enters Shot016 before the Shot017 cut",
    "Chinese/Mandarin voiceover, subtitles, UI, borders, magic, or gore appear",
  ],
};
fs.writeFileSync(path.join(root, reviewJson), JSON.stringify(review, null, 2) + "\n");

const reviewMd = "# Shot016 Dedue Braid And Continuity Re-Audit v2\n\n" +
  "Review date: 2026-08-22\n" +
  "Artifact: " + version + "\n" +
  "Status: monitor_required\n\n" +
  "## Why v1 Was Rejected\n\n" +
  "The frozen v1 frames were made before the academy Dedue selected asset was repaired. The updated asset now has a compact braid at the nape, but v1 still showed the old close-cropped silhouette, so the web candidate did not prove the character correction. The old prompt also carried unrelated template locks and did not describe a clean three-state action chain. v1 is retained as historical evidence and marked blocked_needs_revision.\n\n" +
  "## Current Frame Review\n\n" +
  "- START receives the rightward pressure from Shot015 v3 and establishes Dimitri, female Byleth, and Dedue in one wet battlefield. Dedue's short braid is visible behind the nape.\n" +
  "- KEY makes the actual dramatic beat visible: Dimitri over-pursues after one non-graphic spear push, Byleth raises a practical stop hand, and Dedue closes the flank.\n" +
  "- END lowers the spear, lets Dimitri turn toward Byleth in obedience, keeps Dedue's braid readable, and sends the eyeline into the frozen Shot017 Ashe insert.\n\n" +
  "## Gate Checks\n\n" +
  "- Canonical female Byleth identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Canonical braid-repaired Dedue identity: pass_in_still_frames_monitor_in_motion\n" +
  "- Integrated live-action staging: pass_in_still_frames\n" +
  "- START/KEY/END distinct action states: pass\n" +
  "- Shot015 pressure-lane continuity: pass_in_still_frames_monitor_in_motion\n" +
  "- Shot017 eyeline/action handoff: pass_in_still_frames_monitor_in_motion\n" +
  "- Upload-only executable prompt: rewritten_upload_only\n" +
  "- Japanese dialogue only: pass\n" +
  "- No burned subtitles/UI: required_in_prompt_and_negative\n\n" +
  "## Remaining Risks And Required Next Gate\n\n" +
  "Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. Inspect Dedue's nape during the turn, Byleth's identity during the raised-hand gesture, spear geometry, Dimitri's stop timing, and the final eyeline. Reject if the braid disappears, Byleth changes gender or age, the spear strikes, the trio becomes a static lineup, Ashe enters early, or gore, magic, subtitles, Chinese/Mandarin voice, UI, or borders appear.\n";
fs.writeFileSync(path.join(root, reviewMarkdown), reviewMd);

console.log(JSON.stringify({ shot: "Shot016", current: version, frames, reviewMarkdown, reviewJson }, null, 2));
