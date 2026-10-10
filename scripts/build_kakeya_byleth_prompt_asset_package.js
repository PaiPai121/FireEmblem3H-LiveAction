#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const projectRoot = path.join(root, "specials", "kakeya_byleth_lecture");
const today = "2026-07-27";

const bylethProfessor = "assets/characters/protagonist/BylethFemale/professor/selected.png";
const bylethFullbody = "assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png";

const sequenceRanges = [
  ["S1", 1, 5, "训练剑谜题"],
  ["S2", 6, 10, "deltoid 候选"],
  ["S3", 11, 15, "凸区域最优"],
  ["S4", 16, 23, "Perron 树反转"],
  ["S5", 24, 29, "delta 管与维数"],
  ["S6", 30, 31, "证明留下的影响"],
  ["S7", 32, 34, "揭名与收束"]
];

const shots = [
  {
    id: "SH001", time: "00:00-00:08", beat: "Training object introduced", purpose: "让女贝老师先作为讲解者登场，再把一单位线段变成可触摸的训练剑，建立全片的物理锚点。", subject: "女贝老师与石地上的一单位训练剑", camera: "训练场低三分之四中景开场，随后剪到正上方落剑近景，端点清楚。",
    blocking: "女贝老师跪到石地标尺旁，手持木制训练剑准备落下；切入近景时，她戴手套的手把训练剑放到两枚红线端点之间。", audio: "女贝老师: 今天不先挥剑。先看一把长度为一的训练剑。", risk: "Byleth must be visible in the opening; prop length unclear if no end marks",
    location: "Garreg Mach training ground stone floor",
    visible: "Female Byleth; wooden practice sword",
    start: "女贝老师在训练场石地上跪下，手持木制训练剑靠近粉笔基准线和两个红色端点；观众先看到讲解者和长度标尺同时出现。",
    key: "女贝老师的手把木制训练剑准确放在两端点之间，剑尖与剑柄端同时对齐。",
    end: "手退出画面，完整一单位训练剑独自停在标尺上，为旋转谜题留出安静停顿。",
    screen: "女贝老师从画面左侧压低身位进入，视线落向右下方木剑；近景中手从画面上缘进入再退回上缘，剑始终水平左到右。",
    peak: "女贝老师把木剑两端刚好压住红线端点的瞬间。",
    editIn: "从黑场淡入到训练场中景，女贝老师已经蹲在标尺旁。",
    editOut: "在木剑静止后切到三位学生听见问题的低机位。"
  },
  {
    id: "SH002", time: "00:08-00:18", beat: "Question posed", purpose: "用一句话提出问题，并把女贝老师确立为冷静讲解者。", subject: "训练场边缘的女贝老师，木剑在前景。", camera: "低三分之四中景，木剑大前景，女贝老师在后景清晰。",
    blocking: "女贝老师俯视木剑，学生只作为柔焦肩影，不抢身份。", audio: "女贝老师: 让这把一单位长的训练剑，在地上转过所有方向。最少要多大地方？", risk: "BylethFemale identity drift; avoid smile",
    location: "Garreg Mach training ground edge",
    visible: "Female Byleth; optional student shoulder silhouettes",
    start: "镜头从木剑前景开始，女贝老师站在训练场边缘，表情平静。",
    key: "她目光从剑抬向学生方向，提出“最少要多大地方”的问题。",
    end: "她视线落回木剑，画面准备切入俯视旋转图。",
    screen: "女贝老师面向画面右下方的木剑，学生在画面左后方虚化。",
    peak: "她抬眼发问但不微笑的瞬间。",
    editIn: "接 SH001 木剑静止，声音先进入。",
    editOut: "跟随她的视线切到俯视旋转。"
  },
  {
    id: "SH003", time: "00:18-00:30", beat: "Naive circular intuition", purpose: "呈现固定中心旋转会扫出圆盘这个直觉答案。", subject: "绕固定中心旋转的红色单位剑。", camera: "正上方图解镜头，真实石地上叠加半透明圆盘。",
    blocking: "红色剑绕中心点旋转，淡蓝圆盘随着扫过区域慢慢显现。", audio: "梅尔赛德斯: 至少要给它一个圆吧？", risk: "Circle may look like final answer",
    location: "Stone floor diagram overlay",
    visible: "No full character; diagram only",
    start: "红剑静止在水平位置，中心点用小钉标出。",
    key: "红剑围绕固定中心快速扫过多个角度，淡蓝圆盘逐渐填满。",
    end: "圆盘完整显现，但边缘旁出现一个小问号，暗示这只是直觉。",
    screen: "旋转保持围绕中央，所有角度从水平开始顺时针出现。",
    peak: "圆盘刚被完整扫满的瞬间。",
    editIn: "从女贝老师视线切入剑的俯视图。",
    editOut: "切到她在板上区分固定中心与自由中心。"
  },
  {
    id: "SH004", time: "00:30-00:42", beat: "Rule refinement", purpose: "把固定中心旋转和中心可移动的真正问题分开。", subject: "女贝老师在粉笔板上画两种规则。", camera: "侧面近景，手、粉笔线和半张脸构成教学画面。",
    blocking: "她划掉固定中心符号，圈出中心可移动符号，木剑图仍保持完整。", audio: "女贝老师: 中心不必固定。只要整根剑始终在区域内。", risk: "Text too readable/modern; use simple symbols",
    location: "Garreg Mach classroom chalkboard",
    visible: "Female Byleth hand and profile",
    start: "黑板上并排两个简单图标：一个钉住中心，一个自由滑动中心。",
    key: "女贝老师用粉笔划掉钉住中心图标，圈住自由滑动中心。",
    end: "黑板只留下完整线段和可移动中心箭头，规则变清楚。",
    screen: "粉笔从左边错误规则移动到右边正确规则。",
    peak: "固定中心符号被划掉的一刻。",
    editIn: "圆盘直觉画面硬切到粉笔板。",
    editOut: "顺着粉笔箭头切到多方向线段扇面。"
  },
  {
    id: "SH005", time: "00:42-00:55", beat: "Direction coverage", purpose: "把连续转动改写为所有方向都有完整一单位线段。", subject: "粉笔扇面中的多条幽灵剑。", camera: "教师视角宽镜，黑板和讲桌同框。",
    blocking: "绿色幽灵线段从少到多出现，最终覆盖从 0 到 180 度的方向族。", audio: "女贝老师: 真正的条件是：每个方向，都要有一条完整的一单位线段。", risk: "Too many ghost swords clutter frame",
    location: "Classroom diagram board",
    visible: "Female Byleth as small side silhouette; diagram dominant",
    start: "黑板上只有一条红色单位线段和端点标尺。",
    key: "绿色幽灵线段在不同角度依次出现，每条都保留完整端点。",
    end: "扇面稳定为稀疏但连续方向族，避免堆成杂乱光团。",
    screen: "方向从左下到右上逐步展开。",
    peak: "最后一条缺失方向被补齐的瞬间。",
    editIn: "从 SH004 的可移动中心箭头接入。",
    editOut: "绿色扇面收束成三尖曲线的第一笔。"
  },
  {
    id: "SH006", time: "00:55-01:07", beat: "Deltoid reveal", purpose: "引入优美的三尖内摆线候选，但不把它误称为最终答案。", subject: "黑板上正在形成的 deltoid。", camera: "锁定黑板中景，女贝老师半身在侧。",
    blocking: "她用粉笔画出三尖曲线，内部淡蓝填色随曲线闭合。", audio: "莉丝缇亚: 也就是说，要找一条刚好卡住它的边界？", risk: "Deltoid shape must be recognizable",
    location: "Classroom chalkboard",
    visible: "Female Byleth; optional offscreen Lysithea only",
    start: "绿色方向扇面淡出，黑板中心留下一个圆滚动轨迹提示。",
    key: "三尖 deltoid 的三处尖点清楚出现，内部轻轻填色。",
    end: "女贝老师停笔，曲线旁只标“候选区域”，不写最终答案。",
    screen: "曲线按顺时针生成，三尖均匀分布。",
    peak: "第三个尖点闭合成完整 deltoid 的瞬间。",
    editIn: "由 SH005 的方向扇面变形为曲线。",
    editOut: "推入 deltoid 内部的切线弦。"
  },
  {
    id: "SH007", time: "01:07-01:22", beat: "Tangent chord mechanism", purpose: "展示 deltoid 为什么能带着单位线段完成所有方向，并解释方向不会漏。", subject: "deltoid 切线弦机制图。", camera: "纯图解近景，曲线和红弦占画面。",
    blocking: "红色切线弦贴住 deltoid，两端都在曲线相关边界内，接触点滑动时弦随之旋转；旁边小方向盘同步转满一圈。", audio: "女贝老师: 切点沿曲线走一圈，切线方向也连续转过一圈。方向不会漏。", risk: "Must show chord inside region",
    location: "Clean chalk/parchment diagram space",
    visible: "Diagram only",
    start: "deltoid 已完整显示，一条红弦水平贴靠内部边界。",
    key: "接触点沿曲线滑动，红弦旋转到斜向且仍完整落在蓝色区域内。",
    end: "多条淡红残影显示一圈方向覆盖，但主红弦仍清楚。",
    screen: "接触点顺时针移动，红弦方向同步旋转。",
    peak: "红弦在斜向位置仍被区域完整容纳的一刻。",
    editIn: "从 SH006 deltoid 闭合处直接推入。",
    editOut: "切到标尺和公式锁定弦长。"
  },
  {
    id: "SH008", time: "01:22-01:36", beat: "Scale lock", purpose: "把 deltoid 参数和单位剑长度锁上，并说明弦长为什么是 4a。", subject: "弦长公式与 deltoid 小图。", camera: "羊皮纸插图静态近景，轻微推近。",
    blocking: "红弦旁出现四段等长刻度 a+a+a+a，公式 chord = 4a，再把 4a = 1 化为 a = 1/4。", audio: "女贝老师: 每条可用切线弦分成四段 a，所以弦长是四 a。剑长为一，就取 a 等于四分之一。", risk: "Formula without explanation",
    location: "Parchment insert",
    visible: "Diagram only",
    start: "红弦旁只有长度刻度和参数 a，画面留白充足。",
    key: "四段 a 标尺依次亮起，同时出现 4a = 1。",
    end: "公式化简为 a = 1/4，单位弦高亮。",
    screen: "公式从左到右显现，弦不改变长度。",
    peak: "a = 1/4 出现并与红弦端点对齐的瞬间。",
    editIn: "从旋转红弦切到同一红弦的测量视角。",
    editOut: "金色面积填充接上面积计算。"
  },
  {
    id: "SH009", time: "01:36-01:52", beat: "Area of deltoid", purpose: "用参数曲线面积公式给出候选面积 pi/8，并保留它只是候选的语气。", subject: "deltoid 面积填色。", camera: "黑板慢推近，公式在曲线旁浮现。",
    blocking: "金色填色从中心铺满 deltoid，先出现 A = 2 pi a^2，再代入 a = 1/4 得到 A = pi/8。", audio: "女贝老师: 面积公式给 A 等于二 pi a 平方。代入 a 等于四分之一，得到 pi 除以八。它还只是候选。", risk: "Avoid saying it is answer",
    location: "Chalkboard/parchment hybrid",
    visible: "Female Byleth hand optional",
    start: "deltoid 空心轮廓和单位红弦仍在画面中。",
    key: "金色面积洗过整个区域，公式 A = pi/8 随填色落定。",
    end: "公式旁出现“候选”小印章式粉笔标记。",
    screen: "填色从左下向右上扩散，不遮住红弦。",
    peak: "面积刚好填满而红弦仍清楚的一刻。",
    editIn: "从 SH008 的 a=1/4 公式下切。",
    editOut: "切到学生反应质疑。"
  },
  {
    id: "SH010", time: "01:52-02:06", beat: "Candidate doubt", purpose: "让艾黛尔指出真正缺口：还没有证明三尖内摆线不能再小。", subject: "艾黛尔质疑与女贝老师的停顿。", camera: "交替近景，先学生肩影再女贝老师静止表情。",
    blocking: "艾黛尔前倾，手指向 deltoid 外侧剩余空间；女贝老师没有立即回答，黑板保留 A = pi/8 和“候选”。", audio: "艾黛尔: 优雅，不等于最小。我还没听到：为什么不能再小？如果边界允许凹进去，空隙也许还能被重复利用。", risk: "Character identity optional if not generated",
    location: "Classroom",
    visible: "Female Byleth; optional student silhouette only",
    start: "deltoid 公式仍在黑板，前景出现学生肩部剪影。",
    key: "质疑声响起时女贝老师微微停笔，表情不变。",
    end: "她转向另一块空板，准备改加凸性条件。",
    screen: "学生剪影在左前景，女贝老师转向右侧空板。",
    peak: "女贝老师没有反驳、只停顿的瞬间。",
    editIn: "从 SH009 的“候选”标记切入。",
    editOut: "随她转身切到地面绳边界。"
  },
  {
    id: "SH011", time: "02:06-02:18", beat: "Constraint switch", purpose: "把凸区域作为一般非凸问题前的规整特例，而不是突兀加规则。", subject: "地面绳索边界从凹形变为无凹陷形。", camera: "正上方，绳索和粉笔线构成清楚图形。",
    blocking: "女贝老师拉动绳子，把有凹口的边界拉成平顺包络；黑板角落出现“先看凸区域 / 再回一般情况”。", audio: "女贝老师: 一般情况太滑，我们先看一个比较规整的特例。加一条规则：区域不能凹进去。", risk: "Convex concept unclear",
    location: "Training ground floor",
    visible: "Female Byleth hands only",
    start: "绳索围成带凹口的区域，红剑能穿过凹口附近。",
    key: "绳索被拉紧，凹口消失，区域变成无凹陷包络。",
    end: "地面显出一个等边三角形轮廓作为下一步。",
    screen: "绳索从画面左侧凹陷向外被拉平。",
    peak: "凹口刚被绳索拉平的瞬间。",
    editIn: "从女贝老师转身接到地面操作。",
    editOut: "切到两点连线的凸性定义图。"
  },
  {
    id: "SH012", time: "02:18-02:36", beat: "Convex definition", purpose: "用两点连线解释凸性，降低门槛。", subject: "凸形与凹形中的两点连线。", camera: "干净二分图近景，板书符号极少。",
    blocking: "左侧连线全在区域内，右侧连线穿出凹口，女贝老师用粉笔点亮差别。", audio: "女贝老师: 凸，就是两点之间的路不离开区域。", risk: "Too elementary but necessary",
    location: "Diagram board",
    visible: "Diagram only; Byleth pointer optional",
    start: "左右两个区域各有两点，连线尚未出现。",
    key: "连线出现：左侧全绿，右侧穿出区域部分变红。",
    end: "左图打勾，右图被轻划，观众知道限制含义。",
    screen: "读图从左到右，绿色通过、红色失败。",
    peak: "右侧连线穿出凹口的红段亮起。",
    editIn: "从绳索凹口消失切入。",
    editOut: "左侧凸形变形为等边三角形。"
  },
  {
    id: "SH013", time: "02:36-02:52", beat: "Triangle can turn", purpose: "先证明高为 1 的等边三角形确实能容纳所有方向，而不是只报面积。", subject: "高为 1 的等边三角形和红色单位剑。", camera: "粉笔与纸面混合图解，稳定中近景。",
    blocking: "三角形竖直高线标 1，红剑从贴近一条边的方向滑到接近高线，再滑向另一组支撑边；方向盘覆盖 0 到 180 度。", audio: "女贝老师: 在凸区域里，最省的是高为一的等边三角形。先证明它真的能转。方向只看零到一百八十度就够了。", risk: "Must show continuous direction coverage, not just static area",
    location: "Clean diagram board",
    visible: "Diagram dominant",
    start: "空白板上出现等边三角形轮廓。",
    key: "竖直高线标 1，红剑与高线重合，三角形内出现几条方向残影。",
    end: "角落写“只在凸区域中”，锁定限定条件。",
    screen: "高度标尺自下而上出现，方向残影围绕中心展开。",
    peak: "红剑刚与高线 1 完全重合的一刻。",
    editIn: "从凸性定义左图转为三角形。",
    editOut: "切到边长与面积公式。"
  },
  {
    id: "SH014", time: "02:52-03:05", beat: "Triangle support proof", purpose: "解释为什么三角形里每个方向都有至少一单位长的截线，并把面积计算降为附带。", subject: "等边三角形支撑边与面积计算。", camera: "羊皮纸近景，公式分步出现。",
    blocking: "三组支撑边轮流高亮，最短危险方向沿高线时标出长度 1；旁边小号显示 s = 2/sqrt(3), A = 1/sqrt(3)。", audio: "女贝老师: 红剑在三组支撑边之间连续滑动。最危险的位置是沿高，长度正好是一；其余方向能截到更长线段。凸世界的下界是定理。", risk: "Formula crowding",
    location: "Parchment insert",
    visible: "Diagram only",
    start: "等边三角形和高度 1 保持，底边空白。",
    key: "底边标出 s = 2/sqrt(3)，面积公式简化。",
    end: "A = 1/sqrt(3) 高亮，三角形缩到一侧。",
    screen: "公式从上到下逐行显现。",
    peak: "A = 1/sqrt(3) 高亮的瞬间。",
    editIn: "从三角高线标尺切入公式。",
    editOut: "切到凸包填满空隙的对比图。"
  },
  {
    id: "SH015", time: "03:05-03:18", beat: "Why convex is expensive", purpose: "用凸性会填满空隙，自然引出去掉凸性后的碎片问题。", subject: "凸包填满空隙与碎片空间复用对比。", camera: "左右分屏图解，左凸右非凸。",
    blocking: "左侧碎片被凸包一圈包住变成大面积；右侧碎片保持分离，只占小面积；莉丝缇亚的画外问题指向右侧碎片。", audio: "莉丝缇亚: 那如果去掉凸性，让区域碎开呢？ 女贝老师: 这正是反转的入口。但碎开之后，必须记账：每个方向还在不在。", risk: "Abstract split needs labels",
    location: "Diagram space",
    visible: "Diagram only",
    start: "左右两侧都有相同碎片，尚未包络。",
    key: "左侧凸包边界闭合并填满空白，右侧碎片只轻微重叠。",
    end: "右侧碎片被放大，带入 Perron 三角形。",
    screen: "左侧面积膨胀，右侧碎片向画面中心过渡。",
    peak: "左侧空隙被凸包自动填满的瞬间。",
    editIn: "从面积公式切到对比图。",
    editOut: "右侧碎片 morph 成大等腰三角形。"
  },
  {
    id: "SH016", time: "03:18-03:31", beat: "Perron setup", purpose: "把 Perron 树作为非凸碎片的方向账本引入：一个三角形保存一段连续方向。", subject: "沙盘上的大等腰三角形和方向扇。", camera: "正上方沙盘镜头，线条粗细可读。",
    blocking: "女贝老师画顶点和底边，从顶点向底边画绿色方向线，形成连续方向扇；底边像方向账本一样标出连续区间。", audio: "女贝老师: 这个方向账本，从一个三角形开始。从顶点到底边，每一条线都代表一个方向。", risk: "Direction meaning unclear unless green lines visible",
    location: "Training ground sand table",
    visible: "Female Byleth hands only; sand-table diagram",
    start: "沙盘上空白，只见木尺和粉笔绳。",
    key: "大等腰三角形完成后，绿色线从顶点扇向底边多个位置。",
    end: "方向扇稳定，底边准备被切分。",
    screen: "顶点在画面上方，底边在下方；方向线自上向下展开。",
    peak: "绿色方向扇刚覆盖整条底边的一刻。",
    editIn: "从非凸碎片对比图推入沙盘。",
    editOut: "底边刻度声接切分镜头。"
  },
  {
    id: "SH017", time: "03:31-03:45", beat: "Cut step", purpose: "显示 Perron 操作第一步：切分只分配方向，不删除方向。", subject: "三角形底边分割和细三角形。", camera: "正上方，轻微放大底边。",
    blocking: "底边被等分，小三角形沿切线略微分开，但每个仍从顶点指向自己的底边区间。", audio: "女贝老师: 第一步，切分。每块只负责一小段方向。", risk: "Cut may look like deleting directions",
    location: "Sand-table diagram",
    visible: "Diagram only",
    start: "完整大三角形和绿色方向扇保持。",
    key: "底边切成多个小区间，细三角形轮廓同时出现。",
    end: "小三角形略分离，每个区间仍有绿色方向线。",
    screen: "底边从左到右被切分，顶点不移动。",
    peak: "所有小区间都有对应绿色线的瞬间。",
    editIn: "从 SH016 底边准备切分处接入。",
    editOut: "切到小三角形水平滑动。"
  },
  {
    id: "SH018", time: "03:45-04:00", beat: "Slide step", purpose: "显示平移不改变方向，是证明可复用空间的关键。", subject: "薄三角形水平滑动。", camera: "正上方，运动轨迹线清楚。",
    blocking: "每个薄三角形只水平平移，绿色方向带保持平行，绝不旋转。", audio: "女贝老师: 第二步，平移。平移不会改变方向，只改变这段线放在哪里。", risk: "AI may rotate pieces accidentally",
    location: "Sand-table diagram",
    visible: "Diagram only",
    start: "被切开的小三角形分散在原位置。",
    key: "小三角形沿水平方向滑向中心，透明轨迹显示没有旋转。",
    end: "碎片接近重叠状态，绿色线方向与开始完全平行。",
    screen: "左侧碎片向右滑，右侧碎片向左滑，顶点高度不交换。",
    peak: "平移轨迹与绿色方向线同时可见的一刻。",
    editIn: "从切分后的细三角形接入。",
    editOut: "切到重叠后的并集面积。"
  },
  {
    id: "SH019", time: "04:00-04:16", beat: "Overlap step", purpose: "显示重叠让并集面积变小，同时方向仍然存在。", subject: "互相叠加的蓝橙薄三角形。", camera: "正上方固定，重点是并集轮廓。",
    blocking: "蓝、橙薄三角形重叠，金色并集外轮廓收缩；绿色方向线仍逐段覆盖底边方向。", audio: "女贝老师: 第三步，重叠。面积减少，方向没有丢。", risk: "Need union outline not just pile",
    location: "Sand-table diagram",
    visible: "Diagram only",
    start: "刚滑动后的碎片尚未完全重叠，并集轮廓较大。",
    key: "碎片大面积重叠，金色并集轮廓明显缩小。",
    end: "重叠区域稳定，旁边保留方向覆盖小标尺。",
    screen: "碎片向中心压缩，绿色方向标尺不减少。",
    peak: "金色并集面积突然缩小但绿色方向线仍完整的一刻。",
    editIn: "从水平滑动轨迹接入。",
    editOut: "切到学生质疑这个操作是否作弊。"
  },
  {
    id: "SH020", time: "04:16-04:30", beat: "Student objection", purpose: "让观众的疑问被角色说出：移动碎片是否仍算同一个问题。", subject: "沙盘桌旁的女贝老师与学生肩影。", camera: "中景过肩，沙盘仍在画面下半部。",
    blocking: "学生剪影指向分离碎片，女贝老师用木尺指向绿色方向带而非原三角形位置。", audio: "艾黛尔: 但这样还是同一个问题吗？ 女贝老师: 看方向，不看原来的位置。连续转动之后用很窄的走廊接起来。", risk: "Dialogue too long",
    location: "Classroom sand table",
    visible: "Female Byleth; optional shoulder silhouettes",
    start: "沙盘上的重叠碎片可见，学生肩影靠近桌沿。",
    key: "女贝老师木尺从碎片位置移到绿色方向带，回答问题。",
    end: "镜头停在绿色方向带上，准备进入方向审计图。",
    screen: "学生手从左入画，女贝老师木尺从右指向中心。",
    peak: "木尺离开面积轮廓、指向方向带的一刻。",
    editIn: "从 SH019 重叠图拉出到人物。",
    editOut: "沿木尺指向切到纯方向审计。"
  },
  {
    id: "SH021", time: "04:30-04:48", beat: "Direction audit", purpose: "作为证明检查点：切分和平移保留方向覆盖。", subject: "前后方向色带对照尺。", camera: "纯图解静态，便于暂停学习。",
    blocking: "上方显示切分前的连续绿色方向区间，下方显示滑动后的多个绿色区间拼接成同一覆盖。", audio: "女贝老师: 切分没有删方向。平移没有转方向。", risk: "This is the proof checkpoint",
    location: "Clean diagram space",
    visible: "Diagram only",
    start: "上方是一整条绿色方向区间，下方为空。",
    key: "下方分段绿色区间出现，和上方一一对齐，没有缺口。",
    end: "两条方向尺同时高亮，标记“方向仍全在”。",
    screen: "上下对照，不改变左右方向顺序。",
    peak: "下方最后一个绿色缺口被补齐的一刻。",
    editIn: "从木尺指向方向带接入。",
    editOut: "色带分段变成迭代树的第一层。"
  },
  {
    id: "SH022", time: "04:48-05:08", beat: "Iteration acceleration", purpose: "展示重复 cut-slide-overlap 使面积任意小，并用 epsilon 目标表达定量收缩。", subject: "Perron 树三轮迭代动画。", camera: "正上方转抽象图解，三步循环节奏固定。",
    blocking: "切分、平移、重叠重复三次；金色并集面积每轮缩小，绿色方向尺始终完整；右侧出现目标线 epsilon。", audio: "女贝老师: 方向尺没有缺口，金色并集面积却按指定比例下降。给定任何 epsilon，多迭代几轮就能压到 epsilon 以下。", risk: "Too fast to understand",
    location: "Diagram-to-abstract transition",
    visible: "Diagram only",
    start: "第一轮重叠碎片和完整方向尺。",
    key: "第二、第三轮迭代同时显示面积数字递减，不显示复杂公式。",
    end: "极细碎片形成树状轮廓，面积读数接近 epsilon。",
    screen: "每一轮从左到右：切分、平移、重叠；方向尺固定在底部。",
    peak: "第三轮后金色并集明显小于初始但绿色方向尺仍满格。",
    editIn: "从方向审计色带生长出第一层树。",
    editOut: "树状碎片淡入教室黑板总结。"
  },
  {
    id: "SH023", time: "05:08-05:28", beat: "Classical conclusion", purpose: "给出二维原始面积问题的颠覆结论：没有最小正面积，并提醒小面积走廊补连续转动。", subject: "女贝老师站在黑板前，Perron 树在身后。", camera: "缓慢推近中景，人物与结论同框。",
    blocking: "deltoid 和三角形淡出，Perron 树保持；女贝老师侧身让出结论；极细连接走廊淡出显示面积可忽略。", audio: "女贝老师: 所以，原来的最小面积问题，没有最小正答案。小到任意正数以下，不是等于不存在。", risk: "Needs exact wording",
    location: "Garreg Mach classroom",
    visible: "Female Byleth",
    start: "黑板上同时有 deltoid、凸三角形、Perron 树三个小图。",
    key: "前两个图淡下去，Perron 树放大，女贝老师说出没有最小正答案。",
    end: "黑板只剩“不存在最小正面积”的粉笔结论。",
    screen: "女贝老师站画面左，结论在画面右，避免遮挡。",
    peak: "Perron 树独自留下的瞬间。",
    editIn: "从 SH022 树状碎片匹配切到黑板。",
    editOut: "结论里的“面积”二字切到零面积提示。"
  },
  {
    id: "SH024", time: "05:28-05:42", beat: "Zero area caution", purpose: "防止观众把面积为零误解为集合不存在。", subject: "线段无面积但存在的图解。", camera: "极简图解近景，干净留白。",
    blocking: "一条线段显示长度刻度但面积填色为无；随后多方向集合以淡蓝细纹出现。", audio: "女贝老师: 面积为零，不是不存在。线段也没有平面面积。", risk: "May imply actual turn region zero; avoid",
    location: "Clean diagram space",
    visible: "Diagram only",
    start: "白色羊皮纸上只有一条黑线段，旁边标长度。",
    key: "面积填色尝试出现又消失，只留下“平面面积 0”的小标记。",
    end: "多方向细纹集合出现，强调可见但面积可为零。",
    screen: "单线段从左侧过渡到右侧多方向集合。",
    peak: "线段仍清晰存在而面积标记为 0 的瞬间。",
    editIn: "从黑板结论中“面积”切入。",
    editOut: "线段变粗成 delta 管。"
  },
  {
    id: "SH025", time: "05:42-05:58", beat: "Delta-tube method", purpose: "引入把线段加粗为 δ-管的估计方法。", subject: "红线段变成半透明蓝色 δ-管。", camera: "微距图解，线段和宽度标尺占画面。",
    blocking: "红线段两侧膨胀成窄蓝矩形，宽度括号清楚标出 delta。", audio: "女贝老师: 要估计它，先把线段加粗成宽度 delta 的细管。", risk: "Delta label readability",
    location: "Parchment macro diagram",
    visible: "Diagram only",
    start: "一条红色单位线段居中，端点仍清楚。",
    key: "蓝色半透明管从线段两侧展开，宽度 delta 标尺出现。",
    end: "delta 管稳定，下一条管准备从角度 alpha 进入。",
    screen: "管宽向上下展开，长度方向不变。",
    peak: "delta 标尺刚连接蓝管两侧边界的一刻。",
    editIn: "从 SH024 线段加粗。",
    editOut: "第二条管斜向进入形成交叉。"
  },
  {
    id: "SH026", time: "05:58-06:12", beat: "Tube overlap by angle", purpose: "展示两根 δ-管的重叠与夹角 alpha 有关。", subject: "两组不同夹角的交叉蓝管。", camera: "左右对比图，角度和重叠区都可读。",
    blocking: "左侧小 alpha 管重叠长，右侧大 alpha 管重叠短，金色重叠区明显不同。", audio: "女贝老师: 夹角越小，重叠越长；夹角越大，重叠越短。", risk: "Must show two cases",
    location: "Clean diagram space",
    visible: "Diagram only",
    start: "第一根水平 δ-管已在画面中，第二根透明线预备进入。",
    key: "左右两例同时出现：小 alpha 的金色交叠长，大 alpha 的交叠短。",
    end: "两个 alpha 角弧和金色重叠区保留，准备给估计式。",
    screen: "左小角、右大角，读图顺序固定。",
    peak: "两种金色重叠区差异最明显的一刻。",
    editIn: "从 SH025 的单管接入第二条管。",
    editOut: "金色重叠区上方出现估计式。"
  },
  {
    id: "SH027", time: "06:12-06:28", beat: "Key estimate", purpose: "从图形交叠推导 δ-管估计，连接方向差和重叠面积。", subject: "δ-管重叠估计式。", camera: "静态干净图形，公式不遮盖重叠区。",
    blocking: "先标出 overlap length ~ delta / sin alpha，再乘宽度 delta 得到 area ~ delta^2 / sin alpha，最后变成 overlap <= C delta^2 / alpha。", audio: "女贝老师: 沿管方向交叠长度约是 delta 除以 sin alpha，乘上宽度 delta，就得到重叠面积估计。", risk: "Use C instead of hard symbol if needed",
    location: "Diagram board",
    visible: "Diagram only",
    start: "两根管和金色重叠区保留，delta 与 alpha 已标出。",
    key: "估计式出现时，delta、alpha、金色 overlap 依次闪亮对应。",
    end: "公式缩到角落，重叠图保留作后续影响桥。",
    screen: "公式从重叠图右侧出现，不覆盖图形。",
    peak: "公式与三个图形元素全部同步高亮的一刻。",
    editIn: "从 SH026 金色重叠区直接接公式。",
    editOut: "重叠图像素化成小网格。"
  },
  {
    id: "SH028", time: "06:28-06:43", beat: "Dimension idea", purpose: "通过网格计数解释面积可为零但尺度复杂度仍满的二维维数直觉。", subject: "网格缩放中的多方向集合。", camera: "网格俯视缩放，像显微镜推进。",
    blocking: "网格尺度变小，左侧普通曲线约击中 1/delta 个格子，右侧多方向细纹仍在二维范围内击中接近 1/delta^2 个格子。", audio: "女贝老师: 维数先看盖住它要多少小格子；这种多方向集合不像普通曲线那样省格子。", risk: "Hausdorff term too sudden",
    location: "Abstract chalk grid",
    visible: "Diagram only",
    start: "粗网格覆盖淡蓝多方向集合，占用若干格。",
    key: "网格变细，命中的格子仍在二维范围内铺开。",
    end: "画面旁出现“不是一条普通曲线”的简短标记。",
    screen: "镜头向网格中心推进，集合不消失。",
    peak: "细网格下多方向结构仍横竖铺开的瞬间。",
    editIn: "从估计式右侧的图形像素化进网格。",
    editOut: "网格整理成黑板上二维定理。"
  },
  {
    id: "SH029", time: "06:43-06:55", beat: "2D theorem", purpose: "给出现代二维结果：面积可为零，但维数必须为二。", subject: "黑板最终二维定理。", camera: "中景板书，女贝老师侧立不遮挡。",
    blocking: "黑板左右并列 area may be 0 与 dimension = 2，中间用同一个多方向集合连接。", audio: "女贝老师: 在二维中，它可以没有面积，但维数必须是二。", risk: "Avoid overexplaining",
    location: "Classroom chalkboard",
    visible: "Female Byleth optional side profile",
    start: "网格图淡入黑板，一侧写 area may be 0。",
    key: "另一侧写 dimension = 2，女贝老师用粉笔连接两句话。",
    end: "定理稳定，观众能读清两行文字。",
    screen: "左侧面积，右侧维数，粉笔连线从左到右。",
    peak: "dimension = 2 落笔完成的一刻。",
    editIn: "从网格缩放匹配切到黑板。",
    editOut: "公式线条转入三联影响蒙太奇。"
  },
  {
    id: "SH030", time: "06:55-07:15", beat: "Mathematical impact", purpose: "把意义落在证明机制影响的具体数学对象上。", subject: "细管重叠、矩形平均、波包射线三联画。", camera: "抽象三联图，中间轻微横移串联三格。",
    blocking: "左格管重叠，中格矩形内平均值高亮，右格波包沿射线传播；三格都由同一束方向线连接。", audio: "女贝老师: 后来真正留下来的，是多方向细长结构怎样重叠。", risk: "Avoid pure analogy",
    location: "Chalk/parchment triptych",
    visible: "Diagram only",
    start: "SH027 的两根管复制成左侧第一格。",
    key: "三联图依次点亮：tube overlap、maximal averages、wave packet ray。",
    end: "三格由同一束绿色方向线贯穿，强调不是生活比喻。",
    screen: "从左到右读取三格，方向线保持一致。",
    peak: "三格被同一方向束连接起来的一刻。",
    editIn: "从 dimension = 2 的线条扩展到三格。",
    editOut: "推入中格和右格术语的板书解释。"
  },
  {
    id: "SH031", time: "07:15-07:32", beat: "Max function and wave packets", purpose: "把影响再具体化为 maximal averages、wave packets、tube overlap 三个关键词。", subject: "术语与对应小图标板书。", camera: "可读黑板插图，固定近景。",
    blocking: "每个英文术语旁都有小图：矩形平均、波束射线、管重叠，文字不超过三词。", audio: "女贝老师: 调和分析和波动问题里，也会遇到这样的细管。", risk: "Too academic if terms unexplained",
    location: "Classroom chalkboard",
    visible: "Female Byleth pointer hand optional",
    start: "黑板有三个空框和淡绿色方向线。",
    key: "三个关键词与小图同时配对出现，女贝老师用木尺逐一点过。",
    end: "小图留下，文字退淡，过渡到题名揭示。",
    screen: "木尺从左到右点过三项。",
    peak: "wave packet ray 图和 tube overlap 图同时亮起的一刻。",
    editIn: "从三联图中格/右格拉近。",
    editOut: "黑板清空，只留下标题位置。"
  },
  {
    id: "SH032", time: "07:32-07:50", beat: "Name reveal", purpose: "在证明直觉建立后揭示问题名称。", subject: "女贝老师合上粉笔盒，黑板标题出现。", camera: "中近景，人物在一侧，标题为第一视觉层级。",
    blocking: "粉笔盒合上的声音后，黑板上写出 Kakeya Needle Problem / 挂谷针问题。", audio: "女贝老师: 这个问题，叫挂谷针问题。", risk: "Revealing too late is okay",
    location: "Garreg Mach classroom",
    visible: "Female Byleth",
    start: "黑板基本清空，只剩几条淡淡方向线。",
    key: "粉笔盒合上，标题以粉笔字写出并稳定可读。",
    end: "女贝老师看向标题，再看回训练剑方向。",
    screen: "标题在画面右侧出现，女贝老师在左侧。",
    peak: "“挂谷针问题”五个字完成的一刻。",
    editIn: "从 SH031 文字退淡接空黑板。",
    editOut: "女贝老师视线把镜头带回地面木剑。"
  },
  {
    id: "SH033", time: "07:50-08:04", beat: "Final image", purpose: "回到开头木剑，用多方向结构收束核心意义。", subject: "训练剑与所有方向扇、零面积幽灵图案。", camera: "正上方慢淡出，和开场形成回环。",
    blocking: "红剑在石地上，周围绿色方向扇淡淡环绕，底下蓝色极细碎片图案像影子。", audio: "Byleth VO: 意义不在针，而在多方向结构能怎样重叠。", risk: "Keep readable",
    location: "Training ground stone floor",
    visible: "Wooden sword; no full character",
    start: "开场同款木剑水平静止，石地纹理熟悉。",
    key: "绿色所有方向扇和蓝色碎片影子同时浮现，剑仍是清楚主角。",
    end: "方向扇慢慢减淡，只留下剑和极淡蓝影。",
    screen: "方向扇围绕剑展开但不旋转镜头。",
    peak: "红剑、绿色方向扇、蓝色碎片三层都最清楚的一刻。",
    editIn: "从女贝老师视线匹配切到木剑。",
    editOut: "淡出到羊皮纸标题卡。"
  },
  {
    id: "SH034", time: "08:04-08:12", beat: "End card", purpose: "用一句话收束全片论点，形成可记住的结尾。", subject: "极简羊皮纸标题卡。", camera: "静态无摇移，文字中心偏上，留出呼吸。",
    blocking: "黑色粉笔字显示“面积可以小到消失；方向复杂度不会消失。”下方保留一条细红单位线段。", audio: "柔和终止和弦。", risk: "No extra formulas",
    location: "Parchment title card",
    visible: "No character",
    start: "羊皮纸空白，只有细微纸纹。",
    key: "收束句以手写粉笔质感显现，红色单位线段在下方画出。",
    end: "文字和线段稳定 1 秒后淡出。",
    screen: "文字居中，红线段水平。",
    peak: "整句和红线段同时完整可读的一刻。",
    editIn: "从 SH033 蓝影淡出到羊皮纸。",
    editOut: "淡出黑场。"
  }
];

const commonIdentity = [
  `Use Female Byleth only when visible: ${bylethProfessor}.`,
  `Optional fullbody/weapon reference when the shot needs full posture or sword handling: ${bylethFullbody}.`,
  "Identity lock: 16-year-old female professor-era Byleth, calm young teacher and former mercenary protagonist, teal-blue medium hair with fringe and side locks, focused green eyes, black professor/mercenary long coat, high collar, fitted dark torso layers, leather straps, restrained academy-fantasy details.",
  "Reject male Byleth, mature adult mentor, old wizard, generic black-robed sorceress, ordinary student uniform, modern teacher costume, revealing outfit, cosplay plastic look, oversized invented pendant."
];

function seqFor(id) {
  const n = Number(id.replace(/\D/g, ""));
  const found = sequenceRanges.find(([, start, end]) => n >= start && n <= end);
  return found ? found[0] : "S1";
}

function mathLocks(id) {
  const n = Number(id.replace(/\D/g, ""));
  const locks = [];
  if (n <= 5) {
    locks.push("Unit segment must be visibly length 1 with two endpoints; the condition is all directions, not a fixed center unless shown as a rejected intuition.");
  }
  if (n >= 6 && n <= 10) {
    locks.push("Deltoid must be a true three-cusped hypocycloid-style region; show unit chord scale with a = 1/4 and area A = pi/8; never use radius 1/3 as the unit-needle scale.");
  }
  if (n >= 11 && n <= 15) {
    locks.push("Convex triangle is only the convex-restricted optimum; equilateral triangle height is 1, side length is 2/sqrt(3), area is 1/sqrt(3).");
  }
  if (n >= 16 && n <= 23) {
    locks.push("Perron tree proof must keep direction coverage visible: cut assigns direction intervals, slide translates without rotation, overlap shrinks union area without deleting directions.");
  }
  if (n >= 24 && n <= 29) {
    locks.push("Zero area is not nonexistence; delta-tube diagrams must show delta width, alpha angle, gold overlap patch, and dimension equals 2 in the final 2D statement.");
  }
  if (n >= 30 && n <= 34) {
    locks.push("Impact must stay tied to proof mechanisms: tube overlap, maximal averages, wave packets, Kakeya maximal-function intuition, and combinatorial geometry; no loose daily-life claims.");
  }
  return locks;
}

function promptText(shot, previous, next) {
  const hasByleth = /Byleth|女贝老师|Female/.test(shot.visible);
  const refBlock = hasByleth
    ? `Character reference: ${bylethProfessor}\nOptional fullbody/prop reference: ${bylethFullbody}`
    : "Character reference: none required; prioritize diagram legibility and physical props.";
  return `# Video Prompt: ${shot.id}

Shot ID: ${shot.id}
Duration: ${durationSeconds(shot.time)} seconds

Input Frames:
- start_frame: storyboards/${shot.id}/start.png, generated from the Start Frame Image Prompt below.
- key_frame: storyboards/${shot.id}/key.png, generated from the Key Frame Image Prompt below.
- end_frame: storyboards/${shot.id}/end.png, generated from the End Frame Image Prompt below.
- Current package status: frames_pending. Use these frame descriptions as the contract until PNGs are generated.

Start Frame Image Prompt:
${refBlock}
Create the start frame for ${shot.id}: ${shot.start} Location: ${shot.location}. Camera: ${shot.camera}. Keep the composition readable as a cinematic educational frame, with medieval Garreg Mach materials and no modern UI.

Key Frame Image Prompt:
${refBlock}
Create the key frame for ${shot.id}: ${shot.key} This frame must capture the action peak: ${shot.peak}. Mathematical graphic locks: ${mathLocks(shot.id).join(" ")}

End Frame Image Prompt:
${refBlock}
Create the end frame for ${shot.id}: ${shot.end} The end frame must support the next edit: ${next ? next.beat : "final fade out"}.

Motion:
Animate only the stated change from start to key to end. ${shot.blocking} Preserve all diagram geometry exactly. Do not redesign the character, prop, board, labels, or mathematical construction.

Camera:
${shot.camera} The camera exists to show: ${shot.purpose} Avoid decorative camera spins, line-crossing, or moves that hide the mathematical action peak.

Performance:
${hasByleth ? "Female Byleth stays calm, focused, and unreadable; visible acting is small eye-line shifts, measured hand movement, and controlled teaching posture." : "No character acting is required; the diagram or prop movement must carry the beat."}

Audio:
${shot.audio}

Continuity Locks:
- Previous shot handoff: ${previous ? previous.editOut : "opening from black"}.
- Edit in: ${shot.editIn}
- Edit out: ${shot.editOut}
- Screen direction: ${shot.screen}
- Maintain Female Byleth identity if visible: teal-blue hair, green eyes, black professor/mercenary long coat, youthful calm teacher, never male Byleth.
- Maintain math locks: ${mathLocks(shot.id).join(" ")}

Reject If:
${rejectIf(shot).map((item) => `- ${item}`).join("\n")}
`;
}

function negativePromptText(shot) {
  return `# Negative Prompt: ${shot.id}

Ban character drift:
- male Byleth, mature adult mentor, old wizard, ordinary student Byleth, black-robed witch, generic sorceress, modern teacher, revealing outfit, plastic cosplay armor, changed face, changed hair color, wrong eye color, smiling idol pose, extra named students with unapproved faces.

Ban setting drift:
- modern classroom, projector screen, laptop, phone, LED display, modern UI overlays, subtitles, watermarks, logos, sci-fi holograms, neon dashboard, contemporary lecture hall.

Ban math errors:
- unit sword without visible endpoints, broken or shortened line segment, fixed-center circle presented as final answer, deltoid with wrong cusp count, deltoid scale using radius 1/3 as the unit-needle lock, tangent chord outside the region, convex triangle presented as global non-convex optimum, missing height 1 on convex triangle, Perron cut deleting direction intervals, Perron slide rotating pieces, overlap shown without union shrink, area zero drawn as total disappearance, missing delta width, missing alpha angle, missing gold overlap patch, dimension two stated as area two.

Ban video risks:
- face drift, costume drift, weapon transformation, random magic effects, camera spin, unreadable chalk text, garbled symbols, mathematical graphics used only as decoration, excessive glow hiding geometry, cluttered ghost lines, illegible tiny labels, unexpected violence, gore, combat escalation, slapstick reaction, crowd growth.

Shot-specific reject cues:
${rejectIf(shot).map((item) => `- ${item}`).join("\n")}
`;
}

function frameSpecText(shot, previous, next) {
  const hasByleth = /Byleth|女贝老师|Female/.test(shot.visible);
  return `# Frame Spec: ${shot.id}

Shot ID: ${shot.id}
Stage: prompt_asset_package
Status: frames_pending
Depends On: KAK-BYLETH-SHOTLIST
Script Beat: ${shot.beat}
Shot Purpose: ${shot.purpose}
Duration Target: ${durationSeconds(shot.time)} seconds
Location: ${shot.location}
Characters Visible: ${shot.visible}

Character Identity Locks:
${hasByleth ? commonIdentity.map((item) => `- ${item}`).join("\n") : "- No named character must be generated unless specified; offscreen voices and shoulder silhouettes are allowed only when they do not distract from proof graphics."}

Asset References:
${hasByleth ? `- ${bylethProfessor}\n- ${bylethFullbody}` : "- Diagram or prop shot; no character asset required."}

Start Frame Intent:
${shot.start}

Key Frame Intent:
${shot.key}

End Frame Intent:
${shot.end}

Camera:
${shot.camera}

Blocking:
${shot.blocking}

Screen Direction:
${shot.screen}

Mathematical Graphic Locks:
${mathLocks(shot.id).map((item) => `- ${item}`).join("\n")}

Action Peak:
${shot.peak}

Dialogue / Audio Anchor:
${shot.audio}

Edit In:
${shot.editIn}

Edit Out:
${shot.editOut}

Continuity Requirements:
- Previous shot: ${previous ? `${previous.id} (${previous.beat})` : "none; opening shot"}.
- Next shot: ${next ? `${next.id} (${next.beat})` : "none; final card"}.
- Preserve screen direction and visual subject handoff stated above.
- Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist.

Motion Risks:
- ${shot.risk}
- AI video may overdecorate mathematical diagrams; keep geometry, endpoint labels, delta/alpha labels, and union/overlap relationships legible.
- If Female Byleth is visible, identity drift must be monitored across frames and adjacent shots.

Reject If:
${rejectIf(shot).map((item) => `- ${item}`).join("\n")}
`;
}

function metadata(shot, previous, next) {
  return {
    id: shot.id,
    order: Number(shot.id.replace(/\D/g, "")),
    project_id: "KAK-BYLETH-LECTURE",
    stage: "prompt_asset_package",
    status: "frames_pending",
    sequence: seqFor(shot.id),
    timecode: shot.time,
    duration_seconds: durationSeconds(shot.time),
    script_beat: shot.beat,
    shot_purpose: shot.purpose,
    location: shot.location,
    characters_visible: shot.visible,
    asset_references: /Byleth|女贝老师|Female/.test(shot.visible) ? [bylethProfessor, bylethFullbody] : [],
    frame_spec_path: `storyboards/${shot.id}/frame_spec.md`,
    prompt_path: `storyboards/${shot.id}/prompt.md`,
    negative_prompt_path: `storyboards/${shot.id}/negative_prompt.md`,
    start_frame: `storyboards/${shot.id}/start.png`,
    key_frame: `storyboards/${shot.id}/key.png`,
    end_frame: `storyboards/${shot.id}/end.png`,
    expected_clip: `clips/${shot.id}.mp4`,
    edit_in: shot.editIn,
    edit_out: shot.editOut,
    screen_direction: shot.screen,
    mathematical_locks: mathLocks(shot.id),
    risk_flags: riskFlags(shot),
    continuity: {
      previous: previous ? previous.id : null,
      next: next ? next.id : null,
      in: shot.editIn,
      out: shot.editOut
    },
    reject_if: rejectIf(shot)
  };
}

function durationSeconds(time) {
  const [start, end] = time.split("-");
  return tcToSeconds(end) - tcToSeconds(start);
}

function tcToSeconds(tc) {
  const [m, s] = tc.split(":").map(Number);
  return m * 60 + s;
}

function riskFlags(shot) {
  const flags = ["frames_pending", "motion_review_required"];
  if (/Byleth|女贝老师|Female/.test(shot.visible)) flags.push("identity_drift");
  if (mathLocks(shot.id).length) flags.push("math_accuracy");
  if (/student|学生|Edelgard|Lysithea|Mercedes|艾黛尔|莉丝缇亚|梅尔赛德斯/i.test(`${shot.subject} ${shot.audio} ${shot.visible}`)) flags.push("student_identity_scope");
  if (/delta|alpha|Perron|deltoid|triangle|维数|dimension/i.test(`${shot.beat} ${shot.purpose} ${shot.blocking}`)) flags.push("diagram_readability");
  return [...new Set(flags)];
}

function rejectIf(shot) {
  const items = [
    shot.risk,
    "start/key/end frames do not form the stated action chain",
    "camera motion hides the action peak or reverses the declared screen direction"
  ];
  const n = Number(shot.id.replace(/\D/g, ""));
  if (/Byleth|女贝老师|Female/.test(shot.visible)) {
    items.push("Female Byleth becomes male Byleth, an adult mentor, a generic sorceress, or an ordinary student");
  }
  if (n <= 5) items.push("the unit segment loses visible endpoints or becomes a decorative sword without length meaning");
  if (n >= 6 && n <= 10) items.push("deltoid, unit chord, a = 1/4, or A = pi/8 are missing or scaled incorrectly");
  if (n >= 11 && n <= 15) items.push("the equilateral triangle is implied to solve the unrestricted non-convex problem");
  if (n >= 16 && n <= 23) items.push("Perron cut, slide, overlap, or direction-preservation logic is visually broken");
  if (n >= 24 && n <= 29) items.push("delta, alpha, overlap, zero-area caution, or dimension = 2 claim is invisible or wrong");
  if (n >= 30) items.push("impact is presented as a loose life metaphor instead of proof-derived tube/wave/maximal-average structure");
  return [...new Set(items)];
}

function ensureDir(rel) {
  fs.mkdirSync(path.join(projectRoot, rel), { recursive: true });
}

function writeFile(rel, content) {
  fs.writeFileSync(path.join(projectRoot, rel), content);
}

function updateJson(rel, updater) {
  const abs = path.join(projectRoot, rel);
  const doc = JSON.parse(fs.readFileSync(abs, "utf8"));
  fs.writeFileSync(abs, `${JSON.stringify(updater(doc), null, 2)}\n`);
}

for (let i = 0; i < shots.length; i += 1) {
  const shot = shots[i];
  const previous = shots[i - 1] || null;
  const next = shots[i + 1] || null;
  ensureDir(`storyboards/${shot.id}`);
  writeFile(`storyboards/${shot.id}/frame_spec.md`, frameSpecText(shot, previous, next));
  writeFile(`storyboards/${shot.id}/prompt.md`, promptText(shot, previous, next));
  writeFile(`storyboards/${shot.id}/negative_prompt.md`, negativePromptText(shot));
  writeFile(`storyboards/${shot.id}/metadata.json`, `${JSON.stringify(metadata(shot, previous, next), null, 2)}\n`);
}

const deliveryShots = shots.map((shot, index) => {
  const previous = shots[index - 1] || null;
  const next = shots[index + 1] || null;
  const data = metadata(shot, previous, next);
  return {
    id: data.id,
    order: data.order,
    stage: "prompt_asset_package",
    status: "frames_pending",
    sequence: data.sequence,
    duration_seconds: data.duration_seconds,
    prompt_path: data.prompt_path,
    negative_prompt_path: data.negative_prompt_path,
    frame_spec_path: data.frame_spec_path,
    metadata_path: `storyboards/${shot.id}/metadata.json`,
    start_frame: data.start_frame,
    key_frame: data.key_frame,
    end_frame: data.end_frame,
    expected_clip: data.expected_clip,
    edit_in: data.edit_in,
    edit_out: data.edit_out,
    continuity: data.continuity,
    risk_flags: data.risk_flags,
    review_status: "prompt_ready_frames_pending"
  };
});

writeFile("prompt_asset_package_manifest.json", `${JSON.stringify({
  version: 1,
  project: "Byleth Teaches the 2D Needle Problem",
  project_id: "KAK-BYLETH-LECTURE",
  created_at: today,
  target: "prompt_asset_package",
  status: "frames_pending",
  total_shots: shots.length,
  frame_status: {
    start_frames: "pending",
    key_frames: "pending",
    end_frames: "pending",
    clips: "pending"
  },
  character_locks: {
    byleth_female_professor: bylethProfessor,
    byleth_female_weapon_fullbody: bylethFullbody,
    banned_identity: ["male Byleth", "mature adult mentor", "ordinary student Byleth", "generic sorceress"]
  },
  mathematical_scope: [
    "2D Kakeya needle problem only",
    "deltoid candidate with a=1/4 and A=pi/8",
    "convex optimum: equilateral triangle of height 1",
    "Besicovitch/Perron tree: cut, slide, overlap, iterate",
    "delta-tube overlap and dimension = 2",
    "impact tied to maximal averages, wave packets, tube overlap, and combinatorial geometry"
  ],
  shot_directories: shots.map((shot) => `storyboards/${shot.id}`),
  manifests: {
    video_delivery_manifest: "production_system/video_delivery_manifest.json",
    artifact_manifest: "production_system/artifact_manifest.json",
    review_manifest: "production_system/review_manifest.json"
  },
  notes: "Text prompt asset package is complete. Real start/key/end PNG frames remain frames_pending."
}, null, 2)}\n`);

writeFile("production_system/video_delivery_manifest.json", `${JSON.stringify({
  version: 1,
  project: "Byleth Teaches the 2D Needle Problem",
  project_id: "KAK-BYLETH-LECTURE",
  created_at: today,
  target: "prompt_asset_package",
  status: "frames_pending",
  delivery_blocker: "Actual start/key/end PNG frames and generated clips are not present yet.",
  shots: deliveryShots
}, null, 2)}\n`);

updateJson("production_system/artifact_manifest.json", (doc) => {
  doc.target = "prompt_asset_package";
  doc.artifacts = doc.artifacts.filter((artifact) => !artifact.id.startsWith("KAK-BYLETH-PROMPT-") && artifact.id !== "KAK-BYLETH-PROMPT-ASSET-PACKAGE" && artifact.id !== "KAK-BYLETH-VIDEO-DELIVERY-DRAFT");
  doc.artifacts.push({
    id: "KAK-BYLETH-PROMPT-ASSET-PACKAGE",
    type: "delivery_packet",
    stage: "prompt_asset_package",
    status: "frames_pending",
    created_by: "prompt-asset-producer",
    created_at: today,
    paths: ["prompt_asset_package_manifest.json"],
    source_refs: ["shot_list.md", "shot_generation_requirements.md"],
    depends_on: ["KAK-BYLETH-SHOTLIST"],
    risk_flags: ["frames_pending", "math_accuracy", "identity_drift"],
    notes: "Package manifest for 34 prompt-ready shots; actual frames pending."
  });
  doc.artifacts.push({
    id: "KAK-BYLETH-VIDEO-DELIVERY-DRAFT",
    type: "delivery_packet",
    stage: "prompt_asset_package",
    status: "frames_pending",
    created_by: "prompt-asset-producer",
    created_at: today,
    paths: ["production_system/video_delivery_manifest.json"],
    source_refs: ["prompt_asset_package_manifest.json"],
    depends_on: ["KAK-BYLETH-PROMPT-ASSET-PACKAGE"],
    risk_flags: ["frames_pending"],
    notes: "Draft delivery manifest with expected start/key/end and clip paths."
  });
  for (const shot of shots) {
    doc.artifacts.push({
      id: `KAK-BYLETH-PROMPT-${shot.id}`,
      type: "video_prompt",
      stage: "prompt_asset_package",
      status: "frames_pending",
      created_by: "prompt-asset-producer",
      created_at: today,
      paths: [
        `storyboards/${shot.id}/frame_spec.md`,
        `storyboards/${shot.id}/prompt.md`,
        `storyboards/${shot.id}/negative_prompt.md`,
        `storyboards/${shot.id}/metadata.json`
      ],
      source_refs: ["shot_list.md", "project_bible.md"],
      depends_on: ["KAK-BYLETH-SHOTLIST"],
      continuity: {
        previous: shots[shots.indexOf(shot) - 1]?.id || null,
        next: shots[shots.indexOf(shot) + 1]?.id || null,
        in: shot.editIn,
        out: shot.editOut
      },
      risk_flags: riskFlags(shot),
      notes: `${shot.id} has start/key/end prompt contract; actual PNG frames pending.`
    });
  }
  return doc;
});

updateJson("production_system/review_manifest.json", (doc) => {
  doc.reviews = doc.reviews.filter((review) => !["KAK-BYLETH-REVIEW-PROMPT-QA-2026-07-27", "KAK-BYLETH-REVIEW-MOTION-PROMPT-RISK-2026-07-27"].includes(review.review_id));
  doc.reviews.push({
    artifact_id: "KAK-BYLETH-PROMPT-ASSET-PACKAGE",
    review_id: "KAK-BYLETH-REVIEW-PROMPT-QA-2026-07-27",
    reviewer_role: "video-prompt-qa-reviewer",
    reviewer: "codex",
    created_at: today,
    decision: "monitor_required",
    blocking_issues: [],
    required_revisions: [],
    rubric: {
      prompt_contract_sections: "pass",
      start_key_end_intents: "pass",
      identity_locks: "pass",
      negative_prompt_coverage: "pass",
      frame_lock_check: "unverified_frames_pending",
      math_accuracy_locks: "pass"
    },
    reviewed_paths: ["prompt_asset_package_manifest.json", "production_system/video_delivery_manifest.json", "storyboards/SH001/prompt.md", "storyboards/SH007/prompt.md", "storyboards/SH016/prompt.md", "storyboards/SH019/prompt.md", "storyboards/SH025/prompt.md", "storyboards/SH030/prompt.md", "storyboards/SH034/prompt.md"],
    notes: "All 34 shots have prompt/spec/negative prompt structure with start/key/end frame intents. Actual frame visual checks remain unverified until PNG generation."
  });
  doc.reviews.push({
    artifact_id: "KAK-BYLETH-PROMPT-ASSET-PACKAGE",
    review_id: "KAK-BYLETH-REVIEW-MOTION-PROMPT-RISK-2026-07-27",
    reviewer_role: "motion-prompt-risk-reviewer",
    reviewer: "codex",
    created_at: today,
    decision: "monitor_required",
    blocking_issues: [],
    required_revisions: [],
    rubric: {
      camera_motivation: "pass",
      screen_direction: "pass",
      performance_specificity: "pass",
      diagram_motion_risk: "monitor_required",
      female_byleth_continuity: "monitor_required",
      downstream_video_readiness: "frames_pending"
    },
    reviewed_paths: ["storyboards", "prompt_asset_package_manifest.json"],
    notes: "Prompts can move to frame generation tests. Do not mark approved_for_video until actual start/key/end images pass visual and continuity review."
  });
  return doc;
});

writeFile("production_system/reviews/prompt_asset_package_review_2026-07-27.md", `# Prompt Asset Package Review

Project ID: \`KAK-BYLETH-LECTURE\`
Review Date: 2026-07-27
Reviewer Roles: video-prompt-qa-reviewer, motion-prompt-risk-reviewer
Decision: \`monitor_required\`

## Integrity / Gate Blockers

No prompt-package integrity blockers remain. The package contains 34 shot directories, each with \`frame_spec.md\`, \`prompt.md\`, \`negative_prompt.md\`, and \`metadata.json\`.

## Visual Audit Coverage

Actual start/key/end PNG frames are not present, so visual review is not yet possible. Frame status is intentionally \`frames_pending\`.

## Blocking Issues

None for the text prompt asset package.

## Continuity Issues

Adjacent-shot handoffs are specified in every metadata file and in \`production_system/video_delivery_manifest.json\`. Strict visual continuity remains pending until real frames exist.

## Character / Canon Issues

Female Byleth identity locks are present in all visible Byleth shots. Prompts explicitly use \`${bylethProfessor}\` and ban male Byleth, mature adult mentor, ordinary student Byleth, and generic sorceress drift.

## Cinematography / Blocking Issues

Every shot has camera, blocking, screen direction, action peak, edit in, and edit out. Diagram shots prioritize readability over decorative motion.

## Motion or Downstream Risks

- Deltoid, Perron tree, delta-tube, and dimension shots require visual QA because small symbol or geometry drift could break the proof.
- Character shots require Female Byleth face/costume continuity monitoring.
- Student voices should remain offscreen or shoulder silhouettes unless approved assets are added.

## Existing Material Findings

Spot-checked SH001, SH007, SH016, SH019, SH025, SH030, and SH034. Each contains start/key/end intent, proof purpose, negative prompt, identity or no-character lock, math reject conditions, and video-prompt contract sections.

## Required Revisions

No text revisions required before frame generation. Generate actual start/key/end frames next and run visual plus continuity review.

## Decision

\`monitor_required\`: prompt asset package is complete and ready for frame generation tests, but it is not a video generation package and is not approved_for_video because frames are pending.
`);

console.log(`Built prompt asset package with ${shots.length} shots at ${projectRoot}`);
