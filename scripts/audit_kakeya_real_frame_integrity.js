const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "specials", "kakeya_byleth_lecture");
const realRoot = path.join(projectRoot, "real_frames");
const outPath = path.join(projectRoot, "production_system", "reviews", "real_frame_integrity_audit_2026-07-28.json");

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function imageStats(filePath) {
  const script = `
from PIL import Image, ImageStat
img=Image.open(${JSON.stringify(filePath)}).convert("RGB")
stat=ImageStat.Stat(img)
print(img.size[0], img.size[1], round(sum(stat.mean)/3, 3), round(sum(stat.stddev)/3, 3))
`;
  const [width, height, mean, stddev] = execFileSync("python3", ["-c", script], { encoding: "utf8" }).trim().split(/\s+/);
  return { width: Number(width), height: Number(height), mean: Number(mean), stddev: Number(stddev) };
}

const frames = [];
const missing = [];
for (let i = 1; i <= 34; i += 1) {
  const shot = `SH${String(i).padStart(3, "0")}`;
  for (const frame of ["start", "key", "end"]) {
    const rel = `real_frames/${shot}/${frame}.png`;
    const abs = path.join(projectRoot, rel);
    if (!fs.existsSync(abs)) {
      missing.push(rel);
      continue;
    }
    const stats = imageStats(abs);
    frames.push({ shot, frame, path: rel, hash: sha256(abs), ...stats });
  }
}

const hashes = new Map();
for (const frame of frames) {
  if (!hashes.has(frame.hash)) hashes.set(frame.hash, []);
  hashes.get(frame.hash).push(frame.path);
}

const duplicateHashes = Array.from(hashes.entries())
  .filter(([, paths]) => paths.length > 1)
  .map(([hash, paths]) => ({ hash, paths }));

const badDimensions = frames.filter((frame) => frame.width !== 1672 || frame.height !== 941);
const lowInformation = frames.filter((frame) => frame.stddev < 10);
const tooDarkOrLight = frames.filter((frame) => frame.mean < 12 || frame.mean > 243);

const report = {
  project_id: "KAK-BYLETH-LECTURE",
  created_at: "2026-07-31",
  legacy_report_path_date: "2026-07-28",
  scope: {
    expected_shots: 34,
    expected_frames_per_shot: 3,
    expected_total_frames: 102,
    actual_frames: frames.length,
  },
  checks: {
    missing,
    bad_dimensions: badDimensions,
    duplicate_hashes: duplicateHashes,
    low_information: lowInformation,
    too_dark_or_light: tooDarkOrLight,
  },
  status:
    missing.length === 0 &&
    badDimensions.length === 0 &&
    duplicateHashes.length === 0 &&
    lowInformation.length === 0 &&
    tooDarkOrLight.length === 0
      ? "integrity_passed"
      : "integrity_blocked",
  notes:
    "Machine integrity audit only. It checks file presence, dimensions, blank/low-information risk, and exact duplicate hashes; it does not replace visual, math, motion, or continuity QA.",
  frames,
};

fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  status: report.status,
  actual_frames: frames.length,
  missing: missing.length,
  bad_dimensions: badDimensions.length,
  duplicate_hashes: duplicateHashes.length,
  low_information: lowInformation.length,
  too_dark_or_light: tooDarkOrLight.length,
  outPath,
}, null, 2));
