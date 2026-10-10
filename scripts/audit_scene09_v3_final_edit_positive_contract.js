#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const cp = require("child_process");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const outJson = path.join(reportDir, `scene09_v3_final_edit_positive_contract_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_final_edit_positive_contract_${date}.md`);
const packageOutJson = path.join(packageDir, "final_edit_positive_contract.json");
const packageOutMd = path.join(packageDir, "final_edit_positive_contract.md");
const productionFinalOutput = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
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

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
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
        sha256: exists ? sha256File(absolute) : null,
      };
    });
}

function createExpectedClipFixtures(tmpRoot, manifest) {
  const clipDir = path.join(tmpRoot, "expected_clips");
  fs.mkdirSync(clipDir, { recursive: true });
  const sampleClip = path.join(clipDir, "sample_valid_expected_clip.mp4");
  const result = cp.spawnSync("ffmpeg", [
    "-y",
    "-f", "lavfi",
    "-i", "color=c=black:s=160x90:r=12:d=0.5",
    "-an",
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-pix_fmt", "yuv420p",
    sampleClip,
  ], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(`ffmpeg final-edit expected-clip fixture failed: ${result.error?.message || result.stderr || result.status}`);
  }
  return (manifest.shots || []).map((shot) => {
    const file = path.join(clipDir, `${String(shot.order).padStart(2, "0")}_${shot.shot}.mp4`);
    fs.copyFileSync(sampleClip, file);
    return {
      ...shot,
      expected_clip: rel(file),
    };
  });
}

function writeFinalConcatBindingReports(tmpPackageDir, fixtureManifest) {
  const rows = [...(fixtureManifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order));
  const expected = Number(fixtureManifest.total_shots || rows.length);
  const orderedClipText = rows
    .map((shot) => `${Number(shot.order)},${shot.shot},${shot.id},${Number(shot.duration_seconds || 0)},${shot.expected_clip}`)
    .join("\n") + "\n";
  const concatListText = rows
    .map((shot) => `file '${path.join(root, shot.expected_clip).replace(/'/g, "'\\''")}'`)
    .join("\n") + "\n";
  const orderedSignature = sha256Text(orderedClipText);
  const concatSignature = sha256Text(concatListText);
  const inputContract = {
    date,
    package_id: fixtureManifest.package_id,
    package_manifest: rel(path.join(tmpPackageDir, "package_manifest.json")),
    decision: "final_concat_inputs_contract_passed",
    expected_shots: expected,
    rows_checked: expected,
    unique_expected_clips: expected,
    expected_duration_seconds: Number(fixtureManifest.total_duration_seconds || 0),
    duration_sum_seconds: rows.reduce((sum, shot) => sum + Number(shot.duration_seconds || 0), 0),
    ordered_clip_signature_sha256: orderedSignature,
    concat_list_preview_sha256: concatSignature,
    concat_list_preview: concatListText,
    problems: [],
    rows: rows.map((shot) => ({
      order: Number(shot.order),
      shot: shot.shot,
      id: shot.id,
      duration_seconds: Number(shot.duration_seconds || 0),
      expected_clip: shot.expected_clip,
      expected_clip_absolute: path.join(root, shot.expected_clip),
      concat_list_line: `file '${path.join(root, shot.expected_clip).replace(/'/g, "'\\''")}'`,
      problems: [],
    })),
  };
  writeJson(path.join(tmpPackageDir, "final_concat_inputs_contract.json"), inputContract);
  writeJson(path.join(tmpPackageDir, "final_concat_gate.json"), {
    date,
    package_id: fixtureManifest.package_id,
    package_manifest: rel(path.join(tmpPackageDir, "package_manifest.json")),
    expected_shots: expected,
    decision: "final_concat_gate_passed_ready_for_project_pipeline_concat",
    passed_checks: 8,
    total_checks: 8,
    failed_checks: [],
    direct_expected_clip_probe: {
      playable_clips: expected,
      expected_clips: expected,
      rows: rows.map((shot) => ({
        order: shot.order,
        shot: shot.shot,
        id: shot.id,
        expected_clip: shot.expected_clip,
        probe: { exists: true, ok: true, issue: null },
      })),
    },
    current_final_concat_input_signatures: {
      ordered_clip_signature_sha256: orderedSignature,
      concat_list_preview_sha256: concatSignature,
    },
    checks: [],
  });
  return { concatListText, concatSignature, orderedSignature };
}

function parseLastJson(text) {
  const trimmed = String(text || "").trim();
  const starts = [];
  for (let i = 0; i < trimmed.length; i += 1) {
    if (trimmed[i] === "{") starts.push(i);
  }
  for (const start of starts.reverse()) {
    try {
      return JSON.parse(trimmed.slice(start));
    } catch (_) {
      // Keep scanning backward.
    }
  }
  return null;
}

function createDurationFixture(file, durationSeconds) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const result = cp.spawnSync("ffmpeg", [
    "-y",
    "-f", "lavfi",
    "-i", `color=c=black:s=160x90:r=1:d=${durationSeconds}`,
    "-an",
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    file,
  ], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(`ffmpeg final-edit fixture generation failed: ${result.error?.message || result.stderr || result.status}`);
  }
}

function writeFinalConcatSidecar(finalOutput, concatListText) {
  writeText(path.join(path.dirname(finalOutput), "scene09_v3_attrition_final_edit.concat.txt"), concatListText);
}

function writeFinalConcatProvenance(finalOutput, fixtureManifest, finalConcatBindingFixture) {
  const clipRows = expectedClipFileRows(fixtureManifest);
  const provenance = {
    date: new Date().toISOString(),
    generated_by: "final_edit_positive_contract_fixture",
    mode: "fixture",
    final_output: rel(finalOutput),
    final_output_absolute: finalOutput,
    final_output_sha256: sha256File(finalOutput),
    concat_list_sidecar: rel(path.join(path.dirname(finalOutput), "scene09_v3_attrition_final_edit.concat.txt")),
    concat_list_sha256: finalConcatBindingFixture.concatSignature,
    expected_clip_file_rows: clipRows,
    expected_clip_file_rows_digest_sha256: sha256Text(`${JSON.stringify(clipRows)}\n`),
    ffmpeg_step: {
      label: "createDurationFixture",
      ok: true,
      status: 0,
    },
  };
  writeJson(path.join(path.dirname(finalOutput), "scene09_v3_attrition_final_edit.provenance.json"), provenance);
  return provenance;
}

function tamperFinalConcatProvenance(finalOutput, patch) {
  const provenancePath = path.join(path.dirname(finalOutput), "scene09_v3_attrition_final_edit.provenance.json");
  const provenance = readJson(provenancePath);
  writeJson(provenancePath, {
    ...provenance,
    ...patch,
  });
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const sourceManifest = readJson(manifestPath);
  const expected = Number(sourceManifest.total_shots || (sourceManifest.shots || []).length || 42);
  const expectedDuration = Number(sourceManifest.total_duration_seconds || 252);
  const productionExistedBefore = fs.existsSync(productionFinalOutput);
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "scene09-v3-final-edit-positive-"));
  const tmpPackageDir = path.join(tmpRoot, "package");
  const tmpReportDir = path.join(tmpRoot, "reports");
  const tmpFinalOutput = path.join(tmpRoot, "final", "scene09_v3_attrition_final_edit.mp4");
  const tmpWrongDurationOutput = path.join(tmpRoot, "wrong_duration", "scene09_v3_attrition_final_edit_wrong_duration.mp4");
  const tmpTamperedProvenanceOutput = path.join(tmpRoot, "tampered_provenance", "scene09_v3_attrition_final_edit_tampered_provenance.mp4");
  fs.mkdirSync(tmpPackageDir, { recursive: true });
  fs.mkdirSync(tmpReportDir, { recursive: true });

  const fixtureShots = createExpectedClipFixtures(tmpRoot, sourceManifest);
  const fixtureManifest = {
    ...sourceManifest,
    package_id: `${sourceManifest.package_id}_final_edit_positive_contract_fixture`,
    source_manifest: rel(manifestPath),
    shots: fixtureShots,
    total_shots: expected,
  };
  writeJson(path.join(tmpPackageDir, "package_manifest.json"), fixtureManifest);
  const finalConcatBindingFixture = writeFinalConcatBindingReports(tmpPackageDir, fixtureManifest);
  createDurationFixture(tmpFinalOutput, expectedDuration);
  writeFinalConcatSidecar(tmpFinalOutput, finalConcatBindingFixture.concatListText);
  writeFinalConcatProvenance(tmpFinalOutput, fixtureManifest, finalConcatBindingFixture);

  const result = cp.spawnSync(process.execPath, [
    "scripts/audit_scene09_v3_final_edit_structural.js",
    "--file",
    tmpFinalOutput,
  ], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: tmpPackageDir,
      SCENE09_V3_REPORT_DIR: tmpReportDir,
    },
  });
  const parsed = parseLastJson(result.stdout);
  const tempReportPath = path.join(tmpReportDir, "scene09_v3_final_edit_structural_audit_2026-08-01.json");
  const structuralReport = fs.existsSync(tempReportPath) ? readJson(tempReportPath) : null;
  createDurationFixture(tmpWrongDurationOutput, Math.max(1, Math.min(10, Math.floor(expectedDuration / 4))));
  writeFinalConcatSidecar(tmpWrongDurationOutput, finalConcatBindingFixture.concatListText);
  writeFinalConcatProvenance(tmpWrongDurationOutput, fixtureManifest, finalConcatBindingFixture);
  const wrongDurationReportDir = path.join(tmpRoot, "reports_wrong_duration");
  fs.mkdirSync(wrongDurationReportDir, { recursive: true });
  const wrongDurationRun = cp.spawnSync(process.execPath, [
    "scripts/audit_scene09_v3_final_edit_structural.js",
    "--file",
    tmpWrongDurationOutput,
  ], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: tmpPackageDir,
      SCENE09_V3_REPORT_DIR: wrongDurationReportDir,
    },
  });
  const wrongDurationReportPath = path.join(wrongDurationReportDir, "scene09_v3_final_edit_structural_audit_2026-08-01.json");
  const wrongDurationReport = fs.existsSync(wrongDurationReportPath) ? readJson(wrongDurationReportPath) : null;
  createDurationFixture(tmpTamperedProvenanceOutput, expectedDuration);
  writeFinalConcatSidecar(tmpTamperedProvenanceOutput, finalConcatBindingFixture.concatListText);
  writeFinalConcatProvenance(tmpTamperedProvenanceOutput, fixtureManifest, finalConcatBindingFixture);
  tamperFinalConcatProvenance(tmpTamperedProvenanceOutput, {
    final_output_sha256: "0".repeat(64),
  });
  const tamperedProvenanceReportDir = path.join(tmpRoot, "reports_tampered_provenance");
  fs.mkdirSync(tamperedProvenanceReportDir, { recursive: true });
  const tamperedProvenanceRun = cp.spawnSync(process.execPath, [
    "scripts/audit_scene09_v3_final_edit_structural.js",
    "--file",
    tmpTamperedProvenanceOutput,
  ], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      SCENE09_V3_PACKAGE_DIR: tmpPackageDir,
      SCENE09_V3_REPORT_DIR: tamperedProvenanceReportDir,
    },
  });
  const tamperedProvenanceReportPath = path.join(tamperedProvenanceReportDir, "scene09_v3_final_edit_structural_audit_2026-08-01.json");
  const tamperedProvenanceReport = fs.existsSync(tamperedProvenanceReportPath) ? readJson(tamperedProvenanceReportPath) : null;
  const productionExistsAfter = fs.existsSync(productionFinalOutput);
  const problems = [];
  if (result.error) problems.push(result.error.message);
  if (result.status !== 0) problems.push(`structural audit exited ${result.status}: ${(result.stderr || "").trim()}`);
  if (!parsed) problems.push("could not parse final edit structural stdout JSON");
  if (parsed && parsed.decision !== "final_edit_structural_passed") {
    problems.push(`decision ${parsed.decision || "missing"} is not final_edit_structural_passed`);
  }
  if (!structuralReport || structuralReport.decision !== "final_edit_structural_passed") {
    problems.push(`temp structural report decision ${structuralReport?.decision || "missing"}`);
  }
  if (structuralReport && structuralReport.final_edit?.ok !== true) {
    problems.push(`temp structural report ok=${structuralReport.final_edit?.ok}`);
  }
  if (structuralReport && !structuralReport.final_edit?.sha256) {
    problems.push("temp structural report missing final_edit.sha256");
  }
  if (structuralReport && structuralReport.final_concat_binding?.ok !== true) {
    problems.push("temp structural report missing final_concat_binding.ok=true");
  }
  if (structuralReport && structuralReport.final_concat_sidecar?.ok !== true) {
    problems.push("temp structural report missing final_concat_sidecar.ok=true");
  }
  if (structuralReport && structuralReport.final_concat_provenance?.ok !== true) {
    problems.push("temp structural report missing final_concat_provenance.ok=true");
  }
  if (structuralReport && structuralReport.final_output !== rel(tmpFinalOutput)) {
    problems.push(`temp structural report final_output ${structuralReport.final_output || "missing"} does not match fixture final output`);
  }
  if (wrongDurationRun.status === 0) {
    problems.push("wrong-duration final edit was accepted by structural audit");
  }
  if (!wrongDurationReport) {
    problems.push("wrong-duration structural report was not written");
  } else {
    if (wrongDurationReport.decision !== "final_edit_structural_blocked") {
      problems.push(`wrong-duration structural decision ${wrongDurationReport.decision || "missing"} is not final_edit_structural_blocked`);
    }
    if (wrongDurationReport.final_edit?.issue !== "duration_out_of_tolerance") {
      problems.push(`wrong-duration issue ${wrongDurationReport.final_edit?.issue || "missing"} is not duration_out_of_tolerance`);
    }
    if (wrongDurationReport.final_edit?.ok !== false) {
      problems.push("wrong-duration structural report did not mark ok=false");
    }
    if (wrongDurationReport.final_concat_binding?.ok !== true) {
      problems.push("wrong-duration structural report did not preserve valid concat binding evidence");
    }
    if (wrongDurationReport.final_concat_sidecar?.ok !== true) {
      problems.push("wrong-duration structural report did not preserve valid concat sidecar evidence");
    }
    if (wrongDurationReport.final_concat_provenance?.ok !== true) {
      problems.push("wrong-duration structural report did not preserve valid concat provenance evidence");
    }
  }
  if (tamperedProvenanceRun.status === 0) {
    problems.push("tampered-provenance final edit was accepted by structural audit");
  }
  if (!tamperedProvenanceReport) {
    problems.push("tampered-provenance structural report was not written");
  } else {
    if (tamperedProvenanceReport.decision !== "final_edit_structural_blocked") {
      problems.push(`tampered-provenance structural decision ${tamperedProvenanceReport.decision || "missing"} is not final_edit_structural_blocked`);
    }
    if (tamperedProvenanceReport.final_edit?.ok !== true) {
      problems.push("tampered-provenance structural report should preserve valid final_edit.ok=true");
    }
    if (tamperedProvenanceReport.final_concat_binding?.ok !== true) {
      problems.push("tampered-provenance structural report should preserve valid concat binding evidence");
    }
    if (tamperedProvenanceReport.final_concat_sidecar?.ok !== true) {
      problems.push("tampered-provenance structural report should preserve valid concat sidecar evidence");
    }
    if (tamperedProvenanceReport.final_concat_provenance?.ok !== false) {
      problems.push("tampered-provenance structural report did not mark final_concat_provenance.ok=false");
    }
    const provenanceProblems = tamperedProvenanceReport.final_concat_provenance?.problems || [];
    if (!provenanceProblems.some((problem) => String(problem).includes("final_output_sha256"))) {
      problems.push("tampered-provenance structural report does not cite final_output_sha256 mismatch");
    }
  }
  if (productionExistedBefore !== productionExistsAfter) {
    problems.push("production final output existence changed during positive contract");
  }

  const decision = problems.length
    ? "final_edit_positive_contract_failed"
    : "final_edit_positive_contract_passed";
  const report = {
    date,
    decision,
    expected_shots: expected,
    expected_duration_seconds: expectedDuration,
    scope: "temporary final mp4 fixture; no production final edit is written or claimed",
    fixture_package_dir: tmpPackageDir,
    fixture_report_dir: tmpReportDir,
    fixture_final_output: tmpFinalOutput,
    production_final_output: rel(productionFinalOutput),
    production_existed_before: productionExistedBefore,
    production_exists_after: productionExistsAfter,
    structural_stdout: result.stdout,
    structural_stderr: result.stderr,
    structural_result: structuralReport,
    structural_final_sha256: structuralReport?.final_edit?.sha256 || null,
    structural_final_concat_binding: structuralReport?.final_concat_binding || null,
    structural_final_concat_sidecar: structuralReport?.final_concat_sidecar || null,
    structural_final_concat_provenance: structuralReport?.final_concat_provenance || null,
    wrong_duration_rejection: {
      fixture_final_output: tmpWrongDurationOutput,
      structural_stdout: wrongDurationRun.stdout,
      structural_stderr: wrongDurationRun.stderr,
      structural_result: wrongDurationReport,
      rejected: Boolean(wrongDurationReport && wrongDurationReport.decision === "final_edit_structural_blocked"),
      issue: wrongDurationReport?.final_edit?.issue || null,
    },
    tampered_provenance_rejection: {
      fixture_final_output: tmpTamperedProvenanceOutput,
      structural_stdout: tamperedProvenanceRun.stdout,
      structural_stderr: tamperedProvenanceRun.stderr,
      structural_result: tamperedProvenanceReport,
      rejected: Boolean(tamperedProvenanceReport && tamperedProvenanceReport.decision === "final_edit_structural_blocked"),
      issue: "final_output_sha256_mismatch",
    },
    stdout_result: parsed,
    problems,
  };
  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Final Edit Positive Contract",
    "",
    `Date: ${date}`,
    `Decision: ${decision}`,
    `Expected shots: ${expected}`,
    `Expected duration: ${expectedDuration}s`,
    "",
    "This is a temporary-fixture contract test. It proves the real final edit structural audit accepts a valid mp4 with the current package duration, without writing or claiming the production final edit.",
    "",
    "## Structural Result",
    "",
    structuralReport ? `- Decision: ${structuralReport.decision}` : "- Decision: missing",
    structuralReport ? `- Exists: ${structuralReport.final_edit?.exists ? "yes" : "no"}` : "- Exists: missing",
    structuralReport ? `- OK: ${structuralReport.final_edit?.ok ? "yes" : "no"}` : "- OK: missing",
    structuralReport?.final_edit?.duration_seconds != null ? `- Duration: ${structuralReport.final_edit.duration_seconds}s` : "- Duration: missing",
    structuralReport?.final_edit?.sha256 ? `- SHA-256: \`${structuralReport.final_edit.sha256}\`` : "- SHA-256: missing",
    structuralReport ? `- Final concat binding: ${structuralReport.final_concat_binding?.ok ? "ok" : "blocked"}` : "- Final concat binding: missing",
    structuralReport ? `- Final concat sidecar: ${structuralReport.final_concat_sidecar?.ok ? "ok" : "blocked"}` : "- Final concat sidecar: missing",
    structuralReport ? `- Final concat provenance: ${structuralReport.final_concat_provenance?.ok ? "ok" : "blocked"}` : "- Final concat provenance: missing",
    wrongDurationReport ? `- Wrong-duration rejection: ${wrongDurationReport.decision}; issue ${wrongDurationReport.final_edit?.issue || "missing"}` : "- Wrong-duration rejection: missing",
    tamperedProvenanceReport ? `- Tampered-provenance rejection: ${tamperedProvenanceReport.decision}; provenance ${tamperedProvenanceReport.final_concat_provenance?.ok ? "ok" : "blocked"}` : "- Tampered-provenance rejection: missing",
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  process.stdout.write(`${JSON.stringify({
    decision,
    expected_shots: expected,
    expected_duration_seconds: expectedDuration,
    structural_decision: structuralReport?.decision || null,
    structural_ok: structuralReport?.final_edit?.ok === true,
    wrong_duration_rejected: Boolean(wrongDurationReport && wrongDurationReport.decision === "final_edit_structural_blocked"),
    production_final_output_changed: productionExistedBefore !== productionExistsAfter,
    problems: problems.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2)}\n`);
  if (problems.length) process.exit(1);
}

main();
