# Shot006 Critical Re-Audit Regen V1 Review

Shot: Shot006 - Ashe 讲出旧恩
Date: 2026-08-15
Reviewed artifact: `episodes/EP03/storyboards/Shot006/critical_reaudit_regen_v1_2026-08-15/contact_sheet.jpg`
Status: `monitor_required`

## Finding

The previous web candidate is downgraded because Byleth visually read as male or ambiguous in the classroom background, violating the female-Byleth-only lock. The new frame chain was generated with local Ashe, female Byleth, Dimitri, and Officers Academy classroom references attached.

## Passes

- Female Byleth is visibly female and consistent across START, KEY, and END.
- Ashe remains the foreground emotional subject and reads as an academy-era student.
- Dimitri is present as a restrained witness and does not take over the beat.
- The classroom setting is preserved across all anchors.
- START, KEY, and END show distinct progression: gathering courage, window confession, and steadier decision.
- There is no visible game UI, subtitle, dialogue box, watermark, or source screenshot artifact.

## Monitor Risks

- KEY and END are still dialogue-heavy and must not freeze into a static portrait in video.
- Ashe must not age up or overact grief.
- Byleth must not drift back to male/ambiguous presentation in motion.
- The clip must not show Lonato or cut to an outdoor battle; Lonato is spoken about only.

## Required Next Gate

Run a 3-second motion probe before full video generation. Reject if Byleth becomes male or ambiguous, Ashe becomes an adult soldier, Dimitri steals focus, the classroom turns into a battlefield, or the shot adds subtitles/UI.
