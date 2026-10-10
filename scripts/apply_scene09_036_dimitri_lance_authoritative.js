#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const shot = "Shot036";
const packageRoot = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const visible = ["Dimitri", "Byleth"];
const frames = {
  start_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/40C_Shot036_lance_start.png",
  key_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/40C_Shot036_lance_key.png",
  end_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/40C_Shot036_lance_end.png",
};
const motion = "Quiet final stand-down. Dimitri lowers a clearly readable long wooden training lance with a blunt padded practice tip and exhales, exhausted rather than triumphant. Byleth watches in profile from screen right and gives the final calm acknowledgment. Two readable humans only.";
const primaryCheck = "Visible named-only: Dimitri, Byleth. Dimitri's weapon must remain a clearly readable long wooden training lance with a blunt padded practice tip, not a mace, hammer, staff, axe, club, sword, metal polearm, or cropped ambiguous prop. Reject if any extra readable human appears.";
const rejectIf = [
  "Reject if anyone outside Dimitri and Byleth appears.",
  "Reject if Dimitri's weapon reads as a mace, hammer, staff, axe, club, sword, metal polearm, short baton, or cropped ambiguous prop instead of a long wooden training lance with a blunt padded practice tip.",
  "Reject if Dimitri celebrates, poses triumphantly, or resumes attack action instead of exhausted stand-down.",
  "Reject if any captured, stood-down, or defeated-house character returns in readable form.",
  "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
];
const ledgerActive = { command: ["Byleth"], blue_lions: ["Dimitri", "Dedue"] };
const ledgerInactive = {
  blue_lions: ["Felix", "Ashe", "Annette", "Mercedes", "Sylvain", "Ingrid"],
  black_eagles: ["Edelgard", "Hubert", "Ferdinand", "Dorothea", "Bernadetta"],
  golden_deer: ["Claude", "Hilda", "Lorenz", "Ignatz", "Leonie"],
  hanneman_faculty_lane: ["Hanneman"],
  manuela_faculty_lane: ["Manuela"],
};
const ledgerAlive = {
  command: ["Byleth"],
  blue_lions: ["Dimitri", "Dedue", "Felix", "Ashe", "Annette", "Mercedes", "Sylvain", "Ingrid"],
  black_eagles: ["Edelgard", "Hubert", "Ferdinand", "Dorothea", "Bernadetta"],
  golden_deer: ["Claude", "Hilda", "Lorenz", "Ignatz", "Leonie"],
  hanneman_faculty_lane: ["Hanneman"],
  manuela_faculty_lane: ["Manuela"],
};
const ledgerNote =
  "安全存活/非致命：command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela 仍可主动参战/控制目标：command: Byleth; blue_lions: Dimitri, Dedue 已击败/被俘/目标判负/退场，不可再主动战斗：blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela";

function abs(rel) {
  return path.join(root, rel);
}
function readJson(rel) {
  return JSON.parse(fs.readFileSync(abs(rel), "utf8"));
}
function readText(rel) {
  return fs.readFileSync(abs(rel), "utf8");
}
function writeJson(rel, value) {
  fs.mkdirSync(path.dirname(abs(rel)), { recursive: true });
  fs.writeFileSync(abs(rel), `${JSON.stringify(value, null, 2)}\n`);
}
function writeText(rel, value) {
  fs.mkdirSync(path.dirname(abs(rel)), { recursive: true });
  fs.writeFileSync(abs(rel), value);
}
function patchFrames(row) {
  row.start_frame = frames.start_frame;
  row.key_frame = frames.key_frame;
  row.end_frame = frames.end_frame;
  row.source_frames = { start: frames.start_frame, key: frames.key_frame, end: frames.end_frame, ...frames };
  row.frames = {
    ...(row.frames || {}),
    start: { ...(row.frames?.start || {}), path: frames.start_frame },
    key: { ...(row.frames?.key || {}), path: frames.key_frame },
    end: { ...(row.frames?.end || {}), path: frames.end_frame },
    start_frame: frames.start_frame,
    key_frame: frames.key_frame,
    end_frame: frames.end_frame,
  };
}
function patchLedgerContainer(container) {
  if (!container) return;
  const ledgers = [];
  if (container.battle_ledger_after) ledgers.push(container.battle_ledger_after);
  if (container.battle_after?.battle_ledger_after) ledgers.push(container.battle_after.battle_ledger_after);
  for (const ledger of ledgers) {
    ledger.all_named_characters_alive = true;
    ledger.alive_by_house = ledgerAlive;
    ledger.still_active_or_controlling_objective_by_house = ledgerActive;
    ledger.mock_battle_defeated_or_removed_by_house = ledgerInactive;
    ledger.must_not_return_active_by_house = ledgerInactive;
    ledger.note_cn = ledgerNote;
  }
  if (container.battle_after) {
    container.battle_after.alive_by_house = ledgerAlive;
    container.battle_after.active_or_available_by_house = ledgerActive;
    container.battle_after.defeated_or_retired_by_rule_by_house = ledgerInactive;
    container.battle_after.must_not_return_active_by_house = ledgerInactive;
    container.battle_after.summary_cn = ledgerNote;
  }
}
function patchShot(row) {
  if (!row || row.shot !== shot) return;
  row.visible_named_only = [...visible];
  row.characters = visible.join(", ");
  patchFrames(row);
  row.motion = motion;
  row.video_prompt = motion;
  row.primary_check = primaryCheck;
  row.primary_continuity_check = primaryCheck;
  row.reject_if = [...rejectIf];
  patchLedgerContainer(row);
  if (row.battle_state_after) {
    row.battle_state_after.visible_named_only = [...visible];
    patchFrames(row.battle_state_after);
    row.battle_state_after.motion = motion;
    row.battle_state_after.video_prompt = motion;
    row.battle_state_after.note = "Dimitri and Byleth close the mock battle in exhausted stand-down; Dimitri's long wooden training lance remains readable.";
    patchLedgerContainer(row.battle_state_after);
  }
  if (row.roster_after) {
    row.roster_after.visible_named_only = [...visible];
    patchFrames(row.roster_after);
    row.roster_after.note = "Only Dimitri and Byleth remain readable in the final aftermath frame.";
    patchLedgerContainer(row.roster_after);
  }
}
function patchPromptText(text) {
  let next = text
    .replace(/episodes\/EP02\/generated\/scene09_rebuild_v2_2026-07-21\/40_Shot036_start\.png/g, frames.start_frame)
    .replace(/episodes\/EP02\/generated\/scene09_rebuild_v2_2026-07-21\/40_Shot036_key\.png/g, frames.key_frame)
    .replace(/episodes\/EP02\/generated\/scene09_rebuild_v2_2026-07-21\/end_patch_2026-07-25\/40B_Shot036_end\.png/g, frames.end_frame);
  if (!next.includes("Dimitri's weapon must remain a clearly readable long wooden training lance")) {
    next = next.replace(
      /(Reject If:\n)/,
      `$1- Dimitri's weapon must remain a clearly readable long wooden training lance with a blunt padded practice tip; reject mace, hammer, staff, axe, club, sword, metal polearm, short baton, or cropped ambiguous prop.\n`
    );
  }
  return next;
}

for (const rel of [
  "production_system/video_delivery_manifest.json",
  "production_system/scene09_v3_attrition_package/video_delivery_manifest_v3_attrition_2026-07-25.json",
  "production_system/scene09_v3_attrition_package/video_delivery_manifest_v3_attrition_2026-07-27.json",
  `${packageRoot}/package_manifest.json`,
]) {
  if (!fs.existsSync(abs(rel))) continue;
  const json = readJson(rel);
  (json.shots || []).forEach(patchShot);
  writeJson(rel, json);
}

const queueRel = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json";
if (fs.existsSync(abs(queueRel))) {
  const queue = readJson(queueRel);
  queue.filter((item) => item.shot === shot).forEach(patchShot);
  writeJson(queueRel, queue);
}

const execRel = `${packageRoot}/execution_plan.json`;
if (fs.existsSync(abs(execRel))) {
  const json = readJson(execRel);
  (json.work_orders || []).forEach(patchShot);
  writeJson(execRel, json);
}

const packageManifestRel = `${packageRoot}/package_manifest.json`;
if (fs.existsSync(abs(packageManifestRel))) {
  const packageShot = (readJson(packageManifestRel).shots || []).find((row) => row.shot === shot);
  const shotDir = packageShot?.package_dir;
  if (shotDir) {
    const metadataRel = `${packageRoot}/${shotDir}/metadata.json`;
    if (fs.existsSync(abs(metadataRel))) {
      const metadata = readJson(metadataRel);
      patchShot(metadata);
      writeJson(metadataRel, metadata);
    }
    for (const [source, dest] of [
      [frames.start_frame, `${packageRoot}/${shotDir}/start_frame.png`],
      [frames.key_frame, `${packageRoot}/${shotDir}/key_frame.png`],
      [frames.end_frame, `${packageRoot}/${shotDir}/end_frame.png`],
    ]) {
      fs.mkdirSync(path.dirname(abs(dest)), { recursive: true });
      fs.copyFileSync(abs(source), abs(dest));
    }
    for (const rel of [
      `${packageRoot}/${shotDir}/prompt.md`,
      `${packageRoot}/${shotDir}/model_prompt.md`,
    ]) {
      if (fs.existsSync(abs(rel))) writeText(rel, patchPromptText(readText(rel)));
    }
  }
}

const productionPromptRel = "production_system/scene09_v3_attrition_package/production_video_prompts/Shot036_production_video_prompt_v3.md";
if (fs.existsSync(abs(productionPromptRel))) writeText(productionPromptRel, patchPromptText(readText(productionPromptRel)));

console.log(JSON.stringify({ ok: true, decision: "scene09_036_dimitri_lance_authoritative_applied", shot, visible_named_only: visible, source_frames: frames }, null, 2));
