# Shot020 end_frame Identity-Locked Regeneration Prompt

Target output: `end_frame_identity_locked_regen_2026-08-01.png`
Decision state: frames_pending. This prompt does not approve the frame; it creates a candidate for independent visual QA.

## Identity Locks First

Use the local selected/reference assets as hard identity and wardrobe sources. Preserve exact face read, age read, hairstyle, body type, academy-era costume topology, insignia, weapons, and role.

Named characters: Catherine, Byleth, Ashe
Character assets:
- `assets/characters/church_of_seiros/Catherine/academy/selected.png`
- `assets/characters/protagonist/Byleth/professor/selected.png`
- `assets/characters/blue_lions/Ashe/academy/selected.png`

Local identity plates:
- Catherine: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_church_of_seiros_Catherine_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/church_of_seiros/Catherine/academy/selected.png`
- Byleth: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg` from `assets/characters/protagonist/Byleth/professor/selected.png`
- Ashe: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Ashe/academy/selected.png`

Location assets:
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`

Prop assets:
- `assets/props/shared/hero_relics/hero_relics_reference.png`

Local asset proof sheet:
- `episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot020_local_asset_previs_proof_2026-07-31.jpg`

Local composited previs for this frame, used only for identity/layout reference:
- `episodes/EP03/storyboards/Shot020/end_frame.png`

Source/layout reference, not final image material:
- `episodes/EP03/source_refs/Shot020_source.png`


## Story And Frame Intent

Scene beat: Catherine 破雾
Shot purpose: 表现 Catherine 是教会王牌，也制造学生对力量的震动。
Frame role: end
Frame intent: Land on the state needed for the next cut: cut to Lonato silhouette.
Action peak: 表现 Catherine 是教会王牌，也制造学生对力量的震动。
Blocking: Catherine 从侧翼切入，雷光照出雾里的敌阵，但不造成血腥屠杀。
Screen direction: Maintain Blue Lions moving from lower/right foreground toward upper/left fog ridge unless the cathedral/monastery scene is static.
Camera: 手持跟进到雷光定格。
Audio anchor: Thunder; the rebel line is forced apart. No spoken dialogue.
Edit in/out: cut from support line / cut to Lonato silhouette

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
