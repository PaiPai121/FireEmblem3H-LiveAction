#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "specials", "kakeya_byleth_lecture");
const deliveryManifestPath = path.join(projectRoot, "production_system", "video_delivery_manifest.json");
const shotListPath = path.join(projectRoot, "shot_list.md");
const reviewsRoot = path.join(projectRoot, "production_system", "reviews");
const reviewJsonPath = path.join(reviewsRoot, "timing_duration_audit_2026-08-02.json");
const reviewMdPath = path.join(reviewsRoot, "timing_duration_audit_2026-08-02.md");

const recommendedDurations = {
  SH001: 8,
  SH002: 10,
  SH003: 6,
  SH004: 7,
  SH005: 8,
  SH006: 8,
  SH007: 11,
  SH008: 10,
  SH009: 11,
  SH010: 9,
  SH011: 9,
  SH012: 7,
  SH013: 12,
  SH014: 11,
  SH015: 10,
  SH016: 8,
  SH017: 8,
  SH018: 8,
  SH019: 8,
  SH020: 10,
  SH021: 8,
  SH022: 12,
  SH023: 12,
  SH024: 7,
  SH025: 8,
  SH026: 8,
  SH027: 11,
  SH028: 11,
  SH029: 7,
  SH030: 8,
  SH031: 10,
  SH032: 8,
  SH033: 8,
  SH034: 6,
};

const rationaleById = {
  SH001: "开场登场和落剑需要完整动作，但 8 秒足够。",
  SH002: "提出原始问题，三学生反应，保留 10 秒。",
  SH003: "单句圆盘直觉，不应给 12 秒。",
  SH004: "规则澄清，一次划掉固定中心，7 秒足够。",
  SH005: "方向扇出现，需要读图停留，8 秒。",
  SH006: "候选图形揭示，8 秒。",
  SH007: "三尖内摆线切线弦机制较复杂，给 11 秒。",
  SH008: "4a=1 尺度锁需要读公式，10 秒。",
  SH009: "候选面积 pi/8 需要先后显式，11 秒。",
  SH010: "艾黛尔质疑是完整表演 beat，9 秒。",
  SH011: "先看凸特例的动机要讲清，但不拖长，9 秒。",
  SH012: "凸性定义是短图解，7 秒。",
  SH013: "三角形能转是核心补证明，保留 12 秒。",
  SH014: "支撑边/下界定理和公式，11 秒。",
  SH015: "凸补空隙到非凸碎片的桥，10 秒。",
  SH016: "佩龙树方向账本引入，8 秒。",
  SH017: "切分步骤，8 秒。",
  SH018: "平移步骤，8 秒。",
  SH019: "重叠步骤，8 秒。",
  SH020: "学生质疑加回答，10 秒。",
  SH021: "方向审计短图解，8 秒。",
  SH022: "迭代加速是核心动态证明，12 秒。",
  SH023: "任意 epsilon 与连接走廊结论，12 秒。",
  SH024: "零面积澄清短图解，7 秒。",
  SH025: "δ 管引入，8 秒。",
  SH026: "α 夹角两种情况，8 秒。",
  SH027: "重叠估计推导，11 秒。",
  SH028: "网格计数/维数直觉，11 秒。",
  SH029: "二维定理短陈述，7 秒。",
  SH030: "影响引入，8 秒。",
  SH031: "最大平均/波包/细管三概念，10 秒。",
  SH032: "最后揭示名称与学生反应，8 秒。",
  SH033: "回到木剑收束，8 秒，避免最后一句旁白过紧。",
  SH034: "结尾卡保留 6 秒，给标题和最终命题稳定读完。",
};

const sequenceGroups = [
  { id: "S1", label: "Hook: unit sword puzzle", start: 1, end: 5 },
  { id: "S2", label: "Deltoid candidate", start: 6, end: 10 },
  { id: "S3", label: "Convex restriction and triangle optimum", start: 11, end: 15 },
  { id: "S4", label: "Besicovitch/Perron reversal", start: 16, end: 23 },
  { id: "S5", label: "Delta-tubes and dimension", start: 24, end: 29 },
  { id: "S6", label: "Mathematical impact tied to proof", start: 30, end: 31 },
  { id: "S7", label: "Reveal and closing image", start: 32, end: 34 },
];

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function writeJson(filePath, data) {
  writeText(filePath, JSON.stringify(data, null, 2));
}

function shotId(number) {
  return `SH${String(number).padStart(3, "0")}`;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function parseShotList(markdown) {
  const rows = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith("| SH")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length >= 9) {
      rows.set(cells[0], {
        id: cells[0],
        time: cells[1],
        beat: cells[2],
        purpose: cells[3],
        subject: cells[4],
        camera: cells[5],
        blocking: cells[6],
        audio: cells[7],
        risks: cells[8],
      });
    }
  }
  return rows;
}

function estimateSpeechSeconds(audio) {
  const text = String(audio || "")
    .replace(/`[^`]*`/g, "")
    .replace(/[A-Za-z0-9_./:=~<>|{}[\]()-]/g, "")
    .replace(/[“”"：:]/g, "");
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const punctuationPauses = (text.match(/[，。；？！、]/g) || []).length * 0.18;
  const speakerSwitches = Math.max(0, (String(audio || "").match(/女贝老师|艾黛尔|莉丝缇亚|梅尔赛德斯|旁白|VO/g) || []).length - 1) * 0.45;
  return Number((chineseChars / 4.1 + punctuationPauses + speakerSwitches).toFixed(2));
}

function visualMinimumSeconds(id, row) {
  const n = Number(id.slice(2));
  let base = 4.5;
  if (/(证明|机制|估计|迭代|连续|方向|维数|公式|三角形|Perron|delta|alpha|δ|α|面积)/i.test(`${row.purpose} ${row.blocking} ${row.audio}`)) base += 1.5;
  if ([7, 8, 9, 13, 14, 15, 22, 23, 27, 28, 31].includes(n)) base += 1.5;
  if ([3, 12, 24, 29, 34].includes(n)) base -= 1;
  return Math.max(4, Number(base.toFixed(1)));
}

function updateShotList(markdown) {
  let running = 0;
  const timeByShot = new Map();
  for (let i = 1; i <= 34; i += 1) {
    const id = shotId(i);
    const start = running;
    running += recommendedDurations[id];
    timeByShot.set(id, `${formatTime(start)}-${formatTime(running)}`);
  }

  const sequenceTimes = new Map();
  let cumulative = 0;
  const startByShot = new Map();
  for (let i = 1; i <= 34; i += 1) {
    startByShot.set(shotId(i), cumulative);
    cumulative += recommendedDurations[shotId(i)];
  }
  for (const seq of sequenceGroups) {
    const start = startByShot.get(shotId(seq.start));
    let end = start;
    for (let i = seq.start; i <= seq.end; i += 1) end += recommendedDurations[shotId(i)];
    sequenceTimes.set(seq.id, `${formatTime(start)}-${formatTime(end)}`);
  }

  return markdown
    .replace(/Target Runtime: .+/, `Target Runtime: ${formatTime(0)}-${formatTime(running)} (${running} seconds)`)
    .split(/\r?\n/)
    .map((line) => {
      const seqMatch = line.match(/^\| (S\d) \| [^|]+ \| (.+) \|$/);
      if (seqMatch && sequenceTimes.has(seqMatch[1])) {
        return `| ${seqMatch[1]} | ${sequenceTimes.get(seqMatch[1])} | ${seqMatch[2].trim()} |`;
      }
      if (!line.startsWith("| SH")) return line;
      const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
      if (!timeByShot.has(cells[0])) return line;
      cells[1] = timeByShot.get(cells[0]);
      return `| ${cells.join(" | ")} |`;
    })
    .join("\n");
}

function updateFrameSpecDuration(id, seconds) {
  const filePath = path.join(projectRoot, "storyboards", id, "frame_spec.md");
  if (!fs.existsSync(filePath)) return false;
  const original = readText(filePath);
  const updated = original.replace(/^Duration Target:\s*.+$/m, `Duration Target: ${seconds} seconds`);
  if (updated !== original) writeText(filePath, updated);
  return updated !== original;
}

const deliveryManifest = readJson(deliveryManifestPath);
const shotRows = parseShotList(readText(shotListPath));
const auditRows = [];
let oldTotal = 0;
let newTotal = 0;
let changedCount = 0;
let longTailCount = 0;
let tooTightCount = 0;

for (const shot of deliveryManifest.shots || []) {
  const id = shot.id;
  const current = Number(shot.timing_review?.previous_duration_seconds || shot.duration_seconds || 0);
  const recommended = recommendedDurations[id];
  const row = shotRows.get(id) || {};
  const speech = estimateSpeechSeconds(row.audio);
  const visualMin = visualMinimumSeconds(id, row);
  const slack = Number((recommended - Math.max(speech, visualMin)).toFixed(2));
  const oldSlack = Number((current - Math.max(speech, visualMin)).toFixed(2));
  const flags = [];
  if (current > recommended + 2) flags.push("原时长尾巴过长");
  if (current > 12) flags.push("原时长超过 12 秒，增加一次性生成漂移风险");
  if (recommended > 12) flags.push("建议时长仍超过 12 秒");
  if (slack < 0.8) flags.push("建议时长偏紧，需生成后重点监看");
  if (oldSlack > 6) longTailCount += 1;
  if (slack < 0.8) tooTightCount += 1;
  if (current !== recommended) changedCount += 1;
  oldTotal += current;
  newTotal += recommended;
  shot.duration_seconds = recommended;
  shot.timing_review = {
    status: flags.length ? "retimed_monitor_required" : "retimed_reasonable",
    previous_duration_seconds: current,
    recommended_duration_seconds: recommended,
    estimated_speech_seconds: speech,
    visual_minimum_seconds: visualMin,
    previous_slack_seconds: oldSlack,
    revised_slack_seconds: slack,
    rationale: rationaleById[id],
    flags,
  };
  updateFrameSpecDuration(id, recommended);
  auditRows.push({
    id,
    previous_duration_seconds: current,
    recommended_duration_seconds: recommended,
    estimated_speech_seconds: speech,
    visual_minimum_seconds: visualMin,
    previous_slack_seconds: oldSlack,
    revised_slack_seconds: slack,
    flags,
    rationale: rationaleById[id],
    audio: row.audio || "",
  });
}

deliveryManifest.total_duration_seconds = newTotal;
deliveryManifest.target_runtime = `${formatTime(0)}-${formatTime(newTotal)}`;
deliveryManifest.timing_policy = {
  status: "retimed_2026-08-02",
  reason: "Original per-shot durations contained many 14-20 second slots for one-line or simple diagram beats. Revised policy keeps most shots in 7-10 seconds, allows 11-12 seconds only for proof-heavy beats, and avoids long tail-holds for one-pass video generation.",
  max_duration_seconds: Math.max(...Object.values(recommendedDurations)),
  old_total_duration_seconds: oldTotal,
  new_total_duration_seconds: newTotal,
  changed_shots: changedCount,
};

writeJson(deliveryManifestPath, deliveryManifest);
writeText(shotListPath, updateShotList(readText(shotListPath)));

const audit = {
  status: "retimed_monitor_required",
  created_at: "2026-08-02",
  reviewer_role: "video-prompt-timing-qa",
  old_total_duration_seconds: oldTotal,
  new_total_duration_seconds: newTotal,
  changed_shots: changedCount,
  long_tail_count_before: longTailCount,
  too_tight_count_after: tooTightCount,
  policy: deliveryManifest.timing_policy,
  shots: auditRows,
};
writeJson(reviewJsonPath, audit);

const mdRows = auditRows.map((row) => `| ${row.id} | ${row.previous_duration_seconds}s | ${row.recommended_duration_seconds}s | ${row.estimated_speech_seconds}s | ${row.visual_minimum_seconds}s | ${row.revised_slack_seconds}s | ${row.flags.join("；") || "合理"} | ${row.rationale} |`).join("\n");
writeText(reviewMdPath, `# 二维挂谷视频提示词时长审查

Status: \`retimed_monitor_required\`
Date: 2026-08-02

## 结论

原始总时长：${oldTotal} 秒。修订后总时长：${newTotal} 秒（${formatTime(newTotal)}）。

本次发现的问题不是“少数镜头偏长”，而是全包时长策略不干净：很多一句话或简单图解镜头给到 14-20 秒，会让一次性视频生成出现尾部硬停、身份漂移、公式闪烁和无意义镜头运动。

修订策略：

- 普通讲解/互动镜头：7-10 秒。
- 核心证明镜头：11-12 秒。
- 简短概念句、定理句、结尾卡：5-7 秒。
- 全片不再保留 13-20 秒长尾镜头。

## 逐镜头审查

| 镜头 | 原时长 | 新时长 | 估计台词 | 视觉最低 | 新余量 | 标记 | 理由 |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
${mdRows}
`);

console.log(JSON.stringify({
  status: audit.status,
  old_total_duration_seconds: oldTotal,
  new_total_duration_seconds: newTotal,
  changed_shots: changedCount,
  long_tail_count_before: longTailCount,
  too_tight_count_after: tooTightCount,
  review_json: reviewJsonPath,
  review_md: reviewMdPath,
}, null, 2));
