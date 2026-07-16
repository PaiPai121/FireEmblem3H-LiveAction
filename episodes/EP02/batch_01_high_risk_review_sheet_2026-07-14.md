# EP02 Batch 01 High-Risk Review Sheet

Date: 2026-07-14

Batch payload:

- `episodes/EP02/video_payloads_2026-07-14/batches/batch_01_high_risk_identity.jsonl`

Batch jobs:

- `episodes/EP02/video_batches_2026-07-14/batch_01_high_risk_identity.md`

## Purpose

Run this batch before the rest of the episode. These shots are most likely to reveal identity drift, collage generation, unsafe action, or unwanted reveals.

## Review Table

| Shot | Main risk | Required pass condition | Status | Notes |
| --- | --- | --- | --- | --- |
| Shot009 | Previous v1 was a collage; v2 should fix it | One continuous cloister shot; no split-screen | not_generated | Uses v2 still |
| Shot017 | Three house leaders may drift in motion | Edelgard, Dimitri, Claude all identifiable and young | not_generated | Uses v3 still |
| Shot019 | Blue Lions group identity may drift in motion | Dimitri/Dedue/Felix/Sylvain remain distinct | not_generated | Uses v2 still |
| Shot024 | Motion may still mature Felix | Youthful academy Felix, cold narrow gaze | not_generated | Uses v3 still |
| Shot027 | Motion may still age Ashe or overplay archery | Boyish pale ash-gray Ashe; safe archery | not_generated | Uses v3 still |
| Shot033 | Dimitri may become war-phase rage | Young academy Dimitri, subtle restraint only | not_generated |  |
| Shot036 | Dimitri dark-line may overplay | Polite young Dimitri, tense hand, no madness | not_generated |  |
| Shot041 | Mask may reveal identity or redesign | Flame Emperor remains masked and unreadable | not_generated |  |

## Decision Rules

- If 6 or more pass: continue with Batch 02-06.
- If 3-5 pass: fix recurring prompt issues before running full batches.
- If fewer than 3 pass: stop and revise stills/prompt strategy before spending more generation time.
- If Shot009 is the only failure, fix it separately and continue; it is no longer a representative character-identity risk.

## Common Fixes

- Identity drift: add selected still as stronger first-frame reference and reduce camera motion.
- Aging: explicitly repeat academy-phase youth and remove mature/war terms.
- Unsafe training action: convert to drill, target, stance, or reaction rather than impact.
- Collage output: request one continuous shot, single camera, no panels, no montage board.
- Mask reveal: use tighter negative prompt: no exposed face, no lifted mask, no identity reveal.
