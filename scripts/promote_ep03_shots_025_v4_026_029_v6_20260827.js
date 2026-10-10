const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const REVIEW_DIR = 'critical_reaudit_2026-08-27';

const shots = {
  Shot025: {
    version: 'critical_reaudit_regen_v6_2026-08-27',
    versionKey: 'critical_reaudit_regen_v6',
    source: 'imagegen_integrated_live_action_formation_distance_v6_2026-08-27',
    refs: [
      'assets/characters/protagonist/BylethFemale/professor/selected.png',
      'assets/characters/blue_lions/Dimitri/academy/selected.png',
      'assets/characters/blue_lions/Dedue/academy/selected.png',
      'assets/characters/blue_lions/Sylvain/academy/selected.png',
      'assets/characters/blue_lions/Ingrid/academy/selected.png',
      'assets/characters/blue_lions/Mercedes/academy/selected.png',
      'assets/characters/blue_lions/Annette/academy/selected.png',
      'assets/characters/blue_lions/Ashe/academy/selected.png',
      'assets/characters/kingdom/Lonato/legacy_ep01/selected.png',
      'assets/characters/extras/BanditSoldier/selected.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png',
      'episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/EP03_local_identity_plate_atlas_2026-08-01.jpg',
      'episodes/EP03/storyboards/Shot024/critical_reaudit_regen_v3_2026-08-23/end_frame.png'
    ],
    note: 'v6 rebuild: a readable long establishing view with the exact eight academy performers in a lower staggered formation. Female Byleth is clear in the rear, two unfeatured rebel guards hold the middle road, and Lonato remains isolated on the far upper ridge.',
    finding: '2026-08-27 sequential re-audit: v6 replaces the previous v5 distance study with a more readable long composition. START, KEY, and END preserve the same three depth zones while showing a restrained camera drift, wider student V, and visible guard-line closure; there is still no plausible immediate blade distance.',
    constraint: 'Female Byleth only. Exactly eight named academy performers remain in the lower formation, exactly two unfeatured rebel foot soldiers hold the middle line, Ashe stays lower-right, and older white-haired Lonato stays tiny and far uphill. No student or Byleth is within Lonato sword distance.',
    previous: 'Shot024',
    next: 'Shot026',
    reject: 'Reject if Byleth reads male, the guard line disappears, Lonato stands beside a student, the formation becomes a row, Ashe fires, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.',
    cache: [
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-0a58add8-a4e3-4f54-8f53-a53525c4941c.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-d1b66b53-01a9-4981-838f-94d9744e6404.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-cb0c114d-41c1-405f-80d1-3dcd08a70480.png'
    ]
  },
  Shot026: {
    version: 'critical_reaudit_regen_v6_2026-08-24',
    versionKey: 'critical_reaudit_regen_v6',
    source: 'imagegen_integrated_live_action_ashe_guard_line_decision_v6_2026-08-27',
    refs: [
      'assets/characters/blue_lions/Ashe/academy/selected.png',
      'assets/characters/kingdom/Lonato/legacy_ep01/selected.png',
      'assets/characters/extras/BanditSoldier/selected.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png',
      'episodes/EP03/storyboards/Shot025/critical_reaudit_regen_v6_2026-08-27/end_frame.png'
    ],
    note: 'v6 rebuild: Ashe makes the restraint decision with two rebel guards physically between her and Lonato; the arrow line stops in empty space before the guard line.',
    finding: '2026-08-27 sequential re-audit: v6 removes the artificial arrow-to-mud beat. START shows Lonato advancing behind the guard line, KEY shows Ashe drawing toward empty space before the guards, and END lowers the nocked arrow while a left entry seam remains for Catherine.',
    constraint: 'Exactly two named performers are readable: academy Ashe on the nearer right mark and older white-haired armored Lonato uphill-left, plus exactly two indistinct rebel foot soldiers between them. No other named performer enters.',
    previous: 'Shot025',
    next: 'Shot027',
    reject: 'Reject if the two guards disappear, the arrow points through a guard or Lonato, Ashe releases, the buffer collapses, Lonato charges, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.',
    cache: [
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-9f27d629-c8c0-437d-9705-7825e4c43efe.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-3489677c-891f-4409-b689-641d71288c48.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-7ac2e06c-3751-4e17-a078-08973d5f2dcb.png'
    ]
  },
  Shot027: {
    version: 'critical_reaudit_regen_v6_2026-08-24',
    versionKey: 'critical_reaudit_regen_v6',
    source: 'imagegen_integrated_live_action_catherine_guard_intervention_v6_2026-08-27',
    refs: [
      'assets/characters/blue_lions/Ashe/academy/selected.png',
      'assets/characters/church_of_seiros/Catherine/academy/selected.png',
      'assets/characters/kingdom/Lonato/legacy_ep01/selected.png',
      'assets/characters/extras/BanditSoldier/selected.png',
      'assets/props/shared/hero_relics/thunderbrand_reference.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png',
      'episodes/EP03/storyboards/Shot026/critical_reaudit_regen_v6_2026-08-24/end_frame.png'
    ],
    note: 'v6 rebuild: Catherine first redirects a rebel guard long weapon with Thunderbrand, then occupies the line before Lonato; Ashe remains held back and the two guards stay visible.',
    finding: '2026-08-27 sequential re-audit: v6 adds the missing guard interaction. START is Catherine entering behind the guard line, KEY shows the physical long-weapon redirect, and END displaces both guards behind Catherine before the Lonato pre-contact handoff.',
    constraint: 'Catherine, Ashe, and Lonato are the named performers; exactly two indistinct rebel foot soldiers remain visible as the physical middle-line guards. Catherine carries Thunderbrand. No arrow release and no instant Lonato disarm.',
    previous: 'Shot026',
    next: 'Shot028',
    reject: 'Reject if Catherine flies or glows, the two guards vanish before the redirect, the long weapon passes through a body, Ashe fires, Lonato is already disarmed, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.',
    cache: [
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-cb3687ca-faf9-4d00-85ee-a314889643f8.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-7d587c17-e013-44fc-a929-caffb1557c8f.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-f10adfd3-fd1e-4918-804e-737c44ccfc52.png'
    ]
  },
  Shot028: {
    version: 'critical_reaudit_regen_v6_2026-08-24',
    versionKey: 'critical_reaudit_regen_v6',
    source: 'imagegen_integrated_live_action_catherine_thunderbrand_disarm_v6_2026-08-27',
    refs: [
      'assets/characters/church_of_seiros/Catherine/academy/selected.png',
      'assets/characters/kingdom/Lonato/legacy_ep01/selected.png',
      'assets/props/shared/hero_relics/thunderbrand_reference.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png',
      'episodes/EP03/storyboards/Shot027/critical_reaudit_regen_v6_2026-08-24/end_frame.png'
    ],
    note: 'v6 rebuild: the two-person contact coverage shows one sword press, one Thunderbrand guard bind, and one ordinary sword drop while Catherine and Lonato stay grounded and separated.',
    finding: '2026-08-27 sequential re-audit: v6 replaces the posed crossed-sword read with a clear pre-contact -> guard contact -> single disarm chain. The final frame keeps Lonato upright with his shield attached and only his ordinary sword on the mud.',
    constraint: 'Only Catherine and older armored Lonato are readable in the contact coverage. Catherine carries one Thunderbrand; Lonato carries one shield and begins with one ordinary sword, which is the only weapon dropped.',
    previous: 'Shot027',
    next: 'Shot029',
    reject: 'Reject if the contact point is hidden, a blade reaches a body, a second shield or sword drops, Lonato kneels early, Byleth/Ashe/guards enter, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.',
    cache: [
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-1a5f62e9-781f-463d-9794-279ddb7d0dc5.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-904f1cbd-d02a-4de7-8318-92dea77f2e24.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-dc4121c0-9f77-42cd-ac08-9456bd64c34e.png'
    ]
  },
  Shot029: {
    version: 'critical_reaudit_regen_v6_2026-08-24',
    versionKey: 'critical_reaudit_regen_v6',
    source: 'imagegen_integrated_live_action_lonato_aftermath_v6_2026-08-27',
    refs: [
      'assets/characters/kingdom/Lonato/legacy_ep01/selected.png',
      'assets/characters/blue_lions/Dimitri/academy/selected.png',
      'assets/characters/blue_lions/Ashe/academy/selected.png',
      'assets/characters/protagonist/BylethFemale/professor/selected.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png',
      'assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png',
      'episodes/EP03/storyboards/Shot028/critical_reaudit_regen_v6_2026-08-24/end_frame.png'
    ],
    note: 'v6 rebuild: Lonato remains upright in START, catches the collapse in KEY, and settles into an isolated knee in END; Dimitri, Ashe and female Byleth remain staggered witnesses.',
    finding: '2026-08-27 sequential re-audit: v6 preserves the single dropped sword and turns it into a physical recovery chain. START catches the first buckle, KEY reads shield/hand/knee contact, and END widens to a quiet aftermath without a victory or execution row.',
    constraint: 'Exactly four named performers are readable: older armored Lonato, academy Dimitri, academy Ashe and female academy Byleth. Catherine has exited; all witnesses remain outside Lonato sword range.',
    previous: 'Shot028',
    next: 'Shot030',
    reject: 'Reject if Lonato is already kneeling in START, Catherine returns, male Byleth appears, witnesses rush or attack, the group becomes a row, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.',
    cache: [
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-feb82062-bfe0-49a9-b9e6-4e0506964576.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-65e97365-78cf-497b-905f-2fb88bc26633.png',
      '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-ffe-84b1cca2e055/exec-1f1af4a7-71d5-420b-b4b6-3bcb90795fe7.png'
    ]
  }
};

// Correct the final cache directory typo without changing the human-readable config above.
shots.Shot029.cache[2] = '/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-1f1af4a7-71d5-420b-b4b6-3bcb90795fe7.png';

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
}

function writeJson(rel, value) {
  fs.writeFileSync(path.join(ROOT, rel), `${JSON.stringify(value, null, 2)}\n`);
}

function relFrames(id, cfg) {
  const base = `storyboards/${id}/${cfg.version}`;
  return {
    start: `${base}/start_frame.png`,
    key: `${base}/key_frame.png`,
    end: `${base}/end_frame.png`
  };
}

function reviewRel(id, cfg) {
  return `production_system/reviews/${REVIEW_DIR}/${id.toLowerCase()}_${cfg.version}_review.md`;
}

function frameSet(id, cfg) {
  const frames = relFrames(id, cfg);
  return {
    version: cfg.version,
    frame_set_id: `${id}_${cfg.version}`,
    source: cfg.source,
    frames,
    contact_sheet: `storyboards/${id}/${cfg.version}/contact_sheet.jpg`,
    status: 'monitor_required',
    visual_audit_decision: 'visual_review_passed',
    reference_assets: cfg.refs,
    generation_mode: 'imagegen_integrated_live_action_with_canonical_local_identity_and_adjacent_shot_refs',
    review_markdown: reviewRel(id, cfg),
    note: 'Exact files were visually reviewed as an integrated live-action sequence. Prompt-against-frame QA, strict continuity QA and motion probes remain pending.'
  };
}

function findShotEntries(doc, id) {
  const arrays = [];
  if (Array.isArray(doc)) arrays.push(doc);
  for (const key of ['shots', 'items', 'queue']) {
    if (Array.isArray(doc[key])) arrays.push(doc[key]);
  }
  return arrays.flatMap(xs => xs.filter(x => [x.id, x.shot, x.shot_id].includes(id)));
}

function applyShotFields(entry, id, cfg) {
  const frames = relFrames(id, cfg);
  const displayed = frameSet(id, cfg);
  entry.output_frames = frames;
  entry.start_frame = frames.start;
  entry.key_frame = frames.key;
  entry.end_frame = frames.end;
  entry.current_display_frame_set = cfg.versionKey;
  entry.current_display_frame_status = `monitor_required_${cfg.version}`;
  entry.current_display_frame_source = cfg.source;
  entry.current_display_frame_note = cfg.note;
  entry.visual_audit_decision = 'visual_review_passed';
  entry.visual_audit_finding = cfg.finding;
  entry.required_revision = `Keep monitor_required. Run prompt-against-frame QA, strict ${cfg.previous}->${id} and ${id}->${cfg.next} continuity QA, and a 3-second motion probe. ${cfg.reject}`;
  entry.video_prompt_qa_decision = `pending_review_against_${cfg.version}`;
  entry.motion_probe_status = `pending_3s_probe_against_${cfg.version}`;
  entry.character_presence_constraint = cfg.constraint;
  entry.reference_assets = cfg.refs;
  entry.displayed_frame_set = displayed;
  entry[cfg.versionKey] = displayed;
  entry.model_notes = Array.isArray(entry.model_notes) ? entry.model_notes : [];
  entry.model_notes.push(`${cfg.version} is the current sequential visual rebuild. ${cfg.note} Keep monitor_required until prompt QA and motion probe.`);
}

function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.toString('ascii', 1, 4) !== 'PNG') throw new Error(`Not a PNG: ${file}`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
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
  metadata.planned_frames = relFrames(id, cfg);
  metadata.current_display_frame_set = cfg.versionKey;
  metadata.current_display_frame_status = `monitor_required_${cfg.version}`;
  metadata.current_display_frame_source = cfg.source;
  metadata.current_display_frame_note = cfg.note;
  metadata.visual_audit_decision = 'visual_review_passed';
  metadata.visual_audit_finding = cfg.finding;
  metadata.required_revision = `Keep monitor_required. Run prompt-against-frame QA, strict ${cfg.previous}->${id} and ${id}->${cfg.next} continuity QA, and a 3-second motion probe. ${cfg.reject}`;
  metadata.video_prompt_qa_decision = `pending_review_against_${cfg.version}`;
  metadata.motion_probe_status = `pending_3s_probe_against_${cfg.version}`;
  metadata.character_presence_constraint = cfg.constraint;
  metadata.reference_assets = cfg.refs;
  metadata.displayed_frame_set = frameSet(id, cfg);
  metadata[cfg.versionKey] = frameSet(id, cfg);
  writeJson(file, metadata);
}

const contract = readJson('production_system/generation_contract.json');
for (const cfg of Object.values(shots)) {
  for (const refPath of cfg.refs) {
    if (contract.reference_sets.some(ref => ref.path === refPath)) continue;
    const id = `ep03_${crypto.createHash('sha1').update(refPath).digest('hex').slice(0, 10)}`;
    contract.reference_sets.push({ id, path: refPath, role: refPath.includes('style_reference') ? 'style' : refPath.includes('end_frame') ? 'composition' : refPath.includes('/locations/') ? 'location' : refPath.includes('/props/') ? 'prop' : 'identity', generation_allowed: true });
  }
}
for (const [id, cfg] of Object.entries(shots)) {
  const shot = contract.shots.find(entry => entry.id === id);
  if (!shot) throw new Error(`Missing contract shot ${id}`);
  const frames = relFrames(id, cfg);
  shot.version = cfg.version;
  shot.reference_ids = cfg.refs.map(refPath => contract.reference_sets.find(ref => ref.path === refPath).id);
  shot.expected_frames = ['start', 'key', 'end'].map(role => ({ role, path: `episodes/EP03/${frames[role]}` }));
}
writeJson('production_system/generation_contract.json', contract);

const receipts = readJson('production_system/generation_receipts.json');
const existing = new Set(receipts.receipts.map(r => r.output_path || r.path));
for (const [id, cfg] of Object.entries(shots)) {
  const frames = relFrames(id, cfg);
  const reviewPath = `episodes/EP03/${reviewRel(id, cfg)}`;
  const reviewAbs = path.join(ROOT, reviewPath);
  fs.mkdirSync(path.dirname(reviewAbs), { recursive: true });
  const reviewLines = [
    `# ${id} ${cfg.version} visual review`,
    '',
    'Decision: visual_review_passed',
    'Promotion status: monitor_required',
    '',
    cfg.finding,
    '',
    `Continuity: ${cfg.previous} -> ${id} -> ${cfg.next}`,
    `Constraint: ${cfg.constraint}`,
    `Reject gate: ${cfg.reject}`,
    '',
    'Exact reviewed frames:',
    `- START: ${frames.start}`,
    `- KEY: ${frames.key}`,
    `- END: ${frames.end}`,
    '',
    'The files were inspected at their exact project paths after copying from the image-generation cache. Prompt-against-frame QA and 3-second motion probes remain pending.'
  ];
  fs.writeFileSync(reviewAbs, `${reviewLines.join('\n')}\n`);
  for (const role of ['start', 'key', 'end']) {
    const sourcePath = cfg.cache[['start', 'key', 'end'].indexOf(role)];
    const outputPath = `episodes/EP03/${frames[role]}`;
    const outputAbs = path.join(ROOT, outputPath);
    if (!fs.existsSync(sourcePath)) throw new Error(`Missing cache output: ${sourcePath}`);
    if (!fs.existsSync(outputAbs)) throw new Error(`Missing copied frame: ${outputAbs}`);
    const sourceSha = sha256(sourcePath);
    const outputSha = sha256(outputAbs);
    const size = pngSize(outputAbs);
    if (sourceSha !== outputSha) throw new Error(`Cache/project hash mismatch for ${id} ${role}`);
    if (!existing.has(outputPath)) {
      receipts.receipts.push({
        shot_id: id,
        frame_role: role,
        path: outputPath,
        output_path: outputPath,
        source_path: sourcePath,
        tool_call_id: path.basename(sourcePath, '.png').replace(/^exec-/, 'exec-'),
        sha256: outputSha,
        source_sha256: sourceSha,
        output_sha256: outputSha,
        width: size.width,
        height: size.height,
        reviewer_role: 'independent-critical-reaudit-visual-qa-agent',
        reviewed_paths: [outputPath],
        review_markdown: reviewPath,
        decision: 'visual_review_passed',
        notes: `${cfg.version}: exact integrated live-action frame visually inspected; prompt QA and motion probe remain pending.`
      });
    }
  }
}
writeJson('production_system/generation_receipts.json', receipts);

const state = readJson('production_system/generation_state.json');
for (const item of state.queue || []) {
  const cfg = shots[item.shot_id];
  if (!cfg) continue;
  const frames = relFrames(item.shot_id, cfg);
  item.path = `episodes/EP03/${frames[item.frame_role]}`;
  item.status = 'visual_reviewed';
  item.reviewed = true;
}
state.last_updated = '2026-08-27';
state.status = 'partial';
state.stop_reason = 'motion_probe_pending; video_model_cli_not_configured';
state.review_state = 'current_025_v4_and_026_029_v6_frames_registered_with_exact_hashes; prompt_qa_and_motion_probe_pending';
writeJson('production_system/generation_state.json', state);

console.log(JSON.stringify({
  promoted: Object.keys(shots),
  versions: Object.fromEntries(Object.entries(shots).map(([id, cfg]) => [id, cfg.version])),
  receipt_count: receipts.receipts.length,
  review_dir: REVIEW_DIR
}, null, 2));
