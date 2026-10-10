#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const shot = "Shot034G";
const packageRoot = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const visible = ["Byleth", "Dimitri", "Dedue"];
const frames = {
  start_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/37E_Shot034G_core_victory_lance_start.png",
  key_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/37E_Shot034G_core_victory_lance_key.png",
  end_frame: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/37E_Shot034G_core_victory_lance_end.png",
};
const motion = "Blue Lions win through the surviving core only. Byleth confirms the objective with a small, tired command gesture; Dimitri lowers a clearly readable long wooden training lance with a blunt padded practice tip and exhales; Dedue plants the large padded shield and leans into it for support. The shot resolves into quiet exhausted victory, not celebration.";
const primaryCheck = "Visible named-only: Byleth, Dimitri, Dedue. Dimitri must hold a clearly readable long wooden training lance with a blunt padded practice tip, not a mace, hammer, staff, axe, club, sword, or cropped ambiguous prop. Dedue keeps the large padded shield. Blue Lions win through the surviving core only; spent Blue Lions do not return for a full-class victory reset. Reject if any extra readable human appears.";
const rejectIf = [
  "Reject if anyone outside Byleth, Dimitri, and Dedue appears.",
  "Reject if Dimitri's weapon reads as a mace, hammer, staff, axe, club, sword, short baton, metal polearm, or cropped ambiguous prop instead of a long wooden training lance with blunt padded practice tip.",
  "Reject if Dedue loses the large padded shield or swaps it for a weapon-forward attack pose.",
  "Reject if Annette, Mercedes, Sylvain, Ingrid, Ashe, Felix, or any other spent Blue Lion returns as a readable victory participant.",
  "Reject if the shot becomes a full Blue Lions class celebration instead of the exhausted Byleth/Dimitri/Dedue core.",
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
function writeJson(rel, value) {
  fs.mkdirSync(path.dirname(abs(rel)), { recursive: true });
  fs.writeFileSync(abs(rel), `${JSON.stringify(value, null, 2)}\n`);
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
function uniqueLines(lines) {
  return [...new Set((lines || []).filter(Boolean))];
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
  row.reject_if = uniqueLines([...rejectIf, ...(row.reject_if || []).filter((line) => !/Annette|Mercedes|Sylvain|Ingrid|Ashe|full Blue Lions|outside Byleth, Dimitri, and Dedue|Dimitri.*mace|Dedue loses|extra readable human/i.test(line))]);
  patchLedgerContainer(row);
  if (row.battle_state_after) {
    row.battle_state_after.visible_named_only = [...visible];
    patchFrames(row.battle_state_after);
    row.battle_state_after.note = "Blue Lions win through Byleth, Dimitri, and Dedue only; spent classmates remain stood down.";
    patchLedgerContainer(row.battle_state_after);
  }
  if (row.roster_after) {
    row.roster_after.visible_named_only = [...visible];
    patchFrames(row.roster_after);
    row.roster_after.note = "Blue Lions win through Byleth, Dimitri, and Dedue only; spent classmates remain stood down.";
    patchLedgerContainer(row.roster_after);
  }
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
  }
}

console.log(JSON.stringify({ ok: true, decision: "scene09_034G_core_victory_lance_authoritative_applied", shot, visible_named_only: visible, source_frames: frames }, null, 2));
