# Shot018 Felix Protective Cover Direction Re-Audit v3

Review date: 2026-08-22
Artifact: critical_reaudit_regen_v3_2026-08-22
Status: monitor_required

## Why v1 Was Rejected

Shot018 v2 was directionally invalid: the enemy blade entered from screen-left while Felix's gaze drifted screen-right, so the action line and eyeline contradicted each other. v2 is retained as historical evidence and marked blocked_needs_revision. The earlier v1 frame chain also had a less legible protective cover beat and unrelated prompt locks.

## Current Frame Review

- START receives Shot017 v2's lowered-bow Ashe and uses the open right-side lane for Felix's entry. Felix is already moving across Ashe's front, not standing beside him.
- KEY makes the cover beat and direction explicit: Felix owns the lane, his head, eyes, chest, shoulders, stance, and sword all face screen-left, and one plain weapon edge from outside the left frame meets his blade. No attacker identity or graphic impact is shown.
- END settles into a left-facing guarded diagonal sword, leaves Ashe behind Felix, and opens a calm fog lane for the support-line cut.

## Gate Checks

- Canonical academy Felix identity: pass_in_still_frames_monitor_in_motion
- Canonical academy Ashe identity: pass_in_still_frames_monitor_in_motion
- Integrated live-action staging: pass_in_still_frames
- Protective lane, screen-left direction, and single non-graphic blade contact: pass_in_still_frames_monitor_in_motion
- START/KEY/END distinct action states: pass
- Shot017 lowered-bow continuity: pass_in_still_frames_monitor_in_motion
- Shot019 support-line handoff: pass_in_still_frames_monitor_in_motion
- Upload-only executable prompt: rewritten_upload_only
- Japanese dialogue only: pass
- No burned subtitles/UI: required_in_prompt_and_negative

## Remaining Risks And Required Next Gate

Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. Inspect Felix's lane ownership, sword geometry, Ashe's lowered bow, the non-graphic withdrawal, and the support-line exit. Reject if Felix becomes a killer, Ashe fires, a named attacker appears, the two become a flat lineup, or gore, magic, subtitles, Chinese/Mandarin voice, UI, or borders appear.
