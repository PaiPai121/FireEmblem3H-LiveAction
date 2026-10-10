const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "specials", "kakeya_byleth_lecture");
const frameManifestPath = path.join(projectRoot, "frame_generation_manifest.json");
const deliveryManifestPath = path.join(projectRoot, "production_system", "video_delivery_manifest.json");
const shotListPath = path.join(projectRoot, "shot_list.md");
const frameProgressionAuditPath = path.join(projectRoot, "production_system", "reviews", "frame_progression_audit_2026-08-01.json");
const outRoot = path.join(projectRoot, "delivery", "real_frame_preview_kakeya_byleth_2026-07-28");
const outShotsRoot = path.join(outRoot, "shots");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyIfExists(source, target) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing source frame: ${source}`);
  }
  fs.copyFileSync(source, target);
}

function escHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseShotList(markdown) {
  const shots = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith("| SH")) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (cells.length < 8) continue;
    const [id, time, beat, purpose, subject, camera, blocking, audio, risks] = cells;
    shots.set(id, { id, time, beat, purpose, subject, camera, blocking, audio, risks });
  }
  return shots;
}

function parseRejectIf(frameSpecText) {
  const lines = frameSpecText.split(/\r?\n/);
  const start = lines.findIndex((line) => /^Reject If:\s*$/.test(line.trim()));
  if (start === -1) return [];
  const rejects = [];
  for (const line of lines.slice(start + 1)) {
    if (!line.trim()) break;
    const match = line.match(/^\s*-\s+(.+)$/);
    if (!match) break;
    rejects.push(match[1].trim());
  }
  return rejects;
}

function lineValue(text, label) {
  const match = text.match(new RegExp(`^${label}:\\s*(.+)$`, "im"));
  return match ? match[1].trim() : "";
}

function sectionText(text, label) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${label}:`);
  if (start === -1) return "";
  const out = [];
  for (const line of lines.slice(start + 1)) {
    const trimmed = line.trim();
    if (/^[A-Z][A-Za-z /]+:\s*$/.test(trimmed)) break;
    if (/^[A-Z][A-Za-z /]+:\s+/.test(trimmed)) break;
    out.push(line);
  }
  return out.join("\n").trim();
}

function bulletItems(text, label) {
  return sectionText(text, label)
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*-\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean);
}

function paragraph(text, label) {
  return lineValue(text, label) || sectionText(text, label).replace(/\s+/g, " ").trim();
}

function allShotIds() {
  return Array.from({ length: 34 }, (_, index) => `SH${String(index + 1).padStart(3, "0")}`);
}

function compactRanges(ids) {
  const numbers = ids.map((id) => Number(id.slice(2))).sort((a, b) => a - b);
  const ranges = [];
  let start = null;
  let prev = null;
  for (const number of numbers) {
    if (start === null) {
      start = number;
      prev = number;
      continue;
    }
    if (number === prev + 1) {
      prev = number;
      continue;
    }
    ranges.push([start, prev]);
    start = number;
    prev = number;
  }
  if (start !== null) ranges.push([start, prev]);
  return ranges
    .map(([a, b]) => (a === b ? `SH${String(a).padStart(3, "0")}` : `SH${String(a).padStart(3, "0")}-SH${String(b).padStart(3, "0")}`))
    .join(", ");
}

function shotFolderName(order, id) {
  return `${String(order).padStart(3, "0")}_${id}`;
}

function hasAllFrames(entry) {
  return Boolean(entry.real_start_frame && entry.real_key_frame && entry.real_end_frame);
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, text, "utf8");
}

function readableTextMirrorName(fileName) {
  return fileName.replace(/\.(md|json)$/i, ".html");
}

function writeReadableTextMirror(sourcePath, title, kind, usageNote) {
  const raw = fs.readFileSync(sourcePath, "utf8");
  const targetPath = path.join(path.dirname(sourcePath), readableTextMirrorName(path.basename(sourcePath)));
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escHtml(title)}</title>
  <style>
    body{margin:0;background:#f6f8fb;color:#1f2733;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    main{max-width:980px;margin:0 auto;padding:28px 22px 48px}
    h1{margin:0 0 8px;font-size:24px;letter-spacing:0}
    .meta{margin:0 0 18px;color:#596779;line-height:1.6;font-weight:700}
    .note{border:1px solid #d6dfeb;border-left:4px solid #174ea6;background:#fff;border-radius:8px;padding:12px 14px;margin:0 0 18px;line-height:1.65}
    pre{white-space:pre-wrap;word-break:break-word;background:#fff;border:1px solid #d6dfeb;border-radius:8px;padding:18px;line-height:1.7;font-size:14px;font-family:"SFMono-Regular",Consolas,"Liberation Mono",monospace}
    a{color:#174ea6;font-weight:800;text-decoration:none}
  </style>
</head>
<body>
  <main>
    <h1>${escHtml(title)}</h1>
    <div class="meta">类型：${escHtml(kind)} · 编码：UTF-8 · 原始文件：<a href="${escHtml(path.basename(sourcePath))}">${escHtml(path.basename(sourcePath))}</a></div>
    <div class="note">${escHtml(usageNote)}</div>
    <pre>${escHtml(raw)}</pre>
  </main>
</body>
</html>
`;
  fs.writeFileSync(targetPath, html, "utf8");
  return targetPath;
}

function relativeToProject(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

function firstExisting(candidates) {
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function assetVersion(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").slice(0, 12);
}

const beatZh = {
  "Sword flourish hook": "剑花引题",
  "Question lands on students": "学生接住问题",
  "Training object introduced": "训练物体登场",
  "Naive circular intuition": "圆盘直觉",
  "Rule refinement": "规则澄清",
  "Direction coverage": "方向覆盖",
  "Deltoid reveal": "三尖内摆线候选",
  "Tangent chord mechanism": "切线弦机制",
  "Scale lock": "尺度锁定",
  "Area of deltoid": "候选面积",
  "Candidate doubt": "候选受到质疑",
  "Constraint switch": "切换到凸区域",
  "Convex definition": "凸性定义",
  "Triangle optimum": "凸情形最优三角形",
  "Area computation": "三角形面积计算",
  "Why convex is expensive": "为什么凸性昂贵",
  "Perron setup": "佩龙树准备",
  "Cut step": "切分步骤",
  "Slide step": "平移步骤",
  "Overlap step": "重叠步骤",
  "Student objection": "学生质疑",
  "Direction audit": "方向审计",
  "Iteration acceleration": "迭代加速",
  "Classical conclusion": "经典结论",
  "Zero area caution": "零面积澄清",
  "Delta-tube method": "δ 管方法",
  "Tube overlap by angle": "角度与重叠",
  "Key estimate": "关键估计",
  "Dimension idea": "维数直觉",
  "2D theorem": "二维定理",
  "Mathematical impact": "数学影响",
  "Max function and wave packets": "最大函数与波包",
  "Name reveal": "名称揭示",
  "Final image": "回到木剑",
  "End card": "结尾卡",
};

const statusZh = {
  blocked_needs_identity_regeneration: "阻塞：角色身份需重生",
  pilot_frames_complete_review_required: "真实帧已完成，仍需审查",
  real_frames_complete_monitor_required: "真实帧已完成，待运动监看",
  pilot_full_shot_generated_review_required: "三帧已生成，待审查",
  monitor_required: "可进入监看测试，未批准出片",
  real_frame_prompt_ready_motion_qa_required: "提示词已就绪，待运动 QA",
  needs_visual_qa: "待视觉审查",
  needs_math_visual_qa: "待数学视觉审查",
  math_visual_qa_spot_pass_monitor_required: "数学视觉抽查通过，仍需监看",
};

const primaryCheckZh = {
  SH001: "检查女贝老师站立持木剑开场，剑花一百八十度掉头动作清楚；不得回到地面标线或红端点。",
  SH002: "检查三位学生接住 SH001 的问题，梅尔赛德斯的圆盘直觉能自然引到 SH003。",
  SH003: "检查圆盘只作为错误直觉，不要被误认为最终答案。",
  SH004: "检查固定中心被划掉、中心可移动的规则清楚。",
  SH005: "检查每个方向都有完整一单位线段，方向扇不要拥挤。",
  SH006: "检查三尖内摆线是候选区域，莉丝缇亚提问不干扰图形。",
  SH007: "检查红色切线弦始终在三尖内摆线区域内。",
  SH008: "检查 4a=1 与 a=1/4 尺度关系清楚。",
  SH009: "检查 A=pi/8 是候选面积，不说成最终最小。",
  SH010: "检查艾黛尔可见发问，女贝老师停顿，三尖候选板书仍可读。",
  SH011: "检查凹陷区域被拉成凸边界的概念清楚。",
  SH012: "检查两点连线是否离开区域的凸性测试清楚。",
  SH013: "检查高为 1 的等边三角形只属于凸区域最优。",
  SH014: "检查 s=2/sqrt(3) 与 A=1/sqrt(3) 公式间距。",
  SH015: "检查左侧凸包补满空隙、右侧非凸碎片保留空隙。",
  SH016: "检查佩龙树初始三角形和方向扇可读。",
  SH017: "检查切分后方向区间没有被删掉。",
  SH018: "检查碎片只平移不旋转。",
  SH019: "检查重叠缩小面积，同时方向没有丢。",
  SH020: "检查三位学生围沙盘互动；木尺指向绿色方向带而不是原位置。",
  SH021: "检查方向区间前后仍被完整覆盖。",
  SH022: "检查切分、平移、重叠的迭代顺序不要过快。",
  SH023: "检查结论是没有最小正面积，不是三尖内摆线获胜。",
  SH024: "检查面积为零不是集合不存在。",
  SH025: "检查 δ 管宽度清楚。",
  SH026: "检查角度 α 与重叠长度的关系清楚。",
  SH027: "检查 overlap <= C delta^2 / alpha 与图中金色重叠区对应。",
  SH028: "检查面积可消失但尺度复杂度仍高的直觉清楚。",
  SH029: "检查二维结论“面积可为 0，维数为 2”不被过度解释。",
  SH030: "检查影响部分仍围绕细管重叠、平均、波包，不变成生活比喻。",
  SH031: "检查最大平均、波包、细管重叠三组概念可读。",
  SH032: "检查中文标题“挂谷针问题”可读，三位学生有反应，不能出现英文标题。",
  SH033: "检查结尾回到木剑和多方向结构，蓝色零面积影子不可消失。",
  SH034: "检查结尾命题清楚：面积可以小到消失，方向复杂度不会消失。",
};

const storyPurposeZh = {
  SH001: "开场：女贝老师先用舒展的木剑剑花演示一百八十度掉头，让观众先感到“扫过区域”的问题。",
  SH002: "三位学生接住问题，梅尔赛德斯说出圆盘直觉，为 SH003 的固定中心错误直觉铺路。",
  SH003: "让观众先说出最自然但不够好的圆盘直觉。",
  SH004: "澄清规则：针的中心不必固定，问题比原地旋转更自由。",
  SH005: "把口语问题翻译成数学条件：每个方向都要有一条完整单位线段。",
  SH006: "引出漂亮候选：三尖内摆线，但只说候选，不说最终答案。",
  SH007: "解释为什么三尖内摆线能让单位针转过所有方向。",
  SH008: "锁定尺度：把候选图形和长度为 1 的针对齐。",
  SH009: "给出候选面积，让观众记住 pi/8 这个看似很小的数。",
  SH010: "艾黛尔提出数学质疑：还没证明三尖内摆线不能再小，并指出非凸空隙可能被重复利用。",
  SH011: "把凸区域作为规整特例：先处理容易记账的版本，再回到一般非凸情况。",
  SH012: "用两点连线说明什么叫凸，降低理解门槛。",
  SH013: "先证明高为 1 的等边三角形确实能覆盖所有方向，而不是只报面积。",
  SH014: "说明三角形支撑边如何给出至少一单位长的截线，面积计算退到辅助位置。",
  SH015: "由“凸性会填满空隙”自然引出非凸碎片，并提出必须检查方向是否仍在。",
  SH016: "把 Perron 树作为非凸碎片的方向账本引入：一个三角形先保存一段连续方向。",
  SH017: "第一步切分：把方向任务分给更细的小三角形。",
  SH018: "第二步平移：位置改变，但方向不变。",
  SH019: "第三步重叠：面积变小，但方向覆盖仍在。",
  SH020: "学生替观众追问“这算不算作弊”，女贝老师回答：看方向，不看原位置。",
  SH021: "做方向审计，确认切分和平移没有丢方向。",
  SH022: "展示迭代：重复切分、平移、重叠，面积可以任意小。",
  SH023: "给出经典结论：原问题没有最小正面积答案。",
  SH024: "防误解：面积为零不是不存在。",
  SH025: "引入 δ 管：把线段加粗，方便估计和比较。",
  SH026: "说明两根细管的重叠和夹角有关。",
  SH027: "把图像关系压成一个估计式，连接几何和分析。",
  SH028: "解释面积可以消失，但尺度复杂度没有消失。",
  SH029: "陈述二维现代结论：面积可为 0，维数仍为 2。",
  SH030: "把影响收束到证明机制：多方向细管如何重叠。",
  SH031: "把细管重叠连接到最大函数和波包等具体数学对象。",
  SH032: "最后才揭示名字：挂谷针问题，让观众先理解再记名。",
  SH033: "回到开头木剑，把抽象证明和最初物体连回一起。",
  SH034: "结尾命题：面积可以小到消失，方向复杂度不会消失。",
};

const dialogueAnchorZh = {
  SH001: [
    ["音效", "木制训练剑划过空气，收势轻停。"],
    ["女贝老师", "今天我们不练普通挥剑。我们考虑一个新问题：让这把剑转个一百八十度掉头，它扫过的区域能小到什么程度？"],
  ],
  SH002: [
    ["梅尔赛德斯", "扫过的地方，至少像一个圆吧？"],
  ],
  SH003: [
    ["梅尔赛德斯", "至少要给它一个圆吧？"],
    ["女贝老师", "如果中心固定，是圆。"],
  ],
  SH004: [
    ["女贝老师", "但中心不必固定。只要整根剑始终在区域内。"],
  ],
  SH005: [
    ["女贝老师", "换句话说，每个方向，都要能放下一条完整的一单位线段。"],
  ],
  SH006: [
    ["莉丝缇亚", "那就让边界刚好卡住每个方向？"],
    ["女贝老师", "一个漂亮的候选，是三尖内摆线。"],
  ],
  SH007: [
    ["旁白 / 女贝老师", "沿着曲线取切线，切线截出的弦可以当作这把剑。"],
    ["女贝老师", "切点沿曲线走一圈，切线方向也连续转过一圈。方向不会漏。"],
  ],
  SH008: [
    ["女贝老师", "这里的 a 是生成三尖内摆线的尺度。每条可用切线弦正好分成四段 a。"],
    ["女贝老师", "所以弦长是四 a。剑长要等于一，就取 a 等于四分之一。"],
  ],
  SH009: [
    ["旁白 / 女贝老师", "面积用参数曲线的面积公式算：A 等于二 pi a 平方。"],
    ["女贝老师", "代入 a 等于四分之一，得到 pi 除以八。它还只是候选。"],
  ],
  SH010: [
    ["艾黛尔", "优雅，不等于最小。我还没听到：为什么不能再小？"],
    ["艾黛尔", "如果边界允许凹进去，空隙也许还能被重复利用。"],
  ],
  SH011: [
    ["女贝老师", "很好。一般情况太滑，我们先看一个比较规整的特例。"],
    ["女贝老师", "加一条规则：区域不能凹进去。"],
  ],
  SH012: [
    ["旁白 / 女贝老师", "凸，就是图形中任意两点之间的线段，都不离开图形。"],
  ],
  SH013: [
    ["女贝老师", "在凸区域里，最省的是高为一的等边三角形。"],
    ["旁白 / 女贝老师", "先证明它真的能转。方向只看零到一百八十度就够了。"],
    ["女贝老师", "红剑在三组支撑边之间连续滑动。"],
  ],
  SH014: [
    ["女贝老师", "高是一，边长是二除以根号三，面积是一除以根号三。"],
    ["旁白 / 女贝老师", "最危险的位置，是它刚好沿着一条高；这时长度正好是一。其余方向能截到更长线段。"],
    ["女贝老师", "凸世界的下界是定理：任何凸区域都不能比它更省。"],
  ],
  SH015: [
    ["女贝老师", "凸性会自动把空隙补满。所以在凸世界里，面积不能随便省。"],
    ["莉丝缇亚", "那如果去掉凸性，让区域碎开呢？"],
    ["女贝老师", "这正是反转的入口。但碎开之后，必须记账：每个方向还在不在。"],
  ],
  SH016: [
    ["女贝老师", "这个方向账本，从一个三角形开始。"],
    ["旁白 / 女贝老师", "从顶点到底边，每一条线都代表一个方向。"],
  ],
  SH017: [
    ["女贝老师", "第一步，切分。每块只负责一小段方向。"],
    ["音效", "粉笔或沙面被切开的声音。"],
  ],
  SH018: [
    ["女贝老师", "第二步，平移。平移不会改变方向。"],
    ["音效", "细碎三角片滑动。"],
  ],
  SH019: [
    ["女贝老师", "第三步，重叠。面积减少，方向没有丢。"],
  ],
  SH020: [
    ["艾黛尔", "但这样还是同一个问题吗？"],
    ["女贝老师", "看方向，不看原来的位置。切分没有删方向。平移没有转方向。"],
    ["旁白 / 女贝老师", "真正连续转动时，再用很窄的连接走廊把动作接起来；走廊面积也能做得任意小。"],
  ],
  SH021: [
    ["女贝老师", "看方向，不看原来的位置。切分没有删方向。平移没有转方向。"],
  ],
  SH022: [
    ["旁白 / 女贝老师", "重复切分、平移、重叠。方向尺没有缺口，金色并集面积却按我们指定的比例下降。"],
    ["女贝老师", "给定任何 epsilon，只要多迭代几轮，面积就能压到 epsilon 以下。"],
  ],
  SH023: [
    ["女贝老师", "所以原来的最小面积问题，没有最小正答案。"],
    ["女贝老师", "小到任意正数以下，不是等于不存在。"],
  ],
  SH024: [
    ["女贝老师", "但面积为零，不等于不存在。线段也没有平面面积。"],
  ],
  SH025: [
    ["旁白 / 女贝老师", "要研究这种集合，数学家常把线段加粗一点，变成宽度为 delta 的细管。"],
  ],
  SH026: [
    ["女贝老师", "两根管的夹角叫 alpha。夹角越小，重叠越长；夹角越大，重叠越短。"],
  ],
  SH027: [
    ["女贝老师", "沿管方向的交叠长度约是 delta 除以 sin alpha，宽度是 delta。"],
    ["旁白 / 女贝老师", "所以面积约是 delta 平方除以 sin alpha；小角度时 sin alpha 和 alpha 同量级。"],
  ],
  SH028: [
    ["旁白 / 女贝老师", "维数先看网格变细时，需要多少小格子才能盖住它。普通曲线大约需要一除以 delta 个。"],
    ["女贝老师", "这种多方向集合不能像曲线那样省格子；二维的答案是，它仍然有二维复杂度。"],
  ],
  SH029: [
    ["女贝老师", "它可以没有面积，但维数必须是二。"],
  ],
  SH030: [
    ["女贝老师", "后来真正留下来的，不是这把剑。"],
    ["女贝老师", "而是一个模型：许多方向的细长结构，能怎样重叠？"],
  ],
  SH031: [
    ["旁白 / 女贝老师", "这进入几何测度论，帮助人们区分面积和维数。"],
    ["旁白 / 女贝老师", "也进入调和分析。沿许多方向取平均时，细管的重叠会制造困难。"],
    ["旁白 / 女贝老师", "在波动问题里，一个波可以拆成许多沿不同方向传播的波包。波包也像细管。"],
  ],
  SH032: [
    ["女贝老师", "所以问题不是针。问题是方向。"],
    ["女贝老师", "这个问题，叫挂谷针问题。"],
  ],
  SH033: [
    ["旁白 / 女贝老师", "面积可以小到消失。方向的复杂度，不会消失。"],
  ],
  SH034: [
    ["结尾卡", "挂谷针问题"],
    ["结尾卡", "多方向结构能怎样重叠？"],
  ],
};

function zh(value, table) {
  return table[value] || value || "";
}

function renderDialogue(lines) {
  if (!lines || !lines.length) return "";
  return `<div class="dialogue" aria-label="中文台词和旁白">
        <strong>中文台词 / 旁白锚点</strong>
        ${lines.map(([speaker, line]) => `<p><b>${escHtml(speaker)}：</b>${escHtml(line)}</p>`).join("")}
      </div>`;
}

function visibleZh(value) {
  return String(value || "")
    .replace(/BylethFemale/g, "女贝老师")
    .replace(/Female Byleth hand only/g, "女贝老师只露手")
    .replace(/Female Byleth hand and profile/g, "女贝老师的手与侧脸")
    .replace(/Female Byleth hands only/g, "女贝老师只露双手")
    .replace(/Female Byleth as small side silhouette/g, "女贝老师作为小侧影")
    .replace(/Female Byleth optional side profile/g, "女贝老师可选侧脸")
    .replace(/Female Byleth pointer hand optional/g, "女贝老师可选指示手")
    .replace(/Female Byleth/g, "女贝老师")
    .replace(/wooden practice sword/g, "木制训练剑")
    .replace(/No full character; diagram only/g, "无完整角色，仅图解")
    .replace(/No full character/g, "无完整角色")
    .replace(/No character/g, "无角色")
    .replace(/Diagram dominant/g, "图解为主")
    .replace(/diagram dominant/g, "图解为主")
    .replace(/hand optional/g, "手部可选")
    .replace(/pointer optional/g, "指示手可选")
    .replace(/optional student shoulder silhouettes/g, "可选学生肩部剪影")
    .replace(/optional shoulder silhouettes/g, "可选肩部剪影")
    .replace(/No named character/g, "无指定角色")
    .replace(/Diagram only/g, "仅图解")
    .replace(/optional/g, "可选")
    .replace(/Edelgard/g, "艾黛尔")
    .replace(/Lysithea/g, "莉丝缇亚")
    .replace(/Mercedes/g, "梅尔赛德斯")
    .replace(/Byleth/g, "贝老师");
}

function translateProductionText(value) {
  const text = String(value || "").trim();
  if (beatZh[text]) return beatZh[text];
  const direct = new Map([
    ["KAK-BYLETH-SHOTLIST", "女贝老师二维挂谷分镜表"],
    ["real_frame_locked_video_prompt_package", "真实帧锁定视频提示词包"],
    ["real_frames_generated_prompt_ready", "真实帧已生成，提示词已就绪"],
    ["pilot_frames_complete_review_required", "真实帧已完成，仍需审查"],
    ["real_frames_complete_monitor_required", "真实帧已完成，待运动监看"],
    ["needs_visual_qa", "待视觉审查"],
    ["needs_math_visual_qa", "待数学视觉审查"],
    ["real_frame_prompt_ready_motion_qa_required", "真实帧提示词已就绪，待运动 QA"],
    ["monitor_required", "需要监看测试"],
    ["Training object introduced", "训练物体登场"],
    ["Naive circular intuition", "圆盘直觉"],
    ["Rule refinement", "规则澄清"],
    ["Direction coverage", "方向覆盖"],
    ["Garreg Mach training ground stone floor", "加尔古·玛库训练场石地"],
    ["Garreg Mach training ground edge", "加尔古·玛库训练场边缘"],
    ["Garreg Mach classroom chalkboard", "加尔古·玛库教室黑板"],
    ["Garreg Mach classroom", "加尔古·玛库教室"],
    ["Stone floor diagram overlay", "石地上的图解叠层"],
    ["Clean chalk/parchment diagram space", "干净的粉笔/羊皮纸图解空间"],
    ["Chalkboard/parchment hybrid", "黑板与羊皮纸混合图解"],
    ["Parchment insert", "羊皮纸插入画面"],
    ["Classroom diagram board", "教室图解板"],
    ["Classroom", "教室"],
    ["Classroom chalkboard", "教室黑板"],
    ["Clean diagram board", "干净图解板"],
    ["Training ground sand table", "训练场沙盘"],
    ["Classroom sand table", "教室沙盘"],
    ["Clean diagram space", "干净图解空间"],
    ["Diagram space", "图解空间"],
    ["Diagram board", "图解板"],
    ["Sand-table diagram", "沙盘图解"],
    ["Training ground floor", "训练场地面"],
    ["Abstract chalk grid", "抽象粉笔网格"],
    ["Parchment title card", "羊皮纸标题卡"],
    ["Parchment macro diagram", "羊皮纸微距图解"],
    ["Training ground stone floor", "训练场石地"],
    ["Chalk/parchment triptych", "粉笔/羊皮纸三联图"],
    ["Diagram-to-abstract transition", "从图解到抽象结构的转场"],
    ["Low three-quarter medium, sword foreground", "低三分之四中景，木剑在前景"],
    ["Define the challenge in one sentence", "用一句话提出挑战"],
    ["Training-ground question shot with three student representatives.", "训练场提问镜头，三位学生代表在场。"],
    ["Not approved_for_video. This is a real-frame preview for visual/math review.", "尚未批准进入视频出片；这是用于视觉/数学审查的真实帧预览。"],
    ["built_in_imagegen_three_student_question_revised", "内置图像生成：三学生提问镜头修订版"],
    ["built_in_imagegen", "内置图像生成"],
    ["none; opening shot.", "无，开场镜头。"],
    ["BylethFemale identity drift; avoid smile", "女贝老师身份漂移；避免微笑。"],
    ["If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.", "如果女贝老师可见，必须监看跨帧和相邻镜头中的身份漂移。"],
  ]);
  if (direct.has(text)) return direct.get(text);
  return visibleZh(text)
    .replace(/Revised real generated training-ground question shot:/g, "修订后的真实生成训练场提问镜头：")
    .replace(/asks the unit-sword problem to visible/g, "向画面中可见的")
    .replace(/Check student identity, Byleth continuity, sword endpoints, and handoff to SH003\./g, "检查学生身份、女贝老师连续性、木剑端点，以及转接 SH003 是否顺畅。")
    .replace(/identity drift/g, "身份漂移")
    .replace(/avoid smile/g, "避免微笑")
    .replace(/AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta\/alpha labels, and union\/overlap relationships legible\./g, "AI 视频可能过度装饰数学图形；必须保持几何关系、端点标记、δ/α 标签、并集/重叠关系清楚可读。")
    .replace(/If 女贝老师 is visible, identity drift must be monitored across frames and adjacent shots\./g, "如果女贝老师可见，必须监看跨帧和相邻镜头中的身份漂移。")
    .replace(/If 女贝老师 is visible, 身份漂移 must be monitored across frames and adjacent shots\./g, "如果女贝老师可见，必须监看跨帧和相邻镜头中的身份漂移。")
    .replace(/Previous shot/g, "上一镜头")
    .replace(/Next shot/g, "下一镜头")
    .replace(/Preserve screen direction and visual subject handoff stated above\./g, "保持上方规定的画面方向和视觉主体交接。")
    .replace(/\(([^)]+)\)/g, (_, inner) => `（${beatZh[inner] || translateProductionText(inner) || inner}）`);
}

function rejectZh(value) {
  const text = String(value || "").trim();
  const direct = new Map([
    ["Unit segment must be visibly length 1 with two endpoints; the condition is all directions, not a fixed center unless shown as a rejected intuition.", "一单位线段必须清楚显示长度为 1 且有两个端点；条件是覆盖所有方向，不是固定中心，除非画面明确把固定中心作为被否定的直觉。"],
    ["Preserve exact three-cusp deltoid; tangent chord must stay inside deltoid and visibly rotate through orientations.", "保持准确的三尖内摆线；切线弦必须留在三尖内摆线内部，并清楚展示随切点改变而转过各个方向。"],
    ["Deltoid scale must not imply radius 1/3 as the unit-needle lock; visible lock is 4a = 1, a = 1/4.", "三尖内摆线尺度不得误导为用半径 1/3 锁定一单位针；可见尺度锁必须是 4a = 1、a = 1/4。"],
    ["Show pi/8 as deltoid candidate area only, not final optimum.", "pi/8 只能作为三尖内摆线候选面积，不得说成最终最优面积。"],
    ["Convex triangle is convex-only optimum; do not imply nonconvex global optimum.", "等边三角形只是在凸区域限制下的最优解，不得暗示为非凸原问题的全局最优。"],
    ["Triangle height must be 1; side length 2/sqrt(3); area 1/sqrt(3).", "三角形高度必须是 1，边长为 2/sqrt(3)，面积为 1/sqrt(3)。"],
    ["Perron cut must split direction intervals without deleting directions.", "佩龙树切分必须把方向区间分配给小三角形，不得删除方向。"],
    ["Perron slide must be translation only; pieces do not rotate during slide.", "佩龙树平移只能是平移，小三角片滑动时不得旋转。"],
    ["Overlap must shrink union area while direction coverage remains visible.", "重叠必须显示并集面积变小，同时方向覆盖仍然可见。"],
    ["Zero area caution: area 0 does not mean the set disappears.", "零面积澄清：面积为 0 不等于集合消失。"],
    ["Delta tube width must be visible; alpha angle must be visible; gold overlap patch must match the estimate.", "δ 管宽度必须可见，α 夹角必须可见，金色重叠区域必须对应估计式。"],
    ["Deltoid must be a true three-cusped hypocycloid-style region; show unit chord scale with a = 1/4 and area A = pi/8; never use radius 1/3 as the unit-needle scale.", "三尖内摆线必须是真正的三尖内摆线式区域；显示一单位弦尺度 a = 1/4 和面积 A = pi/8；不得用半径 1/3 作为一单位针的尺度。"],
    ["Convex triangle is only the convex-restricted optimum; equilateral triangle height is 1, side length is 2/sqrt(3), area is 1/sqrt(3).", "凸三角形只是在凸区域限制下的最优解；等边三角形高度为 1，边长为 2/sqrt(3)，面积为 1/sqrt(3)。"],
    ["Perron triangle/fan must preserve direction interval; base subdivision and apex fan must remain readable.", "佩龙三角形/方向扇必须保留方向区间；底边切分和顶点方向扇必须可读。"],
    ["Perron cut-slide-overlap sequence must preserve direction coverage and visibly shrink union area.", "佩龙树的切分、平移、重叠序列必须保留方向覆盖，并清楚显示并集面积缩小。"],
    ["Delta tube width and alpha angle labels must remain legible; overlap estimate must match gold overlap patch.", "δ 管宽度和 α 夹角标签必须可读；重叠估计必须对应金色重叠区域。"],
    ["Zero area is not nonexistence; δ-tube diagrams must show δ width, α angle, gold overlap patch, and dimension equals 2 in the final 2D statement.", "零面积不是不存在；δ 管图解必须显示 δ 宽度、α 夹角、金色重叠区域，并在二维最终结论中显示维数等于 2。"],
    ["Impact must stay proof-derived: tube overlap, maximal averages, and wave packets; no vague life metaphor.", "影响部分必须来自证明机制：细管重叠、最大平均和波包；不得变成模糊生活比喻。"],
    ["Impact must stay tied to proof mechanisms: tube overlap, maximal averages, wave packets, Kakeya maximal-function intuition, and combinatorial geometry; no loose daily-life claims.", "影响部分必须绑定证明机制：细管重叠、最大平均、波包、挂谷最大函数直觉和组合几何；不要松散生活化说法。"],
    ["Prop length unclear if no end marks", "如果没有端点标记导致道具长度不清楚，则拒绝。"],
    ["Byleth must be visible in the opening; prop length unclear if no end marks", "开场起始帧必须看见女贝老师；如果没有端点标记导致道具长度不清楚，则拒绝。"],
    ["BylethFemale identity drift; avoid smile", "女贝老师身份漂移或表情变成明显微笑，则拒绝。"],
    ["Dialogue too long", "台词过长、挤压画面节奏，则拒绝。"],
    ["Avoid pure analogy", "把数学影响讲成纯比喻，则拒绝。"],
    ["No extra formulas", "添加不必要公式，则拒绝。"],
    ["Circle may look like final answer", "圆盘看起来像最终答案，则拒绝。"],
    ["Text too readable/modern; use simple symbols", "文字过于现代或像 UI；应使用简单符号。"],
    ["Too many ghost swords clutter frame", "幽灵剑过多导致画面拥挤，则拒绝。"],
    ["Deltoid shape must be recognizable", "三尖内摆线形状必须可识别。"],
    ["Must show chord inside region", "必须显示弦在区域内部。"],
    ["Formula without explanation", "公式缺少解释，则拒绝。"],
    ["Avoid saying it is answer", "不得说成最终答案。"],
    ["Character identity optional if not generated", "如果未生成角色，身份检查可选；如果角色可见则必须保持身份。"],
    ["Convex concept unclear", "凸性的概念不清楚，则拒绝。"],
    ["Too elementary but necessary", "内容基础但必要，不能因为基础而删掉。"],
    ["Must not imply global optimum", "不得暗示为全局最优。"],
    ["Formula crowding", "公式过于拥挤，则拒绝。"],
    ["Abstract split needs labels", "抽象分屏需要清楚标签。"],
    ["Direction meaning unclear unless green lines visible", "如果绿色方向线不可见，方向含义会不清楚。"],
    ["Cut may look like deleting directions", "切分不能看起来像删除方向。"],
    ["AI may rotate pieces accidentally", "AI 可能误把碎片旋转，必须监看。"],
    ["Need union outline not just pile", "必须显示并集轮廓，不能只是碎片堆叠。"],
    ["This is the proof checkpoint", "这是证明检查点，不能跳过。"],
    ["Too fast to understand", "节奏过快导致难以理解，则拒绝。"],
    ["Needs exact wording", "必须保持准确措辞。"],
    ["May imply actual turn region zero; avoid", "不得暗示真实旋转区域本身直接为零。"],
    ["Delta label readability", "δ 标签必须可读。"],
    ["Must show two cases", "必须显示两种夹角情况。"],
    ["Use `C` instead of hard symbol if needed", "必要时使用 C 表示常数，不要强行写死难读符号。"],
    ["Use C instead of hard symbol if needed", "必要时使用 C 表示常数，不要强行写死难读符号。"],
    ["Hausdorff term too sudden", "豪斯多夫术语出现过突兀，则需要降低门槛。"],
    ["Avoid overexplaining", "避免过度解释。"],
    ["Too academic if terms unexplained", "术语不解释会显得过于学术。"],
    ["Revealing too late is okay", "最后揭示名称是允许的。"],
    ["Keep readable", "必须保持可读。"],
    ["the equilateral triangle is implied to solve the unrestricted non-convex problem", "等边三角形被暗示为非凸原问题的解，则拒绝。"],
    ["start/key/end frames do not form the stated action chain", "起始帧、关键帧、结束帧没有形成规定动作链，则拒绝。"],
    ["camera motion hides the action peak or reverses the declared screen direction", "镜头运动遮住动作峰值，或反转既定画面方向，则拒绝。"],
    ["Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student", "女贝老师变成男贝、成年导师、普通魔女或普通学生，则拒绝。"],
    ["the unit segment loses visible endpoints or becomes a decorative sword without length meaning", "一单位线段失去可见端点，或木剑变成没有长度含义的装饰剑，则拒绝。"],
    ["deltoid, unit chord, a = 1/4, or A = pi/8 are missing or scaled incorrectly", "三尖内摆线、一单位弦、a = 1/4 或 A = pi/8 缺失或尺度错误，则拒绝。"],
    ["Perron cut, slide, overlap, or direction-preservation logic is visually broken", "佩龙树的切分、平移、重叠或方向保持逻辑被画错，则拒绝。"],
    ["impact is presented as a loose life metaphor instead of proof-derived tube/wave/maximal-average structure", "影响部分被讲成松散生活比喻，而不是证明导出的细管、波包、最大平均结构，则拒绝。"],
  ]);
  if (direct.has(text)) return direct.get(text);
  return translateProductionText(text)
    .replace(/start\/key\/end frames/g, "起始帧、关键帧、结束帧")
    .replace(/Female Byleth/g, "女贝老师")
    .replace(/male Byleth/g, "男贝")
    .replace(/BylethFemale/g, "女贝老师")
    .replace(/deltoid/g, "三尖内摆线")
    .replace(/Perron/g, "佩龙树")
    .replace(/delta/g, "δ")
    .replace(/alpha/g, "α");
}

function renderBullets(items, fallback = "无") {
  const clean = items.filter(Boolean);
  return clean.length ? clean.map((item) => `- ${item}`).join("\n") : `- ${fallback}`;
}

function postprocessChineseText(text) {
  return String(text)
    .replace(/Deltoid/g, "三尖内摆线")
    .replace(/deltoid/g, "三尖内摆线")
    .replace(/Delta/g, "δ")
    .replace(/\bdelta\b/g, "δ")
    .replace(/\bAlpha\b/g, "α")
    .replace(/\balpha\b/g, "α")
    .replace(/Diagram or prop shot; no character asset required\./g, "图解或道具镜头，不需要角色资产。")
    .replace(/Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist\./g, "不得添加未计划的指定学生；除非已有批准资产，学生台词只使用画外音或肩部剪影。")
    .replace(/No full character; diagram only/g, "无完整角色，仅图解")
    .replace(/Diagram only/g, "仅图解")
    .replace(/diagram only/g, "仅图解")
    .replace(/diagram dominant/g, "图解为主")
    .replace(/hand optional/g, "手部可选")
    .replace(/pointer optional/g, "指示手可选")
    .replace(/wooden practice sword/g, "木制训练剑")
    .replace(/Wooden practice sword/g, "木制训练剑")
    .replace(/Sword rotates around fixed center/g, "木剑绕固定中心旋转")
    .replace(/Chalk fan of ghost swords/g, "粉笔幽灵剑方向扇")
    .replace(/Chalk 三尖内摆线 forming/g, "粉笔三尖内摆线成形")
    .replace(/Formula plus diagram/g, "公式加图解")
    .replace(/Formula/g, "公式")
    .replace(/Rope boundary on floor/g, "地面绳索边界")
    .replace(/Two dots inside shape/g, "图形内部两点")
    .replace(/Equilateral triangle height 1/g, "高为 1 的等边三角形")
    .replace(/Triangle formula/g, "三角形公式")
    .replace(/Split-screen convex\/nonconvex/g, "凸/非凸分屏")
    .replace(/Large isosceles triangle on sand table/g, "沙盘上的大等腰三角形")
    .replace(/Triangle base subdivision/g, "三角形底边切分")
    .replace(/Thin triangles sliding/g, "细三角形平移")
    .replace(/Thin triangles overlapping/g, "细三角形重叠")
    .replace(/Direction color ruler/g, "方向颜色尺")
    .replace(/Multi-step animated tree/g, "多步佩龙树动画")
    .replace(/Line segment vs region/g, "线段与区域对照")
    .replace(/Red line becomes blue tube/g, "红线变成蓝色细管")
    .replace(/Two crossing tubes/g, "两根交叉细管")
    .replace(/Formula over tube diagram/g, "细管图上的公式")
    .replace(/Grid zoom/g, "网格缩放")
    .replace(/Blackboard final theorem/g, "黑板最终定理")
    .replace(/Montage of tubes\/waves\/averages/g, "细管、波、平均的蒙太奇")
    .replace(/Chalk terms with diagrams/g, "粉笔术语与图解")
    .replace(/Training sword on floor/g, "地面训练剑")
    .replace(/Minimal parchment title card/g, "极简羊皮纸标题卡")
    .replace(/on stone floor/g, "在石地上")
    .replace(/Wood taps stone; no dialogue/g, "木头轻敲石地；无对白")
    .replace(/Chalk tick/g, "粉笔轻点声")
    .replace(/center fixed \/ center free/g, "中心固定 / 中心可移动")
    .replace(/chalks two marks/g, "画出两个标记")
    .replace(/女贝老师 画出两个标记/g, "女贝老师画出两个标记")
    .replace(/ch三尖内摆线s two marks/g, "画出两个标记")
    .replace(/area wash/g, "面积填色")
    .replace(/tangent chord/g, "切线弦")
    .replace(/tree proof must keep direction coverage visible: cut assigns direction intervals, slide translates without rotation, overlap shrinks union area without deleting directions\./g, "证明必须保持方向覆盖可见：切分分配方向区间，平移不旋转，重叠缩小并集面积且不删除方向。")
    .replace(/Zero area is not nonexistence; δ-tube diagrams must show δ width, α angle, gold overlap patch, and dimension equals 2 in the final 2D statement\./g, "零面积不是不存在；δ 管图解必须显示 δ 宽度、α 夹角、金色重叠区域，并在二维最终结论中显示维数等于 2。")
    .replace(/δ, α, overlap, zero-area caution, or dimension = 2 claim is invisible or wrong/g, "δ、α、重叠、零面积澄清或维数等于 2 的结论不可见或错误")
    .replace(/overlap/g, "重叠")
    .replace(/morph/g, "变形")
    .replace(/Perron/g, "佩龙树")
    .replace(/sand-table diagram/g, "沙盘图解")
    .replace(/cut-slide/g, "切分-平移")
    .replace(/epsilon/g, "ε")
    .replace(/Low string pulse/g, "低弦乐脉冲")
    .replace(/女贝老师 in classroom, board behind/g, "女贝老师在教室内，黑板在后")
    .replace(/area may be 0/g, "面积可以为 0")
    .replace(/dimension = 2/g, "维数 = 2")
    .replace(/\btube\b/g, "细管")
    .replace(/wave packet ray/g, "波包射线")
    .replace(/Kakeya maximal-function intuition/g, "挂谷最大函数直觉")
    .replace(/combinatorial geometry/g, "组合几何")
    .replace(/no loose daily-life claims/g, "不要松散生活化说法")
    .replace(/Impact must stay tied to proof mechanisms:/g, "影响部分必须绑定证明机制：")
    .replace(/final card/g, "结尾卡")
    .replace(/Final soft chord/g, "结尾柔和和弦")
    .replace(/Wooden sword; no full character/g, "木剑；无完整角色")
    .replace(/公式 over 细管 diagram/g, "细管图上的公式")
    .replace(/built_in_imagegen[_A-Za-z0-9]*/g, "内置图像生成")
    .replace(/real_generated[_A-Za-z0-9]*/g, "真实生成数学叠加")
    .replace(/with_local_text_overlay/g, "带本地文字叠加")
    .replace(/corrected_alpha_labels/g, "已校正 α 标签")
    .replace(/\bopening shot\b/g, "开场镜头")
    .replace(/\bnull\b/g, "无")
    .replace(/\btrue\b/g, "是")
    .replace(/\bfalse\b/g, "否")
    .replace(/maximal averages/g, "最大平均")
    .replace(/wave packets/g, "波包")
    .replace(/tube overlap/g, "细管重叠")
    .replace(/\bnone\b/g, "无");
}

function translateDeep(value) {
  if (typeof value === "string") return postprocessChineseText(value);
  if (Array.isArray(value)) return value.map(translateDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, translateDeep(entry)]));
  }
  return value;
}

function chineseFrameSpec(id, frameSpecText, delivery, real, shotRow) {
  const duration = lineValue(frameSpecText, "Duration Target") || `${delivery.duration_seconds ?? "?"} seconds`;
  const rejectIf = parseRejectIf(frameSpecText).map(rejectZh);
  const mathLocks = bulletItems(frameSpecText, "Mathematical Graphic Locks").map(rejectZh);
  const motionRisks = bulletItems(frameSpecText, "Motion Risks").map(rejectZh);
  const continuity = bulletItems(frameSpecText, "Continuity Requirements").map(translateProductionText);
  const assetRefs = bulletItems(frameSpecText, "Asset References");
  const visible = visibleZh(lineValue(frameSpecText, "Characters Visible"));
  const beat = zh(lineValue(frameSpecText, "Script Beat"), beatZh);
  const story = storyPurposeZh[id] || paragraph(frameSpecText, "Shot Purpose") || shotRow.purpose || "";
  const identityLocks = [
    "女贝老师只使用女版教授形象，不使用男贝。",
    "女贝老师参考：assets/characters/protagonist/BylethFemale/professor/selected.png。",
    "需要全身姿态、手套或持剑动作时，使用：assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png。",
    "可见学生阵容锁定为艾黛尔、莉丝缇亚、梅尔赛德斯，不得替换成其他学生或普通学生。",
  ];

  const text = `# 分镜规格：${id}

镜头编号：${id}
阶段：真实帧锁定视频提示词包
状态：真实帧已生成，提示词已就绪
依赖：女贝老师二维挂谷分镜表
剧情节点：${beat || "未标注"}
成片作用：${story}
时长目标：${duration.replace(/seconds?/i, "秒")}
地点：${translateProductionText(lineValue(frameSpecText, "Location") || shotRow.subject || "未标注")}
可见角色：${visible || "未标注"}

身份锁：
${renderBullets(identityLocks)}

资产引用：
${renderBullets(assetRefs)}

起始帧意图：
${paragraph(frameSpecText, "Start Frame Intent") || "未标注"}

关键帧意图：
${paragraph(frameSpecText, "Key Frame Intent") || "未标注"}

结束帧意图：
${paragraph(frameSpecText, "End Frame Intent") || "未标注"}

摄影机：
${paragraph(frameSpecText, "Camera") || shotRow.camera || "未标注"}

调度：
${paragraph(frameSpecText, "Blocking") || "未标注"}

画面方向：
${paragraph(frameSpecText, "Screen Direction") || "未标注"}

数学图形锁：
${renderBullets(mathLocks, "本镜头没有额外数学图形锁。")}

动作峰值：
${paragraph(frameSpecText, "Action Peak") || "未标注"}

中文台词 / 音频锚点：
${paragraph(frameSpecText, "Dialogue / Audio Anchor") || (dialogueAnchorZh[id] || []).map(([speaker, line]) => `${speaker}：${line}`).join("\n") || "无对白"}

剪入：
${delivery.edit_in || paragraph(frameSpecText, "Edit In") || "未标注"}

剪出：
${delivery.edit_out || paragraph(frameSpecText, "Edit Out") || "未标注"}

连续性要求：
${renderBullets(continuity, "保持与前后镜头的角色位置、光线、图形尺度一致。")}

运动风险：
${renderBullets(motionRisks, "待视频运动 QA。")}

拒绝条件：
${renderBullets(rejectIf, "未标注")}

真实帧来源：
- 起始帧：${real.real_start_frame}
- 关键帧：${real.real_key_frame}
- 结束帧：${real.real_end_frame}
`;
  return postprocessChineseText(text);
}

function chineseMetadata(id, order, metadata, frameSpecText) {
  return translateDeep({
    "镜头编号": id,
    "顺序": order,
    "状态": zh(metadata.status, statusZh),
    "审查状态": zh(metadata.review_status, statusZh),
    "时长秒": metadata.duration_seconds,
    "预计视频片段": metadata.expected_clip,
    "剧情节点": zh(metadata.beat, beatZh),
    "成片作用": storyPurposeZh[id] || paragraph(frameSpecText, "Shot Purpose") || metadata.purpose,
    "可见主体": postprocessChineseText(translateProductionText(metadata.subject)),
    "摄影机": postprocessChineseText(paragraph(frameSpecText, "Camera") || translateProductionText(metadata.camera)),
    "剪入": metadata.edit_in,
    "剪出": metadata.edit_out,
    "中文台词或音频锚点": postprocessChineseText(metadata.audio_anchor),
    "逐句台词": Object.fromEntries((metadata.dialogue_anchor_zh || []).map(([speaker, line], index) => [`${String(index + 1).padStart(2, "0")}_${speaker}`, line])),
    "主要检查": postprocessChineseText(primaryCheckZh[id] || translateProductionText(metadata.primary_check)),
    "上一镜头": metadata.continuity_previous || "无",
    "下一镜头": metadata.continuity_next || "无",
    "拒绝条件": (metadata.reject_if || []).map(rejectZh),
    "真实帧来源": {
      "起始帧": metadata.source_frames.start_frame,
      "关键帧": metadata.source_frames.key_frame,
      "结束帧": metadata.source_frames.end_frame,
    },
    "角色身份视觉审查": metadata.identity_visual_audit || null,
    "提示词来源": metadata.prompt_source,
    "模型提示词来源": metadata.model_prompt_source,
    "负面提示词来源": metadata.negative_prompt_source,
    "来源标记": postprocessChineseText(translateProductionText(metadata.source)),
    "需要质检": metadata.qa_required ? "是" : "否",
    "批准说明": translateProductionText(metadata.approval_note),
  });
}

const frameManifest = readJson(frameManifestPath);
const deliveryManifest = readJson(deliveryManifestPath);
const frameProgressionAudit = fs.existsSync(frameProgressionAuditPath) ? readJson(frameProgressionAuditPath) : null;
const progressionById = new Map((frameProgressionAudit?.shots || []).map((shot) => [shot.id, shot]));
const shotRows = parseShotList(fs.readFileSync(shotListPath, "utf8"));
const deliveryById = new Map(deliveryManifest.shots.map((shot) => [shot.id, shot]));
const realById = new Map(frameManifest.shots.map((shot) => [shot.id, shot]));
const completed = allShotIds().filter((id) => hasAllFrames(realById.get(id) || {}));
const pending = allShotIds().filter((id) => !completed.includes(id));

ensureDir(outShotsRoot);

const sectionHtml = [];
const packageManifest = {
  version: 1,
  project_id: frameManifest.project_id,
  package_type: "real_frame_preview",
  status: "real_frames_complete_monitor_required",
  created_at: "2026-07-28",
  source_manifest: relativeToProject(frameManifestPath),
  completed_shots: completed,
  pending_shots: pending,
  progress: {
    generated_real_frames: frameManifest.remaining_scope.generated_real_frames,
    total_required_real_frames: frameManifest.remaining_scope.total_required_real_frames,
    remaining_real_frames: frameManifest.remaining_scope.remaining_real_frames,
  },
  notes: [
    "本预览只展示从 real_frames/ 复制来的真实起始帧、关键帧、结束帧。",
    "storyboards/ 下的旧布局参考图不进入当前帧网格。",
    "帧存在审计与帧变化审计分开：低帧差镜头只能说明三张图太接近，不能直接投产。",
    "镜头必须通过视觉、数学、运动和连续性 QA 后，才能批准进入视频出片。",
  ],
  frame_progression_audit: frameProgressionAudit ? {
    status: frameProgressionAudit.status,
    audit_path: relativeToProject(frameProgressionAuditPath),
    low_progression_count: frameProgressionAudit.summary.low_progression_count,
    watch_count: frameProgressionAudit.summary.watch_count,
  } : null,
  shots: [],
};

for (const id of completed) {
  const order = Number(id.slice(2));
  const real = realById.get(id);
  const delivery = deliveryById.get(id) || {};
  const shotRow = shotRows.get(id) || {};
  const frameSpecSource = path.join(projectRoot, "storyboards", id, "frame_spec.md");
  const promptSource = firstExisting([
    path.join(projectRoot, "real_video_prompts", id, "prompt.md"),
    path.join(projectRoot, "storyboards", id, "prompt.md"),
  ]);
  const modelPromptSource = firstExisting([
    path.join(projectRoot, "real_video_prompts", id, "model_prompt.md"),
  ]);
  const negativeSource = firstExisting([
    path.join(projectRoot, "real_video_prompts", id, "negative_prompt.md"),
    path.join(projectRoot, "storyboards", id, "negative_prompt.md"),
  ]);
  const frameSpecText = fs.existsSync(frameSpecSource) ? fs.readFileSync(frameSpecSource, "utf8") : "";
  const rejectIf = parseRejectIf(frameSpecText);
  const folder = shotFolderName(order, id);
  const shotOut = path.join(outShotsRoot, folder);
  ensureDir(shotOut);

  const startFrameSource = path.join(projectRoot, real.real_start_frame);
  const keyFrameSource = path.join(projectRoot, real.real_key_frame);
  const endFrameSource = path.join(projectRoot, real.real_end_frame);
  copyIfExists(startFrameSource, path.join(shotOut, "start_frame.png"));
  copyIfExists(keyFrameSource, path.join(shotOut, "key_frame.png"));
  copyIfExists(endFrameSource, path.join(shotOut, "end_frame.png"));
  copyIfExists(promptSource, path.join(shotOut, "prompt.md"));
  if (modelPromptSource) {
    copyIfExists(modelPromptSource, path.join(shotOut, "model_prompt.md"));
  }
  copyIfExists(negativeSource, path.join(shotOut, "negative_prompt.md"));
  writeText(
    path.join(shotOut, "frame_spec.md"),
    chineseFrameSpec(id, frameSpecText, delivery, real, shotRow)
  );

  const metadata = {
    id,
    order,
    status: real.status === "blocked_needs_identity_regeneration" ? "blocked_needs_identity_regeneration" : "real_frames_complete_monitor_required",
    review_status: real.review_status || "needs_visual_qa",
    duration_seconds: delivery.duration_seconds ?? null,
    expected_clip: delivery.expected_clip || `clips/${id}.mp4`,
    beat: shotRow.beat || "",
    purpose: shotRow.purpose || "",
    subject: shotRow.subject || "",
    camera: shotRow.camera || "",
    edit_in: delivery.edit_in || "",
    edit_out: delivery.edit_out || "",
    audio_anchor: shotRow.audio || "",
    dialogue_anchor_zh: dialogueAnchorZh[id] || [],
    primary_check: real.notes || shotRow.risks || "",
    continuity_previous: delivery.continuity?.previous || null,
    continuity_next: delivery.continuity?.next || null,
    reject_if: rejectIf,
    source_frames: {
      start_frame: real.real_start_frame,
      key_frame: real.real_key_frame,
      end_frame: real.real_end_frame,
    },
    prompt_source: relativeToProject(promptSource),
    model_prompt_source: modelPromptSource ? relativeToProject(modelPromptSource) : null,
    negative_prompt_source: relativeToProject(negativeSource),
    source: real.source || "",
    qa_required: true,
    approval_note: "尚未批准直接出片。本页是真实三帧预览，用于视觉、数学和运动监看前审查。",
    frame_progression: progressionById.get(id) || null,
    identity_visual_audit: real.identity_visual_audit || null,
  };
  writeText(path.join(shotOut, "metadata.json"), `${JSON.stringify(chineseMetadata(id, order, metadata, frameSpecText), null, 2)}\n`);
  writeReadableTextMirror(
    path.join(shotOut, "model_prompt.md"),
    `${id} 给模型用：主提示词`,
    "模型主提示词",
    "真正提交给视频模型的正文提示词。网页优先打开这个 UTF-8 阅读版；实际提交时仍使用旁边的 model_prompt.md 原文。"
  );
  writeReadableTextMirror(
    path.join(shotOut, "negative_prompt.md"),
    `${id} 给模型用：负面约束`,
    "负面提示词",
    "真正提交给视频模型的负面约束。实际提交时仍使用旁边的 negative_prompt.md 原文。"
  );
  writeReadableTextMirror(
    path.join(shotOut, "prompt.md"),
    `${id} 审查资料：提示词合同`,
    "审查提示词",
    "这是给人和 QA 脚本核对用的提示词合同，不是首选模型输入。模型提交入口请看 model_prompt.md。"
  );
  writeReadableTextMirror(
    path.join(shotOut, "frame_spec.md"),
    `${id} 审查资料：分镜规格`,
    "分镜规格",
    "这是导演、数学和画面审查用的镜头规格，不是模型输入。"
  );
  writeReadableTextMirror(
    path.join(shotOut, "metadata.json"),
    `${id} 后台资料：元数据`,
    "元数据",
    "这是脚本、manifest 和网页使用的后台数据，通常不用手动复制给视频模型。"
  );
  packageManifest.shots.push({
    id,
    folder: `shots/${folder}`,
    status: metadata.status,
    review_status: metadata.review_status,
    duration_seconds: metadata.duration_seconds,
    identity_visual_audit: metadata.identity_visual_audit,
  });

  const displayBeat = zh(shotRow.beat, beatZh) || "真实帧镜头";
  const displayStatus = zh(metadata.status, statusZh);
  const displayReview = zh(metadata.review_status, statusZh);
  const displayCheck = primaryCheckZh[id] || metadata.primary_check;
  const identityAudit = metadata.identity_visual_audit;
  const identityBlockHtml = identityAudit
    ? `<div class="identity-block"><strong>角色身份阻塞</strong><p>${escHtml((identityAudit.findings || []).join(" "))}</p><p><a href="../../${escHtml(identityAudit.review)}">打开角色身份审查</a> · <a href="../../${escHtml(identityAudit.contact_sheet)}">打开对照图</a></p></div>`
    : "";
  const displayStoryPurpose = storyPurposeZh[id] || shotRow.purpose || "";
  const displayDialogue = renderDialogue(dialogueAnchorZh[id]);
  const progression = progressionById.get(id);
  const progressionLabel = progression ? progression.zh_status : "未审计";
  const progressionClass = progression?.status === "low_progression_requires_revision" ? "motion-risk high" : progression?.status === "watch_motion_generation" ? "motion-risk watch" : "motion-risk";
  const progressionDetail = progression
    ? `帧变化审计：${progression.zh_status}。起始-关键 ${progression.pair_mean_abs_diff.start_key.toFixed(2)}，关键-结束 ${progression.pair_mean_abs_diff.key_end.toFixed(2)}，起始-结束 ${progression.pair_mean_abs_diff.start_end.toFixed(2)}。${progression.note_zh}`
    : "帧变化审计：尚未生成。";

  sectionHtml.push(`    <section id="${escHtml(id)}">
      <h2>${escHtml(id)} - ${escHtml(displayBeat)}</h2>
      <div class="shot-meta">
        <span class="pill">状态：${escHtml(displayStatus)}</span>
        <span class="pill">审查：${escHtml(displayReview)}</span>
        <span class="pill">时长：${escHtml(metadata.duration_seconds ?? "?")} 秒</span>
        <span class="pill ${progressionClass}">三帧变化：${escHtml(progressionLabel)}</span>
        <span class="story">成片作用：${escHtml(displayStoryPurpose)}</span>
        <span class="check">主要检查：${escHtml(displayCheck)}</span>
        <span class="check">${escHtml(progressionDetail)}</span>
      </div>
      ${displayDialogue}
      ${identityBlockHtml}
      <div class="frames">
        <figure><img src="shots/${folder}/start_frame.png" alt="${id} 起始帧"><figcaption>起始帧</figcaption></figure>
        <figure><img src="shots/${folder}/key_frame.png" alt="${id} 关键帧"><figcaption>关键帧</figcaption></figure>
        <figure><img src="shots/${folder}/end_frame.png" alt="${id} 结束帧"><figcaption>结束帧</figcaption></figure>
      </div>
      <div class="links asset-links">
        ${modelPromptSource ? `<a class="primary-link" href="shots/${folder}/model_prompt.html">给模型用：主提示词</a>` : ""}
        <a class="primary-link" href="shots/${folder}/negative_prompt.html">给模型用：负面约束</a>
      </div>
      <div class="links secondary-links">
        <span class="link-note">审查资料：</span>
        <a href="shots/${folder}/frame_spec.html">分镜规格</a>
        <a href="shots/${folder}/prompt.html">提示词合同</a>
        <a href="shots/${folder}/metadata.html">元数据</a>
      </div>
    </section>`);
}

const identityBlockedShots = packageManifest.shots
  .filter((shot) => shot.status === "blocked_needs_identity_regeneration")
  .map((shot) => shot.id);
if (identityBlockedShots.length) {
  packageManifest.status = "blocked_needs_identity_regeneration";
  packageManifest.character_identity_gate = {
    status: "blocked_needs_identity_regeneration",
    blocked_shots: identityBlockedShots,
    review: "production_system/reviews/character_identity_visual_audit_2026-08-02.md",
    contact_sheet: "production_system/reviews/character_identity_contact_sheet_2026-08-02.png",
  };
}

writeText(path.join(outRoot, "package_manifest.json"), `${JSON.stringify(packageManifest, null, 2)}\n`);

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>女贝老师二维挂谷镜头帧预览</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #20242a; background: #f7f8fa; }
    header { position: sticky; top: 0; z-index: 2; background: rgba(255,255,255,.96); border-bottom: 1px solid #d8dee8; padding: 16px 22px; }
    h1 { margin: 0; font-size: 20px; letter-spacing: 0; }
    .meta { margin-top: 4px; color: #657182; font-size: 13px; line-height: 1.5; }
    main { max-width: 1440px; margin: 0 auto; padding: 20px 22px 40px; }
    section { border-top: 1px solid #d8dee8; padding: 22px 0 28px; }
    h2 { margin: 0 0 10px; font-size: 18px; letter-spacing: 0; }
    .shot-meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px; color: #4f5b6a; font-size: 13px; }
    .pill { border: 1px solid #cfd7e3; border-radius: 999px; padding: 4px 9px; background: #fff; }
    .motion-risk { border-color: #9ec2aa; color: #21633a; background: #f3fbf5; }
    .motion-risk.watch { border-color: #e2bd69; color: #755314; background: #fff8e7; }
    .motion-risk.high { border-color: #d98b8b; color: #8d2727; background: #fff0f0; }
    .story { flex-basis: 100%; color: #20242a; font-weight: 800; line-height: 1.6; }
    .check { flex-basis: 100%; color: #344052; }
    .dialogue { display: grid; gap: 6px; margin: 0 0 14px; border: 1px solid #d8dee8; border-left: 4px solid #174ea6; border-radius: 8px; background: #fff; padding: 12px 14px; }
    .dialogue strong { font-size: 13px; color: #174ea6; }
    .dialogue p { margin: 0; color: #20242a; font-size: 14px; line-height: 1.6; }
    .dialogue b { color: #344052; }
    .identity-block { display: grid; gap: 6px; margin: 0 0 14px; border: 1px solid #d98b8b; border-left: 4px solid #b23b3b; border-radius: 8px; background: #fff0f0; padding: 12px 14px; }
    .identity-block strong { color: #8d2727; }
    .identity-block p { margin: 0; color: #532424; font-size: 14px; line-height: 1.6; }
    .identity-block a { color: #8d2727; font-weight: 900; text-decoration: none; }
    .guide { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 16px 0; }
    .guide article { border: 1px solid #d8dee8; border-radius: 8px; background: #fff; padding: 14px; }
    .guide strong { display: block; margin-bottom: 6px; font-size: 14px; }
    .guide p { margin: 0; color: #4f5b6a; font-size: 13px; line-height: 1.55; }
    .frames { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    figure { margin: 0; border: 1px solid #d8dee8; border-radius: 8px; overflow: hidden; background: #fff; }
    img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; background: #eef2f7; }
    figcaption { padding: 8px 10px; border-top: 1px solid #d8dee8; font-size: 13px; font-weight: 700; }
    .links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .links a { color: #174ea6; text-decoration: none; border: 1px solid #cfd7e3; background: #fff; border-radius: 6px; padding: 7px 10px; font-size: 13px; font-weight: 700; }
    .asset-links { margin-top: 14px; }
    .links a.primary-link { color: #fff; background: #174ea6; border-color: #174ea6; }
    .secondary-links { margin-top: 8px; align-items: center; }
    .link-note { color: #657182; font-size: 13px; font-weight: 800; }
    .pending { color: #657182; background: #fff; border: 1px dashed #cfd7e3; border-radius: 8px; padding: 14px; }
    @media (max-width: 900px) { .frames, .guide { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header>
    <h1>女贝老师二维挂谷镜头帧预览</h1>
    <div class="meta">
      已完成真实三帧镜头：${escHtml(compactRanges(completed) || "无")}。待完成：${escHtml(compactRanges(pending) || "无")}。<br>
      真实帧：${escHtml(frameManifest.remaining_scope.generated_real_frames)}/${escHtml(frameManifest.remaining_scope.total_required_real_frames)}。状态：可审片帧包，仍需视频运动 QA，尚未批准直接生成成片。
    </div>
  </header>
  <main>
    <div class="pending">这个页面只展示 real_frames 下的真实起始帧/关键帧/结束帧，不展示旧 storyboard 布局卡。三位学生互动锁定为：黑鹫艾黛尔、金鹿莉丝缇亚、青狮梅尔赛德斯。</div>
    <div class="guide" aria-label="如何阅读这个镜头资产页">
      <article>
        <strong>这不是成片播放器</strong>
        <p>这里是镜头资产审查页：每个镜头展示起始帧、关键帧、结束帧，用来检查画面、数学和连续性。</p>
      </article>
      <article>
        <strong>SH001 怎么看</strong>
        <p>SH001 现在是女贝老师站立持木剑、剑花一百八十度掉头、收势发问的三帧链。第一个画面必须先有戏，而不是地面标线。</p>
      </article>
      <article>
        <strong>三帧变化审计</strong>
        <p>${frameProgressionAudit ? `低帧差需修订 ${frameProgressionAudit.summary.low_progression_count} 镜头，运动监看 ${frameProgressionAudit.summary.watch_count} 镜头。` : "尚未生成帧变化审计。"}低帧差不等于文件重复，而是模型缺少足够动作锚点。</p>
      </article>
      <article>
        <strong>提示词按钮怎么用</strong>
        <p>只需要提交视频模型时，点“给模型用：主提示词”和“给模型用：负面约束”。分镜规格、提示词合同、元数据都只是审查资料。</p>
      </article>
      <article>
        <strong>完整顺序怎么看</strong>
        <p>按 SH001 到 SH034 顺序看：物体建立、提出问题、候选答案、凸区域、Perron 反转、δ 管、意义和片名揭示。</p>
      </article>
      <article>
        <strong>证明怎么补全</strong>
        <p><a href="../../proof_notes_freshman_level.md">打开大一高数版证明备注</a>，核对三尖内摆线、凸三角形、Perron 树、δ 管和维数的推理桥。</p>
      </article>
      <article>
        <strong>当前 QA 边界</strong>
        <p><a href="../../production_system/reviews/full_image_script_math_qa_2026-07-31.md">打开图片/剧本/数学 QA</a>，查看哪些已校验、哪些仍需全尺寸逐图审查。</p>
      </article>
    </div>
${sectionHtml.join("\n")}
  </main>
</body>
</html>
`;

writeText(path.join(outRoot, "asset_viewer.html"), html);

console.log(JSON.stringify({
  outRoot,
  completed_shots: completed.length,
  pending_shots: pending.length,
  generated_real_frames: frameManifest.remaining_scope.generated_real_frames,
  total_required_real_frames: frameManifest.remaining_scope.total_required_real_frames,
}, null, 2));
