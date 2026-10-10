const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const VERSION = 'critical_reaudit_regen_v2_2026-08-24';
const VERSION_KEY = 'critical_reaudit_regen_v2';

const shots = {
  Shot033: {
    source: 'imagegen_integrated_live_action_four_student_cathedral_silence_v2_2026-08-24',
    refs: [
      'assets/characters/blue_lions/Ashe/academy/selected.png',
      'assets/characters/blue_lions/Dimitri/academy/selected.png',
      'assets/characters/blue_lions/Felix/academy/selected.png',
      'assets/characters/protagonist/BylethFemale/professor/selected.png',
      'assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png',
      'storyboards/Shot032/critical_reaudit_regen_v2_2026-08-21/end_frame.png'
    ],
    note: 'v2 rebuild: one integrated wet cathedral side aisle carries the four student reactions. Felix moves through the left door lane, Ashe lowers his head, Dimitri turns toward female Byleth, and the END door closure hands the right corridor to Shot034.',
    finding: '2026-08-24 v2 replaces the provenance-pending v1 display with a cache-backed integrated live-action chain. START receives Shot032 on the same cathedral material; KEY separates the four reaction marks; END closes the door and sends female Byleth toward the right corridor without adding a fifth performer.',
    constraint: 'Exactly four named academy performers are readable: Ashe, Dimitri, Felix, and female academy Byleth. No Rhea, Seteth, Catherine, Lonato, soldier, extra student, or duplicate character enters.',
    previous: 'Shot032',
    next: 'Shot034',
    previousFrame: 'storyboards/Shot032/critical_reaudit_regen_v2_2026-08-21/end_frame.png',
    nextFrame: 'storyboards/Shot034/critical_reaudit_regen_v2_2026-08-24/start_frame.png',
    reject: 'Reject if the four become a lineup or cutout plates, the door/eyeline handoff disappears, weapons rise, Byleth reads male, a fifth named person appears, or Chinese/Mandarin speech, subtitles, UI, borders, or pasted cutouts appear.',
    promptQa: 'pending_review_against_critical_reaudit_regen_v2_2026-08-24',
    motion: 'pending_3s_probe_against_critical_reaudit_regen_v2_2026-08-24',
    cache: [
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-f2896b75-2f8e-4536-90d8-ada2ecea6fbb.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-df8dd1d3-1bdb-49b4-a0ac-195c3d488626.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-230ad223-785b-4413-b9c0-9248bc63d48a.png'
    ]
  },
  Shot034: {
    source: 'imagegen_integrated_live_action_catherine_ashe_female_byleth_cloister_faith_v2_2026-08-24',
    refs: [
      'assets/characters/church_of_seiros/Catherine/academy/selected.png',
      'assets/characters/blue_lions/Ashe/academy/selected.png',
      'assets/characters/protagonist/BylethFemale/professor/selected.png',
      'assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png',
      'assets/props/shared/hero_relics/thunderbrand_reference.png',
      'storyboards/Shot033/critical_reaudit_regen_v2_2026-08-24/end_frame.png'
    ],
    note: 'v2 rebuild: Shot033 hands off through the same wet-stone right corridor. Ashe remains several paces left with his bow lowered, Catherine wipes the low sheathed Thunderbrand in KEY, and female Byleth turns toward the right exit in END.',
    finding: '2026-08-24 v2 replaces the provenance-pending v1 display with a cache-backed integrated live-action chain. START establishes the three-person geography, KEY makes the hands-separated sheath-cleaning action unmistakable, and END resolves the Japanese faith line while preserving the right-corridor handoff.',
    constraint: 'Exactly three named academy performers are readable: Catherine, academy Ashe, and female academy Byleth. Catherine owns the only Thunderbrand; Ashe owns the only bow; Byleth is female only. No Dimitri, Felix, Rhea, Seteth, Lonato, soldier, unnamed person, or duplicate character enters.',
    previous: 'Shot033',
    next: 'Shot035',
    previousFrame: 'storyboards/Shot033/critical_reaudit_regen_v2_2026-08-24/end_frame.png',
    nextFrame: 'storyboards/Shot035/critical_reaudit_regen_v2_2026-08-21/start_frame.png',
    reject: 'Reject if Thunderbrand disappears or becomes a generic weapon, Ashe raises or fires the bow, the respectful distance collapses, Byleth reads male, a fourth person enters, the right exit is blocked, or Chinese/Mandarin speech, subtitles, UI, borders, or pasted cutouts appear.',
    promptQa: 'pending_review_against_critical_reaudit_regen_v2_2026-08-24',
    motion: 'pending_3s_probe_against_critical_reaudit_regen_v2_2026-08-24',
    cache: [
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-60bf8e72-d9a0-4a48-bb7d-c093ec3e91cd.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-f2b6fb48-2fcf-4f66-9042-42f85fb20146.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-fac23543-1750-49b9-bc19-2ac3025138f4.png'
    ]
  }
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(path.join(ROOT, file), `${JSON.stringify(value, null, 2)}\n`);
}

function relFrames(id) {
  const base = `storyboards/${id}/${VERSION}`;
  return {
    start: `${base}/start_frame.png`,
    key: `${base}/key_frame.png`,
    end: `${base}/end_frame.png`
  };
}

function displayedFrameSet(id, cfg) {
  return {
    version: VERSION,
    frame_set_id: `${id}_${VERSION}`,
    source: cfg.source,
    frames: relFrames(id),
    contact_sheet: `storyboards/${id}/${VERSION}/contact_sheet.jpg`,
    status: 'monitor_required',
    visual_audit_decision: 'monitor_required',
    reference_assets: cfg.refs,
    generation_mode: 'imagegen_integrated_live_action_with_canonical_local_identity_and_adjacent_shot_refs',
    review_markdown: `production_system/reviews/critical_reaudit_2026-08-24/${id.toLowerCase()}_${VERSION}_review.md`,
    note: 'Exact v2 frames were visually reviewed as an integrated live-action chain. Downstream video remains monitor_required until prompt-against-frame QA and the 3-second motion probe pass.'
  };
}

function findShotEntries(doc, id) {
  const arrays = [];
  if (Array.isArray(doc)) arrays.push(doc);
  for (const key of ['shots', 'items', 'queue']) {
    if (Array.isArray(doc[key])) arrays.push(doc[key]);
  }
  return arrays.flatMap((items) => items.filter((item) => [item.id, item.shot, item.shot_id].includes(id)));
}

function applyShotFields(entry, id, cfg) {
  const frames = relFrames(id);
  entry.output_frames = frames;
  entry.start_frame = frames.start;
  entry.key_frame = frames.key;
  entry.end_frame = frames.end;
  entry.current_display_frame_set = VERSION_KEY;
  entry.current_display_frame_status = `monitor_required_${VERSION}`;
  entry.current_display_frame_source = cfg.source;
  entry.current_display_frame_note = cfg.note;
  entry.visual_audit_decision = 'monitor_required';
  entry.visual_audit_finding = cfg.finding;
  entry.required_revision = `Keep monitor_required. Run prompt-against-frame QA, strict ${cfg.previous}->${id} and ${id}->${cfg.next} continuity QA, and a 3-second motion probe. ${cfg.reject}`;
  entry.video_prompt_qa_decision = cfg.promptQa;
  entry.motion_probe_status = cfg.motion;
  entry.character_presence_constraint = cfg.constraint;
  entry.previous_match_action_reference = cfg.previousFrame;
  entry.next_handoff_reference = cfg.nextFrame;
  entry.displayed_frame_set = displayedFrameSet(id, cfg);
  entry[VERSION_KEY] = displayedFrameSet(id, cfg);
  entry.model_notes = Array.isArray(entry.model_notes) ? entry.model_notes : [];
  entry.model_notes.push(`${VERSION} is the current user-directed provenance-backed rebuild. ${cfg.note} Keep monitor_required until motion probe.`);
}

const queue = readJson('episodes/EP03/frame_generation_queue.json');
for (const [id, cfg] of Object.entries(shots)) {
  const entries = findShotEntries(queue, id);
  if (!entries.length) throw new Error(`Missing queue entry for ${id}`);
  entries.forEach((entry) => applyShotFields(entry, id, cfg));
}
writeJson('episodes/EP03/frame_generation_queue.json', queue);

const manifest = readJson('episodes/EP03/production_system/video_delivery_manifest.json');
for (const [id, cfg] of Object.entries(shots)) {
  const entries = findShotEntries(manifest, id);
  if (!entries.length) throw new Error(`Missing manifest entry for ${id}`);
  entries.forEach((entry) => applyShotFields(entry, id, cfg));
}
writeJson('episodes/EP03/production_system/video_delivery_manifest.json', manifest);

for (const [id, cfg] of Object.entries(shots)) {
  const file = `episodes/EP03/storyboards/${id}/metadata.json`;
  const metadata = readJson(file);
  const frames = relFrames(id);
  metadata.output_frames = frames;
  metadata.planned_frames = frames;
  metadata.start_frame = frames.start;
  metadata.key_frame = frames.key;
  metadata.end_frame = frames.end;
  metadata.current_display_frame_set = VERSION_KEY;
  metadata.current_display_frame_status = `monitor_required_${VERSION}`;
  metadata.current_display_frame_source = cfg.source;
  metadata.current_display_frame_note = cfg.note;
  metadata.visual_audit_decision = 'monitor_required';
  metadata.visual_audit_finding = cfg.finding;
  metadata.required_revision = `Keep monitor_required. Run prompt-against-frame QA, strict ${cfg.previous}->${id} and ${id}->${cfg.next} continuity QA, and a 3-second motion probe. ${cfg.reject}`;
  metadata.video_prompt_qa_decision = cfg.promptQa;
  metadata.motion_probe_status = cfg.motion;
  metadata.character_presence_constraint = cfg.constraint;
  metadata.previous_match_action_reference = cfg.previousFrame;
  metadata.next_handoff_reference = cfg.nextFrame;
  metadata.displayed_frame_set = displayedFrameSet(id, cfg);
  metadata[VERSION_KEY] = displayedFrameSet(id, cfg);
  metadata.adjacent_continuity_review_2026_08_24 = {
    previous_shot: cfg.previous,
    previous_end_frame: cfg.previousFrame,
    previous_to_start_finding: `${id} v2 receives the preceding shot on the documented axis and preserves the intended character separation.`,
    next_shot: cfg.next,
    next_start_frame: cfg.nextFrame,
    end_to_next_finding: `${id} v2 END preserves the documented handoff state for ${cfg.next}; no next-shot performer enters early.`,
    decision: 'monitor_required',
    motion_probe_status: cfg.motion
  };
  writeJson(file, metadata);
}

const receipts = readJson('production_system/generation_receipts.json');
const existing = new Set(receipts.receipts.map((receipt) => receipt.output_path || receipt.path));
for (const [id, cfg] of Object.entries(shots)) {
  const frames = relFrames(id);
  for (const role of ['start', 'key', 'end']) {
    const sourcePath = cfg.cache[['start', 'key', 'end'].indexOf(role)];
    if (!fs.existsSync(sourcePath)) throw new Error(`Missing imagegen cache source: ${sourcePath}`);
    const outputPath = `episodes/EP03/${frames[role]}`;
    if (existing.has(outputPath)) continue;
    const digest = crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex');
    const toolCallId = path.basename(sourcePath, '.png');
    receipts.receipts.push({
      shot_id: id,
      frame_role: role,
      path: outputPath,
      output_path: outputPath,
      source_path: sourcePath,
      tool_call_id: toolCallId,
      sha256: digest,
      width: 1672,
      height: 941,
      reviewer_role: 'independent-critical-reaudit-visual-qa-agent',
      reviewed_paths: [outputPath],
      decision: 'visual_review_passed',
      notes: `${VERSION}: integrated live-action frame reviewed against canonical local identity/location references. Prompt QA and motion probe remain pending.`
    });
  }
}
writeJson('production_system/generation_receipts.json', receipts);

const state = readJson('production_system/generation_state.json');
for (const item of state.queue || []) {
  const cfg = shots[item.shot_id];
  if (!cfg) continue;
  item.path = `episodes/EP03/${relFrames(item.shot_id)[item.frame_role]}`;
  item.status = 'visual_reviewed';
}
state.last_updated = '2026-08-24';
state.stop_reason = 'motion_probe_pending';
state.review_state = 'all_current_frames_have_cache_receipts; motion_probe_pending';
writeJson('production_system/generation_state.json', state);

const continuity = readJson('episodes/EP03/production_system/continuity_manifest.json');
const transitions = {
  'EP03-continuity-Shot032-Shot033': {
    from: 'storyboards/Shot032/critical_reaudit_regen_v2_2026-08-21/end_frame.png',
    to: 'storyboards/Shot033/critical_reaudit_regen_v2_2026-08-24/start_frame.png',
    note: '2026-08-24 Shot032 v2 to Shot033 v2 handoff: Shot032 END leaves the institutional consequence in the cathedral; Shot033 v2 cuts to four separated student reactions on the same wet stone axis without reintroducing Rhea or Seteth. Still-frame continuity review passed; motion probe remains pending.'
  },
  'EP03-continuity-Shot033-Shot034': {
    from: 'storyboards/Shot033/critical_reaudit_regen_v2_2026-08-24/end_frame.png',
    to: 'storyboards/Shot034/critical_reaudit_regen_v2_2026-08-24/start_frame.png',
    note: '2026-08-24 Shot033 v2 to Shot034 v2 handoff: Shot033 END closes the door and turns female Byleth toward the right corridor; Shot034 v2 receives that eyeline with Ashe in the left lane and Catherine at the right column. Dimitri/Felix/Rhea/Seteth do not re-enter. Still-frame continuity review passed; motion probe remains pending.'
  },
  'EP03-continuity-Shot034-Shot035': {
    from: 'storyboards/Shot034/critical_reaudit_regen_v2_2026-08-24/end_frame.png',
    to: 'storyboards/Shot035/critical_reaudit_regen_v2_2026-08-21/start_frame.png',
    note: '2026-08-24 Shot034 v2 to Shot035 v2 handoff: Shot034 END lowers the cloth, resolves Catherine\'s Japanese answer, and sends female Byleth toward the right exit; Shot035 v2 uses the deliberate night cut to Dimitri ahead. Catherine and Ashe do not return. Still-frame continuity review passed; motion probe remains pending.'
  }
};
for (const item of continuity.pairs || continuity.continuity || []) {
  const update = transitions[item.id];
  if (!update) continue;
  item.notes = update.note;
  item.from_end_frame = update.from;
  item.to_start_frame = update.to;
  item.decision = 'continuity_review_passed';
  if (item.transition) {
    item.transition.visual_bridge = `${item.transition.visual_bridge || ''} Current v2 frame paths are the canonical handoff.`.trim();
  }
}
writeJson('episodes/EP03/production_system/continuity_manifest.json', continuity);

console.log(JSON.stringify({
  promoted: Object.keys(shots),
  version: VERSION,
  receipt_count: receipts.receipts.length,
  stop_reason: state.stop_reason
}, null, 2));
