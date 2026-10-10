#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "episodes", "EP03");
const plan = JSON.parse(fs.readFileSync(path.join(projectRoot, "planning/external_film_staging_reboard_030_036_2026-09-10.json"), "utf8"));

const sharedPrompt = (shot) => `# ${shot.id} Video Prompt

## Upload-only contract

Upload exactly three images and label them START, KEY, and END. Use only those uploaded frames as hard anchors for identity, wardrobe, geography, screen direction, camera continuity, and the action chain. Do not use local paths, screenshots, source images, prior frame sets, or alternate candidates at video generation time. The three frames must be physically integrated live-action imagery with shared scale, perspective, contact shadows, and practical light; never paste a portrait onto a background.

The staging discipline comes from public professional feature-film and animation storyboard/layout practice: establish geography, motivate camera movement, show a physical verb before a facial reaction, and make one focal signal readable in each state. Do not imitate any particular film, director, artist, or local package. Local selected assets constrain identity, wardrobe, props, and location only.

Target: Seedance image-to-video, 16:9, cinematic live-action academy drama. Spoken language is Japanese only where dialogue is declared below. No Chinese or Mandarin voiceover. No subtitles, captions, dialogue boxes, UI, watermarks, logos, or readable text.

## Shot ID

${shot.id}

## Duration

${shot.duration} seconds. Animate START -> KEY -> END as three distinct blocking states, not crop, color, or lighting variants of one pose.

## Input Frames

Upload the three declared image anchors as separate inputs: START / start_frame, KEY / key_frame, and END / end_frame. START establishes the opening geography and physical task; KEY is the action peak or decision; END is the changed state handed to the next cut. Do not substitute a contact sheet, screenshot, local path, or alternate candidate.

- START / start_frame: ${shot.states.start}
- KEY / key_frame: ${shot.states.key}
- END / end_frame: ${shot.states.end}

## Scene

${shot.scene}

Story purpose: ${shot.purpose}

Visible named performers: ${shot.cast}. Do not add a named performer absent from this list. ${shot.presence}

## Motion and action chain

${shot.motion}

## Camera

${shot.camera}

## Performance and identity

${shot.performance}

## Audio

${shot.audio}

## Dialogue Timing / Delivery

${shot.dialogueTiming}

Delivery lock: use one single continuous utterance where speech exists; do not repeat, no stutter, no duplicated syllables. Respect the declared speech end and cut timing; silent shots contain no invented speech.

## Continuity locks

${shot.continuity.map((line) => `- ${line}`).join("\n")}

## Reject if

${[...shot.reject, "the frame is a game screenshot, 3D render, anime illustration, poster lineup, pasted cutout, or portrait collage", "START, KEY, and END collapse into one pose or only change lighting/crop", "Chinese/Mandarin speech, subtitles, captions, UI, readable text, borders, or watermarks appear"].map((line) => `- ${line}`).join("\n")}

## Uploaded frame roles

- START: ${shot.states.start}
- KEY: ${shot.states.key}
- END: ${shot.states.end}

Keep monitor_required until prompt-against-frame QA, strict adjacent continuity QA, and a real 3-second motion probe pass. Still-frame review does not approve video motion or native audio.
`;

const negativePrompt = (shot) => `# ${shot.id} Negative Prompt

No game screenshot, no game UI, no tactical grid, no dialogue box, no subtitle, no caption, no readable text, no watermark, no logo, no black border, no decorative frame, no poster composition, no 3D render, no anime, no illustration, no concept-art plate, no pasted cutout, no halo around hair, no floating body, no missing contact shadow, no inconsistent scale, no duplicated named character, no extra named performer, no generic replacement face, no modern object, no modern weapon, no gore, no triumph pose, no theatrical villain acting, no Chinese voice, no Mandarin voice, no invented dialogue, no repeated line, no lip-sync to silent shot.

${shot.id === "Shot030" ? "No Lonato, no second Catherine, no foreground Catherine crossing, no raised weapon, no pursuit, no celebratory formation." : ""}
${shot.id === "Shot031" ? "No young Seteth, no war-phase Seteth, no clean reset clothing, no military salute, no ceremonial lineup, no Catherine, no Lonato." : ""}
${shot.id === "Shot032" ? "No broad pointing gesture, no villain smile, no extra student, no armed executioner, no repeated Shot031 front-facing handoff." : ""}
${shot.id === "Shot033" ? "No shoulder-to-shoulder lineup, no fifth student, no Rhea, no Seteth, no Catherine, no Lonato, no authority figures returning." : ""}
${shot.id === "Shot034" ? "No drawn Thunderbrand blade, no generic straight sword, no polearm, no duplicate weapon, no Ashe inside sword distance, no fourth person." : ""}
${shot.id === "Shot035" ? "No static two-shot, no war-phase Dimitri, no beard, no third person, no touch between Dimitri and Byleth, no failed walk-away." : ""}
${shot.id === "Shot036" ? "No solid Sothis, no green flare without a face, no Sothis floor contact, no second Byleth, no Rhea close-up, no Rhea dialogue, no lore text." : ""}
`;

const frameSpec = (shot) => `# ${shot.id} Frame Spec

Shot ID: ${shot.id}
Stage: storyboard
Status: monitor_required
Current Version: ${shot.version}
Duration Target: ${shot.duration} seconds
Script Beat: ${shot.beat}
Shot Purpose: ${shot.purpose}
Location: ${shot.location}
Characters Visible: ${shot.cast}

## External craft boundary

This reboard uses public professional film/animation storyboard and layout methods for staging discipline only. Local selected assets constrain identity, wardrobe, weapons, props, and geography; they are not visual-quality, pose, lens, or blocking templates. Local support mini-theater packages and local EP02 shot packages are excluded as quality references.

## Character and asset locks

${shot.assetLocks.map((line) => `- ${line}`).join("\n")}

## Reference assets

${shot.refs.map((line) => `- ${line}`).join("\n")}

## Readability contract

Focal subject: ${shot.focal}
Attention path: ${shot.attention}
Visible task / obstacle / action / reaction / changed state: ${shot.readability}

## START / KEY / END

- START: ${shot.states.start}
- KEY: ${shot.states.key}
- END: ${shot.states.end}

## Camera and continuity

${shot.camera}

Edit in: ${shot.editIn}
Edit out: ${shot.editOut}
Continuity: ${shot.continuity.join(" ")}

## Audio anchor

${shot.audio}

## Reject conditions

${shot.reject.map((line) => `- ${line}`).join("\n")}
- game screenshot, UI, subtitles, readable text, black borders, pasted portrait plates, or non-integrated performers
- male or ambiguous Byleth, war-phase Byleth, duplicate named performer, or an unlisted named character
- START/KEY/END reduced to a crop, lighting, expression, or texture variation

Keep monitor_required until exact frame inspection, adjacent continuity QA, Japanese audio QA where applicable, and a real 3-second motion probe pass.
`;

const shots = {
  Shot030: {
    id: "Shot030", version: plan.shots.Shot030.version, duration: 12, beat: "战后无声", location: "Lonato battlefield ridge", cast: "female academy Byleth, academy Dimitri, academy Ashe, academy Catherine",
    scene: "Immediately after Lonato has gone down offscreen. The wet battlefield is clearing, but the students have not emotionally caught up with the order.",
    purpose: "Make the witnesses choose not to advance, then give Byleth a physical return route toward the cathedral.",
    presence: "Lonato is offscreen for the entire shot. Catherine is a rear-lane check, never a foreground hero.",
    motion: "0-3s: Start on a diagonal medium-wide. Catherine crosses the far background toward the offscreen site while female Byleth holds the near-left profile, Dimitri occupies a middle depth, and Ashe stands near-right with the bow low. 3-7s: Dimitri takes one half-step into the open lane and raises an empty palm to stop any further approach; Ashe slides one loose arrow back into the quiver instead of nocking again; Byleth watches the boundary. 7-10s: Catherine reaches the far edge and disappears behind the ridge. 10-12s: Byleth turns her shoulders toward the cathedral route and takes the first step; Dimitri follows the turn, while Ashe lingers for one breath and then begins to join. No one celebrates or chases.",
    camera: "Grounded 16:9 live-action medium-wide with a restrained lateral drift from the rear crossing to the witnesses' hands, then a slight opening toward the return route. Keep three depth layers and the empty lane readable; no lineup, no attack push-in, no portrait chain.",
    performance: "Female Byleth is quiet authority in the foreground, female academy identity only. Dimitri is shaken but disciplined and uses an open stop-hand, never a raised lance. Ashe carries grief through breath and the single arrow-to-quiver action. Catherine is efficient and unsentimental in the background. Keep muddy hems, wet cloth, real feet, and shared fog light.",
    audio: "Silent shot: wind, wet cloth, armor settling, one restrained breath, arrow shaft returning to leather, and fading battlefield ambience only. No spoken dialogue.",
    dialogueTiming: "No spoken dialogue. single_continuous_utterance: not applicable. repeat_policy: no_repeat. Do not invent mouth movement, voiceover, or reaction speech.",
    continuity: ["Receive Shot029's quiet kneel without showing Lonato again.", "Keep Byleth female in every anchor and keep all weapons low.", "Catherine crosses only in the rear and is gone by END.", "END points the group toward the cathedral route for Shot031; do not cut to a victory tableau.", "Use the wet battlefield reference for geography only, not as a quality or blocking template."],
    reject: ["Lonato returns or Catherine crosses the foreground", "Dimitri, Ashe, or Byleth raises a weapon", "the three witnesses become a row", "the return route is not visible by END"],
    states: plan.shots.Shot030.states,
    refs: plan.shots.Shot030.reference_assets,
    assetLocks: ["BylethFemale: assets/characters/protagonist/BylethFemale/professor/selected.png; female academy professor only.", "Dimitri: assets/characters/blue_lions/Dimitri/academy/selected.png; academy phase only.", "Ashe: assets/characters/blue_lions/Ashe/academy/selected.png; academy archer, bow lowered.", "Catherine: assets/characters/church_of_seiros/Catherine/academy/selected.png; academy knight in rear lane.", "Lonato is absent from the executable frame set; no weapon contact is shown."],
    focal: plan.shots.Shot030.focal_subject, attention: plan.shots.Shot030.attention_path,
    readability: "The witnesses want to move forward; the empty lane and Dimitri's stop-hand obstruct them; Ashe returns the arrow and Byleth turns the group away; their changed state is a restrained return route.",
    editIn: "cut from Lonato's controlled kneel and the dropped-sword aftermath", editOut: "cut on Byleth taking the cathedral return route",
  },
  Shot031: {
    id: "Shot031", version: plan.shots.Shot031.version, duration: 13.4, beat: "回到 Rhea 面前", location: "cathedral lower nave and altar steps", cast: "Rhea, mature academy Seteth, female academy Byleth, academy Dimitri, academy Ashe",
    scene: "The students cross back into the cathedral while mud and fatigue remain on their hems. The room's ritual order receives the battlefield report.",
    purpose: "Make the report move through bodies and levels, not appear as a static ceremony.",
    presence: "Exactly five named performers. Rhea and Seteth occupy the altar levels; Byleth, Dimitri, and Ashe remain below with separated depth marks.",
    motion: "0-4s: START begins with the cathedral door still swinging shut behind the students. They enter in a shallow diagonal with Byleth nearest the threshold, Dimitri one depth ahead, and Ashe off the center line; Rhea waits high near the altar and Seteth holds the closed folio. 4-9s: Seteth walks down one step to meet the returning group and extends the folio. Rhea descends one step, reaches across the level change, and receives it; the students stop below rather than forming a row. 9-12.5s: Rhea turns the folio in her hands and raises one calm hand as she speaks once in Japanese. 12.5-13.4s: Rhea turns back toward the altar with the folio, Seteth remains between levels, and the three students are left at the closed door with changed eyelines.",
    camera: "Start in a wide 16:9 threshold view that makes the door, lower nave, altar steps, and damp hems legible. Travel gently with Seteth into the handoff, keeping the lower-to-upper power gradient. End with a slight hold on the separated levels; no centered lineup and no zoom-only transition.",
    performance: "Rhea is calm and institutional, neither apologetic nor villainous. Mature academy Seteth performs dutifully and must not look young or war-phase. Female Byleth is the only Byleth and stays grounded. Dimitri and Ashe absorb the institutional language through small eyeline and posture changes. All five share one cathedral floor, light, perspective, and contact shadows.",
    audio: "Wet shoes, door wood settling, robe movement, a folio closing, distant bell resonance, cathedral reverb, and Rhea's exact Japanese line only.",
    dialogueTiming: "Line ID DL-EP03-031-1. Rhea speaks once in Japanese: ご苦労さまでした。あなた方は信仰の安寧を守りました。 Shot-local speech window 9.15-12.55s; speech_seconds 3.40s; let the final syllable and reverb settle before the 12.5-13.4s turn-away tail. repeat_policy: no_repeat; no stutter, paraphrase, added reply, subtitles, or non-Japanese voice.",
    continuity: ["Receive Shot030's wet return route and preserve mud residue on academy hems.", "Keep Seteth mature academy and Rhea above the students without freezing them into a lineup.", "The folio is one physical object handed from Seteth to Rhea; no duplicate report.", "END leaves Rhea turned toward the altar and the students at the closed door for Shot032/033.", "Cathedral reference constrains architecture and elevation only, not a local visual template."],
    reject: ["the five form a ceremonial row", "Seteth reads young or war-phase", "the folio handoff is absent or duplicated", "the door and muddy threshold vanish", "Rhea performs broad villain emotion"],
    states: plan.shots.Shot031.states,
    refs: plan.shots.Shot031.reference_assets,
    assetLocks: ["Rhea: assets/characters/church_of_seiros/Rhea/academy/selected.png; calm academy-era authority.", "Seteth: assets/characters/church_of_seiros/Seteth/academy/selected.png; mature academy adviser, no war-phase redesign.", "BylethFemale: assets/characters/protagonist/BylethFemale/professor/selected.png; female only.", "Dimitri and Ashe: academy selected assets; damp hems and restrained posture.", "CathedralInterior_reference.png constrains the altar/nave geography only; the folio is one closed physical report."],
    focal: plan.shots.Shot031.focal_subject, attention: plan.shots.Shot031.attention_path,
    readability: "The students need to report; the threshold and level change obstruct a simple ceremony; Seteth physically carries the folio to Rhea and she receives it; the changed state is the students held below a closed institutional decision.",
    editIn: "cut from the muddy return route into the cathedral threshold", editOut: "cut on Rhea turning back toward the altar with the report",
  },
  Shot032: {
    id: "Shot032", version: plan.shots.Shot032.version, duration: 11.5, beat: "西方教会处置", location: "cathedral side altar and stone rail", cast: "Rhea, mature academy Seteth, female academy Byleth",
    scene: "A tighter diagonal continuation of the report. The room remains serene while the decision becomes final through a small hand action.",
    purpose: "Separate the final order from Shot031's report handoff and make its physical consequence visible in Byleth's retreat.",
    presence: "Exactly three named performers. No student group, Catherine, Lonato, soldier, or extra speaker enters.",
    motion: "0-3.5s: START holds a profile axis: Seteth places the closed folio on a stone rail; Rhea stands above and across the rail; female Byleth remains low below the altar, looking up. 3.5-7.5s: Rhea closes the folio firmly with her palm and raises one hand only as a quiet stop to debate. Seteth waits one step below; Byleth's eyes lift, then her weight shifts back toward the side door. 7.5-10.65s: Rhea speaks once in Japanese without pointing, smiling, or theatrical pause. 10.65-11.5s: Rhea turns away toward the altar, Seteth takes the first step down with the folio, and Byleth steps backward toward the students' corridor.",
    camera: "Use a diagonal profile medium shot with a visible stone rail and lower-to-upper axis. Move only enough to read the palm closing the folio and Byleth's retreat; do not repeat Shot031's front-facing handoff, and do not use an exaggerated close-up.",
    performance: "Rhea is gentle but final, a procedure carried by certainty. Mature Seteth is attentive administrative duty. Female Byleth is grounded, female academy identity only, and receives the order through a small change of weight and eyeline. No one salutes, points aggressively, or performs magic.",
    audio: "Folio cover against stone, quiet robe movement, small steps, distant bells, cathedral reverb, and Rhea's exact Japanese line only.",
    dialogueTiming: "Line ID DL-EP03-032-1. Rhea speaks once in Japanese: 反逆者は裁きを受けねばなりません。 Shot-local speech window 8.20-10.65s; speech_seconds 2.45s; let the final syllable and reverb settle before the 10.65-11.5s turn-away tail. repeat_policy: no_repeat; no added reply, subtitles, or non-Japanese voice.",
    continuity: ["Receive Shot031's altar levels and closed report without resetting the room.", "Use the closed folio and palm as the single focal action; Byleth's backward step is the reaction.", "Keep Rhea, Seteth, and female Byleth in one physically integrated cathedral space.", "END sends Byleth toward the side corridor that becomes Shot033's reaction geography.", "The cathedral reference is architectural guidance only, never a local quality template."],
    reject: ["the action repeats Shot031's frontal handoff", "Rhea points, smiles like a villain, or becomes cartoonishly evil", "Byleth becomes male or disappears", "the order has no physical consequence", "the folio is duplicated or replaced by readable text"],
    states: plan.shots.Shot032.states,
    refs: plan.shots.Shot032.reference_assets,
    assetLocks: ["Rhea: assets/characters/church_of_seiros/Rhea/academy/selected.png; composed academy-era authority.", "Seteth: assets/characters/church_of_seiros/Seteth/academy/selected.png; mature academy adviser.", "BylethFemale: assets/characters/protagonist/BylethFemale/professor/selected.png; female only.", "CathedralInterior_reference.png constrains the stone rail and altar geometry; one closed folio only."],
    focal: plan.shots.Shot032.focal_subject, attention: plan.shots.Shot032.attention_path,
    readability: "Rhea must end the report discussion; the closed folio and calm raised hand are the obstacle/authority action; Byleth's backward step is the reaction; the changed state is the students being sent away with the order understood.",
    editIn: "cut from Rhea's turn and Seteth held between the altar levels", editOut: "cut on Byleth stepping toward the students' side door",
  },
  Shot033: {
    id: "Shot033", version: plan.shots.Shot033.version, duration: 14, beat: "学生目睹代价", location: "cathedral side aisle and authority door", cast: "academy Ashe, academy Dimitri, academy Felix, female academy Byleth",
    scene: "The students leave the authority door with no answer that can be spoken aloud. The reaction is expressed as separate choices of movement.",
    purpose: "Turn the reaction shot into a departure: Ashe releases the door, Dimitri seeks Byleth's read, Felix chooses the corridor, and Byleth follows after a beat.",
    presence: "Exactly four named performers. Rhea and Seteth are behind the closed authority door and never return to the frame.",
    motion: "0-4s: START is a single wet-stone side aisle. The authority door in the background is half-open; Ashe stands nearest the latch, Dimitri is in middle depth angled toward Byleth, Felix is already angled toward the open right corridor, and Byleth holds the near-left pivot in a clear three-quarter rear profile. 4-9s: Ashe releases the latch and lets the door close; Dimitri takes one small step toward Byleth but does not speak; Felix starts through the right corridor. 9-13s: The door finishes closing, Ashe drops his hand and lowers his gaze, and Byleth turns to follow Felix. Dimitri looks back once toward the closed door. 13-14s: Felix clears first, Byleth begins after him, Dimitri remains one beat, and Ashe starts last. No one forms a row.",
    camera: "One continuous 16:9 medium-wide side-aisle frame with a restrained lateral drift following the door latch into the right corridor. Keep separate depth marks, the closing door, and the exit lane in one geography. No portrait inserts, no reaction montage, no static zoom.",
    performance: "Ashe carries the door release and lowered gaze. Dimitri is protective but uncertain, looking to Byleth rather than raising a weapon. Felix communicates impatience through choosing the corridor first, not through a speech. Female Byleth is the quiet pivot and the only Byleth. Keep youthful academy identities, damp hems, and real feet on wet stone.",
    audio: "Door latch, wood settling, cloth and wet shoes, distant cathedral room tone. No spoken dialogue, no invented voice.",
    dialogueTiming: "No spoken dialogue. single_continuous_utterance: not applicable. repeat_policy: no_repeat. Keep mouths quiet; use only the door and footstep action as the audio bridge.",
    continuity: ["Receive Shot032's order through the closed authority door; do not bring Rhea or Seteth back.", "Keep four separate depth marks and preserve Byleth's female identity.", "The door closes before Byleth commits to the right corridor.", "END hands the open right corridor and Byleth's departure to Shot034; Dimitri and Felix clear from the side-talk lane.", "Cathedral architecture constrains geography only; no local frame is a blocking template."],
    reject: ["the four stand shoulder-to-shoulder", "the door or right corridor disappears", "a fifth student or authority figure enters", "the shot becomes four isolated portrait plates", "weapons rise or the reaction becomes triumph"],
    states: plan.shots.Shot033.states,
    refs: plan.shots.Shot033.reference_assets,
    assetLocks: ["Ashe, Dimitri, Felix: academy selected assets only; no war-phase aging.", "BylethFemale: assets/characters/protagonist/BylethFemale/professor/selected.png; female academy professor only.", "CathedralInterior_reference.png constrains the wet side-aisle and authority-door geography; no extra people."],
    focal: plan.shots.Shot033.focal_subject, attention: plan.shots.Shot033.attention_path,
    readability: "The students need to leave; the half-closed authority door and moral silence obstruct a normal group exit; each person takes a different physical choice; the changed state is a broken group moving into separate lanes.",
    editIn: "cut from the order carried down the altar steps", editOut: "cut on Byleth taking the right corridor after the authority door closes",
  },
  Shot034: {
    id: "Shot034", version: plan.shots.Shot034.version, duration: 12.6, beat: "Catherine 的信念", location: "wet monastery cloister", cast: "academy Catherine, academy Ashe, female academy Byleth",
    scene: "Ashe reaches the cloister after the students split. Catherine is finishing the practical maintenance of her weapon after the battlefield; Byleth passes through the far arch.",
    purpose: "Give Catherine's faith a physical, controlled action and preserve Ashe's respectful distance from the relic weapon.",
    presence: "Exactly three named performers. Catherine owns the right side, Ashe stays left at conversational distance, and female Byleth remains in the far exit lane.",
    motion: "0-4s: START receives the right-corridor movement. Ashe stops at the left edge of a wet strip; Catherine is crouched by the right column with one sheathed Thunderbrand and its dark wrap; female Byleth is in the rear arch. 4-8s: Catherine finishes retieing the scabbard wrap at knee height. Ashe takes one respectful step to the edge of the wet strip and asks whether she has never doubted; his bow stays down. Byleth clears the far arch. 8-11.7s: Catherine rises with the sheathed weapon still low and answers once in Japanese, facing Ashe without aggression. 11.7-12.6s: Ashe absorbs the answer, and Byleth enters the clear right exit lane toward the night cut.",
    camera: "Motivated 16:9 live-action medium-wide on one cloister axis. Start on the three depth marks, ease closer only for the hands wrapping the scabbard, then open slightly to keep the right exit lane. No symmetrical conversation tableau and no weapon glamour shot.",
    performance: "Catherine is tired, certain, and practical, never a cruel caricature. Ashe is morally unsettled but does not cross sword distance; his bow remains safely lowered. Female Byleth is silent, female academy identity only, and exits behind them. One sheathed Thunderbrand is the only weapon in the scene; no blade is drawn.",
    audio: "Wet boots, cloth tightening around leather scabbard, quiet cloister rain residue, and Catherine's exact Japanese line only.",
    dialogueTiming: "Line ID DL-EP03-034-1. Catherine speaks once in Japanese: 私はレア様を信じている。迷いは、まだ決められない者に任せる。 Shot-local speech window 8.10-11.70s; speech_seconds 3.60s; let the final syllable and cloister reverb settle before the 11.7-12.6s exit tail. repeat_policy: no_repeat; no added reply, subtitles, or non-Japanese voice.",
    continuity: ["Receive Shot033's rightward corridor eyeline and keep Byleth far behind Ashe/Catherine.", "Keep Catherine's single Thunderbrand sheathed, wrapped, and low; correct relic silhouette only.", "Ashe never enters Catherine's sword distance and never raises the bow.", "END leaves the right exit lane open for Shot035's night walk; Dimitri and Felix do not return.", "Monastery cloister reference constrains columns, wet stone, and exit geography only."],
    reject: ["Thunderbrand is generic, drawn, duplicated, or replaced by a polearm", "Ashe closes into sword distance", "Catherine and Ashe become a symmetrical two-shot", "Byleth becomes male or a fourth performer enters", "the wrap action is missing"],
    states: plan.shots.Shot034.states,
    refs: plan.shots.Shot034.reference_assets,
    assetLocks: ["Catherine: assets/characters/church_of_seiros/Catherine/academy/selected.png; academy knight identity.", "Ashe: assets/characters/blue_lions/Ashe/academy/selected.png; academy archer with lowered bow.", "BylethFemale: assets/characters/protagonist/BylethFemale/professor/selected.png; female only.", "Thunderbrand: assets/props/shared/hero_relics/thunderbrand_reference.png; one sheathed single-handed relic weapon, no generic replacement.", "MonasteryMainCloister_reference.png constrains the wet stone and column geography only."],
    focal: plan.shots.Shot034.focal_subject, attention: plan.shots.Shot034.attention_path,
    readability: "Catherine must finish securing the weapon while Ashe asks a difficult question; the wet strip and sheathed weapon keep him at distance; Catherine rises to answer; Byleth's exit changes the space toward the night cut.",
    editIn: "cut from Byleth's right-corridor departure into the wet cloister", editOut: "cut after Byleth clears the far arch and Catherine turns to answer",
  },
  Shot035: {
    id: "Shot035", version: plan.shots.Shot035.version, duration: 15, beat: "杀意与正义", location: "night monastery cloister", cast: "academy Dimitri, female academy Byleth",
    scene: "After Catherine's certainty, Dimitri makes his own moral thought physical in the night corridor.",
    purpose: "Make Dimitri's dangerous self-reflection a walk, a brace, a line, and a deliberate departure.",
    presence: "Exactly two named performers. Catherine and Ashe are gone; no third person enters.",
    motion: "0-5s: START begins with Dimitri already walking toward a dark arch, several paces ahead. Female Byleth follows behind near a warm lamp and column; the wet corridor between them is empty and readable. 5-9.2s: Dimitri stops under a colder patch of moonlight, removes one glove, and presses his bare hand to the wet stone balustrade. Byleth stops two steps behind and does not touch him. 9.2-14.2s: Dimitri speaks once in Japanese while bracing on the stone; Byleth listens without interrupting. 14.2-15s: Dimitri resumes walking into the dark arch and becomes smaller. Byleth remains under the lamp and turns to watch him leave.",
    camera: "Long-lens 16:9 live-action follow from the wide walking geography to the hand-to-stone action, then pull back so the final distance is visibly larger. Preserve moonlight direction, warm lamp, wet reflections, and a clear buffer. No spin, fisheye, or zoom-only transition.",
    performance: "Dimitri is the blond academy prince, troubled but controlled, with academy wardrobe and no war-phase aging. Female Byleth is the only Byleth, an adult woman with dark teal hair and black professor coat, silent and attentive. The glove removal, palm pressure, lowered head, and walk-away carry the emotion; no theatrical breakdown.",
    audio: "Night rain residue, wet boots, glove against stone, damp cloth, quiet cloister room tone, and Dimitri's exact Japanese line only.",
    dialogueTiming: "Line ID DL-EP03-035-1. Dimitri speaks once in Japanese: 殺意が正義をまとえば、とても静かになるのですね。 Shot-local speech window 9.20-14.20s; speech_seconds 5.00s; let the final syllable and reverb settle before the 14.2-15s walk-away tail. repeat_policy: no_repeat; no added reply, subtitles, or non-Japanese voice.",
    continuity: ["Receive Shot034's cleared right corridor as a night cloister walk; Catherine and Ashe do not return.", "Keep Dimitri ahead at START, braced at KEY, and farther away at END.", "Keep female Byleth consistent and physically separate; she never touches Dimitri.", "The hand-to-stone action is the focal peak, not a static conversation pose.", "Monastery cloister reference constrains stone, columns, and lamp geography only."],
    reject: ["the walk becomes a static two-shot", "Dimitri never removes the glove or presses the stone", "Byleth becomes male or war-phase", "the final distance is not larger", "a third performer or extra weapon enters"],
    states: plan.shots.Shot035.states,
    refs: plan.shots.Shot035.reference_assets,
    assetLocks: ["Dimitri: assets/characters/blue_lions/Dimitri/academy/selected.png; academy prince only, no war-phase.", "BylethFemale: assets/characters/protagonist/BylethFemale/professor/selected.png; female academy professor only.", "MonasteryMainCloister_reference.png constrains night cloister geometry; no extra figure."],
    focal: plan.shots.Shot035.focal_subject, attention: plan.shots.Shot035.attention_path,
    readability: "Dimitri wants to leave the conversation; the empty corridor and his own thought stop him; he braces on wet stone and speaks; the changed state is increased distance with Byleth left under the lamp.",
    editIn: "cut from the empty right corridor after Catherine's answer", editOut: "cut after Dimitri leaves Byleth under the lamp in the dark arch",
  },
  Shot036: {
    id: "Shot036", version: plan.shots.Shot036.version, duration: 9.3, beat: "章末圣墓阴影", location: "cathedral chapel facing the Holy Tomb", cast: "female academy Byleth, spectral Sothis, distant Rhea",
    scene: "The human authority has left the frame. In a dark cathedral chapel, Byleth crosses a threshold and the inner voice takes shape without becoming a physical companion.",
    purpose: "End on a concrete mystery action: Byleth stops, the candle bends, Sothis appears, then recedes before the cut to black.",
    presence: "Exactly three presences: grounded female Byleth, recognizable translucent Sothis without floor contact, and distant Rhea turned toward the Holy Tomb. Rhea does not approach or speak.",
    motion: "0-3s: START shows female Byleth crossing the near chapel threshold with the sheathed Sword of the Creator held low at her side. Rhea remains a small turned-away figure toward the Holy Tomb; Sothis is absent. 3-6s: Byleth stops as a nearby candle flame bends against the still air and turns toward it. 5.4-8.4s: A recognizable translucent Sothis resolves beside Byleth in the air, not on the floor, and asks the exact Japanese question once. 8.4-9.3s: Sothis recedes into a small field of motes while Byleth remains grounded and Rhea never turns; the cathedral darkens into the cut to black.",
    camera: "Long-lens 16:9 cathedral threshold view with a restrained push only after Byleth stops. Keep the Holy Tomb direction, the grounded foreground, the spectral negative space, and Rhea's distance readable. No lore montage, no green-effect close-up, no black border.",
    performance: "Female Byleth is grounded, alert, and female academy identity only. Sothis is recognizable through face, hair silhouette, and translucent suspended body, but has no floor contact and does not become a solid companion. Rhea remains distant, turned away, and silent. The Sword of the Creator is one sheathed prop at Byleth's side.",
    audio: "Candle hush, cathedral reverb, a restrained spectral tonal shift, and Sothis's exact Japanese line only. No other voice.",
    dialogueTiming: "Line ID DL-EP03-036-1. Sothis speaks once in Japanese: そなたは、あの者を信じるのか？ Shot-local speech window 5.40-8.40s; speech_seconds 3.00s; let the final syllable and reverb settle before the 8.4-9.3s mote fade and cut to black. repeat_policy: no_repeat; no added Rhea voice, subtitles, or non-Japanese voice.",
    continuity: ["Receive Shot035's isolated female Byleth under the lamp through a deliberate cathedral cut.", "Keep the Sword of the Creator sheathed, single, and physically held; no generic weapon replacement.", "Sothis appears only after the grounded stop and never gains floor contact.", "Rhea stays distant toward the Holy Tomb and never becomes a close speaker.", "Cathedral reference constrains the chapel axis only; no prior local frame is a quality or staging template."],
    reject: ["Sothis becomes solid or only a generic green flare", "Byleth becomes male, ambiguous, or duplicates", "Rhea approaches or speaks", "the Sword of the Creator is generic, duplicated, or floating", "the spectral reveal has no physical trigger"],
    states: plan.shots.Shot036.states,
    refs: plan.shots.Shot036.reference_assets,
    assetLocks: ["BylethFemale: assets/characters/protagonist/BylethFemale/professor/selected.png; female academy professor only.", "Sothis: assets/characters/divine/Sothis/dream/legacy_ep01/candidate_03.png; recognizable spectral identity, no floor contact.", "Rhea: assets/characters/church_of_seiros/Rhea/academy/selected.png; distant and turned away.", "Sword of the Creator: assets/props/shared/sword_of_creator/selected.png; one sheathed weapon held at Byleth's side.", "CathedralInterior_reference.png constrains the Holy Tomb-facing chapel axis only."],
    focal: plan.shots.Shot036.focal_subject, attention: plan.shots.Shot036.attention_path,
    readability: "Byleth needs to cross the chapel; the bent candle interrupts her; Sothis appears as the readable response and asks the question; the changed state is a darker cathedral with the voice receding into motes.",
    editIn: "cut from Byleth left under the night lamp into the cathedral threshold", editOut: "cut to black after Sothis recedes into motes",
  },
};

for (const shot of Object.values(shots)) {
  const promptPath = path.join(projectRoot, `video_prompts/${shot.id}_prompt.md`);
  const negativePath = path.join(projectRoot, `video_prompts/${shot.id}_negative_prompt.md`);
  const specDir = path.join(projectRoot, `storyboards/${shot.id}`);
  fs.mkdirSync(specDir, { recursive: true });
  fs.writeFileSync(promptPath, `${sharedPrompt(shot)}\n`);
  fs.writeFileSync(negativePath, `${negativePrompt(shot)}\n`);
  fs.writeFileSync(path.join(specDir, "frame_spec.md"), `${frameSpec(shot)}\n`);
  const reviewDir = path.join(projectRoot, "production_system/reviews/external_film_staging_reboard_2026-09-10");
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(path.join(reviewDir, `${shot.id.toLowerCase()}_reboard_review.md`), `# ${shot.id} External Film-Staging Reboard Review\n\n- Revision: ${shot.version}\n- Still-frame decision: pending generation and exact visual inspection\n- Downstream decision: monitor_required\n- Method boundary: public professional film/animation staging references guide readability and continuity discipline only; local selected assets constrain identity and geography only.\n- Planned focal subject: ${shot.focal}\n- Planned attention path: ${shot.attention}\n- Planned START -> KEY -> END: ${shot.states.start} -> ${shot.states.key} -> ${shot.states.end}\n- Required evidence after generation: exact copied frame paths, source-cache hashes, contact sheet inspection, adjacent continuity review, prompt-against-frame QA, and a 3-second motion probe.\n`);
}

console.log(JSON.stringify({
  revision: plan.revision,
  shots: Object.keys(shots),
  prompts: Object.keys(shots).length,
  negative_prompts: Object.keys(shots).length,
  frame_specs: Object.keys(shots).length,
  review_templates: Object.keys(shots).length,
}, null, 2));
