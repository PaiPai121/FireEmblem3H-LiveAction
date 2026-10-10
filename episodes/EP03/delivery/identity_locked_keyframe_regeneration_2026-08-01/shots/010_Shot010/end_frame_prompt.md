# Shot010 end_frame Identity-Locked Regeneration Prompt

Target output: `end_frame_identity_locked_regen_2026-08-01.png`
Decision state: frames_pending. This prompt does not approve the frame; it creates a candidate for independent visual QA.

## Identity Locks First

Use the local selected/reference assets as hard identity and wardrobe sources. Preserve exact face read, age read, hairstyle, body type, academy-era costume topology, insignia, weapons, and role.

Named characters: Byleth, Dimitri, Dedue, Ingrid
Character assets:
- `assets/characters/protagonist/Byleth/professor/selected.png`
- `assets/characters/blue_lions/Dimitri/academy/selected.png`
- `assets/characters/blue_lions/Dedue/academy/selected.png`
- `assets/characters/blue_lions/Ingrid/academy/selected.png`

Local identity plates:
- Byleth: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg` from `assets/characters/protagonist/Byleth/professor/selected.png`
- Dimitri: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Dimitri/academy/selected.png`
- Dedue: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dedue_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Dedue/academy/selected.png`
- Ingrid: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ingrid_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Ingrid/academy/selected.png`

Location assets:
- `assets/locations/EP03/act01/MagdredWayFogRoad/MagdredWayFogRoad_reference.png`

Prop assets:
- none

Local asset proof sheet:
- `episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot010_local_asset_previs_proof_2026-07-31.jpg`

Local composited previs for this frame, used only for identity/layout reference:
- `episodes/EP03/storyboards/Shot010/end_frame.png`

Source/layout reference, not final image material:
- `episodes/EP03/source_refs/Shot010_source.png`

Blocked imagegen identity comparison:
- `episodes/EP03/production_system/reviews/identity_lock_comparison_2026-07-31/Shot010_identity_comparison_2026-07-31.jpg`
Rejected imagegen candidates, composition study only, do not reuse faces as identity truth:
- start: `episodes/EP03/storyboards/Shot010/start_frame_imagegen_candidate_2026-07-29.png`
- key: `episodes/EP03/storyboards/Shot010/key_frame_imagegen_candidate_2026-07-29.png`
- end: `episodes/EP03/storyboards/Shot010/end_frame_imagegen_candidate_2026-07-29.png`
- contact_sheet: `episodes/EP03/storyboards/Shot010/imagegen_frameset_contact_sheet_2026-07-29.jpg`

## Story And Frame Intent

Scene beat: 马格德雷德雾道
Shot purpose: 建立战场核心危险：能见度和误判。
Frame role: end
Frame intent: Land on the state needed for the next cut: cut to village sign.
Action peak: 建立战场核心危险：能见度和误判。
Blocking: 灰白雾道，断树、泥水、远处村庄烟线，队伍成两列前进。
Screen direction: Maintain Blue Lions moving from lower/right foreground toward upper/left fog ridge unless the cathedral/monastery scene is static.
Camera: 长焦压缩，让距离变短、威胁变近。
Audio anchor: Ingrid, in Japanese: 霧が濃すぎるわ。 Dedue, in Japanese: 足音を聞け。
Edit in/out: dissolve from monastery road / cut to village sign

## Generation Direction

Create a cinematic live-action keyframe that integrates the local character identities into the EP03 environment with coherent lighting, scale, depth, and camera perspective. The image should feel like a film still, but it must not redesign any named character, costume, weapon, prop, or story beat.

Use restrained performance: show intention through eyeline, posture, breath, hand tension, and small facial changes. Avoid theatrical reaction faces.

## Must Preserve

- Exact local selected.png character identity and academy-era wardrobe topology.
- Exact local identity plate face crop, hair silhouette, body proportion, costume topology, and full-body outline for every named character.
- EP03 fog/cathedral geography, shot scale, and screen direction.
- The declared end frame intent and the start/key/end motion chain.
- Non-graphic, duty-focused, tragic tone.

## Reject If

- game UI or subtitles appear
- academy identities drift
- Lonato becomes a generic villain
- Ashe directly executes Lonato
- Any generated face no longer matches the listed local selected/reference assets.
- The image looks like a game screenshot, anime frame, UI capture, or generic fantasy cosplay.
- The shot adds new named characters, random soldiers as named-role substitutes, modern objects, subtitles, captions, or visible UI.
