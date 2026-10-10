> Superseded by `CURRENT_STATUS_2026-08-01.md`. Historical status retained for audit trail; do not use this file as the current handoff state.

# EP02 Scene09 Historical Status

Checked on: 2026-07-30

Decision: `monitor_handoff_ready_clips_pending`

Highest completed target: `prompt_asset_package`

## Direct File Review

- Main storyboard/package viewer: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/index.html`
- Clip submission/review viewer: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/clip_review.html`
- Proxy animatic reference edit: `episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_proxy_animatic_edit_2026-07-28.mp4`

These files are designed for direct `file://` access. No local web server is required.

## Per-Shot Asset Contract

Each shot directory under `delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/` contains:

- `start_frame.png`
- `key_frame.png`
- `end_frame.png`
- `prompt.md`
- `model_prompt.md`
- `negative_prompt.md`
- `metadata.json`

Use `model_prompt.md` as the preferred prompt for actual image-to-video model submission. Use `metadata.json` for expected clip output path, duration, visible roster lock, battle ledger, and reject criteria.

## Continuity Locks Verified

- No anonymous or unrecognized students/extras are allowed in any shot.
- Manuela and Hanneman are separated by lane/class objective and are never a visible combat pair.
- `Shot034B` visible lock is only `Byleth, Dimitri, Hanneman`; Manuela is absent/offscreen/silent.
- Hubert remains captured/removed after Felix and Ashe defeat him.
- Dorothea and Bernadetta remain captured/removed after Claude and Leonie flank them.
- Every shot includes a post-shot battle ledger so defeated/captured/stood-down characters cannot resume active combat.
- Attrition is progressive; the final victory stays with the exhausted core instead of resetting everyone into a full-class celebration.
- `Shot034G` visible lock is only `Byleth, Dimitri, Dedue`.
- `Shot036` visible lock is only `Dimitri, Byleth`.

## Latest Local Gates

- `gallery_file_access_passed`: 183 links checked, 0 missing.
- `clip_review_file_access_passed`: 536 links checked, 42 shot cards, 0 missing.
- `html_battle_ledger_passed`: 42/42 ledgers in both viewers.
- `model_prompt_completeness_passed`: 42/42 prompts preserve full motion/camera/performance/audio/reject content.
- `scene09_v3_e2e_consistency_passed`: manifest, queue, package, execution plan, metadata, and submission payload agree.
- `prompt_asset_package`: complete.

## Remaining Blocker

The package is not a completed `video_generation_package` yet because there is no configured external video model command and none of the 42 expected real `.mp4` clips exist.

To advance beyond this point, configure `VIDEO_MODEL_CLI_ARGV_JSON` or generate the clips externally, save/import them to the `expected_clip` paths, then run the post-generation QA in `RUNBOOK.md`.
