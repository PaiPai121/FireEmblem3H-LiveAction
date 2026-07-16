const fs = require("fs");
const path = require("path");
const vm = require("vm");

const inputPath = "site/data.js";
const outputPath = "site/data.js";
const characterRoot = "assets/characters";

const source = fs.readFileSync(inputPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const existing = sandbox.window.ASSET_REVIEW_DATA;

const nameOverrides = new Map([
  ["Aelfric", "阿尔法德"],
  ["Tomas", "托马修"],
  ["Monica", "莫妮卡"],
  ["Randolph", "兰道夫"],
  ["Ladislava", "拉蒂丝拉瓦"],
  ["Fleche", "芙蕾伽"],
  ["ChurchKnightExtra", "教会骑士群众"],
  ["AcademyStudentExtra", "学院学生群众"],
]);

function loadIndexedNames() {
  const indexPath = "production/character_asset_index.yaml";
  const names = new Map();
  if (!fs.existsSync(indexPath)) return names;
  const lines = fs.readFileSync(indexPath, "utf8").split("\n");
  let currentId = "";
  for (const line of lines) {
    const idMatch = line.match(/^- id: (.+)$/);
    if (idMatch) {
      currentId = idMatch[1].trim();
      continue;
    }
    const nameMatch = line.match(/^  name_zh: (.+)$/);
    if (currentId && nameMatch) {
      names.set(currentId, nameMatch[1].trim());
      currentId = "";
    }
  }
  return names;
}

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.isFile() && entry.name === "selected.png") results.push(full);
  }
  return results;
}

function eraFromPath(parts) {
  const afterCharacter = parts.slice(4, -1);
  return afterCharacter.length ? afterCharacter.join("/") : "selected";
}

function characterIdFromPath(parts) {
  return parts[3] || "";
}

function factionFromPath(parts) {
  return parts[2] || "";
}

const indexedNames = loadIndexedNames();
const existingNames = new Map();
for (const row of existing.characters || []) {
  if (row[0] && row[1] && row[0] !== row[1] && row[2] !== "characters") {
    existingNames.set(row[0], row[1]);
  }
}

const characters = walk(characterRoot)
  .map((file) => {
    const parts = file.split(path.sep);
    const faction = factionFromPath(parts);
    const id = characterIdFromPath(parts);
    const era = eraFromPath(parts);
    return [
      id,
      indexedNames.get(id) || existingNames.get(id) || nameOverrides.get(id) || id,
      faction,
      era,
      file,
    ];
  })
  .sort((a, b) => {
    const factionCompare = a[2].localeCompare(b[2]);
    if (factionCompare) return factionCompare;
    const idCompare = a[0].localeCompare(b[0]);
    if (idCompare) return idCompare;
    return a[3].localeCompare(b[3]);
  });

const documents = [...(existing.documents || [])];
const requiredDocuments = [
  ["人物职业变体缺口清单", "production/人物职业变体缺口清单_2026-07-16.md"],
  ["人物职业变体生成队列", "production/人物职业变体生成队列_2026-07-16.md"],
];
for (const doc of requiredDocuments) {
  if (fs.existsSync(doc[1]) && !documents.some((item) => item[1] === doc[1])) {
    documents.push(doc);
  }
}

const payload = {
  ...existing,
  updated: "2026-07-16",
  characters,
  documents,
};

fs.writeFileSync(outputPath, `window.ASSET_REVIEW_DATA = ${JSON.stringify(payload, null, 2)};\n`);
console.log(`wrote ${outputPath} (${characters.length} characters)`);
