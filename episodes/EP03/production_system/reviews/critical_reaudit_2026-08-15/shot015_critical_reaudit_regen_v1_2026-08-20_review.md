# Shot015 Critical Re-Audit Review

Review date: 2026-08-20
Reviewer role: visual QA / continuity reviewer
Artifact: `Shot015_critical_reaudit_regen_v1_2026-08-20`
Status: `monitor_required`

## Blocking Issues Found In Prior Candidate

The prior `local_asset_final_candidate_v1_2026-08-02` is downgraded to `blocked_needs_revision`. Byleth appeared only as an unreadable black-haired rear silhouette across the frame set, so the female-Byleth-only lock was not visually proven.

## Current Frame Review

- START: disciplined rebels emerge from fog and female Byleth is readable in side/front view.
- KEY: the rebel shield-and-spear line becomes the pressure peak without gore or UI.
- END: the line reaches maximum pressure while female Byleth remains readable and prepares the handoff to Dimitri's counterline.

## Remaining Risks

- The rebel line could drift into cloned soldiers during motion.
- The shield and banner symbols could become readable text or UI.
- Byleth must not return to an unreadable rear silhouette in video.

## Required Next Gate

Run a 3-second motion probe before any `approved_for_video` promotion. Reject if Byleth becomes male, ambiguous, war-phase, sexualized, or unreadable; if rebels become clones/bandits/monsters; if spear impact or gore appears; or if subtitles, UI, Chinese/Mandarin voice, or readable text appear.
