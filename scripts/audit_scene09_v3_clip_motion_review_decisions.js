const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const clipQaPath = path.join(reportDir, "scene09_v3_generated_clip_structural_audit_2026-08-01.json");
const motionAssetsPath = path.join(reportDir, "scene09_v3_clip_motion_review_assets_2026-07-28.json");
const decisionsPath = path.join(reportDir, "scene09_v3_clip_motion_review_decisions_2026-07-28.json");

const REQUIRED_CHECK_IDS = [
  "visible_named_only_match",
  "no_unnamed_readable_humans",
  "no_illegal_reentry",
  "capture_continuity_locked",
  "teacher_lane_separation",
  "shot034b_empty_objective_only",
  "shot034g_exhausted_core_only",
  "nonlethal_mock_battle",
  "identity_costume_weapon_lock",
  "screen_direction_and_camera_lock",
  "end_frame_hold",
  "no_visible_text_or_watermark",
];

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function rel(file) {
  return path.relative(root, file);
}

function clipSignature(expectedClip) {
  const absolute = path.join(root, expectedClip);
  if (!fs.existsSync(absolute)) return null;
  const stat = fs.statSync(absolute);
  return {
    size_bytes: stat.size,
    mtime_ms: Math.trunc(stat.mtimeMs),
    sha256: crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex"),
  };
}

function sameSignature(a, b) {
  return Boolean(a && b &&
    a.size_bytes === b.size_bytes &&
    a.mtime_ms === b.mtime_ms &&
    a.sha256 &&
    b.sha256 &&
    a.sha256 === b.sha256);
}

function checkReviewFrames(row) {
  const missing = [];
  for (const label of ["start", "mid", "end"]) {
    const frame = row.review_frames?.[label];
    if (!frame || !fs.existsSync(path.join(root, frame))) missing.push(label);
  }
  return missing;
}

function main() {
  const manifest = readJson(manifestPath);
  if (!manifest) throw new Error(`Missing package manifest: ${manifestPath}`);
  const clipQa = readJson(clipQaPath, { rows: [], missing_clips: manifest.total_shots, failed_clips: 0, ready_clips: 0 });
  const motionAssets = readJson(motionAssetsPath, { rows: [] });
  const decisions = readJson(decisionsPath);
  const problems = [];

  if (!decisions) {
    problems.push(`Missing motion review decision file: ${rel(decisionsPath)}`);
  }
  if (decisions) {
    const decisionText = JSON.stringify(decisions);
    if (/only Byleth, Dimitri, and Hanneman are readable|Shot034B shows only Byleth, Dimitri, and Hanneman|Hanneman is alone on his own faculty lane|34D_Shot034B_hanneman_lane/i.test(decisionText)) {
      problems.push("Motion decision template contains deprecated Shot034B Hanneman-lane wording.");
    }
    if (!/only Byleth and Dimitri are readable/i.test(decisionText) || !/faculty objective markers stay empty/i.test(decisionText)) {
      problems.push("Motion decision template is missing current Shot034B empty-objective wording.");
    }
  }

  const clipMissing = Number(clipQa.missing_clips || 0);
  const clipFailed = Number(clipQa.failed_clips || 0);
  const readyClips = Number(clipQa.ready_clips || 0);
  const expectedClips = Number(clipQa.expected_clips || manifest.total_shots || manifest.shots.length);

  if (clipMissing > 0) {
    process.stdout.write(`${JSON.stringify({
      decision: problems.length ? "motion_review_template_blocked" : "motion_review_pending_clips_missing",
      expected_clips: expectedClips,
      ready_clips: readyClips,
      missing_clips: clipMissing,
      failed_clips: clipFailed,
      problems,
      decisions_json: rel(decisionsPath),
    }, null, 2)}\n`);
    process.exit(problems.length ? 1 : 0);
  }

  if (clipFailed > 0 || readyClips !== expectedClips) {
    problems.push(`Clip file QA is not clean: ready=${readyClips}, expected=${expectedClips}, failed=${clipFailed}.`);
  }

  if (!motionAssets || motionAssets.extracted_clips !== expectedClips || motionAssets.failed_clips) {
    problems.push("Motion review start/mid/end frame assets are not complete for all generated clips.");
  }

  if (decisions) {
    const rows = decisions.rows || [];
    const byId = new Map(rows.map((row) => [row.id, row]));
    if (rows.length !== manifest.shots.length) {
      problems.push(`Motion decision row count ${rows.length} does not match manifest ${manifest.shots.length}.`);
    }
    for (const shot of manifest.shots) {
      const row = byId.get(shot.id);
      if (!row) {
        problems.push(`${shot.shot}: missing motion decision row.`);
        continue;
      }
      if (row.expected_clip !== shot.expected_clip) {
        problems.push(`${shot.shot}: expected_clip mismatch in motion decision row.`);
      }
      if (!sameSignature(row.clip_signature, clipSignature(shot.expected_clip))) {
        problems.push(`${shot.shot}: motion decision clip signature is stale or missing.`);
      }
      if (row.decision !== "motion_review_passed") {
        problems.push(`${shot.shot}: motion decision is ${row.decision}, expected motion_review_passed.`);
      }
      const checks = new Map((row.checks || []).map((check) => [check.id, check]));
      for (const id of REQUIRED_CHECK_IDS) {
        const check = checks.get(id);
        if (!check) {
          problems.push(`${shot.shot}: missing required motion check ${id}.`);
        } else if (check.result !== "pass") {
          problems.push(`${shot.shot}: motion check ${id} is ${check.result}, expected pass.`);
        }
      }
      const missingFrames = checkReviewFrames(row);
      if (missingFrames.length) {
        problems.push(`${shot.shot}: missing motion review extracted frames: ${missingFrames.join(", ")}.`);
      }
    }
  }

  const decision = problems.length
    ? "motion_review_required"
    : "motion_review_passed_ready_for_concat";

  process.stdout.write(`${JSON.stringify({
    decision,
    expected_clips: expectedClips,
    ready_clips: readyClips,
    missing_clips: clipMissing,
    failed_clips: clipFailed,
    problems,
    decisions_json: rel(decisionsPath),
  }, null, 2)}\n`);

  if (problems.length) process.exit(1);
}

main();
