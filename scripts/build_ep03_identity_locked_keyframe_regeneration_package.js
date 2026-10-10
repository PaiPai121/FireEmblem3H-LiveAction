const fs = require("fs");
const path = require("path");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const packageRel = "delivery/identity_locked_keyframe_regeneration_2026-08-01";
const packageRoot = path.join(epRoot, packageRel);

const queuePath = path.join(epRoot, "frame_generation_queue.json");
const deliveryPath = path.join(epRoot, "production_system/video_delivery_manifest.json");
const artifactManifestPath = path.join(epRoot, "production_system/artifact_manifest.json");
const reviewManifestPath = path.join(epRoot, "production_system/review_manifest.json");
const localIdentityPlateIndexPath = path.join(epRoot, "production_system/reviews/local_identity_plates_2026-08-01/index.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function upsertBy(items, key, item) {
  const index = items.findIndex((candidate) => candidate[key] === item[key]);
  if (index === -1) items.push(item);
  else items[index] = item;
}

function rootPath(epRelative) {
  return path.join(epRoot, epRelative);
}

const localIdentityPlateIndex = fs.existsSync(localIdentityPlateIndexPath)
  ? readJson(localIdentityPlateIndexPath)
  : { atlas: "", plates: [] };
const localIdentityPlateByAsset = new Map((localIdentityPlateIndex.plates || []).map((plate) => [plate.asset, plate]));

function localIdentityPlatesForAssets(assetReferences) {
  return (assetReferences || [])
    .filter((asset) => asset.includes("/characters/"))
    .map((asset) => localIdentityPlateByAsset.get(asset))
    .filter(Boolean)
    .map((plate) => ({
      character_id: plate.character_id,
      asset: plate.asset,
      plate: plate.plate,
      status: plate.status || "layout_reference",
    }));
}

function roleIntent(frameSpec, role) {
  const labels = {
    start: "Start Frame Intent",
    key: "Key Frame Intent",
    end: "End Frame Intent",
  };
  const match = frameSpec.match(new RegExp(`^${labels[role]}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

function section(frameSpec, label) {
  const match = frameSpec.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

function localProofPath(shotId) {
  return rootPath(`production_system/reviews/local_asset_previs_proof_2026-07-31/${shotId}_local_asset_previs_proof_2026-07-31.jpg`);
}

function identityComparisonPath(shotId) {
  return rootPath(`production_system/reviews/identity_lock_comparison_2026-07-31/${shotId}_identity_comparison_2026-07-31.jpg`);
}

function imagegenCandidatePaths(shotId) {
  const base = rootPath(`storyboards/${shotId}`);
  const paths = {
    start: path.join(base, "start_frame_imagegen_candidate_2026-07-29.png"),
    key: path.join(base, "key_frame_imagegen_candidate_2026-07-29.png"),
    end: path.join(base, "end_frame_imagegen_candidate_2026-07-29.png"),
    contact_sheet: path.join(base, "imagegen_frameset_contact_sheet_2026-07-29.jpg"),
  };
  return Object.fromEntries(Object.entries(paths).filter(([, file]) => fs.existsSync(file)));
}

function identityLockedProbePaths(shotId) {
  const paths = {
    key_probe: rootPath(`storyboards/${shotId}/key_frame_identity_locked_probe_2026-08-01.png`),
    review_sheet: rootPath(`production_system/reviews/${shotId.toLowerCase()}_identity_locked_probe_2026-08-01.jpg`),
  };
  return Object.fromEntries(Object.entries(paths).filter(([, file]) => fs.existsSync(file)));
}

function identityRegenCandidatePaths(shotId, order) {
  const shotDirName = `${String(order).padStart(3, "0")}_${shotId}`;
  const localAssetDir = path.join(packageRoot, "shots", shotDirName, "local_asset_locked_regen_v1_2026-08-01");
  const localAssetPaths = {
    start: path.join(localAssetDir, "start_frame_local_asset_locked_regen_v1_2026-08-01.png"),
    key: path.join(localAssetDir, "key_frame_local_asset_locked_regen_v1_2026-08-01.png"),
    end: path.join(localAssetDir, "end_frame_local_asset_locked_regen_v1_2026-08-01.png"),
    review_sheet: rootPath(`production_system/reviews/${shotId.toLowerCase()}_local_asset_locked_regen_v1_review_2026-08-01.jpg`),
    review_markdown: rootPath(`production_system/reviews/${shotId.toLowerCase()}_local_asset_locked_regen_v1_review_2026-08-01.md`),
  };
  if (["start", "key", "end"].every((role) => fs.existsSync(localAssetPaths[role]))) {
    return Object.fromEntries(Object.entries(localAssetPaths).filter(([, file]) => fs.existsSync(file)));
  }
  const v3Dir = path.join(packageRoot, "shots", shotDirName, "local_source_locked_regen_v3_2026-08-01");
  const v3Paths = {
    start: path.join(v3Dir, "start_frame_local_source_locked_regen_v3_2026-08-01.png"),
    key: path.join(v3Dir, "key_frame_local_source_locked_regen_v3_2026-08-01.png"),
    end: path.join(v3Dir, "end_frame_local_source_locked_regen_v3_2026-08-01.png"),
    review_sheet: rootPath(`production_system/reviews/${shotId.toLowerCase()}_local_source_locked_regen_v3_review_2026-08-01.jpg`),
    review_markdown: rootPath(`production_system/reviews/${shotId.toLowerCase()}_local_source_locked_regen_v3_review_2026-08-01.md`),
  };
  if (["start", "key", "end"].every((role) => fs.existsSync(v3Paths[role]))) {
    return Object.fromEntries(Object.entries(v3Paths).filter(([, file]) => fs.existsSync(file)));
  }
  const v2Paths = {
    start: path.join(packageRoot, "shots", shotDirName, "start_frame_identity_locked_regen_v2_2026-08-01.png"),
    key: path.join(packageRoot, "shots", shotDirName, "key_frame_identity_locked_regen_v2_2026-08-01.png"),
    end: path.join(packageRoot, "shots", shotDirName, "end_frame_identity_locked_regen_v2_2026-08-01.png"),
    review_sheet: rootPath(`production_system/reviews/${shotId.toLowerCase()}_identity_locked_regen_v2_review_2026-08-01.jpg`),
    review_markdown: rootPath(`production_system/reviews/${shotId.toLowerCase()}_identity_locked_regen_v2_review_2026-08-01.md`),
  };
  if (["start", "key", "end"].every((role) => fs.existsSync(v2Paths[role]))) {
    return Object.fromEntries(Object.entries(v2Paths).filter(([, file]) => fs.existsSync(file)));
  }
  const paths = {
    start: path.join(packageRoot, "shots", shotDirName, "start_frame_identity_locked_regen_2026-08-01.png"),
    key: path.join(packageRoot, "shots", shotDirName, "key_frame_identity_locked_regen_2026-08-01.png"),
    end: path.join(packageRoot, "shots", shotDirName, "end_frame_identity_locked_regen_2026-08-01.png"),
    review_sheet: rootPath(`production_system/reviews/${shotId.toLowerCase()}_identity_locked_regen_review_2026-08-01.jpg`),
    review_markdown: rootPath(`production_system/reviews/${shotId.toLowerCase()}_identity_locked_regen_review_2026-08-01.md`),
  };
  return Object.fromEntries(Object.entries(paths).filter(([, file]) => fs.existsSync(file)));
}

function generationStatusFor(regeneratedCandidates) {
  const frameCount = ["start", "key", "end"].filter((role) => regeneratedCandidates[role]).length;
  if (frameCount === 3 && regeneratedCandidates.review_markdown) {
    const review = readText(regeneratedCandidates.review_markdown);
    if (/Decision:\s*visual_review_passed/.test(review)) return "candidate_frames_generated_visual_review_passed";
    return "candidate_frames_generated_blocked_needs_revision";
  }
  if (frameCount === 3) return "candidate_frames_generated_pending_visual_qa";
  if (frameCount > 0) return "partial_candidate_frames_generated";
  return "frames_pending";
}

function revisedPromptPaths(shotId, order) {
  const shotDirName = `${String(order).padStart(3, "0")}_${shotId}`;
  const shotDir = path.join(packageRoot, "shots", shotDirName);
  const paths = {
    start_prompt: path.join(shotDir, "start_frame_prompt_v2_2026-08-01.md"),
    key_prompt: path.join(shotDir, "key_frame_prompt_v2_2026-08-01.md"),
    end_prompt: path.join(shotDir, "end_frame_prompt_v2_2026-08-01.md"),
    video_prompt: path.join(shotDir, "video_prompt_v2_2026-08-01.md"),
    negative_prompt: path.join(shotDir, "negative_prompt_v2_2026-08-01.md"),
  };
  return Object.fromEntries(Object.entries(paths).filter(([, file]) => fs.existsSync(file)));
}

function buildNegativePrompt(shot, metadata, deliveryShot) {
  const names = (metadata.characters || []).join(", ");
  const localAssets = (metadata.asset_references || []).filter((asset) => asset.includes("/characters/")).join("; ");
  const rejected = [
    "No subtitles, captions, visible text, UI, dialogue boxes, damage numbers, health bars, tactical grid, playback controls, rounded player frame, letterbox side-fill artifacts.",
    "No generic medieval extras replacing named characters.",
    "No face drift, age drift, ethnicity drift, hairstyle drift, body-type drift, wardrobe topology drift, emblem drift, weapon or prop drift.",
    "No war-phase costumes, adult-soldier redesigns, robes replacing academy uniforms, casual clothes, pajamas, armor swaps, modern clothing, modern weapons, firearms.",
    "No anime screencap look, chibi proportions, meme expressions, giant mouth acting, bug eyes, overacting, graphic gore, celebratory execution.",
  ];
  return `# ${shot.id} Identity-Locked Negative Prompt

Named characters: ${names || "none"}
Required character assets: ${localAssets || "none"}

${rejected.map((item) => `- ${item}`).join("\n")}

Shot-specific reject-if:
${(deliveryShot.reject_if || []).map((item) => `- ${item}`).join("\n") || "- Reject if the frame contradicts the frame spec, source layout, local proof sheet, or EP03 moral/duty tone."}
`;
}

function buildFramePrompt(shot, metadata, deliveryShot, frameSpec, role) {
  const roleName = { start: "start", key: "key", end: "end" }[role];
  const intent = roleIntent(frameSpec, role);
  const characterAssets = (metadata.asset_references || []).filter((asset) => asset.includes("/characters/"));
  const identityPlates = shot.identity_plates || [];
  const locationAssets = (metadata.asset_references || []).filter((asset) => asset.includes("/locations/"));
  const propAssets = (metadata.asset_references || []).filter((asset) => asset.includes("/props/"));
  const proof = localProofPath(shot.id);
  const identityComparison = identityComparisonPath(shot.id);
  const localPrevis = rootPath(`storyboards/${shot.id}/${role}_frame.png`);
  const sourceRef = rootPath(metadata.source_reference || shot.source_reference || "");
  const rejectedCandidates = imagegenCandidatePaths(shot.id);

  return `# ${shot.id} ${roleName}_frame Identity-Locked Regeneration Prompt

Target output: \`${roleName}_frame_identity_locked_regen_2026-08-01.png\`
Decision state: frames_pending. This prompt does not approve the frame; it creates a candidate for independent visual QA.

## Identity Locks First

Use the local selected/reference assets as hard identity and wardrobe sources. Preserve exact face read, age read, hairstyle, body type, academy-era costume topology, insignia, weapons, and role.

Named characters: ${(metadata.characters || []).join(", ") || "none"}
Character assets:
${characterAssets.map((asset) => `- \`${asset}\``).join("\n") || "- none"}

Local identity plates:
${identityPlates.map((plate) => `- ${plate.character_id}: \`${plate.plate}\` from \`${plate.asset}\``).join("\n") || "- none"}

Location assets:
${locationAssets.map((asset) => `- \`${asset}\``).join("\n") || "- none"}

Prop assets:
${propAssets.map((asset) => `- \`${asset}\``).join("\n") || "- none"}

Local asset proof sheet:
- \`${proof}\`${fs.existsSync(proof) ? "" : " (pending)"}

Local composited previs for this frame, used only for identity/layout reference:
- \`${localPrevis}\`

Source/layout reference, not final image material:
- \`${sourceRef}\`

${fs.existsSync(identityComparison) ? `Blocked imagegen identity comparison:\n- \`${identityComparison}\`\n` : ""}${Object.keys(rejectedCandidates).length ? `Rejected imagegen candidates, composition study only, do not reuse faces as identity truth:\n${Object.entries(rejectedCandidates).map(([label, file]) => `- ${label}: \`${file}\``).join("\n")}\n` : ""}
## Story And Frame Intent

Scene beat: ${metadata.scene || shot.beat}
Shot purpose: ${metadata.purpose || shot.purpose}
Frame role: ${roleName}
Frame intent: ${intent}
Action peak: ${section(frameSpec, "Action Peak") || shot.key_action || metadata.purpose}
Blocking: ${section(frameSpec, "Blocking") || shot.key_action || ""}
Screen direction: ${section(frameSpec, "Screen Direction") || "preserve source layout and adjacent-shot geography"}
Camera: ${metadata.camera || shot.camera || section(frameSpec, "Camera")}
Audio anchor: ${deliveryShot.audio_anchor || metadata.audio_anchor || shot.audio_anchor || "none"}
Edit in/out: ${deliveryShot.edit_in || metadata.edit_in || ""} / ${deliveryShot.edit_out || metadata.edit_out || ""}

## Generation Direction

Create a cinematic live-action keyframe that integrates the local character identities into the EP03 environment with coherent lighting, scale, depth, and camera perspective. The image should feel like a film still, but it must not redesign any named character, costume, weapon, prop, or story beat.

Use restrained performance: show intention through eyeline, posture, breath, hand tension, and small facial changes. Avoid theatrical reaction faces.

## Must Preserve

- Exact local selected.png character identity and academy-era wardrobe topology.
- Exact local identity plate face crop, hair silhouette, body proportion, costume topology, and full-body outline for every named character.
- EP03 fog/cathedral geography, shot scale, and screen direction.
- The declared ${roleName} frame intent and the start/key/end motion chain.
- Non-graphic, duty-focused, tragic tone.

## Reject If

${(deliveryShot.reject_if || []).map((item) => `- ${item}`).join("\n") || "- Named identity, costume, action, or geography drifts from the local proof sheet and frame spec."}
- Any generated face no longer matches the listed local selected/reference assets.
- The image looks like a game screenshot, anime frame, UI capture, or generic fantasy cosplay.
- The shot adds new named characters, random soldiers as named-role substitutes, modern objects, subtitles, captions, or visible UI.
`;
}

function buildShots() {
  const queue = readJson(queuePath);
  const delivery = readJson(deliveryPath);
  const deliveryById = new Map((delivery.shots || []).map((shot) => [shot.id, shot]));
  return (queue.shots || []).map((shot) => {
    const metadataPath = rootPath(`storyboards/${shot.id}/metadata.json`);
    const frameSpecPath = rootPath(`storyboards/${shot.id}/frame_spec.md`);
    const metadata = readJson(metadataPath);
    const frameSpec = readText(frameSpecPath);
    const deliveryShot = deliveryById.get(shot.id) || {};
    const regeneratedCandidates = identityRegenCandidatePaths(shot.id, shot.order);
    const revisedPrompts = revisedPromptPaths(shot.id, shot.order);
    return {
      id: shot.id,
      order: shot.order,
      duration_seconds: deliveryShot.duration_seconds || shot.duration_seconds,
      scene: metadata.scene || shot.beat,
      purpose: metadata.purpose || shot.purpose,
      characters: metadata.characters || [],
      asset_references: metadata.asset_references || [],
      identity_plates: localIdentityPlatesForAssets(metadata.asset_references || []),
      source_reference: rootPath(metadata.source_reference || shot.source_reference || ""),
      local_asset_proof_sheet: fs.existsSync(localProofPath(shot.id)) ? localProofPath(shot.id) : "",
      identity_comparison: fs.existsSync(identityComparisonPath(shot.id)) ? identityComparisonPath(shot.id) : "",
      current_local_previs: {
        start: rootPath(`storyboards/${shot.id}/start_frame.png`),
        key: rootPath(`storyboards/${shot.id}/key_frame.png`),
        end: rootPath(`storyboards/${shot.id}/end_frame.png`),
      },
      regenerated_frame_candidates: regeneratedCandidates,
      blocked_identity_locked_probes: identityLockedProbePaths(shot.id),
      rejected_imagegen_candidates: imagegenCandidatePaths(shot.id),
      prompt_path: rootPath(`video_prompts/${shot.id}_prompt.md`),
      negative_prompt_path: rootPath(`video_prompts/${shot.id}_negative_prompt.md`),
      revised_prompt_paths: revisedPrompts,
      frame_spec_path: frameSpecPath,
      metadata_path: metadataPath,
      expected_outputs: {
        start: regeneratedCandidates.start || path.join(packageRel, "shots", `${String(shot.order).padStart(3, "0")}_${shot.id}`, "start_frame_identity_locked_regen_2026-08-01.png"),
        key: regeneratedCandidates.key || path.join(packageRel, "shots", `${String(shot.order).padStart(3, "0")}_${shot.id}`, "key_frame_identity_locked_regen_2026-08-01.png"),
        end: regeneratedCandidates.end || path.join(packageRel, "shots", `${String(shot.order).padStart(3, "0")}_${shot.id}`, "end_frame_identity_locked_regen_2026-08-01.png"),
      },
      generation_status: generationStatusFor(regeneratedCandidates),
      delivery_status: deliveryShot.status || "unknown",
      visual_audit_decision: deliveryShot.visual_audit_decision || shot.visual_audit_decision,
      required_revision: deliveryShot.required_revision || shot.required_revision,
      video_prompt_qa_decision: deliveryShot.video_prompt_qa_decision || "",
      motion_probe_status: deliveryShot.motion_probe_status || "",
      motion_probe_plan: deliveryShot.motion_probe_plan ? rootPath(deliveryShot.motion_probe_plan) : "",
      video_prompt_v2: deliveryShot.video_prompt_v2 ? rootPath(deliveryShot.video_prompt_v2) : "",
      negative_prompt_v2: deliveryShot.negative_prompt_v2 ? rootPath(deliveryShot.negative_prompt_v2) : "",
      edit_in: deliveryShot.edit_in || metadata.edit_in || "",
      edit_out: deliveryShot.edit_out || metadata.edit_out || "",
      audio_anchor: deliveryShot.audio_anchor || metadata.audio_anchor || shot.audio_anchor || "",
      reject_if: deliveryShot.reject_if || [],
      frame_intents: {
        start: roleIntent(frameSpec, "start"),
        key: roleIntent(frameSpec, "key"),
        end: roleIntent(frameSpec, "end"),
      },
      frameSpec,
      metadata,
      deliveryShot,
    };
  });
}

function writeShotFiles(shot) {
  const shotDirName = `${String(shot.order).padStart(3, "0")}_${shot.id}`;
  const shotDir = path.join(packageRoot, "shots", shotDirName);
  ensureDir(shotDir);
  const fileRel = (name) => path.join(packageRel, "shots", shotDirName, name);
  const negative = buildNegativePrompt(shot, shot.metadata, shot.deliveryShot);
  const metadata = {
    id: shot.id,
    order: shot.order,
    scene: shot.scene,
    purpose: shot.purpose,
    duration_seconds: shot.duration_seconds,
    characters: shot.characters,
    asset_references: shot.asset_references,
    identity_plates: shot.identity_plates,
    local_asset_proof_sheet: shot.local_asset_proof_sheet,
    identity_comparison: shot.identity_comparison,
    current_local_previs: shot.current_local_previs,
    rejected_imagegen_candidates: shot.rejected_imagegen_candidates,
    blocked_identity_locked_probes: shot.blocked_identity_locked_probes,
    regenerated_frame_candidates: shot.regenerated_frame_candidates,
    source_reference: shot.source_reference,
    original_prompt_path: shot.prompt_path,
    original_negative_prompt_path: shot.negative_prompt_path,
    revised_prompt_paths: shot.revised_prompt_paths,
    frame_spec_path: shot.frame_spec_path,
    source_metadata_path: shot.metadata_path,
    expected_outputs: shot.expected_outputs,
    generation_status: shot.generation_status,
    delivery_status: shot.delivery_status,
    visual_audit_decision: shot.visual_audit_decision,
    required_revision: shot.required_revision,
    video_prompt_qa_decision: shot.video_prompt_qa_decision,
    motion_probe_status: shot.motion_probe_status,
    motion_probe_plan: shot.motion_probe_plan,
    video_prompt_v2: shot.video_prompt_v2,
    negative_prompt_v2: shot.negative_prompt_v2,
    edit_in: shot.edit_in,
    edit_out: shot.edit_out,
    audio_anchor: shot.audio_anchor,
    reject_if: shot.reject_if,
    frame_intents: shot.frame_intents,
  };
  writeJson(path.join(shotDir, "metadata.json"), metadata);
  fs.writeFileSync(path.join(shotDir, "negative_prompt.md"), negative);
  for (const role of ["start", "key", "end"]) {
    fs.writeFileSync(
      path.join(shotDir, `${role}_frame_prompt.md`),
      buildFramePrompt(shot, shot.metadata, shot.deliveryShot, shot.frameSpec, role),
    );
  }
  return {
    shot_dir: fileRel("").replace(/\/$/, ""),
    metadata: fileRel("metadata.json"),
    negative_prompt: fileRel("negative_prompt.md"),
    start_prompt: fileRel("start_frame_prompt.md"),
    key_prompt: fileRel("key_frame_prompt.md"),
    end_prompt: fileRel("end_frame_prompt.md"),
  };
}

function buildReadme(counts) {
  return `# EP03 Identity-Locked Keyframe Regeneration Handoff

Created: ${createdAt}

This package is the next actionable step after the local asset storyboard package. It does not contain approved video frames. It contains per-shot, per-frame regeneration prompts that put local selected.png identity locks before camera, motion, and performance instructions.

## Status

- Target: regenerate final live-action start/key/end keyframe candidates.
- Current package status: frames_pending / monitor_required.
- Shots: ${counts.total}
- Local asset proof sheets available: ${counts.localProof}
- Local identity plate coverage: ${counts.identityPlateShots}/${counts.total} shots
- Regenerated candidate frame sets: ${counts.regeneratedFrameSets}/${counts.total}
- Revised prompt sets: ${counts.revisedPromptSets}/${counts.total}
- Rejected imagegen candidate sets referenced: ${counts.rejectedImagegen}
- Current video delivery status: blocked_needs_revision=${counts.blockedNeedsRevision}, visual_blocked=${counts.visualBlocked}

## Rules

- Use local selected/reference assets as the identity source of truth.
- Use local proof sheets and local previs frames for identity/layout reference only.
- Do not reuse blocked imagegen candidate faces as identity truth.
- Do not promote generated outputs until visual QA, prompt-against-frame QA, and strict continuity pass.
`;
}

function buildPolicy() {
  return `# EP03 Identity-Locked Prompt Policy

1. Identity locks must precede story mood, camera, motion, and performance.
2. Every named character must point to a local asset path.
3. Local proof sheets establish who the frame must preserve; they do not approve the current previs frame as final.
4. Source game screenshots are layout/canon references only and must not appear as final output.
5. Rejected imagegen candidates may be consulted for composition only, never for face truth.
6. Negative prompts must name common wrong substitutions: generic extras, war-phase costumes, robes, armor swaps, casual clothes, overacting, UI, subtitles, rounded player framing, letterbox side-fill, and visible text.
7. Each generated frame remains candidate_generated until reviewed by a separate visual QA role.
`;
}

function buildRunbook() {
  return `# RUNBOOK

1. Open \`index.html\` and choose the shot.
2. For each shot, submit \`start_frame_prompt.md\`, \`key_frame_prompt.md\`, and \`end_frame_prompt.md\` separately to the image model.
3. Include the local character assets, local identity plates, location assets, local asset proof sheet, and local previs frame listed in each prompt as references.
4. Save outputs to the \`expected_outputs\` paths in \`metadata.json\`.
5. Build a new proof sheet comparing local assets to the regenerated outputs.
6. Run visual QA before changing any shot status.
7. Only after all shots pass visual QA, run video-prompt QA against the actual regenerated frames and strict adjacent continuity.

Do not build an immutable video_generation_package from this folder. It is a regeneration handoff, not approved delivery.
`;
}

function buildQaChecklist() {
  return `# QA Checklist

For every regenerated frame:

- Face matches the local selected/reference asset.
- Age/era matches academy EP03 continuity.
- Hair, costume topology, insignia, weapon, and prop state match the local asset.
- Location matches the listed EP03 location/source layout.
- Frame role is clear: start, key, or end.
- Key frame proves the declared action/emotional peak.
- No subtitles, UI, captions, dialogue boxes, damage numbers, visible text, rounded player container, letterbox side fill, or modern objects.
- Start/key/end form a plausible action chain.
- End frame supports the next edit.

Decision values: blocked_needs_revision, layout_reference, visual_review_passed. Do not use approved_for_video here.
`;
}

function buildIndex(shots, counts) {
  const cards = shots.map((shot) => {
    const links = shot.package_files;
    return `
      <article>
        <header>
          <div>
            <p>${String(shot.order).padStart(2, "0")} · ${escapeHtml(shot.delivery_status)} · ${escapeHtml(shot.generation_status)}</p>
            <h2>${escapeHtml(shot.id)} · ${escapeHtml(shot.scene)}</h2>
          </div>
          <strong>${escapeHtml(shot.duration_seconds)}s</strong>
        </header>
        <p>${escapeHtml(shot.purpose)}</p>
        <div class="refs">
          ${(shot.identity_plates || []).map((plate) => `<a href="/${plate.plate}" target="_blank">${escapeHtml(plate.character_id)} identity plate</a>`).join("")}
          ${shot.local_asset_proof_sheet ? `<a href="/${shot.local_asset_proof_sheet}" target="_blank">local proof</a>` : ""}
          ${shot.identity_comparison ? `<a href="/${shot.identity_comparison}" target="_blank">identity comparison</a>` : ""}
          <a href="/${shot.source_reference}" target="_blank">source ref</a>
          <a href="/${shot.current_local_previs.key}" target="_blank">current local key previs</a>
          ${Object.entries(shot.regenerated_frame_candidates || {}).map(([label, file]) => `<a href="/${file}" target="_blank">regen ${escapeHtml(label)}</a>`).join("")}
          ${shot.motion_probe_plan ? `<a href="/${shot.motion_probe_plan}" target="_blank">motion probe plan</a>` : ""}
          ${Object.entries(shot.blocked_identity_locked_probes || {}).map(([label, file]) => `<a href="/${file}" target="_blank">blocked ${escapeHtml(label)}</a>`).join("")}
        </div>
        <div class="prompts">
          ${Object.entries(shot.revised_prompt_paths || {}).map(([label, file]) => `<a href="/${file}" target="_blank">v2 ${escapeHtml(label)}</a>`).join("")}
          <a href="shots/${path.basename(links.shot_dir)}/start_frame_prompt.md" target="_blank">start prompt</a>
          <a href="shots/${path.basename(links.shot_dir)}/key_frame_prompt.md" target="_blank">key prompt</a>
          <a href="shots/${path.basename(links.shot_dir)}/end_frame_prompt.md" target="_blank">end prompt</a>
          <a href="shots/${path.basename(links.shot_dir)}/negative_prompt.md" target="_blank">negative</a>
          <a href="shots/${path.basename(links.shot_dir)}/metadata.json" target="_blank">metadata</a>
        </div>
      </article>
    `;
  }).join("");

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EP03 Identity-Locked Keyframe Regeneration</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #111514; color: #eef2ee; }
    body { margin: 0; background: #111514; }
    .hero { padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,.14); position: sticky; top: 0; background: rgba(17,21,20,.94); backdrop-filter: blur(14px); z-index: 2; }
    h1, h2, p { margin: 0; }
    h1 { font-size: 30px; }
    .hero p { margin-top: 8px; color: #adbbb4; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 16px; }
    .stats div { border: 1px solid rgba(255,255,255,.14); border-radius: 6px; padding: 12px; background: rgba(255,255,255,.04); }
    .stats strong { display: block; font-size: 22px; }
    main { padding: 24px 32px 48px; display: grid; gap: 14px; }
    article { border: 1px solid rgba(255,255,255,.14); border-radius: 8px; padding: 16px; background: #18201d; }
    article header { display: flex; justify-content: space-between; gap: 16px; align-items: start; }
    article header p { color: #adbbb4; font-size: 12px; text-transform: uppercase; }
    article h2 { margin-top: 4px; font-size: 20px; }
    article > p { margin-top: 10px; color: #dce4de; }
    .refs, .prompts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    a { color: #9fd3ff; text-decoration: none; border: 1px solid rgba(255,255,255,.14); border-radius: 5px; padding: 7px 9px; background: rgba(255,255,255,.04); }
    @media (max-width: 760px) { .hero, main { padding-left: 16px; padding-right: 16px; } article header { display: block; } }
  </style>
</head>
<body>
  <section class="hero">
    <h1>EP03 Identity-Locked Keyframe Regeneration</h1>
    <p>Per-shot start/key/end prompts for regenerating final candidates from local selected.png identity locks. Outputs remain pending until reviewed.</p>
    <div class="stats">
      <div><strong>${counts.total}</strong><span>shots</span></div>
      <div><strong>${counts.localProof}</strong><span>local proof sheets</span></div>
      <div><strong>${counts.regeneratedFrameSets}</strong><span>regen candidate sets</span></div>
      <div><strong>${counts.revisedPromptSets}</strong><span>revised prompt sets</span></div>
      <div><strong>${counts.rejectedImagegen}</strong><span>blocked imagegen sets</span></div>
      <div><strong>${counts.blockedNeedsRevision}</strong><span>blocked needs revision</span></div>
      <div><strong>${counts.visualBlocked}</strong><span>visual blocked</span></div>
    </div>
  </section>
  <main>${cards}</main>
</body>
</html>
`;
}

function buildCsv(rows) {
  const header = [
    "order",
    "shot",
    "frame_role",
    "prompt_path",
    "revised_prompt_path",
    "video_prompt_path",
    "negative_prompt_path",
    "expected_output",
    "local_asset_proof_sheet",
    "source_reference",
    "status",
  ];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(header.map((key) => csvEscape(row[key])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function updateProductionManifests(shots, packageFiles) {
  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const artifactId = "EP03-IDENTITY-LOCKED-KEYFRAME-REGENERATION-HANDOFF-2026-08-01";
  const reviewId = "review-2026-08-01-ep03-identity-locked-keyframe-regeneration-handoff";

  upsertBy(artifacts.artifacts, "id", {
    id: artifactId,
    type: "delivery_packet",
    stage: "asset_generation",
    status: "monitor_required",
    created_by: "production-manager-agent",
    created_at: createdAt,
    paths: packageFiles,
    source_refs: [
      "delivery/local_asset_storyboard_package_2026-07-31/manifest.json",
      "production_system/video_delivery_manifest.json",
      "frame_generation_queue.json",
    ],
    depends_on: [
      "EP03-LOCAL-ASSET-STORYBOARD-PACKAGE-2026-07-31",
      "EP03-LOCAL-ASSET-PREVIS-PROOF-SHEETS-2026-07-31",
    ],
    continuity: {
      previous: "",
      next: "",
      in: "starts with Shot001 keyframe regeneration prompt",
      out: "ends with Shot036 keyframe regeneration prompt",
    },
    risk_flags: ["frames_pending", "identity_drift", "visual_qa_required", "not_video_generation_package"],
    notes: "Per-shot start/key/end prompt handoff for regenerating local-asset-locked final keyframe candidates. Outputs are pending and must be reviewed before promotion.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "video-prompt-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "monitor_required",
    blocking_issues: [
      "The handoff contains prompts and reference contracts only; regenerated image outputs are still missing.",
      "No prompt in this package can approve a shot for video until the generated start/key/end frames exist and pass visual QA.",
      "Shot001-Shot019 previous imagegen candidates remain blocked; Shot020-Shot036 still need first regenerated live-action candidate frame sets.",
    ],
    required_revisions: [
      "Generate start/key/end candidate images for every shot using the handoff prompts and local references.",
      "Build regenerated-output proof sheets and run independent visual QA.",
      "Re-run video-prompt QA against actual regenerated frames and strict continuity before approved_for_video.",
    ],
    rubric: {
      prompt_structure: "pass",
      local_identity_lock_order: "pass",
      output_frames_present: "fail",
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: packageFiles,
  });

  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
}

function main() {
  ensureDir(packageRoot);
  ensureDir(path.join(packageRoot, "shots"));
  const rawShots = buildShots();
  const queueRows = [];
  const shots = rawShots.map((shot) => {
    const packageFiles = writeShotFiles(shot);
    const publicShot = { ...shot };
    delete publicShot.frameSpec;
    delete publicShot.metadata;
    delete publicShot.deliveryShot;
    publicShot.package_files = packageFiles;
    for (const role of ["start", "key", "end"]) {
      queueRows.push({
        order: shot.order,
        shot: shot.id,
        frame_role: role,
        prompt_path: packageFiles[`${role}_prompt`],
        revised_prompt_path: shot.revised_prompt_paths?.[`${role}_prompt`] || "",
        video_prompt_path: shot.revised_prompt_paths?.video_prompt || "",
        negative_prompt_path: shot.revised_prompt_paths?.negative_prompt || packageFiles.negative_prompt,
        expected_output: shot.expected_outputs[role],
        local_asset_proof_sheet: shot.local_asset_proof_sheet,
        source_reference: shot.source_reference,
        status: shot.regenerated_frame_candidates?.[role] ? shot.generation_status : "frames_pending",
      });
    }
    return publicShot;
  });
  const counts = {
    total: shots.length,
    localProof: shots.filter((shot) => shot.local_asset_proof_sheet).length,
    identityPlateShots: shots.filter((shot) => (shot.identity_plates || []).length).length,
    rejectedImagegen: shots.filter((shot) => Object.keys(shot.rejected_imagegen_candidates || {}).length).length,
    regeneratedFrameSets: shots.filter((shot) => ["start", "key", "end"].every((role) => shot.regenerated_frame_candidates?.[role])).length,
    partialRegeneratedFrameSets: shots.filter((shot) => {
      const frameCount = ["start", "key", "end"].filter((role) => shot.regenerated_frame_candidates?.[role]).length;
      return frameCount > 0 && frameCount < 3;
    }).length,
    revisedPromptSets: shots.filter((shot) => ["start_prompt", "key_prompt", "end_prompt", "video_prompt", "negative_prompt"].every((key) => shot.revised_prompt_paths?.[key])).length,
    blockedNeedsRevision: shots.filter((shot) => shot.delivery_status === "blocked_needs_revision").length,
    visualBlocked: shots.filter((shot) => shot.delivery_status === "visual_blocked").length,
  };

  const packageManifest = {
    version: 1,
    package_id: "EP03-IDENTITY-LOCKED-KEYFRAME-REGENERATION-HANDOFF-2026-08-01",
    episode: "EP03",
    created_at: createdAt,
    status: "monitor_required",
    highest_completed_target: "prompt_asset_package",
    target_next_stage: "generate candidate start/key/end keyframes, then visual QA",
    counts,
    package_root: packageRoot,
    viewer: path.join(packageRoot, "index.html"),
    local_identity_plate_index: localIdentityPlateIndexPath,
    local_identity_plate_viewer: path.join(path.dirname(localIdentityPlateIndexPath), "viewer.html"),
    local_identity_plate_atlas: localIdentityPlateIndex.atlas || "",
    shots,
    submission_queue: queueRows,
  };

  writeJson(path.join(packageRoot, "package_manifest.json"), packageManifest);
  writeJson(path.join(packageRoot, "submission_queue.json"), queueRows);
  fs.writeFileSync(path.join(packageRoot, "submission_queue.csv"), buildCsv(queueRows));
  fs.writeFileSync(path.join(packageRoot, "README.md"), buildReadme(counts));
  fs.writeFileSync(path.join(packageRoot, "RUNBOOK.md"), buildRunbook());
  fs.writeFileSync(path.join(packageRoot, "prompt_policy.md"), buildPolicy());
  fs.writeFileSync(path.join(packageRoot, "QA_CHECKLIST.md"), buildQaChecklist());
  fs.writeFileSync(path.join(packageRoot, "index.html"), buildIndex(shots, counts));

  const topFiles = [
    "README.md",
    "RUNBOOK.md",
    "prompt_policy.md",
    "QA_CHECKLIST.md",
    "package_manifest.json",
    "submission_queue.json",
    "submission_queue.csv",
    "index.html",
  ].map((file) => `${packageRel}/${file}`);
  const shotFiles = shots.flatMap((shot) => Object.values(shot.package_files));
  updateProductionManifests(shots, [...topFiles, ...shotFiles]);

  console.log(`built ${packageRoot} (${shots.length} shots, ${queueRows.length} frame prompts)`);
}

main();
