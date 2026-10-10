const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const generatedAt = new Date().toISOString();

const batch = [
  ["Mizuki", "Mizuki", 69, "Mizuki.png", "soft eerie sea-born beauty, gentle smile with alien distance", "androgynous young adult man, delicate calm face, uncanny softness without childlike proportions", ["blue/teal hair and sea-creature silhouette cues", "dark blue-white flowing caster/support outfit", "umbrella/jellyfish/sea-born prop language", "relaxed floating posture without idol sweetness", "wet silk, translucent trim, and bioluminescent restraint"], "generic cute idol, childlike face, losing sea-born uncanny identity"],
  ["Carnelian", "Carnelian", 70, "Carnelian.png", "desert noble caster, composed dangerous warmth", "young adult woman around 18-22, beautiful confident face, controlled Sargon authority without visible aging", ["dark hair and horn/sand-caster silhouette", "black/red/gold Sargon desert outfit", "staff/shield-caster prop language", "upright composed posture", "heavy cloth, jewelry, leather, and sun-worn metal"], "generic belly-dancer, oversexualized desert queen, losing caster authority"],
  ["Ceobe", "Ceobe", 71, "Ceobe.png", "feral hungry wanderer, doglike eager danger", "young adult woman, lively feral face, not childlike, energetic and rough", ["light hair and Perro ear silhouette", "rugged orange/brown adventurer outfit", "large axe/spear/weapon bundle cues", "eager forward posture", "patched travel fabric and worn leather"], "childlike mascot, cute schoolgirl, losing weapon-hoarder adventurer identity"],
  ["Saga", "Saga", 72, "Saga.png", "earnest wandering monk, loud disciplined kindness", "young adult woman around 18-22, bright sincere beautiful face, martial monk confidence", ["dark hair and dog-ear silhouette", "black/red/white monk-warrior outfit", "naginata/spear weapon silhouette", "upright honest martial stance", "temple cloth, beads, leather, and practical wraps"], "generic shrine maiden, childish monk, losing spear monk identity"],
  ["Archetto", "Archetto", 73, "Archetto.png", "cheerful Laterano archer nun, bright precision", "young adult woman around 18-22, optimistic focused beautiful face, energetic but grounded", ["pink/red hair and Sankta halo cues", "black/white/red nun-archer outfit", "bow/crossbow silhouette", "light ready archer posture", "church cloth and practical leather"], "generic magical girl, idol nun, losing archer/Sankta identity"],
  ["Eunectes", "Eunectes", 74, "Eunectes.png", "jungle mechanic chief, powerful and practical", "young adult woman around 18-22, beautiful strong face and sturdy athletic build, direct engineering confidence", ["dark hair and reptile/tribal mechanic cues", "tan/green/orange jungle engineer outfit", "large mechanical rig/tool or heavy weapon silhouette", "solid grounded stance", "canvas, leather, oil, and worn machine metal"], "generic jungle pinup, soft idol face, losing mechanic chief weight"],
  ["Magallan", "Magallan", 75, "Magallan.png", "polar explorer engineer, cheerful field scientist", "young adult woman around 18-22, open clever pretty face, cold-weather curiosity", ["orange/red hair and penguin/explorer silhouette", "white/orange/black polar suit", "drone/device pack cues", "expedition-ready stance", "down fabric, polymer, ice-worn equipment"], "generic ski model, childlike explorer, losing drone scientist identity"],
  ["Aak", "Aak", 76, "Aak.png", "reckless back-alley medic, sly experimental trouble", "young adult man around 18-22, sharp mischievous handsome face, alley-cat medical chaos", ["green hair and feline medic cues", "black/green street-medical outfit", "syringe gun/medical device prop", "slouching clever posture", "rubber gloves, medical tools, streetwear fabric"], "generic mad scientist, boy-band rogue, losing street medic identity"],
  ["Schwarz", "Schwarz", 77, "Schwarz.png", "professional bodyguard sniper, severe young-adult control", "young adult woman around 18-22, tan beautiful severe face, disciplined protective danger without older age lines", ["dark hair and feline sniper silhouette", "black/white/tactical bodyguard outfit", "large crossbow/sniper weapon", "still guarded posture", "matte tactical fabric and leather"], "generic catgirl assassin, glamour bodyguard, losing sniper discipline"],
  ["Rosa", "Rosa", 78, "Rosa.png", "melancholic Ursus noble student with heavy weapon", "young adult woman around 18-22, pale beautiful aristocratic sadness, fragile but clearly adult", ["pink/light hair and Ursus bear-ear silhouette", "dark school-noble coat and white/pink accents", "massive harpoon/siege weapon silhouette", "reserved burdened posture", "wool, metal, and cold academy fabric"], "childlike student, generic pink princess, losing heavy weapon burden"],
  ["Hellagur", "Hellagur", 79, "Hellagur.png", "young legendary warrior doctor, dignified battlefield calm without aging", "young adult man around 18-22, handsome white-haired face, composed martial authority expressed through posture not age", ["white hair and general-doctor silhouette cues", "black/white/red long coat or military-medical layers", "long sword/katana silhouette", "calm veteran-like stance without wrinkles", "worn cloth, leather, scars as costume marks only, and matte blade"], "generic old wizard, middle-aged veteran, losing doctor-general identity"],
  ["Lee", "Lee", 80, "Lee.png", "slick Lungmen detective merchant, relaxed sly fox", "young adult man around 18-22, relaxed clever handsome face, stylish but not idol-soft", ["dark hair and draconic/Lungmen silhouette cues", "blue/black/yellow detective-merchant outfit", "umbrella/cane/talisman prop language", "loose confident posture", "tailored fabric, gloves, and city-worn accessories"], "generic casino host, wuxia prince, losing detective merchant identity"],
  ["Swire_the_Elegant_Wit", "Swire the Elegant Wit", 81, "Swire_the_Elegant_Wit.png", "rich Lungmen officer, polished and bossy charm", "young adult woman around 18-22, confident wealthy pretty face, commanding city energy", ["blonde hair and feline officer silhouette", "white/pink/gold urban officer outfit", "handbag/cane/command accessory prop", "assertive upright posture", "luxury fabric, leather, and metal trims"], "generic rich girl, idol secretary, losing officer authority"],
  ["Eyjafjalla_the_Hvit_Aska", "Eyjafjalla the Hvit Aska", 82, "Eyjafjalla_the_Hvit_Aska.png", "adult field researcher medic, gentle volcanic scholar", "clearly adult woman, kind researcher face, soft but not childlike", ["light hair and sheep horn silhouette", "white/brown/orange field-research outfit", "medical/caster staff and research bag cues", "gentle practical stance", "field coat, wool, leather, and research tools"], "childlike volcanologist, doll face, losing adult field researcher identity"],
  ["Jessica_the_Liberated", "Jessica the Liberated", 83, "Jessica_the_Liberated.png", "liberated operator, anxious courage turning steady", "young adult woman around 18-22, worried but determined pretty face, grounded tactical growth", ["brown/blonde hair and feline/Blacksteel cues", "tan/black tactical outfit with jacket", "firearm/shield/field gear silhouette", "cautious ready posture", "canvas, armor plates, and worn equipment"], "generic scared soldier, idol catgirl, losing Blacksteel operator identity"],
  ["Vigil", "Vigil", 84, "Vigil.png", "young Siracusan family leader, controlled fragile authority", "adult young man, proud tense face, aristocratic underworld pressure", ["dark hair and wolf/Siracusa silhouette", "black/white/red formal tactical outfit", "cane/gun/command prop language", "upright guarded posture", "tailored fabric, leather, and restrained luxury"], "boy-band mafia heir, generic vampire youth, losing Siracusan leader identity"],
  ["Silence_the_Paradigmatic", "Silence the Paradigmatic", 85, "Silence_the_Paradigmatic.png", "young Rhine Lab researcher, protective and exhausted without visible aging", "young adult woman around 18-22, tired intelligent beautiful face, quiet medical authority without wrinkles", ["light hair and owl/Rhine Lab silhouette cues", "white/brown/orange lab-field outfit", "drone/medical device prop", "protective composed posture", "lab fabric, tech polymer, and soft worn layers"], "generic nurse, doll scientist, losing Rhine Lab researcher identity"],
  ["Viviana", "Viviana", 86, "Viviana.png", "Leithanien candle knight, elegant luminous duelist", "young adult woman around 18-22, refined serious beautiful face, romantic but disciplined", ["blonde/light hair and knight-caster silhouette", "white/gold/red candle-knight outfit", "rapier/candle Arts prop language", "poised duelist posture", "velvet, metal, wax-light glow restrained"], "generic princess knight, wedding dress, losing candle duelist identity"],
  ["Lumen", "Lumen", 87, "Lumen.png", "gentle Iberian medic, anxious maritime kindness", "young adult man around 18-22, soft earnest handsome face, not overly idolized", ["dark/light hair and Iberian medic silhouette", "blue/white/black medic-seafarer outfit", "lantern/medical staff/tool prop", "careful modest posture", "sea-worn fabric, leather, and brass"], "generic sailor boy, idol healer, losing medic maritime identity"],
  ["Gladiia", "Gladiia", 88, "Gladiia.png", "Abyssal Hunter captain, aristocratic lethal poise", "young adult woman around 18-22, pale beautiful severe face, cold elegant authority without older age", ["white/silver hair and Abyssal Hunter silhouette", "black/white/red long coat or dress-combat outfit", "spear/harpoon weapon silhouette", "still aristocratic predator stance", "sea-worn leather, cloth, and polished weapon"], "generic white-haired noble, soft idol face, losing hunter spear identity"],
  ["Lessing", "Lessing", 89, "Lessing.png", "Ursus wandering swordsman, wounded youthful resolve", "adult young man, earnest scarred face, grounded survivor", ["dark hair and Ursus travel-warrior silhouette", "brown/black/red rugged outfit", "sword and travel pack cues", "alert survivor posture", "wool, leather, and snow-worn fabric"], "generic young knight, boy-band swordsman, losing Ursus wanderer identity"],
  ["Civilight_Eterna", "Civilight Eterna", 90, "Civilight_Eterna.png", "ethereal ancient light, solemn priestly warmth", "young adult woman around 18-22, serene luminous beautiful face, otherworldly but grounded", ["white/light hair and ceremonial silhouette", "white/gold/blue ethereal robe outfit", "staff/light-caster prop language", "calm solemn posture", "fine cloth, metal, and restrained glow"], "generic angel queen, overglowing goddess, losing operator costume identity"],
  ["Pepe", "Pepe", 91, "Pepe.png", "bold Sargon treasure hunter, playful noble confidence", "young adult woman around 18-22, lively confident pretty face, adventurer glamour grounded", ["pink/red hair and Sargon adventurer silhouette", "gold/white/red desert treasure-hunter outfit", "large hammer/staff or artifact prop", "playful ready stance", "jewelry, cloth, leather, and desert dust"], "generic belly dancer, pinup adventurer, losing treasure hunter identity"],
  ["Narantuya", "Narantuya", 92, "Narantuya.png", "grassland huntress, proud fast-moving confidence", "young adult woman around 18-22, sharp sunlit beautiful face, nomadic hunter authority", ["dark hair and grassland animal-ear silhouette", "red/black/white nomadic hunter outfit", "bow/sword/ranged prop language", "ready wind-swept posture", "fur, leather, cloth, and steppe dust"], "generic fantasy archer, glamour rider, losing nomadic hunter identity"],
  ["Marcille", "Marcille", 93, "Marcille.png", "elf mage guest operator, anxious brilliant spellcaster", "young adult elf woman around 18-22, expressive intelligent pretty face, comedic anxiety but realistic", ["blonde hair and pointed elf-ear silhouette", "blue/white mage outfit from reference", "staff/book magic prop", "alert worried caster posture", "linen, wool, leather, and travel-worn gear"], "generic high elf queen, childlike mage, losing anxious adventurer identity"]
];

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${text.trim()}\n`);
}

function bullet(lines) {
  return lines.map((line) => `- ${line}`).join("\n");
}

for (const [slug, name, rank, sourceFile, seed, face, locks, avoid] of batch) {
  const dir = path.join(root, slug);
  const refFile = `wiki_terra_${slug.toLowerCase()}_base.png`;
  const refPath = `references/${refFile}`;
  const sourceUrl = `https://arknights.wiki.gg/wiki/Special:Redirect/file/${encodeURIComponent(sourceFile)}`;

  write(path.join(dir, "source_links.md"), `# ${name} Source Links

Status: \`reference_ready_pending_generation\`

Primary costume reference:

- Local file: \`${refPath}\`
- Source URL: \`${sourceUrl}\`
- Source type: Arknights Terra Wiki / wiki.gg official operator art or page-confirmed image asset.
- Use: base/default skin costume authority for live-action translation.

Collection notes:

- Downloaded/validated for the remaining six-star continuation batch.
- Do not substitute alternate skins unless a separate candidate folder and review are created for that outfit.
- If the reference file is not a real PNG, generation is blocked.
`);

  write(path.join(dir, "source_metadata.md"), `# ${name} Source Metadata

Generated: ${generatedAt}

Primary reference path: \`${refPath}\`

Expected file type: PNG

Reference status: \`format_validated\`

Reference authority:

- Costume and silhouette authority: \`${refPath}\`
- Ranking source status: provisional/manual, not an official popularity poll.
- Roster source status: needs verification against the current official six-star roster.

Production warning:

- This file proves only source intent. It does not approve a generated candidate.
- Candidate promotion still requires visual QA against the reference, face differentiation, artifact checks, and downstream prompt usability.
`);

  write(path.join(dir, "identity_locks.md"), `# ${name} Identity Locks

Character: ${name}

Rarity: 6-star

Popularity rank v0: ${rank}

Role in this project: Arknights live-action character asset candidate.

Reference authority: \`${refPath}\`

Global casting authority: \`CASTING_STYLE_BIBLE.md\`

Global realism authority: \`REALISM_STYLE_BIBLE.md\`

## Casting Lock

All operators in this project must look like young adult performers around 18-22: beautiful, clearly adult, natural, and distinct. Authority, nobility, military experience, medical competence, or veteran status must come from costume, expression, posture, props, and lighting, never from making the face look middle-aged or elderly.

## Realism Lock

The candidate must read as a real actor in a practical live-action wardrobe fitting or production still: natural skin texture, slight facial asymmetry, real hair fibers, sewn fabric, visible seams, weighted cloth, functional fasteners, grounded lighting, and usable costume construction. Pretty cosplay posters, idol/fashion editorials, porcelain AI faces, over-polished fantasy promo art, and repeated sameface beauty templates fail this gate even if the outfit is attractive.

## Face Lock

Face/read: ${face}.

Beauty/personality type: ${seed}.

AI risks: sameface, waxy skin, plastic wig, cosplay fabric, older/middle-aged casting, childlike idol read, fashion-model pose that erases the operator's job and silhouette, fantasy poster lighting, impossible garment construction, glossy AI skin.

Must not resemble: any currently selected operator face.

## Must Preserve

${bullet(locks)}

## Live-Action Translation

- What becomes realistic: skin texture, hair fibers, fabric weight, prop materials, seams, weathering, and set lighting.
- What remains character-locked: face type, hair silhouette, costume color blocks, signature props, faction/role read, and posture.
- What must not become generic: ${avoid}.

## Review Status

Status: \`reference_ready_pending_generation\`

Reviewer instruction:

- Do not create \`selected.png\` unless a generated candidate passes reference, costume, face differentiation, realism, artifact, and downstream usability QA.
`);

  write(path.join(dir, "usage_notes.md"), `# ${name} Usage Notes

Production use status: \`reference_ready_pending_generation\`

Primary reference:

- \`${refPath}\`

## Downstream Locks

Use future selected ${name} assets in storyboards/video prompts only with these locks:

${bullet(locks)}

## Prohibited Drift

- Do not use candidate images as production identity until \`selected.png\` exists.
- Do not switch to a different skin/costume without a separate reference audit and candidate directory.
- Do not smooth the face into the same default AI beauty type as other selected operators.
- Do not let practical live-action realism erase the official costume silhouette.
- Do not use fantasy poster lighting, cosplay convention styling, porcelain AI skin, or fashion-editorial posing as the default production look.
`);

  write(path.join(dir, "COSTUME_REFERENCE_AUDIT.md"), `# ${name} Costume Reference Audit

Reference file: \`${refPath}\`

Status: \`pending_candidate_review\`

## Required Checks Before Selection

${bullet(locks.map((lock) => `Pass/fail: ${lock}`))}
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: image reads as a real actor wardrobe fitting or grounded production still, not AI art, cosplay glamour, or fantasy poster.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is attractive but not recognizably ${name}.
- Block if the image hides the character-defining costume or prop silhouette.
- Block if the image is pretty but does not look like a real actor in practical wardrobe.
`);
}

console.log(`Wrote identity/source docs for ${batch.length} operators.`);
