# Shot028 start_frame Identity-Locked Regeneration Prompt

Target output: `start_frame_identity_locked_regen_2026-08-01.png`
Decision state: frames_pending. This prompt does not approve the frame; it creates a candidate for independent visual QA.

## Identity Locks First

Use the local selected/reference assets as hard identity and wardrobe sources. Preserve exact face read, age read, hairstyle, body type, academy-era costume topology, insignia, weapons, and role.

Named characters: Byleth, Catherine, Lonato
Character assets:
- `assets/characters/protagonist/Byleth/professor/selected.png`
- `assets/characters/church_of_seiros/Catherine/academy/selected.png`
- `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`

Local identity plates:
- Byleth: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg` from `assets/characters/protagonist/Byleth/professor/selected.png`
- Catherine: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_church_of_seiros_Catherine_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/church_of_seiros/Catherine/academy/selected.png`
- Lonato: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_kingdom_Lonato_legacy_ep01_selected_identity_plate_2026-08-01.jpg` from `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`

Location assets:
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`

Prop assets:
- `assets/props/shared/hero_relics/hero_relics_reference.png`

Local asset proof sheet:
- `episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot028_local_asset_previs_proof_2026-07-31.jpg`

Local composited previs for this frame, used only for identity/layout reference:
- `episodes/EP03/storyboards/Shot028/start_frame.png`

Source/layout reference, not final image material:
- `episodes/EP03/source_refs/Shot028_source.png`


## Story And Frame Intent

Scene beat: 最后压制
Shot purpose: 结束战斗，同时把学生从处决中心移开。
Frame role: start
Frame intent: Establish the pre-action state for 最后压制; preserve geography from the source reference and keep the viewer's first read clear.
Action peak: 结束战斗，同时把学生从处决中心移开。
Blocking: Byleth 与 Catherine 从两侧进入，Catherine 打掉武器，Byleth 用剑背压住 Lonato。
Screen direction: Maintain Blue Lions moving from lower/right foreground toward upper/left fog ridge unless the cathedral/monastery scene is static.
Camera: 双向交叉剪辑，动作快但清楚。
Audio anchor: Metal falls; the fog goes briefly quiet. No spoken dialogue.
Edit in/out: cut from arrow stop / cut to Lonato collapse

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
