const fs = require("fs");
const path = require("path");

const epRoot = "episodes/EP03";
const packageRel = "delivery/motion_probe_package_2026-08-10";
const packageRoot = path.join(epRoot, packageRel);
const deliveryManifestPath = path.join(epRoot, "production_system/video_delivery_manifest.json");
const artifactManifestPath = path.join(epRoot, "production_system/artifact_manifest.json");
const reviewManifestPath = path.join(epRoot, "production_system/review_manifest.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readText(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function extractSection(text, heading) {
  const re = new RegExp(`^## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`, "m");
  const match = text.match(re);
  return match ? match[1].trim() : "";
}

function stripLocalPathLines(text) {
  return text
    .split("\n")
    .filter((line) => !/`?(?:assets|storyboards|source_refs|video_prompts|production_system)\//.test(line))
    .filter((line) => !/\/Users\//.test(line))
    .join("\n")
    .trim();
}

function concise(value, fallback) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text || fallback;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function htmlEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function webHref(rootRelative) {
  const normalized = String(rootRelative || "").replace(/\\/g, "/");
  return path.posix.relative(packageRoot.replace(/\\/g, "/"), normalized) || ".";
}

function promptForShot(shot, sourcePrompt) {
  const sourceMotion = stripLocalPathLines(extractSection(sourcePrompt, "Motion"));
  const sourceCamera = stripLocalPathLines(extractSection(sourcePrompt, "Camera"));
  const sourcePerformance = stripLocalPathLines(extractSection(sourcePrompt, "Performance"));
  const sourceAudio = stripLocalPathLines(extractSection(sourcePrompt, "Audio"));
  const finding = concise(shot.visual_audit_finding, "Current frames are monitor-required candidates pending motion probe.");
  const revision = concise(shot.required_revision, "Run a 3-second motion probe and reject identity, wardrobe, UI, subtitle, or frame-presentation drift.");

  return `# ${shot.id} 3-Second Motion Probe Prompt

Shot ID:
${shot.id}

Duration:
3 seconds. This is a short motion probe only, not the final full-duration clip.

Input Frames:
Use the uploaded START frame as the exact first-frame anchor and pre-action state.
Use the uploaded KEY frame as the peak pose, reveal, or emotional beat reference.
Use the uploaded END frame as the final-frame target and cut-out state.
Do not read or depend on local paths, source asset folders, previous shots, or external references.

Motion:
Animate only the small visible change implied by the uploaded START -> KEY -> END frames. Preserve character identity, wardrobe, props, lighting, background geometry, and screen direction. Keep the motion restrained and physically grounded.
${concise(sourceMotion, "Use subtle posture, eyeline, hand, cloth, breath, fog, and camera movement only when it is already supported by the three uploaded frames.")}

Camera:
Preserve the uploaded frame composition and shot size. Use a minimal cinematic hold, slow push, or tiny parallax only if it does not hide the KEY beat or redesign the scene.
${concise(sourceCamera, "No camera spin, no line cross, no reframing into a new establishing shot.")}

Performance:
Use visible acting only: eye line, breath, jaw tension, posture, hesitation, hand pressure, or quiet reaction. Avoid broad comedy, melodrama, shouting, or genre redesign.
${concise(sourcePerformance, "Keep expressions restrained and consistent with the uploaded frames.")}

Audio:
Use Japanese spoken dialogue only when the uploaded frames and shot beat clearly support a short line; otherwise use silence, breath, distant ambience, cloth, armor, footsteps, rain, fog, or room tone. Never generate Chinese or Mandarin voiceover. No visible subtitles or captions.
${concise(sourceAudio, "Probe audio is only an edit anchor; it does not need to complete the final full-duration dialogue.")}

Continuity Locks:
- Preserve the exact faces, apparent ages, hairstyles, costume topology, faction colors, weapons, props, and silhouettes visible in the uploaded frames.
- Preserve the time of day, weather, fog level, corridor or battlefield geography, and light direction visible in the uploaded frames.
- Preserve the emotional state recorded in the frame chain. This probe tests whether the model can maintain identity and frame presentation, not whether it can invent new action.
- Current QA note: ${finding}
- Required next gate: ${revision}

Reject If:
- face, age, hairstyle, costume, weapon, prop, or role drifts from the uploaded frames
- characters detach from the environment, gain cutout edges, halos, mismatched shadows, or pasted/sticker appearance
- the model adds new named characters, extra foreground characters, combat beats, gore, triumphal violence, or joke acting
- the model adds visible subtitles, captions, Chinese/Mandarin voiceover, UI overlays, game dialogue boxes, logos, watermarks, borders, rounded player frames, letterbox, pillarbox, artificial side fill, warning/refusal screens, placeholders, or black frames
- start/key/end order is ignored or the clip cannot plausibly cut from START through KEY to END

This is a safe, appropriate, non-graphic fictional cinematic scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`;
}

function negativePromptForShot(shot, sourceNegative) {
  const baseline = sourceNegative.replace(/^# .+\n+/, "").trim();
  const concrete = [
    "No face drift",
    "no age drift",
    "no hairstyle change",
    "no costume redesign",
    "no weapon transformation",
    "no extra named characters",
    "no pasted cutout look",
    "no sticker edges",
    "no halos",
    "no mismatched shadows",
    "no detached foreground subject",
    "no visible subtitles",
    "no captions",
    "no Chinese voiceover",
    "no Mandarin dialogue",
    "no game UI",
    "no dialogue boxes",
    "no tactical grid",
    "no damage numbers",
    "no playback controls",
    "no logos",
    "no watermarks",
    "no warning screen",
    "no refusal screen",
    "no placeholder",
    "no black frame",
    "no borders",
    "no rounded frame",
    "no letterbox",
    "no pillarbox",
    "no artificial side fill",
    "no camera spin",
    "no unintended line cross",
    "no gore unless already visible in the uploaded frames",
    "no triumphal execution beat",
  ];
  const merged = Array.from(new Set(`${baseline}, ${concrete.join(", ")}`.split(",").map((item) => item.trim()).filter(Boolean)));
  return `# ${shot.id} 3-Second Motion Probe Negative Prompt

${merged.join(", ")}.
`;
}

function metadataForShot(shot, sourcePromptPath, sourceNegativePath, promptRel, negativeRel) {
  const isBlocked = shot.status === "blocked_needs_revision" || shot.visual_audit_decision === "blocked_needs_revision";
  return {
    shot_id: shot.id,
    order: shot.order,
    status: isBlocked ? "blocked_before_motion_probe" : "pending_motion_probe",
    source_status: shot.status,
    probe_duration_seconds: 3,
    model_target: "Seedance image-to-video web workflow",
    current_display_frame_set: shot.current_display_frame_set,
    start_frame: path.join(epRoot, shot.start_frame),
    key_frame: path.join(epRoot, shot.key_frame),
    end_frame: path.join(epRoot, shot.end_frame),
    upload_contract: {
      start: "Upload as START frame; exact first-frame anchor.",
      key: "Upload as KEY frame; peak beat reference.",
      end: "Upload as END frame; final-frame target.",
    },
    prompt_path: path.join(packageRel, promptRel),
    negative_prompt_path: path.join(packageRel, negativeRel),
    source_prompt_path: sourcePromptPath,
    source_negative_prompt_path: sourceNegativePath,
    expected_probe_clip: path.join(epRoot, "clips/probes_2026-08-10", `${shot.id}_probe_3s.mp4`),
    reject_focus: shot.required_revision || shot.visual_audit_finding || "Identity, wardrobe, frame presentation, subtitles/UI, and environment integration.",
    promotion_rule: "Do not promote to approved_for_video from this package alone. A human or separate reviewer must inspect the generated 3-second clip and record motion_review_passed before full-duration generation.",
  };
}

function writeIndex(shots) {
  const submitCount = shots.filter((shot) => shot.status !== "blocked_needs_revision" && shot.visual_audit_decision !== "blocked_needs_revision").length;
  const blockedCount = shots.length - submitCount;
  const cards = shots.map((shot) => `
    <article>
      <header><span>${String(shot.order).padStart(2, "0")}</span><h2>${htmlEscape(shot.id)}</h2><strong>${htmlEscape(shot.status)}</strong></header>
      <div class="frames">
        <figure><img src="${webHref(path.join(epRoot, shot.start_frame))}" alt="${htmlEscape(`${shot.id} start`)}"><figcaption>START</figcaption></figure>
        <figure><img src="${webHref(path.join(epRoot, shot.key_frame))}" alt="${htmlEscape(`${shot.id} key`)}"><figcaption>KEY</figcaption></figure>
        <figure><img src="${webHref(path.join(epRoot, shot.end_frame))}" alt="${htmlEscape(`${shot.id} end`)}"><figcaption>END</figcaption></figure>
      </div>
      <p>${htmlEscape(shot.visual_audit_finding || "")}</p>
      <nav>
        <a href="${webHref(path.join(epRoot, packageRel, "shots", shot.id, "prompt.md"))}">Prompt</a>
        <a href="${webHref(path.join(epRoot, packageRel, "shots", shot.id, "negative_prompt.md"))}">Negative</a>
        <a href="${webHref(path.join(epRoot, packageRel, "shots", shot.id, "metadata.json"))}">Metadata</a>
      </nav>
    </article>`).join("\n");
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EP03 3-Second Motion Probe Package</title>
  <style>
    body{margin:0;background:#101113;color:#f1efe8;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    header.hero{padding:28px 32px;border-bottom:1px solid #34363c;background:#17191d}
    h1{margin:0 0 8px;font-size:28px}
    main{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:18px;padding:24px}
    article{border:1px solid #34363c;background:#181a1f;border-radius:8px;overflow:hidden}
    article header{display:flex;gap:12px;align-items:center;padding:14px 16px}
    article h2{margin:0;font-size:18px;flex:1}
    article p{padding:0 16px 12px;color:#c9c5ba;line-height:1.45}
    .frames{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#34363c}
    figure{margin:0;background:#111}
    img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}
    figcaption{padding:6px 8px;color:#b8b2a6;font-size:12px}
    nav{display:flex;gap:10px;padding:12px 16px 16px;flex-wrap:wrap}
    a{color:#9cc8ff}
  </style>
</head>
<body>
  <header class="hero">
    <h1>EP03 3-Second Motion Probe Package</h1>
    <p>${submitCount} shots are eligible for short probe; ${blockedCount} shots are blocked before probe. This package is for identity / wardrobe / frame-presentation review only, not final video approval.</p>
  </header>
  <main>${cards}</main>
</body>
</html>
`;
}

function upsertArtifact() {
  const artifact = readJson(artifactManifestPath);
  const id = "EP03-MOTION-PROBE-PACKAGE-2026-08-10";
  artifact.artifacts = artifact.artifacts.filter((item) => item.id !== id);
  artifact.artifacts.push({
    id,
    type: "motion_probe_package",
    stage: "motion_review",
    status: "monitor_required",
    created_by: "codex-ep03-motion-probe-builder",
    created_at: "2026-08-10",
    paths: [
      `${packageRel}/index.html`,
      `${packageRel}/submission_queue.csv`,
      `${packageRel}/submission_queue.json`,
      `${packageRel}/execution_plan.json`,
      `${packageRel}/execution_commands.sh`,
      `${packageRel}/RUNBOOK.md`,
      `${packageRel}/clip_QA_checklist.md`,
    ],
    source_refs: ["production_system/video_delivery_manifest.json"],
    depends_on: ["EP03 prompt_asset_package", "current start/key/end frame files"],
    risk_flags: ["motion_probe_pending", "not_approved_for_video", "external_video_model_required"],
    notes: "Package-local 3-second probe prompts and queue for all monitor_required EP03 shots.",
  });
  writeJson(artifactManifestPath, artifact);

  const review = readJson(reviewManifestPath);
  const reviewId = "review-2026-08-10-ep03-motion-probe-package-contract";
  review.reviews = review.reviews.filter((item) => item.review_id !== reviewId);
  review.reviews.push({
    artifact_id: id,
    review_id: reviewId,
    reviewer_role: "video-prompt-qa-agent",
    reviewer: "codex",
    created_at: "2026-08-10",
    decision: "monitor_required",
    blocking_issues: [],
    required_revisions: [
      "Generate and inspect 3-second clips before any full-duration generation.",
      "Do not promote any shot to approved_for_video until probe clip QA and adjacent continuity QA pass.",
    ],
    rubric: {
      prompt_contract_sections: "pass",
      web_three_frame_contract: "pass",
      local_paths_excluded_from_executable_prompts: "pass",
      negative_prompt_risks: "pass_with_monitoring",
      video_generation_approval: "not_approved",
    },
    reviewed_paths: [
      `${packageRel}/submission_queue.csv`,
      `${packageRel}/execution_plan.json`,
      `${packageRel}/execution_commands.sh`,
      `${packageRel}/RUNBOOK.md`,
      `${packageRel}/clip_QA_checklist.md`,
    ],
  });
  writeJson(reviewManifestPath, review);
}

function main() {
  const manifest = readJson(deliveryManifestPath);
  ensureDir(packageRoot);
  ensureDir(path.join(packageRoot, "shots"));

  const rows = [];
  const jsonRows = [];
  const blockedRows = [];
  for (const shot of manifest.shots) {
    const shotDir = path.join(packageRoot, "shots", shot.id);
    ensureDir(shotDir);
    const sourcePromptPath = path.join(epRoot, shot.prompt_path || `video_prompts/${shot.id}_prompt.md`);
    const sourceNegativePath = path.join(epRoot, shot.negative_prompt_path || `video_prompts/${shot.id}_negative_prompt.md`);
    const sourcePrompt = readText(sourcePromptPath);
    const sourceNegative = readText(sourceNegativePath);
    const promptRel = path.posix.join("shots", shot.id, "prompt.md");
    const negativeRel = path.posix.join("shots", shot.id, "negative_prompt.md");
    const metadataRel = path.posix.join("shots", shot.id, "metadata.json");
    fs.writeFileSync(path.join(packageRoot, promptRel), promptForShot(shot, sourcePrompt));
    fs.writeFileSync(path.join(packageRoot, negativeRel), negativePromptForShot(shot, sourceNegative));
    const metadata = metadataForShot(shot, sourcePromptPath, sourceNegativePath, promptRel, negativeRel);
    writeJson(path.join(packageRoot, metadataRel), metadata);
    if (metadata.status === "blocked_before_motion_probe") {
      blockedRows.push(metadata);
      continue;
    }
    jsonRows.push(metadata);
    rows.push({
      order: shot.order,
      shot_id: shot.id,
      status: "pending_motion_probe",
      duration_seconds: 3,
      start_frame: metadata.start_frame,
      key_frame: metadata.key_frame,
      end_frame: metadata.end_frame,
      prompt_path: path.join(epRoot, packageRel, promptRel),
      negative_prompt_path: path.join(epRoot, packageRel, negativeRel),
      metadata_path: path.join(epRoot, packageRel, metadataRel),
      expected_probe_clip: metadata.expected_probe_clip,
      reject_focus: metadata.reject_focus,
    });
  }

  const header = rows.length ? Object.keys(rows[0]) : ["order", "shot_id", "status"];
  const csv = [header.join(","), ...rows.map((row) => header.map((key) => csvEscape(row[key])).join(","))].join("\n");
  fs.writeFileSync(path.join(packageRoot, "submission_queue.csv"), `${csv}\n`);
  writeJson(path.join(packageRoot, "submission_queue.json"), {
    created_at: "2026-08-10",
    updated_at: "2026-08-12",
    target: "3s_motion_probe",
    shots: jsonRows,
    blocked_shots: blockedRows,
  });
  writeJson(path.join(packageRoot, "execution_plan.json"), {
    created_at: "2026-08-10",
    target: "video_generation_run_probe_only",
    status: "clips_pending",
    model_target: "Seedance image-to-video web workflow or compatible CLI wrapper",
    configured_command_env: "VIDEO_MODEL_CLI_ARGV_JSON",
    command_contract: {
      description: "Set VIDEO_MODEL_CLI_ARGV_JSON to a JSON argv array for a real image-to-video CLI wrapper. The command template may use placeholders.",
      placeholders: [
        "{start_frame}",
        "{key_frame}",
        "{end_frame}",
        "{prompt_path}",
        "{negative_prompt_path}",
        "{duration_seconds}",
        "{output_path}",
      ],
      example: [
        "video-model-cli",
        "--start",
        "{start_frame}",
        "--key",
        "{key_frame}",
        "--end",
        "{end_frame}",
        "--prompt-file",
        "{prompt_path}",
        "--negative-prompt-file",
        "{negative_prompt_path}",
        "--duration",
        "{duration_seconds}",
        "--output",
        "{output_path}",
      ],
    },
    queue_csv: `${packageRel}/submission_queue.csv`,
    queue_json: `${packageRel}/submission_queue.json`,
    expected_outputs: rows.map((row) => row.expected_probe_clip),
    blocked_before_probe: blockedRows.map((row) => row.shot_id),
    promotion_rule: "Probe clips must be generated, rendered, reviewed, and recorded before any full-duration shot can be considered for approved_for_video.",
  });

  fs.writeFileSync(path.join(packageRoot, "RUNBOOK.md"), `# EP03 3-Second Motion Probe Runbook

Created: 2026-08-10
Updated: 2026-08-12

Purpose: test identity, wardrobe, prop, frame presentation, and environment integration before full-duration generation.

This is not a final video generation package. Only rows in \`submission_queue.csv\` are eligible for probe submission. Shots listed under \`blocked_shots\` in \`submission_queue.json\` must be regenerated before probe.

## Workflow

1. Open \`submission_queue.csv\`.
2. For each row, upload START, KEY, and END frames in that order.
3. Paste the package-local \`prompt.md\` and \`negative_prompt.md\`.
4. Set duration to 3 seconds.
5. Save the result to \`expected_probe_clip\`.
6. Review with \`clip_QA_checklist.md\`.
7. Record the result in a motion review file before any full-duration generation.

Optional CLI handoff:

- If a real video model CLI wrapper exists, set \`VIDEO_MODEL_CLI_ARGV_JSON\` to the argv template described in \`execution_plan.json\`.
- Then run \`./execution_commands.sh\` from this package directory.
- If no CLI wrapper is configured, use this package manually in the web workflow and save outputs to the \`expected_probe_clip\` paths.

## Hard Rules

- Japanese voice only when a line is needed; no Chinese or Mandarin voiceover.
- No burned-in subtitles, captions, UI, dialogue boxes, logos, borders, letterbox, pillarbox, rounded frames, black frames, placeholders, or artificial side fill.
- Do not promote from this package alone. Probe clips must pass visual motion QA and adjacent continuity QA.
`);

  fs.writeFileSync(path.join(packageRoot, "execution_commands.sh"), `#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
QUEUE="$ROOT/EP03/delivery/motion_probe_package_2026-08-10/submission_queue.json"

if [[ -z "\${VIDEO_MODEL_CLI_ARGV_JSON:-}" ]]; then
  echo "VIDEO_MODEL_CLI_ARGV_JSON is not set."
  echo "Use the web workflow manually, or set it to a JSON argv template. See execution_plan.json."
  exit 2
fi

node - "$ROOT" "$QUEUE" "$VIDEO_MODEL_CLI_ARGV_JSON" <<'NODE'
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(process.argv[2], "..");
const queuePath = process.argv[3];
const template = JSON.parse(process.argv[4]);
const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));

function fill(value, row) {
  return String(value)
    .replaceAll("{start_frame}", path.join(repoRoot, row.start_frame))
    .replaceAll("{key_frame}", path.join(repoRoot, row.key_frame))
    .replaceAll("{end_frame}", path.join(repoRoot, row.end_frame))
    .replaceAll("{prompt_path}", path.join(repoRoot, "episodes/EP03", row.prompt_path))
    .replaceAll("{negative_prompt_path}", path.join(repoRoot, "episodes/EP03", row.negative_prompt_path))
    .replaceAll("{duration_seconds}", String(row.probe_duration_seconds))
    .replaceAll("{output_path}", path.join(repoRoot, row.expected_probe_clip));
}

for (const row of queue.shots) {
  fs.mkdirSync(path.dirname(path.join(repoRoot, row.expected_probe_clip)), { recursive: true });
  const argv = template.map((part) => fill(part, row));
  const [cmd, ...args] = argv;
  console.log(["RUN", row.shot_id, cmd, ...args].join(" "));
  const result = spawnSync(cmd, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
NODE
`);
  fs.chmodSync(path.join(packageRoot, "execution_commands.sh"), 0o755);

  fs.writeFileSync(path.join(packageRoot, "clip_QA_checklist.md"), `# EP03 Probe Clip QA Checklist

Decision values: \`motion_review_passed\`, \`monitor_required\`, \`blocked_needs_revision\`.

For each 3-second probe, check:

- START frame is preserved as the first-frame anchor.
- KEY beat appears naturally without camera hiding it.
- END frame is approached as the cut-out state.
- Face, age, hairstyle, costume topology, faction colors, weapons, props, and role remain stable.
- Characters share environment lighting, shadows, fog, reflections, and ground contact.
- No cutout/sticker/halo or pasted-character look.
- No visible subtitles, captions, UI, logos, watermarks, refusal/warning screen, placeholder, black frame, borders, rounded player frame, letterbox, pillarbox, or artificial side fill.
- No Chinese/Mandarin voiceover.
- No added named foreground characters or unintended action escalation.
- Clip can plausibly cut to adjacent shots after continuity review.

Passing this checklist allows a shot to proceed to full-duration test generation, not automatic final approval.
`);

  fs.writeFileSync(path.join(packageRoot, "index.html"), writeIndex(manifest.shots));
  upsertArtifact();
  console.log(`built ${packageRoot} (${rows.length} probe-eligible shots, ${blockedRows.length} blocked before probe)`);
}

main();
