#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const finalConcatInputsContractPath = path.join(packageDir, "final_concat_inputs_contract.json");
const finalConcatGatePath = path.join(packageDir, "final_concat_gate.json");
const defaultFinalOutput = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");
const outJson = path.join(reportDir, `scene09_v3_final_edit_structural_audit_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_final_edit_structural_audit_${date}.md`);
const packageOutJson = path.join(packageDir, "final_edit_structural_audit.json");
const packageOutMd = path.join(packageDir, "final_edit_structural_audit.md");
const finalConcatListName = "scene09_v3_attrition_final_edit.concat.txt";
const finalConcatProvenanceName = "scene09_v3_attrition_final_edit.provenance.json";

function parseArgs(argv) {
  const options = { file: defaultFinalOutput };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--file") {
      const value = argv[i + 1];
      if (!value) throw new Error("--file requires a path");
      options.file = path.resolve(value);
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/audit_scene09_v3_final_edit_structural.js [--file final.mp4]");
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function readJson(file, fallback = null) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function rel(file) {
  return path.relative(root, file);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function expectedClipFileRows(manifest) {
  return [...(manifest.shots || [])]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((shot) => {
      const absolute = path.isAbsolute(shot.expected_clip || "")
        ? shot.expected_clip
        : path.join(root, shot.expected_clip || "");
      const exists = fs.existsSync(absolute);
      const stat = exists ? fs.statSync(absolute) : null;
      return {
        order: Number(shot.order),
        shot: shot.shot,
        id: shot.id,
        expected_clip: shot.expected_clip,
        exists,
        size_bytes: stat?.size ?? null,
        sha256: exists ? sha256(absolute) : null,
      };
    });
}

function finalConcatInputSnapshot(manifest) {
  const rows = [...(manifest.shots || [])]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((shot) => ({
      order: Number(shot.order),
      shot: shot.shot,
      id: shot.id,
      duration_seconds: Number(shot.duration_seconds || 0),
      expected_clip: String(shot.expected_clip || ""),
    }));
  const orderedClipText = rows
    .map((row) => `${row.order},${row.shot},${row.id},${row.duration_seconds},${row.expected_clip}`)
    .join("\n") + "\n";
  const concatListText = rows
    .map((row) => `file '${path.join(root, row.expected_clip).replace(/'/g, "'\\''")}'`)
    .join("\n") + "\n";
  return {
    rows,
    ordered_clip_signature_sha256: sha256Text(orderedClipText),
    concat_list_preview_sha256: sha256Text(concatListText),
    concat_list_preview: concatListText,
  };
}

function finalConcatBinding(manifest) {
  const expected = Number(manifest.total_shots || (manifest.shots || []).length || 42);
  const snapshot = finalConcatInputSnapshot(manifest);
  const inputContract = readJson(finalConcatInputsContractPath, {});
  const concatGate = readJson(finalConcatGatePath, {});
  const problems = [];

  if (inputContract.decision !== "final_concat_inputs_contract_passed") {
    problems.push(`final_concat_inputs_contract decision ${inputContract.decision || "missing"}`);
  }
  if (Number(inputContract.expected_shots || 0) !== expected ||
      Number(inputContract.rows_checked || 0) !== expected ||
      Number(inputContract.unique_expected_clips || 0) !== expected) {
    problems.push("final_concat_inputs_contract counts do not match current package manifest");
  }
  if (Number(inputContract.duration_sum_seconds || 0) !== Number(manifest.total_duration_seconds || 0)) {
    problems.push("final_concat_inputs_contract duration does not match current package manifest");
  }
  if (inputContract.ordered_clip_signature_sha256 !== snapshot.ordered_clip_signature_sha256) {
    problems.push("final_concat_inputs_contract ordered clip signature mismatch");
  }
  if (inputContract.concat_list_preview_sha256 !== snapshot.concat_list_preview_sha256) {
    problems.push("final_concat_inputs_contract concat-list signature mismatch");
  }
  if (inputContract.concat_list_preview !== snapshot.concat_list_preview) {
    problems.push("final_concat_inputs_contract concat-list preview text mismatch");
  }

  if (concatGate.decision !== "final_concat_gate_passed_ready_for_project_pipeline_concat") {
    problems.push(`final_concat_gate decision ${concatGate.decision || "missing"}`);
  }
  if (Number(concatGate.passed_checks || 0) !== 8 || Number(concatGate.total_checks || 0) !== 8) {
    problems.push(`final_concat_gate checks ${concatGate.passed_checks || 0}/${concatGate.total_checks || 0} are not 8/8`);
  }
  if (Number(concatGate.direct_expected_clip_probe?.playable_clips || 0) !== expected ||
      Number(concatGate.direct_expected_clip_probe?.expected_clips || 0) !== expected) {
    problems.push("final_concat_gate direct expected-clip probe is not 42/42 for current package");
  }
  if (concatGate.current_final_concat_input_signatures?.ordered_clip_signature_sha256 !== snapshot.ordered_clip_signature_sha256) {
    problems.push("final_concat_gate ordered clip signature does not match current package manifest");
  }
  if (concatGate.current_final_concat_input_signatures?.concat_list_preview_sha256 !== snapshot.concat_list_preview_sha256) {
    problems.push("final_concat_gate concat-list signature does not match current package manifest");
  }

  return {
    ok: problems.length === 0,
    input_contract: {
      file: rel(finalConcatInputsContractPath),
      decision: inputContract.decision || null,
      ordered_clip_signature_sha256: inputContract.ordered_clip_signature_sha256 || null,
      concat_list_preview_sha256: inputContract.concat_list_preview_sha256 || null,
    },
    final_concat_gate: {
      file: rel(finalConcatGatePath),
      decision: concatGate.decision || null,
      passed_checks: concatGate.passed_checks ?? null,
      total_checks: concatGate.total_checks ?? null,
      direct_playable_clips: concatGate.direct_expected_clip_probe?.playable_clips ?? null,
      direct_expected_clips: concatGate.direct_expected_clip_probe?.expected_clips ?? null,
    },
    current_signatures: {
      ordered_clip_signature_sha256: snapshot.ordered_clip_signature_sha256,
      concat_list_preview_sha256: snapshot.concat_list_preview_sha256,
    },
    problems,
  };
}

function finalConcatSidecar(file, manifest) {
  const sidecar = path.join(path.dirname(file), finalConcatListName);
  const snapshot = finalConcatInputSnapshot(manifest);
  const exists = fs.existsSync(sidecar);
  const stat = exists ? fs.statSync(sidecar) : null;
  const text = exists ? fs.readFileSync(sidecar, "utf8") : "";
  const sha = exists ? sha256Text(text) : null;
  const problems = [];

  if (!exists) {
    problems.push(`missing final concat sidecar ${rel(sidecar)}`);
  } else {
    if (text !== snapshot.concat_list_preview) {
      problems.push("final concat sidecar text does not match current package manifest concat list");
    }
    if (sha !== snapshot.concat_list_preview_sha256) {
      problems.push("final concat sidecar SHA-256 does not match current package manifest concat list");
    }
  }

  return {
    ok: problems.length === 0,
    file: rel(sidecar),
    file_absolute: sidecar,
    exists,
    size_bytes: stat?.size ?? null,
    sha256: sha,
    expected_sha256: snapshot.concat_list_preview_sha256,
    problems,
  };
}

function finalConcatProvenance(file, manifest, finalEdit, concatSidecar) {
  const provenancePath = path.join(path.dirname(file), finalConcatProvenanceName);
  const exists = fs.existsSync(provenancePath);
  const provenance = readJson(provenancePath, {});
  const currentClipRows = expectedClipFileRows(manifest);
  const currentClipRowsDigest = sha256Text(`${JSON.stringify(currentClipRows)}\n`);
  const problems = [];

  if (!exists) {
    problems.push(`missing final concat provenance ${rel(provenancePath)}`);
  } else {
    if (provenance.final_output !== rel(file)) {
      problems.push(`final_output ${provenance.final_output || "missing"} does not match ${rel(file)}`);
    }
    if (provenance.final_output_absolute && path.resolve(provenance.final_output_absolute) !== file) {
      problems.push("final_output_absolute does not match audited final mp4");
    }
    if (provenance.final_output_sha256 !== finalEdit.sha256) {
      problems.push("final_output_sha256 does not match audited final mp4 SHA-256");
    }
    if (provenance.concat_list_sidecar !== concatSidecar.file) {
      problems.push("concat_list_sidecar does not match audited concat sidecar");
    }
    if (provenance.concat_list_sha256 !== concatSidecar.sha256 ||
        provenance.concat_list_sha256 !== concatSidecar.expected_sha256) {
      problems.push("concat_list_sha256 does not match current package manifest concat list");
    }
    if (!Array.isArray(provenance.expected_clip_file_rows) ||
        JSON.stringify(provenance.expected_clip_file_rows) !== JSON.stringify(currentClipRows)) {
      problems.push("expected_clip_file_rows do not match current expected clip files");
    }
    if (provenance.expected_clip_file_rows_digest_sha256 !== currentClipRowsDigest) {
      problems.push("expected_clip_file_rows_digest_sha256 does not match current expected clip files");
    }
    if (!["copy", "reencode", "fixture"].includes(provenance.mode)) {
      problems.push(`mode ${provenance.mode || "missing"} is not accepted`);
    }
    if (![
      "run_scene09_v3_video_pipeline.concatClips",
      "final_edit_positive_contract_fixture",
      "video_generation_run_positive_contract_fixture",
    ].includes(provenance.generated_by)) {
      problems.push(`generated_by ${provenance.generated_by || "missing"} is not an accepted final concat producer`);
    }
  }

  return {
    ok: problems.length === 0,
    file: rel(provenancePath),
    file_absolute: provenancePath,
    exists,
    generated_by: provenance.generated_by || null,
    mode: provenance.mode || null,
    final_output_sha256: provenance.final_output_sha256 || null,
    concat_list_sha256: provenance.concat_list_sha256 || null,
    expected_clip_file_rows_digest_sha256: provenance.expected_clip_file_rows_digest_sha256 || null,
    current_expected_clip_file_rows_digest_sha256: currentClipRowsDigest,
    problems,
  };
}

function ffprobe(file) {
  const result = cp.spawnSync("ffprobe", [
    "-v", "error",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    file,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    return { ok: false, error: result.stderr.trim() || `ffprobe exited ${result.status}` };
  }
  try {
    return { ok: true, data: JSON.parse(result.stdout) };
  } catch (error) {
    return { ok: false, error: `ffprobe JSON parse failed: ${error.message}` };
  }
}

function auditFinalEdit(file, expectedDuration) {
  if (!fs.existsSync(file)) {
    return {
      exists: false,
      ok: false,
      issue: "final_edit_pending",
      detail: "Final edit mp4 does not exist yet.",
    };
  }
  const stat = fs.statSync(file);
  if (stat.size === 0) {
    return { exists: true, ok: false, issue: "zero_byte_final_edit", size_bytes: stat.size };
  }
  const probed = ffprobe(file);
  if (!probed.ok) {
    return { exists: true, ok: false, issue: "ffprobe_failed", size_bytes: stat.size, error: probed.error };
  }
  const videoStream = (probed.data.streams || []).find((stream) => stream.codec_type === "video");
  const audioStream = (probed.data.streams || []).find((stream) => stream.codec_type === "audio");
  const duration = Number(probed.data.format?.duration || 0);
  const durationDelta = Math.abs(duration - expectedDuration);
  const durationOk = Number.isFinite(duration) && duration > 0 && durationDelta <= 3;
  const ok = Boolean(videoStream) && durationOk;
  return {
    exists: true,
    ok,
    issue: !videoStream ? "missing_video_stream" : durationOk ? null : "duration_out_of_tolerance",
    size_bytes: stat.size,
    sha256: sha256(file),
    duration_seconds: duration,
    expected_duration_seconds: expectedDuration,
    duration_delta_seconds: durationDelta,
    video_codec: videoStream?.codec_name || null,
    width: videoStream?.width || null,
    height: videoStream?.height || null,
    audio_codec: audioStream?.codec_name || null,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const expectedDuration = Number(manifest.total_duration_seconds || 252);
  const finalEdit = auditFinalEdit(options.file, expectedDuration);
  const concatBinding = finalConcatBinding(manifest);
  const concatSidecar = finalConcatSidecar(options.file, manifest);
  const concatProvenance = finalConcatProvenance(options.file, manifest, finalEdit, concatSidecar);
  const decision = !finalEdit.exists
    ? "final_edit_pending"
    : finalEdit.ok && concatBinding.ok && concatSidecar.ok && concatProvenance.ok
      ? "final_edit_structural_passed"
      : "final_edit_structural_blocked";
  const report = {
    date,
    package_id: manifest.package_id,
    package_manifest: rel(manifestPath),
    final_output: rel(options.file),
    final_output_absolute: options.file,
    expected_duration_seconds: expectedDuration,
    decision,
    final_edit: finalEdit,
    final_concat_binding: concatBinding,
    final_concat_sidecar: concatSidecar,
    final_concat_provenance: concatProvenance,
    structural_checks: [
      "final mp4 path exists",
      "file is non-zero",
      "ffprobe can parse container metadata",
      "at least one video stream is present",
      "duration is within +/-3s of package total duration",
      "final concat input contract signatures match the current package manifest",
      "final concat gate passed 8/8 against the current expected clip list before final edit approval",
      "final edit concat sidecar exists beside the mp4 and matches the current concat list exactly",
      "final edit concat provenance exists beside the mp4 and binds final SHA, concat-list SHA, source clip rows, and concat producer",
    ],
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Final Edit Structural Audit",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Final output: \`${report.final_output}\``,
    `Expected duration: ${expectedDuration}s`,
    "",
    "## Result",
    "",
    `- Exists: ${finalEdit.exists ? "yes" : "no"}`,
    `- OK: ${finalEdit.ok ? "yes" : "no"}`,
    `- Issue: ${finalEdit.issue || "none"}`,
    `- Final concat binding: ${concatBinding.ok ? "ok" : "blocked"}`,
    `- Final concat sidecar: ${concatSidecar.ok ? "ok" : "blocked"}`,
    `- Final concat provenance: ${concatProvenance.ok ? "ok" : "blocked"}`,
    finalEdit.duration_seconds != null ? `- Duration: ${finalEdit.duration_seconds}s` : "",
    finalEdit.video_codec ? `- Video: ${finalEdit.video_codec} ${finalEdit.width || "?"}x${finalEdit.height || "?"}` : "",
    finalEdit.audio_codec ? `- Audio: ${finalEdit.audio_codec}` : "",
    "",
    "## Structural Checks",
    "",
    ...report.structural_checks.map((item) => `- ${item}`),
    "",
    "## Final Concat Binding Problems",
    "",
    concatBinding.problems.length ? concatBinding.problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Final Concat Sidecar Problems",
    "",
    concatSidecar.problems.length ? concatSidecar.problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Final Concat Provenance Problems",
    "",
    concatProvenance.problems.length ? concatProvenance.problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].filter((line) => line !== "").join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  console.log(JSON.stringify({
    decision,
    final_output: report.final_output,
    exists: finalEdit.exists,
    ok: finalEdit.ok,
    issue: finalEdit.issue,
    final_concat_binding_ok: concatBinding.ok,
    final_concat_sidecar_ok: concatSidecar.ok,
    final_concat_provenance_ok: concatProvenance.ok,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));

  if (decision === "final_edit_structural_blocked") process.exit(1);
}

main();
