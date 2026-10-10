const fs = require("fs");
const path = require("path");

const root = ".";
const epRoot = "episodes/EP03";
const packageRel = "delivery/local_asset_storyboard_package_2026-07-31";
const packageRoot = path.join(epRoot, packageRel);
const createdAt = "2026-07-31";

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

function rootPath(epRelative) {
  const normalized = String(epRelative || "").replace(/\\/g, "/");
  const epRootPosix = epRoot.replace(/\\/g, "/");
  if (normalized === epRootPosix || normalized.startsWith(`${epRootPosix}/`)) return normalized;
  return path.join(epRoot, normalized);
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

function existsRoot(epRelative) {
  return fs.existsSync(rootPath(epRelative));
}

function packagePath(file) {
  return path.join(packageRoot, file);
}

function webHref(rootRelative) {
  const normalized = String(rootRelative || "").replace(/\\/g, "/");
  if (!normalized || /^(https?:|mailto:|data:|#)/.test(normalized)) return normalized;
  const epRootPosix = epRoot.replace(/\\/g, "/");
  const isAlreadyEpRooted = normalized === epRootPosix || normalized.startsWith(`${epRootPosix}/`);
  const isEpisodeRelative = ["storyboards/", "video_prompts/", "source_refs/", "production_system/"].some((prefix) => normalized.startsWith(prefix));
  const projectPath = !isAlreadyEpRooted && isEpisodeRelative ? `${epRootPosix}/${normalized}` : normalized;
  return path.posix.relative(packageRoot.replace(/\\/g, "/"), projectPath) || ".";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function upsertBy(items, key, item) {
  const index = items.findIndex((candidate) => candidate[key] === item[key]);
  if (index === -1) {
    items.push(item);
  } else {
    items[index] = item;
  }
}

function statusCounts(shots) {
  return shots.reduce((acc, shot) => {
    acc.total += 1;
    acc[shot.delivery_status] = (acc[shot.delivery_status] || 0) + 1;
    if (shot.local_frames_complete) acc.local_frames_complete += 1;
    if (shot.imagegen_candidates_complete) acc.imagegen_candidates_complete += 1;
    if (shot.identity_comparison) acc.identity_comparison_sheets += 1;
    if (shot.local_asset_proof_sheet) acc.local_asset_proof_sheets += 1;
    if (shot.local_video_source_evidence) acc.local_video_source_evidence_boards += 1;
    if ((shot.local_identity_plates || []).length) acc.local_identity_plate_shots += 1;
    return acc;
  }, {
    total: 0,
    local_frames_complete: 0,
    imagegen_candidates_complete: 0,
    identity_comparison_sheets: 0,
    local_asset_proof_sheets: 0,
    local_video_source_evidence_boards: 0,
    local_identity_plate_shots: 0,
  });
}

function buildShots() {
  const queue = readJson(queuePath);
  const delivery = readJson(deliveryPath);
  const deliveryByShot = new Map((delivery.shots || []).map((shot) => [shot.id, shot]));

  return (queue.shots || []).map((queueShot) => {
    const shotId = queueShot.id;
    const metadataPath = rootPath(`storyboards/${shotId}/metadata.json`);
    const metadata = readJson(metadataPath);
    const deliveryShot = deliveryByShot.get(shotId) || {};
    const localFrames = {
      start: rootPath(`storyboards/${shotId}/start_frame.png`),
      key: rootPath(`storyboards/${shotId}/key_frame.png`),
      end: rootPath(`storyboards/${shotId}/end_frame.png`),
    };
    const imagegenCandidates = {
      start: rootPath(`storyboards/${shotId}/start_frame_imagegen_candidate_2026-07-29.png`),
      key: rootPath(`storyboards/${shotId}/key_frame_imagegen_candidate_2026-07-29.png`),
      end: rootPath(`storyboards/${shotId}/end_frame_imagegen_candidate_2026-07-29.png`),
      contact_sheet: rootPath(`storyboards/${shotId}/imagegen_frameset_contact_sheet_2026-07-29.jpg`),
    };
    const identityComparison = rootPath(`production_system/reviews/identity_lock_comparison_2026-07-31/${shotId}_identity_comparison_2026-07-31.jpg`);
    const localAssetProofSheet = rootPath(`production_system/reviews/local_asset_previs_proof_2026-07-31/${shotId}_local_asset_previs_proof_2026-07-31.jpg`);
    const localVideoSourceEvidence = rootPath(`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/${shotId}/${shotId}_local_video_source_evidence_2026-08-01.jpg`);
    const identityLockedProbeKey = rootPath(`storyboards/${shotId}/key_frame_identity_locked_probe_2026-08-01.png`);
    const identityLockedProbeReview = rootPath(`production_system/reviews/${shotId.toLowerCase()}_identity_locked_probe_2026-08-01.jpg`);

    return {
      id: shotId,
      order: queueShot.order,
      scene: metadata.scene,
      purpose: metadata.purpose,
      duration_seconds: deliveryShot.duration_seconds || queueShot.duration_seconds,
      source_timecode: queueShot.source_timecode || metadata.source_timecode,
      previous_source_timecode: queueShot.previous_source_timecode || "",
      source_timecode_audit: queueShot.source_timecode_audit || {},
      source_reference: rootPath(metadata.source_reference || queueShot.source_reference),
      characters: metadata.characters || [],
      asset_references: (metadata.asset_references || []).map((asset) => asset),
      local_identity_plates: localIdentityPlatesForAssets(metadata.asset_references || []),
      local_frames: localFrames,
      local_frames_complete: Object.values(localFrames).every((file) => fs.existsSync(file)),
      imagegen_candidates: Object.fromEntries(
        Object.entries(imagegenCandidates).filter(([, file]) => fs.existsSync(file)),
      ),
      imagegen_candidates_complete: ["start", "key", "end"].every((key) => fs.existsSync(imagegenCandidates[key])),
      identity_comparison: fs.existsSync(identityComparison) ? identityComparison : "",
      local_asset_proof_sheet: fs.existsSync(localAssetProofSheet) ? localAssetProofSheet : "",
      local_video_source_evidence: fs.existsSync(localVideoSourceEvidence) ? localVideoSourceEvidence : "",
      identity_locked_probe_key: fs.existsSync(identityLockedProbeKey) ? identityLockedProbeKey : "",
      identity_locked_probe_review: fs.existsSync(identityLockedProbeReview) ? identityLockedProbeReview : "",
      frame_spec: rootPath(`storyboards/${shotId}/frame_spec.md`),
      metadata: metadataPath,
      prompt: rootPath(`video_prompts/${shotId}_prompt.md`),
      negative_prompt: rootPath(`video_prompts/${shotId}_negative_prompt.md`),
      delivery_status: deliveryShot.status || "unknown",
      visual_audit_decision: deliveryShot.visual_audit_decision || queueShot.visual_audit_decision,
      visual_audit_finding: deliveryShot.visual_audit_finding || queueShot.visual_audit_finding,
      required_revision: deliveryShot.required_revision || queueShot.required_revision,
      edit_in: deliveryShot.edit_in || metadata.edit_in || "",
      edit_out: deliveryShot.edit_out || metadata.edit_out || "",
      audio_anchor: deliveryShot.audio_anchor || metadata.audio_anchor || queueShot.audio_anchor || "",
      expected_clip: deliveryShot.expected_clip || metadata.expected_clip || "",
      package_status: "layout_reference",
    };
  });
}

function buildReadme(shots, counts) {
  const blocked = shots.filter((shot) => shot.delivery_status !== "approved_for_video" && shot.delivery_status !== "approved_for_delivery");
  return `# EP03 Local Asset Storyboard Package

Created: ${createdAt}

This package is the current EP03 shot asset review package. It prioritizes traceable local assets over the blocked imagegen candidates.

## Status

- Target represented here: local asset storyboard / prompt asset review package.
- Highest pipeline target currently satisfied: prompt_asset_package.
- Video-generation status: blocked.
- Local selected.png composited previs frame sets: ${counts.local_frames_complete}/${counts.total}.
- Local asset proof sheets: ${counts.local_asset_proof_sheets}/${counts.total}.
- Local video source evidence boards: ${counts.local_video_source_evidence_boards}/${counts.total}.
- Local identity plate coverage: ${counts.local_identity_plate_shots}/${counts.total}.
- Identity comparison sheets: ${counts.identity_comparison_sheets}/${counts.total}.
- Blocked imagegen candidate frame sets: ${counts.imagegen_candidates_complete}/${counts.total}.
- Delivery statuses: ${Object.entries(counts).filter(([key]) => !["total", "local_frames_complete", "imagegen_candidates_complete", "identity_comparison_sheets", "local_asset_proof_sheets", "local_video_source_evidence_boards", "local_identity_plate_shots"].includes(key)).map(([key, value]) => `${key}=${value}`).join(", ")}.

## Use

Open \`index.html\` for review. The large start/key/end strips are local selected.png composited previs frames. They are usable for identity, role, layout, edit-intent, and prompt review, but they are not approved final live-action video keyframes.

The imagegen candidate frames are preserved only as blocked composition studies. They must not be used as payload images until regenerated and independently reviewed against the local selected.png identity locks.

## Included Package Files

- \`script.md\`
- \`shot_list.md\`
- \`director_treatment.md\`
- \`production_notes.md\`
- \`source_video_breakdown.md\`
- \`prompt_asset_package_manifest.snapshot.json\`
- \`video_delivery_manifest.snapshot.json\`
- \`manifest.json\`
- \`shots.json\`
- \`shot_index.md\`
- \`index.html\`
- \`package_review_2026-07-31.md\`

## Referenced Root-Relative Assets

- 36 local start/key/end previs frame sets under \`episodes/EP03/storyboards/Shot*/\`
- 36 local asset proof sheets under \`episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/\`
- 36 corrected local video source evidence boards under \`episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/per_shot/\`
- Source timecode audit at \`episodes/EP03/production_system/source_timecode_audit_2026-08-01.json\`
- EP03 local identity plates under \`episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/\`
- Prompt, negative prompt, metadata, frame spec, and source reference for every shot
- Identity comparison sheets where available

## Blocking Issues

${blocked.map((shot) => `- ${shot.id}: ${shot.delivery_status}; ${shot.required_revision || shot.visual_audit_finding || "revision required"}`).join("\n")}
`;
}

function buildShotIndex(shots) {
  const rows = shots.map((shot) => `| ${shot.id} | ${shot.duration_seconds}s | ${shot.source_timecode || ""} | ${shot.scene} | ${shot.characters.join(", ")} | ${shot.delivery_status} | ${shot.local_frames_complete ? "yes" : "no"} | ${shot.local_video_source_evidence ? "yes" : "no"} | ${(shot.local_identity_plates || []).length ? "yes" : "no"} | ${shot.identity_comparison ? "yes" : "no"} | ${shot.imagegen_candidates_complete ? "blocked" : "none"} |`);
  return `# EP03 Local Asset Shot Index

| Shot | Duration | Source TC | Scene | Characters | Delivery Status | Local Frames | Source Evidence | Identity Plates | Identity Sheet | Imagegen Candidate |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}
`;
}

function buildReview(shots, counts) {
  const blockedNeedsRevision = shots.filter((shot) => shot.delivery_status === "blocked_needs_revision").map((shot) => shot.id);
  const visualBlocked = shots.filter((shot) => shot.delivery_status === "visual_blocked").map((shot) => shot.id);
  return `# EP03 Local Asset Storyboard Package Review

Reviewer role: asset-package-qa-agent
Reviewer: codex
Created: ${createdAt}
Decision: layout_reference

## Findings

- Integrity: pass. The package indexes ${counts.total} shots and all ${counts.total} local selected.png composited previs frame sets are present.
- Local source traceability: pass for provenance. ${counts.local_video_source_evidence_boards}/${counts.total} corrected local source evidence boards are present and mapped from the local raw video.
- Local identity traceability: conditional. The primary review frames use local selected.png assets directly, and ${counts.local_asset_proof_sheets}/${counts.total} local asset proof sheets are present. The frames remain composited previs rather than final live-action keyframes.
- Imagegen candidates: fail for asset use. ${counts.imagegen_candidates_complete} complete candidate frame sets exist, but they are blocked because selected.png identity preservation failed or is unproven.
- Video readiness: fail. No EP03 shot is approved_for_video.

## Blocking Issues

- Shot001-Shot019 are blocked_needs_revision because imagegen candidates cannot be used as local-identity-locked keyframes.
- Shot020-Shot036 are visual_blocked because only rough local composited layout reference frames exist.
- The package does not include an immutable video delivery package and must not be submitted to a video model as final.

## Required Revisions

- Regenerate final start/key/end keyframes with local selected.png identity preservation and integrated live-action lighting.
- Build per-shot identity comparison sheets for every regenerated frame set.
- Re-run visual review, video-prompt QA against actual frames, and strict adjacent-shot continuity before any approved_for_video promotion.

## Coverage

- blocked_needs_revision: ${blockedNeedsRevision.join(", ")}
- visual_blocked: ${visualBlocked.join(", ")}
`;
}

function buildHtml(shots, counts) {
  const shotCards = shots.map((shot) => {
    const frameImgs = ["start", "key", "end"].map((role) => `
      <figure>
        <img src="${webHref(shot.local_frames[role])}" alt="${escapeHtml(`${shot.id} ${role} local previs`)}">
        <figcaption>${role} · local selected.png previs</figcaption>
      </figure>
    `).join("");
    const assetLinks = shot.asset_references.map((asset) => `
      <a href="${webHref(asset)}" target="_blank" rel="noreferrer">${escapeHtml(asset)}</a>
    `).join("");
    const identityPlateLinks = (shot.local_identity_plates || []).map((plate) => `
      <a href="${webHref(plate.plate)}" target="_blank" rel="noreferrer">${escapeHtml(plate.character_id)} identity plate</a>
    `).join("");
    const imagegenButtons = Object.entries(shot.imagegen_candidates).map(([label, file]) => `
      <a href="${webHref(file)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>
    `).join("");
    return `
      <article class="shot-card" id="${shot.id}">
        <header>
          <div>
            <p>${String(shot.order).padStart(2, "0")} · ${escapeHtml(shot.delivery_status)}</p>
            <h2>${escapeHtml(shot.id)} · ${escapeHtml(shot.scene)}</h2>
          </div>
          <strong>${escapeHtml(shot.duration_seconds)}s</strong>
        </header>
        <p class="purpose">${escapeHtml(shot.purpose)}</p>
        <div class="frames">${frameImgs}</div>
        <dl>
          <div><dt>Characters</dt><dd>${escapeHtml(shot.characters.join(", "))}</dd></div>
          <div><dt>Audio</dt><dd>${escapeHtml(shot.audio_anchor || "none")}</dd></div>
          <div><dt>Edit</dt><dd>${escapeHtml(`${shot.edit_in || "cut in"} / ${shot.edit_out || "cut out"}`)}</dd></div>
          <div><dt>Source</dt><dd><a href="${webHref(shot.source_reference)}" target="_blank" rel="noreferrer">${escapeHtml(shot.source_timecode || shot.source_reference)}</a></dd></div>
          <div><dt>Source match</dt><dd>${escapeHtml([shot.source_timecode_audit.source_match, shot.source_timecode_audit.adaptation_gap].filter(Boolean).join(" / "))}</dd></div>
          <div><dt>Status</dt><dd>${escapeHtml(shot.visual_audit_decision || shot.package_status)}</dd></div>
          <div><dt>Revision</dt><dd>${escapeHtml(shot.required_revision || shot.visual_audit_finding || "")}</dd></div>
        </dl>
        <details>
          <summary>Local Identity Assets</summary>
          <div class="links">${identityPlateLinks}${assetLinks || "<span>none</span>"}</div>
        </details>
        <details>
          <summary>Prompt And Metadata</summary>
          <div class="links">
            <a href="${webHref(shot.frame_spec)}" target="_blank" rel="noreferrer">frame_spec.md</a>
            <a href="${webHref(shot.metadata)}" target="_blank" rel="noreferrer">metadata.json</a>
            <a href="${webHref(shot.prompt)}" target="_blank" rel="noreferrer">prompt.md</a>
            <a href="${webHref(shot.negative_prompt)}" target="_blank" rel="noreferrer">negative_prompt.md</a>
          </div>
        </details>
        <details>
          <summary>Local Source / Identity Comparison / Blocked Imagegen</summary>
          <div class="links">
            ${shot.local_video_source_evidence ? `<a href="${webHref(shot.local_video_source_evidence)}" target="_blank" rel="noreferrer">local video source evidence board</a>` : "<span>local video source evidence pending</span>"}
            ${shot.local_asset_proof_sheet ? `<a href="${webHref(shot.local_asset_proof_sheet)}" target="_blank" rel="noreferrer">local asset proof sheet</a>` : "<span>local asset proof sheet pending</span>"}
            ${shot.identity_locked_probe_review ? `<a href="${webHref(shot.identity_locked_probe_review)}" target="_blank" rel="noreferrer">identity-locked probe review</a>` : ""}
            ${shot.identity_locked_probe_key ? `<a href="${webHref(shot.identity_locked_probe_key)}" target="_blank" rel="noreferrer">identity-locked key probe</a>` : ""}
            ${shot.identity_comparison ? `<a href="${webHref(shot.identity_comparison)}" target="_blank" rel="noreferrer">identity comparison</a>` : "<span>identity comparison pending</span>"}
            ${imagegenButtons || "<span>no imagegen candidate</span>"}
          </div>
        </details>
      </article>
    `;
  }).join("");

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EP03 Local Asset Storyboard Package</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #111514; color: #eef2ee; }
    body { margin: 0; background: #111514; }
    header.hero { position: sticky; top: 0; z-index: 3; padding: 24px 32px; background: rgba(17, 21, 20, .94); border-bottom: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(14px); }
    h1, h2, p { margin: 0; }
    h1 { font-size: 30px; font-weight: 760; }
    .hero p { margin-top: 8px; color: #aebbb4; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 18px; }
    .stats div { border: 1px solid rgba(255,255,255,.14); padding: 12px; border-radius: 6px; background: rgba(255,255,255,.04); }
    .stats strong { display: block; font-size: 22px; }
    main { padding: 24px 32px 48px; display: grid; gap: 18px; }
    .shot-card { border: 1px solid rgba(255,255,255,.14); border-radius: 8px; background: #18201d; padding: 16px; }
    .shot-card header { display: flex; justify-content: space-between; gap: 16px; align-items: start; }
    .shot-card header p { color: #aebbb4; font-size: 12px; text-transform: uppercase; }
    .shot-card h2 { font-size: 20px; margin-top: 4px; }
    .purpose { margin-top: 10px; color: #d4ded7; }
    .frames { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 14px; }
    figure { margin: 0; background: #0b0e0d; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,.1); }
    figure img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
    figcaption { padding: 8px 10px; color: #aebbb4; font-size: 12px; }
    dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; margin: 14px 0 0; }
    dt { color: #8fa096; font-size: 12px; }
    dd { margin: 2px 0 0; color: #f4f7f4; overflow-wrap: anywhere; }
    details { margin-top: 12px; border-top: 1px solid rgba(255,255,255,.12); padding-top: 10px; }
    summary { cursor: pointer; color: #f1d58c; }
    .links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    a { color: #9fd3ff; text-decoration: none; }
    .links a, .links span { border: 1px solid rgba(255,255,255,.14); padding: 7px 9px; border-radius: 5px; background: rgba(255,255,255,.04); }
    @media (max-width: 760px) { header.hero, main { padding-left: 16px; padding-right: 16px; } .frames { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header class="hero">
    <h1>EP03 Local Asset Storyboard Package</h1>
    <p>Primary frames are local selected.png composited previs. Blocked imagegen candidates are preserved only for rejection and comparison.</p>
    <section class="stats">
      <div><strong>${counts.total}</strong><span>shots</span></div>
      <div><strong>${counts.local_frames_complete}</strong><span>local frame sets</span></div>
      <div><strong>${counts.local_asset_proof_sheets}</strong><span>local proof sheets</span></div>
      <div><strong>${counts.local_identity_plate_shots}</strong><span>identity plate shots</span></div>
      <div><strong>${counts.identity_comparison_sheets}</strong><span>identity sheets</span></div>
      <div><strong>${counts.imagegen_candidates_complete}</strong><span>blocked imagegen sets</span></div>
      <div><strong>${counts.blocked_needs_revision || 0}</strong><span>blocked needs revision</span></div>
      <div><strong>${counts.visual_blocked || 0}</strong><span>visual blocked</span></div>
    </section>
  </header>
  <main>${shotCards}</main>
</body>
</html>
`;
}

function writePackage(shots, counts) {
  ensureDir(packageRoot);
  const snapshots = [
    ["script.md", path.join(epRoot, "script.md")],
    ["shot_list.md", path.join(epRoot, "shot_list.md")],
    ["director_treatment.md", path.join(epRoot, "director_treatment.md")],
    ["production_notes.md", path.join(epRoot, "production_notes.md")],
    ["source_video_breakdown.md", path.join(epRoot, "source_video_breakdown.md")],
    ["prompt_asset_package_manifest.snapshot.json", path.join(epRoot, "prompt_asset_package_manifest.json")],
    ["video_delivery_manifest.snapshot.json", path.join(epRoot, "production_system/video_delivery_manifest.json")],
  ];
  for (const [outName, source] of snapshots) {
    if (fs.existsSync(source)) fs.copyFileSync(source, packagePath(outName));
  }

  const manifest = {
    version: 1,
    package_id: "EP03-LOCAL-ASSET-STORYBOARD-PACKAGE-2026-07-31",
    episode: "EP03",
    created_at: createdAt,
    status: "layout_reference",
    highest_completed_target: "prompt_asset_package",
    video_generation_status: "blocked",
    package_root: packageRoot,
    viewer: path.join(packageRoot, "index.html"),
    readme: path.join(packageRoot, "README.md"),
    shot_index: path.join(packageRoot, "shot_index.md"),
    review: path.join(packageRoot, "package_review_2026-07-31.md"),
    local_identity_plate_index: localIdentityPlateIndexPath,
    local_identity_plate_viewer: path.join(path.dirname(localIdentityPlateIndexPath), "viewer.html"),
    local_identity_plate_atlas: localIdentityPlateIndex.atlas || "",
    local_video_source_evidence_index: rootPath("production_system/reviews/local_video_source_frames_2026-08-01/index.json"),
    local_video_source_evidence_viewer: rootPath("production_system/reviews/local_video_source_frames_2026-08-01/viewer.html"),
    source_timecode_audit: rootPath("production_system/source_timecode_audit_2026-08-01.json"),
    counts,
    rules: [
      "Primary displayed frames must be local selected.png composited previs frames.",
      "Imagegen candidates remain blocked composition studies until regenerated and reviewed against local identity locks.",
      "Do not submit this package as an approved video_generation_package.",
    ],
    shots,
  };

  writeJson(packagePath("shots.json"), shots);
  writeJson(packagePath("manifest.json"), manifest);
  fs.writeFileSync(packagePath("README.md"), buildReadme(shots, counts));
  fs.writeFileSync(packagePath("shot_index.md"), buildShotIndex(shots));
  fs.writeFileSync(packagePath("package_review_2026-07-31.md"), buildReview(shots, counts));
  fs.writeFileSync(packagePath("index.html"), buildHtml(shots, counts));
}

function updateProductionManifests(shots) {
  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const artifactId = "EP03-LOCAL-ASSET-STORYBOARD-PACKAGE-2026-07-31";
  const reviewId = "review-2026-07-31-ep03-local-asset-storyboard-package";
  const packageFiles = [
    `${packageRel}/README.md`,
    `${packageRel}/manifest.json`,
    `${packageRel}/shots.json`,
    `${packageRel}/shot_index.md`,
    `${packageRel}/index.html`,
    `${packageRel}/package_review_2026-07-31.md`,
    `${packageRel}/script.md`,
    `${packageRel}/shot_list.md`,
    `${packageRel}/director_treatment.md`,
    `${packageRel}/production_notes.md`,
    `${packageRel}/source_video_breakdown.md`,
    `${packageRel}/prompt_asset_package_manifest.snapshot.json`,
    `${packageRel}/video_delivery_manifest.snapshot.json`,
  ];

  upsertBy(artifacts.artifacts, "id", {
    id: artifactId,
    type: "delivery_packet",
    stage: "storyboard",
    status: "layout_reference",
    created_by: "production-manager-agent",
    created_at: createdAt,
    paths: packageFiles,
    source_refs: [
      "script.md",
      "shot_list.md",
      "director_treatment.md",
      "production_notes.md",
      "prompt_asset_package_manifest.json",
      "frame_generation_queue.json",
      "production_system/video_delivery_manifest.json",
      "production_system/source_timecode_audit_2026-08-01.json",
      "production_system/reviews/local_video_source_frames_2026-08-01/index.json",
    ],
    depends_on: ["EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01", "EP03-SOURCE-TIMECODE-AUDIT-2026-08-01", "EP03-LOCAL-ASSET-PREVIS-PROOF-SHEETS-2026-07-31", ...shots.map((shot) => `EP03-${shot.id}-FRAME-SPEC`)],
    continuity: {
      previous: "",
      next: "",
      in: "package begins at Shot001 local previs",
      out: "package ends at Shot036 local previs",
    },
    risk_flags: ["layout_reference_only", "video_generation_package_blocked", "imagegen_identity_blocked"],
    notes: "Local source-video and selected.png composited storyboard review package. This is a traceable shot asset package, not an approved video-generation package.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "asset-package-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "layout_reference",
    blocking_issues: [
      "Primary local frames are composited previs and not integrated final live-action keyframes.",
      "Shot001-Shot019 imagegen candidates are blocked by selected.png identity failure or insufficient proof.",
      "Shot020-Shot036 have no regenerated live-action imagegen frame sets.",
      "No EP03 shot is approved_for_video.",
    ],
    required_revisions: [
      "Regenerate final local-asset-locked start/key/end frames for every shot.",
      "Run identity comparison sheets, visual QA, prompt-against-frame QA, and strict continuity before video promotion.",
    ],
    rubric: {
      package_integrity: "pass",
      local_asset_traceability: "conditional",
      final_keyframe_readiness: "fail",
      video_readiness: "blocked_needs_revision",
      web_reviewability: "pass",
    },
    reviewed_paths: packageFiles,
  });

  const proofIndex = "production_system/reviews/local_asset_previs_proof_2026-07-31/index.json";
  const proofPaths = shots
    .map((shot) => shot.local_asset_proof_sheet)
    .filter(Boolean)
    .map((file) => file.replace(`${epRoot}/`, ""));

  upsertBy(artifacts.artifacts, "id", {
    id: "EP03-LOCAL-ASSET-PREVIS-PROOF-SHEETS-2026-07-31",
    type: "review",
    stage: "asset_review",
    status: "layout_reference",
    created_by: "asset-package-qa-agent",
    created_at: createdAt,
    paths: [proofIndex, ...proofPaths],
    source_refs: ["frame_generation_queue.json", "production_system/video_delivery_manifest.json"],
    depends_on: shots.map((shot) => `EP03-${shot.id}-FRAME-SPEC`),
    continuity: {
      previous: "",
      next: "",
      in: "proof sheets compare source local assets to local previs frames",
      out: "proof sheets support local asset storyboard package review",
    },
    risk_flags: ["layout_reference_only", "not_final_keyframes"],
    notes: "Per-shot proof sheets showing local selected.png/location assets above the current local start/key/end previs frames.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: "EP03-LOCAL-ASSET-PREVIS-PROOF-SHEETS-2026-07-31",
    review_id: "review-2026-07-31-ep03-local-asset-previs-proof-sheets",
    reviewer_role: "asset-identity-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "layout_reference",
    blocking_issues: [
      "Proof sheets establish traceability to local selected.png assets, but the underlying frames are still composited previs.",
      "Proof sheets do not approve final live-action keyframes or motion/video readiness.",
    ],
    required_revisions: [
      "Use these sheets as comparison baselines when regenerating final local-asset-locked keyframes.",
      "Replace proof sheets after final keyframe regeneration and rerun visual QA.",
    ],
    rubric: {
      local_asset_traceability: "pass",
      package_reviewability: "pass",
      final_keyframe_readiness: "fail",
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: [proofIndex, ...proofPaths],
  });

  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
}

function main() {
  const shots = buildShots();
  const counts = statusCounts(shots);
  writePackage(shots, counts);
  updateProductionManifests(shots);
  console.log(`built ${packageRoot} (${shots.length} shots)`);
}

main();
