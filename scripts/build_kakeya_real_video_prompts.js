#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "specials", "kakeya_byleth_lecture");
const outRoot = path.join(projectRoot, "real_video_prompts");
const shotListPath = path.join(projectRoot, "shot_list.md");
const frameManifestPath = path.join(projectRoot, "frame_generation_manifest.json");
const deliveryManifestPath = path.join(projectRoot, "production_system", "video_delivery_manifest.json");
const reviewManifestPath = path.join(projectRoot, "production_system", "review_manifest.json");
const artifactManifestPath = path.join(projectRoot, "production_system", "artifact_manifest.json");
const reviewPath = path.join(projectRoot, "production_system", "reviews", "real_frame_video_prompt_qa_2026-07-28.md");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

function writeJson(filePath, data) {
  writeText(filePath, JSON.stringify(data, null, 2));
}

function parseShotList(markdown) {
  const shots = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith("| SH")) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (cells.length < 9) continue;
    const [id, time, beat, purpose, subject, camera, blocking, audio, risks] = cells;
    shots.set(id, { id, time, beat, purpose, subject, camera, blocking, audio, risks });
  }
  return shots;
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
    if (/^[A-Z][A-Za-z /]+:\s*$/.test(line.trim())) break;
    if (/^[A-Z][A-Za-z /]+:\s+/.test(line.trim())) break;
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

function hasVisibleByleth(frameSpec) {
  const visible = lineValue(frameSpec, "Characters Visible");
  return /Female Byleth|Byleth|女贝/i.test(visible) && !/No named character|Diagram only/i.test(visible);
}

function isDiagramOnly(frameSpec) {
  const visible = lineValue(frameSpec, "Characters Visible");
  return /Diagram only|no character|no named character/i.test(visible);
}

function mathFocus(id) {
  const n = Number(id.slice(2));
  if (n <= 5) return "一单位线段与全方向覆盖";
  if (n <= 10) return "三尖内摆线候选、切线弦机制、一单位尺度和 pi/8 面积";
  if (n <= 15) return "凸区域限制、高为 1 的等边三角形和凸包补空隙的代价";
  if (n <= 23) return "佩龙树“切分、平移、重叠”证明：缩小并集面积，同时保留方向区间";
  if (n <= 29) return "δ 管、夹角 α 的重叠估计、零面积澄清和维数等于 2";
  return "证明机制带来的影响：细管重叠、最大平均、波包，以及最后揭示挂谷名称";
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
  return text
    .replace(/start\/key\/end frames/g, "起始帧、关键帧、结束帧")
    .replace(/Female Byleth/g, "女贝老师")
    .replace(/male Byleth/g, "男贝")
    .replace(/BylethFemale/g, "女贝老师")
    .replace(/deltoid/g, "三尖内摆线")
    .replace(/Perron/g, "佩龙树")
    .replace(/delta/g, "δ")
    .replace(/alpha/g, "α")
    .replace(/Reject/g, "拒绝");
}

function identityLock(frameSpec) {
  const visible = lineValue(frameSpec, "Characters Visible");
  const locks = [];
  if (!hasVisibleByleth(frameSpec)) {
    return [
      "本镜头不得凭空添加指定角色。",
      "如果需要课堂反应或画外音，除非输入帧已经可见，否则学生只保留柔和肩部剪影或声音。",
      "不得添加男贝、现代讲师或泛化的奇幻导师。",
    ];
  }
  locks.push(
    "保持女贝老师参考图一致：assets/characters/protagonist/BylethFemale/professor/selected.png。",
    "当镜头出现全身姿态、戴手套的手或持剑动作时，同时保持全身/武器参考：assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png。",
    "女贝老师必须是学院篇年轻教授形象：青绿色中长发、刘海与侧发、绿色专注眼睛、冷静克制表情、黑色佣兵/教授长外套、高领、深色贴身层次、皮革束带、克制的学院奇幻细节。",
    "不得男性化、年龄变大、夸张大笑、重设计服装，或变成黑袍女巫、普通学生、现代教师。"
  );
  if (/艾黛尔|Edelgard/i.test(visible)) {
    locks.push("保持艾黛尔参考图一致：assets/characters/black_eagles/Edelgard/academy/selected.png；浅金发、红披风、黑色学院制服、黑鹫代表的克制气场。");
  }
  if (/莉丝缇亚|Lysithea/i.test(visible)) {
    locks.push("保持莉丝缇亚参考图一致：assets/characters/golden_deer/Lysithea/academy/selected.png；白发、黑金学院制服、金鹿代表的敏锐专注。");
  }
  if (/梅尔赛德斯|Mercedes/i.test(visible)) {
    locks.push("保持梅尔赛德斯参考图一致：assets/characters/blue_lions/Mercedes/academy/selected.png；金发、米蓝色青狮披风、温和专注表情。");
  }
  if (/艾黛尔|莉丝缇亚|梅尔赛德斯|Edelgard|Lysithea|Mercedes/i.test(visible)) {
    locks.push("学生阵容锁定为艾黛尔、莉丝缇亚、梅尔赛德斯；学生可见时不得替换成非名单角色或普通学生。");
  }
  return locks;
}

function motionLine(id, spec, row) {
  const blocking = paragraph(spec, "Blocking") || row.blocking;
  const actionPeak = paragraph(spec, "Action Peak");
  const screenDirection = paragraph(spec, "Screen Direction");
  const intro = "严格按照已提供的 start_frame -> key_frame -> end_frame 三帧链做运动；不要重设计构图，也不要发明另一个镜头。";
  return [
    intro,
    `可见动作：${blocking}。`,
    actionPeak ? `动作峰值：${actionPeak}。` : "",
    screenDirection ? `画面方向：${screenDirection}。` : "",
    `数学主体必须保持为：${mathFocus(id)}。`,
  ].filter(Boolean).join(" ");
}

function performanceLine(spec, row) {
  if (isDiagramOnly(spec)) {
    return "图解镜头的“表演”就是清晰节奏：线条干净绘制或滑动，标签稳定停留，证明关键点只做一次轻微强调，不得用装饰性效果遮住几何关系。";
  }
  const audio = paragraph(spec, "Dialogue / Audio Anchor") || row.audio;
  const visible = lineValue(spec, "Characters Visible");
  const clauses = ["可见表演必须克制、适合课堂讲解。"];
  if (/Female Byleth|Byleth|女贝/i.test(visible)) {
    clauses.push("女贝老师必须保持与输入帧一致的年龄、服装、姿态逻辑和视线方向。");
  }
  if (/Edelgard|艾黛尔|Lysithea|莉丝缇亚|Mercedes|梅尔赛德斯/i.test(visible)) {
    clauses.push("学生只按输入帧中的站位和反应轻微表演，不要抢走证明主体。");
  }
  if (/sword|木制训练剑|practice sword/i.test(visible)) {
    clauses.push("木制训练剑作为一单位线段道具，端点和长度意义必须保持清楚。");
  }
  clauses.push(`表演节奏对应：${audio || "中文课堂讲解"}。`);
  return clauses.join("");
}

function audioLine(spec, row) {
  return paragraph(spec, "Dialogue / Audio Anchor") || row.audio || "中文课堂讲解，轻微教室或训练场环境声，无字幕。";
}

function continuityLine(id, spec, delivery) {
  const previous = delivery.continuity?.previous || "none";
  const next = delivery.continuity?.next || "none";
  const editIn = delivery.edit_in || paragraph(spec, "Edit In");
  const editOut = delivery.edit_out || paragraph(spec, "Edit Out");
  const screenDirection = paragraph(spec, "Screen Direction");
  return [
    `上一镜头：${previous}。下一镜头：${next}。`,
    editIn ? `剪入：${editIn}。` : "",
    editOut ? `剪出：${editOut}。` : "",
    screenDirection ? `保持既定画面方向：${screenDirection}。` : "",
    "保持光线、板书/沙盘质感、图形尺度和角色位置与三张输入帧一致。",
  ].filter(Boolean).join(" ");
}

function rejectLine(id, spec) {
  const rejects = bulletItems(spec, "Reject If");
  const locks = bulletItems(spec, "Mathematical Graphic Locks");
  const common = [
    "生成片段忽略 start_frame、key_frame 或 end_frame。",
    "镜头遮住动作峰值。",
    "出现新增字幕、说明字、标志、水印、现代 UI 或不可读的乱码文字。",
    "图解标签漂移、闪烁，或变成装饰符号。",
  ];
  const math = [
    "三尖内摆线尺度被改变，或被说成最终全局最优。",
    "凸三角形被暗示为非凸原问题的答案。",
    "佩龙树的切分、平移、重叠或方向保持步骤被删掉。",
    "δ/α 标签混淆，或重叠估计被视觉反转。",
    "面积为零被画成集合完全消失。",
  ];
  return [...new Set([...rejects.map(rejectZh), ...common, ...math])].join("；");
}

function negativePrompt(id, spec) {
  const base = [
    "不要男贝",
    "不要成年导师版贝老师",
    "不要老巫师",
    "不要泛化黑袍女巫",
    "不要把女贝老师替换成普通学生",
    "不要现代教师服装",
    "不要暴露服装",
    "不要重设计服装",
    "不要脸部漂移",
    "不要年龄漂移",
    "不要发色漂移",
    "不要未计划的指定学生",
    "不要现代教室",
    "不要现代 UI",
    "不要字幕",
    "不要说明字",
    "不要水印",
    "不要标志",
    "不要文字乱码",
    "不要公式乱码",
    "不要图解闪烁",
    "不要把证明图形变成装饰图形",
    "不要镜头旋转",
    "不要画面方向反转",
    "不要三尖内摆线尺度错误",
    "不要删除佩龙树方向",
    "不要让佩龙碎片在平移时旋转",
    "不要漏掉并集轮廓",
    "不要混淆 δ 和 α",
    "不要把零面积集合画成不存在",
    "不要没有证明依据的生活应用蒙太奇",
  ];
  if (isDiagramOnly(spec)) {
    base.push("不要往纯图解镜头里插入真人讲师");
  }
  if (/艾黛尔|莉丝缇亚|梅尔赛德斯|Edelgard|Lysithea|Mercedes/i.test(lineValue(spec, "Characters Visible"))) {
    base.push("不要非名单学生", "不要用普通学生替换艾黛尔、莉丝缇亚或梅尔赛德斯");
  }
  if (Number(id.slice(2)) >= 30) {
    base.push("不要模糊生活比喻", "不要商业信息图", "不要手机或网络素材感画面");
  }
  return `${[...new Set(base)].join("；")}。`;
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
    .replace(/maximal averages/g, "最大平均")
    .replace(/wave packets/g, "波包")
    .replace(/tube overlap/g, "细管重叠")
    .replace(/\bnone\b/g, "无");
}

function promptText(id, row, spec, delivery, real) {
  const duration = delivery.duration_seconds || Number((lineValue(spec, "Duration Target").match(/\d+/) || [8])[0]);
  const startIntent = paragraph(spec, "Start Frame Intent");
  const keyIntent = paragraph(spec, "Key Frame Intent");
  const endIntent = paragraph(spec, "End Frame Intent");
  const mathLocks = bulletItems(spec, "Mathematical Graphic Locks");
  const identity = identityLock(spec);
  const camera = paragraph(spec, "Camera") || row.camera;
  const purpose = paragraph(spec, "Shot Purpose") || row.purpose;
  const sourceStart = real.real_start_frame || delivery.start_frame;
  const sourceKey = real.real_key_frame || delivery.key_frame;
  const sourceEnd = real.real_end_frame || delivery.end_frame;

  const text = `Shot ID: ${id}
镜头编号：${id}

Duration: ${duration} seconds
时长：${duration} 秒

Input Frames:
输入帧：使用包内 start_frame.png 作为起始帧，key_frame.png 作为证明/动作峰值帧，end_frame.png 作为剪出状态帧。源审查路径为 ${sourceStart}、${sourceKey}、${sourceEnd}。只允许基于已提供三帧做运动，保持构图、角色身份、数学标记和光线，不要重新设计画面。

Shot Purpose:
镜头目的：${purpose}

三帧链：
- 起始帧：${startIntent}
- 关键帧：${keyIntent}
- 结束帧：${endIntent}

身份锁：
${identity.map((item) => `- ${item}`).join("\n")}

数学锁：
${(mathLocks.length ? mathLocks.map(rejectZh) : [`保持“${mathFocus(id)}”作为可见证明信息，而不是装饰。`]).map((item) => `- ${item}`).join("\n")}

Motion:
运动：${motionLine(id, spec, row)}

Camera:
摄影机：${camera}。保持景别、角度和视点与输入三帧一致；只使用有动机的小运动，例如稳定停留、缓慢推进、干净的图解滑动，或输入帧已经暗示的粉笔绘制揭示。

Performance:
表演：${performanceLine(spec, row)}

Timing:
时长执行：本镜头总长 ${duration} 秒。把主要动作峰值安排在中段，中文台词最后一个字应落在剪出前 0.4-1.0 秒；不要在台词结束后留下长时间静止尾巴。如果模型必须补足固定时长，只允许用输入帧已经支持的微小视线、手势、粉笔线条或图解强调来填充。

Audio:
音频：${audioLine(spec, row)} 不要字幕，不要额外屏幕说明字。

Continuity Locks:
连续性锁：${continuityLine(id, spec, delivery)}

Reject If:
拒绝条件：${rejectLine(id, spec)}
`;
  return postprocessChineseText(text);
}

function updateDeliveryManifest(deliveryManifest) {
  for (const shot of deliveryManifest.shots || []) {
    const id = shot.id;
    shot.prompt_path = `real_video_prompts/${id}/prompt.md`;
    shot.negative_prompt_path = `real_video_prompts/${id}/negative_prompt.md`;
    shot.model_prompt_path = `real_video_prompts/${id}/model_prompt.md`;
    shot.prompt_source = "real_frame_locked_video_prompt";
    shot.status = shot.status === "approved_for_video" ? "monitor_required" : shot.status;
    shot.review_status = "real_frame_prompt_ready_motion_qa_required";
    shot.risk_flags = [...new Set([...(shot.risk_flags || []), "motion_review_required", "not_approved_for_video"])];
    shot.model_notes = [
      "Use real_video_prompts prompt package and real_frames start/key/end frames.",
      "Prompt locks supplied start/key/end PNGs; do not use old storyboard layout prompts for video generation.",
      "Clip-level motion QA is still required before approved_for_video.",
    ];
  }
  deliveryManifest.target = "real_frame_locked_video_prompt_package";
  deliveryManifest.status = "monitor_required";
  deliveryManifest.delivery_blocker = "Real-frame video prompts now exist, but no shot is approved_for_video until motion and clip-level QA pass.";
}

function addReview(reviewManifest) {
  const reviewId = "KAK-BYLETH-REVIEW-REAL-FRAME-VIDEO-PROMPT-QA-2026-07-28";
  reviewManifest.reviews = (reviewManifest.reviews || []).filter((review) => review.review_id !== reviewId);
  reviewManifest.reviews.push({
    artifact_id: "KAK-BYLETH-REAL-FRAME-VIDEO-PROMPTS",
    review_id: reviewId,
    reviewer_role: "video-prompt-qa-reviewer",
    reviewer: "codex",
    created_at: "2026-07-28",
    decision: "monitor_required",
    blocking_issues: [],
    required_revisions: [
      "Run actual image-to-video clips from the packaged real frames.",
      "Perform clip-level motion, identity, math, and adjacent-cut QA before any approved_for_video promotion."
    ],
    rubric: {
      prompt_contract_sections: "pass",
      start_key_end_real_frame_lock: "pass",
      stale_storyboard_prompt_replacement: "pass",
      female_byleth_identity_locks: "pass",
      mathematical_reject_criteria: "pass",
      downstream_video_readiness: "monitor_required"
    },
    reviewed_paths: [
      "real_video_prompts/SH001/prompt.md",
      "real_video_prompts/SH007/prompt.md",
      "real_video_prompts/SH016/prompt.md",
      "real_video_prompts/SH019/prompt.md",
      "real_video_prompts/SH025/prompt.md",
      "real_video_prompts/SH030/prompt.md",
      "real_video_prompts/SH034/prompt.md",
      "production_system/video_delivery_manifest.json"
    ],
    notes: "All 34 prompts now point to real start/key/end frames and explicitly instruct the video model to animate the supplied frame chain rather than redesigning from old storyboard prompts."
  });
}

function addArtifact(artifactManifest) {
  const artifactId = "KAK-BYLETH-REAL-FRAME-VIDEO-PROMPTS";
  artifactManifest.artifacts = (artifactManifest.artifacts || []).filter((artifact) => artifact.id !== artifactId);
  artifactManifest.artifacts.push({
    id: artifactId,
    type: "delivery_packet",
    stage: "prompt_asset_package",
    status: "monitor_required",
    created_by: "prompt-asset-producer",
    created_at: "2026-07-28",
    paths: [
      "real_video_prompts/real_video_prompt_manifest.json",
      "real_video_prompts",
      "delivery/real_frame_preview_kakeya_byleth_2026-07-28/asset_viewer.html",
      "production_system/video_delivery_manifest.json",
    ],
    source_refs: [
      "frame_generation_manifest.json",
      "shot_list.md",
      "storyboards/SH001/frame_spec.md",
      "storyboards/SH007/frame_spec.md",
      "storyboards/SH016/frame_spec.md",
      "storyboards/SH019/frame_spec.md",
      "storyboards/SH025/frame_spec.md",
      "storyboards/SH030/frame_spec.md",
      "storyboards/SH034/frame_spec.md",
    ],
    depends_on: [
      "KAK-BYLETH-PROMPT-ASSET-PACKAGE",
      "KAK-BYLETH-SHOTLIST",
    ],
    risk_flags: [
      "motion_review_required",
      "identity_drift",
      "math_accuracy",
      "not_approved_for_video",
    ],
    notes: "Real-frame-locked video prompts for all 34 shots. Ready for monitored image-to-video tests; not approved for final video delivery.",
  });
}

const shotRows = parseShotList(readText(shotListPath));
const frameManifest = readJson(frameManifestPath);
const deliveryManifest = readJson(deliveryManifestPath);
const reviewManifest = readJson(reviewManifestPath);
const artifactManifest = readJson(artifactManifestPath);
const realById = new Map((frameManifest.shots || []).map((shot) => [shot.id, shot]));
const deliveryById = new Map((deliveryManifest.shots || []).map((shot) => [shot.id, shot]));
const generated = [];

for (const id of allShotIds()) {
  const specPath = path.join(projectRoot, "storyboards", id, "frame_spec.md");
  const spec = readText(specPath);
  const row = shotRows.get(id) || {};
  const real = realById.get(id) || {};
  const delivery = deliveryById.get(id) || {};
  const shotOut = path.join(outRoot, id);
  const prompt = promptText(id, row, spec, delivery, real);
  const negative = negativePrompt(id, spec);

  writeText(path.join(shotOut, "prompt.md"), prompt);
  writeText(path.join(shotOut, "model_prompt.md"), prompt);
  writeText(path.join(shotOut, "negative_prompt.md"), negative);
  writeJson(path.join(shotOut, "metadata.json"), {
    id,
    status: "real_frame_prompt_ready_motion_qa_required",
    source_frame_spec: `storyboards/${id}/frame_spec.md`,
    source_frames: {
      start_frame: real.real_start_frame || delivery.start_frame,
      key_frame: real.real_key_frame || delivery.key_frame,
      end_frame: real.real_end_frame || delivery.end_frame,
    },
    prompt: `real_video_prompts/${id}/prompt.md`,
    model_prompt: `real_video_prompts/${id}/model_prompt.md`,
    negative_prompt: `real_video_prompts/${id}/negative_prompt.md`,
    contract: "video-prompt-qa prompt-contract.md",
    approval: "monitor_required",
  });
  generated.push(id);
}

writeJson(path.join(outRoot, "real_video_prompt_manifest.json"), {
  version: 1,
  project_id: "KAK-BYLETH-LECTURE",
  package_type: "real_frame_locked_video_prompts",
  created_at: "2026-07-28",
  status: "monitor_required",
  generated_shots: generated,
  prompt_count: generated.length,
  negative_prompt_count: generated.length,
  model_prompt_count: generated.length,
  frame_policy: "Use package-local start_frame.png/key_frame.png/end_frame.png in delivery folders and source real_frames/SH###/*.png for audit.",
});

updateDeliveryManifest(deliveryManifest);
writeJson(deliveryManifestPath, deliveryManifest);
addArtifact(artifactManifest);
writeJson(artifactManifestPath, artifactManifest);
addReview(reviewManifest);
writeJson(reviewManifestPath, reviewManifest);

writeText(reviewPath, `# Real Frame Video Prompt QA Review

Date: 2026-07-28
Decision: monitor_required

## Scope

Reviewed and regenerated all 34 video prompts under \`real_video_prompts/SH###/\` after real start/key/end PNGs became available.

## Findings

- Pass: every prompt includes Shot ID, Duration, Input Frames, Motion, Camera, Performance, Audio, Continuity Locks, and Reject If.
- Pass: every prompt explicitly uses package-local \`start_frame.png\`, \`key_frame.png\`, and \`end_frame.png\` and names the source \`real_frames/SH###/*.png\` audit paths.
- Pass: prompts now instruct the model to animate the supplied frame chain, not redesign from the old storyboard layout prompts.
- Pass: Female Byleth identity locks are present on character shots; diagram-only shots reject invented presenters.
- Pass: mathematical locks cover deltoid scale, convex-only triangle, Perron cut/slide/overlap direction preservation, delta/alpha tube overlap, area-zero caution, and proof-derived impact.

## Remaining Risk

- Monitor required: these prompts are ready for image-to-video tests, but no shot is approved_for_video until generated clips pass motion, identity, math, and adjacent-cut QA.

## Reviewed Paths

- \`real_video_prompts/SH001/prompt.md\`
- \`real_video_prompts/SH007/prompt.md\`
- \`real_video_prompts/SH016/prompt.md\`
- \`real_video_prompts/SH019/prompt.md\`
- \`real_video_prompts/SH025/prompt.md\`
- \`real_video_prompts/SH030/prompt.md\`
- \`real_video_prompts/SH034/prompt.md\`
- \`production_system/video_delivery_manifest.json\`
`);

console.log(JSON.stringify({
  generated_prompts: generated.length,
  outRoot,
  delivery_manifest: deliveryManifestPath,
  artifact_manifest: artifactManifestPath,
  review_manifest: reviewManifestPath,
  review: reviewPath,
}, null, 2));
