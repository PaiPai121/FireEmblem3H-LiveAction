#!/usr/bin/env node
const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function run(label, args) {
  const result = cp.spawnSync(args[0], args.slice(1), {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(`${label} failed:\n${result.stdout || ""}\n${result.stderr || ""}`);
  }
  return result.stdout.trim();
}

function clearImmutable() {
  const targets = [
    "scripts",
    "production_system",
    "delivery",
    "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21",
  ].filter((rel) => fs.existsSync(path.join(root, rel)));
  if (!targets.length) return;
  run("clear immutable flags", ["find", ...targets, "-flags", "uchg", "-exec", "chflags", "nouchg", "{}", "+"]);
}

function main() {
  const node = process.execPath;
  clearImmutable();
  run("apply current Shot034B contract", [node, "scripts/blue_lions_mock_battle_current_contract.js"]);
  run("sync submission payload", [node, "scripts/sync_scene09_v3_delivery_payload_current.js"]);
  run("build battle ledger timeline", [node, "scripts/build_scene09_v3_battle_ledger_timeline.js"]);
  run("build submission queue with battle ledger", [node, "scripts/build_scene09_v3_submission_queue_with_battle_ledger.js"]);
  run("build model submission batches", [node, "scripts/build_scene09_v3_model_submission_batches.js"]);
  run("build model submission index", [node, "scripts/build_scene09_v3_model_submission_index.js"]);
  run("build handoff index", [node, "scripts/build_scene09_v3_handoff_index.js"]);
  run("build main gallery", [node, "scripts/build_scene09_rebuild_v2_gallery.js"]);
  run("build clip review gallery", [node, "scripts/build_scene09_v3_clip_review_gallery.js"]);
  run("build operator execution profile", [node, "scripts/build_scene09_v3_operator_execution_profile.js"]);
  run("build provider upload bundles", [node, "scripts/build_scene09_v3_provider_upload_bundles.js"]);
  run("audit provider upload bundles", [node, "scripts/audit_scene09_v3_provider_upload_bundles.js"]);
  run("build clip return intake", [node, "scripts/build_scene09_v3_clip_return_intake_package.js"]);
  run("audit clip return intake", [node, "scripts/audit_scene09_v3_clip_return_intake.js"]);
  run("build motion self-audit packet", [node, "scripts/build_scene09_v3_motion_self_audit_packet.js"]);
  run("audit motion self-audit packet", [node, "scripts/audit_scene09_v3_motion_self_audit_packet.js"]);
  run("rebuild handoff index after provider bundles", [node, "scripts/build_scene09_v3_handoff_index.js"]);
  run("audit actual delivery surface", [node, "scripts/audit_scene09_v3_actual_delivery_surface_20260731.js"]);
  run("audit model submission batches", [node, "scripts/audit_scene09_v3_model_submission_batches.js"]);
  run("audit model submission index", [node, "scripts/audit_scene09_v3_model_submission_index.js"]);
  run("audit handoff index", [node, "scripts/audit_scene09_v3_handoff_index.js"]);
  console.log(JSON.stringify({
    ok: true,
    decision: "scene09_034b_current_surfaces_finalized",
    includes_submission_queue_with_battle_ledger: true,
  }, null, 2));
}

main();
