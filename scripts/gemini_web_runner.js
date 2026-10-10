#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const USAGE = `
Usage:
  node scripts/gemini_web_runner.js <video-generation-package-dir> [options]

Options:
  --dry-run                 Print queue and validate local files only. Default.
  --execute                 Open Gemini and prepare shots in the browser.
  --submit                  Click the Gemini submit button after upload/paste. Requires --execute.
  --profile-dir <dir>       Persistent browser profile. Default: .gemini-web-profile
  --state-file <file>       Submission state file. Default: <package>/gemini_web_state.json
  --config <file>           Override UI selectors and text patterns.
  --start-order <n>         Start from package order n.
  --limit <n>               Maximum shots to attempt this run.
  --timeout-ms <n>          Per-step timeout. Default: 15000.
  --slow-ms <n>             Playwright slowMo delay. Default: 100.
  --url <url>               Gemini URL. Default: https://gemini.google.com/
  --headless                Run browser headless. Useful for local fixture tests.
  --browser-channel <name>  Use installed browser channel, e.g. chrome or msedge.
  --browser-executable <p>  Use a specific browser executable path.
  --cdp-url <url>           Attach to an already-running browser, e.g. http://127.0.0.1:9222.
  --login-wait              Pause for manual login before the first shot.
  --screenshot-dir <dir>    Debug screenshot directory. Default: <package>/gemini_web_debug
  --reset-shot <shot-id>    Remove one shot from state before running.
  --help

Install once if Playwright is missing:
  npm install --save-dev playwright
  npx playwright install chromium

Examples:
  node scripts/gemini_web_runner.js delivery/video_generation_package_x --dry-run
  node scripts/gemini_web_runner.js delivery/video_generation_package_x --execute --limit 1
  node scripts/gemini_web_runner.js delivery/video_generation_package_x --execute --submit --limit 2
`;

const DEFAULT_CONFIG = {
  geminiUrl: "https://gemini.google.com/",
  attachButtons: [
    { role: "button", name: "上传和工具" },
    { role: "button", name: "Add files" },
    { role: "button", name: "Upload files" },
    { role: "button", name: "上传" },
    { role: "button", name: "添加" },
    { selector: 'button[aria-label*="Upload" i]' },
    { selector: 'button[aria-label*="Add" i]' },
    { selector: 'button[aria-label*="上传和工具" i]' },
    { selector: 'button[aria-label*="上传" i]' },
    { selector: 'button[aria-label*="添加" i]' },
  ],
  uploadFileItems: [
    { text: "上传文件" },
    { text: "Upload files" },
    { text: "Upload from device" },
    { selector: 'input[type="file"]' },
  ],
  videoModeItems: [
    { text: "制作视频" },
    { text: "Create video" },
    { text: "Make video" },
    { text: "Video" },
  ],
  composerSelectors: [
    'div[contenteditable="true"][role="textbox"]',
    'div[contenteditable="true"]',
    "textarea",
  ],
  submitButtons: [
    { role: "button", name: "Submit" },
    { role: "button", name: "Send" },
    { role: "button", name: "Generate" },
    { role: "button", name: "发送" },
    { role: "button", name: "提交" },
    { role: "button", name: "生成" },
    { selector: 'button[aria-label*="Send" i]' },
    { selector: 'button[aria-label*="Submit" i]' },
    { selector: 'button[aria-label*="Generate" i]' },
    { selector: 'button[aria-label*="发送" i]' },
  ],
  quotaTextPatterns: [
    "maximum I can do at one time",
    "video generation requests running",
    "maximum",
    "limit",
    "quota",
    "try again later",
    "已达到",
    "上限",
    "限额",
    "稍后再试",
  ],
  postSubmitWaitMs: 5000,
};

main().catch((error) => {
  console.error(`ERROR: ${error.stack || error.message}`);
  process.exit(1);
});

async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args.includes("--help") || args.includes("-h")) {
    process.stdout.write(USAGE.trim() + "\n");
    process.exit(args.length ? 0 : 1);
  }

  const packageDir = path.resolve(args[0]);
  const options = parseOptions(args.slice(1), packageDir);
  const config = loadConfig(options.configPath);
  if (options.url) config.geminiUrl = options.url;

  const pkg = loadPackage(packageDir);
  const queue = buildQueue(packageDir, pkg, options);
  const state = loadState(options.stateFile, packageDir);
  if (options.resetShot) {
    delete state.shots[options.resetShot];
    saveState(options.stateFile, state);
  }

  const pending = queue.filter((shot) => state.shots[shot.id]?.status !== "submitted");
  reportQueue(queue, pending, state, options);

  if (!options.execute) return;
  if (options.submit !== true) {
    console.log("Prepare-only mode: the browser will upload/fill each shot but will not click submit.");
  }

  const playwright = await loadPlaywright();
  const browserSession = await openBrowserSession(playwright, options);
  const { context, page, close } = browserSession;
  page.setDefaultTimeout(options.timeoutMs);
  await page.goto(config.geminiUrl, { waitUntil: "domcontentloaded" });
  await waitForPageWarmup(page, options.timeoutMs);

  if (options.loginWait || process.stdin.isTTY) {
    console.log("If Gemini asks for login, finish login in the opened browser, then press Enter here.");
    await waitForEnter();
  } else {
    console.log("Continuing without login wait. Use --login-wait if the opened browser needs manual login.");
  }

  let attempted = 0;
  for (const shot of pending) {
    if (options.limit && attempted >= options.limit) break;
    attempted += 1;
    console.log(`\n=== ${shot.label} ===`);

    const loginStatus = await detectLoginRequired(page);
    if (loginStatus) {
      markState(state, shot, "blocked_login_required", loginStatus);
      saveState(options.stateFile, state);
      await saveDebugScreenshot(page, options, shot, "blocked_login_required");
      console.log(`Login required before video generation: ${loginStatus}`);
      break;
    }

    const quotaBefore = await detectQuota(page, config);
    if (quotaBefore) {
      markState(state, shot, "blocked_quota", quotaBefore);
      saveState(options.stateFile, state);
      await saveDebugScreenshot(page, options, shot, "blocked_quota");
      console.log(`Quota/limit detected before upload: ${quotaBefore}`);
      break;
    }

    const videoMode = await selectVideoMode(page, config);
    if (!videoMode.ok) {
      markState(state, shot, "blocked_video_mode", videoMode.reason);
      saveState(options.stateFile, state);
      await saveDebugScreenshot(page, options, shot, "blocked_video_mode");
      console.log(`Video mode unavailable: ${videoMode.reason}`);
      break;
    }

    try {
      await uploadFrames(page, shot.framePaths, config, options);
      await pastePrompt(page, shot.combinedPrompt, config);
    } catch (error) {
      markState(state, shot, "blocked_ui", error.message);
      saveState(options.stateFile, state);
      await saveDebugScreenshot(page, options, shot, "blocked_ui");
      console.log(`UI automation blocked: ${error.message}`);
      break;
    }

    if (!options.submit) {
      markState(state, shot, "prepared", "uploaded frames and pasted text; submit not clicked");
      saveState(options.stateFile, state);
      await saveDebugScreenshot(page, options, shot, "prepared");
      console.log("Prepared. Review the browser, then submit manually or rerun with --submit.");
      if (options.loginWait || process.stdin.isTTY) {
        await waitForEnter("Press Enter after you finish/recover the browser for the next shot.");
      }
      continue;
    }

    const submit = await clickSubmit(page, config);
    if (!submit.ok) {
      markState(state, shot, "blocked_submit", submit.reason);
      saveState(options.stateFile, state);
      await saveDebugScreenshot(page, options, shot, "blocked_submit");
      console.log(`Submit unavailable: ${submit.reason}`);
      break;
    }

    await page.waitForTimeout(config.postSubmitWaitMs);
    const quotaAfter = await detectQuota(page, config);
    if (quotaAfter) {
      markState(state, shot, "blocked_after_submit", quotaAfter);
      saveState(options.stateFile, state);
      await saveDebugScreenshot(page, options, shot, "blocked_after_submit");
      console.log(`Limit message after submit: ${quotaAfter}`);
      break;
    }

    markState(state, shot, "submitted", "submitted through Gemini web UI");
    saveState(options.stateFile, state);
    await saveDebugScreenshot(page, options, shot, "submitted");
    console.log("Submitted.");
  }

  await close();
  console.log(`State written: ${options.stateFile}`);
}

async function openBrowserSession(playwright, options) {
  if (options.cdpUrl) {
    const browser = await playwright.chromium.connectOverCDP(options.cdpUrl);
    const context = browser.contexts()[0] || await browser.newContext();
    const existingGeminiPage = context.pages().find((candidate) => /gemini\.google\.com/.test(candidate.url()));
    const page = existingGeminiPage || await context.newPage();
    await page.setViewportSize({ width: 1440, height: 1000 }).catch(() => {});
    return {
      context,
      page,
      close: async () => {},
    };
  }

  const launchOptions = {
    headless: options.headless,
    slowMo: options.slowMs,
    locale: "zh-CN",
    viewport: { width: 1440, height: 1000 },
  };
  if (options.browserChannel) launchOptions.channel = options.browserChannel;
  if (options.browserExecutable) launchOptions.executablePath = options.browserExecutable;

  const context = await playwright.chromium.launchPersistentContext(options.profileDir, launchOptions);
  const page = context.pages()[0] || await context.newPage();
  return {
    context,
    page,
    close: async () => {
      await context.close();
    },
  };
}

function parseOptions(args, packageDir) {
  const options = {
    execute: false,
    submit: false,
    profileDir: path.resolve(".gemini-web-profile"),
    stateFile: path.join(packageDir, "gemini_web_state.json"),
    configPath: "",
    startOrder: 0,
    limit: 0,
    timeoutMs: 15000,
    slowMs: 100,
    url: "",
    headless: false,
    browserChannel: "",
    browserExecutable: "",
    cdpUrl: "",
    loginWait: false,
    screenshotDir: path.join(packageDir, "gemini_web_debug"),
    resetShot: "",
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--dry-run") continue;
    if (arg === "--execute") options.execute = true;
    else if (arg === "--submit") options.submit = true;
    else if (arg === "--profile-dir") options.profileDir = path.resolve(requiredValue(args, ++i, arg));
    else if (arg === "--state-file") options.stateFile = path.resolve(requiredValue(args, ++i, arg));
    else if (arg === "--config") options.configPath = path.resolve(requiredValue(args, ++i, arg));
    else if (arg === "--start-order") options.startOrder = Number(requiredValue(args, ++i, arg));
    else if (arg === "--limit") options.limit = Number(requiredValue(args, ++i, arg));
    else if (arg === "--timeout-ms") options.timeoutMs = Number(requiredValue(args, ++i, arg));
    else if (arg === "--slow-ms") options.slowMs = Number(requiredValue(args, ++i, arg));
    else if (arg === "--url") options.url = requiredValue(args, ++i, arg);
    else if (arg === "--headless") options.headless = true;
    else if (arg === "--browser-channel") options.browserChannel = requiredValue(args, ++i, arg);
    else if (arg === "--browser-executable") options.browserExecutable = path.resolve(requiredValue(args, ++i, arg));
    else if (arg === "--cdp-url") options.cdpUrl = requiredValue(args, ++i, arg);
    else if (arg === "--login-wait") options.loginWait = true;
    else if (arg === "--screenshot-dir") options.screenshotDir = path.resolve(requiredValue(args, ++i, arg));
    else if (arg === "--reset-shot") options.resetShot = requiredValue(args, ++i, arg);
    else throw new Error(`Unknown option: ${arg}`);
  }

  if (options.submit && !options.execute) throw new Error("--submit requires --execute");
  return options;
}

function requiredValue(args, index, flag) {
  const value = args[index];
  if (!value) throw new Error(`${flag} requires a value`);
  return value;
}

function loadConfig(configPath) {
  if (!configPath) return { ...DEFAULT_CONFIG };
  const userConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return { ...DEFAULT_CONFIG, ...userConfig };
}

function loadPackage(packageDir) {
  const manifestPath = path.join(packageDir, "package_manifest.json");
  const indexPath = path.join(packageDir, "package_index.json");
  if (fs.existsSync(indexPath) && !fs.existsSync(manifestPath)) {
    throw new Error("package_index.json points to multiple packages. Run this script on one concrete package directory for now.");
  }
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package_manifest.json: ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(manifest.shots)) throw new Error("package_manifest.json must contain shots[]");
  return manifest;
}

function buildQueue(packageDir, manifest, options) {
  return manifest.shots
    .slice()
    .sort((a, b) => Number(a.order) - Number(b.order))
    .filter((shot) => !options.startOrder || Number(shot.order) >= options.startOrder)
    .map((shot) => buildShotWorkOrder(packageDir, shot));
}

function buildShotWorkOrder(packageDir, shot) {
  const shotDir = path.resolve(packageDir, shot.package_dir || shot.packageDir || `shots/${String(shot.order).padStart(3, "0")}_${shot.id}`);
  const promptPath = resolvePackageFile(packageDir, shotDir, shot.prompt || shot.model_prompt || "prompt.md");
  const negativePromptPath = resolvePackageFile(packageDir, shotDir, shot.negative_prompt || "negative_prompt.md");
  const framePaths = [
    path.join(shotDir, "start_frame.png"),
    path.join(shotDir, "key_frame.png"),
    path.join(shotDir, "end_frame.png"),
  ];

  for (const file of [promptPath, negativePromptPath, ...framePaths]) {
    if (!fs.existsSync(file)) throw new Error(`${shot.id} missing file: ${file}`);
  }

  const prompt = fs.readFileSync(promptPath, "utf8").trim();
  const negativePrompt = fs.readFileSync(negativePromptPath, "utf8").trim();
  const combinedPrompt = [
    prompt,
    negativePrompt ? `\nNegative prompt:\n${negativePrompt}` : "",
  ].join("\n").trim() + "\n";

  return {
    id: shot.id,
    order: shot.order,
    label: `${String(shot.order).padStart(3, "0")} ${shot.id}`,
    shotDir,
    promptPath,
    negativePromptPath,
    framePaths,
    combinedPrompt,
  };
}

function resolvePackageFile(packageDir, shotDir, value) {
  if (path.isAbsolute(value)) return value;
  const shotLocal = path.join(shotDir, value);
  if (fs.existsSync(shotLocal)) return shotLocal;
  return path.join(packageDir, value);
}

function loadState(stateFile, packageDir) {
  if (!fs.existsSync(stateFile)) {
    return {
      package_dir: packageDir,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      shots: {},
    };
  }
  return JSON.parse(fs.readFileSync(stateFile, "utf8"));
}

function saveState(stateFile, state) {
  state.updated_at = new Date().toISOString();
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2) + "\n");
}

function markState(state, shot, status, note) {
  state.shots[shot.id] = {
    order: shot.order,
    status,
    note,
    updated_at: new Date().toISOString(),
  };
}

function reportQueue(queue, pending, state, options) {
  console.log(`Package shots: ${queue.length}`);
  console.log(`Pending shots: ${pending.length}`);
  console.log(`State file: ${options.stateFile}`);
  for (const shot of queue) {
    const status = state.shots[shot.id]?.status || "pending";
    console.log(`${status.padEnd(22)} ${shot.label}`);
  }
}

async function loadPlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    throw new Error([
      "Playwright is not installed for this workspace.",
      "Run:",
      "  npm install --save-dev playwright",
      "  npx playwright install chromium",
    ].join("\n"));
  }
}

async function selectVideoMode(page, config) {
  try {
    await clickFirstAvailable(page, config.attachButtons, "attach/menu button");
  } catch (error) {
    return { ok: false, reason: `${error.message}; ${await describePage(page)}` };
  }
  const item = await locateFirst(page, config.videoModeItems, 3000);
  if (!item) return { ok: false, reason: "video mode item not found" };
  if (await isDisabled(item)) return { ok: false, reason: "video mode item is disabled/greyed out" };
  await item.click();
  return { ok: true };
}

async function uploadFrames(page, framePaths, config, options) {
  console.log(`Uploading frames:\n  ${framePaths.join("\n  ")}`);
  const directInput = page.locator('input[type="file"]').last();
  if (await directInput.count()) {
    try {
      await directInput.setInputFiles(framePaths, { timeout: 3000 });
      await page.waitForTimeout(1000);
      return;
    } catch (_) {
      // Fall through to menu/filechooser path.
    }
  }

  await clickFirstAvailable(page, config.attachButtons, "attach/menu button");
  const chooserPromise = page.waitForEvent("filechooser", { timeout: options.timeoutMs });
  await clickFirstAvailable(page, config.uploadFileItems, "upload file item");
  const chooser = await chooserPromise;
  await chooser.setFiles(framePaths);
  await page.waitForTimeout(1500);
}

async function pastePrompt(page, text, config) {
  const composer = await locateFirst(page, config.composerSelectors.map((selector) => ({ selector })), 8000);
  if (!composer) throw new Error("composer textbox not found");
  await composer.click();
  await composer.fill("");
  await composer.fill(text);
  console.log(`Pasted ${text.length} characters.`);
}

async function clickSubmit(page, config) {
  const button = await locateFirst(page, config.submitButtons, 5000);
  if (!button) return { ok: false, reason: "submit button not found" };
  if (await isDisabled(button)) return { ok: false, reason: "submit button is disabled" };
  await button.click();
  return { ok: true };
}

async function detectQuota(page, config) {
  const bodyText = await page.locator("body").innerText({ timeout: 3000 }).catch(() => "");
  const lower = bodyText.toLowerCase();
  const match = config.quotaTextPatterns.find((pattern) => lower.includes(String(pattern).toLowerCase()));
  return match || "";
}

async function detectLoginRequired(page) {
  const bodyText = await page.locator("body").innerText({ timeout: 3000 }).catch(() => "");
  if (/登录即可保存活动记录|Sign in to save|登录\s*$|Sign in\s*$/im.test(bodyText)) {
    const hasLoginLink = await page.getByText(/登录|Sign in/i).count().catch(() => 0);
    if (hasLoginLink) return "Gemini page is loaded but the browser profile is not signed in";
  }
  return "";
}

async function waitForPageWarmup(page, timeoutMs) {
  await page.waitForLoadState("networkidle", { timeout: Math.min(timeoutMs, 15000) }).catch(() => {});
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const text = await page.locator("body").innerText({ timeout: 1000 }).catch(() => "");
    const title = await page.title().catch(() => "");
    if (text.trim().length > 0 || title.trim().length > 0) return;
    await page.waitForTimeout(500);
  }
}

async function describePage(page) {
  const url = page.url();
  const title = await page.title().catch(() => "");
  const bodyText = await page.locator("body").innerText({ timeout: 1000 }).catch(() => "");
  const compact = bodyText.replace(/\s+/g, " ").trim().slice(0, 240);
  return `page url=${url} title=${JSON.stringify(title)} body=${JSON.stringify(compact)}`;
}

async function clickFirstAvailable(page, candidates, label) {
  const locator = await locateFirst(page, candidates, 5000);
  if (!locator) throw new Error(`Could not find ${label}`);
  if (await isDisabled(locator)) throw new Error(`${label} is disabled`);
  await locator.click();
}

async function locateFirst(page, candidates, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const candidate of candidates) {
      const locator = makeLocator(page, candidate).first();
      if (await locator.count().catch(() => 0)) {
        if (await locator.isVisible().catch(() => false)) return locator;
      }
    }
    await page.waitForTimeout(250);
  }
  return null;
}

function makeLocator(page, candidate) {
  if (candidate.selector) return page.locator(candidate.selector);
  if (candidate.role) return page.getByRole(candidate.role, { name: new RegExp(escapeRegex(candidate.name), "i") });
  if (candidate.text) return page.getByText(new RegExp(escapeRegex(candidate.text), "i"));
  throw new Error(`Unsupported locator candidate: ${JSON.stringify(candidate)}`);
}

async function isDisabled(locator) {
  return locator.evaluate((el) => {
    const style = window.getComputedStyle(el);
    const ariaDisabled = el.getAttribute("aria-disabled") === "true";
    const disabled = Boolean(el.disabled);
    const pointerBlocked = style.pointerEvents === "none";
    const veryFaint = Number(style.opacity || "1") < 0.45;
    return disabled || ariaDisabled || pointerBlocked || veryFaint;
  }).catch(() => false);
}

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function saveDebugScreenshot(page, options, shot, reason) {
  fs.mkdirSync(options.screenshotDir, { recursive: true });
  const safeShot = String(shot?.id || "page").replace(/[^a-zA-Z0-9._-]+/g, "_");
  const file = path.join(options.screenshotDir, `${String(shot?.order || "000").padStart(3, "0")}_${safeShot}_${reason}.png`);
  await page.screenshot({ path: file, fullPage: true }).catch(() => {});
  console.log(`Debug screenshot: ${file}`);
}

function waitForEnter(message = "Press Enter to continue.") {
  console.log(message);
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.once("data", () => resolve());
  });
}
