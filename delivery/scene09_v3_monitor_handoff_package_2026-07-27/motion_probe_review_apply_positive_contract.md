# Scene09 V3 Motion Probe Review Apply Positive Contract

Date: 2026-08-01
Decision: motion_probe_review_apply_positive_contract_passed

This audit runs the real probe review apply gate against temporary 3-second probe clips and extracted review frames. It proves the gate has a positive path when 42/42 probe clips, signed probe clip SHA-256 evidence, signed start/mid/end review-frame evidence, Codex reviewer identity, reviewer notes, and all required pass checks are present. It does not write production probe clips or production full-duration release.

## Positive Path

- Expected probe clips: 42
- Apply decision: motion_probe_review_apply_passed
- Release written in temp package: yes
- Passed rows: 42
- Probe signature matched rows: 42
- Review-frame signature matched rows: 42
- Review evidence complete rows: 42
- Required checks complete rows: 42

## Negative Cases

- stale_probe_clip_signature_rejected: rejected (motion_probe_review_apply_blocked_invalid_proposal)
- stale_review_frame_signature_rejected: rejected (motion_probe_review_apply_blocked_invalid_proposal)
- user_reviewer_rejected: rejected (motion_probe_review_apply_blocked_invalid_proposal)
- approval_without_pass_rejected: rejected (motion_probe_review_apply_blocked_invalid_proposal)

## Production Safety

- Production full-duration probe release exists: no
- Production playable probe clips: 0

## Problems

- none
