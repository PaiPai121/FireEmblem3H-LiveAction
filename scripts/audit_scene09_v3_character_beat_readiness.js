#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const packageManifestPath = `${packageDir}/package_manifest.json`;
const audioContractPath = `${packageDir}/audio_timing_prompt_contract.json`;
const ledgerPath = "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json";
const outJson = "production_system/scene09_v3_attrition_package/scene09_v3_character_beat_readiness_audit_2026-08-01.json";
const outMd = "production_system/scene09_v3_attrition_package/scene09_v3_character_beat_readiness_audit_2026-08-01.md";
const packageJson = `${packageDir}/character_beat_readiness_audit.json`;
const packageMd = `${packageDir}/character_beat_readiness_audit.md`;

const houses = {
  command: ["Byleth"],
  blue_lions: ["Dimitri", "Dedue", "Felix", "Ashe", "Annette", "Mercedes", "Sylvain", "Ingrid"],
  black_eagles: ["Edelgard", "Hubert", "Ferdinand", "Dorothea", "Bernadetta"],
  golden_deer: ["Claude", "Hilda", "Lorenz", "Ignatz", "Leonie"],
  faculty: ["Hanneman", "Manuela"],
};
const roster = Object.values(houses).flat();

const expectedBeats = {
  Byleth: { highlight: ["Shot026", "Shot031B", "Shot032E", "Shot033B"], exit: ["Shot034B", "Shot036"], role: "command" },
  Dimitri: { highlight: ["Shot025", "Shot033", "Shot034G", "Shot036"], exit: ["Shot036"], role: "winner" },
  Dedue: { highlight: ["Shot032", "Shot034G"], exit: ["Shot034G"], role: "shield anchor" },
  Felix: { highlight: ["Shot027D", "Shot032F", "Shot034C", "Shot035"], exit: ["Shot034C"], role: "duelist/capture" },
  Ashe: { highlight: ["Shot027", "Shot029D", "Shot032F", "Shot033C"], exit: ["Shot033C"], role: "archer/suppression" },
  Annette: { highlight: ["Shot032A"], exit: ["Shot032A"], role: "support magic/smoke" },
  Mercedes: { highlight: ["Shot032"], exit: ["Shot032"], role: "healer" },
  Sylvain: { highlight: ["Shot029", "Shot029B", "Shot033D"], exit: ["Shot033D"], role: "flank redirection" },
  Ingrid: { highlight: ["Shot029B", "Shot033D"], exit: ["Shot033D"], role: "route cut" },
  Edelgard: { highlight: ["Shot025", "Shot028B", "Shot034F", "Shot034"], exit: ["Shot034F"], role: "Black Eagles leader" },
  Hubert: { highlight: ["Shot028B"], exit: ["Shot032F"], role: "Black Eagles tactical pressure" },
  Ferdinand: { highlight: ["Shot027C", "Shot034C"], exit: ["Shot034C"], role: "frontline counter" },
  Dorothea: { highlight: ["Shot032C"], exit: ["Shot032G"], role: "backline pressure" },
  Bernadetta: { highlight: ["Shot032G"], exit: ["Shot032G"], role: "backline capture" },
  Claude: { highlight: ["Shot029C", "Shot029D", "Shot032G", "Shot034E", "Shot034"], exit: ["Shot034E"], role: "Golden Deer strategist" },
  Hilda: { highlight: ["Shot029B", "Shot032C", "Shot034E"], exit: ["Shot034E"], role: "Golden Deer pressure" },
  Lorenz: { highlight: ["Shot029B", "Shot030C", "Shot034E"], exit: ["Shot034E"], role: "Golden Deer lane hold" },
  Ignatz: { highlight: ["Shot030C", "Shot034E"], exit: ["Shot034E"], role: "Golden Deer route cut" },
  Leonie: { highlight: ["Shot032G", "Shot034E"], exit: ["Shot034E"], role: "Golden Deer capture" },
  Hanneman: { highlight: ["Shot032B", "Shot033C", "Shot034D", "Shot034B"], exit: ["Shot034B"], role: "faculty objective" },
  Manuela: { highlight: ["Shot033D"], exit: ["Shot033D"], role: "faculty route objective" },
};

const strictVideoCostBlockers = [];
const problems = [];
const warnings = [];

function full(file) {
  return path.join(root, file);
}
function readJson(file) {
  return JSON.parse(fs.readFileSync(full(file), "utf8"));
}
function readText(file) {
  return fs.existsSync(full(file)) ? fs.readFileSync(full(file), "utf8") : "";
}
function write(file, text) {
  fs.mkdirSync(path.dirname(full(file)), { recursive: true });
  fs.writeFileSync(full(file), text);
}
function rowsOf(data, key) {
  if (Array.isArray(data)) return data;
  return data[key] || data.shots || data.rows || [];
}
function byShot(rows) {
  return new Map(rows.map((row) => [row.shot, row]));
}
function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}
function shotText(shot) {
  const dir = `${packageDir}/${shot.package_dir}`;
  return [
    readText(`${dir}/model_prompt.md`),
    readText(`${dir}/prompt.md`),
    readText(`${dir}/metadata.json`),
  ].join("\n");
}
function hasShot(shotMap, shotName) {
  return shotMap.has(shotName);
}
function visibleIn(shotMap, name, shotName) {
  const shot = shotMap.get(shotName);
  return Boolean(shot && Array.isArray(shot.visible_named_only) && shot.visible_named_only.includes(name));
}
function promptMentions(shotMap, name, shotName) {
  const shot = shotMap.get(shotName);
  return Boolean(shot && new RegExp(`\\b${name}\\b`).test(shotText(shot)));
}
function changedMentions(ledgerMap, name, shotName) {
  const row = ledgerMap.get(shotName);
  const changed = row?.changed_this_shot || [];
  return changed.some((item) => item.name === name || JSON.stringify(item).includes(name));
}
function noActiveLineMentions(ledgerMap, name, shotName) {
  return String(ledgerMap.get(shotName)?.no_active_combat_line || "").includes(name);
}
function lineSpeakers(audioRows) {
  const speakers = new Map();
  for (const row of audioRows) {
    for (const line of row.final_dialogue_lines || []) {
      if (!speakers.has(line.speaker)) speakers.set(line.speaker, []);
      speakers.get(line.speaker).push({ shot: row.shot, line: line.line });
    }
  }
  return speakers;
}

function main() {
  const manifest = readJson(packageManifestPath);
  const shots = rowsOf(manifest, "shots").sort((a, b) => Number(a.order) - Number(b.order));
  const shotMap = byShot(shots);
  const audio = readJson(audioContractPath);
  const audioRows = rowsOf(audio, "rows");
  const speakers = lineSpeakers(audioRows);
  const ledger = readJson(ledgerPath);
  const ledgerRows = rowsOf(ledger, "rows");
  const ledgerMap = byShot(ledgerRows);

  const characterRows = [];
  for (const name of roster) {
    const expectation = expectedBeats[name];
    const visibleShots = shots.filter((shot) => (shot.visible_named_only || []).includes(name)).map((shot) => shot.shot);
    const dialogue = speakers.get(name) || [];
    const highlightEvidence = expectation.highlight.map((shotName) => ({
      shot: shotName,
      exists: hasShot(shotMap, shotName),
      visible: visibleIn(shotMap, name, shotName),
      prompt_mentions: promptMentions(shotMap, name, shotName),
    }));
    const exitEvidence = expectation.exit.map((shotName) => ({
      shot: shotName,
      exists: hasShot(shotMap, shotName),
      visible: visibleIn(shotMap, name, shotName),
      changed: changedMentions(ledgerMap, name, shotName),
      no_active_line: noActiveLineMentions(ledgerMap, name, shotName),
    }));
    const highlightOk = highlightEvidence.some((item) => item.exists && (item.visible || item.prompt_mentions));
    const exitOk = exitEvidence.some((item) => item.exists && (item.visible || item.changed || item.no_active_line));
    const dialogueOk = dialogue.length > 0;
    const row = {
      name,
      house: Object.entries(houses).find(([, names]) => names.includes(name))?.[0],
      role: expectation.role,
      visible_shots: visibleShots,
      dialogue_lines: dialogue,
      highlight_evidence: highlightEvidence,
      exit_evidence: exitEvidence,
      highlight_ok: highlightOk,
      exit_ok: exitOk,
      dialogue_ok: dialogueOk,
      decision: highlightOk && exitOk ? (dialogueOk ? "covered" : "covered_no_dialogue") : "blocked_needs_revision",
    };
    characterRows.push(row);
    if (!highlightOk) problems.push(`${name}: missing usable highlight evidence in ${expectation.highlight.join(", ")}`);
    if (!exitOk) problems.push(`${name}: missing usable exit/defeat/stand-down evidence in ${expectation.exit.join(", ")}`);
    if (!dialogueOk) warnings.push(`${name}: no final dialogue line in audio timing contract`);
  }

  const houseChecks = [];
  for (const [house, names] of Object.entries(houses)) {
    if (house === "command" || house === "faculty") continue;
    const covered = names.filter((name) => characterRows.find((row) => row.name === name)?.highlight_ok);
    const exits = names.filter((name) => characterRows.find((row) => row.name === name)?.exit_ok);
    houseChecks.push({ house, highlight_covered: covered, exit_covered: exits, total: names.length });
    if (covered.length < names.length) problems.push(`${house}: missing highlights for ${names.filter((name) => !covered.includes(name)).join(", ")}`);
    if (exits.length < names.length) problems.push(`${house}: missing exits/stand-downs for ${names.filter((name) => !exits.includes(name)).join(", ")}`);
  }

  const specialChecks = [];
  function addSpecial(id, ok, detail, severity = "problem") {
    specialChecks.push({ id, ok, detail });
    if (!ok) (severity === "warning" ? warnings : problems).push(`${id}: ${detail}`);
  }
  const shot034B = shotMap.get("Shot034B");
  const shot034BText = shot034B ? shotText(shot034B) : "";
  addSpecial(
    "Shot034B current user-preferred contract",
    Boolean(shot034B && shot034B.titleZh === "空教师目标裁定" && JSON.stringify(shot034B.visible_named_only) === JSON.stringify(["Byleth", "Dimitri"]) && /34D_Shot034B_empty_objective/.test(JSON.stringify(shot034B))),
    "Expected empty faculty objective ruling with Byleth/Dimitri only; current package must stay guarded by the authoritative empty-objective build and hard audits."
  );
  if (shot034B && /汉尼曼单线目标裁定|Hanneman single lane|Byleth, Dimitri, Hanneman/.test(`${shot034B.titleZh}\n${shot034BText}`)) {
    strictVideoCostBlockers.push("Shot034B still contains old Hanneman-lane contract text in current files.");
  }
  addSpecial(
    "Three-house balance",
    houseChecks.every((row) => row.highlight_covered.length === row.total),
    "Each house should have highlights for every named student before video generation."
  );
  addSpecial(
    "Blue Lions narrow win",
    ["Shot034E", "Shot034F", "Shot034G", "Shot034", "Shot036"].every((shot) => shotMap.has(shot)),
    "Ending must include Golden Deer concession, Black Eagles concession, exhausted Blue Lions core, result, and Dimitri/Byleth stand-down."
  );
  addSpecial(
    "Dedue/Mercedes healer-restores-shield beat",
    /Mercedes completes one short white healing pulse|healing pulse/i.test(shotText(shotMap.get("Shot032") || {})) && /Dedue/i.test(shotText(shotMap.get("Shot032") || {})),
    "Shot032 must preserve the WoW-inspired wounded shield anchor restored by healer beat."
  );

  const result = {
    date,
    decision: problems.length || strictVideoCostBlockers.length ? "blocked_needs_revision" : "character_beat_ready",
    shots_checked: shots.length,
    characters_checked: characterRows.length,
    strict_video_cost_blockers: strictVideoCostBlockers,
    problems,
    warnings,
    house_checks: houseChecks,
    special_checks: specialChecks,
    character_rows: characterRows,
  };

  const md = [
    "# Scene09 V3 Character Beat Readiness Audit",
    "",
    `Date: ${date}`,
    `Decision: ${result.decision}`,
    `Shots checked: ${shots.length}`,
    `Characters checked: ${characterRows.length}`,
    "",
    "## Strict Video-Cost Blockers",
    "",
    strictVideoCostBlockers.length ? strictVideoCostBlockers.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Problems",
    "",
    problems.length ? problems.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Warnings",
    "",
    warnings.length ? warnings.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## House Coverage",
    "",
    "| House | Highlight coverage | Exit/stand-down coverage |",
    "| --- | --- | --- |",
    ...houseChecks.map((row) => `| ${row.house} | ${row.highlight_covered.length}/${row.total}: ${row.highlight_covered.join(", ")} | ${row.exit_covered.length}/${row.total}: ${row.exit_covered.join(", ")} |`),
    "",
    "## Character Coverage",
    "",
    "| Character | House | Decision | Visible shots | Dialogue lines |",
    "| --- | --- | --- | --- | --- |",
    ...characterRows.map((row) => `| ${row.name} | ${row.house} | ${row.decision} | ${row.visible_shots.join(", ") || "none"} | ${row.dialogue_lines.length} |`),
    "",
    "## Notes",
    "",
    "- This audit checks story and package evidence only. It does not approve visual likeness, age, weapon shape, or screen direction by itself.",
    "- Shot034B empty-objective stability is guarded by the authoritative package build, current-status consistency gate, and hard audits; any Hanneman-lane rewrite must fail before video submission.",
    "",
  ].join("\n");

  write(outJson, `${JSON.stringify(result, null, 2)}\n`);
  write(outMd, `${md}\n`);
  write(packageJson, `${JSON.stringify(result, null, 2)}\n`);
  write(packageMd, `${md}\n`);
  console.log(JSON.stringify({
    date,
    decision: result.decision,
    shots_checked: result.shots_checked,
    characters_checked: result.characters_checked,
    strict_video_cost_blockers: strictVideoCostBlockers.length,
    problems: problems.length,
    warnings: warnings.length,
    report: outMd,
  }, null, 2));
  process.exit(problems.length || strictVideoCostBlockers.length ? 1 : 0);
}

main();
