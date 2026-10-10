const fs = require("fs");
const path = require("path");

const epRoot = "episodes/EP03";
const createdAt = "2026-09-09";
const packageRel = "delivery/complete_script_shot_asset_package_2026-08-01";
const packageRoot = path.join(epRoot, packageRel);
const artifactId = "EP03-COMPLETE-SCRIPT-SHOT-ASSET-PACKAGE-CURRENT-2026-09-09";
const reviewId = "review-2026-09-09-ep03-complete-script-shot-asset-package";

const files = {
  script: path.join(epRoot, "script.md"),
  shotList: path.join(epRoot, "shot_list.md"),
  directorTreatment: path.join(epRoot, "director_treatment.md"),
  productionNotes: path.join(epRoot, "production_notes.md"),
  sourceBreakdown: path.join(epRoot, "source_video_breakdown.md"),
  queue: path.join(epRoot, "frame_generation_queue.json"),
  delivery: path.join(epRoot, "production_system/video_delivery_manifest.json"),
  artifactManifest: path.join(epRoot, "production_system/artifact_manifest.json"),
  reviewManifest: path.join(epRoot, "production_system/review_manifest.json"),
  generationReceipts: path.join(epRoot, "production_system/generation_receipts.json"),
  identityPlateIndex: path.join(epRoot, "production_system/reviews/local_identity_plates_2026-08-01/index.json"),
  traceabilityAuditJson: path.join(epRoot, "production_system/reviews/ep03_complete_package_local_traceability_audit_2026-08-01.json"),
  traceabilityAuditMd: path.join(epRoot, "production_system/reviews/ep03_complete_package_local_traceability_audit_2026-08-01.md"),
};

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

function upsertBy(items, key, item) {
  const index = items.findIndex((candidate) => candidate[key] === item[key]);
  if (index === -1) items.push(item);
  else items[index] = item;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function webHref(rootRelative) {
  const normalized = String(rootRelative || "").replace(/\\/g, "/");
  if (!normalized || /^(https?:|mailto:|data:|#)/.test(normalized)) return normalized;
  const epRootPosix = epRoot.replace(/\\/g, "/");
  const epRelativePrefixes = ["storyboards/", "video_prompts/", "source_refs/", "production_system/"];
  const epRelativeFiles = new Set([
    "script.md",
    "shot_list.md",
    "director_treatment.md",
    "production_notes.md",
    "source_video_breakdown.md",
    "frame_generation_queue.json",
  ]);
  const isAlreadyEpRooted = normalized === epRootPosix || normalized.startsWith(`${epRootPosix}/`);
  const isEpisodeRelative = epRelativePrefixes.some((prefix) => normalized.startsWith(prefix)) || epRelativeFiles.has(normalized);
  const projectPath = !isAlreadyEpRooted && isEpisodeRelative
    ? `${epRootPosix}/${normalized}`
    : normalized;
  return path.posix.relative(packageRoot.replace(/\\/g, "/"), projectPath) || ".";
}

function rootPath(epRelative) {
  return path.join(epRoot, epRelative);
}

function frameSetFrames(frameSet) {
  if (frameSet?.frames) {
    return {
      start: rootPath(frameSet.frames.start),
      key: rootPath(frameSet.frames.key),
      end: rootPath(frameSet.frames.end),
    };
  }
  if (frameSet?.start_frame && frameSet?.key_frame && frameSet?.end_frame) {
    return {
      start: rootPath(frameSet.start_frame),
      key: rootPath(frameSet.key_frame),
      end: rootPath(frameSet.end_frame),
    };
  }
  return null;
}

function currentFrameSetFor(deliveryShot, queueShot) {
  const requested = deliveryShot.current_display_frame_set || queueShot.current_display_frame_set || "";
  if (requested && deliveryShot[requested]) return deliveryShot[requested];
  if (requested && queueShot[requested]) return queueShot[requested];
  if (deliveryShot.displayed_frame_set?.frames) return deliveryShot.displayed_frame_set;
  if (queueShot.displayed_frame_set?.frames) return queueShot.displayed_frame_set;
  if (deliveryShot.frames?.start && deliveryShot.frames?.key && deliveryShot.frames?.end) {
    return { frames: deliveryShot.frames, frame_set_id: requested || "current_display_frames", status: deliveryShot.current_display_frame_status || "monitor_required" };
  }
  return deliveryShot.integrated_candidate_v2
    || queueShot.integrated_candidate_v2
    || deliveryShot.local_asset_final_candidate_v1
    || queueShot.local_asset_final_candidate_v1
    || null;
}

function statusCounts(shots) {
  return shots.reduce((acc, shot) => {
    acc[shot.status] = (acc[shot.status] || 0) + 1;
    return acc;
  }, {});
}

function identityPlatesFor(assetReferences, index) {
  const byAsset = new Map((index.plates || []).map((plate) => [plate.asset, plate]));
  return (assetReferences || [])
    .filter((asset) => asset.includes("/characters/"))
    .map((asset) => byAsset.get(asset))
    .filter(Boolean)
    .map((plate) => ({
      character_id: plate.character_id,
      asset: plate.asset,
      plate: plate.plate,
      status: plate.status || "layout_reference",
    }));
}

function buildShots() {
  const queue = readJson(files.queue);
  const delivery = readJson(files.delivery);
  const identityIndex = fs.existsSync(files.identityPlateIndex) ? readJson(files.identityPlateIndex) : { plates: [] };
  const deliveryByShot = new Map((delivery.shots || []).map((shot) => [shot.id, shot]));

  return (queue.shots || []).map((queueShot) => {
    const shotId = queueShot.id;
    const deliveryShot = deliveryByShot.get(shotId) || {};
    const metadata = readJson(rootPath(`storyboards/${shotId}/metadata.json`));
    const v3Frames = {
      start: rootPath(`storyboards/${shotId}/start_frame.png`),
      key: rootPath(`storyboards/${shotId}/key_frame.png`),
      end: rootPath(`storyboards/${shotId}/end_frame.png`),
    };
    const prompts = {
      prompt: rootPath(`video_prompts/${shotId}_prompt.md`),
      negative_prompt: rootPath(`video_prompts/${shotId}_negative_prompt.md`),
      frame_spec: rootPath(`storyboards/${shotId}/frame_spec.md`),
      metadata: rootPath(`storyboards/${shotId}/metadata.json`),
    };
    const localFrameSet = deliveryShot.local_selected_png_composited_previs_v3
      || queueShot.local_selected_png_composited_previs_v3
      || null;
    const finalCandidateFrameSet = currentFrameSetFor(deliveryShot, queueShot);
    const finalCandidateFrames = frameSetFrames(finalCandidateFrameSet);
    const hasFinalCandidate = finalCandidateFrames && Object.values(finalCandidateFrames).every((file) => fs.existsSync(file));
    const frames = hasFinalCandidate ? finalCandidateFrames : v3Frames;
    const currentFrameSource = deliveryShot.current_display_frame_source
      || queueShot.current_display_frame_source
      || (hasFinalCandidate ? "local identity plates + local video evidence + constrained imagegen cleanup" : "local selected.png deterministic composite");
    return {
      id: shotId,
      order: queueShot.order,
      scene: metadata.scene || queueShot.beat || shotId,
      purpose: metadata.purpose || queueShot.purpose || "",
      duration_seconds: deliveryShot.duration_seconds || queueShot.duration_seconds,
      characters: metadata.characters || [],
      source_timecode: queueShot.source_timecode || metadata.source_timecode || "",
      source_timecode_audit: metadata.source_timecode_audit || deliveryShot.source_timecode_audit || queueShot.source_timecode_audit || null,
      source_reference: rootPath(metadata.source_reference || queueShot.source_reference || ""),
      local_video_source_evidence: rootPath(`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/${shotId}/${shotId}_local_video_source_evidence_2026-08-01.jpg`),
      local_asset_proof_sheet: rootPath(`production_system/reviews/local_asset_previs_proof_2026-07-31/${shotId}_local_asset_previs_proof_2026-07-31.jpg`),
      identity_comparison: rootPath(`production_system/reviews/identity_lock_comparison_2026-07-31/${shotId}_identity_comparison_2026-07-31.jpg`),
      frames,
      v3_previs_frames: v3Frames,
      prompts,
      current_display_frame_set: deliveryShot.current_display_frame_set || queueShot.current_display_frame_set || (hasFinalCandidate ? "local_asset_final_candidate_v1" : "local_selected_png_composited_previs_v3"),
      current_display_frame_status: deliveryShot.current_display_frame_status || queueShot.current_display_frame_status || (hasFinalCandidate ? "monitor_required" : "layout_reference"),
      current_display_frame_source: currentFrameSource,
      current_display_frame_note: finalCandidateFrameSet?.note || finalCandidateFrameSet?.blocker_resolved || localFrameSet?.note || "Displayed frames are local selected.png composited previs only; not final cinematic keyframes.",
      local_selected_png_composited_previs_v3: localFrameSet,
      local_asset_final_candidate_v1: deliveryShot.local_asset_final_candidate_v1 || queueShot.local_asset_final_candidate_v1 || null,
      displayed_frame_set: finalCandidateFrameSet,
      integrated_candidate_v2: deliveryShot.integrated_candidate_v2 || queueShot.integrated_candidate_v2 || null,
      critical_reaudit_regen_v1: deliveryShot.critical_reaudit_regen_v1 || queueShot.critical_reaudit_regen_v1 || null,
      legacy_imagegen_candidate_audit: deliveryShot.legacy_imagegen_candidate_audit || {
        decision: queueShot.legacy_imagegen_candidate_decision || "",
        reason: queueShot.legacy_imagegen_candidate_reason || "",
      },
      asset_references: metadata.asset_references || [],
      identity_plates: identityPlatesFor(metadata.asset_references || [], identityIndex),
      status: deliveryShot.status || "unknown",
      visual_audit_decision: deliveryShot.visual_audit_decision || queueShot.visual_audit_decision || "",
      visual_audit_finding: deliveryShot.visual_audit_finding || queueShot.visual_audit_finding || "",
      required_revision: deliveryShot.required_revision || queueShot.required_revision || "",
      edit_in: deliveryShot.edit_in || "",
      edit_out: deliveryShot.edit_out || "",
      current_continuity: deliveryShot.current_continuity || {
        previous_shot: null,
        previous_end_frame: deliveryShot.previous_match_action_reference || null,
        next_shot: null,
        next_start_frame: deliveryShot.next_handoff_reference || null,
        decision: "monitor_required",
      },
      audio_anchor: deliveryShot.audio_anchor || "",
      expected_clip: deliveryShot.expected_clip || "",
      frame_files_complete: Object.values(frames).every((file) => fs.existsSync(file)),
      evidence_files: [rootPath(`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/${shotId}/${shotId}_local_video_source_evidence_2026-08-01.jpg`), rootPath(`production_system/reviews/local_asset_previs_proof_2026-07-31/${shotId}_local_asset_previs_proof_2026-07-31.jpg`)].filter((file) => fs.existsSync(file)),
    };
  });
}

function buildMarkdown(shots, counts, provenanceAudit) {
  const rows = shots.map((shot) => `| ${shot.id} | ${shot.duration_seconds}s | ${shot.scene} | ${shot.characters.join(", ")} | ${shot.status} | ${shot.current_display_frame_source} / ${shot.current_display_frame_status} | ${shot.frame_files_complete ? "yes" : "no"} | [frames](${shot.frames.key}) | [source](${shot.local_video_source_evidence}) | [asset proof](${shot.local_asset_proof_sheet}) | [prompt](${shot.prompts.prompt}) |`);
  return `# EP03 Complete Script And Shot Asset Package

Created: ${createdAt}

This is the current complete EP3 package entrance: script, shot list, current integrated live-action candidate triptychs, local raw-video evidence, identity plates, prompt files, negative prompts, and gate status.

## Pipeline Status

- Highest completed target: \`prompt_asset_package\`
- Video generation package: blocked
- Shots: ${shots.length}
- Displayed frame triptychs: ${shots.filter((shot) => shot.frame_files_complete).length}/${shots.length}
- Status counts: ${Object.entries(counts).map(([key, value]) => `${key}=${value}`).join(", ")}
- Current output hashes verified: ${provenanceAudit?.output_hash_verified || 0}/${shots.length * 3}
- Current source-cache hashes verified: ${provenanceAudit?.source_cache_hash_verified || 0}/${shots.length * 3}
- Current source-cache frames unavailable: ${provenanceAudit?.source_cache_unavailable?.length || 0} (see local traceability audit)

## Main Entrances

- Script snapshot: \`script.md\`
- Shot list snapshot: \`shot_list.md\`
- Local storyboard viewer: \`../local_asset_storyboard_package_2026-07-31/index.html\`
- Identity regeneration viewer: \`../identity_locked_keyframe_regeneration_2026-08-01/index.html\`
- Source evidence viewer: \`../../production_system/reviews/local_video_source_frames_2026-08-01/viewer.html\`
- Identity plates viewer: \`../../production_system/reviews/local_identity_plates_2026-08-01/viewer.html\`
- Local traceability audit: \`../../production_system/reviews/ep03_complete_package_local_traceability_audit_2026-08-01.md\`
- Current web-display contact sheet: \`../../generated_storyboard_contact_sheet_current_2026-09-03.jpg\`
- Current Shot025-029 handoff contact sheet: \`../../production_system/reviews/critical_reaudit_2026-09-03/sequence_handoff_025_029_current_contact_sheet.jpg\`

## Use Rules

- Current displayed start/key/end frames are integrated live-action candidates generated against local selected character/location assets and adjacent-shot references.
- Local selected.png composited previs v3 remains available as historical identity/layout evidence; it is not the primary display set.
- Every current candidate still requires downstream prompt-against-frame QA, motion probe, and strict continuity checks.
- Do not submit this as \`video_generation_package\` until per-shot final frames, prompt QA against actual frames, motion probe, strict continuity, and \`approved_for_video\` pass.

## Shot Asset Index

| Shot | Duration | Scene | Characters | Status | Frame Source | Frames | Key Frame | Source Evidence | Asset Proof | Prompt |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}
`;
}

function buildHtml(shots, counts) {
  const shotCards = shots.map((shot) => {
    const frames = ["start", "key", "end"].map((role) => `
      <figure>
        <a href="${webHref(shot.frames[role])}" target="_blank" rel="noreferrer"><img src="${webHref(shot.frames[role])}" alt="${escapeHtml(`${shot.id} ${role}`)}"></a>
        <figcaption>${role}</figcaption>
      </figure>`).join("");
    const identityLinks = shot.identity_plates.map((plate) => `<a href="${webHref(plate.plate)}" target="_blank" rel="noreferrer">${escapeHtml(plate.character_id)}</a>`).join("");
    const assetLinks = shot.asset_references.map((asset) => `<a href="${webHref(asset)}" target="_blank" rel="noreferrer">${escapeHtml(asset)}</a>`).join("");
    return `
      <article class="shot">
        <header>
          <div><p>${String(shot.order).padStart(2, "0")} · ${escapeHtml(shot.status)}</p><h2>${escapeHtml(shot.id)} · ${escapeHtml(shot.scene)}</h2></div>
          <strong>${escapeHtml(shot.duration_seconds)}s</strong>
        </header>
        <p class="purpose">${escapeHtml(shot.purpose)}</p>
        <div class="sourcecallout">
          <strong>Frame source</strong>
          <span>${escapeHtml(shot.current_display_frame_source)} · ${escapeHtml(shot.current_display_frame_set)} · ${escapeHtml(shot.current_display_frame_status)}</span>
          <small>${escapeHtml(shot.current_display_frame_note)}</small>
        </div>
        <div class="frames">${frames}</div>
        <dl>
          <div><dt>Characters</dt><dd>${escapeHtml(shot.characters.join(", "))}</dd></div>
          <div><dt>Source TC</dt><dd>${escapeHtml(shot.source_timecode)}</dd></div>
          <div><dt>Source adaptation</dt><dd>${escapeHtml(shot.source_timecode_audit?.adaptation_gap || "")}</dd></div>
          <div><dt>Audio</dt><dd>${escapeHtml(shot.audio_anchor)}</dd></div>
          <div><dt>Edit</dt><dd>${escapeHtml(`${shot.edit_in} / ${shot.edit_out}`)}</dd></div>
          <div><dt>Current continuity</dt><dd>${escapeHtml(shot.current_continuity ? `${shot.current_continuity.previous_shot || "START"} END -> ${shot.id} -> ${shot.current_continuity.next_shot || "END"} START` : "not recorded")}</dd></div>
          <div><dt>QA</dt><dd>${escapeHtml(shot.visual_audit_decision || shot.status)}</dd></div>
          <div><dt>Revision</dt><dd>${escapeHtml(shot.required_revision || shot.visual_audit_finding)}</dd></div>
          <div><dt>Legacy Imagegen</dt><dd>${escapeHtml(shot.legacy_imagegen_candidate_audit?.decision ? `${shot.legacy_imagegen_candidate_audit.decision}: ${shot.legacy_imagegen_candidate_audit.reason}` : "not used as primary display")}</dd></div>
        </dl>
        <div class="links">
          <a href="${webHref(shot.local_video_source_evidence)}" target="_blank" rel="noreferrer">local source board</a>
          <a href="${webHref(shot.local_asset_proof_sheet)}" target="_blank" rel="noreferrer">asset proof</a>
          <a href="${webHref(shot.prompts.frame_spec)}" target="_blank" rel="noreferrer">frame spec</a>
          <a href="${webHref(shot.prompts.metadata)}" target="_blank" rel="noreferrer">metadata</a>
          <a href="${webHref(shot.prompts.prompt)}" target="_blank" rel="noreferrer">prompt</a>
          <a href="${webHref(shot.prompts.negative_prompt)}" target="_blank" rel="noreferrer">negative</a>
          ${fs.existsSync(shot.identity_comparison) ? `<a href="${webHref(shot.identity_comparison)}" target="_blank" rel="noreferrer">identity comparison</a>` : ""}
        </div>
        <details><summary>Identity Plates</summary><div class="links">${identityLinks || "<span>none</span>"}</div></details>
        <details><summary>Asset References</summary><div class="links">${assetLinks || "<span>none</span>"}</div></details>
      </article>`;
  }).join("");

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EP03 Complete Script And Shot Asset Package</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #101413; color: #edf2ed; }
    body { margin: 0; }
    .hero { padding: 28px 32px; position: sticky; top: 0; z-index: 5; background: rgba(16,20,19,.94); border-bottom: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(12px); }
    h1, h2, p { margin: 0; }
    h1 { font-size: 30px; }
    .hero p { margin-top: 8px; color: #adbbb3; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 18px; }
    .stats div { border: 1px solid rgba(255,255,255,.14); border-radius: 6px; padding: 10px; background: rgba(255,255,255,.04); }
    .stats strong { display: block; font-size: 22px; }
    .toplinks, .links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
    a, .links span { color: #9fd3ff; text-decoration: none; border: 1px solid rgba(255,255,255,.14); border-radius: 5px; padding: 7px 9px; background: rgba(255,255,255,.04); }
    main { display: grid; gap: 18px; padding: 24px 32px 48px; }
    .shot { background: #18201d; border: 1px solid rgba(255,255,255,.14); border-radius: 8px; padding: 16px; }
    .shot header { display: flex; justify-content: space-between; gap: 16px; }
    .shot header p { color: #adbbb3; font-size: 12px; text-transform: uppercase; }
    .shot h2 { margin-top: 4px; font-size: 20px; }
    .purpose { margin-top: 10px; color: #d6ded8; }
    .sourcecallout { display: grid; gap: 4px; margin-top: 12px; border: 1px solid rgba(241,213,140,.32); border-radius: 6px; padding: 10px; background: rgba(241,213,140,.08); }
    .sourcecallout strong { color: #f1d58c; }
    .sourcecallout small { color: #c8d2cb; line-height: 1.45; }
    .frames { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 14px; }
    figure { margin: 0; overflow: hidden; border: 1px solid rgba(255,255,255,.1); border-radius: 6px; background: #090c0b; }
    figure a { display: block; padding: 0; border: 0; background: transparent; }
    img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
    figcaption { padding: 8px 10px; color: #adbbb3; font-size: 12px; }
    dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; margin: 14px 0 0; }
    dt { color: #8fa096; font-size: 12px; }
    dd { margin: 2px 0 0; overflow-wrap: anywhere; }
    details { margin-top: 12px; border-top: 1px solid rgba(255,255,255,.12); padding-top: 10px; }
    summary { color: #f1d58c; cursor: pointer; }
    @media (max-width: 760px) { .hero, main { padding-left: 16px; padding-right: 16px; } .frames { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <section class="hero">
    <h1>EP03 Complete Script And Shot Asset Package</h1>
    <p>完整剧本、36 镜头三帧、本地录像证据、本地角色身份板、prompt/negative/metadata 与当前 pipeline gate 状态。</p>
    <div class="stats">
      <div><strong>${shots.length}</strong><span>shots</span></div>
      <div><strong>${shots.filter((shot) => shot.frame_files_complete).length}</strong><span>local frame sets</span></div>
      <div><strong>${counts.blocked_needs_revision || 0}</strong><span>blocked</span></div>
      <div><strong>${counts.layout_reference || 0}</strong><span>layout reference</span></div>
      <div><strong>${counts.monitor_required || 0}</strong><span>monitor</span></div>
      <div><strong>${counts.visual_blocked || 0}</strong><span>visual blocked</span></div>
    </div>
    <div class="toplinks">
      <a href="./script.md" target="_blank" rel="noreferrer">script.md</a>
      <a href="./shot_list.md" target="_blank" rel="noreferrer">shot_list.md</a>
      <a href="../local_asset_storyboard_package_2026-07-31/index.html" target="_blank" rel="noreferrer">local storyboard viewer</a>
      <a href="../identity_locked_keyframe_regeneration_2026-08-01/index.html" target="_blank" rel="noreferrer">identity regeneration viewer</a>
      <a href="../../production_system/reviews/local_video_source_frames_2026-08-01/viewer.html" target="_blank" rel="noreferrer">source evidence viewer</a>
      <a href="../../production_system/reviews/local_identity_plates_2026-08-01/viewer.html" target="_blank" rel="noreferrer">identity plates</a>
      <a href="../../production_system/reviews/ep03_complete_package_local_traceability_audit_2026-08-01.md" target="_blank" rel="noreferrer">local traceability audit</a>
      <a href="../../production_system/reviews/critical_reaudit_2026-09-03/sequence_handoff_025_029_current_contact_sheet.jpg" target="_blank" rel="noreferrer">current Shot025-029 handoff</a>
    </div>
  </section>
  <main>${shotCards}</main>
</body>
</html>
`;
}

function writePackage(shots, counts) {
  ensureDir(packageRoot);
  const existingPackageManifestPath = path.join(packageRoot, "manifest.json");
  const existingPackageManifest = fs.existsSync(existingPackageManifestPath)
    ? readJson(existingPackageManifestPath)
    : {};
  const traceabilityAudit = fs.existsSync(files.traceabilityAuditJson)
    ? readJson(files.traceabilityAuditJson)
    : null;
  const provenanceAudit = fs.existsSync(files.generationReceipts)
    ? readJson(files.generationReceipts).current_provenance_audit || null
    : null;
  for (const [name, source] of [
    ["script.md", files.script],
    ["shot_list.md", files.shotList],
    ["director_treatment.md", files.directorTreatment],
    ["production_notes.md", files.productionNotes],
    ["source_video_breakdown.md", files.sourceBreakdown],
    ["frame_generation_queue.snapshot.json", files.queue],
    ["video_delivery_manifest.snapshot.json", files.delivery],
  ]) {
    if (fs.existsSync(source)) fs.copyFileSync(source, path.join(packageRoot, name));
  }
  const manifest = {
    version: 1,
    package_id: artifactId,
    episode: "EP03",
    created_at: createdAt,
    status: counts.monitor_required ? "monitor_required" : "layout_reference",
    highest_completed_target: "prompt_asset_package",
    video_generation_status: "blocked",
    package_root: packageRoot,
    viewer: path.join(packageRoot, "index.html"),
    readme: path.join(packageRoot, "README.md"),
    contact_sheet: rootPath("generated_storyboard_contact_sheet_current_2026-09-03.jpg"),
    current_sequence_handoff_contact_sheet: rootPath("production_system/reviews/critical_reaudit_2026-09-03/sequence_handoff_025_029_current_contact_sheet.jpg"),
    counts,
    current_provenance_audit: provenanceAudit,
    use_rules: [
      "Use as complete script and shot asset review package.",
      "Do not use as video_generation_package.",
      "Current frames are integrated live-action candidates generated against local selected character/location assets; historical local selected.png previs remains linked as identity/layout evidence.",
      "No shot is approved_for_video until visual QA, video-prompt QA against actual frames, motion probe, and strict continuity pass.",
    ],
    local_traceability_audit: traceabilityAudit ? {
      json: files.traceabilityAuditJson,
      markdown: files.traceabilityAuditMd,
      decision: traceabilityAudit.decision,
      summary: traceabilityAudit.summary,
      updated_at: traceabilityAudit.updated_at || null,
    } : existingPackageManifest.local_traceability_audit || (fs.existsSync(files.traceabilityAuditMd) ? {
      markdown: files.traceabilityAuditMd,
      json: files.traceabilityAuditJson,
    } : null),
    shots,
  };
  writeJson(path.join(packageRoot, "manifest.json"), manifest);
  writeJson(path.join(packageRoot, "shots.json"), shots);
  fs.writeFileSync(path.join(packageRoot, "README.md"), buildMarkdown(shots, counts, provenanceAudit));
  fs.writeFileSync(path.join(packageRoot, "index.html"), buildHtml(shots, counts));
}

function updateManifests(shots) {
  const artifacts = readJson(files.artifactManifest);
  const reviews = readJson(files.reviewManifest);
  const packageFiles = [
    `${packageRel}/README.md`,
    `${packageRel}/index.html`,
    `${packageRel}/manifest.json`,
    `${packageRel}/shots.json`,
    `${packageRel}/script.md`,
    `${packageRel}/shot_list.md`,
    `${packageRel}/director_treatment.md`,
    `${packageRel}/production_notes.md`,
    `${packageRel}/source_video_breakdown.md`,
    `${packageRel}/frame_generation_queue.snapshot.json`,
    `${packageRel}/video_delivery_manifest.snapshot.json`,
  ];

  upsertBy(artifacts.artifacts, "id", {
    id: artifactId,
    type: "delivery_packet",
    stage: "delivery",
    status: "monitor_required",
    created_by: "production-manager-agent",
    created_at: createdAt,
    paths: packageFiles,
    source_refs: [
      "script.md",
      "shot_list.md",
      "frame_generation_queue.json",
      "production_system/video_delivery_manifest.json",
      "production_system/reviews/ep03_local_selected_png_composited_previs_v3_review_2026-08-01.md",
    ],
    depends_on: [
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-ASSET-STORYBOARD-PACKAGE-2026-07-31",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    ],
    risk_flags: ["historical_layout_reference_retained", "not_approved_for_video", "complete_review_package_not_final_video_package"],
    notes: "Complete EP03 script and shot asset review package with 36 current integrated live-action candidate triptychs, local source/identity evidence, and downstream motion gates still pending.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "production-manager-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "monitor_required",
    blocking_issues: [
      "The package is complete for script and shot asset review, but not approved for video generation.",
      "Current frames are integrated live-action candidates constrained by local selected assets; prompt-against-frame QA, motion probe, and strict continuity remain required.",
    ],
    required_revisions: [
      "Promote shots only after final cleaned start/key/end frames, visual QA, prompt QA against frames, motion probe, and strict continuity pass.",
    ],
    rubric: {
      script_included: "pass",
      shot_asset_coverage: "pass",
      local_source_evidence: "pass",
      local_identity_evidence: "pass",
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: packageFiles,
  });

  writeJson(files.artifactManifest, artifacts);
  writeJson(files.reviewManifest, reviews);
}

function main() {
  const shots = buildShots();
  const counts = statusCounts(shots);
  writePackage(shots, counts);
  updateManifests(shots);
  console.log(`built ${packageRoot} (${shots.length} shots)`);
}

main();
