# Video Prompt QA

Date: 2026-07-25
Updated: 2026-07-25 dialogue-track revision

## Blocking Issues

None for image-to-video generation.

Correction: the downstream tool is expected to generate full video with audio/dialogue, so the earlier prompt package was incomplete because the prompts only contained audio anchors and did not include executable dialogue lines.

The revised prompts now include `Dialogue / Vocal Lines` sections and no subtitle intent sections. SH001 uses a complete adapted English food song for generation; spoken dialogue remains Japanese.

## Monitor Risks

- BLFS-SH001: keep song/footwork private, in tune, and small-mouthed; avoid musical-stage animation.
- BLFS-SH002: hold the reveal; do not invent extra action.
- BLFS-SH003: keep water spill tiny.
- BLFS-SH004: keep Felix sincere and unsmiling.
- BLFS-SH005: keep Felix's plant-singing deadpan dry and unsmiling; no humming reprise.
- All shots: full-video generation may drift faces during lip-sync or longer motion; identity lock and face-drift reject rules have been strengthened.

## Prompt Contract Check

All five revised prompt files passed `validate_prompt_contract.js`.

Weak signal:

- BLFS-SH002 contains general style language but still has concrete motion, camera, performance, continuity locks, and reject criteria.

## Frame Lock Check

Pass. Each prompt explicitly names start/key/end frame usage and animates the approved frame chain. Revised prompts also require preserving the face from the input frames as a hard identity reference.

## Motion / Camera / Performance Check

Pass. Motion is small and character-driven. Camera instructions preserve the approved shot size and do not request redesigns. The revised prompts also include concrete spoken/sung lines for complete video generation.

## Continuity / Edit Fit

Pass. The prompts preserve screen-left doorway logic, Annette's watering can, Felix's entry/exit direction, and the emotional handoff from private song to reveal to blunt kindness.

## Negative Prompt Check

Pass. Negative prompts ban the concrete drift risks: face drift, recasting, lip-sync mouth distortion, added characters, text/subtitles, costume drift, romance overstatement, broad Felix smile, water escalation, and musical over-performance.

## Required Revisions

None before generation. Replace SH001's adapted song only if the user provides an exact source lyric and wants exact source-lyric fidelity.

## Decision

`approved_for_video`
