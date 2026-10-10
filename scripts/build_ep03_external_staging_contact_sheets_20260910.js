#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const shotIds = ["Shot030", "Shot031", "Shot032", "Shot033", "Shot034", "Shot035", "Shot036"];
const base = path.join(repoRoot, "episodes/EP03/storyboards");
const rows = [];

function run(args) {
  const result = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr || `ffmpeg failed with status ${result.status}`);
  }
}

for (const shotId of shotIds) {
  const dir = path.join(base, shotId, "external_film_staging_reboard_v1_2026-09-10");
  const output = path.join(dir, "contact_sheet.jpg");
  const inputs = ["start_frame.png", "key_frame.png", "end_frame.png"].map((file) => path.join(dir, file));
  if (inputs.some((file) => !fs.existsSync(file))) throw new Error(`missing frame for ${shotId}`);
  const filter = [
    "[0:v]scale=600:338:force_original_aspect_ratio=decrease,pad=600:338:(ow-iw)/2:(oh-ih)/2:color=black[s0]",
    "[1:v]scale=600:338:force_original_aspect_ratio=decrease,pad=600:338:(ow-iw)/2:(oh-ih)/2:color=black[s1]",
    "[2:v]scale=600:338:force_original_aspect_ratio=decrease,pad=600:338:(ow-iw)/2:(oh-ih)/2:color=black[s2]",
    "[s0][s1][s2]hstack=inputs=3[out]",
  ].join(";");
  run([
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", inputs[0], "-i", inputs[1], "-i", inputs[2],
    "-filter_complex", filter, "-map", "[out]", "-q:v", "2", output,
  ]);
  rows.push(output);
}

const sequenceDir = path.join(repoRoot, "episodes/EP03/production_system/reviews/external_film_staging_reboard_2026-09-10");
fs.mkdirSync(sequenceDir, { recursive: true });
const sequenceOutput = path.join(sequenceDir, "sequence_handoff_030_036_current_contact_sheet.jpg");
const sequenceFilter = [
  ...rows.map((_, index) => `[${index}:v]scale=1800:338:force_original_aspect_ratio=decrease,pad=1800:338:(ow-iw)/2:(oh-ih)/2:color=black[r${index}]`),
  `${rows.map((_, index) => `[r${index}]`).join("")}vstack=inputs=${rows.length}[out]`,
].join(";");
run([
  "-hide_banner", "-loglevel", "error", "-y",
  ...rows.flatMap((file) => ["-i", file]),
  "-filter_complex", sequenceFilter, "-map", "[out]", "-q:v", "2", sequenceOutput,
]);

console.log(JSON.stringify({ shots: shotIds.length, contact_sheets: rows.length + 1, sequence_output: sequenceOutput }, null, 2));
