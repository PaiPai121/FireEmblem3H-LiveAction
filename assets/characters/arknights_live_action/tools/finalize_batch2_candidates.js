const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const generatedAt = new Date().toISOString();

const items = [
  {
    slug: "Phantom",
    name: "Phantom",
    status: "selected",
    decision: "approved_selected",
    summary: "The candidate preserves the theatrical assassin read: pale hair, black-red formal combat layers, mask cue, and stage-danger posture are readable for downstream prompts.",
    required: "Keep the mask/theatre identity visible; avoid drifting into a generic black-cloak vampire."
  },
  {
    slug: "Mostima",
    name: "Mostima",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Blue hair, halo/staff language, and calm fallen-Sankta presence are visible, but the costume is over-modernized and leg exposure weakens the official silhouette.",
    required: "Regenerate for selection with stricter coat length, darker layered travel uniform, and less fashion styling."
  },
  {
    slug: "Passenger",
    name: "Passenger",
    status: "selected",
    decision: "approved_selected",
    summary: "The desert engineer-caster identity is clear: long coat, device silhouette, sharp intellectual bearing, and arid political mood are downstream-lockable.",
    required: "Preserve the technical device and desert aristocrat restraint in video prompts."
  },
  {
    slug: "Weedy",
    name: "Weedy",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "The engineering prop reads, but the hair color and body styling drift too far from Weedy's teal engineering identity.",
    blockers: [
      "Primary hair-color lock fails.",
      "Costume becomes exposed sci-fi fashion rather than compact Rhodes engineer gear."
    ],
    required: "Regenerate with teal hair, covered engineer uniform, water-cannon device, and less glamour."
  },
  {
    slug: "Ifrit",
    name: "Ifrit",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Industrial fire-caster attitude and gear are readable, and the candidate avoids a childlike body read; outfit exposure and boot/prop drift need monitoring.",
    required: "Use only with prompts that keep her adult casting, oversized flame gear, and industrial containment look."
  },
  {
    slug: "Angelina",
    name: "Angelina",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "The courier/caster elements are present, but the face and styling read too young and idol-like for production-safe live-action use.",
    blockers: [
      "Low-age/doll read risk despite adult intent.",
      "Costume lacks enough grounded operator utility."
    ],
    required: "Regenerate with clearly adult face structure, longer field coat, and courier gear rather than idol styling."
  },
  {
    slug: "Siege",
    name: "Siege",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Weapon, black-gold street-royal energy, and tough stance are present, but the costume drifts into generic leather action styling.",
    required: "Regenerate for selection with stronger official jacket/armor blocks and less generic biker-fighter styling."
  },
  {
    slug: "Skadi",
    name: "Skadi",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Huge sword, cold sea-hunter mood, and black-white-red palette are usable, but the head silhouette and hat drift away from original Skadi.",
    required: "Use monitored only; selected pass needs the original head/hair silhouette without the added oversized hat."
  },
  {
    slug: "Specter_the_Unchained",
    name: "Specter the Unchained",
    status: "selected",
    decision: "approved_selected",
    summary: "Strong unchained Abyssal nun-gladiator identity: silver hair, black-white-red habit layers, eerie still face, and circular saw weapon are all clear.",
    required: "Keep the circular saw readable and avoid softening her into a generic gothic nun."
  },
  {
    slug: "Penance",
    name: "Penance",
    status: "selected",
    decision: "approved_selected",
    summary: "Former judge/enforcer identity reads clearly through the severe face, black-red legal robes, heavy belt layers, and hammer-like law staff.",
    required: "Preserve the tired legal authority; avoid turning her into a fantasy princess or red-gown noble."
  },
  {
    slug: "Lin",
    name: "Lin",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Lungmen political elegance, black formal silhouette, teal accents, and horn/headpiece are visible, but the outfit is too close to modern luxury eveningwear.",
    required: "Regenerate for selection with a closer official garment structure and less hotel-lounge styling."
  },
  {
    slug: "Qiubai",
    name: "Qiubai",
    status: "selected",
    decision: "approved_selected",
    summary: "The quiet wandering swordswoman identity is clear: pale hair with teal accent, black-white-green layered outfit, long sword, and restrained jianghu presence.",
    required: "Maintain the teal accent and calm melancholy; avoid generic white-haired fantasy swordswoman prompts."
  },
  {
    slug: "Hoederer",
    name: "Hoederer",
    status: "selected",
    decision: "approved_selected",
    summary: "Battle-worn Sarkaz mercenary read is strong: mature rough face, black-red armored coat, massive sword, and non-idol soldier gravity.",
    required: "Keep him rugged and older; avoid cleaning him up into a fashion model."
  },
  {
    slug: "Ulpianus",
    name: "Ulpianus",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Cold sea-veteran presence, broad build, pale hair, and white-black-red coat are strong, but the weapon becomes a generic axe/anchor hybrid.",
    required: "Regenerate for selection with the official massive weapon silhouette locked more tightly."
  },
  {
    slug: "Nymph",
    name: "Nymph",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "The candidate is pretty but too generic: it reads as a fantasy bridal caster and lacks enough operator-specific costume authority.",
    blockers: [
      "Costume and staff silhouette are not sufficiently tied to Nymph's reference.",
      "Face/styling lean doll-like and generic."
    ],
    required: "Regenerate with stricter reference panels, adult face structure, and the exact accessory/costume silhouette."
  },
  {
    slug: "Ray",
    name: "Ray",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Desert hunter survivalist mood, headwear, and large ranged weapon are readable, but the weapon drifts toward modern firearm and the outfit is too exposed.",
    required: "Use only with prompt locks that preserve a fantasy expedition ranged weapon and practical coverage."
  },
  {
    slug: "Zuo_Le",
    name: "Zuo Le",
    status: "selected",
    decision: "approved_selected",
    summary: "Disciplined Yan swordsman identity reads well through the black-blue-white martial uniform, serious face, sword, and official-guard poise.",
    required: "Keep the controlled official bearing; avoid turning him into a generic idol swordsman."
  },
  {
    slug: "Ela",
    name: "Ela",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Professional tactical operator styling is strong and distinct, but the image risks becoming a generic near-future soldier rather than Arknights-specific Ela.",
    required: "Use monitored only; downstream prompts must retain her cap/headset, green-black gear blocks, and specialist device."
  },
  {
    slug: "Ash",
    name: "Ash",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Mature tactical commander presence, cap/headset, rifle, and dark armor are readable, but it sits close to generic military reference photography.",
    required: "Use monitored only; add Arknights operator costume locks in any video prompt."
  },
  {
    slug: "Kirin_R_Yato",
    name: "Kirin R Yato",
    status: "selected",
    decision: "approved_selected",
    summary: "Masked hunter-ninja silhouette is strong: black-red-white layered armor, twin blades, headgear, and action-ready stillness all read clearly.",
    required: "Keep twin blades and mask visible; avoid generic ninja redesigns."
  },
  {
    slug: "Fiammetta",
    name: "Fiammetta",
    status: "selected",
    decision: "approved_selected",
    summary: "Fiery Sankta enforcer identity is clear: red hair, halo cue, black-red-white Laterano layers, large launcher, and impatient authority.",
    required: "Keep the launcher and halo subtle but readable; avoid angel-parody styling."
  },
  {
    slug: "Dorothy",
    name: "Dorothy",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Rhine Lab-style white-black-orange outfit and engineering device are visible, but the face is too sweet/cosplay-polished for a strict selected pass.",
    required: "Regenerate for selection with less doll beauty and more unsettling adult researcher ambiguity."
  },
  {
    slug: "Stainless",
    name: "Stainless",
    status: "selected",
    decision: "approved_selected",
    summary: "Cheerful Victorian engineer identity is strong: reddish hair, practical smile, red-brown coat, tools, and backpack device are readable.",
    required: "Preserve workshop dirt and practical tools; avoid turning him into a generic steampunk noble."
  },
  {
    slug: "Ebenholz",
    name: "Ebenholz",
    status: "selected",
    decision: "approved_selected",
    summary: "Haunted noble caster-musician read is clear through the black-white-gold formal layers, musical Arts staff, pale face, and melancholy posture.",
    required: "Keep the musical Arts object visible; avoid flattening him into tuxedo vampire styling."
  },
  {
    slug: "Gnosis",
    name: "Gnosis",
    status: "selected",
    decision: "approved_selected",
    summary: "Cold Kjerag scientist-politician identity reads well: white hair, glasses, black-white-blue winter coat, fur trim, and research staff/device.",
    required: "Maintain the winter-tech intellectual silhouette; avoid generic ice mage effects."
  },
  {
    slug: "Flametail",
    name: "Flametail",
    status: "selected",
    decision: "approved_selected",
    summary: "Kazimierz knight captain identity is clear: short red hair, ear silhouette, red-white-gold armor, shield, sword, and energetic confidence.",
    required: "Keep her practical and adult; avoid childlike knight-idol framing."
  },
  {
    slug: "Saileach",
    name: "Saileach",
    status: "selected",
    decision: "approved_selected",
    summary: "Standard-bearer identity is clear through the green-white uniform, horn silhouette, long blonde hair, and large banner spear.",
    required: "Keep the banner and horn detail visible; avoid wedding-dress drift."
  },
  {
    slug: "Fartooth",
    name: "Fartooth",
    status: "selected",
    decision: "approved_selected",
    summary: "Long-range Kazimierz archer identity is strong: very long bow, pale hair, ear silhouette, dark-light knight archer costume, and solitary focus.",
    required: "Keep the longbow full and readable; avoid elf-archer simplification."
  },
  {
    slug: "Blemishine",
    name: "Blemishine",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Shield, hammer, white-gold-blue armor, and warm knight-engineer mood are readable, but the breastplate and beauty framing are too glam for selected status.",
    required: "Regenerate for selection with less chest emphasis and more practical engineer-knight construction."
  },
  {
    slug: "Pallas",
    name: "Pallas",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Horn silhouette, spear, purple-white-gold palette, and mature priestess-warrior energy are present, but the costume drifts toward generic Greek goddess styling.",
    required: "Use monitored only; selected pass needs closer official outfit structure and less generic temple-costume design."
  }
];

const resolvedUrls = {
  Fiammetta: "https://arknights.wiki.gg/images/Fiammetta.png?e6d46f",
  Dorothy: "https://arknights.wiki.gg/images/Dorothy.png?9cc659",
  Stainless: "https://arknights.wiki.gg/images/Stainless.png?3fe6f6",
  Flametail: "https://arknights.wiki.gg/images/thumb/Flametail.png/679px-Flametail.png?adc4da",
  Fartooth: "https://arknights.wiki.gg/images/thumb/Fartooth.png/1536px-Fartooth.png?c397f6",
  Pallas: "https://arknights.wiki.gg/images/thumb/Pallas.png/1536px-Pallas.png?47c578"
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${content.trimEnd()}\n`);
}

function appendResolvedSource(slug) {
  const url = resolvedUrls[slug];
  if (!url) return;
  const links = path.join(root, slug, "source_links.md");
  const meta = path.join(root, slug, "source_metadata.md");
  if (fs.existsSync(links)) {
    const text = fs.readFileSync(links, "utf8");
    if (!text.includes("Resolved download URL:")) {
      write(links, `${text.trimEnd()}\n- Resolved download URL: ${url}\n`);
    }
  }
  if (fs.existsSync(meta)) {
    const text = fs.readFileSync(meta, "utf8");
    if (!text.includes("resolved_download_url")) {
      write(meta, `${text.trimEnd()}\n\nresolved_download_url: ${url}\n`);
    }
  }
}

function reviewText(item) {
  const blockers = item.blockers || [];
  const blockerText = blockers.length
    ? blockers.map((line) => `- ${line}`).join("\n")
    : "- None at this gate.";
  const gate = item.status === "selected"
    ? "Production selected: allowed for downstream storyboard/video-prompt packages."
    : item.status === "monitor_required"
      ? "Monitor only: useful for direction, not approved as a production identity lock."
      : "Blocked: must not enter downstream production packages.";

  return `# ${item.name} Candidate QA

Reviewed: ${generatedAt}

Decision: \`${item.decision}\`
Status: \`${item.status}\`

## Failure-First Review

${item.summary}

## Blockers

${blockerText}

## Required Follow-Up

${item.required}

## Gate

${gate}
`;
}

function promptText(item) {
  return `# ${item.name} Live-Action Candidate Prompt

Use case: photorealistic-natural Arknights operator reference portrait.

Primary prompt intent: create a realistic live-action version of ${item.name} using the local official reference image as the costume, color, silhouette, hair, prop, and personality authority.

Mandatory locks:
- Keep the official operator identity recognizable before improving beauty or cinematic mood.
- Preserve hair, head silhouette, costume block colors, primary prop/weapon, and personality posture.
- Use natural skin texture, real fabric/leather/metal, and film-costume construction.
- Avoid default AI beauty, same-face drift, generic fantasy redesign, wax skin, plastic wig, text, watermark, logo, or UI.

QA result: ${item.decision}.
`;
}

function notesText(item) {
  const selectedLine = item.status === "selected"
    ? "A `selected.png` copy exists and is the only downstream-approved image for this operator."
    : "No `selected.png` is created; downstream modules must not treat this candidate as production-ready.";
  return `# ${item.name} Candidate Notes

Candidate group: \`candidates_base_v1\`

${selectedLine}

Reviewer summary: ${item.summary}

Follow-up lock: ${item.required}
`;
}

const selected = [];
const monitor = [];
const blocked = [];

for (const item of items) {
  const operatorDir = path.join(root, item.slug);
  const candidateDir = path.join(operatorDir, "candidates_base_v1");
  const candidate = path.join(candidateDir, "candidate_01.png");
  if (!fs.existsSync(candidate)) {
    throw new Error(`Missing candidate image: ${candidate}`);
  }

  write(path.join(candidateDir, "review.md"), reviewText(item));
  write(path.join(candidateDir, "prompt.md"), promptText(item));
  write(path.join(candidateDir, "notes.md"), notesText(item));
  appendResolvedSource(item.slug);

  const selectedPath = path.join(operatorDir, "selected.png");
  if (item.status === "selected") {
    fs.copyFileSync(candidate, selectedPath);
    selected.push(item.name);
  } else {
    if (fs.existsSync(selectedPath)) fs.unlinkSync(selectedPath);
    if (item.status === "monitor_required") monitor.push(item.name);
    else blocked.push(item.name);
  }
}

const report = `# Arknights Live-Action Batch 2 QA Report

Reviewed: ${generatedAt}

Scope: 30 additional six-star operators after the first 36 processed entries. W and Skadi the Corrupting Heart remain skipped per user instruction; base Skadi is included.

## Outcome

- Selected: ${selected.length} (${selected.join(", ")})
- Monitor required: ${monitor.length} (${monitor.join(", ")})
- Blocked/rejected: ${blocked.length} (${blocked.join(", ")})

## Gate Rule

Only operators with \`selected.png\` may enter downstream storyboard, video prompt, or video generation packages.

Monitor candidates are retained as visual direction and must be reviewed again before use in production.

Blocked/rejected candidates are retained as failure evidence and revision targets.

## Reference URL Repair

Resolved direct image URLs were recorded for Fiammetta, Dorothy, Stainless, Flametail, Fartooth, and Pallas because their initial redirect downloads returned an HTML challenge page before repair.
`;

write(path.join(root, "BATCH_2_QA_REPORT.md"), report);

const summary = `# Arknights Live-Action Asset QA Summary

Last reviewed: ${generatedAt}

## Current Gate

Only \`selected.png\` files are production-ready. Candidate, monitor, blocked, and rejected images may be shown in the panel for review, but they are not approved identity locks for downstream video packages.

## Latest Batch

- Batch 2 generated 30 additional six-star operator candidates.
- Selected: ${selected.length}
- Monitor required: ${monitor.length}
- Blocked/rejected: ${blocked.length}

Latest detailed report: \`BATCH_2_QA_REPORT.md\`

## Previous Reports

- \`FIRST_BATCH_QA_REPORT.md\`
- \`BATCH_30_QA_REPORT.md\`
`;

write(path.join(root, "ASSET_QA_SUMMARY.md"), summary);

console.log(`Finalized batch 2: selected=${selected.length}, monitor=${monitor.length}, blocked=${blocked.length}`);
