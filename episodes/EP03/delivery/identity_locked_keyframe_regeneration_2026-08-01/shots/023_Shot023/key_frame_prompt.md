# Shot023 key_frame Identity-Locked Regeneration Prompt

Target output: `key_frame_identity_locked_regen_2026-08-01.png`
Decision state: frames_pending. This prompt does not approve the frame; it creates a candidate for independent visual QA.

## Identity Locks First

Use the local selected/reference assets as hard identity and wardrobe sources. Preserve exact face read, age read, hairstyle, body type, academy-era costume topology, insignia, weapons, and role.

Named characters: Lonato, Ashe
Character assets:
- `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`
- `assets/characters/blue_lions/Ashe/academy/selected.png`

Local identity plates:
- Lonato: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_kingdom_Lonato_legacy_ep01_selected_identity_plate_2026-08-01.jpg` from `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`
- Ashe: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Ashe/academy/selected.png`

Location assets:
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`

Prop assets:
- none

Local asset proof sheet:
- `episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot023_local_asset_previs_proof_2026-07-31.jpg`

Local composited previs for this frame, used only for identity/layout reference:
- `episodes/EP03/storyboards/Shot023/key_frame.png`

Source/layout reference, not final image material:
- `episodes/EP03/source_refs/Shot023_source.png`


## Story And Frame Intent

Scene beat: Lonato 拒绝
Shot purpose: 让 Lonato 的叛乱有道德痛点，但不能推翻本章教会权力事实。
Frame role: key
Frame intent: Capture the decisive visible beat: Lonato 看 Ashe，却没有放下武器；背后叛军继续移动。
Action peak: 让 Lonato 的叛乱有道德痛点，但不能推翻本章教会权力事实。
Blocking: Lonato 看 Ashe，却没有放下武器；背后叛军继续移动。
Screen direction: Maintain Blue Lions moving from lower/right foreground toward upper/left fog ridge unless the cathedral/monastery scene is static.
Camera: 近中景，雾后剪影继续威胁。
Audio anchor: Lonato, in Japanese: 問われぬ罪は、聖なる名の陰に隠されるだけだ。
Edit in/out: cut from Ashe plea / cut to Byleth command

## Generation Direction

Create a cinematic live-action keyframe that integrates the local character identities into the EP03 environment with coherent lighting, scale, depth, and camera perspective. The image should feel like a film still, but it must not redesign any named character, costume, weapon, prop, or story beat.

Use restrained performance: show intention through eyeline, posture, breath, hand tension, and small facial changes. Avoid theatrical reaction faces.

## Must Preserve

- Exact local selected.png character identity and academy-era wardrobe topology.
- Exact local identity plate face crop, hair silhouette, body proportion, costume topology, and full-body outline for every named character.
- EP03 fog/cathedral geography, shot scale, and screen direction.
- The declared key frame intent and the start/key/end motion chain.
- Non-graphic, duty-focused, tragic tone.

## Reject If

- game UI or subtitles appear
- academy identities drift
- Lonato becomes a generic villain
- Ashe directly executes Lonato
- Any generated face no longer matches the listed local selected/reference assets.
- The image looks like a game screenshot, anime frame, UI capture, or generic fantasy cosplay.
- The shot adds new named characters, random soldiers as named-role substitutes, modern objects, subtitles, captions, or visible UI.
