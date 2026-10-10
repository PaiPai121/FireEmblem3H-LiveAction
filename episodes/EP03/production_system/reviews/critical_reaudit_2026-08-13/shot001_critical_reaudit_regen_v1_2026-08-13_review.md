# Shot001 Critical Re-Audit Regeneration V1 Review

Date: 2026-08-13
Decision: monitor_required

## Reviewed Frames

- Contact sheet: `episodes/EP03/storyboards/Shot001/critical_reaudit_regen_v1_2026-08-13/contact_sheet.jpg`
- Start: `episodes/EP03/storyboards/Shot001/critical_reaudit_regen_v1_2026-08-13/start_frame.png`
- Key: `episodes/EP03/storyboards/Shot001/critical_reaudit_regen_v1_2026-08-13/key_frame.png`
- End: `episodes/EP03/storyboards/Shot001/critical_reaudit_regen_v1_2026-08-13/end_frame.png`

## Re-Audit Finding

The previous current web candidate was unsafe to display as `visual_review_passed`: it used the wrong/old Byleth identity path and read as pasted half-body figures over a background plate. It also pointed its metadata source reference to `source_refs/Shot001_source.png`, while the real project source reference is `episodes/EP03/source_refs/Shot001_source.png`.

The regenerated v1 frames use local female Byleth professor selected, Sothis dream selected, the EP03 source dream close-up, and the dream sanctuary reference. START/KEY/END now describe one coherent dream beat: quiet face-to-face contact, green particle peak, then fading cut-out state.

## Remaining Risk

This is not `approved_for_video`. It remains `monitor_required` because motion can still drift Byleth gender/age, Sothis age, facial identity, and particle exposure. Reject any motion probe that adds UI, subtitles, watermarks, Chinese voice, adult Sothis, male Byleth, or collapses the three anchors into a static hold.
