# Shot023 Integrated Candidate V2 Review

Date: 2026-08-10

Reviewer role: storyboard / asset QA, independent from generator promotion

Frame set:
- `episodes/EP03/storyboards/Shot023/integrated_candidate_v2_2026-08-10/start_frame.png`
- `episodes/EP03/storyboards/Shot023/integrated_candidate_v2_2026-08-10/key_frame.png`
- `episodes/EP03/storyboards/Shot023/integrated_candidate_v2_2026-08-10/end_frame.png`

Contact sheet:
- `episodes/EP03/production_system/reviews/integrated_frame_repairs_2026-08-09/shot023_integrated_candidate_v2_triptych_2026-08-10.jpg`

Decision: `monitor_required`

Findings:
- The old `local_asset_final_candidate_v1` blocker is addressed: Ashe, Lonato, and Byleth now occupy one coherent battlefield scene with shared fog, perspective, and ground contact.
- Start/key/end are distinct and story-valid: Ashe's plea, Lonato hearing but refusing, then Byleth preparing the tactical response.
- The shot preserves the intended moral beat and avoids Ashe directly executing Lonato.
- Remaining risk: Ashe's bow geometry and Lonato shield/heraldry can drift in video; the model must not convert the beat into an attack or gore moment.

Required next gate:
- Run a 3-second image-to-video probe before any full-duration generation.
- Reject probe if Ashe fires at Lonato, if Lonato becomes a generic fantasy warlord, if Byleth steals the emotional center, or if subtitles/UI/readable text appear.

