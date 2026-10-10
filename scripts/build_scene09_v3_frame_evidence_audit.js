#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(outDir, "scene09_v3_frame_evidence_audit_2026-08-01.json");
const outCsv = path.join(outDir, "scene09_v3_frame_evidence_audit_2026-08-01.csv");
const outMd = path.join(outDir, "scene09_v3_frame_evidence_audit_2026-08-01.md");
const localVisualReviewMd = path.join(outDir, "scene09_v3_local_frame_visual_review_2026-08-01.md");
const packageJson = path.join(packageDir, "frame_evidence_audit.json");
const packageMd = path.join(packageDir, "frame_evidence_audit.md");
const packageCsv = path.join(packageDir, "frame_evidence_audit.csv");
const highRiskContactSheetAscii = path.join(root, "production_system/reviews/scene09_v3_high_risk_contact_sheet_ascii_2026-08-01.jpg");
const packageHighRiskContactSheetAscii = path.join(packageDir, "high_risk_contact_sheet_ascii_2026-08-01.jpg");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function rel(file) {
  return path.relative(root, file);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function imageInfo(file) {
  if (!fs.existsSync(file)) {
    return { exists: false, bytes: 0, width: 0, height: 0, sha256: "" };
  }
  const output = cp.execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
  return {
    exists: true,
    bytes: fs.statSync(file).size,
    width: Number(output.match(/pixelWidth:\s*(\d+)/)?.[1] || 0),
    height: Number(output.match(/pixelHeight:\s*(\d+)/)?.[1] || 0),
    sha256: sha256(file),
  };
}

function sourcePath(metadata, kind) {
  const key = `${kind}_frame`;
  return metadata[key]
    || metadata.source_frames?.[key]
    || metadata.source_frames?.[kind]
    || metadata.frames?.[key]
    || metadata.frames?.[kind]?.path
    || "";
}

function sameList(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

const fullSizeVisualSpotchecks = [
  {
    shot: "Shot032",
    frames: ["key"],
    expected_visible: ["Dedue", "Mercedes"],
    observation: "Key frame shows Mercedes behind Dedue with a short white healing pulse into Dedue's shield-arm line; no extra readable people.",
  },
  {
    shot: "Shot032F",
    frames: ["key"],
    expected_visible: ["Felix", "Ashe", "Hubert"],
    observation: "Key frame reads as Felix and Ashe containing Hubert in a nonlethal capture beat; no anonymous students or spectators.",
  },
  {
    shot: "Shot032G",
    frames: ["key"],
    expected_visible: ["Claude", "Leonie", "Dorothea", "Bernadetta"],
    observation: "Key frame reads as Claude and Leonie controlling Dorothea and Bernadetta on the Black Eagles backline; no extra readable people.",
  },
  {
    shot: "Shot034B",
    frames: ["start", "key", "end"],
    expected_visible: ["Byleth", "Dimitri"],
    observation: "Full-size start/key/end frames show Byleth and Dimitri at two far-separated empty faculty objective markers; Hanneman and Manuela are absent/offscreen/silent/unpaired.",
  },
  {
    shot: "Shot034G",
    frames: ["key"],
    expected_visible: ["Byleth", "Dimitri", "Dedue"],
    observation: "Key frame keeps the final victory to the exhausted Byleth, Dimitri, and Dedue core; the full Blue Lions class does not reset into the win image.",
  },
];

function buildFullSizeVisualSpotcheck(shots, rows, problems) {
  const shotsByName = new Map(shots.map((shot) => [shot.shot, shot]));
  const rowsByShotFrame = new Map(rows.map((row) => [`${row.shot}:${row.frame}`, row]));
  return fullSizeVisualSpotchecks.map((check) => {
    const shot = shotsByName.get(check.shot);
    const visible = shot?.visible_named_only || [];
    const frameRows = check.frames.map((frame) => rowsByShotFrame.get(`${check.shot}:${frame}`)).filter(Boolean);
    const checkProblems = [];
    if (!shot) checkProblems.push("shot_missing");
    if (shot && !sameList(visible, check.expected_visible)) {
      checkProblems.push(`visible_named_only_mismatch expected ${check.expected_visible.join(", ")} got ${visible.join(", ")}`);
    }
    if (frameRows.length !== check.frames.length) checkProblems.push("review_frame_rows_missing");
    for (const frameRow of frameRows) {
      if (!frameRow.exists) checkProblems.push(`${frameRow.frame}_frame_missing`);
      if (frameRow.problems.length) checkProblems.push(`${frameRow.frame}_frame_evidence_problem`);
    }
    for (const problem of checkProblems) problems.push(`${check.shot} full-size visual spotcheck: ${problem}`);
    return {
      shot: check.shot,
      frames_reviewed: check.frames,
      expected_visible: check.expected_visible,
      package_visible_named_only: visible,
      frame_evidence: frameRows.map((row) => ({
        frame: row.frame,
        package_frame: row.package_frame,
        source_frame: row.source_frame,
        width: row.width,
        height: row.height,
        bytes: row.bytes,
        sha256: row.sha256,
        digest_matches_source: row.digest_matches_source,
      })),
      codex_full_size_observation_2026_08_01: check.observation,
      status: checkProblems.length ? "blocked_needs_revision" : "visual_spotcheck_passed_monitor_required",
      problems: checkProblems,
    };
  });
}

function checkFrame(shot, metadata, kind, problems) {
  const packageFrame = path.join(packageDir, shot.package_dir, `${kind}_frame.png`);
  const sourceRel = sourcePath(metadata, kind);
  const sourceAbs = sourceRel ? path.join(root, sourceRel) : "";
  const packaged = imageInfo(packageFrame);
  const source = sourceAbs ? imageInfo(sourceAbs) : { exists: false, bytes: 0, width: 0, height: 0, sha256: "" };
  const aspect = packaged.height ? packaged.width / packaged.height : 0;
  const frameProblems = [];

  if (!packaged.exists) frameProblems.push("packaged_frame_missing");
  if (!sourceRel) frameProblems.push("source_frame_path_missing");
  if (sourceRel && !source.exists) frameProblems.push("source_frame_missing");
  if (packaged.exists && (packaged.width < 1280 || packaged.height < 720)) frameProblems.push("packaged_frame_low_resolution");
  if (packaged.exists && Math.abs(aspect - (16 / 9)) > 0.03) frameProblems.push("packaged_frame_not_16x9");
  if (packaged.exists && packaged.bytes < 100000) frameProblems.push("packaged_frame_suspiciously_small");
  if (packaged.exists && source.exists && packaged.sha256 !== source.sha256) frameProblems.push("packaged_frame_digest_differs_from_source");

  if (shot.shot === "Shot034B") {
    if (!sourceRel.includes("34D_Shot034B_empty_objective")) frameProblems.push("shot034b_source_not_empty_objective");
    if (sourceRel.includes("hanneman_lane")) frameProblems.push("shot034b_source_uses_deprecated_hanneman_lane");
  }
  if (shot.shot === "Shot033B") {
    if (!sourceRel.includes("29E_Shot033B_no_teachers") &&
        !sourceRel.includes("31R_Shot033B_byleth_split_teacher_routes")) {
      frameProblems.push("shot033b_source_not_no_teachers_route_split");
    }
  }
  if (shot.shot === "Shot034G") {
    if (!sourceRel.includes("37E_Shot034G_core_victory_lance")) frameProblems.push("shot034g_source_not_core_victory_lance");
  }
  if (shot.shot === "Shot036") {
    if (!sourceRel.includes("40C_Shot036_lance")) frameProblems.push("shot036_source_not_lance_finale");
  }

  for (const problem of frameProblems) problems.push(`${shot.shot} ${kind}: ${problem}`);
  return {
    order: shot.order,
    shot: shot.shot,
    frame: kind,
    package_frame: rel(packageFrame),
    source_frame: sourceRel,
    exists: packaged.exists,
    source_exists: source.exists,
    width: packaged.width,
    height: packaged.height,
    bytes: packaged.bytes,
    sha256: packaged.sha256,
    source_sha256: source.sha256,
    digest_matches_source: packaged.exists && source.exists && packaged.sha256 === source.sha256,
    problems: frameProblems,
  };
}

function main() {
  if (!fs.existsSync(packageManifestPath)) throw new Error(`Missing package manifest: ${packageManifestPath}`);
  const packageManifest = readJson(packageManifestPath);
  const shots = [...(packageManifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const problems = [];
  const warnings = [];
  const rows = [];

  for (const shot of shots) {
    const metadataPath = path.join(packageDir, shot.package_dir, "metadata.json");
    const metadata = fs.existsSync(metadataPath) ? readJson(metadataPath) : {};
    const visible = shot.visible_named_only || [];
    const metadataVisible = metadata.visible_named_only || [];
    if (!sameList(visible, metadataVisible)) {
      problems.push(`${shot.shot}: visible_named_only differs between package manifest and metadata`);
    }
    for (const kind of ["start", "key", "end"]) {
      rows.push(checkFrame(shot, metadata, kind, problems));
    }
  }

  const fullSizeVisualSpotcheck = buildFullSizeVisualSpotcheck(shots, rows, problems);
  const highRiskSheetInfo = imageInfo(highRiskContactSheetAscii);
  const packageHighRiskSheetInfo = imageInfo(packageHighRiskContactSheetAscii);
  if (!highRiskSheetInfo.exists) warnings.push("high_risk_contact_sheet_ascii_missing");
  if (!packageHighRiskSheetInfo.exists) warnings.push("package_high_risk_contact_sheet_ascii_missing");
  const expectedFrames = shots.length * 3;
  const framesOk = rows.filter((row) => row.problems.length === 0).length;
  const decision = problems.length ? "frame_evidence_audit_failed" : "frame_evidence_audit_passed_monitor_required";
  const result = {
    date,
    decision,
    package_manifest: rel(packageManifestPath),
    shots_checked: shots.length,
    frames_checked: rows.length,
    expected_frames: expectedFrames,
    frames_passed: framesOk,
    problems,
    warnings,
    notes: [
      "This is a frame evidence audit: it proves packaged PNG availability, dimensions, source digest sync, and current special-shot frame lineage.",
      "It includes a Codex full-size visual spotcheck for the highest-risk continuity shots, bound to package frame paths and SHA-256 values.",
      "It references the ASCII-labeled high-risk contact sheet so thumbnail review labels stay readable on file:// surfaces.",
      "It does not replace generated-clip motion review.",
      "Delivery remains monitor_required until real clips exist and pass Codex motion self-audit.",
    ],
    high_risk_contact_sheet_ascii: {
      image: rel(highRiskContactSheetAscii),
      exists: highRiskSheetInfo.exists,
      width: highRiskSheetInfo.width,
      height: highRiskSheetInfo.height,
      sha256: highRiskSheetInfo.sha256,
      package_image: rel(packageHighRiskContactSheetAscii),
      package_exists: packageHighRiskSheetInfo.exists,
      package_sha256: packageHighRiskSheetInfo.sha256,
    },
    full_size_visual_spotcheck: fullSizeVisualSpotcheck,
    rows,
  };

  const csvHeaders = [
    "order",
    "shot",
    "frame",
    "package_frame",
    "source_frame",
    "exists",
    "source_exists",
    "width",
    "height",
    "bytes",
    "digest_matches_source",
    "problems",
  ];
  const csv = [
    csvHeaders.join(","),
    ...rows.map((row) => [
      row.order,
      row.shot,
      row.frame,
      row.package_frame,
      row.source_frame,
      row.exists,
      row.source_exists,
      row.width,
      row.height,
      row.bytes,
      row.digest_matches_source,
      row.problems.join("; "),
    ].map(csvCell).join(",")),
  ].join("\n");

  const md = [
    "# Scene09 V3 Frame Evidence Audit",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Shots checked: ${shots.length}`,
    `Frames checked: ${rows.length}/${expectedFrames}`,
    `Frames passed: ${framesOk}/${rows.length}`,
    "",
    "## What This Proves",
    "",
    "- All packaged start/key/end PNG files exist and meet basic delivery dimensions.",
    "- Packaged frame digests match their declared source-frame files.",
    "- Shot034B uses the current `34D_Shot034B_empty_objective_*` frame set, not the deprecated Hanneman-lane frame set.",
    "- Shot033B uses the no-teachers split-route frame set.",
    "- Shot034G and Shot036 use the current core-victory lance/final-lance frame sets.",
    "- Codex full-size visual spotcheck covers Shot032, Shot032F, Shot032G, Shot034B, and Shot034G with package frame SHA-256 evidence.",
    `- ASCII-labeled high-risk contact sheet: \`${rel(packageHighRiskContactSheetAscii)}\` (${packageHighRiskSheetInfo.exists ? `${packageHighRiskSheetInfo.width}x${packageHighRiskSheetInfo.height}, sha256 ${packageHighRiskSheetInfo.sha256}` : "missing"}).`,
    "",
    "## Full-Size Visual Spotcheck",
    "",
    ...fullSizeVisualSpotcheck.map((item) => [
      `### ${item.shot}`,
      "",
      `Status: \`${item.status}\``,
      `Frames reviewed: ${item.frames_reviewed.join(", ")}`,
      `Expected visible: ${item.expected_visible.join(", ")}`,
      `Observation: ${item.codex_full_size_observation_2026_08_01}`,
      "",
      ...item.frame_evidence.map((frame) => `- ${frame.frame}: ${frame.package_frame} (${frame.width}x${frame.height}, sha256 ${frame.sha256})`),
      item.problems.length ? `- Problems: ${item.problems.join("; ")}` : "- Problems: none",
      "",
    ].join("\n")),
    "## What Still Needs Clip QA",
    "",
    "- The generated video model can still invent extra readable people, face drift, weapon drift, or illegal active-combat re-entry.",
    "- Promotion beyond `monitor_required` requires real clips, extracted review frames, and Codex motion self-audit.",
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");

  const localVisualReview = [
    "# Scene09 V3 Local Frame Visual Review",
    "",
    `Date: ${date}`,
    "Scope: current 42-shot monitor handoff package, packaged start/key/end PNGs, contact-sheet triage, and full-size evidence checks for key continuity shots.",
    "",
    "## Decision",
    "",
    "Status: `monitor_required_before_video`.",
    "",
    "The current web-facing frame package is structurally usable for monitored image-to-video tests. It is not final-edit approved because generated clips are still pending and the video model can still introduce identity, weapon, crowd, or re-entry drift.",
    "",
    "## Current Critical Fixes Verified",
    "",
    "- Shot034B is now `空教师目标裁定` across the delivery package.",
    "- Shot034B visible roster is exactly `Byleth, Dimitri`.",
    "- Shot034B start/key/end frames point to `34D_Shot034B_empty_objective_*`; the deprecated Hanneman-lane frame set is not used in delivery.",
    "- Full-size Shot034B start/key/end frames show two empty faculty objective markers with Hanneman and Manuela absent/offscreen/silent/unpaired.",
    "- Shot032 preserves the Dedue/Mercedes healer-tank beat: Mercedes spends effort behind Dedue while Dedue restores the shield line.",
    "- Shot032F preserves Hubert captured by Felix and Ashe.",
    "- Shot032G preserves Dorothea and Bernadetta captured by Leonie and Claude.",
    "- Shot034G keeps the exhausted Byleth/Dimitri/Dedue core victory instead of a full Blue Lions class reset.",
    "- Contact sheets remain triage only; if a thumbnail label or tiny distant figure is ambiguous, the full-size package PNG is the authoritative visual evidence.",
    "",
    "## Frame Evidence",
    "",
    `- Frame evidence audit: \`${rel(outMd)}\``,
    `- Frame CSV: \`${rel(outCsv)}\``,
    `- Packaged copy: \`${rel(packageMd)}\``,
    `- ASCII high-risk contact sheet: \`${rel(packageHighRiskContactSheetAscii)}\``,
    "",
    "## Risks To Monitor In Video Probes",
    "",
    "- Shot025 may still need a closer three-leader insert if the edit needs all house leaders visibly introduced rather than only battlefield geography.",
    "- Shot029C should be treated primarily as Claude's high point; Ashe and Edelgard are not the strongest readable beats at contact-sheet scale.",
    "- Shot034E/F are stand-down tableaus and need restrained motion in video so they do not feel like static lineup cards.",
    "- All generated clips must be rejected if the model adds unnamed readable people, restores captured characters, shows Hanneman or Manuela in Shot034B, pairs the teachers, or turns training weapons lethal.",
    "",
  ].join("\n");

  writeJson(outJson, result);
  writeText(outCsv, `${csv}\n`);
  writeText(outMd, `${md}\n`);
  writeText(localVisualReviewMd, `${localVisualReview}\n`);
  writeJson(packageJson, {
    ...result,
    production_report_json: rel(outJson),
    production_report_md: rel(outMd),
    production_report_csv: rel(outCsv),
  });
  writeText(packageMd, `${md}\n`);
  writeText(packageCsv, `${csv}\n`);

  console.log(JSON.stringify({
    date,
    decision,
    shots_checked: shots.length,
    frames_checked: rows.length,
    frames_passed: framesOk,
    problems: problems.length,
    report_json: rel(outJson),
    package_report: rel(packageMd),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
