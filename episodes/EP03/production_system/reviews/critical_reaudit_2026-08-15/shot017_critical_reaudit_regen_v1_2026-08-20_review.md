# Shot017 Critical Re-Audit Review

Review date: 2026-08-20
Reviewer role: visual QA / continuity reviewer
Artifact: `Shot017_critical_reaudit_regen_v1_2026-08-20`
Status: `monitor_required`

## Blocking Issues Found In Prior Candidate

The prior `local_asset_final_candidate_v1_2026-08-02` is downgraded to `blocked_needs_revision`. Byleth read as male or ambiguous in the background, Ashe skewed too mature, and the visible action leaned toward firing at a shield rather than recognizing the Gaspard crest and hesitating.

## Current Frame Review

- START: Ashe is in combat readiness while female Byleth is clearly present as the academy professor, not a male background partner.
- KEY: the shield crest becomes the recognition object and Ashe's bowstring is no longer a release moment.
- END: Ashe lowers/turns back toward female Byleth, creating a readable cut-out for Felix covering him in Shot018.

## Remaining Risks

- Ashe still trends slightly mature and needs motion monitoring.
- The shield crest must stay a worn physical emblem, not text, UI, or magic.
- Byleth must stay female and secondary; she should not become a male partner or steal the emotional focus.
- Felix must not enter before the next shot.

## Required Next Gate

Run a 3-second motion probe before any `approved_for_video` promotion. Reject if Byleth becomes male or ambiguous, Ashe ages into an adult prince, the arrow fires, the crest becomes UI/text/glow, subtitles or Chinese/Mandarin voice appear, or the three anchors collapse into a static shield closeup.
