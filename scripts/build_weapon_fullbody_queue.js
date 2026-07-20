const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const characters = [
  ["black_eagles", "Bernadetta", "academy", "wooden academy bow with one padded practice arrow", "archer"],
  ["black_eagles", "Caspar", "academy", "pair of padded leather training gauntlets", "brawler"],
  ["black_eagles", "Dorothea", "academy", "closed spellbook held at the hip with a small brass casting focus", "reason mage"],
  ["black_eagles", "Edelgard", "academy", "single compact wooden training axe with a broad leather-covered blunt head", "axe leader"],
  ["black_eagles", "Ferdinand", "academy", "single-headed ashwood training lance with a leather-covered blunt spearhead", "lancer"],
  ["black_eagles", "Hubert", "academy", "dark leather spellbook and one restrained violet-black casting focus above the free hand", "dark mage"],
  ["black_eagles", "Linhardt", "academy", "slender healer staff and closed white-magic spellbook", "healer"],
  ["black_eagles", "Petra", "academy", "single curved wooden training sword in a low ready carry", "swordswoman"],
  ["blue_lions", "Annette", "academy", "short wooden casting wand and compact reason-magic spellbook", "wind mage"],
  ["blue_lions", "Ashe", "academy", "wooden academy bow with one padded practice arrow", "archer"],
  ["blue_lions", "Dedue", "academy", "broad wooden training shield and one plain ashwood spear", "shield guardian"],
  ["blue_lions", "Dimitri", "academy", "single-headed ashwood training lance with one leather-covered blunt spearhead and a plain butt end", "lancer"],
  ["blue_lions", "Felix", "academy", "single straight wooden training sword with a wrapped grip", "swordsman"],
  ["blue_lions", "Ingrid", "academy", "single-headed ashwood training lance with a leather-covered blunt spearhead", "lancer"],
  ["blue_lions", "Mercedes", "academy", "elegant wooden healer staff with a small pale-blue focus stone", "healer"],
  ["blue_lions", "Sylvain", "academy", "single-headed ashwood training lance with a leather-covered blunt spearhead", "lancer"],
  ["golden_deer", "Claude", "academy", "wooden academy bow with one padded practice arrow", "archer"],
  ["golden_deer", "Hilda", "academy", "compact wooden training axe with a broad padded head", "axe fighter"],
  ["golden_deer", "Ignatz", "academy", "wooden academy bow with one padded practice arrow", "archer"],
  ["golden_deer", "Leonie", "academy", "single-headed ashwood training lance with a leather-covered blunt spearhead", "lancer"],
  ["golden_deer", "Lorenz", "academy", "ornate single-headed ashwood training lance with a leather-covered blunt spearhead", "lancer"],
  ["golden_deer", "Lysithea", "academy", "small dark reason-magic spellbook and a narrow silver casting focus", "reason mage"],
  ["golden_deer", "Marianne", "academy", "simple wooden healer staff with a pale-blue focus stone", "healer"],
  ["golden_deer", "Raphael", "academy", "pair of oversized padded leather training gauntlets", "brawler"],
  ["church_of_seiros", "Alois", "academy", "large wooden training axe with a leather-covered head", "axe knight"],
  ["church_of_seiros", "Catherine", "academy", "single silver two-handed training sword inspired by Thunderbrand, blades secured in a safe scabbard", "sword knight"],
  ["church_of_seiros", "Cyril", "academy", "compact wooden bow with one padded practice arrow", "archer"],
  ["church_of_seiros", "Flayn", "academy", "slender white-magic staff with a small sea-green focus stone", "healer"],
  ["church_of_seiros", "Gilbert", "academy", "long ashwood lance and broad steel-rimmed training shield", "armored lancer"],
  ["church_of_seiros", "Hanneman", "academy", "scholarly spellbook and a slim brass casting pointer", "reason professor"],
  ["church_of_seiros", "Jeritza", "academy", "long single-headed training lance with a dark leather-covered blunt spearhead", "lancer instructor"],
  ["church_of_seiros", "Manuela", "academy", "slim wooden training sword sheathed at the hip and a short white-magic casting wand", "sword healer"],
  ["church_of_seiros", "Rhea", "academy", "ceremonial silver sword held vertically in its scabbard", "archbishop swordswoman"],
  ["church_of_seiros", "Seteth", "academy", "long single-headed ashwood lance with a restrained silver-and-green guard", "lancer administrator"],
  ["church_of_seiros", "Shamir", "academy", "dark wooden longbow with one padded practice arrow", "archer"],
  ["protagonist", "Byleth", "professor", "single straight training sword in a black scabbard", "sword professor"]
];

const queue = characters.map(([group, name, phase, weapon, role], index) => {
  const reference = `assets/characters/${group}/${name}/${phase}/selected.png`;
  const output = `assets/characters/${group}/${name}/weapon_fullbody/selected.png`;
  return {
    order: index + 1,
    group,
    name,
    phase,
    role,
    weapon,
    status: fs.existsSync(path.join(ROOT, output)) ? "generated_needs_qa" : "needs_generation",
    reference,
    output,
    prompt: [
      "Use case: identity-preserve",
      "Asset type: character continuity reference for cinematic storyboard and AI-video generation, vertical 2:3 full-body portrait",
      `Primary request: create a photorealistic live-action full-body academy reference of ${name} as a ${role}, holding ${weapon}.`,
      `Input image: strict identity reference for ${name}'s face, hairstyle, age impression, costume silhouette and color accents.`,
      "Composition: head-to-toe body fully visible including both shoes, weapon fully inside frame, neutral three-quarter stance, hands and grip unobstructed, no crop, generous margin above head and below feet.",
      "Backdrop: simple Garreg Mach stone courtyard with soft neutral daylight and shallow depth of field; no battle, no crowd.",
      "Continuity: preserve the exact referenced face, hair, age, academy costume, body type and signature colors. Keep the weapon historically plausible and role-correct.",
      "Avoid: wrong weapon, duplicate weapon, floating weapon, extra limbs, cropped feet, cropped weapon, magic assigned to non-mage, modern objects, combat action, injury, blood, UI, text, watermark, costume drift, war-phase armor."
    ].join("\n")
  };
});

const outDir = path.join(ROOT, "production", "weapon_fullbody_2026-07-17");
fs.mkdirSync(path.join(outDir, "prompts"), { recursive: true });
fs.writeFileSync(path.join(outDir, "queue.json"), `${JSON.stringify(queue, null, 2)}\n`);

for (const entry of queue) {
  fs.writeFileSync(path.join(outDir, "prompts", `${entry.order.toString().padStart(2, "0")}_${entry.name}.md`), `${entry.prompt}\n`);
}

const lines = [
  "# Weapon Full-Body Character Queue",
  "",
  `Total: ${queue.length}`,
  "",
  "| # | Character | Group | Role | Weapon | Status | Output |",
  "|---:|---|---|---|---|---|---|",
  ...queue.map((x) => `| ${x.order} | ${x.name} | ${x.group} | ${x.role} | ${x.weapon} | ${x.status} | \`${x.output}\` |`),
  ""
];
fs.writeFileSync(path.join(outDir, "queue.md"), lines.join("\n"));

console.log(JSON.stringify({ total: queue.length, needsGeneration: queue.filter((x) => x.status === "needs_generation").length }, null, 2));
