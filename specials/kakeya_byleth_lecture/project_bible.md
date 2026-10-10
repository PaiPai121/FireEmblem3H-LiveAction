# Project Bible: Byleth Teaches the 2D Needle Problem

Project ID: `KAK-BYLETH-LECTURE`
Stage: planning
Status: candidate_generated
Target: 7.5-8.5 minute educational cinematic short

## Premise

Female Byleth teaches a Garreg Mach academy lesson that begins as a tactical training puzzle: how little ground is needed to rotate a unit-length training sword through every direction? The lesson gradually reveals the mathematical history now known as the Kakeya needle problem.

The video must first feel like a Fire Emblem: Three Houses professor scene, then unfold into a precise mathematics explainer. The official name "Kakeya" is withheld until the final act, so the audience experiences the surprise before receiving the label.

## Audience

General viewers with high-school geometry and some first-year calculus exposure. They should understand the narrative without knowing measure theory, Hausdorff dimension, harmonic analysis, or PDE.

## Core Educational Promise

By the end, viewers should understand:

1. The original problem asks for the smallest-area region in which a unit needle can rotate through all directions.
2. A deltoid is a beautiful early candidate with area `pi/8`, but it is not globally minimal.
3. In convex regions, the minimum is the equilateral triangle of height 1, area `1/sqrt(3)`.
4. Besicovitch/Perron constructions show area can be made arbitrarily small by cutting direction ranges into pieces and overlapping them.
5. The modern 2D lesson is not "the needle trick" but "many-direction thin structures can overlap in extreme ways; measure and dimension are different tools."

## Canon / Adaptation Locks

- Use Female Byleth / BylethFemale / 女贝老师, not male Byleth.
- Female Byleth is a 16-year-old calm, emotionally restrained academy professor and former mercenary protagonist.
- Visual identity: teal-blue medium-length hair with clear fringe and side locks, green eyes, youthful beautiful but not doll-like face, and academy Female Byleth clothing structure: black short capelet / shoulder mantle, high black collar, cropped black upper garment with visible midriff gap, gold crest/star chest ornament, silver forearm armor, black shorts or skirt panels over patterned black tights, asymmetric knee guard, tall black boots, belts and weapon harness details.
- Avoid: male Byleth, old wizard, mature adult mentor, generic black-robed lecturer, smiling variety-show host, student-uniform extra, generic black long coat, fully closed black robe, modern leather coat, normal teacher coat, oversexualized sorceress redesign, modern classroom, modern screen UI, modern chalkboard clutter.
- Tone: grounded fantasy academy lesson, not parody.
- Setting: Garreg Mach Officers Academy classroom and training ground. Use chalk, parchment, rope, sand table, wooden practice sword, colored thread, and magical-but-subtle light overlays for diagrams.
- No game UI, no readable copyrighted game text, no modern projector.

## Mathematical Locks

- Unit needle length is 1.
- Deltoid area for the unit needle is `pi/8`; use scale `a=1/4`, not small radius `1/3`.
- Convex minimum: equilateral triangle of height 1, side length `2/sqrt(3)`, area `1/sqrt(3)`.
- Besicovitch result: for every positive epsilon, there are sets containing a unit segment in every direction with area less than epsilon; classical continuous turning uses connection ideas.
- 2D dimension result: area can be zero, but Hausdorff dimension is 2.
- Do not claim a direct engineering invention. The legitimate impact is on geometric measure theory, Kakeya maximal functions, tube overlap estimates, wave packet/PDE thinking, and combinatorial geometry.

## Visual Language

- Classroom shots: warm daylight, stone walls, wood desks, controlled compositions, Female Byleth framed as a precise young tactician.
- Training-ground shots: practice sword, rope and sand used as tactile geometry.
- Abstract math shots: parchment/chalk lines become clean animated overlays. The diagrams must remain readable and not become decorative magical effects.
- Color code:
  - Red: current needle / key unit segment.
  - Blue: candidate region or tube.
  - Gold: area being "spent."
  - Green: direction coverage preserved.

## Dramatic Spine

The audience and students begin with a wrong but reasonable belief: "all directions require a large area." Female Byleth tests that belief under changing rules. Each act removes one assumption:

1. If the region is neat and smooth, the deltoid looks plausible.
2. If the region is convex, the triangle is optimal.
3. If the region may be non-convex and fragmented, area can shrink without losing directions.
4. If area disappears, dimension still records hidden complexity.

## Reject If

- The video becomes a generic lecture with Female Byleth only as decoration.
- It claims direct real-world applications unsupported by the proof.
- It skips Perron tree logic and only states "area can be zero."
- It uses formulas without a visual object attached to each formula.
- It says area zero means the object does not exist.
- It introduces 3D Kakeya as a major topic.
