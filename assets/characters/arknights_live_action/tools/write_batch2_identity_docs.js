const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const generatedAt = new Date().toISOString();

const batch = [
  ["Phantom", "Phantom", 39, "Phantom.png", "pale theatrical assassin, elegant and haunted", "young pale man with refined melancholy and dangerous stage calm", ["silver/white hair and theatrical mask/cape cues", "black and red assassin-performer outfit", "rapier/dagger or stage-prop weapon language", "upright dancer-like posture with menace", "luxury fabric, gloves, and opera-house mystery"], "generic vampire noble, cheerful idol, random fantasy prince, losing assassin-performer identity"],
  ["Mostima", "Mostima", 40, "Mostima.png", "lazy blue-haired Sankta traveler with hidden danger", "adult woman with relaxed eyes, sly sleepy smile, and ancient calm", ["blue hair and subtle halo/wing/Sankta cues", "black-blue-white Laterano traveler outfit", "staff/caster clock-key prop language", "loose relaxed posture, not combat aggression", "mysterious time-worn mood"], "generic blue-haired mage, idol smile, too much magical glow, losing staff/clock identity"],
  ["Passenger", "Passenger", 41, "Passenger.png", "elegant desert scholar-engineer, polished and wary", "handsome adult man, reserved calculating eyes, refined Sargon authority", ["light hair and desert aristocrat-engineer silhouette", "white/gold/black long coat with technical details", "caster device or staff-like engineering prop", "controlled posture and measured arrogance", "dusty refined material realism"], "generic prince, pure mage robe, over-soft face, losing desert-engineer identity"],
  ["Weedy", "Weedy", 42, "Weedy.png", "clean anxious engineer with pressure-cannon gear", "young adult woman, neat serious face, slightly anxious technical focus", ["teal/blue hair and neat engineer silhouette", "Rhodes technical outfit with white/blue/black palette", "large water/pressure cannon or engineering backpack cue", "clean posture, no glamour pose", "sanitized lab-machine material language"], "generic maid or school look, soft idol face, losing cannon/engineer gear"],
  ["Ifrit", "Ifrit", 43, "Ifrit.png", "volatile young pyromaniac patient, rough and fiery", "young adult with rebellious sharp face, volatile but adult read", ["white hair and horn/Ifrit silhouette cues", "black medical-restraint combat outfit with red/orange fire accents", "flamethrower/industrial fire gear", "impatient forward posture", "Rhine/Lab experiment roughness"], "childlike read, cute schoolkid styling, generic fire mage, glamorized fire villain"],
  ["Angelina", "Angelina", 44, "Angelina.png", "gentle courier caster, warm and weightless", "young adult woman, kind optimistic face, modest confidence", ["pink hair and light fox/courier silhouette cues", "black/white/pink messenger-caster outfit", "staff/parcel/anti-gravity prop language", "soft airborne/courier posture without actual flight", "friendly grounded optimism"], "childlike magical girl, generic pink idol, losing courier/caster gear"],
  ["Siege", "Siege", 45, "Siege.png", "streetwise royal lion leader, rough noble strength", "young adult woman, confident tough face, leadership without polish", ["blond hair and royal lion-leader silhouette cues", "black street combat outfit with yellow/gold accents", "hammer or heavy melee weapon cue", "relaxed gang-leader stance", "urban worn materials"], "generic biker girl, delicate princess, losing hammer/leader identity"],
  ["Skadi", "Skadi", 46, "Skadi.png", "quiet Abyssal hunter, lonely oceanic swordswoman", "adult woman, pale calm face, distant oceanic sadness", ["long white/silver hair", "black/white/red Abyssal Hunter outfit", "oversized sword silhouette", "still heavy posture, not fashion posing", "cold sea-hunter mood"], "generic white-haired knight, soft idol face, losing enormous sword and Abyssal silhouette"],
  ["Specter_the_Unchained", "Specter the Unchained", 47, "Specter_the_Unchained.png", "unsettling liberated hunter, elegant madness restrained", "adult woman, pale smile with unstable calm and sharp focus", ["white hair and Abyssal Hunter silhouette", "black/white/red outfit with nun-hunter echoes", "saw/large weapon or chain cue", "graceful unstable posture", "oceanic horror restraint"], "generic nun, cute horror doll, losing weapon and hunter identity"],
  ["Penance", "Penance", 48, "Penance.png", "severe Siracusan judge, elegant lawful pressure", "mature woman, severe judicial face, calm intimidating authority", ["dark hair and wolf/Siracusa silhouette cues", "black/red/white judge-coat outfit", "massive scale/hammer or legal weapon prop", "upright courtroom authority", "heavy tailored fabric and metal"], "generic mafia lady, fashion gown, soft smile, losing judge identity"],
  ["Lin", "Lin", 49, "Lin.png", "Lungmen aristocrat caster, poised and guarded", "young adult Chinese woman, composed elegant face, politically alert", ["dark hair with Lungmen aristocratic styling", "blue/black/white formal caster outfit", "glass/crystal/shield-caster prop language", "poised city-noble stance", "subtle luxury without idol glamour"], "generic qipao model, sameface beauty, losing caster/defensive identity"],
  ["Qiubai", "Qiubai", 50, "Qiubai.png", "wandering swordswoman, quiet martial sorrow", "adult Chinese woman, calm severe face, restrained loneliness", ["long dark hair and wandering swordswoman silhouette", "green/white/black robe-combat outfit", "sword and flowing cloth balance", "still martial stance", "muted jianghu realism"], "generic xianxia model, glamorous smile, losing sword and muted palette"],
  ["Hoederer", "Hoederer", 51, "Hoederer.png", "scarred Sarkaz mercenary commander, tired brutality", "large mature man, scarred tired face, disciplined violence", ["dark hair and Sarkaz horn silhouette", "black/brown mercenary coat and armor layers", "huge blade or heavy weapon cue", "broad exhausted commander posture", "dusty battlefield material wear"], "young idol villain, generic knight, losing scarred mercenary weight"],
  ["Ulpianus", "Ulpianus", 52, "Ulpianus.png", "massive Abyssal hunter captain, oceanic pressure", "large mature man, grave weathered face, calm terrifying restraint", ["white/silver hair and Abyssal Hunter cues", "dark heavy hunter coat with sea-worn details", "massive anchor/harpoon weapon silhouette", "immovable commander stance", "salt-worn leather and metal"], "generic sailor, slim model, losing huge weapon and hunter weight"],
  ["Nymph", "Nymph", 53, "Nymph.png", "delicate occult caster, eerie and composed", "young adult woman, unsettling calm, delicate but adult", ["light hair and occult-caster silhouette", "black/purple/white ritual outfit", "book/doll/ritual prop language from reference", "small composed posture", "eerie restraint without childishness"], "childlike doll, generic goth idol, losing caster props"],
  ["Ray", "Ray", 54, "Ray.png", "wilderness marksman, practical and sunlit", "young adult woman, focused practical face, field-worker calm", ["light hair and Cautus/field marksman cues", "outdoor sniper outfit with earth tones", "large rifle/crossbow/sniper prop", "steady scouting stance", "practical field fabrics"], "generic cowgirl, pinup shooter, losing sniper field gear"],
  ["Zuo_Le", "Zuo Le", 55, "Zuo_Le.png", "young Yan swordsman, proud disciplined official", "young adult Chinese man, sharp serious face, controlled pride", ["dark hair and Yan official-martial silhouette", "red/black/white uniform robe-combat layers", "sword and official token details", "upright disciplined stance", "clean martial bureaucracy"], "generic wuxia prince, soft idol face, losing official-swordsman identity"],
  ["Ela", "Ela", 56, "Ela.png", "modern tactical specialist, compact and alert", "adult woman, sharp alert eyes, practical operator focus", ["short light hair and modern tactical silhouette", "black/green tactical gear from reference", "firearm/trap/device prop language", "compact ready stance", "real-world tactical fabric and armor"], "generic fashion soldier, glossy cosplay, losing tactical gadget identity"],
  ["Ash", "Ash", 57, "Ash.png", "modern breaching commander, focused and practical", "adult woman, stern tactical face, calm command presence", ["dark/blond tactical hair under cap or headset cue", "black/gray FBI-style tactical armor from reference", "rifle/breaching weapon silhouette", "professional ready stance", "grounded military materials"], "generic action model, glamor pose, losing breaching commander identity"],
  ["Kirin_R_Yato", "Kirin R Yato", 58, "Kirin_R_Yato.png", "masked agile hunter, red-black Monster Hunter crossover energy", "adult woman, hidden/partially masked disciplined face, agile severity", ["dark hair and red-black hunter armor silhouette", "Kirin/Rathalos crossover armor cues from reference", "dual blade or fast melee prop", "low agile stance", "practical scale/plate materials"], "generic ninja, ornate fantasy dancer, losing crossover armor silhouette"],
  ["Fiammetta", "Fiammetta", 59, "Fiammetta.png", "fiery Laterano artillery angel, furious discipline", "adult woman, sharp angry eyes, controlled temper", ["red hair and Sankta/halo cues", "black/white/red Laterano artillery outfit", "large gun/cannon or artillery prop", "tense upright stance", "military-church material balance"], "generic red-haired gun girl, idol smile, losing artillery/Laterano identity"],
  ["Dorothy", "Dorothy", 60, "Dorothy.png", "gentle Rhine Lab trap engineer, smiling but precise", "adult woman, soft intelligent face, unsettlingly gentle focus", ["light hair and jerboa/Rhine Lab cues", "white/yellow/brown lab-engineer outfit", "trap/resonator device prop language", "delicate but technical posture", "clean lab fabric and brass tech"], "generic scientist, cute maid, losing trap engineer identity"],
  ["Stainless", "Stainless", 61, "Stainless.png", "Victorian artificer, bright mechanic confidence", "young adult man, cheerful clever face, practical maker energy", ["orange/red hair and workshop silhouette", "black/yellow/white mechanic-artificer outfit", "tool platform or mechanical device prop", "active inventor posture", "worn metal and workshop fabric"], "generic steampunk boy, soft idol face, losing artificer tools"],
  ["Ebenholz", "Ebenholz", 62, "Ebenholz.png", "melancholic Leithanien noble musician, haunted elegance", "young adult man, pale refined face, anxious noble sadness", ["dark hair and horn/noble silhouette cues", "black/white/gold formal musician outfit", "staff/instrument/caster prop", "reserved aristocratic posture", "concert-hall melancholy"], "generic vampire prince, cheerful performer, losing musician-caster identity"],
  ["Gnosis", "Gnosis", 63, "Gnosis.png", "cold Kjerag scientist strategist, severe intellect", "adult man, pale severe face, calculating frost-calm", ["white/silver hair and Kjerag scientist cues", "black/white/blue formal technical outfit", "staff/device/caster prop language", "rigid analytical posture", "cold alpine lab material realism"], "generic ice wizard, warm smile, losing scientist-strategist identity"],
  ["Flametail", "Flametail", 64, "Flametail.png", "bright Kazimierz knight, agile and scrappy", "young adult woman, spirited confident face, street-knight energy", ["red/orange hair and Kuranta knight cues", "red/white/black Kazimierz armor outfit", "sword/shield or knight weapon prop", "agile forward stance", "tournament-worn armor realism"], "generic idol knight, too dainty, losing scrappy knight identity"],
  ["Saileach", "Saileach", 65, "Saileach.png", "Victorian standard-bearer, earnest noble officer", "adult woman, composed earnest face, dignified command warmth", ["blond/light hair and Victorian officer cues", "white/green/black officer uniform", "flag/banner spear or standard prop", "upright public-command stance", "tailored fabric and brass details"], "generic princess soldier, soft fashion model, losing standard-bearer identity"],
  ["Fartooth", "Fartooth", 66, "Fartooth.png", "reserved Kazimierz long-range knight, quiet precision", "adult woman, serious reserved face, patient sniper-knight focus", ["light hair and Kuranta knight cues", "white/black/brown knight-sniper outfit", "large crossbow/bow/sniper weapon", "still long-range stance", "practical tournament gear"], "generic archer princess, losing Kazimierz sniper identity"],
  ["Blemishine", "Blemishine", 67, "Blemishine.png", "warm engineer-knight, gentle optimism and armor craft", "young adult woman, warm earnest face, practical kindness", ["blond hair and Kuranta knight cues", "white/yellow/black mechanic-knight armor", "hammer/shield/mechanic prop language", "open hopeful stance", "polished but practical armor"], "generic paladin girl, childish idol, losing mechanic-knight identity"],
  ["Pallas", "Pallas", 68, "Pallas.png", "Minos priestess warrior, wine-warm and theatrical", "mature woman, confident warm face, graceful warrior-priest energy", ["purple hair and Minos priestess cues", "white/purple/gold ceremonial warrior outfit", "spear/staff and wine/ritual prop language", "relaxed theatrical stance", "cloth, gold, and leather realism"], "generic toga model, oversexualized goddess, losing spear-priestess identity"]
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
  const sourceUrl = `https://arknights.wiki.gg/wiki/Special:Redirect/file/${sourceFile}`;

  write(path.join(dir, "source_links.md"), `# ${name} Source Links

Status: \`reference_ready_pending_generation\`

Primary costume reference:

- Local file: \`${refPath}\`
- Source URL: \`${sourceUrl}\`
- Source type: Arknights Terra Wiki / wiki.gg official operator art or page-confirmed image asset.
- Use: base/default skin costume authority for live-action translation.

Collection notes:

- Downloaded/validated for the second 30-operator continuation batch.
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

- This file proves only source availability. It does not approve a generated candidate.
- Candidate promotion still requires visual QA against the reference, face differentiation, artifact checks, and downstream prompt usability.
`);

  write(path.join(dir, "identity_locks.md"), `# ${name} Identity Locks

Character: ${name}

Rarity: 6-star

Popularity rank v0: ${rank}

Role in this project: Arknights live-action character asset candidate.

Reference authority: \`${refPath}\`

## Face Lock

Face/read: ${face}.

Beauty/personality type: ${seed}.

AI risks: sameface, waxy skin, plastic wig, cosplay fabric, fashion-model pose that erases the operator's job and silhouette.

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

- Do not create \`selected.png\` unless a generated candidate passes reference, costume, face differentiation, artifact, and downstream usability QA.
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
`);

  write(path.join(dir, "COSTUME_REFERENCE_AUDIT.md"), `# ${name} Costume Reference Audit

Reference file: \`${refPath}\`

Status: \`pending_candidate_review\`

## Required Checks Before Selection

${bullet(locks.map((lock) => `Pass/fail: ${lock}`))}
- Pass/fail: face is distinct from all existing selected operators.
- Pass/fail: skin/hair/fabric read as real, not wax/plastic.
- Pass/fail: hands, visible props, and costume structure are not visibly broken.
- Pass/fail: the asset can be used in later video prompts without explaining around identity drift.

## Blockers

- Block if the output uses a different skin as its costume authority.
- Block if the generated image is attractive but not recognizably ${name}.
- Block if the image hides the character-defining costume or prop silhouette.
`);
}

console.log(`Wrote identity/source docs for ${batch.length} operators.`);
