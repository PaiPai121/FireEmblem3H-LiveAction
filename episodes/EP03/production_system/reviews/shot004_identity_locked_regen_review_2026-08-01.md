# Shot004 Identity-Locked Regeneration Review

Reviewer role: asset-identity-qa-agent
Reviewer: codex
Created: 2026-08-01
Decision: blocked_needs_revision

## Reviewed Frame Set

- Start: `delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/start_frame_identity_locked_regen_2026-08-01.png`
- Key: `delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/key_frame_identity_locked_regen_2026-08-01.png`
- End: `delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/end_frame_identity_locked_regen_2026-08-01.png`
- Review sheet: `production_system/reviews/shot004_identity_locked_regen_review_2026-08-01.jpg`

## Blocking Issues

- Ashe's wardrobe topology, bow, and restrained performance are materially improved, but the face/age read is still not strict enough against the local Ashe selected.png identity plate.
- Byleth remains background-readable only; the face and hair silhouette are not strong enough to prove exact preservation of the local professor selected.png.
- Start and key frames are visually close to each other; the emotional transition is usable as a guide, but still needs clearer start/key differentiation before final video anchoring.
- This frame set cannot replace the existing local previs or enter an approved video_generation_package.

## Useful Progress

- The prompt order now correctly prioritizes local identity plates before mood, camera, and performance.
- The three generated frames keep a coherent cathedral setup, character placement, Ashe bow continuity, and restrained tragic tone.
- The set is useful as a tighter reference for the next regeneration pass.

## Required Revision

- Regenerate Shot004 with a stricter Ashe face match and younger academy read, using the local Ashe identity plate as the dominant reference.
- Reduce Byleth/Dimitri background ambiguity or stage them farther back so they do not require close identity proof.
- Create more distinct start/key/end emotional beats while preserving the same axis, wardrobe, bow, and cathedral layout.

## Status

`blocked_needs_revision`; not approved for video.
