# Shot028 Critical Re-audit Review

- Shot: `Shot028`
- Candidate: `critical_reaudit_regen_v9_2026-09-03`
- Decision: `monitor_required`
- Reviewer: `independent-critical-reaudit-visual-qa-agent`
- Review date: `2026-09-03`

## Reason For Replacement

The v8 candidate was rejected after a frame-by-frame visual check found an additional human silhouette on the upper-left ridge in START, KEY, and END. That figure violated the declared exact two-guard lock and made the battlefield geography read as a larger, uncontrolled crowd. v9 is the replacement candidate and is the only current frame set.

## Evidence

- START: `storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/start_frame.png`
- KEY: `storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/key_frame.png`
- END: `storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/end_frame.png`
- Contact sheet: `storyboards/Shot028/critical_reaudit_regen_v9_2026-09-03/contact_sheet.jpg`
- Catherine identity: `assets/characters/church_of_seiros/Catherine/academy/selected.png`
- Lonato identity: `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`
- Guard wardrobe reference: `assets/characters/extras/BanditSoldier/selected.png`
- Thunderbrand reference: `assets/props/shared/hero_relics/thunderbrand_reference.png`
- Location/style reference: `assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png`
- Continuity anchor: `storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/end_frame.png`
- Generation source caches: `/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-e35adade-2c31-4ac5-88d8-ee730e9539d7.png`, `/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-f18f672f-ee10-413d-8a37-54b3bafd58b4.png`, `/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-9ecc9c82-3110-4154-aa70-17d561f0c27a.png`

## Static Visual Findings

- The three exact project copies contain exactly four human figures: Catherine, Lonato, and two unfeatured rebel guards. No third guard or distant human-shaped silhouette is visible on the ridge, in the fog, or behind the barriers.
- START reads as pre-contact: Catherine and Lonato have a broad muddy separation, Lonato begins the controlled press, and the two guards preserve the buffer inherited from Shot027.
- KEY reads as one weapon-level bind outside the bodies: Catherine's gold serrated Thunderbrand meets Lonato's ordinary sword while his shield stays between the bodies. The guards remain visible and no blade enters a torso or neck.
- END reads as the payoff: the ordinary sword lies separately on wet mud, Catherine has recovered laterally with Thunderbrand low, Lonato is still upright and twisted, and the two guards withdraw behind the barriers for Shot029.
- Identity, wardrobe, terrain, feet, contact shadows, wet materials, and practical live-action lighting are integrated in the frame rather than pasted portrait plates. START, KEY, and END are materially different states.

## Gate Result

- Exact four-person count / no distant silhouette: `pass_in_still_frames`
- START/KEY/END causal distinction: `pass_in_still_frames`
- Weapon and character identity: `pass_against_local_asset_manifest`
- Shot027 -> Shot028 handoff: `pass_in_declared_still_chain`
- Shot028 -> Shot029 handoff: `pass_in_declared_still_chain`
- Prompt-against-frame QA: `pending`
- Ordered combat QA: `pending`
- Motion probe: `pending`
- Native Japanese audio probe: `not_run`
- Final video approval: `not_approved`

The static frame candidate is therefore `monitor_required`. It is the current storyboard frame set, but it is not approved for generated video until prompt/frame QA, ordered combat QA, motion, and native Japanese audio gates pass.
