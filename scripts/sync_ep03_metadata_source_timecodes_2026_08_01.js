const fs = require("fs");

const epRoot = "episodes/EP03";
const queue = JSON.parse(fs.readFileSync(`${epRoot}/frame_generation_queue.json`, "utf8"));

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

for (const shot of queue.shots || []) {
  const metadataPath = `${epRoot}/storyboards/${shot.id}/metadata.json`;
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  metadata.previous_source_timecode = metadata.previous_source_timecode || metadata.source_timecode || "";
  metadata.source_timecode = shot.source_timecode;
  metadata.source_timecode_audit = shot.source_timecode_audit || {};
  writeJson(metadataPath, metadata);
}

console.log(`synced source_timecode metadata for ${(queue.shots || []).length} EP03 shots`);
