# EP03 Local Asset Identity Rebuild Plan

Status: active corrective plan  
Decision: current imagegen frame-set candidates are blocked from asset-package use until local selected.png identity is proven.

## Problem

The current EP03 imagegen candidates preserve broad Fire Emblem role cues, costume colors, and battlefield mood, but they do not reliably preserve the exact local character assets in `assets/characters/**/selected.png`.

This violates the EP03 asset-package requirement. A frame that looks like "a silver-haired archer" is not sufficient for Ashe. A frame that looks like "a dark-haired swordsman" is not sufficient for Felix. The local selected asset is the identity contract.

## New Gate

Before any regenerated frame can replace the blocked candidates:

1. The shot folder must contain start/key/end candidates using a new identity-locked suffix, not the blocked `imagegen_candidate_2026-07-29` suffix.
2. A comparison sheet must show every visible named character's local `selected.png` beside the generated start/key/end frame.
3. The reviewer must explicitly pass face, age read, hairstyle, costume topology, weapon/prop continuity, and shot-specific action readability.
4. Passing composition alone is not enough.
5. Prompt-only requests to "preserve exact identity" are not enough unless the comparison sheet proves the result.

## Rebuild Method

For each shot:

1. Use local `selected.png` assets as primary identity references.
2. Use source game frames only as layout/story references, never as identity references.
3. Prefer one named character per generation pass for close-ups and emotional beats.
4. For group shots, build character-specific identity plates first, then assemble or regenerate the full frame only after the plates pass.
5. Keep current blocked candidates as composition studies only.

## Shot017 Probe Result

`storyboards/Shot017/start_frame_identity_probe_2026-07-31.png` was generated as a stricter prompt-only identity test.

Decision: rejected.

Reason: composition and wardrobe improved, but Ashe and Byleth still do not prove exact local `selected.png` face identity. This confirms that prompt strengthening alone is not a reliable rebuild method.

## Current Package Truth

- Highest completed target: `prompt_asset_package`.
- Video generation package: blocked.
- Shot001-Shot019: `blocked_needs_revision` due local asset identity lock failure or unproven identity.
- Shot020-Shot036: `visual_blocked` because only rough/layout frames exist.
- No EP03 shot is `approved_for_video`.
