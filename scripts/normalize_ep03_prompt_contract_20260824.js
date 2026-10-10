const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROMPT_DIR = path.join(ROOT, 'episodes/EP03/video_prompts');
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, 'episodes/EP03/frame_generation_queue.json'), 'utf8'));
const delivery = JSON.parse(fs.readFileSync(path.join(ROOT, 'episodes/EP03/production_system/video_delivery_manifest.json'), 'utf8'));
const timeline = JSON.parse(fs.readFileSync(path.join(ROOT, 'planning/dialogue_timeline.json'), 'utf8'));
const timelineByShot = new Map((timeline.lines || []).map((line) => [line.shot_id, line]));
const deliveryByShot = new Map((delivery.shots || []).map((shot) => [shot.id, shot]));
const queueByShot = new Map((queue.shots || []).map((shot) => [shot.id, shot]));
const MARKER = '<!-- EP03_EXECUTION_CONTRACT_ADDENDUM_2026-08-24 -->';

function parseJapaneseLines(anchor, shotId) {
  const timelineLine = timelineByShot.get(shotId);
  if (timelineLine) return [{ speaker: timelineLine.speaker, lineId: timelineLine.id }];
  const value = String(anchor || '');
  if (!/Japanese|日本語|日文/i.test(value)) return [];
  return value
    .split(/(?<=[。！？])\s+(?=[A-Za-z]+, (?:softly )?in Japanese:)/u)
    .map((part) => part.match(/^(.+?), (?:softly )?in Japanese:\s*(.+)$/u))
    .filter(Boolean)
    .map((match, index) => ({ speaker: match[1], lineId: `DL-EP03-${shotId.slice(-3)}-${index + 1}` }));
}

function timingLines(shotId, duration, spokenLines) {
  if (!spokenLines.length) return [
    '- `dialogue_mode`: silent; no spoken dialogue, voiceover, narration, or invented reply.',
    '- `line_id`: none; this shot is carried by the environmental audio already specified above.',
    '- `single_continuous_utterance`: not applicable; keep the mouth still and do not create speech.',
    '- `repeat_policy`: no repeat, no echo, no stutter, no restart, and no added line.',
    '- `speech_end_cut_timing`: no speech is present; preserve the specified environmental tail and cut on the documented END handoff.'
  ];

  const exactTimeline = timelineByShot.get(shotId);
  if (exactTimeline) {
    return [
      `- \`line_id\`: \`${exactTimeline.id}\`; use the exact Japanese line already declared once in the existing Dialogue Timing / Delivery section.`,
      `- Shot-local speech window: ${exactTimeline.shot_local_start_seconds.toFixed(2)}-${exactTimeline.shot_local_speech_end_seconds.toFixed(2)}s; speech_seconds: ${exactTimeline.speech_seconds.toFixed(2)}s.`,
      `- \`speaker\`: ${exactTimeline.speaker}; listener/reaction: ${exactTimeline.listener_reaction}.`,
      '- `single_continuous_utterance`: speak the existing Japanese line once, continuously, without paraphrase.',
      '- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.',
      `- \`speech_end_cut_timing\`: the final syllable ends by ${exactTimeline.shot_local_speech_end_seconds.toFixed(2)}s; hold the named reaction before the ${exactTimeline.cut_on} cut.`
    ];
  }

  const start = Math.max(0.5, Number((duration * 0.28).toFixed(2)));
  const available = Math.max(1.1, Math.min(duration * 0.48, duration - start - 0.8));
  const slot = available / spokenLines.length;
  return spokenLines.flatMap((line, index) => {
    const speechStart = Number((start + index * slot).toFixed(2));
    const speechEnd = Number((speechStart + Math.max(0.6, slot * 0.82)).toFixed(2));
    const reactionEnd = Number(Math.min(duration - 0.2, speechEnd + 0.35).toFixed(2));
    return [
      `- \`line_id\`: \`${line.lineId}\`; ${line.speaker} owns the exact Japanese line already declared in the shot Audio section.`,
      `- Shot-local speech window: ${speechStart.toFixed(2)}-${speechEnd.toFixed(2)}s; speech_seconds: ${Math.max(0.6, slot * 0.82).toFixed(2)}s; listener reaction ends at ${reactionEnd.toFixed(2)}s.`,
      `- \`speaker_handoff\`: ${line.speaker} speaks once while the visible action continues; other listed performers listen and do not invent a reply.`,
      '- `single_continuous_utterance`: speak the exact Japanese line once, continuously, without paraphrase.',
      '- `repeat_policy`: no repeat, no echo, no stutter, no restart, no second take.',
      `- \`speech_end_cut_timing\`: let the final syllable settle before the documented reaction/action handoff at ${reactionEnd.toFixed(2)}s.`
    ];
  });
}

function addendum(shot, prompt, spokenLines) {
  const duration = Number(shot.duration_seconds || shot.duration || 0);
  const frames = shot.output_frames || {
    start: `storyboards/${shot.id}/start_frame.png`,
    key: `storyboards/${shot.id}/key_frame.png`,
    end: `storyboards/${shot.id}/end_frame.png`
  };
  const characters = Array.isArray(shot.characters) ? shot.characters.join(', ') : String(shot.characters || 'the listed performers');
  const location = shot.location || 'the established shot location';
  const next = shot.continuity_next || shot.next_shot || 'the next shot';
  const motion = 'Follow the existing shot-local Motion and Scene Beat sections above exactly. Use the uploaded START/KEY/END progression as the only action authority; do not import an older queue action or redesign the beat.';
  const camera = 'Follow the existing shot-local Camera section above exactly';
  const motionSentence = motion.endsWith('.') ? motion : `${motion}.`;
  return [
    MARKER,
    '',
    '## Canonical Execution Contract Addendum',
    '',
    'This addendum normalizes the upload contract without changing the existing shot design. The model receives only the uploaded START, KEY, and END images at generation time.',
    '',
    '## Shot ID',
    '',
    `Shot ID: ${shot.id}`,
    '',
    '## Duration',
    '',
    `Duration: ${duration} seconds.`,
    '',
    '## Input Frames',
    '',
    `- start_frame: uploaded START image; begin from the visible ${shot.id} pre-action state.`,
    `- key_frame: uploaded KEY image; reach the visible action/emotional peak without redesigning the shot.`,
    `- end_frame: uploaded END image; settle on the visible handoff state for ${next}.`,
    `- Preserve the current integrated live-action frames, shared scale, feet, contact shadows, wardrobe, and screen direction.`,
    '',
    '## Motion',
    '',
    `Animate the existing ${shot.id} action from START through KEY to END: ${motionSentence} Every change must be physical and visible; do not replace the chain with a lighting-only, crop-only, or frozen transition.`,
    'Keep listed props and weapons attached to the responsible performer, keep unlisted people out, and hold the final state long enough to make the cut readable.',
    '',
    '## Camera',
    '',
    `Use the established live-action camera intent: ${camera}. Preserve the uploaded axis, screen direction, location geography (${location}), and depth relationships. Do not spin, mirror, or hide the action peak.`,
    '',
    '## Performance',
    '',
    'Keep every named performer visibly present in the uploaded frames grounded through breath, eyeline, posture, hand contact, weight transfer, and restrained facial acting. Preserve the uploaded identity, academy/phase, gender presentation, wardrobe, face, hair, and weapon identity; do not add a performer from an older queue entry.',
    '',
    '## Audio',
    '',
    spokenLines.length
      ? 'Japanese spoken dialogue only for the exact line(s) already present in this shot\'s Audio section; preserve the environmental sound already specified. No Chinese/Mandarin voiceover and no burned-in subtitles or readable text.'
      : 'Environmental sound only as already specified in this shot; no spoken dialogue, voiceover, narration, Chinese/Mandarin speech, subtitles, or readable text.',
    '',
    '## Dialogue Timing / Delivery',
    '',
    ...timingLines(shot.id, duration, spokenLines),
    '',
    '## Continuity Locks',
    '',
    `- Receive the visible state in the uploaded START and hand the visible END state to ${next}; do not depend on unavailable filesystem or previous-shot context.`,
    '- Preserve identity, wardrobe, props, weather/light, floor contact, screen direction, relative distance, and emotional/action state across all three anchors.',
    '- The model must animate the uploaded frames rather than invent a new location, cast member, costume, weapon, or story beat.',
    '',
    '## Reject If',
    '',
    '- START, KEY, and END collapse into one pose, a lighting-only variant, a lineup, a game screenshot, or pasted/cutout plates.',
    '- any named identity, gender presentation, age/phase, costume, weapon, screen direction, or floor contact drifts.',
    '- Chinese/Mandarin speech, subtitles, captions, UI, watermarks, borders, black frames, duplicate performers, or unlisted named characters appear.',
    '- the motion invents a new attack, reply, prop, camera axis, or next-shot handoff not supported by the uploaded frames.',
    ''
  ].join('\n');
}

let changed = [];
for (let index = 1; index <= 29; index += 1) {
  const id = `Shot${String(index).padStart(3, '0')}`;
  const file = path.join(PROMPT_DIR, `${id}_prompt.md`);
  if (!fs.existsSync(file)) continue;
  let prompt = fs.readFileSync(file, 'utf8');
  prompt = prompt.replace(/^## Adjacent shot match$/gm, '## Adjacent continuity context');
  const shot = queueByShot.get(id) || deliveryByShot.get(id) || { id, duration_seconds: 0 };
  const spokenLines = parseJapaneseLines(deliveryByShot.get(id)?.audio_anchor, id);
  const basePrompt = prompt.includes(MARKER) ? prompt.split(MARKER)[0].trimEnd() : prompt.trimEnd();
  const nextPrompt = `${basePrompt}\n${addendum(shot, basePrompt, spokenLines)}`;
  if (nextPrompt !== prompt) {
    fs.writeFileSync(file, nextPrompt);
    changed.push({ id, spoken_lines: spokenLines.length, rewritten_addendum: prompt.includes(MARKER) });
  }
}

console.log(JSON.stringify({ changed, count: changed.length }, null, 2));
