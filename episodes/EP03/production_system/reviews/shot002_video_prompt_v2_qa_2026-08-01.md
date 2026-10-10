# Shot002 Video Prompt V2 QA

Reviewer role: video-prompt-qa-agent
Reviewer: codex
Created: 2026-08-01
Decision: monitor_required

## Blocking Issues

- No final generated clip exists yet, so motion preservation, frame interpolation, and identity stability through time cannot be verified.
- Adjacent-shot continuity cannot be approved until Shot001 and Shot003 have revised frame sets or approved source handoffs.

## Monitor Risks

- Even with wide framing, image-to-video may still brighten, simplify, or redesign Byleth's black professor outfit.
- The model may add named-looking students or clergy in the background unless the negative prompt is obeyed.
- A 10-second duration may invite extra camera drift or a push-in that would weaken the silhouette identity lock.

## Prompt Contract Check

- Structural contract: pass. `validate_prompt_contract.js` found all required sections and no weak signals.
- Required sections present: Shot ID, Duration, Input Frames, Motion, Camera, Performance, Audio, Continuity Locks, Reject If.
- The prompt is executable as a short motion probe contract.

## Frame Lock Check

- Pass for start/key/end references. The v2 prompt explicitly names the three v2 frames and tells the model to animate between them only.
- Pass for identity strategy. Byleth is locked as the only named character and identity is carried by local hair silhouette, slim build, black layered professor outfit, and cloak topology.

## Motion / Camera / Performance Check

- Pass for restrained motion: measured step, slow, pause, turn toward council/cathedral direction.
- Pass for camera guardrails: wide establishing shot, high steady angle, no close-up, no axis rotation.
- Monitor risk remains for 10-second clip drift; first downstream test should be a 3-second motion probe before full duration.

## Continuity / Edit Fit

- Pass for internal Shot002 chain: entering, pausing, turning.
- Monitor required for external continuity because Shot001 and Shot003 are not yet approved regenerated frame sets.

## Negative Prompt Check

- Pass. The v2 negative prompt bans subtitles, UI, visible text, player frame, face/hair/costume drift, named-character additions, camera spin, axis reversal, and unwanted story beats.

## Required Revisions

- Generate a 3-second motion probe from the v2 frame set before attempting the full 10-second clip.
- Review the probe for Byleth silhouette, black professor wardrobe topology, corridor axis, no added named characters, no UI/text, and no camera push-in.
- Keep Shot002 at `visual_review_passed` / `monitor_required`; do not promote to `approved_for_video` until probe QA and adjacent continuity pass.
