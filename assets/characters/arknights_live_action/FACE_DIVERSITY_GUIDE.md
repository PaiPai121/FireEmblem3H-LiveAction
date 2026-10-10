# Arknights Live-Action Face Diversity Guide

Use this guide for every Arknights live-action character candidate.

## Core Rule

Do not let different operators become the same AI-pretty face with different hair, horns, ears, or clothing.

Each character needs a distinct human face design:

- different face shape;
- different eye shape and spacing;
- different nose bridge/tip/nostril read;
- different lips and smile habit;
- different cheekbone and jaw softness;
- different age/read;
- different expression rhythm;
- different makeup intensity;
- different posture and camera relationship.

## Preserve Appeal Without Sameface

"Beautiful" does not mean identical.

For every character, define what kind of beauty they have:

- cute and mischievous;
- cold and elegant;
- sharp and dangerous;
- gentle and intelligent;
- tired but magnetic;
- sunny and athletic;
- refined and distant;
- mature and composed.

Then build face direction from that character, not from a default AI beauty template.

## Anti-AI Face Checks

Fail or reroll a candidate if it has:

- porcelain-smooth skin with no believable texture;
- huge anime eyes transferred into a photo face;
- perfectly symmetrical face;
- identical nose/lips/eye spacing to another candidate;
- influencer filter face;
- plastic cosplay wig;
- glossy costume material that looks synthetic in every surface;
- blank idol smile instead of character-specific expression;
- over-sharpened eyelashes and unreal catchlights;
- age drift away from the character brief.

## Per-Character Face Lock Template

Before generation, write a short face lock:

```text
Character:
Age/read:
Beauty type:
Face shape:
Eyes:
Nose:
Mouth/smile:
Skin/makeup:
Expression habit:
Posture/camera relationship:
Must not resemble:
AI risks:
```

## Generation Protocol

For each operator:

1. Save official/user references in `references/`.
2. Write `identity_locks.md`, including the face lock above.
3. Generate 1-2 candidates only.
4. Review for identity, beauty type, realism, and sameface risk.
5. Do not promote to `selected.png` until the user approves.

## Reference Gate

Do not generate a named operator candidate from memory, popularity, vibes, or a text-only generic description.

A candidate may be generated only after at least one approved visual reference exists in that operator's `references/` folder, or the user explicitly supplies a reference image in chat for that operator.

Fail the attempt as `blocked_needs_reference` when:

- no official/user reference image is available;
- the prompt does not name the source reference path;
- the prompt only describes broad traits such as "white hair", "black coat", "dangerous", or "cute";
- the candidate could be mistaken for a generic original character.

No candidate can be called an asset until it passes:

- reference identity match;
- distinct face review;
- AI artifact review;
- costume/silhouette review;
- role/use-case review.

## Cross-Character Review

When two or more operators exist, compare them side by side before approval:

- silhouette;
- face shape;
- eye shape;
- expression;
- age/read;
- makeup;
- wardrobe material;
- pose language.

If two candidates look like the same model styled differently, at least one must be revised.
