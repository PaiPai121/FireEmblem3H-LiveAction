#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "specials", "kakeya_byleth_lecture");
const frameManifestPath = path.join(projectRoot, "frame_generation_manifest.json");
const deliveryManifestPath = path.join(projectRoot, "production_system", "video_delivery_manifest.json");
const reviewsRoot = path.join(projectRoot, "production_system", "reviews");
const reviewJsonPath = path.join(reviewsRoot, "character_identity_visual_audit_2026-08-02.json");
const reviewMdPath = path.join(reviewsRoot, "character_identity_visual_audit_2026-08-02.md");

const blockedShots = {
  SH002: {
    decision: "blocked_needs_identity_regeneration",
    visible_characters: ["Female Byleth", "Edelgard", "Lysithea", "Mercedes"],
    findings: [
      "Female Byleth is broadly recognizable, but the frame is not sufficient to approve the whole shot because the visible student trio fails asset fidelity.",
      "Edelgard reads as a generic pale-blonde red-cloak student, not the academy asset with black-red uniform, red leggings, and exact face/hair lock.",
      "Lysithea reads as a generic white-haired student; costume and face are not tightly matched to the academy selected asset.",
      "Mercedes reads as a generic blonde beige-cloak student; silhouette, face, and outfit do not tightly match the academy selected asset.",
      "Source frame spec previously allowed shoulder silhouettes while the generated frame shows fully visible students, creating an audit/spec contradiction."
    ],
  },
  SH010: {
    decision: "blocked_needs_identity_regeneration",
    visible_characters: ["Female Byleth", "Edelgard"],
    findings: [
      "Edelgard is a visible speaking character but reads as a generic red-cloak noble/student rather than the academy selected asset.",
      "The previous source frame spec treated the student as optional silhouette, which is incompatible with a visible Edelgard dialogue beat.",
      "Byleth is broadly readable but the shot cannot pass because the speaking student's identity is not asset-locked."
    ],
  },
  SH020: {
    decision: "blocked_needs_identity_regeneration",
    visible_characters: ["Female Byleth", "Edelgard", "Lysithea", "Mercedes"],
    findings: [
      "All three students are fully visible around the sand table, so shoulder-silhouette tolerance does not apply.",
      "Edelgard, Lysithea, and Mercedes are only house-color approximations and do not pass exact academy selected-asset fidelity.",
      "Because SH020 is a student objection beat, generic replacements weaken both story logic and continuity."
    ],
  },
  SH032: {
    decision: "blocked_needs_identity_regeneration",
    visible_characters: ["Female Byleth", "Edelgard", "Lysithea", "Mercedes"],
    findings: [
      "The students are visible in the name-reveal reaction shot, but are not asset-faithful enough to approve.",
      "The previous source frame spec listed only Female Byleth, while the generated frame visibly includes all three students.",
      "The board is useful, but the character layer must be regenerated or composited from approved assets before video submission."
    ],
  },
};

const requiredAssets = [
  "assets/characters/protagonist/BylethFemale/professor/selected.png",
  "assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png",
  "assets/characters/black_eagles/Edelgard/academy/selected.png",
  "assets/characters/golden_deer/Lysithea/academy/selected.png",
  "assets/characters/blue_lions/Mercedes/academy/selected.png",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

function writeJson(filePath, data) {
  writeText(filePath, JSON.stringify(data, null, 2));
}

const frameManifest = readJson(frameManifestPath);
for (const shot of frameManifest.shots || []) {
  const audit = blockedShots[shot.id];
  if (!audit) continue;
  shot.status = "blocked_needs_identity_regeneration";
  shot.review_status = "blocked_needs_identity_regeneration";
  shot.identity_visual_audit = {
    decision: audit.decision,
    review: "production_system/reviews/character_identity_visual_audit_2026-08-02.md",
    contact_sheet: "production_system/reviews/character_identity_contact_sheet_2026-08-02.png",
    required_assets: requiredAssets,
    findings: audit.findings,
  };
  shot.notes = `${shot.notes || ""} BLOCKED 2026-08-02: visible character identities do not match selected assets; regenerate start/key/end frames with exact academy assets before video submission.`;
}
writeJson(frameManifestPath, frameManifest);

const deliveryManifest = readJson(deliveryManifestPath);
deliveryManifest.status = "blocked_needs_identity_regeneration";
for (const shot of deliveryManifest.shots || []) {
  const audit = blockedShots[shot.id];
  if (!audit) continue;
  shot.status = "blocked_needs_identity_regeneration";
  shot.review_status = "blocked_needs_identity_regeneration";
  shot.risk_flags = [...new Set([...(shot.risk_flags || []), "character_identity_blocker", "needs_frame_regeneration"])];
  shot.character_identity_visual_audit = {
    decision: audit.decision,
    review: "production_system/reviews/character_identity_visual_audit_2026-08-02.md",
    contact_sheet: "production_system/reviews/character_identity_contact_sheet_2026-08-02.png",
    required_assets: requiredAssets,
    findings: audit.findings,
  };
}
deliveryManifest.character_identity_gate = {
  status: "blocked_needs_identity_regeneration",
  blocked_shots: Object.keys(blockedShots),
  review: "production_system/reviews/character_identity_visual_audit_2026-08-02.md",
  contact_sheet: "production_system/reviews/character_identity_contact_sheet_2026-08-02.png",
};
writeJson(deliveryManifestPath, deliveryManifest);

const audit = {
  status: "blocked_needs_identity_regeneration",
  created_at: "2026-08-02",
  reviewer_role: "character-identity-visual-reviewer",
  reviewed_contact_sheets: [
    "production_system/reviews/SH002_identity_contact_sheet_2026-08-02.png",
    "production_system/reviews/character_identity_contact_sheet_2026-08-02.png",
  ],
  required_assets: requiredAssets,
  blocked_shots: Object.entries(blockedShots).map(([id, data]) => ({ id, ...data })),
  pass_shots: [],
  decision: "Do not submit SH002, SH010, SH020, or SH032 to video generation until start/key/end frames are regenerated or composited from exact selected assets.",
};
writeJson(reviewJsonPath, audit);

const rows = Object.entries(blockedShots)
  .map(([id, data]) => `| ${id} | ${data.visible_characters.join(", ")} | ${data.decision} | ${data.findings.join("<br>")} |`)
  .join("\n");
writeText(reviewMdPath, `# 角色身份视觉审查：二维挂谷女贝老师短片

Status: \`blocked_needs_identity_regeneration\`
Date: 2026-08-02

## 结论

这次用户质疑成立。当前真实帧不能算完成视觉身份 QA：SH002、SH010、SH020、SH032 中的学生角色不是严格还原 selected asset，而是泛化的学级色彩替身。它们必须重生或基于 approved selected assets 重新合成之后，才可以进入视频生成。

## 对照图

- SH002 单镜头对照：\`production_system/reviews/SH002_identity_contact_sheet_2026-08-02.png\`
- 四个互动镜头总对照：\`production_system/reviews/character_identity_contact_sheet_2026-08-02.png\`

## 必须使用的角色资产

${requiredAssets.map((asset) => `- \`${asset}\``).join("\n")}

## 逐镜头结论

| 镜头 | 可见角色 | 决策 | 主要问题 |
| --- | --- | --- | --- |
${rows}

## 后续要求

- 这四个镜头不得提交视频模型。
- 重新生成 start/key/end 三帧时，必须把对应 selected.png 作为引用图，而不是只在文字提示词里写角色名。
- 网页、manifest、one-pass 队列都必须显示阻塞状态，直到新帧通过人工视觉审查。
`);

console.log(JSON.stringify({
  status: audit.status,
  blocked_shots: Object.keys(blockedShots),
  review_json: reviewJsonPath,
  review_md: reviewMdPath,
}, null, 2));
