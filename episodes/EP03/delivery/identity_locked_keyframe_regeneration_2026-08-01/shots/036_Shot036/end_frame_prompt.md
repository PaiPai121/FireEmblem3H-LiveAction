# Shot036 end_frame Identity-Locked Regeneration Prompt

Target output: `end_frame_identity_locked_regen_2026-08-01.png`
Decision state: frames_pending. This prompt does not approve the frame; it creates a candidate for independent visual QA.

## Identity Locks First

Use the local selected/reference assets as hard identity and wardrobe sources. Preserve exact face read, age read, hairstyle, body type, academy-era costume topology, insignia, weapons, and role.

Named characters: Byleth, Sothis, Rhea
Character assets:
- `assets/characters/protagonist/Byleth/professor/selected.png`
- `assets/characters/divine/Sothis/dream/legacy_ep01/candidate_03.png`
- `assets/characters/church_of_seiros/Rhea/academy/selected.png`

Local identity plates:
- Byleth: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg` from `assets/characters/protagonist/Byleth/professor/selected.png`
- Sothis: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/divine_Sothis_dream_legacy_ep01_candidate_03_identity_plate_2026-08-01.jpg` from `assets/characters/divine/Sothis/dream/legacy_ep01/candidate_03.png`
- Rhea: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_church_of_seiros_Rhea_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/church_of_seiros/Rhea/academy/selected.png`

Location assets:
- `assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png`

Prop assets:
- `assets/props/shared/sword_of_creator/selected.png`

Local asset proof sheet:
- `episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot036_local_asset_previs_proof_2026-07-31.jpg`

Local composited previs for this frame, used only for identity/layout reference:
- `episodes/EP03/storyboards/Shot036/end_frame.png`

Source/layout reference, not final image material:
- `episodes/EP03/source_refs/Shot036_source.png`


## Story And Frame Intent

Scene beat: 章末圣墓阴影
Shot purpose: 收束并抛出下章：教会让学生看见制裁，也准备让他们看见更深秘密。
Frame role: end
Frame intent: Land on the state needed for the next cut: cut to black.
Action peak: 收束并抛出下章：教会让学生看见制裁，也准备让他们看见更深秘密。
Blocking: Byleth 独自经过圣堂门口，Sothis 绿光一闪；远处 Rhea 的身影停在圣墓方向。
Screen direction: Maintain Blue Lions moving from lower/right foreground toward upper/left fog ridge unless the cathedral/monastery scene is static.
Camera: 长廊长焦，最后切黑。
Audio anchor: Sothis, in Japanese: そなたは、あの者を信じるのか？
Edit in/out: cut from Dimitri night / cut to black

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
