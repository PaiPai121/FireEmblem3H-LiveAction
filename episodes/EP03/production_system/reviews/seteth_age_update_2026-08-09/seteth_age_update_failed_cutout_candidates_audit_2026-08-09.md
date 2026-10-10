# Seteth Age Update Failed Candidate Audit - 2026-08-09

## Decision

Status: `rejected`

The first Seteth age-correction candidates generated on 2026-08-09 must not be used as EP03 storyboard or video-generation frames.

## Rejected Candidate Paths

- `storyboards/Shot003/seteth_age_corrected_v1_2026-08-08/start_frame_seteth_age_corrected_v1_2026-08-08.png`
- `storyboards/Shot003/seteth_age_corrected_v1_2026-08-08/key_frame_seteth_age_corrected_v1_2026-08-08.png`
- `storyboards/Shot003/seteth_age_corrected_v1_2026-08-08/end_frame_seteth_age_corrected_v1_2026-08-08.png`
- `storyboards/Shot031/seteth_age_corrected_v1_2026-08-08/start_frame_seteth_age_corrected_v1_2026-08-08.png`
- `storyboards/Shot032/seteth_age_corrected_v1_2026-08-08/start_frame_seteth_age_corrected_v1_2026-08-08.png`
- `storyboards/Shot032/seteth_age_corrected_v1_2026-08-08/key_frame_seteth_age_corrected_v1_2026-08-08.png`
- `storyboards/Shot032/seteth_age_corrected_v1_2026-08-08/end_frame_seteth_age_corrected_v1_2026-08-08.png`

## Blocking Issues

- The frames read as character cutouts composited onto a cathedral background rather than a coherent generated cinematic frame.
- Character edges, scale, depth, and lighting do not consistently belong to the environment.
- The correction over-prioritized Seteth's updated age reference while weakening the shot's natural camera, blocking, and scene integration.
- The resulting images are not usable for image-to-video because the model would likely preserve or amplify the pasted-character look.

## Required Replacement Method

Regenerate the complete frame as one integrated cinematic image. The prompt must require:

- one continuous photographic/cinematic scene;
- shared cathedral lighting, shadows, depth of field, color temperature, and lens behavior;
- natural occlusion by pews, steps, bodies, sleeves, capes, and foreground silhouettes;
- characters grounded in the same perspective plane;
- no pasted cutout edges, glow halos, floating busts, collage layout, or portrait-card composition;
- updated academy Seteth identity and age lock from `assets/characters/church_of_seiros/Seteth/academy/selected.png`.

## Promotion Decision

Do not update `video_delivery_manifest.json`, web package frame links, or package manifests to point at these candidates. They are retained only as negative evidence for the Seteth age-correction pass.

## Replacement Method Test

First acceptable-direction test candidate:

- `storyboards/Shot032/seteth_age_integrated_candidate_v2_2026-08-09/key_frame_seteth_age_integrated_candidate_v2_2026-08-09.png`

Preliminary decision: `candidate_generated`

Why it is better:

- It regenerates the full cathedral frame as one integrated scene instead of pasting Seteth over the old background.
- Seteth reads as an older academy-era Church official using the updated `selected.png` reference.
- The characters share a more consistent lens, light direction, color temperature, and depth relationship.

Remaining review requirements:

- Full-resolution visual QA before any promotion.
- Generate matching START and END frames with the same integrated method.
- Check that Rhea and Byleth identity did not drift while correcting Seteth.
- Re-run start/key/end chain audit after a complete replacement triptych exists.
