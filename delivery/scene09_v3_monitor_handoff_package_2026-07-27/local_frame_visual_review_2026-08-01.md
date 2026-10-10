# Scene09 V3 Local Frame Visual Review

Date: 2026-08-01
Scope: current 42-shot monitor handoff package, package-local start/key/end PNGs, regenerated monitor contact sheets, high-risk full-size contact sheet, and full-size checks for the user-called-out risk shots.

## Decision

Status: `monitor_required_before_video`.

The package now has a clean story/prompt contract for monitored image-to-video probes, but it is not approved for expensive full-duration generation. The prior high-risk still-frame blockers for Shot025, Shot029C, Shot030B, and Shot034B have been regenerated or contract-repaired and synchronized into the delivery package and web panel. Remaining risk is now downstream motion drift and a few lineup/static-acting concerns.

## Current Fixes Verified

- Shot034B is now `空教师目标裁定` in the package manifest, video delivery manifest, frame generation queue, model prompt, production prompt, and web panel.
- Shot034B visible roster is exactly `Byleth, Dimitri`.
- Shot034B package-local `start_frame.png`, `key_frame.png`, and `end_frame.png` now match the empty-objective source PNGs by SHA-256.
- Shot034B visual chain shows Byleth and Dimitri facing two empty objective markers; Hanneman and Manuela are absent/offscreen/silent/unpaired.
- Shot025 has been regenerated as a closer three-leader rules/objective beat. Dimitri, Edelgard, and Claude are all readable, balanced, and framed as competent before the fair three-way contest.
- Shot029C has been regenerated from a Claude-solo risk into a readable three-character tactical relation. Claude pressures both lanes while Ashe and Edelgard remain identifiable and not humiliated.
- Shot030B has been regenerated with Felix holding exactly one straight blunt wooden training sword through start/key/end. The chain/segmented-blade read is removed.
- Shot032 preserves the Dedue/Mercedes healer-tank beat: Mercedes heals from behind, Dedue absorbs the hit and restores the shield line.
- Shot032F preserves the Hubert nonlethal capture by Felix and Ashe.
- Shot032G preserves the Golden Deer capture of Dorothea and Bernadetta without cruelty.
- Shot033C and Shot033D keep Hanneman and Manuela on separate teacher lanes; they do not stand side by side.
- Shot034G keeps the exhausted Byleth/Dimitri/Dedue core victory instead of a full Blue Lions class reset.

## Remaining Visual Problems

- Shot032B and Shot033 retain a visible Hanneman observer/objective element. This is acceptable only if the scene keeps separate teacher route pressure before Shot034B. If the creative direction is now "no teacher objective line at all," these shots must be rewritten and regenerated.
- Shot034E is a readable Golden Deer stand-down tableau, but it is static and lineup-like. It needs restrained, specific motion in video: lowering weapons, breath, small eyeline shifts, no heroic group-pose freeze.
- Shot034F is a readable Black Eagles concession beat for Edelgard/Ferdinand, but the other Black Eagles exits depend on earlier shots; do not use it alone as complete Black Eagles coverage.

## Video Probe Reject Rules

- Reject any generated clip that adds unnamed readable people, background crowds, readable silhouettes, or spectators.
- Reject any clip that restores captured/retired characters into active combat after their ledger exit.
- Reject any clip that puts Hanneman and Manuela side by side, pairs them as allies, or returns either teacher to Shot034B.
- Reject any clip that turns blunt training weapons into lethal sharp weapons, chain blades, firearms, gore, or impact injuries.
- Reject any clip that ages academy students into war-phase/adult faces or swaps them into generic extras.

## Evidence

- Monitor contact sheets: `production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part1.png` through `monitor_contact_sheet_part5.png`
- High-risk contact sheet: `production_system/reviews/scene09_v3_high_risk_contact_sheet_ascii_2026-08-01.jpg`
- High-risk regenerated-frame contact sheet: `production_system/reviews/scene09_v3_high_risk_regen_contact_sheet_2026-08-02.jpg`
- High-risk report: `production_system/scene09_v3_attrition_package/scene09_v3_high_risk_contact_sheet_ascii_2026-08-01.md`
- Character beat audit: `production_system/scene09_v3_attrition_package/scene09_v3_character_beat_readiness_audit_2026-08-01.md`
- Model prompt completeness audit: `production_system/scene09_v3_attrition_package/scene09_v3_model_prompt_completeness_audit_2026-07-30.md`
- Video prompt contract audit: `production_system/scene09_v3_attrition_package/scene09_v3_video_prompt_contract_audit_2026-07-28.md`
