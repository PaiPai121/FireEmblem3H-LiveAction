const fs = require("fs");
const path = require("path");

const root = process.cwd();
const epRoot = path.join(root, "episodes", "EP03");
const queue = JSON.parse(fs.readFileSync(path.join(epRoot, "frame_generation_queue.json"), "utf8"));

for (const shot of queue.shots) {
  const promptFile = path.join(epRoot, "video_prompts", shot.id + "_prompt.md");
  let text = fs.readFileSync(promptFile, "utf8");
  const silent = /no spoken dialogue/i.test(shot.audio_anchor || "");
  let lines = text.split(/\r?\n/).filter((line) => {
    if (/assets\/|storyboards\/|source_refs\/|frame_spec|video_prompts\//.test(line)) return false;
    if (/source layout reference|local path|previous shot|external reference at generation time/i.test(line)) return false;
    if (silent && /Use Japanese speech|Japanese spoken dialogue|spoken dialogue and natural/i.test(line)) return false;
    return true;
  });
  text = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  const contract = [
    "## Upload-only contract",
    "",
    "Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use any local path, source image, screenshot, storyboard note, or external reference at generation time.",
    "",
    "The uploaded frames must remain physically integrated live-action imagery with shared scale, contact shadows, perspective, and lighting. Do not paste portraits onto a background. START, KEY, and END must be visibly different action states, not lighting, crop, or texture variants of one still.",
    "",
    shot.characters && shot.characters.includes("Byleth")
      ? "If Byleth is visible, use female academy Byleth only throughout: adult woman, teal-blue hair, dark professor coat. No male, ambiguous, or war-phase Byleth."
      : "Do not add a named character that is absent from the uploaded frames."
  ].join("\n");
  if (!/Upload exactly three images and label them START, KEY, and END/i.test(text)) {
    text = text.replace(/^(# [^\n]+)\n?/, "$1\n\n" + contract + "\n");
  } else {
    text = text.replace(/## Upload-only contract[\s\S]*?(?=\n## |\n# |$)/, contract);
  }
  const audio = silent
    ? "## Audio lock\n\nNo spoken dialogue in this shot. Use only the environmental sounds specified by the shot beat. Do not invent narration, voiceover, subtitles, captions, or readable text."
    : "## Audio lock\n\nAll spoken dialogue in this shot must be Japanese only, using the exact Japanese line(s) already specified by the shot beat. Do not generate Chinese or Mandarin voiceover. Do not burn in subtitles, captions, dialogue boxes, or readable text.";
  if (!/## Audio lock/.test(text)) text += "\n\n" + audio;
  fs.writeFileSync(promptFile, text.trim() + "\n");
}
console.log(JSON.stringify({sanitized: queue.shots.length, silent: queue.shots.filter((shot) => /no spoken dialogue/i.test(shot.audio_anchor || "")).map((shot) => shot.id)}, null, 2));

