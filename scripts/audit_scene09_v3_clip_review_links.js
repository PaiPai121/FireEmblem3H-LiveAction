const fs = require("fs");
const path = require("path");

const root = process.cwd();
const htmlPath = path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/clip_review.html");
const htmlDir = path.dirname(htmlPath);
const manifestPath = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json");
const clipQaPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_generated_clip_structural_audit_2026-08-01.json");
const reportPath = path.join(root, "production_system/scene09_v3_attrition_package/scene09_v3_clip_review_link_audit_2026-07-28.json");

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function main() {
  if (!fs.existsSync(htmlPath)) throw new Error(`Missing clip review HTML: ${htmlPath}`);
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);

  const html = fs.readFileSync(htmlPath, "utf8");
  const manifest = readJson(manifestPath);
  const clipQa = fs.existsSync(clipQaPath) ? readJson(clipQaPath) : null;
  const links = [];
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const raw = decodeHtml(match[1]);
    if (/^(https?:|mailto:|#)/.test(raw)) continue;
    links.push(raw);
  }

  const checked = [];
  const missing = [];
  for (const raw of links) {
    const target = path.resolve(htmlDir, raw);
    const exists = fs.existsSync(target);
    checked.push({ raw, target: path.relative(root, target), exists });
    if (!exists) missing.push({ raw, target: path.relative(root, target) });
  }

  const missingShotCards = manifest.shots
    .filter((shot) => !html.includes(`data-shot="${shot.shot}"`))
    .map((shot) => shot.shot);
  const expectedText = [
    "Scene09 V3 逐镜头真实剪辑验收台",
    "镜头025：规则与目标确立",
    "镜头032：杜笃与梅尔塞德斯重建盾线",
    "镜头034B：空教师目标裁定",
    "CLIP PENDING",
    "model_prompt.md",
    "submission_payload.jsonl",
    "No unnamed extras",
    "Captured Hubert, captured Dorothea, and captured Bernadetta must not reappear",
    "Hanneman and Manuela are separate faculty examiners",
    "Shot034B",
    "Byleth, Dimitri",
  ];
  const missingText = expectedText.filter((text) => !html.includes(text));
  const bareEnglishShotTitles = /<h2>\s*Shot\d+[A-Z]?\s*<\/h2>/.test(html);
  const countMismatch = clipQa && Number(clipQa.expected_clips) !== Number(manifest.total_shots);

  const report = {
    date: "2026-07-28",
    html: path.relative(root, htmlPath),
    package_manifest: path.relative(root, manifestPath),
    links_checked: checked.length,
    missing_links: missing,
    expected_shots: manifest.total_shots,
    rendered_shot_cards: (html.match(/class="shot-card"/g) || []).length,
    missing_shot_cards: missingShotCards,
    clip_qa_decision: clipQa?.decision || "not_run",
    clip_qa_count_mismatch: Boolean(countMismatch),
    required_text_missing: missingText,
    bare_english_shot_titles: bareEnglishShotTitles,
    decision: missing.length || missingShotCards.length || missingText.length || countMismatch || bareEnglishShotTitles
      ? "blocked_needs_revision"
      : "clip_review_file_access_passed",
  };

  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (report.decision !== "clip_review_file_access_passed") process.exit(1);
}

main();
