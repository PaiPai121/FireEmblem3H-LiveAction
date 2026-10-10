# Shot024 Byleth Command Two-Wing Integrated Re-Audit v2

Review date: 2026-08-22
Artifact: critical_reaudit_regen_v2_2026-08-22
Status: monitor_required

## Why The Previous Set Was Rejected

The frozen v1 set was generated before the Shot023 v3 repair and could not be treated as the current receiving shot. Its spec remained frames_pending, its prompt allowed source/layout fallback, and it carried unrelated Rhea/Catherine locks. v1 is retained as historical evidence and marked blocked_needs_revision.

## Current Frame Review

- START receives the repaired Shot023 geography. Female Byleth enters the foreground and scans the wounded, Ashe, and Lonato; the students have not yet split.
- KEY is the decision point. Byleth's low sword tip and eyes divide the road into two flank lanes without aiming at a body. Ashe and Lonato stay non-violent in the pressure layer.
- END begins the handoff: Dimitri and Dedue take the left/center first steps, Ingrid opens the right fog lane, Byleth holds the center, and the road remains open for Shot025.

## Gate Checks

- Female academy Byleth identity: pass_in_still_frames_monitor_in_motion
- Academy Dimitri/Dedue/Ingrid identity: pass_in_still_frames_monitor_in_motion
- Dedue visible nape braid: pass_in_still_frames_monitor_in_motion
- Ashe/Lonato continuity from Shot023: pass_in_still_frames_monitor_in_motion
- Non-violent sword-tip command: pass_in_still_frames_monitor_in_motion
- Two-wing handoff to Shot025: pass_in_still_frames_monitor_in_motion
- Integrated live-action staging and shared ground contact: pass_in_still_frames
- START/KEY/END distinct action states: pass
- Upload-only executable prompt: rewritten_upload_only
- Japanese dialogue only: pass
- No burned subtitles/UI: required_in_prompt_and_negative

## Remaining Risks And Required Next Gate

Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. Inspect Byleth's female identity and restraint, sword-tip geometry, Dedue's braid, the low bow and low Lonato weapon, the two lane directions, shared mud contact, and the Japanese order. Reject if the shot becomes a pasted collage, static lineup, attack, age drift, male/war-phase Byleth, Chinese/Mandarin voice, subtitles, or UI.
