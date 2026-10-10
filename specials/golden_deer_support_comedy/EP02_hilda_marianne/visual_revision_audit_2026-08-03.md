# EP02 Hilda x Marianne Visual Revision Audit - 2026-08-03

Target package: `delivery/video_generation_package_2026-07-31_timing_safe`

## Integrity Summary

- Existing frame files are present for EP02 shots 004-010.
- Existing metadata marks the shots `approved_for_video`, but the frame provenance shows copied timing-safe parent anchors for several micro-shots.
- The visible material does not prove the declared dialogue/action beats strongly enough for Seedance image-to-video generation.

## Visual Audit Coverage

Reviewed shots: 004_GDSC02-SH002B through 010_GDSC02-SH004C.

## Failed Shots

| Shot | Dialogue Beat | Existing Visual Problem | Decision | Required Revision |
| --- | --- | --- | --- | --- |
| 004_GDSC02-SH002B | Hilda hands the work to Marianne and retreats; Marianne can only say "um..." | Current frames show a polite handoff but not the comedic responsibility dump or Hilda's retreat. | blocked_needs_revision | Show Hilda physically passing cloth/books, stepping back toward exit, Marianne left holding the task. |
| 005_GDSC02-SH003A | Hilda returns and blurts out surprise at the mess. | Current frames do not clearly show Hilda entering into a visibly worsened mess. | blocked_needs_revision | Show doorway/aisle re-entry, Hilda stopped mid-step, chaotic book stacks visible. |
| 006_GDSC02-SH003B | Hilda realizes it is more scattered than before. | Current frames repeat the same pointing/table setup and underplay the disorder. | blocked_needs_revision | Emphasize scattered categories, toppled stacks, Hilda's exasperated but non-cruel reaction. |
| 007_GDSC02-SH003C | Marianne apologizes because she cannot figure out the order. | Current frames show Marianne holding books rather than visibly self-blaming amid the confused layout. | blocked_needs_revision | Show Marianne small and apologetic beside mismatched piles, Hilda softening. |
| 008_GDSC02-SH004A | Hilda gives in and starts teaching the method. | Current frames jump to a clean table without the decision to teach. | blocked_needs_revision | Show Hilda pointing out categories and taking charge while Marianne watches. |
| 009_GDSC02-SH004B | Hilda explains sorting by category; Marianne is impressed. | Current frames do not show book categories moving from mess toward order. | blocked_needs_revision | Show clear category piles, Hilda sorting actively, Marianne's impressed attention. |
| 010_GDSC02-SH004C | Hilda realizes she ended up doing it herself. | Current frames lack payoff and tidy-result contrast. | blocked_needs_revision | Show table mostly organized, Hilda with a small tired smile/sigh, Marianne grateful. |

## Promotion Decision

EP02 shots 004-010 are demoted from visual approval until each shot receives distinct start/key/end frames that prove its own dialogue beat and cut handoff.

## Revision Result

Applied revision script: `scripts/apply_gdsc_ep02_visual_revisions.py`

Revised frame source directory: `specials/golden_deer_support_comedy/EP02_hilda_marianne/visual_revisions_2026-08-03`

| Shot | Revised Visual Beat | Post-Revision Decision |
| --- | --- | --- |
| 004_GDSC02-SH002B | Hilda transfers cloth/books to Marianne, then backs away while Marianne is left holding the work. | visual_review_passed |
| 005_GDSC02-SH003A | Hilda re-enters and visibly freezes at the worsened book-table mess. | visual_review_passed |
| 006_GDSC02-SH003B | Hilda points out the confused piles; the mess reads as worse rather than cleaned. | visual_review_passed |
| 007_GDSC02-SH003C | Marianne apologizes with a small, self-blaming posture; Hilda softens and prepares to teach. | visual_review_passed |
| 008_GDSC02-SH004A | Hilda gives in and begins teaching the sorting method at the table. | visual_review_passed |
| 009_GDSC02-SH004B | Hilda demonstrates category sorting; Marianne's impressed reaction is motivated. | visual_review_passed |
| 010_GDSC02-SH004C | The tidy table and Hilda's resigned expression sell the payoff that she did the work herself. | visual_review_passed |

Post-revision gates:

- `scripts/check_gdsc_visual_gate.py`: passed.
- `scripts/validate_gdsc_web_links.py`: passed.
- `scripts/check_gdsc_delivery_contract.py`: passed.
- `scripts/audit_gdsc_video_prompts.py`: passed.
