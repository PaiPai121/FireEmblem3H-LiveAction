# Shot013 Critical Re-Audit Review

Review date: 2026-08-15
Reviewer role: visual QA / continuity reviewer
Artifact: `Shot013_critical_reaudit_regen_v1_2026-08-15`
Status: `monitor_required`

## Blocking Issues Found In Prior Candidate

The prior `local_asset_final_candidate_v1_2026-08-02` is downgraded to `blocked_needs_revision`. START, KEY, and END visually read as male or ambiguous black-haired Byleth, violating the project lock that EP03 uses female academy-era Byleth only.

The prior prompt also carried web-executable contamination: local paths, source references, and frame-spec references that a web video model cannot read.

## Current Frame Review

- START: female Byleth is readable as the academy professor and begins a mud-map briefing with Dimitri, Ashe, Felix, and Mercedes integrated into the same wet fog-road lighting.
- KEY: the mud sketch and stones clarify two routes; Ashe remains visible but protected, not pushed forward alone.
- END: the group transitions from briefing into deployment/listen state, giving a distinct cut-out before the first arrow in Shot014.

## Remaining Risks

- Five-character density may still cause face or costume drift during motion.
- Byleth and Felix both use dark academy silhouettes, so the motion model must not merge them.
- The mud sketch could drift into tactical UI, glowing route lines, or readable text.
- The first arrow must not appear or impact before Shot014.

## Required Next Gate

Run a 3-second motion probe before any `approved_for_video` promotion. Reject if Byleth becomes male, ambiguous, war-phase, or sexualized; if Ashe fires or advances alone; if the mud sketch turns into UI/grid/text; if subtitles or Chinese/Mandarin voice appear; or if START/KEY/END collapse into a static hold.
