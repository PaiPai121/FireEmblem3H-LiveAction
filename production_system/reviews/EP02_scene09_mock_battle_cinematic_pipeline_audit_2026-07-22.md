# EP02 Scene09 Mock Battle Cinematic Pipeline Audit

Date: 2026-07-22

Scope: second-chapter mock battle / EP02 Scene09, current V2 shooting script, V2 shot list, 2026-07-19 start/key contact sheet, 2026-07-21 logic previs, and cinematic_v2 expanded video batch.

## Decision

`blocked_needs_revision`

The V2 script is approved as the current story source, and the V2 shot list is directionally strong enough to guide regeneration. The current image and video-generation package are not ready for paid video or delivery. They remain layout / logic reference material until regenerated against the 40-shot V2 source of truth.

## Blocking Issues

1. V2 shot count mismatch: `episodes/EP02/scene09_shot_list_v2_2026-07-21.md` contains 40 shots, but the current expanded batch and current start/key raster set contain 36.
2. Missing final V2 frame coverage: `Shot032A`, `Shot034E`, `Shot034F`, and `Shot034G` have no final start/key frames in `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/`.
3. The current expanded video batch still points to stale inputs: older `p1_*` PNGs and `mock_battle_canon_map_2026-07-17/*.svg` layout files, not the current approved 40-shot V2 frame set.
4. No clips exist at the expected output path `episodes/EP02/video_outputs/cinematic_v2/`, so motion review cannot be performed.
5. The package does not contain final start/key/end frame locks for every shot, which blocks strict video delivery packaging.
6. Prior audits explicitly downgraded the current Scene09 image batch to layout reference only; the V2 shot list repeats that all current Scene09 images require fresh start/key generation.

## Continuity Issues

- Strict adjacent-shot review is not approvable while the V2 shot list and expanded batch disagree on sequence membership.
- `Shot032 -> Shot032A` is conceptually repaired by the logic previs, but only as `logic_previs_only_not_final_keyframe`.
- `Shot034B -> Shot034E -> Shot034F -> Shot034G -> Shot034 -> Shot035 -> Shot036` is a required dignity / stand-down chain in V2, but the three house-specific stand-down inserts are missing from the current production raster set.
- End-frame / edit-out states are not explicit enough for final video assembly, especially around the teacher objective resolution and post-battle restraint beats.

## Character / Canon Issues

- The V2 script handles canon/adaptation well: Blue Lions win by objective control, Black Eagles and Golden Deer remain competent, and the exercise stays nonlethal.
- Visual identity remains under monitor: Hilda academy age, Mercedes empty-hand support, Dedue shield-line restoration, Byleth sheathed-sword interruption, and named Black Eagles / Golden Deer readability must all be rechecked after final regeneration.
- Any final frame fails if named students become anonymous adult extras or if weapons drift from the V2 locks.

## Cinematography / Blocking Issues

- The V2 shot list has clear tactical geography: Blue Lions southeast to northeast, Black Eagles north/northeast resisting south/southeast, Golden Deer west thicket pressure east/southeast.
- The 2026-07-21 P0 logic previs usefully proves the spatial logic for `Shot032`, `Shot032A`, and `Shot033B`, but it cannot replace cinematic start/key frames.
- Current 36-frame contact sheet is useful as continuity reference, not final visual authority.

## Motion Or Downstream Risks

- AI-video drift risk is high until every job uses final start/key/end locks.
- Group shots risk crowd growth, face drift, wrong academy age, weapon changes, and camera-facing combat poses.
- Nonlethal training tone must be guarded in every prompt: no blood, no lethal injuries, no rout / humiliation framing.

## Required Revisions

1. Generate final raster start/key frames for `Shot032A`, `Shot034E`, `Shot034F`, and `Shot034G`.
2. Rebuild the Scene09 video batch from the 40-shot V2 shot list, not from the 36-shot 2026-07-16 expanded batch.
3. Replace all stale `image_path` values that point to old `p1_*` PNGs or SVG diagrams with approved current start/key/end frame paths.
4. Add explicit end-frame / edit-out intent for every V2 shot before delivery packaging.
5. Rerun independent storyboard QA and canon/fidelity review on the regenerated 40-shot frame set.
6. Run low-cost motion tests before full generation for `Shot029B`, `Shot030C`, `Shot032`, `Shot032C`, `Shot032D`, `Shot032E`, `Shot033C`, `Shot033D`, and `Shot034D`.
7. Only after the above, run strict adjacent-shot continuity review across the complete 40-shot sequence.

## Gate Status

| Gate | Status | Notes |
| --- | --- | --- |
| Story / script | `approved_for_next_stage` | V2 script has purpose, conflict, objective, tactical/emotional turn, and canon locks. |
| Shot list | `monitor_required` | Strong direction, but missing end-frame / edit-out states and downstream frame coverage. |
| Current start/key frames | `blocked_needs_revision` | 36 current pairs cannot satisfy the 40-shot V2 source. |
| P0 logic previs | `monitor_required` | Good for local layout only; not final video input. |
| Video batch / prompts | `blocked_needs_revision` | Stale paths, missing V2 shots, no clips, no final frame locks. |
| Strict continuity | `blocked_needs_revision` | Must wait for regenerated complete 40-shot frame set. |

## Promotion Ruling

Do not promote Scene09 mock battle to `approved_for_video` or `approved_for_delivery`.

Allowed next action: generate and review the missing / priority V2 frame batch, beginning with `Shot032A`, `Shot034E`, `Shot034F`, `Shot034G`, then rebuild the objective and stand-down video jobs from the V2 source.
