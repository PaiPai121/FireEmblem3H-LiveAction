# EP03 Start/Key/End Chain Audit - 2026-08-08

## Integrity Summary

- Reviewed package: `delivery/complete_script_shot_asset_package_2026-08-01`
- Reviewed frame sets: 36/36
- Exact duplicate frame pairs: 0
- Duplicate-like / too-static motion chains: 6
- Contact sheet: `ep03_start_key_end_triptych_audit_2026-08-08.jpg`
- Metrics: `ep03_start_key_end_duplicate_metrics_2026-08-08.json`

## Visual Audit Coverage

All current START, KEY, and END frame triptychs were checked with pixel/RMS metrics, perceptual hash distance, and a contact-sheet visual pass. The metric is a triage signal only; the decision follows the storyboard rule that the three anchors must prove pre-action state, action/emotional peak, and cut-out state.

## Existing Shots Failed

| Shot | Decision | Reason | Required Revision |
| --- | --- | --- | --- |
| Shot003 | blocked_needs_revision | Start and key frames are nearly the same cathedral briefing composition, so the action peak is not distinct enough from the pre-action state. Metric max RMS 0.1114, min hash distance 3. | Regenerate or reselect three visibly distinct anchors: START must show the stable pre-action state, KEY must show the clearest action/emotional turn, and END must show a new cut-out state for the next edit. Do not satisfy the shot with near-identical still variants; preserve local identity plates, Japanese audio constraints, no subtitles, no UI, and aspect-safe framing. |
| Shot012 | blocked_needs_revision | The rebel-camp distance frames remain mostly the same fog/camp read, with no clear start/key/end change for surveillance, recognition, or cut-out. Metric max RMS 0.1082, min hash distance 30. | Regenerate or reselect three visibly distinct anchors: START must show the stable pre-action state, KEY must show the clearest action/emotional turn, and END must show a new cut-out state for the next edit. Do not satisfy the shot with near-identical still variants; preserve local identity plates, Japanese audio constraints, no subtitles, no UI, and aspect-safe framing. |
| Shot023 | blocked_needs_revision | Lonato refusal stays in a very similar dialogue tableau across all anchors; the 18-second beat needs visible refusal, Ashe reaction pressure, and end-state escalation. Metric max RMS 0.117, min hash distance 13. | Regenerate or reselect three visibly distinct anchors: START must show the stable pre-action state, KEY must show the clearest action/emotional turn, and END must show a new cut-out state for the next edit. Do not satisfy the shot with near-identical still variants; preserve local identity plates, Japanese audio constraints, no subtitles, no UI, and aspect-safe framing. |
| Shot030 | blocked_needs_revision | Aftermath group stillness reads as a hold rather than a start/key/end reaction chain; the key emotional turn is not isolated. Metric max RMS 0.1394, min hash distance 10. | Regenerate or reselect three visibly distinct anchors: START must show the stable pre-action state, KEY must show the clearest action/emotional turn, and END must show a new cut-out state for the next edit. Do not satisfy the shot with near-identical still variants; preserve local identity plates, Japanese audio constraints, no subtitles, no UI, and aspect-safe framing. |
| Shot031 | blocked_needs_revision | Return-to-Rhea anchors collapse into a static audience/reporting composition; key/end do not make the institutional judgment beat progress. Metric max RMS 0.1258, min hash distance 10. | Regenerate or reselect three visibly distinct anchors: START must show the stable pre-action state, KEY must show the clearest action/emotional turn, and END must show a new cut-out state for the next edit. Do not satisfy the shot with near-identical still variants; preserve local identity plates, Japanese audio constraints, no subtitles, no UI, and aspect-safe framing. |
| Shot035 | blocked_needs_revision | Night talk anchors feel like three versions of the same corridor still; the 18-second Dimitri line needs a visible performance turn and edit handoff. Metric max RMS 0.1131, min hash distance 67. | Regenerate or reselect three visibly distinct anchors: START must show the stable pre-action state, KEY must show the clearest action/emotional turn, and END must show a new cut-out state for the next edit. Do not satisfy the shot with near-identical still variants; preserve local identity plates, Japanese audio constraints, no subtitles, no UI, and aspect-safe framing. |

## Monitor Required

The other 30 shots remain `monitor_required`, not approved for video. Several are visually different but still need full-resolution review and a 3-second motion probe before any promotion.

## Support-Comedy Reference Standard

After comparing the local Golden Deer and Black Eagles support-comedy packages, EP03 should use those packages as the local precedent for dialogue-heavy shot packaging:

- Golden Deer timing-safe packages prove that dense spoken Japanese should be split or staged as playable 6-12s-style performance beats instead of long static holds.
- Black Eagles support-comedy packages prove that even quiet two-person dialogue needs a visible start/key/end acting chain, explicit identity and wardrobe locks, no subtitles/UI, clean 16:9 frame presentation, and a 3-second motion probe before full generation.
- The relevant reference standard is now recorded at `ep03_support_comedy_reference_repair_standard_2026-08-08.md`.

This does not change EP03's story or tone into support comedy. It changes the production requirement: EP03 dialogue and aftermath shots must show the same level of start/key/end performance progression that the approved local support packages demonstrate.

## Promotion Decision

Do not treat the current package as a video-generation package. The highest truthful stage remains `prompt_asset_package`. The six failed shots must be regenerated or reselected with distinct START/KEY/END anchors before any visual or motion promotion.
