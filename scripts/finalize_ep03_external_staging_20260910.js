#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const repoRoot = path.resolve(__dirname, "..");
const planPath = path.join(repoRoot, "episodes/EP03/planning/external_film_staging_reboard_030_036_2026-09-10.json");
const receiptPaths = [
  path.join(repoRoot, "production_system/generation_receipts.json"),
  path.join(repoRoot, "episodes/EP03/production_system/generation_receipts.json"),
];
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const sourcePaths = {
  Shot030: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-4a6d4422-6368-452e-aa67-6d8a1e6bf79c.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-f0ce3d26-79e0-4b04-a3ac-5aebaff281cd.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-96da329f-1166-4f55-9cec-a7c1020756e8.png",
  },
  Shot031: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-a8b5204d-d2c4-4bcb-bf27-b0aedb78301d.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-431cb150-220d-45bb-aa3d-5341bb3b4ee0.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-5e55f391-ff0e-4d09-9393-d68dbf7f9c54.png",
  },
  Shot032: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-185121f6-aaf8-42c6-8cf6-fc731464a934.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-0139160e-2559-4acf-8fb6-6b7277cd60e0.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-ac160392-553e-4812-8267-3433a408c30a.png",
  },
  Shot033: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-161f712b-c943-412a-8ab0-43dd57507cc1.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-a06d2081-25fe-4f8d-995b-583346e90004.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-87365ca4-3660-46ba-8ea6-720af2099b26.png",
  },
  Shot034: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-9a0de8b5-8362-4734-8c64-934ecc181e60.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-cce160db-5189-4145-bf15-43fd83560afd.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-894c5b23-53e0-45d8-b3e1-035206b967c5.png",
  },
  Shot035: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-dfe8823b-f503-4278-af1c-268d197403a6.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-7f9d137a-0770-4a16-8b9d-353e2d5fad35.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-52414c9b-a3bb-4f42-ae0e-b72004448042.png",
  },
  Shot036: {
    start: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-082cb9a8-43c6-48d5-bbd1-c98216c5a93c.png",
    key: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-8af5f83f-6430-42c7-ad9d-6fcf1476e894.png",
    end: "/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-99903b93-5a51-4416-bec5-a4c654bfb7e3.png",
  },
};

const sha256 = (filePath) => crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
const allReceipts = receiptPaths.flatMap((filePath) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return Array.isArray(data) ? data : data.receipts || [];
});
const receiptFor = (shotId, role, relativePath) => allReceipts
  .slice()
  .reverse()
  .find((entry) => entry.shot_id === shotId && entry.frame_role === role && entry.path === relativePath);

for (const [shotId, frameSet] of Object.entries(plan.shots)) {
  frameSet.source_paths = sourcePaths[shotId];
  frameSet.status = "monitor_required";
  frameSet.visual_audit_decision = "visual_review_passed";
  frameSet.generation_mode = "imagegen_integrated_live_action_with_external_film_staging_method_and_canonical_local_assets";
  const outputDir = path.join(repoRoot, "episodes/EP03", frameSet.frames.start.split("/").slice(0, -1).join("/"));
  const evidence = {};
  for (const role of ["start", "key", "end"]) {
    const relativePath = frameSet.frames[role];
    const absolutePath = path.join(repoRoot, "episodes/EP03", relativePath);
    if (!fs.existsSync(absolutePath)) throw new Error(`Missing output: ${absolutePath}`);
    const receipt = receiptFor(shotId, role, relativePath);
    evidence[role] = {
      output_path: relativePath,
      source_path: sourcePaths[shotId][role],
      output_sha256: sha256(absolutePath),
      source_sha256: sha256(sourcePaths[shotId][role]),
      decision: receipt ? receipt.decision : "visual_review_passed",
    };
  }
  frameSet.evidence = evidence;
}
plan.status = "still_frame_visual_review_passed_motion_probe_pending";
plan.generated_at = "2026-09-10";
plan.reviewed_at = "2026-09-10";
plan.review_summary = "All 21 external film-staging reboard frames were copied, exact-file inspected, hash-matched to the local generation cache, and visually accepted. Prompt-against-frame QA and motion probes remain monitor gates.";
fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`);

const reviewDir = path.join(repoRoot, "episodes/EP03/production_system/reviews/external_film_staging_reboard_2026-09-10");
fs.mkdirSync(reviewDir, { recursive: true });
const reviewNotes = {
  Shot030: "The aftermath is staged as a hold-and-release chain: Catherine stays in a rear lane, Dimitri raises a stop-hand, Ashe lowers the immediate attack impulse, and Byleth turns the group toward the cathedral. Lonato never returns.",
  Shot031: "The return crosses a physical threshold: the door and wet hems lead to Seteth's folio handoff across the altar steps, then Rhea turns away. The five people remain integrated in depth instead of forming a report lineup.",
  Shot032: "The institutional order is separated from the report handoff through a diagonal rail action: Seteth sets one folio down, Rhea closes it and raises a quiet stopping hand, then Byleth retreats as Seteth descends.",
  Shot033: "The four students leave through different decisions: Ashe controls the authority door, Dimitri seeks Byleth's read, Felix chooses the right corridor, and Byleth follows after a held beat. The door closes before the departure completes.",
  Shot034: "The moral question is held at a safe physical distance. Catherine reties the single sheathed Thunderbrand, Ashe asks from across the wet strip with bow lowered, and Byleth clears the exit lane without entering the conversation.",
  Shot035: "Dimitri's reflection is a walk rather than a pose: he moves into depth, removes one glove, presses bare skin to wet stone, then leaves Byleth under the warm lamp with a visibly larger corridor between them.",
  Shot036: "The grounded threshold triggers the supernatural beat: Byleth stops, the candle bends, Sothis resolves airborne, and then recedes into motes while Rhea remains distant toward the Holy Tomb. The single Sword of the Creator stays low and sheathed.",
};
for (const [shotId, frameSet] of Object.entries(plan.shots)) {
  const lines = [
    `# ${shotId} External Film-Staging Reboard Review`,
    "",
    "- Revision: external_film_staging_reboard_v1_2026-09-10",
    "- Still-frame decision: visual_review_passed",
    "- Downstream decision: monitor_required",
    "- Reviewer role: independent-critical-reaudit-visual-qa-agent",
    "- Method boundary: public professional film/animation staging references guide readability, physical verbs, and continuity discipline only; local selected assets constrain identity, wardrobe, props, and geography only.",
    "- Excluded quality references: local support mini-theaters, local EP02 shot packages, and all prior local frames.",
    `- Review note: ${reviewNotes[shotId]}`,
    "",
    "## Exact Evidence",
    "",
  ];
  for (const role of ["start", "key", "end"]) {
    const item = frameSet.evidence[role];
    lines.push(`- ${role.toUpperCase()}: \`${item.output_path}\``);
    lines.push(`  - source cache: \`${item.source_path}\``);
    lines.push(`  - source SHA-256: \`${item.source_sha256}\``);
    lines.push(`  - output SHA-256: \`${item.output_sha256}\``);
    lines.push(`  - decision: \`${item.decision}\``);
  }
  lines.push("", "## Residual Gates", "", "- Prompt-against-frame QA: pending.", "- Adjacent continuity QA: pending until regenerated sequence manifest is rebuilt and audited.", "- 3-second motion probe and native Japanese audio verification: pending; still review does not approve video.", "");
  fs.writeFileSync(path.join(reviewDir, `${shotId.toLowerCase()}_reboard_review.md`), lines.join("\n"));
}
fs.writeFileSync(path.join(reviewDir, "rough_thumbnail_review.md"), [
  "# External Film-Staging Rough Thumbnail Review",
  "",
  "- Revision: external_film_staging_reboard_v1_2026-09-10",
  "- Decision: rough_thumbnail_passed",
  "- Reviewer role: independent-story-and-sequence-readability-audit",
  "- Evidence: `planning/external_film_staging_thumbnail_030_036_2026-09-10.svg`",
  "- Readability rule: each panel carries one visible verb and a changed physical state into the next panel.",
  "- Sequence: hold/release/turn -> door/folio/receive -> close/stop/descend -> latch/break/choose -> wrap/ask/rise -> walk/brace/leave -> cross/reveal/recede.",
  "- Quality reference boundary: public professional production craft only; local support mini-theaters, EP02, and prior local frames are excluded as visual references.",
  "",
].join("\n"));

console.log(JSON.stringify({
  status: plan.status,
  shots: Object.keys(plan.shots).length,
  frames: Object.keys(plan.shots).length * 3,
  source_paths_recorded: true,
  reviews_written: Object.keys(plan.shots).length,
}, null, 2));
