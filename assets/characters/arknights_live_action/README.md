# Arknights Live-Action Character Assets

This folder stores live-action character translations for Arknights-inspired cameo or crossover appearances.

## Asset Panel

Open `index.html` in this folder to review the current six-star asset ledger.

Current QA snapshot is in `ASSET_QA_SUMMARY.md`.

Regenerate the panel after adding references, candidates, or reviews:

```bash
node assets/characters/arknights_live_action/tools/build_asset_viewer.js
```

Current status rules:

- `selected`: `selected.png` exists and is the only production-ready still reference.
- `candidate`: generated material exists, but it is not approved for downstream packages.
- `rejected`: do not use except as a negative reference.
- `needs_reference`: no approved operator reference exists; generation is blocked.

## Purpose

Keep Arknights live-action assets separate from Fire Emblem character assets so each operator can have:

- official/user reference images;
- live-action identity locks;
- generated candidates;
- review notes;
- selected production reference;
- downstream storyboard/video prompt usage notes.

## Realism Rule

"More realistic" must not mean older, uglier, harsher, grittier, or generic.

For stylized operators, preserve the character's appeal first:

- recognizable face/age impression;
- charm, cuteness, beauty, coolness, or menace as appropriate;
- signature hair, silhouette, palette, accessories, and expression;
- role-specific production adaptation.

Then reduce AI artifacts through:

- natural skin texture;
- believable hair strands;
- real cloth seams and wrinkles;
- grounded lighting;
- practical props;
- non-plastic materials.

## Suggested Character Folder

```text
CharacterName/
  references/
    official_or_user_reference.png
  candidates_v1/
    prompt.md
    notes.md
    candidate_01.png
  selected.png
  identity_locks.md
  usage_notes.md
```

Do not overwrite `selected.png` until a candidate has been reviewed and approved.

## Reference Gate

Do not generate a named operator from memory, popularity, vibes, or broad trait prompts. Add approved visual references to `references/` first, then rewrite identity locks from those references before generation.
