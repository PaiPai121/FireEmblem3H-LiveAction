# Golden Deer Support Comedy - Full Package Review

Date: 2026-08-04

Target package: `delivery/video_generation_package_2026-07-31_timing_safe`

Review scope: all four Golden Deer support-comedy episodes, all 40 shot folders, start/key/end storyboard frames, prompt packages, subtitles, web viewers, and package gates.

## Gate Summary

| Gate | Result | Evidence |
| --- | --- | --- |
| Visual file gate | PASS | `python3 scripts/check_gdsc_visual_gate.py` -> `checked_shots: 40`, `errors: []` |
| Delivery contract | PASS | `python3 scripts/check_gdsc_delivery_contract.py` -> `episodes: 4`, `errors: []` |
| Video prompt QA | PASS | `python3 scripts/audit_gdsc_video_prompts.py` -> `decision: approved_for_video`, `episodes: 4` |
| Web link validation | PASS | `python3 scripts/validate_gdsc_web_links.py` -> `checked_html: 10`, `errors: []` |
| Cross-shot frame reuse | FAIL | `python3 scripts/audit_gdsc_frame_reuse.py` reports repeated frame groups in EP01, EP02, EP03, and EP04 |

Important distinction: the package passes structural gates, but it does not pass full visual-story review because multiple timing-safe micro-shots still reuse the same start/key/end frame chain for different dialogue beats.

2026-08-04 aspect-geometry correction: the earlier review missed visible flattened/squashed image content because it only checked `1280x720` frame dimensions. `scripts/check_gdsc_aspect_safety.py` now hard-fails Golden Deer delivery scripts that can non-uniformly resize final frames, and EP02 shot `005_GDSC02-SH003A` has been regenerated as native single-frame 16:9 anchors. See `aspect_geometry_audit_2026-08-04.md`.

## Review Contact Sheets

- `specials/golden_deer_support_comedy/review_contact_sheets_2026-08-04/EP01_hilda_lorenz_review_contact.jpg`
- `specials/golden_deer_support_comedy/review_contact_sheets_2026-08-04/EP02_hilda_marianne_review_contact.jpg`
- `specials/golden_deer_support_comedy/review_contact_sheets_2026-08-04/EP03_hilda_lysithea_review_contact.jpg`
- `specials/golden_deer_support_comedy/review_contact_sheets_2026-08-04/EP04_claude_lorenz_review_contact.jpg`

## Integrity Summary

- All expected shot folders, frames, prompts, negative prompts, metadata, subtitle sidecars, queues, runbooks, and viewers exist.
- Every shot has 1280x720 `start_frame.png`, `key_frame.png`, and `end_frame.png`.
- Every prompt contains executable Japanese dialogue and no-subtitle/no-caption constraints.
- Chinese SRT/Markdown subtitle sidecars exist and are separate from Seedance prompts.
- The current package still contains cross-shot frame reuse that contradicts the project requirement that each micro-shot have its own meaningful start/key/end action state.

## Episode Decisions

| Episode | Current Decision | Reason |
| --- | --- | --- |
| EP01 Hilda x Lorenz | blocked_needs_revision | Mostly readable through SH004B, but SH004C reuses SH004A frames and does not provide a unique Hilda reaction payoff. |
| EP02 Hilda x Marianne | blocked_needs_revision | SH002B-SH004C were repaired and now read, but SH001A/SH001B still reuse identical frames; SH002A also bleeds into the later handoff beat. |
| EP03 Hilda x Lysithea | blocked_needs_revision | Large sections reuse the same frame chains; several visuals jump to perfume/oil before the dialogue reaches that beat. |
| EP04 Claude x Lorenz | blocked_needs_revision | Most micro-shot groups reuse parent frame chains; multiple Lorenz accusation beats are visually staged as Claude explanation beats. |

## EP01 Hilda x Lorenz

| Shot | Decision | Review Notes |
| --- | --- | --- |
| 001_GDSC01-SH001A | visual_review_passed | Greeting/training setup is readable. |
| 002_GDSC01-SH001B | visual_review_passed | Hilda's deflection/forgotten-item excuse reads acceptably. |
| 003_GDSC01-SH002A | visual_review_passed | Lorenz offering help reads through posture and two-shot staging. |
| 004_GDSC01-SH002B | visual_review_passed | Hilda's fragile/lazy plea reads. |
| 005_GDSC01-SH002C | visual_review_passed | Lorenz accepts the noble-duty framing. |
| 006_GDSC01-SH003A | visual_review_passed | Hilda asking Lorenz to take on her combat burden is visible. |
| 007_GDSC01-SH003B | visual_review_passed | Hilda's playful "just look like fighting" beat reads. |
| 008_GDSC01-SH003C | visual_review_passed | Lorenz's earnest agreement reads. |
| 009_GDSC01-SH004A | monitor_required | Payoff beat is serviceable, but it shares the same frame chain with SH004C. |
| 010_GDSC01-SH004B | visual_review_passed | Lorenz's formal full-name correction reads. |
| 011_GDSC01-SH004C | blocked_needs_revision | Reuses SH004A frames exactly; lacks a unique Hilda "he is interesting" private reaction. |

EP01 required revision: regenerate `011_GDSC01-SH004C` start/key/end as a Hilda reaction payoff. If keeping SH004A as-is, remove all duplicate reuse against SH004C.

## EP02 Hilda x Marianne

| Shot | Decision | Review Notes |
| --- | --- | --- |
| 001_GDSC02-SH001A | monitor_required | Library-cleaning complaint is readable, but it is identical to SH001B. |
| 002_GDSC02-SH001B | blocked_needs_revision | Reuses SH001A exactly and does not show Hilda being busy with snacks/pastry. |
| 003_GDSC02-SH002A | blocked_needs_revision | The frame action already resembles a work handoff, which belongs to SH002B; it should instead show Hilda fishing for Marianne's agreement and Marianne hesitating. |
| 004_GDSC02-SH002B | visual_review_passed | Rebuilt frames clearly show Hilda transferring cloth/books and retreating. |
| 005_GDSC02-SH003A | visual_review_passed | Rebuilt frames clearly show Hilda re-entering and discovering the worse mess. |
| 006_GDSC02-SH003B | visual_review_passed | Rebuilt frames show the confused piles and Hilda's non-cruel exasperation. |
| 007_GDSC02-SH003C | visual_review_passed | Rebuilt frames show Marianne apologizing and Hilda softening. |
| 008_GDSC02-SH004A | visual_review_passed | Rebuilt frames show Hilda deciding to teach and starting the method. |
| 009_GDSC02-SH004B | visual_review_passed | Rebuilt frames show active category sorting and Marianne's impressed response. |
| 010_GDSC02-SH004C | monitor_required | Rebuilt frames sell Hilda's payoff, but Marianne is less present than ideal in the final crop; acceptable for the current Hilda-only punchline, still worth clip QA. |

EP02 required revision: regenerate `002_GDSC02-SH001B` and `003_GDSC02-SH002A`; optionally widen `010_GDSC02-SH004C` if later clip QA needs Marianne's reaction.

## EP03 Hilda x Lysithea

| Shot | Decision | Review Notes |
| --- | --- | --- |
| 001_GDSC03-SH001A | monitor_required | Establishes Hilda/Lysithea in courtyard but shares frames with SH001B. |
| 002_GDSC03-SH001B | blocked_needs_revision | Reuses SH001A exactly; Hilda asking what Lysithea is doing needs its own recognition/turn beat. |
| 003_GDSC03-SH002A | blocked_needs_revision | Dialogue is about Hilda assuming Lysithea judged her for asking favors, but the frame already jumps to perfume/oil staging. |
| 004_GDSC03-SH002B | blocked_needs_revision | Reuses the perfume staging from SH002A; does not uniquely show Lysithea analyzing why people listen to Hilda or Hilda saying she is not forcing anyone. |
| 005_GDSC03-SH002C | blocked_needs_revision | Same frame chain again; the "that is what is mysterious" beat has no unique reaction. |
| 006_GDSC03-SH003A | monitor_required | Lysithea's analytical critique can be inferred, but the frame chain is reused by SH003B. |
| 007_GDSC03-SH003B | blocked_needs_revision | Reuses SH003A; the compliment/blame and scent discovery beat needs a clearer smell/perfume reaction. |
| 008_GDSC03-SH004A | blocked_needs_revision | Reuses the same frame chain as SH004B/SH004C and does not clearly show Hilda applying the oil. |
| 009_GDSC03-SH004B | blocked_needs_revision | Reuses SH004A; Lysithea's happy same-scent/mature-feeling reaction is not visually distinct. |
| 010_GDSC03-SH004C | blocked_needs_revision | Reuses SH004A; Hilda's private "that smile is cute" reaction is missing as an independent payoff. |

EP03 required revision: regenerate most of the episode in dialogue-specific groups:

- `002_GDSC03-SH001B`: recognition beat.
- `003-005_GDSC03-SH002*`: request/analysis beat before perfume appears.
- `007_GDSC03-SH003B`: scent discovery beat.
- `008-010_GDSC03-SH004*`: oil application, Lysithea happy/mature reaction, Hilda private softening payoff.

## EP04 Claude x Lorenz

| Shot | Decision | Review Notes |
| --- | --- | --- |
| 001_GDSC04-SH001A | blocked_needs_revision | Opening should show Lorenz catching Claude and Claude's startled "owa" reaction; current frames are too calm and are reused by SH001B. |
| 002_GDSC04-SH001B | blocked_needs_revision | Reuses SH001A exactly; Lorenz's "still wandering?" accusation needs its own Lorenz-led beat. |
| 003_GDSC04-SH002A | monitor_required | Claude's monastery-love explanation can be inferred, but this frame chain is reused by SH002B/SH002C. |
| 004_GDSC04-SH002B | blocked_needs_revision | Dialogue is Lorenz accusing Claude of suspicious behavior, but visuals still center Claude explaining. |
| 005_GDSC04-SH002C | blocked_needs_revision | Reuses SH002A; Claude's "don't make me sound bad" denial should have its own playful defensive reaction. |
| 006_GDSC04-SH003A | monitor_required | Claude describing history/walls is readable, but shares frames with SH003B. |
| 007_GDSC04-SH003B | blocked_needs_revision | Reuses SH003A; Lorenz's unimpressed "what is interesting?" needs a Lorenz-led reaction. |
| 008_GDSC04-SH004A | blocked_needs_revision | Lorenz's suspicion/threat beat is staged with Claude dominating the frame, weakening the accusation. |
| 009_GDSC04-SH004B | monitor_required | Claude's "troublesome guy" beat partly reads, but it reuses SH004A and needs cleaner separation from Lorenz's threat. |

EP04 required revision: regenerate `001`, `002`, `004`, `005`, `007`, and `008`; consider retaining `003`, `006`, and `009` only if duplicate-frame groups are eliminated.

## Prompt And Subtitle Review

- Prompt structure is currently passable for Seedance submission: every shot names start/key/end frames, has executable Japanese dialogue, duration, motion/camera/performance instructions, identity locks, and no-subtitle/no-caption constraints.
- Negative prompts include bans on subtitles, captions, readable generated text, watermarks, face drift, costume drift, age drift, and extra named characters.
- Chinese subtitle sidecars are external review/subtitle artifacts. The video prompt contract remains no subtitles burned into generated video.
- Prompt QA cannot override failed visual storyboards. Any regenerated frames must trigger a prompt/metadata/viewer refresh for the affected shot.

## Required Fix Queue

Priority 0: eliminate cross-shot duplicate frame groups and missing dialogue-specific visuals.

1. EP03 broad rebuild: `002`, `003`, `004`, `005`, `007`, `008`, `009`, `010`.
2. EP04 broad rebuild: `001`, `002`, `004`, `005`, `007`, `008`.
3. EP02 targeted rebuild: `002`, `003`.
4. EP01 targeted rebuild: `011`.

Priority 1: review retained members of duplicate groups after replacements.

- EP01 `009`
- EP02 `001`, `010`
- EP03 `001`, `006`
- EP04 `003`, `006`, `009`

## Promotion Decision

Overall package decision: `blocked_needs_revision`.

Reason: current package is structurally complete but not visually complete. The full review found repeated frame chains and dialogue/visual mismatches that would require Seedance to invent the missing performance beat. That violates the video-generation-package requirement for distinct, executable start/key/end storyboard anchors per shot.
