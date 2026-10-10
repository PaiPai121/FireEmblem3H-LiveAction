#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const indexPath = path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/index.html");
const clipReviewPath = path.join(root, "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/clip_review.html");
const manifestPath = path.join(root, "production_system/video_delivery_manifest.json");

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${file}`);
  return fs.readFileSync(file, "utf8");
}

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

function articleBlocks(text, articlePattern) {
  const matches = [...text.matchAll(articlePattern)];
  return matches.map((match, index) => {
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    return text.slice(start, end);
  });
}

function auditPage({ label, text, articlePattern, requiredHeadings }) {
  const problems = [];
  const blocks = articleBlocks(text, articlePattern);
  if (blocks.length !== 42) problems.push(`${label}: expected 42 shot articles, found ${blocks.length}`);
  for (const [index, block] of blocks.entries()) {
    const h2 = block.match(/<h2>(.*?)<\/h2>/)?.[1] || `article_${index + 1}`;
    if (!block.includes("镜头后战况账本")) problems.push(`${label} ${h2}: missing battle ledger title`);
    for (const heading of requiredHeadings) {
      if (!block.includes(heading)) problems.push(`${label} ${h2}: missing ledger heading ${heading}`);
    }
  }
  return { blocks: blocks.length, problems };
}

function main() {
  const indexHtml = read(indexPath);
  const clipHtml = read(clipReviewPath);
  const manifest = JSON.parse(read(manifestPath));
  const problems = [];

  const indexAudit = auditPage({
    label: "index",
    text: indexHtml,
    articlePattern: /<article class="shot">/g,
    requiredHeadings: [
      "本镜头可见具名人物",
      "安全存活 / 非致命",
      "本镜头改变",
      "仍可行动 / 控制目标",
      "受限但未败",
      "已击败 / 被俘 / 退场，不可主动战斗",
      "被俘 / 目标判负",
      "收手 / 赛后",
      "不得重新主动参战",
    ],
  });
  problems.push(...indexAudit.problems);

  const clipAudit = auditPage({
    label: "clip_review",
    text: clipHtml,
    articlePattern: /<article class="shot-card"/g,
    requiredHeadings: [
      "安全存活 / 非致命",
      "仍可行动 / 控制目标",
      "受限但未败",
      "已击败 / 被俘 / 退场，不可主动战斗",
      "被俘 / 目标判负",
      "收手 / 赛后",
      "必须保持非主动",
    ],
  });
  problems.push(...clipAudit.problems);

  const requiredStoryEvents = [
    "Hubert: captured_by_felix_and_ashe",
    "Dorothea: captured_by_leonie_and_claude",
    "Bernadetta: captured_by_leonie_and_claude",
    "Hanneman: objective_defeated_off_sigil",
    "Manuela: route_cut",
  ];
  for (const event of requiredStoryEvents) {
    if (!indexHtml.includes(event)) problems.push(`index: missing key event ${event}`);
    if (!clipHtml.includes(event)) problems.push(`clip_review: missing key event ${event}`);
  }

  for (const shot of manifest.shots || []) {
    const ledger = shot.battle_state_after?.battle_ledger_after;
    if (!ledger) problems.push(`${shot.shot}: missing manifest battle_ledger_after`);
    if (ledger && ledger.all_named_characters_alive !== true) problems.push(`${shot.shot}: all_named_characters_alive is not true`);
  }

  const result = {
    date: "2026-07-28",
    index: path.relative(root, indexPath),
    clip_review: path.relative(root, clipReviewPath),
    manifest: path.relative(root, manifestPath),
    index_articles: indexAudit.blocks,
    clip_review_articles: clipAudit.blocks,
    ledger_titles: {
      index: count(indexHtml, /镜头后战况账本/g),
      clip_review: count(clipHtml, /镜头后战况账本/g),
    },
    problems,
    decision: problems.length ? "html_battle_ledger_failed" : "html_battle_ledger_passed",
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
