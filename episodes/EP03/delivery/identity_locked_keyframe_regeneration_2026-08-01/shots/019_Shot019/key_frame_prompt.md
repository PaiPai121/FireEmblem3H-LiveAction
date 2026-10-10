# Shot019 key_frame Identity-Locked Regeneration Prompt

Target output: `key_frame_identity_locked_regen_2026-08-01.png`
Decision state: frames_pending. This prompt does not approve the frame; it creates a candidate for independent visual QA.

## Identity Locks First

Use the local selected/reference assets as hard identity and wardrobe sources. Preserve exact face read, age read, hairstyle, body type, academy-era costume topology, insignia, weapons, and role.

Named characters: Mercedes, Annette, Ingrid
Character assets:
- `assets/characters/blue_lions/Mercedes/academy/selected.png`
- `assets/characters/blue_lions/Annette/academy/selected.png`
- `assets/characters/blue_lions/Ingrid/academy/selected.png`

Local identity plates:
- Mercedes: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Mercedes_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Mercedes/academy/selected.png`
- Annette: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Annette_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Annette/academy/selected.png`
- Ingrid: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ingrid_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Ingrid/academy/selected.png`

Location assets:
- `assets/locations/EP03/act01/MagdredWayFogRoad/MagdredWayFogRoad_reference.png`

Prop assets:
- none

Local asset proof sheet:
- `episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot019_local_asset_previs_proof_2026-07-31.jpg`

Local composited previs for this frame, used only for identity/layout reference:
- `episodes/EP03/storyboards/Shot019/key_frame.png`

Source/layout reference, not final image material:
- `episodes/EP03/source_refs/Shot019_source.png`

Blocked imagegen identity comparison:
- `episodes/EP03/production_system/reviews/identity_lock_comparison_2026-07-31/Shot019_identity_comparison_2026-07-31.jpg`
Rejected imagegen candidates, composition study only, do not reuse faces as identity truth:
- start: `episodes/EP03/storyboards/Shot019/start_frame_imagegen_candidate_2026-07-29.png`
- key: `episodes/EP03/storyboards/Shot019/key_frame_imagegen_candidate_2026-07-29.png`
- end: `episodes/EP03/storyboards/Shot019/end_frame_imagegen_candidate_2026-07-29.png`
- contact_sheet: `episodes/EP03/storyboards/Shot019/imagegen_frameset_contact_sheet_2026-07-29.jpg`

## Story And Frame Intent

Scene beat: 支援线稳住
Shot purpose: 让后排不是背景板，承担安全撤退与视野控制。
Frame role: key
Frame intent: Capture the decisive visible beat: Mercedes 引导伤员撤到雾外，Annette 用风压吹开一段雾。
Action peak: 让后排不是背景板，承担安全撤退与视野控制。
Blocking: Mercedes 引导伤员撤到雾外，Annette 用风压吹开一段雾。
Screen direction: Maintain Blue Lions moving from lower/right foreground toward upper/left fog ridge unless the cathedral/monastery scene is static.
Camera: 中景两人调度，雾层被短暂切开。
Audio anchor: Mercedes, in Japanese: こちらです！ Annette, in Japanese: 道が見えた！
Edit in/out: cut from Felix save / cut to Catherine charge

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
