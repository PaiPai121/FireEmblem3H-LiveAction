# Shot023 Frame Spec

Shot ID: Shot023
Stage: storyboard
Status: monitor_required
Current Version: critical_reaudit_regen_v6_2026-08-23
Script Beat: Lonato 拒绝
Shot Purpose: 让 Lonato 的拒绝产生道德痛点，同时保持父子谈判的安全距离，把战术危险交给下一镜。
Duration Target: 13 seconds
Location: Lonato battlefield ridge
Characters Visible: Lonato, Ashe

## Critical Re-audit Finding

Shot023 v5 corrected the left/right axis and introduced a scale progression, but its KEY became a face-to-face sword-distance exchange. v6 keeps the axis and makes the road itself the moral and physical buffer: Lonato remains on the upper-left rise, Ashe remains on the lower-right mark, and every frame shows enough ground between them to prove that the nearby Blue Lions from Shot022 cannot simply decapitate him.

## Character Identity Locks

- Lonato: `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`; older white-haired armored man, worn shield, one sword held low, tragic restraint.
- Ashe: `assets/characters/blue_lions/Ashe/academy/selected.png`; youthful academy archer, silver-grey hair, one wooden bow held slack and low.

## Presence and Geography Locks

- Exactly two named readable performers: Lonato and Ashe.
- Lonato is left/uphill; Ashe is right/nearer in START, KEY, and END. Never mirror or cross the axis.
- Keep a visible 4–6 metre muddy-road buffer between them. Both pairs of feet and the central lane must be readable in at least START and KEY; no close two-shot.
- Indistinct rebel silhouettes may remain deep in fog only. They are not readable faces and do not close the gap.
- No Byleth, Dimitri, Catherine, Felix, Dedue, Mercedes, Ingrid, Rhea, horse, or other named character enters.

## Asset References

- `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`
- `assets/characters/blue_lions/Ashe/academy/selected.png`
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`
- `storyboards/Shot022/critical_reaudit_regen_v4_2026-08-23/end_frame.png` as previous-shot geography reference
- `source_refs/Shot023_source.png` as provenance only, never a generation fallback

## Frame Intents

Start Frame Intent: Receive Shot022 v4's respectful pause. Wide long-lens view: Lonato stands left/uphill with shield and sword low; Ashe stands right/nearer with bow low; the muddy road and fog band between them are unmistakable.

Key Frame Intent: Refusal peak in a medium-long two-plane frame, not a close-up. Lonato turns his weathered face toward Ashe and makes one restrained open-palm refusal gesture; shield stays grounded and sword point stays down. Ashe listens in profile on the far side of the road, bow slack. The full gap remains visible and neither can reach the other without crossing open ground.

End Frame Intent: Pull back without changing axis. Lonato turns three-quarter toward the indistinct rebel pressure on the upper-left ridge; Ashe stays right/nearer and watches. The same road buffer remains open, setting up Byleth's rear command in Shot024 rather than an abrupt spatial reset.

## Camera and Blocking

Camera: 16:9 photographed live-action long lens. Start wide, key medium-long with environmental headroom and full gap, end wider tactical observation. No portrait crop, no face-to-face coverage, no artificial mirror, spin, whip-pan, or game-map aerial.

Blocking: Lonato left/uphill -> restrained refusal in the same mark -> turn toward rebels. Ashe right/nearer -> one stationary listening mark -> remains witness. Neither actor advances during the refusal.

Screen Direction: lower/right Ashe and road toward upper/left ridge. Hold Lonato left and Ashe right through the cut to Shot024.

Action Peak: Lonato's low guarded refusal and hand gesture, not an attack.
Dialogue / Audio Anchor: Lonato, in Japanese: 問われぬ罪は、聖なる名の陰に隠されるだけだ。
Edit In: cut from Ashe plea
Edit Out: cut to Shot024 Byleth command

## Continuity Requirements

- Receive Shot022 v4's wet mud, torn banner, fog, academy Ashe, and left/uphill Lonato axis.
- Keep Lonato's sword and shield low and Ashe's bow low through all frames.
- Keep the physical road buffer visible; the next shot may widen to Byleth's command but must not imply a sudden retreat from a close conversation.
- All performers share one live-action environment with real scale, feet, contact shadows, wet fabric, and fog depth.

## Reject If

- START, KEY, or END puts Ashe within sword reach of Lonato or crops away the central gap
- the left/uphill Lonato and right/nearer Ashe axis reverses
- Lonato attacks, Ashe raises/fires the bow, or rebels become a named crowd
- any Byleth/Dimitri/other named character appears
- the frames are pasted plates, a flat lineup, a game screenshot, or a portrait-only crop
- UI, subtitles, logos, Chinese/Mandarin voice, or readable text appears

Planned Frames:
- start_frame.png: `critical_reaudit_regen_v6_2026-08-23/start_frame.png`
- key_frame.png: `critical_reaudit_regen_v6_2026-08-23/key_frame.png`
- end_frame.png: `critical_reaudit_regen_v6_2026-08-23/end_frame.png`
- contact_sheet.jpg: `critical_reaudit_regen_v6_2026-08-23/contact_sheet.jpg`

Current Visual Review: v6 is a distance-correction rebuild. Keep `monitor_required` until exact-frame visual review, prompt-against-frame QA, and a 3-second motion probe pass.
