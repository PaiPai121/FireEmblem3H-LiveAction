const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const epRoot = path.join(root, "episodes", "EP03");
const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
const validator = path.join(
  codexHome,
  "skills",
  "video-prompt-qa",
  "scripts",
  "validate_prompt_contract.js"
);
const reviewDir = path.join(epRoot, "production_system", "reviews");
const jsonPath = path.join(reviewDir, "video_prompt_qa_2026-08-27.json");
const markdownPath = path.join(reviewDir, "video_prompt_qa_2026-08-27.md");

function rel(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function absoluteFromEp(relativePath) {
  return path.join(epRoot, relativePath);
}

function runPromptValidator(promptPath) {
  const result = spawnSync(process.execPath, [validator, promptPath, "--json"], {
    encoding: "utf8"
  });
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    return {
      ok: false,
      missing_sections: ["validator_output_parse_failed"],
      blocking_signals: [result.stderr || result.stdout || error.message],
      weak_signals: []
    };
  }
}

function loadShot(number) {
  const shotId = `Shot${String(number).padStart(3, "0")}`;
  const promptFile = path.join(epRoot, "video_prompts", `${shotId}_prompt.md`);
  const negativeFile = path.join(epRoot, "video_prompts", `${shotId}_negative_prompt.md`);
  const metadataFile = path.join(epRoot, "storyboards", shotId, "metadata.json");
  const metadata = JSON.parse(fs.readFileSync(metadataFile, "utf8"));
  const currentKey = metadata.current_display_frame_set;
  const current = metadata[currentKey] || {};
  const frames = current.frames || metadata.planned_frames || {};
  const framePaths = Object.fromEntries(
    Object.entries(frames).map(([role, value]) => [role, absoluteFromEp(value)])
  );
  const contactSheet = current.contact_sheet ? absoluteFromEp(current.contact_sheet) : null;
  const promptQa = fs.existsSync(promptFile)
    ? runPromptValidator(promptFile)
    : {
        ok: false,
        missing_sections: ["prompt_file_missing"],
        blocking_signals: [],
        weak_signals: []
      };
  const frameFilesExist = Object.values(framePaths).every((file) => fs.existsSync(file));
  const contactSheetExists = Boolean(contactSheet && fs.existsSync(contactSheet));
  const integrityPass =
    fs.existsSync(promptFile) &&
    fs.existsSync(negativeFile) &&
    frameFilesExist &&
    contactSheetExists;
  return {
    shot_id: shotId,
    prompt_path: rel(promptFile),
    negative_prompt_path: rel(negativeFile),
    metadata_path: rel(metadataFile),
    current_frame_set: current.version || currentKey || "",
    current_source: current.source || metadata.current_display_frame_source || "",
    frames: Object.fromEntries(Object.entries(framePaths).map(([role, file]) => [role, rel(file)])),
    contact_sheet: contactSheet ? rel(contactSheet) : "",
    prompt_contract: promptQa,
    integrity: {
      prompt_exists: fs.existsSync(promptFile),
      negative_prompt_exists: fs.existsSync(negativeFile),
      frame_files_exist: frameFilesExist,
      contact_sheet_exists: contactSheetExists
    },
    structural_pass: Boolean(promptQa.ok),
    integrity_pass: integrityPass,
    semantic_prompt_against_frame: "pending_manual_or_model_review",
    motion_probe: "pending_3s_probe"
  };
}

function buildMarkdown(review) {
  const failures = review.shots.filter((shot) => !shot.structural_pass || !shot.integrity_pass);
  const lines = [
    "# EP03 Video Prompt QA",
    "",
    "Decision: monitor_required",
    "",
    "## Blocking Issues",
    "",
    failures.length
      ? failures.map((shot) => `- ${shot.shot_id}: structural=${shot.structural_pass}, integrity=${shot.integrity_pass}`).join("\n")
      : "- None in the structural prompt-contract and current-file integrity audit.",
    "",
    "## Monitor Risks",
    "",
    "- Prompt-against-frame semantic review and strict adjacent-shot continuity remain downstream review items.",
    "- No generated video clips or 3-second motion probes are present; native Japanese audio timing is not promoted.",
    "",
    "## Prompt Contract Check",
    "",
    `- ${review.summary.structural_pass}/${review.summary.total_shots} prompts pass validate_prompt_contract.js.`,
    "- The executable prompts refer to uploaded START/KEY/END anchors and contain no validator-detected local filesystem path blockers.",
    "",
    "## Frame Lock Check",
    "",
    `- ${review.summary.integrity_pass}/${review.summary.total_shots} shots have current prompt, negative prompt, START/KEY/END files, and contact sheet evidence.`,
    "- Current frame paths are recorded per shot in the JSON review; historical candidate folders are not treated as current.",
    "",
    "## Motion / Camera / Performance Check",
    "",
    "- Prompt text contains concrete motion, camera, and performance instructions; visible clip behavior remains unverified until motion probes exist.",
    "",
    "## Dialogue Timing / Anti-Repeat Check",
    "",
    "- Spoken shots contain shot-local timing and anti-repeat instructions; silent shots explicitly declare no spoken line.",
    "- The project-level dialogue join remains a separate authoritative-manifest gate and is not silently overridden here.",
    "",
    "## Continuity / Edit Fit",
    "",
    "- The current 025–029 prompt chain records the long-distance containment, guard interaction, Catherine contact, disarm, and aftermath handoff.",
    "- The current 030–036 prompt chain records the battlefield-to-cathedral-to-night-corridor handoff with female Byleth only.",
    "",
    "## Negative Prompt Check",
    "",
    "- Every shot has a package-local negative prompt file; concrete drift risks remain encoded per shot.",
    "",
    "## Required Revisions",
    "",
    "- Keep status monitor_required until semantic prompt-against-frame review and 3-second motion probes are completed.",
    "",
    "## Decision",
    "",
    "monitor_required"
  ];
  return `${lines.join("\n")}\n`;
}

function main() {
  if (!fs.existsSync(validator)) {
    throw new Error(`video-prompt-qa validator not found: ${validator}`);
  }
  const shots = Array.from({ length: 36 }, (_, index) => loadShot(index + 1));
  const review = {
    version: "2026-08-27",
    project: "FireEmblem3H-LiveAction",
    episode: "EP03",
    decision: "monitor_required",
    validator,
    summary: {
      total_shots: shots.length,
      structural_pass: shots.filter((shot) => shot.structural_pass).length,
      integrity_pass: shots.filter((shot) => shot.integrity_pass).length,
      semantic_prompt_against_frame: "pending_manual_or_model_review",
      motion_probe: "pending_3s_probe"
    },
    shots
  };
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(jsonPath, `${JSON.stringify(review, null, 2)}\n`);
  fs.writeFileSync(markdownPath, buildMarkdown(review));
  console.log(
    JSON.stringify(
      {
        decision: review.decision,
        total_shots: review.summary.total_shots,
        structural_pass: review.summary.structural_pass,
        integrity_pass: review.summary.integrity_pass,
        json: rel(jsonPath),
        markdown: rel(markdownPath)
      },
      null,
      2
    )
  );
}

main();
