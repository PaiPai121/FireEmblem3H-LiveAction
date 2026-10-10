# Final Delivery Audit

Audit date: 2026-07-31

## Completion

- Target: `video_generation_package`
- Episodes: 4
- Shots: 24
- Runtime: EP01-EP03 are 60 seconds each; EP04 was retimed to 95 seconds so Petra x Bernadetta C dialogue can finish naturally.
- Max shot duration: 15 seconds
- Generated storyboard frames: 72 PNG files (`start_frame.png`, `key_frame.png`, `end_frame.png` for every shot)
- Frame aspect policy: clean 16:9 single-frame images, no contact-sheet crop, no synthetic border, no letterbox, no pillarbox, no blurred side fill
- Clips: pending external Seedance generation by design; submission queues and runbooks are included.

## Gates Run

- Manifest validation: pass
- Strict continuity gate: pass, 20 adjacent pairs passed
- Completion target check: pass for `video_generation_package`
- Prompt contract: pass for all 24 prompt files
- Viewer link validation: pass for all 4 `asset_viewer.html` files
- No placeholders scan: pass
- No subtitles contract: pass
- No frame border / no artificial side fill contract: pass
- Max shot duration: pass
- Frame completion: pass
- Submission queue presence: pass
- Model profile presence: pass
- Clip QA checklist presence: pass
- Repository web panel: pass, main site has `#supportComedy` tab route
- Repository web panel data links: pass, 20 indexed package paths found
- Repository web navigation: pass, main tabs use hash links for `file://` fallback and support panel picker is available
- Package viewer navigation: pass, every `asset_viewer.html` links back to the main support panel and sibling episode viewers
- zh-Hans subtitle project: pass, 4 episode subtitle packages generated
- zh-Hans subtitle formats: pass, SRT/VTT/ASS/CSV/JSON plus per-episode README
- zh-Hans subtitle timing validation: pass, 4 JSON timelines checked
- zh-Hans subtitle placeholder scan: pass
- Video prompt hardening pass: pass, wardrobe topology and expression-drift locks added to all 24 prompts
- Motion probe queue: pass, 3-second probe queue added to each package
- Downstream motion status: `monitor_required`; do not blind-submit full-duration clips before probe approval

## Package Roots

- `delivery/video_generation_package_2026-07-28_ep01_caspar_linhardt_b`
- `delivery/video_generation_package_2026-07-28_ep02_ferdinand_dorothea_cb`
- `delivery/video_generation_package_2026-07-28_ep03_caspar_bernadetta_c`
- `delivery/video_generation_package_2026-07-28_ep04_petra_bernadetta_c`

## Web Panel

- Main repository entry: `/index.html#supportComedy`
- Main repository entry (current hash route): `/index.html#supportComedyView`
- Data index: `/site/support_comedy_data.js`
- The panel shows all four package contact sheets and direct links to `asset_viewer.html`, `submission_queue.csv`, `RUNBOOK.md`, and `package_manifest.json`. EP04 now displays 12 shots, 95 seconds, and 36 storyboard frames.
- The panel also exposes zh-Hans subtitle SRT links and subtitle project README links for the Black Eagles packages.
- The panel includes a `Support Package` selector for opening a specific episode viewer directly.

## Prompt Hardening

- Audit: `/video_prompt_hardening_audit.md`
- Reason: downstream Seedance tests showed robe/clothing drift, overacted expressions, and UI-like rounded framing.
- Current policy: prompts are hardened for controlled testing, and every full-duration shot must first pass its package-local `motion_probe_queue.csv`.

## Subtitle Project

- Series root: `/subtitles/zh-Hans`
- Policy: Chinese working subtitle translation for editor/export use; not claimed as official localization.
- Video generation remains clean: subtitles are not burned into frames, clips, or Seedance prompts.

## Notes

Every video prompt includes complete package-local Japanese dialogue lines in execution order. Prompts and negative prompts explicitly forbid subtitles, captions, speech bubbles, visible dialogue text, UI, watermark, and title cards.

Identity locks are present in every prompt and metadata file, with stable academy-era character references for Caspar, Linhardt, Ferdinand, Dorothea, Bernadetta, and Petra.
