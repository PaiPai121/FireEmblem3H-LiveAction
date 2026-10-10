#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const date = "2026-08-12";
const packageRel = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const packageDir = path.join(root, packageRel);
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const siteDataPath = path.join(root, "site/ep02_storyboard_data.js");
const reviewDirRel = `production_system/reviews/scene09_critical_reaudit_${date}`;
const reviewDir = path.join(root, reviewDirRel);
const reviewJsonRel = `${reviewDirRel}/scene09_critical_reaudit_${date}.json`;
const reviewMdRel = `${reviewDirRel}/scene09_critical_reaudit_${date}.md`;
const reviewJsonPath = path.join(root, reviewJsonRel);
const reviewMdPath = path.join(root, reviewMdRel);
const packageReviewJsonRel = `${packageRel}/critical_reaudit_${date}.json`;
const packageReviewMdRel = `${packageRel}/critical_reaudit_${date}.md`;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

const shotAudit = {
  Shot025: {
    titleZh: "规则与三方目标确立",
    decision: "monitor_required",
    purposeZh: "三位级长听到离屏教师规则后，各自确认进攻路线。",
    visual: "三位级长清楚，但动作偏静；只适合规则建立，不能当战斗动作镜头。",
    cameraZh: "中景三人横向构图，靠转头和离屏口令建立规则。",
    screenDirectionRule: "教师只保留离屏左右声源；三位级长不能面向同一镜头摆拍过久。",
    issues: ["起始/关键/结束变化较小，后续视频必须用头部转向和脚步分离补足。"],
    requiredRevision: "保留为规则镜头，但视频提示必须强调三人从互相观察转为各自出发。",
  },
  Shot025A: {
    titleZh: "战场地形与三路插入",
    decision: "layout_reference",
    purposeZh: "交代低墙、树林、坡道、教师台和三学级路线。",
    visual: "战场背景资产可用，但彩色小标记更像战术图，不是可直接视频化镜头。",
    cameraZh: "高位俯拍地形。",
    screenDirectionRule: "蓝狮从近侧推进，黑鹫从中路压出，金鹿从侧翼切入并攻击两方。",
    issues: ["没有可读角色动作，只能当空间参考和战场母版。"],
    requiredRevision: "若要视频化，应做成无角色的战场插入或重新生成真实三路队形远景。",
  },
  Shot026: {
    titleZh: "贝雷特分配青狮职责",
    decision: "monitor_required",
    purposeZh: "青狮队内分工：杜笃顶线，梅尔塞德斯支援，亚修侦查，菲力克斯机动压制。",
    visual: "群像信息完整，但接近静态合影。",
    cameraZh: "俯视战术图的中近景。",
    screenDirectionRule: "所有人视线应落在地面战术图或贝雷特手势上，不应看向镜头。",
    issues: ["人物动作不够具体，职责分配主要靠文字而不是画面证明。"],
    requiredRevision: "后续可以保留，但要补一版更明确的手势/指图/接令动作。",
  },
  Shot026B: {
    titleZh: "青狮观察敌方来路",
    decision: "monitor_required",
    purposeZh: "青狮从高处确认敌方远方来路。",
    visual: "朝向基本合理，人物背向镜头看战场；动作推进仍偏弱。",
    cameraZh: "背后高位视角，展示远方路线。",
    screenDirectionRule: "敌人来自远方时，青狮必须看向战场而非镜头。",
    issues: ["起止变化有限，队形散开不够明确。"],
    requiredRevision: "保留方向逻辑，重做时让侦查、前排、后排职责更可读。",
  },
  Shot026C: {
    titleZh: "青狮分线出发",
    decision: "monitor_required",
    purposeZh: "青狮队伍从观察点分成前压、侧翼、支援三组。",
    visual: "比前一镜有运动感，但部分人物仍像同时出画。",
    cameraZh: "背后广角，队伍向战场下坡。",
    screenDirectionRule: "全队从近景高处向远景战场推进。",
    issues: ["角色职责仍不够分明，个别人物可能在视频中漂成群众。"],
    requiredRevision: "重做优先级低于 P0，但需要给每个小组更清楚的路线。",
  },
  Shot027: {
    titleZh: "亚修发现金鹿侧影",
    decision: "monitor_required",
    purposeZh: "亚修侦查到库罗德潜伏在侧翼。",
    visual: "侦查关系可读，库罗德较小且隐藏；仍有身份漂移风险。",
    cameraZh: "低墙侧面中景，亚修前景、库罗德远侧树林。",
    screenDirectionRule: "亚修视线必须朝向侧翼威胁，不看镜头。",
    issues: ["金鹿侧影太小，若视频漂移会变成陌生人。"],
    requiredRevision: "保留为侦查镜头候选，视频前需强化库罗德弓与黄披风身份。",
  },
  Shot027B: {
    titleZh: "黑鹫第一波压出",
    decision: "blocked_needs_revision",
    purposeZh: "黑鹫前线应该形成真正的第一波推进。",
    visual: "当前是四人站位照，费尔迪南特、艾黛尔贾特、修伯特、朵洛缇雅大多在摆姿势。",
    cameraZh: "应改为低墙前压跟拍，而不是正面合影。",
    screenDirectionRule: "黑鹫应从远侧向青狮方向推进，不能全员看镜头或静站。",
    issues: ["未证明 moving enemy wave。", "黑鹫高光不足，缺少前压节奏。", "start/key/end 差异太小。"],
    requiredRevision: "重写为费尔迪南特持训练枪先压线、艾黛尔贾特持训练斧指挥、修伯特/朵洛缇雅后排起手魔法的三帧动作链。",
  },
  Shot027C: {
    titleZh: "杜笃与帝国前排接触",
    decision: "blocked_needs_revision",
    purposeZh: "杜笃应以盾线接住黑鹫第一波，让帝国前排获得高光但被挡住。",
    visual: "画面像隔墙对峙，接触点和冲击结果不清。",
    cameraZh: "应做侧向低机位，训练枪/盾/斧的接触清楚。",
    screenDirectionRule: "黑鹫由画面左/远侧压来，杜笃朝向来敌，迪米特里在同一防线后方。",
    issues: ["接触动作弱。", "武器关系不清。", "青狮趁乱取胜的因果没有铺好。"],
    requiredRevision: "重做 key：训练枪撞盾、杜笃后撤半步但盾线未破；end：黑鹫被迫停线。",
  },
  Shot027D: {
    titleZh: "菲力克斯切入费尔迪南特",
    decision: "monitor_required",
    purposeZh: "菲力克斯利用杜笃挡线后的空隙切入，牵制费尔迪南特。",
    visual: "近景有剑/枪相交，但三帧结束状态仍偏站定。",
    cameraZh: "中近景交叉武器，贝雷特只作裁判/指挥边缘。",
    screenDirectionRule: "菲力克斯从青狮侧切入，不越过贝雷特裁判轴线。",
    issues: ["费尔迪南特被压制的结果不够明确。"],
    requiredRevision: "保留候选，但 end 必须显示费尔迪南特被迫后撤或举手认定受限。",
  },
  Shot028: {
    titleZh: "安娜特与梅尔塞德斯掩护亚修",
    decision: "monitor_required",
    purposeZh: "安娜特施法制造掩护，梅尔塞德斯保护后排，伊格纳兹远处对射。",
    visual: "掩护关系可读，动作仍偏小。",
    cameraZh: "低墙后排近景。",
    screenDirectionRule: "后排必须朝向远方射线/威胁，梅尔塞德斯不主动冲锋。",
    issues: ["魔法烟尘有用，但人物仍像蹲姿等待。"],
    requiredRevision: "重做优先级中等：强化安娜特翻书起手、亚修借烟转移。",
  },
  Shot028B: {
    titleZh: "艾黛尔贾特与修伯特压迫盾线",
    decision: "monitor_required",
    purposeZh: "黑鹫拿到高光：艾黛尔贾特指挥推进，修伯特/朵洛缇雅用非致命魔法压迫杜笃与迪米特里。",
    visual: "攻守两边明确，但像一字排开。",
    cameraZh: "攻方向守方的中远景。",
    screenDirectionRule: "黑鹫看向青狮盾线；杜笃/迪米特里面对来袭。",
    issues: ["魔法压迫有，但黑鹫推进步伐不够。"],
    requiredRevision: "需要在视频提示中增加脚步推进和盾线反应，必要时重做关键帧。",
  },
  Shot028C: {
    titleZh: "贝雷特止住菲力克斯越线",
    decision: "monitor_required",
    purposeZh: "贝雷特把菲力克斯从过深追击中拉回，保持模拟战规则。",
    visual: "贝雷特手搭肩的裁判关系清楚。",
    cameraZh: "背后中景，远处费尔迪南特保持安全距离。",
    screenDirectionRule: "菲力克斯看向远处对手，贝雷特从侧后制止。",
    issues: ["费尔迪南特退场/受限结果仍不够强。"],
    requiredRevision: "保留候选，但需让费尔迪南特远处明确放低武器或后撤。",
  },
  Shot029: {
    titleZh: "金鹿夹击青狮后排",
    decision: "blocked_needs_revision",
    purposeZh: "金鹿不只是切青狮后方，也要威胁黑鹫，制造青狮险胜的乱局。",
    visual: "当前人物像假人站位，希尔妲/洛廉兹与青狮后排没有真实攻防。",
    cameraZh: "应改为侧翼纵深镜头，让金鹿从斜后方冲入。",
    screenDirectionRule: "金鹿从侧翼斜向进入，同时分出一路压向黑鹫。",
    issues: ["人物脸和资产不像角色。", "几乎没有 action peak。", "金鹿高光不成立。"],
    requiredRevision: "重做三帧：start 金鹿从林线压入；key 希尔妲训练斧迫使希尔凡/英谷莉特转身防守；end 洛廉兹/伊格纳兹同时牵制黑鹫方向。",
  },
  Shot029C: {
    titleZh: "库罗德读出双线缺口",
    decision: "blocked_needs_revision",
    purposeZh: "库罗德应观察青狮和黑鹫两边缺口，准备搅局。",
    visual: "当前是库罗德、亚修、艾黛尔贾特同框摆拍，空间逻辑不清。",
    cameraZh: "应做库罗德前景拉弓、两条战线在远景交叉的判断镜头。",
    screenDirectionRule: "库罗德视线应穿过战场看双线，不应与艾黛尔贾特像同队并肩。",
    issues: ["三方关系混乱。", "不是读局，是合影。"],
    requiredRevision: "重做：库罗德在侧高点，亚修在近处发现他，艾黛尔贾特只作为远处被观察对象。",
  },
  Shot029D: {
    titleZh: "亚修跟丢库罗德",
    decision: "monitor_required",
    purposeZh: "亚修短暂发现库罗德，但库罗德利用掩体换位。",
    visual: "侦查/潜伏逻辑可读，人物数量干净。",
    cameraZh: "亚修前景，库罗德树林阴影远景。",
    screenDirectionRule: "亚修看向树林侧翼，库罗德不看镜头。",
    issues: ["三帧变化太小，缺少库罗德换位的明确动作。"],
    requiredRevision: "可保留但要重写 prompt，让库罗德从树影后撤出画，亚修转身追失。",
  },
  Shot029B: {
    titleZh: "金鹿与青狮近身混战",
    decision: "blocked_needs_revision",
    purposeZh: "金鹿和青狮应打得势均力敌，双方都各有压制与防守。",
    visual: "当前五人一字站立，像拍合照，武器朝向也松散。",
    cameraZh: "应改为低机位交错近身，不用正面列队。",
    screenDirectionRule: "青狮与金鹿必须互相面对，不能共同面向镜头。",
    issues: ["站桩。", "没有任何人赢/退/受限。", "希尔妲年龄和脸部风险需重审。"],
    requiredRevision: "重做：希尔妲训练斧压住英谷莉特，洛廉兹牵制希尔凡，伊格纳兹远处逼安娜特低头，end 青狮仍勉强守住。",
  },
  Shot030: {
    titleZh: "菲力克斯逼退费尔迪南特",
    decision: "monitor_required",
    purposeZh: "菲力克斯用速度逼费尔迪南特后撤，但不羞辱对手。",
    visual: "近景紧张感有，结果仍需加强。",
    cameraZh: "低墙旁侧向中近景。",
    screenDirectionRule: "两人互相面对，贝雷特在侧后保持裁判位置。",
    issues: ["end 没有明确判定费尔迪南特退场或受限。"],
    requiredRevision: "补 end：费尔迪南特退后放低训练枪，承认被压线。",
  },
  Shot030B: {
    titleZh: "贝雷特判定菲力克斯回线",
    decision: "monitor_required",
    purposeZh: "贝雷特制止菲力克斯过度追击，显示青狮险胜不是碾压。",
    visual: "对话特写可用，但不是强动作镜头。",
    cameraZh: "双人中近景，贝雷特冷静，菲力克斯收剑。",
    screenDirectionRule: "两人互相看，远方威胁暂时离屏。",
    issues: ["如果作为动作镜头会太静；作为规则/性格镜头可用。"],
    requiredRevision: "保留为短对白镜头，明确菲力克斯收剑而不是继续攻击。",
  },
  Shot030C: {
    titleZh: "伊格纳兹牵制安娜特后排",
    decision: "monitor_required",
    purposeZh: "金鹿远程高光：伊格纳兹逼迫安娜特和梅尔塞德斯低头转位。",
    visual: "射线方向和后排压力大致可读。",
    cameraZh: "过肩射击线。",
    screenDirectionRule: "伊格纳兹从远侧对青狮后排，朵洛缇雅不应重新主动冲前。",
    issues: ["角色较小，远处人物身份漂移风险高。"],
    requiredRevision: "需要在 prompt 中锁定伊格纳兹弓、安娜特书、梅尔塞德斯支援姿态。",
  },
  Shot031: {
    titleZh: "贝雷特命令菲力克斯停手",
    decision: "blocked_needs_revision",
    purposeZh: "贝雷特应明确中断菲力克斯追击，避免过线。",
    visual: "当前几乎是两人站立对话，start/key/end 没有足够动作变化。",
    cameraZh: "应改为贝雷特手势压住菲力克斯剑线的中近景。",
    screenDirectionRule: "菲力克斯身体仍朝对手方向，贝雷特横向切入裁判轴。",
    issues: ["静态对话过长。", "不能解释战斗状态改变。"],
    requiredRevision: "重做 key：贝雷特手势挡住剑路；end：菲力克斯收剑转身。",
  },
  Shot031B: {
    titleZh: "贝雷特重排青狮防线",
    decision: "monitor_required",
    purposeZh: "贝雷特在混战中重新分配青狮，准备承接杜笃受伤前的压力。",
    visual: "多组动作有战场感，但人物关系拥挤。",
    cameraZh: "中远景带低墙遮挡。",
    screenDirectionRule: "贝雷特指向战场威胁，不应指向镜头。",
    issues: ["群像身份和队形可能在视频中漂移。"],
    requiredRevision: "视频前先做短探针，尤其检查亚修、梅尔塞德斯、安娜特是否保持后排。",
  },
  Shot032: {
    titleZh: "杜笃受伤，梅尔塞德斯治疗重建盾线",
    decision: "monitor_required",
    purposeZh: "借鉴治疗/坦克重建的经典节奏：杜笃被压低，梅尔塞德斯冒险治疗，杜笃恢复盾线。",
    visual: "三帧动作链目前是全场最清楚的：压力、治疗脉冲、恢复盾线。",
    cameraZh: "低机位近景，盾牌和治疗光成为视觉主轴。",
    screenDirectionRule: "杜笃始终面向来敌，梅尔塞德斯在后左支援，不转成主动战士。",
    issues: ["仍需视频探针确认治疗光不会变成攻击光束，脸和制服不漂。"],
    requiredRevision: "保留为当前合格候选；视频 prompt 禁止血腥、禁止魔兽设计、禁止梅尔塞德斯冲锋。",
  },
  Shot032A: {
    titleZh: "安娜特接力掩护亚修",
    decision: "monitor_required",
    purposeZh: "梅尔塞德斯治疗后消耗，安娜特接过掩护，亚修继续牵制库罗德。",
    visual: "风/尘掩护可读，但人物仍偏静。",
    cameraZh: "低墙后排侧向。",
    screenDirectionRule: "支援组看向远方威胁，梅尔塞德斯保持治疗后疲态。",
    issues: ["梅尔塞德斯不能在下一镜重新满状态主动作战。"],
    requiredRevision: "需要账本与 prompt 同步：梅尔塞德斯治疗后只支援/移动，不主动开战。",
  },
  Shot032B: {
    titleZh: "迪米特里与杜笃逼近汉尼曼目标台",
    decision: "layout_reference",
    purposeZh: "青狮向汉尼曼所属目标推进，教师只作为各自班级目标/裁定点存在。",
    visual: "空间关系可用，但动作像静态对视。",
    cameraZh: "低位看向教师台。",
    screenDirectionRule: "汉尼曼单独在其目标台，不能与玛努艾拉并肩。",
    issues: ["没有明确压制动作。", "教师台更像舞台展示。"],
    requiredRevision: "重做时只保留汉尼曼一侧，key 要有安全屏障/判定动作和青狮推进结果。",
  },
  Shot032C: {
    titleZh: "黑鹫与金鹿互相牵制",
    decision: "blocked_needs_revision",
    purposeZh: "证明金鹿也攻击黑鹫，乱局不是单纯背刺青狮。",
    visual: "当前两队站成对话阵列，紫色线不足以证明互攻。",
    cameraZh: "应做斜向交火，黑鹫和金鹿分处两侧。",
    screenDirectionRule: "黑鹫与金鹿必须互相面对/交火，青狮不在这条轴上。",
    issues: ["金鹿攻击黑鹫的关键要求没有被画面证明。", "动作峰值弱。"],
    requiredRevision: "重做：希尔妲或库罗德牵制修伯特/朵洛缇雅，艾黛尔贾特被迫转身防守。",
  },
  Shot032D: {
    titleZh: "三方混战总览",
    decision: "layout_reference",
    purposeZh: "从高处显示三方战线交叉，青狮利用混乱寻找胜机。",
    visual: "地形和队伍位置可参考，但人物过小且彩色轨迹像战术标注。",
    cameraZh: "高位总览。",
    screenDirectionRule: "蓝狮线不能被金鹿完全切断；金鹿同时牵制黑鹫。",
    issues: ["不能直接视频化为真实战斗镜头。"],
    requiredRevision: "作为战术插入可保留；若当实拍镜头需重生真实人群远景，不要彩色标线。",
  },
  Shot032E: {
    titleZh: "贝雷特读出乱局机会",
    decision: "layout_reference",
    purposeZh: "贝雷特从高处读局，看到金鹿与黑鹫互相牵制后给青狮机会。",
    visual: "调度意图可参考，但彩色轨迹过强，像 UI 地图。",
    cameraZh: "贝雷特背影俯瞰战场。",
    screenDirectionRule: "贝雷特看向战场，不参与某一学级并肩作战。",
    issues: ["非写实彩色弧线不适合视频生成。"],
    requiredRevision: "保留为导演地图参考；视频化需改成尘土、脚步线、旗帜和真实视线。",
  },
  Shot032F: {
    titleZh: "菲力克斯与亚修压制修伯特",
    decision: "blocked_needs_revision",
    purposeZh: "必须明确修伯特被菲力克斯与亚修压制/失去主动参战资格。",
    visual: "当前三人站位过静，修伯特没有明显被捕获或压制。",
    cameraZh: "应做三角压制：菲力克斯近身封路，亚修远程瞄准，修伯特放低手。",
    screenDirectionRule: "修伯特面对压制方向，不能像旁观者。",
    issues: ["关键退场锁没有被画面证明。", "亚修坐/蹲在墙边像无关人物。"],
    requiredRevision: "重做三帧，end 必须显示修伯特双手离开施法姿态、退到规则线外。",
  },
  Shot032G: {
    titleZh: "库罗德与雷欧妮截住朵洛缇雅和贝尔娜提塔",
    decision: "blocked_needs_revision",
    purposeZh: "证明金鹿攻击黑鹫并截住后排，使青狮能趁乱险胜。",
    visual: "当前人物分散站立，没有截住/捕获动作，贝尔娜提塔身份也弱。",
    cameraZh: "应做库罗德弓线和雷欧妮近身封路的交叉镜头。",
    screenDirectionRule: "金鹿从侧翼切向黑鹫后排，不面向镜头摆拍。",
    issues: ["朵洛缇雅/贝尔娜提塔被截住的账本关键锁未证明。", "角色资产识别弱。"],
    requiredRevision: "重做：key 雷欧妮拦住退路，库罗德箭线压住施法手；end 黑鹫后排举手/放低武器退出主动战斗。",
  },
  Shot033: {
    titleZh: "青狮转向教师目标",
    decision: "monitor_required",
    purposeZh: "迪米特里、杜笃和贝雷特确认汉尼曼目标台，准备结束目标。",
    visual: "方向关系可读，但仍像过场站位。",
    cameraZh: "平台下方仰视。",
    screenDirectionRule: "汉尼曼单独在目标台；玛努艾拉不入镜。",
    issues: ["推进动作弱，教师判定机制不够清楚。"],
    requiredRevision: "需要更清晰的目标旗/判定线/安全屏障。",
  },
  Shot033B: {
    titleZh: "贝雷特下令分切教师目标",
    decision: "blocked_needs_revision",
    purposeZh: "贝雷特应明确指挥亚修/英谷莉特/菲力克斯分头压制教师目标。",
    visual: "当前贝雷特指向空场，学生像散步离开，不知道在干什么。",
    cameraZh: "应从贝雷特背后看两条教师目标路线。",
    screenDirectionRule: "汉尼曼和玛努艾拉必须分属不同方向，不在同一平台并肩。",
    issues: ["用户点名疑问成立：贝雷特动作语义不清。", "教师目标分切没有被证明。"],
    requiredRevision: "重做 start/key/end：贝雷特指两侧目标，亚修向汉尼曼线，英谷莉特向玛努艾拉线，菲力克斯留中线封路。",
  },
  Shot033C: {
    titleZh: "亚修压制汉尼曼目标",
    decision: "blocked_needs_revision",
    purposeZh: "亚修用训练箭压制汉尼曼目标，使汉尼曼无法继续支援。",
    visual: "当前魔法屏障像装饰，亚修没有明确释放/命中/判定。",
    cameraZh: "应做亚修过肩箭线对汉尼曼独立平台。",
    screenDirectionRule: "汉尼曼只在自己的目标台，亚修从青狮侧远程压制。",
    issues: ["用户点名：魔法完全不对。", "教师被压制结果不成立。"],
    requiredRevision: "重做 key：训练箭打在安全屏障/判定牌上，汉尼曼举手或后撤表示目标失守。",
  },
  Shot033D: {
    titleZh: "英谷莉特逼退玛努艾拉目标",
    decision: "blocked_needs_revision",
    purposeZh: "英谷莉特应机动逼退玛努艾拉目标，希尔凡牵制路线。",
    visual: "当前三人站在平台前对视，玛努艾拉像主持人，不像被逼退。",
    cameraZh: "应做侧向冲刺与判定线。",
    screenDirectionRule: "玛努艾拉在另一条独立目标线，不与汉尼曼同台同伴式作战。",
    issues: ["魔法/裁定动作不对。", "英谷莉特高光不足。", "退场结果不清。"],
    requiredRevision: "重做：英谷莉特训练枪点到目标线，玛努艾拉后撤离开治疗圈，希尔凡挡住回援路。",
  },
  Shot034C: {
    titleZh: "菲力克斯与费尔迪南特收招",
    decision: "blocked_needs_revision",
    purposeZh: "费尔迪南特应体面退场，菲力克斯收住锋芒。",
    visual: "两人远距离站着，武器状态和胜负结果不清。",
    cameraZh: "应做对峙后收招的中景。",
    screenDirectionRule: "两人互相面对，费尔迪南特放低训练枪，菲力克斯不追击。",
    issues: ["没有退场镜头。", "费尔迪南特高光和体面收势都不足。"],
    requiredRevision: "重做 end：费尔迪南特承认被压线但保持姿态，菲力克斯收剑。",
  },
  Shot034D: {
    titleZh: "贝雷特确认汉尼曼判负",
    decision: "blocked_needs_revision",
    purposeZh: "贝雷特应裁定汉尼曼目标已失守，而不是和汉尼曼并肩施法。",
    visual: "当前像贝雷特站在汉尼曼旁边，教师/裁判关系混乱。",
    cameraZh: "应做裁判侧面，汉尼曼独立后撤。",
    screenDirectionRule: "贝雷特不能像加入汉尼曼一边作战。",
    issues: ["角色阵营关系误读风险高。", "教师判定动作不清。"],
    requiredRevision: "重做：贝雷特在台下/侧边举手判定，汉尼曼放下手退到目标线后。",
  },
  Shot034B: {
    titleZh: "空教师目标裁定",
    decision: "monitor_required",
    purposeZh: "教师目标台清空，贝雷特和迪米特里确认目标失守。",
    visual: "空平台逻辑成立，汉尼曼/玛努艾拉未并肩。",
    cameraZh: "背后中远景看空台。",
    screenDirectionRule: "只有贝雷特和迪米特里可读，教师不出现。",
    issues: ["作为空目标说明镜头可用，但缺少一声哨/旗帜落下的动作锚点。"],
    requiredRevision: "保留候选，视频提示加离屏哨声和目标旗落下，不新增教师。",
  },
  Shot034E: {
    titleZh: "金鹿体面收势",
    decision: "blocked_needs_revision",
    purposeZh: "金鹿应在高光后体面退场，证明他们搅乱两边但没有被贬低。",
    visual: "当前是金鹿合影，完全不是高光后收势。",
    cameraZh: "应做五人从战线撤回、库罗德承认青狮抓住机会的动作镜头。",
    screenDirectionRule: "金鹿应看向战场结果或互相确认，不集体看镜头。",
    issues: ["纯站桩。", "没有每个金鹿角色的战斗/退场结果。"],
    requiredRevision: "重做：库罗德放低弓、希尔妲扶斧喘气、洛廉兹整理训练枪、伊格纳兹收弓、雷欧妮回望黑鹫后排。",
  },
  Shot034F: {
    titleZh: "黑鹫体面收势",
    decision: "blocked_needs_revision",
    purposeZh: "艾黛尔贾特和费尔迪南特应体面退场，黑鹫虽败但保留压迫感。",
    visual: "当前艾黛尔贾特和费尔迪南特分站草地，没有失败/收势动作。",
    cameraZh: "应做艾黛尔贾特收斧、费尔迪南特回到她身侧的双人镜头。",
    screenDirectionRule: "两人看向胜负结果或青狮方向，不看镜头摆拍。",
    issues: ["黑鹫高光后结果没有镜头。", "武器/退场动作弱。"],
    requiredRevision: "重做：艾黛尔贾特稳住队伍，费尔迪南特示意停止追击，保留尊严。",
  },
  Shot034G: {
    titleZh: "迪米特里与杜笃疲惫守住",
    decision: "monitor_required",
    purposeZh: "青狮险胜核心：迪米特里和杜笃都明显疲惫，但防线还在。",
    visual: "三人关系可读，但疲惫和险胜感不足。",
    cameraZh: "贝雷特背后看迪米特里/杜笃。",
    screenDirectionRule: "贝雷特面对青狮，杜笃仍守盾线，迪米特里不作胜利炫耀。",
    issues: ["需要更强的喘息、低盾、尘土和收招状态。"],
    requiredRevision: "可保留候选，但最好重做 end 强化险胜而非轻松取胜。",
  },
  Shot034: {
    titleZh: "三位级长赛后互认",
    decision: "monitor_required",
    purposeZh: "迪米特里、艾黛尔贾特、库罗德在战后互相确认实力，非贬低式结尾。",
    visual: "三人同框清楚，但动作静。",
    cameraZh: "三人中景。",
    screenDirectionRule: "三人互看，不看镜头；武器放低表示模拟战结束。",
    issues: ["需要对话/呼吸节奏支撑，否则像宣传照。"],
    requiredRevision: "保留为短对白镜头，台词要体现势均力敌、青狮险胜。",
  },
  Shot035: {
    titleZh: "菲力克斯接受贝雷特提醒",
    decision: "blocked_needs_revision",
    purposeZh: "菲力克斯应从战斗兴奋转为克制，完成个人收束。",
    visual: "当前近景像安静对话，缺少从战斗状态到收剑的变化。",
    cameraZh: "中近景，菲力克斯先握剑不服，后收剑。",
    screenDirectionRule: "贝雷特面对菲力克斯，背景不再有主动战斗。",
    issues: ["start/key/end 几乎同状态。", "人物脸与资产风险需要重审。"],
    requiredRevision: "重做：key 贝雷特一句话压住菲力克斯，end 菲力克斯收剑侧目。",
  },
  Shot036: {
    titleZh: "迪米特里承认险胜",
    decision: "monitor_required",
    purposeZh: "迪米特里向贝雷特承认胜利很险，收束青狮获胜但尊重两班。",
    visual: "后战对话关系可读，动作偏静但适合作结尾。",
    cameraZh: "双人中近景，迪米特里低头整理训练枪。",
    screenDirectionRule: "战斗已结束，双方不再冲突。",
    issues: ["需要台词支撑尊重其他学级，否则画面信息不足。"],
    requiredRevision: "保留为结尾对白镜头，加入‘只是抓住了一瞬空隙’的台词锚点。",
  },
};

const previousReviews = [
  `${packageRel}/full_local_visual_review.json`,
  `${packageRel}/full_local_visual_review.md`,
  "production_system/reviews/scene09_v3_full_local_visual_review_2026-08-08/scene09_full_local_visual_review_2026-08-08.json",
  "production_system/reviews/scene09_v3_full_local_visual_review_2026-08-08/scene09_full_local_visual_review_2026-08-08.md",
];

function packageFrameBase(shot) {
  return `${packageRel}/${shot.package_dir}`;
}

function packageFrameSet(shot) {
  const base = packageFrameBase(shot);
  return [
    { role: "start", label: "起始帧", path: `${base}/start_frame.png` },
    { role: "key", label: "关键帧", path: `${base}/key_frame.png` },
    { role: "end", label: "结束帧", path: `${base}/end_frame.png` },
  ];
}

function frameIntent(audit, role) {
  if (role === "start") return `起点：${audit.purposeZh}`;
  if (role === "key") return `关键：${audit.visual}`;
  return `收束：${audit.requiredRevision}`;
}

function summarizeCounts(shots) {
  const counts = {};
  for (const shot of shots) counts[shot.decision] = (counts[shot.decision] || 0) + 1;
  return counts;
}

function buildReport(packageManifest) {
  const shots = packageManifest.shots.map((shot) => {
    const audit = shotAudit[shot.shot];
    if (!audit) throw new Error(`missing critical audit entry for ${shot.shot}`);
    return {
      order: shot.order,
      shot: shot.shot,
      title_zh: audit.titleZh,
      visible_named_only: shot.visible_named_only || [],
      decision: audit.decision,
      reviewed_paths: {
        start: `${packageFrameBase(shot)}/start_frame.png`,
        key: `${packageFrameBase(shot)}/key_frame.png`,
        end: `${packageFrameBase(shot)}/end_frame.png`,
      },
      story_beat: audit.purposeZh,
      visual_assessment: audit.visual,
      camera: audit.cameraZh,
      facing_screen_direction: audit.screenDirectionRule,
      blocking_issues: audit.issues,
      required_revision: audit.requiredRevision,
    };
  });
  const failed = shots.filter((shot) => shot.decision === "blocked_needs_revision").map((shot) => shot.shot);
  const layout = shots.filter((shot) => shot.decision === "layout_reference").map((shot) => shot.shot);
  const monitor = shots.filter((shot) => shot.decision === "monitor_required").map((shot) => shot.shot);
  return {
    review_id: `scene09_critical_reaudit_${date}`,
    scene: "EP02 Scene09 学级模拟战",
    reviewed_at: date,
    reviewer_role: "codex_critical_visual_reaudit",
    trigger: "User challenged that the named bad shots were only examples and that the whole Scene09 package still has logic, face, weapon, facing, and static-pose problems.",
    method: "Rendered contact-sheet review of package-local 42 shot rows / 126 frames, followed by full-size inspection of named high-risk frames and downgrade of prior unsafe visual approval.",
    source_package: packageRel,
    contact_sheets: [
      "production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part1.png",
      "production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part2.png",
      "production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part3.png",
      "production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part4.png",
      "production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part5.png",
    ],
    inherited_user_constraints: [
      "Do not treat the user's named bad frames as the whole problem; audit all Scene09 shots.",
      "Do not submit expensive video jobs while still frames have unresolved logic, identity, weapon, facing, or action-chain failures.",
      "Blue Lions win narrowly; Black Eagles and Golden Deer must remain competent and receive highlights plus dignified exits.",
      "Golden Deer attacks both Blue Lions and Black Eagles, creating the chaos that lets Blue Lions win.",
      "Every character's win, defeat, limitation, or exit must be visually accounted for and must not contradict the post-shot battle ledger.",
      "Hanneman and Manuela are separate faculty targets for different lanes and must not appear as side-by-side allies.",
      "Dedue/Mercedes healing beat must read as injury, intervention, and restored shield line, not a static pose.",
      "The main Scene09 storyboard panel must show the latest shot work directly, with Chinese titles and no backstage clutter.",
    ],
    supersedes: previousReviews,
    integrity_summary: {
      shots_expected: 42,
      shots_reviewed: shots.length,
      frames_expected: 126,
      frames_present: 126,
      missing_frame_refs: [],
    },
    visual_audit_coverage: {
      unavailable_shots: [],
      existing_shots_failed: failed,
      layout_reference_only: layout,
      monitor_required: monitor,
      visual_review_passed: [],
    },
    counts: summarizeCounts(shots),
    decision: "critical_reaudit_blocked_needs_revision",
    promotion_decision: "Do not submit motion probes or full-duration video for the whole scene. Regenerate or rewrite blocked shots first; use layout_reference shots only as geography/planning references.",
    problems: [
      "The prior full local visual review was too permissive: it listed zero existing visual failures while many frame sets do not prove their declared beat.",
      "Many start/key/end chains are static standing poses rather than action cause/effect.",
      "Several key ledger events are not visually proven, especially Black Eagles and Golden Deer exits/captures and faculty objective rulings.",
      "Some shots keep readable characters facing the camera or standing in display poses while the declared threat comes from another direction.",
    ],
    shots,
  };
}

function buildMd(report) {
  const lines = [
    "# Scene09 Critical Visual Re-Audit",
    "",
    `Date: ${date}`,
    "",
    "## Decision",
    "",
    "`critical_reaudit_blocked_needs_revision`",
    "",
    "Do not submit the whole Scene09 package to video generation. The previous `full_local_visual_review_passed_for_motion_probe_not_video_approved` result is superseded because it did not flag visible storyboard failures that are now clear in the delivered frames.",
    "",
    "## Counts",
    "",
    `- Existing shots failed: ${report.visual_audit_coverage.existing_shots_failed.length} (${report.visual_audit_coverage.existing_shots_failed.join(", ")})`,
    `- Layout reference only: ${report.visual_audit_coverage.layout_reference_only.length} (${report.visual_audit_coverage.layout_reference_only.join(", ")})`,
    `- Monitor required, not approved for video: ${report.visual_audit_coverage.monitor_required.length} (${report.visual_audit_coverage.monitor_required.join(", ")})`,
    "- Visual review passed: 0",
    "",
    "## Why The Previous Approval Was Unsafe",
    "",
    "- It treated file existence and contact-sheet coverage as enough for monitor readiness.",
    "- It reported zero existing visual failures even though multiple frame sets are static poses or do not prove their combat/retreat/capture beat.",
    "- It did not enforce the latest user constraints about three-class balance, Golden Deer attacking Black Eagles too, teacher-lane separation, and every character's exit/defeat state.",
    "",
    "## Per-Shot Findings",
    "",
    "| Shot | Title | Decision | Blocking / Required Revision |",
    "| --- | --- | --- | --- |",
  ];
  for (const shot of report.shots) {
    lines.push(`| ${shot.shot} | ${shot.title_zh} | ${shot.decision} | ${shot.blocking_issues.join(" / ")} Required: ${shot.required_revision} |`);
  }
  lines.push("");
  lines.push("## Next Work Queue");
  lines.push("");
  lines.push("1. Rewrite blocked shot contracts before generating replacements.");
  lines.push("2. Regenerate P0 stills in batches: first 027B/027C/029/029C/029B, then 032C/032F/032G, then 033B/033C/033D/034C/034D/034E/034F/035.");
  lines.push("3. After each regenerated shot, sync the main Scene09 storyboard panel immediately.");
  lines.push("4. Re-run contact-sheet visual QA, prompt semantics, battle ledger, main panel smoke, and media reference audits before any video generation.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function downgradePreviousReviews(report) {
  for (const oldRel of previousReviews) {
    const oldPath = path.join(root, oldRel);
    if (!fs.existsSync(oldPath)) continue;
    if (oldRel.endsWith(".json")) {
      const old = readJson(oldPath);
      old.previous_decision = old.decision || null;
      old.decision = "superseded_by_critical_reaudit_blocked_needs_revision";
      old.superseded_at = date;
      old.superseded_by = reviewJsonRel;
      old.superseded_reason = "User challenge was valid: the package had multiple visible storyboard/action/logic failures not captured as failed shots.";
      old.visual_audit_coverage = old.visual_audit_coverage || {};
      old.visual_audit_coverage.existing_shots_failed_after_reaudit = report.visual_audit_coverage.existing_shots_failed;
      old.visual_audit_coverage.layout_reference_only_after_reaudit = report.visual_audit_coverage.layout_reference_only;
      old.problems = [
        ...(old.problems || []),
        "Superseded: prior review did not identify the current visible static-pose, action-chain, facing, teacher-lane, and character-exit failures.",
      ];
      writeJson(oldPath, old);
    } else {
      writeText(oldPath, [
        "# Superseded Scene09 Visual Review",
        "",
        `Superseded at: ${date}`,
        "",
        `Replacement: ${reviewMdRel}`,
        "",
        "Decision: `superseded_by_critical_reaudit_blocked_needs_revision`",
        "",
        "Reason: the user correctly pointed out that the named bad frames were only examples. A full rendered re-audit found multiple visible storyboard failures that this older report did not flag.",
        "",
      ].join("\n"));
    }
  }
}

function updatePackageManifest(packageManifest, report) {
  const byShot = new Map(report.shots.map((shot) => [shot.shot, shot]));
  packageManifest.status = "critical_reaudit_blocked_needs_revision";
  packageManifest.source_decision = "critical_reaudit_blocked_needs_revision";
  packageManifest.updated_at = date;
  packageManifest.critical_reaudit = {
    decision: report.decision,
    report: reviewJsonRel,
    report_md: reviewMdRel,
    blocked_shots: report.visual_audit_coverage.existing_shots_failed,
    layout_reference_only: report.visual_audit_coverage.layout_reference_only,
    monitor_required: report.visual_audit_coverage.monitor_required,
  };
  packageManifest.execution_readiness = packageManifest.execution_readiness || {};
  packageManifest.execution_readiness.visual_readiness = "blocked_needs_revision";
  packageManifest.execution_readiness.motion_probe_submission = "blocked_until_p0_still_revisions";
  packageManifest.shots = packageManifest.shots.map((shot) => {
    const finding = byShot.get(shot.shot);
    const audit = shotAudit[shot.shot];
    shot.status = finding.decision;
    shot.title = audit.titleZh;
    shot.titleZh = audit.titleZh;
    shot.primary_check = `${audit.purposeZh} Critical re-audit: ${finding.decision}. ${audit.requiredRevision}`;
    shot.visual_review_status = finding.decision;
    shot.video_generation_readiness = "blocked_until_critical_reaudit_revisions_clear";
    shot.critical_reaudit = finding;
    shot.reject_if = [
      ...(shot.reject_if || []),
      "Reject if this shot plays as a static pose or portrait instead of the declared start/key/end action chain.",
      "Reject if the shot contradicts the 2026-08-12 critical re-audit required revision.",
    ];
    return shot;
  });
}

function updateShotMetadata(packageManifest, report) {
  const byShot = new Map(report.shots.map((shot) => [shot.shot, shot]));
  for (const shot of packageManifest.shots) {
    const metadataPath = path.join(packageDir, shot.package_dir, "metadata.json");
    if (!fs.existsSync(metadataPath)) continue;
    const metadata = readJson(metadataPath);
    const finding = byShot.get(shot.shot);
    metadata.status = finding.decision;
    metadata.decision = "critical_reaudit_blocked_needs_revision";
    metadata.visual_review_status = finding.decision;
    metadata.video_generation_readiness = "blocked_until_critical_reaudit_revisions_clear";
    metadata.title = finding.title_zh;
    metadata.titleZh = finding.title_zh;
    metadata.critical_reaudit = finding;
    metadata.supersedes_prior_visual_review = reviewJsonRel;
    writeJson(metadataPath, metadata);
  }
}

function updateSiteData(packageManifest, report) {
  const code = fs.readFileSync(siteDataPath, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: siteDataPath });
  const data = sandbox.window.EP02_STORYBOARD_DATA;
  const packageShots = new Map(packageManifest.shots.map((shot) => [shot.shot, shot]));
  const findings = new Map(report.shots.map((shot) => [shot.shot, shot]));

  data.updated = date;
  data.mockBattleFullLocalVisualReview = reviewMdRel;
  data.mockBattleFullLocalVisualReviewJson = reviewJsonRel;
  data.mockBattleCriticalReaudit = reviewMdRel;
  data.mockBattleCriticalReauditJson = reviewJsonRel;
  data.mockBattleOperatorStatus = {
    ...(data.mockBattleOperatorStatus || {}),
    generated_at: `${date}T00:00:00.000Z`,
    current_phase: "critical_reaudit_blocked",
    next_action: "revise_critical_reaudit_blockers",
    status_line: "critical_reaudit_blocked_needs_revision",
    can_submit_full_duration: false,
    can_run_local_cli: false,
    counts: {
      ...(data.mockBattleOperatorStatus?.counts || {}),
      expected_probe_clips: 42,
      playable_probe_clips: 0,
      expected_full_duration_clips: 42,
      ready_full_duration_clips: 0,
      completion_passed_checks: 0,
      completion_total_checks: 42,
      completion_failed_checks: report.visual_audit_coverage.existing_shots_failed,
    },
    gates: {
      ...(data.mockBattleOperatorStatus?.gates || {}),
      motion_probe_submission_ready_gate: "blocked_by_critical_visual_reaudit",
      full_local_visual_review: "superseded_by_critical_reaudit_blocked_needs_revision",
      current_status_consistency_gate: "needs_refresh_after_visual_revisions",
      report_freshness_gate: "needs_refresh_after_visual_revisions",
    },
    blocking_items: [
      {
        id: "critical_visual_reaudit_blocked",
        active: true,
        evidence: `${report.visual_audit_coverage.existing_shots_failed.length} blocked shots`,
        detail: "全场重审发现多个镜头是站桩、动作链不成立、角色退场未证明或教师目标逻辑不清；先重做分镜帧，再提交视频。",
      },
      {
        id: "prior_visual_review_superseded",
        active: true,
        evidence: reviewMdRel,
        detail: "旧 full_local_visual_review 已降级，不再作为投视频依据。",
      },
      {
        id: "real_clips_missing",
        active: true,
        evidence: "0/42 real clips ready",
        detail: "真实视频仍未生成；当前阶段先修 still frame 和 prompt contract。",
      },
    ],
    operator_commands: [
      `Open ${reviewMdRel}`,
      "Regenerate blocked P0 start/key/end frames in small batches.",
      "After each regenerated shot, sync the main Scene09 storyboard panel immediately.",
      "Only rebuild probe/provider bundles after the critical re-audit has no blocked shots.",
    ],
  };

  for (const shot of data.shots || []) {
    const pkg = packageShots.get(shot.shot);
    const finding = findings.get(shot.shot);
    if (!pkg || !finding) continue;
    const audit = shotAudit[shot.shot];
    const frameSet = packageFrameSet(pkg).map((frame) => ({
      ...frame,
      status: finding.decision,
      intent: frameIntent(audit, frame.role),
      prompt: audit.requiredRevision,
    }));
    shot.title = audit.titleZh;
    shot.titleZh = audit.titleZh;
    shot.displayImagePath = `${packageFrameBase(pkg)}/key_frame.png`;
    shot.displayImageStatus = finding.decision;
    shot.displayImageSource = "scene09_current_package_critical_reaudit";
    shot.frameSet = frameSet;
    shot.productionKeyframePath = `${packageFrameBase(pkg)}/key_frame.png`;
    shot.productionStartFramePath = `${packageFrameBase(pkg)}/start_frame.png`;
    shot.payloadProductionImagePath = `${packageFrameBase(pkg)}/start_frame.png`;
    shot.productionFrameIntent = audit.requiredRevision;
    shot.productionFramePrompt = audit.requiredRevision;
    shot.purposeZh = audit.purposeZh;
    shot.visual = audit.visual;
    shot.cameraZh = audit.cameraZh;
    shot.screenDirectionRule = audit.screenDirectionRule;
    shot.riskNotes = audit.issues.join(" / ");
    shot.shotDialogue = shot.shotDialogue || pkg.audio_anchor || "无对白";
    shot.characters = (pkg.visible_named_only || []).join(", ");
    shot.currentCharacters = (pkg.visible_named_only || []).map((name) => ({ name }));
    shot.visibleNamedOnly = pkg.visible_named_only || [];
    shot.currentRejectIf = pkg.reject_if || [];
    shot.generationPrompt = audit.requiredRevision;
    shot.negativePrompt = [
      "No static portrait posing.",
      "No character face, age, weapon, costume, or house-color drift.",
      "No camera-facing pose while a threat arrives from another direction.",
      "No unnamed readable extras.",
      "No defeated, captured, stood-down, or spent character returning to active combat.",
      ...(pkg.reject_if || []),
    ].join(" ");
    shot.productionStatus = "critical_reaudit";
    shot.productionQaStatus = finding.decision;
    shot.productionQaChecks = [
      `critical_reaudit_decision: ${finding.decision}`,
      `required_revision: ${finding.required_revision}`,
      ...finding.blocking_issues.map((issue) => `issue: ${issue}`),
    ];
    shot.fullLocalVisualReviewStatus = finding.decision;
    shot.fullLocalVisualReviewDecision = "critical_reaudit_blocked_needs_revision";
    shot.fullLocalVisualReviewNote = `${finding.visual_assessment} Required: ${finding.required_revision}`;
    shot.fullLocalVisualReviewVideoReadiness = "not_approved_for_video_until_revised_and_reaudited";
    shot.fullLocalVisualReviewPath = reviewMdRel;
    shot.fullLocalVisualReviewJsonPath = reviewJsonRel;
    shot.modelReadyPromptFile = `${packageFrameBase(pkg)}/model_prompt.md`;
    shot.modelReadyNegativePromptFile = `${packageFrameBase(pkg)}/negative_prompt.md`;
    shot.auditPromptFile = `${packageFrameBase(pkg)}/prompt.md`;
    shot.promptSubmissionStatus = "blocked_by_critical_reaudit";
    shot.payloadProductionStatus = "critical_reaudit_blocked";
    shot.productionPriority = finding.decision === "blocked_needs_revision" ? "P0_rebuild" : finding.decision === "layout_reference" ? "layout_only" : "P1_monitor";
  }

  writeText(siteDataPath, `window.EP02_STORYBOARD_DATA = ${JSON.stringify(data, null, 2)};\n`);
}

function main() {
  const packageManifest = readJson(packageManifestPath);
  if (!Array.isArray(packageManifest.shots) || packageManifest.shots.length !== 42) {
    throw new Error("expected 42 shots in package_manifest.json");
  }
  const report = buildReport(packageManifest);
  writeJson(reviewJsonPath, report);
  writeText(reviewMdPath, buildMd(report));
  writeJson(path.join(root, packageReviewJsonRel), report);
  writeText(path.join(root, packageReviewMdRel), buildMd(report));
  downgradePreviousReviews(report);
  updatePackageManifest(packageManifest, report);
  writeJson(packageManifestPath, packageManifest);
  updateShotMetadata(packageManifest, report);
  updateSiteData(packageManifest, report);

  console.log(JSON.stringify({
    decision: report.decision,
    report: reviewJsonRel,
    blocked: report.visual_audit_coverage.existing_shots_failed.length,
    layout_reference_only: report.visual_audit_coverage.layout_reference_only.length,
    monitor_required: report.visual_audit_coverage.monitor_required.length,
  }, null, 2));
}

main();
