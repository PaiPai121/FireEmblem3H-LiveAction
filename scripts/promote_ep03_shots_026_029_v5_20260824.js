const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const VERSION = 'critical_reaudit_regen_v5_2026-08-24';
const VERSION_KEY = 'critical_reaudit_regen_v5';

const shots = {
  Shot026: {
    source: 'imagegen_integrated_live_action_ashe_lonato_decision_chain_v5_2026-08-24',
    refs: [
      'assets/characters/blue_lions/Ashe/academy/selected.png',
      'assets/characters/kingdom/Lonato/legacy_ep01/selected.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png',
      'storyboards/Shot025/critical_reaudit_regen_v3_2026-08-23/end_frame.png'
    ],
    note: 'v5 rebuild: Ashe observes Lonato from the same road axis, raises one bow, then lowers the nocked arrow toward an empty mud patch. The shot is a decision beat, not a static full-draw pose.',
    finding: '2026-08-24 v5 replaces the pose-like v4 handoff with a readable observe -> draw -> lower decision chain. The 5-8 metre road buffer and empty impact patch remain visible in every state.',
    constraint: 'Exactly two named performers are readable: academy Ashe on the nearer right mark and older white-haired armored Lonato uphill-left. No other named performer enters.',
    previous: 'Shot025',
    next: 'Shot027',
    reject: 'Reject if the arrow points through Lonato, Ashe releases early, the empty mud patch disappears, the road buffer collapses, another named performer appears, or Chinese/Mandarin speech, subtitles, UI, borders, or pasted cutouts appear.',
    promptQa: 'pending_review_against_critical_reaudit_regen_v5_2026-08-24',
    motion: 'pending_3s_probe_against_critical_reaudit_regen_v5_2026-08-24',
    cache: [
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-59385455-2404-40c8-885d-efd16111329c.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-31cac828-95b4-4659-b9c2-0a3f34e298d0.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-c8178b00-6acb-472d-bf70-d89ca4b837a2.png'
    ]
  },
  Shot027: {
    source: 'imagegen_integrated_live_action_ashe_lonato_arrow_mud_chain_v5_2026-08-24',
    refs: [
      'assets/characters/blue_lions/Ashe/academy/selected.png',
      'assets/characters/kingdom/Lonato/legacy_ep01/selected.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png',
      'storyboards/Shot026/critical_reaudit_regen_v5_2026-08-24/end_frame.png'
    ],
    note: 'v5 rebuild: one arrow travels low over the visible road buffer, embeds in empty mud, and makes Lonato check his step. The release, flight, and impact are separate causal states.',
    finding: '2026-08-24 v5 replaces the generic aiming tableau with a low-arrow causal chain: lowered nocked arrow -> one visible flight -> one empty-mud impact -> delayed stop. No body hit and no extra fighter enters.',
    constraint: 'Exactly two named performers are readable: academy Ashe on the nearer right mark and older white-haired armored Lonato uphill-left. The arrow path and empty mud impact remain readable between them.',
    previous: 'Shot026',
    next: 'Shot028',
    reject: 'Reject if the arrow hits Lonato or equipment, a second arrow appears, the impact lands under his boots, Lonato falls or attacks, Ashe advances, or Chinese/Mandarin speech, subtitles, UI, borders, or pasted cutouts appear.',
    promptQa: 'pending_review_against_critical_reaudit_regen_v5_2026-08-24',
    motion: 'pending_3s_probe_against_critical_reaudit_regen_v5_2026-08-24',
    cache: [
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-c7c5cfa2-3da9-474d-8100-d815efd5337c.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-5bebfc14-a05e-40f0-b9e0-c234bd570ef8.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-326d8d6b-8d22-4636-9182-4afebb18c837.png'
    ]
  },
  Shot028: {
    source: 'imagegen_integrated_live_action_catherine_thunderbrand_safe_disarm_v5_2026-08-24',
    refs: [
      'assets/characters/protagonist/BylethFemale/professor/selected.png',
      'assets/characters/church_of_seiros/Catherine/academy/selected.png',
      'assets/characters/kingdom/Lonato/legacy_ep01/selected.png',
      'assets/props/shared/hero_relics/thunderbrand_reference.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png',
      'storyboards/Shot027/critical_reaudit_regen_v5_2026-08-24/end_frame.png'
    ],
    note: 'v5 rebuild: Catherine alone makes the single weapon-to-weapon disarm. Female Byleth stays in the rear with the Sword of Creator lowered; after contact she closes the escape line without touching Lonato.',
    finding: '2026-08-24 v5 removes the false two-person execution read from the rejected END. The causal chain is flank entry -> Catherine-only guard catch -> ordinary sword drop -> Byleth rear control, with open distance preserved.',
    constraint: 'Exactly three named performers are readable: Catherine, Lonato, and female academy Byleth. Catherine carries Thunderbrand; Byleth carries the Sword of Creator low and never touches Lonato.',
    previous: 'Shot027',
    next: 'Shot029',
    reject: 'Reject if Byleth reads male, Catherine lacks Thunderbrand, Byleth touches Lonato, the contact is hidden, a blade reaches the neck or torso, Lonato kneels before Shot029, or Chinese/Mandarin speech, subtitles, UI, borders, or pasted cutouts appear.',
    promptQa: 'pending_review_against_critical_reaudit_regen_v5_2026-08-24',
    motion: 'pending_3s_probe_against_critical_reaudit_regen_v5_2026-08-24',
    cache: [
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-f9fd41cd-f8ff-4716-a582-6258b18193fa.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-73a2a207-406a-4ef0-90b2-651339a2b3e6.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-731dcae3-5eef-450c-92aa-53d1a61ba492.png'
    ]
  },
  Shot029: {
    source: 'imagegen_integrated_live_action_lonato_post_disarm_recovery_v5_2026-08-24',
    refs: [
      'assets/characters/kingdom/Lonato/legacy_ep01/selected.png',
      'assets/characters/blue_lions/Dimitri/academy/selected.png',
      'assets/characters/blue_lions/Ashe/academy/selected.png',
      'assets/characters/protagonist/BylethFemale/professor/selected.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png',
      'storyboards/Shot028/critical_reaudit_regen_v5_2026-08-24/end_frame.png'
    ],
    note: 'v5 rebuild: Lonato remains upright in START, catches the collapse in KEY, and settles into an isolated knee in END. Dimitri, Ashe, and female Byleth are staggered rear witnesses, never an execution line.',
    finding: '2026-08-24 v5 replaces the static witness row with a physical handoff: dropped sword and broken balance -> shield/hand catch and one knee -> widened aftermath. Catherine has exited and the road buffer remains open.',
    constraint: 'Exactly four named performers are readable: older armored Lonato, academy Dimitri, academy Ashe, and female academy Byleth. Catherine has exited; Ashe and Dimitri remain outside Lonato sword range.',
    previous: 'Shot028',
    next: 'Shot030',
    reject: 'Reject if Lonato is already kneeling in START, male Byleth appears, Catherine returns, Dimitri or Ashe rushes or attacks, the group becomes a row, or Chinese/Mandarin speech, subtitles, UI, borders, or pasted cutouts appear.',
    promptQa: 'pending_review_against_critical_reaudit_regen_v5_2026-08-24',
    motion: 'pending_3s_probe_against_critical_reaudit_regen_v5_2026-08-24',
    cache: [
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-118b89d8-c62e-4962-8de7-100b4517697b.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-bde325df-94dd-4219-9353-1d9b3eac1750.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-1cea5682-c7cc-4bad-9308-b42fe8dd1a8e.png'
    ]
  }
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
}

function writeJson(file, value) {
  const abs = path.join(ROOT, file);
  fs.writeFileSync(abs, `${JSON.stringify(value, null, 2)}\n`);
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
    note: 'Exact frames were visually reviewed as an integrated live-action chain. Downstream video remains monitor_required until prompt-against-frame QA and the 3-second motion probe pass.'
  };
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
  entry.displayed_frame_set = displayedFrameSet(id, cfg);
  entry[VERSION_KEY] = displayedFrameSet(id, cfg);
  entry.model_notes = Array.isArray(entry.model_notes) ? entry.model_notes : [];
  entry.model_notes.push(`${VERSION} is the current user-directed action-chain rebuild. ${cfg.note} Keep monitor_required until motion probe.`);
}

function findShotEntries(doc, id) {
  const arrays = [];
  if (Array.isArray(doc)) arrays.push(doc);
  for (const key of ['shots', 'items', 'queue']) {
    if (Array.isArray(doc[key])) arrays.push(doc[key]);
  }
  return arrays.flatMap(xs => xs.filter(x => [x.id, x.shot, x.shot_id].includes(id)));
}

const queue = readJson('episodes/EP03/frame_generation_queue.json');
for (const [id, cfg] of Object.entries(shots)) {
  const entries = findShotEntries(queue, id);
  if (!entries.length) throw new Error(`Missing queue entry for ${id}`);
  entries.forEach(entry => applyShotFields(entry, id, cfg));
}
writeJson('episodes/EP03/frame_generation_queue.json', queue);

const manifest = readJson('episodes/EP03/production_system/video_delivery_manifest.json');
for (const [id, cfg] of Object.entries(shots)) {
  const entries = findShotEntries(manifest, id);
  if (!entries.length) throw new Error(`Missing manifest entry for ${id}`);
  entries.forEach(entry => applyShotFields(entry, id, cfg));
}
writeJson('episodes/EP03/production_system/video_delivery_manifest.json', manifest);

for (const [id, cfg] of Object.entries(shots)) {
  const file = `episodes/EP03/storyboards/${id}/metadata.json`;
  const metadata = readJson(file);
  const frames = relFrames(id);
  metadata.planned_frames = frames;
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
  metadata.displayed_frame_set = displayedFrameSet(id, cfg);
  metadata[VERSION_KEY] = displayedFrameSet(id, cfg);
  writeJson(file, metadata);
}

const receipts = readJson('production_system/generation_receipts.json');
const existing = new Set(receipts.receipts.map(r => r.output_path || r.path));
for (const [id, cfg] of Object.entries(shots)) {
  const frames = relFrames(id);
  for (const role of ['start', 'key', 'end']) {
    const sourcePath = cfg.cache[['start', 'key', 'end'].indexOf(role)];
    const outputPath = `episodes/EP03/${frames[role]}`;
    if (existing.has(outputPath)) continue;
    const digest = crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex');
    const toolCallId = path.basename(sourcePath, '.png').replace(/^exec-/, 'exec-');
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
      notes: `${VERSION}: integrated live-action frame reviewed against local identity/location references. Prompt QA and motion probe remain pending.`
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
state.stop_reason = 'unresolved_legacy_frame_provenance; motion_probe_pending';
state.review_state = 'cache_provenance_migrated_with_current_v5_rebuild; motion_probe_pending';
writeJson('production_system/generation_state.json', state);

console.log(JSON.stringify({promoted: Object.keys(shots), version: VERSION, receipt_count: receipts.receipts.length}, null, 2));
