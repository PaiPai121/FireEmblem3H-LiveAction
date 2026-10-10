const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const epRoot = "episodes/EP03";
const manifestPath = path.join(epRoot, "production_system", "video_delivery_manifest.json");
const queuePath = path.join(epRoot, "frame_generation_queue.json");
const scriptPath = path.join(epRoot, "script.md");
const outputPath = "site/ep03_storyboard_data.js";
const identityReviewPath = path.join(epRoot, "production_system", "identity_lock_review_2026-07-31.json");
const localIdentityPlateIndexPath = path.join(epRoot, "production_system", "reviews", "local_identity_plates_2026-08-01", "index.json");
let identityReview = null;
let localIdentityPlateIndex = null;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function refreshCurrentContactSheet(framePaths, outputPath, columns, cellWidth, cellHeight) {
  if (!framePaths.length || !framePaths.every((file) => fs.existsSync(file))) return;
  const rows = Math.ceil(framePaths.length / columns);
  const filters = framePaths.map((_, index) => (
    `[${index}:v]scale=${cellWidth}:${cellHeight}:force_original_aspect_ratio=decrease,pad=${cellWidth}:${cellHeight}:(ow-iw)/2:(oh-ih)/2[v${index}]`
  )).join(";");
  const layout = framePaths.map((_, index) => (
    `${(index % columns) * cellWidth}_${Math.floor(index / columns) * cellHeight}`
  )).join("|");
  const filter = `${filters};${framePaths.map((_, index) => `[v${index}]`).join("")}xstack=inputs=${framePaths.length}:layout=${layout}:fill=black`;
  const ffmpeg = process.env.FFMPEG_BIN || "/opt/homebrew/bin/ffmpeg";
  if (!fs.existsSync(ffmpeg)) return;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const args = ["-y", ...framePaths.flatMap((file) => ["-i", file]), "-filter_complex", filter, "-frames:v", "1", "-an", outputPath];
  const result = childProcess.spawnSync(ffmpeg, args, { stdio: "ignore" });
  if (result.status !== 0) throw new Error(`Could not refresh contact sheet: ${outputPath}`);
  if (!rows) throw new Error(`Contact sheet has no rows: ${outputPath}`);
}

function refreshCurrentContactSheets(manifest) {
  const shots = [...(manifest.shots || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  const currentFrames = shots.flatMap((shot) => Object.values(shot.displayed_frame_set?.frames || {}));
  if (currentFrames.length === shots.length * 3) {
    refreshCurrentContactSheet(
      currentFrames.map((file) => path.join(epRoot, file)),
      path.join(epRoot, "generated_storyboard_contact_sheet_current_2026-09-03.jpg"),
      3,
      320,
      180,
    );
  }
  const handoffFrames = shots
    .filter((shot) => ["Shot025", "Shot026", "Shot027", "Shot028", "Shot029"].includes(shot.id))
    .flatMap((shot) => Object.values(shot.displayed_frame_set?.frames || {}));
  if (handoffFrames.length === 15) {
    refreshCurrentContactSheet(
      handoffFrames.map((file) => path.join(epRoot, file)),
      path.join(epRoot, "production_system/reviews/critical_reaudit_2026-09-03/sequence_handoff_025_029_current_contact_sheet.jpg"),
      3,
      480,
      270,
    );
  }
}

function parseScriptScenes() {
  const text = readText(scriptPath);
  const sceneBlocks = [];
  const matches = [...text.matchAll(/^### Scene (\d+) - (.+)$/gm)];
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const next = matches[i + 1];
    const start = match.index + match[0].length;
    const end = next ? next.index : text.length;
    const body = text.slice(start, end).trim();
    sceneBlocks.push({
      number: Number(match[1]),
      title: `Scene ${match[1]} - ${match[2].trim()}`,
      body,
      excerpt: body.split("\n").filter(Boolean).slice(0, 10).join("\n"),
    });
  }
  return sceneBlocks;
}

function scriptSceneNumberForShot(order) {
  if (order <= 1) return 1;
  if (order <= 4) return 2;
  if (order <= 6) return 3;
  if (order <= 9) return 4;
  if (order <= 13) return 5;
  if (order <= 18) return 6;
  if (order <= 20) return 7;
  if (order <= 24) return 8;
  if (order <= 30) return 9;
  if (order <= 33) return 10;
  return 11;
}

function actOf(order) {
  if (order <= 4) return "briefing";
  if (order <= 9) return "departure";
  if (order <= 13) return "fog_approach";
  if (order <= 20) return "fog_battle";
  if (order <= 30) return "lonato_confrontation";
  return "aftermath";
}

function existingPath(file) {
  return file && fs.existsSync(file) ? file : "";
}

function asList(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function rootPath(epRelative) {
  return path.join(epRoot, epRelative);
}

function identityOverrideFor(shotId) {
  return identityReview?.shots?.[shotId] || null;
}

function localIdentityPlatesFor(assetReferences) {
  const platesByAsset = new Map((localIdentityPlateIndex?.plates || []).map((plate) => [plate.asset, plate]));
  return (assetReferences || [])
    .filter((asset) => asset.includes("/characters/"))
    .map((asset) => platesByAsset.get(asset))
    .filter(Boolean)
    .map((plate) => ({
      character_id: plate.character_id,
      asset: plate.asset,
      plate: plate.plate,
      status: plate.status || "layout_reference",
    }));
}

function localFrameSetFor(shotId) {
  const start = path.join(epRoot, "storyboards", shotId, "start_frame.png");
  const key = path.join(epRoot, "storyboards", shotId, "key_frame.png");
  const end = path.join(epRoot, "storyboards", shotId, "end_frame.png");
  const localStatus = "local_selected_png_composited_previs_v3_layout_reference";
  return [
    {
      role: "start",
      label: "起始帧",
      path: existingPath(start),
      status: existingPath(start) ? `start_${localStatus}` : "frames_pending",
      intent: "本地 selected.png 角色资产确定性合成预演 v3，用来证明人物来自本地资产并锁定基础空间；不是可直接送视频模型的最终关键帧。",
    },
    {
      role: "key",
      label: "关键帧",
      path: existingPath(key),
      status: existingPath(key) ? `key_${localStatus}` : "frames_pending",
      intent: "本地 selected.png 角色资产确定性合成预演 v3，优先证明“是谁在场”；动作峰值、真实抠图和电影光影仍需重做审核。",
    },
    {
      role: "end",
      label: "结束帧",
      path: existingPath(end),
      status: existingPath(end) ? `end_${localStatus}` : "frames_pending",
      intent: "本地 selected.png 角色资产确定性合成预演 v3，作为剪辑出点的身份/站位参考；视频交付仍然 blocked。",
    },
  ];
}

function finalCandidateFrameSetFor(shotId, deliveryShot, queueItem) {
  const requested = deliveryShot.current_display_frame_set || queueItem.current_display_frame_set || "";
  const frameSet = (requested && (deliveryShot[requested] || queueItem[requested]))
    || deliveryShot.displayed_frame_set
    || queueItem.displayed_frame_set
    || (deliveryShot.frames?.start && deliveryShot.frames?.key && deliveryShot.frames?.end
      ? { version: requested || "current_display_frames", frames: deliveryShot.frames }
      : null)
    || deliveryShot.integrated_candidate_v2
    || queueItem.integrated_candidate_v2
    || deliveryShot.local_asset_final_candidate_v1
    || queueItem.local_asset_final_candidate_v1
    || null;
  const framePaths = frameSet?.frames || (
    frameSet?.start_frame && frameSet?.key_frame && frameSet?.end_frame
      ? { start: frameSet.start_frame, key: frameSet.key_frame, end: frameSet.end_frame }
      : null
  );
  if (!framePaths) return [];
  const version = frameSet.version || requested || "local_asset_final_candidate_v1";
  const isCriticalReaudit = /critical_reaudit_regen_v\d+/.test(version) || /^critical_reaudit_regen_v\d+$/.test(requested);
  const isMangaReboard = version.includes("manga_readability_reboard_v1") || requested.includes("manga_readability_reboard_v1");
  const isIntegrated = version.includes("integrated_candidate_v2") || requested.includes("integrated_candidate_v2");
  const label = isCriticalReaudit
    ? "复审修复候选"
    : isMangaReboard
    ? "可读性重排候选"
    : isIntegrated
    ? "整合场景候选"
    : "最终候选";
  const criticalSlug = (version.match(/critical_reaudit_regen_v\d+/) || requested.match(/critical_reaudit_regen_v\d+/) || ["critical_reaudit_regen_v1"])[0];
  const statusSlug = isCriticalReaudit
    ? `${criticalSlug}_monitor_required`
    : isMangaReboard
    ? "manga_readability_reboard_v1_monitor_required"
    : isIntegrated
    ? "integrated_candidate_v2_monitor_required"
    : "local_asset_final_candidate_v1_monitor_required";
  const intent = isCriticalReaudit
    ? "针对用户指出的错误候选重新生成的 critical re-audit 修复帧；使用本地 selected 角色资产约束，当前仅 monitor_required/probe-only，不等同 approved_for_video。"
    : isMangaReboard
    ? "依据独立故事可读性与连续性重排生成的整合场景帧；使用本地 selected 角色/地点资产作为生成参考，三帧静态动作链已审，仍需 prompt QA 与 motion probe，不等同 approved_for_video。"
    : isIntegrated
    ? "本地角色与场景参考生成的完整整合场景候选；已解决贴片/layout blocker，但仍需 identity QA、continuity QA 和 3 秒 motion probe，不等同 approved_for_video。"
    : "本地录像证据、本地身份板和 v3 预演约束下的最终候选帧；静帧视觉可审查，视频端仍需 motion probe。";
  const frames = [
    {
      role: "start",
      label: `${label}起始帧`,
      path: existingPath(path.join(epRoot, framePaths.start)),
      status: `start_${statusSlug}`,
      intent,
    },
    {
      role: "key",
      label: `${label}关键帧`,
      path: existingPath(path.join(epRoot, framePaths.key)),
      status: `key_${statusSlug}`,
      intent,
    },
    {
      role: "end",
      label: `${label}结束帧`,
      path: existingPath(path.join(epRoot, framePaths.end)),
      status: `end_${statusSlug}`,
      intent,
    },
  ];
  return frames.every((frame) => frame.path) ? frames : [];
}

function localPrevisFrameSetFor(shotId) {
  return localFrameSetFor(shotId);
}

function imagegenCandidateFrameSetFor(shotId) {
  const identityOverride = identityOverrideFor(shotId);
  const imagegenStart = path.join(epRoot, "storyboards", shotId, "start_frame_imagegen_candidate_2026-07-29.png");
  const imagegenKey = path.join(epRoot, "storyboards", shotId, "key_frame_imagegen_candidate_2026-07-29.png");
  const imagegenEnd = path.join(epRoot, "storyboards", shotId, "end_frame_imagegen_candidate_2026-07-29.png");
  const imagegenStatus = identityOverride ? "imagegen_candidate_identity_blocked_needs_regeneration" : "imagegen_candidate_monitor_required";
  const imagegenIntent = identityOverride
    ? "Imagegen composition study only; local selected.png identity lock failed or is unproven. Regenerate before asset-package use."
    : "Imagegen live-action frame candidate; review required.";
  const frames = [
    {
      role: "start",
      label: "起始帧",
      path: existingPath(imagegenStart),
      status: existingPath(imagegenStart) ? `start_${imagegenStatus}` : "frames_pending",
      intent: existingPath(imagegenStart) ? imagegenIntent : "No imagegen candidate exists.",
    },
    {
      role: "key",
      label: "关键帧",
      path: existingPath(imagegenKey),
      status: existingPath(imagegenKey) ? `key_${imagegenStatus}` : "frames_pending",
      intent: existingPath(imagegenKey) ? imagegenIntent : "No imagegen candidate exists.",
    },
    {
      role: "end",
      label: "结束帧",
      path: existingPath(imagegenEnd),
      status: existingPath(imagegenEnd) ? `end_${imagegenStatus}` : "frames_pending",
      intent: existingPath(imagegenEnd) ? imagegenIntent : "No imagegen candidate exists.",
    },
  ];
  return frames.some((frame) => frame.path) ? frames : [];
}

function linksForShot(shotId) {
  const truthAudit = path.join(epRoot, "production_system", "reviews", `${shotId.toLowerCase()}_local_asset_truth_audit_2026-08-01.md`);
  return {
    frameSpec: path.join(epRoot, "storyboards", shotId, "frame_spec.md"),
    metadata: path.join(epRoot, "storyboards", shotId, "metadata.json"),
    prompt: path.join(epRoot, "video_prompts", `${shotId}_prompt.md`),
    negativePrompt: path.join(epRoot, "video_prompts", `${shotId}_negative_prompt.md`),
    sourceRef: path.join(epRoot, "source_refs", `${shotId}_source.png`),
    localVideoSourceEvidence: path.join(epRoot, "production_system", "reviews", "local_video_source_frames_2026-08-01", "per_shot", shotId, `${shotId}_local_video_source_evidence_2026-08-01.jpg`),
    identityComparison: path.join(epRoot, "production_system", "reviews", "identity_lock_comparison_2026-07-31", `${shotId}_identity_comparison_2026-07-31.jpg`),
    localAssetProof: path.join(epRoot, "production_system", "reviews", "local_asset_previs_proof_2026-07-31", `${shotId}_local_asset_previs_proof_2026-07-31.jpg`),
    identityLockedProbeKey: path.join(epRoot, "storyboards", shotId, "key_frame_identity_locked_probe_2026-08-01.png"),
    identityLockedProbeReview: path.join(epRoot, "production_system", "reviews", `${shotId.toLowerCase()}_identity_locked_probe_2026-08-01.jpg`),
    identityLockedRegenReview: existingPath(path.join(epRoot, "production_system", "reviews", `${shotId.toLowerCase()}_local_asset_locked_regen_v1_review_2026-08-01.jpg`))
      || existingPath(path.join(epRoot, "production_system", "reviews", `${shotId.toLowerCase()}_local_source_locked_regen_v3_review_2026-08-01.jpg`))
      || existingPath(path.join(epRoot, "production_system", "reviews", `${shotId.toLowerCase()}_identity_locked_regen_v2_review_2026-08-01.jpg`))
      || path.join(epRoot, "production_system", "reviews", `${shotId.toLowerCase()}_identity_locked_regen_review_2026-08-01.jpg`),
    identityLockedRegenReviewMd: existingPath(truthAudit)
      || existingPath(path.join(epRoot, "production_system", "reviews", `${shotId.toLowerCase()}_local_asset_locked_regen_v1_review_2026-08-01.md`))
      || existingPath(path.join(epRoot, "production_system", "reviews", `${shotId.toLowerCase()}_local_source_locked_regen_v3_review_2026-08-01.md`))
      || existingPath(path.join(epRoot, "production_system", "reviews", `${shotId.toLowerCase()}_identity_locked_regen_v2_review_2026-08-01.md`))
      || path.join(epRoot, "production_system", "reviews", `${shotId.toLowerCase()}_identity_locked_regen_review_2026-08-01.md`),
    videoPromptV2Qa: path.join(epRoot, "production_system", "reviews", `${shotId.toLowerCase()}_video_prompt_v2_qa_2026-08-01.md`),
  };
}

function auditedFrameStatus(prefix, deliveryShot, queueItem) {
  const decision = deliveryShot.visual_audit_decision || queueItem.visual_audit_decision || "";
  if (decision === "visual_review_passed") return `${prefix}_visual_review_passed_still_only`;
  if (decision === "monitor_required") return `${prefix}_monitor_required_identity_not_final`;
  if (decision === "layout_reference") return `${prefix}_layout_reference_identity_unproven`;
  if (decision === "blocked_needs_revision") return `${prefix}_blocked_needs_revision`;
  return `${prefix}_candidate_needs_review`;
}

function auditedFrameIntent(prefix, deliveryShot, queueItem) {
  const decision = deliveryShot.visual_audit_decision || queueItem.visual_audit_decision || "";
  const finding = deliveryShot.visual_audit_finding || queueItem.visual_audit_finding || "";
  if (decision === "visual_review_passed") {
    return `${prefix} 静帧候选；当前 manifest 标记为 visual_review_passed，但仍未通过视频 prompt QA、motion probe 与相邻连续性。`;
  }
  if (decision === "monitor_required") {
    return `${prefix} 仅可作为受控参考；本地资产身份尚未最终证明，需要重新锁脸或做更严格对照。${finding}`;
  }
  if (decision === "layout_reference") {
    return `${prefix} 仅为构图/空间参考；不得当作本地资产锁定关键帧。${finding}`;
  }
  if (decision === "blocked_needs_revision") {
    return `${prefix} 已被本地资产真伪审计阻断；不得用于关键帧资产包或视频提交。${finding}`;
  }
  return `${prefix} 候选；必须对照本地身份板和审查结论，不可直接送视频。`;
}

function identityLockedRegenFrameSetFor(shotId, order, deliveryShot, queueItem) {
  const dir = path.join(epRoot, "delivery", "identity_locked_keyframe_regeneration_2026-08-01", "shots", `${String(order).padStart(3, "0")}_${shotId}`);
  const localAssetDir = path.join(dir, "local_asset_locked_regen_v1_2026-08-01");
  const localAsset = {
    start: existingPath(path.join(localAssetDir, "start_frame_local_asset_locked_regen_v1_2026-08-01.png")),
    key: existingPath(path.join(localAssetDir, "key_frame_local_asset_locked_regen_v1_2026-08-01.png")),
    end: existingPath(path.join(localAssetDir, "end_frame_local_asset_locked_regen_v1_2026-08-01.png")),
  };
  const hasLocalAsset = Object.values(localAsset).every(Boolean);
  const v3Dir = path.join(dir, "local_source_locked_regen_v3_2026-08-01");
  const v3 = {
    start: existingPath(path.join(v3Dir, "start_frame_local_source_locked_regen_v3_2026-08-01.png")),
    key: existingPath(path.join(v3Dir, "key_frame_local_source_locked_regen_v3_2026-08-01.png")),
    end: existingPath(path.join(v3Dir, "end_frame_local_source_locked_regen_v3_2026-08-01.png")),
  };
  const hasV3 = Object.values(v3).every(Boolean);
  const v2 = {
    start: existingPath(path.join(dir, "start_frame_identity_locked_regen_v2_2026-08-01.png")),
    key: existingPath(path.join(dir, "key_frame_identity_locked_regen_v2_2026-08-01.png")),
    end: existingPath(path.join(dir, "end_frame_identity_locked_regen_v2_2026-08-01.png")),
  };
  const hasV2 = Object.values(v2).some(Boolean);
  const frames = [
    {
      role: "start",
      label: "重做起始帧",
      path: hasLocalAsset ? localAsset.start : hasV3 ? v3.start : hasV2 ? v2.start : existingPath(path.join(dir, "start_frame_identity_locked_regen_2026-08-01.png")),
      status: hasLocalAsset ? auditedFrameStatus("local_asset_locked_regen_v1", deliveryShot, queueItem) : hasV3 ? auditedFrameStatus("local_source_locked_regen_v3", deliveryShot, queueItem) : hasV2 ? "identity_locked_regen_v2_identity_unproven_candidate" : "identity_locked_regen_candidate",
      intent: hasLocalAsset ? auditedFrameIntent("本地资产锁定 v1", deliveryShot, queueItem) : hasV3 ? auditedFrameIntent("本地源片锁定 v3", deliveryShot, queueItem) : hasV2 ? "身份锁重做 v2 候选；这是 AI 再生成画面，不等同于本地素材本体，必须对照本地录像抽帧和 identity plate 复核。" : "身份锁重做候选；必须对照本地身份板和审查结论，不可直接送视频。",
    },
    {
      role: "key",
      label: "重做关键帧",
      path: hasLocalAsset ? localAsset.key : hasV3 ? v3.key : hasV2 ? v2.key : existingPath(path.join(dir, "key_frame_identity_locked_regen_2026-08-01.png")),
      status: hasLocalAsset ? auditedFrameStatus("local_asset_locked_regen_v1", deliveryShot, queueItem) : hasV3 ? auditedFrameStatus("local_source_locked_regen_v3", deliveryShot, queueItem) : hasV2 ? "identity_locked_regen_v2_identity_unproven_candidate" : "identity_locked_regen_candidate",
      intent: hasLocalAsset ? auditedFrameIntent("本地资产锁定 v1", deliveryShot, queueItem) : hasV3 ? auditedFrameIntent("本地源片锁定 v3", deliveryShot, queueItem) : hasV2 ? "身份锁重做 v2 候选；只可作为构图/动作参考，身份未按本地资产 gate 放行。" : "身份锁重做候选；用于观察动作峰值、服装拓扑和脸部保持，不代表批准。",
    },
    {
      role: "end",
      label: "重做结束帧",
      path: hasLocalAsset ? localAsset.end : hasV3 ? v3.end : hasV2 ? v2.end : existingPath(path.join(dir, "end_frame_identity_locked_regen_2026-08-01.png")),
      status: hasLocalAsset ? auditedFrameStatus("local_asset_locked_regen_v1", deliveryShot, queueItem) : hasV3 ? auditedFrameStatus("local_source_locked_regen_v3", deliveryShot, queueItem) : hasV2 ? "identity_locked_regen_v2_identity_unproven_candidate" : "identity_locked_regen_candidate",
      intent: hasLocalAsset ? auditedFrameIntent("本地资产锁定 v1", deliveryShot, queueItem) : hasV3 ? auditedFrameIntent("本地源片锁定 v3", deliveryShot, queueItem) : hasV2 ? "身份锁重做 v2 候选；出点可读，但不能代替本地资产身份通过。" : "身份锁重做候选；用于下一剪辑出点测试，仍需独立视觉 QA。",
    },
  ];
  return frames.some((frame) => frame.path) ? frames : [];
}

function main() {
  identityReview = fs.existsSync(identityReviewPath) ? readJson(identityReviewPath) : null;
  localIdentityPlateIndex = fs.existsSync(localIdentityPlateIndexPath) ? readJson(localIdentityPlateIndexPath) : null;
  const manifest = readJson(manifestPath);
  const queue = readJson(queuePath);
  refreshCurrentContactSheets(manifest);
  const queueByShot = new Map((queue.shots || []).map((item) => [item.id, item]));
  const scriptScenes = parseScriptScenes();
  const scriptSceneMap = new Map(scriptScenes.map((scene) => [scene.number, scene]));

  const shots = manifest.shots.map((deliveryShot) => {
    const shotId = deliveryShot.id;
    const order = Number(deliveryShot.order);
    const metadataPath = path.join(epRoot, "storyboards", shotId, "metadata.json");
    const metadata = readJson(metadataPath);
    const queueItem = queueByShot.get(shotId) || {};
    const scriptScene = scriptSceneMap.get(scriptSceneNumberForShot(order)) || {};
    const links = linksForShot(shotId);
    const finalCandidateFrameSet = finalCandidateFrameSetFor(shotId, deliveryShot, queueItem);
    const frameSet = finalCandidateFrameSet.length ? finalCandidateFrameSet : localPrevisFrameSetFor(shotId);
    const blockedImagegenFrameSet = imagegenCandidateFrameSetFor(shotId);
    const identityLockedRegenFrameSet = identityLockedRegenFrameSetFor(shotId, order, deliveryShot, queueItem);
    const keyFrame = frameSet.find((frame) => frame.role === "key")?.path || "";
    const blockedImagegenKeyFrame = blockedImagegenFrameSet.find((frame) => frame.role === "key")?.path || "";
    const identityOverride = identityOverrideFor(shotId);
    const promptText = readText(links.prompt);
    const negativeText = readText(links.negativePrompt);
    const localPrevisStatus = keyFrame ? (finalCandidateFrameSet.length ? "monitor_required" : "layout_reference") : "frames_pending";
    const localIdentityPlates = localIdentityPlatesFor(metadata.asset_references || []);
    const currentDisplayFrameSet = deliveryShot.current_display_frame_set || "";
    const criticalDisplaySlug = (currentDisplayFrameSet.match(/critical_reaudit_regen_v\d+/) || [""])[0];
    const displayFrameSource = criticalDisplaySlug
      ? `ep03_${criticalDisplaySlug}_monitor_required`
          : currentDisplayFrameSet.includes("manga_readability_reboard_v1")
          ? "Primary displayed start/key/end frames are manga-readability reboard frames generated as integrated live-action scenes from local selected character and location references; the five-beat action chain was independently inspected." 
        : currentDisplayFrameSet.includes("integrated_candidate_v2")
      ? "ep03_integrated_candidate_v2_monitor_required"
      : finalCandidateFrameSet.length
        ? "ep03_local_asset_final_candidate_v1_monitor_required"
        : "ep03_local_selected_png_composited_previs_v3_layout_reference";
    const currentContinuity = deliveryShot.current_continuity
      ? {
          ...deliveryShot.current_continuity,
          previous_end_frame: deliveryShot.current_continuity.previous_end_frame
            ? rootPath(deliveryShot.current_continuity.previous_end_frame)
            : null,
          next_start_frame: deliveryShot.current_continuity.next_start_frame
            ? rootPath(deliveryShot.current_continuity.next_start_frame)
            : null,
        }
      : null;

    return {
      shot: shotId,
      number: order,
      order,
      title: metadata.scene || queueItem.beat || shotId,
      act: actOf(order),
      duration: `${deliveryShot.duration_seconds} seconds`,
      durationZh: `${deliveryShot.duration_seconds} 秒`,
      durationSeconds: deliveryShot.duration_seconds,
      status: deliveryShot.status,
      still: keyFrame,
      displayImagePath: keyFrame,
      displayImageStatus: localPrevisStatus,
      displayImageSource: keyFrame ? displayFrameSource : "none",
      productionStatus: deliveryShot.status,
      productionPriority: order <= 6 || order >= 21 ? "P0" : "P1",
      productionQaStatus: deliveryShot.visual_audit_decision === "visual_review_passed"
        ? `visual_review_passed: ${deliveryShot.visual_audit_finding || "current regenerated frames passed still-frame visual QA; downstream gates still required."}`
        : deliveryShot.visual_audit_decision === "monitor_required"
        ? `monitor_required: ${deliveryShot.visual_audit_finding || "current regenerated frames are useful but local selected.png identity is not final."}`
        : deliveryShot.visual_audit_decision === "layout_reference"
        ? `layout_reference: ${deliveryShot.visual_audit_finding || "current regenerated frames are only composition reference."}`
        : deliveryShot.visual_audit_decision === "blocked_needs_revision"
        ? `blocked_needs_revision: ${deliveryShot.visual_audit_finding || "current regenerated frames failed local asset identity review."}`
        : identityOverride
        ? `video_blocked: imagegen identity failed; primary display is local selected.png previs only. ${identityOverride.reason}`
        : queueItem.visual_audit_finding || "local selected.png previs only; not visually approved",
      productionQaChecks: [
        "Game screenshots are source_refs only and not displayed as storyboard frames.",
        /critical_reaudit_regen_v\d+/.test(currentDisplayFrameSet)
          ? "Primary displayed start/key/end frames are critical re-audit replacements generated from local selected character assets after prior candidates were downgraded."
        : currentDisplayFrameSet.includes("integrated_candidate_v2")
          ? "Primary displayed start/key/end frames are integrated full-scene candidates generated from local character and location references."
          : "Primary displayed start/key/end frames are local selected.png composited previs/final-candidate assets.",
        identityOverride
          ? "Imagegen frames are demoted to blocked composition studies because local selected.png identity lock failed or is unproven."
          : "Any imagegen/live-action candidate still requires per-shot visual QA before promotion.",
        "Local selected.png face, age, hairstyle, and wardrobe topology must remain traceable before any visual promotion.",
        "Do not promote to approved_for_video until visual, prompt-against-frame, and continuity gates pass.",
      ],
      frameSet,
      localPrevisFrameSet: localPrevisFrameSetFor(shotId),
      finalCandidateFrameSet,
      blockedImagegenFrameSet,
      identityLockedRegenFrameSet,
      blockedImagegenKeyframePath: blockedImagegenKeyFrame,
      blockedImagegenContactSheetPath: existingPath(path.join(epRoot, "storyboards", shotId, "imagegen_frameset_contact_sheet_2026-07-29.jpg")),
      productionKeyframePath: keyFrame,
      productionStartFramePath: frameSet[0].path,
      productionFrameIntent: metadata.purpose,
      productionFramePrompt: queueItem.key_action || metadata.purpose,
      startKeyAssociation: "当前展示 START/KEY/END 为 cache-backed integrated live-action 候选；local selected.png 预演仅保留为历史 layout_reference 证据，视频仍需 prompt/frame 对照与 motion probe。",
      currentContinuity,
      characterReferenceAssets: (metadata.asset_references || [])
        .filter((asset) => asset.includes("/characters/"))
        .map((asset) => ({
          name: asset.split("/").slice(-3, -2)[0] || asset,
          asset,
          identityPlate: localIdentityPlates.find((plate) => plate.asset === asset)?.plate || "",
          continuity_note: identityOverride
            ? "Displayed local previs uses this selected.png as the identity lock; imagegen candidate failed or did not prove this exact identity."
            : "Use as identity lock; local previs is only layout reference until visual QA passes.",
        })),
      localIdentityPlates,
      subframes: [],
      keyFrameIntent: queueItem.key_action || metadata.purpose,
      keyFramePrompt: queueItem.key_action || metadata.purpose,
      sourcePackage: "episodes/EP03/prompt_asset_package_manifest.json",
      outputPath: deliveryShot.expected_clip,
      payloadProductionStatus: deliveryShot.status,
      payloadProductionImagePath: "",
      payloadBlockedSourceImagePath: blockedImagegenKeyFrame || keyFrame,
      payloadProductionPromptFile: links.prompt,
      modelReadyPromptFile: existingPath(links.prompt),
      modelReadyNegativePromptFile: existingPath(links.negativePrompt),
      auditPromptFile: existingPath(links.prompt),
      battleLedgerApplicability: "not_applicable",
      battleLedgerNote: "EP03 package does not use the Scene09 V3 battle-ledger state machine; character continuity is tracked through metadata, visibleNamedOnly/currentCharacters, identity plates, and per-shot reviews.",
      distanceContinuityLedgerPath: "episodes/EP03/production_system/distance_continuity_ledger_2026-08-23.md",
      distanceContinuityLedgerStatus: "current_shot_021_to_027_distance_reaudit_monitor_required",
      cinematicBlock: actOf(order),
      transitionIn: deliveryShot.edit_in || "",
      transitionOut: deliveryShot.edit_out || "",
      screenDirectionRule: "Maintain EP03 fog/cathedral geography from frame_spec; source_refs are layout only.",
      audioBridge: deliveryShot.audio_anchor || "",
      editorialHandlesSeconds: 2,
      riskNotes: [queueItem.visual_audit_finding, ...asList(metadata.risks || deliveryShot.model_notes)].filter(Boolean).join(" / "),
      videoPrompt: promptText,
      generationPrompt: promptText,
      negativePrompt: negativeText,
      camera: metadata.camera || queueItem.camera || "",
      avoid: negativeText,
      visibleNamedOnly: metadata.characters || [],
      currentCharacters: metadata.characters || [],
      currentRejectIf: deliveryShot.reject_if || [],
      identityLockDecision: identityOverride ? identityOverride.decision : "not_independently_passed",
      identityLockReason: identityOverride ? identityOverride.reason : "",
      identityLockReview: identityReview ? "episodes/EP03/production_system/identity_lock_review_2026-07-31.json" : "",
      sourceTimecodeAudit: queueItem.source_timecode_audit?.audit_path ? rootPath(queueItem.source_timecode_audit.audit_path) : "",
      sourceMatch: queueItem.source_timecode_audit?.source_match || "",
      sourceAdaptationGap: queueItem.source_timecode_audit?.adaptation_gap || "",
      localVideoSourceEvidencePath: existingPath(links.localVideoSourceEvidence),
      identityComparisonPath: existingPath(links.identityComparison),
      localAssetProofPath: existingPath(links.localAssetProof),
      identityLockedProbeKeyPath: existingPath(links.identityLockedProbeKey),
      identityLockedProbeReviewPath: existingPath(links.identityLockedProbeReview),
      identityLockedRegenReviewPath: existingPath(links.identityLockedRegenReview),
      identityLockedRegenReviewMdPath: existingPath(links.identityLockedRegenReviewMd),
      videoPromptV2QaPath: existingPath(links.videoPromptV2Qa),
      videoPromptQaDecision: deliveryShot.video_prompt_qa_decision || "",
      motionProbeStatus: deliveryShot.motion_probe_status || "",
      motionProbePlanPath: deliveryShot.motion_probe_plan ? rootPath(deliveryShot.motion_probe_plan) : "",
      videoPromptV2Path: deliveryShot.video_prompt_v2 ? rootPath(deliveryShot.video_prompt_v2) : "",
      negativePromptV2Path: deliveryShot.negative_prompt_v2 ? rootPath(deliveryShot.negative_prompt_v2) : "",
      scriptSceneTitle: scriptScene.title || "未映射",
      scriptSceneBody: scriptScene.body || "",
      scriptSceneExcerpt: scriptScene.excerpt || "",
      shotDialogue: deliveryShot.audio_anchor || "",
      scene: metadata.scene || "",
      purposeZh: metadata.purpose || "",
      visual: queueItem.key_action || "",
      cameraZh: metadata.camera || queueItem.camera || "",
      dialogue: deliveryShot.audio_anchor || "",
      sourceRef: `${queueItem.source_timecode || metadata.source_timecode || ""} 本地原始录像参考；仅用于构图/节奏，不作展示帧`,
      priority: order <= 6 || order >= 21 ? "P0" : "P1",
      locationAsset: (metadata.asset_references || []).find((asset) => asset.includes("/locations/")) || "",
      characters: (metadata.characters || []).join(", "),
      outputNeeded: "当前输出为 cache-backed integrated live-action START/KEY/END 候选；local selected.png 预演是历史 layout_reference，最终视频仍待 motion probe。",
      sourceRefPath: links.sourceRef,
      frameSpecPath: links.frameSpec,
      metadataPath: links.metadata,
      promptPath: links.prompt,
      negativePromptPath: links.negativePrompt,
    };
  });

  const payload = {
    title: "EP03 雾中的叛乱",
    updated: "2026-09-09",
    productionMode: "ep03_manga_readability_reboard_v1_current_frames_monitor_required",
    statusNote: "主看板已切换到 2026-09-09 可读性重排 current 帧；Shot025-029 按独立故事/连续性重排：命令造成分流，亚修对空地作非致命警示，卡多莉奴先接守卫，洛纳特为护住撤退守卫进入一次武器绑定并缴械，随后以落剑接跪地收束。五个镜头均使用本地 selected 角色/地点资产作为生成参考，START/KEY/END 静态动作链已逐张检查；仍需逐镜头 prompt-against-frame 对照与 3 秒 motion probe，尚不等同 approved_for_video。",
    timeline: "episodes/EP03/shot_list.md",
    continuityBrief: "episodes/EP03/production_system/continuity_manifest.json",
    distanceContinuityLedger: "episodes/EP03/production_system/distance_continuity_ledger_2026-08-23.md",
    runbook: "episodes/EP03/production_notes.md",
    reviewLabel: "EP03 视觉材料审计",
    reviewHtml: "episodes/EP03/visual_material_audit.md",
    fullContactSheet: "episodes/EP03/generated_storyboard_contact_sheet_current_2026-09-03.jpg",
    script: "episodes/EP03/script.md",
    sourceBreakdown: "episodes/EP03/source_video_breakdown.md",
    projectBible: "episodes/EP03/project_bible.md",
    promptAssetManifest: "episodes/EP03/prompt_asset_package_manifest.json",
    frameGenerationQueue: "episodes/EP03/frame_generation_queue.md",
    frameGenerationQueueJson: "episodes/EP03/frame_generation_queue.json",
    visualMaterialAudit: "episodes/EP03/visual_material_audit.md",
    completeScriptShotAssetPackageViewer: "episodes/EP03/delivery/complete_script_shot_asset_package_2026-08-01/index.html",
    completeScriptShotAssetPackageReadme: "episodes/EP03/delivery/complete_script_shot_asset_package_2026-08-01/README.md",
    completeScriptShotAssetPackageManifest: "episodes/EP03/delivery/complete_script_shot_asset_package_2026-08-01/manifest.json",
    motionProbePackageViewer: "episodes/EP03/delivery/motion_probe_package_2026-08-10/index.html",
    motionProbePackageQueueCsv: "episodes/EP03/delivery/motion_probe_package_2026-08-10/submission_queue.csv",
    motionProbePackageQueueJson: "episodes/EP03/delivery/motion_probe_package_2026-08-10/submission_queue.json",
    motionProbePackageRunbook: "episodes/EP03/delivery/motion_probe_package_2026-08-10/RUNBOOK.md",
    motionProbePackageQa: "episodes/EP03/delivery/motion_probe_package_2026-08-10/clip_QA_checklist.md",
    localAssetStoryboardPackage: "episodes/EP03/delivery/local_asset_storyboard_package_2026-07-31/README.md",
    localAssetStoryboardViewer: "episodes/EP03/delivery/local_asset_storyboard_package_2026-07-31/index.html",
    localAssetStoryboardManifest: "episodes/EP03/delivery/local_asset_storyboard_package_2026-07-31/manifest.json",
    localAssetStoryboardShotIndex: "episodes/EP03/delivery/local_asset_storyboard_package_2026-07-31/shot_index.md",
    localAssetStoryboardReview: "episodes/EP03/delivery/local_asset_storyboard_package_2026-07-31/package_review_2026-07-31.md",
    identityLockedRegenerationViewer: "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/index.html",
    identityLockedRegenerationManifest: "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/package_manifest.json",
    identityLockedRegenerationQueue: "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/submission_queue.csv",
    identityLockedRegenerationRunbook: "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/RUNBOOK.md",
    identityLockedRegenerationPolicy: "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/prompt_policy.md",
    identityLockedRegenerationQa: "episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/QA_CHECKLIST.md",
    localIdentityPlatesViewer: "episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/viewer.html",
    localIdentityPlatesIndex: "episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/index.json",
    localIdentityPlatesAtlas: "episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/EP03_local_identity_plate_atlas_2026-08-01.jpg",
    localIdentityPlatesMarkdown: "episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/index.md",
    localVideoSourceFramesIndex: "episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/index.md",
    localVideoSourceFramesJson: "episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/index.json",
    localVideoSourceFramesViewer: "episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/viewer.html",
    sourceTimecodeAudit: "episodes/EP03/production_system/source_timecode_audit_2026-08-01.json",
    sourceTimeline10sIndex: "episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/timeline_10s/index.md",
    localVideoSourceCuttedShot3: "episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/cutted_ep3_shot3_contact_sheet.jpg",
    localVideoSourceP4BlueLions00: "episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/P4_blue_lions_00_contact_sheet.jpg",
    blockContactSheets: [
      ["EP03 本地原始录像证据 / cutted ep3 shot3", "episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/cutted_ep3_shot3_contact_sheet.jpg"],
      ["EP03 本地原始录像证据 / P4 青狮 EP3 [00]", "episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/P4_blue_lions_00_contact_sheet.jpg"],
      ...shots
        .map((shot) => [`${shot.shot} identity-locked probe review`, `episodes/EP03/production_system/reviews/${shot.shot.toLowerCase()}_identity_locked_probe_2026-08-01.jpg`])
        .filter(([, sheetPath]) => fs.existsSync(sheetPath)),
      ...shots
        .map((shot) => [`${shot.shot} local selected.png proof`, `episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/${shot.shot}_local_asset_previs_proof_2026-07-31.jpg`])
        .filter(([, sheetPath]) => fs.existsSync(sheetPath)),
      ...shots
        .map((shot) => [`${shot.shot} local asset identity comparison`, `episodes/EP03/production_system/reviews/identity_lock_comparison_2026-07-31/${shot.shot}_identity_comparison_2026-07-31.jpg`])
        .filter(([, sheetPath]) => fs.existsSync(sheetPath)),
      ...shots
        .map((shot) => [`${shot.shot} imagegen 三帧候选`, `episodes/EP03/storyboards/${shot.shot}/imagegen_frameset_contact_sheet_2026-07-29.jpg`])
        .filter(([, sheetPath]) => fs.existsSync(sheetPath)),
      ["EP03 当前 Shot025-029 连续性总览（仅当前版本）", "episodes/EP03/production_system/reviews/critical_reaudit_2026-09-03/sequence_handoff_025_029_current_contact_sheet.jpg"],
      ["EP03 当前展示帧总览", "episodes/EP03/generated_storyboard_contact_sheet_current_2026-09-03.jpg"],
    ],
    shots,
  };

  fs.writeFileSync(outputPath, `window.EP03_STORYBOARD_DATA = ${JSON.stringify(payload, null, 2)};\n`);
  console.log(`wrote ${outputPath} (${shots.length} shots)`);
}

main();
