#!/usr/bin/env node
const cp = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const patcher = path.join(root, "scripts/apply_scene09_034B_empty_objective_authoritative_current.js");

const result = cp.spawnSync(process.execPath, [patcher], {
  cwd: root,
  encoding: "utf8",
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

if (result.status !== 0) process.exit(result.status || 1);

console.log(JSON.stringify({
  ok: true,
  decision: "deprecated_finalizer_redirected",
  note: "Scene09 V3 finalization is delegated to the current Shot034B Hanneman single-lane enforcement.",
}));
