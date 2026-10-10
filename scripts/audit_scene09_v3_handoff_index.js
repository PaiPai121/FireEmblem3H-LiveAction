#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const htmlPath = path.join(packageDir, "index.html");
const packageManifestPath = path.join(packageDir, "package_manifest.json");
const reportPath = path.join(reportDir, "scene09_v3_handoff_index_audit_2026-08-01.json");

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

function flattenGroups(groups) {
  return Object.entries(groups || {})
    .flatMap(([group, names]) => (Array.isArray(names) ? names.map((name) => `${group}: ${name}`) : []));
}

function flattenNames(groups) {
  return Object.values(groups || {}).flatMap((names) => (Array.isArray(names) ? names : []));
}

function changeList(changes) {
  return (Array.isArray(changes) ? changes : [])
    .map((item) => `${item.name || item}:${item.status || item.label || "changed"}`);
}

function articleBlock(html, shot) {
  const startToken = `<article class="shot-card" id="${shot}"`;
  const start = html.indexOf(startToken);
  if (start === -1) return "";
  const next = html.indexOf('<article class="shot-card"', start + startToken.length);
  return html.slice(start, next === -1 ? html.length : next);
}

function localLinks(html) {
  const links = [];
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const raw = decodeHtml(match[1]);
    if (/^(https?:|mailto:|#|javascript:)/.test(raw)) continue;
    links.push(raw.split("#")[0]);
  }
  return links.filter(Boolean);
}

function main() {
  if (!fs.existsSync(htmlPath)) throw new Error(`Missing handoff index: ${htmlPath}`);
  if (!fs.existsSync(packageManifestPath)) throw new Error(`Missing package manifest: ${packageManifestPath}`);

  const html = fs.readFileSync(htmlPath, "utf8");
  const manifest = readJson(packageManifestPath);
  const checked = [];
  const missing = [];

  for (const raw of localLinks(html)) {
    const target = path.resolve(packageDir, raw);
    const exists = fs.existsSync(target);
    checked.push({ raw, target: path.relative(root, target), exists });
    if (!exists) missing.push({ raw, target: path.relative(root, target) });
  }

  const expectedShots = Number(manifest.total_shots || (manifest.shots || []).length);
  const shotCards = (html.match(/class="shot-card"/g) || []).length;
  const problems = [];
  const warnings = [];
  if (shotCards !== expectedShots) problems.push(`shot cards ${shotCards}/${expectedShots}`);
  if (!html.includes("EP02 Scene09 V3 Monitor Handoff Package")) problems.push("missing page title");
  if (!html.includes("镜头025：规则与三方目标确立")) problems.push("missing Chinese handoff shot title for Shot025");
  if (!html.includes("镜头032：杜笃受伤，梅尔塞德斯治疗重建盾线")) problems.push("missing Chinese handoff shot title for Shot032");
  if (!html.includes("镜头034B：空教师目标裁定")) problems.push("missing Chinese handoff shot title for Shot034B");
  if (/<h2>Shot\d+[A-Z]?\s*<span>/.test(html)) problems.push("handoff shot cards still use bare English Shot titles");
  if (html.includes("Status: monitor_handoff_ready_clips_pending")) problems.push("handoff index still exposes old monitor-ready status");
  if (!html.includes("critical_reaudit_blocked_needs_revision")) problems.push("missing critical re-audit blocked status");
  if (!html.includes("clips_pending")) problems.push("missing clips pending status");
  const auditDetailsCount = (html.match(/<details class="audit-details">/g) || []).length;
  const defaultOpenAuditDetails = (html.match(/<details class="audit-details"\s+open/g) || []).length;
  const firstAuditDetails = html.indexOf('<details class="audit-details">');
  const headerStart = html.indexOf('<header class="package-head">');
  const directHeaderBeforeDetails = firstAuditDetails > -1
    ? html.slice(headerStart, firstAuditDetails)
    : html.slice(headerStart, html.indexOf("</header>"));
  const directHeaderParagraphs = (directHeaderBeforeDetails.match(/<p\b/g) || []).length;
  if (auditDetailsCount < 2) problems.push(`expected at least 2 collapsed audit-details blocks, found ${auditDetailsCount}`);
  if (defaultOpenAuditDetails) problems.push(`audit-details blocks must be collapsed by default, found open ${defaultOpenAuditDetails}`);
  if (directHeaderParagraphs > 3) problems.push(`too many direct header paragraphs before folded QA: ${directHeaderParagraphs}`);
  for (const requiredQuickLink of ["开始看镜头025", "杜笃 / 梅尔塞德斯治疗镜头", "教师目标裁定", "结尾镜头036"]) {
    if (!html.includes(requiredQuickLink)) problems.push(`missing quick viewing link ${requiredQuickLink}`);
  }
  if (!html.includes("详细 QA 状态（默认折叠）")) problems.push("missing collapsed detailed QA summary");
  if (!html.includes("全部生产文档链接（默认折叠）")) problems.push("missing collapsed production document links summary");
  if (!html.includes("Hanneman and Manuela are separate faculty examiners")) {
    problems.push("missing teacher separation lock");
  }
  if (!html.includes("Captured Hubert, captured Dorothea, and captured Bernadetta must not reappear")) {
    problems.push("missing captured-character must-not-return lock");
  }
  if (!html.includes("No unnamed extras")) problems.push("missing no-unnamed-extras lock");
  if (!html.includes("clip_return_roundtrip_passed")) problems.push("missing clip return roundtrip passed status");
  if (!html.includes("nested_intake_root_expected_filenames")) problems.push("missing nested intake-root return summary");
  if (!html.includes("unsupported_format_rejected")) problems.push("missing unsupported-format rejection summary");
  if (!html.includes("invalid_mp4_rejected")) problems.push("missing invalid mp4 rejection summary");
  const requiredPackageReportLinks = [
    "OPERATOR_NEXT_STEPS.md",
    "OPERATOR_NEXT_STEPS.json",
    "provider_upload_bundles_audit.md",
    "provider_upload_bundles_audit.json",
    "per_frame_visual_review_matrix.html",
    "clip_return_intake_audit.md",
    "clip_return_intake_audit.json",
    "clip_revision_queue.md",
    "clip_revision_queue.json",
    "clip_revision_queue.csv",
    "motion_probe_provider_bundles/index.html",
    "motion_probe_submission_ready_gate.md",
    "motion_probe_submission_ready_gate.json",
    "motion_probe_operator_tracker.html",
    "motion_probe_operator_tracker.json",
    "motion_probe_operator_tracker.csv",
    "motion_probe_operator_tracker_audit.md",
    "motion_probe_operator_tracker_audit.json",
    "handoff_control_reports_audit.md",
    "handoff_control_reports_audit.json",
    "provider_ingest_provenance_contract.md",
    "provider_ingest_provenance_contract.json",
    "final_concat_inputs_contract.md",
    "final_concat_inputs_contract.json",
    "ep02_web_media_refs_audit.md",
    "ep02_web_media_refs_audit.json",
    "ep02_web_battle_event_panel_audit.json",
    "web_submission_prompt_surface_audit.md",
    "web_submission_prompt_surface_audit.json",
  ];
  for (const linkText of requiredPackageReportLinks) {
    if (!html.includes(linkText)) problems.push(`missing package-local report link ${linkText}`);
  }
  if (!html.includes("Provider upload bundles audit: provider_upload_bundles_ready")) {
    problems.push("missing provider upload bundles audit ready summary");
  }
  if (!html.includes("Motion probe operator tracker: motion_probe_operator_tracker_ready_clips_pending")) {
    problems.push("missing motion probe operator tracker clips-pending summary");
  }
  if (!html.includes("Motion probe operator tracker audit: motion_probe_operator_tracker_audit_passed")) {
    problems.push("missing motion probe operator tracker audit passed summary");
  }
  if (!html.includes("Handoff control reports audit: handoff_control_reports_audit_passed")) {
    problems.push("missing handoff control reports audit passed summary");
  }
  if (!html.includes("checked 11") || !html.includes("declared 11")) {
    problems.push("missing handoff control reports audit counts");
  }
  if (!html.includes("Critical visual re-audit: critical_reaudit_blocked_needs_revision")) {
    problems.push("missing critical visual re-audit summary");
  }
  if (!html.includes("blocked 17") || !html.includes("layout 4") || !html.includes("monitor 21")) {
    problems.push("missing critical visual re-audit counts");
  }
  if (!html.includes("critical_reaudit_2026-08-12.md")) problems.push("missing critical visual re-audit report link");
  if (!html.includes("full_local_visual_review.md") || !html.includes("full_local_visual_review.json")) {
    problems.push("missing full local visual review links");
  }
  if (!html.includes("batches 7") || !html.includes("rows 42") || !html.includes("returned 0/42") || !html.includes("ingested 0/42")) {
    problems.push("missing motion probe operator tracker counts");
  }
  if (!html.includes("csv 42")) {
    problems.push("missing motion probe operator tracker audit csv count");
  }
  if (!html.includes("Clip return intake audit: clip_return_intake_ready")) {
    problems.push("missing clip return intake audit ready summary");
  }
  if (!html.includes("Clip revision queue: clip_generation_or_revision_actions_required") &&
      !/Clip revision queue:[^<]*actionable\s+0\b/.test(html)) {
    problems.push("missing clip revision queue actionable summary");
  }
  if (!html.includes("Provider-ingest provenance contract: provider_ingest_provenance_contract_passed")) {
    problems.push("missing provider-ingest provenance contract passed summary");
  }
  if (!html.includes("missing source_sha256 rejected yes")) {
    problems.push("missing provider-ingest source_sha256 rejection summary");
  }
  if (!html.includes("Final concat inputs contract: final_concat_inputs_contract_passed")) {
    problems.push("missing final concat inputs contract passed summary");
  }
  if (!html.includes("EP02 web media refs: ep02_web_media_refs_passed_videos_pending")) {
    problems.push("missing EP02 web media refs pending-video summary");
  }
  if (!html.includes("EP02 web battle event panel: ep02_web_battle_event_panel_audit_passed")) {
    problems.push("missing EP02 web battle event panel passed summary");
  }
  if (!html.includes("Web submission prompt surface: web_submission_prompt_surface_passed")) {
    problems.push("missing web submission prompt surface passed summary");
  }
  if (!html.includes("model-ready links 42/42") || !html.includes("provider prompt contracts 84/84")) {
    problems.push("missing web submission prompt surface counts");
  }
  if (!html.includes("Operator next steps:")) {
    problems.push("missing operator next steps summary");
  }
  if (!html.includes("next submit_motion_probes") &&
      !html.includes("next submit_full_duration_batches") &&
      !html.includes("next run_local_video_cli") &&
      !html.includes("critical_reaudit_blocked_needs_revision")) {
    problems.push("missing actionable operator next step");
  }
  if (!html.includes("motion_self_audit_apply_positive_contract")) {
    warnings.push("missing positive motion self-audit contract link text");
  }

  const requiredLedgerHeadings = [
    "Alive / Safe After",
    "Visible But No Active Combat After",
    "Active / Controlling After",
    "Defeated / Removed After",
    "Captured / Objective-Defeated After",
    "Stood Down / Post-Battle After",
    "Must Not Return Active",
    "Changed This Shot",
  ];
  for (const shot of manifest.shots || []) {
    const block = articleBlock(html, shot.shot);
    if (!block) {
      problems.push(`${shot.shot}: missing shot-card block`);
      continue;
    }
    const metadataPath = path.join(packageDir, shot.package_dir, "metadata.json");
    if (!fs.existsSync(metadataPath)) {
      problems.push(`${shot.shot}: missing metadata for ledger preview check`);
      continue;
    }
    const metadata = readJson(metadataPath);
    const ledger = metadata.battle_state_after?.battle_ledger_after || metadata.battle_ledger_after || {};
    for (const heading of requiredLedgerHeadings) {
      if (!block.includes(heading)) problems.push(`${shot.shot}: handoff card missing ledger heading ${heading}`);
    }
    const alive = flattenGroups(ledger.alive_by_house);
    const active = flattenGroups(ledger.still_active_or_controlling_objective_by_house);
    const activeNames = new Set(flattenNames(ledger.still_active_or_controlling_objective_by_house));
    const visible = Array.isArray(metadata.visible_named_only || shot.visible_named_only)
      ? (metadata.visible_named_only || shot.visible_named_only)
      : [];
    const visibleButNoActive = visible.filter((name) => name && !activeNames.has(name));
    const removed = flattenGroups(ledger.mock_battle_defeated_or_removed_by_house);
    const captured = flattenGroups(ledger.captured_or_objective_defeated_by_house);
    const stoodDown = flattenGroups(ledger.stood_down_or_post_battle_by_house);
    const mustNotReturn = flattenGroups(ledger.must_not_return_active_by_house);
    const changed = changeList(ledger.changed_this_shot);
    const requiredLedgerValues = [
      ...alive.slice(0, 3),
      ...visibleButNoActive,
      ...active.slice(0, 3),
      ...removed,
      ...captured,
      ...stoodDown,
      ...mustNotReturn,
      ...changed,
    ];
    for (const value of requiredLedgerValues) {
      if (value && !block.includes(value)) problems.push(`${shot.shot}: handoff card missing ledger value ${value}`);
    }
  }

  const report = {
    date: "2026-08-01",
    html: path.relative(root, htmlPath),
    package_manifest: path.relative(root, packageManifestPath),
    links_checked: checked.length,
    missing_links: missing,
    shot_cards: shotCards,
    watchability: {
      audit_details_blocks: auditDetailsCount,
      default_open_audit_details: defaultOpenAuditDetails,
      direct_header_paragraphs_before_folded_qa: directHeaderParagraphs,
      quick_view_links_present: ["开始看镜头025", "杜笃 / 梅尔塞德斯治疗镜头", "教师目标裁定", "结尾镜头036"]
        .every((text) => html.includes(text)),
    },
    problems,
    warnings,
    decision: missing.length || problems.length ? "handoff_index_failed" : "handoff_index_file_access_passed",
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (report.decision !== "handoff_index_file_access_passed") process.exit(1);
}

main();
