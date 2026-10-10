# Gemini Web Automation

This runner automates the slow Gemini web workflow for package-local shots:

1. open Gemini in a persistent browser profile;
2. check whether video mode is available;
3. upload `start_frame.png`, `key_frame.png`, and `end_frame.png`;
4. paste `prompt.md` plus `negative_prompt.md`;
5. optionally click submit;
6. stop and record state when video mode is greyed out or a quota/running-limit message appears.

It does not bypass Gemini limits, solve login challenges, or download finished clips. It only performs the same browser actions a producer would do manually.

## Install

The script needs Playwright:

```bash
npm install --save-dev playwright
npx playwright install chromium
```

## Dry Run

```bash
node scripts/gemini_web_runner.js path/to/video_generation_package --dry-run
```

This validates that each queued shot has:

- `prompt.md`
- `negative_prompt.md`
- `start_frame.png`
- `key_frame.png`
- `end_frame.png`

## Prepare One Shot Without Submitting

```bash
node scripts/gemini_web_runner.js path/to/video_generation_package --execute --login-wait --limit 1
```

The browser opens Gemini. Log in if needed, then return to the terminal and press Enter. The runner uploads the three frames and pastes the prompt, then stops before submission.

If you already use a persistent logged-in profile, you can omit `--login-wait`.

If Google blocks login in Playwright's bundled Chrome for Testing with "This browser or app may not be secure", use an installed supported browser channel. On this machine Microsoft Edge is available:

```bash
node scripts/gemini_web_runner.js path/to/video_generation_package --execute --login-wait --browser-channel msedge --limit 1
```

If Google still blocks login, do not log in inside an automated browser. Reuse your normal Edge login through Chrome DevTools Protocol (CDP):

```bash
scripts/launch_edge_for_gemini_cdp.sh
node scripts/gemini_web_runner.js path/to/video_generation_package --execute --cdp-url http://127.0.0.1:9222 --limit 1
```

If Edge is already running, the helper will ask you to quit Edge first. It does not close Edge for you. After relaunching through the helper, Edge uses your normal `Default` profile, so an existing Gemini login should be available without going through Google's blocked automation login flow.

You can also pass a concrete executable:

```bash
node scripts/gemini_web_runner.js path/to/video_generation_package --execute --login-wait --browser-executable "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" --limit 1
```

## Submit Automatically

```bash
node scripts/gemini_web_runner.js path/to/video_generation_package --execute --submit --limit 2
```

Use a small `--limit` because Gemini may allow only a small number of concurrent video jobs. The runner checks for disabled video mode and quota text before each shot.

## Login And Debugging

By default, non-interactive runs do not wait for terminal input. If the opened browser profile is not signed in, the runner marks the shot:

```text
blocked_login_required
```

and writes a screenshot under:

```text
<package>/gemini_web_debug/
```

Use `--login-wait` for the first run with a fresh browser profile.

For local fixture tests or CI-style checks, use:

```bash
node scripts/gemini_web_runner.js path/to/video_generation_package --execute --headless --url file:///path/to/fake_gemini.html --state-file /tmp/gemini_state.json
```

## Resume

The runner writes:

```text
<package>/gemini_web_state.json
```

Shots marked `submitted` are skipped on later runs. To retry one shot:

```bash
node scripts/gemini_web_runner.js path/to/video_generation_package --reset-shot SH001 --dry-run
```

Then rerun with `--execute`.

## UI Changes

Gemini UI labels change. Copy the example config and edit selectors/text:

```bash
cp scripts/gemini_web_runner.config.example.json scripts/gemini_web_runner.config.json
node scripts/gemini_web_runner.js path/to/video_generation_package --execute --config scripts/gemini_web_runner.config.json
```

Important selector groups:

- `attachButtons`: button that opens the upload/tools menu.
- `uploadFileItems`: menu item or file input for local upload.
- `videoModeItems`: the `制作视频` / `Create video` menu item. If it is disabled or greyed out, the runner stops.
- `composerSelectors`: prompt textbox.
- `submitButtons`: final send/generate button.
- `quotaTextPatterns`: page text that indicates the current time slot or concurrent-job limit is exhausted.

## Recommended Prompt Shape

The runner pastes `prompt.md`, then appends:

```text
Negative prompt:
<negative_prompt.md>
```

For best results, `prompt.md` should reference uploaded START / KEY / END frames, not local paths or prior-shot memory.
