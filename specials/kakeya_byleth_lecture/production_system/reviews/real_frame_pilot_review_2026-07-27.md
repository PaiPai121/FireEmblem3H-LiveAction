# Real Frame Pilot Review

Project ID: `KAK-BYLETH-LECTURE`
Review Date: 2026-07-27
Updated: 2026-07-28
Decision: `monitor_required`

## Integrity / Gate Blockers

No file blockers for the pilot set. Sixty-six delivery-counted real frame outputs exist under `real_frames/`. SH023 also keeps one non-delivery `end_base.png` for auditability of the local chalk-text overlay. SH006-SH009, SH011-SH015, and SH025-SH029 also keep non-delivery generated base frames under `real_frames/_bases/` for auditability of the deterministic math overlays.

## Visual Audit Coverage

Reviewed the current pilot sequence:

- SH006 start/key/end
- SH007 start/key/end
- SH008 start/key/end
- SH009 start/key/end
- SH011 start/key/end
- SH012 start/key/end
- SH013 start/key/end
- SH014 start/key/end
- SH015 start/key/end
- SH016 start/key/end
- SH017 start/key/end
- SH018 start/key/end
- SH019 start/key/end
- SH020 start/key/end
- SH021 start/key/end
- SH022 start/key/end
- SH023 start/key/end
- SH025 start/key/end
- SH026 start/key/end
- SH027 start/key/end
- SH028 start/key/end
- SH029 start/key/end

## Blocking Issues

The full project remains blocked from `video_generation_package`: only 66 of 102 required real frames exist.

## Existing Material Findings

SH016 start/key/end form a plausible real-shot Perron setup sequence. Female Byleth identity is much stronger than the earlier layout boards, and the sand-table direction fan is readable.

SH017 start/key/end form a usable cut-step candidate set: common apex, base subdivision, and direction lines are visible across the shot.

SH018 start/key/end form a usable slide-step candidate set: horizontal translation arrows and parallel lines communicate the intended proof step.

SH019 start/key/end have cinematic quality but need stricter math QA: some pieces may read as a dramatic pile rather than pure translated overlap. Keep the shot as `needs_math_visual_qa`, not approved.

SH006 start/key/end introduce the deltoid candidate on a generated Female Byleth chalkboard base with deterministic curve overlays. Female Byleth continuity is strong. Math QA should check that the three-cusp shape is legible and that the shot does not imply final optimality.

SH007 start/key/end supersede the earlier single-key pilot. The red chord is now contained within the blue deltoid region in the key frame after corrective rerendering. Math QA must still confirm tangent-mechanism readability and cusp geometry.

SH008 start/key/end are clean scale-lock parchment frames with deterministic text and tick overlays. Four equal segments, `4a = 1`, and `a = 1/4` are readable.

SH009 start/key/end give the deltoid area and candidate status. The formula was moved away from the cusp after corrective rerendering, and the red chord now stays inside the region. Keep it as `needs_math_visual_qa` until area and candidate framing are reviewed.

SH011 start/key/end use a generated training-floor base and deterministic overlays to show a concave rope boundary becoming a convex hull and then an equilateral triangle outline. QA should check that the rope-pull metaphor reads as a constraint switch, not as a new proof claim.

SH012 start/key/end provide a simple convex definition check: left line stays inside, right line leaves the concave region. This is visually elementary but clear.

SH013 start/key/end show the convex-restricted equilateral triangle with height `1` and direction ghosts. QA should check that the convex-only qualifier is not missed.

SH014 start/key/end show the side length and area computation on parchment. `s = 2 / sqrt(3)` and `A = 1 / sqrt(3)` are readable.

SH015 start/key/end compare convex hull filling gaps against separated nonconvex pieces. QA should check whether the left convex hull is too rectangular and whether the right-side transition into Perron still feels connected.

SH020 start/key/end form a usable bridge from the overlap construction to the direction audit. Female Byleth continuity is strong; QA should check that the ruler action reads as pointing to the direction band rather than the area outline.

SH021 start/key/end are clean direction-audit diagrams. The end frame reads strongest; the key frame should be checked for whether segmented interval boundaries look like harmless cuts or actual missing gaps.

SH022 start/key/end communicate the iteration acceleration well: three stages shrink while the green direction ruler stays full. Math QA should still check that triangle pieces do not imply arbitrary rotation.

SH023 start/key/end provide the classical conclusion with Female Byleth and blackboard. The end frame uses a deterministic local chalk-text overlay to avoid generated-text errors.

SH025 start/key/end introduce the delta-tube method cleanly: the red unit segment, blue tube, and delta width bracket are legible.

SH026 start/key/end show the intended two-case comparison. The left small-alpha overlap is visibly longer than the right large-alpha overlap. The shot uses `alpha` text rather than a Greek alpha glyph to avoid public-reader confusion with parameter `a`.

SH027 start/key/end connect the overlap picture to the estimate. The formula was corrected to `overlap <= C delta^2 / alpha` after visual review found the Greek alpha glyph could be misread as `a` and the first formula placement risked edge cropping.

SH028 start/key/end give a grid-refinement intuition. QA should check that the set remains present across scale changes and is not read as vanishing.

SH029 start/key/end state the two-dimensional theorem with Female Byleth on the side and deterministic board text: `area may be 0` and `dimension = 2`.

## Character / Canon Issues

Female Byleth remains young, teal-haired, green-eyed, and in a black professor/mercenary coat in the visible Byleth frames. No male Byleth drift is visible in the pilot set.

## Required Revisions

- Regenerate or refine SH019 if math QA finds the overlap construction too ambiguous.
- Regenerate or refine SH021 key if segmented direction intervals read as gaps rather than full coverage.
- Regenerate or refine SH022 if math QA reads the triangle fragments as rotated rather than translated/cut.
- Regenerate or refine SH006-SH009 if math QA asks for a more conventional deltoid orientation or stricter tangent-chord construction.
- Regenerate or refine SH027 if the estimate should use a more formal Greek-letter font rather than public-facing `alpha`.
- Regenerate or refine SH011/SH015 if the convex hull comparison reads too abstract or too rectangular.
- Continue with SH001-SH005 hook, SH010/SH024 bridge shots, and SH030-SH034 impact/reveal.

## Decision

`monitor_required`: real-frame generation is now genuinely underway, but the package is not video-ready.
