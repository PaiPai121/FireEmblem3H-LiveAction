#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const queuePath = path.join(packageDir, "submission_queue.csv");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const ledgerJsonPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json");
const outCsv = path.join(packageDir, "submission_queue_with_battle_ledger.csv");
const outMd = path.join(packageDir, "submission_queue_with_battle_ledger.md");
const outJson = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_submission_queue_with_battle_ledger_2026-08-01.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function rel(file) {
  return path.relative(root, file);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
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

function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}

function visibleButNoActiveText(visible, ledger) {
  const active = new Set(flattenGroups(ledger.active_by_house || ledger.still_active_or_controlling_objective_by_house));
  const inactiveVisible = (visible || []).filter((name) => name && !active.has(name));
  return inactiveVisible.length ? inactiveVisible.join(", ") : "none";
}

function rowByShot(rows) {
  return new Map(rows.map((row) => [row.shot, row]));
}

function fileInShotDir(pkgShot, file) {
  return `${pkgShot.package_dir}/${file}`;
}

function operatorGuard(pkgShot, ledger) {
  const visible = (pkgShot.visible_named_only || []).join(", ") || "none";
  const mustNotReturn = groupText(ledger.must_not_return_active_by_house);
  return [
    `Visible named-only: ${visible}.`,
    `After this shot, must not return active: ${mustNotReturn}.`,
    "No anonymous readable students, spectators, soldiers, crowds, bystanders, or silhouettes.",
    "All combat remains nonlethal mock-battle action.",
  ].join(" ");
}

function build() {
  const problems = [];
  if (!fs.existsSync(queuePath)) problems.push(`Missing submission queue: ${rel(queuePath)}`);
  if (!fs.existsSync(packageManifestPath)) problems.push(`Missing package manifest: ${rel(packageManifestPath)}`);
  if (!fs.existsSync(ledgerJsonPath)) problems.push(`Missing battle ledger JSON: ${rel(ledgerJsonPath)}`);
  if (problems.length) throw new Error(problems.join("\n"));

  const packageManifest = readJson(packageManifestPath);
  const ledger = readJson(ledgerJsonPath);
  const packageByShot = rowByShot(packageManifest.shots || []);
  const ledgerByShot = rowByShot(ledger.rows || []);
  const rows = [];

  for (const pkgShot of packageManifest.shots || []) {
    const ledgerRow = ledgerByShot.get(pkgShot.shot);
    if (!ledgerRow) {
      problems.push(`${pkgShot.shot}: missing from battle ledger timeline`);
      continue;
    }
    const visible = pkgShot.visible_named_only || [];
    const mustNotReturnNames = flattenGroups(ledgerRow.must_not_return_active_by_house);
    const noActiveLine = ledgerRow.no_active_combat_line || "none";
    for (const name of mustNotReturnNames) {
      if (!noActiveLine.includes(name)) problems.push(`${pkgShot.shot}: ${name} missing from No-active-combat line`);
    }
    if (pkgShot.shot === "Shot034B") {
      if (JSON.stringify(visible) !== JSON.stringify(["Byleth", "Dimitri"])) {
        problems.push("Shot034B: visible lock is not Byleth, Dimitri");
      }
      if (!String(pkgShot.title || pkgShot.titleZh || "").includes("空教师目标裁定")) {
        problems.push("Shot034B: title is not 空教师目标裁定");
      }
      if (visible.includes("Hanneman")) problems.push("Shot034B: Hanneman appears in visible roster");
      if (visible.includes("Manuela")) problems.push("Shot034B: Manuela appears in visible roster");
    }

    rows.push({
      order: pkgShot.order,
      shot: pkgShot.shot,
      status: pkgShot.status,
      duration_seconds: pkgShot.duration_seconds,
      shot_dir: pkgShot.package_dir,
      model_prompt: fileInShotDir(pkgShot, "model_prompt.md"),
      negative_prompt: fileInShotDir(pkgShot, "negative_prompt.md"),
      start_frame: fileInShotDir(pkgShot, "start_frame.png"),
      key_frame: fileInShotDir(pkgShot, "key_frame.png"),
      end_frame: fileInShotDir(pkgShot, "end_frame.png"),
      expected_clip: pkgShot.expected_clip,
      visible_named_only: visible.join("; "),
      visible_but_no_active_combat_after: visibleButNoActiveText(visible, ledgerRow),
      active_or_objective_after: groupText(ledgerRow.active_by_house),
      limited_after: groupText(ledgerRow.limited_by_house),
      defeated_removed_after: groupText(ledgerRow.defeated_removed_by_house),
      captured_objective_defeated_after: groupText(ledgerRow.captured_objective_defeated_by_house),
      stood_down_post_battle_after: groupText(ledgerRow.stood_down_post_battle_by_house),
      must_not_return_active_after: groupText(ledgerRow.must_not_return_active_by_house),
      changed_this_shot: changeText(ledgerRow.changed_this_shot),
      no_active_combat_line: noActiveLine,
      operator_guard: operatorGuard(pkgShot, ledgerRow),
    });
  }

  if (rows.length !== 42) problems.push(`Expected 42 rows, got ${rows.length}`);
  for (const shot of ["Shot032F", "Shot032G", "Shot034B", "Shot034G", "Shot036"]) {
    if (!packageByShot.has(shot) || !ledgerByShot.has(shot)) problems.push(`${shot}: missing critical queue/ledger row`);
  }
  const shot032F = rows.find((row) => row.shot === "Shot032F");
  const shot032G = rows.find((row) => row.shot === "Shot032G");
  const shot034G = rows.find((row) => row.shot === "Shot034G");
  if (shot032F && !shot032F.captured_objective_defeated_after.includes("Hubert")) problems.push("Shot032F: Hubert capture not present after shot");
  if (shot032G && (!shot032G.captured_objective_defeated_after.includes("Dorothea") || !shot032G.captured_objective_defeated_after.includes("Bernadetta"))) {
    problems.push("Shot032G: Dorothea/Bernadetta capture not present after shot");
  }
  if (shot034G && !/^Byleth; Dimitri; Dedue$/.test(shot034G.visible_named_only)) problems.push("Shot034G: visible core is not Byleth; Dimitri; Dedue");

  const headers = [
    "order",
    "shot",
    "status",
    "duration_seconds",
    "shot_dir",
    "model_prompt",
    "negative_prompt",
    "start_frame",
    "key_frame",
    "end_frame",
    "expected_clip",
    "visible_named_only",
    "visible_but_no_active_combat_after",
    "active_or_objective_after",
    "limited_after",
    "defeated_removed_after",
    "captured_objective_defeated_after",
    "stood_down_post_battle_after",
    "must_not_return_active_after",
    "changed_this_shot",
    "no_active_combat_line",
    "operator_guard",
  ];
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((key) => csvCell(row[key])).join(",")),
  ].join("\n");

  const md = [
    "# Submission Queue With Battle Ledger",
    "",
    "Decision: " + (problems.length ? "failed" : "passed"),
    `Rows: ${rows.length}`,
    "",
    "This operator table joins each video-model work order with the post-shot battle ledger, so captured, defeated, stood-down, or objective-defeated characters cannot accidentally re-enter active combat in later clips.",
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Critical Continuity Rows",
    "",
    "| # | Shot | Visible | Visible But No Active Combat After | Captured / Objective Defeated After | Must Not Return Active After | Changed |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows
      .filter((row) => ["Shot032F", "Shot032G", "Shot034B", "Shot034G", "Shot036"].includes(row.shot))
      .map((row) => `| ${row.order} | ${row.shot} | ${row.visible_named_only || "none"} | ${row.visible_but_no_active_combat_after || "none"} | ${row.captured_objective_defeated_after} | ${row.must_not_return_active_after} | ${row.changed_this_shot} |`),
    "",
    "## Files",
    "",
    `- CSV: \`${rel(outCsv)}\``,
    `- Source queue: \`${rel(queuePath)}\``,
    `- Source battle ledger: \`${rel(ledgerJsonPath)}\``,
    "",
  ].join("\n");

  const result = {
    date: "2026-08-01",
    decision: problems.length ? "submission_queue_with_battle_ledger_failed" : "submission_queue_with_battle_ledger_passed",
    source_queue: rel(queuePath),
    source_battle_ledger: rel(ledgerJsonPath),
    package_csv: rel(outCsv),
    package_md: rel(outMd),
    rows: rows.length,
    problems,
  };

  writeText(outCsv, `${csv}\n`);
  writeText(outMd, `${md}\n`);
  writeText(outJson, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (problems.length) process.exit(1);
}

build();
