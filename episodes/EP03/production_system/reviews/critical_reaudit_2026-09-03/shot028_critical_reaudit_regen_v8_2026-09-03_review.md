# Shot028 Critical Re-audit Review

- Shot: `Shot028`
- Candidate: `critical_reaudit_regen_v8_2026-09-03`
- Decision: `monitor_required`
- Reviewer: `codex-independent-critical-reaudit-visual-qa`
- Review date: `2026-09-03`

## Reason For Replacement

The previous v7 candidate was rejected during sequential visual inspection. Its START frame dropped the guard buffer from Shot027 and presented Catherine and Lonato as an almost immediate face-to-face exchange. The frame spec claimed one withdrawing guard, while the preceding shot visibly carried two guards. That made the disarm read as a jump rather than the result of a guard line being displaced.

## Evidence

- START: `storyboards/Shot028/critical_reaudit_regen_v8_2026-09-03/start_frame.png`
- KEY: `storyboards/Shot028/critical_reaudit_regen_v8_2026-09-03/key_frame.png`
- END: `storyboards/Shot028/critical_reaudit_regen_v8_2026-09-03/end_frame.png`
- Contact sheet: `storyboards/Shot028/critical_reaudit_regen_v8_2026-09-03/contact_sheet.jpg`
- Local identity assets: `assets/characters/church_of_seiros/Catherine/academy/selected.png`, `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`
- Local guard and weapon locks: `assets/characters/extras/BanditSoldier/selected.png`, `assets/props/shared/hero_relics/thunderbrand_reference.png`
- Continuity anchor: `storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/end_frame.png`
- Generation source caches: `/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-78ce929f-d1e0-487c-86d9-62627cc8fea8.png`, `/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-396c9406-87f4-4ff9-985e-8b83be91e5fa.png`, `/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-3ab1bb3d-a63a-42ed-ac00-969458006deb.png`

## Static Visual Findings

- START preserves two unfeatured rebel guards from Shot027: one recovering behind the nearer barrier and one braced farther uphill near Lonato. Catherine and Lonato remain separated by a readable multi-metre muddy lane, and no weapon contact has happened.
- KEY shows one controlled weapon-to-weapon bind at the ordinary sword guard and Lonato's right weapon-hand height. Catherine's feet and hips carry the pivot; Lonato remains standing behind his attached shield; both guards remain in the background.
- END shows the ordinary sword flat on wet mud, Catherine one step laterally away with Thunderbrand low, Lonato upright and twisted, and both guards still withdrawing. It does not pre-empt Shot029's knee recovery.
- The three frames are integrated live-action stills with grounded feet, wet contact shadows, coherent depth, practical armor, and no visible game UI, borders, captions, or pasted character plates.

## Gate Result

- START/KEY/END distinction: `pass_in_still_frames`
- Guard-mediated causality: `pass_in_still_frames`
- Weapon and character identity: `pass_against_local_asset_manifest`
- Shot027 -> Shot028 handoff: `pass_in_declared_still_chain`
- Shot028 -> Shot029 handoff: `pass_in_declared_still_chain`
- Prompt-against-frame QA: `pending`
- Motion probe: `pending`
- Native Japanese audio probe: `not_run`
- Final video approval: `not_approved`

The current candidate is therefore `monitor_required`. It may proceed as the current storyboard frame set, but it is not approved for generated video until the ordered motion and native Japanese audio gates pass.
