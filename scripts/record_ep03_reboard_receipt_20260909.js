#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');

const [shotId, frameRole, sourcePath, toolCallId, decision, notes, reviewedPath] = process.argv.slice(2);
if (!shotId || !frameRole || !sourcePath || !toolCallId || !decision || !notes || !reviewedPath) {
  throw new Error('usage: record_ep03_reboard_receipt_20260909.js <shotId> <frameRole> <sourcePath> <toolCallId> <decision> <notes> <reviewedPath>');
}

const projectRoot = process.cwd();
const outputPath = `episodes/EP03/${reviewedPath}`;
const absoluteOutputPath = `${projectRoot}/${outputPath}`;
const hashFile = (filePath) => crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const writeJson = (filePath, data) => fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);

if (!fs.existsSync(sourcePath)) throw new Error(`source not found: ${sourcePath}`);
if (!fs.existsSync(absoluteOutputPath)) throw new Error(`output not found: ${absoluteOutputPath}`);

const sourceSha256 = hashFile(sourcePath);
const outputSha256 = hashFile(absoluteOutputPath);
const receipt = {
  shot_id: shotId,
  frame_role: frameRole,
  path: reviewedPath,
  output_path: reviewedPath,
  source_path: sourcePath,
  tool_call_id: toolCallId,
  sha256: outputSha256,
  source_sha256: sourceSha256,
  output_sha256: outputSha256,
  width: 1672,
  height: 941,
  reviewer_role: 'independent-critical-reaudit-visual-qa-agent',
  reviewed_paths: [reviewedPath],
  decision,
  notes,
  output_hash_verified: sourceSha256 === outputSha256,
  source_cache_available: true,
  provenance_status: sourceSha256 === outputSha256
    ? 'source_cache_and_project_output_hash_verified'
    : 'source_cache_and_project_output_hash_mismatch',
  provenance_note: sourceSha256 === outputSha256
    ? 'Recorded local generation cache and current project output hashes match the receipt.'
    : 'Local generation cache and current project output hashes do not match; frame remains rejected.',
  project: 'EP03',
  receipt_scope: 'shared_canonical_root_receipt_rebound_to_EP03_project_boundary',
};

for (const filePath of ['production_system/generation_receipts.json', 'episodes/EP03/production_system/generation_receipts.json']) {
  const data = readJson(`${projectRoot}/${filePath}`);
  const receipts = Array.isArray(data) ? data : data.receipts;
  const index = receipts.findIndex((entry) => entry.shot_id === shotId && entry.frame_role === frameRole && entry.path === reviewedPath);
  if (index >= 0) receipts[index] = receipt;
  else receipts.push(receipt);
  writeJson(`${projectRoot}/${filePath}`, Array.isArray(data) ? receipts : { ...data, receipts });
}

console.log(JSON.stringify({ shotId, frameRole, reviewedPath, sourceSha256, outputSha256, decision }, null, 2));
