# Scene09 V3 Motion Self-Audit Unsigned Evidence Rejection

Date: 2026-08-01
Decision: motion_self_audit_unsigned_evidence_rejection_passed
Rows tested: 42

This negative regression test builds a bad proposal where every row claims `motion_review_passed` and sets review booleans to true, but leaves the current clip signature and start/mid/end frame signatures unsigned. The real apply gate must reject it.

## Probe

- Apply gate decision: motion_self_audit_apply_blocked_clips_pending
- Applied: no
- Frame signature rejections: 126
- Clip signature rejections: 42
- Default apply gate restored: yes

## Problems

- none

## Warnings

- none
