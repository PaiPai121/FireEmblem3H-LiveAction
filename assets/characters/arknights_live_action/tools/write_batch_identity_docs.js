const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const generatedAt = new Date().toISOString();

const batch = [
  {
    slug: "Chen_the_Holungday",
    name: "Ch'en the Holungday",
    rank: 6,
    refFile: "wiki_terra_chen_the_holungday_base.png",
    sourceFile: "Ch%27en_the_Holungday.png",
    seed: "relaxed vacation confidence with athletic elegance",
    face: "young adult Asian woman, athletic build, sharp direct eyes, calm disciplined expression softened by resort confidence",
    locks: [
      "blue-black hair translated realistically with clean length and controlled styling",
      "summer tactical-swimwear silhouette from the reference, not default Ch'en uniform",
      "white, navy, black, and red/orange accent palette",
      "water-gun/cannon silhouette and beach-tactical accessories when visible",
      "confident police-captain composure even in a relaxed outfit"
    ],
    avoid: "generic swimsuit model, over-sexualized styling, losing the tactical harness structure, wrong red dress Ch'en outfit"
  },
  {
    slug: "Kaltsit",
    name: "Kal'tsit",
    rank: 7,
    refFile: "wiki_terra_kaltsit_base.png",
    sourceFile: "Kal%27tsit.png",
    seed: "cool, intelligent, restrained, clinical elegance",
    face: "mature pale woman, severe calm gaze, clinical intelligence, minimal visible emotion",
    locks: [
      "long light green hair with clean medical-science styling",
      "white and black Rhodes Island medical coat silhouette",
      "green/teal medical accents and restrained technical details",
      "upright posture with quiet authority",
      "no glamour smile; expression should feel observant and unamused"
    ],
    avoid: "teen idol face, fashion doctor costume, soft romantic styling, sameface beauty-template"
  },
  {
    slug: "Logos",
    name: "Logos",
    rank: 8,
    refFile: "wiki_terra_logos_base.png",
    sourceFile: "Logos.png",
    seed: "pale, precise, mystical, intellectual elegance",
    face: "androgynous handsome young man, pale refined features, calm occult-scholar stare",
    locks: [
      "white or very pale hair with polished long styling",
      "black formal caster outfit with gold and white ritual detail",
      "elegant Sarkaz/ritual silhouette from the base art",
      "slender controlled body language",
      "mystical, aristocratic, quiet presence"
    ],
    avoid: "generic fantasy prince, heavy armor, warm cheerful expression, masculine action-hero bulk"
  },
  {
    slug: "Mlynar",
    name: "Mlynar",
    rank: 9,
    refFile: "wiki_terra_mlynar_base.png",
    sourceFile: "M%C5%82ynar.png",
    seed: "tired, mature, handsome, disillusioned authority",
    face: "mature tired handsome man, weathered noble face, low patience, office-worn disillusionment",
    locks: [
      "blond/light hair and equine/Kuranta silhouette translated subtly",
      "brown tan businesslike coat and worn knightly layers",
      "practical sword-bearing noble-worker posture",
      "muted Kazimierz palette, not shiny hero armor",
      "expression reads tired and dangerous, not heroic grin"
    ],
    avoid: "young idol face, generic knight armor, clean fantasy prince, cheerful expression"
  },
  {
    slug: "Degenbrecher",
    name: "Degenbrecher",
    rank: 10,
    refFile: "wiki_terra_degenbrecher_base.png",
    sourceFile: "Degenbrecher.png",
    seed: "strong, composed, knightly, severe beauty",
    face: "mature athletic woman, hard calm eyes, mountain mercenary discipline",
    locks: [
      "black and white hair impression with strong horn/silhouette cues",
      "dark fitted Kjerag combat outfit with pale fur/trim accents",
      "large sword/blade silhouette when visible",
      "compact power, shoulders grounded, no runway pose",
      "austere alpine/duelist feeling"
    ],
    avoid: "soft idol face, generic armor bikini, losing her heavy blade identity, over-polished cosplay"
  },
  {
    slug: "Ling",
    name: "Ling",
    rank: 11,
    refFile: "wiki_terra_ling_base.png",
    sourceFile: "Ling.png",
    seed: "mature, poetic, relaxed, wine-warm elegance",
    face: "mature Chinese woman, languid amused eyes, wine-warmed poetic confidence",
    locks: [
      "long blue hair and Sui dragon details",
      "flowing blue-black robes with gold and white accents",
      "wine gourd/cup or literary-prop language when practical",
      "relaxed reclined or loose standing posture",
      "ancient Chinese poetic elegance translated to real fabric"
    ],
    avoid: "generic xianxia costume, childish face, stiff palace pose, removing dragon/Sui identity"
  },
  {
    slug: "Dusk",
    name: "Dusk",
    rank: 13,
    refFile: "wiki_terra_dusk_base.png",
    sourceFile: "Dusk.png",
    seed: "ethereal, introverted, painterly, distant beauty",
    face: "young adult Chinese woman, reserved distant eyes, painterly melancholy",
    locks: [
      "black/dark hair with subtle colored accents",
      "ink-painter Sui silhouette with robe layers and art tools",
      "black, white, ink-blue, and red accent palette",
      "quiet withdrawn posture, not performer energy",
      "brush, ink, scroll, or painterly prop language when visible"
    ],
    avoid: "generic hanfu model, cheerful smile, too much fantasy glow, losing painter identity"
  },
  {
    slug: "Shu",
    name: "Shu",
    rank: 14,
    refFile: "wiki_terra_shu_base.png",
    sourceFile: "Shu.png",
    seed: "warm agricultural divinity, gentle and grounded",
    face: "young adult Chinese woman, gentle grounded face, warm attentive eyes",
    locks: [
      "Sui sibling cues with long styled hair and subtle dragon-like ornamentation",
      "green, cream, earth, and harvest-color outfit language",
      "agricultural/grain/field divinity impression rather than palace-only glamour",
      "soft but capable posture",
      "organic fabric textures, embroidered details, grounded warmth"
    ],
    avoid: "generic green hanfu, idol sameface, over-mature goddess styling, losing harvest motif"
  },
  {
    slug: "SilverAsh",
    name: "SilverAsh",
    rank: 15,
    refFile: "wiki_terra_silverash_base.png",
    sourceFile: "SilverAsh.png",
    seed: "refined, aristocratic, calculating presence",
    face: "handsome mature man, silver hair, aristocratic control, calculating calm",
    locks: [
      "silver hair and snow-leopard/Kjerag noble cues",
      "white, black, and blue aristocratic coat with fur trim",
      "cane/sword/bird-master authority when visible",
      "tall poised businessman-warlord posture",
      "controlled smile or unreadable expression"
    ],
    avoid: "generic CEO suit, fantasy king armor, warm heroic grin, losing Kjerag fur silhouette"
  },
  {
    slug: "Thorns",
    name: "Thorns",
    rank: 17,
    refFile: "wiki_terra_thorns_base.png",
    sourceFile: "Thorns.png",
    seed: "aloof Iberian swordsman-scientist, sharp and sun-browned",
    face: "young adult tan man, angular features, aloof observant stare, calm irritation",
    locks: [
      "dark spiky hair and Iberian/Aegir sea-linked silhouette cues",
      "black and yellow tactical coat/outfit language",
      "sword and compact combat-scientist gear when visible",
      "lean precise swordsman posture",
      "sun-browned realistic skin tone, not pale sameface"
    ],
    avoid: "generic anime boy, pale idol face, ornate medieval knight, losing yellow-black identity"
  },
  {
    slug: "Bagpipe",
    name: "Bagpipe",
    rank: 18,
    refFile: "wiki_terra_bagpipe_base.png",
    sourceFile: "Bagpipe.png",
    seed: "sunny rural athletic charm, honest and bright",
    face: "young athletic woman, lively honest smile, bright practical countryside energy",
    locks: [
      "red/orange hair and horn/Vouivre silhouette cues",
      "military-farm tactical outfit with green/khaki and orange accents",
      "large lance/weapon silhouette when visible",
      "open, energetic, grounded stance",
      "not fragile or doll-like; farm-strong athletic realism"
    ],
    avoid: "generic cute idol, glossy fashion armor, losing lance silhouette, overdelicate face"
  },
  {
    slug: "Mudrock",
    name: "Mudrock",
    rank: 19,
    refFile: "wiki_terra_mudrock_base.png",
    sourceFile: "Mudrock.png",
    seed: "quiet strength, hidden softness, armored loneliness",
    face: "young adult woman with reserved calm, physically strong but gentle underneath",
    locks: [
      "massive armor silhouette remains central",
      "dark heavy protective suit with white/gray hair glimpses if helmet open",
      "huge hammer/defender weight language when visible",
      "lonely, guarded posture",
      "materials must feel heavy and practical, not plastic costume"
    ],
    avoid: "thin fashion armor, uncovered generic beauty with no armor identity, shiny toy plating, cute-idol mood"
  },
  {
    slug: "Saria",
    name: "Saria",
    rank: 20,
    refFile: "wiki_terra_saria_base.png",
    sourceFile: "Saria.png",
    seed: "mature, severe, protective, controlled authority",
    face: "mature woman, strong jaw, controlled eyes, protective executive-scientist authority",
    locks: [
      "short light hair with stern Rhine Lab identity",
      "white black orange armored lab/security suit",
      "shield/defender silhouette when visible",
      "broad-shouldered grounded posture",
      "unshowy authority, not glamorous softness"
    ],
    avoid: "young idol face, generic lab coat, soft smile, losing armored defender silhouette"
  },
  {
    slug: "Eyjafjalla",
    name: "Eyjafjalla",
    rank: 21,
    refFile: "wiki_terra_eyjafjalla_base.png",
    sourceFile: "Eyjafjalla.png",
    seed: "gentle volcanologist, fragile but serious scholar warmth",
    face: "young adult woman, soft scholarly face, earnest and slightly shy",
    locks: [
      "light hair with Caprinae horn silhouette translated subtly",
      "warm brown, cream, red/orange caster outfit from reference",
      "staff/geology/volcano-research prop language when visible",
      "small serious posture, not fashion-model confidence",
      "scientist warmth with latent volcanic power"
    ],
    avoid: "childlike loli read, generic mage robe, sameface influencer, losing horn/staff cues"
  },
  {
    slug: "Blaze",
    name: "Blaze",
    rank: 22,
    refFile: "wiki_terra_blaze_base.png",
    sourceFile: "Blaze.png",
    seed: "hot-blooded athletic operator, wild confident warmth",
    face: "young athletic woman, confident grin, warm reckless frontline energy",
    locks: [
      "dark hair with red accents and Feline silhouette cues",
      "black Rhodes combat outfit with orange/red industrial accents",
      "chainsaw/large weapon silhouette when visible",
      "muscular practical body language",
      "sweaty frontline realism, not glossy model polish"
    ],
    avoid: "generic leather catsuit, over-sexualized biker styling, losing chainsaw identity, sameface"
  },
  {
    slug: "Nearl_the_Radiant_Knight",
    name: "Nearl the Radiant Knight",
    rank: 23,
    refFile: "wiki_terra_nearl_the_radiant_knight_base.png",
    sourceFile: "Nearl_the_Radiant_Knight.png",
    seed: "radiant knightly dignity, warm heroic strength",
    face: "young adult noble woman, golden hair, calm heroic kindness with knightly resolve",
    locks: [
      "gold/blond hair and Kuranta knight silhouette",
      "radiant white/gold Kazimierz armor and cloak language",
      "lance/sword knight weapon silhouette when visible",
      "upright heroic posture, open but firm expression",
      "warm light without becoming angelic generic cosplay"
    ],
    avoid: "generic paladin armor, fashion princess face, overly shiny plastic gold, losing Kazimierz identity"
  },
  {
    slug: "Horn",
    name: "Horn",
    rank: 24,
    refFile: "wiki_terra_horn_base.png",
    sourceFile: "Horn.png",
    seed: "Victorian artillery officer, stern and dependable",
    face: "young mature woman, disciplined officer expression, tired but resolute",
    locks: [
      "red/orange hair and horned commander silhouette",
      "Victorian military coat and artillery/tactical gear",
      "large cannon/shield-lance silhouette when visible",
      "command posture under pressure",
      "uniform details feel tailored and worn, not parade costume only"
    ],
    avoid: "generic military cosplay, soft idol smile, losing artillery identity, wrong modern soldier outfit"
  },
  {
    slug: "Ines",
    name: "Ines",
    rank: 25,
    refFile: "wiki_terra_ines_base.png",
    sourceFile: "Ines.png",
    seed: "sharp mercenary elegance, guarded and unreadable",
    face: "young woman, sharp eyes, guarded intelligence, slightly cynical calm",
    locks: [
      "dark hair with distinctive red/orange accents from reference",
      "sleek black mercenary outfit with red details",
      "dagger/shadow-assassin silhouette when visible",
      "watchful half-turned posture",
      "elegant but dangerous, not fashion-villain camp"
    ],
    avoid: "generic spy catsuit, glamorous smile, losing Sarkaz/mercenary cues, sameface"
  },
  {
    slug: "Typhon",
    name: "Typhon",
    rank: 26,
    refFile: "wiki_terra_typhon_base.png",
    sourceFile: "Typhon.png",
    seed: "quiet hunter power, distant wilderness focus",
    face: "young woman, calm distant hunter eyes, practical wilderness seriousness",
    locks: [
      "long pale hair and Sarkaz horn/silhouette cues",
      "hunter outfit with fur, straps, and cold-region practicality",
      "large bow/crossbow weapon silhouette when visible",
      "still predatory posture",
      "muted wilderness palette, no glossy idol styling"
    ],
    avoid: "generic archer princess, soft fashion face, losing massive weapon silhouette, shiny cosplay"
  },
  {
    slug: "Virtuosa",
    name: "Virtuosa",
    rank: 27,
    refFile: "wiki_terra_virtuosa_base.png",
    sourceFile: "Virtuosa.png",
    seed: "dangerous saintly musician, elegant and unsettling",
    face: "young woman, composed saintly beauty with unsettling calm",
    locks: [
      "white/silver hair with refined Sankta/angelic cues",
      "black and white musician-cleric outfit from reference",
      "instrument/violin/cello-like prop language when visible",
      "graceful performance posture",
      "beauty must feel controlled and slightly dangerous"
    ],
    avoid: "generic idol singer, harmless angel costume, wrong colorful stage dress, sameface"
  },
  {
    slug: "Ascalon",
    name: "Ascalon",
    rank: 28,
    refFile: "wiki_terra_ascalon_base.png",
    sourceFile: "Ascalon.png",
    seed: "older covert blade, severe Rhodes shadow authority",
    face: "mature woman, lean severe face, hidden-knife composure, low-key menace",
    locks: [
      "dark hair and Sarkaz shadow-operator silhouette cues",
      "black covert tactical outfit with restrained red/gray accents",
      "blade/assassin gear language when visible",
      "minimal expression, alert posture",
      "practical stealth materials, not shiny latex"
    ],
    avoid: "young idol face, generic ninja costume, overglam villain styling, losing Rhodes covert identity"
  },
  {
    slug: "Goldenglow",
    name: "Goldenglow",
    rank: 29,
    refFile: "wiki_terra_goldenglow_base.png",
    sourceFile: "Goldenglow.png",
    seed: "pink-haired anxious sweetness with electric caster spark",
    face: "young woman, soft anxious sweetness, nervous smile, bright eyes",
    locks: [
      "pink hair and Feline silhouette cues",
      "light caster outfit with black, white, pink, and yellow accents",
      "small electrical drone/orb language when visible",
      "slightly shy posture, not confident idol stage pose",
      "cute but real human skin and hair texture"
    ],
    avoid: "plastic doll face, generic magical girl, over-childlike read, losing electric-caster details"
  },
  {
    slug: "Chongyue",
    name: "Chongyue",
    rank: 30,
    refFile: "wiki_terra_chongyue_base.png",
    sourceFile: "Chongyue.png",
    seed: "martial elder-brother calm, disciplined Sui strength",
    face: "handsome Chinese man, calm martial focus, composed older-brother warmth",
    locks: [
      "dark hair and Sui dragon/martial silhouette cues",
      "Chinese martial outfit with red, black, white, and gold details",
      "open-handed martial stance or weaponless discipline",
      "strong but relaxed posture",
      "traditional fabric translated realistically, not generic wuxia robe"
    ],
    avoid: "generic kung-fu master costume, fantasy emperor armor, over-young idol face, losing Sui cues"
  },
  {
    slug: "Executor_the_Ex_Foedere",
    name: "Executor the Ex Foedere",
    rank: 31,
    refFile: "wiki_terra_executor_the_ex_foedere_base.png",
    sourceFile: "Executor_the_Ex_Foedere.png",
    seed: "cold immaculate executor, clerical firearm precision",
    face: "handsome young man, blank precise expression, immaculate discipline",
    locks: [
      "white/silver hair with Sankta halo/angelic cues",
      "black and white formal executor coat",
      "gun/shotgun or official firearm silhouette when visible",
      "perfectly composed posture",
      "clerical-lawman authority, no emotional softness"
    ],
    avoid: "generic priest, biker gunman, warm smile, losing Sankta executor identity"
  },
  {
    slug: "Reed_the_Flame_Shadow",
    name: "Reed the Flame Shadow",
    rank: 32,
    refFile: "wiki_terra_reed_the_flame_shadow_base.png",
    sourceFile: "Reed_the_Flame_Shadow.png",
    seed: "quiet flame, fragile resolve, draconic sorrow",
    face: "young woman, delicate serious face, sorrowful resolve, inward fire",
    locks: [
      "red/orange hair and draconic horn/tail silhouette cues",
      "black and red caster outfit with flame-shadow details",
      "staff/flame-medic silhouette when visible",
      "reserved posture, not aggressive warrior grin",
      "warm ember lighting can support but must not hide costume"
    ],
    avoid: "generic fire mage, overconfident villain, losing medic/caster restraint, sameface"
  },
  {
    slug: "Irene",
    name: "Irene",
    rank: 33,
    refFile: "wiki_terra_irene_base.png",
    sourceFile: "Irene.png",
    seed: "serious young inquisitor, compact Iberian resolve",
    face: "young woman, serious compact face, intense sense of duty, restrained emotion",
    locks: [
      "dark hair and Liberi/Iberian silhouette cues",
      "black and white inquisitor outfit with red/gold accents",
      "rapier/sword and hand-cannon/lantern-like prop language when visible",
      "upright compact duelist stance",
      "religious-military severity without fantasy princess styling"
    ],
    avoid: "generic nun, cheerful idol smile, losing inquisitor hat/silhouette, plastic costume"
  },
  {
    slug: "Hoshiguma",
    name: "Hoshiguma",
    rank: 34,
    refFile: "wiki_terra_hoshiguma_base.png",
    sourceFile: "Hoshiguma.png",
    seed: "tall Oni policewoman, relaxed power and streetwise warmth",
    face: "tall athletic mature woman, relaxed confident grin, streetwise police presence",
    locks: [
      "green hair and Oni horn silhouette",
      "Lungmen police/tactical outfit with black, white, and green details",
      "large triangular shield silhouette when visible",
      "big relaxed stance, not dainty",
      "friendly intimidation: strong, casual, dependable"
    ],
    avoid: "small fragile model, generic police costume, losing horn/shield identity, overglossy face"
  },
  {
    slug: "Shining",
    name: "Shining",
    rank: 35,
    refFile: "wiki_terra_shining_base.png",
    sourceFile: "Shining.png",
    seed: "quiet medic swordswoman, pale grave serenity",
    face: "mature pale woman, serene grave expression, kind but distant",
    locks: [
      "long light hair and Sarkaz/medic silhouette cues",
      "white and black long coat/robe with medical-warrior restraint",
      "sword case or concealed blade language when visible",
      "still protective posture",
      "soft clinical light but realistic skin texture"
    ],
    avoid: "generic nun healer, fashion coat only, warm cheerful smile, losing sword-medic tension"
  },
  {
    slug: "Nightingale",
    name: "Nightingale",
    rank: 36,
    refFile: "wiki_terra_nightingale_base.png",
    sourceFile: "Nightingale.png",
    seed: "fragile saintly medic, haunted and gentle",
    face: "young woman, fragile gentle face, haunted calm, delicate but adult",
    locks: [
      "light hair and white medic silhouette",
      "long white/cream healer outfit with soft green/gold accents",
      "staff/cage/lantern-like healing prop language when visible",
      "slightly withdrawn posture",
      "ethereal but not wax doll; real fatigue in the face"
    ],
    avoid: "childlike doll, generic angel healer, overexposed white blur, sameface"
  },
  {
    slug: "Mountain",
    name: "Mountain",
    rank: 37,
    refFile: "wiki_terra_mountain_base.png",
    sourceFile: "Mountain.png",
    seed: "gentle massive gentleman fighter, formal and powerful",
    face: "large powerful mature man, calm gentlemanly face, contained strength",
    locks: [
      "white tiger/Feline silhouette translated with hair, facial structure, and costume cues",
      "formal dark suit-combat outfit with white/gray fur-like accents",
      "boxing/fighter hand posture when visible",
      "large grounded body, not slim idol",
      "polite strength and prison-fighter weight"
    ],
    avoid: "generic bodybuilder, slim fashion model, literal mascot suit, losing gentleman-fighter identity"
  }
];

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.replace(/\n{3,}/g, "\n\n"));
}

function bullet(lines) {
  return lines.map((line) => `- ${line}`).join("\n");
}

for (const item of batch) {
  const dir = path.join(root, item.slug);
  const refPath = `references/${item.refFile}`;
  write(
    path.join(dir, "source_links.md"),
    `# ${item.name} Source Links

Status: \`reference_ready_pending_generation\`

Primary costume reference:

- Local file: \`${refPath}\`
- Source URL: \`https://arknights.wiki.gg/wiki/Special:Redirect/file/${item.sourceFile}\`
- Source type: Arknights Terra Wiki / wiki.gg file redirect.
- Use: base/default skin costume authority for live-action translation.

Collection notes:

- Downloaded/validated for the 30-operator continuation batch.
- Do not substitute alternate skins unless a separate candidate folder and review are created for that outfit.
- If the reference file is not a real PNG, generation is blocked.
`
  );

  write(
    path.join(dir, "source_metadata.md"),
    `# ${item.name} Source Metadata

Generated: ${generatedAt}

Primary reference path: \`${refPath}\`

Expected file type: PNG

Reference status: \`format_validated\`

Reference authority:

- Costume and silhouette authority: \`${refPath}\`
- Ranking source status: provisional/manual, not an official popularity poll.
- Roster source status: needs verification against the current official six-star roster.

Production warning:

- This file proves only source availability. It does not approve a generated candidate.
- Candidate promotion still requires visual QA against the reference, face differentiation, artifact checks, and downstream prompt usability.
`
  );

  write(
    path.join(dir, "identity_locks.md"),
    `# ${item.name} Identity Locks

Character: ${item.name}

Rarity: 6-star

Popularity rank v0: ${item.rank}

Role in this project: Arknights live-action character asset candidate.

Reference authority: \`${refPath}\`

## Face Lock

Face/read: ${item.face}.

Beauty/personality type: ${item.seed}.

AI risks: sameface, waxy skin, plastic wig, cosplay fabric, fashion-model pose that erases the operator's job and silhouette.

Must not resemble: Nian, Wiš'adel, Ch'en, Texas the Omertosa, Exusiai, Surtr, or any other selected operator face.

## Must Preserve

${bullet(item.locks)}

## Live-Action Translation

- What becomes realistic: skin texture, hair fibers, fabric weight, prop materials, seams, weathering, and set lighting.
- What remains character-locked: face type, hair silhouette, costume color blocks, signature props, faction/role read, and posture.
- What must not become generic: ${item.avoid}.

## Review Status

Status: \`reference_ready_pending_generation\`

Reviewer instruction:

- Do not create \`selected.png\` unless a generated candidate passes reference, costume, face differentiation, artifact, and downstream usability QA.
`
  );

  write(
    path.join(dir, "usage_notes.md"),
    `# ${item.name} Usage Notes

Production use status: \`reference_ready_pending_generation\`

Primary reference:

- \`${refPath}\`

## Downstream Locks

Use future selected ${item.name} assets in storyboards/video prompts only with these locks:

${bullet(item.locks)}

## Prohibited Drift

- Do not use candidate images as production identity until \`selected.png\` exists.
- Do not switch to a different skin/costume without a separate reference audit and candidate directory.
- Do not smooth the face into the same default AI beauty type as other selected operators.
- Do not let practical live-action realism erase the official costume silhouette.
`
  );

  write(
    path.join(dir, "COSTUME_REFERENCE_AUDIT.md"),
    `# ${item.name} Costume Reference Audit

Reference file: \`${refPath}\`

Status: \`pending_candidate_review\`

## Required Checks Before Selection

${bullet(item.locks.map((lock) => `Pass/fail: ${lock}`))}
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is merely attractive but not recognizably ${item.name}.
- Block if the image hides the character-defining costume or prop silhouette.
`
  );
}

console.log(`Wrote identity/source docs for ${batch.length} operators.`);
