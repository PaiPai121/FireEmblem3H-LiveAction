# EP02 Scene09 V2 Partial Rebuild Audit

Date: 2026-07-22

Scope: second-chapter mock battle / EP02 Scene09, focused on the 2026-07-21 V2 partial rebuild in `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/`, with prior current start/key frames and V2 source files used as context.

## Decision

`blocked_needs_revision`

The V2 script and shot list remain the right source of truth. The 2026-07-21 partial rebuild improves the objective chain and stand-down ending, but it is not a complete storyboard package and must not be promoted to video. Treat the new generated pairs as `monitor_required` motion-test candidates only.

## Integrity / Gate Blockers

1. `production_system` manifest validation passes structurally, but storyboard gate still fails for existing Scene09 storyboard artifacts.
2. The V2 rebuild QA manifest expects 40 shots. Only 17 are generated/reviewed; 23 remain `blocked_needs_generation`.
3. Every generated/reviewed V2 rebuild pair is `monitor_required`; none is `visual_review_passed` or `approved_for_video`.
4. `production_system/continuity_manifest.json` has 0 adjacent-shot continuity pairs, so strict continuity cannot prove the 40-shot cut.
5. The old current raster set remains a 36-shot layout reference, not V2-final coverage.
6. The generated V2 folder contains duplicate numbered candidates for `Shot033B`, `Shot033C`, and `Shot033D` outside the QA-selected paths. These should not be consumed by downstream scripts until reconciled.

## Visual Audit Coverage

Current V2 source requires 40 shots.

- New V2 partial rebuild reviewed from disk: 17 shot pairs: `Shot027B`, `Shot027C`, `Shot027D`, `Shot032`, `Shot032A`, `Shot033B`, `Shot033C`, `Shot033D`, `Shot034C`, `Shot034D`, `Shot034B`, `Shot034E`, `Shot034F`, `Shot034G`, `Shot034`, `Shot035`, `Shot036`.
- Unavailable in V2 rebuild: 23 shots: `Shot025`, `Shot025A`, `Shot026`, `Shot026B`, `Shot026C`, `Shot027`, `Shot028`, `Shot028B`, `Shot028C`, `Shot029`, `Shot029C`, `Shot029D`, `Shot029B`, `Shot030`, `Shot030B`, `Shot030C`, `Shot031`, `Shot031B`, `Shot032B`, `Shot032C`, `Shot032D`, `Shot032E`, `Shot033`.
- Legacy current start/key set reviewed as context: 36 shot pairs. It remains layout/reference only against V2.

## Blocking Issues

- The sequence cannot advance while more than half of the V2 shots are missing from the rebuild.
- The old 36-shot batch cannot be patched into final state because V2 adds `Shot032A` and `Shot034E/F/G`, and changes the tactical meaning of several existing shots.
- No final end-frame/edit-out locks exist for all 40 shots, blocking video package assembly.
- Strict continuity is absent at manifest level, not merely unreviewed.

## Continuity Issues

- `Shot032 -> Shot032A -> Shot033B` is now visually plausible as a local objective-chain repair, but it still lacks final pair entries.
- `Shot033B -> Shot033C/033D -> Shot034C/034D -> Shot034B` needs strict review after end-frame locks exist; the current stills imply the path but do not prove the edit handoff.
- `Shot034B -> Shot034E/F/G -> Shot034 -> Shot035 -> Shot036` now has visual coverage, but the stand-down inserts are portrait-like and need motion tests to feel like consequences of the whistle rather than isolated character cards.

## Character / Canon Issues

- Pass for intent: the new chain preserves nonlethal objective victory, keeps teachers dignified, and restores Annette's contribution and Dedue/Mercedes discipline.
- Monitor: `Shot027B` risks turning the Black Eagles into pose-like formation instead of disciplined motion; Edelgard, Hubert, and Dorothea must stay distinct in video.
- Monitor: `Shot033D` proves Manuela is unhurt, but Ingrid's route block is very static and could become a stiff spear-point threat.
- Monitor: `Shot034E/F/G` preserve house dignity but drift toward faction portraits. Some weapon silhouettes read more metal/sharp than blunted training equipment.
- Monitor: `Shot035` finally isolates Felix/Byleth respect, but Felix identity is fragile against earlier Felix frames.
- Monitor: `Shot036` has the right emotional residue for Dimitri, but needs a clearer lowered-lance/hand-tension action chain.

## Cinematography / Blocking Issues

- Stronger than previous: `Shot032`, `Shot032A`, `Shot033C`, and `Shot034D` now visibly prove their tactical beats.
- Weaker than required: `Shot033B` points toward an almost empty platform; the preceding/following shots must keep the teachers present on the objective.
- Weaker than required: stand-down frames are composed as handsome static tableaux, not always as changed tactical states.
- High oblique `Shot034` works as a field-resolution map but cannot replace the house-specific stand-down inserts.

## Motion Or Downstream Risks

- AI-video drift risk remains high because every reviewed V2 pair is only `monitor_required`.
- Priority motion tests: `Shot027B`, `Shot027D`, `Shot032`, `Shot032A`, `Shot033B`, `Shot033D`, `Shot034C`, `Shot034D`, `Shot034E`, `Shot034F`, `Shot034G`, `Shot035`, `Shot036`.
- Prompt locks must explicitly forbid blood, knockdowns, humiliation framing, camera-facing combat poses, sharp metal weapon drift, and anonymous foreground extras.

## Existing Material Findings

- New V2 pairs worth keeping for low-cost motion testing: `Shot027C`, `Shot032`, `Shot032A`, `Shot033C`, `Shot034D`, `Shot034`, `Shot035`, `Shot036`.
- New V2 pairs useful but fragile: `Shot027B`, `Shot027D`, `Shot033B`, `Shot033D`, `Shot034C`, `Shot034B`, `Shot034E`, `Shot034F`, `Shot034G`.
- Legacy current frames failed despite existing on disk in prior substantive review: `Shot026`, `Shot027D`, `Shot028`, `Shot030B`, `Shot031B`, `Shot032E`, `Shot034C`, `Shot034B`, `Shot035`, `Shot036`.

## Required Revisions

1. Generate the 23 missing V2 rebuild shot pairs.
2. Reconcile duplicate `Shot033B`, `Shot033C`, and `Shot033D` candidate files and ensure QA manifests point to only one accepted start/key pair per shot.
3. Add end-frame/edit-out locks for all 40 shots.
4. Run strict adjacent-shot continuity review across the full V2 order.
5. Run low-cost motion tests for all `monitor_required` V2 pairs before paid full-resolution video generation.
6. Rebuild the video batch only after the full 40-shot start/key/end set exists and passes independent storyboard/canon review.

## Required Report Summary

Integrity Summary: structural manifest valid, storyboard gate blocked, continuity manifest empty.

Visual Audit Coverage: 17 new V2 rebuild pairs reviewed; 36 legacy pairs considered as context; 23 V2 shots unavailable.

Unavailable Shots: 23, listed above.

Existing Shots Failed: 10 legacy pairs fail V2 substance; no new V2 pair was upgraded past `monitor_required`.

Layout Reference Only: legacy 36-shot current set; V2 logic previs remains layout/continuity reference only.

Monitor Required: 17 new V2 rebuild pairs.

Visual Review Passed: 0.

Promotion Decision: `blocked_needs_revision`; do not promote to `approved_for_video` or `approved_for_delivery`.
