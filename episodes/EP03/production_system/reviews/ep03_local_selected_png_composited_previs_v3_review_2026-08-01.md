# EP03 Local Selected.png Composited Previs V3 Review / 2026-08-01

Reviewer role: pipeline-gate-qa-agent
Decision: layout_reference

## Coverage

- Shots covered: 36/36
- Frame files covered: 108/108
- Missing frame files: 0
- Contact sheet: `generated_storyboard_contact_sheet.jpg`
- Generator: `scripts/generate_ep03_composited_storyboard_frames.py`

## Finding

V3 improves the previous local selected.png proof layer by strengthening the actor matte, reducing foreground fog opacity, preserving up to six named characters in group shots, and choosing a more accurate local fallback location for monastery/classroom/cathedral/village/fog beats. Shot007 now uses a monastery cloister background and includes Byleth, Dimitri, Dedue, Felix, Ashe, and Ingrid from local assets.

This is still a deterministic proof/previs layer. It preserves local asset identity better than free image generation, but the frames retain visible compositing and matte limitations. Use it for script-to-shot coverage, identity proof, blocking, web review, and prompt refinement. Do not promote to `visual_review_passed` or `approved_for_video` without shot-level cinematic cleanup and independent QA.

## Required Revision

For final keyframes, create per-shot cleaned frames from the V3 proof layer using transparent cutouts/manual roto or a constrained cleanup pass, then run visual QA, prompt-against-frame QA, motion probe, and strict continuity before any video package promotion.
