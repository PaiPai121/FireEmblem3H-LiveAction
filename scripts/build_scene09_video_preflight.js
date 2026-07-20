const fs = require("fs");
const path = require("path");

const outDir = "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2";
const packageJsonPath = "episodes/EP02/scene09_video_preflight_package_2026-07-19.json";
const packageMdPath = "episodes/EP02/scene09_video_preflight_package_2026-07-19.md";
const animaticJsonPath = "episodes/EP02/scene09_animatic_timing_plan_2026-07-19.json";
const animaticMdPath = "episodes/EP02/scene09_animatic_timing_plan_2026-07-19.md";
const failureMdPath = "episodes/EP02/scene09_video_failure_criteria_2026-07-19.md";
const dialogueMdPath = "episodes/EP02/scene09_dialogue_performance_pass_2026-07-19.md";

fs.mkdirSync(outDir, { recursive: true });

const sharedLocks = [
  "Use start/key stills from episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/ as visual anchors.",
  "Background master: assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png.",
  "Coordinate lock: north is screen top; Blue Lions move lower-right to center/upper-right; Black Eagles resist from north/right-depth toward center/southwest; Golden Deer enter from west/screen-left and pressure both sides.",
  "Weapon locks: Dimitri long training lance; Dedue large padded shield; Felix wooden sword; Sylvain and Ingrid training lances; Ashe bow; Mercedes empty-hand white healing only; Annette wind magic/book focus; Hubert magic hand/book focus; Ferdinand lance; Claude bow; Hilda axe; Hanneman spell focus; Manuela white magic.",
  "Academy-age lock: all named students must read as academy-age teenagers/late teens, not mature adults, adult models, war-phase veterans, or teacher-age characters.",
  "Competitive dignity lock: Black Eagles and Golden Deer must look competent and dangerous. Blue Lions win narrowly by objective timing, not because the other houses collapse or act foolishly.",
  "Hilda lock: use assets/characters/golden_deer/Hilda/academy/selected.png youth identity v4 as the visual authority; reject older/mature Hilda faces in any Hilda-visible shot.",
  "No character should rotate to face camera unless the camera is explicitly positioned on the enemy side. If a threat is ahead or in depth, defenders must face that threat.",
  "Supervised academy mock battle only: no blood, no visible wounds, no lethal strikes, no collapse, no gore.",
];

const highRiskShots = [
  {
    shot: "Shot029",
    title: "Wide Flank Setup Lance Monitor",
    duration: 12,
    priority: "preflight_flank_weapon_monitor",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot029_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot029_keyframe.png",
    why: "The still is usable as a wide flank setup, but Ingrid's weapon silhouette can read short-blade if animated too close. Use Shot029B for the detailed Golden Deer flank highlight.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot029 - Wide Flank Setup Lance Monitor.",
      "",
      "Use this shot as a brief wide setup for Sylvain and Ingrid realizing west/screen-left Golden Deer pressure is forming. Do not turn it into the main Golden Deer high-light; Shot029B carries that closer Hilda/Claude/Lorenz/Ignatz flank action.",
      "Begin with Sylvain and Ingrid on the Blue Lions right flank, bodies turned west/northwest toward thicket movement. They must not face camera while the threat is ahead/left.",
      "If either weapon becomes readable, Sylvain and Ingrid both carry long academy training lances/spears. Ingrid must not hold a sword, dagger, short blade, or axe. Keep her lance line long enough to cross the low wall and define the route-cut role.",
      "Golden Deer movement should remain partial and distant here: brush movement, bowline suggestion, and Hilda/Claude only as background pressure if visible. The detailed Golden Deer reveal happens in Shot029C/Shot029D/Shot029B.",
      "",
      "Camera/motion: medium-wide lateral flank angle with minimal push. Avoid close-ups of Ingrid's hand unless the lance silhouette is unmistakable.",
      "Audio: distant thicket movement, low wooden weapon taps, Sylvain's relaxed tone tightening.",
    ].join("\n"),
    dialogue: [
      "Sylvain: '也就是说，我们是被人切后路之前的后路。'",
      "Ingrid: '少说一句，脚步会更快。'",
      "Performance: this is the moment their casual flank guard becomes serious; do not stage it as a victory beat.",
    ],
    failureCriteria: [
      "Ingrid or Sylvain holds a sword, dagger, short blade, axe, bow, or magic focus instead of a long training lance.",
      "Ingrid faces camera while Golden Deer pressure is coming from west/screen-left.",
      "Golden Deer are fully revealed here in a way that duplicates Shot029B's high-light.",
      "The shot shows Golden Deer attacking only Blue Lions with no later implication that Black Eagles side lanes are also threatened.",
    ],
  },
  {
    shot: "Shot029B",
    title: "Hilda And Claude Thicket Pressure",
    duration: 9,
    priority: "blocking_hilda_youth_regen",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot029B_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot029B_keyframe.png",
    why: "Start/key were regenerated after the Hilda youth identity v4 replacement. Motion must preserve academy-age Hilda and the west-thicket pressure logic.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot029B - Hilda And Claude Thicket Pressure.",
      "",
      "Use the current replaced start/key frames generated after the Hilda youth identity v4 update. Hilda must read as a late-teen academy student with pink twin ponytails, Golden Deer academy uniform, and a compact wooden training axe.",
      "Begin with Claude and Hilda in west/screen-left thicket cover. Claude keeps a bow line across both Blue Lions and Black Eagles; Hilda steps out from cover with casual confidence, axe low and safe, creating flank pressure without looking like an adult warrior.",
      "Sylvain and Ingrid on the Blue Lions side turn toward the west threat instead of facing camera. Distant Black Eagles pressure remains visible toward the north/right-depth, so Golden Deer are clearly disturbing both sides of the fight.",
      "By the keyframe, Hilda has left cover far enough to pressure the lane, but she is checked by Ingrid/Sylvain containment and by Black Eagles activity compressing the thicket. She is not defeated or embarrassed.",
      "",
      "Camera/motion: medium-wide thicket-to-lane angle. Keep west/left Golden Deer origin and center/right Blue Lions response readable.",
      "Audio: brush movement, bowstring tension, wooden axe haft shifting in hand, distant shield/lance impacts.",
    ].join("\n"),
    dialogue: [
      "Sylvain: 'Claude 可真会挑时候。'",
      "Ingrid: '他挑的是两边的缝。'",
      "Performance: Hilda should look playful and sharp, not comic relief and not adult-warrior severe.",
    ],
    failureCriteria: [
      "Hilda reads as a mature adult, teacher-age, war-phase fighter, or adult glamour model.",
      "Hilda loses pink twin ponytails, Golden Deer academy uniform, or wooden training axe.",
      "Golden Deer pressure only Blue Lions and no longer disturb Black Eagles.",
      "Sylvain or Ingrid face camera while the west threat is active.",
    ],
  },
  {
    shot: "Shot027",
    title: "Ashe Archer Support",
    duration: 10,
    priority: "preflight_01",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot027_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot027_keyframe.png",
    why: "Ashe can drift into portrait posing or aim away from the west/center threat once animated.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot027 - Ashe Archer Support.",
      "",
      "Begin on the start frame with Ashe at the high observation point, body three-quarter side/back rather than camera-facing. He scans the west thicket and central lane, keeping the wooden training bow low and controlled.",
      "Over the first third, let his eyes and bow angle shift from the central Black Eagles lane to the west/screen-left Golden Deer pressure line. He does not smile, pose, or look into camera.",
      "By the keyframe, Ashe settles into a clean overwatch posture: bow and sightline point across the field toward the distant threat, with Blue Lions below and enemy movement in depth. The action remains a safe academy archery support beat, not an impact shot.",
      "",
      "Camera/motion: subtle high-point push-in or tiny lateral drift along the wall. Maintain the high-ground geography; do not rotate into a frontal portrait.",
      "Audio: low bowstring tension, distant footfalls, soft wind over the wall.",
    ].join("\n"),
    dialogue: [
      "Ashe, under breath: '明白。'",
      "Performance: keep this as quiet overwatch setup. Do not reveal Golden Deer in dialogue until Shot029D after Claude's first arrow lands.",
    ],
    failureCriteria: [
      "Ashe looks into camera for the action beat instead of watching the field.",
      "Bow points away from west/center threat or becomes a sword/lance.",
      "The high-point geography disappears into an isolated portrait.",
      "The shot shows a hit on a person, blood, or lethal impact.",
    ],
  },
  {
    shot: "Shot027B",
    title: "Named Black Eagles Enemy Wave",
    duration: 8,
    priority: "creative_logic_regen_enemy_wave",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot027B_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot027B_keyframe.png",
    why: "Start/key were regenerated after creative review rejected the prior anonymous crowd / unstable lookalike enemy wave.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot027B - Named Black Eagles Enemy Wave.",
      "",
      "Use the current replaced start/key frames. Animate a compact, named Black Eagles practice wave: Ferdinand leads with a long training lance; Edelgard follows as commander with axe-ready stance; Hubert and Dorothea remain support roles. Blue Lions remain separated in the lower/center foreground or depth.",
      "Keep the wave to 4-6 readable figures maximum. Do not add an anonymous crowd or merge house colors.",
      "The motion is a restrained academy drill advance from north/right-depth toward center/southwest, not a charge impact and not a hero portrait.",
      "",
      "Camera/motion: medium-wide tactical drift. Preserve the distance between Black Eagles and Blue Lions until the next contact shot.",
      "Audio: measured footwork, practice gear, distant horn decay.",
    ].join("\n"),
    dialogue: [
      "No foreground dialogue.",
      "Performance: this is enemy-wave geography. It should make Black Eagles disciplined and readable, not generic.",
    ],
    failureCriteria: [
      "More than six foreground-readable students appear as an anonymous crowd.",
      "Ferdinand, Edelgard, Hubert, or Dorothea drift into wrong weapons or wrong house colors.",
      "Blue Lions mix into the Black Eagles line instead of remaining separate.",
      "The shot becomes impact/contact rather than approach.",
    ],
  },
  {
    shot: "Shot032",
    title: "Dedue Guards Dimitri",
    duration: 12,
    priority: "preflight_02",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot032_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot032_keyframe.png",
    why: "This is the signature warrior-healer beat; motion must read as shield-line recovery, not medical aftermath or offensive magic.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot032 - Dedue Guards Dimitri.",
      "",
      "Begin exactly from the v2 start frame: Mercedes is behind the low wall with empty hands ready and no glow; Dedue is upright in the right foreground with a large padded shield facing Black Eagles pressure ahead/right-depth; Dimitri is behind Dedue's left shoulder with a long blunted training lance oriented toward the enemy/front.",
      "0-3s: Black Eagles pressure builds in front. Hubert's dark magic pressure and Ferdinand's training lance presence make Dedue brace. Dedue's shield line dips only one inch; he does not fall, bleed, or show a visible wound.",
      "3-5s: Dimitri begins to turn toward Dedue in concern. Dedue uses the shield/body line to block Dimitri's backward glance and keep his prince facing forward.",
      "5-8s: Mercedes stays in cover and sends one short clean white healing line from both empty hands through the low-wall gap directly to Dedue's shield arm/shoulder guard. The light must not attach to Dimitri's lance and must not look like an attack beam.",
      "8-12s: Dedue raises the shield fully again; Dimitri's lance line returns forward; enemies remain ahead/right-depth. The end handle holds the restored shield wall.",
      "",
      "Camera/motion: low-medium Blue Lions rear-left angle, minimal push toward Dedue's shield and Mercedes light. Keep the enemy-pressure axis in front of Dedue.",
      "Dialogue timing guide: Dimitri says '杜笃--' at 3s; Dedue answers '殿下，看前面。' at 5s; Mercedes asks 'Dedue，肩膀可以动了吗？' under the light; Dedue answers '足够。请继续。'",
      "Audio: padded shield thud, restrained breath, short clean white-magic shimmer, distant wooden weapons.",
    ].join("\n"),
    dialogue: [
      "Dimitri: '杜笃--'",
      "Dedue: '殿下，看前面。'",
      "Mercedes: 'Dedue，肩膀可以动了吗？'",
      "Dedue: '足够。请继续。'",
      "Performance: Dimitri's first word should almost break formation; Dedue's reply restores discipline; Mercedes is calm because she is solving a tactical problem, not reacting to a tragic wound.",
    ],
    failureCriteria: [
      "Mercedes glows in the start frame or steps into open ground.",
      "Healing light attaches to Dimitri's lance or becomes an offensive beam.",
      "Dedue collapses, bleeds, shows a wound, or turns away from enemy pressure.",
      "Dimitri changes to a sword or turns into a camera-facing portrait.",
      "Black Eagles pressure disappears, making the facing logic unreadable.",
    ],
  },
  {
    shot: "Shot030C",
    title: "Support Route Cut",
    duration: 8,
    priority: "blocking_mercedes_weapon_regen",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot030C_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot030C_keyframe.png",
    why: "Start/key were regenerated to remove Mercedes staff/focus risk. Motion must preserve empty-hand support magic from cover.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot030C - Support Route Cut.",
      "",
      "Use the current replaced start/key frames. Begin with Annette and Mercedes behind the southeast low wall, both facing the west/screen-left Golden Deer arrow route and the central fight beyond it. Mercedes must have empty hands only, no staff, no spear, no jeweled rod, no weapon-like focus.",
      "Golden Deer arrows cut the support lane nonlethally: one arrow alters a Black Eagles side route, another lands in the mud before Annette and Mercedes. Mercedes pulls Annette down behind cover rather than stepping into open ground.",
      "Annette prepares wind magic/book focus from cover; Mercedes remains a healer/support presence with empty hands and no offensive beam.",
      "",
      "Camera/motion: low-wall side angle with the arrow path crossing left-to-right. Keep faces young academy-age and keep the threat direction west/left.",
      "Audio: arrow clack in mud, Mercedes calm warning, Annette startled breath.",
    ].join("\n"),
    dialogue: [
      "Mercedes: '别停在空地上。'",
      "Annette: '右侧也有人！'",
      "Performance: Mercedes is practical and calm; Annette is startled but not helpless.",
    ],
    failureCriteria: [
      "Mercedes holds a staff, spear, jeweled rod, or weapon-like focus.",
      "Mercedes fires offensive magic instead of helping Annette stay in cover.",
      "Annette and Mercedes stand exposed in open ground after the arrows land.",
      "Any student reads as an adult rather than an academy-age student.",
    ],
  },
  {
    shot: "Shot032C",
    title: "Black Eagles Counterpressure",
    duration: 9,
    priority: "preflight_black_eagles_highlight",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot032C_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot032C_keyframe.png",
    why: "Start/key were regenerated to strengthen the Black Eagles high-light while preserving Golden Deer competence and Hilda youth identity v4.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot032C - Black Eagles Counterpressure.",
      "",
      "Use the current replaced start/key frames. Begin with Edelgard's restrained command signal from the Black Eagles line, Hubert and Dorothea facing west/screen-left toward the Golden Deer thicket, Claude and Hilda still in cover, and Blue Lions visible only as distant central pressure.",
      "0-3s: Edelgard gives a small hand signal, not a beauty pose or villain pose. The Black Eagles maintain disciplined formation under pressure.",
      "3-6s: Hubert sends subtle dark practice-magic pressure toward the thicket edge while Dorothea adds a short support rhythm. This redirects pressure and kicks up dust or leaves; it does not strike bodies or injure anyone.",
      "6-9s: Claude and Hilda shift laterally out of their safe angle but remain composed. Hilda must keep youth identity v4, pink twin ponytails, Golden Deer academy uniform, and compact padded training axe. End with Black Eagles having answered Golden Deer pressure, not routed them.",
      "",
      "Camera/motion: medium-wide cross-line angle. Keep west/left Golden Deer origin, north/right-depth Black Eagles source, and central Blue Lions pressure readable.",
      "Audio: Edelgard's quiet command, low dark-magic rumble, Dorothea's clipped breath or note, brush movement.",
    ].join("\n"),
    dialogue: [
      "Edelgard: 'Hubert。'",
      "Hubert: '明白。'",
      "Performance: calm controlled Black Eagles counterplay. They look competent, not cruel, and Golden Deer are pressured but not humiliated.",
    ],
    failureCriteria: [
      "Edelgard, Hubert, or Dorothea disappears from the counterpressure beat.",
      "Hubert becomes a melee fighter or uses a sword/lance instead of magic hand/book focus.",
      "Hilda reads as a mature adult, loses youth identity v4, or loses the compact training axe.",
      "Claude and Hilda look defeated, comic, or incompetent instead of forced to relocate.",
      "Black Eagles overpower Golden Deer with violent injury or turn the shot into a villain beat.",
      "The camera reverses map logic so Golden Deer no longer originate from west/screen-left.",
    ],
  },
  {
    shot: "Shot033B",
    title: "Byleth Command Reaction",
    duration: 8,
    priority: "creative_logic_regen_teacher_command",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot033B_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot033B_keyframe.png",
    why: "Start/key were regenerated after creative review rejected the prior Byleth camera-facing point pose and missing Blue Lions execution response.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot033B - Byleth Command Reaction.",
      "",
      "Use the current replaced start/key frames. Begin with Byleth side/back between student lanes and the teacher-platform objective. He recognizes the route window, then gives one clipped command gesture toward the northeast healing sigil.",
      "Blue Lions visibly execute the order: Ashe peels to a bow angle, Ingrid starts toward Manuela's route, Felix angles to the stair base, and Dimitri/Dedue hold central pressure below the platform.",
      "Hanneman and Manuela stay visible as objective/judges on the platform, not fantasy boss casters.",
      "",
      "Camera/motion: medium-wide tactical command-and-reaction. Keep Byleth from turning into a portrait.",
      "Audio: Byleth short command, footwork splitting into separate routes.",
    ].join("\n"),
    dialogue: [
      "Byleth: '现在。切老师。'",
      "Performance: clipped order, no speech. The frame must show students acting on it.",
    ],
    failureCriteria: [
      "Byleth faces camera as a lone pointing portrait.",
      "Blue Lions do not visibly react or peel into routes.",
      "Hanneman and Manuela become boss-like attack casters.",
      "The teacher-platform objective is not readable.",
    ],
  },
  {
    shot: "Shot033C",
    title: "Ashe Suppresses Hanneman",
    duration: 8,
    priority: "preflight_03",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot033C_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot033C_keyframe.png",
    why: "The stills pass, but video can turn the suppression into generic melee or make the line-of-fire ambiguous.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot033C - Ashe Suppresses Hanneman.",
      "",
      "Begin from the start frame with Ashe in the lower-left or center-left field position, bow ready but not yet released, eyes locked up the stone stairs toward Hanneman on the upper-right platform.",
      "Over the first half, Hanneman raises his spell hand/book focus and faces down the stairs. Ashe draws and releases a nonlethal training arrow toward the spell angle, not toward Hanneman's body.",
      "By the keyframe, the arrow lands on the stone step or target point before the spell pattern, breaking Hanneman's casting line with a pale wind-light disruption. Hanneman stays upright and composed.",
      "",
      "Camera/motion: preserve the lower-left to upper-right diagonal. Do not cross the line or reverse the direction.",
      "Audio: bowstring snap, arrow clack on stone, Hanneman spell shimmer breaking.",
    ].join("\n"),
    dialogue: [
      "Hanneman: '哦？先封我的角度。'",
      "Performance: Hanneman sounds intrigued rather than hurt. Ashe does not shout; his action answers Byleth's command.",
    ],
    failureCriteria: [
      "Ashe enters melee range or changes weapon.",
      "Hanneman becomes a sword/lance duelist instead of a spellcaster.",
      "The arrow hits a person or shows injury.",
      "The lower-left to upper-right line reverses or becomes unclear.",
    ],
  },
  {
    shot: "Shot033D",
    title: "Ingrid Routes Manuela Off Tile",
    duration: 8,
    priority: "creative_logic_regen_manuela_route_cut",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot033D_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot033D_keyframe.png",
    why: "Keyframe was regenerated after creative review found Ingrid passive and Manuela attacking Sylvain instead of being routed off the heal tile.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot033D - Ingrid Routes Manuela Off Tile.",
      "",
      "Use the current replaced keyframe. Ingrid is the active route cutter: she holds a long wooden training lance across Manuela's path back to the healing sigil. The lance blocks the route without contact or injury.",
      "Manuela side-steps off the sigil with white support magic fading, composed and impressed rather than defeated. Sylvain may remain background containment only; Manuela must not attack him.",
      "The motion is a rule-based displacement off the objective tile, not a duel or hit.",
      "",
      "Camera/motion: side route angle; keep the healing sigil and Ingrid's lance line visible.",
      "Audio: foot slide, soft white magic fade, lance wood creak.",
    ].join("\n"),
    dialogue: [
      "Manuela: '真是一点都不温柔的学生。'",
      "Ingrid: '抱歉，老师。规则允许。'",
      "Performance: Manuela is amused and surprised; Ingrid is formal, not aggressive.",
    ],
    failureCriteria: [
      "Ingrid becomes a passive observer instead of route cutter.",
      "Manuela attacks Sylvain or another student as the main action.",
      "Ingrid uses a sword/short blade instead of long training lance.",
      "Manuela is hit, injured, humiliated, or knocked down.",
      "The healing sigil / route objective is not visible.",
    ],
  },
  {
    shot: "Shot032D",
    title: "Two Adjacent Battle Lines",
    duration: 10,
    priority: "preflight_04",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot032D_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot032D_keyframe.png",
    why: "The strategic read depends on three readable lanes; video drift can collapse it into an unmotivated crowd.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot032D - Two Adjacent Battle Lines.",
      "",
      "Begin with the high oblique start frame. Keep three readable vectors: Blue Lions press upward/northeast into Black Eagles center; Golden Deer press from west/screen-left toward east/southeast; Black Eagles split attention southward toward Blue Lions and westward toward Golden Deer.",
      "Animate small tactical shifts only: two or three steps, shield/lance adjustments, arrows and magic pressure crossing lanes. Do not let everyone run into a single pile.",
      "By the keyframe, the lanes compress near the low walls but remain readable by house color, weapon role, and facing direction.",
      "",
      "Camera/motion: slow tactical drift or locked high-angle plate. Avoid fast orbiting; fast rotation will destroy map logic.",
      "Audio: layered wooden weapon taps, one arrow thud, low magic rumble, command voices in distance.",
    ].join("\n"),
    dialogue: [
      "No foreground dialogue. Use distant overlapping calls only.",
      "Performance: this is a tactical geography shot; dialogue should not pull the viewer away from the three readable lanes.",
    ],
    failureCriteria: [
      "All students merge into an unreadable crowd pile.",
      "Golden Deer attack only Blue Lions and no longer pressure Black Eagles.",
      "Black Eagles stop resisting Blue Lions or stop answering Golden Deer.",
      "House colors and weapon roles become indistinct.",
      "Camera rotates enough to break north/top and west/left continuity.",
    ],
  },
  {
    shot: "Shot032E",
    title: "First Three-Way Entanglement",
    duration: 10,
    priority: "preflight_05",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot032E_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot032E_keyframe.png",
    why: "This is the tactical exploit: Blue Lions win by using Golden Deer disruption, not by chasing Golden Deer or raw overpowering.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot032E - First Three-Way Entanglement.",
      "",
      "Begin from the start frame with three sides still readable around the low walls and wooden rails. Golden Deer pressure has destabilized both Blue Lions rear/support lane and Black Eagles side lane.",
      "Byleth does not chase west into the thicket. He points through the chaos and redirects Blue Lions to keep pushing Black Eagles toward the Golden Deer activity zone.",
      "Animate Blue Lions maintaining central pressure, Black Eagles shifting sideways under pressure, and Golden Deer losing their safe cover because Black Eagles also answer them. The motion should feel like controlled academy footwork, not a wild brawl.",
      "By the keyframe, the first local three-way entanglement forms, but three colors/teams and weapon roles remain readable.",
      "",
      "Camera/motion: medium-wide or high oblique drift with limited parallax. Keep the central obstacle group visible as the convergence anchor.",
      "Audio: Byleth short command, overlapping footwork, shield thuds, wooden weapon checks, one arrow clack.",
    ].join("\n"),
    dialogue: [
      "Byleth: '不要追金鹿。把黑鹫往他们那边压。'",
      "Performance: Byleth is clipped and unemotional. The line explains the win condition: exploit Golden Deer disruption instead of chasing them.",
    ],
    failureCriteria: [
      "Blue Lions chase Golden Deer into the west thicket.",
      "Golden Deer only attack Blue Lions and never pressure Black Eagles.",
      "Black Eagles become passive victims instead of reacting against both sides.",
      "Hilda reads older than the academy students or loses the youth identity v4 look.",
      "The shot becomes a random melee with no readable lanes.",
      "Any weapon changes away from the canon locks.",
    ],
  },
  {
    shot: "Shot034D",
    title: "Byleth Interrupts Hanneman",
    duration: 9,
    priority: "blocking_byleth_weapon_regen",
    start: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot034D_start.png",
    key: "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/Shot034D_keyframe.png",
    why: "Keyframe was regenerated to avoid bare-hand/high-five ambiguity. Motion must keep the visible sheathed-sword wrist/forearm tap.",
    prompt: [
      "AI VIDEO PROMPT V2 for Shot034D - Byleth Interrupts Hanneman.",
      "",
      "Use the current replaced keyframe. Begin with Hanneman on the northeast healing platform, upright and composed, spell hand/book focus raised toward the stairs. Byleth enters from Hanneman's side blind angle with a sheathed training sword, not bare hands.",
      "Byleth makes one precise nonlethal tap with the sword sheath against Hanneman's casting wrist/forearm guard. The contact is small and tactical, not a slap, not a punch, not a high five.",
      "The spell geometry breaks into a clean white shimmer around the wrist and stone step. Hanneman stays upright, surprised and impressed. Dimitri and Dedue remain below/near the platform and do not strike Hanneman.",
      "",
      "Camera/motion: tight medium side angle that clearly shows the sheathed blade between Byleth and Hanneman's wrist. Do not crop out the sheath.",
      "Audio: soft sheath tap, brittle spell crack, Hanneman's composed response.",
    ].join("\n"),
    dialogue: [
      "Hanneman: '判断得很好。'",
      "Performance: Hanneman is impressed by the tactical read, not hurt.",
    ],
    failureCriteria: [
      "Byleth uses bare hands, a slap, punch, or high-five gesture.",
      "The sheathed sword is absent or cropped out.",
      "Hanneman becomes a melee fighter or falls/injures himself.",
      "Dimitri is shown delivering the interrupt instead of Byleth.",
    ],
  },
];

const animaticRows = [
  ["Shot025", 10, "High establishing hold, tiny flag and student movement", "Manuela: '木制武器。倒地、出界、教师判定，立刻退出。治疗石台是目标。' Hanneman: '我和 Manuela 会负责治疗与裁定。'", "Teacher rule audio starts before cut", "Cut on Manuela's objective line"],
  ["Shot026", 12, "Push down to Byleth's mud map, hand draws the central lane", "Byleth: '先拿通道。' Felix: '如果机会已经出现呢？' Byleth: '机会不等于命令。'", "Quiet before horn", "Cut on Byleth: '先拿通道。'"],
  ["Shot026C", 9, "Low forward track with Dimitri/Dedue moving away from camera", "No dialogue; let the horn and first formation movement carry it.", "Horn hit, first footfalls", "Cut as Black Eagles enter same lane"],
  ["Shot027", 10, "Ashe high point side/back scan; bow stays low while he checks west thicket and central lane", "Ashe, low: '明白。' No Golden Deer reveal line yet.", "Bowstring tension", "Cut on his overwatch setup"],
  ["Shot027C", 10, "Side-on controlled first contact, shield/lance stop line", "Ferdinand: '黑鹫不会被一次冲锋打开！'", "Wood shield thud", "Cut on Ferdinand refusing collapse"],
  ["Shot027D", 8, "Felix half-step side cut, Byleth voice freezes him", "Byleth: 'Felix。' Felix: '啧。' Byleth: '等他回身。'", "Sword stop", "Cut when Felix obeys"],
  ["Shot028", 12, "Support line tracks along wall; Annette/Mercedes stay low", "Mercedes: '呼吸。跟着老师的信号走。' Annette: '我会跟上。'", "Breath and distant impacts", "Cut before arrows interrupt"],
  ["Shot029", 12, "Brief wide setup only: Sylvain/Ingrid right flank prepares for west/left Golden Deer pressure; keep readable weapons as long training lances", "Sylvain: '也就是说，我们是被人切后路之前的后路。' Ingrid: '少说一句，脚步会更快。'", "Distant thicket movement", "Cut before weapon ambiguity can dominate; detailed Golden Deer flank reveal belongs to Shot029B"],
  ["Shot029C", 9, "Claude in thicket, eyeline checks Blue rear then Black side", "Claude: '正面打得这么认真，那我只好帮你们都轻松一点。'", "Thicket rustle", "Cut on bow draw"],
  ["Shot029D", 8, "Claude's first arrow pins Ashe's observation point and forces him off the high mark", "Ashe: '金鹿在侧面！'", "Arrow hits wood before the line", "Cut on Ashe leaving the high point"],
  ["Shot029B", 9, "Hilda, Lorenz, and Ignatz expand Golden Deer pressure from thicket while Claude relocates", "Sylvain: 'Claude 可真会挑时候。' Ingrid: '他挑的是两边的缝。'", "Brush and wooden weapon movement", "Cut on Sylvain/Ingrid turning to contain Hilda/Lorenz"],
  ["Shot030C", 8, "Two Golden Deer arrows alter both teams' support routes", "Mercedes: '别停在空地上。' Annette: '右侧也有人！'", "Arrow wood clacks", "Cut on Mercedes pulling Annette down"],
  ["Shot031", 10, "Byleth crosses Felix's vector side-on, no lecture pose", "Byleth: '你再走十步，两边都会动。'", "Short command", "Cut on Felix stopping"],
  ["Shot031B", 10, "Byleth points two lines: central pressure and side containment", "Byleth: 'Dimitri，继续压。Dedue，别让口子合上。' Dimitri: '继续？' Byleth: '他们等你回头。别给。'", "Commands bridge into next shot", "Cut on Dimitri continuing forward"],
  ["Shot032", 12, "Dedue shield dips, Dimitri nearly turns, Mercedes short-heals shield arm, shield rises", "Dimitri: '杜笃--' Dedue: '殿下，看前面。' Mercedes: 'Dedue，肩膀可以动了吗？' Dedue: '足够。请继续。'", "Shield thud, white-magic shimmer", "Cut when lance line returns forward"],
  ["Shot032C", 9, "Hubert turns pressure west into thicket; Golden Deer must move", "Edelgard: 'Hubert。' Hubert: '明白。'", "Dark magic low rumble", "Cut on Claude displaced"],
  ["Shot032D", 10, "High oblique compression of three lines, no crowd pile", "No foreground dialogue; keep distant calls indistinct.", "Layered weapon taps", "Cut when lanes touch central obstacle"],
  ["Shot032E", 10, "Byleth redirects Blue Lions through chaos toward Black Eagles/Golden Deer overlap", "Byleth: '不要追金鹿。把黑鹫往他们那边压。'", "Byleth command, mixed footwork", "Cut on exploit becoming visible"],
  ["Shot033", 14, "Dimitri nears the platform but Byleth's palm-down gesture keeps him from overpressing", "Heavy breathing; no extra line yet. Byleth's restraint is visual.", "Breath tightens under battle sound", "Cut when Dimitri recognizes the restraint signal"],
  ["Shot033B", 8, "Byleth points to teacher platform, separate Blue lanes peel off", "Byleth: '现在。切老师。'", "Command: '现在。切老师。'", "Cut on Ashe/Ingrid/Felix reactions"],
  ["Shot033C", 8, "Ashe lower-left to Hanneman upper-right suppression", "Hanneman: '哦？先封我的角度。'", "Bow snap, spell shimmer breaks", "Cut after spell angle blocked"],
  ["Shot033D", 8, "Ingrid lance cuts Manuela's return route without hitting her", "Manuela: '真是一点都不温柔的学生。' Ingrid: '规则允许。'", "Foot slide, light spell stop", "Cut on Manuela side-step"],
  ["Shot034C", 9, "Felix checks Ferdinand at the stair base; neither is knocked out", "Ferdinand: '让开！' Felix: '你太吵了。'", "Three wooden weapon contacts", "Cut as Ferdinand's route is sealed"],
  ["Shot034D", 9, "Byleth taps Hanneman's wrist with sheathed blade", "Hanneman: '判断得很好。'", "Small spell crack", "Cut on Hanneman accepting call"],
  ["Shot034", 10, "Wide de-escalation, weapons lower, teachers off tile; Black Eagles and Golden Deer stand down with dignity", "Ending whistle; Claude: '真不像第一堂课。' Edelgard: '青狮赢了。但不是因为他们最会冲。'", "Ending whistle", "Cut to post-battle reaction"],
  ["Shot035", 10, "Felix close reaction after action; camera-facing now acceptable", "Felix: '你不是只会碰巧救人。'", "Breath settles", "Cut on his respect line"],
  ["Shot036", 12, "Dimitri lowers lance; hand tension lingers after Byleth already used the restraint command in Shot033/Shot034D action", "Dimitri: '今日我学到的，不只是战斗方式。'", "Quiet field tone", "End on unresolved emotional note"],
];

const globalFailureCriteria = [
  ["Direction reversal", "Reject if a shot reverses established map logic: Blue Lions no longer move lower-right to center/upper-right, Golden Deer no longer come from west/left, or Black Eagles no longer resist from north/right-depth."],
  ["Camera-facing under threat", "Reject if a threatened character turns into a front-facing beauty pose while enemies are visibly ahead or in depth."],
  ["Wrong weapons", "Reject if any named student swaps to a non-canon weapon for Scene09, especially Dimitri sword, Dedue slim weapon, Ashe melee weapon, Mercedes staff-spear/offensive beam, Hubert melee weapon, Claude non-bow, Hilda non-axe."],
  ["Shot029 lance ambiguity", "Reject Shot029 if Ingrid or Sylvain reads as holding a sword, dagger, short blade, axe, bow, or magic focus. If the lance cannot be made unmistakable, use Shot029 only as a very brief wide setup and let Shot029B carry the flank action."],
  ["Academy age failure", "Reject if any named academy student reads as a mature adult, teacher-age character, war-phase veteran, adult glamour model, or visibly older than the surrounding students. This explicitly includes Hilda in all Hilda-visible shots."],
  ["Opponent belittling", "Reject if Black Eagles or Golden Deer look incompetent, passive, comic, or easily routed. Blue Lions must win narrowly through the heal-tile objective and Byleth's timing."],
  ["Golden Deer logic loss", "Reject if Golden Deer only attack Blue Lions. They must also pressure Black Eagles side lanes so Blue Lions can exploit the chaos."],
  ["Shot032 healing failure", "Reject if the healing starts before motion, hits Dimitri's lance, becomes an attack beam, or makes Dedue collapse/bleed."],
  ["Crowd-pile drift", "Reject if Shot032D/Shot032E lose house-colored lanes and become indistinct bodies colliding."],
  ["Safety/tone failure", "Reject if any shot introduces blood, visible wounds, lethal strikes, gore, or war-phase battlefield brutality."],
  ["Identity drift", "Reject if named students age up, change hair color, change house costume silhouette, or become generic extras."],
];

function writeFile(file, body) {
  fs.writeFileSync(file, `${body.trim()}\n`);
}

for (const shot of highRiskShots) {
  const body = [
    `# ${shot.shot} ${shot.title} Video Prompt V2`,
    "",
    `Priority: ${shot.priority}`,
    `Duration target: ${shot.duration}s`,
    `Start frame: \`${shot.start}\``,
    `Keyframe: \`${shot.key}\``,
    "",
    "## Why This Is High Risk",
    "",
    shot.why,
    "",
    "## Prompt",
    "",
    shot.prompt,
    "",
    "Shared locks:",
    "",
    ...sharedLocks.map((item) => `- ${item}`),
    "",
    "## Dialogue / Performance",
    "",
    ...shot.dialogue.map((item) => `- ${item}`),
    "",
    "## Reject If",
    "",
    ...shot.failureCriteria.map((item) => `- ${item}`),
  ].join("\n");
  writeFile(path.join(outDir, `${shot.shot}_video_prompt_v2.md`), body);
}

const packageJson = {
  version: "2026-07-19",
  scope: "EP02 Scene09 high-risk video preflight before direct generation",
  policy: "Resolve the blocking still issues and run these high-risk shots first. Do not run the full Scene09 video batch until these pass motion QA.",
  shared_locks: sharedLocks,
  first_video_batch_order: highRiskShots.map((shot) => ({
    shot: shot.shot,
    title: shot.title,
    duration_seconds: shot.duration,
    priority: shot.priority,
    start_frame: shot.start,
    keyframe: shot.key,
    prompt_path: path.join(outDir, `${shot.shot}_video_prompt_v2.md`),
    why: shot.why,
    dialogue_performance: shot.dialogue,
    failure_criteria: shot.failureCriteria,
  })),
};

writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

const packageMd = [
  "# EP02 Scene09 Video Preflight Package",
  "",
  "Date: 2026-07-19",
  "",
  "Purpose: prepare the high-risk Scene09 shots for video generation without starting direct video generation yet.",
  "",
  "Policy: resolve the blocking still issues and run these high-risk shots first. Do not run the full Scene09 video batch until this preflight batch passes motion QA.",
  "",
  "## First Video Batch",
  "",
  "| Order | Shot | Duration | Dialogue Anchor | Risk | V2 Prompt |",
  "| --- | --- | ---: | --- | --- | --- |",
  ...highRiskShots.map((shot, index) => `| ${index + 1} | ${shot.shot} ${shot.title} | ${shot.duration}s | ${shot.dialogue[0]} | ${shot.why} | [prompt](${path.join(outDir, `${shot.shot}_video_prompt_v2.md`)}) |`),
  "",
  "## Shared Locks",
  "",
  ...sharedLocks.map((item) => `- ${item}`),
  "",
  "## Batch Pass Rule",
  "",
  "A generated clip passes only if the named shot-specific failure criteria are all false and the clip can cut from the prior shot into the next shot without reversing screen direction.",
  "",
  "## Recommended Generation Order",
  "",
  "1. Verify the 2026-07-20 creative replacements first in low-cost motion: Shot027B / named Black Eagles wave, Shot029 / Sylvain-Ingrid long-lance flank setup, Shot033B / Byleth command reaction, Shot033C / Ashe arrow-to-step suppression, Shot033D / Ingrid routes Manuela off tile.",
  "2. Verify earlier replaced stills in low-cost motion: Shot029B / Hilda youth, Shot030C / Mercedes empty hands, Shot032C / Black Eagles counterpressure, Shot034D / Byleth sheathed-sword wrist tap.",
  "3. Shot032: lock the signature Dedue/Mercedes healing beat with low-cost motion only.",
  "4. Shot027 and Shot033C: validate bow-line direction and nonlethal suppression.",
  "5. Shot032D and Shot032E: validate that three-way motion remains tactical, not a crowd pile, and that Hilda uses youth identity v4 when visible.",
  "6. Only after these pass, run the remaining Scene09 shots in timeline order.",
].join("\n");

writeFile(packageMdPath, packageMd);

const animaticJson = {
  version: "2026-07-19",
  scope: "EP02 Scene09 low-cost animatic timing plan",
  total_duration_seconds: animaticRows.reduce((sum, row) => sum + row[1], 0),
  rows: animaticRows.map(([shot, duration, motion, dialogue, sound, cut]) => ({
    shot,
    duration_seconds: duration,
    animatic_motion: motion,
    dialogue_performance: dialogue,
    sound_bridge: sound,
    cut_point: cut,
  })),
};

writeFile(animaticJsonPath, JSON.stringify(animaticJson, null, 2));

const animaticMd = [
  "# EP02 Scene09 Animatic Timing Plan",
  "",
  "Date: 2026-07-19",
  "",
  `Total planned Scene09 animatic duration: ${animaticJson.total_duration_seconds}s.`,
  "",
  "This is the low-cost motion plan before direct video generation. It uses existing start/key stills as anchors and describes camera drift, character movement, dialogue/performance, audio bridge, and cut point.",
  "",
  "| Shot | Duration | Animatic Motion | Dialogue / Performance | Sound Bridge | Cut Point |",
  "| --- | ---: | --- | --- | --- | --- |",
  ...animaticRows.map(([shot, duration, motion, dialogue, sound, cut]) => `| ${shot} | ${duration}s | ${motion} | ${dialogue} | ${sound} | ${cut} |`),
  "",
  "## Editing Notes",
  "",
  "- Keep Shot031 -> Shot032 -> Shot033 as the main tactical/emotional turn: Byleth refuses withdrawal, Dedue/Mercedes restore the shield line, then Blue Lions cut the teacher platform.",
  "- Do not use flashy camera rotation in the three-way section. Readability matters more than spectacle.",
  "- The quiet post-battle beats Shot035 and Shot036 may face camera because action has ended; this exception does not apply to active-threat shots.",
].join("\n");

writeFile(animaticMdPath, animaticMd);

const failureMd = [
  "# EP02 Scene09 Video Failure Criteria",
  "",
  "Date: 2026-07-19",
  "",
  "Use this checklist after each generated motion sample. A still can pass while the generated video fails.",
  "",
  "| Category | Reject Condition |",
  "| --- | --- |",
  ...globalFailureCriteria.map(([category, condition]) => `| ${category} | ${condition} |`),
  "",
  "## Shot-Specific Addendum",
  "",
  ...highRiskShots.flatMap((shot) => [
    `### ${shot.shot} ${shot.title}`,
    "",
    ...shot.failureCriteria.map((item) => `- ${item}`),
    "",
  ]),
].join("\n");

writeFile(failureMdPath, failureMd);

const dialogueGroups = [
  {
    title: "Opening Rules And Byleth Control",
    shots: ["Shot025", "Shot026", "Shot026C"],
    function: "Set the exercise rules and establish Byleth as a quiet command presence before action begins.",
  },
  {
    title: "First Read And Contact",
    shots: ["Shot027", "Shot027C", "Shot027D", "Shot028"],
    function: "Let Ashe, Ferdinand, Felix, Mercedes and Annette reveal temperament through short practical lines.",
  },
  {
    title: "Golden Deer Disruption",
    shots: ["Shot029", "Shot029C", "Shot029D", "Shot029B", "Shot030C", "Shot031", "Shot031B"],
    function: "Claude jokes because he understands the board; Byleth answers with clipped tactical control rather than speeches.",
  },
  {
    title: "Shield-Line Recovery",
    shots: ["Shot032"],
    function: "This is the emotional center: Dimitri's concern almost breaks direction, Dedue returns him to the front, Mercedes restores the line from cover.",
  },
  {
    title: "Exploit And Teacher Cut",
    shots: ["Shot032C", "Shot032D", "Shot032E", "Shot033", "Shot033B", "Shot033C", "Shot033D", "Shot034C", "Shot034D"],
    function: "Dialogue should explain tactical choice without pausing motion: Byleth exploits chaos, Ashe/Ingrid execute, teachers acknowledge the read.",
  },
  {
    title: "Aftermath",
    shots: ["Shot034", "Shot035", "Shot036"],
    function: "Allow camera-facing character beats after the whistle; this is where Felix and Dimitri carry meaning through dialogue.",
  },
];

const dialogueByShot = new Map(animaticRows.map(([shot, duration, motion, dialogue, sound, cut]) => [shot, {
  shot,
  duration_seconds: duration,
  animatic_motion: motion,
  dialogue,
  sound_bridge: sound,
  cut_point: cut,
}]));

const dialogueMd = [
  "# EP02 Scene09 Dialogue And Performance Pass",
  "",
  "Date: 2026-07-19",
  "",
  "Problem addressed: the mock battle should not play as pure action. Dialogue stays short because this is a moving tactical scene, but every major turn now has a character or command layer.",
  "",
  "## Principles",
  "",
  "- Dialogue is functional under pressure: orders, field reads, restraint, and brief personality flashes.",
  "- Do not stop the action for speeches during active combat.",
  "- Byleth speaks least and most precisely; Claude uses one playful tactical line; Felix is clipped; Mercedes calms; Dedue restores discipline; Dimitri reveals concern and restraint.",
  "- Silent shots are deliberate map-reading shots, not empty shots. They must carry performance through eyeline, breath, and posture.",
  "",
  "## Dialogue Arcs",
  "",
  ...dialogueGroups.flatMap((group) => [
    `### ${group.title}`,
    "",
    `Function: ${group.function}`,
    "",
    "| Shot | Dialogue / Performance |",
    "| --- | --- |",
    ...group.shots.map((shot) => {
      const row = dialogueByShot.get(shot);
      return `| ${shot} | ${row ? row.dialogue : "No dedicated dialogue."} |`;
    }),
    "",
  ]),
  "## Shot032 Performance Detail",
  "",
  "- Dimitri's '杜笃--' should begin as an instinctive turn, not a shouted melodrama.",
  "- Dedue's '殿下，看前面。' is the real turning point. It should feel protective and corrective at once.",
  "- Mercedes' line is calm and practical; she treats the shoulder/盾臂 as a tactical support problem.",
  "- Dedue's '足够。请继续。' lands after the shield is back up, so the cut can return to forward pressure.",
].join("\n");

writeFile(dialogueMdPath, dialogueMd);

console.log(`wrote ${highRiskShots.length} high-risk video prompt v2 files`);
console.log(packageJsonPath);
console.log(packageMdPath);
console.log(animaticJsonPath);
console.log(animaticMdPath);
console.log(failureMdPath);
console.log(dialogueMdPath);
