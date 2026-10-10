const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const version = "critical_reaudit_regen_v2_2026-08-21";
const frames = {
  start: `storyboards/Shot007/${version}/start_frame.png`,
  key: `storyboards/Shot007/${version}/key_frame.png`,
  end: `storyboards/Shot007/${version}/end_frame.png`,
};
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-21");
const reviewMarkdown = "production_system/reviews/critical_reaudit_2026-08-21/shot007_critical_reaudit_regen_v2_2026-08-21_review.md";
const reviewJson = "production_system/reviews/critical_reaudit_2026-08-21/shot007_current_web_candidate_reaudit_2026-08-21.json";

function read(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), `${JSON.stringify(value, null, 2)}\n`);
}

function addUnique(items, value) {
  if (!items.includes(value)) items.push(value);
}

const frameSet = {
  version,
  frame_set_id: `Shot007_${version}`,
  source: "built_in_imagegen_with_local_selected_identity_and_adjacent_shot_references",
  frames,
  contact_sheet: `storyboards/Shot007/${version}/contact_sheet.jpg`,
  status: "monitor_required",
  visual_audit_decision: "monitor_required",
  reference_assets: [
    "assets/characters/protagonist/BylethFemale/professor/selected.png",
    "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "assets/characters/blue_lions/Dedue/academy/selected.png",
    "assets/characters/blue_lions/Felix/academy/selected.png",
    "assets/characters/blue_lions/Ashe/academy/selected.png",
    "assets/characters/blue_lions/Ingrid/academy/selected.png",
    "assets/props/EP02/training_weapons/training_weapons_reference.png",
    "assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png",
    "episodes/EP03/storyboards/Shot006/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
    "episodes/EP03/storyboards/Shot008/critical_reaudit_regen_v1_2026-08-15/start_frame.png",
  ],
  generation_mode: "imagegen_action_chain_from_local_selected_assets_with_shot006_match_action_and_shot008_handoff",
  review_markdown: reviewMarkdown,
  review_json: reviewJson,
  note: "The v2 repair keeps Shot006's classroom door visible at START, uses active lantern/strap/short-sword handoffs at KEY, and lands on the shared leftward eyeline for Shot008 Catherine entrance at END. It is monitor_required until prompt QA and a 3-second motion probe.",
};

const metadata = read("storyboards/Shot007/metadata.json");
metadata.status = "monitor_required";
metadata.planned_frames = frames;
metadata.current_display_frame_set = version;
metadata.current_display_frame_status = "monitor_required_critical_reaudit_regen_v2_2026-08-21";
metadata.current_display_frame_source = "imagegen_from_local_selected_assets_with_adjacent_shot_match_action_v2_2026-08-21";
metadata.current_display_frame_note = "2026-08-21 sequential continuity repair: Shot007 now begins at the Shot006 classroom doorway, carries through physical gear handoffs, and ends on the Shot008 Catherine-entry eyeline.";
metadata.visual_audit_decision = "monitor_required";
metadata.visual_audit_finding = "The previous Shot007 candidate jumped from Shot006's doorway exit to a pre-formed courtyard lineup and then from a static insert to a departure wide. The v2 preserves the door at START, gives KEY a real handoff chain, and gives END a motivated turn toward the next entrance.";
metadata.required_revision = "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if the doorway handoff, lantern/strap/sword contacts, female Byleth identity, academy age, or Shot008 eyeline drifts.";
metadata.video_prompt_qa_decision = `pending_review_against_${version}`;
metadata.motion_probe_status = `pending_3s_probe_against_${version}`;
metadata.displayed_frame_set = frameSet;
metadata.critical_reaudit_regen_v1 = {
  ...(metadata.critical_reaudit_regen_v1 || {}),
  status: "blocked_needs_revision",
  visual_audit_decision: "blocked_needs_revision",
  note: "Superseded by the 2026-08-21 v2 sequential continuity repair because v1 still cut from the classroom exit to a pre-formed lineup and did not provide a motivated handoff into Shot008.",
};
metadata.critical_reaudit_regen_v2 = frameSet;
metadata.adjacent_continuity_review_2026_08_21 = {
  previous_shot: "Shot006",
  previous_end_frame: "storyboards/Shot006/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
  previous_to_start_finding: "Doorway remains visible; Ashe and Dimitri continue out while female Byleth follows toward the prep table.",
  next_shot: "Shot008",
  next_start_frame: "storyboards/Shot008/critical_reaudit_regen_v1_2026-08-15/start_frame.png",
  end_to_next_finding: "Female Byleth and Ashe turn toward the open arch at screen-left in the same wet courtyard, leaving the incoming Catherine side open.",
  decision: "monitor_required",
  reject_if: [
    "Shot007 START resets to a six-person lineup",
    "Shot007 END loses the shared leftward eyeline or reveals Catherine early",
  ],
};
write("storyboards/Shot007/metadata.json", metadata);

const queue = read("frame_generation_queue.json");
const queueShot = queue.shots.find((shot) => shot.id === "Shot007");
queueShot.status = "monitor_required";
queueShot.output_frames = frames;
queueShot.current_display_frame_set = version;
queueShot.current_display_frame_status = "monitor_required_critical_reaudit_regen_v2_2026-08-21";
queueShot.current_display_frame_source = "imagegen_from_local_selected_assets_with_adjacent_shot_match_action_v2_2026-08-21";
queueShot.visual_audit_decision = "monitor_required";
queueShot.visual_audit_finding = metadata.visual_audit_finding;
queueShot.required_revision = metadata.required_revision;
queueShot.video_prompt_qa_decision = `pending_review_against_${version}`;
queueShot.motion_probe_status = `pending_3s_probe_against_${version}`;
queueShot.displayed_frame_set = frameSet;
queueShot.critical_reaudit_regen_v2 = frameSet;
queueShot.previous_match_action_reference = "storyboards/Shot006/critical_reaudit_regen_v2_2026-08-21/end_frame.png";
queueShot.next_handoff_reference = "storyboards/Shot008/critical_reaudit_regen_v1_2026-08-15/start_frame.png";
queueShot.continuity_previous = "Shot006";
queueShot.continuity_next = "Shot008";
queueShot.model_notes = (queueShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v1"));
queueShot.model_notes.push("Current displayed frames are the 2026-08-21 v2 sequential continuity repair: doorway match action, physical gear handoffs, and a leftward eyeline into Shot008. Keep monitor_required until a 3-second motion probe.");
queueShot.reject_if = queueShot.reject_if || [];
[
  "Shot007 START resets to a six-person courtyard lineup and loses Shot006's doorway handoff",
  "Shot007 KEY has no physical lantern, strap, shield, or spare-sword handoff",
  "Shot007 END loses the Shot008 leftward eyeline or reveals Catherine before the cut",
].forEach((value) => addUnique(queueShot.reject_if, value));
write("frame_generation_queue.json", queue);

const delivery = read("production_system/video_delivery_manifest.json");
const deliveryShot = delivery.shots.find((shot) => shot.id === "Shot007");
deliveryShot.status = "monitor_required";
deliveryShot.start_frame = frames.start;
deliveryShot.key_frame = frames.key;
deliveryShot.end_frame = frames.end;
deliveryShot.current_display_frame_set = version;
deliveryShot.current_display_frame_status = "monitor_required_critical_reaudit_regen_v2_2026-08-21";
deliveryShot.current_display_frame_source = "imagegen_from_local_selected_assets_with_adjacent_shot_match_action_v2_2026-08-21";
deliveryShot.visual_audit_decision = "monitor_required";
deliveryShot.visual_audit_finding = metadata.visual_audit_finding;
deliveryShot.required_revision = metadata.required_revision;
deliveryShot.video_prompt_qa_decision = `pending_review_against_${version}`;
deliveryShot.motion_probe_status = `pending_3s_probe_against_${version}`;
deliveryShot.critical_reaudit_regen_v2 = frameSet;
deliveryShot.previous_match_action_reference = "storyboards/Shot006/critical_reaudit_regen_v2_2026-08-21/end_frame.png";
deliveryShot.next_handoff_reference = "storyboards/Shot008/critical_reaudit_regen_v1_2026-08-15/start_frame.png";
deliveryShot.model_notes = (deliveryShot.model_notes || []).filter((note) => !note.includes("critical_reaudit_regen_v1"));
deliveryShot.model_notes.push("Current displayed frames are the 2026-08-21 v2 sequential continuity repair: doorway match action, physical gear handoffs, and a leftward eyeline into Shot008. Keep monitor_required until a 3-second motion probe.");
deliveryShot.reject_if = deliveryShot.reject_if || [];
[
  "Shot007 START resets to a six-person courtyard lineup and loses Shot006's doorway handoff",
  "Shot007 KEY has no physical lantern, strap, shield, or spare-sword handoff",
  "Shot007 END loses the Shot008 leftward eyeline or reveals Catherine before the cut",
].forEach((value) => addUnique(deliveryShot.reject_if, value));
write("production_system/video_delivery_manifest.json", delivery);

fs.mkdirSync(reviewDir, { recursive: true });
const review = {
  shot_id: "Shot007",
  review_date: "2026-08-21",
  review_type: "critical_reaudit_sequential_adjacent_continuity",
  previous_display_frame_set: "critical_reaudit_regen_v1",
  current_display_frame_set: version,
  status: "monitor_required",
  decision: "monitor_required",
  previous_shot: "Shot006",
  next_shot: "Shot008",
  reviewed_contact_sheet: `episodes/EP03/storyboards/Shot007/${version}/contact_sheet.jpg`,
  frames: {
    start: `episodes/EP03/storyboards/Shot007/${version}/start_frame.png`,
    key: `episodes/EP03/storyboards/Shot007/${version}/key_frame.png`,
    end: `episodes/EP03/storyboards/Shot007/${version}/end_frame.png`,
  },
  reference_assets: frameSet.reference_assets,
  passes: [
    "START visibly continues from Shot006 END at the classroom door instead of resetting to a lineup.",
    "KEY shows a physical lantern, strap, shield, and spare-sword handoff in one shared wet courtyard.",
    "END preserves female Byleth and Ashe's leftward eyeline and leaves the Catherine entrance side open for Shot008.",
    "Female Byleth is visibly female in all three stills.",
    "START, KEY, and END are distinct physical action states.",
    "No Catherine, Thunderbrand, subtitles, UI, or voiceover appears.",
  ],
  monitor_risks: [
    "Dense multi-character motion can still drift local identities during video.",
    "The door-to-yard movement must not teleport or reverse in the motion probe.",
    "The lantern and short-sword contacts must remain grounded.",
  ],
  required_next_gate: "3-second motion probe before any approved_for_video promotion",
  reject_if: [
    "Shot007 START loses the Shot006 doorway handoff",
    "the group becomes a static lineup or the KEY is only a still tabletop",
    "female Byleth becomes male or ambiguous",
    "Catherine appears before Shot008",
    "Shot007 END loses the shared leftward eyeline",
    "the clip adds subtitles, UI, voiceover, or modern/lethal weapons",
  ],
};
fs.writeFileSync(path.join(root, reviewJson), `${JSON.stringify(review, null, 2)}\n`);
const reviewMd = `# Shot007 Critical Re-Audit Regen V2 Review

Shot: Shot007 - 出征准备
Date: 2026-08-21
Reviewed artifact: \`episodes/EP03/storyboards/Shot007/${version}/contact_sheet.jpg\`
Status: \`monitor_required\`

## Finding

The prior candidate did not connect to the adjacent shots. It began as a pre-formed courtyard lineup after Shot006's doorway exit, used a static table insert, and then jumped to a departure wide. The v2 is a sequential continuity repair built from the local selected identity assets and the Shot006/Shot008 visual handoff references.

## Continuity Result

- START keeps the classroom door behind the group and continues Ashe/Dimitri/Byleth into the nearby preparation yard.
- KEY carries the action through shield, strap, lantern, and spare-sword contacts with shared wet-stone geography.
- END moves the group out of the prep area and lands on female Byleth and Ashe turning toward the open arch at screen-left for Catherine's reverse entrance.
- The frames are integrated live-action stills with grounded feet, shared rain, scale, and contact shadows; they are not cutout composites.

## Monitor Risks

- The dense group must hold named identities and academy age in motion.
- Doorway-to-yard movement must not teleport or reverse.
- Catherine and Thunderbrand must remain out until Shot008.

## Required Next Gate

Run prompt-against-frame QA and a 3-second motion probe. Do not promote to \`approved_for_video\` from stills alone.
`;
fs.writeFileSync(path.join(root, reviewMarkdown), reviewMd);
console.log(JSON.stringify({shot: "Shot007", current: version, frames}, null, 2));
