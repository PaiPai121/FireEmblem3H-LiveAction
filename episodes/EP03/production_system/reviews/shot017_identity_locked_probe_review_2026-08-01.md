# Shot017 Identity-Locked Key Probe Review

Created: 2026-08-01
Reviewer role: asset-identity-qa-agent
Decision: blocked_needs_revision

## Reviewed Paths

- `storyboards/Shot017/key_frame_identity_locked_probe_2026-08-01.png`
- `production_system/reviews/shot017_identity_locked_probe_2026-08-01.jpg`
- `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot017_local_asset_previs_proof_2026-07-31.jpg`
- `assets/characters/blue_lions/Ashe/academy/selected.png`
- `assets/characters/protagonist/Byleth/professor/selected.png`

## Finding

The probe improves the battlefield composition, shield placement, fog integration, and the story beat of Ashe hesitating at the Gaspard crest. It is a useful composition probe.

It still fails the local selected.png identity gate. Ashe reads as a new actor rather than a proven match to the local Ashe asset, and Byleth's face/hair silhouette also drifts from the local professor reference. Because identity is the user's core concern and a P0 pipeline gate, this probe cannot replace `key_frame.png`, cannot be promoted to visual_review_passed, and cannot enter the video_generation_package.

## Required Revision

Regenerate with stricter identity preservation before any promotion. The next attempt should use character-specific identity plates or a more controlled local compositing/masking workflow before full cinematic integration.
