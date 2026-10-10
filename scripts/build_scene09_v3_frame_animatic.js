const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const root = process.cwd();
const manifestPath = path.join(root, "production_system/video_delivery_manifest.json");
const outDir = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition");
const concatList = path.join(outDir, "scene09_v3_frame_animatic_2026-07-27.concat.txt");
const outFile = path.join(outDir, "scene09_v3_frame_animatic_2026-07-27.mp4");
const reportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_frame_animatic_2026-07-27.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function quoteConcatPath(file) {
  return file.replace(/'/g, "'\\''");
}

function main() {
  const manifest = readJson(manifestPath);
  const shots = [...manifest.shots].sort((a, b) => Number(a.order) - Number(b.order));
  fs.mkdirSync(outDir, { recursive: true });

  const lines = [];
  for (const shot of shots) {
    const duration = Number(shot.duration_seconds || 6) / 3;
    for (const field of ["start_frame", "key_frame", "end_frame"]) {
      const framePath = path.join(root, shot[field]);
      if (!fs.existsSync(framePath)) throw new Error(`${shot.shot} missing ${field}: ${shot[field]}`);
      lines.push(`file '${quoteConcatPath(framePath)}'`);
      lines.push(`duration ${duration.toFixed(3)}`);
    }
  }
  const finalFrame = path.join(root, shots[shots.length - 1].end_frame);
  lines.push(`file '${quoteConcatPath(finalFrame)}'`);
  fs.writeFileSync(concatList, `${lines.join("\n")}\n`);

  const args = [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatList,
    "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
    "-r", "24",
    "-an",
    outFile,
  ];
  const result = cp.spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`ffmpeg exited ${result.status}`);

  fs.writeFileSync(reportPath, [
    "# Scene09 V3 Frame Animatic Reference",
    "",
    "Date: 2026-07-27",
    "Decision: animatic_reference_only",
    "",
    `Output: \`${path.relative(root, outFile)}\``,
    `Source manifest: \`${path.relative(root, manifestPath)}\``,
    `Shots: ${shots.length}`,
    "Total runtime target: 252 seconds",
    "",
    "This is a still-frame timing reference made from each shot's start/key/end frames. It is not an AI video-model generation result and must not be used as clip-level approval.",
    "",
  ].join("\n"));

  console.log(JSON.stringify({
    decision: "animatic_reference_only",
    output: path.relative(root, outFile),
    concat_list: path.relative(root, concatList),
    report: path.relative(root, reportPath),
    shots: shots.length,
  }, null, 2));
}

main();
