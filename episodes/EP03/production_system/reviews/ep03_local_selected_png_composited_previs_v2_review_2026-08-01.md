# EP03 Local Selected.png Composited Previs V2 Review / 2026-08-01

Reviewer role: pipeline-gate-qa-agent
Decision: layout_reference

## Coverage

- Shots covered: 36/36
- Frame files covered: 108/108
- Missing frame files: 0
- Contact sheet: `generated_storyboard_contact_sheet.jpg`
- Generator: `scripts/generate_ep03_composited_storyboard_frames.py`

## Finding

V2 uses local `selected.png` character assets deterministically, so it corrects the prior failure where generated images only looked generally like Fire Emblem characters. The visible characters now come from the project asset library rather than from free AI reinterpretation.

The frame set is still a previs/proof layer. The character assets are source images with baked-in backgrounds, and the deterministic matte is not a final cinematic roto. Some weapons, hair edges, and feet are approximate. Therefore V2 may be used for local identity proof, blocking, shot order, prompt review, and web presentation, but it must not be promoted to `visual_review_passed` or `approved_for_video` without a later cinematic cleanup/QA pass.

## Required Revision

Build final per-shot keyframes from the V2 local-selected composite layer using either real transparent cutouts, manual roto, or a strictly constrained image-to-image pass that preserves the local selected.png face, age, hair, body, costume topology, and named-role identity.
