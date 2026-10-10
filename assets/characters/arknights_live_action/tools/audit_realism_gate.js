const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rosterPath = path.join(root, "six_star_roster_v0.json");
const roster = JSON.parse(fs.readFileSync(rosterPath, "utf8"));

function exists(filePath) {
  return fs.existsSync(filePath);
}

function readTextMaybe(filePath) {
  return exists(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function candidateDirs(operatorDir) {
  if (!exists(operatorDir)) return [];
  return fs
    .readdirSync(operatorDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("candidates"))
    .map((entry) => path.join(operatorDir, entry.name))
    .sort();
}

function hasApprovedRealismReview(operatorDir) {
  return candidateDirs(operatorDir).some((dir) => {
    const review = readTextMaybe(path.join(dir, "review.md"));
    return /Decision:\s*`?approved_selected`?/i.test(review) &&
      /REALISM_STYLE_BIBLE|Realism|realism|wardrobe fitting|production wardrobe/i.test(review);
  });
}

const results = roster.operators.map((item) => {
  const operatorDir = path.join(root, item.slug);
  const selected = path.join(operatorDir, "selected.png");
  const selectedExists = exists(selected);
  const approvedRealismReview = hasApprovedRealismReview(operatorDir);
  const status = selectedExists && approvedRealismReview
    ? "pass"
    : selectedExists
      ? "fail_selected_missing_realism_review"
      : "not_selected";
  return {
    rank: item.popularity_rank_v0,
    operator: item.operator,
    slug: item.slug,
    status,
    selected: selectedExists ? path.relative(root, selected).split(path.sep).join("/") : null,
  };
});

const failingSelected = results.filter((item) => item.status === "fail_selected_missing_realism_review");
const passingSelected = results.filter((item) => item.status === "pass");

const report = {
  schema: "arknights_live_action_realism_gate_audit_v1",
  generatedAt: new Date().toISOString(),
  root: "assets/characters/arknights_live_action",
  summary: {
    selectedPassingRealismGate: passingSelected.length,
    selectedMissingRealismGate: failingSelected.length,
  },
  failingSelected,
  passingSelected,
};

fs.writeFileSync(path.join(root, "realism_gate_audit.json"), `${JSON.stringify(report, null, 2)}\n`);

if (failingSelected.length) {
  console.error(JSON.stringify(report.summary, null, 2));
  console.error("Failing selected operators:");
  for (const item of failingSelected) {
    console.error(`- ${item.operator}: ${item.selected}`);
  }
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(report.summary, null, 2));
}
