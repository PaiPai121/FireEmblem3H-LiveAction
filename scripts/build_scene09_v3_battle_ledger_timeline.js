#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-07-28";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(root, "production_system/video_delivery_manifest.json");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(outDir, `scene09_v3_battle_ledger_timeline_${date}.json`);
const outMd = path.join(outDir, `scene09_v3_battle_ledger_timeline_${date}.md`);
const outCsv = path.join(outDir, `scene09_v3_battle_ledger_timeline_${date}.csv`);
const packageCsv = path.join(packageDir, "battle_ledger_timeline.csv");
const packageMd = path.join(packageDir, "battle_ledger_timeline.md");
const packageJson = path.join(packageDir, "battle_ledger_timeline.json");
const hardCapturedNoReadableReturn = new Set(["Hubert", "Dorothea", "Bernadetta"]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function rel(file) {
  return path.relative(root, file);
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}

function groupText(groups) {
  if (!groups || typeof groups !== "object") return "none";
  const rows = Object.entries(groups)
    .filter(([, names]) => Array.isArray(names) && names.length)
    .map(([group, names]) => `${group}: ${names.join(", ")}`);
  return rows.length ? rows.join("; ") : "none";
}

function changeText(changes) {
  const rows = Array.isArray(changes) ? changes : [];
  return rows.length
    ? rows.map((item) => `${item.name || item}:${item.status || item.label || "changed"}`).join("; ")
    : "none";
}

function sameList(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function promptNoActive(prompt) {
  return prompt.match(/No-active-combat after this shot:\s*(.+?)(?:\.|\n|$)/)?.[1]?.trim() || "";
}

function setFromGroups(groups) {
  return new Set(flattenGroups(groups));
}

function intersection(values, set) {
  return values.filter((value) => set.has(value));
}

function difference(setA, setB) {
  return [...setA].filter((value) => !setB.has(value));
}

function unique(values) {
  return values.filter((value, index, all) => value && all.indexOf(value) === index);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function negativePrompt(prompt) {
  const match = prompt.match(/Negative Prompt:\s*([\s\S]*)$/);
  return match ? match[1] : "";
}

function hasReadableReturnConflict(name, prompt) {
  const negative = negativePrompt(prompt);
  return new RegExp(`\\bno\\s+readable\\s+(return\\s+of\\s+)?${escapeRegExp(name)}\\b`, "i").test(negative);
}

function hasNonActiveVisibleContext(name, prompt) {
  const haystack = String(prompt || "").toLowerCase();
  const lowerName = String(name || "").toLowerCase();
  if (!haystack.includes(lowerName)) return false;
  return [
    "stand down",
    "stands down",
    "stood down",
    "post-action",
    "post-battle",
    "combat over",
    "lowered",
    "lowers",
    "lower ",
    "concession",
    "defeated",
    "route block",
    "restrained respect",
    "dignified",
    "remain absent",
    "already captured",
    "not return active",
  ].some((token) => haystack.includes(token));
}

function metadataPaths(pkgShot) {
  const shotDir = path.join(packageDir, pkgShot.package_dir);
  return {
    shotDir,
    metadata: path.join(shotDir, "metadata.json"),
    prompt: path.join(shotDir, "prompt.md"),
    modelPrompt: path.join(shotDir, "model_prompt.md"),
  };
}

function build() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing active manifest: ${manifestPath}`);
  if (!fs.existsSync(packageManifestPath)) throw new Error(`Missing handoff package manifest: ${packageManifestPath}`);
  const manifest = readJson(manifestPath);
  const packageManifest = readJson(packageManifestPath);
  const packageByShot = new Map((packageManifest.shots || []).map((shot) => [shot.shot, shot]));
  const problems = [];
  const rows = [];
  const stateMachineRows = [];
  const knownNames = new Set(flattenGroups((manifest.shots || [])[0]?.battle_state_after?.battle_ledger_after?.alive_by_house || {}));
  let previousMustNotReturn = new Set();
  let previousCapturedObjectiveDefeated = new Set();

  for (const shot of manifest.shots || []) {
    const pkgShot = packageByShot.get(shot.shot);
    if (!pkgShot) {
      problems.push(`${shot.shot}: missing from handoff package manifest`);
      continue;
    }
    const paths = metadataPaths(pkgShot);
    const metadata = fs.existsSync(paths.metadata) ? readJson(paths.metadata) : null;
    const prompt = readText(paths.prompt);
    const modelPrompt = readText(paths.modelPrompt);
    const ledger = shot.battle_ledger_after || shot.battle_state_after?.battle_ledger_after;
    const metadataLedger = metadata?.battle_state_after?.battle_ledger_after;
    const visible = shot.visible_named_only || [];
    const packageVisible = pkgShot.visible_named_only || [];
    const metadataVisible = metadata?.visible_named_only || [];
    const currentActive = setFromGroups(ledger?.still_active_or_controlling_objective_by_house);
    const currentMustNotReturn = setFromGroups(ledger?.must_not_return_active_by_house);
    const mustNotReturn = flattenGroups(ledger?.must_not_return_active_by_house);
    const modelNoActive = promptNoActive(modelPrompt);
    const promptHasLedger = prompt.includes("Battle Ledger After This Shot:");
    const stateProblems = [];
    const visibleUnknown = visible.filter((name) => !knownNames.has(name));
    const visiblePreviousMustNot = intersection(visible, previousMustNotReturn);
    const visiblePreviousCaptured = intersection(visible, previousCapturedObjectiveDefeated)
      .filter((name) => hardCapturedNoReadableReturn.has(name));
    const activePreviousMustNot = intersection([...currentActive], previousMustNotReturn);
    const activeCurrentMustNot = intersection([...currentActive], currentMustNotReturn);
    const missingStickyMustNot = difference(previousMustNotReturn, currentMustNotReturn);
    const visibleNonActiveContextMissing = visiblePreviousMustNot
      .filter((name) => !previousCapturedObjectiveDefeated.has(name))
      .filter((name) => !hasNonActiveVisibleContext(name, modelPrompt));
    const visibleNegativeConflicts = visiblePreviousMustNot
      .filter((name) => hasReadableReturnConflict(name, modelPrompt));

    if (!ledger) problems.push(`${shot.shot}: active manifest missing battle_ledger_after`);
    if (!metadataLedger) problems.push(`${shot.shot}: package metadata missing battle_ledger_after`);
    if (!sameList(visible, packageVisible)) problems.push(`${shot.shot}: active manifest visible ${visible.join(",") || "none"} differs from package manifest ${packageVisible.join(",") || "none"}`);
    if (!sameList(visible, metadataVisible)) problems.push(`${shot.shot}: active manifest visible ${visible.join(",") || "none"} differs from package metadata ${metadataVisible.join(",") || "none"}`);
    if (ledger?.all_named_characters_alive !== true) problems.push(`${shot.shot}: ledger does not preserve all_named_characters_alive=true`);
    if (!promptHasLedger) problems.push(`${shot.shot}: prompt.md missing Battle Ledger After This Shot block`);
    if (!/No-active-combat after this shot:/.test(modelPrompt)) problems.push(`${shot.shot}: model_prompt.md missing No-active-combat line`);
    for (const name of mustNotReturn) {
      if (!modelNoActive.includes(name)) problems.push(`${shot.shot}: ${name} is in ledger must_not_return_active but missing from model prompt No-active-combat line`);
    }
    if (visibleUnknown.length) stateProblems.push(`visible roster contains non-ledger names: ${visibleUnknown.join(", ")}`);
    if (activePreviousMustNot.length) stateProblems.push(`previous must-not-return characters are active again: ${activePreviousMustNot.join(", ")}`);
    if (activeCurrentMustNot.length) stateProblems.push(`current active roster overlaps current must-not-return list: ${activeCurrentMustNot.join(", ")}`);
    if (missingStickyMustNot.length) stateProblems.push(`previous must-not-return characters dropped from current must-not-return list: ${missingStickyMustNot.join(", ")}`);
    if (visiblePreviousCaptured.length) stateProblems.push(`previously captured/objective-defeated characters reappear readable: ${visiblePreviousCaptured.join(", ")}`);
    if (visibleNonActiveContextMissing.length) stateProblems.push(`visible previously retired characters lack non-active/post-battle context: ${visibleNonActiveContextMissing.join(", ")}`);
    if (visibleNegativeConflicts.length) stateProblems.push(`negative prompt forbids readable return for visible retired characters: ${visibleNegativeConflicts.join(", ")}`);
    for (const problem of stateProblems) problems.push(`${shot.shot}: ${problem}`);

    if (shot.shot === "Shot034B") {
      if (!sameList(visible, ["Byleth", "Dimitri"])) problems.push("Shot034B: visible lock must be Byleth, Dimitri");
      if (visible.includes("Hanneman")) problems.push("Shot034B: Hanneman must remain absent from visible roster");
      if (visible.includes("Manuela")) problems.push("Shot034B: Manuela must remain absent from visible roster");
      if (!/Empty faculty objective ruling/.test(modelPrompt) || !/Only these readable humans may appear: Byleth, Dimitri\./.test(modelPrompt) || !/Two far-separated faculty objective markers must be empty/.test(modelPrompt) || !/No Hanneman voice and no Manuela voice in this shot/.test(modelPrompt)) {
        problems.push("Shot034B: model prompt missing empty-objective / teacher-absent lock");
      }
    }
    rows.push({
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      status: shot.status,
      visible_named_only: visible,
      alive_by_house: ledger?.alive_by_house || {},
      active_by_house: ledger?.still_active_or_controlling_objective_by_house || {},
      limited_by_house: ledger?.limited_but_not_defeated_by_house || {},
      defeated_removed_by_house: ledger?.mock_battle_defeated_or_removed_by_house || {},
      captured_objective_defeated_by_house: ledger?.captured_or_objective_defeated_by_house || {},
      stood_down_post_battle_by_house: ledger?.stood_down_or_post_battle_by_house || {},
      must_not_return_active_by_house: ledger?.must_not_return_active_by_house || {},
      changed_this_shot: ledger?.changed_this_shot || [],
      all_named_characters_alive: ledger?.all_named_characters_alive === true,
      no_active_combat_line: modelNoActive || "none",
      package_dir: pkgShot.package_dir,
    });
    stateMachineRows.push({
      order: shot.order,
      shot: shot.shot,
      id: shot.id,
      visible_named_only: visible,
      previous_must_not_return_active: [...previousMustNotReturn],
      previous_captured_objective_defeated: [...previousCapturedObjectiveDefeated],
      current_active_or_objective: [...currentActive],
      current_must_not_return_active: [...currentMustNotReturn],
      visible_previous_must_not_return: visiblePreviousMustNot,
      visible_previous_captured_objective_defeated: visiblePreviousCaptured,
      active_previous_must_not_return: activePreviousMustNot,
      active_current_must_not_return_overlap: activeCurrentMustNot,
      missing_sticky_must_not_return: missingStickyMustNot,
      visible_retired_context_missing: visibleNonActiveContextMissing,
      visible_negative_prompt_conflicts: visibleNegativeConflicts,
      state_machine_problems: stateProblems,
    });
    previousMustNotReturn = new Set([...previousMustNotReturn, ...currentMustNotReturn]);
    previousCapturedObjectiveDefeated = new Set([
      ...previousCapturedObjectiveDefeated,
      ...flattenGroups(ledger?.captured_or_objective_defeated_by_house),
    ]);
  }

  const rowsDigest = sha256Text(`${JSON.stringify(rows)}\n`);
  const stateMachineRowsDigest = sha256Text(`${JSON.stringify(stateMachineRows)}\n`);
  const result = {
    date,
    decision: problems.length ? "battle_ledger_timeline_failed" : "battle_ledger_timeline_passed",
    active_manifest: rel(manifestPath),
    package_manifest: rel(packageManifestPath),
    shots: rows.length,
    rows_digest_sha256: rowsDigest,
    state_machine_rows_digest_sha256: stateMachineRowsDigest,
    state_machine_rows: stateMachineRows,
    problems,
    rows,
  };

  const csvHeaders = [
    "order",
    "shot",
    "visible_named_only",
    "alive",
    "active_or_objective",
    "limited",
    "defeated_removed",
    "captured_objective_defeated",
    "stood_down_post_battle",
    "must_not_return_active",
    "changed_this_shot",
    "no_active_combat_line",
  ];
  const csvRows = [
    csvHeaders.join(","),
    ...rows.map((row) => [
      row.order,
      row.shot,
      row.visible_named_only.join("; "),
      groupText(row.alive_by_house),
      groupText(row.active_by_house),
      groupText(row.limited_by_house),
      groupText(row.defeated_removed_by_house),
      groupText(row.captured_objective_defeated_by_house),
      groupText(row.stood_down_post_battle_by_house),
      groupText(row.must_not_return_active_by_house),
      changeText(row.changed_this_shot),
      row.no_active_combat_line,
    ].map(csvCell).join(",")),
  ].join("\n");

  const md = [
    "# Scene09 V3 Battle Ledger Timeline",
    "",
    `Date: ${date}`,
    `Decision: ${result.decision}`,
    `Shots: ${rows.length}`,
    `State machine digest: ${stateMachineRowsDigest}`,
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Timeline",
    "",
    "| # | Shot | Visible | Active / Objective | Defeated / Removed | Captured / Objective | Must Not Return Active | Changed |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows.map((row) => [
      `| ${row.order}`,
      row.shot,
      row.visible_named_only.join(", ") || "none",
      groupText(row.active_by_house),
      groupText(row.defeated_removed_by_house),
      groupText(row.captured_objective_defeated_by_house),
      groupText(row.must_not_return_active_by_house),
      changeText(row.changed_this_shot),
    ].join(" | ") + " |"),
    "",
  ].join("\n");

  writeText(outJson, `${JSON.stringify(result, null, 2)}\n`);
  writeText(outMd, `${md}\n`);
  writeText(outCsv, `${csvRows}\n`);
  writeText(packageJson, `${JSON.stringify(result, null, 2)}\n`);
  writeText(packageMd, `${md}\n`);
  writeText(packageCsv, `${csvRows}\n`);

  process.stdout.write(`${JSON.stringify({
    decision: result.decision,
    shots: rows.length,
    problems: problems.length,
    report_json: rel(outJson),
    report_md: rel(outMd),
    report_csv: rel(outCsv),
    package_json: rel(packageJson),
    package_csv: rel(packageCsv),
  }, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

build();
