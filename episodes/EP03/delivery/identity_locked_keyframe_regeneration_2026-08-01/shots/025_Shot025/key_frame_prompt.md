# Shot025 key_frame Identity-Locked Regeneration Prompt

Target output: `key_frame_identity_locked_regen_2026-08-01.png`
Decision state: frames_pending. This prompt does not approve the frame; it creates a candidate for independent visual QA.

## Identity Locks First

Use the local selected/reference assets as hard identity and wardrobe sources. Preserve exact face read, age read, hairstyle, body type, academy-era costume topology, insignia, weapons, and role.

Named characters: Dimitri, Dedue, Sylvain, Ingrid, Mercedes, Annette
Character assets:
- `assets/characters/blue_lions/Dimitri/academy/selected.png`
- `assets/characters/blue_lions/Dedue/academy/selected.png`
- `assets/characters/blue_lions/Sylvain/academy/selected.png`
- `assets/characters/blue_lions/Ingrid/academy/selected.png`
- `assets/characters/blue_lions/Mercedes/academy/selected.png`
- `assets/characters/blue_lions/Annette/academy/selected.png`

Local identity plates:
- Dimitri: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Dimitri/academy/selected.png`
- Dedue: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dedue_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Dedue/academy/selected.png`
- Sylvain: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Sylvain_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Sylvain/academy/selected.png`
- Ingrid: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ingrid_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Ingrid/academy/selected.png`
- Mercedes: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Mercedes_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Mercedes/academy/selected.png`
- Annette: `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Annette_academy_selected_identity_plate_2026-08-01.jpg` from `assets/characters/blue_lions/Annette/academy/selected.png`

Location assets:
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`

Prop assets:
- none

Local asset proof sheet:
- `episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot025_local_asset_previs_proof_2026-07-31.jpg`

Local composited previs for this frame, used only for identity/layout reference:
- `episodes/EP03/storyboards/Shot025/key_frame.png`

Source/layout reference, not final image material:
- `episodes/EP03/source_refs/Shot025_source.png`


## Story And Frame Intent

Scene beat: 青狮两翼推进
Shot purpose: 展示学生在 EP2 模拟战后学会真实协同。
Frame role: key
Frame intent: Capture the decisive visible beat: Dedue/Dimitri 正面压住，Ingrid/Sylvain 侧翼绕雾，Mercedes/Annette 保持后线。
Action peak: 展示学生在 EP2 模拟战后学会真实协同。
Blocking: Dedue/Dimitri 正面压住，Ingrid/Sylvain 侧翼绕雾，Mercedes/Annette 保持后线。
Screen direction: Maintain Blue Lions moving from lower/right foreground toward upper/left fog ridge unless the cathedral/monastery scene is static.
Camera: 高位斜俯拍，雾中灯点标出队形。
Audio anchor: Orders, footsteps, and fog-lantern impacts. No spoken dialogue.
Edit in/out: cut from command / cut to Ashe aim

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
