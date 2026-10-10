# Full Image, Script, and Math QA: 2026-07-31

Project ID: `KAK-BYLETH-LECTURE`
Artifact Scope: real-frame review page, one-pass full-video handoff, revised script/proof package, frame-progression repair pass
Decision: `monitor_required`

## Executive Answer

- Image assets are complete and machine-validated: 34 shots x 3 frames = 102 real PNG frames.
- Frame progression has now been machine-audited: all 34 start/key/end triplets are `progression_clear`; low-progression count is 0 and watch count is 0.
- Image assets are not yet fully approved for final video: current evidence proves file integrity and contact-sheet-level visual review, but not 102-image full-size human pass/fail approval.
- The script has been reviewed by subagents. The first script/math review returned `blocked_needs_revision`; after revisions, the follow-up script/math review found no blocking issues.
- The proof chain is now substantially clearer for a freshman-calculus audience: deltoid direction/scale/area, convex-triangle turnability, Perron direction preservation, epsilon shrinkage, narrow-corridor continuity bridge, delta-tube overlap, and grid-count dimension intuition are now explicit.

## Image QA Evidence

Current machine integrity audit. The file path remains dated `2026-07-28` for link compatibility, but the regenerated report body records `created_at: 2026-07-31` and `legacy_report_path_date: 2026-07-28`.

- Command: `node scripts/audit_kakeya_real_frame_integrity.js`
- Result: `integrity_passed`
- Actual frames: 102
- Missing frames: 0
- Bad dimensions: 0
- Duplicate hashes: 0
- Low-information frames: 0
- Too-dark-or-light frames: 0
- Output: `production_system/reviews/real_frame_integrity_audit_2026-07-28.json`

Current frame-progression audit was added after the user reported that many start/key/end frames looked nearly identical. The audit computes pairwise mean absolute RGB differences after downsampling and separates frame existence from motion-anchor strength.

- Command: `python3 scripts/audit_kakeya_frame_progression.py`
- Result: `progression_passed`
- Total shots: 34
- Low-progression shots: 0
- Motion-watch shots: 0
- Progression-clear shots: 34
- Output: `production_system/reviews/frame_progression_audit_2026-08-01.json`
- Human-readable report: `production_system/reviews/frame_progression_audit_2026-08-01.md`

Frame-progression repair evidence:

- `scripts/repair_kakeya_frame_progression_anchors.py` revised 21 previously weak shots with shot-specific chalk/parchment proof anchors.
- `scripts/boost_kakeya_end_frame_anchors.py` strengthened 11 end frames whose key-to-end movement was still too subtle.
- SH001 was revised so the opening start frame shows female Byleth clearly before the hand-placement close-up.

Current contact sheets were regenerated after SH027/SH028 proof-overlay updates. The directory name remains dated `2026-07-28` for link compatibility, but the regenerated manifest records `created_at: 2026-07-31` and `legacy_directory_date: 2026-07-28`.

- `production_system/reviews/real_frame_contact_sheets_2026-07-28/kakeya_real_frames_contact_sheet_01.jpg`
- `production_system/reviews/real_frame_contact_sheets_2026-07-28/kakeya_real_frames_contact_sheet_02.jpg`
- `production_system/reviews/real_frame_contact_sheets_2026-07-28/kakeya_real_frames_contact_sheet_03.jpg`
- `production_system/reviews/real_frame_contact_sheets_2026-07-28/kakeya_real_frames_contact_sheet_04.jpg`
- Manifest: `production_system/reviews/real_frame_contact_sheets_2026-07-28/contact_sheet_manifest.json`

Full-size visual spot check after regeneration and frame-progression repair:

- `real_frames/SH001/start.png`: now shows female Byleth in the training ground opening frame, with the unit sword and red endpoint markers visible.
- `real_frames/SH003/end.png`: now marks the fixed-center disk as only the initial intuition, reducing the risk that the disk is read as the answer.
- `real_frames/SH013/end.png`: now includes an explicit direction-coverage anchor for the height-1 equilateral triangle.
- `real_frames/SH014/end.png`: now separates the turnability/danger-direction cue from the convex lower-bound theorem cue.
- `real_frames/SH027/key.png`: now shows the derivation chain `length ~ delta / sin alpha`, `area ~ delta^2 / sin alpha`, `<= C delta^2 / alpha`.
- `real_frames/SH028/key.png`: now shows grid-count contrast `curve: about 1/delta`, `all directions: near 1/delta^2`.

Image QA boundary:

- It is correct to say: all required PNGs exist, are nonblank/nonduplicate, have valid dimensions, appear in regenerated contact sheets, and the most important re-rendered proof frames were spot-checked full-size.
- It is correct to say: all 34 frame triplets now pass the machine frame-progression gate.
- It is not correct to say: all 102 images have passed full-size human visual/math approval.
- The package remains `monitor_required`, not `approved_for_video`, because one-pass generated video still needs identity, label stability, motion, and adjacent-cut QA.

## Script Review Evidence

Initial script/math subagent review:

- Agent ID: `019fb848-87af-7092-925a-99468d96093d`
- Initial decision: `blocked_needs_revision`
- Blocking issues found:
  - Continuous turning and all-direction line containment were mixed without a narrow-corridor bridge.
  - SH006-SH009 stated deltoid facts without enough proof.
  - SH013-SH015 gave convex-triangle area without showing turnability or lower-bound status.
  - SH016-SH023 stated Perron shrinkage without enough quantitative epsilon logic.
  - SH025-SH029 stated the delta-tube estimate and dimension result too abruptly.

Revisions made after review:

- `voiceover_dialogue_script.md`
  - Added deltoid direction coverage: tangent direction turns continuously through all directions.
  - Added deltoid scale proof: usable tangent chord is four `a` segments, so `4a = 1`.
  - Added deltoid area bridge: `A = 2πa^2`, so `a = 1/4` gives `π/8`.
  - Added Edelgard's mathematical motivation: "why can't it be smaller?" and non-convex gap reuse.
  - Added convex-rule motivation: general case is slippery, so start with a regular special case.
  - Added convex triangle turnability: orientations modulo 180 degrees, three support-side sliding, height-1 danger position.
  - Added Perron bridge: non-convex fragments need a direction ledger.
  - Added narrow-corridor bridge from all-direction containment to continuous turning.
  - Added epsilon shrink statement for Perron iteration.
  - Added delta-tube derivation and grid-count dimension explanation.

- `shot_list.md`
  - Reframed SH010 as a missing-lower-bound objection, not a one-line clever reaction.
  - Reframed SH011 as a motivated special-case switch.
  - Reframed SH013-SH014 so turnability proof precedes area calculation.
  - Reframed SH015-SH016 so Perron follows from non-convex fragmentation and direction bookkeeping.
  - Reframed SH027-SH028 around derivation, not just final formula/theorem.

- `scripts/build_kakeya_byleth_prompt_asset_package.js`
  - Synchronized the revised proof and story logic into regenerated frame specs and video prompts.

- `scripts/build_kakeya_real_frame_asset_viewer.js`
  - Synchronized Chinese dialogue anchors shown in the web review page.

- `proof_notes_freshman_level.md`
  - Added a readable proof companion covering the version distinction, deltoid, convex triangle, Perron tree, zero-area caution, delta tubes, and dimension.

Follow-up script/math subagent review after revisions:

- Agent ID: `019fb848-87af-7092-925a-99468d96093d`
- Follow-up decision: `monitor_required`
- Blocking issues: none.
- Confirmed fixed:
  - Edelgard now has mathematical motivation: she asks why the candidate cannot be smaller and points to non-convex gap reuse.
  - The convex rule now has motivation: start with a regular special case before returning to the general non-convex problem.
  - The equilateral triangle section now proves direction coverage / 180-degree sufficiency before area calculation.
  - The Perron setup now follows from the non-convex fragmentation question through the direction-ledger idea.
- Remaining non-blocking weaknesses:
  - Deltoid facts are now explained as a proof sketch, but `4a` and `A = 2πa^2` still rely on a visual/known-formula bridge rather than a full derivation inside the spoken script.
  - Convex lower bound is explicitly labeled as a theorem; the video gives turnability and area, not a full proof of Pal's theorem.
  - Perron area shrinkage has epsilon logic but not a detailed inequality-by-inequality area ledger.

Follow-up visual/image subagent review after revisions:

- Agent ID: `019fb84a-607d-78c2-bcc2-4dc50963e702`
- Follow-up decision: `monitor_required`
- Confirmed evidence:
  - Canonical `real_frames/SH001-SH034/{start,key,end}.png` count is 102.
  - Current integrity JSON matches the current 102 PNG hashes with mismatch count 0.
  - SH025-SH029 real frames were regenerated before contact sheets and integrity audit.
  - SH027/SH028 derivation layers are present in `real_frames`, delivery copies, and regenerated contact sheets.
- Confirmed gap:
  - Current evidence still does not support the claim that all 102 images have passed full-size human visual/math approval.

## Web / Package Evidence

Rebuilt artifacts:

- Prompt asset package: `node scripts/build_kakeya_byleth_prompt_asset_package.js`
- Real-frame locked prompts: `node scripts/build_kakeya_real_video_prompts.js`
- Real-frame review page: `node scripts/build_kakeya_real_frame_asset_viewer.js`
- One-pass full-video handoff: `node scripts/build_kakeya_one_pass_full_video_handoff.js --dry-run`
- Contact sheets: `python3 scripts/build_kakeya_real_frame_contact_sheets.py`
- Frame progression audit: `python3 scripts/audit_kakeya_frame_progression.py`
- Delta/dimension proof frames: `python3 scripts/render_kakeya_delta_tube_real_frames.py`

Current web-facing assets:

- Review page: `delivery/real_frame_preview_kakeya_byleth_2026-07-28/asset_viewer.html`
- One-pass queue: `delivery/one_pass_full_video_handoff_kakeya_byleth_2026-07-31/full_video_queue_viewer.html`
- Proof notes: `proof_notes_freshman_level.md`
- Main web link entry: `site/app.js`

Text search verified that the rebuilt review page and one-pass handoff include:

- Edelgard's improved objection: `为什么不能再小`
- Convex special-case motivation: `一般情况太滑`
- Triangle turnability proof cue: `先证明它真的能转`
- Perron transition: `方向账本`
- Deltoid scale/area bridges: `每条可用切线弦`, `A 等于二 pi a 平方`
- Delta and dimension proof cues: `delta / sin alpha`, `1/delta^2`

## Remaining Risks

- Full-size human visual/math review for all 102 frames is still missing; current evidence supports machine integrity, frame-progression audit pass, regenerated contact-sheet review, and key full-size spot checks.
- The repaired chalk/parchment overlays improve motion anchors, but they still require human review for taste, mathematical readability, and whether the overlays feel integrated enough for the intended live-action style.
- Video generation remains one-pass, so post-generation QA is mandatory: identity drift, formula flicker, geometric deformation, and adjacent-cut continuity can only be assessed after clips exist.

## Decision

`monitor_required`

This package is much closer to a clear public-science explanation. It should not yet be called `approved_for_video`; the honest current state is: prompt/script/proof logic has been revised and rebuilt, 102 real frames pass machine integrity and all 34 triplets pass frame-progression audit, but full-size frame-by-frame human visual approval and generated-video QA remain open.
