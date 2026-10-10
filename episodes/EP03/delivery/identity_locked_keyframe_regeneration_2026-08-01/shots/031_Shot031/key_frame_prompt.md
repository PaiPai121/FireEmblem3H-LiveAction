# Shot031 key_frame Identity-Locked Regeneration Prompt

Target output: `key_frame_identity_locked_regen_2026-08-01.png`
Decision state: frames_pending. This prompt does not approve the frame; it creates a candidate for independent visual QA.

## Identity Locks First

Use the local selected/reference assets as hard identity and wardrobe sources. Preserve exact face read, age read, hairstyle, body type, academy-era costume topology, insignia, weapons, and role.

Named characters: Rhea, Seteth, Byleth, Dimitri, Ashe
Character assets:
- `assets/characters/church_of_seiros/Rhea/academy/selected.png`
- `assets/characters/church_of_seiros/Seteth/academy/selected.png`
- `assets/characters/protagonist/Byleth/professor/selected.png`
- `assets/characters/blue_lions/Dimitri/academy/selected.png`
- `assets/characters/blue_lions/Ashe/academy/selected.png`

Local identity plates:
- Rhea: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_church_of_seiros_Rhea_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/church_of_seiros/Rhea/academy/selected.png`
- Seteth: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_church_of_seiros_Seteth_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/church_of_seiros/Seteth/academy/selected.png`
- Byleth: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg` from `assets/characters/protagonist/Byleth/professor/selected.png`
- Dimitri: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Dimitri/academy/selected.png`
- Ashe: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Ashe/academy/selected.png`

Location assets:
- `assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png`

Prop assets:
- none

Local asset proof sheet:
- `episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot031_local_asset_previs_proof_2026-07-31.jpg`

Local composited previs for this frame, used only for identity/layout reference:
- `episodes/EP03/storyboards/Shot031/key_frame.png`

Source/layout reference, not final image material:
- `episodes/EP03/source_refs/Shot031_source.png`


## Story And Frame Intent

Scene beat: 回到 Rhea 面前
Shot purpose: 教会秩序重新覆盖战场创伤。
Frame role: key
Frame intent: Capture the decisive visible beat: 大教堂内，Rhea 接受报告，学生站在下方，衣角仍有雾水泥痕。
Action peak: 教会秩序重新覆盖战场创伤。
Blocking: 大教堂内，Rhea 接受报告，学生站在下方，衣角仍有雾水泥痕。
Screen direction: Maintain Blue Lions moving from lower/right foreground toward upper/left fog ridge unless the cathedral/monastery scene is static.
Camera: 冷静中轴构图，和 Shot003 呼应。
Audio anchor: Rhea, in Japanese: ご苦労さまでした。あなた方は信仰の安寧を守りました。
Edit in/out: cut from fog field / cut to execution order

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
