const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const generatedAt = new Date().toISOString();

const items = [
  {
    slug: "Chen_the_Holungday",
    name: "Ch'en the Holungday",
    status: "blocked_needs_revision",
    decision: "blocked_generation_moderation",
    summary: "Both image generation attempts were blocked by the image tool safety system because the source outfit/output category was classified as sexual.",
    blockers: [
      "No generated candidate exists.",
      "Cannot promote or hand-wave a substitute while the official Holungday source keeps triggering output moderation."
    ],
    required: "Use a different official Ch'en outfit, or create a manually approved conservative Holungday costume reference before retrying."
  },
  {
    slug: "Kaltsit",
    name: "Kal'tsit",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Readable Rhodes medical silhouette and green-white palette, but the candidate softens her severity and exposes/off-styles the upper outfit.",
    blockers: [],
    required: "Tighten the lab coat and severe clinical face before production selection."
  },
  {
    slug: "Logos",
    name: "Logos",
    status: "selected",
    decision: "approved_selected",
    summary: "Clear pale-hair caster silhouette, black ritual formalwear, controlled androgynous face, and downstream-readable identity.",
    blockers: [],
    required: "Monitor ornate back ornaments in video prompts so they do not become random wing shapes."
  },
  {
    slug: "Mlynar",
    name: "Mlynar",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Strong tired mature face and Kazimierz noble-worker read, but the metallic arm detail is heavier than the base reference.",
    blockers: [],
    required: "Use only as monitored candidate unless a cleaner coat/sword-only version is generated."
  },
  {
    slug: "Degenbrecher",
    name: "Degenbrecher",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "Costume drifted into a decorated officer uniform and the horn silhouette became too dominant; not recognizably faithful enough.",
    blockers: [
      "Base costume structure is replaced by a military-office look.",
      "Large horns and medals overpower the Kjerag duelist identity."
    ],
    required: "Regenerate with the official outfit panels, sword, fur/trim, and subdued horn scale locked harder."
  },
  {
    slug: "Ling",
    name: "Ling",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Good Sui poetic confidence, blue hair, layered robe, and vessel/weapon prop language; glamour and leg exposure need monitoring.",
    blockers: [],
    required: "Use only when the shot framing preserves robe layers and avoids glamour-pose drift."
  },
  {
    slug: "Dusk",
    name: "Dusk",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Ink painter mood and dark teal-white palette are visible, but weaponization is stronger than the painter identity.",
    blockers: [],
    required: "Regenerate for selection with brush/scroll/ink tools replacing sword emphasis."
  },
  {
    slug: "Shu",
    name: "Shu",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Warm agricultural divinity and green-cream earth palette read well; face risks generic ancient-costume beauty.",
    blockers: [],
    required: "Face differentiation from Nian/Dusk/Ling must be manually checked before downstream use."
  },
  {
    slug: "SilverAsh",
    name: "SilverAsh",
    status: "selected",
    decision: "approved_selected",
    summary: "Strong Kjerag aristocrat read: silver hair, dark formal coat, fur mantle, cane authority, and controlled expression.",
    blockers: [],
    required: "Keep prompts from over-darkening him into a generic black-cloak villain."
  },
  {
    slug: "Thorns",
    name: "Thorns",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Distinct tan face and research-swordsman stance, but the outfit shifts toward white lab layers instead of the black-yellow reference balance.",
    blockers: [],
    required: "Use only with prompt locks that restore black/yellow coat dominance."
  },
  {
    slug: "Bagpipe",
    name: "Bagpipe",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Rural field context, orange hair, horns, and oversized weapon are readable; skirt and pose drift toward pinup/cosplay.",
    blockers: [],
    required: "Regenerate for selected status with less fashion posing and stronger military-farm practicality."
  },
  {
    slug: "Mudrock",
    name: "Mudrock",
    status: "selected",
    decision: "approved_selected",
    summary: "Heavy armor remains the subject, face is restrained, materials are practical, and the defender silhouette is downstream-lockable.",
    blockers: [],
    required: "Preserve this armor-first treatment; do not switch to uncovered beauty shots."
  },
  {
    slug: "Saria",
    name: "Saria",
    status: "selected",
    decision: "approved_selected",
    summary: "Mature face, Rhine-like white-black-orange security suit, broad shield, and grounded defensive authority are clear.",
    blockers: [],
    required: "Maintain severe expression and shield; avoid softening into generic lab-coat styling."
  },
  {
    slug: "Eyjafjalla",
    name: "Eyjafjalla",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "Despite adult prompt wording, the candidate reads too childlike and doll-like for production-safe downstream use.",
    blockers: [
      "Face and body proportions risk underage read.",
      "Outfit drifts into fantasy doll styling rather than grounded volcanologist-caster."
    ],
    required: "Regenerate with clearly adult researcher facial structure, less doll styling, and stronger field-science gear."
  },
  {
    slug: "Blaze",
    name: "Blaze",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Chainsaw/frontline identity is strong, but exposure and fashion-action posing are risky for production prompts.",
    blockers: [],
    required: "Use monitored only; selected pass needs more covered Rhodes combat gear and less pinup framing."
  },
  {
    slug: "Nearl_the_Radiant_Knight",
    name: "Nearl the Radiant Knight",
    status: "selected",
    decision: "approved_selected",
    summary: "White-gold knight silhouette, lance, cloak, blond hair, and calm heroic posture are clear and video-lockable.",
    blockers: [],
    required: "Keep armor practical and avoid excessive fantasy glow in downstream prompts."
  },
  {
    slug: "Horn",
    name: "Horn",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "Artillery silhouette is present, but the outfit is too exposed and not faithful to the Victorian officer reference.",
    blockers: [
      "Uniform is replaced by a sleeveless stylized action costume.",
      "Head silhouette and body styling drift away from the official base outfit."
    ],
    required: "Regenerate with covered officer coat, clearer military tailoring, and less glamour."
  },
  {
    slug: "Ines",
    name: "Ines",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Black-red mercenary silhouette and guarded expression read well; short leather styling risks generic spy/fashion drift.",
    blockers: [],
    required: "Use only with strict red-accent/mercenary gear locks; regenerate for selected with less fashion-villain styling."
  },
  {
    slug: "Typhon",
    name: "Typhon",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Large bow and cold hunter mood are strong; weapon assembly is overcomplicated and costume needs closer reference matching.",
    blockers: [],
    required: "Use monitored only; selected pass needs simpler official bow silhouette and less glamour."
  },
  {
    slug: "Virtuosa",
    name: "Virtuosa",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "Instrument and black-white outfit are visible, but the hair color drifts too dark and the costume becomes generic musician-cleric.",
    blockers: [
      "Primary white/silver hair lock fails.",
      "Reference costume identity is not strong enough for production selection."
    ],
    required: "Regenerate with white/silver hair as a hard lock and closer reference garment shapes."
  },
  {
    slug: "Ascalon",
    name: "Ascalon",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Covert black-red silhouette and severe expression work, but the face skews young and hair color may be too red.",
    blockers: [],
    required: "Use monitored only; selected pass needs more mature face and stricter reference hair/costume balance."
  },
  {
    slug: "Goldenglow",
    name: "Goldenglow",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "Electric caster props are clear, but the face and styling are too doll-like for a production-safe adult live-action asset.",
    blockers: [
      "Over-childlike facial read despite adult prompt lock.",
      "Costume leans cute cosplay rather than grounded operator adaptation."
    ],
    required: "Regenerate with adult face structure, less doll styling, and grounded tech-fabric material."
  },
  {
    slug: "Chongyue",
    name: "Chongyue",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Sui martial palette and formal silhouette read, but the face is too young and the martial body language is underplayed.",
    blockers: [],
    required: "Use monitored only; selected pass needs more mature martial bearing and less ornamental model posture."
  },
  {
    slug: "Executor_the_Ex_Foedere",
    name: "Executor the Ex Foedere",
    status: "selected",
    decision: "approved_selected",
    summary: "White hair, halo cue, black-white-red executor coat, firearm, and blank disciplined face are coherent and downstream-readable.",
    blockers: [],
    required: "Avoid turning the rear ornaments into wing clutter in video prompts."
  },
  {
    slug: "Reed_the_Flame_Shadow",
    name: "Reed the Flame Shadow",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "Staff and flame-tail motif are present, but hair/costume drift into pale formal fantasy rather than Reed's red-black flame-shadow identity.",
    blockers: [
      "Hair color and outfit palette do not preserve the main identity lock.",
      "Medic/caster restraint is replaced by formal fantasy styling."
    ],
    required: "Regenerate with stronger red hair, black-red outfit, and less ceremonial gown structure."
  },
  {
    slug: "Irene",
    name: "Irene",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "Inquisitor props read, but the face and proportions lean too doll-like and young for production-safe use.",
    blockers: [
      "Adult compact-inquisitor lock is not proven.",
      "Costume becomes gothic doll styling rather than official Iberian inquisitor silhouette."
    ],
    required: "Regenerate with clearly adult features, sharper duty-bound expression, and closer hat/sword/costume reference."
  },
  {
    slug: "Hoshiguma",
    name: "Hoshiguma",
    status: "monitor_required",
    decision: "monitor_required",
    summary: "Green hair, horn, and triangular shield are readable; the body lacks enough tall heavy presence and uniform fidelity.",
    blockers: [],
    required: "Use monitored only; selected pass needs larger frame, more Lungmen police details, and less generic black leather."
  },
  {
    slug: "Shining",
    name: "Shining",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "Sword-medic tension exists, but the palette becomes too black and ragged, losing the white medical reference read.",
    blockers: [
      "Primary white medical silhouette is not preserved.",
      "Costume reads as dark fantasy wanderer rather than Shining base outfit."
    ],
    required: "Regenerate with white/black medical coat dominance and less ragged cloak styling."
  },
  {
    slug: "Nightingale",
    name: "Nightingale",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "Healer staff/cage language is visible, but the candidate remains too childlike/doll-like for production-safe use.",
    blockers: [
      "Adult young woman lock is not sufficiently proven.",
      "White dress styling leans doll costume instead of grounded medic silhouette."
    ],
    required: "Regenerate with older facial structure, less doll styling, and more grounded healer costume layers."
  },
  {
    slug: "Mountain",
    name: "Mountain",
    status: "blocked_needs_revision",
    decision: "rejected",
    summary: "The candidate became a literal beast-faced fantasy fighter, not a humanized live-action operator.",
    blockers: [
      "Humanized face requirement fails.",
      "Formal gentleman-fighter identity is replaced by literal animalized armor fantasy."
    ],
    required: "Regenerate as a large human man with white/gray hair and subtle Feline cues, not a literal animal face."
  }
];

function exists(file) {
  return fs.existsSync(file);
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${text.trim()}\n`);
}

for (const item of items) {
  const dir = path.join(root, item.slug);
  const candDir = path.join(dir, "candidates_base_v1");
  fs.mkdirSync(candDir, { recursive: true });
  const candidate = path.join(candDir, "candidate_01.png");
  const hasCandidate = exists(candidate);
  const reference = `references/wiki_terra_${item.slug.toLowerCase()}_base.png`;

  write(
    path.join(candDir, "prompt.md"),
    `# ${item.name} Candidate Prompt

Status: \`${item.status}\`

Reference authority: \`${reference}\`

Generation mode: built-in image generation with the local official reference image.

Prompt intent:

- Create a realistic live-action character asset.
- Preserve the official base/default costume silhouette, palette, hair, accessories, and role read.
- Avoid default AI sameface, wax skin, plastic wigs, cosplay fabric, hidden costume, and fashion-photo drift.

Candidate image: ${hasCandidate ? "`candidate_01.png`" : "`not_generated_due_to_moderation`"}
`
  );

  write(
    path.join(candDir, "notes.md"),
    `# ${item.name} Candidate Notes

Status: \`${item.status}\`

Summary:

${item.summary}

Required next action:

${item.required}
`
  );

  const blockers = item.blockers.length ? item.blockers.map((line) => `- ${line}`).join("\n") : "- No P0 blocker found in this pass.";
  write(
    path.join(candDir, "review.md"),
    `# ${item.name} Candidate Review

Reviewer: asset QA

Reviewed: ${generatedAt}

Decision: \`${item.decision}\`

Status: \`${item.status}\`

## Blocking Issues

${blockers}

## Continuity / Identity Issues

${item.summary}

## Costume Reference Issues

Reference authority remains \`${reference}\`. Candidate must not be used downstream if it fails the visible costume, hair, silhouette, prop, age/read, or sameface checks.

## Required Revision

${item.required}

## Promotion

${item.status === "selected" ? "Approved for `selected.png` promotion in this batch." : "Not approved for `selected.png` promotion in this batch."}
`
  );

  if (item.status === "selected" && hasCandidate) {
    fs.copyFileSync(candidate, path.join(dir, "selected.png"));
  }

  const identityPath = path.join(dir, "identity_locks.md");
  if (exists(identityPath)) {
    const original = fs.readFileSync(identityPath, "utf8");
    const updated = original
      .replace(/Status: `?reference_ready_pending_generation`?/g, `Status: \`${item.status}\``)
      .replace(/Status: reference_ready_pending_generation/g, `Status: \`${item.status}\``);
    fs.writeFileSync(identityPath, updated);
  }

  const usagePath = path.join(dir, "usage_notes.md");
  if (exists(usagePath)) {
    const original = fs.readFileSync(usagePath, "utf8");
    const updated = original.replace(/Production use status: `?reference_ready_pending_generation`?/g, `Production use status: \`${item.status}\``);
    fs.writeFileSync(usagePath, updated);
  }
}

const selected = items.filter((item) => item.status === "selected");
const monitor = items.filter((item) => item.status === "monitor_required");
const blocked = items.filter((item) => item.status === "blocked_needs_revision");

write(
  path.join(root, "BATCH_30_QA_REPORT.md"),
  `# Arknights Live-Action Batch 30 QA Report

Reviewed: ${generatedAt}

Scope: 30 requested continuation operators after the first approved six.

## Outcome

- Selected: ${selected.length} (${selected.map((item) => item.name).join(", ")})
- Monitor required: ${monitor.length} (${monitor.map((item) => item.name).join(", ")})
- Blocked/rejected: ${blocked.length} (${blocked.map((item) => item.name).join(", ")})

## Gate Rule

Only operators with \`selected.png\` may enter downstream storyboard, video prompt, or video generation packages.

Monitor candidates are useful for visual direction but must not be treated as production identity locks.

Blocked candidates are retained as failure evidence and revision targets.

## Notes

- Ch'en the Holungday was blocked by image-generation safety moderation twice; no candidate image is present.
- Mountain failed the humanized live-action requirement and is blocked despite having a generated candidate.
- Degenbrecher, Horn, Eyjafjalla, Virtuosa, Goldenglow, Reed the Flame Shadow, Irene, Shining, and Nightingale all failed substantive visual QA and were not promoted.
`
);

console.log(`Finalized ${items.length} candidate reviews.`);
console.log(`selected=${selected.length} monitor_required=${monitor.length} blocked=${blocked.length}`);
