#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const activeManifestPath = path.join(root, "production_system/video_delivery_manifest.json");
const outDir = path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(outDir, "scene09_v3_narrative_hard_constraints_audit_2026-08-01.json");
const outMd = path.join(outDir, "scene09_v3_narrative_hard_constraints_audit_2026-08-01.md");
const packageJson = path.join(packageDir, "narrative_hard_constraints_audit.json");
const packageMd = path.join(packageDir, "narrative_hard_constraints_audit.md");

const knownReadableHumans = new Set([
  "Byleth",
  "Dimitri",
  "Dedue",
  "Felix",
  "Ashe",
  "Annette",
  "Mercedes",
  "Sylvain",
  "Ingrid",
  "Edelgard",
  "Hubert",
  "Ferdinand",
  "Dorothea",
  "Bernadetta",
  "Claude",
  "Hilda",
  "Lorenz",
  "Ignatz",
  "Leonie",
  "Hanneman",
  "Manuela",
]);

const checks = [];
const problems = [];
const warnings = [];

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

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function rel(file) {
  return path.relative(root, file);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function sameList(a, b) {
  return JSON.stringify(asArray(a)) === JSON.stringify(asArray(b));
}

function flattenGroups(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups).flatMap((names) => Array.isArray(names) ? names : []);
}

function includesAll(text, phrases) {
  return phrases.every((phrase) => text.includes(phrase));
}

function addCheck(label, ok, detail, severity = "problem") {
  checks.push({ label, ok, detail });
  if (!ok) {
    const line = `${label}: ${detail}`;
    if (severity === "warning") warnings.push(line);
    else problems.push(line);
  }
}

function shotDir(shot) {
  return path.join(packageDir, shot.package_dir || "");
}

function shotFiles(shot) {
  const dir = shotDir(shot);
  return {
    dir,
    metadata: path.join(dir, "metadata.json"),
    prompt: path.join(dir, "prompt.md"),
    modelPrompt: path.join(dir, "model_prompt.md"),
    negativePrompt: path.join(dir, "negative_prompt.md"),
  };
}

function metadataFor(shot) {
  const files = shotFiles(shot);
  return fs.existsSync(files.metadata) ? readJson(files.metadata) : {};
}

function ledgerFor(shot, metadata, activeShot) {
  return metadata.battle_state_after?.battle_ledger_after
    || metadata.battle_ledger_after
    || activeShot?.battle_ledger_after
    || activeShot?.battle_state_after?.battle_ledger_after
    || {};
}

function activeNames(ledger) {
  return flattenGroups(ledger.still_active_or_controlling_objective_by_house);
}

function visibleButNoActiveNames(visible, ledger) {
  const active = new Set(activeNames(ledger));
  return asArray(visible).filter((name) => name && !active.has(name));
}

function mustNotReturnNames(ledger) {
  return flattenGroups(ledger.must_not_return_active_by_house);
}

function changedStatuses(ledger) {
  return asArray(ledger.changed_this_shot).map((item) => `${item.name || ""}:${item.status || item.label || ""}`);
}

function requireShot(shotsByName, shotName) {
  const shot = shotsByName.get(shotName);
  addCheck(`${shotName} exists`, Boolean(shot), "required narrative beat is present");
  return shot;
}

function requireVisible(shotsByName, shotName, expected) {
  const shot = requireShot(shotsByName, shotName);
  if (!shot) return null;
  const visible = asArray(shot.visible_named_only);
  addCheck(`${shotName} visible lock`, sameList(visible, expected), `expected ${expected.join(", ") || "none"} got ${visible.join(", ") || "none"}`);
  return shot;
}

function main() {
  if (!fs.existsSync(packageManifestPath)) throw new Error(`Missing package manifest: ${packageManifestPath}`);
  if (!fs.existsSync(activeManifestPath)) throw new Error(`Missing active manifest: ${activeManifestPath}`);

  const packageManifest = readJson(packageManifestPath);
  const activeManifest = readJson(activeManifestPath);
  const shots = [...(packageManifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const activeByName = new Map((activeManifest.shots || []).map((shot) => [shot.shot, shot]));
  const shotsByName = new Map(shots.map((shot) => [shot.shot, shot]));

  addCheck("shot count", shots.length === 42, `expected 42 got ${shots.length}`);

  const globalModelPhrases = [
    "No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.",
    "Hanneman and Manuela are separate faculty examiners; never side by side, sharing one sigil, or allied partners.",
    "Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
    "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
    "Nonlethal mock battle only: no blood, gore, humiliation, or lethal hits.",
  ];
  const negativePhrases = [
    "no extra people",
    "no unnamed students",
    "no spectators",
    "no crowds",
    "no readable silhouettes",
    "no lethal hits",
    "no gore",
    "no blood",
    "no subtitles",
  ];

  for (const shot of shots) {
    const files = shotFiles(shot);
    const metadata = metadataFor(shot);
    const activeShot = activeByName.get(shot.shot);
    const visible = asArray(shot.visible_named_only);
    const metadataVisible = asArray(metadata.visible_named_only);
    const modelPrompt = readText(files.modelPrompt);
    const negativePrompt = readText(files.negativePrompt);
    const prompt = readText(files.prompt);
    const rejectText = [
      ...asArray(shot.reject_if),
      ...asArray(metadata.reject_if),
      modelPrompt,
      negativePrompt,
    ].join("\n");
    const expectedVisibleLine = `Only these readable humans may appear: ${visible.join(", ") || "none"}.`;

    addCheck(`${shot.shot} known readable humans`, visible.every((name) => knownReadableHumans.has(name)), `visible list contains only known named characters: ${visible.join(", ") || "none"}`);
    addCheck(`${shot.shot} no duplicate visible names`, new Set(visible).size === visible.length, `visible list: ${visible.join(", ") || "none"}`);
    addCheck(`${shot.shot} metadata visible sync`, sameList(visible, metadataVisible), `package ${visible.join(", ") || "none"} metadata ${metadataVisible.join(", ") || "none"}`);
    addCheck(`${shot.shot} model visible lock`, modelPrompt.includes(expectedVisibleLine), `missing exact line: ${expectedVisibleLine}`);
    addCheck(`${shot.shot} global hard locks`, includesAll(modelPrompt, globalModelPhrases), "model_prompt.md must carry no-extra, teacher-separation, capture-return, spent-return, and nonlethal locks");
    addCheck(`${shot.shot} negative hard locks`, includesAll(negativePrompt, negativePhrases), "negative_prompt.md must ban extras, readable silhouettes, lethal/gore/blood, and subtitles");
    addCheck(`${shot.shot} reject extras`, /extra readable human|anonymous student|unnamed students|readable silhouettes/i.test(rejectText), "reject criteria must ban unnamed readable people");
    addCheck(`${shot.shot} no active combat ledger line`, /No-active-combat after this shot:/.test(modelPrompt), "model_prompt.md must state no-active-combat after this shot");
    addCheck(`${shot.shot} battle ledger present in prompt`, prompt.includes("Battle Ledger After This Shot:"), "prompt.md must carry post-shot battle ledger");

    if (visible.includes("Hanneman") && visible.includes("Manuela")) {
      addCheck(`${shot.shot} teacher separation visible`, false, "Hanneman and Manuela must never be readable together");
    }
  }

  const shot032 = requireVisible(shotsByName, "Shot032", ["Dedue", "Mercedes"]);
  if (shot032) {
    const text = readText(shotFiles(shot032).modelPrompt);
    addCheck("Shot032 healer-tank action", includesAll(text, [
      "Mercedes completes one short white healing pulse",
      "Dedue's shield arm",
      "Dedue becomes the restored anchor",
      "Mercedes visibly spends effort",
    ]), "Dedue/Mercedes beat must preserve the healer-restores-shield-warrior visual grammar");
  }

  const shot032F = requireVisible(shotsByName, "Shot032F", ["Felix", "Ashe", "Hubert"]);
  if (shot032F) {
    const metadata = metadataFor(shot032F);
    const ledger = ledgerFor(shot032F, metadata, activeByName.get("Shot032F"));
    const text = readText(shotFiles(shot032F).modelPrompt);
    addCheck("Shot032F Hubert capture ledger", changedStatuses(ledger).some((item) => item.includes("Hubert:captured_by_felix_and_ashe")), "Hubert must be captured by Felix and Ashe in changed_this_shot");
    addCheck("Shot032F Hubert capture prompt", text.includes("Hubert is repelled and captured by Felix and Ashe"), "model prompt must state Hubert capture result");
  }

  const shot032G = requireVisible(shotsByName, "Shot032G", ["Claude", "Leonie", "Dorothea", "Bernadetta"]);
  if (shot032G) {
    const metadata = metadataFor(shot032G);
    const ledger = ledgerFor(shot032G, metadata, activeByName.get("Shot032G"));
    const text = readText(shotFiles(shot032G).modelPrompt);
    addCheck("Shot032G Dorothea capture ledger", changedStatuses(ledger).some((item) => item.includes("Dorothea:captured_by_leonie_and_claude")), "Dorothea must be captured by Leonie and Claude in changed_this_shot");
    addCheck("Shot032G Bernadetta capture ledger", changedStatuses(ledger).some((item) => item.includes("Bernadetta:captured_by_leonie_and_claude")), "Bernadetta must be captured by Leonie and Claude in changed_this_shot");
    addCheck("Shot032G backline capture prompt", text.includes("Dorothea and Bernadetta are captured by Leonie and Claude"), "model prompt must state Golden Deer backline capture result");
  }

  const shot034B = requireVisible(shotsByName, "Shot034B", ["Byleth", "Dimitri"]);
  if (shot034B) {
    const files = shotFiles(shot034B);
    const metadata = metadataFor(shot034B);
    const text = readText(files.modelPrompt);
    const negative = readText(files.negativePrompt);
    const framesOk = ["start_frame", "key_frame", "end_frame"].every((key) => String(metadata[key] || shot034B[key] || "").includes("34D_Shot034B_empty_objective"));
    addCheck("Shot034B empty objective frames", framesOk, "start/key/end must use 34D_Shot034B_empty_objective frame set");
    addCheck("Shot034B teacher absent lock", includesAll(text, [
      "Empty faculty objective ruling",
      "Two far-separated faculty objective markers must be empty.",
      "Hanneman and Manuela are absent, offscreen, silent, and unpaired.",
      "No Hanneman voice and no Manuela voice in this shot.",
      "Hubert remains captured by Felix and Ashe.",
      "Dorothea and Bernadetta remain captured by Leonie and Claude.",
    ]), "model prompt must lock empty objective and Hanneman/Manuela absence");
    addCheck("Shot034B negative teacher lock", includesAll(negative, [
      "no Hanneman",
      "no Manuela",
      "no paired teachers",
      "no second teacher",
      "no shared teacher sigil",
    ]), "negative prompt must ban teacher visibility and paired-teacher drift");
  }

  const shot034G = requireVisible(shotsByName, "Shot034G", ["Byleth", "Dimitri", "Dedue"]);
  if (shot034G) {
    const metadata = metadataFor(shot034G);
    const ledger = ledgerFor(shot034G, metadata, activeByName.get("Shot034G"));
    const active = activeNames(ledger).sort();
    const expectedActive = ["Byleth", "Dedue", "Dimitri"].sort();
    const text = readText(shotFiles(shot034G).modelPrompt);
    addCheck("Shot034G active core only", sameList(active, expectedActive), `expected active core ${expectedActive.join(", ")} got ${active.join(", ") || "none"}`);
    addCheck("Shot034G exhausted core victory prompt", includesAll(text, [
      "Blue Lions win through the surviving core only.",
      "quiet exhausted victory, not celebration",
      "the shot becomes a full Blue Lions class celebration",
    ]), "model prompt must prevent full-class victory reset");
  }

  const shot036 = requireVisible(shotsByName, "Shot036", ["Dimitri", "Byleth"]);
  if (shot036) {
    const text = readText(shotFiles(shot036).modelPrompt);
    addCheck("Shot036 final stand-down", includesAll(text, [
      "Quiet final stand-down.",
      "exhausted rather than triumphant",
      "Dimitri celebrates, poses triumphantly, or resumes attack action",
    ]), "final shot must be exhausted stand-down, not renewed combat");
  }

  const captureRules = [
    { afterOrder: 28, names: ["Hubert"], label: "Hubert after Shot032F" },
    { afterOrder: 29, names: ["Dorothea", "Bernadetta"], label: "Dorothea/Bernadetta after Shot032G" },
  ];
  for (const rule of captureRules) {
    for (const shot of shots.filter((item) => Number(item.order) > rule.afterOrder)) {
      const metadata = metadataFor(shot);
      const ledger = ledgerFor(shot, metadata, activeByName.get(shot.shot));
      const visible = asArray(shot.visible_named_only);
      const active = activeNames(ledger);
      for (const name of rule.names) {
        addCheck(`${shot.shot} ${name} no readable return`, !visible.includes(name), `${rule.label}: visible list is ${visible.join(", ") || "none"}`);
        addCheck(`${shot.shot} ${name} no active return`, !active.includes(name), `${rule.label}: active list is ${active.join(", ") || "none"}`);
      }
    }
  }

  for (const shot of shots) {
    const metadata = metadataFor(shot);
    const ledger = ledgerFor(shot, metadata, activeByName.get(shot.shot));
    const visible = asArray(shot.visible_named_only);
    const active = activeNames(ledger);
    const mustNotReturn = mustNotReturnNames(ledger);
    const visibleButNoActive = visibleButNoActiveNames(visible, ledger);
    const visibleButNoActiveLine = `- Visible But No Active Combat After: ${visibleButNoActive.length ? visibleButNoActive.join(", ") : "none"}.`;
    const modelPrompt = readText(shotFiles(shot).modelPrompt);
    addCheck(`${shot.shot} visible-but-no-active line`, modelPrompt.includes(visibleButNoActiveLine), `model_prompt.md must state ${visibleButNoActiveLine}`);
    for (const name of mustNotReturn) {
      addCheck(`${shot.shot} must-not-return not active ${name}`, !active.includes(name), `${name} appears in both must_not_return_active and active list`);
    }
  }

  const deprecated034B = [
    "Only these readable humans may appear: Byleth, Dimitri, Hanneman.",
    "Byleth, Dimitri, Hanneman only",
    "Hanneman is alone on his own faculty lane/platform",
    "Single-lane Hanneman ruling",
    "34D_Shot034B_hanneman_lane",
    "Hanneman single lane",
  ];
  const searchableFiles = [
    ...shots.flatMap((shot) => {
      const files = shotFiles(shot);
      return [files.prompt, files.modelPrompt, files.negativePrompt, files.metadata];
    }),
    path.join(packageDir, "submission_payload.jsonl"),
    path.join(packageDir, "submission_queue_with_battle_ledger.csv"),
    path.join(packageDir, "model_submission_batches", "index.html"),
    path.join(packageDir, "index.html"),
  ];
  for (const file of searchableFiles) {
    const text = readText(file);
    for (const phrase of deprecated034B) {
      addCheck(`deprecated 034B text ${path.relative(packageDir, file)}`, !text.includes(phrase), `found deprecated phrase: ${phrase}`);
    }
  }

  const passed = checks.filter((check) => check.ok).length;
  const result = {
    date,
    decision: problems.length ? "narrative_hard_constraints_failed" : "narrative_hard_constraints_passed",
    package_manifest: rel(packageManifestPath),
    active_manifest: rel(activeManifestPath),
    shots_checked: shots.length,
    checks_total: checks.length,
    checks_passed: passed,
    problems,
    warnings,
    evidence: {
      no_unknown_readable_people: "visible_named_only arrays only use the known named roster and every model/negative prompt bans unnamed readable people.",
      teacher_separation: "Hanneman and Manuela are never visible together; Shot034B locks both teachers absent/offscreen/silent/unpaired with empty objective markers.",
      capture_continuity: "Hubert capture, Dorothea/Bernadetta capture, and post-capture no-return checks are machine-verified.",
      visible_not_active_continuity: "Every model prompt states Visible But No Active Combat After, computed from visible_named_only minus active/objective-controlling after-state.",
      attrition_finish: "Shot034G keeps the exhausted Byleth/Dimitri/Dedue core; Shot036 ends as Dimitri/Byleth stand-down.",
    },
    checks,
  };

  const md = [
    "# Scene09 V3 Narrative Hard Constraints Audit",
    "",
    `Date: ${date}`,
    `Decision: ${result.decision}`,
    `Shots checked: ${shots.length}`,
    `Checks passed: ${passed}/${checks.length}`,
    "",
    "## Scope",
    "",
    "- No unnamed readable students, spectators, soldiers, crowds, bystanders, or silhouettes.",
    "- Hanneman and Manuela are separate faculty examiners and must not appear as a paired/same-lane unit.",
    "- Hubert is captured by Felix and Ashe in Shot032F and must not return afterward.",
    "- Dorothea and Bernadetta are captured by Leonie and Claude in Shot032G and must not return afterward.",
    "- Dedue and Mercedes preserve the healer-restores-shield-warrior beat in Shot032.",
    "- Final Blue Lions victory remains exhausted core victory, not full-class reset.",
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Warnings",
    "",
    warnings.length ? warnings.map((warning) => `- ${warning}`).join("\n") : "- none",
    "",
  ].join("\n");

  writeJson(outJson, result);
  writeText(outMd, `${md}\n`);
  writeJson(packageJson, {
    ...result,
    checks: undefined,
    production_report_json: rel(outJson),
    production_report_md: rel(outMd),
  });
  writeText(packageMd, `${md}\n`);

  console.log(JSON.stringify({
    date,
    decision: result.decision,
    shots_checked: result.shots_checked,
    checks_passed: result.checks_passed,
    checks_total: result.checks_total,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report: rel(packageMd),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
