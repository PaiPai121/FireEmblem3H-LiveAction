# Scene09 V3 Provider Upload Bundles

These folders and zip archives are the full-duration provider-facing handoff for EP02 Scene09 V3. They are structurally prepared but locked until `full_duration_release_gate` passes.

## Status

- Package status: full_duration_upload_prepared_locked_probe_release_pending.
- Batches: 7.
- Shots: 42.
- Generated clips included here: 0.
- Final video included here: no.
- Full-duration release gate: must be `full_duration_release_passed` before upload.

## What To Upload

- Do not upload these full-duration batches while `full_duration_release_gate` is blocked.
- After release, upload one `batch_###_shots_###-###.zip` at a time, or upload the matching unzipped folder if the provider requires loose files.
- After release, inside each batch, use `batch.jsonl` for structured submission or `batch.csv` plus `ORDERED_UPLOAD_CHECKLIST.md` for manual entry.
- Each shot row points only to bundle-local files under `shots/`: `model_prompt.md`, `negative_prompt.md`, `start_frame.png`, `key_frame.png`, and `end_frame.png`.
- Submit shots in row order. Generate exactly one mp4 per row.

## Hard Generation Rules

- Do not add anonymous readable students, spectators, soldiers, crowds, bystanders, or silhouettes.
- Preserve the `visible_named_only` roster exactly for every row.
- Preserve `visible_but_no_active_combat_after`: readable names in that field may stand down, concede, lower weapons, or remain post-battle only.
- Preserve the after-shot attrition ledger. Characters marked defeated, captured, stood down, objective-defeated, or `must_not_return_active` cannot resume active combat later.
- Hubert remains captured by Felix and Ashe after Shot032F.
- Dorothea and Bernadetta remain captured by Leonie and Claude after Shot032G.
- Hanneman and Manuela are separate faculty examiners, never a paired allied unit.
- Shot034B permits only Byleth and Dimitri; both faculty objective markers remain empty; Hanneman/Manuela are absent/offscreen/silent/unpaired.
- The mock battle remains nonlethal: no blood, gore, humiliation, or lethal weapon escalation.

## Return Clips

- Preferred returned filenames are listed in each batch's `expected_downloads_subset.csv`.
- Exact expected filenames like `36_Shot034B.mp4` are accepted by ingest.
- Filenames with `custom_id` prefixes like `036_Shot034B_provider_take01.mp4` are also accepted.
- Bare shot-name files like `Shot034B.mp4` are intentionally rejected as too weak for safe ingest.
- Return format is `.mp4` only; `.mov`, `.m4v`, `.webm`, image files, contact sheets, and archives are rejected until redownloaded or transcoded to `.mp4`.
- Keep each batch's returned clips together so they can be placed under `clip_return_intake/batch_###_shots_###-###_returns/returned_mp4/`.

## After Return

- Do not copy returned clips into final expected paths by hand.
- First run the package ingest dry-run, then apply only if every match is unique and every mp4 passes container probing.
- Returned clips still require Codex motion QA, provenance checks, revision queue clearance, concat gate, and final edit structural audit.
- Motion QA must verify the full post-shot ledger fields: Alive / Safe After; Visible But No Active Combat After; Active / Controlling After; Limited But Not Defeated After; Defeated / Removed After; Captured / Objective-Defeated After; Stood Down / Post-Battle After; Must Not Return Active; Changed This Shot; No-Active-Combat Line.
- The four critical locks remain mandatory after return: Shot032F Hubert captured by Felix/Ashe; Shot032G Dorothea and Bernadetta captured by Leonie/Claude; Shot034B empty faculty objective with Hanneman/Manuela absent/offscreen/unpaired; Shot034G exhausted Dimitri/Dedue core victory.
- These bundles by themselves do not satisfy final video delivery.

See `RETURN_CONTRACT.md` for the exact post-provider return contract.
