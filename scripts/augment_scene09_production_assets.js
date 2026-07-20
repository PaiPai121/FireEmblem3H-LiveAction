const fs = require("fs");

const queuePath = "episodes/EP02/mock_battle_keyframe_production_queue_2026-07-17.json";
const queueMdPath = "episodes/EP02/mock_battle_keyframe_production_queue_2026-07-17.md";
const subframeJsonPath = "episodes/EP02/mock_battle_subframe_plan_2026-07-17.json";
const subframeMdPath = "episodes/EP02/mock_battle_subframe_plan_2026-07-17.md";

const characterAssets = {
  Byleth: "assets/characters/protagonist/Byleth/professor/selected.png",
  Dimitri: "assets/characters/blue_lions/Dimitri/academy/selected.png",
  Dedue: "assets/characters/blue_lions/Dedue/academy/selected.png",
  Felix: "assets/characters/blue_lions/Felix/academy/selected.png",
  Sylvain: "assets/characters/blue_lions/Sylvain/academy/selected.png",
  Ingrid: "assets/characters/blue_lions/Ingrid/academy/selected.png",
  Ashe: "assets/characters/blue_lions/Ashe/academy/selected.png",
  Annette: "assets/characters/blue_lions/Annette/academy/selected.png",
  Mercedes: "assets/characters/blue_lions/Mercedes/academy/selected.png",
  Edelgard: "assets/characters/black_eagles/Edelgard/academy/selected.png",
  Hubert: "assets/characters/black_eagles/Hubert/academy/selected.png",
  Ferdinand: "assets/characters/black_eagles/Ferdinand/academy/selected.png",
  Dorothea: "assets/characters/black_eagles/Dorothea/academy/selected.png",
  Caspar: "assets/characters/black_eagles/Caspar/academy/selected.png",
  Bernadetta: "assets/characters/black_eagles/Bernadetta/academy/selected.png",
  Linhardt: "assets/characters/black_eagles/Linhardt/academy/selected.png",
  Petra: "assets/characters/black_eagles/Petra/academy/selected.png",
  Claude: "assets/characters/golden_deer/Claude/academy/selected.png",
  Hilda: "assets/characters/golden_deer/Hilda/academy/selected.png",
  Lorenz: "assets/characters/golden_deer/Lorenz/academy/selected.png",
  Ignatz: "assets/characters/golden_deer/Ignatz/academy/selected.png",
  Lysithea: "assets/characters/golden_deer/Lysithea/academy/selected.png",
  Marianne: "assets/characters/golden_deer/Marianne/academy/selected.png",
  Raphael: "assets/characters/golden_deer/Raphael/academy/selected.png",
  Leonie: "assets/characters/golden_deer/Leonie/academy/selected.png",
  Hanneman: "assets/characters/church_of_seiros/Hanneman/academy/selected.png",
  Manuela: "assets/characters/church_of_seiros/Manuela/academy/selected.png",
  Rhea: "assets/characters/church_of_seiros/Rhea/academy/selected.png",
  Seteth: "assets/characters/church_of_seiros/Seteth/academy/selected.png",
};

const roleNotes = {
  Byleth: "calm professor commander, continuity anchor between front and flank lines",
  Dimitri: "youthful blond Blue Lions prince, training lance, aggressive but controlled",
  Dedue: "tall broad guardian, dark skin, white hair, shield-wall posture",
  Felix: "dark-blue-haired duelist, sharp side-cut tension, restrained from overextending",
  Sylvain: "red-orange-haired lancer, draws flank pressure and turns serious under threat",
  Ingrid: "blonde disciplined lancer, precise side entry and teacher-platform cut-off",
  Ashe: "ash-gray-haired archer, observation high point and suppression shots",
  Annette: "petite peach-orange-haired 18-year-old mage, nervous-to-stable wind magic",
  Mercedes: "gentle blonde 18-year-old healer, soft but decisive rear-line support",
  Edelgard: "silver-haired Black Eagles leader, red cape and visible red pants, composed command",
  Hubert: "dark-haired Black Eagles mage, pressure caster behind front line",
  Ferdinand: "orange-haired noble cavalry student, stabilizes and intercepts Felix",
  Dorothea: "Black Eagles mage, elegant academy support movement",
  Caspar: "short blue-haired brawler, direct physical pressure",
  Bernadetta: "anxious archer, cover-focused movement",
  Linhardt: "sleepy healer/mage support, avoids front-line collision",
  Petra: "agile purple-haired scout, quick side pressure",
  Claude: "brown-haired Golden Deer leader, tactical smile, reads overextension from cover",
  Hilda: "pink-haired axe student, flank pressure from thicket cover",
  Lorenz: "purple-haired noble, formal posture, center-west first wave",
  Ignatz: "glasses-wearing archer, cautious ranged support",
  Lysithea: "small pale mage, precise magical threat",
  Marianne: "quiet healer, reserved support presence",
  Raphael: "large Golden Deer brawler, physical screen",
  Leonie: "orange-haired hunter, practical ranged pressure",
  Hanneman: "older scholarly teacher, wind/Sagittae angle on raised heal-tile platform",
  Manuela: "beautiful adult former-opera-star teacher, white magic support near heal tile",
  Rhea: "archbishop observer, distant authority if visible",
  Seteth: "stern older church administrator, short beard/mustache, not idol-like",
};

const specialSubframes = {
  Shot026C: [
    ["A", "Horn / release", "Blue Lions explode from the southeast start as the horn hits; Dimitri and Dedue take the first two steps before anyone else reacts."],
    ["B", "Front accelerates", "Dimitri and Dedue pull ahead toward the central outer choke while Felix shadows on the open side and Ashe breaks for a height advantage."],
    ["C", "Support line follows", "Annette and Mercedes move under cover, young and tense, keeping the rear connected to the charge."],
    ["D", "Black Eagles ahead", "The Black Eagles are visible trying to claim the same lane, making the collision feel intentional rather than accidental."],
  ],
  Shot027C: [
    ["A", "Lane convergence", "Dimitri and Dedue arrive first at the central outer passage as Edelgard's front line braces."],
    ["B", "First contact", "Training lance and shield hit the Black Eagles front rank with controlled nonlethal force."],
    ["C", "Command depth", "Edelgard, Hubert, and Ferdinand remain readable behind the line, not panicked."],
    ["D", "Felix waits", "Felix is framed on the side gap, coiled to enter but still under Byleth's timing."],
  ],
  Shot029D: [
    ["A", "Claude's sightline", "Claude's bow angle is from thicket cover toward Ashe's observation perch, cutting information rather than hunting Dimitri."],
    ["B", "Arrow impact", "The training arrow strikes near Ashe's cover and forces him to duck off the clean observation line."],
    ["C", "Rear-line danger", "Annette and Mercedes see that their movement route is now exposed."],
    ["D", "Flank opens", "Sylvain and Ingrid begin to turn, making the side-front split readable."],
  ],
  Shot030C: [
    ["A", "Route exposed", "A Golden Deer shot or feint lands across the Blue Lions support corridor between front and rear."],
    ["B", "Annette disruption", "Annette's wind magic flickers under pressure, then starts to stabilize."],
    ["C", "Mercedes chooses cover", "Mercedes moves the support line laterally instead of retreating, keeping healing range alive."],
    ["D", "Byleth reads two fronts", "Byleth is framed between the central fight and flank pressure, refusing a full recall."],
  ],
  Shot032E: [
    ["A", "Black Eagles shift sideways", "The Blue Lions push forces the Black Eagles to move laterally out of their original clean formation."],
    ["B", "Golden Deer cover compressed", "That sideways movement eats into Claude and Hilda's safe thicket shooting space."],
    ["C", "First entanglement", "Blue Lions flank holders, Black Eagles mobile pressure, and Golden Deer side group collide around adjacent barriers."],
    ["D", "Still readable", "The frame keeps two nearby battle lines readable instead of making a single crowd pile."],
  ],
  Shot033D: [
    ["A", "Manuela on heal tile", "Manuela is visible as a beautiful adult teacher on the raised support position, not an abstract map marker."],
    ["B", "Ingrid closes", "Ingrid enters with disciplined lance movement, cutting off Manuela's easiest retreat route."],
    ["C", "Support link snaps", "The healing angle from Manuela to Hanneman's platform weakens as Ingrid forces her step off the tile."],
    ["D", "Dimitri route opens", "Dimitri and Dedue can now start the stair push toward the teachers."],
  ],
  Shot034D: [
    ["A", "Hanneman casting angle", "Hanneman raises wind/Sagittae from the elevated heal-tile position while Ashe suppresses his line."],
    ["B", "Byleth intercepts", "Byleth cuts into the spell angle with training-steel precision, stopping the support system rather than injuring the teacher."],
    ["C", "Dimitri contains", "Dimitri arrives with weapon lowered enough to show restraint and victory control."],
    ["D", "Rout signal", "Manuela has stepped off the tile and the remaining students lower weapons, making the rout cinematic and clear."],
  ],
};

function extractBeat(prompt) {
  const match = String(prompt || "").match(/Frame content: ([\s\S]*?)\n\nCharacters/);
  return match ? match[1].trim() : "";
}

function referencesFor(requiredCharacters) {
  return (requiredCharacters || [])
    .filter((name) => characterAssets[name])
    .map((name) => ({
      name,
      phase: "academy",
      asset: characterAssets[name],
      continuity_note: roleNotes[name] || "Use selected character asset as face, hair, and costume reference.",
    }));
}

function defaultSubframes(entry) {
  const beat = extractBeat(entry.production_prompt) || entry.title;
  const chars = (entry.required_characters || []).slice(0, 5).join(", ");
  return [
    ["A", "Entry geography", `Establish the exact geography for ${entry.title}: ${beat}`],
    ["B", "Action peak", `Show the tactical peak with ${chars || "the visible squad"} using their locked character assets and academy costumes.`],
    ["C", "Reaction / cut point", "End on the reaction or reposition that motivates the next shot while preserving screen direction."],
  ];
}

function subframesFor(entry) {
  const source = specialSubframes[entry.shot] || defaultSubframes(entry);
  const references = referencesFor(entry.required_characters);
  return source.map(([suffix, title, description]) => ({
    id: `${entry.shot}.${suffix}`,
    title,
    status: "needs_production_raster_keyframe",
    output_keyframe: `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/${entry.shot}_${suffix}_keyframe.png`,
    description,
    character_reference_assets: references,
    continuity_rules: [
      "Use listed selected.png character assets as face, hair, age, and costume references.",
      "Keep the canon-map geography continuous across adjacent subframes.",
      "No SVG, no map labels, no UI, no small training-yard composition.",
    ],
  }));
}

function appendReferenceBlock(prompt, refs) {
  const block = [
    "Character asset reference requirement:",
    ...refs.map((ref) => `- ${ref.name}: ${ref.asset}; ${ref.continuity_note}`),
    "The generated face, hairstyle, age impression, costume silhouette, and color accents must remain continuous with these selected.png assets across all subframes.",
  ].join("\n");
  if (prompt.includes("Character asset reference requirement:")) return prompt;
  return `${prompt}\n\n${block}`;
}

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const augmented = queue.map((entry) => {
  const refs = referencesFor(entry.required_characters);
  return {
    ...entry,
    character_reference_assets: refs,
    subframes: subframesFor(entry),
    production_prompt: appendReferenceBlock(entry.production_prompt, refs),
    acceptance_criteria: [
      ...(entry.acceptance_criteria || []),
      "Every visible named character matches the listed selected.png character reference asset.",
      "Main shot and subframes preserve face, hair, age, costume, and color continuity.",
    ],
  };
});

const totalSubframes = augmented.reduce((sum, entry) => sum + entry.subframes.length, 0);
const md = [
  "# EP02 Scene09 Mock Battle Subframe Plan",
  "",
  "Date: 2026-07-17",
  "",
  `Main shots: ${augmented.length}`,
  `Subframes: ${totalSubframes}`,
  "",
  "Rule: every production keyframe must reference the listed character `selected.png` assets for face, hair, age, costume, and color continuity.",
  "",
  ...augmented.flatMap((entry) => [
    `## ${entry.shot} - ${entry.title}`,
    "",
    `Priority: ${entry.priority}`,
    `Status: ${entry.status}`,
    "",
    "Character references:",
    ...(entry.character_reference_assets.length
      ? entry.character_reference_assets.map((ref) => `- ${ref.name}: \`${ref.asset}\``)
      : ["- No named character reference assets assigned; use geography-only production framing."]),
    "",
    "Subframes:",
    ...entry.subframes.map((subframe) => `- ${subframe.id} ${subframe.title}: ${subframe.description}`),
    "",
  ]),
].join("\n");

const queueMd = [
  "# EP02 Scene09 Production Keyframe Queue",
  "",
  "Date: 2026-07-17",
  "",
  `Main shots: ${augmented.length}`,
  `Subframes: ${totalSubframes}`,
  "",
  "P0 rule: no Scene09 payload is production-ready while it points to SVG tactical maps or old `p1_mock_battle_v1` raster frames.",
  "Continuity rule: each named character must follow the listed `selected.png` asset reference for face, hair, age, costume, and color accents.",
  "",
  ...augmented.flatMap((entry) => [
    `## ${entry.shot} - ${entry.title}`,
    "",
    `Status: ${entry.status}`,
    `Priority: ${entry.priority}`,
    `Output keyframe: \`${entry.output_keyframe}\``,
    `Output start frame: \`${entry.output_start_frame}\``,
    `Source layout/current frame: \`${entry.source_layout || entry.current_keyframe || ""}\``,
    "",
    "Character reference assets:",
    ...(entry.character_reference_assets.length
      ? entry.character_reference_assets.map((ref) => `- ${ref.name}: \`${ref.asset}\` - ${ref.continuity_note}`)
      : ["- None"]),
    "",
    "Subframes:",
    ...entry.subframes.map((subframe) => `- ${subframe.id}: ${subframe.description} -> \`${subframe.output_keyframe}\``),
    "",
    "Acceptance:",
    ...(entry.acceptance_criteria || []).map((criterion) => `- ${criterion}`),
    "",
  ]),
].join("\n");

fs.writeFileSync(queuePath, `${JSON.stringify(augmented, null, 2)}\n`);
fs.writeFileSync(subframeJsonPath, `${JSON.stringify({
  date: "2026-07-17",
  main_shots: augmented.length,
  subframes: totalSubframes,
  shots: augmented.map((entry) => ({
    shot: entry.shot,
    title: entry.title,
    priority: entry.priority,
    character_reference_assets: entry.character_reference_assets,
    subframes: entry.subframes,
  })),
}, null, 2)}\n`);
fs.writeFileSync(subframeMdPath, md);
fs.writeFileSync(queueMdPath, md.includes("undefined") ? queueMd : queueMd);

console.log(`updated ${queuePath}`);
console.log(`wrote ${subframeJsonPath}`);
console.log(`wrote ${subframeMdPath}`);
console.log(`wrote ${queueMdPath}`);
console.log(`main shots ${augmented.length}, subframes ${totalSubframes}`);
