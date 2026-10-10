#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const productionManifestPath = path.join(root, "production_system/video_delivery_manifest.json");
const frameQueuePath = path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json");
const executionPlanPath = path.join(packageDir, "execution_plan.json");
const submissionQueuePath = path.join(packageDir, "submission_queue.csv");
const submissionPayloadPath = path.join(packageDir, "submission_payload.jsonl");
const submissionPayloadManifestPath = path.join(packageDir, "submission_payload_manifest.json");

const knownNames = [
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
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeText(file, value) {
  fs.writeFileSync(file, value);
}

function writeJsonl(file, rows) {
  fs.writeFileSync(file, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`);
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

function parseCsv(text) {
  const lines = String(text || "").split(/\r?\n/).filter((line) => line.length);
  if (!lines.length) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });
  return { headers, rows };
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(file, headers, rows) {
  const lines = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")),
  ];
  fs.writeFileSync(file, `${lines.join("\n")}\n`);
}

function indexByShot(rows) {
  return new Map((rows || []).map((row) => [row.shot, row]));
}

function digest(file) {
  const buf = fs.readFileSync(file);
  return {
    bytes: buf.length,
    sha256: crypto.createHash("sha256").update(buf).digest("hex"),
  };
}

function packageFiles(pkgShot) {
  const dir = path.join(packageDir, pkgShot.package_dir);
  return {
    model_prompt: path.join(dir, "model_prompt.md"),
    audit_prompt: path.join(dir, "prompt.md"),
    negative_prompt: path.join(dir, "negative_prompt.md"),
    start_frame: path.join(dir, "start_frame.png"),
    key_frame: path.join(dir, "key_frame.png"),
    end_frame: path.join(dir, "end_frame.png"),
    metadata: path.join(dir, "metadata.json"),
  };
}

function frameSetFrom(pkgShot) {
  return {
    start: { path: pkgShot.start_frame },
    key: { path: pkgShot.key_frame },
    end: { path: pkgShot.end_frame },
    start_frame: pkgShot.start_frame,
    key_frame: pkgShot.key_frame,
    end_frame: pkgShot.end_frame,
  };
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

function unique(values) {
  return values.filter((value, index, all) => value && all.indexOf(value) === index);
}

function namesInText(text) {
  return knownNames.filter((name) => new RegExp(`\\b${name}\\b`).test(String(text || "")));
}

function hasPhrase(text, phrase) {
  return String(text || "").toLowerCase().includes(String(phrase || "").toLowerCase());
}

function hasHeading(text, heading) {
  return new RegExp(`(^|\\n)\\s*#*\\s*${heading}\\s*:`, "i").test(text);
}

const promptHeadings = [
  "Status",
  "Shot ID",
  "Title",
  "Duration",
  "Input Frames",
  "Visible readable humans",
  "Motion",
  "Camera",
  "Performance",
  "Audio",
  "Continuity Locks",
  "Attrition State After This Shot",
  "Battle Ledger After This Shot",
  "Reject If",
  "Negative Prompt",
];

function cleanPromptSection(value) {
  return String(value || "").replace(/\s+\n/g, "\n").trim();
}

function sectionByHeadings(text, heading, headings = promptHeadings) {
  const lines = String(text || "").split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${heading}:`);
  if (start < 0) return "";
  const headingSet = new Set(headings.map((name) => `${name}:`));
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (headingSet.has(lines[index].trim())) {
      end = index;
      break;
    }
  }
  return cleanPromptSection(lines.slice(start + 1, end).join("\n"));
}

function sourcePromptPath(metadata) {
  return metadata.source_prompt_path ? path.join(root, metadata.source_prompt_path) : null;
}

function battleStateFrom(pkgShot, metadata) {
  return metadata.battle_state_after || pkgShot.battle_state_after || {};
}

function battleLedgerFrom(pkgShot, metadata) {
  const state = battleStateFrom(pkgShot, metadata);
  return state.battle_ledger_after || metadata.battle_ledger_after || pkgShot.battle_ledger_after || {};
}

function ledgerDisplayFields(pkgShot, metadata) {
  const state = battleStateFrom(pkgShot, metadata);
  const ledger = battleLedgerFrom(pkgShot, metadata);
  const visible = pkgShot.visible_named_only || metadata.visible_named_only || [];
  const active = new Set(flattenGroups(ledger.still_active_or_controlling_objective_by_house || state.active_by_house));
  const inactiveVisible = visible.filter((name) => name && !active.has(name));
  const noActive = unique([
    ...(Array.isArray(state.inactive_or_removed_after) ? state.inactive_or_removed_after : []),
    ...(Array.isArray(state.no_active_combat_after) ? state.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
  ]);
  return {
    alive_safe_after: groupText(ledger.alive_by_house || state.active_by_house),
    visible_but_no_active_combat_after: inactiveVisible.length ? inactiveVisible.join(", ") : "none",
    active_or_objective_after: groupText(ledger.still_active_or_controlling_objective_by_house || state.active_by_house),
    limited_after: groupText(ledger.limited_but_not_defeated_by_house),
    defeated_removed_after: groupText(ledger.mock_battle_defeated_or_removed_by_house || state.inactive_by_house),
    captured_objective_defeated_after: groupText(ledger.captured_or_objective_defeated_by_house),
    stood_down_post_battle_after: groupText(ledger.stood_down_or_post_battle_by_house),
    must_not_return_active_after: groupText(ledger.must_not_return_active_by_house),
    changed_this_shot: changeText(ledger.changed_this_shot),
    no_active_combat_line: noActive.join(", ") || "none",
  };
}

function noActiveNames(pkgShot, metadata) {
  const state = battleStateFrom(pkgShot, metadata);
  const ledger = battleLedgerFrom(pkgShot, metadata);
  const display = ledgerDisplayFields(pkgShot, metadata);
  return unique([
    ...(Array.isArray(state.inactive_or_removed_after) ? state.inactive_or_removed_after : []),
    ...(Array.isArray(state.no_active_combat_after) ? state.no_active_combat_after : []),
    ...flattenGroups(ledger.must_not_return_active_by_house),
    ...namesInText(display.must_not_return_active_after),
    ...namesInText(display.no_active_combat_line),
  ]);
}

function capturedNames(pkgShot, metadata) {
  const ledger = battleLedgerFrom(pkgShot, metadata);
  const display = ledgerDisplayFields(pkgShot, metadata);
  return unique([
    ...flattenGroups(ledger.captured_or_objective_defeated_by_house),
    ...flattenGroups(ledger.captured_objective_defeated_by_house),
    ...namesInText(display.captured_objective_defeated_after),
  ]);
}

function appendMissingLines(text, heading, lines) {
  const missing = lines.filter((line) => !String(text).includes(line));
  if (!missing.length) return text;
  if (!hasHeading(text, heading)) {
    return `${text.trimEnd()}\n\n${heading}:\n${missing.map((line) => `- ${line}`).join("\n")}\n`;
  }
  return `${text.trimEnd()}\n${missing.map((line) => `- ${line}`).join("\n")}\n`;
}

function normalizeExecutableSection(sectionName, text, shot) {
  let normalized = cleanPromptSection(text);
  if (!normalized) {
    if (sectionName === "Motion") {
      normalized = "Animate the uploaded START frame into the KEY frame and settle into the END frame with restrained mock-battle motion. Keep readable characters facing the live threat, not posing toward camera.";
    } else if (sectionName === "Camera") {
      normalized = "Preserve the uploaded frame composition. Use a restrained push, pan, tilt, or settle that clarifies the tactical beat without crossing screen direction.";
    } else if (sectionName === "Performance") {
      normalized = "Show academy-age tactical focus, controlled breath, weapon discipline, and nonlethal classroom urgency. Avoid static portrait posing.";
    } else {
      normalized = "No key dialogue. Sound design only: field ambience, boots on dirt, cloth, armor, wooden training weapon movement, restrained breath, and a soft tail into the cut.";
    }
  }
  if (shot === "Shot029") {
    normalized = normalized.replace(
      /while Ignatz maintains a diagonal bow threat toward the far Black Eagles lane\./g,
      "while no readable Ignatz appears and the far Black Eagles lane remains pressured only as offscreen route context."
    );
  }
  if (shot === "Shot032G") {
    normalized = normalized.replace(
      /End with Dorothea and Bernadetta no longer in active attack posture\./g,
      "End with Dorothea and Bernadetta held in a captured, non-active posture; no renewed attack by Dorothea or Bernadetta."
    );
  }
  if (shot === "Shot034C") {
    normalized = normalized.replace(
      /Felix blocks Ferdinand's return route without striking\./g,
      "Felix and Ferdinand remain in a route-blocked, non-active standoff; no renewed attack, no strike, no thrust."
    );
  }
  const requiredByShot = {
    Shot025: [
      "Dimitri, Edelgard, and Claude step into three separated starting lanes, turn their eyelines toward their assigned routes, and settle their training weapons at ready height as the exam begins.",
      "The beat is rule geography in motion, not a static lineup.",
    ],
    Shot025A: [
      "Use subtle but visible motion: flags tremble, dust drifts along the lanes, and colored house markers settle into the map without adding readable people.",
      "This is a quiet geography insert, not a still frame.",
    ],
    Shot026C: [
      "No freeze at the start: Blue Lions are already shifting from the observation ledge into the field lanes, with Byleth remaining a readable command observer at the rear edge.",
    ],
    Shot027: [
      "No freeze at the start: Ashe visibly turns his head and shoulders toward Claude's hidden side route while keeping the bow lowered but ready.",
    ],
    Shot031B: [
      "No static tableau: Byleth's command must trigger visible lane reordering by Dimitri, Dedue, Sylvain, Ingrid, Annette, and Mercedes.",
    ],
    Shot032: [
      "Mercedes completes one short white healing pulse into Dedue's shield arm.",
      "Dedue becomes the restored anchor while Mercedes visibly spends effort.",
    ],
    Shot032B: [
      "No freeze at the start: Dimitri and Dedue visibly advance toward Hanneman's separate objective platform while Hanneman remains alone.",
    ],
    Shot032D: [
      "Use visible micro-action: route glows and dust trails shift across the battlefield while every readable figure keeps the same lane logic.",
      "This tactical overview is not a still frame.",
    ],
    Shot032E: [
      "Use visible micro-action: Byleth's pointing hand completes the lane call while colored route lines slide into their final tactical intersection.",
      "This command overview is not a still frame.",
    ],
    Shot032F: [
      "Hubert is repelled and captured by Felix and Ashe.",
    ],
    Shot032G: [
      "Dorothea and Bernadetta are captured by Leonie and Claude.",
    ],
    Shot034B: [
      "Empty faculty objective ruling.",
      "Two far-separated faculty objective markers must be empty.",
      "Hanneman and Manuela are absent, offscreen, silent, and unpaired.",
      "No Hanneman voice and no Manuela voice in this shot.",
      "Hubert remains captured by Felix and Ashe.",
      "Dorothea and Bernadetta remain captured by Leonie and Claude.",
      "Use subtle but visible micro-action: Byleth completes the ruling gesture, Dimitri breathes hard and lowers the blunt training lance, and the empty objective markers remain visibly empty.",
      "This is a quiet ruling beat, not a still frame.",
    ],
    Shot034: [
      "Use subtle but visible performance motion: the three house leaders exchange eyelines and relax their training weapons into a mutual-recognition beat.",
      "This is a quiet post-battle recognition shot, not a still frame.",
    ],
    Shot034G: [
      "Use visible micro-action: Dimitri lowers his blunt training lance, Dedue resets the shield edge, and Byleth finishes the ruling gesture.",
      "This is an exhausted narrow-win beat, not a still frame.",
    ],
  };
  for (const sentence of requiredByShot[shot] || []) {
    if (!normalized.includes(sentence)) normalized = `${normalized} ${sentence}`;
  }
  return normalized;
}

function audioForShot(pkgShot) {
  const dialogue = {
    Shot025: [
      'Manuela, offscreen left lane: "目标计时开始，别抢线。"',
      'Hanneman, offscreen right lane: "非致命，判断优先。"',
    ],
    Shot026: [
      'Byleth: "杜笃守正面，英谷莉特看右线。"',
      'Felix: "那我呢？"',
      'Byleth: "机会不等于命令。"',
    ],
    Shot027: ['Ashe: "左前方有黑鹫。"', 'Dimitri: "稳住，先挡第一波。"'],
    Shot027B: ['Edelgard: "黑鹫，压住他们的中线。"', 'Ferdinand: "我来开路。"'],
    Shot027C: ['Dimitri: "杜笃，正面挡住。"', 'Edelgard: "费尔迪南特，别让他们转身。"'],
    Shot027D: ['Sylvain: "等他回身。"', 'Ingrid: "我已经看见破绽。"'],
    Shot028: ['Annette: "风从右侧走。"', 'Mercedes: "我在你后面。"'],
    Shot028B: ['Hubert: "绕开盾牌。"', 'Dorothea: "别给他们喘息。"'],
    Shot029: ['Hilda: "蓝狮也不能只盯着前面吧？"', 'Lorenz: "黑鹫那边也在我们的线里。"'],
    Shot029B: ['Claude: "两边都别放松。"', 'Ignatz: "我把黑鹫的退路封住。"', 'Leonie: "我压黑鹫后排。"'],
    Shot030: ['Dimitri: "别追太深。"', 'Dedue: "我挡得住。"'],
    Shot030B: ['Edelgard: "保持队形。"', 'Hubert: "青狮的侧翼露出来了。"'],
    Shot031: ['Felix: "别挡我的路。"', 'Ferdinand: "那就用剑证明。"'],
    Shot031B: ['Ashe: "箭线封住了。"', 'Bernadetta: "我、我知道了！"'],
    Shot032: ['Dimitri: "杜笃，撑住。"', 'Mercedes: "杜笃，手臂给我。"', 'Dedue: "我还能站稳。"', 'Mercedes: "那就再撑一口气。"'],
    Shot032B: ['Dimitri: "谢谢你，梅尔塞德斯。"', 'Mercedes: "还没结束，殿下。"'],
    Shot032C: ['Annette: "现在换我们推回去。"', 'Sylvain: "听你的。"'],
    Shot032D: ['Ingrid: "右线收紧。"', 'Felix: "别让他再进来。"'],
    Shot032E: ['Claude: "希尔妲，别只打蓝狮。"', 'Hilda: "知道啦，黑鹫也跑不掉。"'],
    Shot032F: ['Felix: "到此为止。"', 'Ashe: "修伯特，被包住了。"'],
    Shot032G: ['Claude: "后排，我们收下了。"', 'Leonie: "别再拉弓了。"'],
    Shot033: ['Dimitri: "不要散，目标快到了。"', 'Byleth: "保持三线。"'],
    Shot033B: ['Byleth: "亚修左线，英谷莉特右线，菲力克斯封中。"', 'Dimitri: "明白。"'],
    Shot033C: ['Annette: "风压只推线，不伤人。"', 'Mercedes: "我看着大家。"'],
    Shot033D: ['Ingrid: "老师，我只取目标线。"', 'Manuela, offscreen: "判定有效，继续。"'],
    Shot034: ['Edelgard: "还没结束。"', 'Dimitri: "我也不会退。"'],
    Shot034B: ['Claude: "金鹿撤出主线。"', 'Hilda: "哎，差一点就赢了。"'],
    Shot034C: ['Felix: "回路被封住了。"', 'Ferdinand: "我承认，这一步被你抢先。"'],
    Shot034D: ['Hanneman, offscreen: "蓝狮目标判定成立。"', 'Byleth: "停止追击。"'],
    Shot034E: ['Claude: "今天先到这里。"', 'Leonie: "下次我会追到底。"'],
    Shot034F: ['Edelgard: "黑鹫认定退线。"', 'Ferdinand: "下一次我会取回局面。"'],
    Shot035: ['Felix: "险胜而已。"', 'Byleth: "所以才值得复盘。"'],
    Shot036: ['Dimitri: "所有人，归队。"', 'Dedue: "无人重伤。"'],
    Shot037: ['Mercedes: "我再检查一次。"', 'Dedue: "劳烦你。"'],
    Shot038: ['Annette: "我们的配合成功了。"', 'Ingrid: "也暴露了空隙。"'],
    Shot039: ['Sylvain: "赢是赢了，差点被绕穿。"', 'Ashe: "金鹿那一下很准。"'],
    Shot040: ['Claude: "蓝狮今天拿走胜场。"', 'Edelgard: "但不是单方面的胜利。"'],
    Shot041: ['Byleth: "记录完成。"', 'Dimitri: "我们会继续改进。"'],
  };
  const lines = dialogue[pkgShot.shot];
  if (!lines) {
    return "No key dialogue. Sound design only: field ambience, boots on dirt, cloth, armor, wooden training weapon movement, restrained breath, and a soft tail into the cut.";
  }
  const visible = new Set(pkgShot.visible_named_only || []);
  const scopedLines = lines.map((line) => {
    const match = line.match(/^([A-Za-z]+)([^:]*):\s*"([^"]+)"$/);
    if (!match || visible.has(match[1]) || /offscreen|off-screen/i.test(match[2])) return line;
    return `${match[1]}, offscreen${match[2]}: "${match[3]}"`;
  });
  return `${scopedLines.join(" ")} Sound design: field ambience, restrained breath, armor and wooden training weapon detail; no subtitles, captions, UI text, or readable on-screen words.`;
}

function attritionStateText(pkgShot, metadata) {
  const display = ledgerDisplayFields(pkgShot, metadata);
  return [
    "- All named characters remain alive and safe under mock-battle rules.",
    `- Alive/safe by group: ${display.alive_safe_after}.`,
    `- Visible But No Active Combat After: ${display.visible_but_no_active_combat_after}.`,
    `- No-active-combat after this shot: ${display.no_active_combat_line}.`,
    `- Still active or objective-controlling: ${display.active_or_objective_after}.`,
    `- Limited but not defeated: ${display.limited_after}.`,
    `- Defeated/removed: ${display.defeated_removed_after}.`,
    `- Captured/objective-defeated: ${display.captured_objective_defeated_after}.`,
    `- Stood down/post-battle: ${display.stood_down_post_battle_after}.`,
    `- Must not return active: ${display.must_not_return_active_after}.`,
    `- Changed this shot: ${display.changed_this_shot}.`,
  ].join("\n");
}

function battleLedgerText(pkgShot, metadata) {
  const display = ledgerDisplayFields(pkgShot, metadata);
  return [
    "All named characters alive after this shot: yes.",
    `Alive roster by house: ${display.alive_safe_after}.`,
    `Visible but no active combat after this shot: ${display.visible_but_no_active_combat_after}.`,
    `Still active / controlling objective after this shot: ${display.active_or_objective_after}.`,
    `Limited but not defeated after this shot: ${display.limited_after}.`,
    `Mock-battle defeated / removed / stood down after this shot: ${display.defeated_removed_after}.`,
    `Captured or objective-defeated after this shot: ${display.captured_objective_defeated_after}.`,
    `Stood down or post-battle after this shot: ${display.stood_down_post_battle_after}.`,
    `Must not return as active combatants after this shot: ${display.must_not_return_active_after}.`,
    `Changed this shot: ${display.changed_this_shot}.`,
    "Ledger rule: 学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。",
  ].join("\n");
}

function rejectLinesFor(pkgShot, metadata) {
  const rejectLines = [
    "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or readable silhouette appears.",
    "Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
    "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
    "Reject if the action becomes lethal, bloody, humiliating, or unrelated to the uploaded start/key/end chain.",
    "Reject if any face, academy age, costume, house color, or weapon changes from the input frames and named references.",
    "Reject if any combat character faces the camera while their threat or route is elsewhere.",
    ...(pkgShot.reject_if || metadata.reject_if || []),
  ];
  return unique(rejectLines).map((line) => `- ${line.replace(/^Reject if /i, "Reject if ")}`).join("\n");
}

function continuityLocksFor(pkgShot, metadata) {
  const visible = (pkgShot.visible_named_only || metadata.visible_named_only || []).join(", ") || "none";
  const display = ledgerDisplayFields(pkgShot, metadata);
  const absentTeacherLocks = [];
  if (!(pkgShot.visible_named_only || []).includes("Hanneman")) absentTeacherLocks.push("Hanneman must stay absent/offscreen unless listed as readable in this shot.");
  if (!(pkgShot.visible_named_only || []).includes("Manuela")) absentTeacherLocks.push("Manuela must stay absent/offscreen unless listed as readable in this shot.");
  return unique([
    `Only these readable humans may appear: ${visible}.`,
    "No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.",
    "Preserve faces, costumes, academy age, house colors, training weapons, geography, and screen direction.",
    "Nonlethal mock battle only: no blood, gore, humiliation, or lethal hits.",
    "Hanneman and Manuela are separate faculty examiners; never side by side, sharing one sigil, or allied partners.",
    "No-active-combat after this shot must match the post-shot battle ledger.",
    `Visible But No Active Combat After: ${display.visible_but_no_active_combat_after}.`,
    `Must not return active after this shot: ${display.must_not_return_active_after}.`,
    "Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
    "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
    ...absentTeacherLocks,
  ]).map((line) => `- ${line}`).join("\n");
}

function inputFramesText() {
  return [
    "- Use the uploaded START frame as the first-frame anchor.",
    "- Use the uploaded KEY frame as the peak action/composition reference.",
    "- Use the uploaded END frame as the final cut-out state.",
    "- Animate only the uploaded START -> KEY -> END frame chain; do not rely on previous submissions, local paths, source folders, image filenames, or external reference files.",
  ].join("\n");
}

function canonicalPrompt(pkgShot, metadata, negativePrompt, sourceText, modelText, sourceMode) {
  const title = pkgShot.titleZh || pkgShot.title || pkgShot.shot;
  const visible = (pkgShot.visible_named_only || metadata.visible_named_only || []).join(", ") || "none";
  const motion = normalizeExecutableSection("Motion", sectionByHeadings(modelText, "Motion") || sectionByHeadings(sourceText, "Motion"), pkgShot.shot);
  const camera = normalizeExecutableSection("Camera", sectionByHeadings(modelText, "Camera") || sectionByHeadings(sourceText, "Camera"), pkgShot.shot);
  const performance = normalizeExecutableSection("Performance", sectionByHeadings(modelText, "Performance") || sectionByHeadings(sourceText, "Performance"), pkgShot.shot);
  const audio = audioForShot(pkgShot);
  const sections = [
    `# ${pkgShot.shot} ${sourceMode ? "Production Source Prompt" : "Model-Ready Video Prompt"}`,
    "",
    sourceMode ? "Status:\nmonitor_required" : "",
    `Shot ID:\n${pkgShot.id || `EP02-SC09-SHOT-${pkgShot.shot}-V2-20260721`}`,
    `Title:\n${title}`,
    `Duration:\n${Number(pkgShot.duration_seconds || metadata.duration_seconds || 6)} seconds. Hold the final state for the last 0.5 seconds.`,
    `Input Frames:\n${inputFramesText()}`,
    `Visible readable humans: ${visible}`,
    `Allowed readable humans: ${visible}.`,
    `Visible named-only list: ${visible}.`,
    `Only these readable humans may appear: ${visible}.`,
    `Motion:\n${motion}`,
    `Camera:\n${camera}`,
    `Performance:\n${performance}`,
    `Audio:\n${audio}`,
    `Continuity Locks:\n${continuityLocksFor(pkgShot, metadata)}`,
    `Attrition State After This Shot:\n${attritionStateText(pkgShot, metadata)}`,
    sourceMode ? `Battle Ledger After This Shot:\n${battleLedgerText(pkgShot, metadata)}` : "",
    `Reject If:\n${rejectLinesFor(pkgShot, metadata)}`,
    `Negative Prompt:\n${negativePrompt.trim()}`,
  ].filter(Boolean);
  return `${sections.join("\n\n")}\n`;
}

function ensureNegativePromptContract(file, pkgShot, metadata) {
  const visible = new Set(pkgShot.visible_named_only || []);
  const required = [
    "no extra people",
    "no unnamed students",
    "no spectators",
    "no crowds",
    "no readable silhouettes",
    "no text",
    "no subtitles",
    "no captions",
    "no visible text",
    "no watermark",
    "no camera spin",
    "no screen-direction reversal",
    "no face drift",
    "no costume drift",
    "no weapon drift",
    "no lethal hits",
    "no lethal hit",
    "no gore",
    "no blood",
    "no paired Hanneman and Manuela",
    "no shared teacher platform",
    "no same-lane teacher duo",
  ];
  if (!visible.has("Hanneman")) required.push("no readable Hanneman");
  if (!visible.has("Manuela")) required.push("no readable Manuela");
  if (pkgShot.shot === "Shot034B") {
    required.push(
      "no Hanneman",
      "no Manuela",
      "no teachers visible",
      "no paired teachers",
      "no second teacher",
      "no shared teacher sigil"
    );
  }
  for (const name of noActiveNames(pkgShot, metadata)) {
    if (visible.has(name)) {
      required.push(`no renewed attack by ${name}`, `no active-combat reset for ${name}`);
    } else {
      required.push(`no readable return of ${name}`, `no active return of ${name}`);
    }
  }
  for (const name of capturedNames(pkgShot, metadata)) {
    if (!visible.has(name)) required.push(`no uncaptured return of ${name}`);
  }
  writeText(file, `${unique(required).join(", ")}\n`);
}

function ensureProviderPromptContracts(pkgShot, metadata) {
  const files = packageFiles(pkgShot);
  ensureNegativePromptContract(files.negative_prompt, pkgShot, metadata);
  const negativePrompt = readText(files.negative_prompt).trim();
  const modelText = fs.existsSync(files.model_prompt) ? readText(files.model_prompt) : "";
  const auditText = fs.existsSync(files.audit_prompt) ? readText(files.audit_prompt) : "";
  const sourceFile = sourcePromptPath(metadata);
  const sourceText = sourceFile && fs.existsSync(sourceFile) ? readText(sourceFile) : auditText;
  writeText(files.model_prompt, canonicalPrompt(pkgShot, metadata, negativePrompt, sourceText, modelText, false));
  writeText(files.audit_prompt, canonicalPrompt(pkgShot, metadata, negativePrompt, sourceText, modelText, true));
  if (sourceFile) {
    fs.mkdirSync(path.dirname(sourceFile), { recursive: true });
    writeText(sourceFile, canonicalPrompt(pkgShot, metadata, negativePrompt, sourceText, modelText, true));
  }
  metadata.audio_anchor = audioForShot(pkgShot);
  metadata.dialogue_audio = audioForShot(pkgShot);
  pkgShot.negative_prompt = negativePrompt;
}

function syncPackageFrameFiles(pkgShot) {
  const files = packageFiles(pkgShot);
  for (const [sourceKey, targetFile] of [
    ["start_frame", files.start_frame],
    ["key_frame", files.key_frame],
    ["end_frame", files.end_frame],
  ]) {
    const source = path.join(root, pkgShot[sourceKey] || "");
    if (pkgShot[sourceKey] && fs.existsSync(source)) {
      fs.copyFileSync(source, targetFile);
    }
  }
}

function syncCommon(target, pkgShot, metadata) {
  const state = battleStateFrom(pkgShot, metadata);
  const ledger = battleLedgerFrom(pkgShot, metadata);
  const display = ledgerDisplayFields(pkgShot, metadata);
  target.status = pkgShot.status;
  target.decision = pkgShot.decision;
  target.title = pkgShot.title;
  target.titleZh = pkgShot.titleZh;
  target.visible_named_only = pkgShot.visible_named_only;
  target.start_frame = pkgShot.start_frame;
  target.key_frame = pkgShot.key_frame;
  target.end_frame = pkgShot.end_frame;
  target.source_frames = {
    start_frame: pkgShot.start_frame,
    key_frame: pkgShot.key_frame,
    end_frame: pkgShot.end_frame,
  };
  target.frames = frameSetFrom(pkgShot);
  target.battle_state_after = state;
  target.battle_ledger_after = ledger;
  target.reject_if = pkgShot.reject_if || metadata.reject_if || target.reject_if || [];
  target.primary_check = pkgShot.primary_check || metadata.primary_check || target.primary_check;
  target.negative_prompt = pkgShot.negative_prompt || target.negative_prompt;
  Object.assign(target, display);
}

function syncMetadata(pkgShot, metadata) {
  syncCommon(metadata, pkgShot, metadata);
  metadata.id = pkgShot.id;
  metadata.shot = pkgShot.shot;
  metadata.order = pkgShot.order;
  metadata.duration_seconds = pkgShot.duration_seconds;
  metadata.expected_clip = pkgShot.expected_clip;
}

function syncQueueRow(row, pkgShot) {
  row.order = String(pkgShot.order);
  row.shot = pkgShot.shot;
  row.status = pkgShot.status;
  row.duration_seconds = String(pkgShot.duration_seconds);
  row.shot_dir = pkgShot.package_dir;
  row.audit_prompt = "prompt.md";
  row.model_prompt = "model_prompt.md";
  row.negative_prompt = "negative_prompt.md";
  row.start_frame = "start_frame.png";
  row.key_frame = "key_frame.png";
  row.end_frame = "end_frame.png";
  row.expected_clip = pkgShot.expected_clip;
  row.visible_named_only = (pkgShot.visible_named_only || []).join("; ");
  row.primary_check = pkgShot.primary_check || "";
}

function syncExecution(target, pkgShot, metadata) {
  syncCommon(target, pkgShot, metadata);
  target.start_frame = `${pkgShot.package_dir}/start_frame.png`;
  target.key_frame = `${pkgShot.package_dir}/key_frame.png`;
  target.end_frame = `${pkgShot.package_dir}/end_frame.png`;
  target.source_frames = {
    start_frame: pkgShot.start_frame,
    key_frame: pkgShot.key_frame,
    end_frame: pkgShot.end_frame,
  };
  target.frames = frameSetFrom(pkgShot);
  target.model_prompt = `${pkgShot.package_dir}/model_prompt.md`;
  target.audit_prompt = `${pkgShot.package_dir}/prompt.md`;
  target.negative_prompt = `${pkgShot.package_dir}/negative_prompt.md`;
}

function syncPayload(target, pkgShot, metadata) {
  const files = packageFiles(pkgShot);
  syncCommon(target, pkgShot, metadata);
  target.prompt_text = readText(files.model_prompt).trimEnd();
  target.negative_prompt_text = readText(files.negative_prompt).trimEnd();
  target.prompt_file = `${pkgShot.package_dir}/model_prompt.md`;
  target.audit_prompt_file = `${pkgShot.package_dir}/prompt.md`;
  target.negative_prompt_file = `${pkgShot.package_dir}/negative_prompt.md`;
  target.input_frames = {
    start_frame: `${pkgShot.package_dir}/start_frame.png`,
    key_frame: `${pkgShot.package_dir}/key_frame.png`,
    end_frame: `${pkgShot.package_dir}/end_frame.png`,
  };
  target.absolute_files = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, file]));
  target.file_digests = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, digest(file)]));
}

function main() {
  const packageManifest = readJson(packageManifestPath);
  const productionManifest = readJson(productionManifestPath);
  const frameQueue = readJson(frameQueuePath);
  const executionPlan = readJson(executionPlanPath);
  const submissionQueue = parseCsv(readText(submissionQueuePath));
  const payloadRows = readText(submissionPayloadPath).split("\n").filter(Boolean).map((line) => JSON.parse(line));
  const submissionPayloadManifest = readJson(submissionPayloadManifestPath);

  const productionByShot = indexByShot(productionManifest.shots);
  const queueByShot = indexByShot(frameQueue);
  const executionByShot = indexByShot(executionPlan.work_orders);
  const submissionQueueByShot = indexByShot(submissionQueue.rows);
  const payloadByShot = indexByShot(payloadRows);
  const synced = [];

  for (const pkgShot of packageManifest.shots || []) {
    const metadata = readJson(path.join(packageDir, pkgShot.package_dir, "metadata.json"));
    syncPackageFrameFiles(pkgShot);
    ensureProviderPromptContracts(pkgShot, metadata);
    syncCommon(pkgShot, pkgShot, metadata);
    syncMetadata(pkgShot, metadata);
    writeJson(path.join(packageDir, pkgShot.package_dir, "metadata.json"), metadata);
    for (const target of [productionByShot.get(pkgShot.shot), queueByShot.get(pkgShot.shot)]) {
      if (target) syncCommon(target, pkgShot, metadata);
    }
    const queueRow = submissionQueueByShot.get(pkgShot.shot);
    if (queueRow) syncQueueRow(queueRow, pkgShot);
    const execution = executionByShot.get(pkgShot.shot);
    if (execution) syncExecution(execution, pkgShot, metadata);
    const payload = payloadByShot.get(pkgShot.shot);
    if (payload) syncPayload(payload, pkgShot, metadata);
    synced.push(pkgShot.shot);
  }

  writeJson(productionManifestPath, productionManifest);
  writeJson(packageManifestPath, packageManifest);
  writeJson(frameQueuePath, frameQueue);
  writeJson(executionPlanPath, executionPlan);
  writeCsv(submissionQueuePath, submissionQueue.headers, submissionQueue.rows);
  writeJsonl(submissionPayloadPath, payloadRows);
  submissionPayloadManifest.rows = payloadRows.length;
  submissionPayloadManifest.total_duration_seconds = payloadRows.reduce((sum, row) => sum + Number(row.duration_seconds || 0), 0);
  submissionPayloadManifest.sha256 = crypto.createHash("sha256").update(fs.readFileSync(submissionPayloadPath)).digest("hex");
  writeJson(submissionPayloadManifestPath, submissionPayloadManifest);

  console.log(JSON.stringify({ ok: true, synced: synced.length }, null, 2));
}

main();
