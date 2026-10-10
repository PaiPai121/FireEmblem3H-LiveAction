# Production Notes and Asset Plan

Project ID: `KAK-BYLETH-LECTURE`
Stage: planning
Status: candidate_generated

## Existing Asset References

- Female Byleth identity: `assets/characters/protagonist/BylethFemale/profile.md`
- Female Byleth professor selected image: `assets/characters/protagonist/BylethFemale/professor/selected.png`
- Female Byleth professor prompt lock: `assets/characters/protagonist/BylethFemale/professor/regeneration_prompt.md`
- Female Byleth fidelity review: `assets/characters/protagonist/BylethFemale/fidelity_review.md`
- Officers Academy classroom: `assets/locations/EP02/act01/OfficersAcademyClassroom_TeacherPOV/prompt.md`
- Existing Kakeya explainer diagrams: `docs/kakeya_figures/*.svg`
- Existing explainer text: `docs/kakeya_2d_history_with_proofs.md`

## New Asset Needs

1. Garreg Mach classroom lecture angle with Female Byleth at chalkboard.
2. Garreg Mach training ground clean overhead plate.
3. Wooden unit practice sword / short training blade prop.
4. Rope and chalk boundary props for circle, deltoid, and triangle.
5. Sand table or parchment board for Perron tree manipulation.
6. Clean animated geometry overlays based on existing SVG figures.

## Character Continuity

Use `BylethFemale` / 女贝老师 for this short. Do not use male `Byleth` references in shot prompts or visual frames. Do not mix `Byleth` and `BylethFemale` continuity in this short.

## Student Use

Student roster is locked to one representative per house:

- Black Eagles: 艾黛尔 / Edelgard.
- Golden Deer: 莉丝缇亚 / Lysithea.
- Blue Lions: 梅尔赛德斯 / Mercedes.

Use visible students on interaction beats such as SH002, SH010, SH020, and SH032. Keep pure proof-diagram shots clean when readability matters. Do not replace these students with off-roster students or generic silhouettes.

## Mathematical Graphic Requirements

- Every formula must be tied to a visible diagram.
- The deltoid sequence must show tangent chord length `4a`, then set `a=1/4`.
- The convex triangle sequence must show height 1 and area `1/sqrt(3)`.
- Perron tree sequence must show cut, slide, overlap, repeat as separate visible operations.
- Tube sequence must show two widths `delta`, angle `alpha`, and overlap region.

## Risk Register

- P0: Overclaiming direct real-world applications.
- P0: Losing proof connection in the "meaning" section.
- P1: Too many named students increases asset burden.
- P1: Mathematical symbols may become unreadable in video if too small.
- P1: Female Byleth identity may drift toward generic black-robed sorceress, ordinary student, or mature adult mentor.

## Recommended Delivery Strategy

Create the final video from a mix of:

1. Character lecture shots with Female Byleth.
2. Hands/props shots where identity burden is low.
3. Diagram-only animated shots built from SVG geometry.
4. Minimal student reaction shots for pacing.

This reduces reliance on continuous face generation while preserving the Fire Emblem framing.
