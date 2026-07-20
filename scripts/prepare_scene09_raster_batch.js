const fs = require("fs");
const path = require("path");

const queuePath = "episodes/EP02/mock_battle_keyframe_production_queue_2026-07-17.json";
const payloadDir = "episodes/EP02/video_payloads_cinematic_v2_expanded_2026-07-16";
const payloadIndexPath = "episodes/EP02/video_payloads_cinematic_v2_expanded_2026-07-16.json";
const payloadJsonlPath = "episodes/EP02/video_payloads_cinematic_v2_expanded_2026-07-16.jsonl";
const productionDir = "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17";
const promptDir = path.join(productionDir, "prompts");
const p0BatchPath = path.join(productionDir, "p0_batch_manifest.json");
const p0BatchMdPath = path.join(productionDir, "p0_batch_manifest.md");

fs.mkdirSync(promptDir, { recursive: true });

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const scene09 = new Map(queue.map((entry) => [entry.shot, entry]));
const p0 = queue.filter((entry) => entry.priority === "P0");

function isBlockedSource(imagePath) {
  return /\.svg$/i.test(imagePath || "") || String(imagePath || "").includes("/p1_mock_battle_v1/");
}

function writePromptFiles(entry) {
  const content = [
    `# ${entry.shot} - ${entry.title}`,
    "",
    `Priority: ${entry.priority}`,
    `Status: ${entry.status}`,
    `Output keyframe: ${entry.output_keyframe}`,
    `Output start frame: ${entry.output_start_frame}`,
    "",
    "## Character Reference Assets",
    ...(entry.character_reference_assets || []).map((ref) => `- ${ref.name}: ${ref.asset} (${ref.continuity_note})`),
    "",
    "## Production Prompt",
    entry.production_prompt,
    "",
    "## Negative Prompt",
    entry.negative_prompt,
    "",
    "## Subframes",
    ...(entry.subframes || []).map((subframe) => [
      `### ${subframe.id} - ${subframe.title}`,
      "",
      subframe.description,
      "",
      `Output: ${subframe.output_keyframe}`,
    ].join("\n")),
    "",
  ].join("\n");
  const promptPath = path.join(promptDir, `${entry.shot}_prompt.md`);
  fs.writeFileSync(promptPath, content);
  return promptPath;
}

const promptPaths = new Map(queue.map((entry) => [entry.shot, writePromptFiles(entry)]));

function augmentPayload(payload) {
  const entry = scene09.get(payload.shot);
  if (!entry) return payload;
  const blocked = isBlockedSource(payload.image_path);
  return {
    ...payload,
    production_status: blocked ? "blocked_needs_production_raster" : "needs_scene09_raster_review",
    blocked_source_image_path: blocked ? payload.image_path : "",
    production_image_path: entry.output_start_frame,
    production_keyframe_path: entry.output_keyframe,
    production_prompt_file: promptPaths.get(payload.shot),
    character_reference_assets: entry.character_reference_assets || [],
    subframes: entry.subframes || [],
    production_acceptance_criteria: entry.acceptance_criteria || [],
    prompt: [
      payload.prompt,
      "",
      "Scene09 production gate: do not generate final video from the blocked source image if it is SVG or legacy training-yard raster. Use production_image_path after a real cinematic raster keyframe is generated and QA-approved.",
      "Character continuity gate: every named character must match the listed selected.png reference assets for face, hair, age, costume silhouette, and color accents.",
    ].join("\n"),
  };
}

for (const entry of queue) {
  const payloadPath = path.join(payloadDir, `${entry.shot}.json`);
  if (!fs.existsSync(payloadPath)) continue;
  const payload = JSON.parse(fs.readFileSync(payloadPath, "utf8"));
  fs.writeFileSync(payloadPath, `${JSON.stringify(augmentPayload(payload), null, 2)}\n`);
}

if (fs.existsSync(payloadIndexPath)) {
  const payloads = JSON.parse(fs.readFileSync(payloadIndexPath, "utf8"));
  const updated = payloads.map(augmentPayload);
  fs.writeFileSync(payloadIndexPath, `${JSON.stringify(updated, null, 2)}\n`);
  fs.writeFileSync(payloadJsonlPath, `${updated.map((item) => JSON.stringify(item)).join("\n")}\n`);
}

const manifest = {
  date: "2026-07-17",
  scope: "P0 Scene09 production raster keyframes. Generate these before any video run.",
  production_dir: productionDir,
  prompt_dir: promptDir,
  shots: p0.map((entry) => ({
    shot: entry.shot,
    title: entry.title,
    output_start_frame: entry.output_start_frame,
    output_keyframe: entry.output_keyframe,
    prompt_file: promptPaths.get(entry.shot),
    character_reference_assets: entry.character_reference_assets,
    subframes: entry.subframes,
  })),
};

const md = [
  "# Scene09 P0 Raster Batch Manifest",
  "",
  "Date: 2026-07-17",
  "",
  "Generate these 14 production raster keyframes before running any Scene09 video payload.",
  "",
  ...manifest.shots.flatMap((shot) => [
    `## ${shot.shot} - ${shot.title}`,
    "",
    `Prompt: \`${shot.prompt_file}\``,
    `Start frame target: \`${shot.output_start_frame}\``,
    `Keyframe target: \`${shot.output_keyframe}\``,
    "",
    "Character references:",
    ...shot.character_reference_assets.map((ref) => `- ${ref.name}: \`${ref.asset}\``),
    "",
    "Subframes:",
    ...shot.subframes.map((subframe) => `- ${subframe.id}: ${subframe.description}`),
    "",
  ]),
].join("\n");

fs.writeFileSync(p0BatchPath, `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(p0BatchMdPath, md);

console.log(`wrote prompts for ${queue.length} Scene09 shots`);
console.log(`wrote ${p0BatchPath}`);
console.log(`wrote ${p0BatchMdPath}`);
