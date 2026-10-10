# Production Notes

## Current Stage

Humanized script and shot-list package in progress. Not approved for video generation yet.

## Directory Boundary

This special is isolated from the main EP02 storyboards:

```text
specials/behind_the_scenes_mock_battle/
```

Do not overwrite or move existing EP02 main-story assets.

## Asset Reuse Plan

Use existing academy/professor character assets as identity references:

- `assets/characters/cameos/Nian/director/selected.png`
- `assets/characters/protagonist/Byleth/professor/selected.png`
- `assets/characters/black_eagles/Edelgard/academy/selected.png`
- `assets/characters/blue_lions/Dimitri/academy/selected.png`
- `assets/characters/golden_deer/Claude/academy/selected.png`

Nian is the special's throughline director. She appears only in the meta production layer and should not be treated as a Fire Emblem in-world combat participant.

Use existing EP02 locations and props as base references:

- `assets/locations/EP02/act01/DiningHall/DiningHall_reference.png`
- `assets/locations/EP02/act01/TrainingGround/TrainingGround_reference.png`
- `assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png`
- `assets/props/EP02/training_weapons/training_weapons_reference.png`

New/set dressing assets likely needed:

- Director monitor station / video village for Nian.
- Light stands and controlled film crew silhouettes.
- Set-edge lunch/rest dressing: folding chairs, lunch boxes, cups, slate as prop, training weapons nearby.
- Ground tape marks and safe wooden/padded training weapon variants.

## Video Model Friendliness

The current design uses 7 long shots rather than many quick cuts. This should reduce edit complexity, but each long shot still needs start/key/end frames because the shots contain small actor reactions, reset marks, or a visible improvement from prior take.

## Main Risks

- Group-shot identity drift.
- Claude becoming too modern or comedic.
- Byleth becoming too expressive or talkative.
- Dimitri's NG becoming humiliating instead of earnest.
- Edelgard's control turning into coldness rather than dry restraint.
- Modern film equipment overwhelming the Garreg Mach fantasy setting.
- Nian becoming a canon crossover combat participant instead of the meta director.
- Nian appearing as a one-off cameo rather than a throughline production figure.
- Food and hands drifting in lunch shot.
- Cape and weapon physics drifting in rehearsal shot.
- The script becoming an AI-error explanation instead of a real set blooper.
- Monitor content being treated as a malfunction; it must stay normal playback.
- Staff/extras taking explanatory dialogue away from Nian and the four actors.

## QA Requirements Before Frame Generation

- Story review: confirm the special does not damage main project tone.
- Canon/fidelity review: confirm actor-behind-character behavior still respects character essence.
- Direction review: confirm each long shot has a clear event and end state.
- Storyboard review: require start/key/end frame intents for all 7 shots.
- Video prompt QA: each prompt must lock frame chain and prevent redesign.

## Next Work Items

1. Run story/direction review against these docs.
2. Create or update start/key/end frame specs for all 7 shots under the humanized V3 structure.
3. Generate V3 start/key/end frames into `storyboards_human_set_v3/`.
4. Revise video prompts to use V3 frames and the humanized dialogue/audio layer.
5. Run visual QA, prompt QA, strict continuity, and build the delivery package only after all gates pass.

## Dialogue / Audio Layer

Use `dialogue_audio_beats.md` as the set-audio guide. Dialogue should stay sparse and captured, with warm short laughs. Byleth speaks very little; when he does, it should land through restraint.

## Humanized Blooper Locks

- Do not say or imply that an AI model, monitor, or camera is malfunctioning.
- Treat every issue as a real set behavior: over-marking, over-careful rhythm, reflective wood finish, cape snag, actor self-consciousness, or director notes.
- Crew may appear visually but should not explain the scene in dialogue.
- Nian's first line is a global cut for the whole take, not a targeted insult.
