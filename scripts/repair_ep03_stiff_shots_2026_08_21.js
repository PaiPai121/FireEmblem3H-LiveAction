const fs = require("fs");
const path = require("path");

const root = process.cwd();
const epRoot = path.join(root, "episodes", "EP03");
const version = "critical_reaudit_regen_v2_2026-08-21";
const versionKey = "critical_reaudit_regen_v2";

const shots = {
  Shot001: {
    scene: "梦境残响",
    purpose: "把上一章的神秘意识延续到本章，并用一个真正的回应动作而不是换光粒暗示 Byleth 的身世不只属于教会。",
    location: "dream",
    characters: ["Byleth", "Sothis"],
    refs: [
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/characters/divine/Sothis/dream/legacy_ep01/candidate_03.png",
      "assets/locations/DreamSanctuary/EP01_scene_reference.png",
      "episodes/EP03/source_refs/Shot001_source.png"
    ],
    start: "在红色峡谷梦境的远台上，女贝老师背对镜头停在左前景，Sothis 还在远处等待；两人之间留出空旷的峡谷和圣像，像一场尚未回应的召唤。",
    key: "女贝老师转成左侧面并抬起一只手，Sothis 在中远景伸手回应；绿色光粒沿两人之间形成一条短暂的联系，动作峰值是伸手而不是换光。",
    end: "女贝老师突然向右侧异响转身，Sothis 在远处祭坛处分解成散开的光粒；两人不再处于对视构图，空出的中央空间交给下一镜。",
    camera: "低位宽镜头从远距离关系缓慢靠近，在伸手时保持双方同框，最后轻微横移到女贝老师的转身和空出的祭坛。",
    blocking: "START 女贝老师左前景、Sothis 远台；KEY 女贝老师抬手、Sothis 伸手回应；END 女贝老师转向画外、Sothis 消散，中央关系被打断。",
    peak: "女贝老师与 Sothis 之间短暂建立的伸手回应，以及随后被异响打断的消散。",
    dialogue: "Sothis, softly in Japanese: そなたは、また何を聞いたのじゃ？",
    finding: "2026-08-21 critical re-audit v2 replaces the previous face-to-face tableau. The three frames now progress from distant waiting to reciprocal reach to an interrupted turn and disappearance.",
    reject: "Reject if the dream becomes a flat collage, the hand reach is absent, Sothis becomes an adult glamorous woman, Byleth becomes male, magic only changes brightness, or START/KEY/END collapse into one stare.",
    prompt: [
      "# Shot001 Seedance Prompt",
      "",
      "Target: Seedance image-to-video, 8 seconds, cinematic live-action fantasy drama, 16:9.",
      "",
      "Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, dream geography, screen direction, lighting, and action continuity. Do not replace the cast, add a named character, or turn the frames into a collage.",
      "",
      "This is a red canyon dream terrace with a distant sacred statue and sparse green motes. Female Byleth is the adult academy professor with teal-blue hair and dark professor coat in every moment. Sothis remains the small, pale-haired divine girl established by the uploaded frames. Integrate both figures into one continuous dream space with real depth and scale; no pasted portrait cutouts, no game screenshot, no UI.",
      "",
      "0-2.5s: Begin on START. Hold the distant relationship for a breath, then let female Byleth take one careful step on the dark stone terrace while Sothis waits on the far platform. Keep the empty space between them readable.",
      "2.5-5.5s: Travel gently toward KEY. Female Byleth turns into profile and raises one hand. Sothis answers by extending one hand from the far platform. Green motes drift between their hands as a fragile bridge. This reciprocal reach is the action peak; do not solve it with a brightness change or a face zoom.",
      "5.5-8s: Move into END. A sound outside the dream pulls female Byleth's attention to the right; she turns away from Sothis. Sothis dissolves into a few controlled green motes at the distant altar, leaving the middle of the terrace empty. End on the interrupted connection and the turn toward the next shot.",
      "",
      "Use restrained live-action weight, foot contact, cloth drag, drifting particles, and a slow camera move. Preserve the uploaded START-to-KEY-to-END screen direction. Sothis speaks once, softly, in Japanese only: そなたは、また何を聞いたのじゃ？ Synchronize the line with the reach in KEY. Use low dream wind, a distant resonant tone, a small particle shimmer, and the off-screen disturbance that causes the END turn. No Chinese or Mandarin voiceover, subtitles, captions, readable text, or UI.",
      "",
      "Reject if Byleth becomes male or changes age, if Sothis becomes adult or glamorous, if the figures float or look pasted onto the canyon, if the particles overexpose faces, if the magic becomes an explosion, if the camera only zooms, if the three anchors are the same still, or if subtitles, text, watermark, game UI, or extra characters appear."
    ].join("\n"),
    negative: "No male or ambiguous Byleth, no war-phase Byleth, no adult Sothis, no flat cutout, no collage, no static face-to-face tableau, no lighting-only transition, no zoom-only motion, no magic explosion, no full-frame white flash, no extra named character, no subtitles, no captions, no dialogue box, no readable text, no game UI, no watermark, no Chinese or Mandarin voiceover, no camera spin, no duplicate START/KEY/END stills."
  },
  Shot002: {
    scene: "晨钟与修道院",
    purpose: "建立本章从学院日常转入教会军事命令，用一段真实走动和推门把空间推进到 Shot003。",
    location: "monastery",
    characters: ["Byleth"],
    refs: [
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png",
      "assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png"
    ],
    start: "高位广角建立雨后清晨的修道院回廊、钟楼和湿石地面；女贝老师从左下入口进入，远处模糊的教会人员和骑士正在集合，不形成表演式队列。",
    key: "镜头降到肩高跟拍，女贝老师沿拱廊横向穿过画面，衣摆和脚步带出真实移动；远处拱门之间的集结被她经过时逐渐看见。",
    end: "女贝老师抵达议事门前，把手放上厚重木门并推开；温暖的室内光切入冷湿回廊，形成明确的门口交接。",
    camera: "从高位晨钟建立镜头下摇到肩高侧向跟拍，最后以门把手和门内光线完成匹配剪辑。",
    blocking: "START 女贝老师从左下进入；KEY 她沿回廊横向行走并经过拱柱；END 她在议事门前推门，远处集结只作背景压力。",
    peak: "女贝老师从晨雾回廊穿行到议事门，并亲手打开进入军事命令的门。",
    dialogue: "No spoken dialogue. Morning bell, wet footsteps, distant armor, and the door hinge only.",
    finding: "2026-08-21 critical re-audit v2 replaces the previous corridor tableau. The three frames now form a geographic move: enter the cloister, cross the arcade, push the council door.",
    reject: "Reject if Byleth floats, turns male, looks pasted onto the cloister, if the shot becomes three static monastery views, if the distant group becomes a lineup, or if any spoken dialogue, subtitle, or UI appears.",
    prompt: [
      "# Shot002 Seedance Prompt",
      "",
      "Target: Seedance image-to-video, 10 seconds, cinematic live-action monastery transition, 16:9.",
      "",
      "Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for the female professor's identity, academy wardrobe, monastery geography, screen direction, weather, and doorway continuity. Do not use a game screenshot as a frame and do not invent a different cast.",
      "",
      "This is a wet dawn at Garreg Mach. Female Byleth, the adult woman with teal-blue hair and dark professor coat, is the only named character. Church attendants and knights may remain indistinct background figures only.",
      "0-3s: Begin on START with the high wide monastery view. Let the morning bell finish its resonance. Female Byleth enters from the lower left and takes two grounded steps onto the wet stone. In the far background, indistinct church personnel begin to gather under the arches; they do not pose for camera.",
      "3-7s: Travel down to the uploaded KEY relationship and track laterally at shoulder height. Female Byleth walks through the arcade in profile. Her coat hem moves, her boots make contact with the wet floor, and columns briefly occlude and reveal her. Through the arches, the distant armored assembly becomes readable as a pressure behind her path.",
      "7-10s: Move into END. Female Byleth reaches the council door, places one hand on the iron latch, and pushes it open. Warm interior light spills into the cold corridor as the heavy door crosses the frame. End on the threshold for a match cut into the council scene.",
      "",
      "Keep the camera physically motivated by her walk. Preserve real reflections, scale, foot contact, damp air, cloth weight, and the START-to-KEY-to-END screen direction. No spoken dialogue in this shot. Use only the morning bell, wet footsteps, distant armor and muted movement, fabric, hinge strain, and room tone. No subtitles, captions, text, or UI.",
      "",
      "Reject if female Byleth becomes male, ghostlike, adult-war-phase, or detached from the floor; if the distant figures become named characters or a posed line; if the camera only zooms between stills; if the doorway does not open; or if subtitles, dialogue, text, watermark, game UI, or spoken voice appears."
    ].join("\n"),
    negative: "No spoken dialogue, no voiceover, no male or ambiguous Byleth, no war-phase Byleth, no pasted cutout, no floating feet, no floor detachment, no static corridor tableau, no lighting-only change, no zoom-only motion, no posed background lineup, no extra named character, no subtitles, no captions, no readable text, no game UI, no watermark, no Chinese text, no camera spin, no duplicate START/KEY/END stills."
  },
  Shot003: {
    scene: "任务召集",
    purpose: "让任务召集成为一次具有权力转移的教会命令，而不是人物对着镜头站定说明。",
    location: "cathedral",
    characters: ["Rhea", "Seteth", "Byleth", "Dimitri"],
    refs: [
      "assets/characters/church_of_seiros/Rhea/academy/selected.png",
      "assets/characters/church_of_seiros/Seteth/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png",
      "assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png"
    ],
    start: "议事门打开后的湿冷大教堂中，女贝老师和 Dimitri 从下方进入，Rhea 在祭坛台阶上，成熟学院篇 Seteth 站在她侧后方并持有报告册；权力高差先成立。",
    key: "Seteth 合上报告册并向 Rhea 迈步，把报告册递到她伸出的手里；Rhea 接过报告册，女贝老师和 Dimitri 在下方以目光反应，而不是排成一列。",
    end: "Rhea 背向众人转向祭坛，Seteth 带着合上的报告册横向下阶；女贝老师保持左侧面，Dimitri 转向画外的 Ashe，中央通道被留空。",
    camera: "从下方入场的中广角缓慢推向祭坛，随后在报告交接处做轻微横移，结尾停在 Rhea 转身和 Seteth 下阶的权力错位。",
    blocking: "START 学生低位进入、Rhea/Seteth 高位；KEY Seteth 两步交报告、Rhea 抬手接收；END Rhea 转身、Seteth 下阶、学生留在低位并分开反应。",
    peak: "报告册从 Seteth 手中移交到 Rhea 手中，随后 Rhea 以转身确认命令已成制度性决定。",
    dialogue: "Rhea, in Japanese: 西方教会が、ガスパール領主ロナートを扇動し、兵を挙げさせました。",
    finding: "2026-08-21 critical re-audit v2 replaces the previous council lineup. Seteth now performs a readable folio handoff, Rhea receives it, and the end frame turns the authority away from the students.",
    reject: "Reject if Seteth looks young or generic, if female Byleth becomes male, if the folio handoff is absent, if Rhea only changes expression, or if the four characters remain a static symmetrical tableau.",
    prompt: [
      "# Shot003 Seedance Prompt",
      "",
      "Target: Seedance image-to-video, 12 seconds, cinematic live-action cathedral drama, 16:9.",
      "",
      "Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, academy wardrobe, cathedral floor, altar axis, eyelines, and blocking. Do not replace the cast or add a named character.",
      "",
      "The council meets inside the cathedral immediately after the wet monastery entrance. The visible named cast is Rhea, mature academy Seteth, female academy Byleth, and Dimitri. Seteth must read as the mature green-haired academy adviser from the uploaded frames, not a young generic man and not a war-phase redesign. Female Byleth is the only Byleth and remains an adult woman with teal-blue hair and dark professor coat. Keep everyone physically integrated into the same stone floor, light, depth, and perspective.",
      "0-3s: Begin on START. The heavy doors settle behind female Byleth and Dimitri as they take two quiet steps into the lower cathedral. Rhea remains above on the altar steps. Seteth holds a closed report folio beside her. Their attention pulls the students upward; no one faces the camera in a lineup.",
      "3-7s: Travel toward KEY along the aisle. Seteth takes two measured steps down and across, closes the folio firmly, then extends it to Rhea. Rhea raises one hand and accepts the folio. This transfer is the action peak. Byleth and Dimitri remain below, making small eye and posture reactions.",
      "7-10s: Hold the handoff long enough to read the institutional exchange. Rhea speaks calmly in Japanese: 西方教会が、ガスパール領主ロナートを扇動し、兵を挙げさせました。 Keep the line synchronized to the folio entering her hand; no theatrical villain performance.",
      "10-12s: Move into END. Rhea turns away toward the altar with the folio. Seteth steps laterally down the stair with his hands now empty. Dimitri turns toward an off-screen Ashe cue while female Byleth stays in left profile. Leave an empty aisle between the students and the authority for the next shot.",
      "",
      "Use restrained live-action timing, real foot contact, robe and folio weight, cathedral reverb, and a motivated dolly. No subtitles, captions, readable text, UI, Chinese or Mandarin voiceover. Reject if Seteth becomes young, if Byleth becomes male, if the folio never changes hands, if the cast becomes pasted cutouts, if the students form a line, or if START/KEY/END collapse into one council still."
    ].join("\n"),
    negative: "No young generic Seteth, no war-phase Seteth, no male or ambiguous Byleth, no face or wardrobe drift, no pasted cutout, no floating feet, no static council lineup, no expression-only transition, no zoom-only motion, no villain smirk, no exaggerated anime reaction, no extra named character, no subtitles, no captions, no readable text, no game UI, no watermark, no Chinese or Mandarin voiceover, no combat, no weapon draw, no gore, no duplicate START/KEY/END stills."
  },
  Shot004: {
    scene: "养父的名字",
    purpose: "把任务说明压成 Ashe 的身体反应和离队方向，让信息改变人物关系和行走路线。",
    location: "cathedral",
    characters: ["Ashe", "Byleth", "Dimitri"],
    refs: [
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png",
      "episodes/EP03/source_refs/Shot004_source.png"
    ],
    start: "Ashe 已先走出几步来到教堂侧廊，弓压低在身侧；女贝老师和 Dimitri 落后形成斜线，三人共享地面和空间但没有站成一排。",
    key: "Ashe 停住并握紧肩带，侧脸回认这个名字；女贝老师和 Dimitri 在后方分别停步，目光收向 Ashe，动作峰值是他从离开转为回听。",
    end: "Ashe 转身半步离开画面，女贝老师伸手示意让路，Dimitri 留在近景看向他；拱门和空出的过道把叙事交给下一镜。",
    camera: "侧向跟随 Ashe 的前进，在他停步时切入肩高中近景，最后回到斜线广角让出离开的过道。",
    blocking: "START Ashe 前、Byleth/Dimitri 后；KEY Ashe 停下握肩带并回听；END Ashe 先动身离开，Byleth 让路，Dimitri 目送。",
    peak: "Ashe 听见养父名字后主动停步并回头，随后选择继续向前，而不是三人继续说明。",
    dialogue: "Seteth, in Japanese: ロナート卿は、かつてアッシュを養子として迎えた人物だ。",
    finding: "2026-08-21 critical re-audit v2 keeps Ashe ahead of the group and uses a stop, recognition, and departure chain instead of a three-person cathedral portrait.",
    reject: "Reject if Ashe remains in a neutral pose, if he looks adult or generic, if Byleth becomes male, if the bow disappears or becomes a sword, or if the shot only alternates close-ups without a stop-and-go action.",
    prompt: [
      "# Shot004 Seedance Prompt",
      "",
      "Target: Seedance image-to-video, 9 seconds, cinematic live-action academy drama, 16:9.",
      "",
      "Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for the three academy identities, cathedral side aisle, bow continuity, screen direction, and scale. Do not add a named character.",
      "",
      "Visible cast: Ashe, female academy Byleth, and Dimitri. Ashe is the youthful blond academy archer with his bow and shoulder gear. Female Byleth is the adult woman with teal-blue hair and dark professor coat. Dimitri is the tall blond academy prince in blue. Integrate all three into the same stone floor and cathedral light.",
      "0-2.5s: Begin on START. Ashe is several paces ahead, walking down the side aisle with his bow lowered. Female Byleth and Dimitri follow on a diagonal, not a line. Keep the emotional space ahead of Ashe open.",
      "2.5-6s: Move to KEY. Ashe hears the report, stops, grips the strap at his shoulder, and turns his face just enough to recognize the name. Byleth and Dimitri slow behind him and direct their eyelines toward Ashe. The off-screen Seteth line is Japanese only: ロナート卿は、かつてアッシュを養子として迎えた人物だ。 The action peak is Ashe stopping and listening, not a dramatic cry.",
      "6-9s: Move into END. Ashe takes a half-turn and starts walking again toward the next arch. Female Byleth opens one hand to give him the path. Dimitri stays in the near side of frame and watches Ashe leave. Let the empty corridor become the handoff to the next shot.",
      "",
      "Use restrained support-theater timing, real foot contact, bow weight, cloth drag, and subtle facial reaction. Do not make the cast pose, do not use a static zoom, and do not cut the geography apart with a lighting-only transition. No subtitles, captions, readable text, or UI.",
      "Reject if Ashe looks adult, if Byleth becomes male, if the bow changes into a sword, if all three form a lineup, if no one stops or leaves, or if text, subtitles, watermark, game UI, Chinese or Mandarin speech appears."
    ].join("\n"),
    negative: "No adult Ashe, no generic archer, no wrong weapon, no sword, no spear, no male or ambiguous Byleth, no war-phase costume, no pasted cutout, no static group portrait, no line-up, no expression-only motion, no zoom-only transition, no extra named character, no subtitles, no captions, no readable text, no game UI, no watermark, no Chinese or Mandarin voiceover, no combat, no exaggerated grief, no duplicate START/KEY/END stills."
  },
  Shot005: {
    scene: "同行请求",
    purpose: "用支援小剧场式的门口阻挡、请求、让路完成同伴关系变化。",
    location: "classroom",
    characters: ["Byleth", "Dimitri", "Ashe"],
    refs: [
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/locations/EP02/act01/OfficersAcademyClassroom/OfficersAcademyClassroom_reference.png",
      "episodes/EP03/source_refs/Shot005_source.png"
    ],
    start: "下课后的教室仍有书本和弓具，Ashe 坐在桌边，Dimitri 卡在敞开的门口，女贝老师在讲台侧；两个模糊学生走出远门，三人没有看镜头。",
    key: "Dimitri 关上门并把手留在门闩上，向女贝老师迈一步提出同行请求；Ashe 从桌边转身合书，女贝老师在两人之间听取请求。",
    end: "Ashe 站起并抓住弓袋肩带，女贝老师点头让出通道；Dimitri 退到门侧，让 Ashe 先经过空门。",
    camera: "从教室深处的三角站位开始，靠近门闩和 Dimitri 的一步，再向打开的门和 Ashe 的离开动作回拉。",
    blocking: "START Ashe 坐左、Dimitri 在门中、Byleth 在讲台侧；KEY Dimitri 关门迈步、Ashe 合书回身；END Ashe 起身取弓袋、Byleth 让路、Dimitri 退侧。",
    peak: "Dimitri 关门后向老师提出同行请求，Ashe 的起身把口头请求转成实际行动。",
    dialogue: "Dimitri, in Japanese: 先生、今日は彼と共に行かせてください。",
    finding: "2026-08-21 critical re-audit v2 replaces the classroom lineup with a three-stage handoff: Ashe waits, Dimitri closes the door and asks, then Ashe rises and is given the exit.",
    reject: "Reject if the classroom becomes a posed group portrait, if Dimitri looks out the window instead of addressing Byleth, if Ashe never rises, if the exit does not become usable, or if Byleth becomes male.",
    prompt: [
      "# Shot005 Seedance Prompt",
      "",
      "Target: Seedance image-to-video, 9 seconds, cinematic live-action academy support scene, 16:9.",
      "",
      "Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, classroom geography, academy wardrobes, bow continuity, and the door handoff. Do not add a named character or use a game screenshot as a frame.",
      "",
      "Female Byleth is the adult woman with teal-blue hair and dark professor coat. Dimitri is the tall blond academy prince in blue. Ashe is the smaller blond academy archer with his bow and shoulder gear. Keep all three physically integrated into the same stone classroom with believable scale and contact shadows.",
      "0-2.5s: Begin on START just after class. Ashe remains seated beside a desk with a closed book and bow within reach. Dimitri stands at the open doorway, turned toward the room. Female Byleth is near the teacher's desk, looking toward them. Two indistinct students leave in the distant corridor. Do not make a lineup.",
      "2.5-5.5s: Move to KEY. Dimitri pulls the heavy door shut and keeps one hand on the latch while taking one deliberate step toward female Byleth. His eyes and torso address Byleth, not a window. Ashe turns from his desk and closes his book, surprised. Byleth looks between them and listens. Dimitri speaks once in Japanese: 先生、今日は彼と共に行かせてください。 No subtitles or text.",
      "5.5-9s: Move into END. Ashe rises fully and reaches for the shoulder strap of his bow case. Female Byleth gives a small acknowledging nod and opens a clear path toward the door. Dimitri steps aside so Ashe can pass first. Let the doorway and empty corridor pull the camera forward into the next shot.",
      "",
      "Use restrained support-theater timing, real chair and foot movement, book and bow weight, cloth drag, and a gentle motivated camera move. The line must cause the blocking change. Do not solve the shot with a static zoom, lighting-only change, or repeated three-person pose.",
      "Use the Japanese line only, plus chair scrape, book cover, door latch, cloth, footsteps, and room tone. Reject if Dimitri looks out a window, if Ashe never rises, if the door never closes or opens as a path, if Byleth becomes male, if the cast becomes pasted cutouts, or if subtitles, readable text, UI, watermark, Chinese or Mandarin speech, or extra named characters appear."
    ].join("\n"),
    negative: "No Dimitri looking out a window, no static classroom lineup, no posed group portrait, no male or ambiguous Byleth, no war-phase costume, no pasted cutout, no floating feet, no missing door action, no missing Ashe rise, no expression-only motion, no zoom-only transition, no extra named character, no subtitles, no captions, no readable text, no game UI, no watermark, no Chinese or Mandarin voiceover, no modern objects, no duplicate START/KEY/END stills."
  },
  Shot035: {
    scene: "杀意与正义",
    purpose: "把 Dimitri 的危险自省拍成行走、停下、离开，而不是两个人并排站着交换台词。",
    location: "monastery",
    characters: ["Dimitri", "Byleth"],
    refs: [
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png"
    ],
    start: "夜雨后的修道院回廊里，Dimitri 走在中远景，女贝老师落后几步停在石柱附近；同一空间里有距离，Dimitri 的步伐先于谈话。",
    key: "Dimitri 在月光下停住，把手套摘下并把裸手压在湿冷石栏上，低头整理情绪；女贝老师停在两步之外没有打断，形成身体上的克制。",
    end: "Dimitri 说完后重新向深处拱门走去并变小，女贝老师留在暖灯和石柱下转身目送，湿空走廊把情绪交给下一镜。",
    camera: "从长廊宽景的跟随移动到石栏手部和低头的中近景，再拉成长焦让 Dimitri 进入暗处、Byleth 留在灯下。",
    blocking: "START Dimitri 前行、Byleth 后方；KEY Dimitri 停下压栏、Byleth 不触碰；END Dimitri 离开暗拱、Byleth 留灯下目送。",
    peak: "Dimitri 通过摘手套并压住石栏把抽象的杀意落到一个身体动作，随后选择离开。",
    dialogue: "Dimitri, in Japanese: 殺意が正義をまとえば、とても静かになるのですね。",
    finding: "2026-08-21 critical re-audit v2 replaces the previous static conversation candidate. The chain is walk, brace and speak, then leave Byleth under the lamp.",
    reject: "Reject if Dimitri and Byleth become a static two-shot, if Dimitri appears war-phase, if Byleth becomes male, if the hand-to-stone action is absent, or if the final distance does not increase.",
    prompt: [
      "# Shot035 Seedance Prompt",
      "",
      "Target: Seedance image-to-video, 10 seconds, cinematic live-action academy drama, 16:9.",
      "",
      "Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for academy-era identity, monastery cloister geography, night weather, screen direction, and emotional distance. Do not add a named character.",
      "",
      "Dimitri is the tall blond young academy prince in a blue cloak and dark academy uniform. Female Byleth is the adult woman with teal-blue hair and dark professor coat. Academy phase only: no war-torn armor, no battlefield, no adult redesign. Keep both bodies grounded in the same wet cloister with shared reflections and depth.",
      "0-3s: Begin on START. Dimitri walks along the arcade in the middle distance, seen in three-quarter back view. Female Byleth follows several paces behind near a stone column. Let the distance remain visible; this is a difficult conversation about to start, not a posed two-shot.",
      "3-6.5s: Travel to KEY. Dimitri stops beneath the moonlight, removes one glove, and rests his bare hand on the wet stone balustrade. His head lowers and his shoulders brace. Female Byleth stops two steps behind and does not touch him. Dimitri speaks once in Japanese: 殺意が正義をまとえば、とても静かになるのですね。 The physical stop and hand-to-stone release are the action peak.",
      "6.5-10s: Move into END. After the line, Dimitri resumes walking into the darker archway. Female Byleth remains under the warm lamp beside the column and turns to watch him leave. Keep an empty wet corridor between them. End on Byleth's stillness and Dimitri's increasing distance, not on a repeated conversation pose.",
      "",
      "Use restrained breathing, foot contact, glove and stone texture, wet cloth, and slow motivated camera movement. No subtitles, captions, readable text, or UI.",
      "Use the Japanese line only, with rain residue, distant monastery room tone, cloth, boots, and one glove against stone. Reject if Dimitri becomes war-phase, if Byleth becomes male, if the scene becomes a static two-person portrait, if Dimitri never stops or leaves, if the distance does not change, or if subtitles, text, watermark, game UI, Chinese or Mandarin speech, or extra characters appear."
    ].join("\n"),
    negative: "No war-phase Dimitri, no adult battlefield costume, no male or ambiguous Byleth, no static two-person portrait, no standing-and-talking tableau, no missing glove action, no missing walk-away, no pasted cutout, no floating feet, no expression-only motion, no zoom-only transition, no extra named character, no subtitles, no captions, no readable text, no game UI, no watermark, no Chinese or Mandarin voiceover, no modern objects, no duplicate START/KEY/END stills."
  }
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}
function framePaths(id) {
  return {
    start: "storyboards/" + id + "/" + version + "/start_frame.png",
    key: "storyboards/" + id + "/" + version + "/key_frame.png",
    end: "storyboards/" + id + "/" + version + "/end_frame.png"
  };
}
function frameSet(id, def, md, json) {
  return {
    version,
    frame_set_id: id + "_" + version,
    source: "built_in_imagegen_with_local_selected_character_and_location_references",
    reference_assets: def.refs,
    frames: framePaths(id),
    contact_sheet: "storyboards/" + id + "/" + version + "/contact_sheet.jpg",
    status: "monitor_required",
    visual_audit_decision: "monitor_required",
    review_markdown: md,
    review_json: json,
    note: def.finding,
    reject_if: def.reject
  };
}
function markOlderCandidates(record) {
  for (const [key, candidate] of Object.entries(record)) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;
    if (/local_asset_final_candidate_v1|critical_reaudit_regen_v1|integrated_candidate_v2/.test(key)) {
      candidate.status = "blocked_needs_revision";
      candidate.visual_audit_decision = "blocked_needs_revision";
      candidate.blocker = "Superseded by the 2026-08-21 action-chain re-audit: previous candidate was too static or repeated the same tableau.";
    }
  }
}
function reviewMarkdown(id, def) {
  return [
    "# " + id + " Critical Re-audit Review — " + version,
    "",
    "Decision: monitor_required",
    "",
    "## Local reference lock",
    "",
    def.refs.map((ref) => "- " + ref).join("\n"),
    "",
    "## Frame findings",
    "",
    "- START: " + def.start,
    "- KEY: " + def.key,
    "- END: " + def.end,
    "",
    "## Action-chain decision",
    "",
    "- Blocking: " + def.blocking,
    "- Action peak: " + def.peak,
    "- Camera: " + def.camera,
    "- Dialogue/audio: " + def.dialogue,
    "",
    "## Gate",
    "",
    "The frames are physically integrated live-action candidates generated with the listed local references. They are current for web display but remain monitor_required. Prompt QA must be checked against the uploaded triptych, followed by a 3-second motion probe. Do not promote to approved_for_video from still frames alone.",
    "",
    "Reject if: " + def.reject
  ].join("\n");
}
function reviewJson(id, def) {
  return {
    shot_id: id,
    version,
    decision: "monitor_required",
    local_reference_assets: def.refs,
    frame_set: framePaths(id),
    contact_sheet: "episodes/EP03/storyboards/" + id + "/" + version + "/contact_sheet.jpg",
    start_finding: def.start,
    key_finding: def.key,
    end_finding: def.end,
    blocking: def.blocking,
    action_peak: def.peak,
    prompt_language_gate: id === "Shot002" ? "silent_audio_only" : "Japanese_dialogue_only",
    female_byleth_lock: def.characters.includes("Byleth") ? "assets/characters/protagonist/BylethFemale/professor/selected.png" : null,
    prompt_qa: "pending_review_against_critical_reaudit_regen_v2",
    motion_probe: "pending_3s_probe_against_critical_reaudit_regen_v2_2026-08-21",
    reject_if: def.reject
  };
}
function patchRecord(record, id, def, md, json) {
  const paths = framePaths(id);
  record.status = "monitor_required";
  record.current_display_frame_set = versionKey;
  record.current_display_frame_status = "monitor_required_" + version;
  record.current_display_frame_source = "imagegen_from_local_selected_assets_action_chain_reaudit_v2_2026-08-21";
  record.current_display_frame_note = def.finding;
  record.visual_audit_decision = "monitor_required";
  record.visual_audit_finding = def.finding;
  record.required_revision = "Run prompt-against-frame QA and a 3-second motion probe. " + def.reject;
  record.video_prompt_qa_decision = "pending_review_against_critical_reaudit_regen_v2";
  record.motion_probe_status = "pending_3s_probe_against_critical_reaudit_regen_v2_2026-08-21";
  record.motion_risk_status = "monitor_required_after_static_reaudit_before_motion_probe";
  record.asset_references = def.refs;
  record.characters = def.characters;
  record.scene = def.scene;
  record.location = def.location;
  record.audio_anchor = def.dialogue;
  record.output_frames = paths;
  record.start_frame = paths.start;
  record.key_frame = paths.key;
  record.end_frame = paths.end;
  record.planned_frames = paths;
  record.frame_spec = "storyboards/" + id + "/frame_spec.md";
  record[versionKey] = frameSet(id, def, md, json);
  markOlderCandidates(record);
}
function frameSpec(id, def) {
  return [
    "# " + id + " Frame Spec",
    "",
    "Shot ID: " + id,
    "Stage: storyboard",
    "Status: monitor_required",
    "Script Beat: " + def.scene,
    "Shot Purpose: " + def.purpose,
    "Location: " + def.location,
    "Characters Visible: " + def.characters.join(", "),
    "",
    "## Character Identity Locks",
    "",
    def.refs.filter((ref) => ref.includes("/characters/")).map((ref) => "- " + ref).join("\n"),
    def.characters.includes("Byleth") ? "- Female Byleth only: assets/characters/protagonist/BylethFemale/professor/selected.png; no male or war-phase Byleth." : "",
    "",
    "## Asset References",
    "",
    def.refs.map((ref) => "- " + ref).join("\n"),
    "",
    "Presence Lock: " + def.characters.join(", ") + " only, with background figures indistinct unless explicitly stated in the prompt.",
    "",
    "Start Frame Intent: " + def.start,
    "",
    "Key Frame Intent: " + def.key,
    "",
    "End Frame Intent: " + def.end,
    "",
    "Camera: " + def.camera,
    "Blocking: " + def.blocking,
    "Action Peak: " + def.peak,
    "Dialogue / Audio Anchor: " + def.dialogue,
    "",
    "Continuity Requirements: START, KEY, and END must be visibly different action states with shared geography, identity, wardrobe, lighting direction, and contact shadows. The generated people must be integrated into the live-action scene, not pasted cutouts.",
    "",
    "Reject If:",
    "- the frame is a game screenshot, UI, subtitle, caption, or readable text",
    "- a named identity drifts, Byleth becomes male, or academy phase becomes war phase",
    "- the action peak is missing and the triptych is only a lighting, crop, or texture variation",
    "- a person floats, loses floor contact, or detaches from the scene perspective",
    "- the shot becomes a static symmetrical lineup or a repeated conversation tableau",
    "- the exact reject conditions in the prompt are violated",
    "",
    "Planned Frames:",
    "- start_frame.png: storyboards/" + id + "/" + version + "/start_frame.png",
    "- key_frame.png: storyboards/" + id + "/" + version + "/key_frame.png",
    "- end_frame.png: storyboards/" + id + "/" + version + "/end_frame.png",
    "- contact_sheet.jpg: storyboards/" + id + "/" + version + "/contact_sheet.jpg",
    "",
    "Critical Re-audit Repair Pass — 2026-08-21",
    "",
    def.finding,
    "",
    "Keep monitor_required until the Japanese/silent audio contract is checked against the uploaded frames and a 3-second motion probe confirms the action chain, identity locks, contact shadows, and moving tail. " + def.reject
  ].join("\n");
}
function main() {
  const queueFile = path.join(epRoot, "frame_generation_queue.json");
  const deliveryFile = path.join(epRoot, "production_system", "video_delivery_manifest.json");
  const queue = readJson(queueFile);
  const delivery = readJson(deliveryFile);
  const deliveryById = new Map(delivery.shots.map((shot) => [shot.id, shot]));
  for (const [id, def] of Object.entries(shots)) {
    const reviewDir = path.join(epRoot, "production_system", "reviews", "critical_reaudit_2026-08-21");
    fs.mkdirSync(reviewDir, { recursive: true });
    const mdRel = "production_system/reviews/critical_reaudit_2026-08-21/" + id.toLowerCase() + "_critical_reaudit_regen_v2_2026-08-21_review.md";
    const jsonRel = "production_system/reviews/critical_reaudit_2026-08-21/" + id.toLowerCase() + "_current_web_candidate_reaudit_2026-08-21.json";
    const mdAbs = path.join(epRoot, mdRel);
    const jsonAbs = path.join(epRoot, jsonRel);
    const jsonValue = reviewJson(id, def);
    fs.writeFileSync(mdAbs, reviewMarkdown(id, def));
    writeJson(jsonAbs, jsonValue);
    const metadataFile = path.join(epRoot, "storyboards", id, "metadata.json");
    const metadata = readJson(metadataFile);
    patchRecord(metadata, id, def, mdRel, jsonRel);
    metadata.prompt_path = "video_prompts/" + id + "_prompt.md";
    metadata.negative_prompt_path = "video_prompts/" + id + "_negative_prompt.md";
    metadata.purpose = def.purpose;
    writeJson(metadataFile, metadata);
    const queueShot = queue.shots.find((shot) => shot.id === id);
    const deliveryShot = deliveryById.get(id);
    if (!queueShot || !deliveryShot) throw new Error("Missing queue or delivery record for " + id);
    patchRecord(queueShot, id, def, mdRel, jsonRel);
    patchRecord(deliveryShot, id, def, mdRel, jsonRel);
    queueShot.purpose = def.purpose;
    queueShot.beat = def.scene;
    deliveryShot.model_notes = Array.from(new Set([...(deliveryShot.model_notes || []), "Current frames are action-chain re-audit v2 candidates; still monitor_required until prompt QA and motion probe."]));
    const shotDir = path.join(epRoot, "storyboards", id);
    const v2Dir = path.join(shotDir, version);
    for (const role of ["start", "key", "end"]) {
      const source = path.join(v2Dir, role + "_frame.png");
      const topLevel = path.join(shotDir, role + "_frame.png");
      if (!fs.existsSync(source)) throw new Error("Missing " + source);
      fs.copyFileSync(source, topLevel);
    }
    fs.writeFileSync(path.join(shotDir, "frame_spec.md"), frameSpec(id, def));
    fs.writeFileSync(path.join(epRoot, "video_prompts", id + "_prompt.md"), def.prompt.trim() + "\n");
    fs.writeFileSync(path.join(epRoot, "video_prompts", id + "_negative_prompt.md"), "# " + id + " Negative Prompt\n\n" + def.negative.trim() + "\n");
  }
  queue.updated_at = "2026-08-21T00:00:00+08:00";
  delivery.updated_at = "2026-08-21T00:00:00+08:00";
  writeJson(queueFile, queue);
  writeJson(deliveryFile, delivery);
  console.log(JSON.stringify({ updated: Object.keys(shots), version }, null, 2));
}
main();

