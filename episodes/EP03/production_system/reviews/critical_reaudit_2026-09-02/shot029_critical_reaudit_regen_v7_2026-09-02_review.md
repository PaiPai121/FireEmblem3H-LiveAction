# Shot029 Critical Re-audit

- **Reviewer role:** `independent-critical-reaudit-visual-qa-agent`
- **Review date:** `2026-09-02`
- **Decision:** `visual_review_passed` for still frames; downstream `monitor_required`
- **Issue repaired:** the aftermath previously risked reading as a group surrounding a fallen target. The v7 chain receives the dropped sword and keeps all witnesses in staggered, non-rushing positions.

## Reviewed Files

- `storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/start_frame.png`
- `storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/key_frame.png`
- `storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/end_frame.png`
- `storyboards/Shot029/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg`

## Findings

- START receives the ordinary sword on the mud and Lonato's first buckle; Catherine is absent.
- KEY completes one physical shield/hand/knee recovery without anyone touching or attacking Lonato.
- END holds Lonato isolated against his shield while Dimitri remains lateral, female Byleth remains rear-center, and Ashe remains farther back; the witnesses do not form a row or a close execution ring.
- Byleth is consistently female and uses the local professor selected identity; no male Byleth or Catherine re-enters.

## Local Reference Trace

`assets/characters/kingdom/Lonato/legacy_ep01/selected.png`, `assets/characters/blue_lions/Dimitri/academy/selected.png`, `assets/characters/blue_lions/Ashe/academy/selected.png`, `assets/characters/protagonist/BylethFemale/professor/selected.png`, and the Shot028 v7 END frame.

## Remaining Gate

Keep `monitor_required` until prompt-against-frame QA, strict adjacent continuity QA, native Japanese audio verification, and a 3-second motion probe pass. Reject male Byleth, a witness rush, a raised execution weapon, a duplicated Lonato, or a reset to a flat lineup.
