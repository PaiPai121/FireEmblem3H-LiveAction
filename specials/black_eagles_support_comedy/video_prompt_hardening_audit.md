# Video Prompt Hardening Audit

Audit date: 2026-07-30

## Trigger

Downstream Seedance tests showed unacceptable drift:

- Linhardt's Black Eagles academy uniform changed into a plain black robe / wrap-tunic shape.
- Caspar's expression became overly broad and meme-like.
- The rendered player view showed rounded black framing / UI-like presentation.

## Root Cause

The previous prompts passed structural prompt-contract validation, but they were not strict enough for downstream image-to-video behavior:

- Story/tone words such as `support comedy`, `theatrical`, `eager`, `hot-blooded`, and `lazy` were more salient than wardrobe locks.
- The prompts described 15-second dialogue beats, which increases identity and costume drift risk.
- The negative prompts banned generic costume drift but did not name high-probability bad substitutions such as robes, wrap tunics, training gi, pajamas, casual shirts, and simplified plain-black outfits.
- The workflow allowed direct full-duration submission instead of requiring a short identity/wardrobe probe first.

## Revisions Applied

- All 24 `prompt.md` files now use an execution-contract structure:
  - `Input Frames` identifies `start_frame.png` as the exact first frame and identity master.
  - `Priority Order` puts face, hair, age, body type, costume topology, props, and positions above motion.
  - `Identity / Wardrobe Lock` names per-character face and academy-uniform topology constraints.
  - `Expression and acting limits` forbid cartoon, meme, bug-eyed, and giant-mouth acting.
  - `Motion` is restricted to small live-action movements and explicitly forbids clothing-layer changes.
  - `Reject If` names robes, wrap tunics, casual clothes, armor, training gi, pajamas, simplified plain-black outfits, rounded frame UI, letterbox, pillarbox, and artificial side fill.
- All 24 `negative_prompt.md` files now explicitly ban:
  - robes / kimono / monk robe / martial-arts gi / wrap tunic / bathrobe / pajamas / casual shirt / armor / servant outfit / simplified plain-black outfit;
  - exaggerated comedy face / bug eyes / giant open mouth / meme grin / cartoon smile / anime reaction expression / clownish acting;
  - rounded video corners / black rounded container / playback controls / letterbox / pillarbox / picture-in-picture / artificial canvas padding.
- Every package now includes `motion_probe_queue.csv` for 3-second identity and wardrobe probes before full-duration generation.
- Every `model_target_profile.md`, `RUNBOOK.md`, `clip_qa_checklist.md`, `metadata.json`, and `package_manifest.json` records that full generation requires probe approval first.
- Motion QA decisions in the production review manifest are now `monitor_required` instead of treating prompt-contract pass as downstream video approval.

## Recommended Seedance Workflow

1. Submit each row in `motion_probe_queue.csv` first at 3 seconds.
2. Review only for hard continuity gates:
   - same face and academy-era age;
   - exact academy uniform topology, including collar, trim, cape/mantle, insignia, cuffs, straps, buttons, and props;
   - no robes, casual clothes, armor, or plain-black simplification;
   - no cartoon/meme expression;
   - no rounded black player frame, UI, letterbox, pillarbox, or artificial side fill.
3. If the probe passes, submit the same shot from `submission_queue.csv`.
4. If full-duration generation still drifts, split the shot into 3-5 second microclips and use the previous accepted clip end as the next start reference.
5. If a shot fails repeatedly, regenerate controlled start/key/end frames or use a model path with stronger character/reference locking. Do not keep resubmitting the same 15-second prompt.

## Decision

Status: `monitor_required`

The hardened prompts are suitable for controlled Seedance testing, not blind full-duration batch generation. The known failure mode is now documented and guarded, but model-side reference control remains the deciding factor.
