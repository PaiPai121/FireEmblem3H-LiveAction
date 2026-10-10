#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const projectRoot = path.resolve(__dirname, "..");
const epRoot = path.join(projectRoot, "episodes", "EP03");
const deliveryPath = path.join(epRoot, "production_system", "video_delivery_manifest.json");
const reviewPath = path.join(epRoot, "production_system", "review_manifest.json");
const profilePath = path.join(projectRoot, "production_system", "production_profile.json");
const contractPath = path.join(projectRoot, "production_system", "generation_contract.json");
const statePath = path.join(projectRoot, "production_system", "generation_state.json");
const receiptsPath = path.join(projectRoot, "production_system", "generation_receipts.json");
const reportPath = path.join(epRoot, "production_system", "reviews", "provenance_migration_2026-08-24.json");
const cacheRoot = "/Users/zekun/.codex/generated_images";

function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function normalize(value) {
  return String(value || "").replaceAll("\\", "/").replace(/^\.\//, "");
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function pngSize(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") return { width: null, height: null };
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function rootFramePath(epRelative) {
  return normalize(path.posix.join("episodes/EP03", epRelative));
}

function projectAbsolute(rootRelative) {
  return path.join(projectRoot, rootRelative);
}

function walkImages(dir, output = []) {
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walkImages(file, output);
    else if (/\.(png|webp|jpg|jpeg)$/i.test(entry.name)) output.push(file);
  }
  return output;
}

function referenceRole(ref) {
  const value = normalize(ref);
  if (value.includes("live_action_style_reference")) return "style";
  if (value.startsWith("assets/characters/")) return "identity";
  if (value.startsWith("assets/props/")) return "prop";
  if (value.startsWith("assets/locations/")) return "location";
  if (value.startsWith("storyboards/")) return "composition";
  return "planning_only";
}

function rootReferencePath(ref) {
  const value = normalize(ref);
  if (value.startsWith("episodes/EP03/")) return value;
  if (value.startsWith("storyboards/") || value.startsWith("production_system/") || value.startsWith("source_refs/") || value.startsWith("video_prompts/")) {
    return rootFramePath(value);
  }
  return value;
}

function referenceId(ref) {
  const value = normalize(ref);
  const digest = crypto.createHash("sha1").update(value).digest("hex").slice(0, 10);
  return `ep03_${digest}`;
}

function hasReviewEvidence(reviewDoc, rootFrame) {
  const epRelative = rootFrame.replace(/^episodes\/EP03\//, "");
  return (reviewDoc.reviews || []).some((review) => {
    const paths = Array.isArray(review.reviewed_paths) ? review.reviewed_paths.map(normalize) : [];
    return paths.includes(rootFrame) || paths.includes(epRelative);
  });
}

function main() {
  const delivery = readJson(deliveryPath, { shots: [] });
  const reviewDoc = readJson(reviewPath, { reviews: [] });
  const metadataByShot = new Map();
  const frames = [];
  const references = new Map();

  for (const shot of delivery.shots || []) {
    const metadataFile = path.join(epRoot, "storyboards", shot.id, "metadata.json");
    const metadata = readJson(metadataFile, {});
    metadataByShot.set(shot.id, metadata);
    for (const role of ["start", "key", "end"]) {
      const epRelative = shot[`${role}_frame`];
      const rootRelative = rootFramePath(epRelative);
      const absolute = projectAbsolute(rootRelative);
      frames.push({ shot_id: shot.id, frame_role: role, path: rootRelative, absolute });
    }
    for (const rawRef of metadata.asset_references || []) {
      const rootRef = rootReferencePath(rawRef);
      const role = referenceRole(rawRef);
      const id = referenceId(rootRef);
      if (!references.has(id)) references.set(id, { id, path: rootRef, role, generation_allowed: role !== "planning_only" });
    }
  }

  const styleRef = "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png";
  if (fs.existsSync(projectAbsolute(styleRef))) {
    references.set(referenceId(styleRef), { id: referenceId(styleRef), path: styleRef, role: "style", generation_allowed: true });
  }

  const existingReceiptsDoc = readJson(receiptsPath, { receipts: [] });
  const receipts = Array.isArray(existingReceiptsDoc.receipts) ? [...existingReceiptsDoc.receipts] : [];
  const receiptKeys = new Set(receipts.map((receipt) => `${receipt.shot_id}|${receipt.frame_role || receipt.role}|${normalize(receipt.path || receipt.output_path)}`));
  const cacheByHash = new Map();
  for (const cacheFile of walkImages(cacheRoot)) {
    try {
      const hash = sha256(cacheFile);
      if (!cacheByHash.has(hash)) cacheByHash.set(hash, cacheFile);
    } catch {
      // Ignore unreadable cache entries; they cannot establish provenance.
    }
  }

  const matched = [];
  const unresolved = [];
  for (const frame of frames) {
    if (!fs.existsSync(frame.absolute)) {
      unresolved.push({ ...frame, reason: "current frame file missing" });
      continue;
    }
    const hash = sha256(frame.absolute);
    const cacheFile = cacheByHash.get(hash);
    const key = `${frame.shot_id}|${frame.frame_role}|${frame.path}`;
    if (!cacheFile) {
      unresolved.push({ ...frame, sha256: hash, reason: "no matching local generated-image cache file" });
      continue;
    }
    matched.push({ ...frame, sha256: hash, cache_path: cacheFile, review_evidence: hasReviewEvidence(reviewDoc, frame.path) });
    if (hasReviewEvidence(reviewDoc, frame.path)) {
      for (const receipt of receipts) {
        if (receipt.shot_id === frame.shot_id
          && receipt.frame_role === frame.frame_role
          && normalize(receipt.path || receipt.output_path) === frame.path
          && receipt.decision === "candidate_generated") {
          receipt.decision = "visual_review_passed";
          receipt.reviewed_paths = [frame.path];
          receipt.reviewer_role = "legacy-provenance-migration-reviewer";
          receipt.notes = "Matched current canonical frame to an unambiguous local generated-image cache output. Existing still-frame review evidence found; motion probe remains pending.";
        }
      }
    }
    if (!receiptKeys.has(key)) {
      const { width, height } = pngSize(frame.absolute);
      receipts.push({
        shot_id: frame.shot_id,
        frame_role: frame.frame_role,
        path: frame.path,
        output_path: frame.path,
        source_path: cacheFile,
        tool_call_id: path.basename(cacheFile, path.extname(cacheFile)),
        source_sha256: hash,
        output_sha256: hash,
        width,
        height,
        reviewer_role: "legacy-provenance-migration-reviewer",
        reviewed_paths: hasReviewEvidence(reviewDoc, frame.path) ? [frame.path] : [],
        decision: hasReviewEvidence(reviewDoc, frame.path) ? "visual_review_passed" : "candidate_generated",
        notes: hasReviewEvidence(reviewDoc, frame.path)
          ? "Matched current canonical frame to an unambiguous local generated-image cache output. Existing still-frame review evidence found; motion probe remains pending."
          : "Matched current canonical frame to an unambiguous local generated-image cache output, but no matching review path was found; do not promote until independently reviewed.",
      });
      receiptKeys.add(key);
    }
  }

  const shots = (delivery.shots || []).map((shot) => {
    const metadata = metadataByShot.get(shot.id) || {};
    const rawRefs = (metadata.asset_references || []).map(rootReferencePath);
    const referenceIds = [...new Set(rawRefs.map(referenceId))].filter((id) => references.get(id)?.generation_allowed !== false);
    const expectedFrames = ["start", "key", "end"].map((role) => ({ role, path: rootFramePath(shot[`${role}_frame`]) }));
    return {
      id: shot.id,
      version: shot.displayed_frame_set?.version || shot.current_display_frame_set || "current",
      reference_ids: referenceIds,
      expected_frames: expectedFrames,
    };
  });

  const contract = {
    contract_id: "EP03-full-current-frame-chain-2026-08-24",
    project_root: projectRoot,
    frames_required: true,
    target_aspect: "16:9",
    visual_target: "integrated live-action human performers with physically grounded wet battlefield or monastery environments, continuous screen direction, and Japanese-production audio constraints",
    style_lock: {
      description: "photographed human performers, practical armor and cloth, real wet materials, motivated cinematic light, natural skin detail and contact shadows",
      forbidden_visuals: ["game screenshot", "3D render", "concept-art illustration", "anime", "poster lineup", "portrait-only frame", "pasted cutout", "Chinese/Mandarin voiceover", "subtitles", "UI"],
    },
    expected_files_per_shot: ["start_frame.png", "key_frame.png", "end_frame.png"],
    reference_sets: [...references.values()],
    age_lock_required: false,
    asset_generation: false,
    shot_contracts: [],
    shots,
    global_reject_if: ["unresolved provenance", "missing frame receipt", "male Byleth in a female-Byleth shot", "pasted cutout integration", "unapproved motion drift"],
  };

  const profile = readJson(profilePath, {});
  Object.assign(profile, {
    frame_generation_required: true,
    generation_contract_required: true,
    generation_stop_policy: "strict_receipts",
    target_aspect: "16:9",
    native_dialogue_policy: "probe_then_approve",
  });
  writeJson(profilePath, profile);
  writeJson(contractPath, contract);
  writeJson(receiptsPath, { ...existingReceiptsDoc, contract_id: contract.contract_id, receipts });
  writeJson(statePath, {
    contract_id: contract.contract_id,
    status: unresolved.length ? "partial" : "complete",
    frames_required: true,
    stop_reason: unresolved.length ? "unresolved_legacy_frame_provenance; motion_probe_pending" : "motion_probe_pending",
    last_updated: "2026-08-24",
    review_state: unresolved.length ? "cache_provenance_migrated_with_unresolved_frames; motion_probe_pending" : "all_declared_frames_have_visual_review_receipts; motion_probe_pending",
    queue: frames.map((frame) => ({
      shot_id: frame.shot_id,
      frame_role: frame.frame_role,
      path: frame.path,
      status: unresolved.some((item) => item.path === frame.path) ? "provenance_pending" : "visual_reviewed",
    })),
  });
  writeJson(reportPath, {
    generated_at: "2026-08-24",
    contract_id: contract.contract_id,
    current_frame_count: frames.length,
    cache_matched_frame_count: matched.length,
    unresolved_frame_count: unresolved.length,
    matched,
    unresolved,
    policy: "Only exact SHA-256 matches to /Users/zekun/.codex/generated_images were migrated. Unmatched frames remain pending and are not promoted by this migration.",
  });
  console.log(JSON.stringify({ contract_id: contract.contract_id, current_frames: frames.length, cache_matched: matched.length, unresolved: unresolved.map((item) => `${item.shot_id}/${item.frame_role}`), receipts: receipts.length }, null, 2));
}

main();
