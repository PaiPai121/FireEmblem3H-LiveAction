# EP02 Scene09 Video Preflight Package

Date: 2026-07-19

Purpose: prepare the high-risk Scene09 shots for video generation without starting direct video generation yet.

Policy: resolve the blocking still issues and run these high-risk shots first. Do not run the full Scene09 video batch until this preflight batch passes motion QA.

## First Video Batch

| Order | Shot | Duration | Dialogue Anchor | Risk | V2 Prompt |
| --- | --- | ---: | --- | --- | --- |
| 1 | Shot029 Wide Flank Setup Lance Monitor | 12s | Sylvain: '也就是说，我们是被人切后路之前的后路。' | The still is usable as a wide flank setup, but Ingrid's weapon silhouette can read short-blade if animated too close. Use Shot029B for the detailed Golden Deer flank highlight. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot029_video_prompt_v2.md) |
| 2 | Shot029B Hilda And Claude Thicket Pressure | 9s | Sylvain: 'Claude 可真会挑时候。' | Start/key were regenerated after the Hilda youth identity v4 replacement. Motion must preserve academy-age Hilda and the west-thicket pressure logic. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot029B_video_prompt_v2.md) |
| 3 | Shot027 Ashe Archer Support | 10s | Ashe, under breath: '明白。' | Ashe can drift into portrait posing or aim away from the west/center threat once animated. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot027_video_prompt_v2.md) |
| 4 | Shot027B Named Black Eagles Enemy Wave | 8s | No foreground dialogue. | Start/key were regenerated after creative review rejected the prior anonymous crowd / unstable lookalike enemy wave. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot027B_video_prompt_v2.md) |
| 5 | Shot032 Dedue Guards Dimitri | 12s | Dimitri: '杜笃--' | This is the signature warrior-healer beat; motion must read as shield-line recovery, not medical aftermath or offensive magic. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot032_video_prompt_v2.md) |
| 6 | Shot030C Support Route Cut | 8s | Mercedes: '别停在空地上。' | Start/key were regenerated to remove Mercedes staff/focus risk. Motion must preserve empty-hand support magic from cover. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot030C_video_prompt_v2.md) |
| 7 | Shot032C Black Eagles Counterpressure | 9s | Edelgard: 'Hubert。' | Start/key were regenerated to strengthen the Black Eagles high-light while preserving Golden Deer competence and Hilda youth identity v4. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot032C_video_prompt_v2.md) |
| 8 | Shot033B Byleth Command Reaction | 8s | Byleth: '现在。切老师。' | Start/key were regenerated after creative review rejected the prior Byleth camera-facing point pose and missing Blue Lions execution response. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot033B_video_prompt_v2.md) |
| 9 | Shot033C Ashe Suppresses Hanneman | 8s | Hanneman: '哦？先封我的角度。' | The stills pass, but video can turn the suppression into generic melee or make the line-of-fire ambiguous. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot033C_video_prompt_v2.md) |
| 10 | Shot033D Ingrid Routes Manuela Off Tile | 8s | Manuela: '真是一点都不温柔的学生。' | Keyframe was regenerated after creative review found Ingrid passive and Manuela attacking Sylvain instead of being routed off the heal tile. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot033D_video_prompt_v2.md) |
| 11 | Shot032D Two Adjacent Battle Lines | 10s | No foreground dialogue. Use distant overlapping calls only. | The strategic read depends on three readable lanes; video drift can collapse it into an unmotivated crowd. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot032D_video_prompt_v2.md) |
| 12 | Shot032E First Three-Way Entanglement | 10s | Byleth: '不要追金鹿。把黑鹫往他们那边压。' | This is the tactical exploit: Blue Lions win by using Golden Deer disruption, not by chasing Golden Deer or raw overpowering. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot032E_video_prompt_v2.md) |
| 13 | Shot034D Byleth Interrupts Hanneman | 9s | Hanneman: '判断得很好。' | Keyframe was regenerated to avoid bare-hand/high-five ambiguity. Motion must keep the visible sheathed-sword wrist/forearm tap. | [prompt](episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/video_preflight_v2/Shot034D_video_prompt_v2.md) |

## Shared Locks

- Use start/key stills from episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/ as visual anchors.
- Background master: assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png.
- Coordinate lock: north is screen top; Blue Lions move lower-right to center/upper-right; Black Eagles resist from north/right-depth toward center/southwest; Golden Deer enter from west/screen-left and pressure both sides.
- Weapon locks: Dimitri long training lance; Dedue large padded shield; Felix wooden sword; Sylvain and Ingrid training lances; Ashe bow; Mercedes empty-hand white healing only; Annette wind magic/book focus; Hubert magic hand/book focus; Ferdinand lance; Claude bow; Hilda axe; Hanneman spell focus; Manuela white magic.
- Academy-age lock: all named students must read as academy-age teenagers/late teens, not mature adults, adult models, war-phase veterans, or teacher-age characters.
- Competitive dignity lock: Black Eagles and Golden Deer must look competent and dangerous. Blue Lions win narrowly by objective timing, not because the other houses collapse or act foolishly.
- Hilda lock: use assets/characters/golden_deer/Hilda/academy/selected.png youth identity v4 as the visual authority; reject older/mature Hilda faces in any Hilda-visible shot.
- No character should rotate to face camera unless the camera is explicitly positioned on the enemy side. If a threat is ahead or in depth, defenders must face that threat.
- Supervised academy mock battle only: no blood, no visible wounds, no lethal strikes, no collapse, no gore.

## Batch Pass Rule

A generated clip passes only if the named shot-specific failure criteria are all false and the clip can cut from the prior shot into the next shot without reversing screen direction.

## Recommended Generation Order

1. Verify the 2026-07-20 creative replacements first in low-cost motion: Shot027B / named Black Eagles wave, Shot029 / Sylvain-Ingrid long-lance flank setup, Shot033B / Byleth command reaction, Shot033C / Ashe arrow-to-step suppression, Shot033D / Ingrid routes Manuela off tile.
2. Verify earlier replaced stills in low-cost motion: Shot029B / Hilda youth, Shot030C / Mercedes empty hands, Shot032C / Black Eagles counterpressure, Shot034D / Byleth sheathed-sword wrist tap.
3. Shot032: lock the signature Dedue/Mercedes healing beat with low-cost motion only.
4. Shot027 and Shot033C: validate bow-line direction and nonlethal suppression.
5. Shot032D and Shot032E: validate that three-way motion remains tactical, not a crowd pile, and that Hilda uses youth identity v4 when visible.
6. Only after these pass, run the remaining Scene09 shots in timeline order.
