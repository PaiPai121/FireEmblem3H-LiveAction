# Shot016 start_frame Identity-Locked Regeneration Prompt

Target output: `start_frame_identity_locked_regen_2026-08-01.png`
Decision state: frames_pending. This prompt does not approve the frame; it creates a candidate for independent visual QA.

## Identity Locks First

Use the local selected/reference assets as hard identity and wardrobe sources. Preserve exact face read, age read, hairstyle, body type, academy-era costume topology, insignia, weapons, and role.

Named characters: Dimitri, Byleth, Dedue
Character assets:
- `assets/characters/blue_lions/Dimitri/academy/selected.png`
- `assets/characters/protagonist/Byleth/professor/selected.png`
- `assets/characters/blue_lions/Dedue/academy/selected.png`

Local identity plates:
- Dimitri: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Dimitri/academy/selected.png`
- Byleth: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg` from `assets/characters/protagonist/Byleth/professor/selected.png`
- Dedue: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dedue_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Dedue/academy/selected.png`

Location assets:
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`

Prop assets:
- none

Local asset proof sheet:
- `episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot016_local_asset_previs_proof_2026-07-31.jpg`

Local composited previs for this frame, used only for identity/layout reference:
- `episodes/EP03/storyboards/Shot016/start_frame.png`

Source/layout reference, not final image material:
- `episodes/EP03/source_refs/Shot016_source.png`

Blocked imagegen identity comparison:
- `episodes/EP03/production_system/reviews/identity_lock_comparison_2026-07-31/Shot016_identity_comparison_2026-07-31.jpg`
Rejected imagegen candidates, composition study only, do not reuse faces as identity truth:
- start: `episodes/EP03/storyboards/Shot016/start_frame_imagegen_candidate_2026-07-29.png`
- key: `episodes/EP03/storyboards/Shot016/key_frame_imagegen_candidate_2026-07-29.png`
- end: `episodes/EP03/storyboards/Shot016/end_frame_imagegen_candidate_2026-07-29.png`
- contact_sheet: `episodes/EP03/storyboards/Shot016/imagegen_frameset_contact_sheet_2026-07-29.jpg`

## Story And Frame Intent

Scene beat: Dimitri 克制锋芒
Shot purpose: 展示 Dimitri 已有危险力量，但仍听从 Byleth。
Frame role: start
Frame intent: Establish the pre-action state for Dimitri 克制锋芒; preserve geography from the source reference and keep the viewer's first read clear.
Action peak: 展示 Dimitri 已有危险力量，但仍听从 Byleth。
Blocking: Dimitri 一枪逼退敌人，差点追深，Byleth 抬手，他停住。
Screen direction: Maintain Blue Lions moving from lower/right foreground toward upper/left fog ridge unless the cathedral/monastery scene is static.
Camera: 低位侧跟，停顿时静止一拍。
Audio anchor: Byleth, in Japanese: 戦線を守れ。 Dimitri, in Japanese: 承知しました。
Edit in/out: cut from rebel pressure / cut to Ashe sees sigil

## Generation Direction

Create a cinematic live-action keyframe that integrates the local character identities into the EP03 environment with coherent lighting, scale, depth, and camera perspective. The image should feel like a film still, but it must not redesign any named character, costume, weapon, prop, or story beat.

Use restrained performance: show intention through eyeline, posture, breath, hand tension, and small facial changes. Avoid theatrical reaction faces.

## Must Preserve

- Exact local selected.png character identity and academy-era wardrobe topology.
- Exact local identity plate face crop, hair silhouette, body proportion, costume topology, and full-body outline for every named character.
- EP03 fog/cathedral geography, shot scale, and screen direction.
- The declared start frame intent and the start/key/end motion chain.
- Non-graphic, duty-focused, tragic tone.

## Reject If

- game UI or subtitles appear
- academy identities drift
- Lonato becomes a generic villain
- Ashe directly executes Lonato
- Any generated face no longer matches the listed local selected/reference assets.
- The image looks like a game screenshot, anime frame, UI capture, or generic fantasy cosplay.
- The shot adds new named characters, random soldiers as named-role substitutes, modern objects, subtitles, captions, or visible UI.
