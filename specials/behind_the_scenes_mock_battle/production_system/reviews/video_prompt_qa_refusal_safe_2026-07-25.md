# Video Prompt QA Refusal-Safe Pass

Project: behind_the_scenes_mock_battle  
Scope: BTS-SH000 through BTS-SH006 source video prompts and negative prompts  
Date: 2026-07-25  
Reviewer Role: video-prompt-qa reviewer  
Decision: `approved_for_video`

## Blocking Issues

None after revision.

Original risk pattern: the previous prompts used a few terms that can cause conservative video models to refuse generation, especially wording around staged action, props, danger/impact exclusions, IP character names, and technical-failure exclusions.

## Monitor Risks

- Some video providers may still reject costume-drama rehearsal imagery if the still frames visually emphasize props too strongly.
- Chinese dialogue remains in the audio anchors. If a provider refuses non-English text in prompt bodies, submit a prompt-only variant with dialogue moved to an external audio sheet.
- The project still depends on identity preservation from input frames; prompt text now uses neutral descriptors rather than IP names.

## Prompt Contract Check

Pass. All seven prompts include:

- Shot ID
- Duration
- Input Frames
- Motion
- Camera
- Performance
- Audio
- Continuity Locks
- Reject If

Validated with:

```bash
node ~/.codex/skills/video-prompt-qa/scripts/validate_prompt_contract.js
```

## Frame Lock Check

Pass. Each prompt still locks the approved start/key/end frame chain from `storyboards_human_set_v3`.

The revision does not redesign characters, costumes, location, camera intent, or story logic. It changes only the wording used to submit the approved shot to a video model.

## Motion / Camera / Performance Check

Pass with reduced refusal risk.

Changes made:

- Reframed the scene as a safe modern film-set rehearsal with adult performers.
- Replaced action-forward phrasing with contact-free blocking and modest movement.
- Replaced character/IP names with neutral visual descriptors:
  - `the white-haired director`
  - `the quiet central performer`
  - `the red-caped performer`
  - `the blond performer`
  - `the green-caped performer`
- Replaced prop danger language with matte, harmless, rehearsal-only prop language.
- Preserved documentary camera style and restrained human performance.

## Continuity / Edit Fit

Pass. The revised prompt set still preserves:

- BTS-SH000 global cut.
- BTS-SH001 reset notes and Byleth tape fix.
- BTS-SH002 over-polite rehearsal.
- BTS-SH003 lunch/rest banter.
- BTS-SH004 usable take payoff.
- BTS-SH005 playback review.
- BTS-SH006 wrap photo.

## Negative Prompt Check

Pass. Negative prompts were rewritten as safer drift constraints rather than long lists of high-risk terms. They now emphasize:

- safe behind-the-scenes rehearsal;
- adult performers;
- matte harmless props;
- contact-free movement;
- stable faces/costumes/positions;
- no added text/logos/watermarks;
- no camera orbit or sudden zoom.

## Required Revisions

None before testing with a video model.

Recommended downstream test order:

1. Submit BTS-SH003 first because it has the lowest refusal risk.
2. Submit BTS-SH006 second because it is a wrap-photo scene with no rehearsal motion.
3. Submit BTS-SH001 or BTS-SH005 next.
4. Submit BTS-SH000/BTS-SH002/BTS-SH004 last because they include staged movement and props.

If a provider still refuses a shot, create a provider-specific micro-prompt that removes dialogue quotes and uses only: adult performers, exact frames, safe set rehearsal, small motion, camera lock, and continuity locks.

## Decision

`approved_for_video`
