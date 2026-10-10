# Video Prompt QA Review - Hilda x Lorenz

Blocking Issues
- None.

Monitor Risks
- Downstream Seedance clip generation can still drift faces, hands, fabric trim, or mouth shapes; this is covered by the clip QA checklist and is not a prompt blocker.

Prompt Contract Check
- Episode prompt validator: passed
- Shot prompt validators: 4/4 passed
- Required sections present: Shot ID, Duration, Input Frames, Motion, Camera, Performance, Audio, Continuity Locks, Reject If.

Frame Lock Check
- Every shot prompt explicitly binds start_frame.png, key_frame.png, and end_frame.png as first frame, action/emotional peak, and final cut-out state.
- Prompts instruct the model to animate approved frames rather than redesign characters, costumes, location, or props.

Motion / Camera / Performance Check
- Motion is small, physical, and character-specific; comedy is expressed through posture, eyeline, pauses, and restrained gestures.
- Camera language stays compatible with the existing frame chain and does not ask for a new unrelated establishing shot.
- Character acting constraints preserve the requested canon temperament and avoid malicious Hilda, villain Lorenz, sinister Claude, overaged Lysithea, or broad slapstick.

Continuity / Edit Fit
- Shot durations are 15 seconds or shorter, with 4 shots per episode and 60 seconds total.
- Continuity locks preserve Garreg Mach location, academy-era uniforms, relative positions, prop state, and adjacent-shot handoff.

Negative Prompt Check
- Negative prompts ban subtitles, captions, readable text, watermarks, logos, face change, age-up, costume redesign, hair redesign, added named characters, modern objects, camera spin, gore, and new core conflict.

Required Revisions
- None.

Decision
- approved_for_video

Per-Shot Decisions

| Shot | Decision | Notes |
| --- | --- | --- |
| 001_GDSC01-SH001 | approved_for_video | no blocking issues |
| 002_GDSC01-SH002 | approved_for_video | no blocking issues |
| 003_GDSC01-SH003 | approved_for_video | no blocking issues |
| 004_GDSC01-SH004 | approved_for_video | no blocking issues |
