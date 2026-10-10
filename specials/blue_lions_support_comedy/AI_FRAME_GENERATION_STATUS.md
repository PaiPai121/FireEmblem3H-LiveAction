# AI Frame Generation Status

Date: 2026-08-02

Image generation was used successfully for the original 16 support-comedy source shots:

- EP01 Dedue x Ashe: SH001, SH002, SH003, SH004
- EP02 Annette x Mercedes: SH001, SH002, SH003, SH004
- EP03 Felix x Sylvain: SH001, SH002, SH003, SH004
- EP04 Sylvain x Mercedes: SH001, SH002, SH003, SH004

Timing-safe delivery revision:

- Final Seedance delivery shots: 27
- Final Seedance delivery frames: 81
- Structure: variable shot counts and durations; no hard 4x15 template.
- Dialogue gate: every final shot passed dialogue-throughput timing with tail margin.
- Visual repair: every final delivery shot now uses a regenerated `raw_widescreen_sheet.png` source with three stacked horizontal widescreen frames.
- Rejected legacy handling: old portrait-panel expansion with reflected/blurred side fill is not used for final delivery frames.
- Anchor uniqueness gate: every final start/key/end frame set passes mean absolute difference threshold; exact duplicate and low-difference anchors are blocked.

Every regenerated widescreen sheet was split into package-local `start_frame.png`, `key_frame.png`, and `end_frame.png` files at 1280x720 for the final timing-safe packages.

No subtitles are present in the frame contract or prompts.
