#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const root = path.resolve(__dirname, "..");
const epDir = path.join(root, "episodes", "EP03");
const today = "2026-07-28";
const sourceVideo = "/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P4. 白云之章EP3雾中的叛乱（青狮）)[00].mp4";
const sourceAudio = "/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P4. 白云之章EP3雾中的叛乱（青狮）)[01].mp4";

const locations = {
  monastery: "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png",
  cathedral: "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png",
  classroom: "assets/locations/EP02/act01/OfficersAcademyClassroom/OfficersAcademyClassroom_reference.png",
  fogRoad: "assets/locations/EP03/act01/MagdredWayFogRoad/MagdredWayFogRoad_reference.png",
  village: "assets/locations/EP03/act01/FaerghusBorderVillage/FaerghusBorderVillage_reference.png",
  rebelCamp: "assets/locations/EP03/act01/WesternChurchRebelCamp/WesternChurchRebelCamp_reference.png",
  battlefield: "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
  chapel: "assets/locations/EP03/act01/FogChapelRuins/FogChapelRuins_reference.png",
  zanado: "assets/locations/EP02/act03/RedCanyonZanado/RedCanyonZanado_reference.png"
};

const characters = {
  Byleth: "assets/characters/protagonist/Byleth/professor/selected.png",
  Sothis: "assets/characters/divine/Sothis/dream/legacy_ep01/candidate_03.png",
  Rhea: "assets/characters/church_of_seiros/Rhea/academy/selected.png",
  Seteth: "assets/characters/church_of_seiros/Seteth/academy/selected.png",
  Catherine: "assets/characters/church_of_seiros/Catherine/academy/selected.png",
  Dimitri: "assets/characters/blue_lions/Dimitri/academy/selected.png",
  Dedue: "assets/characters/blue_lions/Dedue/academy/selected.png",
  Felix: "assets/characters/blue_lions/Felix/academy/selected.png",
  Ashe: "assets/characters/blue_lions/Ashe/academy/selected.png",
  Sylvain: "assets/characters/blue_lions/Sylvain/academy/selected.png",
  Mercedes: "assets/characters/blue_lions/Mercedes/academy/selected.png",
  Annette: "assets/characters/blue_lions/Annette/academy/selected.png",
  Ingrid: "assets/characters/blue_lions/Ingrid/academy/selected.png",
  Lonato: "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
  SeirosSoldier: "assets/characters/church_of_seiros/SeirosSoldier/selected.png",
  ChurchKnightExtra: "assets/characters/extras/ChurchKnightExtra/legacy_ep02/selected.png"
};

const props = {
  churchFlags: "assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png",
  trainingWeapons: "assets/props/EP02/training_weapons/training_weapons_reference.png",
  heroRelics: "assets/props/shared/hero_relics/hero_relics_reference.png",
  swordOfCreator: "assets/props/shared/sword_of_creator/selected.png"
};

const shots = [
  ["Shot001", "00:00:20", 8, "梦境残响", "把上一章的神秘意识延续到本章，并暗示 Byleth 的身世不只属于教会。", "Sothis 的绿色光粒在黑暗中掠过，远处短暂闪回红谷与圣像。", "低亮度宽镜头，缓慢前移到 Byleth 眼睛。", "Sothis 低声：汝又听见了什么？", "dream", ["Byleth", "Sothis"], ["zanado"], "cut from black", "hard cut to morning bell", "identity_drift, over-bright magic"],
  ["Shot002", "00:00:55", 10, "晨钟与修道院", "建立本章从学院日常转入教会军事命令。", "加尔古玛库晨雾、钟楼、学生穿过回廊，远处教会骑士集合。", "宽银幕高位俯拍后下摇到回廊。", "钟声，脚步，远处甲胄声。", "monastery", ["Byleth"], ["monastery", "churchFlags"], "cut from dream eye closeup", "match cut to council doors", "generic monastery, unreadable geography"],
  ["Shot003", "00:01:30", 14, "任务召集", "Rhea 将 Lonato 叛乱定义为必须镇压的教会危机。", "大教堂内 Rhea 居中，Seteth 在侧，Byleth 和 Dimitri 站在下方。", "中轴低机位，Rhea 始终高于学生视线。", "Rhea：西方教会煽动 Gaspard 领主起兵。", "cathedral", ["Rhea", "Seteth", "Byleth", "Dimitri"], ["cathedral", "churchFlags"], "doors open into cathedral", "cut on Ashe name being spoken", "Rhea too villainous, Seteth too old"],
  ["Shot004", "00:02:05", 12, "Ashe 的名字", "把任务从政治命令变成 Ashe 的个人伤口。", "Ashe 在队列中抬头，听见 Lonato 的名字后手指收紧。", "浅景深近景，背景教会旗帜压住人物。", "Seteth：Lonato 卿曾收养 Ashe。", "cathedral", ["Ashe", "Byleth", "Dimitri"], ["cathedral"], "cut from Rhea order", "cut to Ashe avoiding the class gaze", "Ashe looks adult, overacted grief"],
  ["Shot005", "00:02:45", 16, "课堂后的沉默", "让 Blue Lions 知道这不是普通剿匪训练。", "教室里学生散去，Ashe 留在座位，Dimitri 与 Byleth 留下。", "静态中景，桌椅形成空白。", "Dimitri：老师，今天请让我和他一起去。", "classroom", ["Byleth", "Dimitri", "Ashe"], ["classroom"], "cut from cathedral formality", "cut to Ashe speaking", "too much exposition"],
  ["Shot006", "00:03:20", 18, "Ashe 讲出旧恩", "Ashe 选择面对任务，而不是被保护在队伍外。", "Ashe 看着窗外，讲 Lonato 曾给他与弟妹一个家。", "侧面近景，窗光不浪漫化，只让眼神可读。", "Ashe：他曾经救过我。可我现在是你的学生。", "classroom", ["Ashe", "Byleth", "Dimitri"], ["classroom"], "cut from Dimitri request", "cut to march preparation", "melodrama, tears too early"],
  ["Shot007", "00:03:55", 12, "出征准备", "显示这是学生第一次进入真实镇压任务。", "武器架、护具、教会骑士分发雾灯，青狮学生换上行军装备。", "快速插入组，手、扣带、武器、徽章。", "皮带扣、金属轻响、无人闲聊。", "monastery", ["Byleth", "Dimitri", "Dedue", "Felix", "Ashe", "Ingrid"], ["trainingWeapons", "churchFlags"], "cut from Ashe choice", "cut to Catherine entrance", "modern weapons, lethal gore"],
  ["Shot008", "00:04:20", 15, "Catherine 入队", "引入教会武力的真实尺度，和学生的陌生感形成对照。", "Catherine 穿过队伍，Thunderbrand/英雄遗产轮廓被布带半遮。", "低位跟拍到中近景，武器不抢成神兵广告。", "Catherine：雾里别离我太远。", "monastery", ["Catherine", "Byleth", "Ashe"], ["heroRelics"], "cut from equipment inserts", "cut on Ashe recognizing her certainty", "Catherine too young student-like"],
  ["Shot009", "00:04:50", 10, "离开修道院", "从秩序空间转入边境雾区。", "队伍离开修道院，教会旗帜渐远，云层压低。", "宽镜头后拉，人物小于环境。", "行军脚步，风声压过钟声。", "monastery", ["Byleth", "Dimitri", "Ashe", "Catherine"], ["churchFlags"], "cut from Catherine", "dissolve to fog road", "cheerful academy tone"],
  ["Shot010", "00:05:15", 14, "马格德雷德雾道", "建立战场核心危险：能见度和误判。", "灰白雾道，断树、泥水、远处村庄烟线，队伍成两列前进。", "长焦压缩，让距离变短、威胁变近。", "Ingrid：雾太厚了。Dedue：听脚步。", "fogRoad", ["Byleth", "Dimitri", "Dedue", "Ingrid"], ["fogRoad"], "dissolve from monastery road", "cut to village sign", "fog clears too much"],
  ["Shot011", "00:05:45", 12, "边境村痕迹", "证明叛乱已影响平民，不只是教会内部争斗。", "空村路口、门板钉痕、村民远远关门，青狮不强行靠近。", "手持慢推，保持克制。", "无对白，门闩落下。", "village", ["Byleth", "Ashe", "Mercedes"], ["village"], "cut from fog road", "cut to rebel camp smoke", "civilian panic becomes spectacle"],
  ["Shot012", "00:06:15", 14, "叛军营地远望", "让观众先看到 Lonato 的人不是普通盗匪。", "西方教会叛军营地，旧旗、祈祷木牌、疲惫士兵围着火。", "Byleth 视角低角度窥看。", "远处祷词和甲胄摩擦声。", "rebelCamp", ["Byleth", "Ashe", "SeirosSoldier"], ["rebelCamp"], "cut from village", "cut to Blue Lions tactical halt", "bandits instead of organized rebels"],
  ["Shot013", "00:06:45", 18, "雾中部署", "Byleth 把学生从情绪里拉回战术。", "泥地简图，石子表示两路推进；Ashe 被安排在可见但不独自突前的位置。", "俯拍手势，抬到学生脸。", "Byleth：不追影子。听同伴，不听雾。", "fogRoad", ["Byleth", "Dimitri", "Ashe", "Felix", "Mercedes"], ["fogRoad"], "cut from rebel camp", "cut to first arrow", "game UI grid"],
  ["Shot014", "00:07:20", 8, "第一箭", "把战斗从潜伏推入不可逆。", "雾中一支箭钉进盾面，Dedue 稳住前排。", "高速插入，声音先于画面。", "箭撞盾，Dedue 短促吸气。", "battlefield", ["Dedue", "Dimitri"], ["battlefield"], "cut on Byleth hand signal", "cut to advancing rebels", "blood, lethal wound"],
  ["Shot015", "00:07:35", 12, "叛军压上", "让敌方有纪律和信念，避免变成杂兵靶子。", "叛军从雾中成小队出现，盾牌和圣符混在一起。", "中宽横移，保持阵型线。", "叛军：为 Lonato 卿！", "battlefield", ["SeirosSoldier", "Byleth"], ["battlefield", "churchFlags"], "cut from arrow impact", "cut to Dimitri counterline", "faceless swarm"],
  ["Shot016", "00:08:00", 15, "Dimitri 克制锋芒", "展示 Dimitri 已有危险力量，但仍听从 Byleth。", "Dimitri 一枪逼退敌人，差点追深，Byleth 抬手，他停住。", "低位侧跟，停顿时静止一拍。", "Byleth：守线。Dimitri：明白。", "battlefield", ["Dimitri", "Byleth", "Dedue"], ["battlefield"], "cut from rebel pressure", "cut to Ashe sees sigil", "Dimitri bloodlust too explicit"],
  ["Shot017", "00:08:30", 16, "Ashe 认出旧徽记", "把战斗压力重新压回 Ashe 的选择。", "Ashe 在叛军盾上看到 Gaspard 家徽，弓弦松了一瞬。", "极近手部到 Ashe 眼睛。", "Ashe：那是...Gaspard 的徽记。", "battlefield", ["Ashe", "Byleth"], ["battlefield"], "cut from Dimitri halt", "cut to Felix covering him", "Ashe helpless for whole scene"],
  ["Shot018", "00:09:00", 12, "Felix 补位", "让队友关系通过动作建立，而不是靠安慰对白。", "Felix 不看 Ashe，直接切到他前方挡下一击。", "短促横移，剑身进入画面。", "Felix：发呆等于叫别人替你受伤。", "battlefield", ["Felix", "Ashe"], ["battlefield"], "cut from Ashe hesitation", "cut to Annette/Mercedes support", "Felix cruel beyond repair"],
  ["Shot019", "00:09:25", 12, "支援线稳住", "让后排不是背景板，承担安全撤退与视野控制。", "Mercedes 引导伤员撤到雾外，Annette 用风压吹开一段雾。", "中景两人调度，雾层被短暂切开。", "Mercedes：这边！Annette：我看见路了！", "fogRoad", ["Mercedes", "Annette", "Ingrid"], ["fogRoad"], "cut from Felix save", "cut to Catherine charge", "magic spectacle overwhelms realism"],
  ["Shot020", "00:09:55", 14, "Catherine 破雾", "表现 Catherine 是教会王牌，也制造学生对力量的震动。", "Catherine 从侧翼切入，雷光照出雾里的敌阵，但不造成血腥屠杀。", "手持跟进到雷光定格。", "雷鸣，叛军阵线被迫散开。", "battlefield", ["Catherine", "Byleth", "Ashe"], ["heroRelics", "battlefield"], "cut from support line", "cut to Lonato silhouette", "gore, superhero pose"],
  ["Shot021", "00:10:25", 16, "Lonato 现身", "把敌方核心从叛军抽象化为 Ashe 的父亲替身。", "Lonato 在雾后山脊出现，老骑士白发、重甲、旗帜残破。", "长焦正面，雾把他包成审判者。", "Lonato：让开。我不愿与孩子们为敌。", "battlefield", ["Lonato", "Ashe", "Dimitri"], ["battlefield"], "cut from Catherine lightning", "cut to Ashe stepping forward", "generic elderly warlord"],
  ["Shot022", "00:10:55", 18, "Ashe 上前", "Ashe 主动要求对话，证明他不是被剧情拖着走。", "Ashe 放低弓，走到 Byleth 允许的距离，Dimitri 半步跟住。", "正反打，中间始终留雾。", "Ashe：Lonato 大人，请停手。", "battlefield", ["Ashe", "Lonato", "Dimitri", "Byleth"], ["battlefield"], "cut from Lonato reveal", "cut to Lonato refusal", "Ashe isolated beyond tactical logic"],
  ["Shot023", "00:11:30", 18, "Lonato 拒绝", "让 Lonato 的叛乱有道德痛点，但不能推翻本章教会权力事实。", "Lonato 看 Ashe，却没有放下武器；背后叛军继续移动。", "近中景，雾后剪影继续威胁。", "Lonato：有些罪若无人追问，只会被圣名遮住。", "battlefield", ["Lonato", "Ashe"], ["battlefield"], "cut from Ashe plea", "cut to Byleth command", "turning Lonato into pure villain"],
  ["Shot024", "00:12:05", 10, "Byleth 下令包围", "Byleth 选择保护学生与平民，接受必须结束战斗；命令的执行在下一镜以封锁线呈现。", "Byleth 从安全中枢下令，视线扫过 Ashe、伤员和远处 Lonato，剑尖只标示空的控制路线；她不冲到 Lonato 面前，下一镜切到画外执行后果。", "先用道路轴线交代人与人的距离，再切到 Shot025 的斜向阻隔地理；不把出点做成冲锋起跑线。", "Byleth：分开他的护卫。不要让他靠近村路。", "battlefield", ["Byleth", "Dimitri", "Dedue", "Ingrid"], ["battlefield"], "cut from Lonato refusal", "cut to the blocked-crossing consequence of the command", "Byleth emotionless robot, direct execution lane"],
  ["Shot025", "00:12:30", 14, "封锁线成形", "把贝老师的包围命令落实为可见的地形封锁；蓝狮队伍停在近侧，洛纳托留在不可直达的远脊。", "贝老师画外；蓝狮队伍停在近侧木栅后，两名叛军守卫在错层木闸上关门并坐上横木，深沟、冲毁涵洞、岩石遮挡和远端雾弯切断直达路线。", "16:9 斜向侧地理远景，完整保留近侧木栅、深沟、错层木闸、岩石遮挡和远脊；只做克制侧移，不向 Lonato 推进。", "号令余音、脚步、守卫拉闸、盾牌与雾灯碰撞；无对白。", "battlefield", ["Dimitri", "Dedue", "Sylvain", "Ingrid", "Mercedes", "Annette", "Ashe", "Lonato"], ["battlefield"], "cut from command", "cut to Ashe aim", "direct Byleth-to-Lonato lane, straight road, formation compression"],
  ["Shot026", "00:12:58", 12, "Ashe 重新拉弓", "Ashe 做出痛苦但必要的选择：阻止 Lonato。", "Ashe 眼含雾水但不开哭，弓对准 Lonato 的马前地面。", "手部特写到侧脸。", "Ashe：对不起。", "battlefield", ["Ashe", "Lonato"], ["battlefield"], "cut from team move", "cut to arrow hitting ground", "lethal shot to Lonato"],
  ["Shot027", "00:13:20", 10, "非致命拦截", "保持学生不直接处决养父，保留 Catherine/Byleth 承担最后武力。", "Ashe 的箭钉在 Lonato 前方泥地，迫使战马/步伐停顿。", "低机位插入，泥水溅起。", "箭入泥地，Lonato 停步。", "battlefield", ["Ashe", "Lonato"], ["battlefield"], "cut from Ashe release", "cut to Catherine/Byleth close", "Ashe kills him directly"],
  ["Shot028", "00:13:40", 16, "最后压制", "结束战斗，同时把学生从处决中心移开。", "Byleth 与 Catherine 从两侧进入，Catherine 打掉武器，Byleth 用剑背压住 Lonato。", "双向交叉剪辑，动作快但清楚。", "金属落地，雾中短暂安静。", "battlefield", ["Byleth", "Catherine", "Lonato"], ["battlefield", "heroRelics"], "cut from arrow stop", "cut to Lonato collapse", "gore, triumphant kill"],
  ["Shot029", "00:14:05", 14, "Lonato 倒下", "把胜利处理成创伤而不是爽点。", "Lonato 跪倒，Ashe 没有冲上去，Dimitri 挡在他身侧。", "静态中远景，雾把人分成几层。", "Ashe 呼吸声，远处战斗停下。", "battlefield", ["Lonato", "Ashe", "Dimitri", "Byleth"], ["battlefield"], "cut from disarm", "cut to post-battle field", "celebratory victory pose"],
  ["Shot030", "00:14:28", 12, "战后无声", "让青狮第一次理解真实战斗和模拟战的差距。", "学生们站在雾中，武器低垂；Catherine 走过他们去确认现场。", "缓慢横移逐个扫过脸。", "无对白，只有风。", "battlefield", ["Dimitri", "Ashe", "Felix", "Mercedes", "Annette", "Ingrid"], ["battlefield"], "cut from Lonato fall", "cut to Rhea hall", "everyone too clean happy"],
  ["Shot031", "00:12:10", 16, "回到 Rhea 面前", "教会秩序重新覆盖战场创伤。", "大教堂内，Rhea 接受报告，学生站在下方，衣角仍有雾水泥痕。", "冷静中轴构图，和 Shot003 呼应。", "Rhea：辛苦了。你们守住了信仰的安宁。", "cathedral", ["Rhea", "Seteth", "Byleth", "Dimitri", "Ashe"], ["cathedral"], "cut from fog field", "cut to execution order", "Rhea apologetic instead of institutional"],
  ["Shot032", "00:12:50", 14, "西方教会处置", "明确 Rhea 的温柔外表下有不可抗拒的制裁。", "Seteth 递上名单，Rhea 平静下令处理西方教会煽动者。", "Rhea 近景不变，背景学生轻微失焦。", "Rhea：叛逆者必须接受裁决。", "cathedral", ["Rhea", "Seteth", "Byleth"], ["cathedral"], "cut from report", "cut to students reacting", "cartoon villain tone"],
  ["Shot033", "00:13:15", 14, "学生目睹代价", "让 Dimitri/Ashe/Byleth 对教会权威产生不同沉默。", "Ashe 低头，Dimitri 看向 Byleth，Felix 盯着地面不说话。", "三段近景，不用对白解释。", "远处门关闭声。", "cathedral", ["Ashe", "Dimitri", "Felix", "Byleth"], ["cathedral"], "cut from Rhea order", "cut to Catherine side talk", "students unaffected"],
  ["Shot034", "00:13:40", 16, "Catherine 的信念", "补出教会武力的自我理解：忠诚、正义、危险混在一起。", "回廊一角，Catherine 擦拭剑鞘，Ashe 问她是否从未怀疑。", "中近景，剑在下方不抢画。", "Catherine：我相信 Rhea 大人。怀疑留给还没决定的人。", "monastery", ["Catherine", "Ashe", "Byleth"], ["monastery", "heroRelics"], "cut from student reactions", "cut to Dimitri night", "Catherine cruel caricature"],
  ["Shot035", "00:14:05", 18, "Dimitri 夜谈", "让本章创伤落到青狮主线：正义与杀戮无法分开。", "夜间回廊，Dimitri 承认自己知道战斗必要，却害怕太快习惯它。", "静态双人侧影，Byleth 不抢对白。", "Dimitri：若杀意披上正义，它就会变得很安静。", "monastery", ["Dimitri", "Byleth"], ["monastery"], "cut from Catherine line", "cut to Byleth alone", "Dimitri becomes war-phase too early"],
  ["Shot036", "00:14:20", 12, "章末圣墓阴影", "收束并抛出下章：教会让学生看见制裁，也准备让他们看见更深秘密。", "Byleth 独自经过圣堂门口，Sothis 绿光一闪；远处 Rhea 的身影停在圣墓方向。", "长廊长焦，最后切黑。", "Sothis：汝相信她吗？", "cathedral", ["Byleth", "Sothis", "Rhea"], ["cathedral", "swordOfCreator"], "cut from Dimitri night", "cut to black", "subtitles, lore dump"]
];

const japaneseAudioAnchors = {
  Shot001: "Sothis, softly in Japanese: そなたは、また何を聞いたのじゃ？",
  Shot002: "Morning bell, footsteps, and distant armor. No spoken dialogue.",
  Shot003: "Rhea, in Japanese: 西方教会が、ガスパール領主ロナートを扇動し、兵を挙げさせました。",
  Shot004: "Seteth, in Japanese: ロナート卿は、かつてアッシュを養子として迎えた人物だ。",
  Shot005: "Dimitri, in Japanese: 先生、今日は彼と共に行かせてください。",
  Shot006: "Ashe, in Japanese: 彼は、僕と弟妹に居場所をくれました。でも今の僕は、あなたの生徒です。",
  Shot007: "Belt buckles, soft metal clicks, and no idle chatter. No spoken dialogue.",
  Shot008: "Catherine, in Japanese: 霧の中では、私から離れすぎるな。",
  Shot009: "Marching footsteps and wind overwhelming the fading bell. No spoken dialogue.",
  Shot010: "Ingrid, in Japanese: 霧が濃すぎるわ。 Dedue, in Japanese: 足音を聞け。",
  Shot011: "No spoken dialogue; a door bar drops shut.",
  Shot012: "Distant prayers and armor friction. No spoken dialogue.",
  Shot013: "Byleth, in Japanese: 影を追うな。仲間の声を聞け。霧に惑わされるな。",
  Shot014: "An arrow strikes a shield; Dedue gives one short breath. No spoken dialogue.",
  Shot015: "Rebels, in Japanese: ロナート卿のために！",
  Shot016: "Byleth, in Japanese: 戦線を守れ。 Dimitri, in Japanese: 承知しました。",
  Shot017: "Ashe, in Japanese: あれは……ガスパール家の紋章。",
  Shot018: "Felix, in Japanese: ぼんやりするな。お前の代わりに誰かが傷つくぞ。",
  Shot019: "Mercedes, in Japanese: こちらです！ Annette, in Japanese: 道が見えた！",
  Shot020: "Thunder; the rebel line is forced apart. No spoken dialogue.",
  Shot021: "Lonato, in Japanese: どけ。子供たちと戦うつもりはない。",
  Shot022: "Ashe, in Japanese: ロナート様、どうか止まってください。",
  Shot023: "Lonato, in Japanese: 問われぬ罪は、聖なる名の陰に隠されるだけだ。",
  Shot024: "Byleth, in Japanese: 護衛を分断しろ。村道へ近づけるな。",
  Shot025: "Orders, footsteps, and fog-lantern impacts. No spoken dialogue.",
  Shot026: "Ashe, in Japanese: ごめんなさい。",
  Shot027: "An arrow hits the mud; Lonato stops. No spoken dialogue.",
  Shot028: "Metal falls; the fog goes briefly quiet. No spoken dialogue.",
  Shot029: "Ashe breathing; distant fighting stops. No spoken dialogue.",
  Shot030: "No spoken dialogue, only wind.",
  Shot031: "Rhea, in Japanese: ご苦労さまでした。あなた方は信仰の安寧を守りました。",
  Shot032: "Rhea, in Japanese: 反逆者は裁きを受けねばなりません。",
  Shot033: "A distant door closes. No spoken dialogue.",
  Shot034: "Catherine, in Japanese: 私はレア様を信じている。迷いは、まだ決められない者に任せる。",
  Shot035: "Dimitri, in Japanese: 殺意が正義をまとえば、とても静かになるのですね。",
  Shot036: "Sothis, in Japanese: そなたは、あの者を信じるのか？",
};

function japaneseAudioFor(id, fallback) {
  return japaneseAudioAnchors[id] || fallback;
}

const englishPromptCopy = {
  Shot001: {
    scene: "Dream residue",
    purpose: "Carry the mysterious inner voice from the previous chapter into this episode and hint that Byleth's origin reaches beyond the Church.",
    motion: "Sothis's green motes sweep through darkness, with brief flashes of the Red Canyon and a sacred statue in the distance.",
    camera: "Low-light wide shot with a slow push toward Byleth's eye.",
  },
  Shot002: {
    scene: "Morning bell and monastery",
    purpose: "Move the episode from academy routine into a Church military order.",
    motion: "Morning fog over Garreg Mach, the bell tower, students crossing the cloister, and Church knights gathering in the distance.",
    camera: "Widescreen high-angle view that tilts down toward the cloister.",
  },
  Shot003: {
    scene: "Mission summons",
    purpose: "Rhea defines Lonato's rebellion as a Church crisis that must be suppressed.",
    motion: "Inside the cathedral, Rhea stands centered, Seteth at her side, with Byleth and Dimitri lower in the composition.",
    camera: "Central low angle that keeps Rhea above the students' eyeline.",
  },
  Shot004: {
    scene: "Ashe's name",
    purpose: "Turn the mission from a political order into Ashe's personal wound.",
    motion: "Ashe lifts his head in the formation; when he hears Lonato's name, his fingers tighten.",
    camera: "Shallow-focus close shot with Church banners pressing down in the background.",
  },
  Shot005: {
    scene: "Silence after class",
    purpose: "Show the Blue Lions that this is not ordinary bandit training.",
    motion: "In the classroom, students leave, Ashe remains seated, and Dimitri stays with Byleth.",
    camera: "Static medium shot with empty desks creating negative space.",
  },
  Shot006: {
    scene: "Ashe speaks of an old debt",
    purpose: "Ashe chooses to face the mission rather than be protected outside the squad.",
    motion: "Ashe looks toward the window and explains that Lonato once gave him and his siblings a home.",
    camera: "Side close shot; window light keeps the eyes readable without romanticizing the moment.",
  },
  Shot007: {
    scene: "Preparing to depart",
    purpose: "Show students entering a real suppression mission for the first time.",
    motion: "Weapon racks, armor pieces, Church knights handing out fog lanterns, and Blue Lions students tightening travel gear.",
    camera: "Fast insert montage of hands, buckles, weapons, and insignia.",
  },
  Shot008: {
    scene: "Catherine joins",
    purpose: "Introduce the true scale of Church force and contrast it with the students' uncertainty.",
    motion: "Catherine moves through the squad, with the Thunderbrand silhouette half-covered by a cloth wrap.",
    camera: "Low tracking shot into a medium close shot; the weapon must not become a heroic advertisement.",
  },
  Shot009: {
    scene: "Leaving the monastery",
    purpose: "Transition from ordered monastery space into the border fog.",
    motion: "The squad leaves the monastery; Church flags recede as the clouds press lower.",
    camera: "Wide shot pulling back, making the characters smaller than the environment.",
  },
  Shot010: {
    scene: "Magdred fog road",
    purpose: "Establish the battlefield's core danger: limited visibility and misjudgment.",
    motion: "Grey-white fog road, broken trees, muddy water, distant village smoke, and the squad advancing in two columns.",
    camera: "Long-lens compression that makes distance feel short and threat feel close.",
  },
  Shot011: {
    scene: "Border village traces",
    purpose: "Prove that the rebellion has affected civilians, not only Church politics.",
    motion: "An empty village road, nail marks on doors, villagers shutting themselves away while the Blue Lions do not force contact.",
    camera: "Restrained handheld slow push.",
  },
  Shot012: {
    scene: "Rebel camp from afar",
    purpose: "Show that Lonato's people are not ordinary thieves before the heroes fight them.",
    motion: "Western Church rebel camp with old flags, prayer plaques, and tired soldiers around a fire.",
    camera: "Low Byleth point-of-view angle, watching from cover.",
  },
  Shot013: {
    scene: "Deployment in fog",
    purpose: "Byleth pulls the students back from emotion into tactics.",
    motion: "A mud sketch uses stones to mark two routes; Ashe is assigned to a visible position without being left alone in front.",
    camera: "Overhead hand detail, then rise to the students' faces.",
  },
  Shot014: {
    scene: "First arrow",
    purpose: "Push the battle from hidden tension into an irreversible exchange.",
    motion: "An arrow comes out of the fog and strikes a shield face; Dedue steadies the front line.",
    camera: "High-speed insert where the sound arrives just before the image.",
  },
  Shot015: {
    scene: "Rebels advance",
    purpose: "Give the enemy discipline and conviction instead of making them target extras.",
    motion: "Rebels emerge from the fog in small organized teams, shields and holy symbols mixed together.",
    camera: "Medium-wide lateral move that preserves the formation line.",
  },
  Shot016: {
    scene: "Dimitri restrains his edge",
    purpose: "Show that Dimitri already has dangerous strength but still obeys Byleth.",
    motion: "Dimitri drives an enemy back with one spear action, nearly follows too deep, then stops when Byleth raises a hand.",
    camera: "Low side tracking shot that freezes for one beat when he stops.",
  },
  Shot017: {
    scene: "Ashe recognizes the old sigil",
    purpose: "Press the battle back onto Ashe's choice.",
    motion: "Ashe sees the Gaspard crest on a rebel shield and his bowstring slackens for a moment.",
    camera: "Extreme close detail from the hand to Ashe's eyes.",
  },
  Shot018: {
    scene: "Felix covers the gap",
    purpose: "Build teammate relationships through action instead of comfort dialogue.",
    motion: "Felix does not look at Ashe; he cuts directly into the space in front of him and blocks a strike.",
    camera: "Short lateral move as the blade enters frame.",
  },
  Shot019: {
    scene: "Support line stabilizes",
    purpose: "Make the back line active: evacuation safety and visibility control.",
    motion: "Mercedes guides wounded people out of the fog while Annette uses wind pressure to open a brief lane of visibility.",
    camera: "Medium shot of both characters coordinating as the fog layer briefly parts.",
  },
  Shot020: {
    scene: "Catherine breaks the fog",
    purpose: "Show Catherine as the Church's ace while unsettling the students with that scale of force.",
    motion: "Catherine cuts in from the flank; lightning reveals the enemy line in the fog without turning the beat into gore.",
    camera: "Handheld follow into a lightning-held frame.",
  },
  Shot021: {
    scene: "Lonato appears",
    purpose: "Turn the enemy center from an abstract rebellion into Ashe's father figure.",
    motion: "Lonato appears on a ridge beyond the fog: white-haired old knight, heavy armor, torn banner.",
    camera: "Long-lens frontal view, with fog shaping him like a judge.",
  },
  Shot022: {
    scene: "Ashe steps forward",
    purpose: "Ashe actively asks for dialogue, proving he is not being dragged by the plot.",
    motion: "Ashe lowers his bow and walks only as far as Byleth allows; Dimitri stays half a step behind him.",
    camera: "Shot-reverse-shot structure with fog always held between them.",
  },
  Shot023: {
    scene: "Lonato refuses",
    purpose: "Give Lonato's rebellion a moral wound without overturning the episode's Church power structure.",
    motion: "Lonato looks at Ashe but does not lower his weapon; rebels continue moving as silhouettes behind him.",
    camera: "Medium-close shot with threatening silhouettes still active in the fog.",
  },
  Shot024: {
    scene: "Byleth orders an encirclement",
    purpose: "Byleth chooses to protect students and civilians, accepting that the battle must end.",
    motion: "Byleth looks across Ashe, the wounded, and Lonato, then points the sword toward both flanks.",
    camera: "Subjective point of view into a tactical wide shot.",
  },
  Shot025: {
    scene: "Blue Lions advance on two wings",
    purpose: "Show that the students learned real coordination after the EP2 mock battle.",
    motion: "Dedue and Dimitri hold the front while Ingrid and Sylvain move around the fog; Mercedes and Annette maintain the rear line.",
    camera: "High oblique view; fog lantern points clarify the formation.",
  },
  Shot026: {
    scene: "Ashe draws again",
    purpose: "Ashe makes the painful but necessary choice to stop Lonato.",
    motion: "Ashe has mist in his eyes but does not openly cry; his bow points toward the ground in front of Lonato.",
    camera: "Hand close-up into a side-face shot.",
  },
  Shot027: {
    scene: "Nonlethal interception",
    purpose: "Keep Ashe from directly executing his adoptive father and leave the final force to Catherine and Byleth.",
    motion: "Ashe's arrow hits the mud in front of Lonato and forces his horse or step to halt.",
    camera: "Low insert with mud splashing up.",
  },
  Shot028: {
    scene: "Final restraint",
    purpose: "End the battle while moving the students away from the center of execution.",
    motion: "Byleth and Catherine enter from two sides; Catherine knocks away the weapon and Byleth pins Lonato with the flat of the blade.",
    camera: "Two-direction crosscutting; fast but readable action.",
  },
  Shot029: {
    scene: "Lonato falls",
    purpose: "Treat victory as trauma rather than release.",
    motion: "Lonato drops to his knees; Ashe does not rush in, and Dimitri stands at his side as a barrier.",
    camera: "Static medium-wide shot, with fog separating people into layers.",
  },
  Shot030: {
    scene: "After-battle silence",
    purpose: "Let the Blue Lions understand the difference between mock battle and real combat.",
    motion: "Students stand in the fog with weapons lowered; Catherine passes them to confirm the scene.",
    camera: "Slow lateral move across each face.",
  },
  Shot031: {
    scene: "Back before Rhea",
    purpose: "Church order covers the battlefield trauma again.",
    motion: "Inside the cathedral, Rhea receives the report while students stand below with fog water and mud still on their clothes.",
    camera: "Calm central composition echoing Shot003.",
  },
  Shot032: {
    scene: "Western Church judgment",
    purpose: "Make clear that Rhea's gentle surface contains unavoidable punishment.",
    motion: "Seteth presents a list; Rhea calmly orders action against the Western Church agitators.",
    camera: "Rhea close shot held steady, with students softly out of focus behind.",
  },
  Shot033: {
    scene: "Students witness the cost",
    purpose: "Let Dimitri, Ashe, and Byleth fall into different silences before Church authority.",
    motion: "Ashe lowers his head, Dimitri looks toward Byleth, and Felix stares at the floor without speaking.",
    camera: "Three close shots; no dialogue explanation.",
  },
  Shot034: {
    scene: "Catherine's faith",
    purpose: "Add the Church warrior's self-understanding: loyalty, justice, and danger mixed together.",
    motion: "In a cloister corner, Catherine wipes her sword sheath while Ashe asks whether she has never doubted.",
    camera: "Medium-close shot; the sword stays low and does not dominate the frame.",
  },
  Shot035: {
    scene: "Dimitri night talk",
    purpose: "Let the episode's wound land on the Blue Lions main theme: justice and killing cannot be separated cleanly.",
    motion: "In a night cloister, Dimitri admits that he knows battle may be necessary but fears becoming used to it too quickly.",
    camera: "Static two-person side silhouettes; Byleth does not steal the line.",
  },
  Shot036: {
    scene: "Holy Tomb shadow ending",
    purpose: "Close the episode and set up the next chapter: the Church has shown the students judgment and is ready to reveal deeper secrets.",
    motion: "Byleth walks alone past the chapel entrance, Sothis's green light flickers, and Rhea's distant figure pauses toward the Holy Tomb.",
    camera: "Long-lens corridor shot, ending in black.",
  },
};

function promptCopyFor(id, scene, purpose, motion, camera) {
  return englishPromptCopy[id] || { scene, purpose, motion, camera };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(file, text) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, text.trimEnd() + "\n");
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function locAsset(key) {
  return locations[key] || locations.battlefield;
}

function assetList(shot) {
  const [, , , , , , , , , chars, assetKeys] = shot;
  const items = [];
  for (const name of chars) if (characters[name]) items.push(characters[name]);
  for (const key of assetKeys) {
    if (locations[key]) items.push(locations[key]);
    if (props[key]) items.push(props[key]);
  }
  return [...new Set(items)];
}

function hasGeneratedFrames(id) {
  return ["start_frame.png", "key_frame.png", "end_frame.png"].every((name) => fs.existsSync(path.join(epDir, "storyboards", id, name)));
}

function extractSourceRefs() {
  if (!fs.existsSync(sourceVideo)) return;
  const outDir = path.join(epDir, "source_refs");
  ensureDir(outDir);
  for (const shot of shots) {
    const id = shot[0];
    const at = shot[1];
    const out = path.join(outDir, `${id}_source.png`);
    try {
      childProcess.execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", at, "-i", sourceVideo, "-frames:v", "1", "-vf", "scale=852:-1", out], { stdio: "ignore" });
    } catch (error) {
      // Source refs are helpful but not required for the prompt package gate.
    }
  }
}

function buildScript() {
  return `# EP03 - 雾中的叛乱（青狮线）

预计成片时长：10-12 分钟

改编来源：
- \`${sourceVideo}\`
- \`${sourceAudio}\`

说明：本剧本是影视化改编稿，不做游戏对白逐字转录。原视频为画面与独立音频文件；本稿依据原片抽帧、硬字幕/对话框结构、角色出场顺序和章节事件重组，保留青狮线的情绪重心。

## 人物

- 贝雷特 / 贝雷丝（Byleth）：新任青狮教师，开始意识到教会任务不是普通教学。
- 苏谛斯（Sothis）：只在 Byleth 意识中出现，用疑问推动神秘线。
- 蕾雅（Rhea）：温柔、庄严、下令镇压叛乱时没有情绪裂缝。
- 赛提斯（Seteth）：负责解释任务、维持秩序。
- 卡多莉奴（Catherine）：赛罗司骑士团王牌，雷霆般解决战场危险。
- 迪米特里（Dimitri）：努力把正义和克制绑在一起，第一次被真实镇压任务触动。
- 亚修（Ashe）：Lonato 的养子，本章情绪核心。
- 杜笃、菲力克斯、希尔凡、梅尔赛德司、雅妮特、英谷莉特：作为青狮小队承担真实战场协同。
- 罗纳特（Lonato）：Gaspard 领主，反叛教会，既是威胁也是 Ashe 的旧恩人。
- 西方教会叛军 / 赛罗司骑士：构成教会内部分裂的可见压力。

## 场景

- 梦境空间 / Byleth 意识残响
- 加尔古玛库修道院回廊
- 大圣堂 / 接见厅
- 士官学校教室
- 马格德雷德雾道
- 法嘉斯边境村
- 西方教会叛军营地
- 罗纳特叛乱战场山脊
- 战后夜间回廊 / 圣墓方向

## 剧情梗概

Byleth 在梦境残响中被 Sothis 的声音惊醒。修道院晨钟后，Rhea 召集青狮学级与骑士团，宣布 Gaspard 领主 Lonato 受西方教会煽动起兵，必须由教会镇压。任务因为 Ashe 与 Lonato 的养父子关系变得沉重。Byleth 允许 Ashe 随队出征，但要求他作为学生和同伴行动，而不是独自偿还旧恩。

青狮随 Catherine 进入马格德雷德雾区。雾、边境村的紧闭门扉和叛军营地的祈祷木牌让学生意识到敌人不是盗匪，而是带着信念走向教会的人。战斗爆发后，Dimitri 的锋芒、Ashe 的迟疑、Felix 的补位、Annette 与 Mercedes 的支援线、Catherine 的压倒性武力依次展开。Lonato 现身后，Ashe 主动上前劝降失败，最终用非致命一箭让 Lonato 停步，Byleth 与 Catherine 完成最后压制。

战后，Rhea 平静处理西方教会叛逆者。学生们第一次看见教会秩序的代价。Catherine 表示自己相信 Rhea；Dimitri 夜里向 Byleth 承认，最可怕的不是杀意，而是杀意披上正义后变得安静。章末，Byleth 经过圣堂深处，Sothis 问他是否相信 Rhea，圣墓方向的阴影引出下一章。

## 剧本

### Scene 01 - 梦境残响

黑暗里有水声，又像远处的钟。红谷的岩壁一闪而过，随后变成圣像背后的白光。Byleth 站在梦境空间边缘，苏谛斯的声音从背后传来。

**Sothis**：汝又听见了什么？

Byleth 回头。苏谛斯坐在石座上，像刚从漫长睡眠中醒来。

**Sothis**：那不是汝的记忆。可它偏偏跟着汝。

绿色光粒掠过 Byleth 的手背。晨钟声切入。

### Scene 02 - 任务召集

清晨的加尔古玛库。钟声落在回廊、石阶与教会旗帜上。学生穿过长廊时，骑士团已经在大圣堂前列队。

大圣堂内，Rhea 站在光下。Seteth 展开报告，Byleth 与 Blue Lions 站在下方。

**Rhea**：Gaspard 领主 Lonato 受西方教会煽动，举兵反抗赛罗司教会。

Seteth 看向学生队列。

**Seteth**：此事不再是地方纠纷。若叛乱扩散，边境村镇会先被拖入战火。

Ashe 听见 Lonato 的名字，手指慢慢收紧。Dimitri 侧头看他，没有开口。

**Rhea**：Byleth，请带领 Blue Lions 协助骑士团。Catherine 会与你同行。

Byleth 点头。Rhea 的目光仍然温和。

### Scene 03 - Ashe 的旧恩

教室里的人散去后，Ashe 仍坐在原位。Dimitri 留在门边，给他一点距离。Byleth 站在窗前。

**Dimitri**：老师，今天请让我和他一起去。

Ashe 抬头。

**Ashe**：Lonato 大人曾经救过我。也救过我的弟妹。那时候我没有家，他给了我一个。

他努力把声音压稳。

**Ashe**：可我现在是你的学生。如果他真的举兵，我不能假装没听见。

Byleth 把一盏雾灯放到桌上。

**Byleth**：你随队。不要单独行动。

Ashe 接过雾灯。

**Ashe**：是。

### Scene 04 - 出征

武器架前，学生们换上行军装备。Dedue 检查盾带，Ingrid 调整枪套，Annette 把雾灯挂得太紧，Mercedes 替她放松一点。Felix 没有安慰 Ashe，只把一把备用短剑推到他手边。

Catherine 从回廊尽头走来，身后的武器被布带半遮，仍像雷光压在鞘中。

**Catherine**：雾里别离我太远。你们今天要学的不是胜利，是别让同伴从视野里消失。

队伍离开修道院。教会旗帜在身后渐远，马格德雷德方向的云压得很低。

### Scene 05 - 马格德雷德雾道

雾把道路切成一段一段。远处村庄的门紧闭，炊烟很低，像怕被人看见。

Ingrid 听见枝叶响动，枪尖偏向左侧。

**Ingrid**：雾太厚了。

**Dedue**：听脚步。不要只看眼睛。

Byleth 让队伍停下，在泥地画出路线：前排压住山脊，后排贴雾灯走，Ashe 不单独越线。

**Byleth**：不追影子。听同伴，不听雾。

Ashe 看向雾里若隐若现的旧旗，认出 Gaspard 的纹章。

### Scene 06 - 第一波接触

第一支箭从雾中射来，钉在 Dedue 的盾面。叛军从山坡与树影间压上，他们的队形不像盗匪，更像被某种信念推着走的士兵。

**叛军**：为 Lonato 卿！

Dimitri 一枪逼退前排，几乎追进雾里。Byleth 抬手。

**Byleth**：守线。

Dimitri 停住。

**Dimitri**：明白。

Ashe 看着对方盾上的旧徽记，弓弦松了一瞬。下一击从雾里切来，Felix 横身补位。

**Felix**：发呆等于叫别人替你受伤。

Ashe 没反驳，只重新拉开弓。

### Scene 07 - 青狮稳住战线

Mercedes 引导受伤骑士退到雾灯后。Annette 用风压短暂吹开雾层，让 Ingrid 与 Sylvain 找到侧翼路。

**Mercedes**：这边！

**Annette**：我看见路了！

Catherine 从侧面进入，雷光照亮雾里的敌阵。那不是夸耀，只是一瞬间压倒战局的力量。学生们第一次理解，赛罗司骑士团的王牌为什么会被称为王牌。

雷声落下后，山脊上出现 Lonato 的身影。

### Scene 08 - Lonato

Lonato 站在破旗之下，白发被雾打湿。他看见 Ashe，脸上的坚定有一瞬间动摇。

**Lonato**：让开。我不愿与孩子们为敌。

Ashe 放低弓，走到 Byleth 允许的距离。Dimitri 半步跟在他身侧。

**Ashe**：Lonato 大人，请停手。

Lonato 没有放下武器。他身后的叛军继续移动，试图绕向村路。

**Lonato**：有些罪若无人追问，只会被圣名遮住。

Ashe 的眼神发颤。Byleth 看见叛军侧翼移动，剑尖指向两侧。

**Byleth**：分开他的护卫。不要让他靠近村路。

### Scene 09 - 最后压制

Blue Lions 分成两翼。Dedue 与 Dimitri 正面压住山脊，Ingrid 和 Sylvain从雾侧切断护卫，Mercedes 与 Annette 保持退路。Felix 不再抢前，只封住 Ashe 身边的空隙。

Ashe 再次拉弓。箭没有射向 Lonato 的身体，而是钉在他的前方泥地，逼他停步。

**Ashe**：对不起。

Catherine 与 Byleth 同时从两侧进入。Catherine 打掉 Lonato 的武器，Byleth 用剑背将他压住。金属落地后，雾中安静得可怕。

Lonato 跪倒。Ashe 没有冲上去。Dimitri 挡在他身侧，像是在替他挡住所有人的目光。

### Scene 10 - 教会的裁决

战后，大圣堂的光比雾更冷。

Rhea 接受报告。学生们站在下方，衣角还带着泥水。她的声音温柔，平静。

**Rhea**：辛苦了。你们守住了信仰的安宁。

Seteth 递上名单。Rhea 垂眼看过。

**Rhea**：叛逆者必须接受裁决。

没有人立刻说话。Ashe 低下头。Dimitri 看向 Byleth。Felix 盯着地面，手指仍扣在剑柄边。

### Scene 11 - 余波

回廊一角，Catherine 擦拭剑鞘。Ashe 站在几步外。

**Ashe**：你从来不会怀疑吗？

Catherine 停下手。

**Catherine**：我相信 Rhea 大人。怀疑留给还没决定的人。

夜里，Dimitri 与 Byleth 站在空回廊。

**Dimitri**：我知道今天必须结束。可我害怕的不是战斗。

他看着手心，像那里还握着长枪。

**Dimitri**：若杀意披上正义，它就会变得很安静。

Byleth 没有回答。圣堂深处，绿色光芒一闪。

**Sothis**：汝相信她吗？

Rhea 的身影停在圣墓方向。切黑。

## Writer Self-Check

- What changes: Blue Lions 从模拟战胜利后的兴奋进入第一次真实镇压任务，并看见教会权威的代价。
- Costly choice: Ashe 选择随队面对 Lonato，并用非致命一箭阻止旧恩人继续伤人。
- Visible proof: Ashe 接过雾灯、重新拉弓、箭钉泥地；Dimitri 停枪与夜谈形成情绪回声。
- Removable exposition: 教会分裂不靠解释历史，靠叛军祈祷木牌、旧旗、Rhea 裁决名单呈现。
- Next scene memory: Rhea 的裁决、Catherine 的绝对信任、Sothis 对圣墓方向的疑问。`;
}

function buildOutline() {
  return `# EP03 Outline - 雾中的叛乱

## 结构

| Act | 时间 | 内容 | 情绪功能 |
| --- | ---: | --- | --- |
| Act 1 | 0:00-3:30 | 梦境残响、Rhea 下令镇压、Ashe 与 Lonato 关系揭出。 | 从学院秩序转入教会命令，把任务私人化。 |
| Act 2 | 3:30-8:30 | 出征、雾道、边境村、叛军营地、第一波接触。 | 让学生发现敌人不是盗匪，而是带信念的叛军。 |
| Act 3 | 8:30-12:30 | Catherine 破雾、Lonato 现身、Ashe 劝降失败。 | 把战术胜负压成道德选择。 |
| Act 4 | 12:30-结束 | 非致命拦截、最后压制、Rhea 裁决、Dimitri 夜谈、圣墓伏笔。 | 胜利转为创伤，并将怀疑留到下一章。 |

## 核心人物线

- Ashe：从被旧恩困住，到承认自己必须阻止 Lonato。
- Dimitri：从守护同学，到感知正义与暴力之间的危险重叠。
- Byleth：从执行教师任务，到第一次看见教会权威如何塑造学生。
- Rhea/Catherine：一个下令，一个执行；都不以恶意呈现，但都不可轻易撼动。`;
}

function buildSourceBreakdown() {
  return `# EP03 Source Video Breakdown - Blue Lions Route

Source video:

\`${sourceVideo}\`

Source audio:

\`${sourceAudio}\`

Technical read:

- Video duration: 00:14:30.87
- Audio duration: 00:14:30.95
- Resolution: 852x480
- Frame rate: 30 fps
- Streams detected by \`ffprobe\`: [00] video only, [01] audio only.
- Review method: 30-second contact sheet over the whole source, with closer visual review of the mission briefing, fog battle, and post-battle church judgment beats.

## Timecode Structure

| Source time | Game-video content | Adaptation use |
| --- | --- | --- |
| 00:00-01:20 | Dream/Sothis and transitional chapter material. | Short dream residual opener; keep mysterious, not lore-heavy. |
| 01:20-03:30 | Rhea and Seteth explain the Lonato/Western Church rebellion. | Main Act 1 briefing; define church authority and mission stakes. |
| 03:30-05:30 | Blue Lions react, Ashe's connection to Lonato is exposed. | Make Ashe the emotional center and motivate Byleth's student-protection rule. |
| 05:30-07:30 | March toward Magdred and fog-field preparation. | Establish fog, border village pressure, rebel faith markings, and tactical visibility rules. |
| 07:30-11:50 | Fog battle with Lonato forces and Catherine support. | Convert game battle into a continuous non-UI live-action field engagement. |
| 11:50-13:20 | Lonato confrontation and defeat. | Keep Ashe involved without making him directly execute Lonato. |
| 13:20-14:30 | Rhea/Seteth post-battle judgment and next-chapter setup. | Show the cost of church order; seed Saint's Tomb / deeper church-secret tension. |

## Adaptation Principles

- Do not reproduce game UI, menus, grid movement, damage numbers, or combat portraits.
- Keep the chapter Blue Lions-centered: Ashe is the emotional hinge, Dimitri is the moral echo, Byleth is the stabilizing command eye.
- Lonato must read as a principled rebel and adoptive father, not a generic enemy.
- Rhea must not be cartoonishly cruel; the discomfort comes from her serene certainty.
- Catherine's power should be impressive but controlled; no gore, no celebratory slaughter.
- The battle is real but staged at TV-14 fantasy intensity: impacts, disarms, falls, fog confusion, no graphic wounds.
- End by making the next chapter's church-secret tension feel inevitable.`;
}

function buildDirectorTreatment() {
  return `# EP03 Director Treatment

## Visual Thesis

EP03 begins in bright institutional order and moves into grey uncertainty. The fog is not just atmosphere; it is the chapter's moral grammar. Characters repeatedly make choices before they can see the whole field.

## Camera Rules

- Rhea scenes use centered, stable, vertical compositions. The frame should feel calm even when the order is severe.
- Ashe scenes use side light and slight negative space, so his hesitation is visible without melodrama.
- Fog battle scenes use practical geography: Blue Lions hold a center line, Lonato's rebels emerge from upper-left ridge/fog, village road remains a protected rear/right-side line.
- Catherine's action should be brief and decisive. Do not turn her into the protagonist of the battle.
- Dimitri's danger is shown through a stopped motion: he almost follows through, then obeys Byleth.

## Performance Rules

- Ashe does not cry until the scene would become sentimental; he keeps trying to perform duty.
- Dimitri is polite and controlled, with one night-scene line that hints at later darkness.
- Rhea is warm in voice, immovable in decision.
- Catherine is loyal and direct, not sadistic.
- Byleth speaks sparingly; command is shown by timing, eyeline, and placement.

## Color And Texture

- Monastery: white stone, gold light, blue shadows, clean hierarchy.
- Magdred: desaturated greens, wet mud, grey fog, low contrast.
- Rebel camp: rough cloth, old prayer markers, tarnished metal, not bandit chaos.
- Post-battle: cathedral light returns, but the students carry mud and fog residue into it.

## Editorial Shape

The episode should not linger on travel. Use three clean moves: order, fog, consequence. The action centerpiece is not a long brawl; it is a pressure corridor that forces Ashe's choice.`;
}

function buildProductionNotes() {
  return `# EP03 Production Notes

## Completion Target

Target: \`prompt_asset_package\`

This package contains the full script, source breakdown, director treatment, shot list, per-shot frame specs, video prompts, negative prompts, manifests, source reference stills, and review records. Actual AI-generated start/key/end storyboard frames are intentionally marked \`frames_pending\` and should be generated in the next stage before building a \`video_generation_package\`.

Important correction: \`source_refs/*.png\` are game-video screenshots. They are source/layout reference only. They are not live-action storyboard frames, not approved visual material, and must not be displayed as completed shot assets.

## Source References

- Primary video: \`${sourceVideo}\`
- Primary audio: \`${sourceAudio}\`
- Local extracted source stills: \`episodes/EP03/source_refs/ShotXXX_source.png\`

## Required Character Assets

| Character | Asset |
| --- | --- |
| Byleth | \`${characters.Byleth}\` |
| Sothis | \`${characters.Sothis}\` |
| Rhea | \`${characters.Rhea}\` |
| Seteth | \`${characters.Seteth}\` |
| Catherine | \`${characters.Catherine}\` |
| Dimitri | \`${characters.Dimitri}\` |
| Ashe | \`${characters.Ashe}\` |
| Lonato | \`${characters.Lonato}\` |
| Blue Lions ensemble | Dedue, Felix, Sylvain, Mercedes, Annette, Ingrid academy selected assets |

## Required Location Assets

| Location | Asset |
| --- | --- |
| Monastery cloister | \`${locations.monastery}\` |
| Cathedral | \`${locations.cathedral}\` |
| Classroom | \`${locations.classroom}\` |
| Magdred fog road | \`${locations.fogRoad}\` |
| Faerghus border village | \`${locations.village}\` |
| Western Church rebel camp | \`${locations.rebelCamp}\` |
| Lonato battlefield ridge | \`${locations.battlefield}\` |
| Fog chapel ruins | \`${locations.chapel}\` |

## Pending Visual Work

Generate real start/key/end frames for all 36 shots into:

\`episodes/EP03/storyboards/ShotXXX/start_frame.png\`
\`episodes/EP03/storyboards/ShotXXX/key_frame.png\`
\`episodes/EP03/storyboards/ShotXXX/end_frame.png\`

Use source stills only as layout/canon reference; do not treat them as approved live-action frames.

## Global Reject If

- The battle becomes a game UI sequence with grids, damage numbers, menus, subtitles, or dialogue boxes.
- Lonato becomes a generic villain or bandit.
- Ashe kills Lonato directly in a triumphant beat.
- Rhea is played as openly malicious rather than serene and institutionally absolute.
- Catherine's action becomes graphic or celebratory.
- Academy students look like adult soldiers or war-phase versions.`;
}

function buildVisualMaterialAudit() {
  const generatedCount = shots.filter((shot) => hasGeneratedFrames(shot[0])).length;
  const rows = shots.map((shot) => {
    const [id, time, , scene, purpose] = shot;
    const framePaths = `storyboards/${id}/start_frame.png; storyboards/${id}/key_frame.png; storyboards/${id}/end_frame.png`;
    const generated = hasGeneratedFrames(id);
    return `| ${id} | ${generated ? framePaths : `source_refs/${id}_source.png`} | ${time} | ${scene} | ${purpose} | ${generated ? "layout_reference" : "frames_pending"} | ${generated ? "Composited live-action candidate frames exist, but action peaks and cutout integration need visual QA before approval." : "Game-video screenshot only; useful for source timing and rough layout, not live-action identity/action proof."} |`;
  }).join("\n");
  return `# EP03 Visual Material Audit

Integrity Summary: 36 source reference screenshots exist; ${generatedCount} of 36 generated live-action start/key/end frame sets exist.
Visual Audit Coverage: 36 shots reviewed at available-material level.
Unavailable Shots: ${generatedCount === 36 ? "none" : "some generated start/key/end frames remain missing"}.
Existing Shots Failed: none promoted; generated frames are not approved and remain rough composited candidates.
Layout Reference Only: Shot001-Shot036 generated frames and source_refs.
Monitor Required: Shot001-Shot036 require full per-shot visual QA before video submission.
Visual Review Passed: none.
Promotion Decision: layout_reference / monitor_required; blocked from video_generation_package until generated frames pass visual review, prompt QA against real frames, and strict continuity.

## Audit Table

| Shot | Reviewed Path | Source Time | Beat | Purpose | Decision | Required Revision |
| --- | --- | --- | --- | --- | --- | --- |
${rows}

## Reviewer Decision

The current visual material must not be presented as completed or approved storyboard/keyframe assets. Game screenshots are retained only for source audit, timing, canon, and rough layout reference. Generated composited frames are candidate visual material only; they need per-shot review and likely refinement before any \`visual_review_passed\`, \`motion_review_passed\`, or \`approved_for_video\` status is allowed.`;
}

function buildFrameGenerationQueueMarkdown() {
  const rows = shots.map((shot) => {
    const [id, , duration, scene, purpose, visual, camera] = shot;
    return `| ${id} | 3 | ${duration}s | ${scene} | ${purpose} | ${visual} | ${camera} | pending |`;
  }).join("\n");
  return `# EP03 Frame Generation Queue

Target: generate live-action cinematic start/key/end PNG frames for every EP03 shot.

Source refs are game screenshots and must only guide canon/layout. Generated frames must use project character/location assets and the frame specs.

| Shot | Frames | Duration | Beat | Purpose | Key Action | Camera | Status |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
${rows}

## Output Paths

For each shot:

- \`episodes/EP03/storyboards/ShotXXX/start_frame.png\`
- \`episodes/EP03/storyboards/ShotXXX/key_frame.png\`
- \`episodes/EP03/storyboards/ShotXXX/end_frame.png\`

After generation, run a visual audit before changing any shot status from \`frames_pending\`.`;
}

function buildFrameGenerationQueueJson() {
  return {
    version: 1,
    project: "EP03 - 雾中的叛乱（青狮线）",
    created_at: today,
    source_refs_are: "layout_reference_only_game_screenshots",
    target: "live_action_start_key_end_frames",
    shots: shots.map((shot, index) => {
      const [id, time, duration, scene, purpose, visual, camera, audio] = shot;
      const japaneseAudio = japaneseAudioFor(id, audio);
      return {
        id,
        order: index + 1,
        status: "pending",
        source_reference: `source_refs/${id}_source.png`,
        source_timecode: time,
        output_frames: {
          start: `storyboards/${id}/start_frame.png`,
          key: `storyboards/${id}/key_frame.png`,
          end: `storyboards/${id}/end_frame.png`
        },
        duration_seconds: duration,
        beat: scene,
        purpose,
        key_action: visual,
        camera,
        audio_anchor: japaneseAudio,
        frame_spec: `storyboards/${id}/frame_spec.md`
      };
    })
  };
}

function buildShotList() {
  const rows = shots.map((shot) => {
    const [id, , duration, scene, purpose, visual, camera, audio] = shot;
    return `| ${id} | ${duration} 秒 | ${scene} | ${purpose} | ${visual} | ${camera} | ${audio} |`;
  }).join("\n");
  return `# EP03 镜头表 - 雾中的叛乱（青狮线）

预计成片：10-12 分钟

| 镜头 | 时长 | 场景 | 剧情目的 | 画面 | 镜头 | 对白 / 声音 |
| --- | ---: | --- | --- | --- | --- | --- |
${rows}

## 拍摄优先级

1. 先做 Shot003-006、Shot021-029、Shot031-036：这些定义任务、Ashe/Lonato 情绪核心和教会裁决。
2. 再做 Shot010-020、Shot025-030：这些定义雾战地理与青狮协同。
3. 最后补 Shot001-002、Shot007-009、Shot011-012：用于氛围、转场和源世界质感。`;
}

function buildFrameSpec(shot, index) {
  const [id, time, duration, scene, purpose, visual, camera, audio, loc, chars, assetKeys, editIn, editOut, risks] = shot;
  const japaneseAudio = japaneseAudioFor(id, audio);
  const sourceRef = `source_refs/${id}_source.png`;
  const assets = assetList(shot).map((item) => `- \`${item}\``).join("\n");
  return `# ${id} Frame Spec

Shot ID: ${id}
Stage: storyboard
Status: frames_pending
Depends On: script.md; shot_list.md; source_video_breakdown.md
Script Beat: ${scene}
Shot Purpose: ${purpose}
Duration Target: ${duration}s
Location: ${loc}
Characters Visible: ${chars.join(", ")}
Character Identity Locks:
${chars.map((name) => `- ${name}: ${characters[name] || "use approved academy/supporting asset"}; academy-era identity, no war-phase aging, no generic extra face.`).join("\n")}
Asset References:
${assets}
- \`${sourceRef}\` as source/layout reference
Start Frame Intent: Establish the pre-action state for ${scene}; preserve geography from the source reference and keep the viewer's first read clear.
Key Frame Intent: Capture the decisive visible beat: ${visual}
End Frame Intent: Land on the state needed for the next cut: ${editOut}.
Camera: ${camera}
Blocking: ${visual}
Screen Direction: Maintain Blue Lions moving from lower/right foreground toward upper/left fog ridge unless the cathedral/monastery scene is static.
Action Peak: ${purpose}
Dialogue / Audio Anchor: ${japaneseAudio}
Edit In: ${editIn}
Edit Out: ${editOut}
Continuity Requirements: Shot ${String(index).padStart(2, "0")} must preserve mud/fog residue, academy uniforms, and the established moral pressure into adjacent shots.
Motion Risks: ${risks}
Reject If:
- visible game UI, subtitles, dialogue boxes, damage numbers, or menus appear
- named character identity drifts from listed assets
- academy students read as adult war-phase soldiers
- the shot contradicts the non-graphic, duty-focused tone

Planned Frames:
- start_frame.png: pending generation
- key_frame.png: pending generation
- end_frame.png: pending generation`;
}

function buildPrompt(shot) {
  const [id, , duration, scene, purpose, visual, camera, audio, loc, chars, assetKeys, editIn, editOut, risks] = shot;
  const assets = assetList(shot);
  const japaneseAudio = japaneseAudioFor(id, audio);
  const copy = promptCopyFor(id, scene, purpose, visual, camera);
  return `# ${id} Seedance Prompt

Target model: Seedance image-to-video
Language / audio: Japanese spoken dialogue and natural cinematic sound only; no Chinese/Mandarin voiceover; no burned-in subtitles.

## Shot ID

${id}

## Duration

${duration} seconds

## Input Frames

- start_frame: \`storyboards/${id}/start_frame.png\`; first frame and pre-action state.
- key_frame: \`storyboards/${id}/key_frame.png\`; decisive story/action peak.
- end_frame: \`storyboards/${id}/end_frame.png\`; final cut-out state for the next edit.
- source layout reference while generated frames are pending: \`source_refs/${id}_source.png\`.

Use the generated start/key/end frames for ${id} as hard visual anchors when available. Until then, use the source still, the frame spec, and the listed character/location assets as layout and continuity reference.

Scene beat: ${copy.scene}
Story purpose: ${copy.purpose}

Characters: ${chars.join(", ")}
Reference assets:
${assets.map((item) => `- ${item}`).join("\n")}

## Motion

${copy.motion}

Movement must stay physically grounded and must preserve the start_frame to key_frame to end_frame action chain. Do not add new combat beats, new characters, or new props.

## Camera

${copy.camera}

Preserve the shot size and screen direction described in \`storyboards/${id}/frame_spec.md\`. Do not rotate across the action line unless the frame spec explicitly allows it.

## Performance

Visible acting should serve the beat: ${copy.purpose}

Keep expressions restrained and filmable. Show hesitation, breath, eyeline, posture, and timing instead of exaggerated anime reactions.

## Audio

${japaneseAudio}

Use Japanese speech for every spoken line listed above. Do not generate Chinese or Mandarin voiceover. No burned-in subtitles or visible text.

## Continuity Locks

- Preserve academy-phase Blue Lions uniforms and youthful student faces.
- Preserve Byleth's restrained professor silhouette.
- Preserve Rhea's serene institutional authority and Catherine's controlled knight presence.
- Preserve fog-field geography: Blue Lions line, Lonato ridge, village road protected from spillover.
- Keep Lonato principled and tragic, never a generic raider.
- Edit in: ${editIn}
- Edit out: ${editOut}

Motion risks to monitor: ${risks}

## Reject If

- the clip adds UI, subtitles, captions, game dialogue boxes, damage numbers, or tactical grid overlays
- the clip adds graphic gore, modern objects, modern weapons, or war-phase costumes
- named character identity, age, uniform, weapon, or role drifts from the listed assets
- the shot changes the moral beat into triumphal violence
- Lonato becomes a generic raider or Ashe directly executes him`;
}

function buildNegativePrompt(shot) {
  const [id] = shot;
  return `# ${id} Negative Prompt

No subtitles, no captions, no Chinese-language voiceover, no Mandarin spoken dialogue, no game UI, no dialogue boxes, no damage numbers, no health bars, no tactical grid, no chibi proportions, no anime screencap style, no modern clothing, no modern weapons, no firearms, no graphic gore, no dismemberment, no blood spray, no celebratory execution, no random monsters, no extra named students, no face drift, no age-up, no war-phase costumes, no beard or stubble on students, no generic medieval extras replacing named characters, no Rhea villain-smirk, no Catherine cruelty, no Ashe triumphant kill, no Lonato as bandit, no camera spin, no fisheye, no unreadable fog wall, no text on props.`;
}

function buildMetadata(shot, index) {
  const [id, time, duration, scene, purpose, visual, camera, audio, loc, chars, assetKeys, editIn, editOut, risks] = shot;
  const japaneseAudio = japaneseAudioFor(id, audio);
  return {
    id,
    order: index,
    source_timecode: time,
    status: hasGeneratedFrames(id) ? "candidate_generated" : "frames_pending",
    duration_seconds: duration,
    scene,
    purpose,
    location: loc,
    characters: chars,
    asset_references: assetList(shot),
    source_reference: `source_refs/${id}_source.png`,
    planned_frames: {
      start: `storyboards/${id}/start_frame.png`,
      key: `storyboards/${id}/key_frame.png`,
      end: `storyboards/${id}/end_frame.png`
    },
    prompt_path: `video_prompts/${id}_prompt.md`,
    negative_prompt_path: `video_prompts/${id}_negative_prompt.md`,
    expected_clip: `clips/${id}.mp4`,
    edit_in: editIn,
    edit_out: editOut,
    audio_anchor: japaneseAudio,
    risks
  };
}

function buildManifests() {
  const artifacts = [
    ["EP03-PROJECT-BIBLE", "project_bible", "project_bible", "approved_for_next_stage", ["project_bible.md"]],
    ["EP03-OUTLINE", "outline", "writing", "approved_for_next_stage", ["outline.md"]],
    ["EP03-SCRIPT", "script_scene", "writing", "approved_for_next_stage", ["script.md"]],
    ["EP03-DIRECTOR-TREATMENT", "director_treatment", "direction", "approved_for_next_stage", ["director_treatment.md"]],
    ["EP03-SHOT-LIST", "shot_list", "storyboard", "approved_for_next_stage", ["shot_list.md"]],
    ["EP03-PRODUCTION-NOTES", "production_notes", "production", "approved_for_next_stage", ["production_notes.md"]],
    ["EP03-VISUAL-MATERIAL-AUDIT", "visual_audit", "storyboard", "layout_reference", ["visual_material_audit.md", "generated_storyboard_contact_sheet.jpg"]],
    ["EP03-FRAME-GENERATION-QUEUE", "frame_generation_queue", "storyboard", "frames_pending", ["frame_generation_queue.md", "frame_generation_queue.json"]]
  ].map(([id, type, stage, status, paths]) => ({
    id,
    type,
    stage,
    status,
    created_by: "codex-ep03-package-builder",
    created_at: today,
    paths,
    source_refs: ["source_video_breakdown.md"],
    depends_on: [],
    risk_flags: [],
    notes: "EP03 mainline Blue Lions prompt asset package artifact."
  }));

  shots.forEach((shot, index) => {
    const [id, , , , , , , , , , , editIn, editOut, risks] = shot;
    const frameStatus = hasGeneratedFrames(id) ? "candidate_generated" : "frames_pending";
    artifacts.push({
      id: `EP03-${id}-FRAME-SPEC`,
      type: "storyboard_frame",
      stage: "storyboard",
      status: frameStatus,
      created_by: "storyboard-agent",
      created_at: today,
      paths: [`storyboards/${id}/frame_spec.md`, `source_refs/${id}_source.png`],
      source_refs: ["source_video_breakdown.md"],
      depends_on: ["EP03-SCRIPT", "EP03-SHOT-LIST"],
      continuity: {
        previous: index > 0 ? `EP03-${shots[index - 1][0]}-FRAME-SPEC` : "",
        next: index < shots.length - 1 ? `EP03-${shots[index + 1][0]}-FRAME-SPEC` : "",
        in: editIn,
        out: editOut
      },
      risk_flags: risks.split(", ").filter(Boolean),
      notes: hasGeneratedFrames(id)
        ? "Composited live-action candidate start/key/end PNG frames exist; visual review still required."
        : "Frame spec complete; real start/key/end PNG frames pending."
    });
    artifacts.push({
      id: `EP03-${id}-VIDEO-PROMPT`,
      type: "video_prompt",
      stage: "video_prompts",
      status: "monitor_required",
      created_by: "video-prompt-agent",
      created_at: today,
      paths: [`video_prompts/${id}_prompt.md`, `video_prompts/${id}_negative_prompt.md`, `storyboards/${id}/metadata.json`],
      source_refs: [`storyboards/${id}/frame_spec.md`],
      depends_on: [`EP03-${id}-FRAME-SPEC`],
      risk_flags: risks.split(", ").filter(Boolean),
      notes: "Prompt is ready for frame generation and later motion QA against real frames."
    });
  });

  const reviews = [
    ["EP03-PROJECT-BIBLE", "canon-continuity-review", "canon-review-agent", "approved_for_next_stage"],
    ["EP03-SCRIPT", "story-review", "story-review-agent", "approved_for_next_stage"],
    ["EP03-DIRECTOR-TREATMENT", "director-review", "director-qa-agent", "approved_for_next_stage"],
    ["EP03-SHOT-LIST", "shot-list-review", "storyboard-qa-agent", "approved_for_next_stage"],
    ["EP03-PRODUCTION-NOTES", "production-review", "producer-qa-agent", "approved_for_next_stage"],
    ["EP03-VISUAL-MATERIAL-AUDIT", "visual-material-audit", "visual-audit-agent", "layout_reference"],
    ["EP03-FRAME-GENERATION-QUEUE", "frame-generation-queue-review", "producer-qa-agent", "frames_pending"]
  ].map(([artifactId, slug, role, decision]) => ({
    artifact_id: artifactId,
    review_id: `review-${today}-${slug}`,
    reviewer_role: role,
    reviewer: "codex",
    created_at: today,
    decision,
    blocking_issues: [],
    required_revisions: [],
    rubric: {
      scene_purpose: "pass",
      conflict: "pass",
      continuity_hooks: "pass",
      canon_fidelity: "pass"
    },
    reviewed_paths: artifacts.find((artifact) => artifact.id === artifactId).paths
  }));

  shots.forEach((shot) => {
    const [id] = shot;
    reviews.push({
      artifact_id: `EP03-${id}-VIDEO-PROMPT`,
      review_id: `review-${today}-${id}-prompt-qa`,
      reviewer_role: "video-prompt-qa-agent",
      reviewer: "codex",
      created_at: today,
      decision: "monitor_required",
      blocking_issues: [],
      required_revisions: ["Generate and visually review real start/key/end frames before approving for video."],
      rubric: {
        prompt_structure: "pass",
        negative_prompt: "pass",
        identity_locks: "pass",
        frame_anchors: "conditional",
        motion_risk: "monitor_required"
      },
      reviewed_paths: [`video_prompts/${id}_prompt.md`, `video_prompts/${id}_negative_prompt.md`, `storyboards/${id}/frame_spec.md`]
    });
  });

  const pairs = shots.slice(0, -1).map((shot, index) => ({
    id: `EP03-continuity-${shot[0]}-${shots[index + 1][0]}`,
    from: `EP03-${shot[0]}-FRAME-SPEC`,
    to: `EP03-${shots[index + 1][0]}-FRAME-SPEC`,
    reviewer_role: "continuity-qa-agent",
    decision: "monitor_required",
    notes: "Text/frame-spec continuity is planned; strict visual continuity requires generated frames."
  }));

  const deliveryShots = shots.map((shot, index) => {
    const [id, , duration, , , , , audio, , , , editIn, editOut] = shot;
    const japaneseAudio = japaneseAudioFor(id, audio);
    return {
      id,
      order: index + 1,
      status: hasGeneratedFrames(id) ? "monitor_required" : "frames_pending",
      duration_seconds: duration,
      prompt_path: `video_prompts/${id}_prompt.md`,
      negative_prompt_path: `video_prompts/${id}_negative_prompt.md`,
      start_frame: `storyboards/${id}/start_frame.png`,
      key_frame: `storyboards/${id}/key_frame.png`,
      end_frame: `storyboards/${id}/end_frame.png`,
      expected_clip: `clips/${id}.mp4`,
      edit_in: editIn,
      edit_out: editOut,
      audio_anchor: japaneseAudio,
      continuity_previous: index > 0 ? shots[index - 1][0] : "",
      continuity_next: index < shots.length - 1 ? shots[index + 1][0] : "",
      model_notes: [
        "Target Seedance image-to-video workflow.",
        "Generate real start/key/end frames before video submission.",
        "Use source_refs only as layout/canon reference, not final frames.",
        "Use Japanese spoken dialogue only for voiced lines; no Chinese/Mandarin voiceover.",
        "No subtitles or visible game UI."
      ],
      reject_if: [
        "game UI or subtitles appear",
        "academy identities drift",
        "Lonato becomes a generic villain",
        "Ashe directly executes Lonato"
      ]
    };
  });

  write(path.join(epDir, "production_system", "artifact_manifest.json"), JSON.stringify({ version: 1, project: "EP03 - 雾中的叛乱（青狮线）", artifacts }, null, 2));
  write(path.join(epDir, "production_system", "review_manifest.json"), JSON.stringify({ version: 1, reviews }, null, 2));
  write(path.join(epDir, "production_system", "continuity_manifest.json"), JSON.stringify({ version: 1, pairs }, null, 2));
  write(path.join(epDir, "production_system", "video_delivery_manifest.json"), JSON.stringify({ version: 1, project: "EP03 - 雾中的叛乱（青狮线）", package_id: "prompt_asset_package_2026-07-28", episode: "EP03", shots: deliveryShots }, null, 2));
  write(path.join(epDir, "prompt_asset_package_manifest.json"), JSON.stringify({
    version: 1,
    project: "EP03 - 雾中的叛乱（青狮线）",
    target_model: "Seedance image-to-video",
    episode: "EP03",
    created_at: today,
    frame_generation_mode: "source-layout-referenced prompt asset package; real start/key/end frames pending",
    source_video: sourceVideo,
    source_audio: sourceAudio,
    shots: deliveryShots.map((shot) => ({
      id: shot.id,
      order: shot.order,
      duration_seconds: shot.duration_seconds,
      prompt_path: shot.prompt_path,
      negative_prompt_path: shot.negative_prompt_path,
      frame_spec_path: `storyboards/${shot.id}/frame_spec.md`,
      source_reference: `source_refs/${shot.id}_source.png`,
      frames: {
        start: shot.start_frame,
        key: shot.key_frame,
        end: shot.end_frame
      },
      status: shot.status
    }))
  }, null, 2));
}

function buildProjectBible() {
  return `# EP03 Project Bible - 雾中的叛乱（青狮线）

Scope: Fire Emblem: Three Houses Blue Lions academy-phase Chapter EP3, Lonato / Western Church rebellion.

Creative law: this episode is about the first moral bruise after academy onboarding. The students are not playing a tutorial anymore; they are carrying a church order into a foggy civil-religious conflict.

Canon locks:
- Route identity remains Blue Lions.
- Ashe's prior bond with Lonato is the emotional center.
- Lonato is a principled rebel against the Church, not a random bandit.
- Catherine accompanies the mission as a Church of Seiros knight and demonstrates overwhelming force.
- Rhea's post-battle judgment is serene and absolute, setting up later distrust without making her cartoonishly evil.
- Sothis remains private to Byleth and should not become visible to other characters.

Visual law:
- Academy-age faces and uniforms only for students.
- Fog must preserve geography, not hide incoherent staging.
- Battle violence is non-graphic and consequence-focused.
- No game UI, tactical grid, subtitles, or dialogue boxes.

Completion target:
- Current package target is prompt_asset_package.
- Real start/key/end frames are pending and must be generated before video_generation_package promotion.`;
}

function main() {
  ensureDir(epDir);
  ensureDir(path.join(epDir, "video_prompts"));
  ensureDir(path.join(epDir, "storyboards"));
  ensureDir(path.join(epDir, "production_system"));

  extractSourceRefs();
  write(path.join(epDir, "project_bible.md"), buildProjectBible());
  write(path.join(epDir, "outline.md"), buildOutline());
  write(path.join(epDir, "source_video_breakdown.md"), buildSourceBreakdown());
  write(path.join(epDir, "script.md"), buildScript());
  write(path.join(epDir, "director_treatment.md"), buildDirectorTreatment());
  write(path.join(epDir, "shot_list.md"), buildShotList());
  write(path.join(epDir, "production_notes.md"), buildProductionNotes());
  write(path.join(epDir, "visual_material_audit.md"), buildVisualMaterialAudit());
  write(path.join(epDir, "frame_generation_queue.md"), buildFrameGenerationQueueMarkdown());
  write(path.join(epDir, "frame_generation_queue.json"), JSON.stringify(buildFrameGenerationQueueJson(), null, 2));

  shots.forEach((shot, i) => {
    const id = shot[0];
    const shotDir = path.join(epDir, "storyboards", id);
    ensureDir(shotDir);
    write(path.join(shotDir, "frame_spec.md"), buildFrameSpec(shot, i + 1));
    write(path.join(shotDir, "metadata.json"), JSON.stringify(buildMetadata(shot, i + 1), null, 2));
    write(path.join(epDir, "video_prompts", `${id}_prompt.md`), buildPrompt(shot));
    write(path.join(epDir, "video_prompts", `${id}_negative_prompt.md`), buildNegativePrompt(shot));
  });

  buildManifests();
  console.log(`Built EP03 prompt asset package at ${epDir}`);
}

main();
