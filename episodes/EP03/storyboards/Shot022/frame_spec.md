# Shot022 Frame Spec

Shot ID: Shot022
Stage: storyboard
Status: monitor_required
Current Version: critical_reaudit_regen_v4_2026-08-23
Script Beat: Ashe 上前
Shot Purpose: Ashe 主动请求停手，但谈判仍发生在可被队伍保护的安全距离之外。
Duration Target: 13 seconds
Location: Lonato battlefield ridge
Characters Visible: Ashe, Lonato, Dimitri, Byleth

## Critical Re-audit Finding

Shot022 v3 fixed the identity collision, but the sequence still needed a hard physical distance rule. v4 treats the road as a negotiation buffer: Ashe advances one controlled step only, Lonato remains several paces uphill, and Dimitri plus female Byleth stay behind Ashe as a control line. No named Blue Lion is close enough to Lonato for an opportunistic execution.

## Character Identity Locks

- Ashe: `assets/characters/blue_lions/Ashe/academy/selected.png`; silver-grey hair, academy archer tan chest panel and blue hood/scarf, one wooden bow held low.
- Lonato: `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`; older white-haired armored man, one worn shield and one lowered sword.
- Dimitri: `assets/characters/blue_lions/Dimitri/academy/selected.png`; blond hair, bright royal-blue cape, navy high-collar academy uniform, sword at hip, no bow.
- Byleth: `assets/characters/protagonist/BylethFemale/professor/selected.png`; female academy-era professor only, dark teal hair, no male Byleth.

## Presence and Geography Locks

- Exactly four named performers are readable: one Ashe, one Lonato, one Dimitri, one female Byleth.
- Ashe and Lonato never stand within sword reach. The central muddy road, visible feet, and a band of fog must remain between them in all three frames; target screen distance is at least 4–6 metres.
- Dimitri and female Byleth stay behind Ashe by at least one body-length plus a visible lane. They are support/control, not executioners standing beside Lonato.
- Exactly one bow exists: Ashe's. Dimitri carries only a sheathed or lowered sword.
- No horse, charge, raised blade, or new named character enters.

## Asset References

- `assets/characters/blue_lions/Ashe/academy/selected.png`
- `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`
- `assets/characters/blue_lions/Dimitri/academy/selected.png`
- `assets/characters/protagonist/BylethFemale/professor/selected.png`
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`
- `storyboards/Shot021/critical_reaudit_regen_v2_2026-08-21/end_frame.png` as previous-shot geography reference only

## Frame Intents

Start Frame Intent: Receive Shot021 END as a long-lens road-axis frame. Lonato is a small but readable figure on the upper-left ridge. Ashe stands lower-right on the near side of the road with bow fully low. Dimitri is behind and offset, and female Byleth remains farther back on the same support line. The open muddy strip between Ashe and Lonato is the subject.

Key Frame Intent: Ashe has taken one step and speaks from the near edge of the negotiation line. Use a medium-long over-the-shoulder or three-quarter frame that still shows both pairs of feet and the full gap. Lonato remains 4–6 metres uphill, shield grounded and sword point down. Dimitri and Byleth remain behind Ashe, visibly unable to reach Lonato without crossing the road.

End Frame Intent: Respectful pause before refusal. Ashe opens one empty hand while his bow stays low; Lonato answers with a small restrained palm gesture without advancing. The road gap, fog band, and rear control line remain visible. This is not a close two-shot.

## Camera and Blocking

Camera: 16:9 live-action long lens with a slow observational drift. Use environmental scale and telephoto compression, not portrait close-up. Start wide, key medium-long, end medium-long/wide; the gap must not disappear.

Blocking: Lonato holds the left/uphill anchor. Ashe holds the right/nearer negotiation mark. Dimitri stays one lane behind Ashe; female Byleth stays farther rear-right or rear-center. Their weapons remain low and their eyelines follow Ashe's plea.

Screen Direction: lower/right road toward upper/left fog ridge. Preserve the left/uphill Lonato and right/nearer Ashe axis into Shot023.

Action Peak: Ashe's deliberate step and request, not contact or attack.
Dialogue / Audio Anchor: Ashe, in Japanese: ロナート様、どうか止まってください。
Edit In: cut from Lonato reveal
Edit Out: cut to Lonato refusal

## Continuity Requirements

- Preserve Shot021 END's wet mud, torn blue banner, fog ridge, academy uniforms, and road axis.
- Keep the visible buffer between Ashe and Lonato in START, KEY, and END; never use a sword-reach conversational distance.
- Female Byleth only. Dimitri must remain blond, blue-caped, sword-bearing, and never Ashe-like.
- All performers share one physical live-action scene with grounded feet, contact shadows, matching lens, and consistent weather.

## Reject If

- Ashe and Lonato become a close face-to-face two-shot or stand within sword reach
- Dimitri or Byleth appears beside Lonato as if able to execute him immediately
- Dimitri gains a bow, a second Ashe-like archer appears, or Byleth becomes male
- Lonato raises/sweeps the sword, Ashe raises/fires the bow, or a charge begins
- characters read as pasted cutouts, transparent plates, a flat lineup, or mismatched ground contact
- UI, subtitles, dialogue boxes, logos, Chinese/Mandarin voice, or readable text appears

Planned Frames:
- start_frame.png: `critical_reaudit_regen_v4_2026-08-23/start_frame.png`
- key_frame.png: `critical_reaudit_regen_v4_2026-08-23/key_frame.png`
- end_frame.png: `critical_reaudit_regen_v4_2026-08-23/end_frame.png`
- contact_sheet.jpg: `critical_reaudit_regen_v4_2026-08-23/contact_sheet.jpg`

Current Visual Review: v4 is a new distance-continuity rebuild. Keep `monitor_required` until the exact frames pass visual review, prompt-against-frame QA, and a 3-second motion probe.
