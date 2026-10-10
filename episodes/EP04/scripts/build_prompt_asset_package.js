#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");

function ensureDir(rel) {
  fs.mkdirSync(path.join(root, rel), { recursive: true });
}

function write(rel, content) {
  const target = path.join(root, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
}

function writeJson(rel, value) {
  write(rel, JSON.stringify(value, null, 2) + "\n");
}

function S(id, order, duration, sourceSeconds, title, scene, location, characters, purpose, visual, camera, start, key, end, audio, previous, next, dialogue) {
  return {
    id,
    order,
    duration_seconds: duration,
    source_seconds: sourceSeconds,
    source_timecode: "00:" + String(Math.floor(sourceSeconds / 60)).padStart(2, "0") + ":" + String(sourceSeconds % 60).padStart(2, "0"),
    title,
    scene,
    location,
    characters,
    purpose,
    visual,
    camera,
    start,
    key,
    end,
    audio,
    previous,
    next,
    dialogue
  };
}

const styleRef = "source/reference_pack/style/live_action_style_reference.png";
const locationRefs = {
  dream: "source/reference_pack/locations/DreamSanctuary_reference.png",
  cathedral: "source/reference_pack/locations/CathedralInterior_reference.png",
  cloister: "source/reference_pack/locations/MonasteryMainCloister_reference.png",
  antechamber: "source/reference_pack/locations/MonasteryCathedralAntechamber_reference.png",
  tomb: "source/reference_pack/locations/SeirosTomb_reference.png",
  forest: "source/reference_pack/locations/MistForest_reference.png"
};
const characterRefs = {
  Byleth: ["source/reference_pack/characters/BylethFemale_face.png", "source/reference_pack/characters/BylethFemale_fullbody.png"],
  Dimitri: ["source/reference_pack/characters/Dimitri_face.png", "source/reference_pack/characters/Dimitri_fullbody.png"],
  Dedue: ["source/reference_pack/characters/Dedue_face.png", "source/reference_pack/characters/Dedue_fullbody.png"],
  Rhea: ["source/reference_pack/characters/Rhea_face.png"],
  Seteth: ["source/reference_pack/characters/Seteth_face.png"],
  Manuela: ["source/reference_pack/characters/Manuela_face.png"],
  Hanneman: ["source/reference_pack/characters/Hanneman_face.png"],
  DeathKnight: ["source/reference_pack/characters/DeathKnight_identity.png"],
  FlameEmperor: ["source/reference_pack/characters/FlameEmperor_identity.png"],
  Sothis: ["source/reference_pack/characters/Sothis_identity.png"]
};

const shots = [
  S("Shot001", 1, 9, 0, "门后的光", "序幕", "Dream Sanctuary / cathedral threshold", ["Byleth", "Sothis"], "Turn source ritual imagery into Byleth's private unease.", "Blackness gives way to pale sacred illustration, then to a real stone corridor and a narrow cold light under a closed door.", "Low, slow dolly forward; preserve negative space and natural stone texture.", "Byleth stands at the far end of the corridor, hand near but not touching the door.", "The light under the door cuts the frame; a faint green reflection catches Byleth's eye.", "Byleth stops before contact, leaving the door closed and the corridor readable.", "Low bell, cloth, distant wind; no speech.", "open from black", "bell resonance continues into Shot002", null),
  S("Shot002", 2, 10, 80, "钟声落地", "序幕", "Cathedral interior", ["Byleth"], "Move from chapter-scale ceremony to a physical call to action.", "A cathedral bell shadow crosses columns; Byleth turns as distant attendants cross the nave, all practical light and real depth.", "High angle down-tilt to a restrained medium profile; no title card or readable text.", "Bell shadow moves across empty stone before Byleth enters the lower third.", "Byleth looks toward the nave while the last bell vibration dies in the stone.", "The camera settles behind Byleth facing the briefing doors.", "Bell decay, footfalls, faint armor and air.", "receive the door-light and bell", "cut on the briefing doors opening", null),
  S("Shot003", 3, 12, 150, "Rhea 定义威胁", "召集", "Cathedral interior", ["Rhea", "Byleth", "Dimitri", "Dedue"], "Let Rhea define the rite as an institutional security problem.", "Rhea stands above the group on the cathedral steps; Byleth, Dimitri and Dedue stay below in separate depth layers.", "Centered low angle with a slow, almost imperceptible push; keep Rhea serene, not villainous.", "The group is quiet below Rhea; her hand rests over the crest at sternum height.", "Rhea lowers the hand and meets Byleth's eyeline without stepping down.", "Dimitri's eyes move toward the tomb direction after the line; Rhea remains still.", "Japanese line, one continuous utterance, candle room tone.", "receive Shot002 doors", "Seteth steps into the side plane in Shot004", { id: "DL-EP04-003", speaker: "Rhea", text: "女神再生の儀式、すでに狙われている。", speech_seconds: 3.0, listener_reaction: "Dimitri's attention hardens while Dedue checks the exits.", visible_action: "Rhea moves one hand from the crest to the stair rail.", cut_relation: "cut after the group receives the threat, before Seteth translates it into logistics.", post_dialogue_action: "Rhea holds the students in silence for one breath." }),
  S("Shot004", 4, 10, 180, "Seteth 把信仰翻译成封锁", "召集", "Cathedral side stair", ["Seteth", "Byleth", "Dimitri", "Dedue"], "Translate sacred language into guard positions and a clear boundary.", "Seteth enters the side plane and points toward the unseen tomb passage; the students do not form a lineup.", "Side-on medium with a short lateral track that keeps the tombward eyeline visible.", "Seteth takes one measured step from Rhea's shadow, leaving a clean space between faculty and students.", "His hand marks the direction; Dimitri turns his shoulders to the same axis.", "Byleth glances once toward the route, then back to Seteth; nobody moves early.", "Japanese line once, leather and small metal movement under the room tone.", "receive Rhea's held silence", "Byleth's hand checks the preparation strap in Shot005", { id: "DL-EP04-004", speaker: "Seteth", text: "今夜、聖墓の入口を離れるな。", speech_seconds: 2.5, listener_reaction: "Byleth accepts the boundary without nodding theatrically.", visible_action: "Seteth marks the tomb direction with one controlled gesture.", cut_relation: "cut on the students' shared turn toward preparation.", post_dialogue_action: "Dimitri shifts half a step behind Byleth, becoming a protective layer." }),
  S("Shot005", 5, 11, 210, "Dimitri 接住命令", "召集", "Cathedral lower floor", ["Dimitri", "Byleth", "Dedue"], "Make Dimitri's loyalty a protective spatial action, not a declaration of heroism.", "Dimitri turns from the tombward axis to Byleth; Dedue remains behind him, broad and quiet, leaving Byleth a clear exit.", "Static side two-shot with a shallow rack focus from Byleth to Dimitri.", "Dimitri's hands stay away from the weapon; Dedue scans the side aisle.", "Dimitri finishes the line and places himself half a pace toward the group, not in Byleth's space.", "Byleth answers only with a small eye movement toward the preparation room.", "Japanese line, restrained breath, cloth and distant bell.", "receive Seteth's tomb gesture", "hard cut to fastening straps", { id: "DL-EP04-005", speaker: "Dimitri", text: "先生、私たちはあなたの指示に従います。", speech_seconds: 3.0, listener_reaction: "Byleth registers the commitment but does not reward it with a smile.", visible_action: "Dimitri turns his torso to make a shield line behind Byleth.", cut_relation: "cut on the protective repositioning rather than on a heroic pose.", post_dialogue_action: "Dedue opens the path toward the preparation room." }),
  S("Shot006", 6, 9, 240, "Byleth 接管队伍", "准备", "Monastery antechamber", ["Byleth", "Dimitri", "Dedue"], "Give Byleth a short operational rule that will govern the tomb sequence.", "Hands fasten practical academy-era straps; Byleth looks up as the three bodies resolve from a loose group into one diagonal.", "Close inserts to a medium frontal three-quarter; keep feet and prop counts readable.", "A buckle closes; Dimitri's long weapon remains low; Dedue checks the left wall.", "Byleth's gaze moves along the three positions, then the group starts together.", "The frame ends with the corridor ahead, not a hero close-up.", "Japanese line, buckle click, controlled breathing.", "receive Shot005's body turn", "the same three-person axis enters Shot007", { id: "DL-EP04-006", speaker: "Byleth", text: "足音を数えろ。光を追うな。", speech_seconds: 2.5, listener_reaction: "Dimitri and Dedue lower their gaze to the floor and thresholds.", visible_action: "Byleth tightens one strap and signals the first walking mark.", cut_relation: "cut on the group beginning the same movement.", post_dialogue_action: "The three leave the preparation area in a single controlled pace." }),
  S("Shot007", 7, 11, 270, "圣墓门槛", "进入圣墓", "Seiros Tomb entrance", ["Byleth", "Dimitri", "Dedue"], "Replace a mission map with a real threshold and the first physical geography lock.", "Wet black stone, cyan practical flames and a heavy threshold; Byleth enters first, Dimitri right-rear, Dedue left-rear.", "Wide 16:9 dolly through the doorway, low enough to read feet and contact shadows.", "The party pauses outside the threshold, one hand-span of space between each body.", "Byleth crosses the threshold; the two escorts follow without overtaking.", "The camera lands on the next stone turn, establishing the north-side axis.", "Water drops, door hinge, cloth and metal; no speech.", "receive the preparation three-person axis", "Shot008 tracks the same path deeper", null),
  S("Shot008", 8, 10, 300, "队伍的视线交接", "进入圣墓", "Seiros Tomb outer corridor", ["Byleth", "Dimitri", "Dedue"], "Make the group readable as a team before the threat appears.", "The three move around a stone column in staggered depth; cyan flame marks left/deep, the path turns north.", "Restrained lateral tracking, no grid, no overhead tactical view.", "Byleth leads the turn; Dimitri watches the forward opening; Dedue watches the wall and rear.", "All three settle into a slow listening stop without forming a lineup.", "A dark seam in the wall stays visible beside Dedue for the discovery in Shot009.", "Echoing footsteps, breath, faint water.", "receive Shot007 tomb axis", "Dedue's hand reaches the wall in Shot009", null),
  S("Shot009", 9, 8, 330, "墙上的擦痕", "进入圣墓", "Seiros Tomb outer corridor", ["Dedue", "Byleth", "Dimitri"], "Give Dedue the first evidence that the intrusion came through an internal route.", "Dedue touches a clean scrape through wet dust on the left wall; Byleth and Dimitri remain soft but spatially present.", "Close on fingers, then a controlled rise to Dedue's profile with the corridor behind him.", "Dedue's palm stops just before the mark; no magic scanner or game effect.", "He withdraws his hand and looks toward Byleth, who is already facing the deeper turn.", "The party remains on the same marks; the next door is still closed.", "Japanese line, fingertip on grit, one low breath.", "receive Shot008's listening stop", "Byleth freezes the line in Shot010", { id: "DL-EP04-009", speaker: "Dedue", text: "左の壁に、外から触れた跡があります。", speech_seconds: 3.0, listener_reaction: "Dimitri turns his head toward the wall without stepping into Dedue's mark.", visible_action: "Dedue reveals the scraped dust and then points only with his eyes.", cut_relation: "cut on Byleth receiving the warning, not on the hand detail.", post_dialogue_action: "Byleth raises one flat hand to stop the group." }),
  S("Shot010", 10, 10, 360, "不散列", "进入圣墓", "Seiros Tomb inner door", ["Byleth", "Dimitri", "Dedue"], "Change the rhythm from exploration to disciplined containment.", "Byleth holds the center of a diagonal line before a dark inner door; Dimitri and Dedue stop at different depths.", "Medium-wide on the north-side axis, slow push until the door fills the negative space.", "Byleth's raised hand stops movement; the three sets of feet remain visible.", "The group compresses by one careful half-step but does not collapse into the doorway.", "The blue flame flickers behind them as the dark door opens a sliver.", "Japanese line once, stone resonance, held breath.", "receive Dedue's warning handoff", "the wrong metallic footfall enters Shot011", { id: "DL-EP04-010", speaker: "Byleth", text: "ここから先は、列を崩さない。", speech_seconds: 2.5, listener_reaction: "Dimitri lowers his weapon line and Dedue angles his shield toward the opening.", visible_action: "Byleth raises one hand and sets three separate stopping marks.", cut_relation: "cut just as the unowned footfall begins, preserving the suspense.", post_dialogue_action: "Nobody crosses the inner door before the sound arrives." }),
  S("Shot011", 11, 9, 390, "先听见死神骑士", "死神骑士", "Seiros Tomb archway", ["Byleth", "Dimitri", "Dedue", "DeathKnight"], "Let the Death Knight enter as an acoustic and spatial violation before he becomes a face or armor read.", "An empty archway holds cyan haze; a black-purple armored shape resolves at the far end, scythe low and feet grounded.", "Start on the empty arch, rack focus to the silhouette, then a slight handheld correction.", "The party stays in the foreground depth while a single heavy footfall arrives from the arch.", "The Death Knight takes one step into the light; the scythe remains below shoulder height.", "Dimitri's eyes identify him before the camera moves closer.", "Japanese line, one footfall, metal resonance.", "receive Shot010's held door", "Death Knight's direct line in Shot012", { id: "DL-EP04-011", speaker: "Dimitri", text: "あれは……死神騎士。", speech_seconds: 1.8, listener_reaction: "Byleth turns the sword angle toward the arch while Dedue anchors the rear.", visible_action: "The Death Knight enters one step and stops in a pool of practical light.", cut_relation: "cut on recognition before the threat advances.", post_dialogue_action: "The Death Knight tilts the helmet a fraction toward Byleth." }),
  S("Shot012", 12, 10, 420, "威胁保持礼貌", "死神骑士", "Seiros Tomb archway", ["DeathKnight", "Byleth", "Dimitri", "Dedue"], "Keep the Death Knight frightening without turning him into a poster or exposition machine.", "The helmet remains unreadable; the scythe shifts across the open lane while the party is protected by the stone column.", "Low side medium, one controlled move with the weapon; no spinning, no magical halo.", "Death Knight stands beyond a visible stone buffer; Byleth's line is nearer camera, Dimitri and Dedue behind.", "The scythe head enters the light but stops short of the party's mark.", "After the line, nobody advances; the silence belongs to the tomb.", "Japanese line once, scythe shaft, damp armor, low room tone.", "receive Dimitri's recognition", "weapon contact/near-miss chain in Shot013", { id: "DL-EP04-012", speaker: "DeathKnight", text: "退け。儀式の夜は、まだ終わらぬ。", speech_seconds: 3.0, listener_reaction: "Byleth keeps the face unreadable and shifts one foot to the safe side of the column.", visible_action: "The Death Knight lowers the scythe into a threatening horizontal line without charging.", cut_relation: "cut on the final syllable into the first physical attack beat.", post_dialogue_action: "Byleth turns the sword to meet the incoming line." }),
  S("Shot013", 13, 10, 450, "改线", "死神骑士", "Seiros Tomb central crypt corridor", ["Byleth", "DeathKnight", "Dimitri", "Dedue"], "Deliver one auditable weapon contact with a clear attacker, defender, result and recovery.", "Death Knight makes one right-to-left horizontal scythe attack; Byleth steps off line and catches the shaft with the sword, redirecting it toward a pillar.", "North-side axis, medium-wide enough for feet and distance, then a short follow through the contact.", "Death Knight starts about 4.5 metres away; Byleth is at the south-side threshold with the stone pillar to her right.", "The weapon contact happens at shoulder height; the scythe line turns toward stone, never through a body.", "Byleth and the two escorts recover behind the column; Death Knight resets with the scythe low.", "Metal impact, stone chip, breath; no gore, no damage number.", "receive Shot012's weapon line", "Shot014 receives the retreat state", null),
  S("Shot014", 14, 9, 480, "等下一次落点", "死神骑士", "Seiros Tomb central crypt corridor", ["Byleth", "Dimitri", "Dedue", "DeathKnight"], "Show the tactical decision to withdraw rather than escalate.", "Byleth points the sword toward the safe exit while Dimitri pulls back one pace and Dedue opens the wall-side route; Death Knight remains beyond the buffer.", "Side tracking backward with the party; keep the arch and feet visible.", "Byleth backs without turning; Dimitri matches her pace; Dedue checks the last stone step.", "The party crosses the safe threshold while Death Knight remains in the blue-black depth.", "Byleth holds the exit line for one beat, then lowers the sword slightly.", "Japanese line, retreating boots, cloth, low scythe scrape.", "receive Shot013 recovery", "Shot015 crosses the tomb threshold", { id: "DL-EP04-014", speaker: "Byleth", text: "退け。次の一撃を待つ。", speech_seconds: 2.3, listener_reaction: "Dimitri obeys immediately; Dedue keeps his body between the rear and the open passage.", visible_action: "Byleth walks backward while keeping the sword line pointed at the safe gap.", cut_relation: "cut on the group clearing the threshold, not on a chase.", post_dialogue_action: "The Death Knight does not pursue into the practical light." }),
  S("Shot015", 15, 8, 510, "湿石上的余波", "撤离", "Seiros Tomb exit", ["Byleth", "Dimitri", "Dedue"], "Let the physical cost of the encounter land before the church reframes it.", "The three cross the threshold; water drops from cloaks, and the tomb fire continues moving behind the closed door.", "Low wide close to the floor, then a gentle rise to the backs of the three performers.", "A boot lands on wet stone; Dimitri's weapon remains low and Dedue checks the latch.", "The door closes without a slam, leaving a line of cyan light under it.", "The party stays silent; the bell from the monastery is barely audible.", "Door latch, wet cloth, breath; no speech.", "receive Shot014 safe exit", "hard cut to Rhea's dry report table", null),
  S("Shot016", 16, 12, 570, "先报告事实", "善后", "Cathedral interior", ["Rhea", "Byleth", "Dimitri", "Dedue"], "Return to symmetry, but make the symmetry feel administrative rather than safe.", "Byleth reports from the lower floor; Rhea remains on the same step line as before, dry hands above a wet report sheet.", "Centered, calm medium-wide echoing Shot003; no moralizing close-up.", "Rhea receives the sheet without touching Byleth's wet sleeve; Dimitri and Dedue stand behind the report line.", "Rhea places the sheet on the stone rail and keeps her eyes on the facts.", "The group waits for a conclusion that Rhea refuses to provide.", "Japanese line, paper, candle and distant corridor.", "receive Shot015's wet stone", "Manuela enters from the side in Shot017", { id: "DL-EP04-016", speaker: "Rhea", text: "まず、事実だけを報告しなさい。", speech_seconds: 2.8, listener_reaction: "Byleth pauses before naming intent; Dimitri looks down at the wet edge of the sheet.", visible_action: "Rhea sets the report flat and removes one subjective mark with her finger.", cut_relation: "cut to Manuela's observation as the institution opens a second lane.", post_dialogue_action: "Byleth's gaze returns to the unseen tomb door." }),
  S("Shot017", 17, 10, 600, "知道内部道路", "善后", "Cathedral antechamber", ["Manuela", "Rhea", "Byleth"], "Make the faculty report reveal knowledge of the internal route.", "Manuela holds a damp record at the edge of the group; the cathedral background falls soft, and Rhea's profile stays in the far plane.", "Medium close with a slow move from Manuela's fingers to Rhea's listening face.", "Manuela's thumb covers the wet corner, not the content; Byleth is a quiet witness behind her.", "Manuela finishes without stepping closer to Rhea; the room's hierarchy remains visible.", "Rhea's eyes move briefly toward the tombward corridor.", "Japanese line once, paper, small breath, no music swell.", "receive Rhea's fact rule", "Hanneman presses the inference in Shot018", { id: "DL-EP04-017", speaker: "Manuela", text: "侵入者は、儀式の中心を知っていたわ。", speech_seconds: 2.8, listener_reaction: "Byleth looks from the damp route note to the closed door.", visible_action: "Manuela traces the internal path with one finger and stops at the central mark.", cut_relation: "cut when the finger stops, before anyone explains the implication.", post_dialogue_action: "Hanneman enters the edge of frame carrying an unopened book." }),
  S("Shot018", 18, 11, 630, "不是偶然", "善后", "Cathedral book table", ["Hanneman", "Manuela", "Rhea"], "Let Hanneman convert evidence into a dangerous inference without overexplaining.", "Hanneman presses the damp route paper beneath an unopened book; a candle remains unlit beside his hand.", "Measured top-side angle into a thoughtful three-quarter medium; practical lens breathing only.", "The paper's route and the untouched candle share the frame; Manuela stays across the table.", "Hanneman lifts one finger from the route and looks toward the dark hall.", "Rhea does not answer; the silence becomes the final beat.", "Japanese line once, paper friction, faint candle wick.", "receive Shot017's route trace", "student reaction in Shot019", { id: "DL-EP04-018", speaker: "Hanneman", text: "偶然ではない。誰かが道を開けた。", speech_seconds: 2.8, listener_reaction: "Manuela's hand stops; Rhea's expression remains calm but her eyes leave the paper.", visible_action: "Hanneman pins the route paper under the book without opening it.", cut_relation: "cut on the unlit candle, leaving the implication unresolved.", post_dialogue_action: "The camera holds the unused book as a physical secret." }),
  S("Shot019", 19, 9, 690, "学生看见代价", "善后", "Cathedral rear aisle", ["Byleth", "Dimitri", "Dedue"], "Show three different responses to institutional silence without explanatory dialogue.", "Dimitri looks toward the sealed tomb corridor; Dedue checks the rear exit; Byleth stands between both directions with sword lowered.", "Slow lateral move across three depth layers, no trio lineup.", "Dimitri's shoulder is nearest, Dedue recedes, Byleth remains the visual hinge.", "The sound of a door closing crosses the frame; nobody reacts theatrically.", "Byleth is the last to look away from the tomb direction.", "No speech; door, cloth, distant bell.", "receive Shot018's unlit candle", "Rhea reclaims the stair in Shot020", null),
  S("Shot020", 20, 12, 720, "秘密作为保护", "善后", "Cathedral stair", ["Rhea", "Byleth", "Dimitri", "Dedue"], "Let Rhea close the discussion under the language of protection.", "Rhea turns on the stair; the students remain below in colder shadow, keeping a visible vertical distance.", "Centered medium-wide with a small upward tilt that never becomes a villain angle.", "Rhea's body occupies the upper third; Byleth's group remains separated by two stone steps.", "Rhea completes the line and turns toward the inner sanctuary, not toward the camera.", "The students do not follow until the cut.", "Japanese line, robe movement, cathedral air.", "receive Shot019's door close", "Shot021 descends to the three walking together", { id: "DL-EP04-020", speaker: "Rhea", text: "信仰を守るため、秘密は必要です。", speech_seconds: 2.8, listener_reaction: "Dimitri watches Rhea leave; Dedue looks to Byleth for the next safe movement.", visible_action: "Rhea keeps one hand on the stair rail and turns away after the line.", cut_relation: "cut on the institutional retreat, before the students choose whether to follow.", post_dialogue_action: "Byleth turns the group toward the corridor without looking back." }),
  S("Shot021", 21, 10, 780, "走廊里的同行", "夜谈前", "Monastery cloister", ["Byleth", "Dimitri", "Dedue"], "Shrink the institution into the physical distance between companions.", "The three walk through a damp cloister; banners soften behind them, and no one occupies the center as a hero.", "Long lens lateral follow, shallow depth but enough floor to preserve direction.", "Byleth leads by half a pace, Dimitri right-rear, Dedue left-rear; the order matches the tomb.", "The group passes a dark arch and slows under a single practical lamp.", "Dimitri's hand leaves the weapon grip, preparing the confession in Shot022.", "Footfalls, banner, low night wind; no speech.", "receive Rhea's retreat", "Dimitri stops in the lamp pool", null),
  S("Shot022", 22, 11, 810, "没有人安心", "夜谈", "Monastery cloister at night", ["Dimitri", "Byleth"], "Give Dimitri a private admission that the encounter changed the meaning of victory.", "Dimitri and Byleth stand in profile with the cloister columns between them; the tomb direction stays visible beyond.", "Static two-shot with a slight rack focus to Byleth's listening face.", "Dimitri stops, leaves a respectful arm's length, and does not touch the weapon.", "After speaking, he looks down toward the wet floor; Byleth keeps the tomb axis in peripheral view.", "Byleth does not answer; the absence of an answer is the handoff to the forest cut.", "Japanese line, night insects, wet stone.", "receive Shot021's slowed walk", "unresolved metal resonance carries into Shot023", { id: "DL-EP04-022", speaker: "Dimitri", text: "私たちは勝ったのに、誰も安心していない。", speech_seconds: 3.1, listener_reaction: "Byleth listens without turning the admission into reassurance.", visible_action: "Dimitri releases the weapon grip and lowers his eyes to the wet floor.", cut_relation: "cut on the unresolved pause into a different red-lit space.", post_dialogue_action: "A distant metal resonance answers from outside the cloister." }),
  S("Shot023", 23, 9, 840, "红色从树后出现", "雾林", "Mist forest", ["FlameEmperor"], "Change color and social rules without explaining how the conspirators got there.", "Green-black fog between wet trunks; a controlled rust-red reflection appears on armor before the figure is fully readable.", "Slow orbit around a tree, revealing a red edge and a second depth plane.", "The camera never presents a full poster silhouette; a practical fire source stays off-frame.", "Flame Emperor is still, helmeted, and separated from the other presence by several paces.", "The red reflection travels across wet bark as the unresolved metal tone dies.", "No speech; wet branch, metal, low fire.", "receive Shot022's metal resonance", "Shot024 reveals the two-plane exchange", null),
  S("Shot024", 24, 12, 870, "两层树干之间", "雾林", "Mist forest", ["FlameEmperor", "DeathKnight"], "Stage the antagonist exchange as a strategic distance, not an intimate villain tableau.", "Flame Emperor occupies the near left shadow; another fully armored/masked presence stands farther right through tree haze; red firelight is practical.", "Wide two-plane composition with a restrained side drift; preserve the empty ground between them.", "Neither performer crosses the central wet ground; both remain helmeted and physically grounded.", "Flame Emperor turns the helmet slightly toward the deeper presence without approaching.", "The space remains deliberately under-filled; the next line comes from the near plane.", "Armor creak, low fire, distant rain; no speech.", "receive Shot023 red reflection", "Flame Emperor's question in Shot025", null),
  S("Shot025", 25, 10, 900, "仪式属于谁", "雾林", "Mist forest", ["FlameEmperor", "DeathKnight"], "Make Flame Emperor ask about ownership of the rite while keeping the plan opaque.", "Flame Emperor takes only half a step into side light; the visor remains unreadable and the distant armored presence does not answer.", "Medium profile, eye-line level, no low-angle glamour or glowing eyes.", "The open space between helmets remains visible; the firelight grazes practical metal and wet cloth.", "Flame Emperor finishes the line and stops, leaving the question suspended over the empty ground.", "The distant presence turns its head toward the trees, implying movement elsewhere.", "Japanese line once, controlled fire and rain.", "receive Shot024 two-plane geometry", "the mission report becomes the next line in Shot026", { id: "DL-EP04-025", speaker: "Flame Emperor", text: "女神の儀式を、教会だけのものにするな。", speech_seconds: 3.0, listener_reaction: "The distant armored presence does not answer; its helmet turns toward the forest edge.", visible_action: "Flame Emperor takes one half-step into the practical red side light.", cut_relation: "cut on the listener's turn rather than explaining the claim.", post_dialogue_action: "Flame Emperor keeps the question open and the center space empty." }),
  S("Shot026", 26, 11, 930, "使命尚未结束", "雾林", "Mist forest side slope", ["FlameEmperor", "DeathKnight"], "Connect the Death Knight to the conspiracy without a plot dump.", "The distant helmet turns toward the unseen tomb direction; Flame Emperor stays in foreground shadow, red edge light fixed.", "Compressed medium-long lens; keep both bodies and the slope's depth legible.", "The armored presence takes one slow step up the slope; Flame Emperor remains behind the tree line.", "Flame Emperor speaks without moving closer; the line lands over the other figure's back.", "The step stops at the top of the slope, leaving identity and allegiance unresolved.", "Japanese line once, boot in wet ground, armor, wind.", "receive Shot025's listener turn", "cut back to the empty monastery corridor in Shot027", { id: "DL-EP04-026", speaker: "FlameEmperor", text: "死神騎士は、まだ使命を終えていない。", speech_seconds: 3.0, listener_reaction: "The armored presence pauses on the slope and does not reveal a face.", visible_action: "Flame Emperor remains behind the tree while the other figure takes one measured step.", cut_relation: "cut on the step stopping, withholding the identity reveal.", post_dialogue_action: "The forest sound continues for one beat after the figures stop." }),
  S("Shot027", 27, 12, 990, "问题回到长廊", "索蒂丝尾声", "Cathedral corridor", ["Byleth", "Sothis"], "Return the conspiracy question to Byleth's private perception.", "Byleth walks alone through the cathedral corridor; a faint green reflection gathers near a column instead of becoming a game-like apparition.", "Long corridor telephoto, camera fixed while Byleth approaches from the far end.", "Byleth moves past the first column and stops before the dark tombward door.", "Sothis's presence appears as a brief human-readable reflection in the negative space, not a glowing cutout.", "Byleth's face remains in profile; the dark door is still larger than either figure.", "Japanese line once, soft room tone, no music explanation.", "receive Shot026's forest wind", "Shot028 holds the unanswered stop", { id: "DL-EP04-027", speaker: "Sothis", text: "教会は、何を隠している？", speech_seconds: 2.5, listener_reaction: "Byleth looks at the sealed door rather than at Sothis.", visible_action: "Sothis gathers as a brief reflection along the column and then loses definition.", cut_relation: "cut on the question hanging over Byleth's stopped body.", post_dialogue_action: "Byleth does not answer and keeps one hand away from the door." }),
  S("Shot028", 28, 10, 1080, "黑门不回答", "索蒂丝尾声", "Cathedral tombward corridor", ["Byleth", "Sothis"], "End on withheld trust rather than a victory statement.", "Green-white particles briefly gather near Byleth, then dissolve into the shadow of the closed door; the performer stays fully physical.", "Very slow push from behind Byleth; finish before the door fills the frame.", "Byleth remains still, hand lowered, while the last practical candle gutters.", "The light falls away without a title, subtitle, or supernatural flash.", "Byleth's silhouette and the black door share the frame; cut to black on the interrupted bell.", "No speech; bell is cut before its final decay.", "receive Shot027's unanswered question", "cut to black", null)
];

function sourceFrame(seconds) {
  let n = Math.round(seconds / 30) * 30;
  n = Math.max(0, Math.min(1140, n));
  return "source_refs/game_frame_" + String(n).padStart(4, "0") + "s.jpg";
}

function locationRef(location) {
  if (location.indexOf("Dream") >= 0) return locationRefs.dream;
  if (location.indexOf("Cathedral") >= 0) return locationRefs.cathedral;
  if (location.indexOf("cloister") >= 0 || location.indexOf("Monastery") >= 0) return locationRefs.cloister;
  if (location.indexOf("antechamber") >= 0) return locationRefs.antechamber;
  if (location.indexOf("Forest") >= 0 || location.indexOf("forest") >= 0) return locationRefs.forest;
  return locationRefs.tomb;
}

function refsFor(shot) {
  const refs = [styleRef, locationRef(shot.location)];
  for (const character of shot.characters) {
    const candidates = characterRefs[character];
    if (candidates) {
      for (const candidate of candidates) if (!refs.includes(candidate)) refs.push(candidate);
    }
  }
  return refs;
}

function buildDialogueLine(shot, sceneStart) {
  if (!shot.dialogue) return null;
  const d = shot.dialogue;
  const localEnd = Number((shot.duration_seconds - 0.45).toFixed(2));
  const speechEnd = Number((localEnd - 0.30).toFixed(2));
  const localStart = Number((speechEnd - d.speech_seconds).toFixed(2));
  return {
    id: d.id,
    shot_id: shot.id,
    speaker: d.speaker,
    text: d.text,
    translation_zh: "",
    start_seconds: Number((sceneStart + localStart).toFixed(2)),
    end_seconds: Number((sceneStart + localEnd).toFixed(2)),
    scene_start_seconds: 0,
    scene_end_seconds: runtimeSeconds,
    shot_local_start_seconds: localStart,
    shot_local_speech_end_seconds: speechEnd,
    shot_local_end_seconds: localEnd,
    speech_seconds: d.speech_seconds,
    pause_before_seconds: 0,
    pause_after_seconds: 0.05,
    listener_reaction_seconds: 0.25,
    listener_reaction: d.listener_reaction,
    visible_action: d.visible_action,
    cut_relation: d.cut_relation,
    post_dialogue_action: d.post_dialogue_action,
    delivery_mode: "single_continuous_utterance",
    audio_source: "native_japanese_probe_pending",
    repeat_policy: "no_repeat",
    allow_overlap: false,
    cut_on: "reaction",
    timing_status: "planned_probe_pending"
  };
}

const runtimeSeconds = shots.reduce((sum, shot) => sum + shot.duration_seconds, 0);
const shotStarts = new Map();
let cursor = 0;
for (const shot of shots) {
  shot.scene_start_seconds = cursor;
  shot.scene_end_seconds = cursor + shot.duration_seconds;
  shot.source_reference = sourceFrame(shot.source_seconds);
  shot.asset_references = refsFor(shot);
  shot.frame_paths = {
    start: "storyboards/" + shot.id + "/frames_pending/start_frame.png",
    key: "storyboards/" + shot.id + "/frames_pending/key_frame.png",
    end: "storyboards/" + shot.id + "/frames_pending/end_frame.png"
  };
  shot.dialogue_line = buildDialogueLine(shot, cursor);
  shotStarts.set(shot.id, cursor);
  cursor += shot.duration_seconds;
}

const lines = shots.filter((shot) => shot.dialogue_line).map((shot) => shot.dialogue_line);

const referenceFiles = [
  ["source/reference_pack/style/live_action_style_reference.png", "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png", "dedicated_live_action_style_reference"],
  ["source/reference_pack/locations/SeirosTomb_reference.png", "assets/locations/EP04/act01/SeirosTomb/SeirosTomb_reference.png", "holy_tomb_location_reference"],
  ["source/reference_pack/locations/CathedralInterior_reference.png", "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png", "cathedral_location_reference"],
  ["source/reference_pack/locations/MonasteryMainCloister_reference.png", "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png", "cloister_location_reference"],
  ["source/reference_pack/locations/MonasteryCathedralAntechamber_reference.png", "assets/locations/EP02/act01/MonasteryCathedralAntechamber/MonasteryCathedralAntechamber_reference.png", "cathedral_antechamber_location_reference"],
  ["source/reference_pack/locations/MistForest_reference.png", "assets/locations/EP10/act01/SealedForest/SealedForest_reference.png", "forest_location_reference"],
  ["source/reference_pack/locations/DreamSanctuary_reference.png", "assets/locations/EP01/dream/DreamSanctuary/DreamSanctuary_reference.png", "dream_palette_reference"],
  ["source/reference_pack/characters/BylethFemale_face.png", "assets/characters/protagonist/BylethFemale/professor/selected.png", "face_card"],
  ["source/reference_pack/characters/BylethFemale_fullbody.png", "assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png", "full_body_costume_card"],
  ["source/reference_pack/characters/Dimitri_face.png", "assets/characters/blue_lions/Dimitri/academy/selected.png", "face_card"],
  ["source/reference_pack/characters/Dimitri_fullbody.png", "assets/characters/blue_lions/Dimitri/weapon_fullbody/selected.png", "full_body_costume_card"],
  ["source/reference_pack/characters/Dedue_face.png", "assets/characters/blue_lions/Dedue/academy/selected.png", "face_card"],
  ["source/reference_pack/characters/Dedue_fullbody.png", "assets/characters/blue_lions/Dedue/weapon_fullbody/selected.png", "full_body_costume_card"],
  ["source/reference_pack/characters/Rhea_face.png", "assets/characters/church_of_seiros/Rhea/academy/selected.png", "faculty_identity_card"],
  ["source/reference_pack/characters/Seteth_face.png", "assets/characters/church_of_seiros/Seteth/academy/selected.png", "faculty_identity_card"],
  ["source/reference_pack/characters/Manuela_face.png", "assets/characters/church_of_seiros/Manuela/academy/selected.png", "faculty_identity_card"],
  ["source/reference_pack/characters/Hanneman_face.png", "assets/characters/church_of_seiros/Hanneman/academy/selected.png", "faculty_identity_card"],
  ["source/reference_pack/characters/DeathKnight_identity.png", "assets/characters/antagonists/DeathKnight/selected.png", "helmeted_identity_card"],
  ["source/reference_pack/characters/FlameEmperor_identity.png", "assets/characters/antagonists/FlameEmperor/selected.png", "helmeted_identity_card"],
  ["source/reference_pack/characters/Sothis_identity.png", "assets/characters/divine/Sothis/dream/legacy_ep01/candidate_03.png", "dream_identity_card"]
];

const referenceManifestFiles = referenceFiles.map(([localPath, origin, role]) => {
  const file = path.join(root, localPath);
  const sha256 = fs.existsSync(file) ? crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") : null;
  return {
    path: localPath,
    source: origin,
    role,
    sha256,
    status: "local_reference_only",
    runtime_use: "operator builds uploaded frame anchors; not a runtime path"
  };
});

writeJson("source/reference_pack/reference_manifest.json", {
  version: 1,
  reference_pack_id: "EP04-local-reference-pack-v1",
  project: "FireEmblem3H-LiveAction",
  episode: "EP04",
  provenance_policy: "Copied into the EP04 boundary from existing workspace assets; hashes freeze the exact local copies.",
  source_screenshot_policy: "source_refs/game_frame_*.jpg and generated/*planning_only.jpg are planning_only and never final frames.",
  files: referenceManifestFiles
});

function rejectCommon(extra) {
  return [
    "game screenshot, game UI, tactical grid, dialogue box, damage numbers",
    "anime, illustration, 3D render, poster, collage, lineup, pasted portrait",
    "subtitle, caption, readable text, watermark, logo, border, letterbox, pillarbox",
    "child-coded or teenage performer, war-phase aging, elderly drift, sexualization",
    "costume drift, face drift, weapon duplication, floating feet, missing contact shadows",
    "axis flip, mirror, teleport, pose-only START/KEY/END, lighting-only transition",
    "Chinese or Mandarin voiceover, repeated dialogue, echo, stutter, restart",
    extra || ""
  ].join(", ");
}

function promptFor(shot) {
  const linesOut = [
    "# " + shot.id + " Video Prompt",
    "",
    "## Upload-only contract",
    "Upload exactly three integrated live-action images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, adult-safe age, wardrobe, props, practical light, camera axis, distance, and action state. Do not use screenshots, local paths, or external references at runtime.",
    "",
    "## Shot and visual baseline",
    shot.id + ", " + shot.duration_seconds + " seconds, 16:9. Photographed adult human performers on a physical fantasy set, practical stone/metal/cloth, natural skin texture, restrained cinematic depth of field, physically plausible weight and contact shadows. Academy-era characters are portrayed by adult performers perceived as 21–28; faculty remain adult faculty. No game or anime visual language.",
    "",
    "## START",
    shot.start,
    "",
    "## KEY",
    shot.key,
    "",
    "## END",
    shot.end,
    "",
    "## Motion",
    "Animate one readable causal beat from START through KEY to END. Preserve the stated actor count, prop count, screen direction, distance, and physical handoff. Use real foot pressure, cloth inertia, practical light response, and motivated camera movement. Do not turn a state change into a pose loop.",
    "",
    "## Camera and performance",
    shot.camera,
    "Performers stay emotionally contained and physically grounded. Keep the scene's negative space and the next-shot handoff readable. No mirror, axis reversal, spin, glamour close-up, or lighting-only transition.",
    "",
    "## Dialogue Timing / Delivery"
  ];
  if (shot.dialogue_line) {
    const d = shot.dialogue_line;
    linesOut.push(
      "Line ID " + d.id + ". Japanese spoken dialogue exactly once: " + d.text,
      "Speech window: " + d.shot_local_start_seconds.toFixed(2) + "-" + d.shot_local_speech_end_seconds.toFixed(2) + " seconds within this shot; line beat ends at " + d.shot_local_end_seconds.toFixed(2) + " seconds.",
      "Use one single continuous utterance. The final syllable must end by " + d.shot_local_speech_end_seconds.toFixed(2) + " seconds; hold only the described reaction before the cut.",
      "Do not repeat, echo, stutter, restart, paraphrase, translate, or add another spoken line. No Chinese/Mandarin voiceover, subtitles, captions, or dialogue boxes."
    );
  } else {
    linesOut.push(
      "No spoken dialogue in this shot. Use production sound only and preserve the stated silent reaction.",
      "Do not add voiceover, subtitles, captions, dialogue boxes, or readable text."
    );
  }
  linesOut.push(
    "",
    "## Audio",
    shot.audio,
    "Native Japanese is a downstream probe requirement when a line is declared; do not treat unprobed model audio as approved final delivery.",
    "",
    "## Continuity",
    "Receive: " + shot.previous + ".",
    "Hand off: " + shot.next + ".",
    "",
    "## Reject if",
    rejectCommon("the stated action, geography, identity, or dialogue timing is not readable")
  );
  return linesOut.join("\n") + "\n";
}

function frameSpecFor(shot) {
  const dialogueText = shot.dialogue_line
    ? "Japanese line " + shot.dialogue_line.id + " is timed in the authoritative dialogue timeline; exact text is present once in the executable prompt."
    : "No spoken line; the beat is carried by production sound and reaction.";
  return [
    "# " + shot.id + " Frame Spec",
    "",
    "Stage: storyboard / prompt_asset_package",
    "Status: frames_pending",
    "Script Beat: " + shot.title,
    "Shot Purpose: " + shot.purpose,
    "Duration Target: " + shot.duration_seconds + "s",
    "Source Timecode: " + shot.source_timecode,
    "Source Reference: " + shot.source_reference + " (planning_only)",
    "Location: " + shot.location,
    "Characters Visible: " + shot.characters.join(", "),
    "",
    "## Identity and reference locks",
    ...shot.asset_references.map((ref) => "- " + ref),
    "- Dedicated style reference: " + styleRef,
    "- All local refs are operator-side reference material. The executable prompt is upload-only.",
    "- Named academy characters are adult-safe performers portraying academy-era wardrobe; no war-phase aging or child-coded casting.",
    "",
    "## Presence and geography",
    "- " + shot.visual,
    "- " + shot.camera,
    "- Keep the stated actor count and every prop count exact; preserve real feet, contact shadows, and the north-side axis where the scene is in the tomb.",
    "",
    "## Action chain",
    "- START: " + shot.start,
    "- KEY: " + shot.key,
    "- END: " + shot.end,
    "- " + dialogueText,
    "",
    "## Audio and continuity",
    "- Audio: " + shot.audio,
    "- Receive: " + shot.previous,
    "- Hand off: " + shot.next,
    "",
    "## Reject gate",
    "- " + rejectCommon("the START/KEY/END states collapse into one pose or the source screenshot is treated as final live action"),
    "",
    "## Planned frame paths",
    "- start_frame.png: " + shot.frame_paths.start,
    "- key_frame.png: " + shot.frame_paths.key,
    "- end_frame.png: " + shot.frame_paths.end,
    "- Current visual review: pending actual integrated live-action frames and independent review."
  ].join("\n") + "\n";
}

function negativePromptFor(shot) {
  return [
    "# " + shot.id + " Negative Prompt",
    "",
    "No " + rejectCommon("unmotivated camera movement, frozen mouth, unexplained hold, or unreviewed extra"),
    "No game screenshot texture, UI frame, map grid, dialogue box, damage number, watermark, logo, border, subtitle, caption, readable text, or poster composition.",
    "No repeated dialogue, echo, stutter, restart, Chinese voiceover, Mandarin dialogue, or added speech.",
    "No child, teenager-coded academy student, war-phase adult drift, elderly drift, sexualized framing, gore, blood spray, or celebratory kill.",
    "No face drift, costume drift, weapon duplication, wrong screen side, axis flip, mirror, teleport, floating feet, missing contact shadow, or pose-only START/KEY/END."
  ].join("\n") + "\n";
}

const deliveryShots = [];
for (const shot of shots) {
  const metadataPath = "storyboards/" + shot.id + "/metadata.json";
  const promptPath = "video_prompts/" + shot.id + "_prompt.md";
  const negativePath = "video_prompts/" + shot.id + "_negative_prompt.md";
  const frameSpecPath = "storyboards/" + shot.id + "/frame_spec.md";
  const auditPath = "planning/source_audit/" + shot.id + ".md";
  const dialogueIds = shot.dialogue_line ? [shot.dialogue_line.id] : [];
  const metadata = {
    id: shot.id,
    order: shot.order,
    status: "frames_pending",
    duration_seconds: shot.duration_seconds,
    scene: shot.scene,
    title: shot.title,
    purpose: shot.purpose,
    source_timecode: shot.source_timecode,
    source_reference: shot.source_reference,
    source_reference_status: "planning_only",
    location: shot.location,
    characters: shot.characters,
    asset_references: shot.asset_references,
    planned_frames: shot.frame_paths,
    prompt_path: promptPath,
    negative_prompt_path: negativePath,
    frame_spec_path: frameSpecPath,
    source_audit_path: auditPath,
    dialogue_line_ids: dialogueIds,
    dialogue_mode: shot.dialogue_line ? "single_turn" : "silent",
    audio_source: shot.dialogue_line ? "native_japanese_probe_pending" : "production_sound_only",
    max_silence_seconds: 0.25,
    audio_probe: { status: "pending", reason: "No downstream native-audio probe in prompt package stage." },
    motion_probe: { status: "pending", reason: "No actual START/KEY/END frames or clip yet." },
    continuity_previous: shot.previous,
    continuity_next: shot.next,
    reject_if: rejectCommon("source/game screenshots are planning-only"),
    dialogue_timing: shot.dialogue_line ? {
      line_id: shot.dialogue_line.id,
      speaker: shot.dialogue_line.speaker,
      text: shot.dialogue_line.text,
      local_start_seconds: shot.dialogue_line.shot_local_start_seconds,
      local_speech_end_seconds: shot.dialogue_line.shot_local_speech_end_seconds,
      local_end_seconds: shot.dialogue_line.shot_local_end_seconds,
      speech_seconds: shot.dialogue_line.speech_seconds,
      cut_on: shot.dialogue_line.cut_on,
      repeat_policy: shot.dialogue_line.repeat_policy
    } : null
  };
  write(frameSpecPath, frameSpecFor(shot));
  write(promptPath, promptFor(shot));
  write(negativePath, negativePromptFor(shot));
  write(metadataPath, JSON.stringify(metadata, null, 2) + "\n");
  write(auditPath, [
    "# " + shot.id + " Source Timecode Audit",
    "",
    "- Source timecode: " + shot.source_timecode,
    "- Local source still: " + shot.source_reference,
    "- Source still status: planning_only; this is not a final live-action frame.",
    "- Adaptation use: " + shot.purpose,
    "- Adaptation gap: source game staging/UI is replaced by physical live-action geography, adult performers, practical light, and the shot-specific causal action chain.",
    "- Canon/fidelity lock: " + shot.characters.join(", ") + " remain identifiable through the local reference pack; no runtime path is required by the executable prompt.",
    "- Review state: source event order audited; prompt-against-frame and motion review remain pending."
  ].join("\n") + "\n");
  deliveryShots.push({
    id: shot.id,
    order: shot.order,
    title: shot.title,
    status: "frames_pending",
    duration_seconds: shot.duration_seconds,
    scene: shot.scene,
    location: shot.location,
    characters: shot.characters,
    purpose: shot.purpose,
    source_timecode: shot.source_timecode,
    source_reference: shot.source_reference,
    source_reference_status: "planning_only",
    start_frame: shot.frame_paths.start,
    key_frame: shot.frame_paths.key,
    end_frame: shot.frame_paths.end,
    prompt_path: promptPath,
    negative_prompt_path: negativePath,
    frame_spec: frameSpecPath,
    metadata_path: metadataPath,
    source_audit_path: auditPath,
    expected_clip: "delivery/EP04_prompt_asset_package_v1/clips/" + shot.id + ".mp4",
    edit_in: shot.previous,
    edit_out: shot.next,
    audio_anchor: shot.audio,
    dialogue_line_ids: dialogueIds,
    dialogue_mode: shot.dialogue_line ? "single_turn" : "silent",
    asset_references: shot.asset_references,
    reject_if: [rejectCommon("the shot is promoted before actual frame review")]
  });
}

writeJson("planning/dialogue_timeline.json", {
  version: 1,
  project: "FireEmblem3H-LiveAction",
  episode: "EP04",
  runtime_seconds: runtimeSeconds,
  scene_dialogue_mode: "mixed",
  dialogue_pacing_required: true,
  timing_policy: {
    required: true,
    min_speech_characters_per_second: 3.5,
    max_speech_characters_per_second: 6.5,
    max_interline_silence_seconds: 0.25,
    max_tail_hold_seconds: 0.35,
    max_reaction_tail_seconds: 1.0,
    native_audio_policy: "probe_then_approve"
  },
  lines
});

const transitions = [];
for (let i = 0; i < shots.length - 1; i += 1) {
  const a = shots[i];
  const b = shots[i + 1];
  let type = "cut";
  if (i === 0 || i === 1 || i === 6 || i === 21 || i === 25) type = "match_cut";
  if (i === 22) type = "color_bridge";
  transitions.push({
    from: a.id,
    to: b.id,
    type,
    from_state: a.end,
    to_state: b.start,
    visual_bridge: "Preserve the handoff from " + a.title + " into " + b.title + "; no unexplained teleport or axis reversal.",
    audio_bridge: "Carry or deliberately cut the stated sound bed so the transition is motivated by stone, bell, metal, breath, or forest air."
  });
}
writeJson("planning/transition_map.json", {
  version: 1,
  episode: "EP04",
  axis_policy: "Tomb shots use a north-side axis; the forest is a deliberate spatial reset; the final corridor returns to the monastery axis.",
  transitions
});

write("planning/coverage_plan.md", [
  "# EP4 Coverage Plan",
  "",
  "The sequence is covered as a three-layer chain: institutional wide geography, character reaction, and one causal action beat. Source stills are layout research only.",
  "",
  "| Coverage block | Shots | Required read | Gate |",
  "| --- | --- | --- | --- |",
  "| Ceremony / briefing | Shot001–Shot006 | Rhea hierarchy, Seteth logistics, Dimitri/Dedue protection, Byleth command | story + sequence |",
  "| Holy Tomb geography | Shot007–Shot010 | threshold, north-side axis, wall evidence, intact group spacing | sequence + continuity |",
  "| Death Knight action | Shot011–Shot015 | recognition, distance, one weapon contact, retreat, recovery | combat + continuity |",
  "| Institutional aftermath | Shot016–Shot022 | factual report, faculty inference, student silence, Dimitri confession | story + dialogue |",
  "| Forest conspiracy | Shot023–Shot026 | practical red light, helmeted identities, empty distance, withheld plan | story + continuity |",
  "| Sothis coda | Shot027–Shot028 | private question, no answer, dark door | dialogue + preview |",
  "",
  "No shot relies on a source screenshot as a final frame. Every future generation pass must supply distinct START/KEY/END states and must preserve the stated handoff."
].join("\n") + "\n");

writeJson("planning/animatic_plan.json", {
  version: 1,
  episode: "EP04",
  runtime_seconds: runtimeSeconds,
  source_audio_reference: "Separate AAC source audio is timing/reference only; native Japanese dialogue remains probe_pending.",
  audio_review: "Timing pass is complete at prompt-package level; audio probe and final mix are downstream.",
  visual_review: "Planning board uses source stills only; actual integrated live-action frames are pending.",
  shots: shots.map((shot) => ({
    id: shot.id,
    order: shot.order,
    start_seconds: shot.scene_start_seconds,
    end_seconds: shot.scene_end_seconds,
    duration_seconds: shot.duration_seconds,
    source_reference: shot.source_reference,
    storyboard_status: "frames_pending",
    dialogue_line_ids: shot.dialogue_line ? [shot.dialogue_line.id] : []
  }))
});

writeJson("planning/action_choreography.json", {
  version: 1,
  episode: "EP04",
  mode: "combat",
  geography: {
    arena: "Seiros Tomb central crypt corridor",
    master_shot_id: "Shot013",
    axis: "north-side axis, party retreats toward south threshold",
    camera_side: "south wall with the pillar on Byleth's right",
    distance_policy: "Keep a visible 4.5 metre start buffer; contact occurs only at shoulder-height weapon line; no body penetration."
  },
  fighters: [
    {
      id: "Byleth",
      starting_position: "south-side threshold, one step in front of Dimitri and Dedue",
      facing: "north toward Death Knight",
      screen_side: "near-right",
      weapon_id: "Sword of the Creator",
      state_after: "balanced behind the stone pillar, sword low but ready"
    },
    {
      id: "DeathKnight",
      starting_position: "north archway beyond the blue flame pool",
      facing: "south toward Byleth",
      screen_side: "deep-left",
      weapon_id: "scythe",
      state_after: "scythe reset low, feet grounded, no pursuit"
    }
  ],
  beats: [
    {
      id: "ACT-EP04-001",
      shot_id: "Shot013",
      attacker: "DeathKnight",
      defender: "Byleth",
      action: "one weighted horizontal scythe sweep from the attacker's right to left",
      target: "Byleth's upper-torso line",
      distance_before: "4.5 metres with a stone pillar offset to defender's right",
      attack_direction: "right-to-left horizontal at shoulder height",
      contact: true,
      contact_mode: "weapon_weapon",
      contact_point: "Byleth's blade intercepts the scythe shaft before the body line",
      contact_frame: "KEY",
      contact_result: "sweep is redirected into the stone pillar; no body hit",
      defender_reaction: "Byleth steps off the line and turns the blade through the shaft",
      recovery: "Byleth recovers behind the pillar; Death Knight takes the weight back to the rear foot",
      state_after: "party is protected behind the pillar and Death Knight remains beyond the buffer",
      camera_read: "wide enough for feet, weapon path, pillar and distance; follow once through contact",
      attacker_weapon: "scythe",
      defender_weapon: "Sword of the Creator",
      frame_chain: {
        start: "source_refs/game_frame_0390s.jpg",
        key: "source_refs/game_frame_0450s.jpg",
        end: "source_refs/game_frame_0480s.jpg"
      }
    },
    {
      id: "ACT-EP04-002",
      shot_id: "Shot013",
      attacker: "Byleth",
      defender: "DeathKnight",
      action: "short disengage feint toward the open lane without pursuing",
      target: "space between the pillar and the scythe recovery",
      distance_before: "1.8 metres after the weapon contact",
      attack_direction: "forward diagonal feint, stopped before body range",
      contact: false,
      near_miss_result: "Death Knight withdraws half a step; the feint creates retreat time and no impact",
      defender_reaction: "Death Knight turns the helmet and keeps the scythe low",
      recovery: "Byleth returns the sword to the safe exit line",
      state_after: "both fighters remain standing, no injury, no pursuit",
      camera_read: "read the feint as a distance decision, not a second attack",
      frame_chain: {
        start: "source_refs/game_frame_0450s.jpg",
        key: "source_refs/game_frame_0480s.jpg",
        end: "source_refs/game_frame_0480s.jpg"
      }
    },
    {
      id: "ACT-EP04-003",
      shot_id: "Shot014",
      attacker: "DeathKnight",
      defender: "Byleth",
      action: "scythe point tracks the retreating line but stops at the threshold",
      target: "empty space behind Byleth's guard line",
      distance_before: "3.5 metres and increasing",
      attack_direction: "forward tracking line, no swing",
      contact: false,
      near_miss_result: "the point never reaches the body line; Byleth clears the threshold",
      defender_reaction: "Byleth keeps the sword between the point and the escorts",
      recovery: "Death Knight plants the scythe and remains in the tomb light",
      state_after: "party outside, threat inside, action closed without a winner pose",
      camera_read: "preserve the threshold and the feet; do not cut to a weapon glamour insert",
      frame_chain: {
        start: "source_refs/game_frame_0480s.jpg",
        key: "source_refs/game_frame_0480s.jpg",
        end: "source_refs/game_frame_0510s.jpg"
      }
    }
  ],
  previs_review_surface: "generated/action_choreography_board_planning_only.jpg",
  frame_source_policy: "The frame_chain references are game-recording stills for planning geography only. They are not final live-action frames.",
  review_status: "combat choreography reviewed at planning level; final frame-chain and motion probe pending"
});

const assetEntries = [
  { id: "EP04-STYLE-LIVE", type: "style_reference", paths: [styleRef], continuity_locks: ["adult live-action performers", "practical materials", "16:9 cinematic depth"], reject_if: ["anime", "CGI render", "poster", "game screenshot"] },
  { id: "EP04-LOC-TOMB", type: "location_reference", paths: [locationRefs.tomb], continuity_locks: ["wet dark stone", "cyan practical flame", "north-side axis"], reject_if: ["modern object", "UI", "bright daylight"] },
  { id: "EP04-LOC-CATHEDRAL", type: "location_reference", paths: [locationRefs.cathedral, locationRefs.antechamber], continuity_locks: ["candlelit stone", "Rhea above students", "institutional symmetry"], reject_if: ["lineup", "game dialogue box", "war ruin"] },
  { id: "EP04-LOC-CLOISTER", type: "location_reference", paths: [locationRefs.cloister], continuity_locks: ["damp monastery corridor", "night practical lamp", "academy-era scale"], reject_if: ["modern campus", "empty black void", "war-phase ruin"] },
  { id: "EP04-LOC-FOREST", type: "location_reference", paths: [locationRefs.forest], continuity_locks: ["wet trunks", "green-black fog", "controlled practical red source"], reject_if: ["glowing villain aura", "poster forest", "daylight"] },
  { id: "EP04-BYLETH", type: "character_reference", paths: characterRefs.Byleth, continuity_locks: ["female Byleth", "blue-black hair", "academy-era black outfit", "adult-safe performer"], reject_if: ["male Byleth", "child", "war-phase aging", "second sword"] },
  { id: "EP04-DIMITRI", type: "character_reference", paths: characterRefs.Dimitri, continuity_locks: ["blond Dimitri", "academy-era blue cape", "adult-safe performer"], reject_if: ["war-phase king", "generic blond hero", "weapon duplication"] },
  { id: "EP04-DEDUЕ", type: "character_reference", paths: characterRefs.Dedue, continuity_locks: ["Dedue identity", "academy-era navy/cream outfit", "adult-safe performer"], reject_if: ["generic soldier", "child", "wrong skin tone", "weapon duplication"] },
  { id: "EP04-FACULTY", type: "faculty_identity_reference", paths: [characterRefs.Rhea[0], characterRefs.Seteth[0], characterRefs.Manuela[0], characterRefs.Hanneman[0]], continuity_locks: ["adult faculty", "canon identity separation", "academy-era setting"], reject_if: ["students in faculty roles", "villain caricature", "age drift"] },
  { id: "EP04-DEATH-KNIGHT", type: "helmeted_identity_reference", paths: characterRefs.DeathKnight, continuity_locks: ["black-purple armor", "single scythe", "grounded helmeted silhouette"], reject_if: ["generic knight", "face reveal", "scythe duplication", "gore"] },
  { id: "EP04-FLAME-EMPEROR", type: "helmeted_identity_reference", paths: characterRefs.FlameEmperor, continuity_locks: ["red-black horned armor", "gold details", "helmet remains on"], reject_if: ["generic villain", "face reveal", "glowing eyes", "poster pose"] },
  { id: "EP04-SOTHIS", type: "dream_identity_reference", paths: characterRefs.Sothis, continuity_locks: ["green-white dream presence", "brief reflection", "no cutout"], reject_if: ["UI apparition", "giant glow", "unmotivated physical body"] }
];
writeJson("production_system/asset_manifest.json", {
  version: 1,
  project: "FireEmblem3H-LiveAction",
  episode: "EP04",
  reference_pack: "source/reference_pack/reference_manifest.json",
  source_screenshot_policy: "planning_only",
  assets: assetEntries
});

writeJson("production_system/sequence_manifest.json", {
  version: 1,
  project: "FireEmblem3H-LiveAction",
  episode: "EP04",
  shot_order: shots.map((shot) => ({ id: shot.id, order: shot.order, start_seconds: shot.scene_start_seconds, end_seconds: shot.scene_end_seconds })),
  axis_policy: "Preserve tomb north-side axis; forest is a deliberate reset; return to monastery axis for the coda."
});

writeJson("production_system/video_delivery_manifest.json", {
  version: 1,
  project: "FireEmblem3H-LiveAction",
  episode: "EP04",
  package_id: "EP04_prompt_asset_package_v1",
  completion_target: "prompt_asset_package",
  status: "frames_pending",
  frame_generation_required: false,
  runtime_seconds: runtimeSeconds,
  spoken_language: "Japanese",
  subtitle_delivery: "none",
  source_reference_policy: "Game-recording stills are planning_only; final frame inputs must be generated integrated live-action frames.",
  shots: deliveryShots
});

writeJson("prompt_asset_package_manifest.json", {
  version: 1,
  project: "FireEmblem3H-LiveAction",
  episode: "EP04",
  title: "EP4 女神再生仪式 · Blue Lions live-action prompt asset package",
  package_id: "EP04_prompt_asset_package_v1",
  completion_target: "prompt_asset_package",
  status: "frames_pending",
  frame_readiness: "frames_pending",
  frame_generation_required: false,
  target_aspect: "16:9",
  spoken_language: "Japanese",
  subtitle_delivery: "none",
  model_target_profile: "model_target_profile.md",
  source_video_breakdown: "source_video_breakdown.md",
  source_reference_policy: "source_refs and planning contact sheets are layout/action research only.",
  visual_review: "pending actual integrated live-action frame generation",
  motion_review: "pending downstream clip probe",
  next_stage: "Generate and independently review START/KEY/END for every shot, then promote only reviewed shots to video_generation_package.",
  shots: deliveryShots
});

writeJson("production_system/preview_manifest.json", {
  version: 1,
  preview_id: "EP04-canonical-preview",
  entry_kind: "static_html",
  canonical_entry: "web/index.html",
  canonical_route: "/",
  data_source: "production_system/preview_manifest.json",
  update_mode: "in_place",
  status: "pending",
  revision: 0,
  last_updated_at: "",
  changed_shot_ids: [],
  shots: [],
  history: []
});

const artifacts = [
  ["project_bible", "source/project_bible.md", "plan"],
  ["outline", "script.md", "script"],
  ["script_scene", "script.md", "script"],
  ["director_treatment", "director_treatment.md", "direction"],
  ["shot_list", "shot_list.md", "coverage"],
  ["coverage_plan", "planning/coverage_plan.md", "coverage"],
  ["transition_map", "planning/transition_map.json", "sequence"],
  ["animatic_plan", "planning/animatic_plan.json", "animatic"],
  ["dialogue_timeline", "planning/dialogue_timeline.json", "story"],
  ["action_choreography", "planning/action_choreography.json", "combat"],
  ["reference_pack", "source/reference_pack/reference_manifest.json", "assets"],
  ["model_target_profile", "model_target_profile.md", "prompt"],
  ["prompt_asset_package", "prompt_asset_package_manifest.json", "prompt"]
].map(([type, artifactPath, stage]) => ({ id: "EP04-" + type, type, path: artifactPath, stage, status: "ready_for_independent_review" }));
writeJson("production_system/artifact_manifest.json", { version: 1, project: "FireEmblem3H-LiveAction", episode: "EP04", artifacts });

writeJson("production_system/review_manifest.json", {
  version: 1,
  project: "FireEmblem3H-LiveAction",
  episode: "EP04",
  reviews: [
    {
      id: "EP04-review-assets-v1",
      gate: "asset_gate",
      reviewer_role: "asset-qa-agent",
      decision: "asset_review_passed",
      reviewed_paths: ["production_system/asset_manifest.json", "source/reference_pack/reference_manifest.json"],
      notes: "Local reference pack is hash-recorded and inside the EP04 boundary. Main cast has face/full-body where available; faculty and helmeted roles are identity references for downstream lookdev.",
      reviewed_at: "2026-08-27"
    },
    {
      id: "EP04-review-story-v1",
      gate: "story_gate",
      reviewer_role: "story-editor-agent",
      decision: "story_review_passed",
      reviewed_paths: ["source/project_bible.md", "script.md", "planning/dialogue_timeline.json"],
      notes: "Source order is preserved; adaptation text is original; each spoken line has one authoritative shot-local window.",
      reviewed_at: "2026-08-27"
    },
    {
      id: "EP04-review-sequence-v1",
      gate: "sequence_gate",
      reviewer_role: "sequence-editor-agent",
      decision: "sequence_review_passed",
      reviewed_paths: ["shot_list.md", "planning/coverage_plan.md", "planning/transition_map.json"],
      notes: "28 ordered shots cover ceremony, tomb geography, Death Knight action, aftermath, forest conspiracy, and coda with explicit handoffs.",
      reviewed_at: "2026-08-27"
    },
    {
      id: "EP04-review-animatic-v1",
      gate: "animatic_gate",
      reviewer_role: "animatic-reviewer-agent",
      decision: "animatic_review_passed",
      reviewed_paths: ["planning/animatic_plan.json", "generated/source_contact_sheet_02_planning_only.jpg"],
      notes: "Planning animatic is complete as an ordered timing board; source contact sheet is clearly planning_only and does not stand in for final frames.",
      reviewed_at: "2026-08-27"
    },
    {
      id: "EP04-review-combat-v1",
      gate: "combat_gate",
      reviewer_role: "combat-choreography-reviewer-agent",
      decision: "combat_review_passed",
      reviewed_paths: ["planning/action_choreography.json", "generated/action_choreography_board_planning_only.jpg"],
      notes: "Planning-level action choreography has attacker, defender, target, distance, direction, contact/near-miss, reaction, recovery, state_after and camera_read. The board uses game stills only for layout research; final frame review remains pending.",
      reviewed_at: "2026-08-27"
    }
  ]
});

console.log(JSON.stringify({
  episode: "EP04",
  shots: shots.length,
  runtime_seconds: runtimeSeconds,
  dialogue_lines: lines.length,
  status: "frames_pending",
  output: root
}, null, 2));
