# Shot015 Critical Re-Audit Review v3

Review date: 2026-08-22
Artifact: critical_reaudit_regen_v3_2026-08-22
Status: monitor_required

## Why v2 Was Rejected

The previous v2 made Byleth perform an invented stop gesture inside a shot whose source beat is the Western Church vanguard pressing through fog. That weakened the reverse-cut from the frozen Shot014 arrow impact and made the handoff to Shot016 feel staged rather than motivated. v2 is retained as historical evidence and marked blocked_needs_revision.

## Current Frame Review

- START carries the arrow/shield shock as a blurred lower-left foreground echo, then introduces a four-to-five-person church vanguard from the upper-left fog.
- KEY advances the same group by real steps: the front shield bearer braces, a second soldier closes diagonally, and the rear soldiers retain depth.
- END checks the push, holds the spear on a rightward diagonal, and leaves the next-shot entry lane open.
- Shot015 contains no named character. Female Byleth remains the canonical identity for her first appearance in frozen Shot016.

## Gate Checks

- Integrated live-action staging: pass_in_still_frames
- Local Seiros soldier identity: pass_in_still_frames_monitor_in_motion
- Four-to-five-person scale / non-clone formation: pass_in_still_frames_monitor_in_motion
- START/KEY/END distinct: pass
- Shot014 arrow-impact continuity: pass_in_still_frames
- Shot016 rightward handoff: pass_in_still_frames_monitor_in_motion
- Web executable prompt contract: rewritten_upload_only
- Japanese dialogue only: pass
- No burned subtitles/UI: required_in_prompt_and_negative

## Remaining Risks And Required Next Gate

Run a 3-second motion probe before any approved_for_video promotion. Reject if a named character enters early, the unit becomes a flat clone wall, the arrow echo disappears, the spear strikes, or gore, magic, subtitles, Chinese/Mandarin voice, UI, or borders appear.
