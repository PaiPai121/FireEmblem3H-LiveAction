# EP02 Scene09 Asset Truth Audit

Date: 2026-07-17

## Summary

- Scene09 mock-battle storyboard structure is expanded, but production-grade video keyframe assets are not complete.
- Current Scene09 keyframes split into 12 legacy mismatched raster frames and 24 SVG layout drafts. None should be considered final AI-video input.
- Independent clean-context audience audit reached the same conclusion: Scene09 should not be sent to AI video generation until the start-frame chain is rebuilt.
- A production raster keyframe queue now exists: `episodes/EP02/mock_battle_keyframe_production_queue_2026-07-17.json`.
- The production queue now includes character asset locks and subframes: 36 main Scene09 shots, 115 subframes, and all 36 main shots reference concrete `assets/characters/.../selected.png` identity assets.
- Payloads now carry production gates: 36 Scene09 shots have production prompt files and target raster paths; 29 shots are explicitly blocked from video generation until real raster keyframes replace SVG/legacy sources.
- P0 reference boards now exist for the 14 highest-priority Scene09 shots: `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/reference_boards/index.html`.
- Character visual notes: Annette can be pushed slightly younger; Mercedes needs a more 18-year-old academy version; Manuela can be more glamorous/beautiful; Seteth should be less fashion-model handsome and more severe/clerical.
- Career/class variant coverage is uneven: Blue Lions and Black Eagles are relatively covered; Golden Deer, Ashen Wolves, merchants, and several Church/support characters are sparse.

## Scene09 Keyframe Truth

| Category | Count | Meaning |
|---|---:|---|
| `legacy_mismatch_needs_regeneration` | 12 | Old training-ground / old-script raster keyframes. Paths exist, but they do not match the current canon-map battle script. |
| `layout_draft_needs_production_raster` | 24 | SVG tactical diagrams / layout drafts. Useful for blocking, not usable as AI-video visual references. |
| production-ready raster keyframes | 0 | No Scene09 frame should currently be treated as final video-generation asset. |

## P0 Blockers Confirmed By Subagent Review

- 24 expanded Scene09 payloads still use `.svg` tactical maps as `image_path`. These files include labels, arrows, colored tactical regions, and readable layout text, so they are storyboards/blocking references only.
- 12 legacy Scene09 frames still point back to `episodes/EP02/generated/p1_mock_battle_v1/`, which visually reads as an old small training-yard setup rather than the current canon-map mock battle.
- `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/` does not yet exist, so the production queue has not produced final raster start frames.
- Shot028 is especially mismatched: it still presents Annette/Mercedes as a gentle support portrait beat, while the revised script needs them under side-pressure, shifting cover, and stabilizing the rear line.
- Manuela and Edelgard improvements exist as character assets, but Scene09 cannot show them reliably while their shots are still SVG or old group images.

## Required Next Pass For Scene09

Generate real raster keyframes into `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/` using the production queue. Promote to ready only after visual QA confirms:

- real cinematic image, not SVG/diagram;
- matches current Scene09 script and tactical geography;
- no small training-yard look;
- visible character identities and correct academy ages, using the listed `selected.png` character reference assets;
- main shot and subframes preserve face, hair, costume, and color continuity;
- usable as AI video first/key frame.

Production prep now available:

- prompt files: `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/prompts/`;
- P0 batch manifest: `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/p0_batch_manifest.md`;
- P0 character reference boards: `episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/reference_boards/index.html`.

## Character Visual Followups

| Character | Current issue | Priority | Action |
|---|---|---:|---|
| Annette academy | Acceptable but can read a bit too polished/mature; should feel closer to bright 18-year-old student. | P1 | Regenerate younger, more petite, less adult glam, still high-quality. |
| Mercedes academy | Reads more like early/mid-20s gentle adult than 18-year-old academy student. | P0 | Regenerate youthful 18-year-old version while preserving long blonde side ponytail and healer softness. |
| Manuela academy | Current youth-elegance version is usable, but can be more stage-star beautiful and should be anchored into Scene09 teacher-platform shots. | P1 | Regenerate or polish with confident former-opera-star beauty, still teacher-appropriate. |
| Seteth academy | Too fashion-model handsome / young; lacks severe church administrator authority. | P0 | Regenerate stricter, older, more ascetic, with short beard/mustache guardrails and less romantic-hero styling. |
| Edelgard academy | Updated red-pants full-body version is a clear improvement and should remain selected pending motion tests. | Done | Keep `assets/characters/black_eagles/Edelgard/academy/selected.png`. |

## Career Variant Coverage Snapshot

### Relatively covered characters, 5+ variants

- black_eagles/Bernadetta: academy, archer, bow_knight, pegasus_knight, sniper, war
- black_eagles/Caspar: academy, brigand, fighter, war, war_master, warrior
- black_eagles/Dorothea: academy, dancer, gremory, mage, war, warlock
- black_eagles/Edelgard: academy, armored_lord, emperor, mortal_savant, war, wyvern_lord
- black_eagles/Ferdinand: academy, cavalier, great_knight, paladin, war, wyvern_lord
- black_eagles/Hubert: academy, dark_bishop, dark_knight, dark_mage, mage, war
- black_eagles/Linhardt: academy, bishop, holy_knight, monk, priest, war
- black_eagles/Petra: academy, assassin, falcon_knight, thief, war, wyvern_rider
- blue_lions/Annette: academy, mage, monk, war, warlock, wyvern_rider
- blue_lions/Ashe: academy, archer, bow_knight, sniper, war, wyvern_rider
- blue_lions/Dedue: academy, armored_knight, fighter, fortress_knight, war, war_master
- blue_lions/Dimitri: academy, cavalier, great_lord, king, lord, paladin, war_broken
- blue_lions/Felix: academy, mercenary, mortal_savant, myrmidon, swordmaster, war
- blue_lions/Ingrid: academy, falcon_knight, paladin, pegasus_knight, soldier, war
- blue_lions/Mercedes: academy, bishop, gremory, monk, priest, war
- blue_lions/Sylvain: academy, cavalier, dark_knight, paladin, soldier, war
- golden_deer/Claude: academy, archer, barbarossa, leader, lord, war, wyvern_rider
- golden_deer/Hilda: academy, brigand, fighter, war, warrior, wyvern_lord

### Sparse characters, <=2 variants

- ashen_wolves/Balthus: academy, war
- ashen_wolves/Constance: academy, war
- ashen_wolves/Hapi: academy, war
- ashen_wolves/Yuri: academy, war
- black_eagles/Monica: selected, war
- church_of_seiros/Aelfric: concept, selected
- church_of_seiros/Alois: academy, war
- church_of_seiros/Catherine: academy, war
- church_of_seiros/Cyril: academy, war
- church_of_seiros/Flayn: academy, war
- church_of_seiros/Gatekeeper: legacy_ep01
- church_of_seiros/Gilbert: academy, war
- church_of_seiros/Hanneman: academy, war
- church_of_seiros/Jeritza: academy, war
- church_of_seiros/Manuela: academy, war
- church_of_seiros/Rhea: academy, war
- church_of_seiros/SeirosSoldier: selected
- church_of_seiros/Seteth: academy, war
- church_of_seiros/Shamir: academy, war
- church_of_seiros/Sitri: concept
- church_of_seiros/Tomas: legacy_ep01, selected
- golden_deer/Ignatz: academy, war
- golden_deer/Leonie: academy, war
- golden_deer/Lorenz: academy, war
- golden_deer/Lysithea: academy, war
- golden_deer/Marianne: academy, war
- golden_deer/Raphael: academy, war

## Existing Explicit Variant Gap List

The existing queue still lists 44 missing planned variants in `production/人物职业变体剩余待办_2026-07-16.md`, mainly Golden Deer, Ashen Wolves, and Anna. This is not a full all-classes-complete matrix; it is a scoped queue, so more gaps may exist if the target becomes every plausible class for every character.
