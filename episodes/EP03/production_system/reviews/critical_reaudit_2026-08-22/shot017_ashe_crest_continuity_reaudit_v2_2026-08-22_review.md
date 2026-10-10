# Shot017 Ashe Crest Recognition And Continuity Re-Audit v2

Review date: 2026-08-22
Artifact: critical_reaudit_regen_v2_2026-08-22
Status: monitor_required

## Why v1 Was Rejected

The frozen v1 frames were integrated live-action candidates, but the END repeated Shot016's raised stop-hand gesture and the recognition beat did not land on a sufficiently clear physical change. v1 is retained as historical evidence and marked blocked_needs_revision.

## Current Frame Review

- START receives Shot016 v2's wet foggy ridge and makes Ashe the new foreground subject. The blue shield and worn emblem sit in the right foreground, while female Byleth remains behind him.
- KEY makes Ashe's eye-line and softened bowstring carry the recognition beat. The emblem remains a physical scratched surface, not readable text or a glowing icon.
- END is deliberately different from START: Ashe lowers the bow nearly vertical beside his leg, the string hangs slack, his drawing hand opens, and he turns back toward female Byleth. Byleth's hands stay low and the right-side lane remains open for Shot018.

## Gate Checks

- Canonical female Byleth identity: pass_in_still_frames_monitor_in_motion
- Canonical academy Ashe identity: pass_in_still_frames_monitor_in_motion
- Integrated live-action staging: pass_in_still_frames
- Physical emblem without readable text/UI: pass_in_still_frames_monitor_in_motion
- START/KEY/END distinct action states: pass
- Shot016 eyeline and geography continuity: pass_in_still_frames_monitor_in_motion
- Shot018 right-side protective-lane handoff: pass_in_still_frames_monitor_in_motion
- Upload-only executable prompt: rewritten_upload_only
- Japanese dialogue only: pass
- No burned subtitles/UI: required_in_prompt_and_negative

## Remaining Risks And Required Next Gate

Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. Inspect Ashe's bowstring, drawing hand, face/age, Byleth's female identity, emblem stability, and the open right-side lane. Reject if Ashe fires, Byleth repeats Shot016's stop hand, Felix enters early, the two performers become a flat lineup, or gore, magic, subtitles, Chinese/Mandarin voice, UI, or borders appear.
