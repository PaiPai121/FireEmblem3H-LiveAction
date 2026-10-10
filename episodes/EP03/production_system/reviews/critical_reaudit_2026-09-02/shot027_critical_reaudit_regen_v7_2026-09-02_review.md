# Shot027 Critical Re-audit

- **Reviewer role:** `independent-critical-reaudit-visual-qa-agent`
- **Review date:** `2026-09-02`
- **Decision:** `visual_review_passed` for still frames; downstream `monitor_required`
- **Issue repaired:** the previous chain jumped from Ashe's arrow beat toward a direct Lonato confrontation. The v7 chain gives the guards a visible causal interaction before Catherine can approach Lonato.

## Reviewed Files

- `storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/start_frame.png`
- `storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/key_frame.png`
- `storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/end_frame.png`
- `storyboards/Shot027/critical_reaudit_regen_v7_2026-09-02/contact_sheet.jpg`

## Findings

- START receives Ashe's lowered nocked arrow and the two-guard middle line; Catherine enters through the left gap while Lonato remains distant.
- KEY shows Catherine using the guard/strong section of Thunderbrand to redirect the nearer guard's long weapon. The action is weapon-to-weapon and does not hit Lonato.
- END leaves the nearer guard displaced behind the barrier, the second guard visible, Ashe held back, and Lonato separated by the remaining muddy lane.
- The blocking reads as an intervention in the guard line, not a teleport, a body collision, or a posed four-person lineup.

## Local Reference Trace

`assets/characters/blue_lions/Ashe/academy/selected.png`, `assets/characters/church_of_seiros/Catherine/academy/selected.png`, `assets/props/shared/hero_relics/thunderbrand_reference.png`, `assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png`, and the Shot026 v7 END frame.

## Remaining Gate

Keep `monitor_required` until prompt-against-frame QA, ordered combat QA, strict adjacent continuity QA, native Japanese audio verification, and a 3-second motion probe pass. Reject if Catherine reaches Lonato before the next shot, Ashe fires, or either guard vanishes before the redirection lands.
